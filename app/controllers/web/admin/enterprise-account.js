/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');
const _ = require('#helpers/lodash');

const { EnterpriseAccounts } = require('#models');

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

  ctx.state.enterpriseAccount = enterpriseAccount;

  if (ctx.accepts('html')) {
    return ctx.render('admin/enterprise/account');
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

  // Update allowed fields for simplified form
  const allowedFields = ['company_name', 'company_address', 'is_active'];

  for (const field of allowedFields) {
    if (ctx.request.body[field] !== undefined) {
      if (field === 'is_active') {
        // Handle checkbox value - convert to boolean
        enterpriseAccount[field] = Boolean(ctx.request.body[field]);
      } else {
        enterpriseAccount[field] = ctx.request.body[field];
      }
    }
  }

  await enterpriseAccount.save();

  if (ctx.accepts('html')) {
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('ENTERPRISE_ACCOUNT_UPDATED'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    return ctx.redirect('back');
  }

  ctx.body = { message: ctx.translate('ENTERPRISE_ACCOUNT_UPDATED') };
}

async function list(ctx) {
  let query = {};

  // Search functionality
  if (ctx.query.q) {
    const searchOr = [];
    const searchFields = [
      'company_name',
      'primary_contact.name',
      'primary_contact.email'
    ];

    for (const field of searchFields) {
      searchOr.push(
        { [field]: { $regex: ctx.query.q, $options: 'i' } },
        { [field]: { $regex: _.escapeRegExp(ctx.query.q), $options: 'i' } }
      );
    }

    if (searchOr.length > 0) {
      query.$or = searchOr;
    }
  }

  // MongoDB query parsing
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

  const [enterpriseAccounts, itemCount] = await Promise.all([
    EnterpriseAccounts.find(query || {})
      .populate('user', 'email plan created_at')
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .lean()
      .exec(),
    EnterpriseAccounts.countDocuments(query || {})
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html')) {
    return ctx.render('admin/enterprise/accounts', {
      enterpriseAccounts,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });
  }

  const table = await ctx.render('admin/enterprise/accounts/_table', {
    enterpriseAccounts,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
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
    ctx.redirect('/admin/enterprise/accounts');
  } else {
    ctx.body = { message };
  }
}

module.exports = {
  list,
  retrieve,
  update,
  remove
};
