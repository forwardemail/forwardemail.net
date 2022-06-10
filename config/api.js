const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');
const config = require('.');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');

module.exports = {
  ...sharedConfig('API'),
  ...config,
  routes: routes.api,
  logger,
  i18n
};
