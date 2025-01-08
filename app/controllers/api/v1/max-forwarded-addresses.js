/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const getMaxForwardedAddresses = require('#helpers/get-max-forwarded-addresses');

async function maxForwardedAddresses(ctx) {
  ctx.body = await getMaxForwardedAddresses(
    ctx.query.domain, // domain
    ctx.resolver, // resolver
    ctx.locale // locale
  );
}

module.exports = maxForwardedAddresses;
