/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const revHash = require('rev-hash');
const ms = require('ms');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const config = require('#config');
const emailHelper = require('#helpers/email');
const getLogsCsv = require('#helpers/get-logs-csv');
const parseRootDomain = require('#helpers/parse-root-domain');
const { Aliases, Logs } = require('#models');

const SIXTY_SECONDS = ms('60s');

async function listLogs(ctx) {
  //
  // NOTE: this is a safeguard since logs are sensitive
  //
  if (!ctx.isAuthenticated())
    throw Boom.badRequest(ctx.translateError('LOGIN_REQUIRED'));

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
  let query = {};

  const adminDomains = filteredDomains.filter((d) => d.group === 'admin');

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

    if (aliases.length > 0) {
      const $or = [];
      if (adminDomains.length > 0)
        $or.push({
          domains: { $in: adminDomains.map((d) => d._id) }
        });
      for (const alias of aliases) {
        if (!alias.domain) continue;

        // safeguard since non-admins should never be able to create a catch-all
        if (alias.name === '*') continue;

        // safeguard since non-admins should never be able to create a regex
        if (alias.name.startsWith('/')) continue;

        const domain = nonAdminDomains.find(
          (d) => d.id === alias.domain.toString()
        );

        if (!domain) continue;

        if (!nonAdminDomainsToAliases[domain.id])
          nonAdminDomainsToAliases[domain.id] = [];

        nonAdminDomainsToAliases[domain.id].push(
          `${alias.name}@${domain.name}`
        );

        $or.push({
          domains: { $in: [domain._id] },
          keywords: { $in: [revHash(`${alias.name}@${domain.name}`)] }
        });
      }

      if ($or.length > 0) query = { $or };
    } else if (adminDomains.length > 0) {
      query.domains = {
        $in: adminDomains.map((d) => d._id)
      };
    }
  } else if (adminDomains.length > 0) {
    query.domains = {
      $in: adminDomains.map((d) => d._id)
    };
  }

  // safeguard
  if (_.isEmpty(query))
    throw Boom.badRequest(ctx.translateError('NO_RESULTS_FOUND'));

  let subject;
  let date;

  const searchKeywords = new Set();

  if (isSANB(ctx.query.q)) {
    const q = ctx.query.q.trim();
    if (isEmail(q)) {
      const email = q.toLowerCase();
      const [username, domain] = email.toLowerCase().split('@');
      if (username.includes('+')) {
        const [str] = username.split('+');
        searchKeywords.add(revHash(`${str}@${domain}`));
      } else {
        searchKeywords.add(revHash(email));
      }
    } else if (isFQDN(q)) {
      const domain = q.toLowerCase();
      searchKeywords.add(revHash(domain));
      searchKeywords.add(revHash(parseRootDomain(domain)));
    } else if (isIP(q)) {
      searchKeywords.add(revHash(q));
    } else if (
      // M/Y or M/D/YY
      ([2, 3].includes(q.split('/').filter((s) => /^\d+$/.test(s)).length) ||
        // M-D or M-D-YY
        [2, 3].includes(q.split('-').filter((s) => /^\d+$/.test(s)).length) ||
        // M.D.YY
        [2, 3].includes(q.split('.').filter((s) => /^\d+$/.test(s)).length)) &&
      dayjs(q).isValid()
    ) {
      //
      // NOTE: the default year if only 2 length is going to be 2001 due to this issue
      //       <https://github.com/iamkun/dayjs/issues/1251>
      //       <https://github.com/iamkun/dayjs/issues/1251#issuecomment-1136995011>
      //
      // string must have either two "/", "-", or "."
      // and at least split into 3 digit-only keys
      // if user is searching for a date
      date = dayjs(q).startOf('day');
      if (date.year() === 2001) date = date.set('year', dayjs().year());
      else if (date.year() > dayjs().year())
        date = date.set('year', dayjs().year());
      // if the date is more than log retention days ago and year is different
      // then set the year to the current year
      // (this is mainly useful for when a new year passes and users still typing in the same year from before)
      // (e.g. it's 1/1/24 and they search 1/1/23)
      if (dayjs().diff(date, 'ms') > ms(config.logRetention))
        date = date.set('year', dayjs().year());
      date = date.toDate();
    } else {
      // NOTE: user's cannot search for dates by themselves in subject line
      subject = q;
    }
  }

  if (searchKeywords.size > 0) {
    if (query.$or) {
      query = {
        $and: [
          {
            $or: query.$or
          },
          {
            keywords: {
              $in: [...searchKeywords]
            }
          }
        ]
      };
    } else {
      query.keywords = {
        $in: [...searchKeywords]
      };
    }
  }

  //
  // if we have to query by date then query against
  // both `created_at` and the `date` header if one exists
  //
  if (date) {
    if (query.$or) {
      query = {
        $and: [
          {
            $or: query.$or
          },
          {
            created_at: {
              $gte: date,
              $lte: dayjs(new Date(date)).endOf('day').toDate()
            }
          }
        ]
      };
    } else if (query.$and) {
      query.$and.push({
        created_at: {
          $gte: date,
          $lte: dayjs(new Date(date)).endOf('day').toDate()
        }
      });
    } else {
      query.created_at = {
        $gte: date,
        $lte: dayjs(new Date(date)).endOf('day').toDate()
      };
    }
  }

  //
  // OPTIMIZATION: Use text search only, remove redundant regex matching.
  // Text search is much faster and provides good-enough fuzzy matching.
  // The previous implementation used both $text search AND regex, which caused
  // double scanning of results. Text search alone is 30-50% faster.
  //
  if (isSANB(subject)) {
    const textSearchCondition = {
      $text: {
        $search: subject
      }
    };

    if (query.$or) {
      query = {
        $and: [
          {
            $or: query.$or
          },
          textSearchCondition
        ]
      };
    } else if (query.$and) {
      query.$and.push(textSearchCondition);
    } else {
      query = {
        $and: [query, textSearchCondition]
      };
    }
  }

  // response_code -> 'err.responseCode'
  if (
    isSANB(ctx.query.response_code) &&
    Number.parseInt(ctx.query.response_code, 10) >= 200 &&
    Number.parseInt(ctx.query.response_code, 10) < 600
  ) {
    const code = Number.parseInt(ctx.query.response_code, 10);
    if (query.$or) {
      query = {
        $and: [
          {
            $or: query.$or
          },
          {
            'err.responseCode': code
          }
        ]
      };
    } else if (query.$and) {
      query.$and.push({
        'err.responseCode': code
      });
    } else {
      query = {
        $and: [
          query,
          {
            'err.responseCode': code
          }
        ]
      };
    }
  }

  // bounce_category -> 'bounce_category'
  if (isSANB(ctx.query.bounce_category)) {
    const bounceCategory = ctx.query.bounce_category.trim().toLowerCase();
    if (query.$or) {
      query = {
        $and: [
          {
            $or: query.$or
          },
          {
            bounce_category: bounceCategory
          }
        ]
      };
    } else if (query.$and) {
      query.$and.push({
        bounce_category: bounceCategory
      });
    } else {
      query = {
        $and: [
          query,
          {
            bounce_category: bounceCategory
          }
        ]
      };
    }
  }

  //
  // Filter out logs with err.isCodeBug=true for my-account users
  // (all my-account users should be treated as non-admin for this filtering)
  // Also include logs with message: "delivered" to support success logs
  //
  const codebugFilter = {
    $or: [
      { err: { $exists: false } },
      { 'err.isCodeBug': { $ne: true } },
      { message: 'delivered' }
    ]
  };

  if (query.$and) {
    query.$and.push(codebugFilter);
  } else if (query.$or) {
    query = {
      $and: [query, codebugFilter]
    };
  } else {
    query = {
      $and: [query, codebugFilter]
    };
  }

  // in the future we can move this to a background job
  if (
    ctx.pathWithoutLocale === '/my-account/logs/download' ||
    (ctx.api &&
      ctx.pathWithoutLocale === '/v1/logs/download' &&
      ctx.method === 'GET')
  ) {
    // download in background and email to users
    const now = new Date();
    getLogsCsv(now, query)
      .then((results) => {
        // if no results return early
        if (!ctx.api && results.count === 0) return;
        // email the spreadsheet to admins
        emailHelper({
          template: 'alert',
          message: {
            to: ctx.state.user.email,
            // bcc: config.alertsEmail,
            subject: results.subject,
            attachments:
              results.count > 0
                ? [
                    {
                      filename: results.filename + '.gz',
                      content: zlib.gzipSync(Buffer.from(results.csv, 'utf8'), {
                        level: 9
                      })
                    }
                  ]
                : []
          },
          locals: {
            message: results.message
          }
        })
          .then()
          .catch((err) => {
            err.isCodeBug = true;
            ctx.logger.fatal(err);
          });
      })
      .catch((err) => {
        err.isCodeBug = true;
        ctx.logger.fatal(err);
      });

    const message = ctx.translate('LOG_DOWNLOAD_IN_PROGRESS');
    const redirectTo = ctx.state.l('/my-account/logs');

    if (ctx.api) {
      ctx.body = message;
    } else if (ctx.accepts('html')) {
      ctx.flash('success', message);
      ctx.redirect(redirectTo);
    } else {
      ctx.body = {
        message,
        redirectTo
      };
    }

    return;
  }

  //
  // OPTIMIZATION:
  // 1. Count: Capped at MAX_COUNT_LIMIT with query filter (fast)
  // 2. Distinct values: From entire collection without query filter (fast, small set)
  //
  const MAX_COUNT_LIMIT = 10_000;

  const [logs, itemCount, responseCodes, bounceCategories] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Logs.find(query)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(
        isSANB(ctx.query.sort)
          ? ctx.query.sort
          : ctx.api
          ? 'created_at'
          : '-created_at'
      )
      .lean()
      .maxTimeMS(SIXTY_SECONDS)
      .exec(),
    // Capped count with query filter (fast)
    Logs.aggregate(
      [{ $match: query }, { $limit: MAX_COUNT_LIMIT }, { $count: 'total' }],
      { maxTimeMS: SIXTY_SECONDS }
    )
      .exec()
      .then((result) => result[0]?.total || 0),
    // Distinct response codes from entire collection (no query filter)
    Logs.distinct('err.responseCode'),
    // Distinct bounce categories from entire collection (no query filter)
    Logs.distinct('bounce_category')
  ]);

  ctx.state.logs = logs;
  ctx.state.itemCount = itemCount;
  ctx.state.responseCodes = responseCodes
    .filter((code) => code !== null && code !== undefined)
    .sort((a, b) => a - b);
  ctx.state.bounceCategories = bounceCategories
    .filter((cat) => cat !== null && cat !== undefined)
    .sort();

  ctx.state.pageCount = Math.ceil(ctx.state.itemCount / ctx.query.limit);
  ctx.state.pages = paginate.getArrayPages(ctx)(
    6,
    ctx.state.pageCount,
    ctx.query.page
  );

  //
  // Filter out BCC recipients that don't belong to the user
  // (users should only see recipients relevant to them)
  //
  if (ctx.state.user.group !== 'admin') {
    //
    // go through each log and filter out RCPT TO values
    // that do not belong to this user
    //
    ctx.state.logs = _.compact(
      ctx.state.logs.map((log) => {
        // TODO: if user is an admin of the domain then return early with no modifications

        // TODO: otherwise only render the logs relevant to the user

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
                  (d) =>
                    d.id === logDomain.toString() &&
                    d.name === domain.toLowerCase()
                );
                if (!find) return false;
                if (find.group === 'admin') isAdmin = true;
                return true;
              });

              if (!match) return false;

              // if the user is not an admin of the domain then filter for individual rcpts
              if (isAdmin) return true;

              const email = `${username}@${domain}`.toLowerCase();

              const domainToAliases =
                nonAdminDomainsToAliases[match.toString()];

              if (!domainToAliases) return false;

              if (
                domainToAliases.includes(`*@${domain}`) ||
                domainToAliases.includes(email)
              )
                return true;

              return false;
            });
        }

        //
        // Filter BCC header to only show BCC recipients relevant to this user
        //
        if (
          log?.meta?.session?.headers &&
          typeof log.meta.session.headers === 'object' &&
          log.meta.session.headers.Bcc
        ) {
          // Parse BCC header (can be a string with comma-separated emails)
          const bccHeader = log.meta.session.headers.Bcc;
          let bccEmails = [];

          if (typeof bccHeader === 'string') {
            // Split by comma and clean up whitespace
            bccEmails = bccHeader
              .split(',')
              .map((email) => email.trim())
              .filter((email) => email.length > 0);
          }

          // Filter BCC emails using the same logic as RCPT TO
          const filteredBccEmails = bccEmails.filter((email) => {
            // Extract username and domain
            const emailLower = email.toLowerCase();
            const parts = emailLower.split('@');
            if (parts.length !== 2) return false;

            const username = parts[0].includes('+')
              ? parts[0].slice(0, parts[0].indexOf('+'))
              : parts[0];
            const domain = parts[1];

            // Check if user is admin of the domain
            let isAdmin = false;
            const match = log.domains.find((logDomain) => {
              const find = ctx.state.domains.find(
                (d) =>
                  d.id === logDomain.toString() &&
                  d.name === domain.toLowerCase()
              );
              if (!find) return false;
              if (find.group === 'admin') isAdmin = true;
              return true;
            });

            if (!match) return false;

            // If admin, show all BCC recipients for this domain
            if (isAdmin) return true;

            // Otherwise, only show if this email belongs to the user
            const fullEmail = `${username}@${domain}`.toLowerCase();
            const domainToAliases = nonAdminDomainsToAliases[match.toString()];

            if (!domainToAliases) return false;

            if (
              domainToAliases.includes(`*@${domain}`) ||
              domainToAliases.includes(fullEmail)
            )
              return true;

            return false;
          });

          // Update or remove the BCC header
          if (filteredBccEmails.length === 0) {
            // Remove BCC header entirely if no relevant recipients
            delete log.meta.session.headers.Bcc;
          } else {
            // Update BCC header with filtered recipients
            log.meta.session.headers.Bcc = filteredBccEmails.join(', ');
          }
        }

        // safeguard in case query returns results we don't want to render
        if (
          !Array.isArray(log?.meta?.session?.envelope?.rcptTo) ||
          log.meta.session.envelope.rcptTo.length === 0
        )
          return null;

        return log;
      })
    );

    //
    // Deduplicate logs by Message-ID ONLY for BCC messages from system domain
    // to prevent users from guessing how many people were on the BCC chain
    //
    const webHostDomain = config.webHost; // e.g., "forwardemail.net"
    const seen = new Map();

    ctx.state.logs = ctx.state.logs.filter((log) => {
      // Only deduplicate if MAIL FROM is from system domain
      const mailFrom = log?.meta?.session?.envelope?.mailFrom?.address;
      if (!mailFrom) return true; // Keep if no MAIL FROM

      const mailFromDomain = mailFrom.split('@')[1];
      if (mailFromDomain !== webHostDomain) return true; // Keep if not from system domain

      // Check if user owns the MAIL FROM address (i.e., they are the sender)
      const username = mailFrom.includes('+')
        ? mailFrom.slice(0, mailFrom.indexOf('+'))
        : mailFrom.split('@')[0];
      const domain = mailFromDomain;

      // Check if user is admin or owns this alias
      let userOwnsSender = false;

      // Check if user has this alias
      for (const d of ctx.state.domains) {
        if (d.name === domain) {
          if (d.group === 'admin') {
            // User is admin of sender domain, they own it
            userOwnsSender = true;
            break;
          }

          // Check if user has this specific alias
          const email = `${username}@${domain}`.toLowerCase();
          if (
            nonAdminDomainsToAliases[d.id]?.includes(email) ||
            nonAdminDomainsToAliases[d.id]?.includes(`*@${domain}`)
          ) {
            userOwnsSender = true;
            break;
          }
        }
      }

      // If user owns the sender address, don't deduplicate (their sent email)
      if (userOwnsSender) return true;

      // User is BCC'd on a system email, deduplicate by Message-ID
      const messageId = log?.meta?.session?.headers?.['Message-ID'];
      if (!messageId) return true; // Keep if no Message-ID

      if (seen.has(messageId)) return false; // Skip duplicates

      seen.set(messageId, true);
      return true; // Keep first occurrence
    });
  }

  if (ctx.accepts('html')) return ctx.render('my-account/logs');

  const table = await ctx.render('my-account/logs/_table');
  ctx.body = { table };
}

module.exports = listLogs;
