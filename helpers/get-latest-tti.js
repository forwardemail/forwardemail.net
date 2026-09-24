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

module.exports = {
  getLatestTti,
  hasHealthyTti
};
