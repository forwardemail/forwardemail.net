/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// What the latest domain check (`helpers/check-domain-and-act`) flagged a
// domain for, kept in Redis so other checks can take it into account: a
// flagged domain is not approved for outbound SMTP automatically (see
// `helpers/check-and-auto-approve-smtp`).
//
// The check runs when a domain is created (it is held as pending until
// that check ends, at most 10 minutes) and every hour for domains with
// forwarding records, or not approved for SMTP yet with the records it
// needs (verifying SMTP saves them). A verdict stays until a clean check clears it: a
// domain flagged when it was created and verified months later is still
// held. A check that could not see what the domain was flagged for (its
// DNS lookup failed, it points to 0.0.0.0 itself, its page could not be
// read, or the disposable email domain list could not be) keeps that, for
// 90 days after it was last seen. A dry run leaves it as it is. It expires
// after a year without a check (a deleted domain's).
//

const ms = require('ms');

const VERDICT_TTL_MS = ms('365d');
// (a category no check could see again is kept this long after it was)
const UNSEEN_TTL_MS = ms('90d');
// (a new domain is held this long at most while its first check runs)
const PENDING_TTL_MS = ms('10m');
const PENDING = 'domain_check_pending';
// (what a domain is held for when its verdict cannot be read)
const UNAVAILABLE = 'domain_check_unavailable';

// (whether a domain is held only until its verdict can be had)
function isAwaitingVerdict(categories) {
  return (
    categories.length > 0 &&
    categories.every(
      (category) => category === PENDING || category === UNAVAILABLE
    )
  );
}

const VERDICT_KEY_PREFIX = 'domain_check_verdict:';
// (the code of the error for a stored value that is not a verdict)
const INVALID_VERDICT = 'INVALID_DOMAIN_CHECK_VERDICT';

function getKey(domainId) {
  return `${VERDICT_KEY_PREFIX}${String(domainId)}`;
}

function getValue(categories, seen = {}) {
  const now = new Date().toISOString();
  return JSON.stringify({
    categories,
    checked_at: now,
    seen: Object.fromEntries(
      categories.map((category) => [category, seen[category] || now])
    )
  });
}

/**
 * @param   {object}    client      Redis client
 * @param   {*}         domainId
 * @param   {string[]}  categories  Categories the domain is flagged for
 * @param   {object}    [seen]      Category → when a check last saw it (ISO
 *                                  8601), now when not given
 * @returns {Promise<void>}
 */
async function setDomainCheckVerdict(client, domainId, categories, seen = {}) {
  if (!client || categories.length === 0) return;
  await client.set(
    getKey(domainId),
    getValue(categories, seen),
    'PX',
    VERDICT_TTL_MS
  );
}

// (sets the value, or deletes it for an empty one, only while it is still
//  the one read: "" for none)
const REPLACE_SCRIPT = `
local current = redis.call('GET', KEYS[1]) or ''
if current ~= ARGV[1] then return 0 end
if ARGV[2] == '' then
  redis.call('DEL', KEYS[1])
else
  redis.call('SET', KEYS[1], ARGV[2], 'PX', ARGV[3])
end
return 1`;

/**
 * Replace a verdict read with `getDomainCheckVerdictValue` (clear it for no
 * categories), unless another check changed it since: two checks at once
 * (the one when a domain is created and the hourly one) do not undo each
 * other.
 *
 * @param   {object}       client      Redis client
 * @param   {*}            domainId
 * @param   {object}       verdict
 * @param   {string|null}  verdict.read        The value read
 * @param   {string[]}     verdict.categories
 * @param   {object}       [verdict.seen]      See `setDomainCheckVerdict`
 * @returns {Promise<boolean>}  Whether it was replaced
 */
async function replaceDomainCheckVerdict(
  client,
  domainId,
  { read, categories, seen = {} }
) {
  const replaced = await client.eval(
    REPLACE_SCRIPT,
    1,
    getKey(domainId),
    read || '',
    categories.length > 0 ? getValue(categories, seen) : '',
    VERDICT_TTL_MS
  );
  return replaced === 1;
}

/**
 * Hold a new domain while its first check runs (not one with a verdict).
 *
 * @param   {object}  client    Redis client
 * @param   {*}       domainId
 * @returns {Promise<void>}
 */
async function setDomainCheckPending(client, domainId) {
  if (!client) return;
  await client.set(
    getKey(domainId),
    JSON.stringify({ categories: [PENDING], checked_at: null }),
    'PX',
    PENDING_TTL_MS,
    'NX'
  );
}

/**
 * The stored value of a domain's verdict (see `replaceDomainCheckVerdict`).
 *
 * @param   {object}  client    Redis client
 * @param   {*}       domainId
 * @returns {Promise<string|null>}
 */
async function getDomainCheckVerdictValue(client, domainId) {
  if (!client) throw new TypeError('A Redis client is required');
  return client.get(getKey(domainId));
}

/**
 * The categories a domain was last flagged for, or null when it was not.
 * Throws when it cannot be read (no Redis client, a Redis error, or a value
 * that is not a verdict): a caller must not take that for "not flagged".
 *
 * @param   {object}  client    Redis client
 * @param   {*}       domainId
 * @returns {Promise<{categories: string[], checked_at: string}|null>}
 */
async function getDomainCheckVerdict(client, domainId) {
  return parseDomainCheckVerdict(
    await getDomainCheckVerdictValue(client, domainId),
    domainId
  );
}

/**
 * A stored value as a verdict (see `getDomainCheckVerdict`).
 *
 * @param   {string|null}  value
 * @param   {*}            domainId
 * @returns {{categories: string[], checked_at: string}|null}
 */
function parseDomainCheckVerdict(value, domainId) {
  if (!value) return null;
  let verdict;
  try {
    verdict = JSON.parse(value);
  } catch {}

  if (!Array.isArray(verdict?.categories)) {
    const err = new TypeError(`Invalid domain check verdict for ${domainId}`);
    err.code = INVALID_VERDICT;
    throw err;
  }

  return verdict.categories.length > 0 ? verdict : null;
}

module.exports = {
  UNSEEN_TTL_MS,
  PENDING,
  UNAVAILABLE,
  isAwaitingVerdict,
  setDomainCheckPending,
  INVALID_VERDICT,
  setDomainCheckVerdict,
  replaceDomainCheckVerdict,
  getDomainCheckVerdictValue,
  parseDomainCheckVerdict,
  getDomainCheckVerdict
};
