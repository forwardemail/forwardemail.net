/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A plan's expiry is its start date plus the payments for that plan since.
// A start date left over from the previous plan (a switch recorded without
// moving it) is corrected from the payments when the user is saved; start
// dates that agree with the payments are left alone.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('./utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function pay(t, { user, plan, invoiceAt, duration = '30d' }) {
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: plan === 'team' ? 900 : 300,
      invoice_at: invoiceAt,
      method: 'free_beta_program',
      duration: ms(duration),
      plan,
      kind: 'one-time'
    })
    .create();
}

async function createUser(t, plan, planSetAt) {
  return t.context.userFactory
    .withState({
      plan,
      [config.userFields.planSetAt]: planSetAt,
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();
}

test('a start date left over from the previous plan is corrected', async (t) => {
  // Team from 85 days ago, two outstanding months paid today, then a switch
  // to Enhanced Protection that kept Team's start date
  const teamStart = dayjs().subtract(85, 'days').toDate();
  const user = await createUser(t, 'team', teamStart);
  await pay(t, { user, plan: 'team', invoiceAt: teamStart });
  await pay(t, {
    user,
    plan: 'team',
    invoiceAt: dayjs().subtract(3, 'hours').toDate()
  });
  await pay(t, {
    user,
    plan: 'team',
    invoiceAt: dayjs().subtract(2, 'hours').toDate()
  });
  const switchedAt = dayjs().subtract(1, 'hour').startOf('second');
  await pay(t, {
    user,
    plan: 'enhanced_protection',
    invoiceAt: switchedAt.toDate(),
    duration: '60d'
  });

  await Users.findByIdAndUpdate(user._id, {
    $set: { plan: 'enhanced_protection' }
  });
  const doc = await Users.findById(user._id);
  await doc.save();

  t.is(doc[config.userFields.planSetAt].getTime(), switchedAt.valueOf());
  t.is(
    doc[config.userFields.planExpiresAt].getTime(),
    switchedAt.add(2, 'months').valueOf()
  );
});

test('a start date that agrees with the payments is kept', async (t) => {
  // a switch recorded properly: the plan starts with its own payment
  const start = dayjs().subtract(10, 'days').startOf('second');
  const user = await createUser(t, 'enhanced_protection', start.toDate());
  await pay(t, {
    user,
    plan: 'team',
    invoiceAt: dayjs().subtract(40, 'days').toDate()
  });
  await pay(t, {
    user,
    plan: 'enhanced_protection',
    invoiceAt: start.toDate()
  });
  await user.save();
  t.is(user[config.userFields.planSetAt].getTime(), start.valueOf());
  t.is(
    user[config.userFields.planExpiresAt].getTime(),
    start.add(1, 'month').valueOf()
  );

  // a payment for another plan after payments for the current one (e.g. a
  // leftover renewal) does not move the start date
  const teamStart = dayjs().subtract(60, 'days').startOf('second');
  const team = await createUser(t, 'team', teamStart.toDate());
  await pay(t, { user: team, plan: 'team', invoiceAt: teamStart.toDate() });
  await pay(t, {
    user: team,
    plan: 'enhanced_protection',
    invoiceAt: dayjs().subtract(5, 'days').toDate()
  });
  await pay(t, {
    user: team,
    plan: 'team',
    invoiceAt: dayjs().subtract(1, 'day').toDate()
  });
  await team.save();
  t.is(team[config.userFields.planSetAt].getTime(), teamStart.valueOf());
  t.is(
    team[config.userFields.planExpiresAt].getTime(),
    teamStart.add(2, 'months').valueOf()
  );
});
