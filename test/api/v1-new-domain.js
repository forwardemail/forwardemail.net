/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A free-plan domain registered within the past 90 days is created when its
// past could not be checked yet (the MX server checks it again on each
// message), and not when it was in use before. Its WHOIS/RDAP lookup is
// cached beforehand, and the web archive is a local stand-in.
//

const http = require('node:http');
const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const getPreviousDomainUse = require('#helpers/get-previous-domain-use');
const { Domains } = require('#models');

// (the capture index: a capture's time, "error", or none)
const answers = new Map();
let server;
let CDX_URL;

test.before(utils.setupMongoose);
test.before(async () => {
  server = http.createServer((req, res) => {
    const domain = new URL(req.url, 'http://localhost').searchParams.get('url');
    if (answers.get(domain) === 'error') {
      res.writeHead(503);
      res.end();
      return;
    }

    res.writeHead(200);
    res.end(
      JSON.stringify(
        answers.has(domain) ? [['timestamp'], [answers.get(domain)]] : []
      )
    );
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  CDX_URL = getPreviousDomainUse.CDX_URL;
  getPreviousDomainUse.CDX_URL = `http://127.0.0.1:${server.address().port}/`;
});
test.after.always(() => {
  getPreviousDomainUse.CDX_URL = CDX_URL;
  server.close();
});
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  t.context.user = await user.save();
});
test.afterEach.always(utils.teardownApiServer);

// (a .com registered 30 days ago, created on the free plan)
async function createNewDomain(t, capture) {
  const domain = `${randomUUID().slice(0, 8)}.com`;
  if (capture) answers.set(domain, capture);
  // (Cloudflare is not asked: a failed lookup is kept for a few minutes)
  await t.context.client.set(`new_domain_dns_error:${domain}`, '1');
  await t.context.client.set(
    `whois:${domain}`,
    JSON.stringify({
      found: true,
      status: [],
      registrar: { id: 1, name: 'Example Registrar, Inc.' },
      ts: {
        created: new Date(Date.now() - ms('30d')),
        expires: new Date(Date.now() + ms('335d'))
      }
    })
  );
  const res = await t.context.api
    .post('/v1/domains')
    .auth(t.context.user[config.userFields.apiToken])
    .send({ domain, plan: 'free' });
  return { domain, res };
}

test('creates a new domain whose past could not be checked yet', async (t) => {
  const { domain, res } = await createNewDomain(t, 'error');
  t.is(res.status, 200);
  t.is(res.body.name, domain);
  t.is(await Domains.countDocuments({ name: domain, plan: 'free' }), 1);
});

test('does not create a new domain that was in use before', async (t) => {
  const { domain, res } = await createNewDomain(t, '20190101000000');
  t.is(res.status, 400);
  t.regex(res.body.message, /it was in use before then/);
  t.is(await Domains.countDocuments({ name: domain }), 0);
});
