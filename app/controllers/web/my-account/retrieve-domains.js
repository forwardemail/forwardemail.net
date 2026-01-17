/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');

const config = require('#config');
// const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const { Domains, Aliases } = require('#models');

async function retrieveDomains(ctx, next) {
  ctx.state.domains = [];
  ctx.state.adminTeams = [];

  if (ctx.state?.session?.db) return next();

  if (!ctx.isAuthenticated()) return next();

  //
  // NOTE: if user is authenticated but hasn't yet authenticated OTP
  //       we do not want to share account information on non /my-account pages
  //       (this is the same code as @ladjs/policies function ensureOtp)
  //
  if (
    ctx.state.user[config.passport.fields.otpEnabled] &&
    ctx.session &&
    !ctx.session.otp
  ) {
    ctx.session.returnTo = ctx.originalUrl || ctx.req.url;
    const redirectTo = ctx.state.l(config.loginOtpRoute);
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return next();
  }

  const query = {
    $or: [{ 'members.user': ctx.state.user._id }]
  };
  if (ctx.state.user.group === 'admin') query.$or.push({ is_global: true });
  else
    query.$or.push({
      is_global: true
      // NOTE: if we uncomment this then DNS changes could impact global vanity domains
      // has_mx_record: true,
      // has_txt_record: true
    });

  if (ctx.pathWithoutLocale.endsWith('/domains') && isSANB(ctx.query.q)) {
    query.$or = query.$or.map((obj) => {
      obj.name = {
        $regex: _.escapeRegExp(ctx.query.q.trim()),
        $options: 'i'
      };
      return obj;
    });
  }

  if (ctx.pathWithoutLocale.endsWith('/domains') && isSANB(ctx.query.name)) {
    query.$or = query.$or.map((obj) => {
      obj.name = {
        $regex: _.escapeRegExp(ctx.query.name.trim()),
        $options: 'i'
      };
      return obj;
    });
  }

  //
  // TODO: we need to optimize this and enforce limit/skip for pagination
  //       (however a ton of routes right now rely on this being populated)
  //       (therefore it should be conditionally implemented only for when we list domains)
  //       (e.g. GET /v1/domains or /my-account/domains URL's)
  //       (e.g. someone with 5000+ domains would experience quite some slowness here)
  //

  const [domains, adminTeams] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Domains.find(query)
      .populate(
        'members.user',
        `id email plan ${config.passport.fields.displayName} ${config.userFields.isBanned}`
      )
      .sort('name') // A-Z domains
      .lean()
      .exec(),
    // (only contains id and name)
    Domains.find({
      plan: 'team',
      members: {
        $elemMatch: {
          user: ctx.state.user._id,
          group: 'admin'
        }
      }
    })
      .select('-_id id name')
      .sort('name')
      .limit(1000)
      .lean()
      .exec()
  ]);

  ctx.state.domains = domains;
  ctx.state.adminTeams = adminTeams;

  const globalDomainIds = ctx.state.domains
    .filter((d) => d.is_global)
    .map((d) => d._id);

  const globalDomainIdsWithAliases =
    globalDomainIds.length === 0
      ? []
      : await Aliases.distinct('domain', {
          user: ctx.state.user._id,
          domain: { $in: globalDomainIds }
        });

  let i = ctx.state.domains.length;
  while (i--) {
    const domain = ctx.state.domains[i];

    let x = domain.members.length;
    let member;
    while (x--) {
      const m = domain.members[x];

      // ensure members have populated users and are not banned
      if (!_.isObject(m.user) || m.user[config.userFields.isBanned]) {
        ctx.state.domains[i].members.splice(x, 1);
        continue;
      }

      // omit properties we don't need to share
      delete m.user[config.userFields.isBanned];

      // check if there was a match for the current member (logged in user)
      if (m.user.id === ctx.state.user.id) member = m;
    }

    // if the domain was not global and there was no member
    if (domain.is_global) {
      // store a boolean for the count
      if (
        globalDomainIdsWithAliases.some((_id) => _id.toString() === domain.id)
      )
        domain.has_global_aliases = true;

      if (!member) {
        member = {
          user: {
            _id: ctx.state.user._id,
            id: ctx.state.user.id,
            email: ctx.state.user.email
          },
          group: 'user'
        };
        domain.members.push(member);
      }
    } else if (!member) {
      // otherwise purge the domain from the list
      // since the user did not belong to it anymore
      ctx.state.domains.splice(i, 1);
      continue;
    }

    // set a `group` virtual helper alias to the member's group
    domain.group = member.group;
  }

  if (ctx.api) return next();

  //
  // NOTE: we can't have this here because it's incredibly slow
  //       (e.g. when you have 2000+ domains)
  //       (this was moved to list-domains controller)
  //
  /*
  // get storage quota for each domain
  ctx.state.domains = await Promise.all(
    ctx.state.domains.map(async (d) => {
      if (d.is_global || d.plan === 'free') return d;
      try {
        const [storageUsed, storageUsedByAliases, maxQuotaPerAlias] =
          await Promise.all([
            Domains.getStorageUsed(d._id, ctx.locale),
            Domains.getStorageUsed(d._id, ctx.locale, true),
            Domains.getMaxQuota(d._id)
          ]);
        d.storage_used = storageUsed;
        d.storage_used_by_aliases = storageUsedByAliases;
        d.storage_quota = maxQuotaPerAlias;
      } catch (err) {
        ctx.logger.fatal(err);
      }

      return d;
    })
  );
  */

  // as part of onboarding redirect users to create a new domain right away
  if (
    !isSANB(ctx.query.q) &&
    !isSANB(ctx.query.name) &&
    ctx.method === 'GET' &&
    ['/my-account', '/my-account/domains'].includes(ctx.pathWithoutLocale)
  ) {
    // check global alias count which is used for redirection logic
    // if every domain was global and zero aliases then redirect
    // or if there was at least one domain that was not global
    const count = ctx.state.domains.every((d) => !d.is_global)
      ? 0
      : await Aliases.countDocuments({
          domain: {
            $in: ctx.state.domains.filter((d) => d.is_global).map((d) => d._id)
          },
          user: ctx.state.user._id,
          is_enabled: true
        });

    // user must be on a paid plan to use a global domain
    if (
      !ctx.api &&
      ctx.state.user.group !== 'admin' &&
      ctx.state.user.plan === 'free' &&
      count > 0 &&
      ctx.accepts('html')
    )
      ctx.flash(
        'warning',
        ctx.translate(
          'PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS',
          ctx.state.l(`/my-account/billing/upgrade?plan=enhanced_protection`)
        )
      );

    if (count > 0) return next();

    if (ctx.state.domains.some((d) => !d.is_global)) return next();

    // otherwise redirect user to create a new domain for onboarding
    if (!ctx.api && ctx.accepts('html'))
      ctx.flash('custom', {
        title: ctx.request.t(`${ctx.state.emoji('wave')} Welcome!`),
        text: ctx.translate('NO_DOMAINS_EXIST'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 5000,
        position: 'top'
      });
    return ctx.redirect('/my-account/domains/new');
  }

  return next();
}

module.exports = retrieveDomains;
