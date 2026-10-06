/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Expiry of the Apple push certificates cached in Redis (`aps_certs`).
//
// helpers/get-apn-certs.js requests the Calendar, Contacts, Mail, Mgmt and
// Alerts push certificates from Apple and caches them for 360 days, a few
// days less than they are valid, so the next push after the cache expires
// requests new ones. Nothing on disk holds them, so the certificate monitor
// (ansible/playbooks/files/ssl-certificate-monitor.sh) asks this script.
//
// Usage: NODE_ENV=production node scripts/apn-cert-expiry.js
//
// Prints one tab-separated line per cached certificate:
//
//   APN_CERT <name> <notAfter> <cacheExpiresAt> <subject>
//
// with times in seconds since the epoch, and <cacheExpiresAt> -1 when the
// cache has no expiry. Prints nothing when nothing is cached (no push has
// been sent yet). Exits 1 when Redis cannot be read. Private keys are never
// printed.
//

const crypto = require('node:crypto');
const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const KEY = 'aps_certs';
const NAMES = ['Calendar', 'Contact', 'Mail', 'Mgmt', 'Alerts'];
const TIMEOUT = 30_000;

// stdout is read by the monitor; connection events go nowhere
const noop = () => {};
const silent = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop
};

const oneLine = (value) => String(value).replaceAll(/[\t\r\n]+/g, ', ');

async function main() {
  const client = new Redis(sharedConfig('BREE').redis, silent);
  try {
    const [value, pttl] = await Promise.all([
      client.get(KEY),
      client.pttl(KEY)
    ]);
    if (!value) return;

    // not the parser's message: it can quote the cached private keys
    let certs;
    try {
      certs = JSON.parse(value);
    } catch {
      throw new Error(`${KEY} does not hold valid JSON`);
    }

    const cacheExpiresAt =
      pttl > 0 ? Math.floor((Date.now() + pttl) / 1000) : -1;

    for (const name of NAMES) {
      const pem = certs?.[name]?.certificate;
      if (typeof pem !== 'string' || !pem) continue;
      const x509 = new crypto.X509Certificate(pem);
      const notAfter = Math.floor(Date.parse(x509.validTo) / 1000);
      process.stdout.write(
        [
          'APN_CERT',
          name,
          notAfter,
          cacheExpiresAt,
          oneLine(x509.subject)
        ].join('\t') + '\n'
      );
    }
  } finally {
    client.disconnect();
  }
}

const timer = setTimeout(() => {
  process.stderr.write(`Timed out reading ${KEY} from Redis\n`);
  process.exit(1);
}, TIMEOUT);

main().then(
  () => {
    clearTimeout(timer);
    process.exit(0);
  },
  (err) => {
    process.stderr.write(`${err?.message || err}\n`);
    process.exit(1);
  }
);
