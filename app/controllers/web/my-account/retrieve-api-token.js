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
// no-store caching headers. A JSON object is not valid script on its own, so
// another site cannot read it with a <script> tag, and no CORS headers are
// sent for it to be read with fetch.
//
async function retrieveAPIToken(ctx) {
  const token = ctx.state.user[config.userFields.apiToken];
  if (ctx.state.user[config.userFields.apiTokenDisabled] || !isSANB(token))
    throw Boom.notFound(ctx.translateError('API_TOKEN_DISABLED'));

  ctx.body = { api_token: token };
}

module.exports = retrieveAPIToken;
