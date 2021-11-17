const { Payments } = require('../../../models');

async function retrieveBilling(ctx, next) {
  // check ctx.query.plan and prompt users to enter payment (before upgrading)
  // if user lands on page and they don't have payment entered and upgraded plan then prompt them and alert
  // render a billing history
  // prompt users for credit card
  ctx.state.payments = await Payments.find({ user: ctx.state.user._id })
    .sort('-created_at')
    .lean()
    .exec();
  // localize the descriptions
  ctx.state.payments = ctx.state.payments.map((payment) => {
    payment.locale = ctx.locale;
    return payment;
  });

  return next();
}

module.exports = retrieveBilling;
