const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');
const { isEmail } = require('validator');

const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');
const { Users, Domains } = require('#models');

async function list(ctx) {
  const query = {};

  // filter based on regex name
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

  const [domains, itemCount] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Domains.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .populate('members.user', 'id email')
      .lean()
      .exec(),
    Domains.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/domains', {
      domains,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

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

  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

  const { body } = ctx.request;

  // save max recipients or if null keep the same
  domain.max_recipients_per_alias =
    body.max_recipients_per_alias || domain.max_recipients_per_alias;

  // has_smtp
  const hadSMTPAccess = Boolean(domain.has_smtp);
  if (isSANB(body.has_smtp)) domain.has_smtp = boolean(body.has_smtp);

  // smtp_suspended_sent_at
  const hadSMTPSuspension = _.isDate(domain.smtp_suspended_sent_at);
  if (isSANB(body.smtp_suspended_sent_at)) {
    domain.smtp_suspended_sent_at = boolean(body.smtp_suspended_sent_at)
      ? new Date()
      : undefined;
  }

  domain.locale = ctx.locale;
  domain.resolver = ctx.resolver;
  await domain.save();

  // send an email to all admins of the domain
  const obj = await Domains.getToAndMajorityLocaleByDomain(domain);

  //
  // NOTE: we don't try/catch around emailHelper so admins will know to manually email users
  //

  //
  // email domain admins if we suspended or removed suspension for SMTP
  //
  if (!hadSMTPSuspension && _.isDate(domain.smtp_suspended_sent_at)) {
    const subject = i18n.translate(
      'DOMAIN_IS_ADMIN_SUSPENDED',
      obj.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: obj.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: obj.locale
      }
    });
  } else if (hadSMTPSuspension && !_.isDate(domain.smtp_suspended_sent_at)) {
    const subject = i18n.translate(
      'DOMAIN_SUSPENSION_REMOVED',
      obj.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: obj.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: obj.locale
      }
    });
  }

  //
  // email domain admins if we enabled or disabled their SMTP access
  //
  if (!hadSMTPAccess && domain.has_smtp) {
    const subject = i18n.translate(
      'EMAIL_SMTP_ACCESS_ENABLED_SUBJECT',
      obj.locale,
      domain.name
    );
    const message = i18n.translate(
      'EMAIL_SMTP_ACCESS_ENABLED_MESSAGE',
      obj.locale,
      domain.name,
      `${config.urls.web}/${obj.locale}/my-account/domains/${domain.name}/verify-smtp`
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: obj.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message,
        locale: obj.locale
      }
    });
  } else if (hadSMTPAccess && !domain.has_smtp) {
    const subject = i18n.translate(
      'EMAIL_SMTP_ACCESS_DISABLED',
      obj.locale,
      domain.name
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: obj.to,
        bcc: config.email.message.from,
        subject
      },
      locals: {
        message: subject,
        locale: obj.locale
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

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function remove(ctx) {
  const domain = await Domains.findById(ctx.params.id);

  if (!domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));

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

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = {
  list,
  remove,
  update
};
