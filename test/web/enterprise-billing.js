/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Enterprise accounts (marked in Admin > Users) are billed by invoice: they
// are always on the Team plan, are not billed or reminded like other
// accounts, and admins record their payments and are reminded when one is
// due.  The customer sees "Enterprise" as their plan and their payments on
// the Billing page, but never the internal notes or payment links.
//

const { execFile } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const request = require('supertest');
const sinon = require('sinon');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const getPaidSince = require('#helpers/get-paid-since');
const stripe = require('#helpers/stripe');
const { Domains, Payments, Users } = require('#models');

const ROOT = path.join(__dirname, '..', '..');
const NOTES = 'Net 30 <script>alert(1)</script> invoice to accounts payable';
const TRACKING_URL = 'https://app.mercury.example/transactions/tx-123';

const date = (value) => dayjs.utc(value).format('YYYY-MM-DD');

// payments admins recorded for an account, the last one received first
const getPayments = (user) =>
  Payments.find({ user: user._id, method: 'enterprise' })
    .sort({ invoice_at: -1 })
    .exec();

// (a reference is used by one payment)
let invoices = 0;

async function status(req) {
  const res = await req;
  return res.status;
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  // an admin (signed in as `t.context.web`) and a customer
  t.context.password = falso.randPassword();
  let admin = await t.context.userFactory.make();
  admin = await Users.register(admin, t.context.password);
  admin.group = 'admin';
  admin[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await admin.save();

  t.context.customerPassword = falso.randPassword();
  let customer = await t.context.userFactory.make();
  customer = await Users.register(customer, t.context.customerPassword);
  customer[config.userFields.hasSetPassword] = true;
  customer[config.userFields.hasVerifiedEmail] = true;
  t.context.customer = await customer.save();

  t.context.webConfig = { turnstileEnabled: false };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(() => {
  sinon.restore();
});
test.afterEach.always(utils.teardownWebServer);

// a browser of its own, signed in as `user`
async function signIn(t, user, password) {
  const agent = request.agent(t.context._web.server);
  const res = await agent
    .post('/en/login')
    .send({ email: user.email, password });
  t.is(res.status, 302);
  return agent;
}

function setEnterprise(t, user, body = {}) {
  return t.context.web
    .put(`/en/admin/users/${user.id}/enterprise`)
    .set('Accept', 'application/json')
    .send({
      is_enterprise: 'true',
      enterprise_start_date: '2026-01-31',
      enterprise_billing_frequency: 'annual',
      enterprise_billing_amount: '12000.50',
      enterprise_notes: NOTES,
      ...body
    });
}

function addPayment(t, user, body = {}) {
  return t.context.web
    .post(`/en/admin/users/${user.id}/enterprise/payments`)
    .set('Accept', 'application/json')
    .send({
      paid_at: '2026-02-03',
      amount: '12000.50',
      reference: `inv-2026-${++invoices}`,
      tracking_url: TRACKING_URL,
      notes: 'Check received via mail',
      ...body
    });
}

//
// Runs a job once against this test's databases and returns the emails it
// sent.
//
async function runJob(t, name) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enterprise-billing-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const out = path.join(dir, 'sent.ndjson');
  const preload = path.join(dir, 'preload.js');
  fs.writeFileSync(
    preload,
    `
const fs = require('node:fs');
require(${JSON.stringify(path.join(ROOT, 'helpers', 'polyfill-towellformed'))});
require(${JSON.stringify(path.join(ROOT, 'config', 'env'))});
const file = ${JSON.stringify(path.join(ROOT, 'helpers', 'email.js'))};
const email = require(file);
require.cache[file].exports = async (data) => {
  const res = await email(data);
  fs.appendFileSync(
    ${JSON.stringify(out)},
    JSON.stringify({
      template: data.template,
      to: data.message.to,
      subject: data.message.subject,
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
      ['--require', preload, path.join(ROOT, 'jobs', `${name}.js`)],
      {
        cwd: ROOT,
        env: { ...process.env, NODE_ENV: 'test', MONGO_URI, LOGS_URI },
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

test('an admin marks a customer as enterprise', async (t) => {
  const { customer } = t.context;
  const res = await setEnterprise(t, customer, {
    enterprise_last_paid_at: '2026-01-31'
  });
  t.is(res.status, 200);

  const user = await Users.findById(customer._id).lean().exec();
  t.true(user.is_enterprise);
  t.is(user.plan, 'team');
  // (and is not rate limited)
  t.true(user[config.userFields.isRateLimitWhitelisted]);
  t.is(date(user.enterprise_start_date), '2026-01-31');
  t.is(user.enterprise_billing_frequency, 'annual');
  t.is(user.enterprise_billing_amount, 1_200_050);
  t.is(user.enterprise_notes, NOTES);
  t.is(date(user.enterprise_last_paid_at), '2026-01-31');
  // the plan does not expire, so nothing treats the account as unpaid
  t.true(
    dayjs(user[config.userFields.planExpiresAt]).isAfter(
      dayjs().add(40, 'year')
    )
  );

  // the admin pages show it, with the next payment due a year after the
  // period last paid for
  const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
  t.is(page.status, 200);
  t.true(page.text.includes('Enterprise frequency last paid'));
  t.true(page.text.includes('2027-01-31'));
  t.true(page.text.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  t.false(page.text.includes('<script>alert(1)</script>'));

  const list = await t.context.web
    .get('/en/admin/users')
    .query({ mongodb_query: JSON.stringify({ is_enterprise: true }) });
  t.is(list.status, 200);
  t.true(list.text.includes(customer.email));
  t.true(list.text.includes('due 1/31/27'));
});

test('only an admin can change enterprise billing', async (t) => {
  const { customer } = t.context;
  const agent = await signIn(t, customer, t.context.customerPassword);
  const anonymous = request(t.context._web.server);

  for (const client of [agent, anonymous]) {
    for (const res of [
      await client
        .put(`/en/admin/users/${customer.id}/enterprise`)
        .set('Accept', 'application/json')
        .send({
          is_enterprise: 'true',
          enterprise_start_date: '2026-01-31',
          enterprise_billing_frequency: 'annual'
        }),
      await client
        .post(`/en/admin/users/${customer.id}/enterprise/payments`)
        .set('Accept', 'application/json')
        .send({ paid_at: '2026-02-03', amount: '1' })
    ])
      t.is(res.status, 401);
  }

  // nor through their own profile
  const res = await agent
    .put('/en/my-account/profile')
    .set('Accept', 'application/json')
    .send({
      [config.passport.fields.givenName]: 'Enterprise',
      is_enterprise: 'true',
      enterprise_billing_amount: '0',
      enterprise_payments: [{ paid_at: '2026-02-03', amount: 1 }]
    });
  t.true(res.status < 500);

  const user = await Users.findById(customer._id).lean().exec();
  t.false(user.is_enterprise);
  t.is(user.plan, 'free');
  t.is(user.enterprise_billing_amount, undefined);
  t.deepEqual(await getPayments(customer), []);
});

test('invalid enterprise settings are refused', async (t) => {
  const { customer } = t.context;
  for (const body of [
    { enterprise_start_date: '' },
    { enterprise_billing_frequency: '' },
    { enterprise_billing_frequency: 'weekly' },
    { enterprise_start_date: '2026-02-31' },
    { enterprise_start_date: '31/01/2026' },
    { enterprise_start_date: '1999-12-31' },
    { enterprise_start_date: ['2026-01-31', '2026-02-01'] },
    { enterprise_last_paid_at: 'yesterday' },
    { enterprise_billing_amount: '-1' },
    { enterprise_billing_amount: '1.234' },
    { enterprise_billing_amount: '1e3' },
    { enterprise_billing_amount: '99999999.99' },
    { enterprise_billing_amount: { $gt: 0 } },
    { enterprise_notes: 'x'.repeat(5001) }
  ]) {
    const res = await setEnterprise(t, customer, body);
    t.is(res.status, 400, `${JSON.stringify(body)}`);
  }

  const user = await Users.findById(customer._id).lean().exec();
  t.false(user.is_enterprise);
  t.is(user.plan, 'free');

  // an unknown user
  t.is(
    await status(
      setEnterprise(t, { id: new mongoose.Types.ObjectId().toString() })
    ),
    404
  );
});

test('a banned account cannot be marked as enterprise', async (t) => {
  const { customer } = t.context;
  customer[config.userFields.isBanned] = true;
  await customer.save();
  t.is(await status(setEnterprise(t, customer)), 400);
  const user = await Users.findById(customer._id).lean().exec();
  t.false(user.is_enterprise);
});

test('a subscription is canceled when an account becomes enterprise', async (t) => {
  const { customer } = t.context;
  const planSetAt = dayjs().subtract(2, 'month').startOf('day').toDate();
  customer.plan = 'enhanced_protection';
  customer[config.userFields.planSetAt] = planSetAt;
  customer[config.userFields.stripeSubscriptionID] = 'sub_enterprise_test';
  await customer.save();

  const del = sinon.stub(stripe.subscriptions, 'del').resolves({});
  const res = await setEnterprise(t, customer);
  t.is(res.status, 200);
  t.true(del.calledOnceWithExactly('sub_enterprise_test'));

  const user = await Users.findById(customer._id).lean().exec();
  t.true(user.is_enterprise);
  t.is(user.plan, 'team');
  t.is(user[config.userFields.stripeSubscriptionID], undefined);

  // (not again when the settings are saved again)
  t.is(await status(setEnterprise(t, customer)), 200);
  t.true(del.calledOnce);

  // the date the plan started is kept, also when something (e.g. a late
  // webhook of a payment from before) would move it
  t.is(
    new Date(user[config.userFields.planSetAt]).getTime(),
    planSetAt.getTime()
  );
  const doc = await Users.findById(customer._id);
  doc[config.userFields.planSetAt] = new Date();
  doc.plan = 'enhanced_protection';
  await doc.save();
  const saved = await Users.findById(customer._id).lean().exec();
  t.is(
    new Date(saved[config.userFields.planSetAt]).getTime(),
    planSetAt.getTime()
  );
  t.is(saved.plan, 'team');
});

test('an admin records and removes enterprise payments', async (t) => {
  const { customer } = t.context;

  // not for an account that is not enterprise
  t.is(await status(addPayment(t, customer)), 400);

  t.is(await status(setEnterprise(t, customer)), 200);

  const remove = (id) =>
    t.context.web
      .delete(`/en/admin/users/${customer.id}/enterprise/payments/${id}`)
      .set('Accept', 'application/json');

  for (const body of [
    { paid_at: '' },
    { paid_at: '2026-13-01' },
    { paid_at: date(dayjs.utc().add(3, 'day')) },
    { amount: '' },
    { amount: '-5' },
    { amount: '12,000' },
    // eslint-disable-next-line no-script-url
    { tracking_url: 'javascript:alert(1)' },
    { tracking_url: 'http://app.mercury.example/transactions/tx-123' },
    { tracking_url: 'data:text/html,<script>alert(1)</script>' },
    { tracking_url: `https://example.com/${'a'.repeat(2048)}` },
    { tracking_url: ['https://example.com', 'https://example.org'] },
    { reference: 'x'.repeat(65) },
    { reference: 'INV 42/<b>' },
    { reference: 'INV.42' },
    { reference: 'upgrade' },
    { notes: 'x'.repeat(1001) }
  ]) {
    const res = await addPayment(t, customer, body);
    t.is(res.status, 400, `${JSON.stringify(body)}`);
  }

  // the payment is for the period that is due (the one of the start date),
  // even though it was paid a few days late
  const paid = { mark_paid: 'true', due_at: '2026-01-31' };
  // (not from a page that showed another period as due)
  t.is(
    await status(addPayment(t, customer, { ...paid, due_at: '2027-01-31' })),
    400
  );
  t.is(await status(addPayment(t, customer, paid)), 200);
  let user = await Users.findById(customer._id).exec();
  let payments = await getPayments(customer);
  t.is(payments.length, 1);
  const [payment] = payments;
  t.is(date(payment.invoice_at), '2026-02-03');
  // (at noon in UTC: that day for a customer in any time zone)
  t.is(payment.invoice_at.toISOString(), '2026-02-03T12:00:00.000Z');
  t.is(payment.amount, 1_200_050);
  // (the reference entered, as payment references are written)
  t.is(payment.reference, `INV-2026-${invoices}`);
  t.is(payment.plan, 'team');
  t.is(payment.enterprise_tracking_url, TRACKING_URL);
  t.is(payment.enterprise_notes, 'Check received via mail');
  t.is(String(payment.enterprise_created_by), t.context.user.id);
  // (no receipt is emailed: the customer gets no billing emails)
  t.truthy(payment.receipt_sent_at);

  // a reference is used by one payment
  t.is(
    await status(
      addPayment(t, customer, {
        paid_at: '2026-02-10',
        reference: payment.reference
      })
    ),
    400
  );

  // it is a payment like any other in Admin > Payments, found by its
  // reference, with what is internal on its page
  const found = await t.context.web
    .get('/en/admin/payments')
    .set('Accept', 'text/html')
    .query({ q: payment.reference });
  t.is(found.status, 200);
  t.true(found.text.includes(payment.reference));
  t.true(found.text.includes(customer.email));
  const detail = await t.context.web.get(`/en/admin/payments/${payment.id}`);
  t.is(detail.status, 200);
  t.true(detail.text.includes(TRACKING_URL));
  t.true(detail.text.includes('Check received via mail'));
  // (it was not charged by Stripe or PayPal, so it cannot be refunded here)
  t.false(detail.text.includes(`/admin/payments/${payment.id}/refund`));
  const refund = await t.context.web
    .post(`/en/admin/payments/${payment.id}/refund`)
    .set('Accept', 'application/json')
    .send({});
  t.true(refund.status >= 400 && refund.status < 500, `${refund.status}`);
  const kept = await Payments.findById(payment._id).lean().exec();
  t.falsy(kept.amount_refunded);

  // another payment of the same amount on the same day has a reference of
  // its own (without one it is the same payment submitted twice)
  t.is(
    await status(addPayment(t, customer, { reference: '', notes: '' })),
    400
  );
  t.is(
    await status(addPayment(t, customer, { reference: '2026-02-03-second' })),
    200
  );
  const [second] = await Payments.find({ reference: '2026-02-03-SECOND' });
  t.is(await status(remove(second.id)), 200);
  t.is(date(user.enterprise_last_paid_at), '2026-01-31');

  // the same payment submitted twice
  t.is(await status(addPayment(t, customer, { reference: '' })), 400);

  // one that is not for the period that is due leaves the period unpaid
  t.is(
    await status(
      addPayment(t, customer, {
        paid_at: '2026-03-01',
        amount: '250',
        tracking_url: '',
        notes: ''
      })
    ),
    200
  );
  user = await Users.findById(customer._id).exec();
  payments = await getPayments(customer);
  t.is(payments.length, 2);
  t.is(date(user.enterprise_last_paid_at), '2026-01-31');

  // the admin page lists them with the internal link
  const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
  t.true(page.text.includes(TRACKING_URL));
  t.true(page.text.includes('$12,000.50'));

  t.is(await status(remove('not-an-id')), 404);
  t.is(await status(remove(new mongoose.Types.ObjectId().toString())), 404);
  t.is(await status(remove(payment.id)), 200);
  user = await Users.findById(customer._id).exec();
  payments = await getPayments(customer);
  t.is(payments.length, 1);
  t.is(payments[0].amount, 25_000);

  // (only a payment an admin recorded for this account is removed here)
  const card = await t.context.paymentFactory
    .withState({
      user: customer._id,
      amount: 900,
      invoice_at: new Date(),
      method: 'visa',
      duration: ms('30d'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  t.is(await status(remove(card.id)), 404);
  t.is(await Payments.countDocuments({ _id: card._id }), 1);
  // the period that payment was for is due again
  t.is(date(user.enterprise_last_paid_at), '2026-01-30');
  const page2 = await t.context.web.get(`/en/admin/users/${customer.id}`);
  t.true(page2.text.includes('due since <strong>2026-01-31'));
});

test('billing periods follow the start date and the frequency', async (t) => {
  const { customer } = t.context;
  const nextDue = async (body) => {
    t.is(await status(setEnterprise(t, customer, body)), 200);
    const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
    const match = /due (?:since|on) <strong>([\d-]+)</.exec(page.text);
    return match && match[1];
  };

  // nothing paid yet: the first period is due
  t.is(await nextDue({}), '2026-01-31');
  // paid before the start date is not a billing period
  t.is(await nextDue({ enterprise_last_paid_at: '2026-01-30' }), '2026-01-31');
  // any date in a period pays for that period
  t.is(await nextDue({ enterprise_last_paid_at: '2026-12-25' }), '2027-01-31');
  t.is(await nextDue({ enterprise_last_paid_at: '2027-01-31' }), '2028-01-31');

  // monthly from the 31st: due on the last day of shorter months, and on
  // the 31st again after them
  const monthly = { enterprise_billing_frequency: 'monthly' };
  t.is(
    await nextDue({ ...monthly, enterprise_last_paid_at: '2026-01-31' }),
    '2026-02-28'
  );
  t.is(
    await nextDue({ ...monthly, enterprise_last_paid_at: '2026-02-27' }),
    '2026-02-28'
  );
  t.is(
    await nextDue({ ...monthly, enterprise_last_paid_at: '2026-02-28' }),
    '2026-03-31'
  );
  t.is(
    await nextDue({ ...monthly, enterprise_last_paid_at: '2026-03-31' }),
    '2026-04-30'
  );
});

test('the customer sees Enterprise and their payments, nothing internal', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  t.is(
    await status(
      addPayment(t, customer, { mark_paid: 'true', due_at: '2026-01-31' })
    ),
    200
  );

  const agent = await signIn(t, customer, t.context.customerPassword);
  const res = await agent.get('/en/my-account/billing');
  t.is(res.status, 200);

  // the plan, in the account menu and on the page
  t.regex(res.text, /acct-user-meta">\s*Enterprise/);
  t.true(res.text.includes('<h2>Enterprise</h2>'));
  // where their billing stands: the first period is paid for, the next is
  // due a year later, and the last payment links to its receipt
  t.true(res.text.includes('Annually by invoice'));
  t.true(res.text.includes('Amount per year'));
  t.true(res.text.includes('Paid up'));
  t.regex(res.text, /Next payment due on <strong[^>]*>1\/31\/27</);
  t.false(res.text.includes('Auto-renew'));

  // their payments, as receipts with the reference of each
  const [payment] = await getPayments(customer);
  // (described the usual way)
  t.regex(res.text, /payment for .+ of the <span[^>]*>Enterprise<\/span> plan/);

  // an admin words the description (it is text, not markup)
  const describe = (description) =>
    status(
      t.context.web
        .put(`/en/admin/users/${customer.id}/enterprise/payments/${payment.id}`)
        .set('Accept', 'application/json')
        .send({ description })
    );
  t.is(await describe('x'.repeat(201)), 400);
  t.is(await describe('Annual plan 2026 <img src=x onerror=alert(1)>'), 200);
  t.is(
    await status(
      agent
        .put(`/en/admin/users/${customer.id}/enterprise/payments/${payment.id}`)
        .set('Accept', 'application/json')
        .send({ description: 'Mine' })
    ),
    401
  );
  const described = await agent.get('/en/my-account/billing');
  t.true(
    described.text.includes(
      'Annual plan 2026 &lt;img src=x onerror=alert(1)&gt;'
    )
  );
  t.false(described.text.includes('<img src=x'));
  t.true(res.text.includes(payment.reference));
  t.true(res.text.includes('$12,000.50'));
  const receipt = await agent.get(
    `/en/my-account/billing/${payment.reference}`
  );
  t.is(receipt.status, 200);
  // (its HTML copy starts with the date, like the PDF)
  const html = await agent
    .get(`/en/my-account/billing/${payment.reference}.html`)
    .redirects(1);
  t.is(html.status, 200);
  t.true(html.text.includes(payment.reference));
  t.true(receipt.text.includes(payment.reference));
  t.true(receipt.text.includes('$12,000.50'));
  t.true(receipt.text.includes('Enterprise'));
  t.true(res.text.includes(`$12,000.50 · 2/3/26`));
  t.true(
    res.text.includes(`href="/en/my-account/billing/${payment.reference}"`)
  );

  // (and a payment that is due, once the period paid for is over)
  await Users.findByIdAndUpdate(customer._id, {
    $set: { enterprise_last_paid_at: new Date('2020-01-01') }
  });
  const due = await agent.get('/en/my-account/billing');
  t.regex(due.text, /Your payment was due on <strong[^>]*>1\/31\/26</);
  t.false(due.text.includes('Paid up'));

  // a reference that starts with a date of its own is found too, and the
  // list sorted by something internal is the list as usual
  t.is(
    await status(
      addPayment(t, customer, {
        paid_at: '2026-02-20',
        amount: '75',
        reference: '2026-02-20-007'
      })
    ),
    200
  );
  const dated = await agent.get('/en/my-account/billing/2026-02-20-007');
  t.is(dated.status, 200);
  t.true(dated.text.includes('$75.00'));
  const sorted = await agent
    .get('/en/my-account/billing')
    .query({ sort: 'enterprise_notes' });
  t.is(sorted.status, 200);
  t.false(sorted.text.includes('Check received via mail'));

  // nobody else opens the receipt
  const admin = await t.context.web
    .get(`/en/my-account/billing/${payment.reference}`)
    .set('Accept', 'application/json');
  t.is(admin.status, 400);

  for (const text of [res.text, receipt.text]) {
    t.false(text.includes(TRACKING_URL));
    t.false(text.includes('Check received via mail'));
  }

  // nothing internal
  t.false(res.text.includes(TRACKING_URL));
  t.false(res.text.includes('mercury'));
  t.false(res.text.includes('Check received via mail'));
  t.false(res.text.includes('accounts payable'));

  // nothing to pay, renew or change
  t.false(res.text.includes('/my-account/billing/make-payment'));
  t.false(res.text.includes('/my-account/billing/enable-auto-renew'));
  t.false(res.text.includes('data-target="#modal-change-plan"'));
  t.false(res.text.includes('/my-account/billing/upgrade-request'));

  // and the account as the API returns it has none of it either
  const user = await Users.findById(customer._id).exec();
  const json = JSON.stringify([user.toObject(), payment.toObject()]);
  t.false(json.includes('enterprise_notes'));
  t.false(json.includes('enterprise_tracking_url'));
  t.false(json.includes('is_enterprise'));
  t.false(json.includes('mercury'));
  t.false(json.includes('Check received'));
});

test('an enterprise account cannot pay or change its plan itself', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  const agent = await signIn(t, customer, t.context.customerPassword);

  for (const res of [
    await agent
      .get('/en/my-account/billing/make-payment')
      .set('Accept', 'application/json'),
    await agent
      .get('/en/my-account/billing/enable-auto-renew')
      .set('Accept', 'application/json'),
    await agent
      .get('/en/my-account/billing/upgrade')
      .query({ plan: 'free' })
      .set('Accept', 'application/json'),
    await agent
      .get('/en/my-account/billing/upgrade')
      .query({ plan: 'enhanced_protection', session_id: 'cs_test_enterprise' })
      .set('Accept', 'application/json'),
    await agent
      .post('/en/my-account/billing/upgrade')
      .set('Accept', 'application/json')
      .send({
        plan: 'enhanced_protection',
        payment_method: 'credit_card',
        payment_type: 'one-time',
        payment_duration: '30d'
      }),
    await agent
      .post('/en/my-account/billing/upgrade-request')
      .set('Accept', 'application/json')
      .send({ kind: 'storage_limit', upgrade_option: '+10 GB' })
  ]) {
    t.is(res.status, 400);
    t.true(res.body.message.includes('Enterprise'), `${res.body.message}`);
  }

  const user = await Users.findById(customer._id).lean().exec();
  t.is(user.plan, 'team');
  t.true(user.is_enterprise);
});

test('other admins of an enterprise Team domain see Enterprise too', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);

  const password = falso.randPassword();
  let other = await t.context.userFactory.make();
  other = await Users.register(other, password);
  other[config.userFields.hasSetPassword] = true;
  other[config.userFields.hasVerifiedEmail] = true;
  other = await other.save();

  const domain = await t.context.domainFactory
    .withState({
      plan: 'team',
      members: [
        { user: customer._id, group: 'admin' },
        { user: other._id, group: 'admin' }
      ]
    })
    .create();
  // (the other admin's own domain is not an enterprise one)
  const own = await t.context.domainFactory
    .withState({
      plan: 'free',
      members: [{ user: other._id, group: 'admin' }]
    })
    .create();

  const agent = await signIn(t, other, password);
  const res = await agent.get('/en/my-account/domains');
  t.is(res.status, 200);
  t.true(res.text.includes(domain.name));
  t.true(res.text.includes(own.name));
  t.regex(res.text, /acct-user-meta">\s*Enterprise/);
  t.regex(res.text, /badge-success text-uppercase[^>]*>Enterprise</);
  const unchanged = await Users.findById(other._id).lean().exec();
  t.is(unchanged.plan, 'free');

  // a member that is not an admin of it does not
  await Domains.findByIdAndUpdate(domain._id, {
    $set: { 'members.1.group': 'user' }
  });
  const member = await agent.get('/en/my-account/domains');
  t.is(member.status, 200);
  t.notRegex(member.text, /acct-user-meta">\s*Enterprise/);
  t.notRegex(member.text, /badge-success text-uppercase[^>]*>Enterprise</);
});

test('the plan starts over when an account stops being enterprise', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  t.is(await status(addPayment(t, customer)), 200);

  const before = Date.now();
  t.is(await status(setEnterprise(t, customer, { is_enterprise: '' })), 200);

  const user = await Users.findById(customer._id).lean().exec();
  t.false(user.is_enterprise);
  t.is(user.plan, 'team');
  // billed and rate limited like any other account from now on
  t.false(user[config.userFields.isRateLimitWhitelisted]);
  t.true(new Date(user[config.userFields.planSetAt]).getTime() >= before);
  t.true(
    dayjs(user[config.userFields.planExpiresAt]).isBefore(dayjs().add(1, 'day'))
  );
  // what was recorded is kept
  t.is(await Payments.countDocuments({ user: customer._id }), 1);
  t.is(user.enterprise_notes, NOTES);

  // and it can pay for itself again
  const agent = await signIn(t, customer, t.context.customerPassword);
  const res = await agent.get('/en/my-account/billing/make-payment');
  t.is(res.status, 200);
});

//
// Accounts created before enterprise billing have no `is_enterprise` field:
// reading one fills in the default, which is not a change from enterprise.
//
test('an account from before enterprise billing keeps its plan dates', async (t) => {
  const planSetAt = dayjs().subtract(3, 'month').startOf('day').toDate();
  const { _id } = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: planSetAt,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: _id,
      amount: 900,
      invoice_at: planSetAt,
      method: 'visa',
      duration: ms('1y'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  await Users.collection.updateOne(
    { _id },
    {
      $unset: {
        is_enterprise: 1
      }
    }
  );

  const user = await Users.findById(_id);
  user[config.passport.fields.givenName] = 'Renamed';
  await user.save();

  // nor is saving the enterprise form with the box not checked
  await Users.collection.updateOne({ _id }, { $unset: { is_enterprise: 1 } });
  t.is(
    await status(setEnterprise(t, { id: String(_id) }, { is_enterprise: '' })),
    200
  );

  const saved = await Users.findById(_id).lean().exec();
  t.is(
    new Date(saved[config.userFields.planSetAt]).getTime(),
    planSetAt.getTime()
  );
  t.is(
    date(saved[config.userFields.planExpiresAt]),
    date(dayjs(planSetAt).add(1, 'year'))
  );
  t.is(saved.plan, 'team');
});

test('an enterprise account is paying since its start date', async (t) => {
  const { customer } = t.context;
  t.is(await getPaidSince(customer), null);
  t.is(await status(setEnterprise(t, customer)), 200);
  const user = await Users.findById(customer._id).lean().exec();
  t.is(date(await getPaidSince(user)), '2026-01-31');
  // (not before it started)
  t.is(await getPaidSince(user, new Date('2026-01-01')), null);
});

test('an enterprise account gets no payment reminders', async (t) => {
  t.timeout(ms('5m'));

  // two accounts on the Team plan that ran out months ago, each with a
  // Team domain: one of them is an enterprise account
  const users = [];
  for (const isEnterprise of [false, true]) {
    const user = await t.context.userFactory
      .withState({
        plan: 'team',
        [config.userFields.planSetAt]: dayjs().subtract(3, 'month').toDate(),
        [config.userFields.hasVerifiedEmail]: true
      })
      .create();
    await t.context.domainFactory
      .withState({
        plan: 'team',
        members: [{ user: user._id, group: 'admin' }]
      })
      .create();
    if (isEnterprise) t.is(await status(setEnterprise(t, user)), 200);
    users.push(user);
  }

  const sent = await runJob(t, 'billing');
  const reminders = sent.filter(
    (email) => email.template === 'payment-reminder'
  );
  t.deepEqual(
    reminders.map((email) => email.to),
    [users[0].email]
  );

  const [regular, enterprise] = await Promise.all(
    users.map((user) => Users.findById(user._id).lean().exec())
  );
  t.truthy(regular[config.userFields.paymentReminderInitialSentAt]);
  t.falsy(enterprise[config.userFields.paymentReminderInitialSentAt]);
});

test('admins are reminded when an enterprise payment is due', async (t) => {
  t.timeout(ms('10m'));
  const { customer } = t.context;
  // (of this customer: the accounts of the other tests are in the database)
  const reminders = async () => {
    const sent = await runJob(t, 'enterprise-billing-reminder');
    return sent.filter(
      (email) =>
        email.subject.startsWith('Enterprise payment') &&
        email.subject.endsWith(customer.email)
    );
  };

  // due in more than a week: not yet
  t.is(
    await status(
      setEnterprise(t, customer, {
        enterprise_start_date: date(dayjs.utc().add(30, 'day'))
      })
    ),
    200
  );
  t.deepEqual(await reminders(), []);

  // due in three days
  const dueAt = dayjs.utc().add(3, 'day');
  t.is(
    await status(
      setEnterprise(t, customer, { enterprise_start_date: date(dueAt) })
    ),
    200
  );
  let sent = await reminders();
  t.is(sent.length, 1);
  const [reminder] = sent;
  // only admins are told (never the customer)
  t.is(reminder.to, config.supportEmail);
  // (2 when the day changed since the due date was set above)
  t.regex(reminder.subject, /^Enterprise payment due in [23] days for /);
  t.true(reminder.html.includes(customer.email));
  t.true(reminder.html.includes(dueAt.format('MMMM D, YYYY')));
  t.true(reminder.html.includes('Annual'));
  t.true(reminder.html.includes('$12,000.50'));
  t.true(reminder.html.includes(`/admin/users/${customer.id}`));
  // (the notes are text, not markup)
  t.true(reminder.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  t.false(reminder.html.includes('<script>alert(1)</script>'));

  // not again within a week
  t.deepEqual(await reminders(), []);

  // again a week later while it is still not paid
  await Users.findByIdAndUpdate(customer._id, {
    $set: {
      enterprise_reminder_sent_at: dayjs().subtract(8, 'day').toDate()
    }
  });
  sent = await reminders();
  t.is(sent.length, 1);

  // overdue
  t.is(
    await status(
      setEnterprise(t, customer, {
        enterprise_start_date: date(dayjs.utc().subtract(10, 'day'))
      })
    ),
    200
  );
  sent = await reminders();
  t.is(sent.length, 1);
  t.regex(sent[0].subject, /^Enterprise payment overdue by 1[01] days for /);

  // paid: the next one is due in about a year
  t.is(
    await status(
      addPayment(t, customer, {
        paid_at: date(dayjs.utc()),
        mark_paid: 'true',
        due_at: date(dayjs.utc().subtract(10, 'day'))
      })
    ),
    200
  );
  t.deepEqual(await reminders(), []);

  // overdue again, but the account was banned
  await Users.findByIdAndUpdate(customer._id, {
    $unset: { enterprise_last_paid_at: 1 },
    $set: { [config.userFields.isBanned]: true }
  });
  t.deepEqual(await reminders(), []);

  // or is no longer an enterprise account
  await Users.findByIdAndUpdate(customer._id, {
    $set: { [config.userFields.isBanned]: false, is_enterprise: false }
  });
  t.deepEqual(await reminders(), []);
});

test('a form from a page that is out of date is not saved', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
  const [, rev] = /name="rev" value="([a-f\d]{16})"/.exec(page.text);

  // another admin changes the notes in between
  t.is(
    await status(
      setEnterprise(t, customer, { rev, enterprise_notes: 'First' })
    ),
    200
  );
  t.is(
    await status(
      setEnterprise(t, customer, { rev, enterprise_notes: 'Second' })
    ),
    400
  );
  const user = await Users.findById(customer._id).lean().exec();
  t.is(user.enterprise_notes, 'First');
});

test('admins find enterprise customers from the menu and the domains', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  const domain = await t.context.domainFactory
    .withState({
      plan: 'team',
      members: [{ user: customer._id, group: 'admin' }]
    })
    .create();

  const res = await t.context.web
    .get('/en/admin/domains')
    .query({ name: domain.name });
  t.is(res.status, 200);
  t.true(res.text.includes(domain.name));
  t.regex(res.text, /badge badge-success"[^>]*>Enterprise</);
  // (in the admin menu of the navbar and in the sidebar)
  t.true(res.text.split('href="/en/admin/enterprise"').length > 2);

  const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
  t.regex(page.text, /href="#enterprise">Enterprise</);
});

test('the sheet of all enterprise customers is saved at once', async (t) => {
  // (the customers of this test only: the others stay as they are)
  await Users.updateMany({}, { $set: { is_enterprise: false } });

  const customers = [];
  for (const start of ['2026-01-31', '2026-03-15']) {
    const user = await t.context.userFactory.create();
    t.is(
      await status(setEnterprise(t, user, { enterprise_start_date: start })),
      200
    );
    customers.push(user);
  }

  // someone who is not an enterprise customer
  const other = await t.context.userFactory.create();

  const sheet = async () => {
    const res = await t.context.web.get('/en/admin/enterprise');
    t.is(res.status, 200);
    const rows = {};
    for (const user of [...customers, other]) {
      const match = new RegExp(
        `name="rev__${user.id}" value="([a-f\\d]{16})"`
      ).exec(res.text);
      if (match) rows[user.id] = match[1];
    }

    return { text: res.text, rows };
  };

  const row = (user, rev, values = {}) =>
    Object.fromEntries(
      Object.entries({
        rev,
        due_at: date(user.enterprise_start_date || '2026-01-31'),
        enterprise_billing_frequency: 'annual',
        enterprise_billing_amount: '12000.50',
        enterprise_start_date: '2026-01-31',
        enterprise_last_paid_at: '',
        enterprise_notes: NOTES,
        paid_at: '',
        amount: '',
        reference: '',
        description: '',
        tracking_url: '',
        row: 'true',
        ...values
      }).map(([key, value]) => [`${key}__${user.id}`, value])
    );
  const save = (body) =>
    t.context.web
      .put('/en/admin/enterprise')
      .set('Accept', 'application/json')
      .send(body);

  const [first, second] = customers;
  let { text, rows } = await sheet();
  t.true(text.includes(first.email));
  t.true(text.includes(second.email));
  t.false(text.includes(other.email));
  t.is(Object.keys(rows).length, 2);

  // a mistake in one row: nothing is saved, and the row is named
  let res = await save({
    ...row(first, rows[first.id], { enterprise_notes: 'Changed' }),
    ...row(second, rows[second.id], {
      enterprise_start_date: '2026-03-15',
      enterprise_billing_amount: 'abc'
    }),
    rows: '2'
  });
  t.is(res.status, 400);
  t.true(res.body.message.includes(second.email));
  t.true(res.body.message.includes('Nothing was saved'));
  let saved = await Users.findById(first._id).lean().exec();
  t.is(saved.enterprise_notes, NOTES);

  // a sheet that did not arrive whole, or with someone who is not an
  // enterprise customer on it
  res = await save({ ...row(first, rows[first.id]), rows: '2' });
  t.is(res.status, 400);
  res = await save({
    ...row(first, rows[first.id]),
    ...row(other, rows[first.id], { enterprise_notes: 'Mine' }),
    rows: '2'
  });
  t.is(res.status, 400);
  saved = await Users.findById(other._id).lean().exec();
  t.falsy(saved.is_enterprise);
  t.is(saved.enterprise_notes, undefined);

  // one save: the notes of one customer, and a payment for the other (an
  // empty amount is their billing amount) that pays for the period due
  res = await save({
    ...row(first, rows[first.id], { enterprise_notes: 'Changed' }),
    ...row(second, rows[second.id], {
      enterprise_start_date: '2026-03-15',
      due_at: '2026-03-15',
      paid_at: '2026-03-20',
      reference: 'TX-7781',
      description: 'March invoice',
      tracking_url: TRACKING_URL,
      mark_paid: 'true'
    }),
    rows: '2'
  });
  t.is(res.status, 200);
  saved = await Users.findById(first._id).lean().exec();
  t.is(saved.enterprise_notes, 'Changed');
  t.deepEqual(await getPayments(first), []);
  saved = await Users.findById(second._id).lean().exec();
  const [recorded, ...rest] = await getPayments(second);
  t.deepEqual(rest, []);
  t.is(recorded.amount, 1_200_050);
  t.is(recorded.reference, 'TX-7781');
  t.is(recorded.enterprise_description, 'March invoice');
  t.is(recorded.enterprise_tracking_url, TRACKING_URL);
  t.is(date(recorded.invoice_at), '2026-03-20');
  t.is(date(saved.enterprise_last_paid_at), '2026-03-15');
  t.is(String(recorded.enterprise_created_by), t.context.user.id);

  // the same sheet again is out of date (the payment is not recorded twice)
  res = await save({
    ...row(first, rows[first.id], { enterprise_notes: 'Changed' }),
    ...row(second, rows[second.id], {
      enterprise_start_date: '2026-03-15',
      paid_at: '2026-03-20'
    }),
    rows: '2'
  });
  t.is(res.status, 400);
  t.is(await Payments.countDocuments({ user: second._id }), 1);

  // a sheet without changes saves nothing
  ({ rows } = await sheet());
  res = await save({
    ...row(first, rows[first.id], { enterprise_notes: 'Changed' }),
    ...row(second, rows[second.id], {
      enterprise_start_date: '2026-03-15',
      enterprise_last_paid_at: '2026-03-15'
    }),
    rows: '2'
  });
  t.is(res.status, 200);

  // only admins
  const agent = await signIn(t, t.context.customer, t.context.customerPassword);
  t.is(
    await status(
      agent.get('/en/admin/enterprise').set('Accept', 'application/json')
    ),
    401
  );
  t.is(
    await status(
      agent
        .put('/en/admin/enterprise')
        .set('Accept', 'application/json')
        .send({ ...row(first, rows[first.id]), rows: '1' })
    ),
    401
  );
});

test('several payments of one customer are recorded at once', async (t) => {
  const { customer } = t.context;
  t.is(
    await status(
      setEnterprise(t, customer, { enterprise_billing_frequency: 'monthly' })
    ),
    200
  );

  const row = (n, values = {}) =>
    Object.fromEntries(
      Object.entries({
        paid_at: '',
        amount: '',
        reference: '',
        description: '',
        tracking_url: '',
        notes: '',
        payment_row: 'true',
        ...values
      }).map(([key, value]) => [`${key}__${n}`, value])
    );
  const record = (body) =>
    t.context.web
      .post(`/en/admin/users/${customer.id}/enterprise/payments`)
      .set('Accept', 'application/json')
      .send({ due_at: '2026-01-31', ...body });

  // the page has a row for each payment
  const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
  t.true(page.text.includes('name="paid_at__1"'));
  t.true(page.text.includes('name="paid_at__6"'));

  // nothing entered
  let res = await record({ ...row(1), ...row(2) });
  t.is(res.status, 400);

  // a mistake in one row: none is recorded, and the row is named
  res = await record({
    ...row(1, { paid_at: '2026-02-01', mark_paid: 'true' }),
    ...row(2, { paid_at: '2026-03-01', amount: 'abc' })
  });
  t.is(res.status, 400);
  t.true(res.body.message.startsWith('Payment 2:'), `${res.body.message}`);
  res = await record({
    ...row(1, { paid_at: '2026-02-01' }),
    ...row(2, { paid_at: '2026-02-01' })
  });
  t.is(res.status, 400);
  t.deepEqual(await getPayments(customer), []);
  let user = await Users.findById(customer._id).lean().exec();
  t.is(user.enterprise_last_paid_at, undefined);

  // three payments in one save (the row in between is empty): two of them
  // pay for the period due and the one after it, the third for none
  res = await record({
    ...row(1, { paid_at: '2026-02-01', mark_paid: 'true' }),
    ...row(2),
    ...row(3, {
      paid_at: '2026-03-02',
      reference: 'tx-feb',
      description: 'February',
      mark_paid: 'true'
    }),
    ...row(4, { paid_at: '2026-03-05', amount: '50', notes: 'Late fee' })
  });
  t.is(res.status, 200);
  const payments = await getPayments(customer);
  t.deepEqual(
    payments.map((payment) => [
      date(payment.invoice_at),
      payment.amount,
      payment.enterprise_period_due_at
        ? date(payment.enterprise_period_due_at)
        : null
    ]),
    [
      ['2026-03-05', 5000, null],
      ['2026-03-02', 1_200_050, '2026-02-28'],
      ['2026-02-01', 1_200_050, '2026-01-31']
    ]
  );
  t.is(payments[1].reference, 'TX-FEB');
  t.is(payments[1].enterprise_description, 'February');
  t.is(payments[0].enterprise_notes, 'Late fee');
  user = await Users.findById(customer._id).lean().exec();
  t.is(date(user.enterprise_last_paid_at), '2026-02-28');

  // the same form again is out of date
  res = await record({
    ...row(1, { paid_at: '2026-04-01', mark_paid: 'true' })
  });
  t.is(res.status, 400);
  t.is(await Payments.countDocuments({ user: customer._id }), 3);
});

test('the admin dashboard counts enterprise accounts at what they are billed', async (t) => {
  // (the accounts and payments of this test only)
  await Users.updateMany({}, { $set: { is_enterprise: false, plan: 'free' } });
  await Payments.deleteMany({});

  // a customer on the Team plan, paid up
  const planSetAt = dayjs().subtract(2, 'month').toDate();
  const regular = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: planSetAt,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: regular._id,
      amount: 10_800,
      invoice_at: planSetAt,
      method: 'visa',
      duration: ms('1y'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  const saved = await Users.findById(regular._id);
  await saved.save();

  // an enterprise customer billed $12,000.50 a year, with one payment
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  t.is(await status(addPayment(t, customer)), 200);

  const res = await t.context.web
    .get('/en/admin')
    .set('Accept', 'application/json');
  t.is(res.status, 200);
  const metric = (selector) =>
    res.body.metrics.find((metric) => metric.selector === selector).value;
  const chart = (selector) =>
    res.body.charts.find((chart) => chart.selector === selector).options;

  // $12,000.50 a year is $1,000 a month (not the $9 of the Team plan it is
  // on), next to the $9 of the Team plan customer
  t.is(metric('#metrics-enterprise-mrr'), '$1,000');
  t.is(metric('#metrics-enterprise-arr'), '$12,000');
  t.is(metric('#metrics-enterprise-customers'), '1');
  t.is(metric('#metrics-mrr'), '$1,009');
  t.is(metric('#metrics-arr'), '$12,108');

  // the charts have it in the total and on a line of its own
  const mrr = chart('#mrr-chart').series;
  t.deepEqual(
    mrr.map((series) => [series.name, series.data[series.data.length - 1][1]]),
    [
      ['MRR', 1009],
      ['Enterprise', 1000]
    ]
  );
  const arr = chart('#arr-chart').series;
  t.deepEqual(
    arr.map((series) => [series.name, series.data[series.data.length - 1][1]]),
    [
      ['ARR', 12_108],
      ['Enterprise', 12_000]
    ]
  );

  // its payment is revenue, on a line of its own and not as a card payment
  for (const selector of ['#revenue-chart', '#one-time-revenue-chart']) {
    const { series } = chart(selector);
    const enterprise = series.find((series) => series.name === 'Enterprise');
    t.deepEqual(enterprise.data, [['2026/02', 12_001]], `${selector}`);
    const total = series.find((series) => series.name === 'Total');
    t.true(
      total.data.some(
        ([month, dollars]) => month === '2026/02' && dollars >= 12_001
      )
    );
  }

  const stripe = chart('#revenue-chart').series.find(
    (series) => series.name === 'Stripe'
  );
  t.false(stripe.data.some(([month]) => month === '2026/02'));

  // the page has a place for each
  const page = await t.context.web.get('/en/admin').set('Accept', 'text/html');
  t.is(page.status, 200);
  for (const id of [
    'metrics-enterprise-mrr',
    'metrics-enterprise-arr',
    'metrics-enterprise-customers'
  ])
    t.true(page.text.includes(`id="${id}"`), `${id}`);
});

//
// A receipt is looked up among the payments of the account that asks for
// it, however its reference is written.
//
test('a payment is only ever shown to the account it belongs to', async (t) => {
  const { customer } = t.context;
  t.is(await status(setEnterprise(t, customer)), 200);
  t.is(await status(addPayment(t, customer, { reference: 'inv-locked' })), 200);

  // another customer, with an enterprise payment and a card payment whose
  // references are parts of the one above
  const password = falso.randPassword();
  let other = await t.context.userFactory.make();
  other = await Users.register(other, password);
  other[config.userFields.hasSetPassword] = true;
  other[config.userFields.hasVerifiedEmail] = true;
  other = await other.save();
  t.is(await status(setEnterprise(t, other)), 200);
  t.is(
    await status(addPayment(t, other, { reference: 'locked', amount: '42' })),
    200
  );

  const owner = await signIn(t, customer, t.context.customerPassword);
  const stranger = await signIn(t, other, password);
  const anonymous = request(t.context._web.server);
  const paths = [
    'INV-LOCKED',
    'inv-locked',
    'INV-LOCKED.pdf',
    'INV-LOCKED.html',
    '2026-02-03-INV-LOCKED.html',
    'X-INV-LOCKED'
  ];

  // the owner reaches it by each way a receipt is linked
  for (const path of paths.slice(0, 5)) {
    const res = await owner
      .get(`/en/my-account/billing/${path}`)
      .set('Accept', 'text/html');
    t.true([200, 301].includes(res.status), `${path} ${res.status}`);
  }

  // the other customer gets their own payment or nothing, never this one
  for (const path of paths) {
    const res = await stranger
      .get(`/en/my-account/billing/${path}`)
      .set('Accept', 'text/html')
      .redirects(2);
    // (a PDF, of their own payment, has no text)
    const text = res.text || '';
    t.false(text.includes('INV-LOCKED<'), `${path}`);
    t.false(text.includes('$12,000.50'), `${path}`);
    t.false(text.includes(customer.email), `${path}`);
  }

  // a reference that is theirs alone is refused to the first customer
  const mine = await owner
    .get('/en/my-account/billing/LOCKED')
    .set('Accept', 'application/json');
  t.is(mine.status, 400);

  // and nobody who is not signed in
  for (const path of paths) {
    const res = await anonymous
      .get(`/en/my-account/billing/${path}`)
      .set('Accept', 'application/json');
    // (sent to the login page, with nothing of the payment)
    t.true(res.body.redirectTo.includes('/login'), `${path}`);
    t.false(res.text.includes('12,000'), `${path}`);
    t.is(
      Object.keys(res.body).sort().join(','),
      'message,redirectTo',
      `${path}`
    );
  }

  // an admin changes or removes a payment only through its own account
  const [payment] = await getPayments(customer);
  for (const id of [other.id, 'not-an-id']) {
    t.is(
      await status(
        t.context.web
          .put(`/en/admin/users/${id}/enterprise/payments/${payment.id}`)
          .set('Accept', 'application/json')
          .send({ description: 'Moved' })
      ),
      404
    );
    t.is(
      await status(
        t.context.web
          .delete(`/en/admin/users/${id}/enterprise/payments/${payment.id}`)
          .set('Accept', 'application/json')
      ),
      404
    );
  }

  const kept = await Payments.findById(payment._id).lean().exec();
  t.is(kept.enterprise_description, undefined);
});

//
// The signed agreement of an enterprise customer is a PDF an admin uploads.
// Admins download it, and so does that customer while their account is
// enterprise; nobody else does, and it is not part of the account anywhere
// else.
//
test('the enterprise agreement is for admins and its own customer only', async (t) => {
  const { customer } = t.context;
  const pdf = Buffer.concat([
    Buffer.from('%PDF-1.7\n'),
    Buffer.from('agreement-of-this-test-'.repeat(200)),
    Buffer.from('\n%%EOF\n')
  ]);
  const upload = (user, buffer = pdf, name = 'Signed Agreement.pdf', type) =>
    t.context.web
      .post(`/en/admin/users/${user.id}/enterprise/agreement`)
      .set('Accept', 'application/json')
      .attach('agreement', buffer, {
        filename: name,
        contentType: type || 'application/pdf'
      });
  const download = (agent, path) =>
    agent
      .get(path)
      .buffer(true)
      .parse((res, callback) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(chunks)));
      });
  const adminPath = `/en/admin/users/${customer.id}/enterprise/agreement`;
  const customerPath = '/en/my-account/billing/enterprise-agreement';

  // not for an account that is not enterprise
  t.is(await status(upload(customer)), 400);
  t.is(await status(setEnterprise(t, customer)), 200);

  // only a PDF, by what is in it, of up to 10 MB
  t.is(
    await status(
      t.context.web.post(adminPath).set('Accept', 'application/json').send({})
    ),
    400
  );
  for (const buffer of [
    Buffer.from('<html><script>alert(1)</script></html>'),
    Buffer.from('%PDF-1.7 without an end'),
    Buffer.concat([Buffer.from('MZ'), pdf]),
    Buffer.alloc(0)
  ])
    t.is(await status(upload(customer, buffer)), 400);
  const large = await upload(
    customer,
    Buffer.concat([
      pdf,
      Buffer.alloc(11 * 1024 * 1024, 32),
      Buffer.from('%%EOF')
    ])
  );
  t.true([400, 413].includes(large.status), `${large.status}`);
  // (and one that is only just over it)
  t.is(
    await status(
      upload(
        customer,
        Buffer.concat([
          pdf,
          Buffer.alloc(10 * 1024 * 1024, 32),
          Buffer.from('%%EOF')
        ])
      )
    ),
    400
  );
  let raw = await Users.collection.findOne({ _id: customer._id });
  t.is(raw.enterprise_agreement, undefined);

  // uploaded, under a name that is safe in a path and in a header
  t.is(
    await status(
      upload(customer, pdf, '../../etc/"Signed\r\nAgreement" (ACME) <2026>.PDF')
    ),
    200
  );
  raw = await Users.collection.findOne({ _id: customer._id });
  t.true(pdf.equals(Buffer.from(raw.enterprise_agreement.data.buffer)));
  t.is(raw.enterprise_agreement.size, pdf.length);
  t.is(raw.enterprise_agreement.name, '_Signed_Agreement_ (ACME) _2026_.pdf');
  t.is(String(raw.enterprise_agreement.uploaded_by), t.context.user.id);

  // the file is not read with the account, nor part of it as the API
  // returns it
  const doc = await Users.findById(customer._id);
  t.is(doc.enterprise_agreement.data, undefined);
  t.is(doc.enterprise_agreement.size, pdf.length);
  const lean = await Users.findById(customer._id).lean().exec();
  t.is(lean.enterprise_agreement.data, undefined);
  const json = JSON.stringify(doc.toObject());
  t.false(json.includes('enterprise_agreement'));
  t.false(json.includes('Signed'));
  // (even when the file was read with it)
  const full = await Users.findById(customer._id).select(
    '+enterprise_agreement.data'
  );
  t.true(pdf.equals(full.enterprise_agreement.data));
  t.is(full.toObject().enterprise_agreement, undefined);
  t.false(JSON.stringify(full).includes('enterprise_agreement'));
  // (and saving the account as it is read keeps the file)
  doc[config.passport.fields.givenName] = 'Renamed';
  await doc.save();
  raw = await Users.collection.findOne({ _id: customer._id });
  t.true(pdf.equals(Buffer.from(raw.enterprise_agreement.data.buffer)));

  // an admin downloads it, as a file that is not shown in the page or kept
  let res = await download(t.context.web, adminPath);
  t.is(res.status, 200);
  t.true(pdf.equals(res.body));
  t.is(res.headers['content-type'], 'application/pdf');
  t.regex(res.headers['content-disposition'], /^attachment; filename="/);
  t.notRegex(res.headers['content-disposition'], /[\r\n]/);
  t.is(res.headers['x-content-type-options'], 'nosniff');
  t.is(res.headers['content-security-policy'], "default-src 'none'; sandbox");
  t.regex(res.headers['cache-control'], /no-store/);
  const page = await t.context.web.get(`/en/admin/users/${customer.id}`);
  t.true(page.text.includes('_Signed_Agreement_ (ACME) _2026_.pdf'));
  t.true(page.text.includes(`href="${adminPath}"`));

  // the customer downloads it from their Billing page
  const owner = await signIn(t, customer, t.context.customerPassword);
  const billing = await owner.get('/en/my-account/billing');
  t.true(billing.text.includes(`href="${customerPath}"`));
  res = await download(owner, customerPath);
  t.is(res.status, 200);
  t.true(pdf.equals(res.body));
  t.regex(res.headers['content-disposition'], /^attachment; filename="/);

  // but changes nothing of it, and does not reach it as an admin does
  t.is(
    await status(owner.get(adminPath).set('Accept', 'application/json')),
    401
  );
  t.is(
    await status(
      owner
        .post(adminPath)
        .set('Accept', 'application/json')
        .attach('agreement', Buffer.from('%PDF-1.7\nmine\n%%EOF'), 'mine.pdf')
    ),
    401
  );
  t.is(
    await status(owner.delete(adminPath).set('Accept', 'application/json')),
    401
  );

  // another enterprise customer has no agreement, and never gets this one
  const password = falso.randPassword();
  let other = await t.context.userFactory.make();
  other = await Users.register(other, password);
  other[config.userFields.hasSetPassword] = true;
  other[config.userFields.hasVerifiedEmail] = true;
  other = await other.save();
  const stranger = await signIn(t, other, password);
  for (const isEnterprise of [false, true]) {
    if (isEnterprise) t.is(await status(setEnterprise(t, other)), 200);
    res = await download(
      stranger.set('Accept', 'application/json'),
      customerPath
    );
    t.is(res.status, 404);
    t.false(res.body.includes('agreement-of-this-test'));
    t.is(
      await status(stranger.get(adminPath).set('Accept', 'application/json')),
      401
    );
    const theirs = await stranger
      .get('/en/my-account/billing')
      .set('Accept', 'text/html');
    t.true(theirs.text.includes('</html>'));
    t.false(theirs.text.includes(customerPath));
  }

  // nor someone who is not signed in
  const anonymous = await request(t.context._web.server)
    .get(customerPath)
    .set('Accept', 'application/json');
  t.true(anonymous.body.redirectTo.includes('/login'));
  t.false(anonymous.text.includes('agreement-of-this-test'));
  t.is(
    await status(
      request(t.context._web.server)
        .get(adminPath)
        .set('Accept', 'application/json')
    ),
    401
  );

  // replaced by another upload
  const second = Buffer.concat([pdf, Buffer.from('second\n%%EOF\n')]);
  t.is(await status(upload(customer, second, 'second.pdf')), 200);
  res = await download(owner, customerPath);
  t.true(second.equals(res.body));

  // once the account is no longer enterprise the customer does not get it
  // (admins still do)
  t.is(await status(setEnterprise(t, customer, { is_enterprise: '' })), 200);
  res = await download(owner.set('Accept', 'application/json'), customerPath);
  t.is(res.status, 404);
  t.false(res.body.includes('agreement-of-this-test'));
  const after = await owner
    .get('/en/my-account/billing')
    .set('Accept', 'text/html');
  t.true(after.text.includes('</html>'));
  t.false(after.text.includes(customerPath));
  res = await download(t.context.web, adminPath);
  t.is(res.status, 200);
  t.true(second.equals(res.body));
  t.is(await status(upload(customer)), 400);

  // removed by an admin: nothing of it is left on the account
  t.is(
    await status(
      t.context.web.delete(adminPath).set('Accept', 'application/json')
    ),
    200
  );
  raw = await Users.collection.findOne({ _id: customer._id });
  t.is(raw.enterprise_agreement, undefined);
  t.is(
    await status(
      t.context.web.get(adminPath).set('Accept', 'application/json')
    ),
    404
  );
});
