/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/* eslint-disable no-await-in-loop */

const process = require('node:process');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const paginate = require('koa-ctx-paginate');
const { ImapFlow } = require('imapflow');

const config = require('#config');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const env = require('#config/env');

async function listSupport(ctx, next) {
  try {
    // TODO: env vars here later
    const supportImapConfig = {
      host: 'imap.forwardemail.net',
      port: 993,
      secure: true,
      auth: {
        user: env.SMTP_TRANSPORT_USER,
        pass: env.SMTP_TRANSPORT_PASS
      }
    };

    // Connect to IMAP
    const imapClient = new ImapFlow(supportImapConfig);
    await imapClient.connect();

    // Search across all folders except Trash and Junk
    const folders = await imapClient.list();
    const searchFolders = folders.filter(
      (folder) =>
        !folder.name.toLowerCase().includes('trash') &&
        !folder.name.toLowerCase().includes('junk') &&
        !folder.name.toLowerCase().includes('spam')
    );

    let allMessages = [];

    const userEmail =
      process.env.TEST_USER_EMAIL && config.env !== 'production'
        ? process.env.TEST_USER_EMAIL.toLowerCase().trim()
        : ctx.state.user.email.toLowerCase();

    // Search in each folder for messages involving the user
    for (const folder of searchFolders) {
      try {
        await imapClient.mailboxOpen(folder.name);

        // Search for messages to/from/cc/bcc the user
        const searchCriteria = {
          or: [
            { from: userEmail },
            { to: userEmail },
            { cc: userEmail },
            { bcc: userEmail }
          ]
        };

        const messages = await imapClient.search(searchCriteria);

        if (messages.length > 0) {
          // Fetch message headers and basic info
          const messageData = await imapClient.fetch(messages, {
            envelope: true,
            uid: true,
            flags: true,
            internalDate: true,
            bodyStructure: true
          });

          for await (const message of messageData) {
            allMessages.push({
              uid: message.uid,
              folder: folder.name,
              subject: message.envelope.subject || '(No Subject)',
              from: message.envelope.from?.[0] || {},
              to: message.envelope.to || [],
              cc: message.envelope.cc || [],
              bcc: message.envelope.bcc || [],
              date: message.envelope.date || message.internalDate,
              flags: message.flags,
              messageId: message.envelope.messageId
            });
          }
        }
      } catch (err) {
        // Log error but continue with other folders
        console.error(`Error searching folder ${folder.name}:`, err);
      }
    }

    await imapClient.logout();

    // Sort messages by date (newest first)
    allMessages.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply search filter if provided
    if (isSANB(ctx.query.q)) {
      const searchTerm = ctx.query.q.toLowerCase();
      allMessages = allMessages.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(searchTerm) ||
          msg.from.address?.toLowerCase().includes(searchTerm) ||
          msg.to.some((addr) =>
            addr.address?.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Pagination
    const itemCount = allMessages.length;
    const pageCount = Math.ceil(itemCount / ctx.query.limit);
    const startIndex = ctx.paginate.skip;
    const endIndex = startIndex + ctx.query.limit;

    ctx.state.supportMessages = allMessages.slice(startIndex, endIndex);
    ctx.state.itemCount = itemCount;
    ctx.state.pageCount = pageCount;
    ctx.state.pages = paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page);

    // Set HTTP headers for pagination
    setPaginationHeaders(
      ctx,
      pageCount,
      ctx.query.page,
      ctx.state.supportMessages.length,
      itemCount
    );

    if (ctx.api) return next();

    if (ctx.accepts('html')) return ctx.render('my-account/support');

    const table = await ctx.render('my-account/support/_table');
    ctx.body = { table };
  } catch (err) {
    console.error('Error in listSupport:', err);
    throw Boom.badImplementation('Failed to retrieve support messages');
  }
}

module.exports = listSupport;
