/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync, spawnSync } from 'node:child_process';

import { APP_NAME, APP_TITLE } from './config.js';

const LAUNCHD_LABEL = 'net.forwardemail.mail-server-tunnel';
const CRON_MARKER = `# ${APP_NAME}`;

function isRoot() {
  return typeof process.getuid === 'function' && process.getuid() === 0;
}

function run(file, args, options = {}) {
  const result = spawnSync(file, args, { encoding: 'utf8', ...options });
  return {
    ok: result.status === 0,
    output: `${result.stdout || ''}${result.stderr || ''}`.trim()
  };
}

function hasCommand(name) {
  return run(process.platform === 'win32' ? 'where' : 'which', [name]).ok;
}

function hasSystemd() {
  return (
    process.platform === 'linux' &&
    fs.existsSync('/run/systemd/system') &&
    hasCommand('systemctl')
  );
}

// Whether this is the standalone executable (and not `node index.js`)
export function isStandalone() {
  // (asked of Node.js itself: its own executable goes by many names, e.g.
  // nodejs or node22, and the app's can be renamed)
  try {
    return process.getBuiltinModule?.('node:sea')?.isSea() === true;
  } catch {
    return false;
  }
}

// Where the executable is kept, so that it survives the Downloads folder
// being emptied
export function getInstallPath(mode) {
  const name = process.platform === 'win32' ? `${APP_NAME}.exe` : APP_NAME;
  if (process.platform === 'win32')
    return path.join(
      mode === 'system'
        ? process.env.ProgramFiles || 'C:\\Program Files'
        : process.env.LOCALAPPDATA ||
            path.join(os.homedir(), 'AppData', 'Local'),
      APP_TITLE,
      name
    );
  if (mode === 'system') return path.join('/usr/local/bin', name);
  return path.join(os.homedir(), '.local', 'bin', name);
}

//
// The command that runs the app: the standalone executable (copied to a
// lasting place first), or Node.js with this script.
//
export function getProgram(mode, options = {}) {
  if (!isStandalone())
    return { file: process.execPath, args: [path.resolve(process.argv[1])] };
  const target = getInstallPath(mode);
  if (options.copy && path.resolve(process.execPath) !== path.resolve(target)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // (beside it first, then renamed over it: a copy that is running, e.g.
    // on a second install, cannot be written to but can be replaced)
    const staged = `${target}.${process.pid}.new`;
    fs.copyFileSync(process.execPath, staged);
    if (process.platform !== 'win32') fs.chmodSync(staged, 0o755);
    try {
      if (process.platform === 'win32' && fs.existsSync(target)) {
        fs.rmSync(`${target}.old`, { force: true });
        fs.renameSync(target, `${target}.old`);
      }

      fs.renameSync(staged, target);
    } catch (error) {
      fs.rmSync(staged, { force: true });
      throw error;
    }
  }

  return { file: options.copy ? target : process.execPath, args: [] };
}

function xml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// One argument of a POSIX shell command line (for cron)
function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

// One argument of a systemd ExecStart line
function systemdQuote(value) {
  return `"${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/%/g, '%%')}"`;
}

//
// systemd (Linux)
//
export function getSystemdUnit({ program, configFile, directory, mode }) {
  const command = [program.file, ...program.args, 'run', '--config', configFile]
    .map((value) => systemdQuote(value))
    .join(' ');
  return `[Unit]
Description=${APP_TITLE} (Forward Email)
Documentation=https://forwardemail.net/guides/self-hosted-mail-server-behind-cgnat
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=${command}
Restart=always
RestartSec=5
NoNewPrivileges=true
${
  // (a system service is confined; a user service lacks the privileges for
  // these on some systems. The executable's folder stays writable so that
  // it can update itself.)
  mode === 'system'
    ? `PrivateTmp=true
ProtectSystem=full
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
LockPersonality=true
ReadWritePaths=${[directory, path.dirname(program.file)]
        .map((value) => systemdQuote(value))
        .join(' ')}
`
    : ''
}
[Install]
WantedBy=${mode === 'system' ? 'multi-user.target' : 'default.target'}
`;
}

function getSystemdPath(mode) {
  return mode === 'system'
    ? `/etc/systemd/system/${APP_NAME}.service`
    : path.join(
        os.homedir(),
        '.config',
        'systemd',
        'user',
        `${APP_NAME}.service`
      );
}

function systemctl(mode, args) {
  return run('systemctl', mode === 'system' ? args : ['--user', ...args]);
}

//
// launchd (macOS)
//
export function getLaunchdPlist({ program, configFile, logFile }) {
  const args = [program.file, ...program.args, 'run', '--config', configFile]
    .map((value) => `    <string>${xml(value)}</string>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LAUNCHD_LABEL}</string>
  <key>ProgramArguments</key>
  <array>
${args}
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>5</integer>
  <key>StandardOutPath</key>
  <string>${xml(logFile)}.out</string>
  <key>StandardErrorPath</key>
  <string>${xml(logFile)}.out</string>
</dict>
</plist>
`;
}

function getLaunchdPath(mode) {
  return mode === 'system'
    ? `/Library/LaunchDaemons/${LAUNCHD_LABEL}.plist`
    : path.join(
        os.homedir(),
        'Library',
        'LaunchAgents',
        `${LAUNCHD_LABEL}.plist`
      );
}

function getLaunchdDomain(mode) {
  return mode === 'system' ? 'system' : `gui/${process.getuid()}`;
}

//
// Task Scheduler (Windows)
//
// At sign-in (or at startup for a system install) and every 5 minutes after,
// so that the app is started again should it ever stop: a second copy leaves
// at once (see the lock in index.js). A user install starts through a small
// script that hides the console window.
//
export function getWindowsTask({
  program,
  configFile,
  mode,
  launcher,
  userId
}) {
  const isSystem = mode === 'system';
  // (without Windows Script Host, which an administrator can turn off, the
  // app starts itself in the background and the task ends at once)
  const command = isSystem || !launcher ? program.file : 'wscript.exe';
  const args =
    isSystem || !launcher
      ? [
          ...program.args,
          'run',
          '--quiet',
          ...(isSystem ? [] : ['--detach']),
          '--config',
          configFile
        ]
          .map((value) => `"${value}"`)
          .join(' ')
      : `//B //Nologo "${launcher}"`;
  const trigger = isSystem ? 'BootTrigger' : 'LogonTrigger';
  return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${xml(
      APP_TITLE
    )} (Forward Email): delivers mail to the mail server on this network.</Description>
  </RegistrationInfo>
  <Triggers>
    <${trigger}>
      <Enabled>true</Enabled>${
        // (a task of the person who installs it needs no administrator)
        isSystem || !userId ? '' : `\n      <UserId>${xml(userId)}</UserId>`
      }
      <Repetition>
        <Interval>PT5M</Interval>
        <StopAtDurationEnd>false</StopAtDurationEnd>
      </Repetition>
    </${trigger}>
  </Triggers>
  <Principals>
    <Principal id="Author">
      ${
        isSystem
          ? '<UserId>S-1-5-18</UserId>'
          : `${
              userId ? `<UserId>${xml(userId)}</UserId>\n      ` : ''
            }<LogonType>InteractiveToken</LogonType>`
      }
      <RunLevel>${isSystem ? 'HighestAvailable' : 'LeastPrivilege'}</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <StartWhenAvailable>true</StartWhenAvailable>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Enabled>true</Enabled>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>${xml(command)}</Command>
      <Arguments>${xml(args)}</Arguments>
    </Exec>
  </Actions>
</Task>
`;
}

// (VBScript string: quotes doubled)
export function getWindowsLauncher({ program, configFile }) {
  const command = [
    program.file,
    ...program.args,
    'run',
    '--quiet',
    '--config',
    configFile
  ]
    .map((value) => `""${String(value).replace(/"/g, '')}""`)
    .join(' ');
  return `CreateObject("WScript.Shell").Run "${command}", 0, False\r\n`;
}

//
// cron (any Unix without systemd, or by choice)
//
export function getCronLines({ program, configFile }) {
  const command = [
    program.file,
    ...program.args,
    'run',
    '--quiet',
    '--config',
    configFile
  ]
    .map((value) => shellQuote(value))
    .join(' ');
  return [
    `@reboot ${command} >/dev/null 2>&1 ${CRON_MARKER}`,
    `*/5 * * * * ${command} >/dev/null 2>&1 ${CRON_MARKER}`
  ];
}

function readCrontab() {
  const result = run('crontab', ['-l']);
  return result.ok ? result.output.split('\n') : [];
}

function writeCrontab(lines) {
  const text = lines.filter((line, index) => line || index < lines.length - 1);
  execFileSync('crontab', ['-'], { input: `${text.join('\n')}\n` });
}

// How the app is kept running on this system when no mode is asked for
export function getDefaultMode() {
  if (process.platform === 'win32' || process.platform === 'darwin')
    return 'user';
  if (hasSystemd()) return isRoot() ? 'system' : 'user';
  return 'cron';
}

//
// Sets the app up to start at boot or sign-in and to be restarted should it
// stop. Returns { mode, manager, path, notes }.
//
export function install(config, options = {}) {
  const mode = options.mode || getDefaultMode();
  if (!['user', 'system', 'cron'].includes(mode))
    throw new Error('Mode must be user, system or cron');
  if (mode === 'system' && process.platform !== 'win32' && !isRoot())
    throw new Error('A system install needs root: run the command with sudo');

  const program = getProgram(mode, { copy: true });
  const context = {
    program,
    mode,
    configFile: config.file,
    directory: config.directory,
    logFile: config.log.file
  };
  const notes = [];

  if (mode === 'cron') {
    if (process.platform === 'win32')
      throw new Error('cron is not available on Windows: use user or system');
    if (!hasCommand('crontab'))
      throw new Error(
        'crontab was not found: install cron, or use another mode'
      );
    const lines = readCrontab().filter((line) => !line.endsWith(CRON_MARKER));
    writeCrontab([...lines, ...getCronLines(context)]);
    return { mode, manager: 'cron', path: 'crontab', notes, program };
  }

  if (process.platform === 'linux') {
    if (!hasSystemd())
      throw new Error('systemd was not found: use "--mode cron" instead');
    const file = getSystemdPath(mode);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, getSystemdUnit(context), { mode: 0o644 });
    systemctl(mode, ['daemon-reload']);
    const result = systemctl(mode, ['enable', '--now', `${APP_NAME}.service`]);
    if (!result.ok) throw new Error(`systemctl failed: ${result.output}`);
    if (mode === 'user') {
      // (so that it runs from boot, without anyone signed in)
      const linger = run('loginctl', ['enable-linger', os.userInfo().username]);
      if (!linger.ok)
        notes.push(
          `To run before anyone signs in: sudo loginctl enable-linger ${
            os.userInfo().username
          }`
        );
    }

    return { mode, manager: 'systemd', path: file, notes, program };
  }

  if (process.platform === 'darwin') {
    const file = getLaunchdPath(mode);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, getLaunchdPlist(context), { mode: 0o644 });
    const domain = getLaunchdDomain(mode);
    run('launchctl', ['bootout', `${domain}/${LAUNCHD_LABEL}`]);
    let result = run('launchctl', ['bootstrap', domain, file]);
    // (older macOS)
    if (!result.ok) result = run('launchctl', ['load', '-w', file]);
    if (!result.ok) throw new Error(`launchctl failed: ${result.output}`);
    if (mode === 'system')
      notes.push('A system install shows no desktop notifications.');
    return { mode, manager: 'launchd', path: file, notes, program };
  }

  if (process.platform === 'win32') {
    const hasScriptHost = fs.existsSync(
      path.join(
        process.env.SystemRoot || 'C:\\Windows',
        'System32',
        'wscript.exe'
      )
    );
    const launcher =
      mode === 'user' && hasScriptHost
        ? path.join(config.directory, `${APP_NAME}.vbs`)
        : undefined;
    if (launcher) fs.writeFileSync(launcher, getWindowsLauncher(context));
    else if (mode === 'user')
      notes.push(
        'Windows Script Host is not available, so a console window may flash when the app is started.'
      );
    const taskFile = path.join(config.directory, `${APP_NAME}-task.xml`);
    // (Task Scheduler reads UTF-16 with a byte order mark)
    fs.writeFileSync(
      taskFile,
      `\uFEFF${getWindowsTask({
        ...context,
        launcher,
        userId: process.env.USERDOMAIN
          ? `${process.env.USERDOMAIN}\\${os.userInfo().username}`
          : os.userInfo().username
      })}`,
      'utf16le'
    );
    const result = run('schtasks', [
      '/Create',
      '/TN',
      APP_TITLE,
      '/XML',
      taskFile,
      '/F'
    ]);
    fs.rmSync(taskFile, { force: true });
    if (!result.ok)
      throw new Error(
        `Task Scheduler failed: ${result.output}${
          mode === 'system' ? ' (run this from an Administrator terminal)' : ''
        }`
      );
    run('schtasks', ['/Run', '/TN', APP_TITLE]);
    if (mode === 'system')
      notes.push('A system install shows no desktop notifications.');
    return { mode, manager: 'Task Scheduler', path: APP_TITLE, notes, program };
  }

  throw new Error(
    `No service manager is known for ${process.platform}: use "--mode cron"`
  );
}

// Removes every way of starting the app that `install` may have set up
export function uninstall() {
  const removed = [];

  if (process.platform === 'win32') {
    if (run('schtasks', ['/Delete', '/TN', APP_TITLE, '/F']).ok)
      removed.push('Task Scheduler');
    return removed;
  }

  if (hasCommand('crontab')) {
    const lines = readCrontab();
    const kept = lines.filter((line) => !line.endsWith(CRON_MARKER));
    if (kept.length !== lines.length) {
      writeCrontab(kept);
      removed.push('cron');
    }
  }

  if (process.platform === 'linux' && hasSystemd()) {
    for (const mode of isRoot() ? ['system'] : ['user']) {
      const file = getSystemdPath(mode);
      if (!fs.existsSync(file)) continue;
      systemctl(mode, ['disable', '--now', `${APP_NAME}.service`]);
      fs.rmSync(file, { force: true });
      systemctl(mode, ['daemon-reload']);
      removed.push(`systemd (${mode})`);
    }
  }

  if (process.platform === 'darwin') {
    for (const mode of isRoot() ? ['system'] : ['user']) {
      const file = getLaunchdPath(mode);
      if (!fs.existsSync(file)) continue;
      run('launchctl', [
        'bootout',
        `${getLaunchdDomain(mode)}/${LAUNCHD_LABEL}`
      ]);
      fs.rmSync(file, { force: true });
      removed.push(`launchd (${mode})`);
    }
  }

  return removed;
}

// What starts the app on this system, if anything
export function getInstalled() {
  if (process.platform === 'win32')
    return run('schtasks', ['/Query', '/TN', APP_TITLE]).ok
      ? ['Task Scheduler']
      : [];
  const found = [];
  if (
    hasCommand('crontab') &&
    readCrontab().some((l) => l.endsWith(CRON_MARKER))
  )
    found.push('cron');
  if (process.platform === 'linux')
    for (const mode of ['user', 'system'])
      if (fs.existsSync(getSystemdPath(mode))) found.push(`systemd (${mode})`);
  if (process.platform === 'darwin')
    for (const mode of ['user', 'system'])
      if (fs.existsSync(getLaunchdPath(mode))) found.push(`launchd (${mode})`);
  return found;
}
