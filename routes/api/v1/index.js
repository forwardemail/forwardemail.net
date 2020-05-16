const Router = require('@koa/router');

const policies = require('../../../helpers/policies');
const api = require('../../../app/controllers/api');
const web = require('../../../app/controllers/web');

const router = new Router({
  prefix: '/v1'
});

//
// hidden
//
router.get('/test', api.v1.test);
router.post('/log', api.v1.log.checkToken, api.v1.log.parseLog);

//
// restricted
//
router.get('/lookup', api.v1.restricted, api.v1.lookup);
router.get('/port', api.v1.restricted, api.v1.port);
router.get(
  '/max-forwarded-addresses',
  api.v1.restricted,
  api.v1.maxForwardedAddresses
);

//
// public
//
router.post('/account', api.v1.users.create);
router.get(
  '/account',
  policies.ensureApiToken,
  web.myAccount.ensureNotBanned,
  api.v1.users.retrieve
);
router.put(
  '/account',
  policies.ensureApiToken,
  web.myAccount.ensureNotBanned,
  api.v1.users.update
);

// domains
router.use(
  '/domains',
  policies.ensureApiToken,
  web.myAccount.ensureNotBanned,
  web.myAccount.retrieveDomains
);
router.get('/domains', api.v1.domains.list);
router.post('/domains', web.myAccount.createDomain, api.v1.domains.retrieve);
router.get(
  '/domains/:domain_id',
  web.myAccount.retrieveDomain,
  api.v1.domains.retrieve
);
router.get(
  '/domains/:domain_id/verify-records',
  web.myAccount.retrieveDomain,
  web.myAccount.verifyRecords
);
router.put(
  '/domains/:domain_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.updateDomain,
  web.myAccount.retrieveDomains,
  api.v1.domains.retrieve
);
router.delete(
  '/domains/:domain_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.removeDomain,
  web.myAccount.retrieveDomains,
  api.v1.domains.retrieve
);

// invites
router.get('/domains/:domain_id/invites', web.myAccount.retrieveInvite);
router.post(
  '/domains/:domain_id/invites',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.createInvite,
  web.myAccount.retrieveDomains,
  web.myAccount.retrieveDomain,
  api.v1.domains.retrieve
);
router.delete(
  '/domains/:domain_id/invites',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.removeInvite,
  web.myAccount.retrieveDomains,
  web.myAccount.retrieveDomain,
  api.v1.domains.retrieve
);

// members
router.put(
  '/domains/:domain_id/members/:member_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.updateMember,
  web.myAccount.retrieveDomains,
  web.myAccount.retrieveDomain,
  api.v1.domains.retrieve
);
router.delete(
  '/domains/:domain_id/members/:member_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.removeMember,
  web.myAccount.retrieveDomains,
  web.myAccount.retrieveDomain,
  api.v1.domains.retrieve
);

// aliases
router.use(
  '/domains/:domain_id/aliases',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan
);
router.get(
  '/domains/:domain_id/aliases',
  web.myAccount.retrieveAliases,
  api.v1.aliases.list
);
router.post(
  '/domains/:domain_id/aliases',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.validateAlias,
  web.myAccount.createAlias,
  api.v1.aliases.retrieve
);
router.get(
  '/domains/:domain_id/aliases/:alias_id',
  web.myAccount.retrieveAlias,
  web.myAccount.ensureAliasAdmin,
  api.v1.aliases.retrieve
);
router.put(
  '/domains/:domain_id/aliases/:alias_id',
  web.myAccount.retrieveAlias,
  web.myAccount.ensureAliasAdmin,
  web.myAccount.validateAlias,
  web.myAccount.updateAlias,
  api.v1.aliases.retrieve
);
router.delete(
  '/domains/:domain_id/aliases/:alias_id',
  web.myAccount.retrieveAlias,
  web.myAccount.ensureAliasAdmin,
  web.myAccount.removeAlias,
  api.v1.aliases.retrieve
);

module.exports = router;
