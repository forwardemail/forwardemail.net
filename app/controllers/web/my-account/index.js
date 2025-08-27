/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const cancelEmailChange = require('./cancel-email-change');
const cancelSubscription = require('./cancel-subscription');
const createAlias = require('./create-alias');
const createAliasForm = require('./create-alias-form');
const createDomain = require('./create-domain');
const createDomainBilling = require('./create-domain-billing');
const createDomainForm = require('./create-domain-form');
const createInvite = require('./create-invite');
const ensureAliasAdmin = require('./ensure-alias-admin');
const ensureDomainAdmin = require('./ensure-domain-admin');
const ensureNotBanned = require('./ensure-not-banned');
const ensureTeamPlan = require('./ensure-team-plan');
const ensureEnterprisePlan = require('./ensure-enterprise-plan');
const ensureUpgradedPlan = require('./ensure-upgraded-plan');
const ensurePaidToDate = require('./ensure-paid-to-date');
const importAliases = require('./import-aliases');
const listAliases = require('./list-aliases');
const listBilling = require('./list-billing');
const listDomains = require('./list-domains');
const recoveryKeys = require('./recovery-keys');
const remove = require('./remove');
const removeAlias = require('./remove-alias');
const removeDomain = require('./remove-domain');
const removeInvite = require('./remove-invite');
const removeMember = require('./remove-member');
const resendEmailChange = require('./resend-email-change');
const resetAPIToken = require('./reset-api-token');
const retrieveAlias = require('./retrieve-alias');
const retrieveAliases = require('./retrieve-aliases');
const retrieveBilling = require('./retrieve-billing');
const retrieveDomain = require('./retrieve-domain');
const retrieveDomainBilling = require('./retrieve-domain-billing');
const retrieveDomains = require('./retrieve-domains');
const retrieveInvite = require('./retrieve-invite');
const retrieveProfile = require('./retrieve-profile');
const retrieveReceipt = require('./retrieve-receipt');
const sortedDomains = require('./sorted-domains');
const resendVerification = require('./resend-verification');
const updateAlias = require('./update-alias');
const updateCard = require('./update-card');
const updateDomain = require('./update-domain');
const updateMember = require('./update-member');
const updateProfile = require('./update-profile');
const upgradeBillingRequest = require('./upgrade-billing-request');
const validateAlias = require('./validate-alias');
const validateDomain = require('./validate-domain');
const verifyRecords = require('./verify-records');
const setConversionAndRefundStateHelpers = require('./set-conversion-and-refund-state-helpers');
const listLogs = require('./list-logs');
const retrieveLog = require('./retrieve-log');
const listEmails = require('./list-emails');
const retrieveEmail = require('./retrieve-email');
const removeEmail = require('./remove-email');
const ensureSMTPAccess = require('./ensure-smtp-access');
const verifySMTP = require('./verify-smtp');
const generateAliasPassword = require('./generate-alias-password');
const downloadAliasBackup = require('./download-alias-backup');
const createCatchAllPassword = require('./create-catch-all-password');
const removeCatchAllPassword = require('./remove-catch-all-password');
const changeModulusLength = require('./change-modulus-length');
const checkVerifiedEmail = require('./check-verified-email');
const updateAllowlistAndDenylist = require('./update-allowlist-and-denylist');
const updateRestrictedAliasNames = require('./update-restricted-alias-names');
const updateTimezone = require('./update-timezone');
const resetDomainWebhookKey = require('./reset-domain-webhook-key');
const retrieveQRCode = require('./retrieve-qrcode');
const listAnalytics = require('./list-analytics');

module.exports = {
  cancelEmailChange,
  cancelSubscription,
  createAlias,
  createAliasForm,
  createDomain,
  createDomainForm,
  createDomainBilling,
  createInvite,
  ensureAliasAdmin,
  ensureDomainAdmin,
  ensureNotBanned,
  ensureTeamPlan,
  ensureEnterprisePlan,
  ensureUpgradedPlan,
  ensurePaidToDate,
  importAliases,
  listAliases,
  listBilling,
  listDomains,
  recoveryKeys,
  remove,
  removeAlias,
  removeDomain,
  removeInvite,
  removeMember,
  resendEmailChange,
  resetAPIToken,
  retrieveAlias,
  retrieveAliases,
  retrieveBilling,
  retrieveDomain,
  retrieveDomainBilling,
  retrieveDomains,
  retrieveInvite,
  retrieveProfile,
  retrieveReceipt,
  sortedDomains,
  resendVerification,
  updateAlias,
  updateCard,
  updateDomain,
  updateMember,
  updateProfile,
  upgradeBillingRequest,
  validateAlias,
  validateDomain,
  verifyRecords,
  setConversionAndRefundStateHelpers,
  listLogs,
  retrieveLog,
  listEmails,
  retrieveEmail,
  removeEmail,
  ensureSMTPAccess,
  verifySMTP,
  generateAliasPassword,
  downloadAliasBackup,
  createCatchAllPassword,
  removeCatchAllPassword,
  changeModulusLength,
  checkVerifiedEmail,
  updateAllowlistAndDenylist,
  updateTimezone,
  updateRestrictedAliasNames,
  resetDomainWebhookKey,
  retrieveQRCode,
  listAnalytics
};
