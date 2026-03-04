/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

//
// Maps SMTP response codes to appropriate HTTP Boom errors.
// This is the inverse of `get-error-code.js` (which maps HTTP/Boom -> SMTP).
//
// <https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes>
//
// NOTE: this is used by API and webmail layers to convert SMTP-layer
//       errors (e.g. from `Emails.queue`) into proper HTTP status codes
//       so that clients receive meaningful responses instead of generic 500.
//
function smtpCodeToHttpError(err) {
  // only map errors that have a numeric SMTP responseCode and are not already Boom errors
  if (err.isBoom || typeof err.responseCode !== 'number') return err;

  const { responseCode, message } = err;

  //
  // 4xx SMTP codes (temporary failures)
  //
  // 421 - Service not available / rate limiting / try again later
  // 450 - Mailbox unavailable (busy, try again)
  // 451 - Local error in processing
  // 452 - Insufficient storage / too many recipients
  //
  if (responseCode === 421 || responseCode === 450 || responseCode === 452)
    return Boom.tooManyRequests(message);

  // other 4xx codes are temporary/retryable
  if (responseCode >= 400 && responseCode < 500)
    return Boom.serverUnavailable(message);

  //
  // 5xx SMTP codes (permanent failures)
  //
  // 530 - Authentication required
  if (responseCode === 530) return Boom.unauthorized(message);

  // 535 - Authentication credentials invalid
  if (responseCode === 535) return Boom.forbidden(message);

  // 550 - Mailbox unavailable / action not taken (e.g. user not found, policy rejection)
  // 553 - Mailbox name not allowed / invalid address
  // 554 - Transaction failed
  if (responseCode === 550 || responseCode === 553 || responseCode === 554)
    return Boom.badRequest(message);

  // 552 - Message size exceeded
  if (responseCode === 552) return Boom.entityTooLarge(message);

  // 551 - User not local
  if (responseCode === 551) return Boom.badRequest(message);

  // other 5xx codes default to bad request (permanent failure)
  if (responseCode >= 500 && responseCode < 600)
    return Boom.badRequest(message);

  return err;
}

module.exports = smtpCodeToHttpError;
