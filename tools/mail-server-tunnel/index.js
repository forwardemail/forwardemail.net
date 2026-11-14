#!/usr/bin/env node

/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * Mail Server Tunnel
 *
 * Receive mail on a self-hosted mail server behind CGNAT (Starlink, 5G home
 * internet, mobile and fiber providers without a public IPv4 address) with
 * no port forwarding, static IP address, VPN or VPS.
 *
 * https://forwardemail.net/guides/self-hosted-mail-server-behind-cgnat
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

import * as api from './lib/api.js';
import * as service from './lib/service.js';
import {
  APP_NAME,
  APP_TITLE,
  SETTING_PATHS,
  VERSION,
  coerce,
  getConfigPath,
  getEnvName,
  loadConfig,
  normalizeDomain,
  redact,
  saveConfig
} from './lib/config.js';
import {
  checkMx,
  getStatus,
  install,
  isAlive,
  runDoctor,
  startBackground,
  stopRunning,
  uninstall,
  getStopFile,
  waitUntilStopped
} from './lib/actions.js';
import { TunnelClient } from './lib/client.js';
import { startGui } from './lib/gui.js';
import { checkForUpdate, cleanupPreviousBinary } from './lib/update.js';
import { probe } from './lib/deliver.js';
import { createLogger } from './lib/logger.js';
import { createNotifier } from './lib/notify.js';

const GUIDE_URL =
  'https://forwardemail.net/guides/self-hosted-mail-server-behind-cgnat';

const HELP = `${APP_TITLE} ${VERSION}

Receive mail on your own mail server behind CGNAT (Starlink, 5G home
internet and other providers without a public IP address). No port
forwarding, static IP address, VPN or VPS.

Usage: ${APP_NAME} <command> [options]

Commands:
  gui         Open the app in your browser (also what a double click does)
  setup       Guided setup: API token, domains, local mail server, autostart
  run         Run the tunnel in this terminal (what the service runs)
  install     Start at boot or sign-in and keep running (--mode user|system|cron)
  uninstall   Remove what "install" set up
  status      Show whether the tunnel is running and connected
  doctor      Check the token, domains, DNS and the local mail server
  enable      Turn the tunnel on for the domains (--domain example.com)
  disable     Turn the tunnel off for the domains, so mail bounces as before
  config      Print the settings in effect (--paths lists every setting)
  logs        Print the last lines of the log (--lines 50)
  update      Install the latest version now (--check only looks for one)
  version     Print the version
  help        Print this help

Options:
  --config <file>        Config file (default: ${getConfigPath()})
  --token <token>        Forward Email API token (or FORWARD_EMAIL_API_TOKEN)
  --domain <name>        Domain to serve (repeat for more than one)
  --local-host <host>    Local mail server host (default: 127.0.0.1)
  --local-port <port>    Local mail server port (default: 25)
  --set <key=value>      Any setting, e.g. --set local.protocol=lmtp
  --mode <mode>          For install: user, system or cron
  --yes                  Answer yes to every question of setup
  --no-install           For setup: do not set up autostart
  --quiet                Print nothing to the terminal (the log still records)
  --json                 For status and config: print JSON

Every setting can also be set by an environment variable, e.g.
${getEnvName('local.port')}=2525. Guide: ${GUIDE_URL}
`;

function parseArgs(argv) {
  const options = { overrides: {}, domains: [], flags: new Set() };
  const positional = [];
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    const next = () => {
      const value = argv[++index];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      return value;
    };

    switch (arg) {
      case '--config': {
        options.file = path.resolve(next());
        break;
      }

      case '--token': {
        options.overrides.token = next();
        break;
      }

      case '--domain': {
        options.domains.push(...next().split(','));
        break;
      }

      case '--local-host': {
        options.overrides['local.host'] = next();
        break;
      }

      case '--local-port': {
        options.overrides['local.port'] = next();
        break;
      }

      case '--set': {
        const value = next();
        const at = value.indexOf('=');
        if (at < 1) throw new Error('--set needs key=value');
        options.overrides[value.slice(0, at)] = value.slice(at + 1);
        break;
      }

      case '--mode': {
        options.mode = next();
        break;
      }

      case '--lines': {
        options.lines = Number(next());
        break;
      }

      default: {
        if (arg.startsWith('--')) options.flags.add(arg.slice(2));
        else positional.push(arg);
      }
    }
  }

  if (options.domains.length > 0)
    options.overrides.domains = options.domains.join(',');
  options.command = positional[0];
  return options;
}

function load(options) {
  return loadConfig({
    file: options.file,
    directory: options.file ? path.dirname(options.file) : undefined,
    overrides: options.overrides
  });
}

// The overrides as they are written to the config file
function toChanges(overrides) {
  const changes = {};
  for (const [keyPath, raw] of Object.entries(overrides)) {
    const keys = keyPath.split('.');
    let target = changes;
    for (const key of keys.slice(0, -1)) {
      target[key] ||= {};
      target = target[key];
    }

    target[keys.at(-1)] = coerce(keyPath, raw);
  }

  if (changes.domains)
    changes.domains = changes.domains.map((domain) => normalizeDomain(domain));
  return changes;
}

const ok = (message) => console.log(`  ✓ ${message}`);
const bad = (message) => console.log(`  ✗ ${message}`);
const note = (message) => console.log(`    ${message}`);

//
// questions of the guided setup
//
function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY
  });
  let isMuted = false;
  const write = rl._writeToOutput.bind(rl);
  // (the token is not echoed while it is typed or pasted)
  rl._writeToOutput = (text) => {
    if (!isMuted) write(text);
  };

  const ask = (question, { defaultValue = '', secret = false } = {}) =>
    new Promise((resolve) => {
      const suffix = defaultValue ? ` [${defaultValue}]` : '';
      process.stdout.write(`${question}${suffix}: `);
      isMuted = secret;
      rl.question('', (answer) => {
        if (secret) process.stdout.write('\n');
        isMuted = false;
        resolve(answer.trim() || defaultValue);
      });
    });
  const confirm = async (question, defaultYes = true) => {
    const answer = await ask(`${question} (${defaultYes ? 'Y/n' : 'y/N'})`);
    if (!answer) return defaultYes;
    return /^y/i.test(answer);
  };

  return { ask, confirm, close: () => rl.close() };
}

async function setup(options) {
  const isYes = options.flags.has('yes');
  const prompt = isYes ? null : createPrompt();
  const existing = load(options);
  const changes = toChanges(options.overrides);

  console.log(`\n${APP_TITLE} setup\n`);
  try {
    // 1. API token
    let token = changes.token || existing.token;
    let account;
    for (;;) {
      if (!token) {
        if (isYes) throw new Error('--token is required with --yes');
        console.log(
          'Copy your API token from https://forwardemail.net/my-account/security'
        );
        token = await prompt.ask('API token', { secret: true });
      }

      try {
        account = await api.getAccount({ ...existing, token });
        break;
      } catch (error) {
        bad(error.message);
        if (isYes || error.isNetwork) throw error;
        token = '';
      }
    }

    ok(`Signed in as ${account.email}`);
    changes.token = token;
    const config = { ...existing, token };

    // 2. domains
    const domains = await api.listDomains(config);
    const usable = domains.filter((d) => d.plan !== 'free' && !d.is_global);
    let names = changes.domains || existing.domains;
    if (names.length === 0) {
      if (usable.length === 0)
        throw new Error(
          'No domain on a paid plan was found for this account. Add your domain at https://forwardemail.net/my-account/domains and upgrade it, then run setup again.'
        );
      if (isYes) throw new Error('--domain is required with --yes');
      console.log('\nDomains on a paid plan:');
      for (const [index, domain] of usable.entries())
        console.log(`  ${index + 1}. ${domain.name}`);
      const answer = await prompt.ask(
        'Which domains should deliver to your mail server? (numbers or names, comma separated, or "all")',
        { defaultValue: usable.length === 1 ? '1' : '' }
      );
      names =
        answer.toLowerCase() === 'all'
          ? usable.map((d) => d.name)
          : answer
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) =>
                /^\d+$/.test(item)
                  ? usable[Number(item) - 1]?.name
                  : normalizeDomain(item)
              )
              .filter(Boolean);
      if (names.length === 0) throw new Error('No domain was chosen');
    }

    changes.domains = [...new Set(names)];

    for (const name of changes.domains) {
      const domain = domains.find((d) => normalizeDomain(d.name) === name);
      if (!domain) {
        bad(`${name} is not a domain of this account`);
        throw new Error(
          `Add ${name} at https://forwardemail.net/my-account/domains first`
        );
      }

      if (domain.plan === 'free')
        throw new Error(
          `${name} is on the free plan. Upgrade it at https://forwardemail.net/my-account/domains/${name}/billing, then run setup again.`
        );
      await api.setTunnel(config, name, true);
      ok(`Mail Server Tunnel is on for ${name}`);
      if (domain.has_txt_record === false) {
        bad(`${name} is not verified yet`);
        note(
          'Add its TXT verification record to your DNS (shown under My Account > Domains). Mail is only delivered to a verified domain.'
        );
      }

      const mx = await checkMx(name);
      if (!mx.ok) {
        bad(`${name} does not have the Forward Email MX records yet`);
        note('Set these MX records at your DNS provider (priority 10):');
        note('  mx1.forwardemail.net');
        note('  mx2.forwardemail.net');
      }
    }

    // 3. local mail server
    let host = changes.local?.host || existing.local.host;
    let port = changes.local?.port || existing.local.port;
    for (;;) {
      if (!isYes) {
        console.log(
          '\nWhere is your mail server (as seen from this computer)?'
        );
        host = await prompt.ask('Host', { defaultValue: host });
        port = Number(await prompt.ask('Port', { defaultValue: String(port) }));
      }

      const result = await probe({ ...existing.local, host, port }, 5000);
      if (result.ok) {
        ok(`Mail server answered at ${host}:${port}`);
        break;
      }

      bad(`No mail server answered at ${host}:${port} (${result.message})`);
      if (isYes || (await prompt.confirm('Keep these settings anyway?', false)))
        break;
    }

    changes.local = { ...changes.local, host, port };

    // 4. remote mailbox access
    if (!isYes && !('imap' in changes)) {
      const isEnabled = await prompt.confirm(
        '\nAllow reading the mailboxes of your mail server through the tunnel (IMAP)?',
        existing.imap.enabled
      );
      changes.imap = { enabled: isEnabled };
      if (isEnabled) {
        changes.imap.host = await prompt.ask('IMAP host', {
          defaultValue: existing.imap.host
        });
        changes.imap.port = Number(
          await prompt.ask('IMAP port', {
            defaultValue: String(existing.imap.port)
          })
        );
      }
    }

    const file = saveConfig(changes, {
      file: options.file,
      directory: options.file ? path.dirname(options.file) : undefined
    });
    ok(`Settings saved to ${file}`);

    // 5. autostart
    const saved = load({ file: options.file, overrides: {} });
    let isInstalled = false;
    if (
      !options.flags.has('no-install') &&
      (isYes ||
        (await prompt.confirm(
          '\nStart at boot and keep running in the background?'
        )))
    ) {
      try {
        const result = install(saved, { mode: options.mode });
        ok(`Installed with ${result.manager} (${result.mode})`);
        for (const line of result.notes) note(line);
        isInstalled = true;
      } catch (error) {
        bad(`Not installed: ${error.message}`);
      }
    }

    console.log(
      isInstalled
        ? `\nDone. The tunnel is running. Check it with: ${APP_NAME} status`
        : `\nDone. Start the tunnel with: ${APP_NAME} run`
    );
    console.log(
      `To send mail, relay through smtp.forwardemail.net: ${GUIDE_URL}#sending\n`
    );
  } finally {
    prompt?.close();
  }
}

//
// one running copy for a config directory (cron and Task Scheduler start
// the app again every few minutes; a second copy leaves at once)
//
const LOCK_STALE_AFTER = 120_000;

function acquireLock(directory) {
  const file = path.join(directory, `${APP_NAME}.lock`);
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      fs.writeFileSync(file, String(process.pid), { flag: 'wx', mode: 0o600 });
      return file;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const pid = Number(fs.readFileSync(file, 'utf8'));
      // (the running app touches its lock every 30 seconds: one that was
      // left behind, e.g. after a power cut, is old, even when its process
      // number now belongs to another program)
      const age = Date.now() - fs.statSync(file).mtimeMs;
      if (
        Number.isInteger(pid) &&
        pid > 0 &&
        pid !== process.pid &&
        isAlive(pid) &&
        age < LOCK_STALE_AFTER
      )
        return null;
      fs.rmSync(file, { force: true });
    }
  }

  return null;
}

function ownsLock(file) {
  try {
    return fs.readFileSync(file, 'utf8') === String(process.pid);
  } catch {
    return false;
  }
}

// (never the lock of another copy that has taken over since)
function releaseLock(file) {
  try {
    if (ownsLock(file)) fs.rmSync(file, { force: true });
  } catch {}
}

async function runTunnel(options) {
  const isQuiet = options.flags.has('quiet');
  const config = load(options);
  // (starts the app in the background and returns: see the Windows task)
  if (options.flags.has('detach')) {
    startBackground(config);
    return;
  }

  const lock = acquireLock(config.directory);
  if (!lock) {
    if (!isQuiet) console.log(`${APP_TITLE} is already running.`);
    return;
  }

  const logger = createLogger({ ...config.log, quiet: isQuiet });
  const notify = createNotifier(config, logger);
  const client = new TunnelClient(config, {
    logger,
    notify,
    reload: () => load(options)
  });

  logger.info(`${APP_TITLE} ${VERSION} starting`, {
    domains: config.domains,
    local: `${config.local.host}:${config.local.port}`
  });

  let isStopping = false;
  const stop = async (signal) => {
    if (isStopping) return;
    isStopping = true;
    logger.info(`Stopping (${signal})`);
    await client.stop();
    releaseLock(lock);
    process.exit(0);
  };

  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'])
    process.on(signal, () => stop(signal));
  process.on('exit', () => releaseLock(lock));
  // (the service manager, cron or Task Scheduler starts it again)
  process.on('uncaughtException', (error) => {
    logger.error(`Unexpected error: ${error.stack || error.message}`);
    notify('error', `Unexpected error: ${error.message}`);
    process.exitCode = 1;
    stop('error');
  });
  process.on('unhandledRejection', (error) => {
    logger.error(`Unexpected error: ${error?.stack || error}`);
  });

  client.start();

  // The lock is kept fresh, and a request to stop is looked for (see
  // `stopRunning` in lib/actions.js)
  const stopFile = getStopFile(config);
  fs.rmSync(stopFile, { force: true });
  setInterval(() => {
    try {
      const now = new Date();
      fs.utimesSync(lock, now, now);
    } catch {}
  }, 30_000).unref();
  setInterval(() => {
    // (the folder was removed or another copy runs for it: this one leaves
    // instead of delivering beside it)
    if (!ownsLock(lock)) return stop('lock lost');
    if (!fs.existsSync(stopFile)) return;
    fs.rmSync(stopFile, { force: true });
    stop('stop request');
  }, 1000).unref();

  // Updates: looked for shortly after start, then once per update.interval
  cleanupPreviousBinary();
  if (config.update.enabled) {
    const check = async () => {
      try {
        const result = await checkForUpdate(config);
        if (!result.updated) {
          if (result.message && !result.skipped) logger.info(result.message);
          return;
        }

        logger.info(result.message);
        notify('updated', result.message, { force: true });
        if (!config.update.restart) return;
        // A service manager starts the new version when this one leaves;
        // without one, the new version is started from here
        const isManaged =
          Boolean(process.env.INVOCATION_ID) ||
          Boolean(
            process.env.XPC_SERVICE_NAME && process.env.XPC_SERVICE_NAME !== '0'
          );
        logger.info('Restarting into the new version');
        isStopping = true;
        await client.stop();
        releaseLock(lock);
        if (!isManaged) startBackground(config);
        process.exit(0);
      } catch (error) {
        logger.warn(`Update check failed: ${error.message}`);
      }
    };

    setTimeout(check, 60_000).unref();
    setInterval(check, Math.max(config.update.interval, 3_600_000)).unref();
  }
}

function status(options) {
  const config = load(options);
  const data = getStatus(config);
  if (data.state !== 'connected') process.exitCode = 1;
  if (options.flags.has('json'))
    return console.log(JSON.stringify(data, null, 2));

  console.log(`\n${APP_TITLE} ${VERSION}\n`);
  if (data.state === 'connected') ok(`Connected since ${data.since}`);
  else if (data.running)
    bad(
      `Running but not connected (${data.state}): ${
        data.last_error || 'connecting'
      }`
    );
  else
    bad(`Not running. Start it with: ${APP_NAME} run (or ${APP_NAME} install)`);
  if (data.running) {
    for (const domain of data.domains || []) ok(`Serving ${domain}`);
    for (const rejected of data.rejected || [])
      bad(`${rejected.name}: ${rejected.message}`);
    for (const [target, local] of Object.entries(data.local || {}))
      if (local.ok) ok(`Mail server at ${target} is reachable`);
      else bad(`Mail server at ${target} is not reachable: ${local.message}`);
    const stats = data.stats || {};
    note(
      `Delivered ${stats.delivered || 0}, refused ${
        stats.rejected || 0
      }, deferred ${stats.deferred || 0}` +
        (data.last_delivery_at
          ? `, last delivery ${data.last_delivery_at}`
          : '')
    );
  }

  if (data.installed.length > 0)
    ok(`Starts automatically with ${data.installed.join(', ')}`);
  else note(`Not set to start automatically. Run: ${APP_NAME} install`);
  console.log('');
  if (data.state !== 'connected') process.exitCode = 1;
}

async function doctor(options) {
  console.log(`\n${APP_TITLE} doctor\n`);
  let config;
  try {
    config = load(options);
  } catch (error) {
    bad(error.message);
    process.exitCode = 1;
    return;
  }

  const checks = await runDoctor(config);
  for (const check of checks) {
    if (check.ok) ok(check.message);
    else {
      bad(check.message);
      if (check.fix) note(`Fix: ${check.fix}`);
    }
  }

  const failures = checks.filter((check) => !check.ok).length;
  console.log(
    failures === 0
      ? '\nEverything looks good.\n'
      : `\n${failures} problem(s) found. Guide: ${GUIDE_URL}\n`
  );
  if (failures > 0) process.exitCode = 1;
}

async function update(options) {
  const config = load(options);
  const result = await checkForUpdate(config, {
    force: true,
    checkOnly: options.flags.has('check')
  });
  if (result.updated) {
    ok(result.message);
    if (!stopRunning(config)) return;
    note('The running tunnel was stopped; it restarts into the new version.');
    // (a service manager starts it again by itself)
    await waitUntilStopped(config);
    if (getStatus(config).installed.length === 0) startBackground(config);
  } else {
    console.log(result.message);
  }
}

async function toggle(options, isEnabled) {
  const config = load(options);
  if (config.domains.length === 0)
    throw new Error('Name a domain with --domain');
  for (const name of config.domains) {
    await api.setTunnel(config, name, isEnabled);
    ok(`Mail Server Tunnel is ${isEnabled ? 'on' : 'off'} for ${name}`);
  }
}

function printLogs(options) {
  const config = load(options);
  const count =
    Number.isInteger(options.lines) && options.lines > 0 ? options.lines : 50;
  if (!fs.existsSync(config.log.file))
    return console.log(`No log yet at ${config.log.file}`);
  const lines = fs.readFileSync(config.log.file, 'utf8').trimEnd().split('\n');
  console.log(lines.slice(-count).join('\n'));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.flags.has('help')) options.command = 'help';
  if (options.flags.has('version')) options.command = 'version';

  switch (options.command) {
    case 'setup': {
      return setup(options);
    }

    case 'run':
    case 'start': {
      return runTunnel(options);
    }

    case 'install': {
      const config = load(options);
      if (!config.token || config.domains.length === 0)
        throw new Error(`Run "${APP_NAME} setup" first`);
      const result = install(config, { mode: options.mode });
      ok(`Installed with ${result.manager} (${result.mode}): ${result.path}`);
      for (const line of result.notes) note(line);
      return;
    }

    case 'uninstall': {
      const removed = await uninstall(load(options));
      if (removed.length === 0) return console.log('Nothing was installed.');
      for (const name of removed) ok(`Removed from ${name}`);
      note(
        `Mail for your domains is deferred while no tunnel runs. To stop using it: ${APP_NAME} disable`
      );
      return;
    }

    case 'status': {
      return status(options);
    }

    case 'update': {
      return update(options);
    }

    case 'gui': {
      return startGui({
        load: () => load(options),
        file: options.file || getConfigPath()
      });
    }

    case 'doctor': {
      return doctor(options);
    }

    case 'enable': {
      return toggle(options, true);
    }

    case 'disable': {
      return toggle(options, false);
    }

    case 'config': {
      if (options.flags.has('paths')) {
        for (const keyPath of SETTING_PATHS)
          console.log(`${keyPath.padEnd(32)} ${getEnvName(keyPath)}`);
        return;
      }

      const config = redact(load(options));
      return console.log(JSON.stringify(config, null, 2));
    }

    case 'logs': {
      return printLogs(options);
    }

    case 'version': {
      return console.log(VERSION);
    }

    case 'help': {
      return console.log(HELP);
    }

    // (started with a double click, or with no command: the window opens)
    case undefined: {
      console.log(
        `Opening ${APP_TITLE}. For the command line, run: ${APP_NAME} help`
      );
      return startGui({
        load: () => load(options),
        file: options.file || getConfigPath()
      });
    }

    default: {
      console.log(HELP);
      throw new Error(`Unknown command "${options.command}"`);
    }
  }
}

// (not when a test imports this file)
const isMain = (() => {
  try {
    return (
      !process.argv[1] ||
      fs.realpathSync(process.argv[1]) ===
        fs.realpathSync(fileURLToPath(import.meta.url)) ||
      service.isStandalone()
    );
  } catch {
    return true;
  }
})();

if (isMain)
  main().catch((error) => {
    console.error(`\n  ✗ ${error.message}\n`);
    process.exitCode = 1;
  });

export { acquireLock, parseArgs };
export { getConfigDirectory } from './lib/config.js';
