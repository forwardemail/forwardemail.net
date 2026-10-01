/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');

//
// Outbound SMTP thresholds are daily and reset at midnight UTC (regardless of
// the server's timezone)
//

/**
 * Start of the (UTC) day `date` is in.
 *
 * @param {Date} [date] - Any time within the day
 * @returns {Date} Midnight UTC
 */
function getSmtpDayStart(date = new Date()) {
  return dayjs.utc(date).startOf('day').toDate();
}

/**
 * End of the (UTC) day `date` is in.
 *
 * @param {Date} [date] - Any time within the day
 * @returns {Date} Last millisecond of the day (UTC)
 */
function getSmtpDayEnd(date = new Date()) {
  return dayjs.utc(date).endOf('day').toDate();
}

/**
 * Key of the (UTC) day `date` is in.
 *
 * @param {Date} [date] - Any time within the day
 * @returns {string} Day as `YYYY-MM-DD`
 */
function getSmtpDayKey(date = new Date()) {
  return dayjs.utc(date).format('YYYY-MM-DD');
}

module.exports = getSmtpDayStart;
module.exports.getSmtpDayStart = getSmtpDayStart;
module.exports.getSmtpDayEnd = getSmtpDayEnd;
module.exports.getSmtpDayKey = getSmtpDayKey;
