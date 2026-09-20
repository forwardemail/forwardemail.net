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

// the part of `text` between the first occurrence of `start` and the next
// occurrence of `end` after it
function section(text, start, end) {
  const from = text.indexOf(start);
  return text.slice(from, text.indexOf(end, from));
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
  t.regex(
    model,
    /rekey_claimed_at:\s*{\s*type:\s*Date,\s*select:\s*false\s*}/s
  );
  t.regex(
    model,
    /rekey_swap_ino:\s*{\s*type:\s*String,\s*select:\s*false\s*}/s
  );
  t.regex(
    model,
    /rekey_swapped_at:\s*{\s*type:\s*Date,\s*select:\s*false\s*}/s
  );
  t.true(model.includes("'rekey_previous_tokens'"));
  t.true(model.includes("'rekey_id'"));
  t.true(model.includes("'rekey_processing'"));
  t.true(model.includes("'rekey_claimed_at'"));
  t.true(model.includes("'rekey_swap_ino'"));
  t.true(model.includes("'rekey_swapped_at'"));
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
  // the rollback is the shared, swap-aware one (it releases the lock)
  t.regex(
    controller,
    /await rollbackRekey\(ctx\.client, ctx\.state\.alias\._id, {\s*filter: { rekey_id: rekeyId, rekey_processing: { \$ne: true } },\s*rekeyId,\s*tokens: originalTokens\s*}\)/
  );
  t.false(controller.includes('releaseRekeyLock'));
});

test('the token snapshot carries what a rollback needs', (t) => {
  const controller = source(
    'app/controllers/web/my-account/generate-alias-password.js'
  );
  // `toObject()` strips the hidden salt and hash: the fields are copied
  t.false(controller.includes('token.toObject()'));
  t.regex(
    controller,
    /originalTokens = alias\.tokens\.map\(\(token\) => \({\s*_id: token\._id,\s*description: token\.description,\s*salt: token\.salt,\s*hash: token\.hash,/
  );
  // and a snapshot without them is never persisted
  t.regex(
    controller,
    /originalTokens\.some\(\s*\(token\) => !isSANB\(token\.salt\) \|\| !isSANB\(token\.hash\)\s*\)/
  );
});

test('a mailbox reset runs through the rotation state machine', (t) => {
  const controller = source(
    'app/controllers/web/my-account/generate-alias-password.js'
  );
  // the state (and the lock, and the auth reset) precede BOTH requests
  const save = controller.indexOf('await alias.save()');
  const lock = controller.indexOf('await acquireRekeyLock(', save);
  const authReset = controller.indexOf("'sqlite_auth_reset'", lock);
  const rekeyRequest = controller.indexOf("action: 'rekey'", authReset);
  const resetRequest = controller.indexOf("action: 'reset'", rekeyRequest);
  t.true(save > -1 && lock > save && authReset > lock);
  t.true(rekeyRequest > authReset && resetRequest > rekeyRequest);
  // the reset carries its operation ID
  t.regex(controller, /action: 'reset',\s*rekey_id: rekeyId,/);
  // its outcome is read from MongoDB, not from the reply
  t.regex(
    controller,
    /const finalized =\s*state &&\s*state\.is_rekey !== true/
  );
  t.regex(
    controller,
    /const swapRecorded =\s*state &&\s*state\.is_rekey === true &&\s*state\.rekey_id === rekeyId &&\s*isSANB\(state\.rekey_swap_ino\)/
  );
  t.true(
    controller.includes(
      "throw resetErr || new Error('Mailbox reset did not complete')"
    )
  );
  // a refused reset tells the owner to try again
  t.regex(
    controller,
    /err\.isRekeying \? 'ALIAS_REKEY_IN_PROGRESS' : 'MAILBOX_CREATION_FAILED'/
  );

  const payload = source('helpers/parse-payload.js');
  const resetAction = section(payload, "case 'reset': {", "case 'backup': {");
  // the reset proves it belongs to the rotation in progress
  t.regex(
    resetAction,
    /await assertResetAllowed\(\s*this\.client,\s*payload\.session\.user\.alias_id,\s*payload\.rekey_id\s*\)/
  );
  t.regex(
    payload,
    /async function assertResetAllowed\(client, aliasId, rekeyId\)/
  );
  // one reset/rekey at a time, atomically, released when the reset is over
  t.regex(
    resetAction,
    /const resetCheckAcquired = await this\.client\.set\(\s*`reset_check:\${payload\.session\.user\.alias_id}`,\s*true,\s*'PX',\s*ms\('30s'\),\s*'NX'\s*\)/
  );
  t.regex(
    resetAction,
    /} finally {\s*\/\/ the reset is over[^]*?\.del\(`reset_check:\${payload\.session\.user\.alias_id}`\)/
  );
  const rekeyAction = section(payload, "case 'rekey': {", "case 'reset': {");
  t.regex(
    rekeyAction,
    /const rekeyCheckAcquired = await this\.client\.set\(\s*`reset_check:\${payload\.session\.user\.alias_id}`,\s*true,\s*'PX',\s*ms\('30s'\),\s*'NX'\s*\)/
  );
  // the file is replaced by the shared swap (which verified the fresh
  // mailbox), the rotation is finalized right away, then the schema is set
  // up (a hiccup there can never lock the owner out)
  const swap = resetAction.indexOf('await resetMailbox({');
  const finalize = resetAction.indexOf('await finalizeRekey(', swap);
  const open = resetAction.indexOf('db = await getDatabase(', finalize);
  const integrity = resetAction.indexOf("db.pragma('integrity_check'", open);
  t.true(swap > -1 && finalize > swap && open > finalize && integrity > open);
  t.false(resetAction.includes('fs.promises.rm('));

  const reset = source('helpers/reset-mailbox.js');
  // built next to the live file, proven exclusive, recorded, then renamed
  const fresh = reset.indexOf('await createFreshMailbox(tmp, session)');
  const swapLock = reset.indexOf("'NX'", fresh);
  const mutex = reset.indexOf('await withDbFileLock(', swapLock);
  const proof = reset.indexOf('leftoverCompanionFiles(storagePath)', mutex);
  const mark = reset.indexOf('rekey_swap_ino: tmpStats.ino.toString()', proof);
  const owned = reset.indexOf('!fileLock.isOwned()', mark);
  const companions = reset.indexOf(
    "await removeCompanionFiles(storagePath, ['-wal', '-shm', '-journal'])",
    owned
  );
  const rename = reset.indexOf(
    'await fs.promises.rename(tmp, storagePath)',
    companions
  );
  const fsync = reset.indexOf(
    'fsyncDirectory(path.dirname(storagePath))',
    rename
  );
  t.true(fresh > -1 && swapLock > fresh && mutex > swapLock);
  t.true(proof > mutex && mark > proof && owned > mark);
  t.true(companions > owned && rename > companions && fsync > rename);
  t.true(
    reset.includes('const cleanChecksRequired = fileLock.brokeStale ? 2 : 1')
  );
  // nothing of the live mailbox changes before the rename
  t.true(
    reset.includes(
      "await removeCompanionFiles(tmp, ['', '-wal', '-shm', '-journal'])"
    )
  );
});

test('corruption recovery quarantines and never acts during a rotation', (t) => {
  const database = source('helpers/get-database.js');
  const recovery = section(
    database,
    "(error.code === 'SQLITE_NOTADB' || error.code === 'SQLITE_CORRUPT') &&",
    '// return here so we can retry and it will re-create database'
  );
  // never while the alias' password is being rotated
  t.regex(
    recovery,
    /if \(alias\.is_rekey === true\) {\s*error\.isRekeying = true;\s*throw error;/
  );
  // exclusivity is proven under the mutex before the file is replaced
  const mutex = recovery.indexOf("{ purpose: 'recovery' }");
  const proof = recovery.indexOf(
    'leftoverCompanionFiles(error.dbFilePath)',
    mutex
  );
  const quarantine = recovery.indexOf('.quarantine-', proof);
  t.true(mutex > -1 && proof > mutex && quarantine > proof);
  // the file is moved, not deleted, with its companions
  t.regex(
    recovery,
    /await fs\.promises\.rename\(\s*`\${error\.dbFilePath}\${suffix}`,\s*`\${quarantinePath}\${suffix}`\s*\)/
  );
  t.false(recovery.includes('fs.promises.rm('));
  // a deferred recovery releases its cooldown for the next request
  t.regex(recovery, /if \(!quarantined\) {[^]*?\.del\(cooldownKey\)/);

  // quarantined files are swept a week later, by the time in their name
  const cleanup = source('jobs/cleanup-sqlite.js');
  t.regex(cleanup, /\.sqlite\\\.quarantine-\(\\d\+\)/);
  t.regex(cleanup, /const maxAge = quarantineMatch \? ms\('7d'\) : ms\('1d'\)/);
});

test('rekey recovery restores old tokens atomically and only when they exist', (t) => {
  const recovery = source('helpers/rekey-recovery.js');
  const rollback = recovery.slice(
    recovery.indexOf('const USABLE_SNAPSHOT'),
    recovery.indexOf('const FINALIZE_UPDATE')
  );

  t.regex(rollback, /is_rekey:\s*false/);
  t.regex(rollback, /tokens:/);
  // an empty snapshot, or one whose tokens cannot validate a password,
  // must never replace the current tokens
  t.regex(rollback, /\$size:\s*USABLE_SNAPSHOT/);
  t.regex(
    rollback,
    /\$filter:\s*{\s*input:\s*{\s*\$ifNull:\s*\['\$rekey_previous_tokens', \[]]\s*},/
  );
  t.regex(rollback, /\$type:\s*'\$\$token\.salt'\s*},\s*'string'/);
  t.regex(rollback, /\$type:\s*'\$\$token\.hash'\s*},\s*'string'/);
  t.true(rollback.includes("'$tokens'"));
  for (const field of [
    'rekey_started_at',
    'rekey_previous_tokens',
    'rekey_id',
    'rekey_processing',
    'rekey_claimed_at',
    'rekey_swap_ino',
    'rekey_swapped_at'
  ])
    t.true(recovery.includes(`'${field}'`));
  // a mailbox with a recorded swap may only be decrypted by the new tokens
  t.true(recovery.includes('rekey_swap_ino: { $exists: false }'));
  t.true(recovery.includes('releaseRekeyLock(client, aliasId, rekeyId)'));
});

test('failed rekeys atomically restore their old tokens in the worker', (t) => {
  const worker = source('helpers/worker.js');
  const rollbackSource = section(worker, 'if (err && !swapped) {', '} else {');

  t.regex(rollbackSource, /await rollbackRekey\(/);
  t.regex(rollbackSource, /allowSwapped: swapMarked/);
  t.true(worker.includes('await finalizeRekey('));
  t.true(worker.includes('Claim this specific rekey before touching SQLite'));
  t.true(worker.includes('Skipping stale or already-claimed rekey job'));
  // the claim time is kept so the claim can be released by compare-and-set
  t.true(worker.includes('rekey_claimed_at: claimedAt'));
  t.true(worker.includes('isTransientRekeyError(err)'));
});

test('the worker re-checks ownership atomically before swapping files', (t) => {
  const swap = section(
    source('helpers/worker.js'),
    'Ownership re-check and swap marker',
    'await fs.promises.rename(tmp, storagePath)'
  );

  t.regex(swap, /rekey_processing: true/);
  t.regex(swap, /rekey_swap_ino: tmpStats\.ino\.toString\(\)/);
  t.regex(swap, /rekey_swapped_at: new Date\(\)/);
  t.regex(swap, /marked\.matchedCount !== 1/);
  t.regex(swap, /swapMarked = true/);
});

test('the worker cleans up and verifies the rekeyed copy safely', (t) => {
  const worker = source('helpers/worker.js');
  const rekey = worker.slice(
    worker.indexOf('async function rekey(payload)'),
    worker.indexOf('async function backup(payload)')
  );
  const stale = rekey.indexOf(
    "await removeCompanionFiles(tmp, ['', '-wal', '-shm', '-journal'])"
  );
  const vacuumInto = rekey.indexOf('db.exec(`VACUUM INTO');

  // stale copies from a hard-killed attempt are removed before VACUUM INTO
  t.true(stale > -1);
  t.true(stale < vacuumInto);
  // handles are closed even when a step throws
  t.true(rekey.includes('for (const handle of [backupDb, db])'));
  // destructive pragmas only ever run against the temporary copy
  t.true(rekey.includes('backupDb.name !== tmp'));
  // the verification handle is read-only
  t.regex(rekey, /new Database\(tmp, {\s*readonly: true/);
  t.true(rekey.includes('REKEY_QUIESCE_TIMEOUT'));
  // the swap holds the per-file mutex shared with every live open
  t.true(rekey.includes("purpose: 'rekey'"));
  t.true(rekey.includes('withDbFileLock('));

  // nothing is written to the live file after the snapshot, and a commit by
  // an in-flight request around or after the snapshot aborts the swap:
  // data_version across VACUUM INTO, the main file across our own close
  // (the last connection to close checkpoints the WAL), and an mtime
  // marker from the close until the exclusivity proof
  const versionBefore = rekey.indexOf(
    "const dataVersionBefore = db.pragma('data_version'"
  );
  const versionAfter = rekey.indexOf(
    "const dataVersionAfter = db.pragma('data_version'"
  );
  const preClose = rekey.indexOf('const preCloseStats = fs.statSync(');
  const closed = rekey.indexOf('db.close();');
  const postClose = rekey.indexOf('const postCloseStats = fs.statSync(');
  const marker = rekey.indexOf('fs.utimesSync(');
  const baseline = rekey.indexOf('const snapshotStats = fs.statSync(');
  const proof = rekey.indexOf('if (cleanChecks >= cleanChecksRequired) break;');
  const compare = rekey.indexOf('liveStats.mtimeNs !== snapshotStats.mtimeNs');
  const mark = rekey.indexOf('Ownership re-check and swap marker');
  t.true(versionBefore > -1 && versionBefore < vacuumInto);
  t.true(vacuumInto < versionAfter && versionAfter < preClose);
  t.true(preClose < closed && closed < postClose);
  t.true(postClose < marker && marker < baseline);
  t.true(proof > -1 && proof < compare && compare < mark);
  t.regex(
    rekey,
    /committed to the live database of alias .* while the snapshot was taken/
  );
  t.regex(rekey, /was checkpointed after the snapshot was taken/);
  t.regex(rekey, /changed after the snapshot was taken/);
  // a broken stale mutex means the proof must hold twice
  t.regex(rekey, /fileLock\.brokeStale \? 2 : 1/);

  // a missing mailbox of an alias that holds data is never finalized
  t.regex(rekey, /claimedRekey\.storage_used > 0/);
  t.true(rekey.includes('!isStorageAvailable(storagePath)'));

  // only the exact copy that was verified may be renamed over the live file
  const verified = rekey.indexOf('const verifiedStats = fs.statSync(tmp');
  const recheck = rekey.indexOf('tmpStats.ino !== verifiedStats.ino');
  const rename = rekey.indexOf('await fs.promises.rename(tmp, storagePath)');
  t.true(verified > -1 && verified < mark);
  t.true(recheck > mark && recheck < rename);
  t.regex(rekey, /changed after it was verified/);
});

test('sqlite-worker holds the fleet-wide worker lease while it runs', (t) => {
  const worker = source('sqlite-worker.js');
  const start = section(worker, '// Start', "process.send('ready')");

  // the lease is taken before any job or rekey state is touched
  const lease = start.indexOf('leaseHeld = await acquireWorkerLease(client');
  const recovery = start.indexOf('await recoverInterruptedRekeys()');
  const poll = start.indexOf('pollRekeyQueue()');
  t.true(lease > -1 && lease < recovery && recovery < poll);
  t.regex(start, /if \(!leaseHeld\) return;/);
  t.regex(start, /startWorkerLeaseRenewal\(client, onWorkerLeaseLost\)/);

  // losing the lease stops the worker, and the lease is only handed over
  // once nothing runs here any more: it keeps being renewed for the whole
  // drain (renewal stops right before the release), it is released only
  // when no job is active any more, and the drain ends before pm2 kills
  // the process (kill_timeout) so that a clean exit hands it over at once
  t.regex(worker, /process\.kill\(process\.pid, 'SIGTERM'\)/);
  const shutdown = section(worker, 'customHandlers: [', 'graceful.listen()');
  const drained = shutdown.indexOf(
    'while (activeJobs > 0 && Date.now() < deadline)'
  );
  const stopped = shutdown.indexOf('stopLeaseRenewal()');
  const released = shutdown.indexOf('await releaseWorkerLease(client)');
  t.true(drained > -1 && drained < stopped && stopped < released);
  t.regex(shutdown, /if \(leaseHeld && activeJobs === 0\)/);
  t.regex(shutdown, /Date\.now\(\) \+ SHUTDOWN_DRAIN_TIMEOUT/);
  const { SHUTDOWN_DRAIN_TIMEOUT } = require('#helpers/sqlite-worker-config');
  const ecosystem = JSON.parse(source('ecosystem-sqlite.json'));
  const app = ecosystem.apps.find((app) => app.name === 'sqlite-worker');
  t.is(app.instances, '1');
  t.true(SHUTDOWN_DRAIN_TIMEOUT < app.kill_timeout);
});

test('sqlite-worker runs rekey recovery on startup and periodically', (t) => {
  const worker = source('sqlite-worker.js');
  t.true(
    worker.includes(
      "const { getRekeyKey, recoverRekeys } = require('#helpers/recover-rekeys')"
    )
  );
  const recovery = worker.indexOf('await recoverInterruptedRekeys()');
  const poll = worker.indexOf('pollRekeyQueue();');
  t.true(recovery > -1);
  // recovery completes before the first job is taken
  t.true(recovery < poll);
  t.regex(
    worker,
    /setInterval\(\s*recoverInterruptedRekeys,\s*REKEY_SWEEP_INTERVAL\s*\)/
  );
  // no hostname is involved: exactly one worker exists fleet-wide
  t.false(worker.includes('hostname'));
});

test('sqlite-worker takes rekey jobs through a reliable queue', (t) => {
  const queue = source('helpers/rekey-queue.js');
  t.regex(
    queue,
    /blockingClient\.blmove\(\s*REKEY_QUEUE,\s*REKEY_PROCESSING_LIST,\s*'LEFT',\s*'RIGHT',\s*timeoutSeconds\s*\)/
  );
  t.true(queue.includes('client.lrem(REKEY_PROCESSING_LIST, -1, payloadStr)'));
  t.true(queue.includes('client.lpush(REKEY_QUEUE, payloadStr)'));

  const worker = source('sqlite-worker.js');
  // the blocking pop runs on its own connection
  t.true(worker.includes('await takeRekeyJob(blockingClient, 5)'));
  t.true(worker.includes('await finishRekeyJob(client, payloadStr)'));
  // a graceful shutdown puts the job back at the head of the queue
  t.true(worker.includes('await requeueRekeyJob(client, payloadStr)'));
  // a transient failure is retried with a backoff instead of being failed
  t.true(worker.includes('err.isRekeyRetryable'));
  t.true(worker.includes('rekey_not_before: Date.now() + delay'));
});

test('the scheduled backstop never decides a recorded swap', (t) => {
  const cleanup = source('jobs/cleanup-stuck-rekeys.js');
  t.true(
    cleanup.includes(
      "const { findRekeyJob, rollbackRekey } = require('#helpers/rekey-recovery')"
    )
  );
  t.false(cleanup.includes('finalizeRekey'));
  t.false(cleanup.includes('recoverRekey('));
  t.true(cleanup.includes('if (alias.rekey_swap_ino) {'));
  t.true(cleanup.includes('await alertAdmins(alias)'));
  t.true(cleanup.includes('REKEY_PROCESSING_STALE_THRESHOLD'));
  t.true(cleanup.includes('REKEY_QUEUED_MAX_AGE'));
  t.true(cleanup.includes("'ALIAS_REKEY_INTERRUPTED_SUBJECT'"));
});

test('the sqlite server refuses mailbox operations of a rekeying alias', (t) => {
  const payload = source('helpers/parse-payload.js');
  const gate = payload.indexOf('await assertAliasNotRekeying(this.client');
  const dispatch = payload.indexOf('switch (payload.action) {');
  t.true(gate > -1);
  t.true(gate < dispatch);
  t.true(payload.includes("new Set(['size', 'tmp', 'rekey', 'reset'])"));
  // inbound mail never touches the live file of a rekeying alias
  const tmpAction = section(payload, "case 'tmp': {", "case 'setup': {");
  t.regex(tmpAction, /const rekeying = await isAliasRekeying\(/);
  t.regex(
    tmpAction,
    /if \(!rekeying && this\.databaseMap\) {\s*const cachedDb =/
  );
  t.regex(tmpAction, /const recheckDb =\s*!rekeying &&/);
  // the live handle is borrowed with a reference (an eviction while the
  // delivery runs then closes it afterwards, not underneath it) and given
  // back whatever happens
  t.regex(
    tmpAction,
    /this\.databaseMap\.acquire\(session\.user\.alias_id, cachedDb\)/
  );
  t.regex(
    tmpAction,
    /this\.databaseMap\.acquire\(session\.user\.alias_id, recheckDb\)/
  );
  t.regex(
    tmpAction,
    /} finally {\s*if \(borrowedDb\)\s*this\.databaseMap\.release\(borrowedAliasId, borrowedDb\);/
  );
  // a negative answer is cached briefly and dropped when a rotation
  // announces itself (see sqlite-server.js)
  t.regex(payload, /const rekeyGateCache = new Map\(\)/);
  t.regex(payload, /parsePayload\.forgetRekeyState = forgetRekeyState/);
  t.regex(
    source('sqlite-server.js'),
    /parsePayload\.forgetRekeyState\(aliasId\)/
  );
  // when in doubt (Redis or MongoDB unavailable) inbound mail goes to the
  // temporary mailbox, which is always safe
  t.regex(
    tmpAction,
    /isAliasRekeying\(\s*this\.client,\s*session\.user\.alias_id,[^)]*{ assumeOnError: true }/
  );
  // a stale lock is released against the authoritative flag in MongoDB
  t.regex(payload, /Aliases\.findById\(aliasId\)\.select\('is_rekey'\)/);
  t.true(payload.includes('await releaseRekeyLock(client, aliasId, rekeyId)'));
});

test('sqlite-worker never overlaps a rekey with another job', (t) => {
  const poll = section(
    source('sqlite-worker.js'),
    'async function pollRekeyQueue',
    'async function recoverInterruptedRekeys'
  );
  t.regex(poll, /while \(activeJobs >= MAX_CONCURRENCY && !isShuttingDown\)/);
  t.regex(poll, /takeRekeyJob\(blockingClient/);
  // the job is registered as running before any await and stays registered
  // until it has left the processing list
  const registered = poll.indexOf('activeRekeyKeys.add(rekeyKey)');
  const finished = poll.indexOf('await finishRekeyJob(client, payloadStr)');
  const unregistered = poll.indexOf('activeRekeyKeys.delete(rekeyKey)');
  t.true(registered > -1 && registered < finished && finished < unregistered);
});

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

  // claimed operations are only reclaimed once they are far older than any
  // plausible rekey, so a slow but live rekey is never rolled back
  t.true(
    cleanup.includes('now - claimedAt < REKEY_PROCESSING_STALE_THRESHOLD')
  );
  // and a queued (not stuck) rekey is left to the worker, including one
  // that is waiting out the backoff of a transient error
  t.true(cleanup.includes('await findRekeyJob(client, { aliasId, rekeyId })'));
  t.true(
    cleanup.includes('if (job && Number(job.rekey_not_before) > now) continue;')
  );
  // the rollback is a compare-and-set on the claim state it observed, so a
  // rekey the worker (re)claimed in the meantime is left alone
  const rollback = section(
    cleanup,
    'await rollbackRekey(client, alias._id',
    'if (!rolledBack) continue;'
  );
  t.regex(
    rollback,
    /rekey_processing: true,\s*rekey_claimed_at: alias\.rekey_claimed_at/
  );
  t.regex(rollback, /rekey_processing: { \$ne: true }/);

  // the worker's own recovery leaves a claim that is only moments old, and
  // a swap that was recorded only moments ago, alone
  const recovery = source('helpers/recover-rekeys.js');
  t.regex(recovery, /if \(now - claimedAt < REKEY_STALE_THRESHOLD\) continue;/);
  t.regex(recovery, /if \(isSwapInProgress\(alias\)\) continue;/);
  const {
    REKEY_SWAP_GRACE,
    REKEY_QUEUED_MAX_AGE,
    REKEY_MAX_ATTEMPTS,
    REKEY_RETRY_MAX_DELAY
  } = require('#helpers/sqlite-worker-config');
  t.true(REKEY_SWAP_GRACE >= 60_000);
  // the backstop outlives the complete retry schedule with room to spare
  t.true(
    REKEY_QUEUED_MAX_AGE >
      REKEY_MAX_ATTEMPTS * (REKEY_RETRY_MAX_DELAY + 10 * 60_000)
  );
});

test('a request that is not retried never re-opens the live database', (t) => {
  const reopen = section(
    source('helpers/mongoose-to-sqlite.js'),
    'async onFailedAttempt(error) {',
    'function dummyProofModel(model) {'
  );
  // the reference `getDatabase` takes on a fresh handle is only released by
  // the request that retries with it
  t.regex(reopen, /retries > 0 &&\s*error\.message &&/);
  t.regex(reopen, /const freshDb = await getDatabase\(/);
  // a query against another file (temporary mailbox, rekeyed copy) is never
  // re-pointed at the live database
  t.regex(reopen, /isLiveDatabaseSession\(args\[1]\)/);
  const helper = section(
    source('helpers/mongoose-to-sqlite.js'),
    'function isLiveDatabaseSession(session) {',
    'function wrapWithRetry(fn, model) {'
  );
  t.regex(helper, /if \(!session\.db \|\| session\.db\.wsp\) return true;/);
  t.regex(helper, /session\.db\.name ===\s*getPathToDatabase\(/);
});

//
// Passwords reach SQLite through the driver's binary key API, never as
// text interpolated into a PRAGMA (which the characters `"` and `'` would
// break); custom passwords may not contain those characters either.
//
test('passwords reach SQLite through the binary key API', (t) => {
  const worker = source('helpers/worker.js');
  t.true(worker.includes('backupDb.rekey(Buffer.from(newPassword));'));
  t.notRegex(worker, /pragma\(`rekey=/);

  const pragma = source('helpers/setup-pragma.js');
  t.true(
    pragma.includes('db.key(Buffer.from(decrypt(session.user.password)))')
  );

  const password = source('helpers/create-password.js');
  t.true(
    password.includes(
      `existingPassword.includes("'") || existingPassword.includes('"')`
    )
  );
});
