/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/* eslint-disable prefer-object-spread */

const $ = require('jquery');
const Apex = require('apexcharts');
const ms = require('ms');
const superagent = require('superagent');

const logger = require('./logger');

const charts = {};

// Get theme mode
function getThemeMode() {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

// Common chart options
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
    colors: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#546E7A',
      '#26a69a',
      '#D10CE8'
    ],
    grid: {
      borderColor: isDark ? '#404040' : '#e0e0e0'
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light'
    }
  };
}

// Initialize visitors over time chart
function initVisitorsOverTimeChart() {
  const $element = $('#visitors-chart');
  if ($element.length === 0) return;

  const visitorsData = $element.data('visitors');
  const eventsData = $element.data('events');
  if (
    (!visitorsData || visitorsData.length === 0) &&
    (!eventsData || eventsData.length === 0)
  ) {
    $element.html(
      '<p class="text-muted text-center py-5">No data available</p>'
    );
    return;
  }

  const common = getCommonOptions();
  const options = Object.assign({}, common, {
    chart: Object.assign({}, common.chart, { type: 'area', height: 350 }),
    series: [
      {
        name: 'Visitors',
        data: (visitorsData || []).map(function (d) {
          return { x: d.x, y: d.y };
        })
      },
      {
        name: 'Events',
        data: (eventsData || []).map(function (d) {
          return { x: d.x, y: d.y };
        })
      }
    ],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'MMM dd'
      }
    },
    yaxis: {
      title: {
        text: 'Count'
      },
      min: 0
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'top'
    }
  });

  $element.empty();
  const chart = new Apex($element.get(0), options);
  chart.render();
  charts['visitors-chart'] = chart;
}

// Initialize sessions by service chart
function initSessionsByServiceChart() {
  const $element = $('#services-chart');
  if ($element.length === 0) return;

  const data = $element.data('chart');
  if (!data || data.length === 0) {
    $element.html(
      '<p class="text-muted text-center py-5">No data available</p>'
    );
    return;
  }

  const common = getCommonOptions();
  const options = Object.assign({}, common, {
    chart: Object.assign({}, common.chart, { type: 'bar', height: 300 }),
    series: [
      {
        name: 'Events',
        data: data.map(function (d) {
          return d.count;
        })
      }
    ],
    xaxis: {
      categories: data.map(function (d) {
        return d.service.toUpperCase();
      })
    },
    yaxis: {
      title: {
        text: 'Events'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '60%'
      }
    },
    dataLabels: {
      enabled: false
    }
  });

  $element.empty();
  const chart = new Apex($element.get(0), options);
  chart.render();
  charts['services-chart'] = chart;
}

// Initialize device types chart
function initDeviceTypesChart() {
  const $element = $('#devices-chart');
  if ($element.length === 0) return;

  const data = $element.data('chart');
  if (!data || data.length === 0) {
    $element.html(
      '<p class="text-muted text-center py-5">No data available</p>'
    );
    return;
  }

  const common = getCommonOptions();
  const options = Object.assign({}, common, {
    chart: Object.assign({}, common.chart, { type: 'donut', height: 300 }),
    series: data.map(function (d) {
      return d.visitors;
    }),
    labels: data.map(function (d) {
      const type = d.type || 'unknown';
      return type.charAt(0).toUpperCase() + type.slice(1);
    }),
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter(w) {
                return w.globals.seriesTotals
                  .reduce(function (a, b) {
                    return a + b;
                  }, 0)
                  .toLocaleString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter(val) {
        return Math.round(val) + '%';
      }
    }
  });

  $element.empty();
  const chart = new Apex($element.get(0), options);
  chart.render();
  charts['devices-chart'] = chart;
}

// Initialize success rate chart
function initSuccessRateChart() {
  const $element = $('#success-rate-chart');
  if ($element.length === 0) return;

  const data = $element.data('chart');
  if (!data || data.length === 0) {
    $element.html(
      '<p class="text-muted text-center py-5">No data available</p>'
    );
    return;
  }

  const common = getCommonOptions();
  const options = Object.assign({}, common, {
    chart: Object.assign({}, common.chart, { type: 'line', height: 250 }),
    series: [
      {
        name: 'Success Rate',
        data: data.map(function (d) {
          return { x: d.x, y: d.rate };
        })
      }
    ],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'MMM dd'
      }
    },
    yaxis: {
      title: {
        text: 'Success Rate (%)'
      },
      min: 0,
      max: 100,
      labels: {
        formatter(val) {
          return val.toFixed(1) + '%';
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#00E396'],
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 4
    }
  });

  $element.empty();
  const chart = new Apex($element.get(0), options);
  chart.render();
  charts['success-rate-chart'] = chart;
}

// Initialize service over time chart (for service detail page)
function initServiceOverTimeChart() {
  const $element = $('#service-over-time-chart');
  if ($element.length === 0) return;

  const data = $element.data('chart');
  if (!data || data.length === 0) {
    $element.html(
      '<p class="text-muted text-center py-5">No data available</p>'
    );
    return;
  }

  const common = getCommonOptions();
  const options = Object.assign({}, common, {
    chart: Object.assign({}, common.chart, { type: 'area', height: 350 }),
    series: [
      {
        name: 'Visitors',
        data: data.map(function (d) {
          return { x: d.x, y: d.visitors };
        })
      },
      {
        name: 'Events',
        data: data.map(function (d) {
          return { x: d.x, y: d.events };
        })
      }
    ],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'MMM dd'
      }
    },
    yaxis: {
      title: {
        text: 'Count'
      },
      min: 0
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'top'
    }
  });

  $element.empty();
  const chart = new Apex($element.get(0), options);
  chart.render();
  charts['service-over-time-chart'] = chart;
}

// Update current visitors count via AJAX
function updateCurrentVisitors() {
  superagent
    .get(
      window.location.pathname.replace(/\/analytics.*/, '/analytics/realtime')
    )
    .set({
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    })
    .timeout(ms('10s'))
    .then(function (res) {
      const $element = $('#current-visitors');
      if (
        $element.length > 0 &&
        res.body &&
        typeof res.body.current_visitors === 'number'
      ) {
        $element.text(res.body.current_visitors);
      }
    })
    .catch(function (err) {
      logger.error(err);
    });
}

// Initialize all charts
function initCharts() {
  initVisitorsOverTimeChart();
  initSessionsByServiceChart();
  initDeviceTypesChart();
  initSuccessRateChart();
  initServiceOverTimeChart();
}

// Run on document ready
$(document).ready(function () {
  initCharts();

  // Update current visitors every 30 seconds
  setInterval(updateCurrentVisitors, ms('30s'));
});

// Handle theme changes
if (window.matchMedia) {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function () {
      // Reinitialize charts with new theme
      for (const key of Object.keys(charts)) {
        if (charts[key] && typeof charts[key].destroy === 'function') {
          charts[key].destroy();
        }

        delete charts[key];
      }

      initCharts();
    });
}
