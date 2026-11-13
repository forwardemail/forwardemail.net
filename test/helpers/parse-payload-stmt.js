/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');

const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');

const parsePayload = require('#helpers/parse-payload');
const { encrypt } = require('#helpers/encrypt-decrypt');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupRedisClient);
test.beforeEach((t) => {
  t.context.sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
});

test.afterEach.always(async () => {
  // (the new mailbox's folders are set up after its first request, see
  //  `getDatabase`: before the database connection closes)
  await delay(1000);
});

function stmt(t, user, sql) {
  return parsePayload.call(t.context.sqlite, {
    id: randomUUID(),
    action: 'stmt',
    session: { user },
    stmt: [
      ['prepare', sql],
      ['get', []]
    ]
  });
}

test('a stmt request cannot reach other files: ATTACH, DETACH, VACUUM and PRAGMA are refused', async (t) => {
  const aliasId = new mongoose.Types.ObjectId().toString();
  const user = {
    id: aliasId,
    username: 'a@example.com',
    alias_id: aliasId,
    alias_name: 'a',
    domain_id: new mongoose.Types.ObjectId().toString(),
    domain_name: 'example.com',
    storage_location: 'stmt_test_storage',
    password: encrypt('password')
  };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stmt-'));
  const out = path.join(dir, 'attached.db');
  try {
    // (also after white space, comments and empty statements, which SQLite
    //  skips, and in any case)
    for (const sql of [
      `ATTACH DATABASE '${out}' AS a KEY ''`,
      ` /* x */ -- y\n ;attach '${out}' as a`,
      `VACUUM INTO '${out}'`,
      'detach a',
      // (where every mailbox of the process writes its temporary files)
      `PRAGMA temp_store_directory = '${dir}'`,
      'pragma rekey = "x"'
    ]) {
      const err = await t.throwsAsync(stmt(t, user, sql));
      t.is(err.message, 'Statement not allowed', `${sql}`);
    }

    t.false(fs.existsSync(out));
    // (statements on the mailbox itself still run)
    t.deepEqual(await stmt(t, user, 'select 1 as "x"'), { x: 1 });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
