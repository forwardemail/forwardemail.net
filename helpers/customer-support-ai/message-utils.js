/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Shared utilities for extracting information from message objects
 * Handles various message formats from Forward Email API and nodemailer
 */

/**
 * Extract sender email address from message
 * @param {Object} message - Message object
 * @returns {string} Sender email address
 */
function extractSenderEmail(message) {
  // Try nodemailer.headers.from.value[0].address (most reliable)
  if (message.nodemailer?.headers?.from?.value?.[0]?.address) {
    return message.nodemailer.headers.from.value[0].address;
  }

  // Try nodemailer.from.value[0].address
  if (message.nodemailer?.from?.value?.[0]?.address) {
    return message.nodemailer.from.value[0].address;
  }

  // Try root level from
  if (typeof message.from === 'string') return message.from;
  if (message.from && message.from.address) return message.from.address;
  if (Array.isArray(message.from) && message.from[0]) {
    return message.from[0].address || message.from[0];
  }

  return 'unknown@example.com';
}

/**
 * Extract sender name from message
 * @param {Object} message - Message object
 * @returns {string} Sender name
 */
function extractSenderName(message) {
  // Try nodemailer.headers.from.value[0].name
  if (message.nodemailer?.headers?.from?.value?.[0]?.name) {
    return message.nodemailer.headers.from.value[0].name;
  }

  // Try nodemailer.from.value[0].name
  if (message.nodemailer?.from?.value?.[0]?.name) {
    return message.nodemailer.from.value[0].name;
  }

  // Try message.from.name
  if (message.from && message.from.name) return message.from.name;
  if (Array.isArray(message.from) && message.from[0]?.name) {
    return message.from[0].name;
  }

  // Fallback to email address without domain
  const email = extractSenderEmail(message);
  return email.split('@')[0];
}

/**
 * Extract sender full text (name + email) for email headers
 * @param {Object} message - Message object
 * @returns {string} Sender in "Name <email>" format
 */
function extractSenderText(message) {
  // Try nodemailer.headers.from.text (most complete)
  if (message.nodemailer?.headers?.from?.text) {
    return message.nodemailer.headers.from.text;
  }

  // Try nodemailer.from.text
  if (message.nodemailer?.from?.text) {
    return message.nodemailer.from.text;
  }

  // Construct from name and email
  const name = extractSenderName(message);
  const email = extractSenderEmail(message);

  // If name is just the email prefix, return email only
  if (name === email.split('@')[0]) {
    return email;
  }

  return `${name} <${email}>`;
}

/**
 * Extract recipient email addresses from message
 * @param {Object} message - Message object
 * @returns {Array<string>} Array of recipient email addresses
 */
function extractRecipients(message) {
  const recipients = [];

  // Try nodemailer.to
  if (message.nodemailer?.to?.value) {
    for (const recipient of message.nodemailer.to.value) {
      if (recipient.address) recipients.push(recipient.address);
    }
  }

  // Try root level to
  if (message.to) {
    if (typeof message.to === 'string') {
      recipients.push(message.to);
    } else if (Array.isArray(message.to)) {
      for (const recipient of message.to) {
        if (typeof recipient === 'string') {
          recipients.push(recipient);
        } else if (recipient.address) {
          recipients.push(recipient.address);
        }
      }
    } else if (message.to.address) {
      recipients.push(message.to.address);
    }
  }

  return [...new Set(recipients)]; // Remove duplicates
}

/**
 * Extract CC email addresses from message
 * @param {Object} message - Message object
 * @returns {Array<string>} Array of CC email addresses
 */
function extractCC(message) {
  const ccList = [];

  // Try nodemailer.cc
  if (message.nodemailer?.cc?.value) {
    for (const recipient of message.nodemailer.cc.value) {
      if (recipient.address) ccList.push(recipient.address);
    }
  }

  // Try root level cc
  if (message.cc) {
    if (typeof message.cc === 'string') {
      ccList.push(message.cc);
    } else if (Array.isArray(message.cc)) {
      for (const recipient of message.cc) {
        if (typeof recipient === 'string') {
          ccList.push(recipient);
        } else if (recipient.address) {
          ccList.push(recipient.address);
        }
      }
    } else if (message.cc.address) {
      ccList.push(message.cc.address);
    }
  }

  return [...new Set(ccList)]; // Remove duplicates
}

/**
 * Extract Reply-To email address from message
 * @param {Object} message - Message object
 * @returns {string|null} Reply-To email address or null
 */
function extractReplyTo(message) {
  // Try nodemailer.replyTo
  if (message.nodemailer?.replyTo?.value?.[0]?.address) {
    return message.nodemailer.replyTo.value[0].address;
  }

  // Try nodemailer.headers.reply-to
  if (message.nodemailer?.headers?.['reply-to']?.value?.[0]?.address) {
    return message.nodemailer.headers['reply-to'].value[0].address;
  }

  // Try root level replyTo
  if (message.replyTo) {
    if (typeof message.replyTo === 'string') return message.replyTo;
    if (message.replyTo.address) return message.replyTo.address;
    if (Array.isArray(message.replyTo) && message.replyTo[0]) {
      return message.replyTo[0].address || message.replyTo[0];
    }
  }

  return null;
}

/**
 * Build reply recipients following email reply standards
 * @param {Object} message - Original message object
 * @param {string} ourAddress - Our email address (to exclude from CC)
 * @returns {Object} { to, cc } reply recipients
 */
function buildReplyRecipients(message, ourAddress) {
  const replyTo = extractReplyTo(message);
  const originalFrom = extractSenderEmail(message);
  const originalTo = extractRecipients(message);
  const originalCC = extractCC(message);

  let to;
  let cc = [];

  // If Reply-To exists, use it as To and add original From to CC
  if (replyTo && replyTo !== originalFrom) {
    to = replyTo;
    cc.push(originalFrom);
  } else {
    // Otherwise, reply to original From
    to = originalFrom;
  }

  // Add all original To recipients to CC (except our address)
  for (const recipient of originalTo) {
    if (recipient !== ourAddress && recipient !== to) {
      cc.push(recipient);
    }
  }

  // Add all original CC recipients to CC (except our address)
  for (const recipient of originalCC) {
    if (recipient !== ourAddress && recipient !== to) {
      cc.push(recipient);
    }
  }

  // Remove duplicates and filter out empty values
  cc = [...new Set(cc)].filter(Boolean);

  return { to, cc };
}

module.exports = {
  extractSenderEmail,
  extractSenderName,
  extractSenderText,
  extractRecipients,
  extractCC,
  extractReplyTo,
  buildReplyRecipients
};
