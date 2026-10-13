/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// SMTP auto-approval and the domain check: a domain the domain check
// flagged waits for a manual review. The models and the mailer are stubbed
// so the real helper runs end to end on a domain whose DNS records verify.
//

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const test = require('ava');

function stubModule(id, exports) {
  const filename = require.resolve(id);
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports
  };
}

stubModule('#models/domains', {
  async verifySMTP() {
    return {
      ns: ['ns1.example.net'],
      dkim: true,
      returnPath: true,
      dmarc: true,
      strictDmarc: true,
      spf: true,
      autoconfig: false,
      autodiscover: false,
      hasLegitimateHosting: true,
      errors: []
    };
  },
  find: () => ({
    select: () => ({ lean: () => ({ exec: async () => [] }) })
  }),
  async getToAndMajorityLocaleByDomain() {
    return { to: ['admin@example.com'], locale: 'en' };
  }
});
stubModule('#models/users', {});
const sent = [];
stubModule('#helpers/email', async (options) => {
  sent.push(options);
});

const checkAndAutoApproveSMTP = require('#helpers/check-and-auto-approve-smtp');
const { setDomainCheckVerdict } = require('#helpers/domain-check-verdict');

function domain() {
  return {
    _id: 'domain-id',
    name: 'example.com',
    has_smtp: false,
    async save() {
      this.saved = true;
    }
  };
}

const user = { id: 'user-id', has_passed_kyc: false };

test('a verified domain on a good TLD with hosting is auto-approved', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  const result = await checkAndAutoApproveSMTP({
    domain: domain(),
    resolver: {},
    client,
    user
  });
  t.true(result.isAutoApproved);
  t.deepEqual(result.flaggedCategories, []);
});

test('a domain the domain check flagged is not auto-approved', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  await setDomainCheckVerdict(client, 'domain-id', ['phishing']);

  const flagged = domain();
  const result = await checkAndAutoApproveSMTP({
    domain: flagged,
    resolver: {},
    client,
    user
  });
  t.false(result.isAutoApproved);
  t.false(flagged.has_smtp);
  t.deepEqual(result.flaggedCategories, ['phishing']);

  // (a user who passed KYC is still approved, as for the review alerts)
  const kyc = await checkAndAutoApproveSMTP({
    domain: domain(),
    resolver: {},
    client,
    user: { ...user, has_passed_kyc: true }
  });
  t.true(kyc.isAutoApproved);
  // (and the auto-approval notice says what the domain was flagged for)
  await new Promise((resolve) => {
    setImmediate(resolve);
  });
  t.true(
    sent.some((options) =>
      options.locals?.message?.includes(
        'Flagged by Domain Check:</strong> phishing'
      )
    )
  );
});

test('a domain whose verdict cannot be read is not auto-approved', async (t) => {
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  client.get = async () => {
    throw new Error('connection lost');
  };

  const unknown = domain();
  const result = await checkAndAutoApproveSMTP({
    domain: unknown,
    resolver: {},
    client,
    user
  });
  t.false(result.isAutoApproved);
  t.false(unknown.has_smtp);
  t.deepEqual(result.flaggedCategories, ['domain_check_unavailable']);
});

test('a domain whose verdict is missing its store or garbled is not auto-approved', async (t) => {
  const garbled = new Redis({ keyPrefix: `${randomUUID()}:` });
  await garbled.set('domain_check_verdict:domain-id', 'not json');
  const wrongShape = new Redis({ keyPrefix: `${randomUUID()}:` });
  await wrongShape.set('domain_check_verdict:domain-id', '{"flags":["x"]}');

  for (const client of [undefined, garbled, wrongShape]) {
    const unknown = domain();
    const result = await checkAndAutoApproveSMTP({
      domain: unknown,
      resolver: {},
      client,
      user
    });
    t.false(result.isAutoApproved);
    t.false(unknown.has_smtp);
    t.deepEqual(result.flaggedCategories, ['domain_check_unavailable']);
  }
});

test('a verdict is kept for months, and a new domain is held while it is checked', async (t) => {
  const ms = require('ms');
  const {
    setDomainCheckPending,
    PENDING
  } = require('#helpers/domain-check-verdict');
  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  await setDomainCheckVerdict(client, 'domain-id', ['gambling']);
  t.true(
    (await client.pttl('domain_check_verdict:domain-id')) > ms('180d'),
    'kept until a check clears it'
  );

  const pending = new Redis({ keyPrefix: `${randomUUID()}:` });
  await setDomainCheckPending(pending, 'domain-id');
  const held = domain();
  const result = await checkAndAutoApproveSMTP({
    domain: held,
    resolver: {},
    client: pending,
    user
  });
  t.false(result.isAutoApproved);
  t.deepEqual(result.flaggedCategories, [PENDING]);

  // (a verdict with no categories is none)
  const empty = new Redis({ keyPrefix: `${randomUUID()}:` });
  await empty.set('domain_check_verdict:domain-id', '{"categories":[]}');
  const approved = await checkAndAutoApproveSMTP({
    domain: domain(),
    resolver: {},
    client: empty,
    user
  });
  t.true(approved.isAutoApproved);
});
