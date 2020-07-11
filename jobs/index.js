const jobs = [
  'migration',
  'vanity-domains',
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

module.exports = jobs;
