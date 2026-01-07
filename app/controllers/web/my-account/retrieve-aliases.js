/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');
const _ = require('#helpers/lodash');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const sendPaginationCheck = require('#helpers/send-pagination-check');
const setPaginationHeaders = require('#helpers/set-pagination-headers');

const config = require('#config');

async function retrieveAliases(ctx, next) {
  let query =
    ctx.state.domain.group === 'admin'
      ? { $and: [{ domain: ctx.state.domain._id }] }
      : { $and: [{ domain: ctx.state.domain._id, user: ctx.state.user._id }] };

  if (isSANB(ctx.query.q)) {
    // Get the search filter (defaults to 'everything' for backwards compatibility)
    const searchFilter = ctx.query.search_filter || 'everything';

    if (ctx.state.domain.is_catchall_regex_disabled) {
      // Handle search based on filter when catchall regex is disabled
      if (searchFilter === 'name') {
        query.$and.push({
          name: ctx.query.q.split('@')[0].trim().toLowerCase()
        });
      } else if (searchFilter === 'recipients') {
        query.$and.push({
          recipients: ctx.query.q.trim().toLowerCase()
        });
      } else if (isEmail(ctx.query.q)) {
        // 'everything' filter with email input
        query.$and.push({
          $or: [
            {
              name: ctx.query.q.split('@')[0].trim().toLowerCase()
            },
            {
              recipients: ctx.query.q.trim().toLowerCase()
            }
          ]
        });
      } else {
        // 'everything' filter with non-email input
        query.$and.push({
          name: ctx.query.q.split('@')[0].trim().toLowerCase()
        });
      }
    } else if (searchFilter === 'name') {
      // Search only by name
      query.$and.push({
        name:
          ctx.query.q.trim() === '*'
            ? {
                $eq: '*'
              }
            : isEmail(ctx.query.q) &&
              ctx.query.q.endsWith(`@${ctx.state.domain.name}`)
            ? { $eq: ctx.query.q.split('@')[0] }
            : {
                $regex: _.escapeRegExp(ctx.query.q.trim().split('@')[0]),
                $options: 'i'
              }
      });
    } else if (searchFilter === 'recipients') {
      // Search only by recipients
      query.$and.push({
        recipients: {
          $regex: _.escapeRegExp(ctx.query.q.trim()),
          $options: 'i'
        }
      });
    } else {
      // 'everything' filter - search across all fields (original behavior)
      query.$and.push({
        $or: [
          {
            name:
              ctx.query.q.trim() === '*'
                ? {
                    $eq: '*'
                  }
                : isEmail(ctx.query.q) &&
                  ctx.query.q.endsWith(`@${ctx.state.domain.name}`)
                ? { $eq: ctx.query.q.split('@')[0] }
                : {
                    $regex: _.escapeRegExp(ctx.query.q.trim().split('@')[0]),
                    $options: 'i'
                  }
          },
          {
            description: {
              $regex: _.escapeRegExp(ctx.query.q.trim()),
              $options: 'i'
            }
          },
          {
            labels: {
              $regex: _.escapeRegExp(ctx.query.q.trim()),
              $options: 'i'
            }
          },
          {
            recipients: {
              $regex: _.escapeRegExp(ctx.query.q.trim()),
              $options: 'i'
            }
          }
        ]
      });
    }
  }

  //
  // search functionality (with RegExp support)
  //
  if (isSANB(ctx.query.name)) {
    if (ctx.state.domain.is_catchall_regex_disabled) {
      query.$and.push({
        name: ctx.query.name.split('@')[0].trim().toLowerCase()
      });
    } else {
      query.$and.push({
        name: {
          $regex: _.escapeRegExp(ctx.query.name.trim().split('@')[0]),
          $options: 'i'
        }
      });
    }
  }

  if (isSANB(ctx.query.recipient)) {
    if (ctx.state.domain.is_catchall_regex_disabled) {
      query.$and.push({
        recipients: ctx.query.recipient.trim().toLowerCase()
      });
    } else {
      query.$and.push({
        recipients: {
          $regex: _.escapeRegExp(ctx.query.recipient.trim()),
          $options: 'i'
        }
      });
    }
  }

  if (isSANB(ctx.params.member_id)) {
    query.$and.push({
      user: new mongoose.Types.ObjectId(ctx.params.member_id)
    });
  }

  if (query.$and.length === 1) query = query.$and[0];

  // safeguard
  if (!query || _.isEmpty(query)) throw new TypeError('Invalid query');

  if (
    ctx.api ||
    (isSANB(ctx.params.member_id) &&
      (ctx.pathWithoutLocale.startsWith(
        `/my-account/domains/${ctx.state.domain.id}/members/`
      ) ||
        ctx.pathWithoutLocale.startsWith(
          `/my-account/domains/${punycode.toASCII(
            ctx.state.domain.name
          )}/members/`
        )))
  ) {
    //
    // starting November 1st we enforce API pagination on this endpoint
    // (unless user opts in beforehand using ?pagination=true)
    //
    const hasPagination = dayjs().isBefore('11/1/2024', 'M/D/YYYY')
      ? boolean(ctx.query.pagination) ||
        !_.isUndefined(ctx.query.limit) ||
        !_.isUndefined(ctx.query.page)
      : true;

    //
    // NOTE: we send a one-time email admins that we now offer pagination
    //       and with notice that starting November 1st list domains/aliases
    //       endpoints will be paginated to 1000 results max per page by default
    //
    if (!hasPagination) await sendPaginationCheck(ctx);

    const [aliases, itemCount] = await Promise.all([
      hasPagination
        ? // eslint-disable-next-line unicorn/no-array-callback-reference
          Aliases.find(query)
            .limit(ctx.query.limit)
            .skip(ctx?.paginate?.skip)
            .sort(isSANB(ctx.query.sort) ? ctx.query.sort : 'created_at')
            .populate(
              'user',
              `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
            )
            .populate('domain', 'id name')
            .lean()
            .exec()
        : // eslint-disable-next-line unicorn/no-array-callback-reference
          Aliases.find(query)
            .populate(
              'user',
              `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
            )
            .populate('domain', 'id name')
            .sort(isSANB(ctx.query.sort) ? ctx.query.sort : 'created_at')
            .lean()
            .exec(),
      Aliases.countDocuments(query)
    ]);

    ctx.state.domain.aliases = aliases;

    //
    // set HTTP headers for pagination
    // <https://forwardemail.net/email-api#description/pagination>
    //
    setPaginationHeaders(
      ctx,
      hasPagination ? Math.ceil(itemCount / ctx.query.limit) : 1,
      hasPagination ? ctx.query.page : 1,
      aliases.length,
      itemCount
    );
  } else {
    const [aliases, itemCount] = await Promise.all([
      // eslint-disable-next-line unicorn/no-array-callback-reference
      Aliases.find(query)
        .limit(ctx.query.limit)
        .skip(ctx?.paginate?.skip)
        .sort(isSANB(ctx.query.sort) ? ctx.query.sort : 'name')
        .populate(
          'user',
          `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
        )
        .populate('domain', 'id name')
        .lean()
        .exec(),
      Aliases.countDocuments(query)
    ]);
    ctx.state.domain.aliases = aliases;
    ctx.state.itemCount = itemCount;
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
      aliases.length,
      itemCount
    );
  }

  let i = ctx.state.domain.aliases.length;

  while (i--) {
    const alias = ctx.state.domain.aliases[i];

    // filter out those without user or domain or where the user is banned
    if (
      !alias.domain ||
      !alias.user ||
      alias.user[config.userFields.isBanned]
    ) {
      ctx.state.domain.aliases.splice(i, 1);
      continue;
    }

    // set virtual alias.group helper
    alias.group =
      ctx.state.domain.group === 'admin' || alias.user.id === ctx.state.user.id
        ? 'admin'
        : 'user';
  }

  // if there aren't any aliases yet
  // then prompt the user to create one and flash a message
  // otherwise take them to the next middleware
  if (
    ctx.api ||
    isSANB(ctx.query.q) ||
    isSANB(ctx.query.name) ||
    isSANB(ctx.query.recipient) ||
    ctx.state.itemCount > 0 ||
    ctx.pathWithoutLocale.startsWith(
      `/my-account/domains/${ctx.state.domain.id}/members/`
    ) ||
    ctx.pathWithoutLocale.startsWith(
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/members/`
    )
  )
    return next();

  // render the IMPORT TXT button conditionally
  ctx.state.hasExistingTXT = false;
  if (ctx.state.domain.plan !== 'free') {
    try {
      const records = await ctx.resolver.resolveTxt(ctx.state.domain.name, {
        purgeCache: true
      });
      const existingTXT = [];
      for (const record of records) {
        if (_.isArray(record)) {
          for (const str of record) {
            if (str.includes('forward-email=')) existingTXT.push(str);
          }
        }
      }

      if (existingTXT.length > 0) ctx.state.hasExistingTXT = true;
    } catch (err) {
      ctx.logger.warn(err);
    }
  }

  ctx.flash('custom', {
    title: ctx.translate('ADD_ALIAS'),
    text: ctx.translate('NO_ALIASES_EXIST'),
    type: 'info',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });
  ctx.redirect(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/new`
  );
}

module.exports = retrieveAliases;
