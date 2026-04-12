/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Observatory DNS Monitor Job
 *
 * Takes periodic DNS snapshots of monitored domains, detects changes
 * in MX, SPF, DMARC, NS, A, and AAAA records, and records change
 * events in ObservatoryDnsSnapshots. Triggers alerts on significant
 * changes (NS hijacking, DMARC downgrade, SPF misconfiguration).
 *
 * Interval: 1h
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
const ObservatoryDnsSnapshots = require('#models/observatory-dns-snapshots');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const {
  takeDnsSnapshot,
  diffSnapshots
} = require('#helpers/observatory/dns-snapshot');
const { sendAlert } = require('#helpers/observatory/send-alert');
const {
  SUBJECT_BATCH_SIZE,
  DNS_MONITOR_CONCURRENCY
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

let isCancelled = false;

if (parentPort)
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });

/**
 * Determine alert type for a DNS change, if the change is significant
 * enough to warrant an alert.
 *
 * @param {Object} change - { record_type, change_type, record_data, previous_data }
 * @param {Object} snapshot - Full current DNS snapshot
 * @returns {Object|null} { alertType, message, details } or null if not alertable
 */
function classifyChange(change, snapshot) {
  const { record_type, change_type } = change;

  // NS records changed -- potential hijacking (high severity)
  if (record_type === 'NS' && change_type === 'modified') {
    return {
      alertType: 'dns_ns_changed',
      message: `NS records for this domain have changed. This could indicate a domain transfer or hijacking. Previous: ${JSON.stringify(
        change.previous_data
      )}. Current: ${JSON.stringify(change.record_data)}.`,
      details: {
        previous: change.previous_data,
        current: change.record_data
      }
    };
  }

  // MX records changed
  if (record_type === 'MX' && change_type === 'modified') {
    return {
      alertType: 'dns_mx_changed',
      message: `MX records for this domain have changed. This affects where email is delivered.`,
      details: {
        previous: change.previous_data,
        current: change.record_data
      }
    };
  }

  // DMARC policy downgraded (reject -> quarantine/none, or quarantine -> none)
  if (record_type === 'DMARC' && change_type === 'modified') {
    const prevPolicy = change.previous_data?.p || null;
    const currPolicy = change.record_data?.p || null;

    const policyRank = { reject: 3, quarantine: 2, none: 1 };
    const prevRank = policyRank[prevPolicy] || 0;
    const currRank = policyRank[currPolicy] || 0;

    if (prevRank > currRank && currRank > 0) {
      return {
        alertType: 'dns_dmarc_downgraded',
        message: `DMARC policy was downgraded from "${prevPolicy}" to "${currPolicy}". This weakens email authentication enforcement.`,
        details: {
          previous_policy: prevPolicy,
          current_policy: currPolicy
        }
      };
    }
  }

  // DMARC removed entirely
  if (record_type === 'DMARC' && change_type === 'removed') {
    return {
      alertType: 'dns_dmarc_downgraded',
      message: `DMARC record has been removed. Your domain no longer has a DMARC policy.`,
      details: {
        previous_policy: change.previous_data?.p || 'unknown',
        current_policy: 'none (removed)'
      }
    };
  }

  // SPF exceeds 10 lookups
  if (record_type === 'SPF' && snapshot.spf_lookup_count > 10) {
    return {
      alertType: 'dns_spf_misconfigured',
      message: `SPF record requires ${snapshot.spf_lookup_count} DNS lookups, exceeding the RFC 7208 limit of 10. This may cause SPF validation failures.`,
      details: {
        lookup_count: snapshot.spf_lookup_count,
        spf_record: snapshot.spf_record
      }
    };
  }

  return null;
}

/**
 * Process a single domain subject: take DNS snapshot, detect changes,
 * record events, trigger alerts.
 *
 * @param {Object} subject - ObservatorySubject document
 */
async function processSubject(subject) {
  if (isCancelled) return;

  try {
    // Take a fresh DNS snapshot
    const snapshot = await takeDnsSnapshot(subject.value, resolver);

    // Compare with the existing snapshot
    const changes = diffSnapshots(subject.dns_snapshot, snapshot);
    const now = new Date();

    // Record change events
    if (changes.length > 0) {
      const changeDocs = changes.map((change) => ({
        subject: subject._id,
        subject_value: subject.value,
        record_type: change.record_type,
        record_data: change.record_data,
        previous_data: change.previous_data,
        change_type: change.change_type,
        detected_at: now
      }));

      await ObservatoryDnsSnapshots.insertMany(changeDocs, { ordered: false });

      logger.info('DNS changes detected', {
        subject: subject.value,
        changeCount: changes.length,
        types: changes.map((c) => `${c.record_type}:${c.change_type}`)
      });

      // Check for alertable changes (only for monitored subjects)
      if (subject.is_monitored && subject.monitored_by?.length > 0) {
        for (const change of changes) {
          if (isCancelled) break;

          const alert = classifyChange(change, snapshot);
          if (alert) {
            await sendAlert({
              subject,
              alertType: alert.alertType,
              message: alert.message,
              details: alert.details,
              client
            });
          }
        }
      }
    }

    // Update the subject's DNS fields
    await ObservatorySubjects.updateOne(
      { _id: subject._id },
      {
        $set: {
          dns_snapshot: {
            MX: snapshot.MX,
            SPF: snapshot.SPF,
            DMARC: snapshot.DMARC,
            NS: snapshot.NS,
            A: snapshot.A,
            AAAA: snapshot.AAAA
          },
          dns_snapshot_at: now,
          dmarc_policy: snapshot.dmarc_policy || null,
          spf_record: snapshot.spf_record || null,
          spf_lookup_count: snapshot.spf_lookup_count || 0
        }
      }
    );
  } catch (err) {
    logger.error('Error monitoring DNS for subject', {
      subject: subject.value,
      err
    });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

    // Find domain subjects that need DNS monitoring
    const subjects = await ObservatorySubjects.find({
      type: 'domain',
      $or: [
        { is_monitored: true },
        { dns_snapshot_at: { $lt: staleThreshold } },
        { dns_snapshot_at: null }
      ]
    })
      .select('_id type value dns_snapshot is_monitored monitored_by')
      .limit(SUBJECT_BATCH_SIZE)
      .lean();

    logger.info('Observatory DNS monitor starting', {
      subjectCount: subjects.length
    });

    await pMap(
      subjects,
      async (subject) => {
        if (isCancelled) return;
        await processSubject(subject);
      },
      { concurrency: DNS_MONITOR_CONCURRENCY }
    );

    logger.info('Observatory DNS monitor complete', {
      subjectCount: subjects.length
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
