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
const { Domains, Payments, Users } = require('#models');

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
      if (!mongoQuery || Object.keys(mongoQuery).length === 0) {
        throw new Error('Query was not parsed properly');
      }

      query =
        ctx.query.q && Object.keys(query).length > 0
          ? { $and: [query, mongoQuery] }
          : mongoQuery;
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  // OPTIMIZATION: Get count separately (faster than $facet)
  // This avoids counting after the expensive $lookup
  const itemCount = await Payments.countDocuments(query);

  // OPTIMIZATION: Paginate FIRST, then join
  // This dramatically reduces the number of $lookup operations
  const payments = await Payments.aggregate([
    { $match: query },
    { $sort },
    { $skip: ctx.paginate.skip },
    { $limit: ctx.paginate.limit || 50 },
    // Now $lookup only happens on the paginated subset (e.g., 50 records instead of 100,000)
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
    }
  ]);

  const pageCount = Math.ceil(itemCount / (ctx.paginate.limit || 50));

  if (
    ctx.accepts('html') &&
    !ctx.request.header.accept.includes('application/json')
  ) {
    return ctx.render('admin/payments', {
      payments,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/payments/_table', {
    payments,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  const payment = await Payments.findById(ctx.params.id)
    .populate('user', 'email plan')
    .lean()
    .exec();

  if (!payment) {
    throw Boom.notFound('Payment does not exist');
  }

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
  if (!payment) {
    throw Boom.notFound('Payment does not exist');
  }

  // Check if already refunded
  if (payment.amount_refunded > 0) {
    throw Boom.badRequest('Payment already refunded');
  }

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

  if (!isSANB(email)) {
    throw Boom.badRequest('Invalid email');
  }

  if (!PAYMENT_DURATIONS.has(duration)) {
    throw Boom.badRequest('Invalid duration');
  }

  // Convert to milliseconds using ms() function (like main billing controller)
  const durationMs = ms(duration);

  // Validate against allowed durations
  if (!config.validDurations.includes(durationMs)) {
    throw Boom.badRequest('Invalid request');
  }

  duration = durationMs;

  const user = await Users.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw Boom.notFound('User does not exist');
  }

  //
  // enforce that the granted plan matches the user's domains:
  // if the user is an admin on any domain whose plan is higher
  // than the selected plan, reject and tell the admin which plan
  // is required (e.g. "team" domains need a "team" credit)
  //
  // plan hierarchy: team (2) > enhanced_protection (1) > free (0)
  //
  const PLAN_TIER = { free: 0, enhanced_protection: 1, team: 2 };

  // build a list of plans that are strictly above the selected plan
  const higherPlans = Object.keys(PLAN_TIER).filter(
    (p) => PLAN_TIER[p] > (PLAN_TIER[plan] || 0)
  );

  if (higherPlans.length > 0) {
    const higherDomain = await Domains.findOne({
      'members.user': user._id,
      'members.group': 'admin',
      plan: { $in: higherPlans }
    })
      .select('plan name')
      .lean()
      .exec();

    if (higherDomain) {
      throw Boom.badRequest(
        `User is an admin on the domain "${higherDomain.name}" which requires the "${higherDomain.plan}" plan. ` +
          `Free credit must be granted for the "${higherDomain.plan}" plan instead of "${plan}".`
      );
    }
  }

  //
  // only reset plan_set_at if the user is changing plans
  // (do not reset when granting additional credit for the same plan)
  //
  if (user.plan === 'free' || user.plan !== plan) {
    user.plan_set_at = dayjs().startOf('day').toDate();
  }

  user.plan = plan;

  // Create the payment record BEFORE saving the user so that the
  // pre-save hook (which recalculates plan_expires_at from payments)
  // sees the new payment and computes the correct expiry date.
  await Payments.create({
    user: user._id,
    plan,
    duration,
    amount: 0,
    invoice_at: dayjs().startOf('day').toDate(),
    method: 'free_beta_program',
    kind: 'one-time'
  });

  // Save the user (the pre-save hook recalculates plan_expires_at from payments)
  await user.save();

  // Send free credit email to the user
  const durationMapping = config.durationMapping[duration.toString()];
  const durationFormatted = durationMapping
    ? `${durationMapping[0]} ${durationMapping[1]}`
    : dayjs.duration(duration, 'milliseconds').humanize();

  const message = `Free credit granted successfully to ${email} for ${plan} plan (${durationFormatted} duration)`;

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
