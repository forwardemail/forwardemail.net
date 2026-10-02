/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');

const isGenericReverseHostname = require('#helpers/is-generic-reverse-hostname');
const parseRootDomain = require('#helpers/parse-root-domain');
const {
  hasInconclusiveAuthentication,
  hasMeaningfulSpfPass
} = require('#helpers/is-high-confidence-generic-rdns-spam');
const {
  getHeaderValues,
  hasTrustedSenderIdentity
} = require('#helpers/is-high-confidence-php-hosting-spam');

//
// The Received header an MTA writes when the root user submits a message on
// the machine itself (sendmail(1), mail(1), a script), capturing that machine:
//
//   Postfix:  by host.example.com (Postfix, from userid 0) id ...
//   Exim:     from root by host.example.com with local (Exim 4.96) ...
//             (also "with local-esmtp", root running exim -bs)
//   Sendmail: (from root@localhost) by host.example.com (8.15.2/Submit) ...
//
const REGEX_ROOT_SUBMISSION = [
  /^by\s+(\S+)\s+\(postfix,\s+from\s+userid\s+0\)/i,
  /^from\s+root\s+by\s+(\S+)\s+with\s+local\b/i,
  /^\(from\s+root@\S+\)\s+by\s+(\S+)/i
];

function normalizeHostname(value) {
  if (!isSANB(value)) return null;
  const hostname = value.trim().replace(/\.$/, '').toLowerCase();
  return isFQDN(hostname) ? hostname : null;
}

/**
 * The machine on which root submitted the message, when that submission is
 * the newest Received header, i.e. no other server handled the message
 * before it reached us.
 */
function getRootSubmissionHost(headers) {
  const [newest] = getHeaderValues(headers, 'received');
  if (!isSANB(newest)) return null;

  const value = newest.trim();
  for (const regex of REGEX_ROOT_SUBMISSION) {
    const match = regex.exec(value);
    if (match) return normalizeHostname(match[1]);
  }

  return null;
}

/**
 * Detects mail that the root user of a server submitted on that server as
 * root@ that server, and that the server delivered straight to us, with no SPF
 * or DKIM pass for any domain, under an unrelated From domain that publishes
 * no SPF record: the profile of a spam script run on a compromised server,
 * sending as a throwaway domain.
 *
 * Every condition is required because each occurs legitimately on its own:
 *
 * - Root submitting mail locally as root@ the server: cron and system notices.
 *   Those are sent as the server itself (the host's domain in From), which is
 *   exempt.
 * - No SPF or DKIM pass: many small servers authenticate nothing.
 * - A From domain unrelated to the server: an application running as root
 *   (common in containers) that puts a visitor's or a company's address in
 *   From. Those domains publish SPF (Gmail, Outlook, a company's domain), so
 *   only a From domain with no SPF record at all is judged; spoofing a domain
 *   that publishes SPF is left to the SPF and DMARC checks.
 * - A server with no reverse DNS of its own (none, or the provider's generic
 *   name embedding the IPv4 address): a server set up by a sysadmin for mail
 *   has one, so a confirmed reverse hostname is exempt, including any IPv6
 *   one (is-generic-reverse-hostname only recognizes IPv4 names).
 *
 * The root submission must be the newest Received header and on the machine
 * that greeted us (HELO/EHLO, same organizational domain), so the message did
 * not pass through another server, and a forged header further down changes
 * nothing.
 *
 * Bounces (null MAIL FROM), allowlisted connections and any DNS error during
 * authentication are not judged. The From domain being allowlisted is not an
 * exemption: the message carries no authentication for it.
 *
 * @param {object} headers - mailsplit Headers of the message as received
 * @param {object} session - MX session populated by on-connect,
 *   update-session, and is-authenticated-message
 * @returns {boolean}
 */
function isHighConfidenceRootScriptSpam(headers, session) {
  if (
    !session ||
    session.isAllowlisted ||
    !session.envelope?.mailFrom?.address ||
    hasTrustedSenderIdentity(session) ||
    hasMeaningfulSpfPass(session.spf) ||
    hasMeaningfulSpfPass(session.spfFromHeader) ||
    hasInconclusiveAuthentication(session)
  )
    return false;

  // no DKIM pass for any domain, aligned or not
  if (
    Array.isArray(session.dkim?.results) &&
    session.dkim.results.some((result) => result?.status?.result === 'pass')
  )
    return false;

  // the From domain publishes no SPF record (see above)
  if (session.spfFromHeader?.status?.result !== 'none') return false;

  // a confirmed reverse hostname that the provider did not generate
  if (
    isSANB(session.resolvedClientHostname) &&
    !isGenericReverseHostname(
      session.resolvedClientHostname,
      session.remoteAddress
    )
  )
    return false;

  const host = getRootSubmissionHost(headers);
  const helo = normalizeHostname(session.hostNameAppearsAs);
  if (!host || !helo) return false;

  const hostRoot = parseRootDomain(host);
  if (parseRootDomain(helo) !== hostRoot) return false;

  // the From domain must be unrelated to every name the server gave
  const fromRoot = session.originalFromAddressRootDomain?.toLowerCase();
  if (!isSANB(fromRoot)) return false;

  // the envelope sender is root@ the server, as sendmail sets it by default
  const [localPart, envelopeDomain] = session.envelope.mailFrom.address
    .toLowerCase()
    .split('@');
  if (
    localPart !== 'root' ||
    !envelopeDomain ||
    parseRootDomain(envelopeDomain) !== hostRoot
  )
    return false;

  const related = new Set([
    hostRoot,
    session.resolvedRootClientHostname?.toLowerCase(),
    session.unconfirmedRootClientHostname?.toLowerCase()
  ]);

  return !related.has(fromRoot);
}

module.exports = isHighConfidenceRootScriptSpam;
module.exports.getRootSubmissionHost = getRootSubmissionHost;
module.exports.isHighConfidenceRootScriptSpam = isHighConfidenceRootScriptSpam;
