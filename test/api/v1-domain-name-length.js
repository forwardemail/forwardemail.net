/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const phrases = require('#config/phrases');
const { Domains } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  t.context.user = await user.save();
});
test.afterEach.always(utils.teardownApiServer);

async function createDomain(t, domain) {
  return t.context.api
    .post('/v1/domains')
    .auth(t.context.user[config.userFields.apiToken])
    .send({ domain });
}

test('rejects a domain name longer than 253 characters', async (t) => {
  // valid labels, 4 x 63 + ".com" = 259 characters
  const name = `${Array.from({ length: 4 }, () => 'a'.repeat(63)).join(
    '.'
  )}.com`;
  const res = await createDomain(t, name);
  t.is(res.status, 400);
  t.is(res.body.message, phrases.INVALID_DOMAIN);
  t.is(await Domains.countDocuments({ name }), 0);
});

test('rejects a domain with a label longer than 63 characters', async (t) => {
  const name = `${'a'.repeat(100_000)}.com`;
  const res = await createDomain(t, name);
  t.is(res.status, 400);
  t.is(res.body.message, phrases.INVALID_DOMAIN);
  t.is(await Domains.countDocuments({ name }), 0);
});

test('accepts a domain at the length limits', async (t) => {
  // 3 x 63 + 1 + 57 + ".com" = 253 characters, every label <= 63
  const name = `${Array.from({ length: 3 }, () => 'b'.repeat(63)).join(
    '.'
  )}.${'c'.repeat(57)}.com`;
  t.is(name.length, 253);
  const res = await createDomain(t, name);
  t.is(res.status, 200);
  t.is(res.body.name, name);
});
