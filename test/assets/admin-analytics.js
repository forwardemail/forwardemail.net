/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const test = require('ava');

const source = fs.readFileSync(
  path.join(__dirname, '../../assets/js/admin-analytics.js'),
  'utf8'
);

test('one analytics chart failure does not block later widgets or polling', (t) => {
  const document = {};
  const errors = [];
  const renderedCharts = [];
  const chartOptions = new Map();
  const intervals = [];
  const requests = [];
  const chartData = new Map([
    [
      '#visitors-chart',
      {
        visitors: [{ x: '2026-07-18', y: 1 }],
        events: [{ x: '2026-07-18', y: 2 }]
      }
    ],
    ['#services-chart', { chart: [{ service: 'web', count: 2 }] }],
    ['#devices-chart', { chart: [{ type: 'desktop', count: 2, visitors: 1 }] }],
    ['#success-rate-chart', { chart: [{ x: '2026-07-18', rate: 100 }] }],
    [
      '#service-over-time-chart',
      { chart: [{ x: '2026-07-18', events: 2, visitors: 1 }] }
    ]
  ]);

  function jquery(target) {
    if (target === document) {
      return {
        ready(callback) {
          callback();
        }
      };
    }

    const data = chartData.get(target);
    return {
      length: data ? 1 : 0,
      data(key) {
        return data?.[key];
      },
      empty() {},
      get() {
        return { selector: target };
      },
      html() {},
      text() {}
    };
  }

  class Apex {
    constructor(element, options) {
      if (element.selector === '#visitors-chart') {
        throw new Error('simulated chart failure');
      }

      renderedCharts.push(element.selector);
      chartOptions.set(element.selector, options);
    }

    render() {}
  }

  const sandbox = {
    document,
    window: {
      location: { pathname: '/admin/analytics' },
      matchMedia() {
        return {
          matches: false,
          addEventListener() {}
        };
      }
    },
    setInterval(callback, delay) {
      intervals.push({ callback, delay });
      return intervals.length;
    },
    require(id) {
      if (id === 'jquery') return jquery;
      if (id === 'apexcharts') return Apex;
      if (id === 'ms') return () => 30_000;
      if (id === 'superagent') {
        return {
          get(url) {
            requests.push(url);
            return {
              set() {
                return this;
              },
              timeout() {
                return Promise.resolve({ body: { current_visitors: 1 } });
              }
            };
          }
        };
      }

      if (id === './logger') {
        return {
          error(error) {
            errors.push(error);
          }
        };
      }

      throw new Error(`Unexpected module: ${id}`);
    }
  };

  vm.runInNewContext(source, sandbox, {
    filename: 'assets/js/admin-analytics.js'
  });

  t.is(errors.length, 1);
  t.is(errors[0].message, 'simulated chart failure');
  t.deepEqual(renderedCharts, [
    '#services-chart',
    '#devices-chart',
    '#success-rate-chart',
    '#service-over-time-chart'
  ]);
  t.deepEqual(chartOptions.get('#success-rate-chart').series[0].data[0], {
    x: '2026-07-18',
    y: 100
  });
  t.deepEqual(requests, ['/admin/analytics/realtime']);
  t.is(intervals.length, 1);
  t.is(intervals[0].delay, 30_000);
});
