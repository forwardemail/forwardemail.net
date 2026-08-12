/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');

const env = require('#config/env');

function getApiSecrets() {
  const values = Array.isArray(env.API_SECRETS)
    ? env.API_SECRETS
    : typeof env.API_SECRETS === 'string'
    ? env.API_SECRETS.split(',')
    : [];

  return values.filter((value) => typeof value === 'string' && value);
}

function getPrimaryApiSecret() {
  const [secret] = getApiSecrets();
  if (!secret)
    throw new TypeError('API_SECRETS must contain at least one secret');
  return secret;
}

function isValidApiSecret(value) {
  if (typeof value !== 'string' || !value) return false;

  const provided = Buffer.from(value);
  let isValid = false;

  for (const secret of getApiSecrets()) {
    const candidate = Buffer.from(secret);
    if (
      provided.length === candidate.length &&
      crypto.timingSafeEqual(provided, candidate)
    ) {
      isValid = true;
    }
  }

  return isValid;
}

module.exports = {
  getApiSecrets,
  getPrimaryApiSecret,
  isValidApiSecret
};
