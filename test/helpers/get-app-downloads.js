/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

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
