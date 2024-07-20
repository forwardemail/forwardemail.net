/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const pMapSeries = require('p-map-series');
const { isURL } = require('validator');

const config = require('#config');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');

const BOOLEAN_KEYS = ['is_valid', 'is_ubuntu_coc_signer', 'is_probationary'];

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

    // validate booleans
    for (const key of BOOLEAN_KEYS) {
      if (typeof entry[key] !== 'boolean')
        throw new TypeError(`Boolean property "${key}" is missing`);
    }

    // add to set if valid
    if (
      entry.is_valid &&
      entry.is_ubuntu_coc_signer &&
      !entry.is_probationary
    ) {
      logger.debug(`adding ${entry.name}`);
      set.add(entry.name);
    }
  }
}

async function getUbuntuMembersMap() {
  const map = new Map();

  await pMapSeries(Object.keys(config.ubuntuTeamMapping), async (name) => {
    const set = new Set();
    //
    // fetch the participants for this team
    // (note the results are paginated so we use a while loop)
    //
    const url = `https://api.launchpad.net/1.0/${config.ubuntuTeamMapping[name]}/participants`;
    const response = await retryRequest(url);
    let json = await response.body.json();

    if (!Number.isFinite(json.total_size) || json.total_size < 0)
      throw new TypeError('Property "total_size" was invalid');

    // add to set
    addToSet(json.entries, set);

    let totalSize = json.total_size;
    let retrieved = json.entries.length;

    if (retrieved < totalSize) {
      if (!isURL(json.next_collection_link))
        throw new TypeError(
          'Property "next_collection_link" was not a valid URL'
        );

      // safeguard
      if (!json.next_collection_link.startsWith('https://api.launchpad.net/'))
        throw new TypeError(
          'Property "next_collection_link" is not a valid API link'
        );

      while (retrieved < totalSize) {
        logger.debug(`${name} retrieved ${retrieved}/${totalSize}`);

        if (!isURL(json.next_collection_link))
          throw new TypeError(
            'Property "next_collection_link" was not a valid URL'
          );

        // safeguard
        if (!json.next_collection_link.startsWith('https://api.launchpad.net/'))
          throw new TypeError(
            'Property "next_collection_link" is not a valid API link'
          );

        logger.debug('fetching', { url: json.next_collection_link });

        // eslint-disable-next-line no-await-in-loop
        const response = await retryRequest(json.next_collection_link);
        // eslint-disable-next-line no-await-in-loop
        json = await response.body.json();

        if (!Number.isFinite(json.total_size) || json.total_size < 0)
          throw new TypeError('Property "total_size" was invalid');

        // update total size in-memory (in case it changes)
        totalSize = json.total_size;

        // add to set
        addToSet(json.entries, set);

        // update retrieved in-memory
        retrieved += json.entries.length;
      }
    }

    logger.debug(`setting ${name}`, { set: [...set] });
    map.set(name, set);
  });

  return map;
}

module.exports = getUbuntuMembersMap;
