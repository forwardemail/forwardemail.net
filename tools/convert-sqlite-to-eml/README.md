# convert-sqlite-to-eml

> Standalone CLI tool to convert [Forward Email](https://forwardemail.net) encrypted SQLite mailbox backups to EML files packaged in a password-protected ZIP archive.


## Features

* **Interactive CLI** — prompts for file path, password, and output location
* **Non-interactive mode** — pass arguments via command-line flags for scripting
* **Cross-platform** — works on Windows, Linux, and macOS
* **Encrypted database support** — handles both chacha20 and aes256cbc ciphers
* **Brotli decompression** — transparently decompresses modern compressed metadata and attachments
* **Password-protected ZIP** — output archive is encrypted with AES-256
* **Organized output** — EML files are organized by mailbox folder (INBOX, Sent, Drafts, etc.)
* **Pre-built binaries** — download from [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases) (no Node.js required)


## Installation

### Pre-built Binaries

Download the latest release for your platform from [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Platform | Architecture  | File                                 |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS users:** After downloading, you may need to remove the quarantine attribute before running the binary:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Replace `./convert-sqlite-to-eml-darwin-arm64` with the actual path to the downloaded file.)

> **Linux users:** After downloading, you may need to make the binary executable:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Replace `./convert-sqlite-to-eml-linux-x64` with the actual path to the downloaded file.)

### From npm

```bash
npm install -g @forwardemail/convert-sqlite-to-eml
```

### From source

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```


## Usage

### Interactive Mode

Run without arguments to be prompted for all inputs:

```bash
convert-sqlite-to-eml
```

```
  Forward Email - Convert SQLite Backup to EML
  =============================================

  Path to SQLite backup file: /path/to/backup.sqlite
  IMAP/alias password: ********
  Output ZIP path [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

### Non-interactive Mode

```bash
convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

### Options

| Flag                | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `--path <path>`     | Path to the encrypted SQLite backup file               |
| `--password <pass>` | IMAP/alias password for decryption                     |
| `--output <path>`   | Output path for the ZIP file (default: auto-generated) |
| `--help`            | Show help message                                      |


## Output Format

The tool produces a password-protected ZIP archive (AES-256 encrypted) containing:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
...
```

* Each `.eml` file is a standard RFC 5322 email message
* Files are organized by mailbox folder
* The ZIP password is the same as your IMAP/alias password
* EML files can be opened with any email client (Thunderbird, Outlook, Apple Mail, etc.)
* EML files can be imported into other mail servers


## How It Works

1. Opens the encrypted SQLite database using your IMAP/alias password
2. Reads the Mailboxes table to discover folder structure
3. For each message, decodes the mimeTree (brotli-compressed JSON) from the Messages table
4. Reconstructs the full EML by walking the MIME tree and fetching attachment bodies from the Attachments table
5. Packages everything into a password-protected ZIP archive


## Requirements

* Node.js >= 18 (if running from source)
* No Node.js required for pre-built binaries


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)


## Links

* [Forward Email](https://forwardemail.net)
* [FAQ: Custom S3 Storage](https://forwardemail.net/faq#how-do-i-use-my-own-s3-compatible-storage-for-backups)
* [GitHub Issues](https://github.com/forwardemail/forwardemail.net/issues)
