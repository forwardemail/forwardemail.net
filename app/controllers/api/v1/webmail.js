/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const MailComposer = require('nodemailer/lib/mail-composer');
const ObjectID = require('bson-objectid');
const getStream = require('get-stream');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const { Builder } = require('json-sql-enhanced');
const { Iconv } = require('iconv');
const { boolean } = require('boolean');
const { simpleParser } = require('mailparser');

const Aliases = require('#models/aliases');
const AttachmentStorage = require('#helpers/attachment-storage');
const Contacts = require('#models/contacts');
const Indexer = require('#helpers/indexer');
const Mailboxes = require('#models/mailboxes');
const Messages = require('#models/messages');
const Threads = require('#models/threads');
const Users = require('#models/users');
const _ = require('#helpers/lodash');
const bytes = require('@forwardemail/bytes');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const setPaginationHeaders = require('#helpers/set-pagination-headers');

const onAppend = require('#helpers/imap/on-append');
const onExpunge = require('#helpers/imap/on-expunge');
const onMove = require('#helpers/imap/on-move');
const onStore = require('#helpers/imap/on-store');

const onAppendPromise = pify(onAppend, { multiArgs: true });
const onExpungePromise = pify(onExpunge, { multiArgs: true });
const onMovePromise = pify(onMove, { multiArgs: true });
const onStorePromise = pify(onStore, { multiArgs: true });

const builder = new Builder();
const attachmentStorage = new AttachmentStorage();
const indexer = new Indexer({
  attachmentStorage
});

//
// Helper function to find special-use mailbox (Drafts, Sent, Trash, etc.)
//
async function findSpecialMailbox(ctx, specialUse) {
  const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
    specialUse
  });

  if (!mailbox) {
    throw Boom.notFound(
      ctx.translateError('MAILBOX_DOES_NOT_EXIST', specialUse)
    );
  }

  return mailbox;
}

//
// Helper function to get message with parsed content
//
async function getMessageWithContent(ctx, messageId) {
  // Validate message ID
  if (!ObjectID.isValid(messageId)) {
    throw Boom.badRequest(ctx.translateError('MESSAGE_INVALID_ID'));
  }

  const message = await Messages.findOne(ctx.instance, ctx.state.session, {
    _id: messageId
  });

  if (!message) {
    throw Boom.notFound(ctx.translateError('MESSAGE_DOES_NOT_EXIST'));
  }

  // Get raw message content and parse it
  const { value } = indexer.getContents(
    typeof message.mimeTree === 'object'
      ? message.mimeTree
      : JSON.parse(message.mimeTree),
    false,
    {},
    ctx.instance,
    ctx.state.session
  );

  const raw = await getStream.buffer(value);
  const parsed = await simpleParser(raw, {
    Iconv,
    skipHtmlToText: true,
    skipTextLinks: true,
    skipTextToHtml: true,
    skipImageLinks: true,
    maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
  });

  return { message, parsed, raw };
}

//
// Helper function to generate quoted text for replies
//
function generateQuotedText(parsed, type = 'reply') {
  const from = parsed.from?.text || 'Unknown Sender';
  const date = parsed.date ? parsed.date.toLocaleString() : 'Unknown Date';
  const subject = parsed.subject || '(no subject)';

  let quotedHtml = '';
  let quotedText = '';

  if (type === 'reply') {
    // Generate reply quote
    quotedHtml = `<br><br><div class="gmail_quote">`;
    quotedHtml += `<div dir="ltr">On ${date}, ${from} wrote:</div>`;
    quotedHtml += `<blockquote class="gmail_quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">`;
    quotedHtml += parsed.html || parsed.textAsHtml || '';
    quotedHtml += `</blockquote></div>`;

    quotedText = `\n\nOn ${date}, ${from} wrote:\n`;
    if (parsed.text) {
      quotedText += parsed.text
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    }
  } else if (type === 'forward') {
    // Generate forward header
    quotedHtml = `<br><br>---------- Forwarded message ---------<br>`;
    quotedHtml += `From: ${from}<br>`;
    quotedHtml += `Date: ${date}<br>`;
    quotedHtml += `Subject: ${subject}<br>`;
    if (parsed.to?.text) quotedHtml += `To: ${parsed.to.text}<br>`;
    if (parsed.cc?.text) quotedHtml += `Cc: ${parsed.cc.text}<br>`;
    quotedHtml += `<br><br>`;
    quotedHtml += parsed.html || parsed.textAsHtml || '';

    quotedText = `\n\n---------- Forwarded message ---------\n`;
    quotedText += `From: ${from}\n`;
    quotedText += `Date: ${date}\n`;
    quotedText += `Subject: ${subject}\n`;
    if (parsed.to?.text) quotedText += `To: ${parsed.to.text}\n`;
    if (parsed.cc?.text) quotedText += `Cc: ${parsed.cc.text}\n`;
    quotedText += `\n${parsed.text || ''}`;
  }

  return { quotedHtml, quotedText };
}

//
// List threads in a mailbox
// GET /v1/webmail/threads/:mailbox_id
//
async function listThreads(ctx) {
  try {
    const { mailbox_id } = ctx.params;

    // Validate mailbox ID
    if (!ObjectID.isValid(mailbox_id)) {
      throw Boom.badRequest('Invalid mailbox ID');
    }

    // Get the mailbox
    const mailbox = await Mailboxes.findById(
      ctx.instance,
      ctx.state.session,
      mailbox_id
    );

    if (!mailbox) {
      throw Boom.notFound('Mailbox not found');
    }

    // Get all messages in the mailbox
    const messages = await Messages.find(
      ctx.instance,
      ctx.state.session,
      {
        mailbox: mailbox_id
      },
      {
        thread: true,
        subject: true,
        from: true,
        to: true,
        uid: true,
        flags: true,
        idate: true,
        size: true,
        ha: true // has attachments
      },
      {
        sort: '-idate' // Sort by date descending
      }
    );

    // Group messages by thread
    const threadMap = new Map();

    for (const message of messages) {
      const threadId = message.thread.toString();

      if (!threadMap.has(threadId)) {
        threadMap.set(threadId, {
          thread_id: threadId,
          subject: message.subject,
          message_count: 0,
          unread_count: 0,
          has_attachments: false,
          participants: new Set(),
          latest_date: message.idate,
          latest_from: message.from,
          messages: []
        });
      }

      const thread = threadMap.get(threadId);
      thread.message_count++;

      // Count unread messages
      if (!message.flags.includes('\\Seen')) {
        thread.unread_count++;
      }

      // Track if thread has attachments
      if (message.ha) {
        thread.has_attachments = true;
      }

      // Add participants (from + to addresses)
      if (message.from) {
        // Parse email addresses from from field
        const fromAddresses = message.from.match(/[\w.-]+@[\w.-]+/g) || [];
        fromAddresses.forEach((addr) => thread.participants.add(addr));
      }

      if (message.to) {
        const toAddresses = message.to.match(/[\w.-]+@[\w.-]+/g) || [];
        toAddresses.forEach((addr) => thread.participants.add(addr));
      }

      // Update latest message if this is newer
      if (message.idate > thread.latest_date) {
        thread.latest_date = message.idate;
        thread.latest_from = message.from;
      }

      // Add message to thread
      thread.messages.push({
        id: message._id,
        uid: message.uid,
        subject: message.subject,
        from: message.from,
        date: message.idate,
        flags: message.flags,
        size: message.size,
        has_attachments: message.ha
      });
    }

    // Convert threads map to array and sort by latest date
    const threads = Array.from(threadMap.values())
      .map((thread) => ({
        ...thread,
        participants: Array.from(thread.participants),
        // Only include message details if requested
        messages: ctx.query.include_messages === 'true' ? thread.messages : undefined
      }))
      .sort((a, b) => b.latest_date - a.latest_date);

    // Apply pagination
    const start = ctx.paginate.skip;
    const end = start + ctx.query.limit;
    const paginatedThreads = threads.slice(start, end);

    const pageCount = Math.ceil(threads.length / ctx.query.limit);

    setPaginationHeaders(
      ctx,
      pageCount,
      ctx.query.page,
      paginatedThreads.length,
      threads.length
    );

    ctx.body = paginatedThreads.map((thread) => ({
      ...thread,
      object: 'thread'
    }));
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// List drafts
// GET /v1/webmail/drafts
//
async function listDrafts(ctx) {
  try {
    // Find Drafts mailbox
    const draftsFolder = await findSpecialMailbox(ctx, '\\Drafts');

    // Get messages in Drafts folder using existing Messages model
    const query = {
      mailbox: draftsFolder._id
    };

    const [messages, itemCount] = await Promise.all([
      Messages.find(
        ctx.instance,
        ctx.state.session,
        query,
        {},
        {
          limit: ctx.query.limit,
          offset: ctx.paginate.skip,
          sort: '-idate' // Sort by internal date descending (newest first)
        }
      ),
      Messages.countDocuments(ctx.instance, ctx.state.session, query)
    ]);

    const pageCount = Math.ceil(itemCount / ctx.query.limit);

    setPaginationHeaders(
      ctx,
      pageCount,
      ctx.query.page,
      messages.length,
      itemCount
    );

    ctx.body = messages.map((msg) => ({
      id: msg.uid,
      mailbox_id: draftsFolder._id,
      subject: msg.subject,
      from: msg.from,
      to: msg.to,
      cc: msg.cc,
      date: msg.idate,
      size: msg.size,
      flags: msg.flags,
      object: 'draft'
    }));
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Create draft
// POST /v1/webmail/drafts
//
async function createDraft(ctx) {
  try {
    const { to, cc, bcc, subject, html, text, in_reply_to, references } =
      ctx.request.body;

    // Find Drafts mailbox
    const draftsFolder = await findSpecialMailbox(ctx, '\\Drafts');

    // Check if over quota
    const { isOverQuota } = await Aliases.isOverQuota(
      {
        id: ctx.state.session.user.alias_id,
        domain: ctx.state.session.user.domain_id,
        locale: ctx.locale
      },
      0,
      ctx.client
    );

    if (isOverQuota) {
      throw Boom.forbidden(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
      );
    }

    // Build message using MailComposer
    const mail = new MailComposer({
      from: ctx.state.session.user.username, // Use authenticated alias
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      inReplyTo: in_reply_to,
      references
    });

    const raw = await mail.compile().build();

    // Use onAppend to save draft to Drafts folder
    const [success, info] = await onAppendPromise.call(
      ctx.instance,
      draftsFolder._id,
      ['\\Draft'],
      new Date(),
      raw,
      ctx.state.session
    );

    if (!success) {
      throw new Error('Failed to save draft');
    }

    ctx.body = {
      id: info.uid,
      mailbox_id: draftsFolder._id,
      created_at: new Date(),
      object: 'draft'
    };
  } catch (_err) {
    // Handle multiArgs pify errors
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Update draft (auto-save)
// PUT /v1/webmail/drafts/:id
//
async function updateDraft(ctx) {
  try {
    const { id } = ctx.params;
    const { to, cc, bcc, subject, html, text, in_reply_to, references } =
      ctx.request.body;

    // Find Drafts mailbox
    const draftsFolder = await findSpecialMailbox(ctx, '\\Drafts');

    // Check if over quota
    const { isOverQuota } = await Aliases.isOverQuota(
      {
        id: ctx.state.session.user.alias_id,
        domain: ctx.state.session.user.domain_id,
        locale: ctx.locale
      },
      0,
      ctx.client
    );

    if (isOverQuota) {
      throw Boom.forbidden(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
      );
    }

    // Delete old draft (IMAP doesn't support in-place updates)
    await onExpungePromise.call(
      ctx.instance,
      draftsFolder._id,
      {
        uid: Number.parseInt(id, 10)
      },
      ctx.state.session
    );

    // Create new draft with updated content
    const mail = new MailComposer({
      from: ctx.state.session.user.username,
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      inReplyTo: in_reply_to,
      references
    });

    const raw = await mail.compile().build();

    const [success, info] = await onAppendPromise.call(
      ctx.instance,
      draftsFolder._id,
      ['\\Draft'],
      new Date(),
      raw,
      ctx.state.session
    );

    if (!success) {
      throw new Error('Failed to update draft');
    }

    ctx.body = {
      id: info.uid,
      mailbox_id: draftsFolder._id,
      updated_at: new Date(),
      object: 'draft'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Delete draft
// DELETE /v1/webmail/drafts/:id
//
async function deleteDraft(ctx) {
  try {
    const { id } = ctx.params;

    // Find Drafts mailbox
    const draftsFolder = await findSpecialMailbox(ctx, '\\Drafts');

    // Delete draft
    await onExpungePromise.call(
      ctx.instance,
      draftsFolder._id,
      {
        uid: Number.parseInt(id, 10)
      },
      ctx.state.session
    );

    ctx.body = {
      success: true,
      id,
      object: 'draft'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Send draft (move to Sent folder and trigger sending)
// POST /v1/webmail/drafts/:id/send
//
async function sendDraft(ctx) {
  try {
    const { id } = ctx.params;

    // Find Drafts and Sent mailboxes
    const [draftsFolder, sentFolder] = await Promise.all([
      findSpecialMailbox(ctx, '\\Drafts'),
      findSpecialMailbox(ctx, '\\Sent')
    ]);

    // Get the draft message
    const draftMessage = await Messages.findOne(ctx.instance, ctx.state.session, {
      uid: Number.parseInt(id, 10),
      mailbox: draftsFolder._id
    });

    if (!draftMessage) {
      throw Boom.notFound('Draft not found');
    }

    // Get the raw message content
    const { value } = indexer.getContents(
      typeof draftMessage.mimeTree === 'object'
        ? draftMessage.mimeTree
        : JSON.parse(draftMessage.mimeTree),
      false,
      {},
      ctx.instance,
      ctx.state.session
    );

    const raw = await getStream.buffer(value);

    // Parse the message to get details
    const parsed = await simpleParser(raw, {
      Iconv,
      skipHtmlToText: true,
      skipTextLinks: true,
      skipTextToHtml: true,
      skipImageLinks: true,
      maxHtmlLengthToParse: bytes(env.SMTP_MESSAGE_MAX_SIZE)
    });

    // TODO: Actual SMTP sending would go here
    // For now, we'll just move the draft to Sent folder
    // In a real implementation, you would:
    // 1. Send via SMTP using the existing email infrastructure
    // 2. Only move to Sent if sending succeeds

    // Move draft to Sent folder
    const [success] = await onMovePromise.call(
      ctx.instance,
      draftsFolder._id,
      {
        destination: sentFolder.path,
        messages: [{ uid: Number.parseInt(id, 10) }]
      },
      ctx.state.session
    );

    if (!success) {
      throw new Error('Failed to move draft to Sent folder');
    }

    // Remove Draft flag and add Seen flag
    await onStorePromise.call(
      ctx.instance,
      sentFolder._id,
      {
        messages: [Number.parseInt(id, 10)],
        action: 'remove',
        flags: ['\\Draft']
      },
      ctx.state.session
    );

    await onStorePromise.call(
      ctx.instance,
      sentFolder._id,
      {
        messages: [Number.parseInt(id, 10)],
        action: 'add',
        flags: ['\\Seen']
      },
      ctx.state.session
    );

    ctx.body = {
      success: true,
      sent_at: new Date(),
      message_id: draftMessage._id,
      sent_folder_id: sentFolder._id,
      to: parsed.to?.text,
      subject: parsed.subject,
      object: 'sent_message',
      note: 'SMTP sending not yet integrated - message moved to Sent folder'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Batch flag update
// POST /v1/webmail/batch/flags
//
async function batchFlags(ctx) {
  try {
    const { message_ids, flags, action } = ctx.request.body;

    if (!Array.isArray(message_ids) || message_ids.length === 0) {
      throw Boom.badRequest('message_ids must be a non-empty array');
    }

    if (!Array.isArray(flags) || flags.length === 0) {
      throw Boom.badRequest('flags must be a non-empty array');
    }

    if (!['add', 'remove', 'set'].includes(action)) {
      throw Boom.badRequest('action must be add, remove, or set');
    }

    // Get messages to find their mailboxes
    const messages = await Messages.find(
      ctx.instance,
      ctx.state.session,
      {
        uid: { $in: message_ids.map((id) => Number.parseInt(id, 10)) }
      },
      {
        uid: true,
        mailbox: true
      }
    );

    if (messages.length === 0) {
      throw Boom.notFound('No messages found with provided IDs');
    }

    // Group messages by mailbox for efficient batch operations
    const mailboxGroups = _.groupBy(messages, 'mailbox');

    const results = [];

    for (const [mailboxId, msgs] of Object.entries(mailboxGroups)) {
      const uids = msgs.map((m) => m.uid);

      const [success] = await onStorePromise.call(
        ctx.instance,
        mailboxId,
        {
          messages: uids,
          action,
          flags
        },
        ctx.state.session
      );

      results.push({
        mailbox_id: mailboxId,
        success,
        updated_count: uids.length
      });
    }

    ctx.body = {
      success: true,
      results,
      object: 'batch_operation'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Batch move messages
// POST /v1/webmail/batch/move
//
async function batchMove(ctx) {
  try {
    const { message_ids, target_mailbox_id } = ctx.request.body;

    if (!Array.isArray(message_ids) || message_ids.length === 0) {
      throw Boom.badRequest('message_ids must be a non-empty array');
    }

    if (!isSANB(target_mailbox_id)) {
      throw Boom.badRequest('target_mailbox_id is required');
    }

    // Check if over quota
    const { isOverQuota } = await Aliases.isOverQuota(
      {
        id: ctx.state.session.user.alias_id,
        domain: ctx.state.session.user.domain_id,
        locale: ctx.locale
      },
      0,
      ctx.client
    );

    if (isOverQuota) {
      throw Boom.forbidden(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
      );
    }

    // Get target mailbox
    const targetMailbox = await Mailboxes.findById(
      ctx.instance,
      ctx.state.session,
      target_mailbox_id
    );

    if (!targetMailbox) {
      throw Boom.notFound('Target mailbox not found');
    }

    // Get source messages
    const messages = await Messages.find(
      ctx.instance,
      ctx.state.session,
      {
        uid: { $in: message_ids.map((id) => Number.parseInt(id, 10)) }
      },
      {
        uid: true,
        mailbox: true
      }
    );

    if (messages.length === 0) {
      throw Boom.notFound('No messages found with provided IDs');
    }

    // Group by source mailbox
    const mailboxGroups = _.groupBy(messages, 'mailbox');

    const results = [];

    for (const [sourceMailboxId, msgs] of Object.entries(mailboxGroups)) {
      const [success, info] = await onMovePromise.call(
        ctx.instance,
        sourceMailboxId,
        {
          destination: targetMailbox.path,
          messages: msgs.map((m) => ({ uid: m.uid }))
        },
        ctx.state.session
      );

      results.push({
        source_mailbox_id: sourceMailboxId,
        target_mailbox_id,
        success,
        moved_count: msgs.length
      });
    }

    ctx.body = {
      success: true,
      results,
      object: 'batch_operation'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Batch delete messages
// POST /v1/webmail/batch/delete
//
async function batchDelete(ctx) {
  try {
    const { message_ids, permanent } = ctx.request.body;

    if (!Array.isArray(message_ids) || message_ids.length === 0) {
      throw Boom.badRequest('message_ids must be a non-empty array');
    }

    // Get messages
    const messages = await Messages.find(
      ctx.instance,
      ctx.state.session,
      {
        uid: { $in: message_ids.map((id) => Number.parseInt(id, 10)) }
      },
      {
        uid: true,
        mailbox: true
      }
    );

    if (messages.length === 0) {
      throw Boom.notFound('No messages found with provided IDs');
    }

    // Group by mailbox
    const mailboxGroups = _.groupBy(messages, 'mailbox');

    const results = [];

    if (boolean(permanent)) {
      // Permanent deletion via onExpunge
      for (const [mailboxId, msgs] of Object.entries(mailboxGroups)) {
        for (const msg of msgs) {
          await onExpungePromise.call(
            ctx.instance,
            mailboxId,
            {
              uid: msg.uid
            },
            ctx.state.session
          );
        }

        results.push({
          mailbox_id: mailboxId,
          success: true,
          deleted_count: msgs.length
        });
      }
    } else {
      // Move to Trash
      const trashFolder = await findSpecialMailbox(ctx, '\\Trash');

      for (const [sourceMailboxId, msgs] of Object.entries(mailboxGroups)) {
        const [success] = await onMovePromise.call(
          ctx.instance,
          sourceMailboxId,
          {
            destination: trashFolder.path,
            messages: msgs.map((m) => ({ uid: m.uid }))
          },
          ctx.state.session
        );

        results.push({
          source_mailbox_id: sourceMailboxId,
          trash_mailbox_id: trashFolder._id,
          success,
          deleted_count: msgs.length
        });
      }
    }

    ctx.body = {
      success: true,
      results,
      object: 'batch_operation'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Compose helper - start new composition
// POST /v1/webmail/compose
//
async function compose(ctx) {
  try {
    const { to, cc, bcc, subject } = ctx.request.body;

    // Find Drafts mailbox
    const draftsFolder = await findSpecialMailbox(ctx, '\\Drafts');

    // Check quota
    const { isOverQuota } = await Aliases.isOverQuota(
      {
        id: ctx.state.session.user.alias_id,
        domain: ctx.state.session.user.domain_id,
        locale: ctx.locale
      },
      0,
      ctx.client
    );

    if (isOverQuota) {
      throw Boom.forbidden(
        i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale)
      );
    }

    // Create initial draft
    const mail = new MailComposer({
      from: ctx.state.session.user.username,
      to,
      cc,
      bcc,
      subject
    });

    const raw = await mail.compile().build();

    const [success, info] = await onAppendPromise.call(
      ctx.instance,
      draftsFolder._id,
      ['\\Draft'],
      new Date(),
      raw,
      ctx.state.session
    );

    if (!success) {
      throw new Error('Failed to create composition draft');
    }

    ctx.body = {
      id: info.uid,
      mailbox_id: draftsFolder._id,
      to,
      cc,
      bcc,
      subject,
      created_at: new Date(),
      object: 'composition'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Reply to message
// POST /v1/webmail/reply/:message_id
//
async function reply(ctx) {
  try {
    const { message_id } = ctx.params;
    const { reply_all } = ctx.request.body;

    // Get original message with content
    const { message, parsed } = await getMessageWithContent(ctx, message_id);

    // Generate quoted text
    const { quotedHtml, quotedText } = generateQuotedText(parsed, 'reply');

    // Determine recipients
    let to = parsed.from?.value || [];
    let cc = [];

    if (boolean(reply_all)) {
      // Reply-all: include To and Cc recipients except yourself
      const userEmail = ctx.state.session.user.username.toLowerCase();

      const allRecipients = [
        ...(parsed.to?.value || []),
        ...(parsed.cc?.value || [])
      ];

      const otherRecipients = allRecipients.filter(
        (addr) => addr.address.toLowerCase() !== userEmail
      );

      // Original sender goes to To
      to = parsed.from?.value || [];

      // Other recipients go to Cc
      cc = otherRecipients;
    }

    // Generate subject with Re: prefix
    let subject = parsed.subject || '';
    if (!subject.toLowerCase().startsWith('re:')) {
      subject = `Re: ${subject}`;
    }

    // Create references header for threading
    const references = [];
    if (parsed.references) {
      references.push(...parsed.references.split(/\s+/));
    }

    if (parsed.messageId && !references.includes(parsed.messageId)) {
      references.push(parsed.messageId);
    }

    ctx.body = {
      to: to.map((addr) => addr.address).join(', '),
      cc: cc.map((addr) => addr.address).join(', '),
      subject,
      html: quotedHtml,
      text: quotedText,
      in_reply_to: parsed.messageId,
      references: references.join(' '),
      original_message_id: message._id,
      object: 'reply_context'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Forward message
// POST /v1/webmail/forward/:message_id
//
async function forward(ctx) {
  try {
    const { message_id } = ctx.params;

    // Get original message with content
    const { message, parsed } = await getMessageWithContent(ctx, message_id);

    // Generate forward header
    const { quotedHtml, quotedText } = generateQuotedText(parsed, 'forward');

    // Generate subject with Fwd: prefix
    let subject = parsed.subject || '';
    if (!subject.toLowerCase().startsWith('fwd:')) {
      subject = `Fwd: ${subject}`;
    }

    // Include attachments information
    const attachments =
      parsed.attachments?.map((att) => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        cid: att.cid
      })) || [];

    ctx.body = {
      subject,
      html: quotedHtml,
      text: quotedText,
      attachments,
      original_message_id: message._id,
      object: 'forward_context'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Get quoted text for reply
// GET /v1/webmail/quote/:message_id
//
async function getQuote(ctx) {
  try {
    const { message_id } = ctx.params;
    const { type = 'reply' } = ctx.query;

    // Get original message with content
    const { message, parsed } = await getMessageWithContent(ctx, message_id);

    // Generate quoted text
    const { quotedHtml, quotedText } = generateQuotedText(parsed, type);

    ctx.body = {
      html: quotedHtml,
      text: quotedText,
      from: parsed.from?.text,
      date: parsed.date,
      subject: parsed.subject,
      message_id: parsed.messageId,
      references: parsed.references,
      object: 'quote'
    };
  } catch (_err) {
    let err = _err;
    if (Array.isArray(err)) err = _err[0];
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Advanced search
// GET /v1/webmail/search
//
async function search(ctx) {
  try {
    const {
      q,
      from,
      to,
      subject,
      has_attachment,
      is_unread,
      is_flagged,
      folder,
      date_after,
      date_before
    } = ctx.query;

    const query = {};
    const searchConditions = [];

    // Filter by folder/mailbox if specified
    if (isSANB(folder)) {
      const mailbox = await Mailboxes.findOne(ctx.instance, ctx.state.session, {
        path: folder
      });

      if (mailbox) {
        query.mailbox = mailbox._id.toString();
      } else {
        // No results if folder doesn't exist
        query.mailbox = null;
      }
    }

    // Text search query (searches subject, from, to, body)
    if (isSANB(q)) {
      searchConditions.push({
        $or: [
          { subject: { $regex: q, $options: 'i' } },
          { from: { $regex: q, $options: 'i' } },
          { to: { $regex: q, $options: 'i' } }
        ]
      });
    }

    // From filter
    if (isSANB(from)) {
      searchConditions.push({
        from: { $regex: from, $options: 'i' }
      });
    }

    // To filter
    if (isSANB(to)) {
      searchConditions.push({
        to: { $regex: to, $options: 'i' }
      });
    }

    // Subject filter
    if (isSANB(subject)) {
      searchConditions.push({
        subject: { $regex: subject, $options: 'i' }
      });
    }

    // Has attachment filter
    if (has_attachment !== undefined) {
      query.ha = boolean(has_attachment);
    }

    // Unread filter
    if (is_unread !== undefined) {
      searchConditions.push({
        unseen: boolean(is_unread) ? 1 : 0
      });
    }

    // Flagged filter
    if (is_flagged !== undefined) {
      searchConditions.push({
        flagged: boolean(is_flagged) ? 1 : 0
      });
    }

    // Date range filters
    if (date_after || date_before) {
      const dateCondition = {};

      if (date_after) {
        dateCondition.$gte = new Date(date_after);
      }

      if (date_before) {
        dateCondition.$lte = new Date(date_before);
      }

      query.idate = dateCondition;
    }

    // Combine search conditions
    if (searchConditions.length > 0) {
      query.$and = searchConditions;
    }

    // Execute search
    const [messages, itemCount] = await Promise.all([
      Messages.find(
        ctx.instance,
        ctx.state.session,
        query,
        {},
        {
          limit: ctx.query.limit,
          offset: ctx.paginate.skip,
          sort: '-idate' // Sort by date descending
        }
      ),
      Messages.countDocuments(ctx.instance, ctx.state.session, query)
    ]);

    const pageCount = Math.ceil(itemCount / ctx.query.limit);

    setPaginationHeaders(
      ctx,
      pageCount,
      ctx.query.page,
      messages.length,
      itemCount
    );

    // Get unique mailboxes for the results
    const mailboxIds = _.uniq(messages.map((m) => m.mailbox.toString()));
    const mailboxes = await Mailboxes.find(ctx.instance, ctx.state.session, {
      _id: { $in: mailboxIds }
    });

    const mailboxMap = {};
    for (const mailbox of mailboxes) {
      mailboxMap[mailbox._id.toString()] = mailbox;
    }

    // Generate facets for filtering
    const facets = {
      folders: {},
      has_attachments: 0,
      unread: 0,
      flagged: 0
    };

    for (const message of messages) {
      // Count messages per folder
      const folderPath = mailboxMap[message.mailbox.toString()]?.path || 'Unknown';
      facets.folders[folderPath] = (facets.folders[folderPath] || 0) + 1;

      // Count attachments
      if (message.ha) facets.has_attachments++;

      // Count unread
      if (!message.flags.includes('\\Seen')) facets.unread++;

      // Count flagged
      if (message.flags.includes('\\Flagged')) facets.flagged++;
    }

    ctx.body = {
      results: messages.map((msg) => ({
        id: msg._id,
        uid: msg.uid,
        mailbox_id: msg.mailbox,
        mailbox_path: mailboxMap[msg.mailbox.toString()]?.path,
        thread_id: msg.thread,
        subject: msg.subject,
        from: msg.from,
        to: msg.to,
        date: msg.idate,
        size: msg.size,
        flags: msg.flags,
        has_attachments: msg.ha,
        is_unread: !msg.flags.includes('\\Seen'),
        is_flagged: msg.flags.includes('\\Flagged'),
        object: 'message'
      })),
      facets,
      total_count: itemCount,
      object: 'search_results'
    };
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Contact autocomplete
// GET /v1/webmail/contacts/autocomplete
//
async function contactAutocomplete(ctx) {
  try {
    const { q } = ctx.query;

    if (!isSANB(q) || q.length < 2) {
      ctx.body = [];
      return;
    }

    // Search contacts by email or name
    const contacts = await Contacts.find(
      ctx.instance,
      ctx.state.session,
      {
        $or: [
          { email: { $regex: q, $options: 'i' } },
          { fn: { $regex: q, $options: 'i' } } // formatted name
        ]
      },
      {
        email: true,
        fn: true
      },
      {
        limit: 10,
        sort: 'fn' // Sort by name
      }
    );

    // Also search recent messages for email addresses
    const messages = await Messages.find(
      ctx.instance,
      ctx.state.session,
      {
        $or: [
          { from: { $regex: q, $options: 'i' } },
          { to: { $regex: q, $options: 'i' } }
        ]
      },
      {
        from: true,
        to: true
      },
      {
        limit: 20,
        sort: '-idate'
      }
    );

    // Extract unique email addresses from messages
    const emailSet = new Set();
    for (const msg of messages) {
      const fromEmails = msg.from?.match(/[\w.-]+@[\w.-]+/g) || [];
      const toEmails = msg.to?.match(/[\w.-]+@[\w.-]+/g) || [];

      [...fromEmails, ...toEmails].forEach((email) => {
        if (email.toLowerCase().includes(q.toLowerCase())) {
          emailSet.add(email.toLowerCase());
        }
      });
    }

    // Combine contacts and email addresses
    const results = [
      ...contacts.map((c) => ({
        email: c.email,
        name: c.fn,
        source: 'contact',
        object: 'autocomplete_result'
      })),
      ...Array.from(emailSet).map((email) => ({
        email,
        name: email.split('@')[0], // Use local part as name
        source: 'message_history',
        object: 'autocomplete_result'
      }))
    ];

    // Remove duplicates and limit
    const seen = new Set();
    const unique = results.filter((r) => {
      if (seen.has(r.email)) return false;
      seen.add(r.email);
      return true;
    });

    ctx.body = unique.slice(0, 10);
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Add contact from message
// POST /v1/webmail/contacts/from-message
//
async function addContactFromMessage(ctx) {
  try {
    const { message_id, email } = ctx.request.body;

    if (!isSANB(email)) {
      throw Boom.badRequest('Email address is required');
    }

    // Check if contact already exists
    const existing = await Contacts.findOne(ctx.instance, ctx.state.session, {
      email: email.toLowerCase()
    });

    if (existing) {
      ctx.body = {
        message: 'Contact already exists',
        contact_id: existing._id,
        object: 'contact'
      };
      return;
    }

    // Get message if provided to extract name
    let displayName = email.split('@')[0];

    if (isSANB(message_id) && ObjectID.isValid(message_id)) {
      const message = await Messages.findOne(ctx.instance, ctx.state.session, {
        _id: message_id
      });

      if (message) {
        // Try to extract name from From header
        const fromMatch = message.from?.match(/([^<]+)<[\w.-]+@[\w.-]+>/);
        if (fromMatch && fromMatch[1]) {
          displayName = fromMatch[1].trim().replace(/['"]/g, '');
        }
      }
    }

    // Create new contact (using existing Contacts model/API)
    // This would typically call the contacts controller's create method
    // For now, we'll return a stub indicating it should be created
    ctx.body = {
      message: 'Contact creation requires integration with contacts API',
      email,
      suggested_name: displayName,
      action: 'POST /v1/contacts',
      object: 'contact_stub'
    };
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Get frequent contacts
// GET /v1/webmail/contacts/frequent
//
async function frequentContacts(ctx) {
  try {
    // Get all messages sent/received in the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const messages = await Messages.find(
      ctx.instance,
      ctx.state.session,
      {
        idate: { $gte: ninetyDaysAgo }
      },
      {
        from: true,
        to: true,
        cc: true
      },
      {
        limit: 1000, // Reasonable limit
        sort: '-idate'
      }
    );

    // Count email address frequency
    const frequency = new Map();

    for (const msg of messages) {
      const allAddresses = [
        ...(msg.from?.match(/[\w.-]+@[\w.-]+/g) || []),
        ...(msg.to?.match(/[\w.-]+@[\w.-]+/g) || []),
        ...(msg.cc?.match(/[\w.-]+@[\w.-]+/g) || [])
      ];

      for (const email of allAddresses) {
        const lower = email.toLowerCase();

        // Skip your own email
        if (lower === ctx.state.session.user.username.toLowerCase()) {
          continue;
        }

        if (frequency.has(lower)) {
          frequency.set(lower, frequency.get(lower) + 1);
        } else {
          frequency.set(lower, 1);
        }
      }
    }

    // Convert to array and sort by frequency
    const sorted = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, ctx.query.limit || 25);

    // Try to get contact info for each
    const emails = sorted.map((entry) => entry[0]);
    const contacts = await Contacts.find(
      ctx.instance,
      ctx.state.session,
      {
        email: { $in: emails }
      },
      {
        email: true,
        fn: true
      }
    );

    const contactMap = new Map();
    for (const contact of contacts) {
      contactMap.set(contact.email.toLowerCase(), contact);
    }

    ctx.body = sorted.map(([email, count]) => {
      const contact = contactMap.get(email);
      return {
        email,
        name: contact?.fn || email.split('@')[0],
        frequency: count,
        has_contact: Boolean(contact),
        object: 'frequent_contact'
      };
    });
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Get webmail settings
// GET /v1/webmail/settings
//
async function getSettings(ctx) {
  try {
    // Get alias to access settings
    const alias = await Aliases.findById(
      ctx.state.session.user.alias_id,
      ctx.state.session.user.domain_id
    );

    if (!alias) {
      throw Boom.notFound('Alias not found');
    }

    // Default webmail settings
    const defaultSettings = {
      messages_per_page: 25,
      auto_refresh_interval: 60000, // 1 minute in ms
      display_density: 'comfortable', // comfortable, compact
      theme: 'light', // light, dark, auto
      reply_behavior: 'reply', // reply, reply_all
      quote_original: true,
      email_signature: '',
      show_images: 'ask', // always, ask, never
      conversation_view: true,
      keyboard_shortcuts: true,
      send_read_receipts: false
    };

    // Get custom settings from alias (if stored)
    // This assumes alias has a webmail_settings field
    const customSettings = alias.webmail_settings || {};

    ctx.body = {
      ...defaultSettings,
      ...customSettings,
      object: 'webmail_settings'
    };
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

//
// Update webmail settings
// PUT /v1/webmail/settings
//
async function updateSettings(ctx) {
  try {
    const {
      messages_per_page,
      auto_refresh_interval,
      display_density,
      theme,
      reply_behavior,
      quote_original,
      email_signature,
      show_images,
      conversation_view,
      keyboard_shortcuts,
      send_read_receipts
    } = ctx.request.body;

    // Build update object with only provided fields
    const updates = {};

    if (messages_per_page !== undefined) {
      if (![10, 25, 50, 100].includes(Number(messages_per_page))) {
        throw Boom.badRequest(
          'messages_per_page must be one of: 10, 25, 50, 100'
        );
      }

      updates.messages_per_page = Number(messages_per_page);
    }

    if (auto_refresh_interval !== undefined) {
      const interval = Number(auto_refresh_interval);
      if (interval < 30000 || interval > 600000) {
        throw Boom.badRequest(
          'auto_refresh_interval must be between 30000 (30s) and 600000 (10min)'
        );
      }

      updates.auto_refresh_interval = interval;
    }

    if (display_density !== undefined) {
      if (!['comfortable', 'compact'].includes(display_density)) {
        throw Boom.badRequest('display_density must be comfortable or compact');
      }

      updates.display_density = display_density;
    }

    if (theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(theme)) {
        throw Boom.badRequest('theme must be light, dark, or auto');
      }

      updates.theme = theme;
    }

    if (reply_behavior !== undefined) {
      if (!['reply', 'reply_all'].includes(reply_behavior)) {
        throw Boom.badRequest('reply_behavior must be reply or reply_all');
      }

      updates.reply_behavior = reply_behavior;
    }

    if (quote_original !== undefined) {
      updates.quote_original = boolean(quote_original);
    }

    if (email_signature !== undefined) {
      // Limit signature length
      if (email_signature.length > 5000) {
        throw Boom.badRequest('email_signature must be less than 5000 characters');
      }

      updates.email_signature = email_signature;
    }

    if (show_images !== undefined) {
      if (!['always', 'ask', 'never'].includes(show_images)) {
        throw Boom.badRequest('show_images must be always, ask, or never');
      }

      updates.show_images = show_images;
    }

    if (conversation_view !== undefined) {
      updates.conversation_view = boolean(conversation_view);
    }

    if (keyboard_shortcuts !== undefined) {
      updates.keyboard_shortcuts = boolean(keyboard_shortcuts);
    }

    if (send_read_receipts !== undefined) {
      updates.send_read_receipts = boolean(send_read_receipts);
    }

    // Update alias with new settings
    // Note: This assumes the Aliases model supports a webmail_settings field
    // In practice, you might need to add this field to the schema
    const alias = await Aliases.findById(
      ctx.state.session.user.alias_id,
      ctx.state.session.user.domain_id
    );

    if (!alias) {
      throw Boom.notFound('Alias not found');
    }

    // Merge with existing settings
    alias.webmail_settings = {
      ...(alias.webmail_settings || {}),
      ...updates
    };

    // Save would happen here in a real implementation
    // await alias.save();

    ctx.body = {
      success: true,
      updated_settings: updates,
      note: 'Settings update requires Alias model schema update to persist',
      object: 'settings_update'
    };
  } catch (err) {
    ctx.logger.error(err, { ctx });
    throw err;
  }
}

module.exports = {
  listThreads,
  listDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
  sendDraft,
  batchFlags,
  batchMove,
  batchDelete,
  compose,
  reply,
  forward,
  getQuote,
  search,
  contactAutocomplete,
  addContactFromMessage,
  frequentContacts,
  getSettings,
  updateSettings
};
