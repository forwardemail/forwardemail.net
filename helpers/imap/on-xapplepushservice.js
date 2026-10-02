/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

const getApnCerts = require('#helpers/get-apn-certs');
const pushApsRegistration = require('#helpers/push-aps-registration');
const refineAndLogError = require('#helpers/refine-and-log-error');

//
// IMAP XAPPLEPUSHSERVICE handler.
//
// Apple Mail registers for push notifications via the IMAP
// `XAPPLEPUSHSERVICE` extension; the protocol is documented in
// <https://github.com/nodemailer/wildduck/issues/711> and the dovecot
// x-aps daemon source.
//
// Registration strategy (atomic, race-free):
//
//   iOS Mail generates a brand-new `account_id` UUID every time it
//   re-registers (after a reboot, iOS update, account remove/re-add, or
//   backup-restore).  The `device_token` is stable across re-registrations
//   for the same physical device.
//
//   The old upsert keyed on (account_id, device_token) meant that each
//   re-registration appended a NEW row instead of replacing the old one,
//   because the account_id changed.  Over time this accumulated dozens of
//   stale rows per device.  The push pipeline's deduplication kept the
//   FIRST (oldest) row, which had an account_id that iOS no longer
//   recognised -- so APNs delivered the push but iOS silently ignored it.
//
//   Fix: on every registration, atomically $pull ALL existing aps[] entries
//   for this device_token (regardless of account_id), then $push the fresh
//   entry.  This guarantees exactly one row per (alias, device_token, subtopic)
//   and ensures the push pipeline always uses the current account_id.
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
    // Step 1: atomically remove ALL existing aps[] entries for this
    // (device_token, subtopic) pair (any account_id).  APNs treats device
    // tokens as case-insensitive hex so we match both casings.  Scoping to
    // subtopic ensures that when Mail re-registers it does not wipe out the
    // Calendar or Contacts entries for the same physical device, and vice
    // versa.  This cleans up stale rows from previous registrations where iOS
    // rotated the account_id.
    //
    await Aliases.updateOne(
      { id: aliasId },
      {
        $pull: {
          aps: {
            device_token: {
              $in: [
                deviceToken,
                deviceToken.toLowerCase(),
                deviceToken.toUpperCase()
              ]
            },
            subtopic: subTopic
          }
        }
      }
    );
    //
    // Step 2: atomically append the fresh registration entry.
    //
    const pushResult = await pushApsRegistration(aliasId, {
      account_id: accountID,
      device_token: deviceToken,
      subtopic: subTopic,
      mailboxes
    });
    if (pushResult.matchedCount === 0)
      throw new TypeError('Alias does not exist');

    const certs = await getApnCerts(this.client);
    fn(null, certs.Mail.topic);
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onXAPPLEPUSHSERVICE;
