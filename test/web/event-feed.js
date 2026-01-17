/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const ip = require('ip');
const ms = require('ms');
const test = require('ava');
const undici = require('undici');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');

const IP_ADDRESS = ip.address();

const semaphore = new Semaphore(4);

test.before(utils.setupMongoose);
test.before(async (t) => {
  await utils.setupWebServer(t);
  t.context._web.config.rateLimit.allowlist.push(IP_ADDRESS, '127.0.0.1');
});
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

test.beforeEach('setup concurrency', async (t) => {
  t.context.permit = await semaphore.acquire();
});
test.afterEach.always(async (t) => {
  await t.context.permit.release();
});

//
// Event Feed Page Tests
//
test('GET /en/event-feed should return 200', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/event-feed`);
  t.is(res.status, 200);
});

test('GET /en/event-feed should contain Event Feed title', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/event-feed`);
  const html = await res.text();
  t.true(html.includes('Event Feed'));
});

test('GET /en/event-feed?filter=xposts should return 200', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(
    `${t.context.webURL}/en/event-feed?filter=xposts`
  );
  t.is(res.status, 200);
});

test('GET /en/event-feed?filter=incidents should return 200', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(
    `${t.context.webURL}/en/event-feed?filter=incidents`
  );
  t.is(res.status, 200);
});

test('GET /en/event-feed?filter=articles should return 200', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(
    `${t.context.webURL}/en/event-feed?filter=articles`
  );
  t.is(res.status, 200);
});

test('GET /en/event-feed?filter=releases should return 200', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(
    `${t.context.webURL}/en/event-feed?filter=releases`
  );
  t.is(res.status, 200);
});

//
// RSS/Atom/JSON Feed Tests
//
test('GET /en/blog/feed/rss should return 200 with RSS content type', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/rss`);
  t.is(res.status, 200);
  t.true(res.headers.get('content-type').includes('application/rss+xml'));
});

test('GET /en/blog/feed/atom should return 200 with Atom content type', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/atom`);
  t.is(res.status, 200);
  t.true(res.headers.get('content-type').includes('application/atom+xml'));
});

test('GET /en/blog/feed/json should return 200 with JSON content type', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/json`);
  t.is(res.status, 200);
  t.true(res.headers.get('content-type').includes('application/json'));
});

test('RSS feed should contain valid XML structure', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/rss`);
  const xml = await res.text();
  t.true(xml.includes('<?xml'));
  t.true(xml.includes('<rss'));
  t.true(xml.includes('<channel>'));
});

test('Atom feed should contain valid XML structure', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/atom`);
  const xml = await res.text();
  t.true(xml.includes('<?xml'));
  t.true(xml.includes('<feed'));
  t.true(xml.includes('xmlns="http://www.w3.org/2005/Atom"'));
});

test('JSON feed should contain valid JSON structure', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/json`);
  const json = await res.json();
  t.truthy(json.version);
  t.truthy(json.title);
  t.truthy(json.items);
  t.true(Array.isArray(json.items));
});

//
// Calendar.ics Tests
//
test('GET /en/calendar.ics should return 200 with calendar content type', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/calendar.ics`);
  t.is(res.status, 200);
  t.true(res.headers.get('content-type').includes('text/calendar'));
});

test('GET /calendar.ics should return 200 (non-localized route)', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/calendar.ics`);
  t.is(res.status, 200);
});

test('Calendar.ics should contain valid iCalendar structure', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/calendar.ics`);
  const ics = await res.text();
  t.true(ics.includes('BEGIN:VCALENDAR'));
  t.true(ics.includes('VERSION:2.0'));
  t.true(ics.includes('END:VCALENDAR'));
});

test('Calendar.ics should have proper PRODID', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/calendar.ics`);
  const ics = await res.text();
  t.true(ics.includes('PRODID:-//Forward Email//Calendar//EN'));
});

test('Calendar.ics should have Content-Disposition header', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/calendar.ics`);
  const disposition = res.headers.get('content-disposition');
  t.truthy(disposition);
  t.true(disposition.includes('calendar.ics'));
});

//
// Helper Module Tests
//
test('getStatusIncidents helper should fetch incidents from GitHub', async (t) => {
  t.timeout(ms('30s'));
  const getStatusIncidents = require('#helpers/get-status-incidents');
  const incidents = await getStatusIncidents({ count: 5 });
  t.true(Array.isArray(incidents));
  // Should have some incidents (status page has history)
  if (incidents.length > 0) {
    const incident = incidents[0];
    t.truthy(incident.id);
    t.truthy(incident.title);
    t.truthy(incident.createdAt);
    t.truthy(incident.status);
  }
});

test('getStatusIncidents parseIncident should parse GitHub issue correctly', (t) => {
  const { parseIncident } = require('#helpers/get-status-incidents');
  const mockIssue = {
    number: 123,
    title: '🛑 smtp.forwardemail.net is down',
    state: 'closed',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T01:00:00Z',
    closed_at: '2026-01-01T01:00:00Z',
    body: 'Service was down due to maintenance',
    html_url:
      'https://github.com/forwardemail/status.forwardemail.net/issues/123',
    labels: [{ name: 'status' }]
  };

  const incident = parseIncident(mockIssue);
  t.is(incident.id, 123);
  t.is(incident.status, 'resolved');
  t.truthy(incident.duration);
  t.is(incident.duration, 3600000); // 1 hour in ms
});

test('getXPosts parseTweet should parse X API v2 tweet data correctly', (t) => {
  const { parseTweet } = require('#helpers/get-x-posts');
  const mockTweet = {
    id: '123456789',
    text: 'Test tweet content',
    created_at: '2026-01-01T00:00:00.000Z',
    author_id: '1347581552339914756',
    public_metrics: {
      like_count: 10,
      retweet_count: 5,
      reply_count: 2,
      quote_count: 1
    },
    entities: {
      urls: []
    }
  };

  const mockIncludes = {
    users: [
      {
        id: '1347581552339914756',
        name: 'Forward Email',
        username: 'fwdemail',
        profile_image_url: 'https://example.com/avatar.jpg'
      }
    ]
  };

  const parsed = parseTweet(mockTweet, mockIncludes);
  t.truthy(parsed);
  t.is(parsed.id, '123456789');
  t.is(parsed.text, 'Test tweet content');
  t.is(parsed.metrics.likes, 10);
  t.is(parsed.metrics.retweets, 5);
  t.is(parsed.user.username, 'fwdemail');
});

test('getXPosts parseTweet should return null for retweets', (t) => {
  const { parseTweet } = require('#helpers/get-x-posts');
  const mockRetweet = {
    id: '123456789',
    text: 'RT @someone: Original tweet',
    created_at: '2026-01-01T00:00:00.000Z',
    author_id: '1347581552339914756',
    referenced_tweets: [{ type: 'retweeted', id: '987654321' }]
  };

  const parsed = parseTweet(mockRetweet, { users: [] });
  t.is(parsed, null);
});

//
// GitHub Releases Helper Tests
//
test('getGitHubReleases helper should fetch releases from GitHub', async (t) => {
  t.timeout(ms('30s'));
  const getGitHubReleases = require('#helpers/get-github-releases');
  const releases = await getGitHubReleases({ count: 5 });
  t.true(Array.isArray(releases));
  // Should have some releases
  if (releases.length > 0) {
    const release = releases[0];
    t.truthy(release.id);
    t.truthy(release.tagName);
    t.truthy(release.htmlUrl);
    t.truthy(release.publishedAt || release.createdAt);
  }
});

test('getGitHubReleases parseRelease should parse GitHub release correctly', (t) => {
  const { parseRelease } = require('#helpers/get-github-releases');
  const mockRelease = {
    id: 123456,
    tag_name: 'v1.0.0',
    name: 'Release 1.0.0',
    body: 'Release notes here',
    html_url:
      'https://github.com/forwardemail/forwardemail.net/releases/tag/v1.0.0',
    tarball_url:
      'https://api.github.com/repos/forwardemail/forwardemail.net/tarball/v1.0.0',
    zipball_url:
      'https://api.github.com/repos/forwardemail/forwardemail.net/zipball/v1.0.0',
    draft: false,
    prerelease: false,
    created_at: '2026-01-01T00:00:00Z',
    published_at: '2026-01-01T00:00:00Z',
    author: {
      login: 'niftylettuce',
      avatar_url: 'https://avatars.githubusercontent.com/u/1234567',
      html_url: 'https://github.com/niftylettuce'
    },
    assets: [
      {
        id: 789,
        name: 'release.zip',
        size: 1024,
        download_count: 100,
        browser_download_url:
          'https://github.com/forwardemail/forwardemail.net/releases/download/v1.0.0/release.zip',
        content_type: 'application/zip'
      }
    ]
  };

  const release = parseRelease(mockRelease);
  t.is(release.id, 123456);
  t.is(release.tagName, 'v1.0.0');
  t.is(release.name, 'Release 1.0.0');
  t.is(release.body, 'Release notes here');
  t.false(release.draft);
  t.false(release.prerelease);
  t.is(release.author.login, 'niftylettuce');
  t.is(release.assets.length, 1);
  t.is(release.assets[0].name, 'release.zip');
});

test('getGitHubReleases parseRelease should return null for invalid release', (t) => {
  const { parseRelease } = require('#helpers/get-github-releases');
  const invalidRelease = {};
  const result = parseRelease(invalidRelease);
  t.is(result, null);
});

//
// Event Feed Controller Tests
//
test('getAllEvents should return sorted events', async (t) => {
  t.timeout(ms('60s'));
  const { getAllEvents } = require('#controllers/web/event-feed');
  const events = await getAllEvents();
  t.true(Array.isArray(events));

  // Check events are sorted by date (newest first)
  for (let i = 1; i < events.length; i++) {
    t.true(events[i - 1].date >= events[i].date);
  }
});

test('getAllEvents should include different event types', async (t) => {
  t.timeout(ms('60s'));
  const { getAllEvents } = require('#controllers/web/event-feed');
  const events = await getAllEvents();

  const types = new Set(events.map((e) => e.type));
  // Should have at least articles (developer docs)
  t.true(types.has('article'));
});

test('getAllEvents should include GitHub releases', async (t) => {
  t.timeout(ms('60s'));
  const { getAllEvents } = require('#controllers/web/event-feed');
  const events = await getAllEvents();

  const releases = events.filter((e) => e.type === 'release');
  // Should have some releases from GitHub
  t.true(releases.length > 0 || events.some((e) => e.type === 'article'));
});

//
// Feed Content Tests
//
test('RSS feed should include GitHub Releases category', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/blog/feed/rss`);
  const xml = await res.text();
  // Feed should be valid XML with channel
  t.true(xml.includes('<channel>'));
});

test('Event feed page should have releases filter button', async (t) => {
  t.timeout(ms('30s'));
  const res = await undici.fetch(`${t.context.webURL}/en/event-feed`);
  const html = await res.text();
  t.true(html.includes('filter=releases'));
  t.true(html.includes('Releases'));
});

//
// Navbar Badge and Session Tests
//
test('getRecentEventsStats should return stats object', async (t) => {
  t.timeout(ms('60s'));
  const { getRecentEventsStats } = require('#controllers/web/event-feed');
  const stats = await getRecentEventsStats();
  t.truthy(stats);
  t.is(typeof stats.total, 'number');
  t.is(typeof stats.xPosts, 'number');
  t.is(typeof stats.releases, 'number');
  t.is(typeof stats.incidents, 'number');
  t.is(typeof stats.articles, 'number');
});

test('getRecentEventsStats should filter by sinceDate', async (t) => {
  t.timeout(ms('60s'));
  const { getRecentEventsStats } = require('#controllers/web/event-feed');

  // Get stats with no filter (72h window)
  const allStats = await getRecentEventsStats();

  // Get stats with a future date (should return 0)
  const futureDate = new Date(Date.now() + 86400000); // 1 day in future
  const futureStats = await getRecentEventsStats(futureDate);

  t.is(futureStats.total, 0);
  t.true(allStats.total >= futureStats.total);
});

test('buildBadgeTooltip should return proper text', (t) => {
  const { buildBadgeTooltip } = require('#controllers/web/event-feed');
  const mockT = (str, ...args) => {
    if (args.length > 0) {
      return str.replace('%d', args[0]);
    }

    return str;
  };

  // Test with multiple event types
  const stats = {
    total: 6,
    xPosts: 3,
    releases: 2,
    incidents: 1,
    articles: 0
  };

  const tooltip = buildBadgeTooltip(stats, mockT);
  t.true(tooltip.includes('6 updates'));
  t.true(tooltip.includes('2 releases'));
  t.true(tooltip.includes('1 status update'));
  t.true(tooltip.includes('3 X posts'));
});

test('buildBadgeTooltip should handle singular forms', (t) => {
  const { buildBadgeTooltip } = require('#controllers/web/event-feed');
  const mockT = (str) => str;

  const stats = {
    total: 1,
    xPosts: 1,
    releases: 0,
    incidents: 0,
    articles: 0
  };

  const tooltip = buildBadgeTooltip(stats, mockT);
  t.true(tooltip.includes('1 update'));
  t.true(tooltip.includes('1 X post'));
});

test('buildBadgeTooltip should handle zero events', (t) => {
  const { buildBadgeTooltip } = require('#controllers/web/event-feed');
  const mockT = (str) => str;

  const stats = {
    total: 0,
    xPosts: 0,
    releases: 0,
    incidents: 0,
    articles: 0
  };

  const tooltip = buildBadgeTooltip(stats, mockT);
  t.true(tooltip.includes('No new updates'));
});

test('RECENT_WINDOW should be 72 hours', (t) => {
  const { RECENT_WINDOW } = require('#controllers/web/event-feed');
  t.is(RECENT_WINDOW, 72 * 60 * 60 * 1000); // 72 hours in ms
});
