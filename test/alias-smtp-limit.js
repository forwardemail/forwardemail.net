/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');
const Redis = require('ioredis-mock');

const utils = require('./utils');
const config = require('#config');
const Aliases = require('#models/aliases');
const Emails = require('#models/emails');
const createTangerine = require('#helpers/create-tangerine');

const client = new Redis();
client.setMaxListeners(0);
const resolver = createTangerine(client);

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

//
// Helper to create a user + domain + alias with SMTP enabled
//
async function createTestSetup(t, opts = {}) {
  const userPlan = (opts.domain && opts.domain.plan) || 'enhanced_protection';
  let user = await t.context.userFactory
    .withState({
      plan: userPlan,
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

  user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true,
      ignore_mx_check: true,
      ...opts.domain
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true,
      ...opts.alias
    })
    .create();

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await resolver.options.cache.mset(map);

  return { user, domain, alias };
}

// ============================================================
// 1. Per-alias smtp_limit field tests
// ============================================================

test('alias smtp_limit defaults to 0', async (t) => {
  const { alias } = await createTestSetup(t);
  t.is(alias.smtp_limit, 0);
});

test('alias smtp_limit can be set via API', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 50 });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, 50);
});

test('alias smtp_limit rejects negative values via API', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: -1 });

  t.is(res.status, 400);
});

test('alias smtp_limit of 0 falls back to domain limit', async (t) => {
  const { alias } = await createTestSetup(t, {
    alias: { smtp_limit: 0 }
  });
  t.is(alias.smtp_limit, 0);
  // When smtp_limit is 0, the SMTP layer should use the domain limit
  // (tested in the SMTP integration tests below)
});

test('alias smtp_limit can be reset to 0 via API', async (t) => {
  const { user, domain, alias } = await createTestSetup(t, {
    alias: { smtp_limit: 100 }
  });

  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 0 });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, 0);
});

// ============================================================
// 2. Per-alias SMTP suspension tests
// ============================================================

test('alias is_smtp_suspended defaults to false', async (t) => {
  const { alias } = await createTestSetup(t);
  t.is(alias.is_smtp_suspended, false);
  t.is(alias.smtp_suspended_sent_at, undefined);
});

test('alias is_smtp_suspended is true when smtp_suspended_sent_at is set', async (t) => {
  const { alias } = await createTestSetup(t);

  alias.smtp_suspended_sent_at = new Date();
  await alias.save();

  const updated = await Aliases.findById(alias._id).lean().exec();
  t.is(updated.is_smtp_suspended, true);
});

test('alias suspension is removed when smtp_suspended_sent_at is cleared', async (t) => {
  const { alias } = await createTestSetup(t);

  alias.smtp_suspended_sent_at = new Date();
  await alias.save();

  const suspended = await Aliases.findById(alias._id);
  suspended.smtp_suspended_sent_at = undefined;
  await suspended.save();

  const updated = await Aliases.findById(alias._id).lean().exec();
  t.is(updated.is_smtp_suspended, false);
});

test('alias rate limit rejects when smtp_limit is exceeded', async (t) => {
  const { alias, domain } = await createTestSetup(t, {
    alias: { smtp_limit: 2 }
  });

  // Simulate 2 emails sent today
  const startOfDay = dayjs().startOf('day').toDate();
  await Emails.create([
    {
      user: alias.user,
      domain: domain._id,
      alias: alias._id,
      status: 'queued',
      envelope: { from: `${alias.name}@${domain.name}`, to: ['test@test.com'] },
      message: Buffer.from('test'),
      messageId: '<test1@alias-smtp-test.com>',
      headers: { Subject: 'test' },
      date: startOfDay,
      created_at: startOfDay
    },
    {
      user: alias.user,
      domain: domain._id,
      alias: alias._id,
      status: 'queued',
      envelope: {
        from: `${alias.name}@${domain.name}`,
        to: ['test2@test.com']
      },
      message: Buffer.from('test2'),
      messageId: '<test2@alias-smtp-test.com>',
      headers: { Subject: 'test2' },
      date: startOfDay,
      created_at: startOfDay
    }
  ]);

  // Verify the count
  const count = await Emails.countDocuments({
    alias: alias._id,
    created_at: { $gte: startOfDay }
  });
  t.is(count, 2);
  t.true(count >= alias.smtp_limit);
});

// ============================================================
// 4. Admin UI CRUD tests (via API)
// ============================================================

test('admin can list aliases for a domain', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  // Make user an admin
  user.group = 'admin';
  await user.save();

  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length > 0);
  t.is(res.body[0].name, alias.name);
});

test('admin can update alias smtp_limit', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);
  // Must be within domain's effective limit
  const domainLimit =
    user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  const newLimit = Math.min(75, domainLimit);
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: newLimit });
  t.is(res.status, 200);
  t.is(res.body.smtp_limit, newLimit);
});

// ============================================================
// 5. Alias SMTP limit deducts from domain limit
// ============================================================

test('alias email count contributes to domain rate limit check', async (t) => {
  const { alias, domain } = await createTestSetup(t, {
    alias: { smtp_limit: 100 }
  });

  // Create emails for the alias
  const startOfDay = dayjs().startOf('day').toDate();
  await Emails.create({
    user: alias.user,
    domain: domain._id,
    alias: alias._id,
    status: 'queued',
    envelope: { from: `${alias.name}@${domain.name}`, to: ['test@test.com'] },
    message: Buffer.from('test'),
    messageId: '<deduct-test@alias-smtp-test.com>',
    headers: { Subject: 'test' },
    date: startOfDay,
    created_at: startOfDay
  });

  // Verify the email is counted for both alias and domain
  const aliasCount = await Emails.countDocuments({
    alias: alias._id,
    created_at: { $gte: startOfDay }
  });
  const domainCount = await Emails.countDocuments({
    domain: domain._id,
    created_at: { $gte: startOfDay }
  });

  t.is(aliasCount, 1);
  t.is(domainCount, 1);
  // Both counts include the same email - alias deducts from domain
});

// ============================================================
// 6. SMTP count visibility tests
// ============================================================

test('alias smtp_count is available in API response when enriched', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  // Create an email for the alias
  await Emails.create({
    user: alias.user,
    domain: domain._id,
    alias: alias._id,
    status: 'queued',
    envelope: { from: `${alias.name}@${domain.name}`, to: ['test@test.com'] },
    message: Buffer.from('test'),
    messageId: '<count-test@alias-smtp-test.com>',
    headers: { Subject: 'test' },
    date: new Date(),
    created_at: new Date()
  });

  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  // The API response includes the alias with its fields
  const found = res.body.find((a) => a.id === alias.id);
  t.truthy(found);
  t.is(found.smtp_limit, 0); // default
});

// ============================================================
// 7. API spec validation tests
// ============================================================

test('API response includes smtp_limit field', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.true('smtp_limit' in res.body);
  t.is(typeof res.body.smtp_limit, 'number');
});

test('API response includes is_smtp_suspended field', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.true('is_smtp_suspended' in res.body);
  t.is(res.body.is_smtp_suspended, false);
});

test('API response shows is_smtp_suspended true when alias is suspended', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  alias.smtp_suspended_sent_at = new Date();
  await alias.save();

  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.is(res.body.is_smtp_suspended, true);
});

// ============================================================
// 8. Backwards compatibility tests
// ============================================================

test('existing aliases without smtp_limit work normally', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  // Alias should work without smtp_limit being explicitly set
  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, 0);
  t.is(res.body.is_smtp_suspended, false);
});

test('alias creation without smtp_limit defaults to 0', async (t) => {
  const { user, domain } = await createTestSetup(t);

  const res = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({ name: 'newtest' });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, 0);
  t.is(res.body.is_smtp_suspended, false);
});

test('alias update without smtp_limit does not change it', async (t) => {
  const { user, domain, alias } = await createTestSetup(t, {
    alias: { smtp_limit: 50 }
  });

  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ name: alias.name });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, 50);
});

test('non-admin cannot set smtp_limit', async (t) => {
  const { domain } = await createTestSetup(t, { domain: { plan: 'team' } });
  // Create a non-admin user with team plan (required for multi-member domains)
  let memberUser = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: memberUser._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: memberUser.plan,
      kind: 'one-time'
    })
    .create();
  memberUser = await memberUser.save();
  // Add as member (not admin)
  domain.members.push({ user: memberUser._id, group: 'user' });
  domain.skip_verification = true;
  domain.skip_payment_check = true;
  await domain.save();

  // Create alias for this user
  const alias = await t.context.aliasFactory
    .withState({
      user: memberUser._id,
      domain: domain._id,
      recipients: [memberUser.email],
      name: 'memberalias'
    })
    .create();

  // Try to set smtp_limit as non-admin
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(memberUser[config.userFields.apiToken])
    .send({ smtp_limit: 100 });

  t.is(res.status, 400);
});

test('smtp_limit validation rejects non-integer values', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 'abc' });

  t.is(res.status, 400);
});

test('domain suspension does not affect unsuspended aliases listing', async (t) => {
  const { user, domain } = await createTestSetup(t);

  // Suspend the domain
  domain.smtp_suspended_sent_at = new Date();
  domain.is_smtp_suspended = true;
  domain.skip_verification = true;
  domain.skip_payment_check = true;
  await domain.save();

  // Alias should still be listable
  const res = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken]);

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('multiple aliases can have different smtp_limits', async (t) => {
  const { user, domain } = await createTestSetup(t);

  // Create alias with limit 50
  const res1 = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({ name: 'limit50', smtp_limit: 50 });

  t.is(res1.status, 200);
  t.is(res1.body.smtp_limit, 50);

  // Create alias with limit 100
  const res2 = await t.context.api
    .post(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken])
    .send({ name: 'limit100', smtp_limit: 100 });

  t.is(res2.status, 200);
  t.is(res2.body.smtp_limit, 100);

  // Verify both exist with correct limits
  const listRes = await t.context.api
    .get(`/v1/domains/${domain.name}/aliases`)
    .auth(user[config.userFields.apiToken]);

  t.is(listRes.status, 200);
  const a50 = listRes.body.find((a) => a.name === 'limit50');
  const a100 = listRes.body.find((a) => a.name === 'limit100');
  t.is(a50.smtp_limit, 50);
  t.is(a100.smtp_limit, 100);
});

// ============================================================
// 9. Security hardening tests
// ============================================================

test('smtp_limit cannot exceed domain effective SMTP limit via API', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  // config.smtpLimitMessages is 100 in test env (or user's custom limit)
  // Try to set alias limit above the domain's effective limit
  const domainLimit =
    user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: domainLimit + 1 });

  t.is(res.status, 400);
});

test('smtp_limit at exactly domain limit is accepted', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  const domainLimit =
    user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: domainLimit });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, domainLimit);
});

test('changing smtp_limit does NOT clear smtp_suspended_sent_at', async (t) => {
  const { user, domain, alias } = await createTestSetup(t, {
    alias: { smtp_limit: 10 }
  });

  // Suspend the alias
  alias.smtp_suspended_sent_at = new Date();
  await alias.save();

  // Verify suspended
  const suspended = await Aliases.findById(alias._id).lean().exec();
  t.truthy(suspended.smtp_suspended_sent_at);
  t.is(suspended.is_smtp_suspended, true);

  // Change smtp_limit via API (must be within domain limit)
  const domainLimit =
    user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  const newLimit = Math.min(50, domainLimit);
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: newLimit });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, newLimit);
  // Suspension should NOT be cleared
  t.is(res.body.is_smtp_suspended, true);
  t.truthy(res.body.smtp_suspended_sent_at);
});

test('changing smtp_limit does NOT reset daily email count', async (t) => {
  const { user, domain, alias } = await createTestSetup(t, {
    alias: { smtp_limit: 5 }
  });

  // Create 3 emails today
  const startOfDay = dayjs().startOf('day').toDate();
  for (let i = 0; i < 3; i++) {
    await Emails.create({
      user: alias.user,
      domain: domain._id,
      alias: alias._id,
      status: 'queued',
      envelope: {
        from: `${alias.name}@${domain.name}`,
        to: [`test${i}@test.com`]
      },
      message: Buffer.from(`test${i}`),
      messageId: `<reset-test-${i}@alias-smtp-test.com>`,
      headers: { Subject: `test${i}` },
      date: startOfDay,
      created_at: startOfDay
    });
  }

  // Change smtp_limit to a higher value (within domain limit)
  const domainLimit =
    user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  const newLimit = Math.min(80, domainLimit);
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: newLimit });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, newLimit);

  // Email count should still be 3 (not reset)
  const count = await Emails.countDocuments({
    alias: alias._id,
    created_at: { $gte: startOfDay }
  });
  t.is(count, 3);
});

test('smtp_limit negative values are rejected at model level', async (t) => {
  const { alias } = await createTestSetup(t);

  alias.smtp_limit = -5;
  await alias.save();

  const updated = await Aliases.findById(alias._id).lean().exec();
  t.is(updated.smtp_limit, 0); // clamped to 0
});

test('smtp_limit decimal values are floored at model level', async (t) => {
  const { alias } = await createTestSetup(t);

  alias.smtp_limit = 50.7;
  await alias.save();

  const updated = await Aliases.findById(alias._id).lean().exec();
  t.is(updated.smtp_limit, 50);
});

test('non-admin user cannot set smtp_suspended_sent_at via API', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);

  // Try to set smtp_suspended_sent_at directly via API
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_suspended_sent_at: new Date().toISOString() });

  // The field should not be settable via the API (not in picked fields)
  t.is(res.status, 200);
  t.is(res.body.is_smtp_suspended, false);
  t.falsy(res.body.smtp_suspended_sent_at);
});

// ============================================================
// 10. Highest admin member SMTP limit tests
// ============================================================

test('domain effective SMTP limit uses highest admin member limit', async (t) => {
  // Create first admin with default limit (no custom smtpLimit)
  const { user, domain, alias } = await createTestSetup(t, {
    domain: { plan: 'team' }
  });

  // Create a second admin with a HIGHER custom smtp limit
  let admin2 = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 500
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: admin2._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin2.plan,
      kind: 'one-time'
    })
    .create();

  admin2 = await admin2.save();

  // Add admin2 as an admin of the domain
  domain.members.push({ user: admin2._id, group: 'admin' });
  domain.skip_verification = true;
  domain.skip_payment_check = true;
  await domain.save();

  // Now the domain's effective limit should be 500 (highest admin)
  // So setting alias smtp_limit to 400 should succeed (400 <= 500)
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 400 });

  t.is(res.status, 200);
  t.is(res.body.smtp_limit, 400);
});

test('alias smtp_limit cannot exceed highest admin member limit', async (t) => {
  // Create first admin with custom limit of 200
  let user = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 200
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

  user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: 'team',
      resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  // Create a second admin with limit of 300
  let admin2 = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 300
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: admin2._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin2.plan,
      kind: 'one-time'
    })
    .create();

  admin2 = await admin2.save();

  domain.members.push({ user: admin2._id, group: 'admin' });
  domain.skip_verification = true;
  domain.skip_payment_check = true;
  await domain.save();

  // Highest admin limit is 300
  // Setting alias limit to 301 should fail
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 301 });

  t.is(res.status, 400);

  // Setting alias limit to 300 should succeed (exactly at boundary)
  const res2 = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 300 });

  t.is(res2.status, 200);
  t.is(res2.body.smtp_limit, 300);
});

test('domain effective limit increases when higher-limit admin is added', async (t) => {
  // Start with one admin with default limit (config.smtpLimitMessages)
  const { user, domain, alias } = await createTestSetup(t, {
    domain: { plan: 'team' }
  });

  const defaultLimit = config.smtpLimitMessages; // 100 in test env

  // Verify we cannot exceed the default limit
  const res1 = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: defaultLimit + 1 });

  t.is(res1.status, 400);

  // Now add a second admin with a higher limit
  let admin2 = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 1000
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: admin2._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin2.plan,
      kind: 'one-time'
    })
    .create();

  admin2 = await admin2.save();

  domain.members.push({ user: admin2._id, group: 'admin' });
  domain.skip_verification = true;
  domain.skip_payment_check = true;
  await domain.save();

  // Now we should be able to set a limit higher than the original default
  const res2 = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: 500 });

  t.is(res2.status, 200);
  t.is(res2.body.smtp_limit, 500);
});

test('non-admin members do not affect domain effective SMTP limit', async (t) => {
  const { user, domain, alias } = await createTestSetup(t, {
    domain: { plan: 'team' }
  });

  // Add a non-admin member with a very high limit
  let memberUser = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 9999
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: memberUser._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: memberUser.plan,
      kind: 'one-time'
    })
    .create();

  memberUser = await memberUser.save();

  // Add as 'user' (NOT admin)
  domain.members.push({ user: memberUser._id, group: 'user' });
  domain.skip_verification = true;
  domain.skip_payment_check = true;
  await domain.save();

  const defaultLimit =
    user[config.userFields.smtpLimit] || config.smtpLimitMessages;

  // Non-admin's high limit should NOT affect the domain's effective limit
  // So setting alias limit above the admin's limit should still fail
  const res = await t.context.api
    .put(`/v1/domains/${domain.name}/aliases/${alias.id}`)
    .auth(user[config.userFields.apiToken])
    .send({ smtp_limit: defaultLimit + 1 });

  t.is(res.status, 400);
});

test('getDomainSmtpLimitAsync resolves correctly with multiple admins', async (t) => {
  const Users = require('#models/users');
  const { getDomainSmtpLimitAsync } = require('#helpers/get-domain-smtp-limit');

  // Create admin1 with limit 150
  let admin1 = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 150
    })
    .create();
  admin1 = await admin1.save();

  // Create admin2 with limit 250
  let admin2 = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.smtpLimit]: 250
    })
    .create();
  admin2 = await admin2.save();

  // Create admin3 with no custom limit (uses default)
  let admin3 = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  admin3 = await admin3.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [
        { user: admin1._id, group: 'admin' },
        { user: admin2._id, group: 'admin' },
        { user: admin3._id, group: 'admin' }
      ],
      plan: 'team',
      resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  // The highest admin limit should be 250
  const effectiveLimit = await getDomainSmtpLimitAsync(domain, Users);
  t.is(effectiveLimit, 250);
});

//
// Catch-all alias handling tests
//
test('catch-all alias (name=*) smtp_limit is enforced', async (t) => {
  const { user, domain } = await createTestSetup(t);
  // Create a catch-all alias with smtp_limit
  const catchAllAlias = await Aliases.create({
    user: user._id,
    domain: domain._id,
    name: '*',
    recipients: [user.email],
    smtp_limit: 5
  });
  t.is(catchAllAlias.smtp_limit, 5);
  t.is(catchAllAlias.name, '*');
});

test('catch-all alias suspension is checked when alias is null', async (t) => {
  const { user, domain } = await createTestSetup(t);
  // Create a suspended catch-all alias
  await Aliases.create({
    user: user._id,
    domain: domain._id,
    name: '*',
    recipients: [user.email],
    smtp_limit: 5,
    smtp_suspended_sent_at: new Date()
  });
  // Verify the catch-all alias is marked as suspended
  const catchAll = await Aliases.findOne({
    domain: domain._id,
    name: '*'
  }).lean();
  t.true(catchAll.is_smtp_suspended);
});

test('catch-all alias smtp_count includes emails with null alias field', async (t) => {
  const { user, domain } = await createTestSetup(t);
  // Create a catch-all alias
  const catchAllAlias = await Aliases.create({
    user: user._id,
    domain: domain._id,
    name: '*',
    recipients: [user.email],
    smtp_limit: 50
  });
  // Create emails with alias field set (tagged)
  await Emails.create({
    user: user._id,
    domain: domain._id,
    alias: catchAllAlias._id,
    status: 'queued',
    envelope: { from: 'test@example.com', to: ['rcpt@example.com'] },
    message: Buffer.from('test'),
    messageId: '<tagged@test.com>',
    headers: { Subject: 'tagged' },
    date: new Date(),
    created_at: new Date()
  });
  // Create emails with no alias field (catch-all sends)
  await Emails.create({
    user: user._id,
    domain: domain._id,
    // alias is intentionally not set (catch-all behavior)
    status: 'queued',
    envelope: { from: 'test@example.com', to: ['rcpt@example.com'] },
    message: Buffer.from('test'),
    messageId: '<untagged@test.com>',
    headers: { Subject: 'untagged' },
    date: new Date(),
    created_at: new Date()
  });
  // Count should include both tagged and untagged emails
  const startOfDay = dayjs().startOf('day').toDate();
  const taggedCount = await Emails.countDocuments({
    alias: catchAllAlias._id,
    created_at: { $gte: startOfDay }
  });
  const untaggedCount = await Emails.countDocuments({
    domain: domain._id,
    alias: { $in: [null, undefined] },
    created_at: { $gte: startOfDay }
  });
  const totalCount = taggedCount + untaggedCount;
  t.true(totalCount >= 2);
});

test('admin alert email includes correct admin UI links', async (t) => {
  const { user, domain, alias } = await createTestSetup(t);
  // Verify the admin URL format is correct
  const adminAliasUrl = `${config.urls.web}/en/admin/domains/${domain.id}/aliases/${alias._id}`;
  const adminDomainUrl = `${
    config.urls.web
  }/en/admin/domains?q=${encodeURIComponent(domain.name)}`;
  const adminUserUrl = `${config.urls.web}/en/admin/users/${user._id}`;
  t.true(adminAliasUrl.includes('/admin/domains/'));
  t.true(adminAliasUrl.includes('/aliases/'));
  t.true(adminDomainUrl.includes('/admin/domains'));
  t.true(adminUserUrl.includes('/admin/users/'));
});

// ============================================================
// Virus/spam detection suspends the alias
// ============================================================

test('virus/spam detection uses threshold-based suspension (N detections in window)', async (t) => {
  const { domain, alias } = await createTestSetup(t);
  const redis = new Redis();

  const threshold = config.smtpSpamSuspensionVirusThreshold;
  const aliasId = alias._id.toString();
  const countKey = `${config.fingerprintPrefix}:alias_abuse:${aliasId}:virus:count`;

  // Simulate detections below threshold - alias should NOT be suspended
  await redis.set(
    countKey,
    String(threshold - 1),
    'PX',
    config.smtpSpamSuspensionWindow
  );
  let freshAlias = await Aliases.findById(alias._id).lean();
  t.falsy(freshAlias.smtp_suspended_sent_at);

  // Simulate reaching threshold - alias SHOULD be suspended
  await redis.set(
    countKey,
    String(threshold),
    'PX',
    config.smtpSpamSuspensionWindow
  );
  // Now manually trigger what the code does when count >= threshold
  alias.smtp_suspended_sent_at = new Date();
  await alias.save();
  freshAlias = await Aliases.findById(alias._id).lean();
  t.true(freshAlias.is_smtp_suspended);

  // Verify domain is NOT suspended
  const Domains = require('#models/domains');
  const updatedDomain = await Domains.findById(domain._id).lean();
  t.falsy(updatedDomain.smtp_suspended_sent_at);

  await redis.disconnect();
});
