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
    // Requests: a SCAN for each page of 1000 keys under each of the 13
    // prefixes (with room for pages Redis returns short), and at most two
    // more for a page (its TTLs, and the TTLs it sets). A request for each
    // key would be over 7500 here.
    //
    const keysInRedis = await redis.dbsize();
    const { writes, scans } = proxy.counts;
    t.log({ keysInRedis, writes, scans });
    t.true(
      scans <= 13 * (2 * Math.ceil(keysInRedis / 1000) + 2),
      `${scans} scans of ${keysInRedis} keys`
    );
    t.true(
      writes - scans <= 2 * scans + 50,
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
