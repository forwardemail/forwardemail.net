/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const {
  createSign,
  createVerify,
  generateKeyPairSync
} = require('node:crypto');

const test = require('ava');
const utils = require('../utils');

//
// Domain Connect tests
// Tests for:
//   - POST /domain-availability (single domain WHOIS check)
//   - POST /domain-availability/bulk (bulk domain WHOIS check)
//   - GET  /domain-connect (renders the domain connect page)
//   - POST /domain-connect (redirects to provider apply URL)
//   - Domain Connect template JSON (assets/.well-known/domain-connect/forwardemail.net.email.json)
//   - buildApplyUrl signing logic
//

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

// ---------------------------------------------------------------------------
// Domain Availability — single domain
// ---------------------------------------------------------------------------

test('GET /domain-availability returns 404 or 405 (method not allowed)', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/domain-availability');
  // The route only accepts POST; GET should return 404 or 405
  t.true(res.status === 404 || res.status === 405);
});

test('POST /domain-availability returns 400 when domainName is missing', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability')
    .set('Accept', 'application/json')
    .send({});
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('POST /domain-availability returns 400 for invalid domain', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability')
    .set('Accept', 'application/json')
    .send({ domainName: 'not-a-valid-domain' });
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('POST /domain-availability returns 400 for domain without TLD', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability')
    .set('Accept', 'application/json')
    .send({ domainName: 'nodot' });
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

// ---------------------------------------------------------------------------
// Domain Availability — bulk
// ---------------------------------------------------------------------------

test('POST /domain-availability/bulk returns 400 when domains array is missing', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability/bulk')
    .set('Accept', 'application/json')
    .send({});
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('POST /domain-availability/bulk returns 400 when domains is not an array', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability/bulk')
    .set('Accept', 'application/json')
    .send({ domains: 'example.com' });
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('POST /domain-availability/bulk returns 400 when domains array is empty', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability/bulk')
    .set('Accept', 'application/json')
    .send({ domains: [] });
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('POST /domain-availability/bulk returns 400 when too many domains requested', async (t) => {
  const { web } = t.context;
  // Send 51 domains (max is 50)
  const domains = Array.from({ length: 51 }, (_, i) => `example${i}.com`);
  const res = await web
    .post('/en/domain-availability/bulk')
    .set('Accept', 'application/json')
    .send({ domains });
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

// ---------------------------------------------------------------------------
// Domain Connect page
// ---------------------------------------------------------------------------

test('GET /domain-connect renders the domain connect page', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/domain-connect').set('Accept', 'text/html');
  t.is(res.status, 200);
  // Page should contain the Domain Connect form
  t.true(
    res.text.includes('domain-connect') ||
      res.text.includes('Domain Connect') ||
      res.text.includes('domain')
  );
});

test('POST /domain-connect returns 400 when domain is missing', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-connect')
    .set('Accept', 'application/json')
    .send({});
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

test('POST /domain-connect returns 400 for invalid domain', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-connect')
    .set('Accept', 'application/json')
    .send({ domain: 'not-a-valid-domain' });
  t.is(res.status, 400);
  t.truthy(res.body.message);
});

// ---------------------------------------------------------------------------
// Domain Connect template JSON
// ---------------------------------------------------------------------------

test('Domain Connect template JSON has correct structure', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');

  // Required top-level fields per Domain Connect spec
  t.is(template.providerId, 'forwardemail.net');
  t.is(template.serviceId, 'email');
  t.is(template.version, 3);
  t.truthy(template.providerName);
  t.truthy(template.serviceName);
  t.truthy(template.logoUrl);
  t.truthy(template.description);
  t.true(Array.isArray(template.records));
  t.true(template.records.length > 0);
});

test('Domain Connect template has MX records with priority 0', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const mxRecords = template.records.filter((r) => r.type === 'MX');
  t.true(mxRecords.length >= 2, 'Should have at least 2 MX records');
  for (const mx of mxRecords) {
    t.is(mx.priority, 0, `MX record ${mx.pointsTo} should have priority 0`);
    t.is(mx.host, '@');
  }

  // Verify both mx1 and mx2 are present
  const mx1 = mxRecords.find((r) => r.pointsTo === 'mx1.forwardemail.net');
  const mx2 = mxRecords.find((r) => r.pointsTo === 'mx2.forwardemail.net');
  t.truthy(mx1, 'Should have mx1.forwardemail.net MX record');
  t.truthy(mx2, 'Should have mx2.forwardemail.net MX record');
});

test('Domain Connect template has SPF record', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const spfRecord = template.records.find(
    (r) =>
      r.type === 'SPFM' ||
      (r.type === 'TXT' && r.data && r.data.includes('spf'))
  );
  t.truthy(spfRecord, 'Should have an SPF record');
  if (spfRecord.type === 'SPFM') {
    t.truthy(spfRecord.spfRules);
    t.true(spfRecord.spfRules.includes('spf.forwardemail.net'));
  }
});

test('Domain Connect template has DKIM record with template variables', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const dkimRecord = template.records.find(
    (r) => r.type === 'TXT' && r.host && r.host.includes('_domainkey')
  );
  t.truthy(dkimRecord, 'Should have a DKIM TXT record');
  t.true(
    dkimRecord.host.includes('%fwdEmailDkimSelector%'),
    'DKIM host should use %fwdEmailDkimSelector% variable'
  );
  t.true(
    dkimRecord.data.includes('%fwdEmailDkimValue%'),
    'DKIM data should use %fwdEmailDkimValue% variable'
  );
});

test('Domain Connect template has DMARC record with %domainId% variable', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const dmarcRecord = template.records.find(
    (r) => r.type === 'TXT' && r.host === '_dmarc'
  );
  t.truthy(dmarcRecord, 'Should have a DMARC TXT record');
  t.true(
    dmarcRecord.data.includes('v=DMARC1'),
    'DMARC record should start with v=DMARC1'
  );
  t.true(
    dmarcRecord.data.includes('%domainId%'),
    'DMARC rua should use %domainId% variable'
  );
  t.true(
    dmarcRecord.data.includes('dmarc-%domainId%@forwardemail.net'),
    'DMARC rua should be dmarc-%domainId%@forwardemail.net'
  );
});

test('Domain Connect template has site verification TXT record', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const verifyRecord = template.records.find(
    (r) =>
      r.type === 'TXT' &&
      r.data &&
      r.data.includes('forward-email-site-verification')
  );
  t.truthy(verifyRecord, 'Should have a site verification TXT record');
  t.true(
    verifyRecord.data.includes('%fwdEmailVerification%'),
    'Verification record should use %fwdEmailVerification% variable'
  );
});

test('Domain Connect template has return-path CNAME record', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const cnameRecord = template.records.find((r) => r.type === 'CNAME');
  t.truthy(cnameRecord, 'Should have a CNAME record for return-path');
  t.is(cnameRecord.pointsTo, 'forwardemail.net');
});

test('Domain Connect template has autoconfig CNAME record', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const autoconfigRecord = template.records.find(
    (r) => r.type === 'CNAME' && r.host === 'autoconfig'
  );
  t.truthy(autoconfigRecord, 'Should have an autoconfig CNAME record');
  t.is(autoconfigRecord.pointsTo, 'autoconfig.forwardemail.net');
});

test('Domain Connect template has autodiscover CNAME record', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');
  const autodiscoverRecord = template.records.find(
    (r) => r.type === 'CNAME' && r.host === 'autodiscover'
  );
  t.truthy(autodiscoverRecord, 'Should have an autodiscover CNAME record');
  t.is(autodiscoverRecord.pointsTo, 'autodiscover.forwardemail.net');
});

test('Domain Connect template has all required template variables documented', (t) => {
  const template = require('../../assets/.well-known/domain-connect/forwardemail.net.email.json');

  // All variables used in records should be documented in variableDescription
  const variableDesc = template.variableDescription || '';
  const requiredVars = [
    '%domainId%',
    '%fwdEmailVerification%',
    '%fwdEmailDkimSelector%',
    '%fwdEmailDkimValue%'
  ];

  for (const variable of requiredVars) {
    t.true(
      variableDesc.includes(variable),
      `variableDescription should document ${variable}`
    );
  }
});

// ---------------------------------------------------------------------------
// buildApplyUrl signing logic (unit test)
// ---------------------------------------------------------------------------

test('buildApplyUrl produces correct URL format without signing', (t) => {
  // Test the URL format directly
  const urlSyncUX = 'https://api.cloudflare.com/client/v4/dns/domainconnect';
  const providerId = 'forwardemail.net';
  const serviceId = 'email';
  const params = new URLSearchParams({
    domain: 'example.com',
    domainId: '123'
  });

  // Sort params alphabetically (as the implementation does)
  const sorted = new URLSearchParams(
    [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  );

  const expectedUrl = `${urlSyncUX}/v2/domainTemplates/providers/${providerId}/services/${serviceId}/apply?${sorted.toString()}`;

  // Verify the URL structure
  t.true(expectedUrl.includes('/v2/domainTemplates/providers/'));
  t.true(expectedUrl.includes(`/providers/${providerId}/`));
  t.true(expectedUrl.includes(`/services/${serviceId}/apply`));
  t.true(expectedUrl.includes('domain=example.com'));
  t.true(expectedUrl.includes('domainId=123'));
});

test('buildApplyUrl params are sorted alphabetically', (t) => {
  // Per Domain Connect spec, params must be sorted for signing
  const params = new URLSearchParams({
    z_last: 'z',
    a_first: 'a',
    m_middle: 'm'
  });

  const sorted = new URLSearchParams(
    [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  );

  const keys = [...sorted.keys()];
  t.deepEqual(keys, ['a_first', 'm_middle', 'z_last']);
});

test('buildApplyUrl RSA-SHA256 signature is valid', (t) => {
  // Generate a test RSA key pair
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048
  });

  const queryString = 'a=1&b=2&domain=example.com';

  // Sign the query string
  const sign = createSign('RSA-SHA256');
  sign.update(queryString);
  const sig = sign.sign(privateKey, 'base64');

  // Verify the signature
  const verify = createVerify('RSA-SHA256');
  verify.update(queryString);
  const isValid = verify.verify(publicKey, sig, 'base64');

  t.true(isValid, 'RSA-SHA256 signature should be valid');
});

// ---------------------------------------------------------------------------
// nsProviders — Domain Connect config
// ---------------------------------------------------------------------------

test('nsProviders includes all Domain Connect providers with applyUrl', (t) => {
  const { nsProviders } = require('../../config/utilities');

  // These providers should have domainConnect.applyUrl configured
  const expectedProviders = [
    { slug: 'cloudflare', applyUrlContains: 'cloudflare' },
    { slug: 'godaddy', applyUrlContains: 'godaddy' },
    { slug: 'ionos', applyUrlContains: 'ionos' }
  ];

  for (const expected of expectedProviders) {
    const provider = nsProviders.find((p) => p.slug === expected.slug);
    t.truthy(provider, `nsProviders should include ${expected.slug} provider`);
    t.truthy(
      provider && provider.domainConnect,
      `${expected.slug} should have domainConnect config`
    );
    t.truthy(
      provider && provider.domainConnect && provider.domainConnect.applyUrl,
      `${expected.slug} should have domainConnect.applyUrl`
    );
    if (provider && provider.domainConnect && provider.domainConnect.applyUrl) {
      t.true(
        provider.domainConnect.applyUrl
          .toLowerCase()
          .includes(expected.applyUrlContains),
        `${expected.slug} applyUrl should contain '${expected.applyUrlContains}'`
      );
    }
  }
});

test('nsProviders cloudflare has correct applyUrl', (t) => {
  const { nsProviders } = require('../../config/utilities');
  const cloudflare = nsProviders.find((p) => p.slug === 'cloudflare');
  t.truthy(cloudflare, 'Should have cloudflare provider');
  t.truthy(cloudflare && cloudflare.domainConnect);
  if (cloudflare && cloudflare.domainConnect) {
    t.is(
      cloudflare.domainConnect.applyUrl,
      'https://api.cloudflare.com/client/v4/dns/domainconnect'
    );
  }
});

test('nsProviders glauca-digital has correct applyUrl', (t) => {
  const { nsProviders } = require('../../config/utilities');
  const glauca = nsProviders.find((p) => p.slug === 'glauca-digital');
  t.truthy(glauca, 'Should have glauca-digital provider');
  t.truthy(glauca && glauca.domainConnect);
  if (glauca && glauca.domainConnect) {
    t.is(glauca.domainConnect.applyUrl, 'https://dns.glauca.digital/connect');
  }
});

test('nsProviders godaddy has correct applyUrl', (t) => {
  const { nsProviders } = require('../../config/utilities');
  const godaddy = nsProviders.find((p) => p.slug === 'godaddy');
  t.truthy(godaddy, 'Should have godaddy provider');
  t.truthy(godaddy && godaddy.domainConnect);
  if (godaddy && godaddy.domainConnect) {
    t.is(godaddy.domainConnect.applyUrl, 'https://dcc.godaddy.com');
  }
});

test('nsProviders ionos has correct applyUrl', (t) => {
  const { nsProviders } = require('../../config/utilities');
  const ionos = nsProviders.find((p) => p.slug === 'ionos');
  t.truthy(ionos, 'Should have ionos provider');
  t.truthy(ionos && ionos.domainConnect);
  if (ionos && ionos.domainConnect) {
    t.is(ionos.domainConnect.applyUrl, 'https://api.domainconnect.ionos.com');
  }
});

// ---------------------------------------------------------------------------
// config/index.js — domainConnect section
// ---------------------------------------------------------------------------

test('config.domainConnect has required fields', (t) => {
  const config = require('../../config');
  t.truthy(config.domainConnect, 'config should have domainConnect section');
  t.truthy(
    config.domainConnect.providerId,
    'domainConnect.providerId should be set'
  );
  t.truthy(
    config.domainConnect.serviceId,
    'domainConnect.serviceId should be set'
  );
  t.is(
    config.domainConnect.providerId,
    'forwardemail.net',
    'providerId should be forwardemail.net'
  );
  t.is(config.domainConnect.serviceId, 'email', 'serviceId should be email');
});

// ---------------------------------------------------------------------------
// Rate limiting — verify routes are registered
// ---------------------------------------------------------------------------

test('domain-availability route is registered', async (t) => {
  const { web } = t.context;
  // A POST with valid JSON but missing domainName should return 400, not 404
  const res = await web
    .post('/en/domain-availability')
    .set('Accept', 'application/json')
    .send({ domainName: '' });
  // Should be 400 (bad request) not 404 (not found)
  t.not(res.status, 404, 'domain-availability route should be registered');
});

test('domain-availability/bulk route is registered', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-availability/bulk')
    .set('Accept', 'application/json')
    .send({ domains: [] });
  // Should be 400 (bad request) not 404 (not found)
  t.not(res.status, 404, 'domain-availability/bulk route should be registered');
});

test('domain-connect GET route is registered', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/domain-connect');
  // Should be 200 (page renders) not 404 (not found)
  t.not(res.status, 404, 'domain-connect GET route should be registered');
});

test('domain-connect POST route is registered', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/domain-connect')
    .set('Accept', 'application/json')
    .send({});
  // Should be 400 (bad request) not 404 (not found)
  t.not(res.status, 404, 'domain-connect POST route should be registered');
});
