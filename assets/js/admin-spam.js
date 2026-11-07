/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const superagent = require('superagent');

const logger = require('./logger');

// loaded by its own script tag before this one (see the page view), so it
// is not factored into build.js for every page
const Apex = window.ApexCharts;

let chart;
let lastSearch;
let request = 0;

function isDark() {
  return Boolean(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function renderChart() {
  if (chart) {
    chart.destroy();
    chart = null;
  }

  const $element = $('#spam-timeline-chart');
  if ($element.length === 0 || typeof Apex !== 'function') return;
  const data = $element.data('chart');
  const dark = isDark();

  chart = new Apex($element.get(0), {
    chart: {
      type: 'area',
      height: 300,
      background: 'transparent',
      toolbar: { show: true, tools: { download: true } },
      zoom: { enabled: false }
    },
    theme: { mode: dark ? 'dark' : 'light' },
    grid: { borderColor: dark ? '#404040' : '#e0e0e0' },
    series: [{ name: 'Spam', data: data.counts }],
    xaxis: {
      categories: data.categories,
      tickAmount: Math.min(data.categories.length, 12),
      labels: { rotate: -45 }
    },
    yaxis: { min: 0, forceNiceScale: true, labels: { formatter: Math.round } },
    colors: ['#dc3545'],
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    tooltip: { theme: dark ? 'dark' : 'light' }
  });
  chart.render();
}

//
// Load the counts, the chart and the top lists for the search in the address
// bar, on page load and again when the search changes (the table's search
// form and its sort and page links update the address bar).
//
async function loadStats() {
  const $stats = $('#spam-stats');
  if ($stats.length === 0) return;

  const params = new URLSearchParams(window.location.search);
  for (const key of ['page', 'limit', 'sort']) params.delete(key);
  const search = params.toString();
  if (search === lastSearch) return;
  lastSearch = search;

  const id = ++request;
  $stats.html(
    '<div class="text-center py-5"><i class="fa fa-spin fa-spinner fa-2x text-muted"></i></div>'
  );

  try {
    const response = await superagent
      .get($stats.data('url'))
      .query(search)
      .set({
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      });
    if (id !== request) return;
    $stats.html(response.body.html);
    renderChart();
  } catch (err) {
    if (id !== request) return;
    logger.error(err);
    lastSearch = null;
    $stats.html(
      $('<div class="alert alert-danger"></div>').text(
        (err.response && err.response.body && err.response.body.message) ||
          err.message
      )
    );
  }
}

$(loadStats);
window.addEventListener('tableAjaxFormReloaded', loadStats);
window.addEventListener('popstate', loadStats);

if (window.matchMedia)
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', renderChart);
