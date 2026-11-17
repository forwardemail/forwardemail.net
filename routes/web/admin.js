/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');
const bytes = require('@forwardemail/bytes');
const paginate = require('koa-ctx-paginate');

const createMultipart = require('#helpers/multipart');
const enterpriseBilling = require('#helpers/enterprise-billing');
const policies = require('#helpers/policies');
const web = require('#controllers/web');

const router = new Router({ prefix: '/admin' });

// inquiry replies take up to 3 attachments (see the routes below)
// (and the body as a whole holds all three)
const upload = createMultipart(
  { limits: { files: 3, fileSize: bytes('51MB') } },
  { maxTotalBytes: bytes('160MB') }
);

//
// the agreement of an enterprise customer is one PDF (kept on the account,
// so well under the 16 MB a document can be)
//
const agreementUpload = createMultipart(
  { limits: { files: 1, fileSize: enterpriseBilling.MAX_AGREEMENT_SIZE } },
  { maxTotalBytes: enterpriseBilling.MAX_AGREEMENT_SIZE + bytes('1MB') }
);

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
  .use(policies.ensureAdmin)
  .use(policies.ensureOtp)
  .use(web.breadcrumbs)
  .get('/', web.admin.dashboard)

  // allowlist
  .get('/allowlist', paginate.middleware(10, 50), web.admin.allowlist.list)
  .post('/allowlist', web.admin.allowlist.validate, web.admin.allowlist.create)
  .delete(
    '/allowlist',
    web.admin.allowlist.validate,
    web.admin.allowlist.remove
  )

  // denylist
  .get('/denylist', paginate.middleware(10, 50), web.admin.denylist.list)
  .post('/denylist', web.admin.denylist.validate, web.admin.denylist.create)
  .delete('/denylist', web.admin.denylist.validate, web.admin.denylist.remove)

  // users
  // FWD-01-010: Accept mongodb_query via POST to prevent cross-origin timing attacks
  .post('/users', paginate.middleware(10, 50), web.admin.users.list)
  .get('/users', paginate.middleware(10, 50), web.admin.users.list)
  .get('/users/:id', web.admin.users.retrieve)
  .put('/users/:id', web.admin.users.update)
  .put('/users/:id/enterprise', web.admin.enterprise.update)
  .post('/users/:id/enterprise/payments', web.admin.enterprise.createPayment)
  .put(
    '/users/:id/enterprise/payments/:payment_id',
    web.admin.enterprise.updatePayment
  )
  .delete(
    '/users/:id/enterprise/payments/:payment_id',
    web.admin.enterprise.removePayment
  )

  // the signed agreement of an enterprise customer (one PDF)
  .get(
    '/users/:id/enterprise/agreement',
    web.admin.enterprise.retrieveAgreement
  )
  .post(
    '/users/:id/enterprise/agreement',
    agreementUpload.single('agreement'),
    web.admin.enterprise.uploadAgreement
  )
  .delete(
    '/users/:id/enterprise/agreement',
    web.admin.enterprise.removeAgreement
  )

  // enterprise customers (all of them on one sheet)
  .get('/enterprise', paginate.middleware(25, 50), web.admin.enterprise.list)
  .put('/enterprise', web.admin.enterprise.updateAll)
  .post('/users/:id/login', web.admin.users.login)
  .delete('/users/:id', web.admin.users.remove)

  // inquiries
  // FWD-01-010: Accept mongodb_query via POST to prevent cross-origin timing attacks
  .post('/inquiries', paginate.middleware(10, 50), web.admin.inquiries.list)
  .get('/inquiries', paginate.middleware(10, 50), web.admin.inquiries.list)
  .get('/inquiries/:id', web.admin.inquiries.retrieve)
  .post(
    '/inquiries/bulk',
    upload.fields([
      {
        name: 'attachments',
        maxCount: 3
      }
    ]),
    web.admin.inquiries.bulkReply
  )
  .post(
    '/inquiries/:id',
    upload.fields([
      {
        name: 'attachments',
        maxCount: 3
      }
    ]),
    web.admin.inquiries.reply
  )
  .put('/inquiries/:id', web.admin.inquiries.resolve)

  // domains
  // FWD-01-010: Accept mongodb_query via POST to prevent cross-origin timing attacks
  .post('/domains', paginate.middleware(10, 50), web.admin.domains.list)
  .get('/domains', paginate.middleware(10, 50), web.admin.domains.list)
  .post('/domains/transfer', web.admin.domains.transfer)
  .put('/domains/:id', web.admin.domains.update)
  .delete('/domains/:id', web.admin.domains.remove)

  // domain aliases (admin)
  .post(
    '/domains/:id/aliases',
    paginate.middleware(10, 50),
    web.admin.aliases.list
  )
  .get(
    '/domains/:id/aliases',
    paginate.middleware(10, 50),
    web.admin.aliases.list
  )
  .get('/domains/:id/aliases/:alias_id', web.admin.aliases.retrieve)
  .put('/domains/:id/aliases/:alias_id', web.admin.aliases.update)

  // logs
  // FWD-01-010: Accept mongodb_query via POST to prevent cross-origin timing attacks
  .post('/logs', paginate.middleware(10, 50), web.admin.logs.list)
  .get('/logs', paginate.middleware(10, 50), web.admin.logs.list)
  .get('/logs/:id', web.admin.logs.retrieve)

  // spam
  .get('/spam', paginate.middleware(10, 50), web.admin.spam.list)
  .get('/spam/stats', web.admin.spam.stats)

  // jobs
  .get('/jobs', paginate.middleware(10, 50), web.admin.jobs.list)
  .get('/jobs/detail/:name', web.admin.jobs.jobDetail)
  .get('/jobs/:id', web.admin.jobs.retrieve)

  // emails
  // FWD-01-010: Accept mongodb_query via POST to prevent cross-origin timing attacks
  .post('/emails', paginate.middleware(10, 50), web.admin.emails.list)
  .get('/emails', paginate.middleware(10, 50), web.admin.emails.list)
  .get('/emails/:id', web.admin.emails.retrieve)
  .put('/emails/:id', web.admin.emails.update)
  .delete('/emails/:id', web.admin.emails.remove)

  // payments
  // FWD-01-010: Accept mongodb_query via POST to prevent cross-origin timing attacks
  .post('/payments', paginate.middleware(10, 50), web.admin.payments.list)
  .get('/payments', paginate.middleware(10, 50), web.admin.payments.list)
  .get('/payments/:id', web.admin.payments.retrieve)
  .post('/payments/:id/refund', web.admin.payments.refund)
  .post('/free-credit', web.admin.payments.freeCredit)

  // analytics
  .get('/analytics', web.admin.analytics.dashboard)
  .get('/analytics/realtime', web.admin.analytics.realtime)
  .get('/analytics/export', web.admin.analytics.exportData)
  .get('/analytics/service/:service', web.admin.analytics.byService);

module.exports = router;
