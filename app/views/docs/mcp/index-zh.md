# Forward Email MCP 服务器 {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> 我们的<a href="https://github.com/forwardemail/mcp-server">开源 MCP 服务器</a>允许 Claude、ChatGPT、Cursor 和 Windsurf 等 AI 助手通过自然语言管理您的电子邮件、域名、别名、联系人和日历。所有 68 个 API 端点都作为 MCP 工具公开。它通过 <code>npx @forwardemail/mcp-server</code> 在本地运行——您的凭据永远不会离开您的机器。
</p>

## 目录 {#table-of-contents}

* [什么是 MCP？](#what-is-mcp)
* [快速开始](#quick-start)
  * [获取 API 密钥](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [其他 MCP 客户端](#other-mcp-clients)
* [认证](#authentication)
  * [API 密钥认证](#api-key-auth)
  * [别名认证](#alias-auth)
  * [生成别名密码](#generating-an-alias-password)
* [所有 68 个工具](#all-68-tools)
  * [账户（API 密钥或别名认证）](#account-api-key-or-alias-auth)
  * [域名（API 密钥）](#domains-api-key)
  * [别名（API 密钥）](#aliases-api-key)
  * [电子邮件 — 出站 SMTP（API 密钥；发送支持两者）](#emails--outbound-smtp-api-key-send-supports-both)
  * [消息 — IMAP（别名认证）](#messages--imap-alias-auth)
  * [文件夹 — IMAP（别名认证）](#folders--imap-alias-auth)
  * [联系人 — CardDAV（别名认证）](#contacts--carddav-alias-auth)
  * [日历 — CalDAV（别名认证）](#calendars--caldav-alias-auth)
  * [日历事件 — CalDAV（别名认证）](#calendar-events--caldav-alias-auth)
  * [Sieve 脚本（API 密钥）](#sieve-scripts-api-key)
  * [Sieve 脚本（别名认证）](#sieve-scripts-alias-auth)
  * [域名成员和邀请（API 密钥）](#domain-members-and-invites-api-key)
  * [包罗万象密码（API 密钥）](#catch-all-passwords-api-key)
  * [日志（API 密钥）](#logs-api-key)
  * [加密（无需认证）](#encrypt-no-auth)
* [20 个真实世界用例](#20-real-world-use-cases)
* [示例提示](#example-prompts)
* [环境变量](#environment-variables)
* [安全性](#security)
* [程序化使用](#programmatic-usage)
* [开源](#open-source)


## 什么是 MCP？ {#what-is-mcp}

[模型上下文协议](https://modelcontextprotocol.io) (MCP) 是 Anthropic 创建的一个开放标准，允许 AI 模型安全地调用外部工具。MCP 不是将 API 响应复制粘贴到聊天窗口中，而是为模型提供对您的服务的直接、结构化访问。

我们的 MCP 服务器封装了整个 [Forward Email API](/email-api)——每个端点、每个参数——并将其作为任何 MCP 兼容客户端都可以使用的工具公开。服务器使用 stdio 传输在您的机器上本地运行。您的凭据保留在您的环境变量中，并且永远不会发送到 AI 模型。


## 快速开始 {#quick-start}

### 获取 API 密钥 {#get-an-api-key}

1. 登录您的 [Forward Email 账户](/my-account/domains)。
2. 转到 **我的账户** → **安全** → **API 密钥**。
3. 生成一个新的 API 密钥并复制。

### Claude Desktop {#claude-desktop}

将此添加到您的 Claude Desktop 配置文件中：

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

重启 Claude Desktop。您应该在工具选择器中看到 Forward Email 工具。

> **注意：** `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 变量是可选的，但对于邮箱工具（消息、文件夹、联系人、日历）是必需的。有关详细信息，请参阅[认证](#authentication)。

### Cursor {#cursor}

打开 Cursor 设置 → MCP → 添加服务器：

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

打开 Windsurf 设置 → MCP → 添加服务器，配置与上述相同。

### 其他 MCP 客户端 {#other-mcp-clients}

任何支持 MCP stdio 传输的客户端都将起作用。命令是：

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## 认证 {#authentication}

Forward Email API 使用 **HTTP 基本认证**，根据端点的不同，有两种不同的凭据类型。MCP 服务器会自动处理此问题——您只需提供正确的凭据。

### API 密钥认证 {#api-key-auth}

大多数管理端点（域名、别名、出站电子邮件、日志）使用您的 **API 密钥** 作为基本认证用户名，密码为空。

这与您用于 REST API 的 API 密钥相同。通过 `FORWARD_EMAIL_API_KEY` 环境变量进行设置。

### 别名认证 {#alias-auth}

邮箱端点（消息、文件夹、联系人、日历、别名范围的 Sieve 脚本）使用 **别名凭据**——别名电子邮件地址作为用户名，生成的密码作为密码。

这些端点通过 IMAP、CalDAV 和 CardDAV 协议访问每个别名的数据。它们需要别名电子邮件和生成的密码，而不是 API 密钥。

您可以通过两种方式提供别名凭据：

1. **环境变量**（推荐用于默认别名）：设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。
2. **每个工具调用参数**：将 `alias_username` 和 `alias_password` 作为参数传递给任何别名认证工具。这些参数会覆盖环境变量，这在处理多个别名时很有用。

### 生成别名密码 {#generating-an-alias-password}

在使用别名认证工具之前，您需要为别名生成一个密码。您可以使用 `generateAliasPassword` 工具或通过 API 来完成此操作：

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

响应包含 `username`（别名电子邮件）和 `password` 字段。将它们用作您的别名凭据。

> **提示：** 您还可以询问您的 AI 助手：“*为 example.com 域上的别名 user@example.com 生成一个密码*”——它将调用 `generateAliasPassword` 工具并返回凭据。

下表总结了每个工具组所需的认证方法：

| 工具组 | 认证方法 | 凭据 |
|-----------|-------------|-------------|
| 账户 | API 密钥 **或** 别名认证 | 任意一个 |
| 域名、别名、域名成员、邀请、包罗万象密码 | API 密钥 | `FORWARD_EMAIL_API_KEY` |
| 出站电子邮件（列表、获取、删除、限制） | API 密钥 | `FORWARD_EMAIL_API_KEY` |
| 发送电子邮件 | API 密钥 **或** 别名认证 | 任意一个 |
| 消息 (IMAP) | 别名认证 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 文件夹 (IMAP) | 别名认证 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 联系人 (CardDAV) | 别名认证 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 日历 (CalDAV) | 别名认证 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 日历事件 (CalDAV) | 别名认证 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve 脚本（域范围） | API 密钥 | `FORWARD_EMAIL_API_KEY` |
| Sieve 脚本（别名范围） | 别名认证 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 日志 | API 密钥 | `FORWARD_EMAIL_API_KEY` |
| 加密 | 无 | 无需凭据 |


## 所有 68 个工具 {#all-68-tools}

每个工具都直接映射到 [Forward Email API](/email-api) 端点。参数使用与 API 文档相同的名称。认证方法在每个部分标题中注明。

### 账户（API 密钥或别名认证） {#account-api-key-or-alias-auth}

使用 API 密钥认证时，这些工具返回您的用户账户信息。使用别名认证时，它们返回别名/邮箱信息，包括存储配额和设置。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | 获取您的账户信息 |
| `updateAccount` | `PUT /v1/account` | 更新您的账户设置 |

### 域名（API 密钥） {#domains-api-key}

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | 列出您的所有域名 |
| `createDomain` | `POST /v1/domains` | 添加新域名 |
| `getDomain` | `GET /v1/domains/:domain_id` | 获取域名详细信息 |
| `updateDomain` | `PUT /v1/domains/:domain_id` | 更新域名设置 |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | 删除域名 |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | 验证 DNS 记录 |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | 验证 SMTP 配置 |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | 测试自定义 S3 存储 |

### 别名（API 密钥） {#aliases-api-key}

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | 列出域名的别名 |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | 创建新别名 |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | 获取别名详细信息 |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | 更新别名 |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | 删除别名 |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | 为别名认证生成 IMAP/SMTP 密码 |

### 电子邮件 — 出站 SMTP（API 密钥；发送支持两者） {#emails--outbound-smtp-api-key-send-supports-both}

| 工具 | API 端点 | 认证 | 描述 |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API 密钥或别名认证 | 通过 SMTP 发送电子邮件 |
| `listEmails` | `GET /v1/emails` | API 密钥 | 列出出站电子邮件 |
| `getEmail` | `GET /v1/emails/:id` | API 密钥 | 获取电子邮件详细信息和状态 |
| `deleteEmail` | `DELETE /v1/emails/:id` | API 密钥 | 删除队列中的电子邮件 |
| `getEmailLimit` | `GET /v1/emails/limit` | API 密钥 | 检查您的发送限制 |

`sendEmail` 工具接受 `from`、`to`、`cc`、`bcc`、`subject`、`text`、`html` 和 `attachments`。这与 `POST /v1/emails` 端点相同。

### 消息 — IMAP（别名认证） {#messages--imap-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password` 或设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 环境变量。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | 列出和搜索邮箱中的消息 |
| `createMessage` | `POST /v1/messages` | 创建草稿或上传消息 |
| `getMessage` | `GET /v1/messages/:id` | 按 ID 获取消息 |
| `updateMessage` | `PUT /v1/messages/:id` | 更新标志（已读、已加星标等） |
| `deleteMessage` | `DELETE /v1/messages/:id` | 删除消息 |

`listMessages` 工具支持 15+ 个搜索参数，包括 `subject`、`from`、`to`、`text`、`since`、`before`、`is_unread` 和 `has_attachment`。有关完整列表，请参阅 [API 文档](/email-api)。

### 文件夹 — IMAP（别名认证） {#folders--imap-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password` 或设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 环境变量。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | 列出所有邮箱文件夹 |
| `createFolder` | `POST /v1/folders` | 创建新文件夹 |
| `getFolder` | `GET /v1/folders/:id` | 获取文件夹详细信息 |
| `updateFolder` | `PUT /v1/folders/:id` | 重命名文件夹 |
| `deleteFolder` | `DELETE /v1/folders/:id` | 删除文件夹 |

### 联系人 — CardDAV（别名认证） {#contacts--carddav-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password` 或设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 环境变量。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | 列出所有联系人 |
| `createContact` | `POST /v1/contacts` | 创建新联系人 |
| `getContact` | `GET /v1/contacts/:id` | 获取联系人详细信息 |
| `updateContact` | `PUT /v1/contacts/:id` | 更新联系人 |
| `deleteContact` | `DELETE /v1/contacts/:id` | 删除联系人 |

### 日历 — CalDAV（别名认证） {#calendars--caldav-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password` 或设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 环境变量。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | 列出所有日历 |
| `createCalendar` | `POST /v1/calendars` | 创建新日历 |
| `getCalendar` | `GET /v1/calendars/:id` | 获取日历详细信息 |
| `updateCalendar` | `PUT /v1/calendars/:id` | 更新日历 |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | 删除日历 |

### 日历事件 — CalDAV（别名认证） {#calendar-events--caldav-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password` 或设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 环境变量。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | 列出所有事件 |
| `createCalendarEvent` | `POST /v1/calendar-events` | 创建新事件 |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | 获取事件详细信息 |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | 更新事件 |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | 删除事件 |

### Sieve 脚本（API 密钥） {#sieve-scripts-api-key}

这些使用域范围路径并通过您的 API 密钥进行认证。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | 列出别名的脚本 |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | 创建新脚本 |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | 获取脚本详细信息 |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | 更新脚本 |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | 删除脚本 |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | 激活脚本 |

### Sieve 脚本（别名认证） {#sieve-scripts-alias-auth}

这些使用别名级别认证。对于不需要 API 密钥的每个别名自动化很有用。

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password` 或设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 环境变量。

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | 列出脚本 |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | 创建脚本 |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | 获取脚本详细信息 |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | 更新脚本 |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | 删除脚本 |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | 激活脚本 |

### 域名成员和邀请（API 密钥） {#domain-members-and-invites-api-key}

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | 更改成员角色 |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | 删除成员 |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | 接受待处理邀请 |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | 邀请某人加入域名 |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | 撤销邀请 |

### 包罗万象密码（API 密钥） {#catch-all-passwords-api-key}

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | 列出包罗万象密码 |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | 创建包罗万象密码 |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | 删除包罗万象密码 |

### 日志（API 密钥） {#logs-api-key}

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | 下载电子邮件投递日志 |

### 加密（无需认证） {#encrypt-no-auth}

| 工具 | API 端点 | 描述 |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | 加密 DNS TXT 记录 |

此工具不需要认证。它加密转发记录，例如 `forward-email=user@example.com`，用于 DNS TXT 记录。


## 20 个真实世界用例 {#20-real-world-use-cases}

以下是使用 MCP 服务器与您的 AI 助手的实际方法：

### 1. 电子邮件分类 {#1-email-triage}

让您的 AI 扫描您的收件箱并总结未读邮件。它可以标记紧急邮件，按发件人分类，并起草回复——所有这些都通过自然语言完成。（*需要别名凭据才能访问收件箱。*）

### 2. 域名设置自动化 {#2-domain-setup-automation}

设置新域名？让 AI 创建域名，添加您的别名，验证 DNS 记录，并测试 SMTP 配置。通常需要 10 分钟点击仪表板的操作变成了一次对话。

### 3. 批量别名管理 {#3-bulk-alias-management}

需要为新项目创建 20 个别名？描述您的需求，让 AI 处理重复性工作。它可以一次性创建别名、设置转发规则并生成密码。

### 4. 电子邮件营销活动监控 {#4-email-campaign-monitoring}

让您的 AI 检查发送限制，列出最近的出站电子邮件，并报告投递状态。对于监控事务性电子邮件健康状况很有用。

### 5. 联系人同步和清理 {#5-contact-sync-and-cleanup}

使用 CardDAV 工具列出所有联系人，查找重复项，更新过时信息，或从您粘贴到聊天中的电子表格批量创建联系人。（*需要别名凭据。*）

### 6. 日历管理 {#6-calendar-management}

创建日历，添加事件，更新会议时间，并删除已取消的事件——所有这些都通过对话完成。CalDAV 工具支持对日历和事件的完整 CRUD。（*需要别名凭据。*）

### 7. Sieve 脚本自动化 {#7-sieve-script-automation}

Sieve 脚本功能强大，但语法晦涩难懂。让您的 AI 为您编写 Sieve 脚本：“将所有来自 billing@example.com 的电子邮件过滤到 Billing 文件夹中”变成了一个可用的脚本，而无需触及 RFC 5228 规范。

### 8. 团队入职 {#8-team-onboarding}

当新团队成员加入时，让 AI 创建他们的别名，生成密码，向他们发送带有凭据的欢迎电子邮件，并将他们添加为域成员。一个提示，四个 API 调用。

### 9. 安全审计 {#9-security-auditing}

让您的 AI 列出所有域名，检查 DNS 验证状态，审查别名配置，并识别任何具有未验证记录的域名。通过自然语言进行快速安全检查。

### 10. 电子邮件转发设置 {#10-email-forwarding-setup}

为新域名设置电子邮件转发？让 AI 创建域名，添加转发别名，加密 DNS 记录，并验证所有配置是否正确。

### 11. 收件箱搜索和分析 {#11-inbox-search-and-analysis}

使用消息搜索工具查找特定电子邮件：“查找过去 30 天内所有来自 john@example.com 且带有附件的电子邮件。” 15+ 个搜索参数使其功能强大。（*需要别名凭据。*）

### 12. 文件夹组织 {#12-folder-organization}

让您的 AI 为新项目创建文件夹结构，在文件夹之间移动消息，或清理不再需要的旧文件夹。（*需要别名凭据。*）

### 13. 密码轮换 {#13-password-rotation}

按计划生成新的别名密码。让您的 AI 为每个别名生成新密码并报告新凭据。

### 14. DNS 记录加密 {#14-dns-record-encryption}

在将转发记录添加到 DNS 之前对其进行加密。`encryptRecord` 工具无需认证即可处理此问题——对于快速的一次性加密很有用。

### 15. 投递日志分析 {#15-delivery-log-analysis}

下载您的电子邮件投递日志，并让 AI 分析退回率，识别有问题收件人，或跟踪投递时间。

### 16. 多域名管理 {#16-multi-domain-management}

如果您管理多个域名，请让 AI 为您提供状态报告：哪些域名已验证，哪些存在问题，每个域名有多少别名，以及发送限制是什么样的。

### 17. 包罗万象配置 {#17-catch-all-configuration}

为需要接收任何地址电子邮件的域名设置包罗万象密码。AI 可以为您创建、列出和管理这些密码。

### 18. 域名邀请管理 {#18-domain-invite-management}

邀请团队成员管理域名，检查待处理的邀请，并清理过期的邀请。对于拥有多个域名管理员的组织很有用。

### 19. S3 存储测试 {#19-s3-storage-testing}

如果您使用自定义 S3 存储进行电子邮件备份，请让 AI 测试连接并验证其是否正常工作。

### 20. 电子邮件草稿撰写 {#20-email-draft-composition}

在您的邮箱中创建电子邮件草稿，而无需发送它们。这对于在发送前需要审查的电子邮件或构建电子邮件模板很有用。（*需要别名凭据。*）


## 示例提示 {#example-prompts}

以下是您可以直接与您的 AI 助手一起使用的提示：

**发送电子邮件：**
> "Send an email from hello@mydomain.com to john@example.com with the subject 'Meeting Tomorrow' and body 'Hi John, are we still on for 2pm?'"

**域名管理：**
> "List all my domains and tell me which ones have unverified DNS records."

**别名创建：**
> "Create a new alias support@mydomain.com that forwards to my personal email."

**收件箱搜索（需要别名凭据）：**
> "Find all unread emails from the last week that mention 'invoice'."

**日历（需要别名凭据）：**
> "Create a calendar called 'Work' and add a meeting for tomorrow at 2pm called 'Team Standup'."

**Sieve 脚本：**
> "Write a Sieve script for info@mydomain.com that auto-replies to emails with 'Thanks for reaching out, we'll get back to you within 24 hours.'"

**批量操作：**
> "Create aliases for sales@, support@, billing@, and info@ on mydomain.com, all forwarding to team@mydomain.com."

**安全检查：**
> "Check the DNS and SMTP verification status for all my domains and tell me if anything needs attention."

**生成别名密码：**
> "Generate a password for the alias user@example.com so I can access my inbox."


## 环境变量 {#environment-variables}

| 变量 | 必需 | 默认 | 描述 |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | 是 | — | 您的 Forward Email API 密钥（用作 API 密钥端点的基本认证用户名） |
| `FORWARD_EMAIL_ALIAS_USER` | 否 | — | 邮箱端点的别名电子邮件地址（例如 `user@example.com`） |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | 否 | — | 邮箱端点生成的别名密码 |
| `FORWARD_EMAIL_API_URL` | 否 | `https://api.forwardemail.net` | API 基础 URL（用于自托管或测试） |


## 安全性 {#security}

MCP 服务器在您的机器上本地运行。以下是安全工作原理：

*   **您的凭据保留在本地。** 您的 API 密钥和别名凭据都从环境变量中读取，并用于通过 HTTP 基本认证进行 API 请求。它们永远不会发送到 AI 模型。
*   **stdio 传输。** 服务器通过 stdin/stdout 与 AI 客户端通信。没有打开任何网络端口。
*   **无数据存储。** 服务器是无状态的。它不缓存、不记录、不存储您的任何电子邮件数据。
*   **开源。** 整个代码库都在 [GitHub](https://github.com/forwardemail/mcp-server) 上。您可以审计每一行代码。


## 程序化使用 {#programmatic-usage}

您也可以将服务器用作库：

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## 开源 {#open-source}

Forward Email MCP 服务器在 [GitHub](https://github.com/forwardemail/mcp-server) 上以 BUSL-1.1 许可证开源。我们相信透明度。如果您发现错误或想要某个功能，请[提交问题](https://github.com/forwardemail/mcp-server/issues)。

