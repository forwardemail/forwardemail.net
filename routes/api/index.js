const Router = require('@koa/router');

const v1 = require('./v1');

const router = new Router();
// status page crawlers often send `HEAD /` requests
router.get('/', (ctx) => {
  ctx.body = 'OK';
});
router.use(v1.routes());

module.exports = router;
