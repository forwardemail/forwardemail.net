const cancelEmailChange = require('./cancel-email-change');
const createDomainBilling = require('./create-domain-billing');
const listAliases = require('./list-aliases');
const listBilling = require('./list-billing');
const listDomains = require('./list-domains');
const manageBilling = require('./manage-billing');
const resendEmailChange = require('./resend-email-change');
const resetAPIToken = require('./reset-api-token');
const retrieveBilling = require('./retrieve-billing');
const retrieveDomainBilling = require('./retrieve-domain-billing');
const retrieveDomains = require('./retrieve-domains');
const retrieveProfile = require('./retrieve-profile');
const updateProfile = require('./update-profile');
const retrieveDomain = require('./retrieve-domain');
const createDomain = require('./create-domain');
const remove = require('./remove');
const removeDomain = require('./remove-domain');
const verifyRecords = require('./verifyRecords');
const ensureDomainAdmin = require('./ensure-domain-admin');

module.exports = {
  cancelEmailChange,
  ensureDomainAdmin,
  verifyRecords,
  removeDomain,
  remove,
  createDomain,
  retrieveDomain,
  createDomainBilling,
  listAliases,
  listBilling,
  listDomains,
  manageBilling,
  resendEmailChange,
  resetAPIToken,
  retrieveBilling,
  retrieveDomainBilling,
  retrieveDomains,
  retrieveProfile,
  updateProfile
};
