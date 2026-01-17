/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const paginate = require('koa-ctx-paginate');
const parseErr = require('parse-err');
const previewEmail = require('preview-email');
const _ = require('#helpers/lodash');

const config = require('#config');
const Emails = require('#models/emails');
const createSession = require('#helpers/create-session');
const getMongoQuery = require('#helpers/get-mongo-query');

// Index hints for envelope queries to ensure optimal index usage
const ENVELOPE_FROM_INDEX_HINT = { 'envelope.from': 1, created_at: -1 };
const ENVELOPE_TO_INDEX_HINT = { 'envelope.to': 1, created_at: -1 };

// Maximum time for query execution (30 seconds)
const MAX_TIME_MS = 30_000;

// Cap count at 10,000 to improve performance on large collections
const MAX_COUNT_LIMIT = 10_000;

/**
 * Determines the appropriate index hint based on the query structure
 * @param {Object} query - MongoDB query object
 * @returns {Object|null} - Index hint object or null if no specific hint needed
 */
function getIndexHint(query) {
  if (!query || typeof query !== 'object') return null;

  // Check for envelope.from query
  if (query['envelope.from']) {
    return ENVELOPE_FROM_INDEX_HINT;
  }

  // Check for envelope.to query
  if (query['envelope.to']) {
    return ENVELOPE_TO_INDEX_HINT;
  }

  return null;
}

async function list(ctx) {
  const query = getMongoQuery(ctx);

  // Determine if we should use an index hint for envelope queries
  const indexHint = getIndexHint(query);

  // Build the find query with optimizations
  // eslint-disable-next-line unicorn/no-array-callback-reference
  let findQuery = Emails.find(query)
    .limit(ctx.query.limit)
    .skip(ctx.paginate.skip)
    .sort(ctx.query.sort || '-created_at')
    .select('-message -headers -accepted -rejectedErrors')
    .lean()
    .maxTimeMS(MAX_TIME_MS);

  // Apply index hint if available for envelope queries
  if (indexHint) {
    findQuery = findQuery.hint(indexHint);
  }

  // Build the count query with optimizations
  let countQuery;
  if (_.isEmpty(query)) {
    // Use estimatedDocumentCount for empty queries (much faster)
    countQuery = Emails.estimatedDocumentCount();
  } else {
    // Use countDocuments with maxTimeMS and optional hint
    countQuery = Emails.countDocuments(query).maxTimeMS(MAX_TIME_MS);
    if (indexHint) {
      countQuery = countQuery.hint(indexHint);
    }
  }

  const [emails, itemCount] = await Promise.all([findQuery.exec(), countQuery]);

  // Cap the item count to prevent UI issues with very large result sets
  const cappedItemCount = Math.min(itemCount, MAX_COUNT_LIMIT);
  const pageCount = Math.ceil(cappedItemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/emails', {
      emails,
      pageCount,
      itemCount: cappedItemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/emails/_table', {
    emails,
    pageCount,
    itemCount: cappedItemCount,
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
