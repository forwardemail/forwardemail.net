/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const cryptoRandomString = require('crypto-random-string');
const isSANB = require('is-string-and-not-blank');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const config = require('#config');

const Messages = new mongoose.Schema({
  raw: {
    type: Buffer,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

Messages.plugin(mongooseCommonPlugin, {
  object: 'messages',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v', 'description', 'salt', 'hash'],
  uniqueId: false,
  locale: false
});

const Inquiries = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  },
  sender_email: {
    type: String,
    required: true,
    index: true
  },
  reference: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    index: true
  },
  is_denylist: {
    type: Boolean
  },
  is_resolved: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  messages: [Messages]
});

Inquiries.plugin(mongooseCommonPlugin, {
  object: 'inquiry',
  locale: false
});

Inquiries.pre('validate', async function (next) {
  try {
    if (!isSANB(this.reference))
      this.reference = await cryptoRandomString.async(config.referenceOptions);

    next();
  } catch (err) {
    next(err);
  }
});

function getFirstMessage() {
  if (!this.messages || this.messages.length === 0) return null;
  this.messages.sort((a, b) => a.created_at - b.created_at);
  return this.messages[0];
}

function getMostRecentMessage() {
  if (!this.messages || this.messages.length === 0) return null;
  this.messages.sort((a, b) => a.created_at - b.created_at);
  return this.messages[this.messages.length - 1];
}

Inquiries.methods.getFirstMessage = getFirstMessage;
Inquiries.methods.getMostRecentMessage = getMostRecentMessage;

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
module.exports = conn.model('Inquiries', Inquiries);
