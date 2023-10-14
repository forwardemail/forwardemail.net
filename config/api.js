/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');
const config = require('.');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const createTangerine = require('#helpers/create-tangerine');

const sharedAPIConfig = sharedConfig('API');

module.exports = {
  ...sharedAPIConfig,
  ...config,
  rateLimit: {
    ...sharedAPIConfig.rateLimit,
    ...config.rateLimit
  },
  routes: routes.api,
  logger,
  i18n,
  hookBeforeSetup(app) {
    app.context.resolver = createTangerine(
      app.context.client,
      app.context.logger
    );
  },
  bodyParserIgnoredPathGlobs: ['/v1/log', '/v1/emails']
};
