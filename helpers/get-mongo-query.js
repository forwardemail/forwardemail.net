/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const parser = require('mongodb-query-parser');
const { boolean } = require('boolean');

const splitSpaces = require('./split-spaces');

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
        query.$and.push({
          $or: [
            { [key]: { $regex: value, $options: 'i' } },
            { [key]: { $regex: _.escapeRegExp(value), $options: 'i' } }
          ]
        });
      }
    }

    if (hasError)
      throw Boom.badRequest(
        'Invalid search, please separate by space and use = to denote value'
      );
  }

  if (isSANB(ctx.query.mongodb_query)) {
    try {
      query = parser.parseFilter(ctx.query.mongodb_query);
      if (!query || Object.keys(query).length === 0)
        throw new Error('Query was not parsed propery');
    } catch (err) {
      ctx.logger.warn(err);
      throw Boom.badRequest(err.message);
    }
  }

  return query;
}

module.exports = getMongoQuery;
