//
// What a box needs before it can run a mail server, checked before anything
// is installed. Each check says what is wrong and what to do, and only the
// ones marked `fail` stop `init`.
//

import dns from 'node:dns/promises';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';

import { dockerInfo } from './docker.ts';

export type Check = { name: string; status: 'ok' | 'warn' | 'fail'; detail: string };

const GB = 1024 ** 3;

export function canConnect(host: string, port: number, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

export function portFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err: NodeJS.ErrnoException) =>
      // (binding below 1024 needs root on Linux, which docker has: only a port
      // in use means something else is there)
      resolve(err.code === 'EACCES')
    );
    server.listen(port, () => server.close(() => resolve(true)));
  });
}

// the box's public IPv4 address, as Cloudflare sees it (its trace endpoint
// is asked over IPv4, by address)
export async function publicIPv4(): Promise<string | undefined> {
  try {
    const res = await fetch('https://1.1.1.1/cdn-cgi/trace', {
      signal: AbortSignal.timeout(5000)
    });
    const ip = (await res.text()).match(/^ip=(.+)$/m)?.[1]?.trim();
    return ip && net.isIPv4(ip) ? ip : undefined;
  } catch {
    return undefined;
  }
}

export async function runPreflight(opts: { dir: string; ports: number[] }): Promise<Check[]> {
  const checks: Check[] = [];

  const arch = os.arch();
  checks.push({
    name: 'CPU',
    status: arch === 'arm64' || arch === 'x64' ? 'ok' : 'fail',
    detail: `${os.platform()} ${arch}${arch === 'arm64' || arch === 'x64' ? '' : ' (the image is built for arm64 and x64 only)'}`
  });

  const docker = await dockerInfo();
  if (!docker.ok) {
    checks.push({
      name: 'Docker',
      status: 'fail',
      detail: `${docker.error}. Install Docker (on macOS: OrbStack, Colima or Docker Desktop) and run this again.`
    });
  } else {
    const major = Number(docker.composeVersion?.split('.')[0]?.replace(/^v/, ''));
    checks.push({
      name: 'Docker',
      status: major >= 2 ? 'ok' : 'fail',
      detail: major >= 2 ? `running, compose ${docker.composeVersion}` : 'docker compose v2 is needed'
    });
    // (on macOS the containers get the memory of docker's VM, not the Mac's)
    const mem = docker.memBytes ?? os.totalmem();
    checks.push({
      name: 'Memory',
      status: mem >= 3.5 * GB ? 'ok' : mem >= 1.8 * GB ? 'warn' : 'fail',
      detail: `${(mem / GB).toFixed(1)} GB available to containers${
        mem < 3.5 * GB ? ' (4 GB or more is recommended; on macOS raise the docker VM memory)' : ''
      }`
    });
  }

  try {
    fs.mkdirSync(opts.dir, { recursive: true });
    const { bavail, bsize } = fs.statfsSync(opts.dir);
    const free = bavail * bsize;
    checks.push({
      name: 'Disk',
      status: free >= 20 * GB ? 'ok' : free >= 8 * GB ? 'warn' : 'fail',
      detail: `${(free / GB).toFixed(0)} GB free at ${opts.dir} (the image alone is several GB)`
    });
  } catch (err) {
    checks.push({ name: 'Disk', status: 'fail', detail: `cannot use ${opts.dir}: ${(err as Error).message}` });
  }

  for (const port of opts.ports) {
    const free = await portFree(port);
    checks.push({
      name: `Port ${port}`,
      status: free ? 'ok' : 'fail',
      detail: free ? 'free' : 'in use by something else on this box'
    });
  }

  // home connections often block outbound port 25, which delivering mail to
  // other servers needs
  const out25 = await canConnect('gmail-smtp-in.l.google.com', 25);
  checks.push({
    name: 'Outbound port 25',
    status: out25 ? 'ok' : 'warn',
    detail: out25
      ? 'open'
      : 'blocked (common on home connections): receiving works, but sending to other servers will not until it is open or mail goes out through a relay'
  });

  const ip = await publicIPv4();
  if (ip) {
    const ptr = await dns.reverse(ip).catch(() => [] as string[]);
    checks.push({
      name: 'Public IP',
      status: ptr.length > 0 ? 'ok' : 'warn',
      detail: `${ip}, reverse DNS: ${ptr[0] ?? 'none'}${
        ptr.length > 0 ? '' : ' (receivers distrust mail from an address without one; set it to your mail hostname with your ISP or host)'
      }`
    });
  } else {
    checks.push({ name: 'Public IP', status: 'warn', detail: 'could not be found' });
  }

  return checks;
}
