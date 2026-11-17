/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const { encrypt, decrypt } = require('./encrypt-decrypt');

const config = require('#config');

/**
 * Generate an unsubscribe token for a user
 * @param {string} email - User's email address
 * @param {string} [template] - Optional template name (for template-specific unsubscribe)
 * @returns {string} Encrypted token
 */
function generateUnsubscribeToken(email, template) {
  if (!email) throw new TypeError('Email is required');

  const payload = {
    e: email.toLowerCase().trim(),
    t: template || null, // null means unsubscribe from all
    ts: Date.now()
  };

  return encrypt(JSON.stringify(payload));
}

/**
 * Parse an unsubscribe token
 * @param {string} token - Encrypted token
 * @returns {Object} Parsed payload with email and template
 */
function parseUnsubscribeToken(token) {
  if (!token) throw new TypeError('Token is required');

  const decrypted = decrypt(token);
  const payload = JSON.parse(decrypted);

  if (!payload.e) throw new Error('Invalid token: missing email');

  return {
    email: payload.e,
    template: payload.t || null,
    timestamp: payload.ts
  };
}

/**
 * Generate an unsubscribe URL
 * @param {string} email - User's email address
 * @param {string} [template] - Optional template name
 * @param {string} [locale='en'] - Locale for the URL
 * @returns {string} Full unsubscribe URL
 */
function generateUnsubscribeLink(email, template, locale = 'en') {
  const token = generateUnsubscribeToken(email, template);
  return `${config.urls.web}/${locale}/unsubscribe/${encodeURIComponent(
    token
  )}`;
}

/**
 * Generate List-Unsubscribe header value
 * @param {string} email - User's email address
 * @param {string} [template] - Optional template name
 * @param {string} [locale='en'] - Locale for the URL
 * @returns {string} List-Unsubscribe header value
 */
function generateListUnsubscribeHeader(email, template, locale = 'en') {
  const url = generateUnsubscribeLink(email, template, locale);
  return `<${url}>`;
}

//
// What is kept of an address without an account, in place of the address
// (see app/models/email-opt-outs.js and app/models/free-plan-intros.js)
//
function hashEmail(email) {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

module.exports = {
  hashEmail,
  generateUnsubscribeToken,
  parseUnsubscribeToken,
  generateUnsubscribeLink,
  generateListUnsubscribeHeader
};
