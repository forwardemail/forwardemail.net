/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const logger = require('#helpers/logger');

// Repository the desktop and mobile apps are released from.
// <https://github.com/forwardemail/mail.forwardemail.net>
const REPO_URL = 'https://github.com/forwardemail/mail.forwardemail.net';
const LATEST_RELEASE_URL = `${REPO_URL}/releases/latest`;
const ALL_RELEASES_URL = `${REPO_URL}/releases`;

// Assets that are part of the release but are not something a visitor
// installs, so they never appear in a platform list:
//
//   *.sig             Tauri updater signatures, consumed by the auto updater
//   *.app.tar.gz      the macOS updater payload, not a mountable disk image
//   *.aab             an Android App Bundle, only Google Play can install one
//   latest.json       the Tauri updater manifest
//   SHA256SUMS.txt    linked on its own from the verification section
const HIDDEN_ASSET = [
  /\.sig$/i,
  /\.app\.tar\.gz$/i,
  /\.aab$/i,
  /^latest\.json$/i,
  /^sha256sums\.txt$/i
];

// The download matrix. Order within a group is the order it renders in, and
// the first entry of each group is the one offered as that platform's default.
//
// Each entry matches on the asset filename rather than on content type,
// because the release uploads several formats that share a content type.
// `arch` is the label shown to a visitor, so it uses the name the platform
// itself uses (Apple Silicon, not aarch64) while `match` keeps the build's
// own spelling.
const MATRIX = [
  // ---- desktop ----
  {
    group: 'desktop',
    platform: 'macos',
    format: 'dmg',
    arch: 'appleSilicon',
    match: /_aarch64\.dmg$/i
  },
  {
    group: 'desktop',
    platform: 'macos',
    format: 'dmg',
    arch: 'intel',
    match: /_x64\.dmg$/i
  },
  {
    group: 'desktop',
    platform: 'windows',
    format: 'exe',
    arch: 'x64',
    match: /_x64-setup\.exe$/i
  },
  {
    group: 'desktop',
    platform: 'windows',
    format: 'exe',
    arch: 'arm64',
    match: /_arm64-setup\.exe$/i
  },
  {
    group: 'desktop',
    platform: 'windows',
    format: 'msi',
    arch: 'x64',
    match: /_x64_en-us\.msi$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'appimage',
    arch: 'x64',
    match: /_amd64\.appimage$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'deb',
    arch: 'x64',
    match: /_amd64\.deb$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'deb',
    arch: 'arm64',
    match: /_arm64\.deb$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'rpm',
    arch: 'x64',
    match: /\.x86_64\.rpm$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'rpm',
    arch: 'arm64',
    match: /\.aarch64\.rpm$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'snap',
    arch: 'x64',
    match: /_amd64\.snap$/i
  },
  {
    group: 'desktop',
    platform: 'linux',
    format: 'snap',
    arch: 'arm64',
    match: /_arm64\.snap$/i
  },
  // ---- mobile ----
  // The two apk matchers are mutually exclusive, since the F-Droid build ends
  // in _fdroid.apk and never in _android.apk, so this order is purely the
  // order they render in and which one the hero offers.
  {
    group: 'mobile',
    platform: 'android',
    format: 'apk',
    arch: 'universal',
    match: /_android\.apk$/i
  },
  {
    group: 'mobile',
    platform: 'android',
    format: 'fdroid',
    arch: 'universal',
    match: /_fdroid\.apk$/i
  },
  {
    group: 'mobile',
    platform: 'ios',
    format: 'ipa',
    arch: 'universal',
    match: /_ios\.ipa$/i
  }
];

// Rendering order, and which platforms sit under which heading.
const GROUPS = [
  { key: 'desktop', platforms: ['macos', 'windows', 'linux'] },
  { key: 'mobile', platforms: ['android', 'ios'] }
];

/**
 * Format a byte count the way the GitHub releases page does.
 * GitHub divides by 1024 and labels the result MB, so matching that keeps the
 * figure on this page identical to the figure on the release it came from.
 *
 * @param {number} bytes
 * @returns {string|null}
 */
function formatSize(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }

  const mb = bytes / 1024 / 1024;
  if (mb < 1) return `${Math.round(bytes / 1024)} KB`;
  if (mb < 10) return `${mb.toFixed(2)} MB`;
  if (mb < 100) return `${mb.toFixed(1)} MB`;
  return `${Math.round(mb)} MB`;
}

/**
 * Strip GitHub's `sha256:` prefix off a digest.
 *
 * @param {string|null} digest
 * @returns {string|null}
 */
function parseDigest(digest) {
  if (typeof digest !== 'string') return null;
  const match = digest.match(/^sha256:([\da-f]{64})$/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Turn a release into the structure the download page renders.
 *
 * Called with a null release (GitHub unreachable, Redis cold, or the fetch
 * failing) it still returns the full platform structure, with every download
 * pointing at the latest release page on GitHub and no size or checksum
 * claimed. The page stays useful and nothing on it can go stale, which is why
 * there is no checked-in copy of a release here.
 *
 * @param {Object|null} release - a release from getLatestMailAppRelease
 * @returns {Object}
 */
function getAppDownloads(release) {
  const assets = release && Array.isArray(release.assets) ? release.assets : [];
  const isLive = assets.length > 0;
  const claimed = new Set();

  const options = MATRIX.map((entry) => {
    const asset = assets.find((a) => entry.match.test(a.name));
    if (asset) claimed.add(asset.name);
    return {
      group: entry.group,
      platform: entry.platform,
      format: entry.format,
      arch: entry.arch,
      // Without a live release every button still goes somewhere correct, it
      // just goes to the release page rather than straight at a file.
      url: asset ? asset.browserDownloadUrl : LATEST_RELEASE_URL,
      isDirect: Boolean(asset),
      fileName: asset ? asset.name : null,
      size: asset ? formatSize(asset.size) : null,
      sizeBytes: asset ? asset.size : null,
      sha256: asset ? parseDigest(asset.digest) : null
    };
  }).filter((option) => option.isDirect || !isLive);

  // A release that grows a format we do not know about (an arm64 AppImage,
  // say) would otherwise be dropped without a trace. Log it so the matrix can
  // be extended rather than quietly under-reporting what shipped.
  if (isLive) {
    const unmatched = assets
      .map((a) => a.name)
      .filter(
        (name) =>
          !claimed.has(name) && !HIDDEN_ASSET.some((re) => re.test(name))
      );
    if (unmatched.length > 0) {
      logger.warn(
        'Release assets are not covered by the download matrix and are not shown on /download',
        { extra: { unmatched, tagName: release && release.tagName } }
      );
    }
  }

  const groups = GROUPS.map((group) => ({
    key: group.key,
    platforms: group.platforms
      .map((platform) => {
        const platformOptions = options.filter((o) => o.platform === platform);
        return {
          key: platform,
          options: platformOptions,
          // What the hero offers when this is the detected platform.
          recommended: platformOptions[0] || null
        };
      })
      .filter((platform) => platform.options.length > 0)
  })).filter((group) => group.platforms.length > 0);

  const sums = assets.find((a) => /^sha256sums\.txt$/i.test(a.name));

  return {
    isLive,
    version: release && release.tagName ? release.tagName : null,
    publishedAt: release && release.publishedAt ? release.publishedAt : null,
    releaseUrl:
      release && release.htmlUrl ? release.htmlUrl : LATEST_RELEASE_URL,
    allReleasesUrl: ALL_RELEASES_URL,
    repoUrl: REPO_URL,
    checksumsUrl: sums ? sums.browserDownloadUrl : LATEST_RELEASE_URL,
    groups,
    // Flat list, so the client side can find a platform's default without
    // walking the group structure.
    options
  };
}

module.exports = getAppDownloads;
module.exports.getAppDownloads = getAppDownloads;
module.exports.formatSize = formatSize;
module.exports.LATEST_RELEASE_URL = LATEST_RELEASE_URL;
module.exports.ALL_RELEASES_URL = ALL_RELEASES_URL;
