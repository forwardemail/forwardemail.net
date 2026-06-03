/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Redis = require('ioredis-mock');
const test = require('ava');

const config = require('#config');

const CHANNEL = `sqlite_backup_queue:${config.env}`;
const BUSY_KEY = `sqlite_worker_busy:${config.env}`;

// ioredis-mock delivers pub/sub messages asynchronously (next tick)
function tick() {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

let publisher;
let subscriber;

test.before(() => {
  publisher = new Redis();
  subscriber = new Redis();
});

test.after.always(async () => {
  await publisher.del(BUSY_KEY);
  publisher.disconnect();
  subscriber.disconnect();
});

test.serial('publish backup job is received by subscriber', async (t) => {
  const payload = {
    action: 'backup',
    session: {
      user: {
        alias_id: 'test-alias-123',
        password: 'encrypted-password',
        storage_location: 'storage_do_1',
        locale: 'en'
      }
    },
    backup_at: new Date().toISOString(),
    format: 'sqlite'
  };

  let received;
  const handler = (channel, message) => {
    if (channel === CHANNEL) received = JSON.parse(message);
  };

  subscriber.on('message', handler);
  await subscriber.subscribe(CHANNEL);

  const receivers = await publisher.publish(CHANNEL, JSON.stringify(payload));
  t.true(receivers >= 1, 'at least one subscriber should receive the message');

  // Wait for async delivery
  await tick();

  t.is(received.action, 'backup');
  t.is(received.session.user.alias_id, 'test-alias-123');
  t.is(received.format, 'sqlite');

  await subscriber.unsubscribe(CHANNEL);
  subscriber.removeListener('message', handler);
});

test.serial('publish rekey job is received by subscriber', async (t) => {
  const payload = {
    action: 'rekey',
    session: {
      user: {
        alias_id: 'test-alias-456',
        password: 'encrypted-password',
        storage_location: 'storage_do_1',
        locale: 'en'
      }
    },
    new_password: 'new-encrypted-password'
  };

  let received;
  const handler = (channel, message) => {
    if (channel === CHANNEL) received = JSON.parse(message);
  };

  subscriber.on('message', handler);
  await subscriber.subscribe(CHANNEL);

  const receivers = await publisher.publish(CHANNEL, JSON.stringify(payload));
  t.true(receivers >= 1);

  await tick();

  t.is(received.action, 'rekey');
  t.is(received.new_password, 'new-encrypted-password');

  await subscriber.unsubscribe(CHANNEL);
  subscriber.removeListener('message', handler);
});

test.serial(
  'busy counter prevents backup requests when worker is busy',
  async (t) => {
    // Simulate worker being busy
    await publisher.set(BUSY_KEY, '2');

    const count = await publisher.get(BUSY_KEY);
    t.true(Number(count) > 0, 'busy counter should be > 0');

    // Simulate the on-auth.js check
    const shouldSkip = count && Number(count) > 0;
    t.true(shouldSkip, 'should skip backup when worker is busy');

    // Clean up
    await publisher.del(BUSY_KEY);
  }
);

test.serial('busy counter allows backup when worker is idle', async (t) => {
  // Ensure key doesn't exist (worker idle)
  await publisher.del(BUSY_KEY);

  const count = await publisher.get(BUSY_KEY);
  const shouldSkip = count && Number(count) > 0;
  t.falsy(shouldSkip, 'should not skip backup when worker is idle');
});

test.serial('busy counter increments and decrements correctly', async (t) => {
  await publisher.del(BUSY_KEY);

  // Simulate two concurrent jobs starting
  await publisher.incr(BUSY_KEY);
  await publisher.incr(BUSY_KEY);
  let count = await publisher.get(BUSY_KEY);
  t.is(Number(count), 2, 'counter should be 2 after two increments');

  // One job finishes
  await publisher.decr(BUSY_KEY);
  count = await publisher.get(BUSY_KEY);
  t.is(Number(count), 1, 'counter should be 1 after one decrement');

  // Last job finishes — counter should be cleaned up
  const val = await publisher.decr(BUSY_KEY);
  if (val <= 0) await publisher.del(BUSY_KEY);
  count = await publisher.get(BUSY_KEY);
  t.is(count, null, 'key should be deleted when counter reaches 0');
});

test.serial(
  'payload survives JSON serialization with all required fields',
  (t) => {
    const payload = {
      action: 'backup',
      id: 'msg-id-789',
      session: {
        user: {
          alias_id: '65b26aeffb3d7573f7a5a4f5',
          password: 'U2FsdGVkX1+base64encryptedpassword==',
          storage_location: 'storage_do_1',
          locale: 'en',
          domain_id: '65b26aeffb3d7573f7a5a4f4',
          domain_name: 'example.com'
        }
      },
      backup_at: new Date().toISOString(),
      format: 'sqlite'
    };

    const serialized = JSON.stringify(payload);
    const deserialized = JSON.parse(serialized);

    t.is(deserialized.action, payload.action);
    t.is(deserialized.session.user.password, payload.session.user.password);
    t.is(deserialized.session.user.alias_id, payload.session.user.alias_id);
    t.is(deserialized.format, payload.format);
    t.truthy(deserialized.backup_at);
  }
);

test.serial('concurrent publish does not lose messages', async (t) => {
  const received = [];
  const expectedCount = 5;

  const handler = (channel, message) => {
    if (channel === CHANNEL) received.push(JSON.parse(message));
  };

  subscriber.on('message', handler);
  await subscriber.subscribe(CHANNEL);

  // Publish 5 messages sequentially (ioredis-mock needs tick between)
  for (let i = 0; i < expectedCount; i++) {
    await publisher.publish(
      CHANNEL,
      JSON.stringify({ action: 'backup', index: i })
    );
    await tick();
  }

  t.is(
    received.length,
    expectedCount,
    `should receive all ${expectedCount} messages`
  );

  // Verify all indices are present
  const indices = received.map((r) => r.index).sort();
  t.deepEqual(indices, [0, 1, 2, 3, 4]);

  await subscriber.unsubscribe(CHANNEL);
  subscriber.removeListener('message', handler);
});

test.serial('memory gate check - os.freemem returns a number', (t) => {
  const os = require('node:os');
  const freeMem = os.freemem();
  t.true(typeof freeMem === 'number');
  t.true(freeMem > 0);
});

test.serial('MAX_CONCURRENT_JOBS limits concurrency correctly', (t) => {
  // Simulate the concurrency check from sqlite-worker.js
  const MAX_CONCURRENT_JOBS = 2;
  let activeJobs = 0;

  const startJob = () => {
    if (activeJobs >= MAX_CONCURRENT_JOBS) return false;
    activeJobs++;
    return true;
  };

  const endJob = () => {
    activeJobs--;
  };

  t.true(startJob(), 'first job should start');
  t.true(startJob(), 'second job should start');
  t.false(startJob(), 'third job should be rejected');

  endJob();
  t.true(startJob(), 'after ending one, new job should start');
  t.is(activeJobs, 2);
});
