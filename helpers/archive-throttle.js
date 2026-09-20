/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Back-pressure for archive backups (MBOX and EML, see helpers/worker.js).
//
// `archive.append` only queues an entry; the archive then processes its
// entries one at a time, in order, at the pace of the compression, the
// encryption and the disk.  Appending a whole mailbox up front (a rebuilt
// message stream per entry for EML, an MBOX stream written without waiting
// for the archive to read it) kept as much of the mailbox in memory as the
// archive was behind, which for a large mailbox was most of it.
//
// `append` waits until the archive has caught up before it queues another
// entry, and `write` waits for the archive to drain a stream it is reading
// before more is written to it.  Both surface an error of the archive (or
// of the output it is written to, e.g. a full disk) to the producer, which
// would otherwise wait forever for entries that are never processed.  The
// number of pending entries is read from the archive's own progress events,
// corrected by the entries appended since the last one.
//
function createArchiveThrottle(archive, options = {}) {
  const { maxPending = 16, output } = options;
  if (!Number.isInteger(maxPending) || maxPending < 1)
    throw new TypeError('maxPending must be a positive integer');

  let pending = 0;
  let error;
  const waiters = new Set();

  const wake = () => {
    for (const resolve of waiters) resolve();
    waiters.clear();
  };

  const fail = (err) => {
    if (!error) error = err;
    wake();
  };

  archive.on('progress', (data) => {
    pending = Math.max(0, data.entries.total - data.entries.processed);
    wake();
  });
  archive.on('error', fail);
  if (output) output.on('error', fail);

  const wait = () =>
    new Promise((resolve) => {
      waiters.add(resolve);
    });

  return {
    get error() {
      return error;
    },

    get pending() {
      return pending;
    },

    //
    // Queue an entry once the archive has room for it.  A function is called
    // for the source at that moment, so that a stream is not created (and
    // does not start producing) before the archive is ready for it.
    //
    async append(source, data) {
      // (both are updated by the archive's events while waiting)
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!error && pending >= maxPending) await wait();
      if (error) throw error;
      pending++;
      archive.append(typeof source === 'function' ? source() : source, data);
      // (the archive refuses an entry synchronously)
      if (error) throw error;
    },

    // Write to a stream queued in the archive, waiting for it to drain.
    async write(stream, chunk) {
      if (error) throw error;
      if (stream.write(chunk)) return;
      await new Promise((resolve) => {
        const done = () => {
          stream.off('drain', done);
          waiters.delete(done);
          resolve();
        };

        stream.once('drain', done);
        waiters.add(done);
      });
      if (error) throw error;
    }
  };
}

module.exports = createArchiveThrottle;
