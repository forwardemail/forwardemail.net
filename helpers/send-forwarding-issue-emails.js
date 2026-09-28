/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const revHash = require('rev-hash');

const Aliases = require('#models/aliases');
const DenylistError = require('#helpers/denylist-error');
const Domains = require('#models/domains');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getBounceInfo = require('#helpers/get-bounce-info');
const getErrorCode = require('#helpers/get-error-code');
const i18n = require('#helpers/i18n');
const { isWithinGracePeriod } = require('#helpers/is-within-grace-period');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseUsername = require('#helpers/parse-username');

//
// Permanent rejections that mean the destination itself is broken and that
// the alias owner can fix (e.g. "User unknown", "Mailbox full", a domain with
// no mail servers). Spam, policy, DMARC, and blocklist rejections are about
// the message or the sending IP, not the forwarding setup, so they are not
// reported here.
//
const DESTINATION_ISSUE_CATEGORIES = new Set(['recipient', 'capacity', 'dns']);

// the most text from the receiving server that is included in the email
const MAX_ERROR_LENGTH = 1000;

// the most of the original From and Subject that is included in the email
// (they are chosen by the sender, so they are only shown as a short reference)
const MAX_HEADER_LENGTH = 200;

function truncate(value, max) {
  if (typeof value !== 'string') return value;
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

const PAID_PLANS = ['enhanced_protection', 'team'];

const USER_FIELDS = [
  'id',
  'email',
  'plan',
  config.lastLocaleField,
  config.userFields.isBanned,
  config.userFields.hasVerifiedEmail,
  config.userFields.planExpiresAt,
  config.userFields.stripeSubscriptionID,
  config.userFields.paypalSubscriptionID
].join(' ');

function isDestinationIssue(bounce) {
  if (!isSANB(bounce?.destination) || !bounce.err) return false;

  // our own errors and denylisted senders are never the destination's fault
  if (
    bounce.err.isCodeBug ||
    bounce.err instanceof DenylistError ||
    bounce.err.name === 'DenylistError'
  )
    return false;

  if (!bounce.err.bounceInfo) bounce.err.bounceInfo = getBounceInfo(bounce.err);
  const { category } = bounce.err.bounceInfo;

  // the destination deferred until the retry window closed and was skipped
  if (bounce.isRetryWindowExceeded)
    return category !== 'spam' && category !== 'virus';

  return (
    getErrorCode(bounce.err) >= 500 &&
    DESTINATION_ISSUE_CATEGORIES.has(category)
  );
}

//
// A user on a paid plan in good standing: an unexpired plan, an active
// subscription, or within the grace period after expiry (the same test used
// for outbound SMTP access in `#helpers/validate-domain`).
//
function isPayingUser(user, plans = PAID_PLANS) {
  return Boolean(
    user &&
      !user[config.userFields.isBanned] &&
      user[config.userFields.hasVerifiedEmail] &&
      plans.includes(user.plan) &&
      (new Date(user[config.userFields.planExpiresAt]).getTime() >=
        Date.now() ||
        isSANB(user[config.userFields.stripeSubscriptionID]) ||
        isSANB(user[config.userFields.paypalSubscriptionID]) ||
        isWithinGracePeriod(user))
  );
}

function isNotifiableUser(user) {
  return Boolean(
    user &&
      isSANB(user.email) &&
      !user[config.userFields.isBanned] &&
      user[config.userFields.hasVerifiedEmail]
  );
}

//
// The single `forward-email-site-verification=` value published at the
// domain's own host (the same record forwarding uses to find the domain in
// `#helpers/get-forwarding-addresses`). Nothing is returned when there is
// none or when there is more than one (forwarding rejects that too), so an
// email is only sent for a domain whose DNS currently proves which account it
// belongs to. A temporary lookup failure is thrown, so the caller can try
// again with the next bounce instead of waiting out the interval.
//
async function getVerificationRecord(domainName, resolver) {
  let records;
  try {
    records = await resolver.resolveTxt(domainName);
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') return;
    throw err;
  }

  const values = new Set();
  for (const record of records) {
    const value = (
      Array.isArray(record) ? record.join('') : String(record)
    ).trim();
    if (value.startsWith(config.paidPrefix)) {
      const verification = value.slice(config.paidPrefix.length).trim();
      if (isSANB(verification)) values.add(verification);
    }
  }

  if (values.size !== 1) return;
  return [...values][0];
}

// whether an alias is set up to deliver to this destination
function isAliasDestination(alias, bounce) {
  if (!alias || !alias.is_enabled) return false;
  if (bounce.isMailbox) return Boolean(alias.has_imap);
  const destination = bounce.destination.toLowerCase();
  return (
    Array.isArray(alias.recipients) &&
    alias.recipients.some(
      (r) => typeof r === 'string' && r.trim().toLowerCase() === destination
    )
  );
}

//
// Who to email about a broken destination, or nothing when any check fails:
//
// 1. the domain's live TXT record has exactly one site verification value,
//    and it belongs to a paid domain document with this exact name
//    (`verification_record` is unique, and matching the name as well means a
//    value copied into another domain's DNS is never trusted)
// 2. an admin of that domain is paying (the plan is not past due or expired)
// 3. the alias is enabled and actually lists this destination (or, for a
//    mailbox, has IMAP storage), so a destination is never attributed to an
//    alias that does not use it (e.g. one reached through another alias)
// 4. the alias owner is still a member of the domain
// 5. each recipient (alias owner, and admins outside member-managed domains)
//    has a verified email address and is not banned
//
// Only the domain has to be paid for: its members (e.g. the alias owner on a
// team plan domain) do not need a paid plan of their own.
//
async function getRecipients(bounce, resolver) {
  const domainName = parseHostFromDomainOrAddress(bounce.address);
  const verification = await getVerificationRecord(domainName, resolver);
  if (!verification) return;

  const domain = await Domains.findOne({
    name: punycode.toUnicode(domainName),
    verification_record: verification,
    plan: { $in: PAID_PLANS }
  })
    .select('_id id name plan is_global members')
    .populate('members.user', USER_FIELDS)
    .lean()
    .exec();

  if (!domain) return;

  // the domain's plan must still be paid for (not past due or expired)
  const domainPlans = domain.plan === 'team' ? ['team'] : PAID_PLANS;
  if (
    !domain.members.some(
      (m) => m.group === 'admin' && isPayingUser(m.user, domainPlans)
    )
  )
    return;

  const username = parseUsername(bounce.address);
  const aliasFields = 'id name user is_enabled has_imap recipients';
  let alias = await Aliases.findOne({
    domain: domain._id,
    name: { $in: [...new Set([username, punycode.toUnicode(username)])] }
  })
    .select(aliasFields)
    .populate('user', USER_FIELDS)
    .lean()
    .exec();

  // mail to an address without its own alias is handled by the catch-all
  if (!alias)
    alias = await Aliases.findOne({ domain: domain._id, name: '*' })
      .select(aliasFields)
      .populate('user', USER_FIELDS)
      .lean()
      .exec();

  if (!isAliasDestination(alias, bounce)) return;

  const memberIds = new Set(
    domain.members
      .filter((m) => m.user && m.user._id)
      .map((m) => m.user._id.toString())
  );

  const users = new Map();
  if (
    alias.user &&
    alias.user._id &&
    memberIds.has(alias.user._id.toString()) &&
    isNotifiableUser(alias.user)
  )
    users.set(alias.user.email.toLowerCase(), alias.user);

  //
  // Members manage their own aliases on global vanity domains and Ubuntu
  // team domains, so only the alias owner is emailed there (their admins
  // would otherwise receive a notice for every member's forwarding).
  //
  const isMemberManaged =
    domain.is_global ||
    Object.keys(config.ubuntuTeamMapping).includes(domain.name);

  if (!isMemberManaged) {
    for (const member of domain.members) {
      if (member.group !== 'admin' || !isNotifiableUser(member.user)) continue;
      const key = member.user.email.toLowerCase();
      if (!users.has(key)) users.set(key, member.user);
    }
  }

  return { domain, alias, users: [...users.values()] };
}

//
// Email the alias owner and domain admins when a forwarding destination is
// broken, with the receiving server's error. Sent at most once per
// `config.forwardingIssueEmailInterval` for the same domain and destination.
//
// `outcome` is what happened to the message as a whole:
//   - "accepted": other recipients received it (the sender got no bounce)
//   - "rejected": nobody received it (the sender got a bounce)
//
async function sendForwardingIssueEmails({
  client,
  resolver,
  session,
  message,
  accepted,
  bounces,
  outcome
}) {
  const acceptedSet = new Set(accepted.map((a) => a.toLowerCase()));
  const seen = new Set();
  const issues = [];
  for (const bounce of bounces) {
    if (!isDestinationIssue(bounce)) continue;
    const key = [
      bounce.address.toLowerCase(),
      bounce.destination.toLowerCase()
    ].join(' ');
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push(bounce);
  }

  if (issues.length === 0) return;

  await pMapSeries(issues, async (bounce) => {
    try {
      const domainName = parseHostFromDomainOrAddress(bounce.address);
      const key = `forwarding_issue:${revHash(
        [domainName, bounce.destination.toLowerCase()].join(' ')
      )}`;
      const acquired = await client.set(
        key,
        Date.now(),
        'PX',
        config.forwardingIssueEmailInterval,
        'NX'
      );
      if (!acquired) return;

      let result;
      try {
        result = await getRecipients(bounce, resolver);
      } catch (err) {
        // (a temporary DNS or database error: allow the next bounce to retry)
        await client.del(key);
        throw err;
      }

      if (!result || result.users.length === 0) return;

      //
      // cap how many of these emails one domain can trigger in a day
      // (on top of the per-destination interval above); a destination that
      // is over the cap is not held back for the whole interval
      //
      const dailyKey = `forwarding_issue_daily:${result.domain.id}`;
      const count = await client.incr(dailyKey);
      if (count === 1) await client.pexpire(dailyKey, ms('1d'));
      if (count > config.forwardingIssueEmailDailyLimit) {
        await client.del(key);
        return;
      }

      const error = String(
        bounce.err.original_message || bounce.err._message || bounce.err.message
      );

      const status = acceptedSet.has(bounce.address.toLowerCase())
        ? 'delivered_to_others'
        : outcome === 'accepted'
        ? 'not_delivered'
        : 'bounced';

      await pMapSeries(result.users, async (user) => {
        const locale =
          user[config.lastLocaleField] || i18n.config.defaultLocale;
        await emailHelper({
          template: 'forwarding-issue',
          message: { to: user.email },
          locals: {
            user,
            locale,
            domainName: result.domain.name,
            alias: bounce.address,
            destination: bounce.destination,
            isMailbox: Boolean(bounce.isMailbox),
            isWebhook: !bounce.isMailbox && !bounce.destination.includes('@'),
            status,
            isRetryWindowExceeded: Boolean(bounce.isRetryWindowExceeded),
            retryWindow: ms(config.partialDeliveryRetryWindow, { long: true }),
            interval: ms(config.forwardingIssueEmailInterval, { long: true }),
            error: truncate(error, MAX_ERROR_LENGTH),
            from: truncate(message.from, MAX_HEADER_LENGTH),
            subject: truncate(message.subject, MAX_HEADER_LENGTH),
            messageId: message.messageId,
            date: message.date
          }
        });
      });

      logger.info('forwarding issue email sent', {
        session,
        alias: bounce.address,
        destination_hash: revHash(bounce.destination.toLowerCase()),
        recipients: result.users.map((u) => u.id)
      });
    } catch (err) {
      logger.error(err, { session });
    }
  });
}

module.exports = sendForwardingIssueEmails;
module.exports.isDestinationIssue = isDestinationIssue;
