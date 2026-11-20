import { run, type RunResult } from './util.ts';

// `docker compose` in an install's directory (which holds its compose file
// and .env)
export function compose(
  dir: string,
  args: string[],
  opts: { inherit?: boolean } = {}
): Promise<RunResult> {
  return run('docker', ['compose', '--project-directory', dir, ...args], {
    cwd: dir,
    inherit: opts.inherit
  });
}

export async function dockerInfo(): Promise<{ ok: boolean; arch?: string; memBytes?: number; composeVersion?: string; error?: string }> {
  try {
    const info = await run('docker', ['info', '--format', '{{.Architecture}} {{.MemTotal}}']);
    if (info.code !== 0) return { ok: false, error: info.stderr.trim() || 'docker is not running' };
    const [arch, mem] = info.stdout.trim().split(' ');
    const cv = await run('docker', ['compose', 'version', '--short']);
    return {
      ok: true,
      arch,
      memBytes: Number(mem),
      composeVersion: cv.code === 0 ? cv.stdout.trim() : undefined
    };
  } catch {
    return { ok: false, error: 'docker is not installed' };
  }
}

// runs a one-off container, e.g. certbot or openssl from the app image
export function dockerRun(args: string[], opts: { inherit?: boolean } = {}): Promise<RunResult> {
  return run('docker', ['run', '--rm', ...args], { inherit: opts.inherit });
}
