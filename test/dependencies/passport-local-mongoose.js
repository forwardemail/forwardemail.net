/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const ms = require('ms');
const passportLocalMongoose = require('passport-local-mongoose');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

//
// passport-local-mongoose 7.1.2 (patched in
// patches/passport-local-mongoose@7.1.2.patch) saved an account it unlocked
// after `unlockInterval` without waiting, then saved it again with the outcome
// of the password check.  A save slower than the password hash (e.g. the
// Launchpad sync for Ubuntu members) failed the login with a ParallelSaveError.
//
test('an account unlocked after the lockout window logs in when saving is slow', async (t) => {
  const { attemptsField, lastLoginField, maxAttempts } =
    config.passportLocalMongoose;
  const schema = new mongoose.Schema({});
  schema.plugin(passportLocalMongoose, config.passportLocalMongoose);
  schema.pre('save', () => setTimeout(500));
  const Model = Users.db.model('PassportLocalMongooseUnlock', schema);

  const email = `${randomUUID()}@example.com`;
  const password = falso.randPassword();
  const created = await Model.register({ email }, password);
  await Model.updateOne(
    { _id: created._id },
    {
      $set: {
        [attemptsField]: maxAttempts,
        [lastLoginField]: new Date(Date.now() - ms('1d'))
      }
    }
  );

  const { user, error } = await Model.authenticate()(email, password);
  t.is(error, undefined);
  t.truthy(user);
  const saved = await Model.findById(created._id).lean().exec();
  t.is(saved[attemptsField], 0);
});
