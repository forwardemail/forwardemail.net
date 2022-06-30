const email = require('./email');
const getEmailLocals = require('./get-email-locals');
const i18n = require('./i18n');
const logger = require('./logger');
const markdown = require('./markdown');
const parseLoginSuccessRedirect = require('./parse-login-success-redirect');
const policies = require('./policies');
const rateLimit = require('./rate-limit');
const sendVerificationEmail = require('./send-verification-email');
const toObject = require('./to-object');
const { encrypt, decrypt } = require('./encrypt-decrypt');
const { paypalAgent, paypal } = require('./paypal');

module.exports = {
  email,
  getEmailLocals,
  i18n,
  logger,
  markdown,
  parseLoginSuccessRedirect,
  policies,
  rateLimit,
  sendVerificationEmail,
  toObject,
  encrypt,
  decrypt,
  paypalAgent,
  paypal
};
