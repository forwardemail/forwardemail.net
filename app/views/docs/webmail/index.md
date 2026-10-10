# Forward Email Webmail Guide

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> is where you read and send mail. The <a href="/my-account/domains">web dashboard</a> is where you set up domains, aliases, and passwords. You sign in to webmail with an alias address and a password generated in the dashboard. Webmail is free and <a href="https://github.com/forwardemail/mail.forwardemail.net" target="_blank" rel="noopener noreferrer">open source</a>, and the same app runs in the browser, on desktop, on mobile, and in a terminal.
</p>


## Table of Contents

* [Where to get webmail](#where-to-get-webmail)
* [Webmail and the web dashboard](#webmail-and-the-web-dashboard)
* [Signing in](#signing-in)
  * [Generate an alias password](#generate-an-alias-password)
  * [Sign in to webmail](#sign-in-to-webmail)
* [Using more than one account](#using-more-than-one-account)
  * [Send as another signed-in account](#send-as-another-signed-in-account)
* [Send from any address on your domain](#send-from-any-address-on-your-domain)
  * [Step 1: Generate a catch-all password in the dashboard](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Step 2: Save it in webmail](#step-2-save-it-in-webmail)
  * [Step 3: Pick the address when you compose](#step-3-pick-the-address-when-you-compose)
  * [What to know about catch-all sending](#what-to-know-about-catch-all-sending)
* [Webmail settings at a glance](#webmail-settings-at-a-glance)
* [Privacy and App Lock](#privacy-and-app-lock)
* [Troubleshooting](#troubleshooting)


## Where to get webmail

| Platform                        | Where                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Browser                         | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (no install) |
| Desktop (macOS, Windows, Linux) | Our <a href="/download">download page</a>                                                                                |
| Mobile (Android, iOS)           | Our <a href="/download">download page</a>                                                                                |
| Terminal                        | The `forwardemail` command. See [Do you have a terminal app](/faq#do-you-have-a-terminal-app)                            |

All of them are built from the same open-source project, so everything in this guide applies to each one. Settings and saved passwords are kept on each device, so set them up on every device you use.


## Webmail and the web dashboard

Forward Email has two separate places to sign in, and they use different credentials:

|                         | Web dashboard (forwardemail.net)                                                             | Webmail (mail.forwardemail.net and the apps)                                   |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Sign in with**        | Your Forward Email account email and password (plus 2FA or a passkey)                        | An alias address (like `you@example.com`) and its generated password           |
| **Used for**            | Adding domains, DNS, aliases, billing, team members, generating passwords, Advanced Settings | Reading and sending mail, folders, labels, search, calendar, contacts, filters |
| **Passwords made here** | Alias passwords and catch-all passwords                                                      | None. Webmail uses the passwords you made in the dashboard                     |

A common setup looks like this:

1. In the dashboard, add your domain and set up DNS.
2. Create an alias with IMAP storage turned on (for example `you@example.com`).
3. Generate a password for that alias.
4. Sign in to webmail with that alias and password.

To send mail, your domain also needs outbound SMTP turned on under <a href="/my-account/domains">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Advanced Settings <i class="fa fa-angle-right"></i> Outbound SMTP Configuration, the same as for any other email client.


## Signing in

### Generate an alias password

1. Go to <a href="/my-account/domains">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases.
2. Next to the alias, click **Generate Password**.
3. Copy the password. It is shown once.

This is the same password you would use for IMAP, POP3, SMTP, CalDAV, and CardDAV. It does not sign in to the web dashboard.

### Sign in to webmail

Open webmail and enter the full alias address and the generated password. If you only want to look around first, try the demo from the sign-in screen.


## Using more than one account

You can sign in to several aliases at once, even on different domains. Switch between them from the account menu, and manage them in **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Accounts are kept on the device you added them on and are not synced.

### Send as another signed-in account

When you compose, the **From** menu lists every account signed in on this device. Pick one to send as that address. The message is sent with that account's own password, and the copy goes to that account's Sent folder.


## Send from any address on your domain

If you own a domain, you can send from any address on it, such as `billing@example.com` or `no-reply@example.com`, without creating an alias and signing in for each one. You do this with a **catch-all password** for the domain.

You do **not** sign in to webmail as a wildcard or catch-all account, and there is no feature to turn on. You save the catch-all password once in webmail settings, and the From menu then lets you type any address on that domain.

### Step 1: Generate a catch-all password in the dashboard

1. Go to <a href="/my-account/domains">My Account <i class="fa fa-angle-right"></i> Domains</a> and pick your domain.
2. Open **Advanced Settings** and find **Catch-all Passwords**.
3. Click **Generate Password**. Leave the field blank to get a strong random password, and add a description if you like (for example "Webmail on my laptop").
4. Copy the password. It is shown once.

You need to be an admin of the domain to see this section. Use **Manage Passwords** in the same place to see or delete catch-all passwords later. Deleting one stops it working everywhere it is saved.

### Step 2: Save it in webmail

1. In webmail, open **Settings <i class="fa fa-angle-right"></i> General**.
2. Find the card called **Send from any address**, just below **Your accounts**.
3. Click **Add catch-all password**.
4. Enter the domain (for example `example.com`) and paste the catch-all password.
5. Click **Save**. You will see "You can now send from any address @example.com".

You can save passwords for as many domains as you like. To remove one, click the trash icon next to it.

### Step 3: Pick the address when you compose

1. Start a new message.
2. Open the **From** menu. Under your signed-in accounts there is an entry for each saved domain: **Other address @example.com…**
3. Pick it. The From line turns into a text box with `@example.com` after it.
4. Type the part before the @ (for example `billing`) and send.

Drafts keep the address you typed, so a saved draft reopens with the same From address.

### What to know about catch-all sending

* **It can only send.** A catch-all password works only for sending. It cannot open a mailbox, so you cannot read mail for `billing@example.com` with it. To read replies, create an alias (or a catch-all alias that forwards to you) for that address.
* **Sent copies go to the account you are using.** A message sent as `billing@example.com` is filed in the Sent folder of the account you composed from.
* **It works from every account on the device.** The saved password is not tied to one signed-in account. Any account on that device can use it.
* **It stays on this device.** The password is stored only on the device where you saved it. It is not synced, and QR device pairing does not copy it. Add it again on each device.
* **App Lock protects it.** If App Lock is on, the password is encrypted with the rest of your local data, and the **Other address** entries are hidden while the app is locked.
* **Scheduled sending is not available** for addresses sent with a catch-all password, because that password cannot read back or cancel a scheduled message. Send right away, or send as a signed-in account.
* **A wrong password will not sign you out.** If the catch-all password is wrong or was deleted in the dashboard, the send fails with an error, and you stay signed in.


## Webmail settings at a glance

| Section                | What it covers                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **General**            | Your accounts, send from any address (catch-all passwords), notifications, storage |
| **Appearance**         | Theme, layout, density, composer defaults, signature, font, external links         |
| **Privacy & Security** | App Lock, PGP encryption, privacy options, spam reporting                          |
| **Folders & Labels**   | Special folders, your folders, labels                                              |
| **Filters**            | Mail filters for the signed-in alias                                               |
| **Calendar**           | Week start and tasks                                                               |
| **Search**             | Search indexing, index health, saved searches, search operators                    |
| **Advanced**           | Mailbox storage, local cache, and resetting the app                                |
| **Keyboard Shortcuts** | Every shortcut                                                                     |
| **About & Help**       | Version, desktop app download, feedback, and links                                 |

Things that belong to the domain or alias itself, like DNS, forwarding recipients, storage limits, vacation responders, catch-all passwords, and spam scanning, are set in the <a href="/my-account/domains">web dashboard</a>.


## Privacy and App Lock

Webmail keeps a local copy of your mail so it is fast and works offline. **App Lock** (in **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) encrypts that local data, your settings, and your saved passwords on the device, and unlocks with a passkey or a PIN. Mail and live updates go directly between the app and Forward Email, with no advertising or tracking services in between.


## Troubleshooting

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail has no password for that address on this device. Either sign in to that alias, or save the domain's catch-all password in **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. If the app is locked, unlock it first.

**The "Other address" entry is missing from the From menu.**

Check that you saved the catch-all password on this device, and that App Lock is unlocked.

**Sending from a catch-all address fails with an authentication error.**

The catch-all password may have been deleted or mistyped. Generate a new one in the dashboard, then remove the old one in webmail and add the new one.

**My dashboard password does not work in webmail.**

Webmail needs an alias password, not your dashboard password. See [Generate an alias password](#generate-an-alias-password).

Still stuck? See our <a href="/faq">FAQ</a> or <a href="/help">contact us</a>.
