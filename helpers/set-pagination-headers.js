/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const URLParse = require('url-parse');
const qs = require('qs');

// this is a helper function that rewrites the current URL
// to contain an updated querystring value for the page count
function getLink(ctx, page) {
  const url = new URLParse(ctx.href, (query) =>
    qs.parse(query, { ignoreQueryPrefix: true })
  );
  url.query.page = page;
  return url.toString((query) =>
    qs.stringify(query, { addQueryPrefix: true, format: 'RFC1738' })
  );
}

//
// set HTTP headers for pagination
// <https://forwardemail.net/api#pagination>
//
// eslint-disable-next-line max-params
function setPaginationHeaders(
  ctx,
  pageCount = 1,
  currentPage = 1,
  size = 1,
  itemCount = 0
) {
  // return early if it was not an API request
  if (!ctx.api) return;

  // developer and human-friendly easy to parse HTTP pagination headers
  ctx.set('X-Page-Count', pageCount || 1);
  ctx.set('X-Page-Current', currentPage);
  ctx.set('X-Page-Size', size || 1);
  ctx.set('X-Item-Count', itemCount);

  //
  // Set "Link" HTTP header commonly used by other services for pagination
  // This is similar to GitHub (e.g. not all values will be provided if they are not relevant or available, e.g. "next" will not be provided if there is not another page).
  // <https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#using-link-headers>
  //
  // Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev",
  //       <https://api.forwardemail.net/v1/emails?page=3>; rel="next",
  //       <https://api.forwardemail.net/v1/emails?page=3>; rel="last",
  //       <https://api.forwardemail.net/v1/emails?page=1>; rel="first"
  //       (with the values joined by spaces)
  //
  // NOTE: we wouldn't set this for web requests b/c web request already have "rel=canonical" Link header
  //
  const links = [];
  if (currentPage > 1)
    links.push(`<${getLink(ctx, currentPage - 1)}>; rel="prev"`);
  if (size > currentPage)
    links.push(`<${getLink(ctx, currentPage + 1)}>; rel="next"`);
  links.push(
    `<${getLink(ctx, size || 1)})>; rel="last"`,
    `<${getLink(ctx, 1)})>; rel="first"`
  );
  ctx.set('Link', links.join(', '));
}

module.exports = setPaginationHeaders;
