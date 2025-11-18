/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const process = require('node:process');
const { promisify } = require('node:util');
const { exec } = require('node:child_process');

const openpgp = require('openpgp/dist/node/openpgp.js');
const logger = require('#helpers/logger');
const isMessageEncrypted = require('#helpers/is-message-encrypted');

const execAsync = promisify(exec);

// Cache the decrypted private key at module load
let cachedDecryptedKey = null;

// Read and decrypt private key from file if GPG_SECURITY_KEY is configured
if (process.env.GPG_SECURITY_KEY) {
  try {
    // GPG_SECURITY_KEY is a file path, read the armored key
    const privateKeyArmored = fs.readFileSync(
      process.env.GPG_SECURITY_KEY,
      'utf8'
    );

    // Initialize the key asynchronously but cache it
    (async () => {
      try {
        const privateKey = await openpgp.readPrivateKey({
          armoredKey: privateKeyArmored
        });

        // Decrypt the key with passphrase if provided
        cachedDecryptedKey = process.env.GPG_SECURITY_PASSPHRASE
          ? await openpgp.decryptKey({
              privateKey,
              passphrase: process.env.GPG_SECURITY_PASSPHRASE
            })
          : privateKey;

        logger.info('PGP private key loaded and cached successfully');
      } catch (err) {
        logger.error(err, { context: 'load PGP private key' });
      }
    })();
  } catch (err) {
    logger.error(err, { context: 'read PGP private key file' });
  }
}

/**
 * Decrypt PGP-encrypted message content with recursive decryption support
 * Attempts multiple decryption methods:
 * 1. GPG_SECURITY_KEY from environment (if configured)
 * 2. Local GPG keyring via gpg command (macOS GPG agent)
 * 3. Returns original content if decryption fails
 *
 * Recursively decrypts nested encrypted messages (e.g., encrypted message containing another encrypted message)
 *
 * @param {String|Buffer} content - Message content (raw email or body)
 * @param {Number} depth - Current recursion depth (internal, prevents infinite loops)
 * @returns {Promise<String>} Decrypted content or original if not encrypted/failed
 */
async function pgpDecrypt(content, depth = 0) {
  const MAX_DEPTH = 10; // Prevent infinite recursion

  try {
    // Convert to string if Buffer
    const messageContent = Buffer.isBuffer(content)
      ? content.toString('utf8')
      : content;

    // Check if message is encrypted
    if (!isMessageEncrypted(messageContent)) {
      return messageContent;
    }

    // Prevent infinite recursion
    if (depth >= MAX_DEPTH) {
      logger.warn(
        `Max decryption depth (${MAX_DEPTH}) reached, stopping recursion`
      );
      return messageContent;
    }

    logger.debug(`Attempting to decrypt PGP message (depth: ${depth})`);

    let decrypted = null;

    // Method 1: Try cached decrypted key
    if (cachedDecryptedKey) {
      try {
        decrypted = await decryptWithKey(messageContent, cachedDecryptedKey);
        if (decrypted) {
          logger.info(
            `Successfully decrypted with cached key (depth: ${depth})`
          );
        }
      } catch (err) {
        logger.debug('Cached key decryption failed', { err });
      }
    }

    // Method 2: Try local GPG keyring (macOS GPG agent)
    if (!decrypted) {
      try {
        decrypted = await decryptWithGPGAgent(messageContent);
        if (decrypted) {
          logger.info(
            `Successfully decrypted with local GPG keyring (depth: ${depth})`
          );
        }
      } catch (err) {
        logger.debug('GPG agent decryption failed', { err });
      }
    }

    // If decryption failed, return original
    if (!decrypted) {
      logger.warn('Could not decrypt PGP message, returning original');
      return messageContent;
    }

    // Recursively decrypt if the decrypted content is also encrypted
    if (isMessageEncrypted(decrypted)) {
      logger.debug(
        `Decrypted content is also encrypted, recursing (depth: ${depth + 1})`
      );
      return await pgpDecrypt(decrypted, depth + 1);
    }

    return decrypted;
  } catch (err) {
    logger.error('PGP decryption error', { err });
    return content;
  }
}

/**
 * Decrypt using OpenPGP.js with cached decrypted private key
 * @param {String} messageContent - The encrypted message
 * @param {Object} decryptedKey - Pre-loaded and decrypted private key
 */
async function decryptWithKey(messageContent, decryptedKey) {
  try {
    // Read the PGP message
    const message = await openpgp.readMessage({
      armoredMessage: messageContent
    });

    // Decrypt the message using the cached key
    const { data: decrypted } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedKey
    });

    return decrypted;
  } catch (err) {
    logger.debug('OpenPGP.js decryption failed', { err });
    return null;
  }
}

/**
 * Decrypt using local GPG command (macOS GPG agent with pinentry-mac)
 */
async function decryptWithGPGAgent(messageContent) {
  try {
    // Check if gpg is available
    try {
      await execAsync('which gpg');
    } catch {
      logger.debug('gpg command not found');
      return null;
    }

    // Write message to temp file and decrypt
    // GPG agent will handle key selection and passphrase prompting
    const { stdout, stderr } = await execAsync(
      'gpg --decrypt --batch --quiet 2>/dev/null',
      {
        input: messageContent,
        maxBuffer: 10 * 1024 * 1024, // 10MB
        timeout: 30000 // 30 seconds
      }
    );

    if (stderr && stderr.includes('decryption failed')) {
      logger.debug('GPG decryption failed', { stderr });
      return null;
    }

    return stdout || null;
  } catch (err) {
    logger.debug('GPG command execution failed', { err });
    return null;
  }
}

/**
 * Extract plaintext from decrypted message
 * Handles multipart messages and extracts text/plain or text/html
 */
function extractPlaintext(decrypted) {
  try {
    // If it's already plaintext, return it
    if (typeof decrypted === 'string') {
      // Remove PGP headers if present
      let text = decrypted;
      text = text.replace(
        /^-{5}BEGIN PGP MES{2}AGE-{5}[\s\S]*?-{5}END PGP MES{2}AGE-{5}\s*/gm,
        ''
      );
      text = text.replace(
        /^-{5}BEGIN PGP SIGNED MES{2}AGE-{5}[\s\S]*?-{5}BEGIN PGP SIGNATURE-{5}[\s\S]*?-{5}END PGP SIGNATURE-{5}\s*/gm,
        ''
      );
      return text.trim();
    }

    return decrypted;
  } catch (err) {
    logger.error('Error extracting plaintext', { err });
    return decrypted;
  }
}

module.exports = pgpDecrypt;
module.exports.extractPlaintext = extractPlaintext;
