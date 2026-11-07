/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const process = require('node:process');

const falso = require('@ngneat/falso');
const request = require('supertest');
const test = require('ava');
const { authenticator } = require('otplib');

const utils = require('../utils');
const config = require('#config');
const phrases = require('#config/phrases');
const { Domains, Users } = require('#models');

// if default authenticator options in #ladjs/passport or
// config sets authenticator options for otp
// these settings will need to be changed

authenticator.options = {
  crypto,
  step: 30
};

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  // set password
  t.context.password = falso.randPassword();
  // create user
  let user = await t.context.userFactory.make();
  // must register in order for authentication to work
  user = await Users.register(user, t.context.password);
  // setup user for otp
  user[config.userFields.hasSetPassword] = true;
  // (two-factor can only be set up with a verified email)
  user[config.userFields.hasVerifiedEmail] = true;
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

test.afterEach.always(utils.teardownWebServer);

test('GET otp/login > successful', async (t) => {
  // get test server
  const { web } = t.context;

  // GET login page
  const res = await web.get(`/en${config.loginOtpRoute}`);

  t.is(res.status, 200);
  t.snapshot(
    utils.normalizeBuildHashes(res.text.replace(/<head>[\S\s]*<\/head>/, ''))
  );
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
  t.is(res.body.redirectTo, '/en/my-account');
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
  const { web, user } = t.context;

  // setup is only for users that have not enabled OTP yet
  user[config.passport.fields.otpEnabled] = false;
  await user.save();

  // GET setup page
  const res = await web.get(`/en${config.otpRoutePrefix}/setup`);

  const csp = res.headers['content-security-policy'];
  const nonceMatch = csp.match(/script-src[^;]*'nonce-([a-f\d]+)'/);
  const scripts = [...res.text.matchAll(/<script\b[^>]*>/g)];

  t.is(res.status, 200);
  t.true(res.text.includes('id="otp-recovery-keys"'));
  t.truthy(nonceMatch, 'OTP setup must include a script-src nonce');
  t.true(scripts.length > 0, 'OTP setup must render scripts');
  for (const script of scripts)
    t.regex(
      script[0],
      new RegExp(`\\bnonce="${nonceMatch[1]}"`),
      `OTP setup script must carry the response CSP nonce: ${script[0].slice(
        0,
        120
      )}`
    );
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

test('POST otp/setup > the token field is not filled as a username', async (t) => {
  // (a password manager took the token and password fields for a login form
  //  and filled the token field with the account email address)
  const { web, user, password } = t.context;

  user[config.passport.fields.otpEnabled] = false;
  await user.save();

  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token: null,
    password
  });
  t.is(res.status, 200);

  const tokenInput = res.text.match(/<input[^>]*id="input-token"[^>]*>/)[0];
  t.regex(tokenInput, /autocomplete="one-time-code"/);
  t.regex(tokenInput, /inputmode="numeric"/);

  // the account as the username field, before the token field
  const usernameIndex = res.text.search(
    /<input[^>]*autocomplete="username"[^>]*>/
  );
  t.true(usernameIndex > -1);
  t.true(usernameIndex < res.text.indexOf('id="input-token"'));
  t.true(
    res.text
      .match(/<input[^>]*autocomplete="username"[^>]*>/)[0]
      .includes(`value="${user.email}"`)
  );
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
  const { web, user, password } = t.context;

  user[config.passport.fields.otpEnabled] = false;
  await user.save();

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
  const { web, user } = t.context;

  user[config.passport.fields.otpEnabled] = false;
  await user.save();

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
  const { web, user } = t.context;

  user[config.passport.fields.otpEnabled] = false;
  await user.save();

  // POST setup page
  const res = await web.post(`/en${config.otpRoutePrefix}/setup`).send({
    token: null,
    password: falso.randPassword()
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_PASSWORD);
});

test('POST otp/disable > successful with OTP token', async (t) => {
  // get test server
  const { web, user, password } = t.context;
  const token = authenticator.generate(user[config.passport.fields.otpToken]);

  // POST disable page
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password,
    token
  });

  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account/security');

  const query = await Users.findOne({ email: user.email });
  t.is(query[config.passport.fields.otpEnabled], false);
});

test('POST otp/disable > successful with recovery key', async (t) => {
  // get test server
  const { web, user, password } = t.context;
  user[config.userFields.otpRecoveryKeys] = [
    'test-recovery-key-1',
    'test-recovery-key-2'
  ];
  await user.save();

  // POST disable page
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password,
    recovery_key: 'test-recovery-key-1'
  });

  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account/security');

  const query = await Users.findOne({ email: user.email });
  t.is(query[config.passport.fields.otpEnabled], false);
});

test('POST otp/disable > fails without OTP token or recovery key', async (t) => {
  // get test server
  const { web, password } = t.context;

  // POST disable page with only password (no second factor)
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_OTP_PASSCODE);
});

test('POST otp/disable > fails with invalid OTP token', async (t) => {
  // get test server
  const { web, password } = t.context;

  // POST disable page with wrong token
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password,
    token: '000000'
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_OTP_PASSCODE);
});

test('POST otp/disable > fails with invalid recovery key', async (t) => {
  // get test server
  const { web, user, password } = t.context;
  user[config.userFields.otpRecoveryKeys] = ['valid-key'];
  await user.save();

  // POST disable page with wrong recovery key
  const res = await web.post(`/en${config.otpRoutePrefix}/disable`).send({
    password,
    recovery_key: 'invalid-key'
  });

  t.is(res.status, 400);
  t.is(JSON.parse(res.text).message, phrases.INVALID_RECOVERY_KEY);
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
    password: falso.randPassword()
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
  t.snapshot(
    utils.normalizeBuildHashes(res.text.replace(/<head>[\S\s]*<\/head>/, ''))
  );
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

test('POST otp/keys > a recovery key works only once when sent twice at once', async (t) => {
  const { web, user } = t.context;
  user[config.userFields.otpRecoveryKeys] = ['1', '2', '3'];
  await user.save();

  const responses = await Promise.all(
    Array.from({ length: 5 }, () =>
      web.post(`/en${config.otpRoutePrefix}/keys`).send({ recovery_key: '1' })
    )
  );
  t.deepEqual(
    responses.map((res) => res.status).sort(),
    [302, 400, 400, 400, 400]
  );

  const query = await Users.findOne({ email: user.email });
  t.deepEqual([...query[config.userFields.otpRecoveryKeys]], ['2', '3']);
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

test('two-factor secrets are encrypted at rest and still work', async (t) => {
  const { web, user } = t.context;
  user[config.userFields.otpRecoveryKeys] = ['1', '2'];
  await user.save();
  const secret = user[config.passport.fields.otpToken];
  t.truthy(secret);

  // (what a copy of the database holds)
  const stored = await Users.collection.findOne({ _id: user._id });
  t.not(stored[config.passport.fields.otpToken], secret);
  t.false(JSON.stringify(stored).includes(secret));
  t.is(stored[config.userFields.otpRecoveryKeys].length, 2);
  t.false(stored[config.userFields.otpRecoveryKeys].includes('1'));
  t.false(stored[config.userFields.otpRecoveryKeys].includes('2'));

  // what is stored is not a recovery key
  let res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: stored[config.userFields.otpRecoveryKeys][0] });
  t.is(res.status, 400);

  // a recovery key works once
  res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: '1' });
  t.is(res.status, 302);
  const query = await Users.findById(user._id);
  t.deepEqual([...query[config.userFields.otpRecoveryKeys]], ['2']);

  // and so does a passcode
  res = await web
    .post(`/en${config.loginOtpRoute}`)
    .send({ passcode: authenticator.generate(secret) });
  t.is(res.status, 200);
});

test('two-factor secrets stored before they were encrypted keep working', async (t) => {
  const { web, user } = t.context;
  const secret = authenticator.generateSecret();
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.passport.fields.otpToken]: secret,
        [config.userFields.otpRecoveryKeys]: ['1', '2', '3']
      }
    }
  );

  let res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: '1' });
  t.is(res.status, 302);

  res = await web
    .post(`/en${config.loginOtpRoute}`)
    .send({ passcode: authenticator.generate(secret) });
  t.is(res.status, 200);

  // a copy loaded before a key was used does not bring it back on save
  // (and a save that does not change them leaves them as they are)
  const stale = await Users.findById(user._id);
  t.is(stale[config.passport.fields.otpToken], secret);
  res = await web
    .post(`/en${config.otpRoutePrefix}/keys`)
    .send({ recovery_key: '2' });
  t.is(res.status, 302);
  stale[config.passport.fields.givenName] = 'Stale';
  await stale.save();
  const stored = await Users.collection.findOne({ _id: user._id });
  t.is(stored[config.passport.fields.otpToken], secret);
  t.deepEqual(stored[config.userFields.otpRecoveryKeys], ['3']);

  // a new value is encrypted
  const doc = await Users.findById(user._id);
  doc[config.userFields.otpRecoveryKeys] = ['4', '5'];
  await doc.save();
  const encrypted = await Users.collection.findOne({ _id: user._id });
  t.false(encrypted[config.userFields.otpRecoveryKeys].includes('4'));
  const fresh = await Users.findById(user._id);
  t.is(fresh[config.passport.fields.otpToken], secret);
  t.deepEqual([...fresh[config.userFields.otpRecoveryKeys]], ['4', '5']);
});

//
// helpers for requests outside of the supertest agent (so that cookies such as
// a remember-me cookie can be carried between separate log ins explicitly)
//
function getSetCookies(res) {
  const cookies = {};
  for (const header of res.headers['set-cookie'] || []) {
    const [pair] = header.split(';');
    const index = pair.indexOf('=');
    cookies[pair.slice(0, index)] = pair.slice(index + 1);
  }

  return cookies;
}

function toCookieHeader(cookies) {
  return Object.entries(cookies)
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function enableOtpPolicy(t) {
  const original = process.env.AUTH_OTP_ENABLED;
  process.env.AUTH_OTP_ENABLED = 'true';
  t.teardown(() => {
    if (original === undefined) delete process.env.AUTH_OTP_ENABLED;
    else process.env.AUTH_OTP_ENABLED = original;
  });
}

async function getRememberMeCookies(t) {
  const { web, user } = t.context;
  const passcode = authenticator.generate(
    user[config.passport.fields.otpToken]
  );
  const login = await web
    .post(`/en${config.loginOtpRoute}`)
    .send({ passcode, otp_remember_me: 'true' });
  t.is(login.status, 200);

  // the remember-me cookie is issued on the next request of the session
  const res = await web.get('/en/my-account/security');
  const cookies = getSetCookies(res);
  t.truthy(cookies.otp_remember_me);
  t.truthy(cookies['otp_remember_me.sig']);
  return {
    otp_remember_me: cookies.otp_remember_me,
    'otp_remember_me.sig': cookies['otp_remember_me.sig']
  };
}

// log in with only a password on a fresh client that presents the cookie
async function passwordLoginWithRememberMe(t, rememberMe, password) {
  const { _web, user } = t.context;
  const login = await request(_web.server)
    .post('/en/login')
    .set('Accept', 'application/json')
    .send({ email: user.email, password });
  t.is(login.status, 200);
  return request(_web.server)
    .get('/en/my-account/security')
    .set('Cookie', toCookieHeader({ ...getSetCookies(login), ...rememberMe }));
}

test.serial(
  'GET and POST otp/setup > password-only session cannot read the OTP secret or recovery keys',
  async (t) => {
    enableOtpPolicy(t);
    const { web, user, password } = t.context;
    const secret = user[config.passport.fields.otpToken];
    const recoveryKeys = user[config.userFields.otpRecoveryKeys];
    t.true(typeof secret === 'string' && secret.length > 0);
    t.true(Array.isArray(recoveryKeys) && recoveryKeys.length > 0);

    const getRes = await web.get(`/en${config.otpRoutePrefix}/setup`);
    t.is(getRes.status, 302);
    t.is(getRes.header.location, `/en${config.loginOtpRoute}`);
    t.false(getRes.text.includes(secret));
    for (const key of recoveryKeys) t.false(getRes.text.includes(key));

    const postRes = await web
      .post(`/en${config.otpRoutePrefix}/setup`)
      .send({ password });
    t.is(postRes.status, 302);
    t.is(postRes.header.location, `/en${config.loginOtpRoute}`);
    t.false(postRes.text.includes(secret));

    const jsonRes = await web
      .post(`/en${config.otpRoutePrefix}/setup`)
      .set('Accept', 'application/json')
      .send({ password });
    t.false(jsonRes.text.includes(secret));
    t.is(jsonRes.body.redirectTo, `/en${config.loginOtpRoute}`);

    // two-factor was not touched
    const query = await Users.findById(user._id);
    t.true(query[config.passport.fields.otpEnabled]);
    t.is(query[config.passport.fields.otpToken], secret);
  }
);

test.serial(
  'GET otp/setup > a user without OTP can still start setup',
  async (t) => {
    enableOtpPolicy(t);
    const { web, user, password } = t.context;
    user[config.passport.fields.otpEnabled] = false;
    await user.save();

    const getRes = await web.get(`/en${config.otpRoutePrefix}/setup`);
    t.is(getRes.status, 200);
    t.true(getRes.text.includes('id="otp-recovery-keys"'));

    const postRes = await web
      .post(`/en${config.otpRoutePrefix}/setup`)
      .send({ password });
    t.is(postRes.status, 200);
    t.true(postRes.text.includes('Scan this QR code'));
  }
);

test('POST otp/setup > never returns the existing secret once OTP is enabled', async (t) => {
  const { web, user, password } = t.context;
  const secret = user[config.passport.fields.otpToken];

  const res = await web
    .post(`/en${config.otpRoutePrefix}/setup`)
    .send({ password });
  t.is(res.status, 302);
  t.is(res.header.location, '/en/my-account/security');
  t.false(res.text.includes(secret));

  const jsonRes = await web
    .post(`/en${config.otpRoutePrefix}/setup`)
    .set('Accept', 'application/json')
    .send({ password });
  t.is(jsonRes.status, 400);
  t.is(jsonRes.body.message, phrases.OTP_ALREADY_ENABLED);
  t.false(jsonRes.text.includes(secret));
});

test('POST otp/login > admin who only passed the password step is rate limited', async (t) => {
  const { web, user } = t.context;
  user.group = 'admin';
  await user.save();

  // the route allows 30 attempts, and an admin that has not passed the
  // second factor gets no exemption from that limit
  for (let i = 0; i < 30; i++) {
    const res = await web
      .post(`/en${config.loginOtpRoute}`)
      .set('Accept', 'application/json')
      .send({ passcode: '000000' });
    t.is(res.status, 401);
  }

  const res = await web
    .post(`/en${config.loginOtpRoute}`)
    .set('Accept', 'application/json')
    .send({ passcode: '000000' });
  t.is(res.status, 429);
});

test.serial(
  'OTP remember-me cookie skips OTP until the password changes',
  async (t) => {
    enableOtpPolicy(t);
    const rememberMe = await getRememberMeCookies(t);

    let res = await passwordLoginWithRememberMe(
      t,
      rememberMe,
      t.context.password
    );
    t.is(res.status, 200);

    const password = falso.randPassword();
    const user = await Users.findById(t.context.user._id);
    await user.setPassword(password);
    await user.save();

    res = await passwordLoginWithRememberMe(t, rememberMe, password);
    t.is(res.status, 302);
    t.is(res.header.location, `/en${config.loginOtpRoute}`);
  }
);

test.serial(
  'OTP remember-me cookie stops working after the OTP secret changes',
  async (t) => {
    enableOtpPolicy(t);
    const rememberMe = await getRememberMeCookies(t);

    const user = await Users.findById(t.context.user._id);
    user[config.passport.fields.otpToken] = authenticator.generateSecret();
    await user.save();

    const res = await passwordLoginWithRememberMe(
      t,
      rememberMe,
      t.context.password
    );
    t.is(res.status, 302);
    t.is(res.header.location, `/en${config.loginOtpRoute}`);
  }
);

test.serial(
  'OTP remember-me cookie stops working after logging out other sessions',
  async (t) => {
    enableOtpPolicy(t);
    const { web } = t.context;
    const rememberMe = await getRememberMeCookies(t);

    const invalidate = await web
      .post('/en/my-account/invalidate-other-sessions')
      .set('Accept', 'application/json');
    t.is(invalidate.status, 200);

    const res = await passwordLoginWithRememberMe(
      t,
      rememberMe,
      t.context.password
    );
    t.is(res.status, 302);
    t.is(res.header.location, `/en${config.loginOtpRoute}`);
  }
);

test.serial(
  'OTP remember-me cookie keeps working when an older password hash is rehashed',
  async (t) => {
    enableOtpPolicy(t);
    const { user, password } = t.context;

    // a hash made before the salt recorded its iterations
    const { iterations, keylen, digestAlgorithm, encoding } =
      config.passportLocalMongoose;
    const salt = crypto.randomBytes(32).toString(encoding);
    await Users.collection.updateOne(
      { _id: user._id },
      {
        $set: {
          salt,
          hash: crypto
            .pbkdf2Sync(password, salt, iterations, keylen, digestAlgorithm)
            .toString(encoding)
        }
      }
    );
    const rememberMe = await getRememberMeCookies(t);

    // this sign in rehashes it, and the cookie still skips OTP
    let res = await passwordLoginWithRememberMe(t, rememberMe, password);
    t.is(res.status, 200);
    const stored = await Users.collection.findOne({ _id: user._id });
    t.is(
      stored.salt,
      `${config.passportLocalMongoose.pbkdf2Iterations}$${salt}`
    );

    res = await passwordLoginWithRememberMe(t, rememberMe, password);
    t.is(res.status, 200);
  }
);

test('a session that has not passed two-factor cannot add a domain', async (t) => {
  // (signed in with the password only, see beforeEach)
  const { web, user } = t.context;
  const name = `otp-pending-${crypto.randomBytes(6).toString('hex')}.com`;

  const res = await web
    .post('/en')
    .set('Accept', 'application/json')
    .send({ email: user.email, domain: name });
  t.is(res.body.redirectTo, `/en${config.loginOtpRoute}`);
  t.false(Boolean(await Domains.exists({ name })));
});
