const crypto = require('crypto');

const test = require('ava');
const { authenticator } = require('otplib');
const { factory } = require('factory-girl');

const utils = require('../utils');
const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

// if default authenticator options in #ladjs/passport or
// config sets authenticator options for otp
// these settings will need to be changed

authenticator.options = {
  crypto,
  step: 30
};

test.before(utils.setupMongoose);
test.before(utils.defineUserFactory);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  // set password
  t.context.password = '!@K#NLK!#N';
  // create user
  let user = await factory.build('user');
  // must register in order for authentication to work
  user = await Users.register(user, t.context.password);
  // setup user for otp
  user[config.userFields.hasSetPassword] = true;
  user[config.passport.fields.otpEnabled] = true;
  t.context.user = await user.save();
  t.context.webConfig = {
    passport: {
      providers: {
        otp: true
      }
    }
  };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});

test('GET otp/login > successful', async (t) => {
  // get test server
  const { web } = t.context;

  // GET login page
  const res = await web.get(`/en${config.loginOtpRoute}`);

  console.log('res.status', res.status);
  console.log('res.text', res.text);
  t.is(res.status, 200);
  t.snapshot(res.text.replace(/<head>[\S\s]*<\/head>/, ''));
});

test('POST otp/login > successful', async (t) => {
  // get test server
  const { web, user } = t.context;
  const passcode = authenticator.generate(
    user[config.passport.fields.otpToken]
  );

  // POST login page
  const res = await web.post(`/en${config.loginOtpRoute}`).send({
    passcode,
    otp_remember_me: 'true'
  });

  t.is(res.status, 200);
  t.is(res.body.redirectTo, '/en/my-account/domains');
});

test('POST otp/login > invalid OTP passcode', async (t) => {
  // get test server
  const { web } = t.context;

  // POST login page
  const res = await web.post(`/en${config.loginOtpRoute}`).send({
    passcode: '1234 124',
    otp_remember_me: 'true'
  });

  t.is(res.status, 401);
  t.is(JSON.parse(res.text).message, phrases.INVALID_OTP_PASSCODE);
});

test('GET otp/setup > successful', async (t) => {
  // get test server
  const { web } = t.context;

  // GET setup page
  const res = await web.get(`/en${config.otpRoutePrefix}/setup`);

  t.is(res.status, 200);
  t.true(res.text.includes('id="otp-recovery-keys"'));
});

test('POST otp/setup > successful', async (t) => {
  // get test server
  const { web, user, password } = t.context;

  user[config.passport.fields.otpEnabled] = false;
  await user.save();

  // POST setup page
  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token: null,
    password
  });

  t.is(res.status, 200);
  t.true(res.text.includes('Scan this QR code'));
});

test('POST otp/setup > successful with token', async (t) => {
  // get test server
  const { web, user, password } = t.context;
  const token = authenticator.generate(user[config.passport.fields.otpToken]);

  user[config.passport.fields.otpEnabled] = false;
  await user.save();

  // POST setup page
  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token,
    password
  });

  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account/security');

  const query = await Users.findOne({ email: user.email });
  t.is(query[config.passport.fields.otpEnabled], true);
});

test('POST otp/setup > invalid token', async (t) => {
  // get test server
  const { web, password } = t.context;

  // POST setup page
  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token: '1',
    password
  });

  t.is(res.status, 200);
  t.true(res.text.includes('Scan this QR code'));
});

test('POST otp/setup > invalid blank password', async (t) => {
  // get test server
  const { web } = t.context;

  // POST setup page
  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token: null,
    password: null
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);
});

test('POST otp/setup > incorrect password', async (t) => {
  // get test server
  const { web } = t.context;

  // POST setup page
  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token: null,
    password: 'test'
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);
});

test('POST otp/disable > successful', async (t) => {
  // get test server
  const { web, user, password } = t.context;

  // POST disable page
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password
  });

  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account/security');

  const query = await Users.findOne({ email: user.email });
  t.is(query[config.passport.fields.otpEnabled], false);
});

test('POST otp/disable > invalid blank password', async (t) => {
  // get test server
  const { web } = t.context;

  // POST disable page
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password: null
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);
});

test('POST otp/disable > incorrect password', async (t) => {
  // get test server
  const { web } = t.context;

  // POST disable page
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password: 'test'
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);
});

test('POST otp/recovery > successful', async (t) => {
  // get test server
  const { web } = t.context;

  // POST disable page
  const res = await web.post(`/en${config.otpRoutePrefix}/recovery`);

  t.is(res.status, 302);
  t.is(res.header.location, `/en${config.verifyRoute}`);
});

test('GET otp/keys > successful', async (t) => {
  // get test server
  const { web } = t.context;

  // GET key page
  const res = await web.get(`/en${config.otpRoutePrefix}/keys`);

  t.is(res.status, 200);
  t.snapshot(res.text.replace(/<head>[\S\s]*<\/head>/, ''));
});

test('POST otp/keys > successful', async (t) => {
  // get test server
  const { web, user } = t.context;
  // setup stubs
  user[config.userFields.otpRecoveryKeys] = ['1', '2'];
  await user.save();

  // POST keys page
  const res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: '1' });

  t.is(res.status, 302);
  t.is(
    res.header.location,
    `/en${config.passportCallbackOptions.successReturnToOrRedirect}`
  );

  const query = await Users.findOne({ email: user.email });
  t.falsy(query[config.userFields.otpRecoveryKeys].includes('1'));
});

test('POST otp/keys > invalid recovery key', async (t) => {
  // get test server
  const { web } = t.context;

  // POST keys page
  const res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: '1' });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RECOVERY_KEY);
});

test('POST otp/keys > recovery keys reset', async (t) => {
  // get test server
  const { web, user } = t.context;
  // setup stubs
  user[config.userFields.otpRecoveryKeys] = ['1'];
  await user.save();

  // POST keys page
  const res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: '1' });

  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account/security');

  const query = await Users.findOne({ email: user.email });
  t.true(query[config.userFields.otpRecoveryKeys] !== null);
});
