/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Analytics events are written to the logs database on every request.
// When that database is slow or unreachable the writes must be dropped,
// not queued in memory one per request until the process aborts.
//

const mongoose = require('mongoose');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const AnalyticsEvents = require('#models/analytics-events');
const logger = require('#helpers/logger');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

function trackApiCall(pathname) {
  logger.info('analytics:event', {
    ignore_hook: false,
    analytics: {
      event_type: 'api_call',
      service: 'api',
      session_hash: 'test',
      pathname,
      success: false,
      error_code: '429'
    }
  });
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

test.serial(
  'analytics writes are capped while the logs database stalls',
  async (t) => {
    // the logs database accepts writes but never answers them
    let calls = 0;
    let release;
    const stalled = new Promise((resolve) => {
      release = resolve;
    });
    const { create } = AnalyticsEvents;
    AnalyticsEvents.create = function () {
      calls++;
      return stalled;
    };

    try {
      for (let i = 0; i < 500; i++) trackApiCall('/v1/messages');
      await wait(500);
      t.true(calls > 0);
      t.true(calls <= 10, `${calls} analytics writes were queued`);
    } finally {
      release();
      AnalyticsEvents.create = create;
    }

    // once the stalled writes finish, events are saved again
    await wait(100);
    trackApiCall('/v1/after-stall');
    await pWaitFor(
      async () =>
        Boolean(await AnalyticsEvents.exists({ pathname: '/v1/after-stall' })),
      { timeout: 5000 }
    );
    t.pass();
  }
);

test.serial(
  'analytics writes are dropped while the logs database is disconnected',
  async (t) => {
    const conn = AnalyticsEvents.db;
    let calls = 0;
    const { create } = AnalyticsEvents;
    AnalyticsEvents.create = function (...args) {
      calls++;
      return create.apply(this, args);
    };

    Object.defineProperty(conn, 'readyState', {
      configurable: true,
      get: () => mongoose.ConnectionStates.disconnected,
      // (mongoose sets it when the server description changes)
      set() {}
    });

    try {
      for (let i = 0; i < 100; i++) trackApiCall('/v1/while-disconnected');
      await wait(500);
      t.is(calls, 0);
    } finally {
      delete conn.readyState;
      AnalyticsEvents.create = create;
    }

    t.is(conn.readyState, mongoose.ConnectionStates.connected);
    t.false(
      Boolean(
        await AnalyticsEvents.exists({ pathname: '/v1/while-disconnected' })
      )
    );
  }
);
