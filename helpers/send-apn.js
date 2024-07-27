/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const apn = require('@parse/node-apn');
const dayjs = require('dayjs-with-plugins');

const Aliases = require('#models/aliases');
const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');

const apnProvider = new apn.Provider({
  token: {
    key: env.APPLE_KEY_PATH,
    keyId: env.APPLE_KEY_ID,
    teamId: env.APPLE_TEAM_ID
  },
  production: config.env === 'production'
});

// <https://github.com/nodemailer/wildduck/issues/711>
async function sendApn(id) {
  const alias = await Aliases.findOne({
    id,
    aps_account_id: { $exists: true },
    aps_device_token: { $exists: true }
  })
    .lean()
    .select('+aps_account_id +aps_device_doken')
    .exec();

  if (!alias) return;

  const note = new apn.Notification();
  note.topic = 'com.apple.mobilemail';
  note.expiry = dayjs().add(1, 'day').toDate().getTime();
  note.payload = {
    'account-id': alias.aps_account_id
  };

  logger.debug('note', note);

  // note they have commented out code at this below link for setting priority in note
  // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>

  const result = await apnProvider.send(note, alias.aps_device_token);
  logger.debug('apnProvider.send', { result });
}

module.exports = sendApn;
