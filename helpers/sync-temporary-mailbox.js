/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('@forwardemail/bytes');
const pify = require('pify');
const { Builder } = require('json-sql-enhanced');

const checkDiskSpace = require('./check-disk-space');
const getPathToDatabase = require('./get-path-to-database');
const getTemporaryDatabase = require('./get-temporary-database');
const logger = require('./logger');
const onAppend = require('./imap/on-append');
const updateStorageUsed = require('./update-storage-used');
const { syncConvertResult } = require('./mongoose-to-sqlite');
const refreshSession = require('#helpers/refresh-session');

const TemporaryMessages = require('#models/temporary-messages');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const builder = new Builder({ bufferAsNative: true });

async function syncTemporaryMailbox(session) {
  let deleted = 0;

  let err;

  const tmpDb = await getTemporaryDatabase.call(this, session);

  // NOTE: wal_checkpoint removed — SQLite auto-checkpoints at 1000 pages
  // and explicit checkpointing caused SQLITE_BUSY_SNAPSHOT under concurrency

  const sql = builder.build({
    table: 'TemporaryMessages',
    fields: [
      {
        expression: 'count(1)'
      }
    ]
  });

  const count = tmpDb.prepare(sql.query).pluck().get(sql.values);

  if (count > 0) {
    //
    // Pre-loop optimization: call refreshSession once to:
    // 1. Refresh user data from MongoDB (if needed, cached for 1d in Redis)
    // 2. Set session.db via getDatabase (LRU cache lookup)
    //
    // This avoids 25 redundant Redis RTTs + LRU lookups per batch
    // because getDatabase returns immediately when session.db is already
    // set and open (see get-database.js line 132).
    //
    await refreshSession.call(this, session, 'APPEND');

    let hasMore = true;
    while (hasMore) {
      const sql = builder.build({
        type: 'select',
        table: 'TemporaryMessages',
        limit: 25 // 250mb max (50mb per message)
      });

      const messages = tmpDb.prepare(sql.query).all(sql.values);

      if (messages.length === 0) {
        hasMore = false;
        break;
      }

      // check that we have available space
      const storagePath = getPathToDatabase({
        id: session.user.alias_id,
        storage_location: session.user.storage_location
      });
      const spaceRequired = Math.round(bytes('50MB') * messages.length * 2);

      const diskSpace = await checkDiskSpace(storagePath);
      if (diskSpace.free < spaceRequired)
        throw new TypeError(
          `Needed ${bytes(spaceRequired)} but only ${bytes(
            diskSpace.free
          )} was available`
        );

      // Collect IDs of successfully appended messages for batch delete
      const appendedIds = [];

      for (const m of messages) {
        try {
          const message = syncConvertResult(TemporaryMessages, m);
          //
          // if one message fails then not all of them should
          // (e.g. one might have an issue with `date` or `raw`)
          //

          // Use Sieve-determined mailbox and flags if available
          // (stored during MX delivery when Sieve filtering was applied)
          const targetMailbox = message.mailbox || 'INBOX';
          const targetFlags = message.flags || [];

          await onAppendPromise.call(
            this,
            targetMailbox,
            targetFlags,
            message.date,
            message.raw,
            {
              // Pass session WITH db so refreshSession/getDatabase
              // can short-circuit (session.db already set and open)
              ...session,
              remoteAddress: message.remoteAddress,

              // don't append duplicate messages
              checkForExisting: true,

              // auto-create missing Sieve-filtered mailboxes (RFC 5490)
              createFolder: true,

              // The MX delivery that wrote this message to the temporary
              // mailbox already sent a user-visible push alert for it
              // (parse-payload tmp storage path). onAppend must still emit
              // the newMessage event so websocket clients and silent data
              // pushes keep caches in sync, but it must not alert the user
              // a second time.
              suppressPushAlert: true
            }
          );

          // Track successfully appended message for batch delete
          appendedIds.push(m._id);
          deleted++;

          // Release the raw buffer reference so GC can reclaim it
          // before the next message is processed
          m.raw = null;

          // yield event loop between messages so other requests aren't starved
          await new Promise(setImmediate);
        } catch (_err) {
          err = Array.isArray(_err) ? _err[0] : _err;
          hasMore = false;
          break;
        }
      }

      // Batch delete all successfully appended messages from tmpDb
      // (single DELETE WHERE _id IN (...) instead of N individual DELETEs)
      if (appendedIds.length > 0) {
        const deleteSql = builder.build({
          type: 'remove',
          table: 'TemporaryMessages',
          condition: {
            _id: { $in: appendedIds }
          }
        });
        tmpDb.prepare(deleteSql.query).run(deleteSql.values);
      }
    }
  }

  // update storage
  try {
    await updateStorageUsed(session.user.alias_id, this.client);
  } catch (err) {
    logger.fatal(err, { session, resolver: this.resolver });
  }

  // NOTE: tmpDb lifecycle is managed by temporaryDatabaseMap LRU cache.
  // Do not close it here — the LRU will evict and close idle connections
  // after the configured idleTTL (2 minutes).

  if (err) throw err;

  return deleted;
}

module.exports = syncTemporaryMailbox;
