/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ms = require('ms');
const { boolean } = require('boolean');
const _ = require('#helpers/lodash');

const env = require('#config/env');
const config = require('#config');

const HOSTNAMES = _.uniq(
  config.env === 'production'
    ? [
        env.API_HOST,
        env.BREE_HOST,
        env.CALDAV_HOST,
        env.CARDDAV_HOST,
        env.IMAP_HOST,
        env.POP3_HOST,
        env.SMTP_HOST,
        env.WEB_HOST,
        env.MX1_HOST,
        env.MX2_HOST,
        env.MAIL_HOST,
        env.REDIS_HOST,
        env.SQLITE_HOST
      ]
    : [
        'api.forwardemail.net',
        'bree.forwardemail.net',
        'caldav.forwardemail.net',
        'carddav.forwardemail.net',
        'imap.forwardemail.net',
        'pop3.forwardemail.net',
        'smtp.forwardemail.net',
        'forwardemail.net',
        'mx1.forwardemail.net',
        'mx2.forwardemail.net',
        'mail.forwardemail.net',
        'redis.forwardemail.net',
        'sqlite.forwardemail.net'
      ]
).sort();

async function ips(ctx, next) {
  try {
    if (!ctx.client || !ctx.resolver)
      throw new TypeError('ctx.client or ctx.resolver missing');

    // check if cache available
    let cache = await ctx.client.get('ips');

    // to render `txt` files with or without comments (hostnames / ipv4 / ipv6 sections)
    const hasComments =
      typeof ctx.query.comments === 'string'
        ? boolean(ctx.query.comments)
        : true;

    let obj = cache ? JSON.parse(cache) : {};

    //
    // use tangerine to resolve all of our hostnames A/AAAA records
    // (and validate existing cache object)
    // - api
    // - bree
    // - caldav
    // - carddav
    // - imap
    // - pop3
    // - smtp
    // - web
    // - mx1
    // - mx2
    // - (sqlite is excluded)
    //
    await Promise.all(
      HOSTNAMES.map(async (hostname) => {
        // validate cache if any
        if (
          !obj[hostname] ||
          !Array.isArray(obj[hostname].ipv4) ||
          obj[hostname].ipv4.length === 0
          // !Array.isArray(obj[hostname].ipv6) ||
          // obj[hostname].ipv6.length === 0
        )
          cache = false;

        // if no cache then attempt to fetch and populate obj
        if (!cache) {
          const [ipv4, ipv6] = await Promise.all([
            (async () => {
              try {
                const ipv4 = await ctx.resolver.resolve4(hostname);
                return ipv4;
              } catch (err) {
                ctx.logger.warn(err);
                return [];
              }
            })(),
            (async () => {
              try {
                const ipv6 = await ctx.resolver.resolve6(hostname);
                return ipv6;
              } catch (err) {
                ctx.logger.warn(err);
                return [];
              }
            })()
          ]);
          obj[hostname] = {
            ipv4,
            ipv6
          };
        }
      })
    );

    // sort by A-Z hostname so it's always consistent in ordering
    // <https://github.com/lodash/lodash/issues/1459#issuecomment-253969771>
    // obj = _.chain(obj).toPairs().sortBy(0).fromPairs().value();
    const pairs = _.toPairs(obj);
    const sortedPairs = _.sortBy(pairs, 0);
    obj = Object.fromEntries(sortedPairs);

    // if cache not set then cache for 1 day
    if (!cache)
      ctx.client
        .set('cache', JSON.stringify(obj), 'PX', ms('1d'))
        .then()
        .catch((err) => ctx.logger.fatal(err));

    // cache for 1 day
    ctx.set('Cache-Control', `public, max-age=${ms('1d') / 1000}`);

    //
    // obj = {
    //   'api.forwardemail.net': {
    //     ipv4: [ '...', '...' ],
    //     ipv6': [ '...', '...' ],
    //   },
    //   ...
    // }
    //
    switch (ctx.pathWithoutLocale) {
      case '/ips/hostnames.json': {
        ctx.type = 'application/json';
        ctx.body = HOSTNAMES;
        break;
      }

      case '/ips/hostnames.txt': {
        ctx.type = 'text/plain';
        ctx.body = HOSTNAMES.join('\n').trim();
        break;
      }

      case '/ips/v4.json': {
        // [
        //   { hostname: 'api.forwardemail.net', ipv4: [ '...', '...' ] },
        //   ...
        // ]
        ctx.type = 'application/json';
        ctx.body = Object.keys(obj).map((hostname) => ({
          hostname,
          ipv4: obj[hostname].ipv4
        }));

        break;
      }

      case '/ips/v6.json': {
        ctx.type = 'application/json';
        ctx.body = Object.keys(obj).map((hostname) => ({
          hostname,
          ipv6: obj[hostname].ipv6
        }));

        break;
      }

      case '/ips/v4':
      case '/ips/v4.txt': {
        ctx.type = 'text/plain';

        // one per line with commented hostname beforehand (unless querystring for without comments)
        const arr = [];
        for (const hostname of Object.keys(obj)) {
          if (obj[hostname].ipv4.length === 0) continue;
          if (hasComments) arr.push(`# ${hostname}`);
          if (hasComments) arr.push('## ipv4');
          arr.push(...obj[hostname].ipv4);
        }

        ctx.body = arr.join('\n').trim();

        break;
      }

      case '/ips/v6':
      case '/ips/v6.txt': {
        ctx.type = 'text/plain';

        // one per line with commented hostname beforehand (unless querystring for without comments)
        const arr = [];
        for (const hostname of Object.keys(obj)) {
          if (obj[hostname].ipv6.length === 0) continue;
          if (hasComments) arr.push(`# ${hostname}`);
          if (hasComments) arr.push('## ipv6');
          arr.push(...obj[hostname].ipv6);
        }

        ctx.body = arr.join('\n').trim();

        break;
      }

      case '/ips.json': {
        ctx.type = 'application/json';

        ctx.body = Object.keys(obj).map((hostname) => ({
          hostname,
          ipv4: obj[hostname].ipv4,
          ipv6: obj[hostname].ipv6
        }));

        break;
      }

      case '/ips.txt': {
        ctx.type = 'text/plain';
        // one per line with commented hostname beforehand (unless querystring for without comments)
        const arr = [];
        for (const hostname of Object.keys(obj)) {
          if (
            obj[hostname].ipv4.length === 0 &&
            obj[hostname].ipv6.length === 0
          )
            continue;
          if (hasComments) arr.push(`# ${hostname}`);
          if (obj[hostname].ipv4.length > 0) {
            if (hasComments) arr.push('## ipv4');
            arr.push(...obj[hostname].ipv4);
          }

          if (obj[hostname].ipv6.length > 0) {
            if (hasComments) arr.push('## ipv6');
            arr.push(...obj[hostname].ipv6);
          }

          if (hasComments) arr.push('');
        }

        ctx.body = arr.join('\n').trim();

        break;
      }

      case '/ips': {
        const ips = [];
        const ipv4 = [];
        const ipv6 = [];

        for (const hostname of Object.keys(obj)) {
          // all
          ips.push(...obj[hostname].ipv4, ...obj[hostname].ipv6);

          // ipv4
          ipv4.push(...obj[hostname].ipv4);

          // ipv6
          ipv6.push(...obj[hostname].ipv6);
        }

        ctx.state.ips = ips.join('\n').trim();
        ctx.state.ipv4 = ipv4.join('\n').trim();
        ctx.state.ipv6 = ipv6.join('\n').trim();
        ctx.state.hostnames = HOSTNAMES.join('\n').trim();
        return ctx.render('ips');
      }

      default: {
        // 404 otherwise
        return next();
      }
    }
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.clientTimeout(ctx.translate('WEBSITE_OUTAGE'));
  }
}

module.exports = ips;
