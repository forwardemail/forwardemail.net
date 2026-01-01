/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const mongoose = require('mongoose');
const validationErrorTransform = require('mongoose-validation-error-transform');

const Mailboxes = require('./mailboxes');
const Threads = require('./threads');
const _ = require('#helpers/lodash');

const env = require('#config/env');
const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

// <https://github.com/Automattic/mongoose/issues/7150#issuecomment-524419675>
const Str = mongoose.Schema.Types.String;
Str.checkRequired((v) => v !== null);

const Messages = new mongoose.Schema(
  {
    mailbox: {
      type: mongoose.Schema.ObjectId,
      ref: Mailboxes,
      required: true,
      index: true
    },
    thread: {
      type: mongoose.Schema.ObjectId,
      ref: Threads,
      required: true,
      index: true
    },

    // TODO: preserve original id when COPY or MOVE
    root: {
      type: mongoose.Schema.ObjectId,
      ref: 'Messages',
      required: true
    },

    // expires and retention date
    exp: {
      type: Boolean,
      required: true,
      index: true
    },
    rdate: {
      type: Date,
      required: true,
      index: true
    },

    // internal date
    idate: {
      type: Date,
      required: true,
      index: true
    },
    // header date
    hdate: {
      type: Date,
      required: true,
      index: true
    },

    // TODO: does it need to be [{ type: String, index: true }] (?)
    // message flags (e.g. "\\Seen" or "\\Draft")
    flags: {
      type: Array,
      required: true,
      index: true
    },

    // bytes
    size: {
      type: Number,
      required: true,
      index: true
    },

    // parsed
    // TODO: optimize this similar to SMTP keywords for search
    headers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      // Keep as JSON text for SQL json_each/json_extract queries in on-search.js
      sqliteQueryable: true
    },

    mimeTree: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    envelope: {
      type: Array,
      required: true
    },
    bodystructure: {
      type: Array,
      required: true
    },

    msgid: {
      type: String,
      required: true
    },

    //
    // NOTE: this cannot be unique because MOVE command
    //       will create a new message first and then delete old
    //
    fingerprint: {
      type: String,
      index: true
    },

    // booleans for search
    unseen: {
      type: Boolean,
      required: true,
      index: true
    },
    flagged: {
      type: Boolean,
      required: true,
      index: true
    },
    undeleted: {
      type: Boolean,
      required: true,
      index: true
    },
    draft: {
      type: Boolean,
      required: true,
      index: true
    },

    // NOTE: attachment magic number for incremental storage (not used right now)
    magic: {
      type: Number,
      required: true
    },

    // parsed message Subject header
    subject: {
      type: String,
      required: true
    },

    // TODO: don't archive messages that have been copied
    copied: {
      type: Boolean,
      required: true
    },

    //
    // TODO: `meta` object with metadata? (e.g. IP address)
    //

    // attachments
    attachments: {
      type: Array,
      required: true,
      default: []
    },

    // has attachments boolean
    ha: {
      type: Boolean,
      required: true,
      default: false
    },

    // uid and modseq
    uid: {
      type: Number,
      required: true,
      index: true
    },
    modseq: {
      type: Number,
      required: true,
      index: true
    },

    // misc booleans
    searchable: {
      type: Boolean,
      required: true,
      index: true,
      default: true
    },
    junk: {
      type: Boolean,
      required: true,
      default: false
    },

    // IP address of creation
    remoteAddress: {
      type: String,
      required: true
    },

    // transaction type (e.g. "APPEND")
    transaction: {
      type: String,
      trim: true,
      uppercase: true,
      required: true
    },

    // raw: {
    //   type: mongoose.Schema.Types.Mixed,
    //   required: true
    // },

    // text string (used for text index)
    text: {
      type: Str,
      required: true,
      trim: true
    }
  },
  dummySchemaOptions
);

//
// TODO: use spamscanner v6 for parsing language specific tokens for text index for subject
//       (note that we'd have to feed the search query the search parsed tokens from message)
//       (but at that point we might want to simply do another hash query lookup by tokens parsed)
//
Messages.index({
  text: 'text'
});

Messages.plugin(sqliteVirtualDB);
Messages.plugin(validationErrorTransform);

/*
Messages.pre('validate', async function (next) {
  // attempt to parse tokens for text field
  this.text = '';
  try {
    const { tokens } = await scanner.getTokensAndMailFromSource(this.raw);
    // right now search is filtered out for the following (from spamscanner v5)
    // - url
    // - email
    // - number
    // - currency
    // - initialism
    // - abbreviation
    // - emoji
    // - hexa
    // - mac
    // - phone
    // - bitcoin
    // - cc
    this.text = _.pullAll(
      _.uniq(tokens),
      Object.values(scanner.config.replacements)
    ).join(' ');

    next();
  } catch (err) {
    logger.fatal(err, { message: this });
    next();
  }
});
*/

Messages.pre('validate', function (next) {
  // make flags unique
  this.flags = _.uniq(this.flags);

  // replace "@wildduck.email" in msgid
  if (this.isNew && typeof this.msgid === 'string')
    this.msgid = this.msgid.replace('@wildduck.email', `@${env.WEB_HOST}`);

  // update boolean based off attachments
  this.ha =
    Array.isArray(this.attachments) && this.attachments.some((a) => !a.related);

  next();
});

module.exports = dummyProofModel(mongoose.model('Messages', Messages));
