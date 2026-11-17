/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A free plan domain needs no account, so the addresses it forwards to have
// never heard from us. The MX servers queue them, and this job sends each one
// email, once, about what the service includes: only while a limit is set,
// never to an address with an account or on the denylist, and never twice.
//

const { execFile } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { EmailOptOuts, FreePlanIntros } = require('#models');
const { hashEmail } = require('#helpers/unsubscribe');

const ROOT = path.join(__dirname, '..', '..');

let redis;

test.before(utils.setupMongoose);
test.before(async () => {
  redis = new Redis();
  await redis.ping();
});
test.after.always(utils.teardownMongoose);
test.after.always(() => {
  if (redis) redis.disconnect();
});
test.beforeEach(utils.setupFactories);

// runs the job once and returns the emails it sent
async function runJob(t, limit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'free-plan-intro-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const out = path.join(dir, 'sent.ndjson');
  const preload = path.join(dir, 'preload.js');
  fs.writeFileSync(
    preload,
    `
const fs = require('node:fs');
require(${JSON.stringify(path.join(ROOT, 'helpers', 'polyfill-towellformed'))});
require(${JSON.stringify(path.join(ROOT, 'config', 'env'))});
require(${JSON.stringify(path.join(ROOT, 'config', 'mongoose'))});
const file = ${JSON.stringify(path.join(ROOT, 'helpers', 'email.js'))};
const email = require(file);
require.cache[file].exports = async (data) => {
  const res = await email(data);
  fs.appendFileSync(
    ${JSON.stringify(out)},
    JSON.stringify({
      template: data.template,
      to: data.message.to,
      subject: res.info.originalMessage.subject,
      html: res.info.originalMessage.html
    }) + '\\n'
  );
  return res;
};
`
  );

  const [MONGO_URI, LOGS_URI] = mongoose.connections.map(
    (connection) => connection._connectionString
  );
  await new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      ['--require', preload, path.join(ROOT, 'jobs', 'free-plan-intro.js')],
      {
        cwd: ROOT,
        env: {
          ...process.env,
          NODE_ENV: 'test',
          MONGO_URI,
          LOGS_URI,
          FREE_PLAN_INTRO_LIMIT: String(limit)
        },
        timeout: ms('2m'),
        killSignal: 'SIGKILL'
      },
      (err, stdout, stderr) => {
        if (err) {
          err.message += `\n${stderr}`;
          reject(err);
          return;
        }

        resolve();
      }
    );
  });

  if (!fs.existsSync(out)) return [];
  return fs
    .readFileSync(out, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
}

test.serial('each queued address is sent the email once', async (t) => {
  t.timeout(ms('8m'));

  const id = randomUUID().slice(0, 8);
  const domain = `intro-${id}.com`;
  const fresh = `fresh-${id}@example.com`;
  const denied = `denied-${id}@example.com`;
  const user = await t.context.userFactory.create();
  // (a domain added to an account has had the onboarding emails)
  const added = await t.context.domainFactory
    .withState({
      name: `added-${id}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'free',
      skip_verification: true
    })
    .create();
  // (an address that unsubscribed from our emails is not sent this one)
  const optedOut = `opted-out-${id}@example.com`;
  await EmailOptOuts.create({ hash: hashEmail(optedOut), all: true });
  const queued = [
    ...[fresh, denied, user.email, optedOut].map((addr) => `${domain} ${addr}`),
    `${added.name} other-${id}@example.com`
  ];
  await redis.del(config.freePlanIntroQueue);
  await redis.set(`denylist:${denied}`, 'true', 'PX', ms('10m'));
  t.teardown(() => redis.del(`denylist:${denied}`));
  t.teardown(() => redis.del(config.freePlanIntroQueue));

  // without a limit nothing is sent, and the queue is left as it is
  await redis.sadd(config.freePlanIntroQueue, queued);
  t.deepEqual(await runJob(t, 0), []);
  t.is(await redis.scard(config.freePlanIntroQueue), 5);

  // with one: only the address with no account that is not on the denylist
  const sent = await runJob(t, 10);
  t.is(sent.length, 1);
  t.is(sent[0].template, 'free-plan-intro');
  t.is(sent[0].to, fresh);
  t.true(sent[0].subject.includes(domain));
  t.true(sent[0].html.includes(domain));
  t.true(sent[0].html.includes(`${config.urls.web}/en/encrypt`));
  t.true(sent[0].html.includes(`${config.urls.web}/technical-whitepaper.pdf`));
  t.is(await redis.scard(config.freePlanIntroQueue), 0);

  // its address is not kept, only a hash of it
  const hash = crypto.createHash('sha256').update(fresh).digest('hex');
  t.is(await FreePlanIntros.countDocuments({ hash }), 1);

  // queued again (its mail keeps arriving, here for another domain too)
  await redis.sadd(config.freePlanIntroQueue, [
    `${domain} ${fresh}`,
    `other-${id}.com ${fresh}`
  ]);
  t.deepEqual(await runJob(t, 10), []);
  t.is(await FreePlanIntros.countDocuments({ hash }), 1);
});

test.serial('the limit counts emails sent, not addresses read', async (t) => {
  t.timeout(ms('5m'));

  const id = randomUUID().slice(0, 8);
  await redis.del(config.freePlanIntroQueue);
  t.teardown(() => redis.del(config.freePlanIntroQueue));
  const addrs = [1, 2, 3, 4, 5, 6].map((n) => `seen-${n}-${id}@example.com`);
  // (four of the six were sent it before)
  await FreePlanIntros.create(
    addrs.slice(0, 4).map((addr) => ({
      hash: crypto.createHash('sha256').update(addr).digest('hex')
    }))
  );
  await redis.sadd(
    config.freePlanIntroQueue,
    addrs.map((addr) => `seen-${id}.com ${addr}`)
  );
  const sent = await runJob(t, 2);
  t.deepEqual(sent.map((email) => email.to).sort(), addrs.slice(4).sort());
});

test.serial('no more are sent in a run than the limit', async (t) => {
  t.timeout(ms('5m'));

  const id = randomUUID().slice(0, 8);
  await redis.del(config.freePlanIntroQueue);
  t.teardown(() => redis.del(config.freePlanIntroQueue));
  await redis.sadd(
    config.freePlanIntroQueue,
    [1, 2, 3, 4, 5].map((n) => `limit-${id}.com limit-${n}-${id}@example.com`)
  );
  const sent = await runJob(t, 2);
  t.is(sent.length, 2);
  // (the rest are queued again when their mail next arrives)
  t.is(await redis.scard(config.freePlanIntroQueue), 0);
});
