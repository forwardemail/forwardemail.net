/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Runs real bree jobs, the way bree.js runs them (in a Bree worker), against
// real MongoDB and Redis, with the job's Redis connection going through a
// proxy that counts the requests it sends. A job that waits on Redis once
// per key or address spends its run in system calls and network waits (the
// bree host's CPU went to the kernel for hours while monitor-redis-ttl ran),
// so these check what each job does and how many requests it needs.
//

const { execFile } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const Redis = require('ioredis');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');
const { MongoMemoryServer } = require('mongodb-memory-server');

const config = require('#config');
const cookieOptions = require('#config/cookies');

const ROOT = path.join(__dirname, '..', '..');

const RUNNER = `
const path = require('node:path');
const process = require('node:process');

const [root, jobPath] = process.argv.slice(2);
const Bree = require(require.resolve('bree', { paths: [root] }));
const { trackExitCodes } = require(
  path.join(root, 'helpers', 'bree-job-gate.js')
);

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
    fs.mkdtempSync(path.join(os.tmpdir(), 'job-redis-')),
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

//
// A TCP proxy in front of Redis that counts the writes it gets from clients.
// A command a client sends and waits on before sending the next arrives as a
// write of its own; a pipeline arrives as one (or a few, when large).
//
async function createCountingProxy() {
  const counts = { writes: 0, scans: 0 };
  const sockets = new Set();
  const server = net.createServer((socket) => {
    const upstream = net.connect(redis.options.port, redis.options.host);
    sockets.add(socket);
    sockets.add(upstream);
    socket.on('data', (chunk) => {
      counts.writes++;
      // ioredis sends a command's name as given ("scan")
      if (/^\*\d+\r\n\$4\r\nscan\r\n/i.test(chunk.toString('latin1', 0, 32)))
        counts.scans++;
      upstream.write(chunk);
    });
    upstream.pipe(socket);
    for (const s of [socket, upstream]) {
      s.on('error', () => {});
      s.on('close', () => {
        socket.destroy();
        upstream.destroy();
      });
    }
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return {
    port: server.address().port,
    counts,
    async close() {
      for (const s of sockets) s.destroy();
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  };
}

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
      [runnerPath, ROOT, path.join(ROOT, 'jobs', `${job}.js`)],
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

async function pttls(keys) {
  const results = await redis.pipeline(keys.map((key) => ['pttl', key])).exec();
  return results.map(([err, pttl]) => {
    if (err) throw err;
    return pttl;
  });
}

test.serial(
  'monitor-redis-ttl sets TTLs on keys without one, a page of keys at a time',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const proxy = await createCountingProxy();
    t.teardown(async () => {
      await proxy.close();
      await removeKeys(`*${run}*`);
    });

    // keys without a TTL: fingerprints and denylist entries (given one) and
    // cache entries (only counted); fingerprints with a TTL (left alone)
    const COUNT = 2500;
    const keys = {
      fingerprints: [],
      denylist: [],
      cache: [],
      fingerprintsWithTTL: []
    };
    for (let i = 0; i < COUNT; i++) {
      keys.fingerprints.push(`f:${run}:${i}`);
      keys.denylist.push(`denylist:${run}-${i}.example.com`);
      keys.cache.push(`koa-cash:${run}:${i}`);
      keys.fingerprintsWithTTL.push(`f:${run}:ttl:${i}`);
    }

    const p = redis.pipeline();
    for (const key of [...keys.fingerprints, ...keys.denylist, ...keys.cache])
      p.set(key, 'true');
    for (const key of keys.fingerprintsWithTTL)
      p.set(key, 'true', 'PX', ms('1h'));
    await p.exec();

    const started = Date.now();
    const result = await runJob('monitor-redis-ttl', {
      ...databases(run),
      BREE_REDIS_HOST: '127.0.0.1',
      BREE_REDIS_PORT: String(proxy.port)
    });
    const elapsed = Date.now() - started;
    t.is(result.error, undefined);
    t.is(result.exitCode, 0);

    // fingerprints and denylist entries got their TTLs
    for (const pttl of await pttls(keys.fingerprints)) {
      t.true(pttl > config.fingerprintTTL - elapsed - 1000, `${pttl}`);
      t.true(pttl <= config.fingerprintTTL);
    }

    for (const pttl of await pttls(keys.denylist)) {
      t.true(pttl > ms('30d') - elapsed - 1000, `${pttl}`);
      t.true(pttl <= ms('30d'));
    }

    // cache entries are only reported, and existing TTLs are kept
    const cachePttls = await pttls(keys.cache);
    t.true(cachePttls.every((pttl) => pttl === -1));
    const keptPttls = await pttls(keys.fingerprintsWithTTL);
    t.true(keptPttls.every((pttl) => pttl > 0 && pttl <= ms('1h')));

    //
    // Requests: one walk of the keyspace, a SCAN for each page of 1000 keys
    // (with room for pages Redis returns short), not one walk per prefix (a
    // SCAN with MATCH still walks every key), and at most three more for a
    // page (its TTLs, and the TTLs it sets for fingerprint and denylist keys).
    // A request for each key would be over 7500 here.
    //
    const keysInRedis = await redis.dbsize();
    const { writes, scans } = proxy.counts;
    t.log({ keysInRedis, writes, scans });
    t.true(
      scans <= 2 * Math.ceil(keysInRedis / 1000) + 2,
      `${scans} scans of ${keysInRedis} keys`
    );
    t.true(
      writes - scans <= 3 * scans + 50,
      `${writes - scans} other requests`
    );
  }
);

test.serial(
  'upgrade-reminder-email skips denylisted domains and addresses with a request per reminder',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const proxy = await createCountingProxy();
    const conn = await mongoose
      .createConnection(databases(run).MONGO_URI)
      .asPromise();
    t.teardown(async () => {
      await proxy.close();
      await removeKeys(`denylist:*${run}*`);
      await conn.dropDatabase();
      await conn.close();
    });

    // reminders for 12 domains (not "good" ones, which are deleted instead)
    // of the same 6 addresses (one already sent); the first domain is
    // denylisted, and so is one of the addresses
    const reminders = [];
    for (let i = 0; i < 12; i++) {
      const domain = `${run}-${i}.ru`;
      reminders.push({
        domain,
        pending_recipients: Array.from(
          { length: 6 },
          (_, j) => `user${j}@${run}-mail.example.com`
        ),
        sent_recipients: [`user5@${run}-mail.example.com`]
      });
    }

    const collection = conn.collection('upgradereminders');
    await collection.insertMany(reminders);
    await redis.set(`denylist:${run}-0.ru`, 'true');
    await redis.set(`denylist:user2@${run}-mail.example.com`, 'true');

    const result = await runJob('upgrade-reminder-email', {
      ...databases(run),
      BREE_REDIS_HOST: '127.0.0.1',
      BREE_REDIS_PORT: String(proxy.port)
    });
    t.is(result.error, undefined);
    t.is(result.exitCode, 0);

    const docs = await collection.find().toArray();
    const after = new Map(docs.map((doc) => [doc.domain, doc]));
    t.is(after.size, 12);

    // the denylisted domain got nothing
    t.deepEqual(after.get(`${run}-0.ru`).sent_recipients, [
      `user5@${run}-mail.example.com`
    ]);

    // the others got it at every address but the denylisted one (and the
    // one already sent)
    for (let i = 1; i < 12; i++) {
      t.deepEqual(
        [...after.get(`${run}-${i}.ru`).sent_recipients].sort(),
        [0, 1, 3, 4, 5].map((j) => `user${j}@${run}-mail.example.com`),
        `${run}-${i}.ru`
      );
    }

    // one request for each reminder's denylist entries (a GET for the domain
    // and each address, in turn, would be 72), and a few to connect
    t.log(proxy.counts);
    t.true(proxy.counts.writes <= 12 + 10, `${proxy.counts.writes} requests`);
  }
);

test.serial(
  'cleanup-expired-sessions sets missing session TTLs a page of keys at a time',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const proxy = await createCountingProxy();
    t.teardown(async () => {
      await proxy.close();
      await removeKeys(`koa:sess:${run}*`);
    });

    const without = [];
    const withTTL = [];
    const p = redis.pipeline();
    for (let i = 0; i < 2500; i++) {
      without.push(`koa:sess:${run}:${i}`);
      withTTL.push(`koa:sess:${run}:ttl:${i}`);
      p.set(without[i], '{}');
      p.set(withTTL[i], '{}', 'PX', ms('1h'));
    }

    await p.exec();

    const result = await runJob('cleanup-expired-sessions', {
      ...databases(run),
      BREE_REDIS_HOST: '127.0.0.1',
      BREE_REDIS_PORT: String(proxy.port)
    });
    t.is(result.error, undefined);
    t.is(result.exitCode, 0);

    // every session got its TTL, and the ones that had one kept it
    const maxAge = Math.floor(cookieOptions.maxAge / 1000);
    for (const ttl of await Promise.all(without.map((key) => redis.ttl(key))))
      t.true(ttl > maxAge - 60 && ttl <= maxAge, `${ttl}`);
    for (const ttl of await Promise.all(withTTL.map((key) => redis.ttl(key))))
      t.true(ttl > 0 && ttl <= 3600, `${ttl}`);

    // a SCAN for each page of about 1000 keys, and at most two more a page
    const keysInRedis = await redis.dbsize();
    const { writes, scans } = proxy.counts;
    t.log({ keysInRedis, writes, scans });
    t.true(
      scans <= 2 * Math.ceil(keysInRedis / 1000) + 2,
      `${scans} scans of ${keysInRedis} keys`
    );
    t.true(
      writes - scans <= 2 * scans + 50,
      `${writes - scans} other requests`
    );
  }
);

test.serial(
  'session-management reads sessions a page of keys at a time',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const proxy = await createCountingProxy();
    const conn = await mongoose
      .createConnection(databases(run).MONGO_URI)
      .asPromise();
    t.teardown(async () => {
      await proxy.close();
      await removeKeys(`koa:sess:${run}*`);
      await conn.dropDatabase();
      await conn.close();
    });

    const _id = new mongoose.Types.ObjectId();
    const now = new Date();
    await conn.db.collection('users').insertOne({
      _id,
      id: _id.toString(),
      email: `sessions@${run}.example`,
      group: 'user',
      sessions: [],
      created_at: now,
      updated_at: now
    });

    // sessions of the user, of a user that no longer exists, and signed out
    const own = [];
    const gone = [];
    const p = redis.pipeline();
    for (let i = 0; i < 1500; i++) {
      own.push(`${run}-own-${i}`);
      p.set(
        `koa:sess:${own[i]}`,
        JSON.stringify({ passport: { user: _id.toString() } }),
        'PX',
        ms('1h')
      );
    }

    for (let i = 0; i < 20; i++) {
      gone.push(`koa:sess:${run}-gone-${i}`);
      p.set(
        gone[i],
        JSON.stringify({
          passport: { user: new mongoose.Types.ObjectId().toString() }
        }),
        'PX',
        ms('1h')
      );
    }

    for (let i = 0; i < 500; i++)
      p.set(`koa:sess:${run}-anon-${i}`, '{}', 'PX', ms('1h'));
    await p.exec();

    const result = await runJob('session-management', {
      ...databases(run),
      BREE_REDIS_HOST: '127.0.0.1',
      BREE_REDIS_PORT: String(proxy.port)
    });
    t.is(result.error, undefined);
    t.is(result.exitCode, 0);

    // the user's sessions are recorded, those of the missing user removed
    const user = await conn.db.collection('users').findOne({ _id });
    t.deepEqual([...user.sessions].sort(), [...own].sort());
    t.is(await redis.exists(...gone), 0);
    t.is(await redis.exists(`koa:sess:${run}-anon-0`), 1);

    // a SCAN for each page of about 1000 keys (it read 10 at a time), one
    // more for the page's sessions, and one for each removed session
    const keysInRedis = await redis.dbsize();
    const { writes, scans } = proxy.counts;
    t.log({ keysInRedis, writes, scans });
    t.true(
      scans <= 2 * Math.ceil(keysInRedis / 1000) + 2,
      `${scans} scans of ${keysInRedis} keys`
    );
    t.true(
      writes - scans <= scans + gone.length + 50,
      `${writes - scans} other requests`
    );
  }
);

test.serial(
  'sync-paid-alias-allowlist takes paid domains off the deny, silent and backscatter lists in one walk of the keys',
  async (t) => {
    const run = randomBytes(6).toString('hex');
    const proxy = await createCountingProxy();
    const conn = await mongoose
      .createConnection(databases(run).MONGO_URI)
      .asPromise();
    t.teardown(async () => {
      await proxy.close();
      await removeKeys(`*${run}*`);
      await conn.dropDatabase();
      await conn.close();
    });

    const oid = () => new mongoose.Types.ObjectId();
    const now = new Date();
    const ownerId = oid();
    await conn.db.collection('users').insertOne({
      _id: ownerId,
      id: ownerId.toString(),
      email: `owner@${run}.example`,
      group: 'user',
      plan: 'team',
      is_banned: false,
      created_at: now,
      updated_at: now
    });
    const domainId = oid();
    await conn.db.collection('domains').insertOne({
      _id: domainId,
      id: domainId.toString(),
      name: `paid-${run}.com`,
      plan: 'team',
      has_txt_record: true,
      members: [{ user: ownerId, group: 'admin' }],
      created_at: now,
      updated_at: now
    });
    await conn.db.collection('aliases').insertOne({
      _id: oid(),
      name: 'hi',
      domain: domainId,
      user: ownerId,
      is_enabled: true,
      recipients: [`someone@dest-${run}.org`],
      created_at: now,
      updated_at: now
    });

    // an address of the paid domain on each list (taken off), other entries
    // (kept), and enough other
    // keys that each walk of the keyspace takes several pages
    const p = redis.pipeline();
    for (const prefix of ['denylist', 'silent', 'backscatter']) {
      p.set(`${prefix}:someone@paid-${run}.com`, 'true');
      p.set(`${prefix}:other-${run}.org`, 'true');
    }

    for (let i = 0; i < 40_000; i++)
      p.set(`filler:${run}:${i}`, '1', 'PX', ms('1h'));
    await p.exec();
    await redis.del('banned_user_ids');

    const result = await runJob('sync-paid-alias-allowlist', {
      ...databases(run),
      BREE_REDIS_HOST: '127.0.0.1',
      BREE_REDIS_PORT: String(proxy.port)
    });
    t.is(result.error, undefined);
    t.is(result.exitCode, 0);

    for (const prefix of ['denylist', 'silent', 'backscatter']) {
      t.is(
        await redis.get(`${prefix}:someone@paid-${run}.com`),
        null,
        `${prefix} list`
      );
      t.is(
        await redis.get(`${prefix}:other-${run}.org`),
        'true',
        `${prefix} list`
      );
    }

    t.is(await redis.get(`allowlist:paid-${run}.com`), 'true');

    // one walk of the keyspace (pages of about 10000 keys), not one a list
    const keysInRedis = await redis.dbsize();
    const { scans } = proxy.counts;
    t.log({ keysInRedis, scans });
    t.true(
      scans <= 2 * Math.ceil(keysInRedis / 10_000) + 2,
      `${scans} scans of ${keysInRedis} keys`
    );
  }
);
