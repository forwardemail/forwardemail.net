/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { extractSenderEmail, extractSenderName } = require('./message-utils');
const logger = require('#helpers/logger');

class MessageAnalyzer {
  async analyze(message) {
    try {
      const content = await this.extractContent(message);
      const keywords = await this.extractKeywords(message);
      const questionType = await this.classifyQuestionType(message);
      const intent = await this.classifyIntent(message);
      const urgency = await this.assessUrgency(message);
      const category = await this.categorize(message);

      const analysis = {
        messageId: message.id || message._id,
        sender: extractSenderEmail(message),
        senderName: extractSenderName(message),
        subject: message.subject || '(no subject)',
        content,
        keywords,
        questionType,
        intent,
        urgency,
        category,
        analyzedAt: new Date()
      };

      return analysis;
    } catch (err) {
      logger.error(err, {
        context: 'message analysis',
        messageId: message.id
      });
      throw err;
    }
  }

  async extractContent(message) {
    // forward-email-client.getMessage() already handles raw parsing and decryption
    // and populates message.nodemailer with parsed content

    // Try nodemailer.text (parsed by forward-email-client)
    if (message.nodemailer?.text) return message.nodemailer.text;
    if (message.nodemailer?.html) {
      return message.nodemailer.html.replace(/<[^>]*>/g, ' ').trim();
    }

    // Fallback to root level properties
    if (message.text) return message.text;
    if (message.html) return message.html.replace(/<[^>]*>/g, ' ').trim();
    if (message.body) return message.body;
    return '';
  }

  async extractKeywords(message) {
    const extractedContent = await this.extractContent(message);
    const content = `${
      message.subject || ''
    } ${extractedContent}`.toLowerCase();

    const keywords = [];

    // Technical terms
    const technicalTerms = [
      'api',
      'smtp',
      'imap',
      'pop3',
      'dns',
      'dkim',
      'spf',
      'dmarc',
      'mx',
      'srv',
      'txt',
      'forwarding',
      'alias',
      'domain',
      'email',
      'authentication',
      'ssl',
      'tls',
      'encryption',
      'openpgp',
      'pgp',
      'caldav',
      'carddav',
      'webauthn',
      'passkey',
      'webhook',
      'mta-sts',
      'srs'
    ];

    // Email clients
    const emailClients = [
      'thunderbird',
      'outlook',
      'apple mail',
      'gmail',
      'em client',
      'ios',
      'android'
    ];

    // Common issues
    const issues = [
      'spam',
      'bounce',
      'error',
      'not working',
      'failed',
      'rejected',
      'blocked',
      'timeout'
    ];

    for (const term of [...technicalTerms, ...emailClients, ...issues]) {
      if (content.includes(term)) keywords.push(term);
    }

    return [...new Set(keywords)]; // Remove duplicates
  }

  async classifyQuestionType(message) {
    const extractedContent = await this.extractContent(message);
    const content = `${
      message.subject || ''
    } ${extractedContent}`.toLowerCase();

    // How-to questions
    if (
      /how (do|to|can|should)/i.test(content) ||
      content.includes('setup') ||
      content.includes('configure')
    ) {
      return 'how_to';
    }

    // What-is questions
    if (/what (is|are|does)/i.test(content)) {
      return 'definition';
    }

    // Why questions
    if (content.startsWith('why') || content.includes('why is')) {
      return 'explanation';
    }

    // Can-I / capability questions
    if (
      /can i|do you support|is it possible/i.test(content) ||
      content.includes('able to')
    ) {
      return 'capability';
    }

    // Troubleshooting
    if (
      content.includes('error') ||
      content.includes('not working') ||
      content.includes('broken') ||
      content.includes('failed') ||
      content.includes('issue')
    ) {
      return 'troubleshooting';
    }

    // Configuration
    if (
      content.includes('configure') ||
      content.includes('set up') ||
      content.includes('settings')
    ) {
      return 'configuration';
    }

    return 'general';
  }

  /**
   * Classify user intent
   * @param {Object} message Message object
   * @returns {string} Intent classification
   */
  async classifyIntent(message) {
    const extractedContent = await this.extractContent(message);
    const content = `${
      message.subject || ''
    } ${extractedContent}`.toLowerCase();

    // Information seeking
    if (
      /how|what|where|when|which/i.test(content) ||
      content.includes('tell me') ||
      content.includes('explain')
    ) {
      return 'information';
    }

    // Problem solving
    if (
      content.includes('error') ||
      content.includes('problem') ||
      content.includes('issue') ||
      content.includes('not working') ||
      content.includes('help')
    ) {
      return 'problem_solving';
    }

    // Feature request
    if (
      content.includes('feature') ||
      content.includes('add') ||
      content.includes('support for') ||
      content.includes('would be nice')
    ) {
      return 'feature_request';
    }

    // Account/billing
    if (
      content.includes('account') ||
      content.includes('billing') ||
      content.includes('payment') ||
      content.includes('subscription') ||
      content.includes('upgrade')
    ) {
      return 'account_billing';
    }

    // Feedback
    if (
      content.includes('feedback') ||
      content.includes('suggestion') ||
      content.includes('improve')
    ) {
      return 'feedback';
    }

    return 'general_inquiry';
  }

  /**
   * Categorize message by topic
   * @param {Object} message Message object
   * @returns {string} Category
   */
  async categorize(message) {
    const extractedContent = await this.extractContent(message);
    const content = `${
      message.subject || ''
    } ${extractedContent}`.toLowerCase();

    // Email sending (SMTP)
    if (
      content.includes('smtp') ||
      content.includes('send') ||
      content.includes('outgoing')
    ) {
      return 'email_sending';
    }

    // Email receiving (IMAP/POP3)
    if (
      content.includes('imap') ||
      content.includes('pop3') ||
      content.includes('receive') ||
      content.includes('incoming')
    ) {
      return 'email_receiving';
    }

    // DNS/Domain configuration
    if (
      content.includes('dns') ||
      content.includes('domain') ||
      content.includes('dkim') ||
      content.includes('spf') ||
      content.includes('dmarc') ||
      content.includes('mx')
    ) {
      return 'dns_configuration';
    }

    // Email forwarding
    if (content.includes('forward') || content.includes('alias')) {
      return 'forwarding';
    }

    // API integration
    if (content.includes('api') || content.includes('integrate')) {
      return 'api';
    }

    // Email clients
    if (
      content.includes('thunderbird') ||
      content.includes('outlook') ||
      content.includes('apple mail') ||
      content.includes('gmail') ||
      content.includes('client')
    ) {
      return 'email_client';
    }

    // Security
    if (
      content.includes('security') ||
      content.includes('encryption') ||
      content.includes('pgp') ||
      content.includes('openpgp') ||
      content.includes('tls') ||
      content.includes('ssl')
    ) {
      return 'security';
    }

    // Calendars/Contacts
    if (
      content.includes('calendar') ||
      content.includes('caldav') ||
      content.includes('contact') ||
      content.includes('carddav')
    ) {
      return 'calendars_contacts';
    }

    // Spam/Deliverability
    if (
      content.includes('spam') ||
      content.includes('junk') ||
      content.includes('deliverability') ||
      content.includes('reputation')
    ) {
      return 'spam_deliverability';
    }

    // Account/Billing
    if (
      content.includes('account') ||
      content.includes('billing') ||
      content.includes('payment') ||
      content.includes('subscription')
    ) {
      return 'account_billing';
    }

    return 'general';
  }

  async assessUrgency(message) {
    const extractedContent = await this.extractContent(message);
    const content = `${
      message.subject || ''
    } ${extractedContent}`.toLowerCase();

    // High urgency
    if (
      content.includes('urgent') ||
      content.includes('asap') ||
      content.includes('emergency') ||
      content.includes('critical') ||
      content.includes('down') ||
      content.includes('outage')
    ) {
      return 'high';
    }

    // Medium urgency
    if (
      content.includes('error') ||
      content.includes('not working') ||
      content.includes('broken') ||
      content.includes('failed') ||
      content.includes('problem')
    ) {
      return 'medium';
    }

    return 'low';
  }
}

module.exports = new MessageAnalyzer();
