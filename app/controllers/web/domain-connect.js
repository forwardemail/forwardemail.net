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
// 2. We auto-discover the domain's actual DNS provider via _domainconnect TXT
// 3. We verify the provider supports our template
// 4. We build the signed apply URL and redirect the user
//
// Spec: https://github.com/Domain-Connect/spec
// IETF Draft: https://www.ietf.org/archive/id/draft-kowalik-regext-domainconnect-00.html
// Cloudflare: https://developers.cloudflare.com/dns/reference/domain-connect/
//
// Discovery flow (per spec §6):
//   1. Query _domainconnect.<domain> TXT → returns API hostname/path
//   2. GET https://{_domainconnect}/v2/{domain}/settings → returns JSON with urlSyncUX, urlAPI
//   3. Use urlAPI for template checks, urlSyncUX for the user-facing apply redirect
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
    // TXT record value may be wrapped in quotes; strip trailing dots from DNS
    const record = data.Answer[0].data
      .replace(/"/g, '')
      .replace(/\.$/, '')
      .trim();
    // The record is the hostname of the Domain Connect API
    // Per spec it should be a hostname (no protocol), but some providers include the full URL
    const apiBase = record.startsWith('http') ? record : `https://${record}`;
    return apiBase;
  } catch {
    return null;
  }
}

// Fetch the Domain Connect settings JSON from the provider's settings endpoint
// Per spec §6: GET https://{_domainconnect}/v2/{domain}/settings
// Returns JSON with urlSyncUX (UX URL for apply redirect) and urlAPI (API URL for template checks)
async function fetchProviderSettings(apiBase, domain) {
  try {
    const url = `${apiBase}/v2/${encodeURIComponent(domain)}/settings`;
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

// Check if a provider has our template by querying their template endpoint.
// Per spec §7.2.1: GET {urlAPI}/v2/domainTemplates/providers/{providerId}/services/{serviceId}
// Returns:
//   'supported'  — provider returned 200 (template exists)
//   'not_found'  — provider returned 404 (template definitively not onboarded)
//   'error'      — network error or non-200/404 status (inconclusive)
async function checkTemplateSupport(apiBase) {
  try {
    const url = `${apiBase}/v2/domainTemplates/providers/${PROVIDER_ID}/services/${SERVICE_ID}`;
    const { statusCode } = await undici.request(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      bodyTimeout: 5000,
      headersTimeout: 5000
    });
    if (statusCode === 200) return 'supported';
    if (statusCode === 404) return 'not_found';
    return 'error';
  } catch {
    return 'error';
  }
}

// Match a discovered API base URL to a known provider from DOMAIN_CONNECT_PROVIDERS.
// The discovered URL (from _domainconnect TXT) may not exactly match the applyUrl
// but will share the same hostname. Returns the provider object or null.
function matchDiscoveredToKnownProvider(discoveredUrl) {
  try {
    const discoveredHost = new URL(discoveredUrl).hostname;
    for (const p of nsProviders) {
      if (p.domainConnect && p.domainConnect.urlSyncUX) {
        const knownHost = new URL(p.domainConnect.urlSyncUX).hostname;
        if (discoveredHost === knownHost) return p;
      }

      if (p.domainConnect && p.domainConnect.applyUrl) {
        const knownHost = new URL(p.domainConnect.applyUrl).hostname;
        if (discoveredHost === knownHost) return p;
      }
    }
  } catch {
    // ignore URL parse errors
  }

  return null;
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
        config.domainConnect.syncKeyId
      )}`;
    } catch {
      // if signing fails, proceed without signature
    }
  }

  return `${urlSyncUX}/v2/domainTemplates/providers/${PROVIDER_ID}/services/${SERVICE_ID}/apply?${queryString}${sigSuffix}`;
}

// POST /domain-connect
// Body: { domain, provider (optional slug), redirect_to (optional fallback URL on error) }
//
// For AJAX requests (Accept: application/json):
//   Returns JSON { applyUrl } so the client can open it in a new tab
//   and show a verification modal on the current page.
//
// For regular form submissions:
//   Redirects the user to the provider's Domain Connect apply URL.
//
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

  //
  // Provider discovery strategy:
  //
  // 1. Always auto-discover the domain's actual DNS provider via _domainconnect TXT.
  //    This ensures we redirect to the correct provider even if the user clicked
  //    1-Click Setup on a different provider's guide page (e.g. user is on the
  //    Glauca guide page but the domain is actually on Cloudflare).
  //
  // 2. If discovery succeeds, fetch the provider's settings JSON to get:
  //    - urlSyncUX: the user-facing UX URL for the apply redirect
  //    - urlAPI: the API URL for template checks
  //    Per spec §6, the settings endpoint is: {apiBase}/v2/{domain}/settings
  //
  // 3. Verify the provider has our template via urlAPI:
  //    - 'supported' (200) → use the discovered provider's urlSyncUX
  //    - 'not_found' (404) → show DOMAIN_CONNECT_TEMPLATE_NOT_FOUND error
  //    - 'error' (network/timeout) → fall through to slug fallback
  //
  // 4. If discovery fails (no TXT record) or template check had a network error,
  //    fall back to the hardcoded provider slug from the form.
  //
  // 5. If nothing works, show DOMAIN_CONNECT_PROVIDER_NOT_FOUND error.
  //
  let urlSyncUX = null;
  let templateDefinitelyNotFound = false;

  // Step 1: Auto-discover via _domainconnect TXT record
  const discovered = await discoverDomainConnectUrl(domain);

  if (discovered) {
    // We found a Domain Connect provider for this domain.
    // Fetch their settings to get the correct urlSyncUX and urlAPI.
    const settings = await fetchProviderSettings(discovered, domain);

    if (settings && settings.urlSyncUX) {
      // Provider has proper settings — check if our template is supported.
      // Use urlAPI for template check if available, otherwise use the discovered base.
      const templateCheckBase = settings.urlAPI || discovered;
      const templateResult = await checkTemplateSupport(templateCheckBase);
      if (templateResult === 'supported') {
        urlSyncUX = settings.urlSyncUX;
      } else if (templateResult === 'not_found') {
        // Provider definitively does not have our template
        templateDefinitelyNotFound = true;
      }

      // 'error' falls through to slug fallback below
    } else {
      // No settings endpoint — try matching to a known provider by hostname
      const matched = matchDiscoveredToKnownProvider(discovered);

      // Check template at the discovered URL
      const templateResult = await checkTemplateSupport(discovered);
      if (templateResult === 'supported') {
        // Use the known provider's urlSyncUX if available, then applyUrl, then discovered
        urlSyncUX =
          (matched &&
            matched.domainConnect &&
            matched.domainConnect.urlSyncUX) ||
          (matched &&
            matched.domainConnect &&
            matched.domainConnect.applyUrl) ||
          discovered;
      } else if (templateResult === 'not_found') {
        templateDefinitelyNotFound = true;
      }

      // 'error' (e.g. ENOTFOUND for dead hostnames) falls through to slug fallback
    }
  }

  // Step 2: If auto-discovery failed or was inconclusive (network error),
  // fall back to the provider slug from the form.
  if (!urlSyncUX && !templateDefinitelyNotFound && isSANB(providerSlug)) {
    const knownProvider = nsProviders.find(
      (p) =>
        p.slug === providerSlug &&
        p.domainConnect &&
        (p.domainConnect.urlSyncUX || p.domainConnect.applyUrl)
    );
    if (knownProvider)
      urlSyncUX =
        knownProvider.domainConnect.urlSyncUX ||
        knownProvider.domainConnect.applyUrl;
  }

  // Step 3: Show appropriate error
  if (templateDefinitelyNotFound) {
    const message = ctx.translate('DOMAIN_CONNECT_TEMPLATE_NOT_FOUND', domain);
    if (ctx.accepts('html')) {
      ctx.flash('error', message);
      return ctx.redirect(fallbackUrl);
    }

    ctx.body = { message };
    return;
  }

  if (!urlSyncUX) {
    const message = ctx.translate('DOMAIN_CONNECT_PROVIDER_NOT_FOUND', domain);
    if (ctx.accepts('html')) {
      ctx.flash('error', message);
      return ctx.redirect(fallbackUrl);
    }

    ctx.body = { message };
    return;
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
        : '',
    // Per Domain Connect spec §7.2.2, redirect_uri tells the provider
    // where to redirect the user after applying the template.
    // Our template has syncRedirectDomain=forwardemail.net so the provider
    // will validate that this URI is on that domain.
    redirect_uri: `${config.urls.web}${ctx.state.l(
      `/my-account/domains/${encodeURIComponent(domain)}`
    )}`
  });

  const applyUrl = buildApplyUrl(
    urlSyncUX,
    params,
    config.domainConnect.privateKey || null
  );

  // For AJAX requests, return JSON so the client can open the apply URL
  // in a new tab and show a verification modal on the current page.
  if (!ctx.accepts('html')) {
    ctx.body = { applyUrl };
    return;
  }

  return ctx.redirect(applyUrl);
};
