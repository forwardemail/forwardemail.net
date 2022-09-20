const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const config = require('#config');
const { Payments } = require('#models');

async function setConversionAndRefundStateHelpers(ctx, next) {
  const THIRTY_DAYS_AGO = dayjs()
    .startOf('day')
    .subtract(30, 'days')
    .toDate()
    .getTime();
  const [paymentCount, paymentIds] = await Promise.all([
    Payments.countDocuments({
      user: ctx.state.user._id,
      invoice_at: {
        // safety buffer of 1 day prior
        $lt: dayjs(ctx.state.user[config.userFields.planSetAt])
          .subtract(1, 'day')
          .toDate()
      }
    }),
    Payments.distinct('_id', {
      $and: [
        {
          user: ctx.state.user._id,
          plan: ctx.state.user.plan,
          method: {
            $nin: ['free_beta_program', 'plan_conversion']
          },
          invoice_at: {
            // NOTE: must be greater than 30 days ago or after their plan was set
            //       (whichever is sooner/greater)
            $gte:
              new Date(ctx.state.user[config.userFields.planSetAt]).getTime() >
              THIRTY_DAYS_AGO
                ? new Date(ctx.state.user[config.userFields.planSetAt])
                : new Date(THIRTY_DAYS_AGO),
            $lte: dayjs(ctx.state.user[config.userFields.planSetAt])
              .add(30, 'days')
              .toDate()
          }
        },
        {
          $or: [
            {
              // since we don't support partial refunds
              amount_refunded: 0
            },
            {
              // since some payments might not have this value
              amount_refunded: {
                $exists: false
              }
            }
          ]
        }
      ]
    })
  ]);

  ctx.state.paymentCount = paymentCount;
  ctx.state.paymentIds = paymentIds;

  //
  // set closest duration value (recalculated based off current time)
  //
  // - if switching to Enhanced Protection then multiply by 3 and round down
  // - if switching to Team then divide by 3 and round down
  //
  // NOTE: 3 is used because EP = $3/mo and Team = $9/mo (3*3=9)
  //
  // NOTE: we prepare an array of "conversion" payments
  //       which we pass to Payments.create method
  //
  ctx.state.conversion = {
    team: [],
    enhanced_protection: []
  };
  if (
    new Date(ctx.state.user[config.userFields.planExpiresAt]).getTime() >
    Date.now()
  ) {
    for (const plan of Object.keys(ctx.state.conversion)) {
      //
      // we need to convert into whole months (dayjs rounds down)
      //
      let months = dayjs(ctx.state.user[config.userFields.planExpiresAt]).diff(
        dayjs(),
        'months'
      );

      if (months > 0) {
        if (plan === 'enhanced_protection') {
          // downgrading so multiply by 3
          months = Math.round(months * 3);
        } else if (plan === 'team') {
          // upgrading so divide by 3
          months = Math.round(months / 3);
        }

        const durationToMonths = {
          '3y': 36,
          '2y': 24,
          '1y': 12,
          '180d': 6,
          '90d': 3,
          '60d': 2,
          '30d': 1
        };

        for (const duration of Object.keys(durationToMonths)) {
          const count = Math.floor(months / durationToMonths[duration]);
          if (count > 0) {
            months -= count * durationToMonths[duration];
            // eslint-disable-next-line max-depth
            for (let i = 0; i < count; i++) {
              ctx.state.conversion[plan].push({
                user: ctx.state.user._id,
                amount: 0,
                method: 'plan_conversion',
                duration: ms(duration),
                plan,
                kind: 'one-time'
              });
            }
          }
        }
      }
    }
  }

  return next();
}

module.exports = setConversionAndRefundStateHelpers;
