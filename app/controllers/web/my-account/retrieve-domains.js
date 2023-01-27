const RE2 = require('re2');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const { Domains, Aliases } = require('#models');

// eslint-disable-next-line complexity
async function retrieveDomains(ctx, next) {
  ctx.state.domains = [];

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

  // eslint-disable-next-line unicorn/no-array-callback-reference
  ctx.state.domains = await Domains.find(query)
    .populate(
      'members.user',
      `id email plan ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('name') // A-Z domains
    .lean()
    .exec();

  let domainAliases = await Aliases.find({
    // if the user is an admin then show all
    // aliases otherwise only matches for the user
    ...(ctx.state.user.group === 'admin'
      ? { domain: { $in: ctx.state.domains.map((d) => d._id) } }
      : {
          $or: [
            // find aliases that are owned by the user's domains
            {
              domain: {
                $in: ctx.state.domains
                  .filter((d) => !d.is_global)
                  .map((d) => d._id)
              }
            },
            // NOTE: we can most likely remove this but need to check is_global elsewhere
            // find aliases that are global and owned by the user
            // (since our approach seems to be that we correlate user group to owning is_global's)
            {
              domain: {
                $in: ctx.state.domains
                  .filter((d) => d.is_global)
                  .map((d) => d._id)
              },
              user: ctx.state.user._id
            }
          ]
        })
  })
    .populate('domain', 'name')
    .populate(
      'user',
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('name')
    .lean()
    .exec();

  domainAliases = domainAliases.filter(
    (alias) => _.isObject(alias.user) && !alias.user[config.userFields.isBanned]
  );

  const aliasesByDomain = _.groupBy(
    domainAliases,
    (alias) => alias.domain.name
  );

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

      // check if there was a match for the current member (logged in user)
      if (m.user.id === ctx.state.user.id) member = m;
    }

    // if the domain was not global and there was no member
    if (domain.is_global && !member) {
      member = {
        user: {
          _id: ctx.state.user._id,
          id: ctx.state.user.id,
          email: ctx.state.user.email
        },
        group: 'user',
        // store the assignment was virtual
        is_virtual: true
      };
      domain.members.push(member);
    } else if (!member) {
      // otherwise purge the domain from the list
      // since the user did not belong to it anymore
      ctx.state.domains.splice(i, 1);
      continue;
    }

    // set a `group` virtual helper alias to the member's group
    domain.group = member.group;

    // populate an `aliases` array on the domain based off user's
    domain.aliases = [];

    if (aliasesByDomain[domain.name])
      for (const alias of aliasesByDomain[domain.name]) {
        if (domain.group === 'admin' || alias.user.id === ctx.state.user.id)
          domain.aliases.push({
            ...alias,
            // for each alias set a virtual group helper
            // (if the user is an admin OR if the user is the owner of the alias)
            group:
              domain.group === 'admin' || alias.user.id === ctx.state.user.id
                ? 'admin'
                : 'user'
          });
      }

    // iterate over domain.members and add `alias_count` virtual property
    // which counts across the aliases for the given member's user id
    domain.members = domain.members.map((member) => ({
      ...member,
      alias_count: aliasesByDomain[domain.name]
        ? aliasesByDomain[domain.name].filter(
            (alias) => alias.user.id === member.user.id
          ).length
        : 0
    }));
  }

  //
  // TODO: is this actually still in use anywhere?
  // search functionality (with RegExp support)
  //
  if (!ctx.pathWithoutLocale.endsWith('/aliases')) {
    if (isSANB(ctx.query.name)) {
      let regex;
      try {
        regex = new RE2(_.escapeRegExp(ctx.query.name) + '|' + ctx.query.name);
      } catch (err) {
        ctx.logger.warn(err);
      }

      if (regex)
        ctx.state.domains = ctx.state.domains.filter((domain) =>
          regex.test(domain.name)
        );
    }

    if (isSANB(ctx.query.alias)) {
      let aliasRegex;
      try {
        aliasRegex = new RE2(
          _.escapeRegExp(ctx.query.alias) + '|' + ctx.query.alias
        );
      } catch (err) {
        ctx.logger.warn(err);
      }

      if (aliasRegex)
        ctx.state.domains = ctx.state.domains.filter((domain) =>
          domain.aliases.some((alias) => aliasRegex.test(alias.name))
        );
    }

    if (isSANB(ctx.query.recipient)) {
      let recipientRegex;
      try {
        recipientRegex = new RE2(
          _.escapeRegExp(ctx.query.recipient) + '|' + ctx.query.recipient
        );
      } catch (err) {
        ctx.logger.warn(err);
      }

      if (recipientRegex)
        ctx.state.domains = ctx.state.domains.filter((domain) =>
          domain.aliases.some((alias) =>
            alias.recipients.some((recipient) => recipientRegex.test(recipient))
          )
        );
    }
  }

  if (ctx.api) return next();

  if (
    // as part of onboarding redirect users to create a new domain right away
    // unless of course they already had created global vanity domain
    ctx.state.domains.filter(
      (domain) =>
        !domain.is_global || (domain.is_global && domain.aliases.length > 0)
    ).length === 0 &&
    ctx.method === 'GET' &&
    ['/my-account', '/my-account/domains'].includes(ctx.pathWithoutLocale)
  ) {
    if (!ctx.api)
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
