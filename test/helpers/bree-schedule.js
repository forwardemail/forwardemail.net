/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Jobs with an interval run at fixed, spread out times of day instead of all
// at once whenever bree starts (see helpers/bree-schedule.js), and a job a
// restart cut short runs again on start (helpers/bree-catch-up.js).
//

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const Bree = require('bree');
const Redis = require('ioredis-mock');
const ms = require('ms');
const test = require('ava');

const jobs = require('../../jobs');
const {
  getOverdueJobs,
  recordCompletion,
  catchUp,
  trackStopped
} = require('#helpers/bree-catch-up');
const {
  intervalOf,
  isScheduled,
  previousRun,
  scheduleJobs,
  timesOfDay
} = require('#helpers/bree-schedule');

const later = require(require.resolve('@breejs/later', {
  paths: [require.resolve('bree')]
}));

later.date.localTime();

const quietLogger = {
  info() {},
  warn() {},
  error() {},
  debug() {}
};

function nextRuns(job, count, from) {
  return later.schedule(job.interval).next(count, from);
}

// the times of a day (seconds since midnight) bree runs a job at
function runTimes(job) {
  // (a day without a clock change)
  const start = new Date(2026, 0, 15, 0, 0, 0);
  const end = new Date(2026, 0, 16, 0, 0, 0);
  return [later.schedule(job.interval).next(500, start, end)]
    .flat()
    .filter((date) => date && date < end)
    .map((date) => Math.round((date - start) / 1000))
    .sort((a, b) => a - b);
}

test('jobs with the same interval run spread across it, each in a minute of its own', (t) => {
  const scheduled = scheduleJobs([
    { name: 'a', interval: '6h', timeout: 0 },
    { name: 'b', interval: '6h', timeout: 0 },
    { name: 'c', interval: '6h', timeout: '10m' },
    { name: 'd', interval: '6h', timeout: 0 }
  ]);

  // hours 0, 1, 3 and 4 of each six, at minutes 7, 22, 37 and 52
  t.deepEqual(
    scheduled.map((job) => job.offsetMs),
    [ms('7m'), ms('82m'), ms('217m'), ms('292m')]
  );
  for (const job of scheduled) {
    // (no run on start: `timeout` is dropped)
    t.is(job.timeout, undefined);
    t.is(job.everyMs, ms('6h'));
    t.is(intervalOf(job), ms('6h'));
    t.is(runTimes(job).length, 4);
  }

  // b runs at 01:22, 07:22, 13:22 and 19:22 every day
  const from = new Date(2026, 9, 21, 3, 0, 0);
  t.deepEqual(
    nextRuns(scheduled[1], 4, from).map((date) => [
      date.getHours(),
      date.getMinutes()
    ]),
    [
      [7, 22],
      [13, 22],
      [19, 22],
      [1, 22]
    ]
  );
});

test('hourly and rarer jobs never share a minute, even every 1.5 hours', (t) => {
  const scheduled = scheduleJobs([
    ...Array.from({ length: 20 }, (_, i) => ({
      name: `hourly-${String(i).padStart(2, '0')}`,
      interval: '1h'
    })),
    { name: 'stripe', interval: '1.5h', timeout: '1.5h' },
    { name: 'daily', interval: '1d' },
    { name: 'set', interval: '1d', offset: '125m' }
  ]);
  const owner = new Map();
  for (const job of scheduled) {
    for (const time of runTimes(job)) {
      const minute = Math.floor(time / 60) % 60;
      const other = owner.get(minute);
      t.true(
        other === undefined || other === job.name,
        `${job.name} and ${other} in minute ${minute}`
      );
      owner.set(minute, job.name);
    }
  }

  // (every 1.5 hours starts in two minutes of the hour, half an hour apart)
  const stripe = scheduled.find((job) => job.name === 'stripe');
  const minutes = new Set(
    runTimes(stripe).map((time) => Math.floor(time / 60) % 60)
  );
  t.is(minutes.size, 2);
  const [first, second] = [...minutes].sort((a, b) => a - b);
  t.is(second - first, 30);
  // (the job with its own offset keeps it)
  t.is(scheduled.find((job) => job.name === 'set').offsetMs, ms('125m'));
});

test('an offset can be set, and frequent and other jobs are left as they are', (t) => {
  const [offset, frequent, seconds, plain, odd] = scheduleJobs([
    { name: 'offset', interval: '1d', offset: '210m' },
    { name: 'frequent', interval: '1m', timeout: 0 },
    { name: 'seconds', interval: '15s', timeout: 0 },
    'plain',
    // (does not divide a day)
    { name: 'odd', interval: '7h', timeout: 0 }
  ]);
  t.is(offset.offsetMs, ms('210m'));
  t.deepEqual(runTimes(offset), [3.5 * 3600]);
  t.deepEqual(frequent, { name: 'frequent', interval: '1m', timeout: 0 });
  t.deepEqual(seconds, { name: 'seconds', interval: '15s', timeout: 0 });
  t.is(plain, 'plain');
  t.deepEqual(odd, { name: 'odd', interval: '7h', timeout: 0 });
  t.false(isScheduled(odd));
  t.true(isScheduled({ name: 'x', interval: '5m' }));
  // (an offset ms cannot read is refused instead of guessed)
  t.throws(
    () => scheduleJobs([{ name: 'bad', interval: '1d', offset: '3h30m' }]),
    {
      message: /invalid offset/
    }
  );
});

test('timesOfDay lists each time in a day once', (t) => {
  t.deepEqual(timesOfDay(ms('1d'), ms('90m')), [5400]);
  t.is(timesOfDay(ms('1.5h'), 0).length, 16);
  t.is(timesOfDay(ms('5m'), ms('150s')).length, 288);
  t.deepEqual(timesOfDay(ms('12h'), ms('13h')).sort(), [3600, 46_800]);
});

test('previousRun is the last time the job was due', (t) => {
  const [job] = scheduleJobs([{ name: 'a', interval: '6h', offset: '45m' }]);
  t.deepEqual(
    previousRun(job, new Date(2026, 9, 21, 7, 0, 0)),
    new Date(2026, 9, 21, 6, 45, 0)
  );
  // before the first time today: yesterday's last
  t.deepEqual(
    previousRun(job, new Date(2026, 9, 21, 0, 30, 0)),
    new Date(2026, 9, 20, 18, 45, 0)
  );
  t.deepEqual(
    previousRun(job, new Date(2026, 9, 21, 6, 45, 0)),
    new Date(2026, 9, 21, 6, 45, 0)
  );
  t.is(previousRun({ name: 'x', interval: '1m' }), null);
});

test('every job of the app gets a valid schedule bree accepts, spread out', async (t) => {
  const scheduled = scheduleJobs(jobs);
  t.is(scheduled.length, jobs.length);
  const bree = new Bree({ jobs: scheduled, logger: false });
  await bree.init();
  t.is(bree.config.jobs.length, jobs.length);

  // no two jobs every hour or less often start in the same minute
  const minutes = new Map();
  for (const job of scheduled) {
    if (typeof job !== 'object' || !(job.everyMs >= ms('1h'))) continue;
    for (const time of runTimes(job)) {
      const minute = Math.floor(time / 60);
      t.false(
        minutes.has(minute),
        `${job.name} and ${minutes.get(minute)} at minute ${minute}`
      );
      minutes.set(minute, job.name);
    }
  }

  t.true(minutes.size > 0);

  // each runs at exactly its times of day, written in a few short rules
  for (const job of scheduled) {
    if (typeof job !== 'object' || !job.everyMs) continue;
    t.deepEqual(
      runTimes(job),
      timesOfDay(job.everyMs, job.offsetMs).sort((a, b) => a - b),
      `${job.name}`
    );
    t.true(job.interval.schedules.length <= 2, `${job.name}`);
    t.true(JSON.stringify(job.interval).length < 200, `${job.name}`);
  }
});

test('a scheduled job does not run when bree starts', async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bree-schedule-'));
  t.teardown(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(root, 'hourly.js'),
    "require('node:worker_threads').parentPort.postMessage('done');"
  );
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: scheduleJobs([{ name: 'hourly', interval: '1h', timeout: 0 }])
  });
  let started = 0;
  bree.on('worker created', () => {
    started++;
  });
  await bree.start();
  await delay(500);
  await bree.stop();
  t.is(started, 0);
});

test('jobs that did not finish since they were due run again on start, oldest first', async (t) => {
  const client = new Redis();
  const scheduled = scheduleJobs([
    { name: 'six-a', interval: '6h', offset: '1h' },
    { name: 'six-b', interval: '6h', offset: '2h' },
    { name: 'daily', interval: '1d', offset: '3h' },
    { name: 'hourly', interval: '1h', offset: '10m' },
    { name: 'never', interval: '1d', offset: '4h' }
  ]);
  const now = new Date(2026, 9, 21, 9, 0, 0);
  // six-a was due at 07:00 and finished at 07:20: not overdue
  await recordCompletion(client, 'six-a', new Date(2026, 9, 21, 7, 20, 0));
  // six-b was due at 08:00 and last finished at 02:30: overdue
  await recordCompletion(client, 'six-b', new Date(2026, 9, 21, 2, 30, 0));
  // daily was due at 03:00 and last finished yesterday: overdue (earlier)
  await recordCompletion(client, 'daily', new Date(2026, 9, 20, 3, 30, 0));
  // hourly ones are left to their next time
  await recordCompletion(client, 'hourly', new Date(2026, 9, 20, 3, 30, 0));

  t.deepEqual(await getOverdueJobs(client, scheduled, { now }), [
    'daily',
    'six-b'
  ]);
});

test('catchUp runs each overdue job through bree, spaced apart', async (t) => {
  const client = new Redis();
  const scheduled = scheduleJobs([
    { name: 'one', interval: '1d', offset: '1h' },
    { name: 'two', interval: '1d', offset: '2h' }
  ]);
  await recordCompletion(client, 'one', new Date(Date.now() - ms('3d')));
  await recordCompletion(client, 'two', new Date(Date.now() - ms('2d')));
  const runs = [];
  const bree = {
    async run(name) {
      runs.push([name, Date.now()]);
    }
  };
  const names = await catchUp(bree, client, scheduled, {
    spacing: 200,
    logger: quietLogger
  });
  t.deepEqual(names, ['one', 'two']);
  t.deepEqual(runs, []);
  await delay(700);
  t.deepEqual(
    runs.map(([name]) => name),
    ['one', 'two']
  );
  t.true(runs[1][1] - runs[0][1] >= 150);
});

test('a run that a stop cut short is not counted as finished', async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bree-stopped-'));
  t.teardown(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(root, 'quick.js'),
    "require('node:worker_threads').parentPort.postMessage('done');"
  );
  // (stops early when asked, and says done, as the jobs do)
  fs.writeFileSync(
    path.join(root, 'long.js'),
    [
      "const { parentPort } = require('node:worker_threads');",
      'const timer = setInterval(() => {}, 1000);',
      "parentPort.on('message', (message) => {",
      "  if (message !== 'cancel') return;",
      '  clearInterval(timer);',
      "  parentPort.postMessage('done');",
      '});'
    ].join('\n')
  );
  const bree = new Bree({
    root,
    logger: quietLogger,
    jobs: ['quick', 'long']
  });
  const wasStopped = trackStopped(bree);
  const ended = new Map();
  bree.on('worker deleted', (name) => {
    ended.set(name, wasStopped(name));
  });

  await bree.run('quick');
  await delay(500);
  await bree.run('long');
  await delay(500);
  await bree.stop();
  await delay(100);

  t.deepEqual(Object.fromEntries(ended), { quick: false, long: true });
  // (and it is forgotten once read)
  t.false(wasStopped('long'));
});
