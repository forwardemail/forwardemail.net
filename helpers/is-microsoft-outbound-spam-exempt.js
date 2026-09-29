/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const SMTPError = require('#helpers/smtp-error');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const parseUsername = require('#helpers/parse-username');
const {
  isPermissiveSpfRecord
} = require('#helpers/is-high-confidence-generic-rdns-spam');

//
// Microsoft 365 stamps every outbound message with an X-Forefront-Antispam-Report
// header. When a signed-in mailbox user of a tenant sends a message that
// Microsoft's outbound filter scores as spam (e.g. `SCL:9;SFV:SPM;CAT:OSPM`),
// Microsoft still relays it, and we reject it on that verdict.
//
// That verdict alone cannot tell apart a legitimate business message that was
// misclassified (e.g. an account statement with an attachment) from a
// compromised mailbox sending phishing. This helper narrows the rejection by
// exempting only the lowest-risk profile, where the message:
//
// - was relayed by Microsoft's outbound infrastructure
// - was sent by an authenticated (not anonymous) mailbox of a hosted tenant
// - uses a custom From domain (not *.onmicrosoft.com nor a consumer domain)
//   that is the tenant's own originating organization domain
// - passes SPF, aligned DKIM, and DMARC with an enforced policy
//   (quarantine or reject, applied to 100% of messages), and a trusted
//   Microsoft ARC seal
// - carries only the generic outbound spam verdict/categories (SFV:SPM,
//   CAT:OSPM, CAT:SPM, or a high SCL with DIR:OUT) and nothing more specific
//   (phishing, malware, high-confidence spam, spoofing, impersonation,
//   blocked sender, etc.)
//
// Every header this relies on must appear exactly once, and every field of
// the Forefront report must appear exactly once, so that values injected by
// the sender cannot shadow the values stamped by Microsoft.
//
// Exempt messages are additionally capped per day by the number of distinct
// recipients, both per sender and per sender domain (see
// `checkMicrosoftOutboundSpamExemptLimit`), since a compromised mailbox (or a
// tenant created to send spam) typically fans out to many recipients.
//

const MICROSOFT_OUTBOUND_HOST_SUFFIX = '.outbound.protection.outlook.com';

// Microsoft consumer domains are not custom tenant domains
const REGEX_MICROSOFT_CONSUMER_ROOT_DOMAIN =
  /^(?:outlook|hotmail|live|msn|passport|windowslive)\.[a-z.]+$/i;

// Spam filtering verdicts (SFV) that may be exempted
// (SKB, SKS, BLK, and any other or unknown verdict are never exempted)
const EXEMPT_SFV_VALUES = new Set(['NSPM', 'SPM']);

// Categories (CAT) that may be exempted
// (PHSH, HPHSH, HPHISH, HSPM, MALW, SPOOF, BIMP, DIMP, GIMP, UIMP, INTOS, and
//  any other or unknown category are never exempted)
const EXEMPT_CAT_VALUES = new Set(['NONE', 'OSPM', 'SPM']);

// Maximum number of distinct recipients per day that exempt messages from a
// single sender (and from all senders of a single domain) may be delivered to
// before the exemption stops applying
const MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT = 10;
const MICROSOFT_OUTBOUND_SPAM_EXEMPT_DOMAIN_RECIPIENT_LIMIT = 25;

const MICROSOFT_OUTBOUND_SPAM_ERROR_MESSAGE =
  'Due to spam from onmicrosoft.com we have implemented restrictions; see https://old.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/';

/**
 * Parse an X-Forefront-Antispam-Report header value into a map of
 * uppercased field names to arrays of trimmed values
 * (e.g. `{ SCL: ['9'], CAT: ['OSPM'] }`).
 *
 * @param {string} value
 * @returns {Map<string, string[]>}
 */
function parseForefrontReport(value) {
  const fields = new Map();
  if (!isSANB(value)) return fields;

  for (const part of value.split(';')) {
    const index = part.indexOf(':');
    if (index === -1) continue;
    const key = part.slice(0, index).trim().toUpperCase();
    if (!key) continue;
    const values = fields.get(key) || [];
    values.push(part.slice(index + 1).trim());
    fields.set(key, values);
  }

  return fields;
}

//
// Returns the value of a header only if it appears exactly once
// (an empty string is returned if it is missing or duplicated)
//
function getHeaderValue(headers, name) {
  if (typeof headers.get === 'function' && headers.get(name).length !== 1)
    return '';
  const value = headers.getFirst(name);
  return isSANB(value) ? value.trim() : '';
}

function getRootDomain(value) {
  if (!isSANB(value)) return '';
  try {
    const host = parseHostFromDomainOrAddress(value.trim());
    return isSANB(host) ? parseRootDomain(host) : '';
  } catch {
    return '';
  }
}

function isOnMicrosoftDomain(domain) {
  return domain === 'onmicrosoft.com' || domain.endsWith('.onmicrosoft.com');
}

/**
 * Whether Microsoft's verdict only consists of generic spam signals
 * (and nothing more specific such as phishing, malware, or spoofing).
 *
 * @param {Map<string, string>} report
 * @returns {boolean}
 */
function hasOnlyGenericSpamVerdict(report) {
  // every field must appear exactly once
  for (const values of report.values()) {
    if (values.length !== 1) return false;
  }

  // must be an outbound message from the tenant
  if ((report.get('DIR')?.[0] || '').toUpperCase() !== 'OUT') return false;

  const sfv = (report.get('SFV')?.[0] || '').toUpperCase();
  if (sfv && !EXEMPT_SFV_VALUES.has(sfv)) return false;

  const cat = (report.get('CAT')?.[0] || '').toUpperCase();
  if (cat && !EXEMPT_CAT_VALUES.has(cat)) return false;

  return true;
}

/**
 * Whether the From address uses a custom domain of the sending tenant.
 *
 * @param {Object} session
 * @param {Object} headers - mailsplit headers
 * @returns {boolean}
 */
function isCustomTenantDomainSender(session, headers) {
  if (!isSANB(session.originalFromAddress)) return false;

  let fromDomain;
  try {
    fromDomain = parseHostFromDomainOrAddress(session.originalFromAddress);
  } catch {
    return false;
  }

  if (!isSANB(fromDomain)) return false;

  const fromRootDomain = parseRootDomain(fromDomain);

  if (
    isOnMicrosoftDomain(fromDomain) ||
    isOnMicrosoftDomain(fromRootDomain) ||
    REGEX_MICROSOFT_CONSUMER_ROOT_DOMAIN.test(fromRootDomain)
  )
    return false;

  // Microsoft stamps the tenant's originating organization domain;
  // it must be the same organizational domain as the From address
  const originatorOrg = getRootDomain(
    getHeaderValue(headers, 'x-originatororg')
  );
  if (!originatorOrg || originatorOrg !== fromRootDomain) return false;

  return true;
}

/**
 * Whether the message was submitted by an authenticated mailbox user of a
 * hosted Microsoft 365 tenant (as opposed to an anonymous relay, connector,
 * or on-premises server).
 *
 * @param {Object} headers - mailsplit headers
 * @returns {boolean}
 */
function isAuthenticatedHostedMailboxSubmission(headers) {
  return (
    getHeaderValue(
      headers,
      'x-ms-exchange-crosstenant-authas'
    ).toLowerCase() === 'internal' &&
    getHeaderValue(
      headers,
      'x-ms-exchange-crosstenant-fromentityheader'
    ).toLowerCase() === 'hosted' &&
    getHeaderValue(
      headers,
      'x-ms-exchange-crosstenant-mailboxtype'
    ).toLowerCase() === 'hosted'
  );
}

/**
 * Whether SPF, aligned DKIM, and DMARC (with an enforced policy) all pass for
 * the From domain, and the message carries a trusted, passing ARC seal.
 *
 * @param {Object} session
 * @returns {boolean}
 */
function hasFullyAlignedAuthentication(session) {
  const fromRootDomain = isSANB(session.originalFromAddressRootDomain)
    ? session.originalFromAddressRootDomain.toLowerCase()
    : '';
  if (!fromRootDomain) return false;

  if (session.hadAlignedAndPassingDKIM !== true) return false;

  if (
    session.spf?.status?.result !== 'pass' ||
    isPermissiveSpfRecord(session.spf?.rr) ||
    !isSANB(session.spf?.domain) ||
    parseRootDomain(session.spf.domain) !== fromRootDomain
  )
    return false;

  if (
    session.dmarc?.status?.result !== 'pass' ||
    !['quarantine', 'reject'].includes(
      (session.dmarc?.policy || '').toLowerCase()
    ) ||
    !isSANB(session.dmarc?.domain) ||
    parseRootDomain(session.dmarc.domain) !== fromRootDomain
  )
    return false;

  // a policy applied to less than 100% of messages is not fully enforced
  if (
    session.dmarc.pct !== undefined &&
    session.dmarc.pct !== null &&
    Number(session.dmarc.pct) !== 100
  )
    return false;

  if (session.arc?.status?.result !== 'pass' || session.isTrustedArc !== true)
    return false;

  return true;
}

/**
 * Whether a message that Microsoft's outbound filter flagged with only a
 * generic spam verdict qualifies to be exempted from rejection.
 *
 * @param {Object} session
 * @param {Object} headers - mailsplit headers
 * @returns {boolean}
 */
function isMicrosoftOutboundSpamExempt(session, headers) {
  if (
    !isSANB(session.resolvedClientHostname) ||
    !session.resolvedClientHostname
      .toLowerCase()
      .endsWith(MICROSOFT_OUTBOUND_HOST_SUFFIX)
  )
    return false;

  const report = parseForefrontReport(
    getHeaderValue(headers, 'x-forefront-antispam-report')
  );
  if (report.size === 0) return false;

  return (
    hasOnlyGenericSpamVerdict(report) &&
    isAuthenticatedHostedMailboxSubmission(headers) &&
    isCustomTenantDomainSender(session, headers) &&
    hasFullyAlignedAuthentication(session)
  );
}

function getExemptRecipients(session) {
  const recipients = new Set();
  if (Array.isArray(session.envelope?.rcptTo)) {
    for (const rcpt of session.envelope.rcptTo) {
      if (isSANB(rcpt?.address))
        recipients.add(rcpt.address.toLowerCase().trim());
    }
  }

  return [...recipients];
}

//
// Normalize the sender so that plus-addressed variants of the same mailbox
// (e.g. "sender+1@example.com") share a single limit
//
function getExemptSender(session) {
  const address = session.originalFromAddress.toLowerCase().trim();
  try {
    return `${parseUsername(address)}@${parseHostFromDomainOrAddress(address)}`;
  } catch {
    return address;
  }
}

function getExemptRecipientsKeys(session) {
  const prefix = `microsoft_outbound_spam_exempt_recipients:${session.arrivalDateFormatted}`;
  return {
    senderKey: `${prefix}:${getExemptSender(session)}`,
    domainKey: `${prefix}:@${session.originalFromAddressRootDomain.toLowerCase()}`
  };
}

/**
 * Record the recipients of an exempt message for the sender and its domain,
 * and reject the message if either exceeded its daily distinct recipient limit.
 *
 * Once a limit is exceeded, all exempt messages from that sender (or domain)
 * are rejected until the day's counter expires, including to recipients that
 * were already counted; retries of those messages are then counted again on
 * the next day (within the retry window of `hasFingerprintExpired`).
 *
 * A temporary (421) rejection is used so that a legitimate sender's MTA keeps
 * retrying and is delivered normally if this ever has to be rolled back.
 *
 * @param {Object} session
 * @param {Object} client - Redis client
 * @returns {Promise<Object>} distinct recipient counts for today
 */
async function checkMicrosoftOutboundSpamExemptLimit(session, client) {
  const { senderKey, domainKey } = getExemptRecipientsKeys(session);
  const recipients = getExemptRecipients(session);

  const pipeline = client.pipeline();
  if (recipients.length > 0) {
    pipeline.sadd(senderKey, ...recipients);
    pipeline.sadd(domainKey, ...recipients);
  }

  pipeline.scard(senderKey);
  pipeline.scard(domainKey);
  pipeline.pexpire(senderKey, ms('2d'));
  pipeline.pexpire(domainKey, ms('2d'));
  const results = await pipeline.exec();

  for (const [err] of results) {
    if (err) throw err;
  }

  const offset = recipients.length > 0 ? 2 : 0;
  const sender = Number(results[offset][1]) || 0;
  const domain = Number(results[offset + 1][1]) || 0;

  if (
    sender > MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT ||
    domain > MICROSOFT_OUTBOUND_SPAM_EXEMPT_DOMAIN_RECIPIENT_LIMIT
  )
    throw new SMTPError(MICROSOFT_OUTBOUND_SPAM_ERROR_MESSAGE, {
      responseCode: 421
    });

  return { sender, domain };
}

module.exports = isMicrosoftOutboundSpamExempt;
module.exports.isMicrosoftOutboundSpamExempt = isMicrosoftOutboundSpamExempt;
module.exports.checkMicrosoftOutboundSpamExemptLimit =
  checkMicrosoftOutboundSpamExemptLimit;
module.exports.getExemptRecipientsKeys = getExemptRecipientsKeys;
module.exports.getExemptSender = getExemptSender;
module.exports.hasFullyAlignedAuthentication = hasFullyAlignedAuthentication;
module.exports.hasOnlyGenericSpamVerdict = hasOnlyGenericSpamVerdict;
module.exports.isAuthenticatedHostedMailboxSubmission =
  isAuthenticatedHostedMailboxSubmission;
module.exports.isCustomTenantDomainSender = isCustomTenantDomainSender;
module.exports.parseForefrontReport = parseForefrontReport;
module.exports.MICROSOFT_OUTBOUND_SPAM_ERROR_MESSAGE =
  MICROSOFT_OUTBOUND_SPAM_ERROR_MESSAGE;
module.exports.MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT =
  MICROSOFT_OUTBOUND_SPAM_EXEMPT_RECIPIENT_LIMIT;
module.exports.MICROSOFT_OUTBOUND_SPAM_EXEMPT_DOMAIN_RECIPIENT_LIMIT =
  MICROSOFT_OUTBOUND_SPAM_EXEMPT_DOMAIN_RECIPIENT_LIMIT;
