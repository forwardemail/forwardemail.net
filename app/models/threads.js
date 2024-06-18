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
const _ = require('lodash');
const mongoose = require('mongoose');
const safeStringify = require('safe-stable-stringify');
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
// eslint-disable-next-line complexity
async function getThreadId(instance, session, subject, mimeTree) {
  if (!session?.db || (!(session.db instanceof Database) && !session.db.wsp))
    throw new TypeError('Database is missing');

  if (
    instance?.wsp?.constructor?.name !== 'WebSocketAsPromised' &&
    (!instance?.wsp || !instance.wsp[Symbol.for('isWSP')]) &&
    !instance[Symbol.for('isWSP')]
  )
    throw new TypeError('WebSocketAsPromised instance required');

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
      if (session.db.wsp) {
        thread = await instance.wsp.request({
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', sql],
            ['get', values]
          ]
        });
      } else {
        thread = session.db.prepare(sql).get(values);
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
        if (session.db.readonly) {
          await instance.wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['run', sql.values]
            ]
          });
        } else {
          session.db.prepare(sql.query).run(sql.values);
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

        if (session.db.wsp) {
          thread = await instance.wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['get', sql.values]
            ]
          });
        } else {
          thread = session.db.prepare(sql.query).get(sql.values);
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
    instance,
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
