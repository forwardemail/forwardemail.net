/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const http = require('node:http');
const https = require('node:https');
const { lookup: dnsLookup } = require('node:dns/promises');

const isPrivateHost = require('#helpers/is-private-host');
const isValidS3BucketName = require('#helpers/is-valid-s3-bucket-name');

/**
 * Check if an S3-compatible bucket is publicly accessible.
 *
 * This performs an anonymous (unauthenticated) HTTP request to the bucket
 * endpoint to determine if the bucket allows public access.
 * This approach is portable across all S3-compatible providers
 * (AWS S3, Cloudflare R2, MinIO, Backblaze B2, DigitalOcean Spaces, etc.)
 *
 * Detection strategy:
 * 1. Construct the bucket URL from the endpoint and bucket name
 * 2. Make an anonymous GET request (no auth headers)
 * 3. If the response status is 200, the bucket is publicly accessible
 * 4. If the response status is 403/401/other, the bucket is private (good)
 *
 * @param {string} endpoint - The S3 endpoint URL (e.g. https://s3.amazonaws.com)
 * @param {string} bucket - The bucket name
 * @param {number} [timeout=10000] - Request timeout in milliseconds
 * @param {object} [resolver] - Optional Tangerine resolver instance (Redis-backed, cached)
 * @returns {Promise<boolean>} true if the bucket is publicly accessible, false otherwise
 */
async function checkS3BucketAccess(
  endpoint,
  bucket,
  timeout = 10000,
  resolver
) {
  //
  // Try two common URL patterns for S3-compatible services:
  // 1. Path-style: https://endpoint/bucket (most compatible)
  // 2. Virtual-hosted-style: https://bucket.endpoint/ (AWS default)
  //
  // We try path-style first since it works with most S3-compatible providers
  //
  let endpointUrl;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    // Invalid endpoint URL — treat as not public
    return false;
  }

  if (endpointUrl.protocol !== 'https:' && endpointUrl.protocol !== 'http:')
    return false;

  //
  // The bucket name is interpolated into both URLs below; a name containing
  // "/", "#", "?", "@" or ":" would change the host that is requested
  // (e.g. "127.0.0.1/.s3.example.com" as a virtual-hosted-style label).
  //
  if (!isValidS3BucketName(bucket)) return false;

  // Path-style URL: https://endpoint/bucket
  const pathStyleUrl = new URL(`/${bucket}`, endpointUrl).href;

  const isPublic = await _anonymousRequest(pathStyleUrl, timeout, resolver);
  if (isPublic) return true;

  //
  // Also try virtual-hosted-style for AWS S3 and compatible providers
  // https://bucket.s3.region.amazonaws.com/
  //
  try {
    const virtualHostUrl = new URL(endpointUrl);
    virtualHostUrl.hostname = `${bucket}.${endpointUrl.hostname}`;
    virtualHostUrl.pathname = '/';
    const isPublicVirtual = await _anonymousRequest(
      virtualHostUrl.href,
      timeout,
      resolver
    );
    if (isPublicVirtual) return true;
  } catch {
    // Virtual-hosted-style URL construction failed, ignore
  }

  return false;
}

/**
 * Make an anonymous HTTP(S) request and check if it returns 200.
 * A 200 response indicates the resource is publicly accessible.
 *
 * Includes DNS rebinding protection: resolved IPs are checked against
 * private/reserved ranges before the connection is established.
 *
 * @param {string} url - The URL to request
 * @param {number} timeout - Request timeout in milliseconds
 * @param {object} [resolver] - Optional Tangerine resolver instance
 * @returns {Promise<boolean>} true if response is 200, false otherwise
 * @private
 */
async function _anonymousRequest(url, timeout, resolver) {
  //
  // Validate the target before any request is made.  The connect-time lookup
  // below is only invoked for hostnames; IP-literal hosts
  // (e.g. http://169.254.169.254) are connected to directly, so they (and
  // every address a hostname resolves to) are checked here first.
  //
  try {
    const { hostname } = new URL(url);
    if (await checkS3BucketAccess.isPrivateTarget(hostname, resolver))
      return false;
  } catch {
    return false;
  }

  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const transport = parsedUrl.protocol === 'https:' ? https : http;

      const req = transport.get(
        url,
        {
          timeout,
          headers: {
            // No Authorization header — this is an anonymous request
            'User-Agent': 'ForwardEmail-BucketCheck/1.0'
          },
          // Prevent SSRF via DNS rebinding: validate resolved IP at connect time.
          // Use Tangerine resolver if available (Redis-backed cache),
          // otherwise fall back to node:dns/promises lookup.
          lookup(hostname, options, cb) {
            const lookupFn = resolver
              ? (h, opts) => resolver.lookup(h, opts)
              : (h, opts) => dnsLookup(h, opts);
            lookupFn(hostname, options)
              .then((result) => {
                if (result?.address && isPrivateHost(result.address)) {
                  const err = new Error(
                    `Resolved IP ${result.address} is a private/reserved address`
                  );
                  err.code = 'EPRIVATEADDR';
                  cb(err);
                  return;
                }

                cb(null, result?.address, result?.family);
              })
              .catch((err) => cb(err));
          }
        },
        (res) => {
          // Consume the response body to free up resources
          res.resume();
          // 200 means the bucket listing is publicly accessible
          resolve(res.statusCode === 200);
        }
      );

      req.on('error', () => {
        // Network error, DNS failure, etc. — treat as not public
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      // URL parsing or other error — treat as not public
      resolve(false);
    }
  });
}

// (exposed so tests against local servers can allow loopback targets)
checkS3BucketAccess.isPrivateTarget = isPrivateHost.isPrivateHostResolved;

module.exports = checkS3BucketAccess;
