/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Policies = require('@ladjs/policies');

const ensureApiTokenEnabled = require('#helpers/ensure-api-token-enabled');

const {
  loginOtpRoute,
  verifyRoute,
  userFields,
  passport,
  appName,
  turnstileEnabled,
  turnstileSecretKey
} = require('#config');
const { Users } = require('#models');

const policies = new Policies(
  {
    schemeName: appName,
    hasVerifiedEmail: userFields.hasVerifiedEmail,
    verifyRoute,
    loginRoute: '/login',
    loginOtpRoute,
    passport,
    turnstileEnabled,
    turnstileSecretKey
  },
  async (apiToken, ctx) => {
    const user = await Users.findOne({
      [userFields.apiToken]: apiToken
    });

    return ensureApiTokenEnabled(user, ctx);
  }
);

module.exports = policies;
