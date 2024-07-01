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
const tools = require('wildduck/lib/tools');
const { Builder } = require('json-sql');
const { boolean } = require('boolean');
const { IMAPConnection } = require('wildduck/imap-core/lib/imap-connection');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const updateStorageUsed = require('#helpers/update-storage-used');
const { acquireLock, releaseLock } = require('#helpers/lock');
const { prepareQuery } = require('#helpers/mongoose-to-sqlite');

const { formatResponse } = IMAPConnection.prototype;

// const BULK_BATCH_SIZE = 150;

const builder = new Builder();

// eslint-disable-next-line complexity
async function onMove(mailboxId, update, session, fn) {
  this.logger.debug('MOVE', { mailboxId, update, session });

  if (this.wsp) {
    try {
      const [bool, response] = await this.wsp.request({
        action: 'move',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress,
          selected: session.selected
        },
        mailboxId,
        update
      });

      fn(null, bool, response);
    } catch (err) {
      fn(err);
    }

    return;
  }

  let lock;
  try {
    await this.refreshSession(session, 'MOVE');

    lock = await acquireLock(this, session.db);

    const targetMailbox = await Mailboxes.findOne(this, session, {
      path: update.destination
    });

    if (!targetMailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'TRYCREATE'
        }
      );

    // increment modification index to indicate a change occurred on old mailbox
    const mailbox = await Mailboxes.findOneAndUpdate(
      this,
      session,
      {
        _id: mailboxId
      },
      {
        $inc: {
          modifyIndex: 1
        }
      },
      {
        returnDocument: 'after'
      }
    );

    if (!mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'TRYCREATE'
        }
      );

    let err;

    const sourceUid = [];
    const destinationUid = [];

    const expungeEntries = [];
    const existEntries = [];

    try {
      const condition = {
        mailbox: mailbox._id.toString()
      };

      // <https://github.com/nodemailer/wildduck/issues/698>
      if (update.messages.length > 0)
        condition.uid = tools.checkRangeQuery(update.messages);

      const sql = builder.build({
        type: 'select',
        table: 'Messages',
        condition,
        // sort required for IMAP UIDPLUS
        sort: 'uid'
      });

      const ops = [];

      const { modifyIndex, specialUse, retention, _id } = targetMailbox;
      let { uidNext } = targetMailbox;
      const stmt = session.db.prepare(sql.query);
      for (const m of stmt.iterate(sql.values)) {
        // add to source uid array
        sourceUid.push(m.uid);
        destinationUid.push(uidNext);

        const flags = JSON.parse(m.flags);

        // update message
        const exp = typeof retention === 'number' ? retention !== 0 : false;
        const rdate = new Date(Date.now() + (retention || 0));

        const sql = builder.build({
          type: 'update',
          table: 'Messages',
          condition: {
            _id: m._id
          },
          modifier: {
            $set: prepareQuery(Messages.mapping, {
              mailbox: _id,
              uid: uidNext,
              exp,
              rdate,
              modseq: modifyIndex,
              junk: specialUse === '\\Junk',
              remoteAddress: session.remoteAddress,
              transaction: 'MOVE',
              searchable: !flags.includes('\\Deleted')
            })
          }
        });

        // NOTE: otherwise we get the error:
        // > "This database connection is busy executing a query"
        // session.db.prepare(sql.query).run(sql.values);
        ops.push([sql.query, sql.values]);

        expungeEntries.push({
          ignore: session.id,
          command: 'EXPUNGE',
          uid: m.uid,
          // modseq is needed to avoid updating mailbox entry
          modseq: mailbox.modifyIndex || 1,
          unseen: boolean(m.unseen),
          idate: new Date(m.idate),
          mailbox: mailbox._id,
          message: new mongoose.Types.ObjectId(m._id),
          thread: new mongoose.Types.ObjectId(m.thread)
        });

        // EXIST entries
        existEntries.push({
          command: 'EXISTS',
          uid: uidNext,
          unseen: boolean(m.unseen),
          // TODO: set `modseq` equal to modifyIndex + 1 of target mailbox (?)
          idate: new Date(m.idate),
          mailbox: _id,
          message: new mongoose.Types.ObjectId(m._id),
          thread: new mongoose.Types.ObjectId(m.thread)
          // junk
        });

        // increment uid next by one
        uidNext++;
      }

      if (ops.length > 0) {
        // store on target mailbox the final value of `uidNext`
        {
          const sql = builder.build({
            type: 'update',
            table: 'Mailboxes',
            condition: {
              _id: _id.toString()
            },
            modifier: {
              $set: {
                uidNext
              }
            }
          });
          ops.push([sql.query, sql.values]);
        }

        // perform db operations
        session.db.transaction(() => {
          for (const op of ops) {
            session.db.prepare(op[0]).run(op[1]);
          }
        })();
      }
    } catch (_err) {
      err = _err;
    }

    // release lock
    try {
      await releaseLock(this, session.db, lock);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
    }

    // throw error if any
    if (err) throw err;

    // update storage
    try {
      session.db.pragma('wal_checkpoint(PASSIVE)');
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      this.logger.fatal(err, { mailboxId, update, session });
    }

    // set by POP3 `on-update.js` to not broadcast messages
    if (!update.silent) {
      if (sourceUid.length > 0 && session?.selected?.uidList) {
        await this.wss.broadcast(session, {
          tag: '*',
          command: String(session.selected.uidList.length),
          attributes: [
            {
              type: 'atom',
              value: 'EXISTS'
            }
          ]
        });
      }

      // EXPUNGE entries
      if (expungeEntries.length > 0) {
        await this.wss.broadcast(
          session,
          expungeEntries.map((entry) =>
            formatResponse.call(session, 'EXPUNGE', entry.uid)
          )
        );
      }
    }

    if (sourceUid.length > 0) {
      // expunge messages from old mailbox
      await this.server.notifier.addEntries(
        this,
        session,
        mailboxId,
        expungeEntries
      );
      await this.server.notifier.addEntries(
        this,
        session,
        targetMailbox._id,
        existEntries
      );
      this.server.notifier.fire(session.user.alias_id);
    }

    // send response
    const response = {
      uidValidity: targetMailbox.uidValidity,
      sourceUid,
      destinationUid,
      mailbox: mailbox._id,
      target: targetMailbox._id,
      status: 'moved'
    };

    fn(null, true, response);
  } catch (err) {
    // release lock
    if (lock?.success) {
      try {
        await releaseLock(this, session.db, lock);
      } catch (err) {
        this.logger.fatal(err, { mailboxId, update, session });
      }
    }

    // NOTE: wildduck uses `imapResponse` so we are keeping it consistent
    if (err.imapResponse) {
      this.logger.error(err, { mailboxId, update, session });
      return fn(null, err.imapResponse);
    }

    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onMove;
