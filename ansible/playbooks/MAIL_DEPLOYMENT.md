# SnappyMail (Webmail) Deployment Documentation

## Overview

This document describes the deployment configuration for Forward Email's webmail interface using SnappyMail with custom branding via the mail-overrides repository.

## Architecture

```
forwardemail.net (main monorepo)
└── ansible/
    └── playbooks/
        └── mail.yml          # Deployment playbook
            └── templates/snappymail/
                ├── nginx.conf.j2
                ├── php-fpm-www.conf.j2
                ├── php-fpm.ini.j2
                └── snappymail-site.conf.j2

Deployed to: /var/www/snappymail/
    ├── dist/                 # SnappyMail build output (served by Nginx)
    │   └── data/             # Runtime data directory
    ├── configs/              # Configuration files
    └── scripts/
        └── build.sh         # Generates dist/ from the clean submodule
```

## Repository Structure

The deployment uses a layered approach:

1. **mail-overrides** (https://github.com/forwardemail/mail-overrides)
   - Contains Forward Email specific customizations
   - Has nested **mail** submodule (https://github.com/forwardemail/mail)

2. **mail** (SnappyMail clone)
   - Clean fork of SnappyMail
   - Stays in sync with upstream
   - No Forward Email branding

3. **Deployment Flow**:
   ```
   ansible-playbook mail.yml
     → Clone mail-overrides
     → Initialize mail/ submodule
     → Run build.sh (produces dist/ with overrides applied)
     → Configure Nginx to serve from /var/www/snappymail/dist/
   ```

## Environment Variables

All environment variables should be defined in `.env` or `.env.defaults` in the forwardemail.net root.

### Required Variables

#### Deployment Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MAIL_REPO` | Git repository URL for mail-overrides | `git@github.com:forwardemail/mail-overrides.git` | `git@github.com:yourorg/mail-overrides.git` |
| `MAIL_GIT_BRANCH` | Git branch to deploy | `main` | `production`, `staging` |
| `MAIL_HOST` | Server hostname for the mail server | `mail.forwardemail.net` | `webmail.example.com` |
| `MAIL_APP_PATH` | Application installation path | `/var/www/snappymail` | `/var/www/webmail` |

#### Web Server Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MAIL_SERVER_NAME` | Nginx server_name (domain) | `mail.forwardemail.net` | `webmail.example.com` |
| `MAIL_PROXY_PORT` | HTTP port for firewall rules | `80` | `8080` |
| `MAIL_HTTP_PORT` | HTTPS port for firewall rules | `443` | `8443` |
| `MAIL_SSL_ENABLED` | Enable HTTPS/SSL | `true` | `false` (dev only) |

#### Nginx Performance Configuration

| Variable | Description | Default | Recommended Range |
|----------|-------------|---------|-------------------|
| `MAIL_NGINX_WORKER_CONNECTIONS` | Max connections per worker | `4096` | `1024-8192` |
| `MAIL_MAX_UPLOAD_SIZE` | Max file upload size | `50M` | `10M-100M` |
| `MAIL_CONN_LIMIT_PER_IP` | Concurrent connections per IP | `50` | `25-100` |
| `MAIL_RATE_LIMIT_API` | API requests per second | `10` | `5-20` |
| `MAIL_RATE_LIMIT_PAGES` | Page requests per second | `30` | `10-50` |

#### PHP-FPM Performance Configuration

| Variable | Description | Default | Recommended Range |
|----------|-------------|---------|-------------------|
| `MAIL_PHP_MAX_CHILDREN` | Max PHP-FPM worker processes | `200` | `50-500` (based on RAM) |
| `MAIL_PHP_START_SERVERS` | PHP-FPM processes on startup | `20` | `10-50` |
| `MAIL_PHP_MIN_SPARE` | Min idle PHP-FPM processes | `10` | `5-25` |
| `MAIL_PHP_MAX_SPARE` | Max idle PHP-FPM processes | `30` | `10-75` |
| `MAIL_PHP_MAX_REQUESTS` | Requests per worker before respawn | `1000` | `500-2000` |
| `MAIL_PHP_MEMORY_LIMIT` | PHP memory limit per process | `128M` | `64M-256M` |

#### Application Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MAIL_REDIS_URL` | Redis connection for PHP sessions | `tcp://127.0.0.1:6379?database=0` | `tcp://redis.internal:6379?database=1` |
| `MAIL_TIMEZONE` | Application timezone | `UTC` | `America/Los_Angeles` |

## Deployment

### Prerequisites

1. Ansible installed on control machine
2. SSH access to target server(s) with deploy user
3. Environment variables configured in `.env`
4. Target server in Ansible inventory under `[mail]` group

### Deploy Command

```bash
# From forwardemail.net root
ansible-playbook ansible/playbooks/mail.yml
```

### What Happens During Deployment

1. **Security & SSH Setup** (imported playbooks)
   - Configures firewall rules
   - Sets up SSH keys for deploy user

2. **Hostname Configuration**
   - Sets server hostname from `MAIL_HOST`

3. **PHP-FPM Installation**
   - Adds Ondrej PHP repository
   - Installs PHP 8.2 with required extensions
   - Configures PHP-FPM pool with performance settings
   - Sets up logging and logrotate

4. **Nginx Installation**
   - Installs Nginx with extras module
   - Configures main nginx.conf with rate limiting
   - Sets up log rotation

5. **Application Deployment**
   - Creates `/var/www/snappymail` directory (owned by deploy user)
   - Clones mail-overrides repository
   - Initializes mail/ submodule recursively
   - Runs `./scripts/build.sh` to generate `dist/` with customizations
   - Sets permissions on `dist/data` (www-data)

6. **Nginx Site Configuration**
   - Deploys site config to `/etc/nginx/sites-available/snappymail.conf`
   - Enables site with symlink
   - Reloads Nginx

7. **Health Checks**
   - Creates health check script
   - Sets up cron job (every 5 minutes)

## File Paths

- **Application Root**: `/var/www/snappymail/`
- **Document Root**: `/var/www/snappymail/dist/` (served by Nginx)
- **Data Directory**: `/var/www/snappymail/dist/data/` (www-data:www-data, 0700)
- **Nginx Config**: `/etc/nginx/sites-available/snappymail.conf`
- **PHP-FPM Pool**: `/etc/php/8.2/fpm/pool.d/www.conf`
- **PHP Settings**: `/etc/php/8.2/fpm/conf.d/99-snappymail.ini`
- **Logs**:
  - Nginx: `/var/log/nginx/snappymail-{access,error}.log`
  - PHP-FPM: `/var/log/php-fpm/snappymail-{error,slow}.log`

## SSL/TLS Configuration

When `MAIL_SSL_ENABLED=true`:
- Certificate: `/var/www/production/.ssl-ca`
- Private Key: `/var/www/production/.ssl-key`
- HTTP automatically redirects to HTTPS
- HSTS header enabled (max-age=1 year)

## Security Features

1. **PHP Security**
   - `open_basedir` restricted to app path + /tmp
   - Dangerous functions disabled (exec, shell_exec, system, etc.)
   - Secure session handling via Redis

2. **Nginx Security**
   - Security headers (CSP, X-Frame-Options, etc.)
   - Rate limiting on API and page requests
   - Connection limiting per IP
   - Blocks access to sensitive files (.git, .env, etc.)
   - Blocks PHP execution in data directories

3. **Firewall**
   - UFW enabled with deny-all incoming policy
   - SSH allowed (with rate limiting)
   - HTTP/HTTPS ports opened based on config

## Troubleshooting

### Check Service Status

```bash
# PHP-FPM
sudo systemctl status php8.2-fpm
sudo tail -f /var/log/php-fpm/snappymail-error.log

# Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/snappymail-error.log

# Test Nginx config
sudo nginx -t
```

### Common Issues

**1. Submodule not initialized**
```bash
cd /var/www/snappymail
sudo -u deploy git submodule update --init --recursive
```

**2. Customizations not appearing**
```bash
cd /var/www/snappymail
sudo -u deploy ./scripts/build.sh
ls -la dist/snappymail/v/0.0.0/plugins/forwardemail/
```

**3. Permission issues**
```bash
# Data directory should be www-data:www-data
sudo chown -R www-data:www-data /var/www/snappymail/dist/data
sudo chmod 700 /var/www/snappymail/dist/data
```

**4. PHP-FPM socket errors**
```bash
# Check socket exists and has correct permissions
ls -la /run/php/php8.2-fpm.sock
# Should be: srw-rw---- www-data www-data
```

## Updating

### Update Application Code

```bash
ansible-playbook ansible/playbooks/mail.yml
```

This will:
1. Pull latest from mail-overrides repository
2. Update mail/ submodule
3. Re-run build script
4. Reload services if needed

### Update Only Customizations

If you only changed plugins/themes in mail-overrides:

```bash
cd /var/www/snappymail
sudo -u deploy git pull
sudo -u deploy ./scripts/build.sh
```

### Update SnappyMail Version

To update the underlying SnappyMail version:

1. Update the mail/ submodule in mail-overrides repository
2. Deploy via Ansible (pulls updated submodule)

## Performance Tuning

### High Traffic Sites

For sites with >1000 concurrent users, consider:

```bash
MAIL_PHP_MAX_CHILDREN=500
MAIL_PHP_START_SERVERS=50
MAIL_PHP_MIN_SPARE=25
MAIL_PHP_MAX_SPARE=75
MAIL_NGINX_WORKER_CONNECTIONS=8192
```

### Memory Considerations

Each PHP-FPM worker uses ~32-64MB of RAM. Calculate:
```
Available RAM / Average Worker Size = Max Children
Example: 16GB / 64MB = ~250 workers
```

Set `MAIL_PHP_MAX_CHILDREN` to 80% of calculated value to leave room for other processes.

## Monitoring

### Health Check

The deployment includes a health check cron that runs every 5 minutes:
- Checks PHP-FPM service status
- Checks Nginx service status
- Verifies localhost responds

### Metrics Endpoints

Available at localhost only:
- PHP-FPM status: `http://localhost/status`
- PHP-FPM ping: `http://localhost/ping`
- Nginx status: `http://localhost/nginx_status`

Access via SSH tunnel:
```bash
ssh -L 8080:localhost:80 user@mail.forwardemail.net
curl http://localhost:8080/status
```

## Related Documentation

- [mail-overrides README](https://github.com/forwardemail/mail-overrides)
- [forwardemail/mail](https://github.com/forwardemail/mail)
- [SnappyMail Docs](https://github.com/the-djmaze/snappymail)
