/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Observatory Certificate Transparency Monitor Job
 *
 * Queries crt.sh for newly-issued certificates covering monitored domains.
 * Detects unexpected certificate issuers and records events in
 * ObservatoryCtEvents. Triggers alerts for suspicious certificates.
 *
 * Interval: 6h
 * Timeout: 30m
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
const ObservatoryCtEvents = require('#models/observatory-ct-events');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  queryCrtSh,
  processCtEntries
} = require('#helpers/observatory/check-ct-logs');
const { sendAlert } = require('#helpers/observatory/send-alert');
const {
  SUBJECT_BATCH_SIZE,
  CT_CHECK_CONCURRENCY,
  REDIS_PREFIXES,
  TTL
} = require('#config/observatory');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

let isCancelled = false;

if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Process a single domain: query crt.sh, filter new certs, store events.
 *
 * @param {Object} subject - ObservatorySubject document
 */
async function processSubject(subject) {
  if (isCancelled) return;

  try {
    // Get the last check time from Redis
    const lastCheckKey = `${REDIS_PREFIXES.ct}last:${subject.value}`;
    const lastCheckStr = await client.get(lastCheckKey);
    const since = lastCheckStr ? new Date(lastCheckStr) : null;

    // Query crt.sh for certificates
    const entries = await queryCrtSh(subject.value, {
      since,
      timeout: 30_000
    });

    if (entries.length === 0) {
      // Update last check time even if no results
      await client.set(
        lastCheckKey,
        new Date().toISOString(),
        'PX',
        TTL.ctLastCheck
      );
      return;
    }

    // Process entries into structured events
    const processed = processCtEntries(entries, subject.value);

    // Filter out certificates we've already recorded
    const newEvents = [];
    for (const event of processed) {
      if (isCancelled) break;

      const exists = await ObservatoryCtEvents.exists({
        certificate_hash: event.certificate_hash
      });

      if (!exists) {
        newEvents.push({
          subject: subject._id,
          subject_value: subject.value,
          ...event
        });
      }
    }

    // Insert new events
    if (newEvents.length > 0) {
      await ObservatoryCtEvents.insertMany(newEvents, { ordered: false });

      logger.info('CT events recorded', {
        subject: subject.value,
        newCerts: newEvents.length,
        suspicious: newEvents.filter((e) => e.is_suspicious).length
      });

      // Alert on suspicious certificates
      if (subject.is_monitored && subject.monitored_by?.length > 0) {
        const suspiciousEvents = newEvents.filter((e) => e.is_suspicious);
        for (const event of suspiciousEvents) {
          if (isCancelled) break;

          await sendAlert({
            subject,
            alertType: 'ct_suspicious_cert',
            message: `A certificate was issued for ${subject.value} by an unexpected CA: ${event.issuer}. This may indicate unauthorized certificate issuance.`,
            details: {
              issuer: event.issuer,
              san_list: event.san_list,
              not_before: event.not_before,
              not_after: event.not_after,
              certificate_hash: event.certificate_hash
            },
            client
          });
        }
      }
    }

    // Update last check time
    await client.set(
      lastCheckKey,
      new Date().toISOString(),
      'PX',
      TTL.ctLastCheck
    );
  } catch (err) {
    logger.error('Error monitoring CT logs for subject', {
      subject: subject.value,
      err
    });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    // Only monitor actively-monitored domain subjects
    const subjects = await ObservatorySubjects.find({
      type: 'domain',
      is_monitored: true
    })
      .select('_id type value is_monitored monitored_by')
      .limit(SUBJECT_BATCH_SIZE)
      .lean();

    logger.info('Observatory CT monitor starting', {
      subjectCount: subjects.length
    });

    // Process with low concurrency to avoid hammering crt.sh
    await pMap(
      subjects,
      async (subject) => {
        if (isCancelled) return;
        await processSubject(subject);
      },
      { concurrency: CT_CHECK_CONCURRENCY }
    );

    logger.info('Observatory CT monitor complete', {
      subjectCount: subjects.length
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
