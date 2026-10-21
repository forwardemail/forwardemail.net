/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Our other projects, in the order the "Our Projects" menu and the projects
// page list them. `description` and `why` are phrases (translated in views).
// `image` is each site's Open Graph image (1200x630), taken from its repo
// and saved under assets/img/projects/.
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
  }
];
