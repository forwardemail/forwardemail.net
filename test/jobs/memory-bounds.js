/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Runs real bree jobs against real MongoDB and Redis, the way bree.js runs
// them (a Bree worker with the job heap cap): on data sets large enough that
// a job holding everything it reads in memory runs out of heap, while a job
// that works a page or a batch at a time finishes and does its work, and to
// check that a job's worker ends, and its work is written, when it is done.
//

const { execFile } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
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
  jobs: [
    {
      name: 'job',
      path: jobPath,
      // (as jobs/index.js declares a long-running job)
      ...(process.env.JOB_INTERVAL
        ? { interval: process.env.JOB_INTERVAL, longRunning: true }
        : {})
    }
  ]
});
const exitCodes = trackExitCodes(bree);
let stoppedAt;
bree.on('worker deleted', () => {
  const exitCode = exitCodes.has('job') ? exitCodes.get('job') : 0;
  const stopMs = stoppedAt ? Date.now() - stoppedAt : undefined;
  process.stdout.write(JSON.stringify({ exitCode, stopMs }) + '\\n');
  process.exit(0);
});
// (a SIGTERM stops bree, as graceful does on a deploy)
process.once('SIGTERM', () => {
  stoppedAt = Date.now();
  bree.stop();
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

function runJob(job, env, timeout = 300_000) {
  let child;
  const promise = new Promise((resolve) => {
    child = execFile(
      process.execPath,
      [runnerPath, ROOT, path.join(ROOT, 'jobs', `${job}.js`), HEAP_CAP_MB],
      {
        cwd: ROOT,
        env: { ...process.env, NODE_ENV: 'test', AXE_SILENT: 'true', ...env },
        timeout,
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
  promise.child = child;
  return promise;
}

async function waitFor(fn, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await fn()) return true;
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }

  return false;
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

test.serial(
  'crawl-sitemap ends once it has crawled instead of holding its worker for a day',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);

    // the site: a sitemap index, a locale sitemap, two pages and their images
    const pages = ['one', 'two'];
    const server = http.createServer((req, res) => {
      const base = `http://127.0.0.1:${server.address().port}`;
      const xml = (body) => {
        res.setHeader('Content-Type', 'application/xml');
        res.end(`<?xml version="1.0" encoding="UTF-8"?>${body}`);
      };

      if (req.url === '/sitemap.xml')
        return xml(
          `<sitemapindex><sitemap><loc>${base}/en/sitemap.xml</loc></sitemap></sitemapindex>`
        );
      if (req.url === '/en/sitemap.xml')
        return xml(
          `<urlset>${pages
            .map((page) => `<url><loc>${base}/en/${page}</loc></url>`)
            .join('')}</urlset>`
        );
      const page = pages.find((page) => req.url.startsWith(`/en/${page}`));
      if (page && req.url.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
        return res.end('png');
      }

      if (page) {
        res.setHeader('Content-Type', 'text/html');
        return res.end(
          `<!doctype html><html lang="en"><head><title>${page}</title><meta name="description" content="About ${page}"></head><body><h1 id="${page}">${page}</h1><p>All about ${page}.</p></body></html>`
        );
      }

      res.statusCode = 404;
      res.end();
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    const logs = await mongoose.createConnection(env.LOGS_URI).asPromise();
    t.teardown(async () => {
      server.close();
      await logs.dropDatabase();
      await logs.close();
    });

    // (it used to wait a day after crawling, holding its worker and a job
    // slot, before it posted done)
    const result = await runJob('crawl-sitemap', {
      ...env,
      HTTP_PROTOCOL: 'http',
      WEB_HOST: '127.0.0.1',
      WEB_PORT: String(server.address().port),
      // (no URLs of the local site are sent to Bing)
      MICROSOFT_BING_API_KEY: ''
    });

    t.is(result.exitCode, 0, 'job failed or did not finish');
    const hrefs = await logs.db.collection('searchresults').distinct('href');
    for (const page of pages)
      t.true(
        hrefs.some((href) => href.endsWith(`/en/${page}`)),
        `${page} was not crawled`
      );
  }
);

test.serial(
  'a job that fails ends its worker instead of holding it until bree restarts',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await conn.dropDatabase();
      await conn.close();
    });

    // two payments with one PayPal transaction id: the job sends an alert,
    // which fails with no alerts address, and the job's function rejects
    const now = new Date();
    const payment = (paypalTransactionId) => {
      const _id = new mongoose.Types.ObjectId();
      return {
        _id,
        id: _id.toString(),
        user: new mongoose.Types.ObjectId(),
        amount: 300,
        method: 'paypal',
        paypal_transaction_id: paypalTransactionId,
        created_at: now,
        updated_at: now
      };
    };

    await conn.db
      .collection('payments')
      .insertMany([
        payment(`${run}-1`),
        payment(`${run}-1`),
        payment(`${run}-2`)
      ]);

    // (the rejection only reached graceful's handlers, which log it, so the
    // worker, its heap and its job slot were held until bree restarted)
    const result = await runJob(
      'paypal/dup-tx-id',
      { ...env, EMAIL_ALERTS_FROM_EMAIL: '' },
      120_000
    );

    t.is(result.exitCode, 1, 'job worker did not end');
  }
);

test.serial(
  'update-alias-and-domain-counts writes every count before it ends',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await conn.dropDatabase();
      await conn.close();
    });

    const oid = () => new mongoose.Types.ObjectId();
    const now = new Date();
    const userId = oid();
    const domainId = oid();
    await conn.db.collection('users').insertOne({
      _id: userId,
      id: userId.toString(),
      email: `owner@${run}.example`,
      group: 'user',
      created_at: now,
      updated_at: now
    });
    await conn.db.collection('domains').insertOne({
      _id: domainId,
      id: domainId.toString(),
      name: `${run}.example`,
      plan: 'free',
      members: [{ user: userId, group: 'admin' }],
      created_at: now,
      updated_at: now
    });
    await conn.db.collection('aliases').insertMany(
      ['one', 'two'].map((name) => ({
        _id: oid(),
        name,
        domain: domainId,
        user: userId,
        recipients: [`someone@${run}.example`],
        created_at: now,
        updated_at: now
      }))
    );

    // (the updates were started without waiting, and the last ones were not
    // written when the job posted done and bree ended the worker)
    const result = await runJob('update-alias-and-domain-counts', env);

    t.is(result.exitCode, 0, 'job failed or did not finish');
    const user = await conn.db.collection('users').findOne({ _id: userId });
    t.is(user.domain_count, 1);
    t.is(user.alias_count, 2);
    const domain = await conn.db
      .collection('domains')
      .findOne({ _id: domainId });
    t.is(domain.alias_count, 2);
  }
);

test.serial(
  'parse-logs checks a log with nothing to link once, not on every run',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const logs = await mongoose.createConnection(env.LOGS_URI).asPromise();
    t.teardown(async () => {
      await logs.dropDatabase();
      await logs.close();
    });

    // logs like the ones bree saves for each job run: restricted, with no
    // session (so no domain to link) and no Date or Subject header
    const count = 500;
    const now = new Date();
    const docs = [];
    for (let i = 0; i < count; i++)
      docs.push({
        message: 'job:complete',
        meta: {
          level: 'info',
          job: { name: `job-${i}`, breeInstance: 'bree', duration: i }
        },
        hash: `${run}-${i}`,
        domains: [],
        keywords: [],
        is_restricted: true,
        is_empty_domains: true,
        bounce_category: 'none',
        created_at: now,
        updated_at: now
      });
    await logs.db.collection('logs').insertMany(docs);
    // (the index the job's query is hinted to, as the Logs model creates it)
    await logs.db
      .collection('logs')
      .createIndex({ is_restricted: 1, domains: 1, domains_checked_at: 1 });

    const returned = async () => {
      const status = await logs.db.admin().serverStatus();
      return status.metrics.document.returned;
    };

    const first = await runJob('parse-logs', env);
    t.is(first.exitCode, 0, 'job failed or did not finish');
    t.is(
      await logs.db
        .collection('logs')
        .countDocuments({ domains_checked_at: { $exists: true } }),
      count
    );

    // (each run read and saved again every log of the retention period)
    const before = await returned();
    const second = await runJob('parse-logs', env);
    t.is(second.exitCode, 0, 'job failed or did not finish');
    t.true(
      (await returned()) - before < count,
      'the second run read the logs again'
    );
  }
);

test.serial(
  'a long-running job keeps its worker and runs again on its interval',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    const emails = conn.db.collection('emails');

    // an email locked 10 minutes ago, which unlock-emails puts back in the
    // queue
    const locked = () => {
      const _id = new mongoose.Types.ObjectId();
      const at = new Date(Date.now() - 10 * 60 * 1000);
      return {
        _id,
        id: _id.toString(),
        status: 'queued',
        is_locked: true,
        locked_at: at,
        locked_by: '192.0.2.1',
        created_at: at,
        updated_at: at
      };
    };

    const isUnlocked = async (email) => {
      const { is_locked: isLocked } = await emails.findOne({ _id: email._id });
      return isLocked === false;
    };

    const first = locked();
    await emails.insertOne(first);

    let ended = false;
    const job = runJob('unlock-emails', { ...env, JOB_INTERVAL: '1s' });
    job.then(() => {
      ended = true;
    });
    t.teardown(async () => {
      job.child.kill();
      await job;
      await conn.dropDatabase();
      await conn.close();
    });

    t.true(await waitFor(() => isUnlocked(first), 120_000));

    // (each run was a worker of its own, which loaded the whole app and
    // ended; this one is unlocked by the same worker)
    const second = locked();
    await emails.insertOne(second);
    t.true(await waitFor(() => isUnlocked(second), 30_000));
    t.false(ended, 'the job worker ended');
  }
);

test.serial(
  'bree stops a long-running job without waiting out its interval',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    const emails = conn.db.collection('emails');
    t.teardown(async () => {
      await conn.dropDatabase();
      await conn.close();
    });

    const _id = new mongoose.Types.ObjectId();
    const at = new Date(Date.now() - 10 * 60 * 1000);
    await emails.insertOne({
      _id,
      id: _id.toString(),
      status: 'queued',
      is_locked: true,
      locked_at: at,
      locked_by: '192.0.2.1',
      created_at: at,
      updated_at: at
    });

    const job = runJob('unlock-emails', { ...env, JOB_INTERVAL: '1m' });
    t.teardown(() => job.child.kill('SIGKILL'));

    // once it has run it waits a minute for the next run
    t.true(
      await waitFor(async () => {
        const email = await emails.findOne({ _id });
        return email.is_locked === false;
      }, 120_000)
    );
    job.child.kill('SIGTERM');

    // (graceful gives bree 5 seconds to stop before it exits with code 1)
    const result = await job;
    t.is(result.exitCode, 0, 'job failed or did not finish');
    t.true(result.stopMs < 5000, `bree took ${result.stopMs} ms to stop`);
  }
);

// documents (or index keys) MongoDB read for the commands a job sent to a
// collection (from the database profiler, which is on for the job's run)
async function examined(conn, collection, field = 'docsExamined') {
  const ops = await conn.db
    .collection('system.profile')
    .find({ ns: `${conn.db.databaseName}.${collection}` })
    .toArray();
  return ops.reduce((sum, op) => sum + (op[field] || 0), 0);
}

test.serial(
  'cleanup-database deletes orphaned aliases without reading every alias',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = databases(run);
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await conn.db.command({ profile: 0 });
      await conn.dropDatabase();
      await conn.close();
    });

    const oid = () => new mongoose.Types.ObjectId();
    const now = new Date();
    const userId = oid();
    const domainId = oid();
    const goneUserId = oid();
    const goneDomainId = oid();
    const orphanDomainId = oid();
    await conn.db.collection('users').insertOne({
      _id: userId,
      id: userId.toString(),
      email: `owner@${run}.example`,
      group: 'user',
      created_at: now,
      updated_at: now
    });
    await conn.db.collection('domains').insertMany([
      {
        _id: domainId,
        id: domainId.toString(),
        name: `${run}.example`,
        plan: 'free',
        members: [{ user: userId, group: 'admin' }],
        created_at: now,
        updated_at: now
      },
      {
        _id: orphanDomainId,
        id: orphanDomainId.toString(),
        name: `orphan.${run}.example`,
        plan: 'free',
        members: [{ user: goneUserId, group: 'admin' }],
        created_at: now,
        updated_at: now
      }
    ]);

    const alias = (name, user, domain) => ({
      _id: oid(),
      name,
      user,
      domain,
      recipients: [`someone@${run}.example`],
      created_at: now,
      updated_at: now
    });
    const aliases = conn.db.collection('aliases');
    // (the indexes the Aliases model declares on `user` and `domain`)
    await aliases.createIndex({ user: 1 });
    await aliases.createIndex({ domain: 1 });
    await aliases.insertMany([
      ...Array.from({ length: 2000 }, (_, i) =>
        alias(`kept${i}`, userId, domainId)
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        alias(`gone-user${i}`, goneUserId, domainId)
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        alias(`gone-domain${i}`, userId, goneDomainId)
      )
    ]);

    await conn.db.command({ profile: 2 });
    const result = await runJob('cleanup-database', env);
    await conn.db.command({ profile: 0 });

    t.is(result.exitCode, 0, 'job failed or did not finish');
    t.is(await aliases.countDocuments({ user: goneUserId }), 0);
    t.is(await aliases.countDocuments({ domain: goneDomainId }), 0);
    t.is(
      await aliases.countDocuments({ user: userId, domain: domainId }),
      2000
    );
    t.is(await conn.db.collection('domains').countDocuments(), 1);

    // (a `$lookup` from every alias read all 2,020 of them, twice; reading
    // one index key per user and domain reads neither the aliases nor all
    // of their keys)
    const docs = await examined(conn, 'aliases');
    t.true(docs < 100, `read ${docs} aliases`);
    const keys = await examined(conn, 'aliases', 'keysExamined');
    t.true(keys < 100, `read ${keys} alias index keys`);
  }
);

test.serial(
  'recipient-verification-email emails new recipients of paid domains without reading every paid domain',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const env = {
      ...databases(run),
      SEND_EMAIL: 'false',
      PREVIEW_EMAIL: 'false',
      // (the verification link is encrypted)
      HELPER_ENCRYPTION_KEY: randomBytes(16).toString('hex')
    };
    const conn = await mongoose.createConnection(env.MONGO_URI).asPromise();
    t.teardown(async () => {
      await conn.db.command({ profile: 0 });
      await conn.dropDatabase();
      await conn.close();
    });

    const oid = () => new mongoose.Types.ObjectId();
    const now = new Date();
    const userId = oid();
    await conn.db.collection('users').insertOne({
      _id: userId,
      id: userId.toString(),
      email: `owner@${run}.example`,
      group: 'user',
      created_at: now,
      updated_at: now
    });

    const domain = (name, plan) => {
      const _id = oid();
      return {
        _id,
        id: _id.toString(),
        name,
        plan,
        has_mx_record: true,
        has_txt_record: true,
        members: [{ user: userId, group: 'admin' }],
        created_at: now,
        updated_at: now
      };
    };

    const paid = domain(`${run}.example`, 'team');
    const free = domain(`free.${run}.example`, 'free');
    await conn.db
      .collection('domains')
      .insertMany([
        paid,
        free,
        ...Array.from({ length: 2000 }, (_, i) =>
          domain(`${i}.${run}.example`, 'enhanced_protection')
        )
      ]);

    const alias = (name, domainId, recipients, verified) => {
      const _id = oid();
      return {
        _id,
        id: _id.toString(),
        name,
        user: userId,
        domain: domainId,
        has_recipient_verification: true,
        recipients,
        verified_recipients: verified,
        pending_recipients: [],
        created_at: now,
        updated_at: now
      };
    };

    const aliases = conn.db.collection('aliases');
    const pending = alias(
      'pending',
      paid._id,
      [`verified@${run}.example`, `new@${run}.example`],
      [`verified@${run}.example`]
    );
    const onFree = alias('free', free._id, [`new@${run}.example`], []);
    await aliases.insertMany([
      pending,
      onFree,
      ...Array.from({ length: 200 }, (_, i) =>
        alias(
          `verified${i}`,
          paid._id,
          [`verified@${run}.example`],
          [`verified@${run}.example`]
        )
      )
    ]);

    await conn.db.command({ profile: 2 });
    const result = await runJob('recipient-verification-email', env);
    await conn.db.command({ profile: 0 });

    t.is(result.exitCode, 0, 'job failed or did not finish');
    const emailed = await aliases.findOne({ _id: pending._id });
    t.deepEqual(emailed.pending_recipients, [`new@${run}.example`]);
    const notEmailed = await aliases.findOne({ _id: onFree._id });
    t.deepEqual(notEmailed.pending_recipients, []);

    // (every run sent every paid domain id in an `$in`, read from all of the
    // paid domains, and looked up the domain of every alias)
    const docs = await examined(conn, 'domains');
    t.true(docs < 10, `read ${docs} domains`);
  }
);
