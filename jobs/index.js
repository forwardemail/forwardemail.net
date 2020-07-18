const { boolean } = require('boolean');

const jobs = [
  'migration',
  'vanity-domains',
  {
    name: 'check-domains',
    timeout: '1m', // give migration script time to run
    interval: '1m'
  },
  {
    name: 'welcome-email',
    interval: '1m'
  },
  {
    name: 'account-updates',
    interval: '1m'
  },
  {
    name: 'remove-unverified-users',
    interval: '1h'
  }
  // TODO: currently commented out until we have better translation solution
  // {
  //   name: 'translate-phrases',
  //   interval: '1h'
  // }
  // {
  //   name: 'translate-markdown',
  //   interval: '30m'
  // },
];

if (boolean(process.env.AUTH_OTP_ENABLED))
  jobs.push({
    name: 'two-factor-reminder',
    interval: '3 months'
  });

module.exports = jobs;
