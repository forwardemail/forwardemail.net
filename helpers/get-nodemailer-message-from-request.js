/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { Libmime } = require('libmime');
const MimeNode = require('nodemailer/lib/mime-node');
const addressParser = require('nodemailer/lib/addressparser');
const { quoteString } = require('nodemailer/lib/mime-funcs');

const _ = require('#helpers/lodash');
const {
  ADDRESS_HEADERS,
  MAX_LENGTH
} = require('#helpers/get-unsafe-address-header');

const libmime = new Libmime();

// RFC 5322 header fields are ASCII; this matches any character that is not
const NON_ASCII_REGEX = /[\u0080-\uFFFF]/;

// fields with a structure of their own (ids, URLs, parameters, trace and
// signature fields) that an encoded-word can not go in, left as they are
const STRUCTURED_FIELDS =
  /^(?:content-|list-|arc-|dkim-|message-id$|in-reply-to$|references$|received$|authentication-results$)/;

// the address fields Nodemailer itself parses (any other is plain text to it)
const NODEMAILER_ADDRESS_FIELDS = new Set([
  'from',
  'sender',
  'to',
  'cc',
  'bcc',
  'reply-to'
]);

// decoded text, or the text as it was if it decodes to nothing (e.g. bad
// base64), with control characters (CR and LF included) as spaces
function decodeText(value) {
  const decoded = libmime.decodeWords(value);
  if (!decoded.trim()) return value;
  // eslint-disable-next-line no-control-regex
  return decoded.replace(/[\u0000-\u001F\u007F]+/g, ' ');
}

// a name may already hold encoded-words, so it is decoded before encoding
function decodeNames(addresses) {
  for (const address of addresses) {
    if (address.name) address.name = decodeText(address.name);
    if (Array.isArray(address.group)) decodeNames(address.group);
  }

  return addresses;
}

// an address field the way Nodemailer builds From or To (only display names
// are encoded, once)
function encodeAddresses(value) {
  return new MimeNode()._convertAddresses(decodeNames(addressParser(value)));
}

// parsed addresses back to a string Nodemailer parses the same way (a name is
// quoted, so a decoded "," or "<" in it stays part of the name)
function formatAddresses(addresses) {
  const quote = (name) => quoteString(name);
  return addresses
    .map((address) => {
      if (Array.isArray(address.group))
        return `${quote(address.name || '')}:${formatAddresses(
          address.group
        )};`;
      if (!address.address) return '';
      return address.name
        ? `${quote(address.name)} <${address.address}>`
        : address.address;
    })
    .filter(Boolean)
    .join(', ');
}

//
// Nodemailer encodes the non-ASCII text of a field, but it takes text that is
// already an encoded-word as it is: in a value that mixes the two it encodes
// the encoded-word a second time, and an encoded display name ends up inside
// quotes (where RFC 2047 does not allow one). So encoded-words in a field are
// decoded first and Nodemailer encodes the whole value once.
//
const hasEncodedWord = (value) =>
  typeof value === 'string' && value.includes('=?');

function decodeAddresses(value) {
  if (Array.isArray(value)) return value.map((v) => decodeAddresses(v));
  if (hasEncodedWord(value))
    return formatAddresses(decodeNames(addressParser(value)));
  if (_.isPlainObject(value) && hasEncodedWord(value.name))
    return { ...value, name: decodeText(value.name) };
  return value;
}

function decodeHeader(key, value) {
  const name = String(key).trim().toLowerCase();
  if (NODEMAILER_ADDRESS_FIELDS.has(name)) return decodeAddresses(value);
  if (STRUCTURED_FIELDS.test(name)) return value;
  if (Array.isArray(value)) return value.map((v) => decodeHeader(key, v));
  if (typeof value !== 'string') return value;
  //
  // Nodemailer would encode the whole value of any other address field
  // (Disposition-Notification-To, Errors-To, Resent-*, ...) address and all,
  // so it is built here like From and sent as it is
  //
  if (ADDRESS_HEADERS.has(name)) {
    if (!hasEncodedWord(value) && !NON_ASCII_REGEX.test(value)) return value;
    const text = encodeAddresses(value);
    // (a prepared value is not cleaned by Nodemailer, so it never has CR or LF)
    return text && !/[\r\n]/.test(text)
      ? { prepared: true, foldLines: true, value: text }
      : value;
  }

  return hasEncodedWord(value) ? decodeText(value) : value;
}

//
// Encode the non-ASCII text in the header fields of a raw message as RFC 2047
// encoded-words, the same way Nodemailer encodes it for a message it builds
// (display names in address fields, words in unstructured fields). An address
// itself is never encoded (a UTF-8 one needs SMTPUTF8). The body, and the
// header of a message with nothing to encode, are left as they are.
//
function encodeRawHeaders(raw) {
  // a message that starts with an empty line has no header section, otherwise
  // it ends at the first empty line (or at the end of a message with no body)
  if (/^\r?\n/.test(raw)) return raw;
  const match = raw.match(/\r?\n\r?\n/);
  const end = match ? match.index : raw.length;
  const head = raw.slice(0, end);
  if (!NON_ASCII_REGEX.test(head)) return raw;

  const newline = /\r\n/.test(match ? match[0] : head) ? '\r\n' : '\n';
  const node = new MimeNode();

  // a line that starts with whitespace continues the field above it
  const fields = [];
  for (const line of head.split(/\r?\n/)) {
    if (/^[ \t]/.test(line) && fields.length > 0)
      fields[fields.length - 1] += newline + line;
    else fields.push(line);
  }

  const encoded = fields.map((field) => {
    const index = field.indexOf(':');
    // (a field over the size limit is left for the header checks to refuse)
    if (index <= 0 || field.length > MAX_LENGTH || !NON_ASCII_REGEX.test(field))
      return field;
    const key = field.slice(0, index);
    const name = key.trim().toLowerCase();
    if (STRUCTURED_FIELDS.test(name)) return field;
    const value = field
      .slice(index + 1)
      .replace(/\r?\n(?=[ \t])/g, '')
      .trim();
    // encoded-words already in the value are decoded first, so they are not
    // encoded a second time (in an address field only display names are)
    const text = ADDRESS_HEADERS.has(name)
      ? encodeAddresses(value)
      : node._encodeHeaderValue(key, decodeText(value));
    // (a field with nothing Nodemailer could keep is left as it was)
    if (!text) return field;
    return libmime.foldLines(`${key}: ${text}`, 76).replace(/\r\n/g, newline);
  });

  return encoded.join(newline) + raw.slice(end);
}

const DSN_FIELDS = ['id', 'return', 'notify', 'recipient'];

function getNodemailerMessageFromRequest(ctx) {
  // <https://nodemailer.com/message/>
  const message = _.pick(ctx.request.body, [
    'from',
    'to',
    'cc',
    'bcc',
    'subject',
    'text',
    'html',
    'attachments',

    'sender',
    'replyTo',
    'inReplyTo',
    'references',

    // envelope (handled below)

    'attachDataUrls',
    'watchHtml',
    'amp',

    'icalEvent',
    'alternatives',
    'encoding',
    'raw',
    'textEncoding',
    'priority',
    'headers',
    'messageId',
    'date',
    'list',

    // <https://nodemailer.com/extras/mailcomposer/#message-fields>
    'newline',

    // RFC 8689 REQUIRETLS support
    'requireTLSExtensionEnabled',
    'requireTLS',

    // dkim (handled by sending job)

    // NOTE: "folder" is special and used only for /v1/messages routes
    ...(ctx.pathWithoutLocale.startsWith('/v1/messages')
      ? ['folder', 'envelope']
      : []),

    'dsn'
  ]);

  // nodemailer naming convention may be confusing so we support both
  if (message.requireTLSExtensionEnabled)
    message.requireTLS = message.requireTLSExtensionEnabled;
  delete message.requireTLSExtensionEnabled;

  // (of a JSON body: it is read as text by what queues the email)
  if (
    message.subject !== undefined &&
    message.subject !== null &&
    typeof message.subject !== 'string'
  )
    throw Boom.badRequest('Nodemailer option "subject" must be a String');

  // dsn: {
  //   id: "msg-123",
  //   return: "headers",
  //   notify: "success",
  //   recipient: "sender@example.com",
  // }
  if (message.dsn !== undefined && !_.isPlainObject(message.dsn))
    throw Boom.badRequest('Nodemailer option "dsn" must be an Object');

  // <https://nodemailer.com/smtp/dsn#dsn-object-fields>
  if (_.isObject(message.dsn)) message.dsn = _.pick(message.dsn, DSN_FIELDS);

  //
  // The from, to, cc, bcc, subject and replyTo fields are passed on as plain
  // text (see decodeAddresses above). Nodemailer encodes whatever is not
  // ASCII in them (emoji included) as it builds each header.
  //
  // Emoji in these fields used to be turned into encoded-words here first.
  // The pattern for "emoji" also covers kana, dashes and curly quotes, so a
  // subject that mixed those with any other non-ASCII text (kanji, accents,
  // Cyrillic) was encoded twice, once here and once by Nodemailer, and
  // recipients saw the inner "=?UTF-8?Q?...?=" as text.
  // <https://github.com/forwardemail/mail.forwardemail.net/issues/130>
  //

  if (hasEncodedWord(message.subject))
    message.subject = decodeText(message.subject);
  for (const key of ['from', 'sender', 'to', 'cc', 'bcc', 'replyTo']) {
    if (message[key] !== undefined)
      message[key] = decodeAddresses(message[key]);
  }

  // custom headers, as an object or as a list of { key, value } (a prepared
  // value is sent as it is by Nodemailer, so it is left alone)
  if (_.isPlainObject(message.headers)) {
    message.headers = _.mapValues(message.headers, (value, key) =>
      _.isPlainObject(value) ? value : decodeHeader(key, value)
    );
  } else if (Array.isArray(message.headers)) {
    message.headers = message.headers.map((header) =>
      _.isPlainObject(header) && !_.isPlainObject(header.value)
        ? { ...header, value: decodeHeader(header.key, header.value) }
        : header
    );
  }

  //
  // A raw message is sent as it is, so its header fields are encoded here.
  // Without this a field with UTF-8 in it (e.g. "Subject: 😊 Hi") goes out
  // as 8-bit text, and the subject stored for the email is read as Latin-1.
  //
  if (isSANB(message.raw)) message.raw = encodeRawHeaders(message.raw);

  // ensure `message.attachments` is an Array if it was set
  if (
    typeof message.attachments !== 'undefined' &&
    !Array.isArray(message.attachments)
  )
    throw Boom.badRequest(
      'Attachments option "attachments" must be an Array if set; https://nodemailer.com/message/attachments/'
    );

  // safeguard to filter out any attachments to prevent fs access
  // first validate that all attachments are objects
  if (
    Array.isArray(message.attachments) &&
    message.attachments.some((a) => typeof a !== 'object' || a === null)
  )
    throw Boom.badRequest(
      '"attachments" must contain only objects; https://nodemailer.com/message/attachments/'
    );

  if (
    Array.isArray(message.attachments) &&
    message.attachments.some((a) => a.path || a.href)
  )
    throw Boom.badRequest(
      '"attachments" cannot use "path" nor "href" properties, please use "content" instead; https://nodemailer.com/message/attachments/'
    );

  // safeguard to filter text/html from using "path" and "href" options
  if (_.isObject(message.text) && (message?.text?.path || message?.text?.href))
    throw Boom.badRequest(
      '"text" cannot use "path" nor "href" properties; https://nodemailer.com/message/attachments/'
    );

  if (_.isObject(message.html) && (message?.html?.path || message?.html?.href))
    throw Boom.badRequest(
      '"html" cannot use "path" nor "href" properties; https://nodemailer.com/message/attachments/'
    );

  if (
    _.isObject(message.watchHtml) &&
    (message?.watchHtml?.path || message?.watchHtml?.href)
  )
    throw Boom.badRequest(
      '"watchHtml" cannot use "path" nor "href" properties; https://nodemailer.com/message/attachments/'
    );

  // safeguard: raw must be a string (RFC 5322 message) — reject object forms
  // that could bypass disableFileAccess/disableUrlAccess (GHSA-p6gq-j5cr-w38f)
  if (typeof message.raw !== 'undefined' && typeof message.raw !== 'string')
    throw Boom.badRequest(
      '"raw" must be a string containing a complete RFC 5322 message'
    );

  // file and url access override for security
  message.disableFileAccess = true;
  message.disableUrlAccess = true;

  return message;
}

module.exports = getNodemailerMessageFromRequest;
