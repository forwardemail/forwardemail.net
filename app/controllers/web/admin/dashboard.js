/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const memoize = require('memoizee');
const ms = require('ms');
const numeral = require('numeral');
const revHash = require('rev-hash');
const titleize = require('titleize');
const _ = require('#helpers/lodash');

const config = require('#config');
const locales = require('#config/locales');
const { Users, Domains, Aliases, Payments } = require('#models');
const { encoder } = require('#helpers/encoder-decoder');

// <https://stackoverflow.com/a/44096051>
const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

const models = { Users, Domains };
const loadedLocales = {};

for (const locale of locales) {
  try {
    loadedLocales[locale] = require(`apexcharts/dist/locales/${locale}`);
  } catch {}
}

/*
const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
*/

async function getGrowthChart() {
  const docs = await Users.aggregate([
    {
      $match: {
        plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
        created_at: {
          $gte: dayjs()
            .subtract(1, 'day')
            .startOf('day')
            .subtract(1, 'year')
            .toDate(),
          $lte: dayjs().subtract(1, 'day').endOf('day').toDate()
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$created_at',
            timezone
          }
        },
        total: { $sum: 1 }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]);

  const series = [
    {
      name: 'New Paying Customers',
      data: docs.map((doc) => [doc._id, doc.total])
    }
  ];

  return {
    series,
    chart: {
      type: 'area'
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      type: 'datetime'
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      }
    }
  };
}

async function getDeliverabilityChart(ctx) {
  const series = [];
  // iterate over past 7 days (starting from oldest)
  // mail_accepted:2023-01-27
  // mail_rejected:2023-01-27
  // mail_error:2023-01-27
  if (ctx.client) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.unshift(
        dayjs().subtract(1, 'day').subtract(i, 'days').format('YYYY-MM-DD')
      );
    }

    await Promise.all(
      [
        'mail_accepted',
        'mail_rejected',
        'bounce_prevented_restricted',
        'bounce_sent',
        'backscatter_prevented',
        'denylist_prevented'
      ].map(async (name) => {
        const results = await ctx.client.mget(
          dates.map((date) => `${name}:${date}`)
        );
        const data = [];
        for (const [i, date] of dates.entries()) {
          data.push([date, results[i] ? Number.parseInt(results[i], 10) : 0]);
        }

        series.push({
          name: titleize(humanize(name)),
          data
        });
      })
    );
  }

  return {
    series,
    chart: {
      type: 'area'
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      type: 'datetime'
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    }
  };
}

async function getBody(ctx) {
  const bannedUserIds = await Users.distinct('_id', {
    [config.userFields.isBanned]: true
  });
  const [
    totalUsers,
    totalDomains,
    totalAliases,
    totalSubscriptions,
    oneTimeRevenueChart,
    subscriptionRevenueChart,
    revenueChart,
    growthChart,
    deliverabilityChart,
    lineChart,
    // heatmap,
    pieChart,
    localeChart
  ] = await Promise.all([
    Users.countDocuments({ [config.userFields.hasVerifiedEmail]: true }),
    Domains.countDocuments({
      'members.user': { $nin: bannedUserIds },
      has_mx_record: true
    }),
    // TODO: replace queries like this with boolean `is_banned`
    // Aliases.countDocuments({ user: { $nin: bannedUserIds } }),
    Aliases.estimatedDocumentCount(),
    Users.countDocuments({
      $or: [
        { [config.userFields.stripeSubscriptionID]: { $exists: true } },
        { [config.userFields.paypalSubscriptionID]: { $exists: true } }
      ]
    }),
    (async () => {
      const docs = await Payments.aggregate([
        {
          $match: {
            kind: 'one-time',
            method: { $nin: ['free_beta_program', 'plan_conversion'] }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y/%m', date: '$invoice_at', timezone }
            },
            total: { $sum: '$amount' }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);
      const series = [
        {
          name: 'Total',
          data: docs.map((doc) => [doc._id, Math.round(doc.total / 100)])
        }
      ];
      return {
        series,
        chart: {
          type: 'area'
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime'
        },
        tooltip: {
          x: {
            format: 'y/M'
          }
        },
        colors: ['#20C1ED']
      };
    })(),
    (async () => {
      const docs = await Payments.aggregate([
        {
          $match: {
            kind: 'subscription',
            method: { $nin: ['free_beta_program', 'plan_conversion'] }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y/%m', date: '$invoice_at', timezone }
            },
            total: { $sum: '$amount' }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);
      const series = [
        {
          name: 'Total',
          data: docs.map((doc) => [doc._id, Math.round(doc.total / 100)])
        }
      ];
      return {
        series,
        chart: {
          type: 'area'
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime'
        },
        tooltip: {
          x: {
            format: 'y/M'
          }
        },
        colors: ['#20C1ED']
      };
    })(),
    (async () => {
      // revenue chart (payments over time grouped by invoice_at)
      const [docs, stripe, paypal] = await Promise.all([
        Payments.aggregate([
          {
            $match: {
              method: {
                $nin: ['free_beta_program', 'plan_conversion']
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y/%m',
                  date: '$invoice_at',
                  timezone
                }
              },
              total: { $sum: '$amount' }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ]),
        // stripe
        Payments.aggregate([
          {
            $match: {
              method: {
                $nin: [
                  'unknown',
                  'paypal',
                  'free_beta_program',
                  'plan_conversion'
                ]
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y/%m',
                  date: '$invoice_at',
                  timezone
                }
              },
              total: { $sum: '$amount' }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ]),
        // paypal
        Payments.aggregate([
          {
            $match: {
              method: 'paypal'
            }
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y/%m',
                  date: '$invoice_at',
                  timezone
                }
              },
              total: { $sum: '$amount' }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ])
      ]);

      const series = [
        {
          name: 'Total',
          data: docs.map((doc) => [doc._id, Math.round(doc.total / 100)])
        },
        {
          name: 'Stripe',
          data: stripe.map((doc) => [doc._id, Math.round(doc.total / 100)])
        },
        {
          name: 'PayPal',
          data: paypal.map((doc) => [doc._id, Math.round(doc.total / 100)])
        }
      ];

      return {
        series,
        chart: {
          type: 'area'
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime'
        },
        tooltip: {
          x: {
            format: 'y/M'
          }
        },
        colors: ['#20C1ED', '#269C32', '#ffc107']
      };
    })(),
    // growth chart
    getGrowthChart(),
    // deliverability chart
    getDeliverabilityChart(ctx),
    // line chart
    (async () => {
      const series = [];
      await Promise.all(
        Object.keys(models).map(async (name) => {
          const docs = await models[name].aggregate([
            {
              $match: {
                ...(name === 'Users'
                  ? {
                      [config.userFields.hasVerifiedEmail]: true,
                      [config.userFields.isBanned]: false
                    }
                  : // : name === 'Aliases'
                  // ? {}
                  // : // TODO: replace queries like this with boolean `is_banned`
                  // ? { user: { $nin: bannedUserIds } }
                  name === 'Domains'
                  ? { 'members.user': { $nin: bannedUserIds } }
                  : {})
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y/%m',
                    date: '$created_at',
                    timezone
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                _id: 1
              }
            }
          ]);

          series.push({
            name,
            data: docs.map((doc) => [doc._id, Math.round(doc.count)])
          });
        })
      );

      return {
        series,
        chart: {
          type: 'area'
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime'
        },
        tooltip: {
          x: {
            format: 'y/M'
          }
        },
        colors: ['#20C1ED', '#269C32', '#ffc107']
      };
    })(),
    /*
    (async () => {
      const start = dayjs()
        .endOf('week')
        .add(1, 'day')
        .startOf('day')
        .subtract(52, 'week')
        .toDate();

      const end = dayjs().endOf('week').toDate();

      const users = await Users.find({
        [config.userFields.hasVerifiedEmail]: true,
        created_at: {
          $gte: start,
          $lte: end
        }
      })
        .lean()
        .select('created_at')
        .exec();

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
            dayjs(start).add(week, 'week').startOf('day').format('w'),
            10
          ) - 1
        );
      }

      for (let day = 0; day < 365; day++) {
        const date = dayjs(start).add(day, 'day').startOf('day').toDate();
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
            x: dayjs(start).add(w, 'week').toDate(),
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
        series: _.sortBy(series, (s) => DAYS_OF_WEEK.indexOf(s.name)).reverse(),
        chart,
        colors
      };
    })(),
    */
    // pie chart
    (async () => {
      const [free, enhancedProtection, team] = await Promise.all([
        Domains.countDocuments({
          plan: 'free',
          has_mx_record: true,
          'members.user': { $nin: bannedUserIds }
        }),
        Domains.countDocuments({
          plan: 'enhanced_protection',
          has_mx_record: true,
          'members.user': { $nin: bannedUserIds }
        }),
        Domains.countDocuments({
          plan: 'team',
          has_mx_record: true,
          'members.user': { $nin: bannedUserIds }
        })
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
    })(),
    // locale chart
    (async () => {
      const labels = await Users.distinct(config.lastLocaleField, {
        [config.userFields.hasVerifiedEmail]: true,
        [config.userFields.isBanned]: false,
        plan: { $in: ['enhanced_protection', 'team'] }
      });
      const series = await Promise.all(
        labels.map((label) =>
          Users.countDocuments({
            [config.lastLocaleField]: label,
            [config.userFields.hasVerifiedEmail]: true,
            [config.userFields.isBanned]: false,
            plan: { $in: ['enhanced_protection', 'team'] }
          })
        )
      );
      return {
        series,
        labels,
        chart: { type: 'pie' },
        legend: { position: 'bottom' }
      };
    })()
  ]);

  // localize line chart
  if (lineChart) {
    lineChart.series = lineChart.series.map((s) => ({
      ...s,
      name: ctx.translate(s.name.toUpperCase())
    }));
  }

  // localize heatmap
  /*
  if (heatmap) {
    heatmap.series = heatmap.series.map((s) => ({
      ...s,
      name: dayjs(s.name).locale(ctx.locale).format('dddd'),
      data: s.data.map((d) => ({
        ...d,
        x: dayjs(d.x).locale(ctx.locale).format('MMM YY')
      }))
    }));
  }
  */

  const options = {
    dataLabels: {
      enabled: true
    },
    chart: {
      height: 300,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
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
      },
      {
        selector: '#metrics-total-subscriptions',
        value: totalSubscriptions
          ? numeral(totalSubscriptions).format('0,0')
          : '-'
      }
      // {
      //   selector: '#metrics-monthly-revenue',
      //   value: monthlyRevenue ? numeral(monthlyRevenue).format('$0,0,0.00') : '-'
      // }
    ],
    charts: [
      {
        selector: '#revenue-chart',
        options: _.merge({}, options, revenueChart || {})
      },
      {
        selector: '#one-time-revenue-chart',
        options: _.merge({}, options, oneTimeRevenueChart || {})
      },
      {
        selector: '#subscription-revenue-chart',
        options: _.merge({}, options, subscriptionRevenueChart || {})
      },
      {
        selector: '#growth-chart',
        options: _.merge({}, options, growthChart || {})
      },
      {
        selector: '#deliverability-chart',
        options: _.merge({}, options, deliverabilityChart || {})
      },
      {
        selector: '#line-chart',
        options: _.merge({}, options, lineChart || {})
      },
      // { selector: '#heatmap', options: _.merge({}, options, heatmap || {}) },
      { selector: '#pie-chart', options: _.merge({}, options, pieChart || {}) },
      {
        selector: '#locale-chart',
        options: _.merge({}, options, localeChart || {})
      }
    ]
  };

  // store a hash so we know if data changes to refresh
  body.hash = revHash(encoder.pack(body));

  return body;
}

const getBodyMemoized = memoize(getBody, { length: 1, maxAge: ms('60m') });

async function dashboard(ctx) {
  if (ctx.accepts('html')) return ctx.render('admin');
  ctx.body = await getBodyMemoized(ctx);
}

module.exports = dashboard;
