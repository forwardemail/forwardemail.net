const email = require('./email');
const getEmailLocals = require('./get-email-locals');
const i18n = require('./i18n');
const isErrorConstructorName = require('./is-error-constructor-name');
const logger = require('./logger');
const markdown = require('./markdown');
const parseLoginSuccessRedirect = require('./parse-login-success-redirect');
const policies = require('./policies');
const rateLimit = require('./rate-limit');
const refund = require('./refund');
const sendVerificationEmail = require('./send-verification-email');
const setupMongoose = require('./setup-mongoose');
const syncPayPalOrderPaymentByPaymentId = require('./sync-paypal-order-payment-by-payment-id');
const syncPayPalSubscriptionPaymentsByUser = require('./sync-paypal-subscription-payments-by-user');
const syncStripePaymentIntent = require('./sync-stripe-payment-intent');
const toObject = require('./to-object');
const { encrypt, decrypt } = require('./encrypt-decrypt');
const { paypalAgent, paypal } = require('./paypal');

module.exports = {
  decrypt,
  email,
  encrypt,
  getEmailLocals,
  i18n,
  isErrorConstructorName,
  logger,
  markdown,
  parseLoginSuccessRedirect,
  paypal,
  paypalAgent,
  policies,
  rateLimit,
  refund,
  sendVerificationEmail,
  setupMongoose,
  syncPayPalOrderPaymentByPaymentId,
  syncPayPalSubscriptionPaymentsByUser,
  syncStripePaymentIntent,
  toObject
};
