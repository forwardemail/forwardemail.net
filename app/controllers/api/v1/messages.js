/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const MailComposer = require('nodemailer/lib/mail-composer');
const ObjectID = require('bson-objectid');
const bytes = require('@forwardemail/bytes');
const getStream = require('get-stream');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { Builder } = require('json-sql-enhanced');
const { Iconv } = require('iconv');
const { boolean } = require('boolean');
const { simpleParser } = require('mailparser');

const Aliases = require('#models/aliases');
const AttachmentStorage = require('#helpers/attachment-storage');
const Indexer = require('#helpers/indexer');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const _ = require('#helpers/lodash');
const env = require('#config/env');
const getNodemailerMessageFromRequest = require('#helpers/get-nodemailer-message-from-request');
const i18n = require('#helpers/i18n');
const recursivelyParse = require('#helpers/recursively-parse');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const { decodeMetadata } = require('#helpers/msgpack-helpers');

const builder = new Builder({ bufferAsNative: true });
const attachmentStorage = new AttachmentStorage();
const indexer = new Indexer({
  attachmentStorage
});

const onAppend = require('#helpers/imap/on-append');
const onExpunge = require('#helpers/imap/on-expunge');
const onCreate = require('#helpers/imap/on-create');
const onMove = require('#helpers/imap/on-move');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const onExpungePromise = pify(onExpunge, { multiArgs: true });
const onCreatePromise = pify(onCreate, { multiArgs: true });
const onMovePromise = pify(onMove, { multiArgs: true });

// SMTP message headers in lowercase, including common and uncommon headers
// Standard headers are defined in RFC 5322 and related RFCs
// X- headers are non-standard, often proprietary or system-specific
// Headers are case-insensitive per RFC 5322, presented here in lowercase
const SMTP_HEADERS = [
  // Common SMTP Headers
  'from', // Sender's email address (e.g., from: user@example.com)
  'to', // Primary recipient(s) (e.g., to: recipient@example.com)
  'cc', // Carbon copy recipients (e.g., cc: other@example.com)
  'bcc', // Blind carbon copy recipients (not visible to others)
  'subject', // Email subject line (e.g., subject: meeting tomorrow)
  'date', // Date and time sent (e.g., date: thu, 17 jul 2025 04:21:00 -0500)
  'message-id', // Unique message identifier (e.g., message-id: <123456789@example.com>)
  'reply-to', // Reply address (e.g., reply-to: reply@example.com)
  'in-reply-to', // Message-id of replied-to message (e.g., in-reply-to: <987654321@example.com>)
  'references', // Message-ids for threading (e.g., references: <123@example.com> <456@example.com>)
  'sender', // Actual sender if different from 'from' (e.g., sender: agent@example.com)
  'received', // Tracks message path through servers (e.g., received: from mail.example.com)
  'return-path', // Address for bounce messages (e.g., return-path: bounce@example.com)
  'content-type', // MIME type of body (e.g., content-type: text/plain; charset=utf-8)
  'content-transfer-encoding', // Body encoding (e.g., content-transfer-encoding: quoted-printable)
  'mime-version', // MIME version (e.g., mime-version: 1.0)
  'content-disposition', // Content handling (e.g., content-disposition: attachment; filename="file.txt")
  'content-id', // Identifier for embedded content (e.g., content-id: <img123@example.com>)
  'content-description', // Content description (e.g., content-description: attached image)
  'content-language', // Language of content (e.g., content-language: en-us)
  'importance', // Message priority (e.g., importance: high)
  'priority', // Alternate priority header (e.g., priority: urgent)
  'sensitivity', // Sensitivity level (e.g., sensitivity: confidential)
  'x-sender', // Non-standard sender info (e.g., x-sender: user@example.com)
  'x-receiver', // Non-standard recipient info (e.g., x-receiver: recipient@example.com)
  'x-priority', // Non-standard priority (e.g., x-priority: 1)
  'x-msmail-priority', // Microsoft-specific priority (e.g., x-msmail-priority: high)
  'x-mimeole', // Microsoft-specific MIME header (e.g., x-mimeole: produced by microsoft mimeole v6.0)
  'x-mailer', // Email client identifier (e.g., x-mailer: thunderbird 91.0)

  // Uncommon SMTP Headers
  'delivered-to', // Final delivery address (e.g., delivered-to: final@example.com)
  'resent-from', // Sender of resent message (e.g., resent-from: forwarder@example.com)
  'resent-to', // Recipient of resent message (e.g., resent-to: newrecipient@example.com)
  'resent-date', // Date of resending (e.g., resent-date: thu, 17 jul 2025 04:21:00 -0500)
  'resent-message-id', // Message-id for resent message (e.g., resent-message-id: <789@example.com>)
  'list-id', // Mailing list identifier (e.g., list-id: <listname.example.com>)
  'list-unsubscribe', // Unsubscribe URL/email (e.g., list-unsubscribe: <https://example.com/unsubscribe>)
  'list-subscribe', // Subscribe URL/email (e.g., list-subscribe: <https://example.com/subscribe>)
  'list-help', // Mailing list help URL/email (e.g., list-help: <mailto:help@example.com>)
  'list-post', // Mailing list posting address (e.g., list-post: <mailto:list@example.com>)
  'list-archive', // Mailing list archive URL (e.g., list-archive: <https://example.com/archive>)
  'dkim-signature', // DKIM authentication signature (e.g., dkim-signature: v=1; a=rsa-sha256; ...)
  'domainkey-signature', // Older DomainKeys signature (e.g., domainkey-signature: a=rsa; ...)
  'arc-seal', // ARC seal for authentication (e.g., arc-seal: i=1; a=rsa-sha256; ...)
  'arc-message-signature', // ARC message signature (e.g., arc-message-signature: i=1; a=rsa-sha256; ...)
  'arc-authentication-results', // ARC authentication results (e.g., arc-authentication-results: i=1; ...)
  'authentication-results', // Authentication check results (e.g., authentication-results: spf=pass)
  'x-spam-score', // Spam filter score (e.g., x-spam-score: 2.3)
  'x-spam-status', // Spam filter status (e.g., x-spam-status: no, score=2.3)
  'x-virus-scanned', // Virus scan status (e.g., x-virus-scanned: clean)
  'x-original-to', // Original recipient before aliasing (e.g., x-original-to: alias@example.com)
  'x-forwarded-to', // Forwarding address (e.g., x-forwarded-to: newaddress@example.com)
  'x-forwarded-for', // Forwarding sender (e.g., x-forwarded-for: forwarder@example.com)
  'x-auto-response-suppress', // Suppress auto-responses (e.g., x-auto-response-suppress: oof)
  'x-loop', // Prevent mail loops (e.g., x-loop: mailer-daemon@example.com)
  'precedence', // Message precedence (e.g., precedence: bulk)
  'errors-to', // Error notification address (e.g., errors-to: errors@example.com)
  'x-beenthere', // Mailing list processing indicator (e.g., x-beenthere: list@example.com)
  'x-mailing-list', // Mailing list software (e.g., x-mailing-list: mailman v2.1)
  'x-original-message-id', // Original message-id (e.g., x-original-message-id: <orig123@example.com>)
  'x-envelope-from', // Envelope sender (e.g., x-envelope-from: envsender@example.com)
  'x-envelope-to', // Envelope recipient (e.g., x-envelope-to: envrecipient@example.com)
  'x-rcpt-to', // SMTP envelope recipient (e.g., x-rcpt-to: rcpt@example.com)
  'x-ms-exchange-organization-authas', // Exchange authentication (e.g., x-ms-exchange-organization-authas: internal)
  'x-ms-exchange-transport-endtoendlatency', // Exchange transport latency (e.g., x-ms-exchange-transport-endtoendlatency: 00:00:01)
  'x-originating-ip', // Sender's IP address (e.g., x-originating-ip: [192.168.1.1])
  'x-remote-ip', // Remote server IP (e.g., x-remote-ip: [10.0.0.1])
  'x-message-info', // Proprietary message info (e.g., x-message-info: encrypted)
  'x-ms-tnef-correlator', // Microsoft TNEF correlation (e.g., x-ms-tnef-correlator: <tnef123>)
  'x-source', // Message source (e.g., x-source: webmail)
  'x-source-args', // Source arguments (e.g., x-source-args: webmail v1.0)
  'x-source-dir', // Source directory (e.g., x-source-dir: /var/mail)
  'x-apparently-to', // Apparent recipient (e.g., x-apparently-to: user@example.com)
  'x-comment', // Arbitrary comment (e.g., x-comment: internal use only)
  'x-face', // Encoded sender image (rare, e.g., x-face: <encoded_image>)
  'x-ref', // External tracking reference (e.g., x-ref: ticket123)
  'x-user-agent', // Alternate client identifier (e.g., x-user-agent: outlook 16.0)
  'x-ms-has-attach', // Indicates attachments (e.g., x-ms-has-attach: yes)
  'x-ms-exchange-crosstenant-originalarrivaltime', // Exchange cross-tenant timestamp (e.g., x-ms-exchange-crosstenant-originalarrivaltime: 17 jul 2025 04:21:00 -0500)
  'x-report-abuse', // Abuse reporting URL/email (e.g., x-report-abuse: <mailto:abuse@example.com>)
  'x-feedback-id', // Feedback loop identifier (e.g., x-feedback-id: campaign123)
  'x-campaign', // Marketing campaign identifier (e.g., x-campaign: summer_sale_2025)
  'x-campaign-id', // Alternate campaign identifier (e.g., x-campaign-id: 7890)
  'x-bounce-tracking', // Bounce tracking identifier (e.g., x-bounce-tracking: bounce789)
  'x-scl', // Spam confidence level (e.g., x-scl: 3)
  'x-delivery-context', // Delivery context (e.g., x-delivery-context: bulk)
  'x-ms-publictraffictype' // Microsoft traffic type (e.g., x-ms-publictraffictype: email)
];

function convertToPureObject(data) {
  // Handle primitive types and null directly
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Handle Map objects
  if (data instanceof Map) {
    const obj = {};
    for (const [key, value] of data) {
      obj[key] = convertToPureObject(value); // Recursively convert values
    }

    return obj;
  }

  // Handle Set objects
  if (data instanceof Set) {
    const arr = [];
    for (const value of data) {
      arr.push(convertToPureObject(value)); // Recursively convert values
    }

    return arr;
  }

  // Handle Array objects
  if (_.isArray(data)) {
    return data.map((item) => convertToPureObject(item)); // Recursively convert array elements
  }

  // Handle plain objects
  if (_.isPlainObject(data)) {
    const newObj = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObj[key] = convertToPureObject(data[key]); // Recursively convert object properties
      }
    }

    return newObj;
  }

  // Fallback for other unexpected types (e.g., Date, RegExp)
  return data;
}

/**
 * Decode compressed fields from raw SQL message results.
 * Raw SQL queries bypass mongoose getters, so we need to manually decode
 * brotli-compressed BLOB fields (mimeTree, envelope, bodystructure, attachments, flags)
 * and JSON text fields (headers).
 *
 * @param {Object} message - Raw message object from SQL query
 * @returns {Object} - Message with decoded fields
 */
function decodeRawMessage(message) {
  if (!message || typeof message !== 'object') {
    return message;
  }

  // Decode brotli-compressed BLOB fields (Mixed/Array types without sqliteQueryable)
  // These are stored as compressed BLOBs and need decodeMetadata
  const compressedFields = [
    'mimeTree',
    'envelope',
    'bodystructure',
    'attachments',
    'flags'
  ];

  for (const field of compressedFields) {
    if (message[field] !== undefined && message[field] !== null) {
      message[field] = decodeMetadata(message[field], recursivelyParse);
    }
  }

  // Decode JSON text fields (Mixed type with sqliteQueryable: true)
  // These are stored as plain JSON text and just need parsing
  if (
    message.headers !== undefined &&
    message.headers !== null &&
    typeof message.headers === 'string'
  ) {
    message.headers = recursivelyParse(message.headers);
  }

  return message;
}

async function json(ctx, message) {
  // run in parallel
  const [mailbox, data] = await Promise.all([
    typeof message.mailbox.path === 'string'
      ? Promise.resolve(message.mailbox)
      : await Mailboxes.findById(
          ctx.instance,
          ctx.state.session,
          message.mailbox,
          {
            // we only need path and _id
            _id: true,
            path: true
          }
        ),
    (async () => {
      // similar to 'rfc822' case in `helpers/get-query-response.js`
      // (value is a stream)
      const { value } = indexer.getContents(
        typeof message.mimeTree === 'object'
          ? message.mimeTree
          : JSON.parse(message.mimeTree),
        false,
        {},
        ctx.instance,
        ctx.state.session
      );

      const raw = await getStream.buffer(value);
      const nodemailer = await simpleParser(raw, {
        Iconv,
        skipHtmlToText: true,
        skipTextLinks: true,
        skipTextToHtml: true,
        skipImageLinks: true,
        maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
      });
      return { raw, nodemailer };
    })()
  ]);

  // Transform message data for API response
  const object = {
    // id
    id: message._id,

    // root -> root_id
    root_id: message.root,

    // folder_id (mailbox)
    folder_id: mailbox?._id,

    // folder_path (mailbox's path - just a user-friendly property we added)
    folder_path: mailbox?.path,

    // thread -> thread_id
    thread_id: message.thread,

    // msgid -> header_message_id
    header_message_id: message.msgid,

    //
    // NOTE: we are suppressing the values used for rebuilding mimetree
    //       unless users request that we add this to API we're omitting it
    //       (this will drastically reduce size of payloads sent in responses)
    //
    // - mimeTree
    // - bodystructure
    // - magic
    // - te1t
    // - fingerprint
    // - headers
    // - attachments
    //

    // unseen (replaced by `is_unread`)
    is_unread: !message.flags.includes('\\Seen'),

    // flagged (replaced by `is_flagged`)
    is_flagged: message.flags.includes('\\Flagged'),

    // undeleted (replaced by `is_deleted`)
    is_deleted: message.flags.includes('\\Deleted'),

    // draft (replaced by `is_draft`)
    is_draft: message.flags.includes('\\Draft'),

    // junk -> is_junk
    is_junk: message.junk,

    // is_encrypted
    is_encrypted: Boolean(message.is_encrypted),

    // copied -> is_copied
    is_copied: message.copied,

    // searchable -> is_searchable
    is_searchable: message.searchable,

    // exp -> is_expired
    is_expired: message.exp,

    // ha -> has_attachment
    has_attachment: message.ha,

    // rdate -> retention_date
    retention_date: message.rdate,

    // idate -> internal_date
    internal_date: message.idate,

    // hdate -> header_date
    header_date: message.hdate,

    // subject
    subject: message.subject,

    flags: message.flags,
    labels: message.labels || [],
    size: message.size,
    uid: message.uid,
    modseq: message.modseq,
    transaction: message.transaction,

    // remoteAddress -> remote_address
    remote_address: message.remoteAddress,

    // created_at
    created_at: message.created_at,

    // updated_at
    updated_at: message.updated_at
  };

  if (ctx.query.nodemailer !== 'false')
    object.nodemailer = convertToPureObject(data.nodemailer);

  if (ctx.query.attachments === 'false') delete object?.nodemailer?.attachments;

  if (ctx.query.raw !== 'false') object.raw = data.raw.toString();

  // keep this last
  object.object = 'message';

  return object;
}

async function list(ctx) {
  const query = {};

  // Filter by folder/mailbox if specified
  if (isSANB(ctx.query.folder)) {
    const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path: ctx.query.folder
    });

    // don't show any results if folder does not exist
    query.mailbox = mailbox ? mailbox._id.toString() : null;
  }

  // Advanced search functionality
  const searchConditions = [];

  //
  // Filter by flags
  //

  // unseen (replaced by `is_unread`)
  if (ctx.query.is_unread !== undefined) {
    searchConditions.push({ unseen: boolean(ctx.query.is_unread) ? 1 : 0 });
  }

  // flagged (replaced by `is_flagged`)
  if (ctx.query.is_flagged !== undefined) {
    searchConditions.push({ flagged: boolean(ctx.query.is_flagged) ? 1 : 0 });
  }

  // undeleted (replaced by `is_deleted`)
  if (ctx.query.is_deleted !== undefined) {
    searchConditions.push({ undeleted: boolean(ctx.query.is_deleted) ? 0 : 1 });
  }

  // draft (replaced by `is_draft`)
  if (ctx.query.is_draft !== undefined) {
    searchConditions.push({ draft: boolean(ctx.query.is_draft) ? 1 : 0 });
  }

  // junk -> is_junk
  if (ctx.query.is_junk !== undefined) {
    searchConditions.push({ junk: boolean(ctx.query.is_junk) ? 1 : 0 });
  }

  // copied -> is_copied
  if (ctx.query.is_copied !== undefined) {
    searchConditions.push({ copied: boolean(ctx.query.is_copied) ? 1 : 0 });
  }

  // is_encrypted
  if (ctx.query.is_encrypted !== undefined) {
    searchConditions.push({
      is_encrypted: boolean(ctx.query.is_encrypted) ? 1 : 0
    });
  }

  // searchable -> is_searchable
  if (ctx.query.is_searchable !== undefined) {
    searchConditions.push({
      searchable: boolean(ctx.query.is_searchable) ? 1 : 0
    });
  }

  // exp -> is_expired
  if (ctx.query.is_expired !== undefined) {
    searchConditions.push({ exp: boolean(ctx.query.is_expired) ? 1 : 0 });
  }

  // Has attachments filter (plural and singular supported - dummy proof)
  // ha -> has_attachment
  if (ctx.query.has_attachments !== undefined) {
    const hasAttachments = boolean(ctx.query.has_attachments);
    searchConditions.push({ ha: hasAttachments ? 1 : 0 });
  }

  if (ctx.query.has_attachment !== undefined) {
    const hasAttachment = boolean(ctx.query.has_attachment);
    searchConditions.push({ ha: hasAttachment ? 1 : 0 });
  }

  // Search in subject
  if (isSANB(ctx.query.subject)) {
    searchConditions.push({
      subject: { $regex: ctx.query.subject, $options: 'i' }
    });
  }

  // Search in message body/text
  if (isSANB(ctx.query.body) || isSANB(ctx.query.text)) {
    const searchText = isSANB(ctx.query.body) ? ctx.query.body : ctx.query.text;
    searchConditions.push({
      text: { $regex: searchText, $options: 'i' }
    });
  }

  // Optimize: Collect all requested headers first, then execute in parallel
  const requestedHeaders = [];
  for (const header of SMTP_HEADERS) {
    // Skip if header not in query or is subject (handled separately above)
    if (!isSANB(ctx.query[header]) || header === 'subject') continue;
    requestedHeaders.push(header);
  }

  // Only execute WSP requests if there are headers to search
  if (requestedHeaders.length > 0) {
    // Build all queries in parallel
    const headerQueries = requestedHeaders.map((header) => {
      const regex =
        '(?i)' + // case insensitive (PCRE_CASELESS)
        _.escapeRegExp(ctx.query[header]);

      const sql = {
        query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') REGEXP $p2;`,
        values: { p1: header, p2: regex }
      };

      return ctx.instance.wsp.request({
        action: 'stmt',
        session: { user: ctx.state.session.user },
        stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
      });
    });

    // Execute all queries in parallel
    const results = await Promise.all(headerQueries);

    // Add all results to search conditions
    for (const ids of results) {
      searchConditions.push({
        _id: {
          $in: ids.map((id) => id.toString())
        }
      });
    }
  }

  // Search in headers
  if (isSANB(ctx.query.headers)) {
    //
    // headers can be "headers=X-Priority"
    // it can also be "headers=X-Priority:1"
    //
    if (ctx.query.headers.includes(':')) {
      const [key, value] = ctx.query.headers.split(':', 2);
      const regex =
        '(?i)' + // case insensitive (PCRE_CASELESS)
        _.escapeRegExp(value.toLowerCase().trim());

      const sql = {
        query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') REGEXP $p2;`,
        values: { p1: key.toLowerCase().trim(), p2: regex }
      };

      const ids = await ctx.instance.wsp.request({
        action: 'stmt',
        session: { user: ctx.state.session.user },
        stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
      });

      searchConditions.push({
        _id: {
          $in: ids.map((id) => id.toString())
        }
      });
    } else {
      const regex =
        '(?i)' + // case insensitive (PCRE_CASELESS)
        _.escapeRegExp(ctx.query.headers);

      const sql = {
        query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.value') REGEXP $p1;`,
        values: { p1: regex }
      };

      const ids = await ctx.instance.wsp.request({
        action: 'stmt',
        session: { user: ctx.state.session.user },
        stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
      });

      searchConditions.push({
        _id: {
          $in: ids.map((id) => id.toString())
        }
      });
    }
  }

  // Search in message ID
  if (isSANB(ctx.query.message_id)) {
    searchConditions.push({
      msgid: { $regex: ctx.query.message_id, $options: 'i' }
    });
  }

  // General search across multiple fields
  if (isSANB(ctx.query.search) || isSANB(ctx.query.q)) {
    const searchTerm = isSANB(ctx.query.search)
      ? ctx.query.search
      : ctx.query.q;
    // NOTE: this searches both text and headers via $or
    const regex =
      '(?i)' + // case insensitive (PCRE_CASELESS)
      _.escapeRegExp(searchTerm);

    const sql = {
      query: `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.value') REGEXP $p1;`,
      values: { p1: regex }
    };

    const headerIds = await ctx.instance.wsp.request({
      action: 'stmt',
      session: { user: ctx.state.session.user },
      stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
    });

    searchConditions.push({
      $or: [
        {
          _id: {
            $in: headerIds.map((id) => id.toString())
          }
        },
        {
          text: { $regex: searchTerm, $options: 'i' }
        }
      ]
    });
  }

  // Date range filtering
  if (ctx.query.since || ctx.query.before) {
    const dateQuery = {};

    if (ctx.query.since) {
      const sinceDate = new Date(ctx.query.since);
      if (!Number.isNaN(sinceDate.getTime())) {
        dateQuery.$gte = sinceDate.toISOString();
      }
    }

    if (ctx.query.before) {
      const beforeDate = new Date(ctx.query.before);
      if (!Number.isNaN(beforeDate.getTime())) {
        dateQuery.$lt = beforeDate.toISOString();
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

  // Combine all search conditions
  if (searchConditions.length > 0) {
    query.$and = searchConditions;
  }

  // Build the count subquery
  const countSql = builder.build({
    type: 'select',
    table: 'Messages',
    condition: query,
    fields: [{ expression: 'COUNT(*)' }]
  });

  const opts = {
    type: 'select',
    table: 'Messages',
    condition: query,
    fields: [
      '*',
      {
        expression: `(${countSql.query})`,
        alias: 'total_count'
      }
    ],
    limit: ctx.query.limit,
    offset: ctx.paginate.skip,
    sort: { created_at: -1 }
  };

  const sql = builder.build(opts);

  // Get messages with pagination using single query with subquery
  const messages = await ctx.instance.wsp.request({
    action: 'stmt',
    session: { user: ctx.state.session.user },
    stmt: [
      ['prepare', sql.query],
      ['all', sql.values]
    ]
  });

  // Extract count - if no results, run count query separately
  let itemCount = 0;
  if (messages.length > 0) {
    itemCount = messages[0].total_count;
    // Remove total_count from all messages
    for (const message of messages) {
      delete message.total_count;
    }
  } else {
    // No results from main query, but we still need the count
    const countResult = await ctx.instance.wsp.request({
      action: 'stmt',
      session: { user: ctx.state.session.user },
      stmt: [
        ['prepare', countSql.query],
        ['get', countSql.values]
      ]
    });

    if (countResult && typeof countResult['COUNT(*)'] === 'number') {
      itemCount = countResult['COUNT(*)'];
    }
  }

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Set pagination headers
  setPaginationHeaders(
    ctx,
    pageCount,
    ctx.query.page,
    messages.length,
    itemCount
  );

  // lookup mailboxes for each and populate
  const mailboxes = await Mailboxes.find(ctx.instance, ctx.state.session, {
    _id: {
      $in: _.uniq(messages.map((m) => m.mailbox.toString()))
    }
  });

  // create a mapping for easy lookup
  const mapping = {};
  for (const mailbox of mailboxes) {
    const id = mailbox._id.toString();
    if (mapping[id]) continue;
    mapping[id] = mailbox;
  }

  // iterate over each and populate mailbox object
  for (const message of messages) {
    if (mapping[message.mailbox.toString()])
      message.mailbox = mapping[message.mailbox.toString()];
  }

  // Decode compressed fields from raw SQL results before passing to json()
  // Raw SQL queries bypass mongoose getters, so we need to manually decode
  for (const message of messages) {
    decodeRawMessage(message);
  }

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
  let folderPath = 'INBOX';

  if (body.folder !== undefined) {
    // Validate required fields
    if (!isSANB(body.folder))
      throw Boom.badRequest(ctx.translateError('FOLDER_NAME_OR_PATH_REQUIRED'));
    folderPath = body.folder;
  }

  mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
    path: folderPath
  });

  // create mailbox if it does not exist
  if (mailbox) {
    //
    // NOTE: onCreatePromise below will check alias quota
    //       so this is why we only have it here
    //

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
      throw Boom.forbidden(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
      );
  } else {
    try {
      const [, mailboxId] = await onCreatePromise.call(
        ctx.instance,
        folderPath,
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

  // Parse labels from request body (similar to flags handling)
  let labels = [];
  if (body.labels !== undefined) {
    if (isSANB(body.labels)) {
      labels = [body.labels];
    } else if (Array.isArray(body.labels)) {
      // must be [] or [ label, label, label ]
      if (!_.isEmpty(body.labels) && body.labels.every((l) => !isSANB(l)))
        throw Boom.badRequest(ctx.translateError('MESSAGE_LABELS_INVALID'));
      labels = body.labels;
    } else {
      throw Boom.badRequest(ctx.translateError('MESSAGE_LABELS_INVALID'));
    }
  }

  try {
    const [, response] = await onAppendPromise.call(
      ctx.instance,
      mailbox.path,
      flags,
      mail.date || new Date(),
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

    // Apply labels if provided
    // (validation, normalization, and max limit enforcement happens in model's pre-validate hook)
    if (labels.length > 0) {
      message.labels = labels;
      message.remoteAddress = ctx.ip;
      message.transaction = 'API';
      message.instance = ctx.instance;
      message.session = ctx.state.session;
      message.isNew = false;
      await message.save();
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

  if (!message)
    throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));

  if (boolean(ctx.query.eml)) {
    // similar to 'rfc822' case in `helpers/get-query-response.js`
    // (value is a stream)
    const { value } = indexer.getContents(
      typeof message.mimeTree === 'object'
        ? message.mimeTree
        : JSON.parse(message.mimeTree),
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

//
// NOTE: this supports modifying the message through the following fields:
//       - flags
//       - labels
//       - folder
//
async function update(ctx) {
  const { body } = ctx.request;

  // Validate message ID
  if (!ObjectID.isValid(ctx.params.id)) {
    throw Boom.badRequest(ctx.translateError('MESSAGE_INVALID_ID'));
  }

  let message = await Messages.findOne(ctx.instance, ctx.state.session, {
    _id: ctx.params.id
  });

  if (!message)
    throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));

  if (body.folder !== undefined) {
    // Validate required fields
    if (!isSANB(body.folder))
      throw Boom.badRequest(ctx.translateError('FOLDER_NAME_OR_PATH_REQUIRED'));

    // Find target mailbox
    let mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
      path: body.folder
    });

    // create mailbox if it does not exist
    if (mailbox) {
      //
      // NOTE: onCreatePromise below will check alias quota
      //       so this is why we only have it here
      //

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
        throw Boom.forbidden(
          i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
        );
    } else {
      try {
        const [, mailboxId] = await onCreatePromise.call(
          ctx.instance,
          body.folder,
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

    try {
      await onMovePromise.call(
        ctx.instance,
        message.mailbox,
        {
          destination: mailbox.path,
          _id: message._id,
          silent: true
        },
        ctx.state.session
      );

      message = await Messages.findOne(ctx.instance, ctx.state.session, {
        _id: message._id
      });

      if (!message)
        throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));
    } catch (_err) {
      // since we use multiArgs from pify
      // if a promise that was wrapped with multiArgs: true
      // throws, then the error will be an array so we need to get first key
      let err = _err;
      if (Array.isArray(err)) err = _err[0];
      throw err;
    }
  }

  if (_.isArray(body.flags)) {
    // must be [] or [ Flag, Flag, Flag ]
    if (!_.isEmpty(body.flags) && body.flags.every((f) => !isSANB(f)))
      throw Boom.badRequest(ctx.translateError('MESSAGE_FLAGS_INVALID'));

    message.flags = body.flags;
    message.unseen = !message.flags.includes('\\Seen');
    message.flagged = message.flags.includes('\\Flagged');
    message.undeleted = !message.flags.includes('\\Deleted');
    message.draft = message.flags.includes('\\Draft');
    message.searchable = !message.flags.includes('\\Deleted');
  }

  if (body.labels !== undefined) {
    // convert string to array for single label support
    let { labels } = body;
    if (isSANB(labels)) {
      labels = [labels];
    } else if (!_.isArray(labels)) {
      throw Boom.badRequest(ctx.translateError('MESSAGE_LABELS_INVALID'));
    }

    // must be [] or [ label, label, label ]
    if (!_.isEmpty(labels) && labels.every((l) => !isSANB(l)))
      throw Boom.badRequest(ctx.translateError('MESSAGE_LABELS_INVALID'));

    // validation, normalization, and max limit enforcement
    // happens in the model's pre-validate hook
    message.labels = labels;
  }

  message.remoteAddress = ctx.ip;
  message.transaction = 'API';

  // Set db virtual helpers
  message.instance = ctx.instance;
  message.session = ctx.state.session;
  message.isNew = false;

  await message.save();

  //
  // TODO: we should update `mailbox.flags` similar to onStore function in the future
  //       (in order for mailboxes to have an up to date value of "Flags" on them)
  //

  // get the latest copy of the message to send back
  message = await Messages.findOne(ctx.instance, ctx.state.session, {
    _id: message._id
  });

  if (!message)
    throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));

  if (boolean(ctx.query.eml)) {
    // similar to 'rfc822' case in `helpers/get-query-response.js`
    // (value is a stream)
    const { value } = indexer.getContents(
      typeof message.mimeTree === 'object'
        ? message.mimeTree
        : JSON.parse(message.mimeTree),
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

//
// NOTE: this will not soft delete messages
//       it will delete them permanently
//       (unlike IMAP clients which typically move to Trash folder)
//
async function remove(ctx) {
  // Validate message ID
  if (!ObjectID.isValid(ctx.params.id)) {
    throw Boom.badRequest(ctx.translateError('MESSAGE_INVALID_ID'));
  }

  const message = await Messages.findOne(ctx.instance, ctx.state.session, {
    _id: ctx.params.id
  });

  if (!message)
    throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));

  // mark message for deletion
  message.undeleted = false;

  // Set db virtual helpers
  message.instance = ctx.instance;
  message.session = ctx.state.session;
  message.isNew = false;

  await message.save();

  try {
    await onExpungePromise.call(
      ctx.instance,
      message.mailbox,
      {
        silent: true,
        _id: message._id
      },
      ctx.state.session
    );
  } catch (_err) {
    //
    // NOTE: if an error occurs we want to try to undo the mark for deletion
    //       (this is basically a rollback operation)
    //
    try {
      // undo mark message for deletion
      message.undeleted = true;

      // Set db virtual helpers
      message.instance = ctx.instance;
      message.session = ctx.state.session;
      message.isNew = false;

      await message.save();
    } catch (err) {
      ctx.logger.fatal(err, { message, session: ctx.state.session });
    }

    // since we use multiArgs from pify
    // if a promise that was wrapped with multiArgs: true
    // throws, then the error will be an array so we need to get first key
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    throw err;
  }

  ctx.body = await json(ctx, message);
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
