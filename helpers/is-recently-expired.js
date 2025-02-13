/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');
const ms = require('ms');
const pWaitFor = require('p-wait-for');

// dynamically import @cleandns/whois-rdap
let whois;
import('@cleandns/whois-rdap').then((obj) => {
  whois = obj.whois;
});

async function isRecentlyExpired(input) {
  if (typeof input !== 'string') throw new TypeError('Domain is not string');

  const domain = punycode.toASCII(input);
  if (!isFQDN(domain)) throw new TypeError('Domain is not a FQDN');

  console.log('domain', domain);
  console.log('whois', whois);

  if (!whois) await pWaitFor(() => Boolean(whois), { timeout: ms('15s') });

  const res = await whois(domain);

  if (!res.found) return false;
  console.log('res', res);
}

module.exports = isRecentlyExpired;
