/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function getTime(value) {
  if (!value) return Number.NaN;
  return new Date(value).getTime();
}

//
// How long an outbound email took to deliver in milliseconds: from when it
// was queued (or the time it was scheduled for, if later) to its latest
// successful delivery, or `undefined` if none of it was delivered yet
// (stored as `delivery_time`, see app/models/emails.js)
//
function getEmailDeliveryTime(email) {
  if (!email || !Array.isArray(email.deliveries)) return;

  let last = Number.NaN;
  for (const delivery of email.deliveries) {
    const time = getTime(delivery?.date);
    if (Number.isFinite(time) && (Number.isNaN(last) || time > last))
      last = time;
  }

  let start = getTime(email.created_at);
  const date = getTime(email.date);
  if (Number.isFinite(date) && (Number.isNaN(start) || date > start))
    start = date;

  if (!Number.isFinite(last) || !Number.isFinite(start)) return;
  return Math.max(0, last - start);
}

module.exports = getEmailDeliveryTime;
