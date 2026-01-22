/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const punycode = require('node:punycode');
const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const { SieveScripts } = require('#models');
const config = require('#config');
const { validate } = require('#helpers/sieve/parser');
const { SieveSecurityValidator } = require('#helpers/sieve/security');

// Security validator instance
const securityValidator = new SieveSecurityValidator({
  maxScriptSize: config.sieve?.maxScriptSize || 1024 * 1024,
  maxRedirects: config.sieve?.maxRedirectsPerScript || 5
});

/**
 * Check if IMAP is enabled - Sieve requires IMAP
 */
function checkImapEnabled(ctx) {
  if (!ctx.state.alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }
}

/**
 * Check if alias is domain-wide (catch-all) - not allowed for Sieve
 */
function checkCatchAllAlias(ctx) {
  const aliasName = ctx.state.alias.name;
  if (aliasName === '*' || aliasName.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }
}

/**
 * List Sieve scripts for an alias
 */
async function listSieveScripts(ctx, next) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  const scripts = await SieveScripts.find({
    alias: ctx.state.alias._id
  })
    .sort({ is_active: -1, updated_at: -1 })
    .lean()
    .exec();

  if (ctx.api) {
    ctx.body = scripts.map((script) => ({
      id: script._id.toString(),
      object: 'sieve_script',
      name: script.name,
      description: script.description,
      is_active: script.is_active,
      required_capabilities: script.required_capabilities,
      security_warnings: script.security_warnings,
      created_at: script.created_at,
      updated_at: script.updated_at
    }));
    return;
  }

  ctx.state.sieveScripts = scripts;
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs.push(
    {
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
      )
    },
    {
      name: `${ctx.state.alias.name}@${ctx.state.domain.name}`,
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/aliases/${ctx.state.alias.id}`
      )
    },
    {
      header: ctx.state.t('Sieve Filters'),
      name: ctx.state.t('Sieve Filters')
    }
  );

  return next();
}

/**
 * Retrieve a specific Sieve script
 */
async function retrieveSieveScript(ctx, next) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  if (!isSANB(ctx.params.script_id)) {
    throw Boom.notFound(ctx.translateError('SIEVE_SCRIPT_DOES_NOT_EXIST'));
  }

  const query = {
    alias: ctx.state.alias._id
  };

  // Allow lookup by ID or name
  if (mongoose.isObjectIdOrHexString(ctx.params.script_id)) {
    query._id = ctx.params.script_id;
  } else {
    query.name = ctx.params.script_id;
  }

  ctx.state.sieveScript = await SieveScripts.findOne(query).lean().exec();

  if (!ctx.state.sieveScript) {
    throw Boom.notFound(ctx.translateError('SIEVE_SCRIPT_DOES_NOT_EXIST'));
  }

  if (ctx.api) {
    ctx.body = {
      id: ctx.state.sieveScript._id.toString(),
      object: 'sieve_script',
      alias: ctx.state.alias._id.toString(),
      name: ctx.state.sieveScript.name,
      content: ctx.state.sieveScript.content,
      description: ctx.state.sieveScript.description,
      is_active: ctx.state.sieveScript.is_active,
      required_capabilities: ctx.state.sieveScript.required_capabilities,
      security_warnings: ctx.state.sieveScript.security_warnings,
      created_at: ctx.state.sieveScript.created_at,
      updated_at: ctx.state.sieveScript.updated_at
    };
    return;
  }

  return next();
}

/**
 * Create a new Sieve script
 */
async function createSieveScript(ctx) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  const { name, content, description, is_active } = ctx.request.body;

  if (!isSANB(name)) {
    throw Boom.badRequest(ctx.translateError('SIEVE_SCRIPT_NAME_REQUIRED'));
  }

  if (!isSANB(content)) {
    throw Boom.badRequest(ctx.translateError('SIEVE_SCRIPT_CONTENT_REQUIRED'));
  }

  // Check script count limit
  const scriptCount = await SieveScripts.countDocuments({
    alias: ctx.state.alias._id
  });

  const maxScriptCount = config.sieve?.maxScriptCount || 15;
  if (scriptCount >= maxScriptCount) {
    throw Boom.badRequest(
      ctx.translateError('SIEVE_SCRIPT_LIMIT_EXCEEDED', maxScriptCount)
    );
  }

  // Check script size
  const maxScriptSize = config.sieve?.maxScriptSize || 1024 * 1024;
  if (Buffer.byteLength(content, 'utf8') > maxScriptSize) {
    throw Boom.badRequest(
      ctx.translateError('SIEVE_SCRIPT_SIZE_EXCEEDED', maxScriptSize)
    );
  }

  // Validate script syntax
  const validationResult = validate(content);
  if (!validationResult.valid) {
    const errorMessages = validationResult.errors
      .map((e) => `Line ${e.line}: ${e.message}`)
      .join('; ');
    throw Boom.badRequest(
      ctx.translateError('SIEVE_SCRIPT_SYNTAX_ERROR', errorMessages)
    );
  }

  // Security analysis
  const securityResult = securityValidator.validate(content);

  // If activating this script, deactivate others
  if (is_active) {
    await SieveScripts.updateMany(
      { alias: ctx.state.alias._id, is_active: true },
      { $set: { is_active: false } }
    );
  }

  const script = await SieveScripts.create({
    alias: ctx.state.alias._id,
    user: ctx.state.user._id,
    domain: ctx.state.domain._id,
    name,
    content,
    description: description || '',
    is_active: Boolean(is_active),
    required_capabilities: securityResult.requiredExtensions || [],
    security_warnings: securityResult.warnings || []
  });

  if (ctx.api) {
    ctx.status = 201;
    ctx.body = {
      id: script._id.toString(),
      object: 'sieve_script',
      alias: ctx.state.alias._id.toString(),
      name: script.name,
      content: script.content,
      description: script.description,
      is_active: script.is_active,
      required_capabilities: script.required_capabilities,
      security_warnings: script.security_warnings,
      created_at: script.created_at,
      updated_at: script.updated_at
    };
    return;
  }

  ctx.flash('success', ctx.translate('SIEVE_SCRIPT_CREATED'));
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/${
      ctx.state.alias.id
    }/sieve`
  );
  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

/**
 * Update a Sieve script
 */
async function updateSieveScript(ctx) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  const { name, content, description, is_active } = ctx.request.body;

  const updates = {};

  if (isSANB(name)) {
    updates.name = name;
  }

  if (typeof description === 'string') {
    updates.description = description;
  }

  if (isSANB(content)) {
    // Check script size
    const maxScriptSize = config.sieve?.maxScriptSize || 1024 * 1024;
    if (Buffer.byteLength(content, 'utf8') > maxScriptSize) {
      throw Boom.badRequest(
        ctx.translateError('SIEVE_SCRIPT_SIZE_EXCEEDED', maxScriptSize)
      );
    }

    // Validate script syntax
    const validationResult = validate(content);
    if (!validationResult.valid) {
      const errorMessages = validationResult.errors
        .map((e) => `Line ${e.line}: ${e.message}`)
        .join('; ');
      throw Boom.badRequest(
        ctx.translateError('SIEVE_SCRIPT_SYNTAX_ERROR', errorMessages)
      );
    }

    // Security analysis
    const securityResult = securityValidator.validate(content);

    updates.content = content;
    updates.required_capabilities = securityResult.requiredExtensions || [];
    updates.security_warnings = securityResult.warnings || [];
  }

  // Handle activation
  if (
    typeof is_active === 'boolean' ||
    is_active === 'true' ||
    is_active === 'false'
  ) {
    const shouldActivate = is_active === true || is_active === 'true';
    if (shouldActivate) {
      // Deactivate other scripts
      await SieveScripts.updateMany(
        {
          alias: ctx.state.alias._id,
          _id: { $ne: ctx.state.sieveScript._id },
          is_active: true
        },
        { $set: { is_active: false } }
      );
    }

    updates.is_active = shouldActivate;
  }

  const script = await SieveScripts.findByIdAndUpdate(
    ctx.state.sieveScript._id,
    { $set: updates },
    { new: true }
  )
    .lean()
    .exec();

  if (ctx.api) {
    ctx.body = {
      id: script._id.toString(),
      object: 'sieve_script',
      alias: ctx.state.alias._id.toString(),
      name: script.name,
      content: script.content,
      description: script.description,
      is_active: script.is_active,
      required_capabilities: script.required_capabilities,
      security_warnings: script.security_warnings,
      created_at: script.created_at,
      updated_at: script.updated_at
    };
    return;
  }

  ctx.flash('success', ctx.translate('SIEVE_SCRIPT_UPDATED'));
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/${
      ctx.state.alias.id
    }/sieve`
  );
  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

/**
 * Delete a Sieve script
 */
async function deleteSieveScript(ctx) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  await SieveScripts.findByIdAndDelete(ctx.state.sieveScript._id);

  if (ctx.api) {
    ctx.body = {
      message: ctx.translate('SIEVE_SCRIPT_DELETED')
    };
    return;
  }

  ctx.flash('success', ctx.translate('SIEVE_SCRIPT_DELETED'));
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/${
      ctx.state.alias.id
    }/sieve`
  );
  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

/**
 * Activate a Sieve script
 */
async function activateSieveScript(ctx) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  // Deactivate all other scripts for this alias
  await SieveScripts.updateMany(
    { alias: ctx.state.alias._id, is_active: true },
    { $set: { is_active: false } }
  );

  // Activate the selected script
  const script = await SieveScripts.findByIdAndUpdate(
    ctx.state.sieveScript._id,
    { $set: { is_active: true } },
    { new: true }
  )
    .lean()
    .exec();

  if (ctx.api) {
    ctx.body = {
      id: script._id.toString(),
      object: 'sieve_script',
      alias: ctx.state.alias._id.toString(),
      name: script.name,
      is_active: script.is_active,
      created_at: script.created_at,
      updated_at: script.updated_at
    };
    return;
  }

  ctx.flash('success', ctx.translate('SIEVE_SCRIPT_ACTIVATED'));
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/${
      ctx.state.alias.id
    }/sieve`
  );
  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

/**
 * Deactivate a Sieve script
 */
async function deactivateSieveScript(ctx) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  const script = await SieveScripts.findByIdAndUpdate(
    ctx.state.sieveScript._id,
    { $set: { is_active: false } },
    { new: true }
  )
    .lean()
    .exec();

  if (ctx.api) {
    ctx.body = {
      id: script._id.toString(),
      object: 'sieve_script',
      alias: ctx.state.alias._id.toString(),
      name: script.name,
      is_active: script.is_active,
      created_at: script.created_at,
      updated_at: script.updated_at
    };
    return;
  }

  ctx.flash('success', ctx.translate('SIEVE_SCRIPT_DEACTIVATED'));
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/${
      ctx.state.alias.id
    }/sieve`
  );
  if (ctx.accepts('html')) {
    ctx.redirect(redirectTo);
  } else {
    ctx.body = { redirectTo };
  }
}

/**
 * Validate a Sieve script without saving
 */
async function validateSieveScript(ctx) {
  const { content } = ctx.request.body;

  if (!isSANB(content)) {
    throw Boom.badRequest(ctx.translateError('SIEVE_SCRIPT_CONTENT_REQUIRED'));
  }

  // Check script size
  const maxScriptSize = config.sieve?.maxScriptSize || 1024 * 1024;
  const scriptSize = Buffer.byteLength(content, 'utf8');
  if (scriptSize > maxScriptSize) {
    throw Boom.badRequest(
      ctx.translateError('SIEVE_SCRIPT_SIZE_EXCEEDED', maxScriptSize)
    );
  }

  // Validate syntax
  const validationResult = validate(content);

  // Security analysis
  let securityResult = { warnings: [], requiredExtensions: [] };
  if (validationResult.valid) {
    securityResult = securityValidator.validate(content);
  }

  ctx.body = {
    valid: validationResult.valid,
    errors: validationResult.errors || [],
    warnings: securityResult.warnings || [],
    required_capabilities: securityResult.requiredExtensions || [],
    size: scriptSize,
    max_size: maxScriptSize
  };
}

/**
 * Get Sieve capabilities
 */
async function getSieveCapabilities(ctx) {
  ctx.body = {
    capabilities: config.sieve?.enabledExtensions || [
      'fileinto',
      'reject',
      'ereject',
      'vacation',
      'vacation-seconds',
      'variables',
      'imap4flags',
      'body',
      'copy',
      'relational',
      'editheader',
      'date',
      'index',
      'duplicate',
      'special-use',
      'mailbox',
      'ihave',
      'include',
      'regex',
      'subaddress',
      'environment',
      'enotify',
      'envelope',
      'comparator-i;ascii-numeric'
    ],
    limits: {
      max_script_size: config.sieve?.maxScriptSize || 1024 * 1024,
      max_script_count: config.sieve?.maxScriptCount || 15,
      max_script_name_length: 512,
      max_redirects_per_script: config.sieve?.maxRedirectsPerScript || 5,
      max_redirects_per_day: config.sieve?.maxRedirectsPerDay || 100,
      max_vacations_per_hour: config.sieve?.maxVacationsPerHour || 10
    }
  };
}

/**
 * Render create form for new Sieve script
 */
async function createForm(ctx, next) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  ctx.state.sieveScript = null;
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs.push(
    {
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
      )
    },
    {
      name: `${ctx.state.alias.name}@${ctx.state.domain.name}`,
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/aliases/${ctx.state.alias.id}`
      )
    },
    {
      name: ctx.state.t('Sieve Filters'),
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/aliases/${ctx.state.alias.id}/sieve`
      )
    },
    {
      header: ctx.state.t('New Sieve Filter'),
      name: ctx.state.t('New')
    }
  );
  return next();
}

/**
 * Render edit form for existing Sieve script
 */
async function editForm(ctx, next) {
  checkImapEnabled(ctx);
  checkCatchAllAlias(ctx);

  const { script_id: scriptId } = ctx.params;

  if (!mongoose.isObjectIdOrHexString(scriptId)) {
    throw Boom.badRequest(ctx.translateError('INVALID_SIEVE_SCRIPT_ID'));
  }

  const script = await SieveScripts.findOne({
    _id: scriptId,
    alias: ctx.state.alias._id
  }).lean();

  if (!script) {
    throw Boom.notFound(ctx.translateError('SIEVE_SCRIPT_NOT_FOUND'));
  }

  ctx.state.sieveScript = script;
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs.push(
    {
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
      )
    },
    {
      name: `${ctx.state.alias.name}@${ctx.state.domain.name}`,
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/aliases/${ctx.state.alias.id}`
      )
    },
    {
      name: ctx.state.t('Sieve Filters'),
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(
          ctx.state.domain.name
        )}/aliases/${ctx.state.alias.id}/sieve`
      )
    },
    {
      header: ctx.state.t('Edit Sieve Filter'),
      name: script.name
    }
  );
  return next();
}

module.exports = {
  // Route-compatible names
  list: listSieveScripts,
  retrieve: retrieveSieveScript,
  create: createSieveScript,
  update: updateSieveScript,
  remove: deleteSieveScript,
  activate: activateSieveScript,
  deactivate: deactivateSieveScript,
  validate: validateSieveScript,
  capabilities: getSieveCapabilities,
  createForm,
  editForm,
  // Original names for internal use
  listSieveScripts,
  retrieveSieveScript,
  createSieveScript,
  updateSieveScript,
  deleteSieveScript,
  activateSieveScript,
  deactivateSieveScript,
  validateSieveScript,
  getSieveCapabilities
};
