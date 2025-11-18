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

    // Check if email is old (15+ days)
    let messageDate = analysis.date || new Date();
    // Ensure messageDate is a Date object
    if (!(messageDate instanceof Date)) {
      messageDate = new Date(messageDate);
    }

    // If date is invalid, use current date
    if (Number.isNaN(messageDate.getTime())) {
      messageDate = new Date();
    }

    const now = new Date();
    const daysSinceMessage = Math.floor(
      (now - messageDate) / (1000 * 60 * 60 * 24)
    );
    const isOldEmail = daysSinceMessage >= 15 && daysSinceMessage < 365; // Cap at 1 year to avoid unrealistic values

    let prompt = `You are a customer support representative for Forward Email (https://forwardemail.net), an open-source email service. Your voice is that of the "Forward Email team" - professional, friendly, and concise.  Write like you talk to a friend, avoid complex vocabulary.  Short sentences and break up complex thoughts into simple terms.  It should sound like it was written by a human.

Customer Name: ${customerName}
Customer Question Type: ${analysis.questionType}
Urgency: ${analysis.urgency}
Days Since Message: ${daysSinceMessage}${
      isOldEmail ? ' (OLD EMAIL - see instructions below)' : ''
    }

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
   - https://forwardemail.net/guides/* (no guides directory exists)
4. If you need to reference something but don't have a valid URL, describe it in plain text WITHOUT including any URL
5. Common topics:
   - Account management: https://forwardemail.net/my-account
   - Security settings: https://forwardemail.net/my-account/security
   - Refunds: Direct to downgrade or delete account (refunds only within 30 days of payment)

**CRITICAL: DO NOT FABRICATE FEATURES OR SETTINGS**
1. ONLY describe features and settings that are explicitly mentioned in the Knowledge Base Context above
2. NEVER invent UI elements, menu options, or configuration settings
3. If you don't know how to do something, provide the best answer you can based on context
4. NEVER make up step-by-step instructions unless they are in the context
5. NEVER say "I don't have that information" or "Please contact support@forwardemail.net" - you ARE support
6. If context is limited, provide what you know and ask clarifying questions to help better

**CRITICAL: ABUSE REPORTS - EXACT INSTRUCTIONS**
For ANY abuse, phishing, spam, fraud, or security reports:
1. Direct users to: https://forwardemail.net/report-abuse
2. DO NOT provide step-by-step instructions
3. DO NOT mention "Report Abuse" buttons or menu items
4. DO NOT reference /my-account/security or any other page
5. ONLY say: "Please file an abuse report at https://forwardemail.net/report-abuse if you haven't already"
6. DO NOT fabricate any additional steps or instructions
7. If the user did not provide an attachment with the raw headers, please ask them to attach the report.

**CRITICAL: HELP REQUEST TEMPLATES**
If the customer's message contains a "Your Help Request" section or similar template with Forward Email logo at bottom:
1. This is a help request form submission - extract the ACTUAL customer question from within the template
2. DO NOT echo back the template or repeat their message
3. RESPOND to their specific question or issue
4. Provide a helpful answer based on the knowledge base context
5. Example: If they say "I'm getting an error for too many concurrent connections", diagnose and solve that problem

**CRITICAL: OLD EMAILS (15+ DAYS)**
If Days Since Message is 15 or more:
1. Acknowledge the delay: "I apologize for the delayed response"
2. Provide the best answer you can based on the context
3. Ask if they still need help: "Since it's been ${daysSinceMessage} days, please let me know if you still need assistance with this or if the issue has been resolved"
4. Be understanding that the situation may have changed

========================================
FORMATTING RULES - MANDATORY - NO EXCEPTIONS
========================================

YOUR RESPONSE MUST BE PLAIN TEXT ONLY.

DO NOT USE:
- Asterisks for bold: NO ** or *
- Underscores for italic: NO _ or __
- Brackets: NO []
- Placeholders for links or variables
- Parentheses around URLs or text: NO ()
- Angle brackets: NO <>
- Markdown links: NO [text](url)
- Markdown formatting of ANY kind
- mailto: prefix for emails

CORRECT EXAMPLES:
"You can find this at https://forwardemail.net/my-account for your account settings."
"Contact us at support@forwardemail.net if you need help."
"Forward Email is an open-source email service."

INCORRECT EXAMPLES (DO NOT DO THIS):
"You can find this at [account settings](https://forwardemail.net/my-account)"
"Contact us at [support@forwardemail.net](mailto:support@forwardemail.net)"
"**Forward Email** is an open-source email service."
"Visit (https://forwardemail.net) for more info"

========================================
URL POLICY - ABSOLUTELY CRITICAL
========================================

You may ONLY use URLs that appear in the VALID URLs list above.

IF A URL IS NOT IN THE LIST ABOVE, DO NOT USE IT.

DO NOT:
- Fabricate URLs
- Guess URLs
- Modify URLs
- Use placeholder URLs
- Write "[Insert URL]"

IF YOU NEED TO REFERENCE SOMETHING WITHOUT A URL:
- Describe it in plain text
- Tell the user to check their account settings
- Tell them to contact support

COMMON MISTAKES TO AVOID:
- https://forwardemail.net/dashboard (DOES NOT EXIST)
- https://forwardemail.net/guides/* (DOES NOT EXIST)
- https://forwardemail.net/settings (DOES NOT EXIST)
- https://forwardemail.net/billing (DOES NOT EXIST)

CORRECT URL FOR ACCOUNT: https://forwardemail.net/my-account
CORRECT URL FOR BILLING & REFUNDS: https://forwardemail.net/my-account/billing
CORRECT URL FOR SECURITY: https://forwardemail.net/my-account/security
CORRECT URL FOR ABUSE: https://forwardemail.net/report-abuse

========================================
ACCURACY RULES - NO FABRICATION
========================================

1. ONLY use information from the Knowledge Base Context above
2. DO NOT invent features, settings, or UI elements
3. DO NOT make up step-by-step instructions
4. NEVER say "I don't have that information" - you ARE the support team
5. NEVER tell users to "contact support@forwardemail.net" - that's YOU
6. If context is limited, provide what you know and ask clarifying questions

========================================
CORE INSTRUCTIONS
========================================

1. Start with "Hi ${customerName}," (or "Hi there," if name is "there")
2. Write in plain text with normal punctuation
3. Be brief and direct
4. Use "Forward Email" (two words), never "ForwardEmail"
5. DO NOT repeat the subject line
6. DO NOT add a signature or closing
7. End with your last sentence of help

Customer's Message:
${analysis.content}

========================================
FINAL REMINDER BEFORE YOU WRITE
========================================

✓ Plain text only - NO asterisks, NO brackets, NO parentheses
✓ URLs from the VALID list only - NO fabricated URLs
✓ Information from context only - NO invented features
✓ Start with "Hi ${customerName},"
✓ NO signature or closing

Write your response now:`;

    return prompt;
  }

  async generate(analysis, context, historicalContext = '') {
    try {
      const prompt = this.buildSystemPrompt(
        analysis,
        context,
        historicalContext
      );

      let response = await ollamaClient.generate(prompt, {
        temperature: config.ollamaTemperature || 0.7,
        maxTokens: config.ollamaMaxTokens || 2000
      });

      // Post-process: Remove any signatures/closings the LLM added despite instructions
      response = this.stripSignature(response);

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

  /**
   * Strip common signature patterns from LLM response
   * @param {string} response - Raw LLM response
   * @returns {string} Response without signature
   */
  stripSignature(response) {
    // Common signature patterns to remove
    const signaturePatterns = [
      /\n\n--\s*\n[\s\S]*$/, // -- separator
      /\n\nthank you,?\s*\n[\s\S]*$/i, // "Thank you," followed by anything
      /\n\ntake care,?\s*\n[\s\S]*$/i, // "Take care," followed by anything
      /\n\nbest regards?,?\s*\n[\s\S]*$/i, // "Best regards," followed by anything
      /\n\nsincerely,?\s*\n[\s\S]*$/i, // "Sincerely," followed by anything
      /\n\nforward email( team)?\s*$/i, // Just "Forward Email" or "Forward Email Team"
      /\n\nhttps:\/\/forwardemail\.net\s*$/i // Just the URL at the end
    ];

    let cleaned = response;
    for (const pattern of signaturePatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned.trim();
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
