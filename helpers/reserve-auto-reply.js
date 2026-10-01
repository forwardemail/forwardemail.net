/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const punycode = require('node:punycode');

const mongoose = require('mongoose');
const revHash = require('rev-hash');

const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const logger = require('#helpers/logger');
const parseAddresses = require('#helpers/parse-addresses');
const { getSmtpDayKey } = require('#helpers/get-smtp-day');
const { normalizeRecipient } = require('#helpers/smtp-reputation-recipients');

const { SMTP_LIMIT_USER_FIELDS } = getUserSmtpLimit;

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

// how much of a message's recipient headers is read (they can be huge)
const MAX_RECIPIENT_HEADERS_LENGTH = 64 * 1024;

const RECIPIENT_HEADERS = [
  'to',
  'cc',
  'bcc',
  'resent-to',
  'resent-cc',
  'resent-bcc'
];

/**
 * The most auto-replies a user can send per day: `smtpAutoReplyDailyLimit`,
 * or less if an admin restricted the user below it.
 *
 * @param {Object} user - User with the SMTP limit fields
 * @returns {number} Daily auto-reply limit
 */
function getAutoReplyLimit(user) {
  return Math.min(config.smtpAutoReplyDailyLimit, getUserSmtpLimit(user));
}

/**
 * The most bounce notifications to return addresses outside the sender's own
 * domains a user can get per day: the auto-reply limit, or the share of their
 * daily threshold at which bounces reset a sender, whichever is higher (so a
 * large sender whose bounces go to e.g. a bounce processing service still
 * gets them).
 *
 * @param {Object} user - User with the SMTP limit fields
 * @returns {number} Daily bounce notification limit
 */
function getBounceNotificationLimit(user) {
  return Math.max(
    getAutoReplyLimit(user),
    Math.ceil(
      getUserSmtpLimit(user) *
        config.smtpReputationMaxBadRate *
        config.smtpReputationSevereBadRateMultiplier
    )
  );
}

function getUserId(userId) {
  if (!userId) return null;
  const id =
    typeof userId === 'object' && userId._id
      ? userId._id.toString()
      : String(userId);
  return mongoose.isObjectIdOrHexString(id) ? id : null;
}

//
// A domain in ASCII (punycode) and lowercase
//
function toASCIIDomain(domain) {
  if (typeof domain !== 'string') return '';
  try {
    return punycode.toASCII(domain.toLowerCase().trim().replace(/\.$/, ''));
  } catch {
    return domain.toLowerCase().trim();
  }
}

//
// An address lowercased, without a `+tag`, and with an ASCII domain
//
function normalizeAddress(address) {
  if (typeof address !== 'string') return '';
  const lower = address.toLowerCase().trim();
  const at = lower.lastIndexOf('@');
  if (at <= 0) return '';
  return `${lower.slice(0, at).split('+')[0]}@${toASCIIDomain(
    lower.slice(at + 1)
  )}`;
}

async function getUser(id) {
  // (required here, since the models require helpers that require this)
  const { Users } = require('#models');
  return Users.findById(id).select(SMTP_LIMIT_USER_FIELDS).lean().exec();
}

//
// Reserve one of today's messages of a kind for a user, within `getLimit(user)`
// (without Redis, or if the user no longer exists, none can be sent)
//
async function reserve({ client, userId, now, kind, getLimit }) {
  const id = getUserId(userId);
  if (!client || !id) return false;
  const user = await getUser(id);
  if (!user) return false;

  const key = `${config.smtpLimitNamespace}:${kind}:${user._id}:${getSmtpDayKey(
    now
  )}`;
  // (together, so the key never lives without an expiry)
  const results = await client.multi().incr(key).pexpire(key, TWO_DAYS).exec();
  const [err, total] = results[0];
  if (err) throw err;
  return Number(total) <= getLimit(user);
}

/**
 * Whether the sender of inbound mail is authentic (so an auto-reply goes to
 * whoever sent it, not to a victim whose address was forged): the
 * From address's domain passed DMARC or has an aligned passing DKIM
 * signature.  (SPF for the From domain alone is not enough, since many
 * domains' SPF records allow shared mail servers anyone can send from.)
 * Auto-replies to unauthenticated senders are backscatter (see
 * <https://www.backscatterer.org/?target=autoresponders>).
 *
 * The address replied to (`session.originalFromAddress`) must be on the
 * domain that was authenticated (e.g. not an address unwrapped from an SRS
 * address in the From header, on another domain).
 *
 * @param {Object} session - MX session (after authentication)
 * @returns {boolean} True if the sender is authentic
 */
function isAuthenticatedSender(session) {
  if (!session || typeof session.originalFromAddress !== 'string') return false;

  // (DMARC and DKIM alignment are for the From header's domain)
  const replyDomain = toASCIIDomain(
    session.originalFromAddress.split('@').pop()
  );
  const authenticated = toASCIIDomain(
    session?.dmarc?.status?.header?.from || session?.dmarc?.domain || ''
  );
  if (
    !replyDomain ||
    !authenticated ||
    (replyDomain !== authenticated &&
      !replyDomain.endsWith(`.${authenticated}`))
  )
    return false;

  return (
    session.hadAlignedAndPassingDKIM === true ||
    session?.dmarc?.status?.result === 'pass'
  );
}

//
// The recipients in a message's headers (normalized), read once per message
// and only up to a limit (so a huge header cannot block the event loop)
//
const recipientsCache = new WeakMap();
function getHeaderRecipients(headers) {
  if (!headers || typeof headers.get !== 'function') return new Set();
  if (recipientsCache.has(headers)) return recipientsCache.get(headers);
  const recipients = new Set();
  let remaining = MAX_RECIPIENT_HEADERS_LENGTH;
  for (const key of RECIPIENT_HEADERS) {
    for (const line of headers.get(key) || []) {
      if (remaining <= 0) break;
      let value =
        typeof line === 'string'
          ? line.slice(line.indexOf(':') + 1, line.indexOf(':') + 1 + remaining)
          : '';
      remaining -= value.length;
      // (raw headers are binary strings, e.g. with SMTPUTF8 addresses)
      if (
        /[\u0080-\u00FF]/.test(value) &&
        [...value].every((char) => char.codePointAt(0) <= 0xff)
      )
        value = Buffer.from(value, 'binary').toString('utf8');
      // (addresses in a group, e.g. "team: a@b.com, c@d.com;")
      value = value
        .replace(/(^|[,;])[^,;:<>"@]*:(?!\/)/g, '$1')
        .replaceAll(';', ',');
      for (const found of parseAddresses(value)) {
        const normalized = normalizeAddress(found);
        if (normalized) recipients.add(normalized);
      }
    }
  }

  recipientsCache.set(headers, recipients);
  return recipients;
}

/**
 * Whether an address is named as a recipient in the message headers (RFC
 * 3834: no automatic response unless the recipient is in To, Cc, Bcc,
 * Resent-To, Resent-Cc or Resent-Bcc, so e.g. mail to a hidden list of
 * recipients does not get one).  A `+tag`, case and IDN encoding do not
 * matter, and a wildcard (e.g. `*@example.com`) matches nothing.
 *
 * @param {Object} headers - Parsed headers (with `get(key)`)
 * @param {string} address - The alias address
 * @returns {boolean} True if the address is a recipient in the headers
 */
function isAddressedTo(headers, address) {
  const target = normalizeAddress(address);
  if (!target || target.includes('*')) return false;
  return getHeaderRecipients(headers).has(target);
}

/**
 * Whether any address on a domain is named as a recipient in the message
 * headers (see `isAddressedTo`), e.g. another alias on the domain that
 * forwards to the alias with a vacation responder.
 *
 * @param {Object} headers - Parsed headers (with `get(key)`)
 * @param {string} domain - Domain name
 * @returns {boolean} True if an address on the domain is a recipient
 */
function isAddressedToDomain(headers, domain) {
  const name = toASCIIDomain(domain);
  if (!name || name.includes('*')) return false;
  for (const recipient of getHeaderRecipients(headers))
    if (recipient.slice(recipient.lastIndexOf('@') + 1) === name) return true;
  return false;
}

//
// Atomically reserve one of today's auto-replies for a user and to a recipient
// (neither is used up if either limit was reached)
//
const RESERVE_AUTO_REPLY_SCRIPT = `
local u = tonumber(redis.call('GET', KEYS[1]) or '0')
local r = tonumber(redis.call('GET', KEYS[2]) or '0')
if u >= tonumber(ARGV[1]) then return 1 end
if r >= tonumber(ARGV[2]) then return 2 end
redis.call('SET', KEYS[1], u + 1, 'PX', ARGV[3])
redis.call('SET', KEYS[2], r + 1, 'PX', ARGV[3])
return 0
`;

/**
 * Reserve one of today's vacation or sieve auto-replies from a user to an
 * address: capped per user per day (see `getAutoReplyLimit`), since they do
 * not count toward the user's outbound SMTP threshold, and per recipient per
 * day across all users (see `config.smtpAutoReplyDailyLimitPerRecipient`, with
 * variants of one mailbox counted once), so no one can be flooded with them.
 * Without Redis (or if the user no longer exists) none are sent.
 *
 * @param {Object} options
 * @param {Object} options.client - Redis client
 * @param {Object|string} options.userId - User the auto-reply is sent for
 * @param {string} options.to - Address the auto-reply goes to
 * @param {Date} [options.now] - Current time
 * @returns {Promise<boolean>} True if the auto-reply can be sent
 */
async function reserveAutoReplyFor({ client, userId, to, now = new Date() }) {
  const id = getUserId(userId);
  const recipient = normalizeAddress(normalizeRecipient(to) || '');
  if (!client || !id || !recipient) return false;
  const user = await getUser(id);
  if (!user) return false;
  const day = getSmtpDayKey(now);
  const result = await client.eval(
    RESERVE_AUTO_REPLY_SCRIPT,
    2,
    `${config.smtpLimitNamespace}:auto_reply:${user._id}:${day}`,
    `${config.smtpLimitNamespace}:auto_reply_to:${revHash(recipient)}:${day}`,
    getAutoReplyLimit(user),
    config.smtpAutoReplyDailyLimitPerRecipient,
    TWO_DAYS
  );
  return Number(result) === 0;
}

/**
 * Reserve one of a user's vacation and sieve auto-replies for today (per user
 * only, see `reserveAutoReplyFor`).
 *
 * @param {Object} client - Redis client
 * @param {Object|string} userId - User the message is sent for
 * @param {Date} [now] - Current time
 * @returns {Promise<boolean>} True if the message can be sent
 */
async function reserveAutoReply(client, userId, now = new Date()) {
  return reserve({
    client,
    userId,
    now,
    kind: 'auto_reply',
    getLimit: getAutoReplyLimit
  });
}

/**
 * Whether a bounce notification (DSN) for a message can be sent to its
 * return address: always to the domain it was sent from, or a domain the
 * sender is an admin of (or their subdomains), and otherwise within a daily
 * cap per sender (see `getBounceNotificationLimit`), since the return address
 * of a submitted message can be any address, and bounce notifications do not
 * count toward thresholds.
 *
 * @param {Object} options
 * @param {Object} options.client - Redis client
 * @param {Object} options.email - Email the notification is about
 * @param {Object} options.domain - Domain it was sent from
 * @param {Date} [options.now] - Current time
 * @returns {Promise<string|boolean>} `own` (a domain of the sender), `external`
 *   (another address, which gets the original message's headers only), or
 *   false if it cannot be sent
 */
async function canSendBounceTo({ client, email, domain, now = new Date() }) {
  // (the address the notification is delivered to, e.g. unwrapped from an
  // SRS return address on the sender's domain, see `Emails.queue`)
  const address =
    email && email.envelope && typeof email.envelope.from === 'string'
      ? normalizeAddress(checkSRS(email.envelope.from))
      : '';
  const host = address ? address.split('@').pop() : '';
  const name = toASCIIDomain(domain && domain.name);
  if (host && name && (host === name || host.endsWith(`.${name}`)))
    return 'own';

  const userId =
    email && email.user && typeof email.user === 'object' && email.user._id
      ? email.user._id
      : email && email.user;
  const id = getUserId(userId);

  // (another domain the sender is an admin of, e.g. their bounce domain)
  if (id && host) {
    const { Domains } = require('#models');
    const labels = host.split('.');
    const names = new Set();
    for (let i = 0; i < labels.length - 1; i++) {
      const suffix = labels.slice(i).join('.');
      names.add(suffix);
      try {
        names.add(punycode.toUnicode(suffix));
      } catch {}
    }

    const isOwn = await Domains.exists({
      name: { $in: [...names] },
      members: {
        $elemMatch: {
          user: new mongoose.Types.ObjectId(id),
          group: 'admin'
        }
      },
      $or: [{ has_smtp: true }, { has_txt_record: true }]
    });
    if (isOwn) return 'own';
  }

  const isAllowed = await reserve({
    client,
    userId,
    now,
    kind: 'bounce_notification',
    getLimit: getBounceNotificationLimit
  });
  if (!isAllowed)
    logger.warn('bounce notification daily limit reached', {
      user: { id },
      email: email && email._id,
      ignore_hook: true
    });
  return isAllowed ? 'external' : false;
}

module.exports = reserveAutoReply;
module.exports.canSendBounceTo = canSendBounceTo;
module.exports.getAutoReplyLimit = getAutoReplyLimit;
module.exports.getBounceNotificationLimit = getBounceNotificationLimit;
module.exports.isAuthenticatedSender = isAuthenticatedSender;
module.exports.isAddressedTo = isAddressedTo;
module.exports.isAddressedToDomain = isAddressedToDomain;
module.exports.reserveAutoReplyFor = reserveAutoReplyFor;
