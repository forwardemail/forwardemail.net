/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

function shouldSendDSN(email, recipient, kind) {
  if (!_.isObject(email)) throw new TypeError('Email missing');
  if (!isEmail(recipient)) throw new TypeError('Recipient not valid email');
  if (
    typeof kind !== 'string' ||
    !['SUCCESS', 'FAILURE', 'DELAY'].includes(kind)
  )
    throw new TypeError('Kind must be SUCCESS, FAILURE, or DELAY');

  //
  // API (email.dsn is set via API)
  //
  if (
    _.isObject(email.dsn) &&
    !_.isEmpty(_.compact(Object.values(email.dsn)))
  ) {
    if (isSANB(email.dsn.notify)) {
      if (email.dsn.notify === 'never') return false;
      return kind === email.dsn.notify.toUpperCase();
    }

    if (_.isArray(email.dsn.notify) && email.dsn.notify.length > 0) {
      if (email.dsn.notify.includes('never')) return false;
      return email.dsn.notify.includes(kind.toLowerCase());
    }
  }

  //
  // SMTP (email.rcptTo is set via SMTP)
  //
  if (_.isArray(email.rcptTo) && email.rcptTo.length > 0) {
    //
    // <https://github.com/nodemailer/smtp-server/blob/master/DSN-IMPLEMENTATION.md>
    // <https://nodemailer.com/extras/smtp-server#dsn-delivery-status-notification-support>
    //
    // email.rcptTo[x].dsn.notify = 'SUCCESS', 'FAILURE', 'DELAY', 'NEVER' or an array
    // email.rcptTo[x].dsn.orcpt // original recipient (email, should match RCPT TO value)
    // email.rcptTo[x].dsn.ret = `null`, 'FULL' or 'HDRS'
    // email.rcptTo[x].dsn.envid (String)
    //
    // RCPT TO:<recipient@example.com> NOTIFY=SUCCESS
    //
    // session.envelope = {
    //   dsn: {
    //     ret: null,      // RET parameter from MAIL FROM (FULL or HDRS)
    //     envid: null    // ENVID parameter from MAIL FROM
    //   }
    // }
    //
    // email.rcptTo [
    //   {
    //     address: 'test@foo.com',
    //     args: { NOTIFY: 'SUCCESS,FAILURE,DELAY', ORCPT: 'rfc822;foo@foo.com' },
    //     dsn: { notify: [Array], orcpt: 'rfc822;foo@foo.com' },
    //     name: ''
    //   }
    // ]
    //
    // find matching recipient, if none then return `true` unless `kind` is "success"
    // (this should typically never happen though and is a safeguard)
    //
    const match = email.rcptTo.find(
      (rcptTo) => rcptTo.address.toLowerCase() === recipient.toLowerCase()
    );
    // match {
    //   address: 'test@foo.com',
    //   args: { NOTIFY: 'SUCCESS,FAILURE,DELAY', ORCPT: 'rfc822;foo@foo.com' },
    //   dsn: {
    //     notify: [ 'SUCCESS', 'FAILURE', 'DELAY' ],
    //     orcpt: 'rfc822;foo@foo.com'
    //   },
    //   name: ''
    // }
    if (match) {
      if (_.isObject(match.dsn)) {
        if (typeof match.dsn.notify === 'string') {
          if (match.dsn.notify.toLowerCase() === 'never') return false;
          return kind === match.dsn.notify.toUpperCase();
        }

        if (_.isArray(match.dsn.notify)) {
          if (
            match.dsn.notify.includes('NEVER') ||
            match.dsn.notify.includes('never')
          )
            return false;
          return match.dsn.notify.map((s) => s.toUpperCase()).includes(kind);
        }

        // if no match found then return true (unless success)
        if (kind === 'SUCCESS') return false;

        return true;
      }

      // if no match found then return true (unless success)
      if (kind === 'SUCCESS') return false;
      return true;
    }

    // if no match found then return true (unless success)
    if (kind === 'SUCCESS') return false;

    return true;
  }

  // if no `false` cases found then return true (unless success)
  if (kind === 'SUCCESS') return false;
  return true;
}

module.exports = shouldSendDSN;
