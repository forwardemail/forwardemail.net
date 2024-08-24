/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const EmailTemplates = require('email-templates');
const _ = require('lodash');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { decode } = require('html-entities');

const getEmailLocals = require('./get-email-locals');
const logger = require('./logger');

const config = require('#config');
const env = require('#config/env');

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) {
  throw new Error('Mongoose connection does not exist');
}

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
    const info = domain
      ? emailTemplates.send(data)
      : emailTemplatesFallback.send(data);
    let email = null;

    if (domain)
      email = await emailConn.models.Emails.queue({
        info,
        domain,
        catchall: true
      });
    return { info, email };
  } catch (err) {
    logger.error(err, { data });
    throw err;
  }
};
