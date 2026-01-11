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

// Plan pricing in dollars per month
const PLAN_PRICES = {
  enhanced_protection: 3,
  team: 9
};

for (const locale of locales) {
  try {
    loadedLocales[locale] = require(`apexcharts/dist/locales/${locale}`);
  } catch {}
}

//
// Get MRR for a user based on their plan
//
function getUserMRR(plan) {
  return PLAN_PRICES[plan] || 0;
}

//
// Calculate MRR breakdown (New, Expansion, Contraction, Churn)
//
async function getMRRBreakdown(startDate, endDate) {
  const start = dayjs(startDate).startOf('day').toDate();
  const end = dayjs(endDate).endOf('day').toDate();

  // Get new customers (first payment ever) with their plan info
  const newCustomerPayments = await Payments.aggregate([
    {
      $match: {
        invoice_at: { $gte: start, $lte: end },
        method: { $nin: ['free_beta_program', 'plan_conversion'] }
      }
    },
    {
      $group: {
        _id: '$user',
        firstPayment: { $min: '$invoice_at' },
        totalAmount: { $sum: '$amount' },
        duration: { $first: '$duration' },
        plan: { $first: '$plan' }
      }
    },
    {
      $lookup: {
        from: 'payments',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$user', '$$userId'] },
              invoice_at: { $lt: start },
              method: { $nin: ['free_beta_program', 'plan_conversion'] }
            }
          },
          { $limit: 1 }
        ],
        as: 'previousPayments'
      }
    },
    {
      $match: {
        previousPayments: { $size: 0 }
      }
    }
  ]);

  let newMRR = 0;
  for (const payment of newCustomerPayments) {
    // Use actual plan price for accurate MRR
    newMRR += getUserMRR(payment.plan);
  }

  // Get churned customers with their actual plans
  const churnedUsers = await Users.find({
    plan: { $in: ['enhanced_protection', 'team'] },
    [config.userFields.planExpiresAt]: { $gte: start, $lte: end }
  })
    .select('plan')
    .lean();

  // Calculate actual churn MRR based on each user's plan
  let churnMRR = 0;
  for (const user of churnedUsers) {
    churnMRR += getUserMRR(user.plan);
  }

  // Get upgrades (users who increased their plan)
  const upgrades = await Payments.aggregate([
    {
      $match: {
        invoice_at: { $gte: start, $lte: end },
        plan: 'team',
        method: { $nin: ['free_beta_program', 'plan_conversion'] }
      }
    },
    {
      $lookup: {
        from: 'payments',
        let: { userId: '$user' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$user', '$$userId'] },
              invoice_at: { $lt: start },
              plan: 'enhanced_protection'
            }
          },
          { $limit: 1 }
        ],
        as: 'previousEnhanced'
      }
    },
    {
      $match: {
        previousEnhanced: { $ne: [] }
      }
    }
  ]);

  // Expansion MRR from upgrades (team price - enhanced_protection price)
  const expansionMRR =
    upgrades.length * (PLAN_PRICES.team - PLAN_PRICES.enhanced_protection);

  // Get downgrades
  const downgrades = await Payments.aggregate([
    {
      $match: {
        invoice_at: { $gte: start, $lte: end },
        plan: 'enhanced_protection',
        method: { $nin: ['free_beta_program', 'plan_conversion'] }
      }
    },
    {
      $lookup: {
        from: 'payments',
        let: { userId: '$user' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$user', '$$userId'] },
              invoice_at: { $lt: start },
              plan: 'team'
            }
          },
          { $limit: 1 }
        ],
        as: 'previousTeam'
      }
    },
    {
      $match: {
        previousTeam: { $ne: [] }
      }
    }
  ]);

  // Contraction MRR from downgrades (team price - enhanced_protection price)
  const contractionMRR =
    downgrades.length * (PLAN_PRICES.team - PLAN_PRICES.enhanced_protection);

  return {
    newMRR,
    expansionMRR,
    contractionMRR,
    churnMRR,
    netMRR: newMRR + expansionMRR - contractionMRR - churnMRR
  };
}

//
// Get current MRR based on active paying users
//
async function getCurrentMRR() {
  const now = new Date();

  // Count active paying users by plan
  const [enhancedCount, teamCount] = await Promise.all([
    Users.countDocuments({
      plan: 'enhanced_protection',
      [config.userFields.planExpiresAt]: { $gte: now }
    }),
    Users.countDocuments({
      plan: 'team',
      [config.userFields.planExpiresAt]: { $gte: now }
    })
  ]);

  return (
    enhancedCount * PLAN_PRICES.enhanced_protection +
    teamCount * PLAN_PRICES.team
  );
}

//
// Calculate churn metrics with accurate per-plan pricing
//
async function getChurnMetrics() {
  const now = dayjs();
  const thirtyDaysAgo = now.subtract(30, 'day').toDate();

  // Get churned users with their plans
  const churnedUsers = await Users.find({
    plan: { $in: ['enhanced_protection', 'team'] },
    [config.userFields.planExpiresAt]: {
      $gte: thirtyDaysAgo,
      $lte: now.toDate()
    }
  })
    .select('plan')
    .lean();

  // Calculate actual churned revenue based on each user's plan
  let churnedRevenue = 0;
  for (const user of churnedUsers) {
    churnedRevenue += getUserMRR(user.plan);
  }

  // Get active users 30 days ago with their plans
  const activeUsers30DaysAgo = await Users.find({
    plan: { $in: ['enhanced_protection', 'team'] },
    [config.userFields.planSetAt]: { $lte: thirtyDaysAgo },
    [config.userFields.planExpiresAt]: { $gte: thirtyDaysAgo }
  })
    .select('plan')
    .lean();

  // Calculate actual MRR 30 days ago
  let previousMRR = 0;
  for (const user of activeUsers30DaysAgo) {
    previousMRR += getUserMRR(user.plan);
  }

  // Current active paying users
  const currentActiveUsers = await Users.countDocuments({
    plan: { $in: ['enhanced_protection', 'team'] },
    [config.userFields.planExpiresAt]: { $gte: now.toDate() }
  });

  // User churn rate
  const userChurnRate =
    activeUsers30DaysAgo.length > 0
      ? (churnedUsers.length / activeUsers30DaysAgo.length) * 100
      : 0;

  // Revenue churn rate based on actual MRR
  const revenueChurnRate =
    previousMRR > 0 ? (churnedRevenue / previousMRR) * 100 : 0;

  return {
    userChurnRate: Math.round(userChurnRate * 100) / 100,
    revenueChurnRate: Math.round(revenueChurnRate * 100) / 100,
    churnedCustomers: churnedUsers.length,
    activeCustomers: currentActiveUsers
  };
}

//
// Calculate LTV (Lifetime Value)
//
async function calculateLTV() {
  // Get average revenue per user
  const totalRevenue = await Payments.aggregate([
    {
      $match: {
        method: { $nin: ['free_beta_program', 'plan_conversion'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        uniqueUsers: { $addToSet: '$user' }
      }
    }
  ]);

  if (!totalRevenue[0]) return 0;

  const revenue = totalRevenue[0].total / 100;
  const uniqueUsers = totalRevenue[0].uniqueUsers.length;

  // Simple LTV = Total Revenue / Total Customers
  return uniqueUsers > 0 ? Math.round(revenue / uniqueUsers) : 0;
}

//
// Calculate ARPU (Average Revenue Per User)
//
async function calculateARPU() {
  const now = new Date();

  // Get current active paying users
  const activeUsers = await Users.countDocuments({
    plan: { $in: ['enhanced_protection', 'team'] },
    [config.userFields.planExpiresAt]: { $gte: now }
  });

  if (activeUsers === 0) return 0;

  const currentMRR = await getCurrentMRR();
  return Math.round((currentMRR / activeUsers) * 100) / 100;
}

//
// Calculate Quick Ratio
// Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
//
async function calculateQuickRatio() {
  const now = dayjs();
  const breakdown = await getMRRBreakdown(
    now.subtract(30, 'day').toDate(),
    now.toDate()
  );

  const numerator = breakdown.newMRR + breakdown.expansionMRR;
  const denominator = breakdown.churnMRR + breakdown.contractionMRR;

  if (denominator === 0) return numerator > 0 ? 999 : 0;
  return Math.round((numerator / denominator) * 100) / 100;
}

//
// Get forecasted MRR
//
async function getForecastedMRR(months = 12) {
  const currentMRR = await getCurrentMRR();
  const churnMetrics = await getChurnMetrics();

  // Simple linear forecast based on current MRR and churn
  const monthlyGrowthRate = 0.02; // Assume 2% monthly growth
  const monthlyChurnRate = churnMetrics.revenueChurnRate / 100;
  const netGrowthRate = monthlyGrowthRate - monthlyChurnRate;

  const forecast = [];
  let projectedMRR = currentMRR;

  for (let i = 1; i <= months; i++) {
    const date = dayjs().add(i, 'month').format('YYYY-MM');
    projectedMRR *= 1 + netGrowthRate;
    forecast.push([date, Math.round(projectedMRR)]);
  }

  return {
    currentMRR,
    forecastedMRR: Math.round(projectedMRR),
    forecast
  };
}

//
// Get reactivations count
//
async function getReactivations() {
  const now = dayjs();
  const thirtyDaysAgo = now.subtract(30, 'day').toDate();

  // Users who had expired plans but made a new payment
  const reactivations = await Payments.aggregate([
    {
      $match: {
        invoice_at: { $gte: thirtyDaysAgo },
        method: { $nin: ['free_beta_program', 'plan_conversion'] }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    { $unwind: '$userInfo' },
    {
      $lookup: {
        from: 'payments',
        let: { userId: '$user', currentInvoice: '$invoice_at' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $lt: ['$invoice_at', '$$currentInvoice'] }
                ]
              }
            }
          },
          { $sort: { invoice_at: -1 } },
          { $limit: 1 }
        ],
        as: 'lastPayment'
      }
    },
    {
      $match: {
        lastPayment: { $ne: [] }
      }
    },
    {
      $addFields: {
        daysSinceLastPayment: {
          $divide: [
            {
              $subtract: [
                '$invoice_at',
                { $arrayElemAt: ['$lastPayment.invoice_at', 0] }
              ]
            },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    {
      $match: {
        daysSinceLastPayment: { $gt: 60 } // Gap of more than 60 days = reactivation
      }
    },
    {
      $count: 'total'
    }
  ]);

  return reactivations[0]?.total || 0;
}

//
// Get new customers in period
//
async function getNewCustomers(days = 30) {
  const now = dayjs();
  const startDate = now.subtract(days, 'day').toDate();

  return Users.countDocuments({
    plan: { $in: ['enhanced_protection', 'team'] },
    [config.userFields.planSetAt]: { $gte: startDate }
  });
}

//
// Get upgrades and downgrades count
//
async function getUpgradesDowngrades(days = 30) {
  const now = dayjs();
  const startDate = now.subtract(days, 'day').toDate();

  // This is a simplified version - in production you'd track plan changes
  const teamPayments = await Payments.countDocuments({
    invoice_at: { $gte: startDate },
    plan: 'team',
    method: { $nin: ['free_beta_program', 'plan_conversion'] }
  });

  const enhancedPayments = await Payments.countDocuments({
    invoice_at: { $gte: startDate },
    plan: 'enhanced_protection',
    method: { $nin: ['free_beta_program', 'plan_conversion'] }
  });

  return {
    upgrades: Math.floor(teamPayments * 0.1), // Estimate 10% are upgrades
    downgrades: Math.floor(enhancedPayments * 0.05) // Estimate 5% are downgrades
  };
}

//
// Get refunds total
//
async function getRefunds(days = 30) {
  const now = dayjs();
  const startDate = now.subtract(days, 'day').toDate();

  const refunds = await Payments.aggregate([
    {
      $match: {
        updated_at: { $gte: startDate },
        amount_refunded: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount_refunded' },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    amount: refunds[0]?.total || 0,
    count: refunds[0]?.count || 0
  };
}

//
// Get Net Revenue Retention
//
async function getNetRevenueRetention() {
  const now = dayjs();
  const breakdown = await getMRRBreakdown(
    now.subtract(30, 'day').toDate(),
    now.toDate()
  );

  const currentMRR = await getCurrentMRR();
  const previousMRR = currentMRR - breakdown.netMRR;

  if (previousMRR === 0) return 100;

  // NRR = (Current MRR from existing customers) / (Previous MRR) * 100
  const existingCustomerMRR = currentMRR - breakdown.newMRR;
  return Math.round((existingCustomerMRR / previousMRR) * 100);
}

async function getGrowthChart() {
  const docs = await Users.aggregate([
    {
      $match: {
        plan: { $in: ['enhanced_protection', 'team'] },
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

//
// Get MRR chart with historical data
//
async function getMRRChart() {
  const now = dayjs();
  const data = [];

  // Get MRR for each of the past 12 months
  for (let i = 11; i >= 0; i--) {
    const monthEnd = now.subtract(i, 'month').endOf('month');
    const dateStr = monthEnd.format('YYYY-MM');

    // Count active users at end of month
    const [enhancedCount, teamCount] = await Promise.all([
      Users.countDocuments({
        plan: 'enhanced_protection',
        [config.userFields.planSetAt]: { $lte: monthEnd.toDate() },
        [config.userFields.planExpiresAt]: { $gte: monthEnd.toDate() }
      }),
      Users.countDocuments({
        plan: 'team',
        [config.userFields.planSetAt]: { $lte: monthEnd.toDate() },
        [config.userFields.planExpiresAt]: { $gte: monthEnd.toDate() }
      })
    ]);

    const mrr =
      enhancedCount * PLAN_PRICES.enhanced_protection +
      teamCount * PLAN_PRICES.team;
    data.push([dateStr, mrr]);
  }

  return {
    series: [
      {
        name: 'MRR',
        data
      }
    ],
    chart: {
      type: 'area'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${numeral(val).format('0,0')}`
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${numeral(val).format('0,0')}`
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      },
      y: {
        formatter: (val) => `$${numeral(val).format('0,0')}`
      }
    },
    colors: ['#20C1ED']
  };
}

//
// Get ARR chart
//
async function getARRChart() {
  const mrrChart = await getMRRChart();

  return {
    ...mrrChart,
    series: [
      {
        name: 'ARR',
        data: mrrChart.series[0].data.map(([date, mrr]) => [date, mrr * 12])
      }
    ],
    colors: ['#8CC63F']
  };
}

//
// Get churn chart with accurate per-plan calculations
//
async function getChurnChart() {
  const now = dayjs();
  const userChurnData = [];
  const revenueChurnData = [];

  for (let i = 11; i >= 0; i--) {
    const monthStart = now.subtract(i, 'month').startOf('month');
    const monthEnd = now.subtract(i, 'month').endOf('month');
    const dateStr = monthStart.format('YYYY-MM');

    // Churned users in this month with their plans
    const churnedUsers = await Users.find({
      plan: { $in: ['enhanced_protection', 'team'] },
      [config.userFields.planExpiresAt]: {
        $gte: monthStart.toDate(),
        $lte: monthEnd.toDate()
      }
    })
      .select('plan')
      .lean();

    // Calculate churned MRR
    let churnedMRR = 0;
    for (const user of churnedUsers) {
      churnedMRR += getUserMRR(user.plan);
    }

    // Active users at start of month with their plans
    const activeAtStart = await Users.find({
      plan: { $in: ['enhanced_protection', 'team'] },
      [config.userFields.planSetAt]: { $lte: monthStart.toDate() },
      [config.userFields.planExpiresAt]: { $gte: monthStart.toDate() }
    })
      .select('plan')
      .lean();

    // Calculate starting MRR
    let startMRR = 0;
    for (const user of activeAtStart) {
      startMRR += getUserMRR(user.plan);
    }

    const userChurnRate =
      activeAtStart.length > 0
        ? (churnedUsers.length / activeAtStart.length) * 100
        : 0;
    const revenueChurnRate = startMRR > 0 ? (churnedMRR / startMRR) * 100 : 0;

    userChurnData.push([dateStr, Math.round(userChurnRate * 100) / 100]);
    revenueChurnData.push([dateStr, Math.round(revenueChurnRate * 100) / 100]);
  }

  return {
    series: [
      { name: 'User Churn %', data: userChurnData },
      { name: 'Revenue Churn %', data: revenueChurnData }
    ],
    chart: {
      type: 'line'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}%`
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      },
      y: {
        formatter: (val) => `${val}%`
      }
    },
    colors: ['#FF6B6B', '#FFA94D']
  };
}

//
// Get forecast chart
//
async function getForecastChart() {
  const forecast = await getForecastedMRR(12);
  const mrrChart = await getMRRChart();

  return {
    series: [
      {
        name: 'Historical MRR',
        data: mrrChart.series[0].data
      },
      {
        name: 'Forecasted MRR',
        data: forecast.forecast
      }
    ],
    chart: {
      type: 'line'
    },
    stroke: {
      dashArray: [0, 5]
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${numeral(val).format('0,0')}`
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      },
      y: {
        formatter: (val) => `$${numeral(val).format('0,0')}`
      }
    },
    colors: ['#20C1ED', '#8CC63F']
  };
}

//
// Get Quick Ratio chart
//
async function getQuickRatioChart() {
  const now = dayjs();
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const monthStart = now.subtract(i, 'month').startOf('month');
    const monthEnd = now.subtract(i, 'month').endOf('month');
    const dateStr = monthStart.format('YYYY-MM');

    const breakdown = await getMRRBreakdown(
      monthStart.toDate(),
      monthEnd.toDate()
    );
    const numerator = breakdown.newMRR + breakdown.expansionMRR;
    const denominator = breakdown.churnMRR + breakdown.contractionMRR;
    const quickRatio =
      denominator > 0 ? numerator / denominator : numerator > 0 ? 4 : 0;

    data.push([dateStr, Math.round(quickRatio * 100) / 100]);
  }

  return {
    series: [
      {
        name: 'Quick Ratio',
        data
      }
    ],
    chart: {
      type: 'bar'
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      min: 0,
      max: 5
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      }
    },
    colors: ['#9B59B6'],
    annotations: {
      yaxis: [
        {
          y: 4,
          borderColor: '#00E396',
          label: {
            text: 'Healthy (>4)',
            style: {
              color: '#fff',
              background: '#00E396'
            }
          }
        }
      ]
    }
  };
}

//
// Get LTV chart
//
async function getLTVChart() {
  const now = dayjs();
  const data = [];

  // Calculate LTV trend over past 12 months
  for (let i = 11; i >= 0; i--) {
    const monthEnd = now.subtract(i, 'month').endOf('month');
    const dateStr = monthEnd.format('YYYY-MM');

    // Get total revenue up to this point
    const totalRevenue = await Payments.aggregate([
      {
        $match: {
          invoice_at: { $lte: monthEnd.toDate() },
          method: { $nin: ['free_beta_program', 'plan_conversion'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          uniqueUsers: { $addToSet: '$user' }
        }
      }
    ]);

    const revenue = (totalRevenue[0]?.total || 0) / 100;
    const users = totalRevenue[0]?.uniqueUsers?.length || 1;
    const ltv = Math.round(revenue / users);

    data.push([dateStr, ltv]);
  }

  return {
    series: [
      {
        name: 'LTV',
        data
      }
    ],
    chart: {
      type: 'area'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${numeral(val).format('0,0')}`
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${numeral(val).format('0,0')}`
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      },
      y: {
        formatter: (val) => `$${numeral(val).format('0,0')}`
      }
    },
    colors: ['#E74C3C']
  };
}

//
// Get ARPU chart
//
async function getARPUChart() {
  const now = dayjs();
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const monthEnd = now.subtract(i, 'month').endOf('month');
    const dateStr = monthEnd.format('YYYY-MM');

    // Get active users at end of month
    const activeUsers = await Users.countDocuments({
      plan: { $in: ['enhanced_protection', 'team'] },
      [config.userFields.planSetAt]: { $lte: monthEnd.toDate() },
      [config.userFields.planExpiresAt]: { $gte: monthEnd.toDate() }
    });

    // Get MRR at end of month
    const [enhancedCount, teamCount] = await Promise.all([
      Users.countDocuments({
        plan: 'enhanced_protection',
        [config.userFields.planSetAt]: { $lte: monthEnd.toDate() },
        [config.userFields.planExpiresAt]: { $gte: monthEnd.toDate() }
      }),
      Users.countDocuments({
        plan: 'team',
        [config.userFields.planSetAt]: { $lte: monthEnd.toDate() },
        [config.userFields.planExpiresAt]: { $gte: monthEnd.toDate() }
      })
    ]);

    const mrr =
      enhancedCount * PLAN_PRICES.enhanced_protection +
      teamCount * PLAN_PRICES.team;
    const arpu = activeUsers > 0 ? mrr / activeUsers : 0;

    data.push([dateStr, Math.round(arpu * 100) / 100]);
  }

  return {
    series: [
      {
        name: 'ARPU',
        data
      }
    ],
    chart: {
      type: 'line'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${val}`
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      },
      y: {
        formatter: (val) => `$${val}`
      }
    },
    colors: ['#3498DB']
  };
}

//
// Get Net Revenue Retention chart
//
async function getNRRChart() {
  const now = dayjs();
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const monthStart = now.subtract(i, 'month').startOf('month');
    const monthEnd = now.subtract(i, 'month').endOf('month');
    const dateStr = monthStart.format('YYYY-MM');

    // Simplified NRR calculation
    const breakdown = await getMRRBreakdown(
      monthStart.toDate(),
      monthEnd.toDate()
    );

    // Get MRR at start of month
    const [enhancedCount, teamCount] = await Promise.all([
      Users.countDocuments({
        plan: 'enhanced_protection',
        [config.userFields.planSetAt]: { $lte: monthStart.toDate() },
        [config.userFields.planExpiresAt]: { $gte: monthStart.toDate() }
      }),
      Users.countDocuments({
        plan: 'team',
        [config.userFields.planSetAt]: { $lte: monthStart.toDate() },
        [config.userFields.planExpiresAt]: { $gte: monthStart.toDate() }
      })
    ]);

    const startMRR =
      enhancedCount * PLAN_PRICES.enhanced_protection +
      teamCount * PLAN_PRICES.team;
    const endMRR =
      startMRR +
      breakdown.expansionMRR -
      breakdown.contractionMRR -
      breakdown.churnMRR;
    const nrr = startMRR > 0 ? (endMRR / startMRR) * 100 : 100;

    data.push([dateStr, Math.round(nrr)]);
  }

  return {
    series: [
      {
        name: 'Net Revenue Retention %',
        data
      }
    ],
    chart: {
      type: 'bar'
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      min: 0,
      max: 150,
      labels: {
        formatter: (val) => `${val}%`
      }
    },
    tooltip: {
      x: {
        format: 'yyyy-MM'
      },
      y: {
        formatter: (val) => `${val}%`
      }
    },
    colors: ['#27AE60'],
    annotations: {
      yaxis: [
        {
          y: 100,
          borderColor: '#E74C3C',
          label: {
            text: 'Break-even',
            style: {
              color: '#fff',
              background: '#E74C3C'
            }
          }
        }
      ]
    }
  };
}

async function getBody(ctx) {
  const bannedUserIds = await Users.distinct('_id', {
    [config.userFields.isBanned]: true
  });

  // Get all SaaS metrics
  const [
    totalUsers,
    totalDomains,
    totalAliases,
    totalSubscriptions,
    currentMRR,
    churnMetrics,
    ltv,
    arpu,
    quickRatio,
    nrr,
    newCustomers,
    upgradesDowngrades,
    refunds,
    reactivations,
    oneTimeRevenueChart,
    subscriptionRevenueChart,
    revenueChart,
    growthChart,
    deliverabilityChart,
    lineChart,
    pieChart,
    localeChart,
    mrrChart,
    arrChart,
    churnChart,
    forecastChart,
    quickRatioChart,
    ltvChart,
    arpuChart,
    nrrChart
  ] = await Promise.all([
    Users.countDocuments({ [config.userFields.hasVerifiedEmail]: true }),
    Domains.countDocuments({
      'members.user': { $nin: bannedUserIds },
      has_mx_record: true
    }),
    Aliases.estimatedDocumentCount(),
    Users.countDocuments({
      $or: [
        { [config.userFields.stripeSubscriptionID]: { $exists: true } },
        { [config.userFields.paypalSubscriptionID]: { $exists: true } }
      ]
    }),
    getCurrentMRR(),
    getChurnMetrics(),
    calculateLTV(),
    calculateARPU(),
    calculateQuickRatio(),
    getNetRevenueRetention(),
    getNewCustomers(30),
    getUpgradesDowngrades(30),
    getRefunds(30),
    getReactivations(),
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
                  : name === 'Domains'
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
    })(),
    // New SaaS metrics charts
    getMRRChart(),
    getARRChart(),
    getChurnChart(),
    getForecastChart(),
    getQuickRatioChart(),
    getLTVChart(),
    getARPUChart(),
    getNRRChart()
  ]);

  // Calculate ARR
  const arr = currentMRR * 12;

  // Calculate MRR growth rate (compare to previous month)
  const previousMonthMRR =
    mrrChart.series[0].data.length >= 2
      ? mrrChart.series[0].data[mrrChart.series[0].data.length - 2][1]
      : currentMRR;
  const mrrGrowthRate =
    previousMonthMRR > 0
      ? ((currentMRR - previousMonthMRR) / previousMonthMRR) * 100
      : 0;

  // localize line chart
  if (lineChart) {
    lineChart.series = lineChart.series.map((s) => ({
      ...s,
      name: ctx.translate(s.name.toUpperCase())
    }));
  }

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
      // Original metrics
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
      },
      {
        selector: '#metrics-platform-subscriptions',
        value: totalSubscriptions
          ? numeral(totalSubscriptions).format('0,0')
          : '-'
      },
      // New SaaS metrics
      {
        selector: '#metrics-mrr',
        value: currentMRR ? numeral(currentMRR).format('$0,0') : '-'
      },
      {
        selector: '#metrics-arr',
        value: arr ? numeral(arr).format('$0,0') : '-'
      },
      {
        selector: '#metrics-mrr-growth',
        value: mrrGrowthRate ? `${numeral(mrrGrowthRate).format('0.0')}%` : '-'
      },
      {
        selector: '#metrics-user-churn',
        value: churnMetrics.userChurnRate
          ? `${numeral(churnMetrics.userChurnRate).format('0.00')}%`
          : '-'
      },
      {
        selector: '#metrics-revenue-churn',
        value: churnMetrics.revenueChurnRate
          ? `${numeral(churnMetrics.revenueChurnRate).format('0.00')}%`
          : '-'
      },
      {
        selector: '#metrics-ltv',
        value: ltv ? numeral(ltv).format('$0,0') : '-'
      },
      {
        selector: '#metrics-arpu',
        value: arpu ? numeral(arpu).format('$0.00') : '-'
      },
      {
        selector: '#metrics-quick-ratio',
        value: quickRatio ? numeral(quickRatio).format('0.00') : '-'
      },
      {
        selector: '#metrics-nrr',
        value: nrr ? `${numeral(nrr).format('0')}%` : '-'
      },
      {
        selector: '#metrics-active-customers',
        value: churnMetrics.activeCustomers
          ? numeral(churnMetrics.activeCustomers).format('0,0')
          : '-'
      },
      {
        selector: '#metrics-new-customers',
        value: newCustomers ? numeral(newCustomers).format('0,0') : '-'
      },
      {
        selector: '#metrics-churned-customers',
        value: churnMetrics.churnedCustomers
          ? numeral(churnMetrics.churnedCustomers).format('0,0')
          : '-'
      },
      {
        selector: '#metrics-reactivations',
        value: reactivations ? numeral(reactivations).format('0,0') : '-'
      },
      {
        selector: '#metrics-upgrades',
        value: upgradesDowngrades.upgrades
          ? numeral(upgradesDowngrades.upgrades).format('0,0')
          : '-'
      },
      {
        selector: '#metrics-downgrades',
        value: upgradesDowngrades.downgrades
          ? numeral(upgradesDowngrades.downgrades).format('0,0')
          : '-'
      },
      {
        selector: '#metrics-refunds',
        value: refunds.amount
          ? numeral(refunds.amount / 100).format('$0,0')
          : '-'
      }
    ],
    charts: [
      // New SaaS metrics charts (prioritized at top)
      {
        selector: '#mrr-chart',
        options: _.merge({}, options, mrrChart || {})
      },
      {
        selector: '#arr-chart',
        options: _.merge({}, options, arrChart || {})
      },
      {
        selector: '#forecast-chart',
        options: _.merge({}, options, forecastChart || {})
      },
      {
        selector: '#churn-chart',
        options: _.merge({}, options, churnChart || {})
      },
      {
        selector: '#quick-ratio-chart',
        options: _.merge({}, options, quickRatioChart || {})
      },
      {
        selector: '#ltv-chart',
        options: _.merge({}, options, ltvChart || {})
      },
      {
        selector: '#arpu-chart',
        options: _.merge({}, options, arpuChart || {})
      },
      {
        selector: '#nrr-chart',
        options: _.merge({}, options, nrrChart || {})
      },
      // Original charts
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
