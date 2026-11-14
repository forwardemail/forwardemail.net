/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import dns from 'node:dns/promises';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';

import * as api from './api.js';
import * as service from './service.js';
import { APP_NAME, getLocal } from './config.js';
import { probe } from './deliver.js';

// What the command line and the GUI both do

const MX_HOSTS = new Set(['mx1.forwardemail.net', 'mx2.forwardemail.net']);

export function isAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

export async function checkMx(domain) {
  try {
    const records = await dns.resolveMx(domain);
    const hosts = records.map((record) => record.exchange.toLowerCase());
    return {
      hosts,
      ok: hosts.length > 0 && hosts.every((host) => MX_HOSTS.has(host))
    };
  } catch (error) {
    return { hosts: [], ok: false, message: error.code || error.message };
  }
}

// The state the running app last wrote, and what starts it automatically
export function getStatus(config) {
  let status;
  try {
    status = JSON.parse(
      fs.readFileSync(path.join(config.directory, 'status.json'), 'utf8')
    );
  } catch {
    status = {};
  }

  // (an app that has just started holds the lock before it writes its state)
  if (!isAlive(status.pid)) {
    try {
      const pid = Number(
        fs.readFileSync(path.join(config.directory, `${APP_NAME}.lock`), 'utf8')
      );
      if (isAlive(pid)) status = { pid, state: 'starting' };
    } catch {}
  }

  const running = isAlive(status.pid);
  return {
    ...status,
    running,
    state: running ? status.state : 'stopped',
    installed: service.getInstalled()
  };
}

// Starts the app in the background (as the service managers do)
export function startBackground(config) {
  const program = service.getProgram('user');
  const child = spawn(
    program.file,
    [...program.args, 'run', '--quiet', '--config', config.file],
    { detached: true, stdio: 'ignore', windowsHide: true }
  );
  child.unref();
  return child.pid;
}

//
// Starts the app again in this terminal (after an update, when it runs in
// the foreground): the new version takes over the screen and the keyboard,
// and this process stays only to pass on how it ends.
//
export function restartInForeground(
  args,
  program = service.getProgram('user')
) {
  const child = spawn(program.file, [...program.args, ...args], {
    stdio: 'inherit'
  });
  // (Ctrl+C reaches the new version by itself: it is in this terminal too)
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
    process.removeAllListeners(signal);
    process.on(signal, () => {
      if (signal !== 'SIGINT') child.kill(signal);
    });
  }

  return new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}

// Every copy of the standalone executable that an update should replace:
// this one, and the one that "install" keeps for the background service
export function getUpdateTargets() {
  if (!service.isStandalone()) return [process.execPath];
  const targets = [fs.realpathSync(process.execPath)];
  for (const mode of ['user', 'system']) {
    try {
      const target = fs.realpathSync(service.getInstallPath(mode));
      if (!targets.includes(target)) targets.push(target);
    } catch {}
  }

  return targets;
}

export function getStopFile(config) {
  return path.join(config.directory, 'stop.request');
}

// Asks the running app to stop (it finishes what it is delivering first)
export function stopRunning(config) {
  const { pid, running } = getStatus(config);
  if (!running) return false;
  // (on Windows a signal ends the process at once, so it is asked through a
  // file that it looks for, see `runTunnel` in index.js)
  if (process.platform === 'win32')
    fs.writeFileSync(getStopFile(config), String(pid));
  else process.kill(pid, 'SIGTERM');
  return true;
}

// Resolves once the app that was asked to stop has left (or after `timeout`)
export async function waitUntilStopped(config, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (getStatus(config).running && Date.now() < deadline)
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  return !getStatus(config).running;
}

// Sets the app up to start automatically, and starts it now (cron would
// only do so at its next run; the others start it themselves)
export function install(config, options) {
  const result = service.install(config, options);
  if (result.manager === 'cron') startBackground(config);
  return result;
}

// Removes what starts the app automatically, and stops the app it started
// (cron and Task Scheduler leave the copy that runs alone)
export async function uninstall(config) {
  const removed = service.uninstall();
  if (removed.length > 0 && stopRunning(config)) await waitUntilStopped(config);
  return removed;
}

//
// Every check of the setup, as { ok, message, fix } items.
//
export async function runDoctor(config) {
  const checks = [];
  const pass = (message) => checks.push({ ok: true, message });
  const fail = (message, fix) => checks.push({ ok: false, message, fix });

  pass(`Settings are valid (${config.file})`);
  if (process.platform !== 'win32' && fs.existsSync(config.file)) {
    const mode = fs.statSync(config.file).mode & 0o777;
    if (mode & 0o077)
      fail(
        `${config.file} can be read by other users`,
        `chmod 600 "${config.file}"`
      );
  }

  let isTokenValid = false;
  if (config.token) {
    try {
      const account = await api.getAccount(config);
      pass(`API token works (${account.email})`);
      isTokenValid = true;
    } catch (error) {
      fail(error.message, `${APP_NAME} setup`);
    }
  } else {
    fail('No API token is set', `${APP_NAME} setup`);
  }

  if (config.domains.length === 0)
    fail('No domains are set', `${APP_NAME} setup`);
  for (const name of config.domains) {
    if (isTokenValid) {
      try {
        const domain = await api.getDomain(config, name);
        if (domain.plan === 'free')
          fail(`${name} is on the free plan (a paid plan is required)`);
        else if (domain.has_txt_record === false)
          fail(
            `${name} is not verified`,
            'Add its TXT verification record (My Account > Domains) to your DNS'
          );
        else if (domain.has_tunnel) pass(`${name}: Mail Server Tunnel is on`);
        else
          fail(
            `${name}: Mail Server Tunnel is off`,
            `${APP_NAME} enable --domain ${name}`
          );
      } catch (error) {
        fail(`${name}: ${error.message}`);
      }
    }

    const mx = await checkMx(name);
    if (mx.ok) pass(`${name}: MX records point to Forward Email`);
    else
      fail(
        `${name}: MX records must be mx1.forwardemail.net and mx2.forwardemail.net (found: ${
          mx.hosts.join(', ') || mx.message || 'none'
        })`,
        'Set both MX records at your DNS provider with priority 10'
      );

    const local = getLocal(config, name);
    const result = await probe(local, config.probe.timeout || 5000);
    if (result.ok)
      pass(`${name}: mail server answered at ${local.host}:${local.port}`);
    else
      fail(
        `${name}: no mail server at ${local.host}:${local.port} (${result.message})`,
        'Start your mail server, or correct local.host and local.port'
      );
  }

  const status = getStatus(config);
  if (status.running && status.state === 'connected')
    pass('The tunnel is running and connected');
  else if (status.running)
    fail(
      `The tunnel is running but not connected: ${
        status.last_error || status.state
      }`
    );
  else fail('The tunnel is not running', `${APP_NAME} install`);

  if (status.installed.length > 0)
    pass(`Starts automatically with ${status.installed.join(', ')}`);
  else fail('Not set to start automatically', `${APP_NAME} install`);

  return checks;
}
