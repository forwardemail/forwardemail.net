const test = require('ava');

const utils = require('../utils');

test.beforeEach(utils.setupWebServer);

test('redirects to correct locale', async (t) => {
  const { web } = t.context;
  const res = await web.get('/');
  t.is(res.status, 302);
  t.is(res.headers.location, '/en');
});

test('returns English homepage', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('returns Spanish homepage', async (t) => {
  const { web } = t.context;
  const res = await web.get('/es').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('returns English ToS', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/terms').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('returns Spanish ToS', async (t) => {
  const { web } = t.context;
  const res = await web.get('/es/terms').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('GET /:locale/about', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/about');

  t.is(res.status, 200);
  t.assert(res.text.includes('About'));
});

test('GET /:locale/404', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/404');

  t.is(res.status, 404);
  t.assert(res.text.includes('Not Found'));
});

test('GET /:locale/privacy', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/privacy');

  t.is(res.status, 200);
  t.assert(res.text.includes('Privacy Policy'));
});

test('GET /:locale/help', async (t) => {
  const { web } = t.context;
  const res = await web.get('/en/help');

  t.is(res.status, 200);
  t.assert(res.text.includes('Send message'));
});
