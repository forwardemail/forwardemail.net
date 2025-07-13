/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');
const _ = require('#helpers/lodash');

const { Users, Domains, Payments, EnterpriseAccounts } = require('#models');
const config = require('#config');

const ENTERPRISE_SEARCH_PATHS = [
  'company_name',
  'primary_contact.name',
  'primary_contact.email'
];

async function list(ctx) {
  let query = {};

  // Base query for enterprise accounts
  const baseQuery = {};

  if (ctx.query.q) {
    const searchOr = [];

    // Search in enterprise account fields
    for (const field of ENTERPRISE_SEARCH_PATHS) {
      searchOr.push(
        { [field]: { $regex: ctx.query.q, $options: 'i' } },
        { [field]: { $regex: _.escapeRegExp(ctx.query.q), $options: 'i' } }
      );
    }

    // Search in domains (for domain name search)
    const domainResults = await Domains.find({
      name: { $regex: ctx.query.q, $options: 'i' }
    })
      .select('members.user')
      .lean();

    const userIdsFromDomains = [];
    for (const domain of domainResults) {
      for (const member of domain.members) {
        if (member.user) userIdsFromDomains.push(member.user);
      }
    }

    if (userIdsFromDomains.length > 0) {
      searchOr.push({ user: { $in: userIdsFromDomains } });
    }

    if (searchOr.length > 0) {
      query.$or = searchOr;
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
          ? { $and: [baseQuery, query, mongoQuery] }
          : { $and: [baseQuery, mongoQuery] };
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  } else {
    query =
      ctx.query.q && Object.keys(query).length > 0
        ? { $and: [baseQuery, query] }
        : baseQuery;
  }

  const results = await EnterpriseAccounts.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'domains',
        localField: 'user._id',
        foreignField: 'members.user',
        as: 'domains'
      }
    },
    {
      $lookup: {
        from: 'payments',
        localField: 'user._id',
        foreignField: 'user',
        as: 'payments'
      }
    },
    {
      $addFields: {
        domainCount: { $size: '$domains' },
        userCount: {
          $reduce: {
            input: '$domains',
            initialValue: 0,
            in: {
              $add: ['$$value', { $size: { $ifNull: ['$$this.members', []] } }]
            }
          }
        },
        aliasCount: {
          $reduce: {
            input: '$domains',
            initialValue: 0,
            in: {
              $add: ['$$value', { $size: { $ifNull: ['$$this.aliases', []] } }]
            }
          }
        },
        lastPayment: {
          $arrayElemAt: [
            { $sortArray: { input: '$payments', sortBy: { created_at: -1 } } },
            0
          ]
        },
        totalRevenue: { $sum: '$payments.amount' }
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

  const enterprises = results[0].data;
  const itemCount = results[0].count;

  const pageCount = Math.ceil(
    (itemCount[0]?.count || 0) / (ctx.paginate.limit || 50)
  );

  if (
    ctx.accepts('html') &&
    !ctx.request.header.accept.includes('application/json')
  ) {
    return ctx.render('admin/enterprise/index', {
      enterprises,
      pageCount,
      itemCount: itemCount[0]?.count || 0,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/enterprise/_table', {
    enterprises,
    pageCount,
    itemCount: itemCount[0]?.count || 0,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function dashboard(ctx) {
  try {
    // Get enterprise metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const enterpriseQuery = {
      $or: [
        { plan: 'enterprise' },
        { plan: 'team' },
        { plan: 'enhanced_protection' }
      ],
      [config.userFields.isBanned]: false,
      [config.userFields.hasVerifiedEmail]: true
    };

    const [
      totalEnterprise,
      newEnterpriseThisMonth,
      enterpriseRevenue,
      enterprisePayments
    ] = await Promise.all([
      Users.countDocuments(enterpriseQuery),
      Users.countDocuments({
        ...enterpriseQuery,
        created_at: { $gte: thirtyDaysAgo }
      }),
      Payments.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $match: {
            'user.plan': { $in: ['enterprise', 'team', 'enhanced_protection'] },
            'user.is_banned': false,
            'user.has_verified_email': true
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),
      Payments.find({})
        .populate({
          path: 'user',
          match: {
            plan: { $in: ['enterprise', 'team', 'enhanced_protection'] },
            is_banned: false,
            has_verified_email: true
          }
        })
        .sort({ created_at: -1 })
        .limit(10)
        .lean()
        .exec()
    ]);

    // Filter out payments where user was null after populate
    const filteredPayments = enterprisePayments.filter(
      (payment) => payment.user
    );

    // Calculate growth rate
    const previousMonthStart = new Date(
      thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const previousMonthEnterprise = await Users.countDocuments({
      ...enterpriseQuery,
      created_at: { $gte: previousMonthStart, $lt: thirtyDaysAgo }
    });

    const growthRate =
      previousMonthEnterprise > 0
        ? (
            ((newEnterpriseThisMonth - previousMonthEnterprise) /
              previousMonthEnterprise) *
            100
          ).toFixed(1)
        : 0;

    const revenueData = enterpriseRevenue[0] || { total: 0, count: 0 };

    if (ctx.accepts('html')) {
      return ctx.render('admin/enterprise/dashboard', {
        totalEnterprise,
        newEnterpriseThisMonth,
        growthRate,
        totalRevenue: revenueData.total,
        revenueCount: revenueData.count,
        averageRevenue:
          revenueData.count > 0 ? revenueData.total / revenueData.count : 0,
        recentPayments: filteredPayments
      });
    }

    ctx.body = {
      totalEnterprise,
      newEnterpriseThisMonth,
      growthRate,
      totalRevenue: revenueData.total,
      revenueCount: revenueData.count,
      averageRevenue:
        revenueData.count > 0 ? revenueData.total / revenueData.count : 0
    };
  } catch (err) {
    ctx.logger.error(err);
    throw Boom.badRequest(ctx.translateError('DASHBOARD_ERROR'));
  }
}

async function retrieve(ctx) {
  // Get enterprise account by ID
  const enterpriseAccount = await EnterpriseAccounts.findById(ctx.params.id)
    .populate('user', 'email plan created_at has_verified_email is_banned')
    .lean()
    .exec();

  if (!enterpriseAccount) {
    throw Boom.notFound(
      ctx.translateError('ENTERPRISE_ACCOUNT_DOES_NOT_EXIST')
    );
  }

  if (ctx.accepts('html')) {
    return ctx.render('admin/enterprise/account', {
      enterpriseAccount
    });
  }

  ctx.body = {
    enterpriseAccount
  };
}

async function update(ctx) {
  const enterpriseAccount = await EnterpriseAccounts.findById(ctx.params.id);

  if (!enterpriseAccount) {
    throw Boom.notFound(
      ctx.translateError('ENTERPRISE_ACCOUNT_DOES_NOT_EXIST')
    );
  }

  // Update allowed fields
  const allowedFields = ['company_name', 'website', 'primary_contact'];

  for (const field of allowedFields) {
    if (ctx.request.body[field] !== undefined) {
      enterpriseAccount[field] = ctx.request.body[field];
    }
  }

  await enterpriseAccount.save();

  const message = ctx.translate('ENTERPRISE_ACCOUNT_UPDATED');
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

async function convert(ctx) {
  try {
    const { email, company_name, primary_contact_name } = ctx.request.body;

    // Validate required fields
    if (!email || !company_name || !primary_contact_name) {
      throw Boom.badRequest(
        ctx.translateError('CONVERT_ENTERPRISE_REQUIRED_FIELDS')
      );
    }

    // Find the user to convert
    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw Boom.notFound(ctx.translateError('USER_DOES_NOT_EXIST'));
    }

    // Check if user has appropriate plan for enterprise conversion
    if (!['team', 'enhanced_protection', 'enterprise'].includes(user.plan)) {
      throw Boom.badRequest(
        ctx.translateError('USER_MUST_HAVE_TEAM_OR_ENHANCED_PLAN')
      );
    }

    // Check if already has enterprise account
    const existingEnterprise = await EnterpriseAccounts.findOne({
      user: user._id
    });
    if (existingEnterprise) {
      throw Boom.badRequest(ctx.translateError('USER_ALREADY_HAS_ENTERPRISE'));
    }

    // Create enterprise account for existing user
    const enterpriseAccountData = {
      user: user._id,
      company_name,
      primary_contact: {
        name: primary_contact_name,
        email: email.toLowerCase()
      }
    };

    const enterpriseAccount = await EnterpriseAccounts.create(
      enterpriseAccountData
    );

    // Update user plan to enterprise
    user.plan = 'enterprise';
    await user.save();

    const message = ctx.translate('ENTERPRISE_ACCOUNT_CONVERTED');
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
      ctx.redirect(`/admin/enterprise/accounts/${enterpriseAccount._id}`);
    } else {
      ctx.body = { message, enterpriseAccount };
    }
  } catch (err) {
    // Re-throw validation errors so they show specific messages
    if (err.isBoom) {
      throw err;
    }

    // Log and throw generic error for unexpected errors
    ctx.logger.error(err);
    throw Boom.badRequest(ctx.translateError('CONVERT_ENTERPRISE_ERROR'));
  }
}

async function remove(ctx) {
  const enterpriseAccount = await EnterpriseAccounts.findById(ctx.params.id);

  if (!enterpriseAccount) {
    throw Boom.notFound(
      ctx.translateError('ENTERPRISE_ACCOUNT_DOES_NOT_EXIST')
    );
  }

  // Soft delete by setting is_active to false
  enterpriseAccount.is_active = false;
  await enterpriseAccount.save();

  const message = ctx.translate('ENTERPRISE_ACCOUNT_REMOVED');
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
    ctx.redirect('/admin/enterprise');
  } else {
    ctx.body = { message };
  }
}

module.exports = {
  list,
  retrieve,
  dashboard,
  convert,
  update,
  remove
};
