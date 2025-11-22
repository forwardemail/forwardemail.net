/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Database = require('better-sqlite3-multiple-ciphers');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const pRetry = require('p-retry');
const safeStringify = require('fast-safe-stringify');
const { Builder } = require('json-sql-enhanced');
const { boolean } = require('boolean');

const _ = require('#helpers/lodash');
const config = require('#config');
const env = require('#config/env');
const isRetryableError = require('#helpers/is-retryable-error');
const logger = require('#helpers/logger');
const recursivelyParse = require('#helpers/recursively-parse');

const builder = new Builder();

// override to prevent developer accidentally using mongo
// (except for a few methods)
const RESTRICTED_STATICS = [
  '$where',
  'aggregate',
  'applyDefaults',
  'bulkSave',
  'bulkWrite',
  'castObject',
  'cleanIndexes',
  'count',
  'countDocuments',
  // 'create',
  'createCollection',
  'createIndexes',
  'deleteMany',
  'deleteOne',
  'diffIndexes',
  'discriminator',
  'distinct',
  'ensureIndexes',
  'estimatedDocumentCount',
  'exists',
  'find',
  'findById',
  'findByIdAndDelete',
  'findByIdAndRemove',
  'findByIdAndUpdate',
  'findOne',
  'findOneAndDelete',
  'findOneAndRemove',
  'findOneAndReplace',
  'findOneAndUpdate',
  'hydrate',
  // required method
  // 'init',
  'insertMany',
  'inspect',
  'listIndexes',
  'populate',
  'replaceOne',
  'startSession',
  'syncIndexes',
  'translateAliases',
  'updateMany',
  'updateOne',
  // required method
  // 'validate',
  'watch',
  'where'
];

const RESTRICTED_METHODS = [
  // '$model',
  'deleteOne',
  'increment'
  // 'model',
  // 'save',
  // '$save'
];

function noop(fnName) {
  return function (...args) {
    const err = new TypeError(
      `This model is dummy proofed from Mongoose "${fnName}()" usage and is to be used with SQLite only`
    );
    err.args = JSON.parse(safeStringify(args));
    throw err;
  };
}

// TODO: save(), find() etc all these methods need timeout wrapped around (?)
// maybe we want to rewrite the usage of these on
// a case by case basis instead of writing this out

// TODO: support `multi: true` option for this function (and rewrite IMAP helpers to leverage it)
// eslint-disable-next-line max-params
async function updateMany(
  instance,
  session,
  filter = {},
  update = {},
  options = {}
) {
  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

  // only support limited `options` keys (add more as we go)
  {
    const keys = Object.keys(options);
    for (const key of keys) {
      if (keys.filter((k) => k === key).length > 1)
        throw new TypeError('Only one of each type is supported');
      if (key !== 'returnDocument')
        throw new TypeError(`Key type ${key} is not yet supported`);
      if (
        key === 'returnDocument' &&
        !['before', 'after'].includes(options[key])
      )
        throw new TypeError(
          `returnDocument must be "before" or "after" and it was "${options[key]}"`
        );
    }
  }

  {
    const keys = Object.keys(filter);
    for (const key of keys) {
      if (key.startsWith('$') && key !== '$or')
        throw new TypeError(`Key ${key} is not supported in updateMany`);
    }
  }

  let condition = {};

  if (filter.$or) {
    condition = {
      $or: filter.$or.map((v) => prepareQuery(mapping, v))
    };
  } else {
    condition = prepareQuery(mapping, filter);
  }

  let beforeDocs = [];

  let docs;
  let err;

  try {
    if (options?.returnDocument !== 'after') {
      const sql = builder.build({
        type: 'select',
        table,
        condition
      });

      if (instance.wsp) {
        beforeDocs = await instance.wsp.request(
          {
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['all', sql.values]
            ]
          },
          0
        );
      } else {
        beforeDocs = session.db.prepare(sql.query).all(sql.values);
      }
    }

    // only support limited `update` keys (add more as we go)
    {
      const keys = Object.keys(update);
      if (keys.length === 0)
        throw new TypeError('At least one update condition is required');

      // <https://github.com/2do2go/json-sql/blob/4be018c0662dacba06ddf033d18e71ebf93ee7c3/docs/README.md?plain=1#L989>
      for (const key of keys) {
        if (keys.filter((k) => k === key).length > 1)
          throw new TypeError('Only one of each type is supported');

        if (key !== '$set' && key !== '$inc')
          throw new TypeError('Only $set and $inc are supported');

        if (key === '$set') update[key] = prepareQuery(mapping, update[key]);
      }

      const sql = builder.build({
        type: 'update',
        table,
        condition,
        modifier: update,
        returning: ['*']
      });

      if (session.db.readonly) {
        docs = await instance.wsp.request(
          {
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['all', sql.values]
            ],
            checkpoint: 'PASSIVE'
          },
          0
        );
      } else {
        docs = session.db.prepare(sql.query).all(sql.values);
        try {
          session.db.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          logger.warn(err);
        }
      }
    }
  } catch (_err) {
    err = _err;
  }

  // throw error if any
  if (err) throw err;

  if (options?.returnDocument === 'after')
    return docs.map((doc) => syncConvertResult(this, doc));

  return beforeDocs.map((doc) => syncConvertResult(this, doc));
}

async function countDocuments(instance, session, filter = {}) {
  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

  // <https://marc.info/?l=sqlite-users&m=112679232205850>
  const expression = 'count(*)';
  const sql = builder.build({
    type: 'select',
    table,
    condition: prepareQuery(mapping, filter),
    fields: [
      {
        expression
      }
    ]
  });

  let result;
  if (instance.wsp) {
    result = await instance.wsp.request(
      {
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', sql.query],
          ['get', sql.values]
        ]
      },
      0
    );
  } else {
    result = session.db.prepare(sql.query).get(sql.values);
  }

  if (typeof result !== 'object' || typeof result[expression] !== 'number')
    throw new TypeError('Invalid result');
  return result[expression];
}

// NOTE: this does not support `prepareQuery` so you will need to convert _id -> id

async function deleteMany(instance, session, condition = {}, options = {}) {
  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

  if (!_.isEmpty(options)) throw new TypeError('No options supported');

  const sql = builder.build({
    type: 'remove',
    table,
    condition: prepareQuery(mapping, condition)
  });

  let result;
  let err;
  try {
    // use websockets if readonly
    if (session.db.readonly) {
      result = await instance.wsp.request(
        {
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', sql.query],
            ['run', sql.values]
          ],
          checkpoint: 'PASSIVE'
        },
        0
      );
    } else {
      result = session.db.prepare(sql.query).run(sql.values);
      try {
        session.db.pragma('wal_checkpoint(PASSIVE)');
      } catch (err) {
        logger.warn(err);
      }
    }
  } catch (_err) {
    err = _err;
  }

  // throw error if any
  if (err) throw err;

  if (typeof result?.changes !== 'number')
    throw new TypeError('Result should be a number');
  return { deletedCount: result.changes };
}

async function deleteOne(instance, session, conditions = {}, options = {}) {
  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;

  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

  if (!_.isEmpty(options)) {
    throw new TypeError('Options not yet supported');
  }

  const doc = await findOne.call(
    this,
    instance,
    session,
    conditions,
    {},
    options
  );

  if (!doc) return { deletedCount: 0 };

  const sql = builder.build({
    type: 'remove',
    table,
    condition: prepareQuery(mapping, conditions)
  });

  let result;
  let err;
  try {
    // use websockets if readonly
    if (session.db.readonly) {
      result = await instance.wsp.request(
        {
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', sql.query],
            ['run', sql.values]
          ],
          checkpoint: 'PASSIVE'
        },
        0
      );
    } else {
      result = session.db.prepare(sql.query).run(sql.values);
      try {
        session.db.pragma('wal_checkpoint(PASSIVE)');
      } catch (err) {
        logger.warn(err);
      }
    }
  } catch (_err) {
    err = _err;
  }

  // throw error if any
  if (err) throw err;

  if (typeof result?.changes !== 'number')
    throw new TypeError('Result should be a number');
  return { deletedCount: result.changes };
}

// eslint-disable-next-line max-params
async function find(
  instance,
  session,
  filter = {},
  projections = {},
  options = {}
) {
  if (
    !_.isEmpty(options) &&
    !Object.keys(options).every(
      (key) => key === 'sort' || key === 'limit' || key === 'offset'
    )
  )
    throw new TypeError('Only sort, limit, and offset options supported');

  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string') {
    const err = new TypeError('Session user and password missing');
    err.session = session;
    throw err;
  }

  const condition = prepareQuery(mapping, filter);

  const opts = {
    type: 'select',
    table,
    condition
  };

  const fields = [];
  for (const key of Object.keys(projections)) {
    if (projections[key] === true) fields.push(key);
  }

  if (!_.isEmpty(projections) && projections._id !== false) fields.push('_id');

  if (!_.isEmpty(fields)) opts.fields = fields;

  // sort support
  if (options.sort) opts.sort = options.sort;

  // limit support
  if (options.limit) {
    if (Number.isFinite(options.limit) && Number.isInteger(options.limit))
      opts.limit = options.limit;
    else throw new TypeError('Limit must be a finite integer');
  }

  // offset support
  if (options.offset) {
    if (Number.isFinite(options.offset) && Number.isInteger(options.offset))
      opts.offset = options.offset;
    else throw new TypeError('Offset must be a finite integer');
  }

  const sql = builder.build(opts);

  let docs;
  if (instance.wsp) {
    docs = await instance.wsp.request(
      {
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', sql.query],
          ['all', sql.values]
        ]
      },
      0
    );
  } else {
    docs = session.db.prepare(sql.query).all(sql.values);
  }

  if (!Array.isArray(docs)) throw new TypeError('Docs should be an Array');
  if (docs.length === 0) return [];
  const results = await Promise.all(
    docs.map((doc) => convertResult(this, doc, projections))
  );
  return results;
}

// eslint-disable-next-line max-params
async function findAndCount(
  instance,
  session,
  filter = {},
  projections = {},
  options = {}
) {
  if (
    !_.isEmpty(options) &&
    !Object.keys(options).every(
      (key) => key === 'sort' || key === 'limit' || key === 'offset'
    )
  )
    throw new TypeError('Only sort, limit, and offset options supported');

  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string') {
    const err = new TypeError('Session user and password missing');
    err.session = session;
    throw err;
  }

  const condition = prepareQuery(mapping, filter);

  // Build the count subquery
  const countSql = builder.build({
    type: 'select',
    table,
    condition,
    fields: [{ expression: 'COUNT(*)' }]
  });

  // Build the main query with count as a subquery field
  const opts = {
    type: 'select',
    table,
    condition
  };

  const fields = [];
  for (const key of Object.keys(projections)) {
    if (projections[key] === true) fields.push(key);
  }

  if (!_.isEmpty(projections) && projections._id !== false) fields.push('_id');

  if (!_.isEmpty(fields)) {
    opts.fields = [...fields];
  } else {
    opts.fields = ['*'];
  }

  // Add the count subquery as a field
  opts.fields.push({
    expression: `(${countSql.query})`,
    alias: 'total_count'
  });

  // sort support
  if (options.sort) opts.sort = options.sort;

  // limit support
  if (options.limit) {
    if (Number.isFinite(options.limit) && Number.isInteger(options.limit))
      opts.limit = options.limit;
    else throw new TypeError('Limit must be a finite integer');
  }

  // offset support
  if (options.offset) {
    if (Number.isFinite(options.offset) && Number.isInteger(options.offset))
      opts.offset = options.offset;
    else throw new TypeError('Offset must be a finite integer');
  }

  const sql = builder.build(opts);

  let docs;
  if (instance.wsp) {
    docs = await instance.wsp.request(
      {
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', sql.query],
          ['all', sql.values]
        ]
      },
      0
    );
  } else {
    docs = session.db.prepare(sql.query).all(sql.values);
  }

  if (!Array.isArray(docs)) throw new TypeError('Docs should be an Array');

  // Extract count - if no results, we need to run count query separately
  let count = 0;
  if (docs.length > 0) {
    count = docs[0].total_count;
    // Remove total_count from all docs
    for (const doc of docs) {
      delete doc.total_count;
    }
  } else {
    // No results from main query, but we still need the count
    // Run the count query separately
    let countResult;
    if (instance.wsp) {
      countResult = await instance.wsp.request(
        {
          action: 'stmt',
          session: { user: session.user },
          stmt: [
            ['prepare', countSql.query],
            ['get', countSql.values]
          ]
        },
        0
      );
    } else {
      countResult = session.db.prepare(countSql.query).get(countSql.values);
    }

    if (countResult && typeof countResult['COUNT(*)'] === 'number') {
      count = countResult['COUNT(*)'];
    }
  }

  if (docs.length === 0) return { results: [], count };

  const results = await Promise.all(
    docs.map((doc) => convertResult(this, doc, projections))
  );

  return { results, count };
}

// eslint-disable-next-line max-params
async function findById(
  instance,
  session,
  _id,
  projections = {},
  options = {}
) {
  return findOne.call(this, instance, session, { _id }, projections, options);
}

// eslint-disable-next-line max-params
async function findOne(
  instance,
  session,
  conditions = {},
  projections = {},
  options = {}
) {
  {
    const keys = Object.keys(options);
    for (const key of keys) {
      if (keys.filter((k) => k === key).length > 1)
        throw new TypeError('Only one of each type is supported');
      if (key === 'returnDocument') continue;
      if (key === 'projection') {
        projections = options.projection;
        delete options.projection;
        continue;
      }

      throw new TypeError(`Option of ${key} is not yet supported`);
    }
  }

  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

  const condition = prepareQuery(mapping, conditions);

  const opts = {
    type: 'select',
    table,
    condition
  };

  const fields = [];
  for (const key of Object.keys(projections)) {
    if (boolean(projections[key])) fields.push(key);
  }

  if (!_.isEmpty(projections) && [-1, false].includes(projections._id))
    fields.push('_id');

  if (!_.isEmpty(fields)) opts.fields = fields;

  const sql = builder.build(opts);

  let doc;

  if (instance.wsp) {
    doc = await instance.wsp.request(
      {
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', sql.query],
          ['get', sql.values]
        ]
      },
      0
    );
  } else {
    doc = session.db.prepare(sql.query).get(sql.values);
  }

  if (!doc) return null;
  doc = await convertResult(this, doc, projections);
  return doc;
}

async function $__handleSave(options = {}, fn) {
  try {
    const table =
      this?.collection?.modelName || this?.constructor?.collection?.modelName;
    if (!isSANB(table)) throw new TypeError('Table name missing');
    const mapping = this?.mapping || this?.constructor?.mapping;
    if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
    if (
      !this.session?.db ||
      (!(this.session.db instanceof Database) && !this.instance.wsp)
    )
      throw new TypeError('Database is missing');

    if (!this?.instance?.wsp && this?.instance?.constructor?.name !== 'SQLite')
      throw new TypeError('WebSocketAsPromised instance required');

    if (typeof this?.session?.user?.password !== 'string')
      throw new TypeError('Session user and password missing');

    if (!_.isEmpty(options)) {
      throw new TypeError('Options not yet supported');
    }

    // validate doc (since pre hooks don't seem to be working)
    await this.validate();

    const values = prepareQuery(mapping, this);

    let err;
    let doc;

    try {
      if (this.isNew) {
        const sql = builder.build({
          type: 'insert',
          table,
          values,
          returning: ['*']
        });

        // use websockets if readonly
        if (this.session.db.readonly) {
          doc = await this.instance.wsp.request(
            {
              action: 'stmt',
              session: { user: this.session.user },
              stmt: [
                ['prepare', sql.query],
                ['get', sql.values]
              ],
              checkpoint: 'PASSIVE'
            },
            0
          );
        } else {
          doc = this.session.db.prepare(sql.query).get(sql.values);
          try {
            this.session.db.pragma('wal_checkpoint(PASSIVE)');
          } catch (err) {
            logger.warn(err);
          }
        }
      } else {
        const sql = builder.build({
          type: 'update',
          table,
          condition: {
            _id: this._id.toString()
          },
          modifier: values,
          returning: ['*']
        });
        // use websockets if readonly
        if (this.session.db.readonly) {
          doc = await this.instance.wsp.request(
            {
              action: 'stmt',
              session: { user: this.session.user },
              stmt: [
                ['prepare', sql.query],
                ['get', sql.values]
              ],
              checkpoint: 'PASSIVE'
            },
            0
          );
        } else {
          doc = this.session.db.prepare(sql.query).get(sql.values);
          try {
            this.session.db.pragma('wal_checkpoint(PASSIVE)');
          } catch (err) {
            logger.warn(err);
          }
        }
      }
    } catch (_err) {
      err = _err;
    }

    // throw error if any
    if (err) throw err;

    if (!doc) throw new TypeError('Document failed to save');
    doc = syncConvertResult(this.constructor, doc);
    fn(null, doc);
  } catch (err) {
    fn(err);
  }
}

// eslint-disable-next-line max-params
async function findByIdAndUpdate(
  instance,
  session,
  _id,
  update = {},
  options = {}
) {
  return findOneAndUpdate.call(
    this,
    instance,
    session,
    { _id },
    update,
    options
  );
}

// TODO: handle projection from `options` (?)
// eslint-disable-next-line max-params
async function findOneAndUpdate(
  instance,
  session,
  conditions = {},
  update = {},
  options = {}
) {
  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  if (typeof session?.user?.password !== 'string')
    throw new TypeError('Session user and password missing');

  const beforeDoc = await findOne.call(
    this,
    instance,
    session,
    conditions,
    {},
    options
  );
  if (!beforeDoc) return null;

  let doc;
  let err;

  try {
    // only support limited `options` keys (add more as we go)
    {
      const keys = Object.keys(options);
      for (const key of keys) {
        if (keys.filter((k) => k === key).length > 1)
          throw new TypeError('Only one of each type is supported');
        if (key !== 'returnDocument')
          throw new TypeError(`Key type ${key} is not yet supported`);
        if (
          key === 'returnDocument' &&
          !['before', 'after'].includes(options[key])
        )
          throw new TypeError(
            `returnDocument must be "before" or "after" and it was "${options[key]}"`
          );
      }
    }

    // only support limited `update` keys (add more as we go)
    {
      const keys = Object.keys(update);
      if (keys.length === 0)
        throw new TypeError('At least one update condition is required');

      // <https://github.com/2do2go/json-sql/blob/4be018c0662dacba06ddf033d18e71ebf93ee7c3/docs/README.md?plain=1#L989>
      for (const key of keys) {
        if (keys.filter((k) => k === key).length > 1)
          throw new TypeError('Only one of each type is supported');

        if (key !== '$set' && key !== '$inc' && key !== '$addToSet')
          throw new TypeError('Only $set, $inc, and $addToSet are supported');

        if (key === '$addToSet') {
          for (const prop of Object.keys(update.$addToSet)) {
            // only support boolean, string, or number (not array or object)
            if (!['boolean', 'string', 'number'].includes(typeof prop))
              throw new TypeError(
                'Only boolean, string, number are supported for $addToSet'
              );
            // ensure that the same prop doesn't exist in a $set
            if (update.$set && update.$set[prop])
              throw new TypeError(
                'You cannot use both $addToSet and $set for the same prop'
              );
            // ensure the prop we're trying to push to is an array
            if (!Array.isArray(beforeDoc[prop]))
              throw new TypeError('Prop was not an array');

            // if it was an object
            if (typeof update.$addToSet[prop] === 'object') {
              // only support one key which is $each
              for (const subProp of Object.keys(update.$addToSet[prop])) {
                if (subProp !== '$each')
                  throw new TypeError(
                    'Only $each is supported in $addToSet objects'
                  );
                if (!Array.isArray(update.$addToSet[prop].$each))
                  throw new TypeError('$each must be an array');
                // only add to the set if it doesn't exist
                for (const val of update.$addToSet[prop].$each) {
                  if (!beforeDoc[prop].includes(val)) {
                    if (!update.$set) update.$set = {};

                    update.$set[prop] = [...beforeDoc[prop], val];
                  }
                }
              }
            } else if (!beforeDoc[prop].includes(update.$addToSet[prop])) {
              // only add to the set if it doesn't exist
              if (!update.$set) update.$set = {};

              update.$set[prop] = [...beforeDoc[prop], update.$addToSet[prop]];
            }
          }

          // delete $addToSet from the query preparation
          delete update.$addToSet;
        }
      }

      if (update.$set) update.$set = prepareQuery(mapping, update.$set);

      const sql = builder.build({
        type: 'update',
        table,
        condition: {
          _id: beforeDoc._id.toString()
        },
        modifier: update,
        returning: ['*']
      });

      if (session.db.readonly) {
        doc = await instance.wsp.request(
          {
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', sql.query],
              ['get', sql.values]
            ],
            checkpoint: 'PASSIVE'
          },
          0
        );
      } else {
        doc = session.db.prepare(sql.query).get(sql.values);
        try {
          session.db.pragma('wal_checkpoint(PASSIVE)');
        } catch (err) {
          logger.warn(err);
        }
      }
    }
  } catch (_err) {
    err = _err;
  }

  // throw error if any
  if (err) throw err;

  if (!doc) throw new TypeError('Document does not exist');
  doc = await convertResult(this, doc, options?.projection, true);
  return options?.returnDocument === 'after' ? doc : beforeDoc;
}

async function distinct(instance, session, field, conditions = {}) {
  const table = this?.collection?.modelName;
  if (!isSANB(table)) throw new TypeError('Table name missing');
  const mapping = this?.mapping;
  if (typeof mapping !== 'object') throw new TypeError('Mapping is missing');
  if (!session?.db || (!(session.db instanceof Database) && !session?.db.wsp))
    throw new TypeError('Database is missing');
  if (!isSANB(field)) throw new TypeError('Field missing');

  if (!instance.wsp && instance?.constructor?.name !== 'SQLite')
    throw new TypeError('WebSocketAsPromised instance required');

  // TODO: use DISTINCT via `distinct: true` if only one field
  // <https://github.com/2do2go/json-sql/blob/4be018c0662dacba06ddf033d18e71ebf93ee7c3/tests/1_select.js#L28-L38>
  const sql = builder.build({
    type: 'select',
    table,
    condition: prepareQuery(mapping, conditions),
    group: field,
    fields: [field]
  });

  let docs;

  if (instance.wsp) {
    docs = await instance.wsp.request(
      {
        action: 'stmt',
        session: { user: session.user },
        stmt: [['prepare', sql.query], ['pluck'], ['all', sql.values]]
      },
      0
    );
  } else {
    docs = session.db.prepare(sql.query).pluck().all(sql.values);
  }

  if (!Array.isArray(docs)) throw new TypeError('Docs should be an Array');
  if (docs.length === 0) return [];
  return docs;
}

function wrapWithRetry(fn, model) {
  return function (...args) {
    // arg[0] -> instance
    // arg[1] -> session
    const retries =
      typeof args[1] === 'object' && _.isFinite(args[1].retries)
        ? args[1].retries
        : 3;

    return pRetry(() => fn.call(model, ...args), {
      retries,
      minTimeout: config.busyTimeout / 2,
      maxTimeout: config.busyTimeout,
      factor: 1,
      onFailedAttempt(error) {
        error.isCodeBug = true;
        error.args = JSON.parse(safeStringify(args));
        logger.error(error);

        if (isRetryableError(error)) return;

        throw error;
      }
    });
  };
}

function dummyProofModel(model) {
  // add createStatement and mapping
  const { createStatement, mapping } = parseSchema(model);
  model.createStatement = createStatement;
  model.mapping = mapping;

  for (const static of RESTRICTED_STATICS) {
    model[static] = noop(static);
  }

  for (const method of RESTRICTED_METHODS) {
    model.prototype[method] = noop(method);
  }

  model.countDocuments = wrapWithRetry(countDocuments, model);
  model.find = wrapWithRetry(find, model);
  model.findAndCount = wrapWithRetry(findAndCount, model);
  model.findById = wrapWithRetry(findById, model);
  model.findOne = wrapWithRetry(findOne, model);
  model.deleteOne = wrapWithRetry(deleteOne, model);
  model.deleteMany = wrapWithRetry(deleteMany, model);
  model.findByIdAndUpdate = wrapWithRetry(findByIdAndUpdate, model);
  model.findOneAndUpdate = wrapWithRetry(findOneAndUpdate, model);
  model.distinct = wrapWithRetry(distinct, model);
  model.updateMany = wrapWithRetry(updateMany, model);

  // disabled for now
  model.prototype.$__remove = noop('remove');

  // <https://github.com/Automattic/mongoose/blob/7efa1512915c5527bc53d81a2effd3d539324875/lib/model.js#L311-L318>
  model.prototype.$__handleSave = function (...args) {
    const that = this;
    return pRetry(() => $__handleSave.call(that, ...args), {
      retries: 3,
      minTimeout: config.busyTimeout / 2,
      maxTimeout: config.busyTimeout,
      factor: 1,
      onFailedAttempt(error) {
        error.isCodeBug = true;
        error.args = JSON.parse(safeStringify(args));
        logger.error(error);

        if (isRetryableError(error)) return;

        throw error;
      }
    });
  };

  return model;
}

//
// now we need a function that accepts a model, a document,
// a mapping, and whether it was a SQL result or not
// in and it will output the mutated object (or new document mongoose instance)
//
function prepareQuery(mapping, doc) {
  const obj = {};
  const toObject =
    typeof doc === 'object' && typeof doc.toObject === 'function'
      ? doc.toObject()
      : doc;
  for (const key of Object.keys(toObject)) {
    if (!mapping[key]) throw new TypeError(`Mapping for ${key} does not exist`);
    if (typeof mapping[key].setter !== 'function')
      throw new TypeError(`Mapping setter for ${key} does not exist`);

    obj[key] = mapping[key].setter(toObject[key]);
  }

  return obj;
}

function parseSchema(Model, modelName = '') {
  if (typeof Model !== 'function' && typeof Model !== 'object')
    throw new TypeError('Model was missing');

  const name = modelName || Model?.collection?.modelName;
  if (!isSANB(name)) throw new TypeError('Model name missing');

  const schema = Model.schema || Model;
  if (typeof schema !== 'object') throw new TypeError('Model schema missing');
  if (typeof schema.paths !== 'object')
    throw new TypeError('Model schema paths missing');
  if (Object.keys(schema.paths).length === 0)
    throw new TypeError('Model schema paths empty');

  const uniques = ['"_id"'];
  const otherKeys = [];
  const other_keys = [];
  const foreignKeys = [];
  const mapping = {
    _id: {
      data_type: 'text',
      default_value: null,
      max_length: null,
      numeric_precision: null,
      numeric_scale: null,
      is_generated: false,
      generation_expression: null,
      is_nullable: false,
      is_unique: true,
      is_primary_key: true,
      has_auto_increment: false,
      foreign_key_column: null,
      foreign_key_table: null,

      // primary key index
      // NOTE: double "__" underscore to match consistency
      // (we call it _id instead of id so that we know it's bson objectid)
      indexStatement: `CREATE UNIQUE INDEX IF NOT EXISTS "${name}__id" ON ${name} ("_id")`,
      alterStatement: false,

      getter: (v) => new mongoose.Types.ObjectId(v),
      setter(v) {
        if (mongoose.isObjectIdOrHexString(v)) return v.toString();

        // could be an object such as:
        // { $in: [...] }
        if (_.isPlainObject(v) && Array.isArray(v.$in))
          v.$in = v.$in.map((value) =>
            mongoose.isObjectIdOrHexString(value) ? value.toString() : value
          );

        return v;
      },

      // FTS5 support
      fts5: false
    }
  };
  for (const key of Object.keys(schema.paths)) {
    const obj = schema.paths[key];

    // these match knex-schema-inspector property naming
    let data_type;
    let default_value = null;
    let is_nullable = true; // if false then set 'NOT NULL'
    let is_unique = false;
    let foreign_key_column = null;
    let foreign_key_table = null;

    let check = '';
    let _default = '';

    let indexStatement = false;
    let alterStatement = false;

    // getter is when we've retrieved it from sql and need to convert
    let getter = (v) => v;

    // setter is when we're about to store it into sql
    let setter = (v) => v;

    // don't store id (manually set below)
    if (key === '_id') continue;

    if (obj?.options?.unique === true) is_unique = true;
    if (obj?.options?.required === true) is_nullable = false;

    switch (obj.instance) {
      case 'ObjectID': {
        data_type = 'text';
        if (obj?.options?.ref && obj?.options?.ref?.modelName) {
          foreignKeys.push(
            `FOREIGN KEY ("${key}") REFERENCES "${obj.options.ref.modelName}" ("_id")`
          );
          foreign_key_column = '_id';
          foreign_key_table = obj.options.ref.modelName;
        }

        getter = (v) => new mongoose.Types.ObjectId(v);
        setter = (v) => {
          if (mongoose.isObjectIdOrHexString(v)) return v.toString();

          // could be an object such as:
          // { $in: [...] }
          return v;
        };

        break;
      }

      case 'String': {
        data_type = 'text';
        if (typeof obj?.options?.default !== 'undefined') {
          _default = `DEFAULT "${obj.options.default}"`;
          default_value = obj.options.default;
        }

        break;
      }

      case 'Date': {
        data_type = 'datetime'; // affinity -> Numeric
        // Date.toISOString()
        if (typeof obj?.options?.default !== 'undefined')
          throw new TypeError('Default not yet supported');
        // if created_at or updated_at then set to now
        if (key === 'created_at' || key === 'updated_at') {
          _default = `DEFAULT CURRENT_TIMESTAMP`;
          default_value = 'CURRENT_TIMESTAMP';
        }

        getter = (v) =>
          typeof v === 'undefined' || v === null ? v : new Date(v);
        setter = (v) => {
          if (v instanceof Date) return v.toISOString();
          if (v === null) return v;
          // could be an object such as:
          // { $gt: Date }
          return v;
        };

        break;
      }

      case 'Number': {
        data_type = 'numeric';
        // TODO: add support for default integer values in future (e.g. via datetime)
        if (
          typeof obj?.options?.default !== 'undefined' &&
          typeof obj?.options?.default === 'number'
        ) {
          _default = `DEFAULT ${obj.options.default}`;
          default_value = obj.options.default.toString();
          getter = (v) => (typeof v === 'number' ? v : obj.options.default);
        }

        break;
      }

      case 'Boolean': {
        data_type = 'boolean';
        is_nullable = false;
        if (typeof obj?.options?.default !== 'undefined') {
          _default = `DEFAULT ${obj.options.default === true ? 1 : 0}`;
          default_value = (obj.options.default === true ? 1 : 0).toString();
        }

        check = `CHECK ("${key}" IN (0, 1))`;
        getter = (v) => v === 1;
        setter = (v) => (v === true ? 1 : 0);
        break;
      }

      case 'Array': {
        data_type = 'text';
        // stored as JSON (Array)
        if (typeof obj?.options?.default !== 'undefined') {
          default_value = safeStringify(obj.options.default);
          _default = `DEFAULT '${default_value}'`;
        }

        getter = (v) => recursivelyParse(v);
        setter = (v) => safeStringify(v);

        break;
      }

      case 'Mixed': {
        data_type = 'text';
        // stored as JSON (Object)
        if (typeof obj?.options?.default !== 'undefined') {
          default_value = safeStringify(obj.options.default);
          _default = `DEFAULT '${default_value}'`;
        }

        getter = (v) => recursivelyParse(v);
        setter = (v) => safeStringify(v);
        break;
      }

      // <https://github.com/2do2go/json-sql/issues/56>
      case 'Buffer': {
        data_type = 'blob';
        getter = (v) => Buffer.from(v, 'hex');
        setter = (v) => v.toString('hex');
        break;
      }

      // <https://sqlite.org/forum/info/8bda7a0373eced46>
      case 'Decimal128': {
        data_type = 'text';
        getter = (v) => new mongoose.Types.Decimal128(v);
        setter = (v) => v.toString();
        break;
      }

      case 'UUID': {
        data_type = 'text';
        break;
      }

      case 'BigInt': {
        data_type = 'bigint';
        break;
      }

      // Map(1) { 'foo' => 'bar' }
      // > Array.from(map.entries())
      // [ [ 'foo', 'bar' ] ]
      // convert to JSON and then when reading map it back to a Map
      case 'Map': {
        data_type = 'text';
        getter = (v) => {
          return new Map(recursivelyParse(v));
        };

        setter = (v) => {
          if (v instanceof Map) return safeStringify([...v.entries()]);
          throw new TypeError('Must be a Map');
        };

        break;
      }

      // convert to JSON (not sure how we will read it back yet)
      case 'Schema': {
        data_type = 'text';
        getter = (v) => recursivelyParse(v);
        setter = (v) => safeStringify(v);
        break;
      }

      default:
    }

    if (!data_type) throw new TypeError(`${name} missing type for ${key}`);

    // add string here
    if (is_unique) {
      uniques.push(`"${key}"`);
      other_keys.push(key);
      otherKeys.push(
        _.compact([
          `"${key}"`,
          data_type.toUpperCase(),
          _default,
          is_nullable ? '' : 'NOT NULL',
          check
        ]).join(' ')
      );
      //
      // NOTE: the column won't have a unique constraint (since you can't add a constraint on an existing table)
      //       however we still add a unique index which will have the same effect
      //       <https://stackoverflow.com/a/10071366>
      //       <https://stackoverflow.com/questions/15497985/how-to-add-unique-constraint-to-existing-table-in-sqlite>
      //
      alterStatement = `ALTER TABLE ${name} ADD ${_.compact([
        `"${key}"`,
        data_type.toUpperCase(),
        _default,
        is_nullable ? '' : 'NOT NULL',
        check
      ]).join(' ')}`;
    } else if (!is_nullable && !_default) {
      otherKeys.push(
        _.compact([
          `"${key}"`,
          data_type.toUpperCase(),
          _default,
          'NOT NULL',
          check
        ]).join(' ')
      );
      other_keys.push(key);
    } else if (_default && data_type === 'date') {
      otherKeys.push(
        _.compact([
          `"${key}"`,
          data_type.toUpperCase(),
          _default,
          is_nullable ? '' : 'NOT NULL',
          check
        ]).join(' ')
      );
      other_keys.push(key);
    } else {
      alterStatement = `ALTER TABLE ${name} ADD ${_.compact([
        `"${key}"`,
        data_type.toUpperCase(),
        _default,
        is_nullable ? '' : 'NOT NULL',
        check
      ]).join(' ')}`;
    }

    // indexes
    if (obj?.options?.index === true) {
      indexStatement = is_unique
        ? `CREATE UNIQUE INDEX IF NOT EXISTS "${name}_${key}" ON ${name} ("${key}")`
        : `CREATE INDEX IF NOT EXISTS "${name}_${key}" ON ${name} ("${key}")`;
    }

    // text indices (FTS5 support)
    // NOTE: compound index text support is not yet added
    // NOTE: we only support one text index per schema right now
    let fts5 = false;
    if (typeof schema._indexes === 'object' && Array.isArray(schema._indexes)) {
      for (const index of schema._indexes) {
        if (typeof index !== 'object') continue;
        for (const obj of index) {
          for (const key of Object.keys(obj)) {
            // only support text index types here
            if (key !== 'text') continue;
            // throw type error if we already had a text index on the table (only one at a time)
            if (fts5)
              throw new TypeError(
                'Only one text index with FTS5 is supported at this time'
              );
            //
            // use FTS5 for full text search in onSearch function
            // <https://kimsereylam.com/sqlite/2020/03/06/full-text-search-with-sqlite.html>
            // <https://gist.github.com/jbinfo/2c8b2bf2ae6bfaff4eb19cbb89670015>
            //
            if (env.SQLITE_FTS5_ENABLED)
              fts5 = [
                `CREATE VIRTUAL TABLE IF NOT EXISTS ${name}_fts USING fts5(_id UNINDEXED, ${key}, content="${name}", content_rowid="_id");`,
                // insert
                [
                  `CREATE TRIGGER IF NOT EXISTS ${name}_ai AFTER INSERT on ${name}`,
                  '    BEGIN',
                  `        INSERT INTO ${name}_fts (_id, ${key})`,
                  `        VALUES (new._id, new.${key});`,
                  '    END;'
                ].join('\n'),
                // delete
                [
                  `CREATE TRIGGER IF NOT EXISTS ${name}_ad AFTER DELETE ON ${name}`,
                  '    BEGIN',
                  `        DELETE FROM ${name}_fts WHERE _id = old._id;`,
                  '    END;'
                ].join('\n'),
                // update
                [
                  `CREATE TRIGGER IF NOT EXISTS ${name}_au AFTER UPDATE ON ${name}`,
                  '    BEGIN',
                  `        UPDATE ${name}_fts SET ${key} = new.${key} WHERE _id = old._id;`,
                  '    END;'
                ].join('\n')
              ];
          }
        }
      }
    }

    mapping[key] = {
      // these match knex-schema-inspector property naming
      data_type,
      default_value,
      max_length: null,
      numeric_precision: null,
      numeric_scale: null,
      is_generated: false,
      generation_expression: null,
      is_nullable,
      is_unique,
      is_primary_key: false,
      has_auto_increment: false,
      foreign_key_column,
      foreign_key_table,

      // CREATE INDEX statement
      indexStatement,

      // ALTER TABLE statement
      alterStatement,

      // helpers for conversion from mongoose doc <-> sql
      getter,
      setter,

      // FTS5 support
      fts5,

      // arbitrary array used for table creation
      // (see `helpers/migrate-schema.js` for usage)
      other_keys
    };
  }

  const createStatement = `CREATE TABLE IF NOT EXISTS ${name} (
    "_id" TEXT NOT NULL,
    ${otherKeys.length > 0 ? otherKeys.join(',\n') + ',' : ''}
    PRIMARY KEY ("_id"),
    ${foreignKeys.length > 0 ? foreignKeys.join(',\n') + ',' : ''}
    ${uniques.length > 0 ? `UNIQUE (${uniques.join(',')})` : ''}
  )`;

  return {
    mapping,
    createStatement
  };
}

function syncConvertResult(Model, doc) {
  const obj = {};
  if (!Model?.mapping) throw new TypeError('Mapping was not found');

  for (const key in doc) {
    if (Model.mapping[key]) {
      obj[key] = Model.mapping[key].getter(doc[key]);
    } else {
      // sometimes we have a legacy column such as "uid"
      // which is a type String and so we can easily add mapping
      if (typeof doc[key] !== 'string')
        throw new TypeError(`Mapping for ${key} does not exist`);
      obj[key] = doc[key];
    }
  }

  return new Model(obj);
}

async function convertResult(
  Model,
  doc,
  projection = {},
  shouldValidate = false
) {
  const obj = {};
  if (!Model?.mapping) throw new TypeError('Mapping was not found');

  for (const key in doc) {
    if (Model.mapping[key]) {
      obj[key] = Model.mapping[key].getter(doc[key]);
    } else {
      // sometimes we have a legacy column such as "uid" (or "method" for CalendarEvents)
      // which is a type String or it just has a null value, so we can easily add mapping
      // if (doc[key] !== null && typeof doc[key] !== 'string')
      //   throw new TypeError(`Mapping for ${key} does not exist`);
      // obj[key] = doc[key];
      delete doc[key];
    }
  }

  const d = new Model(obj);

  const pathsToValidate = [];
  for (const key in projection) {
    if (boolean(projection[key])) pathsToValidate.push(key);
  }

  // if we had a projection with at least one truthy value then pass it as array
  if (shouldValidate)
    await (pathsToValidate.length > 0
      ? d.validate(pathsToValidate)
      : d.validate());

  // always include _id
  if (
    pathsToValidate.length > 0 &&
    !pathsToValidate.includes('_id') &&
    (projection._id === undefined || boolean(projection._id))
  )
    pathsToValidate.push('_id');

  // TODO: should we include created_at and updated_at too?

  return pathsToValidate.length > 0 ? _.pick(d, pathsToValidate) : d;
}

function sqliteVirtualDB(schema) {
  schema
    .virtual('instance')
    .get(function () {
      return this.__instance;
    })
    .set(function (instance) {
      // TODO: validate it is instanceof SQLite or IMAP server
      this.__instance = instance;
    });
  schema
    .virtual('session')
    .get(function () {
      return this.__session;
    })
    .set(function (session) {
      if (typeof session?.user?.password !== 'string')
        throw new TypeError('session not a valid session');
      this.__session = session;
    });
  return schema;
}

//
// <https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c>
// <https://github.com/sqlite/sqlite/blob/master/src/test_multiplex.c>
// <https://ansiwave.net/blog/sqlite-over-http.html>
// <https://phiresky.github.io/blog/2021/hosting-sqlite-databases-on-github-pages/>
// <https://github.com/benbjohnson/litestream/issues/47>
// <https://litestream.io/tips/#busy-timeout>
//
// TypeError + message of "This database connection is busy executing a query" -> retry for up to 1 minute
module.exports = {
  dummyProofModel,
  dummySchemaOptions: {
    versionKey: false,
    strict: true, // or 'throw'
    id: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  prepareQuery,
  parseSchema,
  convertResult,
  syncConvertResult,
  sqliteVirtualDB
};
