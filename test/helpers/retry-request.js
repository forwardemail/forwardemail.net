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

//
// With `autoSelectFamily` (the default from Node 20) the connect-time lookup
// is called with `{ all: true }` and must answer with every address, each of
// which is checked (on Node 18 this is opted into with the net default).
//
test.serial(
  'connects when the lookup is asked for all addresses',
  async (t) => {
    const http = require('node:http');
    const net = require('node:net');
    const server = http.createServer((req, res) => res.end('ok'));
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    const { port } = server.address();
    const calls = [];
    const resolver = {
      async lookup(hostname, options = {}) {
        calls.push(options);
        const address = { address: '127.0.0.1', family: 4 };
        return options.all ? [address] : address;
      }
    };

    const autoSelectFamily = net.getDefaultAutoSelectFamily();
    net.setDefaultAutoSelectFamily(true);
    try {
      const response = await retryRequest(
        `http://all-addresses.example.com:${port}/`,
        { resolver, retries: 1, timeout: 5000 }
      );
      t.is(response.statusCode, 200);
      t.is(await response.body.text(), 'ok');
      t.true(calls.some((options) => options.all === true));
    } finally {
      net.setDefaultAutoSelectFamily(autoSelectFamily);
      server.close();
    }
  }
);

test.serial(
  'a password in the URL is hidden in the errors and logs of a failed request',
  async (t) => {
    const { request } = undici;
    const { error, warn } = logger;
    const logged = [];
    undici.request = async () => {
      const err = new TypeError('fetch failed');
      err.code = 'UND_ERR_SOCKET';
      throw err;
    };

    logger.error = (...args) => logged.push(args);
    logger.warn = (...args) => logged.push(args);
    try {
      const err = await t.throwsAsync(
        retryRequest('https://hook:s3cr3t@example.com/hook', {
          retries: 0,
          timeout: 1000
        })
      );
      t.true(logged.length > 0);
      for (const text of [
        err.url,
        err.requestContext?.url,
        JSON.stringify(logged.map(([, meta]) => meta))
      ]) {
        t.false(String(text).includes('s3cr3t'), `${text}`);
      }

      t.is(err.requestContext.url, 'https://***:***@example.com/hook');
      // (also an empty user name, an @ in the password, or a token given as
      //  the user name, alone or with a password that is not one)
      for (const url of [
        'https://:s3cr3t@example.com/hook',
        'https://hook:s3c@r3t@example.com/hook',
        'https://s3cr3t@example.com/hook',
        'https://s3cr3t:x@example.com/hook'
      ]) {
        const other = await t.throwsAsync(
          retryRequest(url, { retries: 0, timeout: 1000 })
        );
        t.false(
          other.requestContext.url.includes('s3c'),
          `${other.requestContext.url}`
        );
      }
    } finally {
      undici.request = request;
      logger.error = error;
      logger.warn = warn;
    }
  }
);
