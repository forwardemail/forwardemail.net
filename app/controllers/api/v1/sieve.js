/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const config = require('#config');
const { Domains, SieveScripts } = require('#models');
const sieve = require('#helpers/sieve');

/**
 * Get supported Sieve capabilities
 * GET /v1/sieve/capabilities
 */
async function getCapabilities(ctx) {
  ctx.body = {
    object: 'sieve_capabilities',
    capabilities: sieve.SUPPORTED_CAPABILITIES,
    max_script_size: config.sieve.maxScriptSize,
    max_scripts: config.sieve.maxScripts,
    extensions: {
      fileinto: 'File messages into specific mailboxes/folders',
      reject: 'Reject messages with a custom error message',
      ereject: 'Enhanced reject with DSN support',
      vacation: 'Send automatic vacation/out-of-office replies',
      'vacation-seconds': 'Vacation with second-level granularity',
      variables: 'Use variables in Sieve scripts',
      imap4flags: String.raw`Set IMAP flags (\Seen, \Flagged, etc.) on messages`,
      body: 'Test message body content',
      copy: 'Preserve implicit keep when using fileinto/redirect',
      relational: 'Relational comparisons (:count, :value)',
      editheader: 'Add or delete message headers',
      envelope: 'Test envelope sender/recipient',
      date: 'Test date/time values',
      index: 'Test specific header occurrences',
      regex: 'Regular expression matching',
      enotify: 'Send notifications',
      environment: 'Access environment information'
    }
  };
}

/**
 * Validate a Sieve script without saving
 * POST /v1/sieve/validate
 */
async function validateScript(ctx) {
  const { content } = ctx.request.body;

  if (!isSANB(content)) {
    throw Boom.badRequest(ctx.translateError('SIEVE_SCRIPT_REQUIRED'));
  }

  // Use the script checker for comprehensive validation
  const checker = new sieve.SieveScriptChecker({
    securityOptions: {
      maxScriptSize: config.sieve.maxScriptSize,
      maxNestedDepth: config.sieve.maxNestedDepth,
      maxRedirects: config.sieve.maxRedirects
    }
  });

  const result = checker.check(content);

  ctx.body = {
    object: 'sieve_validation',
    valid: result.valid,
    syntax: result.syntax,
    security: result.security,
    analysis: result.analysis,
    suggestions: result.suggestions
  };
}

/**
 * Test a Sieve script against a sample message
 * POST /v1/sieve/test
 */
async function testScript(ctx) {
  const { content, message } = ctx.request.body;

  if (!isSANB(content)) {
    throw Boom.badRequest(ctx.translateError('SIEVE_SCRIPT_REQUIRED'));
  }

  if (!message || typeof message !== 'object') {
    throw Boom.badRequest(ctx.translateError('SIEVE_TEST_MESSAGE_REQUIRED'));
  }

  // Validate script first
  const validation = sieve.validate(content);
  if (!validation.valid) {
    throw Boom.badRequest(
      ctx.translateError('SIEVE_INVALID_SCRIPT', validation.errors[0].message)
    );
  }

  try {
    const ast = sieve.parse(content);
    const engine = new sieve.SieveEngine({
      capabilities: sieve.SUPPORTED_CAPABILITIES
    });

    const result = await engine.execute(ast, message, {
      testMode: true
    });

    ctx.body = {
      object: 'sieve_test_result',
      actions: result.actions,
      matched:
        result.actions.length > 0 &&
        !result.actions.every((a) => a.type === 'keep' && a.implicit),
      variables: result.variables,
      flags: result.flags
    };
  } catch (err) {
    throw Boom.badRequest(
      ctx.translateError('SIEVE_EXECUTION_ERROR', err.message)
    );
  }
}

/**
 * List all Sieve scripts for an alias
 * GET /v1/domains/:domain_id/aliases/:alias_id/sieve
 */
async function listScripts(ctx) {
  const { alias } = ctx.state;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  const scripts = await SieveScripts.find({ alias: alias._id })
    .sort({ is_active: -1, updated_at: -1 })
    .lean()
    .exec();

  ctx.body = scripts.map((script) => ({
    object: 'sieve_script',
    id: script._id.toString(),
    name: script.name,
    description: script.description,
    is_active: script.is_active,
    is_valid: script.is_valid,
    required_capabilities: script.required_capabilities,
    security_warnings: script.security_warnings,
    stats: script.stats,
    created_at: script.created_at,
    updated_at: script.updated_at
  }));
}

/**
 * Get a specific Sieve script
 * GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id
 */
async function getScript(ctx) {
  const { alias } = ctx.state;
  const { script_id: scriptId } = ctx.params;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  // Support lookup by ID or name
  const query = { alias: alias._id };
  if (mongoose.isObjectIdOrHexString(scriptId)) {
    query._id = scriptId;
  } else {
    query.name = scriptId;
  }

  const script = await SieveScripts.findOne(query).lean().exec();

  if (!script) {
    throw Boom.notFound(ctx.translateError('SIEVE_SCRIPT_NOT_FOUND'));
  }

  ctx.body = {
    object: 'sieve_script',
    id: script._id.toString(),
    name: script.name,
    content: script.content,
    description: script.description,
    is_active: script.is_active,
    is_valid: script.is_valid,
    required_capabilities: script.required_capabilities,
    security_warnings: script.security_warnings,
    validation_errors: script.validation_errors,
    stats: script.stats,
    created_at: script.created_at,
    updated_at: script.updated_at
  };
}

/**
 * Create or update a Sieve script
 * PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id
 */
async function putScript(ctx) {
  const { alias, domain, user } = ctx.state;
  const { script_id: scriptId } = ctx.params;
  const { content, description, activate } = ctx.request.body;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  if (!isSANB(content)) {
    throw Boom.badRequest(ctx.translateError('SIEVE_SCRIPT_REQUIRED'));
  }

  // Validate script syntax
  const validation = sieve.validate(content);
  if (!validation.valid) {
    throw Boom.badRequest(
      ctx.translateError('SIEVE_INVALID_SCRIPT', validation.errors[0].message)
    );
  }

  // Security validation
  const securityValidator = new sieve.SieveSecurityValidator({
    maxScriptSize: config.sieve.maxScriptSize,
    maxNestedDepth: config.sieve.maxNestedDepth,
    maxRedirects: config.sieve.maxRedirects,
    // Allow redirects to the user's own domains
    allowedRedirectDomains: await getUserDomains(user._id)
  });

  const securityResult = securityValidator.validate(content);
  if (!securityResult.valid) {
    throw Boom.badRequest(
      ctx.translateError(
        'SIEVE_SECURITY_ERROR',
        securityResult.errors[0].message
      )
    );
  }

  // Check script count limit
  const scriptCount = await SieveScripts.countDocuments({ alias: alias._id });
  // Support lookup by ID or name
  const query = { alias: alias._id };
  if (mongoose.isObjectIdOrHexString(scriptId)) {
    query._id = scriptId;
  } else {
    query.name = scriptId;
  }

  const existingScript = await SieveScripts.findOne(query);

  if (!existingScript && scriptCount >= config.sieve.maxScripts) {
    throw Boom.badRequest(ctx.translateError('SIEVE_MAX_SCRIPTS_EXCEEDED'));
  }

  let script;
  if (existingScript) {
    // Update existing script
    existingScript.content = content;
    if (isSANB(description)) {
      existingScript.description = description;
    }

    existingScript.last_modified_by = 'api';
    script = await existingScript.save();
  } else {
    // Create new script
    script = await SieveScripts.create({
      alias: alias._id,
      user: user._id,
      domain: domain._id,
      name: scriptId,
      content,
      description: description || '',
      is_active: false,
      created_by: 'api',
      last_modified_by: 'api'
    });
  }

  // Activate if requested
  if (activate) {
    await SieveScripts.activateScript(alias._id, script.name);
    script = await SieveScripts.findById(script._id).lean().exec();
  }

  ctx.body = {
    object: 'sieve_script',
    id: script._id.toString(),
    name: script.name,
    description: script.description,
    is_active: script.is_active,
    is_valid: script.is_valid,
    required_capabilities: script.required_capabilities,
    security_warnings: script.security_warnings,
    created_at: script.created_at,
    updated_at: script.updated_at
  };
}

/**
 * Delete a Sieve script
 * DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id
 */
async function deleteScript(ctx) {
  const { alias } = ctx.state;
  const { script_id: scriptId } = ctx.params;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  // Support lookup by ID or name
  const query = { alias: alias._id };
  if (mongoose.isObjectIdOrHexString(scriptId)) {
    query._id = scriptId;
  } else {
    query.name = scriptId;
  }

  const script = await SieveScripts.findOne(query);

  if (!script) {
    throw Boom.notFound(ctx.translateError('SIEVE_SCRIPT_NOT_FOUND'));
  }

  if (script.is_active) {
    throw Boom.badRequest(ctx.translateError('SIEVE_CANNOT_DELETE_ACTIVE'));
  }

  await SieveScripts.deleteOne({ _id: script._id });

  ctx.body = {
    object: 'sieve_script',
    id: script._id.toString(),
    deleted: true
  };
}

/**
 * Activate a Sieve script
 * POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate
 */
async function activateScript(ctx) {
  const { alias } = ctx.state;
  const { script_id: scriptId } = ctx.params;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  // Support lookup by ID or name
  let scriptName = scriptId;
  if (mongoose.isObjectIdOrHexString(scriptId)) {
    const existingScript = await SieveScripts.findOne({
      alias: alias._id,
      _id: scriptId
    });
    if (!existingScript) {
      throw Boom.notFound(ctx.translateError('SIEVE_SCRIPT_NOT_FOUND'));
    }

    scriptName = existingScript.name;
  }

  const script = await SieveScripts.activateScript(alias._id, scriptName);

  ctx.body = {
    object: 'sieve_script',
    id: script._id.toString(),
    name: script.name,
    is_active: script.is_active
  };
}

/**
 * Deactivate all Sieve scripts for an alias
 * POST /v1/domains/:domain_id/aliases/:alias_id/sieve/deactivate
 */
async function deactivateScripts(ctx) {
  const { alias } = ctx.state;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  await SieveScripts.deactivateAll(alias._id);

  ctx.body = {
    object: 'sieve_deactivation',
    success: true
  };
}

/**
 * Get the active Sieve script for an alias
 * GET /v1/domains/:domain_id/aliases/:alias_id/sieve/active
 */
async function getActiveScript(ctx) {
  const { alias } = ctx.state;

  // Check if IMAP is enabled - Sieve requires IMAP
  if (!alias.has_imap) {
    throw Boom.badRequest(ctx.translateError('SIEVE_REQUIRES_IMAP'));
  }

  // Check if alias is domain-wide (catch-all) - not allowed for Sieve
  if (alias.name === '*' || alias.name.startsWith('*@')) {
    throw Boom.badRequest(ctx.translateError('SIEVE_NOT_ALLOWED_FOR_CATCHALL'));
  }

  const script = await SieveScripts.getActiveScript(alias._id);

  if (!script) {
    ctx.body = {
      object: 'sieve_active_script',
      active: false
    };
    return;
  }

  ctx.body = {
    object: 'sieve_active_script',
    active: true,
    id: script._id.toString(),
    name: script.name,
    content: script.content,
    description: script.description,
    required_capabilities: script.required_capabilities,
    stats: script.stats
  };
}

/**
 * Helper to get all validated domains for a user (for redirect validation)
 * Only returns domains that:
 * - Have the user as a member
 * - Have has_txt_record: true (domain is verified)
 * - Are on enhanced_protection or team plan (required for IMAP/Sieve)
 */
async function getUserDomains(userId) {
  const domains = await Domains.find({
    'members.user': userId,
    has_txt_record: true,
    plan: { $in: ['enhanced_protection', 'team'] }
  })
    .select('name')
    .lean()
    .exec();

  return domains.map((d) => d.name);
}

module.exports = {
  // Route-compatible names
  list: listScripts,
  capabilities: getCapabilities,
  validate: validateScript,
  retrieve: getScript,
  create: putScript,
  update: putScript,
  remove: deleteScript,
  activate: activateScript,
  deactivate: deactivateScripts,
  // Original names for internal use
  getCapabilities,
  validateScript,
  testScript,
  listScripts,
  getScript,
  putScript,
  deleteScript,
  activateScript,
  deactivateScripts,
  getActiveScript
};
