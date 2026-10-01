/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const _ = require('#helpers/lodash');
const SMTPError = require('#helpers/smtp-error');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const logger = require('#helpers/logger');
const { getSmtpDayKey, getSmtpDayStart } = require('#helpers/get-smtp-day');
const {
  senderRejectionExpression
} = require('#helpers/smtp-reputation-recipients');

const {
  canLendSmtpLimit,
  getSmtpBaseLimit,
  getSmtpManualFloor,
  isSmtpOnHold,
  isSmtpRestricted
} = getUserSmtpLimit;

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

function noop() {}

//
// how long a passing burst/backlog/bounce check is reused (limits per-message
// queries)
//
const CHECK_CACHE_TTL = 15 * 1000;

const FINAL_STATUSES = ['sent', 'partially_sent', 'bounced', 'rejected'];
const BAD_STATUSES = ['bounced', 'rejected'];

//
// Fields that must be selected on a user for the slowdown check
//
const SMTP_VELOCITY_USER_FIELDS = [
  'plan',
  config.userFields.smtpLimit,
  config.userFields.smtpReputationTier,
  config.userFields.smtpBaselineDaily,
  config.userFields.smtpBaselineHourly,
  config.userFields.smtpBaselineAt
].join(' ');

//
// Whether the user's recent normal volume has been measured yet
// (the reputation job measures every user who can send)
//
function hasBaseline(user) {
  return Boolean(user && user[config.userFields.smtpBaselineAt]);
}

//
// The baseline is the busiest day in the baseline window and records which
// day that was, so it stops counting once that day is too old (with slack,
// since the job measures it once a day, a couple of days behind)
//
function isBaselineFresh(user, now) {
  if (!hasBaseline(user)) return false;
  return (
    new Date(user[config.userFields.smtpBaselineAt]).getTime() >=
    now.getTime() -
      (config.smtpVelocityBaselineDays +
        config.smtpReputationEvaluationDelayDays +
        2) *
        ONE_DAY
  );
}

//
// Highest manual floor an admin approved among a team domain's admins
// (members must be populated with `smtp_limit`)
//
function getDomainManualFloor(domain) {
  if (!domain || domain.plan !== 'team' || !Array.isArray(domain.members))
    return 0;
  let floor = 0;
  for (const member of domain.members) {
    if (
      member &&
      member.group === 'admin' &&
      member.user !== null &&
      typeof member.user === 'object' &&
      canLendSmtpLimit(member.user)
    )
      floor = Math.max(floor, getSmtpManualFloor(member.user));
  }

  return floor;
}

/**
 * The starting daily threshold for a sender: their plan's (the Team plan
 * starts higher), or the Team plan's when sending from a Team plan domain.
 *
 * @param {Object} user - User object with `plan`
 * @param {Object} [domain] - Domain sent from (with `plan`)
 * @returns {number} Starting daily threshold
 */
function getSmtpVelocityBase(user, domain = null, now = new Date()) {
  return Math.max(
    getSmtpBaseLimit(user),
    // (not while the sender is on hold after spam or virus reports)
    domain && domain.plan === 'team' && !isSmtpOnHold(user, now)
      ? getSmtpBaseLimit({ plan: 'team' })
      : 0
  );
}

/**
 * Get the most a sender can send today before their pattern is unusual.
 *
 * This is a multiple of their recent normal volume (busiest day in the
 * baseline window), so a dormant or long-standing sender cannot jump to
 * sending far more than usual, whatever their threshold.  It is
 * never lower than the starting threshold (of their plan, or of the Team plan
 * on a Team plan domain) or a manual floor an admin approved (for the user,
 * or for an admin of their team domain).
 *
 * @param {Object} user - User object with the SMTP velocity fields
 * @param {Date} [now] - Current time
 * @param {Object} [domain] - Domain sent from (members populated)
 * @returns {number} Daily volume above which sending is slowed down
 */
function getSmtpVelocityLimit(user, now = new Date(), domain = null) {
  const base = getSmtpVelocityBase(user, domain, now);
  if (!user || typeof user !== 'object') return base;

  // (a sender whose normal volume was not measured yet has none)
  const baseline = isBaselineFresh(user, now)
    ? user[config.userFields.smtpBaselineDaily] || 0
    : 0;

  return Math.max(
    base,
    getSmtpManualFloor(user),
    // (not while the sender is on hold after spam or virus reports)
    isSmtpOnHold(user, now) ? 0 : getDomainManualFloor(domain),
    Math.ceil(baseline * config.smtpVelocitySpikeMultiplier)
  );
}

//
// Record the slowdown: when it last happened (shown to the user) and which
// days it happened on (those days are not clean sending days).  At most once
// an hour per user, since senders retry.
//
async function markThrottled({ user, Users, now }) {
  const day = getSmtpDayStart(now);
  try {
    await Users.updateOne(
      {
        _id: user._id,
        $or: [
          { [config.userFields.smtpThrottledAt]: { $exists: false } },
          { [config.userFields.smtpThrottledAt]: null },
          {
            [config.userFields.smtpThrottledAt]: {
              $lt: new Date(now.getTime() - ONE_HOUR)
            }
          }
        ]
      },
      [
        {
          $set: {
            [config.userFields.smtpThrottledAt]: now,
            // (days older than the ones kept are dropped)
            [config.userFields.smtpThrottledDays]: {
              $filter: {
                input: {
                  $setUnion: [
                    {
                      $ifNull: [`$${config.userFields.smtpThrottledDays}`, []]
                    },
                    [day]
                  ]
                },
                cond: {
                  $gte: [
                    '$$this',
                    new Date(
                      day.getTime() -
                        config.smtpVelocityThrottledDaysKept * ONE_DAY
                    )
                  ]
                }
              }
            }
          }
        }
      ]
    );
  } catch (err) {
    logger.fatal(err);
  }
}

function sendAlert({ user, client, reason, details }) {
  if (!client) return;
  const key = `${config.smtpLimitNamespace}:velocity_alert:${user._id}`;
  client
    .set(key, '1', 'PX', config.smtpRateLimitAlertTTL, 'NX')
    .then((wasSet) => {
      if (wasSet !== 'OK') return;
      return emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Unusual outbound SMTP pattern: ${user.email || user._id}`
        },
        locals: {
          message: `<p>Outbound SMTP for <strong>${_.escape(
            user.email || String(user._id)
          )}</strong> was slowed down (${_.escape(
            reason
          )}).</p><ul>${Object.entries(details)
            .map(
              ([k, v]) =>
                `<li>${_.escape(k)}: ${_.escape(
                  typeof v === 'number' ? v.toLocaleString('en') : String(v)
                )}</li>`
            )
            .join('')}</ul><p>Review this sender in the admin dashboard.</p>`
        }
      });
    })
    .catch((err) => logger.fatal(err));
}

/**
 * The Redis key counting a user's recipients outside the domain they sent
 * from in an hour (UTC), the recent sending spam and virus reports are a rate
 * of (see `helpers/record-smtp-reputation-report.js`).
 *
 * @param {Object|string} userId - User id
 * @param {Date} date - Any time in the hour
 * @returns {string} Key
 */
function getRecipientsHourKey(userId, date) {
  return `${config.smtpLimitNamespace}:velocity_rcpt_ext:${userId}:${new Date(
    date
  )
    .toISOString()
    .slice(0, 13)}`;
}

//
// Recipients of a message outside the domain it was sent from (and its
// subdomains)
//
function countExternalRecipients(to, domain) {
  if (!Array.isArray(to)) return 0;
  // (domain names are stored in Unicode, recipients are in ASCII)
  let name =
    domain && typeof domain.name === 'string' ? domain.name.toLowerCase() : '';
  try {
    name = punycode.toASCII(name);
  } catch {}

  let count = 0;
  for (const address of to) {
    const value =
      typeof address === 'string'
        ? address
        : address && typeof address.address === 'string'
        ? address.address
        : '';
    let host = value.toLowerCase().split('@').pop();
    try {
      host = punycode.toASCII(host);
    } catch {}

    if (!host || (name && (host === name || host.endsWith(`.${name}`))))
      continue;
    count++;
  }

  return count;
}

//
// Count this message's recipients toward today's totals for the user and the
// account (with Redis, so the counts are exact without a query per message),
// and its recipients outside the domain toward this hour's, and return the
// new totals (and what to take back if the message is not sent), or `null`
// without Redis
//
async function addRecipients({
  user,
  client,
  recipients,
  external = 0,
  accountId,
  now
}) {
  if (!client) return null;
  const day = getSmtpDayKey(now);
  const counts = [
    [
      `${config.smtpLimitNamespace}:velocity_rcpt:${user._id}:${day}`,
      recipients
    ],
    [
      `${config.smtpLimitNamespace}:velocity_rcpt:account:${
        accountId || user._id
      }:${day}`,
      recipients
    ],
    [getRecipientsHourKey(user._id, now), external]
  ];
  // (together, so the keys never live without an expiry)
  const multi = client.multi();
  for (const [key, amount] of counts)
    multi.incrby(key, amount).pexpire(key, 2 * ONE_DAY);
  const results = await multi.exec();
  for (const [err] of results) if (err) throw err;
  return {
    counts,
    total: Number(results[0][1]),
    accountTotal: Number(results[2][1])
  };
}

//
// Take back a message's recipients counted with `addRecipients`
//
function removeRecipients(client, counted) {
  if (!client || !counted) return;
  const multi = client.multi();
  for (const [key, amount] of counted.counts) multi.decrby(key, amount);
  multi
    .exec()
    .then()
    .catch((err) => logger.fatal(err));
}

//
// Recipients an account's messages can reach in a day, together: a multiple
// of the account's threshold (as for one sender), and at least what one of
// its senders can reach alone
//
function getAccountRecipientsLimit(accountLimit, senderLimit) {
  return Math.max(
    senderLimit || 0,
    Number.isFinite(accountLimit) && accountLimit > 0
      ? Math.ceil(accountLimit * config.smtpVelocityRecipientsMultiplier)
      : Number.MAX_SAFE_INTEGER
  );
}

//
// Recipients across today's messages (without Redis)
//
async function countRecipientsToday({ user, Emails, now }) {
  const startOfDay = getSmtpDayStart(now);
  const [result] = await Emails.aggregate([
    {
      $match: {
        user: user._id,
        is_bounce: { $ne: true },
        created_at: { $gte: startOfDay }
      }
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: {
            $cond: [{ $isArray: '$envelope.to' }, { $size: '$envelope.to' }, 1]
          }
        }
      }
    }
  ]);
  return result ? result.count : 0;
}

//
// Atomically reserve one message of today's threshold for the user, the
// domain and the account, and of the user's unusual volume limit and this
// hour's burst limit (the database counts alone race when many messages are
// submitted at once).  Each reserved daily count starts from the database
// count and only grows, so it never allows more than the database would.
// Returns 0 when reserved, 1 when the user is at their threshold, 2 when the
// domain is, 3 when the account is, 4 when the user is at their unusual
// volume limit, and 5 when they are at this hour's burst limit.
//
const RESERVE_SCRIPT = `
local u = math.max(tonumber(redis.call('GET', KEYS[1]) or '0'), tonumber(ARGV[1]))
local d = math.max(tonumber(redis.call('GET', KEYS[2]) or '0'), tonumber(ARGV[3]))
local a = math.max(tonumber(redis.call('GET', KEYS[3]) or '0'), tonumber(ARGV[6]))
local h = tonumber(redis.call('GET', KEYS[4]) or '0')
if u >= tonumber(ARGV[2]) then return 1 end
if d >= tonumber(ARGV[4]) then return 2 end
if a >= tonumber(ARGV[7]) then return 3 end
if u >= tonumber(ARGV[8]) then return 4 end
if h >= tonumber(ARGV[9]) then return 5 end
redis.call('SET', KEYS[1], u + 1, 'PX', ARGV[5])
redis.call('SET', KEYS[2], d + 1, 'PX', ARGV[5])
redis.call('SET', KEYS[3], a + 1, 'PX', ARGV[5])
redis.call('SET', KEYS[4], h + 1, 'PX', ARGV[10])
return 0
`;

const RELEASE_SCRIPT = `
for i = 1, #KEYS do
  local v = tonumber(redis.call('GET', KEYS[i]) or '0')
  if v > 0 then redis.call('DECR', KEYS[i]) end
end
return 1
`;

//
// Reserve one message of an alias's own daily limit (see `reserveAliasMessage`)
//
const RESERVE_ALIAS_SCRIPT = `
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
local counted = tonumber(ARGV[1])
if counted > current then current = counted end
if current >= tonumber(ARGV[2]) then return 1 end
redis.call('SET', KEYS[1], current + 1, 'PX', ARGV[3])
return 0
`;

/**
 * Reserve one message of an alias's own daily limit (its `smtp_limit`)
 * atomically, so concurrent submissions cannot pass it (without Redis, only
 * the database count applies).
 *
 * @param {Object} options
 * @param {Object} [options.client] - Redis client
 * @param {Object} options.alias - Alias with `_id` and `smtp_limit`
 * @param {number} options.count - Messages counted for the alias today
 * @param {Date} [options.now] - When the count was read
 * @returns {Promise<Function>} Call if the message ends up not being queued
 * @throws {SMTPError} 421 when the limit was reached
 */
async function reserveAliasMessage({ client, alias, count, now = new Date() }) {
  const limit = alias.smtp_limit;
  const error = () =>
    new SMTPError('Rate limit exceeded', {
      responseCode: 421,
      ignoreHook: true
    });
  if (count >= limit) throw error();
  if (!client) return noop;
  const key = `${config.smtpLimitNamespace}:reserved:alias:${
    alias._id
  }:${getSmtpDayKey(now)}`;
  let result;
  try {
    result = Number(
      await client.eval(RESERVE_ALIAS_SCRIPT, 1, key, count, limit, 2 * ONE_DAY)
    );
  } catch (err) {
    // (without Redis the database count still applies)
    logger.fatal(err);
    return noop;
  }

  if (result !== 0) throw error();
  let isReleased = false;
  return function () {
    if (isReleased) return;
    isReleased = true;
    client
      .eval(RELEASE_SCRIPT, 1, key)
      .then()
      .catch((err) => logger.fatal(err));
  };
}

async function reserveMessage({
  client,
  user,
  domain,
  now,
  todayCount,
  dailyLimit,
  domainCount,
  domainLimit,
  accountId,
  accountCount,
  accountLimit,
  velocityLimit,
  hourlyLimit
}) {
  if (!client) return null;
  const day = getSmtpDayKey(now);
  const hour = now.toISOString().slice(0, 13);
  const keys = [
    `${config.smtpLimitNamespace}:reserved:user:${user._id}:${day}`,
    `${config.smtpLimitNamespace}:reserved:domain:${
      domain && domain._id ? domain._id : 'none'
    }:${day}`,
    `${config.smtpLimitNamespace}:reserved:account:${
      accountId || user._id
    }:${day}`,
    `${config.smtpLimitNamespace}:reserved:hour:${user._id}:${hour}`
  ];
  const result = await client.eval(
    RESERVE_SCRIPT,
    4,
    ...keys,
    todayCount,
    dailyLimit,
    Number.isFinite(domainCount) ? domainCount : 0,
    Number.isFinite(domainLimit) ? domainLimit : Number.MAX_SAFE_INTEGER,
    2 * ONE_DAY,
    Number.isFinite(accountCount) ? accountCount : 0,
    Number.isFinite(accountLimit) ? accountLimit : Number.MAX_SAFE_INTEGER,
    Number.isFinite(velocityLimit) ? velocityLimit : Number.MAX_SAFE_INTEGER,
    Number.isFinite(hourlyLimit) ? hourlyLimit : Number.MAX_SAFE_INTEGER,
    2 * ONE_HOUR
  );
  return { keys, result: Number(result) };
}

/**
 * Enforce today's threshold atomically and slow down a sender whose pattern
 * is unusual, regardless of threshold.
 *
 * With Redis, one message of the user's and the domain's daily threshold is
 * reserved atomically (so many messages submitted at once cannot all pass the
 * database counts), and the message is deferred (421) if none is left.
 *
 * A sender is also deferred (421) when:
 * - "spike": today's volume reached a multiple of their recent normal volume
 *   (a sender whose normal volume was not measured yet has the first tier)
 * - "recipients": their messages today reached too many recipients in total
 *   (a message can have many recipients)
 * - "burst": they sent more in the last hour than a share of today's allowance
 *   and more than a multiple of their own busiest hour (so senders with a
 *   regular blast pattern are not slowed down), or than a admin-approved
 *   minimum
 * - "bounces": too many of their recent messages bounced or were rejected
 * - "backlog": too many of their messages from the last day are still queued
 *   for delivery (scheduled messages, messages being retried after a
 *   recipient deferral, and messages awaiting approval are not counted)
 * - "scheduled": a message is scheduled for later while a day's allowance of
 *   messages is already scheduled (so a blast cannot be stockpiled over days)
 *
 * For every reason but the backlog (which can be our queue's doing), the user
 * is marked as slowed down (which keeps the day from counting as a clean
 * sending day) and admins are alerted (deduplicated via Redis).
 *
 * @param {Object} options
 * @param {Object} options.user - User with the SMTP velocity fields
 * @param {Object} [options.domain] - Domain sent from (members populated)
 * @param {number} options.dailyLimit - The sender's daily threshold
 * @param {number} options.todayCount - Messages the user sent today
 * @param {number} [options.domainLimit] - The domain's daily threshold
 * @param {number} [options.domainCount] - Messages sent from the domain today
 * @param {Object} [options.accountId] - Account whose threshold applies (see
 *   `helpers/get-smtp-sending-limits.js`)
 * @param {number} [options.accountLimit] - The account's daily threshold
 * @param {number} [options.accountCount] - Messages sent from the account's
 *   domains today
 * @param {number} [options.recipients] - Recipients of this message
 * @param {Array} [options.to] - Its recipient addresses (to count the ones
 *   outside the domain, see `getRecipientsHourKey`)
 * @param {Date} [options.date] - When the message is scheduled to be sent
 * @param {Object} options.Emails - Emails model
 * @param {Object} options.Users - Users model
 * @param {Object} [options.client] - Redis client (reservations, alerts and
 *   check caching)
 * @param {Date} [options.now] - When the counts were read
 * @returns {Promise<Function>} Call if the message ends up not being queued
 *   (so it and its recipients do not count toward today's totals)
 */
async function checkSmtpVelocity({
  user,
  domain,
  dailyLimit,
  todayCount,
  domainLimit,
  domainCount,
  accountId,
  accountLimit,
  accountCount,
  recipients = 1,
  to,
  date,
  Emails,
  Users,
  client,
  // (the same time the counts were read at, so a message checked across
  // midnight UTC does not carry one day's counts into the next day's keys)
  now = new Date()
}) {
  if (!user || !user._id) return noop;

  // admin restrictions are already stricter than any slowdown
  // (but their messages still reserve today's thresholds, and the recipients
  // limit still applies)
  if (isSmtpRestricted(user)) {
    const restrictedRecipientsLimit = Math.ceil(
      dailyLimit * config.smtpVelocityRecipientsMultiplier
    );
    const restrictedCount =
      Number.isFinite(recipients) && recipients > 0 ? recipients : 1;
    if (restrictedCount > restrictedRecipientsLimit)
      throw new SMTPError(
        `Too many recipients for your current daily sending threshold (at most ${restrictedRecipientsLimit} per day)`,
        { responseCode: 550, ignoreHook: true }
      );
    let reserved = null;
    try {
      reserved = await reserveMessage({
        client,
        user,
        domain,
        now,
        todayCount,
        dailyLimit,
        domainCount,
        domainLimit,
        accountId,
        accountCount,
        accountLimit
      });
    } catch (err) {
      logger.fatal(err);
    }

    if (!reserved) return noop;
    if (reserved.result !== 0)
      throw new SMTPError('Rate limit exceeded', {
        responseCode: 421,
        ignoreHook: true
      });
    let isReleased = false;
    let restrictedCounted = null;
    const releaseRestricted = function () {
      if (isReleased) return;
      isReleased = true;
      removeRecipients(client, restrictedCounted);
      client
        .eval(RELEASE_SCRIPT, reserved.keys.length, ...reserved.keys)
        .then()
        .catch((err) => logger.fatal(err));
    };

    try {
      restrictedCounted = await addRecipients({
        user,
        client,
        recipients: restrictedCount,
        external: countExternalRecipients(to, domain),
        accountId,
        now
      });
    } catch (err) {
      logger.fatal(err);
    }

    if (
      restrictedCounted &&
      (restrictedCounted.total > restrictedRecipientsLimit ||
        restrictedCounted.accountTotal >
          getAccountRecipientsLimit(accountLimit, restrictedRecipientsLimit))
    ) {
      releaseRestricted();
      throw new SMTPError('Rate limit exceeded', {
        responseCode: 421,
        ignoreHook: true
      });
    }

    return releaseRestricted;
  }

  // (never more than the sender's own daily threshold)
  const base = Math.min(getSmtpVelocityBase(user, domain, now), dailyLimit);
  const velocityLimit = getSmtpVelocityLimit(user, now, domain);
  const allowedToday = Math.min(dailyLimit, velocityLimit);
  const baselineHourly = isBaselineFresh(user, now)
    ? user[config.userFields.smtpBaselineHourly] || 0
    : 0;
  // (a minimum an admin approved can be sent at once, as before)
  const approved = Math.min(
    allowedToday,
    Math.max(
      getSmtpManualFloor(user),
      isSmtpOnHold(user, now) ? 0 : getDomainManualFloor(domain)
    )
  );
  // (a busy hour in the baseline never allows more than a share of the day's
  // allowance within an hour, so a reputation cannot be spent in one blast)
  const hourlyLimit = Math.max(
    base,
    approved,
    Math.ceil(allowedToday * config.smtpVelocityHourlyShare),
    Math.min(
      Math.ceil(allowedToday * config.smtpVelocityMaxHourlyShare),
      Math.ceil(baselineHourly * config.smtpVelocitySpikeMultiplier)
    )
  );
  const backlogLimit = Math.max(
    base,
    approved,
    Math.ceil(allowedToday * config.smtpVelocityBacklogShare)
  );
  const recipientsLimit = Math.ceil(
    Math.max(base, allowedToday) * config.smtpVelocityRecipientsMultiplier
  );
  const count = Number.isFinite(recipients) && recipients > 0 ? recipients : 1;

  // a single message with more recipients than a day allows never fits
  if (count > recipientsLimit)
    throw new SMTPError(
      `Too many recipients for your current daily sending threshold (at most ${recipientsLimit} per day)`,
      { responseCode: 550, ignoreHook: true }
    );

  let reason;
  let counted = null;
  let reserved = null;
  let isReleased = false;
  function release() {
    if (isReleased) return;
    isReleased = true;
    removeRecipients(client, counted);
    if (reserved)
      client
        .eval(RELEASE_SCRIPT, reserved.keys.length, ...reserved.keys)
        .then()
        .catch((err) => logger.fatal(err));
  }

  //
  // reserve one message of today's threshold (for the user, the domain and
  // the account)
  //
  try {
    reserved = await reserveMessage({
      client,
      user,
      domain,
      now,
      todayCount,
      dailyLimit,
      domainCount,
      domainLimit,
      accountId,
      accountCount,
      accountLimit,
      velocityLimit,
      hourlyLimit
    });
  } catch (err) {
    // (without Redis the database counts still apply)
    logger.fatal(err);
  }

  const details = {
    'Daily threshold': dailyLimit,
    'Recent normal (busiest day)':
      user[config.userFields.smtpBaselineDaily] || 0,
    'Sent today': todayCount
  };

  // (the unusual volume and burst limits, reserved atomically with Redis)
  if (reserved && reserved.result === 4) {
    reserved = null;
    reason = 'spike';
    details['Unusual volume limit'] = velocityLimit;
  } else if (reserved && reserved.result === 5) {
    reserved = null;
    reason = 'burst';
    details['Hourly limit'] = hourlyLimit;
  } else if (reserved && reserved.result !== 0) {
    reserved = null;
    throw new SMTPError('Rate limit exceeded', {
      responseCode: 421,
      ignoreHook: true
    });
  }

  // (if a check fails, this message and its recipients do not count)
  try {
    if (!reason && todayCount >= velocityLimit) {
      reason = 'spike';
      details['Unusual volume limit'] = velocityLimit;
    } else if (!reason) {
      //
      // recipients across today's messages
      //
      let recipientsToday;
      try {
        counted = await addRecipients({
          user,
          client,
          recipients: count,
          external: countExternalRecipients(to, domain),
          accountId,
          now
        });
      } catch (err) {
        logger.fatal(err);
      }

      if (counted) {
        recipientsToday = counted.total;
      } else {
        recipientsToday =
          (await countRecipientsToday({ user, Emails, now })) + count;
      }

      if (recipientsToday > recipientsLimit) {
        reason = 'recipients';
        details['Recipients today'] = recipientsToday;
        details['Recipients limit'] = recipientsLimit;
      } else if (
        counted &&
        counted.accountTotal >
          getAccountRecipientsLimit(accountLimit, recipientsLimit)
      ) {
        // (the account's members together, see `getAccountRecipientsLimit`)
        reason = 'recipients';
        details['Account recipients today'] = counted.accountTotal;
      }
    }

    //
    // a message scheduled for later (so a blast cannot be stockpiled)
    //
    if (
      !reason &&
      date &&
      new Date(date).getTime() > now.getTime() + ONE_HOUR
    ) {
      const scheduled = await Emails.countDocuments(
        {
          user: user._id,
          status: { $in: ['pending', 'queued', 'deferred'] },
          // (bounded, so the query uses the user/status/created_at index)
          created_at: {
            $gte: new Date(
              now.getTime() - config.smtpReputationBackfillDays * ONE_DAY
            )
          },
          date: { $gt: now }
        },
        { limit: allowedToday }
      );
      if (scheduled >= allowedToday) {
        reason = 'scheduled';
        details['Scheduled for later'] = scheduled;
        details['Scheduled limit'] = allowedToday;
      }
    }

    if (!reason) {
      //
      // reuse a recent passing check (these counts run for every message)
      // (per domain, since the limits depend on it)
      //
      const cacheKey = `${config.smtpLimitNamespace}:velocity_ok:${user._id}:${
        domain && domain._id ? domain._id : 'none'
      }`;
      let isCached = false;
      if (client) {
        try {
          isCached = Boolean(await client.get(cacheKey));
        } catch (err) {
          logger.fatal(err);
        }
      }

      if (isCached) return release;

      const [lastHour, backlog, [outcomes]] = await Promise.all([
        Emails.countDocuments(
          {
            user: user._id,
            is_bounce: { $ne: true },
            created_at: { $gte: new Date(now.getTime() - ONE_HOUR) }
          },
          { limit: hourlyLimit }
        ),
        Emails.countDocuments(
          {
            user: user._id,
            status: 'queued',
            created_at: { $gte: new Date(now.getTime() - ONE_DAY) },
            date: { $lte: now }
          },
          { limit: backlogLimit }
        ),
        Emails.aggregate([
          {
            $match: {
              user: user._id,
              created_at: {
                $gte: new Date(now.getTime() - config.smtpVelocityBounceWindow)
              },
              status: { $in: FINAL_STATUSES },
              is_bounce: { $ne: true }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              // (only rejections that are the sender's doing, not e.g. our
              // shared IP addresses on a blocklist)
              bad: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $in: ['$status', BAD_STATUSES] },
                        {
                          $gt: [
                            {
                              $size: {
                                $filter: {
                                  input: { $ifNull: ['$rejectedErrors', []] },
                                  as: 'e',
                                  cond: senderRejectionExpression('$$e')
                                }
                              }
                            },
                            0
                          ]
                        }
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ])
      ]);

      const recentTotal = outcomes ? outcomes.total : 0;
      const recentBad = outcomes ? outcomes.bad : 0;
      const recentBadRate = recentTotal > 0 ? recentBad / recentTotal : 0;

      if (lastHour >= hourlyLimit) {
        reason = 'burst';
        details['Sent in the last hour'] = lastHour;
        details['Hourly limit'] = hourlyLimit;
      } else if (
        recentTotal >= config.smtpVelocityBounceMinSample &&
        recentBadRate >= config.smtpVelocityMaxBounceRate
      ) {
        reason = 'bounces';
        details['Recent messages'] = recentTotal;
        details['Bounced or rejected (last 6 hours)'] = recentBad;
      } else if (backlog >= backlogLimit) {
        reason = 'backlog';
        details['Waiting in queue'] = backlog;
        details['Queue limit'] = backlogLimit;
      } else if (
        client &&
        lastHour < hourlyLimit / 2 &&
        backlog < backlogLimit / 2 &&
        recentBadRate < config.smtpVelocityMaxBounceRate / 2
      ) {
        // (only cached while well below the limits, so limits stay exact)
        client
          .set(cacheKey, '1', 'PX', CHECK_CACHE_TTL)
          .then()
          .catch((err) => logger.fatal(err));
      }
    }
  } catch (err) {
    release();
    throw err;
  }

  if (!reason) return release;

  // this message is not sent, so it and its recipients do not count
  release();

  // (a backlog can be our queue's doing, and a message dated later can be a
  // client's clock, so neither is held against the sender)
  if (reason !== 'backlog' && reason !== 'scheduled') {
    await markThrottled({ user, Users, now });
    sendAlert({ user, client, reason, details });
  }

  throw new SMTPError(
    'Unusual sending activity detected, please slow down and try again later',
    { responseCode: 421, ignoreHook: true }
  );
}

module.exports = checkSmtpVelocity;
module.exports.getSmtpVelocityLimit = getSmtpVelocityLimit;
module.exports.getRecipientsHourKey = getRecipientsHourKey;
module.exports.countExternalRecipients = countExternalRecipients;
module.exports.reserveAliasMessage = reserveAliasMessage;
module.exports.getSmtpVelocityBase = getSmtpVelocityBase;
module.exports.getDomainManualFloor = getDomainManualFloor;
module.exports.isBaselineFresh = isBaselineFresh;
module.exports.SMTP_VELOCITY_USER_FIELDS = SMTP_VELOCITY_USER_FIELDS;
