/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Our other projects, in the order the "Our Projects" menu and the projects
// page list them. `description` and `why` are phrases (translated in views).
// `image` is each site's Open Graph image (1200x630), taken from its repo
// and saved under assets/img/projects/ (for a project whose repo has only a
// wide banner, the banner centered on white at 1200x630).
//
module.exports = [
  {
    name: 'Privacy Ratings',
    url: 'https://privacyratings.com',
    repo: 'https://github.com/privacyratings/privacyratings.com',
    image: 'img/projects/privacy-ratings.webp',
    description:
      'Rates email providers, VPNs, browsers, password managers and more against public privacy criteria. Each positive answer links to evidence you can check, and scheduled scans test the security of each hosted service.',
    why: 'Most privacy lists depend on a few volunteers and publish no rules for what gets in. Forward Email backs this one as a business, and its own rating follows the same public criteria as every other entry.'
  },
  {
    name: 'Spam Scanner',
    url: 'https://spamscanner.net',
    repo: 'https://github.com/spamscanner/spamscanner',
    image: 'img/projects/spam-scanner.webp',
    description:
      'A spam filter for Node.js, the command line and mail servers such as Postfix. It catches spam, phishing, scams and malware in any language and explains each decision it makes.',
    why: 'Forward Email keeps no logs of message content, so we could not hand mail to an outside filtering service. We built a filter that runs on our own servers and explains its decisions without anyone reading the mail.'
  },
  {
    name: 'Attestium',
    url: 'https://attestium.com',
    repo: 'https://github.com/attestium/attestium.com',
    image: 'img/projects/attestium.webp',
    description:
      'A Node.js library for remote attestation. It collects evidence of the code a server runs and checks it against public references such as commits, signed releases and pinned packages.',
    why: 'Our code is open source, and Attestium lets you check that our production servers run that same code. We publish the results through Audit Status on our status page.'
  },
  {
    name: 'Terminal Email',
    url: 'https://terminalemail.com',
    repo: 'https://github.com/forwardemail/terminalemail.com',
    image: 'img/projects/terminal-email.webp',
    description:
      'A directory of email clients that run in a terminal on Linux, macOS, Windows, BSD and Android, with install commands, supported features and a working configuration for each one.',
    why: 'Forward Email has its own terminal app, which the directory features. Every other client gets the same facts, a Forward Email configuration, and works with any email provider.'
  },
  {
    name: 'Alumni Email',
    url: 'https://alumniemail.com',
    repo: 'https://github.com/forwardemail/alumniemail.com',
    image: 'img/projects/alumni-email.webp',
    description:
      'A guide for universities on giving graduates a lifetime address on the school domain, forwarded to the inbox each graduate already uses.',
    why: 'Universities already run alumni forwarding on Forward Email. The guide walks IT teams through the setup, the costs and our case study before they make the same move.'
  },
  {
    name: 'Time to Inbox',
    url: 'https://timetoinbox.com',
    repo: 'https://github.com/forwardemail/timetoinbox.com',
    image: 'img/projects/time-to-inbox.webp',
    description:
      'A guide to time to inbox (TTI): how long an email takes to reach the inbox, how to measure it and what slows delivery down.',
    why: 'Forward Email measures its own time to inbox and publishes the results live. The guide explains the method behind those numbers, so you can test any provider the same way.'
  },
  {
    name: 'Server Auditing',
    url: 'https://serverauditing.com',
    repo: 'https://github.com/forwardemail/serverauditing.com',
    image: 'img/projects/server-auditing.webp',
    description:
      'A free Bash script that runs a Lynis security audit on a Linux server, checks failed SSH logins, open ports and disk use, and emails you the report.',
    why: 'The script sends its report over SMTP, through Forward Email by default, so you can review each server from your inbox instead of logging in to it.'
  },
  {
    name: 'SSH Monitor',
    url: 'https://sshmonitor.com',
    repo: 'https://github.com/forwardemail/sshmonitor.com',
    image: 'img/projects/ssh-monitor.webp',
    description:
      'A free Bash script that counts failed SSH logins in your auth log or journal and emails you when they pass a threshold.',
    why: 'The script sends its alerts with one request to the Forward Email API, a simple way to send email from a cron job on any server.'
  },
  {
    name: 'SSL Monitor',
    url: 'https://sslmonitor.com',
    repo: 'https://github.com/forwardemail/sslmonitor.com',
    image: 'img/projects/ssl-monitor.webp',
    description:
      'A free Bash script that checks your SSL/TLS certificates each day and emails you before any of them expire.',
    why: 'The script emails its report through the Forward Email API or a local sendmail, so you hear about an expiring certificate before your visitors do.'
  },
  {
    name: 'Tangerine',
    url: 'https://forwardemail.github.io/tangerine',
    repo: 'https://github.com/forwardemail/tangerine',
    image: 'img/projects/tangerine.webp',
    description:
      'A drop-in replacement for the Node.js DNS resolver that sends lookups over DNS over HTTPS (DoH), with retries, timeouts, server rotation and caching.',
    why: 'Our mail servers look up MX, SPF, DKIM and DMARC records for every message. Tangerine sends those lookups encrypted over HTTPS and caches the answers, so they stay private and fast.'
  },
  {
    name: 'Bree',
    url: 'https://jobscheduler.net/#/',
    repo: 'https://github.com/breejs/bree',
    image: 'img/projects/bree.webp',
    description:
      'A job scheduler for Node.js that runs each job in its own worker thread, on a cron expression, a date, an interval or a human-friendly time, with concurrency limits and graceful shutdown.',
    why: 'Forward Email runs dozens of background jobs, from DNS checks to renewal reminders. Bree runs them on our own servers without a separate queue service, and a job that fails does not stop the others.'
  },
  {
    name: 'Cabin',
    url: 'https://cabinjs.com',
    repo: 'https://github.com/cabinjs/cabin',
    image: 'img/projects/cabin.webp',
    description:
      'A logging library for JavaScript and Node.js. It logs requests and errors from Express, Koa and Lad apps and from the browser, and can send them to Slack, Sentry, Datadog, Papertrail or your own endpoint.',
    why: 'Logs can leak personal data. Cabin masks passwords, card numbers, tokens and other sensitive fields before anything is written, so we keep our logs on our own servers instead of handing them to a logging service.'
  },
  {
    name: 'Lad',
    url: 'https://lad.js.org',
    repo: 'https://github.com/ladjs/lad',
    image: 'img/projects/lad.webp',
    description:
      'A full-stack Node.js framework built on Koa, with a web server, an API server, a Bree job scheduler, translations, email templates and security settings ready from the start.',
    why: 'Forward Email is built with Lad. The framework behind our web app and API is open source, so anyone can start a project from the same foundation.'
  },
  {
    name: 'Lass',
    url: 'https://lass.js.org',
    repo: 'https://github.com/lassjs/lass',
    image: 'img/projects/lass.webp',
    description:
      'A command-line tool that creates a new Node.js package with tests, linting, formatting, commit checks, a README and a license already set up.',
    why: 'We maintain many npm packages, including Tangerine, Bree and Cabin. Lass starts each new one the same way, so every package has the same tests and checks from its first commit.'
  }
];
