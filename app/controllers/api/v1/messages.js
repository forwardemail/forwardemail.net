/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const MailComposer = require('nodemailer/lib/mail-composer');
const ObjectID = require('bson-objectid');
const bytes = require('@forwardemail/bytes');
const getStream = require('get-stream');
const pify = require('pify');
const { Iconv } = require('iconv');
const { boolean } = require('boolean');
const { simpleParser } = require('mailparser');

const AttachmentStorage = require('#helpers/attachment-storage');
const Indexer = require('#helpers/indexer');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const _ = require('#helpers/lodash');
const env = require('#config/env');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const getNodemailerMessageFromRequest = require('#helpers/get-nodemailer-message-from-request');

const attachmentStorage = new AttachmentStorage();
const indexer = new Indexer({
  attachmentStorage
});

// path, flags, date, raw, session
const onAppend = require('#helpers/imap/on-append');
const onCreate = require('#helpers/imap/on-create');
// mailboxId, update, session
// update.silent = true
// update.destination (new path)
// update.messages (range query)
//
const onMove = require('#helpers/imap/on-move');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const onMovePromise = pify(onMove, { multiArgs: true });
const onCreatePromise = pify(onCreate, { multiArgs: true });

async function json(ctx, message) {
  // TODO: redo this
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
    created_at: message.created_at,
    updated_at: message.updated_at,
    object: 'message'
  };

  // similar to 'rfc822' case in `helpers/get-query-response.js`
  // (value is a stream)
  const { value } = indexer.getContents(
    message.mimeTree,
    false,
    {},
    ctx.instance,
    ctx.state.session
  );

  const raw = await getStream.buffer(value);
  const mail = await simpleParser(raw, {
    Iconv,
    skipHtmlToText: true,
    skipTextLinks: true,
    skipTextToHtml: true,
    skipImageLinks: true,
    maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
  });

  console.log('object', object);
  console.log('mail', mail);

  // inherit properties from `mail` object
  Object.assign(object, mail);

  // TODO: document that you can do this
  if (ctx.query.attachments === 'false') delete object.attachments;

  // TODO: document that you can do this
  if (ctx.query.raw !== 'false') object.raw = raw;

  console.log('final object', object);

  return object;
}

async function list(ctx) {
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

  //
  // TODO: use regex/pcre similar to onSearch
  //
  // Search in message body/text
  if (ctx.query.body || ctx.query.text) {
    const searchText = ctx.query.body || ctx.query.text;
    // TODO: finish this
    // TODO: finish this
    // TODO: finish this
    // TODO: finish this
    searchConditions.push({
      $or: [
        { text: { $regex: searchText, $options: 'i' } },
        { html: { $regex: searchText, $options: 'i' } },
        { raw: { $regex: searchText, $options: 'i' } }
      ]
    });
  }

  // TODO: redo this
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

  // TODO: redo this
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

  // TODO: redo this
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

  // TODO: redo this
  // Search in headers
  if (ctx.query.headers) {
    searchConditions.push({
      headers: { $regex: ctx.query.headers, $options: 'i' }
    });
  }

  // Search in message ID
  if (ctx.query.message_id) {
    searchConditions.push({
      msgid: { $regex: ctx.query.message_id, $options: 'i' }
    });
  }

  // TODO: redo this
  // General search across multiple fields
  if (ctx.query.search || ctx.query.q) {
    const searchTerm = ctx.query.search || ctx.query.q;
    // TODO: finish this
    // TODO: finish this
    // TODO: finish this
    // TODO: finish this
    // TODO: finish this
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
          { created_at: dateQuery }
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

  ctx.body = await (Array.isArray(messages)
    ? Promise.all(messages.map((message) => json(ctx, message)))
    : Promise.resolve([]));
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate request body exists and is an object
  if (!_.isPlainObject(ctx.request.body))
    throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));

  // this will throw any errors if necessary
  const message = getNodemailerMessageFromRequest(ctx);

  const mail = new MailComposer(message);
  const stream = mail.compile().createReadStream();
  const raw = await getStream.buffer(stream);

  // Find or create the target mailbox
  let mailbox;
  const folderPath = body.folder || 'INBOX';

  mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
    path: folderPath
  });

  // create mailbox if it does not exist
  if (!mailbox) {
    try {
      const [, mailboxId] = await onCreatePromise.call(
        ctx.instance,
        body.path,
        ctx.state.session
      );
      mailbox = await Mailboxes.findById(
        ctx.instance,
        ctx.state.session,
        mailboxId
      );
    } catch (_err) {
      // since we use multiArgs from pify
      // if a promise that was wrapped with multiArgs: true
      // throws, then the error will be an array so we need to get first key
      let err = _err;
      if (Array.isArray(err)) err = _err[0];
      throw err;
    }
  }

  const flags = [];
  if (typeof body.flags === 'string') flags.push(body.flags);
  else if (Array.isArray(body.flags)) flags.push(...body.flags);

  try {
    const [, response] = await onAppendPromise.call(
      this,
      mailbox.path,
      flags,
      message.date,
      raw,
      {
        ...ctx.state.session,
        // don't append duplicate messages
        checkForExisting: true
      }
    );

    const message = await Messages.findById(
      ctx.instance,
      ctx.state.session,
      response.id
    );

    if (!message) {
      throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));
    }

    ctx.body = await json(ctx, message);
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

  // TODO: support ?eml=true in API docs
  if (boolean(ctx.query.eml)) {
    // similar to 'rfc822' case in `helpers/get-query-response.js`
    // (value is a stream)
    const { value } = indexer.getContents(
      message.mimeTree,
      false,
      {},
      ctx.instance,
      ctx.state.session
    );
    ctx.body = value;
    return;
  }

  ctx.body = await json(ctx, message);
}

// TODO: rewrite this
// TODO: call onMove before onStore so that flags update (?)
async function update(ctx) {
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

  ctx.body = await json(ctx, message);
}

// TODO: rewrite this
async function remove(ctx) {
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

  // TODO: rewrite this

  ctx.body = { message: 'Message deleted successfully' };
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
