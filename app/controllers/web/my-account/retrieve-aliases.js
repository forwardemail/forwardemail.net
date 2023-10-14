/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');

const Aliases = require('#models/aliases');

const config = require('#config');

// eslint-disable-next-line complexity
async function retrieveAliases(ctx, next) {
  let query =
    ctx.state.domain.group === 'admin'
      ? { $and: [{ domain: ctx.state.domain._id }] }
      : { $and: [{ domain: ctx.state.domain._id, user: ctx.state.user._id }] };

  if (isSANB(ctx.query.q)) {
    query.$and.push({
      $or: [
        {
          name:
            ctx.query.q.trim() === '*'
              ? {
                  $eq: '*'
                }
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

  //
  // search functionality (with RegExp support)
  //
  if (isSANB(ctx.query.name)) {
    query.$and.push({
      name: {
        $regex: _.escapeRegExp(ctx.query.name.trim().split('@')[0]),
        $options: 'i'
      }
    });
  }

  if (isSANB(ctx.query.recipient)) {
    query.$and.push({
      recipients: {
        $regex: _.escapeRegExp(ctx.query.recipient.trim()),
        $options: 'i'
      }
    });
  }

  if (query.$and.length === 1) query = query.$and[0];

  if (
    ctx.api ||
    ctx.pathWithoutLocale.startsWith(
      `/my-account/domains/${ctx.state.domain.id}/members/`
    ) ||
    ctx.pathWithoutLocale.startsWith(
      `/my-account/domains/${ctx.state.domain.name}/members/`
    )
  ) {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    ctx.state.domain.aliases = await Aliases.find(query)
      .populate(
        'user',
        `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
      )
      .populate('domain', 'id name')
      .lean()
      .exec();
  } else {
    const [aliases, itemCount] = await Promise.all([
      // eslint-disable-next-line unicorn/no-array-callback-reference
      Aliases.find(query)
        .limit(ctx.query.limit)
        .skip(ctx.paginate.skip)
        .sort(ctx.query.sort || 'name')
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
      `/my-account/domains/${ctx.state.domain.name}/members/`
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
  ctx.redirect(`/my-account/domains/${ctx.state.domain.name}/aliases/new`);
}

module.exports = retrieveAliases;
