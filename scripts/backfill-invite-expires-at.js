/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// One-time cleanup for legacy domain invites.
//
// Invites created before the current token-based system have no `token`
// and/or no `expires_at`. Both fields are now required on the Invite
// subdocument, so a single legacy invite makes the whole domain fail
// validation on save with "Expires at is required", which blocks adding
// OR removing any invite. These old invites also can no longer be accepted
// (acceptance requires a `token`), so they are dead data.
//
// Rather than guessing values, we simply REMOVE any invite that is missing
// `token` or `expires_at`. This is done with a single atomic `$pull` so it
// never triggers full-document Mongoose validation and cannot affect any
// other field on the domain.
//
// Usage:
//   node scripts/backfill-invite-expires-at.js            # apply
//   node scripts/backfill-invite-expires-at.js --dry-run  # report only
//

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const { Domains } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const DRY_RUN = process.argv.includes('--dry-run');

//
// A legacy invite is one missing `token` OR `expires_at`
// (covers both absent fields and explicit null values).
//
const LEGACY_INVITE = {
  $or: [
    { token: { $in: [null] } },
    { token: { $exists: false } },
    { expires_at: { $in: [null] } },
    { expires_at: { $exists: false } }
  ]
};

// domains that contain at least one legacy invite
const FILTER = { invites: { $elemMatch: LEGACY_INVITE } };

(async () => {
  try {
    await setupMongoose(logger);

    //
    // Report how many domains / invites are affected before changing anything.
    //
    const [stats] = await Domains.collection
      .aggregate([
        { $match: FILTER },
        {
          $project: {
            legacy: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$invites', []] },
                  as: 'inv',
                  cond: {
                    $or: [
                      { $in: [{ $type: '$$inv.token' }, ['missing', 'null']] },
                      {
                        $in: [
                          { $type: '$$inv.expires_at' },
                          ['missing', 'null']
                        ]
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            domains: { $sum: 1 },
            invites: { $sum: '$legacy' }
          }
        }
      ])
      .toArray();

    const domains = stats?.domains || 0;
    const invites = stats?.invites || 0;

    console.log(
      `Found ${invites} legacy invite(s) missing token/expires_at across ${domains} domain(s)`
    );

    if (domains === 0) {
      console.log('Nothing to clean up.');
      process.exit(0);
    }

    if (DRY_RUN) {
      console.log('Dry run — no changes written.');
      process.exit(0);
    }

    //
    // Atomically remove the legacy invites. `$pull` does not re-run
    // full-document validation, so it cannot fail on (or alter) any
    // other invite or field.
    //
    const result = await Domains.collection.updateMany(FILTER, {
      $pull: { invites: LEGACY_INVITE }
    });

    console.log(
      `Cleanup complete — matched ${result.matchedCount}, modified ${result.modifiedCount} domain(s)`
    );

    process.exit(0);
  } catch (err) {
    console.error('Error during invite cleanup:', err);
    process.exit(1);
  }
})();
