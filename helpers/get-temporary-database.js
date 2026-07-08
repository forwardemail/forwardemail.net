/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const Database = require('better-sqlite3-multiple-ciphers');
const { boolean } = require('boolean');

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

  //
  // re-use a cached handle when available — opening an encrypted database
  // pays full PBKDF2 key derivation (~50ms CPU) plus schema migration
  // checks, which is far too expensive to do once per delivered message
  //
  const mapKey = `${session.user.alias_id}-tmp`;
  if (this.temporaryDatabaseMap && this.temporaryDatabaseMap.has(mapKey)) {
    const cached = this.temporaryDatabaseMap.get(mapKey);
    if (cached && cached.open) return cached;
    // stale entry (closed externally) — remove and re-open below
    this.temporaryDatabaseMap.delete(mapKey);
  }

  const startedAt = Date.now();

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

  if (this.temporaryDatabaseMap) this.temporaryDatabaseMap.set(mapKey, tmpDb);

  if (boolean(env.SQLITE_DEBUG_TIMERS))
    console.debug('getTemporaryDatabase cache miss', {
      alias_id: session.user.alias_id,
      duration_ms: Date.now() - startedAt
    });

  return tmpDb;
}

module.exports = getTemporaryDatabase;
