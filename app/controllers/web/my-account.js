const path = require('path');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const Meta = require('koa-meta');
const RE2 = require('re2');
const Stripe = require('stripe');
const _ = require('lodash');
const countryList = require('country-list');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const pug = require('pug');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const webResourceInliner = require('web-resource-inliner');
const wkhtmltopdf = require('wkhtmltopdf');
const { boolean } = require('boolean');
const { isEmail, isIP, isPort } = require('validator');
const { parse } = require('node-html-parser');

const inline = pify(webResourceInliner.html);

const env = require('../../../config/env');
const config = require('../../../config');
const emailHelper = require('../../../helpers/email');
const { paypalAgent } = require('../../../helpers/paypal');
const logger = require('../../../helpers/logger');
const toObject = require('../../../helpers/to-object');
const { Users, Domains, Aliases, Payments } = require('../../models');

const {
  cancelEmailChange,
  createDomainBilling,
  listAliases,
  listBilling,
  verifyRecords,
  removeDomain,
  createDomain,
  remove,
  listDomains,
  manageBilling,
  retrieveDomain,
  resendEmailChange,
  retrieveDomains,
  resetAPIToken,
  retrieveBilling,
  retrieveDomainBilling,
  retrieveProfile,
  updateProfile
} = require('./my-account/index');

const meta = new Meta(config.meta, logger);

// country list with USA at the top
const USA = 'United States of America';
const countries = countryList.getNames().sort();
countries.splice(countries.indexOf(USA), 1);
countries.unshift(USA);

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

module.exports = {
  cancelEmailChange,
  cancelSubscription,
  createAlias,
  createAliasForm,
  createDomain,
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
  verifyRecords
};
