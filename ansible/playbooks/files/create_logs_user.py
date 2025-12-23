#!/usr/bin/env python3
"""
Create MongoDB user for Logs database with credentials from environment variables.
This script creates a JavaScript file for mongosh execution.
IMPROVED VERSION with better error handling and debugging.
"""

import os
import json
import sys

def main():
    # Get credentials from environment
    username = os.environ.get('LOGS_USER', '')
    password = os.environ.get('LOGS_PASS', '')

    # Debug output (will be visible in Ansible logs)
    print(f"DEBUG: LOGS_USER length: {len(username)}")
    print(f"DEBUG: LOGS_PASS length: {len(password)}")

    if not username:
        print("ERROR: LOGS_USER environment variable is not set or empty")
        sys.exit(1)

    if not password:
        print("ERROR: LOGS_PASS environment variable is not set or empty")
        sys.exit(1)

    # Validate username
    if len(username) < 1:
        print("ERROR: LOGS_USER must be at least 1 character")
        sys.exit(1)

    # Validate password
    if len(password) < 8:
        print("ERROR: LOGS_PASS must be at least 8 characters")
        sys.exit(1)

    print(f"INFO: Creating user '{username}' with password of length {len(password)}")

    # Use JSON encoding to properly escape for JavaScript
    username_json = json.dumps(username)
    password_json = json.dumps(password)

    # Build JavaScript code using string concatenation (no f-strings or format)
    script_parts = [
        'try {',
        '  db.getSiblingDB(\'admin\').createUser({',
        '    user: ' + username_json + ',',
        '    pwd: ' + password_json + ',',
        '    roles: [',
        '      { role: "root", db: "admin" },',
        '      { role: "userAdminAnyDatabase", db: "admin" },',
        '      { role: "dbAdminAnyDatabase", db: "admin" },',
        '      { role: "readWriteAnyDatabase", db: "admin" }',
        '    ]',
        '  });',
        '  print("User created successfully");',
        '} catch (e) {',
        '  if (e.code === 51003) {',
        '    print("User already exists");',
        '  } else {',
        '    print("Error creating user: " + e.message + " (code: " + e.code + ")");',
        '    throw e;',
        '  }',
        '}'
    ]

    script = '\n'.join(script_parts)

    # Write with restrictive permissions (owner read/write only)
    try:
        fd = os.open('/tmp/create_logs_user.js', os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(script)
        print("INFO: Script created successfully at /tmp/create_logs_user.js")
    except Exception as e:
        print(f"ERROR: Failed to write script file: {e}")
        sys.exit(1)

    return 0

if __name__ == '__main__':
    sys.exit(main())
