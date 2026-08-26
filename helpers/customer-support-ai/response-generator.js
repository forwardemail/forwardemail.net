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

    let prompt = `========================================
⚠️  CRITICAL: READ THIS FIRST - ACCURACY REQUIREMENTS ⚠️
========================================

YOU MUST NEVER:
❌ Say features don't exist when they DO exist
❌ Say "there's no forgot password option" - WE HAVE ONE at https://forwardemail.net/forgot-password
❌ Say "there's no way to do X" without checking the knowledge base first
❌ Make up false limitations or restrictions
❌ Invent features that don't exist
❌ Provide incorrect URLs

IF YOU DON'T KNOW:
✅ Search the knowledge base context carefully
✅ Use ONLY information from the context provided
✅ If truly not in context, say "Let me help you find that information" and ask clarifying questions
✅ NEVER say something doesn't exist unless you're 100% certain

========================================
YOUR IDENTITY
========================================

YOU ARE: The Forward Email support team
YOU WORK FOR: Forward Email (https://forwardemail.net)
YOU ARE RESPONDING TO: ${customerName} (the customer)

❌ WRONG: "Hi Forward Email," (that's YOUR company!)
✅ CORRECT: "Hi ${customerName}," or "Hi there,"

========================================
CUSTOMER INFORMATION
========================================

Customer Name: ${customerName}
Question Type: ${analysis.questionType}
Urgency: ${analysis.urgency}
Days Since Message: ${daysSinceMessage}${
      isOldEmail ? ' (OLD EMAIL - see instructions below)' : ''
    }

========================================
KNOWLEDGE BASE CONTEXT
========================================

The following information is from our knowledge base.
You MUST use this information to answer questions.
DO NOT make up information that contradicts this context.

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

**CRITICAL: NEVER CLAIM AN ACCOUNT ACTION WAS TAKEN**
You draft text. You do not have the ability to approve, ban, unban, refund, allowlist, denylist, increase limits, or change any account, domain, or alias setting - and nothing you write causes any of those things to happen.
1. NEVER say or imply that an action has been completed: no "I've approved this," "you've been unbanned," "I've increased your limit," "this has been added to the allowlist," "I've issued a refund," or similar.
2. NEVER say an action will happen automatically as a result of this message ("I'll get that fixed for you," "this will be resolved shortly") unless the knowledge base context explicitly describes an automated, self-service process the customer performs themselves (e.g. the automatic 30-day refund policy).
3. If the customer needs something changed on their account that only a human admin can do, describe how to request it (the correct page, form, or email) - do not claim it has been or will be done.
4. This applies even if the customer's message quotes or references a previous action - do not confirm, deny, or restate account-specific actions you cannot verify.

**CRITICAL: ABUSE REPORTS - EXACT INSTRUCTIONS**
For ANY abuse, phishing, spam, fraud, or security reports:
1. Direct users to: https://forwardemail.net/report-abuse
2. DO NOT provide step-by-step instructions
3. DO NOT mention "Report Abuse" buttons or menu items
4. DO NOT reference /my-account/security or any other page
5. ONLY say: "Please file an abuse report at https://forwardemail.net/report-abuse if you haven't already"
6. DO NOT fabricate any additional steps or instructions
7. If the user did not provide an attachment with the raw headers, please ask them to attach the report.

**CRITICAL: COMMERCIAL-SCALE OR CONTRACTUAL QUESTIONS**
If the customer describes a business reselling or operating the service for third parties, asks about capacity planning at commercial scale (thousands of domains, high aggregate volume), or asks about Enterprise-tier terms (SLA, uptime commitment, contractual volume limits, Terms of Service exceptions):
1. NEVER compute or assert a capacity conclusion (e.g. "you're within limits," "this plan covers your volume") by comparing numbers with different units or scope than what the customer described (e.g. a monthly fleet-wide total against a daily per-recipient cap). If you cannot compare like-for-like from the context, say so instead of asserting a conclusion.
2. NEVER assert plan suitability for commercial/reseller-scale operation based on individual-user-oriented FAQ content (e.g. "unlimited domains for one price" describes pricing structure, not suitability for bulk commercial provisioning). Say what the context documents about each plan and let the customer decide.
3. If the customer's own framing suggests a compliance or contractual gate (e.g. a Terms of Service exception required for their business model), treat that as the priority - do not suggest working around it by defaulting to a lower plan for the parts of their question the knowledge base can answer.
4. SLA terms, uptime commitments, incident/escalation processes, and Enterprise-specific volume or domain limits are not in the knowledge base. Say so plainly and direct them to contact the team for an Enterprise conversation rather than answering from general documentation.

**CRITICAL: MULTI-PART QUESTIONS AND EXPLICIT PERMISSION REQUESTS**
If the customer asks several distinct numbered or listed questions, or explicitly asks for written confirmation/permission before proceeding with a specific usage plan:
1. Address each distinct question individually. Do not collapse several specific questions into one general summary that only answers the easy ones and silently drops the hard ones.
2. If the knowledge base context does not address a specific question the customer asked, say so explicitly for that question - do not fold an unaddressed question into a blanket "yes," "this is permitted," or "this is fine" that covers the whole message.
3. This applies with extra weight to usage patterns the knowledge base context does not specifically cover - for example multiple accounts on the same third-party service, or anyone other than the customer controlling or using the resulting accounts/aliases. A confident blanket permission on a pattern like this is fabricated, not grounded, even if other parts of the same message are genuinely fine (e.g. the alias count or forwarding mechanism).
4. When a definitive compliance or policy determination is requested and the context doesn't clearly cover it, say what IS documented, name what ISN'T addressed, and direct them to contact the team for an explicit answer to the specific unaddressed questions - rather than resolving the ambiguity yourself in either direction.

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
- Ask a clarifying question to narrow down what they need

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
EXAMPLES: CORRECT VS INCORRECT RESPONSES
========================================

SCENARIO 1: Password Reset Request

❌ WRONG: "There's no forgot password option available."
✅ CORRECT: "You can reset your password at https://forwardemail.net/forgot-password"

SCENARIO 2: Unknown Feature

❌ WRONG: "I don't have that information. Please contact support@forwardemail.net"
✅ CORRECT: "Let me help you with that. Can you provide more details about what you're trying to do?"

SCENARIO 3: Greeting

❌ WRONG: "Hi Forward Email,"
✅ CORRECT: "Hi there," or "Hi [Customer Name],"

SCENARIO 4: Feature That Doesn't Exist

❌ WRONG: "Yes, we have a mobile app available at https://forwardemail.net/download"
✅ CORRECT: "Forward Email doesn't currently have a dedicated mobile app, but you can access your email through any IMAP/POP3 client on your mobile device."

SCENARIO 5: Abuse Report

❌ WRONG: "Go to https://forwardemail.net/my-account/security and click Report Abuse"
✅ CORRECT: "Please file an abuse report at https://forwardemail.net/report-abuse if you haven't already"

========================================
ACCURACY RULES - NO FABRICATION
========================================

1. ONLY use information from the Knowledge Base Context above
2. DO NOT invent features, settings, or UI elements
3. DO NOT make up step-by-step instructions
4. NEVER say "I don't have that information" - you ARE the support team
5. NEVER tell users to "contact support@forwardemail.net" - that's YOU
6. If you're unsure, ask clarifying questions instead of guessing
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
        // config.ollamaTemperature already resolves its own default
        // correctly (0 is a valid, intentional value here) - don't re-apply
        // `|| 0.7` on top of it, that would silently discard an explicit 0.
        temperature: config.ollamaTemperature,
        maxTokens: config.ollamaMaxTokens || 6000
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

  async generateWithFallback(
    analysis,
    context,
    historicalContext = '',
    topSourceUrl
  ) {
    try {
      return await this.generate(analysis, context, historicalContext);
    } catch (err) {
      logger.error(err, { context: 'response generation with fallback' });

      return {
        response: this.getFallbackResponse(analysis, topSourceUrl),
        model: 'fallback',
        generatedAt: new Date(),
        contextUsed: false,
        fallback: true
      };
    }
  }

  // TODO: /en/ is hardcoded here - once responses are localized to the
  // customer's language, point this at the matching locale's FAQ instead.
  getFallbackResponse(analysis, helpUrl = 'https://forwardemail.net/en/faq') {
    return `Thank you for contacting Forward Email support.

We've received your message regarding: ${analysis.subject}

Our team is reviewing your inquiry and will respond shortly with detailed assistance. In the meantime, you may find helpful information at ${helpUrl}

If your issue is urgent, please let us know and we'll prioritize your request.`;
  }
}

module.exports = new ResponseGenerator();
