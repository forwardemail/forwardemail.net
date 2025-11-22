/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const QRCode = require('qrcode');
const RE2 = require('re2');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const shortID = require('mongodb-short-id');
const titleize = require('titleize');

const Aliases = require('#models/aliases');
const config = require('#config');
const env = require('#config/env');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const isValidPassword = require('#helpers/is-valid-password');
const { encrypt } = require('#helpers/encrypt-decrypt');

//
// (this punctuation stuff is borrowed from our work with `spamscanner`)
// punctuation characters
// (need stripped from tokenization)
// <https://github.com/regexhq/punctuation-regex>
// NOTE: we prepended a normal "-" hyphen since it was missing
const PUNCTUATION_REGEX = new RE2(
  /[-‒–—―|$&~=\\/⁄@+*!?({[\]})<>‹›«».;:^‘’“”'",،、`·•†‡°″¡¿※#№÷×%‰−‱¶′‴§_‖¦]/g
);

async function retrieveQRCode(ctx) {
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
  );

  try {
    const alias = await Aliases.findById(ctx.state.alias._id)
      .select('+tokens.hash +tokens.salt')
      .exec();

    if (alias.name === '*')
      throw Boom.badRequest(
        ctx.translateError('CANNOT_CREATE_TOKEN_FOR_CATCHALL')
      );

    if (alias.name.startsWith('/'))
      throw Boom.badRequest(
        ctx.translateError('CANNOT_CREATE_TOKEN_FOR_REGEX')
      );

    if (!Array.isArray(alias.tokens) || alias.tokens.length === 0)
      throw Boom.badRequest(ctx.translateError('ALIAS_NO_GENERATED_PASSWORD'));

    if (!isSANB(ctx.request.body.password))
      throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

    //
    // rate limiting (checks if we have had more than 5 failed auth attempts in a row)
    //
    const count = await ctx.client.incrby(
      `auth_limit_${config.env}:${ctx.state.user.id}`,
      0
    );

    if (count >= config.smtpLimitAuth)
      throw Boom.forbidden(ctx.translateError('ALIAS_RATE_LIMITED'));

    // trim password
    ctx.request.body.password = ctx.request.body.password.trim();

    // ensure that the token is valid
    const isValid = await isValidPassword(
      alias.tokens,
      ctx.request.body.password,
      alias
    );

    if (!isValid) {
      // increase failed counter by 1
      const key = `auth_limit_${config.env}:${ctx.state.user.id}`;
      await ctx.client
        .pipeline()
        .incr(key)
        .pexpire(key, config.smtpLimitAuthDuration)
        .exec();
      throw Boom.forbidden(ctx.translateError('INVALID_PASSWORD'));
    }

    // Clear authentication limit for this user
    await ctx.client.del(`auth_limit_${config.env}:${ctx.state.user.id}`);

    // we use shortID to generate shorter querystring for less complicated QR code
    // (this same logic is in app/controllers/web/index.js)
    const username = `${alias.name}@${ctx.state.domain.name}`;
    const appleLink = `${
      config.urls.web
    }/c/${username}.mobileconfig?a=${shortID.longToShort(alias.id)}&p=${encrypt(
      ctx.request.body.password
    )}`;
    const appleImgSrc = await QRCode.toDataURL(appleLink, {
      margin: 0,
      width: 200
    });

    /*
    const k9Link = `${
      config.urls.web
    }/c/${username}.k9s?a=${shortID.longToShort(alias.id)}&p=${encrypt(
      ctx.request.body.password
    )}`;
    const k9ImgSrc = await QRCode.toDataURL(k9Link, {
      margin: 0,
      width: 200
    });
    */

    const name = titleize(humanize(alias.name.replace(PUNCTUATION_REGEX, ' ')));

    // <https://gist.github.com/titanism/4a1a2816e0b57a5fa930f449256b75f6>
    //
    // 3 = TLS/SSL connection security
    // if (env.IMAP_PORT === 993 || env.IMAP_PORT === 2993) = 3
    // if (!env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production') = 3
    // otherwise 1 or 2 (probably 2)
    //
    // 1 = Password (cleartext) authentication
    //
    const imapTLS = env.IMAP_PORT === 993 || env.IMAP_PORT === 2993 ? 3 : 2;
    const smtpTLS =
      !env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production' ? 3 : 2;
    const thunderbirdQRCode = await QRCode.toDataURL(
      `[1,[1,1],[0,"${env.IMAP_HOST}",${env.IMAP_PORT},${imapTLS},1,"${username}","${username}","${ctx.request.body.password}"],[[[0,"${env.SMTP_HOST}",${env.SMTP_PORT},${smtpTLS},1,"${username}","${ctx.request.body.password}"],["${username}","${name}"]]]]`,
      {
        margin: 0,
        width: 200
      }
    );

    const html = ctx.translate(
      'ALIAS_GENERATED_PASSWORD',
      username,
      username,
      ctx.request.body.password,
      ctx.request.body.password,
      appleImgSrc,
      appleLink,
      `${username}.mobileconfig`,
      thunderbirdQRCode
      // k9ImgSrc,
      // k9Link,
      // `${username}.k9s`
    );

    const swal = {
      title: ctx.request.t('Success'),
      html,
      type: 'success',
      timer: ms('10m'),
      position: 'top',
      allowEscapeKey: false,
      allowOutsideClick: false,
      focusConfirm: false,
      confirmButtonText: ctx.translate('CLOSE_POPUP'),
      grow: 'row'
    };
    ctx.flash('custom', swal);
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }
  } catch (err) {
    if (err && err.isBoom) throw err;
    if (isErrorConstructorName(err, 'ValidationError')) throw err;
    ctx.logger.fatal(err);

    if (ctx.api) {
      throw ctx.translateError('UNKNOWN_ERROR');
    } else {
      ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
      const redirectTo = ctx.state.l(
        `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  }
}

module.exports = retrieveQRCode;
