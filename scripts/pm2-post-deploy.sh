#!/usr/bin/env bash
set -euo pipefail

ECOSYSTEM_FILE="${1:?Missing ecosystem file}"
ENV_NAME="${2:-production}"

PNPM_VERSION="$(node -p "const pkg = require('./package.json'); const match = pkg.packageManager && pkg.packageManager.match(/^pnpm@(.*)$/); if (!match) throw new Error('Missing pnpm packageManager version in package.json'); match[1]")"

npm install -g "pnpm@$PNPM_VERSION"
hash -r || true
pnpm install --frozen-lockfile
NODE_ENV=production npm start build
pm2 startOrGracefulReload "$ECOSYSTEM_FILE" --env "$ENV_NAME" --update-env
