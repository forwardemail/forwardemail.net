/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Where the mail app is distributed beyond the GitHub release itself, and
// whether each channel is serving yet.
//
// /download renders from this file, so bringing a store or package manager
// online is an edit here (flip `state`, fill in the url or command) rather
// than a change to the page or its templates. The states:
//
//   live   serving the current release. Rendered as an install command when
//          the channel is a package manager, otherwise as a link.
//   soon   planned, not serving yet. Rendered as a muted chip so a visitor
//          knows it is on the roadmap and does not go looking for it.
//   na     not offered: deferred, ineligible, or never planned. Not rendered
//          at all; kept here so the decision is recorded next to the
//          channels that are.
//
// Store, package-manager and product names are literals. Any copy that
// describes a channel goes through t() in app/views/_fe-download-labels.pug,
// keyed by `key`, so adding a channel here means adding its copy there too.
//
// What CI can publish today is tracked in the readiness table in
// mail.forwardemail.net/docs/release-readiness.md; keep the two in step.

const REPO_URL = 'https://github.com/forwardemail/mail.forwardemail.net';

const channels = [
  // ---- macOS ----
  {
    key: 'homebrew',
    platform: 'macos',
    name: 'Homebrew',
    // Flip to live once forwardemail/homebrew-forwardemail exists and
    // PUBLISH_HOMEBREW_TAP has merged its first cask pull request.
    state: 'soon',
    url: 'https://github.com/forwardemail/homebrew-forwardemail',
    command: 'brew install --cask forwardemail/forwardemail/forward-email'
  },
  {
    key: 'mac-app-store',
    platform: 'macos',
    name: 'Mac App Store',
    state: 'soon',
    // The apps.apple.com listing, once it exists.
    url: null
  },
  // ---- Windows ----
  {
    key: 'winget',
    platform: 'windows',
    name: 'winget',
    state: 'soon',
    url: null,
    // `winget install <PackageIdentifier>` once the manifest is merged into
    // microsoft/winget-pkgs; the identifier is assigned by that submission.
    command: null
  },
  {
    key: 'microsoft-store',
    platform: 'windows',
    name: 'Microsoft Store',
    state: 'soon',
    url: null
  },
  // ---- Linux ----
  {
    key: 'snap-store',
    platform: 'linux',
    name: 'Snap Store',
    // Flip to live once the snap name is registered and PUBLISH_SNAP_STORE
    // has pushed a build to the stable channel.
    state: 'soon',
    url: 'https://snapcraft.io/forwardemail-mail',
    command: 'sudo snap install forwardemail-mail'
  },
  {
    key: 'flathub',
    platform: 'linux',
    name: 'Flathub',
    // Deferred past v1 by decision on 2026-09-13.
    state: 'na',
    url: null
  },
  // ---- Android ----
  {
    key: 'google-play',
    platform: 'android',
    name: 'Google Play',
    state: 'soon',
    // The play.google.com listing, once it leaves the internal track.
    url: null
  },
  {
    key: 'obtainium',
    platform: 'android',
    name: 'Obtainium',
    // Tracks the Google-free release APK directly; no publishing step.
    state: 'live',
    url: 'https://github.com/ImranR98/Obtainium',
    // What a visitor pastes into Obtainium as the app source.
    command: REPO_URL
  },
  {
    key: 'fdroid-repo',
    platform: 'android',
    name: 'F-Droid repository',
    // Flip to live once the index key exists and PUBLISH_FDROID_REPOSITORY
    // has deployed the first index to Pages, then fill in the fingerprint.
    state: 'soon',
    url: 'https://forwardemail.github.io/mail.forwardemail.net/fdroid/repo',
    // SHA-256 fingerprint of the repository signing certificate, as printed
    // by `keytool -list -v`. Shown next to the URL so a client can pin it.
    fingerprint: null
  },
  {
    key: 'fdroid-catalog',
    platform: 'android',
    name: 'F-Droid',
    // The official catalog requires an OSI approved license and BUSL-1.1 is
    // not one, so the self-hosted repository above is the supported route.
    state: 'na',
    url: null
  },
  // ---- iOS ----
  {
    key: 'app-store',
    platform: 'ios',
    name: 'App Store',
    state: 'soon',
    url: null
  }
];

// Whether a platform's installers are code-signed. A platform set to false
// gets an honest note on its card (SmartScreen, for Windows) until the
// certificate lands. A platform not listed here is signed.
const signing = {
  // Windows installers ship unsigned until the Authenticode certificate is
  // provisioned and WINDOWS_SIGNING_REQUIRED is set in the release workflow.
  windows: false
};

// Verification material a visitor can check a download against, beyond the
// per-file checksums that come from the release itself.
const verify = {
  // The Tauri updater only applies an update signed by this minisign key
  // (src-tauri/tauri.conf.json, plugins.updater.pubkey, base64 decoded).
  // Publishing it lets someone confirm the key the app trusts is the key
  // we say it is.
  minisign: {
    keyId: '7BF66979D04FB41D',
    publicKey: 'RWQdtE/QeWn2e5xe8IxDaGxSQrQuCjSGQmrkN0c7errWT1zV8niot6IA'
  },
  // Every installer is attested with SLSA build provenance on Sigstore's
  // transparency log by actions/attest-build-provenance in the release
  // workflows, so `gh attestation verify <file> --owner forwardemail` checks
  // any of them.
  provenance: {
    url: `${REPO_URL}/attestations`,
    owner: 'forwardemail'
  }
};

module.exports = { channels, signing, verify, REPO_URL };
