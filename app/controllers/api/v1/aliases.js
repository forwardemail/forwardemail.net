const ObjectID = require('bson-objectid');
const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const { _domainJSON } = require('./domains');
const { Aliases, Users } = require('#models');
const toObject = require('#helpers/to-object');

function json(alias) {
  const object = toObject(Aliases, alias);
  object.user = toObject(Users, alias.user);
  object.domain = ObjectID.isValid(alias.domain)
    ? alias.domain
    : _domainJSON(alias.domain);
  return pickOriginal(
    object,
    _.isFunction(alias.toObject) ? alias.toObject() : alias
  );
}

async function list(ctx) {
  ctx.body = Array.isArray(ctx.state.domain.aliases)
    ? ctx.state.domain.aliases.map((alias) => json(alias))
    : [];
}

async function retrieve(ctx) {
  ctx.body = json(ctx.state.alias);
}

module.exports = {
  list,
  retrieve
};
