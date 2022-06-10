const { Buffer } = require('buffer');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const phrases = require('#config/phrases');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);

test('fails when no creds are presented', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/account');
  t.is(res.status, 401);
});

test("returns current user's account", async (t) => {
  const { api } = t.context;
  const body = {
    email: 'testglobal@api.example.com',
    password: 'FKOZa3kP0TxSCA'
  };

  let res = await api.post('/v1/account').send(body);
  t.is(res.status, 200);

  res = await api.get('/v1/account').set({
    Authorization: `Basic ${Buffer.from(
      `${res.body[config.userFields.apiToken]}:`
    ).toString('base64')}`
  });
  t.is(res.body.message, phrases.EMAIL_VERIFICATION_REQUIRED);
  t.is(res.status, 401);
});

test('rate limits account signups', async (t) => {
  const { api } = t.context;
  let res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 400);
  res = await api.post('/v1/account');
  t.is(res.status, 429);
});
