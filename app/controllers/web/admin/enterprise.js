/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');
const { isURL } = require('@forwardemail/validator');

const _ = require('#helpers/lodash');
const config = require('#config');
const enterpriseBilling = require('#helpers/enterprise-billing');
const { Payments, Users } = require('#models');

//
// Enterprise billing (see `is_enterprise` in the user model): the settings
// and payments of one customer (from Admin > Users), and of all of them on
// one sheet (Admin > Enterprise)
//
// (admin-only messages, in English like the rest of the admin pages)
//
const REGEX_DATE = new RE2(/^\d{4}-\d{2}-\d{2}$/);
const REGEX_AMOUNT = new RE2(/^\d{1,8}(\.\d{1,2})?$/);
const REGEX_ROW = new RE2(/^row__([a-f\d]{24})$/);
const REGEX_PAYMENT_ROW = new RE2(/^payment_row__(\d{1,2})$/);
// (a reference is part of the address of its receipt)
const REGEX_REFERENCE = new RE2(/^[a-z\d][\w-]{0,63}$/i);
const RESERVED_REFERENCES = new Set([
  'UPGRADE',
  'MAKE-PAYMENT',
  'UPDATE-CARD',
  'ENABLE-AUTO-RENEW',
  'UPGRADE-REQUEST',
  'MANAGE-PAYMENTS'
]);

// a value of a form field (a repeated field is an array, and is refused)
function getField(body, name) {
  const value = body[name];
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string')
    throw Boom.badRequest(`Invalid value for ${_.escape(name)}`);
  return value.trim();
}

const formatDate = (date) => dayjs.utc(date).format('YYYY-MM-DD');

// a date from a date input, at the start of that day in UTC
function parseDate(value, label) {
  const date = REGEX_DATE.test(value)
    ? dayjs.utc(value, 'YYYY-MM-DD', true)
    : null;
  if (!date || !date.isValid() || date.year() < 2000 || date.year() > 2100)
    throw Boom.badRequest(`${label} must be a valid date`);
  return date.toDate();
}

// dollars from a number input, as cents
function parseAmount(value, label) {
  const amount = REGEX_AMOUNT.test(value)
    ? Math.round(Number.parseFloat(value) * 100)
    : Number.NaN;
  if (!Number.isSafeInteger(amount) || amount > enterpriseBilling.MAX_AMOUNT)
    throw Boom.badRequest(
      `${label} must be a dollar amount from 0 to ${
        enterpriseBilling.MAX_AMOUNT / 100
      }`
    );
  return amount;
}

//
// What an admin sees of an account's enterprise billing, as one value: a
// form sends back the one it was shown, so that it is not saved over what
// another admin (or another tab) changed since
//
function getRevision(user) {
  return crypto
    .createHash('sha256')
    .update(
      JSON.stringify([
        Boolean(user.is_enterprise),
        user.enterprise_start_date,
        user.enterprise_billing_frequency,
        user.enterprise_billing_amount,
        user.enterprise_last_paid_at,
        user.enterprise_notes
      ])
    )
    .digest('hex')
    .slice(0, 16);
}

function assertRevision(user, revision) {
  if (revision !== getRevision(user))
    throw Boom.badRequest(
      'This was changed since the page was opened, reload the page and try again'
    );
}

//
// Sets the billing settings from the fields of a form (`get` returns the
// value of one)
//
function setSettings(user, get, isEnterprise) {
  const startDate = get('enterprise_start_date');
  const frequency = get('enterprise_billing_frequency');
  const amount = get('enterprise_billing_amount');
  const lastPaidAt = get('enterprise_last_paid_at');
  const notes = get('enterprise_notes');

  // reminders to admins follow the start date and the frequency
  if (isEnterprise && (!startDate || !frequency))
    throw Boom.badRequest(
      'An enterprise account needs a start date and a billing frequency'
    );

  if (frequency && !enterpriseBilling.FREQUENCIES.includes(frequency))
    throw Boom.badRequest('Billing frequency must be monthly or annual');

  if (notes.length > 5000)
    throw Boom.badRequest('Notes must be 5,000 characters or less');

  user.enterprise_start_date = startDate
    ? parseDate(startDate, 'Start date')
    : undefined;
  user.enterprise_billing_frequency = frequency || undefined;
  user.enterprise_billing_amount = amount
    ? parseAmount(amount, 'Billing amount')
    : undefined;
  user.enterprise_last_paid_at = lastPaidAt
    ? parseDate(lastPaidAt, 'Frequency last paid')
    : undefined;
  user.enterprise_notes = notes || undefined;
}

//
// The payment entered in the fields of a form (`get` returns the value of
// one), to be created once the account is saved.  On the sheet of all
// customers a row without a payment has these fields empty (`isOptional`),
// and there is none.
//
// It is a payment like any other (Admin > Payments, and a receipt on the
// Billing page of the customer), with the method `enterprise`.
//
async function getPayment(ctx, user, get, isOptional = false) {
  const paidAt = get('paid_at');
  const reference = get('reference').toUpperCase();
  const trackingUrl = get('tracking_url');
  const notes = get('notes');
  const description = get('description');
  let amount = get('amount');

  if (
    isOptional &&
    !paidAt &&
    !amount &&
    !reference &&
    !trackingUrl &&
    !description
  )
    return null;

  if (!user.is_enterprise)
    throw Boom.badRequest('This account is not marked as enterprise');

  if (!paidAt)
    throw Boom.badRequest('A payment needs the date it was received');
  //
  // (at noon in UTC, so that the receipt shows this day to a customer in any
  // time zone, and not the day before to one west of UTC)
  //
  const date = dayjs
    .utc(parseDate(paidAt, 'Date received'))
    .add(12, 'hour')
    .toDate();
  // (a payment was received, so its date is not in the future; a day is
  // allowed for time zones ahead of UTC)
  if (date.getTime() > dayjs().add(1, 'day').valueOf())
    throw Boom.badRequest('Date received cannot be in the future');

  // (on the sheet an empty amount is the billing amount of the account)
  if (isOptional && !amount && Number.isFinite(user.enterprise_billing_amount))
    amount = (user.enterprise_billing_amount / 100).toFixed(2);
  if (!amount) throw Boom.badRequest('A payment needs an amount');
  const cents = parseAmount(amount, 'Amount');

  //
  // the invoice, reference or transaction number is the reference of the
  // payment (on its receipt and in Admin > Payments); without one the
  // payment gets a reference of its own, like any other payment
  //
  if (reference) {
    if (!REGEX_REFERENCE.test(reference) || RESERVED_REFERENCES.has(reference))
      throw Boom.badRequest(
        'Reference must be up to 64 letters, numbers, dashes or underscores'
      );
    if (await Payments.exists({ reference }))
      throw Boom.badRequest(
        `Reference ${_.escape(reference)} is already used by another payment`
      );
  }

  // (a link an admin clicks, so only https, never e.g. `javascript:`)
  if (
    trackingUrl &&
    (trackingUrl.length > 2048 ||
      !isURL(trackingUrl, { protocols: ['https'], require_protocol: true }))
  )
    throw Boom.badRequest('Tracking link must be an https:// link');

  if (notes.length > 1000)
    throw Boom.badRequest('Notes must be 1,000 characters or less');

  if (description.length > 200)
    throw Boom.badRequest('Description must be 200 characters or less');

  // (the same payment submitted twice; one with a reference of its own is
  // another payment, since a reference is used once)
  if (
    !reference &&
    (await Payments.exists({
      user: user._id,
      method: 'enterprise',
      invoice_at: date,
      amount: cents
    }))
  )
    throw Boom.badRequest(
      'A payment of this amount on this date was already recorded (give it a reference if it is another payment)'
    );

  //
  // the payment is for the billing period that is due: that period is then
  // the one last paid for, whether it was paid early or late (the form sends
  // the due date it showed, so a stale page cannot mark another period)
  //
  let periodDueAt;
  if (boolean(get('mark_paid'))) {
    periodDueAt = enterpriseBilling.getNextDueAt(user);
    if (!periodDueAt || get('due_at') !== formatDate(periodDueAt))
      throw Boom.badRequest(
        'The billing period that is due has changed, reload the page and try again'
      );
    user.enterprise_last_paid_at = periodDueAt;
  }

  return {
    user: user._id,
    method: 'enterprise',
    plan: 'team',
    kind: 'one-time',
    duration:
      user.enterprise_billing_frequency === 'monthly' ? ms('30d') : ms('1y'),
    amount: cents,
    invoice_at: date,
    // (the customer gets no billing emails, so no receipt is emailed)
    receipt_sent_at: new Date(),
    ...(reference ? { reference } : {}),
    enterprise_tracking_url: trackingUrl || undefined,
    enterprise_notes: notes || undefined,
    enterprise_description: description || undefined,
    enterprise_period_due_at: periodDueAt,
    enterprise_created_by: ctx.state.user._id
  };
}

//
// Creates the payments, then saves the account (which marks the billing
// periods they pay for as paid).  If any of it fails the payments created
// are removed, so that a period is never left paid without its payment.
//
async function savePayments(user, payments) {
  const created = [];
  try {
    for (const payment of payments) {
      const doc = await Payments.create(payment);
      created.push(doc._id);
      // (saved at the same moment as another payment with this reference,
      // the model gave it a reference of its own)
      if (payment.reference && doc.reference !== payment.reference)
        throw Boom.badRequest(
          `Reference ${_.escape(
            payment.reference
          )} is already used by another payment`
        );
    }

    await user.save();
  } catch (err) {
    if (created.length > 0)
      await Payments.deleteMany({ _id: { $in: created } });
    throw err;
  }
}

// a subscription the account has is canceled (it is billed by invoice)
async function cancelSubscriptions(user) {
  const { fields, failed } = await enterpriseBilling.cancelSubscriptions(user);
  if (fields.length === 0) return failed;
  for (const field of fields) user[field] = undefined;
  await user.save();
  return failed;
}

// the account of the page (an ID that is not one is no account)
async function getUser(ctx) {
  const user = mongoose.isObjectIdOrHexString(ctx.params.id)
    ? await Users.findById(ctx.params.id)
    : null;
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));
  return user;
}

function respond(ctx, text, warning) {
  ctx.flash(
    'custom',
    warning
      ? {
          title: ctx.request.t('Warning'),
          text: warning,
          type: 'warning'
        }
      : {
          title: ctx.request.t('Success'),
          text: text || ctx.translate('REQUEST_OK'),
          type: 'success',
          toast: true,
          showConfirmButton: false,
          timer: 5000,
          position: 'top'
        }
  );

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function update(ctx) {
  const user = await getUser(ctx);

  const { body } = ctx.request;
  const get = (name) => getField(body, name);
  // (a checkbox that is not checked is not sent)
  const isEnterprise = boolean(get('is_enterprise'));
  const wasEnterprise = Boolean(user.is_enterprise);

  // (the forms of the admin pages send it; without it, as before)
  if (get('rev')) assertRevision(user, get('rev'));

  if (
    isEnterprise &&
    !wasEnterprise &&
    (user[config.userFields.isBanned] || user[config.userFields.isRemoved])
  )
    throw Boom.badRequest(
      'A banned or removed account cannot be marked as enterprise'
    );

  setSettings(user, get, isEnterprise);

  //
  // (only a change is assigned: an account from before this field existed
  // has none stored, and assigning the default would count as a change)
  //
  if (isEnterprise !== wasEnterprise) user.is_enterprise = isEnterprise;

  //
  // when an account stops being enterprise its Team plan starts over from
  // that day, and it is billed and rate limited like any other account from
  // then on (the date its plan started is kept when it becomes enterprise)
  //
  if (wasEnterprise && !isEnterprise) {
    user[config.userFields.planSetAt] = new Date();
    user[config.userFields.isRateLimitWhitelisted] = false;
  }

  await user.save();

  // (once the account is saved as enterprise)
  const failed = isEnterprise ? await cancelSubscriptions(user) : [];

  ctx.logger.info('enterprise billing updated', {
    admin: ctx.state.user.id,
    user: user.id,
    is_enterprise: isEnterprise,
    was_enterprise: wasEnterprise
  });

  if (user.id === ctx.state.user.id) await ctx.login(user);

  respond(
    ctx,
    null,
    failed.length > 0
      ? `Saved, but ${failed.join(
          ' and '
        )} could not be canceled. Cancel it with the payment provider so the customer is not charged.`
      : undefined
  );
}

async function createPayment(ctx) {
  const user = await getUser(ctx);

  const { body } = ctx.request;

  // (the form of the admin page sends what it showed)
  if (getField(body, 'rev')) assertRevision(user, getField(body, 'rev'));

  const rows = [];
  for (const key of Object.keys(body)) {
    const match = REGEX_PAYMENT_ROW.exec(key);
    if (match) rows.push(match[1]);
  }

  //
  // the form of the admin page has a row for each payment, so that several
  // are recorded at once (every row is checked before any is recorded, and
  // a row without a payment is left out)
  //
  const payments = [];
  if (rows.length === 0) {
    payments.push(await getPayment(ctx, user, (name) => getField(body, name)));
  } else {
    let isMarked = false;
    for (const row of rows) {
      //
      // the first payment that pays for a period pays for the one the page
      // showed as due, and each one after it for the period that follows
      //
      const get = (name) =>
        name === 'due_at'
          ? isMarked
            ? formatDate(enterpriseBilling.getNextDueAt(user))
            : getField(body, name)
          : getField(body, `${name}__${row}`);
      let payment;
      try {
        payment = await getPayment(ctx, user, get, true);
        if (
          payment &&
          payments.some(
            (other) =>
              (payment.reference && other.reference === payment.reference) ||
              (other.amount === payment.amount &&
                other.invoice_at.getTime() === payment.invoice_at.getTime())
          )
        )
          throw Boom.badRequest(
            'It has the reference, or the date and amount, of a payment above it'
          );
      } catch (err) {
        if (!err.isBoom) throw err;
        throw Boom.badRequest(`Payment ${row}: ${err.message}`);
      }

      if (!payment) continue;
      if (payment.enterprise_period_due_at) isMarked = true;
      payments.push(payment);
    }

    if (payments.length === 0)
      throw Boom.badRequest('Enter the date received of at least one payment');
  }

  await savePayments(user, payments);

  ctx.logger.info('enterprise payments recorded', {
    admin: ctx.state.user.id,
    user: user.id,
    payments: payments.length
  });

  respond(
    ctx,
    `Recorded ${payments.length} payment${payments.length === 1 ? '' : 's'}`
  );
}

//
// The description of a payment, as the customer sees it on the receipt
// (empty for the usual one, e.g. "One-time payment for a year of the
// Enterprise plan")
//
async function updatePayment(ctx) {
  // (only a payment an admin recorded for this account)
  const user = await getUser(ctx);
  const payment = mongoose.isObjectIdOrHexString(ctx.params.payment_id)
    ? await Payments.findOne({
        _id: ctx.params.payment_id,
        user: user._id,
        method: 'enterprise'
      })
    : null;
  if (!payment) throw Boom.notFound('Payment does not exist');

  const description = getField(ctx.request.body, 'description');
  if (description.length > 200)
    throw Boom.badRequest('Description must be 200 characters or less');

  payment.enterprise_description = description || undefined;
  await payment.save();

  ctx.logger.info('enterprise payment updated', {
    admin: ctx.state.user.id,
    user: String(payment.user)
  });

  respond(ctx);
}

async function removePayment(ctx) {
  const user = await getUser(ctx);

  // (only a payment an admin recorded for this account)
  const payment = mongoose.isObjectIdOrHexString(ctx.params.payment_id)
    ? await Payments.findOne({
        _id: ctx.params.payment_id,
        user: user._id,
        method: 'enterprise'
      })
    : null;
  if (!payment) throw Boom.notFound('Payment does not exist');

  //
  // the period this payment was recorded as paying for is due again (when
  // it is still the one last paid for)
  //
  if (
    _.isDate(payment.enterprise_period_due_at) &&
    _.isDate(user.enterprise_last_paid_at) &&
    payment.enterprise_period_due_at.getTime() ===
      user.enterprise_last_paid_at.getTime()
  )
    user.enterprise_last_paid_at = dayjs
      .utc(payment.enterprise_period_due_at)
      .subtract(1, 'day')
      .toDate();

  await user.save();
  await payment.remove();

  ctx.logger.info('enterprise payment removed', {
    admin: ctx.state.user.id,
    user: user.id,
    amount: payment.amount
  });

  respond(ctx);
}

// enterprise customers that are billed (not banned or removed ones)
const QUERY = {
  is_enterprise: true,
  [config.userFields.isBanned]: { $ne: true },
  [config.userFields.isRemoved]: { $ne: true }
};

//
// All enterprise customers on one sheet, the ones whose payment is due
// first: their settings can be changed and a payment recorded for each,
// and all of it is saved at once.
//
async function list(ctx) {
  // eslint-disable-next-line unicorn/no-array-callback-reference
  const all = await Users.find(QUERY)
    .select(
      `id email is_enterprise enterprise_start_date enterprise_billing_frequency enterprise_billing_amount enterprise_last_paid_at enterprise_notes ${config.passport.fields.displayName} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
    )
    .lean()
    .exec();

  // the last payment of each
  const lastPayments = new Map();
  for (const payment of await Payments.find({
    user: { $in: all.map((user) => user._id) },
    method: 'enterprise'
  })
    .select('user amount invoice_at')
    .sort({ invoice_at: -1 })
    .lean()
    .exec()) {
    if (!lastPayments.has(String(payment.user)))
      lastPayments.set(String(payment.user), payment);
  }

  const now = Date.now();
  const soon = now + ms('7d');
  for (const user of all) {
    user.next_due_at = enterpriseBilling.getNextDueAt(user);
    user.rev = getRevision(user);
    user.last_payment = lastPayments.get(String(user._id));
    const due = user.next_due_at
      ? user.next_due_at.getTime()
      : Number.POSITIVE_INFINITY;
    user.status = due <= now ? 'overdue' : due <= soon ? 'soon' : 'ok';
  }

  const users = _.sortBy(all, [
    (user) =>
      user.next_due_at ? user.next_due_at.getTime() : Number.POSITIVE_INFINITY,
    'email'
  ]);
  const itemCount = users.length;
  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  return ctx.render('admin/enterprise', {
    users: users.slice(ctx.paginate.skip, ctx.paginate.skip + ctx.query.limit),
    counts: {
      overdue: all.filter((user) => user.status === 'overdue').length,
      soon: all.filter((user) => user.status === 'soon').length
    },
    itemCount,
    pageCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });
}

async function updateAll(ctx) {
  const { body } = ctx.request;
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw Boom.badRequest('Invalid request');

  // the rows of the sheet (each has the ID of its customer)
  const ids = [];
  for (const key of Object.keys(body)) {
    const match = REGEX_ROW.exec(key);
    if (match) ids.push(match[1]);
  }

  // (a sheet that was cut short, e.g. by a limit on the fields of a form)
  if (ids.length === 0 || getField(body, 'rows') !== String(ids.length))
    throw Boom.badRequest(
      'The sheet did not arrive whole, reload the page and try again'
    );

  const users = await Users.find({ ...QUERY, _id: { $in: ids } });
  const byId = new Map(users.map((user) => [user.id, user]));

  //
  // every row is checked before anything is saved, so a mistake in one row
  // does not leave the sheet half saved
  //
  const errors = [];
  const changed = [];
  const payments = [];
  for (const id of ids) {
    const user = byId.get(id);
    if (!user) {
      errors.push(
        'A customer on the sheet is no longer an enterprise customer, reload the page and try again'
      );
      continue;
    }

    try {
      const get = (name) => getField(body, `${name}__${id}`);
      assertRevision(user, get('rev'));
      setSettings(user, get, true);

      const payment = await getPayment(ctx, user, get, true);
      if (payment) {
        if (
          payment.reference &&
          payments.some((other) => other.reference === payment.reference)
        )
          throw Boom.badRequest(
            `Reference ${_.escape(payment.reference)} is on the sheet twice`
          );
        payments.push(payment);
      }

      if (user.isModified() || payment) changed.push(user);
    } catch (err) {
      if (!err.isBoom) throw err;
      errors.push(`${_.escape(user.email)}: ${err.message}`);
    }
  }

  // (shown as HTML)
  if (errors.length > 0)
    throw Boom.badRequest(
      `<p class="font-weight-bold text-danger">Nothing was saved:</p><ul class="mb-0 text-left"><li>${errors.join(
        '</li><li>'
      )}</li></ul>`
    );

  const saved = [];
  for (const user of changed) {
    try {
      await savePayments(
        user,
        payments.filter((payment) => payment.user === user._id)
      );
      saved.push(user.email);
    } catch (err) {
      ctx.logger.fatal(err);
      throw Boom.badRequest(
        `<p>Nothing of ${_.escape(user.email)} was saved: ${
          err.isBoom ? err.message : _.escape(err.message)
        }</p><p>Saved before it: ${
          _.escape(saved.join(', ')) || 'none'
        }. Reload the page before trying again.</p>`
      );
    }
  }

  ctx.logger.info('enterprise billing sheet saved', {
    admin: ctx.state.user.id,
    users: changed.map((user) => user.id),
    payments: payments.length
  });

  respond(
    ctx,
    changed.length === 0
      ? 'Nothing was changed'
      : `Saved ${changed.length} customer${
          changed.length === 1 ? '' : 's'
        } and recorded ${payments.length} payment${
          payments.length === 1 ? '' : 's'
        }`
  );
}

module.exports = {
  update,
  createPayment,
  updatePayment,
  removePayment,
  list,
  updateAll,
  getRevision
};
