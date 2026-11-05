/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const dayjs = require('dayjs-with-plugins');

const utils = require('../utils');

const { aggregateHour } = require('../../jobs/aggregate-analytics');
const {
  getPendingHours,
  shouldForceRepair
} = require('../../scripts/backfill-analytics');
const AnalyticsEvents = require('#models/analytics-events');
const AnalyticsSummary = require('#models/analytics-summary');
const Users = require('#models/users');
const analyticsController = require('#controllers/web/admin/analytics');

function getSummaries(eventCount = 10) {
  return [
    {
      dimension: 'service',
      value: 'web',
      metrics: {
        event_count: eventCount,
        unique_visitors: 4,
        successful_events: eventCount - 2,
        failed_events: 2
      }
    },
    {
      dimension: 'service_device',
      value: 'web',
      value2: 'desktop',
      metrics: {
        event_count: eventCount,
        unique_visitors: 4,
        successful_events: eventCount - 2,
        failed_events: 2
      }
    },
    {
      dimension: 'browser',
      value: 'Chrome 136.0.0.0',
      metrics: { event_count: eventCount, unique_visitors: 4 }
    },
    {
      dimension: 'os',
      value: 'Linux',
      metrics: { event_count: eventCount, unique_visitors: 4 }
    },
    {
      dimension: 'device_type',
      value: 'desktop',
      metrics: { event_count: eventCount, unique_visitors: 4 }
    },
    {
      dimension: 'client_app',
      value: 'Thunderbird 128.7.0',
      metrics: { event_count: 2, unique_visitors: 1 }
    },
    {
      dimension: 'referrer',
      value: 'example.com',
      value2: 'referral',
      metrics: { event_count: 3, unique_visitors: 2 }
    },
    {
      dimension: 'pathname',
      value: '/about',
      metrics: {
        event_count: 3,
        unique_visitors: 2,
        landing_page_entries: 1
      }
    },
    {
      dimension: 'utm',
      value: 'newsletter',
      value2: 'launch',
      metrics: { event_count: 2, unique_visitors: 1 }
    },
    {
      dimension: 'signup_referrer',
      value: 'example.com',
      value2: 'referral',
      metrics: { event_count: 2 }
    },
    {
      dimension: 'signup_landing_page',
      value: '/about',
      metrics: { event_count: 2 }
    },
    {
      dimension: 'signup_utm',
      value: 'newsletter',
      value2: JSON.stringify({ medium: 'email', campaign: 'launch' }),
      metrics: { event_count: 2 }
    }
  ];
}

function cleanCollections() {
  return Promise.all([
    AnalyticsEvents.deleteMany({}),
    AnalyticsSummary.deleteMany({}),
    Users.deleteMany({ email: /^analytics-test-/ })
  ]);
}

function getContext(query) {
  const context = {
    query: query || { period: '7d' },
    state: {},
    logger: {
      warn() {}
    },
    render(view) {
      context.renderedView = view;
      return view;
    }
  };

  return context;
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(cleanCollections);

test.serial(
  'repair removes the obsolete production summary index before publishing',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    const legacyIndexName =
      'hour_1_service_1_browser_1_os_1_device_type_1_client_app_1_referrer_1_pathname_1';

    await AnalyticsSummary.collection.createIndex(
      {
        hour: 1,
        service: 1,
        browser: 1,
        os: 1,
        device_type: 1,
        client_app: 1,
        referrer: 1,
        pathname: 1
      },
      { name: legacyIndexName, sparse: true, unique: true }
    );
    await AnalyticsSummary.collection.insertOne({
      hour,
      utm_source: 'newsletter'
    });

    await t.notThrowsAsync(
      AnalyticsSummary.replaceHour(hour, getSummaries(12))
    );
    await t.notThrowsAsync(
      AnalyticsSummary.replaceHour(hour, getSummaries(12))
    );

    const indexes = await AnalyticsSummary.collection.indexes();
    const indexNames = indexes.map((index) => index.name);
    t.false(indexNames.includes(legacyIndexName));

    const documents = await AnalyticsSummary.find({ hour }).lean();
    t.truthy(
      documents.find(
        (document) =>
          document.dimension === 'hour' && document.is_complete === true
      )
    );
    t.is(
      documents.find((document) => document.dimension === 'service')
        .event_count,
      12
    );
  }
);

test.serial(
  'hour replacement publishes one current manifest and remains idempotent',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    const firstGeneration = [
      ...getSummaries(10),
      {
        dimension: 'browser',
        value: 'Firefox 128.0',
        metrics: { event_count: 1, unique_visitors: 1 }
      }
    ];

    await AnalyticsSummary.replaceHour(hour, firstGeneration);
    await AnalyticsSummary.replaceHour(hour, getSummaries(12));

    const documents = await AnalyticsSummary.find({ hour }).lean();
    const service = documents.find(
      (document) => document.dimension === 'service'
    );
    const manifest = documents.find(
      (document) => document.dimension === 'hour'
    );

    t.is(documents.length, getSummaries().length + 1);
    t.truthy(manifest);
    t.is(manifest.value, AnalyticsSummary.HOUR_MANIFEST_VALUE);
    t.true(documents.every((document) => document.is_complete === true));
    t.true(
      documents.every(
        (document) =>
          document.schema_version === AnalyticsSummary.CURRENT_SCHEMA_VERSION
      )
    );
    t.is(new Set(documents.map((document) => document.aggregation_id)).size, 1);
    t.is(service.event_count, 12);
    t.is(service.successful_events, 10);
    t.false(documents.some((document) => document.value === 'Firefox 128.0'));
  }
);

test.serial(
  'overlapping hourly publishers are rejected before changing the active generation',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    const originalBulkWrite = AnalyticsSummary.bulkWrite;
    let continueFirstPublisher;
    let markFirstPublisherStarted;
    const firstPublisherStarted = new Promise((resolve) => {
      markFirstPublisherStarted = resolve;
    });
    const firstPublisherCanContinue = new Promise((resolve) => {
      continueFirstPublisher = resolve;
    });

    AnalyticsSummary.bulkWrite = async function (...arguments_) {
      markFirstPublisherStarted();
      await firstPublisherCanContinue;
      return originalBulkWrite.apply(this, arguments_);
    };

    try {
      const firstPublisher = AnalyticsSummary.replaceHour(
        hour,
        getSummaries(10)
      );
      await firstPublisherStarted;

      const error = await t.throwsAsync(
        AnalyticsSummary.replaceHour(hour, getSummaries(20))
      );
      t.regex(error.message, /already in progress/);

      continueFirstPublisher();
      await firstPublisher;
    } finally {
      AnalyticsSummary.bulkWrite = originalBulkWrite;
      continueFirstPublisher();
    }

    const documents = await AnalyticsSummary.find({ hour }).lean();
    const service = documents.find(
      (document) => document.dimension === 'service'
    );
    t.is(service.event_count, 10);
    t.true(documents.every((document) => document.is_complete === true));
  }
);

test.serial(
  'hourly job publishes versioned event and signup dimensions idempotently',
  async (t) => {
    const hour = dayjs().subtract(4, 'hours').startOf('hour').toDate();
    const baseEvent = {
      event_type: 'pageview',
      service: 'web',
      session_hash: 'session-a',
      browser: 'Firefox',
      browser_version: '128.0',
      os: 'Linux',
      os_version: '6.8',
      device_type: 'desktop',
      client_app: 'Thunderbird',
      client_app_version: '128.7.0',
      referrer: 'example.com',
      referrer_source: 'search',
      pathname: '/docs',
      is_landing_page: true,
      utm_source: 'newsletter',
      utm_campaign: 'launch',
      success: true
    };

    await Promise.all([
      AnalyticsEvents.create({
        ...baseEvent,
        created_at: dayjs(hour).add(5, 'minutes').toDate()
      }),
      Users.collection.insertOne({
        email: 'analytics-test-user@example.com',
        created_at: dayjs(hour).add(2, 'minutes').toDate(),
        signup_referrer: 'search.example',
        signup_referrer_source: 'search',
        signup_landing_page: '/pricing',
        signup_utm_source: 'newsletter',
        signup_utm_medium: 'email',
        signup_utm_campaign: 'launch'
      })
    ]);

    await aggregateHour(hour);

    let documents = await AnalyticsSummary.find({ hour })
      .sort({ dimension: 1 })
      .lean();
    t.deepEqual(
      documents.map((document) => document.dimension),
      [
        'browser',
        'client_app',
        'device_type',
        'hour',
        'os',
        'pathname',
        'referrer',
        'service',
        'service_device',
        'signup_landing_page',
        'signup_referrer',
        'signup_utm',
        'utm'
      ]
    );
    t.true(documents.every((document) => document.is_complete === true));
    t.truthy(documents.find((document) => document.value === 'Firefox 128.0'));
    t.truthy(documents.find((document) => document.value === 'Linux 6.8'));
    t.truthy(
      documents.find((document) => document.value === 'Thunderbird 128.7.0')
    );
    t.truthy(documents.find((document) => document.value === 'search.example'));

    await AnalyticsEvents.create({
      ...baseEvent,
      created_at: dayjs(hour).add(10, 'minutes').toDate()
    });
    await aggregateHour(hour);

    documents = await AnalyticsSummary.find({ hour }).lean();
    const service = documents.find(
      (document) => document.dimension === 'service'
    );
    const signupReferrer = documents.find(
      (document) => document.dimension === 'signup_referrer'
    );
    t.is(service.event_count, 2);
    t.is(service.unique_visitors, 1);
    t.is(signupReferrer.event_count, 1);

    await Promise.all([
      AnalyticsEvents.deleteMany({}),
      Users.deleteMany({ email: /^analytics-test-/ })
    ]);
    await aggregateHour(hour);

    documents = await AnalyticsSummary.find({ hour }).lean();
    t.is(documents.length, 1);
    t.is(documents[0].dimension, 'hour');
  }
);

test.serial(
  'repair prioritizes recent missing hours and skips current ones',
  async (t) => {
    const end = dayjs().subtract(3, 'hours').startOf('hour');
    const start = end.subtract(3, 'hours');
    const alreadyComplete = end.subtract(1, 'hour');
    await AnalyticsSummary.replaceHour(alreadyComplete.toDate(), []);

    const pending = await getPendingHours(start, end, false);
    t.deepEqual(
      pending.map((hour) => dayjs(hour).valueOf()),
      [end, end.subtract(2, 'hours'), start].map((hour) => hour.valueOf())
    );

    const forced = await getPendingHours(start, end, true);
    t.deepEqual(
      forced.map((hour) => dayjs(hour).valueOf()),
      [end, end.subtract(1, 'hour'), end.subtract(2, 'hours'), start].map(
        (hour) => hour.valueOf()
      )
    );
  }
);

test('manual repair rebuilds complete hours unless explicitly incremental', (t) => {
  t.true(shouldForceRepair({}, { argv: [], isWorker: false }));
  t.false(shouldForceRepair({}, { argv: [], isWorker: true }));
  t.true(shouldForceRepair({}, { argv: ['--force'], isWorker: true }));
  t.false(shouldForceRepair({}, { argv: ['--incremental'], isWorker: false }));
  t.true(shouldForceRepair({ force: true }, { argv: [], isWorker: true }));
  t.false(shouldForceRepair({ force: false }, { argv: [], isWorker: false }));
});

test.serial(
  'legacy and partial summaries do not satisfy current readiness',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    const startDate = dayjs(hour).subtract(1, 'day').toDate();
    const endDate = dayjs(hour).add(1, 'day').toDate();

    await AnalyticsSummary.collection.insertOne({
      hour,
      dimension: 'service',
      value: 'web',
      event_count: 100,
      is_complete: true
    });
    t.false(await AnalyticsSummary.hasCompleteData(startDate, endDate));

    await AnalyticsSummary.deleteMany({});
    await AnalyticsSummary.create({
      hour,
      dimension: 'service',
      value: 'web',
      event_count: 10,
      is_complete: true
    });
    t.false(await AnalyticsSummary.hasCompleteData(startDate, endDate));

    await AnalyticsSummary.replaceHour(hour, getSummaries());
    t.true(await AnalyticsSummary.hasCompleteData(startDate, endDate));
  }
);

test.serial(
  'failed replacement generations remain invisible to readers',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    const startDate = dayjs(hour).subtract(1, 'day').toDate();
    const endDate = dayjs(hour).add(1, 'day').toDate();

    await AnalyticsSummary.replaceHour(hour, getSummaries());

    const originalBulkWrite = AnalyticsSummary.bulkWrite;
    AnalyticsSummary.bulkWrite = async () => {
      throw new Error('simulated write failure');
    };

    try {
      const error = await t.throwsAsync(
        AnalyticsSummary.replaceHour(hour, getSummaries(20))
      );
      t.is(error.message, 'simulated write failure');
    } finally {
      AnalyticsSummary.bulkWrite = originalBulkWrite;
    }

    const documents = await AnalyticsSummary.find({ hour }).lean();
    const dashboard = await AnalyticsSummary.getDashboardData(
      startDate,
      endDate
    );

    t.true(documents.every((document) => document.is_complete === false));
    t.false(dashboard.hasData);
    t.is(dashboard.overview.total_events, 0);

    await AnalyticsSummary.replaceHour(hour, getSummaries(20));
    const recoveredDashboard = await AnalyticsSummary.getDashboardData(
      startDate,
      endDate
    );
    t.true(recoveredDashboard.hasData);
    t.is(recoveredDashboard.overview.total_events, 20);
  }
);

test.serial('daily series includes the success-rate chart value', async (t) => {
  const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
  const startDate = dayjs(hour).subtract(1, 'day').toDate();
  const endDate = dayjs(hour).add(1, 'day').toDate();

  await AnalyticsSummary.replaceHour(hour, getSummaries(10));

  const series = await AnalyticsSummary.getVisitorsOverTime(startDate, endDate);

  t.is(series.length, 1);
  t.is(series[0].events, 10);
  t.is(series[0].successful_events, 8);
  t.is(series[0].failed_events, 2);
  t.is(series[0].success_rate, 80);
});

test.serial(
  'dashboard renders every widget from one summary query and no raw scans',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    await AnalyticsSummary.replaceHour(hour, getSummaries(10));

    let aggregateCalls = 0;
    const originalAggregate = AnalyticsSummary.aggregate;
    AnalyticsSummary.aggregate = function (...arguments_) {
      aggregateCalls++;
      return originalAggregate.apply(this, arguments_);
    };

    const originalEstimatedCount = AnalyticsEvents.estimatedDocumentCount;
    const originalRawAggregate = AnalyticsEvents.aggregate;
    AnalyticsEvents.estimatedDocumentCount = () => {
      throw new Error('dashboard must not count raw events');
    };

    AnalyticsEvents.aggregate = () => {
      throw new Error('dashboard must not aggregate raw events');
    };

    try {
      const context = getContext();
      await analyticsController.dashboard(context);

      const { analytics } = context.state;
      t.is(context.renderedView, 'admin/analytics/index');
      t.false(analytics.noData);
      t.is(analytics.overview.total_events, 10);
      t.is(analytics.currentVisitors, 0);
      t.is(analytics.topBrowsers[0].browser, 'Chrome 136.0.0.0');
      t.is(analytics.topOS[0].os, 'Linux');
      t.is(analytics.topClientApps[0].client_app, 'Thunderbird 128.7.0');
      t.is(analytics.topReferrers[0].referrer, 'example.com');
      t.is(analytics.topPages[0].pathname, '/about');
      t.is(analytics.topLandingPages[0].pathname, '/about');
      t.is(analytics.signupReferrers[0].count, 2);
      t.is(analytics.signupLandingPages[0].count, 2);
      t.is(analytics.signupUTMSources[0].campaign, 'launch');
      t.is(analytics.chartData.services[0].service, 'web');
      t.is(analytics.chartData.deviceTypes[0].type, 'desktop');
      t.is(analytics.chartData.successRate[0].rate, 80);
      t.is(aggregateCalls, 1);
    } finally {
      AnalyticsSummary.aggregate = originalAggregate;
      AnalyticsEvents.estimatedDocumentCount = originalEstimatedCount;
      AnalyticsEvents.aggregate = originalRawAggregate;
    }
  }
);

test.serial('dashboard does not cache a not-yet-repaired range', async (t) => {
  const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
  await AnalyticsSummary.create({
    hour,
    dimension: 'service',
    value: 'web',
    event_count: 10,
    unique_visitors: 4,
    is_complete: true
  });

  const writes = [];
  const context = getContext();
  context.client = {
    status: 'ready',
    async get() {
      return null;
    },
    async set(...arguments_) {
      writes.push(arguments_);
    }
  };

  await analyticsController.dashboard(context);

  t.true(context.state.analytics.noData);
  t.is(context.state.analytics.chartData.successRate.length, 0);
  t.is(writes.length, 0);
});

test.serial(
  'manifest-only hours remain no-data and are never cached',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    await AnalyticsSummary.replaceHour(hour, []);

    const writes = [];
    const context = getContext();
    context.client = {
      status: 'ready',
      async get() {
        return null;
      },
      async set(...arguments_) {
        writes.push(arguments_);
      }
    };

    await analyticsController.dashboard(context);

    t.true(context.state.analytics.noData);
    t.is(context.state.analytics.overview.total_events, 0);
    t.is(context.state.analytics.chartData.visitors.length, 0);
    t.is(writes.length, 0);
  }
);

test.serial('custom date ranges use one distinct v4 cache entry', async (t) => {
  const hour = dayjs('2026-07-10').startOf('hour').toDate();
  await AnalyticsSummary.replaceHour(hour, getSummaries(10));

  const keys = [];
  const context = getContext({
    period: 'custom',
    start: '2026-07-10',
    end: '2026-07-10'
  });
  context.client = {
    status: 'ready',
    async get(key) {
      keys.push(key);
      return null;
    },
    async set() {}
  };

  await analyticsController.dashboard(context);

  t.deepEqual(keys, ['analytics:v4:dashboard:2026-07-10:2026-07-10:all:all']);
});

test.serial(
  'analytics exports include only current complete business dimensions',
  async (t) => {
    const hour = dayjs().subtract(1, 'hour').startOf('hour').toDate();
    await AnalyticsSummary.replaceHour(hour, getSummaries(10));
    await AnalyticsSummary.collection.insertMany([
      {
        hour,
        dimension: 'service',
        value: 'partial',
        schema_version: AnalyticsSummary.CURRENT_SCHEMA_VERSION,
        event_count: 99,
        is_complete: false
      },
      {
        hour,
        dimension: 'service',
        value: 'legacy',
        schema_version: AnalyticsSummary.CURRENT_SCHEMA_VERSION - 1,
        event_count: 99,
        is_complete: true
      }
    ]);

    const context = {
      query: { period: '7d' },
      set() {}
    };
    await analyticsController.exportData(context);

    const data = JSON.parse(context.body);
    t.is(data.length, getSummaries().length);
    t.true(
      data.every(
        (document) =>
          document.is_complete === true &&
          document.schema_version === AnalyticsSummary.CURRENT_SCHEMA_VERSION &&
          document.dimension !== AnalyticsSummary.HOUR_MANIFEST_DIMENSION
      )
    );
    t.false(data.some((document) => document.value === 'partial'));
    t.false(data.some((document) => document.value === 'legacy'));
  }
);
