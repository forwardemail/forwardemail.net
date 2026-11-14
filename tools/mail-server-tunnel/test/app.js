/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import test from 'ava';
import { SMTPServer } from 'smtp-server';

import { acquireLock, parseArgs } from '../index.js';
import { getStatus } from '../lib/actions.js';
import { TunnelClient } from '../lib/client.js';
import { getEnvName, loadConfig, redact, saveConfig } from '../lib/config.js';
import { deliver } from '../lib/deliver.js';
import { startGui } from '../lib/gui.js';
import { createLogger } from '../lib/logger.js';
import { createNotifier, getDesktopCommand } from '../lib/notify.js';
import {
  getCronLines,
  getLaunchdPlist,
  getSystemdUnit,
  getWindowsLauncher,
  getWindowsTask
} from '../lib/service.js';
import {
  SUMS_NAME,
  checkForUpdate,
  compareVersions,
  verifySignature
} from '../lib/update.js';
import {
  DOMAIN,
  MAILBOX,
  createMessage,
  createTemporaryDirectory,
  createTestLogger,
  getPort,
  startFakeApi,
  waitFor
} from './helpers.js';

// Tests that run on every system (Linux, macOS and Windows), with no mail
// server installed: a local SMTP server stands in for it

const INDEX = fileURLToPath(new URL('../index.js', import.meta.url));

test.beforeEach((t) => {
  t.context.directory = createTemporaryDirectory();
  t.context.cleanup = [];
});

test.afterEach.always(async (t) => {
  for (const fn of t.context.cleanup.reverse()) await fn();
  // (on Windows the log of an app that has just ended is let go of late)
  fs.rmSync(t.context.directory, {
    recursive: true,
    force: true,
    maxRetries: 20,
    retryDelay: 100
  });
});

// A local mail server that stores what it is sent
async function startSmtp(t) {
  const received = [];
  const server = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    logger: false,
    onData(stream, session, callback) {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        received.push({
          from: session.envelope.mailFrom.address,
          to: session.envelope.rcptTo.map((rcpt) => rcpt.address),
          raw: Buffer.concat(chunks).toString()
        });
        callback();
      });
    }
  });
  const port = await getPort();
  await new Promise((resolve) => {
    server.listen(port, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
      })
  );
  return { port, received };
}

test('a mail server that turns connections away defers mail instead of bouncing it', async (t) => {
  // (e.g. "554 too busy" as its greeting: nothing was said about the message)
  const server = net.createServer((socket) => {
    socket.on('error', () => {});
    socket.end('554 5.3.2 Too busy, try again later\r\n');
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(() => server.close());
  const { local } = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: {
      'local.port': String(server.address().port),
      'local.tls': 'none'
    }
  });
  const result = await deliver(
    local,
    { from: 'sender@example.net', to: [MAILBOX] },
    createMessage('greeted with an error')
  );
  t.truthy(result.error);
  t.not(result.error.code, 'REJECTED');
  t.is(result.error.smtp_code, undefined);
});

test('settings: file, then --set, then environment; saved for the owner only', (t) => {
  const { directory } = t.context;
  const file = saveConfig(
    { token: 'file-token', domains: ['Example.COM.'], local: { port: 2525 } },
    { directory }
  );
  if (process.platform !== 'win32') t.is(fs.statSync(file).mode & 0o777, 0o600);

  let config = loadConfig({ directory, env: {} });
  t.is(config.token, 'file-token');
  t.deepEqual(config.domains, ['example.com']);
  t.is(config.local.port, 2525);
  // (what was not set keeps its default)
  t.is(config.local.host, '127.0.0.1');
  t.is(config.reconnect.maxDelay, 30_000);

  config = loadConfig({
    directory,
    overrides: { 'local.port': '2626', 'imap.enabled': 'yes' },
    env: {
      [getEnvName('local.port')]: '2727',
      [getEnvName('notify.events')]: 'connected, error',
      [getEnvName('domainOverrides')]: '{"example.com":{"port":2828}}'
    }
  });
  t.is(config.local.port, 2727);
  t.true(config.imap.enabled);
  t.deepEqual(config.notify.events, ['connected', 'error']);
  t.is(config.domainOverrides['example.com'].port, 2828);

  // A later save keeps what the file already held
  saveConfig({ local: { host: '192.168.1.20' } }, { directory });
  config = loadConfig({ directory, env: {} });
  t.is(config.local.host, '192.168.1.20');
  t.is(config.local.port, 2525);
  t.is(config.token, 'file-token');

  // Printed settings never show the token
  t.is(redact(config).token, '********');
  t.false(JSON.stringify(redact(config)).includes('file-token'));
});

test('settings: mistakes are refused with what to fix', (t) => {
  const { directory } = t.context;
  const load = (overrides) => loadConfig({ directory, env: {}, overrides });
  t.throws(() => load({ 'local.port': '99999' }), { message: /local\.port/ });
  t.throws(() => load({ 'local.protocol': 'pop3' }), {
    message: /smtp or lmtp/
  });
  t.throws(() => load({ domains: 'not a domain' }), {
    message: /not a domain name/
  });
  t.throws(() => load({ 'no.such.setting': '1' }), {
    message: /Unknown setting/
  });
  t.throws(() => load({ '__proto__.polluted': '1' }), {
    message: /Unknown setting/
  });
  // The token is never sent without TLS to another computer
  t.throws(() => load({ apiUrl: 'http://api.example.com' }), {
    message: /https/
  });
  t.is(
    load({ apiUrl: 'http://127.0.0.1:4000' }).apiUrl,
    'http://127.0.0.1:4000'
  );
  const plain = {};
  t.false('polluted' in plain);

  fs.writeFileSync(path.join(directory, 'config.json'), '{ not json');
  t.throws(() => load({}), { message: /not valid JSON/ });
});

test('command line: options become settings', (t) => {
  const options = parseArgs([
    'run',
    '--token',
    'abc',
    '--domain',
    'a.example,b.example',
    '--domain',
    'c.example',
    '--local-port',
    '2525',
    '--set',
    'local.protocol=lmtp',
    '--quiet'
  ]);
  t.is(options.command, 'run');
  t.true(options.flags.has('quiet'));
  const config = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: options.overrides
  });
  t.deepEqual(config.domains, ['a.example', 'b.example', 'c.example']);
  t.is(config.local.port, 2525);
  t.is(config.local.protocol, 'lmtp');
  t.throws(() => parseArgs(['run', '--set', 'novalue']), {
    message: /key=value/
  });
});

test('only one copy runs for a config directory', (t) => {
  const { directory } = t.context;
  const lock = acquireLock(directory);
  t.truthy(lock);
  t.is(fs.readFileSync(lock, 'utf8'), String(process.pid));

  // A copy that another running process holds is respected
  const other = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 30000)']);
  fs.writeFileSync(lock, String(other.pid));
  t.is(acquireLock(directory), null);
  other.kill();

  // One left behind by a process that is gone is taken over
  fs.writeFileSync(lock, '999999999');
  t.truthy(acquireLock(directory));

  // And so is one that was not kept fresh (e.g. after a power cut), even
  // when its process number belongs to a running program again
  const stranger = spawn(process.execPath, [
    '-e',
    'setTimeout(() => {}, 30000)'
  ]);
  fs.writeFileSync(lock, String(stranger.pid));
  const old = new Date(Date.now() - 10 * 60 * 1000);
  fs.utimesSync(lock, old, old);
  t.truthy(acquireLock(directory));
  stranger.kill();
});

test('the app delivers to a local mail server and survives the API going away', async (t) => {
  const smtp = await startSmtp(t);
  const api = await startFakeApi();
  t.context.cleanup.push(() => api.close());
  const config = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: {
      token: api.token,
      apiUrl: api.url,
      domains: DOMAIN,
      'local.port': String(smtp.port),
      'local.tls': 'none',
      'probe.interval': '0',
      'notify.desktop': 'false',
      'notify.disconnectedAfter': '100',
      'reconnect.minDelay': '50',
      'reconnect.maxDelay': '100',
      'health.port': String(await getPort())
    }
  });
  const events = [];
  const app = new TunnelClient(config, {
    logger: createTestLogger(),
    notify: (event) => events.push(event)
  });
  t.context.cleanup.push(() => app.stop());
  app.start();
  await waitFor(() => app.state === 'connected');

  const answer = await api.deliver(createMessage('any system'));
  t.deepEqual(answer.accepted, [MAILBOX]);
  t.is(smtp.received.length, 1);
  t.is(smtp.received[0].from, 'sender@example.net');
  t.true(smtp.received[0].raw.includes('Subject: any system'));

  // The health endpoint says whether it is connected
  const health = `http://127.0.0.1:${config.health.port}/`;
  t.is((await fetch(health)).status, 200);

  // The API goes away: the app keeps trying, and says so once it has lasted
  await api.close();
  await waitFor(() => events.includes('disconnected'));
  t.is((await fetch(health)).status, 503);
  t.is(
    JSON.parse(fs.readFileSync(app.statusFile, 'utf8')).state !== 'connected',
    true
  );
  t.true(app.attempts >= 1);
});

test('a message retried while it is still being delivered is delivered once', async (t) => {
  // A local mail server that takes its time to accept a message
  const received = [];
  const server = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    logger: false,
    onData(stream, session, callback) {
      stream.resume();
      stream.on('end', () => {
        received.push(session.envelope.rcptTo[0].address);
        setTimeout(callback, 400);
      });
    }
  });
  const port = await getPort();
  await new Promise((resolve) => {
    server.listen(port, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
      })
  );
  const api = await startFakeApi();
  t.context.cleanup.push(() => api.close());
  const app = new TunnelClient(
    loadConfig({
      directory: t.context.directory,
      env: {},
      overrides: {
        token: api.token,
        apiUrl: api.url,
        domains: DOMAIN,
        'local.port': String(port),
        'local.tls': 'none',
        'probe.interval': '0',
        'notify.desktop': 'false'
      }
    }),
    { logger: createTestLogger() }
  );
  t.context.cleanup.push(() => app.stop());
  app.start();
  await waitFor(() => app.state === 'connected');

  // The sender's retry arrives while the first attempt is not yet answered
  const first = api.deliver(createMessage('slow'), { fingerprint: 'slow-1' });
  await waitFor(() => received.length === 1);
  const second = api.deliver(createMessage('slow'), { fingerprint: 'slow-1' });
  const answers = await Promise.all([first, second]);
  t.deepEqual(answers[0].accepted, [MAILBOX]);
  t.deepEqual(answers[1].accepted, [MAILBOX]);
  t.is(received.length, 1);
  t.is(app.stats.delivered, 1);

  // And a later retry is answered from what is remembered
  const third = await api.deliver(createMessage('slow'), {
    fingerprint: 'slow-1'
  });
  t.regex(third.response, /Already delivered/);
  t.is(received.length, 1);
});

test('the app waits instead of hammering when its token is refused or it is replaced', async (t) => {
  const api = await startFakeApi();
  t.context.cleanup.push(() => api.close());
  const start = (overrides) => {
    const config = loadConfig({
      directory: createTemporaryDirectory(),
      env: {},
      overrides: {
        token: api.token,
        apiUrl: api.url,
        domains: DOMAIN,
        'probe.interval': '0',
        'notify.desktop': 'false',
        'reconnect.minDelay': '20',
        'reconnect.maxDelay': '40',
        'reconnect.slowDelay': '60000',
        ...overrides
      }
    });
    const events = [];
    const app = new TunnelClient(config, {
      logger: createTestLogger(),
      notify: (event) => events.push(event)
    });
    app.events = events;
    t.context.cleanup.push(async () => {
      await app.stop();
      fs.rmSync(config.directory, { recursive: true, force: true });
    });
    app.start();
    return app;
  };

  const refused = start({ token: 'wrong-token' });
  await waitFor(() => refused.events.includes('unauthorized'));
  const { attempts } = refused;
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });
  t.is(refused.attempts, attempts);
  t.is(api.hellos.length, 0);

  // Another app took the domains over
  api.refuseWith = { code: 'REPLACED', closeCode: 4409 };
  const replaced = start({});
  await waitFor(() => replaced.events.includes('replaced'));
  const hellos = api.hellos.length;
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });
  t.is(api.hellos.length, hellos);
});

test('notifications: per event, not repeated, sent to a webhook and a command', async (t) => {
  const posts = [];
  const server = http.createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      posts.push(JSON.parse(body));
      response.end('ok');
    });
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(() => server.close());

  const marker = path.join(t.context.directory, 'event.txt');
  const config = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: {
      domains: DOMAIN,
      'notify.desktop': 'false',
      'notify.webhookUrl': `http://127.0.0.1:${server.address().port}/hook`,
      'notify.command': `"${process.execPath}" -e "require('fs').writeFileSync(process.argv[1], process.env.MST_EVENT + ':' + process.env.MST_MESSAGE)" "${marker}"`,
      'notify.events': 'local_down,connected'
    }
  });
  const notify = createNotifier(config, createTestLogger());

  t.true(notify('local_down', 'Mail server is "down"; $(reboot)'));
  // The same event again within notify.minInterval, and an event not asked for
  t.false(notify('local_down', 'again'));
  t.false(notify('disconnected', 'not asked for'));

  await waitFor(() => posts.length === 1 && fs.existsSync(marker));
  t.like(posts[0], { event: 'local_down', domains: [DOMAIN] });
  // (the message reaches the command as data, never as part of the command)
  t.is(
    fs.readFileSync(marker, 'utf8'),
    'local_down:Mail server is "down"; $(reboot)'
  );

  // The desktop notification of each system takes the text as data too
  const mac = getDesktopCommand('Title', 'say "hi" \\ there', 'darwin');
  t.is(mac.file, 'osascript');
  t.true(mac.args[1].includes('\\"hi\\" \\\\ there'));
  const windows = getDesktopCommand('Title', '$(evil)', 'win32');
  t.false(windows.args.join(' ').includes('$(evil)'));
  t.is(windows.env.MST_MESSAGE, '$(evil)');
  t.deepEqual(getDesktopCommand('Title', '--help', 'linux').args.slice(2), [
    '--',
    'Title',
    '--help'
  ]);
});

test('autostart: what is installed on each system starts the app with its settings', (t) => {
  const context = {
    program: { file: '/opt/Mail Server/mail-server-tunnel', args: [] },
    configFile: "/home/o'brien/.config/mail-server-tunnel/config.json",
    directory: "/home/o'brien/.config/mail-server-tunnel",
    logFile: '/tmp/mail-server-tunnel.log',
    mode: 'user'
  };

  const unit = getSystemdUnit(context);
  t.regex(unit, /^Restart=always$/m);
  t.regex(unit, /^WantedBy=default\.target$/m);
  t.true(
    unit.includes(
      `ExecStart="/opt/Mail Server/mail-server-tunnel" "run" "--config" "${context.configFile}"`
    )
  );
  t.regex(
    getSystemdUnit({ ...context, mode: 'system' }),
    /^WantedBy=multi-user\.target$/m
  );

  const plist = getLaunchdPlist({
    ...context,
    program: { file: '/Applications/A&B/mail-server-tunnel', args: [] }
  });
  t.true(
    plist.includes('<string>/Applications/A&amp;B/mail-server-tunnel</string>')
  );
  t.regex(plist, /<key>KeepAlive<\/key>\s*<true\/>/);

  // Cron starts it at boot and again every 5 minutes (a second copy leaves)
  const cron = getCronLines(context);
  t.is(cron.length, 2);
  t.true(cron[0].startsWith('@reboot '));
  t.true(cron[1].startsWith('*/5 * * * * '));
  t.true(
    cron[1].includes(
      `'/home/o'\\''brien/.config/mail-server-tunnel/config.json'`
    )
  );
  if (process.platform !== 'win32') {
    // The line runs in a shell as the command that was meant
    const line = cron[0]
      .replace('@reboot ', '')
      .replace("'/opt/Mail Server/mail-server-tunnel'", 'printf "%s\\n"')
      .replace(/ >\/dev\/null.*$/, '');
    const output = spawnSync('sh', ['-c', line], { encoding: 'utf8' }).stdout;
    t.deepEqual(output.trim().split('\n'), [
      'run',
      '--quiet',
      '--config',
      context.configFile
    ]);
  }

  const windows = {
    ...context,
    program: { file: 'C:\\Users\\A & B\\mail-server-tunnel.exe', args: [] },
    configFile: 'C:\\Users\\A & B\\config.json',
    launcher: 'C:\\Users\\A & B\\mail-server-tunnel.vbs'
  };
  const task = getWindowsTask(windows);
  t.true(task.includes('<LogonTrigger>'));
  t.true(task.includes('<Interval>PT5M</Interval>'));
  t.true(task.includes('<Command>wscript.exe</Command>'));
  t.true(task.includes('A &amp; B\\mail-server-tunnel.vbs'));
  t.true(
    getWindowsTask({ ...windows, mode: 'system' }).includes('<BootTrigger>')
  );
  // Without Windows Script Host the app puts itself in the background
  const direct = getWindowsTask({ ...windows, launcher: undefined });
  t.false(direct.includes('wscript.exe'));
  t.true(
    direct.includes(
      '<Command>C:\\Users\\A &amp; B\\mail-server-tunnel.exe</Command>'
    )
  );
  t.true(
    direct.includes(
      '&quot;run&quot; &quot;--quiet&quot; &quot;--detach&quot; &quot;--config&quot;'
    )
  );
  t.false(getWindowsTask({ ...windows, mode: 'system' }).includes('--detach'));
  t.true(
    getWindowsLauncher(windows).includes(
      '""C:\\Users\\A & B\\mail-server-tunnel.exe"" ""run"" ""--quiet""'
    )
  );
});

test('run --detach returns at once and leaves the app running in the background', async (t) => {
  const { directory } = t.context;
  const env = { ...process.env, MAIL_SERVER_TUNNEL_HOME: directory };
  fs.writeFileSync(
    path.join(directory, 'config.json'),
    JSON.stringify({
      token: 'secret-token',
      domains: ['example.com'],
      apiUrl: 'http://127.0.0.1:9'
    }),
    { mode: 0o600 }
  );
  const started = Date.now();
  const result = spawnSync(
    process.execPath,
    [INDEX, 'run', '--quiet', '--detach'],
    { encoding: 'utf8', env, timeout: 20_000 }
  );
  t.is(result.status, 0);
  t.true(Date.now() - started < 15_000);

  const lock = path.join(directory, 'mail-server-tunnel.lock');
  await waitFor(() => fs.existsSync(lock) && fs.readFileSync(lock, 'utf8'));
  const pid = Number(fs.readFileSync(lock, 'utf8'));
  const isRunning = () => {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  };

  t.context.cleanup.push(async () => {
    if (isRunning()) process.kill(pid);
    await waitFor(() => !isRunning());
  });
  t.true(pid > 0 && pid !== result.pid);
  t.true(isRunning());

  // A second start leaves the first one alone
  const second = spawnSync(
    process.execPath,
    [INDEX, 'run', '--quiet', '--detach'],
    { env, timeout: 20_000 }
  );
  t.is(second.status, 0);
  await t.throwsAsync(
    waitFor(() => Number(fs.readFileSync(lock, 'utf8')) !== pid, 2000)
  );
  t.true(isRunning());
});

test('an app that has only just started is seen as running, and one that loses its lock leaves', async (t) => {
  const { directory } = t.context;
  const env = { ...process.env, MAIL_SERVER_TUNNEL_HOME: directory };
  fs.writeFileSync(
    path.join(directory, 'config.json'),
    JSON.stringify({
      token: 'secret-token',
      domains: ['example.com'],
      apiUrl: 'http://127.0.0.1:9'
    }),
    { mode: 0o600 }
  );
  const config = loadConfig({ directory, env: {} });
  const lock = path.join(directory, 'mail-server-tunnel.lock');
  const isRunning = (pid) => {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  };

  // Before the app has written its state, its lock says that it runs
  const starting = spawn(process.execPath, [
    '-e',
    'setTimeout(() => {}, 30000)'
  ]);
  t.context.cleanup.push(() => starting.kill());
  fs.writeFileSync(lock, String(starting.pid));
  const status = getStatus(config);
  t.true(status.running);
  t.is(status.pid, starting.pid);
  t.is(status.state, 'starting');
  starting.kill();
  await waitFor(() => !getStatus(config).running);
  fs.rmSync(lock);

  // A running app whose lock another copy now holds stops, and leaves that
  // copy's lock alone
  spawnSync(process.execPath, [INDEX, 'run', '--quiet', '--detach'], {
    env,
    timeout: 20_000
  });
  await waitFor(() => fs.existsSync(lock) && fs.readFileSync(lock, 'utf8'));
  const pid = Number(fs.readFileSync(lock, 'utf8'));
  t.context.cleanup.push(async () => {
    if (isRunning(pid)) process.kill(pid);
    await waitFor(() => !isRunning(pid));
  });
  await waitFor(() => getStatus(config).state !== 'starting');
  const other = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 30000)']);
  t.context.cleanup.push(() => other.kill());
  fs.writeFileSync(lock, String(other.pid));
  await waitFor(() => !isRunning(pid));
  t.is(fs.readFileSync(lock, 'utf8'), String(other.pid));

  // The same when its folder is removed from under it
  other.kill();
  fs.rmSync(lock);
  spawnSync(process.execPath, [INDEX, 'run', '--quiet', '--detach'], {
    env,
    timeout: 20_000
  });
  await waitFor(() => fs.existsSync(lock) && fs.readFileSync(lock, 'utf8'));
  const next = Number(fs.readFileSync(lock, 'utf8'));
  t.context.cleanup.push(async () => {
    if (isRunning(next)) process.kill(next);
    await waitFor(() => !isRunning(next));
  });
  fs.rmSync(lock);
  await waitFor(() => !isRunning(next));
  t.false(fs.existsSync(lock));
});

test('log: written for the owner only and rotated by size', (t) => {
  const file = path.join(t.context.directory, 'app.log');
  const logger = createLogger({ file, maxSize: 300, maxFiles: 2, quiet: true });
  for (let i = 0; i < 20; i++) logger.info(`line ${i}`, { n: i });
  logger.debug('not at this level');
  t.true(fs.existsSync(`${file}.1`));
  t.true(fs.statSync(file).size <= 300);
  const text = fs.readFileSync(file, 'utf8');
  t.regex(text, /INFO {2}line 19 {"n":19}/);
  t.false(text.includes('not at this level'));
  if (process.platform !== 'win32') t.is(fs.statSync(file).mode & 0o777, 0o600);
});

// A minisign key pair and signatures, as `tauri signer` writes them
function createSigner() {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const raw = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32);
  const keyId = Buffer.from('0102030405060708', 'hex');
  const publicLine = Buffer.concat([Buffer.from('Ed'), keyId, raw]).toString(
    'base64'
  );
  return {
    publicKey: Buffer.from(
      `untrusted comment: minisign public key\n${publicLine}\n`
    ).toString('base64'),
    sign(data) {
      const hash = createHash('blake2b512').update(data).digest();
      const signature = sign(null, hash, privateKey);
      const comment = 'timestamp:1 file:sums';
      const global = sign(
        null,
        Buffer.concat([signature, Buffer.from(comment)]),
        privateKey
      );
      return Buffer.from(
        [
          'untrusted comment: signature',
          Buffer.concat([Buffer.from('ED'), keyId, signature]).toString(
            'base64'
          ),
          `trusted comment: ${comment}`,
          global.toString('base64'),
          ''
        ].join('\n')
      ).toString('base64');
    }
  };
}

test('updates: only a newer release that is signed, complete and intact is installed', async (t) => {
  const { directory } = t.context;
  const signer = createSigner();
  const other = createSigner();
  const asset = 'mail-server-tunnel-test-x64';
  const binary = Buffer.from('#!/bin/sh\necho new version\n');
  const sha = createHash('sha256').update(binary).digest('hex');

  let release;
  const files = new Map();
  const server = http.createServer((request, response) => {
    if (request.url.endsWith('/releases/latest')) {
      response.setHeader('Content-Type', 'application/json');
      return response.end(JSON.stringify(release));
    }

    const file = files.get(request.url);
    response.statusCode = file ? 200 : 404;
    response.end(file);
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;

  function publish(version, { sums, signature, content = binary } = {}) {
    const list = sums ?? `${sha}  ${asset}\n# version: ${version}\n`;
    files.set('/asset', content);
    files.set('/sums', Buffer.from(list));
    files.set('/sig', Buffer.from(signature ?? signer.sign(Buffer.from(list))));
    release = {
      tag_name: `v${version}`,
      html_url: `${base}/release`,
      assets: [
        { name: asset, browser_download_url: `${base}/asset` },
        { name: SUMS_NAME, browser_download_url: `${base}/sums` },
        { name: `${SUMS_NAME}.sig`, browser_download_url: `${base}/sig` }
      ]
    };
  }

  const target = path.join(directory, 'mail-server-tunnel');
  fs.writeFileSync(target, 'old version', { mode: 0o755 });
  const config = loadConfig({ directory, env: {} });
  const check = (extra = {}) =>
    checkForUpdate(config, {
      force: true,
      current: '1.0.0',
      apiBase: base,
      assetName: asset,
      target,
      publicKey: signer.publicKey,
      isStandalone: true,
      ...extra
    });
  const installed = () => fs.readFileSync(target, 'utf8');

  // Nothing newer
  publish('1.0.0');
  t.like(await check(), { updated: false });
  t.is(installed(), 'old version');

  // Signed by someone else
  publish('1.1.0', {
    signature: other.sign(Buffer.from(`${sha}  ${asset}\n# version: 1.1.0\n`))
  });
  await t.throwsAsync(check(), { message: /not signed by Forward Email/ });

  // The signed list of an earlier release attached to a later one
  const oldList = `${sha}  ${asset}\n# version: 1.0.5\n`;
  publish('1.1.0', { sums: oldList });
  await t.throwsAsync(check(), { message: /not the list of that release/ });

  // A download that is not the file the list names
  publish('1.1.0', { content: Buffer.from('tampered') });
  await t.throwsAsync(check(), { message: /Checksum mismatch/ });
  t.is(installed(), 'old version');
  t.deepEqual(
    fs.readdirSync(directory).filter((name) => name.endsWith('.new')),
    []
  );

  // Only looking does not install
  publish('1.1.0');
  t.like(await check({ checkOnly: true }), { updated: false, latest: '1.1.0' });
  t.is(installed(), 'old version');

  // A copy run with Node.js is told of the release instead
  t.like(await check({ isStandalone: false }), {
    updated: false,
    latest: '1.1.0'
  });

  // The real thing
  t.like(await check(), { updated: true, latest: '1.1.0' });
  t.is(installed(), binary.toString());
  if (process.platform !== 'win32')
    t.is(fs.statSync(target).mode & 0o111, 0o111);

  // And it is not looked for again within update.interval
  t.like(await check({ force: false }), { skipped: true });

  t.is(compareVersions('2.19.22', '2.19.21'), 1);
  t.is(compareVersions('1.0.0-beta.10', '1.0.0-beta.9'), 1);
  t.is(compareVersions('1.0.0', '1.0.0-beta.1'), 1);
  t.false(verifySignature(Buffer.from('data'), 'garbage', signer.publicKey));
});

test('GUI: only its own page can use it, and it does what the command line does', async (t) => {
  const { directory } = t.context;
  const smtp = await startSmtp(t);
  const file = path.join(directory, 'config.json');
  const load = () => loadConfig({ directory, file, env: {} });
  const { server, url, secret, cookie } = await startGui({
    load,
    file,
    open: false
  });
  t.context.cleanup.push(() => server.close());
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;

  const call = (name, body = {}, headers = {}) =>
    fetch(`${origin}/api/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tunnel-Secret': secret,
        Cookie: cookie,
        ...headers
      },
      body: JSON.stringify(body)
    });

  // The address that is opened works once: it hands out the session cookie
  // and leads to the page, which is served to that session only
  const opened = await fetch(url, { redirect: 'manual' });
  t.is(opened.status, 302);
  t.is(opened.headers.get('location'), '/');
  t.regex(opened.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  t.true(opened.headers.get('set-cookie').startsWith(cookie));
  t.is((await fetch(url, { redirect: 'manual' })).status, 404);
  const page = await fetch(`${origin}/`, { headers: { Cookie: cookie } });
  t.is(page.status, 200);
  t.true((await page.text()).includes('<title>Mail Server Tunnel</title>'));
  t.regex(
    page.headers.get('content-security-policy'),
    /frame-ancestors 'none'/
  );
  t.is((await fetch(`${origin}/`)).status, 404);

  // Requests without the page's secret, from another site, or through
  // another name for this computer are refused
  t.is((await call('state', {}, { 'X-Tunnel-Secret': 'wrong' })).status, 403);
  t.is((await call('state', {}, { Cookie: 'mst_session=wrong' })).status, 403);
  t.is(
    (await call('state', {}, { Origin: 'https://evil.example' })).status,
    403
  );
  t.is((await call('state', {}, { 'Content-Type': 'text/plain' })).status, 403);
  const rebound = await new Promise((resolve) => {
    const request = http.request(
      {
        host: '127.0.0.1',
        port,
        path: '/api/state',
        method: 'POST',
        headers: {
          Host: 'evil.example',
          Cookie: cookie,
          'X-Tunnel-Secret': secret,
          'Content-Type': 'application/json'
        }
      },
      (response) => resolve(response.statusCode)
    );
    request.end('{}');
  });
  t.is(rebound, 403);

  // Settings are saved, validated, and never show a secret
  let response = await call('save', {
    changes: {
      token: 'gui-token',
      local: { port: smtp.port, pass: 'secret-pass' }
    }
  });
  t.is(response.status, 200);
  const state = await (await call('state')).json();
  t.is(state.config.local.port, smtp.port);
  t.is(state.config.token, '********');
  t.false(JSON.stringify(state).includes('gui-token'));
  t.false(JSON.stringify(state).includes('secret-pass'));
  t.is(state.status.state, 'stopped');
  t.true(
    state.paths.some((item) => item.env === 'MAIL_SERVER_TUNNEL_LOCAL_PORT')
  );

  // Saving the page's settings back keeps the hidden token and password
  response = await call('save', { changes: state.config });
  t.is(response.status, 200);
  t.is(load().token, 'gui-token');
  t.is(load().local.pass, 'secret-pass');

  // A mistake is refused and the file is left as it was
  response = await call('save', { changes: { local: { port: 99_999 } } });
  t.is(response.status, 400);
  t.regex((await response.json()).message, /local\.port/);
  t.is(load().local.port, smtp.port);
  response = await call('save', { changes: { nope: true } });
  t.is(response.status, 400);

  // The same checks as "doctor" and the connection test
  const probe = await (
    await call('probe', {
      host: '127.0.0.1',
      port: smtp.port,
      protocol: 'smtp'
    })
  ).json();
  t.true(probe.ok);
  const doctor = await (await call('doctor')).json();
  t.true(
    doctor.checks.some(
      (check) => !check.ok && /No domains are set/.test(check.message)
    )
  );
  t.is((await call('install')).status, 400);
  t.is((await call('no-such-action')).status, 404);
});

test('command line: runs as a program and prints help, version and settings', (t) => {
  const run = (...args) =>
    spawnSync(process.execPath, [INDEX, ...args], {
      encoding: 'utf8',
      env: { ...process.env, MAIL_SERVER_TUNNEL_HOME: t.context.directory }
    });
  t.regex(run('help').stdout, /Usage: mail-server-tunnel <command>/);
  t.regex(run('version').stdout, /^\d+\.\d+\.\d+/);
  const paths = run('config', '--paths').stdout;
  t.regex(paths, /local\.port\s+MAIL_SERVER_TUNNEL_LOCAL_PORT/);
  const config = JSON.parse(
    run('config', '--token', 'secret-token', '--domain', 'example.com').stdout
  );
  t.is(config.token, '********');
  t.deepEqual(config.domains, ['example.com']);
  const status = run('status', '--json');
  t.is(JSON.parse(status.stdout).state, 'stopped');
  t.is(status.status, 1);
  const unknown = run('frobnicate');
  t.is(unknown.status, 1);
  t.regex(unknown.stderr, /Unknown command/);
  t.is(os.platform(), process.platform);
});
