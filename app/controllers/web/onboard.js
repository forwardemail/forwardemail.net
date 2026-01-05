/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const Email = require('email-templates');
const Meta = require('koa-meta');
const emailAddresses = require('email-addresses');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { boolean } = require('boolean');
const { isIP } = require('@forwardemail/validator');
const { ValidationError } = require('mongoose/lib/error');
const { parse } = require('node-html-parser');
const _ = require('#helpers/lodash');

const isEmail = require('#helpers/is-email');
const config = require('#config');
const logger = require('#helpers/logger');
const sendVerificationEmail = require('#helpers/send-verification-email');
const { Users, Domains, Aliases } = require('#models');

// we're only using this for the exposed `getTemplatePath` method
const email = new Email({ views: config.views });

const meta = new Meta(config.meta, logger);

async function onboard(ctx, next) {
  if (!['GET', 'POST'].includes(ctx.method)) return next();

  if (ctx.method === 'GET') {
    const filteredDomains = Array.isArray(ctx.state.domains)
      ? ctx.state.domains.filter((domain) => !domain.is_global)
      : [];
    ctx.state.domainName =
      filteredDomains.length > 0 &&
      _.isObject(filteredDomains[0]) &&
      isSANB(filteredDomains[0].name) &&
      (isIP(filteredDomains[0].name) || isFQDN(filteredDomains[0].name))
        ? filteredDomains[0].name
        : null;

    ctx.state.email = ctx.state.user ? ctx.state.user.email : '';

    if (
      isSANB(ctx.query.domain) &&
      (isFQDN(ctx.query.domain) || isIP(ctx.query.domain))
    )
      ctx.state.domainName = ctx.query.domain;

    if (isSANB(ctx.query.email) && isEmail(ctx.query.email))
      ctx.state.email = ctx.query.email;

    if (ctx.state.domainName && ctx.state.domainName.startsWith('www.'))
      ctx.flash(
        'error',
        ctx
          .translate('WWW_WARNING')
          .replace('example.com', ctx.state.domainName.replace('www.', ''))
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

    let html = pug.renderFile(filePath, ctx.state);

    if (ctx.state.domainName)
      html = html.replace(
        /example.com/g,
        ctx.state.domainName.startsWith('www.')
          ? ctx.state.domainName.replace('www.', '')
          : ctx.state.domainName
      );

    //
    // Only perform email address replacement on FAQ page
    // This prevents unintended replacements on other pages (e.g., "administrative" -> "jamesistrative")
    //
    if (
      ctx.pathWithoutLocale === '/faq' &&
      ctx.state.email &&
      (!ctx.isAuthenticated() || ctx.state.user.group !== 'admin')
    ) {
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

    const root = parse(html);
    let i = 0;
    const codes = root.querySelectorAll('code');
    for (const code of codes) {
      if (
        !code.rawText.startsWith('forward-email') ||
        code.rawText === 'forward-email=' ||
        code.rawText === 'forward-email-site-verification=' ||
        code.rawText === 'forward-email-port='
      )
        continue;
      const id = `code-fe-${i}`;
      code.setAttribute('id', id);
      let eHTML = ctx.state.t(
        'We allow you to encrypt records even on the free plan at no cost.'
      );
      eHTML += ' ';
      eHTML += ctx.state.t(
        'Privacy should not be a feature, it should be inherently built-in to all aspects of a product.'
      );
      eHTML += ' ';
      eHTML += ctx.state.t(
        'As highly requested in a <a target="_blank" class="alert-link" rel="noopener noreferrer" href="https://discuss.privacyguides.net/t/forward-email-email-provider/13370">Privacy Guides discussion</a> and on <a target="_blank" class="alert-link" rel="noopener noreferrer" href="https://github.com/forwardemail/forwardemail.net/issues/254">our GitHub issues</a> we\'ve added this.'
      );
      eHTML += '<br /><br />';
      eHTML += ctx.state.t('Need to encrypt a different value?');
      eHTML += '<br />';
      eHTML += ctx.state.t(
        '<a href="%s" target="_blank" class="font-weight-bold">Click here for our Encrypt TXT page.</a>',
        ctx.state.l('/encrypt')
      );
      code.insertAdjacentHTML(
        'afterend',
        `
         <ul class="pl-0 list-inline">
           <li class="list-inline-item">
             <button type="button" class="btn btn-dark btn-sm mt-1" data-toggle="clipboard" data-clipboard-target="#${id}">
               <i class="fa fa-clipboard"></i> ${ctx.state.t('Copy')}
             </button>
           </li>
           <li class="list-inline-item">
             <form class="ajax-form confirm-prompt d-block" action="/encrypt" method="POST">
               <input type="hidden" name="input" value="${code.rawText}" />
               <button type="submit" class="btn btn-dark btn-sm mt-1">
                 <i class="fas fa-user-secret"></i> ${ctx.state.t('Encrypt')}
               </button>
               <a
                 class="btn btn-link confirm-prompt"
                 href="${ctx.state.l('/encrypt')}",
                 target="_blank",
                 role="button",
                 aria-label="${ctx.state.t('Encrypt TXT')}",
                 data-confirm-type="info",
                 data-confirm-show-cancel-button="false",
                 data-confirm-prompt-title="${ctx.state.t('Encrypt TXT')}",
                 data-confirm-prompt-html="${eHTML.replaceAll('"', "'")}"
               ><i class="fa fa-info-circle"></i></a>
             </form>
           </li>
         </ul>
      `.trim()
      );
      i++;
    }

    ctx.body = root.toString();
    return;
  }

  if (!isSANB(ctx.request.body.email) || !isEmail(ctx.request.body.email))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

  if (
    !isSANB(ctx.request.body.domain) ||
    (!isFQDN(ctx.request.body.domain) && !isIP(ctx.request.body.domain))
  )
    throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

  if (ctx.isAuthenticated()) {
    const match = ctx.state.domains.find(
      (domain) => domain.name === ctx.request.body.domain
    );
    if (match) ctx.state.domain = match;
    else {
      ctx.state.domain = await Domains.create({
        members: [{ user: ctx.state.user._id, group: 'admin' }],
        name: ctx.request.body.domain,
        locale: ctx.locale,
        resolver: ctx.resolver,
        plan: ctx.state.user.plan
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
  } else {
    const query = {
      email: ctx.request.body.email,
      locale: ctx.locale
    };
    query[config.lastLocaleField] = ctx.locale;
    query[config.userFields.hasVerifiedEmail] = false;
    query[config.userFields.hasSetPassword] = false;
    try {
      ctx.state.user = await Users.create(query);
    } catch (err) {
      if (
        err instanceof ValidationError &&
        err.errors &&
        err.errors.email &&
        err.errors.email.kind &&
        err.errors.email.kind === 'unique'
      ) {
        ctx.logger.warn(err);
        const redirectTo = ctx.state.l('/my-account/domains/new');
        const message = ctx.translate('LOGIN_REQUIRED_FOR_ACTION');
        ctx.flash('error', message);
        if (ctx.accepts('html')) {
          ctx.redirect(redirectTo);
        } else {
          ctx.body = { redirectTo };
        }

        return;
      }

      throw err;
    }

    await ctx.login(ctx.state.user);

    // send verification email if needed
    if (!ctx.state.user[config.userFields.hasVerifiedEmail]) {
      try {
        ctx.state.user = await sendVerificationEmail(ctx);
        ctx.flash('custom', {
          title: ctx.request.t('Success'),
          text: ctx.translate('EMAIL_VERIFICATION_SENT'),
          type: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 10000,
          position: 'top'
        });
      } catch (err) {
        // if email failed to send then verify the user automatically
        if (err.has_email_failed) {
          ctx.logger.fatal(err);
          ctx.state.user[config.userFields.hasVerifiedEmail] = true;

          try {
            ctx.state.user = await ctx.state.user.save();
          } catch (err) {
            ctx.logger.fatal(err);
            ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
          }
        } else {
          ctx.logger.error(err);
        }
      }
    }

    try {
      // create the domain
      ctx.state.domain = await Domains.create({
        members: [{ user: ctx.state.user._id, group: 'admin' }],
        name: ctx.request.body.domain,
        locale: ctx.locale,
        skip_verification: !boolean(ctx.query.redirect_to_domain),
        resolver: ctx.resolver,
        plan: ctx.state.user.plan
      });

      // create a default alias for the user pointing to the admin
      await Aliases.create({
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients: [ctx.state.user.email],
        locale: ctx.locale
      });
    } catch (err) {
      ctx.logger.warn(err);
      // if there was a payment required error before creating the domain
      // it indicates that the domain was most likely a malicious extension
      // redirect to /my-account/domains/new?domain=$domain&plan=enhanced_protection
      if (err && err.isBoom && err.output && err.output.statusCode === 402) {
        const redirectTo = ctx.state.l(
          `/my-account/billing/upgrade?plan=enhanced_protection&domain=${ctx.request.body.domain}`
        );
        if (ctx.accepts('html')) ctx.redirect(redirectTo);
        else ctx.body = { redirectTo };
        return;
      }

      // otherwise just flash the error message
      ctx.flash('error', err.message);
    }
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
  }

  // prompt user if they want to upgrade
  if (
    ctx.state.domain &&
    ctx.isAuthenticated() &&
    ctx.state.user.plan === 'free'
  ) {
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(
        ctx.state.domain.name
      )}/billing?plan=enhanced_protection`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  //
  // redirect user to setup forwarding on the domain with our guide
  // (this overrides the FAQ tutorial and helps people use our interface and Verify Records button)
  //
  if (ctx.isAuthenticated() && ctx.state.domain) {
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  return next();
}

module.exports = onboard;
