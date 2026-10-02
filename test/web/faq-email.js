/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The FAQ shows a visitor's address in place of the example address. An
// address may contain "$`" (the text before a match in a replacement string),
// which must be inserted as is, not expanded into a copy of the page.
//

const test = require('ava');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

test('the FAQ inserts an address with "$`" literally', async (t) => {
  const plain = await t.context.web
    .get('/en/faq')
    .query({ email: 'jane@example.org' });
  t.is(plain.status, 200);

  const local = '$`'.repeat(30);
  const res = await t.context.web
    .get('/en/faq')
    .query({ email: `${local}@example.org` });
  t.is(res.status, 200);
  t.true(res.text.includes(local));
  // (the page is about the same size as with an ordinary address)
  t.true(res.text.length < plain.text.length * 2);
});
