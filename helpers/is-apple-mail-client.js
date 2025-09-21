/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Detects if the client is Apple Mail based on session information
 * Apple Mail has specific IMAP behaviors that need accommodation:
 * - Rapid flag changes that can cause race conditions
 * - Expects messages to be moved to Trash instead of expunged immediately
 * - Different handling of mass delete operations
 *
 * @param {Object} session - IMAP session object
 * @returns {Boolean} true if client appears to be Apple Mail
 */
function isAppleMailClient(session) {
  if (!session || typeof session !== 'object') return false;

  // Check for Apple Push Service (APS) usage which is Apple Mail specific
  if (session.user && session.user.alias_has_aps) return true;

  // Check client identification string if available
  if (session.clientInfo) {
    const clientInfo = session.clientInfo.toLowerCase();
    if (
      clientInfo.includes('apple mail') ||
      clientInfo.includes('mail.app') ||
      clientInfo.includes('macos') ||
      clientInfo.includes('ios mail')
    ) {
      return true;
    }
  }

  // Check user agent patterns
  if (session.userAgent) {
    const userAgent = session.userAgent.toLowerCase();
    if (
      userAgent.includes('apple mail') ||
      userAgent.includes('cfnetwork') ||
      userAgent.includes('darwin')
    ) {
      return true;
    }
  }

  // Check for XAPPLEPUSHSERVICE command usage
  if (session.applePushServiceUsed) return true;

  return false;
}

module.exports = isAppleMailClient;
