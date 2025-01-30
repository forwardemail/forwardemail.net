/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const ms = require('ms');

module.exports = {
  // <https://github.com/pillarjs/cookies#cookiesset-name--value---options-->
  // <https://github.com/koajs/generic-session/blob/master/src/session.js#L32-L38>
  httpOnly: true,
  path: '/',
  overwrite: true,
  signed: true,
  maxAge: ms('30d'),
  secure: process.env.WEB_PROTOCOL === 'https',
  // we use SameSite cookie support as an alternative to CSRF
  // <https://scotthelme.co.uk/csrf-is-dead/>
  // 'strict' is ideal, but would cause issues when redirecting out
  // for oauth flows to github, google, etc.
  sameSite: 'lax'
};
