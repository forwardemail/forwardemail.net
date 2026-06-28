/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/* eslint-disable prefer-object-spread */

const $ = require('jquery');
const Apex = require('apexcharts');

const charts = {};

function getThemeMode() {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

function getCommonOptions() {
  const isDark = getThemeMode() === 'dark';
  return {
    chart: {
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500
      }
    },
    theme: {
      mode: isDark ? 'dark' : 'light'
    },
    grid: {
      borderColor: isDark ? '#404040' : '#e0e0e0'
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  };
}

function initSpamTimelineChart() {
  const $element = $('#spam-timeline-chart');
  if ($element.length === 0) return;

  const data = $element.data('chart');
  if (!data || data.length === 0) {
    $element.html(
      '<p class="text-muted text-center py-5">No spam data for the selected period.</p>'
    );
    return;
  }

  const common = getCommonOptions();
  const options = Object.assign({}, common, {
    chart: Object.assign({}, common.chart, { type: 'area', height: 300 }),
    series: [
      {
        name: 'Spam Bounces',
        data: data.map(function (d) {
          return d.count;
        })
      }
    ],
    xaxis: {
      categories: data.map(function (d) {
        return d._id;
      }),
      labels: {
        rotate: -45,
        rotateAlways: data.length > 20
      }
    },
    colors: ['#dc3545'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    },
    dataLabels: {
      enabled: false
    },
    yaxis: {
      title: {
        text: 'Count'
      },
      min: 0
    },
    tooltip: {
      y: {
        formatter(val) {
          return val + ' spam bounces';
        }
      }
    }
  });

  $element.empty();
  const chart = new Apex($element.get(0), options);
  chart.render();
  charts['spam-timeline-chart'] = chart;
}

function initCharts() {
  initSpamTimelineChart();
}

$(document).ready(function () {
  initCharts();
});

if (window.matchMedia) {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function () {
      for (const key of Object.keys(charts)) {
        if (charts[key] && typeof charts[key].destroy === 'function') {
          charts[key].destroy();
        }

        delete charts[key];
      }

      initCharts();
    });
}
