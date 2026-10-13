/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Whether a domain registered within the past 90 days was in use before:
// someone else had it, it expired, and it was registered again. That is how
// old accounts are taken over, as whoever has the name now gets the
// password resets sent to its old email addresses. A new name has no past.
//
// Either of two signs is enough:
//
//   1. Its registrar is a drop-catch network's numbered company
//      ("DropCatch.com 768 LLC", "Gname 298 Inc"). These exist to catch
//      names as they are deleted, and hold what they catch for at least 60
//      days (a new registration cannot be transferred sooner).
//   2. The Internet Archive has a capture of it, or of a subdomain, from
//      before it was registered.
//
// In a sample of 790 new .com, .net and .org domains, 17% had such a
// capture. Only 5% of those were with a drop-catch company; most were
// registered again at an ordinary registrar. A parked or for-sale page, or
// MX records, told them apart no better than chance.
//
// A lookup that fails throws, so the caller keeps treating the domain as
// it did before (it cannot tell a new name from an old one).
//

const ms = require('ms');
const undici = require('undici');

const pkg = require('../package.json');

const config = require('#config');
const withDeadline = require('#helpers/with-deadline');

// (lowercased, with single spaces)
const DROP_CATCH_REGISTRAR =
  /^(?:dropcatch\.com \d+ llc|snapnames \d+,? llc|gname \d+ inc\.?|namepal\.com #\d+(?:,? llc)?|sav\.com,? llc - \d+|dynadot\d+ llc|unstoppableus\d+ llc)$/;

// (how long the archive is asked, and how long a caller waits for it)
const TIMEOUT_MS = ms('10s');
const DEFAULT_WAIT_MS = 1500;
const STILL_LOOKING = Symbol('still looking');
// (the answer is a line or two)
const MAX_BYTES = 64 * 1024;
// (the answer for a registration does not change: its date is in the key)
const CACHE_TTL_MS = ms('30d');
// (a failed lookup is not asked again for a few minutes)
const ERROR_TTL_MS = ms('5m');

// (lookups running in this process, by cache key)
const running = new Map();

function isDropCatchRegistrar(name) {
  return (
    typeof name === 'string' &&
    DROP_CATCH_REGISTRAR.test(name.trim().replace(/\s+/g, ' ').toLowerCase())
  );
}

// (YYYYMMDDhhmmss, in UTC, as the archive writes it)
function toTimestamp(date) {
  return date.toISOString().replace(/\D/g, '').slice(0, 14);
}

/**
 * The time of the first capture of a domain or its subdomains up to `to`,
 * or null when there is none.
 *
 * @param   {string}  domain
 * @param   {Date}    to
 * @returns {Promise<string|null>}  YYYYMMDDhhmmss
 */
async function getCaptureBefore(domain, to) {
  const url = new URL(getPreviousDomainUse.CDX_URL);
  url.search = new URLSearchParams({
    url: domain,
    matchType: 'domain',
    to: toTimestamp(to),
    limit: '1',
    fl: 'timestamp',
    output: 'json'
  }).toString();

  // (the timeout covers reading the answer too)
  const { statusCode, body } = await undici.request(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      'User-Agent': `Mozilla/5.0 (compatible; ${pkg.name}/${pkg.version}; +${config.urls.web})`
    }
  });

  let text = '';
  for await (const chunk of body) {
    text += chunk.toString();
    if (text.length > MAX_BYTES) break;
  }

  if (statusCode !== 200)
    throw new Error(`Web archive answered ${statusCode} for ${domain}`);

  // ([] for none, else a header row and the capture: [["timestamp"],
  //  ["20210228152825"]])
  const rows = JSON.parse(text);
  if (!Array.isArray(rows))
    throw new TypeError(`Web archive answer for ${domain} is not a list`);
  const row = rows.find(
    (row) => Array.isArray(row) && /^\d{14}$/.test(String(row[0]))
  );
  if (rows.length > 0 && !row)
    throw new TypeError(`Web archive answer for ${domain} has no capture`);
  return row ? String(row[0]) : null;
}

async function lookUp(domain, created, client, key) {
  let cached;
  try {
    cached = JSON.parse((await client.get(key)) || 'null');
  } catch {
    // (asked again)
  }

  if (cached && typeof cached === 'object') {
    if (typeof cached.error === 'string') throw new Error(cached.error);
    if (cached.capturedAt === null || typeof cached.capturedAt === 'string')
      return cached.capturedAt;
  }

  let capturedAt;
  try {
    // (a second before it was registered: what the new owner put up since
    //  is not its past)
    capturedAt = await getCaptureBefore(
      domain,
      new Date(created.getTime() - 1000)
    );
  } catch (err) {
    await client
      .set(key, JSON.stringify({ error: err.message }), 'PX', ERROR_TTL_MS)
      .catch(() => {});
    throw err;
  }

  await client
    .set(key, JSON.stringify({ capturedAt }), 'PX', CACHE_TTL_MS)
    .catch(() => {});
  return capturedAt;
}

/**
 * How a domain registered within the past 90 days was in use before, or
 * null when nothing says it was. Throws when that cannot be told, also when
 * the archive takes longer than `options.wait`: the lookup then goes on
 * (for up to 10 seconds), and its answer is kept for the next time.
 *
 * @param   {string}  domain    Its root domain, in ASCII
 * @param   {object}  response  Its WHOIS/RDAP lookup (`@forwardemail/whois-rdap`)
 * @param   {object}  client    Redis client
 * @param   {object}  [options]
 * @param   {number}  [options.wait]  ms to wait for the archive (default 1500)
 * @returns {Promise<{reason: string, registrar?: string, capturedAt?: string}|null>}
 */
async function getPreviousDomainUse(domain, response, client, options = {}) {
  const registrar = response?.registrar?.name;
  if (isDropCatchRegistrar(registrar))
    return { reason: 'drop_catch_registrar', registrar };

  const created = new Date(response?.ts?.created);
  if (Number.isNaN(created.getTime()))
    throw new TypeError(`No registration date for ${domain}`);

  const key = `domain_history:${domain}:${created.getTime()}`;
  let lookup = running.get(key);
  if (!lookup) {
    lookup = lookUp(domain, created, client, key).finally(() => {
      running.delete(key);
    });
    running.set(key, lookup);
  }

  const capturedAt = await withDeadline(
    lookup,
    options.wait ?? DEFAULT_WAIT_MS,
    STILL_LOOKING
  );
  if (capturedAt === STILL_LOOKING) {
    const err = new Error(`Web archive is still being asked about ${domain}`);
    err.code = 'ESTILLLOOKING';
    throw err;
  }

  return capturedAt ? { reason: 'web_archive', capturedAt } : null;
}

// (where the archive's capture index is asked)
getPreviousDomainUse.CDX_URL = 'https://web.archive.org/cdx/search/cdx';

module.exports = getPreviousDomainUse;
module.exports.isDropCatchRegistrar = isDropCatchRegistrar;
