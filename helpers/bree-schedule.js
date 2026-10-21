/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ms = require('ms');

//
// Jobs declared with an `interval` (and `timeout: 0`) all start the moment
// bree starts and then every interval after that, so every job with the same
// interval runs at the same moment: the ~25 hourly jobs together, the four
// six-hourly jobs together, and every day nearly all of them together. Each
// deploy, crash or memory restart lines them up again from the new start (and
// starts every job at once on the way).
//
// This turns each such interval into fixed times of day instead: a job runs
// at an offset within its interval that is spread evenly among the jobs with
// the same interval (or set with `offset`), so for example the six-hourly jobs
// start an hour or more apart, each in a minute of the hour of its own. The times are on the clock, not from when bree
// started, so a restart neither runs every job at once nor moves the times.
//
// (bree runs a job whose `interval` is a schedule object at those times and
// not on start; `timeout` is only the delay before the first run, never a
// limit on how long a run may take, so it is dropped here)
//

const DAY = ms('1d');
const SECOND = 1000;

// jobs that run more often than this keep their plain interval (they are
// small, and the gate keeps slots for them)
const MIN_SCHEDULED_INTERVAL = ms('5m');

function toMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = ms(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

/**
 * Whether a job's interval is turned into times of day.
 *
 * @param {Object|string} job - Bree job definition
 * @returns {boolean}
 */
function isScheduled(job) {
  if (typeof job !== 'object' || job === null) return false;
  if (job.cron !== undefined || job.date !== undefined) return false;
  const interval = toMs(job.interval);
  return (
    interval !== null &&
    interval > MIN_SCHEDULED_INTERVAL - 1 &&
    interval <= DAY &&
    DAY % interval === 0 &&
    interval % SECOND === 0
  );
}

/**
 * The times of day (seconds since midnight) a job with this interval and
 * offset runs at.
 *
 * @param {number} interval - Interval in milliseconds (divides a day)
 * @param {number} offset - Offset in milliseconds within the interval
 * @returns {Array<number>}
 */
function timesOfDay(interval, offset) {
  const times = [];
  const start = ((offset % interval) + interval) % interval;
  for (let t = start; t < DAY; t += interval) {
    times.push(Math.floor(t / SECOND));
  }

  return times;
}

const HOUR = ms('1h');
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

/**
 * The later.js schedules for these times of day, in a few short rules
 * instead of a list of every time (bree passes the job, schedule included, to
 * its worker, and the worker logs carry it): the times that share a second,
 * and the same hours, become one rule of their minutes.
 *
 * @param {Array<number>} times - Seconds since midnight
 * @returns {Array<Object>}
 */
function toSchedules(times) {
  const rules = new Map();
  const bySecond = new Map();
  for (const time of times) {
    const second = time % 60;
    const minute = Math.floor(time / 60) % 60;
    const hour = Math.floor(time / 3600);
    const key = `${second}:${minute}`;
    if (!bySecond.has(key)) bySecond.set(key, { second, minute, hours: [] });
    bySecond.get(key).hours.push(hour);
  }

  for (const { second, minute, hours } of bySecond.values()) {
    const sorted = [...new Set(hours)].sort((a, b) => a - b);
    const key = `${second}:${sorted.join(',')}`;
    if (!rules.has(key)) rules.set(key, { second, hours: sorted, minutes: [] });
    rules.get(key).minutes.push(minute);
  }

  return [...rules.values()].map(({ second, hours, minutes }) => ({
    // (every hour of the day: no hours rule)
    ...(hours.length === 24 && hours.every((hour, i) => hour === HOURS[i])
      ? {}
      : { h: hours }),
    m: minutes.sort((a, b) => a - b),
    s: [second]
  }));
}

// the minutes of the hour a job with this interval and offset starts at
function minutesOf(interval, offset) {
  const minutes = new Set();
  for (const time of timesOfDay(interval, offset))
    minutes.add(Math.floor(time / 60) % 60);
  return minutes;
}

/**
 * Give each job with an interval fixed, spread out times of day.
 *
 * - Jobs every hour or less often each start in a minute of the hour of their
 *   own (while there are 60 or fewer), spread evenly across the hour, so no
 *   two of them ever start in the same minute.
 * - Within its interval, a job that runs every few hours or less often gets
 *   an hour spread evenly among the jobs with the same interval (e.g. the
 *   six-hourly ones an hour or two apart, the daily ones three hours apart).
 * - Jobs more often than hourly (every 5 to 30 minutes) are spread evenly
 *   across their interval.
 *
 * Positions follow name order, so a job keeps its time while the list stays
 * the same. A job may set its own with `offset` (e.g. '45m').
 *
 * @param {Array<Object|string>} jobs - Bree job definitions
 * @returns {Array<Object|string>} New job definitions
 */
function scheduleJobs(jobs) {
  const auto = jobs.filter(
    (job) => isScheduled(job) && job.offset === undefined
  );
  const offsets = new Map();

  // more often than hourly: spread across the interval
  const groups = new Map();
  for (const job of auto) {
    const interval = toMs(job.interval);
    if (!groups.has(interval)) groups.set(interval, []);
    groups.get(interval).push(job.name);
  }

  for (const [interval, names] of groups) {
    if (interval >= HOUR) continue;
    const sorted = [...names].sort();
    for (const [index, name] of sorted.entries()) {
      offsets.set(
        name,
        Math.floor(((index + 0.5) * interval) / sorted.length / SECOND) * SECOND
      );
    }
  }

  // hourly or less often: a minute of the hour each ...
  const taken = new Set();
  for (const job of jobs) {
    if (!isScheduled(job) || job.offset === undefined) continue;
    const interval = toMs(job.interval);
    if (interval < HOUR) continue;
    for (const minute of minutesOf(interval, toMs(job.offset)))
      taken.add(minute);
  }

  const hourly = auto
    .filter((job) => toMs(job.interval) >= HOUR)
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  // (jobs whose interval is not whole hours, e.g. every 1.5h, start in two
  // minutes of the hour: they pick theirs first)
  const awkward = hourly.filter((job) => toMs(job.interval) % HOUR !== 0);
  const whole = hourly.filter((job) => toMs(job.interval) % HOUR === 0);
  const minuteOf = new Map();
  for (const job of awkward) {
    const interval = toMs(job.interval);
    for (let minute = 0; minute < 60; minute++) {
      const minutes = minutesOf(interval, minute * 60 * SECOND);
      if ([...minutes].every((m) => !taken.has(m))) {
        for (const m of minutes) taken.add(m);
        minuteOf.set(job.name, minute * 60 * SECOND);
        break;
      }
    }

    if (!minuteOf.has(job.name)) minuteOf.set(job.name, 0);
  }

  const free = [];
  for (let minute = 0; minute < 60; minute++)
    if (!taken.has(minute)) free.push(minute);
  for (const [index, job] of whole.entries()) {
    if (free.length >= whole.length) {
      // evenly across the free minutes, one each
      const minute =
        free[Math.floor(((index + 0.5) * free.length) / whole.length)];
      minuteOf.set(job.name, minute * 60 * SECOND);
    } else {
      // (more jobs than free minutes: evenly across the hour, in seconds)
      minuteOf.set(
        job.name,
        Math.floor(((index + 0.5) * HOUR) / whole.length / SECOND) * SECOND
      );
    }
  }

  // ... and an hour within the interval, spread among the jobs with it
  const byInterval = new Map();
  for (const job of hourly) {
    const interval = toMs(job.interval);
    if (!byInterval.has(interval)) byInterval.set(interval, []);
    byInterval.get(interval).push(job.name);
  }

  for (const [interval, names] of byInterval) {
    const hours = Math.floor(interval / HOUR);
    for (const [index, name] of names.entries()) {
      const hour =
        interval % HOUR === 0 ? Math.floor((index * hours) / names.length) : 0;
      offsets.set(name, hour * HOUR + minuteOf.get(name));
    }
  }

  return jobs.map((job) => {
    if (!isScheduled(job)) return job;
    const interval = toMs(job.interval);
    const offset =
      job.offset === undefined ? offsets.get(job.name) : toMs(job.offset);
    if (offset === null || offset === undefined)
      throw new TypeError(`Job "${job.name}" has an invalid offset`);

    const { timeout, offset: _offset, ...rest } = job;
    return {
      ...rest,
      // kept for logging and the gate (which reads how often a job runs)
      everyMs: interval,
      offsetMs: ((offset % interval) + interval) % interval,
      interval: { schedules: toSchedules(timesOfDay(interval, offset)) }
    };
  });
}

/**
 * The last time before `now` a scheduled job was due (its times are local
 * times of day, as bree reads them), or null for a job that is not scheduled.
 *
 * @param {Object} job - Job returned by scheduleJobs
 * @param {Date} [now]
 * @returns {Date|null}
 */
function previousRun(job, now = new Date()) {
  if (!job || !Number.isFinite(job.everyMs) || !Number.isFinite(job.offsetMs))
    return null;
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const sinceMidnight = now.getTime() - midnight.getTime();
  // the slot at or before now (yesterday's last one before today's first)
  const slots = Math.floor((sinceMidnight - job.offsetMs) / job.everyMs);
  return new Date(midnight.getTime() + job.offsetMs + slots * job.everyMs);
}

/**
 * How often a job runs in milliseconds (Infinity when unknown).
 *
 * @param {Object} job - Bree job (as configured)
 * @returns {number}
 */
function intervalOf(job) {
  if (!job) return Number.POSITIVE_INFINITY;
  if (Number.isFinite(job.everyMs)) return job.everyMs;
  return toMs(job.interval) ?? Number.POSITIVE_INFINITY;
}

module.exports = {
  scheduleJobs,
  isScheduled,
  intervalOf,
  previousRun,
  timesOfDay,
  toSchedules,
  MIN_SCHEDULED_INTERVAL
};
