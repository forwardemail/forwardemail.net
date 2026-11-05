/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const { StmtTimers, normalizeSql } = require('#helpers/stmt-timers');

function make(options = {}) {
  const lines = [];
  let clock = 0;
  const timers = new StmtTimers({
    enabled: true,
    autoFlush: false,
    slowMs: 50,
    log: (...args) => lines.push(args),
    now: () => clock,
    ...options
  });
  return {
    timers,
    lines,
    // run one statement that "takes" `duration` ms
    run(sql, duration, op = 'all', data = []) {
      clock += 1;
      const started = timers.start();
      clock += duration;
      timers.record({ started, sql, op, data, aliasId: 'a1' });
    }
  };
}

test('disabled: start returns 0 and nothing is recorded or logged', (t) => {
  const lines = [];
  const timers = new StmtTimers({
    enabled: false,
    log: (...args) => lines.push(args)
  });
  t.is(timers.start(), 0);
  timers.record({ started: 0, sql: 'select 1', op: 'get', data: 1 });
  timers.flush();
  t.is(timers.tally.size, 0);
  t.is(lines.length, 0);
  t.is(timers.interval, null);
});

test('logs [SLOW_STMT] only at or above the threshold', (t) => {
  const { run, lines } = make();
  run('select * from "Messages"', 49);
  t.is(lines.length, 0);
  run('select * from "Messages"', 50, 'all', [{}, {}, {}]);
  t.is(lines.length, 1);
  t.is(lines[0][0].startsWith('[SLOW_STMT]'), true);
  // op, duration, rows, alias, sql
  t.is(lines[0][2], 'all');
  t.is(lines[0][3], 50);
  t.is(lines[0][4], 3);
  t.is(lines[0][5], 'a1');
  t.is(lines[0][6], 'select * from "Messages"');
});

test('row counts: get is 0 or 1, run uses changes', (t) => {
  const { run, lines } = make({ slowMs: 1 });
  run('s1', 5, 'get', null);
  run('s2', 5, 'get', { id: 1 });
  run('s3', 5, 'run', { changes: 7 });
  t.deepEqual(
    lines.map((l) => l[4]),
    [0, 1, 7]
  );
});

test('flush logs [STMT_TALLY] ordered by total time, then resets', (t) => {
  const { run, timers, lines } = make({ slowMs: 1e9 });
  run('cheap', 1);
  run('cheap', 1);
  run('cheap', 1);
  run('slow', 20);
  timers.flush();
  t.is(lines.length, 1);
  t.is(lines[0][0].startsWith('[STMT_TALLY]'), true);
  t.is(lines[0][3], 4); // statements
  const top = JSON.parse(lines[0][5]);
  t.is(top[0].sql, 'slow');
  t.is(top[0].total_ms, 20);
  t.is(top[1].sql, 'cheap');
  t.is(top[1].count, 3);
  // reset: nothing to log on an empty window
  timers.flush();
  t.is(lines.length, 1);
});

test('bind values are never logged: only SQL text reaches the log', (t) => {
  const { run, lines } = make({ slowMs: 1 });
  run('select * from "Messages" where "mailbox" = $p1', 5, 'all', [
    { secret: 'mail body' }
  ]);
  t.false(JSON.stringify(lines).includes('mail body'));
});

test('normalizeSql collapses whitespace and truncates', (t) => {
  t.is(normalizeSql('select  *\n  from   x '), 'select * from x');
  const long = normalizeSql(`select ${'a, '.repeat(500)}`);
  t.true(long.length <= 303);
  t.true(long.endsWith('...'));
});

test('tally is bounded: distinct SQL beyond the cap goes to (other)', (t) => {
  const { run, timers } = make({ slowMs: 1e9 });
  for (let i = 0; i < 600; i++) run(`select ${i}`, 1);
  t.true(timers.tally.size <= 501);
  t.true(timers.tally.has('(other)'));
});

test('auto flush interval is unref-ed and closable', (t) => {
  const timers = new StmtTimers({
    enabled: true,
    intervalMs: 60_000,
    log() {}
  });
  t.truthy(timers.interval);
  t.true(timers.interval.hasRef() === false);
  timers.close();
  t.is(timers.interval, null);
});
