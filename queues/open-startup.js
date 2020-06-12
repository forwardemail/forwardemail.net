const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const _ = require('lodash');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const dayjs = require('dayjs');
const weekOfYear = require('dayjs/plugin/weekOfYear');

const config = require('../config');
const logger = require('../helpers/logger');
const locales = require('../config/locales');

// <https://day.js.org/docs/en/plugin/advanced-format>
dayjs.extend(advancedFormat);
// <https://day.js.org/docs/en/plugin/week-of-year>
dayjs.extend(weekOfYear);

const { Users, Domains, Aliases } = require('../app/models');

const models = { Users, Domains, Aliases };
const api = new API({ logger });
const mongoose = new Mongoose(
  _.merge({ logger }, api.config.mongoose, config.mongoose)
);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [api.client],
  logger
});

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
].reverse();

module.exports = async job => {
  logger.info('starting open startup', { job });
  try {
    await Promise.all([mongoose.connect(), graceful.listen()]);
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
              .find({})
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
          .subtract(1, 'year')
          .endOf('week')
          .add(1, 'day')
          .startOf('day')
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
            parseInt(
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
          const d = parseInt(dayjs(date).format('d'), 10);
          const w = weekIndex.indexOf(
            parseInt(dayjs(date).format('w'), 10) - 1
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
          const d = parseInt(dayjs(user.created_at).format('d'), 10);
          const w = weekIndex.indexOf(
            parseInt(dayjs(user.created_at).format('w'), 10) - 1
          );
          series[d].data[w].y++;
        }

        return {
          // make Sunday start of the week
          series: _.sortBy(series, s => DAYS_OF_WEEK.indexOf(s.name)),
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

    await Promise.all([
      api.client.set('open-startup:total-users', JSON.stringify(totalUsers)),
      api.client.set(
        'open-startup:total-domains',
        JSON.stringify(totalDomains)
      ),
      api.client.set(
        'open-startup:total-aliases',
        JSON.stringify(totalAliases)
      ),
      api.client.set('open-startup:linechart', JSON.stringify(lineChart)),
      api.client.set('open-startup:heatmap', JSON.stringify(heatmap)),
      api.client.set('open-startup:piechart', JSON.stringify(pieChart))
    ]);

    // delete all localized versions
    await Promise.all(
      locales.map(locale => api.client.del(`open-startup:${locale}`))
    );
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
