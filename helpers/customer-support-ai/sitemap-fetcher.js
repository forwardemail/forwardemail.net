/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const axios = require('axios');

const logger = require('#helpers/logger');
const locales = require('#config/locales');

class SitemapFetcher {
  constructor(sitemapUrl = 'https://forwardemail.net/sitemap.xml') {
    this.sitemapUrl = sitemapUrl;
    this.baseUrl = 'https://forwardemail.net';
    // Build regex pattern for locale prefixes: /^\/(ar|cs|da|de|...|zh)\//
    this.localePattern = new RegExp(`^/(${locales.join('|')})/`);
  }

  /**
   * Strip locale prefix from URL path
   * @param {string} url Full URL
   * @returns {string} URL without locale prefix
   */
  stripLocalePrefix(url) {
    try {
      const urlObj = new URL(url);
      // Remove locale prefix from pathname: /en/faq -> /faq
      urlObj.pathname = urlObj.pathname.replace(this.localePattern, '/');
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  /**
   * Check if URL should be processed (no locale or /en/ only)
   * @param {string} url URL to check
   * @returns {boolean} True if URL should be processed
   */
  shouldProcessUrl(url) {
    try {
      const urlObj = new URL(url);
      const { pathname } = urlObj;

      // Check if URL has a locale prefix
      const localeMatch = pathname.match(this.localePattern);

      if (!localeMatch) {
        // No locale prefix - process it
        return true;
      }

      // Has locale prefix - only process if it's /en/
      const locale = localeMatch[1];
      return locale === 'en';
    } catch {
      return false;
    }
  }

  /**
   * Fetch and parse sitemap XML
   * @returns {Promise<Array<string>>} Array of URLs from sitemap
   */
  async fetchSitemap() {
    try {
      logger.info('Fetching sitemap', { url: this.sitemapUrl });
      const response = await axios.get(this.sitemapUrl, {
        timeout: 30_000,
        headers: {
          'User-Agent': 'ForwardEmail-CustomerSupportAI/1.0'
        }
      });

      const urls = this.parseSitemapXML(response.data);
      logger.info('Sitemap fetched successfully', {
        totalUrls: urls.length
      });

      return urls;
    } catch (err) {
      logger.error('Failed to fetch sitemap', { error: err });
      throw err;
    }
  }

  /**
   * Parse sitemap XML and extract URLs
   * Filters to only include non-localized or /en/ URLs
   * Strips locale prefixes from all URLs
   * @param {string} xml Sitemap XML content
   * @returns {Array<string>} Array of canonical URLs (without locale prefixes)
   */
  parseSitemapXML(xml) {
    const urls = [];
    const urlMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g);

    for (const match of urlMatches) {
      const url = match[1].trim();

      // Only process URLs from our domain
      if (!url.startsWith(this.baseUrl)) continue;

      // Only process non-localized or /en/ URLs
      if (!this.shouldProcessUrl(url)) continue;

      // Strip locale prefix and add to list
      const canonicalUrl = this.stripLocalePrefix(url);
      urls.push(canonicalUrl);
    }

    // Remove duplicates
    return [...new Set(urls)];
  }
}

module.exports = SitemapFetcher;
