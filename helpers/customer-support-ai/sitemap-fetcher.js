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

  async fetchXML(url) {
    const response = await axios.get(url, {
      timeout: 30_000,
      headers: {
        'User-Agent': 'ForwardEmail-CustomerSupportAI/1.0'
      }
    });
    return response.data;
  }

  /**
   * Fetch and parse sitemap XML
   *
   * `/sitemap.xml` is a sitemap *index* - a <sitemapindex> whose <loc>
   * entries point to one real per-locale sitemap each (e.g.
   * /en/sitemap.xml), not actual page URLs. Blindly regex-matching every
   * <loc> in the index (as this used to do) silently harvested those 25
   * sub-sitemap URLs themselves - which then almost all failed the
   * locale-prefix filter below, leaving just the /en/ index URL. Follow the
   * index to the real /en/sitemap.xml (the only locale this class keeps
   * anyway, per shouldProcessUrl) and parse its <url><loc> entries instead.
   * @returns {Promise<Array<string>>} Array of URLs from sitemap
   */
  async fetchSitemap() {
    try {
      logger.info('Fetching sitemap', { url: this.sitemapUrl });
      let xml = await this.fetchXML(this.sitemapUrl);

      if (xml.includes('<sitemapindex')) {
        const enSitemapUrl = `${this.baseUrl}/en/sitemap.xml`;
        logger.info(
          'Root sitemap is an index, following to per-locale sitemap',
          {
            url: enSitemapUrl
          }
        );
        xml = await this.fetchXML(enSitemapUrl);
      }

      const urls = this.parseSitemapXML(xml);
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
