/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

/**
 * Return Cloudflare Radar's domain-specific categorization-feedback URL.
 *
 * @param   {string} domain Domain name that was classified
 * @returns {string}
 */
function getCloudflareRadarFeedbackUrl(domain) {
  return `https://radar.cloudflare.com/domains/${encodeURIComponent(
    punycode.toASCII(domain.trim().toLowerCase())
  )}`;
}

module.exports = getCloudflareRadarFeedbackUrl;
