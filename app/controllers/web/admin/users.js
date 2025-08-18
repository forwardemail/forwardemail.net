/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const bytes = require('@forwardemail/bytes');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');
const { boolean } = require('boolean');
const _ = require('#helpers/lodash');

const { Users, Emails } = require('#models');
const config = require('#config');

const REGEX_BYTES = new RE2(/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i);

const USER_SEARCH_PATHS = [
  'email',
  config.passport.fields.givenName,
  config.passport.fields.familyName
];

async function list(ctx) {
  let query = {};

  if (ctx.query.q) {
    query = { $or: [] };

    for (const field of USER_SEARCH_PATHS) {
      query.$or.push(
        { [field]: { $regex: ctx.query.q, $options: 'i' } },
        { [field]: { $regex: _.escapeRegExp(ctx.query.q), $options: 'i' } }
      );
    }

    // filter for non-banned and verified users
    query[config.userFields.isBanned] = false;
    query[config.userFields.hasVerifiedEmail] = true;
  }

  if (isSANB(ctx.query.mongodb_query)) {
    try {
      query = parser.parseFilter(ctx.query.mongodb_query);
      if (!query || Object.keys(query).length === 0)
        throw new Error('Query was not parsed propery');
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  const now = new Date();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const seventyTwoHoursAgo = new Date(now - 72 * 60 * 60 * 1000);

  const [users, itemCount, emailCounts] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Users.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .lean()
      .sort(ctx.query.sort || '-created_at')
      .exec(),
    Users.countDocuments(query),
    // Get SMTP outbound email counts per user with time-based breakdowns
    Emails.aggregate([
      {
        $match: {
          // Only count delivered/sent emails (not failed/bounced)
          status: { $in: ['delivered', 'deferred', 'sent'] }
        }
      },
      {
        $group: {
          _id: '$user',
          totalEmails: { $sum: 1 },
          lastEmailAt: { $max: '$created_at' },
          // Count emails within time periods
          emailsLast1Hour: {
            $sum: {
              $cond: [{ $gte: ['$created_at', oneHourAgo] }, 1, 0]
            }
          },
          emailsLast24Hours: {
            $sum: {
              $cond: [{ $gte: ['$created_at', twentyFourHoursAgo] }, 1, 0]
            }
          },
          emailsLast72Hours: {
            $sum: {
              $cond: [{ $gte: ['$created_at', seventyTwoHoursAgo] }, 1, 0]
            }
          }
        }
      }
    ])
  ]);

  // Create a map for quick lookup of email counts
  const emailCountMap = new Map();
  for (const count of emailCounts) {
    emailCountMap.set(count._id.toString(), {
      totalEmails: count.totalEmails,
      lastEmailAt: count.lastEmailAt,
      emailsLast1Hour: count.emailsLast1Hour,
      emailsLast24Hours: count.emailsLast24Hours,
      emailsLast72Hours: count.emailsLast72Hours
    });
  }

  // Add email counts to each user
  const usersWithEmailCounts = users.map((user) => ({
    ...user,
    totalEmails: emailCountMap.get(user._id.toString())?.totalEmails || 0,
    lastEmailAt: emailCountMap.get(user._id.toString())?.lastEmailAt || null,
    emailsLast1Hour:
      emailCountMap.get(user._id.toString())?.emailsLast1Hour || 0,
    emailsLast24Hours:
      emailCountMap.get(user._id.toString())?.emailsLast24Hours || 0,
    emailsLast72Hours:
      emailCountMap.get(user._id.toString())?.emailsLast72Hours || 0
  }));

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/users', {
      users: usersWithEmailCounts,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/users/_table', {
    users: usersWithEmailCounts,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.result = await Users.findById(ctx.params.id);
  if (!ctx.state.result)
    throw Boom.notFound(ctx.translateError('INVALID_USER'));
  return ctx.render('admin/users/retrieve');
}

async function update(ctx) {
  const user = await Users.findById(ctx.params.id);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));
  const { body } = ctx.request;

  if (body[config.passport.fields.givenName])
    user[config.passport.fields.givenName] =
      body[config.passport.fields.givenName];

  if (body[config.passport.fields.familyName])
    user[config.passport.fields.familyName] =
      body[config.passport.fields.familyName];

  if (body[config.passport.fields.otpEnabled])
    user[config.passport.fields.otpEnabled] =
      body[config.passport.fields.otpEnabled];

  if (
    body[config.passport.fields.otpEnabled] &&
    boolean(!body[config.passport.fields.otpEnabled])
  )
    user[config.userFields.pendingRecovery] = false;

  if (body.email) user.email = body.email;

  if (body.group) user.group = body.group;

  if (isSANB(body.has_passed_kyc))
    user.has_passed_kyc = boolean(body.has_passed_kyc);

  if (body.max_quota_per_alias) {
    // validate `body.max_quota_per_alias_per_alias` if a value was passed
    if (
      typeof body.max_quota_per_alias !== 'undefined' &&
      typeof body.max_quota_per_alias !== 'string'
    )
      throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));

    // indicates reset of the value
    if (body.max_quota_per_alias === '') {
      user.max_quota_per_alias = Number.isFinite(
        ctx.state.domain.max_quota_per_alias
      )
        ? ctx.state.domain.max_quota_per_alias
        : config.maxQuotaPerAlias;
    } else if (typeof body.max_quota_per_alias === 'string') {
      // test against bytes regex
      if (!REGEX_BYTES.test(body.max_quota_per_alias))
        throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));
      // otherwise convert the value
      user.max_quota_per_alias = bytes(body.max_quota_per_alias);
    }
  }

  if (body.smtp_limit) user.smtp_limit = body.smtp_limit;

  await user.save();

  if (user.id === ctx.state.user.id) await ctx.login(user);

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function remove(ctx) {
  const user = await Users.findById(ctx.params.id);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));
  // instead of removing the user entirely we just ban them
  user[config.userFields.isBanned] = true;
  await user.save();
  // clear banned cache
  ctx.client
    .del('banned_user_ids')
    .then()
    .catch((err) => ctx.logger.fatal(err));
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function login(ctx) {
  const user = await Users.findById(ctx.params.id);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

  // store a reference to the session ID so we can clean it up on user model
  const { sessionId } = ctx;
  const userId = ctx.state.user._id;

  ctx.logout();

  await ctx.login(user);

  // remove from the user session array the matching value
  // (from the admin's session list)
  Users.findByIdAndUpdate(userId, {
    $pullAll: {
      sessions: [sessionId]
    }
  })
    .then()
    .catch((err) => ctx.logger.fatal(err));

  if (user[config.passport.fields.otpEnabled] && ctx.session) {
    ctx.session.otp_remember_me = false;
    ctx.session.otp = 'totp';
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/');
  else ctx.body = { redirectTo: '/' };
}

module.exports = { list, retrieve, update, remove, login };
