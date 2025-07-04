/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

async function createSupportForm(ctx) {
  return ctx.render('my-account/support/create');
}

module.exports = createSupportForm;
