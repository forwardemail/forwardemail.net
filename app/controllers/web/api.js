/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const isbot = require('isbot');

const Meta = require('koa-meta');
const RE2 = require('re2');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { isIP } = require('@forwardemail/validator');

const isEmail = require('#helpers/is-email');
const config = require('#config');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

const fallbackApiDocs = path.join(config.views.root, 'api', 'index.pug');

async function api(ctx) {
  const isBot = isbot(ctx.get('User-Agent'));

  if (!isBot) {
    return ctx.render('email-api');
  }

  ctx.state.email = ctx.state.user ? ctx.state.user.email : '';

  if (
    isSANB(ctx.query.domain) &&
    (isFQDN(ctx.query.domain) || isIP(ctx.query.domain))
  )
    ctx.state.domain_name = ctx.query.domain;
  else if (Array.isArray(ctx.state.domains) && ctx.state.domains.length > 0)
    ctx.state.domain_name = ctx.state.domains[0].name;

  if (isSANB(ctx.query.email) && isEmail(ctx.query.email))
    ctx.state.email = ctx.query.email;

  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

  const html = pug
    .renderFile(fallbackApiDocs, ctx.state)
    .replace(new RE2(/BASE_URI/g), config.urls.api)
    .replace(new RE2(/AMP4EMAIL/g), 'amp4email')
    .replace(
      new RE2(/EMAIL/g),
      encodeURIComponent(ctx.state.email || 'user@gmail.com')
    )
    .replace(new RE2(/amp4email/g), 'AMP4EMAIL')
    .replace(new RE2(/DOMAIN_NAME/g), ctx.state.domain_name || 'example.com')
    .replace(new RE2(/ALIAS_ID/g), ':alias_id')
    .replace(new RE2(/MEMBER_ID/g), ':member_id');

  ctx.body = html;
}

module.exports = api;
