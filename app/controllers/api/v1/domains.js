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
  const data = ctx.state.domains
    .filter((domain) => {
      if (!domain.is_global) return true;
      const member = domain.members.find(
        (m) => m.user.id === ctx.state.user.id
      );
      if (!member) return false;
      if (member.group === 'admin') return true;
      if (domain.has_global_aliases) return true;
      return false;
    })
    .map((d) => json(d, true));

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
