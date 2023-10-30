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
const ms = require('ms');
const validationErrorTransform = require('mongoose-validation-error-transform');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

const Mailboxes = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      index: true
    },
    uidValidity: {
      type: Number,
      required: true,
      default: () => Math.floor(Date.now() / 1000)
    },
    uidNext: {
      type: Number,
      required: true,
      default: 1
    },
    modifyIndex: {
      type: Number,
      required: true,
      default: 0
    },
    subscribed: {
      type: Boolean,
      required: true,
      default: true,
      index: true
    },
    flags: {
      type: Array,
      required: true,
      default: []
    },
    retention: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: Number.MAX_VALUE
    },
    specialUse: {
      type: String,
      default: '',
      index: true,
      enum: [
        '',
        '\\Inbox',
        '\\Sent',
        '\\Junk',
        '\\Trash',
        '\\Drafts',
        '\\All',
        '\\Archive',
        '\\Flagged'
      ]
    }
  },
  dummySchemaOptions
);

Mailboxes.pre('validate', function (next) {
  if (this.path.toLowerCase().trim() === 'inbox') this.path = 'INBOX';

  switch (this.path) {
    case 'INBOX': {
      this.specialUse = '\\Inbox';
      break;
    }

    case 'Sent Mail': {
      this.specialUse = '\\Sent';
      break;
    }

    case 'Spam':
    case 'Junk': {
      this.specialUse = '\\Junk';
      break;
    }

    case 'Trash': {
      this.specialUse = '\\Trash';
      break;
    }

    case 'Drafts': {
      this.specialUse = '\\Drafts';
      break;
    }

    case 'All Mail': {
      this.specialUse = '\\All';
      break;
    }

    case 'Archive': {
      this.specialUse = '\\Archive';
      break;
    }

    default: {
      this.specialUse = '';
    }
  }

  next();
});

Mailboxes.pre('validate', function (next) {
  if (['\\Trash', '\\Junk'].includes(this.specialUse))
    this.retention = ms('30d');
  next();
});

Mailboxes.plugin(sqliteVirtualDB);
Mailboxes.plugin(validationErrorTransform);

module.exports = dummyProofModel(mongoose.model('Mailboxes', Mailboxes));
