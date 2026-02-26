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
const { encrypt } = require('./encrypt-decrypt');
const config = require('#config');
const env = require('#config/env');

const ServerShutdownError = require('#helpers/server-shutdown-error');
const TemporaryMessages = require('#models/temporary-messages');

async function getTemporaryDatabase(session) {
  // if server is shutting down then don't bother getting database
  if (this.isClosing) throw new ServerShutdownError();

  // `this` is the instance of SQLite
  // check if we have in-memory existing opened database
  if (
    this.temporaryDatabaseMap &&
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
    verbose: env.AXE_SILENT ? null : console.log
  });

  // store in-memory open connection
  if (this.temporaryDatabaseMap)
    this.temporaryDatabaseMap.set(session.user.alias_id, tmpDb);

  const tmpSession = {
    ...session,
    user: {
      ...session.user,
      password: encrypt(
        Array.isArray(env.API_SECRETS) ? env.API_SECRETS[0] : env.API_SECRETS
      )
    }
  };

  await setupPragma(tmpDb, tmpSession);

  // migrate schema
  const commands = await migrateSchema(this, tmpDb, tmpSession, {
    TemporaryMessages
  });

  if (commands.length > 0) {
    for (const command of commands) {
      try {
        // TODO: wsp here (?)
        tmpDb.prepare(command).run();
        // await knexDatabase.raw(command);
      } catch (err) {
        // duplicate column errors are expected when migration was already applied
        if (err.message.startsWith('duplicate column name:')) {
          logger.debug(err, { command });
        } else {
          err.isCodeBug = true;
          logger.fatal(err, { command });
        }

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

  return tmpDb;
}

module.exports = getTemporaryDatabase;
