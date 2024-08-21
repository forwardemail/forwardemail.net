/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const dayjs = require('dayjs-with-plugins');
const multer = require('@koa/multer');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');

const api = require('#controllers/api');
const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const config = require('#config');

const upload = multer();

const router = new Router({
  prefix: '/v1'
});

//
// support form data (multipart/form-data)
//
router.use(upload.none());

router
  //
  // hidden
  //
  .get('/test', api.v1.test)
  .post(
    '/log',
    async (ctx, next) => {
      try {
        // check if we provided an API secret (e.g. from bree)
        await api.v1.restricted(ctx);
      } catch {
        // check the API token of the logged in user
        await api.v1.log.checkToken(ctx);
      }

      return next();
    },
    //
    // rate limit logs sent from users
    //
    // NOTE: the rate limit helper does not rate limit API secrets
    //       however the global rate limiter does
    //       (but we whitelist the IP addresses of our servers)
    //
    rateLimit(100, 'log'),
    bodyParser({
      jsonLimit: '2mb'
    }),
    api.v1.log.parseLog
  )
  .post('/stripe', api.v1.stripe)
  .post('/paypal', api.v1.paypal)
  // <https://api.forwardemail.net/v1/apple>
  .post('/apple', api.v1.apple)

  //
  // restricted
  //
  .get('/lookup', api.v1.restricted, api.v1.lookup)
  .get('/port', api.v1.restricted, api.v1.port)
  .get('/settings', api.v1.restricted, api.v1.settings)
  .get(
    '/max-forwarded-addresses',
    api.v1.restricted,
    api.v1.maxForwardedAddresses
  )
  .post('/self-test', api.v1.restricted, api.v1.selfTest)
  .post('/upgrade', api.v1.restricted, api.v1.upgrade)

  //
  // public
  //
  .post('/account', rateLimit(5, 'create user'), api.v1.users.create)
  .post('/encrypt', rateLimit(50, 'encrypt'), web.encryptTxt)
  .get(
    '/account',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate,
    api.v1.users.retrieve
  )
  .put(
    '/account',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate,
    api.v1.users.update
  );

// logs
router.get(
  '/logs/download',
  policies.ensureApiToken,
  policies.checkVerifiedEmail,
  web.myAccount.ensureNotBanned,
  api.v1.enforcePaidPlan,
  web.myAccount.ensurePaidToDate,
  rateLimit(10, 'download logs'),
  web.myAccount.retrieveDomains,
  web.myAccount.listLogs
);

// emails
router
  .use(
    '/emails',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate
  )
  .get(
    '/emails',
    rateLimit(100, 'list emails'),
    paginate.middleware(10, 50),
    web.myAccount.retrieveDomains,
    web.myAccount.listEmails,
    api.v1.emails.list
  )
  .get('/emails/limit', rateLimit(100, 'get email limit'), api.v1.emails.limit)
  .get(
    '/emails/:id',
    rateLimit(100, 'retrieve emails'),
    web.myAccount.retrieveEmail,
    api.v1.emails.retrieve
  )
  .post(
    '/emails',
    // TODO: rate limiting needs to be handled by Emails.queue
    rateLimit(config.smtpLimitMessages, 'create emails'),
    // NOTE: we can uncomment this later:
    // otherwise it encounters the default limit of 1000
    // rateLimit(100000, 'create emails'), // allow up to 100K max (safeguard)
    bodyParser({
      jsonLimit: '51mb'
    }),
    api.v1.emails.create
  )
  .delete(
    '/emails/:id',
    rateLimit(100, 'remove emails'),
    web.myAccount.retrieveEmail,
    web.myAccount.removeEmail,
    api.v1.emails.retrieve
  );

// domains
router
  .use(
    '/domains',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate,
    (ctx, next) => {
      //
      // starting November 1st we enforce API pagination on this endpoint
      // (unless user opts in beforehand using ?pagination=true)
      //
      const hasPagination = dayjs().isBefore('11/1/2024', 'M/D/YYYY')
        ? boolean(ctx.query.pagination)
        : true;
      if (!hasPagination) return next();
      if (typeof ctx.query.limit === 'undefined') ctx.query.limit = 1000;
      return paginate.middleware(50, 1000)(ctx, next);
    },
    web.myAccount.retrieveDomains
  )
  .get('/domains', web.myAccount.listDomains, api.v1.domains.list)
  .post(
    '/domains',
    web.myAccount.validateDomain,
    rateLimit(50, 'create domain'),
    web.myAccount.createDomain,
    api.v1.domains.retrieve
  )
  .get(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )
  .get(
    '/domains/:domain_id/verify-records',
    web.myAccount.retrieveDomain,
    web.myAccount.verifyRecords
  )
  .put(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.updateDomain,
    web.myAccount.retrieveDomains,
    api.v1.domains.retrieve
  )
  .delete(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.removeDomain,
    web.myAccount.retrieveDomains,
    api.v1.domains.retrieve
  )

  // invites
  .get('/domains/:domain_id/invites', web.myAccount.retrieveInvite)
  .post(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(10, 'create invite'),
    web.myAccount.createInvite,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )
  .delete(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeInvite,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )

  // members
  .put(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAliases,
    web.myAccount.updateMember,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )
  .delete(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAliases,
    web.myAccount.removeMember,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  );

// aliases
router
  .use(
    '/domains/:domain_id/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan
  )
  .get(
    '/domains/:domain_id/aliases',
    (ctx, next) => {
      //
      // starting November 1st we enforce API pagination on this endpoint
      // (unless user opts in beforehand using ?pagination=true)
      //
      const hasPagination = dayjs().isBefore('11/1/2024', 'M/D/YYYY')
        ? boolean(ctx.query.pagination)
        : true;
      if (!hasPagination) return next();
      if (typeof ctx.query.limit === 'undefined') ctx.query.limit = 1000;
      return paginate.middleware(50, 1000)(ctx, next);
    },
    web.myAccount.retrieveAliases,
    api.v1.aliases.list
  )
  .post(
    '/domains/:domain_id/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias,
    api.v1.aliases.retrieve
  )
  .get(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    api.v1.aliases.retrieve
  )
  .put(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.validateAlias,
    web.myAccount.updateAlias,
    api.v1.aliases.retrieve
  )
  .delete(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.removeAlias,
    api.v1.aliases.retrieve
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/generate-password',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    rateLimit(50, 'generate alias password'),
    web.myAccount.generateAliasPassword
  );

// inquiries
// router.post('/inquiries', api.v1.inquiries.create);

module.exports = router;
