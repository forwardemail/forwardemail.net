//
// An install is a directory holding everything the mail server needs:
//
//   forwardemail.json   what `init` chose (this file)
//   docker-compose.yml  the lite compose file of this CLI's version
//   .env                configuration and secrets
//   ssl/                certificate, key and DKIM key
//   data/               mailboxes, MongoDB and Redis
//

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { CliError } from './util.ts';

export type Install = {
  dir: string;
  mailHost: string;
  domain: string;
  version: string;
  tls: 'letsencrypt' | 'self-signed' | 'existing';
  createdAt: string;
};

export const STATE_FILE = 'forwardemail.json';

export function defaultDir(): string {
  return process.env.FORWARDEMAIL_DIR || path.join(os.homedir(), 'forwardemail');
}

export function loadInstall(dir = defaultDir()): Install {
  const file = path.join(dir, STATE_FILE);
  if (!fs.existsSync(file))
    throw new CliError(
      `No install at ${dir} (run \`forwardemail-selfhost init\` first, or pass --dir)`
    );
  return { ...JSON.parse(fs.readFileSync(file, 'utf8')), dir };
}

export function saveInstall(install: Install): void {
  const { dir, ...rest } = install;
  fs.writeFileSync(path.join(dir, STATE_FILE), JSON.stringify(rest, null, 2) + '\n');
}
