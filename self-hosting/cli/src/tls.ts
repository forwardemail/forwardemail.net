//
// The certificate for MAIL_HOST, written to <install>/ssl as the app expects
// it (privkey.pem, fullchain.pem, chain.pem), readable by the app's user
// (uid 999 in the image).
//
// - letsencrypt: certbot in a container answers the HTTP-01 challenge on port
//   80, so port 80 must reach this box while it runs (nothing else needed:
//   no DNS provider credentials, no wildcard, since there is one name)
// - self-signed: for trying it out on a LAN; mail clients will warn and other
//   servers may refuse STARTTLS to it
// - existing: copy files from elsewhere (a reverse proxy, another ACME client)
//

import fs from 'node:fs';
import path from 'node:path';

import { dockerRun } from './docker.ts';
import { CliError } from './util.ts';

export const APP_UID = 999;

export async function letsEncrypt(dir: string, mailHost: string): Promise<void> {
  const le = path.join(dir, 'letsencrypt');
  fs.mkdirSync(le, { recursive: true });
  const res = await dockerRun(
    [
      '-p', '80:80',
      '-v', `${le}:/etc/letsencrypt`,
      'certbot/certbot:v3.0.1',
      'certonly', '--standalone', '--non-interactive', '--agree-tos',
      '--register-unsafely-without-email',
      '-d', mailHost
    ],
    { inherit: true }
  );
  if (res.code !== 0)
    throw new CliError(
      `certbot could not get a certificate for ${mailHost}: check that ${mailHost} resolves to this box's public address and that port 80 is forwarded to it`
    );

  // (the files in live/ are links into archive/, which a bind mount of ssl/
  // would not follow, so they are copied)
  const live = path.join(le, 'live', mailHost);
  copyCerts(dir, {
    key: path.join(live, 'privkey.pem'),
    fullchain: path.join(live, 'fullchain.pem'),
    chain: path.join(live, 'chain.pem')
  });
}

export async function selfSigned(dir: string, mailHost: string, image: string): Promise<void> {
  const ssl = path.join(dir, 'ssl');
  fs.mkdirSync(ssl, { recursive: true });
  // (openssl from the app image: the host may not have it)
  const res = await dockerRun([
    '-v', `${ssl}:/out`,
    '--user', 'root',
    '--entrypoint', 'openssl',
    image,
    'req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '825',
    '-subj', `/CN=${mailHost}`,
    '-addext', `subjectAltName=DNS:${mailHost}`,
    '-keyout', '/out/privkey.pem',
    '-out', '/out/fullchain.pem'
  ]);
  if (res.code !== 0) throw new CliError(`openssl failed: ${res.stderr.trim()}`);
  fs.copyFileSync(path.join(ssl, 'fullchain.pem'), path.join(ssl, 'chain.pem'));
  fixPermissions(dir);
}

export function copyCerts(dir: string, files: { key: string; fullchain: string; chain?: string }): void {
  const ssl = path.join(dir, 'ssl');
  fs.mkdirSync(ssl, { recursive: true });
  for (const [from, to] of [
    [files.key, 'privkey.pem'],
    [files.fullchain, 'fullchain.pem'],
    [files.chain ?? files.fullchain, 'chain.pem']
  ] as const) {
    if (!fs.existsSync(from)) throw new CliError(`${from} does not exist`);
    fs.copyFileSync(fs.realpathSync(from), path.join(ssl, to));
  }

  fixPermissions(dir);
}

// the app runs as uid 999, which reads ssl/ and writes data/mailboxes; on
// Linux the files must belong to it (docker on macOS maps ownership itself)
export function fixPermissions(dir: string): void {
  const ssl = path.join(dir, 'ssl');
  const mailboxes = path.join(dir, 'data', 'mailboxes');
  fs.mkdirSync(mailboxes, { recursive: true });
  if (process.platform !== 'linux') return;
  if (process.getuid?.() !== 0)
    throw new CliError(
      `On Linux the files must belong to the app's user: run \`sudo chown -R ${APP_UID}:${APP_UID} ${ssl} ${mailboxes}\` (or run this as root)`
    );
  for (const p of [ssl, mailboxes]) chownRecursive(p, APP_UID);
}

function chownRecursive(p: string, uid: number): void {
  fs.chownSync(p, uid, uid);
  if (fs.statSync(p).isDirectory())
    for (const entry of fs.readdirSync(p)) chownRecursive(path.join(p, entry), uid);
}
