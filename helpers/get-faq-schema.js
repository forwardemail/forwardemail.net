/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const MarkdownIt = require('markdown-it');
const markdownItGitHubAlerts = require('markdown-it-github-alerts');
const ms = require('ms');
const sanitizeHtml = require('sanitize-html');

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

  for (const line of lines) {
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
    const name = ensureQuestionMark(pair.question);

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
async function getFaqSchema(client, faqFilePath, logger) {
  // Try to get from Redis cache first
  if (client) {
    try {
      const cached = await client.get(CACHE_KEY);
      if (cached) {
        const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
        if (
          parsed &&
          parsed['@type'] === 'FAQPage' &&
          Array.isArray(parsed.mainEntity) &&
          parsed.mainEntity.length > 0
        ) {
          return parsed;
        }
      }
    } catch (err) {
      if (logger && typeof logger.warn === 'function') {
        logger.warn('Failed to read FAQ schema from Redis cache', {
          extra: { error: err.message }
        });
      }
    }
  }

  // Parse the FAQ markdown and build the schema
  const pairs = parseFaqMarkdown(faqFilePath);
  const schema = buildFaqSchema(pairs);

  // Store in Redis cache
  if (client && schema.mainEntity.length > 0) {
    try {
      await client.set(
        CACHE_KEY,
        JSON.stringify(schema),
        'EX',
        CACHE_TTL_SECONDS
      );
    } catch (err) {
      if (logger && typeof logger.warn === 'function') {
        logger.warn('Failed to cache FAQ schema in Redis', {
          extra: { error: err.message }
        });
      }
    }
  }

  return schema;
}

module.exports = getFaqSchema;
module.exports.parseFaqMarkdown = parseFaqMarkdown;
module.exports.buildFaqSchema = buildFaqSchema;
module.exports.ensureQuestionMark = ensureQuestionMark;
module.exports.CACHE_KEY = CACHE_KEY;
module.exports.CACHE_DURATION = CACHE_DURATION;
module.exports.CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;
module.exports.ALLOWED_TAGS = ALLOWED_TAGS;
module.exports.QUESTION_PREFIXES = QUESTION_PREFIXES;
