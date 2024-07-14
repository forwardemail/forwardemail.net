/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const Database = require('better-sqlite3-multiple-ciphers');

const getPathToDatabase = require('./get-path-to-database');
const logger = require('./logger');
const migrateSchema = require('./migrate-schema');
const setupPragma = require('./setup-pragma');
const { acquireLock, releaseLock } = require('./lock');
const { encrypt } = require('./encrypt-decrypt');
const config = require('#config');
const env = require('#config/env');

const ServerShutdownError = require('#helpers/server-shutdown-error');
const TemporaryMessages = require('#models/temporary-messages');

async function getTemporaryDatabase(session) {
  // if server is shutting down then don't bother getting database
  if (!this?.server?._handle || this?.server?._closeTimeout)
    throw new ServerShutdownError();

  // `this` is the instance of SQLite
  // check if we have in-memory existing opened database
  if (
    this.temporaryDatabaseMap.has(session.user.alias_id) &&
    this.temporaryDatabaseMap.get(session.user.alias_id).open === true &&
    this.temporaryDatabaseMap.get(session.user.alias_id).readonly === false
  ) {
    return this.temporaryDatabaseMap.get(session.user.alias_id);
  }

  const storagePath = getPathToDatabase({
    id: session.user.alias_id,
    storage_location: session.user.storage_location
  });
  const filePath = path.join(
    path.dirname(storagePath),
    `${session.user.alias_id}-tmp.sqlite`
  );

  const tmpDb = new Database(filePath, {
    // if the db wasn't found it means there wasn't any mail
    // fileMustExist: true,
    timeout: config.busyTimeout,
    // <https://github.com/WiseLibs/better-sqlite3/issues/217#issuecomment-456535384>
    verbose: config.env === 'development' ? console.log : null
  });

  // store in-memory open connection
  this.temporaryDatabaseMap.set(session.user.alias_id, tmpDb);

  const tmpSession = {
    ...session,
    user: {
      ...session.user,
      password: encrypt(env.API_SECRETS[0])
    }
  };

  await setupPragma(tmpDb, tmpSession);

  // migrate schema
  const commands = await migrateSchema(tmpDb, tmpSession, {
    TemporaryMessages
  });

  const lock = await acquireLock(this, tmpDb);

  if (commands.length > 0) {
    for (const command of commands) {
      try {
        // TODO: wsp here (?)
        tmpDb.prepare(command).run();
        // await knexDatabase.raw(command);
      } catch (err) {
        err.isCodeBug = true;
        logger.fatal(err, { command });
        // migration support in case existing rows
        if (
          err.message.includes(
            'Cannot add a NOT NULL column with default value NULL'
          ) &&
          command.endsWith(' NOT NULL')
        ) {
          try {
            tmpDb.prepare(command.replace(' NOT NULL', '')).run();
          } catch (err) {
            err.isCodeBug = true;
            logger.fatal(err, { command });
          }
        }
      }
    }
  }

  // release lock
  if (lock) {
    try {
      await releaseLock(this, tmpDb, lock);
    } catch (err) {
      logger.fatal(err, { session });
    }
  }

  return tmpDb;
}

module.exports = getTemporaryDatabase;
