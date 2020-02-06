const path = require('path');

const Boom = require('@hapi/boom');
const _ = require('lodash');
const emailAddresses = require('email-addresses');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { boolean } = require('boolean');
const { isEmail, isFQDN, isIP } = require('validator');

const config = require('../../../config');
const { Users, Domains } = require('../../models');

const filename = path.join(__dirname, '..', '..', 'views', 'faq', 'index.pug');

// eslint-disable-next-line complexity
async function faq(ctx, next) {
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

    let html = pug.renderFile(filename, ctx.state);
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
          .replace(/niftylettuce/g, local)
          .replace(/@gmail.com/g, `@${domain}`);
      } else {
        html = html
          .replace(/niftylettuce/g, parsed.local)
          .replace(/@gmail.com/g, `@${parsed.domain}`);
      }
    }

    ctx.body = html;
    return;
  }

  if (!isSANB(ctx.request.body.email) || !isEmail(ctx.request.body.email))
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_EMAIL')));

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    return ctx.throw(Boom.badRequest(ctx.translate('INVALID_DOMAIN')));

  if (ctx.isAuthenticated() && boolean(ctx.request.body.create_domain)) {
    const match = ctx.state.domains.find(
      domain => domain.name === ctx.request.body.domain
    );
    if (!match)
      await Domains.create({
        members: [{ user: ctx.state.user._id, group: 'admin' }],
        name: ctx.request.body.domain
      });
  } else if (
    !ctx.isAuthenticated() &&
    boolean(ctx.request.body.create_account)
  ) {
    const query = {
      email: ctx.request.body.email
    };
    query[config.userFields.hasVerifiedEmail] = false;
    query[config.userFields.hasSetPassword] = false;
    const user = await Users.create(query);
    await Domains.create({
      members: [{ user: user._id, group: 'admin' }],
      name: ctx.request.body.domain
    });
    ctx.login(user);
  }

  // TODO: flash messages logic in @ladjs/assets doesn't support both
  // custom and regular flash message yet
  let redirectTo = ctx.state.l(
    `/faq?domain=${ctx.request.body.domain.toLowerCase()}&email=${ctx.request.body.email.toLowerCase()}#how-do-i-get-started-and-set-up-email-forwarding`
  );
  if (ctx.request.body.domain.startsWith('www.')) {
    ctx.flash(
      'error',
      ctx
        .translate('WWW_WARNING')
        .replace('example.com', ctx.request.body.domain.replace('www.', ''))
    );
    redirectTo = ctx.state.l(
      `/faq?domain=${ctx.request.body.domain.toLowerCase()}&email=${ctx.request.body.email.toLowerCase()}`
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

  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = faq;
