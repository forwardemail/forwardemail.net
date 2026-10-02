/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Session cookies are sent with a GET from another site (SameSite=Lax), so
// opening an invite link only shows the invite, and it is accepted with a
// POST from that page.  The same goes for the newsletter link.
//

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const createTangerine = require('#helpers/create-tangerine');
const { Domains, Users } = require('#models');

const resolver = createTangerine(new Redis());

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

async function createInvite(t, { email, expiresAt } = {}) {
  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: admin._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin.plan,
      kind: 'one-time'
    })
    .create();
  await admin.save();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: admin._id, group: 'admin' }],
      plan: admin.plan,
      resolver,
      ignore_mx_check: true
    })
    .create();
  const token = randomUUID();
  domain.invites.push({
    email: email || t.context.user.email,
    group: 'user',
    token,
    expires_at: expiresAt || dayjs().add(1, 'day').toDate()
  });
  domain.skip_verification = true;
  await domain.save();
  return {
    admin,
    domain,
    token,
    path: `/en/my-account/domains/${domain.id}/invites/${token}`
  };
}

async function isMember(domain, user) {
  const fresh = await Domains.findById(domain._id).lean().exec();
  return fresh.members.some(
    (member) => member.user.toString() === user._id.toString()
  );
}

test('opening an invite link shows the invite without accepting it', async (t) => {
  const { web, user } = t.context;
  const { domain, path } = await createInvite(t);

  // e.g. a link or redirect on another site
  const res = await web
    .get(path)
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'cross-site');
  t.is(res.status, 200);
  t.true(res.text.includes(domain.name));
  t.true(res.text.includes(`action="${path}"`));
  t.false(await isMember(domain, user));

  // accepting it is a POST from that page
  const accepted = await web.post(path).set('Accept', 'application/json');
  t.is(accepted.status, 200);
  t.true(await isMember(domain, user));
});

test('the newsletter link only subscribes from this site', async (t) => {
  const { web, user } = t.context;
  // (opted out)
  await Users.findByIdAndUpdate(user._id, { $set: { has_newsletter: false } });

  let res = await web
    .get('/en/my-account/profile?newsletter=true')
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'cross-site');
  t.is(res.status, 200);
  let fresh = await Users.findById(user._id).lean().exec();
  t.false(Boolean(fresh.has_newsletter));

  res = await web
    .get('/en/my-account/profile?newsletter=true')
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 302);
  fresh = await Users.findById(user._id).lean().exec();
  t.true(fresh.has_newsletter);
});

//
// An invitee often has a mailbox on the domain but no website account, and
// tried the mailbox password on the login page. A link opened while signed
// out explains the two and leads to sign up with the invited address.
//
test('a signed-out invite link explains the account it needs and comes back after sign up', async (t) => {
  const email = falso.randEmail({ provider: 'example', suffix: 'com' });
  const { domain, path } = await createInvite(t, { email });
  const visitor = request.agent(t.context._web.server);

  const res = await visitor.get(path).set('Accept', 'text/html');
  t.is(res.status, 200);
  t.true(res.text.includes(domain.name));
  t.true(res.text.includes(email));
  // (the mailbox password does not work here)
  t.true(res.text.includes('The password we generate for a mailbox'));
  // sign up with the invited address filled in, or sign in, both coming back
  const signUp = `/en/register?email=${encodeURIComponent(
    email
  )}&amp;return_to=${encodeURIComponent(path)}`;
  t.true(res.text.includes(`href="${signUp}"`));
  t.true(
    res.text.includes(`href="/en/login?return_to=${encodeURIComponent(path)}"`)
  );
  // the token stays out of the Referer of any link on the page
  t.true(res.text.includes('<meta name="referrer" content="no-referrer"/>'));

  // the sign up page has the address filled in
  // (falso addresses can hold a "+", so no RegExp here)
  const form = await visitor
    .get(`/en/register?email=${encodeURIComponent(email)}`)
    .set('Accept', 'text/html');
  t.true(form.text.includes(`value="${email}"`));

  // signing up lands back on the invite
  const signedUp = await visitor
    .post(`/en/register?return_to=${encodeURIComponent(path)}`)
    .set('Accept', 'application/json')
    .send({ email, password: falso.randPassword() });
  t.is(signedUp.status, 200);
  t.is(signedUp.body.redirectTo, path);

  // which asks to verify the address first: the link can travel outside
  // email, and these pages show the address, so only a code sent to the
  // invited inbox lets an account accept
  const verifyPath = `/en/verify?redirect_to=${encodeURIComponent(path)}`;
  const unverified = await visitor.get(path).set('Accept', 'text/html');
  t.is(unverified.status, 302);
  t.is(unverified.header.location, verifyPath);
  const early = await visitor.post(path).set('Accept', 'application/json');
  t.is(early.body.redirectTo, verifyPath);
  let invitee = await Users.findOne({ email }).lean().exec();
  t.false(await isMember(domain, invitee));
  t.false(Boolean(invitee[config.userFields.hasVerifiedEmail]));

  // the verify page sends the code, and entering it comes back to the invite
  await visitor.get(verifyPath).set('Accept', 'text/html');
  invitee = await Users.findOne({ email }).lean().exec();
  t.truthy(invitee[config.userFields.verificationPin]);
  const verified = await visitor
    .post(verifyPath)
    .set('Accept', 'application/json')
    .send({ pin: invitee[config.userFields.verificationPin] });
  t.is(verified.body.redirectTo, path);

  const page = await visitor.get(path).set('Accept', 'text/html');
  t.is(page.status, 200);
  t.true(page.text.includes(`action="${path}"`));
  const accepted = await visitor.post(path).set('Accept', 'application/json');
  t.is(accepted.status, 200);
  t.true(await isMember(domain, invitee));
});

test('a signed-out link to an expired invite says so, and an unknown one asks to sign in', async (t) => {
  const email = falso.randEmail({ provider: 'example', suffix: 'com' });
  const { domain, path } = await createInvite(t, {
    email,
    expiresAt: dayjs().subtract(1, 'day').toDate()
  });
  const visitor = request.agent(t.context._web.server);

  const expired = await visitor.get(path).set('Accept', 'text/html');
  t.is(expired.status, 410);
  t.true(expired.text.includes(phrases.INVITE_EXPIRED));
  t.false(expired.text.includes(email));

  // an unknown link goes to sign in like any account page (a member who
  // accepted it is then taken to the domain, anyone else told it is not
  // valid), and the same links signed in are not valid
  const unknownPaths = [
    `/en/my-account/domains/${domain.id}/invites/not-a-token`,
    // (an id that is not an ObjectId)
    '/en/my-account/domains/nope/invites/not-a-token'
  ];
  for (const unknownPath of unknownPaths) {
    const signedOut = await visitor.get(unknownPath).set('Accept', 'text/html');
    t.is(signedOut.status, 302);
    t.true(signedOut.header.location.startsWith('/en/login'));

    const signedIn = await t.context.web
      .get(unknownPath)
      .set('Accept', 'application/json');
    t.is(signedIn.status, 404);
    t.is(signedIn.body.message, phrases.INVITE_DOES_NOT_EXIST);
  }
});

test('an invite opened with another account names both and offers to sign out', async (t) => {
  const { web, user } = t.context;
  const email = falso.randEmail({ provider: 'example', suffix: 'com' });
  const { domain, path } = await createInvite(t, { email });

  const res = await web.get(path).set('Accept', 'text/html');
  t.is(res.status, 200);
  t.false(res.text.includes(`action="${path}"`));
  t.true(res.text.includes(email));
  t.true(res.text.includes(user.email));
  const signOut = `/en/logout?return_to=${encodeURIComponent(path)}`;
  t.true(res.text.includes(`href="${signOut}"`));
  t.false(await isMember(domain, user));

  // accepting it is refused, with the same explanation
  const accept = await web.post(path).set('Accept', 'application/json');
  t.is(accept.status, 403);
  t.true(accept.body.message.includes(email));
  t.true(accept.body.message.includes(user.email));
  t.false(await isMember(domain, user));

  // "Sign out and continue" comes back to the invite, signed out
  const out = await web.get(signOut).set('Sec-Fetch-Site', 'same-origin');
  t.is(out.status, 302);
  t.is(out.header.location, path);
  const landing = await web.get(path).set('Accept', 'text/html');
  t.is(landing.status, 200);
  t.true(landing.text.includes('The password we generate for a mailbox'));
});

test('sign out only returns to a path on this site', async (t) => {
  for (const returnTo of [
    'https://evil.example/x',
    '//evil.example',
    '/\\evil.example',
    '/%5Cevil.example',
    '/%0d%0aSet-Cookie:x=1'
  ]) {
    // signed in, and with the session already over
    await utils.loginUser(t);
    for (const agent of [t.context.web, request.agent(t.context._web.server)]) {
      const res = await agent
        .get(`/en/logout?return_to=${encodeURIComponent(returnTo)}`)
        .set('Sec-Fetch-Site', 'same-origin');
      t.is(res.status, 302);
      t.is(res.header.location, '/en', `refused ${returnTo}`);
    }
  }

  // a path on this site, also when the session already ended
  const visitor = request.agent(t.context._web.server);
  const res = await visitor
    .get(`/en/logout?return_to=${encodeURIComponent('/en/faq')}`)
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.header.location, '/en/faq');
});

test('opening an accepted invite again goes to the domain', async (t) => {
  const { web, user } = t.context;
  const { domain, path } = await createInvite(t);
  const accepted = await web.post(path).set('Accept', 'application/json');
  t.is(accepted.status, 200);

  const again = await web.get(path).set('Accept', 'text/html');
  t.is(again.status, 302);
  t.is(again.header.location, `/en/my-account/domains/${domain.name}/aliases`);
  t.true(await isMember(domain, user));
});

test('a member who opens an accepted invite while signed out signs in and goes to the domain', async (t) => {
  const { user, password } = t.context;
  const { domain, path } = await createInvite(t);
  const accepted = await t.context.web
    .post(path)
    .set('Accept', 'application/json');
  t.is(accepted.status, 200);

  const visitor = request.agent(t.context._web.server);
  const res = await visitor.get(path).set('Accept', 'text/html');
  t.is(res.status, 302);
  t.true(res.header.location.startsWith('/en/login'));
  const signedIn = await visitor
    .post('/en/login')
    .set('Accept', 'application/json')
    .send({ email: user.email, password });
  t.is(signedIn.body.redirectTo, path);
  const again = await visitor.get(path).set('Accept', 'text/html');
  t.is(again.status, 302);
  t.is(again.header.location, `/en/my-account/domains/${domain.name}/aliases`);
});

test('an expired invite says it expired and is removed', async (t) => {
  const { web } = t.context;
  // opened from the email: the invite page says it expired
  let { domain, path } = await createInvite(t, {
    expiresAt: dayjs().subtract(1, 'minute').toDate()
  });
  const page = await web.get(path).set('Accept', 'text/html');
  t.is(page.status, 410);
  t.true(page.text.includes(phrases.INVITE_EXPIRED));
  t.true(page.text.includes(domain.name));
  let fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.invites.length, 0);

  // accepting it (or the API) gets the message
  ({ domain, path } = await createInvite(t, {
    expiresAt: dayjs().subtract(1, 'minute').toDate()
  }));
  const res = await web.post(path).set('Accept', 'application/json');
  t.is(res.status, 410);
  t.is(res.body.message, phrases.INVITE_EXPIRED);
  fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.invites.length, 0);
});

test('inviting an address again replaces an expired invite', async (t) => {
  const email = falso.randEmail({ provider: 'example', suffix: 'com' });
  const { admin, domain, token } = await createInvite(t, {
    email,
    expiresAt: dayjs().subtract(1, 'day').toDate()
  });

  // sign in as the domain admin
  const password = falso.randPassword();
  await admin.setPassword(password);
  admin[config.userFields.hasSetPassword] = true;
  await admin.save();
  const agent = request.agent(t.context._web.server);
  await agent.post('/en/login').send({ email: admin.email, password });

  const invite = (body) =>
    agent
      .post(`/en/my-account/domains/${domain.name}/invites`)
      .set('Accept', 'application/json')
      .send(body);

  // mixed case, and the expired invite to the address does not block it
  let res = await invite({ email: email.toUpperCase(), group: 'user' });
  t.is(res.status, 200);
  let fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.invites.length, 1);
  t.is(fresh.invites[0].email, email.toLowerCase());
  t.not(fresh.invites[0].token, token);
  t.true(new Date(fresh.invites[0].expires_at) > new Date());

  // a pending invite still is not sent twice
  res = await invite({ email, group: 'user' });
  t.is(res.status, 400);
  t.is(res.body.message, phrases.INVITE_ALREADY_SENT);
  fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.invites.length, 1);

  // the team page marks an expired invite and offers no link to copy
  await Domains.updateOne(
    { _id: domain._id },
    { $set: { 'invites.0.expires_at': dayjs().subtract(1, 'day').toDate() } }
  );
  const page = await agent
    .get(`/en/my-account/domains/${domain.name}/advanced-settings`)
    .set('Accept', 'text/html');
  t.is(page.status, 200);
  t.regex(page.text, /badge badge-warning">Expired</);
  t.false(page.text.includes('copy-invite-btn'));
});

test('the sign in form says a mailbox password does not work there', async (t) => {
  const visitor = request.agent(t.context._web.server);
  const res = await visitor.get('/en/login').set('Accept', 'text/html');
  t.is(res.status, 200);
  t.true(res.text.includes('Signing in to a mailbox?'));
  t.true(res.text.includes('href="https://mail.forwardemail.net"'));
});
