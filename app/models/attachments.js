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

const { Buffer } = require('node:buffer');

const mongoose = require('mongoose');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const validationErrorTransform = require('mongoose-validation-error-transform');

const {
  dummyProofModel,
  dummySchemaOptions,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

// attachmentId: 'ATT00001',
// magic: 37654,
// contentType: 'text/plain',
// transferEncoding: 'base64',
// lineCount: 1,
// body: <Buffer 5a 58 68 68 62 58 42 73 5a 51 6f 3d 0d 0a>,

const Attachments = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    attachmentId: { type: String, required: true },
    magic: { type: Number, required: true },
    contentType: { type: String, required: true },
    transferEncoding: { type: String, required: true },
    lineCount: { type: Number, required: true },
    counter: { type: Number, required: true }, // metadata.c
    counterUpdated: { type: Date, required: true }, // metadata.cu
    size: { type: Number, required: true }, // metadata.esize (attachment body length)
    // unlike wildduck we don't use these right now:
    // - `metadata.decoded` (Boolean)
    // - `metadata.lineLen` (Number)

    //
    //       <https://sqlite-users.sqlite.narkive.com/Q4txMI8t/effect-of-blobs-on-performance#post3>
    //
    //       Quote from the author of SQLite:
    //
    //       > Here's a hint though - make the BLOB columns the last column in
    //       > your tables. Or even store the BLOBs in a separate table which
    //       > only has two columns: an integer primary key and the blob itself,
    //       > and then access the BLOB content using a join if you need to.
    //       > If you put various small integer fields after the BLOB, then
    //       > SQLite has to scan through the entire BLOB content (following
    //       > the linked list of disk pages) to get to the integer fields at
    //       > the end, and that definitely can slow you down.
    //       > - D. Richard Hipp
    //
    body: { type: Buffer, required: true }
  },
  dummySchemaOptions
);

Attachments.index(
  {
    'metadata.c': 1,
    'metadata.m': 1,
    'metadata.cu': 1
  },
  {
    name: 'related_attachments_cu'
  }
);

Attachments.plugin(sqliteVirtualDB);
Attachments.plugin(validationErrorTransform);

module.exports = dummyProofModel(mongoose.model('Attachments', Attachments));
