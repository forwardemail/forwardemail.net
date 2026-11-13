/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A JSON body is parsed as deep as it is nested, and what described a request
// for each line of its log read its body as deep as it goes: a body some
// thousand levels deep (a few KB) ran it out of stack in the error handler,
// which then never answered, and once more as the response ended, as an
// uncaught exception.  The servers refuse a body nested deeper than a body
// is, as it is parsed (see helpers/limit-body-depth.js), and no longer read
// the body of a request for its log, which carries none (see config/api.js).
//

const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const arrays = (levels) => `${'['.repeat(levels)}${']'.repeat(levels)}`;
const objects = (levels) => `${'{"a":'.repeat(levels)}1${'}'.repeat(levels)}`;

// (the bytes as they are, not serialized as JSON; a request that is not
// answered fails here)
function post(agent, url, body) {
  return agent
    .post(url)
    .set('Content-Type', 'application/json')
    .serialize((data) => data)
    .timeout(ms('10s'))
    .send(body);
}

// the lines logged for a request with a body are logged without it
async function isLoggedWithoutBody(t, agent, url) {
  const requests = utils.captureRequestLog(t);
  const logged = () => requests.filter((request) => request.url.endsWith(url));
  await post(agent, url, objects(8));
  await pWaitFor(() => logged().length > 0, { timeout: ms('10s') });
  return logged().every((request) => request.body === undefined);
}

test.serial('the web server refuses a body nested too deep', async (t) => {
  await utils.setupWebServer(t);
  try {
    // (a page that is none: before any route)
    for (const [body, status] of [
      [arrays(64), 404],
      [objects(64), 404],
      [arrays(65), 400],
      [objects(65), 400],
      [arrays(5000), 400],
      [objects(5000), 400]
    ]) {
      const res = await post(t.context.web, '/en/none', body);
      t.is(res.status, status, `${body.slice(0, 5)} ${body.length}`);
    }

    t.true(await isLoggedWithoutBody(t, t.context.web, '/en/none?logged=1'));
  } finally {
    await utils.teardownWebServer(t);
  }
});

test.serial('the API server refuses a body nested too deep', async (t) => {
  await utils.setupApiServer(t);
  try {
    // (without credentials: before any route)
    for (const [body, status] of [
      [arrays(64), 401],
      [objects(64), 401],
      [arrays(65), 400],
      [objects(65), 400],
      [arrays(5000), 400],
      [objects(5000), 400]
    ]) {
      const res = await post(t.context.api, '/v1/domains', body);
      t.is(res.status, status, `${body.slice(0, 5)} ${body.length}`);
    }

    t.true(await isLoggedWithoutBody(t, t.context.api, '/v1/domains?logged=1'));
  } finally {
    await utils.teardownApiServer(t);
  }
});
