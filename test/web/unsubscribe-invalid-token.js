/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const unsubscribe = require('#controllers/web/unsubscribe');
const logger = require('#helpers/logger');

test.serial(
  'rejects invalid unsubscribe tokens without an error log',
  async (t) => {
    const { error } = logger;
    const { warn } = logger;
    const errors = [];
    const warnings = [];
    logger.error = (...args) => errors.push(args);
    logger.warn = (...args) => warnings.push(args);

    try {
      const err = await t.throwsAsync(
        unsubscribe({
          method: 'GET',
          params: { token: 'not-an-encrypted-token' },
          translateError(key) {
            return key;
          }
        })
      );
      t.is(err.output.statusCode, 400);
      t.is(err.output.payload.message, 'INVALID_UNSUBSCRIBE_TOKEN');
      t.is(errors.length, 0);
      t.is(warnings.length, 1);
    } finally {
      logger.error = error;
      logger.warn = warn;
    }
  }
);
