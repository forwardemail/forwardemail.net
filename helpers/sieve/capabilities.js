/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
const SUPPORTED_CAPABILITIES = Object.freeze([
  'body',
  'comparator-i;ascii-casemap',
  'comparator-i;octet',
  'copy',
  'date',
  'duplicate',
  'editheader',
  'enotify',
  'envelope',
  'ereject',
  'environment',
  'fileinto',
  'ihave',
  'imap4flags',
  'index',
  'mailbox',
  'mime',
  'redirect',
  'reject',
  'relational',
  'regex',
  'special-use',
  'subaddress',
  'vacation',
  'vacation-seconds',
  'variables'
]);

const SUPPORTED_CAPABILITY_SET = new Set(SUPPORTED_CAPABILITIES);
const CORE_CAPABILITY_SET = new Set(CORE_CAPABILITIES);

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

function addRequirement(requirements, capability, location, reason) {
  const value = getCapability(capability);
  if (!requirements.has(value)) {
    requirements.set(value, {
      capability: value,
      location,
      reason
    });
  }
}

function addUnsupported(unsupported, location, feature, reason) {
  unsupported.push({ location, feature, reason });
}

function inspectStringCapabilities(value, requirements, unsupported, seen) {
  if (typeof value === 'string') {
    if (/\${hex:/i.test(value)) {
      addUnsupported(
        unsupported,
        null,
        'encoded-character',
        'encoded-character syntax is not implemented'
      );
    }

    if (/\${(?!hex:)[^}]+}/i.test(value)) {
      addRequirement(
        requirements,
        'variables',
        null,
        'uses variable interpolation'
      );
    }

    return;
  }

  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);

  for (const child of Object.values(value)) {
    inspectStringCapabilities(child, requirements, unsupported, seen);
  }
}

function inspectTest(test, requirements, unsupported) {
  if (!test) return;

  if (test.comparator === 'i;octet') {
    addRequirement(
      requirements,
      'comparator-i;octet',
      test.location,
      'uses the i;octet comparator'
    );
  }

  if (test.matchType === 'regex') {
    addRequirement(requirements, 'regex', test.location, 'uses :regex');
  }

  if (
    typeof test.matchType === 'object' &&
    (test.matchType.type === 'count' || test.matchType.type === 'value')
  ) {
    addRequirement(
      requirements,
      'relational',
      test.location,
      'uses a relational match type'
    );
  }

  if (test.index || test.last) {
    addRequirement(
      requirements,
      'index',
      test.location,
      'uses :index or :last'
    );
  }

  switch (test.type) {
    case 'AllofTest':
    case 'AnyofTest': {
      for (const child of test.tests)
        inspectTest(child, requirements, unsupported);
      break;
    }

    case 'NotTest': {
      inspectTest(test.test, requirements, unsupported);
      break;
    }

    case 'AddressTest': {
      if (test.addressPart === 'user' || test.addressPart === 'detail') {
        addRequirement(
          requirements,
          'subaddress',
          test.location,
          `uses :${test.addressPart}`
        );
      }

      if (test.mime) {
        addRequirement(requirements, 'mime', test.location, 'uses :mime');
      }

      break;
    }

    case 'HeaderTest':
    case 'ExistsTest': {
      if (test.mime) {
        addRequirement(requirements, 'mime', test.location, 'uses :mime');
      }

      break;
    }

    case 'EnvelopeTest': {
      addRequirement(requirements, 'envelope', test.location, 'uses envelope');
      break;
    }

    case 'BodyTest': {
      addRequirement(requirements, 'body', test.location, 'uses body');
      break;
    }

    case 'DateTest':
    case 'CurrentdateTest': {
      addRequirement(requirements, 'date', test.location, 'uses date');
      break;
    }

    case 'HasflagTest': {
      addRequirement(requirements, 'imap4flags', test.location, 'uses hasflag');
      break;
    }

    case 'StringTest': {
      addRequirement(requirements, 'variables', test.location, 'uses string');
      break;
    }

    case 'EnvironmentTest': {
      addRequirement(
        requirements,
        'environment',
        test.location,
        'uses environment'
      );
      break;
    }

    case 'DuplicateTest': {
      addRequirement(
        requirements,
        'duplicate',
        test.location,
        'uses duplicate'
      );
      break;
    }

    case 'IhaveTest': {
      addRequirement(requirements, 'ihave', test.location, 'uses ihave');
      break;
    }

    case 'MailboxexistsTest': {
      addUnsupported(
        unsupported,
        test.location,
        'mailboxexists',
        'live mailbox existence checks are not implemented'
      );
      break;
    }

    case 'MetadataTest':
    case 'MetadataexistsTest': {
      addUnsupported(
        unsupported,
        test.location,
        test.type === 'MetadataTest' ? 'metadata' : 'metadataexists',
        'IMAP metadata checks are not implemented'
      );
      break;
    }

    case 'SpecialuseexistsTest': {
      addRequirement(
        requirements,
        'special-use',
        test.location,
        'uses specialuse_exists'
      );
      break;
    }

    case 'ValidextlistTest': {
      addUnsupported(
        unsupported,
        test.location,
        'valid_ext_list',
        'external list checks are not implemented'
      );
      break;
    }

    default: {
      break;
    }
  }
}

function inspectCommand(command, requirements, unsupported) {
  switch (command.type) {
    case 'Keep': {
      if ((command.flags || []).length > 0) {
        addRequirement(
          requirements,
          'imap4flags',
          command.location,
          'uses :flags'
        );
      }

      break;
    }

    case 'If': {
      inspectTest(command.test, requirements, unsupported);
      for (const child of command.block) {
        inspectCommand(child, requirements, unsupported);
      }

      for (const branch of command.elsif || []) {
        inspectTest(branch.test, requirements, unsupported);
        for (const child of branch.block) {
          inspectCommand(child, requirements, unsupported);
        }
      }

      for (const child of command.else || []) {
        inspectCommand(child, requirements, unsupported);
      }

      break;
    }

    case 'Fileinto': {
      addRequirement(
        requirements,
        'fileinto',
        command.location,
        'uses fileinto'
      );
      if (command.copy) {
        addRequirement(requirements, 'copy', command.location, 'uses :copy');
      }

      if (command.specialuse) {
        addRequirement(
          requirements,
          'special-use',
          command.location,
          'uses :specialuse'
        );
      }

      if ((command.flags || []).length > 0) {
        addRequirement(
          requirements,
          'imap4flags',
          command.location,
          'uses :flags'
        );
      }

      if (command.create) {
        addRequirement(
          requirements,
          'mailbox',
          command.location,
          'uses :create'
        );
      }

      break;
    }

    case 'Redirect': {
      addRequirement(
        requirements,
        'redirect',
        command.location,
        'uses redirect'
      );
      if (command.copy) {
        addRequirement(requirements, 'copy', command.location, 'uses :copy');
      }

      break;
    }

    case 'Reject': {
      addRequirement(requirements, 'reject', command.location, 'uses reject');
      break;
    }

    case 'Ereject': {
      addRequirement(requirements, 'ereject', command.location, 'uses ereject');
      break;
    }

    case 'Vacation': {
      addRequirement(
        requirements,
        'vacation',
        command.location,
        'uses vacation'
      );
      if (command.seconds !== null && command.seconds !== undefined) {
        addRequirement(
          requirements,
          'vacation-seconds',
          command.location,
          'uses :seconds'
        );
      }

      break;
    }

    case 'Set': {
      addRequirement(requirements, 'variables', command.location, 'uses set');
      break;
    }

    case 'Setflag':
    case 'Addflag':
    case 'Removeflag': {
      addRequirement(
        requirements,
        'imap4flags',
        command.location,
        `uses ${command.type.toLowerCase()}`
      );
      break;
    }

    case 'Addheader':
    case 'Deleteheader': {
      addRequirement(
        requirements,
        'editheader',
        command.location,
        `uses ${command.type.toLowerCase()}`
      );
      break;
    }

    case 'Notify': {
      addRequirement(requirements, 'enotify', command.location, 'uses notify');
      break;
    }

    case 'Foreverypart':
    case 'Break':
    case 'Replace': {
      addRequirement(
        requirements,
        'mime',
        command.location,
        `uses ${command.type.toLowerCase()}`
      );
      if (command.type === 'Foreverypart') {
        for (const child of command.block) {
          inspectCommand(child, requirements, unsupported);
        }
      }

      break;
    }

    case 'Extracttext': {
      addRequirement(
        requirements,
        'mime',
        command.location,
        'uses extracttext'
      );
      addRequirement(
        requirements,
        'variables',
        command.location,
        'extracttext stores a variable'
      );
      break;
    }

    case 'Enclose': {
      addUnsupported(
        unsupported,
        command.location,
        'enclose',
        'message enclosure delivery is not implemented'
      );
      break;
    }

    default: {
      break;
    }
  }
}

function validateSieveCapabilities(ast) {
  const requirements = new Map();
  const unsupported = [];
  const declared = new Set();

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

  for (const command of ast.commands) {
    if (command.type !== 'Require') continue;

    for (const capability of command.capabilities || []) {
      const value = getCapability(capability);
      declared.add(value);
      if (!isSupportedCapability(value)) {
        addUnsupported(
          unsupported,
          command.location,
          value || String(capability),
          'capability is not available'
        );
      }
    }
  }

  for (const command of ast.commands) {
    if (command.type !== 'Require') {
      inspectCommand(command, requirements, unsupported);
    }
  }

  inspectStringCapabilities(ast, requirements, unsupported, new Set());

  for (const requirement of requirements.values()) {
    if (!declared.has(requirement.capability)) {
      addUnsupported(
        unsupported,
        requirement.location,
        requirement.capability,
        `${requirement.reason} but it is not declared with require`
      );
    }
  }

  const errors = unsupported.map(
    (entry) => `Unsupported Sieve feature "${entry.feature}": ${entry.reason}`
  );

  return {
    valid: errors.length === 0,
    declared: [...declared],
    required: [...requirements.keys()],
    unsupported,
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
