import fs from 'node:fs';
import path from 'node:path';

import * as p from '@clack/prompts';

import composeFile from '../../lite/docker-compose.yml';
import envTemplate from '../../lite/env.example';
import { compose } from './docker.ts';
import { getKey, renderEnv, setKey } from './env.ts';
import { defaultDir, loadInstall, saveInstall, STATE_FILE, type Install } from './install.ts';
import { dkimRecordValue, generateDkimKey } from './keys.ts';
import { canConnect, publicIPv4, runPreflight, type Check } from './preflight.ts';
import {
  formatRecord,
  isPublished,
  liteDomainRecords,
  systemRecords,
  type DnsRecord
} from './records.ts';
import { copyCerts, fixPermissions, letsEncrypt, selfSigned } from './tls.ts';
import { CliError, run } from './util.ts';

const IMAGE = 'ghcr.io/forwardemail/forwardemail.net-selfhosted';
const HOSTNAME_RE = /^(?=.{1,253}$)([a-z\d]([a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}$/i;

function cancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Cancelled, nothing was started.');
    process.exit(1);
  }
  return value as T;
}

function printChecks(checks: Check[]): void {
  const icon = { ok: '✔', warn: '▲', fail: '✖' } as const;
  p.note(checks.map((c) => `${icon[c.status]} ${c.name.padEnd(17)} ${c.detail}`).join('\n'), 'Checks');
}

function readDkimRecord(dir: string): string {
  return dkimRecordValue(fs.readFileSync(path.join(dir, 'ssl', 'dkim.key'), 'utf8'));
}

// ---------------------------------------------------------------------------
// init: checks, questions, files, certificate, start, first account
// ---------------------------------------------------------------------------
export async function init(opts: { dir?: string; version?: string }): Promise<void> {
  p.intro(`Forward Email self-hosted setup (lite) ${__VERSION__}`);

  const dir = path.resolve(
    opts.dir ??
      cancelled(
        await p.text({
          message: 'Where should the install live?',
          initialValue: defaultDir()
        })
      )
  );
  if (fs.existsSync(path.join(dir, STATE_FILE)))
    throw new CliError(`${dir} already has an install (use \`status\`, \`up\` or \`upgrade\`, or pick another directory)`);

  const s = p.spinner();
  s.start('Checking this box');
  const checks = await runPreflight({ dir, ports: [25, 465, 993, 443] });
  s.stop('Checked this box');
  printChecks(checks);
  if (checks.some((c) => c.status === 'fail'))
    throw new CliError('Fix the checks marked ✖ and run this again.');
  if (checks.some((c) => c.status === 'warn')) {
    const go = cancelled(await p.confirm({ message: 'Some checks have warnings (▲). Continue anyway?' }));
    if (!go) process.exit(1);
  }

  const domain = cancelled(
    await p.text({
      message: 'Your domain (mail for you@<domain>)',
      placeholder: 'example.com',
      validate: (v) => (HOSTNAME_RE.test(v) ? undefined : 'a domain such as example.com')
    })
  ).toLowerCase();
  const mailHost = cancelled(
    await p.text({
      message: 'Hostname of this mail server (one name for MX, IMAP, SMTP and the web interface)',
      initialValue: `mail.${domain}`,
      validate: (v) => (HOSTNAME_RE.test(v) ? undefined : 'a hostname such as mail.example.com')
    })
  ).toLowerCase();
  const email = cancelled(
    await p.text({
      message: 'Your mailbox address (also your web login)',
      initialValue: `me@${domain}`,
      validate: (v) => (v.endsWith(`@${domain}`) ? undefined : `an address at ${domain}`)
    })
  ).toLowerCase();
  const tls = cancelled(
    await p.select({
      message: 'Certificate',
      options: [
        { value: 'letsencrypt', label: "Let's Encrypt", hint: `${mailHost} must resolve here and port 80 reach this box` },
        { value: 'self-signed', label: 'Self-signed', hint: 'for trying it out on a LAN' },
        { value: 'existing', label: 'Files I already have' }
      ]
    })
  ) as Install['tls'];

  const ip = await publicIPv4();
  const version = opts.version ?? 'latest';
  const image = `${IMAGE}:${version}`;

  // the A record must exist before Let's Encrypt can check it
  if (tls === 'letsencrypt') {
    p.note(
      `${mailHost}  A  ${ip ?? '<this box’s public IPv4 address>'}\n\nand forward ports 80, 25, 465, 993 and 443 on your router to this box.`,
      'Add this DNS record first'
    );
    cancelled(await p.confirm({ message: 'Done?' }));
  }

  fs.mkdirSync(path.join(dir, 'ssl'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docker-compose.yml'), composeFile);
  fs.writeFileSync(path.join(dir, '.env'), renderEnv({ mailHost, version }, envTemplate), { mode: 0o600 });
  fs.writeFileSync(path.join(dir, 'ssl', 'dkim.key'), generateDkimKey(), { mode: 0o600 });

  // an app image that is already here (e.g. one built from a checkout with
  // `--version dev`) is used as it is; only `latest` is always pulled
  const hasLocalImage =
    version !== 'latest' && (await run('docker', ['image', 'inspect', image])).code === 0;
  s.start(hasLocalImage ? `Using the local ${image}, pulling MongoDB and Redis` : `Pulling ${image} (several GB the first time)`);
  const pull = await compose(dir, ['pull', '--quiet', ...(hasLocalImage ? ['mongodb', 'redis'] : [])]);
  if (pull.code !== 0) throw new CliError(`docker compose pull failed:\n${pull.stderr}`);
  s.stop('Pulled the images');

  if (tls === 'letsencrypt') {
    p.log.step(`Getting a certificate for ${mailHost}`);
    await letsEncrypt(dir, mailHost);
  } else if (tls === 'self-signed') {
    await selfSigned(dir, mailHost, image);
  } else {
    const key = cancelled(await p.text({ message: 'Path to the private key (PEM)' }));
    const fullchain = cancelled(await p.text({ message: 'Path to the certificate with its chain (PEM)' }));
    copyCerts(dir, { key, fullchain });
  }

  fixPermissions(dir);

  const install: Install = { dir, mailHost, domain, version, tls, createdAt: new Date().toISOString() };
  saveInstall(install);

  await up({ dir });
  await provision({ dir, email, domain });
  p.outro(`Done. Check DNS any time with \`forwardemail-selfhost doctor --dir ${dir}\`.`);
}

// ---------------------------------------------------------------------------
// up / down / status / logs / upgrade
// ---------------------------------------------------------------------------
export async function up(opts: { dir?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  const s = p.spinner();
  s.start('Starting the mail server (the first start takes a minute or two)');
  const res = await compose(install.dir, ['up', '-d', '--wait']);
  if (res.code !== 0) {
    s.stop('The mail server did not become healthy');
    throw new CliError(`${res.stderr.trim()}\n\nSee \`forwardemail-selfhost logs\` for why.`);
  }
  s.stop('The mail server is running');
}

export async function down(opts: { dir?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  await compose(install.dir, ['down'], { inherit: true });
}

export async function status(opts: { dir?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  console.log(`install: ${install.dir}\nhost:    ${install.mailHost}\ndomain:  ${install.domain}\nversion: ${install.version}\n`);
  await compose(install.dir, ['ps'], { inherit: true });
}

export async function logs(opts: { dir?: string; follow?: boolean }): Promise<void> {
  const install = loadInstall(opts.dir);
  await compose(install.dir, ['logs', '--tail', '200', ...(opts.follow ? ['-f'] : [])], { inherit: true });
}

export async function upgrade(opts: { dir?: string; version?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  const version = opts.version ?? 'latest';
  const envPath = path.join(install.dir, '.env');
  fs.writeFileSync(envPath, setKey(fs.readFileSync(envPath, 'utf8'), 'FE_VERSION', version));
  // (the compose file of this CLI's version, which matches the image it was
  // released with)
  fs.writeFileSync(path.join(install.dir, 'docker-compose.yml'), composeFile);
  const pull = await compose(install.dir, ['pull'], { inherit: true });
  if (pull.code !== 0) throw new CliError('docker compose pull failed');
  saveInstall({ ...install, version });
  await up({ dir: install.dir });
}

// ---------------------------------------------------------------------------
// provision / add-mailbox: accounts through scripts/selfhost-provision.js
// ---------------------------------------------------------------------------
type ProvisionResult = {
  ok: boolean;
  error?: string;
  web: { url: string; email: string; password: string | null };
  mailbox: { address: string; password: string; imap: { host: string }; smtp: { host: string } };
  records: DnsRecord[];
};

async function runProvision(dir: string, args: string[]): Promise<ProvisionResult> {
  const res = await compose(dir, ['exec', '-T', 'app', 'node', 'scripts/selfhost-provision.js', '--json', ...args]);
  // (the script prints one JSON line last; the app may log before it)
  const line = res.stdout.trim().split('\n').reverse().find((l) => l.startsWith('{'));
  if (!line) throw new CliError(`provisioning failed:\n${res.stderr || res.stdout}`);
  const result = JSON.parse(line) as ProvisionResult;
  if (!result.ok) throw new CliError(`provisioning failed: ${result.error}`);
  return result;
}

export async function provision(opts: { dir?: string; email: string; domain?: string; mailbox?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  const domain = opts.domain ?? install.domain;
  const result = await runProvision(install.dir, [
    '--email', opts.email,
    '--domain', domain,
    ...(opts.mailbox ? ['--mailbox', opts.mailbox] : [])
  ]);

  p.note(
    [
      `Web:     ${result.web.url}`,
      `  login    ${result.web.email}`,
      `  password ${result.web.password ?? '(unchanged, the account existed)'}`,
      '',
      `Mailbox: ${result.mailbox.address}`,
      `  password ${result.mailbox.password}   (IMAP and SMTP)`,
      `  IMAP     ${result.mailbox.imap.host}:993  (TLS)`,
      `  SMTP     ${result.mailbox.smtp.host}:465  (TLS)`
    ].join('\n'),
    'Save these now: the passwords cannot be shown again'
  );

  printRecords(install, result.records, await publicIPv4());
}

function printRecords(install: Install, domainRecords: DnsRecord[], ip?: string): void {
  const records = [
    ...systemRecords({ mailHost: install.mailHost, ip, dkim: readDkimRecord(install.dir) }),
    ...liteDomainRecords(domainRecords)
  ];
  fs.writeFileSync(path.join(install.dir, 'dns-records.json'), JSON.stringify(records, null, 2) + '\n');
  // (plain lines, not a box: DKIM keys are long and copied from here)
  p.log.step('DNS records to add at your DNS provider:');
  console.log(`\n${records.map(formatRecord).join('\n')}\n`);
  p.log.info(
    `Mail for ${install.domain} is accepted once its TXT verification record is published. Saved to dns-records.json; check them with \`doctor\`.`
  );
}

// ---------------------------------------------------------------------------
// dns / doctor
// ---------------------------------------------------------------------------
function savedRecords(install: Install): DnsRecord[] {
  const file = path.join(install.dir, 'dns-records.json');
  if (!fs.existsSync(file)) throw new CliError('No records yet: run `provision` first');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export async function dnsCmd(opts: { dir?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  console.log(savedRecords(install).map(formatRecord).join('\n'));
}

export async function doctor(opts: { dir?: string }): Promise<void> {
  const install = loadInstall(opts.dir);
  const lines: string[] = [];
  let problems = 0;

  for (const r of savedRecords(install)) {
    const ok = await isPublished(r);
    if (!ok) problems++;
    lines.push(`${ok ? '✔' : '✖'} ${formatRecord(r)}`);
  }

  for (const [port, what] of [[25, 'MX'], [465, 'SMTP'], [993, 'IMAP'], [443, 'web']] as const) {
    const ok = await canConnect(install.mailHost, port);
    if (!ok) problems++;
    lines.push(`${ok ? '✔' : '✖'} ${install.mailHost}:${port} (${what}) ${ok ? 'reachable' : 'not reachable from here'}`);
  }

  const env = fs.readFileSync(path.join(install.dir, '.env'), 'utf8');
  lines.push(`  image ${IMAGE}:${getKey(env, 'FE_VERSION') ?? 'latest'}`);
  p.note(lines.join('\n'), problems ? `${problems} problem(s)` : 'All good');
  if (problems) process.exitCode = 1;
}
