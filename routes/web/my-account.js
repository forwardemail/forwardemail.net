const Router = require('@koa/router');
const render = require('koa-views-render');

const policies = require('../../helpers/policies');
const web = require('../../app/controllers/web');

const router = new Router({ prefix: '/my-account' });

router.use(policies.ensureLoggedIn);
router.use(web.breadcrumbs);
router.use(web.myAccount.retrieveDomains);
router.get('/', ctx => {
  ctx.redirect(ctx.state.l('/my-account/domains'));
});
router.delete('/', web.myAccount.remove);
router.get('/domains', render('my-account/domains'));
router.get('/domains/new', web.myAccount.createDomain);
router.post('/domains/new', web.myAccount.createDomain);
router.delete(
  '/domains/:id',
  web.myAccount.retrieveDomain,
  web.myAccount.removeDomain
);
router.post(
  '/domains/:id/verify-records',
  web.myAccount.retrieveDomain,
  web.myAccount.verifyRecords
);
router.get(
  '/domains/:id',
  web.myAccount.retrieveDomain,
  render('my-account/domains/retrieve')
);
router.get('/profile', render('my-account/profile'));
router.put('/profile', web.myAccount.update);
router.delete('/security', web.myAccount.resetAPIToken);
router.get('/security', render('my-account/security'));

module.exports = router;
