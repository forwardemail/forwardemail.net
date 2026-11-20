import dns from 'node:dns/promises';

export type DnsRecord = {
  name: string;
  type: string;
  value: string;
  priority?: number;
  weight?: number;
  port?: number;
  comment?: string;
};

// the ports a lite install serves (SRV records for others, such as POP3 or
// CalDAV, would send mail clients to a service that is not running)
export const LITE_PORTS = new Set([993, 465]);

// the records of the mail host itself: its address, and the SPF and DKIM of
// the system mail (account verification and the like) sent from MAIL_HOST
export function systemRecords(opts: { mailHost: string; ip?: string; dkim: string }): DnsRecord[] {
  return [
    {
      name: opts.mailHost,
      type: 'A',
      value: opts.ip ?? '<this box’s public IPv4 address>',
      comment: 'the mail host (also set this address’s reverse DNS to it)'
    },
    { name: opts.mailHost, type: 'TXT', value: 'v=spf1 a -all', comment: 'SPF of the system mail' },
    { name: `default._domainkey.${opts.mailHost}`, type: 'TXT', value: opts.dkim, comment: 'DKIM of the system mail' }
  ];
}

// a domain's records from the app, without SRV records of services a lite
// install does not run
export function liteDomainRecords(records: DnsRecord[]): DnsRecord[] {
  return records.filter((r) => r.type !== 'SRV' || LITE_PORTS.has(r.port ?? 0));
}

export function formatRecord(r: DnsRecord): string {
  const data =
    r.type === 'MX'
      ? `${r.priority ?? 0} ${r.value}`
      : r.type === 'SRV'
        ? `${r.priority} ${r.weight} ${r.port} ${r.value}`
        : r.value;
  return `${r.name}  ${r.type}  ${data}`;
}

// whether a record is published (what public resolvers answer)
export async function isPublished(r: DnsRecord, resolver = publicResolver()): Promise<boolean> {
  try {
    switch (r.type) {
      case 'A':
        return (await resolver.resolve4(r.name)).includes(r.value);
      case 'MX':
        return (await resolver.resolveMx(r.name)).some((mx) => mx.exchange.toLowerCase() === r.value.toLowerCase());
      case 'TXT':
        return (await resolver.resolveTxt(r.name)).some((chunks) => chunks.join('') === r.value);
      case 'CNAME':
        return (await resolver.resolveCname(r.name)).some((c) => c.toLowerCase() === r.value.toLowerCase());
      case 'SRV':
        return (await resolver.resolveSrv(r.name)).some(
          (s) => s.name.toLowerCase() === r.value.toLowerCase() && s.port === r.port
        );
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export function publicResolver(): dns.Resolver {
  const resolver = new dns.Resolver({ timeout: 5000, tries: 2 });
  resolver.setServers(['1.1.1.1', '8.8.8.8']);
  return resolver;
}
