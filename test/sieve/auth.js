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
