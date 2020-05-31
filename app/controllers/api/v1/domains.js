const ForwardEmail = require('forward-email');
const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const logger = require('../../../../helpers/logger');
const config = require('../../../../config');
const { Users, Aliases, Domains } = require('../../../models');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' }
});

function json(domain) {
  const obj = _.isFunction(domain.toObject)
    ? domain.toObject()
    : pickOriginal(new Domains(domain).toObject(), domain);
  // map max recipients per alias
  if (obj.max_recipients_per_alias === 0)
    obj.max_recipients_per_alias = app.config.maxForwardedAddresses;
  // members
  if (Array.isArray(obj.members))
    obj.members = obj.members.map(m => {
      m = _.isFunction(m.toObject)
        ? m.toObject()
        : pickOriginal(new Domains().members.create(m).toObject(), m);
      m.user = _.isFunction(m.user.toObject)
        ? m.user.toObject()
        : pickOriginal(new Users(m.user).toObject(), m.user);
      return m;
    });
  // invites
  if (Array.isArray(obj.invites))
    obj.invites = obj.invites.map(i =>
      _.isFunction(i.toObject)
        ? i.toObject()
        : pickOriginal(new Domains().invites.create(i).toObject(), i)
    );
  // aliases
  if (Array.isArray(obj.aliases))
    obj.aliases = obj.aliases.map(a => {
      a = _.isFunction(a)
        ? a.toObject()
        : pickOriginal(new Aliases(a).toObject(), a);
      a.user = _.isFunction(a.user.toObject)
        ? a.user.toObject()
        : pickOriginal(new Users(a.user).toObject(), a.user);
      a.domain = json(a.domain);
      return a;
    });
  // add a helper url
  obj.link = `${config.urls.web}/my-account/domains/${domain.name}`;
  return obj;
}

async function list(ctx) {
  const data = ctx.state.domains.map(d => json(d));
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
