# Forward Email MCPサーバー {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> 当社の<a href="https://github.com/forwardemail/mcp-server">オープンソースMCPサーバー</a>は、Claude、ChatGPT、Cursor、WindsurfなどのAIアシスタントが自然言語を通じてメール、ドメイン、エイリアス、連絡先、カレンダーを管理できるようにします。68のAPIエンドポイントすべてがMCPツールとして公開されています。<code>npx @forwardemail/mcp-server</code>を介してローカルで実行され、認証情報はマシンから離れることはありません。
</p>

## 目次 {#table-of-contents}

* [MCPとは？](#what-is-mcp)
* [クイックスタート](#quick-start)
  * [APIキーの取得](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [その他のMCPクライアント](#other-mcp-clients)
* [認証](#authentication)
  * [APIキー認証](#api-key-auth)
  * [エイリアス認証](#alias-auth)
  * [エイリアスパスワードの生成](#generating-an-alias-password)
* [全68ツール](#all-68-tools)
  * [アカウント (APIキーまたはエイリアス認証)](#account-api-key-or-alias-auth)
  * [ドメイン (APIキー)](#domains-api-key)
  * [エイリアス (APIキー)](#aliases-api-key)
  * [メール — 送信SMTP (APIキー; 送信は両方をサポート)](#emails--outbound-smtp-api-key-send-supports-both)
  * [メッセージ — IMAP (エイリアス認証)](#messages--imap-alias-auth)
  * [フォルダ — IMAP (エイリアス認証)](#folders--imap-alias-auth)
  * [連絡先 — CardDAV (エイリアス認証)](#contacts--carddav-alias-auth)
  * [カレンダー — CalDAV (エイリアス認証)](#calendars--caldav-alias-auth)
  * [カレンダーイベント — CalDAV (エイリアス認証)](#calendar-events--caldav-alias-auth)
  * [Sieveスクリプト (APIキー)](#sieve-scripts-api-key)
  * [Sieveスクリプト (エイリアス認証)](#sieve-scripts-alias-auth)
  * [ドメインメンバーと招待 (APIキー)](#domain-members-and-invites-api-key)
  * [キャッチオールパスワード (APIキー)](#catch-all-passwords-api-key)
  * [ログ (APIキー)](#logs-api-key)
  * [暗号化 (認証なし)](#encrypt-no-auth)
* [20の現実世界のユースケース](#20-real-world-use-cases)
* [プロンプト例](#example-prompts)
* [環境変数](#environment-variables)
* [セキュリティ](#security)
* [プログラムによる使用法](#programmatic-usage)
* [オープンソース](#open-source)


## MCPとは？ {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) は、Anthropicが作成したオープンスタンダードで、AIモデルが外部ツールを安全に呼び出すことを可能にします。API応答をチャットウィンドウにコピー＆ペーストする代わりに、MCPはモデルにサービスへの直接的で構造化されたアクセスを提供します。

当社のMCPサーバーは、[Forward Email API](/email-api)全体（すべてのエンドポイント、すべてのパラメーター）をラップし、MCP互換クライアントが使用できるツールとして公開します。サーバーはstdioトランスポートを使用してローカルマシンで実行されます。認証情報は環境変数に保持され、AIモデルに送信されることはありません。


## クイックスタート {#quick-start}

### APIキーの取得 {#get-an-api-key}

1. [Forward Emailアカウント](/my-account/domains)にログインします。
2. **マイアカウント** → **セキュリティ** → **APIキー**に移動します。
3. 新しいAPIキーを生成し、コピーします。

### Claude Desktop {#claude-desktop}

Claude Desktopの設定ファイルに以下を追加します。

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

Claude Desktopを再起動します。ツールピッカーにForward Emailツールが表示されるはずです。

> **注:** `FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`変数はオプションですが、メールボックスツール（メッセージ、フォルダ、連絡先、カレンダー）には必須です。詳細については、[認証](#authentication)を参照してください。

### Cursor {#cursor}

Cursorの設定 → MCP → サーバーを追加 を開きます。

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

Windsurfの設定 → MCP → サーバーを追加 を開き、上記と同じ設定を追加します。

### その他のMCPクライアント {#other-mcp-clients}

MCP stdioトランスポートをサポートするすべてのクライアントが動作します。コマンドは次のとおりです。

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## 認証 {#authentication}

Forward Email APIは、エンドポイントに応じて2種類の認証情報を使用する**HTTP Basic認証**を使用します。MCPサーバーはこれを自動的に処理します。適切な認証情報を提供するだけで済みます。

### APIキー認証 {#api-key-auth}

ほとんどの管理エンドポイント（ドメイン、エイリアス、送信メール、ログ）は、Basic認証のユーザー名として**APIキー**を使用し、パスワードは空です。

これはREST APIで使用するAPIキーと同じです。`FORWARD_EMAIL_API_KEY`環境変数で設定します。

### エイリアス認証 {#alias-auth}

メールボックスエンドポイント（メッセージ、フォルダ、連絡先、カレンダー、エイリアススコープのSieveスクリプト）は、**エイリアス認証情報**を使用します。ユーザー名としてエイリアスメールアドレス、パスワードとして生成されたパスワードを使用します。

これらのエンドポイントは、IMAP、CalDAV、CardDAVプロトコルを介してエイリアスごとのデータにアクセスします。APIキーではなく、エイリアスメールと生成されたパスワードが必要です。

エイリアス認証情報は2つの方法で提供できます。

1. **環境変数**（デフォルトのエイリアスに推奨）：`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`を設定します。
2. **ツール呼び出しごとのパラメーター**：`alias_username`と`alias_password`をエイリアス認証ツールへの引数として渡します。これらは環境変数を上書きするため、複数のエイリアスを扱う場合に便利です。

### エイリアスパスワードの生成 {#generating-an-alias-password}

エイリアス認証ツールを使用する前に、エイリアスのパスワードを生成する必要があります。これは`generateAliasPassword`ツールを使用するか、APIを介して行うことができます。

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

応答には`username`（エイリアスメール）と`password`フィールドが含まれます。これらをエイリアス認証情報として使用します。

> **ヒント:** AIアシスタントに「example.comドメインのuser@example.comエイリアスにパスワードを生成して」と尋ねることもできます。すると、`generateAliasPassword`ツールが呼び出され、認証情報が返されます。

以下の表は、各ツールグループが必要とする認証方法をまとめたものです。

| ツールグループ | 認証方法 | 認証情報 |
|-----------|-------------|-------------|
| アカウント | APIキー **または** エイリアス認証 | どちらか |
| ドメイン、エイリアス、ドメインメンバー、招待、キャッチオールパスワード | APIキー | `FORWARD_EMAIL_API_KEY` |
| 送信メール (リスト、取得、削除、制限) | APIキー | `FORWARD_EMAIL_API_KEY` |
| メール送信 | APIキー **または** エイリアス認証 | どちらか |
| メッセージ (IMAP) | エイリアス認証 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| フォルダ (IMAP) | エイリアス認証 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 連絡先 (CardDAV) | エイリアス認証 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| カレンダー (CalDAV) | エイリアス認証 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| カレンダーイベント (CalDAV) | エイリアス認証 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieveスクリプト (ドメインスコープ) | APIキー | `FORWARD_EMAIL_API_KEY` |
| Sieveスクリプト (エイリアススコープ) | エイリアス認証 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| ログ | APIキー | `FORWARD_EMAIL_API_KEY` |
| 暗号化 | なし | 認証情報は不要 |


## 全68ツール {#all-68-tools}

すべてのツールは[Forward Email API](/email-api)エンドポイントに直接マッピングされています。パラメーターはAPIドキュメントと同じ名前を使用します。認証方法は各セクションの見出しに記載されています。

### アカウント (APIキーまたはエイリアス認証) {#account-api-key-or-alias-auth}

APIキー認証の場合、これらはユーザーアカウント情報を返します。エイリアス認証の場合、ストレージクォータや設定を含むエイリアス/メールボックス情報を返します。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | アカウント情報を取得 |
| `updateAccount` | `PUT /v1/account` | アカウント設定を更新 |

### ドメイン (APIキー) {#domains-api-key}

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | すべてのドメインをリスト表示 |
| `createDomain` | `POST /v1/domains` | 新しいドメインを追加 |
| `getDomain` | `GET /v1/domains/:domain_id` | ドメインの詳細を取得 |
| `updateDomain` | `PUT /v1/domains/:domain_id` | ドメイン設定を更新 |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | ドメインを削除 |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | DNSレコードを検証 |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | SMTP設定を検証 |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | カスタムS3ストレージをテスト |

### エイリアス (APIキー) {#aliases-api-key}

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | ドメインのエイリアスをリスト表示 |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | 新しいエイリアスを作成 |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | エイリアスの詳細を取得 |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | エイリアスを更新 |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | エイリアスを削除 |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | エイリアス認証用のIMAP/SMTPパスワードを生成 |

### メール — 送信SMTP (APIキー; 送信は両方をサポート) {#emails--outbound-smtp-api-key-send-supports-both}

| ツール | APIエンドポイント | 認証 | 説明 |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | APIキーまたはエイリアス認証 | SMTP経由でメールを送信 |
| `listEmails` | `GET /v1/emails` | APIキー | 送信メールをリスト表示 |
| `getEmail` | `GET /v1/emails/:id` | APIキー | メールの詳細とステータスを取得 |
| `deleteEmail` | `DELETE /v1/emails/:id` | APIキー | キューに入っているメールを削除 |
| `getEmailLimit` | `GET /v1/emails/limit` | APIキー | 送信制限を確認 |

`sendEmail`ツールは、`from`、`to`、`cc`、`bcc`、`subject`、`text`、`html`、および`attachments`を受け入れます。これは`POST /v1/emails`エンドポイントと同じです。

### メッセージ — IMAP (エイリアス認証) {#messages--imap-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`環境変数を設定してください。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | メールボックス内のメッセージをリスト表示および検索 |
| `createMessage` | `POST /v1/messages` | 下書きを作成またはメッセージをアップロード |
| `getMessage` | `GET /v1/messages/:id` | IDでメッセージを取得 |
| `updateMessage` | `PUT /v1/messages/:id` | フラグ（既読、スター付きなど）を更新 |
| `deleteMessage` | `DELETE /v1/messages/:id` | メッセージを削除 |

`listMessages`ツールは、`subject`、`from`、`to`、`text`、`since`、`before`、`is_unread`、`has_attachment`など15以上の検索パラメーターをサポートしています。完全なリストは[APIドキュメント](/email-api)を参照してください。

### フォルダ — IMAP (エイリアス認証) {#folders--imap-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`環境変数を設定してください。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | すべてのメールボックスフォルダをリスト表示 |
| `createFolder` | `POST /v1/folders` | 新しいフォルダを作成 |
| `getFolder` | `GET /v1/folders/:id` | フォルダの詳細を取得 |
| `updateFolder` | `PUT /v1/folders/:id` | フォルダ名を変更 |
| `deleteFolder` | `DELETE /v1/folders/:id` | フォルダを削除 |

### 連絡先 — CardDAV (エイリアス認証) {#contacts--carddav-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`環境変数を設定してください。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | すべての連絡先をリスト表示 |
| `createContact` | `POST /v1/contacts` | 新しい連絡先を作成 |
| `getContact` | `GET /v1/contacts/:id` | 連絡先の詳細を取得 |
| `updateContact` | `PUT /v1/contacts/:id` | 連絡先を更新 |
| `deleteContact` | `DELETE /v1/contacts/:id` | 連絡先を削除 |

### カレンダー — CalDAV (エイリアス認証) {#calendars--caldav-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`環境変数を設定してください。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | すべてのカレンダーをリスト表示 |
| `createCalendar` | `POST /v1/calendars` | 新しいカレンダーを作成 |
| `getCalendar` | `GET /v1/calendars/:id` | カレンダーの詳細を取得 |
| `updateCalendar` | `PUT /v1/calendars/:id` | カレンダーを更新 |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | カレンダーを削除 |

### カレンダーイベント — CalDAV (エイリアス認証) {#calendar-events--caldav-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`環境変数を設定してください。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | すべてのイベントをリスト表示 |
| `createCalendarEvent` | `POST /v1/calendar-events` | 新しいイベントを作成 |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | イベントの詳細を取得 |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | イベントを更新 |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | イベントを削除 |

### Sieveスクリプト (APIキー) {#sieve-scripts-api-key}

これらはドメインスコープのパスを使用し、APIキーで認証します。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | エイリアスのスクリプトをリスト表示 |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | 新しいスクリプトを作成 |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | スクリプトの詳細を取得 |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | スクリプトを更新 |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | スクリプトを削除 |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | スクリプトをアクティブ化 |

### Sieveスクリプト (エイリアス認証) {#sieve-scripts-alias-auth}

これらはエイリアスレベルの認証を使用します。APIキーを必要とせずに、エイリアスごとの自動化に役立ちます。

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`環境変数を設定してください。

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | スクリプトをリスト表示 |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | スクリプトを作成 |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | スクリプトの詳細を取得 |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | スクリプトを更新 |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | スクリプトを削除 |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | スクリプトをアクティブ化 |

### ドメインメンバーと招待 (APIキー) {#domain-members-and-invites-api-key}

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | メンバーの役割を変更 |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | メンバーを削除 |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | 保留中の招待を承諾 |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | ドメインに誰かを招待 |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | 招待を取り消し |

### キャッチオールパスワード (APIキー) {#catch-all-passwords-api-key}

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | キャッチオールパスワードをリスト表示 |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | キャッチオールパスワードを作成 |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | キャッチオールパスワードを削除 |

### ログ (APIキー) {#logs-api-key}

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | メール配信ログをダウンロード |

### 暗号化 (認証なし) {#encrypt-no-auth}

| ツール | APIエンドポイント | 説明 |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | DNS TXTレコードを暗号化 |

このツールは認証を必要としません。`forward-email=user@example.com`のような転送レコードをDNS TXTレコードで使用するために暗号化します。


## 20の現実世界のユースケース {#20-real-world-use-cases}

MCPサーバーをAIアシスタントと連携させる実用的な方法を以下に示します。

### 1. メールトリアージ {#email-triage}

AIに受信トレイをスキャンさせ、未読メッセージを要約させます。緊急のメールにフラグを立てたり、送信者別に分類したり、返信の下書きを作成したりできます。これらすべてを自然言語で行えます。（受信トレイへのアクセスにはエイリアス認証情報が必要です。）

### 2. ドメイン設定の自動化 {#domain-setup-automation}

新しいドメインを設定しますか？AIにドメインの作成、エイリアスの追加、DNSレコードの検証、SMTP設定のテストを依頼します。通常、ダッシュボードをクリックして10分かかる作業が、1つの会話で完了します。

### 3. 一括エイリアス管理 {#bulk-alias-management}

新しいプロジェクトのために20個のエイリアスを作成する必要がありますか？必要なものを説明し、AIに反復作業を任せます。エイリアスの作成、転送ルールの設定、パスワードの生成を一度に行うことができます。

### 4. メールキャンペーンの監視 {#email-campaign-monitoring}

AIに送信制限の確認、最近の送信メールのリスト表示、配信ステータスの報告を依頼します。トランザクションメールの健全性を監視するのに役立ちます。

### 5. 連絡先の同期とクリーンアップ {#contact-sync-and-cleanup}

CardDAVツールを使用して、すべての連絡先をリスト表示し、重複を見つけ、古い情報を更新したり、チャットに貼り付けたスプレッドシートから連絡先を一括作成したりできます。（エイリアス認証情報が必要です。）

### 6. カレンダー管理 {#calendar-management}

カレンダーの作成、イベントの追加、会議時間の更新、キャンセルされたイベントの削除を、すべて会話を通じて行えます。CalDAVツールは、カレンダーとイベントの両方で完全なCRUDをサポートしています。（エイリアス認証情報が必要です。）

### 7. Sieveスクリプトの自動化 {#sieve-script-automation}

Sieveスクリプトは強力ですが、構文は難解です。AIにSieveスクリプトの作成を依頼します。「billing@example.comからのすべてのメールをBillingフォルダにフィルタリングする」という指示が、RFC 5228仕様に触れることなく動作するスクリプトになります。

### 8. チームのオンボーディング {#team-onboarding}

新しいチームメンバーが参加したら、AIにエイリアスの作成、パスワードの生成、認証情報を含むウェルカムメールの送信、ドメインメンバーへの追加を依頼します。1つのプロンプトで4つのAPI呼び出しが実行されます。

### 9. セキュリティ監査 {#security-auditing}

AIにすべてのドメインをリスト表示させ、DNS検証ステータスを確認させ、エイリアス設定をレビューさせ、未検証のレコードを持つドメインを特定させます。自然言語での迅速なセキュリティチェックです。

### 10. メール転送設定 {#email-forwarding-setup}

新しいドメインのメール転送を設定しますか？AIにドメインの作成、転送エイリアスの追加、DNSレコードの暗号化、すべてが正しく設定されていることの検証を依頼します。

### 11. 受信トレイの検索と分析 {#inbox-search-and-analysis}

メッセージ検索ツールを使用して特定のメールを見つけます。「過去30日間にjohn@example.comから送信され、添付ファイルがある未読メールをすべて見つけてください。」15以上の検索パラメーターにより、強力な検索が可能です。（エイリアス認証情報が必要です。）

### 12. フォルダの整理 {#folder-organization}

AIに新しいプロジェクトのフォルダ構造の作成、フォルダ間のメッセージの移動、不要になった古いフォルダのクリーンアップを依頼します。（エイリアス認証情報が必要です。）

### 13. パスワードの定期的な変更 {#password-rotation}

エイリアスの新しいパスワードを定期的に生成します。AIに各エイリアスの新しいパスワードを生成させ、新しい認証情報を報告させます。

### 14. DNSレコードの暗号化 {#dns-record-encryption}

DNSに追加する前に転送レコードを暗号化します。`encryptRecord`ツールは認証なしでこれを処理します。迅速な単発の暗号化に便利です。

### 15. 配信ログ分析 {#delivery-log-analysis}

メール配信ログをダウンロードし、AIにバウンス率の分析、問題のある受信者の特定、配信時間の追跡を依頼します。

### 16. マルチドメイン管理 {#multi-domain-management}

複数のドメインを管理している場合、AIにステータスレポートを依頼します。どのドメインが検証済みか、問題があるか、各ドメインにいくつのエイリアスがあるか、送信制限はどのようになっているかなどです。

### 17. キャッチオール設定 {#catch-all-configuration}

任意のメールアドレスでメールを受信する必要があるドメインにキャッチオールパスワードを設定します。AIはこれらのパスワードを作成、リスト表示、管理できます。

### 18. ドメイン招待管理 {#domain-invite-management}

チームメンバーをドメイン管理に招待したり、保留中の招待を確認したり、期限切れの招待をクリーンアップしたりできます。複数のドメイン管理者がいる組織に役立ちます。

### 19. S3ストレージのテスト {#s3-storage-testing}

メールバックアップにカスタムS3ストレージを使用している場合、AIに接続をテストさせ、正しく動作していることを確認させます。

### 20. メール下書きの作成 {#email-draft-composition}

送信せずにメールボックスに下書きメールを作成します。送信前にレビューが必要なメールの準備や、メールテンプレートの作成に役立ちます。（エイリアス認証情報が必要です。）


## プロンプト例 {#example-prompts}

AIアシスタントで直接使用できるプロンプトを以下に示します。

**メール送信:**
> 「hello@mydomain.comからjohn@example.comに件名『明日の会議』、本文『ジョンさん、午後2時でまだ大丈夫ですか？』というメールを送ってください。」

**ドメイン管理:**
> 「私のすべてのドメインをリスト表示し、DNSレコードが未検証のものを教えてください。」

**エイリアス作成:**
> 「私の個人メールに転送される新しいエイリアス support@mydomain.com を作成してください。」

**受信トレイ検索 (エイリアス認証情報が必要):**
> 「先週の未読メールで『請求書』に言及しているものをすべて見つけてください。」

**カレンダー (エイリアス認証情報が必要):**
> 「『仕事』というカレンダーを作成し、明日の午後2時に『チームの進捗会議』という会議を追加してください。」

**Sieveスクリプト:**
> 「info@mydomain.com宛てのメールに『ご連絡ありがとうございます。24時間以内に返信いたします。』と自動返信するSieveスクリプトを作成してください。」

**一括操作:**
> 「mydomain.comにsales@、support@、billing@、info@のエイリアスを作成し、すべてteam@mydomain.comに転送してください。」

**セキュリティチェック:**
> 「私のすべてのドメインのDNSとSMTPの検証ステータスを確認し、注意が必要なものがあれば教えてください。」

**エイリアスパスワードの生成:**
> 「受信トレイにアクセスできるように、user@example.comエイリアスのパスワードを生成してください。」


## 環境変数 {#environment-variables}

| 変数 | 必須 | デフォルト | 説明 |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | はい | — | Forward Email APIキー（APIキーエンドポイントのBasic認証ユーザー名として使用） |
| `FORWARD_EMAIL_ALIAS_USER` | いいえ | — | メールボックスエンドポイントのエイリアスメールアドレス（例: `user@example.com`） |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | いいえ | — | メールボックスエンドポイントの生成されたエイリアスパスワード |
| `FORWARD_EMAIL_API_URL` | いいえ | `https://api.forwardemail.net` | APIベースURL（セルフホストまたはテスト用） |


## セキュリティ {#security}

MCPサーバーはローカルマシンで実行されます。セキュリティの仕組みは次のとおりです。

*   **認証情報はローカルに保持されます。** APIキーとエイリアス認証情報の両方が環境変数から読み取られ、HTTP Basic認証を介してAPIリクエストの認証に使用されます。これらがAIモデルに送信されることはありません。
*   **stdioトランスポート。** サーバーはstdin/stdoutを介してAIクライアントと通信します。ネットワークポートは開かれません。
*   **データストレージなし。** サーバーはステートレスです。メールデータをキャッシュ、ログ記録、または保存することはありません。
*   **オープンソース。** コードベース全体は[GitHub](https://github.com/forwardemail/mcp-server)で公開されています。すべての行を監査できます。


## プログラムによる使用法 {#programmatic-usage}

サーバーはライブラリとしても使用できます。

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## オープンソース {#open-source}

Forward Email MCPサーバーは、BUSL-1.1ライセンスの下で[GitHub](https://github.com/forwardemail/mcp-server)でオープンソースとして公開されています。私たちは透明性を信じています。バグを見つけたり、機能が必要な場合は、[問題を報告してください](https://github.com/forwardemail/mcp-server/issues)。
