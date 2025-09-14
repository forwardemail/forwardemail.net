/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');

const Domains = require('#models/domains');
const Aliases = require('#models/aliases');
const Users = require('#models/users');

async function renderEmailSettings(ctx) {
  try {
    // Get user's domains and aliases
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
      user: ctx.state.user._id
    })
    .populate('domain', 'name')
    .lean();

    // Get current email settings (if any)
    const user = await Users.findById(ctx.state.user._id).lean();
    const emailSettings = user.email_settings || {};

    ctx.state.domains = domains;
    ctx.state.aliases = aliases;
    ctx.state.emailSettings = emailSettings;
    ctx.state.breadcrumbs = [
      'my-account',
      {
        name: ctx.t('Email Settings'),
        header: ctx.t('Email Settings'),
        href: ctx.state.l('/my-account/email-settings')
      }
    ];

    return ctx.render('my-account/email-settings');
  } catch (err) {
    ctx.logger.error(err);
    throw Boom.badRequest(err.message);
  }
}

async function updateEmailSettings(ctx) {
  try {
    const { domain_id, alias_id, password, imap_host, imap_port, smtp_host, smtp_port } = ctx.request.body;

    // Validate required fields
    if (!isSANB(domain_id) || !isSANB(alias_id) || !isSANB(password)) {
      throw Boom.badRequest(ctx.t('Domain, alias, and password are required'));
    }

    // Verify user has access to this domain and alias
    const domain = await Domains.findOne({
      _id: domain_id,
      members: {
        $elemMatch: {
          user: ctx.state.user._id,
          group: { $in: ['admin', 'user'] }
        }
      }
    });

    if (!domain) {
      throw Boom.forbidden(ctx.t('Access denied to this domain'));
    }

    const alias = await Aliases.findOne({
      _id: alias_id,
      domain: domain_id,
      user: ctx.state.user._id
    });

    if (!alias) {
      throw Boom.forbidden(ctx.t('Access denied to this alias'));
    }

    // Default IMAP/SMTP settings for Forward Email
    const imapHost = imap_host || `imap.${domain.name}`;
    const imapPort = parseInt(imap_port) || 993;
    const smtpHost = smtp_host || `smtp.${domain.name}`;
    const smtpPort = parseInt(smtp_port) || 465;

    // Test IMAP connection before saving
    const ImapFlow = require('imapflow');
    const testImap = new ImapFlow({
      host: imapHost,
      port: imapPort,
      secure: true,
      auth: {
        user: alias.name,
        pass: password
      },
      logger: false
    });

    try {
      await testImap.connect();
      await testImap.logout();
    } catch (err) {
      ctx.logger.error('IMAP connection test failed:', err);
      throw Boom.badRequest(ctx.t('Failed to connect to email server. Please check your credentials.'));
    }

    // Encrypt the password before storing
    const encryptedPassword = encrypt(password);

    // Save email settings
    await Users.findByIdAndUpdate(ctx.state.user._id, {
      $set: {
        email_settings: {
          domain_id,
          alias_id,
          encrypted_password: encryptedPassword,
          imap_host: imapHost,
          imap_port: imapPort,
          smtp_host: smtpHost,
          smtp_port: smtpPort,
          updated_at: new Date()
        }
      }
    });

    const redirectTo = ctx.state.l('/my-account/inbox');

    if (ctx.accepts('html')) {
      ctx.flash('custom', {
        title: ctx.request.t('Success'),
        text: ctx.request.t('Email settings saved successfully! You can now access your inbox.'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        position: 'top'
      });

      if (ctx.accepts('json')) return ctx.body = { redirectTo };
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { message: ctx.t('Email settings saved successfully'), redirectTo };
    }

  } catch (err) {
    ctx.logger.error(err);

    if (ctx.accepts('html')) {
      ctx.flash('error', err.message);
      return ctx.redirect('back');
    }

    throw err;
  }
}

async function testEmailConnection(ctx) {
  try {
    const { alias_id, password, imap_host, imap_port } = ctx.request.body;

    if (!isSANB(alias_id) || !isSANB(password)) {
      throw Boom.badRequest(ctx.t('Alias and password are required'));
    }

    const alias = await Aliases.findOne({
      _id: alias_id,
      user: ctx.state.user._id
    }).populate('domain', 'name');

    if (!alias) {
      throw Boom.forbidden(ctx.t('Access denied to this alias'));
    }

    const imapHost = imap_host || `imap.${alias.domain.name}`;
    const imapPort = parseInt(imap_port) || 993;

    // Test IMAP connection
    const ImapFlow = require('imapflow');
    const testImap = new ImapFlow({
      host: imapHost,
      port: imapPort,
      secure: true,
      auth: {
        user: alias.name,
        pass: password
      },
      logger: false
    });

    await testImap.connect();
    const info = await testImap.status('INBOX');
    await testImap.logout();

    ctx.body = {
      success: true,
      message: ctx.t('Connection successful!'),
      info: {
        messages: info.messages,
        unseen: info.unseen
      }
    };

  } catch (err) {
    ctx.logger.error('Connection test failed:', err);

    ctx.body = {
      success: false,
      message: ctx.t('Connection failed: {{error}}', { error: err.message })
    };
  }
}

module.exports = {
  renderEmailSettings,
  updateEmailSettings,
  testEmailConnection
};