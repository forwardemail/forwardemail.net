/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isIP } = require('@forwardemail/validator');

function sortedDomains(ctx, next) {
  ctx.state.sortedDomains = _.clone(ctx.state.domains);
  ctx.state.sortedDomains = ctx.state.sortedDomains.filter(
    (domain) => !domain.is_global
  );
  if (
    isSANB(ctx.query.domain) &&
    (isFQDN(ctx.query.domain) || isIP(ctx.query.domain)) &&
    ctx.state.sortedDomains.some((domain) => domain.name === ctx.query.domain)
  )
    ctx.state.sortedDomains = _.sortBy(
      ctx.state.sortedDomains.map((domain, i) => ({
        ...domain,
        _key: domain.name === ctx.query.domain ? 0 : i + 1
      })),
      '_key'
    );

  return next();
}

module.exports = sortedDomains;
