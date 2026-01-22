/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');
const i18n = require('#helpers/i18n');
const {
  validate: sieveValidate,
  getRequiredCapabilities,
  parse: sieveParse
} = require('#helpers/sieve/parser');
const { SieveSecurityValidator } = require('#helpers/sieve/security');

// <https://github.com/Automattic/mongoose/issues/5534>
mongoose.Error.messages = require('@ladjs/mongoose-error-messages');

//
// Sieve Scripts Model
//
// This model stores Sieve email filtering scripts for aliases.
// Each alias can have multiple scripts, but only one can be active at a time.
// Scripts are validated for syntax and security before being saved.
//
// References:
// - RFC 5228: Sieve: An Email Filtering Language
// - RFC 5804: ManageSieve Protocol
//

const SieveScripts = new mongoose.Schema({
  // Reference to the alias this script belongs to
  alias: {
    type: mongoose.Schema.ObjectId,
    ref: 'Aliases',
    required: true,
    index: true
  },

  // Reference to the user who owns this script (denormalized for query efficiency)
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
    index: true
  },

  // Reference to the domain (denormalized for query efficiency)
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: 'Domains',
    required: true,
    index: true
  },

  // Script name (unique per alias, used by ManageSieve protocol)
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
    validate: {
      validator(value) {
        // ManageSieve script names cannot contain certain characters
        // and must be valid UTF-8 strings
        if (!isSANB(value)) {
          return false;
        }

        // Disallow control characters and path separators
        // eslint-disable-next-line no-control-regex
        if (/[\u0000-\u001F\u007F/\\]/.test(value)) {
          return false;
        }

        return true;
      },
      message: 'Script name contains invalid characters'
    }
  },

  // The actual Sieve script content
  content: {
    type: String,
    required: true,
    maxlength: 65_536, // 64KB max script size (configurable via security settings)
    validate: {
      validator(value) {
        if (!isSANB(value)) {
          return false;
        }

        // Basic validation - detailed validation happens in pre-save hook
        return true;
      },
      message: 'Script content is required'
    }
  },

  // Whether this script is currently active
  // Only one script per alias can be active at a time
  is_active: {
    type: Boolean,
    default: false,
    index: true
  },

  // Script description (optional, for user reference)
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Sieve capabilities required by this script
  // Stored for quick capability checking without re-parsing
  required_capabilities: [
    {
      type: String,
      trim: true,
      lowercase: true
    }
  ],

  // Script validation status
  is_valid: {
    type: Boolean,
    default: true
  },

  // Validation errors (if any)
  validation_errors: [
    {
      message: String,
      line: Number,
      column: Number
    }
  ],

  // Security analysis results
  security_warnings: [
    {
      type: {
        type: String,
        enum: ['redirect', 'vacation', 'editheader', 'resource', 'extension']
      },
      severity: {
        type: String,
        enum: ['info', 'warning', 'error']
      },
      message: String
    }
  ],

  // Audit trail
  created_by: {
    type: String,
    enum: ['api', 'managesieve', 'web', 'import'],
    default: 'api'
  },
  last_modified_by: {
    type: String,
    enum: ['api', 'managesieve', 'web', 'import'],
    default: 'api'
  }
});

// Compound indexes for common queries
SieveScripts.index({ alias: 1, name: 1 }, { unique: true });
SieveScripts.index({ alias: 1, is_active: 1 });
SieveScripts.index({ user: 1, domain: 1 });

// Pre-save hook to validate and analyze the script
SieveScripts.pre('save', async function (next) {
  try {
    // Validate syntax
    const validationResult = sieveValidate(this.content);
    this.is_valid = validationResult.valid;
    this.validation_errors = validationResult.errors || [];

    if (!validationResult.valid) {
      throw Boom.badRequest(
        i18n.translateError('SIEVE_SCRIPT_INVALID', this.locale, {
          errors: this.validation_errors.map((e) => e.message).join(', ')
        })
      );
    }

    // Parse and extract required capabilities
    const ast = sieveParse(this.content);
    this.required_capabilities = getRequiredCapabilities(ast);

    // Check if script uses vacation extension
    const usesVacation =
      this.required_capabilities.includes('vacation') ||
      this.required_capabilities.includes('vacation-seconds');

    // If script uses vacation and will be active, check for vacation responder conflict
    if (usesVacation && this.is_active) {
      // Use conn.models to access Aliases model to avoid circular dependency
      const alias = await conn.models.Aliases.findById(this.alias).lean();

      if (alias?.vacation_responder?.is_enabled) {
        throw Boom.badRequest(
          i18n.translateError('SIEVE_VACATION_CONFLICT', this.locale)
        );
      }
    }

    // Security validation
    const securityValidator = new SieveSecurityValidator();
    const securityResult = securityValidator.validate(this.content);

    this.security_warnings = [];
    if (securityResult.warnings) {
      for (const warning of securityResult.warnings) {
        this.security_warnings.push({
          type: warning.type || 'resource',
          severity: warning.severity || 'warning',
          message: warning.message
        });
      }
    }

    // If security validation fails, reject the script
    if (!securityResult.valid) {
      throw Boom.badRequest(
        i18n.translateError('SIEVE_SCRIPT_SECURITY_ERROR', this.locale, {
          errors: securityResult.errors.map((e) => e.message).join(', ')
        })
      );
    }

    // Also reject if there are high-severity security issues
    if (securityResult.securityIssues) {
      const criticalIssues = securityResult.securityIssues.filter(
        (issue) => issue.severity === 'critical' || issue.severity === 'high'
      );
      if (criticalIssues.length > 0) {
        throw Boom.badRequest(
          i18n.translateError('SIEVE_SCRIPT_SECURITY_ERROR', this.locale, {
            errors: criticalIssues.map((e) => e.message).join(', ')
          })
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Pre-save hook to ensure only one active script per alias
SieveScripts.pre('save', async function (next) {
  if (this.is_active && this.isModified('is_active')) {
    // Deactivate all other scripts for this alias
    await this.constructor.updateMany(
      { alias: this.alias, _id: { $ne: this._id } },
      { $set: { is_active: false } }
    );
  }

  next();
});

// Static method to get the active script for an alias
SieveScripts.statics.getActiveScript = async function (aliasId) {
  return this.findOne({ alias: aliasId, is_active: true, is_valid: true });
};

// Static method to list all scripts for an alias
SieveScripts.statics.listScripts = async function (aliasId) {
  return this.find({ alias: aliasId })
    .select('name is_active description created_at updated_at')
    .sort({ name: 1 });
};

// Static method to activate a script by name
SieveScripts.statics.activateScript = async function (aliasId, scriptName) {
  // First, deactivate all scripts for this alias
  await this.updateMany({ alias: aliasId }, { $set: { is_active: false } });

  // Then activate the specified script
  const script = await this.findOneAndUpdate(
    { alias: aliasId, name: scriptName },
    { $set: { is_active: true } },
    { new: true }
  );

  if (!script) {
    throw Boom.notFound('Script not found');
  }

  return script;
};

// Static method to deactivate all scripts for an alias
SieveScripts.statics.deactivateAll = async function (aliasId) {
  return this.updateMany({ alias: aliasId }, { $set: { is_active: false } });
};

// Virtual for full script info
SieveScripts.virtual('info').get(function () {
  return {
    name: this.name,
    is_active: this.is_active,
    is_valid: this.is_valid,
    description: this.description,
    required_capabilities: this.required_capabilities,
    security_warnings: this.security_warnings,
    created_at: this.created_at,
    updated_at: this.updated_at
  };
});

SieveScripts.plugin(mongooseCommonPlugin, {
  object: 'sieve_script',
  locale: false
});

const conn = mongoose.connections.find(
  (conn) => conn[Symbol.for('connection.name')] === 'MONGO_URI'
);
if (!conn) throw new Error('Mongoose connection does not exist');
module.exports = conn.model('SieveScripts', SieveScripts);
