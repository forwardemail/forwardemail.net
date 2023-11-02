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

const Database = require('better-sqlite3-multiple-ciphers');
const MessageHandler = require('wildduck/lib/message-handler');
const WebSocketAsPromised = require('websocket-as-promised');
const _ = require('lodash');
const mongoose = require('mongoose');
const safeStringify = require('fast-safe-stringify');
const validationErrorTransform = require('mongoose-validation-error-transform');
const { Builder } = require('json-sql');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

const {
  dummyProofModel,
  dummySchemaOptions,
  convertResult,
  sqliteVirtualDB
} = require('#helpers/mongoose-to-sqlite');

const builder = new Builder();

const Threads = new mongoose.Schema(
  {
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
  dummySchemaOptions
);

Threads.pre('validate', function (next) {
  this.ids = _.uniq(this.ids);
  next();
});

Threads.plugin(sqliteVirtualDB);
Threads.plugin(validationErrorTransform);

// code is inspired from wildduck (rewrite necessary for async/await and different db structure)
// eslint-disable-next-line max-params, complexity
async function getThreadId(db, wsp, session, subject, mimeTree) {
  if (!db || (!(db instanceof Database) && !db.wsp))
    throw new TypeError('Database is missing');

  if (!wsp || !(wsp instanceof WebSocketAsPromised))
    throw new TypeError('WebSocketAsPromised missing');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

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

  let thread;
  if (referenceIds.length > 0) {
    {
      // <https://stackoverflow.com/questions/63651913/is-there-a-method-to-check-if-an-array-includes-one-value-in-sqlite>
      const sql = `select * from "Threads" where "subject" = ? and exists (select 1 from json_each("ids") where (${referenceIds
        .map(() => `"value" = ?`)
        .join(' or ')})) limit 1;`;

      const values = [subject, ...referenceIds];

      // reading so no need to lock
      if (db.wsp) {
        thread = await wsp.request({
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', sql],
            ['get', values]
          ]
        });
      } else {
        thread = db.prepare(sql).get(values);
      }
    }

    if (thread) {
      thread = await convertResult(this, thread);

      for (const id of referenceIds) {
        thread.ids.push(id);
      }

      // make it unique (similar to $addToSet in mongo)
      thread.ids = _.uniq(thread.ids);

      // save the doc here
      {
        const sql = builder.build({
          type: 'update',
          table: 'Threads',
          condition: {
            _id: thread._id.toString()
          },
          modifier: {
            ids: safeStringify(thread.ids)
          }
        });

        // result of this will be like:
        // `{ changes: 1, lastInsertRowid: 11 }`

        // use websockets if readonly
        if (db.readonly) {
          await wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['run', sql.values]
            ]
          });
        } else {
          db.prepare(sql.query).run(sql.values);
        }
      }

      {
        const sql = builder.build({
          type: 'select',
          table: 'Threads',
          condition: {
            _id: thread._id.toString()
          }
        });

        if (db.wsp) {
          thread = await wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['get', sql.values]
            ]
          });
        } else {
          thread = db.prepare(sql.query).get(sql.values);
        }

        if (!thread) throw new TypeError('Thread does not exist');
        thread = await convertResult(this, thread);
      }
    }
  }

  if (thread) {
    // virtual for rollback
    thread.isNew = false;
    return thread;
  }

  thread = await this.create({
    db,
    wsp,
    session,
    ids: referenceIds,
    subject
  });

  // virtual for rollback
  thread.isNew = true;

  return thread;
}

Threads.statics.getThreadId = getThreadId;

module.exports = dummyProofModel(mongoose.model('Threads', Threads));
