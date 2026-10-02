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
const { Iconv } = require('iconv');
const { boolean } = require('boolean');
const { simpleParser } = require('mailparser');
const imapFormalSyntax = require('@zone-eu/wildduck/imap-core/lib/handler/imap-formal-syntax');
const imapTools = require('@zone-eu/wildduck/imap-core/lib/imap-tools');
const { Builder } = require('#helpers/json-sql');

const Aliases = require('#models/aliases');
const AttachmentStorage = require('#helpers/attachment-storage');
const Indexer = require('#helpers/indexer');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const _ = require('#helpers/lodash');
const env = require('#config/env');
const deriveLabelsFromFlags = require('#helpers/derive-labels-from-flags');
const escapeSqliteLike = require('#helpers/escape-sqlite-like');
const getImapFlags = require('#helpers/get-imap-flags');
const getNodemailerMessageFromRequest = require('#helpers/get-nodemailer-message-from-request');
const i18n = require('#helpers/i18n');
const recursivelyParse = require('#helpers/recursively-parse');
const sendApn = require('#helpers/send-apn');
const sendNotification = require('#helpers/send-notification');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const { decodeMetadata } = require('#helpers/msgpack-helpers');

const builder = new Builder({ bufferAsNative: true });

//
// Every message ID matched by a header or full-text lookup becomes a bound
// variable of the listing query (`_id IN (...)`).  SQLite accepts at most
// 32766 variables per statement (SQLITE_MAX_VARIABLE_NUMBER) and fails the
// whole query beyond that, so a search matching more messages than this has
// to be narrowed by the caller instead of failing with an internal error.
//
const MAX_SEARCH_ID_VARIABLES = 30000;

//
// Header lookups match a literal, case-insensitively, with LIKE.
//
// Indexed header values are stored lowercased (see `generateIndexedHeaders`
// in the message handler), so lowercasing the term in the same way matches
// them regardless of case, non-ASCII characters included.
//
// REGEXP must not be used for user-supplied terms: the sqlite-regex
// extension is optional, and it fails with "utf8 err" for every row of a
// mailbox as soon as one header value is not valid UTF-8 (a header that
// decoded to a lone surrogate is stored as a JSON escape and extracted as
// invalid UTF-8), which broke every header search of such a mailbox.
//
const HEADER_LIKE_KEY_VALUE_SQL = `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.key') = $p1 and json_extract(value, '$.value') LIKE $p2 ESCAPE '\\';`;
const HEADER_LIKE_VALUE_SQL = `select _id from Messages, json_each(Messages.headers) where json_extract(value, '$.value') LIKE $p1 ESCAPE '\\';`;
const SUBJECT_LIKE_SQL = `select _id from Messages where subject LIKE $p1 ESCAPE '\\';`;
const TEXT_LIKE_SQL = `select _id from Messages where text LIKE $p1 ESCAPE '\\';`;
const MESSAGE_ID_LIKE_SQL = `select _id from Messages where msgid LIKE $p1 ESCAPE '\\';`;

function headerLikePattern(value) {
  return `%${escapeSqliteLike(value.toLowerCase())}%`;
}

function messageLikePattern(value) {
  return `%${escapeSqliteLike(value)}%`;
}

async function findMessageIds(ctx, query, values) {
  const ids = await ctx.instance.wsp.request({
    action: 'stmt',
    session: { user: ctx.state.session.user },
    stmt: [['prepare', query], ['pluck'], ['all', values]]
  });

  return Array.isArray(ids) ? ids : [];
}

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

const BOOLEAN_FIELDS = [
  'exp',
  'unseen',
  'flagged',
  'undeleted',
  'draft',
  'copied',
  'ha',
  'searchable',
  'junk',
  'is_encrypted'
];

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
  //
  // NOTE: labels were missing here, so listed messages had them as the
  //       stored bytes ({ "type": "Buffer", ... }) instead of a list
  //
  const compressedFields = [
    'mimeTree',
    'envelope',
    'bodystructure',
    'attachments',
    'flags',
    'labels'
  ];

  for (const field of compressedFields) {
    if (message[field] !== undefined && message[field] !== null) {
      message[field] = decodeMetadata(message[field], recursivelyParse);
    }
  }

  // Booleans are stored as 0 and 1, and are true or false everywhere else
  for (const field of BOOLEAN_FIELDS) {
    if (message[field] === 0 || message[field] === 1)
      message[field] = message[field] === 1;
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

//
// Flags stored through the API are what IMAP clients read back in FETCH
// FLAGS, so they follow the rules IMAP STORE and APPEND apply: a system flag
// IMAP knows (any case, stored the way IMAP writes it) or a keyword of IMAP
// atom characters, at most 255 characters long. A keyword with a space,
// parenthesis or quote cannot be written as an IMAP atom, and clients fail
// to read the flags of that message.
//
const MAX_FLAGS = 100;
const SYSTEM_FLAGS = new Map(
  imapTools.systemFlags.map((flag) => [
    flag,
    flag.replace(/^\\./, (c) => c.toUpperCase())
  ])
);
// eslint-disable-next-line new-cap
const ATOM_CHARS = imapFormalSyntax['ATOM-CHAR']();

function getValidFlag(flag) {
  if (typeof flag !== 'string' || flag.length === 0 || flag.length > 255)
    return;
  if (flag.startsWith('\\')) return SYSTEM_FLAGS.get(flag.toLowerCase());
  if (imapFormalSyntax.verify(flag, ATOM_CHARS) === -1) return flag;
}

//
// `stored` are the flags the message has now. Clients send those back with
// their change, and one stored before flags were checked (or set by an IMAP
// client in a form this check refuses) is kept as it is rather than failing
// every later change to the message.
//
function getValidFlags(ctx, value, { stored = [] } = {}) {
  if (!Array.isArray(value) || value.length > MAX_FLAGS)
    throw Boom.badRequest(ctx.translateError('MESSAGE_FLAGS_INVALID'));

  const flags = [];
  const seen = new Set();
  for (const flag of value) {
    let normalized = getValidFlag(flag);
    if (!normalized) {
      if (!stored.includes(flag))
        throw Boom.badRequest(ctx.translateError('MESSAGE_FLAGS_INVALID'));
      normalized = flag;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    flags.push(normalized);
  }

  return flags;
}

// keywords compare case-insensitively, as in IMAP
function normalizeKeyword(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

// a list of labels, or a single label as a string
function getLabelsInput(ctx, value) {
  if (value === undefined) return;
  const labels = isSANB(value) ? [value] : value;
  // must be [] or [ label, label, label ]
  if (
    !Array.isArray(labels) ||
    (labels.length > 0 && labels.every((l) => !isSANB(l)))
  )
    throw Boom.badRequest(ctx.translateError('MESSAGE_LABELS_INVALID'));
  return labels;
}

// an empty list of changes is no change
function nonEmpty(list) {
  return Array.isArray(list) && list.length > 0 ? list : undefined;
}

// a list of flags, or a single flag as a string
function getFlagsInput(ctx, value, options) {
  if (value === undefined || value === null) return;
  return getValidFlags(ctx, isSANB(value) ? [value] : value, options);
}

//
// INBOX is matched in any case and slashes around a path are dropped, as
// IMAP does (a lowercase "inbox" failed to be found and was then created)
//
function normalizeFolderPath(path) {
  return imapTools.normalizeMailbox(path);
}

//
// A folder by the path a client gave: as stored, or else matched as IMAP
// matches it. Folders created through the API before paths were normalized
// can have a path such as "Inbox/Receipts", which only matches as stored.
//
async function findFolderByPath(ctx, path) {
  const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
    path
  });
  if (mailbox) return mailbox;
  const normalized = normalizeFolderPath(path);
  if (normalized === path) return null;
  return Mailboxes.findOne(ctx.instance, ctx.state.session, {
    path: normalized
  });
}

// a folder to put a message in, as IMAP CREATE accepts it
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
// Create the folder a message goes into. When another request creates it at
// the same moment, that folder is used (the id was missing and the message
// failed with a server error).
//
async function createFolder(ctx, path) {
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

  if (response === 'OVERQUOTA')
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  const mailbox = mailboxId
    ? await Mailboxes.findById(ctx.instance, ctx.state.session, mailboxId)
    : await Mailboxes.findOne(ctx.instance, ctx.state.session, { path });

  if (!mailbox)
    throw Boom.badRequest(ctx.translateError('MAILBOX_CREATION_FAILED'));

  return mailbox;
}

function hasSameFlags(a, b) {
  const set = new Set(a.map((f) => f.toLowerCase()));
  return a.length === b.length && b.every((f) => set.has(f.toLowerCase()));
}

function hasSeenFlag(flags) {
  return flags.some((f) => f.toLowerCase() === '\\seen');
}

//
// IMAP clients (Thunderbird, Apple Mail, ...) learn about changed flags and
// labels from the journal, as after a STORE over IMAP: adding the entry
// raises the message's MODSEQ, so CONDSTORE clients find the change when
// they resync, and wakes clients in IDLE right away. Without it a message
// read, flagged or labeled in webmail kept its old state in those clients
// until they repaired the folder.
//
// It runs after the response, as for a STORE, so a slow journal never holds
// up "mark as read" (the change itself is already saved).
//
function journalFlagChange(ctx, message, previousImapFlags) {
  const imapFlags = getImapFlags(message);
  if (hasSameFlags(previousImapFlags, imapFlags)) return false;

  const aliasId = ctx.state.session.user.alias_id;
  const messageId = message._id;
  ctx.instance.server.notifier
    .addEntries(
      ctx.instance,
      ctx.state.session,
      message.mailbox?._id || message.mailbox,
      {
        command: 'FETCH',
        ignore: ctx.state.session.id,
        uid: message.uid,
        flags: imapFlags,
        message: messageId,
        thread: message.thread,
        unseenChange: hasSeenFlag(previousImapFlags) !== hasSeenFlag(imapFlags)
      }
    )
    .then(() => ctx.instance.server.notifier.fire(aliasId))
    .catch((err) =>
      ctx.logger.fatal(err, { message: messageId, alias_id: aliasId })
    );

  return true;
}

//
// Tell every other client about a flag or label change made here: IMAP
// clients through the journal, WebSocket and push clients through
// `flagsUpdated` and `labelsUpdated` (as after an IMAP STORE, see
// helpers/imap/on-store.js) and Apple Mail through APN.  Nothing is sent
// when the stored flags and labels are the same as before.
//
// The events are published right away, in the order the changes were saved:
// they carry the whole list (`set`), so a "read" overtaken by the "unread"
// after it would leave other clients on the wrong state.  The mailbox path
// is included when the request named the folder (webmail always does).
//
// eslint-disable-next-line max-params
function notifyFlagChange(
  ctx,
  message,
  previousImapFlags,
  previousLabels,
  folder
) {
  const flagsChanged = journalFlagChange(ctx, message, previousImapFlags);
  const labels = Array.isArray(message.labels) ? message.labels : [];
  const labelsChanged = !hasSameFlags(previousLabels, labels);
  if (!flagsChanged && !labelsChanged) return;

  const aliasId = ctx.state.session.user.alias_id;
  const mailboxId = (message.mailbox?._id || message.mailbox).toString();
  const mailbox =
    folder && folder._id.toString() === mailboxId ? folder : undefined;
  const path = mailbox ? { path: mailbox.path } : {};

  if (flagsChanged)
    sendNotification(ctx.client, aliasId, 'flagsUpdated', {
      mailbox: mailboxId,
      ...path,
      action: 'set',
      flags: getImapFlags(message),
      uids: [message.uid]
    });

  if (labelsChanged)
    sendNotification(ctx.client, aliasId, 'labelsUpdated', {
      mailbox: mailboxId,
      ...path,
      action: 'set',
      labels,
      uids: [message.uid]
    });

  // badge counts and unread sync
  if (flagsChanged)
    (mailbox
      ? Promise.resolve(mailbox)
      : Mailboxes.findOne(ctx.instance, ctx.state.session, {
          _id: mailboxId
        })
    )
      .then((mailbox) => {
        if (mailbox) return sendApn(ctx.client, aliasId, mailbox.path);
      })
      .catch((err) => ctx.logger.fatal(err, { alias_id: aliasId }));
}

async function json(ctx, message, { lightweight = false } = {}) {
  // In lightweight mode (used by list endpoint), skip the expensive
  // indexer.getContents + simpleParser call that rebuilds the full MIME tree
  // and fetches all attachment bodies from SQLite. This eliminates N attachment
  // hash lookups per message and avoids CPU-heavy MIME parsing.
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
    lightweight
      ? Promise.resolve(null)
      : (async () => {
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

  // Lightweight list responses still need the identity fields used to render
  // mailbox rows. WildDuck already parsed these values while building mimeTree.
  if (lightweight) {
    const parsedHeader = message.mimeTree?.parsedHeader || {};
    Object.assign(object, {
      from: parsedHeader.from,
      to: parsedHeader.to,
      cc: parsedHeader.cc,
      bcc: parsedHeader.bcc,
      reply_to: parsedHeader['reply-to']
    });
  }

  // In lightweight mode, data is null (no MIME rebuild was performed)
  if (data) {
    if (ctx.query.nodemailer !== 'false')
      object.nodemailer = convertToPureObject(data.nodemailer);

    if (ctx.query.attachments === 'false')
      delete object?.nodemailer?.attachments;

    if (ctx.query.raw !== 'false') object.raw = data.raw.toString();
  }

  // keep this last
  object.object = 'message';

  return object;
}

async function list(ctx) {
  const query = {};

  // Filter by folder/mailbox if specified
  if (isSANB(ctx.query.folder)) {
    const mailbox = await findFolderByPath(ctx, ctx.query.folder);

    // don't show any results if folder does not exist
    query.mailbox = mailbox ? mailbox._id.toString() : null;
  }

  // Advanced search functionality
  const searchConditions = [];

  //
  // Restrict the listing to the given message IDs (see
  // MAX_SEARCH_ID_VARIABLES above).  An empty list yields `_id IN ()`,
  // which SQLite accepts and which matches nothing, so a lookup without
  // results still produces an (empty) page instead of an error.
  //
  let searchIdVariables = 0;
  const addSearchIdCondition = (ids) => {
    const normalized = Array.isArray(ids) ? ids.map((id) => id.toString()) : [];
    searchIdVariables += normalized.length;
    if (searchIdVariables > MAX_SEARCH_ID_VARIABLES)
      throw Boom.badRequest(ctx.translateError('SEARCH_TOO_MANY_RESULTS'));
    searchConditions.push({ _id: { $in: normalized } });
  };

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
    addSearchIdCondition(
      await findMessageIds(ctx, SUBJECT_LIKE_SQL, {
        p1: messageLikePattern(ctx.query.subject)
      })
    );
  }

  // Search in message body/text
  if (isSANB(ctx.query.body) || isSANB(ctx.query.text)) {
    const searchText = isSANB(ctx.query.body) ? ctx.query.body : ctx.query.text;
    if (env.SQLITE_FTS5_ENABLED) {
      // Use FTS5 MATCH for full-text search (indexed, O(log n) instead of O(n))
      // FTS5 tokenizes on word boundaries so we quote the phrase for exact match
      const fts5Query = searchText
        .replace(/"/g, '""') // escape double quotes for FTS5
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => `"${w}"`)
        .join(' ');
      try {
        const ftsIds = await ctx.instance.wsp.request({
          action: 'stmt',
          session: { user: ctx.state.session.user },
          stmt: [
            ['prepare', `SELECT _id FROM Messages_fts WHERE text MATCH $p1`],
            ['pluck'],
            ['all', { p1: fts5Query }]
          ]
        });
        // no FTS5 matches yields an empty result set
        addSearchIdCondition(ftsIds);
      } catch (err) {
        // Graceful fallback if Messages_fts table doesn't exist yet (migration pending)
        if (err.message && err.message.includes('Messages_fts')) {
          addSearchIdCondition(
            await findMessageIds(ctx, TEXT_LIKE_SQL, {
              p1: messageLikePattern(searchText)
            })
          );
        } else {
          throw err;
        }
      }
    } else {
      // Fallback: LIKE '%term%' full table scan
      addSearchIdCondition(
        await findMessageIds(ctx, TEXT_LIKE_SQL, {
          p1: messageLikePattern(searchText)
        })
      );
    }
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
      const sql = {
        query: HEADER_LIKE_KEY_VALUE_SQL,
        values: { p1: header, p2: headerLikePattern(ctx.query[header]) }
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
      if (!Array.isArray(ids)) continue;
      addSearchIdCondition(ids);
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

      const sql = {
        query: HEADER_LIKE_KEY_VALUE_SQL,
        values: {
          p1: key.toLowerCase().trim(),
          p2: headerLikePattern(value.trim())
        }
      };

      const ids = await ctx.instance.wsp.request({
        action: 'stmt',
        session: { user: ctx.state.session.user },
        stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
      });

      addSearchIdCondition(ids);
    } else {
      const sql = {
        query: HEADER_LIKE_VALUE_SQL,
        values: { p1: headerLikePattern(ctx.query.headers) }
      };

      const ids = await ctx.instance.wsp.request({
        action: 'stmt',
        session: { user: ctx.state.session.user },
        stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
      });

      addSearchIdCondition(ids);
    }
  }

  // Search in message ID
  if (isSANB(ctx.query.message_id)) {
    addSearchIdCondition(
      await findMessageIds(ctx, MESSAGE_ID_LIKE_SQL, {
        p1: messageLikePattern(ctx.query.message_id)
      })
    );
  }

  // General search across multiple fields
  if (isSANB(ctx.query.search) || isSANB(ctx.query.q)) {
    const searchTerm = isSANB(ctx.query.search)
      ? ctx.query.search
      : ctx.query.q;
    // NOTE: this searches both text and headers via $or
    const sql = {
      query: HEADER_LIKE_VALUE_SQL,
      values: { p1: headerLikePattern(searchTerm) }
    };

    const headerIds = await findMessageIds(ctx, sql.query, sql.values);

    // For the text portion, use FTS5 MATCH when available
    let textMatchIds = [];
    let fts5Failed = false;
    if (env.SQLITE_FTS5_ENABLED) {
      const fts5Query = searchTerm
        .replace(/"/g, '""')
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => `"${w}"`)
        .join(' ');
      try {
        const ftsResult = await ctx.instance.wsp.request({
          action: 'stmt',
          session: { user: ctx.state.session.user },
          stmt: [
            ['prepare', `SELECT _id FROM Messages_fts WHERE text MATCH $p1`],
            ['pluck'],
            ['all', { p1: fts5Query }]
          ]
        });
        if (Array.isArray(ftsResult)) textMatchIds = ftsResult;
      } catch (err) {
        // Graceful fallback if Messages_fts table doesn't exist yet (migration pending)
        if (err.message && err.message.includes('Messages_fts')) {
          fts5Failed = true;
        } else {
          throw err;
        }
      }
    }

    // Combine header matches and text matches
    const allMatchIds = [...new Set([...headerIds, ...textMatchIds])];
    if (env.SQLITE_FTS5_ENABLED && !fts5Failed) {
      // With FTS5, we already have all text match IDs — no need for LIKE fallback
      // (no matches at all yields an empty result set)
      addSearchIdCondition(allMatchIds);
    } else {
      // Without FTS5 (or if its table is not available), get literal text
      // matches first, then carry the union of text/header IDs into the final
      // list query.  Passing `$regex` to json-sql-enhanced emits SQLite
      // REGEXP, which fails with "utf8 err" if any scanned message text is
      // not valid UTF-8.
      textMatchIds = await findMessageIds(ctx, TEXT_LIKE_SQL, {
        p1: messageLikePattern(searchTerm)
      });
      addSearchIdCondition([...new Set([...headerIds, ...textMatchIds])]);
    }
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
  let messages = await ctx.instance.wsp.request({
    action: 'stmt',
    session: { user: ctx.state.session.user },
    stmt: [
      ['prepare', sql.query],
      ['all', sql.values]
    ]
  });
  if (!Array.isArray(messages)) messages = [];

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
    ? Promise.all(
        messages.map((message) =>
          json(ctx, message, {
            // Opt-in lightweight mode: skip indexer.getContents/simpleParser to avoid
            // N attachment hash lookups and MIME rebuilds per message. Returns metadata
            // only (no nodemailer/raw fields). Use ?lightweight=true for fast listing.
            lightweight: ctx.query.lightweight === 'true'
          })
        )
      )
    : Promise.resolve([]));
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate request body exists and is an object
  if (!_.isPlainObject(ctx.request.body))
    throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));

  // validate everything before a folder is created for the message
  const requestedPath = body.folder === undefined ? 'INBOX' : body.folder;
  const folderPath = getFolderPath(ctx, requestedPath);
  const flags = getFlagsInput(ctx, body.flags) || [];
  const labels = getLabelsInput(ctx, body.labels) || [];

  // this will throw any errors if necessary
  const message = getNodemailerMessageFromRequest(ctx);
  const mail = new MailComposer(message);
  const stream = mail.compile().createReadStream();
  const raw = await getStream.buffer(stream);

  // Find or create the target mailbox
  let mailbox = await findFolderByPath(ctx, requestedPath);

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
    mailbox = await createFolder(ctx, folderPath);
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
      const previousImapFlags = getImapFlags(message);
      const previousLabels = Array.isArray(message.labels)
        ? [...message.labels]
        : [];
      // with the labels the keywords in `flags` already gave it
      // (the requested labels first, so they are kept within the limit)
      message.labels = [...labels, ...previousLabels];
      message.remoteAddress = ctx.ip;
      message.transaction = 'API';
      message.instance = ctx.instance;
      message.session = ctx.state.session;
      message.isNew = false;
      await message.save();
      // clients may have fetched the new message before the labels
      notifyFlagChange(
        ctx,
        message,
        previousImapFlags,
        previousLabels,
        mailbox
      );
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
//       - flags (replaces the flags)
//       - flags_add and flags_remove (change only those flags)
//       - labels (replaces the labels)
//       - labels_add and labels_remove (change only those labels)
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

  //
  // Validate everything before anything changes (a move happens first).
  // Named changes take precedence over a whole list, which is then ignored
  // and not checked: it may be out of date (a flag the server no longer has).
  //
  const stored = Array.isArray(message.flags) ? message.flags : [];
  const flagsAdd = nonEmpty(getFlagsInput(ctx, body.flags_add));
  const flagsRemove = nonEmpty(
    getFlagsInput(ctx, body.flags_remove, { stored })
  );
  const flags =
    flagsAdd || flagsRemove
      ? undefined
      : getFlagsInput(ctx, body.flags, { stored });
  const labelsAdd = nonEmpty(
    body.labels_add === null ? undefined : getLabelsInput(ctx, body.labels_add)
  );
  const labelsRemove = nonEmpty(
    body.labels_remove === null
      ? undefined
      : getLabelsInput(ctx, body.labels_remove)
  );
  const labels =
    labelsAdd || labelsRemove ? undefined : getLabelsInput(ctx, body.labels);

  // the folder the request named, once found or created
  let folder;

  if (body.folder !== undefined) {
    const folderPath = getFolderPath(ctx, body.folder);

    // Find target mailbox
    let mailbox = await findFolderByPath(ctx, body.folder);

    // The folder the message is already in is not a move. Clients send the
    // current folder along with flag and label changes; treating that as a
    // move ran a quota check and a MOVE (write lock, new UID lookups) on
    // every "mark as read".
    const isCurrentMailbox =
      mailbox &&
      mailbox._id.toString() ===
        (message.mailbox?._id || message.mailbox).toString();

    if (!isCurrentMailbox) {
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
        mailbox = await createFolder(ctx, folderPath);
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

    folder = mailbox;
  }

  // flags and labels as other clients saw them before this change
  const previousImapFlags = getImapFlags(message);
  const previousLabels = Array.isArray(message.labels)
    ? [...message.labels]
    : [];
  const previousFlags = new Set(
    (Array.isArray(message.flags) ? message.flags : [])
      .filter((flag) => typeof flag === 'string')
      .map((flag) => flag.toLowerCase())
  );

  if (flagsAdd || flagsRemove) {
    //
    // Change only the named flags, on top of what is stored now. A client
    // that sends its whole list in `flags` overwrites whatever another
    // client changed since it last looked (Thunderbird marking the message
    // read, say), so these take precedence over `flags`.
    //
    const removed = new Set((flagsRemove || []).map((f) => f.toLowerCase()));
    const seen = new Set();
    const next = [];
    for (const flag of [...(message.flags || []), ...(flagsAdd || [])]) {
      if (typeof flag !== 'string') continue;
      const key = flag.toLowerCase();
      if (removed.has(key) || seen.has(key)) continue;
      seen.add(key);
      // a system flag stored in another case ("\\seen") as IMAP writes it
      next.push((flag.startsWith('\\') && SYSTEM_FLAGS.get(key)) || flag);
    }

    message.flags = next;

    // IMAP clients see a label as a keyword, so removing that keyword
    // removes the label as well
    if (removed.size > 0 && Array.isArray(message.labels))
      message.labels = message.labels.filter(
        (label) => !removed.has(normalizeKeyword(label))
      );
  } else if (flags) {
    message.flags = flags;
  }

  //
  // A keyword is a label as well, as when an IMAP client or a Sieve script
  // sets it (see on-store.js and on-append.js), so the keywords a change
  // adds become labels too.  Of a whole list of flags, only the keywords
  // the message did not have count: one it had and lost its label (removed
  // with a whole list of labels, below) stays without one.  A whole list of
  // flags removes no labels: the clients that send one leave keywords out of
  // it, and only flags_remove takes a keyword away (above).
  //
  const addedKeywords = deriveLabelsFromFlags(
    flagsAdd ||
      (flags || []).filter(
        (flag) =>
          typeof flag === 'string' && !previousFlags.has(flag.toLowerCase())
      )
  );
  if (addedKeywords.length > 0)
    message.labels = deriveLabelsFromFlags([
      ...(Array.isArray(message.labels) ? message.labels : []),
      ...addedKeywords
    ]);

  if (flagsAdd || flagsRemove || flags) {
    message.unseen = !message.flags.includes('\\Seen');
    message.flagged = message.flags.includes('\\Flagged');
    message.undeleted = !message.flags.includes('\\Deleted');
    message.draft = message.flags.includes('\\Draft');
    message.searchable = !message.flags.includes('\\Deleted');
  }

  const hasLabelsInput = Boolean(labels || labelsAdd || labelsRemove);

  if (hasLabelsInput) {
    let next = labels;
    if (labelsAdd || labelsRemove) {
      const removed = new Set(
        (labelsRemove || []).map((label) => normalizeKeyword(label))
      );
      next = [
        ...(Array.isArray(message.labels) ? message.labels : []),
        ...(labelsAdd || [])
      ].filter((label) => !removed.has(normalizeKeyword(label)));

      //
      // A keyword an IMAP client sets is kept in the flags as well as in the
      // labels (see on-store.js), and IMAP clients see both. A label removed
      // here comes out of the flags too, or it would stay visible over IMAP
      // and come back as a label. A whole list of labels leaves the flags
      // alone: clients send it from the labels they show, which leave out
      // keywords such as $Forwarded or Junk.
      //
      if (removed.size > 0 && Array.isArray(message.flags))
        message.flags = message.flags.filter(
          (flag) =>
            typeof flag !== 'string' ||
            flag.startsWith('\\') ||
            !removed.has(normalizeKeyword(flag))
        );
    }

    // validation, normalization, and max limit enforcement
    // happens in the model's pre-validate hook
    message.labels = next;
  }

  message.remoteAddress = ctx.ip;
  message.transaction = 'API';

  // Set db virtual helpers
  message.instance = ctx.instance;
  message.session = ctx.state.session;
  message.isNew = false;

  await message.save();

  notifyFlagChange(ctx, message, previousImapFlags, previousLabels, folder);

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

  // `?lightweight=true` returns metadata only (no nodemailer or raw fields),
  // skipping the rebuild and parse of the whole message: clients that only
  // change flags or labels do not need the body back
  ctx.body = await json(ctx, message, {
    lightweight: ctx.query.lightweight === 'true'
  });
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
