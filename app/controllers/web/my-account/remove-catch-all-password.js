/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const Domains = require('#models/domains');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');

async function removeCatchAllPassword(ctx) {
  try {
    const domain = await Domains.findById(ctx.state.domain._id).select(
      '+tokens +tokens.description +tokens.hash +tokens.salt +tokens.has_pbkdf2_migration'
    );
    if (!domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    if (!isSANB(ctx.params.token_id))
      throw Boom.notFound(ctx.translate('INVALID_PASSWORD'));

    const token = domain.tokens.id(ctx.params.token_id);
    if (!token) throw Boom.notFound(ctx.translate('INVALID_PASSWORD'));

    token.remove();

    domain.locale = ctx.locale;
    domain.resolver = ctx.resolver;
    domain.skip_verification = true;
    await domain.save();

    // TODO: add emails here and elsewhere

    if (ctx.api) {
      ctx.body = {
        id: token.id,
        description: token.description
      };
      return;
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
      `/my-account/domains/${punycode.toASCII(domain.name)}/advanced-settings`
    );
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
        )}/advanced-settings`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  }
}

module.exports = removeCatchAllPassword;
