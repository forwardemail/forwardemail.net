// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const sharedConfig = require('@ladjs/shared-config');
const dayjs = require('dayjs-with-plugins');

const config = require('#config');
const { email, logger } = require('#helpers');
const { Users, Domains } = require('#models');

const breeSharedConfig = sharedConfig('BREE');

const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  //
  // check domains created over 24 hours ago
  // that have MX records set but are missing TXT records
  // (and check in-memory here for each)
  //
  const domainIds = await Domains.distinct('_id', {
    has_mx_record: true,
    has_txt_record: false,
    missing_txt_sent_at: {
      $exists: false
    },
    created_at: {
      $lte: dayjs().subtract(1, 'day').toDate()
    }
  });

  // iterate over each domain and group it together by the same user
  // (so we only send one email digest per user, and only send it once per domain)
  const data = {};
  for (const id of domainIds) {
    //
    // TODO: in future we may want to verify the domain in case
    //       the last time `check-domains.js` it didn't pick up successful TXT verification
    //

    // eslint-disable-next-line no-await-in-loop
    const domain = await Domains.findById(id).lean().exec();
    for (const member of domain.members) {
      if (member.group !== 'admin') continue;
      if (!data[member.user.toString()]) {
        // eslint-disable-next-line no-await-in-loop
        const user = await Users.findById(member.user).lean().exec();
        data[member.user.toString()] = {
          user,
          domains: []
        };
      }

      data[member.user.toString()].domains.push(domain);
    }
  }

  for (const userId of Object.keys(data)) {
    const locals = data[userId];
    if (locals.domains.length > 1) continue;
    // eslint-disable-next-line no-await-in-loop
    await email({
      template: 'domain-missing-txt',
      message: {
        to: locals.user[config.userFields.fullEmail]
      },
      locals
    });

    // eslint-disable-next-line no-await-in-loop
    await Domains.updateMany(
      {
        _id: {
          $in: locals.domains.map((domain) => domain._id)
        }
      },
      {
        missing_txt_sent_at: new Date()
      }
    );
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
