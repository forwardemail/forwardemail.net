/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Runs the processes of a small ("lite") self-hosted install in one container
// (see `self-hosting/lite/docker-compose.yml`), so that a single box such as
// a Mac mini or Raspberry Pi needs three containers (this one, MongoDB and
// Redis) instead of one for each process.
//
// - the SQLite server starts first: MX, IMAP and the web server talk to it over
//   its WebSocket, so the others start once its port accepts connections
// - a process that exits is started again, with a backoff that grows while it
//   keeps exiting soon after it started
// - on SIGTERM/SIGINT the SQLite server is stopped last, after every process
//   that writes to mailboxes through it has exited
//
// It has no dependencies so that it can run before (and without) the app.
//
// `LITE_SERVICES` (a comma-separated list of names below) picks the
// processes, e.g. `LITE_SERVICES=sqlite,sqlite-worker,mx,imap` for a box that
// only receives and reads mail.
//

const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');
const { spawn } = require('node:child_process');
const { parseEnv } = require('node:util');
const { setTimeout: delay } = require('node:timers/promises');

const ROOT = path.resolve(__dirname, '..', '..');

// names, in the order they start (and the reverse order they stop)
const SERVICES = {
  sqlite: 'sqlite.js',
  'sqlite-worker': 'sqlite-worker.js',
  'sqlite-bree': 'sqlite-bree.js',
  mx: 'mx.js',
  imap: 'imap.js',
  pop3: 'pop3.js',
  smtp: 'smtp.js',
  'smtp-bree': 'smtp-bree.js',
  bree: 'bree.js',
  web: 'web.js',
  api: 'api.js',
  caldav: 'caldav.js',
  carddav: 'carddav.js'
};

const DEFAULT_SERVICES = [
  'sqlite',
  'sqlite-worker',
  'sqlite-bree',
  'mx',
  'imap',
  'smtp',
  'smtp-bree',
  'bree',
  'web'
];

// it ran this long, so the backoff starts over
const STABLE_MS = 60_000;
const MAX_BACKOFF_MS = 30_000;
const SQLITE_READY_TIMEOUT_MS = 120_000;
const STOP_TIMEOUT_MS = 60_000;

function readDotEnv() {
  try {
    return parseEnv(fs.readFileSync(path.join(ROOT, '.env'), 'utf8'));
  } catch {
    return {};
  }
}

const dotEnv = readDotEnv();
const getEnv = (key, fallback) => process.env[key] || dotEnv[key] || fallback;

function selectedServices() {
  const list = getEnv('LITE_SERVICES', '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const names = list.length > 0 ? list : DEFAULT_SERVICES;
  for (const name of names) {
    if (!SERVICES[name]) {
      throw new Error(
        `Unknown service "${name}" in LITE_SERVICES (one of: ${Object.keys(
          SERVICES
        ).join(', ')})`
      );
    }
  }

  // keep the start order of `SERVICES` whatever order they were given in
  return Object.keys(SERVICES).filter((name) => names.includes(name));
}

function log(name, line) {
  process.stdout.write(`[${name}] ${line}\n`);
}

const children = new Map();
let stopping = false;

function start(name) {
  const state = children.get(name) || { name, backoff: 1000 };
  children.set(name, state);

  const startedAt = Date.now();
  const child = spawn(process.execPath, [path.join(ROOT, SERVICES[name])], {
    cwd: ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  state.child = child;

  for (const stream of [child.stdout, child.stderr]) {
    readline
      .createInterface({ input: stream })
      .on('line', (line) => log(name, line));
  }

  child.on('exit', async (code, signal) => {
    state.child = null;
    if (stopping) return;
    if (Date.now() - startedAt >= STABLE_MS) state.backoff = 1000;
    log(
      'supervisor',
      `${name} exited (${signal || code}), starting it again in ${
        state.backoff / 1000
      }s`
    );
    await delay(state.backoff);
    state.backoff = Math.min(state.backoff * 2, MAX_BACKOFF_MS);
    if (!stopping) start(name);
  });
}

function canConnect(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port });
    socket.setTimeout(2000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

async function waitForPort(port, timeoutMs) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    if (stopping) return false;
    if (await canConnect(port)) return true;
    await delay(1000);
  }

  return false;
}

function stopOne(name) {
  const state = children.get(name);
  if (!state?.child) return Promise.resolve();
  const { child } = state;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      log('supervisor', `${name} did not stop in time, killing it`);
      child.kill('SIGKILL');
    }, STOP_TIMEOUT_MS);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
    child.kill('SIGTERM');
  });
}

async function stopAll(signal) {
  if (stopping) return;
  stopping = true;
  log('supervisor', `${signal} received, stopping`);
  const names = [...children.keys()];
  // everything that talks to the SQLite server first, then the server itself
  await Promise.all(names.filter((n) => n !== 'sqlite').map((n) => stopOne(n)));
  await stopOne('sqlite');
  process.exit(0);
}

process.on('SIGTERM', () => stopAll('SIGTERM'));
process.on('SIGINT', () => stopAll('SIGINT'));

(async () => {
  const names = selectedServices();
  log('supervisor', `starting ${names.join(', ')}`);

  if (names.includes('sqlite')) {
    start('sqlite');
    const port = Number(getEnv('SQLITE_PORT', 3456));
    if (!(await waitForPort(port, SQLITE_READY_TIMEOUT_MS))) {
      if (stopping) return;
      log(
        'supervisor',
        `the SQLite server is not listening on ${port} after ${
          SQLITE_READY_TIMEOUT_MS / 1000
        }s, starting the others anyway`
      );
    }
  }

  for (const name of names) {
    if (name !== 'sqlite' && !stopping) start(name);
  }
})();
