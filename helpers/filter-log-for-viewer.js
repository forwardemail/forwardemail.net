/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const _ = require('#helpers/lodash');
const checkSRS = require('#helpers/check-srs');

//
// A log of a message sent to several recipients is shown to everyone who may
// see one of them (e.g. two members of a domain, or two customers whose
// addresses were both recipients of one message). Each sees only their own
// recipients in RCPT TO, and this keeps the delivery details of the others out
// as well: where their aliases forward to (addresses, webhooks, mail servers)
// and what those destinations replied.
//
// `isVisible(address)` returns whether the viewer may see an alias (they are
// an admin of its domain, or it is their own alias). Returns the log (changed
// in place) or `null` when nothing in it is the viewer's to see.
//
function filterLogForViewer(log, isVisible) {
  // (a message the viewer sent was already checked against its sender)
  if (log?.email || log?.meta?.email) return log;

  const rcptTo = log?.meta?.session?.envelope?.rcptTo;
  if (!Array.isArray(rcptTo)) return log;

  const isOwn = (address) =>
    typeof address === 'string' && isVisible(checkSRS(address));

  // every recipient is the viewer's to see, so the whole log is
  if (rcptTo.every((rcpt) => isOwn(rcpt?.address))) return log;

  //
  // the reply to the sender, with a delivery error for each alias
  //
  if (log.err && Array.isArray(log.err.bounces) && log.err.bounces.length > 0) {
    const bounces = log.err.bounces.filter((bounce) => isOwn(bounce?.address));
    if (bounces.length === 0) return null;
    // (rebuilt from the viewer's own bounces even when all of them are, since
    // the reply can also name other recipients, e.g. those that received it)
    const messages = _.uniq(
      bounces.map((bounce) => bounce?.err?.message).filter(Boolean)
    );
    const codes = bounces
      .map((bounce) => bounce?.err?.responseCode)
      .filter((code) => Number.isFinite(code))
      .sort((a, b) => a - b);
    log.err = {
      name: log.err.name,
      message: messages.join('; '),
      ...(codes.length > 0 ? { responseCode: codes[0] } : {}),
      ...(log.err.isCodeBug ? { isCodeBug: true } : {}),
      bounces
    };
    log.message = log.err.message;
    return log;
  }

  //
  // a delivery to one destination (or to one webhook for several aliases),
  // logged with the alias it was for
  //
  const forwardedFor = log?.meta?.info?.forwardedFor ?? log?.err?.forwardedFor;
  if (forwardedFor) {
    const aliases = [forwardedFor].flat();
    const own = aliases.filter((alias) => isOwn(alias));
    if (own.length === 0) return null;
    if (own.length < aliases.length) {
      // (a webhook shared by several aliases is known to each of them)
      if (log.meta.info) {
        log.meta.info.forwardedFor = own;
        for (const key of ['accepted', 'rejected']) {
          if (Array.isArray(log.meta.info[key]))
            log.meta.info[key] = log.meta.info[key].filter((a) => isOwn(a));
        }

        if (Array.isArray(log.meta.info?.envelope?.to))
          log.meta.info.envelope.to = log.meta.info.envelope.to.filter((a) =>
            isOwn(a)
          );
      }

      if (log.err) log.err.forwardedFor = own;
    }

    return log;
  }

  //
  // otherwise the log is only shown when every destination in it is the
  // viewer's own (e.g. a mailbox delivery names the alias), or when it names
  // no destination at all (e.g. a reply to the whole message)
  //
  const destinations = [
    ...[log?.meta?.info?.accepted].flat(),
    ...[log?.meta?.info?.rejected].flat(),
    ...[log?.meta?.info?.envelope?.to].flat(),
    ...[log?.err?.envelope?.to].flat(),
    ...[log?.err?.rejected].flat()
  ].filter((a) => typeof a === 'string');

  if (destinations.length > 0)
    return destinations.every((a) => isOwn(a)) ? log : null;

  if (
    log?.meta?.is_webhook ||
    log?.err?.webhook ||
    log?.err?.target ||
    log?.err?.mx ||
    log?.meta?.info?.response
  )
    return null;

  return log;
}

//
// Whether a viewer may see an alias: they are an admin of its domain, or it is
// one of their aliases (`nonAdminDomainsToAliases` maps the id of each domain
// they are a member of to their aliases on it). When `logDomains` is given,
// the domain must also be one of the log's domains.
//
function createIsVisible({ domains, nonAdminDomainsToAliases, logDomains }) {
  return (address) => {
    if (typeof address !== 'string') return false;
    const at = address.lastIndexOf('@');
    if (at <= 0) return false;
    let username = address.slice(0, at).toLowerCase();
    if (username.includes('+'))
      username = username.slice(0, username.indexOf('+'));
    const name = address.slice(at + 1).toLowerCase();
    const domain = (domains || []).find(
      (d) =>
        d.name === name &&
        (!Array.isArray(logDomains) ||
          logDomains.some((id) => id.toString() === d.id))
    );
    if (!domain) return false;
    if (domain.group === 'admin') return true;
    const aliases = nonAdminDomainsToAliases?.[domain.id];
    if (!Array.isArray(aliases)) return false;
    return (
      aliases.includes(`*@${name}`) || aliases.includes(`${username}@${name}`)
    );
  };
}

module.exports = filterLogForViewer;
module.exports.createIsVisible = createIsVisible;
