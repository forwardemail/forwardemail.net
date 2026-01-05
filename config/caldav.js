/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Cabin = require('cabin');
const ipaddr = require('ipaddr.js');
const isFQDN = require('is-fqdn');
const sharedConfig = require('@ladjs/shared-config');

const routes = require('../routes');

const env = require('./env');

const config = require('.');
const koaRedirectBackPolyfill = require('#helpers/koa-redirect-back-polyfill');

const createTangerine = require('#helpers/create-tangerine');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');

const sharedCalDAVConfig = sharedConfig('CALDAV');

const RATELIMIT_ALLOWLIST =
  typeof env.RATELIMIT_ALLOWLIST === 'string'
    ? env.RATELIMIT_ALLOWLIST.split(',')
    : Array.isArray(env.RATELIMIT_ALLOWLIST)
    ? env.RATELIMIT_ALLOWLIST
    : [];

// function formatDate(date) {
//   return moment(date).utc().format('YYYYMMDDTHHmmss[Z]');
// }

// TODO: add scheduling support
// <https://github.com/sedenardi/node-caldav-adapter/blob/3acc55fcb615adc8cc394b7c63dbc702a498d591/README.md?plain=1#L253-L255>
//
// 3.2.1. Organizer Scheduling Object Resources
//
// An "Organizer" can create, modify, or remove a scheduling object resource, subject to access privileges,
// preconditions, and the restrictions defined in Section 4.1 of [RFC4791]. These operations are each described
// next, and how they are invoked via HTTP requests is described in Section 3.2.3.
//
// The "Organizer" of a calendar component can also be an "Attendee" of that calendar component.
// In such cases, the server MUST NOT send a scheduling message to the "Attendee" that matches the "Organizer".
//
// The server SHOULD reject any attempt to set the "PARTSTAT" iCalendar property parameter value of the
// "ATTENDEE" iCalendar property of other users in the calendar object resource to a value other than
// "NEEDS-ACTION" if the "SCHEDULE-AGENT" property parameter value is not present or set to the value "SERVER".
//
// The server MAY reject attempts to create a scheduling object resource that specifies a "UID"
// property value already specified in a scheduling object resource contained in another calendar
// collection of the "Organizer".
//

// TODO: submit PR to include Forward Email in this list
// <https://github.com/natelindev/tsdav/blob/c884cbc006f049c16f5c5c5bc964f1c7c83a9c01/docs/docs/intro.md?plain=1#L11>
// <https://github.com/natelindev/tsdav/blob/c884cbc006f049c16f5c5c5bc964f1c7c83a9c01/docs/docs/cloud%20providers.md#fastmail>

// TODO: move this to `caldav-server.js` similar to `imap-server.js` (?)
// <https://github.com/sedenardi/node-caldav-adapter/issues/14>

// setup our Cabin instance
const cabin = new Cabin({ logger });

module.exports = {
  ...sharedCalDAVConfig,
  ...config,
  rateLimit: {
    ...sharedCalDAVConfig.rateLimit,
    ...config.rateLimit
  },
  bodyParser: false,
  removeTrailingSlashes: false,
  passport: false,
  auth: false,
  routes: routes.caldav,
  logger: cabin,
  i18n,
  hookBeforeSetup(app) {
    // Koa v3 polyfill for ctx.redirect('back')
    // @see https://github.com/koajs/koa/releases/tag/v3.0.0
    app.use(koaRedirectBackPolyfill({ fallbackUrl: '/' }));

    app.context.resolver = createTangerine(
      app.context.client,
      app.context.logger
    );
    app.use(async (ctx, next) => {
      // convert local IPv6 addresses to IPv4 format
      // <https://blog.apify.com/ipv4-mapped-ipv6-in-nodejs/>
      if (ipaddr.isValid(ctx.request.ip)) {
        const addr = ipaddr.parse(ctx.request.ip);
        if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress())
          ctx.request.ip = addr.toIPv4Address().toString();
      }

      // if we need to allowlist certain IP which resolve to our hostnames
      if (ctx.resolver) {
        try {
          // maximum of 3s before ac times out
          const abortController = new AbortController();
          const timeout = setTimeout(() => abortController.abort(), 3000);
          const [clientHostname] = await ctx.resolver.reverse(
            ctx.request.ip,
            abortController
          );
          clearTimeout(timeout);
          if (isFQDN(clientHostname)) {
            if (RATELIMIT_ALLOWLIST.includes(clientHostname))
              ctx.allowlistValue = clientHostname;
            else {
              const rootClientHostname = parseRootDomain(clientHostname);
              if (RATELIMIT_ALLOWLIST.includes(rootClientHostname))
                ctx.allowlistValue = rootClientHostname;
            }
          }
        } catch (err) {
          ctx.logger.warn(err);
        }
      }

      return next();
    });
  }
  // bodyParserIgnoredPathGlobs: ['/v1/log', '/v1/emails']
};
