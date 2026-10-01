/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');

const Payments = require('#models/payments');
const Users = require('#models/users');
const config = require('#config');

//
// Fields that must be selected on a user for paid tenure
//
const PAID_SINCE_USER_FIELDS = `plan ${config.userFields.planExpiresAt}`;

//
// Add a payment's duration the same way plan expiry does (calendar months)
//
function addDuration(date, duration) {
  const mapping = config.durationMapping[String(duration)];
  return mapping
    ? dayjs(date)
        .add(...mapping)
        .toDate()
    : new Date(new Date(date).getTime() + duration);
}

/**
 * Whether a user's plan is paid for now (with a short grace period for
 * renewals that go through a few days late).  Uses the same plan expiry the
 * rest of the site uses.
 *
 * @param {Object} user - User object with `plan` and `plan_expires_at`
 * @param {Date} now - Current time
 * @returns {boolean} True if the plan is paid for now
 */
function isPlanActive(user, now) {
  if (!user || !user.plan || user.plan === 'free') return false;
  const expiresAt = user[config.userFields.planExpiresAt];
  if (!expiresAt) return false;
  return (
    new Date(expiresAt).getTime() + config.smtpReputationPaidGap >=
    now.getTime()
  );
}

/**
 * Start of the current unbroken paid period from a user's payments.
 *
 * Only real payments count: free beta credits and refunded payments (unless
 * the refund was a courtesy credit) are ignored, the same way refunded
 * payments are ignored for the plan itself.  Plan conversion credits extend
 * a paid period but cannot start one.  Payments stack like the plan does (a
 * payment made before the prior one ran out extends it by calendar months),
 * payments for any paid plan count (so changing plans does not restart
 * tenure), and a gap of up to `config.smtpReputationPaidGap` between paid
 * periods still counts as continuous.
 *
 * @param {Array<Object>} payments - Payments sorted by `invoice_at`
 * @param {Date} now - Current time
 * @returns {Date|null} Start of the current paid period, or null if real
 *   payments do not cover up to now
 */
function getOwnPaidSince(payments, now) {
  let since = null;
  let paidThrough = null;

  for (const payment of payments) {
    if (payment.amount_refunded > 0 && !payment.is_refund_credit_allowed)
      continue;

    const isConversion = payment.method === 'plan_conversion';
    if (!isConversion && !(payment.amount > 0)) continue;

    const start = new Date(payment.invoice_at);

    // a new paid period starts after a gap that is too long
    if (
      paidThrough === null ||
      start.getTime() > paidThrough.getTime() + config.smtpReputationPaidGap
    ) {
      if (isConversion) continue;
      since = start;
      paidThrough = start;
    }

    paidThrough = addDuration(
      start.getTime() > paidThrough.getTime() ? start : paidThrough,
      payment.duration
    );
  }

  // payments must cover up to now
  if (
    since === null ||
    paidThrough.getTime() + config.smtpReputationPaidGap < now.getTime()
  )
    return null;

  return since;
}

/**
 * Get the start of a user's current unbroken paid period.
 *
 * The user must be paying now (their plan has not expired), and only
 * their own payments count (a Team plan domain's members and other admins
 * send with the domain's threshold, which is the paying admin's, so their
 * own reputation does not borrow the paying admin's time).
 *
 * @param {Object} user - User object with `_id` (and `plan`/`plan_expires_at`,
 *   which are loaded if missing)
 * @param {Date} [now] - Current time
 * @returns {Promise<Date|null>} Start of the current paid period, or null if
 *   the user is not paying now
 */
async function getPaidSince(user, now = new Date()) {
  if (!user || !user._id) return null;

  const hasPlanFields =
    typeof user.plan === 'string' &&
    Boolean(user[config.userFields.planExpiresAt]);
  const candidate = hasPlanFields
    ? user
    : await Users.findById(user._id)
        .select(PAID_SINCE_USER_FIELDS)
        .lean()
        .exec();
  if (!candidate || !isPlanActive(candidate, now)) return null;

  const payments = await Payments.find({
    user: user._id,
    method: { $ne: 'free_beta_program' },
    invoice_at: { $lte: now }
  })
    .select(
      'user amount amount_refunded is_refund_credit_allowed method invoice_at duration'
    )
    .sort({ invoice_at: 1, _id: 1 })
    .lean()
    .exec();

  return getOwnPaidSince(payments, now);
}

/**
 * Number of whole days a user has been paying without a break.
 *
 * @param {Date|null} paidSince - Start of the current paid period
 * @param {Date} [now] - Current time
 * @returns {number} Days of continuous paid tenure (0 if not paying)
 */
function getPaidDays(paidSince, now = new Date()) {
  if (!paidSince) return 0;
  return Math.max(0, dayjs(now).diff(dayjs(paidSince), 'day'));
}

module.exports = getPaidSince;
module.exports.getPaidDays = getPaidDays;
module.exports.isPlanActive = isPlanActive;
module.exports.PAID_SINCE_USER_FIELDS = PAID_SINCE_USER_FIELDS;
