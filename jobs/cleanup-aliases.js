// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

const Graceful = require('@ladjs/graceful');
const Mongoose = require('@ladjs/mongoose');
const pMapSeries = require('p-map-series');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const logger = require('#helpers/logger');
const { Aliases, Users, Domains } = require('#models');

const breeSharedConfig = sharedConfig('BREE');
const mongoose = new Mongoose({ ...breeSharedConfig.mongoose, logger });
const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  await mongoose.connect();

  logger.info('starting lowercase job');

  const ids = await Aliases.distinct('_id', {});
  const len = ids.length;
  let count = 0;

  // eslint-disable-next-line complexity
  async function mapper(alias) {
    // allows us to recursively call mapper()
    if (typeof alias !== 'object' || typeof alias.save !== 'function') {
      count++;
      alias = await Aliases.findById(alias);
    }

    console.log(`${count}/${len}`);

    if (!alias) {
      console.error('Alias does not exist');
      return;
    }

    try {
      await alias.save();
    } catch (err) {
      console.error('alias', alias, 'error', err);
      if (
        err.has_exceeded_unique_count ||
        err.is_reserved_word ||
        err.message ===
          'User cannot have more than (5) aliases on global domains.'
      ) {
        // if it's a global domain then ban the user
        const domain = await Domains.findById(alias.domain);
        if (!domain) throw new Error('Domain does not exist');
        if (domain.is_global) {
          const user = await Users.findById(alias.user);
          if (!user) throw new Error('User does not exist');
          // TODO: if the user not on a paid plan then ban them
          if (user.plan === 'free') {
            console.log('BANNING', user);
            user[config.userFields.isBanned] = true;
            await user.save();
          }

          console.log('REMOVING', alias);
          await alias.remove();
        } else {
          // else we need to trim the recipients past max count
          // and we can use exceeded by count
          for (let i = 1; i <= err.exceeded_by_count; i++) {
            alias.recipients.pop();
          }

          await mapper(alias);
        }
        // if alias name was invalid and they were on global
      } else if (
        err.message === 'Alias name was invalid.' ||
        err.message ===
          'Alias that is a catch-all must be enabled or deleted entirely to be disabled.' ||
        err.message === 'Alias already exists for domain.'
      ) {
        const domain = await Domains.findById(alias.domain);
        if (!domain) throw new Error('Domain does not exist');
        if (domain.is_global) {
          // remove alias because it was invalid
          await alias.remove();
        } else {
          switch (err.message) {
            case 'Alias that is a catch-all must be enabled or deleted entirely to be disabled.': {
              // remove alias because it was disabled by user
              await alias.remove();

              break;
            }

            case 'Alias already exists for domain.': {
              // find the other aliases that are similar
              const others = await Aliases.find({
                _id: {
                  $ne: alias._id
                },
                name: alias.name,
                domain: domain._id
              });
              // eslint-disable-next-line max-depth
              if (others.length === 0)
                throw new Error('Other alias did not exist');
              // merge the recipients together
              // eslint-disable-next-line max-depth
              for (const other of others) {
                alias.recipients.push(...other.recipients);
                alias.verified_recipients.push(...other.verified_recipients);
                alias.pending_recipients.push(...other.pending_recipients);
              }

              // remove existing
              await Aliases.deleteMany({
                _id: { $in: others.map((other) => other._id) }
              });

              // re-enable it just in case
              alias.is_enabled = true;

              // save the existing
              await mapper(alias);

              console.log('MERGED ALIASES', alias, 'others', others);
              break;
            }

            case 'Alias name was invalid.': {
              // this assumes "+" symbol was the culprit
              // (e.g. someone made an alias with "+" in the username portion before we had a chance to patch that)
              alias.name = alias.name.split('+')[0];
              await mapper(alias);

              break;
            }

            default: {
              throw err;
            }
          }
        }
      } else if (
        err.message ===
          'User must be a domain admin to create a catch-all alias.' ||
        err.message ===
          'User must be a domain admin to create an alias with a reserved word (see the page on <a target="_blank" rel="noopener noreferrer" class="font-weight-bold" href="%s/reserved-email-addresses">Reserved Email Addresses</a>).'
      ) {
        const domain = await Domains.findById(alias.domain);
        if (!domain) throw new Error('Domain does not exist');
        if (domain.is_global)
          throw new Error('Cannot re-assign on global domain');
        // otherwise find the first admin
        const adminMember = domain.members.find((m) => m.group === 'admin');
        if (!adminMember)
          throw new Error('No admin members available for re-assignment');
        console.log('Reassigning alias', alias, 'to admin member', adminMember);
        alias.user = adminMember.user;
        await mapper(alias);
      } else {
        const user = await Users.findById(alias.user);
        if (user[config.userFields.isBanned]) {
          console.log(
            'User was banned and alias had an issue',
            user,
            alias,
            err
          );
        } else {
          throw err;
        }
      }
    }
  }

  await pMapSeries(ids, mapper);

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
