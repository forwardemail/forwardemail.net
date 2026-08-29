const test = require('ava');

const getAllowedSort = require('#helpers/get-allowed-sort');

const ALLOWED_FIELDS = new Set(['created_at', 'name', 'meta.level']);

test('getAllowedSort accepts allowlisted single-field directions', (t) => {
  t.is(getAllowedSort('name', ALLOWED_FIELDS, '-created_at'), 'name');
  t.is(
    getAllowedSort('-meta.level', ALLOWED_FIELDS, '-created_at'),
    '-meta.level'
  );
});

test('getAllowedSort falls back for unknown, operator, and compound sorts', (t) => {
  const fallback = '-created_at';

  t.is(getAllowedSort('$natural', ALLOWED_FIELDS, fallback), fallback);
  t.is(getAllowedSort('$where', ALLOWED_FIELDS, fallback), fallback);
  t.is(
    getAllowedSort('created_at; db.dropDatabase()', ALLOWED_FIELDS, fallback),
    fallback
  );
  t.is(getAllowedSort('created_at -name', ALLOWED_FIELDS, fallback), fallback);
  t.is(getAllowedSort('', ALLOWED_FIELDS, fallback), fallback);
});
