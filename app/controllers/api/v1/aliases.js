const _ = require('lodash');
const { select } = require('mongoose-json-select');

const { Aliases } = require('../../../models');

function json(alias) {
  return select(
    _.isFunction(alias.toObject) ? alias.toObject() : alias,
    Aliases.schema.options.toJSON.select
  );
}

async function list(ctx) {
  ctx.body = ctx.state.domain.aliases.map(alias => json(alias));
}

async function retrieve(ctx) {
  ctx.body = json(ctx.state.alias);
}

module.exports = {
  list,
  retrieve
};
