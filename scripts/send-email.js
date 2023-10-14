/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const nodemailer = require('nodemailer');

const logger = require('#helpers/logger');

(async () => {
  const transporter = nodemailer.createTransport({
    logger,
    debug: true,
    host: 'localhost',
    port: 2587,
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: process.env.ALIAS_USER,
      pass: process.env.ALIAS_PASS
    }
  });

  const info = await transporter.sendMail({
    envelope: {
      from: process.env.ALIAS_USER,
      to: [process.env.ALIAS_USER]
    },
    raw: `
From: ${process.env.ALIAS_USER}
To: ${process.env.ALIAS_USER}
Subject: test
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit

Test`.trim()
  });

  console.log('info', info);
})();
