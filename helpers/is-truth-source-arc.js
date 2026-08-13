/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');

const parseRootDomain = require('#helpers/parse-root-domain');

function isTruthSourceArc(arc, truthSources) {
  if (
    !arc ||
    !arc.status ||
    arc.status.result !== 'pass' ||
    !arc.signature ||
    !isSANB(arc.signature.signingDomain)
  )
    return false;

  const sealerDomain = parseRootDomain(arc.signature.signingDomain);
  return truthSources.has(sealerDomain);
}

module.exports = isTruthSourceArc;
