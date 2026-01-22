/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 *
 * ManageSieve Server Tests
 */

const { Buffer } = require('node:buffer');
const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const net = require('node:net');

const { ManageSieveServer } = require('../../helpers/sieve/managesieve-server');
const { MemorySieveStore } = require('../../helpers/sieve/store');

describe('ManageSieve Server', () => {
  let server;
  let store;
  let port;

  beforeEach(async () => {
    store = new MemorySieveStore();
    server = new ManageSieveServer({
      store,
      async authenticate(username, password) {
        if (username === 'testuser' && password === 'testpass') {
          return { id: 'user-1', username: 'testuser' };
        }

        return null;
      },
      logger: {
        info() {},
        warn() {},
        error() {},
        debug() {}
      }
    });

    // Find an available port
    port = 4190 + Math.floor(Math.random() * 1000);
    server.config.host = '127.0.0.1';
    await server.listen(port);
  });

  afterEach(async () => {
    await server.close();
  });

  /**
   * Helper to send commands and receive responses
   */
  function createClient() {
    return new Promise((resolve, reject) => {
      const client = net.createConnection({ port, host: '127.0.0.1' }, () => {
        const responses = [];
        let buffer = '';

        client.on('data', (data) => {
          buffer += data.toString();
          // Check for complete response
          if (buffer.includes('\r\n')) {
            const lines = buffer.split('\r\n');
            buffer = lines.pop(); // Keep incomplete line in buffer
            responses.push(...lines.filter(Boolean));
          }
        });

        client.sendCommand = (cmd) => {
          return new Promise((res) => {
            responses.length = 0;
            client.write(cmd + '\r\n');
            setTimeout(() => res([...responses]), 100);
          });
        };

        client.waitForGreeting = () => {
          return new Promise((res) => {
            setTimeout(() => res([...responses]), 100);
          });
        };

        resolve(client);
      });

      client.on('error', reject);
    });
  }

  describe('Connection', () => {
    it('should send greeting on connect', async () => {
      const client = await createClient();
      const greeting = await client.waitForGreeting();

      assert.ok(greeting.length > 0);
      assert.ok(greeting.some((line) => line.includes('IMPLEMENTATION')));
      assert.ok(greeting.some((line) => line.includes('SIEVE')));
      assert.ok(greeting.some((line) => line.startsWith('OK')));

      client.end();
    });

    it('should advertise capabilities', async () => {
      const client = await createClient();
      const greeting = await client.waitForGreeting();

      // Check for SASL capability
      assert.ok(greeting.some((line) => line.includes('SASL')));

      client.end();
    });
  });

  describe('CAPABILITY command', () => {
    it('should return capabilities', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      const response = await client.sendCommand('CAPABILITY');

      assert.ok(response.some((line) => line.includes('IMPLEMENTATION')));
      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });
  });

  describe('AUTHENTICATE command', () => {
    it('should authenticate with valid credentials', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Send AUTHENTICATE PLAIN with base64 encoded credentials
      // Format: \0username\0password
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      const response = await client.sendCommand(
        `AUTHENTICATE "PLAIN" "${credentials}"`
      );

      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });

    it('should reject invalid credentials', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      const credentials = Buffer.from('\0baduser\0badpass').toString('base64');
      const response = await client.sendCommand(
        `AUTHENTICATE "PLAIN" "${credentials}"`
      );

      assert.ok(response.some((line) => line.startsWith('NO')));

      client.end();
    });
  });

  describe('LISTSCRIPTS command', () => {
    it('should list scripts after authentication', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Add a script
      await store.putScript('user-1', 'test-script', 'keep;');
      await store.setActive('user-1', 'test-script');

      const response = await client.sendCommand('LISTSCRIPTS');

      assert.ok(response.some((line) => line.includes('test-script')));
      assert.ok(response.some((line) => line.includes('ACTIVE')));
      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });

    it('should require authentication', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      const response = await client.sendCommand('LISTSCRIPTS');

      assert.ok(response.some((line) => line.startsWith('NO')));

      client.end();
    });
  });

  describe('PUTSCRIPT command', () => {
    it('should store a valid script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Put a script
      const script =
        'require "fileinto"; if header :contains "subject" "test" { fileinto "Test"; }';
      const response = await client.sendCommand(
        `PUTSCRIPT "my-filter" {${script.length}+}\r\n${script}`
      );

      assert.ok(response.some((line) => line.startsWith('OK')));

      // Verify script was stored
      const stored = await store.getScript('user-1', 'my-filter');
      assert.ok(stored);
      assert.strictEqual(stored.content, script);

      client.end();
    });

    it('should reject invalid script syntax', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Put an invalid script
      const script = 'this is not valid sieve syntax {{{';
      const response = await client.sendCommand(
        `PUTSCRIPT "bad-filter" {${script.length}+}\r\n${script}`
      );

      assert.ok(response.some((line) => line.startsWith('NO')));

      client.end();
    });
  });

  describe('GETSCRIPT command', () => {
    it('should retrieve a stored script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Store a script
      const script = 'keep;';
      await store.putScript('user-1', 'my-script', script);

      const response = await client.sendCommand('GETSCRIPT "my-script"');

      assert.ok(response.some((line) => line.includes('keep')));
      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });

    it('should return error for non-existent script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      const response = await client.sendCommand('GETSCRIPT "nonexistent"');

      assert.ok(response.some((line) => line.startsWith('NO')));

      client.end();
    });
  });

  describe('SETACTIVE command', () => {
    it('should activate a script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Store a script
      await store.putScript('user-1', 'my-script', 'keep;');

      const response = await client.sendCommand('SETACTIVE "my-script"');

      assert.ok(response.some((line) => line.startsWith('OK')));

      // Verify script is active
      const active = await store.getActiveScript('user-1');
      assert.ok(active);
      assert.strictEqual(active.name, 'my-script');

      client.end();
    });

    it('should deactivate all scripts with empty name', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Store and activate a script
      await store.putScript('user-1', 'my-script', 'keep;');
      await store.setActive('user-1', 'my-script');

      const response = await client.sendCommand('SETACTIVE ""');

      assert.ok(response.some((line) => line.startsWith('OK')));

      // Verify no script is active
      const active = await store.getActiveScript('user-1');
      assert.strictEqual(active, null);

      client.end();
    });
  });

  describe('DELETESCRIPT command', () => {
    it('should delete a script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Store a script
      await store.putScript('user-1', 'my-script', 'keep;');

      const response = await client.sendCommand('DELETESCRIPT "my-script"');

      assert.ok(response.some((line) => line.startsWith('OK')));

      // Verify script was deleted
      const script = await store.getScript('user-1', 'my-script');
      assert.strictEqual(script, null);

      client.end();
    });

    it('should not delete active script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Store and activate a script
      await store.putScript('user-1', 'my-script', 'keep;');
      await store.setActive('user-1', 'my-script');

      const response = await client.sendCommand('DELETESCRIPT "my-script"');

      assert.ok(response.some((line) => line.startsWith('NO')));

      // Verify script still exists
      const script = await store.getScript('user-1', 'my-script');
      assert.ok(script);

      client.end();
    });
  });

  describe('RENAMESCRIPT command', () => {
    it('should rename a script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      // Store a script
      await store.putScript('user-1', 'old-name', 'keep;');

      const response = await client.sendCommand(
        'RENAMESCRIPT "old-name" "new-name"'
      );

      assert.ok(response.some((line) => line.startsWith('OK')));

      // Verify rename
      const oldScript = await store.getScript('user-1', 'old-name');
      const newScript = await store.getScript('user-1', 'new-name');
      assert.strictEqual(oldScript, null);
      assert.ok(newScript);

      client.end();
    });
  });

  describe('CHECKSCRIPT command', () => {
    it('should validate a valid script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      const script = 'keep;';
      const response = await client.sendCommand(
        `CHECKSCRIPT {${script.length}+}\r\n${script}`
      );

      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });

    it('should reject an invalid script', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      const script = 'invalid syntax {{{';
      const response = await client.sendCommand(
        `CHECKSCRIPT {${script.length}+}\r\n${script}`
      );

      assert.ok(response.some((line) => line.startsWith('NO')));

      client.end();
    });
  });

  describe('LOGOUT command', () => {
    it('should close connection', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      const response = await client.sendCommand('LOGOUT');

      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });
  });

  describe('NOOP command', () => {
    it('should return OK', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      const response = await client.sendCommand('NOOP');

      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });
  });

  describe('HAVESPACE command', () => {
    it('should check quota', async () => {
      const client = await createClient();
      await client.waitForGreeting();

      // Authenticate
      const credentials = Buffer.from('\0testuser\0testpass').toString(
        'base64'
      );
      await client.sendCommand(`AUTHENTICATE "PLAIN" "${credentials}"`);

      const response = await client.sendCommand('HAVESPACE "test" 1024');

      assert.ok(response.some((line) => line.startsWith('OK')));

      client.end();
    });
  });
});
