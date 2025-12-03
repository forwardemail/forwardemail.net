/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// TODO: remove user.email for all users from denylist

const { isIP } = require('node:net');
const punycode = require('node:punycode');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const isFQDN = require('is-fqdn');
const mongoose = require('mongoose');
// const ms = require('ms');
const parseErr = require('parse-err');
const pEvent = require('p-event');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

// const SEVEN_DAYS_TO_MS = ms('7d');

graceful.listen();

// Configuration for batch processing
const DOMAIN_BATCH_SIZE = 1000; // Tune this based on your needs
const ALIAS_BATCH_SIZE = 5000; // Larger batch for aliases as they're simpler
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function for retrying operations
async function retryOperation(
  operation,
  maxRetries = MAX_RETRIES,
  delay = RETRY_DELAY
) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      logger.warn(
        `Operation failed (attempt ${attempt}/${maxRetries}):`,
        err.message
      );
      if (attempt < maxRetries) {
        await setTimeout(delay * attempt);
      }
    }
  }

  throw lastError;
}

// Optimized function to process domains with pagination
async function processDomainsBatch(bannedUserIdsSet, set) {
  let lastId = null;
  let totalProcessed = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = {
      plan: { $in: ['enhanced_protection', 'team'] },
      has_txt_record: true
    };

    if (lastId) {
      query._id = { $gt: lastId };
    }

    const domains = await retryOperation(async () => {
      // eslint-disable-next-line unicorn/no-array-callback-reference
      return Domains.find(query)
        .select('name members _id')
        .sort({ _id: 1 }) // Ensures consistent ordering for pagination
        .limit(DOMAIN_BATCH_SIZE)
        .lean();
    });

    if (domains.length === 0) {
      logger.info(`Completed processing ${totalProcessed} domains`);
      break;
    }

    lastId = domains[domains.length - 1]._id;
    totalProcessed += domains.length;

    logger.info(
      `Processing domain batch: ${domains.length} domains (total: ${totalProcessed})`
    );

    // Process the batch in parallel with controlled concurrency
    await Promise.all(
      domains.map(async (domain) => {
        try {
          logger.debug('processing %s', domain.name);

          // filter out domains where all users are banned
          if (
            !domain.members ||
            !Array.isArray(domain.members) ||
            domain.members.every((m) => bannedUserIdsSet.has(m.user.toString()))
          ) {
            logger.info('all domain users were banned %s', domain.name);
            return;
          }

          set.add(punycode.toASCII(domain.name));
          {
            // parse root domain
            const rootDomain = parseRootDomain(domain.name);
            if (domain.name !== rootDomain) {
              set.add(punycode.toASCII(rootDomain));
            }
          }

          // Process aliases for this domain with pagination
          await processAliasesBatch(domain, bannedUserIdsSet, set);
        } catch (err) {
          logger.error(`Error processing domain ${domain.name}:`, err);
          // Continue processing other domains even if one fails
        }
      })
    );
  }
}

// Optimized function to process aliases with pagination
async function processAliasesBatch(domain, bannedUserIdsSet, set) {
  let lastId = null;
  let totalProcessed = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = {
      domain: domain._id,
      is_enabled: true,
      user: {
        $nin: [...bannedUserIdsSet]
      }
    };

    if (lastId) {
      query._id = { $gt: lastId };
    }

    const aliases = await retryOperation(async () => {
      // eslint-disable-next-line unicorn/no-array-callback-reference
      return Aliases.find(query)
        .select('name recipients _id')
        .sort({ _id: 1 }) // Ensures consistent ordering for pagination
        .limit(ALIAS_BATCH_SIZE)
        .lean();
    });

    if (aliases.length === 0) {
      if (totalProcessed > 0) {
        logger.debug(
          `Completed processing ${totalProcessed} aliases for domain ${domain.name}`
        );
      }

      break;
    }

    lastId = aliases[aliases.length - 1]._id;
    totalProcessed += aliases.length;

    // Process aliases in smaller chunks to avoid overwhelming the system
    const chunkSize = 1000;
    for (let i = 0; i < aliases.length; i += chunkSize) {
      const chunk = aliases.slice(i, i + chunkSize);

      await Promise.all(
        chunk.map(async (alias) => {
          try {
            logger.debug(
              'alias %s@%s (%d recipients)',
              alias.name,
              domain.name,
              alias.recipients.length
            );

            // add alias.name @ domain.name
            /*
            if (
              !alias.name.startsWith('/') &&
              isEmail(`${alias.name}@${domain.name}`) &&
              alias.name !== '*'
            ) {
              set.add(`${alias.name}@${domain.name}`);
            }
            */

            for (const recipient of alias.recipients) {
              if (isFQDN(recipient)) {
                const domain = recipient.toLowerCase();
                set.add(punycode.toASCII(domain));
                // parse root domain
                const rootDomain = parseRootDomain(domain);
                if (domain !== rootDomain) {
                  set.add(punycode.toASCII(domain));
                }
              } else if (isEmail(recipient)) {
                // parse domain
                // const [userPortion, domain] = recipient.split('@');
                const [, domain] = recipient.split('@');
                // parse root domain
                set.add(punycode.toASCII(domain));
                // if (alias.name.startsWith('/') && !/\$\d/.test(userPortion))
                //   set.add(recipient); // already lowercased (see alias model)
                // else set.add(recipient); // already lowercased (see alias model)
                // parse root domain
                const rootDomain = parseRootDomain(domain);
                if (domain !== rootDomain) {
                  set.add(punycode.toASCII(domain));
                }
              } else if (isIP(recipient)) {
                set.add(recipient);
              }
              // TODO: we don't ban webhooks currently
            }
          } catch (err) {
            logger.error(
              `Error processing alias ${alias.name}@${domain.name}:`,
              err
            );
            // Continue processing other aliases even if one fails
          }
        })
      );
    }
  }
}

// Optimized function to process Redis streams with error handling
// eslint-disable-next-line max-params
async function processRedisStream(client, pattern, set, targetSet, p) {
  try {
    const stream = client.scanStream({
      match: pattern,
      count: 10000,
      type: 'string'
    });

    const processKeys = (keys) => {
      for (const key of keys) {
        try {
          const prefix = pattern.replace('*', '');
          const keyWithoutPrefix = key.replace(prefix, '');

          if (set.has(keyWithoutPrefix)) {
            p.del(key);
            targetSet.add(keyWithoutPrefix);
          }

          if (isIP(keyWithoutPrefix)) continue;

          if (isFQDN(keyWithoutPrefix) || isEmail(keyWithoutPrefix)) {
            const host = parseHostFromDomainOrAddress(keyWithoutPrefix);
            const root = parseRootDomain(host);

            if (set.has(host)) {
              p.del(key);
              targetSet.add(keyWithoutPrefix);
            }

            if (host !== root && set.has(root)) {
              p.del(key);
              targetSet.add(keyWithoutPrefix);
            }
          }
        } catch (err) {
          logger.error(`Error processing Redis key ${key}:`, err);
          // Continue processing other keys even if one fails
        }
      }
    };

    stream.on('data', processKeys);
    await pEvent(stream, 'end');
  } catch (err) {
    logger.error(`Error processing Redis stream ${pattern}:`, err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const bannedUserIdsSet = await Users.getBannedUserIdSet(client);

    const set = new Set();

    // Process domains with optimized pagination
    await processDomainsBatch(bannedUserIdsSet, set);

    logger.info(`Total unique entries in allowlist: ${set.size}`);

    const p = client.pipeline();

    /*
    for (const key of set) {
      p.set(`allowlist:${key}`, true, 'PX', SEVEN_DAYS_TO_MS);
    }
    */

    // Process Redis streams with error handling
    const denylistSet = new Set();
    await processRedisStream(client, 'denylist:*', set, denylistSet, p);

    const silentSet = new Set();
    await processRedisStream(client, 'silent:*', set, silentSet, p);

    const backscatterSet = new Set();
    await processRedisStream(client, 'backscatter:*', set, backscatterSet, p);

    await retryOperation(async () => {
      await p.exec();
    });

    const csvContent = ['prefix,value']; // header row

    for (const key of denylistSet) {
      csvContent.push(`denylist,${key}`);
    }

    for (const key of backscatterSet) {
      csvContent.push(`backscatter,${key}`);
    }

    for (const key of silentSet) {
      csvContent.push(`silent,${key}`);
    }

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Sync paid users report',
        attachments: [
          {
            filename: 'report.csv',
            content: csvContent.join('\n')
          }
        ]
      },
      locals: {
        message: `
<ul>
  <li><strong>Denylist Removals</strong>: ${denylistSet.size}</li>
  <li><strong>Backscatter Removals</strong>: ${backscatterSet.size}</li>
  <li><strong>Silent Removals</strong>: ${silentSet.size}</li>
</ul>
        `.trim()
      }
    });

    logger.info('Sync paid users job completed successfully');
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Sync paid users had an error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
