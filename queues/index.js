const path = require('path');

const ms = require('ms');

const queues = [
  {
    name: 'migration',
    options: { attempts: 1 },
    processors: [
      {
        processor: path.join(__dirname, 'migration.js'),
        concurrency: 1
      }
    ]
  },
  {
    name: 'email',
    options: {
      attempts: 2
    },
    processors: [
      {
        processor: path.join(__dirname, 'email.js'),
        concurrency: 3
      }
    ]
  },
  {
    name: 'welcome-email',
    options: {
      attempts: 1,
      defaultJobOptions: {
        repeat: {
          every: ms('1m')
        }
      }
    },
    processors: [
      {
        processor: path.join(__dirname, 'welcome-email.js'),
        concurrency: 1
      }
    ]
  },
  {
    name: 'vanity-domains',
    options: {
      attempts: 1
    },
    processors: [
      {
        processor: path.join(__dirname, 'vanity-domains.js'),
        concurrency: 1
      }
    ]
  },
  {
    name: 'account-updates',
    options: {
      attempts: 1,
      defaultJobOptions: {
        repeat: {
          every: ms('1m')
        }
      }
    },
    processors: [
      {
        processor: path.join(__dirname, 'account-updates.js'),
        concurrency: 1
      }
    ]
  },
  {
    name: 'translate-phrases',
    options: {
      attempts: 1,
      defaultJobOptions: {
        repeat: {
          every: ms('1hr')
        }
      }
    },
    processors: [
      {
        processor: path.join(__dirname, 'translate-phrases.js'),
        concurrency: 1
      }
    ]
  },
  {
    name: 'translate-markdown',
    options: {
      attempts: 1,
      defaultJobOptions: {
        repeat: {
          every: ms('30m')
        }
      }
    },
    processors: [
      {
        processor: path.join(__dirname, 'translate-markdown.js'),
        concurrency: 1
      }
    ]
  },
  {
    name: 'remove-unverified-users',
    options: {
      attempts: 1,
      defaultJobOptions: {
        repeat: {
          every: ms('1h')
        }
      }
    },
    processors: [
      {
        processor: path.join(__dirname, 'remove-unverified-users.js'),
        concurrency: 1
      }
    ]
  }
];

module.exports = queues;
