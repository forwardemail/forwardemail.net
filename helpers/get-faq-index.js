/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const MarkdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItGitHubAlerts = require('markdown-it-github-alerts');
const ms = require('ms');
const sanitizeHtml = require('sanitize-html');

const logger = require('#helpers/logger');
const {
  ensureQuestionMark,
  splitHeadingAttr
} = require('#helpers/get-faq-schema');

// One key per locale, since each locale has its own markdown file.
const CACHE_PREFIX = 'faq_index:';

// The markdown only changes on deploy, so this can be long. It exists to keep
// the parse off the request path, not to track a moving source.
const CACHE_DURATION = ms('12h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// The only section dropped outright. It is a hand-maintained link list of every
// question, roughly 14KB of it, and the topic rail plus the filter on this page
// do that job. Matched on the anchor rather than the title, because the title is
// translated and the anchor is not.
const SKIPPED_SECTIONS = new Set(['table-of-contents']);

// Display allowlist. Wider than the one in get-faq-schema.js, which is
// constrained to what Google accepts inside FAQPage structured data, because
// this html is rendered on the page and the answers use tables and code.
// `img` is deliberately absent: this page carries no images, and two answers
// in the source markdown do include one.
const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'em',
  'i',
  'del',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'div',
  'span',
  'i',
  'details',
  'summary'
];

const ALLOWED_ATTRIBUTES = {
  // `id` on the heading tags is what markdown-it-attrs writes from `{#id}`,
  // and it is what makes a deep link to a sub-heading inside an answer work.
  h4: ['id'],
  h5: ['id'],
  h6: ['id'],
  a: ['href', 'name', 'target', 'rel'],
  code: ['class'],
  pre: ['class'],
  div: ['class'],
  span: ['class'],
  i: ['class'],
  th: ['align', 'colspan', 'rowspan'],
  td: ['align', 'colspan', 'rowspan']
};

// The answers contain hand-written bootstrap markup: alert boxes, table
// modifiers, and a pile of utility classes. Left alone those bring bootstrap's
// own colours onto a surface that is not bootstrap's, which is both visually
// wrong and where every contrast failure on this page came from.
//
// Only three families survive. `alert` and its variant keep the author's
// intent that a passage is a warning or a note, and this page restyles them
// with its own tokens. `notranslate` is functional, telling Google Translate
// to leave a string alone. The font awesome classes are the inline glyphs.
// Everything else, the utilities and table modifiers, is dropped, so the
// answer body is styled by this page and nothing else.
const ALLOWED_CLASSES = {
  div: [
    'alert',
    'alert-*',
    'markdown-alert',
    'markdown-alert-*',
    'notranslate'
  ],
  span: ['notranslate'],
  p: ['markdown-alert-title'],
  a: ['notranslate'],
  code: ['language-*', 'hljs', 'hljs-*'],
  pre: ['language-*', 'hljs', 'hljs-*'],
  i: ['fa', 'fas', 'fab', 'fa-*']
};

const md = new MarkdownIt({ html: true, linkify: true });
md.use(markdownItGitHubAlerts);
// The answers use shortcodes like `:page_facing_up:`. helpers/markdown.js, the
// pipeline the existing FAQ page renders through, expands them, so without
// this the same content would show the raw shortcode here.
md.use(markdownItEmoji);
// Sub-headings inside answers pin their own anchors the same way the question
// headings do, and every translated file uses them. Without this plugin the
// `{#configuration}` renders as visible text: 34 of them in the Spanish file
// alone. `id` is the only attribute this content actually uses, and it is the
// only one allowed through, so none of the attribute injection this plugin
// permits by default is reachable. The sanitizer below is the second gate.
md.use(markdownItAttrs, { allowedAttributes: ['id'] });

// Matches the slugify markdown-it-anchor is configured with in
// helpers/markdown.js, character for character. The existing /faq page
// generates its anchors that way, and pages across the site link into them, so
// anything different here would quietly break those links.
const SLUG_STRIP = /[^\w -]/g;

/**
 * Turn a heading into an anchor id, the same way the existing page does.
 *
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(SLUG_STRIP, '')
    .replace(/\s/g, '-');
}

// Anchors come from the shared helper in get-faq-schema.js so the two parsers
// cannot disagree about what a heading says. Every translated FAQ file pins an
// explicit `{#some-id}` on each heading, which is how /faq#what-is-forward-email
// resolves to the same answer in all 25 languages; deriving the id from
// translated text instead would break every cross-reference in those files.
function splitHeading(heading) {
  const { text, id } = splitHeadingAttr(heading);
  return { text, id: id || slugify(text) };
}

/**
 * Parse a FAQ markdown file into categories of questions.
 *
 * The shape differs from parseFaqMarkdown in get-faq-schema.js, which flattens
 * everything into one list because structured data has no notion of a section.
 * Here the `##` headings are the whole point: they are what a visitor browses
 * by, so they are kept and each question is filed under the one it sits in.
 *
 * @param {string} faqFilePath - absolute path to the markdown file
 * @returns {Object} - { categories, total }
 */
function parseFaqIndex(faqFilePath, locale = 'en') {
  const lines = fs.readFileSync(faqFilePath, 'utf8').split('\n');
  const isEnglish = locale === 'en';

  const categories = [];
  let category = null;
  let question = null;
  let answerLines = [];
  // Prose sitting under a `##` before its first `###`. Two sections are
  // written that way, Quick Start and Additional Resources, and Quick Start is
  // the target of /faq#quick-start, which every pricing page links to. Without
  // this both sections, and that anchor, disappear.
  let introLines = [];
  // Answers contain shell snippets whose comments start with `#`, so a line
  // can look exactly like a heading while being code. Heading detection is
  // suspended inside a fence, otherwise `# Ubuntu/Debian` inside a bash block
  // reads as an h1 and drops every question after it.
  let inFence = false;

  function renderMd(markdown) {
    return sanitizeHtml(md.render(markdown), {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTRIBUTES,
      allowedClasses: ALLOWED_CLASSES
    });
  }

  function flushIntro() {
    if (!category) return;
    const introMd = introLines.join('\n').trim();
    introLines = [];
    if (introMd) category.introHtml = renderMd(introMd);
  }

  function flushQuestion() {
    if (!category || !question) return;
    const answerMd = answerLines.join('\n').trim();
    if (!answerMd) return;
    const { text: heading, id } = splitHeading(question);
    // ensureQuestionMark tests against a list of English interrogatives, so it
    // is only meaningful on the English file. Translators wrote their own
    // punctuation, and Spanish would want an opening mark this could not add.
    const text = isEnglish ? ensureQuestionMark(heading) : heading;
    category.questions.push({
      // The bare anchor, not a prefixed one: the translated files cross-link
      // each other with /faq#<id> and the rest of the site links in the same
      // way, so the id has to be exactly what those links expect.
      id,
      question: text,
      // Lowercased once here so the client side filter does not have to
      // lowercase 137 strings on every keystroke.
      search: text.toLowerCase(),
      answerHtml: renderMd(answerMd)
    });
  }

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      if (question) answerLines.push(line);
      continue;
    }

    if (inFence) {
      if (question) answerLines.push(line);
      continue;
    }

    if (line.startsWith('## ')) {
      flushQuestion();
      flushIntro();
      question = null;
      answerLines = [];
      const { text: title, id: slug } = splitHeading(line.slice(3));
      if (SKIPPED_SECTIONS.has(slug)) {
        category = null;
      } else {
        category = { title, slug, introHtml: '', questions: [] };
        categories.push(category);
      }
    } else if (line.startsWith('# ')) {
      flushQuestion();
      flushIntro();
      category = null;
      question = null;
      answerLines = [];
    } else if (line.startsWith('### ')) {
      flushQuestion();
      flushIntro();
      question = line.slice(4).trim();
      answerLines = [];
    } else if (question) {
      answerLines.push(line);
    } else if (category) {
      introLines.push(line);
    }
  }

  flushQuestion();
  flushIntro();

  // A `##` with neither questions nor prose under it is a heading with nothing
  // to show.
  const kept = categories.filter((c) => c.questions.length > 0 || c.introHtml);

  return {
    categories: kept,
    total: kept.reduce((sum, c) => sum + c.questions.length, 0)
  };
}

/**
 * Resolve the markdown file for a locale, falling back to English.
 *
 * @param {string} viewsRoot - config.views.root
 * @param {string} locale
 * @returns {string}
 */
function faqFilePathForLocale(viewsRoot, locale) {
  const localised = path.join(viewsRoot, 'faq', `index-${locale}.md`);
  if (locale && locale !== 'en' && fs.existsSync(localised)) return localised;
  return path.join(viewsRoot, 'faq', 'index.md');
}

/**
 * The parsed index for a locale, from redis when it is there.
 *
 * The existing /faq route carries a comment that it takes 30s or more to
 * render, because the markdown is parsed and rendered inline on every request.
 * Doing that work once and caching the result is the reason this helper exists.
 *
 * @param {Object} client - redis client
 * @param {string} viewsRoot
 * @param {string} locale
 * @returns {Promise<Object>}
 */
async function getFaqIndex(client, viewsRoot, locale = 'en') {
  const cacheKey = `${CACHE_PREFIX}${locale}`;

  if (client) {
    try {
      const cached = await client.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (err) {
      logger.warn('Failed to read FAQ index from redis', {
        extra: { error: err.message, locale }
      });
    }
  }

  const parsed = parseFaqIndex(faqFilePathForLocale(viewsRoot, locale), locale);

  if (client) {
    try {
      await client.set(
        cacheKey,
        JSON.stringify(parsed),
        'EX',
        CACHE_TTL_SECONDS
      );
    } catch (err) {
      logger.warn('Failed to cache FAQ index in redis', {
        extra: { error: err.message, locale }
      });
    }
  }

  return parsed;
}

/**
 * Narrow a parsed index to the questions matching a query.
 *
 * assets/js/faq-search.js does the same thing on the client as you type. This
 * exists so `/faq?q=imap`, which is what the search form submits without
 * JavaScript, returns a filtered page rather than the whole list with a
 * prefilled box that does not appear to have done anything.
 *
 * @param {Object} index - the result of getFaqIndex
 * @param {string} query
 * @returns {Object} - same shape, narrowed, plus `query` and `matched`
 */
function filterFaqIndex(index, query) {
  const words = String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return { ...index, query: '', matched: index.total };

  const categories = index.categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((q) =>
        words.every((w) => q.search.includes(w))
      )
    }))
    .filter((category) => category.questions.length > 0);

  return {
    ...index,
    categories,
    query,
    matched: categories.reduce((sum, c) => sum + c.questions.length, 0)
  };
}

module.exports = getFaqIndex;
module.exports.filterFaqIndex = filterFaqIndex;
module.exports.getFaqIndex = getFaqIndex;
module.exports.parseFaqIndex = parseFaqIndex;
module.exports.faqFilePathForLocale = faqFilePathForLocale;
module.exports.slugify = slugify;
