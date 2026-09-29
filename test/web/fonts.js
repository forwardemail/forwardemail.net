/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const fs = require('node:fs');
const path = require('node:path');

const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

// the Font Awesome subset the build wrote (see faSubset in gulpfile.js)
function builtSubset(name) {
  const dir = path.join(config.buildDir, 'fonts');
  const file = fs
    .readdirSync(dir)
    .find((f) => new RegExp(`^${name}-[\\da-f]{10}\\.woff2$`).test(f));
  if (!file) throw new Error(`no ${name} subset in ${dir}`);
  return {
    file,
    subset: fs.readFileSync(path.join(dir, file)),
    full: fs.readFileSync(path.join(dir, `${name}.woff2`))
  };
}

test('the stylesheet points at the Font Awesome subset the build wrote', (t) => {
  const { file, subset, full } = builtSubset('fa-solid-900');
  const css = fs.readFileSync(path.join(config.buildDir, 'css', 'app.css'));
  t.true(css.includes(`/fonts/${file}`));
  t.false(css.includes('/fonts/fa-solid-900.woff2'));
  t.true(subset.length < full.length);
});

test('serves the current Font Awesome subset', async (t) => {
  const { web } = t.context;
  const { file, subset } = builtSubset('fa-solid-900');
  const res = await web.get(`/fonts/${file}`).responseType('blob');
  t.is(res.status, 200);
  t.is(res.headers['content-type'], 'font/woff2');
  t.true(Buffer.from(res.body).equals(subset));
});

test('an earlier build’s Font Awesome subset gets the complete font', async (t) => {
  const { web } = t.context;
  for (const name of ['fa-solid-900', 'fa-regular-400', 'fa-brands-400']) {
    const { file, full } = builtSubset(name);
    // a name this build does not have (a page opened before a deploy)
    const hash = file.endsWith('-0000000000.woff2')
      ? '1111111111'
      : '0000000000';
    const stale = `${name}-${hash}.woff2`;
    const res = await web.get(`/fonts/${stale}`).responseType('blob');
    t.is(res.status, 200, stale);
    t.is(res.headers['content-type'], 'font/woff2', stale);
    t.true(Buffer.from(res.body).equals(full), stale);
  }
});

test('other font paths are not rewritten', async (t) => {
  const { web } = t.context;
  for (const spelling of [
    '/fonts/fa-solid-900-0000000000.woff',
    '/fonts/fa-light-300-0000000000.woff2',
    '/fonts/fa-solid-900-000000000.woff2',
    '/fonts/nested/fa-solid-900-0000000000.woff2'
  ]) {
    const res = await web.get(spelling);
    t.is(res.status, 404, `${spelling}`);
  }

  // only GET and HEAD are rewritten
  const res = await web.post('/fonts/fa-solid-900-0000000000.woff2');
  t.not(res.status, 200);
  t.not(res.headers['content-type'], 'font/woff2');
});
