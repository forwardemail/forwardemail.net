/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const striptags = require('striptags');
const ms = require('ms');
const _ = require('#helpers/lodash');

const Domains = require('#models/domains');
const config = require('#config');
const createPassword = require('#helpers/create-password');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');

async function createCatchAllPassword(ctx) {
  try {
    const domain = await Domains.findById(ctx.state.domain._id).select(
      '+tokens +tokens.description +tokens.hash +tokens.salt +tokens.has_pbkdf2_migration'
    );
    if (!domain)
      throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    // domain cannot have more than 10 at once
    if (Array.isArray(domain.tokens) && domain.tokens.length >= 10)
      throw Boom.badRequest(
        ctx.translateError('DOMAIN_EXCEEDS_CATCHALL_PASSWORD_LIMIT', 10)
      );

    const description = isSANB(ctx.request.body.description)
      ? striptags(ctx.request.body.description)
      : '';

    // get user inputs
    const userInputs = [description, ctx.state.domain.name];

    for (const prop of [
      'email',
      config.passport.fields.givenName,
      config.passport.fields.familyName,
      config.userFields.receiptEmail,
      config.userFields.companyName,
      config.userFields.addressLine1,
      config.userFields.addressLine2,
      config.userFields.addressCity,
      config.userFields.addressState,
      config.userFields.addressZip,
      config.userFields.companyVAT
    ]) {
      if (isSANB(ctx.state.user[prop])) userInputs.push(ctx.state.user[prop]);
    }

    const { password, salt, hash, has_pbkdf2_migration } = await createPassword(
      ctx.request.body.new_password || null,
      _.uniq(_.compact(userInputs))
    );
    const token = domain.tokens.create({
      description,
      salt,
      hash,
      user: ctx.state.user._id,
      has_pbkdf2_migration
    });
    domain.tokens.push(token);
    domain.locale = ctx.locale;
    domain.resolver = ctx.resolver;
    domain.skip_verification = true;

    // Set audit metadata for domain update tracking
    domain.__audit_metadata = {
      user: ctx.state.user,
      ip: ctx.ip,
      userAgent: ctx.get('User-Agent')
    };

    await domain.save();

    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

    email({
      template: 'alert',
      message: {
        to,
        ...(to.includes(ctx.state.user.email)
          ? {}
          : { cc: ctx.state.user.email }),
        subject: i18n.translate(
          'ALIAS_PASSWORD_GENERATED_SUBJECT',
          locale,
          `*@${domain.name}`
        )
      },
      locals: {
        user: ctx.state.user,
        locale,
        message: i18n.translate(
          'ALIAS_PASSWORD_GENERATED',
          locale,
          `*@${domain.name}`,
          ctx.state.user.email
        )
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));

    const username = `*@${domain.name}`;

    if (ctx.api) {
      ctx.body = {
        id: token.id,
        username,
        password,
        description: token.description
      };
      return;
    }

    const html = ctx.translate(
      'ALIAS_GENERATED_PASSWORD_NO_MOBILE_CONFIG',
      username,
      username,
      password,
      password
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
    // TODO: blog about how we use `?hash=hash` to avoid the issue where
    //       window.location = someUrlWith#hash doesn't actually redirect user
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(
        domain.name
      )}/advanced-settings?hash=catch-all-passwords`
    );
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
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/advanced-settings?hash=catch-all-passwords`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  }
}

module.exports = createCatchAllPassword;
