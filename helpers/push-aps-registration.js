/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

//
// Push registrations an alias keeps (Mail via IMAP XAPPLEPUSHSERVICE,
// Calendar and Contacts via the DAV `/apns` endpoint).  A device has one
// per mailbox service and one per calendar or address book, so this leaves
// room for many devices, while registrations made in a loop can neither
// grow the alias document without limit nor make every new message send
// thousands of pushes; the oldest are dropped first.
//
const MAX_APS_REGISTRATIONS = 200;

function pushApsRegistration(aliasId, entry) {
  return Aliases.updateOne(
    { id: aliasId },
    {
      $push: {
        aps: { $each: [entry], $slice: -MAX_APS_REGISTRATIONS }
      }
    }
  );
}

module.exports = pushApsRegistration;
module.exports.MAX_APS_REGISTRATIONS = MAX_APS_REGISTRATIONS;
