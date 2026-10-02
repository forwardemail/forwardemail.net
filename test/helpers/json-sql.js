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

test('condition values must be bound, never built into the query', (t) => {
  const { db, builder } = setup();

  // a plain object as a value (what a JSON body gives a controller that
  // does not check the type) is refused before any SQL is built
  for (const value of [
    { expression: 'uid = 1' },
    { pattern: '{x}', values: { x: 1 } },
    { nested: { expression: 'uid = 1' } }
  ]) {
    t.throws(
      () =>
        builder.build({
          type: 'select',
          table: 'Messages',
          condition: { _id: { $eq: value } }
        }),
      { message: 'Invalid SQL value' }
    );
    t.throws(
      () =>
        builder.build({
          type: 'select',
          table: 'Messages',
          condition: { _id: { $in: ['a', value] } }
        }),
      { message: 'Invalid SQL value' }
    );
    t.throws(
      () =>
        builder.build({
          type: 'update',
          table: 'Messages',
          modifier: { secret: value },
          condition: { _id: 'a' }
        }),
      { message: 'Invalid SQL value' }
    );
  }

  // every value type our models bind still works
  const rows = run(
    db,
    builder.build({
      type: 'select',
      table: 'Messages',
      fields: ['_id'],
      condition: {
        _id: { $in: ['a', 'b'] },
        uid: { $gte: 1, $lt: 3 },
        secret: { $ne: 'three' }
      },
      sort: { uid: 1 }
    })
  );
  t.deepEqual(rows, [{ _id: 'a' }, { _id: 'b' }]);

  // `{}` keeps its meaning of null
  t.deepEqual(
    run(
      db,
      builder.build({
        type: 'select',
        table: 'Messages',
        fields: ['_id'],
        condition: { secret: {} }
      })
    ),
    []
  );

  // the same for the values of an insert
  t.throws(
    () =>
      builder.build({
        type: 'insert',
        table: 'Messages',
        values: { _id: 'c', uid: 3, secret: { expression: 'uid' } }
      }),
    { message: 'Invalid SQL value' }
  );

  // raw SQL stays available where our code uses it: fields
  t.deepEqual(
    run(
      db,
      builder.build({
        type: 'select',
        table: 'Messages',
        fields: [{ expression: 'COUNT(*)' }],
        condition: { uid: { $gte: 1 } }
      })
    ),
    [{ 'COUNT(*)': 2 }]
  );
});

test('operators that write into the query only take safe values', (t) => {
  const { db, builder } = setup();
  const select = (condition) =>
    builder.build({ type: 'select', table: 'Messages', condition });

  // `$is` writes its value into the query text
  t.throws(() => select({ uid: { $is: '1 OR 1=1' } }), {
    message: 'Invalid $is value'
  });
  t.throws(() => select({ uid: { $isnot: '1 OR 1=1' } }), {
    message: 'Invalid $isnot value'
  });
  t.notThrows(() => run(db, select({ uid: { $is: true } })));

  // `$elemMatch` writes each key into a JSON path
  t.throws(() => select({ uid: { $elemMatch: { "x') OR 1=1 --": 1 } } }), {
    message: 'Invalid SQL identifier'
  });
  t.notThrows(() => select({ uid: { $elemMatch: { value: 'a' } } }));
  t.throws(() => select({ uid: { $elemMatch: { "x-a'": 1 } } }), {
    message: 'Invalid SQL identifier'
  });
  t.throws(() => select({ uid: { $elemMatch: { 'a.b': 1 } } }), {
    message: 'Invalid SQL identifier'
  });

  // (e.g. a vCard parameter name in a CardDAV param-filter)
  const contacts = new Database(':memory:');
  contacts.exec('CREATE TABLE "Contacts" ("_id" TEXT, "impp" TEXT)');
  const insert = contacts.prepare(
    'INSERT INTO "Contacts" ("_id", "impp") VALUES (?, ?)'
  );
  insert.run('a', JSON.stringify([{ 'x-service-type': 'jabber' }]));
  insert.run('b', JSON.stringify([{ 'x-service-type': 'skype' }]));
  t.deepEqual(
    run(
      contacts,
      builder.build({
        type: 'select',
        table: 'Contacts',
        fields: ['_id'],
        condition: { impp: { $elemMatch: { 'x-service-type': 'jabber' } } }
      })
    ),
    [{ _id: 'a' }]
  );
});
