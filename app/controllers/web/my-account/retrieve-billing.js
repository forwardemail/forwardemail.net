const { Payments } = require('../../../models');

async function retrieveBilling(ctx) {
  // check ctx.query.plan and prompt users to enter payment (before upgrading)
  // if user lands on page and they don't have payment entered and upgraded plan then prompt them and alert
  // render a billing history
  // prompt users for credit card
  ctx.state.payments = await Payments.find({ user: ctx.state.user._id })
    .sort('-created_at')
    .exec();
  // localize the descriptions
  ctx.state.payments = ctx.state.payments.map((payment) => {
    payment.locale = ctx.locale;
    return payment;
  });
  ctx.state.breadcrumbHeaderCentered = true;

  return ctx.render('my-account/billing');
}

module.exports = retrieveBilling;
