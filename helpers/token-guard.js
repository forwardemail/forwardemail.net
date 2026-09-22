/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
// (the record Mongoose keeps of how an array was modified; read only)
const { arrayAtomicsSymbol } = require('mongoose/lib/helpers/symbols');

//
// A token can validate a password only with both its salt and its hash.
//
// The schemas mark both `required`, but that is no protection: Mongoose
// skips `required` for a path left out of the query projection, and the
// two are `select: false`, so a token added to a document loaded with the
// default projection, or a snapshot built from documents that hide them
// (`toObject()` strips them), used to be saved without them; and a write
// that replaces a token array as a whole (`doc.tokens = ...`, `splice`,
// and a `pull` of any token but the last, which Mongoose writes the same
// way) after loading it without them drops them from every token that
// stays.  The owner of such a token is locked out: no password can ever
// match it.
//
// `guardTokenPaths` refuses every such write from `save()`; writers that
// bypass validation (`rollbackRekey`, which restores tokens with an update)
// keep only usable tokens with `usableTokens`.
//

function isUsableToken(token) {
  return (
    token !== null &&
    typeof token === 'object' &&
    isSANB(token.salt) &&
    isSANB(token.hash)
  );
}

function usableTokens(tokens) {
  return Array.isArray(tokens)
    ? tokens.filter((token) => isUsableToken(token))
    : [];
}

// whether the pending write replaces the array as a whole (`$set`) rather
// than pushing to or pulling from it (Mongoose records the operation on
// the array; without a record the write replaces it)
function isReplaced(array) {
  const atomics = array ? array[arrayAtomicsSymbol] : undefined;
  if (!atomics || typeof atomics !== 'object') return true;
  const operations = Object.keys(atomics);
  return operations.length === 0 || operations.includes('$set');
}

function tokenError(path, message) {
  const err = new Error(`${path}: ${message}`);
  err.isCodeBug = true;
  return err;
}

//
// Adds a validation of the token arrays at `paths` to `schema`: a token
// that is being created must carry a salt and a hash, and an array whose
// tokens were loaded without them cannot be replaced as a whole (a push or
// a pull leaves the other tokens untouched and is fine).
//
function guardTokenPaths(schema, paths) {
  schema.pre('validate', function (next) {
    for (const path of paths) {
      if (!this.isDirectModified(path)) continue;

      const tokens = this.get(path);
      if (!Array.isArray(tokens)) continue;

      const replaced = isReplaced(tokens);
      const secretsLoaded =
        this.isSelected(`${path}.salt`) && this.isSelected(`${path}.hash`);

      for (const token of tokens) {
        if (isUsableToken(token)) continue;

        if (token.isNew)
          return next(
            tokenError(
              path,
              'a token without a salt or a hash could never validate a password'
            )
          );

        if (replaced && !secretsLoaded)
          return next(
            tokenError(
              path,
              'the tokens cannot be replaced without their salt and hash selected (the tokens that stay would lose them)'
            )
          );
      }
    }

    next();
  });
}

module.exports = { guardTokenPaths, isUsableToken, usableTokens };
