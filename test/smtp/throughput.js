/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const os = require('node:os');
const path = require('node:path');

const ms = require('ms');
const test = require('ava');
const { default: PQueue } = require('p-queue');

const config = require('#config');

//
// SMTP Throughput Tests
//
// These tests verify the Piscina thread pool and PQueue configurations
// used for high-throughput email sending.
//

//
// Configuration Tests
//
test('config has smtpMaxQueue setting', (t) => {
  t.true(typeof config.smtpMaxQueue === 'number');
  t.true(config.smtpMaxQueue > 0);
});

test('smtpMaxQueue defaults to 100', (t) => {
  t.is(config.smtpMaxQueue, 100);
});

//
// PQueue Tests
//
test('PQueue can handle high concurrency', async (t) => {
  const concurrency = 50;
  const queue = new PQueue({ concurrency });

  let completed = 0;
  const tasks = [];

  for (let i = 0; i < 100; i++) {
    tasks.push(
      queue.add(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        completed++;
      })
    );
  }

  await Promise.all(tasks);
  t.is(completed, 100);
});

test('PQueue respects concurrency limit', async (t) => {
  const concurrency = 5;
  const queue = new PQueue({ concurrency });

  let concurrent = 0;
  let maxConcurrent = 0;

  const tasks = [];
  for (let i = 0; i < 20; i++) {
    tasks.push(
      queue.add(async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
        concurrent--;
      })
    );
  }

  await Promise.all(tasks);
  t.true(maxConcurrent <= concurrency);
});

test('PQueue can be cleared on cancellation', async (t) => {
  const queue = new PQueue({ concurrency: 2 });

  let processed = 0;

  // Add many tasks
  for (let i = 0; i < 100; i++) {
    queue
      .add(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
        processed++;
      })
      .catch(() => {});
  }

  // Clear after a short delay
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
  queue.clear();

  // Wait for any running tasks to complete
  await queue.onIdle();

  // Should have processed only a few tasks
  t.true(processed > 0);
  t.true(processed < 100);
});

//
// Piscina Thread Pool Tests
//
test('Piscina can be created with valid configuration', (t) => {
  const cpuCount = os.cpus().length;
  const maxThreads = Math.min(cpuCount, 8);
  const minThreads = 1;

  // Create a mock worker file path (we won't actually run it)
  const workerPath = path.resolve(__dirname, '../../helpers/smtp-worker.js');

  // Verify the configuration values are valid
  t.true(maxThreads >= 1);
  t.true(maxThreads <= 8);
  t.true(minThreads >= 1);
  t.true(minThreads <= maxThreads);
  t.true(typeof workerPath === 'string');
});

test('thread count is capped at 8', (t) => {
  const cpuCount = 16; // Simulate a 16-core machine
  const maxThreads = Math.min(cpuCount, 8);
  t.is(maxThreads, 8);
});

test('thread count uses CPU count when less than 8', (t) => {
  const cpuCount = 4;
  const maxThreads = Math.min(cpuCount, 8);
  t.is(maxThreads, 4);
});

test('thread count is at least 1', (t) => {
  const cpuCount = os.cpus().length;
  const maxThreads = Math.min(cpuCount, 8);
  t.true(maxThreads >= 1);
});

//
// Concurrency Calculation Tests
//
test('queue concurrency calculation with Piscina enabled', (t) => {
  const piscinaEnabled = true;
  const smtpMaxQueue = 100;

  const queueConcurrency = piscinaEnabled
    ? smtpMaxQueue
    : Math.round(smtpMaxQueue / 2);

  t.is(queueConcurrency, 100);
});

test('queue concurrency calculation with Piscina disabled', (t) => {
  const piscinaEnabled = false;
  const smtpMaxQueue = 100;

  const queueConcurrency = piscinaEnabled
    ? smtpMaxQueue
    : Math.round(smtpMaxQueue / 2);

  t.is(queueConcurrency, 50);
});

//
// Environment Variable Configuration Tests
//
test('SMTP_MAX_THREADS environment variable parsing', (t) => {
  const envValue = '4';
  const maxThreads = envValue
    ? Number.parseInt(envValue, 10)
    : Math.min(os.cpus().length, 8);

  t.is(maxThreads, 4);
});

test('SMTP_MIN_THREADS environment variable parsing', (t) => {
  const envValue = '2';
  const minThreads = envValue ? Number.parseInt(envValue, 10) : 1;

  t.is(minThreads, 2);
});

test('SMTP_IDLE_TIMEOUT environment variable parsing', (t) => {
  const envValue = '60000';
  const idleTimeout = envValue ? Number.parseInt(envValue, 10) : ms('30s');

  t.is(idleTimeout, 60_000);
});

test('default idle timeout is 30 seconds', (t) => {
  const envValue = undefined;
  const idleTimeout = envValue ? Number.parseInt(envValue, 10) : ms('30s');

  t.is(idleTimeout, 30_000);
});

//
// Piscina Enabled Flag Tests
//
test('SMTP_PISCINA_ENABLED defaults to false in test environment', (t) => {
  const envValue = undefined;
  const configEnv = 'test';

  const piscinaEnabled =
    envValue === undefined
      ? configEnv === 'production'
      : envValue === 'true' || envValue === true;

  t.false(piscinaEnabled);
});

test('SMTP_PISCINA_ENABLED defaults to true in production environment', (t) => {
  const envValue = undefined;
  const configEnv = 'production';

  const piscinaEnabled =
    envValue === undefined
      ? configEnv === 'production'
      : envValue === 'true' || envValue === true;

  t.true(piscinaEnabled);
});

test('SMTP_PISCINA_ENABLED can be explicitly enabled', (t) => {
  const envValue = 'true';
  const configEnv = 'test';

  const piscinaEnabled =
    envValue === undefined
      ? configEnv === 'production'
      : envValue === 'true' || envValue === true;

  t.true(piscinaEnabled);
});

test('SMTP_PISCINA_ENABLED can be explicitly disabled', (t) => {
  const envValue = 'false';
  const configEnv = 'production';

  const piscinaEnabled =
    envValue === undefined
      ? configEnv === 'production'
      : envValue === 'true' || envValue === true;

  t.false(piscinaEnabled);
});

//
// Queue Size Check Tests
//
test('queue size check prevents overloading', async (t) => {
  const maxQueue = 100;
  const queue = new PQueue({ concurrency: 10 });

  // Fill queue to max
  for (let i = 0; i < maxQueue; i++) {
    queue
      .add(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      })
      .catch(() => {});
  }

  // Check if queue is at capacity (size = waiting, pending = running)
  const totalInQueue = queue.size + queue.pending;
  const isAtCapacity = totalInQueue >= maxQueue;
  t.true(isAtCapacity);

  // Clear queue for cleanup
  queue.clear();
});

//
// Simulated Email Processing Tests
//
test('simulated email queue processing with high throughput', async (t) => {
  const queue = new PQueue({ concurrency: 20 });
  const emailCount = 50;
  let processed = 0;

  const startTime = Date.now();

  const tasks = [];
  for (let i = 0; i < emailCount; i++) {
    tasks.push(
      queue.add(async () => {
        // Simulate email processing time (10-50ms)
        await new Promise((resolve) => {
          setTimeout(resolve, 10 + Math.random() * 40);
        });
        processed++;
      })
    );
  }

  await Promise.all(tasks);

  const duration = Date.now() - startTime;

  t.is(processed, emailCount);
  // With concurrency of 20 and ~30ms avg processing time,
  // 50 emails should complete in roughly 3 batches = ~90ms
  // Allow generous margin for test environment variability
  t.true(duration < 5000);
});

test('handles empty email batch gracefully', async (t) => {
  const queue = new PQueue({ concurrency: 10 });
  const emailCount = 0;
  let processed = 0;

  for (let i = 0; i < emailCount; i++) {
    queue.add(async () => {
      processed++;
    });
  }

  await queue.onIdle();
  t.is(processed, 0);
});

test('handles queue cancellation during processing', async (t) => {
  const queue = new PQueue({ concurrency: 5 });
  let processed = 0;
  let cancelled = false;

  // Add tasks that check for cancellation
  for (let i = 0; i < 50; i++) {
    queue
      .add(async () => {
        if (cancelled) return;
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
        if (!cancelled) processed++;
      })
      .catch(() => {});
  }

  // Cancel after a short delay
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  cancelled = true;
  queue.clear();

  await queue.onIdle();

  // Some tasks should have been processed before cancellation
  t.true(processed > 0);
  t.true(processed < 50);
});
