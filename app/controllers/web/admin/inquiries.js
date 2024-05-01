/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const paginate = require('koa-ctx-paginate');

const { Inquiries, Users } = require('#models');
const config = require('#config');
const email = require('#helpers/email');

async function list(ctx) {
  let $sort = { created_at: -1 };
  if (ctx.query.sort) {
    const order = ctx.query.sort.startsWith('-') ? -1 : 1;
    $sort = {
      [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
    };
  }

  const [inquiries, itemCount] = await Promise.all([
    Inquiries.aggregate([
      {
        $match: {
          $or: [{ is_resolved: { $exists: false } }, { is_resolved: false }]
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
    Inquiries.countDocuments()
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

async function remove(ctx) {
  const inquiry = await Inquiries.findById(ctx.params.id);
  if (!inquiry) throw Boom.notFound(ctx.translateError('INVALID_INQUIRY'));

  await Inquiries.deleteOne({ _id: inquiry.id });

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

  await email({
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

  await Inquiries.findOneAndUpdate(
    { id: inquiry.id },
    {
      $set: { is_resolved: true }
    }
  );

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
        await email({
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
      await Inquiries.findOneAndUpdate(
        { id: inquiry.id },
        {
          $set: { is_resolved: true }
        }
      );

      repliedTo.add(user);
    }
  } catch (err) {
    ctx.flash('error', `Error replying: ${err.message}`);
    return;
  }

  if (ctx.accepts('html')) ctx.redirect('/admin/inquiries');
  else ctx.body = { redirectTo: '/admin/inquiries' };
}

module.exports = { list, retrieve, remove, reply, bulkReply };
