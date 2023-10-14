/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');
const paginate = require('koa-ctx-paginate');

const getMongoQuery = require('#helpers/get-mongo-query');
const { Logs } = require('#models');

async function list(ctx) {
  const query = getMongoQuery(ctx);

  // TODO: $query should be filtered for partial indices only

  let [logs, itemCount, uniqueHosts] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Logs.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .populate('user.email')
      .sort(ctx.query.sort || '-created_at')
      .lean()
      // TODO: use hint({ indexName: 1 }) if query had a partially indexed value
      .exec(),
    _.isEmpty(query)
      ? Logs.estimatedDocumentCount()
      : // TODO: use Logs.countDocuments(query, { hint: { indexName: 1 })
        // if query had a partially indexed value
        Logs.countDocuments(query),
    // this is faster than `Logs.distinct('meta.app.hostname') because we use partial index hint
    // unfortunately distinct command does not have hint support
    // <https://jira.mongodb.org/browse/SERVER-14227>
    Logs.aggregate(
      [{ $group: { _id: '$meta.app.hostname' } }, { $unwind: '$_id' }],
      { hint: { 'meta.app.hostname': 1 } }
    )
  ]);

  // flatten unique hosts
  uniqueHosts = uniqueHosts.map((doc) => doc._id);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/logs', {
      logs,
      pageCount,
      itemCount,
      uniqueHosts,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/logs/_table', {
    logs,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

async function retrieve(ctx) {
  ctx.state.result = await Logs.findById(ctx.params.id);
  if (!ctx.state.result) throw Boom.notFound(ctx.translateError('INVALID_LOG'));
  return ctx.render('admin/logs/retrieve');
}

module.exports = {
  list,
  retrieve
};
