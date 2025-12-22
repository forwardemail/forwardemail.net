/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isFQDN = require('is-fqdn');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const safeStringify = require('fast-safe-stringify');
const undici = require('undici');

const SMTPError = require('#helpers/smtp-error');
const _ = require('#helpers/lodash');
const config = require('#config');
const logger = require('#helpers/logger');

// dynamically import @forwardemail/whois-rdap
let whois;
import('@forwardemail/whois-rdap').then((obj) => {
  whois = obj.whois;
});

//
// TODO: there's still a core bug with this package
//       (but we wrap all our usage with try/catch currently so we're OK)
//       <https://github.com/cleandns-inc/tool-whois/issues/12>
//

// <https://github.com/cleandns-inc/tool-whois/issues/3>
// <https://github.com/LayeredStudio/whoiser/pull/121>
// let whoisDomain;
// import('whoiser').then((obj) => {
//   whoisDomain = obj.whoisDomain;
// });

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
    response = await whois(domain, {
      fetch: undici.fetch
    });
    // store to cache the WHOIS lookup for 24 hours
    await client.set(
      `whois:${domain}`,
      safeStringify(response),
      'PX',
      ms('1d')
    );
  }

  let err;

  if (!response.found) return { err, response };

  // if the domain is pending deletion, update, or transfer (550)
  if (
    Array.isArray(response.status) &&
    response.status.some((s) =>
      ['pending delete', 'pending update', 'pending transfer'].includes(s)
    )
  )
    err = new SMTPError(
      `The domain ${domain} was detected as a pending state domain via WHOIS/RDAP lookup. Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars. We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
      421
    );
  // if the domain expiration date is within the past 90d
  // (safeguard for users in case they have a domain that expired they should renew it first)
  // (added 48 hour buffer to give WHOIS/RDAP data time to refresh)
  else if (
    _.isDate(response?.ts?.expires) &&
    new Date(response.ts.expires).getTime() + ms('2d') <= Date.now() &&
    new Date(response.ts.expires).getTime() + ms('2d') >= Date.now() - ms('90d')
  )
    err = new SMTPError(
      `The domain ${domain} was detected as a recently expired domain via WHOIS/RDAP lookup. Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars. We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
      421
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
      `The domain ${domain} was detected as a newly created or transferred domain via WHOIS/RDAP lookup. Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars. We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
      421
    );

  return { err, response };
}

module.exports = isExpiredOrNewlyCreated;
