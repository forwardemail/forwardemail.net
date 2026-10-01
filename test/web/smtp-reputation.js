/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const test = require('ava');
const request = require('supertest');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const { Payments, Users } = require('#models');

const TIERS = config.smtpReputationTiers;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().subtract(10, 'day').toDate(),
      [config.userFields.planExpiresAt]: dayjs().add(20, 'day').toDate()
    })
    .make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();

  // paying customer for the last 10 days
  const _id = new mongoose.Types.ObjectId();
  const invoiceAt = dayjs().subtract(10, 'day').toDate();
  await Payments.collection.insertOne({
    _id,
    id: _id.toString(),
    user: t.context.user._id,
    reference: _id.toString(),
    amount: 300,
    amount_refunded: 0,
    currency: 'usd',
    method: 'visa',
    kind: 'subscription',
    plan: 'enhanced_protection',
    duration: 30 * 24 * 60 * 60 * 1000,
    invoice_at: invoiceAt,
    created_at: invoiceAt,
    updated_at: invoiceAt
  });

  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

function getCard(document) {
  return [...document.querySelectorAll('.card')].find(
    (card) =>
      card.querySelector('.card-header')?.textContent.trim() ===
      'Outbound SMTP Reputation'
  );
}

function getRows(card) {
  const rows = {};
  for (const dt of card.querySelectorAll('dt'))
    rows[dt.textContent.trim()] = dt.nextElementSibling.textContent
      .replace(/\s+/g, ' ')
      .trim();
  return rows;
}

test('billing shows reputation instead of an SMTP add-on', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/my-account/billing');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  // no SMTP upgrade request form
  t.is(document.querySelector('input[name="kind"][value="smtp_limit"]'), null);
  t.truthy(document.querySelector('input[name="kind"][value="storage_limit"]'));

  const card = getCard(document);
  t.truthy(card);
  const rows = getRows(card);
  t.is(rows['Daily threshold'], `${TIERS[0].limit} per day`);
  t.is(rows['Reputation tier'], `1 / ${TIERS.length}`);
  t.is(rows['Paying without a break (days)'], '10');
  t.is(rows['Clean sending days on this tier'], '0');

  // requirements for the next tier
  t.regex(
    card.textContent.replace(/\s+/g, ' '),
    new RegExp(`Next tier: ${TIERS[1].limit.toLocaleString('en')} per day`)
  );
  const items = [...card.querySelectorAll('li')];
  t.is(items.length, 4);
  // 10 paid days meets the next tier's paid time requirement
  t.truthy(items[0].querySelector('.fa-check-circle'));
  t.falsy(items[1].querySelector('.fa-check-circle'));
  // only real recipients across enough domains count
  t.regex(
    items[2].textContent.replace(/\s+/g, ' '),
    new RegExp(
      `Reach at least ${Math.ceil(
        TIERS[0].limit * config.smtpReputationMinUtilization
      )} recipients outside your own domains in a single day`
    )
  );
  t.regex(
    items[3].textContent.replace(/\s+/g, ' '),
    new RegExp(
      `Reach at least ${TIERS[1].minRecipientDomains} different recipient domains in a single day`
    )
  );
  t.falsy(items[3].querySelector('.fa-check-circle'));
});

test('a pause after spam or virus reports is shown', async (t) => {
  const { web, user } = t.context;
  const holdUntil = dayjs().add(20, 'day').toDate();
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationHoldUntil]: holdUntil,
        [config.userFields.smtpReputationPeak]: 42,
        [config.userFields.smtpReputationPeakDomains]:
          TIERS[1].minRecipientDomains
      }
    }
  );

  const res = await web.get('/en/my-account/emails');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const card = getCard(document);
  const text = card.textContent.replace(/\s+/g, ' ');
  t.regex(text, /We paused moving up to a higher tier until/);
  t.regex(text, new RegExp(dayjs(holdUntil).format('YYYY')));
  const rows = getRows(card);
  t.is(
    rows[
      `Busiest day in the last ${config.smtpReputationLookbackDays} days (recipients outside your domains)`
    ],
    '42'
  );
  t.is(
    rows['Most recipient domains on a day'],
    String(TIERS[1].minRecipientDomains)
  );
  // the recipient domains requirement is met
  const items = [...card.querySelectorAll('li')];
  t.truthy(items[3].querySelector('.fa-check-circle'));

  // an expired pause is not shown
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationHoldUntil]: dayjs()
          .subtract(1, 'day')
          .toDate()
      }
    }
  );
  const res2 = await web.get('/en/my-account/emails');
  const card2 = getCard(new JSDOM(res2.text).window.document);
  t.notRegex(card2.textContent, /paused moving up to a higher tier until/);
});

test('an admin moving a sender to a tier lifts a pause', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { group: 'admin' } }
  );
  const sender = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.smtpReputationTier]: 0,
      [config.userFields.smtpReputationHoldUntil]: dayjs()
        .add(20, 'day')
        .toDate()
    })
    .create();

  const res = await web
    .put(`/en/admin/users/${sender.id}`)
    .set('Accept', 'application/json')
    .send({ smtp_reputation_tier: 1 });
  t.is(res.status, 200);

  const after = await Users.findById(sender._id).lean().exec();
  t.is(after[config.userFields.smtpReputationTier], 1);
  t.falsy(after[config.userFields.smtpReputationHoldUntil]);
});

test('SMTP upgrade requests are no longer accepted', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/my-account/billing/upgrade-request')
    .set('Accept', 'application/json')
    .send({ kind: 'smtp_limit', upgrade_option: '+1000 emails daily' });
  t.is(res.status, 400);
});

test('emails page shows reputation and slowdowns', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationTier]: 2,
        [config.userFields.smtpReputationCleanDays]: 1,
        [config.userFields.smtpThrottledAt]: new Date()
      }
    }
  );

  const res = await web.get('/en/my-account/emails');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  const card = getCard(document);
  t.truthy(card);
  const rows = getRows(card);
  t.is(
    rows['Daily threshold'],
    `${TIERS[2].limit.toLocaleString('en')} per day`
  );
  t.is(rows['Reputation tier'], `3 / ${TIERS.length}`);
  t.is(rows['Clean sending days on this tier'], '1');
  t.regex(card.textContent, /We slowed down your sending/);
});

test('an approved minimum places the user on its tier', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpLimit]: TIERS[1].limit,
        [config.userFields.smtpReputationTier]: 0
      }
    }
  );

  const res = await web.get('/en/my-account/billing');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const card = getCard(document);
  const rows = getRows(card);
  t.is(
    rows['Daily threshold'],
    `${TIERS[1].limit.toLocaleString('en')} per day`
  );
  t.is(
    rows['Approved minimum (set by our team)'],
    `${TIERS[1].limit.toLocaleString('en')} per day`
  );
  t.is(rows['Reputation tier'], `2 / ${TIERS.length}`);
  // the next tier is above the approved minimum
  t.regex(
    card.textContent.replace(/\s+/g, ' '),
    new RegExp(`Next tier: ${TIERS[2].limit.toLocaleString('en')} per day`)
  );
});

test('restricted users see the restriction without next tier steps', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { [config.userFields.smtpLimit]: 50 } }
  );

  const res = await web.get('/en/my-account/emails');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const card = getCard(document);
  t.regex(card.textContent, /Our team limited your outbound SMTP/);
  t.notRegex(card.textContent, /Next tier/);
  t.notRegex(card.textContent, /highest automatic tier/);
  t.is(getRows(card)['Daily threshold'], '50 per day');
});

test('free users without paid domains do not see the card', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { plan: 'free' } }
  );
  const res = await web.get('/en/my-account/billing');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  t.falsy(getCard(document));
});

test('team plan senders see the team starting threshold', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        plan: 'team',
        // (an approved minimum below the team threshold does not matter)
        [config.userFields.smtpLimit]: Math.floor(
          (TIERS[0].limit + config.smtpTeamLimitMessages) / 2
        )
      }
    }
  );

  const res = await web.get('/en/my-account/billing');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const card = getCard(document);
  const rows = getRows(card);
  const team = config.smtpTeamLimitMessages;
  t.is(rows['Daily threshold'], `${team.toLocaleString('en')} per day`);
  // (tiers are numbered from the team threshold)
  const covered = TIERS.findLastIndex((tier) => tier.limit <= team);
  t.is(rows['Reputation tier'], `1 / ${TIERS.length - covered}`);
  // it is not an approved minimum
  t.falsy(rows['Approved minimum (set by our team)']);
  t.regex(
    card.textContent.replace(/\s+/g, ' '),
    new RegExp(
      `Next tier: ${TIERS[covered + 1].limit.toLocaleString('en')} per day`
    )
  );
});

test('pricing advertises the team starting threshold', async (t) => {
  const { web } = t.context;
  const team = config.smtpTeamLimitMessages.toLocaleString('en');
  const text = (element) => element.textContent.replace(/\s+/g, ' ');

  // plan details on the pricing page
  const pricing = await web.get('/en/private-business-email');
  t.is(pricing.status, 200);
  const detail = new JSDOM(pricing.text).window.document.querySelector('#team');
  t.truthy(detail);
  t.regex(text(detail), new RegExp(`Outbound starts at ${team}/day`));

  // plan summaries on the home page (as a visitor who is not signed in)
  const home = await request(t.context._web.server).get('/en');
  t.is(home.status, 200);
  const { document } = new JSDOM(home.text).window;
  const summary = [...document.querySelectorAll('.fe-plan--compact')].find(
    (plan) =>
      plan.querySelector('.fe-plan__name')?.textContent.trim() === 'Team'
  );
  t.truthy(summary);
  t.regex(text(summary), new RegExp(`Outbound starts at ${team}/day`));

  // (only the Team plan)
  const enhanced = [...document.querySelectorAll('.fe-plan--compact')].find(
    (plan) =>
      plan.querySelector('.fe-plan__name')?.textContent.trim() === 'Enhanced'
  );
  t.notRegex(text(enhanced), /Outbound starts at/);

  // and the product overview mentions it
  t.regex(
    text(document.body),
    new RegExp(
      `New senders start at ${config.smtpReputationTiers[0].limit} messages per day \\(${config.smtpTeamLimitMessages} on the Team plan\\)`
    )
  );
});

test('members of team domains see the domain threshold', async (t) => {
  const { web, user } = t.context;
  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.smtpReputationTier]: 3
    })
    .create();
  await t.context.domainFactory
    .withState({
      plan: 'team',
      members: [
        { user: admin._id, group: 'admin' },
        { user: user._id, group: 'user' }
      ]
    })
    .create();

  let res = await web.get('/en/my-account/emails');
  let rows = getRows(getCard(new JSDOM(res.text).window.document));
  t.is(
    rows['Team domain threshold (highest admin)'],
    `${TIERS[3].limit.toLocaleString('en')} per day`
  );

  // (not while on hold after spam or virus reports)
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationHoldUntil]: dayjs()
          .add(10, 'day')
          .toDate()
      }
    }
  );
  res = await web.get('/en/my-account/emails');
  rows = getRows(getCard(new JSDOM(res.text).window.document));
  t.falsy(rows['Team domain threshold (highest admin)']);
});

test('admins can only set a manual limit the user model allows', async (t) => {
  const { web, user } = t.context;
  await Users.collection.updateOne(
    { _id: user._id },
    { $set: { group: 'admin' } }
  );
  const sender = await t.context.userFactory
    .withState({ plan: 'enhanced_protection' })
    .create();

  for (const smtpLimit of ['5', '10000001', '-1', 'abc']) {
    const res = await web
      .put(`/en/admin/users/${sender.id}`)
      .set('Accept', 'application/json')
      .send({ smtp_limit: smtpLimit });
    t.is(res.status, 400);
    t.regex(res.body.message, /SMTP limit must be between 10 and 10,000,000/);
  }

  const res = await web
    .put(`/en/admin/users/${sender.id}`)
    .set('Accept', 'application/json')
    .send({ smtp_limit: '10' });
  t.is(res.status, 200);
  const after = await Users.findById(sender._id).lean().exec();
  t.is(after[config.userFields.smtpLimit], 10);
});

test('team members see the same daily limit as the API', async (t) => {
  const { web, user } = t.context;
  // (a member of two Team plan domains, the first with a lower threshold)
  const lower = await t.context.userFactory
    .withState({ plan: 'team' })
    .create();
  await t.context.domainFactory
    .withState({
      plan: 'team',
      members: [
        { user: lower._id, group: 'admin' },
        { user: user._id, group: 'user' }
      ]
    })
    .create();
  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.smtpReputationTier]: 3
    })
    .create();
  await t.context.domainFactory
    .withState({
      plan: 'team',
      members: [
        { user: admin._id, group: 'admin' },
        { user: user._id, group: 'user' }
      ]
    })
    .create();

  const res = await web.get('/en/my-account/emails');
  t.is(res.status, 200);
  const text = new JSDOM(res.text).window.document.body.textContent.replace(
    /\s+/g,
    ' '
  );
  t.regex(
    text,
    new RegExp(`of the ${TIERS[3].limit} outbound SMTP messages allowed today`)
  );
});

test('the reason for a pause and a paused lending are shown', async (t) => {
  const { web, user } = t.context;
  const holdUntil = dayjs().add(20, 'day').toDate();
  await Users.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.userFields.smtpReputationHoldUntil]: holdUntil,
        [config.userFields.smtpReputationHoldReason]: 'bounces',
        [config.userFields.smtpReputationLendHoldUntil]: holdUntil
      }
    }
  );

  const res = await web.get('/en/my-account/emails');
  t.is(res.status, 200);
  const card = getCard(new JSDOM(res.text).window.document);
  const text = card.textContent.replace(/\s+/g, ' ');
  t.regex(
    text,
    /paused moving up to a higher tier until .+ because of a high bounce rate/
  );
  t.notRegex(text, /spam or virus reports about your mail/);
  t.regex(
    text,
    /Members of your Team plan domains cannot use your threshold until/
  );
});
