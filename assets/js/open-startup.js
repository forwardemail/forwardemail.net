/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Apex = require('apexcharts');
const _ = require('lodash');
const ms = require('ms');
const superagent = require('superagent');

const logger = require('./logger');

const charts = {};
let hash;

async function getData() {
  const res = await superagent
    .get(window.location.pathname)
    .set({
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
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
  if (hash === body.hash) return;

  hash = body.hash;

  for (const metric of body.metrics) {
    const $element = $(metric.selector);
    $element.text(metric.value);
  }

  for (const chart of body.charts) {
    if (charts[chart.selector]) {
      charts[chart.selector].updateOptions(_.omit(chart.options, 'series'));
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
