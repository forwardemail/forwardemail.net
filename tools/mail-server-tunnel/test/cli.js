/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { PassThrough, Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import test from 'ava';
import { SMTPServer } from 'smtp-server';

import { CancelError, clean, createUi, suggest } from '../lib/ui.js';
import { createTemporaryDirectory, getPort, waitFor } from './helpers.js';

//
// What the command line asks and prints: the questions answered with the
// keyboard (a terminal that this test types into), the same questions
// answered a line at a time (a pipe), and the guided setup from start to
// finish against an API and a mail server that run here.
//

const INDEX = fileURLToPath(new URL('../index.js', import.meta.url));
const TOKEN = 'b'.repeat(40);
const KEYS = {
  enter: '\r',
  up: '\u001B[A',
  down: '\u001B[B',
  space: ' ',
  backspace: '\u007F',
  escape: '\u001B',
  ctrlC: '\u0003'
};

// eslint-disable-next-line no-control-regex
const plain = (text) => text.replace(/\u001B\[[\d;?]*[A-Za-z]/g, '');

test.beforeEach((t) => {
  t.context.directory = createTemporaryDirectory();
  t.context.cleanup = [];
});

test.afterEach.always(async (t) => {
  for (const fn of t.context.cleanup.reverse()) await fn();
  fs.rmSync(t.context.directory, {
    recursive: true,
    force: true,
    maxRetries: 20,
    retryDelay: 100
  });
});

// A terminal the test types into, and what was drawn on it
function createTerminal(options = {}) {
  const input = new PassThrough();
  input.isTTY = true;
  input.setRawMode = () => input;
  let text = '';
  const output = new Writable({
    write(chunk, _, callback) {
      text += chunk.toString();
      callback();
    }
  });
  output.isTTY = true;
  output.rows = 24;
  // (the marks of a terminal that can draw them, whatever runs the test)
  const ui = createUi({
    input,
    output,
    env: {},
    color: false,
    unicode: true,
    ...options
  });
  return {
    ui,
    // (one key at a time, as a keyboard sends them)
    async type(...keys) {
      for (const key of keys) {
        await new Promise((resolve) => {
          setImmediate(resolve);
        });
        input.write(key);
      }
    },
    get text() {
      return plain(text);
    },
    get raw() {
      return text;
    }
  };
}

// The same questions when the input is not a terminal: a line per answer
function createPipe(answers) {
  const input = new PassThrough();
  let text = '';
  const output = new Writable({
    write(chunk, _, callback) {
      text += chunk.toString();
      callback();
    }
  });
  const ui = createUi({ input, output, env: {} });
  input.end(answers.map((answer) => `${answer}\n`).join(''));
  return {
    ui,
    get text() {
      return text;
    }
  };
}

test('text: Enter takes the default, and an answer that cannot be used is asked again', async (t) => {
  const terminal = createTerminal();
  let answer = terminal.ui.text('Host', { defaultValue: '127.0.0.1' });
  await terminal.type(KEYS.enter);
  t.is(await answer, '127.0.0.1');
  t.regex(terminal.text, /✔ Host · 127\.0\.0\.1/);

  const isPort = (value) =>
    /^\d+$/.test(value) ? undefined : 'Enter a port from 1 to 65535';
  answer = terminal.ui.text('Port', { defaultValue: '25', validate: isPort });
  await terminal.type(...'abc', KEYS.enter);
  await waitFor(() => terminal.text.includes('Enter a port from 1 to 65535'));
  // (corrected in place: three backspaces, then the port)
  await terminal.type(
    KEYS.backspace,
    KEYS.backspace,
    KEYS.backspace,
    ...'2525',
    KEYS.enter
  );
  t.is(await answer, '2525');
  t.regex(terminal.text, /✔ Port · 2525/);
});

test('secret: what is typed or pasted is never drawn', async (t) => {
  const terminal = createTerminal();
  const answer = terminal.ui.secret('API token');
  // (pasted in one piece, with the line break a paste often ends with)
  await terminal.type(`${TOKEN}`, KEYS.enter);
  t.is(await answer, TOKEN);
  t.false(terminal.raw.includes(TOKEN));
  t.false(terminal.raw.includes(TOKEN.slice(0, 6)));
  t.regex(terminal.text, /✔ API token · •+/);
});

test('confirm, select and multiselect are answered with the keyboard', async (t) => {
  const terminal = createTerminal();
  let answer = terminal.ui.confirm('Start at boot?');
  await terminal.type('n');
  t.false(await answer);
  answer = terminal.ui.confirm('Start at boot?', false);
  await terminal.type(KEYS.enter);
  t.false(await answer);
  answer = terminal.ui.confirm('Start at boot?', false);
  await terminal.type(KEYS.down, KEYS.enter);
  t.true(await answer);

  const protocols = [
    { value: 'smtp', label: 'SMTP', hint: 'Postfix' },
    { value: 'lmtp', label: 'LMTP' }
  ];
  answer = terminal.ui.select('Protocol', protocols, { defaultValue: 'smtp' });
  await terminal.type(KEYS.down, KEYS.enter);
  t.is(await answer, 'lmtp');
  t.regex(terminal.text, /✔ Protocol · LMTP/);
  // (around from the last to the first)
  answer = terminal.ui.select('Protocol', protocols, { defaultValue: 'lmtp' });
  await terminal.type(KEYS.down, KEYS.enter);
  t.is(await answer, 'smtp');

  const domains = ['a.example', 'b.example', 'c.example'].map((name) => ({
    value: name,
    label: name
  }));
  answer = terminal.ui.multiselect('Domains', domains);
  // Enter with nothing chosen asks for one
  await terminal.type(KEYS.enter);
  await waitFor(() => terminal.text.includes('Choose at least one'));
  await terminal.type(KEYS.space, KEYS.down, KEYS.down, KEYS.space, KEYS.enter);
  t.deepEqual(await answer, ['a.example', 'c.example']);
  t.regex(terminal.text, /✔ Domains · a\.example, c\.example/);

  // "a" chooses all of them, and what was chosen before is checked already
  answer = terminal.ui.multiselect('Domains', domains, {
    defaultValues: ['b.example']
  });
  await waitFor(() => terminal.text.includes('1 chosen'));
  await terminal.type('a', KEYS.enter);
  t.deepEqual(await answer, ['a.example', 'b.example', 'c.example']);
});

test('Ctrl+C and Esc cancel a question and give the terminal back', async (t) => {
  for (const key of [KEYS.ctrlC, KEYS.escape]) {
    const terminal = createTerminal();
    const answer = terminal.ui.text('Host');
    await terminal.type(...'abc');
    await terminal.type(key);
    const cancelled = await t.throwsAsync(answer, { instanceOf: CancelError });
    t.true(cancelled.isCancel);
    // (the cursor the question hid is shown again)
    t.true(terminal.raw.endsWith('\u001B[?25h'));
  }
});

test('what comes from elsewhere cannot move the cursor or recolor the screen', async (t) => {
  const hostile = 'evil\u001B[2J\u001B[1;1H\u001B]0;title\u0007.example\r\nok';
  t.is(clean(hostile), 'evil]0;title.example\nok');
  const terminal = createTerminal();
  terminal.ui.ok(`Signed in as ${hostile}`);
  terminal.ui.table([['Account', hostile]]);
  const answer = terminal.ui.select('Domains', [
    { value: 'x', label: hostile, hint: hostile }
  ]);
  await terminal.type(KEYS.enter);
  await answer;
  t.false(terminal.raw.includes('\u001B[2J'));
  t.false(terminal.raw.includes('\u001B[1;1H'));
  t.false(terminal.raw.includes('\u0007'));
});

test('colors and marks follow the terminal: NO_COLOR, FORCE_COLOR, a pipe, an old Windows console', (t) => {
  const draw = (options) => {
    let text = '';
    const output = new Writable({
      write(chunk, _, callback) {
        text += chunk.toString();
        callback();
      }
    });
    output.isTTY = options.isTTY;
    createUi({
      input: new PassThrough(),
      output,
      unicode: true,
      ...options
    }).ok('Saved');
    return text;
  };

  t.is(draw({ isTTY: true, env: {} }), '  \u001B[32m✔\u001B[39m Saved\n');
  t.is(draw({ isTTY: true, env: { NO_COLOR: '1' } }), '  ✔ Saved\n');
  t.is(draw({ isTTY: false, env: {} }), '  ✔ Saved\n');
  t.is(
    draw({ isTTY: false, env: { FORCE_COLOR: '1' } }),
    '  \u001B[32m✔\u001B[39m Saved\n'
  );
  t.is(draw({ isTTY: true, env: {}, unicode: false }).includes('✔'), false);
});

test('a mistyped command is answered with the one that was meant', (t) => {
  const commands = ['setup', 'status', 'doctor', 'install', 'uninstall'];
  t.is(suggest('stat', commands), 'status');
  t.is(suggest('docter', commands), 'doctor');
  t.is(suggest('unistall', commands), 'uninstall');
  t.is(suggest('zzzzzz', commands), undefined);

  const run = (...args) =>
    spawnSync(process.execPath, [INDEX, ...args], {
      encoding: 'utf8',
      env: { ...process.env, MAIL_SERVER_TUNNEL_HOME: t.context.directory }
    });
  const result = run('stauts');
  t.is(result.status, 1);
  t.regex(result.stderr, /Unknown command "stauts"\. Did you mean "status"\?/);
  t.regex(result.stderr, /mail-server-tunnel help/);
  // (the help is no longer printed in front of the error)
  t.is(result.stdout, '');
  // Not set up yet: what to run is said
  const install = run('install');
  t.is(install.status, 1);
  t.regex(install.stderr, /not set up yet/);
  t.regex(install.stderr, /mail-server-tunnel setup/);
});

test('without a terminal each question reads a line: defaults, numbers, names and "all"', async (t) => {
  const pipe = createPipe([
    '',
    'not-a-port',
    '2525',
    'y',
    '2',
    'LMTP',
    '1, c.example',
    'all'
  ]);
  const { ui } = pipe;
  const isPort = (value) => (/^\d+$/.test(value) ? undefined : 'Not a port');
  const protocols = [
    { value: 'smtp', label: 'SMTP' },
    { value: 'lmtp', label: 'LMTP' }
  ];
  const domains = ['a.example', 'b.example', 'c.example'].map((name) => ({
    value: name,
    label: name
  }));
  t.is(await ui.text('Host', { defaultValue: '127.0.0.1' }), '127.0.0.1');
  t.is(await ui.text('Port', { validate: isPort }), '2525');
  t.true(await ui.confirm('Start at boot?', false));
  t.is(await ui.select('Protocol', protocols), 'lmtp');
  t.is(await ui.select('Protocol', protocols), 'lmtp');
  t.deepEqual(await ui.multiselect('Domains', domains), [
    'a.example',
    'c.example'
  ]);
  t.deepEqual(
    await ui.multiselect('Domains', domains),
    domains.map((domain) => domain.value)
  );
  t.regex(pipe.text, /Not a port/);
  t.regex(pipe.text, /2\. LMTP/);
  // The input ended: the next question is cancelled, not answered for them
  await t.throwsAsync(ui.text('One more'), { instanceOf: CancelError });
  ui.close();
});

//
// A Forward Email API with one account and its domains, and a mail server
//
async function startSetupServers(t) {
  const api = { requests: [], tunnels: new Map() };
  const domains = [
    { name: 'paid.example', plan: 'enhanced_protection', has_txt_record: true },
    { name: 'team.example', plan: 'team', has_txt_record: false },
    { name: 'free.example', plan: 'free', has_txt_record: true }
  ];
  const server = http.createServer((request, response) => {
    const expected = `Basic ${Buffer.from(`${TOKEN}:`).toString('base64')}`;
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      api.requests.push(`${request.method} ${request.url}`);
      const send = (status, data) => {
        response.writeHead(status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(data));
      };

      if (request.headers.authorization !== expected)
        return send(401, { message: 'Invalid API token.' });
      if (request.url === '/v1/account')
        return send(200, { email: 'owner@paid.example' });
      if (request.url === '/v1/domains') return send(200, domains);
      const match = /^\/v1\/domains\/([^/]+)$/.exec(request.url);
      if (match && request.method === 'PUT') {
        api.tunnels.set(match[1], JSON.parse(body).has_tunnel);
        return send(200, { name: match[1] });
      }

      send(404, { message: 'Not found' });
    });
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
      })
  );
  api.url = `http://127.0.0.1:${server.address().port}`;

  const smtp = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    logger: false
  });
  const smtpPort = await getPort();
  await new Promise((resolve) => {
    smtp.listen(smtpPort, '127.0.0.1', resolve);
  });
  t.context.cleanup.push(
    () =>
      new Promise((resolve) => {
        smtp.close(resolve);
      })
  );
  return { api, smtpPort };
}

// Runs the command line with `input` on its standard input
function runCli(args, { directory, input = '' }) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [INDEX, ...args], {
      env: { ...process.env, MAIL_SERVER_TUNNEL_HOME: directory, NO_COLOR: '1' }
    });
    const result = { stdout: '', stderr: '' };
    child.stdout.on('data', (chunk) => {
      result.stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      result.stderr += chunk;
    });
    child.on('exit', (status) => resolve({ ...result, status }));
    child.stdin.end(input);
  });
}

const readConfig = (directory) =>
  JSON.parse(fs.readFileSync(path.join(directory, 'config.json'), 'utf8'));

test('setup, a line per answer: asks again after a wrong token, saves what was answered', async (t) => {
  const { directory } = t.context;
  const { api, smtpPort } = await startSetupServers(t);
  const child = spawn(
    process.execPath,
    [INDEX, 'setup', '--no-install', '--set', `apiUrl=${api.url}`],
    {
      env: { ...process.env, MAIL_SERVER_TUNNEL_HOME: directory, NO_COLOR: '1' }
    }
  );
  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk;
  });
  child.stderr.on('data', (chunk) => {
    output += chunk;
  });
  const exited = new Promise((resolve) => {
    child.on('exit', resolve);
  });
  child.stdin.end(
    [
      'wrong-token',
      TOKEN,
      // Domains: by number and by name
      '1, team.example',
      // Mail server: default host, the port, SMTP by default
      '',
      String(smtpPort),
      '',
      // Remote mailbox access: no (the default)
      '',
      // Save
      'y'
    ]
      .map((answer) => `${answer}\n`)
      .join('')
  );
  const status = await exited;
  if (status !== 0) t.log(output);
  t.is(status, 0);

  t.regex(output, /Step 1 of 5/);
  t.regex(output, /The API token was refused/);
  t.regex(output, /Signed in as owner@paid\.example/);
  // (a domain on the free plan is not offered)
  t.notRegex(output, /free\.example/);
  t.regex(output, /A mail server answered at 127\.0\.0\.1:\d+/);
  t.regex(output, /Ready to set up/);
  t.regex(output, /Mail Server Tunnel is on for paid\.example/);
  // The unverified domain and its DNS are said, with what to do
  t.regex(output, /team\.example is not verified yet/);
  t.regex(output, /mx1\.forwardemail\.net/);
  t.regex(output, /mail-server-tunnel run/);
  // The token is never printed
  t.false(output.includes(TOKEN));

  const config = readConfig(directory);
  t.is(config.token, TOKEN);
  t.deepEqual(config.domains, ['paid.example', 'team.example']);
  t.like(config.local, { host: '127.0.0.1', port: smtpPort, protocol: 'smtp' });
  t.is(config.imap.enabled, false);
  t.deepEqual(
    [...api.tunnels],
    [
      ['paid.example', true],
      ['team.example', true]
    ]
  );
});

test('setup that is not confirmed, or whose answers run out, changes nothing', async (t) => {
  const { directory } = t.context;
  const { api, smtpPort } = await startSetupServers(t);
  const run = (answers) =>
    runCli(['setup', '--no-install', '--set', `apiUrl=${api.url}`], {
      directory,
      input: answers.map((answer) => `${answer}\n`).join('')
    });

  // Answered "no" at the end
  let result = await run([TOKEN, '1', '', String(smtpPort), '', '', 'n']);
  if (result.status !== 130) t.log(result.stdout + result.stderr);
  t.is(result.status, 130);
  t.regex(result.stdout, /Setup cancelled\. Nothing was changed\./);
  // The answers end at the domains
  result = await run([TOKEN]);
  if (result.status !== 130) t.log(result.stdout + result.stderr);
  t.is(result.status, 130);
  t.regex(result.stdout, /Setup cancelled\. Nothing was changed\./);

  t.false(fs.existsSync(path.join(directory, 'config.json')));
  t.is(api.tunnels.size, 0);
  t.false(api.requests.some((request) => request.startsWith('PUT')));
});

test('setup --yes asks nothing and says what is missing', async (t) => {
  const { directory } = t.context;
  const { api, smtpPort } = await startSetupServers(t);
  const run = (...args) =>
    runCli(
      ['setup', '--yes', '--no-install', '--set', `apiUrl=${api.url}`, ...args],
      { directory }
    );

  let result = await run();
  t.is(result.status, 1);
  t.regex(result.stderr, /--token is required with --yes/);
  result = await run('--token', TOKEN);
  t.is(result.status, 1);
  t.regex(result.stderr, /--domain is required with --yes/);
  result = await run('--token', TOKEN, '--domain', 'free.example');
  t.is(result.status, 1);
  t.regex(result.stderr, /free\.example is on the free plan/);

  result = await run(
    '--token',
    TOKEN,
    '--domain',
    'paid.example',
    '--local-port',
    String(smtpPort)
  );
  if (result.status !== 0) t.log(result.stdout + result.stderr);
  t.is(result.status, 0);
  t.notRegex(result.stdout, /Step 1 of 5/);
  t.regex(result.stdout, /Settings saved to/);
  t.deepEqual(readConfig(directory).domains, ['paid.example']);
  t.is(api.tunnels.get('paid.example'), true);
});

//
// The same setup in a real terminal (a pseudo-terminal from `script`, which
// Linux has): the keys are typed when their question is on the screen.
//
const hasScript =
  process.platform === 'linux' &&
  spawnSync('script', ['--version']).status === 0;

(hasScript ? test : test.skip)(
  'setup in a terminal: arrows, space and Enter, and the token is never on the screen',
  async (t) => {
    const { directory } = t.context;
    const { api, smtpPort } = await startSetupServers(t);
    const command = [
      process.execPath,
      INDEX,
      'setup',
      '--no-install',
      '--set',
      `apiUrl=${api.url}`
    ]
      .map((part) => `'${part}'`)
      .join(' ');
    const child = spawn('script', ['-qec', command, '/dev/null'], {
      env: {
        ...process.env,
        MAIL_SERVER_TUNNEL_HOME: directory,
        TERM: 'xterm-256color',
        COLUMNS: '100',
        LINES: '30'
      }
    });
    t.context.cleanup.push(() => child.kill('SIGKILL'));
    let raw = '';
    child.stdout.on('data', (chunk) => {
      raw += chunk;
    });
    const exited = new Promise((resolve) => {
      child.on('exit', resolve);
    });
    let seen = 0;
    // Waits for `text` to be drawn (after what was matched before), then types
    const when = async (text, ...keys) => {
      await waitFor(() => plain(raw).includes(text, seen), 20_000).catch(() => {
        throw new Error(
          `"${text}" was never drawn:\n${plain(raw).slice(seen)}`
        );
      });
      seen = plain(raw).indexOf(text, seen) + text.length;
      for (const key of keys) {
        child.stdin.write(key);
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });
      }
    };

    await when('? API token', TOKEN, KEYS.enter);
    await when('Signed in as owner@paid.example');
    // Domains: the first, then down to the second, both chosen
    await when(
      '? Which domains deliver to your mail server?',
      KEYS.space,
      KEYS.down,
      KEYS.space,
      KEYS.enter
    );
    await when('? Host', KEYS.enter);
    await when('? Port', ...String(smtpPort), KEYS.enter);
    // Protocol: down to LMTP and back up to SMTP
    await when('? Protocol', KEYS.down, KEYS.up, KEYS.enter);
    await when('A mail server answered');
    await when('? Allow reading mailboxes through the tunnel?', KEYS.enter);
    await when('Ready to set up');
    await when('? Save and turn the tunnel on?', 'y');
    await when('Settings saved to');
    const status = await exited;
    if (status !== 0) t.log(plain(raw));
    t.is(status, 0);

    t.false(raw.includes(TOKEN));
    t.regex(plain(raw), /✔ API token · •+/);
    t.regex(
      plain(raw),
      /✔ Which domains deliver to your mail server\? · paid\.example, team\.example/
    );
    t.regex(plain(raw), /✔ Protocol · SMTP/);
    const config = readConfig(directory);
    t.is(config.token, TOKEN);
    t.deepEqual(config.domains, ['paid.example', 'team.example']);
    t.like(config.local, { port: smtpPort, protocol: 'smtp' });
    t.is(api.tunnels.get('team.example'), true);

    // The config file is the owner's only
    t.is(fs.statSync(path.join(directory, 'config.json')).mode & 0o777, 0o600);
  }
);

(hasScript ? test : test.skip)(
  'setup in a terminal: Ctrl+C leaves the terminal as it was and changes nothing',
  async (t) => {
    const { directory } = t.context;
    const { api } = await startSetupServers(t);
    const command = [
      process.execPath,
      INDEX,
      'setup',
      '--no-install',
      '--set',
      `apiUrl=${api.url}`
    ]
      .map((part) => `'${part}'`)
      .join(' ');
    const child = spawn('script', ['-qec', command, '/dev/null'], {
      env: {
        ...process.env,
        MAIL_SERVER_TUNNEL_HOME: directory,
        TERM: 'xterm-256color'
      }
    });
    t.context.cleanup.push(() => child.kill('SIGKILL'));
    let raw = '';
    child.stdout.on('data', (chunk) => {
      raw += chunk;
    });
    const exited = new Promise((resolve) => {
      child.on('exit', resolve);
    });
    await waitFor(() => plain(raw).includes('? API token'), 20_000);
    child.stdin.write(TOKEN);
    child.stdin.write(KEYS.enter);
    await waitFor(() => plain(raw).includes('? Which domains'), 20_000);
    child.stdin.write(KEYS.ctrlC);
    const status = await exited;
    if (status !== 130) t.log(plain(raw));
    t.is(status, 130);
    t.regex(plain(raw), /Setup cancelled\. Nothing was changed\./);
    // (the cursor is shown again)
    t.true(raw.lastIndexOf('\u001B[?25h') > raw.lastIndexOf('\u001B[?25l'));
    t.false(fs.existsSync(path.join(directory, 'config.json')));
    t.is(api.tunnels.size, 0);
  }
);
