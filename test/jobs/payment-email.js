/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A payment is written before its user is saved (which is when the plan's
// expiry counts it), so a receipt sent in between said "Plan expired" for
// the plan that had just been paid for.
//

const { execFile } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Payments } = require('#models');

const ROOT = path.join(__dirname, '..', '..');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

//
// Runs the job once against this test's databases and returns the emails it
// sent (their HTML is written to a file; the PDF copy of the receipt is not
// rendered, since that needs wkhtmltopdf and the site's assets). The receipts
// of the payments with the references `failing`, if any, cannot be made.
//
async function runJob(t, failing = []) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'payment-email-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const out = path.join(dir, 'sent.ndjson');
  const preload = path.join(dir, 'preload.js');
  fs.writeFileSync(
    preload,
    `
const fs = require('node:fs');
const { Readable } = require('node:stream');
require(${JSON.stringify(path.join(ROOT, 'helpers', 'polyfill-towellformed'))});
require(${JSON.stringify(path.join(ROOT, 'config', 'env'))});
require(${JSON.stringify(path.join(ROOT, 'config', 'mongoose'))});
const { Payments } = require(${JSON.stringify(
      path.join(ROOT, 'app', 'models')
    )});
const { getPDFReceipt } = Payments;
Payments.getPDFReceipt = (payment, user, locale, returnHTML) => {
  if (${JSON.stringify(failing)}.includes(payment.reference))
    throw new Error('Receipt could not be made');
  return returnHTML
    ? getPDFReceipt(payment, user, locale, returnHTML)
    : Readable.from([Buffer.from('%PDF-1.4')]);
};
const file = ${JSON.stringify(path.join(ROOT, 'helpers', 'email.js'))};
const email = require(file);
require.cache[file].exports = async (data) => {
  const res = await email(data);
  fs.appendFileSync(
    ${JSON.stringify(out)},
    JSON.stringify({ template: data.template, html: res.info.originalMessage.html }) + '\\n'
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
      ['--require', preload, path.join(ROOT, 'jobs', 'payment-email.js')],
      {
        cwd: ROOT,
        env: { ...process.env, NODE_ENV: 'test', MONGO_URI, LOGS_URI },
        timeout: ms('2m'),
        // (so the job's own signal handler cannot exit cleanly on a timeout)
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
    .map((line) => JSON.parse(line))
    .filter((sent) => sent.template === 'payment');
}

async function isReceiptSent(payment) {
  const { receipt_sent_at: sentAt } = await Payments.findById(payment._id)
    .lean()
    .exec();
  return Boolean(sentAt);
}

test('a receipt waits for the plan to count the payment', async (t) => {
  t.timeout(ms('5m'));

  // a monthly plan whose month ran out yesterday, paid by card on auto-renew
  const startedAt = dayjs().subtract(1, 'month').subtract(1, 'day').toDate();
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: startedAt,
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.stripeSubscriptionID]: 'sub_test'
    })
    .create();
  const payment = {
    user: user._id,
    amount: 300,
    method: 'visa',
    duration: ms('30d'),
    plan: 'enhanced_protection',
    kind: 'subscription'
  };
  await t.context.paymentFactory
    .withState({
      ...payment,
      invoice_at: startedAt,
      receipt_sent_at: startedAt
    })
    .create();
  await user.save();
  t.true(user[config.userFields.planExpiresAt] < new Date());

  // the renewal is written, and the user is not saved yet
  const renewal = await t.context.paymentFactory
    .withState({ ...payment, invoice_at: dayjs().subtract(1, 'day').toDate() })
    .create();

  const early = await runJob(t);
  t.is(early.length, 0);
  t.false(await isReceiptSent(renewal));

  // the user is saved (and a minute or more passes)
  await user.save();
  t.true(user[config.userFields.planExpiresAt] > new Date());
  await Payments.collection.updateOne(
    { _id: renewal._id },
    { $set: { updated_at: dayjs().subtract(2, 'minutes').toDate() } }
  );

  const sent = await runJob(t);
  t.is(sent.length, 1);
  t.true(sent[0].html.includes('Thank you!'));
  t.false(sent[0].html.includes('Plan expired'));
  t.true(await isReceiptSent(renewal));
});

//
// The receipts are sent a few at a time, and the first error ended the run:
// a payment whose receipt always failed held back every receipt after it.
//
test('a receipt that cannot be made does not hold back the ones after it', async (t) => {
  t.timeout(ms('5m'));

  const startedAt = dayjs().subtract(1, 'day').toDate();
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: startedAt,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  const payments = [];
  for (let i = 0; i < 9; i++)
    payments.push(
      await t.context.paymentFactory
        .withState({
          user: user._id,
          amount: 300,
          method: 'visa',
          duration: ms('30d'),
          plan: 'enhanced_protection',
          kind: 'one-time',
          invoice_at: dayjs(startedAt).add(i, 'minute').toDate()
        })
        .create()
    );
  await user.save();
  await Payments.collection.updateMany(
    { user: user._id },
    { $set: { updated_at: dayjs().subtract(2, 'minutes').toDate() } }
  );

  // (the first of them, so it is tried before the others)
  const [failing, ...others] = payments;
  t.truthy(failing.reference);
  const sent = await runJob(t, [failing.reference]);
  t.is(sent.length, others.length);
  t.false(await isReceiptSent(failing));

  for (const payment of others) t.true(await isReceiptSent(payment));

  // (while receipts keep failing, as when none can be rendered, a run stops
  // trying: of 17 whose first 14 fail, the 3 after them wait for the next)
  await Payments.collection.updateMany(
    { user: user._id },
    { $unset: { receipt_sent_at: '' } }
  );
  const more = [];
  for (let i = 0; i < 8; i++)
    more.push(
      await t.context.paymentFactory
        .withState({
          user: user._id,
          amount: 300,
          method: 'visa',
          duration: ms('30d'),
          plan: 'enhanced_protection',
          kind: 'one-time',
          invoice_at: dayjs(startedAt)
            .add(10 + i, 'minute')
            .toDate()
        })
        .create()
    );
  await Payments.collection.updateMany(
    { user: user._id },
    { $set: { updated_at: dayjs().subtract(2, 'minutes').toDate() } }
  );
  t.deepEqual(
    await runJob(
      t,
      [...payments, ...more.slice(0, 5)].map((payment) => payment.reference)
    ),
    []
  );
  for (const payment of more) t.false(await isReceiptSent(payment));
});
