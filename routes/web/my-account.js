const Router = require('@koa/router');
const render = require('koa-views-render');

const policies = require('../../helpers/policies');
const web = require('../../app/controllers/web');

const router = new Router({ prefix: '/my-account' });

router.use(policies.ensureLoggedIn);
router.use(policies.ensureOtp);
router.use(web.myAccount.ensureNotBanned);
router.use(web.breadcrumbs);
router.use(web.myAccount.retrieveDomains);
router.get('/', (ctx) => {
  ctx.redirect(ctx.state.l('/my-account/domains'));
});
router.delete('/', web.myAccount.remove);
router.get('/domains', render('my-account/domains'));
router.post(
  '/aliases',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.validateAlias,
  web.myAccount.createAlias
);
router.get('/domains/new', web.myAccount.createDomain);
router.post('/domains/new', web.myAccount.createDomain);

router.get('/domains/:domain_id/invites', web.myAccount.retrieveInvite);

router.post(
  '/domains/:domain_id/invites',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureTeamPlan,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.createInvite
);

router.delete(
  '/domains/:domain_id/invites',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureTeamPlan,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.removeInvite
);

router.put(
  '/domains/:domain_id/members/:member_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureTeamPlan,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.updateMember
);

router.delete(
  '/domains/:domain_id/members/:member_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureTeamPlan,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.removeMember
);
router.get(
  '/domains/:domain_id/advanced-settings',
  web.myAccount.retrieveDomain,
  render('my-account/domains/advanced-settings')
);
router.put(
  '/domains/:domain_id/advanced-settings',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.updateDomain
);
router.get(
  '/domains/:domain_id/aliases',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.retrieveAliases,
  render('my-account/domains/aliases')
);
router.get(
  '/domains/aliases/new',
  web.myAccount.createAliasForm,
  render('my-account/domains/aliases/form')
);
router.post(
  '/domains/aliases/new',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.validateAlias,
  web.myAccount.createAlias
);
router.get(
  '/domains/:domain_id/aliases/new',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  render('my-account/domains/aliases/form')
);
router.post(
  '/domains/:domain_id/aliases/new',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.validateAlias,
  web.myAccount.createAlias
);
router.post(
  '/domains/:domain_id/aliases/import',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.importAliases
);
router.get(
  '/domains/:domain_id/aliases/:alias_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.retrieveAlias,
  web.myAccount.ensureAliasAdmin,
  render('my-account/domains/aliases/form')
);
router.put(
  '/domains/:domain_id/aliases/:alias_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.retrieveAlias,
  web.myAccount.ensureAliasAdmin,
  web.myAccount.validateAlias,
  web.myAccount.updateAlias
);
router.delete(
  '/domains/:domain_id/aliases/:alias_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureUpgradedPlan,
  web.myAccount.retrieveAlias,
  web.myAccount.ensureAliasAdmin,
  web.myAccount.removeAlias
);
router.get(
  '/domains/:domain_id/billing',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.retrieveBilling
  // render('my-account/domains/billing')
);
router.post(
  '/domains/:domain_id/verify-records',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.verifyRecords
);
router.delete(
  '/domains/:domain_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  web.myAccount.removeDomain
);
router.get(
  '/domains/:domain_id',
  web.myAccount.retrieveDomain,
  web.myAccount.ensureDomainAdmin,
  render('my-account/domains/retrieve')
);
router.get('/profile', render('my-account/profile'));
router.put('/profile', web.myAccount.update);
router.delete('/security', web.myAccount.resetAPIToken);
router.get('/security', render('my-account/security'));
router.post('/recovery-keys', web.myAccount.recoveryKeys);

module.exports = router;
