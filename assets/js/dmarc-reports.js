/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Apex = require('apexcharts');
const dayjs = require('dayjs');
const ms = require('ms');
const superagent = require('superagent');

const logger = require('./logger');

const charts = {};
let hash;

// <https://stackoverflow.com/a/58787671>
function omit(obj, ...keys) {
  const keysToRemove = new Set(keys.flat());
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keysToRemove.has(k))
  );
}

async function getData() {
  const res = await superagent
    .get(window.location.pathname + window.location.search)
    .set({
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    })
    .timeout(ms('30s'))
    .retry(3)
    .send();
  return res;
}

function formatPercent(value) {
  if (value === 0) return '0%';
  if (value >= 100) return '100%';
  return `${value.toFixed(1)}%`;
}

function getPercentClass(value) {
  if (value >= 95) return 'text-success';
  if (value >= 80) return 'text-warning';
  return 'text-danger';
}

function renderReportsTable(reports) {
  const $table = $('#reports-table');

  if (!reports || reports.length === 0) {
    $table.html(`
      <div class="text-center py-4 text-muted">
        <i class="fa fa-inbox fa-3x mb-3"></i>
        <p>${
          window.LOCALE === 'en'
            ? 'No DMARC reports received yet.'
            : 'No DMARC reports received yet.'
        }</p>
        <p class="small">DMARC reports are typically sent daily by receiving mail servers.</p>
      </div>
    `);
    return;
  }

  let html = `
    <div class="table-responsive">
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th>Received</th>
            <th>Domain</th>
            <th>Reporter</th>
            <th class="text-center">Messages</th>
            <th class="text-center">SPF Aligned</th>
            <th class="text-center">DKIM Aligned</th>
            <th class="text-center">Accepted</th>
            <th class="text-center">Quarantined</th>
            <th class="text-center">Rejected</th>
            <th class="text-center">Pass Rate</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (const report of reports) {
    const receivedDate = dayjs(report.received_at).format('MMM D, YYYY HH:mm');
    const spfClass = getPercentClass(report.spf_aligned_pct);
    const dkimClass = getPercentClass(report.dkim_aligned_pct);
    const passClass = getPercentClass(report.pass_rate);

    html += `
      <tr>
        <td class="text-nowrap">${receivedDate}</td>
        <td>${report.domain_name}</td>
        <td>${report.org_name}</td>
        <td class="text-center">${report.total_messages.toLocaleString()}</td>
        <td class="text-center ${spfClass}">${formatPercent(
      report.spf_aligned_pct
    )}</td>
        <td class="text-center ${dkimClass}">${formatPercent(
      report.dkim_aligned_pct
    )}</td>
        <td class="text-center text-success">${report.accepted.toLocaleString()}</td>
        <td class="text-center text-warning">${report.quarantined.toLocaleString()}</td>
        <td class="text-center text-danger">${report.rejected.toLocaleString()}</td>
        <td class="text-center ${passClass}">${formatPercent(
      report.pass_rate
    )}</td>
      </tr>
    `;
  }

  html += `
        </tbody>
      </table>
    </div>
  `;

  $table.html(html);
}

function renderPagination(pages, pageCount, itemCount) {
  const $pagination = $('#reports-pagination');

  if (!pages || pages.length === 0 || pageCount <= 1) {
    $pagination.empty();
    return;
  }

  let html =
    '<nav aria-label="Page navigation"><ul class="pagination pagination-sm mb-0">';

  // Get current page from URL using regex for better browser compatibility
  const pageMatch = window.location.search.match(/[?&]page=(\d+)/);
  const currentPage = pageMatch ? Number.parseInt(pageMatch[1], 10) : 1;

  for (const page of pages) {
    const activeClass = page.number === currentPage ? 'active' : '';
    html += `<li class="page-item ${activeClass}"><a class="page-link" href="?page=${
      page.number
    }${window.location.search.replace(/[?&]page=\d+/, '')}">${
      page.number
    }</a></li>`;
  }

  html += '</ul></nav>';
  html += `<small class="text-muted ms-3">${itemCount.toLocaleString()} total reports</small>`;

  $pagination.html(html);
}

async function loadCharts(reset = false) {
  if (reset) hash = null;

  try {
    const { body } = await getData();

    // Return early if no data changed
    if (body.hash && hash === body.hash) return;

    if (body.hash) hash = body.hash;

    // Update metrics
    for (const metric of body.metrics) {
      const $element = $(metric.selector);
      $element.text(metric.value);
    }

    // Update or create charts
    for (const chart of body.charts) {
      if (charts[chart.selector]) {
        charts[chart.selector].updateOptions(omit(chart.options, 'series'));
        charts[chart.selector].updateSeries(chart.options.series);
        continue;
      }

      const $element = $(chart.selector);

      // Set theme to light or dark
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
        chart.options.theme = { mode: 'dark' };

      // Ensure background is transparent
      chart.options.chart = Object.assign(chart.options.chart || {}, {
        background: 'transparent'
      });

      // Use browser locale for tooltip date formatting
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

    // Render reports table
    renderReportsTable(body.reports);

    // Render pagination
    renderPagination(body.pages, body.pageCount, body.itemCount);
  } catch (err) {
    logger.error(err);

    // Show error message
    $('#reports-table').html(`
      <div class="text-center py-4 text-danger">
        <i class="fa fa-exclamation-triangle fa-3x mb-3"></i>
        <p>Failed to load DMARC reports. Please try again later.</p>
      </div>
    `);
  }
}

// Initial load
loadCharts()
  .then()
  .catch((err) => logger.error(err));

// Refresh every 5 minutes
setInterval(() => {
  loadCharts()
    .then()
    .catch((err) => logger.error(err));
}, ms('5m'));

// Theme change handler
function changeTheme() {
  for (const selector of Object.keys(charts)) {
    const chart = charts[selector];
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
