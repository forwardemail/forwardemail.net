/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Runs real bree jobs against real MongoDB and Redis, the way bree.js runs
// them (a Bree worker with the job heap cap), on data sets large enough that
// a job holding everything it reads in memory runs out of heap, while a job
// that works a page or a batch at a time finishes and does its work.
//

const { execFile } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const Redis = require('ioredis');
const mongoose = require('mongoose');
const test = require('ava');
const { MongoMemoryServer } = require('mongodb-memory-server');

const ROOT = path.join(__dirname, '..', '..');

// heap cap for the job workers below: room for a job worker's own start-up
// (the app it loads) and a page or batch of the data, not for all of it
const HEAP_CAP_MB = 450;

const RUNNER = `
const path = require('node:path');
const process = require('node:process');

const [root, jobPath, cap] = process.argv.slice(2);
const Bree = require(require.resolve('bree', { paths: [root] }));
const { capWorkerHeap, trackExitCodes } = require(
  path.join(root, 'helpers', 'bree-job-gate.js')
);

capWorkerHeap(Number(cap));

const quiet = { info() {}, warn() {}, error() {}, debug() {} };
const bree = new Bree({
  root: false,
  logger: quiet,
  errorHandler() {},
  jobs: [{ name: 'job', path: jobPath }]
});
const exitCodes = trackExitCodes(bree);
bree.on('worker deleted', () => {
  const exitCode = exitCodes.has('job') ? exitCodes.get('job') : 0;
  process.stdout.write(JSON.stringify({ exitCode }) + '\\n');
  process.exit(0);
});
bree.run('job');
`;

let mongod;
let redis;
let runnerPath;

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  redis = new Redis();
  await redis.ping();
  runnerPath = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'job-memory-')),
    'run-job.js'
  );
  fs.writeFileSync(runnerPath, RUNNER);
});

test.after.always(async () => {
  if (redis) redis.disconnect();
  if (mongod) await mongod.stop();
  if (runnerPath)
    fs.rmSync(path.dirname(runnerPath), { recursive: true, force: true });
});

function databases(run) {
  return {
    MONGO_URI: mongod.getUri(`jobs_${run}`),
    LOGS_URI: mongod.getUri(`jobs_logs_${run}`)
  };
}

function runJob(job, env) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [runnerPath, ROOT, path.join(ROOT, 'jobs', `${job}.js`), HEAP_CAP_MB],
      {
        cwd: ROOT,
        env: { ...process.env, NODE_ENV: 'test', AXE_SILENT: 'true', ...env },
        timeout: 300_000,
        maxBuffer: 64 * 1024 * 1024
      },
      (err, stdout) => {
        const line = String(stdout).trim().split('\n').pop();
        let result = {};
        try {
          result = JSON.parse(line);
        } catch {}

        resolve({ ...result, error: err ? err.message : undefined });
      }
    );
  });
}

async function removeKeys(pattern) {
  for await (const keys of redis.scanStream({ match: pattern, count: 10000 })) {
    if (keys.length > 0) await redis.unlink(...keys);
  }
}

async function countKeys(pattern) {
  let count = 0;
  for await (const keys of redis.scanStream({ match: pattern, count: 10000 }))
    count += keys.length;
  return count;
}

test.serial(
  'cleanup-denylist finishes on a large denylist and deletes only allowlisted keys',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    t.teardown(async () => {
      await removeKeys(`*${run}*`);
    });

    // 100K denylist entries of 4 KB each (400 MB of keys): not allowlisted,
    // so they stay; one allowlisted entry to delete and one to keep
    const pad = 'x'.repeat(4000);
    for (let i = 0; i < 100_000; i += 5000) {
      const p = redis.pipeline();
      for (let j = i; j < i + 5000; j++)
        p.set(`denylist:${run}-bulk-${j}-${pad}`, 'true');
      await p.exec();
    }

    await redis.set(`denylist:${run}-allowed.org`, 'true');
    await redis.set(`allowlist:${run}-allowed.org`, 'true');
    await redis.set(`denylist:${run}-keep.org`, 'true');

    const result = await runJob('cleanup-denylist', databases(run));

    t.is(result.exitCode, 0, 'job ran out of memory or failed');
    t.is(await redis.get(`denylist:${run}-allowed.org`), null);
    t.is(await redis.get(`denylist:${run}-keep.org`), 'true');
    t.is(await countKeys(`denylist:${run}-bulk-*`), 100_000);
  }
);

test.serial(
  'sync-paid-alias-allowlist finishes with many banned users and allowlists paid domains',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await removeKeys(`*${run}*`);
      await redis.del('banned_user_ids');
      await conn.dropDatabase();
      await conn.close();
    });

    const oid = () => new mongoose.Types.ObjectId();
    const now = new Date();
    const user = (fields) => {
      const _id = oid();
      return {
        _id,
        id: _id.toString(),
        group: 'user',
        created_at: now,
        updated_at: now,
        ...fields
      };
    };

    // 20K banned users (the job used to copy every banned id into each alias
    // query, for the 1000 domains of a batch at once)
    const banned = [];
    for (let i = 0; i < 20_000; i++)
      banned.push(
        user({ email: `banned${i}@${run}.example`, is_banned: true })
      );
    for (let i = 0; i < banned.length; i += 5000)
      await conn.db.collection('users').insertMany(banned.slice(i, i + 5000));

    const owner = user({
      email: `owner@${run}.example`,
      is_banned: false,
      plan: 'team'
    });
    await conn.db.collection('users').insertOne(owner);

    const domains = [];
    const aliases = [];
    for (let i = 0; i < 1000; i++) {
      const _id = oid();
      domains.push({
        _id,
        id: _id.toString(),
        name: `p${i}-${run}.com`,
        plan: 'team',
        has_txt_record: true,
        members: [{ user: owner._id, group: 'admin' }],
        created_at: now,
        updated_at: now
      });
      aliases.push({
        _id: oid(),
        name: 'hi',
        domain: _id,
        user: owner._id,
        is_enabled: true,
        recipients: [`someone@r${i}-${run}.org`],
        created_at: now,
        updated_at: now
      });
    }

    // an alias of a banned user on a paid domain is not allowlisted
    aliases.push({
      _id: oid(),
      name: 'spam',
      domain: domains[0]._id,
      user: banned[0]._id,
      is_enabled: true,
      recipients: [`someone@banned-${run}.org`],
      created_at: now,
      updated_at: now
    });

    await conn.db.collection('domains').insertMany(domains);
    await conn.db.collection('aliases').insertMany(aliases);

    // a paid domain on the denylist is taken off it
    await redis.set(`denylist:someone@p1-${run}.com`, 'true');
    await redis.del('banned_user_ids');

    const result = await runJob('sync-paid-alias-allowlist', env);

    t.is(result.exitCode, 0, 'job ran out of memory or failed');
    t.is(await countKeys(`allowlist:p*-${run}.com`), 1000);
    t.is(await countKeys(`allowlist:r*-${run}.org`), 1000);
    t.is(await redis.get(`allowlist:banned-${run}.org`), null);
    t.is(await redis.get(`denylist:someone@p1-${run}.com`), null);
  }
);
