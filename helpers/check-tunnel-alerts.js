/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const ms = require('ms');

const _ = require('#helpers/lodash');
const Domains = require('#models/domains');
const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const tunnel = require('#helpers/tunnel');

// how long a tunnel may be down before its domain's admins are emailed
const GRACE = ms('10m');
// how often they are reminded while it stays down
const REMINDER = ms('1d');

//
// Mail Server Tunnel alerts (see `helpers/tunnel.js`)
//
// Mail for a domain with a tunnel is deferred while its tunnel app is not
// connected, or while the app cannot reach the local mail server. Senders
// only retry for a few days, so the domain's admins are emailed once that
// has lasted `GRACE`, reminded every `REMINDER` while it lasts, and emailed
// again when it is over.
//
async function checkTunnelAlerts(client, options = {}) {
  const { grace = GRACE, reminder = REMINDER } = options;
  const sent = [];

  async function send(domain, kind, args) {
    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);
    await email({
      template: 'alert',
      message: {
        to,
        subject: i18n.translate(`TUNNEL_${kind}_SUBJECT`, locale, domain.name)
      },
      locals: {
        message: i18n.translate(
          `TUNNEL_${kind}_MESSAGE`,
          locale,
          domain.name,
          ...args
        ),
        locale
      }
    });
    sent.push({ domain: domain.name, kind });
  }

  for await (const domain of Domains.find({
    has_tunnel: true,
    plan: { $ne: 'free' }
  })
    .select(
      'name id plan members tunnel_issue_at tunnel_issue_state tunnel_alert_sent_at'
    )
    .lean()
    .cursor()) {
    try {
      let online = null;
      const value = await client.get(`${tunnel.ONLINE_PREFIX}${domain._id}`);
      if (value) online = JSON.parse(value);

      const state = online
        ? online.local?.state === 'down'
          ? 'local_down'
          : 'ok'
        : 'offline';
      const now = Date.now();

      if (state === 'ok') {
        if (!domain.tunnel_issue_at && !domain.tunnel_alert_sent_at) continue;
        if (domain.tunnel_alert_sent_at) await send(domain, 'RESTORED', []);
        await Domains.findByIdAndUpdate(domain._id, {
          $unset: {
            tunnel_issue_at: 1,
            tunnel_issue_state: 1,
            tunnel_alert_sent_at: 1
          }
        });
        continue;
      }

      // (first seen down, or down in another way than before)
      if (!domain.tunnel_issue_at || domain.tunnel_issue_state !== state) {
        await Domains.findByIdAndUpdate(domain._id, {
          $set: { tunnel_issue_at: new Date(now), tunnel_issue_state: state }
        });
        continue;
      }

      const issueAt = new Date(domain.tunnel_issue_at).getTime();
      if (now - issueAt < grace) continue;
      if (
        domain.tunnel_alert_sent_at &&
        now - new Date(domain.tunnel_alert_sent_at).getTime() < reminder
      )
        continue;

      const since = new Date(issueAt).toUTCString();
      const link = `${config.urls.web}/my-account/domains/${punycode.toASCII(
        domain.name
      )}/advanced-settings#mail-server-tunnel`;
      if (state === 'offline') await send(domain, 'OFFLINE', [since, link]);
      else
        await send(domain, 'LOCAL_DOWN', [
          since,
          // (text an app sent about itself, never markup)
          _.escape(String(online.local.message || 'No details').slice(0, 300)),
          link
        ]);
      await Domains.findByIdAndUpdate(domain._id, {
        $set: { tunnel_alert_sent_at: new Date(now) }
      });
    } catch (err) {
      logger.fatal(err);
    }
  }

  return sent;
}

module.exports = checkTunnelAlerts;
