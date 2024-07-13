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

const { EventEmitter } = require('node:events');

const Database = require('better-sqlite3-multiple-ciphers');
const _ = require('lodash');
const ms = require('ms');
const safeStringify = require('fast-safe-stringify');
const { Builder } = require('json-sql');

const IMAPError = require('#helpers/imap-error');
const Journals = require('#models/journals');
const Mailboxes = require('#models/mailboxes');
const config = require('#config');
const logger = require('#helpers/logger');
const i18n = require('#helpers/i18n');
const { acquireLock, releaseLock } = require('#helpers/lock');

const builder = new Builder();

class IMAPNotifier extends EventEmitter {
  constructor(options) {
    super();

    const { publisher, subscriber } = options;

    if (!publisher || !subscriber) throw new Error('Options missing');

    this.publisher = publisher;
    this.subscriber = subscriber;

    this.connectionSessions = new WeakMap();
    this.publishTimers = new Map();

    this._listeners = new EventEmitter();
    this._listeners.setMaxListeners(0);

    const scheduleDataEvent = (ev) => {
      let data;
      const fire = () => {
        clearTimeout(data.timeout);
        this.publishTimers.delete(ev);
        this._listeners.emit(ev);
      };

      if (this.publishTimers.has(ev)) {
        data = this.publishTimers.get(ev) || {};
        clearTimeout(data.timeout);
        data.count++;

        if (data.initial < Date.now() - 1000) {
          return fire();
        }
      } else {
        data = {
          ev,
          count: 1,
          initial: Date.now(),
          timeout: null
        };
      }

      data.timeout = setTimeout(() => {
        fire();
      }, 100);
      data.timeout.unref();

      if (!this.publishTimers.has(ev)) {
        this.publishTimers.set(ev, data);
      }
    };

    // <https://github.com/nodemailer/wildduck/commit/5721047bc1c23b816f08cbf1cba7fbe494724af5>
    this.subscriber.on('message', (channel, message) => {
      if (channel !== config.IMAP_REDIS_CHANNEL_NAME) return;

      let data;
      // if e present at beginning, check if p also is present
      // if no p -> no json parse
      // if p -> json parse ONLY p
      // if e not in beginning but p is -> json parse whole

      let needFullParse = true;

      if (
        message.length === 32 &&
        message[2] === 'e' &&
        message[5] === '"' &&
        message[6 + 24] === '"'
      ) {
        // there is only e, no p -> no need for full parse
        needFullParse = false;
      }

      if (needFullParse) {
        // full parse
        try {
          data = JSON.parse(message);
        } catch {
          return;
        }
      } else {
        // get e and continue
        data = { e: message.slice(6, 6 + 24) };
      }

      if (this._listeners._events[data.e]?.length > 0) {
        // do not schedule or fire/emit empty events
        if (data.e && !data.p) {
          // events without payload are scheduled, these are notifications about changes in journal
          scheduleDataEvent(data.e);
        } else if (data.e) {
          // events with payload are triggered immediatelly, these are actions for doing something
          this._listeners.emit(data.e, data.p);
        }
      }
    });

    this.subscriber.subscribe(config.IMAP_REDIS_CHANNEL_NAME);
  }

  addListener(session, handler) {
    logger.debug('addListener', { session });
    this._listeners.addListener(session.user.alias_id, handler);
  }

  removeListener(session, handler) {
    logger.debug('removeListener', { session });
    this._listeners.removeListener(session.user.alias_id, handler);
  }

  // eslint-disable-next-line complexity, max-params
  async addEntries(instance, session, mailboxId, entries, lock = false) {
    if (!session?.db || (!(session.db instanceof Database) && !instance.wsp)) {
      const err = new TypeError('Database is missing');
      err.instance = instance;
      err.session = session;
      err.mailboxId = mailboxId;
      err.entries = entries;
      throw err;
    }

    if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
      throw new TypeError('WebSocketAsPromised instance required');

    if (typeof session?.user?.password !== 'string')
      throw new TypeError('Session user and password missing');

    if (entries && !Array.isArray(entries)) {
      entries = [entries];
    } else if (!entries || entries.length === 0) {
      return false;
    }

    const updated = entries
      .filter((entry) => !entry.modseq && entry.message)
      .map((entry) => entry.message.toString());

    if (!mailboxId)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          responseCode: 404,
          code: 'NoSuchMailbox'
        }
      );

    // prepare query and prevent additional db call if necessary
    const query = {};
    let mailbox;
    if (typeof mailboxId === 'object' && typeof mailboxId._id === 'object') {
      mailbox = mailboxId;
      query._id = mailboxId._id;
    } else {
      query._id = mailboxId;
    }

    // safeguard
    if (_.isEmpty(query) || !query._id) throw new Error('Query empty');

    let newLock;
    if (!lock) newLock = await acquireLock(instance, session.db);

    let err;

    try {
      if (updated.length > 0) {
        mailbox = await Mailboxes.findOneAndUpdate(
          instance,
          session,
          query,
          {
            $inc: {
              modifyIndex: 1
            }
          },
          {
            lock: lock || newLock,
            returnDocument: 'after'
          }
        );
      }

      if (!mailbox) mailbox = await Mailboxes.findOne(instance, session, query);

      if (!mailbox)
        throw new IMAPError(
          i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
          {
            responseCode: 404,
            code: 'NoSuchMailbox'
          }
        );

      const modseq = mailbox.modifyIndex;
      const created = new Date();

      const bulk = Journals.collection.initializeUnorderedBulkOp();

      for (const entry of entries) {
        entry.modseq = entry.modseq || modseq;
        entry.created = entry.created || created;
        entry.mailbox = entry.mailbox || mailbox._id;
        const doc = new Journals(entry).toObject({
          bson: true,
          transform: false,
          virtuals: true,
          getters: true,
          _skipDepopulateTopLevel: true,
          depopulate: true,
          flattenDecimals: false,
          useProjection: false
        });
        doc.object = 'journal';
        doc.id = doc._id.toString();
        const now = new Date();
        doc.created_at = now;
        doc.updated_at = now;
        bulk.insert(doc);
      }

      if (updated.length > 0) {
        logger.debug('updating messages', {
          entries,
          modseq,
          mailbox,
          updated,
          session
        });

        try {
          const condition = {
            _id: {
              $in: updated
            },
            modseq: {
              $lt: modseq
            }
          };
          const sql = builder.build({
            type: 'update',
            table: 'Messages',
            condition,
            modifier: {
              $set: {
                modseq
              }
            }
          });

          if (instance.wsp) {
            await instance.wsp.request({
              action: 'stmt',
              session: { user: session.user },
              lock: lock || newLock,
              stmt: [
                ['prepare', sql.query],
                ['run', sql.values]
              ],
              checkpoint: 'PASSIVE'
            });
          } else {
            session.db.prepare(sql.query).run(sql.values);
          }
        } catch (err) {
          logger.fatal(err, { mailbox, updated, modseq, session });
        }
      }

      logger.debug('creating entries', {
        entries
      });

      const bulkResults = await bulk.execute();
      if (
        bulkResults?.result?.ok !== 1 ||
        bulkResults?.writeErrors?.length > 0 ||
        bulkResults?.writeConcernErrors?.length > 0
      ) {
        const err = new TypeError('Bulk write errors');
        err.bulkResults = bulkResults;
        throw err;
      }
    } catch (_err) {
      err = _err;
    }

    // release lock
    if (newLock?.success) {
      try {
        await releaseLock(instance, session.db, newLock);
      } catch (err) {
        logger.fatal(err, { mailbox, updated, session });
      }
    }

    if (err) throw err;

    return entries.length;
  }

  // TODO: rewrite this b/c we don't use `payload` ever
  // TODO: remove safeStringify and replace with just the aliasId
  fire(aliasId, payload) {
    if (!aliasId) throw new Error('Alias ID missing');

    setImmediate(() => {
      this.publisher.publish(
        config.IMAP_REDIS_CHANNEL_NAME,
        safeStringify({
          e: aliasId,
          p: payload
        })
      );
    });
  }

  // <https://github.com/nodemailer/wildduck/blob/c9188b3766b547b091d140a33308b5c3ec3aa1d4/imap-core/lib/imap-connection.js#L616-L619>
  getUpdates(mailbox, modifyIndex, fn) {
    modifyIndex = Number(modifyIndex) || 0;
    Journals.collection
      .find({
        mailbox: mailbox._id || mailbox,
        modseq: {
          $gt: modifyIndex
        }
      })
      .toArray(fn);
  }

  // <https://github.com/nodemailer/wildduck/blob/48b9efb8ca4b300597b2e8f5ef4aa307ac97dcfe/lib/imap-notifier.js#L368>
  // <https://github.com/nodemailer/wildduck/blob/48b9efb8ca4b300597b2e8f5ef4aa307ac97dcfe/imap-core/lib/imap-connection.js#L364C46-L365>
  releaseConnection(data, fn) {
    // ignore unauthenticated sessions
    if (!data?.session?.user?.alias_id) return fn(null, true);

    /*
    // TODO: this should signal to sqlite to cleanup
    //       via parse-payload function sent over websocket
    // close the db connection
    if (
      data?.session?.db?.pragma === 'function' &&
      data?.session?.db?.close === 'function'
    ) {
      try {
        data.session.db.pragma('analysis_limit=400');
        data.session.db.pragma('optimize');
        data.session.db.close();
      } catch (err) {
        logger.fatal(err, { session: data.session });
      }
    }
    */

    // decrease # connections for this alias and domain
    const key = `connections_${config.env}:${
      data.session.user.alias_id || data.session.user.domain_id
    }`;
    this.publisher
      .pipeline()
      .decr(key)
      .pexpire(key, ms('1h'))
      .exec()
      .then()
      .catch((err) => logger.fatal(err));

    fn(null, true);
  }
}

module.exports = IMAPNotifier;
