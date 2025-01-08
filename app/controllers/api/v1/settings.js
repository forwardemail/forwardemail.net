/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const getSettings = require('#helpers/get-settings');

async function settings(ctx) {
  ctx.body = await getSettings(ctx.query.domain, ctx.resolver, ctx.locale);
}

module.exports = settings;
