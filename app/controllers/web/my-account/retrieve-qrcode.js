/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const QRCode = require('qrcode');
const isSANB = require('is-string-and-not-blank');
const shortID = require('mongodb-short-id');

const ms = require('ms');
const Aliases = require('#models/aliases');
const config = require('#config');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const isValidPassword = require('#helpers/is-valid-password');
const { encrypt } = require('#helpers/encrypt-decrypt');

async function retrieveQRCode(ctx) {
  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
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
      ctx.request.body.password
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
    const k9Link = `${
      config.urls.web
    }/c/${username}.k9s?a=${shortID.longToShort(alias.id)}&p=${encrypt(
      ctx.request.body.password
    )}`;
    const k9ImgSrc = await QRCode.toDataURL(k9Link, {
      margin: 0,
      width: 200
    });

    const html = ctx.translate(
      'ALIAS_GENERATED_PASSWORD',
      username,
      username,
      ctx.request.body.password,
      ctx.request.body.password,
      appleImgSrc,
      appleLink,
      `${username}.mobileconfig`,
      k9ImgSrc,
      k9Link,
      `${username}.k9s`
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
        `/my-account/domains/${ctx.state.domain.name}/aliases`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  }
}

module.exports = retrieveQRCode;
