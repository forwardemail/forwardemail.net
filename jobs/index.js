const path = require('path');
const process = require('process');

// const dayjs = require('dayjs-with-plugins');
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
    name: 'stripe',
    interval: '1h',
    timeout: 0,
    path: path.join(__dirname, 'stripe', 'index.js')
  },
  // {
  //   name: 'billing',
  //   date: dayjs().startOf('day').add(10, 'hour').toDate(),
  //   interval: '1d'
  // },
  {
    name: 'check-domains',
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
  }
  // {
  //   name: 'domain-missing-txt',
  //   interval: '24h',
  //   timeout: 0
  // }
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
