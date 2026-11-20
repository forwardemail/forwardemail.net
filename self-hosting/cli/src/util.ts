import { spawn, spawnSync } from 'node:child_process';

export type RunResult = { code: number; stdout: string; stderr: string };

// runs a command and collects its output (`inherit` streams it to the terminal)
export function run(
  cmd: string,
  args: string[],
  opts: { cwd?: string; inherit?: boolean; input?: string } = {}
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd,
      stdio: [opts.input ? 'pipe' : 'ignore', opts.inherit ? 'inherit' : 'pipe', opts.inherit ? 'inherit' : 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => (stdout += d));
    child.stderr?.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
    if (opts.input) child.stdin?.end(opts.input);
  });
}

export function hasCommand(cmd: string): boolean {
  return spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0;
}

export class CliError extends Error {}
