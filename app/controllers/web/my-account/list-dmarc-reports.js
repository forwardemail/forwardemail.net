/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const numeral = require('numeral');
const paginate = require('koa-ctx-paginate');
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

// Chart colors
const green = '#9CD85F';
const yellow = '#EAB05E';
const red = '#D24858';
const blue = '#5B9BD5';

/**
 * Helper to run a date-grouped aggregation for DMARC reports
 */
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
        total: { $sum: 1 },
        total_messages: {
          $sum: { $ifNull: ['$meta.dmarc_report.summary.total_messages', 0] }
        },
        spf_aligned: {
          $sum: { $ifNull: ['$meta.dmarc_report.summary.spf_aligned', 0] }
        },
        dkim_aligned: {
          $sum: { $ifNull: ['$meta.dmarc_report.summary.dkim_aligned', 0] }
        },
        accepted: {
          $sum: { $ifNull: ['$meta.dmarc_report.summary.accepted', 0] }
        },
        quarantined: {
          $sum: { $ifNull: ['$meta.dmarc_report.summary.quarantined', 0] }
        },
        rejected: {
          $sum: { $ifNull: ['$meta.dmarc_report.summary.rejected', 0] }
        }
      }
    },
    { $sort: { _id: -1 } }
  ];

  return Logs.aggregate(pipeline, {
    hint,
    allowDiskUse: true
  });
}

async function listDmarcReports(ctx) {
  //
  // NOTE: this is a safeguard since DMARC reports are sensitive
  //
  if (!ctx.isAuthenticated())
    throw Boom.badRequest(ctx.translateError('LOGIN_REQUIRED'));

  const domains = new Set();

  //
  // Support domain filtering via query params
  //
  for (const str of ['domain', 'domains']) {
    if (isSANB(ctx.query[str])) {
      for (const domain of ctx.query[str].split(',')) {
        if (isSANB(domain)) domains.add(domain.toLowerCase());
      }
    } else if (Array.isArray(ctx.query[str])) {
      for (const domain of ctx.query[str]) {
        if (isSANB(domain)) domains.add(domain.toLowerCase());
      }
    }
  }

  // Filter to paid domains only
  const filteredDomains =
    domains.size > 0
      ? ctx.state.domains.filter(
          (d) => d.plan !== 'free' && domains.has(d.name)
        )
      : ctx.state.domains.filter((d) => d.plan !== 'free');

  if (filteredDomains.length === 0) {
    if (ctx.accepts('html')) {
      ctx.state.filteredDomains = [];
      return ctx.render('my-account/dmarc-reports');
    }

    ctx.body = {
      metrics: [],
      charts: [],
      reports: [],
      pageCount: 0,
      itemCount: 0
    };
    return;
  }

  // Build domain query
  const adminDomains = filteredDomains.filter((d) => d.group === 'admin');
  const nonAdminDomains = filteredDomains.filter((d) => d.group !== 'admin');

  const domainOrQuery = [];
  if (adminDomains.length > 0) {
    domainOrQuery.push({ domains: { $in: adminDomains.map((d) => d._id) } });
  }

  if (nonAdminDomains.length > 0) {
    for (const domain of nonAdminDomains) {
      domainOrQuery.push({
        domains: domain._id,
        user: ctx.state.user._id
      });
    }
  }

  if (domainOrQuery.length === 0) {
    if (ctx.accepts('html')) {
      ctx.state.filteredDomains = filteredDomains;
      return ctx.render('my-account/dmarc-reports');
    }

    ctx.body = {
      metrics: [],
      charts: [],
      reports: [],
      pageCount: 0,
      itemCount: 0
    };
    return;
  }

  if (ctx.accepts('html')) {
    ctx.state.filteredDomains = filteredDomains;

    if (isSANB(ctx.query.domains)) {
      const domainList = [];
      const list = ctx.query.domains.split(',');
      for (const d of list) {
        const match = ctx.state.domains.find((obj) => obj.name === d);
        if (!match) continue;
        domainList.push(match.name);
      }

      ctx.state.domainList = domainList;
    }

    return ctx.render('my-account/dmarc-reports');
  }

  // Date range - last 30 days for DMARC reports
  const THIRTY_DAYS_AGO = dayjs().subtract(30, 'day').startOf('day').toDate();

  const dates = [];
  for (let i = 29; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'days').format('YYYY-MM-DD'));
  }

  // Base match for DMARC reports
  const baseMatch = {
    message: 'dmarc_report',
    created_at: { $gte: THIRTY_DAYS_AGO },
    $or: domainOrQuery
  };

  const baseHint = { message: 1, domains: 1, created_at: 1 };

  // Run aggregations in parallel
  const [dailyStats, totalStats, recentReports] = await Promise.all([
    // Daily statistics
    groupByDate(baseMatch, {}, baseHint),
    // Total statistics
    Logs.aggregate(
      [
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            report_count: { $sum: 1 },
            total_messages: {
              $sum: {
                $ifNull: ['$meta.dmarc_report.summary.total_messages', 0]
              }
            },
            spf_aligned: {
              $sum: { $ifNull: ['$meta.dmarc_report.summary.spf_aligned', 0] }
            },
            dkim_aligned: {
              $sum: { $ifNull: ['$meta.dmarc_report.summary.dkim_aligned', 0] }
            },
            accepted: {
              $sum: { $ifNull: ['$meta.dmarc_report.summary.accepted', 0] }
            },
            quarantined: {
              $sum: { $ifNull: ['$meta.dmarc_report.summary.quarantined', 0] }
            },
            rejected: {
              $sum: { $ifNull: ['$meta.dmarc_report.summary.rejected', 0] }
            }
          }
        }
      ],
      { hint: baseHint, allowDiskUse: true }
    ),
    // Recent reports with pagination
    Logs.find({ ...baseMatch })
      .sort({ created_at: -1 })
      .skip(ctx.paginate.skip)
      .limit(ctx.query.limit)
      .select('created_at meta.dmarc_report domains')
      .populate('domains', 'name')
      .lean()
      .exec()
  ]);

  // Get total count for pagination
  const itemCount = await Logs.countDocuments(baseMatch);
  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Process total stats
  const stats = totalStats[0] || {
    report_count: 0,
    total_messages: 0,
    spf_aligned: 0,
    dkim_aligned: 0,
    accepted: 0,
    quarantined: 0,
    rejected: 0
  };

  // Calculate percentages
  const spfAlignedPct =
    stats.total_messages > 0
      ? Math.round((stats.spf_aligned / stats.total_messages) * 1000) / 10
      : 0;
  const dkimAlignedPct =
    stats.total_messages > 0
      ? Math.round((stats.dkim_aligned / stats.total_messages) * 1000) / 10
      : 0;
  const passRate =
    stats.total_messages > 0
      ? Math.round((stats.accepted / stats.total_messages) * 1000) / 10
      : 0;

  // Build charts
  const messagesData = [];
  const spfData = [];
  const dkimData = [];
  const dispositionData = { accepted: [], quarantined: [], rejected: [] };

  const statsByDate = {};
  for (const stat of dailyStats) {
    statsByDate[stat._id] = stat;
  }

  for (const date of dates) {
    const stat = statsByDate[date] || {
      total_messages: 0,
      spf_aligned: 0,
      dkim_aligned: 0,
      accepted: 0,
      quarantined: 0,
      rejected: 0
    };

    messagesData.push([date, stat.total_messages]);
    spfData.push([date, stat.spf_aligned]);
    dkimData.push([date, stat.dkim_aligned]);
    dispositionData.accepted.push([date, stat.accepted]);
    dispositionData.quarantined.push([date, stat.quarantined]);
    dispositionData.rejected.push([date, stat.rejected]);
  }

  // Messages over time chart
  const messagesChart = {
    series: [
      { name: 'Total Messages', data: messagesData },
      { name: 'SPF Aligned', data: spfData },
      { name: 'DKIM Aligned', data: dkimData }
    ],
    chart: {
      type: 'area',
      height: 300
    },
    colors: [blue, green, yellow],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      min: 0
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    },
    legend: {
      position: 'top'
    }
  };

  // Disposition chart
  const dispositionChart = {
    series: [
      { name: 'Accepted', data: dispositionData.accepted },
      { name: 'Quarantined', data: dispositionData.quarantined },
      { name: 'Rejected', data: dispositionData.rejected }
    ],
    chart: {
      type: 'bar',
      height: 300,
      stacked: true
    },
    colors: [green, yellow, red],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      min: 0
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    },
    legend: {
      position: 'top'
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    }
  };

  // Alignment pie chart
  const alignmentChart = {
    series: [stats.spf_aligned, stats.dkim_aligned],
    chart: {
      type: 'donut',
      height: 250
    },
    labels: ['SPF Aligned', 'DKIM Aligned'],
    colors: [green, blue],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Messages',
              formatter: () => numeral(stats.total_messages).format('0,0')
            }
          }
        }
      }
    }
  };

  const options = {
    dataLabels: {
      enabled: false
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

  // Format reports for display
  const reports = recentReports.map((log) => {
    const report = log.meta?.dmarc_report || {};
    const domainName = (log.domains || [])
      .map((d) => (typeof d === 'object' ? d.name : d))
      .find(Boolean);

    return {
      id: log._id,
      received_at: log.created_at,
      domain_name: report.domain_name || domainName || 'Unknown',
      org_name: report.report_metadata?.org_name || 'Unknown',
      report_id: report.report_metadata?.report_id || '',
      date_range: report.report_metadata?.date_range || {},
      policy: report.policy_published?.p || 'none',
      total_messages: report.summary?.total_messages || 0,
      spf_aligned: report.summary?.spf_aligned || 0,
      dkim_aligned: report.summary?.dkim_aligned || 0,
      spf_aligned_pct: report.summary?.spf_aligned_pct || 0,
      dkim_aligned_pct: report.summary?.dkim_aligned_pct || 0,
      accepted: report.summary?.accepted || 0,
      quarantined: report.summary?.quarantined || 0,
      rejected: report.summary?.rejected || 0,
      pass_rate: report.summary?.pass_rate || 0
    };
  });

  ctx.body = {
    metrics: [
      {
        selector: '#metrics-reports',
        value: stats.report_count
          ? numeral(stats.report_count).format('0,0')
          : '-'
      },
      {
        selector: '#metrics-messages',
        value: stats.total_messages
          ? numeral(stats.total_messages).format('0,0')
          : '-'
      },
      {
        selector: '#metrics-spf-aligned',
        value: stats.total_messages > 0 ? `${spfAlignedPct}%` : '-'
      },
      {
        selector: '#metrics-dkim-aligned',
        value: stats.total_messages > 0 ? `${dkimAlignedPct}%` : '-'
      },
      {
        selector: '#metrics-pass-rate',
        value: stats.total_messages > 0 ? `${passRate}%` : '-'
      }
    ],
    charts: [
      {
        selector: '#messages-chart',
        options: _.merge({}, options, messagesChart)
      },
      {
        selector: '#disposition-chart',
        options: _.merge({}, options, dispositionChart)
      },
      {
        selector: '#alignment-chart',
        options: _.merge({}, options, alignmentChart)
      }
    ],
    reports,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  };
}

module.exports = listDmarcReports;
