/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const AnalyticsEvents = require('./analytics-events');
const AnalyticsSummary = require('./analytics-summary');
const Attachments = require('./attachments');
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
const TemporaryMessages = require('./temporary-messages');
const SearchResults = require('./search-results');
const Calendars = require('./calendars');
const CalendarEvents = require('./calendar-events');
const CalendarInvites = require('./calendar-invites');
const AddressBooks = require('./address-books');
const Contacts = require('./contacts');
const TTI = require('./tti');
const SieveScripts = require('./sieve-scripts');

module.exports = {
  AnalyticsEvents,
  AnalyticsSummary,
  Attachments,
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
  Journals,
  TemporaryMessages,
  SearchResults,
  Calendars,
  CalendarEvents,
  CalendarInvites,
  AddressBooks,
  Contacts,
  TTI,
  SieveScripts
};
