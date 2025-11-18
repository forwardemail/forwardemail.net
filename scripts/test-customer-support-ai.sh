#!/usr/bin/env bash

# Test script for customer support AI
# Workaround for npx ava issues with better-sqlite3 override

set -e

cd "$(dirname "$0")/.."

NODE_ENV=test node node_modules/.pnpm/ava@5.3.1/node_modules/ava/entrypoints/cli.mjs test/customer-support-ai "$@"
