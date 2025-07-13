/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');
const multer = require('@koa/multer');
const paginate = require('koa-ctx-paginate');

const policies = require('#helpers/policies');
const web = require('#controllers/web');

const router = new Router({ prefix: '/admin' });

const upload = multer();

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
  .get('/users', paginate.middleware(10, 50), web.admin.users.list)
  .get('/users/:id', web.admin.users.retrieve)
  .put('/users/:id', web.admin.users.update)
  .post('/users/:id/login', web.admin.users.login)
  .delete('/users/:id', web.admin.users.remove)

  // inquiries
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
  .get('/domains', paginate.middleware(10, 50), web.admin.domains.list)
  .put('/domains/:id', web.admin.domains.update)
  .delete('/domains/:id', web.admin.domains.remove)

  // logs
  .get('/logs', paginate.middleware(10, 50), web.admin.logs.list)
  .get('/logs/:id', web.admin.logs.retrieve)

  // emails
  .get('/emails', paginate.middleware(10, 50), web.admin.emails.list)
  .get('/emails/:id', web.admin.emails.retrieve)
  .put('/emails/:id', web.admin.emails.update)
  .delete('/emails/:id', web.admin.emails.remove)

  // payments
  .get('/payments', paginate.middleware(10, 50), web.admin.payments.list)
  .get('/payments/:id', web.admin.payments.retrieve)
  .post('/payments/:id/refund', web.admin.payments.refund)
  .post('/free-credit', web.admin.payments.freeCredit)

  // enterprise - specific routes first (all specific paths before parameterized routes)
  .get('/enterprise/dashboard', web.admin.enterprise.dashboard)

  // enterprise accounts (specific paths)
  .get(
    '/enterprise/accounts',
    paginate.middleware(10, 50),
    web.admin.enterpriseAccount.list
  )
  .get('/enterprise/accounts/:id', web.admin.enterpriseAccount.retrieve)
  .post('/enterprise/accounts/:id', web.admin.enterpriseAccount.update)
  .post('/enterprise/accounts/:id/remove', web.admin.enterpriseAccount.remove)

  // enterprise - general routes (must come after all specific paths)
  .get('/enterprise', paginate.middleware(10, 50), web.admin.enterprise.list)
  .post('/enterprise/convert', web.admin.enterprise.convert)
  .get('/enterprise/:id', web.admin.enterprise.retrieve)
  .post('/enterprise/:id', web.admin.enterprise.update)
  .post('/enterprise/:id/remove', web.admin.enterprise.remove);

module.exports = router;
