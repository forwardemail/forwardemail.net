/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const bytes = require('@forwardemail/bytes');
const ms = require('ms');
const pify = require('pify');
const revHash = require('rev-hash');

const checkDiskSpace = require('./check-disk-space');
const getPathToDatabase = require('./get-path-to-database');
const getTemporaryDatabase = require('./get-temporary-database');
const IMAPError = require('./imap-error');
const isErrorConstructorName = require('./is-error-constructor-name');
const isLockingError = require('./is-locking-error');
const isMongoError = require('./is-mongo-error');
const isRedisError = require('./is-redis-error');
const isSocketError = require('./is-socket-error');
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
        // (not for a folder the script named that could not be made, which
        //  is the script, not us, see `onAppend`)
        ignore_hook: err?.imapResponse === 'TRYCREATE',
        err,
        folder: copy.folder
      });
    }
  }
}

//
// One sync per alias at a time, across processes: two at once read the same
// rows and could both append a message before either deletes it from the
// temporary mailbox.  A sync is asked for on each delivery by every IMAP
// process with a session for the alias (see `sqlite_sync_request` in
// imap-server.js), and on sign-ins.  One asked for while another runs does
// not wait for it (each used to poll the lock for up to 30 seconds, which on
// a busy mailbox kept many requests polling at once): it asks the one running
// to go round once more, which then syncs what arrived meanwhile, and
// returns.  The request is set before the lock is tried and checked after it
// is released, so one made at any moment is either seen by the sync running
// or finds the lock free.
//
async function syncTemporaryMailbox(session) {
  if (!this.client) return sync.call(this, session);

  const key = `sync_temporary_mailbox:${session.user.alias_id}`;
  const againKey = `${key}:again`;
  let deleted = 0;
  let error;

  await this.client.set(againKey, '1', 'PX', LOCK_TTL);
  while (await this.client.get(againKey)) {
    const owner = randomUUID();
    // (another sync runs and will go round again)
    if ((await this.client.set(key, owner, 'PX', LOCK_TTL, 'NX')) !== 'OK')
      break;

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
      await this.client.del(againKey);
      deleted += await sync.call(this, session, owner);
    } catch (err) {
      // (a sync asked for meanwhile found the lock taken and returned, so it
      //  is still run unless the mailbox or a service failed; the first error
      //  is thrown, and any later one logged)
      if (error) logger.error(err, { session });
      else error = err;
      if (isServiceError(err)) break;
    } finally {
      clearInterval(timer);
      await this.client
        .eval(RELEASE_LOCK_SCRIPT, 1, key, owner)
        .catch((err) => logger.fatal(err, { session }));
    }
  }

  if (error) throw error;

  return deleted;
}

//
// Whether an error is of the mailbox or of a service (busy, locked, out of
// space, unreadable, a closed connection, Redis or MongoDB) rather than of
// the message.  An IMAPError (e.g. over quota) or a document that does not
// validate is about the message whatever it says (the timeout helpers match
// words such as an alias or a folder named "timeout").  The rest is checked
// as it was thrown: refineAndLogError replaces the message (kept in
// `_message`) and sets a 421 code and an IMAP response on every SQLite,
// Redis and MongoDB error and every TypeError.  (A plain object, as some
// errors such as a DOMException cannot be the prototype of another.)
//
const REGEX_SQLITE_SERVICE_CODE =
  /^SQLITE_(BUSY|LOCKED|IOERR|PROTOCOL|FULL|CANTOPEN|READONLY|NOMEM|CORRUPT|NOTADB)/;

function isServiceError(err) {
  if (
    typeof err?.code === 'string' &&
    (REGEX_SQLITE_SERVICE_CODE.test(err.code) ||
      err.code === 'ENOSPC' ||
      err.code === 'ENOMEM')
  )
    return true;
  if (
    err instanceof IMAPError ||
    isErrorConstructorName(err, 'ValidationError') ||
    isErrorConstructorName(err, 'CastError')
  )
    return false;
  const thrown = {
    name: err?.name,
    constructor: err?.constructor,
    code: err?.code,
    message: err?._message || err?.message
  };
  return (
    isRedisError(thrown) ||
    isMongoError(thrown) ||
    isLockingError(thrown) ||
    isSocketError(thrown) ||
    // (the server shutting down, and a handle closed under getDatabase)
    isErrorConstructorName(err, 'ServerShutdownError') ||
    thrown.message === 'database connection is not open'
  );
}

//
// Messages are stored oldest first.  One that cannot be stored (e.g. it
// cannot be parsed, or does not fit in the quota) is kept in the temporary
// mailbox and passed over for the rest of the run, so the ones after it are
// stored, and it is not tried again for 10 minutes (each sync used to stop
// at it, so it kept the mail after it out and was parsed again on every
// delivery).  An error of the mailbox or a service stops the run without
// marking the message, as the next ones would fail too and it is not the
// message's fault.  Pages are read after the last message seen (by date and
// id), as a list of the ones passed over grew past the number of variables a
// query can have.
//
async function sync(session, owner) {
  const key = `sync_temporary_mailbox:${session.user.alias_id}`;
  let last;
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
        //
        // (the range on `date` lets its index serve the page, which an `$or`
        //  of the two cases alone did not: every page sorted all the rows
        //  left, so a sync of many messages took quadratic time)
        //
        condition: last
          ? {
              date: { $gte: last.date },
              $or: [{ date: { $gt: last.date } }, { _id: { $gt: last._id } }]
            }
          : {},
        sort: { date: 1, _id: 1 },
        limit: 25 // 250mb max (50mb per message)
      });

      const messages = tmpDb.prepare(sql.query).all(sql.values);

      if (messages.length === 0) break;

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
        const failedKey = `${key}:failed:${m._id}`;
        try {
          if (owner) {
            // (the lock can expire while the event loop is blocked, and another
            //  sync that took it would append the same messages)
            const [lock, failed] = await this.client.mget(key, failedKey);
            if (lock !== owner) {
              logger.warn('sync stopped as its lock was lost', { session });
              hasMore = false;
              break;
            }

            if (failed) continue;
          }

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
          const error = Array.isArray(_err) ? _err[0] : _err;
          if (err) logger.error(error, { session });
          else err = error;
          // (the messages already stored are still deleted below)
          if (isServiceError(error)) {
            hasMore = false;
            break;
          }

          if (this.client)
            await this.client
              .set(failedKey, '1', 'PX', ms('10m'))
              .catch((err) => logger.fatal(err, { session }));
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

      last = messages.at(-1);
    }
  }

  // update storage (only when messages were moved, as most syncs find none)
  if (deleted > 0) {
    try {
      await updateStorageUsed(session.user.alias_id, this.client);
    } catch (err) {
      logger.fatal(err, { session, resolver: this.resolver });
    }
  }

  // NOTE: tmpDb lifecycle is managed by temporaryDatabaseMap LRU cache.
  // Do not close it here — the LRU will evict and close idle connections
  // after the configured idleTTL (2 minutes).

  if (err) throw err;

  return deleted;
}

module.exports = syncTemporaryMailbox;
module.exports.storeSieveCopies = storeSieveCopies;
module.exports.isServiceError = isServiceError;
