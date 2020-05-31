const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const { Aliases, Users } = require('../../../models');

const { _domainJSON } = require('./domains');

function json(alias) {
  const obj = _.isFunction(alias)
    ? alias.toObject()
    : pickOriginal(new Aliases(alias).toObject(), alias);
  obj.user = _.isFunction(obj.user.toObject)
    ? obj.user.toObject()
    : pickOriginal(new Users(obj.user).toObject(), obj.user);
  obj.domain = _domainJSON(obj.domain);
  return obj;
}

async function list(ctx) {
  ctx.body = Array.isArray(ctx.state.domain.aliases)
    ? ctx.state.domain.aliases.map(alias => json(alias))
    : [];
}

async function retrieve(ctx) {
  ctx.body = json(ctx.state.alias);
}

module.exports = {
  list,
  retrieve
};
