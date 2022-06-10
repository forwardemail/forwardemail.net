const cancelEmailChange = require('./cancel-email-change');
const cancelSubscription = require('./cancel-subscription');
const createAlias = require('./create-alias');
const createAliasForm = require('./create-alias-form');
const createDomain = require('./create-domain');
const createDomainForm = require('./create-domain-form');
const createDomainBilling = require('./create-domain-billing');
const createInvite = require('./create-invite');
const ensureAliasAdmin = require('./ensure-alias-admin');
const ensureDomainAdmin = require('./ensure-domain-admin');
const ensureNotBanned = require('./ensure-not-banned');
const ensureTeamPlan = require('./ensure-team-plan');
const ensureUpgradedPlan = require('./ensure-upgraded-plan');
const importAliases = require('./import-aliases');
const listAliases = require('./list-aliases');
const listBilling = require('./list-billing');
const listDomains = require('./list-domains');
const manageBilling = require('./manage-billing');
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
const updateAlias = require('./update-alias');
const updateDomain = require('./update-domain');
const updateMember = require('./update-member');
const updateProfile = require('./update-profile');
const validateAlias = require('./validate-alias');
const validateDomain = require('./validate-domain');
const verifyRecords = require('./verify-records');

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
  ensureUpgradedPlan,
  importAliases,
  listAliases,
  listBilling,
  listDomains,
  manageBilling,
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
  updateAlias,
  updateDomain,
  updateMember,
  updateProfile,
  validateAlias,
  validateDomain,
  verifyRecords
};
