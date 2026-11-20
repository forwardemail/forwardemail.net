/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const sinon = require('sinon');
const test = require('ava');
const undici = require('undici');

const getAppDownloads = require('#helpers/get-app-downloads');
const { getLatestMailAppRelease } = require('#helpers/get-mail-app-releases');

const REPO = 'https://github.com/forwardemail/mail.forwardemail.net';

// A release as the GitHub API returns it
function githubRelease(id, version, names, extra = {}) {
  return {
    id,
    tag_name: `v${version}`,
    name: `v${version}`,
    body: '',
    html_url: `${REPO}/releases/tag/v${version}`,
    draft: false,
    prerelease: false,
    created_at: `2030-01-${String(id).padStart(2, '0')}T00:00:00Z`,
    published_at: `2030-01-${String(id).padStart(2, '0')}T00:00:00Z`,
    assets: names.map((name, i) => ({
      id: id * 100 + i,
      name: name.replace('VERSION', version),
      size: 50 * 1024 * 1024,
      browser_download_url: `${REPO}/releases/download/v${version}/${name.replace(
        'VERSION',
        version
      )}`,
      digest: `sha256:${'a'.repeat(64)}`
    })),
    ...extra
  };
}

const DESKTOP = ['Forward.Email_VERSION_aarch64.dmg', 'SHA256SUMS.txt'];
const MOBILE = ['forwardemail-mail_VERSION_android.apk'];

// 9.9.9 is the latest release, published without its Android build
const latest = githubRelease(9, '9.9.9', DESKTOP);
const list = [
  // a draft and a prerelease are never offered
  githubRelease(11, '10.0.0', [...DESKTOP, ...MOBILE], { draft: true }),
  githubRelease(10, '10.0.0-beta.1', [...DESKTOP, ...MOBILE], {
    prerelease: true
  }),
  latest,
  // out of order, to prove the helper sorts
  githubRelease(6, '9.9.6', [...DESKTOP, ...MOBILE]),
  githubRelease(8, '9.9.8', [...DESKTOP, ...MOBILE]),
  // a release that never got any files
  githubRelease(7, '9.9.7', []),
  githubRelease(5, '9.9.5', [...DESKTOP, ...MOBILE]),
  githubRelease(4, '9.9.4', [...DESKTOP, ...MOBILE]),
  githubRelease(3, '9.9.3', [...DESKTOP, ...MOBILE])
];

const json = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: String(status),
  json: async () => body,
  text: async () => JSON.stringify(body)
});

function stubGitHub(t, respond) {
  const stub = sinon.stub(undici, 'fetch').callsFake(async (url) => {
    if (url.endsWith('/releases/latest')) return respond.latest();
    if (url.includes('/releases?')) return respond.list();
    throw new Error(`unexpected request ${url}`);
  });
  t.teardown(() => stub.restore());
  return stub;
}

test.serial(
  'the latest release carries the releases before it, newest first',
  async (t) => {
    const stub = stubGitHub(t, {
      latest: () => json(latest),
      list: () => json(list)
    });

    // no redis client: fetched straight from GitHub
    const release = await getLatestMailAppRelease();

    t.is(stub.callCount, 2);
    t.is(release.tagName, 'v9.9.9');
    t.deepEqual(
      release.previous.map((previous) => previous.tagName),
      ['v9.9.8', 'v9.9.6', 'v9.9.5']
    );

    // and the download page fills the missing Android build from it
    const downloads = getAppDownloads(release);
    const apk = downloads.options.find((option) => option.format === 'apk');
    t.is(downloads.version, 'v9.9.9');
    t.is(apk.version, 'v9.9.8');
    t.true(apk.isPrevious);
    t.is(
      apk.url,
      `${REPO}/releases/download/v9.9.8/forwardemail-mail_9.9.8_android.apk`
    );
    const dmg = downloads.options.find((option) => option.format === 'dmg');
    t.is(dmg.version, 'v9.9.9');
    t.false(dmg.isPrevious);
  }
);

test.serial(
  'a failed lookup of earlier releases still returns the latest release',
  async (t) => {
    for (const failing of [
      () => json({ message: 'Server Error' }, 500),
      () => json({ message: 'Not Found' }, 404),
      () => json({ message: 'not a list' }),
      () => {
        throw new Error('socket hang up');
      }
    ]) {
      const stub = stubGitHub(t, { latest: () => json(latest), list: failing });
      const release = await getLatestMailAppRelease();
      stub.restore();

      t.is(release.tagName, 'v9.9.9');
      t.deepEqual(release.previous, []);
      // the page renders what the latest release does have
      const downloads = getAppDownloads(release);
      t.is(downloads.version, 'v9.9.9');
      t.truthy(downloads.options.find((option) => option.format === 'dmg'));
    }
  }
);

test.serial('no latest release means no release at all', async (t) => {
  const stub = stubGitHub(t, {
    latest: () => json({ message: 'Not Found' }, 404),
    list: () => json(list)
  });

  t.is(await getLatestMailAppRelease(), null);
  // the earlier releases are only looked up for a latest release
  t.is(stub.callCount, 1);
});
