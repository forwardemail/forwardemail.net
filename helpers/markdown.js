/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItGitHubHeadings = require('markdown-it-github-headings');
const markdownItHighlightJS = require('markdown-it-highlightjs');
const markdownItTaskCheckbox = require('markdown-it-task-checkbox');
const mermaid = require('mermaid');

const logger = require('#helpers/logger');

// <https://github.com/markdown-it/markdown-it>
// <https://github.com/valeriangalliat/markdown-it-highlightjs>
// <https://github.com/jstransformers/jstransformer-markdown-it/issues/7#issuecomment-168945445>
// <https://github.com/shime/livedown>
const markdown = markdownIt({
  html: true,
  linkify: true
});
markdown.use(markdownItHighlightJS);
markdown.use(markdownItTaskCheckbox);
markdown.use(markdownItEmoji);
markdown.use(markdownItGitHubHeadings, {
  prefix: ''
});

const mermaidChart = (code) => {
  try {
    mermaid.parse(code);
    return `<div class="mermaid text-center">${code}</div>`;
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err);
    // return `<pre>${err.str}</pre>`;
    return '';
  }
};

// <https://github.com/markslides/markdown-it-mermaid/issues/1>
// <https://github.com/wekan/markdown-it-mermaid> (fork so no GH issues available, still same ESM issue)
// <https://github.com/mermaid-js/mermaid/issues/2559>

const markdownItMermaid = (md) => {
  mermaid.init({
    theme: 'default',
    startOnLoad: true
  });

  md.mermaid = mermaid;

  const original =
    md.renderer.rules.fence ||
    // eslint-disable-next-line max-params
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // eslint-disable-next-line max-params
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info === 'mermaid') {
      return mermaidChart(code);
    }

    return original(tokens, idx, options, env, self);
  };
};

markdown.use(markdownItMermaid);

module.exports = markdown;
