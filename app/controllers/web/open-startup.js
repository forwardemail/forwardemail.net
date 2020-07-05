const _ = require('lodash');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const dayjs = require('dayjs');
const numeral = require('numeral');
const revHash = require('rev-hash');
const safeStringify = require('fast-safe-stringify');
const weekOfYear = require('dayjs/plugin/weekOfYear');

const config = require('../../../config');
const { Users, Domains, Aliases } = require('../../models');
const locales = require('../../../config/locales');

const models = { Users, Domains, Aliases };
const loadedLocales = {};

for (const locale of locales) {
  try {
    loadedLocales[locale] = require(`apexcharts/dist/locales/${locale}`);
  } catch {}
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// <https://day.js.org/docs/en/plugin/advanced-format>
dayjs.extend(advancedFormat);
// <https://day.js.org/docs/en/plugin/week-of-year>
dayjs.extend(weekOfYear);

async function openStartup(ctx) {
  if (ctx.accepts('html')) return ctx.render('open-startup');

  const [
    totalUsers,
    totalDomains,
    totalAliases,
    // monthlyRevenue,
    lineChart,
    heatmap,
    pieChart
  ] = await Promise.all([
    Users.countDocuments({ [config.userFields.hasVerifiedEmail]: true }),
    (async () => {
      const domains = await Domains.distinct('name', {});
      return domains.length;
    })(),
    Aliases.countDocuments(),
    // Promise.resolve(0),
    (async () => {
      const series = [];

      await Promise.all(
        Object.keys(models).map(async name => {
          const docs = await models[name]
            .find({
              ...(name === 'Users'
                ? { [config.userFields.hasVerifiedEmail]: true }
                : {})
            })
            .select('created_at')
            .sort('created_at')
            .lean()
            .exec();
          const mapping = {};
          for (const doc of docs) {
            const date = dayjs(doc.created_at)
              .startOf('day')
              .toDate();
            if (!mapping[date]) mapping[date] = 0;
            mapping[date]++;
          }

          let count = 0;
          for (const key of Object.keys(mapping)) {
            count += mapping[key];
            mapping[key] = count;
          }

          series.push({
            name,
            data: Object.keys(mapping).map(key => [key, mapping[key]])
          });
        })
      );

      return {
        series,
        chart: {
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime'
        },
        tooltip: {
          x: {
            format: 'M/d/yy'
          }
        },
        colors: ['#20C1ED', '#8CC63F', '#ffc107']
      };
    })(),
    (async () => {
      const start = dayjs()
        .endOf('week')
        .add(1, 'day')
        .startOf('day')
        .subtract(52, 'week')
        .toDate();
      const end = dayjs()
        .endOf('week')
        .toDate();
      const users = await Users.find({
        [config.userFields.hasVerifiedEmail]: true,
        created_at: {
          $gte: start,
          $lte: end
        }
      })
        .select('created_at')
        .sort('-created_at')
        .lean();

      const series = [];
      const chart = {
        height: 350,
        type: 'heatmap'
      };
      const colors = ['#8CC63F'];

      if (users.length === 0) return { series, chart, colors };
      const weekIndex = [];
      for (let week = 0; week < 52; week++) {
        weekIndex.push(
          Number.parseInt(
            dayjs(start)
              .add(week, 'week')
              .startOf('day')
              .format('w'),
            10
          ) - 1
        );
      }

      for (let day = 0; day < 365; day++) {
        const date = dayjs(start)
          .add(day, 'day')
          .startOf('day')
          .toDate();
        const d = Number.parseInt(dayjs(date).format('d'), 10);
        const w = weekIndex.indexOf(
          Number.parseInt(dayjs(date).format('w'), 10) - 1
        );

        if (!series[d])
          series[d] = {
            name: date,
            data: []
          };

        if (!series[d].data[w])
          series[d].data[w] = {
            x: dayjs(start)
              .add(w, 'week')
              .toDate(),
            y: 0
          };
      }

      for (const user of users) {
        const d = Number.parseInt(dayjs(user.created_at).format('d'), 10);
        const w = weekIndex.indexOf(
          Number.parseInt(dayjs(user.created_at).format('w'), 10) - 1
        );
        series[d].data[w].y++;
      }

      return {
        // make Sunday start of the week
        series: _.sortBy(series, s => DAYS_OF_WEEK.indexOf(s.name)).reverse(),
        chart,
        colors
      };
    })(),
    (async () => {
      const [free, enhancedProtection, team] = await Promise.all([
        Domains.countDocuments({ plan: 'free' }),
        Domains.countDocuments({ plan: 'enhanced_protection' }),
        Domains.countDocuments({ plan: 'team' })
      ]);
      return {
        series: [free, enhancedProtection, team],
        labels: ['Free', 'Enhanced Protection', 'Team'],
        chart: {
          type: 'pie'
        },
        legend: {
          position: 'bottom'
        },
        colors: ['#20C1ED', '#8CC63F', '#ffc107']
      };
    })()
  ]);

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

  // store a hash so we know if data changes to refresh
  body.hash = revHash(safeStringify(body));

  ctx.body = body;
}

module.exports = openStartup;
