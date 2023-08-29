const Boom = require('@hapi/boom');
const _ = require('lodash');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

const { Domains, Emails, Aliases } = require('#models');

async function listEmails(ctx) {
  // user must be domain admin or alias owner of the email
  const [domains, aliases, goodDomains] = await Promise.all([
    Domains.distinct('_id', {
      has_smtp: true,
      is_smtp_suspended: false,
      members: {
        $elemMatch: {
          user: ctx.state.user._id,
          group: 'admin'
        }
      }
    }),
    Aliases.distinct('_id', {
      user: ctx.state.user._id
    }),
    Domains.distinct('_id', {
      has_smtp: true,
      is_smtp_suspended: false
    })
  ]);

  // TODO: status filter

  let query = {
    $or: [
      {
        alias: { $in: aliases },
        domain: { $in: goodDomains }
      },
      {
        domain: { $in: domains }
      }
    ]
  };

  // find matching domain otherwise error if does not have access or suspended
  if (isSANB(ctx.query.domain)) {
    if (!isFQDN(ctx.query.domain))
      throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

    const domain = ctx.state.domains.find(
      (d) => d.name === ctx.query.domain && !d.is_global
    );

    if (!domain)
      throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

    // domain must be on paid plan
    if (domain.plan === 'free')
      throw Boom.paymentRequired(
        ctx.translateError(
          'PLAN_UPGRADE_REQUIRED',
          ctx.state.l(
            `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
          )
        )
      );

    // domain cannot be in suspended domains list
    if (_.isDate(domain.smtp_suspended_sent_at))
      throw Boom.badRequest(ctx.translateError('DOMAIN_SUSPENDED'));

    // if domain has not yet been setup yet then alert user
    if (
      !ctx.api &&
      (!domain.has_dkim_record ||
        !domain.has_return_path_record ||
        !domain.has_dmarc_record)
    ) {
      ctx.flash(
        'warning',
        ctx.translate(
          'EMAIL_SMTP_CONFIGURATION_REQUIRED',
          domain.name,
          ctx.state.l(`/my-account/domains/${domain.name}/verify-smtp`)
        )
      );

      const redirectTo = ctx.state.l(
        `/my-account/domains/${domain.name}/advanced-settings`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
      return;
    }

    // domain must be enabled
    if (!domain.has_smtp)
      throw Boom.badRequest(ctx.translateError('EMAIL_SMTP_ACCESS_REQUIRED'));

    query = {
      $and: [
        {
          domain: domain._id
        },
        {
          ...query
        }
      ]
    };
  }

  // advanced search filtering (either aggregate or find)
  if (isSANB(ctx.query.q)) {
    const $regex = _.escapeRegExp(ctx.query.q.trim());

    if (!query.$and) {
      query = {
        $and: [
          {
            ...query
          }
        ]
      };
    }

    // <https://stackoverflow.com/a/71999502>
    const arr = [
      {
        $addFields: {
          headers: {
            $objectToArray: '$headers'
          }
        }
      },
      {
        $match: {
          $and: [
            ...query.$and,
            {
              $or: [
                {
                  'headers.k': {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'headers.v': {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'envelope.from': {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'envelope.to': {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  messageId: {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  subject: {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'rejectedErrors.response': {
                    $regex,
                    $options: 'i'
                  }
                },
                {
                  'rejectedErrors.message': {
                    $regex,
                    $options: 'i'
                  }
                }
              ]
            }
          ]
        }
      },
      {
        $addFields: {
          headers: {
            $arrayToObject: '$headers'
          }
        }
      }
    ];

    let $sort = { created_at: -1 };
    if (ctx.query.sort) {
      const order = ctx.query.sort.startsWith('-') ? -1 : 1;
      $sort = {
        [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
      };
    }

    const [emails, results] = await Promise.all([
      Emails.aggregate([
        ...arr,
        {
          $project: {
            _id: 1,
            id: 1,
            created_at: 1,
            updated_at: 1,
            alias: 1,
            domain: 1,
            user: 1,
            status: 1,
            envelope: 1,
            messageId: 1,
            headers: 1,
            date: 1,
            subject: 1,
            accepted: 1,
            rejectedErrors: 1
          }
        },
        {
          $sort
        },
        {
          $skip: ctx.paginate.skip
        },
        {
          $limit: ctx.query.limit
        }
      ]),
      Emails.aggregate([...arr, { $count: 'count' }])
    ]);

    ctx.state.emails = emails;
    ctx.state.itemCount = results[0]?.count;
  } else {
    if (ctx.api) {
      // omit the following fields
      // - message
      // - headers
      // - accepted
      // - rejectedErrors
      // eslint-disable-next-line unicorn/no-array-callback-reference
      ctx.body = await Emails.find(query)
        .select('-message -headers -accepted -rejectedErrors')
        .sort('-created_at')
        .lean()
        .exec();
      return;
    }

    const [emails, itemCount] = await Promise.all([
      // eslint-disable-next-line unicorn/no-array-callback-reference
      Emails.find(query)
        .limit(ctx.query.limit)
        .skip(ctx.paginate.skip)
        .sort(ctx.query.sort || '-created_at')
        .lean()
        .exec(),
      Emails.countDocuments(query)
    ]);

    ctx.state.emails = emails;
    ctx.state.itemCount = itemCount;
  }

  ctx.state.pageCount = Math.ceil(ctx.state.itemCount / ctx.query.limit);
  ctx.state.pages = paginate.getArrayPages(ctx)(
    6,
    ctx.state.pageCount,
    ctx.query.page
  );

  if (ctx.accepts('html')) return ctx.render('my-account/emails');

  const table = await ctx.render('my-account/emails/_table');
  ctx.body = { table };
}

module.exports = listEmails;
