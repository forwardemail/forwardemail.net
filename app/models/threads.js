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

const crypto = require('node:crypto');

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const MessageHandler = require('wildduck/lib/message-handler');

const Aliases = require('./aliases');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const Threads = new mongoose.Schema(
  {
    alias: {
      type: mongoose.Schema.ObjectId,
      ref: Aliases,
      required: true,
      index: true
    },
    ids: [
      {
        type: String,
        index: true
      }
    ],
    subject: {
      type: String,
      index: true
    }
  },
  {
    writeConcern: {
      w: 'majority'
    }
  }
);

Threads.plugin(mongooseCommonPlugin, {
  object: 'thread',
  locale: false
});

// code is inspired from wildduck (rewrite necessary for async/await and different db structure)
async function getThreadId(aliasId, subject, mimeTree) {
  let referenceIds = new Set(
    [
      [mimeTree.parsedHeader['message-id'] || []].flat().pop() || '',
      [mimeTree.parsedHeader['in-reply-to'] || []].flat().pop() || '',
      ([mimeTree.parsedHeader['thread-index'] || []].flat().pop() || '').slice(
        0,
        22
      ),
      [mimeTree.parsedHeader.references || []].flat().pop() || ''
    ]
      .join(' ')
      .split(/\s+/)
      .map((id) => id.replace(/[<>]/g, '').trim())
      .filter(Boolean)
      .map((id) =>
        crypto
          .createHash('sha1')
          .update(id)
          .digest('base64')
          .replace(/=+$/g, '')
      )
  );

  subject = MessageHandler.prototype.normalizeSubject(subject, {
    removePrefix: true
  });

  referenceIds = [...referenceIds].slice(0, 10);

  let thread = await this.findOneAndUpdate(
    {
      alias: aliasId,
      ids: { $in: referenceIds },
      subject
    },
    {
      $addToSet: {
        ids: { $each: referenceIds }
      }
    },
    {
      returnDocument: 'after'
    }
  );

  if (thread) {
    // virtual for rollback
    thread.isNew = false;
    return thread;
  }

  thread = await this.create({
    alias: aliasId,
    ids: referenceIds,
    subject
  });

  // virtual for rollback
  thread.isNew = true;

  return thread;
}

Threads.statics.getThreadId = getThreadId;

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'IMAP_MONGO_URI'
);
module.exports = conn.model('Threads', Threads);
