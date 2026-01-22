/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const pify = require('pify');
const { Builder } = require('json-sql-enhanced');

const checkDiskSpace = require('./check-disk-space');
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

  // only allow sync to occur once every 1m
  const cache = await this.client.get(`sync_check:${session.user.alias_id}`);

  if (!cache) {
    // set cache so we don't sync twice at once
    let expireAtMs = dayjs().add(1, 'minute').toDate().getTime();
    await this.client.set(
      `sync_check:${session.user.alias_id}`,
      true,
      'PXAT',
      expireAtMs
    );

    const tmpDb = await getTemporaryDatabase.call(this, session);

    // sync entire db from WAL over to get all messages
    try {
      tmpDb.pragma('wal_checkpoint(FULL)');
    } catch (err) {
      logger.fatal(err, { session, resolver: this.resolver });
    }

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
        // set cache so we don't sync twice at once
        // if it's been more than 60s
        if (Date.now() >= expireAtMs) {
          expireAtMs = dayjs().add(1, 'minute').toDate().getTime();

          await this.client.set(
            `sync_check:${session.user.alias_id}`,
            true,
            'PXAT',
            expireAtMs
          );
        }

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
                checkForExisting: true
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

    try {
      // run a checkpoint to copy over wal to db
      tmpDb.pragma('wal_checkpoint(PASSIVE)');
    } catch (err) {
      logger.fatal(err, { session, resolver: this.resolver });
    }

    // update storage
    try {
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      logger.fatal(err, { session, resolver: this.resolver });
    }

    // NOTE: we don't want to close DB because we re-use it
    // try {
    //   await closeDatabase(tmpDb);
    // } catch (err) {
    //   logger.fatal(err, { session, resolver: this.resolver });
    // }

    if (err) throw err;

    // update cache so we can try again
    await this.client.del(`sync_check:${session.user.alias_id}`);
  }

  return deleted;
}

module.exports = syncTemporaryMailbox;
