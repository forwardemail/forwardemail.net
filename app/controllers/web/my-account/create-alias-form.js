/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function createAliasForm(ctx, next) {
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs = [
    'my-account',
    'domains',
    {
      name: ctx.state.t('Add Alias')
    }
  ];
  return next();
}

module.exports = createAliasForm;
