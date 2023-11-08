/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const pWaitFor = require('p-wait-for');

const config = require('#config');
const { decrypt } = require('#helpers/encrypt-decrypt');

// dynamically import file-type
let sqliteRegex;

import('sqlite-regex').then((obj) => {
  sqliteRegex = obj;
});

async function setupPragma(db, session) {
  // safeguards
  if (!db.open) throw new TypeError('Database is not open');
  if (db.memory) throw new TypeError('Memory database');
  // db.pragma(`cipher='aes256cbc'`);
  // NOTE: if you change anything in here change backup in sqlite-server
  db.pragma(`cipher='chacha20'`);
  if (typeof db.key === 'function')
    db.key(Buffer.from(decrypt(session.user.password)));
  else db.pragma(`key="${decrypt(session.user.password)}"`);
  db.pragma('journal_mode=WAL');
  // <https://litestream.io/tips/#busy-timeout>
  db.pragma(`busy_timeout=${config.busyTimeout}`);
  // <https://litestream.io/tips/#synchronous-pragma>
  db.pragma('synchronous=NORMAL');
  //
  // NOTE: only if we're using Litestream
  // <https://litestream.io/tips/#disable-autocheckpoints-for-high-write-load-servers>
  //
  // db.pragma('wal_autocheckpoint=0');

  // db.pragma(`user_version="1"`);

  // may want to set locking mode to exclusive down the road (more involved with locking though)
  // <https://www.sqlite.org/pragma.html#pragma_locking_mode>

  // <https://s3.amazonaws.com/bizzabo.file.upload/XTUmoCXSCfit8PqUs2AT_B%20Johnson%20-%20Building%20Production%20Applications%20Using%20Go%20%26%20SQLite.pdf>
  db.pragma('foreign_keys=ON');

  // <https://www.sqlite.org/pragma.html#pragma_case_sensitive_like>
  // db.pragma('case_sensitive_like=true');

  // <https://www.sqlite.org/pragma.html#pragma_encoding>
  db.pragma(`encoding='UTF-8'`);

  if (db.readonly) db.pragma('query_only=true');

  // load regex extension for REGEX support
  if (!sqliteRegex) await pWaitFor(() => Boolean(sqliteRegex));
  db.loadExtension(sqliteRegex.getLoadablePath());

  //
  // <https://utelle.github.io/SQLite3MultipleCiphers/>
  //
  // > Additionally, the SQL command ATTACH supports the KEY keyword to allow
  //   to attach an encrypted database file to the current database connection:
  //
  // `ATTACH [DATABASE] <db-file-expression> AS <schema-name> [KEY <passphrase>]`
  //

  // TODO: compression, e.g. https://github.com/phiresky/sqlite-zstd
  // <https://github.com/m4heshd/better-sqlite3-multiple-ciphers/blob/master/docs/api.md#loadextensionpath-entrypoint---this>
  // db.loadExtension(...);
}

module.exports = setupPragma;
