const ObjectID = require('bson-objectid');
const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const { Aliases, Users } = require('../../../models');
const toObject = require('../../../../helpers/to-object');

const { _domainJSON } = require('./domains');

function json(alias) {
  const obj = toObject(Aliases, alias);
  obj.user = toObject(Users, alias.user);
  obj.domain = ObjectID.isValid(alias.domain)
    ? alias.domain
    : _domainJSON(alias.domain);
  return pickOriginal(
    obj,
    _.isFunction(alias.toObject) ? alias.toObject() : alias
  );
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
