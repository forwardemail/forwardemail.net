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
  restartInForeground,
  startBackground,
  stopRunning,
  uninstall,
  getStopFile,
  getUpdateTargets,
  waitUntilStopped
} from './lib/actions.js';
import { TunnelClient } from './lib/client.js';
import { startGui } from './lib/gui.js';
import { checkForUpdate, cleanupPreviousBinary } from './lib/update.js';
import { probe } from './lib/deliver.js';
import { createLogger } from './lib/logger.js';
import { createNotifier } from './lib/notify.js';
import { CancelError, createUi, suggest } from './lib/ui.js';

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
  --yes                  Ask nothing (setup, uninstall, disable)
  --no-install           For setup: do not set up autostart
  --quiet                Print nothing to the terminal (the log still records)
  --json                 For status and config: print JSON

Every setting can also be set by an environment variable, e.g.
${getEnvName('local.port')}=2525. Guide: ${GUIDE_URL}
`;

const COMMANDS = [
  'gui',
  'setup',
  'run',
  'start',
  'install',
  'uninstall',
  'status',
  'doctor',
  'enable',
  'disable',
  'config',
  'logs',
  'update',
  'version',
  'help'
];

// The help, with its headings and command names set apart in a terminal
function formatHelp() {
  const { style } = ui;
  return HELP.replace(/^(Usage:|Commands:|Options:)/gm, (heading) =>
    style.bold(heading)
  )
    .replace(/^( {2})([a-z]+)( {2,})/gm, (_, indent, name, gap) =>
      COMMANDS.includes(name) ? indent + style.cyan(name) + gap : _
    )
    .replace(
      /^( {2})(--[a-z-]+(?: <[^>]+>)?)/gm,
      (_, indent, flag) => indent + style.cyan(flag)
    );
}

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

// (what is printed and asked, see lib/ui.js)
const ui = createUi();
const { ok, bad, note } = ui;

//
// guided setup
//
const SETUP_STEPS = 5;
const TOKEN_URL = 'https://forwardemail.net/my-account/security';
const DOMAINS_URL = 'https://forwardemail.net/my-account/domains';

const isHost = (value) =>
  /^[a-z\d]([a-z\d.:-]*[a-z\d])?$/i.test(value) && value.length <= 253
    ? undefined
    : 'Enter a host name or an IP address, e.g. 127.0.0.1';
const isPort = (value) =>
  /^\d{1,5}$/.test(value) && Number(value) >= 1 && Number(value) <= 65_535
    ? undefined
    : 'Enter a port from 1 to 65535';

async function setup(options) {
  const isYes = options.flags.has('yes');
  const existing = load(options);
  const changes = toChanges(options.overrides);

  ui.title(`${APP_TITLE} setup`, VERSION);
  if (!isYes) {
    ui.note(
      'Receive mail on your own mail server behind CGNAT. Five short steps.'
    );
    ui.note(
      ui.isInteractive
        ? 'Enter accepts what is shown in (brackets). Ctrl+C cancels, and nothing is saved until the end.'
        : 'An empty answer accepts what is shown in [brackets].'
    );
  }

  try {
    // 1. API token
    if (!isYes) ui.step(1, SETUP_STEPS, 'Sign in');
    let token = changes.token || existing.token;
    let account;
    for (;;) {
      if (!token) {
        if (isYes) throw new Error('--token is required with --yes');
        ui.note(`Copy your API token from ${TOKEN_URL}`);
        token = await ui.secret('API token', {
          validate: (value) =>
            value ? undefined : 'Paste your API token, then press Enter',
          help: 'What you paste is not shown'
        });
      }

      try {
        const current = token;
        account = await ui.spin(
          'Checking the token',
          () => api.getAccount({ ...existing, token: current }),
          (result) => `Signed in as ${result.email}`
        );
        break;
      } catch (error) {
        ui.bad(error.message);
        if (isYes || error.isNetwork) throw error;
        token = '';
      }
    }

    changes.token = token;
    const config = { ...existing, token };

    // 2. domains
    if (!isYes) ui.step(2, SETUP_STEPS, 'Domains');
    const domains = await ui.spin(
      'Loading your domains',
      () => api.listDomains(config),
      false
    );
    const usable = domains.filter((d) => d.plan !== 'free' && !d.is_global);
    let names = changes.domains || existing.domains;
    if (names.length === 0 || (!isYes && !changes.domains)) {
      if (usable.length === 0)
        throw new Error(
          `No domain on a paid plan was found for ${account.email}. Add your domain at ${DOMAINS_URL} and upgrade it, then run setup again.`
        );
      if (isYes) throw new Error('--domain is required with --yes');
      const chosen = new Set(names);
      names = await ui.multiselect(
        'Which domains deliver to your mail server?',
        usable.map((domain) => ({
          value: normalizeDomain(domain.name),
          label: domain.name,
          hint:
            domain.has_txt_record === false
              ? 'not verified yet'
              : domain.has_tunnel
              ? 'tunnel is on'
              : undefined
        })),
        {
          defaultValues:
            chosen.size > 0
              ? [...chosen]
              : usable.length === 1
              ? [normalizeDomain(usable[0].name)]
              : usable
                  .filter((domain) => domain.has_tunnel)
                  .map((domain) => normalizeDomain(domain.name))
        }
      );
    }

    changes.domains = [...new Set(names)];
    for (const name of changes.domains) {
      const domain = domains.find((d) => normalizeDomain(d.name) === name);
      if (!domain)
        throw new Error(
          `${name} is not a domain of ${account.email}. Add it at ${DOMAINS_URL} first.`
        );
      if (domain.plan === 'free')
        throw new Error(
          `${name} is on the free plan. Upgrade it at ${DOMAINS_URL}/${name}/billing, then run setup again.`
        );
    }

    // 3. local mail server
    if (!isYes) ui.step(3, SETUP_STEPS, 'Your mail server');
    let host = changes.local?.host || existing.local.host;
    let port = changes.local?.port || existing.local.port;
    let protocol = changes.local?.protocol || existing.local.protocol;
    for (;;) {
      if (!isYes) {
        ui.note('Where this computer reaches it. Mail is delivered there.');
        host = await ui.text('Host', { defaultValue: host, validate: isHost });
        port = Number(
          await ui.text('Port', {
            defaultValue: String(port),
            validate: isPort
          })
        );
        protocol = await ui.select(
          'Protocol',
          [
            {
              value: 'smtp',
              label: 'SMTP',
              hint: 'Postfix, Exim, most servers'
            },
            { value: 'lmtp', label: 'LMTP', hint: 'Dovecot, Cyrus' }
          ],
          { defaultValue: protocol }
        );
      }

      const local = { ...existing.local, host, port, protocol };
      const result = await ui.spin(
        `Connecting to ${host}:${port}`,
        () => probe(local, 5000),
        false
      );
      if (result.ok) {
        ui.ok(`A mail server answered at ${host}:${port}`);
        break;
      }

      ui.bad(`No mail server answered at ${host}:${port} (${result.message})`);
      if (isYes) break;
      const next = await ui.select(
        'What now?',
        [
          { value: 'retry', label: 'Try again', hint: 'after starting it' },
          { value: 'edit', label: 'Change the host or port' },
          {
            value: 'keep',
            label: 'Keep these and continue',
            hint: 'mail is deferred until it answers'
          }
        ],
        { defaultValue: 'edit' }
      );
      if (next === 'keep') break;
      if (next === 'retry') {
        const again = await ui.spin(
          `Connecting to ${host}:${port}`,
          () => probe(local, 5000),
          false
        );
        if (again.ok) {
          ui.ok(`A mail server answered at ${host}:${port}`);
          break;
        }

        ui.bad(`Still no answer at ${host}:${port} (${again.message})`);
      }
    }

    changes.local = { ...changes.local, host, port, protocol };

    // 4. remote mailbox access
    if (!isYes) ui.step(4, SETUP_STEPS, 'Remote mailbox access');
    if (!isYes && !('imap' in changes)) {
      ui.note(
        'Lets the Forward Email API read the mailboxes of your server over IMAP, with the password of each mailbox. Off unless you turn it on.'
      );
      const isEnabled = await ui.confirm(
        'Allow reading mailboxes through the tunnel?',
        existing.imap.enabled
      );
      changes.imap = { enabled: isEnabled };
      if (isEnabled) {
        changes.imap.host = await ui.text('IMAP host', {
          defaultValue: existing.imap.host,
          validate: isHost
        });
        changes.imap.port = Number(
          await ui.text('IMAP port', {
            defaultValue: String(existing.imap.port),
            validate: isPort
          })
        );
      }
    }

    // 5. autostart
    if (!isYes) ui.step(5, SETUP_STEPS, 'Keep it running');
    let isInstalling = !options.flags.has('no-install');
    if (isInstalling && !isYes)
      isInstalling = await ui.confirm(
        'Start at boot and keep running in the background?'
      );

    // Nothing has been changed so far: the answers are shown first
    if (!isYes) {
      ui.line();
      ui.line(ui.style.bold('Ready to set up'));
      ui.table([
        ['Account', account.email],
        ['Domains', changes.domains.join(', ')],
        ['Mail server', `${host}:${port} (${protocol.toUpperCase()})`],
        [
          'Mailbox access',
          changes.imap?.enabled ?? existing.imap.enabled
            ? `on, ${changes.imap?.host || existing.imap.host}:${
                changes.imap?.port || existing.imap.port
              }`
            : 'off'
        ],
        ['Start at boot', isInstalling ? 'yes' : 'no']
      ]);
      ui.line();
      if (!(await ui.confirm('Save and turn the tunnel on?')))
        throw new CancelError();
    }

    ui.line();
    const problems = [];
    for (const name of changes.domains) {
      const domain = domains.find((d) => normalizeDomain(d.name) === name);
      await ui.spin(
        `Turning the tunnel on for ${name}`,
        () => api.setTunnel(config, name, true),
        `Mail Server Tunnel is on for ${name}`
      );
      if (domain.has_txt_record === false)
        problems.push({
          message: `${name} is not verified yet`,
          notes: [
            'Mail is only delivered to a verified domain. Add its TXT record at your DNS provider:'
          ],
          code: [`${DOMAINS_URL}/${name}`]
        });
      const mx = await ui.spin(
        `Checking the MX records of ${name}`,
        () => checkMx(name),
        false
      );
      if (!mx.ok)
        problems.push({
          message: `${name} does not have the Forward Email MX records yet`,
          notes: ['Set these MX records at your DNS provider (priority 10):'],
          code: ['mx1.forwardemail.net', 'mx2.forwardemail.net']
        });
    }

    const file = saveConfig(changes, {
      file: options.file,
      directory: options.file ? path.dirname(options.file) : undefined
    });
    ui.ok(`Settings saved to ${file}`);

    const saved = load({ file: options.file, overrides: {} });
    let isInstalled = false;
    if (isInstalling) {
      try {
        const result = install(saved, { mode: options.mode });
        ui.ok(`Starts automatically with ${result.manager} (${result.mode})`);
        for (const text of result.notes) ui.note(text);
        isInstalled = true;
      } catch (error) {
        ui.bad(`Not set to start automatically: ${error.message}`);
        ui.note(`Try again with: ${APP_NAME} install`);
      }
    }

    for (const problem of problems) {
      ui.line();
      ui.warn(problem.message);
      for (const text of problem.notes) ui.note(text);
      for (const text of problem.code) ui.code(text);
    }

    ui.line();
    ui.line(
      problems.length > 0
        ? ui.style.bold('Almost done. Fix the DNS records above, then:')
        : ui.style.bold(
            isInstalled ? 'Done. The tunnel is running.' : 'Done. Next:'
          )
    );
    const next = [];
    if (!isInstalled) next.push([`${APP_NAME} run`, 'start the tunnel']);
    next.push(
      [`${APP_NAME} status`, 'see whether it is connected'],
      [`${APP_NAME} doctor`, 'check the token, DNS and your mail server']
    );
    for (const [command, purpose] of next)
      ui.line(
        `  ${ui.style.cyan(
          command.padEnd(APP_NAME.length + 8)
        )} ${ui.style.gray(purpose)}`
      );
    ui.line();
    ui.note(
      `To send mail, relay through smtp.forwardemail.net: ${GUIDE_URL}#sending`
    );
    ui.line();
  } catch (error) {
    if (!error.isCancel) throw error;
    ui.line();
    ui.warn('Setup cancelled. Nothing was changed.');
    ui.line();
    process.exitCode = 130;
  } finally {
    ui.close();
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
        // (run in a terminal, it stays in that terminal)
        if (!isManaged && !isQuiet && process.stdout.isTTY)
          process.exit(await restartInForeground(process.argv.slice(2)));
        if (!isManaged) startBackground(config);
        process.exit(0);
      } catch (error) {
        logger.warn(`Update check failed: ${error.message}`);
        // (said once: e.g. the executable is where this user cannot write)
        if (/No permission to replace/.test(error.message))
          notify('update_failed', error.message);
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

  ui.title(APP_TITLE, VERSION);
  ui.line();
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

  // (e.g. a newer download beside an older copy that the service runs)
  if (data.running && data.version && data.version !== VERSION)
    ui.warn(
      `The running tunnel is version ${data.version}; this is ${VERSION}. Run "${APP_NAME} install" to run this one.`
    );
  if (data.installed.length > 0)
    ok(`Starts automatically with ${data.installed.join(', ')}`);
  else note(`Not set to start automatically. Run: ${APP_NAME} install`);
  console.log('');
  if (data.state !== 'connected') process.exitCode = 1;
}

async function doctor(options) {
  ui.title(`${APP_TITLE} doctor`, VERSION);
  ui.line();
  let config;
  try {
    config = load(options);
  } catch (error) {
    bad(error.message);
    process.exitCode = 1;
    return;
  }

  const checks = await ui.spin(
    'Checking the token, domains, DNS and your mail server',
    () => runDoctor(config),
    false
  );
  for (const check of checks) {
    if (check.ok) ok(check.message);
    else {
      bad(check.message);
      if (check.fix) note(`Fix: ${check.fix}`);
    }
  }

  const failures = checks.filter((check) => !check.ok).length;
  ui.line();
  if (failures === 0) ui.line(ui.style.green('Everything looks good.'));
  else {
    ui.line(
      ui.style.bold(
        `${failures} ${failures === 1 ? 'problem' : 'problems'} found.`
      )
    );
    ui.note(`Guide: ${GUIDE_URL}`);
  }

  ui.line();
  if (failures > 0) process.exitCode = 1;
}

async function update(options) {
  const config = load(options);
  const result = await ui.spin(
    'Looking for a newer version',
    () =>
      checkForUpdate(config, {
        force: true,
        checkOnly: options.flags.has('check'),
        targets: getUpdateTargets()
      }),
    false
  );
  if (result.updated) {
    ok(result.message);
    for (const message of result.failed) bad(message);
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
  if (
    !isEnabled &&
    ui.isInteractive &&
    !options.flags.has('yes') &&
    !(await ui.confirm(
      `Turn the tunnel off for ${config.domains.join(
        ', '
      )}? Mail for addresses without a mailbox or forwarding then bounces.`,
      false
    ))
  )
    throw new CancelError();
  for (const name of config.domains)
    await ui.spin(
      `Turning the tunnel ${isEnabled ? 'on' : 'off'} for ${name}`,
      () => api.setTunnel(config, name, isEnabled),
      `Mail Server Tunnel is ${isEnabled ? 'on' : 'off'} for ${name}`
    );
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
        throw Object.assign(new Error('The tunnel is not set up yet.'), {
          hint: `Run: ${APP_NAME} setup`
        });
      const result = install(config, { mode: options.mode });
      ok(`Installed with ${result.manager} (${result.mode}): ${result.path}`);
      for (const line of result.notes) note(line);
      return;
    }

    case 'uninstall': {
      if (
        ui.isInteractive &&
        !options.flags.has('yes') &&
        !(await ui.confirm(
          'Stop the tunnel and no longer start it automatically?',
          false
        ))
      )
        throw new CancelError();
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
      return console.log(formatHelp());
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
      const close = suggest(String(options.command).toLowerCase(), COMMANDS);
      const error = new Error(
        `Unknown command "${options.command}".${
          close ? ` Did you mean "${close}"?` : ''
        }`
      );
      error.hint = `See every command with: ${APP_NAME} help`;
      throw error;
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
    // (to the error output, in its own colors)
    const errors = createUi({ output: process.stderr });
    errors.line();
    if (error.isCancel) errors.warn('Cancelled.');
    else errors.bad(error.message);
    if (error.hint) errors.note(error.hint);
    errors.line();
    process.exitCode = error.isCancel ? 130 : 1;
  });

export { acquireLock, parseArgs };
export { getConfigDirectory } from './lib/config.js';
