/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const apn = require('@parse/node-apn');
const dayjs = require('dayjs-with-plugins');
const pMap = require('p-map');
const pMapSeries = require('p-map-series');

const Aliases = require('#models/aliases');
const config = require('#config');
const getApnCerts = require('#helpers/get-apn-certs');
const logger = require('#helpers/logger');

// <https://github.com/nodemailer/wildduck/issues/711>
async function sendApn(client, id, mailboxPath = 'INBOX') {
  const alias = await Aliases.findOne({
    id
  })
    .lean()
    .select('+aps')
    .exec();

  if (!alias || !Array.isArray(alias.aps) || alias.aps.length === 0) return;

  await pMapSeries(alias.aps, async (obj) => {
    try {
      const certs = await getApnCerts(client);

      console.log('certs', certs);

      // const caName = await client.get('aps_ca');

      const provider = new apn.Provider({
        logger,
        cert: certs.Mail.certificate,
        key: certs.Mail.privateKey,
        // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L26>
        // ca: GEO_TRUST_CA,
        // rejectUnauthorized: false, // only needed if GEO_TRUST_CA passed
        production: true // always required
      });

      // <https://github.com/argon/push_notify/blob/05b3d8025b217694e45eab8202f3d460f9237652/lib/controller.js#L48>
      // https://github.com/argon/push_notify/pull/6#issue-179062203
      const note = new apn.Notification();

      // NOTE: without this fix, the notificatin is sent and not displayed (?)
      // <https://github.com/node-apn/node-apn/issues/638>
      note.urlArgs = [];

      note.pushType = 'alert';
      note.topic = certs.Mail.topic;
      note.expiry = Math.floor(
        dayjs().add(24, 'hour').toDate().getTime() / 1000
      );

      note.aps = {
        'account-id': obj.account_id,
        // <https://github.com/freswa/dovecot-xaps-daemon/issues/39#issuecomment-2262987315>
        // TODO: does it need to be an Array or single value?
        // m: crypto.createHash('md5').update(mailboxPath).digest('hex')
        m: [crypto.createHash('md5').update(mailboxPath).digest('hex')]
      };

      // <https://github.com/parse-community/node-apn/issues/114>
      const result = await provider.send(note, obj.device_token);

      // cleanup resources/memory
      provider.shutdown();

      //
      // NOTE: it's not as simple as setting topic to `com.apple.mobilemail`
      // <https://lists.andrew.cmu.edu/pipermail/info-cyrus/2017-August/039743.html#:~:text=aps_topic%3A%20com.apple.mail.XServer.xxxxxxxxxxxxxxx%0A%0Aaps_topic%20is%20the%20common%20name%20take%20from%20the%20certificate.%20It%E2%80%99s%20sent%20to%20the%20mobile%20device%20so%20that%20it%20will%20match%20the%20source%20of%20the%20push%20notification%20when%20it%20arrives.>
      // note.topic = 'com.apple.mobilemail';
      //
      // instead, the topic is extracted from the common name of the certificate:
      //
      // note.topic = 'com.apple.mail.XServer.xxxxxxxxxxxxxxx';
      //
      // to extract the <UUID> portion we need to follow similar process to this
      // (but in a more automated way)
      // <https://github.com/jcvernaleo/macports-ports/blob/72f6ba4623151b6171ed2262af0bcaba88d3dd93/mail/dovecot/Portfile#L216-L247>
      //

      // note they have commented out code at this below link for setting priority in note
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>

      // NOTE: if device returns 410 then unsubscribe on our side too
      if (Array.isArray(result.failed) && result.failed.length > 0) {
        const err = new TypeError(`APS failed (device unsubscribed?)`);
        err.isCodeBug = true;
        err.result = result;
        logger.fatal(err);

        const unregisteredDeviceTokens = result.failed
          .filter((r) => Number.parseInt(r.status, 10) === 410)
          .map((r) => r.device);

        if (unregisteredDeviceTokens.length === 0) return;

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
    } catch (err) {
      logger.fatal(err, { obj });
    }
  });
}

module.exports = sendApn;
