const Router = require('@koa/router');

const policies = require('../../../helpers/policies');
const api = require('../../../app/controllers/api');
const web = require('../../../app/controllers/web');

const router = new Router({
  prefix: '/v1'
});

router.get('/test', api.v1.test);
router.get('/lookup', api.v1.lookup);
router.get('/port', api.v1.port);
router.post('/log', api.v1.log.checkToken, api.v1.log.parseLog);
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
/*
router.use('/domains', policies.ensureApiToken);
router.get('/domains', api.v1.domains.list);
router.get('/domains', api.v1.domains.list);
router.post('/domains', api.v1.domains.create);
router.get('/domains/:domain_id', api.v1.domains.retrieve);
router.put('/domains/:domain_id', api.v1.domains.update);
router.delete('/domains/:domain_id', api.v1.domains.remove);
router.get('/domains/:domain_id/aliases', api.v1.aliases.list);
router.post('/domains/:domain_id/aliases', api.v1.aliases.create);
router.get('/domains/:domain_id/aliases/:alias_id', api.v1.aliases.retrieve);
router.put('/domains/:domain_id/aliases/:alias_id', api.v1.aliases.update);
router.delete('/domains/:domain_id/aliases/:alias_id', api.v1.aliases.remove);
*/

module.exports = router;
