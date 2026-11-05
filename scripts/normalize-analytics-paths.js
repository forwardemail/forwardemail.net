/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// One-time cleanup: analytics now store route patterns
// (/my-account/domains/:domain_id/aliases) instead of request paths, which
// can carry domain names, alias names, IDs and tokens. This replaces the
// paths stored before in the analytics events, the hourly totals and the
// landing page saved on accounts (see helpers/normalize-analytics-paths.js).
// Running it again changes nothing.
//
// Usage:
//   node scripts/normalize-analytics-paths.js
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const normalizeAnalyticsPaths = require('#helpers/normalize-analytics-paths');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  try {
    await setupMongoose(logger);

    // (the routes can only be loaded once the connections exist)
    const routes = require('../routes');
    const results = await normalizeAnalyticsPaths({
      web: routes.web,
      api: routes.api
    });
    logger.info('normalized analytics paths', { results });
  } catch (err) {
    await logger.error(err);
    process.exit(1);
  }

  process.exit(0);
})();
