/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');

const v1 = require('./v1');

const router = new Router();

router
  // status page crawlers often send `HEAD /` requests
  .get('/', (ctx) => {
    ctx.body = 'OK';
  })
  .use(v1.routes());

module.exports = router;
