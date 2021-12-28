const RE2 = require('re2');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const { Domains, Aliases } = require('#models');

async function retrieveDomains(ctx, next) {
  ctx.state.domains = [];

  if (!ctx.isAuthenticated()) return next();

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
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .sort('is_global name') // A-Z domains
    .lean()
    .exec();

  ctx.state.domains = ctx.state.domains.map((domain) => {
    domain.members = domain.members.filter(
      (member) =>
        _.isObject(member.user) && !member.user[config.userFields.isBanned]
    );
    return domain;
  });

  let domainAliases = await Aliases.find({
    domain: { $in: _.map(ctx.state.domains, '_id') }
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

  ctx.state.domains = ctx.state.domains.map((domain) => {
    // populate a `group` on the domain based off the user's association
    let member = domain.members.find(
      (member) => member.user.id === ctx.state.user.id
    );

    // for all global domains, if the user is not a member
    // then add them as a member to the domain
    if (!member && domain.is_global) {
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

    const { group } = member;

    // populate an `aliases` Array on the domain based off user's aliases
    const aliases = [];

    if (aliasesByDomain[domain.name])
      for (const alias of aliasesByDomain[domain.name]) {
        if (group === 'admin' || alias.user.id === ctx.state.user.id)
          aliases.push({
            ...alias,
            // for each alias set a virtual group helper
            // (if the user is an admin OR if the user is the owner of the alias)
            group:
              group === 'admin' || alias.user.id === ctx.state.user.id
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

    return {
      ...domain,
      group,
      aliases
    };
  });

  //
  // search functionality (with RegExp support)
  //
  if (!ctx.pathWithoutLocale.endsWith('/aliases')) {
    if (isSANB(ctx.query.name))
      ctx.state.domains = ctx.state.domains.filter((domain) =>
        new RE2(_.escapeRegExp(ctx.query.name)).test(domain.name)
      );

    if (isSANB(ctx.query.alias)) {
      const aliasRegex = new RE2(_.escapeRegExp(ctx.query.alias));
      ctx.state.domains = ctx.state.domains.filter((domain) =>
        domain.aliases.some((alias) => aliasRegex.test(alias.name))
      );
    }

    if (isSANB(ctx.query.recipient)) {
      const recipientRegex = new RE2(_.escapeRegExp(ctx.query.recipient));
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
