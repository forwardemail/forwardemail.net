/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const _ = require('lodash');
const pickOriginal = require('@ladjs/pick-original');

const config = require('#config');
const populateDomainStorage = require('#helpers/populate-domain-storage');
const toObject = require('#helpers/to-object');
const { Users, Aliases, Domains } = require('#models');

const VIRTUAL_KEYS = [
  'storage_used',
  'storage_used_by_aliases',
  'storage_quota'
];

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

  // preserve virtuals added in `app/controllers/web/my-account/list-domains.js`
  // - storage_used
  // - storage_used_by_aliases
  // - storage_quota
  const virtuals = {};
  for (const key of VIRTUAL_KEYS) {
    if (typeof domain[key] !== 'undefined') virtuals[key] = domain[key];
  }

  return {
    ...pickOriginal(
      object,
      _.isFunction(domain.toObject) ? domain.toObject() : domain
    ),
    ...virtuals,
    // add a helper url
    link: `${config.urls.web}/my-account/domains/${punycode.toASCII(
      domain.name
    )}`
  };
}

async function list(ctx) {
  ctx.body = ctx.state.domains.map((d) => json(d, true));
}

async function retrieve(ctx) {
  // populate storage quota stuff
  const data = json(await populateDomainStorage(ctx.state.domain, ctx.locale));
  ctx.body = data;
}

module.exports = {
  list,
  retrieve,
  _domainJSON: json
};
