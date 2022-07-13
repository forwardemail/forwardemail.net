const signale = require('signale');

const env = require('./env');

const isProduction = env.NODE_ENV === 'production';

module.exports = {
  logger: signale,
  level: isProduction ? 'info' : 'debug',
  levels: isProduction
    ? ['info', 'warn', 'error', 'fatal']
    : ['trace', 'info', 'debug', 'warn', 'error', 'fatal'],
  showStack: env.SHOW_STACK,
  showMeta: env.SHOW_META,
  capture: false,
  name: env.APP_NAME
};
