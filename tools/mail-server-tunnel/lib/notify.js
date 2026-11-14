/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 */

import os from 'node:os';
import process from 'node:process';
import { execFile, spawn } from 'node:child_process';

import { APP_TITLE } from './config.js';

// (AppleScript string: backslashes and quotes escaped)
function appleScriptString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

// A Windows toast, built by PowerShell from text it reads from its
// environment (never from the command line, so no text can run as code)
const WINDOWS_TOAST = [
  '[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null;',
  '[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null;',
  '$template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02);',
  '$text = $template.GetElementsByTagName("text");',
  '$text.Item(0).AppendChild($template.CreateTextNode($env:MST_TITLE)) | Out-Null;',
  '$text.Item(1).AppendChild($template.CreateTextNode($env:MST_MESSAGE)) | Out-Null;',
  '$toast = [Windows.UI.Notifications.ToastNotification]::new($template);',
  '[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($env:MST_TITLE).Show($toast);'
].join(' ');

// The command that shows a desktop notification on this system
export function getDesktopCommand(title, message, platform = process.platform) {
  if (platform === 'darwin')
    return {
      file: 'osascript',
      args: [
        '-e',
        `display notification ${appleScriptString(
          message
        )} with title ${appleScriptString(title)}`
      ]
    };
  if (platform === 'win32')
    return {
      file: 'powershell.exe',
      args: [
        '-NoProfile',
        '-NonInteractive',
        '-WindowStyle',
        'Hidden',
        '-Command',
        WINDOWS_TOAST
      ],
      env: { MST_TITLE: title, MST_MESSAGE: message }
    };
  return {
    file: 'notify-send',
    args: ['--app-name', title, '--', title, message]
  };
}

function showDesktop(title, message, logger) {
  const { file, args, env } = getDesktopCommand(title, message);
  execFile(
    file,
    args,
    { env: { ...process.env, ...env }, timeout: 15_000, windowsHide: true },
    (error) => {
      // (e.g. a server without a desktop, where the log and the email
      // alerts of the account are what tells of a problem)
      if (error)
        logger.debug('Desktop notification not shown', {
          message: error.message
        });
    }
  );
}

async function postWebhook(url, payload, logger) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'mail-server-tunnel'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
      redirect: 'error'
    });
    if (!response.ok)
      logger.warn('Notification webhook answered with an error', {
        status: response.status
      });
  } catch (error) {
    logger.warn('Notification webhook failed', { message: error.message });
  }
}

// The user's own command, told of the event through its environment
function runCommand(command, payload, logger) {
  const child = spawn(command, {
    shell: true,
    stdio: 'ignore',
    windowsHide: true,
    env: {
      ...process.env,
      MST_EVENT: payload.event,
      MST_TITLE: payload.title,
      MST_MESSAGE: payload.message,
      MST_DOMAINS: payload.domains.join(','),
      MST_HOSTNAME: payload.hostname
    }
  });
  child.on('error', (error) =>
    logger.warn('Notification command failed', { message: error.message })
  );
  child.unref();
}

//
// Tells the person who runs the app of what happens to the tunnel: as a
// desktop notification, to a webhook, and to a command of their own. The
// same event is not repeated within `notify.minInterval`.
//
export function createNotifier(config, logger) {
  const lastSent = new Map();

  return (event, message, extra = {}) => {
    if (!config.notify.events.includes(event)) return false;
    const now = Date.now();
    const last = lastSent.get(event) || 0;
    if (!extra.force && now - last < config.notify.minInterval) return false;
    lastSent.set(event, now);

    const payload = {
      event,
      title: APP_TITLE,
      message,
      domains: config.domains,
      hostname: os.hostname(),
      time: new Date(now).toISOString()
    };

    if (config.notify.desktop) showDesktop(APP_TITLE, message, logger);
    if (config.notify.webhookUrl)
      postWebhook(config.notify.webhookUrl, payload, logger);
    if (config.notify.command)
      runCommand(config.notify.command, payload, logger);
    return true;
  };
}
