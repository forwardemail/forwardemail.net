/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

function source(...segments) {
  return fs.readFileSync(path.join(__dirname, '../..', ...segments), 'utf8');
}

test('Alias model keeps the pre-rekey token snapshot private', (t) => {
  const model = source('app/models/aliases.js');

  // Match the complete Mongoose field definition instead of slicing to an
  // unrelated comment boundary. This remains valid if surrounding schema
  // comments or field ordering change.
  t.regex(
    model,
    /rekey_previous_tokens:\s*{\s*type:\s*\[\s*Token\s*],\s*default:\s*\[\s*],\s*select:\s*false\s*}/s
  );
  t.regex(model, /rekey_id:\s*{\s*type:\s*String,\s*select:\s*false\s*}/s);
  t.regex(
    model,
    /rekey_processing:\s*{\s*type:\s*Boolean,\s*default:\s*false,\s*select:\s*false\s*}/s
  );
  t.true(model.includes("'rekey_previous_tokens'"));
  t.true(model.includes("'rekey_id'"));
  t.true(model.includes("'rekey_processing'"));
});

test('rekey persists its token snapshot before the job is queued', (t) => {
  const controller = source(
    'app/controllers/web/my-account/generate-alias-password.js'
  );
  const snapshot = controller.indexOf(
    'alias.rekey_previous_tokens = originalTokens'
  );
  const operationId = controller.indexOf('alias.rekey_id = rekeyId', snapshot);
  const save = controller.indexOf('await alias.save()', operationId);
  const cacheReset = controller.indexOf("'sqlite_auth_reset'", save);
  const enqueue = controller.indexOf('await wsp.request(', cacheReset);

  t.true(snapshot > -1);
  t.true(operationId > snapshot);
  t.true(save > operationId);
  t.true(cacheReset > save);
  t.true(enqueue > cacheReset);
  t.true(controller.includes('ALIAS_REKEY_IN_PROGRESS'));
  t.true(
    controller.includes('await acquireRekeyLock(ctx.client, alias.id, rekeyId)')
  );
  t.true(controller.includes('await releaseRekeyLock(ctx.client'));
});

test('failed rekeys atomically restore their old tokens in the worker', (t) => {
  const worker = source('helpers/worker.js');
  const failure = worker.indexOf('if (err) {');
  const rollbackSource = worker.slice(
    failure,
    worker.indexOf('} else {', failure)
  );

  t.regex(rollbackSource, /is_rekey:\s*false/);
  t.regex(rollbackSource, /tokens:/);
  t.regex(
    rollbackSource,
    /\$ifNull:\s*\['\$rekey_previous_tokens', '\$tokens']/
  );
  t.regex(rollbackSource, /'rekey_previous_tokens'/);
  t.regex(rollbackSource, /'rekey_id'/);
  t.regex(rollbackSource, /'rekey_processing'/);
  t.true(worker.includes('Claim this specific rekey before touching SQLite'));
  t.true(worker.includes('Skipping stale or already-claimed rekey job'));
  t.true(worker.includes('await releaseRekeyLock('));
});

for (const file of ['sqlite-worker.js', 'jobs/cleanup-stuck-rekeys.js']) {
  test(`${file} restores old tokens for interrupted rekeys`, (t) => {
    const recovery = source(file);

    t.true(recovery.includes("$ifNull: ['$rekey_previous_tokens', '$tokens']"));
    t.true(recovery.includes("'rekey_previous_tokens'"));
    t.true(recovery.includes("'rekey_id'"));
    t.true(recovery.includes("'rekey_processing'"));
    t.true(recovery.includes('releaseRekeyLock'));
  });
}

test('every alias protocol is rejected while rekey state is active', (t) => {
  const auth = source('helpers/on-auth.js');
  const guard = auth.indexOf('Never authenticate an alias while its SQLite');
  const protocolBranch = auth.indexOf(
    '// IMAP/POP3/CalDAV/CardDAV/API/ManageSieve servers can only validate'
  );

  t.true(guard > -1);
  t.true(protocolBranch > guard);
  t.true(auth.slice(guard, protocolBranch).includes('alias.is_rekey === true'));
  t.true(auth.includes('This applies to SMTP too'));
  t.true(auth.includes('getRekeyLockKey(user.alias_id)'));
  t.true(auth.includes('!isRekeying'));
});

test('SMTP evicts cached credentials on password-reset broadcasts', (t) => {
  const smtpServer = source('smtp-server.js');
  const smtpProcess = source('smtp.js');

  t.true(smtpServer.includes("subscribe('sqlite_auth_reset')"));
  t.true(smtpServer.includes('onAuth.clearAuthCache(this.client, aliasId)'));
  t.true(smtpProcess.includes('const subscriber = new Redis'));
  t.true(smtpProcess.includes('new SMTP({ client, subscriber })'));
});

test('scheduled cleanup is registered and ignores rekeys claimed by a live worker', (t) => {
  const jobsIndex = source('jobs/index.js');
  t.true(jobsIndex.includes("name: 'cleanup-stuck-rekeys'"));
  t.true(jobsIndex.includes("interval: '5m'"));

  const cleanup = source('jobs/cleanup-stuck-rekeys.js');

  t.true(cleanup.includes('rekey_processing: { $ne: true }'));
  t.true(cleanup.includes('Do not roll back a slow but active rekey'));
  t.true(
    cleanup.includes('releaseRekeyLock(client, alias._id, alias.rekey_id)')
  );
});
