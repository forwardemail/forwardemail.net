/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

async function getPage(t, path) {
  const res = await t.context.web.get(path).set({ Accept: 'text/html' });
  t.is(res.status, 200);
  const { window } = new JSDOM(res.text);
  t.teardown(() => window.close());
  return window;
}

const terminalEmailLink = (window) =>
  window.document.querySelector('a[href="https://terminalemail.com"]');

// the link and its sentence, ahead of the alert about our apps and the
// client screenshots that open the list
function assertLeadsWithTerminalEmail(t, window, sentence) {
  const link = terminalEmailLink(window);
  t.truthy(link);
  t.is(link.textContent, 'Terminal Email');
  // a followed link, opened in a new tab like the page's other outbound links
  t.is(link.getAttribute('rel'), 'noopener noreferrer');
  t.is(link.getAttribute('target'), '_blank');
  t.is(link.closest('p').textContent.trim(), sentence);

  // (querySelectorAll lists them in document order)
  const [first, second, third] = window.document.querySelectorAll(
    'a[href="https://terminalemail.com"], .alert-primary, #email-client-screenshots'
  );
  t.is(first, link);
  t.true(second.classList.contains('alert-primary'));
  t.is(third.id, 'email-client-screenshots');
}

const english =
  'Also see our project Terminal Email, a comparison of terminal email clients for Linux, macOS, Windows, BSD, and Android.';

test('the terminal email clients page leads with Terminal Email', async (t) => {
  const window = await getPage(
    t,
    '/en/blog/open-source/terminal-email-clients'
  );
  assertLeadsWithTerminalEmail(t, window, english);
});

test('the command-line email clients page leads with Terminal Email', async (t) => {
  const window = await getPage(
    t,
    '/en/blog/open-source/command-line--cli-email-clients'
  );
  assertLeadsWithTerminalEmail(t, window, english);
});

test('the Spanish page says it in Spanish, with the name left as is', async (t) => {
  const window = await getPage(
    t,
    '/es/blog/open-source/terminal-email-clients'
  );
  assertLeadsWithTerminalEmail(
    t,
    window,
    'Vea también nuestro proyecto Terminal Email, una comparación de clientes de correo electrónico para terminal en Linux, macOS, Windows, BSD y Android.'
  );
});

test('pages without terminal clients do not link to it', async (t) => {
  for (const path of [
    '/en/blog/open-source',
    '/en/blog/open-source/debian-email-clients',
    '/en/blog/open-source/terminal-email-server'
  ]) {
    const window = await getPage(t, path);
    t.is(terminalEmailLink(window), null, `a link on ${path}`);
  }
});
