/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const _ = require('lodash');
const bytes = require('@forwardemail/bytes');
const checkDiskSpace = require('check-disk-space').default;
const ms = require('ms');
const pify = require('pify');
const { Builder } = require('json-sql');

const getPathToDatabase = require('./get-path-to-database');
const getTemporaryDatabase = require('./get-temporary-database');
const logger = require('./logger');
const onAppend = require('./imap/on-append');
const updateStorageUsed = require('./update-storage-used');
const { syncConvertResult } = require('./mongoose-to-sqlite');

const TemporaryMessages = require('#models/temporary-messages');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const builder = new Builder();

async function syncTemporaryMailbox(session) {
  let deleted = 0;

  let err;

  // only allow sync to occur once every 1m
  const cache = await this.client.get(`sync_check:${session.user.alias_id}`);

  if (!cache) {
    // set cache so we don't sync twice at once
    await this.client.set(
      `sync_check:${session.user.alias_id}`,
      true,
      'PX',
      ms('5m')
    );

    const tmpDb = await getTemporaryDatabase.call(this, session);

    // sync entire db from WAL over to get all messages
    tmpDb.pragma('wal_checkpoint(FULL)');

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
        // eslint-disable-next-line no-await-in-loop
        await this.client.set(
          `sync_check:${session.user.alias_id}`,
          true,
          'PX',
          ms('5m')
        );

        const sql = builder.build({
          type: 'select',
          table: 'TemporaryMessages',
          limit: 10
        });

        const messages = tmpDb.prepare(sql.query).all(sql.values);

        if (messages.length === 0) {
          hasMore = false;
          break;
        }

        for (const m of messages) {
          try {
            const message = syncConvertResult(TemporaryMessages, m);
            //
            // if one message fails then not all of them should
            // (e.g. one might have an issue with `date` or `raw`)
            //
            // check that we have available space
            const storagePath = getPathToDatabase({
              id: session.user.alias_id,
              storage_location: session.user.storage_location
            });
            const spaceRequired = Buffer.byteLength(message.raw) * 2;
            // eslint-disable-next-line no-await-in-loop
            const diskSpace = await checkDiskSpace(storagePath);
            if (diskSpace.free < spaceRequired)
              throw new TypeError(
                `Needed ${bytes(spaceRequired)} but only ${bytes(
                  diskSpace.free
                )} was available`
              );

            // eslint-disable-next-line no-await-in-loop
            await onAppendPromise.call(
              this,
              'INBOX',
              [],
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
      logger.fatal(err, { session });
    }

    // update storage
    try {
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      logger.fatal(err, { session });
    }

    // NOTE: we don't want to close DB because we re-use it
    // try {
    //   await closeDatabase(tmpDb);
    // } catch (err) {
    //   logger.fatal(err, { session });
    // }

    if (err) throw err;

    // update cache so we can try again in 1m
    await this.client.set(
      `sync_check:${session.user.alias_id}`,
      true,
      'PX',
      ms('1m')
    );
  }

  return deleted;
}

module.exports = syncTemporaryMailbox;
