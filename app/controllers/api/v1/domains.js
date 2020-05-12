const ForwardEmail = require('forward-email');
const _ = require('lodash');
const { select } = require('mongoose-json-select');

const logger = require('../../../../helpers/logger');
const config = require('../../../../config');
const { Users, Aliases, Domains } = require('../../../models');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' }
});

function json(domain) {
  const obj = select(
    _.isFunction(domain.toObject) ? domain.toObject() : domain,
    Domains.schema.options.toJSON.select
  );
  // map max recipients per alias
  if (obj.max_recipients_per_alias === 0)
    obj.max_recipients_per_alias = app.config.maxForwardedAddresses;
  // members
  if (Array.isArray(obj.members))
    obj.members = obj.members.map(m => {
      m = select(
        _.isFunction(m.toObject) ? m.toObject() : m,
        Domains.Member.options.toJSON.select
      );
      m.user = select(
        _.isFunction(m.user.toObject) ? m.user.toObject() : m.user,
        Users.schema.options.toJSON.select
      );
      return m;
    });
  // invites
  if (Array.isArray(obj.invites))
    obj.invites = obj.invites.map(i =>
      select(
        _.isFunction(i.toObject) ? i.toObject() : i,
        Domains.Invite.options.toJSON.select
      )
    );
  // aliases
  if (Array.isArray(obj.aliases))
    obj.aliases = obj.aliases.map(a => {
      a = select(
        _.isFunction(a) ? a.toObject() : a,
        Aliases.schema.options.toJSON.select
      );
      a.user = select(
        _.isFunction(a.user.toObject) ? a.user.toObject() : a.user,
        Users.schema.options.toJSON.select
      );
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
