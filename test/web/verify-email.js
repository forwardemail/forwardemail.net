/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An account is only verified without the emailed code when the code could
// not be sent at all (e.g. our mail server is down), never when the address
// was refused, and sign up takes the addresses our mail servers accept, so
// an address that cannot receive mail (e.g. with an invisible character
// such as "support\u200B@forwardemail.net") cannot become a verified account.
//

// Replace the email helper BEFORE anything loads it (it is captured by
// reference), so a test can choose how sending the code fails.
const emailPath = require.resolve('#helpers/email');
let sendError = null;
require(emailPath);
require.cache[emailPath].exports = async () => {
  if (sendError) throw sendError;
  return {};
};

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.after.always(() => {
  delete require.cache[emailPath];
});
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownWebServer);

test.serial(
  'sign up refuses addresses our mail servers do not accept',
  async (t) => {
    for (const email of [
      `support\u200B@example.com`,
      `"<a href=https://evil.example>x</a>"@example.com`
    ]) {
      const res = await t.context.web
        .post('/en/register')
        .set('Accept', 'application/json')
        .send({ email, password: falso.randPassword() });
      t.is(res.status, 400);
      t.is(res.body.message, phrases.INVALID_EMAIL);

      t.falsy(await Users.exists({ email }));
    }
  }
);

async function signUp(t) {
  const email = falso.randEmail({ provider: 'example', suffix: 'com' });
  const res = await t.context.web
    .post('/en/register')
    .send({ email, password: falso.randPassword() });
  t.is(res.status, 302);
  return email;
}

test.serial('an address that refuses the code is not verified', async (t) => {
  const email = await signUp(t);
  sendError = Object.assign(new Error('Recipient address rejected'), {
    code: 'EENVELOPE',
    responseCode: 553
  });
  try {
    const res = await t.context.web
      .get('/en/verify')
      .set('Accept', 'text/html');
    t.is(res.status, 400);
  } finally {
    sendError = null;
  }

  const user = await Users.findOne({ email }).lean().exec();
  t.false(user[config.userFields.hasVerifiedEmail]);
});

test.serial(
  'an account is verified when the code cannot be sent at all',
  async (t) => {
    const email = await signUp(t);
    sendError = Object.assign(new Error('connect ECONNREFUSED'), {
      code: 'ECONNECTION'
    });
    try {
      await t.context.web.get('/en/verify').set('Accept', 'text/html');
    } finally {
      sendError = null;
    }

    const user = await Users.findOne({ email }).lean().exec();
    t.true(user[config.userFields.hasVerifiedEmail]);
  }
);
