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
  path.join(__dirname, '../../assets/js/dmarc-reports.js'),
  'utf8'
);

function createRenderer(
  url = 'https://forwardemail.net/my-account/domains/example.com/dmarc-reports?filter=all&page=2'
) {
  const dom = new JSDOM(
    '<!doctype html><html><body><div id="reports-table"></div><div id="reports-pagination"></div></body></html>',
    { url }
  );
  const { document, window } = dom.window;

  function jquery(target) {
    const elements =
      typeof target === 'string'
        ? [...document.querySelectorAll(target)]
        : target
        ? [target]
        : [];

    return {
      append(child) {
        for (const element of elements) element.append(child);
        return this;
      },
      empty() {
        for (const element of elements) element.replaceChildren();
        return this;
      },
      get(index) {
        return elements[index];
      },
      html(value) {
        if (typeof value === 'undefined') return elements[0]?.innerHTML;
        for (const element of elements) element.innerHTML = value;
        return this;
      },
      text(value) {
        for (const element of elements) element.textContent = value;
        return this;
      }
    };
  }

  const sandbox = {
    URLSearchParams,
    document,
    setInterval() {},
    window: Object.assign(window, {
      matchMedia() {
        return {
          addEventListener() {},
          matches: false
        };
      }
    }),
    require(id) {
      if (id === 'jquery') return jquery;
      if (id === 'apexcharts') return class Apex {};
      if (id === 'dayjs') {
        return () => ({ format: () => 'Aug 12, 2026 02:00' });
      }

      if (id === 'ms') return () => 30_000;
      if (id === 'superagent') {
        return {
          get() {
            return {
              retry() {
                return this;
              },
              send() {
                return new Promise(() => {});
              },
              set() {
                return this;
              },
              timeout() {
                return this;
              }
            };
          }
        };
      }

      if (id === './logger') return { error() {} };
      throw new Error(`Unexpected module: ${id}`);
    }
  };

  vm.runInNewContext(
    `${source}\nglobalThis.__test = { renderPagination, renderReportsTable };`,
    sandbox,
    { filename: 'assets/js/dmarc-reports.js' }
  );

  return { document, renderer: sandbox.__test };
}

test('DMARC report values are rendered as text instead of executable HTML', (t) => {
  const { document, renderer } = createRenderer();
  const payload =
    '<img src=x onerror="window.__xss_poc=1"><script>window.__xss_poc=1</script>';

  renderer.renderReportsTable([
    {
      accepted: 42,
      dkim_aligned_pct: 100,
      domain_name: payload,
      org_name: payload,
      pass_rate: 100,
      quarantined: 0,
      received_at: '2026-08-12T02:00:00.000Z',
      rejected: 0,
      spf_aligned_pct: 100,
      total_messages: 42
    }
  ]);

  const cells = document.querySelectorAll('#reports-table tbody td');
  t.is(cells[1].textContent, payload);
  t.is(cells[2].textContent, payload);
  t.is(
    document.querySelectorAll('#reports-table img, #reports-table script')
      .length,
    0
  );
  t.true(
    document
      .querySelector('#reports-table')
      .innerHTML.includes('&lt;script&gt;')
  );
});

test('DMARC pagination validates page numbers and constructs query strings safely', (t) => {
  const { document, renderer } = createRenderer();
  const payload = '<img src=x onerror="window.__xss_poc=1">';

  renderer.renderPagination(
    [
      { number: 1 },
      { number: 2 },
      null,
      { number: payload },
      { number: '2.5' }
    ],
    4,
    payload
  );

  const links = document.querySelectorAll('#reports-pagination .page-link');
  t.is(links.length, 2);
  t.is(links[0].getAttribute('href'), '?filter=all&page=1');
  t.is(links[1].getAttribute('href'), '?filter=all&page=2');
  t.true(
    document.querySelector('#reports-pagination .page-item.active') !== null
  );
  t.is(
    document.querySelectorAll(
      '#reports-pagination img, #reports-pagination script'
    ).length,
    0
  );
  t.true(
    document
      .querySelector('#reports-pagination')
      .textContent.includes('0 total reports')
  );

  const noQueryRenderer = createRenderer(
    'https://forwardemail.net/my-account/domains/example.com/dmarc-reports'
  );
  noQueryRenderer.renderer.renderPagination([{ number: 1 }], 2, 1);
  t.is(
    noQueryRenderer.document
      .querySelector('#reports-pagination .page-link')
      .getAttribute('href'),
    '?page=1'
  );
});
