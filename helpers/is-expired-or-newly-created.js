/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const dayjs = require('dayjs-with-plugins');
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
// `past`, when given, gets the latest date of each RDAP event in the answers
// read that shows someone held the domain before (`@forwardemail/whois-rdap`
// does not keep those events), by its `ts` key
//
const PAST_EVENTS = new Map([
  ['transfer', 'transferred'],
  ['reregistration', 'reregistered'],
  ['reinstantiation', 'reregistered']
]);

async function wrappedFetch(url, options, past) {
  try {
    // (redirects and every target are checked to be public)
    const res = await rdapFetch(url, options);
    // (not a WHOIS web page, which the package reads for some extensions)
    if (past && res.ok && !/html/i.test(res.headers.get('content-type'))) {
      try {
        const { events } = await res.clone().json();
        for (const ev of Array.isArray(events)
          ? events
          : Object.values(events || {})) {
          const key = PAST_EVENTS.get(String(ev?.eventAction).toLowerCase());
          if (!key) continue;
          const date = new Date(String(ev.eventDate).replace(/\+0{4}Z$/, 'Z'));
          if (!Number.isNaN(date.getTime()) && !(past[key] >= date))
            past[key] = date;
        }
      } catch {
        // (not JSON: the package handles it)
      }
    }

    return res;
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
  'Due to major registrars such as GoDaddy, Namecheap, and Hostgator previously blocking us due to abuse, we unfortunately have to enforce strict abuse prevention controls to block suspicious activity. Without this abuse prevention, our service would be blocked entirely from these registrars.';

// (the FAQ sections each message links to)
const NEW_DOMAINS_FAQ = `${config.urls.web}/faq#why-do-newly-registered-or-recently-expired-domains-require-a-paid-plan`;
const FREE_EXTENSIONS_FAQ = `${config.urls.web}/faq#what-domain-name-extensions-can-be-used-for-free`;

// (why a domain someone had before is not let through)
const TAKEOVER =
  "whoever has a domain receives the mail sent to its earlier owner's addresses (such as password resets)";

//
// Every message is a 421 (the sender keeps the message and tries again).
// `message` is plain text, as SMTP replies, logs and the API show it, and
// `html` is the same text with links to click, for a web page or an email.
//
function getError(message, faq = NEW_DOMAINS_FAQ) {
  const text = `${message} Learn why: ${faq}`;
  return new SMTPError(text, {
    responseCode: 421,
    html: _.escape(text).replace(
      /https?:\/\/[^\s,]*[^\s,.]/g,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    )
  });
}

function getNewlyCreatedError(domain) {
  return getError(
    `The domain ${domain} was detected as a newly created or transferred domain via WHOIS/RDAP lookup. ${REGISTRARS_BLOCKED_US} Please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
  );
}

// (why a domain registered within the past 90 days is not let through)
function getNewDomainError(domain, reason) {
  return getError(
    `The domain ${domain} was registered within the past 90 days, and ${reason}. ${REGISTRARS_BLOCKED_US} Please upgrade to a paid plan at ${config.urls.web} to use our service with this domain, or use the free plan once it is 90 days old.`
  );
}

// (when that cannot be told: it is not let through, and asked again later)
function getUnavailableError(domain) {
  const err = getError(
    `The domain ${domain} was registered within the past 90 days, and Cloudflare's filter for malware, phishing, and adult content could not be checked for it right now. This is a temporary error, so the message will be retried, and accepted once the check passes. You can also upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
  );
  err.isCheckUnavailable = true;
  return err;
}

//
// A new domain that needs a paid plan only from `config.newDomainNoticeEndsAt`
// is let through until then, and told why once (see `get-forwarding-addresses`),
// unless it is 90 days old by then
//
function getNoticeError(domain, response, reason) {
  const endsAt = dayjs.utc(config.newDomainNoticeEndsAt);
  const oldAt = dayjs.utc(response.ts.created).add(90, 'day');
  if (!oldAt.isAfter(endsAt)) return;
  const date = `${endsAt.format('MMMM D, YYYY')} (UTC)`;
  const err = getError(
    `Starting ${date}, mail to ${domain} will be refused until ${oldAt.format(
      'MMMM D, YYYY'
    )}, when the domain is 90 days old, unless it is on a paid plan: it was registered within the past 90 days, and ${reason}. Until then, its mail is forwarded as before. ${REGISTRARS_BLOCKED_US} To keep receiving mail, please upgrade to a paid plan at ${
      config.urls.web
    }, or move to another domain, before ${date}.`
  );
  err.isNotice = true;
  err.date = date;
  return err;
}

// (how long a failed Cloudflare lookup is not asked again)
const DNS_ERROR_TTL_MS = ms('5m');
// (how long mail waits for the archive and Cloudflare)
const WAIT_MS = 1500;

/**
 * Why a domain registered within the past 90 days cannot use the free plan,
 * or undefined when it can: a new name on an extension the free plan takes
 * for new domains (not .cc, .xyz and the like), not transferred from another
 * registrar or registered again (its RDAP record), not in use before (see
 * `get-previous-domain-use`), that Cloudflare's filter does not block.
 *
 * @param   {string}  domain    Its root domain
 * @param   {object}  response  Its WHOIS/RDAP lookup
 * @param   {object}  client    Redis client
 * @param   {object}  [resolvers]  See `createDomainCheckResolvers`
 * @returns {Promise<SMTPError|undefined>}
 */
async function checkNewDomain(domain, response, client, resolvers) {
  // (why it will need a paid plan, see `config.newDomainNoticeEndsAt`)
  let notice;
  if (!config.newDomainGoodDomains.some((tld) => domain.endsWith(`.${tld}`))) {
    // (.cc, .xyz and the like, see `config.newDomainGoodDomains`)
    const tld = config.goodDomains.find((tld) => domain.endsWith(`.${tld}`));
    const reason =
      tld &&
      `new domains ending in .${tld} need a paid plan, as spam and phishing reports show more abuse on .${tld} than on .com`;
    if (
      tld &&
      config.newDomainNoticeDomains.includes(tld) &&
      dayjs().isBefore(config.newDomainNoticeEndsAt)
    )
      notice = reason;
    else if (tld) return getNewDomainError(domain, reason);
    // (.gov, .edu, brands and the like: new ones need a paid plan)
    else if (
      config.restrictedDomains.some(
        (tld) => domain === tld || domain.endsWith(`.${tld}`)
      )
    )
      return getNewlyCreatedError(domain);
    // (no domain on its extension can use the free plan, new or not)
    else
      return getError(
        `The domain ${domain} ends in .${punycode.toUnicode(
          domain.split('.').pop()
        )}, a domain name extension that is frequently used for spam operations, so it needs a paid plan however old it is. ${REGISTRARS_BLOCKED_US} Please upgrade to a paid plan at ${
          config.urls.web
        }, or use a domain on an extension that can be used for free.`,
        FREE_EXTENSIONS_FAQ
      );
  }

  // (someone had it before: its RDAP record says so, see `wrappedFetch`)
  if (_.isDate(response?.ts?.transferred))
    return getNewDomainError(
      domain,
      `it was transferred from another registrar; ${TAKEOVER}`
    );
  if (_.isDate(response?.ts?.reregistered))
    return getNewDomainError(
      domain,
      `its registry record shows it was registered before then; ${TAKEOVER}`
    );

  //
  // (its past and Cloudflare are asked at once, and waited for 1.5 seconds
  //  at most: mail waits for them; a lookup that takes longer goes on and
  //  is kept, so later mail has its answer)
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

  //
  // (when the archive cannot answer, its mail is let through rather than
  //  refused for as long as the archive is down)
  //
  if (history.err) {
    if (history.err.code === 'ESTILLLOOKING') {
      logger.debug(history.err.message, { domain });
    } else {
      // (once an hour as an error: the archive is failing)
      const claimed = await client
        .set('domain_history_error_alert', '1', 'PX', ms('1h'), 'NX')
        .catch(() => null);
      if (claimed === 'OK') logger.error(history.err, { domain });
      else logger.warn(history.err, { domain });
    }
  }

  const { previous } = history;
  if (previous?.reason === 'drop_catch_registrar')
    return getNewDomainError(
      domain,
      `a drop-catch registrar (one that registers names the moment they expire) holds it; ${TAKEOVER}`
    );
  if (previous)
    return getNewDomainError(
      domain,
      `it was in use before then (the Internet Archive has it from earlier); ${TAKEOVER}`
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

  if (notice) return getNoticeError(domain, response, notice);
}

//
// NOTE: this only gets run for domains on the free plan via MX server
//       and for newly created domains (when being created)
//
// `options.allowNewDomain`: whether a domain registered within the past 90
// days can be let through (on the free plan: see `checkNewDomain`);
// `options.resolvers`: Cloudflare's, see `createDomainCheckResolvers`;
// returns `err` (why it is not let through), `notice` (why it will not be,
// see `getNoticeError`) and its WHOIS/RDAP lookup `response`
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
    const past = {};
    response = await isExpiredOrNewlyCreated.whois(domain, {
      fetch: (url, options) => wrappedFetch(url, options, past)
    });
    // (cached with the rest of `ts`)
    if (response.ts) Object.assign(response.ts, past);
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
    err = getError(
      `The domain ${domain} was detected as a pending state domain via WHOIS/RDAP lookup: its registrar shows it pending deletion, an update, or a transfer, so who will have it next is not known. ${REGISTRARS_BLOCKED_US} Please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
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
    err = getError(
      `The domain ${domain} was detected as a recently expired domain via WHOIS/RDAP lookup; please renew it with its registrar. An expired domain can be registered again by someone else, and ${TAKEOVER}. ${REGISTRARS_BLOCKED_US} Please upgrade to a paid plan at ${config.urls.web} to use our service with this domain.`
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

  // (a domain that needs a paid plan only from a later date is let through,
  //  and `notice` says why, see `getNoticeError`)
  let notice;
  if (err?.isNotice) {
    notice = err;
    err = undefined;
  }

  return { err, notice, response };
}

// (the WHOIS/RDAP lookup; tests, which have no network, put a stand-in here)
isExpiredOrNewlyCreated.whois = (domain, options) => whois(domain, options);

module.exports = isExpiredOrNewlyCreated;
module.exports.normalizeRdapUrl = normalizeRdapUrl;
