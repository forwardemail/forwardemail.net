const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');
const config = require('.');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

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
  i18n
};
