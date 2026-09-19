/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');

const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const logger = require('#helpers/logger');
const {
  LEASE_KEY,
  acquireWorkerLease,
  releaseWorkerLease,
  renewWorkerLease,
  startWorkerLeaseRenewal
} = require('#helpers/sqlite-worker-lease');

const imapSharedConfig = sharedConfig('IMAP');

test.before((t) => {
  t.context.client = new Redis(imapSharedConfig.redis, logger);
});

test.after.always((t) => {
  t.context.client.disconnect();
});

test.beforeEach(async (t) => {
  await t.context.client.del(LEASE_KEY);
});

test.serial('only one sqlite-worker holds the lease at a time', async (t) => {
  const { client } = t.context;

  t.true(await acquireWorkerLease(client, { workerId: 'first' }));
  t.is(await client.get(LEASE_KEY), 'first');
  t.true((await client.pttl(LEASE_KEY)) > 0);

  // a second worker waits (here: until it is told to stop waiting)
  let cancelled = false;
  const waiting = acquireWorkerLease(client, {
    workerId: 'second',
    isCancelled: () => cancelled,
    interval: 50
  });
  await setTimeout(200);
  t.is(await client.get(LEASE_KEY), 'first');
  cancelled = true;
  t.false(await waiting);

  // only the holder can renew or release it
  t.false(await renewWorkerLease(client, { workerId: 'second' }));
  t.false(await releaseWorkerLease(client, { workerId: 'second' }));
  t.is(await client.get(LEASE_KEY), 'first');
  t.true(await renewWorkerLease(client, { workerId: 'first' }));
  t.true(await releaseWorkerLease(client, { workerId: 'first' }));
  t.is(await client.get(LEASE_KEY), null);

  // once released the next worker gets it right away
  t.true(
    await acquireWorkerLease(client, { workerId: 'second', interval: 50 })
  );
  t.is(await client.get(LEASE_KEY), 'second');
});

test.serial('a lease that vanished is taken again on renewal', async (t) => {
  const { client } = t.context;
  t.true(await acquireWorkerLease(client, { workerId: 'first' }));

  // Redis was restarted or flushed
  await client.del(LEASE_KEY);
  t.true(await renewWorkerLease(client, { workerId: 'first' }));
  t.is(await client.get(LEASE_KEY), 'first');
});

test.serial(
  'a worker whose lease was taken over stops renewing and is told',
  async (t) => {
    const { client } = t.context;
    t.true(await acquireWorkerLease(client, { workerId: 'first' }));

    const reasons = [];
    const stop = startWorkerLeaseRenewal(
      client,
      (reason) => reasons.push(reason),
      { workerId: 'first', interval: 50, ttl: 1000 }
    );
    t.teardown(stop);

    // the lease keeps moving while it is ours
    await setTimeout(200);
    t.deepEqual(reasons, []);
    t.is(await client.get(LEASE_KEY), 'first');

    // the lease expired while this worker stalled and another one took it
    await client.set(LEASE_KEY, 'second', 'PX', 60_000);
    await setTimeout(200);
    t.is(reasons.length, 1);
    t.regex(reasons[0], /took the worker lease over/);
    // the loser never touches the new holder's lease
    t.is(await client.get(LEASE_KEY), 'second');
  }
);
