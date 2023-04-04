const Boom = require('@hapi/boom');
const escapeStringRegexp = require('escape-string-regexp');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

const { Logs } = require('#models');

// eslint-disable-next-line complexity
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
        // TODO: regex support
        const $regex =
          alias.name === '*'
            ? new RegExp(`^.*@${escapeStringRegexp(alias.domain.name)}$`, 'i')
            : new RegExp(
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

  if (isSANB(ctx.query.q)) {
    const $regex = new RegExp(escapeStringRegexp(ctx.query.q.trim()), 'i');

    // <https://stackoverflow.com/a/71999502>
    const arr = [
      {
        $addFields: {
          'meta.session.headers': {
            $objectToArray: '$meta.session.headers'
          }
        }
      },
      {
        $match: {
          $and: [
            { ...query },
            {
              $or: [
                {
                  'meta.session.headers.v': {
                    $regex
                  }
                },
                {
                  message: {
                    $exists: true,
                    $regex
                  }
                },
                {
                  'meta.session.resolvedClientHostname': {
                    $exists: true,
                    $regex
                  }
                },
                {
                  'meta.session.remoteAddress': {
                    $exists: true,
                    $regex
                  }
                },
                {
                  'meta.session.envelope.mailFrom.address': {
                    $exists: true,
                    $regex
                  }
                },
                {
                  'meta.session.envelope.rcptTo.address': {
                    $exists: true,
                    $regex
                  }
                },
                {
                  'meta.session.originalFromAddress': {
                    $exists: true,
                    $regex
                  }
                }
              ]
            }
          ]
        }
      },
      {
        $addFields: {
          'meta.session.headers': {
            $arrayToObject: '$meta.session.headers'
          }
        }
      }
    ];

    let $sort = { created_at: -1 };
    if (ctx.query.sort) {
      const order = ctx.query.sort.startsWith('-') ? -1 : 1;
      $sort = {
        [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
      };
    }

    const [logs, results] = await Promise.all([
      Logs.aggregate([
        ...arr,
        {
          $sort
        },
        {
          $skip: ctx.paginate.skip
        },
        {
          $limit: ctx.query.limit
        }
      ]),
      Logs.aggregate([...arr, { $count: 'count' }])
    ]);

    ctx.state.logs = logs;
    ctx.state.itemCount = results[0]?.count;
  } else {
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
    ctx.state.logs = logs;
    ctx.state.itemCount = itemCount;
  }

  ctx.state.pageCount = Math.ceil(ctx.state.itemCount / ctx.query.limit);
  ctx.state.pages = paginate.getArrayPages(ctx)(
    6,
    ctx.state.pageCount,
    ctx.query.page
  );

  if (ctx.state.user.group !== 'admin') {
    // filter ctx.state.logs for RCPT TO based off user
    const aliases = new Set();
    for (const domain of ctx.state.domains) {
      for (const alias of domain.aliases) {
        // TODO: regex support
        aliases.add(`${alias.name}@${alias.domain.name}`);
      }
    }

    ctx.state.logs = ctx.state.logs.map((log) => {
      if (Array.isArray(log?.meta?.session?.envelope?.rcptTo)) {
        log.meta.session.envelope.rcptTo =
          log.meta.session.envelope.rcptTo.filter((rcpt) => {
            // get the portion without the "+" symbol since aliases don't permit use of "+" (automatic support)
            const username = rcpt.address.includes('+')
              ? rcpt.address.slice(0, rcpt.address.indexOf('+'))
              : rcpt.address.split('@')[0];
            const domain = rcpt.address.split('@')[1];
            const email = `${username}@${domain}`.toLowerCase();
            if (aliases.has(`*@${domain}`) || aliases.has(email)) return true;
            return false;
          });
      }

      return log;
    });
  }

  if (ctx.accepts('html')) return ctx.render('my-account/logs');

  const table = await ctx.render('my-account/logs/_table');
  ctx.body = { table };
}

module.exports = listLogs;
