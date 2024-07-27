/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

const refineAndLogError = require('#helpers/refine-and-log-error');

// <https://github.com/nodemailer/wildduck/issues/711>
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
    // update the alias with the provided data
    await Aliases.findOneAndUpdate(
      { id: session.user.alias_id },
      {
        $set: {
          aps_account_id: accountID,
          aps_device_token: deviceToken,
          aps_subtopic: subTopic,
          aps_mailboxes: mailboxes
        }
      }
    );
    fn();
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onXAPPLEPUSHSERVICE;
