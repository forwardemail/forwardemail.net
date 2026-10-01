/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');

const SMTPError = require('#helpers/smtp-error');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const { getSmtpDayStart } = require('#helpers/get-smtp-day');

const {
  SMTP_LIMIT_USER_FIELDS,
  canBeSmtpAccount,
  canLendSmtpLimit,
  getSmtpBaseLimit,
  getSmtpManualFloor,
  isSmtpOnHold,
  isSmtpRestricted
} = getUserSmtpLimit;

const ONE_DAY = 24 * 60 * 60 * 1000;

const SMTP_LIMITS_URL = `${config.urls.web}/faq#what-are-your-outbound-smtp-limits`;

// fields read from each admin of the domain (includes `group`)
const ADMIN_FIELDS = SMTP_LIMIT_USER_FIELDS;

// delivered messages (what a domain ramps up with)
const DELIVERED_STATUSES = ['sent', 'partially_sent'];

// how long computing a domain's past daily counts is locked for
const DAILY_COUNTS_LOCK_TTL = 5 * 60 * 1000;

// how long an account's list of domains is reused
const ACCOUNT_DOMAINS_TTL = 60 * 1000;

//
// Ids of the admins of a domain (members may or may not be populated)
// NOTE: After populate, m.user can be `null` if the referenced user was deleted.
//
function getAdminIds(domain) {
  if (!domain || !Array.isArray(domain.members)) return [];
  const ids = [];
  for (const member of domain.members) {
    if (!member || member.group !== 'admin' || !member.user) continue;
    ids.push(
      typeof member.user._id === 'object' ? member.user._id : member.user
    );
  }

  return ids;
}

//
// Starting threshold of a domain (the Team plan's on Team plan domains)
//
function getDomainBaseLimit(domain) {
  return getSmtpBaseLimit({ plan: domain && domain.plan });
}

/**
 * The busiest day of delivered mail from a domain in the baseline window
 * before `start` (from its daily counts).
 *
 * @param {Array<Object>} dailyCounts - `{ day, count }` per (UTC) day
 * @param {Date} start - Start of today (UTC)
 * @returns {number} Busiest day (0 without history)
 */
function getDomainBaseline(dailyCounts, start) {
  if (!Array.isArray(dailyCounts)) return 0;
  const from = start.getTime() - config.smtpVelocityBaselineDays * ONE_DAY;
  let peak = 0;
  for (const entry of dailyCounts) {
    if (!entry || !entry.day || typeof entry.count !== 'number') continue;
    const time = new Date(entry.day).getTime();
    if (time < from || time >= start.getTime()) continue;
    if (entry.count > peak) peak = entry.count;
  }

  return peak;
}

/**
 * Delivered messages per (UTC) day from a domain in the baseline window
 * before `start`, as `{ day, count }` sorted by day.
 *
 * @param {Object} Emails - Emails model
 * @param {Object} domainId - Domain id
 * @param {Date} from - Start of the first day
 * @param {Date} end - End of the last day (exclusive)
 * @returns {Promise<Array<Object>>} Daily counts
 */
async function aggregateDailyCounts(Emails, domainId, from, end) {
  const rows = await Emails.aggregate([
    {
      $match: {
        domain: domainId,
        created_at: { $gte: from, $lt: end },
        status: { $in: DELIVERED_STATUSES },
        is_bounce: { $ne: true }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$created_at',
            timezone: 'UTC'
          }
        },
        count: { $sum: 1 }
      }
    }
  ]).allowDiskUse(true);

  return rows
    .map((row) => ({
      day: new Date(`${row._id}T00:00:00.000Z`),
      count: row.count
    }))
    .sort((a, b) => a.day.getTime() - b.day.getTime());
}

//
// A domain's daily counts, computed from its sent mail the first time they
// are needed (the reputation job adds each day after that, and computes them
// for domains that sent).  Returns `undefined` while another process is
// computing them, and `null` if computing them failed.
//
async function getDailyCounts({ domain, Domains, Emails, client, start }) {
  if (domain.smtp_daily_counts_at) return domain.smtp_daily_counts || [];

  const lockKey = `${config.smtpLimitNamespace}:daily_counts_lock:${domain._id}`;
  if (client) {
    try {
      const locked = await client.set(
        lockKey,
        '1',
        'PX',
        DAILY_COUNTS_LOCK_TTL,
        'NX'
      );
      if (locked !== 'OK') return undefined;
    } catch (err) {
      logger.fatal(err);
    }
  }

  try {
    const counts = await aggregateDailyCounts(
      Emails,
      domain._id,
      new Date(start.getTime() - config.smtpVelocityBaselineDays * ONE_DAY),
      start
    );
    await Domains.updateOne(
      { _id: domain._id, smtp_daily_counts_at: { $exists: false } },
      {
        $set: {
          smtp_daily_counts: counts,
          smtp_daily_counts_at: new Date()
        }
      }
    );
    return counts;
  } catch (err) {
    logger.fatal(err, { domains: [domain._id] });
    return null;
  } finally {
    if (client)
      client
        .del(lockKey)
        .then()
        .catch((err) => logger.fatal(err));
  }
}

//
// The account of a domain: its admin with the highest threshold (ties by id,
// so the same admin is picked for each of their domains), among the admins
// who can be an account (see `canBeSmtpAccount`, so e.g. free co-admins with
// a lower id cannot split an account into one threshold per domain), and the
// highest threshold among the admins who can lend it (see
// `canLendSmtpLimit`, e.g. not while their lending is paused, when the
// domains are still held to their account's threshold)
//
function pickOwner(admins, now = new Date()) {
  let owner = null;
  let ownerLimit = 0;
  let lendLimit = 0;
  for (const admin of admins) {
    if (!canBeSmtpAccount(admin, now)) continue;
    const limit = getUserSmtpLimit(admin);
    if (canLendSmtpLimit(admin, now)) lendLimit = Math.max(lendLimit, limit);
    if (
      !owner ||
      limit > ownerLimit ||
      (limit === ownerLimit && admin._id.toString() < owner._id.toString())
    ) {
      owner = admin;
      ownerLimit = limit;
    }
  }

  return { owner, ownerLimit, lendLimit };
}

//
// Ids of the domains an account is the account of (the domains it is an
// admin of, except those another admin with a higher threshold is the
// account of), cached for a minute in Redis
//
async function getAccountDomainIds({ accountId, Domains, Users, client }) {
  const cacheKey = `${config.smtpLimitNamespace}:account_domains:${accountId}`;
  let ids = null;
  if (client) {
    try {
      const cached = await client.get(cacheKey);
      if (cached) ids = JSON.parse(cached);
    } catch (err) {
      logger.fatal(err);
    }
  }

  if (!Array.isArray(ids)) {
    // (only domains that can send, so adding many other domains does not
    // slow down every message)
    const domains = await Domains.find({
      members: { $elemMatch: { user: accountId, group: 'admin' } },
      has_smtp: true,
      plan: { $in: ['enhanced_protection', 'team'] }
    })
      .select('members')
      .lean()
      .exec();
    const adminIds = new Set();
    for (const d of domains)
      for (const id of getAdminIds(d)) adminIds.add(id.toString());
    const admins =
      adminIds.size > 0
        ? await Users.find({ _id: { $in: [...adminIds] } })
            .select(SMTP_LIMIT_USER_FIELDS)
            .lean()
            .exec()
        : [];
    const byId = new Map(admins.map((admin) => [admin._id.toString(), admin]));
    ids = [];
    for (const d of domains) {
      const { owner } = pickOwner(
        getAdminIds(d)
          .map((id) => byId.get(id.toString()))
          .filter(Boolean)
      );
      if (owner && owner._id.toString() === accountId.toString())
        ids.push(d._id.toString());
    }

    if (client)
      client
        .set(cacheKey, JSON.stringify(ids), 'PX', ACCOUNT_DOMAINS_TTL)
        .then()
        .catch((err) => logger.fatal(err));
  }

  return ids.map((id) => new mongoose.Types.ObjectId(id));
}

/**
 * Get the daily thresholds and today's counts that apply to a user sending
 * from a domain.
 *
 * - The account: a threshold is account-wide.  The account is the domain's
 *   admin with the highest threshold (on Team plan domains the one the domain
 *   borrows its threshold from), and all mail from every domain that account
 *   is an admin of counts toward it, whoever sends it (so adding domains or
 *   members does not multiply the threshold).
 * - The sender: their own daily count, against the domain's threshold on
 *   Team plan domains (unless they are restricted or on hold, see
 *   `helpers/get-domain-smtp-limit.js`) or else their own threshold.
 * - The domain: each domain ramps up within the account's threshold, to a
 *   multiple of its busiest day of delivered mail in the baseline window (at
 *   least the starting threshold, or a minimum an admin approved for one of
 *   its admins), so a new domain cannot use an established account's
 *   threshold at once.
 *
 * Domains whose admins are all system admins are exempt, and system admins
 * cannot send from any other (customer) domain.
 *
 * @param {Object} options
 * @param {Object} options.user - Sending user (with the SMTP limit fields and `group`)
 * @param {Object} options.domain - Domain sent from (with `plan`, `members`
 *   and the daily counts)
 * @param {Object} options.Users - Users model
 * @param {Object} options.Domains - Domains model
 * @param {Object} options.Emails - Emails model
 * @param {Object} [options.client] - Redis client
 * @param {Date} [options.now] - Current time
 * @returns {Promise<Object>} `{ isBlocked }`, `{ isExempt }` or the limits
 *   and counts
 */
async function getSmtpSendingLimits({
  user,
  domain,
  Users,
  Domains,
  Emails,
  client,
  now = new Date()
}) {
  const start = getSmtpDayStart(now);
  const adminIds = getAdminIds(domain);
  const admins =
    adminIds.length > 0
      ? await Users.find({ _id: { $in: adminIds } })
          .select(ADMIN_FIELDS)
          .lean()
          .exec()
      : [];

  // (a customer cannot make their domain exempt by adding a system admin,
  // and an admin who no longer exists is not a system admin, including one
  // that populating the domain's members left empty)
  const isSystemDomain =
    admins.length > 0 &&
    admins.length === new Set(adminIds.map(String)).size &&
    !domain.members.some(
      (member) => member && member.group === 'admin' && !member.user
    ) &&
    admins.every((admin) => admin.group === 'admin');
  if (user && user.group === 'admin' && !isSystemDomain)
    return { isBlocked: true };
  if (isSystemDomain) return { isExempt: true };

  // the account
  const { owner, ownerLimit, lendLimit } = pickOwner(admins, now);

  // (an admin of the domain keeps their own threshold on it, e.g. while their
  // lending to its members is paused)
  const isAdmin =
    user &&
    user._id &&
    admins.some((admin) => admin._id.toString() === user._id.toString()) &&
    canBeSmtpAccount(user, now);
  // (a threshold earned while paying only applies while still paying, so
  // e.g. a sender whose plan expired cannot use it on someone else's domain)
  const userLimit = canBeSmtpAccount(user, now)
    ? getUserSmtpLimit(user)
    : Math.min(getUserSmtpLimit(user), getDomainBaseLimit(domain));
  const domainMax =
    domain.plan === 'team'
      ? Math.max(
          lendLimit > 0 ? lendLimit : getDomainBaseLimit(domain),
          isAdmin ? userLimit : 0
        )
      : userLimit;
  // (a user an admin restricted stays restricted, and a user on hold after
  // spam or virus reports is held to their own threshold)
  const userMax =
    isSmtpRestricted(user) || isSmtpOnHold(user, now)
      ? Math.min(userLimit, domainMax)
      : domainMax;
  const accountLimit = Math.max(ownerLimit, domainMax);
  const accountId = owner ? owner._id : user._id;

  const accountDomainIds = await getAccountDomainIds({
    accountId,
    Domains,
    Users,
    client
  });
  if (!accountDomainIds.some((id) => id.toString() === domain._id.toString()))
    accountDomainIds.push(domain._id);

  const today = { $gte: start };
  const [userCount, domainCount, accountCount, dailyCounts] = await Promise.all(
    [
      Emails.countDocuments({
        user: user._id,
        is_bounce: { $ne: true },
        created_at: today
      }),
      Emails.countDocuments({
        domain: domain._id,
        is_bounce: { $ne: true },
        created_at: today
      }),
      accountDomainIds.length > 1
        ? Emails.countDocuments({
            domain: { $in: accountDomainIds },
            is_bounce: { $ne: true },
            created_at: today
          })
        : null,
      getDailyCounts({ domain, Domains, Emails, client, start })
    ]
  );

  //
  // the domain's ramp-up
  //
  let approved = isAdmin ? getSmtpManualFloor(user) : 0;
  for (const admin of admins)
    if (canLendSmtpLimit(admin, now))
      approved = Math.max(approved, getSmtpManualFloor(admin));
  const baseline = getDomainBaseline(dailyCounts, start);
  // (while another message computes the domain's history, which takes
  // seconds, it is held to its starting threshold, so concurrent first
  // messages from a new domain cannot skip the ramp; if computing it failed,
  // no message is refused for it and the account-wide threshold still applies)
  const isHistoryPending = dailyCounts === undefined;
  const domainLimit =
    dailyCounts === null
      ? accountLimit
      : Math.min(
          accountLimit,
          Math.max(
            getDomainBaseLimit(domain),
            Math.ceil(baseline * config.smtpDomainRampMultiplier),
            approved
          )
        );

  return {
    isBlocked: false,
    isExempt: false,
    start,
    accountId,
    accountLimit,
    accountCount: accountCount === null ? domainCount : accountCount,
    userLimit: userMax,
    userCount,
    domainMax,
    domainLimit,
    domainCount,
    domainBaseline: baseline,
    isHistoryPending
  };
}

/**
 * The threshold to show a sender (e.g. with their count today): the most
 * they can send today, given how much of the domain's and the account's
 * thresholds are left too.
 *
 * @param {Object} limits - From `getSmtpSendingLimits`
 * @returns {number|null} Threshold (or null when exempt or blocked)
 */
function getSmtpEffectiveLimit(limits) {
  if (!limits || limits.isExempt || limits.isBlocked) return null;
  return (
    limits.userCount +
    Math.max(
      0,
      Math.min(
        limits.userLimit - limits.userCount,
        limits.domainLimit - limits.domainCount,
        limits.accountLimit - limits.accountCount
      )
    )
  );
}

//
// Alert the domain's admins that a threshold was reached (deduplicated)
//
function alertThresholdReached({ domain, client, Domains }) {
  if (!client) return;
  const alertKey = `${config.smtpLimitNamespace}:rate_alert:${domain._id}`;
  client
    .set(alertKey, '1', 'PX', config.smtpRateLimitAlertTTL, 'NX')
    .then((wasSet) => {
      if (wasSet !== 'OK') return;
      return Domains.getToAndMajorityLocaleByDomain(domain).then(
        ({ to, locale }) =>
          emailHelper({
            template: 'alert',
            message: {
              to,
              bcc: config.alertsEmail,
              locale,
              subject: i18n.translate('SMTP_THRESHOLD_REACHED_SUBJECT', locale)
            },
            locals: {
              locale,
              message: i18n.translate(
                'SMTP_THRESHOLD_REACHED_MESSAGE',
                locale,
                SMTP_LIMITS_URL
              )
            }
          })
      );
    })
    .catch((err) => logger.fatal(err));
}

/**
 * Get the limits (see `getSmtpSendingLimits`) and reject the message if the
 * sender is a system admin on a customer domain (550), or the domain, the
 * sender or the account reached today's threshold (421).
 *
 * @param {Object} options - Same as `getSmtpSendingLimits`
 * @returns {Promise<Object>} The limits
 */
async function enforceSmtpSendingLimits(options) {
  const limits = await getSmtpSendingLimits(options);

  if (limits.isBlocked)
    throw new SMTPError(
      'System administrators cannot send from customer domains',
      { responseCode: 550, ignoreHook: true }
    );

  if (limits.isExempt) return limits;

  if (
    limits.domainCount >= limits.domainLimit ||
    limits.userCount >= limits.userLimit ||
    limits.accountCount >= limits.accountLimit
  ) {
    // (not while the domain's history is being computed)
    if (!limits.isHistoryPending) alertThresholdReached(options);
    throw new SMTPError('Rate limit exceeded', {
      responseCode: 421,
      ignoreHook: true
    });
  }

  return limits;
}

module.exports = getSmtpSendingLimits;
module.exports.getSmtpSendingLimits = getSmtpSendingLimits;
module.exports.enforceSmtpSendingLimits = enforceSmtpSendingLimits;
module.exports.getDomainBaseline = getDomainBaseline;
module.exports.aggregateDailyCounts = aggregateDailyCounts;
module.exports.getAdminIds = getAdminIds;
module.exports.pickOwner = pickOwner;
module.exports.getSmtpEffectiveLimit = getSmtpEffectiveLimit;
module.exports.DELIVERED_STATUSES = DELIVERED_STATUSES;
