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

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// Helper function to create alias auth header
function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

// Helper function to create API token auth header
function createApiAuth(apiToken) {
  return `Basic ${Buffer.from(`${apiToken}:`).toString('base64')}`;
}

// Helper function to create test user, domain, and alias with IMAP enabled
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

  // spoof dns records
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

  // store spoofed dns cache
  await t.context.resolver.options.cache.mset(map);

  return { user, domain, alias, pass };
}

// Sample valid Sieve script
const VALID_SIEVE_SCRIPT = `require ["fileinto"];

if header :contains "subject" "test" {
  fileinto "INBOX.test";
}
`;

// Sample invalid Sieve script (syntax error)
const INVALID_SIEVE_SCRIPT = `require ["fileinto"

if header :contains "subject" "test" {
  fileinto "INBOX.test";
}
`;

// ============================================================================
// /v1/sieve-scripts ENDPOINT TESTS (Alias Auth)
// ============================================================================

test('GET /v1/sieve-scripts - fails without auth', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/sieve-scripts');
  t.is(res.status, 401);
});

test('GET /v1/sieve-scripts - lists scripts with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/sieve-scripts')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('POST /v1/sieve-scripts - creates script with alias auth', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const scriptData = {
    name: 'test-script',
    content: VALID_SIEVE_SCRIPT,
    description: 'Test Sieve script'
  };

  const res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 200);
  t.is(res.body.object, 'sieve_script');
  t.is(res.body.name, 'test-script');
  t.is(res.body.description, 'Test Sieve script');
  t.is(res.body.is_active, false);
});

test('POST /v1/sieve-scripts - fails without name', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const scriptData = {
    content: VALID_SIEVE_SCRIPT
  };

  const res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 400);
});

test('POST /v1/sieve-scripts - fails without content', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const scriptData = {
    name: 'test-script'
  };

  const res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 400);
});

test('POST /v1/sieve-scripts - fails with invalid script syntax', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const scriptData = {
    name: 'test-script',
    content: INVALID_SIEVE_SCRIPT
  };

  const res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 400);
});

test('POST /v1/sieve-scripts - fails with duplicate name', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const scriptData = {
    name: 'test-script',
    content: VALID_SIEVE_SCRIPT
  };

  // Create first script
  let res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 200);

  // Try to create second script with same name
  res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 400);
});

test('POST /v1/sieve-scripts - creates and activates script', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const scriptData = {
    name: 'test-script',
    content: VALID_SIEVE_SCRIPT,
    activate: true
  };

  const res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send(scriptData);

  t.is(res.status, 200);
  t.is(res.body.is_active, true);
});

test('GET /v1/sieve-scripts/:script_id - retrieves script by ID', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  // Retrieve by ID
  const res = await api
    .get(`/v1/sieve-scripts/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.id, createRes.body.id);
  t.is(res.body.name, 'test-script');
  t.is(res.body.content, VALID_SIEVE_SCRIPT);
});

test('GET /v1/sieve-scripts/:script_id - retrieves script by name', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a script first
  await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'my-script',
      content: VALID_SIEVE_SCRIPT
    });

  // Retrieve by name
  const res = await api
    .get('/v1/sieve-scripts/my-script')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.name, 'my-script');
});

test('GET /v1/sieve-scripts/:script_id - returns 404 for non-existent script', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .get('/v1/sieve-scripts/non-existent-script')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 404);
});

test('PUT /v1/sieve-scripts/:script_id - updates script content', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  const updatedContent = `require ["fileinto"];

if header :contains "subject" "updated" {
  fileinto "INBOX.updated";
}
`;

  // Update the script
  const res = await api
    .put(`/v1/sieve-scripts/${createRes.body.id}`)
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      content: updatedContent,
      description: 'Updated description'
    });

  t.is(res.status, 200);
  t.is(res.body.description, 'Updated description');
});

test('PUT /v1/sieve-scripts/:script_id - returns 404 for non-existent script', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .put('/v1/sieve-scripts/non-existent-script')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      content: VALID_SIEVE_SCRIPT
    });

  t.is(res.status, 404);
});

test('DELETE /v1/sieve-scripts/:script_id - deletes inactive script', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  // Delete the script
  const res = await api
    .delete(`/v1/sieve-scripts/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.deleted, true);

  // Verify it's gone
  const getRes = await api
    .get(`/v1/sieve-scripts/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(getRes.status, 404);
});

test('DELETE /v1/sieve-scripts/:script_id - fails to delete active script', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create and activate a script
  const createRes = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT,
      activate: true
    });

  t.is(createRes.status, 200);
  t.is(createRes.body.is_active, true);

  // Try to delete the active script
  const res = await api
    .delete(`/v1/sieve-scripts/${createRes.body.id}`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 400);
});

test('POST /v1/sieve-scripts/:script_id/activate - activates script', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);
  t.is(createRes.body.is_active, false);

  // Activate the script
  const res = await api
    .post(`/v1/sieve-scripts/${createRes.body.id}/activate`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(res.status, 200);
  t.is(res.body.is_active, true);
});

// ============================================================================
// /v1/domains/:domain_id/aliases/:alias_id/sieve ENDPOINT TESTS (API Token Auth)
// ============================================================================

test('GET /v1/domains/:domain_id/aliases/:alias_id/sieve - fails without auth', async (t) => {
  const { api } = t.context;
  const { domain, alias } = await createTestAlias(t);

  const res = await api.get(
    `/v1/domains/${domain.id}/aliases/${alias.id}/sieve`
  );
  t.is(res.status, 401);
});

test('GET /v1/domains/:domain_id/aliases/:alias_id/sieve - lists scripts with API token', async (t) => {
  const { api } = t.context;
  const { user, domain, alias } = await createTestAlias(t);

  const res = await api
    .get(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]));

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test('POST /v1/domains/:domain_id/aliases/:alias_id/sieve - creates script with API token', async (t) => {
  const { api } = t.context;
  const { user, domain, alias } = await createTestAlias(t);

  const scriptData = {
    name: 'api-script',
    content: VALID_SIEVE_SCRIPT,
    description: 'Script created via API token'
  };

  const res = await api
    .post(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]))
    .send(scriptData);

  t.is(res.status, 200);
  t.is(res.body.object, 'sieve_script');
  t.is(res.body.name, 'api-script');
});

test('GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id - retrieves script', async (t) => {
  const { api } = t.context;
  const { user, domain, alias } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  // Retrieve the script
  const res = await api
    .get(
      `/v1/domains/${domain.id}/aliases/${alias.id}/sieve/${createRes.body.id}`
    )
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]));

  t.is(res.status, 200);
  t.is(res.body.name, 'test-script');
  t.is(res.body.content, VALID_SIEVE_SCRIPT);
});

test('PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id - updates script', async (t) => {
  const { api } = t.context;
  const { user, domain, alias } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  const updatedContent = `require ["fileinto"];

if header :contains "subject" "api-updated" {
  fileinto "INBOX.api-updated";
}
`;

  // Update the script
  const res = await api
    .put(
      `/v1/domains/${domain.id}/aliases/${alias.id}/sieve/${createRes.body.id}`
    )
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]))
    .send({
      content: updatedContent,
      description: 'Updated via API'
    });

  t.is(res.status, 200);
  t.is(res.body.description, 'Updated via API');
});

test('DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id - deletes script', async (t) => {
  const { api } = t.context;
  const { user, domain, alias } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  // Delete the script
  const res = await api
    .delete(
      `/v1/domains/${domain.id}/aliases/${alias.id}/sieve/${createRes.body.id}`
    )
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]));

  t.is(res.status, 200);
  t.is(res.body.deleted, true);
});

test('POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate - activates script', async (t) => {
  const { api } = t.context;
  const { user, domain, alias } = await createTestAlias(t);

  // Create a script first
  const createRes = await api
    .post(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]))
    .send({
      name: 'test-script',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(createRes.status, 200);

  // Activate the script
  const res = await api
    .post(
      `/v1/domains/${domain.id}/aliases/${alias.id}/sieve/${createRes.body.id}/activate`
    )
    .set('Authorization', createApiAuth(user[config.userFields.apiToken]));

  t.is(res.status, 200);
  t.is(res.body.is_active, true);
});

// ============================================================================
// EDGE CASES AND ERROR HANDLING
// ============================================================================

test('Sieve API - fails for alias without IMAP enabled', async (t) => {
  const { api } = t.context;

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

  // Create alias WITHOUT IMAP
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: false
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  // spoof dns records
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

  const res = await api
    .get('/v1/sieve-scripts')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  // Auth is blocked for aliases without IMAP enabled (returns 401 from onAuth)
  t.is(res.status, 401);
});

test('Sieve API - fails for catch-all alias via API token', async (t) => {
  const { api } = t.context;

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

  // Create catch-all alias (without IMAP since catch-all can't have IMAP)
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: false,
      name: '*'
    })
    .create();

  // spoof dns records
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

  // Use API token auth to access the catch-all alias sieve endpoint
  const res = await api
    .get(`/v1/domains/${domain.id}/aliases/${alias.id}/sieve`)
    .set(
      'Authorization',
      `Basic ${Buffer.from(`${user.email}:`).toString('base64')}`
    );

  // Catch-all aliases can't have IMAP, so auth is blocked with 401
  // (onAuth blocks authentication for aliases without IMAP enabled)
  t.is(res.status, 401);
});

test('Sieve API - multiple scripts management', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  // Create multiple scripts
  const script1 = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'script-1',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(script1.status, 200);

  const script2 = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'script-2',
      content: VALID_SIEVE_SCRIPT
    });

  t.is(script2.status, 200);

  // List all scripts
  const listRes = await api
    .get('/v1/sieve-scripts')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(listRes.status, 200);
  t.is(listRes.body.length, 2);

  // Activate one script
  const activateRes = await api
    .post(`/v1/sieve-scripts/${script1.body.id}/activate`)
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(activateRes.status, 200);
  t.is(activateRes.body.is_active, true);

  // Verify only one is active
  const listRes2 = await api
    .get('/v1/sieve-scripts')
    .set(
      'Authorization',
      createAliasAuth(`${alias.name}@${domain.name}`, pass)
    );

  t.is(listRes2.status, 200);
  const activeScripts = listRes2.body.filter((s) => s.is_active);
  t.is(activeScripts.length, 1);
  t.is(activeScripts[0].name, 'script-1');
});

test('Sieve API - script with all extensions', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const complexScript = `require ["fileinto", "reject", "vacation", "variables", "imap4flags"];

if header :contains "subject" "spam" {
  reject "No spam allowed";
  stop;
}

if header :contains "subject" "vacation" {
  vacation :days 7 "I am on vacation";
}

if header :contains "from" "boss" {
  setflag "\\\\Flagged";
  fileinto "INBOX.Important";
}
`;

  const res = await api
    .post('/v1/sieve-scripts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      name: 'complex-script',
      content: complexScript
    });

  t.is(res.status, 200);
  t.is(res.body.name, 'complex-script');
});
