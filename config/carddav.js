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
const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');

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
    // <https://github.com/koajs/bodyparser/blob/008ec3072da9cbe7eebf091ef095dd83caa1af36/src/body-parser.types.ts#L14-L18>
    parsedMethods: ['POST', 'PUT', 'PATCH', 'PROPFIND', 'PROPPATCH', 'MKCOL'],
    // <https://github.com/koajs/bodyparser/issues/45>
    extendTypes: {
      text: [
        'application/xml',
        'application/vcard',
        'text/x-vcard',
        'text/directory',
        'text/vcard'
      ]
    },
    enableTypes: ['json', 'form', 'text', 'xml']
  },
  removeTrailingSlashes: false,
  auth: false,
  rateLimit,
  routes: routes.carddav,
  logger: cabin,
  i18n,
  hookBeforeSetup(app) {
    // Koa v3 polyfill for ctx.redirect('back')
    // @see https://github.com/koajs/koa/releases/tag/v3.0.0
    app.use(koaRedirectBackPolyfill({ fallbackUrl: '/' }));

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
