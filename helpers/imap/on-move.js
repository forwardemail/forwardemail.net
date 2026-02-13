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
const tools = require('@zone-eu/wildduck/lib/tools');
const { Builder } = require('json-sql-enhanced');
const { boolean } = require('boolean');
const {
  IMAPConnection
} = require('@zone-eu/wildduck/imap-core/lib/imap-connection');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const sendWebSocketNotification = require('#helpers/send-websocket-notification');
const updateStorageUsed = require('#helpers/update-storage-used');
const { prepareQuery } = require('#helpers/mongoose-to-sqlite');
const { decodeMetadata } = require('#helpers/msgpack-helpers');
const recursivelyParse = require('#helpers/recursively-parse');

const { formatResponse } = IMAPConnection.prototype;

// const BULK_BATCH_SIZE = 150;

const builder = new Builder({ bufferAsNative: true });

async function onMove(mailboxId, update, session, fn) {
  this.logger.debug('MOVE', { mailboxId, update, session });

  if (this.wsp) {
    try {
      const [bool, response, targetMailbox, expungeEntries, existEntries] =
        await this.wsp.request({
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

      const payloads = [];

      // <https://github.com/zone-eu/wildduck/blob/76f79fd274e62da3dffe8a2aac170ba41aecaa2b/lib/message-handler.js#L2184-L2201>
      // NOTE: see the code for `formatResponse` here which modifies the session object
      // <https://github.com/zone-eu/wildduck/blob/76f79fd274e62da3dffe8a2aac170ba41aecaa2b/imap-core/lib/imap-connection.js#L819-L821>
      // if (command === 'EXPUNGE') {
      //   this.selected.uidList.splice(seq - 1, 1);
      // }
      //
      // NOTE: therefore all EXPUNGE instances need to have
      //       formatResponse get called in the IMAP instance
      //       and similarly for EXISTS
      // <https://github.com/zone-eu/wildduck/blob/76f79fd274e62da3dffe8a2aac170ba41aecaa2b/imap-core/lib/imap-connection.js#L808-L811>
      // if (command === 'EXISTS') {
      //     this.selected.uidList.push(uid);
      //
      // so basically anywhere formatResponse is called it needs to happen on IMAP side
      //
      if (!update.silent && response.sourceUid.length > 0) {
        for (const uid of response.sourceUid) {
          payloads.push(formatResponse.call(session, 'EXPUNGE', uid));
        }
      }

      // set by POP3 `on-update.js` to not broadcast messages
      // <https://github.com/zone-eu/wildduck/blob/76f79fd274e62da3dffe8a2aac170ba41aecaa2b/lib/message-handler.js#L2083-L2095>
      if (
        !update.silent &&
        response.sourceUid.length > 0 &&
        session?.selected?.uidList
      ) {
        payloads.push({
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

      if (Array.isArray(payloads)) {
        for (const payload of payloads) {
          session.writeStream.write(payload);
        }
      }

      fn(null, bool, response);

      if (expungeEntries.length > 0 && existEntries.length > 0) {
        this.server.notifier
          .addEntries(this, session, mailboxId, expungeEntries)
          .then(() =>
            this.server.notifier
              .addEntries(this, session, targetMailbox._id, existEntries)
              .then(() => this.server.notifier.fire(session.user.alias_id))
              .catch((err) =>
                this.logger.fatal(err, {
                  mailboxId,
                  update,
                  session,
                  resolver: this.resolver
                })
              )
          )
          .catch((err) =>
            this.logger.fatal(err, {
              mailboxId,
              update,
              session,
              resolver: this.resolver
            })
          );

        // send websocket push notification
        sendWebSocketNotification(
          this.client,
          session.user.alias_id,
          'messagesMoved',
          {
            sourceMailbox: mailboxId.toString(),
            destinationMailbox: targetMailbox._id.toString(),
            destinationPath: update.destination,
            sourceUid: response.sourceUid,
            destinationUid: response.destinationUid
          }
        );
      }
    } catch (err) {
      // NOTE: if POP3 then throw err (since POP3 re-uses this)
      if (this?.constructor?.name !== 'POP3' && err.imapResponse)
        return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'MOVE');

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

    // check that destination and source are not the same
    // RFC 6851 allows MOVE to same mailbox but doesn't mandate it
    // This is a client-side error, not a server bug
    if (targetMailbox._id.toString() === mailboxId.toString()) {
      this.logger.debug('MOVE to same mailbox attempted', {
        mailboxId,
        update,
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        targetMailbox
      });

      throw new IMAPError(
        i18n.translate('IMAP_TARGET_AND_SOURCE_SAME', session.user.locale),
        {
          imapResponse: 'CANNOT'
        }
      );
    }

    //
    // TODO: we should revert if errors occur (?)
    //
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

    const sourceUid = [];
    const destinationUid = [];
    const ops = [];
    const expungeEntries = [];
    const existEntries = [];

    // safeguard since MOVE command in wildduck uses session.selected.uidList
    if (
      session?.selected?.mailbox &&
      session.selected.mailbox.toString() !== mailbox._id.toString()
    ) {
      // verbose for admins to investigate
      const err = new IMAPError(
        i18n.translate('IMAP_MAILBOX_SESSION_OUTDATED', session.user.locale),
        { imapResponse: 'CANNOT' }
      );
      err.isCodeBug = true;
      err.mailboxId = mailboxId;
      err.update = update;
      err.session = session;
      err.targetMailbox = targetMailbox;
      err.mailbox = mailbox;
      this.logger.fatal(err);

      throw err;
    }

    // return early if no messages
    // (we could also do `_id: -1` as a query)
    if (!update._id && update.messages.length === 0)
      fn(
        null,
        true,
        {
          uidValidity: targetMailbox.uidValidity,
          sourceUid,
          destinationUid,
          mailbox: mailbox._id,
          target: targetMailbox._id,
          status: 'moved'
        },
        targetMailbox,
        expungeEntries,
        existEntries
      );

    // <https://github.com/nodemailer/wildduck/issues/698>
    // <https://github.com/nodemailer/wildduck/issues/710>
    const condition = {
      mailbox: mailbox._id.toString()
    };

    // NOTE: this is for API support to be more specific than a UID
    if (update._id) {
      condition._id = update._id;
    } else {
      condition.uid = tools.checkRangeQuery(update.messages);
    }

    const { modifyIndex, specialUse, retention, _id } = targetMailbox;
    let { uidNext } = targetMailbox;

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      // sort required for IMAP UIDPLUS
      sort: 'uid'
    });

    const stmt = session.db.prepare(sql.query);
    for (const m of stmt.iterate(sql.values)) {
      // add to source uid array
      sourceUid.push(m.uid);
      destinationUid.push(uidNext);

      const flags = decodeMetadata(m.flags, recursivelyParse);

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

      existEntries.push({
        command: 'EXISTS',
        uid: uidNext,
        unseen: !flags.includes('\\Seen'),
        // TODO: set `modseq` equal to modifyIndex + 1 of target mailbox (?)
        idate: new Date(m.idate),
        mailbox: _id,
        message: new mongoose.Types.ObjectId(m._id),
        thread: new mongoose.Types.ObjectId(m.thread),
        junk: specialUse === '\\Junk'
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
      session.db
        .transaction((ops) => {
          for (const op of ops) {
            session.db.prepare(op[0]).run(op[1]);
          }
        })
        .immediate(ops);
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

    fn(null, true, response, targetMailbox, expungeEntries, existEntries);

    // send websocket push notification
    if (sourceUid.length > 0) {
      sendWebSocketNotification(
        this.client,
        session.user.alias_id,
        'messagesMoved',
        {
          sourceMailbox: mailboxId.toString(),
          destinationMailbox: targetMailbox._id.toString(),
          destinationPath: update.destination,
          sourceUid,
          destinationUid
        }
      );
    }

    try {
      session.db.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      this.logger.fatal(err, {
        mailboxId,
        update,
        session,
        resolver: this.resolver
      });
    }

    // update storage in background
    updateStorageUsed(session.user.alias_id, this.client)
      .then()
      .catch((err) =>
        this.logger.fatal(err, {
          mailboxId,
          update,
          session,
          resolver: this.resolver
        })
      );
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onMove;
