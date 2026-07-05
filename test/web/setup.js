/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const falso = require('@ngneat/falso');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users, Domains } = require('#models');
const { resetSetupComplete } = require('#helpers/is-setup-complete');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownWebServer);

// these tests flip the runtime config.isSelfHosted flag and the module-level
// setup-complete cache, so they must run serially
test.serial('setup wizard is not exposed when not self-hosted', async (t) => {
  const { web } = t.context;

  t.false(Boolean(config.isSelfHosted));

  const res = await web.get('/en/setup');
  t.is(res.status, 404);

  // and no first-run redirect happens either
  const home = await web.get('/en');
  t.not(home.header.location, '/en/setup');
});

test.serial(
  'self-hosted first-run: redirect, admin registration, domain, dns checklist',
  async (t) => {
    const { web } = t.context;

    config.isSelfHosted = true;
    resetSetupComplete();

    try {
      // no admin exists yet: browser traffic funnels to the wizard
      const home = await web.get('/en');
      t.is(home.status, 302);
      t.is(home.header.location, '/en/setup');

      // wizard step 1 renders
      const step1 = await web.get('/en/setup');
      t.is(step1.status, 200);

      // first registered user becomes the admin on the team plan
      const email = `admin-${Date.now()}@example.com`;
      const register = await web.post('/en/register').send({
        email,
        password: falso.randPassword()
      });
      t.is(register.status, 302);

      const user = await Users.findOne({ email });
      t.is(user.group, 'admin');
      t.is(user.plan, 'team');

      // the first-run gate flips: no more redirect to /setup
      const homeAfter = await web.get('/en');
      t.not(homeAfter.header.location, '/en/setup');

      // wizard dispatch: admin with no domains goes to step 2
      const dispatch = await web.get('/en/setup');
      t.is(dispatch.status, 302);
      t.is(dispatch.header.location, '/en/setup/domain');

      const step2 = await web.get('/en/setup/domain');
      t.is(step2.status, 200);

      // create the first domain and stay in the wizard
      const domainName = `${falso.randWord().toLowerCase()}-selfhosted.com`;
      const createDomain = await web.post('/en/setup/domain').send({
        domain: domainName
      });
      t.is(createDomain.status, 302);
      t.is(createDomain.header.location, `/en/setup/dns/${domainName}`);

      const domain = await Domains.findOne({ name: domainName });
      t.truthy(domain);
      t.is(domain.plan, 'team');

      // dispatch now routes to step 3
      const dispatchAfterDomain = await web.get('/en/setup');
      t.is(dispatchAfterDomain.status, 302);
      t.is(dispatchAfterDomain.header.location, `/en/setup/dns/${domainName}`);

      // the dns checklist JSON endpoint returns the record list
      const dns = await web
        .get(`/en/setup/dns/${domainName}`)
        .set('Accept', 'application/json');
      t.is(dns.status, 200);
      const body = JSON.parse(dns.text);
      t.true(Array.isArray(body.checklist));
      const keys = new Set(body.checklist.map((record) => record.key));
      for (const key of [
        'a',
        'mx',
        'txt',
        'spf',
        'dkim',
        'return_path',
        'dmarc',
        'ptr'
      ])
        t.true(keys.has(key), `missing checklist key ${key}`);

      // a brand-new domain has no records in real DNS
      t.false(body.complete);
    } finally {
      config.isSelfHosted = false;
      resetSetupComplete();
    }
  }
);
