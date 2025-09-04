/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

const Boom = require('@hapi/boom');
const WKDClient = require('@openpgp/wkd-client');
const isHTML = require('is-html');
const ms = require('ms');
const undici = require('undici');

const REGEX_LOCALHOST = require('./regex-localhost');
const TimeoutError = require('./timeout-error');
const i18n = require('./i18n');
const logger = require('./logger');
const parseRootDomain = require('./parse-root-domain');
const { encoder, decoder } = require('./encoder-decoder');

const config = require('#config');

const DURATION = config.env === 'test' ? '5s' : '2s';

//
// NOTE: this uses `fetch` which is OK because
//       as of Node v18 it uses Undici fetch under the hood
//
//       HOWEVER there's no default timeout in this implementation
//       <https://github.com/openpgpjs/wkd-client/issues/6>
//
// <https://github.com/nodejs/undici/issues/421#issuecomment-1491441971>
// <https://keys.openpgp.org/about/api#rate-limiting>
//
// Undici had a core bug with arrayBuffer() memory leak
// <https://github.com/nodejs/undici/issues/3435>
//
// TODO: pending PR in wkd-client package
// <https://github.com/openpgpjs/wkd-client/issues/3>
// <https://github.com/openpgpjs/wkd-client/pull/4>
//
function WKD(resolver, client) {
  const _wkd = new WKDClient();
  _wkd._fetch = async (url) => {
    // TODO: we may want to prevent localhost bound reverse hostname
    //       (in which case we'd need `punycode.toASCII` on the domain)
    if (
      isIP(parseRootDomain(url)) &&
      REGEX_LOCALHOST.test(parseRootDomain(url))
    )
      throw Boom.badRequest(i18n.translateError('INVALID_LOCALHOST_URL', 'en'));
    const abortController = new AbortController();
    const t = setTimeout(() => {
      if (!abortController?.signal?.aborted)
        abortController.abort(
          new TimeoutError(`${url} took longer than ${DURATION}`)
        );
    }, ms(DURATION));
    const dispatcher = new undici.Agent({
      headersTimeout: ms(DURATION),
      connectTimeout: ms(DURATION),
      bodyTimeout: ms(DURATION),
      //
      //
      // TODO: there is a bug in tangerine where if we supply
      //       a custom resolver in self-hosted mode then
      //       it causes an uncaught exception it appears
      //
      //
      // TODO: an uncaught exception occurs here in self hosting sometimes (?)
      // TypeError: Cannot read properties of undefined (reading 'length')
      // (which means it occurs in tangerine under the hood)
      //
      ...(config.isSelfHosted
        ? {}
        : {
            connect: {
              lookup(hostname, options, fn) {
                resolver
                  .lookup(hostname, options)
                  .then((result) => {
                    fn(null, result?.address, result?.family);
                  })
                  .catch((err) => fn(err));
              }
            }
          })
    });
    const response = await undici.fetch(url, {
      signal: abortController.signal,
      dispatcher
      // TODO: may need `dispatcher.destroy()`, but not sure since we use `undici.fetch` vs `undici.request`
    });
    clearTimeout(t);
    return response;
  };

  // override lookup so we can implement caching
  const { lookup } = _wkd;
  // <https://github.com/openpgpjs/wkd-client/blob/1d7a5ff05479e25cf39c62687d66863093403c4c/src/wkd.js#L33-L48>
  _wkd.lookup = async function (options) {
    // safeguard
    if (typeof options?.email !== 'string')
      throw new TypeError('Invalid email for WKD lookup');

    // redis key
    const key = `wkd:${options.email}`;

    // check cache value
    let cache = await client.getBuffer(key);

    // if cache is `"false"` it indicates none
    // if cache is a string then we can decode it
    if (cache) {
      if (cache.equals(Buffer.from('false')))
        throw Boom.notFound('WKD key not found, try again in 30m');
      return decoder.unpack(cache);
    }

    try {
      cache = await lookup.call(this, options);

      //
      // TODO: we may not want to do isHTML check (?) see comment in GH discussion
      //

      // TODO: this is a temporary fix until the PR noted in `helpers/wkd.js` is merged
      // <https://github.com/sindresorhus/is-html/blob/bc57478683406b11aac25c4a7df78b66c42cc27c/index.js#L1-L11>
      const str = new TextDecoder().decode(cache);
      if (str && isHTML(str)) throw new Error('Invalid WKD lookup HTML result');

      client
        .set(key, encoder.pack(cache), 'PX', ms('1h'))
        .then()
        .catch((err) => logger.fatal(err));
      return cache;
    } catch (err) {
      await client.set(key, Buffer.from('false'), 'PX', ms('1h'));
      throw err;
    }
  };

  return _wkd;
}

module.exports = WKD;
