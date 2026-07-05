# Self-Hosting Forward Email

Run the entire Forward Email stack (MX forwarding, outbound SMTP, IMAP/POP3 mailboxes, CalDAV, CardDAV, web interface, and REST API) on your own server.

## Quick start

On a fresh Ubuntu (20.04/22.04/24.04) or Debian (11/12) server, as root:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Choose **Initial Setup**. The script runs preflight checks (RAM, ports, outbound port 25), installs Docker, issues TLS certificates, generates all secrets, starts the stack, and prints the exact DNS records to create. Then open `https://yourdomain.com` and follow the in-app setup wizard to create your admin account, add your domain, and verify DNS.

Unattended install:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh) \
  --action initial-setup --domain example.com --cert-method http --yes
```

## Requirements

* Ubuntu 20.04+ or Debian 11+ on amd64 or arm64
* 2GB RAM minimum (4GB+ recommended for the full stack)
* 20GB+ free disk space
* A domain you control, a public IP, outbound port 25, and the ability to set reverse PTR

## Documentation

* [Step-by-step Ubuntu guide](https://forwardemail.net/guides/selfhosted-on-ubuntu)
* [Step-by-step Debian guide](https://forwardemail.net/guides/selfhosted-on-debian)
* [Self-hosted overview & FAQ](https://forwardemail.net/self-hosted)
* [Releases / CI details](./self-hosting/README.md)

## Maintenance

Re-run the setup script for the maintenance menu: backups to any S3-compatible storage (Mongo, Redis, and encrypted SQLite mailboxes), nightly auto-updates with health-checked rollback, certificate renewal, and restore from backup.
