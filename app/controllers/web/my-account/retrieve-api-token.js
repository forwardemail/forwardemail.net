/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');

//
// The API token is no longer rendered into any page: the Show and Copy
// controls fetch it here, only when used. The my-account router already
// requires a signed-in user who passed two-factor authentication and sets
// no-store caching headers. Another site cannot read it: the session cookie
// is SameSite=Lax (not sent with its requests), CORS never allows
// credentials, and a JSON object is not valid script for a <script> tag.
//

//
// Only this site's own script may ask for the token. A link or redirect from
// another site would otherwise open it in the user's tab (a top-level
// navigation carries the Lax cookie), showing the token in plain text; a
// navigation cannot set this header, and another site's script that tries
// needs a CORS preflight, which is never granted with credentials. Checked
// before the rate limit, so such requests do not use it up.
//
function ensureAPITokenRequest(ctx, next) {
  const site = ctx.get('Sec-Fetch-Site');
  if (
    ctx.get('X-Requested-With') !== 'XMLHttpRequest' ||
    (site && site !== 'same-origin')
  )
    throw Boom.forbidden(ctx.translateError('INVALID_ORIGIN_MISMATCH'));
  return next();
}

async function retrieveAPIToken(ctx) {
  const token = ctx.state.user[config.userFields.apiToken];
  if (ctx.state.user[config.userFields.apiTokenDisabled] || !isSANB(token))
    throw Boom.notFound(ctx.translateError('API_TOKEN_DISABLED'));

  ctx.body = { api_token: token };
}

module.exports = { ensureAPITokenRequest, retrieveAPIToken };
