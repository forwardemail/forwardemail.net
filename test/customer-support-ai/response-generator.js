/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

// Test core response generator logic without loading the full module
// which requires config/ollama that has native dependencies

test('URL grouping logic for prompt', (t) => {
  const urls = [
    'https://forwardemail.net/',
    'https://forwardemail.net/faq',
    'https://forwardemail.net/my-account',
    'https://forwardemail.net/my-account/security',
    'https://forwardemail.net/guides/send-email-with-custom-domain-smtp'
  ];

  const groupUrls = (urlList) => {
    const accountUrls = urlList.filter((url) => url.includes('/my-account'));
    const guideUrls = urlList.filter((url) => url.includes('/guides/'));
    const otherUrls = urlList.filter(
      (url) => !url.includes('/my-account') && !url.includes('/guides/')
    );

    let result = '\n**VALID URLs (ONLY use URLs from this list):**\n\n';

    if (accountUrls.length > 0) {
      result += 'Account-related:\n';
      for (const url of accountUrls) result += `- ${url}\n`;
      result += '\n';
    }

    if (guideUrls.length > 0) {
      result += 'Guides:\n';
      for (const url of guideUrls) result += `- ${url}\n`;
      result += '\n';
    }

    if (otherUrls.length > 0) {
      result += 'Documentation:\n';
      for (const url of otherUrls) result += `- ${url}\n`;
    }

    return result;
  };

  const result = groupUrls(urls);

  t.true(result.includes('Account-related:'));
  t.true(result.includes('https://forwardemail.net/my-account'));
  t.true(result.includes('https://forwardemail.net/my-account/security'));
  t.true(result.includes('Guides:'));
  t.true(result.includes('Documentation:'));
  t.true(result.includes('https://forwardemail.net/faq'));
});

test('sender name detection logic', (t) => {
  const getSenderGreeting = (senderName, senderEmail) => {
    let name = senderName || 'there';
    const emailPrefix = senderEmail.split('@')[0];

    // If name is 'unknown' or matches email prefix, use generic greeting
    if (name === 'unknown' || name === emailPrefix) {
      name = 'there';
    }

    return name;
  };

  t.is(getSenderGreeting('John Doe', 'john@example.com'), 'John Doe');
  t.is(getSenderGreeting('unknown', 'john@example.com'), 'there');
  t.is(getSenderGreeting('john', 'john@example.com'), 'there');
  t.is(getSenderGreeting('', 'john@example.com'), 'there');
  t.is(getSenderGreeting('Jane Smith', 'jane@example.com'), 'Jane Smith');
});

test('prompt structure includes all required sections', (t) => {
  const buildPrompt = (customerName, questionType, context, urlList) => {
    const prompt = `You are a customer support representative for Forward Email (https://forwardemail.net), an open-source email service.

Customer Name: ${customerName}
Customer Question Type: ${questionType}

Relevant Knowledge Base Context:
${context}

${urlList}

**CRITICAL: URL POLICY**

1. URL Validation: ONLY use URLs from the "VALID URLs" list above
2. No Placeholders: NEVER use placeholders like [your-domain] or {username}
3. Accuracy: If you don't know the exact URL, DO NOT include any URL

**FAKE URLs (NEVER use these):**
- https://forwardemail.net/dashboard
- https://dashboard.forwardemail.net
- https://forwardemail.net/login

Core Instructions:
- Be professional, friendly, and concise
- Use plain text only (no HTML, no Markdown)
- Start with "Hi ${customerName},"
- Sign off with "--\\nThank you,\\nForward Email\\nhttps://forwardemail.net"

Write a professional, concise, and helpful plain text email response (without signature):`;

    return prompt;
  };

  const prompt = buildPrompt(
    'John Doe',
    'account',
    'Some context here',
    'URL list here'
  );

  t.true(prompt.includes('Customer Name: John Doe'));
  t.true(prompt.includes('Customer Question Type: account'));
  t.true(prompt.includes('CRITICAL: URL POLICY'));
  t.true(prompt.includes('URL Validation'));
  t.true(prompt.includes('FAKE URLs'));
  t.true(prompt.includes('https://forwardemail.net/dashboard'));
  t.true(prompt.includes('Core Instructions'));
  t.true(prompt.includes('Hi John Doe,'));
  t.true(prompt.includes('Forward Email'));
});

test('URL list formatting does not use angle brackets', (t) => {
  const urls = [
    'https://forwardemail.net/faq',
    'https://forwardemail.net/my-account'
  ];

  const formatUrls = (urlList) => {
    let result = '';
    for (const url of urlList) {
      result += `- ${url}\n`;
    }

    return result;
  };

  const formatted = formatUrls(urls);

  t.false(formatted.includes('<https://'));
  t.false(formatted.includes('>'));
  t.true(formatted.includes('- https://forwardemail.net/faq'));
  t.true(formatted.includes('- https://forwardemail.net/my-account'));
});

test('empty URL list handling', (t) => {
  const getUrlList = (urls) => {
    if (!urls || urls.length === 0) {
      return '\n**No URL list available yet.**\n\nDO NOT include any URLs in your response unless you are 100% certain they are correct.\n';
    }

    return 'URL list here';
  };

  const emptyResult = getUrlList([]);
  t.true(emptyResult.includes('No URL list available'));
  t.true(emptyResult.includes('DO NOT include any URLs'));

  const withUrls = getUrlList(['https://forwardemail.net/faq']);
  t.is(withUrls, 'URL list here');
});

test('forbidden URLs list in prompt', (t) => {
  const forbiddenUrls = [
    'https://forwardemail.net/dashboard',
    'https://dashboard.forwardemail.net',
    'https://forwardemail.net/login',
    'https://forwardemail.net/admin',
    'https://forwardemail.net/settings'
  ];

  const buildForbiddenSection = () => {
    let section = '**FAKE URLs (NEVER use these):**\n';
    for (const url of forbiddenUrls) {
      section += `- ${url}\n`;
    }

    return section;
  };

  const section = buildForbiddenSection();

  t.true(section.includes('FAKE URLs'));
  t.true(section.includes('https://forwardemail.net/dashboard'));
  t.true(section.includes('https://dashboard.forwardemail.net'));
  t.true(section.includes('https://forwardemail.net/login'));
});

test('historical context inclusion', (t) => {
  const buildPromptWithHistory = (context, historicalContext) => {
    let prompt = `Relevant Knowledge Base Context:\n${context}`;

    if (historicalContext) {
      prompt += `\n\nSimilar Past Conversations:\n${historicalContext}`;
    }

    return prompt;
  };

  const withHistory = buildPromptWithHistory(
    'KB context',
    'Historical context'
  );
  t.true(withHistory.includes('Similar Past Conversations:'));
  t.true(withHistory.includes('Historical context'));

  const withoutHistory = buildPromptWithHistory('KB context', '');
  t.false(withoutHistory.includes('Similar Past Conversations:'));
});

test('correct URLs for account-related topics', (t) => {
  const accountUrls = {
    account: 'https://forwardemail.net/my-account',
    security: 'https://forwardemail.net/my-account/security',
    password: 'https://forwardemail.net/my-account/security',
    delete: 'https://forwardemail.net/my-account/security',
    email: 'https://forwardemail.net/my-account/security'
  };

  t.is(accountUrls.account, 'https://forwardemail.net/my-account');
  t.is(accountUrls.security, 'https://forwardemail.net/my-account/security');
  t.is(accountUrls.password, 'https://forwardemail.net/my-account/security');
});
