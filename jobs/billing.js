const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const _ = require('lodash');
const dayjs = require('dayjs-with-plugins');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const email = require('#helpers/email');
const logger = require('#helpers/logger');
const { Users, Domains } = require('#models');

const breeSharedConfig = sharedConfig('BREE');

const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', (message) => {
    //
    // TODO: once we can manipulate concurrency option to p-map
    // we could make it `Number.MAX_VALUE` here to speed cancellation up
    // <https://github.com/sindresorhus/p-map/issues/28>
    //
    if (message === 'cancel') isCancelled = true;
  });

graceful.listen();

async function mapper(_id) {
  // return early if the job was already cancelled
  if (isCancelled) return;

  try {
    const domain = await Domains.findById(_id)
      .populate('members.user')
      .lean()
      .exec();

    // it could have been deleted by the user mid-process
    if (!domain) return;

    logger.info('checking domain', { domain });

    if (!['team', 'enhanced_protection'].includes(domain.plan))
      throw new Error(
        `Domain "${domain.name}" was on an unknown "${domain.plan}" plan`
      );

    let admins = domain.members.filter(
      (member) =>
        _.isObject(member) &&
        _.isObject(member.user) &&
        member.group === 'admin'
    );

    const validMembers = admins.filter((member) =>
      domain.plan === 'enhanced_protection'
        ? ['team', 'enhanced_protection'].includes(member.user.plan)
        : member.user.plan === 'team'
    );

    const now = new Date();
    const oneMonthFromNow = dayjs(now).add(30, 'day').toDate();

    // this pretty much only hits this conditional when we first launched publicly (out of free beta program)
    if (validMembers.length === 0) {
      admins = await Promise.all(
        admins.map(async (member) => {
          //
          // if the user hasn't tried a paid plan yet
          // then update their `plan_set_at` date and give them 30 days free
          // so that we don't allow them to switch back
          // and forth between free and paid plans
          // and abuse the service to get it for free
          //
          const $set = { plan: domain.plan };
          member.user.plan = domain.plan;
          if (
            !_.isDate(member.user[config.userFields.planSetAt]) ||
            !_.isDate(member.user[config.userFields.planExpiresAt])
          ) {
            $set[config.userFields.planSetAt] = now;
            member.user[config.userFields.planSetAt] = now;
            $set[config.userFields.planExpiresAt] = oneMonthFromNow;
            member.user[config.userFields.planExpiresAt] = oneMonthFromNow;
          }

          await Users.findByIdAndUpdate(member.user._id, { $set });
          return member;
        })
      );

      // send email
      await email({
        template: 'migrate-plans',
        message: {
          to: admins.map((member) => member.user[config.userFields.fullEmail])
        },
        locals: { domain }
      });
    }

    // this assumes that there's at least one admin of this domain
    // with an account plan that matches the minimum plan required
    // for the domain's current plan
    // (e.g. if the domain was on team, then at least 1 admin had team plan)
    // however we want to only send a reminder at these intervals:
    // - 1d
    // - 3d
    // - 7d
    // - 15d
    // - 30d

    //
    // go through each admin and check how long
    // ago we sent them a payment reminder email
    //
    const emails = [];
    for (const member of admins) {
      // if the user doesn't have a plan set yet or it has no expiration date then keep going
      // (this shouldn't ever happen unless the user was added as an admin afterwards, in which case we don't want to blast them)
      if (
        !_.isDate(member.user[config.userFields.planSetAt]) ||
        !_.isDate(member.user[config.userFields.planExpiresAt])
      ) {
        logger.fatal(
          `${member.user.email} was missing plan set or expiration date`
        );
        continue;
      }

      // TODO: Date diff calculation is off
      // TODO: Group emails to domains and send one email vs multiple (prevent spam)

      const diff =
        dayjs(member.user[config.userFields.planExpiresAt]).diff(now, 'day') +
        1;

      if (diff !== 1 && diff !== 3 && diff !== 7 && diff !== 15 && diff !== 30)
        continue;

      emails.push({
        template: 'payment-reminder',
        message: {
          to: member.user[config.userFields.fullEmail]
        },
        locals: { domain, diff }
      });
    }

    if (emails.length === 0) return;

    // NOTE: store when we sent payment reminder at and don't resend twice if we send hourly (only once per interval)
    await Promise.all(emails.map((eml) => email(eml)));
  } catch (err) {
    logger.error(err);
  }
}

(async () => {
  await mongoose.connect();

  // async iterator cursor (stream)
  logger.info('starting billing');
  const query = Domains.find({ plan: { $ne: 'free' } })
    .select('_id')
    .lean();
  for await (const _id of query) {
    logger.info('iterating over _id', { _id: _id.toString() });
    await mapper(_id);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
