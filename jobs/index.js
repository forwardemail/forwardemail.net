const process = require('process');

// const dayjs = require('dayjs-with-plugins');
const { boolean } = require('boolean');

// const config = require('#config');

const jobs = [
  'migration',
  'vanity-domains',
  {
    name: 'sync-payment-histories/index',
    interval: '24h',
    timeout: 0
  },
  // {
  //   name: 'billing',
  //   date: dayjs().startOf('day').add(10, 'hour').toDate(),
  //   interval: '1d'
  // },
  {
    name: 'check-domains',
    timeout: '1m', // give migration script time to run
    interval: '1m'
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
    name: 'domain-missing-txt',
    interval: '1h',
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
