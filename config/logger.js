const signale = require('signale');
const pino = require('pino')({
  customLevels: {
    log: 30
  },
  hooks: {
    // <https://github.com/pinojs/pino/blob/master/docs/api.md#logmethod>
    logMethod(inputArgs, method) {
      return method.call(this, {
        // <https://github.com/pinojs/pino/issues/854>
        // message: inputArgs[0],
        msg: inputArgs[0],
        meta: inputArgs[1]
      });
    }
  }
});

const env = require('./env');

const isProduction = env.NODE_ENV === 'production';

module.exports = {
  logger: isProduction ? pino : signale,
  level: isProduction ? 'info' : 'debug',
  levels: isProduction
    ? ['info', 'warn', 'error', 'fatal']
    : ['trace', 'info', 'debug', 'warn', 'error', 'fatal'],
  showStack: env.SHOW_STACK,
  showMeta: env.SHOW_META,
  capture: false,
  name: env.APP_NAME
};
