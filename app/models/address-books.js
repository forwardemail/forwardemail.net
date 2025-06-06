/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const mongoose = require('mongoose');
const validationErrorTransform = require('mongoose-validation-error-transform');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

const AddressBooks = new mongoose.Schema(
  {
    // Unique identifier for the address book
    address_book_id: {
      type: String,
      required: true,
      index: true
    },

    // Display name of the address book
    name: {
      type: String,
      required: true,
      trim: true
    },

    // Optional description
    description: {
      type: String,
      default: '',
      trim: true
    },

    // Color for UI display (hex code)
    color: {
      type: String,
      default: '#0000FF',
      trim: true
    },

    // Sync token for client synchronization
    synctoken: {
      type: String,
      required: true
    },

    // Timezone for the address book
    timezone: {
      type: String,
      default: 'UTC',
      trim: true
    },

    // URL for the address book
    url: {
      type: String,
      required: true,
      trim: true
    },

    // Product ID for vCard generation
    prodId: {
      type: String,
      default: '//forwardemail.net//carddav//EN',
      trim: true
    },

    // Whether the address book is read-only
    readonly: {
      type: Boolean,
      default: false
    }
  },
  dummySchemaOptions
);

// Add SQLite virtual DB support
AddressBooks.plugin(sqliteVirtualDB);
AddressBooks.plugin(validationErrorTransform);

module.exports = dummyProofModel(mongoose.model('AddressBooks', AddressBooks));
