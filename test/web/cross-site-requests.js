/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Pages that another site can link a logged in user to: session cookies
// (SameSite=Lax) are sent with a top-level GET from any site, so such a GET
// must not change the account, and values from its querystring are escaped.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Domains, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  user.plan = 'enhanced_protection';
  user[config.userFields.planSetAt] = new Date();
  user[config.userFields.planExpiresAt] = new Date(Date.now() + 86_400_000);
  t.context.user = await user.save();

  await utils.setupWebServer(t);
  await utils.loginUser(t);

  t.context.domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
});
test.afterEach.always(utils.teardownWebServer);

test('a plan change from a link on another site is asked about, not made', async (t) => {
  const { web, domain } = t.context;

  for (const site of ['cross-site', 'same-site']) {
    const res = await web
      .get(`/en/my-account/domains/${domain.name}/billing`)
      .query({ plan: 'free' })
      .set('Accept', 'text/html')
      .set('Sec-Fetch-Site', site);
    t.is(res.status, 302);
    const fresh = await Domains.findById(domain._id).lean().exec();
    t.is(fresh.plan, 'enhanced_protection');

    // the next page asks, with a link (on this site) that makes the change
    const page = await web.get(res.headers.location).set('Accept', 'text/html');
    t.true(
      page.text.includes(
        `/en/my-account/domains/${domain.name}/billing?plan=free`
      )
    );
  }

  // a browser without Sec-Fetch-Site is checked by the Referer
  {
    const res = await web
      .get(`/en/my-account/domains/${domain.name}/billing`)
      .query({ plan: 'free' })
      .set('Accept', 'text/html')
      .set('Referer', 'https://evil.example/');
    t.is(res.status, 302);
    const fresh = await Domains.findById(domain._id).lean().exec();
    t.is(fresh.plan, 'enhanced_protection');
  }

  // a click on this site still changes the plan
  const res = await web
    .get(`/en/my-account/domains/${domain.name}/billing`)
    .query({ plan: 'free' })
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 302);
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'free');
});

test('the new alias notice escapes the address from the querystring', async (t) => {
  const { web, domain, user } = t.context;
  await t.context.aliasFactory
    .withState({
      name: 'hello',
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const address = `"<meta http-equiv=refresh content='0;url=//evil.example'>"@${domain.name}`;
  const res = await web
    .get(`/en/my-account/domains/${domain.name}/aliases`)
    .query({ new: address })
    .set('Accept', 'text/html');
  t.is(res.status, 200);
  t.true(res.text.includes('You successfully created a new alias'));
  t.false(res.text.includes('<meta http-equiv=refresh'));
  t.true(res.text.includes('&lt;meta http-equiv=refresh'));
});
