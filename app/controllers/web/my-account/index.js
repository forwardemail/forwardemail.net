const retrieveDomainBilling = require('./retrieve-domain-billing');
const updateProfile = require('./update-profile');
const createDomainBilling = require('./create-domain-billing');
const retrieveBilling = require('./retrieve-billing');
const manageBilling = require('./manage-billing');

module.exports = {
  retrieveDomainBilling,
  createDomainBilling,
  updateProfile,
  retrieveBilling,
  manageBilling
};
