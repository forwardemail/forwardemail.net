/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { setTimeout } = require('node:timers/promises');

const ms = require('ms');

const TTI = require('#models/tti');

const TTI_TIMEOUT = ms('10s');
const TTI_HEALTHY_MAX_MS = ms('10s');
const TTI_CACHE_MAX_AGE = ms('30s');

let latestTti;
let latestTtiExpiresAt = 0;
let latestTtiRequest;

function hasHealthyTti(tti) {
  return Boolean(
    tti &&
      Array.isArray(tti.providers) &&
      tti.providers.length > 0 &&
      tti.providers.every(
        (provider) =>
          Number.isFinite(provider.directMs) &&
          Number.isFinite(provider.forwardingMs) &&
          provider.directMs > 0 &&
          provider.forwardingMs > 0 &&
          provider.directMs <= TTI_HEALTHY_MAX_MS &&
          provider.forwardingMs <= TTI_HEALTHY_MAX_MS
      )
  );
}

async function getLatestTtiSample() {
  if (latestTtiExpiresAt > Date.now()) return latestTti;

  if (latestTtiRequest) return latestTtiRequest;

  latestTtiRequest = Promise.race([
    TTI.findOne().sort({ created_at: -1 }).lean(),
    // The database query normally wins this race.  Do not leave the safety
    // timeout holding a short-lived renderer or test process open afterwards.
    setTimeout(TTI_TIMEOUT, null, { ref: false })
  ]);

  try {
    latestTti = await latestTtiRequest;
    latestTtiExpiresAt = Date.now() + TTI_CACHE_MAX_AGE;
    return latestTti;
  } finally {
    latestTtiRequest = undefined;
  }
}

async function getLatestTti({ includeHistory = false } = {}) {
  const tti = await getLatestTtiSample();

  if (!includeHistory || !tti) return { tti, ttiChartData: null };

  const twentyFourHoursAgo = new Date(Date.now() - ms('24h'));
  const ttiChartData = await Promise.race([
    TTI.find({
      created_at: { $gte: twentyFourHoursAgo }
    })
      .sort({ created_at: 1 })
      .lean(),
    // A slow history query must not prevent the current summary, navigation,
    // or the rest of the dedicated dashboard from rendering.
    setTimeout(TTI_TIMEOUT, [], { ref: false })
  ]);

  return { tti, ttiChartData };
}

//
// Summary embeds (home and pricing pages).
//
// The embed only shows a healthy sample, and the job writes a sample whenever
// it runs, including runs where a provider timed out (0) or ran slow (>10s).
// Showing only the *newest* sample made the section vanish from the home
// page whenever the latest run had a single bad provider. The summary now
// shows the most recent healthy sample from the past 24 hours; its "Last
// updated" time is rendered from the sample, so it stays accurate.
//
// It is also served stale-while-revalidate: the home page never waits on the
// logs database once a value is cached (a refresh runs in the background),
// and the very first request waits at most SUMMARY_FIRST_WAIT.
//
const SUMMARY_WINDOW = ms('24h');
const SUMMARY_FIRST_WAIT = ms('1s');

let summaryTti;
let summaryExpiresAt = 0;
let summaryLoaded = false;
let summaryRequest;

function refreshSummaryTti() {
  if (summaryRequest) return summaryRequest;
  summaryRequest = Promise.race([
    TTI.find({ created_at: { $gte: new Date(Date.now() - SUMMARY_WINDOW) } })
      .sort({ created_at: -1 })
      .limit(100)
      .lean(),
    setTimeout(TTI_TIMEOUT, null, { ref: false })
  ])
    .then((samples) => {
      // a timed out query keeps the previous value
      if (Array.isArray(samples)) {
        summaryTti = samples.find((sample) => hasHealthyTti(sample)) || null;
        summaryLoaded = true;
        summaryExpiresAt = Date.now() + TTI_CACHE_MAX_AGE;
      }

      return summaryTti;
    })
    .finally(() => {
      summaryRequest = undefined;
    });
  return summaryRequest;
}

async function getSummaryTti() {
  if (summaryLoaded) {
    if (summaryExpiresAt <= Date.now()) refreshSummaryTti().catch(() => {});
    return summaryTti;
  }

  return Promise.race([
    refreshSummaryTti(),
    setTimeout(SUMMARY_FIRST_WAIT, null, { ref: false })
  ]);
}

module.exports = {
  getLatestTti,
  getSummaryTti,
  hasHealthyTti
};
