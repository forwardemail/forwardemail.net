/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Jobs over every domain that cannot finish in one run continue where the
// previous run stopped, instead of starting over from the first domain each
// time (and never reaching the last ones), and jobs over every user read only
// what they need. Runs real bree jobs against real MongoDB and Redis, the way
// bree.js runs them.
//

const { execFile } = require('node:child_process');
const { randomBytes, randomUUID } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const Redis = require('ioredis');
const mongoose = require('mongoose');
const test = require('ava');
const { MongoMemoryServer } = require('mongodb-memory-server');

const ROOT = path.join(__dirname, '..', '..');

const RUNNER = `
const process = require('node:process');

const [root, jobPath] = process.argv.slice(2);
const Bree = require(require.resolve('bree', { paths: [root] }));

const quiet = { info() {}, warn() {}, error() {}, debug() {} };
const bree = new Bree({
  root: false,
  logger: quiet,
  errorHandler() {},
  jobs: [{ name: 'job', path: jobPath }]
});
bree.on('worker deleted', () => process.exit(0));
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
    fs.mkdtempSync(path.join(os.tmpdir(), 'job-resume-')),
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

function runJob(job, env) {
  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [runnerPath, ROOT, path.join(ROOT, 'jobs', `${job}.js`)],
      {
        cwd: ROOT,
        env: { ...process.env, NODE_ENV: 'test', AXE_SILENT: 'true', ...env },
        timeout: 300_000,
        maxBuffer: 64 * 1024 * 1024
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

test.serial(
  'check-domains-cloudflare-family continues after the last domain it checked',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = {
      MONGO_URI: mongod.getUri(`jobs_${run}`),
      LOGS_URI: mongod.getUri(`jobs_logs_${run}`),
      // a batch is ten times the concurrency: 20 domains a batch
      CONCURRENCY: '2',
      // stop after the first batch of each run
      CHECK_DOMAINS_CLOUDFLARE_FAMILY_MAX_RUNTIME: '1ms'
    };
    const key = 'check_domains_cloudflare_family:last_id';
    await redis.del(key);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await redis.del(key);
      await conn.dropDatabase();
      await conn.close();
    });

    const now = new Date();
    const ids = [];
    const domains = [];
    for (let i = 0; i < 50; i++) {
      const _id = new mongoose.Types.ObjectId();
      ids.push(_id.toString());
      domains.push({
        _id,
        id: _id.toString(),
        // (.invalid never resolves: each check ends quickly)
        name: `d${i}-${run}.invalid`,
        plan: 'free',
        has_txt_record: true,
        members: [],
        created_at: now,
        updated_at: now
      });
    }

    await conn.db.collection('domains').insertMany(domains);

    // the first run checks the first batch and saves where it stopped
    await runJob('check-domains-cloudflare-family', env);
    t.is(await redis.get(key), ids[19]);

    // the next one continues from there
    await runJob('check-domains-cloudflare-family', env);
    t.is(await redis.get(key), ids[39]);

    // the last one reaches the end, so the one after starts over
    await runJob('check-domains-cloudflare-family', env);
    t.is(await redis.get(key), null);
  }
);

test.serial(
  'daily-log-alert does not read the logs of users who got a report less than 3 days ago',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = {
      MONGO_URI: mongod.getUri(`jobs_${run}`),
      LOGS_URI: mongod.getUri(`jobs_logs_${run}`)
    };
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    const logsConn = await mongoose.createConnection(env.LOGS_URI).asPromise();
    t.teardown(async () => {
      await conn.dropDatabase();
      await logsConn.dropDatabase();
      await conn.close();
      await logsConn.close();
    });

    const now = Date.now();
    const oid = () => new mongoose.Types.ObjectId();
    const user = (name, sentAt) => {
      const _id = oid();
      return {
        _id,
        id: _id.toString(),
        email: `${name}@${run}.example`,
        group: 'user',
        plan: 'enhanced_protection',
        has_verified_email: true,
        is_banned: false,
        ...(sentAt ? { daily_log_alert_sent_at: sentAt } : {}),
        created_at: new Date(now - 90 * 86_400_000),
        updated_at: new Date(now)
      };
    };

    const recent = user('recent', new Date(now - 86_400_000));
    const due = user('due');
    await conn.db.collection('users').insertMany([recent, due]);

    const domain = (owner) => {
      const _id = oid();
      return {
        _id,
        id: _id.toString(),
        name: `${owner.email.split('@')[0]}-${run}.example`,
        plan: 'enhanced_protection',
        members: [{ user: owner._id, group: 'admin' }],
        created_at: new Date(now),
        updated_at: new Date(now)
      };
    };

    const recentDomain = domain(recent);
    const dueDomain = domain(due);
    await conn.db.collection('domains').insertMany([recentDomain, dueDomain]);

    // a delivery and a bounce for each, so each has activity to report
    const logs = [];
    for (const d of [recentDomain, dueDomain]) {
      for (const [message, category] of [
        ['delivered', 'none'],
        ['bounce', 'recipient']
      ]) {
        const _id = oid();
        logs.push({
          _id,
          id: _id.toString(),
          hash: randomUUID(),
          message,
          bounce_category: category,
          domains: [d._id],
          err: { responseCode: 550, message: 'User unknown' },
          meta: { level: 'info' },
          created_at: new Date(now - 3_600_000),
          updated_at: new Date(now - 3_600_000)
        });
      }
    }

    await logsConn.db.collection('logs').insertMany(logs);
    await logsConn.db
      .collection('logs')
      .createIndex({ domains: 1, created_at: 1 });

    // every query of the logs collection from here on
    await logsConn.db.command({ profile: 2 });
    await runJob('daily-log-alert', env);
    await logsConn.db.command({ profile: 0 });

    const reads = await logsConn.db
      .collection('system.profile')
      .find({ ns: `${logsConn.db.databaseName}.logs`, op: 'query' })
      .toArray();
    const queried = JSON.stringify(reads.map((read) => read.command?.filter));

    // the due user's logs were read (and the report sent), the other's not
    t.true(queried.includes(dueDomain._id.toString()));
    t.false(queried.includes(recentDomain._id.toString()));
    const sent = await conn.db.collection('users').findOne({ _id: due._id });
    t.truthy(sent.daily_log_alert_sent_at);
  }
);

test.serial(
  'domain-restrictions-reminder looks up only domains it could remind about',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = {
      MONGO_URI: mongod.getUri(`jobs_${run}`),
      LOGS_URI: mongod.getUri(`jobs_logs_${run}`)
    };
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await conn.dropDatabase();
      await conn.close();
    });

    const now = Date.now();
    const userId = new mongoose.Types.ObjectId();
    await conn.db.collection('users').insertOne({
      _id: userId,
      id: userId.toString(),
      email: `owner@${run}.example`,
      group: 'user',
      plan: 'enhanced_protection',
      has_verified_email: true,
      is_banned: false,
      created_at: new Date(now),
      updated_at: new Date(now)
    });

    // (names outside the good list, so each one has a restriction)
    const domain = (name, fields) => {
      const _id = new mongoose.Types.ObjectId();
      return {
        _id,
        id: _id.toString(),
        name: `${name}-${run}.invalid`,
        members: [{ user: userId, group: 'admin' }],
        has_mx_record: true,
        created_at: new Date(now),
        updated_at: new Date(now),
        ...fields
      };
    };

    const setUp = domain('set-up', {
      plan: 'enhanced_protection',
      has_txt_record: true
    });
    const reminded = domain('reminded', {
      plan: 'free',
      has_txt_record: false,
      restrictions_reminder_sent_at: new Date(now - 7 * 86_400_000)
    });
    const due = domain('due', { plan: 'free', has_txt_record: false });
    await conn.db.collection('domains').insertMany([setUp, reminded, due]);

    await runJob('domain-restrictions-reminder', env);

    // the job stores when it looked a domain up in DNS
    const checked = await conn.db
      .collection('domains')
      .find({ last_checked_at: { $exists: true } })
      .project({ name: 1 })
      .toArray();
    t.deepEqual(
      checked.map((d) => d.name),
      [due.name]
    );
  }
);
