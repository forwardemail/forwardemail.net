/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const pMap = require('p-map');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const Logs = require('#models/logs');
const config = require('#config');
const populateDomainStorage = require('#helpers/populate-domain-storage');
const sendPaginationCheck = require('#helpers/send-pagination-check');
const setPaginationHeaders = require('#helpers/set-pagination-headers');

async function getCharts(ctx) {
  const query = { $or: [] };
  const logQuery = { $or: [] };

  // filter out vanity domains if they don't have aliases
  const filteredDomains = ctx.state.domains.filter((domain) => {
    if (!domain.is_global) return true;
    const member = domain.members.find((m) => m.user.id === ctx.state.user.id);
    if (!member) return false;
    if (member.group === 'admin') return true;
    if (domain.has_global_aliases) return true;
    return false;
  });

  for (const domain of filteredDomains) {
    if (domain.group === 'admin') {
      query.$or.push({
        domain: { $in: [domain._id] }
      });
      logQuery.$or.push({
        domains: { $in: [domain._id] }
      });
    } else {
      query.$or.push({
        domain: { $in: [domain._id] },
        user: ctx.state.user._id
      });
      logQuery.$or.push({
        domains: { $in: [domain._id] },
        user: ctx.state.user._id
      });
    }
  }

  const [domains, aliases, emails, logs] = await Promise.all([
    Promise.resolve(filteredDomains.length),

    filteredDomains.length === 0
      ? Promise.resolve([])
      : Aliases.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: 1 } } }
        ]),

    filteredDomains.length === 0
      ? Promise.resolve([])
      : Emails.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: 1 } } }
        ]),

    // TODO: accuracy needs checked
    filteredDomains.length === 0
      ? Promise.resolve([])
      : Logs.aggregate([
          {
            $match: logQuery
          },
          { $group: { _id: null, total: { $sum: 1 } } }
        ])
  ]);

  return {
    metrics: [
      {
        selector: '#metrics-total-domains',
        value: numeral(domains).format('0,0')
      },
      {
        selector: '#metrics-total-aliases',
        value: aliases[0] ? numeral(aliases[0].total).format('0,0') : '-'
      },
      {
        selector: '#metrics-total-emails',
        value: emails[0] ? numeral(emails[0].total).format('0,0') : '-'
      },
      {
        selector: '#metrics-total-logs',
        value: logs[0] ? numeral(logs[0].total).format('0,0') : '-'
      }
    ]
  };
}

async function listDomains(ctx, next) {
  // render charts for XHR request
  if (
    !ctx.accepts('html') &&
    ctx.pathWithoutLocale === '/my-account/domains' &&
    !ctx.api &&
    ctx.get('X-Open-Startup')
  ) {
    ctx.body = await getCharts(ctx);
    return;
  }

  let { domains } = ctx.state;

  //
  // filter domains by domain name if query parameter is provided
  //
  if (isSANB(ctx.query.domain)) {
    const domainQuery = ctx.query.domain.toLowerCase().trim();
    // support both ASCII and Unicode domain names
    const domainQueryASCII = punycode.toASCII(domainQuery);
    const domainQueryUnicode = punycode.toUnicode(domainQuery);

    domains = domains.filter((domain) => {
      const domainName = domain.name.toLowerCase();
      return (
        domainName.includes(domainQuery) ||
        domainName.includes(domainQueryASCII) ||
        domainName.includes(domainQueryUnicode)
      );
    });
  }

  //
  // starting November 1st we enforce API pagination on this endpoint
  // (unless user opts in beforehand using ?pagination=true)
  //
  const hasPagination = dayjs().isBefore('11/1/2024', 'M/D/YYYY')
    ? boolean(ctx.query.pagination) ||
      !_.isUndefined(ctx.query.limit) ||
      !_.isUndefined(ctx.query.page)
    : true;

  //
  // NOTE: we send a one-time email admins that we now offer pagination
  //       and with notice that starting November 1st list domains/aliases
  //       endpoints will be paginated to 1000 results max per page by default
  //
  if (ctx.api && !hasPagination) await sendPaginationCheck(ctx);

  // if user has ubuntu ID then check if recipient matches email address
  // and if so then alert the user with a flash notification
  if (
    !ctx.api &&
    ctx.state.user[config.passport.fields.ubuntuProfileID] &&
    ctx.state.user[config.passport.fields.ubuntuUsername]
  ) {
    const domains = await Domains.find({
      name: {
        $in: Object.keys(config.ubuntuTeamMapping)
      },
      plan: 'team',
      has_txt_record: true
    })
      .lean()
      .exec();
    if (domains.length > 0) {
      const combinations = domains.map(
        (d) =>
          `${ctx.state.user[config.passport.fields.ubuntuUsername]}@${d.name}`
      );
      const aliases = await Aliases.find({
        name: ctx.state.user[config.passport.fields.ubuntuUsername],
        user: ctx.state.user._id,
        domain: { $in: domains.map((d) => d._id) },
        recipients: {
          $in: combinations
        }
      })
        .populate('domain', 'name')
        .exec();
      if (aliases.length > 0) {
        try {
          await Promise.all(
            aliases.map(async (alias) => {
              alias.is_enabled = false;
              await alias.save();
            })
          );
        } catch (err) {
          ctx.logger.error(err);
        }

        ctx.flash(
          'error',
          ctx.translate(
            'RECIPIENT_MATCHES_EMAIL',
            aliases
              .map((a) => `${a?.name}@${a?.domain?.name}`)
              .join('</li><li>')
          )
        );
      }
    }
  }

  // if some of the domains were not global and need setup then toast notification
  if (!ctx.api && (!ctx.query.page || ctx.query.page === 1)) {
    // let hasSomeSetup = false;
    let setupRequired = false;
    let setupRequiredMultiple = false;
    for (const domain of domains) {
      if (domain.group !== 'admin') continue;
      const { isGood, isDisposable, isRestricted } =
        Domains.getNameRestrictions(domain.name);

      if (domain.plan === 'free' && (!isGood || isDisposable || isRestricted)) {
        if (setupRequired) {
          setupRequiredMultiple = true;
          break;
        }

        setupRequired = domain.name;
        continue;
      }

      if (domain.has_mx_record && domain.has_txt_record) continue;

      if (setupRequired) {
        setupRequiredMultiple = true;
        break;
      }

      setupRequired = domain.name;
    }

    if (setupRequired) {
      const message = setupRequiredMultiple
        ? ctx.translate('SETUP_REQUIRED_MULTIPLE')
        : ctx.translate(
            'SETUP_REQUIRED',
            setupRequired,
            ctx.state.l(`/my-account/domains/${setupRequired}`)
          );
      ctx.flash('custom', {
        title: ctx.request.t('Warning'),
        // showConfirmButton: false,
        html: message,
        type: 'warning',
        toast: true,
        position: 'top'
      });
    }

    /*
    if (hasSomeSetup && ctx.state.user.plan !== 'free') {
      try {
        const domainIds = ctx.state.domains
          .filter((d) => d.group === 'admin')
          .map((d) => d._id);
        const [temporaryErrorCount, permanentErrorCount] = await Promise.all([
          Logs.countDocuments({
            domains: { $in: domainIds },
            'err.responseCode': {
              $gte: 400,
              $lt: 500
            }
          }),
          Logs.countDocuments({
            domains: { $in: domainIds },
            'err.responseCode': {
              $gte: 500
            }
          })
        ]);
        ctx.state.temporaryErrorCount = temporaryErrorCount;
        ctx.state.permanentErrorCount = permanentErrorCount;
      } catch (err) {
        ctx.logger.error(err);
      }
    }
    */
  }

  // hide global domain names if not admin of
  // the global domain and had zero aliases
  domains = domains.filter((domain) => {
    if (!domain.is_global) return true;
    const member = domain.members.find((m) => m.user.id === ctx.state.user.id);
    if (!member) return false;
    if (member.group === 'admin') return true;
    if (domain.has_global_aliases) return true;
    return false;
  });

  const itemCount = domains.length;
  const pageCount =
    !ctx.api || hasPagination ? Math.ceil(itemCount / ctx.query.limit) : 1;

  // sort domains
  let sortFn;
  if (isSANB(ctx.query.sort))
    sortFn = (d) => d[ctx.query.sort.replace(/^-/, '')];
  else {
    // use the default A-Z sort fn but put not verified at top, followed by mismatch
    // (but the API will return default sort by `created_at` for pagination purposes)
    sortFn = (d) =>
      ctx.api
        ? d.created_at
        : !d.has_mx_record || !d.has_txt_record
        ? 0
        : d.is_global && d.group !== 'admin'
        ? 3
        : ctx.state.user.plan === d.plan
        ? 2
        : 1;
  }

  // store allDomains used for alias modal dropdown
  if (!ctx.api) {
    ctx.state.allDomains = [...domains].filter((domain) => {
      const member = domain.members.find(
        (m) => m.user.id === ctx.state.user.id
      );
      // hide ubuntu-related domains
      if (
        member &&
        domain.plan === 'team' &&
        domain.has_txt_record &&
        Object.keys(config.ubuntuTeamMapping).includes(domain.name) &&
        member.group !== 'admin'
      )
        return false;
      return true;
    });
  }

  // domains are already pre-sorted A-Z by 'name' so only use sortFn if passed
  if (sortFn) domains = _.sortBy(domains, [sortFn]);

  if (isSANB(ctx.query.sort) && ctx.query.sort.startsWith('-'))
    domains = _.reverse(domains);

  // slice for page
  if (!ctx.api || hasPagination)
    domains = domains.slice(
      ctx.paginate.skip,
      ctx.query.limit + ctx.paginate.skip
    );

  // get storage quota for each domain
  domains = await pMap(
    domains,
    async (d) => populateDomainStorage(d, ctx.locale),
    {
      concurrency: config.concurrency
    }
  );

  //
  // set HTTP headers for pagination
  // <https://forwardemail.net/email-api#description/pagination>
  //
  setPaginationHeaders(
    ctx,
    pageCount,
    !ctx.api || hasPagination ? ctx.query.page : 1,
    domains.length,
    itemCount
  );

  // if API then return so it can hit v1 domains controller
  if (ctx.api) {
    ctx.state.domains = domains;
    return next();
  }

  //
  // set breadcrumbs
  //
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      href: ctx.state.l('/my-account/domains')
    }
  ];

  if (ctx.accepts('html'))
    return ctx.render('my-account/domains', {
      allDomains: ctx.state.allDomains,
      domains,
      pageCount,
      itemCount,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('my-account/domains/_table', {
    allDomains: ctx.state.allDomains,
    domains,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

module.exports = listDomains;
