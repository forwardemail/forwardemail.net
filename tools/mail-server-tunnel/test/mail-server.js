/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import test from 'ava';

import { TunnelClient } from '../lib/client.js';
import { loadConfig } from '../lib/config.js';
import { deliver, probe } from '../lib/deliver.js';
import {
  DOMAIN,
  MAILBOX,
  PASSWORD,
  createMessage,
  createTemporaryDirectory,
  createTestLogger,
  getPort,
  hasDovecot,
  hasPostfix,
  startFakeApi,
  startMailServer,
  waitFor
} from './helpers.js';

//
// End-to-end tests against a real Postfix (and Dovecot for IMAP and LMTP)
// started for the test. They need root and the two servers installed, as on
// CI (see .github/workflows/release-mail-server-tunnel.yml); elsewhere they
// are skipped and the tests of test/app.js still run.
//
const postfix = hasPostfix ? test.serial : test.serial.skip;
const dovecot = hasDovecot ? test.serial : test.serial.skip;

test.before(async (t) => {
  if (hasPostfix)
    t.context.mail = await startMailServer({ dovecot: hasDovecot });
});

test.after.always((t) => {
  if (t.context.mail) t.context.mail.stop();
});

test.beforeEach(async (t) => {
  t.context.api = await startFakeApi();
  t.context.directory = createTemporaryDirectory();
  t.context.apps = [];
  // The app, set up for the test's Postfix and the test's API
  t.context.startApp = (overrides = {}) => {
    const { mail, api, directory } = t.context;
    const config = loadConfig({
      directory,
      env: {},
      overrides: {
        token: api.token,
        apiUrl: api.url,
        domains: DOMAIN,
        'local.port': String(mail.port),
        'local.name': 'tunnel.example.net',
        'probe.interval': '0',
        'notify.desktop': 'false',
        'reconnect.minDelay': '50',
        'reconnect.maxDelay': '200',
        'reconnect.slowDelay': '60000',
        'imap.enabled': 'true',
        'imap.port': String(mail.imapPort || 993),
        'imap.secure': 'false',
        ...overrides
      }
    });
    const events = [];
    const app = new TunnelClient(config, {
      logger: createTestLogger(),
      notify: (event, message) => events.push({ event, message })
    });
    app.events = events;
    t.context.apps.push(app);
    app.start();
    return app;
  };
});

test.afterEach.always(async (t) => {
  for (const app of t.context.apps) await app.stop();
  await t.context.api.close();
  fs.rmSync(t.context.directory, { recursive: true, force: true });
});

const subjects = (mail) =>
  mail.readMessages().map((message) => message.match(/^Subject: (.*)$/m)[1]);

postfix('delivers a message to Postfix over SMTP, byte for byte', async (t) => {
  const { mail } = t.context;
  const { local } = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: { 'local.port': String(mail.port) }
  });

  t.like(await probe(local), { ok: true });

  const result = await deliver(
    local,
    { from: 'sender@example.net', to: [MAILBOX] },
    createMessage('smtp delivery', 'Line one\r\nLine two')
  );
  t.deepEqual(result.accepted, [MAILBOX]);
  t.deepEqual(result.rejected, []);
  t.regex(result.response, /^250 .*queued as/);

  await waitFor(() => subjects(mail).includes('smtp delivery'));
  const stored = mail
    .readMessages()
    .find((message) => message.includes('Subject: smtp delivery'));
  t.true(stored.includes('Line one\nLine two'));
  // (a line that starts with a dot arrives as it was sent)
  t.true(stored.includes('\n.a line that starts with a dot'));
  t.regex(stored, /^Return-Path: <sender@example.net>/m);
});

postfix(
  'reports a recipient Postfix does not know as a permanent rejection',
  async (t) => {
    const { mail } = t.context;
    const { local } = loadConfig({
      directory: t.context.directory,
      env: {},
      overrides: { 'local.port': String(mail.port) }
    });
    const result = await deliver(
      local,
      { from: 'sender@example.net', to: [`nobody@${DOMAIN}`] },
      createMessage('unknown user')
    );
    t.deepEqual(result.accepted, []);
    t.is(result.rejected[0].code, 550);
    t.regex(result.rejected[0].response, /User unknown/);
    t.false(subjects(mail).includes('unknown user'));
  }
);

postfix('reports a mail server that is not there as unreachable', async (t) => {
  const { local } = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: { 'local.port': String(await getPort()) }
  });
  const result = await deliver(
    local,
    { from: 'sender@example.net', to: [MAILBOX] },
    createMessage('nowhere')
  );
  t.is(result.error.code, 'LOCAL_UNREACHABLE');
  t.like(await probe(local, 1000), { ok: false });
});

dovecot('delivers a message to Dovecot over LMTP', async (t) => {
  const { mail } = t.context;
  const { local } = loadConfig({
    directory: t.context.directory,
    env: {},
    overrides: {
      'local.port': String(mail.lmtpPort),
      'local.protocol': 'lmtp'
    }
  });
  const result = await deliver(
    local,
    { from: 'sender@example.net', to: [MAILBOX] },
    createMessage('lmtp delivery')
  );
  t.deepEqual(result.accepted, [MAILBOX]);
  await waitFor(() => subjects(mail).includes('lmtp delivery'));
});

postfix(
  'the app delivers what the API sends it into the Postfix mailbox',
  async (t) => {
    const { mail, api } = t.context;
    const app = t.context.startApp();
    await waitFor(() => app.state === 'connected');

    // What it told the API about itself
    t.like(api.hellos[0], { protocol: 1, domains: [DOMAIN], imap: true });
    t.true(app.events.some((event) => event.event === 'connected'));

    const answer = await api.deliver(createMessage('through the app'), {
      fingerprint: 'fingerprint-1'
    });
    t.deepEqual(answer.accepted, [MAILBOX]);
    t.regex(answer.response, /queued as/);
    await waitFor(() => subjects(mail).includes('through the app'));

    // A retry of the same message (its answer was lost) is not stored twice
    const again = await api.deliver(createMessage('through the app'), {
      fingerprint: 'fingerprint-1'
    });
    t.deepEqual(again.accepted, [MAILBOX]);
    t.regex(again.response, /Already delivered/);
    await delay(500);
    t.is(subjects(mail).filter((s) => s === 'through the app').length, 1);
    t.is(app.stats.delivered, 1);
    t.is(app.stats.duplicates, 1);

    // And is still remembered by an app that was restarted
    await app.stop();
    const restarted = t.context.startApp();
    await waitFor(() => restarted.state === 'connected');
    const third = await api.deliver(createMessage('through the app'), {
      fingerprint: 'fingerprint-1'
    });
    t.regex(third.response, /Already delivered/);

    // A domain the app was not set up for is refused
    const other = await api.deliver(createMessage('other domain'), {
      domain: 'other.test',
      to: ['bob@other.test']
    });
    t.is(other.error.code, 'NOT_ALLOWED');
  }
);

postfix('the app passes on Postfix refusing a recipient', async (t) => {
  const { api } = t.context;
  const app = t.context.startApp();
  await waitFor(() => app.state === 'connected');
  const answer = await api.deliver(createMessage('to nobody'), {
    to: [`nobody@${DOMAIN}`],
    fingerprint: 'fingerprint-nobody'
  });
  t.deepEqual(answer.accepted, []);
  t.is(answer.rejected[0].code, 550);
  t.is(app.stats.rejected, 1);
});

postfix('the app reconnects by itself when the connection drops', async (t) => {
  const { api, mail } = t.context;
  const app = t.context.startApp();
  await waitFor(() => app.state === 'connected');

  api.socket.terminate();
  await waitFor(() => app.state === 'connected' && api.hellos.length === 2);

  const answer = await api.deliver(createMessage('after reconnect'));
  t.deepEqual(answer.accepted, [MAILBOX]);
  await waitFor(() => subjects(mail).includes('after reconnect'));
});

postfix(
  'the app defers mail and reports it while Postfix is down, then recovers',
  async (t) => {
    const { api, mail } = t.context;
    const app = t.context.startApp({
      'probe.interval': '300',
      'probe.timeout': '1000'
    });
    await waitFor(() => app.state === 'connected');

    mail.stopPostfix();
    try {
      const answer = await api.deliver(createMessage('while down'), {
        fingerprint: 'fingerprint-down'
      });
      t.is(answer.error.code, 'LOCAL_UNREACHABLE');
      t.is(app.stats.deferred, 1);
      await waitFor(() =>
        api.statuses.some((status) => status.local === 'down')
      );
      t.true(app.events.some((event) => event.event === 'local_down'));
      t.like(JSON.parse(fs.readFileSync(app.statusFile, 'utf8')), {
        state: 'connected'
      });
    } finally {
      await mail.startPostfix();
    }

    // The probe notices that it is back, and the retried message arrives
    await waitFor(() => api.statuses.at(-1).local === 'up');
    t.true(app.events.some((event) => event.event === 'local_up'));
    const answer = await api.deliver(createMessage('while down'), {
      fingerprint: 'fingerprint-down'
    });
    t.deepEqual(answer.accepted, [MAILBOX]);
    await waitFor(() => subjects(mail).includes('while down'));
  }
);

dovecot(
  'the app reads and changes the Dovecot mailbox over IMAP',
  async (t) => {
    const { api, mail } = t.context;
    const app = t.context.startApp();
    await waitFor(() => app.state === 'connected');

    await api.deliver(createMessage('for imap', 'The body to download'), {
      fingerprint: 'fingerprint-imap'
    });
    await waitFor(() => subjects(mail).includes('for imap'));

    const list = await api.imap('list');
    t.true(list.data.some((folder) => folder.path === 'INBOX'));

    const status = await api.imap('status', { path: 'INBOX' });
    t.true(status.data.messages >= 1);

    const search = await api.imap('search', {
      path: 'INBOX',
      query: { subject: 'for imap' }
    });
    t.is(search.data.uids.length, 1);
    const [uid] = search.data.uids;

    const fetched = await api.imap('fetch', {
      path: 'INBOX',
      range: String(uid)
    });
    t.is(fetched.data.messages[0].envelope.subject, 'for imap');
    t.is(
      fetched.data.messages[0].envelope.from[0].address,
      'sender@example.net'
    );

    const download = await api.imap('download', { path: 'INBOX', uid });
    t.true(
      Buffer.from(download.data.content, 'base64')
        .toString()
        .includes('The body to download')
    );

    await api.imap('flags', {
      path: 'INBOX',
      range: String(uid),
      add: ['\\Seen']
    });
    const seen = await api.imap('fetch', { path: 'INBOX', range: String(uid) });
    t.true(seen.data.messages[0].flags.includes('\\Seen'));

    await api.imap('mailboxCreate', { path: 'Archive' });
    await api.imap('move', {
      path: 'INBOX',
      range: String(uid),
      destination: 'Archive'
    });
    const archived = await api.imap('search', {
      path: 'Archive',
      query: { subject: 'for imap' }
    });
    t.is(archived.data.uids.length, 1);

    // A wrong password is refused by Dovecot and says so
    const denied = await api.imap('list', {}, { user: MAILBOX, pass: 'wrong' });
    t.is(denied.error.code, 'AUTH');
    t.not(PASSWORD, 'wrong');
  }
);

dovecot('the app honors read-only and allowed IMAP commands', async (t) => {
  const { api } = t.context;
  const app = t.context.startApp({
    'imap.readOnly': 'true',
    'imap.allowedCommands': 'list,status,delete'
  });
  await waitFor(() => app.state === 'connected');

  t.truthy((await api.imap('list')).data);
  t.is((await api.imap('search', { path: 'INBOX' })).error.code, 'NOT_ALLOWED');
  t.is(
    (await api.imap('delete', { path: 'INBOX', range: '1' })).error.code,
    'READ_ONLY'
  );

  // And nothing when remote mailbox access is off
  await app.stop();
  const off = t.context.startApp({ 'imap.enabled': 'false' });
  await waitFor(() => off.state === 'connected');
  t.is((await api.imap('list')).error.code, 'IMAP_DISABLED');
  t.truthy(path.isAbsolute(off.statusFile));
});
