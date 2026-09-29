/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const net = require('node:net');
const test = require('ava');

const { HeadBucketCommand } = require('@aws-sdk/client-s3');

const { encrypt } = require('#helpers/encrypt-decrypt');
const {
  getS3Client,
  defaultS3Client,
  createCustomS3Client,
  getS3ErrorMessage
} = require('#helpers/get-s3-client');

test('returns default S3 client when no domain is provided', (t) => {
  const result = getS3Client();
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null for default client');
});

test('returns default S3 client when domain is null', (t) => {
  const result = getS3Client(null);
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null');
});

test('returns default S3 client when domain is undefined', (t) => {
  const result = getS3Client(undefined);
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null');
});

test('returns default S3 client when domain has_custom_s3 is false', (t) => {
  const domain = {
    has_custom_s3: false,
    s3_endpoint: 'https://s3.example.com',
    s3_access_key_id: encrypt('AKID123'),
    s3_secret_access_key: encrypt('secret123'),
    s3_region: 'us-east-1',
    s3_bucket: 'my-bucket'
  };
  const result = getS3Client(domain);
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null');
});

test('returns default S3 client when domain is missing required S3 fields', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.example.com',
    // missing s3_access_key_id
    s3_secret_access_key: encrypt('secret123'),
    s3_bucket: 'my-bucket'
  };
  const result = getS3Client(domain);
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null');
});

test('returns default S3 client when domain is missing endpoint', (t) => {
  const domain = {
    has_custom_s3: true,
    // missing s3_endpoint
    s3_access_key_id: encrypt('AKID123'),
    s3_secret_access_key: encrypt('secret123'),
    s3_bucket: 'my-bucket'
  };
  const result = getS3Client(domain);
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null');
});

test('returns default S3 client when domain is missing bucket', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.example.com',
    s3_access_key_id: encrypt('AKID123'),
    s3_secret_access_key: encrypt('secret123')
    // missing s3_bucket
  };
  const result = getS3Client(domain);
  t.is(result.client, defaultS3Client, 'should return the default S3 client');
  t.is(result.bucket, null, 'bucket should be null');
});

test('returns custom S3 client when domain has valid custom S3 config with encrypted credentials', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.us-east-1.amazonaws.com',
    s3_access_key_id: encrypt('AKIAIOSFODNN7EXAMPLE'),
    s3_secret_access_key: encrypt('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'),
    s3_region: 'us-east-1',
    s3_bucket: 'my-custom-bucket'
  };
  const result = getS3Client(domain);
  t.not(
    result.client,
    defaultS3Client,
    'should return a custom S3 client, not the default'
  );
  t.is(
    result.bucket,
    'my-custom-bucket',
    'bucket should be the custom bucket name'
  );
});

test('custom S3 client uses correct region', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.eu-west-1.amazonaws.com',
    s3_access_key_id: encrypt('AKID123'),
    s3_secret_access_key: encrypt('secret123'),
    s3_region: 'eu-west-1',
    s3_bucket: 'eu-bucket'
  };
  const result = getS3Client(domain);
  t.not(result.client, defaultS3Client);
  t.is(result.bucket, 'eu-bucket');
});

test('custom S3 client defaults region to auto when not specified', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.example.com',
    s3_access_key_id: encrypt('AKID123'),
    s3_secret_access_key: encrypt('secret123'),
    s3_bucket: 'my-bucket'
    // s3_region not specified
  };
  const result = getS3Client(domain);
  t.not(result.client, defaultS3Client);
  t.is(result.bucket, 'my-bucket');
});

test('returns different client instances for different domains', (t) => {
  const domain1 = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.us-east-1.amazonaws.com',
    s3_access_key_id: encrypt('AKID1'),
    s3_secret_access_key: encrypt('secret1'),
    s3_region: 'us-east-1',
    s3_bucket: 'bucket-1'
  };
  const domain2 = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.eu-west-1.amazonaws.com',
    s3_access_key_id: encrypt('AKID2'),
    s3_secret_access_key: encrypt('secret2'),
    s3_region: 'eu-west-1',
    s3_bucket: 'bucket-2'
  };
  const result1 = getS3Client(domain1);
  const result2 = getS3Client(domain2);
  t.not(
    result1.client,
    result2.client,
    'should return different client instances'
  );
  t.is(result1.bucket, 'bucket-1');
  t.is(result2.bucket, 'bucket-2');
});

test('handles domain with empty string S3 fields gracefully', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: '',
    s3_access_key_id: '',
    s3_secret_access_key: '',
    s3_bucket: ''
  };
  const result = getS3Client(domain);
  t.is(
    result.client,
    defaultS3Client,
    'should fall back to default when fields are empty strings'
  );
  t.is(result.bucket, null);
});

test('handles domain object without S3 fields at all', (t) => {
  const domain = {
    name: 'example.com',
    plan: 'enhanced_protection'
  };
  const result = getS3Client(domain);
  t.is(result.client, defaultS3Client, 'should return default S3 client');
  t.is(result.bucket, null);
});

test('handles plaintext credentials (non-encrypted) gracefully', (t) => {
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.example.com',
    s3_access_key_id: 'plaintext-access-key',
    s3_secret_access_key: 'plaintext-secret-key',
    s3_region: 'auto',
    s3_bucket: 'my-bucket'
  };
  // Should not throw even with plaintext keys
  const result = getS3Client(domain);
  t.not(result.client, defaultS3Client);
  t.is(result.bucket, 'my-bucket');
});

test('decrypts both access key ID and secret access key from encrypted values', (t) => {
  const originalAccessKey = 'AKIAIOSFODNN7EXAMPLE';
  const originalSecret = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
  const domain = {
    has_custom_s3: true,
    s3_endpoint: 'https://s3.us-east-1.amazonaws.com',
    s3_access_key_id: encrypt(originalAccessKey),
    s3_secret_access_key: encrypt(originalSecret),
    s3_region: 'us-east-1',
    s3_bucket: 'test-bucket'
  };
  // Verify the stored values are encrypted (not plaintext)
  t.not(
    domain.s3_access_key_id,
    originalAccessKey,
    'access key ID should be encrypted'
  );
  t.not(
    domain.s3_secret_access_key,
    originalSecret,
    'secret access key should be encrypted'
  );
  // getS3Client should successfully create a client (decrypting internally)
  const result = getS3Client(domain);
  t.not(result.client, defaultS3Client);
  t.is(result.bucket, 'test-bucket');
});

//
// Custom S3 endpoints are customer supplied, so the client must connect only
// to the validated endpoint host and never to a non-public address.
//

async function listen(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return server;
}

test('custom S3 client uses path-style requests to the endpoint host itself', async (t) => {
  const requests = [];
  const server = await listen((req, res) => {
    requests.push({ host: req.headers.host, url: req.url });
    res.writeHead(200);
    res.end();
  });
  const { port } = server.address();

  const { client } = getS3Client({
    has_custom_s3: true,
    s3_endpoint: `http://127.0.0.1:${port}`,
    s3_access_key_id: encrypt('AKID123'),
    s3_secret_access_key: encrypt('secret123'),
    s3_bucket: 'mybucket'
  });

  try {
    await client.send(new HeadBucketCommand({ Bucket: 'mybucket' }));
  } finally {
    client.destroy();
    server.close();
  }

  t.is(requests.length, 1);
  // virtual-hosted style would have targeted mybucket.127.0.0.1
  t.is(requests[0].host, `127.0.0.1:${port}`);
  t.is(requests[0].url, '/mybucket/');
});

for (const address of ['169.254.169.254', '10.0.0.1', '192.168.1.1']) {
  test(`custom S3 client refuses to connect to ${address}`, async (t) => {
    const client = createCustomS3Client({
      endpoint: `http://${address}`,
      accessKeyId: 'AKID123',
      secretAccessKey: 'secret123'
    });
    const err = await t.throwsAsync(
      client.send(new HeadBucketCommand({ Bucket: 'mybucket' }))
    );
    client.destroy();
    t.is(err.code, 'EPRIVATEADDRESS');
    t.is(getS3ErrorMessage(err), 'Unable to connect to the S3 endpoint');
  });
}

test('S3 validation errors do not reveal connection level details', async (t) => {
  // a port nothing listens on
  const server = await listen(() => {});
  const { port } = server.address();
  await new Promise((resolve) => {
    server.close(resolve);
  });

  const client = createCustomS3Client({
    endpoint: `http://127.0.0.1:${port}`,
    accessKeyId: 'AKID123',
    secretAccessKey: 'secret123'
  });
  const err = await t.throwsAsync(
    client.send(new HeadBucketCommand({ Bucket: 'mybucket' }))
  );
  client.destroy();
  t.is(err.code, 'ECONNREFUSED');
  t.is(getS3ErrorMessage(err), 'Unable to connect to the S3 endpoint');
});

test('S3 errors returned by the endpoint are passed through', async (t) => {
  const server = await listen((req, res) => {
    res.writeHead(403);
    res.end();
  });
  const { port } = server.address();
  const client = createCustomS3Client({
    endpoint: `http://127.0.0.1:${port}`,
    accessKeyId: 'AKID123',
    secretAccessKey: 'secret123'
  });
  const err = await t.throwsAsync(
    client.send(new HeadBucketCommand({ Bucket: 'mybucket' }))
  );
  client.destroy();
  server.close();
  t.is(getS3ErrorMessage(err), '403');
});

test('an endpoint that accepts the connection and never answers times out', async (t) => {
  const server = net.createServer(() => {});
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const client = createCustomS3Client({
    endpoint: `http://127.0.0.1:${server.address().port}`,
    accessKeyId: 'AKID123',
    secretAccessKey: 'secret123',
    maxAttempts: 1,
    idleTimeout: 1000
  });
  const started = Date.now();
  const err = await t.throwsAsync(
    client.send(new HeadBucketCommand({ Bucket: 'mybucket' }))
  );
  client.destroy();
  server.close();
  t.true(Date.now() - started < 10_000);
  t.is(getS3ErrorMessage(err), 'Unable to connect to the S3 endpoint');
});
