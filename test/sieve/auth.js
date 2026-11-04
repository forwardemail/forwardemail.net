/* eslint-disable ava/no-ignored-test-files */
/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * ManageSieve Authentication Tests with SQLite Infrastructure
 * Tests authentication, domain-wide alias blocking, and session handling
 */

const { Buffer } = require('node:buffer');
const { execFileSync } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const tls = require('node:tls');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const ManageSieveServer = require('../../managesieve-server');
const config = require('#config');
const env = require('#config/env');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const createPassword = require('#helpers/create-password');
const { encrypt } = require('#helpers/encrypt-decrypt');

// Dynamically import get-port
let getPort;
import('get-port').then((object) => {
  getPort = object.default;
});

const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  await utils.setupRedisClient(t);

  if (!getPort) {
    await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  }

  const port = await getPort();
  const sqlitePort = await getPort();

  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);

  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  await wsp.open();
  t.context.wsp = wsp;

  const managesieve = new ManageSieveServer({
    client: t.context.client,
    subscriber: t.context.subscriber,
    wsp,
    secure: false
  });
  t.context.port = port;
  t.context.server = await managesieve.listen(port);
  t.context.managesieve = managesieve;

  // Create user with enhanced_protection plan
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  t.context.user = await user.save();

  // Create domain
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: managesieve.resolver,
      has_smtp: true,
      has_txt_record: true,
      skip_verification: true
    })
    .create();

  t.context.domain = domain;

  // Create regular alias (not catch-all)
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.pass = pass;
  t.context.alias = await alias.save();

  // Spoof session
  t.context.session = {
    user: {
      id: alias.id,
      username: `${alias.name}@${domain.name}`,
      alias_id: alias.id,
      alias_name: alias.name,
      domain_id: domain.id,
      domain_name: domain.name,
      password: encrypt(pass),
      storage_location: alias.storage_location,
      alias_has_pgp: alias.has_pgp,
      alias_public_key: alias.public_key,
      locale: 'en',
      owner_full_email: `${alias.name}@${domain.name}`
    },
    remoteAddress: IP_ADDRESS
  };

  // Spoof DNS records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    managesieve.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );

  // Store spoofed dns cache
  await managesieve.resolver.options.cache.mset(map);
});

test.afterEach(async (t) => {
  await t.context.managesieve.close();
  await t.context.wsp.close();
  await t.context.sqlite.close();
});

/**
 * Helper to create a ManageSieve client connection
 */
function createClient(port) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ port, host: '127.0.0.1' }, () => {
      const responses = [];
      let buffer = '';

      client.on('data', (data) => {
        buffer += data.toString();
        if (buffer.includes('\r\n')) {
          const lines = buffer.split('\r\n');
          buffer = lines.pop();
          responses.push(...lines.filter(Boolean));
        }
      });

      client.sendCommand = (cmd) =>
        new Promise((res) => {
          responses.length = 0;
          client.write(cmd + '\r\n');
          setTimeout(() => res([...responses]), 1000);
        });

      client.waitForGreeting = () =>
        new Promise((res) => {
          setTimeout(() => res([...responses]), 1000);
        });

      resolve(client);
    });

    client.on('error', reject);
  });
}

test('should send greeting on connect', async (t) => {
  const client = await createClient(t.context.port);
  const greeting = await client.waitForGreeting();

  t.true(greeting.length > 0);
  t.true(greeting.some((line) => line.includes('IMPLEMENTATION')));
  t.true(greeting.some((line) => line.includes('SIEVE')));
  t.true(greeting.some((line) => line.startsWith('OK')));

  client.end();
});

test('should advertise SASL PLAIN mechanism', async (t) => {
  const client = await createClient(t.context.port);
  const greeting = await client.waitForGreeting();

  t.true(
    greeting.some((line) => line.includes('SASL') && line.includes('PLAIN'))
  );

  client.end();
});

test('should authenticate with valid credentials', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Send AUTHENTICATE PLAIN with base64 encoded credentials
  // Format: \0username\0password
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  t.true(response.some((line) => line.startsWith('OK')));

  client.end();
});

test('should reject invalid credentials', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from('\0baduser@example.com\0badpass').toString(
    'base64'
  );
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should reject empty password', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0`
  ).toString('base64');
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should reject unsupported SASL mechanism', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('AUTHENTICATE "CRAM-MD5"');

  t.true(response.some((line) => line.startsWith('NO')));
  t.true(response.some((line) => line.includes('Unsupported')));

  client.end();
});

test('should prevent domain-wide alias authentication', async (t) => {
  // Try to authenticate with a catch-all pattern - should be rejected
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Use a fake password with catch-all pattern
  const credentials = Buffer.from(
    `\0*@${t.context.domain.name}\0fakepassword`
  ).toString('base64');
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  // Should be rejected (either because catch-all can't auth or invalid credentials)
  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should reject a domain-wide catch-all password for an existing alias', async (t) => {
  const { domain, alias } = t.context;
  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: t.context.user._id
  });
  domain.locale = 'en';
  domain.resolver = t.context.managesieve.resolver;
  domain.skip_verification = true;
  await domain.save();

  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // the catch-all password is for outbound SMTP only and must never open
  // the alias (its SQLite mailbox and Sieve scripts)
  const credentials = Buffer.from(
    `\0${alias.name}@${domain.name}\0${password}`
  ).toString('base64');
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  t.true(response.some((line) => line.startsWith('NO')));
  t.false(response.some((line) => line.startsWith('OK')));
  // the same uniform failure as any wrong password
  t.true(
    response.some((line) => line.includes('Invalid username or password'))
  );

  // and the session stays unauthenticated
  const list = await client.sendCommand('LISTSCRIPTS');
  t.true(list.some((line) => line.includes('Not authenticated')));

  client.end();
});

test('should prevent domain-wide password authentication', async (t) => {
  const { domain } = t.context;
  const { password, salt, hash } = await createPassword();
  domain.tokens.push({
    description: 'test',
    salt,
    hash,
    user: t.context.user._id
  });
  domain.locale = 'en';
  domain.resolver = t.context.managesieve.resolver;
  domain.skip_verification = true;
  await domain.save();

  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0test@${domain.name}\0${password}`
  ).toString('base64');
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should require authentication for LISTSCRIPTS', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('LISTSCRIPTS');

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should require authentication for PUTSCRIPT', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const script = 'keep;';
  const response = await client.sendCommand(
    `PUTSCRIPT "test" {${script.length}+}\r\n${script}`
  );

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should require authentication for GETSCRIPT', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('GETSCRIPT "test"');

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should require authentication for SETACTIVE', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('SETACTIVE "test"');

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should require authentication for DELETESCRIPT', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('DELETESCRIPT "test"');

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should allow CAPABILITY without authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('CAPABILITY');

  t.true(response.some((line) => line.startsWith('OK')));
  t.true(response.some((line) => line.includes('IMPLEMENTATION')));

  client.end();
});

test('should allow LOGOUT without authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('LOGOUT');

  t.true(response.some((line) => line.startsWith('OK')));

  client.end();
});

test('should allow NOOP without authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('NOOP');

  t.true(response.some((line) => line.startsWith('OK')));

  client.end();
});

test('should reject already authenticated user', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // First authentication
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Second authentication attempt
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );

  t.true(response.some((line) => line.startsWith('NO')));
  t.true(response.some((line) => line.includes('Already authenticated')));

  client.end();
});

test('should list scripts after authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  const response = await client.sendCommand('LISTSCRIPTS');

  t.true(response.some((line) => line.startsWith('OK')));

  client.end();
});

test('should put and get script after authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Put a script
  const script =
    'require "fileinto"; if header :contains "subject" "test" { fileinto "Test"; }';
  const putResponse = await client.sendCommand(
    `PUTSCRIPT "my-filter" {${script.length}+}\r\n${script}`
  );

  t.true(putResponse.some((line) => line.startsWith('OK')));

  // Get the script
  const getResponse = await client.sendCommand('GETSCRIPT "my-filter"');

  t.true(getResponse.some((line) => line.includes('fileinto')));
  t.true(getResponse.some((line) => line.startsWith('OK')));

  client.end();
});

test('should set script as active after authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Put a script
  const script = 'keep;';
  await client.sendCommand(
    `PUTSCRIPT "my-script" {${script.length}+}\r\n${script}`
  );

  // Set active
  const response = await client.sendCommand('SETACTIVE "my-script"');

  t.true(response.some((line) => line.startsWith('OK')));

  // Verify in list
  const listResponse = await client.sendCommand('LISTSCRIPTS');

  t.true(
    listResponse.some(
      (line) => line.includes('my-script') && line.includes('ACTIVE')
    )
  );

  client.end();
});

test('should reject invalid script syntax', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Put an invalid script
  const script = 'this is not valid sieve syntax {{{';
  const response = await client.sendCommand(
    `PUTSCRIPT "bad-filter" {${script.length}+}\r\n${script}`
  );

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should check script syntax with CHECKSCRIPT', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Check valid script
  const validScript = 'keep;';
  const validResponse = await client.sendCommand(
    `CHECKSCRIPT {${validScript.length}+}\r\n${validScript}`
  );

  t.true(validResponse.some((line) => line.startsWith('OK')));

  // Check invalid script
  const invalidScript = 'invalid syntax {{{';
  const invalidResponse = await client.sendCommand(
    `CHECKSCRIPT {${invalidScript.length}+}\r\n${invalidScript}`
  );

  t.true(invalidResponse.some((line) => line.startsWith('NO')));

  client.end();
});

test('should delete script after authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Put a script
  const script = 'keep;';
  await client.sendCommand(
    `PUTSCRIPT "to-delete" {${script.length}+}\r\n${script}`
  );

  // Delete the script
  const response = await client.sendCommand('DELETESCRIPT "to-delete"');

  t.true(response.some((line) => line.startsWith('OK')));

  // Verify it's gone
  const getResponse = await client.sendCommand('GETSCRIPT "to-delete"');

  t.true(getResponse.some((line) => line.startsWith('NO')));

  client.end();
});

test('should rename script after authentication', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Put a script
  const script = 'keep;';
  await client.sendCommand(
    `PUTSCRIPT "old-name" {${script.length}+}\r\n${script}`
  );

  // Rename the script
  const response = await client.sendCommand(
    'RENAMESCRIPT "old-name" "new-name"'
  );

  t.true(response.some((line) => line.startsWith('OK')));

  // Verify old name is gone
  const oldResponse = await client.sendCommand('GETSCRIPT "old-name"');
  t.true(oldResponse.some((line) => line.startsWith('NO')));

  // Verify new name exists
  const newResponse = await client.sendCommand('GETSCRIPT "new-name"');
  t.true(newResponse.some((line) => line.startsWith('OK')));

  client.end();
});

test('should check quota with HAVESPACE', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Check space for small script
  const response = await client.sendCommand('HAVESPACE "test" 1024');

  t.true(response.some((line) => line.startsWith('OK')));

  client.end();
});

test('should reject script exceeding max size', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // Authenticate
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // Check space for very large script (2MB)
  const response = await client.sendCommand('HAVESPACE "test" 2097152');

  t.true(response.some((line) => line.startsWith('NO')));

  client.end();
});

test('should handle unknown command', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const response = await client.sendCommand('UNKNOWNCOMMAND');

  t.true(response.some((line) => line.startsWith('NO')));
  t.true(response.some((line) => line.includes('Unknown command')));

  client.end();
});

test('should handle malformed command', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  await client.sendCommand('');

  // Empty command should be ignored or return error
  t.pass();

  client.end();
});

//
// STARTTLS listener (RFC 5804 Section 2.1): credentials are only accepted
// once STARTTLS has completed
//

// a self-signed certificate for a ManageSieve server with TLS available
function createCertificate() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'managesieve-tls-'));
  const keyPath = path.join(dir, 'key.pem');
  const certPath = path.join(dir, 'cert.pem');
  execFileSync(
    'openssl',
    [
      'req',
      '-new',
      '-newkey',
      'rsa:2048',
      '-days',
      '1',
      '-nodes',
      '-x509',
      '-keyout',
      keyPath,
      '-out',
      certPath,
      '-subj',
      '/CN=localhost'
    ],
    { stdio: 'ignore' }
  );
  return { dir, keyPath, certPath };
}

// the STARTTLS listener as run by `managesieve-starttls.js` (secure: false)
async function createStartTLSServer(t) {
  const certificate = createCertificate();
  const previous = {
    WEB_SSL_KEY_PATH: env.WEB_SSL_KEY_PATH,
    WEB_SSL_CERT_PATH: env.WEB_SSL_CERT_PATH,
    WEB_SSL_CA_PATH: env.WEB_SSL_CA_PATH
  };
  env.WEB_SSL_KEY_PATH = certificate.keyPath;
  env.WEB_SSL_CERT_PATH = certificate.certPath;
  env.WEB_SSL_CA_PATH = '';
  let server;
  try {
    server = new ManageSieveServer({
      client: t.context.client,
      subscriber: t.context.subscriber,
      wsp: t.context.wsp,
      secure: false
    });
  } finally {
    Object.assign(env, previous);
    fs.rmSync(certificate.dir, { recursive: true, force: true });
  }

  // share the spoofed DNS records of the domain
  server.resolver = t.context.managesieve.resolver;
  const port = await getPort();
  await server.listen(port);
  t.teardown(() => server.close());
  return port;
}

// line-based reader over a plain or TLS socket
function readLines(socket) {
  const lines = [];
  let buffer = '';
  socket.on('data', (data) => {
    buffer += data.toString();
    const parts = buffer.split('\r\n');
    buffer = parts.pop();
    lines.push(...parts.filter(Boolean));
  });
  return {
    async send(cmd) {
      lines.length = 0;
      socket.write(cmd + '\r\n');
      await delay(1000);
      return [...lines];
    },
    async wait() {
      await delay(1000);
      const result = [...lines];
      lines.length = 0;
      return result;
    }
  };
}

test('STARTTLS listener advertises no SASL mechanisms before TLS', async (t) => {
  const port = await createStartTLSServer(t);
  const socket = net.createConnection({ port, host: '127.0.0.1' });
  t.teardown(() => socket.destroy());
  const reader = readLines(socket);

  const greeting = await reader.wait();
  t.true(greeting.includes('"STARTTLS"'));
  t.true(greeting.includes('"SASL" ""'));
  t.false(greeting.some((line) => line.includes('PLAIN')));

  const capability = await reader.send('CAPABILITY');
  t.true(capability.includes('"SASL" ""'));
  t.false(capability.some((line) => line.includes('PLAIN')));
});

test('STARTTLS listener refuses AUTHENTICATE before STARTTLS', async (t) => {
  const port = await createStartTLSServer(t);
  const socket = net.createConnection({ port, host: '127.0.0.1' });
  t.teardown(() => socket.destroy());
  const reader = readLines(socket);
  await reader.wait();

  // valid credentials are still refused in the clear
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  const response = await reader.send(`AUTHENTICATE "PLAIN" "${credentials}"`);
  t.true(response.some((line) => line.startsWith('NO (ENCRYPT-NEEDED)')));
  t.false(response.some((line) => line.startsWith('OK')));

  // (also without an initial response: no SASL continuation is offered)
  const continuation = await reader.send('AUTHENTICATE "PLAIN"');
  t.true(continuation.some((line) => line.startsWith('NO (ENCRYPT-NEEDED)')));
  t.false(continuation.includes('""'));

  // (and a literal initial response is consumed, not run as a command)
  const literal = await reader.send(
    `AUTHENTICATE "PLAIN" {${credentials.length}+}\r\n${credentials}`
  );
  t.deepEqual(literal, [
    'NO (ENCRYPT-NEEDED) "Issue STARTTLS before authenticating"'
  ]);

  const list = await reader.send('LISTSCRIPTS');
  t.true(list.some((line) => line.includes('Not authenticated')));
});

test('STARTTLS listener accepts AUTHENTICATE after STARTTLS', async (t) => {
  const port = await createStartTLSServer(t);
  const socket = net.createConnection({ port, host: '127.0.0.1' });
  t.teardown(() => socket.destroy());
  const reader = readLines(socket);
  await reader.wait();

  const starttls = await reader.send('STARTTLS');
  t.true(starttls.some((line) => line.startsWith('OK')));
  socket.removeAllListeners('data');

  const secureSocket = tls.connect({ socket, rejectUnauthorized: false });
  t.teardown(() => secureSocket.destroy());
  await once(secureSocket, 'secureConnect');
  const secureReader = readLines(secureSocket);

  // capabilities are re-issued over TLS, now with the SASL mechanisms
  const capabilities = await secureReader.wait();
  t.true(capabilities.includes('"SASL" "PLAIN"'));
  t.false(capabilities.includes('"STARTTLS"'));

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  const response = await secureReader.send(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );
  t.true(response.some((line) => line.startsWith('OK')));

  const list = await secureReader.send('LISTSCRIPTS');
  t.true(list.some((line) => line.startsWith('OK')));
});

//
// Data from a client is limited as it arrives, also while the connection
// check (reverse DNS and so on, which can take a while) is still running,
// so an unauthenticated client cannot make the server buffer without limit.
//
test('limits buffered data while the connection check is still running', async (t) => {
  const { managesieve, port } = t.context;
  // (the reverse DNS lookup of the connection check never answers)
  const { reverse } = managesieve.resolver;
  managesieve.resolver.reverse = () => new Promise(() => {});
  t.teardown(() => {
    managesieve.resolver.reverse = reverse;
  });

  const socket = net.connect(port, '127.0.0.1');
  await once(socket, 'connect');
  socket.on('data', () => {});
  const closed = once(socket, 'close');
  const chunk = Buffer.alloc(64 * 1024, 'a');
  let sent = 0;
  const limit = config.sieve.maxScriptSize + 4096;
  while (!socket.destroyed && sent < limit * 4) {
    socket.write(chunk);
    sent += chunk.length;

    await delay(1);
  }

  await Promise.race([closed, delay(5000)]);
  t.true(socket.destroyed || socket.readyState === 'closed');
  for (const session of managesieve.connections) {
    t.true(session.buffer.length <= limit);
  }
});

//
// Commands on one connection run one at a time: a PUTSCRIPT that arrived
// while the one before was still checking the script count used to run
// alongside it (passing the same count check, and reading the script of
// the one before as a command).
//
test('pipelined PUTSCRIPT commands keep to the script limit', async (t) => {
  t.context.managesieve.maxScriptCount = 2;
  const client = await createClient(t.context.port);
  await client.waitForGreeting();
  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  const script = 'keep;';
  for (let i = 0; i < 6; i++) {
    client.write(`PUTSCRIPT "pipelined-${i}" {${script.length}+}\r\n`);
    // (each in a TCP write of its own)

    await delay(5);
    client.write(`${script}\r\n`);

    await delay(5);
  }

  const listed = await client.sendCommand('LISTSCRIPTS');
  client.end();

  const names = listed.filter((line) => line.includes('pipelined-'));
  t.is(names.length, 2);
  t.true(names[0].includes('pipelined-0'));
  t.true(names[1].includes('pipelined-1'));
});

//
// CHECKSCRIPT and PUTSCRIPT check what saving and running the script check:
// a capability the script uses without "require" is refused (it used to be
// reported valid, then refused when the script was saved or run)
//
test('should refuse a script that uses a capability it does not require', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  const script =
    'require "fileinto"; if address :detail "to" "x" { fileinto "X"; }';
  for (const command of ['CHECKSCRIPT', 'PUTSCRIPT "detail"']) {
    const response = await client.sendCommand(
      `${command} {${script.length}+}\r\n${script}`
    );
    t.true(
      response.some((line) => line.startsWith('NO')),
      `${command}: ${response.join(' ')}`
    );
  }

  client.end();
});

//
// A literal's size is in octets (RFC 5804 section 4): a script with
// non-ASCII text (a folder named "Büro") is read whole, even when a
// character arrives split across two packets
//
test('should read a script with non-ASCII text by its size in octets', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  const script = 'require "fileinto"; fileinto "Büro/Rechnungen";';
  const data = Buffer.from(
    `PUTSCRIPT "buero" {${Buffer.byteLength(script)}+}\r\n${script}\r\n`
  );
  // (split inside the two octets of "ü")
  const split = data.indexOf(Buffer.from('ü')) + 1;
  client.write(data.subarray(0, split));
  await delay(200);
  client.write(data.subarray(split));
  await delay(1000);

  // (nothing of the script was left to be read as a command)
  const noop = await client.sendCommand('NOOP');
  t.true(
    noop.some((line) => line.startsWith('OK')),
    `NOOP: ${noop.join(' ')}`
  );

  const get = await client.sendCommand('GETSCRIPT "buero"');
  t.true(get.includes(script), `GETSCRIPT: ${get.join(' ')}`);

  client.end();
});

//
// A script that arrives in many packets is read whole and in order (the
// packets of a literal are joined once all of it arrived)
//
test('should read a script that arrives in many packets', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  const script = `require "fileinto";\n${Array.from(
    { length: 20 },
    (_, i) => `if header :contains "subject" "ü${i}" { fileinto "F${i}"; }`
  ).join('\n')}`;
  const literal = Buffer.from(`${script}\r\n`);
  client.write(`PUTSCRIPT "packets" {${Buffer.byteLength(script)}+}\r\n`);
  for (let i = 0; i < literal.length; i += 50) {
    await delay(5);
    client.write(literal.subarray(i, i + 50));
  }

  await delay(1000);

  const noop = await client.sendCommand('NOOP');
  t.true(
    noop.some((line) => line.startsWith('OK')),
    `NOOP: ${noop.join(' ')}`
  );

  const get = await client.sendCommand('GETSCRIPT "packets"');
  t.true(
    get.join('\n').includes('fileinto "F19"'),
    `GETSCRIPT: ${get.join(' ')}`
  );
  t.true(get.join('\n').includes('"ü0"'));

  client.end();
});

//
// A refused PUTSCRIPT still reads its script (the client sends it without
// waiting), so no line of it is read as a command
//
test('should not read the script of a refused PUTSCRIPT as commands', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  const script = 'keep;\r\nkeep;';
  const response = await client.sendCommand(
    `PUTSCRIPT "bad name" {${script.length}+}\r\n${script}\r\nNOOP`
  );
  t.deepEqual(
    response.map((line) => line.split(' ')[0]),
    ['NO', 'OK'],
    `${response.join(' ')}`
  );

  client.end();
});

//
// A script over the size limit is refused, and still read (the client sends
// it without waiting): its lines were read as commands, each answered
//
for (const command of ['PUTSCRIPT "big"', 'CHECKSCRIPT']) {
  test(`should not read a script too large for ${
    command.split(' ')[0]
  } as commands`, async (t) => {
    const client = await createClient(t.context.port);
    await client.waitForGreeting();

    const credentials = Buffer.from(
      `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
    ).toString('base64');
    await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

    const script = 'keep;\r\n'.repeat(
      Math.ceil((config.sieve.maxScriptSize + 1) / 7)
    );
    const response = await client.sendCommand(
      `${command} {${script.length}+}\r\n${script}\r\nNOOP`
    );
    t.deepEqual(
      response.map((line) => line.split(' ')[0]),
      ['NO', 'OK'],
      `${response.slice(0, 5).join(' ')}`
    );

    client.end();
  });
}

test('should not let a syntax error start a response line', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  const credentials = Buffer.from(
    `\0${t.context.alias.name}@${t.context.domain.name}\0${t.context.pass}`
  ).toString('base64');
  await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

  // (the name of the variable is in the error message)
  const script = 'require "variables";\r\nset "a\r\nOK \\"Injected\\"" "b";';
  const response = await client.sendCommand(
    `CHECKSCRIPT {${Buffer.byteLength(script)}+}\r\n${script}`
  );
  t.is(response.length, 1, `${response.join(' | ')}`);
  t.regex(response[0], /^NO "Syntax error: .*\\"Injected\\"/);

  client.end();
});

test('should quote the reason a sign in failed', async (t) => {
  const client = await createClient(t.context.port);
  await client.waitForGreeting();

  // (the reason for a username that is not an address holds quotes)
  const credentials = Buffer.from(`\0nobody\0${t.context.pass}`).toString(
    'base64'
  );
  const response = await client.sendCommand(
    `AUTHENTICATE "PLAIN" "${credentials}"`
  );
  t.is(response.length, 1, `${response.join(' | ')}`);
  t.regex(response[0], /^NO "(?:[^"\\]|\\.)*"$/);

  client.end();
});
