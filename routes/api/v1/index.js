const Router = require('@koa/router');

const api = require('#controllers/api');
const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const router = new Router({
  prefix: '/v1'
});

router
  //
  // hidden
  //
  .get('/test', api.v1.test)
  .post('/log', api.v1.log.checkToken, api.v1.log.parseLog)
  .post('/stripe', api.v1.stripe)
  .post('/paypal', api.v1.paypal)

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

  //
  // public
  //
  .post('/account', rateLimit(5, 'create user'), api.v1.users.create)
  .get(
    '/account',
    policies.ensureApiToken,
    api.v1.enforcePaidPlan,
    web.myAccount.ensureNotBanned,
    api.v1.users.retrieve
  )
  .put(
    '/account',
    policies.ensureApiToken,
    api.v1.enforcePaidPlan,
    web.myAccount.ensureNotBanned,
    api.v1.users.update
  );

// domains
router
  .use(
    '/domains',
    policies.ensureApiToken,
    api.v1.enforcePaidPlan,
    web.myAccount.ensureNotBanned,
    web.myAccount.retrieveDomains
  )
  .get('/domains', api.v1.domains.list)
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
  );

module.exports = router;
