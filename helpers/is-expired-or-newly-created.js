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
const config = require('#config');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const withDeadline = require('#helpers/with-deadline');
const getPreviousDomainUse = require('#helpers/get-previous-domain-use');
const isRdapRenewalGracePeriod = require('#helpers/is-rdap-renewal-grace-period');
const {
  createDomainCheckResolvers
} = require('#helpers/create-family-resolver');
const {
  checkCloudflareFamilyDNS
} = require('#helpers/get-domain-categorization');
const normalizeRdapUrl = require('#helpers/normalize-rdap-url');
const rdapFetch = require('#helpers/rdap-fetch');

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
// Wrapped fetch function that logs errors with underlying cause
// This helps diagnose "TypeError: fetch failed" errors
// <https://github.com/nodejs/undici/issues/1248>
//
async function wrappedFetch(url, options) {
  try {
    // (redirects and every target are checked to be public)
    return await rdapFetch(url, options);
  } catch (err) {
    // Enhanced error logging for fetch failures
    if (err.cause) {
      err.underlyingCause = {
        message: err.cause.message,
        code: err.cause.code,
        name: err.cause.name,
        ...(err.cause.hostname ? { hostname: err.cause.hostname } : {}),
        ...(err.cause.address ? { address: err.cause.address } : {}),
        ...(err.cause.port ? { port: err.cause.port } : {}),
        ...(err.cause.syscall ? { syscall: err.cause.syscall } : {})
      };
    }

    err.whoisContext = {
      url: typeof url === 'string' ? url : url?.toString?.()
    };

    // Log fetch failures with context for debugging
    if (err.message === 'fetch failed' || err.name === 'TypeError') {
      logger.error(err, {
        url: err.whoisContext?.url,
        cause: err.underlyingCause
      });
    }

    throw err;
  }
}

// (Cloudflare's resolvers, one set for each Redis client; quick to give up,
//  as mail waits for them)
const resolversByClient = new WeakMap();
function getResolvers(client) {
  if (!resolversByClient.has(client))
    resolversByClient.set(
      client,
      createDomainCheckResolvers(client, logger, { timeout: 3000, tries: 1 })
    );
  return resolversByClient.get(client);
}

const REGISTRARS_BLOCKED_US =
  'Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse &mdash; we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars.';

function getNewlyCreatedError(domain) {
  return new SMTPError(
    `The domain ${domain} was detected as a newly created or transferred domain via WHOIS/RDAP lookup. ${REGISTRARS_BLOCKED_US} We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
    { responseCode: 421 }
  );
}

// (why a domain registered within the past 90 days is not let through)
function getNewDomainError(domain, reason) {
  return new SMTPError(
    `The domain ${domain} was registered within the past 90 days, and ${reason}. ${REGISTRARS_BLOCKED_US} Please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
    { responseCode: 421 }
  );
}

// (when that cannot be told: it is not let through, and asked again later)
function getUnavailableError(domain) {
  const err = new SMTPError(
    `The domain ${domain} was registered within the past 90 days, and it could not be checked right now. Please try again later, or upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
    { responseCode: 421 }
  );
  err.isCheckUnavailable = true;
  return err;
}

// (how long a failed Cloudflare lookup is not asked again)
const DNS_ERROR_TTL_MS = ms('5m');
// (how long mail waits for the archive and Cloudflare)
const WAIT_MS = 1500;

/**
 * Why a domain registered within the past 90 days cannot use the free plan,
 * or undefined when it can: a new name, not one in use before (see
 * `get-previous-domain-use`), on an extension that is not often abused,
 * that Cloudflare's filter does not block.
 *
 * @param   {string}  domain    Its root domain
 * @param   {object}  response  Its WHOIS/RDAP lookup
 * @param   {object}  client    Redis client
 * @param   {object}  [resolvers]  See `createDomainCheckResolvers`
 * @returns {Promise<SMTPError|undefined>}
 */
async function checkNewDomain(domain, response, client, resolvers) {
  if (!config.newDomainGoodDomains.some((tld) => domain.endsWith(`.${tld}`))) {
    const tld = config.goodDomains.find((tld) => domain.endsWith(`.${tld}`));
    return tld
      ? getNewDomainError(
          domain,
          `new domains ending in .${tld} need a paid plan`
        )
      : getNewlyCreatedError(domain);
  }

  //
  // (its past and Cloudflare are asked at once, and waited for 1.5 seconds
  //  at most: mail waits for them; a lookup that takes longer goes on and
  //  is kept, so the sender's next try has its answer)
  //
  const dnsErrorKey = `new_domain_dns_error:${domain}`;
  const [history, dns] = await Promise.all([
    getPreviousDomainUse(domain, response, client, { wait: WAIT_MS }).then(
      (previous) => ({ previous }),
      (err) => ({ err })
    ),
    (async () => {
      if (await client.get(dnsErrorKey).catch(() => null))
        return { dnsCategory: 'dns_error', isKept: true };
      const { familyResolver, securityResolver, resolver } =
        resolvers || getResolvers(client);
      return withDeadline(
        checkCloudflareFamilyDNS(
          domain,
          familyResolver,
          securityResolver,
          resolver
        ),
        WAIT_MS,
        { dnsCategory: 'dns_error', isLate: true }
      );
    })()
  ]);

  if (history.err) {
    if (history.err.code === 'ESTILLLOOKING') {
      logger.debug(history.err.message, { domain });
    } else {
      // (once an hour as an error: new domains wait while the archive fails)
      const claimed = await client
        .set('domain_history_error_alert', '1', 'PX', ms('1h'), 'NX')
        .catch(() => null);
      if (claimed === 'OK') logger.error(history.err, { domain });
      else logger.warn(history.err, { domain });
    }

    return getUnavailableError(domain);
  }

  const { previous } = history;
  if (previous?.reason === 'drop_catch_registrar')
    return getNewDomainError(
      domain,
      'a drop-catch registrar (one that registers names the moment they expire) holds it'
    );
  if (previous)
    return getNewDomainError(
      domain,
      'it was in use before then (the Internet Archive has it from earlier)'
    );

  if (dns.dnsCategory === 'blocked_by_cloudflare_family')
    return getNewDomainError(
      domain,
      "Cloudflare's filter for malware, phishing, and adult content blocks it"
    );
  // (its own 0.0.0.0 record hides whether Cloudflare blocks it)
  if (dns.pointsToZeroAddress)
    return getNewDomainError(
      domain,
      "it points to 0.0.0.0, which hides whether Cloudflare's filter blocks it"
    );
  if (dns.dnsCategory === 'dns_error') {
    // (a failed lookup is not asked again for 5 minutes; a slow one is,
    //  and finds its answer kept)
    if (!dns.isKept && !dns.isLate)
      await client
        .set(dnsErrorKey, '1', 'PX', DNS_ERROR_TTL_MS)
        .catch(() => null);
    return getUnavailableError(domain);
  }
}

//
// NOTE: this only gets run for domains on the free plan via MX server
//       and for newly created domains (when being created)
//
// `options.allowNewDomain`: whether a domain registered within the past 90
// days can be let through (on the free plan: see `checkNewDomain`);
// `options.resolvers`: Cloudflare's, see `createDomainCheckResolvers`
//
async function isExpiredOrNewlyCreated(input, client, options = {}) {
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
      fetch: wrappedFetch
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
      `The domain ${domain} was detected as a pending state domain via WHOIS/RDAP lookup. ${REGISTRARS_BLOCKED_US} We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
      { responseCode: 421 }
    );
  // if the domain expiration date is within the past 90d
  // (safeguard for users in case they have a domain that expired they should renew it first)
  // (added 48 hour buffer to give WHOIS/RDAP data time to refresh)
  else if (
    !isRdapRenewalGracePeriod(response.status) &&
    _.isDate(response?.ts?.expires) &&
    new Date(response.ts.expires).getTime() + ms('2d') <= Date.now() &&
    new Date(response.ts.expires).getTime() + ms('2d') >= Date.now() - ms('90d')
  )
    err = new SMTPError(
      `The domain ${domain} was detected as a recently expired domain via WHOIS/RDAP lookup. ${REGISTRARS_BLOCKED_US} We require that you please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`,
      { responseCode: 421 }
    );
  //
  // if the domain was created within the past 90d
  // (on the paid plan's path every such domain is reported; on the free
  //  plan a new name is let through, and one that was in use before is not,
  //  see `checkNewDomain`)
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
    err = options.allowNewDomain
      ? // (its root domain's past, not a subdomain's)
        await checkNewDomain(
          parseRootDomain(domain),
          response,
          client,
          options.resolvers
        )
      : getNewlyCreatedError(domain);

  return { err, response };
}

module.exports = isExpiredOrNewlyCreated;
module.exports.normalizeRdapUrl = normalizeRdapUrl;
