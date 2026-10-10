/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');

const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const _ = require('#helpers/lodash');

//
// Who gets the reminder to turn on two-factor authentication
// (jobs/two-factor-reminder.js): verified, not banned members of a domain on
// a paid plan who sign in with neither a one-time password nor a passkey
// (a passkey is a second factor of its own), at most once every 3 months.
//

function hasSecondFactor(user) {
  return (
    Boolean(user[config.passport.fields.otpEnabled]) ||
    (Array.isArray(user.passkeys) && user.passkeys.length > 0)
  );
}

function wasRemindedRecently(user) {
  return (
    _.isDate(user[config.userFields.twoFactorReminderSentAt]) &&
    dayjs(user[config.userFields.twoFactorReminderSentAt]).isAfter(
      dayjs().subtract(3, 'months')
    )
  );
}

// (checked again for each user right before the email, as either may have
// changed since the users were listed)
function shouldRemind(user) {
  return !hasSecondFactor(user) && !wasRemindedRecently(user);
}

async function getUserIdsToRemind() {
  const _ids = await Domains.distinct('members.user', {
    plan: {
      $in: ['enhanced_protection', 'team']
    }
  });

  return Users.distinct('_id', {
    $and: [
      {
        _id: { $in: _ids },
        [config.userFields.hasVerifiedEmail]: true,
        [config.userFields.isBanned]: false
      },
      {
        $or: [
          {
            [config.userFields.twoFactorReminderSentAt]: {
              $exists: false
            }
          },
          {
            [config.userFields.twoFactorReminderSentAt]: {
              $lte: dayjs().subtract(3, 'months').toDate()
            }
          }
        ]
      },
      {
        [config.passport.fields.otpEnabled]: false
      },
      {
        'passkeys.0': { $exists: false }
      }
    ]
  });
}

module.exports = { getUserIdsToRemind, hasSecondFactor, shouldRemind };
