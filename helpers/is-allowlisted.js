/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { isIP } = require('node:net');

const { boolean } = require('boolean');
const isFQDN = require('is-fqdn');
const isEmail = require('#helpers/is-email');

const REGEX_LOCALHOST = require('#helpers/regex-localhost');
const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');

/**
 * Check if a value is allowlisted
 * @param {string} val - The value to check (IP, domain, or email)
 * @param {object} client - Redis client
 * @param {object} resolver - DNS resolver (Tangerine)
 * @param {boolean} ignoreRedis - Whether to skip Redis check
 * @returns {Promise<string|false>} - Returns reason string if allowlisted, false otherwise
 */
async function isAllowlisted(val, client, resolver, ignoreRedis = false) {
  const lc = punycode.toASCII(val).toLowerCase().trim();

  // check hard-coded allowlist
  if (config.allowlist.has(lc)) return `config.allowlist (${lc})`;

  // check hard-coded truth source list
  if (config.truthSources.has(lc)) return `config.truthSources (${lc})`;

  //
  // TODO: we need to ensure we're not adding this in `jobs/update-umbrella.js`
  //
  // if it ends with any of the test/restricted extensions return false
  // <https://en.wikipedia.org/wiki/Top-level_domain#Reserved_domains:~:text=%5B8%5D-,Reserved%20domains,-%5Bedit%5D>
  if (
    isFQDN(lc) &&
    (lc.endsWith('.arpa') ||
      config.testDomains.some((s) => lc.endsWith(`.${s}`)))
  )
    return false;

  // if it's localhost or local IP address then return early
  if (isIP(val) && REGEX_LOCALHOST.test(val)) return `localhost (${val})`;

  // if it is a FQDN and ends with restricted domain
  if (
    isFQDN(lc) &&
    !lc.endsWith('.edu.cn') &&
    !lc.endsWith('.edu.eg') &&
    !lc.endsWith('.edu.ge') &&
    !lc.endsWith('.edu.gr') &&
    !lc.endsWith('.edu.gt') &&
    !lc.endsWith('.edu.hk') &&
    !lc.endsWith('.edu.kg') &&
    !lc.endsWith('.edu.lk') &&
    !lc.endsWith('.edu.my') &&
    !lc.endsWith('.edu.om') &&
    !lc.endsWith('.edu.pe') &&
    !lc.endsWith('.edu.pk') &&
    !lc.endsWith('.edu.pl') &&
    !lc.endsWith('.edu.sg') &&
    !lc.endsWith('.edu.vn') &&
    !lc.endsWith('.edu.za') &&
    !lc.endsWith('.edu.eu.org')
  ) {
    const matchedRestricted = config.restrictedDomains.find(
      (ext) => lc === ext || lc.endsWith(`.${ext}`)
    );
    if (matchedRestricted)
      return `config.restrictedDomains (${matchedRestricted})`;
  }

  // if it was an email address or domain and was our domain then whitelist
  if (isEmail(val)) {
    const domain = parseHostFromDomainOrAddress(val);
    const root = parseRootDomain(domain);
    if (root === env.WEB_HOST) return `own domain (${env.WEB_HOST})`;
  } else if (isFQDN(lc)) {
    const root = parseRootDomain(lc);
    if (root === env.WEB_HOST) return `own domain (${env.WEB_HOST})`;
    // check if root domain was allowlisted
    if (root !== lc) {
      const rootResult = await isAllowlisted(
        root,
        client,
        resolver,
        ignoreRedis
      );
      if (rootResult) return `root domain (${root}) → ${rootResult}`;
    }
  } else if (isIP(val)) {
    try {
      // reverse lookup IP and if it was allowlisted then return early
      const [clientHostname] = await resolver.reverse(val);
      if (isFQDN(clientHostname)) {
        // check domain
        const hostnameResult = await isAllowlisted(
          clientHostname,
          client,
          resolver,
          ignoreRedis
        );
        if (hostnameResult)
          return `reverse DNS (${clientHostname}) → ${hostnameResult}`;
        // check root domain (if differed)
        const root = parseRootDomain(clientHostname);
        if (clientHostname !== root) {
          const rootResult = await isAllowlisted(
            root,
            client,
            resolver,
            ignoreRedis
          );
          if (rootResult)
            return `reverse DNS (${clientHostname}) → root (${root}) → ${rootResult}`;
        }
      }
    } catch (err) {
      //
      // NOTE: the native Node.js DNS module would throw an error previously
      //       <https://github.com/nodejs/node/issues/3112#issuecomment-1452548779>
      //
      if (env.NODE_ENV !== 'production') logger.debug(err);
    }
  }

  if (ignoreRedis) return false;

  const result = await client.get(`allowlist:${lc}`);

  if (boolean(result)) return `Redis allowlist:${lc}`;

  return false;
}

module.exports = isAllowlisted;
