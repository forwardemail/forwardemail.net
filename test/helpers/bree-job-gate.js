/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const Bree = require('bree');
const test = require('ava');

const { createJobGate, trackExitCodes } = require('#helpers/bree-job-gate');

// A real bree with real worker threads, running tiny jobs from a temp dir.
function makeRoot(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bree-gate-'));
  for (const [name, source] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, `${name}.js`), source);
  }

  t.teardown(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

const sleeper = (ms) => `
const { parentPort } = require('node:worker_threads');
setTimeout(() => parentPort.postMessage('done'), ${ms});
`;

const quietLogger = {
  info() {},
  warn() {},
  error() {},
  debug() {}
};

function watch(bree) {
  const state = { running: 0, peak: 0, started: [] };
  bree.on('worker created', (name) => {
    state.running++;
    state.peak = Math.max(state.peak, state.running);
    state.started.push(name);
  });
  bree.on('worker deleted', () => {
    state.running--;
  });
  return state;
}

async function waitFor(fn, ms = 20_000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (fn()) return true;

    await delay(25);
  }

  return false;
}

test('never runs more job workers at once than the cap, and runs every job', async (t) => {
  const names = ['a', 'b', 'c', 'd', 'e', 'f'];
  const root = makeRoot(
    t,
    Object.fromEntries(names.map((n) => [n, sleeper(300)]))
  );
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: names.map((name) => ({ name, interval: '1h', timeout: 0 }))
  });
  // watch first: its listeners must see a worker leave before the gate starts
  // the next one in the same tick
  const state = watch(bree);
  createJobGate(bree, { maxConcurrent: 2, reservedForFrequent: 0 });

  await bree.start();
  t.true(await waitFor(() => state.started.length === names.length));
  t.true(await waitFor(() => state.running === 0));
  await bree.stop();

  t.is(state.peak, 2);
  t.deepEqual([...state.started].sort(), names);
});

test('keeps slots for frequent jobs so long jobs cannot hold them all', async (t) => {
  const root = makeRoot(t, {
    'slow-1': sleeper(1500),
    'slow-2': sleeper(1500),
    'slow-3': sleeper(1500),
    frequent: sleeper(50)
  });
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: [
      { name: 'slow-1', interval: '1h', timeout: 0 },
      { name: 'slow-2', interval: '1h', timeout: 0 },
      { name: 'slow-3', interval: '1h', timeout: 0 },
      { name: 'frequent', interval: '1m', timeout: 0 }
    ]
  });
  const gate = createJobGate(bree, {
    maxConcurrent: 3,
    reservedForFrequent: 1
  });
  const state = watch(bree);

  await bree.start();
  // two slow jobs take the two general slots; the frequent job gets the
  // reserved one straight away instead of waiting behind slow-3
  t.true(await waitFor(() => state.started.includes('frequent'), 1000));
  t.false(state.started.includes('slow-3'));
  t.true(gate.queued.has('slow-3'));

  t.true(await waitFor(() => state.started.includes('slow-3')));
  await bree.stop();
});

test('queues a job once however often its schedule fires while it waits', async (t) => {
  const root = makeRoot(t, { long: sleeper(800), tick: sleeper(10) });
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: [
      { name: 'long', interval: '1h', timeout: 0 },
      // no timeout: it only runs when asked below
      { name: 'tick', interval: '1h' }
    ]
  });
  const state = watch(bree);
  const gate = createJobGate(bree, {
    maxConcurrent: 1,
    reservedForFrequent: 0
  });

  await bree.start();
  t.true(await waitFor(() => state.started.includes('long')));
  await bree.run('tick');
  await bree.run('tick');
  t.is(gate.queued.size, 1);

  t.true(await waitFor(() => state.running === 0 && gate.queued.size === 0));
  await bree.stop();
  t.is(state.started.filter((n) => n === 'tick').length, 1);
});

test('stop drops queued jobs instead of starting them during shutdown', async (t) => {
  const root = makeRoot(t, { first: sleeper(300), second: sleeper(10) });
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: [
      { name: 'first', interval: '1h', timeout: 0 },
      { name: 'second', interval: '1h', timeout: 0 }
    ]
  });
  const gate = createJobGate(bree, {
    maxConcurrent: 1,
    reservedForFrequent: 0
  });
  const state = watch(bree);

  await bree.start();
  t.true(await waitFor(() => gate.queued.has('second')));
  await bree.stop();
  await delay(400);

  t.deepEqual(state.started, ['first']);
});

test('runs jobs again after a stop and a new start', async (t) => {
  const root = makeRoot(t, { first: sleeper(200), second: sleeper(10) });
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: [
      { name: 'first', interval: '1h', timeout: 0 },
      { name: 'second', interval: '1h', timeout: 0 }
    ]
  });
  createJobGate(bree, { maxConcurrent: 1, reservedForFrequent: 0 });
  const state = watch(bree);

  await bree.start();
  await bree.stop();
  state.started.length = 0;

  await bree.start();
  t.true(
    await waitFor(
      () => state.started.includes('first') && state.started.includes('second')
    )
  );
  await bree.stop();
});

test('an hourly job waiting at the head is not starved by frequent jobs', async (t) => {
  // one general slot and one reserved; three frequent jobs keep coming back
  const root = makeRoot(t, {
    'freq-1': sleeper(150),
    'freq-2': sleeper(150),
    'freq-3': sleeper(150),
    hourly: sleeper(10)
  });
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: [
      { name: 'freq-1', interval: '1m', timeout: 0 },
      { name: 'freq-2', interval: '1m', timeout: 0 },
      { name: 'freq-3', interval: '1m', timeout: 0 },
      { name: 'hourly', interval: '1h', timeout: 0 }
    ]
  });
  createJobGate(bree, { maxConcurrent: 2, reservedForFrequent: 1 });
  const state = watch(bree);
  // re-queue frequent jobs as soon as they finish, as their schedule would
  bree.on('worker deleted', (name) => {
    if (name.startsWith('freq-') && state.started.length < 30)
      setImmediate(() => bree.run(name));
  });

  await bree.start();
  t.true(await waitFor(() => state.started.includes('hourly'), 5000));
  await bree.stop();
});

test('a slot is held until a finished worker thread has exited', async (t) => {
  const root = makeRoot(t, { a: sleeper(50), b: sleeper(50) });
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: [
      { name: 'a', interval: '1h', timeout: 0 },
      { name: 'b', interval: '1h', timeout: 0 }
    ]
  });
  const gate = createJobGate(bree, {
    maxConcurrent: 1,
    reservedForFrequent: 0
  });
  let aThreadAlive = false;
  let overlap = false;
  bree.on('worker created', (name) => {
    const worker = bree.workers.get(name);
    if (name === 'a') {
      aThreadAlive = true;
      worker.once('exit', () => {
        aThreadAlive = false;
      });
    } else if (aThreadAlive) {
      overlap = true;
    }
  });

  await bree.start();
  t.true(await waitFor(() => gate.active.size === 0 && gate.queued.size === 0));
  await bree.stop();
  t.false(overlap);
});

test('records the exit code of a failed job', async (t) => {
  const root = makeRoot(t, {
    fails: `process.exitCode = 1; throw new Error('boom');`
  });
  const bree = new Bree({
    root,
    logger: quietLogger,
    errorHandler() {},
    jobs: [{ name: 'fails', interval: '1h', timeout: 0 }]
  });
  const exitCodes = trackExitCodes(bree);
  const deleted = [];
  bree.on('worker deleted', (name) =>
    deleted.push([name, exitCodes.get(name)])
  );

  await bree.start();
  t.true(await waitFor(() => deleted.length === 1));
  await bree.stop();

  t.is(deleted[0][0], 'fails');
  t.is(deleted[0][1], 1);
});

test('a worker over its heap cap stops alone instead of aborting the process', async (t) => {
  const root = makeRoot(t, {
    hog: `
const chunks = [];
for (;;) chunks.push(Array.from({ length: 1e5 }, (_, i) => ({ i })));
`
  });
  const bree = new Bree({
    root,
    logger: quietLogger,
    errorHandler() {},
    worker: { resourceLimits: { maxOldGenerationSizeMb: 64 } },
    jobs: [{ name: 'hog', interval: '1h', timeout: 0 }]
  });
  const exitCodes = trackExitCodes(bree);
  const deleted = [];
  bree.on('worker deleted', (name) => deleted.push(exitCodes.get(name)));

  await bree.start();
  t.true(await waitFor(() => deleted.length === 1, 60_000));
  await bree.stop();

  // this test process is still here, and the job is reported as failed
  t.not(deleted[0], 0);
});
