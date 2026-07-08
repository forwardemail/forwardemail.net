/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('@forwardemail/bytes');
const pify = require('pify');
const { Builder } = require('json-sql-enhanced');

const checkDiskSpace = require('./check-disk-space');
const closeDatabase = require('./close-database');
const getPathToDatabase = require('./get-path-to-database');
const getTemporaryDatabase = require('./get-temporary-database');
const logger = require('./logger');
const onAppend = require('./imap/on-append');
const updateStorageUsed = require('./update-storage-used');
const { syncConvertResult } = require('./mongoose-to-sqlite');

const _ = require('#helpers/lodash');
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
              ..._.omit(session, 'db'),
              remoteAddress: message.remoteAddress,

              // don't append duplicate messages
              checkForExisting: true,

              // auto-create missing Sieve-filtered mailboxes (RFC 5490)
              createFolder: true
            }
          );

          // if successfully appended then delete from the database
          const sql = builder.build({
            type: 'remove',
            table: 'TemporaryMessages',
            condition: {
              _id: m._id
            }
          });
          tmpDb.prepare(sql.query).run(sql.values);
          deleted++;
        } catch (_err) {
          err = Array.isArray(_err) ? _err[0] : _err;
          hasMore = false;
          break;
        }
      }
    }
  }

  // update storage
  try {
    await updateStorageUsed(session.user.alias_id, this.client);
  } catch (err) {
    logger.fatal(err, { session, resolver: this.resolver });
  }

  // close the handle only when it isn't cached in temporaryDatabaseMap
  // (the map owns cached handles and closes them on eviction/shutdown)
  if (!this.temporaryDatabaseMap) {
    try {
      await closeDatabase(tmpDb);
    } catch (err) {
      logger.fatal(err, { session, resolver: this.resolver });
    }
  }

  if (err) throw err;

  return deleted;
}

module.exports = syncTemporaryMailbox;
