/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const test = require('ava');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(
  path.join(__dirname, '../../assets/js/domain-search.js'),
  'utf8'
);

test('domain-search renders API error messages as text instead of HTML', async (t) => {
  const dom = new JSDOM(`
    <!doctype html>
    <html>
      <body>
        <form id="form-domain-search"><input id="domain-search-input" value="example" /></form>
        <div id="domain-search-results"></div>
        <div id="domain-search-loading"></div>
        <span id="domain-search-status"></span>
        <button id="domain-search-btn" type="submit"></button>
      </body>
    </html>
  `);
  const { document, window } = dom.window;
  const payload =
    '<img src=x onerror="window.__xss_poc=1"><script>window.__xss_poc=1</script>';
  const sandbox = {
    document,
    window,
    require(id) {
      if (id === './send-request') {
        return () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ err: { message: payload } }), 0);
          });
      }

      throw new Error(`Unexpected module: ${id}`);
    }
  };

  vm.runInNewContext(source, sandbox, {
    filename: 'assets/js/domain-search.js'
  });
  document.dispatchEvent(new window.Event('DOMContentLoaded'));
  document
    .querySelector('#form-domain-search')
    .dispatchEvent(
      new window.Event('submit', { bubbles: true, cancelable: true })
    );
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

  const results = document.querySelector('#domain-search-results');
  t.is(results.querySelectorAll('img, script').length, 0);
  t.is(results.textContent.trim(), payload);
  t.true(results.innerHTML.includes('&lt;script&gt;'));
});
