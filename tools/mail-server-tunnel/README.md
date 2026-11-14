# Mail Server Tunnel

Receive email on a self-hosted mail server behind CGNAT. Works on Starlink, T-Mobile and Verizon 5G home internet, mobile hotspots, and any provider that does not give you a public IPv4 address or blocks port 25.

No port forwarding, static IP address, VPN, or VPS.

Full guide: <https://forwardemail.net/guides/self-hosted-mail-server-behind-cgnat>


## Table of Contents

* [How it works](#how-it-works)
* [Requirements](#requirements)
* [Install](#install)
* [Quick start](#quick-start)
* [Commands](#commands)
* [Settings](#settings)
* [Sending mail](#sending-mail)
* [Remote mailbox access](#remote-mailbox-access)
* [Notifications and alerts](#notifications-and-alerts)
* [Updates](#updates)
* [Security](#security)
* [Development](#development)
* [License](#license)
* [Disclaimer](#disclaimer)


## How it works

1. Your domain's MX records point to Forward Email.
2. This app runs beside your mail server and keeps one outbound connection open to Forward Email. Outbound connections work behind CGNAT.
3. When mail arrives for your domain, Forward Email hands it to the app over that connection.
4. The app delivers it to your mail server over SMTP or LMTP and returns your server's response to the sender.

If the app is not connected, senders get a temporary `421` response. They keep the message and try again, usually for up to 5 days. Mail is deferred, not lost.

Forward Email does not store the message. It passes through memory on its way to your server.


## Requirements

* A domain on a paid [Forward Email](https://forwardemail.net) plan, verified with its TXT record (`forward-email-site-verification=...`) and with its MX records pointing to Forward Email
* A mail server on your network (Postfix, Dovecot, Stalwart, Mailcow, Mail-in-a-Box, Exchange, or the self-hosted Forward Email stack)
* A computer on the same network that stays on: Linux, macOS, or Windows


## Install

Download the file for your system from the [latest release](https://github.com/forwardemail/forwardemail.net/releases/latest):

| System                | File                              |
| --------------------- | --------------------------------- |
| Linux (x64)           | `mail-server-tunnel-linux-x64`    |
| Linux (ARM64)         | `mail-server-tunnel-linux-arm64`  |
| macOS (Apple Silicon) | `mail-server-tunnel-darwin-arm64` |
| Windows (x64)         | `mail-server-tunnel-win-x64.exe`  |

On Linux and macOS, make it executable:

```sh
chmod +x mail-server-tunnel-*
```

With Node.js 18 or later you can also run it from a clone of the repository: `node tools/mail-server-tunnel/index.js setup`.


## Quick start

Double-click the file, or run it with no arguments, to open the app in your browser. It walks through the same steps as the command line.

From a terminal:

```sh
mail-server-tunnel setup
```

Setup takes five steps:

1. Your API token from [My Account → Security](https://forwardemail.net/my-account/security). What you paste is not shown.
2. Which domains deliver to your mail server. Choose them from the list with Space.
3. Where your mail server listens (default `127.0.0.1:25`) and whether it speaks SMTP or LMTP. Setup connects to it and offers to try again or change the address if nothing answers.
4. Whether the API may read mailboxes on your server over IMAP. Off by default.
5. Whether to start at boot and keep running.

It shows your answers and asks before it changes anything. Then it turns on the **Mail Server Tunnel** setting for each domain, checks your DNS records, saves the settings, and installs the background service. Ctrl+C at any question cancels with nothing changed.

Keys: Enter accepts the value shown in brackets, ↑ and ↓ move through a list, Space chooses, `a` chooses all, `y` and `n` answer yes and no.

Colors follow [`NO_COLOR`](https://no-color.org) and `FORCE_COLOR`. When the input is not a terminal, each question reads one line, so answers can be piped in.

For scripted installs:

```sh
mail-server-tunnel setup --yes --token YOUR_API_TOKEN --domain example.com --local-port 25
```


## Commands

| Command     | What it does                                                                   |
| ----------- | ------------------------------------------------------------------------------ |
| `gui`       | Open the app in your browser                                                   |
| `setup`     | Guided setup                                                                   |
| `run`       | Run the tunnel in the terminal                                                 |
| `install`   | Start at boot or sign-in and keep running (`--mode user`, `system`, or `cron`) |
| `uninstall` | Remove what `install` set up                                                   |
| `status`    | Show whether the tunnel is running and connected                               |
| `doctor`    | Check the token, domains, DNS, and your mail server                            |
| `enable`    | Turn the tunnel on for a domain                                                |
| `disable`   | Turn the tunnel off for a domain                                               |
| `config`    | Print the settings in effect (`--paths` lists every setting)                   |
| `logs`      | Print the last lines of the log                                                |
| `update`    | Install the latest version                                                     |

`install` picks the right service manager:

| System  | User mode                                     | System mode            |
| ------- | --------------------------------------------- | ---------------------- |
| Linux   | systemd user unit                             | systemd system unit    |
| macOS   | launchd LaunchAgent                           | launchd LaunchDaemon   |
| Windows | Task Scheduler at sign-in                     | Task Scheduler at boot |
| Any     | `--mode cron` (`@reboot` and every 5 minutes) |                        |

Only one copy runs per config folder. A second copy exits at once, so the cron and Task Scheduler entries also act as a watchdog.


## Settings

Settings live in `config.json`:

| System  | Location                                                             |
| ------- | -------------------------------------------------------------------- |
| Linux   | `~/.config/mail-server-tunnel/` (`/etc/mail-server-tunnel/` as root) |
| macOS   | `~/Library/Application Support/Mail Server Tunnel/`                  |
| Windows | `%APPDATA%\Mail Server Tunnel\`                                      |

Every setting can be set three ways. Later ones win:

1. The config file
2. `--set key=value` on the command line
3. An environment variable, such as `MAIL_SERVER_TUNNEL_LOCAL_PORT=2525`

Run `mail-server-tunnel config --paths` for the full list. The most used:

| Setting                    | Default     | Meaning                                                  |
| -------------------------- | ----------- | -------------------------------------------------------- |
| `token`                    |             | API token (or `tokenFile`, or `FORWARD_EMAIL_API_TOKEN`) |
| `domains`                  | `[]`        | Domains to serve                                         |
| `local.host`               | `127.0.0.1` | Your mail server                                         |
| `local.port`               | `25`        | Its port                                                 |
| `local.protocol`           | `smtp`      | `smtp` or `lmtp`                                         |
| `local.tls`                | `auto`      | `auto`, `none`, `starttls`, or `implicit`                |
| `local.user`, `local.pass` |             | SMTP login, if your server needs one                     |
| `local.maxConcurrent`      | `5`         | Messages delivered at once                               |
| `domainOverrides`          | `{}`        | A different mail server per domain                       |
| `imap.enabled`             | `false`     | Remote mailbox access                                    |
| `imap.readOnly`            | `false`     | Refuse commands that change a mailbox                    |
| `imap.allowedCommands`     | all         | Which IMAP commands may run                              |
| `reconnect.minDelay`       | `1000`      | First reconnect delay in ms                              |
| `reconnect.maxDelay`       | `30000`     | Longest reconnect delay in ms                            |
| `heartbeat.timeout`        | `60000`     | Reconnect when nothing was received for this long        |
| `probe.interval`           | `60000`     | How often your mail server is checked (`0` turns it off) |
| `notify.desktop`           | `true`      | Desktop notifications                                    |
| `notify.webhookUrl`        |             | URL that receives each event as JSON                     |
| `notify.command`           |             | Command run for each event                               |
| `notify.events`            | all         | Which events notify                                      |
| `log.level`                | `info`      | `debug`, `info`, `warn`, `error`, or `silent`            |
| `health.port`              | `0`         | HTTP health endpoint (`200` while connected)             |
| `update.enabled`           | `true`      | Automatic updates                                        |

Example with a second domain on another server:

```json
{
  "domains": ["example.com", "example.org"],
  "local": { "host": "127.0.0.1", "port": 25 },
  "domainOverrides": {
    "example.org": { "host": "192.168.1.20", "port": 24, "protocol": "lmtp" }
  }
}
```


## Sending mail

Most of these providers also block outbound port 25, so your server cannot deliver mail directly. Relay through Forward Email on port 465 or 587 instead. For Postfix:

```ini
relayhost = [smtp.forwardemail.net]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
```

See the [guide](https://forwardemail.net/guides/self-hosted-mail-server-behind-cgnat#sending) for the full steps.


## Remote mailbox access

Mail clients outside your network cannot reach an IMAP server behind CGNAT. With `imap.enabled` set to `true`, the app runs IMAP commands against your local IMAP server on request from the Forward Email API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/tunnel/imap \
  -u YOUR_API_TOKEN: \
  -H 'Content-Type: application/json' \
  -d '{"command":"list","username":"you@example.com","password":"MAILBOX_PASSWORD"}'
```

Commands: `list`, `status`, `search`, `fetch`, `download`, `flags`, `move`, `copy`, `delete`, `append`, `mailboxCreate`, `mailboxRename`, `mailboxDelete`.

It is off by default. The app only ever connects to the IMAP host in its own settings. The mailbox password is passed through for that one command and is not stored.


## Notifications and alerts

The app shows a desktop notification when the connection drops for more than a minute, when it returns, when your mail server stops answering, and when another copy takes over a domain. Set `notify.webhookUrl` or `notify.command` to send the same events elsewhere. A command receives `MST_EVENT`, `MST_TITLE`, `MST_MESSAGE`, `MST_DOMAINS`, and `MST_HOSTNAME` in its environment.

Forward Email also emails the domain's admins when the tunnel has been offline, or your mail server unreachable, for 10 minutes. It sends a reminder each day and a notice when it is back.

A system-mode install has no desktop session, so it shows no desktop notifications. Email alerts, the webhook, and the command still work.


## Updates

The standalone executable checks GitHub releases once a day and installs a newer version by itself. It only installs a release whose checksum list is signed by Forward Email, names that release, and matches the download. Then it restarts.

What happens to the file:

* The new version replaces the executable where it is, under the same name. Nothing needs to be downloaded or made executable again.
* A tunnel running in a terminal (`./mail-server-tunnel run`) restarts in that same terminal.
* A tunnel started by `install` restarts in the background, as before.
* `mail-server-tunnel update` replaces both the copy you run it from and the copy `install` keeps for the background service.
* If the executable is in a folder you cannot write to, the app says so once and keeps running the version it has. Run `mail-server-tunnel update` with `sudo`, or from an Administrator terminal on Windows.
* `mail-server-tunnel status` warns when the running tunnel is a different version from the copy you are using.

Turn this off with `update.enabled` set to `false`. Run `mail-server-tunnel update` to update by hand.


## Security

* The connection to Forward Email is outbound TLS. Nothing on your network is exposed to the internet.
* The API token is stored in a file only your user can read. It is never logged or printed.
* Mail only reaches the tunnel of the account whose TXT verification record is in the domain's DNS. Adding your domain name to another account gives that account none of your mail.
* The app only delivers to the hosts in its own settings. A request cannot name another host.
* Notification text reaches commands as data, never as part of a command line.
* The browser app listens on `127.0.0.1` only and accepts requests only from its own page.
* Report security issues to <mailto:security@forwardemail.net>.


## Development

```sh
npm install
npm test
npm run build
```

`test/app.js` runs on every system. `test/mail-server.js` starts a real Postfix and Dovecot and needs both installed and root:

```sh
sudo apt-get install -y postfix dovecot-imapd dovecot-lmtpd
sudo npm test
```


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)


## Disclaimer

Forward Email is not affiliated with, endorsed by, or sponsored by SpaceX or Starlink. Starlink and SpaceX are trademarks of Space Exploration Technologies Corp.
