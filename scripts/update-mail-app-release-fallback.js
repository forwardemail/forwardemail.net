/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Refreshes config/mail-app-release-fallback.json, the checked-in snapshot
// the /download page falls back to when GitHub and the Redis cache are both
// unavailable at render time (see helpers/get-app-downloads.js).
//
// Run it whenever a release ships that the snapshot should catch up to:
//
//   node scripts/update-mail-app-release-fallback.js
//
// The snapshot intentionally zeroes `body`, `downloadCount`, and `author`:
// none of them render on /download, and leaving them out keeps the diff to
// the fields the page actually uses.

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const undici = require('undici');

const OUT_PATH = path.join(
  __dirname,
  '..',
  'config',
  'mail-app-release-fallback.json'
);

async function main() {
  const res = await undici.fetch(
    'https://api.github.com/repos/forwardemail/mail.forwardemail.net/releases/latest',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ForwardEmail/1.0',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }
  );

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const release = await res.json();

  if (release.draft) throw new Error('Latest release is a draft; aborting');

  // Same shape as parseRelease in helpers/get-mail-app-releases.js
  const parsed = {
    id: release.id,
    tagName: release.tag_name,
    name: release.name || release.tag_name,
    body: '',
    htmlUrl: release.html_url,
    tarballUrl: release.tarball_url,
    zipballUrl: release.zipball_url,
    draft: release.draft,
    prerelease: release.prerelease,
    createdAt: release.created_at,
    publishedAt: release.published_at,
    author: null,
    assets: (release.assets || []).map((asset) => ({
      id: asset.id,
      name: asset.name,
      size: asset.size,
      downloadCount: 0,
      browserDownloadUrl: asset.browser_download_url,
      contentType: asset.content_type,
      digest: asset.digest || null
    }))
  };

  if (parsed.assets.length === 0)
    throw new Error(`Release ${parsed.tagName} has no assets yet; aborting`);

  fs.writeFileSync(OUT_PATH, JSON.stringify(parsed, null, 2) + '\n');
  console.log(
    `Wrote ${parsed.tagName} (${parsed.assets.length} assets) to ${OUT_PATH}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
