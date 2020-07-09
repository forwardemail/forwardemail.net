const jobs = [
  'migration',
  'vanity-domains',
  {
    name: 'welcome-email',
    timeout: 0,
    interval: '1m'
  },
  {
    name: 'account-updates',
    timeout: 0,
    interval: '1m'
  },
  {
    name: 'remove-unverified-users',
    timeout: 0,
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

module.exports = jobs;
