/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const logger = require('#helpers/logger');
const {
  REKEY_PROCESSING_LIST,
  REKEY_QUEUE
} = require('#helpers/rekey-recovery');
const {
  enqueueRekeyJob,
  finishRekeyJob,
  requeueRekeyJob,
  takeRekeyJob
} = require('#helpers/rekey-queue');

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
  await t.context.client.del(REKEY_QUEUE, REKEY_PROCESSING_LIST);
});

test.serial(
  'jobs are taken in FIFO order and parked in the processing list',
  async (t) => {
    const { client, blockingClient } = t.context;
    await enqueueRekeyJob(client, 'first');
    await enqueueRekeyJob(client, 'second');

    t.is(await takeRekeyJob(blockingClient, 1), 'first');
    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), ['second']);
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), ['first']);

    // the job leaves the processing list once its outcome is recorded
    await finishRekeyJob(client, 'first');
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), []);

    // a re-queued job runs before anything already waiting
    await requeueRekeyJob(client, 'urgent');
    t.is(await takeRekeyJob(blockingClient, 1), 'urgent');
    t.is(await takeRekeyJob(blockingClient, 1), 'second');
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), [
      'urgent',
      'second'
    ]);
  }
);

test.serial(
  'an empty queue resolves with null after the timeout',
  async (t) => {
    const { blockingClient } = t.context;
    const started = Date.now();
    t.is(await takeRekeyJob(blockingClient, 1), null);
    t.true(Date.now() - started >= 900);
  }
);

test.serial(
  'a Redis server without BLMOVE falls back to BLPOP + RPUSH',
  async (t) => {
    const { client, blockingClient } = t.context;
    await enqueueRekeyJob(client, 'legacy');

    // simulate a pre-6.2 server (the fallback is remembered afterwards)
    const legacyClient = Object.create(blockingClient);
    legacyClient.blmove = async () => {
      const err = new Error(
        "ERR unknown command 'blmove', with args beginning with: ..."
      );
      throw err;
    };

    t.is(await takeRekeyJob(legacyClient, 1), 'legacy');
    t.deepEqual(await client.lrange(REKEY_QUEUE, 0, -1), []);
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), ['legacy']);

    // still works (and still parks the job) on the next call
    await enqueueRekeyJob(client, 'next');
    t.is(await takeRekeyJob(legacyClient, 1), 'next');
    t.deepEqual(await client.lrange(REKEY_PROCESSING_LIST, 0, -1), [
      'legacy',
      'next'
    ]);
    // other errors are not swallowed
    legacyClient.blpop = async () => {
      throw new Error('connection lost');
    };

    await t.throwsAsync(takeRekeyJob(legacyClient, 1), {
      message: 'connection lost'
    });
  }
);
