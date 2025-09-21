/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

const getApnCerts = require('#helpers/get-apn-certs');
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
    const alias = await Aliases.findOne({ id: session.user.alias_id })
      .select('+aps')
      .exec();

    if (!alias) throw new TypeError('Alias does not exist');

    if (!Array.isArray(alias.aps)) alias.aps = [];

    const match = alias.aps.find(
      (a) => a.account_id === accountID && a.device_token === deviceToken
    );

    if (match) {
      match.subtopic = subTopic;
      match.mailboxes = mailboxes;
    } else {
      alias.aps.push({
        account_id: accountID,
        device_token: deviceToken,
        subtopic: subTopic,
        mailboxes
      });
    }

    await alias.save();

    // Mark session as using Apple Push Service for client detection
    session.applePushServiceUsed = true;

    const certs = await getApnCerts(this.client);
    fn(null, certs.Mail.topic);
  } catch (err) {
    fn(refineAndLogError(err, session, true, this));
  }
}

module.exports = onXAPPLEPUSHSERVICE;
