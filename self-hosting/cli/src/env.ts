import { randomBytes } from 'node:crypto';

export const TEMPLATE_HOST = 'mail.example.com';

const SECRETS: Record<string, number> = {
  HELPER_ENCRYPTION_KEY: 16,
  SRS_SECRET: 16,
  API_SECRETS: 32,
  TXT_ENCRYPTION_KEY: 16,
  WEBHOOK_SIGNATURE_KEY: 16
};

export type EnvOptions = {
  mailHost: string;
  version: string;
  // host ports, when the defaults (25, 465, 993, 443) are taken
  ports?: Partial<Record<'MX_HOST_PORT' | 'SMTP_HOST_PORT' | 'IMAP_HOST_PORT' | 'HTTPS_HOST_PORT', number>>;
};

// the .env of a new install: the template with its host, version and newly
// generated secrets
export function renderEnv(opts: EnvOptions, tpl: string): string {
  let env = tpl.split(TEMPLATE_HOST).join(opts.mailHost);
  for (const [key, bytes] of Object.entries(SECRETS))
    env = setKey(env, key, randomBytes(bytes).toString('hex'));
  env = setKey(env, 'FE_VERSION', opts.version);
  for (const [key, port] of Object.entries(opts.ports ?? {}))
    if (port) env = setKey(env, key, String(port));
  return env;
}

// sets `KEY=value`, replacing the line of KEY or adding one
export function setKey(env: string, key: string, value: string): string {
  const re = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  if (re.test(env)) return env.replace(re, line);
  return `${env.replace(/\n*$/, '\n')}${line}\n`;
}

export function getKey(env: string, key: string): string | undefined {
  const m = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return m?.[1].trim();
}
