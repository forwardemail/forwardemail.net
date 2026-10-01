/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');

const test = require('ava');
const sinon = require('sinon');

const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');
const { isPrivateHostResolved } = require('#helpers/is-private-host');

//
// Test with a local HTTP server to simulate S3 bucket responses.
// Loopback is a private target, so these tests allow 127.0.0.1 only and
// keep the real check for every other host.
//
test.beforeEach(() => {
  sinon
    .stub(checkS3BucketAccess, 'isPrivateTarget')
    .callsFake(async (hostname, resolver) =>
      hostname === '127.0.0.1'
        ? false
        : isPrivateHostResolved(hostname, resolver)
    );
});

test.afterEach.always(() => {
  sinon.restore();
});

async function listen(handler) {
  const hits = [];
  const server = http.createServer((req, res) => {
    hits.push({ host: req.headers.host, url: req.url });
    handler(req, res);
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return { server, hits, port: server.address().port };
}

test.serial(
  'does not request a private endpoint (real private-host check)',
  async (t) => {
    sinon.restore();
    const { server, hits, port } = await listen((req, res) => {
      res.writeHead(200);
      res.end();
    });
    try {
      for (const endpoint of [
        `http://127.0.0.1:${port}`,
        `http://[::ffff:127.0.0.1]:${port}`,
        `http://localhost:${port}`,
        'http://169.254.169.254'
      ]) {
        const isPublic = await checkS3BucketAccess(
          endpoint,
          'test-bucket',
          1000
        );
        t.false(isPublic, `endpoint ${endpoint}`);
      }

      t.is(hits.length, 0, 'no request may reach a private address');
    } finally {
      server.close();
    }
  }
);

test.serial(
  'does not request anything for an invalid bucket name',
  async (t) => {
    const { server, hits, port } = await listen((req, res) => {
      res.writeHead(200);
      res.end();
    });
    try {
      for (const bucket of [
        '127.0.0.1/.s3.example.com',
        'bucket#x',
        'bucket?x',
        'user@bucket',
        'bucket:80',
        'Bucket',
        'ab',
        'a'.repeat(64),
        '-bucket',
        'bucket..name',
        '192.168.1.1'
      ]) {
        const isPublic = await checkS3BucketAccess(
          `http://127.0.0.1:${port}`,
          bucket,
          1000
        );
        t.false(isPublic, `bucket ${bucket}`);
      }

      t.is(hits.length, 0);
    } finally {
      server.close();
    }
  }
);

test.serial('does not request a non-http(s) endpoint', async (t) => {
  const stub = checkS3BucketAccess.isPrivateTarget;
  const isPublic = await checkS3BucketAccess(
    'ftp://127.0.0.1',
    'test-bucket',
    1000
  );
  t.false(isPublic);
  t.false(stub.called);
});

test.serial(
  'returns true when bucket responds with 200 (public)',
  async (t) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end('<ListBucketResult></ListBucketResult>');
    });

    await new Promise((resolve) => {
      server.listen(0, resolve);
    });
    const { port } = server.address();

    try {
      const isPublic = await checkS3BucketAccess(
        `http://127.0.0.1:${port}`,
        'test-bucket'
      );
      t.true(isPublic, 'should detect bucket as publicly accessible');
    } finally {
      server.close();
    }
  }
);

test.serial(
  'returns false when bucket responds with 403 (private)',
  async (t) => {
    const server = http.createServer((req, res) => {
      res.writeHead(403, { 'Content-Type': 'application/xml' });
      res.end('<Error><Code>AccessDenied</Code></Error>');
    });

    await new Promise((resolve) => {
      server.listen(0, resolve);
    });
    const { port } = server.address();

    try {
      const isPublic = await checkS3BucketAccess(
        `http://127.0.0.1:${port}`,
        'test-bucket'
      );
      t.false(isPublic, 'should detect bucket as private');
    } finally {
      server.close();
    }
  }
);

test.serial(
  'returns false when bucket responds with 401 (unauthorized)',
  async (t) => {
    const server = http.createServer((req, res) => {
      res.writeHead(401, { 'Content-Type': 'application/xml' });
      res.end('<Error><Code>Unauthorized</Code></Error>');
    });

    await new Promise((resolve) => {
      server.listen(0, resolve);
    });
    const { port } = server.address();

    try {
      const isPublic = await checkS3BucketAccess(
        `http://127.0.0.1:${port}`,
        'test-bucket'
      );
      t.false(isPublic, 'should detect bucket as private');
    } finally {
      server.close();
    }
  }
);

test.serial('returns false when connection is refused', async (t) => {
  // Use a port that is almost certainly not listening
  const isPublic = await checkS3BucketAccess(
    'http://127.0.0.1:19999',
    'test-bucket',
    2000
  );
  t.false(isPublic, 'should return false on connection error');
});

test.serial(
  'returns false when endpoint is unreachable (timeout)',
  async (t) => {
    // Use a non-routable IP to trigger a timeout
    const isPublic = await checkS3BucketAccess(
      'http://192.0.2.1',
      'test-bucket',
      1000
    );
    t.false(isPublic, 'should return false on timeout');
  }
);

test.serial('returns false for invalid endpoint URL', async (t) => {
  const isPublic = await checkS3BucketAccess(
    'not-a-valid-url',
    'test-bucket',
    1000
  );
  t.false(isPublic, 'should return false for invalid URL');
});

test.serial('returns false when endpoint is empty string', async (t) => {
  const isPublic = await checkS3BucketAccess('', 'test-bucket', 1000);
  t.false(isPublic, 'should return false for empty endpoint');
});

test.serial('checks path-style URL correctly', async (t) => {
  const requestedPaths = [];
  const server = http.createServer((req, res) => {
    requestedPaths.push(req.url);
    res.writeHead(403);
    res.end();
  });

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });
  const { port } = server.address();

  try {
    await checkS3BucketAccess(`http://127.0.0.1:${port}`, 'my-test-bucket');
    t.true(
      requestedPaths.includes('/my-test-bucket'),
      'should include path-style URL request to /my-test-bucket'
    );
  } finally {
    server.close();
  }
});

test.serial(
  'returns false when server closes connection abruptly',
  async (t) => {
    const server = http.createServer((req, res) => {
      res.destroy();
    });

    await new Promise((resolve) => {
      server.listen(0, resolve);
    });
    const { port } = server.address();

    try {
      const isPublic = await checkS3BucketAccess(
        `http://127.0.0.1:${port}`,
        'test-bucket'
      );
      t.false(
        isPublic,
        'should return false when connection is abruptly closed'
      );
    } finally {
      server.close();
    }
  }
);
