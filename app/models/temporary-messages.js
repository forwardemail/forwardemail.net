/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const mongoose = require('mongoose');
const validationErrorTransform = require('mongoose-validation-error-transform');

const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const TemporaryMessages = new mongoose.Schema(
  {
    fingerprint: {
      type: String,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    raw: {
      type: Buffer,
      required: true
    },
    // IP address of creation
    remoteAddress: {
      type: String,
      required: true
    },
    // Sieve filtering support - target mailbox folder
    mailbox: {
      type: String,
      default: 'INBOX'
    },
    // Sieve filtering support - message flags
    flags: {
      type: [String],
      default: []
    }
  },
  dummySchemaOptions
);

TemporaryMessages.plugin(sqliteVirtualDB);
TemporaryMessages.plugin(validationErrorTransform);

module.exports = dummyProofModel(
  mongoose.model('TemporaryMessages', TemporaryMessages)
);
