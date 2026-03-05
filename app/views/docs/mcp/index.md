# Talk to Your Email with MCP

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

> Our MCP (Model Context Protocol) server lets you connect AI assistants like Claude and ChatGPT to your email. Instead of writing code, you can manage your email with natural language.

This is email automation, simplified. It's a direct, secure, and open-source way to build powerful workflows.


## What is MCP?

MCP is an open standard that allows AI models to securely access external tools. Our MCP server exposes our entire API — all 68 endpoints — as tools that AI assistants can use on your behalf. It runs locally, and your API key is never exposed to the model.


## Quick Start

1. **Get an API Key**: You can get one from your Forward Email account settings.
2. **Configure Your Client**: Add the server to your MCP client (e.g., Claude Desktop, Cursor, Windsurf).

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```


## Available Tools

The server covers every resource in the Forward Email API:

* **Account** — get and update your account
* **Domains** — create, list, update, delete, verify DNS and SMTP records, test S3 connections
* **Aliases** — full CRUD plus password generation
* **Emails (Outbound SMTP)** — send, list, get, delete, and check sending limits
* **Messages (IMAP)** — list, search, create drafts, update, delete
* **Folders (IMAP)** — full CRUD
* **Contacts (CardDAV)** — full CRUD
* **Calendars (CalDAV)** — full CRUD
* **Calendar Events (CalDAV)** — full CRUD
* **Sieve Scripts** — create, update, delete, and activate (both API key and alias auth)
* **Domain Members** — update roles and remove members
* **Domain Invites** — create, accept, and remove invites
* **Catch-All Passwords** — create, list, and delete domain-wide passwords
* **Logs** — download email delivery logs
* **Encrypt** — encrypt plaintext TXT records


## Example Prompts

* "Send an email to <hello@example.com> from my domain."
* "What were my top 5 bounced email addresses last week?"
* "Verify the DNS for example.com."
* "Create a new calendar called 'Work' and add a meeting for tomorrow at 2pm."
* "List all Sieve scripts on my main alias."
* "Generate a new password for <support@example.com>."


## Open Source

The Forward Email MCP Server is open-source and available on [GitHub](https://github.com/forwardemail/mcp-server). We believe in transparency and community-driven development.
