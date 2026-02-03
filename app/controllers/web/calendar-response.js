/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Calendar Response Controller
 *
 * Handles unauthenticated calendar invite responses (Accept/Decline/Tentative).
 * This controller ONLY writes to the MongoDB CalendarInvites queue.
 * The actual calendar event update happens when the organizer's CalDAV
 * session processes the queue via middleware.
 *
 * Routes:
 * - GET  /calendar/respond/:response/:token - Display confirmation page
 * - POST /calendar/respond/:response/:token - Process response (one-click or form submit)
 */

const Boom = require('@hapi/boom');

const CalendarInvites = require('#models/calendar-invites');
const {
  parseToken,
  hashToken,
  responseToPartstat
} = require('#helpers/calendar-response');
const {
  checkRateLimit,
  recordResponse,
  isDuplicateResponse
} = require('#helpers/calendar-rate-limit');

/**
 * Display the response confirmation page
 * GET /calendar/respond/:response/:token
 */
async function showResponsePage(ctx) {
  const { response, token } = ctx.params;

  // Validate response type
  let partstat;
  try {
    partstat = responseToPartstat(response);
  } catch {
    throw Boom.badRequest('Invalid calendar response type');
  }

  // Parse and validate token
  let tokenData;
  try {
    tokenData = parseToken(token);
  } catch (err) {
    if (err.code === 'TOKEN_EXPIRED') {
      throw Boom.badRequest('This calendar response link has expired');
    }

    throw Boom.badRequest('Invalid calendar response link');
  }

  // Check rate limiting
  const rateLimitResult = await checkRateLimit(ctx.client, {
    eventUid: tokenData.eventUid,
    attendeeEmail: tokenData.attendeeEmail,
    ip: ctx.ip
  });

  if (rateLimitResult.limited) {
    throw Boom.tooManyRequests(rateLimitResult.reason);
  }

  // Render confirmation page
  ctx.state.tokenData = tokenData;
  ctx.state.response = response;
  ctx.state.partstat = partstat;
  ctx.state.token = token;

  // Map response to user-friendly text
  const responseText = {
    accept: 'Accept Invitation',
    decline: 'Decline Invitation',
    tentative: 'Tentatively Accept'
  };

  ctx.state.responseText = responseText[response] || response;

  await ctx.render('calendar-response');
}

/**
 * Process the response and add to queue
 * POST /calendar/respond/:response/:token
 */
async function processResponse(ctx) {
  const { response, token } = ctx.params;

  // Validate response type
  let partstat;
  try {
    partstat = responseToPartstat(response);
  } catch {
    throw Boom.badRequest('Invalid calendar response type');
  }

  // Parse and validate token
  let tokenData;
  try {
    tokenData = parseToken(token);
  } catch (err) {
    if (err.code === 'TOKEN_EXPIRED') {
      throw Boom.badRequest('This calendar response link has expired');
    }

    throw Boom.badRequest('Invalid calendar response link');
  }

  // Check rate limiting
  const rateLimitResult = await checkRateLimit(ctx.client, {
    eventUid: tokenData.eventUid,
    attendeeEmail: tokenData.attendeeEmail,
    ip: ctx.ip
  });

  if (rateLimitResult.limited) {
    throw Boom.tooManyRequests(rateLimitResult.reason);
  }

  // Check for duplicate response
  const isDuplicate = await isDuplicateResponse(ctx.client, {
    eventUid: tokenData.eventUid,
    attendeeEmail: tokenData.attendeeEmail,
    response: partstat
  });

  if (isDuplicate) {
    // Still show success, but don't create another queue entry
    return showSuccessResponse(ctx, response, tokenData);
  }

  // Create queue entry in MongoDB
  const invite = await CalendarInvites.create({
    eventUid: tokenData.eventUid,
    organizerEmail: tokenData.organizerEmail,
    attendeeEmail: tokenData.attendeeEmail,
    response: partstat,
    comment: ctx.request.body?.comment?.slice(0, 1000),
    ip: ctx.ip,
    userAgent: ctx.headers['user-agent'],
    tokenHash: hashToken(token),
    tokenExpiresAt: tokenData.expiresAt
  });

  ctx.logger.info('Calendar invite response queued', {
    inviteId: invite._id,
    eventUid: tokenData.eventUid,
    attendeeEmail: tokenData.attendeeEmail,
    response: partstat
  });

  // Record response for rate limiting
  await recordResponse(ctx.client, {
    eventUid: tokenData.eventUid,
    attendeeEmail: tokenData.attendeeEmail,
    ip: ctx.ip,
    response: partstat
  });

  return showSuccessResponse(ctx, response, tokenData);
}

/**
 * Show success response (shared between duplicate and new responses)
 */
function showSuccessResponse(ctx, response, tokenData) {
  const responseMessages = {
    accept: 'Your acceptance has been recorded.',
    decline: 'Your decline has been recorded.',
    tentative: 'Your tentative response has been recorded.'
  };

  const message =
    responseMessages[response] || 'Your response has been recorded.';

  if (ctx.accepts('html')) {
    ctx.flash('success', message);
    ctx.redirect(ctx.state.l('/calendar/response-success'));
    return;
  }

  ctx.body = {
    success: true,
    message,
    eventUid: tokenData.eventUid,
    attendeeEmail: tokenData.attendeeEmail,
    response
  };
}

/**
 * Display success page after response
 * GET /calendar/response-success
 */
async function showSuccessPage(ctx) {
  await ctx.render('calendar-response-success');
}

module.exports = {
  showResponsePage,
  processResponse,
  showSuccessPage
};
