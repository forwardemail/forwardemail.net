/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const apn = require('@parse/node-apn');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');
const splitLines = require('split-lines');

const Aliases = require('#models/aliases');
const config = require('#config');
const getApnCerts = require('#helpers/get-apn-certs');
const logger = require('#helpers/logger');

let certs;
let provider;

function createNote(obj) {
  // <https://github.com/argon/push_notify/blob/05b3d8025b217694e45eab8202f3d460f9237652/lib/controller.js#L48>
  // https://github.com/argon/push_notify/pull/6#issue-179062203
  const note = new apn.Notification();

  // NOTE: without this fix, the notification is sent and not displayed (?)
  // <https://github.com/node-apn/node-apn/issues/638>
  note.urlArgs = [];

  note.pushType = 'alert';
  note.topic = certs.Contact.topic;
  note.expiry = Math.floor(dayjs().add(24, 'hour').toDate().getTime() / 1000);

  note.aps = {
    'account-id': obj.account_id
  };

  return note;
}

// Send APN for Contacts (CardDAV) changes
// <https://github.com/nodemailer/wildduck/issues/711>
async function sendApnContacts(client, id) {
  const alias = await Aliases.findOne({
    id
  })
    .lean()
    .select('+aps')
    .exec();

  if (!alias || !Array.isArray(alias.aps) || alias.aps.length === 0) return;

  //
  // long-lived cached provider
  //
  // NOTE: we do not call `provider.shutdown(fn)` because we keep it alive
  //
  if (
    !provider ||
    !provider?.client?.session ||
    provider?.client?.session?.closed ||
    provider?.client?.session?.destroyed
  ) {
    certs = await getApnCerts(client);

    // Extract topic from Contact certificate (similar to Mail topic extraction)
    // The topic is the UID from the certificate subject
    if (!certs.Contact.topic) {
      const cert = new crypto.X509Certificate(certs.Contact.certificate);
      certs.Contact.topic = splitLines(cert.subject)[0].split('UID=')[1].trim();
    }

    provider = new apn.Provider({
      logger,
      cert: certs.Contact.certificate,
      key: certs.Contact.privateKey,
      requestTimeout: ms('15s'),
      production: true // always required
    });
  }

  await pMap(alias.aps, async (obj) => {
    try {
      //
      // NOTE: we only attempt to send to the account ID + device token pair once every minute
      //
      const key = `aps_contacts_check:${revHash(obj.account_id)}:${revHash(
        obj.device_token
      )}`;
      const cache = await client.get(key);
      if (cache) return;
      await client.set(key, true, 'PX', ms('1m'));

      // artificial 10s delay
      await setTimeout(ms('10s'));

      const note = createNote(obj);

      // <https://github.com/parse-community/node-apn/issues/114>
      const result = await provider.send(note, obj.device_token);

      // NOTE: if device returns 410 then unsubscribe on our side too
      if (Array.isArray(result.failed) && result.failed.length > 0) {
        const unregisteredDeviceTokens = result.failed
          .filter((r) => Number.parseInt(r.status, 10) === 410)
          .map((r) => r.device);

        if (unregisteredDeviceTokens.length === 0) {
          const err = new TypeError('APS Contacts failed');
          err.isCodeBug = true;
          err.result = result;
          logger.fatal(err);
          return;
        }

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
          aliases,
          async (alias) => {
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
          },
          { concurrency: config.concurrency }
        );
      } else {
        // trigger sending the note again in another 20s
        // (just to be sure the device refreshes)
        await setTimeout(ms('20s'));
        const note = createNote(obj);
        provider
          .send(note, obj.device_token)
          .then()
          .catch((err) => logger.fatal(err));
      }
    } catch (err) {
      logger.fatal(err, { obj });
    }
  });
}

module.exports = sendApnContacts;
