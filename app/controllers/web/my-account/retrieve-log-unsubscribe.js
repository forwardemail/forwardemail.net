/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const getOneClickUnsubscribeUrl = require('#helpers/get-one-click-unsubscribe-url');

const { getHeader } = getOneClickUnsubscribeUrl;

//
// The page that unsubscribes from the mailing list of a log's message with
// one click (RFC 8058, see #309).
//
// We never send the request ourselves: the viewer's browser sends it when
// they click the button (see `assets/js/core.js`), without cookies or a
// referrer, and this page may connect to the list's origin only.
//
async function retrieveLogUnsubscribe(ctx) {
  const href = getOneClickUnsubscribeUrl(ctx.state.log);
  if (!href)
    throw Boom.notFound(ctx.translateError('LOG_UNSUBSCRIBE_UNAVAILABLE'));

  const url = new URL(href);

  const csp = ctx.response.get('Content-Security-Policy');
  if (csp)
    ctx.set(
      'Content-Security-Policy',
      csp.replace(
        /connect-src ([^;]+)/,
        (match, sources) => `connect-src ${sources} ${url.origin}`
      )
    );

  const { headers, envelope } = ctx.state.log.meta.session;
  ctx.state.unsubscribeUrl = href;
  // (the viewer's own recipients of the message, see retrieve-log.js)
  ctx.state.unsubscribeRecipients = [
    ...new Set(
      envelope.rcptTo
        .map((rcpt) => rcpt?.address)
        .filter((address) => isSANB(address))
    )
  ];
  ctx.state.unsubscribeHost = url.hostname;
  ctx.state.unsubscribeFrom = getHeader(headers, 'from');
  ctx.state.unsubscribeSubject = getHeader(headers, 'subject');

  return ctx.render('my-account/logs/unsubscribe');
}

module.exports = retrieveLogUnsubscribe;
