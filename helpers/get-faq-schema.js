/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const MarkdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItGitHubAlerts = require('markdown-it-github-alerts');
const ms = require('ms');
const sanitizeHtml = require('sanitize-html');

const singleFlightCache = require('#helpers/single-flight-cache');

// Redis cache key for FAQ structured data
const CACHE_KEY = 'faq_schema:json_ld';

// Cache duration - 1 hour TTL
const CACHE_DURATION = ms('1h');
const CACHE_TTL_SECONDS = Math.ceil(CACHE_DURATION / 1000);

// Google-allowed HTML tags for FAQ structured data answer text
// <https://developers.google.com/search/docs/appearance/structured-data/faqpage>
const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'br',
  'ol',
  'ul',
  'li',
  'a',
  'p',
  'div',
  'b',
  'strong',
  'i',
  'em'
];

// Interrogative prefixes that indicate a heading is a question
// (case-insensitive match against the start of the question text)
const QUESTION_PREFIXES = [
  'how',
  'what',
  'why',
  'when',
  'where',
  'who',
  'whom',
  'which',
  'can',
  'could',
  'do',
  'does',
  'did',
  'is',
  'are',
  'was',
  'were',
  'will',
  'would',
  'should',
  'shall',
  'has',
  'have',
  'had',
  'if'
];

// Create a minimal markdown-it instance for FAQ parsing
// (avoids the full helpers/markdown.js which has heavier dependencies)
const md = new MarkdownIt({ html: true, linkify: true });
md.use(markdownItGitHubAlerts);
// Headings inside answers pin their anchor as `{#id}`, which every translated
// FAQ file uses. Without this the braces render as visible text and end up in
// the structured data Google reads. `id` is the only attribute allowed, so the
// attribute injection this plugin permits by default is not reachable.
md.use(markdownItAttrs, { allowedAttributes: ['id'] });

// markdown-it-attrs syntax on a heading, e.g. `## Introducción {#introduction}`.
// Exported because helpers/get-faq-index.js needs the same rule, and this
// module is the one that already owns heading text handling.
const HEADING_ATTR = /\s*{#([\w-]+)}\s*/;

/**
 * Split a heading into the text a reader sees and the anchor it pins.
 * Returns a null id when the heading does not pin one.
 *
 * @param {string} heading
 * @returns {Object} - { text, id }
 */
function splitHeadingAttr(heading) {
  const value = String(heading || '');
  const match = value.match(HEADING_ATTR);
  if (!match) return { text: value.trim(), id: null };
  return {
    text: value
      .replace(HEADING_ATTR, ' ')
      // the attribute sometimes sat before the punctuation, so close the gap
      .replace(/\s+([!,.:;?])/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .trim(),
    id: match[1].toLowerCase()
  };
}

/**
 * Ensure a question string ends with a trailing question mark
 * if it starts with an interrogative word. Statement-style
 * headings (e.g. "Thunderbird", "Advanced Server Hardening Techniques")
 * are left as-is.
 * @param {string} question - The question text
 * @returns {string} - The question text, possibly with "?" appended
 */
function ensureQuestionMark(question) {
  if (!question || question.endsWith('?')) {
    return question;
  }

  const lower = question.toLowerCase();
  const isQuestion = QUESTION_PREFIXES.some(
    (prefix) => lower === prefix || lower.startsWith(prefix + ' ')
  );

  return isQuestion ? question + '?' : question;
}

/**
 * Parse FAQ markdown file and extract question/answer pairs.
 * Questions are identified as h3 (###) headings.
 * Answers are all content between one h3 and the next h3 or h2/h1.
 * @param {string} faqFilePath - Absolute path to the FAQ markdown file
 * @returns {Array<Object>} - Array of { question, answerMd } objects
 */
function parseFaqMarkdown(faqFilePath) {
  const content = fs.readFileSync(faqFilePath, 'utf8');
  const lines = content.split('\n');

  const pairs = [];
  let currentQuestion = null;
  let answerLines = [];
  // Several answers contain shell snippets whose comments start with `#`, so a
  // line inside a fenced block can look exactly like a heading. Without this,
  // `# Ubuntu/Debian` inside a bash block read as an h1 and every question
  // after it was dropped from the structured data.
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      if (currentQuestion) answerLines.push(line);
      continue;
    }

    if (inFence) {
      if (currentQuestion) answerLines.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      // Save previous Q&A pair
      if (currentQuestion && answerLines.length > 0) {
        pairs.push({
          question: currentQuestion,
          answerMd: answerLines.join('\n').trim()
        });
      }

      currentQuestion = line.slice(4).trim();
      answerLines = [];
    } else if (line.startsWith('## ') || line.startsWith('# ')) {
      // Section header (h2 or h1) - save previous and reset
      if (currentQuestion && answerLines.length > 0) {
        pairs.push({
          question: currentQuestion,
          answerMd: answerLines.join('\n').trim()
        });
      }

      currentQuestion = null;
      answerLines = [];
    } else if (currentQuestion) {
      answerLines.push(line);
    }
  }

  // Don't forget the last Q&A pair
  if (currentQuestion && answerLines.length > 0) {
    pairs.push({
      question: currentQuestion,
      answerMd: answerLines.join('\n').trim()
    });
  }

  return pairs;
}

/**
 * Build FAQ structured data (JSON-LD) from parsed Q&A pairs.
 * Renders markdown answers to HTML, then sanitizes to only
 * Google-allowed tags per the FAQPage spec.
 * Ensures question names end with "?" when they are interrogative.
 * @param {Array<Object>} pairs - Array of { question, answerMd } objects
 * @returns {Object} - FAQPage JSON-LD structured data object
 */
function buildFaqSchema(pairs) {
  const mainEntity = [];

  for (const pair of pairs) {
    // Render markdown answer to HTML
    const html = md.render(pair.answerMd);

    // Sanitize to only Google-allowed HTML tags
    const cleanHtml = sanitizeHtml(html, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: {
        a: ['href']
      }
    }).trim();

    // Ensure question ends with "?" per Google's FAQ spec examples
    // Strip the pinned anchor before it reaches the structured data. Google
    // shows this name verbatim in rich results, so `{#can-i-forward-email...}`
    // was being published as part of the question.
    const name = ensureQuestionMark(splitHeadingAttr(pair.question).text);

    // Only include pairs that have both a question and a non-empty answer
    if (name && cleanHtml) {
      mainEntity.push({
        '@type': 'Question',
        name,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cleanHtml
        }
      });
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  };
}

/**
 * Get FAQ structured data with Redis caching.
 * Reads from Redis cache first (1 hour TTL), falls back to
 * parsing the FAQ markdown file and caching the result.
 * @param {Object} client - Redis client instance (from ctx.client)
 * @param {string} faqFilePath - Absolute path to the FAQ markdown file
 * @param {Object} [logger] - Optional logger instance (e.g. ctx.logger)
 * @returns {Promise<Object>} - FAQPage JSON-LD structured data object
 */
function isValidFaqSchema(schema) {
  return Boolean(
    schema &&
      schema['@type'] === 'FAQPage' &&
      Array.isArray(schema.mainEntity) &&
      schema.mainEntity.length > 0
  );
}

async function getFaqSchema(client, faqFilePath, logger) {
  // Single-flight: the markdown parse + sanitize is CPU-bound, so on a cold key
  // one caller builds the schema and concurrent requests across every worker
  // wait for its result. An empty schema (e.g. the file was momentarily
  // unreadable) is returned but not cached, so a transient miss is not memoised
  // for the full TTL.
  return singleFlightCache(client, {
    cacheKey: CACHE_KEY,
    lockKey: `${CACHE_KEY}:lock`,
    ttlSeconds: CACHE_TTL_SECONDS,
    logger,
    shouldCache: isValidFaqSchema,
    compute: () => buildFaqSchema(parseFaqMarkdown(faqFilePath))
  });
}

module.exports = getFaqSchema;
module.exports.splitHeadingAttr = splitHeadingAttr;
module.exports.parseFaqMarkdown = parseFaqMarkdown;
module.exports.buildFaqSchema = buildFaqSchema;
module.exports.ensureQuestionMark = ensureQuestionMark;
module.exports.CACHE_KEY = CACHE_KEY;
module.exports.CACHE_DURATION = CACHE_DURATION;
module.exports.CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;
module.exports.ALLOWED_TAGS = ALLOWED_TAGS;
module.exports.QUESTION_PREFIXES = QUESTION_PREFIXES;
