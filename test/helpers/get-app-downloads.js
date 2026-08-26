/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const channelConfig = require('../../config/mail-app-channels');
const getAppDownloads = require('#helpers/get-app-downloads');

// The /download page renders from this helper, and the feedback that led to
// the checked-in fallback was every button and the checksum link degrading to
// the /releases listing whenever GitHub was unreachable at render time. These
// pin the invariant: no matter what the fetch returned, every offered
// download is a direct file URL.

test('falls back to the checked-in snapshot when the release is null', (t) => {
  const downloads = getAppDownloads(null);

  t.true(downloads.isLive);
  t.truthy(downloads.version);
  t.true(downloads.options.length > 0);

  for (const option of downloads.options) {
    t.true(option.isDirect);
    t.regex(option.url, /\/releases\/download\//);
    t.truthy(option.fileName);
  }

  // The verification section's checksum link must point at the file itself,
  // not at the release listing.
  t.regex(downloads.checksumsUrl, /SHA256SUMS\.txt$/);
});

test('falls back when the release exists but has no assets yet', (t) => {
  const downloads = getAppDownloads({
    tagName: 'v9.9.9',
    htmlUrl: 'https://example.com',
    assets: []
  });

  t.true(downloads.isLive);
  t.not(downloads.version, 'v9.9.9');
  t.true(downloads.options.every((option) => option.isDirect));
});

test('offers a recommended default for every platform', (t) => {
  const downloads = getAppDownloads(null);

  for (const group of downloads.groups) {
    for (const platform of group.platforms) {
      t.truthy(platform.recommended, `${platform.key} has no recommended`);
      t.true(platform.recommended.isDirect);
    }
  }
});

// The distribution channels and verification facts come from
// config/mail-app-channels.js so that bringing a store online is a config
// edit. These pin the contract the page renders against.

test('every configured channel names a rendered platform and a known state', (t) => {
  const downloads = getAppDownloads(null);
  const platforms = new Set(
    downloads.groups.flatMap((group) =>
      group.platforms.map((platform) => platform.key)
    )
  );
  const keys = new Set();

  for (const channel of channelConfig.channels) {
    t.true(
      platforms.has(channel.platform),
      `${channel.key}: ${channel.platform}`
    );
    t.true(
      ['live', 'soon', 'na'].includes(channel.state),
      `${channel.key} state`
    );
    t.false(keys.has(channel.key), `duplicate channel key ${channel.key}`);
    keys.add(channel.key);
    // A live package manager must have something to paste or somewhere to go.
    if (channel.state === 'live') t.truthy(channel.command || channel.url);
  }
});

test('attaches each platform its channels and hides the na ones', (t) => {
  const downloads = getAppDownloads(null);

  for (const group of downloads.groups) {
    for (const platform of group.platforms) {
      const expected = channelConfig.channels.filter(
        (channel) => channel.platform === platform.key && channel.state !== 'na'
      );
      t.deepEqual(
        platform.channels.map((channel) => channel.key),
        expected.map((channel) => channel.key)
      );
      t.true(platform.channels.every((channel) => channel.state !== 'na'));
      t.is(platform.signed, channelConfig.signing[platform.key] !== false);
    }
  }
});

test('exposes the updater key, provenance and F-Droid facts to the page', (t) => {
  const downloads = getAppDownloads(null);

  // A minisign public key is 56 base64 characters and its id is 16 hex.
  t.regex(downloads.verify.minisign.publicKey, /^[A-Za-z\d+/]{56}$/);
  t.regex(downloads.verify.minisign.keyId, /^[\dA-F]{16}$/);
  t.regex(downloads.verify.provenance.url, /^https:\/\/github\.com\//);
  t.truthy(downloads.verify.provenance.owner);

  const fdroid = channelConfig.channels.find(
    (channel) => channel.key === 'fdroid-repo'
  );
  if (fdroid && fdroid.state !== 'na') {
    t.is(downloads.verify.fdroid.key, 'fdroid-repo');
    t.truthy(downloads.verify.fdroid.url);
    // A live repository has to publish the fingerprint a client pins.
    if (fdroid.state === 'live') t.truthy(downloads.verify.fdroid.fingerprint);
  } else {
    t.is(downloads.verify.fdroid, null);
  }
});
