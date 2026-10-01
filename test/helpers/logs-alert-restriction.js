/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const timers = require('node:timers/promises');

const test = require('ava');

// Replace the email helper with a spy BEFORE anything pulls in the Logs model
// (which captures the helper by reference at load). A log written through
// `POST /v1/log` is `is_restricted: false`, and its `err.isCodeBug` /
// `err.output.statusCode` come straight from the request body, so without the
// restriction check any anonymous caller could page admins once per request.
const emailPath = require.resolve('#helpers/email');
const sent = [];
require(emailPath);
require.cache[emailPath].exports = async (data) => {
  sent.push(data);
};

const utils = require('../utils');
const Logs = require('#models/logs');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.after.always(() => {
  // restore the real email helper for any later consumer in this process
  delete require.cache[emailPath];
  require(emailPath);
});
test.beforeEach((t) => {
  t.context.sent = sent;
  sent.length = 0;
});

test.serial(
  'a non-restricted code-bug log does not alert admins',
  async (t) => {
    await Logs.create({
      message: 'client-supplied code bug',
      is_restricted: false,
      err: {
        name: 'Error',
        message: 'client-supplied code bug',
        isCodeBug: true
      }
    });
    // post-save alert is fire-and-forget
    await timers.setTimeout(100);
    t.is(t.context.sent.length, 0);
  }
);

test.serial('a restricted code-bug log still alerts admins', async (t) => {
  await Logs.create({
    message: 'server-side code bug',
    is_restricted: true,
    err: { name: 'Error', message: 'server-side code bug', isCodeBug: true }
  });
  await timers.setTimeout(100);
  t.is(t.context.sent.length, 1);
  t.is(t.context.sent[0].template, 'alert');
});
