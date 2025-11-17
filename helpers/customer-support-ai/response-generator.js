/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ollamaClient = require('./ollama-client');
const logger = require('#helpers/logger');
const config = require('#config');

class ResponseGenerator {
  buildSystemPrompt(analysis, context, historicalContext = '') {
    let prompt = `You are a helpful customer support representative for Forward Email, an open-source email service.

Customer Question Type: ${analysis.questionType}
Urgency: ${analysis.urgency}
Keywords: ${analysis.keywords.join(', ')}

Relevant Knowledge Base Context:
${context}`;

    if (historicalContext) {
      prompt += `

Similar Past Conversations:
${historicalContext}`;
    }

    return (
      prompt +
      `

Instructions:
- Provide a clear, helpful response to the customer's question
- Use the knowledge base context to ensure accuracy
- Be professional but friendly
- Keep responses concise (under 500 words)
- If you're unsure, acknowledge it and offer to escalate
- When referencing documentation, include the source URL provided in the context
- Cite specific FAQ entries, GitHub issues, or documentation pages when relevant
- Use proper email formatting
- End with helpful next steps or additional resources

Customer's Message:
Subject: ${analysis.subject}
Content: ${analysis.content}

Write a professional email response:`
    );
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

If your issue is urgent, please let us know and we'll prioritize your request.

Best regards,
Forward Email Support Team
https://forwardemail.net`;
  }
}

module.exports = new ResponseGenerator();
