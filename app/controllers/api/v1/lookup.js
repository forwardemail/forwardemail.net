/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

const getForwardingConfiguration = require('#helpers/get-forwarding-configuration');

async function lookup(ctx) {
  ctx.body = await getForwardingConfiguration({
    verificationRecord: ctx.query.verification_record,
    // the host that published the verification record (when given, the
    // domain found must be that host or a parent of it)
    domainName: isSANB(ctx.query.domain) ? ctx.query.domain : undefined,
    username: isSANB(ctx.query.username)
      ? ctx.query.username.toLowerCase()
      : false,
    ignoreBilling: ctx.query.ignore_billing,
    client: ctx.client,
    locale: ctx.locale
  });
}

module.exports = lookup;
