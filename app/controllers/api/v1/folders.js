/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const imapTools = require('@zone-eu/wildduck/imap-core/lib/imap-tools');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { boolean } = require('boolean');

const pMap = require('p-map');

const Aliases = require('#models/aliases');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const setPaginationHeaders = require('#helpers/set-pagination-headers');

const onDelete = require('#helpers/imap/on-delete');
const onCreate = require('#helpers/imap/on-create');
const onRename = require('#helpers/imap/on-rename');

const onDeletePromise = pify(onDelete, { multiArgs: true });
const onCreatePromise = pify(onCreate, { multiArgs: true });
const onRenamePromise = pify(onRename, { multiArgs: true });

//
// Paths follow IMAP: INBOX is matched in any case and slashes around a path
// are dropped (a lowercase "inbox" became a second INBOX that IMAP clients
// could not tell apart from the first), and an empty name is refused.
//
function normalizeFolderPath(path) {
  return imapTools.normalizeMailbox(path);
}

function getFolderPath(ctx, value) {
  const path = isSANB(value) ? normalizeFolderPath(value) : '';
  if (
    !path ||
    path.startsWith('/') ||
    path.endsWith('/') ||
    path.includes('//')
  )
    throw Boom.badRequest(ctx.translateError('FOLDER_NAME_OR_PATH_REQUIRED'));
  return path;
}

//
// By id, or else by path: as stored, then matched as IMAP matches it (a
// folder created before paths were normalized, such as "Inbox/Receipts",
// only matches as stored)
//
async function findFolder(ctx) {
  let mailbox;
  if (ObjectID.isValid(ctx.params.id))
    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });

  for (const path of new Set([
    ctx.params.id,
    normalizeFolderPath(ctx.params.id)
  ])) {
    if (mailbox) break;

    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path
    });
  }

  if (!mailbox)
    throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));

  return mailbox;
}

// what IMAP answered when a folder was not created, renamed or deleted
function getFolderError(ctx, response, phrase) {
  switch (response) {
    case 'ALREADYEXISTS': {
      return Boom.badRequest(
        i18n.translate('IMAP_MAILBOX_ALREADY_EXISTS', ctx.locale)
      );
    }

    case 'NONEXISTENT': {
      return Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));
    }

    case 'OVERQUOTA': {
      return Boom.forbidden(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
      );
    }

    default: {
      return Boom.badRequest(i18n.translate(phrase, ctx.locale));
    }
  }
}

function json(mailbox, { messages, unseen } = {}) {
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

  // Include message counts when available
  if (typeof messages === 'number') object.total = messages;
  if (typeof unseen === 'number') object.unseen_count = unseen;

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

  // Fetch message counts for each folder in parallel
  const counts = await pMap(
    mailboxes,
    async (mailbox) => {
      try {
        const [messages, unseen] = await Promise.all([
          Messages.countDocuments(ctx.instance, ctx.state.session, {
            mailbox: mailbox._id
          }),
          Messages.countDocuments(ctx.instance, ctx.state.session, {
            mailbox: mailbox._id,
            unseen: true
          })
        ]);
        return { messages, unseen };
      } catch {
        return { messages: undefined, unseen: undefined };
      }
    },
    { concurrency: 5 }
  );

  ctx.body = Array.isArray(mailboxes)
    ? mailboxes.map((mailbox, i) => json(mailbox, counts[i] || {}))
    : [];
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate required fields
  const path = getFolderPath(ctx, body.path);

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

  let response;
  let mailboxId;
  try {
    [response, mailboxId] = await onCreatePromise.call(
      ctx.instance,
      path,
      ctx.state.session
    );
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }

  if (response !== true || !mailboxId)
    throw getFolderError(ctx, response, 'MAILBOX_CREATION_FAILED');

  const mailbox = await Mailboxes.findById(
    ctx.instance,
    ctx.state.session,
    mailboxId
  );

  // Handle race condition where findById returns null
  if (!mailbox)
    throw Boom.badRequest(
      i18n.translate('MAILBOX_CREATION_FAILED', ctx.locale)
    );

  ctx.body = json(mailbox);
}

async function retrieve(ctx) {
  ctx.body = json(await findFolder(ctx));
}

async function update(ctx) {
  const { body } = ctx.request;

  let mailbox = await findFolder(ctx);

  // renaming is the only change, so the new path is required
  const path = getFolderPath(ctx, body.path);

  // as IMAP RENAME refuses (see on-rename.js)
  if (mailbox.path === 'INBOX')
    throw Boom.badRequest(
      i18n.translate('IMAP_MAILBOX_RENAME_INBOX', ctx.locale)
    );

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

  let response;
  let mailboxId;
  try {
    [response, mailboxId] = await onRenamePromise.call(
      ctx.instance,
      mailbox.path,
      path,
      ctx.state.session
    );
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }

  //
  // IMAP answers ALREADYEXISTS when the new path is taken, and the folder
  // was then looked up without an id and reported as not found
  //
  if (response !== true || !mailboxId)
    throw getFolderError(ctx, response, 'IMAP_MAILBOX_RENAME_INTO_ITSELF');

  mailbox = await Mailboxes.findById(
    ctx.instance,
    ctx.state.session,
    mailboxId
  );

  if (!mailbox)
    throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));

  ctx.body = json(mailbox);
}

async function remove(ctx) {
  const mailbox = await findFolder(ctx);

  // as IMAP DELETE refuses (see on-delete.js)
  if (mailbox.path === 'INBOX')
    throw Boom.badRequest(i18n.translate('IMAP_MAILBOX_RESERVED', ctx.locale));

  // re-use the existing IMAP helper function
  let response;
  try {
    [response] = await onDeletePromise.call(
      ctx.instance,
      mailbox.path,
      ctx.state.session
    );
  } catch (_err) {
    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }

  // a folder that was not deleted was reported as deleted
  if (response !== true)
    throw getFolderError(ctx, response, 'IMAP_MAILBOX_RESERVED');

  ctx.body = json(mailbox);
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
