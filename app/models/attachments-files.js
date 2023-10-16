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

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const AttachmentsFiles = new mongoose.Schema(
  {
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    contentType: String,
    metadata: {
      m: Number,
      c: Number,
      cu: Date,
      esize: Number,
      transferEncoding: String,
      decoded: Boolean,
      lineLen: Number
    }
  },
  {
    collection: 'attachments.files'
  }
);

AttachmentsFiles.index(
  {
    'metadata.c': 1,
    'metadata.m': 1,
    'metadata.cu': 1
  },
  {
    name: 'related_attachments_cu'
  }
);

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'IMAP_MONGO_URI'
);
module.exports = conn.model('AttachmentsFiles', AttachmentsFiles);
