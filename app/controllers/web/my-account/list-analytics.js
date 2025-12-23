/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const titleize = require('titleize');
const _ = require('#helpers/lodash');

const Logs = require('#models/logs');
const locales = require('#config/locales');

const loadedLocales = {};

for (const locale of locales) {
  try {
    loadedLocales[locale] = require(`apexcharts/dist/locales/${locale}`);
  } catch {}
}

// <https://stackoverflow.com/a/44096051>
const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

// <https://www.colourlovers.com/palette/1307039/friend#:~:text=www.michaeljmorgan.ne%E2%80%A6-,COLORS,-Berry%20Delicious>
const red = '#D24858';
const yellow = '#EAB05E';

// <https://www.colourlovers.com/color/9CD85F/omunanaral>
const green = '#9CD85F';

//
// Helper to transform aggregation results into chart series format
//
function transformToSeries(name, dates, results) {
  if (!results || results.length === 0) return null;

  const resultsByDate = {};
  for (const result of results) {
    resultsByDate[result._id] = result.total;
  }

  const data = [];
  for (const date of dates) {
    data.push([date, resultsByDate[date] || 0]);
  }

  return { name, data };
}

//
// Helper to transform category results into multiple series
//
function transformCategoryResults(categories, dates, results) {
  const series = [];
  const resultsByCategory = {};

  // Group results by category
  for (const result of results) {
    const { cat, date } = result._id;
    if (!resultsByCategory[cat]) resultsByCategory[cat] = {};
    resultsByCategory[cat][date] = result.total;
  }

  // Build series for each category
  for (const category of categories) {
    if (!resultsByCategory[category]) continue;

    const data = [];
    for (const date of dates) {
      data.push([date, resultsByCategory[category][date] || 0]);
    }

    series.push({
      name: category === 'dmarc' ? 'DMARC' : titleize(humanize(category)),
      data
    });
  }

  return _.sortBy(series, 'name');
}

//
// Helper to run a single count query with proper index hint
//
async function countWithCondition(baseMatch, additionalMatch, hint) {
  const pipeline = [
    { $match: { ...baseMatch, ...additionalMatch } },
    { $count: 'total' }
  ];

  const result = await Logs.aggregate(pipeline, {
    hint,
    allowDiskUse: true
  });

  return result[0]?.total || 0;
}

//
// Helper to run a date-grouped aggregation
//
async function groupByDate(baseMatch, additionalMatch, hint) {
  const pipeline = [
    { $match: { ...baseMatch, ...additionalMatch } },
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
    { $sort: { _id: 1 } }
  ];

  return Logs.aggregate(pipeline, {
    hint,
    allowDiskUse: true
  });
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

  const SEVEN_DAYS_AGO = dayjs().subtract(7, 'day').startOf('day').toDate();

  const dates = [dayjs().format('YYYY-MM-DD')];
  for (let i = 0; i < 7; i++) {
    dates.unshift(
      dayjs().subtract(1, 'day').subtract(i, 'days').format('YYYY-MM-DD')
    );
  }

  //
  // Build separate query arrays for admin vs non-admin domains
  //
  const adminDomainIds = [];
  const nonAdminQueries = [];

  if (isSANB(ctx.query.domains)) {
    const list = ctx.query.domains.split(',');
    for (const d of list) {
      const match = ctx.state.domains.find((obj) => obj.name === d);
      if (!match) continue;
      if (match.group === 'admin') {
        adminDomainIds.push(match._id);
      } else {
        nonAdminQueries.push({
          domains: match._id,
          user: ctx.state.user._id
        });
      }
    }

    if (adminDomainIds.length === 0 && nonAdminQueries.length === 0)
      throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));
  } else {
    for (const domain of ctx.state.domains) {
      if (domain.group === 'admin') {
        adminDomainIds.push(domain._id);
      } else {
        nonAdminQueries.push({
          domains: domain._id,
          user: ctx.state.user._id
        });
      }
    }
  }

  // Build the base $or query for domain filtering
  const domainOrQuery = [];
  if (adminDomainIds.length > 0) {
    domainOrQuery.push({ domains: { $in: adminDomainIds } });
  }

  if (nonAdminQueries.length > 0) {
    domainOrQuery.push(...nonAdminQueries);
  }

  // Safeguard
  if (domainOrQuery.length === 0)
    throw Boom.badRequest(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  //
  // Base match conditions
  //
  const baseMatch = {
    created_at: { $gte: SEVEN_DAYS_AGO },
    $or: domainOrQuery
  };

  const outboundBaseMatch = {
    ...baseMatch,
    'meta.app.hostname': 'smtp.forwardemail.net'
  };

  const inboundBaseMatch = {
    ...baseMatch,
    'meta.app.hostname': {
      $in: ['mx1.forwardemail.net', 'mx2.forwardemail.net']
    }
  };

  //
  // Index hints for different query types
  //
  const baseHint = { domains: 1, created_at: 1 };
  const bounceHint = { bounce_category: 1, domains: 1, created_at: 1 };
  const responseCodeHint = {
    domains: 1,
    created_at: 1,
    'err.responseCode': 1,
    'meta.app.hostname': 1
  };

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
    'none',
    'other',
    'protocol',
    'recipient',
    'spam',
    'virus'
  ];

  //
  // OPTIMIZATION: Run all queries in parallel using Promise.all
  // Each query is targeted and uses appropriate index hints
  // This is faster than $facet for large datasets because:
  // 1. Each query can use its optimal index
  // 2. MongoDB can parallelize the queries internally
  // 3. No memory pressure from building facet results
  //
  const [
    // Metrics counts
    deliveredCount,
    hardBounceCount,
    softBounceCount,
    spamCount,
    virusCount,
    // Bounce categories by date
    bounceCategoryData,
    // Outbound chart data
    outboundDelivered,
    outboundSoft,
    outboundHard,
    // Inbound chart data
    inboundDelivered,
    inboundSoft,
    inboundHard
  ] = await Promise.all([
    // Metric: delivered count
    countWithCondition(baseMatch, { message: 'delivered' }, baseHint),

    // Metric: hard bounce count (5xx)
    countWithCondition(
      baseMatch,
      { 'err.responseCode': { $gte: 500 } },
      responseCodeHint
    ),

    // Metric: soft bounce count (4xx)
    countWithCondition(
      baseMatch,
      { 'err.responseCode': { $gte: 400, $lt: 500 } },
      responseCodeHint
    ),

    // Metric: spam blocked count
    countWithCondition(
      baseMatch,
      { bounce_category: { $in: ['spam', 'blocklist'] } },
      bounceHint
    ),

    // Metric: virus blocked count
    countWithCondition(baseMatch, { bounce_category: 'virus' }, bounceHint),

    // Bounce categories by date (for chart)
    Logs.aggregate(
      [
        {
          $match: {
            ...baseMatch,
            bounce_category: { $in: categories }
          }
        },
        {
          $group: {
            _id: {
              cat: '$bounce_category',
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$created_at',
                  timezone
                }
              }
            },
            total: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ],
      { hint: bounceHint, allowDiskUse: true }
    ),

    // Outbound: delivered
    groupByDate(outboundBaseMatch, { message: 'delivered' }, responseCodeHint),

    // Outbound: soft bounce
    groupByDate(
      outboundBaseMatch,
      { 'err.responseCode': { $gte: 400, $lt: 500 } },
      responseCodeHint
    ),

    // Outbound: hard bounce
    groupByDate(
      outboundBaseMatch,
      { 'err.responseCode': { $gte: 500 } },
      responseCodeHint
    ),

    // Inbound: delivered
    groupByDate(inboundBaseMatch, { message: 'delivered' }, responseCodeHint),

    // Inbound: soft bounce
    groupByDate(
      inboundBaseMatch,
      { 'err.responseCode': { $gte: 400, $lt: 500 } },
      responseCodeHint
    ),

    // Inbound: hard bounce
    groupByDate(
      inboundBaseMatch,
      { 'err.responseCode': { $gte: 500 } },
      responseCodeHint
    )
  ]);

  // Build bounce categories chart
  const bouncesByCategoryChart = {
    series: transformCategoryResults(categories, dates, bounceCategoryData),
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

  // Build outbound chart
  const outboundChart = (() => {
    const series = [];
    const colors = [];

    const acceptedSeries = transformToSeries(
      'Delivered (250)',
      dates,
      outboundDelivered
    );
    if (acceptedSeries) {
      series.push(acceptedSeries);
      colors.push(green);
    }

    const softSeries = transformToSeries(
      'Soft Bounce (4xx)',
      dates,
      outboundSoft
    );
    if (softSeries) {
      series.push(softSeries);
      colors.push(yellow);
    }

    const hardSeries = transformToSeries(
      'Hard Bounce (5xx)',
      dates,
      outboundHard
    );
    if (hardSeries) {
      series.push(hardSeries);
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
  })();

  // Build inbound chart
  const inboundChart = (() => {
    const series = [];
    const colors = [];

    const acceptedSeries = transformToSeries(
      'Delivered (250)',
      dates,
      inboundDelivered
    );
    if (acceptedSeries) {
      series.push(acceptedSeries);
      colors.push(green);
    }

    const softSeries = transformToSeries(
      'Soft Bounce (4xx)',
      dates,
      inboundSoft
    );
    if (softSeries) {
      series.push(softSeries);
      colors.push(yellow);
    }

    const hardSeries = transformToSeries(
      'Hard Bounce (5xx)',
      dates,
      inboundHard
    );
    if (hardSeries) {
      series.push(hardSeries);
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
  })();

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
        value: deliveredCount ? numeral(deliveredCount).format('0,0') : '-'
      },
      {
        selector: '#metrics-hard-bounce',
        value: hardBounceCount ? numeral(hardBounceCount).format('0,0') : '-'
      },
      {
        selector: '#metrics-soft-bounce',
        value: softBounceCount ? numeral(softBounceCount).format('0,0') : '-'
      },
      {
        selector: '#metrics-spam',
        value: spamCount ? numeral(spamCount).format('0,0') : '-'
      },
      {
        selector: '#metrics-virus',
        value: virusCount ? numeral(virusCount).format('0,0') : '-'
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
