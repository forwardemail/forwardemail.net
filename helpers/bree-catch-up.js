/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

const { previousRun } = require('./bree-schedule');

//
// Jobs run at fixed times of day (see helpers/bree-schedule.js) and no longer
// on every start, so a run that a deploy or restart cut short (or that was due
// while bree was down) would otherwise wait for the next time, up to a day.
// Bree records when each job last finished; on start, a job that runs every
// few hours or less often and has not finished since it was last due is run
// again, a few minutes apart from the others so they do not start together.
//
// (a job never recorded is not run: the first deploy with this change does not
// start every job at once)
//

const KEY_PREFIX = 'bree:completed:';
const MIN_INTERVAL = ms('3h');
const SPACING = ms('3m');

function key(name) {
  return `${KEY_PREFIX}${name}`;
}

/**
 * Record that a job finished (without an error).
 *
 * @param {Object} client - Redis client
 * @param {string} name - Job name
 * @param {Date} [at]
 * @returns {Promise}
 */
async function recordCompletion(client, name, at = new Date()) {
  // (kept a while longer than the longest interval, a day)
  await client.set(key(name), String(at.getTime()), 'PX', ms('8d'));
}

/**
 * Track the jobs bree asked to stop. Jobs end early when asked (they post
 * 'done' after `cancel`, the same as when they finish), and bree drops the
 * worker's exit listener on 'done', so such a run looks complete; it must not
 * be recorded as one, or catch-up would not run it again on the next start.
 *
 * @param {Object} bree - Bree instance
 * @returns {Function} Returns (and forgets) whether a job's run was stopped
 */
function trackStopped(bree) {
  const stopped = new Set();
  const stop = bree.stop.bind(bree);
  bree.stop = async function (name, ...args) {
    if (name === undefined) {
      for (const running of bree.workers.keys()) stopped.add(running);
    } else if (bree.workers.has(name)) {
      stopped.add(name);
    }

    return stop(name, ...args);
  };

  return (name) => stopped.delete(name);
}

/**
 * Jobs due again on start, oldest first.
 *
 * @param {Object} client - Redis client
 * @param {Array<Object>} jobs - Jobs returned by scheduleJobs
 * @param {Object} [options]
 * @param {Date} [options.now]
 * @param {number} [options.minInterval] - Only jobs this rare (3h)
 * @returns {Promise<Array<string>>} Job names
 */
async function getOverdueJobs(client, jobs, options = {}) {
  const now = options.now || new Date();
  const minInterval = options.minInterval ?? MIN_INTERVAL;
  const candidates = jobs.filter(
    (job) =>
      typeof job === 'object' &&
      Number.isFinite(job.everyMs) &&
      job.everyMs >= minInterval
  );
  if (candidates.length === 0) return [];

  const values = await client.mget(candidates.map((job) => key(job.name)));
  const overdue = [];
  for (const [index, job] of candidates.entries()) {
    const completed = Number.parseInt(values[index], 10);
    if (!Number.isFinite(completed)) continue;
    const due = previousRun(job, now);
    if (due && completed < due.getTime())
      overdue.push({ name: job.name, due: due.getTime() });
  }

  return overdue.sort((a, b) => a.due - b.due).map(({ name }) => name);
}

/**
 * On start, run the jobs that are due again, spaced apart (through bree.run,
 * so the gate still applies).
 *
 * @param {Object} bree - Bree instance
 * @param {Object} client - Redis client
 * @param {Array<Object>} jobs - Jobs returned by scheduleJobs
 * @param {Object} [options]
 * @param {number} [options.spacing] - Time between them (3m)
 * @param {Object} [options.logger]
 * @returns {Promise<Array<string>>} Names of the jobs that will run
 */
async function catchUp(bree, client, jobs, options = {}) {
  const spacing = options.spacing ?? SPACING;
  const { logger } = options;
  const names = await getOverdueJobs(client, jobs, options);
  for (const [index, name] of names.entries()) {
    const timer = setTimeout(() => {
      bree.run(name).catch((err) => logger?.error?.(err, { job: { name } }));
    }, (index + 1) * spacing);
    if (typeof timer.unref === 'function') timer.unref();
  }

  if (names.length > 0)
    logger?.info?.('running jobs that did not finish since they were due', {
      jobs: names,
      spacing
    });

  return names;
}

module.exports = {
  catchUp,
  getOverdueJobs,
  recordCompletion,
  trackStopped,
  KEY_PREFIX
};
