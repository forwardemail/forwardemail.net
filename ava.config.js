const isCI = require('is-ci');

module.exports = {
  verbose: true,
  failFast: true,
  serial: true,
  files: ['test/*.js', 'test/**/*.js', 'test/**/**/*.js', '!test/utils.js'],
  workerThreads: !isCI
};
