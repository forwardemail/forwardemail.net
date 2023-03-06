const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const config = require('#config');
const toObject = require('#helpers/to-object');
const { Users, Aliases, Domains } = require('#models');

function json(domain, isList = false) {
  const object = toObject(Domains, domain);
  // map max recipients per alias
  if (object.max_recipients_per_alias === 0)
    object.max_recipients_per_alias = config.maxForwardedAddresses;
  if (isList) {
    delete domain.members;
    delete domain.invites;
    delete domain.aliases;
  } else {
    // members
    if (Array.isArray(domain.members))
      object.members = domain.members.map((m) => {
        const member = _.isFunction(m.toObject)
          ? m.toObject()
          : { group: m.group };
        member.user = toObject(Users, m.user);
        if (_.isFinite(m.alias_count)) member.alias_count = m.alias_count;
        return member;
      });
    // invites
    if (Array.isArray(domain.invites))
      object.invites = domain.invites.map((i) =>
        _.isFunction(i.toObject)
          ? i.toObject()
          : new Domains().invites.create(i).toObject()
      );
    // aliases
    if (Array.isArray(domain.aliases))
      object.aliases = domain.aliases.map((a) => {
        const alias = toObject(Aliases, a);
        alias.user = toObject(Users, a.user);
        alias.domain = json(a.domain);
        if (_.isString(a.group)) alias.group = a.group;
        return alias;
      });
  }

  return {
    ...pickOriginal(
      object,
      _.isFunction(domain.toObject) ? domain.toObject() : domain
    ),
    // add a helper url
    link: `${config.urls.web}/my-account/domains/${domain.name}`
  };
}

async function list(ctx) {
  // hide global domain names if not admin of
  // the global domain and had zero aliases
  ctx.state.domains = ctx.state.domains.filter((domain) => {
    if (!domain.is_global) return true;
    if (
      domain.members.some(
        (member) =>
          // if the logged in user was not member
          // and if the logged in user had no aliases
          member.user.id === ctx.state.user.id &&
          member.is_virtual &&
          member.alias_count === 0
      )
    )
      return false;
    return true;
  });

  const data = ctx.state.domains.map((d) => json(d, true));
  ctx.body = data;
}

async function retrieve(ctx) {
  const data = json(ctx.state.domain);
  ctx.body = data;
}

module.exports = {
  list,
  retrieve,
  _domainJSON: json
};
