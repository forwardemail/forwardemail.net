/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const apn = require('@parse/node-apn');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');

const Aliases = require('#models/aliases');
const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');

const apnProvider =
  env.APPLE_KEY_PATH && env.APPLE_KEY_ID && env.APPLE_TEAM_ID
    ? new apn.Provider({
        token: {
          key: env.APPLE_KEY_PATH,
          keyId: env.APPLE_KEY_ID,
          teamId: env.APPLE_TEAM_ID
        },
        production: config.env === 'production'
      })
    : false;

// <https://github.com/nodemailer/wildduck/issues/711>
async function sendApn(id) {
  if (!apnProvider)
    throw new TypeError(
      'APPLE_KEY_PATH, APPLE_KEY_ID, and APPLE_TEAM_ID required for APN Apple Push Notifications'
    );
  const alias = await Aliases.findOne({
    id
  })
    .lean()
    .select('+aps')
    .exec();

  if (!alias || !Array.isArray(alias.aps) || alias.aps.length === 0) return;

  await pMapSeries(alias.aps, async (obj) => {
    try {
      const note = new apn.Notification();
      note.topic = 'com.apple.mobilemail';
      note.expiry = dayjs().add(1, 'day').toDate().getTime();
      note.payload = {
        'account-id': obj.account_id
      };

      logger.debug('note', note);

      // note they have commented out code at this below link for setting priority in note
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>

      const result = await apnProvider.send(note, obj.device_token);

      // if device returns 410 then unsubscribe on our side too
      if (Array.isArray(result.failed) && result.failed.length > 0) {
        const unregisteredDeviceTokens = result.failed
          .filter((r) => Number.parseInt(r.status, 10) === 410)
          .map((r) => r.device);

        // since there's only one device token
        if (
          unregisteredDeviceTokens.length !== 1 ||
          unregisteredDeviceTokens[0] !== obj.device_token
        )
          throw new TypeError(
            `Device token mismatch ${
              obj.device_token
            } vs. ${unregisteredDeviceTokens.join(', ')}`
          );

        const aliases = await Aliases.find({
          // unsure of likelihood of apple having two of the same device tokens
          // however we have a safeguard below to filter out for pair matches
          'aps.device_token': obj.device_token
        })
          .select('+aps')
          .lean()
          .exec();

        await pMap(
          aliases.map(async (alias) => {
            await Aliases.findByIdAndUpdate(alias._id, {
              $set: {
                aps: alias.aps.filter(
                  (a) =>
                    // filter for pair safeguard
                    a.account_id !== obj.account_id &&
                    a.device_token !== obj.device_token
                )
              }
            });
          }),
          { concurrency: config.concurrency }
        );
      }

      logger.debug('apnProvider.send', { result });
    } catch (err) {
      logger.fatal(err, { obj });
    }
  });
}

module.exports = sendApn;
