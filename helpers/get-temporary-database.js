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

const TemporaryMessages = require('#models/temporary-messages');

async function getTemporaryDatabase(session) {
  // TODO: check disk space here (2x existing tmp db size)
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
