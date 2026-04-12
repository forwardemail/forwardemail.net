/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Observatory Bulk Download Job
 *
 * Downloads full IP lists from blacklists that support bulk export
 * (e.g. UCEPROTECT, Backscatterer). Reconciles downloaded IPs against
 * known ObservatorySubjects to catch listings between spot-check intervals.
 *
 * This extends the pattern of update-uceprotect.js but writes to the
 * observatory namespace instead of the SMTP denylist.
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
const Redis = require('@ladjs/redis');
const got = require('got');
const mongoose = require('mongoose');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const sharedConfig = require('@ladjs/shared-config');
const safeStringify = require('fast-safe-stringify');
const splitLines = require('split-lines');
const validator = require('@forwardemail/validator');
const { encode } = require('html-entities');
const { ungzip } = require('node-gzip');

const ObservatorySubjects = require('#models/observatory-subjects');
const ObservatoryBlacklistEvents = require('#models/observatory-blacklist-events');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { DOWNLOADABLE_LISTS, REDIS_PREFIXES } = require('#config/observatory');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});
const SEVEN_DAYS_TO_MS = ms('7d');

graceful.listen();

/**
 * Download and process a single bulk list.
 *
 * @param {Object} list - { name, prefix, url }
 */
async function mapper(list) {
  logger.info('Observatory bulk download starting', { list: list.name });

  const res = await got(list.url, {
    responseType: 'buffer',
    decompress: false,
    retry: {
      statusCodes: [...got.defaults.options.retry.statusCodes, 403, 404]
    }
  });

  if (
    res.headers['content-type'] === 'application/octet-stream' ||
    res.headers['content-encoding'] === 'gzip'
  )
    res.body = await ungzip(res.body);

  const lines = splitLines(res.body.toString());
  const ips = [];
  for (const line of lines) {
    const firstChar = line.charAt(0);
    if (['#', '!', '$', ':'].includes(firstChar)) continue;
    if (validator.isIP(line)) ips.push(line);
  }

  if (ips.length === 0) throw new Error('No IP addresses were found.');

  logger.info('Observatory bulk download parsed', {
    list: list.name,
    count: ips.length
  });

  // Store all IPs in Redis under observatory namespace with 7d TTL
  const p = client.pipeline();
  for (const ip of ips) {
    p.set(
      `${REDIS_PREFIXES.blacklist}bulk:${list.name}:${ip}`,
      'true',
      'PX',
      SEVEN_DAYS_TO_MS
    );
  }

  await p.exec();

  // Reconcile: find any monitored ObservatorySubjects in this list
  // that don't already have this list in their blacklist_summary.lists
  const ipSet = new Set(ips);
  const monitoredSubjects = await ObservatorySubjects.find({
    type: 'ip',
    is_monitored: true
  })
    .select('_id value blacklist_summary')
    .lean();

  const now = new Date();
  const newListings = [];

  for (const subject of monitoredSubjects) {
    if (!ipSet.has(subject.value)) continue;

    const currentLists = subject.blacklist_summary?.lists || [];
    if (currentLists.includes(list.name)) continue;

    // This subject is newly listed on this bulk list
    newListings.push({
      subject: subject._id,
      subject_value: subject.value,
      subject_type: 'ip',
      list_name: list.name,
      event_type: 'listed',
      detected_at: now,
      raw_response: 'bulk-download'
    });

    // Update the subject's blacklist_summary
    await ObservatorySubjects.updateOne(
      { _id: subject._id },
      {
        $addToSet: { 'blacklist_summary.lists': list.name },
        $inc: { 'blacklist_summary.listed_count': 1 },
        $set: { blacklist_summary_at: now }
      }
    );
  }

  if (newListings.length > 0) {
    await ObservatoryBlacklistEvents.insertMany(newListings, {
      ordered: false
    });
    logger.info('Observatory bulk download found new listings', {
      list: list.name,
      count: newListings.length
    });
  }

  logger.info('Observatory bulk download complete', {
    list: list.name,
    totalIps: ips.length,
    newListings: newListings.length
  });
}

(async () => {
  await setupMongoose(logger);

  try {
    await pMapSeries(DOWNLOADABLE_LISTS, mapper);
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Observatory Bulk Download had an error'
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
