/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The domains of disposable email services, from the daily list of
// <https://github.com/disposable/disposable-email-domains>, kept in Redis
// by `jobs/check-disposable.js` so other processes can look a domain up.
//

const { randomUUID } = require('node:crypto');

const ms = require('ms');

const DISPOSABLE_DOMAINS_KEY = 'disposable_domains';

// (a list left half written by a failed run expires on its own)
const TMP_TTL_MS = ms('1h');

/**
 * Replace the stored list in one step (readers never see it half written).
 * Each run writes its own temporary key, so two runs at once cannot mix
 * their lists.
 *
 * @param   {object}    client   Redis client
 * @param   {string[]}  domains
 * @returns {Promise<void>}
 */
async function storeDisposableDomains(client, domains) {
  const list = domains.filter(
    (domain) => typeof domain === 'string' && domain.length > 0
  );
  if (list.length === 0) return;
  const tmpKey = `${DISPOSABLE_DOMAINS_KEY}:tmp:${randomUUID()}`;
  try {
    for (let i = 0; i < list.length; i += 1000) {
      await client.sadd(
        tmpKey,
        list.slice(i, i + 1000).map((domain) => domain.toLowerCase())
      );
      if (i === 0) await client.pexpire(tmpKey, TMP_TTL_MS);
    }

    // (RENAME keeps the temporary key's expiry)
    const results = await client
      .multi()
      .rename(tmpKey, DISPOSABLE_DOMAINS_KEY)
      .persist(DISPOSABLE_DOMAINS_KEY)
      .exec();
    const failed = results.find(([err]) => err);
    if (failed) throw failed[0];
  } catch (err) {
    await client.del(tmpKey).catch(() => {});
    throw err;
  }
}

/**
 * The domain itself when it is on the list, or null (also without a Redis
 * client). Throws when Redis cannot be read.
 *
 * Only the exact name counts: the list has shared dynamic DNS domains
 * (ddns.net, mooo.com) whose other subdomains are not disposable email
 * services.
 *
 * @param   {object}  client  Redis client
 * @param   {string}  name    Domain name
 * @returns {Promise<string|null>}
 */
async function getListedDisposableDomain(client, name) {
  if (!client) return null;
  const domain = name.toLowerCase();
  return (await client.sismember(DISPOSABLE_DOMAINS_KEY, domain))
    ? domain
    : null;
}

module.exports = {
  storeDisposableDomains,
  getListedDisposableDomain
};
