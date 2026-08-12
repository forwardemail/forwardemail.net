/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const utils = require('../utils');

const env = require('#config/env');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.afterEach.always(utils.teardownApiServer);

test.serial(
  'rejects a one-character credential when API_SECRETS is one undelimited secret',
  async (t) => {
    const original = env.API_SECRETS;
    t.teardown(() => {
      env.API_SECRETS = original;
    });

    env.API_SECRETS = 'self-hosted-api-secret';

    const rejected = await t.context.api
      .get('/v1/lookup')
      .auth('s')
      .query({ verification_record: 'test-record' });
    t.is(rejected.status, 401);

    const accepted = await t.context.api
      .get('/v1/lookup')
      .auth('self-hosted-api-secret')
      .query({ verification_record: 'test-record' });
    t.not(accepted.status, 401);
  }
);
