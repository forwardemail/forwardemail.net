const config = {
  files: ['test/**/*.js', '!test/helpers.js'],
  timeout: '2m',
  concurrency: 1,
  serial: true,
  verbose: true
};

export default config;
