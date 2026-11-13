# Spam Scanner

[Spam Scanner](https://spamscanner.net) scans the mail Forward Email receives (MX) and sends (SMTP, the API, and resent emails). It runs in worker threads (`helpers/spam-scanner.js`, `helpers/spam-scanner-worker.js`), with an optional local language model for close calls. This page covers what it does by default, its settings, and how to run it.


## Table of Contents

* [What it does](#what-it-does)
  * [Monitor mode](#monitor-mode)
  * [Inbound mail](#inbound-mail)
  * [Outbound mail](#outbound-mail)
  * [Mail that is never scanned](#mail-that-is-never-scanned)
  * [Domain settings](#domain-settings)
  * [Abuse reports](#abuse-reports)
* [Language model](#language-model)
* [Environment variables](#environment-variables)
* [Logs and stats](#logs-and-stats)
* [Runbook](#runbook)
  * [Deploying](#deploying)
  * [Checking it works](#checking-it-works)
  * [Turning things off](#turning-things-off)
  * [Workers busy, or mail unchecked](#workers-busy-or-mail-unchecked)
  * [The language model](#the-language-model)
  * [Recipient blocks](#recipient-blocks)
  * [Leaving monitor mode](#leaving-monitor-mode)
* [Limits](#limits)


## What it does

### Monitor mode

Spam Scanner starts in monitor mode (`SPAM_SCANNER_MONITOR_ONLY`, on unless set to `false`). In monitor mode nothing it or its language model finds rejects, defers, blocks, or files mail as spam, and a scan that fails changes nothing. What it would do is written to the console as `[SPAM_SCANNER]` lines.

The exception is what outbound mail was already refused for before Spam Scanner 7 (see [Outbound mail](#outbound-mail)). That is still refused in monitor mode, unless `SPAM_SCANNER_OUTBOUND_BLOCK=false`.

### Inbound mail

* `SPAM_SCANNER_MX_PERCENT` of inbound mail is scanned (10 by default, each message picked at random). Change it and restart the MX servers to scan more or less.
* The scan runs while the recipients are looked up. In monitor mode the MX server waits at most `SPAM_SCANNER_MX_WAIT` (1 second) for it, then delivers without its headers while the scan finishes and is logged.
* A scanned message gets `X-Spam-Scanner-Version`, `-Flag`, `-Score`, `-Action`, `-Status`, `-Language` and `-LLM` headers. These replace any a sender added. The standard `X-Spam-*` headers are added only out of monitor mode.
* The MX server's SPF, DKIM, DMARC and ARC results count toward the score.
* Inbound mail is scanned with the default settings, whatever the recipient's domain has set.

### Outbound mail

When a message is submitted (SMTP, API, or resent from My Account), it is scanned. In monitor mode too, it is refused (SMTP 554, API 403), and the domain's admins are emailed (once a day at most), for:

* a virus (only when ClamAV is turned on, `SPAM_SCANNER_CLAMAV`)
* the GTUBE test string
* a program attachment (`.exe`, `.js`, `.bat` and the like, also in archives and attached messages), unless the domain turned executable protection off
* a link to a host Cloudflare's malware resolver blocks for phishing or malware (always)
* a link to a host Cloudflare's family resolver blocks for adult content, if the domain turned adult content protection on
* links to more than 250 different hosts (too many to look up), or content too complex to check in full

A submission that cannot be scanned in monitor mode is queued marked unchecked rather than refused, so a busy server never refuses mail. This happens when the scan fails, times out, or the workers are busy. Such mail is scanned again as it is sent, refused for the same findings, and deferred while it still cannot be scanned. One hour after it was queued, it is sent unchecked and reported, rather than retried until it bounces.

As mail is sent (`smtp-bree`), the verdict kept from submission is used. The language model is asked only where its verdict could change the outcome. Anything Spam Scanner would reject as spam is only logged unless both `SPAM_SCANNER_MONITOR_ONLY=false` and `SPAM_SCANNER_OUTBOUND_MONITOR_ONLY=false`.

### Mail that is never scanned

* Outbound mail from our own domain (`WEB_HOST`), and mail only to our own addresses.
* Inbound mail only to our own addresses, and mail with a passing DKIM signature of our domain aligned with its From address.
* Our own bounces (DSNs).

### Domain settings

Each domain's Advanced Settings page has these settings. They apply to mail the domain sends; mail it receives is scanned with the defaults. Domains on the free plan always have the defaults.

| Setting                        | Default | What it does                                                                                                                               |
| ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `has_adult_content_protection` | `false` | Links are checked with Cloudflare's family resolver too, and mail linking to a site it blocks for adult content is refused.                |
| `has_executable_protection`    | `true`  | Mail with a program attachment is refused. Turned off, program attachments neither block mail nor count toward the score.                  |
| `has_phishing_protection`      | `true`  | No longer a setting: phishing and malware links are always checked and refused. Kept for API clients, and ignored by the web form and API. |
| `has_virus_protection`         | `true`  | No longer a setting: viruses are refused whenever ClamAV is turned on. Kept for API clients, and ignored by the web form and API.          |

The first time `bree` starts with this version, the `reset-spam-scanner-settings` job turns adult content protection off for every domain, and phishing and virus protection on. It runs once: a `migrations` document in MongoDB marks it done, so an owner who turns adult content protection back on keeps it.

### Abuse reports

Abuse reports (ARF) that mailbox providers' feedback loops send to `EMAIL_ABUSE` are read by the MX server (`helpers/arf-report.js`). A report is read only if:

* it is to `EMAIL_ABUSE` alone, about abuse, fraud or a virus
* it is from an address in `ARF_REPORTERS`, passing DMARC with a DKIM signature of its own domain
* the reporter's root domain is in `TRUTH_SOURCES`

Any other mail to `EMAIL_ABUSE` is delivered as before. So is a report that nothing came of, or one that could not be handled.

A report read:

* counts against the outbound SMTP reputation of the user who sent the message, as a truth source's spam rejection does
* blocks the sender of a message we forwarded, for the reporting alias's forwarding address alone, for 90 days (`ARF_RECIPIENT_BLOCK`). The sender's mail to that address then gets a temporary error (421). The block is listed on the alias's page, where its owner can lift it
* is learned by every server's classifier as spam (`ARF_LEARN`), within daily limits for each mailbox, account and the whole service. Only the message's features that name no party are learned


## Language model

The language model is optional: Spam Scanner works the same without it. On each MX and SMTP server, `ansible/playbooks/spamscanner-llm.yml` (imported by `mx1.yml`, `mx2.yml` and `smtp.yml`) sets up a dedicated Ollama:

* It listens on `127.0.0.1:SPAM_SCANNER_LLM_PORT` (11436) and can reach only loopback, so nothing can have it download a model. The playbook lifts that only while it pulls the base model.
* It runs as its own user, with its own binary, a pinned version and a checksum, a memory limit (`SPAM_SCANNER_LLM_MEMORY_MAX`), a CPU quota of half the server's CPUs, and a low CPU and I/O weight, so mail comes first.
* The model `spamscanner` is made from `SPAM_SCANNER_LLM_BASE_MODEL` (`gemma4:e2b`) and is loaded whenever Ollama starts (`ollama-spamscanner-warmup.service`).
* A health check runs every 5 minutes (`ollama-spamscanner-health-check.timer`). It restarts Ollama when it does not answer, and loads the model when it is not loaded. Failures alert through `failure-notification@`.
* It is not set up, or is stopped, on a server with one CPU, or with less memory than `SPAM_SCANNER_LLM_MEMORY_MAX` plus 2 GB: free memory before it first starts, and all the server has once it runs, so a deploy while mail is busy does not stop it. It is also stopped when `SPAM_SCANNER_LLM_MODE=off`. Ollama or its model failing to install, start or load is a warning, never a failed MX or SMTP deploy.

The app checks in the background whether the model is ready (`GET /api/ps`). It checks every 15 seconds while the model is ready, and every minute while it is not. No scan asks the model until it is ready, so a server without it, or one still loading it, scans as fast as with it off. While the model cannot be reached, it is not asked for 30 seconds, doubling to 5 minutes.

The model is asked only about close calls (`SPAM_SCANNER_LLM_MODE=auto`): inbound mail whose score is near the threshold, and outbound mail as it is sent. It reads at most `SPAM_SCANNER_LLM_MAX_INPUT_CHARS` of a message and answers within `SPAM_SCANNER_LLM_TIMEOUT` (3 seconds), or is not waited for.


## Environment variables

All are in `.env.defaults` and `.env.schema`. A duration under 100 ms (such as `0`) keeps its default.

| Variable                                | Default                   | Meaning                                                                                                                                     |
| --------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `SPAM_SCANNER_ENABLED`                  | `true`                    | `false`: no scans, except of outbound mail for what blocks it (see `SPAM_SCANNER_OUTBOUND_BLOCK`).                                          |
| `SPAM_SCANNER_MONITOR_ONLY`             | `true`                    | Only log what would be marked as spam or blocked. Off only when explicitly `false`.                                                         |
| `SPAM_SCANNER_OUTBOUND_MONITOR_ONLY`    | `true`                    | Out of monitor mode: `false` rejects outbound spam at the reject threshold as it is sent.                                                   |
| `SPAM_SCANNER_OUTBOUND_BLOCK`           | `true`                    | Refuse outbound mail for a virus, program attachment, blocked link or GTUBE, in monitor mode too. `false` only logs it in monitor mode.     |
| `SPAM_SCANNER_OUTBOUND_FAIL_CLOSED`     | `true`                    | Out of monitor mode: an outbound message that could not be checked gets a temporary error. `false` sends it unchecked.                      |
| `SPAM_SCANNER_HEADERS`                  | `true`                    | Add `X-Spam-Scanner-*` headers to inbound mail.                                                                                             |
| `SPAM_SCANNER_MX_PERCENT`               | `10`                      | Percentage of inbound mail scanned (0 to 100). Read when the MX server starts.                                                              |
| `SPAM_SCANNER_MX_WAIT`                  | `1s`                      | In monitor mode, the most the MX server waits for a scan before delivering without its headers.                                             |
| `SPAM_SCANNER_TIMEOUT`                  | `8s`                      | Time limit of a scan that only logs (22s at most).                                                                                          |
| `SPAM_SCANNER_NETWORK_TIMEOUT`          | `2s`                      | Time limit of each network check (link lookups) of such a scan.                                                                             |
| `SPAM_SCANNER_OUTBOUND_TIMEOUT`         | `20s`                     | Time limit of a scan that decides what is blocked (22s at most).                                                                            |
| `SPAM_SCANNER_OUTBOUND_NETWORK_TIMEOUT` | `5s`                      | Time limit of each network check of such a scan.                                                                                            |
| `SPAM_SCANNER_THREADS`                  | `1`                       | Worker threads per process (each loads the classifier, about 60 MB).                                                                        |
| `SPAM_SCANNER_MAX_MEMORY`               | `512`                     | Most memory each worker may use (MB).                                                                                                       |
| `SPAM_SCANNER_SEND_THREADS`             | `2`                       | Worker threads in `smtp-bree`, which scans outbound mail as it is sent.                                                                     |
| `SPAM_SCANNER_MAX_QUEUE`                | `50`                      | Scans waiting for a worker, beyond which mail goes unscanned (out of monitor mode, outbound mail is then held back with a temporary error). |
| `SPAM_SCANNER_MAX_SIZE`                 | `25MB`                    | Larger messages are not scanned by scans that only log (`0`: no limit).                                                                     |
| `SPAM_SCANNER_STATS_INTERVAL`           | `1m`                      | How often each process writes a `[SPAM_SCANNER] stats` line (`0` or `off`: never).                                                          |
| `SPAM_SCANNER_CLOUDFLARE`               | (empty: on, except tests) | Look link hosts up with Cloudflare's malware (1.1.1.2) and family (1.1.1.3) resolvers.                                                      |
| `SPAM_SCANNER_CLAMAV`                   | `false`                   | Scan attachments with clamd on its default socket (Ansible does not install ClamAV).                                                        |
| `SPAM_SCANNER_LLM_MODE`                 | `auto`                    | `auto` (close calls only), `always`, or `off` (also `false`, `0`, `no`).                                                                    |
| `SPAM_SCANNER_LLM_PORT`                 | `11436`                   | Port of the local Ollama.                                                                                                                   |
| `SPAM_SCANNER_LLM_URL`                  | (empty: local Ollama)     | Another model server. One on the server itself must be `127.0.0.1` or `localhost` on `SPAM_SCANNER_LLM_PORT`.                               |
| `SPAM_SCANNER_LLM_API_KEY`              | (empty)                   | Only for a server that requires one.                                                                                                        |
| `SPAM_SCANNER_LLM_PROVIDER`             | `ollama`                  | See [Spam Scanner's LLM docs](https://spamscanner.net/docs/llm/).                                                                           |
| `SPAM_SCANNER_LLM_MODEL`                | `spamscanner`             | The model asked for (made by Ansible).                                                                                                      |
| `SPAM_SCANNER_LLM_BASE_MODEL`           | `gemma4:e2b`              | (Ansible) The model it is made from.                                                                                                        |
| `SPAM_SCANNER_LLM_MEMORY_MAX`           | `8G`                      | (Ansible) Most memory Ollama may use.                                                                                                       |
| `SPAM_SCANNER_LLM_PULL`                 | `false`                   | (Ansible) Pull the base model again (otherwise only when missing).                                                                          |
| `SPAM_SCANNER_LLM_TIMEOUT`              | `3s`                      | Most a model answer may take.                                                                                                               |
| `SPAM_SCANNER_LLM_MAX_INPUT_CHARS`      | `1500`                    | Characters of a message the model reads.                                                                                                    |
| `SPAM_SCANNER_LLM_REDACT`               | (empty: unless local)     | Remove personal data before a message goes to the model.                                                                                    |
| `SPAM_SCANNER_LLM_KEEP_ALIVE`           | `-1m`                     | How long Ollama keeps the model loaded (`-1m`: always).                                                                                     |
| `ARF_ENABLED`                           | `true`                    | Read abuse reports. `false` delivers them as before.                                                                                        |
| `ARF_REPORTERS`                         | Yahoo's and Microsoft's   | Feedback loop addresses, comma-separated (`@domain` for any address at that domain).                                                        |
| `ARF_LEARN`                             | `true`                    | Learn messages reported as spam.                                                                                                            |
| `ARF_RECIPIENT_BLOCK`                   | `true`                    | Block the sender of mail we forwarded that its recipient reported, for that forwarding address alone.                                       |


## Logs and stats

Spam Scanner writes to the console (pm2's logs), not to the Logs collection:

* `[SPAM_SCANNER] <verdict> {…}`: a message it would mark as spam, reject or block, with the score and tests, blocking findings, the language model's verdict, the client, the envelope sender, the From address, the subject (codes and addresses redacted, links reduced to their host), the recipient domains, and where it was scanned (`received`, `submitted` or `sending`). The body is never logged. These lines are for the monitor-mode trial run.
* `[SPAM_SCANNER] stats {…}`: every minute per process. It shows, by where mail was scanned, how many scans were made, not picked, skipped, expired, timed out, stopped and failed, the spam and blocking verdicts, scan times (average, median, p95, p99, slowest; waiting, on the worker, the language model), and errors and warnings.
* Warnings (scans skipped or timed out, the language model, unchecked mail) and errors are written once a minute at most, with a count.
* `[ARF]`: abuse reports read.


## Runbook

### Deploying

1. Nothing has to be set: the defaults are monitor mode, 10% of inbound mail, and no ClamAV. To deploy without the language model, set `SPAM_SCANNER_LLM_MODE=off`.
2. Run the MX and SMTP playbooks (`mx1.yml`, `mx2.yml`, `smtp.yml`). They set up Ollama before the mail servers, and its model loads in the background. A server with too little free memory, or one CPU, skips it with a warning.
3. Deploy the app as usual (`pm2 deploy`). On its first start, `bree` runs the settings reset once.

Until Ollama has loaded the model, scans go on without it and never wait for it.

### Checking it works

* `pm2 logs mx | grep '\[SPAM_SCANNER\] stats'`, and the same for `smtp-bree` and the SMTP and API processes. Look for scans made, few timed out or skipped, and p95 scan times well under the time limits.
* `curl -s http://127.0.0.1:11436/api/ps` on an MX or SMTP server lists `spamscanner` when the model is loaded.
* `systemctl status ollama-spamscanner ollama-spamscanner-health-check.timer`, and `journalctl -u ollama-spamscanner -u ollama-spamscanner-warmup -u ollama-spamscanner-health-check`.
* The app logs `spam scanner language model is not ready` (with the reason) once until the model is ready.

### Turning things off

Change the variable in `.env.production`, push it with `node ansible-playbook ansible/playbooks/env.yml --user deploy`, and reload the processes it applies to (for example `pm2 reload mx`).

| To stop                                               | Set                                                               |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Inbound scanning (any load on the MX servers)         | `SPAM_SCANNER_MX_PERCENT=0`                                       |
| All scanning but outbound refusals                    | `SPAM_SCANNER_ENABLED=false`                                      |
| Outbound refusals in monitor mode                     | `SPAM_SCANNER_OUTBOUND_BLOCK=false`                               |
| The language model                                    | `SPAM_SCANNER_LLM_MODE=off`, and run the playbooks to stop Ollama |
| Reading abuse reports (they are delivered as before)  | `ARF_ENABLED=false`                                               |
| Blocking senders after reports, or learning from them | `ARF_RECIPIENT_BLOCK=false`, or `ARF_LEARN=false`                 |

### Workers busy, or mail unchecked

If the stats show many `skipped_busy` or `expired` scans, or warnings about unchecked mail:

* Give the processes more workers (`SPAM_SCANNER_THREADS`; each needs about 60 MB plus up to `SPAM_SCANNER_MAX_MEMORY`) or a longer queue (`SPAM_SCANNER_MAX_QUEUE`).
* For `smtp-bree`, raise `SPAM_SCANNER_SEND_THREADS`. With `SMTP_PISCINA_ENABLED=true`, each of its threads starts a worker of its own, so watch memory.
* Lower `SPAM_SCANNER_MX_PERCENT` to take inbound load off the MX servers.

In monitor mode, unchecked outbound mail is held at most an hour after it was queued, then sent.

### The language model

* **Not ready:** check the health check's journal. Common causes are too little memory (the playbook skipped it), the model not pulled yet (run the playbook again; a pull that stalled goes on from where it stopped), or Ollama stopped by its start limit (the health check starts it again within 30 minutes).
* **A new base model:** set `SPAM_SCANNER_LLM_BASE_MODEL` (or `SPAM_SCANNER_LLM_PULL=true` to pull the same tag again) and run the playbooks.
* **Slow answers:** the model is asked for close calls only, with a 3-second limit. Answers that time out are not waited for; the stats show how long they took.

### Recipient blocks

An alias owner sees blocks on the alias's page in My Account and can lift them there. A block lasts 90 days. It applies only while the alias exists with that forwarding address on a paid plan, and a block that cannot be read counts as none.

### Leaving monitor mode

1. Set `SPAM_SCANNER_MX_PERCENT=100` and watch the `[SPAM_SCANNER]` lines and stats for false positives for a while.
2. Turn on the code marked `TODO: once out of monitor mode` in `helpers/on-data-mx.js` (deferring spam that would be forwarded, filing spam in the Junk folder, each recipient domain's settings) and the `TODO` in `helpers/parse-payload.js` (Junk folder delivery).
3. Set `SPAM_SCANNER_MONITOR_ONLY=false`. To also reject outbound spam as it is sent, set `SPAM_SCANNER_OUTBOUND_MONITOR_ONLY=false`.
4. Before relying on what was learned from abuse reports, consider learning only reports about mail Spam Scanner itself scored as likely spam. Anyone with a paid domain and a Yahoo or Outlook mailbox can report mail they sent themselves, within the daily limits.


## Limits

* Workers are per process: each SMTP, API and MX process has its own, and so does each `smtp-bree` thread with `SMTP_PISCINA_ENABLED=true`.
* What is learned from abuse reports is shared by every server, through Redis.
* Monitor mode still refuses, at submission, what outbound mail was refused for before Spam Scanner 7. Header limits (`helpers/header-limits.js`) refuse malformed headers no parser reads the same way: 421 on the MX servers, 552 on SMTP, and 400 from the API.
