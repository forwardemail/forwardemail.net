/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Router = require('@koa/router');

const router = new Router();

router
  // status page crawlers often send `HEAD /` requests
  .get('/', (ctx) => {
    ctx.body = 'OK';
  });

module.exports = router;
