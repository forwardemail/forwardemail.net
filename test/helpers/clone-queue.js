/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Clone jobs are a Redis list (see helpers/clone-queue.js), so a job that
// was waiting or running when the sqlite-worker stopped or died is run by
// the next worker (#575).
//

const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const logger = require('#helpers/logger');
const {
  CLONE_PROCESSING_LIST,
  CLONE_QUEUE,
  enqueueCloneJob,
  finishCloneJob,
  getCloneStartingKey,
  getPendingClone,
  recoverCloneJobs,
  requeueCloneJob,
  takeCloneJob
} = require('#helpers/clone-queue');
const {
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE
} = require('#helpers/rekey-recovery');

const imapSharedConfig = sharedConfig('IMAP');

test.before((t) => {
  t.context.client = new Redis(imapSharedConfig.redis, logger);
  t.context.blockingClient = new Redis(imapSharedConfig.redis, logger);
});

test.after.always((t) => {
  t.context.client.disconnect();
  t.context.blockingClient.disconnect();
});

test.beforeEach(async (t) => {
  await t.context.client.del(CLONE_QUEUE, CLONE_PROCESSING_LIST);
});

// (ids of this test file only)
const SOURCE = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const CLONE = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const OTHER = 'cccccccccccccccccccccccc';

test.serial(
  'clone jobs are taken in order and parked until they are done',
  async (t) => {
    const { client, blockingClient } = t.context;
    await enqueueCloneJob(client, 'first');
    await enqueueCloneJob(client, 'second');

    t.is(await takeCloneJob(blockingClient, 1), 'first');
    t.deepEqual(await client.lrange(CLONE_QUEUE, 0, -1), ['second']);
    t.deepEqual(await client.lrange(CLONE_PROCESSING_LIST, 0, -1), ['first']);

    await finishCloneJob(client, 'first');
    t.deepEqual(await client.lrange(CLONE_PROCESSING_LIST, 0, -1), []);

    // (one interrupted by a shutdown runs before anything already waiting)
    await requeueCloneJob(client, 'interrupted');
    t.is(await takeCloneJob(blockingClient, 1), 'interrupted');

    // (nor are they mixed with rekeys, whose lists other tests share)
    for (const list of [REKEY_QUEUE, REKEY_PROCESSING_LIST]) {
      const items = await client.lrange(list, 0, -1);
      t.false(items.includes('second'));
      t.false(items.includes('interrupted'));
    }
  }
);

test.serial(
  'the jobs a stopped worker left are put back first, in order',
  async (t) => {
    const { client, blockingClient } = t.context;
    await enqueueCloneJob(client, 'first');
    await enqueueCloneJob(client, 'second');
    await enqueueCloneJob(client, 'waiting');
    t.is(await takeCloneJob(blockingClient, 1), 'first');
    t.is(await takeCloneJob(blockingClient, 1), 'second');

    // (the worker died with both in the processing list)
    t.is(await recoverCloneJobs(client), 2);
    t.deepEqual(await client.lrange(CLONE_PROCESSING_LIST, 0, -1), []);
    t.deepEqual(await client.lrange(CLONE_QUEUE, 0, -1), [
      'first',
      'second',
      'waiting'
    ]);

    // (nothing to put back the next time)
    t.is(await recoverCloneJobs(client), 0);
  }
);

test.serial(
  'a clone is pending for both of its aliases until its job is done',
  async (t) => {
    const { client, blockingClient } = t.context;
    const pending = { alias_id: SOURCE, clone_alias_id: CLONE };
    await client.del(...[SOURCE, CLONE].map((id) => getCloneStartingKey(id)));

    t.is(await getPendingClone(client, SOURCE), undefined);

    // (while it is started, before its job is queued)
    await client.set(getCloneStartingKey(CLONE), `${SOURCE}:${CLONE}`);
    t.deepEqual(await getPendingClone(client, CLONE), pending);
    await client.del(getCloneStartingKey(CLONE));

    // (while it waits, and while it runs)
    const job = JSON.stringify({
      action: 'clone',
      clone_alias_id: CLONE,
      session: { user: { alias_id: SOURCE } }
    });
    await enqueueCloneJob(client, 'not json');
    await enqueueCloneJob(client, job);
    t.deepEqual(await getPendingClone(client, SOURCE), pending);
    t.deepEqual(await getPendingClone(client, CLONE), pending);
    t.is(await getPendingClone(client, OTHER), undefined);

    t.is(await takeCloneJob(blockingClient, 1), 'not json');
    t.is(await takeCloneJob(blockingClient, 1), job);
    t.deepEqual(await getPendingClone(client, SOURCE), pending);

    await finishCloneJob(client, job);
    t.is(await getPendingClone(client, SOURCE), undefined);
    t.is(await getPendingClone(client, CLONE), undefined);
  }
);
