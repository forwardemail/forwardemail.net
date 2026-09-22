/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const undici = require('undici');
const test = require('ava');

const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');

test.serial(
  'preserves a caller-owned dispatcher through a retry',
  async (t) => {
    const dispatcher = new undici.Agent();
    const { request } = undici;
    const { error } = logger;
    const { warn } = logger;
    const dispatchers = [];
    const errors = [];
    const warnings = [];
    const timeouts = [];
    const clearedTimeouts = new Set();
    const { setTimeout } = global;
    const { clearTimeout } = global;

    undici.request = async (_url, options) => {
      dispatchers.push(options.dispatcher);
      if (dispatchers.length === 1) {
        const err = new Error('transient socket failure');
        err.code = 'UND_ERR_SOCKET';
        throw err;
      }

      t.is(timeouts.length, 2);
      t.true(clearedTimeouts.has(timeouts[0]));
      return {
        statusCode: 200,
        body: { text: async () => '' }
      };
    };

    global.setTimeout = (fn, ms, ...args) => {
      const handle = setTimeout(fn, ms, ...args);
      if (ms === 1000) timeouts.push(handle);
      return handle;
    };

    global.clearTimeout = (handle) => {
      clearedTimeouts.add(handle);
      return clearTimeout(handle);
    };

    logger.error = (...args) => errors.push(args);
    logger.warn = (...args) => warnings.push(args);

    try {
      const response = await retryRequest('https://example.com/', {
        dispatcher,
        retries: 2,
        timeout: 1000
      });
      t.is(response.statusCode, 200);
      t.deepEqual(dispatchers, [dispatcher, dispatcher]);
      t.is(errors.length, 0);
      t.is(warnings.length, 1);
    } finally {
      undici.request = request;
      global.setTimeout = setTimeout;
      global.clearTimeout = clearTimeout;
      logger.error = error;
      logger.warn = warn;
      dispatcher.destroy();
    }
  }
);
