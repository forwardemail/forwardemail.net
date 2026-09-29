/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// TODO: remove user.email for all users from denylist

const { isIP } = require('node:net');
const punycode = require('node:punycode');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
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
const ms = require('ms');
const pMap = require('p-map');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const { boolean } = require('boolean');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const isAllowlistTld = require('#helpers/is-allowlist-tld');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

const THIRTY_DAYS_TO_MS = ms('30d');

graceful.listen();

// Configuration for batch processing
const DOMAIN_BATCH_SIZE = 1000; // Tune this based on your needs
const ALIAS_BATCH_SIZE = 5000; // Larger batch for aliases as they're simpler
// Domains of a batch processed at once (each pages through its own aliases,
// so running a whole batch of 1000 at once held up to 1000 alias pages)
const DOMAIN_CONCURRENCY = 10;
// Aliases of a page checked at once (each makes Redis lookups)
const ALIAS_CONCURRENCY = 50;
// Redis commands buffered before a pipeline is sent
const PIPELINE_SIZE = 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Statistics tracking
const stats = {
  domainsProcessed: 0,
  domainsSkippedAllAdminsBanned: 0,
  aliasesProcessed: 0,
  aliasesSkippedBannedUser: 0,
  entriesBeforeDenylistCheck: 0,
  entriesFilteredDenylisted: 0,
  entriesFilteredHardcoded: 0,
  entriesFilteredInvalidTld: 0,
  entriesAddedToAllowlist: 0,
  denylistRemovals: 0,
  backscatterRemovals: 0,
  silentRemovals: 0
};

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

// Helper function to check if value is denylisted (without throwing)
async function checkDenylisted(value) {
  try {
    // Check hard-coded denylist first
    if (config.denylist.has(value)) {
      return { denylisted: true, reason: 'hardcoded' };
    }

    // If email, check domain and root domain
    if (isEmail(value)) {
      const domain = parseHostFromDomainOrAddress(value);
      if (config.denylist.has(domain)) {
        return { denylisted: true, reason: 'hardcoded' };
      }

      const root = parseRootDomain(domain);
      if (domain !== root && config.denylist.has(root)) {
        return { denylisted: true, reason: 'hardcoded' };
      }
    }

    // If FQDN, check root domain
    if (isFQDN(value)) {
      if (config.denylist.has(value)) {
        return { denylisted: true, reason: 'hardcoded' };
      }

      const root = parseRootDomain(value);
      if (value !== root && config.denylist.has(root)) {
        return { denylisted: true, reason: 'hardcoded' };
      }

      // Check test domains
      if (config.testDomains.some((s) => value.endsWith(`.${s}`))) {
        return { denylisted: true, reason: 'hardcoded' };
      }
    }

    // Check Redis denylist
    const denylisted = await client.get(`denylist:${value}`);
    if (boolean(denylisted)) {
      return { denylisted: true, reason: 'redis' };
    }

    // Check root domain in Redis if different
    if (isEmail(value) || isFQDN(value)) {
      const root = parseRootDomain(
        isFQDN(value) ? value : parseHostFromDomainOrAddress(value)
      );

      if (root !== value) {
        const rootDenylisted = await client.get(`denylist:${root}`);
        if (boolean(rootDenylisted)) {
          return { denylisted: true, reason: 'redis' };
        }
      }
    }

    return { denylisted: false };
  } catch (err) {
    logger.error(`Error checking denylist for ${value}:`, err);
    // On error, assume not denylisted to avoid blocking legitimate entries
    return { denylisted: false };
  }
}

// Optimized function to process domains with pagination
async function processDomainsBatch(bannedUserIdsSet, set, denylistedEntries) {
  let lastId = null;

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
      logger.info(`Completed processing ${stats.domainsProcessed} domains`);
      break;
    }

    lastId = domains[domains.length - 1]._id;

    logger.info(
      `Processing domain batch: ${domains.length} domains (total: ${
        stats.domainsProcessed + domains.length
      })`
    );

    // Process the batch in parallel with controlled concurrency
    await pMap(
      domains,
      async (domain) => {
        try {
          logger.debug('processing %s', domain.name);

          // Check if all admins are banned
          const adminMembers = domain.members?.filter(
            (m) => m.group === 'admin'
          );

          if (
            !adminMembers ||
            adminMembers.every((m) => bannedUserIdsSet.has(m.user.toString()))
          ) {
            logger.info(
              'all domain admins are banned, skipping domain %s',
              domain.name
            );
            stats.domainsSkippedAllAdminsBanned++;
            return;
          }

          stats.domainsProcessed++;

          const domainName = punycode.toASCII(domain.name);

          // Check if domain is denylisted
          const denylistCheck = await checkDenylisted(domainName);
          if (denylistCheck.denylisted) {
            logger.debug(
              'domain %s is denylisted (%s), skipping',
              domainName,
              denylistCheck.reason
            );
            addDenylistedEntry(denylistedEntries, {
              value: domainName,
              type: 'domain',
              reason: denylistCheck.reason
            });
            if (denylistCheck.reason === 'hardcoded') {
              stats.entriesFilteredHardcoded++;
            } else {
              stats.entriesFilteredDenylisted++;
            }

            return;
          }

          if (isAllowlistTld(domainName)) {
            set.add(domainName);
          } else {
            logger.debug(
              'domain %s TLD is not allowlisted, skipping',
              domainName
            );
            stats.entriesFilteredInvalidTld++;
          }

          // Parse root domain
          const rootDomain = parseRootDomain(domain.name);
          if (domain.name !== rootDomain) {
            const rootDomainAscii = punycode.toASCII(rootDomain);
            const rootDenylistCheck = await checkDenylisted(rootDomainAscii);
            // eslint-disable-next-line no-negated-condition
            if (!rootDenylistCheck.denylisted) {
              if (isAllowlistTld(rootDomainAscii)) {
                set.add(rootDomainAscii);
              } else {
                logger.debug(
                  'root domain %s TLD is not allowlisted, skipping',
                  rootDomainAscii
                );
                stats.entriesFilteredInvalidTld++;
              }
            } else {
              logger.debug(
                'root domain %s is denylisted (%s), skipping',
                rootDomainAscii,
                rootDenylistCheck.reason
              );
              addDenylistedEntry(denylistedEntries, {
                value: rootDomainAscii,
                type: 'root_domain',
                reason: rootDenylistCheck.reason
              });
              if (rootDenylistCheck.reason === 'hardcoded') {
                stats.entriesFilteredHardcoded++;
              } else {
                stats.entriesFilteredDenylisted++;
              }
            }
          }

          // Process aliases for this domain with pagination
          await processAliasesBatch(
            domain,
            bannedUserIdsSet,
            set,
            denylistedEntries
          );
        } catch (err) {
          logger.error(`Error processing domain ${domain.name}:`, err);
          // Continue processing other domains even if one fails
        }
      },
      { concurrency: DOMAIN_CONCURRENCY }
    );
  }
}

//
// Denylisted values that were filtered out, one entry per value and type
// (the same recipient domain is usually seen on many aliases)
//
function addDenylistedEntry(denylistedEntries, entry) {
  const key = `${entry.type}:${entry.value}`;
  if (!denylistedEntries.has(key)) denylistedEntries.set(key, entry);
}

//
// Buffers Redis commands and sends them every PIPELINE_SIZE commands, where
// a single pipeline for the whole run held every command (and then every
// reply) in memory at once
//
function createPipelineWriter(client) {
  let p = client.pipeline();
  let size = 0;

  async function flush() {
    if (size === 0) return;
    const pipeline = p;
    p = client.pipeline();
    size = 0;
    await retryOperation(async () => {
      await pipeline.exec();
    });
  }

  return {
    async set(...args) {
      p.set(...args);
      size++;
      if (size >= PIPELINE_SIZE) await flush();
    },
    async del(key) {
      p.del(key);
      size++;
      if (size >= PIPELINE_SIZE) await flush();
    },
    flush
  };
}

// Optimized function to process aliases with pagination
async function processAliasesBatch(
  domain,
  bannedUserIdsSet,
  set,
  denylistedEntries
) {
  let lastId = null;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    //
    // NOTE: aliases of banned users are skipped below; they are not excluded
    //       in the query, where a `$nin` of every banned user id (tens of
    //       thousands) was copied into every alias page query, for every
    //       domain being processed at once
    //
    const query = {
      domain: domain._id,
      is_enabled: true
    };

    if (lastId) {
      query._id = { $gt: lastId };
    }

    const aliases = await retryOperation(async () => {
      // eslint-disable-next-line unicorn/no-array-callback-reference
      return Aliases.find(query)
        .select('name recipients _id user')
        .sort({ _id: 1 }) // Ensures consistent ordering for pagination
        .limit(ALIAS_BATCH_SIZE)
        .lean();
    });

    if (aliases.length === 0) {
      break;
    }

    lastId = aliases[aliases.length - 1]._id;

    // Track aliases processed and skipped
    const aliasesBeforeFilter = aliases.length;
    const validAliases = aliases.filter((alias) => {
      if (bannedUserIdsSet.has(alias.user.toString())) {
        stats.aliasesSkippedBannedUser++;
        return false;
      }

      return true;
    });

    stats.aliasesProcessed += validAliases.length;

    logger.debug(
      'processing %d aliases for domain %s (%d skipped banned users)',
      validAliases.length,
      domain.name,
      aliasesBeforeFilter - validAliases.length
    );

    // Process aliases in smaller chunks to avoid overwhelming the system
    const chunkSize = 1000;
    for (let i = 0; i < validAliases.length; i += chunkSize) {
      const chunk = validAliases.slice(i, i + chunkSize);

      await pMap(
        chunk,
        async (alias) => {
          try {
            logger.debug(
              'alias %s@%s (%d recipients)',
              alias.name,
              domain.name,
              alias.recipients.length
            );

            for (const recipient of alias.recipients) {
              if (isFQDN(recipient)) {
                const recipientDomain = recipient.toLowerCase();
                const recipientDomainAscii = punycode.toASCII(recipientDomain);

                const denylistCheck = await checkDenylisted(
                  recipientDomainAscii
                );
                if (denylistCheck.denylisted) {
                  logger.debug(
                    'recipient domain %s is denylisted (%s), skipping',
                    recipientDomainAscii,
                    denylistCheck.reason
                  );
                  addDenylistedEntry(denylistedEntries, {
                    value: recipientDomainAscii,
                    type: 'recipient_domain',
                    reason: denylistCheck.reason
                  });
                  if (denylistCheck.reason === 'hardcoded') {
                    stats.entriesFilteredHardcoded++;
                  } else {
                    stats.entriesFilteredDenylisted++;
                  }

                  continue;
                }

                if (isAllowlistTld(recipientDomainAscii)) {
                  set.add(recipientDomainAscii);
                } else {
                  logger.debug(
                    'recipient domain %s TLD is not allowlisted, skipping',
                    recipientDomainAscii
                  );
                  stats.entriesFilteredInvalidTld++;
                }

                // Parse root domain
                const rootDomain = parseRootDomain(recipientDomain);
                if (recipientDomain !== rootDomain) {
                  const rootDomainAscii = punycode.toASCII(rootDomain);
                  const rootDenylistCheck = await checkDenylisted(
                    rootDomainAscii
                  );
                  // eslint-disable-next-line no-negated-condition
                  if (!rootDenylistCheck.denylisted) {
                    if (isAllowlistTld(rootDomainAscii)) {
                      set.add(rootDomainAscii);
                    } else {
                      logger.debug(
                        'recipient root domain %s TLD is not allowlisted, skipping',
                        rootDomainAscii
                      );
                      stats.entriesFilteredInvalidTld++;
                    }
                  } else {
                    logger.debug(
                      'recipient root domain %s is denylisted (%s), skipping',
                      rootDomainAscii,
                      rootDenylistCheck.reason
                    );
                    addDenylistedEntry(denylistedEntries, {
                      value: rootDomainAscii,
                      type: 'recipient_root_domain',
                      reason: rootDenylistCheck.reason
                    });
                    if (rootDenylistCheck.reason === 'hardcoded') {
                      stats.entriesFilteredHardcoded++;
                    } else {
                      stats.entriesFilteredDenylisted++;
                    }
                  }
                }
              } else if (isEmail(recipient)) {
                // Parse domain
                const [, recipientDomain] = recipient.split('@');
                const recipientDomainAscii = punycode.toASCII(recipientDomain);

                const denylistCheck = await checkDenylisted(
                  recipientDomainAscii
                );
                if (denylistCheck.denylisted) {
                  logger.debug(
                    'recipient email domain %s is denylisted (%s), skipping',
                    recipientDomainAscii,
                    denylistCheck.reason
                  );
                  addDenylistedEntry(denylistedEntries, {
                    value: recipientDomainAscii,
                    type: 'recipient_email_domain',
                    reason: denylistCheck.reason
                  });
                  if (denylistCheck.reason === 'hardcoded') {
                    stats.entriesFilteredHardcoded++;
                  } else {
                    stats.entriesFilteredDenylisted++;
                  }

                  continue;
                }

                if (isAllowlistTld(recipientDomainAscii)) {
                  set.add(recipientDomainAscii);
                } else {
                  logger.debug(
                    'recipient domain %s TLD is not allowlisted, skipping',
                    recipientDomainAscii
                  );
                  stats.entriesFilteredInvalidTld++;
                }

                // Parse root domain
                const rootDomain = parseRootDomain(recipientDomain);
                if (recipientDomain !== rootDomain) {
                  const rootDomainAscii = punycode.toASCII(rootDomain);
                  const rootDenylistCheck = await checkDenylisted(
                    rootDomainAscii
                  );
                  // eslint-disable-next-line no-negated-condition
                  if (!rootDenylistCheck.denylisted) {
                    if (isAllowlistTld(rootDomainAscii)) {
                      set.add(rootDomainAscii);
                    } else {
                      logger.debug(
                        'recipient root domain %s TLD is not allowlisted, skipping',
                        rootDomainAscii
                      );
                      stats.entriesFilteredInvalidTld++;
                    }
                  } else {
                    logger.debug(
                      'recipient email root domain %s is denylisted (%s), skipping',
                      rootDomainAscii,
                      rootDenylistCheck.reason
                    );
                    addDenylistedEntry(denylistedEntries, {
                      value: rootDomainAscii,
                      type: 'recipient_email_root_domain',
                      reason: rootDenylistCheck.reason
                    });
                    if (rootDenylistCheck.reason === 'hardcoded') {
                      stats.entriesFilteredHardcoded++;
                    } else {
                      stats.entriesFilteredDenylisted++;
                    }
                  }
                }
              } else if (isIP(recipient)) {
                const ipDenylistCheck = await checkDenylisted(recipient);
                // eslint-disable-next-line no-negated-condition
                if (!ipDenylistCheck.denylisted) {
                  set.add(recipient);
                } else {
                  logger.debug(
                    'recipient IP %s is denylisted (%s), skipping',
                    recipient,
                    ipDenylistCheck.reason
                  );
                  addDenylistedEntry(denylistedEntries, {
                    value: recipient,
                    type: 'recipient_ip',
                    reason: ipDenylistCheck.reason
                  });
                  if (ipDenylistCheck.reason === 'hardcoded') {
                    stats.entriesFilteredHardcoded++;
                  } else {
                    stats.entriesFilteredDenylisted++;
                  }
                }
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
        },
        { concurrency: ALIAS_CONCURRENCY }
      );
    }
  }
}

// Optimized function to process Redis streams with error handling
// eslint-disable-next-line max-params
async function processRedisStream(client, pattern, set, targetSet, p) {
  try {
    const prefix = pattern.replace('*', '');
    for await (const keys of client.scanStream({
      match: pattern,
      count: 10000,
      type: 'string',
      // hold one page at a time (a readable stream buffers 16 by default)
      highWaterMark: 1
    })) {
      const matched = new Set();
      for (const key of keys) {
        try {
          const keyWithoutPrefix = key.replace(prefix, '');

          if (set.has(keyWithoutPrefix)) {
            matched.add(key);
            targetSet.add(keyWithoutPrefix);
          }

          if (isIP(keyWithoutPrefix)) continue;

          if (isFQDN(keyWithoutPrefix) || isEmail(keyWithoutPrefix)) {
            const host = parseHostFromDomainOrAddress(keyWithoutPrefix);
            const root = parseRootDomain(host);

            if (set.has(host)) {
              matched.add(key);
              targetSet.add(keyWithoutPrefix);
            }

            if (host !== root && set.has(root)) {
              matched.add(key);
              targetSet.add(keyWithoutPrefix);
            }
          }
        } catch (err) {
          logger.error(`Error processing Redis key ${key}:`, err);
          // Continue processing other keys even if one fails
        }
      }

      for (const key of matched) {
        await p.del(key);
      }
    }
  } catch (err) {
    logger.error(`Error processing Redis stream ${pattern}:`, err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const bannedUserIdsSet = await Users.getBannedUserIdSet(client);
    logger.info(`Found ${bannedUserIdsSet.size} banned users`);

    const set = new Set();
    const denylistedEntries = new Map();

    // Process domains with optimized pagination
    await processDomainsBatch(bannedUserIdsSet, set, denylistedEntries);

    stats.entriesBeforeDenylistCheck = set.size + denylistedEntries.size;
    stats.entriesAddedToAllowlist = set.size;

    logger.info(`Total unique entries in allowlist: ${set.size}`);
    logger.info(`Total denylisted entries filtered: ${denylistedEntries.size}`);

    const p = createPipelineWriter(client);

    // Set allowlist entries in Redis with 30-day expiration
    for (const key of set) {
      await p.set(`allowlist:${key}`, 'true', 'PX', THIRTY_DAYS_TO_MS);
    }

    // Process Redis streams with error handling
    const denylistSet = new Set();
    await processRedisStream(client, 'denylist:*', set, denylistSet, p);
    stats.denylistRemovals = denylistSet.size;

    const silentSet = new Set();
    await processRedisStream(client, 'silent:*', set, silentSet, p);
    stats.silentRemovals = silentSet.size;

    const backscatterSet = new Set();
    await processRedisStream(client, 'backscatter:*', set, backscatterSet, p);
    stats.backscatterRemovals = backscatterSet.size;

    await p.flush();

    // Create CSV with all removals
    const removalsCsvContent = ['prefix,value']; // header row

    for (const key of denylistSet) {
      removalsCsvContent.push(`denylist,${key}`);
    }

    for (const key of backscatterSet) {
      removalsCsvContent.push(`backscatter,${key}`);
    }

    for (const key of silentSet) {
      removalsCsvContent.push(`silent,${key}`);
    }

    // Create full allowlist CSV
    const allowlistCsvContent = ['domain_or_email']; // header row
    for (const key of set) {
      allowlistCsvContent.push(key);
    }

    // Create denylisted entries CSV
    const denylistedCsvContent = ['value,type,reason']; // header row
    for (const entry of denylistedEntries.values()) {
      denylistedCsvContent.push(`${entry.value},${entry.type},${entry.reason}`);
    }

    // Calculate statistics
    const totalRemovals =
      stats.denylistRemovals + stats.backscatterRemovals + stats.silentRemovals;

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: `Sync Paid Alias Allowlist Report - ${stats.entriesAddedToAllowlist.toLocaleString()} entries added, ${
          stats.entriesFilteredDenylisted +
          stats.entriesFilteredHardcoded +
          stats.entriesFilteredInvalidTld
        } filtered`,
        attachments: [
          {
            filename: 'allowlist-full.csv',
            content: allowlistCsvContent.join('\n')
          },
          {
            filename: 'removals.csv',
            content: removalsCsvContent.join('\n')
          },
          {
            filename: 'denylisted-filtered.csv',
            content: denylistedCsvContent.join('\n')
          }
        ]
      },
      locals: {
        message: `
<div style="font-family: sans-serif;">
  <h2>Sync Paid Alias Allowlist - Job Completed Successfully</h2>

  <h3>Processing Statistics</h3>
  <ul>
    <li><strong>Domains Processed</strong>: ${stats.domainsProcessed.toLocaleString()}</li>
    <li><strong>Domains Skipped (All Admins Banned)</strong>: ${stats.domainsSkippedAllAdminsBanned.toLocaleString()}</li>
    <li><strong>Aliases Processed</strong>: ${stats.aliasesProcessed.toLocaleString()}</li>
    <li><strong>Aliases Skipped (Banned Users)</strong>: ${stats.aliasesSkippedBannedUser.toLocaleString()}</li>
    <li><strong>Banned Users in System</strong>: ${bannedUserIdsSet.size.toLocaleString()}</li>
  </ul>

  <h3>Allowlist Entries Added</h3>
  <ul>
    <li><strong>Total Allowlist Entries</strong>: ${stats.entriesAddedToAllowlist.toLocaleString()}</li>
    <li><strong>TTL (Time to Live)</strong>: 30 days</li>
    <li><strong>Redis Key Pattern</strong>: <code>allowlist:*</code></li>
  </ul>

  <h3>Denylisted Entries Filtered (Not Added to Allowlist)</h3>
  <ul>
    <li><strong>Filtered by Hardcoded Denylist</strong>: ${stats.entriesFilteredHardcoded.toLocaleString()}</li>
    <li><strong>Filtered by Redis Denylist</strong>: ${stats.entriesFilteredDenylisted.toLocaleString()}</li>
    <li><strong>Filtered by Invalid TLD</strong>: ${stats.entriesFilteredInvalidTld.toLocaleString()}</li>
    <li><strong>Total Filtered</strong>: ${(
      stats.entriesFilteredDenylisted +
      stats.entriesFilteredHardcoded +
      stats.entriesFilteredInvalidTld
    ).toLocaleString()}</li>
  </ul>

  <h3>Removals from Blocklists</h3>
  <ul>
    <li><strong>Denylist Removals</strong>: ${stats.denylistRemovals.toLocaleString()}</li>
    <li><strong>Backscatter Removals</strong>: ${stats.backscatterRemovals.toLocaleString()}</li>
    <li><strong>Silent Removals</strong>: ${stats.silentRemovals.toLocaleString()}</li>
    <li><strong>Total Removals</strong>: ${totalRemovals.toLocaleString()}</li>
  </ul>

  <h3>Summary</h3>
  <p>This job processes all paid domains (enhanced_protection and team plans) with verified TXT records, along with their aliases and recipients. Domains and emails from paid users are added to the allowlist to prevent false positives in spam filtering.</p>

  <p><strong>Key Features:</strong></p>
  <ul>
    <li>Excludes aliases from banned users</li>
    <li>Excludes domains where all admins are banned</li>
    <li>Filters out any denylisted entries before adding to allowlist</li>
    <li>Filters out domains and recipients with non-allowlisted TLDs (only goodDomains and restrictedDomains TLDs are permitted)</li>
    <li>Removes paid user entries from denylist, backscatter, and silent lists</li>
  </ul>

  <p><strong>Attachments:</strong></p>
  <ul>
    <li><code>allowlist-full.csv</code> - All ${stats.entriesAddedToAllowlist.toLocaleString()} allowlist entries added to Redis</li>
    <li><code>removals.csv</code> - All entries removed from denylist, backscatter, and silent lists (${totalRemovals.toLocaleString()} entries)</li>
    <li><code>denylisted-filtered.csv</code> - Entries that were filtered out due to being denylisted (${(
      stats.entriesFilteredDenylisted + stats.entriesFilteredHardcoded
    ).toLocaleString()} entries)</li>
    <li>Invalid TLD entries filtered: ${stats.entriesFilteredInvalidTld.toLocaleString()}</li>
  </ul>
</div>
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
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
