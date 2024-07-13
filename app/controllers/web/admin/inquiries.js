/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const path = require('node:path');
const process = require('node:process');
const getStream = require('get-stream');
const _ = require('lodash');
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');
const previewEmail = require('preview-email');
const nodemailer = require('nodemailer');
const Axe = require('axe');

const { Inquiries, Users } = require('#models');
const config = require('#config');
const emailHelper = require('#helpers/email');

const transporter = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  logger: new Axe({
    silent: true
  })
});

const USER_SEARCH_PATHS = ['email', 'message'];

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
    // query[config.userFields.isBanned] = false;
    // query[config.userFields.hasVerifiedEmail] = true;
    query.$or.push({ is_resolved: false });
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
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          firstMessage: {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $sortArray: {
                      input: '$messages',
                      sortBy: { created_at: 1 }
                    }
                  },
                  0
                ]
              },
              {
                content: '$text',
                created_at: '$created_at',
                updated_at: '$updated_at'
              }
            ]
          },
          email: { $ifNull: ['$user.email', '$sender_email'] },
          plan: { $ifNull: ['$user.plan', null] }
          // mostRecentMessage: {
          //   $ifNull: [
          //     { $arrayElemAt: [{ $sortArray: { input: '$messages', sortBy: { created_at: 1 } } }, -1] },
          //     { content: '$message', created_at: '$created_at', updated_at: '$updated_at' }
          //   ]
          // }
        }
      },
      {
        $project: {
          id: 1,
          message: { $ifNull: ['$message', '$firstMessage.text'] },
          created_at: 1,
          updated_at: 1,
          reference: 1,
          email: 1,
          plan: 1
        }
      },
      { $match: query },
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
  const emailTemplatePath = path.join(
    process.cwd(),
    'app/views/admin/inquiries/custom-email-previews.pug'
  );

  ctx.state.result = await Inquiries.findById(ctx.params.id);
  ctx.state.messages = await Promise.all(
    ctx.state.result.messages.map(async (message) => {
      message.html = await previewEmail(message.raw, {
        template: emailTemplatePath,
        ...config.previewEmailOptions
      });
      return message;
    })
  );

  if (!ctx.state.messages)
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
  if (!user) {
    ctx.logger.warn('no user found, trying sender_email');
    if (!inquiry.sender_email)
      throw Boom.notFound(ctx.translateError('INVALID_USER'));
  }

  // rely on historical user.email or fall back to newer sender_email
  // for those sending direct emails instead of creating an inquiry
  const email = user?.email ?? inquiry.sender_email;

  const { body, files } = ctx.request;

  const resolvedAttachments = await Promise.all(
    files?.attachments.map(async (attachment) => {
      const content = await getStream.buffer(attachment.stream);
      return {
        filename: attachment.originalName,
        content,
        content_type: attachment.detectedMimeType,
        size: Buffer.byteLength(content)
      };
    })
  );

  const lastMessageIndex = inquiry.messages.length - 1;
  const lastMessage = inquiry.messages[lastMessageIndex];

  // https://github.com/nodemailer/nodemailer/issues/1312#issuecomment-891237590
  const info = await emailHelper({
    template: 'inquiry-response',
    message: {
      to: email,
      cc: config.email.message.from,
      inReplyTo: lastMessage.reference,
      references: lastMessage.reference,
      subject: inquiry.subject,
      attachments: resolvedAttachments
    },
    locals: {
      user: { email },
      inquiry,
      response: { message: body?.message }
    }
  });

  const raw = await transporter.sendMail(info.originalMessage);
  inquiry.messages.push({ raw: raw.message });

  await inquiry.save();

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
      if (!user) {
        ctx.logger.warn('no user found, trying sender_email');
        if (!inquiry.sender_email)
          throw Boom.notFound(ctx.translateError('INVALID_USER'));
      }

      // rely on historical user.email or fall back to newer sender_email
      // for those sending direct emails instead of creating an inquiry
      const email = user?.email ?? inquiry.sender_email;

      // if the user has multiple inquiries and we've just responded
      // in bulk to a previous message then let's skip the email
      if (!repliedTo.has(email)) {
        // eslint-disable-next-line no-await-in-loop
        const info = await emailHelper({
          template: 'inquiry-response',
          message: {
            to: email,
            cc: config.email.message.from,
            inReplyTo: inquiry?.messages[inquiry.messages.length - 1] || '',
            references: inquiry.references,
            subject: inquiry.subject
          },
          locals: {
            user: { email },
            inquiry,
            response: { message }
          }
        });

        // eslint-disable-next-line no-await-in-loop
        const raw = await transporter.sendMail(info?.originalMessage);
        inquiry.messages.push({ raw: raw.message });
        // eslint-disable-next-line no-await-in-loop
        await inquiry.save();

        repliedTo.add(email);
      }
    }
  } catch (err) {
    ctx.logger.error(err);
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
