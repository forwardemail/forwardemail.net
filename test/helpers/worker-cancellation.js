/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { fork } = require('node:child_process');

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const ServerShutdownError = require('#helpers/server-shutdown-error');
const {
  backup,
  rekey,
  setWorkerCancelled,
  vacuum
} = require('#helpers/worker');

const ROOT = path.join(__dirname, '../..');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.serial(
  'a cancelled worker starts no job; an uncancelled one does',
  async (t) => {
    setWorkerCancelled();
    t.teardown(() => setWorkerCancelled(false));

    // every job checks the flag before touching anything
    for (const job of [backup, rekey, vacuum])
      await t.throwsAsync(job({}), { instanceOf: ServerShutdownError });

    setWorkerCancelled(false);

    // the same (invalid) job now runs and fails on its own validation instead
    const err = await t.throwsAsync(rekey({}));
    t.false(err instanceof ServerShutdownError);
  }
);

//
// The worker process (sqlite-worker.js) owns the process lifecycle: it sets
// the cancellation flag from its shutdown handler and waits for the
// in-flight job.  The jobs module must therefore not exit the process on
// its own when a signal arrives (a second Graceful handler used to do so
// after its own, shorter, timeout and cut the worker's drain short).
//
test('loading the jobs module does not make SIGTERM exit the process', async (t) => {
  t.timeout(ms('2m'));

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'worker-signal-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const script = path.join(dir, 'child.js');
  fs.writeFileSync(
    script,
    `
const process = require('node:process');
require(process.argv[2]);
process.on('SIGTERM', () => {
  setTimeout(() => {
    process.send('alive after SIGTERM');
    process.exit(0);
  }, 1500);
});
process.send('ready');
`
  );

  const messages = [];
  let exitCode = null;
  const child = fork(script, [path.join(ROOT, 'helpers/worker.js')], {
    cwd: ROOT,
    env: { ...process.env, NODE_ENV: 'test' },
    stdio: ['ignore', 'ignore', 'inherit', 'ipc']
  });
  t.teardown(() => {
    if (exitCode === null) child.kill('SIGKILL');
  });
  child.on('message', (message) => messages.push(message));
  child.on('exit', (code) => {
    exitCode = code;
  });

  await pWaitFor(() => messages.includes('ready') || exitCode !== null, {
    timeout: ms('90s')
  });
  t.is(exitCode, null);

  child.kill('SIGTERM');
  await pWaitFor(() => exitCode !== null, { timeout: ms('30s') });

  // the process ended on its own terms, not through a handler in the module
  t.deepEqual(messages, ['ready', 'alive after SIGTERM']);
  t.is(exitCode, 0);
});

test('the worker process cancels the jobs module from its shutdown handler', (t) => {
  const jobs = fs.readFileSync(path.join(ROOT, 'helpers/worker.js'), 'utf8');
  t.false(jobs.includes('@ladjs/graceful'));
  t.false(jobs.includes('new Graceful('));
  t.true(
    jobs.includes(
      'module.exports = { rekey, backup, setWorkerCancelled, vacuum };'
    )
  );

  const worker = fs.readFileSync(path.join(ROOT, 'sqlite-worker.js'), 'utf8');
  const handler = worker.indexOf('customHandlers: [');
  const cancel = worker.indexOf('setWorkerCancelled();', handler);
  const drain = worker.indexOf('SHUTDOWN_DRAIN_TIMEOUT;', cancel);
  t.true(handler > -1);
  t.true(cancel > handler, 'the shutdown handler cancels the in-flight job');
  t.true(drain > cancel, 'before it waits for the job to finish');
});
