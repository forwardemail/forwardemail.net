/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
// a script and its source map in the build directory the web server serves
test.before((t) => {
  const name = `source-map-test-${randomUUID()}`;
  const dir = path.join(config.buildDir, 'js');
  fs.mkdirSync(dir, { recursive: true });
  t.context.name = name;
  t.context.files = [
    path.join(dir, `${name}.js`),
    path.join(dir, `${name}.js.map`)
  ];
  fs.writeFileSync(t.context.files[0], 'window.sourceMapTest = true;\n');
  fs.writeFileSync(
    t.context.files[1],
    JSON.stringify({ version: 3, sources: ['secret.js'], mappings: '' })
  );
});
test.after.always(utils.teardownMongoose);

test.after.always(utils.teardownWebServer);

test.after.always((t) => {
  for (const file of t.context.files || []) fs.rmSync(file, { force: true });
});

test('source maps are not served outside development', async (t) => {
  const { web, name } = t.context;

  // the script itself is served
  const script = await web.get(`/js/${name}.js`);
  t.is(script.status, 200);

  for (const spelling of [
    `/js/${name}.js.map`,
    `/js//${name}.js.map`,
    `/js/./${name}.js.map`,
    `/js/${name}.js%2emap`,
    `/js/${name}.js.%6d%61%70`,
    `/js/${name}.js.MAP`,
    `/img/../js/${name}.js.map`
  ]) {
    const res = await web.get(spelling);
    t.is(res.status, 404, `${spelling}`);
    t.false(res.text.includes('secret.js'), `${spelling}`);
  }
});
