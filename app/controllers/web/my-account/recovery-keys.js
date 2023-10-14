/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

async function recoveryKeys(ctx) {
  const otpRecoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  ctx.attachment('recovery-keys.txt');
  ctx.body = otpRecoveryKeys.toString().replace(/,/g, '\n').replace(/"/g, '');
}

module.exports = recoveryKeys;
