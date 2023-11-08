/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
// TODO: create an npm package for this and then add it in smtp code too
const combineErrors = require('./combine-errors');
const ThresholdError = require('./threshold-error');
const getAllPayPalSubscriptionTransactions = require('./get-all-paypal-subscription-transactions');
const createTangerine = require('./create-tangerine');
const processEmail = require('./process-email');
const sendEmail = require('./send-email');
const getErrorCode = require('./get-error-code');
const isCodeBug = require('./is-code-bug');
const createSession = require('./create-session');
const splitSpaces = require('./split-spaces');
const getMongoQuery = require('./get-mongo-query');
const parseRootDomain = require('./parse-root-domain');
const checkSRS = require('./check-srs');
const createBounce = require('./create-bounce');
const getDiagnosticCode = require('./get-diagnostic-code');
const getBlockedHashes = require('./get-blocked-hashes');
const getTransporter = require('./get-transporter');
const isTLSError = require('./is-tls-error');
const isSSLError = require('./is-ssl-error');
const shouldThrow = require('./should-throw');
const isRetryableError = require('./is-retryable-error');
const isTimeoutError = require('./is-timeout-error');
const isSocketError = require('./is-socket-error');
const SMTPError = require('./smtp-error');
const RetryClient = require('./retry-client');
const retryRequest = require('./retry-request');
const getBounceInfo = require('./get-bounce-info');
const getLogsCsv = require('./get-logs-csv');
const smtp = require('./smtp');
const imap = require('./imap');
const ServerShutdownError = require('./server-shutdown-error');
const refineAndLogError = require('./refine-and-log-error');
const validateAlias = require('./validate-alias');
const validateDomain = require('./validate-domain');
const IMAPError = require('./imap-error');
const SocketError = require('./socket-error');
const IMAPNotifier = require('./imap-notifier');
const refreshSession = require('./refresh-session');
const getDatabase = require('./get-database');
const mongooseToSqlite = require('./mongoose-to-sqlite');
const AttachmentStorage = require('./attachment-storage');
const createWebSocketAsPromised = require('./create-websocket-as-promised');
const parseError = require('./parse-error');
const getPathToDatabase = require('./get-path-to-database');
const monitorServer = require('./monitor-server');
const storeNodeBodies = require('./store-node-bodies');
const setupPragma = require('./setup-pragma');
const recursivelyParse = require('./recursively-parse');
const migrateSchema = require('./migrate-schema');

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
  toObject,
  combineErrors,
  ThresholdError,
  getAllPayPalSubscriptionTransactions,
  createTangerine,
  processEmail,
  sendEmail,
  getErrorCode,
  isCodeBug,
  createSession,
  splitSpaces,
  getMongoQuery,
  parseRootDomain,
  checkSRS,
  createBounce,
  getDiagnosticCode,
  getBlockedHashes,
  getTransporter,
  isSSLError,
  isTLSError,
  shouldThrow,
  isRetryableError,
  isTimeoutError,
  isSocketError,
  SMTPError,
  RetryClient,
  retryRequest,
  getBounceInfo,
  getLogsCsv,
  smtp,
  imap,
  ServerShutdownError,
  refineAndLogError,
  validateAlias,
  validateDomain,
  IMAPError,
  SocketError,
  IMAPNotifier,
  refreshSession,
  getDatabase,
  mongooseToSqlite,
  AttachmentStorage,
  createWebSocketAsPromised,
  parseError,
  getPathToDatabase,
  monitorServer,
  storeNodeBodies,
  setupPragma,
  recursivelyParse,
  migrateSchema
};
