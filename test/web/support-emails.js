/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Emails that used to land in the support inbox: a storage upgrade request
// now emails the user a payment link (support is not emailed, since the
// user has to pay first), and the "Quick question" email sent after an
// account is deleted no longer copies support.
//

const falso = require('@ngneat/falso');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

// (every email sent by the web server is recorded instead of sent)
const sent = [];
const emailPath = require.resolve('#helpers/email');
require.cache[emailPath] = {
  id: emailPath,
  filename: emailPath,
  loaded: true,
  async exports(options) {
    sent.push(options);
  }
};

const utils = require('../utils');

const config = require('#config');
const { Payments, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(() => {
  sent.length = 0;
});
test.afterEach.always(utils.teardownWebServer);

async function login(t) {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  const planSetAt = new Date(Date.now() - ms('60d'));
  await Payments.create({
    user: user._id,
    amount: 3600,
    amount_refunded: 0,
    duration: ms('1y'),
    invoice_at: planSetAt,
    method: 'unknown',
    plan: 'enhanced_protection',
    kind: 'one-time'
  });
  user.plan = 'enhanced_protection';
  user[config.userFields.planSetAt] = planSetAt;
  t.context.user = await user.save();
  t.context.password = password;
  t.context.webConfig = { turnstileEnabled: false };
  await utils.setupWebServer(t);
  await utils.loginUser(t);
}

function recipients(options) {
  return ['to', 'cc', 'bcc']
    .flatMap((key) => [options.message?.[key]].flat())
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

test('a storage upgrade request emails the user the payment link', async (t) => {
  await login(t);
  const { user } = t.context;

  const res = await t.context.web
    .post('/en/my-account/billing/upgrade-request')
    .set('Accept', 'application/json')
    .send({ kind: 'storage_limit', upgrade_option: '+20 GB' });
  t.is(res.status, 200);

  const emails = sent.filter((options) =>
    recipients(options).includes(user.email.toLowerCase())
  );
  t.is(emails.length, 1);
  const [email] = emails;
  // (from the default address, which is support, so replies reach us)
  t.is(email.template, 'storage-upgrade');
  t.is(email.message.from, undefined);
  t.true(config.email.message.from.includes(config.supportEmail));
  t.is(email.message.to, user.email);
  t.true(
    email.locals.message.includes(
      `https://checkout.forwardemail.net/b/fZu5kE9al2Yj6iP25Fa3u0b?prefilled_email=${encodeURIComponent(
        user.email
      )}`
    )
  );
  t.true(email.locals.message.includes('+20 GB'));
  t.true(email.locals.message.includes('reply to this email'));

  // (support is not emailed)
  t.false(
    sent.some((options) =>
      recipients(options).includes(config.supportEmail.toLowerCase())
    )
  );

  // (and a second request soon after is refused)
  const again = await t.context.web
    .post('/en/my-account/billing/upgrade-request')
    .set('Accept', 'application/json')
    .send({ kind: 'storage_limit', upgrade_option: '+20 GB' });
  t.is(again.status, 400);
  t.true(again.body.message.includes('We already emailed you a payment link'));
  t.is(sent.length, 1);
});

test('a storage upgrade request for another amount says so in the users language', async (t) => {
  await login(t);
  const res = await t.context.web
    .post('/de/my-account/billing/upgrade-request')
    .set('Accept', 'application/json')
    .send({ kind: 'storage_limit', upgrade_option: 'Other' });
  t.is(res.status, 200);
  t.is(sent.length, 1);
  t.true(sent[0].locals.message.includes('Speicherplatz'));
  t.false(sent[0].locals.message.includes('>Other<'));
});

test('the email after an account is deleted does not copy support', async (t) => {
  await login(t);
  const { user, password } = t.context;

  const res = await t.context.web
    .delete('/en/my-account')
    .set('Accept', 'application/json')
    .send({ password });
  t.is(res.status, 200);

  await pWaitFor(
    () => sent.some((options) => options.message?.subject === 'Quick question'),
    { timeout: 10_000 }
  );
  const email = sent.find(
    (options) => options.message.subject === 'Quick question'
  );
  t.is(email.message.to, user.email);
  t.is(email.message.from, config.supportEmail);
  t.false(recipients(email).includes(config.supportEmail.toLowerCase()));
});
