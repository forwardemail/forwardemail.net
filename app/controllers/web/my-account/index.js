const createDomainBilling = require('./create-domain-billing');
const listBilling = require('./list-billing');
const listDomains = require('./list-domains');
const manageBilling = require('./manage-billing');
const retrieveBilling = require('./retrieve-billing');
const retrieveDomainBilling = require('./retrieve-domain-billing');
const updateProfile = require('./update-profile');

module.exports = {
  createDomainBilling,
  listBilling,
  listDomains,
  manageBilling,
  retrieveBilling,
  retrieveDomainBilling,
  updateProfile,
};
