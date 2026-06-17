/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Backfills `expires_at` on domain invites created before the field became
// required. Without a value, saving the domain re-validates the whole
// `invites` array and throws "Expires at is required", which blocks users
// from adding or removing invites (stale pending invites get stuck).
//
// We set `expires_at` to created_at + 7d (matching the TTL used in the
// create-invite controller), falling back to now + 7d when created_at is
// absent. The update runs as an aggregation pipeline directly on the
// collection so it is atomic and does not re-run full document validation.
//
// Usage:
//   node scripts/backfill-invite-expires-at.js            # apply
//   node scripts/backfill-invite-expires-at.js --dry-run  # report only

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const ms = require('ms');

const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const { Domains } = require('#models');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

const TTL_MS = ms('7d');
const DRY_RUN = process.argv.includes('--dry-run');

// matches any invite element that has no (or null) expires_at
const MISSING_TYPES = ['missing', 'null'];
const FILTER = {
  invites: { $elemMatch: { expires_at: { $exists: false } } }
};

(async () => {
  try {
    await setupMongoose(logger);

    // report how many domains / invites are affected before changing anything
    const [stats] = await Domains.collection
      .aggregate([
        { $match: FILTER },
        {
          $project: {
            missing: {
              $size: {
                $filter: {
                  input: '$invites',
                  as: 'inv',
                  cond: {
                    $in: [{ $type: '$$inv.expires_at' }, MISSING_TYPES]
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
            invites: { $sum: '$missing' }
          }
        }
      ])
      .toArray();

    const domains = stats?.domains || 0;
    const invites = stats?.invites || 0;

    console.log(
      `Found ${invites} invite(s) missing expires_at across ${domains} domain(s)`
    );

    if (domains === 0) {
      console.log('Nothing to backfill.');
      return;
    }

    if (DRY_RUN) {
      console.log('Dry run — no changes written.');
      return;
    }

    const result = await Domains.collection.updateMany(FILTER, [
      {
        $set: {
          invites: {
            $map: {
              input: '$invites',
              as: 'inv',
              in: {
                $cond: [
                  { $in: [{ $type: '$$inv.expires_at' }, MISSING_TYPES] },
                  {
                    $mergeObjects: [
                      '$$inv',
                      {
                        expires_at: {
                          $add: [
                            { $ifNull: ['$$inv.created_at', '$$NOW'] },
                            TTL_MS
                          ]
                        }
                      }
                    ]
                  },
                  '$$inv'
                ]
              }
            }
          }
        }
      }
    ]);

    console.log(
      `Backfill complete — matched ${result.matchedCount}, modified ${result.modifiedCount} domain(s)`
    );
  } catch (err) {
    console.error('Error during backfill:', err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();
