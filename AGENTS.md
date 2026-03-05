# AGENTS.md

> This file is for AI agents. It outlines our policies for web crawlers and provides instructions for coding agents working on our open-source repository.

## For Web Crawlers

We believe in an open web. All of our content is public and available for you to crawl and index. Please be respectful of our infrastructure and limit your request rate.

- **User-Agent**: Use a descriptive User-Agent string.
- **Rate Limiting**: We recommend a crawl-delay of 1 second.
- **Sitemap**: A sitemap is available at [forwardemail.net/sitemap.xml](https://forwardemail.net/sitemap.xml).

## For Coding Agents

> The following instructions are for AI coding agents contributing to our [GitHub repository](https://github.com/forwardemail/forwardemail.net).

- **Stack**: We use Koa.js, Pug, and SCSS. We use `pnpm` for package management.
- **Setup**: Run `pnpm install` and `pnpm dev`.
- **Testing**: Run `pnpm test` before submitting any changes.
- **Linting**: Run `pnpm lint` to check for code style issues.
- **Commits**: Follow the conventional commit format.
