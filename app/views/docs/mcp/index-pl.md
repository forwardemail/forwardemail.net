# Talk to Your Email with MCP

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

> Our MCP (Model Context Protocol) server lets you connect AI assistants like Claude and ChatGPT to your email. Instead of writing code, you can manage your email with natural language.

This is email automation, simplified. It’s a direct, secure, and open-source way to build powerful workflows.

## What is MCP?

MCP is an open standard that allows AI models to securely access external tools. Our MCP server exposes our entire API as a set of tools that AI assistants can use on your behalf. It runs locally, and your API key is never exposed to the model.

## Quick Start

1.  **Get an API Key**: You can get one from your Forward Email account settings.
2.  **Configure Your Client**: Add the server to your MCP client (e.g., Claude Desktop, Cursor, Windsurf).

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

## Example Prompts

- "Send an email to hello@example.com from my domain."
- "What were my top 5 bounced email addresses last week?"
- "Verify the DNS for example.com."

## Open Source

The Forward Email MCP Server is open-source and available on [GitHub](https://github.com/forwardemail/mcp-server). We believe in transparency and community-driven development.
