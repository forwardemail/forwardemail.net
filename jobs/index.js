const path = require('path');
const process = require('process');

const { boolean } = require('boolean');

// const config = require('#config');

const jobs = [
  // 'migration',
  'vanity-domains',
  // NOTE: we had to combine paypal sync jobs together because of API 429 rate limiting
  {
    name: 'paypal',
    interval: '1h',
    timeout: 0,
    path: path.join(__dirname, 'paypal', 'index.js')
  },
  {
    name: 'paypal-dup-tx-id',
    interval: '30m',
    timeout: 0,
    path: path.join(__dirname, 'paypal', 'dup-tx-id.js')
  },
  {
    name: 'stripe',
    interval: '1h',
    timeout: 0,
    path: path.join(__dirname, 'stripe', 'index.js')
  },
  {
    name: 'billing',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'check-domains',
    interval: '1h',
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
    name: 'cleanup-database',
    interval: '1h',
    timeout: 0
  },
  {
    name: 'check-unknown-payment-methods',
    interval: '1h',
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
  }
];

if (process.env.NODE_ENV === 'production') {
  jobs.push(
    {
      name: 'translate-phrases',
      interval: '1h',
      timeout: 0
    },
    {
      name: 'translate-markdown',
      interval: '30m',
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

module.exports = jobs;
