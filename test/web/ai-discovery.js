/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

test('GET /.well-known/ai-catalog.json returns an AI Catalog 1.0 document', async (t) => {
  const res = await t.context.web.get('/.well-known/ai-catalog.json');
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /^application\/ai-catalog\+json/);
  t.is(res.headers['access-control-allow-origin'], '*');

  const catalog = JSON.parse(res.text);
  t.is(catalog.specVersion, '1.0');
  t.is(catalog.host.displayName, 'Forward Email');
  t.true(Array.isArray(catalog.entries) && catalog.entries.length > 0);
  for (const entry of catalog.entries) {
    t.is(typeof entry.identifier, 'string');
    t.is(typeof entry.type, 'string');
    // exactly one of url or data
    t.true(Boolean(entry.url) !== Boolean(entry.data));
  }

  const mcp = catalog.entries.find(
    (entry) => entry.type === 'application/mcp-server-card+json'
  );
  t.is(mcp.url, `${config.urls.web}/.well-known/mcp/server-card.json`);
});

test('every URL in the AI Catalog resolves on this server', async (t) => {
  const res = await t.context.web.get('/.well-known/ai-catalog.json');
  const { entries } = JSON.parse(res.text);
  for (const { url } of entries) {
    const { pathname } = new URL(url);

    const linked = await t.context.web.get(pathname);
    t.is(linked.status, 200, `${pathname} should resolve`);
  }
});

test('GET /.well-known/api-catalog returns an RFC 9727 linkset', async (t) => {
  const res = await t.context.web.get('/.well-known/api-catalog');
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /^application\/linkset\+json/);
  t.regex(res.headers.link, /rel="api-catalog"/);

  const { linkset } = JSON.parse(res.text);
  t.true(Array.isArray(linkset) && linkset.length > 0);
  t.is(linkset[0]['service-desc'][0].href, `${config.urls.web}/api-spec.json`);
});

test('GET /.well-known/mcp/server-card.json describes the npm MCP server', async (t) => {
  const res = await t.context.web.get('/.well-known/mcp/server-card.json');
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /^application\/mcp-server-card\+json/);

  const card = JSON.parse(res.text);
  t.is(card.packages[0].registryType, 'npm');
  t.is(card.packages[0].identifier, '@forwardemail/mcp-server');
  t.is(card.packages[0].transport.type, 'stdio');
  t.true(
    card.packages[0].environmentVariables.some(
      (v) => v.name === 'FORWARD_EMAIL_API_KEY' && v.isRequired && v.isSecret
    )
  );
});

test('robots.txt allows AI agents and points at the discovery documents', async (t) => {
  const res = await t.context.web.get('/robots.txt');
  t.is(res.status, 200);
  t.regex(res.text, /Content-Signal: search=yes, ai-input=yes, ai-train=yes/);
  t.regex(res.text, /User-agent: OAI-SearchBot\nDisallow:\n/);
  t.regex(res.text, /\/\.well-known\/ai-catalog\.json/);
});

test('revisioned build assets are cached as immutable for a year', async (t) => {
  const manifest = JSON.parse(fs.readFileSync(config.manifest, 'utf8'));
  const file = Object.values(manifest).find((f) =>
    /^js\/.+\.[\da-f]{8}\.js$/.test(f)
  );
  t.truthy(file, 'expected a revisioned js file in the rev manifest');

  // first request (cold koa-cash) and a repeat must both carry the header
  for (let i = 0; i < 2; i++) {
    const res = await t.context.web.get(`/${file}`);
    t.is(res.status, 200);
    t.is(res.headers['cache-control'], 'public, max-age=31536000, immutable');
  }
});

test('home page links the API catalog and llms.txt from <head>', async (t) => {
  const res = await t.context.web.get('/en');
  t.is(res.status, 200);
  t.regex(
    res.text,
    /<link rel="api-catalog" href="[^"]+\/\.well-known\/api-catalog"/
  );
  t.regex(
    res.text,
    /<link rel="alternate" href="[^"]+\/llms\.txt" type="text\/markdown"/
  );
});
