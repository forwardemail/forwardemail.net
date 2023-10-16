/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const AttachmentsChunks = require('./attachments-chunks');
const AttachmentsFiles = require('./attachments-files');
const Aliases = require('./aliases');
const Domains = require('./domains');
const Inquiries = require('./inquiries');
const Logs = require('./logs');
const Payments = require('./payments');
const SelfTests = require('./self-tests');
const UpgradeReminders = require('./upgrade-reminders');
const Users = require('./users');
const Emails = require('./emails');
const Mailboxes = require('./mailboxes');
const Messages = require('./messages');
const Threads = require('./threads');
const Journals = require('./journals');

module.exports = {
  AttachmentsChunks,
  AttachmentsFiles,
  Aliases,
  Domains,
  Inquiries,
  Logs,
  Payments,
  SelfTests,
  UpgradeReminders,
  Users,
  Emails,
  Mailboxes,
  Messages,
  Threads,
  Journals
};
