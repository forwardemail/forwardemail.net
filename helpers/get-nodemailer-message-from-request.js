/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { Libmime } = require('libmime');

const _ = require('#helpers/lodash');

const EMOJI_HEADERS = ['from', 'to', 'cc', 'bcc', 'subject', 'replyTo'];

// NOTE: tested to be safe using the following package:
//       <https://github.com/fastify/safe-regex2>
const EMOJI_REGEX =
  /(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])/gm;

const libmime = new Libmime();

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
  // users may forget to programmatically encode their emoji
  // so we do this automatically for them for specific headers
  // - from
  // - to
  // - cc
  // - bcc
  // - subject
  // - replyTo
  //
  for (const header of EMOJI_HEADERS) {
    if (isSANB(message[header])) {
      const matches = message[header].match(EMOJI_REGEX);
      if (!matches || !Array.isArray(matches)) continue;
      for (const match of matches) {
        message[header] = message[header].replaceAll(
          match,
          libmime.encodeWord(match)
        );
      }
    }
  }

  // additionally we attempt to parse the body if there was a regex match
  if (isSANB(message.raw)) {
    const hasEmojiRegex = EMOJI_REGEX.test(message.raw);
    if (hasEmojiRegex) {
      //
      // detect the position of the line break in headers
      // if the match is before, then replace, otherwise if it's after then don't
      //
      let index;
      let delimiter;
      if (message.raw.indexOf('\n\n')) {
        index = message.raw.indexOf('\n\n');
        delimiter = '\n\n';
      } else if (message.raw.indexOf('\r\n\r\n')) {
        index = message.raw.indexOf('\r\n\r\n');
        delimiter = '\r\n\r\n';
      }

      if (index && delimiter) {
        let subject = message.raw.slice(0, index);
        const body = message.raw.slice(index + delimiter.length);
        for (const match of message.raw.matchAll(EMOJI_REGEX)) {
          subject = subject.replaceAll(match[0], libmime.encodeWord(match[0]));
        }

        message.raw = [subject, body].join(delimiter);
      }
    }
  }

  // ensure `message.attachments` is an Array if it was set
  if (
    typeof message.attachments !== 'undefined' &&
    !Array.isArray(message.attachments)
  )
    throw Boom.badRequest(
      'Attachments option "attachments" must be an Array if set; https://nodemailer.com/message/attachments/'
    );

  // safeguard to filter out any attachments to prevent fs access
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

  // file and url access override for security
  message.disableFileAccess = true;
  message.disableUrlAccess = true;

  return message;
}

module.exports = getNodemailerMessageFromRequest;
