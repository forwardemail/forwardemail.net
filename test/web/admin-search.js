/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const test = require('ava');
const falso = require('@ngneat/falso');

const utils = require('../utils');
const config = require('#config');
const { Emails, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const password = falso.randPassword();
  let admin = await t.context.userFactory.make();
  admin = await Users.register(admin, password);
  admin.group = 'admin';
  admin[config.userFields.hasVerifiedEmail] = true;
  admin = await admin.save();

  const tag = crypto.randomUUID().replaceAll('-', '').slice(0, 12);
  let other = await t.context.userFactory
    .withState({ email: `search.${tag}@example.com` })
    .make();
  other = await Users.register(other, falso.randPassword());
  other[config.userFields.hasVerifiedEmail] = true;
  other = await other.save();

  const domain = await t.context.domainFactory
    .withState({
      name: `search-${tag}.example.com`,
      plan: 'free',
      members: [{ user: admin._id, group: 'admin' }]
    })
    .create();

  t.context.user = admin;
  t.context.password = password;
  t.context.other = other;
  t.context.tag = tag;
  t.context.domain = domain;
  t.context.webConfig = { turnstileEnabled: false };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test.serial(
  'admin searches treat the query as a literal substring, not a regex',
  async (t) => {
    const { web, other, tag, domain } = t.context;

    // regex metacharacters must not error (an unescaped "(" is an invalid
    // pattern and used to fail the whole request)
    for (const path of ['/en/admin/users', '/en/admin/inquiries']) {
      const res = await web
        .get(path)
        .query({ q: 'search.(' })
        .set('Accept', 'application/json');
      t.is(res.status, 200, `${path}`);
    }

    const domains = await web
      .get('/en/admin/domains')
      .query({ name: 'search-(' })
      .set('Accept', 'application/json');
    t.is(domains.status, 200);

    // ".*" only matches a literal ".*" (which no user has)
    const wildcard = await web
      .get('/en/admin/users')
      .query({ q: '.*' })
      .set('Accept', 'application/json');
    t.is(wildcard.status, 200);
    t.false(wildcard.body.table.includes(other.email));

    // a literal substring containing "." still finds the user
    const literal = await web
      .get('/en/admin/users')
      .query({ q: `search.${tag}` })
      .set('Accept', 'application/json');
    t.is(literal.status, 200);
    t.true(literal.body.table.includes(other.email));

    // ".*" in a domain search no longer matches every domain, while a
    // literal substring still does
    const domainWildcard = await web
      .get('/en/admin/domains')
      .query({ name: `.*${tag}` })
      .set('Accept', 'application/json');
    t.is(domainWildcard.status, 200);
    t.false(domainWildcard.body.table.includes(domain.name));

    const domainLiteral = await web
      .get('/en/admin/domains')
      .query({ name: `-${tag}.` })
      .set('Accept', 'application/json');
    t.is(domainLiteral.status, 200);
    t.true(domainLiteral.body.table.includes(domain.name));
  }
);

//
// A query an admin search refuses is named in the error, which is shown as
// HTML (the error page, or a flash message): a link to the search could put
// a form of the attacker's on the page, posting to an admin route.
//
test.serial('a refused admin query is shown escaped', async (t) => {
  const { web } = t.context;
  const payload =
    '<form action=/en/admin/users method=POST><button>Retry</button></form>';
  const mongodbQuery = JSON.stringify({ [`$${payload}`]: 1 });

  for (const path of [
    '/en/admin/users',
    '/en/admin/domains',
    '/en/admin/inquiries',
    '/en/admin/payments',
    '/en/admin/emails',
    '/en/admin/logs'
  ]) {
    const page = await web
      .get(path)
      .query({ mongodb_query: mongodbQuery })
      .set('Accept', 'text/html');
    t.is(page.status, 400, `${path}`);
    t.false(page.text.includes('<form action=/en/admin/users'), `${path}`);
    t.true(page.text.includes('&lt;form'), `${path}`);

    const json = await web
      .get(path)
      .query({ mongodb_query: mongodbQuery })
      .set('Accept', 'application/json');
    t.is(json.status, 400, `${path}`);
    t.false(json.body.message.includes('<form'), `${path}`);
  }
});

// (a raw message is a download, never a page shown on our own origin)
test.serial('an email downloaded as .eml is an attachment', async (t) => {
  const { web, user } = t.context;
  const { insertedId } = await Emails.collection.insertOne({
    user: user._id,
    message: Buffer.from(
      'From: a@example.com\r\nSubject: hi\r\n\r\n<b>hi</b>\r\n'
    ),
    messageId: `<${crypto.randomUUID()}@example.com>`,
    created_at: new Date(),
    updated_at: new Date()
  });

  const res = await web.get(`/en/admin/emails/${insertedId}.eml`);
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /^message\/rfc822/);
  t.regex(
    res.headers['content-disposition'],
    new RegExp(`^attachment; filename="${insertedId}\\.eml"`)
  );
});

test.serial(
  'admin domains hides domains whose admins are all banned',
  async (t) => {
    const { web, user, other, tag } = t.context;

    // team plan so a domain can have more than one admin
    for (const u of [user, other]) {
      u.plan = 'team';
      u[config.userFields.planSetAt] = new Date();
      u[config.userFields.planExpiresAt] = new Date(Date.now() + 86_400_000);
    }

    await user.save();
    other[config.userFields.isBanned] = true;
    await other.save();

    const banned = await t.context.domainFactory
      .withState({
        name: `banned-${tag}.example.com`,
        plan: 'free',
        members: [{ user: other._id, group: 'admin' }]
      })
      .create();

    const shared = await t.context.domainFactory
      .withState({
        name: `shared-${tag}.example.com`,
        plan: 'team',
        skip_verification: true,
        members: [
          { user: other._id, group: 'admin' },
          { user: user._id, group: 'admin' }
        ]
      })
      .create();

    for (const query of [
      { name: tag },
      {
        mongodb_query: JSON.stringify({
          name: { $in: [banned.name, shared.name] }
        })
      }
    ]) {
      const res = await web
        .get('/en/admin/domains')
        .query(query)
        .set('Accept', 'application/json');
      t.is(res.status, 200);
      t.false(res.body.table.includes(banned.name));
      t.true(res.body.table.includes(shared.name));
    }
  }
);
