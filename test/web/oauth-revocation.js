/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Revoking this application's access at Google or GitHub must end the
// sessions that were signed in with it (someone else's device, a stolen
// session cookie). Before, they stayed signed in until they expired.
//

const http = require('node:http');
const { randomUUID } = require('node:crypto');

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const { Users } = require('#models');

test.before(utils.setupMongoose);

//
// A stand-in for Google and GitHub: sign in, refresh token, user endpoint.
// Each sign in grants a new token; revoking access revokes all of them.
//
const provider = {
  granted: new Set(),
  withholdRefreshToken: false,
  issued: 0,
  down: false,
  // (how long a check takes, in ms)
  delay: 0,
  checks: 0,
  email: '',
  googleId: '',
  githubId: 0
};

function send(res, status, json) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(json));
}

const providerServer = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let body = '';
  for await (const chunk of req) body += chunk;
  const params = new URLSearchParams(body);

  switch (url.pathname) {
    case '/google/token': {
      if (params.get('grant_type') === 'authorization_code') {
        // (Google gives a refresh token only when consent is asked for)
        if (provider.withholdRefreshToken) {
          send(res, 200, {
            access_token: 'google-access',
            expires_in: 3600,
            token_type: 'Bearer'
          });
          return;
        }

        const refreshToken = `google-refresh-${++provider.issued}`;
        provider.granted.add(refreshToken);
        send(res, 200, {
          access_token: 'google-access',
          refresh_token: refreshToken,
          expires_in: 3600,
          token_type: 'Bearer'
        });
        return;
      }

      provider.checks++;
      if (provider.delay)
        await new Promise((resolve) => {
          setTimeout(resolve, provider.delay);
        });
      if (provider.down) {
        send(res, 503, { error: 'backend_error' });
        return;
      }

      if (!provider.granted.has(params.get('refresh_token'))) {
        send(res, 400, {
          error: 'invalid_grant',
          error_description: 'Token has been expired or revoked.'
        });
        return;
      }

      send(res, 200, { access_token: 'google-access-2', expires_in: 3600 });
      return;
    }

    case '/google/userinfo': {
      send(res, 200, {
        sub: provider.googleId,
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        email: provider.email,
        email_verified: true
      });
      return;
    }

    case '/github/token': {
      const accessToken = `github-access-${++provider.issued}`;
      provider.granted.add(accessToken);
      send(res, 200, {
        access_token: accessToken,
        token_type: 'bearer',
        scope: 'user:email'
      });
      return;
    }

    case '/github/user': {
      provider.checks++;
      if (provider.down) {
        send(res, 503, { message: 'Service unavailable' });
        return;
      }

      const token =
        req.headers.authorization?.replace(/^(bearer|token) /i, '') ||
        url.searchParams.get('access_token');
      if (!provider.granted.has(token)) {
        send(res, 401, { message: 'Bad credentials' });
        return;
      }

      send(res, 200, {
        id: provider.githubId,
        login: 'test-user',
        name: 'Test User',
        email: provider.email
      });
      return;
    }

    case '/github/emails': {
      send(res, 200, [
        { email: provider.email, primary: true, verified: true }
      ]);
      return;
    }

    default: {
      send(res, 404, {});
    }
  }
});

test.before(async () => {
  await new Promise((resolve) => {
    providerServer.listen(0, '127.0.0.1', resolve);
  });
});

test.after.always(() => {
  providerServer.close();
});

test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  const base = `http://127.0.0.1:${providerServer.address().port}`;
  t.context.webConfig = {
    passport: {
      providers: { google: true, github: true },
      strategies: {
        google: {
          clientID: 'google-client',
          clientSecret: 'google-secret',
          callbackURL: '/auth/google/ok',
          authorizationURL: `${base}/google/auth`,
          tokenURL: `${base}/google/token`,
          userProfileURL: `${base}/google/userinfo`
        },
        github: {
          clientID: 'github-client',
          clientSecret: 'github-secret',
          callbackURL: '/auth/github/ok',
          authorizationURL: `${base}/github/auth`,
          tokenURL: `${base}/github/token`,
          userProfileURL: `${base}/github/user`,
          userEmailURL: `${base}/github/emails`
        }
      }
    }
  };
  await utils.setupWebServer(t);
  currentWeb = t.context._web;
  provider.granted.clear();
  Object.assign(provider, {
    down: false,
    delay: 0,
    withholdRefreshToken: false,
    checks: 0,
    email: `oauth-${randomUUID()}@example.com`,
    googleId: String(Date.now()) + String(Math.random()).slice(2, 8),
    githubId: Math.floor(Math.random() * 1e9)
  });
});

async function signIn(t, name, agent = request.agent(t.context._web.server)) {
  const start = await agent.get(`/auth/${name}`);
  t.is(start.status, 302);
  const state = new URL(start.headers.location).searchParams.get('state');
  t.truthy(state);
  const callback = await agent.get(
    `/auth/${name}/ok?code=test-code&state=${encodeURIComponent(state)}`
  );
  t.is(callback.status, 302);
  t.context.callback = callback;
  return agent;
}

// (the provider is asked in the background: this waits for its answer)
async function settle() {
  const { client } = currentWeb.app.context;
  const user = await Users.findOne({ email: provider.email }).lean();
  if (!user) return;
  await pWaitFor(
    () =>
      Promise.all(
        ['google', 'github'].map((name) =>
          client.get(`oauth_grant:${name}:${user.id}`)
        )
      ).then((states) => states.every((state) => state !== 'checking')),
    { interval: 20, timeout: ms('5s') }
  );
}

let currentWeb;

async function isSignedIn(agent) {
  const res = await agent.get('/en/my-account/security');
  await settle();
  return res.status === 200;
}

//
// (the provider's answer is kept for a few minutes; this is that time
// passing, and the next request of a session asking the provider again)
//
async function laterOn(t, name, agent) {
  const user = await Users.findOne({ email: provider.email }).lean();
  await t.context._web.app.context.client.del(`oauth_grant:${name}:${user.id}`);
  if (agent) await isSignedIn(agent);
}

for (const name of ['google', 'github']) {
  test.serial(
    `${name}: revoking access ends the sessions it signed in`,
    async (t) => {
      const first = await signIn(t, name);
      const second = await signIn(t, name);
      t.true(await isSignedIn(first));
      t.true(await isSignedIn(second));

      // (a password session of the same account is not one of them)
      const user = await Users.findOne({ email: provider.email });
      await user.setPassword('correct-horse-battery-staple');
      user[config.userFields.hasSetPassword] = true;
      await user.save();
      const withPassword = request.agent(t.context._web.server);
      await withPassword.post('/en/login').send({
        email: provider.email,
        password: 'correct-horse-battery-staple'
      });
      t.true(await isSignedIn(withPassword));

      // (still granted: nothing ends)
      const { checks } = provider;
      await laterOn(t, name, first);
      t.true(await isSignedIn(first));
      t.true(provider.checks > checks);

      // (access revoked at the provider)
      provider.granted.clear();
      await laterOn(t, name, first);
      t.false(await isSignedIn(first));
      t.false(await isSignedIn(second));
      t.true(await isSignedIn(withPassword));

      // (and the dead tokens are gone)
      const after = await Users.findOne({ email: provider.email }).lean();
      t.falsy(
        name === 'google'
          ? after[config.passport.fields.googleRefreshToken]
          : after[config.passport.fields.githubAccessToken]
      );
    }
  );

  //
  // Signing in again stores a new grant; the sessions from before must not
  // pass their next check with it.
  //
  test.serial(
    `${name}: signing in again after revoking ends the sessions from before`,
    async (t) => {
      const before = await signIn(t, name);
      t.true(await isSignedIn(before));

      provider.granted.clear();
      const again = await signIn(t, name);

      await laterOn(t, name, again);
      // (the sign in ended them in the background)
      await pWaitFor(async () => !(await isSignedIn(before)), {
        interval: 50,
        timeout: ms('5s')
      });
      t.true(await isSignedIn(again));
    }
  );

  test.serial(
    `${name}: a provider outage does not end the session`,
    async (t) => {
      const agent = await signIn(t, name);
      t.true(await isSignedIn(agent));
      provider.down = true;
      await laterOn(t, name, agent);
      t.true(await isSignedIn(agent));
      t.true(await isSignedIn(agent));
    }
  );
}

//
// Disconnecting the provider here, or linking another provider account,
// signs no session out (as before): only a revocation at the provider does.
//
test.serial('disconnecting the provider here signs nothing out', async (t) => {
  const agent = await signIn(t, 'google');
  t.true(await isSignedIn(agent));
  await Users.updateOne(
    { email: provider.email },
    { $unset: { [config.passport.fields.googleRefreshToken]: 1 } }
  );
  t.true(await isSignedIn(agent));
  await laterOn(t, 'google', agent);
  t.true(await isSignedIn(agent));
});

test.serial('linking another provider account signs nothing out', async (t) => {
  const before = await signIn(t, 'google');
  t.true(await isSignedIn(before));

  provider.googleId = `${provider.googleId}-2`;
  const after = await signIn(t, 'google');
  t.true(await isSignedIn(after));
  t.true(await isSignedIn(before));

  const user = await Users.findOne({ email: provider.email }).lean();
  t.is(user[config.passport.fields.googleProfileID], provider.googleId);
  t.truthy(user[config.passport.fields.googleRefreshToken]);
  await laterOn(t, 'google', before);
  t.true(await isSignedIn(after));
  t.true(await isSignedIn(before));
});

//
// A Google refresh token that was never seen alive (one that expired unused,
// while Google signs the user in with the consent given before) is not a
// revocation: the session carries on, as before.
//
test.serial(
  'a token refused before it was ever seen alive signs nothing out',
  async (t) => {
    const first = await signIn(t, 'google');
    t.true(await isSignedIn(first));
    // (months later: the stored token expired, and a sign in gives none)
    const user = await Users.findOne({ email: provider.email }).lean();
    const { client } = t.context._web.app.context;
    await client.del(`oauth_grant_seen:google:${user.id}`);
    provider.granted.clear();
    provider.withholdRefreshToken = true;
    const later = await signIn(t, 'google');
    await laterOn(t, 'google', later);
    t.true(await isSignedIn(later));
    await laterOn(t, 'google', later);
    t.true(await isSignedIn(later));
    t.true(await isSignedIn(first));
  }
);

//
// A check of the token from before that ends after a sign in stored a new
// one must not count the old token as the one seen alive: the new one is,
// and its revocation still ends the sessions.
//
test.serial(
  'a check that ends after a new sign in does not hide its revocation',
  async (t) => {
    const first = await signIn(t, 'google');
    t.true(await isSignedIn(first));

    // (a slow check of the first token is under way)
    provider.delay = 500;
    const user = await Users.findOne({ email: provider.email }).lean();
    const { client } = t.context._web.app.context;
    await client.del(`oauth_grant:google:${user.id}`);
    await first.get('/en/my-account/security');

    // (and the user signs in again meanwhile, with a new grant)
    const second = await signIn(t, 'google');
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    provider.delay = 0;
    await settle();

    // (access revoked at the provider)
    provider.granted.clear();
    await laterOn(t, 'google', second);
    t.false(await isSignedIn(second));
    t.false(await isSignedIn(first));
  }
);

//
// AUTH_OAUTH_REVOCATION_CHECK=true (as the self-hosting guide says) turns the
// check on, and =false turns it off: @ladjs/env gives them as booleans.
//
test.serial(
  'AUTH_OAUTH_REVOCATION_CHECK turns the check on and off',
  async (t) => {
    const { isSelfHosted } = config;
    const value = env.AUTH_OAUTH_REVOCATION_CHECK;
    t.teardown(() => {
      config.isSelfHosted = isSelfHosted;
      env.AUTH_OAUTH_REVOCATION_CHECK = value;
    });

    // (self-hosted, turned on)
    config.isSelfHosted = true;
    env.AUTH_OAUTH_REVOCATION_CHECK = true;
    const agent = await signIn(t, 'github');
    t.true(await isSignedIn(agent));
    provider.granted.clear();
    await laterOn(t, 'github', agent);
    t.false(await isSignedIn(agent));

    // (hosted, turned off)
    config.isSelfHosted = false;
    env.AUTH_OAUTH_REVOCATION_CHECK = false;
    const other = await signIn(t, 'google');
    t.true(await isSignedIn(other));
    provider.granted.clear();
    await laterOn(t, 'google', other);
    t.true(await isSignedIn(other));
  }
);

//
// A database error while noting how the session signed in must not turn
// the sign in into an error page.
//
test.serial('a database error after signing in still signs in', async (t) => {
  const { findOne } = Users;
  t.teardown(() => {
    Users.findOne = findOne;
  });
  // (fails only the lookup of the provider's profile id and token)
  Users.findOne = function (...args) {
    const query = findOne.apply(this, args);
    const { select } = query;
    query.select = function (fields) {
      if (
        typeof fields === 'string' &&
        fields.includes(config.passport.fields.githubProfileID)
      )
        throw new Error('database unavailable');
      return select.call(this, fields);
    };

    return query;
  };

  const agent = await signIn(t, 'github');
  Users.findOne = findOne;
  // (on to the account, as any sign in, not back with an error)
  const { location } = t.context.callback.headers;
  await signIn(t, 'github');
  t.is(location, t.context.callback.headers.location);
  t.true(await isSignedIn(agent));
});

test.serial('self-hosted installs do not check by default', async (t) => {
  const { isSelfHosted } = config;
  config.isSelfHosted = true;
  t.teardown(() => {
    config.isSelfHosted = isSelfHosted;
  });
  const agent = await signIn(t, 'github');
  t.true(await isSignedIn(agent));
  provider.granted.clear();
  await laterOn(t, 'github', agent);
  t.true(await isSignedIn(agent));
});

//
// Anyone can register an account with an address they do not own.  When the
// owner of the address then signs in with Google or GitHub, which proves
// they control it, the account is theirs: the password, API token and
// sessions set up before then stop working.
//
for (const plan of ['free', 'enhanced_protection']) {
  test.serial(
    `signing in with a provider takes over an account on the ${plan} plan that someone else registered`,
    async (t) => {
      let user = new Users({
        email: provider.email,
        [config.userFields.hasVerifiedEmail]: false
      });
      user = await Users.register(user, 'Attacker-Passw0rd!x');
      user[config.userFields.hasSetPassword] = true;
      // (a paid plan counts the address as verified, but not proven)
      if (plan !== 'free') user.plan = plan;
      await user.save();
      const { [config.userFields.apiToken]: apiToken } = await Users.findById(
        user._id
      ).lean();

      const attacker = request.agent(t.context._web.server);
      await attacker.post('/en/login').send({
        email: provider.email,
        password: 'Attacker-Passw0rd!x'
      });
      t.true(await isSignedIn(attacker));

      const owner = await signIn(t, 'google');
      t.true(await isSignedIn(owner));

      const after = await Users.findById(user._id);
      t.true(after[config.userFields.hasVerifiedEmail]);
      t.falsy(after[config.userFields.emailProofPending]);
      t.false(after[config.userFields.hasSetPassword]);
      t.not(after[config.userFields.apiToken], apiToken);
      const { user: authenticated } = await after.authenticate(
        'Attacker-Passw0rd!x'
      );
      t.falsy(authenticated);
      t.false(await isSignedIn(attacker));
    }
  );
}

//
// An account whose address was proven, and that the Ubuntu team sync marked
// unverified to delete it once the user left the team (see
// helpers/sync-ubuntu-user.js), keeps its password, API token and sessions
// when its owner signs in with a provider again.
//
test.serial(
  'signing in with a provider keeps an account the team sync marked unverified',
  async (t) => {
    let user = new Users({
      email: provider.email,
      [config.userFields.hasVerifiedEmail]: true
    });
    user = await Users.register(user, 'Owner-Passw0rd!x');
    user[config.userFields.hasSetPassword] = true;
    await user.save();
    await Users.findByIdAndUpdate(user._id, {
      $set: {
        [config.userFields.hasVerifiedEmail]: false,
        [config.userFields.emailProofPending]: false
      }
    });
    const { [config.userFields.apiToken]: apiToken } = await Users.findById(
      user._id
    ).lean();

    const other = request.agent(t.context._web.server);
    await other.post('/en/login').send({
      email: provider.email,
      password: 'Owner-Passw0rd!x'
    });
    t.true(await isSignedIn(other));

    const owner = await signIn(t, 'google');
    t.true(await isSignedIn(owner));

    const after = await Users.findById(user._id);
    t.true(after[config.userFields.hasSetPassword]);
    t.is(after[config.userFields.apiToken], apiToken);
    const { user: authenticated } = await after.authenticate(
      'Owner-Passw0rd!x'
    );
    t.truthy(authenticated);
    t.true(await isSignedIn(other));
  }
);
