/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

async function report(ctx) {
  if (ctx?.request?.body && ctx.request.body['csp-report'])
    ctx.logger.debug(ctx.request.body);
  ctx.body = 'OK';
}

module.exports = report;
