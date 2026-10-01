/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');

const _ = require('#helpers/lodash');
const config = require('#config');
const emailHelper = require('#helpers/email');
const { getRecipientsHourKey } = require('#helpers/check-smtp-velocity');
const getUserSmtpLimit = require('#helpers/get-user-smtp-limit');
const logger = require('#helpers/logger');
const { getSmtpDayStart } = require('#helpers/get-smtp-day');
const {
  getReportKey,
  isReportKeyConsumer
} = require('#helpers/smtp-reputation-recipients');

const {
  canLendSmtpLimit,
  isSmtpOnHold,
  isSmtpRestricted,
  SMTP_LIMIT_USER_FIELDS
} = getUserSmtpLimit;

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

// most recent reports kept on a user (older ones are dropped)
// (more than the most needed for a reset, see `getReportThresholds`)
const MAX_REPORTS = 200;

// most recent reports about members who borrowed a user's threshold kept on
// them in 24 hours (more than the most needed, see `getReportThresholds`)
const MAX_BORROWED_REPORTS = 60;

// reports are only needed until the job evaluated their day
// (see `helpers/update-smtp-reputation.js`)
const REPORT_RETENTION =
  (config.smtpReputationBackfillDays +
    config.smtpReputationEvaluationDelayDays +
    2) *
  ONE_DAY;

//
// Fields read from a user to decide on a reset
//
const REPORT_USER_FIELDS = {
  email: 1,
  plan: 1,
  [config.userFields.smtpLimit]: 1,
  [config.userFields.smtpReputationTier]: 1,
  [config.userFields.smtpReputationHoldUntil]: 1,
  [config.userFields.smtpReputationReviewedAt]: 1,
  [config.userFields.smtpReputationReports]: 1
};

/**
 * Reports at which a day is a bad day, and at which the sender is reset: a
 * rate of the recipients they sent to (see `config.smtpReputation*Report*`),
 * and at least a minimum count, so a single detection (or a rare false
 * positive for a large sender) never demotes or resets anyone, up to a cap
 * (so they stay reachable with the reports kept on a user).
 *
 * @param {number} recipients - Recipients the sender sent to in the period
 * @returns {Object} `{ badDay, reset }`
 */
function getReportThresholds(recipients) {
  const daily = Number.isFinite(recipients) && recipients > 0 ? recipients : 0;
  return {
    badDay: Math.min(
      config.smtpReputationBadDayReportsMax,
      Math.max(
        config.smtpReputationBadDayReports,
        Math.ceil(daily * config.smtpReputationBadDayReportRate)
      )
    ),
    reset: Math.min(
      config.smtpReputationTruthSourceStrikesMax,
      Math.max(
        config.smtpReputationTruthSourceStrikes,
        Math.ceil(daily * config.smtpReputationTruthSourceStrikeRate)
      )
    )
  };
}

//
// Reports in [start, end), after `since` if set (when an admin last
// reviewed the sender)
//
function* getReportsIn(reports, start, end, since) {
  const after = since ? new Date(since).getTime() : Number.NEGATIVE_INFINITY;
  for (const report of reports || []) {
    if (!report || !report.date) continue;
    const time = new Date(report.date).getTime();
    if (time >= start.getTime() && time < end.getTime() && time > after)
      yield report;
  }
}

/**
 * Spam and virus reports in [start, end) that count against a sender: one per
 * recipient on a mailbox provider's consumer domain (e.g. gmail.com), and one
 * per root domain otherwise (so a single company tenant, whose admins can
 * reject mail as they like and create addresses at will, cannot reset a
 * sender on its own).
 *
 * @param {Array} reports - Reports on the user
 * @param {Date} start - Start (inclusive)
 * @param {Date} end - End (exclusive)
 * @param {Date} [since] - Only reports after this (an admin review)
 * @returns {number} Reports that count
 */
function getReportKeys(reports, { start, end, since, isBorrowed = false }) {
  const keys = new Set();
  for (const report of getReportsIn(reports, start, end, since)) {
    // (suspensions recorded before do not count)
    if (report.category === 'suspension' || !report.recipient) continue;
    if (Boolean(report.borrowed) !== isBorrowed) continue;
    const key = getReportKey(report.recipient);
    if (key) keys.add(key);
  }

  return keys;
}

/**
 * Reports that count toward a threshold: reports about company tenants'
 * domains (whose admins can reject mail as they like and create addresses at
 * will) make up at most half of those needed, so at least half of them are
 * about recipients on mailbox providers' consumer domains (e.g. gmail.com).
 *
 * @param {Set} keys - Report keys (see `getReportKeys`)
 * @param {number} threshold - Reports needed
 * @returns {number} Reports that count toward the threshold
 */
function countReportKeys(keys, threshold) {
  let consumer = 0;
  let tenant = 0;
  for (const key of keys) {
    if (isReportKeyConsumer(key)) consumer++;
    else tenant++;
  }

  return consumer + Math.min(tenant, Math.floor(threshold / 2));
}

//
// Reports about the user's own sending in [start, end) that count toward a
// bad day at `threshold` (see `countReportKeys`)
//
// eslint-disable-next-line max-params
function countReportedRecipients(reports, start, end, since, threshold) {
  return countReportKeys(
    getReportKeys(reports, { start, end, since }),
    threshold
  );
}

/**
 * Reports in [start, end) about members who borrowed the user's threshold (see
 * `recordOnSenderAndAdmins`), and the recipients those members sent to (the
 * most recorded with a report of each member), so the reports count as a
 * rate of the members' sending, not of the admin's own.
 *
 * @param {Array} reports - Reports on the user
 * @param {Date} start - Start (inclusive)
 * @param {Date} end - End (exclusive)
 * @param {Date} [since] - Only reports after this (an admin review)
 * @returns {Object} `{ count, recipients }`
 */
function getBorrowedReports(reports, start, end, since = null) {
  const keys = getReportKeys(reports, { start, end, since, isBorrowed: true });
  const bySender = new Map();
  for (const report of getReportsIn(reports, start, end, since)) {
    if (!report.borrowed || !report.sender) continue;
    const id = report.sender.toString();
    bySender.set(
      id,
      Math.max(bySender.get(id) || 0, Number(report.sender_recipients) || 0)
    );
  }

  let recipients = 0;
  for (const value of bySender.values()) recipients += value;
  return { keys, count: keys.size, recipients };
}

/**
 * Reports in [start, end) that count toward resetting a sender at
 * `threshold`: only reports about their own sending (not about a member who
 * borrowed their threshold, which only count toward a bad day), with at most
 * half of them about company tenants (see `countReportKeys`).  So whoever
 * runs company tenants at a truth source (who can reject mail as they like,
 * e.g. every reply to them) cannot reset a sender on their own.
 *
 * @param {Array} reports - Reports on the user
 * @param {Date} start - Start (inclusive)
 * @param {Date} end - End (exclusive)
 * @param {Date} [since] - Only reports after this (an admin review)
 * @param {number} threshold - Reports needed for a reset
 * @returns {number} Reports that count toward a reset
 */
// eslint-disable-next-line max-params
function countResetReports(reports, start, end, since, threshold) {
  return countReportKeys(
    getReportKeys(reports, { start, end, since }),
    threshold
  );
}

/**
 * Whether a truth source rejection is a verdict about the sender's message:
 * a permanent (5xx) spam or virus rejection, and not a deferral or a verdict
 * about our shared IP addresses (which is not the sender's doing).
 *
 * @param {Error} err - Delivery error (with `response` and `bounceInfo`)
 * @returns {boolean} True if it counts against the sender
 */
function isSenderVerdict(err) {
  if (!err || typeof err.bounceInfo !== 'object' || !err.bounceInfo)
    return false;
  const { action, category, message } = err.bounceInfo;
  if (!['spam', 'virus'].includes(category)) return false;
  if (action === 'defer') return false;
  if (typeof message === 'string' && /\bIP\b/.test(message)) return false;
  // (the code the recipient's server responded with, since `responseCode`
  // may already have been normalized)
  const response = typeof err.response === 'string' ? err.response : '';
  const match = /^\s*([245])\d\d/.exec(response);
  return Boolean(match && match[1] === '5');
}

async function sendResetAlert(user, reason) {
  await emailHelper({
    template: 'alert',
    message: {
      to: config.alertsEmail,
      subject: `SMTP reputation reset: ${user.email || user._id}`
    },
    locals: {
      message: `<p>Outbound SMTP reputation for <strong>${_.escape(
        user.email || String(user._id)
      )}</strong> was reset to their plan's starting threshold after ${_.escape(
        reason
      )}.  Moving up is paused for ${
        config.smtpReputationHoldDays
      } days, and a minimum an admin approved does not apply meanwhile.</p><p>Review this sender in the admin dashboard (setting their reputation tier lifts the pause).</p>`
    }
  });
}

/**
 * Recipients outside the domain sent from that a user sent to in the last 24
 * hours, from the hourly counts kept while sending (see
 * `helpers/check-smtp-velocity.js`), or without Redis their messages in the
 * last 24 hours.
 *
 * @param {Object} options
 * @param {Object} [options.client] - Redis client
 * @param {Object} options.userId - User id
 * @param {Date} options.now - Current time
 * @returns {Promise<number>} Recipients
 */
async function getRecentRecipients({ client, userId, now }) {
  let counted = 0;
  if (client) {
    try {
      const keys = [];
      for (let i = 0; i < 24; i++)
        keys.push(
          getRecipientsHourKey(userId, new Date(now.getTime() - i * ONE_HOUR))
        );
      const values = await client.mget(...keys);
      counted = values.reduce((sum, v) => sum + Math.max(0, Number(v) || 0), 0);
    } catch (err) {
      logger.fatal(err);
    }
  }

  // (and the recipients of messages due in the last 24 hours, so e.g. a send
  // scheduled days ahead, or the counts lost with Redis, still count when
  // the reports about it come in)
  // (required here, since the models require helpers that require this)
  const { Emails } = require('#models');
  try {
    const [result] = await Emails.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(String(userId)),
          date: { $gte: new Date(now.getTime() - ONE_DAY), $lte: now },
          is_bounce: { $ne: true }
        }
      },
      {
        $group: {
          _id: null,
          recipients: {
            $sum: {
              $cond: [
                { $isArray: '$envelope.to' },
                { $size: '$envelope.to' },
                1
              ]
            }
          }
        }
      }
    ]);
    return Math.max(counted, (result && result.recipients) || 0);
  } catch (err) {
    logger.fatal(err);
    return counted;
  }
}

//
// Pause an admin lending their threshold once reports about members who
// borrowed it in the last 24 hours reach the reset rate of those members'
// recent sending (with at least one on a mailbox provider's consumer domain)
//
async function pauseLending({ Users, userId, updated, now }) {
  const reports = updated[config.userFields.smtpReputationReports];
  const start = new Date(now.getTime() - ONE_DAY);
  const end = new Date(now.getTime() + 1);
  const since = updated[config.userFields.smtpReputationReviewedAt];
  const { keys, recipients } = getBorrowedReports(reports, start, end, since);
  const { reset } = getReportThresholds(recipients);
  if (countReportKeys(keys, reset) < reset) return;

  const { modifiedCount } = await Users.updateOne(
    {
      _id: userId,
      $or: [
        {
          [config.userFields.smtpReputationLendHoldUntil]: { $exists: false }
        },
        { [config.userFields.smtpReputationLendHoldUntil]: null },
        { [config.userFields.smtpReputationLendHoldUntil]: { $lte: now } }
      ]
    },
    {
      $set: {
        [config.userFields.smtpReputationLendHoldUntil]: new Date(
          now.getTime() + config.smtpReputationHoldDays * ONE_DAY
        )
      }
    }
  );
  if (modifiedCount > 0)
    emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `SMTP threshold lending paused: ${updated.email || userId}`
      },
      locals: {
        message: `<p><strong>${_.escape(
          updated.email || String(userId)
        )}</strong> no longer lends their outbound SMTP threshold to members of Team plan domains they are an admin of for ${
          config.smtpReputationHoldDays
        } days, after spam or virus reports from truth sources about those members' sending (${
          keys.size
        } within 24 hours).  Their own sending is not affected.</p><p>Review this account in the admin dashboard (setting their reputation tier lifts the pause).</p>`
      }
    }).catch((err) => logger.fatal(err));
}

//
// Record a report on one user and reset them once they reached the threshold
//
async function recordForUser({ Users, client, userId, report, now }) {
  // (reports about members who borrowed the user's threshold are kept up to
  // what can matter for them, so they cannot push the user's own reports out)
  if (report.borrowed === true) {
    const current = await Users.findById(userId)
      .select(config.userFields.smtpReputationReports)
      .lean()
      .exec();
    const since = now.getTime() - ONE_DAY;
    const recent = (
      (current && current[config.userFields.smtpReputationReports]) ||
      []
    ).filter(
      (r) => r && r.borrowed && r.date && new Date(r.date).getTime() >= since
    ).length;
    if (recent >= MAX_BORROWED_REPORTS) return false;
  }

  // (each report key, e.g. a recipient, or a company tenant's root domain, is
  // only recorded once per user and UTC day, so the reports kept on a user
  // cannot be flushed with many variants of one recipient)
  const filter = {
    _id: userId,
    [config.userFields.smtpReputationReports]: {
      $not: {
        $elemMatch: {
          key: report.key,
          borrowed: report.borrowed === true ? true : { $ne: true },
          date: { $gte: getSmtpDayStart(now) }
        }
      }
    }
  };
  const updated = await Users.findOneAndUpdate(
    filter,
    {
      $push: {
        [config.userFields.smtpReputationReports]: {
          $each: [report],
          $slice: -MAX_REPORTS
        }
      }
    },
    { new: true, projection: REPORT_USER_FIELDS }
  )
    .lean()
    .exec();

  if (!updated) return false;

  // (reports are only kept until their day was evaluated)
  Users.updateOne(
    { _id: userId },
    {
      $pull: {
        [config.userFields.smtpReputationReports]: {
          date: { $lt: new Date(now.getTime() - REPORT_RETENTION) }
        }
      }
    }
  )
    .then()
    .catch((err) => logger.fatal(err));

  // (reports from a member's sending count toward a bad day for the admins
  // whose threshold they borrowed, as a rate of the member's sending, but
  // never reset them: the member is reset and then held to their own
  // threshold, so one member cannot take down an account's threshold for all
  // its domains; enough of them at the reset rate of the members' sending,
  // e.g. from members added one after another to spend the threshold, pause
  // the admin lending it instead)
  if (report.borrowed === true) {
    await pauseLending({ Users, userId, updated, now });
    return false;
  }

  const { reset } = getReportThresholds(
    await getRecentRecipients({ client, userId, now })
  );
  const count = countResetReports(
    updated[config.userFields.smtpReputationReports],
    new Date(now.getTime() - ONE_DAY),
    new Date(now.getTime() + 1),
    updated[config.userFields.smtpReputationReviewedAt],
    reset
  );
  if (count < reset) return false;
  const reason = `spam or virus reports from truth sources (${count} within 24 hours)`;

  const day = getSmtpDayStart(now);
  const update = {
    $set: {
      [config.userFields.smtpReputationTier]: 0,
      [config.userFields.smtpReputationCleanDays]: 0,
      [config.userFields.smtpReputationHoldUntil]: new Date(
        now.getTime() + config.smtpReputationHoldDays * ONE_DAY
      ),
      [config.userFields.smtpReputationHoldReason]: 'reports',
      [config.userFields.smtpReputationResetAt]: now,
      [config.userFields.smtpThrottledAt]: now
    },
    $addToSet: { [config.userFields.smtpThrottledDays]: day }
  };

  // (alert once per pause, not for every further report, even when several
  // arrive at once)
  const { modifiedCount } = await Users.updateOne(
    {
      _id: userId,
      $or: [
        { [config.userFields.smtpReputationHoldUntil]: { $exists: false } },
        { [config.userFields.smtpReputationHoldUntil]: null },
        { [config.userFields.smtpReputationHoldUntil]: { $lte: now } }
      ]
    },
    update
  );
  if (modifiedCount > 0)
    sendResetAlert(updated, reason).catch((err) => logger.fatal(err));
  else await Users.updateOne({ _id: userId }, update);

  return true;
}

//
// Admins of the Team plan domain a message was sent from whose threshold the
// domain uses (the highest), unless the sender's own threshold is as high
// (members may be populated or plain ids)
//
async function getBorrowedAdminIds(Users, domain, user) {
  if (!domain || domain.plan !== 'team' || !Array.isArray(domain.members))
    return [];
  const senderId = user._id.toString();
  const ids = [];
  for (const member of domain.members) {
    if (!member || member.group !== 'admin' || !member.user) continue;
    const id =
      typeof member.user === 'object' && member.user._id
        ? member.user._id
        : member.user;
    if (id.toString() !== senderId) ids.push(id);
  }

  if (ids.length === 0) return [];

  // (only admins whose threshold can apply, see `canLendSmtpLimit`)
  const found = await Users.find({ _id: { $in: ids } })
    .select(SMTP_LIMIT_USER_FIELDS)
    .lean()
    .exec();
  const admins = found.filter((admin) => canLendSmtpLimit(admin));
  let highest = 0;
  for (const admin of admins)
    highest = Math.max(highest, getUserSmtpLimit(admin));

  // (the sender does not borrow a threshold they have themselves, and a
  // sender restricted or on hold sends with their own)
  const sender = await Users.findById(user._id)
    .select(SMTP_LIMIT_USER_FIELDS)
    .lean()
    .exec();
  if (
    !sender ||
    isSmtpRestricted(sender) ||
    isSmtpOnHold(sender) ||
    getUserSmtpLimit(sender) >= highest
  )
    return [];

  return admins
    .filter((admin) => getUserSmtpLimit(admin) === highest)
    .map((admin) => admin._id);
}

//
// Record a report on the sender and on the admins whose threshold they
// borrowed (returns whether the sender was reset)
//
async function recordOnSenderAndAdmins({
  Users,
  client,
  user,
  domain,
  report,
  now
}) {
  // (whose threshold the sender used, as they were before this report)
  let adminIds = [];
  try {
    adminIds = await getBorrowedAdminIds(Users, domain, user);
  } catch (err) {
    logger.fatal(err);
  }

  const isReset = await recordForUser({
    Users,
    client,
    userId: user._id,
    report,
    now
  });

  // (with the member's recent sending, so the admins' bad day is a rate of it)
  let senderRecipients = 0;
  if (adminIds.length > 0) {
    try {
      senderRecipients = await getRecentRecipients({
        client,
        userId: user._id,
        now
      });
    } catch (err) {
      logger.fatal(err);
    }
  }

  for (const adminId of adminIds) {
    try {
      await recordForUser({
        Users,
        client,
        userId: adminId,
        report: {
          ...report,
          borrowed: true,
          sender: user._id,
          sender_recipients: senderRecipients
        },
        now
      });
    } catch (err) {
      logger.fatal(err);
    }
  }

  return isReset;
}

/**
 * Record a spam or virus verdict from a truth source (a large mailbox
 * provider) against the user who sent the message, and toward a bad day for
 * the admin of the Team plan domain it was sent from whose threshold they
 * borrowed (which never resets that admin).
 *
 * Truth sources are the authority on abuse, so these reports count against
 * reputation (see `helpers/update-smtp-reputation.js`), and once enough were
 * reported within 24 hours (see `countResetReports`, as a rate of the
 * recipients they sent to in the last 24 hours, see `getReportThresholds`) the user is
 * at once reset to their plan's starting
 * threshold, their sending that day is marked as slowed down, and moving up
 * is paused (a minimum an admin approved does not apply meanwhile).  So a
 * sender cannot spend a reputation built up over time on one blast.
 *
 * @param {Object} options
 * @param {Object} options.Users - Users model
 * @param {Object} [options.client] - Redis client (recent recipients)
 * @param {Object} options.user - User who sent the message (`_id`)
 * @param {Object} [options.domain] - Domain it was sent from (with members)
 * @param {Object} options.email - Email that was reported
 * @param {string} options.recipient - Recipient whose provider reported it
 * @param {string} options.truthSource - Truth source that reported it
 * @param {string} options.category - `spam` or `virus`
 * @returns {Promise<boolean>} Whether the sender was reset
 */
async function recordSmtpReputationReport({
  Users,
  client,
  user,
  domain,
  email,
  recipient,
  truthSource,
  category
}) {
  if (!user || !user._id || typeof recipient !== 'string') return false;
  const key = getReportKey(recipient);
  if (!key) return false;

  const now = new Date();
  const report = {
    date: now,
    email: email && email._id ? email._id : null,
    recipient: recipient.toLowerCase().trim(),
    key,
    truth_source: truthSource,
    category
  };

  return recordOnSenderAndAdmins({ Users, client, user, domain, report, now });
}

module.exports = recordSmtpReputationReport;
module.exports.countReportedRecipients = countReportedRecipients;
module.exports.countResetReports = countResetReports;
module.exports.countReportKeys = countReportKeys;
module.exports.getBorrowedReports = getBorrowedReports;
module.exports.getRecentRecipients = getRecentRecipients;
module.exports.getReportThresholds = getReportThresholds;
module.exports.isSenderVerdict = isSenderVerdict;
