/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');
const dayjs = require('dayjs-with-plugins');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const assertAllowedMongoQuery = require('#helpers/assert-no-blocked-mongo-operators');
const getAllowedSort = require('#helpers/get-allowed-sort');
const { transferDomain } = require('#helpers/transfer-domain');
const { Users, Domains, Emails } = require('#models');

const DOMAIN_SORT_FIELDS = new Set([
  'name',
  'is_global',
  'alias_count',
  'plan',
  'has_mx_record',
  'has_txt_record',
  'has_dkim_record',
  'has_spf_record',
  'has_dmarc_record',
  'has_smtp',
  'has_newsletter',
  'smtp_suspended_sent_at',
  'smtp_count',
  'max_recipients_per_alias',
  'created_at'
]);

async function list(ctx) {
  let query = {};

  // Filter based on regex name
  if (isSANB(ctx.query.name)) {
    if (isEmail(ctx.query.name)) {
      const ids = await Users.distinct('_id', {
        email: ctx.query.name,
        [config.userFields.hasVerifiedEmail]: true,
        [config.userFields.isBanned]: false
      });
      query.members = {
        $elemMatch: {
          user: { $in: ids },
          group: 'admin'
        }
      };
    } else {
      query.$or = [
        {
          name: { $regex: ctx.query.name, $options: 'i' }
        },
        {
          name: { $regex: _.escapeRegExp(ctx.query.name), $options: 'i' }
        }
      ];
    }
  }

  // FWD-01-010: mongodb_query is validated by assertAllowedMongoQuery() below,
  // which whitelists operators and caps size/depth regardless of transport, so
  // it is safe to accept from either the POST body (search form submit) or the
  // GET query string. Query-string support is required for pagination links,
  // sort headers, and cross-links (e.g. /admin/users?mongodb_query=...), which
  // are GET requests; without it those links reload the page but drop the
  // filter. The POST body takes precedence when both are present.
  const mongodbQueryRaw =
    ctx.request.body && isSANB(ctx.request.body.mongodb_query)
      ? ctx.request.body.mongodb_query
      : isSANB(ctx.query.mongodb_query)
      ? ctx.query.mongodb_query
      : null;

  if (mongodbQueryRaw) {
    try {
      query = JSON.parse(mongodbQueryRaw);
      if (
        !query ||
        typeof query !== 'object' ||
        Array.isArray(query) ||
        Object.keys(query).length === 0
      ) {
        throw new Error('Query was not parsed properly');
      }

      assertAllowedMongoQuery(query);
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  const [domains, itemCount] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Domains.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(getAllowedSort(ctx.query.sort, DOMAIN_SORT_FIELDS, '-created_at'))
      .populate('members.user', 'id email')
      .lean()
      .exec(),
    Domains.countDocuments(query)
  ]);

  // Attach today's SMTP sent count to each domain for display
  const startOfDay = dayjs().startOf('day').toDate();
  await Promise.all(
    domains.map(async (domain) => {
      domain.smtp_count = await Emails.countDocuments({
        domain: domain._id,
        created_at: { $gte: startOfDay }
      });
    })
  );

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html')) {
    return ctx.render('admin/domains', {
      domains,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/domains/_table', {
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function update(ctx) {
  const domain = await Domains.findById(ctx.params.id);

  if (!domain) {
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));
  }

  const { body } = ctx.request;

  // Save max recipients or if null keep the same
  domain.max_recipients_per_alias =
    body.max_recipients_per_alias || domain.max_recipients_per_alias;

  // Has_smtp
  const hadSMTPAccess = Boolean(domain.has_smtp);
  if (isSANB(body.has_smtp)) {
    domain.has_smtp = boolean(body.has_smtp);
  }

  // Has_newsletter
  const hadNewsletterAccess = Boolean(domain.has_newsletter);
  if (isSANB(body.has_newsletter)) {
    if (!hadSMTPAccess) {
      throw Boom.forbidden(ctx.translateError('DOMAIN_REQUIRES_SMTP_ACCESS'));
    }

    domain.has_newsletter = boolean(body.has_newsletter);
  }

  // Smtp_suspended_sent_at
  const hadSMTPSuspension = _.isDate(domain.smtp_suspended_sent_at);
  if (isSANB(body.smtp_suspended_sent_at)) {
    domain.smtp_suspended_sent_at = boolean(body.smtp_suspended_sent_at)
      ? new Date()
      : undefined;
    domain.is_smtp_suspended = boolean(domain.smtp_suspended_sent_at);
  }

  domain.locale = ctx.locale;
  domain.resolver = ctx.resolver;

  //
  // Set audit metadata for domain update tracking
  // Mark as admin change to protect admin privacy from end users
  // (admin email, IP, and user-agent will NOT be exposed in notifications)
  //
  domain.__audit_metadata = {
    user: ctx.state.user,
    isAdmin: true
  };

  await domain.save();

  // Clear cache for max forwarding addresses (used by SMTP)
  if (domain.plan !== 'free' && domain.has_mx_record && domain.has_txt_record) {
    ctx.client
      .del(`v1_max_forwarded:${domain.name}`)
      .then()
      .catch((err) => ctx.logger.fatal(err));
  }

  // Send an email to all admins of the domain
  const object = await Domains.getToAndMajorityLocaleByDomain(domain);

  //
  // NOTE: we don't try/catch around emailHelper so admins will know to manually email users
  //

  //
  // email domain admins if we suspended or removed suspension for SMTP
  //
  if (!hadSMTPSuspension && _.isDate(domain.smtp_suspended_sent_at)) {
    const subject = i18n.translate(
      'DOMAIN_IS_ADMIN_SUSPENDED',
      object.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: object.locale
      }
    });
  } else if (hadSMTPSuspension && !_.isDate(domain.smtp_suspended_sent_at)) {
    const subject = i18n.translate(
      'DOMAIN_SUSPENSION_REMOVED',
      object.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        // Bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: object.locale
      }
    });
  }

  //
  // email domain admins if we enabled or disabled their SMTP access
  //
  if (!hadSMTPAccess && domain.has_smtp) {
    const subject = i18n.translate(
      'EMAIL_SMTP_ACCESS_ENABLED_SUBJECT',
      object.locale,
      domain.name
    );
    const message = i18n.translate(
      'EMAIL_SMTP_ACCESS_ENABLED_MESSAGE',
      object.locale,
      domain.name,
      `${config.urls.web}/${
        object.locale
      }/my-account/domains/${punycode.toASCII(domain.name)}/verify-smtp`
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        // Bcc: config.email.message.from,
        subject
      },
      locals: {
        message,
        locale: object.locale
      }
    });
  } else if (hadSMTPAccess && !domain.has_smtp) {
    const subject = i18n.translate(
      'EMAIL_SMTP_ACCESS_DISABLED',
      object.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: object.locale
      }
    });
  }

  if (!hadNewsletterAccess && domain.has_newsletter) {
    const subject = i18n.translate(
      'EMAIL_NEWSLETTER_ACCESS_ENABLED_SUBJECT',
      object.locale,
      domain.name
    );
    const message = i18n.translate(
      'EMAIL_NEWSLETTER_ACCESS_ENABLED_MESSAGE',
      object.locale,
      domain.name,
      `${config.urls.web}/${object.locale}/my-account/domains/${domain.name}/verify-smtp`
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        // Bcc: config.email.message.from,
        subject
      },
      locals: {
        message,
        locale: object.locale
      }
    });
  } else if (hadNewsletterAccess && !domain.has_newsletter) {
    const subject = i18n.translate(
      'EMAIL_NEWSLETTER_ACCESS_DISABLED',
      object.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: object.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: object.locale
      }
    });
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) {
    ctx.redirect('back');
  } else {
    ctx.body = { reloadPage: true };
  }
}

async function transfer(ctx) {
  const {
    domain: domainName,
    original_owner_email: originalOwnerEmail,
    email,
    confirmation
  } = ctx.request.body;

  if (
    !isSANB(domainName) ||
    !isSANB(originalOwnerEmail) ||
    !isSANB(email) ||
    !isSANB(confirmation)
  ) {
    throw Boom.badRequest(
      ctx.translateError('DOMAIN_TRANSFER_FIELDS_REQUIRED')
    );
  }

  let normalizedDomain;
  try {
    normalizedDomain = punycode.toUnicode(domainName.trim().toLowerCase());
  } catch {
    throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));
  }

  if (normalizedDomain !== confirmation.trim().toLowerCase()) {
    throw Boom.badRequest(
      ctx.translateError('DOMAIN_TRANSFER_CONFIRMATION_REQUIRED')
    );
  }

  if (!isEmail(originalOwnerEmail) || !isEmail(email)) {
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));
  }

  const [originalOwner, user] = await Promise.all([
    Users.findOne({ email: originalOwnerEmail.trim().toLowerCase() }),
    Users.findOne({ email: email.trim().toLowerCase() })
  ]);

  if (!originalOwner) {
    throw Boom.notFound(
      ctx.translateError('DOMAIN_TRANSFER_ORIGINAL_OWNER_NOT_FOUND')
    );
  }

  if (!user) {
    throw Boom.notFound(ctx.translateError('DOMAIN_TRANSFER_TARGET_NOT_FOUND'));
  }

  if (originalOwner._id.toString() === user._id.toString()) {
    throw Boom.badRequest(
      ctx.translateError('DOMAIN_TRANSFER_TARGET_SAME_AS_ORIGINAL_OWNER')
    );
  }

  const domains = await Domains.find({
    name: normalizedDomain,
    members: {
      $elemMatch: { user: originalOwner._id, group: 'admin' }
    }
  })
    .limit(2)
    .exec();

  if (domains.length === 0) {
    throw Boom.notFound(
      ctx.translateError('DOMAIN_TRANSFER_ORIGINAL_OWNER_MISMATCH')
    );
  }

  if (domains.length > 1) {
    throw Boom.conflict(ctx.translateError('DOMAIN_TRANSFER_AMBIGUOUS'));
  }

  const [domain] = domains;
  const lockKey = `domain_transfer:${domain._id}`;
  const lockToken = crypto.randomUUID();
  let lockAcquired;

  try {
    lockAcquired = await ctx.client.set(
      lockKey,
      lockToken,
      'PX',
      ms('10m'),
      'NX'
    );
  } catch (err) {
    ctx.logger.fatal(err, {
      domain: domain._id,
      event: 'domain_transfer_lock_acquisition'
    });
    throw Boom.serverUnavailable(
      ctx.translateError('DOMAIN_TRANSFER_LOCK_UNAVAILABLE')
    );
  }

  if (lockAcquired !== 'OK') {
    throw Boom.conflict(ctx.translateError('DOMAIN_TRANSFER_LOCKED'));
  }

  try {
    const previousAdminIds = domain.members
      .filter((member) => member?.group === 'admin' && member.user)
      .map((member) => member.user);
    const previousAdmins = await Users.find({
      _id: {
        $in: previousAdminIds.filter(
          (id) => id.toString() !== user._id.toString()
        )
      }
    })
      .select(`email ${config.lastLocaleField}`)
      .lean()
      .exec();

    const result = await transferDomain({
      domain,
      sourceUser: originalOwner,
      user,
      admin: ctx.state.user,
      locale: ctx.locale
    });

    await Promise.all(
      [`v1_max_forwarded:${domain.name}`, `v1_settings:${domain.name}`].map(
        async (key) => {
          try {
            await ctx.client.del(key);
          } catch (err) {
            ctx.logger.fatal(err, {
              domain: domain._id,
              event: 'domain_transfer_cache_invalidation',
              key
            });
          }
        }
      )
    );

    const notify = (recipient, phrase) => {
      const locale = recipient[config.lastLocaleField] || ctx.locale;
      const subject = i18n.translate(
        'DOMAIN_TRANSFERRED_SUBJECT',
        locale,
        domain.name
      );
      const url = `${
        config.urls.web
      }/${locale}/my-account/domains/${punycode.toASCII(domain.name)}`;
      const message = i18n.translate(
        phrase,
        locale,
        domain.name,
        user.email,
        url,
        url
      );

      return emailHelper({
        template: 'alert',
        message: {
          to: recipient.email,
          bcc: config.email.message.from,
          subject
        },
        locals: {
          message,
          locale
        }
      });
    };

    await Promise.all(
      [
        ...previousAdmins.map((admin) =>
          notify(admin, 'DOMAIN_TRANSFERRED_PREVIOUS_ADMIN_MESSAGE')
        ),
        notify(user, 'DOMAIN_TRANSFERRED_NEW_ADMIN_MESSAGE')
      ].map((promise) =>
        promise.catch((err) => {
          ctx.logger.fatal(err, {
            domain: domain._id,
            user: user._id,
            event: 'domain_transfer_notification'
          });
        })
      )
    );

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate(
        'DOMAIN_TRANSFERRED',
        domain.name,
        user.email,
        result.aliasCount,
        result.pendingEmailCount,
        result.sieveScriptCount
      ),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 5000,
      position: 'top'
    });

    if (ctx.accepts('html')) {
      ctx.redirect('back');
    } else {
      ctx.body = { reloadPage: true };
    }
  } finally {
    try {
      await ctx.client.eval(
        'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) end return 0',
        1,
        lockKey,
        lockToken
      );
    } catch (err) {
      ctx.logger.fatal(err, {
        domain: domain._id,
        event: 'domain_transfer_lock_release'
      });
    }
  }
}

async function remove(ctx) {
  const domain = await Domains.findById(ctx.params.id);

  if (!domain) {
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));
  }

  await domain.remove();
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) {
    ctx.redirect('back');
  } else {
    ctx.body = { reloadPage: true };
  }
}

module.exports = {
  list,
  remove,
  transfer,
  update
};
