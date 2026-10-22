/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { createRequire } = require('node:module');

const { isSafeXml } = require('#helpers/assert-safe-xml');

//
// The AWS SDK reads every S3 response with its own copy of fast-xml-parser
// (5.2.5), which expands entities declared in a DOCTYPE without limit
// (GHSA-jmr7-xgp7-cmfj, GHSA-m7jm-9gc2-mpf2) and whose numeric entities are
// not limited either (GHSA-8gc5-j5rx-235r).  A domain's custom S3 endpoint
// is any server its owner runs, so its responses could hold the web
// server or the backup worker (and every other customer on it).
//
// S3 never sends a DTD, so that copy now refuses any XML with a markup
// declaration, and any XML longer than an S3 response would be (a listing
// page is a megabyte or two), before it parses it.  A numeric character
// reference is not expansion (one reference, one character), so the length
// cap is what bounds its cost.
//
const MAX_XML_LENGTH = 4 * 1024 * 1024;
const kHardened = Symbol.for('forwardemail.harden-aws-xml');

function hardenAwsXml() {
  let XMLParser;
  try {
    // the exact fast-xml-parser the AWS SDK loads; if it cannot be required
    // as CommonJS (e.g. a newer ESM-only build) this throws and the parser is
    // left untouched
    const core = createRequire(require.resolve('@aws-sdk/client-s3')).resolve(
      '@aws-sdk/core'
    );
    ({ XMLParser } = createRequire(core)('fast-xml-parser'));
  } catch {
    return;
  }

  if (typeof XMLParser?.prototype?.parse !== 'function') return;
  const { parse } = XMLParser.prototype;
  if (parse[kHardened]) return;

  function guardedParse(xml, ...args) {
    const string = Buffer.isBuffer(xml) ? xml.toString('utf8') : xml;
    if (
      typeof string === 'string' &&
      (string.length > MAX_XML_LENGTH || !isSafeXml(string))
    ) {
      const err = new Error('The XML response is not one S3 would send');
      err.code = 'EUNSAFEXML';
      throw err;
    }

    return Reflect.apply(parse, this, [xml, ...args]);
  }

  guardedParse[kHardened] = true;
  try {
    XMLParser.prototype.parse = guardedParse;
  } catch {}
}

try {
  hardenAwsXml();
} catch {}

module.exports = hardenAwsXml;
