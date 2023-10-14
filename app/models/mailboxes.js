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

const Boom = require('@hapi/boom');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const ms = require('ms');

const Aliases = require('./aliases');

const i18n = require('#helpers/i18n');
const config = require('#config');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const locale = i18n.config.defaultLocale;

const Mailboxes = new mongoose.Schema(
  {
    alias: {
      type: mongoose.Schema.ObjectId,
      ref: Aliases,
      required: true,
      index: true
    },
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
  {
    writeConcern: {
      w: 'majority'
    }
  }
);

Mailboxes.plugin(mongooseCommonPlugin, {
  object: 'mailbox',
  locale: false
});

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

//
// we have this in a pre-save hook because `this.alias` is required after validation
//
Mailboxes.pre('save', async function (next) {
  // ensure alias exists and re-use existing `alias.retention` value
  try {
    const alias = await Aliases.findById(this.alias)
      .populate('user', `id ${config.userFields.isBanned}`)
      .lean()
      .exec();

    if (!alias)
      throw Boom.forbidden(i18n.translateError('ALIAS_DOES_NOT_EXIST', locale));

    // alias must not have banned user
    if (alias.user[config.userFields.isBanned])
      throw Boom.forbidden(i18n.translateError('ALIAS_ACCOUNT_BANNED', locale));

    // alias must be enabled
    if (!alias.is_enabled)
      throw Boom.notFound(i18n.translateError('ALIAS_IS_NOT_ENABLED', locale));

    // default to `alias.retention` or 0
    this.retention = ['\\Trash', '\\Junk'].includes(this.specialUse)
      ? ms('30d')
      : alias.retention;

    next();
  } catch (err) {
    next(err);
  }
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'IMAP_MONGO_URI'
);
module.exports = conn.model('Mailboxes', Mailboxes);
