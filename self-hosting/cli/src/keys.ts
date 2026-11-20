import { createPrivateKey, createPublicKey, generateKeyPairSync } from 'node:crypto';

// the DKIM key of the system mail (sent from addresses at MAIL_HOST), as the
// app expects it at DKIM_PRIVATE_KEY_PATH (what `openssl genrsa` writes)
export function generateDkimKey(): string {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
  });
  return privateKey;
}

// `v=DKIM1; k=rsa; p=...` for the key's TXT record
export function dkimRecordValue(privateKeyPem: string): string {
  const der = createPublicKey(createPrivateKey(privateKeyPem)).export({
    type: 'spki',
    format: 'der'
  });
  return `v=DKIM1; k=rsa; p=${der.toString('base64')};`;
}
