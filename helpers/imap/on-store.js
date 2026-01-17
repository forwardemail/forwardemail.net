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

const imapTools = require('@zone-eu/wildduck/imap-core/lib/imap-tools');
const tools = require('@zone-eu/wildduck/lib/tools');
const { Builder } = require('json-sql-enhanced');
const {
  IMAPConnection
} = require('@zone-eu/wildduck/imap-core/lib/imap-connection');

const IMAPError = require('#helpers/imap-error');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const i18n = require('#helpers/i18n');
const updateStorageUsed = require('#helpers/update-storage-used');

const refineAndLogError = require('#helpers/refine-and-log-error');
const { prepareQuery } = require('#helpers/mongoose-to-sqlite');
const { syncConvertResult } = require('#helpers/mongoose-to-sqlite');

const { formatResponse } = IMAPConnection.prototype;

const builder = new Builder({ bufferAsNative: true });

function getFlag(f) {
  return f.trim().toLowerCase();
}

async function onStore(mailboxId, update, session, fn) {
  this.logger.debug('STORE', { mailboxId, update, session });

  if (this.wsp) {
    try {
      const [err, bool, modified, payloads, entries] = await this.wsp.request({
        action: 'store',
        session: {
          id: session.id,
          user: session.user,
          remoteAddress: session.remoteAddress,
          selected: session.selected
        },
        mailboxId,
        update
      });

      // RFC 3501: Clear all pending responses
      // We must not send partial FETCH responses for a failed operation
      if (err) {
        if (modified && modified.length > 0) {
          fn(null, false, modified);
          return;
        }

        throw err;
      }

      if (Array.isArray(payloads)) {
        for (const payload of payloads) {
          session.writeStream.write(payload);
        }
      }

      // <https://github.com/nodemailer/wildduck/blob/08c5804798e7ffe1b281859c4edcec2465d058c2/imap-core/lib/commands/store.js#L145>
      if (entries.length > 0) {
        this.server.notifier
          .addEntries(this, session, mailboxId, entries)
          .then(() => this.server.notifier.fire(session.user.alias_id))
          .catch((err) =>
            this.logger.fatal(err, {
              mailboxId,
              update,
              session,
              resolver: this.resolver
            })
          );
      }

      fn(null, bool, modified);
    } catch (err) {
      if (err.imapResponse) return fn(null, err.imapResponse);
      fn(err);
    }

    return;
  }

  try {
    await this.refreshSession(session, 'STORE');

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

    let err;
    const modified = [];
    const entries = [];
    const payloads = [];
    const condstoreEnabled = Boolean(session?.selected?.condstoreEnabled);
    const query = {
      mailbox: mailbox._id
    };

    let newModseq;

    let queryAll = false;

    // return early if no messages
    // (we could also do `_id: -1` as a query)
    if (update.messages.length === 0)
      return fn(null, null, true, modified, payloads, entries);

    if (
      !update.isUid &&
      update.messages.length === session?.selected?.uidList.length
    ) {
      // 1:*
      queryAll = true;
    } else {
      // do not use uid selector for 1:*
      query.uid = tools.checkRangeQuery(update.messages);
    }

    // converts objectids -> strings and arrays/json appropriately
    const condition = prepareQuery(
      Messages.mapping,
      // TODO: we can probably remove this and leave as `query`
      JSON.parse(JSON.stringify(query))
    );

    // TODO: `condition` may need further refined for accuracy (e.g. see `prepareQuery`)
    const projection = {
      _id: true,
      uid: true,
      flags: true,
      modseq: true,
      thread: true
    };

    const fields = Object.keys(projection);

    const sql = builder.build({
      type: 'select',
      table: 'Messages',
      condition,
      fields,
      // sort required for IMAP UIDPLUS
      sort: 'uid'
    });

    const messages = session.db.prepare(sql.query).all(sql.values);

    // Determine if unseen status changed for this STORE operation
    const unseenChange = update.value.some((f) => getFlag(f) === '\\seen');

    try {
      if (messages.length > 0) {
        session.db
          .transaction((messages) => {
            for (const result of messages) {
              const message = syncConvertResult(Messages, result);
              // this.logger.debug('fetched message', {
              //   result,
              //   message,
              //   mailboxId,
              //   update,
              //   session
              // });

              // skip messages if necessary
              if (
                queryAll &&
                (!session?.selected?.uidList ||
                  !session.selected.uidList.includes(message.uid))
              ) {
                this.logger.debug('message skipped due to queryAll', {
                  message,
                  queryAll,
                  session,
                  update
                });
                continue;
              }

              if (
                update.unchangedSince &&
                message.modseq > update.unchangedSince
              ) {
                this.logger.debug('message skipped due to unchangedSince', {
                  message,
                  queryAll,
                  session,
                  update
                });
                modified.push(message.uid);
                continue;
              }

              // TODO: trim() on flags in message model (?)
              const existingFlags = new Set(
                message.flags.map((f) => getFlag(f))
              );

              const $set = {};
              let updated;

              switch (update.action) {
                case 'set': {
                  // operation is only an update if flags are different
                  if (
                    existingFlags.size !== update.value.length ||
                    update.value.some((f) => !existingFlags.has(getFlag(f)))
                  )
                    updated = true;

                  message.flags = [...new Set([update.value].flat())];

                  // set flags
                  if (updated) {
                    $set.flags = message.flags;
                    $set.unseen = !message.flags.includes('\\Seen');
                    $set.flagged = message.flags.includes('\\Flagged');
                    $set.undeleted = !message.flags.includes('\\Deleted');
                    $set.draft = message.flags.includes('\\Draft');
                    $set.searchable = !message.flags.includes('\\Deleted');
                  }

                  break;
                }

                case 'add': {
                  const newFlags = [];
                  message.flags = [
                    ...new Set([
                      ...message.flags,
                      ...update.value.filter((f) => {
                        if (!existingFlags.has(getFlag(f))) {
                          updated = true;
                          newFlags.push(f);
                          return true;
                        }

                        return false;
                      })
                    ])
                  ];

                  // add flags
                  if (updated) {
                    $set.flags = message.flags;

                    // Check if any system flags were added (case-insensitive)
                    const newFlagsLower = new Set(
                      newFlags.map((f) => getFlag(f))
                    );

                    if (
                      newFlagsLower.has('\\seen') ||
                      newFlagsLower.has('\\flagged') ||
                      newFlagsLower.has('\\deleted') ||
                      newFlagsLower.has('\\draft')
                    ) {
                      if (newFlagsLower.has('\\seen')) $set.unseen = false;

                      if (newFlagsLower.has('\\flagged')) $set.flagged = true;

                      if (newFlagsLower.has('\\deleted')) {
                        $set.undeleted = false;
                        $set.searchable = false;
                      }

                      if (newFlagsLower.has('\\draft')) $set.draft = true;
                    }
                  }

                  break;
                }

                case 'remove': {
                  // operation is only an update if flags are different
                  const oldFlags = [];
                  const flagUpdates = new Set(
                    update.value.map((f) => getFlag(f))
                  );

                  message.flags = [
                    ...new Set(
                      message.flags.filter((f) => {
                        if (!flagUpdates.has(getFlag(f))) return true;

                        oldFlags.push(f);
                        updated = true;
                        return false;
                      })
                    )
                  ];

                  // remove flags
                  if (updated) {
                    $set.flags = message.flags;

                    // Check if any system flags were removed (case-insensitive)
                    const oldFlagsLower = new Set(
                      oldFlags.map((f) => getFlag(f))
                    );

                    if (
                      oldFlagsLower.has('\\seen') ||
                      oldFlagsLower.has('\\flagged') ||
                      oldFlagsLower.has('\\deleted') ||
                      oldFlagsLower.has('\\draft')
                    ) {
                      if (oldFlagsLower.has('\\seen')) $set.unseen = true;

                      if (oldFlagsLower.has('\\flagged')) $set.flagged = false;

                      if (oldFlagsLower.has('\\deleted')) {
                        $set.undeleted = true;
                        if (!['\\Junk', '\\Trash'].includes(mailbox.specialUse))
                          $set.searchable = true;
                      }

                      if (oldFlagsLower.has('\\draft')) $set.draft = false;
                    }
                  }

                  break;
                }

                default: {
                  throw new TypeError('Unknown action');
                }
              }

              // return early if not updated
              if (!updated) continue;

              // get modseq
              if (!newModseq) newModseq = mailbox.modifyIndex + 1;

              if (!update.silent || condstoreEnabled) {
                // write to socket the response
                payloads.push(
                  formatResponse.call(session, 'FETCH', message.uid, {
                    uid: update.isUid ? message.uid : false,
                    flags: message.flags,
                    modseq: condstoreEnabled ? newModseq : false
                  })
                );
              }

              $set.modseq = newModseq;

              // RFC 7162 Section 3.1: CONDSTORE Extension
              // "The server MUST guarantee that each STORE command performed on the same
              // mailbox will get a different mod-sequence value."
              //
              // We use optimistic locking (modseq condition) to detect concurrent modifications.
              // This prevents lost updates when multiple clients modify the same message.
              //
              // Note: UNCHANGEDSINCE pre-filtering is handled earlier (lines 198-210)
              // This modseq check is for general concurrent modification detection.
              //
              // IMPORTANT: We use exact match (not $lt) because message.modseq can be higher
              // than mailbox.modifyIndex when messages are moved between mailboxes.
              // The optimistic lock works by comparing the fetched modseq with the current
              // database value - if they differ, another client modified the message.
              const condition = prepareQuery(Messages.mapping, {
                _id: message._id,
                mailbox: mailbox._id,
                uid: message.uid,
                // Optimistic locking: Only update if modseq matches what we fetched
                // This detects if another client modified the message between
                // when we read it and when we're trying to update it
                modseq: message.modseq
                // TODO: we may want to revert back to this down the road
                // modseq: {
                //   $lt: newModseq
                // }
              });

              // RFC 7162 Section 3.1.4: STORE and UID STORE Commands
              // "For any two successful STORE operations performed in the same session
              // on the same mailbox, the mod-sequence of the second completed operation
              // MUST be greater than the mod-sequence of the first completed operation."

              const sql = builder.build({
                type: 'update',
                table: 'Messages',
                condition,
                modifier: {
                  $set: prepareQuery(Messages.mapping, $set)
                }
              });

              // Execute UPDATE with optimistic locking
              const updateResult = session.db
                .prepare(sql.query)
                .run(sql.values);

              // RFC 7162: Handle concurrent modification detection
              //
              // If UPDATE affected 0 rows, it means the modseq condition failed,
              // indicating another client modified this message concurrently.
              //
              // Per RFC 3501 Section 6.4.6: STORE Command
              // "NO - store error: can't store that data"
              //
              // We MUST return NO to the client to indicate the operation failed.
              // The client can then re-fetch the message state and retry if needed.
              //
              // This matches the behavior of other RFC-compliant servers:
              // - Dovecot: Returns NO on concurrent modification
              // - Cyrus: Returns NO on optimistic lock failure
              if (updateResult.changes === 0) {
                this.logger.warn(
                  'STORE failed due to concurrent modification',
                  {
                    ignore_hook: false,
                    resolver: this.resolver,
                    message: message._id,
                    uid: message.uid,
                    mailbox: mailbox._id,
                    expectedModseq: newModseq,
                    actualModseq: message.modseq,
                    session
                  }
                );

                // RFC 3501 Section 6.4.6: Return NO response
                // This tells the client the operation failed and they should retry
                throw new IMAPError(
                  i18n.translate(
                    'IMAP_OUT_OF_SYNC_TRY_AGAIN',
                    session.user.locale
                  ),
                  {
                    // Closest semantic match, but typically used for resource locking
                    // * NO INUSE Your client is not in sync with another process or client.
                    imapResponse: 'INUSE'
                  }
                );
              }

              // RFC 7162 Section 3.1.4: Successful STORE
              // "Once a CONDSTORE enabling command is issued by the client, the server
              // MUST automatically include both UID and mod-sequence data in all
              // subsequent untagged FETCH responses"
              const entry = {
                command: 'FETCH',
                ignore: session.id,
                uid: message.uid,
                flags: message.flags,
                thread: message.thread,
                message: message._id,
                modseq: newModseq,
                unseenChange
              };

              entries.push(entry);
            }

            // update mailbox flags
            // TODO: see FIXME from wildduck at <https://github.com/nodemailer/wildduck/blob/fed3d93f7f2530d468accbbac09ef6195920b28e/lib/handlers/on-store.js#L419>
            const newFlags = [];
            if (update.action !== 'remove') {
              const mailboxFlags = [
                ...imapTools.systemFlags,
                ...(mailbox.flags || [])
              ].map((f) => getFlag(f));

              // find flags that don't yet exist for mailbox to add
              for (const flag of update.value) {
                // limit mailbox flags by 100
                if (mailboxFlags.length + newFlags.length >= 100) {
                  const err = new TypeError('Mailbox flags exceeds 100');
                  err.mailboxFlags = mailboxFlags;
                  err.newFlags = newFlags;
                  err.session = session;
                  throw err;
                }

                // add flag if mailbox does not include it
                if (!mailboxFlags.includes(getFlag(flag))) newFlags.push(flag);
              }
            }

            if (newModseq || newFlags.length > 0) {
              const $set = {};
              if (newModseq) $set.modifyIndex = newModseq;

              if (newFlags.length > 0) {
                mailbox.flags.push(...newFlags);
                mailbox.flags = [...new Set(mailbox.flags)];
                $set.flags = mailbox.flags;
              }

              const sql = builder.build({
                type: 'update',
                table: 'Mailboxes',
                condition: {
                  _id: mailbox._id.toString()
                },
                modifier: {
                  $set: prepareQuery(Mailboxes.mapping, $set)
                }
              });
              session.db.prepare(sql.query).run(sql.values);
            }
          })
          .immediate(messages);
      }
    } catch (_err) {
      err = _err;
    }

    // send response
    fn(null, err, true, modified, payloads, entries);

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

module.exports = onStore;
