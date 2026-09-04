/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const intoStream = require('into-stream');

function getEmailMessageStream(message) {
  if (message && typeof message.pipe === 'function') return message;

  if (typeof message === 'string' || Buffer.isBuffer(message))
    return intoStream(message);

  throw Boom.badImplementation('Email transport returned an invalid message');
}

module.exports = getEmailMessageStream;
