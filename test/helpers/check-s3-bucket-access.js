/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');

const test = require('ava');

const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');

//
// Test with a local HTTP server to simulate S3 bucket responses
//

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
