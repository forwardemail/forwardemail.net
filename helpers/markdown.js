/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');
// const markdownItGitHubHeadings = require('markdown-it-github-headings');
const markdownItHighlightJS = require('markdown-it-highlightjs');
const markdownItTaskCheckbox = require('markdown-it-task-checkbox');
const markdownItGitHubAlerts = require('markdown-it-github-alerts');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');

const { encrypt } = require('#helpers/encrypt-decrypt');

// <https://github.com/markdown-it/markdown-it>
// <https://github.com/valeriangalliat/markdown-it-highlightjs>
// <https://github.com/jstransformers/jstransformer-markdown-it/issues/7#issuecomment-168945445>
// <https://github.com/shime/livedown>
const markdown = markdownIt({
  html: true,
  linkify: true
});
//
// rewrite GitHub-specific CAUTION/TIP etc sections
// <https://github.com/orgs/community/discussions/16925>
// <https://github.com/antfu/markdown-it-github-alerts>
// <https://github.com/antfu/markdown-it-github-alerts/issues/8>
//
markdown.use(markdownItGitHubAlerts);
markdown.use(markdownItFootnote);
markdown.use(markdownItHighlightJS);
markdown.use(markdownItTaskCheckbox);
markdown.use(markdownItEmoji);
markdown.use(markdownItAttrs);
markdown.use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.ariaHidden({
    placement: 'before',
    symbol: `<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`
  })
});
// markdown.use(markdownItGitHubHeadings, {
//   prefix: ''
// });

const markdownItMermaid = (md) => {
  const original =
    md.renderer.rules.fence ||
    // eslint-disable-next-line max-params
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // eslint-disable-next-line max-params
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.info === 'mermaid') {
      const code = encrypt(token.content.trim());
      // TODO: alt could be closest header token (?)
      const alt = '';
      return `<div class="text-center">
        <a href="/mermaid.png?code=${code}&theme=default" target="_blank" data-toggle="lightbox" data-title="${alt}">
          <picture>
            <source
              srcset="/mermaid.png?code=${code}&theme=dark"
              media="(prefers-color-scheme: dark)"
            />
            <img
              loading="lazy"
              class="max-height-300px"
              src="/mermaid.png?code=${code}&theme=default"
              alt="${alt}"
            />
          </picture>
        </a>
      </div>`;
    }

    return original(tokens, idx, options, env, self);
  };
};

markdown.use(markdownItMermaid);

module.exports = markdown;
