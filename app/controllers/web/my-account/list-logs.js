const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const { isEmail } = require('validator');

const { Logs } = require('#models');

// eslint-disable-next-line complexity
async function listLogs(ctx) {
  //
  // NOTE: this is a safeguard since logs are sensitive
  //
  if (!ctx.isAuthenticated())
    return ctx.throw(Boom.badRequest(ctx.translateError('LOGIN_REQUIRED')));

  // if user does not have any domains
  const domainsByUser = ctx.state.domains.filter(
    (d) =>
      d.group === 'admin' && (!d.is_global || ctx.state.user.group === 'admin')
  );

  // safeguard to always ensure at least one domain is queried
  if (domainsByUser.length === 0)
    throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

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

  let query = {
    //
    // TODO: support this in the future with an activity log or audit trail (?)
    //
    // user: ctx.state.user._id
    is_restricted: {
      $eq: true,
      $exists: true
    },
    'meta.err.responseCode': { $exists: true },
    domains: {
      $exists: true,
      $in: domainsByUser.map((d) => d._id)
    }
  };

  if (domains.size > 0) {
    const domainIds = [];
    for (const domain of domains) {
      const match = domainsByUser.find((d) => d.name === domain);
      if (!match)
        throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
      domainIds.push(match._id);
    }

    // safeguard to always ensure at least one domain is queried
    if (domainIds.length === 0)
      throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    query = {
      is_restricted: {
        $eq: true,
        $exists: true
      },
      'meta.err.responseCode': { $exists: true },
      domains: { $exists: true, $in: domainIds }
    };
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

  //
  // iterate through all logs and add virtual properties relative to the logged in user
  // (this helps keep sensitive data safe in edge cases like multiple RCPT TO on same service)
  // (and it also keeps a lot of logic out of the view rendering)
  //
  // - mailFrom = MAIL FROM
  // - rcpts = RCPT FROM (array of recipients filtered for relative user)
  const domainNames = new Set(domainsByUser.map((d) => d.name));
  for (const log of logs) {
    if (
      isSANB(log?.meta?.session?.envelope?.mailFrom?.address) &&
      isEmail(log.meta.session.envelope.mailFrom.address)
    )
      log.mailFrom = log.meta.session.envelope.mailFrom.address;
    log.rcpts = _.isArray(log?.meta?.session?.envelope.rcptTo)
      ? log.meta.session.envelope.rcptTo
          .filter(
            (rcpt) =>
              _.isObject(rcpt) &&
              isSANB(rcpt.address) &&
              isEmail(rcpt.address) &&
              domainNames.has(rcpt.address.split('@')[1].toLowerCase())
          )
          .map((rcpt) => rcpt.address)
      : [];
  }

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
