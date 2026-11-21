/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const channelConfig = require('../../config/mail-app-channels');
const fallbackRelease = require('../../config/mail-app-release-fallback.json');
const getAppDownloads = require('#helpers/get-app-downloads');

// A release that also carries the terminal client (its six gzipped
// executables and its two installers), built from the checked-in snapshot.
const TERMINAL_FILES = [
  'forwardemail-darwin-arm64.gz',
  'forwardemail-darwin-x64.gz',
  'forwardemail-linux-x64.gz',
  'forwardemail-linux-arm64.gz',
  'forwardemail-win-x64.exe.gz',
  'forwardemail-win-arm64.exe.gz',
  'install.sh',
  'install.ps1'
];
const releaseWithTerminal = {
  ...fallbackRelease,
  assets: [
    ...fallbackRelease.assets,
    ...TERMINAL_FILES.map((name) => ({
      name,
      size: 40 * 1024 * 1024,
      digest: `sha256:${'a'.repeat(64)}`,
      browserDownloadUrl: `${channelConfig.REPO_URL}/releases/download/${fallbackRelease.tagName}/${name}`
    }))
  ]
};

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
  const downloads = getAppDownloads(releaseWithTerminal);
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
  const downloads = getAppDownloads(releaseWithTerminal);

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

test('Windows builds are signed, and their cards say SmartScreen may still warn', (t) => {
  // (Authenticode through SSL.com eSigner, with a certificate still building
  // SmartScreen reputation, see config/mail-app-channels.js)
  const downloads = getAppDownloads(releaseWithTerminal);
  const platforms = downloads.groups.flatMap((group) => group.platforms);
  t.deepEqual(
    platforms
      .filter((platform) => ['windows', 'terminal'].includes(platform.key))
      .map((platform) => [platform.key, platform.signed, platform.smartScreen]),
    [
      ['windows', true, true],
      ['terminal', true, true]
    ]
  );
  // the other platforms are signed and trusted
  for (const platform of platforms.filter(
    (platform) => !['windows', 'terminal'].includes(platform.key)
  ))
    t.false(platform.smartScreen, `${platform.key}`);
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

test('renders the terminal client once a release carries its executables', (t) => {
  // The snapshot predates the terminal client: no card for it, rather than
  // install commands for files that release does not have.
  t.false(
    getAppDownloads(null).groups.some((group) => group.key === 'terminal')
  );

  const downloads = getAppDownloads(releaseWithTerminal);
  const group = downloads.groups.find((group) => group.key === 'terminal');
  t.truthy(group);
  const [platform] = group.platforms;
  t.is(platform.key, 'terminal');
  t.deepEqual(
    platform.options.map((option) => option.arch),
    [
      'macosAppleSilicon',
      'macosIntel',
      'linuxX64',
      'linuxArm64',
      'windowsX64',
      'windowsArm64'
    ]
  );
  for (const option of platform.options) {
    t.is(option.format, 'cli');
    t.true(option.isDirect);
    t.regex(option.fileName, /^forwardemail-.+\.gz$/);
    t.is(option.sha256, 'a'.repeat(64));
  }

  // The installers are offered as commands, not as files to download.
  t.false(
    downloads.options.some((option) => /^install\./.test(option.fileName))
  );
  t.deepEqual(
    platform.channels.map((channel) => channel.command),
    [
      `curl -fsSL ${channelConfig.REPO_URL}/releases/latest/download/install.sh | sh`,
      `irm ${channelConfig.REPO_URL}/releases/latest/download/install.ps1 | iex`,
      'npm install -g forwardemail'
    ]
  );

  // The desktop and mobile platforms are unchanged by it.
  t.deepEqual(
    downloads.groups.map((group) => group.key),
    ['desktop', 'mobile', 'terminal']
  );
});

// A release is published once its desktop builds pass, so a failed mobile or
// terminal build leaves the latest release without those files. The page
// used to drop those downloads until the next good release.

// the snapshot's assets, renamed and re-addressed as another version's
function releaseAt(tagName, keep = () => true) {
  const from = fallbackRelease.tagName.replace(/^v/, '');
  const to = tagName.replace(/^v/, '');
  return {
    tagName,
    htmlUrl: `${channelConfig.REPO_URL}/releases/tag/${tagName}`,
    publishedAt: '2030-01-01T00:00:00Z',
    assets: fallbackRelease.assets
      .filter((asset) => keep(asset))
      .map((asset) => ({
        ...asset,
        name: asset.name.replace(from, to),
        browserDownloadUrl: asset.browserDownloadUrl
          .replace(`/${fallbackRelease.tagName}/`, `/${tagName}/`)
          .replace(from, to)
      }))
  };
}

const isMobileBuild = (asset) => /\.(apk|aab|ipa)$/i.test(asset.name);

test('offers the previous release for files the latest release shipped without', (t) => {
  const downloads = getAppDownloads({
    ...releaseAt('v9.9.9', (asset) => !isMobileBuild(asset)),
    previous: [releaseAt('v9.9.8'), releaseAt('v9.9.7')]
  });

  // the page is still the latest release
  t.is(downloads.version, 'v9.9.9');
  t.regex(downloads.checksumsUrl, /\/v9\.9\.9\/SHA256SUMS\.txt$/);

  // every download the snapshot offers is still offered
  t.deepEqual(
    downloads.options.map((o) => [o.platform, o.format, o.arch]),
    getAppDownloads(null).options.map((o) => [o.platform, o.format, o.arch])
  );

  for (const option of downloads.options) {
    t.true(option.isDirect);
    if (option.group === 'mobile') {
      // from the newest earlier release, and marked as such
      t.true(option.isPrevious);
      t.is(option.version, 'v9.9.8');
      t.regex(option.url, /\/releases\/download\/v9\.9\.8\//);
      t.regex(option.fileName, /9\.9\.8/);
    } else {
      t.false(option.isPrevious);
      t.is(option.version, 'v9.9.9');
      t.regex(option.url, /\/releases\/download\/v9\.9\.9\//);
    }
  }

  const mobile = downloads.groups.find((group) => group.key === 'mobile');
  t.deepEqual(
    mobile.platforms.map((platform) => platform.key),
    ['android', 'ios']
  );
  t.is(mobile.platforms[0].recommended.version, 'v9.9.8');
});

test('skips an earlier release that lacks the file too', (t) => {
  const downloads = getAppDownloads({
    ...releaseAt('v9.9.9', (asset) => !isMobileBuild(asset)),
    previous: [
      releaseAt('v9.9.8', (asset) => !isMobileBuild(asset)),
      releaseAt('v9.9.7')
    ]
  });

  const apk = downloads.options.find((option) => option.format === 'apk');
  t.is(apk.version, 'v9.9.7');
  t.true(apk.isPrevious);
});

test('presents the previous release when the latest has no files at all', (t) => {
  const downloads = getAppDownloads({
    tagName: 'v9.9.9',
    htmlUrl: 'https://example.com',
    assets: [],
    previous: [releaseAt('v9.9.8')]
  });

  t.is(downloads.version, 'v9.9.8');
  t.regex(downloads.releaseUrl, /\/releases\/tag\/v9\.9\.8$/);
  t.true(downloads.options.length > 0);
  for (const option of downloads.options) {
    t.is(option.version, 'v9.9.8');
    // it is the release the page presents, so nothing is marked as older
    t.false(option.isPrevious);
  }
});

test('drops a file no release carries, and tolerates a release without `previous`', (t) => {
  for (const previous of [undefined, null, []]) {
    const downloads = getAppDownloads({
      ...releaseAt('v9.9.9', (asset) => !isMobileBuild(asset)),
      previous
    });
    t.is(downloads.version, 'v9.9.9');
    t.false(downloads.options.some((option) => option.group === 'mobile'));
    t.true(downloads.options.every((option) => !option.isPrevious));
  }
});

// The App Store and Google Play buttons sit on the Android and iOS cards. A
// card used to render only when a release carried a file for it, so a failed
// mobile build hid the store buttons too.
test('keeps the Android and iOS cards and their store buttons when no release has a mobile file', (t) => {
  const downloads = getAppDownloads(
    releaseAt('v9.9.9', (asset) => !isMobileBuild(asset))
  );
  const mobile = downloads.groups.find((group) => group.key === 'mobile');
  t.truthy(mobile);
  t.deepEqual(
    mobile.platforms.map((platform) => platform.key),
    ['android', 'ios']
  );
  for (const platform of mobile.platforms) {
    t.deepEqual(platform.options, []);
    t.is(platform.recommended, null);
    t.true(
      platform.channels.some(
        (channel) =>
          channel.state === 'live' &&
          ['app-store', 'google-play'].includes(channel.key)
      )
    );
  }

  // a platform with no files and no store still does not render
  const desktop = downloads.groups.find((group) => group.key === 'desktop');
  const noDesktop = getAppDownloads(
    releaseAt('v9.9.9', (asset) => isMobileBuild(asset))
  );
  t.truthy(desktop);
  t.false(noDesktop.groups.some((group) => group.key === 'desktop'));
});
