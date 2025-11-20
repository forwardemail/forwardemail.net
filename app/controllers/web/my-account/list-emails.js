/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const _ = require('#helpers/lodash');

const config = require('#config');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const { Domains, Emails, Aliases } = require('#models');

async function listEmails(ctx, next) {
  // user must be domain admin or alias owner of the email
  const [domains, aliases, count] = await Promise.all([
    Domains.distinct('_id', {
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
    ctx.client.zcard(`${config.smtpLimitNamespace}:${ctx.state.user.id}`)
  ]);

  ctx.state.dailySMTPLimit =
    ctx.state.user[config.userFields.smtpLimit] || config.smtpLimitMessages;
  ctx.state.dailySMTPMessages = count;

  // TODO: status filter

  let query = {
    $or: [
      {
        alias: { $in: aliases }
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
            `/my-account/domains/${punycode.toASCII(
              ctx.state.domain.name
            )}/billing?plan=enhanced_protection`
          )
        )
      );

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
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(domain.name)}/verify-smtp`
          )
        )
      );

      const redirectTo = ctx.state.l(
        `/my-account/domains/${punycode.toASCII(domain.name)}/advanced-settings`
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

    let $sort = { created_at: ctx.api ? 1 : -1 };
    if (isSANB(ctx.query.sort)) {
      const order = ctx.query.sort.startsWith('-') ? -1 : 1;
      $sort = {
        [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
      };
    }

    // OPTIMIZATION: Use $facet to combine count + data queries
    const results = await Emails.aggregate([
      ...arr,
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            {
              $project: {
                _id: 1,
                id: 1,
                object: 1,
                created_at: 1,
                updated_at: 1,
                alias: 1,
                domain: 1,
                user: 1,
                status: 1,
                envelope: 1,
                messageId: 1,
                date: 1,
                subject: 1,
                hard_bounces: 1,
                soft_bounces: 1,
                is_bounce: 1,
                is_locked: 1,
                is_redacted: 1,
                // omit the following fields if API
                // - message
                // - headers
                // - accepted
                // - rejectedErrors
                ...(ctx.api
                  ? {}
                  : {
                      headers: 1,
                      accepted: 1,
                      rejectedErrors: 1
                    })
              }
            },
            {
              $sort
            },
            {
              $skip: ctx.paginate.skip
            },
            {
              $limit: Number.parseInt(ctx.query.limit, 10)
            }
          ]
        }
      }
    ]);

    ctx.state.emails = results[0].data || [];
    ctx.state.itemCount =
      results[0].metadata && results[0].metadata.length > 0
        ? results[0].metadata[0].total
        : 0;
  } else {
    // OPTIMIZATION: Use $facet to combine count + data queries
    let $sort = { created_at: ctx.api ? 1 : -1 };
    if (isSANB(ctx.query.sort)) {
      const order = ctx.query.sort.startsWith('-') ? -1 : 1;
      $sort = {
        [order === -1 ? ctx.query.sort.slice(1) : ctx.query.sort]: order
      };
    }

    const results = await Emails.aggregate([
      {
        $match: query
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            {
              $project: {
                _id: 1,
                id: 1,
                object: 1,
                created_at: 1,
                updated_at: 1,
                alias: 1,
                domain: 1,
                user: 1,
                status: 1,
                envelope: 1,
                messageId: 1,
                date: 1,
                subject: 1,
                headers: 1,
                accepted: 1,
                rejectedErrors: 1,
                hard_bounces: 1,
                soft_bounces: 1,
                is_bounce: 1,
                is_locked: 1,
                is_redacted: 1
              }
            },
            {
              $sort
            },
            {
              $skip: ctx.paginate.skip
            },
            {
              $limit: Number.parseInt(ctx.query.limit, 10)
            }
          ]
        }
      }
    ]);

    ctx.state.emails = results[0].data || [];
    ctx.state.itemCount =
      results[0].metadata && results[0].metadata.length > 0
        ? results[0].metadata[0].total
        : 0;
  }

  ctx.state.pageCount = Math.ceil(ctx.state.itemCount / ctx.query.limit);
  ctx.state.pages = paginate.getArrayPages(ctx)(
    6,
    ctx.state.pageCount,
    ctx.query.page
  );

  //
  // set HTTP headers for pagination
  // <https://forwardemail.net/email-api#description/pagination>
  //
  setPaginationHeaders(
    ctx,
    ctx.state.pageCount,
    ctx.query.page,
    ctx.state.emails.length,
    ctx.state.itemCount
  );

  if (ctx.api) return next();

  if (ctx.accepts('html')) return ctx.render('my-account/emails');

  const table = await ctx.render('my-account/emails/_table');
  ctx.body = { table };
}

module.exports = listEmails;
