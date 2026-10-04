/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The FAQ shows its examples with the visitor's own domain and address
// ("example.com" and "user@gmail.com"), and leaves everything else as it is
// (e.g. it once turned "admin" into part of the address, so "your domain's
// admin" read "your domain's first.last").
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

// the structured data and the <head> are never changed
const structuredData = (html) =>
  (
    html.match(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g) || []
  ).join('');

test('examples show the visitor’s domain and address, and nothing else changes', async (t) => {
  const anonymous = await t.context.web.get('/en/faq');
  t.is(anonymous.status, 200);

  const local = `first.last${randomUUID().slice(0, 4)}`;
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory
    .withState({ email: `${local}@mailbox-example.org` })
    .make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await utils.loginUser(t);
  const name = `my-${randomUUID().slice(0, 8)}.org`;
  await t.context.domainFactory
    .withState({
      name,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'free',
      skip_verification: true
    })
    .create();

  const res = await t.context.web.get('/en/faq');
  t.is(res.status, 200);
  const html = res.text;
  const email = `${local}@mailbox-example.org`;

  // the examples
  t.true(html.includes(`forward-email=${email}`));
  t.true(html.includes(`${local}+a@mailbox-example.org`));
  t.true(html.includes(`hello@${name}`));
  t.true(html.includes(`href="mailto:${email}"`));

  // other words and addresses are left as they are
  t.false(html.includes(`${local}istrators`));
  t.false(html.includes(`${local}s `));
  t.false(html.includes(`${local}.google.com`));
  t.false(html.includes(`${local}.microsoft.com`));
  t.true(html.includes('domain administrators'));
  t.true(html.includes('https://admin.google.com'));
  t.true(html.includes('first@gmail.com'));
  t.false(html.includes(`first@mailbox-example.org`));

  // the structured data is the same as for anyone
  t.is(structuredData(html), structuredData(anonymous.text));
  t.false(structuredData(html).includes(local));

  // and the pricing link has one query string
  t.true(
    html.includes(`/private-business-email?domain=${name}&amp;pricing=true`)
  );
});

test('an address given in the link is escaped', async (t) => {
  const res = await t.context.web.get(
    `/en/faq?email=${encodeURIComponent('a&b@mailbox-example.org')}`
  );
  t.is(res.status, 200);
  t.true(res.text.includes('forward-email=a&amp;b@mailbox-example.org'));
  t.false(res.text.includes('forward-email=a&b@mailbox-example.org'));
  // and the Encrypt button encrypts the address itself (escaped once)
  t.true(
    res.text.includes(
      'name="input" value="forward-email=a&amp;b@mailbox-example.org"'
    )
  );
  t.false(res.text.includes('&amp;amp;'));
});
