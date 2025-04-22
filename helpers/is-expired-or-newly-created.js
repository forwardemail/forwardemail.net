/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const safeStringify = require('fast-safe-stringify');

const SMTPError = require('#helpers/smtp-error');
const _ = require('#helpers/lodash');
const logger = require('#helpers/logger');

// dynamically import @cleandns/whois-rdap
let whois;
import('@cleandns/whois-rdap').then((obj) => {
  whois = obj.whois;
});

//
// NOTE: this only gets run for domains on the free plan via MX server
//       and for newly created domains (when being created)
//
async function isExpiredOrNewlyCreated(input, client) {
  if (typeof input !== 'string') throw new TypeError('Domain is not string');

  const domain = punycode.toASCII(input.trim().toLowerCase());
  if (!isFQDN(domain)) throw new TypeError('Domain is not a FQDN');

  if (!client) throw new TypeError('Redis client missing');

  if (!whois) await pWaitFor(() => Boolean(whois), { timeout: ms('15s') });

  // cache the whois results for 1 day
  // (usually takes 24-48 hours for propagation anyways)
  let response;

  const cache = await client.get(`whois:${domain}`);
  if (cache) {
    try {
      response = JSON.parse(cache);
      if (
        typeof response !== 'object' ||
        typeof response?.found !== 'boolean' ||
        typeof response?.ts !== 'object'
      ) {
        response = null;
        throw new TypeError('Response was invalid');
      }

      // convert the cached dates in `ts` obj to Date objects
      for (const key of Object.keys(response.ts)) {
        response.ts[key] = new Date(response.ts[key]);
      }
    } catch (err) {
      logger.fatal(err, { domain });
      client
        .del(`whois:${domain}`)
        .then()
        .catch((err) => logger.fatal(err));
    }
  }

  // if no cache then perform a WHOIS lookup
  if (!response) {
    response = await whois(domain);
    // store to cache the WHOIS lookup for 24 hours
    await client.set(
      `whois:${domain}`,
      safeStringify(response),
      'PX',
      ms('1d')
    );
  }

  let err;

  // if the domain wasn't found then assume it was recently created or expired (421)
  if (!response.found)
    err = new SMTPError(
      `${domain} WHOIS lookup failed and may be expired; this domain is temporarily blocked for abuse prevention`,
      {
        responseCode: 421
      }
    );
  // if the domain is pending deletion, update, or transfer (550)
  else if (
    ['pending delete', 'pending update', 'pending transfer'].includes(
      response.status
    )
  )
    err = new SMTPError(
      `${domain} WHOIS lookup indicates it is ${response.status}; this domain is temporarily blocked for abuse prevention`
    );
  // if the domain expiration date is within the past 90d
  // (safeguard for users in case they have a domain that expired they should renew it first)
  else if (
    _.isDate(response?.ts?.expires) &&
    new Date(response.ts.expires).getTime() <= Date.now() &&
    new Date(response.ts.expires).getTime() >= Date.now() - ms('90d')
  )
    err = new SMTPError(
      `${domain} has recently expired within the past 90 days; this domain is temporarily blocked for abuse prevention`
    );
  //
  // if the domain was created within the past 90d
  // (this is a massive deterrent to scammers as it makes them wait 3 months before they can use us)
  // (this might frustrate some folks, but prevention of being blocked by massive registrars is more important)
  //
  // NOTE: in the past we have been blocked by the following registrars/providers due to expired domain takeover
  //       (e.g. scammer takes over a recently expired domain, points it at our MX service, and takes over old emails)
  //       - GoDaddy
  //       - Hostgator
  //       - Namecheap
  //       - Wix
  //       - Canva
  //       - Gravatar
  //
  else if (
    _.isDate(response?.ts?.created) &&
    new Date(response.ts.created).getTime() >= Date.now() - ms('90d')
  )
    err = new SMTPError(
      `${domain} is a new domain and may have been acquired by a malicious actor; this domain is temporarily blocked for abuse prevention`
    );

  return { err, response };
}

module.exports = isExpiredOrNewlyCreated;
