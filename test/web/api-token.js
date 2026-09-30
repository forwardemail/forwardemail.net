/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The API token controls of the Security page, through the web server and
// the API: disabling the token keeps its value but refuses it at the API
// until it is reset, and a reset re-enables API access with a fresh token.
// The token itself is never in a page; Show and Copy fetch it from
// /my-account/security/api-token.
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

function fetchToken(t) {
  return t.context.web
    .get('/en/my-account/security/api-token')
    .set('Accept', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Sec-Fetch-Site', 'same-origin');
}

function account(t, token) {
  return t.context.api.get('/v1/account').auth(token);
}

test('disabling the API token refuses it at the API until it is reset', async (t) => {
  const { user, web } = t.context;
  const token = user[config.userFields.apiToken];

  // the page offers the masked token and to disable it, without the token
  let page = await securityPage(t);
  t.is(page.status, 200);
  t.false(page.text.includes(token));
  t.true(
    page.text.includes('data-api-token-url="/en/my-account/security/api-token"')
  );
  t.true(page.text.includes('Disable API Token'));

  // Show and Copy fetch it
  let tokenRes = await fetchToken(t);
  t.is(tokenRes.status, 200);
  t.deepEqual(tokenRes.body, { api_token: token });
  t.regex(tokenRes.headers['cache-control'], /no-store/);
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
  t.false(page.text.includes('data-api-token'));
  t.false(page.text.includes(token));

  // and the stored token cannot be fetched
  tokenRes = await fetchToken(t);
  t.is(tokenRes.status, 404);
  t.false(JSON.stringify(tokenRes.body).includes(token));

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
  t.false(page.text.includes(fresh));
  t.true(page.text.includes('Disable API Token'));
  tokenRes = await fetchToken(t);
  t.deepEqual(tokenRes.body, { api_token: fresh });
});

test("the token is only given to this site's own script", async (t) => {
  const { user, web } = t.context;
  const token = user[config.userFields.apiToken];

  for (const headers of [
    // a link or redirect from another site, opened in the user's tab
    {
      Accept: 'text/html',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document'
    },
    // the address typed in or bookmarked
    { Accept: 'text/html', 'Sec-Fetch-Site': 'none' },
    // a script without the header
    { Accept: 'application/json', 'Sec-Fetch-Site': 'same-origin' },
    // another site's script (its preflight would fail; checked anyway)
    {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Sec-Fetch-Site': 'cross-site'
    }
  ]) {
    const label = JSON.stringify(headers);
    const res = await web.get('/en/my-account/security/api-token').set(headers);
    t.is(res.status, 403, `${label}`);
    t.false((res.text || '').includes(token), `${label}`);
  }

  const res = await fetchToken(t);
  t.is(res.status, 200);
  t.deepEqual(res.body, { api_token: token });
});

test('the Email API page never includes the token and hides the control when it is disabled', async (t) => {
  const { user, web } = t.context;
  const token = user[config.userFields.apiToken];

  let page = await web.get('/en/email-api');
  t.is(page.status, 200);
  t.false(page.text.includes(token));
  t.false(page.text.includes('API_TOKEN'));
  t.true(
    page.text.includes('data-api-token-url="/en/my-account/security/api-token"')
  );

  await web
    .delete('/en/my-account/security/api-token')
    .set('Accept', 'application/json');

  page = await web.get('/en/email-api');
  t.is(page.status, 200);
  t.false(page.text.includes(token));
  t.false(page.text.includes('data-api-token'));
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

  // nor can the token be fetched
  const res = await anonymous
    .get('/en/my-account/security/api-token')
    .set('Accept', 'application/json');
  t.false(JSON.stringify(res.body).includes(token));
  t.false((res.text || '').includes(token));

  const same = await Users.findById(user._id).lean().exec();
  t.false(same[config.userFields.apiTokenDisabled]);
  t.is(same[config.userFields.apiToken], token);
});
