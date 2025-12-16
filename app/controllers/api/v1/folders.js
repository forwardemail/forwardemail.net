/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { boolean } = require('boolean');

const Aliases = require('#models/aliases');
const Mailboxes = require('#models/mailboxes');
const i18n = require('#helpers/i18n');
const setPaginationHeaders = require('#helpers/set-pagination-headers');

const onDelete = require('#helpers/imap/on-delete');
const onCreate = require('#helpers/imap/on-create');
const onRename = require('#helpers/imap/on-rename');

const onDeletePromise = pify(onDelete, { multiArgs: true });
const onCreatePromise = pify(onCreate, { multiArgs: true });
const onRenamePromise = pify(onRename, { multiArgs: true });

function json(mailbox) {
  // Transform mailbox data for API response
  const object = {
    id: mailbox._id,
    path: mailbox.path,
    name: mailbox.path.split('/').pop(), // Get folder name from path
    parent: mailbox.path.includes('/')
      ? mailbox.path.slice(0, Math.max(0, mailbox.path.lastIndexOf('/')))
      : null,
    uid_validity: mailbox.uidValidity,
    uid_next: mailbox.uidNext,
    modify_index: mailbox.modifyIndex,
    subscribed: mailbox.subscribed,
    flags: mailbox.flags,
    retention: mailbox.retention,
    special_use: mailbox.specialUse,
    created_at: mailbox.created_at,
    updated_at: mailbox.updated_at,
    object: 'folder'
  };

  return object;
}

async function list(ctx) {
  const query = {};

  // Filter by subscribed status if specified
  if (ctx.query.subscribed !== undefined)
    query.subscribed = boolean(ctx.query.subscribed);

  // Get mailboxes/folders with pagination
  const { results: mailboxes, count: itemCount } = await Mailboxes.findAndCount(
    ctx.instance,
    ctx.state.session,
    query,
    {},
    {
      limit: ctx.query.limit,
      offset: ctx.paginate.skip,
      // Sort by path for logical folder ordering
      sort: 'path'
    }
  );

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Set pagination headers
  setPaginationHeaders(
    ctx,
    pageCount,
    ctx.query.page,
    mailboxes.length,
    itemCount
  );

  ctx.body = Array.isArray(mailboxes)
    ? mailboxes.map((mailbox) => json(mailbox))
    : [];
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate required fields
  if (!isSANB(body.path))
    throw Boom.badRequest(ctx.translateError('FOLDER_NAME_OR_PATH_REQUIRED'));

  // check if over quota
  const { isOverQuota } = await Aliases.isOverQuota(
    {
      id: ctx.state.session.user.alias_id,
      domain: ctx.state.session.user.domain_id,
      locale: ctx.locale
    },
    0,
    ctx.client
  );
  if (isOverQuota)
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  try {
    const [, mailboxId] = await onCreatePromise.call(
      ctx.instance,
      body.path,
      ctx.state.session
    );

    const mailbox = await Mailboxes.findById(
      ctx.instance,
      ctx.state.session,
      mailboxId
    );

    ctx.body = json(mailbox);
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }
}

async function retrieve(ctx) {
  // Validate folder ID if it looks like an ObjectID
  if (ObjectID.isValid(ctx.params.id)) {
    const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });

    if (mailbox) {
      ctx.body = json(mailbox);
      return;
    }
  }

  // Try finding by path
  const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
    path: ctx.params.id
  });

  if (!mailbox) {
    throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));
  }

  ctx.body = json(mailbox);
}

async function update(ctx) {
  const { body } = ctx.request;

  // Try to find by ID first, then by path
  let mailbox;

  if (ObjectID.isValid(ctx.params.id)) {
    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });
  }

  if (!mailbox) {
    // Try finding by path
    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path: ctx.params.id
    });
  }

  if (!mailbox)
    throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));

  // check if over quota
  const { isOverQuota } = await Aliases.isOverQuota(
    {
      id: ctx.state.session.user.alias_id,
      domain: ctx.state.session.user.domain_id,
      locale: ctx.locale
    },
    0,
    ctx.client
  );
  if (isOverQuota)
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  try {
    const [, mailboxId] = await onRenamePromise.call(
      ctx.instance,
      mailbox.path,
      body.path,
      ctx.state.session
    );

    mailbox = await Mailboxes.findById(
      ctx.instance,
      ctx.state.session,
      mailboxId
    );

    if (!mailbox) {
      throw Boom.notFound(
        i18n.translateError('IMAP_MAILBOX_DOES_NOT_EXIST', ctx.locale)
      );
    }

    ctx.body = json(mailbox);
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }
}

async function remove(ctx) {
  // Try to find by ID first, then by path
  let mailbox;

  if (ObjectID.isValid(ctx.params.id)) {
    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });
  }

  if (!mailbox) {
    // Try finding by path
    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path: ctx.params.id
    });
  }

  if (!mailbox) {
    throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));
  }

  // re-use the existing IMAP helper function
  try {
    // const [bool, mailboxId ] = await onDeletePromise.call(
    await onDeletePromise.call(ctx.instance, mailbox.path, ctx.state.session);

    ctx.body = json(mailbox);
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
