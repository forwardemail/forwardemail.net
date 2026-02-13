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
const ms = require('ms');
const tools = require('@zone-eu/wildduck/lib/tools');
const { Builder } = require('json-sql-enhanced');
const { boolean } = require('boolean');

const Aliases = require('#models/aliases');
const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const getAttachments = require('#helpers/get-attachments');
const i18n = require('#helpers/i18n');
const refineAndLogError = require('#helpers/refine-and-log-error');
const sendWebSocketNotification = require('#helpers/send-websocket-notification');
const updateStorageUsed = require('#helpers/update-storage-used');
const { decodeMetadata } = require('#helpers/msgpack-helpers');
const recursivelyParse = require('#helpers/recursively-parse');

const builder = new Builder({ bufferAsNative: true });

// eslint-disable-next-line max-params
async function onCopy(connection, mailboxId, update, session, fn) {
  this.logger.debug('COPY', { connection, mailboxId, update, session });

  if (this.wsp) {
    // start notifying connection of progress
    let timeout;
    try {
      (function update() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          connection.send('* OK Copy still in progress...');
          update();
        }, ms('15s'));
      })();

      const [bool, response, entries, targetMailbox] = await this.wsp.request({
        action: 'copy',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress
        },
        // connection: null,
        mailboxId,
        update
      });
      clearTimeout(timeout);
      fn(null, bool, response);

      if (entries.length > 0) {
        this.server.notifier
          .addEntries(this, session, targetMailbox._id, entries)
          .then(() =>
            this.server.notifier.fire(session.user.alias_id, update.destination)
          )
          .catch((err) =>
            this.logger.fatal(err, {
              connection,
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
          'messagesCopied',
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
      clearTimeout(timeout);
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'COPY');

    // check if over quota
    const { isOverQuota } = await Aliases.isOverQuota(
      {
        id: session.user.alias_id,
        domain: session.user.domain_id,
        locale: session.user.locale
      },
      0,
      this.client
    );

    if (isOverQuota)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', session.user.locale),
        {
          imapResponse: 'OVERQUOTA'
        }
      );

    const sourceIds = [];
    const sourceUid = [];
    const destinationUid = [];
    const entries = [];
    let copiedMessages = 0;
    let copiedStorage = 0;

    const mailbox = await Mailboxes.findOne(this, session, {
      _id: mailboxId
    });

    if (!mailbox)
      throw new IMAPError(
        i18n.translate('IMAP_MAILBOX_DOES_NOT_EXIST', session.user.locale),
        {
          imapResponse: 'NONEXISTENT'
        }
      );

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
    if (targetMailbox._id.toString() === mailbox._id.toString())
      throw new IMAPError(
        i18n.translate('IMAP_TARGET_AND_SOURCE_SAME', session.user.locale),
        {
          imapResponse: 'CANNOT'
        }
      );

    // return early if no messages
    // (we could also do `_id: -1` as a query)
    if (update.messages.length === 0)
      return fn(
        null,
        true,
        {
          uidValidity: targetMailbox.uidValidity,
          sourceUid,
          destinationUid
        },
        entries,
        targetMailbox
      );

    const condition = {
      mailbox: mailbox._id.toString(),
      uid: tools.checkRangeQuery(update.messages)
    };

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      // sort required for IMAP UIDPLUS
      sort: 'uid'
    });

    let { uidNext } = targetMailbox;

    // const stmt = session.db.prepare(sql.query);
    // for (const m of stmt.iterate(sql.values))
    //
    // NOTE: this is inefficient but works for now
    //
    const messages = session.db.prepare(sql.query).all(sql.values);

    if (messages.length > 0)
      session.db
        .transaction((messages) => {
          for (const m of messages) {
            // don't copy in bulk so it doesn't get out of incremental uid sync
            const _id = new mongoose.Types.ObjectId();
            sourceUid.unshift(m.uid);
            sourceIds.push(m._id);
            destinationUid.unshift(uidNext);

            // copy the message and generate new id
            m._id = _id.toString();
            m.mailbox = targetMailbox._id.toString();
            m.uid = uidNext;
            m.exp = (
              typeof targetMailbox.retention === 'number'
                ? targetMailbox.retention !== 0
                : false
            )
              ? 1
              : 0;
            m.rdate = new Date(
              Date.now() +
                (typeof targetMailbox.retention === 'number'
                  ? targetMailbox.retention
                  : 0)
            ).toISOString();
            m.modseq = targetMailbox.modifyIndex;
            m.junk = targetMailbox.specialUse === '\\Junk';
            m.remoteAddress = session.remoteAddress;
            m.transaction = 'COPY';

            // create new message
            {
              const sql = builder.build({
                type: 'insert',
                table: 'Messages',
                values: m
              });
              session.db.prepare(sql.query).run(sql.values);
            }

            // update attachment store magic number
            const mimeTree = decodeMetadata(m.mimeTree, recursivelyParse);
            const attachmentIds = getAttachments(mimeTree);
            if (attachmentIds.length > 0) {
              const sql = builder.build({
                type: 'update',
                table: 'Attachments',
                condition: {
                  hash: {
                    $in: attachmentIds
                  }
                },
                modifier: {
                  $inc: {
                    counter: 1,
                    magic: m.magic
                  },
                  $set: {
                    counterUpdated: new Date().toString()
                  }
                }
              });
              session.db.prepare(sql.query).run(sql.values);
            }

            // increase counters
            copiedMessages++;
            copiedStorage += m.size;
            uidNext++;

            // add entries
            // <https://github.com/zone-eu/wildduck/blob/76f79fd274e62da3dffe8a2aac170ba41aecaa2b/lib/handlers/on-copy.js#L342-L353>
            entries.push({
              command: 'EXISTS',
              uid: m.uid,
              mailbox: targetMailbox._id,
              message: _id,
              thread: new mongoose.Types.ObjectId(m.thread),
              unseen: boolean(m.unseen),
              idate: new Date(m.idate),
              junk: boolean(m.junk)
            });
          }

          // set all existing messages as copied
          {
            const sql = builder.build({
              type: 'update',
              table: 'Messages',
              condition: {
                _id: {
                  $in: sourceIds
                }
              },
              modifier: {
                $set: {
                  copied: true
                }
              }
            });
            session.db.prepare(sql.query).run(sql.values);
          }

          // store on target mailbox the final value of `uidNext`
          {
            const sql = builder.build({
              type: 'update',
              table: 'Mailboxes',
              condition: {
                _id: targetMailbox._id.toString()
              },
              modifier: {
                $set: {
                  uidNext
                }
              }
            });
            session.db.prepare(sql.query).run(sql.values);
          }
        })
        .immediate(messages);

    // update quota if copied messages
    if (copiedMessages > 0 && copiedStorage > 0) {
      //
      // NOTE: we don't error for quota during copy due to this reasoning
      //       <https://github.com/nodemailer/wildduck/issues/517#issuecomment-1748329188>
      //
      Aliases.isOverQuota(
        {
          id: session.user.alias_id,
          domain: session.user.domain_id,
          locale: session.user.locale
        },
        copiedStorage,
        this.client
      )
        .then((results) => {
          if (results.isOverQuota) {
            const err = new IMAPError(
              i18n.translate(
                'IMAP_MAILBOX_MESSAGE_EXCEEDS_QUOTA',
                session.user.locale,
                session.user.username
              ),
              {
                imapResponse: 'OVERQUOTA',
                isCodeBug: true // admins will get an email/sms alert
              }
            );
            this.logger.fatal(err, {
              mailboxId,
              update,
              session,
              resolver: this.resolver
            });
          }
        })
        .catch((err) =>
          this.logger.fatal(err, {
            copiedStorage,
            connection,
            mailboxId,
            update,
            session,
            resolver: this.resolver
          })
        );

      // NOTE: we update storage used in real-time in `getDatabase`
      // add to `alias.storageSize` the message `size`
      // Aliases.findByIdAndUpdate(alias._id, {
      //   $inc: {
      //     storageUsed: copiedStorage
      //   }
      // })
      //   .then()
      //   .catch((err) =>
      //     this.logger.fatal(err, {
      //       copiedStorage,
      //       connection,
      //       mailboxId,
      //       update,
      //       session,
      //       resolver: this.resolver
      //     })
      //   );
    }

    try {
      session.db.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      this.logger.fatal(err, {
        connection,
        mailboxId,
        update,
        session,
        resolver: this.resolver
      });
    }

    const response = {
      uidValidity: targetMailbox.uidValidity,
      sourceUid,
      destinationUid
    };

    fn(null, true, response, entries, targetMailbox);

    // send websocket push notification
    if (copiedMessages > 0) {
      sendWebSocketNotification(
        this.client,
        session.user.alias_id,
        'messagesCopied',
        {
          sourceMailbox: mailboxId.toString(),
          destinationMailbox: targetMailbox._id.toString(),
          destinationPath: update.destination,
          sourceUid,
          destinationUid
        }
      );
    }

    // update storage in background
    updateStorageUsed(session.user.alias_id, this.client)
      .then()
      .catch((err) =>
        this.logger.fatal(err, {
          connection,
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

module.exports = onCopy;
