/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { createSign } = require('node:crypto');

const Boom = require('@hapi/boom');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const undici = require('undici');
const config = require('#config');
const Domains = require('#models/domains');
const { nsProviders } = require('#config/utilities');

//
// Domain Connect synchronous flow:
// 1. User submits domain name (and optionally selects a provider)
// 2. We look up the domain's _domainconnect TXT record to discover the provider
// 3. We verify the provider supports our template
// 4. We build the signed apply URL and redirect the user
//
// Spec: https://github.com/Domain-Connect/spec
// Cloudflare: https://developers.cloudflare.com/dns/reference/domain-connect/
//
// Apply URL format:
//   {urlSyncUX}/v2/domainTemplates/providers/{providerId}/services/{serviceId}/apply?{params}
//

const PROVIDER_ID = config.domainConnect.providerId;
const SERVICE_ID = config.domainConnect.serviceId;

// Discover the Domain Connect API base URL for a domain via DNS-over-HTTPS
// Queries _domainconnect.<domain> TXT record via Cloudflare DoH
async function discoverDomainConnectUrl(domain) {
  try {
    const url = `https://cloudflare-dns.com/dns-query?name=_domainconnect.${encodeURIComponent(
      domain
    )}&type=TXT`;
    const { body, statusCode } = await undici.request(url, {
      method: 'GET',
      headers: { Accept: 'application/dns-json' },
      bodyTimeout: 5000,
      headersTimeout: 5000
    });
    if (statusCode !== 200) return null;
    const data = await body.json();
    if (!data.Answer || data.Answer.length === 0) return null;
    // TXT record value may be wrapped in quotes
    const record = data.Answer[0].data.replace(/"/g, '').trim();
    // The record is the hostname of the Domain Connect API
    // Per spec it should be a hostname (no protocol), but some providers include the full URL
    const apiBase = record.startsWith('http') ? record : `https://${record}`;
    return apiBase;
  } catch {
    return null;
  }
}

// Fetch the Domain Connect settings JSON from the provider's well-known endpoint
async function fetchProviderSettings(apiBase) {
  try {
    const url = `${apiBase}/.well-known/domain-connect`;
    const { body, statusCode } = await undici.request(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      bodyTimeout: 5000,
      headersTimeout: 5000
    });
    if (statusCode !== 200) return null;
    return body.json();
  } catch {
    return null;
  }
}

// Build the signed synchronous apply URL
// Per spec: sort params alphabetically, sign with RSA-SHA256, append &sig=...&key=...
function buildApplyUrl(urlSyncUX, params, privateKey) {
  // Sort params alphabetically (required by spec for signing)
  const sorted = new URLSearchParams(
    [...params.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  );
  const queryString = sorted.toString();
  let sigSuffix = '';
  if (privateKey) {
    try {
      const sign = createSign('RSA-SHA256');
      sign.update(queryString);
      const sig = sign.sign(privateKey, 'base64');
      sigSuffix = `&sig=${encodeURIComponent(sig)}&key=${encodeURIComponent(
        PROVIDER_ID
      )}`;
    } catch {
      // if signing fails, proceed without signature
    }
  }

  return `${urlSyncUX}/v2/domainTemplates/providers/${PROVIDER_ID}/services/${SERVICE_ID}/apply?${queryString}${sigSuffix}`;
}

// POST /domain-connect
// Body: { domain, provider (optional slug), redirect_to (optional fallback URL on error) }
// Redirects the user to the provider's Domain Connect apply URL
module.exports = async (ctx) => {
  const {
    domain: rawDomain,
    provider: providerSlug,
    redirect_to: redirectTo
  } = ctx.request.body;

  if (!isSANB(rawDomain))
    throw Boom.badRequest(ctx.translateError('DOMAIN_NAME_REQUIRED'));

  const domain = rawDomain.trim().toLowerCase();

  if (!isFQDN(domain))
    throw Boom.badRequest(ctx.translateError('INVALID_DOMAIN'));

  // Determine the fallback redirect URL on error.
  // If the caller passed a redirect_to param (e.g. from retrieve.pug or verify-smtp.pug)
  // we use that; otherwise fall back to /domain-connect.
  const fallbackUrl =
    isSANB(redirectTo) &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//')
      ? ctx.state.l(redirectTo)
      : ctx.state.l('/domain-connect');

  // Look up the user's domain record (if logged in) to get DKIM/verification vars.
  // When the form is submitted from retrieve.pug or verify-smtp.pug the user is
  // already authenticated and the domain belongs to them, so this will always
  // resolve.  For the public /domain-connect page it may be null.
  let userDomain = null;
  if (ctx.isAuthenticated() && ctx.state.user) {
    try {
      userDomain = await Domains.findOne({
        name: domain,
        members: { $elemMatch: { user: ctx.state.user._id } }
      })
        .select(
          'id name dkim_key_selector dkim_public_key verification_record return_path'
        )
        .lean()
        .exec();
    } catch {
      // ignore — domain variables will be empty strings
    }
  }

  // Determine the provider's Domain Connect API base URL
  let urlSyncUX = null;

  // 1. If a provider slug was explicitly selected, use its known applyUrl
  if (isSANB(providerSlug)) {
    const knownProvider = nsProviders.find(
      (p) =>
        p.slug === providerSlug && p.domainConnect && p.domainConnect.applyUrl
    );
    if (knownProvider) urlSyncUX = knownProvider.domainConnect.applyUrl;
  }

  // 2. Otherwise, auto-discover via _domainconnect TXT record
  if (!urlSyncUX) {
    const discovered = await discoverDomainConnectUrl(domain);
    if (discovered) {
      const settings = await fetchProviderSettings(discovered);
      urlSyncUX =
        settings && settings.urlSyncUX ? settings.urlSyncUX : discovered;
    }
  }

  if (!urlSyncUX) {
    ctx.flash(
      'error',
      ctx.translate('DOMAIN_CONNECT_PROVIDER_NOT_FOUND', domain)
    );
    return ctx.redirect(fallbackUrl);
  }

  // Build template variable params
  // Variables defined in our template: %domainId%, %fwdEmailVerification%,
  // %fwdEmailDkimSelector%, %fwdEmailDkimValue%
  const params = new URLSearchParams({
    domain,
    domainId: userDomain ? String(userDomain.id) : '',
    fwdEmailVerification: userDomain
      ? userDomain.verification_record || ''
      : '',
    fwdEmailDkimSelector: userDomain ? userDomain.dkim_key_selector || '' : '',
    fwdEmailDkimValue:
      userDomain && userDomain.dkim_public_key
        ? `v=DKIM1; k=rsa; p=${Buffer.from(
            userDomain.dkim_public_key.buffer || userDomain.dkim_public_key
          ).toString('base64')};`
        : ''
  });

  const applyUrl = buildApplyUrl(
    urlSyncUX,
    params,
    config.domainConnect.privateKey || null
  );

  return ctx.redirect(applyUrl);
};
