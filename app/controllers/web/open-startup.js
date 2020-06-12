const _ = require('lodash');
const dayjs = require('dayjs');
const numeral = require('numeral');

const locales = require('../../../config/locales');

const loadedLocales = {};

for (const locale of locales) {
  try {
    loadedLocales[locale] = require(`apexcharts/dist/locales/${locale}`);
  } catch {}
}

async function openStartup(ctx) {
  if (ctx.accepts('html')) return ctx.render('open-startup');

  let [
    totalUsers,
    totalDomains,
    totalAliases,
    // monthlyRevenue,
    lineChart,
    heatmap,
    pieChart
  ] = await Promise.all([
    ctx.client.get('open-startup:total-users'),
    ctx.client.get('open-startup:total-domains'),
    ctx.client.get('open-startup:total-aliases'),
    // Promise.resolve(0),
    ctx.client.get('open-startup:linechart'),
    ctx.client.get('open-startup:heatmap'),
    ctx.client.get('open-startup:piechart')
  ]);

  // convert from string to JSON
  if (lineChart) lineChart = JSON.parse(lineChart);
  if (heatmap) heatmap = JSON.parse(heatmap);
  if (pieChart) pieChart = JSON.parse(pieChart);

  // localize line chart
  if (lineChart) {
    lineChart.series = lineChart.series.map(s => ({
      ...s,
      name: ctx.translate(s.name.toUpperCase())
    }));
  }

  // localize heatmap
  if (heatmap) {
    heatmap.series = heatmap.series.map(s => ({
      ...s,
      name: dayjs(s.name)
        .locale(ctx.locale)
        .format('dddd'),
      data: s.data.map(d => ({
        ...d,
        x: dayjs(d.x)
          .locale(ctx.locale)
          .format('MMM YY')
      }))
    }));
  }

  const options = {
    dataLabels: {
      enabled: false
    },
    chart: {
      height: 300,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    }
  };

  if (loadedLocales[ctx.locale]) {
    options.chart.defaultLocale = ctx.locale;
    options.chart.locales = [loadedLocales[ctx.locale]];
  }

  const body = {
    metrics: [
      {
        selector: '#metrics-total-users',
        value: totalUsers ? numeral(totalUsers).format('0,0') : '-'
      },
      {
        selector: '#metrics-total-domains',
        value: totalDomains ? numeral(totalDomains).format('0,0') : '-'
      },
      {
        selector: '#metrics-total-aliases',
        value: totalAliases ? numeral(totalAliases).format('0,0') : '-'
      }
      // {
      //   selector: '#metrics-monthly-revenue',
      //   value: monthlyRevenue ? numeral(monthlyRevenue).format('$0,0') : '-'
      // }
    ],
    charts: [
      {
        selector: '#line-chart',
        options: _.merge({}, options, lineChart || {})
      },
      { selector: '#heatmap', options: _.merge({}, options, heatmap || {}) },
      { selector: '#pie-chart', options: _.merge({}, options, pieChart || {}) }
    ]
  };

  ctx.body = body;
}

module.exports = openStartup;
