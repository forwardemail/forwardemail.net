/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const ms = require('ms');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

const config = require('#config');

// define schema
const TestEmailSession = new mongoose.Schema({
  alias: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  client_ip: {
    type: String,
    required: true,
    index: true
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + ms('30m')),
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  results_sent: {
    type: Boolean,
    default: false
  },
  sender_email: {
    type: String,
    default: null
  }
});

TestEmailSession.plugin(mongooseCommonPlugin, {
  object: 'test_email_session'
});

TestEmailSession.statics.generateTestAlias = function () {
  const uuid = randomUUID();
  return `test-${uuid}@${config.webHost}`;
};

TestEmailSession.statics.createTestSession = async function (clientIP) {
  const alias = this.generateTestAlias();
  
  const session = new this({
    alias,
    client_ip: clientIP
  });

  await session.save();
  return session;
};

module.exports = mongoose.model('TestEmailSession', TestEmailSession);