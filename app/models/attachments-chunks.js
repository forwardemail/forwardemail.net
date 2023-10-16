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

const AttachmentsChunks = new mongoose.Schema(
  {
    files_id: {
      type: Buffer,
      index: true
    },
    n: Number,
    data: Buffer
  },
  {
    collection: 'attachments.chunks'
  }
);

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'IMAP_MONGO_URI'
);
module.exports = conn.model('AttachmentsChunks', AttachmentsChunks);
