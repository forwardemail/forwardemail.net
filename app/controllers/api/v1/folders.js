/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const { boolean } = require('boolean');

const setPaginationHeaders = require('#helpers/set-pagination-headers');
const Mailboxes = require('#models/mailboxes');
const updateStorageUsed = require('#helpers/update-storage-used');

function json(mailbox) {
  // Transform mailbox data for API response
  const object = {
    id: mailbox._id,
    path: mailbox.path,
    name: mailbox.path.split('/').pop(), // Get folder name from path
    parent: mailbox.path.includes('/')
      ? mailbox.path.slice(0, Math.max(0, mailbox.path.lastIndexOf('/')))
      : null,
    delimiter: '/',
    flags: mailbox.flags,
    special_use: mailbox.specialUse,
    subscribed: mailbox.subscribed,
    uid_validity: mailbox.uidValidity,
    uid_next: mailbox.uidNext,
    modify_index: mailbox.modifyIndex,
    retention: mailbox.retention,
    created_at: mailbox.created_at || mailbox.createdAt,
    updated_at: mailbox.updated_at || mailbox.updatedAt,
    object: 'folder'
  };

  return object;
}

async function list(ctx) {
  try {
    const query = {};

    // Filter by subscribed status if specified
    if (boolean(ctx.query.subscribed_only)) {
      query.subscribed = true;
    }

    // Get mailboxes/folders with pagination
    const [mailboxes, itemCount] = await Promise.all([
      Mailboxes.find(
        ctx.instance,
        ctx.state.session,
        query,
        {},
        {
          limit: ctx.query.limit,
          offset: ctx.paginate.skip,
          // Sort by path for logical folder ordering
          sort: { path: 1 }
        }
      ),
      Mailboxes.countDocuments(ctx.instance, ctx.state.session, query)
    ]);

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
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function create(ctx) {
  try {
    const { body } = ctx.request;

    // Validate required fields
    if (!body.path && !body.name) {
      throw Boom.badRequest(ctx.translateError('FOLDER_NAME_OR_PATH_REQUIRED'));
    }

    const path = body.path || body.name;

    // Check if mailbox already exists
    const existing = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path
    });

    if (existing) {
      throw Boom.conflict(ctx.translateError('FOLDER_ALREADY_EXISTS'));
    }

    const mailbox = await Mailboxes.create({
      // db virtual helper
      instance: ctx.instance,
      session: ctx.state.session,

      // mailbox data
      path,
      subscribed:
        body.subscribed === undefined ? true : boolean(body.subscribed),
      flags: body.flags || [],
      retention: body.retention || 0,
      specialUse: body.special_use || ''
    });

    ctx.body = json(mailbox);

    // Update storage in background (folders contribute to storage usage)
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { mailbox, session: ctx.state.session })
      );
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function retrieve(ctx) {
  try {
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
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function update(ctx) {
  try {
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

    if (!mailbox) {
      throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));
    }

    // Update mailbox fields
    if (body.path) mailbox.path = body.path;
    if (body.subscribed !== undefined)
      mailbox.subscribed = boolean(body.subscribed);
    if (body.flags) mailbox.flags = body.flags;
    if (body.retention !== undefined) mailbox.retention = body.retention;
    if (body.special_use !== undefined) mailbox.specialUse = body.special_use;

    // Set db virtual helpers
    mailbox.instance = ctx.instance;
    mailbox.session = ctx.state.session;
    mailbox.isNew = false;

    await mailbox.save();

    ctx.body = json(mailbox);

    // Update storage in background (folder properties may have changed)
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { mailbox, session: ctx.state.session })
      );
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function remove(ctx) {
  try {
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

    // Prevent deletion of INBOX
    if (mailbox.path === 'INBOX') {
      throw Boom.badRequest(ctx.translateError('FOLDER_CANNOT_DELETE_INBOX'));
    }

    // TODO: prevent reserved folder deletion
    // TODO: if you delete a folder

    await Mailboxes.deleteOne(ctx.instance, ctx.state.session, {
      _id: mailbox._id
    });

    ctx.body = { message: 'Folder deleted successfully' };

    // Update storage in background (folder was deleted, reducing storage usage)
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { mailbox, session: ctx.state.session })
      );
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
