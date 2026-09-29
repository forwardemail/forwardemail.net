/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { S3Client } = require('@aws-sdk/client-s3');

const env = require('#config/env');
const { decrypt } = require('#helpers/encrypt-decrypt');
const getSafeS3RequestHandler = require('#helpers/get-safe-s3-request-handler');

//
// Default S3 client using environment variables
// (shared across all domains without custom S3 configuration)
//
const defaultS3Client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  },
  // Disable automatic checksum headers (x-amz-checksum-crc32)
  // for compatibility with S3-compatible providers like Backblaze B2
  // that reject unsupported headers with 400 Bad Request
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED'
});

/**
 * Get an S3 client for a given domain.
 * If the domain has custom S3 configuration (`has_custom_s3` is true),
 * a new S3Client is created with the domain's decrypted credentials.
 * Both `s3_access_key_id` and `s3_secret_access_key` are stored
 * encrypted at rest and decrypted here at runtime.
 * Otherwise, the default S3 client (using env vars) is returned.
 *
 * @param {Object} [domain] - The domain object (must include s3_* fields if custom S3)
 * @returns {Object} An object with `client` (S3Client) and `bucket` (String)
 *   - `client`: The S3Client instance to use
 *   - `bucket`: The bucket name to use (custom or constructed from storage_location)
 */
function getS3Client(domain) {
  // If domain has custom S3 configuration, create a domain-specific client
  if (
    domain &&
    domain.has_custom_s3 === true &&
    domain.s3_endpoint &&
    domain.s3_access_key_id &&
    domain.s3_secret_access_key &&
    domain.s3_bucket
  ) {
    // Decrypt the access key ID (stored encrypted in the database)
    let accessKeyId;
    try {
      accessKeyId = decrypt(domain.s3_access_key_id);
    } catch {
      // If decryption fails, the key may already be in plaintext (e.g. during tests)
      accessKeyId = domain.s3_access_key_id;
    }

    // Decrypt the secret access key (stored encrypted in the database)
    let secretAccessKey;
    try {
      secretAccessKey = decrypt(domain.s3_secret_access_key);
    } catch {
      // If decryption fails, the key may already be in plaintext (e.g. during tests)
      secretAccessKey = domain.s3_secret_access_key;
    }

    const client = createCustomS3Client({
      endpoint: domain.s3_endpoint,
      region: domain.s3_region,
      accessKeyId,
      secretAccessKey
    });

    return {
      client,
      bucket: domain.s3_bucket
    };
  }

  // Return default S3 client
  return {
    client: defaultS3Client,
    bucket: null // caller should construct bucket from storage_location
  };
}

/**
 * Create an S3Client for a customer supplied (custom S3) endpoint.
 * Used both when the settings are saved (HeadBucket validation in the
 * Domains model) and at runtime for backups, so both connect the same way.
 *
 * @param {Object} options
 * @param {string} options.endpoint - Custom S3 endpoint URL
 * @param {string} [options.region] - Region (defaults to "auto")
 * @param {string} options.accessKeyId - Decrypted access key ID
 * @param {string} options.secretAccessKey - Decrypted secret access key
 * @param {number} [options.maxAttempts] - Attempts per request (default 3)
 * @param {number} [options.connectionTimeout] - ms to connect (default 10s)
 * @param {number} [options.idleTimeout] - ms of socket inactivity before a
 *   request is abandoned (default 2 minutes)
 * @returns {S3Client}
 */
function createCustomS3Client({
  endpoint,
  region,
  accessKeyId,
  secretAccessKey,
  maxAttempts = 3,
  connectionTimeout,
  idleTimeout
}) {
  return new S3Client({
    region: region || 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    // Use path-style addressing for compatibility with S3-compatible
    // providers (MinIO, Backblaze B2, Wasabi, etc.) that do not support
    // virtual-hosted-style bucket addressing.  This also keeps the request on
    // the endpoint host itself; virtual-hosted style would connect to
    // `<bucket>.<endpoint host>`, a hostname no endpoint check ever sees.
    forcePathStyle: true,
    // Every connection is checked against private/internal addresses at the
    // moment the socket opens (see get-safe-s3-request-handler.js), which
    // also covers DNS answers that change after the settings were saved
    requestHandler: getSafeS3RequestHandler({
      connectionTimeout,
      idleTimeout
    }),
    // Retry transient failures (timeouts, throttling, 5xx), 3 times by default
    maxAttempts,
    // Disable automatic checksum headers (x-amz-checksum-crc32)
    // for compatibility with S3-compatible providers like Backblaze B2
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED'
  });
}

/**
 * Turn an error from a custom S3 endpoint into a message that is safe to show
 * the customer.  Errors returned by the endpoint as S3 (e.g. "Forbidden",
 * "NotFound", "InvalidAccessKeyId") are passed through; connection level
 * errors (refused, timed out, reset, blocked address) all map to one generic
 * message, so the error cannot be used to probe which hosts and ports are
 * reachable from our servers.
 *
 * @param {Error} err
 * @returns {string}
 */
function getS3ErrorMessage(err) {
  const code = err && (err.Code || err.name);
  if (err?.$metadata?.httpStatusCode && typeof code === 'string' && code)
    return code.slice(0, 100);
  return 'Unable to connect to the S3 endpoint';
}

module.exports = {
  getS3Client,
  defaultS3Client,
  createCustomS3Client,
  getS3ErrorMessage
};
