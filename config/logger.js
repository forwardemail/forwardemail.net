// this package is ignored in `browser` config in `package.json`
// in order to make the client-side payload less kb
const signale = require('signale');

const env = require('./env');

const isProduction = env.NODE_ENV === 'production';

module.exports = {
  // eslint-disable-next-line no-undef
  logger: typeof window === 'object' ? console : signale,
  level: isProduction ? 'info' : 'debug',
  levels: isProduction
    ? ['info', 'warn', 'error', 'fatal']
    : ['trace', 'info', 'debug', 'warn', 'error', 'fatal'],
  showStack: env.AXE_SHOW_STACK,
  meta: {
    show: env.AXE_SHOW_META
  },
  silent: isProduction,
  name: env.APP_NAME
};
