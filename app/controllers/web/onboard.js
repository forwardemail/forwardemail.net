const Boom = require('@hapi/boom');
const Email = require('email-templates');
const Meta = require('koa-meta');
const _ = require('lodash');
const emailAddresses = require('email-addresses');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { boolean } = require('boolean');
const { isEmail, isFQDN, isIP } = require('validator');

const config = require('../../../config');
const logger = require('../../../helpers/logger');
const sendVerificationEmail = require('../../../helpers/send-verification-email');
const { Users, Domains, Aliases } = require('../../models');

// we're only using this for the exposed `getTemplatePath` method
const email = new Email({ views: config.views });

const meta = new Meta(config.meta, logger);

// eslint-disable-next-line complexity
async function onboard(ctx, next) {
  if (!['GET', 'POST'].includes(ctx.method)) return next();

  if (ctx.method === 'GET') {
    ctx.state.domain =
      Array.isArray(ctx.state.domains) &&
      ctx.state.domains.length > 0 &&
      _.isObject(ctx.state.domains[0]) &&
      isSANB(ctx.state.domains[0].name) &&
      (isIP(ctx.state.domains[0].name) || isFQDN(ctx.state.domains[0].name))
        ? ctx.state.domains[0].name
        : null;

    ctx.state.email = ctx.state.user ? ctx.state.user.email : '';

    if (
      isSANB(ctx.query.domain) &&
      (isFQDN(ctx.query.domain) || isIP(ctx.query.domain))
    )
      ctx.state.domain = ctx.query.domain;

    if (isSANB(ctx.query.email) && isEmail(ctx.query.email))
      ctx.state.email = ctx.query.email;

    if (ctx.state.domain && ctx.state.domain.startsWith('www.'))
      ctx.flash(
        'error',
        ctx
          .translate('WWW_WARNING')
          .replace('example.com', ctx.state.domain.replace('www.', ''))
      );

    const { filePath } = await email.getTemplatePath(
      ctx.pathWithoutLocale.slice(1)
    );

    // load seo metadata
    let data = {};
    try {
      data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
    } catch (err) {
      logger.error(err);
      data = meta.getByPath('/', ctx.request.t);
    }

    Object.assign(ctx.state.meta, data);

    let html = pug.renderFile(
      filePath,
      // make flash a noop so we don't interfere with messages/session
      {
        ...ctx.state,
        flash() {
          return {};
        }
      }
    );

    if (ctx.state.domain)
      html = html.replace(
        /example.com/g,
        ctx.state.domain.startsWith('www.')
          ? ctx.state.domain.replace('www.', '')
          : ctx.state.domain
      );

    if (ctx.state.email) {
      const parsed = emailAddresses.parseOneAddress(ctx.state.email);
      if (parsed === null) {
        const index = ctx.state.email.lastIndexOf('@');
        const local = ctx.state.email.slice(0, index);
        const domain = ctx.state.email.slice(index + 1);
        html = html
          .replace(/admin/g, local)
          .replace(/@gmail.com/g, `@${domain}`);
      } else {
        html = html
          .replace(/admin/g, parsed.local)
          .replace(/@gmail.com/g, `@${parsed.domain}`);
      }
    }

    ctx.body = html;
    return;
  }

  if (!isSANB(ctx.request.body.email) || !isEmail(ctx.request.body.email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_DOMAIN')));

  if (ctx.isAuthenticated() && boolean(ctx.request.body.create_domain)) {
    const match = ctx.state.domains.find(
      (domain) => domain.name === ctx.request.body.domain
    );
    if (match) ctx.state.domain = match;
    else {
      ctx.state.domain = await Domains.create({
        members: [{ user: ctx.state.user._id, group: 'admin' }],
        name: ctx.request.body.domain,
        locale: ctx.locale
      });
      // create a default alias for the user pointing to the admin
      await Aliases.create({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients: [ctx.state.user.email],
        locale: ctx.locale
      });
    }
  } else if (
    !ctx.isAuthenticated() &&
    boolean(ctx.request.body.create_account)
  ) {
    const query = {
      email: ctx.request.body.email,
      locale: ctx.locale
    };
    query[config.lastLocaleField] = ctx.locale;
    query[config.userFields.hasVerifiedEmail] = false;
    query[config.userFields.hasSetPassword] = false;
    ctx.state.user = await Users.create(query);
    // send verification email if needed
    if (boolean(ctx.query.send_verification_email)) {
      ctx.state.user = await sendVerificationEmail(ctx);
      ctx.flash('success', ctx.translate('EMAIL_VERIFICATION_SENT'));
    }

    ctx.state.domain = await Domains.create({
      members: [{ user: ctx.state.user._id, group: 'admin' }],
      name: ctx.request.body.domain,
      locale: ctx.locale,
      skip_verification: !boolean(ctx.query.redirect_to_domain)
    });
    // create a default alias for the user pointing to the admin
    await Aliases.create({
      user: ctx.state.user._id,
      domain: ctx.state.domain._id,
      name: '*',
      recipients: [ctx.state.user.email],
      locale: ctx.locale
    });
    await ctx.login(ctx.state.user);
  }

  // TODO: flash messages logic in @ladjs/assets doesn't support both
  // custom and regular flash message yet
  if (ctx.request.body.domain.startsWith('www.')) {
    ctx.flash(
      'error',
      ctx
        .translate('WWW_WARNING')
        .replace('example.com', ctx.request.body.domain.replace('www.', ''))
    );
  } else {
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

  return next();
}

module.exports = onboard;
