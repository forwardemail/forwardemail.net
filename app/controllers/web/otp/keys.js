/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

async function keys(ctx) {
  // this is like a migration, it will automatically add token + keys if needed
  await ctx.state.user.save();
  return ctx.render('otp/setup');
}

module.exports = keys;
