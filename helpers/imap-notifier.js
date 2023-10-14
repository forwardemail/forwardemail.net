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

const _ = require('lodash');
const safeStringify = require('fast-safe-stringify');

const IMAPError = require('#helpers/imap-error');
const Journals = require('#models/journals');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

const IMAP_REDIS_CHANNEL_NAME = 'imap_events';

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

    this.subscriber.on('message', (channel, message) => {
      if (channel === IMAP_REDIS_CHANNEL_NAME) {
        let data;
        try {
          data = JSON.parse(message);
        } catch {
          return;
        }

        if (data.e && !data.p) {
          scheduleDataEvent(data.e);
        } else if (data.e) {
          this._listeners.emit(data.e, data.p);
        }
      }
    });

    this.subscriber.subscribe(IMAP_REDIS_CHANNEL_NAME);
  }

  addListener(session, handler) {
    logger.debug('addListener', { session });
    this._listeners.addListener(session.user.alias_id, handler);
  }

  removeListener(session, handler) {
    logger.debug('removeListener', { session });
    this._listeners.removeListener(session.user.alias_id, handler);
  }

  async addEntries(mailboxId, entries) {
    if (entries && !Array.isArray(entries)) {
      entries = [entries];
    } else if (!entries || entries.length === 0) {
      return false;
    }

    const updated = entries
      .filter((entry) => !entry.modseq && entry.message)
      .map((entry) => entry.message);

    if (!mailboxId)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        responseCode: 404,
        code: 'NoSuchMailbox'
      });

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

    if (updated.length > 0)
      mailbox = await Mailboxes.findOneAndUpdate(
        query,
        {
          $inc: {
            modifyIndex: 1
          }
        },
        {
          returnDocument: 'after'
        }
      );

    if (!mailbox) mailbox = await Mailboxes.findOne(query).lean().exec();

    if (!mailbox)
      throw new IMAPError(i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', 'en'), {
        responseCode: 404,
        code: 'NoSuchMailbox'
      });

    const modseq = mailbox.modifyIndex;
    const created = new Date();

    for (const entry of entries) {
      entry.modseq = entry.modseq || modseq;
      entry.created = entry.created || created;
      entry.mailbox = entry.mailbox || mailbox._id;
      entry.alias = mailbox.alias;
    }

    if (updated.length > 0) {
      logger.debug('updating messages', {
        mailbox,
        updated,
        modseq
      });

      try {
        await Messages.updateMany(
          {
            _id: {
              $in: updated
            },
            mailbox: mailbox._id
          },
          {
            $max: {
              modseq
            }
          }
        );
      } catch (err) {
        logger.fatal(err, { mailbox, updated, modseq });
      }
    }

    await Journals.create(entries);

    return entries.length;
  }

  fire(aliasId, payload) {
    if (!aliasId) throw new Error('Alias ID missing');

    setImmediate(() => {
      this.publisher.publish(
        IMAP_REDIS_CHANNEL_NAME,
        safeStringify({
          e: aliasId,
          p: payload
        })
      );
    });
  }

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
}

module.exports = IMAPNotifier;
