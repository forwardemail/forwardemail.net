/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const Emails = require('#models/emails');
const config = require('#config');
const createSession = require('#helpers/create-session');
const toObject = require('#helpers/to-object');

function json(email, isList = false) {
  const object = toObject(Emails, email);
  if (isList) {
    delete object.headers;
    delete object.accepted;
    delete object.rejectedErrors;
  }

  return {
    ...pickOriginal(
      object,
      _.isFunction(email.toObject) ? email.toObject() : email
    ),
    // add a helper url
    link: `${config.urls.web}/my-account/emails/${email.id}`
  };
}

async function list(ctx) {
  ctx.body = ctx.state.emails.map((email) => json(email, true));
}

async function retrieve(ctx) {
  const body = json(ctx.state.email);
  // we want to return the `message` property
  body.message = await Emails.getMessage(ctx.state.email.message);
  ctx.body = body;
}

async function limit(ctx) {
  const count = await ctx.client.zcard(
    `${config.smtpLimitNamespace}:${ctx.state.user.id}`
  );
  ctx.body = {
    count,
    limit:
      ctx.state.user[config.userFields.smtpLimit] || config.smtpLimitMessages
  };
}

async function create(ctx) {
  try {
    if (!_.isPlainObject(ctx.request.body))
      throw Boom.badRequest('Body must be an object');

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
      'list'

      // dkim (handled by sending job)
    ]);

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
    if (
      _.isObject(message.text) &&
      (message?.text?.path || message?.text?.href)
    )
      throw Boom.badRequest(
        '"text" cannot use "path" nor "href" properties; https://nodemailer.com/message/attachments/'
      );

    if (
      _.isObject(message.html) &&
      (message?.html?.path || message?.html?.href)
    )
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

    // TODO: rate limiting emails per day by domain id and alias user id

    // queue the email
    const email = await Emails.queue(
      { message, user: ctx.state.user },
      ctx.locale
    );

    ctx.logger.info('email created', {
      session: createSession(email),
      user: email.user,
      email: email._id,
      domains: [email.domain],
      ignore_hook: false
    });

    ctx.body = email;
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(err);
  }
}

module.exports = { list, retrieve, create, limit };
