/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const bytes = require('@forwardemail/bytes');
const ms = require('ms');
const pify = require('pify');
const revHash = require('rev-hash');

const checkDiskSpace = require('./check-disk-space');
const getPathToDatabase = require('./get-path-to-database');
const getTemporaryDatabase = require('./get-temporary-database');
const logger = require('./logger');
const onAppend = require('./imap/on-append');
const updateStorageUsed = require('./update-storage-used');
const { syncConvertResult } = require('./mongoose-to-sqlite');
const { Builder } = require('#helpers/json-sql');
const refreshSession = require('#helpers/refresh-session');
const { encoder } = require('#helpers/encoder-decoder');

const Aliases = require('#models/aliases');
const TemporaryMessages = require('#models/temporary-messages');
const config = require('#config');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const builder = new Builder({ bufferAsNative: true });

const RELEASE_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
const EXTEND_LOCK_SCRIPT =
  "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('pexpire', KEYS[1], ARGV[2]) else return 0 end";

// (renewed while the sync runs, so a sync that died frees it soon)
const LOCK_TTL = ms('1m');

//
// The message in each other mailbox a Sieve script filed it into (fileinto
// and keep, RFC 5228), once it is stored in the first one.  As Pigeonhole's
// sieve_max_actions, at most 32 mailboxes in all, and only while the quota
// has room for each copy (the storage used does not count the ones just
// stored yet).  An append would see the copy already stored
// (`checkForExisting` looks at every mailbox), so each copy is claimed once
// instead: a delivery tried again, or run twice at once, does not store it
// twice (the claim lasts 5 minutes until the copy is stored, so a copy whose
// process died is stored when the message is delivered again after that).
//
async function storeSieveCopies(session, message) {
  const { copies, fingerprint, date, raw } = message;
  if (!Array.isArray(copies) || copies.length === 0) return;

  let quota;
  try {
    quota = await Aliases.isOverQuota(
      {
        id: session.user.alias_id,
        domain: session.user.domain_id,
        locale: session.user.locale
      },
      0,
      this.client
    );
  } catch (err) {
    logger.error(err, { session });
    return;
  }

  const { storageUsed, maxQuotaPerAlias } = quota;
  for (const [i, copy] of copies.entries()) {
    if (i >= 31 || storageUsed + raw.length * (i + 2) > maxQuotaPerAlias) {
      logger.warn('sieve fileinto copies not stored', {
        user: { id: session.user.alias_user_id },
        ignore_hook: true,
        folders: copies.slice(i).map((copy) => copy.folder)
      });
      break;
    }

    const key = `${config.fingerprintPrefix}:sieve:copy:${revHash(
      encoder.pack([session.user.alias_id, fingerprint, copy.folder])
    )}`;
    let claimed = false;
    try {
      claimed =
        (await this.client.set(key, true, 'PX', ms('5m'), 'NX')) === 'OK';
      if (!claimed) continue;
      await onAppendPromise.call(
        this,
        copy.folder,
        copy.flags || [],
        date,
        raw,
        {
          ...session,
          checkForExisting: false,
          sieveCopy: true,
          // (created when missing, as the first mailbox is, see `sync`)
          createFolder: true,
          // (the user was alerted for the message once already)
          suppressPushAlert: true
        }
      );
      await this.client.set(key, true, 'PX', ms('30d'));
    } catch (err) {
      if (claimed)
        this.client.del(key).catch((err) => logger.fatal(err, { session }));
      logger.error('sieve fileinto copy failed', {
        user: { id: session.user.alias_user_id },
        ignore_hook: false,
        err,
        folder: copy.folder
      });
    }
  }
}

//
// One sync per alias at a time, across processes: two at once read the same
// rows and could both append a message before either deletes it from the
// temporary mailbox.  A sync asked for meanwhile (e.g. one per delivery, see
// `sqlite_sync_request` in imap-server.js) waits for it and then runs; after
// 30 seconds it gives up, as the one running also syncs what arrived since it
// started (the messages stay in the temporary mailbox until a sync runs).
//
async function syncTemporaryMailbox(session) {
  if (!this.client) return sync.call(this, session);

  const key = `sync_temporary_mailbox:${session.user.alias_id}`;
  const owner = randomUUID();
  const deadline = Date.now() + ms('30s');
  while ((await this.client.set(key, owner, 'PX', LOCK_TTL, 'NX')) !== 'OK') {
    if (Date.now() > deadline) {
      logger.warn('temporary mailbox sync skipped while another one runs', {
        session
      });
      return 0;
    }

    await setTimeout(100);
  }

  // (renewed on a timer, as one append can take longer than the lock lasts,
  //  for at most 30 minutes, so a sync that never ends frees it too)
  const start = Date.now();
  const timer = setInterval(() => {
    if (Date.now() - start > ms('30m')) return clearInterval(timer);
    this.client
      .eval(EXTEND_LOCK_SCRIPT, 1, key, owner, LOCK_TTL)
      .catch((err) => logger.fatal(err, { session }));
  }, LOCK_TTL / 3);

  try {
    return await sync.call(this, session);
  } finally {
    clearInterval(timer);
    await this.client
      .eval(RELEASE_LOCK_SCRIPT, 1, key, owner)
      .catch((err) => logger.fatal(err, { session }));
  }
}

async function sync(session) {
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

          await storeSieveCopies.call(
            this,
            { ...session, remoteAddress: message.remoteAddress },
            message
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
module.exports.storeSieveCopies = storeSieveCopies;
