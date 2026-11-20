import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getKey, renderEnv, setKey } from '../src/env.ts';
import { dkimRecordValue, generateDkimKey } from '../src/keys.ts';
import { liteDomainRecords } from '../src/records.ts';

const TPL = 'MAIL_HOST=mail.example.com\nWEB_URL=https://mail.example.com\nFE_VERSION=latest\nAPI_SECRETS=\nSRS_SECRET=\n';

test('renderEnv sets the host, version and new secrets', () => {
  const a = renderEnv({ mailHost: 'mail.me.dev', version: 'v2.19.21' }, TPL);
  const b = renderEnv({ mailHost: 'mail.me.dev', version: 'v2.19.21' }, TPL);
  assert.equal(getKey(a, 'MAIL_HOST'), 'mail.me.dev');
  assert.equal(getKey(a, 'WEB_URL'), 'https://mail.me.dev');
  assert.equal(getKey(a, 'FE_VERSION'), 'v2.19.21');
  assert.match(getKey(a, 'API_SECRETS')!, /^[\da-f]{64}$/);
  assert.match(getKey(a, 'SRS_SECRET')!, /^[\da-f]{32}$/);
  assert.notEqual(getKey(a, 'SRS_SECRET'), getKey(b, 'SRS_SECRET'));
  assert.doesNotMatch(a, /example\.com/);
});

test('setKey replaces a line or adds one', () => {
  assert.equal(setKey('A=1\nB=2\n', 'B', '3'), 'A=1\nB=3\n');
  assert.equal(setKey('A=1', 'C', 'x'), 'A=1\nC=x\n');
});

test('DKIM key and its record', () => {
  const key = generateDkimKey();
  assert.match(key, /^-----BEGIN RSA PRIVATE KEY-----/);
  assert.match(dkimRecordValue(key), /^v=DKIM1; k=rsa; p=[\w+/=]+;$/);
});

test('lite records drop SRV records of services lite does not run', () => {
  const srv = (port: number) => ({ name: 'x', type: 'SRV', value: 'h', port, priority: 0, weight: 1 });
  const out = liteDomainRecords([{ name: 'x', type: 'MX', value: 'h' }, srv(993), srv(465), srv(587), srv(995), srv(443)]);
  assert.deepEqual(out.map((r) => r.port ?? r.type), ['MX', 993, 465]);
});
