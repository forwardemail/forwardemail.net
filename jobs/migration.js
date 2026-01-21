/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');

const mongoose = require('mongoose');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { Aliases, Users, Domains } = require('#models');
const config = require('#config');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);
  try {
    // any domains that have txt and mx
    // and onboard_email_sent_at need verified_email_sent_at
    // to the same date as onboard_email_sent_at if it was not set
    const results = await Domains.find({
      has_txt_record: true,
      has_mx_record: true,
      onboard_email_sent_at: {
        $exists: true
      },
      verified_email_sent_at: {
        $exists: false
      }
    });

    if (results.length > 0) {
      await Promise.all(
        results.map((result) =>
          Domains.findByIdAndUpdate(result._id, {
            $set: {
              verified_email_sent_at: result.onboard_email_sent_at
            }
          })
        )
      );
    }

    const domainsWithPortNumber = await Domains.find({
      smtp_port: {
        $type: 'number'
      }
    });

    await Promise.all(
      domainsWithPortNumber.map(async (domain) => {
        domain.smtp_port = domain.smtp_port.toString();
        domain.skip_verification = true;
        // Set audit metadata for system-initiated migration
        domain.__audit_metadata = {
          isSystem: true
        };
        await domain.save();
      })
    );

    const domains = await Domains.find({
      $or: [
        {
          has_adult_content_protection: {
            $exists: false
          }
        },
        {
          has_phishing_protection: {
            $exists: false
          }
        },
        {
          has_executable_protection: {
            $exists: false
          }
        },
        {
          has_virus_protection: {
            $exists: false
          }
        },
        {
          verification_record: {
            $exists: false
          }
        },
        {
          plan: {
            $exists: false
          }
        },
        {
          smtp_port: {
            $exists: false
          }
        },
        {
          max_recipients_per_alias: {
            $exists: false
          }
        }
        /*
        {
          members: {
            $exists: true,
            $ne: []
          },
          'members.0._id': {
            $exists: true
          },
          'members.0.id': {
            $exists: false
          }
        },
        {
          invites: {
            $exists: true,
            $ne: []
          },
          'invites.0._id': {
            $exists: true
          },
          'invites.0.id': {
            $exists: false
          }
        }
        */
      ]
    });
    await Promise.all(
      domains.map((domain) => {
        domain.skip_verification = true;
        // Set audit metadata for system-initiated migration
        domain.__audit_metadata = {
          isSystem: true
        };
        return domain.save();
      })
    );

    // find all domains with zero aliases and create one pointing to admin
    const domainIds = await Domains.distinct('_id', {});
    await Promise.all(
      domainIds.map(async (domainId) => {
        const count = await Aliases.countDocuments({ domain: domainId });
        if (count > 0) return;
        const domain = await Domains.findById(domainId).lean().exec();
        if (!domain) throw new Error('Domain missing');
        const admin = domain.members.find((member) => member.group === 'admin');
        if (!admin) throw new Error('Admin missing');
        const user = await Users.findById(admin.user).lean().exec();
        if (!user) throw new Error('User missing');
        // create a default alias for the user pointing to the admin
        await Aliases.create({
          user: user._id,
          domain: domain._id,
          name: '*',
          recipients: [user.email],
          locale: user[config.lastLocale]
        });
      })
    );
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
