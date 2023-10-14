/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const onData = require('./on-data');
const onConnect = require('./on-connect');
const onMailFrom = require('./on-mail-from');
const onRcptTo = require('./on-rcpt-to');

module.exports = {
  onData,
  onConnect,
  onMailFrom,
  onRcptTo
};
