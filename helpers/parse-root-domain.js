/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');

function parseRootDomain(name) {
  const parseResult = parseDomain(fromUrl(name));
  return (
    parseResult?.type === ParseResultType?.Listed &&
    parseResult?.icann?.domain &&
    parseResult?.icann?.topLevelDomains
      ? `${parseResult.icann.domain}.${parseResult.icann.topLevelDomains.join(
          '.'
        )}`
      : name
  ).toLowerCase();
}

module.exports = parseRootDomain;
