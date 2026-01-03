/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Apex = require('apexcharts');
const ms = require('ms');
const superagent = require('superagent');

const logger = require('./logger');

const charts = {};
let hash;

// <https://stackoverflow.com/a/58787671>
function omit(obj, ...keys) {
  const keysToRemove = new Set(keys.flat()); // flatten the props, and convert to a Set
  return Object.fromEntries(
    // convert the entries back to object
    Object.entries(obj) // convert the object to entries
      .filter(([k]) => !keysToRemove.has(k)) // remove entries with keys that exist in the Set
  );
}

async function getData() {
  const res = await superagent
    .get(window.location.pathname + window.location.search)
    .set({
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Open-Startup': 'true'
    })
    .timeout(ms('30s'))
    .retry(3)
    .send();
  return res;
}

async function loadCharts(reset = false) {
  if (reset) hash = null;
  const { body } = await getData();

  // return early if no data changed
  if (body.hash && hash === body.hash) return;

  if (body.hash) hash = body.hash;

  for (const metric of body.metrics) {
    const $element = $(metric.selector);
    $element.text(metric.value);
  }

  for (const chart of body.charts) {
    if (charts[chart.selector]) {
      charts[chart.selector].updateOptions(omit(chart.options, 'series'));
      charts[chart.selector].updateSeries(chart.options.series);
      continue;
    }

    const $element = $(chart.selector);

    // set theme to light or dark
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      chart.options.theme = { mode: 'dark' };

    // ensure background is transparent
    chart.options.chart = Object.assign(chart.options.chart || {}, {
      background: 'transparent'
    });

    // use browser locale for tooltip date formatting
    // (this ensures dates are displayed in the user's local format)
    if (chart.options.tooltip && chart.options.tooltip.x) {
      chart.options.tooltip.x.formatter = function (value) {
        return new Intl.DateTimeFormat(window.LOCALE, {
          dateStyle: 'medium'
        }).format(new Date(value));
      };
    }

    const apex = new Apex($element.get(0), chart.options);
    $element.empty();
    apex.render();
    charts[chart.selector] = apex;
  }
}

loadCharts()
  .then()
  .catch((err) => logger.error(err));

setInterval(() => {
  loadCharts()
    .then()
    .catch((err) => logger.error(err));
}, ms('5m'));

// when the user changes theme we need to reload charts
function changeTheme() {
  for (const selector of Object.keys(charts)) {
    const chart = charts[selector];
    // set theme to light or dark
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      chart.updateOptions({
        theme: { mode: 'dark' }
      });
    } else {
      chart.updateOptions({
        theme: { mode: 'light' }
      });
    }
  }
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', changeTheme);

window
  .matchMedia('(prefers-color-scheme: light)')
  .addEventListener('change', changeTheme);
