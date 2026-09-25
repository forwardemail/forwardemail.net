/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const sinon = require('sinon');
const test = require('ava');

const utils = require('../utils');

let TTI;

test.before(async () => {
  await utils.setupMongoose();
  TTI = require('#models/tti');
});

test.after.always(utils.teardownMongoose);

function loadHelper() {
  const helperPath = require.resolve('#helpers/get-latest-tti');
  delete require.cache[helperPath];
  return require('#helpers/get-latest-tti');
}

function createQuery(value) {
  return {
    sort: sinon.stub().returnsThis(),
    lean: sinon.stub().resolves(value)
  };
}

test.afterEach.always(() => {
  sinon.restore();
  delete require.cache[require.resolve('#helpers/get-latest-tti')];
});

test.serial(
  'caches the current Time to Inbox sample for summary renders',
  async (t) => {
    const sample = {
      created_at: new Date('2026-09-24T00:00:00Z'),
      providers: [{ name: 'Gmail', directMs: 125, forwardingMs: 250 }]
    };
    const findOne = sinon.stub(TTI, 'findOne').returns(createQuery(sample));
    const { getLatestTti } = loadHelper();

    const first = await getLatestTti();
    const second = await getLatestTti();

    t.is(first.tti, sample);
    t.is(second.tti, sample);
    t.is(first.ttiChartData, null);
    t.is(findOne.callCount, 1);
  }
);

test.serial(
  'adds chronological history only for the Time to Inbox dashboard',
  async (t) => {
    const sample = {
      created_at: new Date('2026-09-24T00:00:00Z'),
      providers: [{ name: 'Gmail', directMs: 125, forwardingMs: 250 }]
    };
    const history = [sample];
    sinon.stub(TTI, 'findOne').returns(createQuery(sample));
    const find = sinon.stub(TTI, 'find').returns(createQuery(history));
    const { getLatestTti } = loadHelper();

    const result = await getLatestTti({ includeHistory: true });

    t.is(result.tti, sample);
    t.deepEqual(result.ttiChartData, history);
    t.true(find.calledOnce);
    t.true(find.firstCall.args[0].created_at.$gte instanceof Date);
  }
);

test('recognizes only populated, timely Time to Inbox provider samples as healthy', (t) => {
  const { hasHealthyTti } = loadHelper();

  t.true(
    hasHealthyTti({
      providers: [{ directMs: 125, forwardingMs: 250 }]
    })
  );
  t.false(hasHealthyTti({ providers: [] }));
  t.false(hasHealthyTti({ providers: [{ directMs: 0, forwardingMs: 250 }] }));
  t.false(
    hasHealthyTti({ providers: [{ directMs: 125, forwardingMs: 10_001 }] })
  );
});

function createFindQuery(value) {
  return {
    sort: sinon.stub().returnsThis(),
    limit: sinon.stub().returnsThis(),
    lean: sinon.stub().resolves(value)
  };
}

const healthy = (created_at) => ({
  created_at,
  providers: [
    { name: 'Gmail', directMs: 125, forwardingMs: 250 },
    { name: 'Outlook', directMs: 300, forwardingMs: 400 }
  ]
});

test.serial(
  'summary falls back to the most recent healthy sample when the newest run was not',
  async (t) => {
    const unhealthy = {
      created_at: new Date('2026-09-24T01:00:00Z'),
      providers: [
        { name: 'Gmail', directMs: 0, forwardingMs: 250 },
        { name: 'Outlook', directMs: 300, forwardingMs: 12_000 }
      ]
    };
    const lastHealthy = healthy(new Date('2026-09-24T00:55:00Z'));
    const find = sinon
      .stub(TTI, 'find')
      .returns(createFindQuery([unhealthy, lastHealthy]));
    const { getSummaryTti } = loadHelper();

    t.is(await getSummaryTti(), lastHealthy);
    t.true(find.firstCall.args[0].created_at.$gte instanceof Date);
  }
);

test.serial(
  'summary is null when no sample in the window is healthy',
  async (t) => {
    sinon.stub(TTI, 'find').returns(
      createFindQuery([
        {
          created_at: new Date(),
          providers: [{ name: 'Gmail', directMs: 0, forwardingMs: 0 }]
        }
      ])
    );
    const { getSummaryTti } = loadHelper();

    t.is(await getSummaryTti(), null);
  }
);

test.serial(
  'summary serves the cached sample without waiting once loaded, refreshing in the background',
  async (t) => {
    const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
    try {
      const first = healthy(new Date('2026-09-24T00:00:00Z'));
      const second = healthy(new Date('2026-09-24T00:05:00Z'));
      const find = sinon.stub(TTI, 'find');
      find.onFirstCall().returns(createFindQuery([first]));
      // a slow refresh: must not delay the render that triggered it
      find.onSecondCall().returns({
        sort: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        lean: () =>
          new Promise((resolve) => {
            globalThis.setTimeout(() => resolve([second]), 200);
          })
      });
      const { getSummaryTti } = loadHelper();

      t.is(await getSummaryTti(), first);
      clock.tick(31_000);

      const started = process.hrtime.bigint();
      t.is(await getSummaryTti(), first);
      t.true(process.hrtime.bigint() - started < 50_000_000n);
      t.is(find.callCount, 2);

      await new Promise((resolve) => {
        globalThis.setTimeout(resolve, 300);
      });
      t.is(await getSummaryTti(), second);
    } finally {
      clock.restore();
    }
  }
);
