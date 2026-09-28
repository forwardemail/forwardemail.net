/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const { Builder } = require('#helpers/json-sql');

function setup() {
  const db = new Database(':memory:');
  db.exec(
    'CREATE TABLE "Messages" ("_id" TEXT PRIMARY KEY, "uid" INTEGER, "secret" TEXT)'
  );
  const insert = db.prepare(
    'INSERT INTO "Messages" ("_id", "uid", "secret") VALUES (?, ?, ?)'
  );
  insert.run('a', 1, 'one');
  insert.run('b', 2, 'two');
  return { db, builder: new Builder() };
}

function run(db, sql) {
  return db.prepare(sql.query).all(sql.values);
}

test('ordinary queries are built as before', (t) => {
  const { db, builder } = setup();
  const rows = run(
    db,
    builder.build({
      type: 'select',
      table: 'Messages',
      fields: ['_id', 'uid'],
      condition: { uid: { $gte: 1 } },
      sort: { uid: -1 },
      limit: 1,
      offset: 0
    })
  );
  t.deepEqual(rows, [{ _id: 'b', uid: 2 }]);

  const count = run(
    db,
    builder.build({
      type: 'select',
      table: 'Messages',
      fields: [{ expression: 'COUNT(*)' }]
    })
  );
  t.deepEqual(count, [{ 'COUNT(*)': 2 }]);

  // values are bound, whatever they contain
  const none = run(
    db,
    builder.build({
      type: 'select',
      table: 'Messages',
      fields: ['*'],
      condition: { _id: `a" OR 1=1 --` }
    })
  );
  t.deepEqual(none, []);
});

test('identifiers that are not plain names are refused', (t) => {
  const { builder } = setup();
  for (const key of [
    'uid" = 1 OR 1=1 --',
    'CASE WHEN 1 THEN 1 END',
    "load_extension('x')",
    '(SELECT secret FROM Messages)',
    'uid; DROP TABLE Messages'
  ]) {
    t.throws(
      () =>
        builder.build({
          type: 'select',
          table: 'Messages',
          condition: { [key]: 1 }
        }),
      { message: 'Invalid SQL identifier' },
      `${key}`
    );
    t.throws(
      () =>
        builder.build({
          type: 'select',
          table: 'Messages',
          fields: [key]
        }),
      { message: 'Invalid SQL identifier' },
      `${key}`
    );
    t.throws(
      () =>
        builder.build({
          type: 'select',
          table: 'Messages',
          sort: { [key]: 1 }
        }),
      { message: 'Invalid SQL identifier' },
      `${key}`
    );
  }
});

test('limit, offset and sort directions must be what they say', (t) => {
  const { builder } = setup();
  for (const query of [
    { limit: '1; DROP TABLE Messages' },
    { limit: -1 },
    { limit: 1.5 },
    { offset: '0 UNION SELECT secret FROM Messages' },
    { sort: { uid: 'desc, (SELECT secret FROM Messages)' } }
  ]) {
    t.throws(() =>
      builder.build({ type: 'select', table: 'Messages', ...query })
    );
  }

  t.notThrows(() =>
    builder.build({
      type: 'select',
      table: 'Messages',
      sort: [{ uid: 'DESC' }, { _id: 'asc' }, 'uid']
    })
  );
});
