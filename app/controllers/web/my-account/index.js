const cancelEmailChange = require('./cancel-email-change');
const createDomainBilling = require('./create-domain-billing');
const listAliases = require('./list-aliases');
const listBilling = require('./list-billing');
const listDomains = require('./list-domains');
const manageBilling = require('./manage-billing');
const resendEmailChange = require('./resend-email-change');
const retrieveBilling = require('./retrieve-billing');
const retrieveDomainBilling = require('./retrieve-domain-billing');
const updateProfile = require('./update-profile');

module.exports = {
  cancelEmailChange,
  createDomainBilling,
  listAliases,
  listBilling,
  listDomains,
  manageBilling,
  resendEmailChange,
  retrieveBilling,
  retrieveDomainBilling,
  updateProfile
};
