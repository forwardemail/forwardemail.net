const path = require('path');

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const _ = require('lodash');
const cryptoRandomString = require('crypto-random-string');
const moment = require('moment');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const slug = require('speakingurl');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { isEmail, isFQDN, isIP, isPort } = require('validator');
const { parse } = require('node-html-parser');

const config = require('../../../config');
const emailHelper = require('../../../helpers/email');
const toObject = require('../../../helpers/to-object');
const { Users, Domains, Aliases } = require('../../models');

async function update(ctx) {
  const { body } = ctx.request;
  const hasSetPassword = ctx.state.user[config.userFields.hasSetPassword];

  const requiredFields = ['password', 'confirm_password'];

  if (hasSetPassword) requiredFields.push('old_password');

  if (body.change_password === 'true') {
    requiredFields.forEach((prop) => {
      if (!isSANB(body[prop]))
        throw Boom.badRequest(
          ctx.translateError('INVALID_STRING', ctx.request.t(humanize(prop)))
        );
    });

    if (body.password !== body.confirm_password)
      throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD_CONFIRM'));

    if (hasSetPassword)
      await ctx.state.user.changePassword(body.old_password, body.password);
    else {
      await ctx.state.user.setPassword(body.password);
      ctx.state.user[config.userFields.hasSetPassword] = true;
    }

    ctx.state.user[config.userFields.resetToken] = null;
    ctx.state.user[config.userFields.resetTokenExpiresAt] = null;
  } else {
    ctx.state.user[config.passport.fields.givenName] =
      body[config.passport.fields.givenName];
    ctx.state.user[config.passport.fields.familyName] =
      body[config.passport.fields.familyName];
  }

  const currentEmail =
    ctx.state.user[config.passportLocalMongoose.usernameField];
  // confirm user supplied email is different than current email
  if (currentEmail !== body.email) {
    // set the reset token and expiry
    ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = moment()
      .add(30, 'minutes')
      .toDate();
    ctx.state.user[config.userFields.changeEmailToken] = cryptoRandomString({
      length: 32
    });
    ctx.state.user[config.userFields.changeEmailNewAddress] = body.email;
    ctx.state.user = await ctx.state.user.save();

    try {
      await emailHelper({
        template: 'change-email',
        message: {
          to: body.email
        },
        locals: {
          user: _.pick(ctx.state.user, [
            config.userFields.changeEmailTokenExpiresAt,
            config.userFields.changeEmailNewAddress,
            config.passportLocalMongoose.usernameField
          ]),
          link: `${config.urls.web}/change-email/${
            ctx.state.user[config.userFields.changeEmailToken]
          }`
        }
      });

      if (ctx.accepts('html')) {
        ctx.flash('success', ctx.translate('EMAIL_CHANGE_SENT'));
        ctx.redirect('back');
      } else {
        ctx.body = {
          message: ctx.translate('EMAIL_CHANGE_SENT')
        };
      }
    } catch (err) {
      ctx.logger.error(err);
      // reset if there was an error
      try {
        ctx.state.user[config.userFields.changeEmailToken] = null;
        ctx.state.user[config.userFields.changeEmailTokenExpiresAt] = null;
        ctx.state.user[config.userFields.changeEmailNewAddress] = null;
        ctx.state.user = await ctx.state.user.save();
      } catch (err) {
        ctx.logger.error(err);
      }

      throw Boom.badRequest(ctx.translateError('EMAIL_FAILED_TO_SEND'));
    }
  }

  ctx.state.user = await ctx.state.user.save();

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function resetAPIToken(ctx) {
  ctx.state.user[config.userFields.apiToken] = null;
  ctx.state.user = await ctx.state.user.save();

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function retrieveDomains(ctx, next) {
  ctx.state.domains = [];

  if (!ctx.isAuthenticated()) return next();

  const query = {
    $or: [{ 'members.user': ctx.state.user._id }]
  };
  if (ctx.state.user.group === 'admin') query.$or.push({ is_global: true });
  else
    query.$or.push({
      is_global: true,
      has_mx_record: true,
      has_txt_record: true
    });

  ctx.state.domains = await Domains.find(query)
    .populate(
      'members.user',
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('is_global name') // A-Z domains
    .lean()
    .exec();

  ctx.state.domains = ctx.state.domains.map((domain) => {
    domain.members = domain.members.filter(
      (member) =>
        _.isObject(member.user) && !member.user[config.userFields.isBanned]
    );
    return domain;
  });

  let domainAliases = await Aliases.find({
    domain: { $in: _.map(ctx.state.domains, '_id') }
  })
    .populate('domain', 'name')
    .populate(
      'user',
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('name')
    .lean()
    .exec();

  domainAliases = domainAliases.filter(
    (alias) => _.isObject(alias.user) && !alias.user[config.userFields.isBanned]
  );

  const aliasesByDomain = _.groupBy(
    domainAliases,
    (alias) => alias.domain.name
  );

  ctx.state.domains = ctx.state.domains.map((domain) => {
    // populate a `group` on the domain based off the user's association
    let member = domain.members.find(
      (member) => member.user.id === ctx.state.user.id
    );

    // for all global domains, if the user is not a member
    // then add them as a member to the domain
    if (!member && domain.is_global) {
      member = {
        user: {
          _id: ctx.state.user._id,
          id: ctx.state.user.id,
          email: ctx.state.user.email
        },
        group: 'user'
      };
      domain.members.push(member);
    }

    const { group } = member;

    // populate an `aliases` Array on the domain based off user's aliases
    const aliases = [];

    if (aliasesByDomain[domain.name])
      for (const alias of aliasesByDomain[domain.name]) {
        if (group === 'admin' || alias.user.id === ctx.state.user.id)
          aliases.push({
            ...alias,
            // for each alias set a virtual group helper
            // (if the user is an admin OR if the user is the owner of the alias)
            group:
              group === 'admin' || alias.user.id === ctx.state.user.id
                ? 'admin'
                : 'user'
          });
      }

    // iterate over domain.members and add `alias_count` virtual property
    // which counts across the aliases for the given member's user id
    domain.members = domain.members.map((member) => ({
      ...member,
      alias_count: aliasesByDomain[domain.name]
        ? aliasesByDomain[domain.name].filter(
            (alias) => alias.user.id === member.user.id
          ).length
        : 0
    }));

    return {
      ...domain,
      group,
      aliases
    };
  });

  //
  // search functionality (with RegExp support)
  //
  if (isSANB(ctx.query.name))
    ctx.state.domains = ctx.state.domains.filter((domain) =>
      new RE2(_.escapeRegExp(ctx.query.name)).test(domain.name)
    );

  if (isSANB(ctx.query.alias)) {
    const aliasRegex = new RE2(_.escapeRegExp(ctx.query.alias));
    ctx.state.domains = ctx.state.domains.filter((domain) =>
      domain.aliases.some((alias) => aliasRegex.test(alias.name))
    );
  }

  if (isSANB(ctx.query.recipient)) {
    const recipientRegex = new RE2(_.escapeRegExp(ctx.query.recipient));
    ctx.state.domains = ctx.state.domains.filter((domain) =>
      domain.aliases.some((alias) =>
        alias.recipients.some((recipient) => recipientRegex.test(recipient))
      )
    );
  }

  if (ctx.api) return next();

  if (
    ctx.state.domains.length === 0 &&
    ctx.method === 'GET' &&
    ['/my-account', '/my-account/domains'].includes(ctx.pathWithoutLocale)
  ) {
    if (!ctx.api)
      ctx.flash('custom', {
        title: ctx.request.t(`${ctx.state.emoji('wave')} Welcome!`),
        text: ctx.translate('NO_DOMAINS_EXIST'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 5000,
        position: 'top'
      });
    return ctx.redirect('/my-account/domains/new');
  }

  return next();
}

async function retrieveDomain(ctx, next) {
  if (!isSANB(ctx.params.domain_id) && !isSANB(ctx.request.body.domain))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const id = isSANB(ctx.params.domain_id)
    ? ctx.params.domain_id
    : ctx.request.body.domain;

  ctx.state.domain = ctx.state.domains.find((domain) =>
    [domain.id, domain.name].includes(id)
  );

  // check if domain exists, and f it doesn't then check
  // if we have a pending invite
  if (!ctx.state.domain)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // if it's an API request then return early
  if (ctx.api) return next();

  //
  // set breadcrumbs
  //
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      header: ctx.state.domain.name,
      href: ctx.state.l('/my-account/domains')
    },
    {
      name: ctx.state.domain.name,
      href:
        ctx.state.domain.group === 'admin'
          ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
          : null
    }
  ];

  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  )
    ctx.state.breadcrumbs.push('aliases');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/advanced-settings`
  )
    ctx.state.breadcrumbs.push('advanced-settings');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/new`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/aliases`)
    });
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Add Alias')
    });
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/billing`
  )
    ctx.state.breadcrumbs.push('billing');

  // dynamically load the DNS Managment by Registrar table from FAQ
  try {
    const html = pug.renderFile(
      path.join(config.views.root, 'faq', 'index.pug'),
      ctx.state
    );

    // expose it to the view
    const root = parse(html);
    ctx.state.modalFAQTable = root.querySelector(
      '#table-dns-management-by-registrar'
    ).outerHTML;
  } catch (err) {
    ctx.logger.error(err);
  }

  return next();
}

// eslint-disable-next-line complexity
async function createDomain(ctx, next) {
  if (!['GET', 'POST'].includes(ctx.method)) return next();

  if (ctx.method === 'GET') {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs = [
      'my-account',
      {
        name: ctx.state.t('Domains'),
        header: ctx.state.t('Add Domain'),
        href: ctx.state.l('/my-account/domains')
      },
      {
        name: ctx.state.t('Add Domain')
      }
    ];
    if (ctx.api) return next();
    return ctx.render('my-account/domains/new');
  }

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_DOMAIN')));

  const match = ctx.state.domains.find(
    (domain) => domain.name === ctx.request.body.domain
  );

  if (match)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_ALREADY_EXISTS'))
    );

  if (
    isSANB(ctx.request.body.plan) &&
    !['free', 'enhanced_protection', 'team'].includes(ctx.request.body.plan)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PLAN')));

  // check if we're creating a default catchall
  const recipients = [ctx.state.user.email];

  if (_.isBoolean(ctx.request.body.catchall) && !ctx.request.body.catchall)
    recipients.pop();
  else if (isSANB(ctx.request.body.catchall)) {
    const rcpts = _.compact(
      _.uniq(
        _.map(
          ctx.request.body.catchall
            .split('\n')
            .join(' ')
            .split(',')
            .join(' ')
            .split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
    for (const rcpt of rcpts) {
      recipients.push(rcpt);
    }
  }

  const plan = isSANB(ctx.request.body.plan) ? ctx.request.body.plan : 'free';

  try {
    ctx.state.domain = await Domains.create({
      is_api: boolean(ctx.api),
      members: [{ user: ctx.state.user._id, group: 'admin' }],
      name: ctx.request.body.domain,
      is_global:
        ctx.state.user.group === 'admin' && boolean(ctx.request.body.is_global),
      locale: ctx.locale,
      plan
    });

    // create a default alias for the user pointing to the admin
    if (recipients.length > 0)
      await Aliases.create({
        is_api: boolean(ctx.api),
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients,
        locale: ctx.locale
      });

    if (ctx.api) {
      ctx.state.domain = toObject(Domains, ctx.state.domain);
      ctx.state.domain.members[0].user = toObject(Users, ctx.state.user);
      return next();
    }

    // TODO: flash messages logic in @ladjs/assets doesn't support both
    // custom and regular flash message yet
    if (ctx.request.body.domain.startsWith('www.') && !ctx.api) {
      ctx.flash(
        'error',
        ctx
          .translate('WWW_WARNING')
          .replace(/example.com/g, ctx.state.domain.name)
      );
    } else if (!ctx.api) {
      ctx.flash('custom', {
        title: ctx.request.t('Success'),
        text: ctx.translate('REQUEST_OK'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        position: 'top'
      });
    }

    let redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}`
    );

    if (plan !== 'free')
      redirectTo = ctx.state.l(
        `/my-account/domains/${ctx.state.domain.name}/billing?plan=${plan}`
      );

    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.throw(Boom.badRequest(err));
  }
}

async function remove(ctx) {
  const adminDomains = ctx.state.domains.filter(
    (domain) => domain.group === 'admin'
  );
  if (adminDomains.length > 0)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ACCOUNT_DELETE_HAS_DOMAINS'))
    );
  await Users.findByIdAndRemove(ctx.state.user._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('ACCOUNT_DELETE_SUCCESSFUL'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  const redirectTo = ctx.state.l();
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function removeDomain(ctx, next) {
  await Domains.findByIdAndRemove(ctx.state.domain._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  if (ctx.api) return next();
  const redirectTo = ctx.state.l('/my-account/domains');
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function verifyRecords(ctx) {
  // check mx and txt
  try {
    await Domains.verifyRecords(ctx.state.domain._id);

    const text = ctx.translate('DOMAIN_IS_VERIFIED');

    if (ctx.api) {
      ctx.body = text;
      return;
    }

    // if everything OK then success
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.warn(err);

    if (Array.isArray(err.errors)) {
      if (ctx.api) {
        err.message = err.errors.map((e) => e.message);
      } else {
        err.message = `<ul class="text-left mb-0">${err.errors
          .map((e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`)
          .join('')}</ul>`;
      }
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

function ensureDomainAdmin(ctx, next) {
  if (ctx.state.domain.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));
}

function ensureAliasAdmin(ctx, next) {
  if (ctx.state.alias.group === 'admin') return next();
  ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));
}

function validateAlias(ctx, next) {
  const body = _.pick(ctx.request.body, [
    'name',
    'description',
    'labels',
    'is_enabled',
    'recipients'
  ]);

  if (!isSANB(body.name)) delete body.name;

  if (isSANB(body.description)) body.description = striptags(body.description);
  else delete body.description;

  if (isSANB(body.labels))
    body.labels = _.compact(
      _.uniq(
        _.map(
          body.labels.split('\n').join(' ').split(',').join(' ').split(' '),
          (label) => slug(label)
        )
      )
    );
  else delete body.labels;

  body.is_enabled = boolean(body.is_enabled);

  if (isSANB(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(
          body.recipients.split('\n').join(' ').split(',').join(' ').split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
  else delete body.recipients;

  ctx.state.body = body;

  return next();
}

async function createAlias(ctx, next) {
  try {
    ctx.state.alias = await Aliases.create({
      ...ctx.state.body,
      is_api: boolean(ctx.api),
      user: ctx.state.user._id,
      domain: ctx.state.domain._id,
      locale: ctx.locale
    });

    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
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
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

function retrieveAlias(ctx, next) {
  if (!isSANB(ctx.params.alias_id))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ALIAS_DOES_NOT_EXIST'))
    );
  ctx.state.alias = ctx.state.domain.aliases.find(
    (alias) => alias.id === ctx.params.alias_id
  );
  if (!ctx.state.alias)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ALIAS_DOES_NOT_EXIST'))
    );

  if (ctx.api) return next();
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/${ctx.state.alias.id}`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/aliases`)
    });
    ctx.state.breadcrumbs.push({
      header: ctx.state.t('Edit Alias'),
      name: `${ctx.state.alias.name}@${ctx.state.domain.name}`
    });
  }

  return next();
}

async function updateAlias(ctx, next) {
  ctx.state.alias = await Aliases.findById(ctx.state.alias._id);
  ctx.state.alias = _.extend(ctx.state.alias, ctx.state.body);
  try {
    ctx.state.alias.locale = ctx.locale;
    ctx.state.alias = await ctx.state.alias.save();
    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
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
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

async function removeAlias(ctx, next) {
  await Aliases.findByIdAndRemove(ctx.state.alias._id);
  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
  if (ctx.api) return next();
  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

function sortedDomains(ctx, next) {
  ctx.state.sortedDomains = _.clone(ctx.state.domains);
  ctx.state.sortedDomains = ctx.state.sortedDomains.filter(
    (domain) => !domain.is_global
  );
  if (
    isSANB(ctx.query.domain) &&
    (isFQDN(ctx.query.domain) || isIP(ctx.query.domain)) &&
    ctx.state.sortedDomains.find((domain) => domain.name === ctx.query.domain)
  )
    ctx.state.sortedDomains = _.sortBy(
      ctx.state.sortedDomains.map((domain, i) => ({
        ...domain,
        _key: domain.name === ctx.query.domain ? 0 : i + 1
      })),
      '_key'
    );

  return next();
}

function ensureUpgradedPlan(ctx, next) {
  if (ctx.state.domain.plan !== 'free') return next();
  const swal = {
    title: ctx.translate('UPGRADE_PLAN'),
    html: ctx.translate('PLAN_UPGRADE_REQUIRED'),
    type: 'warning'
  };

  if (ctx.api)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('PLAN_UPGRADE_REQUIRED'))
    );

  if (ctx.method === 'GET' || ctx.accepts('html')) {
    if (!ctx.api) ctx.flash('custom', swal);
    /*
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
    );
    */
    const redirectTo = ctx.state.l('/my-account/domains');
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  ctx.body = { swal };
}

async function retrieveBilling(ctx) {
  if (
    !isSANB(ctx.query.plan) ||
    !['free', 'enhanced_protection', 'team'].includes(ctx.query.plan)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PLAN')));
  const domain = await Domains.findById(ctx.state.domain._id);
  domain.plan = ctx.query.plan;
  try {
    domain.locale = ctx.locale;
    ctx.state.domain = await domain.save();
    if (!ctx.api)
      ctx.flash(
        'success',
        ctx.translate(`${ctx.state.domain.plan.toUpperCase()}_PLAN`)
      );
    if (!ctx.api && domain.plan !== 'free')
      ctx.flash('warning', ctx.translate('BETA_PROGRAM'));
    // TODO: for some reason the link uncommented doesn't work
    // specifically the above flash messages do not render when it's uncommented
    const redirectTo = ctx.state.l(`/my-account/domains`); // /${ctx.state.domain.name}/`);
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

function createAliasForm(ctx, next) {
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs = [
    'my-account',
    'domains',
    {
      name: ctx.state.t('Add Alias')
    }
  ];
  return next();
}

// eslint-disable-next-line complexity
async function importAliases(ctx) {
  if (ctx.state.domain.is_global)
    return ctx.throw(Boom.badRequest(ctx.translateError('IS_NOT_ADMIN')));

  let forwardingAddresses;
  let globalForwardingAddresses;
  let ignoredAddresses;
  let errors;
  try {
    ({
      forwardingAddresses,
      globalForwardingAddresses,
      ignoredAddresses,
      errors
    } = await Domains.getTxtAddresses(ctx.state.domain.name));
  } catch (err) {
    ctx.logger.error(err);
    if (err.code === 'ENOTFOUND')
      throw Boom.badRequest(ctx.translateError('ENOTFOUND'));
    if (err.code === 'ENODATA')
      throw Boom.badRequest(ctx.translateError('MISSING_DNS_TXT'));
    throw err;
  }

  //
  // NOTE: eventually rewrite this, it was a quick hack
  //
  const aliases = [];
  const catchAll = [];

  for (const element of ignoredAddresses) {
    const match = aliases.find((alias) => alias.name === element.name);
    const existing = ctx.state.domain.aliases.find(
      (alias) => alias.name === element.name
    );
    if (existing)
      errors.push(
        ctx.translate(
          'IMPORT_ALIAS_ALREADY_EXISTS',
          element.name,
          element.recipient
        )
      );
    else if (match) {
      if (element.recipient) match.recipients.push(element.recipient);
      else
        errors.push(
          ctx.translate('IMPORT_ALIAS_DISABLED_NOBODY', element.name)
        );
    } else {
      aliases.push({
        is_enabled: false,
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: element.name,
        recipients: [element.recipient]
      });
    }
  }

  for (const element of forwardingAddresses) {
    const match = aliases.find((alias) => alias.name === element.name);
    const existing = ctx.state.domain.aliases.find(
      (alias) => alias.name === element.name
    );
    if (existing)
      errors.push(
        ctx.translate(
          'IMPORT_ALIAS_ALREADY_EXISTS',
          element.name,
          element.recipient
        )
      );
    else if (match) match.recipients.push(element.recipient);
    else
      aliases.push({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: element.name,
        recipients: [element.recipient]
      });
  }

  for (const element of globalForwardingAddresses) {
    // if it was a fqdn, ip, or email address then add global alias
    // otherwise throw an error that it was an invalid global
    if (isFQDN(element) || isIP(element) || isEmail(element)) {
      const match = aliases.find((alias) => alias.name === '*');
      const existing = ctx.state.domain.aliases.find(
        (alias) => alias.name === '*'
      );
      // try to add to existing catch-all record if it wasn't already there
      if (existing) {
        if (existing.recipients.includes(element))
          errors.push(
            ctx.translate('IMPORT_CATCHALL_ALREADY_INCLUDES', element)
          );
        else catchAll.push(element);
      } else if (match) match.recipients.push(element);
      else
        aliases.push({
          user: ctx.state.user._id,
          domain: ctx.state.domain._id,
          name: '*',
          recipients: [element]
        });
    } else {
      ctx.logger.error(
        new Error(`Invalid global forwarding address of ${element}`),
        { domain: ctx.state.domain }
      );
    }
  }

  const messages = [];

  if (aliases.length > 0)
    try {
      const array = await Aliases.create(
        aliases.map((alias) => ({
          ...alias,
          is_api: boolean(ctx.api),
          locale: ctx.locale
        }))
      );
      messages.push(ctx.translate('IMPORT_SUCCESSFUL', array.length));
    } catch (err) {
      messages.push(ctx.translate('IMPORT_ERROR'));
      ctx.logger.error(err);
      errors.push(err);
    }
  else messages.push(ctx.translate('IMPORT_NO_ALIASES_AVAILABLE'));

  if (catchAll.length > 0)
    try {
      const alias = await Aliases.findOne({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*'
      });
      for (const recipient of catchAll) {
        alias.recipients.push(recipient);
      }

      alias.locale = ctx.locale;
      await alias.save();
      messages.push(
        ctx.translate('IMPORT_CATCHALL_SUCCESSFUL', catchAll.length)
      );
    } catch (err) {
      messages.push(ctx.translate('IMPORT_CATCHALL_ERROR'));
      ctx.logger.error(err);
      errors.push(err);
    }
  else messages.push(ctx.translate('IMPORT_CATCHALL_NONE'));

  errors = _.uniqBy(errors, 'message');

  const message =
    errors.length > 0
      ? `<p>${messages.join(
          ' '
        )}</p><p class="font-weight-bold text-danger">The following errors occurred:</p><ul class="mb-0 text-left"><li>${errors
          .map((err) => err.message)
          .join('</li><li>')}</li></ul>`
      : messages.join(' ');

  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );

  if (ctx.accepts('html')) {
    if (!ctx.api) ctx.flash('info', message);
    ctx.redirect(redirectTo);
  } else {
    ctx.body = {
      message,
      redirectTo
    };
  }
}

function retrieveAliases(ctx, next) {
  // if there aren't any aliases yet
  // then prompt the user to create one and flash a message
  // otherwise take them to the next middleware
  if (ctx.api || ctx.state.domain.aliases.length > 0) return next();
  ctx.flash('custom', {
    title: ctx.translate('ADD_ALIAS'),
    text: ctx.translate('NO_ALIASES_EXIST'),
    type: 'info',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });
  ctx.redirect(`/my-account/domains/${ctx.state.domain.name}/aliases/new`);
}

async function retrieveInvite(ctx) {
  if (!isSANB(ctx.params.domain_id))
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const domain = await Domains.findOne({
    id: ctx.params.domain_id,
    'invites.email': ctx.state.user.email
  });

  if (!domain)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // convert invitee to a member with the same group as invite had
  const invite = domain.invites.find(
    (invite) => invite.email === ctx.state.user.email
  );

  if (!invite)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVITE_DOES_NOT_EXIST'))
    );

  const { group } = invite;
  domain.members.push({
    user: ctx.state.user._id,
    group
  });

  // remove invitee from invites list
  domain.invites = domain.invites.filter(
    (invite) => invite.email !== ctx.state.user.email
  );

  // save domain
  domain.locale = ctx.locale;
  ctx.state.domain = await domain.save();

  // flash a message to the user telling them they've successfully accepted
  const message =
    group === 'admin'
      ? ctx.translate('INVITE_ACCEPTED_ADMIN')
      : ctx.translate('INVITE_ACCEPTED_USER');

  // edge case if it was an API request to simply send a string in the body
  if (ctx.api) {
    ctx.body = message;
    return;
  }

  ctx.flash('success', message);

  // redirect user to either alias page (if user) or admin page (if admin)
  const redirectTo =
    group === 'admin'
      ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
      : ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/aliases`);

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

async function createInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  // ensure invite does not already exist
  const invite = ctx.state.domain.invites.find(
    (invite) => invite.email.toLowerCase() === email.toLowerCase()
  );

  if (invite)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVITE_ALREADY_SENT'))
    );

  // ensure user is not already a member
  const user = await Users.findOne({ email }).lean().exec();
  if (user) {
    const member = ctx.state.domain.members.find(
      (member) => member.user.id === user.id
    );
    if (member)
      return ctx.throw(
        Boom.badRequest(ctx.translateError('USER_ALREADY_MEMBER'))
      );
  }

  // create the invite
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  ctx.state.domain.invites.push({
    email: email.toLowerCase(),
    group: ctx.request.body.group
  });
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  // send an email
  try {
    await emailHelper({
      template: 'invite',
      message: {
        to: email.toLowerCase()
      },
      locals: {
        domain: { id: ctx.state.domain.id, name: ctx.state.domain.name }
      }
    });
  } catch (err) {
    if (!ctx.api) ctx.flash('error', ctx.translate('INVITE_EMAIL_ERROR'));
    ctx.logger.error(err);
  }

  if (ctx.api) return next();

  // send response
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function removeInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  // remove invite
  ctx.state.domain.invites = ctx.state.domain.invites.filter(
    (invite) => invite.email.toLowerCase() !== email.toLowerCase()
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function updateMember(ctx, next) {
  // ctx.params.user_id
  if (!isSANB(ctx.params.user_id))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_USER')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  const member = ctx.state.domain.members.find(
    (member) => member.user.id === ctx.params.user_id
  );

  if (!member)
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_USER')));

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  // swap the user group based off ctx.request.body.group
  ctx.state.domain.members = ctx.state.domain.members.map((member) => ({
    ...member,
    group:
      member.user.toString() === ctx.params.user_id
        ? ctx.request.body.group
        : member.group
  }));

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function removeMember(ctx, next) {
  // ctx.params.user_id
  if (!isSANB(ctx.params.user_id))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_USER')));

  const member = ctx.state.domain.members.find(
    (member) => member.user.id === ctx.params.user_id
  );

  if (!member)
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_USER')));

  /*
  // cannot remove self
  if (member.user.id === ctx.state.user.id)
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_USER')));
  */

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  ctx.state.domain.members = ctx.state.domain.members.filter(
    (member) => member.user.toString() !== ctx.params.user_id
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

function ensureNotBanned(ctx, next) {
  if (ctx.state.user[config.userFields.isBanned])
    return ctx.throw(Boom.forbidden(ctx.translateError('ACCOUNT_BANNED')));
  return next();
}

async function recoveryKeys(ctx) {
  const otpRecoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  ctx.attachment('recovery-keys.txt');
  ctx.body = otpRecoveryKeys.toString().replace(/,/g, '\n').replace(/"/g, '');
}

async function updateDomain(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);

  if (isSANB(ctx.request.body.smtp_port))
    if (isPort(ctx.request.body.smtp_port))
      ctx.state.domain.smtp_port = ctx.request.body.smtp_port;
    else return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PORT')));

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = {
  update,
  resetAPIToken,
  retrieveDomains,
  retrieveDomain,
  createDomain,
  remove,
  removeDomain,
  verifyRecords,
  ensureDomainAdmin,
  ensureAliasAdmin,
  validateAlias,
  createAlias,
  retrieveAlias,
  updateAlias,
  removeAlias,
  sortedDomains,
  ensureUpgradedPlan,
  retrieveBilling,
  createAliasForm,
  importAliases,
  retrieveAliases,
  retrieveInvite,
  createInvite,
  removeInvite,
  updateMember,
  removeMember,
  ensureNotBanned,
  recoveryKeys,
  updateDomain
};
