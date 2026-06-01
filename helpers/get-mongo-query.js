/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');

const assertAllowedMongoQuery = require('./assert-no-blocked-mongo-operators');
const splitSpaces = require('./split-spaces');
const _ = require('#helpers/lodash');

function getMongoQuery(ctx) {
  let query = {};

  //
  // filter based on anything
  // (trim and split by space)
  // (split by equal sign)
  // (first part is dot notation, second is value)
  //
  if (isSANB(ctx.query.q)) {
    let hasError = false;

    query.$and = [];

    for (const q of splitSpaces(ctx.query.q.trim())) {
      const [key, value] = q.split('=');

      if (!isSANB(key) || !isSANB(value)) {
        hasError = true;
        break;
      }

      // Reject any attempt to use a MongoDB operator as a field name
      if (key.startsWith('$')) {
        hasError = true;
        break;
      }

      if (value === 'true' || value === 'false') {
        query.$and.push(
          {
            [key]: boolean(value)
          },
          {
            [key]: { $exists: true }
          }
        );
      } else if (Number.isFinite(Number.parseInt(value, 10))) {
        query.$and.push(
          {
            [key]: Number.parseInt(value, 10)
          },
          {
            [key]: {
              $exists: true
            }
          }
        );
      } else {
        // TODO: $exists here
        // Always escape user input for $regex to prevent ReDoS attacks
        const escapedValue = _.escapeRegExp(value);
        query.$and.push({
          [key]: { $regex: escapedValue, $options: 'i' }
        });
      }
    }

    if (hasError)
      throw Boom.badRequest(
        'Invalid search, please separate by space and use = to denote value'
      );
  }

  //
  // FWD-01-010: Only accept mongodb_query from POST body to prevent cross-origin
  // timing attacks. GET query args are observable cross-origin via resource
  // timing or speculative execution side-channels. POST requires same-origin
  // or CORS preflight, which blocks cross-origin exfiltration attempts.
  //
  // The GET fallback has been removed entirely — mongodb_query via query string
  // is no longer accepted. Admin filter forms must use POST.
  //
  const mongodbQueryRaw =
    ctx.request.body && isSANB(ctx.request.body.mongodb_query)
      ? ctx.request.body.mongodb_query
      : null;

  if (mongodbQueryRaw) {
    try {
      query = JSON.parse(mongodbQueryRaw);
      if (
        !query ||
        typeof query !== 'object' ||
        Array.isArray(query) ||
        Object.keys(query).length === 0
      )
        throw new Error('Query was not parsed properly');
      assertAllowedMongoQuery(query);
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  return query;
}

module.exports = getMongoQuery;
