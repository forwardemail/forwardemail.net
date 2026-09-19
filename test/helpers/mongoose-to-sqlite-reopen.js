/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const Database = require('better-sqlite3-multiple-ciphers');
const mongoose = require('mongoose');
const test = require('ava');

const getPathToDatabase = require('#helpers/get-path-to-database');
const { isLiveDatabaseSession } = require('#helpers/mongoose-to-sqlite');

//
// When a query fails because its handle was closed underneath it (a cache
// eviction before a file swap), the retry re-opens the mailbox -- but only
// the live mailbox: a query against the temporary mailbox or a copy being
// rekeyed must never be re-pointed at the live database.
//

test('only a session on the live mailbox is re-opened after an eviction', (t) => {
  const user = {
    alias_id: new mongoose.Types.ObjectId().toString(),
    storage_location: 'storage_do_1'
  };
  const livePath = getPathToDatabase({
    id: user.alias_id,
    storage_location: user.storage_location
  });

  // no handle yet, or the WebSocket stand-in used by IMAP/POP3: re-open
  t.true(isLiveDatabaseSession({ user }));
  t.true(isLiveDatabaseSession({ user, db: { wsp: true, open: true } }));

  // the live mailbox (open or already closed): re-open
  const live = new Database(livePath);
  t.true(isLiveDatabaseSession({ user, db: live }));
  live.close();
  t.true(isLiveDatabaseSession({ user, db: live }));
  fs.rmSync(livePath, { force: true });

  // any other file sharing the session's user: leave it alone
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reopen-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of [
    `${user.alias_id}-tmp.sqlite`,
    `${user.alias_id}-0c9b7f4a-2c9a-4a1e-9a0b-6d0b7f0e5b1c-backup.sqlite`
  ]) {
    const other = new Database(path.join(dir, name));
    t.false(isLiveDatabaseSession({ user, db: other }));
    other.close();
  }

  // a handle without a file name cannot be matched: leave it alone
  t.false(isLiveDatabaseSession({ user, db: {} }));
});
