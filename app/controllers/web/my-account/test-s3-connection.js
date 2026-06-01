/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dns = require('node:dns');
const http = require('node:http');
const https = require('node:https');
const net = require('node:net');

const { S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3');
// Resolve NodeHttpHandler from the S3 client's dependency tree (not a direct dep)
const { NodeHttpHandler } = require(require.resolve(
  '@smithy/node-http-handler',
  { paths: [require.resolve('@aws-sdk/client-s3')] }
));
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { isURL } = require('@forwardemail/validator');

const { isPrivateHostResolved } = require('#helpers/is-private-host');
const config = require('#config');
const { Domains } = require('#models');
const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');
const { decrypt } = require('#helpers/encrypt-decrypt');

/**
 * Test the custom S3 connection for a domain.
 *
 * This controller accepts S3 credentials from the request body so users
 * can test their configuration before saving. If credentials are not
 * provided in the request body, it falls back to the saved (encrypted)
 * credentials from the database.
 *
 * Steps:
 * 1. Resolve credentials from request body or database
 * 2. Validate endpoint URL format (must include protocol)
 * 3. Block private/internal endpoints (DNS pinning to prevent rebinding)
 * 4. Perform a read-only HeadBucket call to verify bucket access
 * 5. Check that the bucket is not publicly accessible
 * 6. Return success/failure via JSON (AJAX) or flash (web)
 *
 * @param {Object} ctx - Koa context
 */
async function testS3Connection(ctx) {
  const { body } = ctx.request;

  //
  // Resolve S3 configuration from request body (current form fields)
  // or fall back to saved domain values from the database.
  //
  const endpoint = isSANB(body.s3_endpoint)
    ? body.s3_endpoint
    : ctx.state.domain.s3_endpoint;
  const region = isSANB(body.s3_region)
    ? body.s3_region
    : ctx.state.domain.s3_region || 'auto';
  const bucket = isSANB(body.s3_bucket)
    ? body.s3_bucket
    : ctx.state.domain.s3_bucket;

  //
  // For credentials, prefer request body values (plaintext from the form).
  // If not provided, fall back to saved encrypted values from the database.
  //
  let accessKeyId;
  let secretAccessKey;

  if (isSANB(body.s3_access_key_id)) {
    accessKeyId = body.s3_access_key_id;
  }

  if (isSANB(body.s3_secret_access_key)) {
    secretAccessKey = body.s3_secret_access_key;
  }

  //
  // If either credential is missing from the request body,
  // load the saved encrypted credentials from the database.
  //
  if (!accessKeyId || !secretAccessKey) {
    const domain = await Domains.findById(ctx.state.domain._id).select(
      '+s3_access_key_id +s3_secret_access_key'
    );

    if (!domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    if (!accessKeyId && isSANB(domain.s3_access_key_id)) {
      try {
        accessKeyId = decrypt(domain.s3_access_key_id);
      } catch {
        accessKeyId = domain.s3_access_key_id;
      }
    }

    if (!secretAccessKey && isSANB(domain.s3_secret_access_key)) {
      try {
        secretAccessKey = decrypt(domain.s3_secret_access_key);
      } catch {
        secretAccessKey = domain.s3_secret_access_key;
      }
    }
  }

  // Validate that all required fields are present
  if (!isSANB(endpoint) || !accessKeyId || !secretAccessKey || !isSANB(bucket))
    throw Boom.badRequest(ctx.translateError('CUSTOM_S3_REQUIRED_FIELDS'));

  //
  // Validate endpoint URL format using the same isURL check
  // as the domain model schema (requires http:// or https:// protocol).
  // This prevents the test from succeeding with a bare hostname
  // that would then fail on save due to schema validation.
  //
  if (!isURL(endpoint, config.isURLOptions))
    throw Boom.badRequest(ctx.translateError('CUSTOM_S3_INVALID_ENDPOINT'));

  //
  // Block private/internal network endpoints to prevent SSRF attacks.
  //
  let parsedEndpoint;
  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    throw Boom.badRequest(ctx.translateError('CUSTOM_S3_INVALID_ENDPOINT'));
  }

  if (await isPrivateHostResolved(parsedEndpoint.hostname)) {
    throw Boom.badRequest(ctx.translateError('CUSTOM_S3_INVALID_ENDPOINT'));
  }

  //
  // FWD-01-002: DNS pinning to prevent TOCTOU DNS rebinding.
  // Resolve the hostname NOW and force all subsequent HTTP requests
  // to use the resolved IP via a custom request handler with overridden
  // lookup(). This ensures the IP validated above is the same IP used
  // for the actual S3 requests.
  //
  const resolver = new dns.promises.Resolver({ timeout: 5000, tries: 2 });
  let pinnedIP;
  try {
    const isIPv6 = net.isIPv6(parsedEndpoint.hostname);
    const isIPv4 = net.isIPv4(parsedEndpoint.hostname);
    if (isIPv4 || isIPv6) {
      pinnedIP = parsedEndpoint.hostname;
    } else {
      const addresses = await resolver.resolve4(parsedEndpoint.hostname);
      if (!addresses || addresses.length === 0)
        throw new Error('No DNS records');
      pinnedIP = addresses[0];
    }
  } catch {
    throw Boom.badRequest(ctx.translateError('CUSTOM_S3_INVALID_ENDPOINT'));
  }

  // Double-check the resolved IP is not private (defense in depth)
  if (await isPrivateHostResolved(pinnedIP)) {
    throw Boom.badRequest(ctx.translateError('CUSTOM_S3_INVALID_ENDPOINT'));
  }

  // Create a custom request handler that pins DNS to the resolved IP.
  // Node 22+ calls lookup with {all:true} expecting [{address, family}] array.
  const family = net.isIPv6(pinnedIP) ? 6 : 4;
  const pinnedLookup = (_hostname, options, cb) => {
    if (options.all) {
      cb(null, [{ address: pinnedIP, family }]);
    } else {
      cb(null, pinnedIP, family);
    }
  };

  const requestHandler = new NodeHttpHandler({
    connectionTimeout: 5000,
    socketTimeout: 10_000,
    httpsAgent: new https.Agent({ lookup: pinnedLookup }),
    httpAgent: new http.Agent({ lookup: pinnedLookup })
  });

  const testClient = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    requestHandler,
    // Disable automatic checksum headers (x-amz-checksum-crc32)
    // for compatibility with S3-compatible providers like Backblaze B2
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED'
  });

  try {
    //
    // FWD-01-002: Only perform a read-only HeadBucket probe.
    // Previously this endpoint also performed PutObject + DeleteObject which
    // allowed an authenticated user to make the server write/delete objects on
    // an attacker-controlled S3-compatible endpoint. Restricting to HeadBucket
    // verifies connectivity and credential validity without outbound writes.
    //
    await testClient.send(new HeadBucketCommand({ Bucket: bucket }));

    // Check that the bucket is not publicly accessible
    const isPublic = await checkS3BucketAccess(endpoint, bucket);
    if (isPublic) {
      throw Boom.badRequest(ctx.translateError('CUSTOM_S3_PUBLIC_BUCKET'));
    }
  } catch (err) {
    if (err.isBoom) throw err;

    // Map SDK error codes to generic user-facing messages
    // to avoid leaking internal infrastructure details (FWD-01-005).
    let userMessage;
    const code = err.Code || err.name || '';
    switch (code) {
      case 'NoSuchBucket':
      case 'NotFound': {
        userMessage = 'Bucket not found';

        break;
      }

      case 'InvalidAccessKeyId':
      case 'SignatureDoesNotMatch': {
        userMessage = 'Invalid credentials';

        break;
      }

      case 'AccessDenied':
      case 'Forbidden':
      case 'AllAccessDisabled': {
        userMessage = 'Access denied';

        break;
      }

      default: {
        if (err.message && err.message.includes('getaddrinfo')) {
          userMessage = 'Endpoint hostname could not be resolved';
        } else if (
          err.code === 'ECONNREFUSED' ||
          err.code === 'ETIMEDOUT' ||
          err.code === 'ENOTFOUND'
        ) {
          userMessage = 'Could not connect to endpoint';
        } else {
          userMessage = 'Connection test failed';
        }
      }
    }

    ctx.logger.error(err);

    if (ctx.api) {
      throw Boom.badRequest(
        ctx.translateError('CUSTOM_S3_TEST_FAILED', userMessage)
      );
    }

    ctx.flash('error', ctx.translate('CUSTOM_S3_TEST_FAILED', userMessage));
    if (ctx.accepts('html')) return ctx.redirect('back');
    ctx.body = { reloadPage: true };
    return;
  } finally {
    testClient.destroy();
  }

  // Success
  if (ctx.api) {
    ctx.body = {
      message: ctx.translate('CUSTOM_S3_TEST_SUCCESS')
    };
    return;
  }

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('CUSTOM_S3_TEST_SUCCESS'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = testS3Connection;
