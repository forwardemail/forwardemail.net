const getEmailLocals = require('./get-email-locals');
const i18n = require('./i18n');
const logger = require('./logger');
const passport = require('./passport');
const policies = require('./policies');
const markdown = require('./markdown');

module.exports = {
  getEmailLocals,
  i18n,
  logger,
  passport,
  policies,
  markdown
};
