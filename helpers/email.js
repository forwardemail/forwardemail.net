/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Email = require('email-templates');
const _ = require('lodash');
const striptags = require('striptags');
const { decode } = require('html-entities');

const getEmailLocals = require('./get-email-locals');
const logger = require('./logger');
const config = require('#config');

const email = new Email(config.email);

// TODO: email-templates should strip tags from HTML in subject
module.exports = async (data) => {
  try {
    logger.info('sending email', { data });
    if (!_.isObject(data.locals)) data.locals = {};
    const emailLocals = await getEmailLocals();
    Object.assign(data.locals, emailLocals);
    if (data?.message?.subject)
      data.message.subject = decode(striptags(data.message.subject));
    const info = await email.send(data);
    return info;
  } catch (err) {
    logger.error(err, { data });
    throw err;
  }
};
