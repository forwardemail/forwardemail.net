/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { S3Client } = require('@aws-sdk/client-s3');

const env = require('#config/env');
const { decrypt } = require('#helpers/encrypt-decrypt');

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
  }
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

    const client = new S3Client({
      region: domain.s3_region || 'auto',
      endpoint: domain.s3_endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
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

module.exports = { getS3Client, defaultS3Client };
