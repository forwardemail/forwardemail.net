/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');
const process = require('node:process');

const test = require('ava');

function loadJobs(selfHosted) {
  const jobsPath = require.resolve('../../jobs');
  delete require.cache[jobsPath];
  process.env.SELF_HOSTED = String(selfHosted);
  return require(jobsPath);
}

function assertAnalyticsJobs(t, jobs) {
  const aggregate = jobs.find((job) => job.name === 'aggregate-analytics');
  const backfill = jobs.find((job) => job.name === 'backfill-analytics');

  t.like(aggregate, {
    interval: '1h',
    timeout: 0
  });
  t.false(Object.hasOwn(aggregate, 'delay'));
  t.false(Object.hasOwn(aggregate, 'date'));

  t.like(backfill, {
    interval: '6h',
    timeout: 0,
    path: path.join(__dirname, '..', '..', 'scripts', 'backfill-analytics.js')
  });
  t.false(Object.hasOwn(backfill, 'delay'));
  t.false(Object.hasOwn(backfill, 'date'));
}

test.serial('normal Bree registry prepares and repairs analytics', (t) => {
  const previous = process.env.SELF_HOSTED;
  try {
    assertAnalyticsJobs(t, loadJobs(false));
  } finally {
    if (previous === undefined) delete process.env.SELF_HOSTED;
    else process.env.SELF_HOSTED = previous;
  }
});

test.serial('self-hosted Bree registry prepares and repairs analytics', (t) => {
  const previous = process.env.SELF_HOSTED;
  try {
    assertAnalyticsJobs(t, loadJobs(true));
  } finally {
    if (previous === undefined) delete process.env.SELF_HOSTED;
    else process.env.SELF_HOSTED = previous;
  }
});
