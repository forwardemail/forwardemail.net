const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const parser = require('mongodb-query-parser');
const { boolean } = require('boolean');

const { Logs } = require('#models');

// <https://stackoverflow.com/a/46946490>
function splitSpaces(str) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return str.match(/\\?.|^$/g).reduce(
    (p, c) => {
      if (c === '"') {
        // eslint-disable-next-line no-bitwise
        p.quote ^= 1;
      } else if (!p.quote && c === ' ') {
        p.a.push('');
      } else {
        p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
      }

      return p;
    },
    { a: [''] }
  ).a;
}

async function list(ctx) {
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
      return ctx.throw(
        Boom.badRequest(
          'Invalid search, please separate by space and use = to denote value'
        )
      );
  }

  if (isSANB(ctx.query.mongodb_query)) {
    try {
      query = parser.parseFilter(ctx.query.mongodb_query);
      if (!query || Object.keys(query).length === 0)
        throw new Error('Query was not parsed propery');
    } catch (err) {
      ctx.logger.warn(err);
      return ctx.throw(Boom.badRequest(err.message));
    }
  }

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
