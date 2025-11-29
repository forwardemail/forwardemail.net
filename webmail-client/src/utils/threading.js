/**
 * Gmail-style email threading utilities
 *
 * This module implements conversation grouping similar to Gmail:
 * 1. Primary grouping by Message-ID, In-Reply-To, and References headers
 * 2. Fallback to normalized subject matching
 * 3. Deduplication by Message-ID
 * 4. Cross-folder threading (Inbox + Sent + Archive)
 */

/**
 * Normalize a subject line for comparison
 * Removes Re:, Fwd:, etc. prefixes and extra whitespace
 */
export function normalizeSubject(subject) {
  if (!subject || typeof subject !== 'string') return '';

  let normalized = subject.trim();

  // Remove common reply/forward prefixes (case insensitive, localized)
  const prefixes = [
    'Re:', 'RE:', 're:',
    'Fwd:', 'FW:', 'Fw:', 'Forward:', 'FWD:', 'fwd:',
    'AW:', 'Aw:', 'aw:', // German
    'SV:', 'Sv:', 'sv:', // Swedish
    'VS:', 'Vs:', 'vs:', // Norwegian
    'R:', 'RIF:', 'Rif:', // Italian
    'Enc:', 'ENC:', // Spanish
    'Antw:', 'ANTW:', // Dutch
    'TR:', 'Tr:', 'tr:', // Turkish
    'Ref:', 'REF:', 'ref:' // Reference
  ];

  let changed = true;
  while (changed) {
    changed = false;
    const before = normalized;

    for (const prefix of prefixes) {
      // Handle multiple prefixes like "Re: Re: Fwd:"
      const regex = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
      normalized = normalized.replace(regex, '');
    }

    // Remove brackets like [External], [SPAM], etc.
    normalized = normalized.replace(/^\[[^\]]*\]\s*/g, '');

    // Trim whitespace
    normalized = normalized.trim();

    if (normalized !== before) {
      changed = true;
    }
  }

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Extract email address from various formats
 * "John Doe <john@example.com>" -> "john@example.com"
 */
export function extractEmail(address) {
  if (!address) return '';

  if (typeof address === 'object') {
    return address.address || address.email || address.Email || '';
  }

  if (typeof address !== 'string') return '';

  const match = address.match(/<([^>]+)>/);
  if (match) return match[1].trim().toLowerCase();

  return address.trim().toLowerCase();
}

/**
 * Parse References header into array of Message-IDs
 */
export function parseReferences(references) {
  if (!references) return [];

  if (Array.isArray(references)) return references;

  if (typeof references !== 'string') return [];

  // References format: "<msg1@domain> <msg2@domain> <msg3@domain>"
  const matches = references.match(/<[^>]+>/g);
  if (!matches) return [];

  return matches.map(ref => ref.trim());
}

/**
 * Generate a stable conversation ID from message headers
 *
 * Priority:
 * 1. Root Message-ID from References chain (oldest)
 * 2. In-Reply-To header
 * 3. Normalized subject + date proximity
 * 4. Message-ID itself (new conversation)
 */
export function getConversationId(message) {
  // Extract headers
  const messageId = message.message_id || message.messageId || message['Message-ID'] || message.id;
  const inReplyTo = message.in_reply_to || message.inReplyTo || message['In-Reply-To'];
  const references = parseReferences(message.references || message.References);

  // 1. Use root of References chain (first/oldest message)
  if (references.length > 0) {
    return simpleHash(references[0]);
  }

  // 2. Use In-Reply-To
  if (inReplyTo) {
    return simpleHash(inReplyTo);
  }

  // 3. Fallback to normalized subject
  const subject = message.subject || message.Subject || '';
  if (subject) {
    const normalized = normalizeSubject(subject);
    if (normalized) {
      return simpleHash(normalized);
    }
  }

  // 4. Use Message-ID itself (new conversation)
  if (messageId) {
    return simpleHash(messageId);
  }

  // Last resort: use message UID
  return simpleHash(message.id || message.uid || message.Uid || String(Date.now()));
}

/**
 * Simple string hash function for generating conversation IDs
 */
function simpleHash(str) {
  if (!str) return '0';

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Group messages into conversations
 *
 * @param {Array} messages - Array of message objects
 * @returns {Array} Array of conversation objects
 */
export function groupIntoConversations(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [];
  }

  // Map to store conversations by ID
  const conversationMap = new Map();

  // First pass: assign conversation IDs and group messages
  for (const message of messages) {
    const convId = getConversationId(message);

    if (!conversationMap.has(convId)) {
      conversationMap.set(convId, {
        id: convId,
        messages: [],
        subject: normalizeSubject(message.subject || message.Subject || ''),
        participants: new Set(),
        hasUnread: false,
        hasAttachment: false,
        latestDate: null,
        messageCount: 0
      });
    }

    const conversation = conversationMap.get(convId);
    conversation.messages.push(message);
    conversation.messageCount++;

    // Track participants
    const from = extractEmail(message.from || message.From);
    if (from) conversation.participants.add(from);

    // Track unread status
    if (message.is_unread) {
      conversation.hasUnread = true;
    }

    // Track attachments
    if (message.has_attachment) {
      conversation.hasAttachment = true;
    }

    // Track latest date
    const messageDate = new Date(message.date || message.Date || 0);
    if (!conversation.latestDate || messageDate > conversation.latestDate) {
      conversation.latestDate = messageDate;
    }
  }

  // Second pass: sort messages within each conversation chronologically
  for (const conversation of conversationMap.values()) {
    conversation.messages.sort((a, b) => {
      const dateA = new Date(a.date || a.Date || 0);
      const dateB = new Date(b.date || b.Date || 0);
      return dateA - dateB; // Oldest first
    });

    // Convert participants Set to Array
    conversation.participants = Array.from(conversation.participants);

    // Get the display subject from the first message with a subject
    const messageWithSubject = conversation.messages.find(m => m.subject || m.Subject);
    if (messageWithSubject) {
      conversation.displaySubject = messageWithSubject.subject || messageWithSubject.Subject;
    } else {
      conversation.displaySubject = '(No subject)';
    }

    // Get snippet from latest message
    const latestMessage = conversation.messages[conversation.messages.length - 1];
    conversation.snippet = latestMessage.snippet || latestMessage.preview || '';

    // Get latest sender
    conversation.latestFrom = latestMessage.from || latestMessage.From || 'Unknown';
  }

  // Convert map to array and sort by latest date (newest first)
  const conversations = Array.from(conversationMap.values());
  conversations.sort((a, b) => {
    if (!a.latestDate) return 1;
    if (!b.latestDate) return -1;
    return b.latestDate - a.latestDate; // Newest first
  });

  return conversations;
}

/**
 * Deduplicate messages by Message-ID
 * Useful when same message appears in multiple folders (Sent/Inbox)
 */
export function deduplicateMessages(messages) {
  if (!Array.isArray(messages)) return [];

  const seen = new Set();
  const unique = [];

  for (const message of messages) {
    const messageId = message.message_id || message.messageId || message['Message-ID'];

    if (!messageId) {
      // No Message-ID, keep it (shouldn't happen but be safe)
      unique.push(message);
      continue;
    }

    if (seen.has(messageId)) {
      // Duplicate found, skip it
      continue;
    }

    seen.add(messageId);
    unique.push(message);
  }

  return unique;
}

/**
 * Build a conversation tree structure (for nested display)
 *
 * @param {Array} messages - Messages in a conversation (should be pre-sorted)
 * @returns {Object} Tree structure with parent/child relationships
 */
export function buildConversationTree(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { root: [], messageMap: new Map() };
  }

  const messageMap = new Map();
  const root = [];

  // First pass: create nodes
  for (const message of messages) {
    const node = {
      message,
      children: [],
      parent: null
    };

    const messageId = message.message_id || message.messageId || message['Message-ID'] || message.id;
    messageMap.set(messageId, node);
  }

  // Second pass: build tree
  for (const message of messages) {
    const messageId = message.message_id || message.messageId || message['Message-ID'] || message.id;
    const node = messageMap.get(messageId);

    const inReplyTo = message.in_reply_to || message.inReplyTo || message['In-Reply-To'];

    if (inReplyTo) {
      const parentNode = messageMap.get(inReplyTo);
      if (parentNode) {
        node.parent = parentNode;
        parentNode.children.push(node);
      } else {
        // Parent not in this conversation, treat as root
        root.push(node);
      }
    } else {
      // No parent, it's a root message
      root.push(node);
    }
  }

  return { root, messageMap };
}

/**
 * Flatten a conversation tree for display
 * Useful for Gmail-style collapsed/expanded view
 */
export function flattenConversationTree(tree) {
  const flattened = [];

  function traverse(node, depth = 0) {
    flattened.push({
      ...node.message,
      depth,
      hasChildren: node.children.length > 0
    });

    for (const child of node.children) {
      traverse(child, depth + 1);
    }
  }

  for (const rootNode of tree.root) {
    traverse(rootNode);
  }

  return flattened;
}
