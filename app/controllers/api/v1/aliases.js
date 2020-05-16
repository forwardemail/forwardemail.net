const _ = require('lodash');
const { select } = require('mongoose-json-select');

const { Aliases, Users } = require('../../../models');

const { _domainJSON } = require('./domains');

function json(alias) {
  const obj = select(
    _.isFunction(alias) ? alias.toObject() : alias,
    Aliases.schema.options.toJSON.select
  );
  obj.user = select(
    _.isFunction(obj.user.toObject) ? obj.user.toObject() : obj.user,
    Users.schema.options.toJSON.select
  );
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
