/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const Email = require('email-templates');
const humanize = require('humanize-string');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const striptags = require('striptags');
const titleize = require('titleize');
const { boolean } = require('boolean');
const { decode } = require('html-entities');

const isEmail = require('./is-email');
const getEmailLocals = require('./get-email-locals');
const logger = require('./logger');
const _ = require('./lodash');

const config = require('#config');
const env = require('#config/env');

/*
const emailConn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'EMAILS_MONGO_URI'
);
if (!emailConn) throw new Error('Mongoose connection does not exist');
const emailTemplates = new EmailTemplates(config.email);
const emailTemplatesFallback = new EmailTemplates({
  ...config.email,
  transport: nodemailer.createTransport({
    host: env.SMTP_TRANSPORT_HOST,
    port: env.SMTP_TRANSPORT_PORT,
    secure: env.SMTP_TRANSPORT_SECURE,
    auth: {
      user: env.SMTP_TRANSPORT_USER,
      pass: env.SMTP_TRANSPORT_PASS
    },
    logger,
    debug: boolean(env.TRANSPORT_DEBUG)
  })
});
*/

const email = new Email({
  ...config.email,
  transport: nodemailer.createTransport({
    host: env.SMTP_TRANSPORT_HOST,
    port: env.SMTP_TRANSPORT_PORT,
    secure: env.SMTP_TRANSPORT_SECURE,
    auth: {
      user: env.SMTP_TRANSPORT_USER,
      pass: env.SMTP_TRANSPORT_PASS
    },
    logger,
    debug: boolean(env.TRANSPORT_DEBUG),
    connectionTimeout: 30000, // 30 seconds to establish connection
    greetingTimeout: 30000, // 30 seconds to wait for greeting
    socketTimeout: 60000 // 60 seconds for socket inactivity
  })
});

let conn;

module.exports = async (data) => {
  try {
    logger.info('sending email', { data });
    if (!_.isObject(data.locals)) data.locals = {};
    const emailLocals = await getEmailLocals();
    Object.assign(data.locals, emailLocals);
    if (data?.message?.subject)
      data.message.subject = decode(striptags(data.message.subject));

    //
    // if `template` was set and it's included in `config.optOutTemplates`
    // then go through `data.to`, `data.cc`, `data.bcc` and
    // if the value is an array, iterate over each
    // otherwise if it's a string then check it using a simple
    // `Users.exists({ email: someEmailAddress, opt_out_templates: template });
    // and if a value is returned (e.g. non null) then continue along
    // otherwise the user specifically opted out from these emails
    //
    if (
      _.isObject(data.message) &&
      typeof data?.template === 'string' &&
      config.optOutTemplates.includes(data.template)
    ) {
      const emails = [];
      for (const key of ['to', 'cc', 'bcc']) {
        if (isEmail(data?.message[key])) {
          emails.push(data.message[key].toLowerCase());
        } else if (_.isArray(data.message[key])) {
          for (const addr of data.message[key]) {
            if (isEmail(addr)) emails.push(addr.toLowerCase());
          }
        }
      }

      if (emails.length > 0) {
        if (!conn)
          conn = mongoose.connections.find(
            (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
          );
        if (!conn) throw new Error('Mongoose connection does not exist');
        const optedOutEmails = await conn.models.Users.distinct('email', {
          email: {
            $in: emails
          },
          opt_out_templates: data.template
        });
        for (const key of ['to', 'cc', 'bcc']) {
          if (isEmail(data?.message[key])) {
            if (optedOutEmails.includes(data.message[key].toLowerCase()))
              delete data.message[key];
          } else if (_.isArray(data.message[key])) {
            data.message[key] = data.message[key].filter((v) =>
              isEmail(v) ? !optedOutEmails.includes(v.toLowerCase()) : true
            );
            if (_.isEmpty(data.message[key])) delete data.message[key];
          }
        }
      }
    }

    // safeguard
    if (
      !data?.message?.raw &&
      ((!data?.message?.to && !_.isArray(data?.message?.to)) ||
        data.message.to.length === 0) &&
      ((!data?.message?.cc && !_.isArray(data?.message?.cc)) ||
        data.message.cc.length === 0) &&
      ((!data?.message?.bcc && !_.isArray(data?.message?.bcc)) ||
        data.message.bcc.length === 0)
    ) {
      let msg =
        'Email must contain at least one valid address in the To, Cc, or Bcc headers.';
      if (typeof data?.template === 'string')
        msg += ` Recipients may have unsubscribed from ${humanize(
          titleize(data.template)
        )} emails.`;
      throw Boom.badRequest(msg);
    }

    const info = await email.send(data);
    return { info };
  } catch (err) {
    logger.error(err, { data });
    throw err;
  }
};

// TODO: temp reverted until we figure out issue
/*
// TODO: email-templates should strip tags from HTML in subject
module.exports = async (data) => {
  try {
    if (
      !conn?.models?.Users ||
      !conn?.models?.Domains ||
      !emailConn?.models?.Emails
    )
      throw new TypeError('Models were not available');

    logger.info('sending email', { data });
    if (!_.isObject(data.locals)) data.locals = {};
    const emailLocals = await getEmailLocals();
    Object.assign(data.locals, emailLocals);
    if (data?.message?.subject)
      data.message.subject = decode(striptags(data.message.subject));

    const adminIds = await conn.models.Users.distinct('_id', {
      group: 'admin'
    });

    const domain = await conn.models.Domains.findOne({
      name: env.WEB_HOST,
      'members.user': { $in: adminIds },
      has_txt_record: true
    }).populate(
      'members.user',
      `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
    );

    // alert admins they can configure and verify domain for faster email queueing
    if (!domain) {
      const err = new TypeError(
        `Configure and verify a new admin-owned domain for ${env.WEB_HOST} for faster email queuing`
      );
      err.isCodeBug = true;
      logger.fatal(err);
    }

    // info.message is a stream
    let info = domain
      ? await emailTemplates.send(data)
      : await emailTemplatesFallback.send(data);
    let email = null;

    if (domain) {
      try {
        email = await emailConn.models.Emails.queue({
          user: adminIds[0],
          info,
          domain,
          catchall: true
        });
      } catch (err) {
        err.isCodeBug = true;
        logger.fatal(err);
        // fallback
        info = await emailTemplatesFallback.send(data);
      }
    }

    return { info, email };
  } catch (err) {
    logger.error(err, { data });
    throw err;
  }
};
*/
