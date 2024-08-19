/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { isIP } = require('node:net');

const isLocalhost = require('is-localhost-ip');
const localhostUrl = require('localhost-url-regex');
const pWaitFor = require('p-wait-for');
const { boolean } = require('boolean');
const isFQDN = require('is-fqdn');
const { isEmail } = require('validator');

const config = require('#config');
const env = require('#config/env');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');

// dynamically import private-ip
let isPrivateIP;
import('private-ip').then((obj) => {
  isPrivateIP = obj.default;
});

// eslint-disable-next-line complexity
async function isAllowlisted(val, client, resolver) {
  const lowerCased = punycode.toASCII(val).toLowerCase().trim();

  // check hard-coded allowlist
  if (config.allowlist.has(lowerCased)) return true;

  // check hard-coded truth source list
  if (config.truthSources.has(lowerCased)) return true;

  if (!isPrivateIP) await pWaitFor(() => Boolean(isPrivateIP));

  // if it's localhost or local IP address then return early
  if (localhostUrl().test(val) || isPrivateIP(val) || (await isLocalhost(val)))
    return true;

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
  if (isEmail(val, { ignore_max_length: true })) {
    const domain = parseHostFromDomainOrAddress(val);
    const root = parseRootDomain(domain);
    if (root === env.WEB_HOST) return true;
  } else if (isFQDN(val)) {
    const root = parseRootDomain(val);
    if (root === env.WEB_HOST) return true;
  } else if (isIP(val)) {
    // reverse lookup IP and if it was allowlisted then return early
    const [clientHostname] = await resolver.reverse(val);
    if (isFQDN(clientHostname)) {
      // check domain
      if (await isAllowlisted(clientHostname, client, resolver)) return true;
      // check root domain (if differed)
      const root = parseRootDomain(clientHostname);
      if (
        clientHostname !== root &&
        (await isAllowlisted(root, client, resolver))
      )
        return true;
    }
  }

  const result = await client.get(`allowlist:${lowerCased}`);

  return boolean(result);
}

module.exports = isAllowlisted;
