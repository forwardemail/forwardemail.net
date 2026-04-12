/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Observatory Reputation Scoring Job
 *
 * Computes composite reputation scores for observatory subjects by
 * gathering blacklist status, DNS configuration quality, DMARC compliance,
 * infrastructure quality, and certificate hygiene data. Updates the
 * reputation_score and reputation_grade fields on each subject.
 *
 * Interval: 2h
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
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const pMap = require('p-map');
const Redis = require('@ladjs/redis');
const sharedConfig = require('@ladjs/shared-config');

const ObservatorySubjects = require('#models/observatory-subjects');
const ObservatoryCtEvents = require('#models/observatory-ct-events');
const Domains = require('#models/domains');
const Logs = require('#models/logs');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const computeReputationScore = require('#helpers/observatory/compute-reputation-score');
const enrichIp = require('#helpers/observatory/enrich-ip');
const createTangerine = require('#helpers/create-tangerine');
const { nsProviderLookup } = require('#config/utilities');
const { SUBJECT_BATCH_SIZE } = require('#config/observatory');

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
 * Get DMARC compliance data for a domain from the Logs collection.
 * Aggregates the most recent 30 days of DMARC reports.
 *
 * @param {string} domainName - Domain to check
 * @returns {Promise<Object|null>} { spf_aligned_pct, dkim_aligned_pct } or null
 */
async function getDmarcCompliance(domainName) {
  try {
    // Find the domain in the Domains collection
    const domain = await Domains.findOne({ name: domainName })
      .select('_id')
      .lean();

    if (!domain) return null;

    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();

    // Aggregate DMARC report stats for this domain
    const pipeline = [
      {
        $match: {
          is_dmarc_report: true,
          domains: domain._id,
          created_at: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total_messages: {
            $sum: {
              $ifNull: ['$meta.dmarc_report.summary.total_messages', 0]
            }
          },
          spf_aligned: {
            $sum: { $ifNull: ['$meta.dmarc_report.summary.spf_aligned', 0] }
          },
          dkim_aligned: {
            $sum: { $ifNull: ['$meta.dmarc_report.summary.dkim_aligned', 0] }
          }
        }
      }
    ];

    const results = await Logs.aggregate(pipeline, {
      hint: { is_dmarc_report: 1, domains: 1, created_at: -1 },
      allowDiskUse: true
    });

    if (!results || results.length === 0 || results[0].total_messages === 0) {
      return null;
    }

    const { total_messages, spf_aligned, dkim_aligned } = results[0];

    return {
      spf_aligned_pct: Math.round((spf_aligned / total_messages) * 1000) / 10,
      dkim_aligned_pct: Math.round((dkim_aligned / total_messages) * 1000) / 10
    };
  } catch (err) {
    logger.debug('Failed to get DMARC compliance', {
      domain: domainName,
      error: err.message
    });
    return null;
  }
}

/**
 * Get infrastructure quality data for a subject.
 *
 * @param {Object} subject - ObservatorySubject document
 * @returns {Promise<Object>} Infrastructure quality inputs for scoring
 */
async function getInfrastructureData(subject) {
  const infra = {
    ns_provider_slug: null,
    a_records: [],
    has_ptr: false
  };

  if (subject.type === 'domain' && subject.dns_snapshot) {
    // Extract A records
    infra.a_records = subject.dns_snapshot.A || [];

    // Determine NS provider using existing utility
    if (subject.dns_snapshot.NS && subject.dns_snapshot.NS.length > 0) {
      try {
        const provider = nsProviderLookup({
          ns: subject.dns_snapshot.NS,
          name: subject.value
        });
        if (provider && provider.slug) {
          infra.ns_provider_slug = provider.slug;
        }
      } catch {
        // nsProviderLookup may throw for unusual NS records
      }
    }
  } else if (subject.type === 'ip') {
    // For IPs, check PTR record
    try {
      const ptrRecords = await resolver.reverse(subject.value);
      infra.has_ptr = Array.isArray(ptrRecords) && ptrRecords.length > 0;
    } catch {
      infra.has_ptr = false;
    }

    // Enrich with ASN data if not already present
    if (!subject.asn) {
      const enrichment = await enrichIp(subject.value, resolver, client);
      if (enrichment.asn) {
        await ObservatorySubjects.updateOne(
          { _id: subject._id },
          {
            $set: {
              asn: enrichment.asn,
              asn_org: enrichment.asn_org,
              country_code: enrichment.country_code
            }
          }
        );
      }
    }
  }

  return infra;
}

/**
 * Get CT event summary for a subject.
 *
 * @param {mongoose.Types.ObjectId} subjectId
 * @returns {Promise<Object>} { suspicious_count }
 */
async function getCtSummary(subjectId) {
  try {
    const suspiciousCount = await ObservatoryCtEvents.countDocuments({
      subject: subjectId,
      is_suspicious: true,
      detected_at: { $gte: dayjs().subtract(90, 'day').toDate() }
    });

    return { suspicious_count: suspiciousCount };
  } catch {
    return { suspicious_count: 0 };
  }
}

/**
 * Process a single subject: gather inputs and compute score.
 *
 * @param {Object} subject - ObservatorySubject document
 */
async function processSubject(subject) {
  if (isCancelled) return;

  try {
    // Build blacklist results from stored summary
    const blacklistResults = [];
    if (subject.blacklist_summary) {
      const listedSet = new Set(subject.blacklist_summary.lists || []);
      // Reconstruct results with weights from the config
      const { DNSBL_LISTS } = require('#config/observatory');
      for (const list of DNSBL_LISTS) {
        if (list.type === subject.type) {
          blacklistResults.push({
            list_name: list.name,
            is_listed: listedSet.has(list.name),
            weight: list.weight
          });
        }
      }
    }

    // Get DMARC compliance (only for domains)
    const dmarcCompliance =
      subject.type === 'domain'
        ? await getDmarcCompliance(subject.value)
        : null;

    // Get infrastructure data
    const infrastructure = await getInfrastructureData(subject);

    // Get CT summary (only for domains)
    const ctSummary =
      subject.type === 'domain' ? await getCtSummary(subject._id) : null;

    // Compute score
    const { score, grade, breakdown } = computeReputationScore({
      blacklistResults,
      dnsSnapshot: subject.dns_snapshot || null,
      dmarcCompliance,
      infrastructure,
      ctSummary,
      subjectType: subject.type
    });

    // Update the subject
    await ObservatorySubjects.updateOne(
      { _id: subject._id },
      {
        $set: {
          reputation_score: score,
          reputation_grade: grade,
          last_scored_at: new Date()
        }
      }
    );

    logger.debug('Reputation score computed', {
      subject: subject.value,
      type: subject.type,
      score,
      grade,
      breakdown
    });
  } catch (err) {
    logger.error('Error computing reputation score', {
      subject: subject.value,
      type: subject.type,
      err
    });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    const staleThreshold = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2h ago

    // Find subjects that need scoring:
    // - score is null (never scored)
    // - last_scored_at is stale (> 2h)
    const subjects = await ObservatorySubjects.find({
      $or: [
        { reputation_score: null },
        { last_scored_at: null },
        { last_scored_at: { $lt: staleThreshold } }
      ]
    })
      .select(
        '_id type value dns_snapshot blacklist_summary asn asn_org is_monitored'
      )
      .limit(SUBJECT_BATCH_SIZE)
      .lean();

    logger.info('Observatory scoring starting', {
      subjectCount: subjects.length
    });

    await pMap(
      subjects,
      async (subject) => {
        if (isCancelled) return;
        await processSubject(subject);
      },
      { concurrency: 10 }
    );

    logger.info('Observatory scoring complete', {
      subjectCount: subjects.length
    });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
