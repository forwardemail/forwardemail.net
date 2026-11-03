/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { getVariableReferences } = require('./variable-references');

// RFC 5228 tests that are part of the base language.  They do not need a
// require statement, although accepting one is harmless for compatibility.
const CORE_CAPABILITIES = Object.freeze([
  'address',
  'allof',
  'anyof',
  'exists',
  'false',
  'header',
  'not',
  'size',
  'true'
]);

// This is the sole advertised capability manifest.  Every entry has an
// execution path in the delivery integration, not just parser support.
// ("redirect" is part of the base language; declaring it is accepted as a
// no-op for older scripts.)
const SUPPORTED_CAPABILITIES = Object.freeze([
  'body',
  'comparator-i;ascii-casemap',
  'comparator-i;ascii-numeric',
  'comparator-i;octet',
  'copy',
  'date',
  'duplicate',
  'editheader',
  'encoded-character',
  'enotify',
  'envelope',
  'ereject',
  'environment',
  'extracttext',
  'fileinto',
  'foreverypart',
  'ihave',
  'imap4flags',
  'index',
  'mailbox',
  'mime',
  'redirect',
  'reject',
  'relational',
  'regex',
  'replace',
  'special-use',
  'subaddress',
  'vacation',
  'vacation-seconds',
  'variables'
]);

const SUPPORTED_CAPABILITY_SET = new Set(SUPPORTED_CAPABILITIES);
const CORE_CAPABILITY_SET = new Set(CORE_CAPABILITIES);

// Capabilities that declaring another one enables too: "vacation-seconds"
// implies "vacation" (RFC 6131 section 2), and "mime" has always enabled
// all the RFC 5703 commands here.
const IMPLIED_CAPABILITIES = {
  mime: ['extracttext', 'foreverypart', 'replace'],
  'vacation-seconds': ['vacation']
};

// Comparators that need no require (RFC 5228 section 2.7.3)
const BASE_COMPARATORS = new Set(['i;ascii-casemap', 'i;octet']);

// Extensions that "ihave" cannot enable (RFC 5463 section 4)
const NOT_IHAVE_CAPABILITIES = new Set(['encoded-character', 'variables']);

function getCapability(value) {
  const capability = typeof value === 'string' ? value.toLowerCase() : '';

  // `enotify` is the RFC capability name.  Older generated scripts may use
  // `notify`, so accept it as an input alias without advertising it.
  return capability === 'notify' ? 'enotify' : capability;
}

function isSupportedCapability(capability) {
  const value = getCapability(capability);
  return CORE_CAPABILITY_SET.has(value) || SUPPORTED_CAPABILITY_SET.has(value);
}

function addUnsupported(context, location, feature, reason) {
  context.unsupported.push({ location, feature, reason });
}

//
// Note that a capability is used; it is an error unless it was declared
// with require (or enabled by an earlier "ihave" test, RFC 5463 section 3)
//
function addRequirement(context, capability, location, reason) {
  const value = getCapability(capability);
  if (!context.requirements.has(value)) {
    context.requirements.set(value, {
      capability: value,
      location,
      reason
    });
  }

  if (!context.enabled.has(value) && !context.missing.has(value)) {
    context.missing.add(value);
    addUnsupported(
      context,
      location,
      value,
      `${reason} but it is not declared with require`
    );
  }
}

// comparators other than the base ones are extensions (RFC 5228 2.7.3)
function inspectComparator(node, context) {
  const comparator =
    typeof node.comparator === 'string' ? node.comparator.toLowerCase() : '';
  if (comparator && !BASE_COMPARATORS.has(comparator)) {
    addRequirement(
      context,
      `comparator-${comparator}`,
      node.location,
      `uses the ${comparator} comparator`
    );
  }
}

// RFC 5435 section 6
function inspectModifiers(node, context) {
  if ((node.modifiers || []).includes('encodeurl')) {
    addRequirement(context, 'enotify', node.location, 'uses :encodeurl');
  }
}

function inspectStringCapabilities(value, context, seen) {
  if (typeof value === 'string') {
    const names = getVariableReferences(value);
    if (names.length > 0) {
      addRequirement(context, 'variables', null, 'uses variable interpolation');
    }

    // no supported extension defines a namespace (RFC 5229 section 3)
    for (const name of names) {
      if (name.includes('.')) {
        addUnsupported(
          context,
          null,
          'variables',
          `"\${${name}}" references an unknown namespace`
        );
      }
    }

    return;
  }

  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);

  for (const child of Object.values(value)) {
    inspectStringCapabilities(child, context, seen);
  }
}

function inspectTest(test, context) {
  if (!test) return;

  inspectComparator(test, context);

  if (test.matchType === 'regex') {
    addRequirement(context, 'regex', test.location, 'uses :regex');
  }

  if (
    typeof test.matchType === 'object' &&
    (test.matchType.type === 'count' || test.matchType.type === 'value')
  ) {
    addRequirement(
      context,
      'relational',
      test.location,
      'uses a relational match type'
    );
  }

  // (header, address and date; the :last of duplicate is its own)
  if (test.index) {
    addRequirement(context, 'index', test.location, 'uses :index');
  }

  if (test.mime || test.anychild) {
    addRequirement(context, 'mime', test.location, 'uses :mime');
  }

  switch (test.type) {
    case 'AllofTest':
    case 'AnyofTest': {
      for (const child of test.tests) inspectTest(child, context);
      break;
    }

    case 'NotTest': {
      inspectTest(test.test, context);
      break;
    }

    case 'AddressTest':
    case 'EnvelopeTest': {
      if (test.type === 'EnvelopeTest') {
        addRequirement(context, 'envelope', test.location, 'uses envelope');
      }

      if (test.addressPart === 'user' || test.addressPart === 'detail') {
        addRequirement(
          context,
          'subaddress',
          test.location,
          `uses :${test.addressPart}`
        );
      }

      break;
    }

    case 'BodyTest': {
      addRequirement(context, 'body', test.location, 'uses body');
      break;
    }

    case 'DateTest':
    case 'CurrentdateTest': {
      addRequirement(context, 'date', test.location, 'uses date');
      break;
    }

    case 'HasflagTest': {
      addRequirement(context, 'imap4flags', test.location, 'uses hasflag');
      break;
    }

    case 'StringTest': {
      addRequirement(context, 'variables', test.location, 'uses string');
      break;
    }

    case 'EnvironmentTest': {
      addRequirement(context, 'environment', test.location, 'uses environment');
      break;
    }

    case 'DuplicateTest': {
      addRequirement(context, 'duplicate', test.location, 'uses duplicate');
      break;
    }

    case 'IhaveTest': {
      addRequirement(context, 'ihave', test.location, 'uses ihave');
      // extension checks are left to run time from here on (RFC 5463
      // section 3)
      context.ihave = true;
      for (const capability of test.capabilities) {
        const value = getCapability(capability);
        if (!NOT_IHAVE_CAPABILITIES.has(value)) context.enabled.add(value);
      }

      break;
    }

    case 'MailboxexistsTest': {
      addRequirement(context, 'mailbox', test.location, 'uses mailboxexists');
      break;
    }

    case 'MetadataTest':
    case 'MetadataexistsTest': {
      addUnsupported(
        context,
        test.location,
        test.type === 'MetadataTest' ? 'metadata' : 'metadataexists',
        'IMAP metadata checks are not implemented'
      );
      break;
    }

    case 'SpecialuseexistsTest': {
      addRequirement(
        context,
        'special-use',
        test.location,
        'uses specialuse_exists'
      );
      break;
    }

    case 'ValidextlistTest': {
      addUnsupported(
        context,
        test.location,
        'valid_ext_list',
        'external list checks are not implemented'
      );
      break;
    }

    case 'ValidNotifyMethodTest':
    case 'NotifyMethodCapabilityTest': {
      addRequirement(
        context,
        'enotify',
        test.location,
        test.type === 'ValidNotifyMethodTest'
          ? 'uses valid_notify_method'
          : 'uses notify_method_capability'
      );
      break;
    }

    // (parsed only so that "ihave" can guard it, RFC 5463)
    case 'UnknownTest': {
      if (!context.ihave) {
        addUnsupported(context, test.location, test.name, 'unknown test');
      }

      break;
    }

    default: {
      break;
    }
  }
}

function inspectCommand(command, context) {
  switch (command.type) {
    case 'Keep': {
      if ((command.flags || []).length > 0) {
        addRequirement(context, 'imap4flags', command.location, 'uses :flags');
      }

      break;
    }

    case 'If': {
      inspectTest(command.test, context);
      for (const child of command.block) {
        inspectCommand(child, context);
      }

      for (const branch of command.elsif || []) {
        inspectTest(branch.test, context);
        for (const child of branch.block) {
          inspectCommand(child, context);
        }
      }

      for (const child of command.else || []) {
        inspectCommand(child, context);
      }

      break;
    }

    case 'Fileinto': {
      addRequirement(context, 'fileinto', command.location, 'uses fileinto');
      if (command.copy) {
        addRequirement(context, 'copy', command.location, 'uses :copy');
      }

      if (command.specialuse) {
        addRequirement(
          context,
          'special-use',
          command.location,
          'uses :specialuse'
        );
      }

      if ((command.flags || []).length > 0) {
        addRequirement(context, 'imap4flags', command.location, 'uses :flags');
      }

      if (command.create) {
        addRequirement(context, 'mailbox', command.location, 'uses :create');
      }

      break;
    }

    case 'Redirect': {
      // `redirect` is an RFC 5228 base-language action and must not need a
      // require declaration.  Declaring it is still accepted for clients that
      // already emit `require ["redirect"]`.
      if (command.copy) {
        addRequirement(context, 'copy', command.location, 'uses :copy');
      }

      break;
    }

    case 'Reject': {
      addRequirement(context, 'reject', command.location, 'uses reject');
      break;
    }

    case 'Ereject': {
      addRequirement(context, 'ereject', command.location, 'uses ereject');
      break;
    }

    case 'Vacation': {
      addRequirement(context, 'vacation', command.location, 'uses vacation');
      if (command.seconds !== null && command.seconds !== undefined) {
        addRequirement(
          context,
          'vacation-seconds',
          command.location,
          'uses :seconds'
        );
      }

      break;
    }

    case 'Set': {
      addRequirement(context, 'variables', command.location, 'uses set');
      inspectModifiers(command, context);
      break;
    }

    case 'Setflag':
    case 'Addflag':
    case 'Removeflag': {
      addRequirement(
        context,
        'imap4flags',
        command.location,
        `uses ${command.type.toLowerCase()}`
      );
      break;
    }

    case 'Addheader':
    case 'Deleteheader': {
      addRequirement(
        context,
        'editheader',
        command.location,
        `uses ${command.type.toLowerCase()}`
      );
      inspectComparator(command, context);
      break;
    }

    case 'Notify': {
      addRequirement(context, 'enotify', command.location, 'uses notify');
      break;
    }

    case 'Foreverypart':
    case 'Break': {
      addRequirement(
        context,
        'foreverypart',
        command.location,
        `uses ${command.type.toLowerCase()}`
      );
      if (command.type === 'Foreverypart') {
        for (const child of command.block) {
          inspectCommand(child, context);
        }
      }

      break;
    }

    case 'Replace': {
      addRequirement(context, 'replace', command.location, 'uses replace');
      break;
    }

    case 'Extracttext': {
      addRequirement(
        context,
        'extracttext',
        command.location,
        'uses extracttext'
      );
      addRequirement(
        context,
        'variables',
        command.location,
        'extracttext stores a variable'
      );
      inspectModifiers(command, context);
      break;
    }

    case 'Enclose': {
      addUnsupported(
        context,
        command.location,
        'enclose',
        'message enclosure delivery is not implemented'
      );
      break;
    }

    case 'Error': {
      addRequirement(context, 'ihave', command.location, 'uses error');
      break;
    }

    // (parsed only so that "ihave" can guard it, RFC 5463)
    case 'UnknownCommand': {
      if (!context.ihave) {
        addUnsupported(
          context,
          command.location,
          command.name,
          'unknown command'
        );
      }

      break;
    }

    default: {
      break;
    }
  }
}

function validateSieveCapabilities(ast) {
  if (!ast || !Array.isArray(ast.commands)) {
    return {
      valid: false,
      declared: [],
      required: [],
      unsupported: [
        {
          feature: 'script',
          reason: 'script did not parse into a command list'
        }
      ],
      errors: ['Sieve script did not parse into a command list']
    };
  }

  const declared = new Set();
  const context = {
    requirements: new Map(),
    unsupported: [],
    // declared capabilities and the ones they imply
    enabled: new Set(),
    // capabilities reported as not declared
    missing: new Set(),
    // whether an "ihave" test came before
    ihave: false
  };

  for (const command of ast.commands) {
    if (command.type !== 'Require') continue;

    for (const capability of command.capabilities || []) {
      const value = getCapability(capability);
      declared.add(value);
      context.enabled.add(value);
      for (const implied of Object.hasOwn(IMPLIED_CAPABILITIES, value)
        ? IMPLIED_CAPABILITIES[value]
        : []) {
        context.enabled.add(implied);
      }

      if (!isSupportedCapability(value)) {
        addUnsupported(
          context,
          command.location,
          value || String(capability),
          'capability is not available'
        );
      }
    }
  }

  for (const command of ast.commands) {
    if (command.type !== 'Require') {
      inspectCommand(command, context);
    }
  }

  inspectStringCapabilities(ast, context, new Set());

  const errors = context.unsupported.map(
    (entry) => `Unsupported Sieve feature "${entry.feature}": ${entry.reason}`
  );

  return {
    valid: errors.length === 0,
    declared: [...declared],
    required: [...context.requirements.keys()],
    unsupported: context.unsupported,
    errors
  };
}

module.exports = {
  CORE_CAPABILITIES,
  SUPPORTED_CAPABILITIES,
  getCapability,
  isSupportedCapability,
  validateSieveCapabilities
};
