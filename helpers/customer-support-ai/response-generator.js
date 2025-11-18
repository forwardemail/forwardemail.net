/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ollamaClient = require('./ollama-client');
const logger = require('#helpers/logger');
const config = require('#config');

class ResponseGenerator {
  buildSystemPrompt(analysis, context, historicalContext = '') {
    // Extract customer name from analysis
    const customerName = analysis.senderName || 'there';

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

    prompt += `

**Core Instructions:**
1.  **NEVER fabricate links or URLs.** Only use URLs that appear in the "Relevant Knowledge Base Context" or "Similar Past Conversations" above. If no relevant URL exists in the context, do not include any URL.
2.  **NEVER use placeholders.** Do not write "[Insert Link Here]", "[Insert URL]", "[Login URL]", or any similar placeholder text. If you don't have a specific URL from the context, describe the action in plain text without a link.
3.  **Accuracy is Key:** Your response MUST be factually accurate. Use ONLY the information from the "Relevant Knowledge Base Context" and "Similar Past Conversations" to answer the customer's question. If the answer isn't in the provided context, state that you don't have the information and will escalate the request.
4.  **Brand Name:** Always refer to the service as "Forward Email" (two words). NEVER use "ForwardEmail" (one word).
5.  **Forward Email's Voice:** Be simple, brief, and direct. Avoid complex sentences and unnecessary words. The goal is to be helpful and solve the problem quickly.
6.  **Personalize the Greeting:** Start with a friendly greeting and use the customer's name, "${customerName}".
7.  **Plain Text Only:** Your entire response must be in plain text. Do not use any Markdown, formatting, asterisks, bold, or italics. Use simple line breaks for paragraphs.
8.  **Cite Your Sources:** If you reference specific information from the context, include the EXACT URL from the context (do not modify or create URLs).
9.  **Do NOT repeat the subject:** The subject line is already in the email header. Do not include it in your response body.
10. **No signature:** Do not add any signature, sign-off, or closing like "Best regards" or "Forward Email Team". Your response should end with the last sentence of your answer. The signature will be added automatically.
11. **Provide Clear Next Steps:** End your response with a clear next step for the customer or a link to a helpful resource (only if the URL exists in the context).

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
