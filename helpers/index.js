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
const { encoder, decoder } = require('./encoder-decoder');
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
const imap = require('./imap');
const pop3 = require('./pop3');
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
const isValidPassword = require('./is-valid-password');
const pbkdf2 = require('./pbkdf2');
const createPassword = require('./create-password');
const Indexer = require('./indexer');
const getQueryResponse = require('./get-query-response');
const parsePayload = require('./parse-payload');
const getFingerprint = require('./get-fingerprint');
const zxcvbn = require('./zxcvbn');
const createMtaStsCache = require('./create-mta-sts-cache');
const encryptMessage = require('./encrypt-message');
const getKeyInfo = require('./get-key-info');
const isMessageEncrypted = require('./is-message-encrypted');
const updateStorageUsed = require('./update-storage-used');
const getAttachments = require('./get-attachments');
const syncTemporaryMailbox = require('./sync-temporary-mailbox');
const getTemporaryDatabase = require('./get-temporary-database');
const isLockingError = require('./is-locking-error');
const closeDatabase = require('./close-database');
const isRedisError = require('./is-redis-error');
const isMongoError = require('./is-mongo-error');
const syncUbuntuUser = require('./sync-ubuntu-user');
const getUbuntuMembersMap = require('./get-ubuntu-members-map');
const sendApn = require('./send-apn');
const getApnCerts = require('./get-apn-certs');
const WKD = require('./wkd');
const asctime = require('./asctime');
const onConnect = require('./on-connect');
const onClose = require('./on-close');
const onMailFrom = require('./on-mail-from');
const onData = require('./on-data');
const onRcptTo = require('./on-rcpt-to');
const onDataSMTP = require('./on-data-smtp');
const onDataMX = require('./on-data-mx');
const parseHostFromDomainOrAddress = require('./parse-host-from-domain-or-address');
const isAllowlisted = require('./is-allowlisted');
const isGreylisted = require('./is-greylisted');
const getGreylistKey = require('./get-greylist-key');
const getHeaders = require('./get-headers');
const getFromAddress = require('./get-from-address');
const updateSession = require('./update-session');
const getAttributes = require('./get-attributes');
const isSilentBanned = require('./is-silent-banned');
const isBackscatterer = require('./is-backscatterer');
const DenylistError = require('./denylist-error');
const isDenylisted = require('./is-denylisted');
const hasFingerprintExpired = require('./has-fingerprint-expired');
const isArbitrary = require('./is-arbitrary');
const updateHeaders = require('./update-headers');
const getRecipients = require('./get-recipients');
const isAuthenticatedMessage = require('./is-authenticated-message');
const getForwardingAddresses = require('./get-forwarding-addresses');
const MessageSplitter = require('./message-splitter');
const setPaginationHeaders = require('./set-pagination-headers');
const sendPaginationCheck = require('./send-pagination-check');
const populateDomainStorage = require('./populate-domain-storage');
const parseAddresses = require('./parse-addresses');
const isEmail = require('./is-email');
const getReceivedHeader = require('./get-received-header');
const getRcptToWithoutBcc = require('./get-rcpt-to-without-bcc');

const REGEX_LOCALHOST = require('./regex-localhost');

module.exports = {
  decrypt,
  email,
  encrypt,
  encoder,
  decoder,
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
  imap,
  pop3,
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
  migrateSchema,
  isValidPassword,
  pbkdf2,
  createPassword,
  Indexer,
  getQueryResponse,
  parsePayload,
  getFingerprint,
  zxcvbn,
  createMtaStsCache,
  encryptMessage,
  getKeyInfo,
  isMessageEncrypted,
  updateStorageUsed,
  getAttachments,
  syncTemporaryMailbox,
  getTemporaryDatabase,
  isLockingError,
  closeDatabase,
  isRedisError,
  isMongoError,
  syncUbuntuUser,
  getUbuntuMembersMap,
  sendApn,
  getApnCerts,
  WKD,
  asctime,
  onConnect,
  onClose,
  onMailFrom,
  onData,
  onRcptTo,
  parseHostFromDomainOrAddress,
  isAllowlisted,
  isGreylisted,
  getGreylistKey,
  onDataSMTP,
  onDataMX,
  getHeaders,
  getFromAddress,
  updateSession,
  getAttributes,
  isSilentBanned,
  isBackscatterer,
  DenylistError,
  isDenylisted,
  hasFingerprintExpired,
  isArbitrary,
  updateHeaders,
  getRecipients,
  isAuthenticatedMessage,
  getForwardingAddresses,
  MessageSplitter,
  setPaginationHeaders,
  sendPaginationCheck,
  populateDomainStorage,
  parseAddresses,
  REGEX_LOCALHOST,
  isEmail,
  getReceivedHeader,
  getRcptToWithoutBcc
};
