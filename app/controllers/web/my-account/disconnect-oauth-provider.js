/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const config = require('#config');
const emailHelper = require('#helpers/email');
const i18n = require('#helpers/i18n');

const VALID_PROVIDERS = new Set(['github', 'google']);

async function disconnectOAuthProvider(ctx) {
  const { provider } = ctx.params;

  // Validate provider
  if (!VALID_PROVIDERS.has(provider))
    throw Boom.badRequest(ctx.translateError('INVALID_PROVIDER'));

  // Ensure user has verified email before allowing disconnect
  if (!ctx.state.user[config.userFields.hasVerifiedEmail])
    throw Boom.badRequest(ctx.translateError('USER_UNVERIFIED_FOR_DISCONNECT'));

  // Ensure user has a password set before allowing disconnect
  // (otherwise they would be locked out of their account)
  if (!ctx.state.user[config.userFields.hasSetPassword])
    throw Boom.badRequest(
      ctx.translateError('PASSWORD_REQUIRED_FOR_DISCONNECT')
    );

  // Get the profile ID field based on provider
  const profileIdField =
    provider === 'github'
      ? config.passport.fields.githubProfileID
      : config.passport.fields.googleProfileID;

  const accessTokenField =
    provider === 'github'
      ? config.passport.fields.githubAccessToken
      : config.passport.fields.googleAccessToken;

  const refreshTokenField =
    provider === 'github'
      ? config.passport.fields.githubRefreshToken
      : config.passport.fields.googleRefreshToken;

  // Check if the provider is actually connected
  if (!ctx.state.user[profileIdField])
    throw Boom.badRequest(
      ctx.translateError('PROVIDER_NOT_CONNECTED', provider)
    );

  // Clear the OAuth provider fields
  ctx.state.user[profileIdField] = undefined;
  ctx.state.user[accessTokenField] = undefined;
  ctx.state.user[refreshTokenField] = undefined;

  // Save the user
  ctx.state.user = await ctx.state.user.save();

  // Send notification email about the disconnection
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  emailHelper({
    template: 'alert',
    message: {
      to: ctx.state.user.email,
      subject: i18n.translate(
        'OAUTH_PROVIDER_DISCONNECTED_SUBJECT',
        ctx.locale,
        providerName
      )
    },
    locals: {
      user: ctx.state.user,
      locale: ctx.locale,
      message: i18n.translate(
        'OAUTH_PROVIDER_DISCONNECTED_MESSAGE',
        ctx.locale,
        providerName
      )
    }
  })
    .then()
    .catch((err) => ctx.logger.fatal(err));

  if (!ctx.api)
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('OAUTH_PROVIDER_DISCONNECTED', providerName),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = disconnectOAuthProvider;
