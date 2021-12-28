const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const passport = require('#helpers/passport');

module.exports = {
  ...sharedConfig('API'),
  routes: routes.api,
  logger,
  i18n,
  passport
};
