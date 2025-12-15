/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const aliasAuth = require('./alias-auth');
const aliases = require('./aliases');
const apple = require('./apple');
const calendarEvents = require('./calendar-events');
const calendars = require('./calendars');
const contacts = require('./contacts');
const domains = require('./domains');
const emails = require('./emails');
const enforcePaidPlan = require('./enforce-paid-plan');
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
const upgrade = require('./upgrade');
const users = require('./users');

module.exports = {
  aliasAuth,
  aliases,
  apple,
  calendarEvents,
  calendars,
  contacts,
  domains,
  emails,
  enforcePaidPlan,
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
  upgrade,
  users
};
