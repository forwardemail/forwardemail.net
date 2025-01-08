/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function isAutoReplyOrMailingList(headers) {
  return (
    //
    // don't send bounces for content type with multipart/report
    //
    // NOTE: we might want to improve this accuracy in future
    //       <https://github.com/zone-eu/zone-mta/issues/432#:~:text=You%20only%20check%20Content%2DType%20for%20multipart/report%20right%20now%2C%20but%20you%20might%20want%20to%20specifically%20check%20against%20report%2Dtype%20of%20delivery%2Dstatus%20or%20delivery%2Dnotification%20for%20accuracy.>
    // https://github.com/zone-eu/zone-mta/blob/49cc03a6dba473f4e6e585ca6f0b2b956a0fa77f/lib/bounces.js#L170-L183
    (headers.hasHeader('content-type') &&
      /^multipart\/report\b/i.test(headers.getFirst('content-type'))) ||
    //
    // if the message had any of these headers then don't send bounce
    // <https://www.jitbit.com/maxblog/18-detecting-outlook-autoreplyout-of-office-emails-and-x-auto-response-suppress-header/>
    // <https://github.com/nodemailer/smtp-server/issues/129>
    // <https://www.arp242.net/autoreply.html>
    // <https://datatracker.ietf.org/doc/html/rfc5230#section-4.6>
    //
    // NOTE: hasHeader from mailsplit library is case-insensitive and trimmed
    //
    (headers.hasHeader('auto-submitted') &&
      headers.getFirst('auto-submitted').toLowerCase().trim() !== 'no') ||
    (headers.hasHeader('x-auto-response-suppress') &&
      ['dr', 'autoreply', 'auto-reply', 'auto_reply', 'all'].includes(
        headers.getFirst('x-auto-response-suppress').toLowerCase().trim()
      )) ||
    headers.hasHeader('list-id') ||
    headers.hasHeader('list-subscribe') ||
    headers.hasHeader('list-unsubscribe') ||
    headers.hasHeader('list-help') ||
    headers.hasHeader('list-post') ||
    headers.hasHeader('list-owner') ||
    headers.hasHeader('list-archive') ||
    headers.hasHeader('x-autoreply') ||
    headers.hasHeader('x-autorespond') ||
    headers.hasHeader('x-auto-respond') ||
    (headers.hasHeader('precedence') &&
      ['bulk', 'autoreply', 'auto-reply', 'auto_reply', 'list'].includes(
        headers.getFirst('precedence').toLowerCase().trim()
      ))
  );
}

module.exports = isAutoReplyOrMailingList;
