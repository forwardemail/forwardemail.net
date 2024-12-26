/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Cabin = require('cabin');

const logger = require('../../helpers/logger');

// setup our Cabin instance
const cabin = new Cabin({ logger });

// set the user if we're logged in
if (typeof window === 'object' && typeof window.USER === 'object')
  cabin.setUser(window.USER);

// if (process.env.NODE_ENV !== 'test')

// expose it to the global window object
window.console = logger;

module.exports = logger;
