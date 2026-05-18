/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const PushTokens = require('#models/push-tokens');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// ─── Helpers ───────────────────────────────────────────────────────────────

function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

function createApiTokenAuth(apiToken) {
  return `Basic ${Buffer.from(`${apiToken}:`).toString('base64')}`;
}

async function createTestAlias(t) {
  let user = await t.context.userFactory
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

  user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  // Spoof DNS records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);

  return { user, domain, alias, pass };
}

// ─── POST /v1/push-tokens ──────────────────────────────────────────────────

test('POST /v1/push-tokens > registers APNs token with alias auth', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({
      platform: 'apns',
      token: 'a'.repeat(64),
      device_name: 'Test iPhone'
    });

  t.is(res.status, 201);
  t.is(res.body.platform, 'apns');
  t.is(res.body.token, 'a'.repeat(64));
  t.is(res.body.device_name, 'Test iPhone');
  t.is(res.body.object, 'push_token');
  t.truthy(res.body.id);
  t.truthy(res.body.expires_at);
});

test('POST /v1/push-tokens > registers FCM token with API token auth', async (t) => {
  const { user, alias } = await createTestAlias(t);

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createApiTokenAuth(user.api_token))
    .send({
      platform: 'fcm',
      token: 'f'.repeat(152),
      device_name: 'Test Pixel',
      alias_id: alias._id.toString()
    });

  t.is(res.status, 201);
  t.is(res.body.platform, 'fcm');
  t.is(res.body.device_name, 'Test Pixel');
});

test('POST /v1/push-tokens > registers UnifiedPush endpoint', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({
      platform: 'unified-push',
      token: 'https://ntfy.example.com/up-test-endpoint',
      device_name: 'GrapheneOS'
    });

  t.is(res.status, 201);
  t.is(res.body.platform, 'unified-push');
  t.is(res.body.token, 'https://ntfy.example.com/up-test-endpoint');
});

test('POST /v1/push-tokens > upserts existing token (extends expiry)', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;
  const token = 'b'.repeat(64);

  // First registration
  const res1 = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token });

  t.is(res1.status, 201);

  // Second registration (same token) — should upsert, not duplicate
  const res2 = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token });

  t.is(res2.status, 201);
  t.is(res2.body.id, res1.body.id); // Same document

  // Verify only one token exists
  const count = await PushTokens.countDocuments({ alias: alias._id });
  t.is(count, 1);
});

test('POST /v1/push-tokens > normalizes APNs token to lowercase', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'A'.repeat(64) });

  t.is(res.status, 201);
  t.is(res.body.token, 'a'.repeat(64));
});

// ─── Validation Tests ──────────────────────────────────────────────────────

test('POST /v1/push-tokens > rejects missing platform', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ token: 'a'.repeat(64) });

  t.is(res.status, 400);
});

test('POST /v1/push-tokens > rejects invalid platform', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'invalid', token: 'abc' });

  t.is(res.status, 400);
});

test('POST /v1/push-tokens > rejects invalid APNs token (non-hex)', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'not-a-hex-token' });

  t.is(res.status, 400);
  t.regex(res.body.message, /hex string/i);
});

test('POST /v1/push-tokens > rejects short FCM token', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'fcm', token: 'too-short' });

  t.is(res.status, 400);
  t.regex(res.body.message, /at least/i);
});

test('POST /v1/push-tokens > rejects non-HTTPS UnifiedPush endpoint', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({
      platform: 'unified-push',
      token: 'http://insecure.example.com/push'
    });

  t.is(res.status, 400);
  t.regex(res.body.message, /https/i);
});

test('POST /v1/push-tokens > rejects invalid web-push subscription', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'web-push', token: 'not-json' });

  t.is(res.status, 400);
  t.regex(res.body.message, /json/i);
});

test('POST /v1/push-tokens > rejects token exceeding max length', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'fcm', token: 'x'.repeat(5000) });

  t.is(res.status, 400);
  t.regex(res.body.message, /maximum length/i);
});

test('POST /v1/push-tokens > rejects API token auth without alias_id', async (t) => {
  const { user } = await createTestAlias(t);

  const res = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createApiTokenAuth(user.api_token))
    .send({ platform: 'apns', token: 'c'.repeat(64) });

  t.is(res.status, 400);
  t.regex(res.body.message, /alias_id/i);
});

test('POST /v1/push-tokens > rejects unauthenticated request', async (t) => {
  const res = await t.context.api
    .post('/v1/push-tokens')
    .send({ platform: 'apns', token: 'd'.repeat(64) });

  t.is(res.status, 401);
});

// ─── GET /v1/push-tokens ───────────────────────────────────────────────────

test('GET /v1/push-tokens > lists tokens for alias', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  // Register two tokens
  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'e'.repeat(64) });

  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'fcm', token: 'f'.repeat(152) });

  const res = await t.context.api
    .get('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.is(res.body.length, 2);
});

test('GET /v1/push-tokens > filters by platform', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'a1b2c3d4'.repeat(8) });

  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'fcm', token: 'e5f6a7b8'.repeat(19) });

  const res = await t.context.api
    .get('/v1/push-tokens?platform=apns')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.is(res.body[0].platform, 'apns');
});

test('GET /v1/push-tokens > excludes expired tokens', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  // Register a token
  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'c1d2e3f4'.repeat(8) });

  // Manually expire it
  await PushTokens.updateMany(
    { alias: alias._id },
    { $set: { expires_at: new Date(Date.now() - 1000) } }
  );

  const res = await t.context.api
    .get('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(res.status, 200);
  t.is(res.body.length, 0);
});

// ─── DELETE /v1/push-tokens/:id ────────────────────────────────────────────

test('DELETE /v1/push-tokens/:id > removes a specific token', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const createRes = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'd1e2f3a4'.repeat(8) });

  const tokenId = createRes.body.id;

  const deleteRes = await t.context.api
    .delete(`/v1/push-tokens/${tokenId}`)
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(deleteRes.status, 204);

  // Verify it's gone
  const listRes = await t.context.api
    .get('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(listRes.body.length, 0);
});

test('DELETE /v1/push-tokens/:id > returns 404 for non-existent token', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .delete('/v1/push-tokens/000000000000000000000000')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(res.status, 404);
});

test('DELETE /v1/push-tokens/:id > rejects invalid ObjectId', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const res = await t.context.api
    .delete('/v1/push-tokens/not-a-valid-id')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(res.status, 400);
});

// ─── DELETE /v1/push-tokens (bulk) ─────────────────────────────────────────

test('DELETE /v1/push-tokens > removes all tokens for alias', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  // Register multiple tokens
  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'e1f2a3b4'.repeat(8) });

  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'fcm', token: 'f1a2b3c4'.repeat(19) });

  const deleteRes = await t.context.api
    .delete('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass));

  t.is(deleteRes.status, 200);
  t.is(deleteRes.body.deleted_count, 2);

  // Verify all gone
  const count = await PushTokens.countDocuments({ alias: alias._id });
  t.is(count, 0);
});

// ─── Security Tests ────────────────────────────────────────────────────────

test('DELETE /v1/push-tokens/:id > cannot delete another alias token', async (t) => {
  // Create two separate aliases
  const {
    domain: domain1,
    alias: alias1,
    pass: pass1
  } = await createTestAlias(t);
  const {
    domain: domain2,
    alias: alias2,
    pass: pass2
  } = await createTestAlias(t);
  const aliasEmail1 = `${alias1.name}@${domain1.name}`;
  const aliasEmail2 = `${alias2.name}@${domain2.name}`;

  // Register a token for alias1
  const createRes = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail1, pass1))
    .send({ platform: 'apns', token: 'a2b3c4d5'.repeat(8) });

  const tokenId = createRes.body.id;

  // Try to delete it as alias2 — should fail
  const deleteRes = await t.context.api
    .delete(`/v1/push-tokens/${tokenId}`)
    .set('Authorization', createAliasAuth(aliasEmail2, pass2));

  t.is(deleteRes.status, 403);
});

test('GET /v1/push-tokens > cannot list another alias tokens', async (t) => {
  const {
    domain: domain1,
    alias: alias1,
    pass: pass1
  } = await createTestAlias(t);
  const {
    domain: domain2,
    alias: alias2,
    pass: pass2
  } = await createTestAlias(t);
  const aliasEmail1 = `${alias1.name}@${domain1.name}`;
  const aliasEmail2 = `${alias2.name}@${domain2.name}`;

  // Register a token for alias1
  await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail1, pass1))
    .send({ platform: 'apns', token: 'b2c3d4e5'.repeat(8) });

  // List as alias2 — should return empty (not alias1's tokens)
  const res = await t.context.api
    .get('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail2, pass2));

  t.is(res.status, 200);
  t.is(res.body.length, 0);
});

// ─── Token Limit ──────────────────────────────────────────────────────────

test('POST /v1/push-tokens > enforces per-alias token limit', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  // Register MAX_TOKENS_PER_ALIAS tokens
  const pushTokens = require('#controllers/api/v1/push-tokens');
  const limit = pushTokens.MAX_TOKENS_PER_ALIAS;

  for (let i = 0; i < limit; i++) {
    // Generate unique valid hex tokens (64 chars each)
    const hex = i.toString(16).padStart(2, '0').repeat(32);
    const res = await t.context.api
      .post('/v1/push-tokens')
      .set('Authorization', createAliasAuth(aliasEmail, pass))
      .send({ platform: 'apns', token: hex });
    t.is(res.status, 201, `Token ${i + 1} should be created`);
  }

  // The next one should be rejected
  const overLimitRes = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'ff'.repeat(32) });

  t.is(overLimitRes.status, 400);
  t.regex(overLimitRes.body.message, /maximum/i);
});

test('POST /v1/push-tokens > allows upsert when at token limit', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const pushTokens = require('#controllers/api/v1/push-tokens');
  const limit = pushTokens.MAX_TOKENS_PER_ALIAS;

  // Fill up to the limit
  const firstToken = 'aa'.repeat(32);
  for (let i = 0; i < limit; i++) {
    const hex =
      i === 0 ? firstToken : i.toString(16).padStart(2, '0').repeat(32);
    await t.context.api
      .post('/v1/push-tokens')
      .set('Authorization', createAliasAuth(aliasEmail, pass))
      .send({ platform: 'apns', token: hex });
  }

  // Re-registering an existing token (upsert) should still succeed
  const upsertRes = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: firstToken, device_name: 'updated' });

  t.is(upsertRes.status, 201);
  t.is(upsertRes.body.device_name, 'updated');
});

// ─── Model Static Methods ──────────────────────────────────────────────────

test('PushTokens.recordFailure > removes token after 3 failures', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const createRes = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'c2d3e4f5'.repeat(8) });

  const tokenId = createRes.body.id;

  // Record 3 failures
  await PushTokens.recordFailure(tokenId);
  await PushTokens.recordFailure(tokenId);
  await PushTokens.recordFailure(tokenId);

  // Token should be auto-deleted
  const doc = await PushTokens.findById(tokenId);
  t.is(doc, null);
});

test('PushTokens.recordSuccess > resets failure count and extends expiry', async (t) => {
  const { domain, alias, pass } = await createTestAlias(t);
  const aliasEmail = `${alias.name}@${domain.name}`;

  const createRes = await t.context.api
    .post('/v1/push-tokens')
    .set('Authorization', createAliasAuth(aliasEmail, pass))
    .send({ platform: 'apns', token: 'd2e3f4a5'.repeat(8) });

  const tokenId = createRes.body.id;

  // Add a failure
  await PushTokens.recordFailure(tokenId);
  let doc = await PushTokens.findById(tokenId);
  t.is(doc.failure_count, 1);

  // Record success
  await PushTokens.recordSuccess(tokenId);
  doc = await PushTokens.findById(tokenId);
  t.is(doc.failure_count, 0);
  t.truthy(doc.last_used_at);
});
