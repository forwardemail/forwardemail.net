/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Database = require('better-sqlite3-multiple-ciphers');
const test = require('ava');

const escapeSqliteLike = require('#helpers/escape-sqlite-like');

test('escapes the LIKE wildcards and the escape character', (t) => {
  t.is(escapeSqliteLike('plain'), 'plain');
  t.is(escapeSqliteLike('100%'), '100\\%');
  t.is(escapeSqliteLike('team_lead'), 'team\\_lead');
  t.is(escapeSqliteLike('a\\b'), 'a\\\\b');
  t.is(escapeSqliteLike('%_\\'), '\\%\\_\\\\');
  t.is(escapeSqliteLike(''), '');
  t.throws(() => escapeSqliteLike(), { instanceOf: TypeError });
  t.throws(() => escapeSqliteLike(null), { instanceOf: TypeError });
});

test('escaped patterns match literally in SQLite', (t) => {
  const db = new Database(':memory:');
  t.teardown(() => db.close());
  db.exec('create table t (v text)');
  const insert = db.prepare('insert into t values (?)');
  for (const value of [
    '100% sure',
    '100 sure',
    'team_lead',
    'teamxlead',
    'back\\slash',
    'backslash'
  ])
    insert.run(value);

  const like = (term) =>
    db
      .prepare(`select v from t where v LIKE ? ESCAPE '\\' order by v`)
      .pluck()
      .all(`%${escapeSqliteLike(term)}%`);

  t.deepEqual(like('100%'), ['100% sure']);
  t.deepEqual(like('team_lead'), ['team_lead']);
  t.deepEqual(like('back\\slash'), ['back\\slash']);
  t.deepEqual(like('%'), ['100% sure']);
  t.deepEqual(like('_'), ['team_lead']);
  t.deepEqual(like('\\'), ['back\\slash']);

  //
  // A value that is not valid UTF-8 once extracted from JSON (a lone
  // surrogate, stored as a JSON escape the way message headers are) is
  // scanned like any other value: it matches literally and never fails
  // the whole query, unlike REGEXP.
  //
  db.exec('create table h (v text)');
  db.prepare('insert into h values (?)').run(
    JSON.stringify([{ key: 'subject', value: 'lone \uD83D surrogate' }])
  );
  const likeHeader = (term) =>
    db
      .prepare(
        `select count(*) from h, json_each(h.v) where json_extract(value, '$.value') LIKE ? ESCAPE '\\'`
      )
      .pluck()
      .get(`%${escapeSqliteLike(term)}%`);
  t.is(likeHeader('lone'), 1);
  t.is(likeHeader('surrogate'), 1);
  t.is(likeHeader('nothing'), 0);
});
