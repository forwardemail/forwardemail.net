/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const pFilter = require('p-filter');
const { boolean } = require('boolean');

const config = require('#config');
const isAllowlisted = require('#helpers/is-allowlisted');

async function isSilentBanned(value, client, resolver) {
  if (!Array.isArray(value)) value = [value];

  // `value` can be anything arbitrary (IP, hostname, email address)
  // and it can be an Array of Strings or a String

  // filter out values from array if they were allowlisted
  const filtered = await pFilter(
    value,
    async (v) => {
      //
      // NOTE: `true` as the last arg makes it so this ignores redis cache and only
      //       checks for hard-coded allowlist/truth source values (and our own hostname)
      //
      const allowlisted = await isAllowlisted(
        punycode.toASCII(v).toLowerCase().trim(),
        client,
        resolver,
        true
      );
      return !allowlisted;
    },
    { concurrency: config.concurrency }
  );

  const results =
    filtered.length > 0
      ? await client.mget(filtered.map((v) => `silent:${v}`))
      : [];

  return results.some((result) => boolean(result));
}

module.exports = isSilentBanned;
