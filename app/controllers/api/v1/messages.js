/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const { boolean } = require('boolean');
const isSANB = require('is-string-and-not-blank');
const isEmail = require('#helpers/is-email');

const _ = require('#helpers/lodash');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const Messages = require('#models/messages');
const Mailboxes = require('#models/mailboxes');
const updateStorageUsed = require('#helpers/update-storage-used');
const sendApn = require('#helpers/send-apn');
const getAttachments = require('#helpers/get-attachments');

function json(message) {
  // Transform message data for API response
  const object = {
    id: message._id,
    uid: message.uid,
    subject: message.subject,
    from: message.from,
    to: message.to,
    cc: message.cc,
    bcc: message.bcc,
    date: message.hdate || message.idate,
    flags: message.flags,
    size: message.size,
    mailbox: message.mailbox,
    thread: message.thread,
    has_attachments: message.ha || false,
    is_unread: !message.flags.includes('\\Seen'),
    is_flagged: message.flags.includes('\\Flagged'),
    is_draft: message.flags.includes('\\Draft'),
    created_at: message.created_at || message.createdAt,
    updated_at: message.updated_at || message.updatedAt,
    object: 'message'
  };

  return object;
}

async function list(ctx) {
  try {
    const query = {};

    // Filter by folder/mailbox if specified
    if (ctx.query.folder) {
      const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
        path: ctx.query.folder
      });

      if (mailbox) {
        query.mailbox = mailbox._id;
      }
    }

    // Filter by flags
    if (boolean(ctx.query.unread_only)) {
      query.flags = { $nin: ['\\Seen'] };
    }

    if (boolean(ctx.query.flagged_only)) {
      query.flags = { $in: ['\\Flagged'] };
    }

    // Advanced search functionality
    const searchConditions = [];

    // Search in subject
    if (ctx.query.subject) {
      searchConditions.push({
        subject: { $regex: ctx.query.subject, $options: 'i' }
      });
    }

    // Search in message body/text
    if (ctx.query.body || ctx.query.text) {
      const searchText = ctx.query.body || ctx.query.text;
      searchConditions.push({
        $or: [
          { text: { $regex: searchText, $options: 'i' } },
          { html: { $regex: searchText, $options: 'i' } },
          { raw: { $regex: searchText, $options: 'i' } }
        ]
      });
    }

    // Search in from field
    if (ctx.query.from) {
      searchConditions.push({
        $or: [
          { 'from.address': { $regex: ctx.query.from, $options: 'i' } },
          { 'from.name': { $regex: ctx.query.from, $options: 'i' } },
          { from: { $regex: ctx.query.from, $options: 'i' } }
        ]
      });
    }

    // Search in to field
    if (ctx.query.to) {
      searchConditions.push({
        $or: [
          { 'to.address': { $regex: ctx.query.to, $options: 'i' } },
          { 'to.name': { $regex: ctx.query.to, $options: 'i' } },
          { to: { $regex: ctx.query.to, $options: 'i' } }
        ]
      });
    }

    // Search in cc field
    if (ctx.query.cc) {
      searchConditions.push({
        $or: [
          { 'cc.address': { $regex: ctx.query.cc, $options: 'i' } },
          { 'cc.name': { $regex: ctx.query.cc, $options: 'i' } },
          { cc: { $regex: ctx.query.cc, $options: 'i' } }
        ]
      });
    }

    // Search in headers
    if (ctx.query.headers) {
      searchConditions.push({
        headers: { $regex: ctx.query.headers, $options: 'i' }
      });
    }

    // Search in message ID
    if (ctx.query.message_id) {
      searchConditions.push({
        messageId: { $regex: ctx.query.message_id, $options: 'i' }
      });
    }

    // General search across multiple fields
    if (ctx.query.search || ctx.query.q) {
      const searchTerm = ctx.query.search || ctx.query.q;
      searchConditions.push({
        $or: [
          { subject: { $regex: searchTerm, $options: 'i' } },
          { text: { $regex: searchTerm, $options: 'i' } },
          { html: { $regex: searchTerm, $options: 'i' } },
          { 'from.address': { $regex: searchTerm, $options: 'i' } },
          { 'from.name': { $regex: searchTerm, $options: 'i' } },
          { 'to.address': { $regex: searchTerm, $options: 'i' } },
          { 'to.name': { $regex: searchTerm, $options: 'i' } },
          { from: { $regex: searchTerm, $options: 'i' } },
          { to: { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    // Date range filtering
    if (ctx.query.since || ctx.query.before) {
      const dateQuery = {};

      if (ctx.query.since) {
        const sinceDate = new Date(ctx.query.since);
        if (!Number.isNaN(sinceDate.getTime())) {
          dateQuery.$gte = sinceDate;
        }
      }

      if (ctx.query.before) {
        const beforeDate = new Date(ctx.query.before);
        if (!Number.isNaN(beforeDate.getTime())) {
          dateQuery.$lt = beforeDate;
        }
      }

      if (Object.keys(dateQuery).length > 0) {
        searchConditions.push({
          $or: [
            { hdate: dateQuery },
            { idate: dateQuery },
            { created_at: dateQuery },
            { createdAt: dateQuery }
          ]
        });
      }
    }

    // Size filtering
    if (ctx.query.min_size || ctx.query.max_size) {
      const sizeQuery = {};

      if (ctx.query.min_size) {
        const minSize = Number.parseInt(ctx.query.min_size, 10);
        if (!Number.isNaN(minSize)) {
          sizeQuery.$gte = minSize;
        }
      }

      if (ctx.query.max_size) {
        const maxSize = Number.parseInt(ctx.query.max_size, 10);
        if (!Number.isNaN(maxSize)) {
          sizeQuery.$lte = maxSize;
        }
      }

      if (Object.keys(sizeQuery).length > 0) {
        searchConditions.push({ size: sizeQuery });
      }
    }

    // Has attachments filter
    if (ctx.query.has_attachments !== undefined) {
      const hasAttachments = boolean(ctx.query.has_attachments);
      searchConditions.push({ ha: hasAttachments });
    }

    // Combine all search conditions
    if (searchConditions.length > 0) {
      query.$and = searchConditions;
    }

    // Get messages with pagination
    const [messages, itemCount] = await Promise.all([
      Messages.find(
        ctx.instance,
        ctx.state.session,
        query,
        {},
        {
          limit: ctx.query.limit,
          offset: ctx.paginate.skip,
          sort: { created_at: -1 }
        }
      ),
      Messages.countDocuments(ctx.instance, ctx.state.session, query)
    ]);

    const pageCount = Math.ceil(itemCount / ctx.query.limit);

    // Set pagination headers
    setPaginationHeaders(
      ctx,
      pageCount,
      ctx.query.page,
      messages.length,
      itemCount
    );

    ctx.body = Array.isArray(messages)
      ? messages.map((message) => json(message))
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

    // Validate request body exists and is an object
    if (!_.isObject(body)) {
      throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));
    }

    console.log('body', body);

    // Validate required fields
    if (!body.to || !Array.isArray(body.to) || body.to.length === 0) {
      throw Boom.badRequest(ctx.translateError('MESSAGE_RECIPIENTS_REQUIRED'));
    }

    // Validate recipients array
    for (const recipient of body.to) {
      if (!_.isObject(recipient)) {
        throw Boom.badRequest(
          ctx.translateError('MESSAGE_RECIPIENT_MUST_BE_OBJECT')
        );
      }

      if (!isSANB(recipient.address) || !isEmail(recipient.address)) {
        throw Boom.badRequest(
          ctx.translateError('MESSAGE_RECIPIENT_EMAIL_INVALID')
        );
      }

      if (recipient.name !== undefined && !isSANB(recipient.name)) {
        throw Boom.badRequest(
          ctx.translateError('MESSAGE_RECIPIENT_NAME_INVALID')
        );
      }
    }

    // Validate CC recipients if provided
    if (body.cc !== undefined) {
      if (!Array.isArray(body.cc)) {
        throw Boom.badRequest(ctx.translateError('MESSAGE_CC_MUST_BE_ARRAY'));
      }

      for (const recipient of body.cc) {
        if (!_.isObject(recipient)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_CC_RECIPIENT_MUST_BE_OBJECT')
          );
        }

        if (!isSANB(recipient.address) || !isEmail(recipient.address)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_CC_RECIPIENT_EMAIL_INVALID')
          );
        }

        if (recipient.name !== undefined && !isSANB(recipient.name)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_CC_RECIPIENT_NAME_INVALID')
          );
        }
      }
    }

    // Validate BCC recipients if provided
    if (body.bcc !== undefined) {
      if (!Array.isArray(body.bcc)) {
        throw Boom.badRequest(ctx.translateError('MESSAGE_BCC_MUST_BE_ARRAY'));
      }

      for (const recipient of body.bcc) {
        if (!_.isObject(recipient)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_BCC_RECIPIENT_MUST_BE_OBJECT')
          );
        }

        if (!isSANB(recipient.address) || !isEmail(recipient.address)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_BCC_RECIPIENT_EMAIL_INVALID')
          );
        }

        if (recipient.name !== undefined && !isSANB(recipient.name)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_BCC_RECIPIENT_NAME_INVALID')
          );
        }
      }
    }

    // Validate from field if provided
    if (body.from !== undefined) {
      if (!_.isObject(body.from)) {
        throw Boom.badRequest(
          ctx.translateError('MESSAGE_FROM_MUST_BE_OBJECT')
        );
      }

      if (!isSANB(body.from.address) || !isEmail(body.from.address)) {
        throw Boom.badRequest(ctx.translateError('MESSAGE_FROM_EMAIL_INVALID'));
      }

      if (body.from.name !== undefined && !isSANB(body.from.name)) {
        throw Boom.badRequest(ctx.translateError('MESSAGE_FROM_NAME_INVALID'));
      }
    }

    // Validate subject if provided
    if (body.subject !== undefined && typeof body.subject !== 'string') {
      throw Boom.badRequest(ctx.translateError('MESSAGE_SUBJECT_INVALID'));
    }

    // Validate text content if provided
    if (body.text !== undefined && typeof body.text !== 'string') {
      throw Boom.badRequest(ctx.translateError('MESSAGE_TEXT_INVALID'));
    }

    // Validate HTML content if provided
    if (body.html !== undefined && typeof body.html !== 'string') {
      throw Boom.badRequest(ctx.translateError('MESSAGE_HTML_INVALID'));
    }

    // Validate folder if provided
    if (body.folder !== undefined && !isSANB(body.folder)) {
      throw Boom.badRequest(ctx.translateError('MESSAGE_FOLDER_INVALID'));
    }

    // Validate flags if provided
    if (body.flags !== undefined) {
      if (!Array.isArray(body.flags)) {
        throw Boom.badRequest(
          ctx.translateError('MESSAGE_FLAGS_MUST_BE_ARRAY')
        );
      }

      for (const flag of body.flags) {
        if (!isSANB(flag)) {
          throw Boom.badRequest(ctx.translateError('MESSAGE_FLAG_INVALID'));
        }
      }
    }

    // Validate attachments if provided
    if (body.attachments !== undefined) {
      if (!Array.isArray(body.attachments)) {
        throw Boom.badRequest(
          ctx.translateError('MESSAGE_ATTACHMENTS_MUST_BE_ARRAY')
        );
      }

      for (const attachment of body.attachments) {
        if (!_.isObject(attachment)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_ATTACHMENT_MUST_BE_OBJECT')
          );
        }

        if (!isSANB(attachment.filename)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_ATTACHMENT_FILENAME_INVALID')
          );
        }

        if (!isSANB(attachment.content)) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_ATTACHMENT_CONTENT_INVALID')
          );
        }

        if (
          attachment.contentType !== undefined &&
          !isSANB(attachment.contentType)
        ) {
          throw Boom.badRequest(
            ctx.translateError('MESSAGE_ATTACHMENT_CONTENT_TYPE_INVALID')
          );
        }
      }
    }

    // Find or create the target mailbox
    let mailbox;
    const folderPath = body.folder || 'INBOX';

    mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path: folderPath
    });

    if (!mailbox) {
      // Create the mailbox if it doesn't exist
      mailbox = await Mailboxes.create({
        instance: ctx.instance,
        session: ctx.state.session,
        path: folderPath,
        subscribed: true
      });
    }

    // TODO: verify this is correct
    const message = await Messages.create({
      // db virtual helper
      instance: ctx.instance,
      session: ctx.state.session,

      // message data
      mailbox: mailbox._id,
      thread: new ObjectID(), // TODO: implement proper threading
      root: new ObjectID(),
      exp: false,
      rdate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year retention
      idate: new Date(),
      hdate: body.date ? new Date(body.date) : new Date(),
      flags: body.flags || [],
      size: JSON.stringify(body).length, // rough estimate
      subject: body.subject || '',
      from: body.from || ctx.state.session.user.email,
      to: body.to,
      cc: body.cc || [],
      bcc: body.bcc || [],
      text: body.text,
      html: body.html,
      attachments: body.attachments || []
    });

    ctx.body = json(message);

    // Mirror IMAP functionality - add notification entries and fire notifications
    if (ctx.notifier) {
      const entry = {
        command: 'EXISTS',
        uid: message.uid,
        message: message._id,
        mailbox: mailbox._id
      };

      ctx.notifier
        .addEntries(ctx.instance, ctx.state.session, mailbox, entry)
        .then(() => ctx.notifier.fire(ctx.state.session.user.alias_id))
        .catch((err) => ctx.logger.fatal(err, { session: ctx.state.session }));
    }

    // Update storage in background
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, {
          message,
          path: mailbox.path,
          session: ctx.state.session
        })
      );

    // Send Apple Push Notification
    sendApn(ctx.client, ctx.state.session.user.alias_id, mailbox.path)
      .then()
      .catch((err) => ctx.logger.fatal(err, { session: ctx.state.session }));
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function retrieve(ctx) {
  try {
    // Validate message ID
    if (!ObjectID.isValid(ctx.params.id)) {
      throw Boom.badRequest(ctx.translateError('MESSAGE_INVALID_ID'));
    }

    const message = await Messages.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });

    if (!message) {
      throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));
    }

    ctx.body = json(message);
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function update(ctx) {
  try {
    const { body } = ctx.request;

    // Validate message ID
    if (!ObjectID.isValid(ctx.params.id)) {
      throw Boom.badRequest(ctx.translateError('MESSAGE_INVALID_ID'));
    }

    const message = await Messages.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });

    if (!message) {
      throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));
    }

    if (body.flags !== undefined) {
      message.flags = body.flags;
    }

    if (body.subject !== undefined) {
      message.subject = body.subject;
    }

    if (body.folder !== undefined) {
      // Find target mailbox
      const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
        path: body.folder
      });

      if (!mailbox) {
        throw Boom.notFound(ctx.translateError('FOLDER_DOES_NOT_EXIST'));
      }

      message.mailbox = mailbox._id;
    }

    // Set db virtual helpers
    message.instance = ctx.instance;
    message.session = ctx.state.session;
    message.isNew = false;

    await message.save();

    ctx.body = json(message);

    // Mirror IMAP functionality - add notification entries for message update
    if (ctx.notifier) {
      const entry = {
        command: 'FETCH',
        uid: message.uid,
        message: message._id,
        mailbox: message.mailbox
      };

      ctx.notifier
        .addEntries(
          ctx.instance,
          ctx.state.session,
          { _id: message.mailbox },
          entry
        )
        .then(() => ctx.notifier.fire(ctx.state.session.user.alias_id))
        .catch((err) => ctx.logger.fatal(err, { session: ctx.state.session }));
    }

    // Update storage in background (in case message size changed)
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { message, session: ctx.state.session })
      );
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function remove(ctx) {
  try {
    // Validate message ID
    if (!ObjectID.isValid(ctx.params.id)) {
      throw Boom.badRequest(ctx.translateError('MESSAGE_INVALID_ID'));
    }

    const message = await Messages.findOne(ctx.instance, ctx.state.session, {
      _id: ctx.params.id
    });

    if (!message) {
      throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));
    }

    // Get attachments before deleting the message
    const attachmentIds = getAttachments(message.mimeTree);

    await Messages.deleteOne(ctx.instance, ctx.state.session, {
      _id: message._id
    });

    // Delete attachments like IMAP on-expunge does
    if (attachmentIds.length > 0 && ctx.attachmentStorage) {
      try {
        await ctx.attachmentStorage.deleteMany(
          ctx.client,
          ctx.state.session,
          attachmentIds,
          message.magic
        );
      } catch (err) {
        err.message = `Error while deleting attachments: ${err.message}`;
        err.isCodeBug = true;
        ctx.logger.fatal(err, { message, session: ctx.state.session });
      }
    }

    ctx.body = { message: 'Message deleted successfully' };

    // Mirror IMAP functionality - add notification entries for message deletion
    if (ctx.notifier) {
      const entry = {
        command: 'EXPUNGE',
        uid: message.uid,
        message: message._id,
        mailbox: message.mailbox
      };

      ctx.notifier
        .addEntries(
          ctx.instance,
          ctx.state.session,
          { _id: message.mailbox },
          entry
        )
        .then(() => ctx.notifier.fire(ctx.state.session.user.alias_id))
        .catch((err) => ctx.logger.fatal(err, { session: ctx.state.session }));
    }

    // Update storage in background
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { message, session: ctx.state.session })
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
