const Boom = require('@hapi/boom');
const escapeStringRegexp = require('escape-string-regexp');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

const { Logs } = require('#models');

async function listLogs(ctx) {
  //
  // NOTE: this is a safeguard since logs are sensitive
  //
  if (!ctx.isAuthenticated())
    return ctx.throw(Boom.badRequest(ctx.translateError('LOGIN_REQUIRED')));

  const domains = new Set();

  //
  // this is some extra dummy-proofing in case user manually is typing in the URL bar
  // and this supports both strings and arrays in ?domain or ?domains with FQDN's
  //
  for (const str of ['domain', 'domains']) {
    if (isSANB(ctx.query[str])) {
      for (const domain of ctx.query[str].split(',')) {
        if (isSANB(domain) && isFQDN(domain)) domains.add(domain.toLowerCase());
      }
    } else if (Array.isArray(ctx.query[str])) {
      for (const domain of ctx.query[str]) {
        if (isSANB(domain) && isFQDN(domain)) domains.add(domain.toLowerCase());
      }
    }
  }

  const filteredDomains =
    domains.size > 0
      ? ctx.state.domains.filter((d) => domains.has(d.name))
      : ctx.state.domains;
  const aliases = new Set();

  for (const domain of filteredDomains) {
    for (const alias of domain.aliases) {
      aliases.add(`${alias.name}@${alias.domain.name}`);
    }
  }

  //
  // the query is an $or query with either filtered domains that the user is an admin of
  // or filtered domains along with RCPT TO matches
  //
  const query = {
    $or: [
      {
        is_restricted: {
          $eq: true,
          $exists: true
        },
        'meta.err.responseCode': { $exists: true },
        domains: {
          $exists: true,
          $in: filteredDomains
            .filter((d) => d.group === 'admin')
            .map((d) => d._id)
        }
      }
    ]
  };

  if (aliases.size > 0) {
    query.$or.push({
      is_restricted: {
        $eq: true,
        $exists: true
      },
      'meta.err.responseCode': { $exists: true },
      domains: {
        $exists: true,
        $in: filteredDomains.map((d) => d._id)
      },
      'meta.session.envelope.rcptTo.address': {
        $exists: true,
        $in: [...aliases]
      }
    });

    for (const domain of filteredDomains) {
      for (const alias of domain.aliases) {
        const $regex = new RegExp(
          `^${escapeStringRegexp(alias.name)}+.*@${escapeStringRegexp(
            alias.domain.name
          )}$`,
          'i'
        );
        // add regexp support for "+" symbol alias filtering
        query.$or.push({
          is_restricted: {
            $eq: true,
            $exists: true
          },
          'meta.err.responseCode': { $exists: true },
          domains: {
            $exists: true,
            $in: filteredDomains.map((d) => d._id)
          },
          'meta.session.envelope.rcptTo.address': {
            $exists: true,
            $regex
          }
        });
      }
    }
  }

  const [logs, itemCount] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Logs.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .lean()
      .exec(),
    Logs.countDocuments(query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('my-account/logs', {
      logs,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('my-account/logs/_table', {
    logs,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

module.exports = listLogs;
