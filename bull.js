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

  (async () => {
    try {
      const migration = bull.queues.get('migration');
      await pSeries([() => migration.empty(), () => migration.add()]);

      const vanityDomains = bull.queues.get('vanity-domains');
      await pSeries([() => vanityDomains.empty(), () => vanityDomains.add()]);

      const welcomeEmail = bull.queues.get('welcome-email');
      await pSeries([() => welcomeEmail.empty(), () => welcomeEmail.add()]);

      const removeUnverifiedUsers = bull.queues.get('remove-unverified-users');
      await pSeries([
        () => removeUnverifiedUsers.empty(),
        () => removeUnverifiedUsers.add()
      ]);

      const translateMarkdown = bull.queues.get('translate-markdown');
      await pSeries([
        // clear any existing jobs
        () => translateMarkdown.empty(),
        // add the recurring job
        () => translateMarkdown.add(),
        // add an initial job when the process starts
        () => translateMarkdown.add(null, { repeat: false })
      ]);

      const translatePhrases = bull.queues.get('translate-phrases');
      await pSeries([
        // clear any existing jobs
        () => translatePhrases.empty(),
        // add the recurring job
        () => translatePhrases.add(),
        // add an initial job when the process starts
        () => translatePhrases.add(null, { repeat: false })
      ]);

      // <https://github.com/OptimalBits/bull/issues/870>
      const failedEmailJobs = await bull.queues.get('email').getFailed();
      logger.info('Failed email jobs', { failedEmailJobs });
      await Promise.all(failedEmailJobs.map(job => job.retry()));

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
