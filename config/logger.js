const Axe = require('axe');
const { WebClient } = require('@slack/web-api');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
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

const config = {
  logger: isProduction ? pino : signale,
  level: isProduction ? 'warn' : 'debug',
  showStack: env.SHOW_STACK,
  showMeta: env.SHOW_META,
  capture: false,
  name: env.APP_NAME
};

// create our application logger that uses a custom callback function
const axe = new Axe({ ...config });

if (env.SLACK_API_TOKEN) {
  // custom logger for Slack that inherits our Axe config
  // (with the exception of a `callback` function for logging to Slack)
  const slackLogger = new Axe(config);

  // create an instance of the Slack Web Client API for posting messages
  const web = new WebClient(env.SLACK_API_TOKEN, {
    // <https://slack.dev/node-slack-sdk/web-api#logging>
    logger: slackLogger,
    logLevel: config.level
  });

  axe.setCallback(async (level, message, meta) => {
    try {
      // if meta did not have `slack: true`
      // and it was not an error then return early
      if (!meta.slack && !['error', 'fatal'].includes(level)) return;

      // otherwise post a message to the slack channel
      const fields = [
        {
          title: 'Level',
          value: meta.level,
          short: true
        },
        {
          title: 'Environment',
          value: meta.app.environment,
          short: true
        },
        {
          title: 'Hostname',
          value: meta.app.hostname,
          short: true
        },
        {
          title: 'Hash',
          value: meta.app.hash,
          short: true
        }
      ];

      if (meta.user && meta.user.email)
        fields.push({
          title: 'Email',
          value: meta.user.email,
          short: true
        });

      const result = await web.chat.postMessage({
        channel: 'logs',
        username: 'Cabin',
        icon_emoji: ':evergreen_tree:',
        attachments: [
          {
            title: meta.err && meta.err.message ? meta.err.message : message,
            color: 'danger',
            text: meta.err && meta.err.stack ? meta.err.stack : null,
            fields
          }
        ]
      });

      // finally log the result from slack
      axe.info('web.chat.postMessage', { result, callback: false });
    } catch (err) {
      axe.error(err, { callback: false });
    }
  });
}

if (env.INFLUX_API_TOKEN) {
  // setup influx client
  const client = new InfluxDB({
    url: 'http://localhost:8086',
    token: env.INFLUX_API_TOKEN
  });

  // org and bucket
  const org = 'titanism';
  const bucket = 'forwardemail_logs';

  const writeApi = client.getWriteApi(org, bucket);

  axe.setCallback(async (level, message, meta) => {
    const point = new Point(level);

    // tags
    point
      .tag('hostname', meta.app.hostname)
      .tag('environment', meta.app.environment)
      .tag('hash', meta.app.hash);

    if (meta.user && meta.user.email) point.tag('user', meta.user.email);

    if (level === 'error') point.tag('error_code', meta.err.status);

    // request information
    if (meta.request)
      point
        .tag('req_method', meta.request.method)
        .tag('req_url', meta.request.url)
        .tag('req_query', JSON.stringify(meta.request.query));

    if (meta.response) point.tag('res_code', meta.response.status_code);

    // fields
    point.stringField(
      'message',
      // message without ascii colors
      (meta.err && meta.err.message ? meta.err.message : message).replace(
        /\[\d+m/g,
        ''
      )
    );

    if (meta.err && meta.err.stack) point.stringField('stack', meta.err.stack);

    point.timestamp(new Date());

    writeApi.writePoint(point);
    axe.info('Logged influx', { callback: false });
  });
}

module.exports = {
  logger: axe,
  capture: false
};
