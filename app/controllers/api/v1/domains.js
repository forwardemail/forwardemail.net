const _ = require('lodash');
const { select } = require('mongoose-json-select');

const { Domains } = require('../../../models');

function json(domain) {
  return select(
    _.isFunction(domain.toObject) ? domain.toObject() : domain,
    Domains.schema.options.toJSON.select
  );
}

async function list(ctx) {
  ctx.body = ctx.state.domains.map(domain => json(domain));
}

async function retrieve(ctx) {
  ctx.body = json(ctx.state.domain);
}

module.exports = {
  list,
  retrieve
};
