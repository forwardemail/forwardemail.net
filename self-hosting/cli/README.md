# forwardemail-selfhost

> \[!WARNING]
> Experimental and not yet released. `init` pulls the published image, which does not include the lite install yet (see [Testing a local build](#testing-a-local-build)), and certificate renewal and backups are not built yet.

A step-by-step installer and manager for a small ("lite") self-hosted Forward Email mail server: one box (a Mac mini, a Raspberry Pi 5, a small VPS), a domain or two and a few mailboxes.

It runs [`../lite/docker-compose.yml`](../lite/docker-compose.yml), which has three containers: the app, with every process run by [`../lite/supervisor.js`](../lite/supervisor.js), plus MongoDB and Redis. The full install uses one container per process. One hostname, e.g. `mail.example.com`, serves MX, IMAP, SMTP and the web interface, so one certificate covers everything.

## Requirements

* Docker with Compose v2. On macOS use OrbStack, Colima or Docker Desktop, with the VM given 4 GB or more.
* arm64 or x86-64. The Raspberry Pi needs a Pi 5: MongoDB 5+ does not run on a Pi 4's CPU.
* A domain you control. IMAP and SMTP logins check its TXT record in public DNS, even on a LAN.
* For mail to and from the internet:
  * inbound port 25 forwarded to the box
  * outbound port 25 open (often blocked on home connections)
  * reverse DNS for the public address

## Usage

```sh
forwardemail-selfhost init        # checks, questions, certificate, start, first mailbox
forwardemail-selfhost doctor      # are the DNS records published, are the ports reachable
forwardemail-selfhost provision --email you@example.com [--mailbox name]
forwardemail-selfhost status | up | down | logs -f | upgrade [--version v2.19.21]
```

An install lives in `~/forwardemail` by default; change it with `--dir` or `FORWARDEMAIL_DIR`. Keep a copy of its `.env`: mailboxes and stored credentials cannot be read without the secrets in it.

## Development

```sh
pnpm install
pnpm test          # unit tests (node:test)
pnpm run typecheck
pnpm run build     # dist/cli.cjs, with the lite compose file and env template embedded
pnpm run build:sea # also dist/forwardemail-selfhost-<os>-<arch>, a single executable (Node 22+)
```

A single executable can only be built for the OS and architecture it is built on, so releases build one on a runner of each.

### Testing a local build

By default `init` pulls the published image. To test changes to the app, build the image from the repository root, then run `init` with `--version` set to its tag. If an image with that tag exists locally, `init` uses it and only pulls MongoDB and Redis.

```sh
docker build -f self-hosting/Dockerfile-selfhosted -t ghcr.io/forwardemail/forwardemail.net-selfhosted:dev .
cd self-hosting/cli && pnpm install && pnpm run build
node dist/cli.cjs init --dir ~/fe-test --version dev
```

* Choose a self-signed certificate. Ports 25, 465, 993 and 443 must be free.
* For the domain, use a subdomain of a domain you own (e.g. `selfhost-test.example.com`) and publish only the `forward-email-site-verification` TXT record from the output. That is enough for IMAP and SMTP logins against `127.0.0.1`.
* Mail from or to the internet also needs the MX and A records, port 25 open in both directions and a public address, so test that on the target box.
* Reset with `node dist/cli.cjs down --dir ~/fe-test && rm -rf ~/fe-test`.
