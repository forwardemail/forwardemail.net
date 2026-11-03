/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The staff alert for a denylist removal request shows the account address,
// which may hold markup (an address with a quoted local part, e.g.
// `"<a href=...>Process Removal</a>"@example.com`, from before sign up took
// the addresses our mail servers accept), so it is escaped.
//

// Replace the email helper BEFORE anything loads it (it is captured by
// reference), to see the alert that is sent.
const emailPath = require.resolve('#helpers/email');
const sent = [];
require(emailPath);
require.cache[emailPath].exports = async (data) => {
  sent.push(data);
  return {};
};

const falso = require('@ngneat/falso');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.after.always(() => {
  delete require.cache[emailPath];
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  // (an address of its own for each test)
  user.email = `"<a href=https://evil.example/>Removal ${Math.random()
    .toString(36)
    .slice(2, 6)}</a>"@example.com`;
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test('the denylist removal alert escapes the account address', async (t) => {
  const { web } = t.context;
  const q = 'denylisted.example.com';
  await t.context._web.app.context.client.set(`denylist:${q}`, true);

  const res = await web
    .post('/en/denylist')
    .set('Accept', 'application/json')
    .send({ q });
  t.is(res.status, 200);

  await pWaitFor(() => sent.some((data) => data.template === 'alert'), {
    timeout: 5000
  });
  const { message } = sent.find((data) => data.template === 'alert').locals;
  t.false(message.includes('<a href=https://evil.example/>'));
  t.true(message.includes('&lt;a href=https://evil.example/&gt;'));
  t.true(
    message.includes(`email=${encodeURIComponent(t.context.user.email)}"`)
  );
});

//
// A rejection by our mail servers links to the removal form with the listed
// value encrypted (helpers/get-recipients.js, helpers/on-data-mx.js); every
// such link was refused (the decrypt function was not the one exported, and
// the case-sensitive value was lowercased before decrypting).
//
test('the encrypted value of a rejection link is accepted', async (t) => {
  const { web } = t.context;
  const { encrypt } = require('#helpers/encrypt-decrypt');
  const listed = 'listed-by-link.example.com';
  await t.context._web.app.context.client.set(`denylist:${listed}`, true);

  const res = await web
    .post('/en/denylist')
    .set('Accept', 'application/json')
    .send({ q: encrypt(listed) });
  t.is(res.status, 200);
  // (a free account's request goes to staff, naming the value decrypted)
  await pWaitFor(
    () =>
      sent.some((data) => JSON.stringify(data.locals || {}).includes(listed)),
    { timeout: 5000 }
  );
  t.pass();
});
