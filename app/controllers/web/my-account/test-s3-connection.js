/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { isURL } = require('@forwardemail/validator');

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
 * 3. Perform a HeadBucket call to verify bucket access
 * 4. Perform a PutObject + DeleteObject to verify write permissions
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

  const testClient = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  try {
    // Step 1: Verify bucket exists and credentials are valid
    await testClient.send(new HeadBucketCommand({ Bucket: bucket }));

    // Step 2: Verify write permissions with a test object
    const testKey = `.forwardemail-connection-test-${Date.now()}`;
    await testClient.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: testKey,
        Body: 'connection-test',
        ContentType: 'text/plain'
      })
    );

    // Step 3: Clean up the test object
    await testClient.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: testKey
      })
    );

    // Step 4: Check that the bucket is not publicly accessible
    const isPublic = await checkS3BucketAccess(endpoint, bucket);
    if (isPublic) {
      throw Boom.badRequest(ctx.translateError('CUSTOM_S3_PUBLIC_BUCKET'));
    }
  } catch (err) {
    if (err.isBoom) throw err;
    const errMsg = err.message || 'Unknown error';
    if (ctx.api) {
      throw Boom.badRequest(
        ctx.translateError('CUSTOM_S3_TEST_FAILED', errMsg)
      );
    }

    ctx.flash('error', ctx.translate('CUSTOM_S3_TEST_FAILED', errMsg));
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
