/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const pMapSeries = require('p-map-series');
const { isURL } = require('@forwardemail/validator');
const _ = require('#helpers/lodash');

const config = require('#config');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');

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

async function getUbuntuMembersMap(resolver) {
  const map = new Map();

  // set a date so we can use it for cache checks
  map[Symbol.for('createdAt')] = new Date();

  await pMapSeries(Object.keys(config.ubuntuTeamMapping), async (name) => {
    const set = new Set();

    // Initialize pagination variables
    let url = `https://api.launchpad.net/1.0/${config.ubuntuTeamMapping[name]}/participants`;
    let totalProcessed = 0;
    let pageCount = 0;
    const maxPages = 1000; // Safety limit to prevent infinite loops

    // Paginate through all results using next_collection_link
    while (url && pageCount < maxPages) {
      pageCount++;
      logger.debug(
        `${name} fetching page ${pageCount}, processed ${totalProcessed} entries`
      );

      // eslint-disable-next-line no-await-in-loop
      const response = await retryRequest(url, { resolver });
      // eslint-disable-next-line no-await-in-loop
      const json = await response.body.json();

      if (!Number.isFinite(json.total_size) || json.total_size < 0)
        throw new TypeError('Property "total_size" was invalid');

      // Add entries from current page
      addToSet(json.entries, set);
      totalProcessed += json.entries.length;

      // Check if there's a next page
      if (json.next_collection_link && isURL(json.next_collection_link)) {
        // Safeguard - ensure it's a valid Launchpad API URL
        if (!json.next_collection_link.startsWith('https://api.launchpad.net/'))
          throw new TypeError(
            'Property "next_collection_link" is not a valid API link'
          );

        url = json.next_collection_link;
      } else {
        url = null; // No more pages
      }

      // Log progress and detect total_size changes
      logger.debug(
        `${name} page ${pageCount}: processed ${json.entries.length} entries, total: ${totalProcessed}, API total_size: ${json.total_size}`
      );
    }

    // Warn if we hit the safety limit
    if (pageCount >= maxPages) {
      logger.warn(
        `${name} hit maximum page limit (${maxPages}), may have incomplete data`
      );
    }

    logger.debug(
      `${name} completed: ${totalProcessed} total entries processed across ${pageCount} pages`
    );
    map.set(name, set);
  });

  // if the map was completely empty then it's an error
  if (map.size === 0) throw new TypeError('Map size was empty');

  return map;
}

module.exports = getUbuntuMembersMap;
