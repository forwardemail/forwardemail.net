/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

// 3-63 characters of lowercase letters, digits, dots, and hyphens, starting
// and ending with a letter or digit
const REGEX_BUCKET_NAME = /^[a-z\d][a-z\d.-]{1,61}[a-z\d]$/;

/**
 * Validate an S3 bucket name against the S3 bucket naming rules.
 *
 * The bucket name is interpolated into URLs (path-style and virtual-hosted
 * style), so characters such as "/", "#", "?", "@" or ":" would change the
 * host or path of the request and must never be accepted.
 *
 * @param {string} value bucket name
 * @returns {boolean} whether the value is a valid bucket name
 */
function isValidS3BucketName(value) {
  if (typeof value !== 'string') return false;
  if (!REGEX_BUCKET_NAME.test(value)) return false;
  // adjacent periods are not allowed
  if (value.includes('..')) return false;
  // names formatted as an IP address are not allowed
  if (isIP(value)) return false;
  return true;
}

module.exports = isValidS3BucketName;
