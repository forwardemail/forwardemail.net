/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Graceful = require('@ladjs/graceful');
const logger = require('#helpers/logger');
const { TestEmailSessions } = require('#models');

const graceful = new Graceful({
  mongooses: [TestEmailSessions.db.base],
  logger
});

graceful.listen();

(async () => {
  try {
    logger.info('Starting test email cleanup job');
    
    // Delete all expired test email sessions
    const result = await TestEmailSessions.deleteMany({
      expires_at: { $lt: new Date() }
    });
    
    if (result.deletedCount > 0) {
      logger.info(`Cleaned up ${result.deletedCount} expired test email sessions`);
    } else {
      logger.debug('No expired test email sessions to clean up');
    }
    
    process.exit(0);
  } catch (err) {
    logger.error('Test email cleanup job failed', { error: err.message });
    process.exit(1);
  }
})();