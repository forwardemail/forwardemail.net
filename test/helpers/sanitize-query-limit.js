/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const sanitizeQueryLimit = require('#helpers/sanitize-query-limit');

function run(query) {
  let nexted = false;
  const ctx = { query };
  sanitizeQueryLimit(ctx, () => {
    nexted = true;
  });
  return { query: ctx.query, nexted };
}

test('drops limit=0 so the route default applies', (t) => {
  const { query, nexted } = run({ limit: '0' });
  t.false('limit' in query);
  t.true(nexted);
});

test('drops a negative limit', (t) => {
  t.false('limit' in run({ limit: '-5' }).query);
  t.false('limit' in run({ limit: -5 }).query);
});

test('drops a non-numeric limit', (t) => {
  t.false('limit' in run({ limit: 'all' }).query);
});

test('keeps a positive limit (as the paginate middleware then parses it)', (t) => {
  t.is(run({ limit: '25' }).query.limit, '25');
  t.is(run({ limit: 25 }).query.limit, 25);
});

test('leaves a request without a limit untouched', (t) => {
  const { query, nexted } = run({ page: '2' });
  t.deepEqual(query, { page: '2' });
  t.true(nexted);
});
