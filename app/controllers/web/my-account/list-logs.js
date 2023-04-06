const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

const { Aliases, Logs } = require('#models');

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
      ? ctx.state.domains.filter(
          (d) => d.plan !== 'free' && domains.has(d.name)
        )
      : ctx.state.domains.filter((d) => d.plan !== 'free');

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

  //
  // go through all domains that the user is not an admin of
  // and add those respective aliases as an $or query for logs
  // (e.g. this allows global vanity domain logs for the user)
  //
  const nonAdminDomains = filteredDomains.filter((d) => d.group !== 'admin');
  const nonAdminDomainsToAliases = {};

  if (nonAdminDomains.length > 0) {
    const aliases = await Aliases.find({
      user: ctx.state.user._id,
      domain: {
        $in: nonAdminDomains.map((d) => d._id)
      }
    })
      .select('name domain')
      .lean()
      .exec();

    for (const alias of aliases) {
      if (!alias.domain) continue;

      const domain = nonAdminDomains.find(
        (d) => d.id === alias.domain.toString()
      );

      if (!domain) continue;

      if (!nonAdminDomainsToAliases[domain.id])
        nonAdminDomainsToAliases[domain.id] = [];

      nonAdminDomainsToAliases[domain.id].push(`${alias.name}@${domain.name}`);

      if (alias.name !== '*') {
        query.$or.push({
          is_restricted: {
            $eq: true,
            $exists: true
          },
          'meta.err.responseCode': { $exists: true },
          domains: {
            $exists: true,
            $in: [domain._id]
          },
          'meta.session.envelope.rcptTo.address': {
            $exists: true,
            $in: [`${alias.name}@${domain.name}`]
          }
        });
      }

      const $regex =
        alias.name === '*'
          ? `^.*@${_.escapeRegExp(domain.name)}$`
          : `^${_.escapeRegExp(alias.name)}+.*@${_.escapeRegExp(domain.name)}$`;

      // add regexp support for "+" symbol alias filtering
      query.$or.push({
        is_restricted: {
          $eq: true,
          $exists: true
        },
        'meta.err.responseCode': { $exists: true },
        domains: {
          $exists: true,
          $in: [domain._id]
        },
        'meta.session.envelope.rcptTo.address': {
          $exists: true,
          $regex,
          $options: 'i'
        }
      });
    }
  }

  if (isSANB(ctx.query.q)) {
    const $regex = _.escapeRegExp(ctx.query.q.trim());

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
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  message: {
                    $exists: true,
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'meta.session.resolvedClientHostname': {
                    $exists: true,
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'meta.session.remoteAddress': {
                    $exists: true,
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'meta.session.envelope.mailFrom.address': {
                    $exists: true,
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'meta.session.envelope.rcptTo.address': {
                    $exists: true,
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'meta.session.originalFromAddress': {
                    $exists: true,
                    $regex,
                    $options: 'i'
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
    //
    // go through each log and filter out RCPT TO values
    // that do not belong to this user
    //
    ctx.state.logs = ctx.state.logs.map((log) => {
      if (Array.isArray(log?.meta?.session?.envelope?.rcptTo)) {
        log.meta.session.envelope.rcptTo =
          log.meta.session.envelope.rcptTo.filter((rcpt) => {
            // get the portion without the "+" symbol since aliases don't permit use of "+" (automatic support)
            const username = rcpt.address.includes('+')
              ? rcpt.address.slice(0, rcpt.address.indexOf('+'))
              : rcpt.address.split('@')[0];
            const domain = rcpt.address.split('@')[1];

            // get a match where the domain name matches and id existed
            let isAdmin = false;
            const match = log.domains.find((logDomain) => {
              const find = ctx.state.domains.find(
                (d) => d.id === logDomain.toString() && d.name === domain
              );
              if (!find) return false;
              if (find.group === 'admin') isAdmin = true;
              return true;
            });

            if (!match) return false;

            // if the user is not an admin of the domain then filter for individual rcpts
            if (isAdmin) return true;

            const email = `${username}@${domain}`.toLowerCase();

            const domainToAliases = nonAdminDomainsToAliases[match.toString()];

            if (!domainToAliases) return false;

            if (
              domainToAliases.includes(`*@${domain}`) ||
              domainToAliases.includes(email)
            )
              return true;

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
