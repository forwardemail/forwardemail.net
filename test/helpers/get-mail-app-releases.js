/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
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

// The API server's release poller writes the cached release every 15 minutes.
// While any API process ran code from before `previous` existed, it kept
// writing releases without it under the shared key, so /download never had
// an earlier build to fall back to.
test.serial(
  'a release cached by older code is not served without its earlier releases',
  async (t) => {
    const client = new Redis({ keyPrefix: randomUUID() });
    t.teardown(() => client.disconnect());
    // what the older code caches: a release with no `previous`
    await client.set(
      'mail_app:github_releases',
      JSON.stringify({ tagName: 'v9.9.9', assets: [] })
    );

    stubGitHub(t, { latest: () => json(latest), list: () => json(list) });
    const release = await getLatestMailAppRelease({ client });

    t.is(release.tagName, 'v9.9.9');
    t.deepEqual(
      release.previous.map((previous) => previous.tagName),
      ['v9.9.8', 'v9.9.6', 'v9.9.5']
    );
    // and the older code's entry is left to the older code
    t.is(
      JSON.parse(await client.get('mail_app:github_releases')).previous,
      undefined
    );
  }
);

test.serial(
  'the earlier releases are looked up once per latest release, and again after a failure',
  async (t) => {
    const client = new Redis({ keyPrefix: randomUUID() });
    t.teardown(() => client.disconnect());

    // the lookup fails, then lists nothing older: the latest release still
    // comes back each time, and nothing is cached for the earlier releases
    let listing = () => json({ message: 'rate limited' }, 403);
    const stub = stubGitHub(t, {
      latest: () => json(latest),
      list: () => listing()
    });
    let release = await getLatestMailAppRelease({ client, forceRefresh: true });
    t.is(release.tagName, 'v9.9.9');
    t.deepEqual(release.previous, []);

    listing = () => json([latest]);
    release = await getLatestMailAppRelease({ client, forceRefresh: true });
    t.deepEqual(release.previous, []);

    // the next poll tries again, and this time it works
    listing = () => json(list);
    release = await getLatestMailAppRelease({ client, forceRefresh: true });
    t.deepEqual(
      release.previous.map((previous) => previous.tagName),
      ['v9.9.8', 'v9.9.6', 'v9.9.5']
    );

    // later polls only fetch the latest release
    const before = stub.callCount;
    release = await getLatestMailAppRelease({ client, forceRefresh: true });
    t.is(stub.callCount, before + 1);
    t.is(release.previous.length, 3);

    // and a new latest release gets its own lookup
    const next = githubRelease(12, '9.9.10', DESKTOP);
    stub.callsFake(async (url) =>
      url.endsWith('/releases/latest') ? json(next) : json([next, ...list])
    );
    release = await getLatestMailAppRelease({ client, forceRefresh: true });
    t.is(release.tagName, 'v9.9.10');
    t.is(release.previous[0].tagName, 'v9.9.9');
  }
);
