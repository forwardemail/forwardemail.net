/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const Cabin = require('cabin');
const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');

const config = require('.');

const createTangerine = require('#helpers/create-tangerine');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

const sharedCardDAVConfig = sharedConfig('CARDDAV');

// setup our Cabin instance
const cabin = new Cabin({ logger });

const rateLimit = {
  ...sharedCardDAVConfig.rateLimit,
  ...config.rateLimit
};

module.exports = {
  ...sharedCardDAVConfig,
  ...config,
  bodyParser: {
    // <https://github.com/koajs/bodyparser/issues/45>
    extendTypes: {
      text: ['application/xml']
    },
    enableTypes: ['text']
  },
  auth: false,
  rateLimit,
  routes: routes.carddav,
  logger: cabin,
  i18n,
  hookBeforeSetup(app) {
    app.context.resolver = createTangerine(
      app.context.client,
      app.context.logger
    );
  }
  // TODO: do we need this (?)
  // Timeout configuration
  // timeout: {
  //   socket: env.CARDDAV_TIMEOUT_SOCKET || 30000,
  //   idle: env.CARDDAV_TIMEOUT_IDLE || 30000
  // }
};
