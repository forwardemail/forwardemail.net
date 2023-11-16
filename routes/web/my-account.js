/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');
const paginate = require('koa-ctx-paginate');
const render = require('koa-views-render');

const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const router = new Router({ prefix: '/my-account' });

router
  .use((ctx, next) => {
    // don't allow robots
    ctx.set('X-Robots-Tag', 'none');
    // don't cache anything
    // <https://github.com/koa-modules/koa-no-cache/issues/5>
    ctx.set('Surrogate-Control', 'no-store');
    ctx.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', '0');
    return next();
  })
  .use(web.myAccount.ensureNotBanned)
  .use(policies.ensureLoggedIn)
  .use(policies.ensureOtp)
  .use(web.breadcrumbs)
  .use(web.myAccount.retrieveDomains)
  .use(web.myAccount.ensurePaidToDate)
  .get('/', (ctx) => {
    ctx.redirect(ctx.state.l('/my-account/domains'));
  })
  .delete(
    '/',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.remove
  )
  .get(
    '/billing',
    web.myAccount.retrieveBilling,
    web.myAccount.setConversionAndRefundStateHelpers,
    paginate.middleware(10, 50),
    web.myAccount.listBilling
  )
  .delete(
    '/billing',
    web.myAccount.cancelSubscription,
    web.myAccount.retrieveBilling,
    web.myAccount.setConversionAndRefundStateHelpers,
    paginate.middleware(10, 50),
    web.myAccount.listBilling
  )
  // deprecated old endpoint (can remove in future)
  .post('/billing/manage-payments', (ctx) =>
    ctx.redirect(ctx.state.l('/my-account/update-card'))
  )
  .get(
    '/billing/update-card',
    rateLimit(50, 'update card'),
    web.myAccount.updateCard
  )
  .post(
    '/billing/update-card',
    rateLimit(50, 'update card'),
    web.myAccount.updateCard
  )
  .get(
    '/billing/make-payment',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/billing/make-payment',
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .get(
    '/billing/enable-auto-renew',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/billing/enable-auto-renew',
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .get(
    '/billing/upgrade',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/billing/upgrade',
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  // rate limit to 3 years of receipts due to PDF downloading
  .get(
    '/billing/:reference',
    rateLimit(36, 'retrieve receipt'),
    web.myAccount.retrieveReceipt
  )
  .get('/domains', paginate.middleware(10, 50), web.myAccount.listDomains)
  // TODO: document this endpoint
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

  .post(
    '/domains/:domain_id/catch-all-passwords',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(10, 'create catch all password'),
    web.myAccount.createCatchAllPassword
  )

  .delete(
    '/domains/:domain_id/catch-all-passwords/:token_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeCatchAllPassword
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
    web.myAccount.retrieveAliases,
    web.myAccount.updateMember
  )

  .delete(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAliases,
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
    '/domains/:domain_id/verify-smtp',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    render('my-account/domains/verify-smtp')
  )
  .post(
    '/domains/:domain_id/verify-smtp',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    rateLimit(200, 'verify smtp'),
    web.myAccount.verifySMTP
  )
  .post(
    '/domains/:domain_id/change-modulus-length',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    rateLimit(20, 'change modulus length'),
    web.myAccount.changeModulusLength
  )
  .get(
    '/domains/:domain_id/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    paginate.middleware(10, 50),
    web.myAccount.retrieveAliases,
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
    rateLimit(50, 'import alias'),
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
  .post(
    '/domains/:domain_id/aliases/:alias_id/resend-verification',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    rateLimit(20, 'resend verification'),
    web.myAccount.resendVerification
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/generate-password',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    policies.ensureTurnstile,
    rateLimit(20, 'generate alias password'),
    web.myAccount.generateAliasPassword
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/download-backup',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    policies.ensureTurnstile,
    rateLimit(10, 'download alias backup'),
    web.myAccount.downloadAliasBackup
  )
  .get(
    '/domains/:domain_id/billing',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/domains/:domain_id/billing',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .post(
    '/domains/:domain_id/verify-records',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    rateLimit(200, 'verify records'),
    web.myAccount.verifyRecords
  )
  .get(
    '/emails',
    paginate.middleware(10, 50),
    rateLimit(100, 'list emails'),
    web.myAccount.listEmails
  )
  .get(
    '/emails/:id',
    rateLimit(100, 'retrieve emails'),
    web.myAccount.retrieveEmail,
    render('my-account/emails/retrieve')
  )
  .delete(
    '/emails/:id',
    rateLimit(100, 'remove emails'),
    web.myAccount.retrieveEmail,
    web.myAccount.removeEmail
  )
  .get(
    '/logs',
    paginate.middleware(10, 50),
    rateLimit(100, 'list logs'),
    web.myAccount.listLogs
  )
  .get('/logs/download', rateLimit(10, 'download logs'), web.myAccount.listLogs)
  .get(
    '/logs/:id',
    rateLimit(100, 'retrieve logs'),
    web.myAccount.retrieveLog,
    render('my-account/logs/retrieve')
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
    rateLimit(100, 'change email'),
    web.auth.changeEmail
  )
  .get('/profile', web.myAccount.retrieveProfile)
  .put('/profile', web.myAccount.updateProfile)
  .put(
    '/profile/resend-email-change',
    rateLimit(5, 'resend email change'),
    web.myAccount.resendEmailChange
  )
  .put('/profile/cancel-email-change', web.myAccount.cancelEmailChange)
  .delete('/security', web.myAccount.resetAPIToken)
  .get(
    '/security',
    (ctx, next) => {
      if (ctx.query.unsubscribe === 'true')
        ctx.flash('warning', ctx.translate('TO_UNSUBSCRIBE_DELETE_ACCOUNT'));
      return next();
    },
    render('my-account/security')
  )
  .post('/recovery-keys', web.myAccount.recoveryKeys);

module.exports = router;
