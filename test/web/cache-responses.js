/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Responses cached in Redis (koa-cash) are kept for a year under their path,
// and a deploy does not clear them.  That suits revisioned files, whose path
// changes with their content, but not files that keep their path when they
// change: robots.txt, llms.txt and the discovery documents would be served as
// they were a year before.
//

const process = require('node:process');

// (before the config is loaded)
process.env.CACHE_RESPONSES = 'true';

const fs = require('node:fs');

const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function isCached(t, path) {
  const first = await t.context.web.get(path);
  t.is(first.status, 200, `${path} status`);
  const second = await t.context.web.get(path);
  t.is(second.status, 200, `${path} status`);
  return second.headers['x-cached-response'] === 'HIT';
}

test('revisioned files are cached', async (t) => {
  const manifest = JSON.parse(fs.readFileSync(config.manifest, 'utf8'));
  t.true(await isCached(t, `/${manifest['css/app.css']}`));
});

test('files that keep their path when they change are not cached', async (t) => {
  for (const path of [
    '/robots.txt',
    '/llms.txt',
    '/llms-full.txt',
    '/site.webmanifest',
    '/browserconfig.xml',
    '/opensearch.xml',
    '/.well-known/ai-catalog.json',
    '/.well-known/api-catalog',
    '/.well-known/mcp/server-card.json'
  ]) {
    t.false(await isCached(t, path), `${path} is cached`);
  }
});
