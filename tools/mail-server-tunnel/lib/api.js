/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import { Buffer } from 'node:buffer';

import { VERSION } from './config.js';

//
// A request to the Forward Email API with the API token
// (https://forwardemail.net/email-api).
//
export async function request(config, method, pathname, body) {
  let response;
  try {
    response = await fetch(new URL(pathname, config.apiUrl), {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.token}:`).toString(
          'base64'
        )}`,
        Accept: 'application/json',
        'User-Agent': `mail-server-tunnel/${VERSION}`,
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
      redirect: 'error'
    });
  } catch (error_) {
    const error = new Error(
      `Could not reach ${config.apiUrl}: ${
        error_.cause?.message || error_.message
      }`
    );
    error.isNetwork = true;
    throw error;
  }

  let data;
  const text = await response.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text.slice(0, 300) };
  }

  if (!response.ok) {
    const error = new Error(
      response.status === 401
        ? 'The API token was refused. Copy it again from My Account > Security.'
        : String(
            data?.message || `The API answered ${response.status}`
          ).replace(/<[^>]+>/g, '')
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export function getAccount(config) {
  return request(config, 'GET', '/v1/account');
}

export async function listDomains(config) {
  const domains = await request(config, 'GET', '/v1/domains');
  return Array.isArray(domains) ? domains : [];
}

export function getDomain(config, name) {
  return request(config, 'GET', `/v1/domains/${encodeURIComponent(name)}`);
}

// Turns the "Mail Server Tunnel" setting of a domain on or off
export function setTunnel(config, name, isEnabled) {
  return request(config, 'PUT', `/v1/domains/${encodeURIComponent(name)}`, {
    has_tunnel: isEnabled
  });
}
