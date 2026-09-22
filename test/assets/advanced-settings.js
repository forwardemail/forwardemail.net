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

test('custom verification HTML preview remains sandboxed and does not inject into the application document', (t) => {
  const payload =
    '<script>window.__xss_poc=1</script><img src=x onerror="window.__xss_poc=1">';
  const attributes = new Map();
  // every use the script makes of the preview frame is recorded: the
  // template must only ever reach it as the `srcdoc` of the sandboxed
  // frame, never through its document
  const calls = [];
  const preview = new Proxy(
    {},
    {
      get(_, name) {
        if (name === 'attr')
          return (key, value) => {
            attributes.set(key, value);
            return preview;
          };

        return (...args) => {
          calls.push({ name: String(name), args });
          return preview;
        };
      }
    }
  );
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
  t.deepEqual([...attributes.keys()], ['srcdoc']);
  t.deepEqual(calls, []);
});
