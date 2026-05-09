/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

const getApnCerts = require('#helpers/get-apn-certs');
const refineAndLogError = require('#helpers/refine-and-log-error');

//
// IMAP XAPPLEPUSHSERVICE handler.
//
// Apple Mail registers for push notifications via the IMAP
// `XAPPLEPUSHSERVICE` extension; the protocol is documented in
// <https://github.com/nodemailer/wildduck/issues/711> and the dovecot
// x-aps daemon source.
//
// Persistence is now done via atomic `Aliases.updateOne()` instead of
// findOne+save to eliminate the read-modify-write race that affected
// concurrent registrations from the same alias (e.g. when the same iOS
// device subscribes to multiple mailboxes within a single sync window).
// See helpers/dav-apns-subscribe.js for the same pattern on the DAV side.
//
// eslint-disable-next-line max-params
async function onXAPPLEPUSHSERVICE(
  accountID,
  deviceToken,
  subTopic,
  mailboxes,
  session,
  fn
) {
  this.logger.debug('XAPPLEPUSHSERVICE', {
    accountID,
    deviceToken,
    subTopic,
    mailboxes,
    session
  });
  try {
    await this.refreshSession(session, 'XAPPLEPUSHSERVICE');

    if (!session || !session.user || !session.user.alias_id)
      throw new TypeError('Alias does not exist');

    const aliasId = session.user.alias_id;

    //
    // Try to update an existing (account_id, device_token) registration
    // first.  If found, refresh subtopic and mailboxes; otherwise append
    // a new entry atomically with $push.  Both paths avoid the
    // read-modify-write race in the previous findOne+save implementation.
    //
    const matchResult = await Aliases.updateOne(
      {
        id: aliasId,
        'aps.account_id': accountID,
        'aps.device_token': deviceToken
      },
      {
        $set: {
          'aps.$.subtopic': subTopic,
          'aps.$.mailboxes': mailboxes
        }
      }
    );

    if (matchResult.matchedCount === 0) {
      //
      // No existing entry -- append.  We use updateOne here (not save)
      // so concurrent registrations of distinct (account_id, device_token)
      // pairs each successfully $push without overwriting one another.
      //
      const pushResult = await Aliases.updateOne(
        { id: aliasId },
        {
          $push: {
            aps: {
              account_id: accountID,
              device_token: deviceToken,
              subtopic: subTopic,
              mailboxes
            }
          }
        }
      );
      if (pushResult.matchedCount === 0)
        throw new TypeError('Alias does not exist');
    }

    const certs = await getApnCerts(this.client);
    fn(null, certs.Mail.topic);
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onXAPPLEPUSHSERVICE;
