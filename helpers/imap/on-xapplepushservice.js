/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

const IMAPError = require('#helpers/imap-error');
const apnsDebug = require('#helpers/apns-debug');

const getApnTopic = require('#helpers/get-apn-topic');
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
// The reply carries the APNs topic iOS subscribes under.  It is our own
// Apple-issued Mail topic (APNS_MAIL_TOPIC, e.g.
// `com.apple.mobilemail.push.net.forwardemail`) when that certificate is
// configured; without it the capability is not advertised.  iOS Mail
// re-registers on every new IMAP session, so a topic change reaches each
// device on its next connection.
//
// imap-core already rejects any aps-subtopic other than
// `com.apple.mobilemail`; Calendar and Contacts register over DAV instead.
//

// APNs device tokens are 32 bytes in hex
const DEVICE_TOKEN_REGEX = /^[\da-f]{64}$/i;

// iOS sends a UUID; it is echoed back in every push payload
const ACCOUNT_ID_REGEX = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;

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
  const debug = {
    alias: session?.user?.alias_id,
    accountId: accountID,
    deviceToken: apnsDebug.maskToken(deviceToken),
    subtopic: subTopic,
    mailboxes
  };
  apnsDebug('XAPPLEPUSHSERVICE received', debug);

  try {
    await this.refreshSession(session, 'XAPPLEPUSHSERVICE');

    if (!session || !session.user || !session.user.alias_id)
      throw new TypeError('Alias does not exist');

    if (
      typeof deviceToken !== 'string' ||
      !DEVICE_TOKEN_REGEX.test(deviceToken)
    )
      throw new IMAPError('Invalid device token');

    if (typeof accountID !== 'string' || !ACCOUNT_ID_REGEX.test(accountID))
      throw new IMAPError('Invalid account ID');

    const aliasId = session.user.alias_id;

    //
    // The topic is resolved first and stored with the registration: the
    // device only accepts pushes on the topic it was given here, so pushes
    // for this row must go out on it even if this process and the one that
    // sends the push are configured differently.
    //
    const topic = await getApnTopic(this.client, 'Mail');
    if (!topic) throw new TypeError('APNs Mail topic unavailable');

    //
    // Step 1: atomically remove ALL existing aps[] entries for this
    // (device_token, subtopic) pair (any account_id).  APNs treats device
    // tokens as case-insensitive hex so we match both casings.  Scoping to
    // subtopic ensures that when Mail re-registers it does not wipe out the
    // Calendar or Contacts entries for the same physical device, and vice
    // versa.  This cleans up stale rows from previous registrations where iOS
    // rotated the account_id.  Mail rows from before subtopics were stored
    // have no subtopic at all, so those are removed with the Mail ones.
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
            subtopic:
              subTopic === 'com.apple.mobilemail'
                ? { $in: [subTopic, null] }
                : subTopic
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
      mailboxes,
      topic
    });
    if (pushResult.matchedCount === 0)
      throw new TypeError('Alias does not exist');

    apnsDebug('XAPPLEPUSHSERVICE registered', { ...debug, topic });
    fn(null, topic);
  } catch (err) {
    apnsDebug('XAPPLEPUSHSERVICE failed', { ...debug, error: err.message });
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onXAPPLEPUSHSERVICE;
