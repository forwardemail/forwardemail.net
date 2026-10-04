/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const config = require('#config');
const getZoneFile = require('#helpers/get-zone-file');

// download every DNS record the domain needs as a zone file
async function retrieveZoneFile(ctx) {
  const name = punycode.toASCII(ctx.state.domain.name).toLowerCase();

  // a domain on the free plan keeps its current forwarding TXT records
  const existingTXT = [];
  if (ctx.state.domain.plan === 'free') {
    try {
      const records = await ctx.resolver.resolveTxt(name, { purgeCache: true });
      for (const record of records) {
        const value = Array.isArray(record) ? record.join('') : record;
        if (
          typeof value === 'string' &&
          (value.startsWith(`${config.recordPrefix}=`) ||
            value.startsWith(`${config.recordPrefix}-port=`))
        )
          existingTXT.push(value);
      }
    } catch (err) {
      ctx.logger.warn(err);
    }
  }

  ctx.type = 'text/plain; charset=utf-8';
  ctx.attachment(`${name}.zone`);
  ctx.set('Cache-Control', 'no-store');
  ctx.body = getZoneFile(ctx.state.domain, ctx.state.user, { existingTXT });
}

module.exports = retrieveZoneFile;
