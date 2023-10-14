/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const revHash = require('rev-hash');

function getBlockedHashes(prefix, date = new Date()) {
  const arr = [];
  const minutes = dayjs(date).minutes();

  if (minutes < 30) {
    // start of hour
    // 30m
    // next hour
    arr.push(
      dayjs().startOf('hour').toDate().getTime(),
      dayjs().startOf('hour').add(30, 'minutes').toDate().getTime(),
      dayjs().startOf('hour').add(1, 'hour').toDate().getTime()
    );
  } else {
    // 30m
    // end of hour
    // end of hour + 30m
    arr.push(
      dayjs().startOf('hour').add(30, 'minutes').toDate().getTime(),
      dayjs().startOf('hour').add(1, 'hour').toDate().getTime(),
      dayjs()
        .startOf('hour')
        .add(1, 'hour')
        .add(30, 'minutes')
        .toDate()
        .getTime()
    );
  }

  return _.uniq(arr.map((a) => revHash(`${prefix}:${a}`)));
}

module.exports = getBlockedHashes;
