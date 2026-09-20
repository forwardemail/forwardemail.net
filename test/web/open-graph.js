/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const sharp = require('sharp');
const test = require('ava');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

// the image responses are gzip encoded (undone by the client) and cached
async function image(web, url) {
  const res = await web
    .get(url)
    .buffer(true)
    .parse((res, callback) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => callback(null, Buffer.concat(chunks)));
    });
  return { res, body: res.body };
}

test('GET /:locale/:page.png renders the Open Graph image of the page', async (t) => {
  t.timeout(60_000);
  const { web } = t.context;
  const { res, body } = await image(web, '/en/email-api.png');
  t.is(res.status, 200);
  t.is(res.headers['content-type'], 'image/png');
  t.is(res.headers['content-encoding'], 'gzip');
  t.regex(res.headers['cache-control'], /^public, max-age=\d{8}$/);

  const metadata = await sharp(body).metadata();
  t.is(metadata.format, 'png');
  t.is(metadata.width, 1200);
  t.is(metadata.height, 630);
});

test('GET /:locale/:page.svg carries the page title and address', async (t) => {
  t.timeout(60_000);
  const { web } = t.context;
  const { res, body } = await image(web, '/en/email-api.svg');
  t.is(res.status, 200);
  t.is(res.headers['content-type'], 'image/svg+xml');
  const svg = body.toString();
  t.true(svg.includes('>forwardemail.net/email-api<'));
  t.true(svg.includes('>Email API for Developers<'));
  t.true(svg.includes('>Forward Email<'));
  // no HTML from the page metadata reaches the image
  t.false(svg.includes('<span'));
  t.false(svg.includes('&amp;amp;'));
});

test('GET /:locale/index.png renders the home page image', async (t) => {
  t.timeout(60_000);
  const { web } = t.context;
  const { res, body } = await image(web, '/en/index.svg');
  t.is(res.status, 200);
  t.true(body.toString().includes('>forwardemail.net<'));
  const png = await image(web, '/en/index.jpeg');
  t.is(png.res.status, 200);
  t.is(png.res.headers['content-type'], 'image/jpeg');
  const metadata = await sharp(png.body).metadata();
  t.is(metadata.format, 'jpeg');
});

test('a long title and a translated page fit the image', async (t) => {
  t.timeout(120_000);
  const { web } = t.context;
  for (const url of [
    '/en/blog/open-source/red-hat-enterprise-linux-email-server.svg',
    '/ja/email-api.svg',
    '/ar/email-api.svg'
  ]) {
    const { res, body } = await image(web, url);
    t.is(res.status, 200, `${url}`);
    const svg = body.toString();
    // a title is present and was not replaced by a generic fallback
    t.false(svg.includes('>Private Business Email Service<'), `${url}`);
    t.regex(svg, /font-size="(64|58|52|46|40)"/, `${url}`);
  }
});

test('an unknown page redirects to the generic image', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/does-not-exist-at-all.png');
  t.is(res.status, 302);
  t.regex(res.headers.location, /^\/en\/index\.png\?v=\d+$/);
});
