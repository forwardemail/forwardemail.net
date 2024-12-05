/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const pFilter = require('p-filter');
const { boolean } = require('boolean');

const DenylistError = require('#helpers/denylist-error');
const config = require('#config');
const isAllowlisted = require('#helpers/is-allowlisted');

async function isBackscatterer(value, client, resolver) {
  if (!Array.isArray(value)) value = [value];

  const filtered = await pFilter(
    value,
    async (v) => {
      // filter out IP only values
      if (!isIP(v)) return false;

      // filter out IP's that were allowlisted
      // (this includes local IP's and our own servers)
      // (isAllowlisted function will perform reverse lookup on IP address)
      if (await isAllowlisted(v, client, resolver)) return false;

      return true;
    },
    { concurrency: config.concurrency }
  );

  const results =
    filtered.length > 0
      ? await client.mget(filtered.map((v) => `backscatter:${v}`))
      : [];

  for (const [i, result] of results.entries()) {
    if (!boolean(result)) continue;
    const v = filtered[i];
    throw new DenylistError(
      `MAIL FROM missing or has a mailer-daemon like From header, and the IP ${v} is listed at https://www.backscatterer.org/index.php?target=test&ip=${v} ;`,
      421,
      v
    );
  }
}

module.exports = isBackscatterer;
