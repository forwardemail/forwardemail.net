/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const signale = require('signale');

const env = require('./env');

module.exports = {
  // eslint-disable-next-line no-undef
  logger: typeof window === 'object' ? console : signale,
  level: env.NODE_ENV === 'test' ? 'debug' : 'info',
  levels:
    env.NODE_ENV === 'test'
      ? ['trace', 'info', 'debug', 'warn', 'error', 'fatal']
      : ['info', 'warn', 'error', 'fatal'],
  showStack: env.AXE_SHOW_STACK,
  meta: {
    show: env.AXE_SHOW_META
  },
  silent: env.AXE_SILENT,
  name: env.APP_NAME
};
