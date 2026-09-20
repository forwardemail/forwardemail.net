/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { PassThrough, Writable } = require('node:stream');
const { setTimeout } = require('node:timers/promises');

const AdmZip = require('adm-zip');
const archiver = require('archiver');
const ms = require('ms');
const test = require('ava');

const createArchiveThrottle = require('#helpers/archive-throttle');

//
// A slow sink (a disk that cannot keep up): the archive can only produce as
// fast as this consumes.  Everything written is kept so the archive can be
// inspected afterwards.
//
function createSlowSink(delay = 2) {
  const chunks = [];
  const sink = new Writable({
    highWaterMark: 16 * 1024,
    async write(chunk, encoding, callback) {
      chunks.push(chunk);
      await setTimeout(delay);
      callback();
    }
  });
  sink.contents = () => Buffer.concat(chunks);
  return sink;
}

function finished(archive, sink) {
  return new Promise((resolve, reject) => {
    sink.once('error', reject);
    sink.once('finish', resolve);
    archive.once('error', reject);
  });
}

test('append queues a bounded number of entries ahead of the archive', async (t) => {
  t.timeout(ms('1m'));
  const archive = archiver.create('zip', { zlib: { level: 1 } });
  const sink = createSlowSink();
  archive.pipe(sink);
  const done = finished(archive, sink);
  const throttle = createArchiveThrottle(archive, {
    maxPending: 4,
    output: sink
  });

  const total = 60;
  let maxPending = 0;
  let created = 0;
  for (let i = 0; i < total; i++) {
    await throttle.append(
      () => {
        created++;
        return Buffer.alloc(32 * 1024, i);
      },
      { name: `entry-${i}.bin` }
    );
    maxPending = Math.max(maxPending, throttle.pending);
    // the source is only created once the entry is queued
    t.is(created, i + 1);
  }

  archive.finalize();
  await done;

  // never more than `maxPending` entries were queued ahead of the archive
  t.true(maxPending <= 4, `${maxPending} pending entries`);
  // the producer was made to wait for the archive
  t.true(maxPending >= 2, `${maxPending} pending entries`);

  // and nothing was lost
  const entries = new AdmZip(sink.contents()).getEntries();
  t.is(entries.length, total);
  t.true(entries.every((entry) => entry.header.size === 32 * 1024));
});

test('write waits for the archive to drain the stream', async (t) => {
  t.timeout(ms('1m'));
  const archive = archiver.create('zip', { zlib: { level: 1 } });
  const sink = createSlowSink();
  archive.pipe(sink);
  const done = finished(archive, sink);
  const throttle = createArchiveThrottle(archive, { output: sink });

  const stream = new PassThrough();
  await throttle.append(stream, { name: 'mailbox.mbox' });

  const chunk = Buffer.alloc(256 * 1024, 'x');
  const chunks = 12;
  for (let i = 0; i < chunks; i++) {
    await throttle.write(stream, chunk);
    // a write only returns once the archive has read the stream down to
    // its high-water mark (the whole mailbox was buffered before)
    t.true(
      stream.writableLength < stream.writableHighWaterMark + chunk.length,
      `${stream.writableLength} bytes buffered`
    );
  }

  stream.end();
  archive.finalize();
  await done;

  const [entry] = new AdmZip(sink.contents()).getEntries();
  t.is(entry.entryName, 'mailbox.mbox');
  t.is(entry.header.size, chunk.length * chunks);
});

test('a failure of the output reaches the producer instead of stalling it', async (t) => {
  t.timeout(ms('1m'));
  const archive = archiver.create('zip', { zlib: { level: 1 } });
  const sink = createSlowSink();
  archive.pipe(sink);
  // (the failure is observed through the throttle below)
  sink.on('error', () => {});
  const throttle = createArchiveThrottle(archive, {
    maxPending: 1,
    output: sink
  });

  const stream = new PassThrough();
  await throttle.append(stream, { name: 'mailbox.mbox' });
  await throttle.write(stream, Buffer.alloc(64 * 1024, 'x'));

  // the disk fails while the producer waits for the archive
  setTimeout(20).then(() => sink.destroy(new Error('ENOSPC: no space left')));
  await t.throwsAsync(
    throttle.append(Buffer.from('next'), { name: 'next.eml' }),
    { message: 'ENOSPC: no space left' }
  );
  t.is(throttle.error.message, 'ENOSPC: no space left');

  // and every later use fails right away
  await t.throwsAsync(throttle.write(stream, 'more'), {
    message: 'ENOSPC: no space left'
  });
  await t.throwsAsync(throttle.append(Buffer.from('x'), { name: 'x' }), {
    message: 'ENOSPC: no space left'
  });
});

test('an error of the archive itself reaches the producer', async (t) => {
  const archive = archiver.create('zip', { zlib: { level: 1 } });
  const sink = createSlowSink();
  archive.pipe(sink);
  archive.on('error', () => {});
  const throttle = createArchiveThrottle(archive, { output: sink });

  // an entry without a name is refused by the archive
  await t.throwsAsync(throttle.append(Buffer.from('x'), {}));
  t.truthy(throttle.error);
  await t.throwsAsync(throttle.append(Buffer.from('x'), { name: 'x' }));
  archive.abort();
});

test('validates the pending limit', (t) => {
  const archive = archiver.create('zip');
  t.throws(() => createArchiveThrottle(archive, { maxPending: 0 }), {
    instanceOf: TypeError
  });
  t.throws(() => createArchiveThrottle(archive, { maxPending: 1.5 }), {
    instanceOf: TypeError
  });
  archive.abort();
});
