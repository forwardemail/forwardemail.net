#!/usr/bin/env python3
"""
Create MongoDB user with credentials from environment variables.
This script creates a JavaScript file for mongosh execution.
"""

import os
import json
import sys

def main():
    # Get credentials from environment
    username = os.environ.get('MONGO_USER', '')
    password = os.environ.get('MONGO_PASS', '')
    
    if not username or not password:
        print("ERROR: MONGO_USER and MONGO_PASS environment variables must be set")
        sys.exit(1)
    
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
    fd = os.open('/tmp/create_mongo_user.js', os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8') as f:
        f.write(script)
    
    print("Script created successfully")
    return 0

if __name__ == '__main__':
    sys.exit(main())
