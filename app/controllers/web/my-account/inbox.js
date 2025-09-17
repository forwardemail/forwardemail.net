/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const { ImapFlow } = require('imapflow');

const Messages = require('#models/messages');
const Mailboxes = require('#models/mailboxes');
const Aliases = require('#models/aliases');
const Users = require('#models/users');
const Domains = require('#models/domains');
const setupAuthSession = require('#helpers/setup-auth-session');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const { decrypt } = require('#helpers/encrypt-decrypt');
const _ = require('#helpers/lodash');

// IMAP operation helpers
const onMove = require('#helpers/imap/on-move');
const onExpunge = require('#helpers/imap/on-expunge');
const pify = require('pify');

const onMovePromise = pify(onMove, { multiArgs: true });
const onExpungePromise = pify(onExpunge, { multiArgs: true });

// Mailbox path to folder mapping
const FOLDER_MAPPING = {
  inbox: 'INBOX',
  sent: 'Sent Mail',
  drafts: 'Drafts',
  trash: 'Trash',
  spam: 'Junk'
};

const SPECIAL_USE_MAPPING = {
  '\\Inbox': 'inbox',
  '\\Sent': 'sent',
  '\\Drafts': 'drafts',
  '\\Trash': 'trash',
  '\\Junk': 'spam'
};

async function ensureAuthenticated(ctx) {
  // Check if user is already authenticated via web session
  if (ctx.isAuthenticated && ctx.isAuthenticated()) {
    // Load user with email settings and preferences
    const user = await Users.findById(ctx.state.user._id)
      .populate({
        path: 'email_client_preferences.selected_alias_id',
        populate: { path: 'domain', select: 'name' }
      })
      .lean();

    if (!user) {
      throw Boom.unauthorized('User not found');
    }

    // Check if user has email settings configured
    if (!user.email_settings || !user.email_settings.encrypted_password) {
      if (ctx.accepts('html')) {
        ctx.flash('custom', {
          title: 'Email Setup Required',
          text: 'Please configure your email settings first to access your mailbox.',
          type: 'info',
          toast: true,
          timer: 5000
        });
        return ctx.redirect('/my-account/email-settings?setup=true');
      }
      throw Boom.badRequest('Email settings required');
    }

    ctx.state.user = user;
    return;
  }

  // If not web authenticated, check for alias credentials
  if (ctx.request.body && ctx.request.body.email && ctx.request.body.password) {
    try {
      await setupAuthSession.call(
        ctx.instance,
        ctx,
        ctx.request.body.email,
        ctx.request.body.password
      );
      return;
    } catch (err) {
      ctx.logger.error(err);
      throw Boom.unauthorized('Invalid email or password');
    }
  }

  // Redirect to login if no authentication
  if (ctx.accepts('html')) {
    ctx.session.returnTo = ctx.originalUrl;
    return ctx.redirect('/auth/login');
  }

  throw Boom.unauthorized('Authentication required');
}

// Helper function to initialize IMAP connection
async function initializeImapConnection(ctx) {
  const { email_settings } = ctx.state.user;

  if (!email_settings) {
    throw Boom.badRequest('Email settings not configured');
  }

  try {
    const alias = await Aliases.findById(email_settings.alias_id).populate('domain');
    if (!alias) {
      throw Boom.badRequest('Selected alias not found');
    }

    const password = decrypt(email_settings.encrypted_password);

    const imap = new ImapFlow({
      host: email_settings.imap_host,
      port: email_settings.imap_port,
      secure: true,
      auth: {
        user: alias.name + '@' + alias.domain.name,
        pass: password
      },
      logger: false
    });

    ctx.state.imapConnection = imap;
    ctx.state.currentAlias = alias;
    return imap;
  } catch (err) {
    ctx.logger.error('Failed to initialize IMAP connection:', err);
    throw Boom.badImplementation('Could not connect to email server');
  }
}

// Helper function to get folder icons
function getFolderIcon(folderKey) {
  const icons = {
    inbox: 'fa-inbox',
    sent: 'fa-paper-plane',
    drafts: 'fa-edit',
    trash: 'fa-trash',
    spam: 'fa-exclamation-triangle'
  };
  return icons[folderKey] || 'fa-folder';
}

async function getMailboxes(ctx) {
  // Get user's aliases to determine available mailboxes
  if (!ctx.state.user) {
    throw Boom.unauthorized('User required');
  }

  try {
    // Get user's aliases that have passwords generated (needed for email client)
    const aliases = await Aliases.find({
      user: ctx.state.user._id,
      is_enabled: true,
      has_imap: true
    }).populate('domain').lean().exec();

    if (!aliases || aliases.length === 0) {
      // User doesn't have any aliases with IMAP enabled
      // Show a friendly message directing them to set up email
      return [
        {
          key: 'setup',
          path: 'Setup Required',
          name: 'Email Setup Required',
          specialUse: null,
          unreadCount: 0,
          _id: 'setup',
          isSetupRequired: true,
          icon: 'fa-cog'
        }
      ];
    }

    // For now, return a basic folder structure
    // TODO: This should integrate with the actual SQLite database once password is available
    return [
      {
        key: 'inbox',
        path: 'INBOX',
        name: 'INBOX',
        specialUse: '\\Inbox',
        unreadCount: 0,
        _id: 'inbox',
        icon: getFolderIcon('inbox')
      },
      {
        key: 'sent',
        path: 'Sent Mail',
        name: 'Sent Mail',
        specialUse: '\\Sent',
        unreadCount: 0,
        _id: 'sent',
        icon: getFolderIcon('sent')
      },
      {
        key: 'drafts',
        path: 'Drafts',
        name: 'Drafts',
        specialUse: '\\Drafts',
        unreadCount: 0,
        _id: 'drafts',
        icon: getFolderIcon('drafts')
      },
      {
        key: 'trash',
        path: 'Trash',
        name: 'Trash',
        specialUse: '\\Trash',
        unreadCount: 0,
        _id: 'trash',
        icon: getFolderIcon('trash')
      },
      {
        key: 'spam',
        path: 'Spam',
        name: 'Spam',
        specialUse: '\\Junk',
        unreadCount: 0,
        _id: 'spam',
        icon: getFolderIcon('spam')
      }
    ];

  } catch (err) {
    ctx.logger.error('Failed to get mailboxes', err);
    throw Boom.badImplementation('Failed to load mailboxes');
  }
}

async function listMessages(ctx) {
  await ensureAuthenticated(ctx);

  // Handle alias switching via URL parameter
  if (ctx.query.switch_alias) {
    try {
      ctx.logger.info(`Attempting to switch alias: ${ctx.query.switch_alias} for user: ${ctx.state.user._id}`);

      // Verify user has access to this alias
      const alias = await Aliases.findOne({
        _id: ctx.query.switch_alias,
        user: ctx.state.user._id,
        is_enabled: true,
        has_imap: true
      }).populate('domain', 'name');

      if (alias) {
        ctx.logger.info(`Alias found: ${alias.name}@${alias.domain.name}, updating user preferences`);

        // Update user's email client preferences
        const updateResult = await Users.findByIdAndUpdate(
          ctx.state.user._id,
          {
            $set: {
              'email_client_preferences.selected_alias_id': ctx.query.switch_alias,
              'email_client_preferences.updated_at': new Date()
            }
          },
          { new: true }
        );

        ctx.logger.info(`User update success: ${!!updateResult}, new selected ID: ${updateResult?.email_client_preferences?.selected_alias_id?.toString()}`);

        // Update the user in ctx.state so subsequent code sees the change
        if (updateResult) {
          ctx.state.user = updateResult;
        }

        ctx.flash('success', `Switched to ${alias.name}@${alias.domain.name}`);
      } else {
        ctx.logger.warn('Alias not found or access denied');
        ctx.flash('error', 'Invalid alias or access denied');
      }
    } catch (err) {
      ctx.logger.error('Failed to switch alias via URL:', err);
      ctx.flash('error', 'Failed to switch alias');
    }

    // Redirect to clean URL without the switch_alias parameter
    const cleanUrl = ctx.path + (ctx.query.page ? `?page=${ctx.query.page}` : '');
    return ctx.redirect(cleanUrl);
  }

  const folder = ctx.params.folder || 'inbox';
  const page = Math.max(1, parseInt(ctx.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(ctx.query.limit) || 25));
  const searchQuery = ctx.query.q; // Get search query parameter

  try {
    // Get user's mailboxes
    const mailboxes = await getMailboxes(ctx);
    const currentMailbox = mailboxes.find(m => m.key === folder) ||
                          mailboxes.find(m => m.specialUse === '\\Inbox') ||
                          mailboxes[0];

    if (!currentMailbox) {
      throw Boom.notFound('Mailbox not found');
    }

    // Initialize IMAP connection and fetch real messages
    let transformedMessages = [];
    let totalCount = 0;

    try {
      const imap = await initializeImapConnection(ctx);
      await imap.connect();

      // Open the mailbox
      const folderPath = FOLDER_MAPPING[folder] || 'INBOX';
      const mailboxInfo = await imap.mailboxOpen(folderPath);
      totalCount = mailboxInfo.exists || 0;

      if (totalCount > 0) {
        // Calculate pagination
        const start = Math.max(1, totalCount - ((page - 1) * limit) - limit + 1);
        const end = Math.max(1, totalCount - ((page - 1) * limit));

        // Fetch messages with pagination
        const fetchOptions = {
          envelope: true,
          flags: true,
          size: true,
          uid: true,
          bodyPeek: { key: 'HEADER.FIELDS', fields: ['subject', 'from', 'to', 'date'] }
        };

        // Apply search if provided
        let sequence = `${start}:${end}`;
        if (searchQuery && isSANB(searchQuery)) {
          // Use IMAP search for better performance
          const searchResults = await imap.search({
            body: searchQuery
          });
          if (searchResults.length > 0) {
            sequence = searchResults.slice(-limit).join(',');
          } else {
            transformedMessages = [];
            totalCount = 0;
          }
        }

        if (totalCount > 0 && (!searchQuery || transformedMessages.length === 0)) {
          const messages = [];
          for await (const message of imap.fetch(sequence, fetchOptions)) {
            messages.push(transformImapMessage(message));
          }
          transformedMessages = messages.reverse(); // Show newest first
        }
      }

      await imap.logout();
    } catch (err) {
      ctx.logger.warn('IMAP connection failed (expected for test domains):', err.message);
      // Fall back to empty list on IMAP errors
      transformedMessages = [];
      totalCount = 0;

      // Only show error message for real IMAP connection failures, not test domain DNS errors
      if (ctx.accepts('html') && !err.message.includes('ENOTFOUND') && !err.message.includes('test-domain')) {
        ctx.flash('error', 'Unable to connect to email server. Please check your email settings.');
      }
    }

    // Refresh user from database to ensure we have latest preferences
    try {
      const freshUser = await Users.findById(ctx.state.user._id).lean();
      if (freshUser) {
        ctx.state.user = freshUser;
        ctx.logger.info(`Refreshed user from database, selected alias ID: ${freshUser.email_client_preferences?.selected_alias_id}`);
      }
    } catch (err) {
      ctx.logger.error('Failed to refresh user:', err);
    }

    // Load available aliases for alias switcher
    let availableAliases = { aliases: [], current_alias_id: null };
    try {
      availableAliases = await getAvailableAliasesData(ctx);
      ctx.logger.info(`Loaded aliases for dropdown - count: ${availableAliases.aliases.length}, current: ${availableAliases.current_alias_id}`);
    } catch (err) {
      ctx.logger.error('Failed to load aliases for dropdown:', err);
    }

    ctx.state.searchQuery = searchQuery;
    ctx.state.messages = transformedMessages;
    ctx.state.currentMailbox = currentMailbox;
    ctx.state.mailboxes = mailboxes;
    ctx.state.availableAliases = availableAliases.aliases;
    ctx.state.currentAliasId = availableAliases.current_alias_id;
    ctx.state.itemCount = totalCount;
    ctx.state.pageCount = Math.ceil(totalCount / limit);
    ctx.state.currentPage = page;

    // Set pagination headers
    setPaginationHeaders(ctx, ctx.state.pageCount, page, transformedMessages.length, totalCount);

    // Render the inbox interface
    if (ctx.accepts('html')) {
      return ctx.render('my-account/inbox');
    }

    // Return JSON for AJAX requests
    ctx.body = {
      messages: transformedMessages,
      currentMailbox,
      mailboxes,
      searchQuery,
      pagination: {
        page,
        limit,
        totalCount,
        pageCount: ctx.state.pageCount
      }
    };

  } catch (err) {
    ctx.logger.error('Failed to load messages', err);
    throw Boom.badImplementation('Failed to load messages');
  }
}

// Helper function to transform IMAP message data for the UI
function transformImapMessage(message) {
  const envelope = message.envelope || {};
  const from = envelope.from?.[0] || {};
  const to = envelope.to || [];
  const subject = envelope.subject || '(no subject)';

  // Parse flags
  const flags = message.flags || new Set();
  const isUnread = !flags.has('\\Seen');
  const isFlagged = flags.has('\\Flagged');

  return {
    id: message.uid,
    uid: message.uid,
    subject,
    from: {
      name: from.name || '',
      address: from.address || ''
    },
    to: Array.isArray(to) ? to.map(addr => ({
      name: addr.name || '',
      address: addr.address || ''
    })) : [],
    date: envelope.date || new Date(),
    size: message.size || 0,
    unread: isUnread,
    flagged: isFlagged,
    hasAttachments: false, // TODO: detect attachments from bodystructure
    isImportant: isFlagged,
    preview: '', // TODO: extract preview from body
    flags: Array.from(flags)
  };
}

// Helper function to extract preview text from message
function getMessagePreview(message) {
  // Try to get preview from message structure
  if (message.mimeTree?.parsedHeader?.subject) {
    return '';
  }

  // For now, return empty preview - this could be enhanced
  // to extract actual text content from the message
  return '';
}

// Function to switch user's selected alias
async function switchAlias(ctx) {
  await ensureAuthenticated(ctx);

  const { alias_id } = ctx.request.body;

  if (!isSANB(alias_id)) {
    throw Boom.badRequest('Alias ID required');
  }

  try {
    // Verify user has access to this alias
    const alias = await Aliases.findOne({
      _id: alias_id,
      user: ctx.state.user._id,
      is_enabled: true,
      has_imap: true
    }).populate('domain', 'name');

    if (!alias) {
      throw Boom.forbidden('Access denied to this alias or alias not found');
    }

    // Update user's email client preferences
    await Users.findByIdAndUpdate(ctx.state.user._id, {
      $set: {
        'email_client_preferences.selected_alias_id': alias_id,
        'email_client_preferences.updated_at': new Date()
      }
    });

    ctx.body = {
      success: true,
      alias: {
        _id: alias._id,
        name: alias.name,
        domain: alias.domain
      },
      message: 'Alias switched successfully'
    };

  } catch (err) {
    ctx.logger.error('Failed to switch alias:', err);
    throw Boom.badImplementation('Failed to switch alias');
  }
}

// Helper function to get aliases data (used by both server-side rendering and API)
async function getAvailableAliasesData(ctx) {
  try {
    // Get user's domains and their aliases
    const domains = await Domains.find({
      members: {
        $elemMatch: {
          user: ctx.state.user._id,
          group: { $in: ['admin', 'user'] }
        }
      }
    }).lean();

    // Get aliases for these domains
    const aliases = await Aliases.find({
      domain: { $in: domains.map(d => d._id) },
      user: ctx.state.user._id,
      is_enabled: true,
      has_imap: true
    })
    .populate('domain', 'name')
    .lean();

    // Handle case where selected_alias_id might be populated object vs string
    let currentAliasId = ctx.state.user.email_client_preferences?.selected_alias_id;

    ctx.logger.info(`Raw current alias: ${currentAliasId} (type: ${typeof currentAliasId})`);

    if (currentAliasId && typeof currentAliasId === 'object') {
      currentAliasId = currentAliasId._id || currentAliasId.toString();
    }

    const result = {
      aliases: aliases.map(alias => ({
        _id: alias._id.toString(), // Ensure ID is string
        name: alias.name,
        domain: alias.domain,
        email: `${alias.name}@${alias.domain.name}`
      })),
      current_alias_id: currentAliasId ? currentAliasId.toString() : null
    };

    ctx.logger.info(`Final alias data - current ID: ${result.current_alias_id}, count: ${result.aliases.length}`);

    return result;

  } catch (err) {
    ctx.logger.error('Failed to get available aliases:', err);
    throw Boom.badImplementation('Failed to load aliases');
  }
}

// Function to get available aliases for current user (API endpoint)
async function getAvailableAliases(ctx) {
  await ensureAuthenticated(ctx);

  try {
    const aliasData = await getAvailableAliasesData(ctx);
    ctx.body = aliasData;
  } catch (err) {
    if (err.isBoom) throw err;
    ctx.logger.error('Failed to get available aliases:', err);
    throw Boom.badImplementation('Failed to load aliases');
  }
}

async function getMessage(ctx) {
  await ensureAuthenticated(ctx);

  const messageId = ctx.params.id;

  if (!messageId) {
    throw Boom.badRequest('Message ID required');
  }

  try {
    // Query specific message from Messages model
    const message = await Messages.findOne(
      ctx.instance,
      ctx.state.session,
      {
        _id: messageId,
        undeleted: true
      }
    );

    if (!message) {
      throw Boom.notFound('Message not found');
    }

    // Transform message for UI display
    const transformedMessage = transformMessageForUI(message);

    // Mark message as read if it's unread
    if (message.unseen) {
      try {
        // Add \Seen flag to mark as read
        const updatedFlags = [...(message.flags || [])];
        if (!updatedFlags.includes('\\Seen')) {
          updatedFlags.push('\\Seen');
        }

        await Messages.findOneAndUpdate(
          ctx.instance,
          ctx.state.session,
          { _id: messageId },
          {
            flags: updatedFlags,
            unseen: false
          }
        );

        transformedMessage.unread = false;
        transformedMessage.flags = updatedFlags;
      } catch (err) {
        ctx.logger.warn('Failed to mark message as read', err);
      }
    }

    // Get message content for display
    if (message.mimeTree) {
      transformedMessage.html = extractHtmlContent(message.mimeTree);
      transformedMessage.text = extractTextContent(message.mimeTree);
    }

    // Process attachments
    if (message.attachments && message.attachments.length > 0) {
      transformedMessage.attachments = message.attachments.map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        downloadUrl: `/my-account/inbox/attachment/${message._id}/${att.id}`
      }));
    }

    ctx.state.message = transformedMessage;
    ctx.state.mailboxes = await getMailboxes(ctx);

    if (ctx.accepts('html')) {
      return ctx.render('my-account/inbox/message');
    }

    ctx.body = { message: transformedMessage };

  } catch (err) {
    ctx.logger.error('Failed to load message', err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation('Failed to load message');
  }
}

// Helper functions to extract content from MIME tree
function extractHtmlContent(mimeTree) {
  // Traverse MIME tree to find HTML content
  // This is a simplified version - the actual implementation would be more complex
  if (mimeTree.contentType === 'text/html' && mimeTree.body) {
    return mimeTree.body;
  }

  if (mimeTree.childNodes) {
    for (const child of mimeTree.childNodes) {
      const html = extractHtmlContent(child);
      if (html) return html;
    }
  }

  return null;
}

function extractTextContent(mimeTree) {
  // Traverse MIME tree to find plain text content
  if (mimeTree.contentType === 'text/plain' && mimeTree.body) {
    return mimeTree.body;
  }

  if (mimeTree.childNodes) {
    for (const child of mimeTree.childNodes) {
      const text = extractTextContent(child);
      if (text) return text;
    }
  }

  return null;
}

async function performMessageAction(ctx) {
  await ensureAuthenticated(ctx);

  const messageId = ctx.params.id;
  const action = ctx.request.body.action;
  const target = ctx.request.body.target; // For move operations

  if (!messageId) {
    throw Boom.badRequest('Message ID required');
  }

  if (!action) {
    throw Boom.badRequest('Action required');
  }

  try {
    // Get the message first to verify access
    const message = await Messages.findOne(
      ctx.instance,
      ctx.state.session,
      {
        _id: messageId,
        undeleted: true
      }
    );

    if (!message) {
      throw Boom.notFound('Message not found');
    }

    let result = { success: true };

    switch (action) {
      case 'mark_read': {
        const updatedFlags = [...(message.flags || [])];
        if (!updatedFlags.includes('\\Seen')) {
          updatedFlags.push('\\Seen');
        }

        await Messages.findOneAndUpdate(
          ctx.instance,
          ctx.state.session,
          { _id: messageId },
          {
            flags: updatedFlags,
            unseen: false
          }
        );

        result.message = 'Message marked as read';
        break;
      }

      case 'mark_unread': {
        const updatedFlags = (message.flags || []).filter(flag => flag !== '\\Seen');

        await Messages.findOneAndUpdate(
          ctx.instance,
          ctx.state.session,
          { _id: messageId },
          {
            flags: updatedFlags,
            unseen: true
          }
        );

        result.message = 'Message marked as unread';
        break;
      }

      case 'move': {
        if (!target) {
          throw Boom.badRequest('Target mailbox required for move action');
        }

        // Find target mailbox
        const targetMailbox = await Mailboxes.findOne(
          ctx.instance,
          ctx.state.session,
          {
            $or: [
              { path: FOLDER_MAPPING[target] || target },
              { specialUse: getSpecialUseFromTarget(target) }
            ]
          }
        );

        if (!targetMailbox) {
          throw Boom.notFound('Target mailbox not found');
        }

        // Use IMAP MOVE operation
        try {
          await onMovePromise.call(
            ctx.instance,
            {
              user: ctx.state.session.user,
              mailbox: message.mailbox,
              target: targetMailbox._id,
              messages: [{ uid: message.uid }]
            },
            ctx.state.session
          );

          result.message = `Message moved to ${targetMailbox.path}`;
        } catch (err) {
          ctx.logger.error('IMAP move failed', err);
          // Fallback: update message mailbox directly
          await Messages.findOneAndUpdate(
            ctx.instance,
            ctx.state.session,
            { _id: messageId },
            { mailbox: targetMailbox._id }
          );

          result.message = `Message moved to ${targetMailbox.path}`;
        }
        break;
      }

      case 'delete': {
        // Mark message as deleted (move to trash or permanent delete)
        const trashMailbox = await Mailboxes.findOne(
          ctx.instance,
          ctx.state.session,
          { specialUse: '\\Trash' }
        );

        if (trashMailbox && message.mailbox.toString() !== trashMailbox._id.toString()) {
          // Move to trash
          try {
            await onMovePromise.call(
              ctx.instance,
              {
                user: ctx.state.session.user,
                mailbox: message.mailbox,
                target: trashMailbox._id,
                messages: [{ uid: message.uid }]
              },
              ctx.state.session
            );

            result.message = 'Message moved to trash';
          } catch (err) {
            ctx.logger.error('IMAP move to trash failed', err);
            // Fallback: update directly
            await Messages.findOneAndUpdate(
              ctx.instance,
              ctx.state.session,
              { _id: messageId },
              { mailbox: trashMailbox._id }
            );

            result.message = 'Message moved to trash';
          }
        } else {
          // Permanent delete (already in trash or no trash folder)
          try {
            await onExpungePromise.call(
              ctx.instance,
              {
                user: ctx.state.session.user,
                mailbox: message.mailbox,
                messages: [{ uid: message.uid }]
              },
              ctx.state.session
            );

            result.message = 'Message deleted permanently';
          } catch (err) {
            ctx.logger.error('IMAP expunge failed', err);
            // Fallback: mark as deleted
            await Messages.findOneAndUpdate(
              ctx.instance,
              ctx.state.session,
              { _id: messageId },
              { undeleted: false }
            );

            result.message = 'Message deleted';
          }
        }
        break;
      }

      default:
        throw Boom.badRequest(`Unknown action: ${action}`);
    }

    ctx.body = result;

  } catch (err) {
    ctx.logger.error('Failed to perform message action', err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation('Failed to perform action');
  }
}

// Helper function to map target names to special use flags
function getSpecialUseFromTarget(target) {
  const mapping = {
    trash: '\\Trash',
    spam: '\\Junk',
    junk: '\\Junk',
    sent: '\\Sent',
    drafts: '\\Drafts',
    inbox: '\\Inbox'
  };

  return mapping[target.toLowerCase()] || null;
}

async function composeMessage(ctx) {
  await ensureAuthenticated(ctx);

  // GET: Show compose form
  if (ctx.method === 'GET') {
    ctx.state.mailboxes = await getMailboxes(ctx);

    // Handle reply/forward contexts
    const replyTo = ctx.query.reply;
    const forwardId = ctx.query.forward;

    if (replyTo) {
      // Load original message for reply context
      try {
        const originalMessage = await Messages.findOne(
          ctx.instance,
          ctx.state.session,
          { _id: replyTo, undeleted: true }
        );

        if (originalMessage) {
          ctx.state.replyTo = transformMessageForUI(originalMessage);
        }
      } catch (err) {
        ctx.logger.warn('Failed to load reply context', err);
      }
    }

    if (forwardId) {
      // Load original message for forward context
      try {
        const originalMessage = await Messages.findOne(
          ctx.instance,
          ctx.state.session,
          { _id: forwardId, undeleted: true }
        );

        if (originalMessage) {
          ctx.state.forwardMessage = transformMessageForUI(originalMessage);
        }
      } catch (err) {
        ctx.logger.warn('Failed to load forward context', err);
      }
    }

    // Get user's aliases for "from" dropdown
    const aliases = await Aliases.find({
      user: ctx.state.user._id,
      has_smtp: true
    }).populate('domain').lean();

    ctx.state.aliases = aliases;

    return ctx.render('my-account/inbox/compose');
  }

  // POST: Send message
  if (ctx.method === 'POST') {
    const { to, cc, bcc, subject, body, from } = ctx.request.body;

    if (!to || !subject || !body) {
      throw Boom.badRequest('To, subject, and message body are required');
    }

    if (!from) {
      throw Boom.badRequest('From address is required');
    }

    try {
      // Find the sending alias
      const sendingAlias = await Aliases.findOne({
        _id: from,
        user: ctx.state.user._id,
        has_smtp: true
      }).populate('domain');

      if (!sendingAlias) {
        throw Boom.badRequest('Invalid sending address');
      }

      // Use existing email sending infrastructure (similar to current SMTP system)
      // This would integrate with the existing email sending pipeline
      const emailMessage = {
        from: `${sendingAlias.name}@${sendingAlias.domain.name}`,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        html: body, // Rich text content
        text: body.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
      };

      // Create email using the existing SMTP infrastructure
      const emailHelper = require('#helpers/email');

      try {
        // Use the existing email helper to send through the user's SMTP
        await emailHelper({
          template: false, // Raw email, not a template
          message: {
            from: emailMessage.from,
            to: emailMessage.to,
            cc: emailMessage.cc,
            bcc: emailMessage.bcc,
            subject: emailMessage.subject,
            html: emailMessage.html,
            text: emailMessage.text
          },
          locals: {
            // No template locals needed for raw emails
          }
        });

        ctx.logger.info('Email sent successfully', {
          from: emailMessage.from,
          to: emailMessage.to,
          subject: emailMessage.subject
        });

        ctx.flash('success', ctx.translate('EMAIL_SENT_SUCCESSFULLY') || 'Email sent successfully');
      } catch (emailErr) {
        ctx.logger.error('Failed to send email via SMTP', emailErr);
        throw Boom.badImplementation('Failed to send email. Please try again.');
      }

      if (ctx.accepts('html')) {
        return ctx.redirect('/my-account/inbox');
      }

      ctx.body = { success: true, message: 'Email sent successfully' };

    } catch (err) {
      ctx.logger.error('Failed to send message', err);
      if (err.isBoom) throw err;
      throw Boom.badImplementation('Failed to send message');
    }
  }
}


async function performBulkAction(ctx) {
  await ensureAuthenticated(ctx);

  const { action, messageIds } = ctx.request.body;

  if (!action || !Array.isArray(messageIds) || messageIds.length === 0) {
    throw Boom.badRequest('Action and message IDs are required');
  }

  try {
    let results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each message ID
    for (const messageId of messageIds) {
      try {
        // Reuse the existing performMessageAction logic
        const mockCtx = {
          ...ctx,
          params: { id: messageId },
          request: { body: { action } }
        };

        // Call the existing message action handler
        await performMessageAction(mockCtx);
        results.push({ messageId, success: true });
        successCount++;
      } catch (err) {
        ctx.logger.error(`Failed to perform ${action} on message ${messageId}`, err);
        results.push({ messageId, success: false, error: err.message });
        errorCount++;
      }
    }

    ctx.body = {
      success: true,
      message: `Bulk action completed: ${successCount} successful, ${errorCount} failed`,
      results,
      stats: {
        total: messageIds.length,
        successful: successCount,
        failed: errorCount
      }
    };

  } catch (err) {
    ctx.logger.error('Failed to perform bulk action', err);
    throw Boom.badImplementation('Failed to perform bulk action');
  }
}

module.exports = {
  listMessages,
  getMessage,
  performMessageAction,
  performBulkAction,
  composeMessage,
  ensureAuthenticated,
  switchAlias,
  getAvailableAliases
};