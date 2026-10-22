/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Signing in with Google or GitHub signs in to (or creates) the account with
// the provider's email address, so only an address the provider verified is
// used: anyone can create a Google or GitHub account with someone else's
// address and not verify it.  Accounts already linked to the provider
// profile still sign in by its ID.
//
// Ubuntu One is an OpenID provider, and an assertion names its own provider
// and identity: only an identity at Ubuntu One gives an address (the routes
// refuse any other provider too, see routes/web/auth.js).
//
const UBUNTU_CLAIMED_ID = /^https:\/\/login\.ubuntu\.com\/\+id\/[A-Za-z\d]+$/;

const isVerified = (value) => value === true || value === 'true';

function useVerifiedProviderEmails(passport) {
  if (!passport || typeof passport.getEmailFromProfile !== 'function') return;
  const getEmailFromProfile = passport.getEmailFromProfile.bind(passport);

  passport.getEmailFromProfile = (provider, profile) => {
    if (provider === 'ubuntu')
      return profile &&
        typeof profile.claimedIdentifier === 'string' &&
        UBUNTU_CLAIMED_ID.test(profile.claimedIdentifier)
        ? getEmailFromProfile(provider, profile)
        : undefined;

    if (
      (provider !== 'google' && provider !== 'github') ||
      !profile ||
      typeof profile !== 'object'
    )
      return getEmailFromProfile(provider, profile);

    //
    // Google gives the address with OpenID `email_verified`; GitHub gives
    // every address with `verified` and `primary` (`allRawEmails`), and its
    // primary address is the one used
    //
    const emails = Array.isArray(profile.emails) ? profile.emails : [];
    const match = emails.find(
      (email) =>
        email &&
        typeof email === 'object' &&
        isVerified(email.verified) &&
        (provider === 'google' || email.primary === true)
    );
    if (!match) return;
    return getEmailFromProfile(provider, { ...profile, emails: [match] });
  };
}

module.exports = useVerifiedProviderEmails;
module.exports.UBUNTU_CLAIMED_ID = UBUNTU_CLAIMED_ID;
