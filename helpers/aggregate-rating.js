/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Our rating on Trustpilot, for the structured data (aggregateRating) and
// the line under the testimonials that shows it.
//
// `jobs/update-aggregate-rating.js` asks Trustpilot's public TrustBox data
// for our review counts once a month (it runs daily and skips while the
// stored rating is younger than that) and keeps them in Redis. Pages read
// that copy and show no rating without one.
// The average is worked out from the count of reviews for each star, so the
// rating is the reviewers' own and matches what Trustpilot shows.
//

const ms = require('ms');

const config = require('#config');
const retryRequest = require('#helpers/retry-request');

const AGGREGATE_RATING_KEY = 'aggregate_rating';

// asked again after this long
const MAX_AGE = ms('30d');

// kept this long without a new answer, then no rating is shown
const TTL = ms('90d');

// a Trustpilot page address, with nothing that could leave an HTML attribute
// (the page writes it into a link)
const TRUSTPILOT_URL = /^https:\/\/www\.trustpilot\.com\/[\w./-]+$/;

const STARS = ['oneStar', 'twoStars', 'threeStars', 'fourStars', 'fiveStars'];

/**
 * The rating in Trustpilot's TrustBox data, or null when it holds none.
 *
 * @param   {object}       data   the TrustBox data JSON
 * @returns {object|null}         { ratingValue, ratingCount, bestRating, worstRating, url }
 */
function parseTrustboxData(data) {
  const unit = data && (data.businessUnit || data.businessEntity);
  const counts = unit && unit.numberOfReviews;
  if (!counts || typeof counts !== 'object') return null;

  let ratingCount = 0;
  let total = 0;
  for (const [i, key] of STARS.entries()) {
    const count = counts[key];
    if (!Number.isSafeInteger(count) || count < 0) return null;
    ratingCount += count;
    total += count * (i + 1);
  }

  if (ratingCount === 0) return null;

  const profileUrl =
    data.links && typeof data.links.profileUrl === 'string'
      ? data.links.profileUrl
      : config.trustpilot.profileUrl;

  return {
    ratingValue: Math.round((total / ratingCount) * 10) / 10,
    ratingCount,
    bestRating: 5,
    worstRating: 1,
    url: TRUSTPILOT_URL.test(profileUrl)
      ? profileUrl
      : config.trustpilot.profileUrl
  };
}

/**
 * Ask Trustpilot for the rating.
 *
 * @param   {object}  [opts]   options passed to retry-request (a dispatcher)
 * @returns {Promise<object|null>}
 */
async function fetchAggregateRating(opts = {}) {
  const url = new URL(
    `https://widget.trustpilot.com/trustbox-data/${config.trustpilot.templateId}`
  );
  url.searchParams.set('businessUnitId', config.trustpilot.businessUnitId);
  url.searchParams.set('locale', 'en-US');
  const response = await retryRequest(url.toString(), {
    timeout: ms('30s'),
    headers: {
      Accept: 'application/json',
      'User-Agent': `${config.pkg.name}/${config.pkg.version}`
    },
    ...opts
  });
  return parseTrustboxData(await response.body.json());
}

/**
 * The stored rating, or null.
 *
 * @param   {object}  client   Redis client
 * @returns {Promise<object|null>}
 */
async function readAggregateRating(client) {
  const value = await client.get(AGGREGATE_RATING_KEY);
  if (!value) return null;
  try {
    const rating = JSON.parse(value);
    if (
      !Number.isFinite(rating.ratingValue) ||
      !Number.isSafeInteger(rating.ratingCount) ||
      rating.ratingCount <= 0
    )
      return null;
    // (only a Trustpilot address reaches the page's link)
    if (typeof rating.url !== 'string' || !TRUSTPILOT_URL.test(rating.url))
      rating.url = config.trustpilot.profileUrl;
    return rating;
  } catch {
    return null;
  }
}

/**
 * Ask Trustpilot again when the stored rating is a month old (or missing),
 * and store the answer.
 *
 * @param   {object}  client   Redis client
 * @param   {object}  [opts]   { force, now, dispatcher }
 * @returns {Promise<object|null>}   the rating now stored
 */
async function updateAggregateRating(client, opts = {}) {
  const { force = false, now = Date.now(), ...requestOpts } = opts;
  const stored = await readAggregateRating(client);
  if (
    !force &&
    stored &&
    Number.isFinite(stored.fetchedAt) &&
    now - stored.fetchedAt < MAX_AGE
  )
    return stored;

  const rating = await fetchAggregateRating(requestOpts);
  // (an answer without counts keeps the stored rating until it expires)
  if (!rating) return stored;

  const value = { ...rating, fetchedAt: now };
  await client.set(AGGREGATE_RATING_KEY, JSON.stringify(value), 'PX', TTL);
  return value;
}

/**
 * The rating for a page, or null (also when Redis cannot be read).
 *
 * @param   {object}  client   Redis client
 * @returns {Promise<object|null>}
 */
async function getAggregateRating(client) {
  try {
    return await readAggregateRating(client);
  } catch {
    return null;
  }
}

module.exports = {
  AGGREGATE_RATING_KEY,
  MAX_AGE,
  parseTrustboxData,
  fetchAggregateRating,
  readAggregateRating,
  updateAggregateRating,
  getAggregateRating
};
