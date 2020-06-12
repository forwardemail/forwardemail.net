const Bull = require('@ladjs/bull');
const Graceful = require('@ladjs/graceful');
const pSeries = require('p-series');

const config = require('./config');
const queues = require('./queues');
const logger = require('./helpers/logger');

const bull = new Bull({
  logger,
  queues,
  queue: {
    prefix: `bull_${config.env}`
  }
});

if (!module.parent) {
  const graceful = new Graceful({
    bulls: [bull],
    logger
  });

  const migration = bull.queues.get('migration');
  const vanityDomains = bull.queues.get('vanity-domains');
  const welcomeEmail = bull.queues.get('welcome-email');
  const removeUnverifiedUsers = bull.queues.get('remove-unverified-users');
  const translateMarkdown = bull.queues.get('translate-markdown');
  const translatePhrases = bull.queues.get('translate-phrases');
  const openStartup = bull.queues.get('open-startup');

  (async () => {
    try {
      await Promise.all([
        (async () => {
          // <https://github.com/OptimalBits/bull/issues/870>
          const failedEmailJobs = await bull.queues.get('email').getFailed();
          await Promise.all(failedEmailJobs.map(job => job.retry()));
        })(),
        pSeries([() => migration.empty(), () => migration.add()]),
        pSeries([() => vanityDomains.empty(), () => vanityDomains.add()]),
        pSeries([() => welcomeEmail.empty(), () => welcomeEmail.add()]),
        pSeries([
          () => removeUnverifiedUsers.empty(),
          () => removeUnverifiedUsers.add()
        ]),
        pSeries([
          // clear any existing jobs
          () => translateMarkdown.empty(),
          // add the recurring job
          () => translateMarkdown.add(),
          // add an initial job when the process starts
          () => translateMarkdown.add(null, { repeat: false })
        ]),
        pSeries([
          // clear any existing jobs
          () => translatePhrases.empty(),
          // add the recurring job
          () => translatePhrases.add(),
          // add an initial job when the process starts
          () => translatePhrases.add(null, { repeat: false })
        ]),
        pSeries([
          // clear any existing jobs
          () => openStartup.empty(),
          // add the recurring job
          () => openStartup.add(),
          // add an initial job when the process starts
          () => openStartup.add(null, { repeat: false })
        ])
      ]);

      // start it up
      await Promise.all([bull.start(), graceful.listen()]);
      if (process.send) process.send('ready');
      logger.info('Lad job scheduler started');
    } catch (err) {
      logger.error(err);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }
  })();
}

module.exports = bull;
