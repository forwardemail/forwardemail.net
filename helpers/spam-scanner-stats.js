/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Counts and timings of Spam Scanner's scans in this process over a period
// (see `SPAM_SCANNER_STATS_INTERVAL`), written to the console by
// `helpers/spam-scanner.js` as one "[SPAM_SCANNER] stats" line: how many
// scans were made, skipped, stopped and lost, and how long they took, by
// where mail was scanned (received, submitted or sending)
//
// (by scan, not by message: smtp-bree scans a close call a second time, with
//  the language model, so its scans, spam and blocking count twice)
//
// (bounded: a fixed set of stages and outcomes, and at most `MAX_SAMPLES`
//  timings of each kind kept for the percentiles, a uniform sample of them
//  all past that; average and slowest are of every one)
//

const MAX_SAMPLES = 2000;

const STAGES = new Set(['received', 'submitted', 'sending']);

// what became of a scan, or of a message not scanned:
// - scanned: it has a result (`late`: after its own time limit, no longer
//   waited for)
// - not_sampled: inbound mail left out by `SPAM_SCANNER_MX_PERCENT`
// - skipped_size: larger than `SPAM_SCANNER_MAX_SIZE`
// - skipped_busy: too many scans waiting for a worker (or, as smtp-bree
//   sends mail, for a send slot, or waited for one past a time limit)
// - expired: waited for a worker past its time limit, so not made
// - timed_out: started, and stopped at its time limit
// - stopped: its caller no longer needed it (e.g. a rejected message)
// - failed: an error
const OUTCOMES = [
  'scanned',
  'not_sampled',
  'skipped_size',
  'skipped_busy',
  'expired',
  'timed_out',
  'stopped',
  'failed'
];

const TIMINGS = ['time', 'wait', 'run', 'llm'];

// what else is counted of messages, apart from what became of their scans:
// - over_mx_wait: delivered by the MX server before its scan was done
//   (`SPAM_SCANNER_MX_WAIT`), so without the X-Spam-Scanner-* headers
const NOTES = ['over_mx_wait'];

function createSamples() {
  return { count: 0, sum: 0, max: 0, values: [] };
}

function addSample(samples, value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return;
  samples.count++;
  samples.sum += value;
  if (value > samples.max) samples.max = value;
  if (samples.values.length < MAX_SAMPLES) {
    samples.values.push(value);
    return;
  }

  // (each of them all kept with the same chance)
  const index = Math.floor(Math.random() * samples.count);
  if (index < MAX_SAMPLES) samples.values[index] = value;
}

// (the nearest-rank percentile)
function percentile(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
}

function summarizeSamples(samples) {
  if (samples.count === 0) return null;
  const sorted = [...samples.values].sort((a, b) => a - b);
  return {
    count: samples.count,
    avg: Math.round(samples.sum / samples.count),
    p50: Math.round(percentile(sorted, 0.5)),
    p95: Math.round(percentile(sorted, 0.95)),
    p99: Math.round(percentile(sorted, 0.99)),
    max: Math.round(samples.max)
  };
}

function createStage() {
  const stage = {
    // (scanned, but after its caller stopped waiting for it)
    late: 0,
    spam: 0,
    blocking: 0
  };
  for (const outcome of OUTCOMES) stage[outcome] = 0;
  for (const note of NOTES) stage[note] = 0;
  stage.timings = {};
  for (const name of TIMINGS) stage.timings[name] = createSamples();
  return stage;
}

function createStats() {
  let since = Date.now();
  let stages = new Map();
  let errors = 0;
  let warnings = 0;
  let empty = true;

  function getStage(name) {
    const key = STAGES.has(name) ? name : 'other';
    let stage = stages.get(key);
    if (!stage) {
      stage = createStage();
      stages.set(key, stage);
    }

    return stage;
  }

  return {
    //
    // One scan's outcome, or a message not scanned (`OUTCOMES`), where it
    // was scanned (any but `STAGES` counted as "other"), and for one
    // scanned: how long it took in all (`time`),
    // waiting for a worker (`wait`), on the worker (`run`) and asking the
    // language model (`llm`), in milliseconds, and whether it was `late`,
    // `spam` or found something `blocking`
    //
    record(stageName, outcome, details = {}) {
      if (!OUTCOMES.includes(outcome)) return;
      const stage = getStage(stageName);
      stage[outcome]++;
      empty = false;
      // (the timings are of scans with a result only)
      if (outcome !== 'scanned') return;
      for (const name of TIMINGS) addSample(stage.timings[name], details[name]);
      if (details.late) stage.late++;
      if (details.spam) stage.spam++;
      if (details.blocking) stage.blocking++;
    },

    // one of `NOTES` for a message
    note(stageName, note) {
      if (!NOTES.includes(note)) return;
      getStage(stageName)[note]++;
      empty = false;
    },

    // an error or a warning written (or left out as written too often)
    count(level) {
      if (level === 'error') errors++;
      else warnings++;
      empty = false;
    },

    isEmpty() {
      return empty;
    },

    //
    // What was counted since the last call (or since it was made), and a new
    // period started; `extra` is added as it is (e.g. the workers' state)
    //
    take(extra = {}) {
      const now = Date.now();
      const line = { period_ms: now - since, ...extra, errors, warnings };
      for (const [name, stage] of stages) {
        const out = {};
        for (const key of [...OUTCOMES, ...NOTES])
          if (stage[key] > 0) out[key] = stage[key];
        if (stage.late > 0) out.late = stage.late;
        if (stage.spam > 0) out.spam = stage.spam;
        if (stage.blocking > 0) out.blocking = stage.blocking;
        for (const timing of TIMINGS) {
          const summary = summarizeSamples(stage.timings[timing]);
          if (summary) out[`${timing}_ms`] = summary;
        }

        line[name] = out;
      }

      since = now;
      stages = new Map();
      errors = 0;
      warnings = 0;
      empty = true;
      return line;
    }
  };
}

module.exports = createStats;
module.exports.OUTCOMES = OUTCOMES;
module.exports.MAX_SAMPLES = MAX_SAMPLES;
