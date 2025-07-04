/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const { promises: fs } = require('node:fs');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const openpgp = require('openpgp/dist/node/openpgp.js');

const env = require('#config/env');
const logger = require('#helpers/logger');
const isMessageEncrypted = require('#helpers/is-message-encrypted');

// eslint-disable-next-line complexity
async function decryptPGPEmailContent(rawEmail, privateKeyPath, passphrase) {
  let privateKeyArmored;
  try {
    const emailString = rawEmail.toString();

    // Read the private key from file
    try {
      privateKeyArmored = await fs.readFile(privateKeyPath, 'utf8');
      logger.info('Successfully read private key from file:', privateKeyPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        logger.warn('Private key file does not exist:', privateKeyPath);
        throw new Error(`Private key file not found: ${privateKeyPath}`);
      } else if (err.code === 'EACCES') {
        logger.error(
          'Permission denied reading private key file:',
          privateKeyPath
        );
        throw new Error(
          `Permission denied reading private key file: ${privateKeyPath}`
        );
      } else {
        logger.error('Failed to read private key file:', err);
        throw new Error(`Cannot read private key file: ${err.message}`);
      }
    }

    // Look for multipart/encrypted boundary
    const boundaryMatch = emailString.match(
      /content-type: multipart\/encrypted[^;]*;\s*boundary="?([^"\s;]+)"?/i
    );

    if (boundaryMatch && boundaryMatch[1]) {
      // Handle multipart/encrypted emails
      const boundary = boundaryMatch[1];
      logger.info('Found multipart/encrypted boundary:', boundary);

      const parts = emailString.split(`--${boundary}`);
      logger.info('Split into parts:', parts.length);

      let pgpEncryptedContent = null;
      let partIndex = -1;

      // Find the PGP encrypted part (usually the second part with application/octet-stream)
      for (const [i, part] of parts.entries()) {
        logger.info(`Part ${i} content type check:`, {
          hasOctetStream: part.includes(
            'Content-Type: application/octet-stream'
          ),
          hasPGPBegin: part.includes('-----BEGIN PGP MESSAGE-----'),
          hasPGPEnd: part.includes('-----END PGP MESSAGE-----')
        });

        if (
          part.includes('Content-Type: application/octet-stream') ||
          (part.includes('-----BEGIN PGP MESSAGE-----') &&
            part.includes('-----END PGP MESSAGE-----'))
        ) {
          // Extract just the PGP content, skipping headers
          const pgpStart = part.indexOf('-----BEGIN PGP MESSAGE-----');
          const pgpEnd =
            part.indexOf('-----END PGP MESSAGE-----') +
            '-----END PGP MESSAGE-----'.length;

          if (pgpStart !== -1 && pgpEnd !== -1) {
            pgpEncryptedContent = part.slice(pgpStart, pgpEnd).trim();
            partIndex = i;
            logger.info(
              'Found PGP content in part',
              i,
              'length:',
              pgpEncryptedContent.length
            );
            logger.info(
              'PGP content preview:',
              pgpEncryptedContent.slice(0, 100) + '...'
            );
            break;
          }
        }
      }

      if (!pgpEncryptedContent) {
        logger.warn('No PGP encrypted content found in multipart email');
        // Let's try a different approach - look for any part with PGP content
        for (const [i, part] of parts.entries()) {
          if (part.includes('-----BEGIN PGP MESSAGE-----')) {
            logger.info(`Found PGP in part ${i}, extracting...`);
            const lines = part.split('\n');
            const pgpLines = [];
            let inPGP = false;

            for (const line of lines) {
              if (line.trim() === '-----BEGIN PGP MESSAGE-----') {
                inPGP = true;
                pgpLines.push(line.trim());
              } else if (line.trim() === '-----END PGP MESSAGE-----') {
                pgpLines.push(line.trim());
                inPGP = false;
                break;
              } else if (inPGP) {
                pgpLines.push(line.trim());
              }
            }

            if (pgpLines.length > 0) {
              pgpEncryptedContent = pgpLines.join('\n');
              partIndex = i;
              logger.info(
                'Extracted PGP content via line parsing, length:',
                pgpEncryptedContent.length
              );
              break;
            }
          }
        }

        if (!pgpEncryptedContent) {
          throw new Error('No PGP encrypted content found in multipart email');
        }
      }

      logger.info('Attempting to decrypt PGP content...');

      // Decrypt the PGP content
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({
          armoredKey: privateKeyArmored
        }),
        passphrase
      });

      const message = await openpgp.readMessage({
        armoredMessage: pgpEncryptedContent
      });
      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });

      logger.info(
        'Successfully decrypted PGP content, length:',
        decrypted.length
      );

      // Clear private key from memory for security
      privateKeyArmored = null;

      // Replace the encrypted part with decrypted content
      // Find the content area (after headers, before boundary)
      const headerEnd = parts[partIndex].indexOf('\r\n\r\n');
      const boundaryStart = parts[partIndex].lastIndexOf(`--${boundary}`);

      let beforeContent;
      let afterContent;
      // eslint-disable-next-line no-negated-condition
      if (headerEnd !== -1) {
        beforeContent = parts[partIndex].slice(0, headerEnd + 4); // Include the \r\n\r\n
      } else {
        // Fallback: find where headers likely end
        const lines = parts[partIndex].split('\n');
        let headerEndLine = 0;
        for (const [j, line] of lines.entries()) {
          if (
            line.trim() === '' ||
            line.includes('-----BEGIN PGP MESSAGE-----')
          ) {
            headerEndLine = j;
            break;
          }
        }

        beforeContent = lines.slice(0, headerEndLine + 1).join('\n');
      }

      // eslint-disable-next-line prefer-const
      afterContent =
        boundaryStart !== -1 && boundaryStart > headerEnd
          ? parts[partIndex].slice(boundaryStart)
          : '';

      // Reconstruct the part with decrypted content
      parts[partIndex] = beforeContent + decrypted + '\n' + afterContent;

      // Reconstruct the entire email
      return parts.join(`--${boundary}`);
    }

    // Handle simple PGP encrypted emails (not multipart)
    if (
      emailString.includes('-----BEGIN PGP MESSAGE-----') &&
      emailString.includes('-----END PGP MESSAGE-----')
    ) {
      const pgpStart = emailString.indexOf('-----BEGIN PGP MESSAGE-----');
      const pgpEnd =
        emailString.indexOf('-----END PGP MESSAGE-----') +
        '-----END PGP MESSAGE-----'.length;
      let pgpEncryptedContent = emailString.slice(pgpStart, pgpEnd).trim();

      logger.info(
        'Found simple PGP content, length:',
        pgpEncryptedContent.length
      );
      logger.info(
        'PGP content first 200 chars:',
        pgpEncryptedContent.slice(0, 200)
      );
      logger.info(
        'PGP content last 100 chars:',
        pgpEncryptedContent.slice(-100)
      );

      // Clean up the PGP content - preserve the mandatory blank line after headers
      const lines = pgpEncryptedContent.split(/\r?\n/);
      const cleanLines = [];
      let foundBeginHeader = false;
      let foundBlankLineAfterHeader = false;

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine === '-----BEGIN PGP MESSAGE-----') {
          foundBeginHeader = true;
          cleanLines.push(trimmedLine);
        } else if (
          foundBeginHeader &&
          !foundBlankLineAfterHeader &&
          trimmedLine === ''
        ) {
          // This is the mandatory blank line after the header
          foundBlankLineAfterHeader = true;
          cleanLines.push(''); // Keep the blank line
        } else if (
          foundBeginHeader &&
          !foundBlankLineAfterHeader &&
          trimmedLine !== ''
        ) {
          // We found data without a blank line, so add the mandatory blank line
          foundBlankLineAfterHeader = true;
          cleanLines.push('', trimmedLine);
        } else if (trimmedLine) {
          cleanLines.push(trimmedLine);
        }
      }

      pgpEncryptedContent = cleanLines.join('\n');

      logger.info('Cleaned PGP content, length:', pgpEncryptedContent.length);
      logger.info(
        'Cleaned PGP first 200 chars:',
        pgpEncryptedContent.slice(0, 200)
      );
      logger.info(
        'Cleaned PGP last 100 chars:',
        pgpEncryptedContent.slice(-100)
      );

      // Validate PGP format
      if (!pgpEncryptedContent.startsWith('-----BEGIN PGP MESSAGE-----')) {
        logger.error('PGP content does not start with proper header');
        throw new Error('Invalid PGP format - missing begin header');
      }

      if (!pgpEncryptedContent.endsWith('-----END PGP MESSAGE-----')) {
        logger.error('PGP content does not end with proper footer');
        throw new Error('Invalid PGP format - missing end footer');
      }

      // Decrypt the PGP content
      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({
          armoredKey: privateKeyArmored
        }),
        passphrase
      });

      const message = await openpgp.readMessage({
        armoredMessage: pgpEncryptedContent
      });
      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });

      logger.info(
        'Successfully decrypted simple PGP content, length:',
        decrypted.length
      );

      // Clear private key from memory for security
      privateKeyArmored = null;

      // Instead of reconstructing, just return the decrypted content directly
      // since it should be a complete email message
      logger.info('Decrypted content preview:', decrypted.slice(0, 500));
      return decrypted;
    }

    // If no PGP content found, return original
    logger.info('No PGP content found, returning original email');

    // Clear private key from memory for security (if it was loaded)
    if (privateKeyArmored) {
      privateKeyArmored = null;
    }

    return emailString;
  } catch (err) {
    logger.error('PGP decryption failed:', err);

    // Clear private key from memory for security (if it was loaded)
    if (privateKeyArmored) {
      privateKeyArmored = null;
    }

    throw err;
  }
}

// eslint-disable-next-line complexity
async function retrieveSupport(ctx, next) {
  if (!isSANB(ctx.params.uid) || !isSANB(ctx.params.folder)) {
    throw Boom.badRequest('Message UID and folder are required');
  }

  const uid = Number.parseInt(ctx.params.uid, 10);
  const folder = decodeURIComponent(ctx.params.folder);

  if (Number.isNaN(uid)) {
    throw Boom.badRequest('Invalid message UID');
  }

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

  // Open the specified folder
  await imapClient.mailboxOpen(folder);

  const messageData = await imapClient.fetchOne(
    uid,
    {
      envelope: true,
      uid: true,
      flags: true,
      internalDate: true,
      bodyStructure: true,
      source: true
    },
    { uid: true }
  );

  if (!messageData) {
    await imapClient.logout();
    throw Boom.notFound('Support message not found');
  }

  // Verify user has access to this message
  const userEmail = ctx.state.user.email.toLowerCase();
  const hasAccess =
    messageData.envelope.from?.some(
      (addr) => addr.address?.toLowerCase() === userEmail
    ) ||
    messageData.envelope.to?.some(
      (addr) => addr.address?.toLowerCase() === userEmail
    ) ||
    messageData.envelope.cc?.some(
      (addr) => addr.address?.toLowerCase() === userEmail
    ) ||
    messageData.envelope.bcc?.some(
      (addr) => addr.address?.toLowerCase() === userEmail
    );

  if (!hasAccess && ctx.state.user.group !== 'admin') {
    await imapClient.logout();
    throw Boom.forbidden('Access denied to this support message');
  }

  await imapClient.logout();

  // Check if message is encrypted and decrypt if necessary
  let messageSource = messageData.source;
  let isDecrypted = false;

  if (env.GPG_SECURITY_KEY && env.GPG_SECURITY_PASSPHRASE) {
    try {
      const isEncrypted = isMessageEncrypted(messageData.source);

      if (isEncrypted) {
        // Decrypt the PGP content while preserving email structure
        const decryptedEmail = await decryptPGPEmailContent(
          messageData.source,
          env.GPG_SECURITY_KEY,
          env.GPG_SECURITY_PASSPHRASE
        );

        // Use the decrypted email as the new message source
        messageSource = Buffer.from(decryptedEmail);
        isDecrypted = true;

        logger.info('Successfully decrypted PGP message', {
          messageId: messageData.envelope.messageId
        });

        // Log the decrypted email structure for debugging
        logger.info('Decrypted email preview:', decryptedEmail.slice(0, 500));
      }
    } catch (err) {
      logger.warn('Failed to decrypt PGP message', {
        error: err.message,
        messageId: messageData.envelope.messageId
      });
      // Continue with original message if decryption fails
    }
  }

  // Parse the message content (now potentially decrypted)
  const parsed = await simpleParser(messageSource);

  // Debug the parsed content
  if (isDecrypted) {
    logger.info('Parsed decrypted message:', {
      hasText: Boolean(parsed.text),
      textLength: parsed.text ? parsed.text.length : 0,
      hasHtml: Boolean(parsed.html),
      htmlLength: parsed.html ? parsed.html.length : 0,
      attachmentCount: parsed.attachments ? parsed.attachments.length : 0,
      subject: parsed.subject
    });

    if (parsed.text) {
      logger.info('Parsed text preview:', parsed.text.slice(0, 200));
    }

    if (parsed.html) {
      logger.info('Parsed HTML preview:', parsed.html.slice(0, 200));
    }
  }

  // Prepare message data for display
  ctx.state.supportMessage = {
    uid: messageData.uid,
    folder,
    subject: messageData.envelope.subject || '(No Subject)',
    from: messageData.envelope.from || [],
    to: messageData.envelope.to || [],
    cc: messageData.envelope.cc || [],
    bcc: messageData.envelope.bcc || [],
    date: messageData.envelope.date || messageData.internalDate,
    flags: messageData.flags,
    messageId: messageData.envelope.messageId,
    text: parsed.text,
    html: parsed.html,
    attachments: parsed.attachments || [],
    isDecrypted
  };

  if (ctx.api) return next();

  return ctx.render('my-account/support/message');
}

module.exports = retrieveSupport;
