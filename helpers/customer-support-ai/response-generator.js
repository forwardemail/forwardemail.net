/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const ollamaClient = require('./ollama-client');
const logger = require('#helpers/logger');
const config = require('#config');

class ResponseGenerator {
  constructor() {
    this.validUrls = [];
    this.loadValidUrls();
  }

  /**
   * Load valid URLs from sitemap JSON file
   */
  loadValidUrls() {
    try {
      const lancedbPath =
        process.env.LANCEDB_PATH ||
        path.join(
          process.env.HOME || process.env.USERPROFILE,
          '.local/share/lancedb'
        );
      const urlsPath = path.join(lancedbPath, 'valid-urls.json');

      if (fs.existsSync(urlsPath)) {
        const data = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));
        this.validUrls = data.urls || [];
        logger.info('Loaded valid URLs from sitemap', {
          count: this.validUrls.length,
          generatedAt: data.generatedAt
        });
      } else {
        logger.warn(
          'Valid URLs file not found. Run train-from-sitemap.js first.',
          { urlsPath }
        );
      }
    } catch (err) {
      logger.error('Failed to load valid URLs', { error: err });
    }
  }

  /**
   * Get URL list formatted for prompt
   * @returns {string} Formatted URL list
   */
  getUrlListForPrompt() {
    if (this.validUrls.length === 0) {
      return 'No URL list available. DO NOT include any URLs in your response.';
    }

    // Group URLs by category for better readability
    const accountUrls = this.validUrls.filter((url) =>
      url.includes('/my-account')
    );
    const docUrls = this.validUrls.filter(
      (url) =>
        url.includes('/faq') || url.includes('/docs') || url.includes('/guides')
    );
    const blogUrls = this.validUrls.filter((url) => url.includes('/blog'));
    const otherUrls = this.validUrls.filter(
      (url) =>
        !url.includes('/my-account') &&
        !url.includes('/faq') &&
        !url.includes('/docs') &&
        !url.includes('/guides') &&
        !url.includes('/blog')
    );

    let urlList = '**VALID URLs (ONLY use URLs from this list):**\n\n';

    if (accountUrls.length > 0) {
      urlList +=
        'Account-related:\n' +
        accountUrls.map((url) => `- ${url}`).join('\n') +
        '\n\n';
    }

    if (docUrls.length > 0) {
      urlList +=
        'Documentation:\n' +
        docUrls
          .slice(0, 20)
          .map((url) => `- ${url}`)
          .join('\n') +
        '\n\n';
    }

    if (blogUrls.length > 0) {
      urlList +=
        'Blog posts:\n' +
        blogUrls
          .slice(0, 10)
          .map((url) => `- ${url}`)
          .join('\n') +
        '\n\n';
    }

    if (otherUrls.length > 0) {
      urlList +=
        'Other pages:\n' +
        otherUrls
          .slice(0, 10)
          .map((url) => `- ${url}`)
          .join('\n');
    }

    return urlList;
  }

  buildSystemPrompt(analysis, context, historicalContext = '') {
    // Extract customer name from analysis
    // Only use name if it's not unknown/uncertain (not 'unknown' or email prefix)
    let customerName = analysis.senderName || 'there';
    const senderEmail = analysis.sender || '';
    const emailPrefix = senderEmail.split('@')[0];

    // If name is 'unknown' or matches email prefix, use generic greeting
    if (customerName === 'unknown' || customerName === emailPrefix) {
      customerName = 'there';
    }

    let prompt = `You are a customer support representative for Forward Email (https://forwardemail.net), an open-source email service. Your voice is that of the "Forward Email team" - professional, friendly, and concise.

Customer Name: ${customerName}
Customer Question Type: ${analysis.questionType}
Urgency: ${analysis.urgency}

Relevant Knowledge Base Context:
${context}`;

    if (historicalContext) {
      prompt += `

Similar Past Conversations:
${historicalContext}`;
    }

    // Add valid URLs list
    const urlList = this.getUrlListForPrompt();
    prompt += `

${urlList}

**CRITICAL: URL POLICY - READ CAREFULLY**
1. You may ONLY use URLs from the "VALID URLs" list above
2. NEVER fabricate, guess, or modify URLs
3. NEVER use these FAKE URLs (they do not exist):
   - https://forwardemail.net/dashboard
   - https://dashboard.forwardemail.net
   - https://forwardemail.net/login
   - https://forwardemail.net/account
   - https://forwardemail.net/settings
   - https://forwardemail.net/billing
   - https://forwardemail.net/refund
4. If you need to reference something but don't have a valid URL, describe it in plain text WITHOUT including any URL
5. Common topics:
   - Account management: https://forwardemail.net/my-account
   - Security settings: https://forwardemail.net/my-account/security
   - Refunds: Direct to downgrade or delete account (refunds only within 30 days of payment)

**Core Instructions:**
1.  **URL Validation:** Only use URLs from the VALID URLs list above. Never fabricate or guess URLs.
2.  **No Placeholders:** Never write "[Insert Link Here]", "[Insert URL]", or similar placeholders.
3.  **Accuracy:** Use ONLY information from the context provided. If you don't have the information, state that clearly and offer to escalate.
4.  **Brand Name:** Always refer to the service as "Forward Email" (two words). NEVER use "ForwardEmail" (one word).
5.  **Forward Email's Voice:** Be simple, brief, and direct. Avoid complex sentences and unnecessary words. The goal is to be helpful and solve the problem quickly.
6.  **Personalize the Greeting:** Start with "Hi ${customerName}," as your greeting. If the customer name is "there", use "Hi there," instead.
7.  **Plain Text Only:** Your entire response must be in plain text. Do not use any Markdown, formatting, asterisks, bold, or italics. Use simple line breaks for paragraphs.
8.  **URL Format:** When including URLs from the context, write them as plain text WITHOUT wrapping them in angle brackets. Write "https://forwardemail.net" NOT "<https://forwardemail.net>". URLs should appear naturally in sentences.
9.  **Do NOT repeat the subject:** The subject line is already in the email header. Do not include it in your response body.
10. **No signature:** Do not add any signature, sign-off, or closing like "Best regards" or "Forward Email Team". Your response should end with the last sentence of your answer. The signature will be added automatically.

Customer's Message:
${analysis.content}

Write a professional, concise, and helpful plain text email response (without signature):`;

    return prompt;
  }

  async generate(analysis, context, historicalContext = '') {
    try {
      const prompt = this.buildSystemPrompt(
        analysis,
        context,
        historicalContext
      );

      const response = await ollamaClient.generate(prompt, {
        temperature: config.ollamaTemperature || 0.7,
        maxTokens: config.ollamaMaxTokens || 2000
      });

      return {
        response,
        model: config.ollamaModel,
        generatedAt: new Date(),
        contextUsed: context.length > 0
      };
    } catch (err) {
      logger.error(err, {
        context: 'response generation',
        messageId: analysis.messageId
      });
      throw err;
    }
  }

  async generateWithFallback(analysis, context, historicalContext = '') {
    try {
      return await this.generate(analysis, context, historicalContext);
    } catch (err) {
      logger.error(err, { context: 'response generation with fallback' });

      return {
        response: this.getFallbackResponse(analysis),
        model: 'fallback',
        generatedAt: new Date(),
        contextUsed: false,
        fallback: true
      };
    }
  }

  getFallbackResponse(analysis) {
    return `Thank you for contacting Forward Email support.

We've received your message regarding: ${analysis.subject}

Our team is reviewing your inquiry and will respond shortly with detailed assistance. In the meantime, you may find helpful information in our documentation at https://forwardemail.net/en/faq

If your issue is urgent, please let us know and we'll prioritize your request.`;
  }
}

module.exports = new ResponseGenerator();
