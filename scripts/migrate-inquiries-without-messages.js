/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Axe = require('axe');
const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Emails = require('#models/emails');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const { Domains, Inquiries, Users } = require('#models');

const transporter = nodemailer.createTransport({
  streamTransport: true,
  buffer: true,
  logger: new Axe({
    silent: true
  })
});

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

(async () => {
  try {
    await setupMongoose(logger);

    const inquiriesWithoutMessages = await Inquiries.find({
      messages: { $exists: false }
    });

    console.log(
      `Found ${inquiriesWithoutMessages.length} inquiries to migrate`
    );

    for (const inquiry of inquiriesWithoutMessages) {
      console.log(`Attempting to migrate inquiry with id: ${inquiry._id}`);

      if (!inquiry.subject || !inquiry.message || !inquiry.text) {
        console.log('No subject or message found, skipping.');
        continue;
      }

      const user = await Users.findById(inquiry.user);
      if (!user) {
        console.log('No user found, skipping.');
        continue;
      }

      const domains = await Domains.find({
        'members.user': user._id
      })
        .sort('name')
        .lean()
        .exec();

      const { email, info } = await emailHelper({
        template: 'inquiry',
        message: {
          to: inquiry?.email || inquiry?.sender_email,
          cc: config.alertsEmail
        },
        locals: {
          user: user.toObject(),
          domains,
          inquiry: {
            subject: inquiry.subject,
            message: inquiry?.message || inquiry?.text
          },
          subject: inquiry.subject
        }
      });

      let raw;
      if (email) {
        raw = await Emails.getMessage(email.message);
      } else {
        const obj = await transporter.sendMail(info.originalMessage);
        raw = obj.message;
      }

      const messages = [
        {
          raw,
          text: inquiry.message || inquiry?.text
        }
      ];

      inquiry.messages = messages;

      await inquiry.save();
      console.log(`Migrated inquiry with id: ${inquiry._id}`);
    }

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    process.exit(0);
  }
})();
