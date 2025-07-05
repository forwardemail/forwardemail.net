/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { Buffer } = require('node:buffer');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');

const { Inquiries, Users } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');

const INQUIRY_COUNT = 50;

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

// Realistic conversation templates
const conversationTemplates = [
  {
    type: 'email_setup',
    priority: 'high',
    status: 'resolved',
    messages: [
      {
        from: 'customer',
        text: "Hi, I'm having trouble setting up my email forwarding. I followed the instructions but emails aren't being forwarded to my Gmail account. Can you help?",
        subject: 'Email forwarding not working'
      },
      {
        from: 'support',
        text: "Hello! I'd be happy to help you with your email forwarding setup. Can you please confirm:\n\n1. What domain are you trying to set up?\n2. Have you added the MX records to your DNS?\n3. What's the destination email address?\n\nThis will help me troubleshoot the issue.",
        delay: 30 // minutes
      },
      {
        from: 'customer',
        text: "Thanks for the quick response! \n\n1. Domain: mycompany.com\n2. I think I added the MX records but I'm not 100% sure\n3. Destination: john.doe@gmail.com\n\nI'm not very technical, so I might have missed something.",
        delay: 45
      },
      {
        from: 'support',
        text: "No worries! Let me check your DNS records. I can see that your MX records are partially configured but missing the priority values. Here's what you need to add:\n\n```\nmycompany.com MX 10 mx1.forwardemail.net\nmycompany.com MX 20 mx2.forwardemail.net\n```\n\nOnce you add these, it should work within 24 hours. Let me know if you need help with your DNS provider!",
        delay: 15
      },
      {
        from: 'customer',
        text: "Perfect! I updated the DNS records and it's working now. Thank you so much for your help!",
        delay: 1440 // 24 hours
      }
    ]
  },
  {
    type: 'billing_question',
    priority: 'medium',
    status: 'resolved',
    messages: [
      {
        from: 'customer',
        text: 'I was charged twice this month for my subscription. Can you please check my billing and refund the duplicate charge?',
        subject: 'Duplicate billing charge'
      },
      {
        from: 'support',
        text: "I apologize for the billing issue. Let me look into your account right away. Can you please provide:\n\n1. The email address associated with your account\n2. The approximate dates of both charges\n3. The amount charged\n\nI'll investigate and resolve this quickly.",
        delay: 20
      },
      {
        from: 'customer',
        text: 'Account email: billing@mycompany.com\nCharges: March 15th and March 16th\nAmount: $9.99 each\n\nI have the transaction IDs if you need them.',
        delay: 60
      },
      {
        from: 'support',
        text: "Thank you for the details. I found the issue - there was a payment processing error that caused a duplicate charge. I've processed a refund for $9.99 which should appear in your account within 3-5 business days.\n\nI've also added a note to prevent this from happening again. Is there anything else I can help you with?",
        delay: 25
      },
      {
        from: 'customer',
        text: "That's great, thank you for resolving this so quickly! Your support is excellent.",
        delay: 30
      }
    ]
  },
  {
    type: 'feature_request',
    priority: 'low',
    status: 'in_progress',
    messages: [
      {
        from: 'customer',
        text: 'Would it be possible to add a feature to automatically sort incoming emails into folders based on sender or subject keywords? This would be really helpful for organizing emails.',
        subject: 'Feature request: Email sorting'
      },
      {
        from: 'support',
        text: "That's a great suggestion! Email filtering and sorting is definitely something we've been considering. Currently, you can set up basic forwarding rules, but automatic folder sorting would be a nice enhancement.\n\nI've added your request to our feature backlog. Can you tell me more about your specific use case? This helps us prioritize development.",
        delay: 120
      },
      {
        from: 'customer',
        text: 'I run a small business and get emails from customers, suppliers, and newsletters. It would be great to automatically sort:\n\n- Customer emails to "Customers" folder\n- Supplier emails to "Business" folder  \n- Newsletters to "Marketing" folder\n\nMaybe based on sender domain or subject line keywords?',
        delay: 180
      },
      {
        from: 'support',
        text: "Those are excellent use cases! I've documented your specific requirements and shared them with our development team. While I can't provide a timeline yet, this type of smart filtering is definitely on our roadmap.\n\nIn the meantime, you might want to set up separate email addresses for different purposes (like orders@, support@, etc.) which can help with organization.",
        delay: 60
      }
    ]
  },
  {
    type: 'technical_issue',
    priority: 'high',
    status: 'resolved',
    messages: [
      {
        from: 'customer',
        text: "URGENT: Our email forwarding stopped working completely about 2 hours ago. We're not receiving any emails and this is affecting our business. Please help ASAP!",
        subject: 'URGENT: Email forwarding down'
      },
      {
        from: 'support',
        text: "I understand this is urgent and I'm looking into it immediately. I can see there was a temporary issue with one of our mail servers that affected some domains.\n\nI've escalated this to our infrastructure team and we're working on a fix. I'll update you every 30 minutes until this is resolved.",
        delay: 10
      },
      {
        from: 'support',
        text: "Update: We've identified the issue and implemented a fix. Your email forwarding should be restored now. We're monitoring to ensure everything is working properly.\n\nCan you please test by sending an email to confirm it's working?",
        delay: 45
      },
      {
        from: 'customer',
        text: 'Yes, I just tested and emails are flowing again. Thank you for the quick response and resolution!',
        delay: 15
      },
      {
        from: 'support',
        text: "Excellent! I'm glad we got this resolved quickly. We've also implemented additional monitoring to prevent similar issues in the future. Please don't hesitate to reach out if you experience any other problems.",
        delay: 10
      }
    ]
  },
  {
    type: 'account_setup',
    priority: 'medium',
    status: 'new',
    messages: [
      {
        from: 'customer',
        text: "Hi, I just signed up and I'm a bit confused about how to get started. I want to set up email forwarding for my domain but I'm not sure what steps to take first. Can you guide me through the process?",
        subject: 'New user - need setup help'
      }
    ]
  }
];

// Generate realistic email content
const generateEmailHtml = (text, isFromSupport = false) => {
  const signature = isFromSupport
    ? '\n\nBest regards,\nForward Email Support Team\nhttps://forwardemail.net'
    : '';

  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .signature { margin-top: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div>${text.replace(/\n/g, '<br>')}</div>
        ${
          signature
            ? `<div class="signature">${signature.replace(/\n/g, '<br>')}</div>`
            : ''
        }
      </body>
    </html>
  `;

  return Buffer.from(htmlContent);
};

const createFakeInquiry = async () => {
  const randomEmail = falso.randEmail();
  const randomPassword = falso.randPassword();
  const randomUsername = falso.randUserName();

  // Pick a random conversation template
  const template =
    conversationTemplates[
      Math.floor(Math.random() * conversationTemplates.length)
    ];

  console.log(`Generating user with email: ${randomEmail} (${template.type})`);

  const user = await Users.create({
    email: randomEmail,
    password: randomPassword
  });

  // Create messages array with realistic timing
  const messages = [];
  let currentTime = new Date();

  for (const [index, messageTemplate] of template.messages.entries()) {
    if (index > 0 && messageTemplate.delay) {
      currentTime = new Date(
        currentTime.getTime() + messageTemplate.delay * 60000
      );
    }

    const isFromSupport = messageTemplate.from === 'support';
    const messageText = messageTemplate.text.replace(
      /mycompany\.com/g,
      randomEmail.split('@')[1]
    );

    messages.push({
      raw: generateEmailHtml(messageText, isFromSupport),
      text: messageText,
      created_at: new Date(currentTime)
    });
  }

  // Create the inquiry with conversation history
  await Inquiries.create({
    user: user.id,
    sender_email: randomEmail,
    subject: template.messages[0].subject || `Question from ${randomUsername}`,
    message: template.messages[0].text,
    text: template.messages[0].text,
    messages,
    priority: template.priority || falso.randElement(['high', 'medium', 'low']),
    status:
      template.status || falso.randElement(['new', 'in_progress', 'resolved']),
    is_resolved: ['resolved', 'closed'].includes(template.status),
    reference: falso.randUuid().slice(0, 8).toUpperCase(),
    created_at: new Date(
      currentTime.getTime() - template.messages.length * 60 * 60000
    ), // Start conversation earlier
    updated_at: currentTime
  });
};

(async () => {
  await setupMongoose();

  console.log(
    `Generating ${INQUIRY_COUNT} inquiries with conversation history...`
  );

  for (let count = 0; count <= INQUIRY_COUNT; count++) {
    // eslint-disable-next-line no-await-in-loop
    await createFakeInquiry();

    if (count % 10 === 0) {
      console.log(`Generated ${count}/${INQUIRY_COUNT} inquiries...`);
    }
  }

  console.log('✅ Dev data generation completed!');
  process.exit(0);
})();
