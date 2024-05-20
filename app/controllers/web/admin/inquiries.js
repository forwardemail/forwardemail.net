/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');

const { Inquiries, Users } = require('#models');
const config = require('#config');
const emailHelper = require('#helpers/email');

async function list(ctx) {
  let query = { $or: [] };

  let $sort = { created_at: -1 };
  if (ctx.query.sort) {
    const order = ctx.query.sort.startsWith('-') ? -1 : 1;
    $sort = {
      [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
    };
  }

  query.$or.push({ is_resolved: false });

  if (isSANB(ctx.query.mongodb_query)) {
    try {
      query = parser.parseFilter(ctx.query.mongodb_query);
      if (!query || Object.keys(query).length === 0)
        throw new Error('Query was not parsed propery');
    } catch (err) {
      ctx.logger.warn(err);
      return ctx.throw(Boom.badRequest(err.message));
    }
  }

  const [inquiries, itemCount] = await Promise.all([
    Inquiries.aggregate([
      {
        $match: {
          ...query
        }
      },
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
          'user.email': { $regex: String(ctx.query.q || ''), $options: 'i' }
        }
      },
      {
        $project: {
          id: 1,
          message: 1,
          created_at: 1,
          updated_at: 1,
          email: '$user.email',
          plan: '$user.plan'
        }
      },
      {
        $sort
      },
      {
        $skip: ctx.paginate.skip
      },
      {
        $limit: ctx.query.limit
      }
    ]).exec(),
    Inquiries.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/inquiries', {
      inquiries,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/inquiries/_table', {
    inquiries,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.result = await Inquiries.findById(ctx.params.id);
  if (!ctx.state.result)
    throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));
  return ctx.render('admin/inquiries/retrieve');
}

async function resolve(ctx) {
  const inquiry = await Inquiries.findById(ctx.params.id);
  if (!inquiry) throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));

  await Inquiries.findByIdAndUpdate(inquiry._id, {
    $set: { is_resolved: true }
  });

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

async function reply(ctx) {
  const inquiry = await Inquiries.findById(ctx.params.id);
  if (!inquiry) throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));

  const user = await Users.findById(inquiry.user);
  if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

  const { message } = ctx.request.body;

  await emailHelper({
    template: 'inquiry-response',
    message: {
      to: user[config.userFields.fullEmail],
      cc: config.email.message.from,
      inReplyTo: inquiry.references[0],
      references: inquiry.references,
      subject: inquiry.subject
    },
    locals: {
      user: user.toObject(),
      inquiry,
      response: { message }
    }
  });

  await Inquiries.findByIdAndUpdate(inquiry._id, {
    $set: { is_resolved: true }
  });

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

async function bulkReply(ctx) {
  const { ids, message } = ctx.request.body;

  const repliedTo = new Set();

  try {
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      const inquiry = await Inquiries.findById(id);
      if (!inquiry) throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));

      // eslint-disable-next-line no-await-in-loop
      const user = await Users.findById(inquiry.user);
      if (!user) throw Boom.notFound(ctx.translateError('INVALID_USER'));

      // if the user has multiple inquiries and we've just responded
      // in bulk to a previous message then let's skip the email
      if (!repliedTo.has(user)) {
        // eslint-disable-next-line no-await-in-loop
        await emailHelper({
          template: 'inquiry-response',
          message: {
            to: user[config.userFields.fullEmail],
            cc: config.email.message.from,
            inReplyTo: inquiry.references[0],
            references: inquiry.references,
            subject: inquiry.subject
          },
          locals: {
            user: user.toObject(),
            inquiry,
            response: { message }
          }
        });
      }

      // eslint-disable-next-line no-await-in-loop
      await Inquiries.findByIdAndUpdate(inquiry._id, {
        $set: { is_resolved: true }
      });

      repliedTo.add(user);
    }
  } catch {
    throw Boom.badImplementation(
      ctx.translateError('INQUIRY_RESPONSE_BULK_REPLY_ERROR')
    );
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: `Successfully replied to ${repliedTo.size} inquiries!`,
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

module.exports = { list, retrieve, resolve, reply, bulkReply };
