/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { isIP, isIPv4 } = require('node:net');

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');

const isPrivateHost = require('#helpers/is-private-host');
const parseRootDomain = require('#helpers/parse-root-domain');
const {
  checkForwardConfirmedRdns
} = require('#helpers/is-forward-confirmed-rdns');
const {
  hasInconclusiveAuthentication,
  hasMeaningfulSpfPass
} = require('#helpers/is-high-confidence-generic-rdns-spam');
const {
  hasTrustedSenderIdentity
} = require('#helpers/is-high-confidence-php-hosting-spam');

// SPF results where the domain owner says the address may not send for it;
// "none" (no record) and "neutral" (no assertion) are not judged, and
// "permerror" only as described at isPermerrorAtFinalTerm
const DISAVOWED_SPF_RESULTS = new Set(['fail', 'softfail']);

// mailauth's permerror text for a term naming an invalid domain, which it
// raises when evaluation reaches that term
const REGEX_INVALID_DOMAIN = /: invalid domain (\S+)$/i;

// an "all" term that authorizes nobody, and the "exp=" modifier
const REGEX_SPF_HARMLESS_TERM = /^(?:[-~?]all|exp=\S+)$/i;

// mechanisms and modifiers that name a domain ("a:host/24", "redirect=x")
const REGEX_SPF_DOMAIN_TERM =
  /^[+\-~?]?(?:(?:include|a|mx|ptr|exists):|redirect=)([^/]+)(?:\/\d+){0,2}$/i;

// bounds the TXT lookup, as is-forward-confirmed-rdns bounds its lookup
const TXT_TIMEOUT_MS = 5000;

/**
 * Whether an SPF permerror hides no authorization: mailauth stopped at a term
 * naming an invalid domain (e.g. "include:_spf.example.net~all", a missing space),
 * and that term is the last one in the domain's only SPF record but for an
 * "all" that authorizes nobody. SPF is evaluated in order, so every term
 * before it was checked and none matched, and the broken term cannot name a
 * host. Any other permerror (too many lookups, multiple records, a broken term
 * followed by others, an error inside an included record) could be hiding a
 * term that lists the address, so it is not judged, nor is any DNS error.
 *
 * @param {object} session
 * @param {object} resolver - Tangerine resolver
 * @returns {Promise<boolean>}
 */
async function isPermerrorAtFinalTerm(session, resolver) {
  const comment = session.spf?.status?.comment;
  const domain = session.spf?.domain;
  if (!isSANB(comment) || !isSANB(domain) || !resolver?.resolveTxt)
    return false;

  const match = REGEX_INVALID_DOMAIN.exec(comment.trim());
  if (!match) return false;
  const invalid = match[1].toLowerCase();

  const abortController = new AbortController();
  const timer = setTimeout(() => abortController.abort(), TXT_TIMEOUT_MS);
  let records;
  try {
    records = await resolver.resolveTxt(domain, undefined, abortController);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }

  if (!Array.isArray(records)) return false;
  const spf = records
    .map((chunks) => (Array.isArray(chunks) ? chunks.join('') : String(chunks)))
    .map((record) => record.trim())
    .filter((record) => /^v=spf1(?:\s|$)/i.test(record));
  if (spf.length !== 1) return false;

  const terms = spf[0].split(/\s+/).slice(1);
  const index = terms.findIndex(
    (term) => REGEX_SPF_DOMAIN_TERM.exec(term)?.[1]?.toLowerCase() === invalid
  );
  if (index === -1) return false;

  return terms
    .slice(index + 1)
    .every((term) => REGEX_SPF_HARMLESS_TERM.test(term));
}

/**
 * Whether a hostname is under a public suffix (ICANN section of the Public
 * Suffix List); internal names such as "srv.corp", "host.lan" or
 * "box.home.arpa" are not.
 */
function isPublicHostname(hostname) {
  if (/(?:^|\.)home\.arpa$/i.test(hostname)) return false;
  const result = parseDomain(fromUrl(hostname));
  return (
    result?.type === ParseResultType.Listed && Boolean(result.icann?.domain)
  );
}

// HELO/EHLO address literal (RFC 5321 Section 4.1.3), e.g. "[192.0.2.1]"
const REGEX_ADDRESS_LITERAL = /^\[(?:ipv6:)?([\da-f.:]+)]$/i;

/**
 * Whether the HELO/EHLO identity names no host that could be checked: an
 * address literal (or a bare address), or a hostname that DNS says does not
 * resolve to the connecting address.
 *
 * A misconfigured but real server usually greets with its own hostname, which
 * resolves to it even when its PTR record is missing, and often in the domain
 * it sends for. So these are not judged: a name that resolves to the address,
 * a name in the From or envelope domain, a name that is not a public hostname
 * ("localhost", an internal name such as "srv.corp"), and any DNS timeout or
 * failure.
 *
 * @param {object} session
 * @param {object} resolver - Tangerine resolver
 * @returns {Promise<boolean>}
 */
async function hasUnverifiedHelo(session, resolver) {
  if (!isSANB(session?.hostNameAppearsAs)) return false;

  const helo = session.hostNameAppearsAs
    .trim()
    .replace(/\.$/, '')
    .toLowerCase();

  const literal = REGEX_ADDRESS_LITERAL.exec(helo);
  if (literal ? isIP(literal[1]) : isIP(helo)) return true;

  let hostname;
  try {
    hostname = punycode.toASCII(helo);
  } catch {
    return false;
  }

  if (
    !isFQDN(hostname) ||
    isPrivateHost(hostname) ||
    !isPublicHostname(hostname)
  )
    return false;

  const root = parseRootDomain(hostname);
  const envelopeDomain = session.envelope?.mailFrom?.address?.split('@')[1];
  if (
    root === session.originalFromAddressRootDomain?.toLowerCase() ||
    (envelopeDomain && root === parseRootDomain(envelopeDomain.toLowerCase()))
  )
    return false;

  return (
    (await checkForwardConfirmedRdns(
      resolver,
      hostname,
      session.remoteAddress
    )) === 'unconfirmed'
  );
}

/**
 * Detects unauthenticated mail from an address without forward-confirmed
 * reverse DNS (no PTR record, or a PTR hostname that does not resolve back to
 * the address), when the sending domain's SPF record says the address may not
 * send for it (fail or softfail, or a permerror that provably hides no
 * authorization, see isPermerrorAtFinalTerm).
 *
 * Every condition is required because each occurs legitimately on its own:
 *
 * - No forward-confirmed reverse DNS: some small or misconfigured servers have
 *   none, although Gmail and other large providers refuse their mail.
 * - SPF fail or softfail: plain forwarding without SRS breaks SPF.
 * - No DKIM or DMARC pass: many small domains do not sign their mail.
 * - A HELO name that cannot be checked (see `hasUnverifiedHelo`): legacy
 *   devices and scripts greet with an address literal.
 *
 * Together they describe a host nobody set up for mail, sending as a domain
 * that disavows it, with nothing that ties the message to that domain. (SPF
 * fail with no DMARC record is already rejected by is-authenticated-message;
 * this adds softfail, and fail when the domain publishes DMARC p=none.)
 *
 * Only IPv4 clients are judged: a dual-stack server often sends over IPv6
 * with a PTR hostname that has only an A record and an SPF record that lists
 * only its IPv4 address. Bounces (null MAIL FROM) are not judged either, as
 * their SPF result is for the HELO name, which the client chooses.
 *
 * `session.hasNoConfirmedReverseHostname` is set by `on-connect` only when DNS
 * answered: NXDOMAIN or no PTR record, or a PTR hostname with no address
 * records or none matching. A timeout or server failure leaves it unset, as
 * does any DNS error during authentication (fail open).
 *
 * An allowlisted connection (without a confirmed reverse hostname, only an
 * entry for the address itself can match) is exempt. The From address being
 * allowlisted is not: the message carries no authentication for it, so a
 * reputable From address here is an impersonation target, not a trust signal.
 *
 * @param {object} session - MX session populated by on-connect,
 *   update-session, and is-authenticated-message
 * @param {object} resolver - Tangerine resolver, used only once every other
 *   condition holds
 * @returns {Promise<boolean>}
 */
async function isHighConfidenceUnconfirmedRdnsSpam(session, resolver) {
  if (
    session?.hasNoConfirmedReverseHostname !== true ||
    !isIPv4(session.remoteAddress || '') ||
    !session.envelope?.mailFrom?.address ||
    session.isAllowlisted ||
    hasTrustedSenderIdentity(session) ||
    hasMeaningfulSpfPass(session.spfFromHeader) ||
    hasInconclusiveAuthentication(session)
  )
    return false;

  const result = session.spf?.status?.result;
  if (DISAVOWED_SPF_RESULTS.has(result))
    return hasUnverifiedHelo(session, resolver);

  if (result === 'permerror')
    return (
      (await hasUnverifiedHelo(session, resolver)) &&
      isPermerrorAtFinalTerm(session, resolver)
    );

  return false;
}

module.exports = isHighConfidenceUnconfirmedRdnsSpam;
module.exports.hasUnverifiedHelo = hasUnverifiedHelo;
module.exports.isPermerrorAtFinalTerm = isPermerrorAtFinalTerm;
module.exports.isPublicHostname = isPublicHostname;
module.exports.isHighConfidenceUnconfirmedRdnsSpam =
  isHighConfidenceUnconfirmedRdnsSpam;
