/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const pickOriginal = require('@ladjs/pick-original');
const _ = require('#helpers/lodash');

const config = require('#config');
const parseRootDomain = require('#helpers/parse-root-domain');
const omitAdminOnlyDomainKeys = require('#helpers/omit-admin-only-domain-keys');
const populateDomainStorage = require('#helpers/populate-domain-storage');
const toObject = require('#helpers/to-object');
const { Users, Aliases, Domains } = require('#models');

const { getMemberUserId, isDomainAdmin } = omitAdminOnlyDomainKeys;

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
    // (the token of an invite as an admin is only sent to the invitee, so
    // another admin cannot accept it on their behalf, e.g. by getting them to
    // open the link while logged in)
    if (Array.isArray(domain.invites))
      object.invites = domain.invites.map((i) => {
        const invite = _.isFunction(i.toObject)
          ? i.toObject()
          : new Domains().invites.create(i).toObject();
        if (invite.group === 'admin') delete invite.token;
        return invite;
      });
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

  // TODO: fix `parseRootDomain` for emoji domains with subdomain
  const rootName = parseRootDomain(domain.name);
  // NOTE: these DNS records do not currently take into consideration the NS provider (provider agnostic to industry/Cloudflare standards)
  // TODO: SPF check and check for more than 10 lookups and automated email
  // TODO: DMARC check and automated email
  // TODO: My Account > Domains to render SPF/DKIM/DMARC/Return-Path
  const smtpDNSRecords = [
    'dkim_key_selector',
    'name',
    'dkim_public_key',
    'return_path',
    'id'
  ].every((key) => typeof domain[key] !== 'undefined')
    ? {
        dkim: {
          name: `${domain.dkim_key_selector}._domainkey${
            rootName === domain.name
              ? ''
              : `.${domain.name.slice(
                  0,
                  domain.name.lastIndexOf(rootName) - 1
                )}`
          }`,
          value: `v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString(
            'base64'
          )};`
        },
        return_path: {
          name: `${domain.return_path}${
            rootName === domain.name
              ? ''
              : `.${domain.name.slice(
                  0,
                  domain.name.lastIndexOf(rootName) - 1
                )}`
          }`,
          value: `${
            config.webHost === 'localhost' && config.env === 'development'
              ? 'forwardemail.net'
              : config.webHost
          }`
        },
        dmarc: {
          name: `_dmarc${
            rootName === domain.name
              ? ''
              : `.${domain.name.slice(
                  0,
                  domain.name.lastIndexOf(rootName) - 1
                )}`
          }`,
          value: `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@${config.webHost};`
        }
      }
    : false;

  //
  // NOTE: we already add the other records if they're set:
  // - has_smtp
  // - smtp_verified_at
  // - smtp_suspended_sent_at
  // - is_smtp_suspended
  // - has_dkim_record
  // - has_return_path_record
  // - has_dmarc_record
  //

  //
  // NOTE: our tests for /v1/domains endpoints check all the above keys
  //       and also `smtp_dns_records`
  //

  //
  // TODO: we may want to exclude "locale" property from all API endpoints
  //       (recursively deep through the objects via the `json` helper functions)
  //
  const final = {
    ...pickOriginal(
      object,
      _.isFunction(domain.toObject) ? domain.toObject() : domain
    ),
    ...virtuals,
    ...(smtpDNSRecords ? { smtp_dns_records: smtpDNSRecords } : {}),
    // add a helper url
    link: `${config.urls.web}/my-account/domains/${punycode.toASCII(
      domain.name
    )}`
  };
  // TODO: clean up other virtuals that are unwanted when `toObject` can't be called
  delete final.locale;
  delete final.skip_verification;
  return final;
}

async function list(ctx) {
  ctx.body = ctx.state.domains.map((d) =>
    omitAdminOnlyDomainKeys(json(d, true), d, ctx.state.user)
  );
}

async function retrieve(ctx) {
  // populate storage quota stuff
  const data = json(await populateDomainStorage(ctx.state.domain, ctx.locale));

  //
  // Only admins of the domain see its other members and pending invites
  // (the invite tokens and invited addresses included), as in the web
  // interface, where they are listed on admin-only pages.  Every user is a
  // virtual member of a global domain, so without this any account could
  // read the addresses and plans of that domain's real admins.
  //
  // (a domain fetched again after an update has no `group`, so admins are
  // also found by their membership)
  if (!isDomainAdmin(ctx.state.domain, ctx.state.user)) {
    // (the user's own membership, matched on the domain itself, as a
    // serialized member may not carry its user's id; `json` serializes each
    // member in order)
    const userId = String(ctx.state.user?._id || ctx.state.user?.id || '');
    const members = Array.isArray(ctx.state.domain.members)
      ? ctx.state.domain.members
      : [];
    data.members =
      Array.isArray(data.members) && data.members.length === members.length
        ? data.members.filter(
            (_member, i) =>
              userId !== '' && getMemberUserId(members[i]) === userId
          )
        : [];
    data.invites = [];
    omitAdminOnlyDomainKeys(data, ctx.state.domain, ctx.state.user);
  }

  ctx.body = data;
}

async function listCatchAllPasswords(ctx) {
  const tokens = [];
  if (
    Array.isArray(ctx.state.domain.tokens) &&
    ctx.state.domain.tokens.length > 0
  ) {
    for (const token of ctx.state.domain.tokens) {
      tokens.push({
        id: token.id,
        description: token.description
      });
    }
  }

  ctx.body = tokens;
}

module.exports = {
  list,
  retrieve,
  _domainJSON: json,
  listCatchAllPasswords
};
