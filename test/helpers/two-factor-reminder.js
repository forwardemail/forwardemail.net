/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Who jobs/two-factor-reminder.js reminds to turn on two-factor
// authentication (helpers/two-factor-reminder.js): a passkey counts as a
// second factor as much as a one-time password does.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const Users = require('#models/users');
const config = require('#config');
const {
  getUserIdsToRemind,
  shouldRemind
} = require('#helpers/two-factor-reminder');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// a verified member of a domain on a paid plan
async function createUser(t, state = {}) {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true,
      ...state
    })
    .create();
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();
  await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      ignore_mx_check: true
    })
    .create();
  return user;
}

function addPasskey(user) {
  return Users.findByIdAndUpdate(
    user._id,
    {
      $push: {
        passkeys: {
          nickname: 'Phone',
          credentialId: 'credential-id',
          publicKey: 'public-key',
          counter: 0
        }
      }
    },
    { new: true }
  )
    .lean()
    .exec();
}

test('a user with a passkey is not reminded to turn on two-factor authentication', async (t) => {
  const withoutSecondFactor = await createUser(t);
  const withPasskey = await addPasskey(await createUser(t));
  const withOtp = await createUser(t);
  await Users.findByIdAndUpdate(withOtp._id, {
    $set: { [config.passport.fields.otpEnabled]: true }
  });

  const userIds = await getUserIdsToRemind();
  const ids = new Set(userIds.map(String));
  t.true(ids.has(withoutSecondFactor.id));
  t.false(ids.has(withPasskey._id.toString()));
  t.false(ids.has(withOtp.id));

  // (and a passkey added after the users were listed is checked again)
  const user = await Users.findById(withoutSecondFactor._id).lean().exec();
  t.true(shouldRemind(user));
  t.false(shouldRemind(await addPasskey(withoutSecondFactor)));
});
