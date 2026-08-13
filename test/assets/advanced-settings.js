/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const test = require('ava');

const source = fs.readFileSync(
  path.join(__dirname, '../../assets/js/advanced-settings.js'),
  'utf8'
);
const template = fs.readFileSync(
  path.join(
    __dirname,
    '../../app/views/my-account/domains/advanced-settings.pug'
  ),
  'utf8'
);

test('custom verification HTML preview remains sandboxed and does not inject into the application document', (t) => {
  const payload =
    '<script>window.__xss_poc=1</script><img src=x onerror="window.__xss_poc=1">';
  const attributes = new Map();
  const preview = {
    attr(name, value) {
      attributes.set(name, value);
      return this;
    }
  };
  const emptySelection = {
    get() {},
    length: 0
  };
  const editor = {
    get() {
      return {};
    }
  };

  function jquery(selector) {
    if (selector === '#custom-verification-preview') return preview;
    if (selector === '#textarea-custom-verification-html') return editor;
    return emptySelection;
  }

  const codeMirror = {
    fromTextArea() {
      return {
        getValue() {
          return payload;
        },
        on() {}
      };
    }
  };
  const sandbox = {
    window: {
      IS_CUSTOM_VERIFICATION_DISABLED: false,
      location: {
        pathname: '/my-account/domains/example.com/advanced-settings'
      }
    },
    require(id) {
      if (id === 'jquery') return jquery;
      if (id === 'codemirror') return codeMirror;
      if (id === 'sweetalert2/dist/sweetalert2.js') return { fire() {} };
      if (id === './debounce') return (fn) => fn;
      if (id === './send-request') return async () => ({ ok: true });
      if (id.startsWith('codemirror/')) return {};
      throw new Error(`Unexpected module: ${id}`);
    }
  };

  vm.runInNewContext(source, sandbox, {
    filename: 'assets/js/advanced-settings.js'
  });

  t.is(attributes.get('srcdoc'), payload);
  t.false(source.includes(".contents().find('html').html"));
  t.regex(
    template,
    /iframe#custom-verification-preview[\s\S]*?sandbox=""[\s\S]*?src="about:blank"/
  );
});
