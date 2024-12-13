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

// eslint-disable-next-line complexity
async function isAllowlisted(val, client, resolver, ignoreRedis = false) {
  const lowerCased = punycode.toASCII(val).toLowerCase().trim();

  // check hard-coded allowlist
  if (config.allowlist.has(lowerCased)) return true;

  // check hard-coded truth source list
  if (config.truthSources.has(lowerCased)) return true;

  // if it's localhost or local IP address then return early
  if (isIP(val) && REGEX_LOCALHOST.test(val)) return true;

  // if it is a FQDN and ends with restricted domain
  if (
    isFQDN(val) &&
    !val.endsWith('.edu.cn') &&
    !val.endsWith('.edu.eg') &&
    !val.endsWith('.edu.ge') &&
    !val.endsWith('.edu.gr') &&
    !val.endsWith('.edu.gt') &&
    !val.endsWith('.edu.hk') &&
    !val.endsWith('.edu.kg') &&
    !val.endsWith('.edu.lk') &&
    !val.endsWith('.edu.my') &&
    !val.endsWith('.edu.om') &&
    !val.endsWith('.edu.pe') &&
    !val.endsWith('.edu.pk') &&
    !val.endsWith('.edu.pl') &&
    !val.endsWith('.edu.sg') &&
    !val.endsWith('.edu.vn') &&
    !val.endsWith('.edu.za') &&
    !val.endsWith('.edu.eu.org') &&
    config.restrictedDomains.some(
      (ext) => lowerCased === ext || lowerCased.endsWith(`.${ext}`)
    )
  )
    return true;

  // if it was an email address or domain and was our domain then whitelist
  if (isEmail(val)) {
    const domain = parseHostFromDomainOrAddress(val);
    const root = parseRootDomain(domain);
    if (root === env.WEB_HOST) return true;
  } else if (isFQDN(val)) {
    const root = parseRootDomain(val);
    if (root === env.WEB_HOST) return true;
  } else if (isIP(val)) {
    try {
      // reverse lookup IP and if it was allowlisted then return early
      const [clientHostname] = await resolver.reverse(val);
      if (isFQDN(clientHostname)) {
        // check domain
        if (await isAllowlisted(clientHostname, client, resolver, ignoreRedis))
          return true;
        // check root domain (if differed)
        const root = parseRootDomain(clientHostname);
        if (
          clientHostname !== root &&
          (await isAllowlisted(root, client, resolver, ignoreRedis))
        )
          return true;
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

  const result = await client.get(`allowlist:${lowerCased}`);

  return boolean(result);
}

module.exports = isAllowlisted;
