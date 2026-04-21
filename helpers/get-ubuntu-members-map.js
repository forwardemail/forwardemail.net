/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const pMapSeries = require('p-map-series');
const pRetry = require('p-retry');
const { isURL } = require('@forwardemail/validator');
const _ = require('#helpers/lodash');

const config = require('#config');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const retryLaunchpadRequest = require('#helpers/retry-launchpad-request');

const { LAUNCHPAD_ADDRESS_FAMILY } = retryLaunchpadRequest;

const PAGE_RETRIES = 2;

// const BOOLEAN_KEYS = ['is_valid', 'is_ubuntu_coc_signer'];

function addToSet(entries, set) {
  if (!_.isArray(entries))
    throw new TypeError('Property "entries" was not an Array');

  // return early if there were none
  if (entries.length === 0) return;

  // validate every entry
  for (const entry of entries) {
    if (!_.isObject(entry))
      throw new TypeError('Entry in "entries" was not an Object');
    if (!isSANB(entry.name))
      throw new TypeError('Entry in "entries" was missing "name" property');

    /*
    // validate booleans
    for (const key of BOOLEAN_KEYS) {
      if (typeof entry[key] !== 'boolean')
        throw new TypeError(`Boolean property "${key}" is missing`);
    }

    // add to set if valid
    if (
      entry.is_valid &&
      entry.is_ubuntu_coc_signer
      // we do not need to check for is_probationary, see `helpers/sync-ubuntu-user.js`
      // !entry.is_probationary
    ) {
      logger.debug(`adding ${entry.name}`);
      set.add(entry.name);
    }
    */
    set.add(entry.name);
  }
}

async function fetchPage(url, name, pageCount) {
  return pRetry(() => retryLaunchpadRequest(url), {
    retries: PAGE_RETRIES,
    async onFailedAttempt(err) {
      if (!isRetryableError(err)) throw err;

      await logger.warn(`${name} page ${pageCount} fetch failed, retrying`, {
        err,
        url,
        attemptNumber: err.attemptNumber,
        retriesLeft: err.retriesLeft,
        launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
      });
    }
  });
}

async function getUbuntuMembersMap() {
  const map = new Map();

  // set a date so we can use it for cache checks
  map[Symbol.for('createdAt')] = new Date();

  await pMapSeries(Object.keys(config.ubuntuTeamMapping), async (name) => {
    const set = new Set();
    const teamPath = config.ubuntuTeamMapping[name];
    const totalSizes = new Set();
    const seenUrls = new Set();

    // Initialize pagination variables
    let url = `https://api.launchpad.net/1.0/${teamPath}/participants`;
    let totalProcessed = 0;
    let pageCount = 0;
    const maxPages = 1000; // Safety limit to prevent infinite loops

    logger.debug(`starting ubuntu membership fetch for ${name}`, {
      team: name,
      teamPath,
      url,
      launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
    });

    // Paginate through all results using next_collection_link
    while (url && pageCount < maxPages) {
      const currentUrl = url;
      if (seenUrls.has(currentUrl)) {
        const err = new TypeError('Property "next_collection_link" repeated');
        err.team = name;
        err.teamPath = teamPath;
        err.pageCount = pageCount;
        err.totalProcessed = totalProcessed;
        err.url = currentUrl;
        throw err;
      }

      seenUrls.add(currentUrl);
      pageCount++;
      logger.debug(`${name} fetching page ${pageCount}`, {
        team: name,
        teamPath,
        pageCount,
        totalProcessed,
        url: currentUrl,
        launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
      });

      try {
        const response = await fetchPage(currentUrl, name, pageCount);
        const json = await response.body.json();

        if (!Number.isFinite(json.total_size) || json.total_size < 0)
          throw new TypeError('Property "total_size" was invalid');

        totalSizes.add(json.total_size);

        // Add entries from current page
        addToSet(json.entries, set);
        totalProcessed += json.entries.length;

        // Check if there's a next page
        if (json.next_collection_link && isURL(json.next_collection_link)) {
          // Safeguard - ensure it's a valid Launchpad API URL
          if (
            !json.next_collection_link.startsWith('https://api.launchpad.net/')
          )
            throw new TypeError(
              'Property "next_collection_link" is not a valid API link'
            );

          url = json.next_collection_link;
        } else {
          url = null; // No more pages
        }

        logger.debug(`${name} page ${pageCount} fetched`, {
          team: name,
          teamPath,
          pageCount,
          entries: json.entries.length,
          totalProcessed,
          totalSize: json.total_size,
          nextCollectionLink: url,
          uniqueMembers: set.size,
          launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
        });
      } catch (err) {
        err.team = name;
        err.teamPath = teamPath;
        err.pageCount = pageCount;
        err.totalProcessed = totalProcessed;
        err.url = currentUrl;
        err.isRetryable = isRetryableError(err);
        throw err;
      }
    }

    // Warn if we hit the safety limit
    if (pageCount >= maxPages) {
      await logger.warn(
        `${name} hit maximum page limit (${maxPages}), may have incomplete data`
      );
    }

    if (totalSizes.size > 1) {
      await logger.warn(`${name} total_size changed during pagination`, {
        team: name,
        teamPath,
        totalSizes: [...totalSizes],
        pages: pageCount,
        totalProcessed,
        uniqueMembers: set.size
      });
    }

    logger.debug(`${name} completed ubuntu membership fetch`, {
      team: name,
      teamPath,
      totalProcessed,
      uniqueMembers: set.size,
      pages: pageCount,
      totalSizes: [...totalSizes],
      launchpadAddressFamily: LAUNCHPAD_ADDRESS_FAMILY
    });
    map.set(name, set);
  });

  // if the map was completely empty then it's an error
  if (map.size === 0) throw new TypeError('Map size was empty');

  return map;
}

module.exports = getUbuntuMembersMap;
