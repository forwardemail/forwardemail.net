/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');
const paginate = require('koa-ctx-paginate');
const parseErr = require('parse-err');
const previewEmail = require('preview-email');

const config = require('#config');
const Emails = require('#models/emails');
const createSession = require('#helpers/create-session');
const getMongoQuery = require('#helpers/get-mongo-query');

async function list(ctx) {
  const query = getMongoQuery(ctx);

  // TODO: $query should be filtered for partial indices only

  const [emails, itemCount] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Emails.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .select('-message -headers -accepted -rejectedErrors')
      .lean()
      .exec(),
    _.isEmpty(query)
      ? Emails.estimatedDocumentCount()
      : Emails.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/emails', {
      emails,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/emails/_table', {
    emails,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.email = await Emails.findById(ctx.params.id.replace('.eml', ''));

  if (!ctx.state.email)
    throw Boom.notFound(ctx.translateError('EMAIL_DOES_NOT_EXIST'));

  // eml download
  if (ctx.params.id.endsWith('.eml')) {
    ctx.type = 'message/rfc822';
    ctx.body = await Emails.getMessage(ctx.state.email.message);
    return;
  }

  try {
    const message = await Emails.getMessage(ctx.state.email.message);
    ctx.state.html = await previewEmail(message, config.previewEmailOptions);
  } catch (err) {
    ctx.flash('error', ctx.translate('EMAIL_PREVIEW_ERROR'));
    ctx.logger.fatal(err);
  }

  return ctx.render('admin/emails/retrieve');
}

async function update(ctx) {
  ctx.state.email = await Emails.findById(ctx.params.id);

  if (!ctx.state.email)
    throw Boom.notFound(ctx.translateError('EMAIL_DOES_NOT_EXIST'));

  // we can only modify if either pending or deferred
  // or queued with locked_at or locked_by
  if (
    !['pending', 'deferred'].includes(ctx.state.email.status) &&
    !(
      ctx.state.email.status === 'queued' &&
      (_.isDate(ctx.state.email.locked_at) || ctx.state.email.locked_by)
    )
  )
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL_STATUS'));

  // set status to queued
  await Emails.findByIdAndUpdate(ctx.state.email._id, {
    $set: {
      is_locked: false,
      status: 'queued'
    },
    $unset: {
      locked_by: 1,
      locked_at: 1
    }
  });

  // ctx.logger.info('email queued', {
  //   session: createSession(ctx.state.email),
  //   user: ctx.state.email.user,
  //   email: ctx.state.email._id,
  //   domains: [ctx.state.email.domain],
  //   ignore_hook: false
  // });

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
  ctx.state.email = await Emails.findById(ctx.params.id);

  if (!ctx.state.email)
    throw Boom.notFound(ctx.translateError('EMAIL_DOES_NOT_EXIST'));

  if (!['pending', 'queued', 'deferred'].includes(ctx.state.email.status))
    throw Boom.badRequest(ctx.translateError('INVALID_EMAIL_STATUS'));

  // NOTE: save() will automatically remove from `rejectedErrors` any already `accepted`
  const err = Boom.notFound(ctx.translateError('EMAIL_REMOVED'));
  ctx.state.email.rejectedErrors.push(
    ...ctx.state.email.envelope.to.map((recipient) => {
      const error = parseErr(err);
      error.recipient = recipient;
      return error;
    })
  );

  // NOTE: we leave it up to the pre-save hook to determine the "status"
  ctx.state.email.is_locked = false;
  ctx.state.email.locked_by = undefined;
  ctx.state.email.locked_at = undefined;
  ctx.state.email = await ctx.state.email.save();

  ctx.logger.debug('email removed', {
    session: createSession(ctx.state.email),
    user: ctx.state.email.user,
    email: ctx.state.email._id,
    domains: [ctx.state.email.domain],
    ignore_hook: false
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

module.exports = {
  list,
  retrieve,
  remove,
  update
};
