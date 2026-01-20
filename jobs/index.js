/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const process = require('node:process');

const { boolean } = require('boolean');

// const config = require('#config');

let jobs = [
  // 'migration',
  'vanity-domains',
  // NOTE: we had to combine paypal sync jobs together because of API 429 rate limiting
  {
    name: 'paypal',
    interval: '1h',
    timeout: '1h',
    path: path.join(__dirname, 'paypal', 'index.js')
  },
  {
    name: 'paypal-dup-tx-id',
    interval: '30m',
    timeout: '30m',
    path: path.join(__dirname, 'paypal', 'dup-tx-id.js')
  },
  {
    name: 'paypal-automated-capture-retry',
    interval: '5m',
    timeout: 0
  },
  {
    name: 'check-paypal-abuse',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'check-suspicious-domain-signups',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'check-denylisted-users',
    interval: '24h',
    timeout: 0
  },
  {
    name: 'stripe',
    interval: '1.5h',
    timeout: '1.5h',
    path: path.join(__dirname, 'stripe', 'index.js')
  },
  //
  // we delete accounts after 30+ days of being unverified
  // (see "cleanup-database.js" job)
  // and we will send them a verification email reminder every 14 days
  // (so roughly 2x over the course of 30 days, + initial = 3)
  //
  {
    name: 'send-verification-reminder',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'billing',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'banned-user-abuse',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'check-domains',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'check-smtp',
    interval: '1h',
    timeout: 0
  },
  // this job runs every 5m to check for emails
  // that have a date that differs from created_at by more than 1m
  // and it alerts the user of this once a month as a safeguard
  // (e.g. in case they have local clock set wrong or not using ntp)
  // (e.g. someone using a printer/scanner to send an email)
  {
    name: 'check-scheduled-send',
    interval: '5m',
    timeout: 0
  },
  {
    name: 'check-bad-domains',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'welcome-email',
    interval: '1m',
    timeout: 0
  },
  // {
  //   name: 'launch-email',
  //   date: config.launchDate
  // },
  {
    name: 'account-updates',
    interval: '1m',
    timeout: 0
  },
  {
    name: 'domain-updates',
    interval: '1m',
    timeout: 0
  },
  {
    name: 'cleanup-database',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'cleanup-denylist',
    interval: '30m',
    timeout: 0
  },
  {
    name: 'check-unknown-payment-methods',
    interval: '1d',
    timeout: 0
  },
  {
    name: 'recipient-verification-email',
    interval: '15s',
    timeout: 0
  },
  {
    name: 'check-disposable',
    interval: '1d',
    timeout: 0
  },
  {
    name: 'payment-email',
    interval: '1m',
    timeout: 0
  },
  {
    name: 'fix-non-free-users',
    interval: '1m',
    timeout: 0
  },
  // <https://support.stripe.com/questions/2020-visa-trial-subscription-requirement-changes-guide>
  {
    name: 'visa-trial-subscription-requirement',
    interval: '1h',
    timeout: 0
  },
  // Send renewal reminders 7 days before subscription renewal for annual/6-month plans
  {
    name: 'subscription-renewal-reminder',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'update-uceprotect',
    interval: '1h',
    timeout: '5m'
  },
  {
    name: 'update-umbrella',
    interval: '1d',
    timeout: '5m'
  },
  {
    name: 'upgrade-reminder-email',
    interval: '6h',
    timeout: '10m'
  },
  {
    name: 'delete-logs',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'delete-emails',
    interval: '1h',
    timeout: '1h'
  },
  {
    name: 'parse-logs',
    interval: '5m',
    timeout: 0
  },
  //
  // once a month we send a reminder to users
  // if any domain requires paid plan upgrade (e.g. isDisposable)
  // then send individual email regarding this domain name
  // (stating that they have until March 31st to configure it for no extra cost)
  // otherwise send the same email but without the configuration
  //
  {
    name: 'domain-restrictions-reminder',
    interval: '5m',
    timeout: 0
  },
  {
    name: 'unlock-emails',
    interval: '1m',
    timeout: 0
  },
  // crawl the sitemap and open graph images
  {
    name: 'crawl-sitemap',
    interval: '12h',
    timeout: '2h'
  },
  // check for frozen outbound smtp queue
  {
    name: 'check-smtp-frozen-queue',
    interval: '15s',
    timeout: 0
  },
  // check for smtp queue count (50% threshold)
  {
    name: 'check-smtp-queue-count',
    interval: '5m',
    timeout: 0
  },
  //
  // for paid accounts we allowlist every 15m
  // but if any were on denylist we alert
  // admins too as well so they can intervene
  //
  {
    name: 'sync-paid-alias-allowlist',
    interval: '15m',
    timeout: 0
  },
  //
  // parses logs and emails for bounce detection
  // (so admins can manually curate which lists to request remove from)
  // (and this opens up the door for automated blocklist removal emails)
  //
  {
    name: 'bounce-report',
    interval: '4h',
    timeout: 0
  },
  //
  // hourly digest of blocklist bounces with truthSource set
  // emails security team with distinct errors, IP removal links, and log links
  //
  {
    name: 'blocklist-digest',
    interval: '1h',
    timeout: 0
  },
  // feature reminder for users not taking advantage of IMAP/SMTP
  {
    name: 'feature-reminder',
    interval: '3h',
    timeout: 0
  },
  // daily log alert email with activity report
  {
    name: 'daily-log-alert',
    interval: '1d',
    timeout: 0
  },
  // weekly DMARC report email with authentication stats
  // runs hourly but uses Redis to ensure only sent once per week per user
  {
    name: 'weekly-dmarc-report',
    interval: '1h',
    timeout: 0
  },
  // past due relief (users that are more than 6 months past due are relieved)
  {
    name: 'past-due-relief',
    interval: '1h',
    timeout: 0
  },
  // aggregate alias_count and domain_count each day
  {
    name: 'update-alias-and-domain-counts',
    interval: '1d',
    timeout: 0
  },
  // session management
  {
    name: 'session-management',
    interval: '1h',
    timeout: 0
  },
  // check alias abuse
  {
    name: 'check-alias-recipient-abuse',
    interval: '1d',
    timeout: 0
  },
  // check for suspicious email patterns similar to banned accounts
  {
    name: 'check-suspicious-emails',
    interval: '6h',
    timeout: 0
  },
  // cleanup expired Redis sessions
  {
    name: 'cleanup-expired-sessions',
    interval: '1h',
    timeout: 0
  },
  // monitor Redis keys without TTL
  {
    name: 'monitor-redis-ttl',
    interval: '6h',
    timeout: 0
  }
];

if (process.env.NODE_ENV === 'production') {
  jobs.push(
    // {
    //   name: 'translate-phrases',
    //   interval: '1h',
    //   timeout: 0
    // },
    // {
    //   name: 'translate-markdown',
    //   interval: '30m',
    //   timeout: 0
    // },
    {
      name: 'ubuntu-sync-memberships',
      interval: '5m',
      timeout: 0
    }
  );
}

if (boolean(process.env.AUTH_OTP_ENABLED))
  jobs.push({
    name: 'two-factor-reminder',
    interval: '3h',
    timeout: 0
  });

if (boolean(process.env.CACHE_RESPONSES))
  jobs.push({
    name: 'check-cache-mime-types',
    interval: '1h',
    timeout: 0
  });

if (boolean(process.env.SELF_HOSTED)) {
  jobs = [
    {
      name: 'bounce-report',
      interval: '4h',
      timeout: '1h'
    },
    {
      name: 'check-domains',
      interval: '1h',
      timeout: '1h'
    },
    {
      name: 'check-scheduled-send',
      interval: '5m',
      timeout: '5m'
    },
    {
      name: 'check-smtp',
      interval: '1h',
      timeout: '5m'
    },
    {
      name: 'check-smtp-frozen-queue',
      interval: '5m',
      timeout: '30m'
    },
    {
      name: 'check-smtp-queue-count',
      interval: '10m',
      timeout: '10m'
    },
    {
      name: 'parse-logs',
      interval: '5m',
      timeout: '10m'
    },
    {
      name: 'update-uceprotect',
      interval: '1h',
      timeout: '15m'
    },
    {
      name: 'update-umbrella',
      interval: '1d',
      timeout: '10m'
    }
  ];
}

module.exports = jobs;
