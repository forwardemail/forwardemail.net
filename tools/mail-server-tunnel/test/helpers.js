/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

import { WebSocketServer } from 'ws';

export const DOMAIN = 'tunnel.test';
export const MAILBOX = `alice@${DOMAIN}`;
export const PASSWORD = 'correct-horse-battery-staple';

function has(command) {
  return spawnSync('which', [command]).status === 0;
}

const isRoot = typeof process.getuid === 'function' && process.getuid() === 0;

// A real Postfix can only be started by root (as on CI, see the workflow)
export const hasPostfix = isRoot && has('postfix') && has('postconf');
export const hasDovecot = hasPostfix && has('dovecot');

export function getPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

export async function waitFor(fn, timeout = 15_000, interval = 50) {
  const deadline = Date.now() + timeout;
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() > deadline) throw new Error('Timed out waiting');
    await delay(interval);
  }
}

async function waitForPort(port) {
  await waitFor(
    () =>
      new Promise((resolve) => {
        const socket = net.connect(port, '127.0.0.1');
        socket.once('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.once('error', () => resolve(false));
      })
  );
}

function getIds(user) {
  return {
    uid: Number(execFileSync('id', ['-u', user]).toString().trim()),
    gid: Number(execFileSync('id', ['-g', user]).toString().trim())
  };
}

const MASTER_SERVICES = `
postlog   unix-dgram n  -       n       -       1       postlogd
pickup    unix  n       -       n       60      1       pickup
cleanup   unix  n       -       n       -       0       cleanup
qmgr      unix  n       -       n       300     1       qmgr
rewrite   unix  -       -       n       -       -       trivial-rewrite
bounce    unix  -       -       n       -       0       bounce
defer     unix  -       -       n       -       0       bounce
trace     unix  -       -       n       -       0       bounce
verify    unix  -       -       n       -       1       verify
flush     unix  n       -       n       1000?   0       flush
proxymap  unix  -       -       n       -       -       proxymap
proxywrite unix -       -       n       -       1       proxymap
smtp      unix  -       -       n       -       -       smtp
relay     unix  -       -       n       -       -       smtp
error     unix  -       -       n       -       -       error
retry     unix  -       -       n       -       -       error
discard   unix  -       -       n       -       -       discard
local     unix  -       n       n       -       -       local
virtual   unix  -       n       n       -       -       virtual
lmtp      unix  -       -       n       -       -       lmtp
anvil     unix  -       -       n       -       1       anvil
scache    unix  -       -       n       -       1       scache
tlsmgr    unix  -       -       n       1000?   1       tlsmgr
`;

//
// Starts a Postfix of its own (config, queue and mailboxes in a temporary
// directory) that accepts mail for alice@tunnel.test on a local port and
// stores it in a Maildir, and optionally a Dovecot that serves that Maildir
// over IMAP and accepts mail over LMTP.
//
export async function startMailServer({ dovecot = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mst-mail-'));
  // (Postfix refuses a queue directory below one that others cannot enter)
  fs.chmodSync(root, 0o755);
  const directory = (name) => {
    const full = path.join(root, name);
    fs.mkdirSync(full, { recursive: true });
    return full;
  };

  const conf = directory('conf');
  const queue = directory('queue');
  const data = directory('data');
  const vmail = directory('vmail');
  const port = await getPort();
  const mail = getIds('mail');
  const postconf = (name) =>
    execFileSync('postconf', ['-h', name]).toString().trim();

  fs.writeFileSync(
    path.join(conf, 'main.cf'),
    `compatibility_level = 3.6
queue_directory = ${queue}
data_directory = ${data}
command_directory = ${postconf('command_directory')}
daemon_directory = ${postconf('daemon_directory')}
mail_owner = ${postconf('mail_owner')}
setgid_group = ${postconf('setgid_group')}
inet_interfaces = 127.0.0.1
inet_protocols = ipv4
myhostname = mail.${DOMAIN}
mydestination =
mynetworks = 127.0.0.0/8
virtual_mailbox_domains = ${DOMAIN}
virtual_mailbox_base = ${vmail}
virtual_mailbox_maps = texthash:${path.join(conf, 'vmailbox')}
virtual_uid_maps = static:${mail.uid}
virtual_gid_maps = static:${mail.gid}
virtual_minimum_uid = 1
smtpd_recipient_restrictions = permit_mynetworks, reject_unauth_destination
maillog_file_prefixes = ${root}
maillog_file = ${path.join(root, 'postfix.log')}
alias_maps =
alias_database =
`
  );
  fs.writeFileSync(
    path.join(conf, 'master.cf'),
    `127.0.0.1:${port} inet n - n - - smtpd\n${MASTER_SERVICES}`
  );
  fs.writeFileSync(
    path.join(conf, 'vmailbox'),
    `${MAILBOX} ${DOMAIN}/alice/\n`
  );
  execFileSync('chown', ['-R', 'mail:mail', vmail]);
  execFileSync('chown', [postconf('mail_owner'), data]);

  const postfix = (...args) =>
    spawnSync('postfix', ['-c', conf, ...args], { encoding: 'utf8' });
  const started = postfix('start');
  if (started.status !== 0)
    throw new Error(`Postfix did not start: ${started.stderr}`);
  await waitForPort(port);

  const maildir = path.join(vmail, DOMAIN, 'alice');
  const server = {
    root,
    port,
    maildir,
    isStopped: false,
    // The messages delivered to alice's mailbox so far
    readMessages() {
      const messages = [];
      for (const folder of ['new', 'cur']) {
        const full = path.join(maildir, folder);
        if (!fs.existsSync(full)) continue;
        for (const name of fs.readdirSync(full))
          messages.push(fs.readFileSync(path.join(full, name), 'utf8'));
      }

      return messages;
    },
    stopPostfix() {
      postfix('stop');
    },
    async startPostfix() {
      const result = postfix('start');
      if (result.status !== 0)
        throw new Error(`Postfix did not start: ${result.stderr}`);
      await waitForPort(port);
    },
    stop() {
      if (server.isStopped) return;
      server.isStopped = true;
      postfix('stop');
      if (server.dovecotConf)
        spawnSync('doveadm', ['-c', server.dovecotConf, 'stop']);
      fs.rmSync(root, { recursive: true, force: true });
    }
  };

  if (dovecot) {
    const imapPort = await getPort();
    const lmtpPort = await getPort();
    const run = directory('dovecot-run');
    const dovecotConf = path.join(conf, 'dovecot.conf');
    fs.writeFileSync(
      path.join(conf, 'passwd'),
      `${MAILBOX}:{PLAIN}${PASSWORD}\n`
    );
    fs.writeFileSync(
      dovecotConf,
      `base_dir = ${run}
state_dir = ${run}
log_path = ${path.join(root, 'dovecot.log')}
protocols = imap lmtp
listen = 127.0.0.1
ssl = no
disable_plaintext_auth = no
auth_mechanisms = plain login
mail_location = maildir:${vmail}/%d/%n
first_valid_uid = 1
first_valid_gid = 1
default_internal_user = dovecot
default_login_user = dovenull
passdb {
  driver = passwd-file
  args = ${path.join(conf, 'passwd')}
}
userdb {
  driver = static
  args = uid=${mail.uid} gid=${mail.gid} home=${vmail}/%d/%n
}
service imap-login {
  inet_listener imap {
    port = ${imapPort}
  }
  inet_listener imaps {
    port = 0
  }
}
service lmtp {
  inet_listener lmtp {
    address = 127.0.0.1
    port = ${lmtpPort}
  }
}
service anvil {
  chroot =
}
service imap-login {
  chroot =
}
`
    );
    // (its daemon keeps the output open, so none is read)
    const result = spawnSync('dovecot', ['-c', dovecotConf], {
      stdio: 'ignore'
    });
    if (result.status !== 0) {
      server.stop();
      throw new Error('Dovecot did not start');
    }

    await waitForPort(imapPort);
    await waitForPort(lmtpPort);
    server.dovecotConf = dovecotConf;
    server.imapPort = imapPort;
    server.lmtpPort = lmtpPort;
  }

  return server;
}

// A message as the MX server hands it to the tunnel
export function createMessage(subject, body = 'Hello through the tunnel') {
  return Buffer.from(
    [
      'From: Sender <sender@example.net>',
      `To: ${MAILBOX}`,
      `Subject: ${subject}`,
      `Message-ID: <${Date.now()}.${Math.random()}@example.net>`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
      '.a line that starts with a dot',
      ''
    ].join('\r\n')
  );
}

//
// The API's side of the tunnel protocol (see
// helpers/tunnel-websocket-handler.js in the repository), enough of it for
// the app to be tested without the Forward Email API.
//
export async function startFakeApi(options = {}) {
  const port = await getPort();
  const wss = new WebSocketServer({ port, host: '127.0.0.1' });
  const api = {
    port,
    url: `http://127.0.0.1:${port}`,
    token: options.token || 'a'.repeat(40),
    connections: [],
    hellos: [],
    statuses: [],
    pending: new Map(),
    nextId: 0,
    // What the next connection is answered with instead of "ready"
    refuseWith: null,
    get socket() {
      return api.connections.at(-1);
    },
    // Sends a request to the app and resolves with its answer
    request(header, body = Buffer.alloc(0)) {
      const id = `request-${++api.nextId}`;
      const json = Buffer.from(JSON.stringify({ ...header, id }));
      const length = Buffer.alloc(4);
      length.writeUInt32BE(json.length);
      return new Promise((resolve) => {
        api.pending.set(id, resolve);
        api.socket.send(Buffer.concat([length, json, body]), { binary: true });
      });
    },
    deliver(raw, extra = {}) {
      return api.request(
        {
          event: 'deliver',
          domain: DOMAIN,
          from: 'sender@example.net',
          to: [MAILBOX],
          ...extra
        },
        raw
      );
    },
    imap(command, args = {}, auth = undefined) {
      auth ||= { user: MAILBOX, pass: PASSWORD };
      return api.request({
        event: 'imap',
        domain: DOMAIN,
        command,
        args,
        auth
      });
    },
    close() {
      for (const ws of wss.clients) ws.terminate();
      return new Promise((resolve) => {
        wss.close(resolve);
      });
    }
  };

  wss.on('connection', (ws, request) => {
    const expected = `Basic ${Buffer.from(`${api.token}:`).toString('base64')}`;
    ws.isAuthorized = request.headers.authorization === expected;
    api.connections.push(ws);
    ws.on('message', (data, isBinary) => {
      if (isBinary) return;
      const message = JSON.parse(data.toString());
      switch (message.event) {
        case 'hello': {
          api.hellos.push(message);
          if (api.refuseWith) {
            const { code, closeCode, rejected } = api.refuseWith;
            ws.send(JSON.stringify({ event: 'error', code, rejected }));
            ws.close(closeCode, code);
            return;
          }

          ws.send(
            JSON.stringify({
              event: 'ready',
              protocol: 1,
              domains: message.domains.map((name) => ({ name, id: name })),
              rejected: [],
              heartbeat: 20_000
            })
          );

          break;
        }

        case 'result': {
          const resolve = api.pending.get(message.id);
          api.pending.delete(message.id);
          if (resolve) resolve(message);

          break;
        }

        case 'status': {
          api.statuses.push(message);

          break;
        }
        // No default
      }
    });
  });

  // (the API answers 401 to the handshake of a token it does not know)
  wss.options.verifyClient = (info, done) => {
    const expected = `Basic ${Buffer.from(`${api.token}:`).toString('base64')}`;
    if (info.req.headers.authorization === expected) done(true);
    else done(false, 401, 'Unauthorized');
  };

  return api;
}

// A logger that records what is logged
export function createTestLogger() {
  const lines = [];
  const log = (level) => (message, meta) =>
    lines.push({ level, message, meta });
  return {
    lines,
    debug: log('debug'),
    info: log('info'),
    warn: log('warn'),
    error: log('error')
  };
}

export function createTemporaryDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'mst-test-'));
}
