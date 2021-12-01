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

async function loadCharts() {
  try {
    const { body } = await getData();

    // return early if no data changed
    if (hash === body.hash) return;

    hash = body.hash;

    for (const metric of body.metrics) {
      try {
        const $element = $(metric.selector);
        $element.text(metric.value);
      } catch (err) {
        logger.error(err);
      }
    }

    for (const chart of body.charts) {
      try {
        if (charts[chart.selector]) {
          charts[chart.selector].updateOptions(_.omit(chart.options, 'series'));
          charts[chart.selector].updateSeries(chart.options.series);
          continue;
        }

        const $element = $(chart.selector);
        const apex = new Apex($element.get(0), chart.options);
        $element.empty();
        apex.render();
        charts[chart.selector] = apex;
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await loadCharts();
})();

setInterval(async () => {
  await loadCharts();
}, ms('5m'));
