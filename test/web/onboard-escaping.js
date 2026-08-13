/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const test = require('ava');
const { JSDOM } = require('jsdom');
const lodash = require('lodash');

const source = fs.readFileSync(
  path.join(__dirname, '../../app/controllers/web/onboard.js'),
  'utf8'
);

function getController(rawText) {
  const dom = new JSDOM(
    '<!doctype html><html><body><code></code></body></html>'
  );
  const code = dom.window.document.querySelector('code');
  Object.defineProperty(code, 'rawText', { value: rawText });
  const root = {
    querySelectorAll() {
      return [code];
    },
    toString() {
      return dom.serialize();
    }
  };

  class Email {
    async getTemplatePath() {
      return { filePath: 'faq.pug' };
    }
  }

  class Meta {
    getByPath() {
      return {};
    }
  }

  const module = { exports: {} };
  const sandbox = {
    module,
    require(id) {
      if (id === 'node:punycode') return require('node:punycode');
      if (id === '@hapi/boom') return { badRequest() {} };
      if (id === 'email-templates') return Email;
      if (id === 'koa-meta') return Meta;
      if (id === 'email-addresses') return {};
      if (id === 'is-fqdn' || id === 'is-string-and-not-blank')
        return () => false;
      if (id === 'pug') return { renderFile: () => '<code></code>' };
      if (id === 'boolean') return { boolean: () => false };
      if (id === '@forwardemail/validator') return { isIP: () => false };
      if (id === 'mongoose/lib/error') return { ValidationError: class {} };
      if (id === 'node-html-parser') return { parse: () => root };
      if (id === '#helpers/lodash') return lodash;
      if (id === '#helpers/is-email') return () => false;
      if (id === '#config') {
        return {
          lastLocaleField: 'last_locale',
          meta: {},
          userFields: {}
        };
      }

      if (id === '#helpers/logger') return { error() {} };
      if (id === '#helpers/send-verification-email') return async () => {};
      if (id === '#models') return {};
      throw new Error(`Unexpected module: ${id}`);
    }
  };

  vm.runInNewContext(source, sandbox, {
    filename: 'app/controllers/web/onboard.js'
  });
  return module.exports;
}

test('onboarding encrypt form keeps DNS TXT content inside its hidden value attribute', async (t) => {
  const payload =
    'forward-email=foo" /><img src=x onerror="window.__xss_poc=1">';
  const controller = getController(payload);
  const context = {
    flash() {},
    isAuthenticated() {
      return false;
    },
    method: 'GET',
    path: '/faq',
    pathWithoutLocale: '/faq',
    query: {},
    request: { t: (value) => value },
    state: {
      domains: [],
      l: (value) => value,
      meta: {},
      t: (value) => value
    }
  };

  await controller(context, () => {});

  const dom = new JSDOM(context.body);
  const input = dom.window.document.querySelector('input[name="input"]');
  t.is(input.getAttribute('value'), payload);
  t.is(dom.window.document.querySelectorAll('img, script').length, 0);
});
