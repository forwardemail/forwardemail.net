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

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function appendTextElement(parent, tagName, value, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = String(value);
  parent.append(element);
  return element;
}

function appendReportCell(row, value, className) {
  return appendTextElement(row, 'td', value, className);
}

function getPageHref(pageNumber) {
  const parameters = window.location.search
    .slice(1)
    .split('&')
    .filter((parameter) => parameter !== '' && !/^page=\d+$/.test(parameter));
  parameters.push(`page=${pageNumber}`);
  return `?${parameters.join('&')}`;
}

function renderReportsTable(reports) {
  const $table = $('#reports-table');
  $table.empty();

  if (!reports || reports.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'text-center py-4 text-muted';
    const icon = document.createElement('i');
    icon.className = 'fa fa-inbox fa-3x mb-3';
    emptyState.append(icon);
    appendTextElement(emptyState, 'p', 'No DMARC reports received yet.');
    appendTextElement(
      emptyState,
      'p',
      'DMARC reports are typically sent daily by receiving mail servers.',
      'small'
    );
    $table.append(emptyState);
    return;
  }

  const responsive = document.createElement('div');
  responsive.className = 'table-responsive';
  const table = document.createElement('table');
  table.className = 'table table-hover table-sm';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = [
    ['Received'],
    ['Domain'],
    ['Reporter'],
    ['Messages', 'text-center'],
    ['SPF Aligned', 'text-center'],
    ['DKIM Aligned', 'text-center'],
    ['Accepted', 'text-center'],
    ['Quarantined', 'text-center'],
    ['Rejected', 'text-center'],
    ['Pass Rate', 'text-center']
  ];

  for (const [label, className] of headers) {
    appendTextElement(headerRow, 'th', label, className);
  }

  thead.append(headerRow);
  table.append(thead);
  const tbody = document.createElement('tbody');

  for (const report of reports) {
    const spfAlignedPct = toFiniteNumber(report.spf_aligned_pct);
    const dkimAlignedPct = toFiniteNumber(report.dkim_aligned_pct);
    const passRate = toFiniteNumber(report.pass_rate);
    const row = document.createElement('tr');
    appendReportCell(
      row,
      dayjs(report.received_at).format('MMM D, YYYY HH:mm'),
      'text-nowrap'
    );
    appendReportCell(row, report.domain_name || 'Unknown');
    appendReportCell(row, report.org_name || 'Unknown');
    appendReportCell(
      row,
      toFiniteNumber(report.total_messages).toLocaleString(),
      'text-center'
    );
    appendReportCell(
      row,
      formatPercent(spfAlignedPct),
      `text-center ${getPercentClass(spfAlignedPct)}`
    );
    appendReportCell(
      row,
      formatPercent(dkimAlignedPct),
      `text-center ${getPercentClass(dkimAlignedPct)}`
    );
    appendReportCell(
      row,
      toFiniteNumber(report.accepted).toLocaleString(),
      'text-center text-success'
    );
    appendReportCell(
      row,
      toFiniteNumber(report.quarantined).toLocaleString(),
      'text-center text-warning'
    );
    appendReportCell(
      row,
      toFiniteNumber(report.rejected).toLocaleString(),
      'text-center text-danger'
    );
    appendReportCell(
      row,
      formatPercent(passRate),
      `text-center ${getPercentClass(passRate)}`
    );
    tbody.append(row);
  }

  table.append(tbody);
  responsive.append(table);
  $table.append(responsive);
}

function renderPagination(pages, pageCount, itemCount) {
  const $pagination = $('#reports-pagination');
  $pagination.empty();

  if (!pages || pages.length === 0 || pageCount <= 1) return;

  const pageMatch = window.location.search.match(/[?&]page=(\d+)/);
  const currentPage = pageMatch ? Number.parseInt(pageMatch[1], 10) : 1;
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page navigation');
  const list = document.createElement('ul');
  list.className = 'pagination pagination-sm mb-0';

  for (const page of pages) {
    const pageNumber = Number(page && page.number);
    if (!Number.isSafeInteger(pageNumber) || pageNumber < 1) continue;

    const item = document.createElement('li');
    item.className = `page-item${pageNumber === currentPage ? ' active' : ''}`;
    const link = document.createElement('a');
    link.className = 'page-link';
    link.setAttribute('href', getPageHref(pageNumber));
    link.textContent = String(pageNumber);
    item.append(link);
    list.append(item);
  }

  nav.append(list);
  $pagination.append(nav);
  appendTextElement(
    $pagination.get(0),
    'small',
    `${toFiniteNumber(itemCount).toLocaleString()} total reports`,
    'text-muted ms-3'
  );
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

      // Build the donut center label formatter dynamically.
      // Sum the actual series values so the center always reflects
      // what is displayed in the chart (not a separate total_messages stat).
      if (
        chart.options.plotOptions &&
        chart.options.plotOptions.pie &&
        chart.options.plotOptions.pie.donut &&
        chart.options.plotOptions.pie.donut.labels &&
        chart.options.plotOptions.pie.donut.labels.total
      ) {
        chart.options.plotOptions.pie.donut.labels.total.formatter = function (
          w
        ) {
          const totals = w.globals.seriesTotals;
          if (!totals || totals.length === 0) return '0';
          let sum = 0;
          for (const total of totals) {
            sum += total;
          }

          return sum.toLocaleString();
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
