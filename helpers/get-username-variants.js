/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const { detectInvisibleUnicode } = require('#helpers/detect-invisible-unicode');

//
// Punycode takes time with the square of the length of a string (20,000
// characters took about a second), and no alias name is longer than 150
// characters, so longer names are not converted
//
const MAX_PUNYCODE_LENGTH = 255;

//
// The form a local part (or an alias name) is compared in: Unicode, NFC
// normalized and lowercase (so "blåtest" with a decomposed "å" is the same
// name as with a composed one). Punycode is only defined for domain names
// (RFC 3492), and a local part is Unicode as it is (RFC 6531, SMTPUTF8).
//
// (lowercasing can leave a string that is not NFC, e.g. "İ", so it is
// normalized again after)
//
function normalizeUsername(name) {
  return name.normalize('NFC').toLowerCase().normalize('NFC');
}

//
// Every form a local part is matched against alias names and regular
// expressions in, the normalized form as given first:
//
//   "fællestest"        -> [ "fællestest", "xn--fllestest-g3a" ]
//   "xn--fllestest-g3a" -> [ "xn--fllestest-g3a", "fællestest" ]
//
// Local parts used to be converted to punycode before they were matched, so
// there are aliases named "xn--…" (made to get around that) and regular
// expressions written for the punycode form, which keep working.
//
function getUsernameVariants(username) {
  if (typeof username !== 'string' || username === '') return [];
  const variants = [normalizeUsername(username)];
  if (variants[0].length > MAX_PUNYCODE_LENGTH) return variants;
  const [name] = variants;

  // (the punycode form of a Unicode name)
  try {
    const ascii = punycode.toASCII(name).toLowerCase();
    if (ascii !== name) variants.push(ascii);
  } catch {
    // (not valid punycode)
  }

  //
  // (the Unicode form of a punycode name, only when it is one: "xn--admin-"
  // decodes to "admin" and "xn--*-" to "*", which are not names written in
  // punycode, and a name must not decode to invisible or control
  // characters)
  //
  try {
    const decoded = punycode.toUnicode(name);
    const unicode = normalizeUsername(decoded);
    if (
      unicode !== name &&
      // eslint-disable-next-line no-control-regex
      /[^\u0000-\u007F]/.test(unicode) &&
      punycode.toASCII(decoded).toLowerCase() === name &&
      !detectInvisibleUnicode(unicode) &&
      // (control, format, unassigned or private use characters)
      !/\p{C}/u.test(unicode) &&
      unicode !== '*' &&
      !unicode.startsWith('/') &&
      !variants.includes(unicode)
    ) {
      variants.push(unicode);
      // (and the punycode of the normalized form, e.g. for a name that was
      // encoded decomposed)
      const ascii = punycode.toASCII(unicode).toLowerCase();
      if (!variants.includes(ascii)) variants.push(ascii);
    }
  } catch {
    // (not valid punycode)
  }

  return variants;
}

//
// A name in punycode, as names are compared in when sending
// ("fællestest" and "xn--fllestest-g3a" are the same)
//
function toASCIIUsername(name) {
  if (name.length > MAX_PUNYCODE_LENGTH) return name;
  try {
    return punycode.toASCII(name);
  } catch {
    return name;
  }
}

//
// The names to query aliases with for the variants: as they are, and
// decomposed (NFD), as names saved before they were normalized can be
//
function getQueryNames(variants) {
  return [
    ...new Set(
      variants.flatMap((variant) => [variant, variant.normalize('NFD')])
    )
  ];
}

//
// Of the aliases found for any of the variants, the ones named with the
// earliest variant (so an alias named "fællestest" is used rather than an
// old "xn--fllestest-g3a" one next to it, and the other way round for mail
// sent to the "xn--" form). Names are not normalized when saved, so two
// aliases can be named the same composed and decomposed: the one named
// exactly `exactName` (lowercase) comes first.
//
function filterPreferredAliases(aliases, variants, exactName) {
  for (const variant of variants) {
    const matches = aliases.filter(
      (alias) =>
        typeof alias?.name === 'string' &&
        normalizeUsername(alias.name) === variant
    );
    if (matches.length === 0) continue;
    if (typeof exactName !== 'string') return matches;
    return [
      ...matches.filter((alias) => alias.name.toLowerCase() === exactName),
      ...matches.filter((alias) => alias.name.toLowerCase() !== exactName)
    ];
  }

  return [];
}

module.exports = getUsernameVariants;
module.exports.normalizeUsername = normalizeUsername;
module.exports.filterPreferredAliases = filterPreferredAliases;
module.exports.getQueryNames = getQueryNames;
module.exports.toASCIIUsername = toASCIIUsername;
module.exports.MAX_PUNYCODE_LENGTH = MAX_PUNYCODE_LENGTH;
