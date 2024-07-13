/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const Database = require('better-sqlite3-multiple-ciphers');
const Lock = require('ioredfour');
const mongoose = require('mongoose');
const ms = require('ms');

const logger = require('#helpers/logger');
const IMAPError = require('#helpers/imap-error');
const i18n = require('#helpers/i18n');

async function acquireLock(instance, db) {
  logger.debug('acquiring lock', new Error('stack').stack);

  if (!(instance?.lock instanceof Lock))
    throw new TypeError('Lock not instance');
  if (db && !(db instanceof Database) && !db.wsp)
    throw new TypeError('Database not instance');

  // existing in-memory lock used for SQLite server
  if (db?.lock) {
    // safeguard
    if (!db.lock?.success)
      throw new IMAPError(i18n.translate('IMAP_WRITE_LOCK_FAILED'), {
        imapResponse: 'INUSE'
      });
    return db.lock;
  }

  let id;
  if (
    db.wsp === true &&
    typeof db.id === 'string' &&
    mongoose.isObjectIdOrHexString(db.id)
  ) {
    id = db.id;
  } else if (
    typeof db.name === 'string' &&
    path.extname(db.name) === '.sqlite'
  ) {
    id = path.basename(db.name, path.extname(db.name));
  }

  if (!id) throw new TypeError('No alias ID or DB name found');

  const lock = await instance.lock.waitAcquireLock(id, ms('30s'), ms('60s'));

  if (!lock.success) {
    const err = new IMAPError(i18n.translate('IMAP_WRITE_LOCK_FAILED'), {
      imapResponse: 'INUSE'
    });
    err.lock = lock;
    err.db = db;
    err.instance = instance;
    throw err;
  }

  // update existing in-memory lock used for SQLite server
  db.lock = lock;
  return lock;
}

async function releaseLock(instance, db, lock) {
  logger.debug('releasing lock', lock?.id);
  if (!(instance?.lock instanceof Lock))
    throw new TypeError('Lock not instance');
  if (db && !(db instanceof Database) && !db.wsp)
    throw new TypeError('Database not instance');

  if (!lock?.success)
    throw new TypeError(
      'releaseLock not wrapped in try/catch and was not successful'
    );

  const result = await instance.lock.releaseLock(lock);
  if (!result.success) {
    // update existing in-memory lock used for SQLite server
    if (db && db.lock && db.lock.id === result.id) db.lock = result;
    const err = new IMAPError(i18n.translate('IMAP_RELEASE_LOCK_FAILED'));
    err.result = result;
    err.lock = lock;
    err.db = db;
    err.instance = instance;
    throw err;
  }

  // update existing in-memory lock used for SQLite server
  if (db && db.lock && db.lock.id === lock.id) delete db.lock;
  return result;
}

module.exports = { acquireLock, releaseLock };
