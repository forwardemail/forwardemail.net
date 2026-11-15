/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The port 80 server (proxy.js) redirects http to https.  It must redirect
// only to our own hostnames: a request with any other Host header goes to
// the site, not to the host it named.
//
const http = require('node:http');
const path = require('node:path');
const process = require('node:process');
const { fork } = require('node:child_process');
const { once } = require('node:events');

const test = require('ava');

const env = require('#config/env');

test.before(async (t) => {
  const { default: getPort } = await import('get-port');
  t.context.port = await getPort();
  // (proxy.js sends "ready" once it listens)
  t.context.proxy = fork(path.join(__dirname, '..', '..', 'proxy.js'), {
    env: {
      ...process.env,
      PROXY_PORT: t.context.port,
      PROXY_SERVER_HOST: '127.0.0.1'
    },
    stdio: ['ignore', 'ignore', 'ignore', 'ipc']
  });
  const [message] = await Promise.race([
    once(t.context.proxy, 'message'),
    once(t.context.proxy, 'exit')
  ]);
  t.is(message, 'ready');
});

test.after.always((t) => {
  if (t.context.proxy) t.context.proxy.kill();
});

// (fetch does not let a Host header be set)
async function get(t, headers, url = '/en/faq?a=b') {
  const request = http.request({
    host: '127.0.0.1',
    port: t.context.port,
    path: url,
    headers,
    setHost: false
  });
  request.end();
  const [response] = await once(request, 'response');
  response.resume();
  return response;
}

test('redirects our own hostnames to https', async (t) => {
  for (const host of [
    env.WEB_HOST,
    `${env.WEB_HOST}:8080`,
    `api.${env.WEB_HOST}`,
    env.API_HOST,
    env.MX1_HOST
  ]) {
    const response = await get(t, { Host: host });
    t.is(response.statusCode, 301);
    t.is(response.headers.location, `https://${host}/en/faq?a=b`);
  }
});

test('redirects any other host to the site', async (t) => {
  for (const headers of [
    { Host: 'hh-audit.invalid' },
    { Host: `${env.WEB_HOST}.hh-audit.invalid` },
    { Host: `hh-audit.invalid${env.WEB_HOST}` },
    { Host: `hh-audit.invalid/.${env.WEB_HOST}` },
    { Host: `hh-audit.invalid:x@${env.WEB_HOST}` },
    {
      Host: 'hh-audit.invalid',
      'X-Forwarded-Host': 'hh-audit.invalid',
      Forwarded: 'host=hh-audit.invalid'
    },
    // an HTTP/1.0 request may come without a Host header at all
    {}
  ]) {
    const response = await get(t, headers);
    t.is(response.statusCode, 301);
    t.is(response.headers.location, `https://${env.WEB_HOST}/en/faq?a=b`);
  }
});

test('forwarding headers do not change the redirect', async (t) => {
  const response = await get(t, {
    Host: env.WEB_HOST,
    'X-Forwarded-Host': 'hh-audit.invalid',
    Forwarded: 'host=hh-audit.invalid'
  });
  t.is(response.headers.location, `https://${env.WEB_HOST}/en/faq?a=b`);
});
