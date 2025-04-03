/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItGitHubHeadings = require('markdown-it-github-headings');
const markdownItHighlightJS = require('markdown-it-highlightjs');
const markdownItTaskCheckbox = require('markdown-it-task-checkbox');
const markdownItGitHubAlerts = require('markdown-it-github-alerts');
const markdownItFootnote = require('markdown-it-footnote');

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
markdown.use(markdownItGitHubHeadings, {
  prefix: ''
});

const markdownItmermaid = (md) => {
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

markdown.use(markdownItmermaid);

module.exports = markdown;
