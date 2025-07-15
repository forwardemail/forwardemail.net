/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const pMap = require('p-map');
const titleize = require('titleize');
const _ = require('#helpers/lodash');

const Logs = require('#models/logs');
// const config = require('#config');
// const env = require('#config/env');
const locales = require('#config/locales');

const loadedLocales = {};

for (const locale of locales) {
  try {
    loadedLocales[locale] = require(`apexcharts/dist/locales/${locale}`);
  } catch {}
}

// <https://stackoverflow.com/a/44096051>
const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

// TODO: preload/memoize data aka store in redis cache (?)

// <https://www.colourlovers.com/palette/1307039/friend#:~:text=www.michaeljmorgan.ne%E2%80%A6-,COLORS,-Berry%20Delicious>
const red = '#D24858';
const yellow = '#EAB05E';

async function getLogs(category, dates, query) {
  const results = await Logs.aggregate([
    query,
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
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

  if (results.length === 0) return;

  const data = [];
  const resultsByDate = {};
  for (const result of results) {
    resultsByDate[result._id] = result.total;
  }

  for (const [, date] of dates.entries()) {
    data.push([date, resultsByDate[date] || 0]);
  }

  return {
    name: category === 'dmarc' ? 'DMARC' : titleize(humanize(category)),
    data
  };
}

async function listAnalytics(ctx) {
  //
  // NOTE: this is a safeguard since analytics are sensitive
  //
  if (!ctx.isAuthenticated())
    throw Boom.badRequest(ctx.translateError('LOGIN_REQUIRED'));

  if (ctx.accepts('html')) {
    if (isSANB(ctx.query.domains)) {
      const domainList = [];
      const list = ctx.query.domains.split(',');
      for (const d of list) {
        const match = ctx.state.domains.find((obj) => obj.name === d);
        if (!match) continue;
        domainList.push(match.name);
      }

      if (_.isEmpty(domainList))
        throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

      ctx.state.domainList = domainList;
    }

    return ctx.render('my-account/analytics');
  }

  // const THIRTY_DAYS_AGO = dayjs().subtract(30, 'day').startOf('day').toDate();
  const SEVEN_DAYS_AGO = dayjs().subtract(7, 'day').startOf('day').toDate();

  const dates = [dayjs().format('YYYY-MM-DD')];
  // TODO: support 30d of logs
  // for (let i = 0; i < 30; i++) {
  for (let i = 0; i < 7; i++) {
    dates.unshift(
      dayjs().subtract(1, 'day').subtract(i, 'days').format('YYYY-MM-DD')
    );
  }

  const query = { $or: [] };

  if (isSANB(ctx.query.domains)) {
    const list = ctx.query.domains.split(',');
    for (const d of list) {
      const match = ctx.state.domains.find((obj) => obj.name === d);
      if (!match) continue;
      if (match.group === 'admin') {
        query.$or.push({
          domains: { $in: [match._id] }
        });
      } else {
        query.$or.push({
          domains: { $in: [match._id] },
          user: ctx.state.user._id
        });
      }
    }

    if (_.isEmpty(query.$or))
      throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
  } else {
    for (const domain of ctx.state.domains) {
      if (domain.group === 'admin') {
        query.$or.push({
          domains: { $in: [domain._id] }
        });
      } else {
        query.$or.push({
          domains: { $in: [domain._id] },
          user: ctx.state.user._id
        });
      }
    }
  }

  //
  // NOTE: current "bounce_category" values can be:
  //       - auth
  //       - block
  //       - blocklist
  //       - capacity
  //       - config
  //       - dmarc
  //       - envelope
  //       - greylist
  //       - message
  //       - network
  //       - none    // <---- not related to emails
  //       - other
  //       - protocol
  //       - recipient
  //       - spam
  //       - virus
  //       ... and then we add "accepted" as an additional category
  //
  const categories = [
    'auth',
    'block',
    'blocklist',
    'capacity',
    'config',
    'dmarc',
    'envelope',
    'greylist',
    'message',
    'network',
    // 'none',
    'other',
    'protocol',
    'recipient',
    'spam',
    'virus'
  ];

  const [
    accepted,
    hardBounce,
    softBounce,
    spamBlocked,
    virusesBlocked,
    bouncesByCategoryChart,
    outboundChart,
    inboundChart
  ] = await Promise.all([
    // TODO: need to have users opt-in
    Promise.resolve(0),

    // hard bounce
    // 5xx err.responseCode
    Logs.countDocuments({
      $and: [
        {
          'err.responseCode': {
            $exists: true,
            $gte: 500
          }
        },
        query
      ]
    }),

    // soft bounce
    // 4xx err.responseCode
    Logs.countDocuments({
      $and: [
        {
          'err.responseCode': {
            $exists: true,
            $gte: 400,
            $lt: 500
          }
        },
        query
      ]
    }),

    // spam
    // bounce_category = spam || blocklist
    Logs.countDocuments({
      $and: [
        {
          bounce_category: { $in: ['spam', 'blocklist'] }
        },
        query
      ]
    }),

    // virus
    // bounce_category = virus
    Logs.countDocuments({
      $and: [
        {
          bounce_category: 'virus'
        },
        query
      ]
    }),

    //
    // NOTE: we can use `meta.app.hostname` to filter inbound/outbound logs
    //       inbound is either "mx1.forwardemail.net" or "mx2.forwardemail.net"
    //       and outbound is "smtp.forwardemail.net"
    //       (note: self hosting will have an issue here so we may need to
    //       switch it up and use `meta.app.name` instead of this hostname stuff for self-hosted)
    //

    // bounces by category
    (async () => {
      const series = [];
      await pMap(categories, async (category) => {
        const obj = await getLogs(category, dates, {
          $match: {
            $or: query.$or.map((obj) => ({
              // TODO: add an index for created_at + bounce_category + domain (?)
              created_at: {
                $gte: SEVEN_DAYS_AGO // THIRTY_DAYS_AGO
              },
              bounce_category: category,
              ...obj
            }))
          }
        });
        if (obj) series.push(obj);
      });

      return {
        series: _.sortBy(series, 'name'),
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
            format: 'yyyy-MM-dd'
          }
        }
      };
    })(),

    // outbound chart
    (async () => {
      const series = [];
      // TODO: need to have users opt-in
      // Accepted (250)

      const [soft, hard] = await Promise.all([
        getLogs('Soft Bounce (4xx)', dates, {
          $match: {
            $or: query.$or.map((obj) => ({
              // TODO: index here (?)
              created_at: {
                $gte: SEVEN_DAYS_AGO // THIRTY_DAYS_AGO
              },
              'err.responseCode': {
                $exists: true,
                $gte: 400,
                $lt: 500
              },
              // TODO: better way to do this query for self-hosted (?)
              'meta.app.hostname': 'smtp.forwardemail.net', // env.SMTP_HOST,
              ...obj
            }))
          }
        }),
        getLogs('Hard Bounce (5xx)', dates, {
          $match: {
            $or: query.$or.map((obj) => ({
              // TODO: index here (?)
              created_at: {
                $gte: SEVEN_DAYS_AGO // THIRTY_DAYS_AGO
              },
              'err.responseCode': {
                $exists: true,
                $gte: 500
              },
              // TODO: better way to do this query for self-hosted (?)
              'meta.app.hostname': 'smtp.forwardemail.net', // env.SMTP_HOST,
              // $in: [ 'mx1.forwardemail.net', 'mx2.forwardemail.net' ]
              // { $in: config.exchanges },
              ...obj
            }))
          }
        })
      ]);

      const colors = [];

      if (soft) {
        series.push(soft);
        colors.push(yellow);
      }

      if (hard) {
        series.push(hard);
        colors.push(red);
      }

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
        colors
      };
    })(),

    // inbound chart
    (async () => {
      const series = [];
      // TODO: need to have users opt-in
      // Accepted (250)

      const [soft, hard] = await Promise.all([
        getLogs('Soft Bounce (4xx)', dates, {
          $match: {
            $or: query.$or.map((obj) => ({
              // TODO: index here (?)
              created_at: {
                $gte: SEVEN_DAYS_AGO // THIRTY_DAYS_AGO
              },
              'err.responseCode': {
                $exists: true,
                $gte: 400,
                $lt: 500
              },
              // TODO: better way to do this query for self-hosted (?)
              'meta.app.hostname': {
                // { $in: config.exchanges }
                $in: ['mx1.forwardemail.net', 'mx2.forwardemail.net']
              },
              ...obj
            }))
          }
        }),
        getLogs('Hard Bounce (5xx)', dates, {
          $match: {
            $or: query.$or.map((obj) => ({
              // TODO: index here (?)
              created_at: {
                $gte: SEVEN_DAYS_AGO // THIRTY_DAYS_AGO
              },
              'err.responseCode': {
                $exists: true,
                $gte: 500
              },
              // TODO: better way to do this query for self-hosted (?)
              'meta.app.hostname': {
                // { $in: config.exchanges }
                $in: ['mx1.forwardemail.net', 'mx2.forwardemail.net']
              },
              ...obj
            }))
          }
        })
      ]);

      const colors = [];

      if (soft) {
        series.push(soft);
        colors.push(yellow);
      }

      if (hard) {
        series.push(hard);
        colors.push(red);
      }

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
        colors
      };
    })()
  ]);

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

  const data = {
    metrics: [
      {
        selector: '#metrics-accepted',
        value: accepted ? numeral(accepted).format('0,0') : '-'
      },
      {
        selector: '#metrics-hard-bounce',
        value: hardBounce ? numeral(hardBounce).format('0,0') : '-'
      },
      {
        selector: '#metrics-soft-bounce',
        value: softBounce ? numeral(softBounce).format('0,0') : '-'
      },
      {
        selector: '#metrics-spam',
        value: spamBlocked ? numeral(spamBlocked).format('0,0') : '-'
      },
      {
        selector: '#metrics-virus',
        value: virusesBlocked ? numeral(virusesBlocked).format('0,0') : '-'
      }
    ],
    charts: [
      {
        selector: '#inbound-chart',
        options: _.merge({}, options, inboundChart || {})
      },
      {
        selector: '#outbound-chart',
        options: _.merge({}, options, outboundChart || {})
      },
      {
        selector: '#bounces-by-category-chart',
        options: _.merge({}, options, bouncesByCategoryChart || {})
      }
    ]
  };

  ctx.body = data;
}

module.exports = listAnalytics;
