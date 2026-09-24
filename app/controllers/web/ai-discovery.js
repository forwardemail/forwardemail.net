/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Machine-readable discovery documents for AI agents and API clients.
//
// - /.well-known/ai-catalog.json    AI Catalog 1.0 (https://ai-catalog.io)
// - /.well-known/api-catalog        RFC 9727 API catalog (linkset)
// - /.well-known/mcp/server-card.json  MCP server card for our MCP server
//
// These are built from config so URLs follow WEB_URL in every environment
// (production, self-hosted, test) instead of hardcoding forwardemail.net.
//

const config = require('#config');

const MCP_PACKAGE = '@forwardemail/mcp-server';
const MCP_REPOSITORY = 'https://github.com/forwardemail/mcp-server';
const MCP_DESCRIPTION =
  'Official Model Context Protocol server for Forward Email. Exposes the Forward Email REST API (domains, aliases, email, messages, contacts, calendars, logs) as MCP tools.';

const SERVICE_DESCRIPTION =
  'Privacy-focused, 100% open-source email service for custom domains: free email forwarding, IMAP/POP3/SMTP hosting, CalDAV/CardDAV, and a REST API.';

// Cache for an hour in browsers and shared caches (see static cache policy)
const CACHE_CONTROL = 'public, max-age=3600';

function webUrl() {
  return config.urls.web.replace(/\/$/, '');
}

function mcpServerCard() {
  const base = webUrl();
  return {
    $schema:
      'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    name: 'io.github.forwardemail/mcp-server',
    title: 'Forward Email',
    description: MCP_DESCRIPTION,
    websiteUrl: `${base}/en/blog/docs/mcp`,
    repository: {
      url: MCP_REPOSITORY,
      source: 'github'
    },
    packages: [
      {
        registryType: 'npm',
        registryBaseUrl: 'https://registry.npmjs.org',
        identifier: MCP_PACKAGE,
        transport: { type: 'stdio' },
        environmentVariables: [
          {
            name: 'FORWARD_EMAIL_API_KEY',
            description: `Forward Email API key (${base}/en/my-account/security)`,
            isRequired: true,
            isSecret: true
          },
          {
            name: 'FORWARD_EMAIL_API_URL',
            description: 'API base URL (defaults to the hosted API)',
            isRequired: false,
            default: config.urls.api
          },
          {
            name: 'FORWARD_EMAIL_ALIAS_USER',
            description:
              'Alias email address for alias-authenticated endpoints (messages, folders, contacts, calendars)',
            isRequired: false
          },
          {
            name: 'FORWARD_EMAIL_ALIAS_PASSWORD',
            description: 'Generated password for FORWARD_EMAIL_ALIAS_USER',
            isRequired: false,
            isSecret: true
          }
        ]
      }
    ]
  };
}

function aiCatalog() {
  const base = webUrl();
  const host = new URL(base).hostname;
  const publisher = {
    identifier: `did:web:${host}`,
    displayName: 'Forward Email'
  };
  return {
    specVersion: '1.0',
    host: {
      displayName: 'Forward Email',
      identifier: `did:web:${host}`,
      documentationUrl: `${base}/en/blog/docs`,
      logoUrl: `${base}/img/logo-square.svg`
    },
    entries: [
      {
        identifier: `urn:air:${host}:mcp:forwardemail`,
        type: 'application/mcp-server-card+json',
        url: `${base}/.well-known/mcp/server-card.json`,
        displayName: 'Forward Email MCP Server',
        description: MCP_DESCRIPTION,
        tags: ['email', 'mcp', 'domains', 'aliases', 'calendar', 'contacts'],
        publisher
      },
      {
        identifier: `urn:air:${host}:api:rest`,
        type: 'application/vnd.oai.openapi+json',
        url: `${base}/api-spec.json`,
        displayName: 'Forward Email REST API (OpenAPI)',
        description:
          'OpenAPI specification for the Forward Email REST API: domains, aliases, outbound SMTP, messages, folders, contacts, calendars, and logs.',
        tags: ['email', 'api', 'openapi', 'rest'],
        publisher
      },
      {
        identifier: `urn:air:${host}:llms:index`,
        type: 'text/markdown',
        url: `${base}/llms.txt`,
        displayName: 'llms.txt',
        description: SERVICE_DESCRIPTION,
        tags: ['llms.txt', 'documentation'],
        publisher
      },
      {
        identifier: `urn:air:${host}:llms:full`,
        type: 'text/markdown',
        url: `${base}/llms-full.txt`,
        displayName: 'llms-full.txt',
        description:
          'Extended plain-text context about Forward Email for AI models.',
        tags: ['llms.txt', 'documentation'],
        publisher
      },
      {
        identifier: `urn:air:${host}:api:catalog`,
        type: 'application/linkset+json',
        url: `${base}/.well-known/api-catalog`,
        displayName: 'API catalog (RFC 9727)',
        publisher
      }
    ]
  };
}

function apiCatalog() {
  const base = webUrl();
  return {
    linkset: [
      {
        anchor: `${config.urls.api.replace(/\/$/, '')}/v1`,
        'service-desc': [
          {
            href: `${base}/api-spec.json`,
            type: 'application/vnd.oai.openapi+json'
          }
        ],
        'service-doc': [{ href: `${base}/en/email-api`, type: 'text/html' }],
        'service-meta': [
          {
            href: `${base}/.well-known/ai-catalog.json`,
            type: 'application/ai-catalog+json'
          },
          {
            href: `${base}/.well-known/mcp/server-card.json`,
            type: 'application/mcp-server-card+json'
          }
        ],
        status: [{ href: 'https://status.forwardemail.net', type: 'text/html' }]
      }
    ]
  };
}

function send(ctx, type, body) {
  ctx.set('Cache-Control', CACHE_CONTROL);
  if (ctx.method === 'HEAD') {
    ctx.type = type;
    ctx.body = '';
    return;
  }

  ctx.body = JSON.stringify(body, null, 2);
  // set after the body, since koa infers a type when the body is assigned
  ctx.type = type;
}

function aiCatalogController(ctx) {
  send(ctx, 'application/ai-catalog+json', aiCatalog());
}

function apiCatalogController(ctx) {
  // CORS and the RFC 9727 Link header are set in config/web.js
  send(ctx, 'application/linkset+json', apiCatalog());
}

function mcpServerCardController(ctx) {
  send(ctx, 'application/mcp-server-card+json', mcpServerCard());
}

module.exports = {
  aiCatalog: aiCatalogController,
  apiCatalog: apiCatalogController,
  mcpServerCard: mcpServerCardController,
  buildAiCatalog: aiCatalog,
  buildApiCatalog: apiCatalog,
  buildMcpServerCard: mcpServerCard
};
