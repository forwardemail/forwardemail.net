/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');

//
// The "Published" date a byline shows: the route's publishedISOString when
// there is one, otherwise the start of the current month, in the signed in
// visitor's timezone where one is known. One implementation for both
// bylines (_author.pug and the fe page header) so they cannot disagree.
//
// Returns `time` (ms since the epoch, for the .dayjs element core.js
// reformats on the client) and `formatted` (the server-rendered M/D/YY).
//
function getPublishedDate(publishedISOString, user) {
  let date = publishedISOString
    ? dayjs(new Date(publishedISOString))
    : dayjs().startOf('month');

  if (user && user.timezone) {
    // "Etc/Unknown" is what the client reports when it cannot tell.
    const tz = user.timezone === 'Etc/Unknown' ? 'UTC' : user.timezone;
    date = publishedISOString ? date.tz(tz) : dayjs().tz(tz).startOf('month');
  }

  return {
    time: publishedISOString
      ? new Date(publishedISOString).getTime()
      : dayjs().startOf('month').toDate().getTime(),
    formatted: date.format('M/D/YY')
  };
}

module.exports = getPublishedDate;
