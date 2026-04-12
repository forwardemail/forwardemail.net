/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Observatory Blacklist Check Job
 *
 * Checks monitored domains and IPs against all configured DNSBL lists
 * using DNS-based lookups. Detects listing/delisting events and records
 * them in the ObservatoryBlacklistEvents collection.
 *
 * This job is ADDITIVE -- it does not replace update-uceprotect.js
 * or the existing denylist: Redis keys used by the SMTP pipeline.
 * All observatory data lives under the obs: Redis namespace.
 *
 * Interval: 30m
 * Timeout: 15m
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const pMap = require('p-map');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const ObservatorySubjects = require('#models/observatory-subjects');
const ObservatoryBlacklistEvents = require('#models/observatory-blacklist-events');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { checkDnsbl } = require('#helpers/observatory/check-dnsbl');
const { sendAlert } = require('#helpers/observatory/send-alert');
const {
  SUBJECT_BATCH_SIZE,
  REDIS_PREFIXES,
  TTL
} = require('#config/observatory');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

// Store boolean if the job is cancelled
let isCancelled = false;

// Handle cancellation
if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Process a single subject: check all DNSBLs, detect changes, record events.
 *
 * @param {Object} subject - ObservatorySubject document
 */
async function processSubject(subject) {
  if (isCancelled) return;

  try {
    // Run DNSBL checks
    const results = await checkDnsbl(subject.value, subject.type, resolver);

    // Determine which lists this subject is currently on
    const listedResults = results.filter((r) => r.is_listed);
    const listedNames = listedResults.map((r) => r.list_name);
    const previousLists = subject.blacklist_summary?.lists || [];

    // Detect new listings (on a list now that wasn't before)
    const newListings = listedNames.filter(
      (name) => !previousLists.includes(name)
    );

    // Detect delistings (was on a list before, not anymore)
    const delistings = previousLists.filter(
      (name) => !listedNames.includes(name)
    );

    const now = new Date();

    // Record listing events
    if (newListings.length > 0) {
      const listingDocs = newListings.map((listName) => {
        const result = listedResults.find((r) => r.list_name === listName);
        return {
          subject: subject._id,
          subject_value: subject.value,
          subject_type: subject.type,
          list_name: listName,
          event_type: 'listed',
          detected_at: now,
          raw_response: result?.response_code || null
        };
      });

      await ObservatoryBlacklistEvents.insertMany(listingDocs, {
        ordered: false
      });
    }

    // Record delisting events
    if (delistings.length > 0) {
      const delistingDocs = delistings.map((listName) => ({
        subject: subject._id,
        subject_value: subject.value,
        subject_type: subject.type,
        list_name: listName,
        event_type: 'delisted',
        detected_at: now,
        raw_response: null
      }));

      await ObservatoryBlacklistEvents.insertMany(delistingDocs, {
        ordered: false
      });
    }

    // Update the subject's blacklist summary
    await ObservatorySubjects.updateOne(
      { _id: subject._id },
      {
        $set: {
          blacklist_summary: {
            listed_count: listedNames.length,
            total_checked: results.length,
            lists: listedNames
          },
          blacklist_summary_at: now
        }
      }
    );

    // Cache result in Redis
    await client.set(
      `${REDIS_PREFIXES.blacklist}${subject.type}:${subject.value}`,
      JSON.stringify({
        listed_count: listedNames.length,
        total_checked: results.length,
        lists: listedNames,
        checked_at: now.toISOString()
      }),
      'PX',
      TTL.blacklistCache
    );

    // Send alerts for monitored subjects with status changes
    if (
      subject.is_monitored &&
      subject.monitored_by?.length > 0 &&
      (newListings.length > 0 || delistings.length > 0)
    ) {
      if (newListings.length > 0) {
        await sendAlert({
          subject,
          alertType: 'blacklist_listed',
          message: `${subject.value} has been listed on ${
            newListings.length
          } new blacklist(s): ${newListings.join(', ')}.`,
          details: { lists: newListings },
          client
        });
      }

      if (delistings.length > 0) {
        await sendAlert({
          subject,
          alertType: 'blacklist_delisted',
          message: `${subject.value} has been removed from ${
            delistings.length
          } blacklist(s): ${delistings.join(', ')}.`,
          details: { lists: delistings },
          client
        });
      }
    }

    if (newListings.length > 0 || delistings.length > 0) {
      logger.info('Blacklist status changed', {
        subject: subject.value,
        type: subject.type,
        newListings,
        delistings
      });
    }
  } catch (err) {
    logger.error('Error checking blacklists for subject', {
      subject: subject.value,
      type: subject.type,
      err
    });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

    // Find subjects that need checking:
    // - actively monitored subjects
    // - OR subjects whose blacklist data is stale (> 24h)
    const subjects = await ObservatorySubjects.find({
      $or: [
        { is_monitored: true },
        { blacklist_summary_at: { $lt: staleThreshold } },
        { blacklist_summary_at: null }
      ]
    })
      .select('_id type value blacklist_summary is_monitored monitored_by')
      .limit(SUBJECT_BATCH_SIZE)
      .lean();

    logger.info('Observatory blacklist check starting', {
      subjectCount: subjects.length
    });

    // Process with concurrency to avoid overwhelming DNS
    await pMap(
      subjects,
      async (subject) => {
        if (isCancelled) return;
        await processSubject(subject);
      },
      { concurrency: 10 }
    );

    logger.info('Observatory blacklist check complete', {
      subjectCount: subjects.length
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
