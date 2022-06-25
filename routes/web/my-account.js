const Router = require('@koa/router');
const paginate = require('koa-ctx-paginate');
const render = require('koa-views-render');

const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const router = new Router({ prefix: '/my-account' });

router
  .use(policies.ensureLoggedIn)
  .use(policies.ensureOtp)
  .use(web.myAccount.ensureNotBanned)
  .use(web.breadcrumbs)
  .use(web.myAccount.retrieveDomains)
  .get('/', (ctx) => {
    ctx.redirect(ctx.state.l('/my-account/domains'));
  })
  .delete('/', web.myAccount.remove)
  .get(
    '/billing',
    web.myAccount.retrieveBilling,
    paginate.middleware(10, 50),
    web.myAccount.listBilling
  )
  .delete(
    '/billing',
    web.myAccount.cancelSubscription,
    web.myAccount.retrieveBilling,
    paginate.middleware(10, 50),
    web.myAccount.listBilling
  )
  .post('/billing/manage-payments', web.myAccount.manageBilling)
  .get('/billing/make-payment', web.myAccount.retrieveDomainBilling)
  .post('/billing/make-payment', web.myAccount.createDomainBilling)
  .get('/billing/upgrade', web.myAccount.retrieveDomainBilling)
  .post('/billing/upgrade', web.myAccount.createDomainBilling)
  .get('/billing/:reference', web.myAccount.retrieveReceipt)
  .get('/domains', paginate.middleware(10, 50), web.myAccount.listDomains)
  .post(
    '/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias
  )
  .get(
    '/domains/new',
    web.myAccount.createDomainForm,
    render('my-account/domains/new')
  )
  .post(
    '/domains/new',
    web.myAccount.validateDomain,
    rateLimit(50, 'create domain'),
    web.myAccount.createDomain
  )

  .get('/domains/:domain_id/invites', web.myAccount.retrieveInvite)

  .post(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(10, 'create invite'),
    web.myAccount.createInvite
  )

  .delete(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeInvite
  )

  .put(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.updateMember
  )

  .delete(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeMember
  )
  .get(
    '/domains/:domain_id/advanced-settings',
    web.myAccount.retrieveDomain,
    render('my-account/domains/advanced-settings')
  )
  .put(
    '/domains/:domain_id/advanced-settings',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.updateDomain
  )
  .get(
    '/domains/:domain_id/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAliases,
    paginate.middleware(10, 50),
    web.myAccount.listAliases
  )
  .get(
    '/domains/aliases/new',
    web.myAccount.createAliasForm,
    render('my-account/domains/aliases/form')
  )
  .post(
    '/domains/aliases/new',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias
  )
  .get(
    '/domains/:domain_id/aliases/new',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    render('my-account/domains/aliases/form')
  )
  .post(
    '/domains/:domain_id/aliases/new',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias
  )
  .post(
    '/domains/:domain_id/aliases/import',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.importAliases
  )
  .get(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    render('my-account/domains/aliases/form')
  )
  .put(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.validateAlias,
    web.myAccount.updateAlias
  )
  .delete(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.removeAlias
  )
  .get(
    '/domains/:domain_id/billing',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/domains/:domain_id/billing',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.createDomainBilling
  )
  .post(
    '/domains/:domain_id/verify-records',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.verifyRecords
  )
  .delete(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.removeDomain
  )
  .get(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    render('my-account/domains/retrieve')
  )
  .get(
    '/change-email/:token',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    render('change-email')
  )
  .post(
    '/change-email/:token',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    web.auth.changeEmail
  )
  .get('/profile', web.myAccount.retrieveProfile)
  .put('/profile', web.myAccount.updateProfile)
  .put('/profile/resend-email-change', web.myAccount.resendEmailChange)
  .put('/profile/cancel-email-change', web.myAccount.cancelEmailChange)
  .delete('/security', web.myAccount.resetAPIToken)
  .get('/security', render('my-account/security'))
  .post('/recovery-keys', web.myAccount.recoveryKeys);

module.exports = router;
