/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');

const _ = require('#helpers/lodash');
const config = require('#config');
const refundHelper = require('#helpers/refund');
const { Payments, Users } = require('#models');

const { PAYMENT_DURATIONS } = config.payments;

const PAYMENT_SEARCH_PATHS = [
  'reference',
  'stripe_payment_intent_id',
  'paypal_transaction_id'
];

const PAYMENT_ENUM_FIELDS = ['currency', 'method', 'plan', 'kind'];

async function list(ctx) {
  let query = {};

  if (ctx.query.q) {
    query = { $or: [] };

    // Search in string payment fields
    for (const field of PAYMENT_SEARCH_PATHS) {
      query.$or.push(
        { [field]: { $regex: ctx.query.q, $options: 'i' } },
        { [field]: { $regex: _.escapeRegExp(ctx.query.q), $options: 'i' } }
      );
    }

    // Search in enum/categorical fields with exact matches (faster than regex)
    for (const field of PAYMENT_ENUM_FIELDS) {
      // Try exact match first (case-insensitive)
      const exactMatch = ctx.query.q.toLowerCase();
      query.$or.push(
        { [field]: exactMatch },
        { [field]: { $regex: ctx.query.q, $options: 'i' } }
      );
    }

    // Search by user email - optimized query
    const users = await Users.find({
      email: { $regex: ctx.query.q, $options: 'i' }
    })
      .select('_id')
      .lean()
      .exec();

    if (users.length > 0) {
      query.$or.push({ user: { $in: users.map((u) => u._id) } });
    }

    // Ensure we have at least one search condition
    if (query.$or.length === 0) {
      query = {}; // Reset to empty query if no search conditions
    }
  }

  let $sort = { created_at: -1 };
  if (ctx.query.sort) {
    const order = ctx.query.sort.startsWith('-') ? -1 : 1;
    $sort = {
      [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
    };
  }

  if (isSANB(ctx.query.mongodb_query)) {
    try {
      const mongoQuery = parser.parseFilter(ctx.query.mongodb_query);
      if (!mongoQuery || Object.keys(mongoQuery).length === 0)
        throw new Error('Query was not parsed properly');

      query =
        ctx.query.q && Object.keys(query).length > 0
          ? { $and: [query, mongoQuery] }
          : mongoQuery;
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  const results = await Payments.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        pipeline: [
          { $project: { email: 1, plan: 1 } } // Only select needed fields
        ],
        as: 'user'
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ['$user', 0] } // More efficient than $unwind
      }
    },
    {
      $facet: {
        data: [
          { $sort },
          { $skip: ctx.paginate.skip },
          { $limit: ctx.paginate.limit || 50 }
        ],
        count: [{ $count: 'count' }]
      }
    }
  ]);

  const payments = results[0].data;
  const itemCount = results[0].count;

  const pageCount = Math.ceil(
    (itemCount[0]?.count || 0) / (ctx.paginate.limit || 50)
  );

  if (
    ctx.accepts('html') &&
    !ctx.request.header.accept.includes('application/json')
  ) {
    return ctx.render('admin/payments', {
      payments,
      pageCount,
      itemCount: itemCount[0]?.count || 0,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/payments/_table', {
    payments,
    pageCount,
    itemCount: itemCount[0]?.count || 0,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  const payment = await Payments.findById(ctx.params.id)
    .populate('user', 'email plan')
    .lean()
    .exec();

  if (!payment) throw Boom.notFound('Payment does not exist');

  // Fetch other payments for the same user (excluding current payment)
  const userPayments = payment.user
    ? await Payments.find({
        user: payment.user._id,
        _id: { $ne: payment._id }
      })
        .sort({ created_at: -1 })
        .limit(10)
        .lean()
        .exec()
    : [];

  // Format duration for display
  let durationFormatted = null;
  if (payment.duration) {
    const durationMapping =
      config.durationMapping?.[payment.duration.toString()];
    durationFormatted = `${durationMapping[0]} ${durationMapping[1]}`;
  }

  await ctx.render('admin/payments/retrieve', {
    payment,
    durationFormatted,
    userPayments
  });
}

async function refund(ctx) {
  const payment = await Payments.findById(ctx.params.id).populate('user');
  if (!payment) throw Boom.notFound('Payment does not exist');

  // Check if already refunded
  if (payment.amount_refunded > 0)
    throw Boom.badRequest('Payment already refunded');

  // Use existing refund helper
  await refundHelper(payment._id);

  const message = ctx.translate('PAYMENT_REFUNDED');
  if (ctx.accepts('html')) {
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: message,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    ctx.redirect('back');
  } else {
    ctx.body = { message };
  }
}

async function freeCredit(ctx) {
  let { email, plan, duration } = ctx.request.body;

  if (!isSANB(email)) throw Boom.badRequest('Invalid email');

  if (!PAYMENT_DURATIONS.has(duration))
    throw Boom.badRequest('Invalid duration');

  // Convert to milliseconds using ms() function (like main billing controller)
  const durationMs = ms(duration);

  // Validate against allowed durations
  if (!config.validDurations.includes(durationMs))
    throw Boom.badRequest('Invalid request');

  duration = durationMs;

  const user = await Users.findOne({ email: email.toLowerCase() });
  if (!user) throw Boom.notFound('User does not exist');

  if (user.plan === 'free' || user.plan !== plan)
    user.plan_set_at = dayjs().startOf('day').toDate();

  user.plan = plan;
  await user.save();

  // Create a payment record for tracking
  await Payments.create({
    user: user._id,
    plan,
    duration,
    amount: 0,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    kind: 'one-time'
  });

  // Save the user so their plan expires at gets updated
  await user.save();

  // Send free credit email to the user
  const durationMapping = config.durationMapping[duration.toString()];
  const durationFormatted = durationMapping
    ? `${durationMapping[0]} ${durationMapping[1]}`
    : dayjs.duration(duration, 'milliseconds').humanize();

  const message = ctx.translate(
    'FREE_CREDIT_GRANTED',
    email,
    plan,
    durationFormatted
  );

  if (ctx.accepts('html')) {
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: message,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    ctx.redirect('back');
  } else {
    ctx.body = { message };
  }
}

module.exports = {
  list,
  retrieve,
  refund,
  freeCredit
};
