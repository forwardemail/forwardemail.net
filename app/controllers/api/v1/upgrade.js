const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const { isEmail } = require('validator');

const { UpgradeReminders } = require('#models');

async function upgrade(ctx) {
  try {
    if (isSANB(ctx.request.body.emails))
      ctx.request.body.emails = [ctx.request.body.emails];

    if (
      !_.isArray(ctx.request.body.emails) ||
      _.isEmpty(ctx.request.body.emails)
    )
      throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));

    // limit to 5 emails max (safeguard in case SMTP code that also has slice(0, 5) is removed)
    const emails = _.uniq(
      ctx.request.body.emails.map((email) => email.toLowerCase())
    ).slice(0, 5);

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

    //
    // iterate over `upgradeReminder.recipients` for recipients that were already sent
    // and create in-memory a `pendingRecipients` array
    //
    // NOTE: once we actually send the emails in jobs/upgrade-reminder-email.js
    //       then they get pushed to an array called `sent_recipients`
    //
    const pendingRecipients = [];
    if (!_.isArray(upgradeReminder.sent_recipients))
      upgradeReminder.sent_recipients = [];
    for (const email of emails) {
      if (!upgradeReminder.sent_recipients.includes(email))
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
