/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const test = require('ava');
const falso = require('@ngneat/falso');

const utils = require('../utils');
const config = require('#config');
const { Users } = require('#models');

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
