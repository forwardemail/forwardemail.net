/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const analytics = require('./analytics');
const users = require('./users');
const domains = require('./domains');
const dashboard = require('./dashboard');
const logs = require('./logs');
const allowlist = require('./allowlist');
const denylist = require('./denylist');
const emails = require('./emails');
const inquiries = require('./inquiries');
const payments = require('./payments');
const jobs = require('./jobs');
const spam = require('./spam');

module.exports = {
  analytics,
  dashboard,
  users,
  domains,
  logs,
  allowlist,
  denylist,
  emails,
  inquiries,
  payments,
  jobs,
  spam
};
