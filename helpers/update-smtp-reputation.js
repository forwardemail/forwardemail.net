/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');

const Domains = require('#models/domains');
const Emails = require('#models/emails');
const Users = require('#models/users');
const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');
const getPaidSince = require('#helpers/get-paid-since');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const logger = require('#helpers/logger');
const {
  DELIVERED_STATUSES,
  aggregateDailyCounts
} = require('#helpers/get-smtp-sending-limits');
const parseRootDomain = require('#helpers/parse-root-domain');
const recordSmtpReputationReport = require('#helpers/record-smtp-reputation-report');
const {
  isConsumerDomain,
  normalizeRecipientExpression,
  senderRejectionExpression
} = require('#helpers/smtp-reputation-recipients');

const {
  getEffectiveTierIndex,
  getSmtpManualFloor,
  getTierIndex,
  isSmtpRestricted
} = getUserSmtpLimit;
const { getPaidDays } = getPaidSince;
const {
  countReportKeys,
  countReportedRecipients,
  countResetReports,
  getBorrowedReports,
  getReportThresholds
} = recordSmtpReputationReport;

const ONE_DAY = 24 * 60 * 60 * 1000;

const PAID_PLANS = ['enhanced_protection', 'team'];

//
// only messages with a final delivery outcome are used for the bounce rate
// (messages still queued or deferred have no outcome yet)
//
const FINAL_STATUSES = ['sent', 'partially_sent', 'bounced', 'rejected'];
// (and recipients already rejected on messages still being retried)
const OUTCOME_STATUSES = [...FINAL_STATUSES, 'deferred'];

//
// When a message was due to be sent (its scheduled date, if later)
//
const DUE = {
  $max: ['$created_at', { $ifNull: ['$date', '$created_at'] }]
};

// timezone used for day boundaries (thresholds reset at midnight UTC, see
// `helpers/get-smtp-day.js`)
const TIMEZONE = 'UTC';

//
// Fields the job reads from each user
//
const USER_FIELDS = [
  '_id',
  'email',
  'plan',
  config.userFields.planExpiresAt,
  config.userFields.smtpLimit,
  config.userFields.smtpThrottledAt,
  config.userFields.smtpThrottledDays,
  config.userFields.smtpReputationTier,
  config.userFields.smtpReputationCleanDays,
  config.userFields.smtpReputationEvaluatedAt,
  config.userFields.smtpReputationCeilingAlertedAt,
  config.userFields.smtpReputationHoldUntil,
  config.userFields.smtpReputationHoldReason,
  config.userFields.smtpReputationReports,
  config.userFields.smtpReputationReviewedAt,
  config.userFields.smtpBaselineDaily,
  config.userFields.smtpBaselineHourly,
  config.userFields.smtpBaselineAt
].join(' ');

// day key (matches `$dateToString` with `TIMEZONE`)
function dayKey(date) {
  return dayjs.utc(date).format('YYYY-MM-DD');
}

function notEvaluatedSince(start) {
  return {
    $or: [
      { [config.userFields.smtpReputationEvaluatedAt]: { $exists: false } },
      { [config.userFields.smtpReputationEvaluatedAt]: null },
      { [config.userFields.smtpReputationEvaluatedAt]: { $lt: start } }
    ]
  };
}

//
// Every suffix of the domain of `address` (e.g. "a.b.example.com" gives
// "a.b.example.com", "b.example.com", "example.com" and "com")
//
function domainSuffixes(address) {
  return {
    $let: {
      vars: {
        parts: {
          $split: [{ $arrayElemAt: [{ $split: [address, '@'] }, -1] }, '.']
        }
      },
      in: {
        $map: {
          input: { $range: [0, { $size: '$$parts' }] },
          as: 'start',
          in: {
            $reduce: {
              input: {
                $slice: ['$$parts', '$$start', { $size: '$$parts' }]
              },
              initialValue: '',
              in: {
                $cond: [
                  { $eq: ['$$value', ''] },
                  '$$this',
                  { $concat: ['$$value', '.', '$$this'] }
                ]
              }
            }
          }
        }
      }
    }
  };
}

//
// Whether `variable` (an address) is a recipient outside the sender's own
// domains (including their subdomains) and address
// (`$literal` so values are never read as field paths or variables)
//
function isExternal(variable, own) {
  const address = { $toLower: variable };
  return {
    $and: [
      { $eq: [{ $type: variable }, 'string'] },
      { $not: [{ $in: [address, { $literal: own.addresses }] }] },
      {
        $eq: [
          {
            $size: {
              $setIntersection: [
                domainSuffixes(address),
                { $literal: own.roots }
              ]
            }
          },
          0
        ]
      }
    ]
  };
}

//
// The sender's own domains and addresses (mail to these does not count
// toward reputation, so sending to yourself earns nothing): every domain the
// user is a member of and every domain they sent from in the range, by root
// domain (so subdomains count as their own too)
// (the verified domains messages were sent from, not their return
// addresses, which can be any address, e.g. on gmail.com)
//
async function getOwnRecipients(user, range) {
  const sentFrom = await Emails.distinct('domain', {
    user: user._id,
    created_at: range
  });
  const domains = await Domains.find({
    // (a domain can be added to an account without verifying it, so only
    // verified ones count, e.g. not gmail.com added to hide bounces from Gmail)
    $or: [
      {
        'members.user': user._id,
        $or: [{ has_txt_record: true }, { has_smtp: true }]
      },
      { _id: { $in: sentFrom } }
    ]
  })
    .select('name')
    .lean()
    .exec();
  const roots = new Set();
  for (const name of domains.map((d) => d.name)) {
    if (typeof name === 'string' && name) roots.add(parseRootDomain(name));
  }

  return {
    addresses: typeof user.email === 'string' ? [user.email.toLowerCase()] : [],
    roots: [...roots]
  };
}

//
// Load everything needed to evaluate a user's days in [from, lastEnd) with a
// few queries (instead of per day):
// - `hours`: messages per local hour back to the start of the baseline window
//   (every message the sender sent, the same way the daily threshold is
//   enforced; not bounce notifications or auto-replies we generate)
// - `outcomes`: unique recipients outside the sender's own domains and how
//   many of them were rejected for the sender's own doing, per day each
//   message was due to be sent (so mail to yourself, extra recipients on a
//   message, or repeating mail to one address cannot dilute a bounce rate,
//   and scheduling mail for later cannot hide it)
// - `recipients`: unique delivered recipients outside the sender's own
//   domains (variants of one mailbox count once), per local day and recipient
//   root domain, and how many of them were delivered to truth source mail
//   servers
//
async function loadHistory(user, from, lastEnd) {
  const userId = user._id;
  const baselineFrom = dayjs
    .utc(from)
    .subtract(config.smtpVelocityBaselineDays, 'day')
    .toDate();
  // (outcomes from the day before too, see `getReportThresholds` below)
  const outcomesFrom = dayjs.utc(from).subtract(1, 'day').toDate();
  const range = { $gte: outcomesFrom, $lt: lastEnd };
  // (qualifying recipients are needed for the whole utilization lookback)
  const recipientsRange = {
    $gte: dayjs
      .utc(from)
      .subtract(config.smtpReputationLookbackDays - 1, 'day')
      .toDate(),
    $lt: lastEnd
  };
  // (a message can be scheduled for up to the days messages are kept)
  const scheduledFrom = dayjs
    .utc(from)
    .subtract(config.smtpReputationBackfillDays, 'day')
    .toDate();

  // (most paying users do not send, so skip the aggregations for them)
  const hasMail = await Emails.exists({
    user: userId,
    created_at: { $gte: baselineFrom, $lt: lastEnd }
  });
  if (!hasMail)
    return {
      days: new Map(),
      hourly: new Map(),
      outcomes: new Map(),
      recipients: new Map()
    };

  const own = await getOwnRecipients(user, recipientsRange);
  const day = {
    $dateToString: {
      format: '%Y-%m-%d',
      date: '$created_at',
      timezone: TIMEZONE
    }
  };

  const [hours, outcomes, recipients] = await Promise.all([
    Emails.aggregate([
      {
        $match: {
          user: userId,
          created_at: { $gte: baselineFrom, $lt: lastEnd },
          is_bounce: { $ne: true }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%dT%H',
              date: '$created_at',
              timezone: TIMEZONE
            }
          },
          count: { $sum: 1 }
        }
      }
    ]).allowDiskUse(true),
    Emails.aggregate([
      {
        $match: {
          user: userId,
          status: { $in: OUTCOME_STATUSES },
          is_bounce: { $ne: true },
          // (a message is counted on the day it was due to be sent, and can
          // be scheduled days ahead; each branch uses an index)
          $or: [
            { created_at: range },
            {
              date: range,
              created_at: { $gte: scheduledFrom, $lt: outcomesFrom }
            }
          ]
        }
      },
      { $addFields: { due: DUE } },
      { $match: { due: range } },
      {
        $project: {
          day: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$due',
              timezone: TIMEZONE
            }
          },
          // (recipients it was delivered to; a recipient that failed for a
          // reason that is not the sender's doing counts neither way)
          delivered: {
            $setUnion: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: { $ifNull: ['$accepted', []] },
                      as: 'r',
                      cond: isExternal('$$r', own)
                    }
                  },
                  as: 'r',
                  in: { $toLower: '$$r' }
                }
              }
            ]
          },
          rejected: {
            $setUnion: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: { $ifNull: ['$rejectedErrors', []] },
                      as: 'e',
                      cond: {
                        $and: [
                          { $eq: [{ $type: '$$e.recipient' }, 'string'] },
                          senderRejectionExpression('$$e'),
                          isExternal('$$e.recipient', own)
                        ]
                      }
                    }
                  },
                  as: 'e',
                  in: { $toLower: '$$e.recipient' }
                }
              }
            ]
          }
        }
      },
      {
        $project: {
          day: 1,
          rejected: 1,
          // (a message still being retried counts the recipients it was
          // already delivered to or rejected by, not those still pending)
          counted: { $setUnion: ['$delivered', '$rejected'] }
        }
      },
      { $unwind: '$counted' },
      {
        $project: {
          day: 1,
          recipient: normalizeRecipientExpression('$counted'),
          bad: { $cond: [{ $in: ['$counted', '$rejected'] }, 1, 0] }
        }
      },
      // unique recipients per day (a recipient counts as bad if any message
      // to them was rejected)
      {
        $group: {
          _id: { day: '$day', recipient: '$recipient' },
          bad: { $max: '$bad' }
        }
      },
      {
        $group: {
          _id: { day: '$_id.day' },
          total: { $sum: 1 },
          bad: { $sum: '$bad' }
        }
      }
    ]).allowDiskUse(true),
    Emails.aggregate([
      {
        $match: {
          user: userId,
          created_at: recipientsRange,
          status: { $in: ['sent', 'partially_sent'] },
          is_bounce: { $ne: true }
        }
      },
      {
        $project: {
          day,
          delivered: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ['$deliveries', []] } }, 0] },
              {
                $map: {
                  input: '$deliveries',
                  as: 'd',
                  in: { r: '$$d.recipient', ts: '$$d.truthSource' }
                }
              },
              {
                $map: {
                  input: { $ifNull: ['$accepted', []] },
                  as: 'a',
                  in: { r: '$$a', ts: null }
                }
              }
            ]
          }
        }
      },
      { $unwind: '$delivered' },
      { $match: { $expr: isExternal('$delivered.r', own) } },
      {
        $project: {
          day: 1,
          recipient: normalizeRecipientExpression({
            $toLower: '$delivered.r'
          }),
          // (deliveries to other servers store `false` as a string)
          trusted: {
            $cond: [
              {
                $in: ['$delivered.ts', { $literal: [...config.truthSources] }]
              },
              1,
              0
            ]
          }
        }
      },
      // unique recipients per day
      {
        $group: {
          _id: { day: '$day', recipient: '$recipient' },
          trusted: { $max: '$trusted' }
        }
      },
      // (counted per recipient domain here, so only domains reach the job)
      {
        $group: {
          _id: {
            day: '$_id.day',
            domain: { $arrayElemAt: [{ $split: ['$_id.recipient', '@'] }, -1] }
          },
          count: { $sum: 1 },
          trusted: { $sum: '$trusted' }
        }
      }
    ]).allowDiskUse(true)
  ]);

  const days = new Map();
  const hourly = new Map();
  for (const { _id, count } of hours) {
    hourly.set(_id, count);
    const key = _id.slice(0, 10);
    days.set(key, (days.get(key) || 0) + count);
  }

  const outcomesByDay = new Map();
  for (const { _id, total, bad } of outcomes) {
    const counts = outcomesByDay.get(_id.day) || { total: 0, bad: 0 };
    counts.total += total;
    counts.bad += bad;
    outcomesByDay.set(_id.day, counts);
  }

  // day => root domain => { count, trusted }
  const recipientsByDay = new Map();
  for (const { _id, count, trusted } of recipients) {
    const root = parseRootDomain(_id.domain);
    if (!recipientsByDay.has(_id.day)) recipientsByDay.set(_id.day, new Map());
    const byDomain = recipientsByDay.get(_id.day);
    const counts = byDomain.get(root) || { count: 0, trusted: 0 };
    counts.count += count;
    counts.trusted += trusted;
    byDomain.set(root, counts);
  }

  return {
    days,
    hourly,
    outcomes: outcomesByDay,
    recipients: recipientsByDay
  };
}

//
// Qualifying recipients and distinct recipient domains on a day: each
// recipient domain other than a mailbox provider's consumer domains (e.g. a
// catch-all on a domain, or a company tenant) counts for at most a few
// recipients, and with truth sources configured, at most the share of them
// delivered to truth source mail servers allows
//
function getQualified(history, key) {
  const byDomain = history.recipients.get(key) || new Map();
  const cap = config.smtpReputationMaxRecipientsPerDomain;
  let recipients = 0;
  let trusted = 0;
  for (const [root, counts] of byDomain) {
    const isConsumer = isConsumerDomain(root);
    recipients += isConsumer ? counts.count : Math.min(counts.count, cap);
    trusted += isConsumer ? counts.trusted : Math.min(counts.trusted, cap);
  }

  const share = config.smtpReputationMinTruthSourceShare;
  if (config.truthSources.size > 0 && share > 0)
    recipients = Math.min(recipients, Math.floor(trusted / share));

  return { recipients, domains: byDomain.size };
}

//
// Busiest day in [end - days, end) in qualifying recipients, only counting
// days that reached `minDomains` distinct recipient domains
//
function getQualifiedPeak(history, end, { windowDays, minDomains = 0 }) {
  const from = dayjs.utc(end).subtract(windowDays, 'day');
  let peak = 0;
  let domains = 0;
  for (const key of history.recipients.keys()) {
    const date = dayjs.utc(key);
    if (date.isBefore(from) || !date.isBefore(end)) continue;
    const qualified = getQualified(history, key);
    if (qualified.domains < minDomains) continue;
    if (qualified.recipients > peak) {
      peak = qualified.recipients;
      domains = qualified.domains;
    }
  }

  return { peak, domains };
}

//
// Most distinct recipient domains on a day in [end - days, end)
//
function getMaxRecipientDomains(history, end, windowDays) {
  const from = dayjs.utc(end).subtract(windowDays, 'day');
  let max = 0;
  for (const [key, byDomain] of history.recipients) {
    const date = dayjs.utc(key);
    if (date.isBefore(from) || !date.isBefore(end)) continue;
    if (byDomain.size > max) max = byDomain.size;
  }

  return max;
}

//
// Busiest day in [end - days, end) from the per-day totals
//
function getPeak(days, end, windowDays) {
  const from = dayjs.utc(end).subtract(windowDays, 'day');
  let peak = 0;
  let peakAt = null;
  for (const [day, count] of days) {
    // `day` is the local day (parsed as local midnight)
    const date = dayjs.utc(day);
    if (date.isBefore(from) || !date.isBefore(end)) continue;
    if (count > peak || (count === peak && peakAt && date.isAfter(peakAt))) {
      peak = count;
      peakAt = date;
    }
  }

  return { peak, peakAt: peakAt ? peakAt.toDate() : null };
}

//
// Recent normal volume as of `end` (busiest day and hour in the baseline
// window).  Messages are only kept for a limited time, so a stored baseline
// that is still inside the window is carried forward when it is higher.
//
function getBaseline(user, history, end) {
  const windowStart = dayjs
    .utc(end)
    .subtract(config.smtpVelocityBaselineDays, 'day');
  const { peak, peakAt } = getPeak(
    history.days,
    end,
    config.smtpVelocityBaselineDays
  );

  let hourlyPeak = 0;
  for (const [hour, count] of history.hourly) {
    const date = dayjs.utc(hour.slice(0, 10));
    if (date.isBefore(windowStart) || !date.isBefore(end)) continue;
    if (count > hourlyPeak) hourlyPeak = count;
  }

  let baselineDaily = peak;
  let baselineAt = peakAt || dayjs.utc(end).subtract(1, 'day').toDate();
  let baselineHourly = hourlyPeak;

  const storedAt = user[config.userFields.smtpBaselineAt];
  if (storedAt && !dayjs.utc(storedAt).isBefore(windowStart)) {
    const storedDaily = user[config.userFields.smtpBaselineDaily] || 0;
    if (storedDaily > baselineDaily) {
      baselineDaily = storedDaily;
      baselineAt = new Date(storedAt);
    }

    baselineHourly = Math.max(
      baselineHourly,
      user[config.userFields.smtpBaselineHourly] || 0
    );
  }

  return { baselineDaily, baselineHourly, baselineAt };
}

//
// Whether reports about members who borrowed a user's threshold make a bad
// day for the user, as a rate of the members' sending (see
// `getBorrowedReports`)
//
function isBorrowedBadDay(borrowed) {
  const { badDay } = getReportThresholds(borrowed.recipients);
  return countReportKeys(borrowed.keys, badDay) >= badDay;
}

//
// Days the user was slowed down for an unusual sending pattern
//
function getThrottledDays(user) {
  const set = new Set();
  for (const date of user[config.userFields.smtpThrottledDays] || []) {
    if (date) set.add(dayKey(date));
  }

  if (user[config.userFields.smtpThrottledAt])
    set.add(dayKey(user[config.userFields.smtpThrottledAt]));
  return set;
}

async function sendCeilingAlert(user, limit, peak) {
  await emailHelper({
    template: 'alert',
    message: {
      to: config.alertsEmail,
      subject: `SMTP reputation ceiling reached: ${user.email}`
    },
    locals: {
      message: `<p><strong>${_.escape(
        user.email
      )}</strong> reached the highest automatic outbound SMTP reputation tier (${limit.toLocaleString(
        'en'
      )} messages per day) and is still growing (busiest recent day: ${peak.toLocaleString(
        'en'
      )} delivered recipients outside their own domains).</p><p>Review this sender and raise their <code>smtp_limit</code> in the admin dashboard if they should be allowed to send more.</p>`
    }
  });
}

/**
 * Evaluate a range of completed days of sending for a user, in order, and
 * move their reputation tier up or down.
 *
 * Only mail delivered to unique recipients outside the sender's own domains
 * ("qualifying recipients") counts toward moving up, and each recipient
 * domain only counts up to a cap per day, so sending to yourself, test
 * blasts, or a catch-all on a throwaway domain earn nothing.
 *
 * - A day with spam/virus verdicts from truth sources about their own sending
 *   at the reset rate of the day's recipients (for different recipients, at
 *   least a few, one on a consumer domain), or a severe bounce/reject rate,
 *   resets the user to the first tier and pauses moving up for
 *   `config.smtpReputationHoldDays`.
 * - A bad day (truth source verdicts at the bad day rate of the day's
 *   recipients, or about members who borrowed their threshold at that rate of
 *   the members' recipients, or a bounce/reject rate at or above the
 *   threshold with enough external volume) steps the user down one tier.
 *   Automatic SMTP suspensions of aliases do not count on their own (they
 *   are absolute counts; the verdicts behind them do count).  Only rejections
 *   that are the sender's doing count (not e.g. our shared IP addresses on a
 *   blocklist), once per unique recipient (so repeating mail to one address
 *   cannot dilute a bounce rate), on the day each message was due to be sent.
 * - A clean day (enough qualifying recipients, low bounce/reject rate, no
 *   slowdown for an unusual sending pattern) adds to the clean-day streak.
 * - The user moves up one tier once they have been paying without a break long
 *   enough, their clean streak is long enough, moving up is not paused, and
 *   their busiest recent day used enough of their current threshold in
 *   qualifying recipients across enough distinct recipient domains.
 * - A manual floor an admin approved (or the Team plan's starting threshold)
 *   places the user on the tier it covers, and they move up from there by
 *   meeting the next tier's requirements (which is what is stored), so
 *   removing the floor takes the user back to what they earned.
 * - The last tier is a soft ceiling: instead of moving up, admins are
 *   alerted to review the sender (unless an admin already approved more).
 * - Users an admin has restricted below the first tier do not move up.
 * - The user's paid tenure and recent normal volume (baseline, used by
 *   `helpers/check-smtp-velocity.js`) are updated.
 *
 * All days are written at once, and only if nothing else evaluated or changed
 * the user's reputation in the meantime (e.g. another run, an admin, or a
 * reset while sending).
 *
 * @param {Object} user - Lean user document (with `USER_FIELDS`)
 * @param {Date} fromDay - Any time within the first day to evaluate
 * @param {Date} lastDay - Any time within the last day to evaluate
 * @returns {Promise<Object>} `{ skipped }` or `{ results, tier, cleanDays, total, bad }`
 */
async function evaluateRange(user, fromDay, lastDay) {
  const from = dayjs.utc(fromDay).startOf('day');
  const lastStart = dayjs.utc(lastDay).startOf('day');
  const lastEnd = lastStart.add(1, 'day');
  if (from.isAfter(lastStart)) return { skipped: true };

  const evaluatedAt = user[config.userFields.smtpReputationEvaluatedAt];
  if (evaluatedAt && !dayjs.utc(evaluatedAt).isBefore(from))
    return { skipped: true };

  const tiers = config.smtpReputationTiers;
  const originalTier = user[config.userFields.smtpReputationTier];
  const originalCleanDays = user[config.userFields.smtpReputationCleanDays];
  const originalHoldUntil = user[config.userFields.smtpReputationHoldUntil];
  let holdReason = user[config.userFields.smtpReputationHoldReason] || null;
  let earned = getTierIndex(originalTier);
  let cleanDays = originalCleanDays || 0;
  let holdUntil = originalHoldUntil ? new Date(originalHoldUntil) : null;

  // tier covered by a manual floor (if any)
  const floorTier = getEffectiveTierIndex({
    ...user,
    [config.userFields.smtpReputationTier]: 0
  });
  const floor = getSmtpManualFloor(user);
  const isRestricted = isSmtpRestricted(user);
  const reports = user[config.userFields.smtpReputationReports] || [];

  const [history, paidSince] = await Promise.all([
    loadHistory(user, from.toDate(), lastEnd.toDate()),
    getPaidSince(user, lastEnd.toDate())
  ]);
  const throttledDays = getThrottledDays(user);

  const limitFor = (tier) =>
    getUserSmtpLimit({
      ...user,
      [config.userFields.smtpReputationTier]: tier
    });

  const results = [];
  let ceiling = null;
  let last = { total: 0, bad: 0 };

  for (let day = from; !day.isAfter(lastStart); day = day.add(1, 'day')) {
    const key = dayKey(day);
    const end = day.add(1, 'day').toDate();
    const { total, bad } = history.outcomes.get(key) || { total: 0, bad: 0 };
    last = { total, bad };
    const badRate = total > 0 ? bad / total : 0;
    const isBadRate = badRate >= config.smtpReputationMaxBadRate;
    // (as a rate of the day's recipients outside the sender's own domains,
    // or the day before's, since reports can come in a day after the mail,
    // e.g. after a recipient's server deferred it)
    const previous = history.outcomes.get(dayKey(day.subtract(1, 'day')));
    const thresholds = getReportThresholds(
      Math.max(total, previous ? previous.total : 0)
    );
    const verdicts = countReportedRecipients(
      reports,
      day.toDate(),
      end,
      user[config.userFields.smtpReputationReviewedAt],
      thresholds.badDay
    );
    // (only reports about the user's own sending reset them, with at most
    // half about company tenants, see `countResetReports`)
    const resetVerdicts = countResetReports(
      reports,
      day.toDate(),
      end,
      user[config.userFields.smtpReputationReviewedAt],
      thresholds.reset
    );
    // (reports about members who borrowed the user's threshold, as a rate of
    // the members' sending)
    const borrowed = getBorrowedReports(
      reports,
      day.toDate(),
      end,
      user[config.userFields.smtpReputationReviewedAt]
    );
    // (a day where far more than the bad rate bounced or was rejected is as
    // severe as spam reports, so a reputation cannot be spent on one blast)
    // (compared in whole recipients, so e.g. a rate of 15% is not missed to
    // floating point rounding)
    // (and bounces do not count for a day that started before an admin
    // reviewed the sender, e.g. a day that was not evaluated yet when they set
    // the sender's tier)
    const reviewedAt = user[config.userFields.smtpReputationReviewedAt];
    const isReviewed = Boolean(
      reviewedAt && new Date(reviewedAt).getTime() > day.valueOf()
    );
    const isSevereBadRate =
      !isReviewed &&
      total >= config.smtpReputationMinSample &&
      bad * 1000 >=
        Math.round(
          total *
            config.smtpReputationMaxBadRate *
            config.smtpReputationSevereBadRateMultiplier *
            1000
        );
    const isSevere = resetVerdicts >= thresholds.reset || isSevereBadRate;
    const isBadDay =
      isSevere ||
      verdicts >= thresholds.badDay ||
      isBorrowedBadDay(borrowed) ||
      (!isReviewed && total >= config.smtpReputationMinSample && isBadRate);

    let result = 'unchanged';

    if (isSevere) {
      if (earned > 0) result = 'reset';
      earned = 0;
      cleanDays = 0;
      const hold = new Date(
        end.getTime() + config.smtpReputationHoldDays * ONE_DAY
      );
      // (why: reports, after which a minimum an admin approved does not
      // apply, or only a severe bounce rate, after which it still does)
      const reason = resetVerdicts >= thresholds.reset ? 'reports' : 'bounces';
      const isHeld = holdUntil && holdUntil.getTime() > end.getTime();
      if (!isHeld || reason === 'reports') holdReason = reason;
      if (!holdUntil || hold > holdUntil) holdUntil = hold;
    } else if (isBadDay) {
      if (earned > 0) {
        earned--;
        result = 'demoted';
      }

      cleanDays = 0;
    } else {
      const currentLimit = limitFor(earned);
      const qualified = getQualified(history, key);
      if (
        qualified.recipients >= config.smtpReputationMinCleanDayRecipients &&
        !isBadRate &&
        !throttledDays.has(key)
      ) {
        cleanDays++;

        const effective = Math.max(earned, floorTier);
        const next = tiers[effective + 1];
        const requirement = next || tiers[effective];
        const isOnHold = Boolean(
          holdUntil && holdUntil.getTime() > end.getTime()
        );
        const qualifies =
          !isRestricted &&
          !isOnHold &&
          getPaidDays(paidSince, end) >= requirement.minPaidDays &&
          cleanDays >= requirement.minCleanDays;

        if (qualifies) {
          const { peak } = getQualifiedPeak(history, end, {
            windowDays: config.smtpReputationLookbackDays,
            minDomains: requirement.minRecipientDomains || 0
          });
          const isUsingThreshold =
            peak >= currentLimit * config.smtpReputationMinUtilization;

          if (isUsingThreshold && next) {
            earned = effective + 1;
            cleanDays = 0;
            result = 'promoted';
          } else if (isUsingThreshold && floor < tiers.at(-1).limit) {
            // soft ceiling (unless an admin already approved at or above it)
            ceiling = { limit: currentLimit, peak };
          }
        }
      }
    }

    results.push(result);
  }

  const baseline = getBaseline(user, history, lastEnd);
  // (shown to the user: the busiest recent day, and the most distinct
  // recipient domains on a recent day, which need not be the same day)
  const recent = getQualifiedPeak(history, lastEnd, {
    windowDays: config.smtpReputationLookbackDays
  });
  const recentDomains = getMaxRecipientDomains(
    history,
    lastEnd,
    config.smtpReputationLookbackDays
  );
  // (and the busiest recent day with the recipient domains the next tier
  // requires, since moving up needs both on the same day)
  const nextTier = tiers[Math.max(earned, floorTier) + 1];
  const nextPeak = nextTier
    ? getQualifiedPeak(history, lastEnd, {
        windowDays: config.smtpReputationLookbackDays,
        minDomains: nextTier.minRecipientDomains || 0
      }).peak
    : recent.peak;

  //
  // only apply if the user was not evaluated or changed (e.g. by an admin or
  // a reset while sending) since we read them (prevents double counting and
  // lost changes)
  // (`null` matches both a missing field and a null value)
  //
  const { matchedCount } = await Users.updateOne(
    {
      _id: user._id,
      [config.userFields.smtpReputationTier]:
        typeof originalTier === 'number' ? originalTier : null,
      [config.userFields.smtpReputationCleanDays]:
        typeof originalCleanDays === 'number' ? originalCleanDays : null,
      [config.userFields.smtpReputationHoldUntil]: originalHoldUntil
        ? new Date(originalHoldUntil)
        : null,
      // (as does an admin review)
      [config.userFields.smtpReputationReviewedAt]: user[
        config.userFields.smtpReputationReviewedAt
      ]
        ? new Date(user[config.userFields.smtpReputationReviewedAt])
        : null,
      // (an admin changing the manual limit meanwhile also invalidates this)
      [config.userFields.smtpLimit]:
        typeof user[config.userFields.smtpLimit] === 'number'
          ? user[config.userFields.smtpLimit]
          : null,
      ...notEvaluatedSince(from.toDate())
    },
    {
      $set: {
        [config.userFields.smtpReputationEvaluatedAt]: lastStart.toDate(),
        [config.userFields.smtpReputationTier]: earned,
        [config.userFields.smtpReputationCleanDays]: cleanDays,
        [config.userFields.smtpReputationHoldUntil]: holdUntil,
        [config.userFields.smtpReputationHoldReason]: holdUntil
          ? holdReason || 'reports'
          : null,
        [config.userFields.smtpReputationPaidSince]: paidSince,
        [config.userFields.smtpBaselineDaily]: baseline.baselineDaily,
        [config.userFields.smtpBaselineHourly]: baseline.baselineHourly,
        [config.userFields.smtpBaselineAt]: baseline.baselineAt,
        [config.userFields.smtpReputationPeak]: recent.peak,
        [config.userFields.smtpReputationPeakDomains]: recentDomains,
        [config.userFields.smtpReputationNextPeak]: nextPeak
      }
    }
  );

  if (matchedCount === 0) return { skipped: true };

  //
  // soft ceiling: alert admins to review (at most once per interval)
  //
  if (ceiling && !['demoted', 'reset'].includes(results.at(-1))) {
    const alertedAt = user[config.userFields.smtpReputationCeilingAlertedAt];
    if (
      !alertedAt ||
      new Date(alertedAt).getTime() <=
        Date.now() - config.smtpReputationCeilingAlertInterval
    ) {
      try {
        await sendCeilingAlert(user, ceiling.limit, ceiling.peak);
        await Users.updateOne(
          { _id: user._id },
          {
            $set: {
              [config.userFields.smtpReputationCeilingAlertedAt]: new Date()
            }
          }
        );
        results[results.length - 1] = 'ceiling';
      } catch (err) {
        // retried on the next evaluated day
        logger.fatal(err, { user });
      }
    }
  }

  return { results, tier: earned, cleanDays, ...last };
}

/**
 * Evaluate one completed day of sending for a user.
 *
 * @param {Object} user - Lean user document (with `USER_FIELDS`)
 * @param {Date} day - Any time within the day to evaluate
 * @returns {Promise<Object>} `{ skipped }` or `{ result, tier, cleanDays, total, bad }`
 */
async function evaluateUser(user, day) {
  const evaluation = await evaluateRange(user, day, day);
  if (evaluation.skipped) return evaluation;
  const { results, ...rest } = evaluation;
  return { result: results.at(-1), ...rest };
}

/**
 * Evaluate every day a user has not been evaluated for, in order, up to and
 * including `lastDay` (at most `config.smtpReputationBackfillDays` back, which
 * matches how long sent messages are kept).  This catches up on days the job
 * did not run and builds reputation from existing sending history.
 *
 * @param {Object} user - Lean user document (with `USER_FIELDS`)
 * @param {Date} lastDay - Any time within the last day to evaluate
 * @returns {Promise<Array<string>>} Result of each evaluated day
 */
async function evaluateUserThrough(user, lastDay) {
  const lastStart = dayjs.utc(lastDay).startOf('day');
  const earliest = lastStart.subtract(
    config.smtpReputationBackfillDays - 1,
    'day'
  );

  const evaluatedAt = user[config.userFields.smtpReputationEvaluatedAt];
  let from = evaluatedAt
    ? dayjs.utc(evaluatedAt).startOf('day').add(1, 'day')
    : earliest;
  if (from.isBefore(earliest)) from = earliest;

  const evaluation = await evaluateRange(
    user,
    from.toDate(),
    lastStart.toDate()
  );
  return evaluation.skipped ? ['skipped'] : evaluation.results;
}

const DISCOVERY_TTL = 3 * 24 * 60 * 60 * 1000;

// days before the evaluated day whose domain counts are caught up when they
// were missed (e.g. the job was down), with Redis to know which were done
const DOMAIN_COUNTS_CATCH_UP_DAYS = 7;
const DOMAIN_COUNTS_FINAL_TTL =
  (DOMAIN_COUNTS_CATCH_UP_DAYS + 3) * 24 * 60 * 60 * 1000;

//
// Users to consider for `day` beyond paying users: anyone who sent that day,
// and members of paid domains (who can send without paying themselves).
// This is the expensive part, so with Redis it runs once per day (later
// hourly runs only pick up paying users still pending, and discovered users
// whose evaluation failed).
//
async function discoverUsers(start, end, client) {
  const key = `smtp_reputation:discovered:${dayKey(start)}`;
  if (client) {
    try {
      if (await client.get(key)) {
        const retry = await client.smembers(
          `smtp_reputation:retry:${dayKey(start)}`
        );
        return retry.map((id) => new mongoose.Types.ObjectId(id));
      }
    } catch (err) {
      logger.fatal(err);
    }
  }

  const range = { $gte: start, $lt: end };
  const [senders, members] = await Promise.all([
    Emails.aggregate([
      { $match: { created_at: range } },
      { $group: { _id: '$user' } }
    ]).allowDiskUse(true),
    Domains.distinct('members.user', {
      plan: { $in: PAID_PLANS },
      has_smtp: true
    })
  ]);

  const ids = new Map();
  for (const { _id } of senders) if (_id) ids.set(_id.toString(), _id);
  for (const id of members) if (id) ids.set(id.toString(), id);

  return [...ids.values()];
}

//
// Remember that `day` was discovered, and which discovered users still need
// to be evaluated (retried on the next runs)
//
async function markDiscovered(start, client, failedIds) {
  if (!client) return;
  const retryKey = `smtp_reputation:retry:${dayKey(start)}`;
  try {
    const multi = client
      .multi()
      .set(
        `smtp_reputation:discovered:${dayKey(start)}`,
        '1',
        'PX',
        DISCOVERY_TTL
      )
      .del(retryKey);
    if (failedIds.length > 0)
      multi.sadd(retryKey, ...failedIds).pexpire(retryKey, DISCOVERY_TTL);
    await multi.exec();
  } catch (err) {
    logger.fatal(err);
  }
}

//
// Add `day`'s delivered messages to the daily counts of each domain that sent
// that day (used to ramp up new domains, see
// `helpers/get-smtp-sending-limits.js`), and compute the counts of domains
// that do not have them yet from their sent mail (so this does not happen
// while sending).  A provisional pass (for yesterday, whose late deliveries
// may not be known yet) is replaced by the final one.  With Redis each pass
// runs once per day.
//
async function updateDomainDailyCounts(
  start,
  end,
  client,
  { isFinal = true } = {}
) {
  const key = `smtp_reputation:domain_counts:${dayKey(start)}:${
    isFinal ? 'final' : 'provisional'
  }`;
  if (client) {
    try {
      if (await client.get(key)) return;
    } catch (err) {
      logger.fatal(err);
    }
  }

  const rows = await Emails.aggregate([
    {
      $match: {
        created_at: { $gte: start, $lt: end },
        status: { $in: DELIVERED_STATUSES },
        is_bounce: { $ne: true }
      }
    },
    { $group: { _id: '$domain', count: { $sum: 1 } } }
  ]).allowDiskUse(true);

  const windowStart = new Date(
    start.getTime() - config.smtpVelocityBaselineDays * ONE_DAY
  );
  for (const chunk of _.chunk(
    rows.filter((row) => row._id),
    1000
  )) {
    // domains without counts yet get their whole history
    const missing = await Domains.find({
      _id: { $in: chunk.map((row) => row._id) },
      smtp_daily_counts_at: { $exists: false }
    })
      .select('_id')
      .lean()
      .exec();
    for (const { _id } of missing) {
      const counts = await aggregateDailyCounts(Emails, _id, windowStart, end);
      await Domains.updateOne(
        { _id, smtp_daily_counts_at: { $exists: false } },
        {
          $set: {
            smtp_daily_counts: counts,
            smtp_daily_counts_at: new Date()
          }
        },
        { timestamps: false }
      );
    }

    await Domains.bulkWrite(
      chunk.map((row) => ({
        updateOne: {
          filter: { _id: row._id, smtp_daily_counts_at: { $exists: true } },
          // (the day replaces any earlier count for it, and days older than
          // the baseline window are dropped)
          update: [
            {
              $set: {
                smtp_daily_counts: {
                  $concatArrays: [
                    {
                      $filter: {
                        input: { $ifNull: ['$smtp_daily_counts', []] },
                        cond: {
                          $and: [
                            { $ne: ['$$this.day', start] },
                            { $gte: ['$$this.day', windowStart] }
                          ]
                        }
                      }
                    },
                    [{ day: start, count: row.count }]
                  ]
                }
              }
            }
          ],
          timestamps: false
        }
      })),
      { ordered: false }
    );
  }

  if (client) {
    try {
      await client.set(
        key,
        '1',
        'PX',
        isFinal ? DOMAIN_COUNTS_FINAL_TTL : DISCOVERY_TTL
      );
    } catch (err) {
      logger.fatal(err);
    }
  }
}

/**
 * Evaluate every user who needs it through `day`: every paying user, anyone
 * who sent that day, and members of paid domains, catching
 * up on any days they were not evaluated for (so existing senders are
 * backfilled and missed runs are caught up).
 *
 * By default this evaluates the day before yesterday, so the delivery outcome
 * of messages sent late in the day (or retried) is known.
 *
 * @param {Date} [day] - Last day to evaluate
 * @param {Object} [options]
 * @param {Object} [options.client] - Redis client (discovery once per day)
 * @returns {Promise<Object>} Counts of each result
 */
async function updateSmtpReputation(
  day = dayjs
    .utc()
    .subtract(config.smtpReputationEvaluationDelayDays, 'day')
    .toDate(),
  { client } = {}
) {
  const start = dayjs.utc(day).startOf('day').toDate();
  const end = dayjs.utc(start).add(1, 'day').toDate();

  // domains' daily counts, through yesterday
  // (a failure here must not keep users from being evaluated)
  // (and days missed before it, e.g. while the job was down, with Redis to
  // know which were done, so a domain's busiest day is not lost)
  const yesterday = dayjs.utc().subtract(1, 'day').startOf('day').toDate();
  if (client)
    for (let i = DOMAIN_COUNTS_CATCH_UP_DAYS; i > 0; i--) {
      const dayStart = dayjs.utc(start).subtract(i, 'day').toDate();
      try {
        await updateDomainDailyCounts(
          dayStart,
          dayjs.utc(dayStart).add(1, 'day').toDate(),
          client
        );
      } catch (err) {
        logger.fatal(err);
      }
    }

  for (
    let dayStart = start;
    dayStart.getTime() <= Math.max(start.getTime(), yesterday.getTime());
    dayStart = dayjs.utc(dayStart).add(1, 'day').toDate()
  ) {
    try {
      await updateDomainDailyCounts(
        dayStart,
        dayjs.utc(dayStart).add(1, 'day').toDate(),
        client,
        { isFinal: dayStart.getTime() === start.getTime() }
      );
    } catch (err) {
      logger.fatal(err);
    }
  }

  const ids = await discoverUsers(start, end, client);

  const counts = {
    promoted: 0,
    demoted: 0,
    reset: 0,
    ceiling: 0,
    unchanged: 0,
    skipped: 0
  };

  // only users not yet evaluated through this day (the job runs hourly)
  const cursor = Users.find({
    $and: [
      notEvaluatedSince(start),
      { [config.userFields.isBanned]: { $ne: true } },
      {
        $or: [
          ...(ids.length > 0 ? [{ _id: { $in: ids } }] : []),
          { plan: { $in: PAID_PLANS } }
        ]
      }
    ]
  })
    .select(USER_FIELDS)
    .lean()
    .cursor()
    .addCursorFlag('noCursorTimeout', true);

  const failedIds = [];
  for await (const user of cursor) {
    try {
      const results = await evaluateUserThrough(user, start);
      for (const result of results) counts[result]++;
      if (results.includes('skipped')) failedIds.push(user._id.toString());
    } catch (err) {
      failedIds.push(user._id.toString());
      logger.fatal(err, { user_id: user._id });
    }
  }

  // (users whose evaluation failed are retried on the next runs)
  await markDiscovered(start, client, failedIds);

  return counts;
}

module.exports = updateSmtpReputation;
module.exports.evaluateUser = evaluateUser;
module.exports.evaluateUserThrough = evaluateUserThrough;
module.exports.updateDomainDailyCounts = updateDomainDailyCounts;
module.exports.USER_FIELDS = USER_FIELDS;
