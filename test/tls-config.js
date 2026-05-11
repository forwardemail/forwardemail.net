/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const test = require('ava');

const getTLSOptions = require('#helpers/get-tls-options');

//
// Helper: create a temporary self-signed cert for TLS tests
//
function createTempCert() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tls-test-'));
  const keyPath = path.join(tmpDir, 'key.pem');
  const certPath = path.join(tmpDir, 'cert.pem');
  execSync(
    `openssl req -newkey rsa:2048 -nodes -keyout ${keyPath} -x509 -days 1 -out ${certPath} -subj "/CN=localhost" -sha256`,
    { stdio: 'pipe' }
  );
  const key = fs.readFileSync(keyPath);
  const cert = fs.readFileSync(certPath);
  return { key, cert, tmpDir, keyPath, certPath };
}

function cleanupCert({ tmpDir, keyPath, certPath }) {
  fs.unlinkSync(keyPath);
  fs.unlinkSync(certPath);
  fs.rmdirSync(tmpDir);
}

// ============================================================
// Basic configuration tests (strict profile - default)
// ============================================================

test('getTLSOptions returns an object', (t) => {
  const opts = getTLSOptions();
  t.is(typeof opts, 'object');
});

test('getTLSOptions sets honorCipherOrder to true', (t) => {
  const opts = getTLSOptions();
  t.true(opts.honorCipherOrder);
});

test('getTLSOptions sets ecdhCurve to auto', (t) => {
  const opts = getTLSOptions();
  t.is(opts.ecdhCurve, 'auto');
});

test('getTLSOptions sets minVersion to TLSv1.2', (t) => {
  const opts = getTLSOptions();
  t.is(opts.minVersion, 'TLSv1.2');
});

test('getTLSOptions sets ciphers string', (t) => {
  const opts = getTLSOptions();
  t.is(typeof opts.ciphers, 'string');
  t.true(opts.ciphers.length > 0);
});

test('getTLSOptions sets sigalgs string', (t) => {
  const opts = getTLSOptions();
  t.is(typeof opts.sigalgs, 'string');
  t.true(opts.sigalgs.length > 0);
});

test('getTLSOptions allows overrides', (t) => {
  const opts = getTLSOptions({ minVersion: 'TLSv1.3' });
  t.is(opts.minVersion, 'TLSv1.3');
  // Other options should still be present
  t.true(opts.honorCipherOrder);
});

test('getTLSOptions does not include profile key in result', (t) => {
  const opts = getTLSOptions({ profile: 'compat' });
  t.is(opts.profile, undefined);
});

test('CIPHERS constant is exported', (t) => {
  t.is(typeof getTLSOptions.CIPHERS, 'string');
  t.true(getTLSOptions.CIPHERS.length > 0);
});

test('COMPAT_CIPHERS constant is exported', (t) => {
  t.is(typeof getTLSOptions.COMPAT_CIPHERS, 'string');
  t.true(getTLSOptions.COMPAT_CIPHERS.length > 0);
});

test('SIGALGS constant is exported', (t) => {
  t.is(typeof getTLSOptions.SIGALGS, 'string');
  t.true(getTLSOptions.SIGALGS.length > 0);
});

// ============================================================
// Strict cipher suite validation
// ============================================================

test('strict: all ciphers use ECDHE or DHE key exchange (forward secrecy)', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.true(
      cipher.startsWith('ECDHE-') || cipher.startsWith('DHE-'),
      `Cipher ${cipher} does not use ECDHE or DHE key exchange`
    );
  }
});

test('strict: all ciphers use AEAD mode (GCM or CHACHA20-POLY1305)', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.true(
      cipher.includes('GCM') || cipher.includes('CHACHA20-POLY1305'),
      `Cipher ${cipher} is not an AEAD cipher`
    );
  }
});

test('strict: no CBC ciphers are included', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(cipher.includes('CBC'), `Cipher ${cipher} uses CBC mode`);
    // Also check for SHA-only suffix which indicates CBC in OpenSSL naming
    t.false(
      cipher.endsWith('-SHA') && !cipher.includes('CHACHA20'),
      `Cipher ${cipher} appears to be a CBC cipher (SHA MAC)`
    );
  }
});

test('strict: no ARIA ciphers are included', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(cipher.includes('ARIA'), `Cipher ${cipher} uses ARIA`);
  }
});

test('strict: no RSA key exchange ciphers (without ECDHE/DHE)', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(
      cipher.startsWith('AES') || cipher.startsWith('TLS_RSA'),
      `Cipher ${cipher} uses RSA key exchange (no forward secrecy)`
    );
  }
});

test('strict: no DSS authentication ciphers are included', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(
      cipher.includes('-DSS-'),
      `Cipher ${cipher} uses DSS authentication`
    );
  }
});

test('strict: ECDHE ciphers are prioritized over DHE ciphers', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  let lastECDHEIndex = -1;
  let firstDHEIndex = ciphers.length;
  for (const [i, cipher] of ciphers.entries()) {
    if (cipher.startsWith('ECDHE-')) lastECDHEIndex = i;
    if (cipher.startsWith('DHE-') && i < firstDHEIndex) firstDHEIndex = i;
  }

  t.true(
    lastECDHEIndex < firstDHEIndex,
    'All ECDHE ciphers should come before DHE ciphers'
  );
});

test('strict: AES-256-GCM ciphers come before AES-128-GCM ciphers within same key exchange', (t) => {
  const ciphers = getTLSOptions.CIPHERS.split(':');
  const ecdheCiphers = ciphers.filter((c) => c.startsWith('ECDHE-'));

  const first256 = ecdheCiphers.findIndex((c) => c.includes('AES256-GCM'));
  const first128 = ecdheCiphers.findIndex((c) => c.includes('AES128-GCM'));

  t.true(first256 >= 0, 'Should have AES-256-GCM cipher');
  t.true(first128 >= 0, 'Should have AES-128-GCM cipher');
  t.true(first256 < first128, 'AES-256-GCM should come before AES-128-GCM');
});

// ============================================================
// Compat cipher suite validation
// ============================================================

test('compat: all ciphers use ECDHE or DHE key exchange (forward secrecy)', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.true(
      cipher.startsWith('ECDHE-') || cipher.startsWith('DHE-'),
      `Cipher ${cipher} does not use ECDHE or DHE key exchange`
    );
  }
});

test('compat: no RSA key exchange ciphers', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(
      cipher.startsWith('AES') || cipher.startsWith('TLS_RSA'),
      `Cipher ${cipher} uses RSA key exchange (no forward secrecy)`
    );
  }
});

test('compat: no ARIA ciphers', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(cipher.includes('ARIA'), `Cipher ${cipher} uses ARIA`);
  }
});

test('compat: no DSS authentication ciphers', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  for (const cipher of ciphers) {
    t.false(
      cipher.includes('-DSS-'),
      `Cipher ${cipher} uses DSS authentication`
    );
  }
});

test('compat: includes CBC ciphers for backward compatibility', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  const hasCBC = ciphers.some(
    (c) => c.endsWith('-SHA') || c.endsWith('-SHA256') || c.endsWith('-SHA384')
  );
  t.true(hasCBC, 'Compat profile should include CBC ciphers');
});

test('compat: AEAD ciphers come before CBC ciphers', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  const isAEAD = (c) => c.includes('GCM') || c.includes('CHACHA20');
  const lastAEAD = Math.max(...ciphers.map((c, i) => (isAEAD(c) ? i : -1)));
  const firstCBC = ciphers.findIndex((c) => !isAEAD(c));
  t.true(
    lastAEAD < firstCBC,
    'All AEAD ciphers should come before CBC ciphers'
  );
});

test('compat: CBC+SHA256/384 ciphers come before CBC+SHA1 ciphers', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  const isAEAD = (c) => c.includes('GCM') || c.includes('CHACHA20');
  const isCBCSHA256 = (c) =>
    !isAEAD(c) && (c.endsWith('-SHA256') || c.endsWith('-SHA384'));
  const isCBCSHA1 = (c) => !isAEAD(c) && !isCBCSHA256(c) && c.endsWith('-SHA');
  const firstCBCSHA256 = ciphers.findIndex((c) => isCBCSHA256(c));
  const firstCBCSHA1 = ciphers.findIndex((c) => isCBCSHA1(c));
  t.true(
    firstCBCSHA256 < firstCBCSHA1,
    'CBC+SHA256/384 ciphers should come before CBC+SHA1 ciphers'
  );
});

test('compat: ECDHE ciphers are prioritized over DHE ciphers within each group', (t) => {
  const ciphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  // Check AEAD group
  const aeadCiphers = ciphers.filter(
    (c) => c.includes('GCM') || c.includes('CHACHA20-POLY1305')
  );
  let lastECDHE = -1;
  let firstDHE = aeadCiphers.length;
  for (const [i, aeadCipher] of aeadCiphers.entries()) {
    if (aeadCipher.startsWith('ECDHE-')) lastECDHE = i;
    if (aeadCipher.startsWith('DHE-') && i < firstDHE) firstDHE = i;
  }

  t.true(
    lastECDHE < firstDHE,
    'ECDHE AEAD ciphers should come before DHE AEAD ciphers'
  );
});

test('compat: is a superset of strict ciphers', (t) => {
  const strictCiphers = getTLSOptions.CIPHERS.split(':');
  const compatCiphers = getTLSOptions.COMPAT_CIPHERS.split(':');
  for (const cipher of strictCiphers) {
    t.true(
      compatCiphers.includes(cipher),
      `Strict cipher ${cipher} should also be in compat list`
    );
  }
});

test('compat profile is selected via getTLSOptions({ profile: "compat" })', (t) => {
  const opts = getTLSOptions({ profile: 'compat' });
  t.is(opts.ciphers, getTLSOptions.COMPAT_CIPHERS);
});

test('strict profile is the default', (t) => {
  const opts = getTLSOptions();
  t.is(opts.ciphers, getTLSOptions.CIPHERS);
});

test('strict profile is selected via getTLSOptions({ profile: "strict" })', (t) => {
  const opts = getTLSOptions({ profile: 'strict' });
  t.is(opts.ciphers, getTLSOptions.CIPHERS);
});

// ============================================================
// Signature algorithm validation
// ============================================================

test('sigalgs exclude SHA-1', (t) => {
  const sigalgs = getTLSOptions.SIGALGS.split(':');
  for (const alg of sigalgs) {
    t.false(alg.includes('sha1'), `Signature algorithm ${alg} uses SHA-1`);
  }
});

test('sigalgs exclude SHA-224', (t) => {
  const sigalgs = getTLSOptions.SIGALGS.split(':');
  for (const alg of sigalgs) {
    t.false(alg.includes('sha224'), `Signature algorithm ${alg} uses SHA-224`);
  }
});

test('sigalgs include ECDSA with SHA-256', (t) => {
  const sigalgs = getTLSOptions.SIGALGS.split(':');
  t.true(sigalgs.includes('ecdsa_secp256r1_sha256'));
});

test('sigalgs include RSA-PSS with SHA-256', (t) => {
  const sigalgs = getTLSOptions.SIGALGS.split(':');
  t.true(sigalgs.includes('rsa_pss_rsae_sha256'));
});

test('sigalgs include RSA PKCS#1 with SHA-256', (t) => {
  const sigalgs = getTLSOptions.SIGALGS.split(':');
  t.true(sigalgs.includes('rsa_pkcs1_sha256'));
});

test('sigalgs include SHA-384 and SHA-512 variants', (t) => {
  const sigalgs = getTLSOptions.SIGALGS.split(':');
  t.true(sigalgs.includes('ecdsa_secp384r1_sha384'));
  t.true(sigalgs.includes('ecdsa_secp521r1_sha512'));
  t.true(sigalgs.includes('rsa_pss_rsae_sha384'));
  t.true(sigalgs.includes('rsa_pss_rsae_sha512'));
  t.true(sigalgs.includes('rsa_pkcs1_sha384'));
  t.true(sigalgs.includes('rsa_pkcs1_sha512'));
});

// ============================================================
// Integration tests - TLS server/client negotiation
// ============================================================

test('can create a valid TLS SecureContext with strict options', (t) => {
  const opts = getTLSOptions();
  t.notThrows(() => {
    tls.createSecureContext({
      ciphers: opts.ciphers,
      sigalgs: opts.sigalgs,
      minVersion: opts.minVersion,
      ecdhCurve: opts.ecdhCurve
    });
  });
});

test('can create a valid TLS SecureContext with compat options', (t) => {
  const opts = getTLSOptions({ profile: 'compat', minVersion: 'TLSv1' });
  t.notThrows(() => {
    tls.createSecureContext({
      ciphers: opts.ciphers,
      sigalgs: opts.sigalgs,
      minVersion: opts.minVersion,
      ecdhCurve: opts.ecdhCurve
    });
  });
});

test('TLS server and client can negotiate with strict config', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions();

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2'
        },
        () => {
          const cipher = client.getCipher();
          t.truthy(cipher, 'Should negotiate a cipher');
          t.truthy(cipher.name, 'Cipher should have a name');

          const protocol = client.getProtocol();
          if (protocol === 'TLSv1.3') {
            t.pass('TLS 1.3 negotiated');
          } else {
            const allowedCiphers = opts.ciphers.split(':');
            t.true(
              allowedCiphers.includes(cipher.name),
              `Negotiated cipher ${cipher.name} should be in allowed list`
            );
          }

          client.end();
          server.close();
          resolve();
        }
      );
      client.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('server enforces cipher order (honorCipherOrder)', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions();

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      // Client prefers CHACHA20 over AES-GCM, but server should pick AES256-GCM
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.2',
          ciphers:
            'ECDHE-RSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384'
        },
        () => {
          const cipher = client.getCipher();
          t.is(
            cipher.name,
            'ECDHE-RSA-AES256-GCM-SHA384',
            'Server should enforce its cipher preference (AES256-GCM over CHACHA20)'
          );
          client.end();
          server.close();
          resolve();
        }
      );
      client.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('strict server rejects connections with only RSA key exchange ciphers', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions();

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.2',
          ciphers: 'AES256-GCM-SHA384:AES128-GCM-SHA256'
        },
        () => {
          client.end();
          server.close();
          t.fail('Should not have connected with RSA-only ciphers');
          resolve();
        }
      );
      client.on('error', (err) => {
        t.truthy(err);
        server.close();
        resolve();
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('strict server rejects connections with only CBC ciphers', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions();

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.2',
          ciphers: 'ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384'
        },
        () => {
          client.end();
          server.close();
          t.fail('Should not have connected with CBC-only ciphers');
          resolve();
        }
      );
      client.on('error', (err) => {
        t.truthy(err);
        server.close();
        resolve();
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('compat server accepts connections with CBC ciphers (forward secrecy)', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions({ profile: 'compat' });

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.2',
          ciphers: 'ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384'
        },
        () => {
          const cipher = client.getCipher();
          t.truthy(cipher.name, 'Should negotiate a CBC cipher');
          client.end();
          server.close();
          resolve();
        }
      );
      client.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('compat server still rejects RSA key exchange ciphers', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions({ profile: 'compat' });

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.2',
          ciphers:
            'AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256'
        },
        () => {
          client.end();
          server.close();
          t.fail('Should not have connected with RSA-only ciphers');
          resolve();
        }
      );
      client.on('error', (err) => {
        t.truthy(err);
        server.close();
        resolve();
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('compat server prefers AEAD over CBC when client supports both', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions({ profile: 'compat' });

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      // Client offers CBC first, then AEAD - server should pick AEAD due to honorCipherOrder
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
          maxVersion: 'TLSv1.2',
          ciphers:
            'ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256'
        },
        () => {
          const cipher = client.getCipher();
          t.is(
            cipher.name,
            'ECDHE-RSA-AES256-GCM-SHA384',
            'Server should prefer AEAD (AES256-GCM) over CBC even when client prefers CBC'
          );
          client.end();
          server.close();
          resolve();
        }
      );
      client.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('TLS 1.3 connections still work with strict config', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions();

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.3',
          maxVersion: 'TLSv1.3'
        },
        () => {
          const protocol = client.getProtocol();
          t.is(protocol, 'TLSv1.3', 'Should negotiate TLS 1.3');
          client.end();
          server.close();
          resolve();
        }
      );
      client.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});

test('TLS 1.3 connections still work with compat config', async (t) => {
  const { key, cert, ...certInfo } = createTempCert();
  const opts = getTLSOptions({ profile: 'compat' });

  const server = tls.createServer({ ...opts, key, cert });

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const client = tls.connect(
        {
          host: '127.0.0.1',
          port,
          rejectUnauthorized: false,
          minVersion: 'TLSv1.3',
          maxVersion: 'TLSv1.3'
        },
        () => {
          const protocol = client.getProtocol();
          t.is(protocol, 'TLSv1.3', 'Should negotiate TLS 1.3');
          client.end();
          server.close();
          resolve();
        }
      );
      client.on('error', (err) => {
        server.close();
        reject(err);
      });
    });
    server.on('error', reject);
  });

  cleanupCert(certInfo);
});
