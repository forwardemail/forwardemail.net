const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

const { UpgradeReminders } = require('#models');

// TODO: also send one-time email in lookup if account was past due and respond with empty array
// TODO: verify records tool should also check against list of bad domains

async function upgrade(ctx) {
  try {
    if (isSANB(ctx.request.body.emails))
      ctx.request.body.emails = [ctx.request.body.emails];

    if (
      !_.isArray(ctx.request.body.emails) ||
      _.isEmpty(ctx.request.body.emails)
    )
      throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

    const emails = _.uniq(
      ctx.request.body.emails.map((email) => email.toLowerCase())
    );

    if (emails.some((email) => !isEmail(email)))
      throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

    if (!isSANB(ctx.request.body.domain) || !isFQDN(ctx.request.body.domain))
      throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

    let upgradeReminder = await UpgradeReminders.findOne({
      domain: ctx.request.body.domain
    });

    if (!upgradeReminder)
      upgradeReminder = await UpgradeReminders.create({
        domain: ctx.request.body.domain
      });

    // iterate over `upgradeReminder.recipients` for recipients that were already sent
    // and create in-memory a `pendingRecipients` array
    const pendingRecipients = [];
    for (const email of emails) {
      if (!upgradeReminder.recipients.includes(email))
        pendingRecipients.push(email);
    }

    if (pendingRecipients.length > 0)
      await UpgradeReminders.findByIdAndUpdate(upgradeReminder._id, {
        $addToSet: {
          pending_recipients: {
            $each: pendingRecipients
          }
        }
      });

    // send successful response
    ctx.body = 'OK';
  } catch (err) {
    ctx.throw(err);
  }
}

module.exports = upgrade;
