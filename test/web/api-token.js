/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The API token controls of the Security page, through the web server and
// the API: disabling the token keeps its value but refuses it at the API
// until it is reset, and a reset re-enables API access with a fresh token.
//

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  // (a paid user: the account endpoint of the API is for those)
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
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
  await utils.setupWebServer(t);
  await utils.loginUser(t);
  await utils.setupApiServer(t);
});
test.afterEach.always(utils.teardownWebServer);
test.afterEach.always(utils.teardownApiServer);

function securityPage(t) {
  return t.context.web.get('/en/my-account/security');
}

function account(t, token) {
  return t.context.api.get('/v1/account').auth(token);
}

test('disabling the API token refuses it at the API until it is reset', async (t) => {
  const { user, web } = t.context;
  const token = user[config.userFields.apiToken];

  // the page shows the token and offers to disable it
  let page = await securityPage(t);
  t.is(page.status, 200);
  t.true(page.text.includes(token));
  t.true(page.text.includes('Disable API Token'));
  t.true(page.text.includes('action="/en/my-account/security/api-token"'));
  t.false(page.text.includes('Enable and Create New API Token'));

  // the token works
  let res = await account(t, token);
  t.is(res.status, 200);
  t.is(res.body.email, user.email);

  // disabled from the page: the stored token is kept, but refused
  res = await web
    .delete('/en/my-account/security/api-token')
    .set('Accept', 'application/json');
  t.is(res.status, 200);
  t.deepEqual(res.body, { [config.userFields.apiTokenDisabled]: true });

  const disabled = await Users.findById(user._id).lean().exec();
  t.true(disabled[config.userFields.apiTokenDisabled]);
  t.is(disabled[config.userFields.apiToken], token);

  res = await account(t, token);
  t.is(res.status, 401);
  t.is(res.body.message, phrases.API_TOKEN_DISABLED);

  // the page says so, and only offers to enable it again with a new token
  page = await securityPage(t);
  t.is(page.status, 200);
  t.true(page.text.includes('API token disabled'));
  t.true(page.text.includes('Enable and Create New API Token'));
  t.false(page.text.includes('Disable API Token'));
  t.false(page.text.includes(token));

  // reset: a fresh token that works, the old one is gone for good
  res = await web
    .delete('/en/my-account/security')
    .set('Accept', 'application/json');
  t.is(res.status, 200);
  t.deepEqual(res.body, { reloadPage: true });

  const reset = await Users.findById(user._id).lean().exec();
  t.false(reset[config.userFields.apiTokenDisabled]);
  const fresh = reset[config.userFields.apiToken];
  t.truthy(fresh);
  t.not(fresh, token);

  res = await account(t, fresh);
  t.is(res.status, 200);
  res = await account(t, token);
  t.is(res.status, 401);
  t.not(res.body.message, phrases.API_TOKEN_DISABLED);

  page = await securityPage(t);
  t.true(page.text.includes(fresh));
  t.true(page.text.includes('Disable API Token'));
});

test('resetting an enabled token replaces it without disabling anything', async (t) => {
  const { user, web } = t.context;
  const token = user[config.userFields.apiToken];

  const res = await web
    .delete('/en/my-account/security')
    .set('Accept', 'application/json');
  t.is(res.status, 200);

  const reset = await Users.findById(user._id).lean().exec();
  t.false(reset[config.userFields.apiTokenDisabled]);
  t.not(reset[config.userFields.apiToken], token);
  const fresh = await account(t, reset[config.userFields.apiToken]);
  t.is(fresh.status, 200);
  const stale = await account(t, token);
  t.is(stale.status, 401);
});

test('the controls are not reachable without a session', async (t) => {
  const { user } = t.context;
  const token = user[config.userFields.apiToken];

  // a fresh client without the session cookie is sent to the login page
  const anonymous = request(t.context._web.server);
  for (const path of [
    '/en/my-account/security/api-token',
    '/en/my-account/security'
  ]) {
    const res = await anonymous.delete(path).set('Accept', 'application/json');
    t.is(res.status, 200);
    t.regex(res.body.redirectTo, /^\/en\/login\?return_to=/);
  }

  const same = await Users.findById(user._id).lean().exec();
  t.false(same[config.userFields.apiTokenDisabled]);
  t.is(same[config.userFields.apiToken], token);
});
