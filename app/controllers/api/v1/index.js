/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const aliases = require('./aliases');
const aliasAuth = require('./alias-auth');
const apple = require('./apple');
const calendars = require('./calendars');
const contacts = require('./contacts');
const domains = require('./domains');
const enforcePaidPlan = require('./enforce-paid-plan');
const enforceEnterprisePlan = require('./enforce-enterprise-plan');
const folders = require('./folders');
const inquiries = require('./inquiries');
const log = require('./log');
const lookup = require('./lookup');
const maxForwardedAddresses = require('./max-forwarded-addresses');
const messages = require('./messages');
const paypal = require('./paypal');
const port = require('./port');
const restricted = require('./restricted');
const selfTest = require('./self-test');
const settings = require('./settings');
const stripe = require('./stripe');
const test = require('./test');
const users = require('./users');
const upgrade = require('./upgrade');
const emails = require('./emails');

module.exports = {
  aliases,
  aliasAuth,
  apple,
  calendars,
  contacts,
  domains,
  enforcePaidPlan,
  enforceEnterprisePlan,
  folders,
  inquiries,
  log,
  lookup,
  maxForwardedAddresses,
  messages,
  paypal,
  port,
  restricted,
  selfTest,
  settings,
  stripe,
  test,
  users,
  upgrade,
  emails
};
