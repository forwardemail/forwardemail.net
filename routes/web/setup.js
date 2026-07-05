/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Router = require('@koa/router');
const render = require('koa-views-render');

const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const router = new Router({ prefix: '/setup' });

router
  // 404s unless self-hosted
  .use(web.setup.ensureSetupEnabled)

  // step 1 (no admin yet): create the admin account (posts to /register)
  // otherwise dispatch to the current step
  .get('/', web.setup.dispatch)

  // step 2: create the first domain
  .get(
    '/domain',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    policies.ensureAdmin,
    render('setup/domain')
  )
  .post(
    '/domain',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    policies.ensureAdmin,
    web.myAccount.retrieveDomains,
    (ctx, next) => {
      // self-hosted admins are on the team plan; skip the billing branch
      ctx.request.body.plan = 'team';
      return next();
    },
    web.myAccount.validateDomain,
    (ctx, next) => {
      // stay in the wizard instead of the my-account redirect
      ctx.state.redirectTo = ctx.state.l(
        `/setup/dns/${punycode.toASCII(ctx.request.body.domain)}`
      );
      return next();
    },
    rateLimit(50, 'create domain'),
    web.myAccount.createDomain
  )

  // step 3: DNS checklist with live verification
  .get(
    '/dns/:domain_id',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    rateLimit(100, 'setup dns'),
    web.setup.retrieveDnsStatus
  )
  .post(
    '/dns/:domain_id/verify-records',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    rateLimit(200, 'verify records'),
    web.myAccount.verifyRecords
  );

module.exports = router;
