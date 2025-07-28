# メールAPI {#email-api}

## 目次 {#table-of-contents}

* [図書館](#libraries)
* [ベースURI](#base-uri)
* [認証](#authentication)
* [エラー](#errors)
* [ローカリゼーション](#localization)
* [ページネーション](#pagination)
* [ログ](#logs)
  * [ログを取得する](#retrieve-logs)
* [アカウント](#account)
  * [アカウントを作成する](#create-account)
  * [アカウントを取得](#retrieve-account)
  * [アカウントを更新する](#update-account)
* [エイリアス連絡先（CardDAV）](#alias-contacts-carddav)
  * [連絡先リスト](#list-contacts)
  * [連絡先を作成](#create-contact)
  * [連絡先を取得](#retrieve-contact)
  * [連絡先を更新](#update-contact)
  * [連絡先を削除](#delete-contact)
* [エイリアスカレンダー（CalDAV）](#alias-calendars-caldav)
  * [カレンダーを一覧表示する](#list-calendars)
  * [カレンダーを作成](#create-calendar)
  * [カレンダーを取得](#retrieve-calendar)
  * [カレンダーを更新](#update-calendar)
  * [カレンダーを削除](#delete-calendar)
* [エイリアスメッセージ（IMAP/POP3）](#alias-messages-imappop3)
  * [メッセージの一覧と検索](#list-and-search-for-messages)
  * [メッセージを作成](#create-message)
  * [メッセージを取得](#retrieve-message)
  * [更新メッセージ](#update-message)
  * [メッセージを削除](#delete-message)
* [エイリアスフォルダ（IMAP/POP3）](#alias-folders-imappop3)
  * [フォルダの一覧](#list-folders)
  * [フォルダを作成](#create-folder)
  * [フォルダを取得](#retrieve-folder)
  * [フォルダを更新](#update-folder)
  * [フォルダを削除](#delete-folder)
  * [フォルダをコピー](#copy-folder)
* [送信メール](#outbound-emails)
  * [送信SMTPメールの制限を取得する](#get-outbound-smtp-email-limit)
  * [送信SMTPメールの一覧](#list-outbound-smtp-emails)
  * [送信SMTPメールを作成する](#create-outbound-smtp-email)
  * [送信SMTPメールを取得する](#retrieve-outbound-smtp-email)
  * [送信SMTPメールを削除する](#delete-outbound-smtp-email)
* [ドメイン](#domains)
  * [ドメインの一覧](#list-domains)
  * [ドメインを作成](#create-domain)
  * [ドメインを取得](#retrieve-domain)
  * [ドメインレコードを確認する](#verify-domain-records)
  * [ドメインのSMTPレコードを確認する](#verify-domain-smtp-records)
  * [ドメイン全体のキャッチオールパスワードを一覧表示する](#list-domain-wide-catch-all-passwords)
  * [ドメイン全体のキャッチオールパスワードを作成する](#create-domain-wide-catch-all-password)
  * [ドメイン全体のキャッチオールパスワードを削除する](#remove-domain-wide-catch-all-password)
  * [ドメインを更新](#update-domain)
  * [ドメインを削除](#delete-domain)
* [招待](#invites)
  * [ドメイン招待を承認](#accept-domain-invite)
  * [ドメイン招待を作成](#create-domain-invite)
  * [ドメイン招待を削除する](#remove-domain-invite)
* [メンバー](#members)
  * [ドメインメンバーの更新](#update-domain-member)
  * [ドメインメンバーを削除](#remove-domain-member)
* [エイリアス](#aliases)
  * [エイリアスパスワードを生成する](#generate-an-alias-password)
  * [ドメインエイリアスの一覧](#list-domain-aliases)
  * [新しいドメインエイリアスを作成する](#create-new-domain-alias)
  * [ドメインエイリアスを取得](#retrieve-domain-alias)
  * [ドメインエイリアスの更新](#update-domain-alias)
  * [ドメインエイリアスを削除](#delete-domain-alias)
* [暗号化](#encrypt)
  * [TXTレコードを暗号化する](#encrypt-txt-record)

## ライブラリ {#libraries}

現在、APIラッパーはまだリリースしていませんが、近い将来リリースする予定です。特定のプログラミング言語のAPIラッパーがリリースされた際に通知を受け取りたい場合は、<api@forwardemail.net>までメールでご連絡ください。それまでの間、アプリケーションではこれらの推奨HTTPリクエストライブラリをご利用いただくか、以下の例のように[カール](https://stackoverflow.com/a/27442239/3586413)をご使用ください。

| 言語 | 図書館 |
| ---------- | ---------------------------------------------------------------------- |
| ルビー | [Faraday](https://github.com/lostisland/faraday) |
| パイソン | [requests](https://github.com/psf/requests) |
| ジャワ | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (私たちはメンテナーです) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (私たちはメンテナーです) |
| 行く | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## ベースURI {#base-uri}

現在の HTTP ベース URI パスは `BASE_URI` です。

## 認証 {#authentication}

すべてのエンドポイントでは、[APIキー](https://forwardemail.net/my-account/security) をリクエストの [基本認証](https://en.wikipedia.org/wiki/Basic_access_authentication) ヘッダーの「ユーザー名」値として設定する必要があります ([生成されたエイリアスのユーザー名とパスワード](/faq#do-you-support-receiving-email-with-imap) を使用する [エイリアス連絡先](#alias-contacts)、[エイリアスカレンダー](#alias-calendars)、および [エイリアスメールボックス](#alias-mailboxes) を除く)。

心配しないでください。これが何なのかわからない場合は、以下に例を示します。

## エラー {#errors}

エラーが発生した場合、API リクエストの応答本文に詳細なエラー メッセージが含まれます。

| コード | 名前 |
| ---- | --------------------- |
| 200 | OK |
| 400 | 要求の形式が正しくありません |
| 401 | 不正な |
| 403 | 禁断 |
| 404 | 見つかりません |
| 429 | リクエストが多すぎる |
| 500 | 内部サーバーエラー |
| 501 | 実装されていません |
| 502 | 悪いゲートウェイ |
| 503 | サービスは利用できません |
| 504 | ゲートウェイタイムアウト |

> \[!TIP]
> 5xx ステータスコード（本来は発生しないはずのものです）が表示された場合は、<a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> までご連絡ください。問題解決のため、迅速に対応させていただきます。

## ローカリゼーション {#localization}

当社のサービスは25以上の言語に翻訳されています。すべてのAPIレスポンスメッセージは、APIリクエストを送信したユーザーが最後に検出したロケールに翻訳されます。カスタム`Accept-Language`ヘッダーを渡すことで、この設定を上書きできます。このページ下部の言語ドロップダウンから、ぜひお試しください。

## ページ区切り {#pagination}

> \[!NOTE]
> 2024年11月1日より、[ドメインの一覧](#list-domains)および[ドメインエイリアスの一覧](#list-domain-aliases)のAPIエンドポイントでは、1ページあたりの最大結果数がデフォルトで`1000`になります。この動作を早期にオプトインしたい場合は、エンドポイントクエリのURLに追加のクエリ文字列パラメータとして`?paginate=true`を渡すことができます。

ページ区切りは、結果を一覧表示するすべての API エンドポイントでサポートされています。

クエリ文字列プロパティ `page` (およびオプションで `limit`) を指定するだけです。

プロパティ`page`は、`1`以上の数値である必要があります。`limit`（数値）を指定した場合、最小値は`10`、最大値は`50`となります（特に記載がない限り）。

| クエリ文字列パラメータ | 必須 | タイプ | 説明 |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | いいえ | 番号 | 返される結果のページ。指定されていない場合、`page` の値は `1` になります。`1` 以上の数値を指定する必要があります。 |
| `limit` | いいえ | 番号 | ページごとに返される結果の数。指定されていない場合は、デフォルトで`10` になります。`1` 以上、`50` 以下の数値を指定する必要があります。 |

さらに結果があるかどうかを判断するために、次の HTTP 応答ヘッダーを提供します (これを解析してプログラムでページ分割できます)。

| HTTPレスポンスヘッダー | 例 | 説明 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | 利用可能なページの合計数。 |
| `X-Page-Current` | `X-Page-Current: 1` | 返された結果の現在のページ (例: `page` クエリ文字列パラメータに基づく)。 |
| `X-Page-Size` | `X-Page-Size: 10` | 返されたページ内の結果の合計数 (例: `limit` クエリ文字列パラメータと実際に返された結果に基づきます)。 |
| `X-Item-Count` | `X-Item-Count: 30` | すべてのページで利用可能なアイテムの合計数。 |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | 例に示すように、解析可能な `Link` HTTPレスポンスヘッダーを提供しています。これは [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) です（例えば、関連性がない、または利用できない場合は、すべての値が提供されるわけではありません。例えば、別のページがない場合、`"next"` は提供されません）。 |

> リクエスト例:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## ログ {#logs}

### ログを取得 {#retrieve-logs}

当社のAPIを使用すると、プログラム的にアカウントのログをダウンロードできます。このエンドポイントにリクエストを送信すると、アカウントのすべてのログが処理され、完了すると添付ファイル（[Gzip](https://en.wikipedia.org/wiki/Gzip) 圧縮された[CSV](https://en.wikipedia.org/wiki/Comma-separated_values) スプレッドシートファイル）としてメールで送信されます。

これにより、[cronジョブ](https://en.wikipedia.org/wiki/Cron) を使用したバックグラウンドジョブを作成したり、[Node.js ジョブスケジューリングソフトウェア Bree](https://github.com/breejs/bree) を使用して必要なときにいつでもログを受信したりできます。このエンドポイントは、1日あたり `10` リクエストまでに制限されていることに注意してください。

添付ファイルは`email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`の小文字形式で、メール自体には取得したログの簡単な概要が含まれています。ログは[マイアカウント → ログ](/my-account/logs)からいつでもダウンロードできます。

> `GET /v1/logs/download`

| クエリ文字列パラメータ | 必須 | タイプ | 説明 |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | いいえ | 文字列 (FQDN) | 完全修飾ドメイン（FQDN）でログをフィルタリングします。FQDNを指定しない場合は、すべてのドメインのすべてのログが取得されます。 |
| `q` | いいえ | 弦 | 電子メール、ドメイン、エイリアス名、IP アドレス、または日付 (`M/Y`、`M/D/YY`、`M-D`、`M-D-YY`、または `M.D.YY` 形式) でログを検索します。 |
| `bounce_category` | いいえ | 弦 | 特定のバウンス カテゴリ (例: `blocklist`) でログを検索します。 |
| `response_code` | いいえ | 番号 | 特定のエラー応答コード (例: `421` または `550`) でログを検索します。 |

> リクエスト例:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Cronジョブの例（毎日深夜）:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

[Crontab.guru](https://crontab.guru/) などのサービスを使用して、cron ジョブ式の構文を検証できることに注意してください。

> Cron ジョブの例 (毎日深夜に実行、**前日のログも含む**):

MacOSの場合:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Linux および Ubuntu の場合:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## アカウント {#account}

### アカウントを作成 {#create-account}

> `POST /v1/account`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | -------------- | ------------- |
| `email` | はい | 文字列（メール） | 電子メールアドレス |
| `password` | はい | 弦 | パスワード |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### アカウントを取得 {#retrieve-account}

> `GET /v1/account`

> リクエスト例:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### アカウントを更新 {#update-account}

> `PUT /v1/account`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | -------------- | -------------------- |
| `email` | いいえ | 文字列（メール） | 電子メールアドレス |
| `given_name` | いいえ | 弦 | ファーストネーム |
| `family_name` | いいえ | 弦 | 苗字 |
| `avatar_url` | いいえ | 文字列（URL） | アバター画像へのリンク |

> リクエスト例:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## エイリアス連絡先（CardDAV）{#alias-contacts-carddav}

> \[!NOTE]
> 他の API エンドポイントとは異なり、これらのエンドポイントでは、[認証](#authentication) の「ユーザー名」がエイリアスのユーザー名に、そして「パスワード」がエイリアスで生成されたパスワードにそれぞれ Basic 認証ヘッダーとして設定されている必要があります。

> \[!WARNING]
> このエンドポイントセクションは現在開発中で、2024年にリリースされる予定です（予定）。それまでの間は、ウェブサイトのナビゲーションにある「アプリ」ドロップダウンからIMAPクライアントをご利用ください。

### 連絡先リスト {#list-contacts}

> `GET /v1/contacts`

**近日公開**

### 連絡先を作成 {#create-contact}

> `POST /v1/contacts`

**近日公開**

### 連絡先を取得 {#retrieve-contact}

> `GET /v1/contacts/:id`

**近日公開**

### 連絡先を更新 {#update-contact}

> `PUT /v1/contacts/:id`

**近日公開**

### 連絡先を削除 {#delete-contact}

> `DELETE /v1/contacts/:id`

**近日公開**

## エイリアスカレンダー（CalDAV）{#alias-calendars-caldav}

> \[!NOTE]
> 他の API エンドポイントとは異なり、これらのエンドポイントでは、[認証](#authentication) の「ユーザー名」がエイリアスのユーザー名に、そして「パスワード」がエイリアスで生成されたパスワードにそれぞれ Basic 認証ヘッダーとして設定されている必要があります。

> \[!WARNING]
> このエンドポイントセクションは現在開発中で、2024年にリリースされる予定です（予定）。それまでの間は、ウェブサイトのナビゲーションにある「アプリ」ドロップダウンからIMAPクライアントをご利用ください。

### カレンダーの一覧 {#list-calendars}

> `GET /v1/calendars`

**近日公開**

### カレンダーを作成 {#create-calendar}

> `POST /v1/calendars`

**近日公開**

### カレンダーを取得 {#retrieve-calendar}

> `GET /v1/calendars/:id`

**近日公開**

### カレンダーを更新 {#update-calendar}

> `PUT /v1/calendars/:id`

**近日公開**

### カレンダーを削除 {#delete-calendar}

> `DELETE /v1/calendars/:id`

**近日公開**

## エイリアスメッセージ（IMAP/POP3） {#alias-messages-imappop3}

> \[!NOTE]
> 他の API エンドポイントとは異なり、これらのエンドポイントでは、[認証](#authentication) の「ユーザー名」がエイリアスのユーザー名に、そして「パスワード」がエイリアスで生成されたパスワードにそれぞれ Basic 認証ヘッダーとして設定されている必要があります。

> \[!WARNING]
> このエンドポイントセクションは現在開発中で、2024年にリリースされる予定です（予定）。それまでの間は、ウェブサイトのナビゲーションにある「アプリ」ドロップダウンからIMAPクライアントをご利用ください。

ドメインの設定手順に従っていることを確認してください。

これらの手順については、FAQ セクション [IMAP でのメール受信をサポートしていますか?](/faq#do-you-support-receiving-email-with-imap) をご覧ください。

### メッセージの一覧と検索 {#list-and-search-for-messages}

> `GET /v1/messages`

**近日公開**

### メッセージを作成 {#create-message}

> \[!NOTE]
> これはメールを送信するものではなく、単にメッセージをメールボックスフォルダに追加するだけです（IMAPの`APPEND`コマンドに似ています）。メールを送信する場合は、下記の[送信SMTPメールを作成する](#create-outbound-smtp-email)を参照してください。送信SMTPメールを作成した後、このエンドポイントを使用してそのコピーをエイリアスのメールボックスに追加し、保存することができます。

> `POST /v1/messages`

**近日公開**

### メッセージを取得 {#retrieve-message}

> `GET /v1/messages/:id`

**近日公開**

### 更新メッセージ {#update-message}

> `PUT /v1/messages/:id`

**近日公開**

### メッセージを削除 {#delete-message}

> `DELETE /v1/messages:id`

**近日公開**

## エイリアスフォルダ（IMAP/POP3） {#alias-folders-imappop3}

> \[!TIP]
> フォルダのパス <code>/v1/folders/:path</code> をエンドポイントとするフォルダエンドポイントは、フォルダの ID <code>:id</code> と互換性があります。つまり、フォルダは <code>path</code> 値または <code>id</code> 値のどちらでも参照できます。

> \[!WARNING]
> このエンドポイントセクションは現在開発中で、2024年にリリースされる予定です（予定）。それまでの間は、ウェブサイトのナビゲーションにある「アプリ」ドロップダウンからIMAPクライアントをご利用ください。

### フォルダの一覧 {#list-folders}

> `GET /v1/folders`

**近日公開**

### フォルダを作成 {#create-folder}

> `POST /v1/folders`

**近日公開**

### フォルダを取得 {#retrieve-folder}

> `GET /v1/folders/:id`

**近日公開**

### 更新フォルダ {#update-folder}

> `PUT /v1/folders/:id`

**近日公開**

### フォルダを削除 {#delete-folder}

> `DELETE /v1/folders/:id`

**近日公開**

### フォルダをコピー {#copy-folder}

> `POST /v1/folders/:id/copy`

**近日公開**

## 送信メール {#outbound-emails}

ドメインの設定手順に従っていることを確認してください。

これらの手順は[マイアカウント → ドメイン → 設定 → 送信SMTP設定](/my-account/domains)にあります。ドメインからSMTPを送信するには、DKIM、Return-Path、DMARCの設定が必要です。

### 送信SMTPメールの制限を取得する {#get-outbound-smtp-email-limit}

これは、アカウントごとに毎日の SMTP 送信メッセージの数を示す `count` と `limit` を含む JSON オブジェクトを返すシンプルなエンドポイントです。

> `GET /v1/emails/limit`

> リクエスト例:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### 送信SMTPメールの一覧表示 {#list-outbound-smtp-emails}

このエンドポイントは、電子メールの `message`、`headers`、または `rejectedErrors` のプロパティ値を返さないことに注意してください。

これらのプロパティとその値を返すには、電子メール ID を指定した [メールを取得](#retrieve-email) エンドポイントを使用してください。

> `GET /v1/emails`

| クエリ文字列パラメータ | 必須 | タイプ | 説明 |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | いいえ | 文字列（正規表現をサポート） | メタデータでメールを検索する |
| `domain` | いいえ | 文字列（正規表現をサポート） | ドメイン名でメールを検索する |
| `sort` | いいえ | 弦 | 特定のフィールドで並べ替えます（先頭にハイフン `-` を付けると、そのフィールドの逆方向に並べ替えられます）。設定されていない場合は、デフォルトで `created_at` になります。 |
| `page` | いいえ | 番号 | 詳細については[Pagination](#pagination)をご覧ください |
| `limit` | いいえ | 番号 | 詳細については[Pagination](#pagination)をご覧ください |

> リクエスト例:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### 送信SMTPメールを作成する {#create-outbound-smtp-email}

メール作成用のAPIは、Nodemailerのメッセージオプション設定を参考に開発されています。以下の本文パラメータはすべて[Nodemailerメッセージ構成](https://nodemailer.com/message/)に準じてください。

`envelope` と `dkim` を除き（これらは自動的に設定されます）、Nodemailer のすべてのオプションをサポートしています。セキュリティ上の理由から、`disableFileAccess` と `disableUrlAccess` のオプションは自動的に `true` に設定されます。

ヘッダーを含む生の完全な電子メールとともに `raw` の単一オプションを渡すか、**または** 以下の個別の本文パラメータ オプションを渡す必要があります。

このAPIエンドポイントは、ヘッダーに絵文字が含まれている場合、自動的にエンコードします（例：件名が`Subject: 🤓 Hello`の場合、自動的に`Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`に変換されます）。私たちの目標は、開発者にとって非常に使いやすく、誰でも簡単に使えるメールAPIを作ることでした。

> `POST /v1/emails`

| ボディパラメータ | 必須 | タイプ | 説明 |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | いいえ | 文字列（メール） | 送信者のメール アドレス (ドメインのエイリアスとして存在している必要があります)。 |
| `to` | いいえ | 文字列または配列 | 「To」ヘッダーの受信者のコンマ区切りリストまたは配列。 |
| `cc` | いいえ | 文字列または配列 | 「Cc」ヘッダーの受信者のコンマ区切りリストまたは配列。 |
| `bcc` | いいえ | 文字列または配列 | 「Bcc」ヘッダーの受信者のコンマ区切りリストまたは配列。 |
| `subject` | いいえ | 弦 | 電子メールの件名。 |
| `text` | いいえ | 文字列またはバッファ | メッセージのプレーンテキスト バージョン。 |
| `html` | いいえ | 文字列またはバッファ | メッセージの HTML バージョン。 |
| `attachments` | いいえ | 配列 | 添付ファイルオブジェクトの配列 ([Nodemailer's common fields](https://nodemailer.com/message/#common-fields) を参照)。 |
| `sender` | いいえ | 弦 | 「送信者」ヘッダーの電子メール アドレス ([Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields) を参照)。 |
| `replyTo` | いいえ | 弦 | 「Reply-To」ヘッダーのメール アドレス。 |
| `inReplyTo` | いいえ | 弦 | メッセージが返信されるメッセージ ID。 |
| `references` | いいえ | 文字列または配列 | スペースで区切られたリストまたはメッセージ ID の配列。 |
| `attachDataUrls` | いいえ | ブール値 | `true` の場合は、メッセージの HTML コンテンツ内の `data:` 画像を埋め込み添付ファイルに変換します。 |
| `watchHtml` | いいえ | 弦 | Apple Watch 固有の HTML バージョンのメッセージ ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options])、最新のウォッチではこれを設定する必要はありません)。 |
| `amp` | いいえ | 弦 | メッセージの AMP4EMAIL 固有の HTML バージョン ([Nodemailer's example](https://nodemailer.com/message/#amp-example) を参照)。 |
| `icalEvent` | いいえ | 物体 | 代替メッセージ コンテンツとして使用する iCalendar イベント ([Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/) を参照)。 |
| `alternatives` | いいえ | 配列 | 代替メッセージ コンテンツの配列 ([Nodemailer's alternative content](https://nodemailer.com/message/alternatives/) を参照)。 |
| `encoding` | いいえ | 弦 | テキストと HTML 文字列のエンコード (デフォルトは `"utf-8"` ですが、`"hex"` および `"base64"` エンコード値もサポートされます)。 |
| `raw` | いいえ | 文字列またはバッファ | 使用するカスタム生成された RFC822 形式のメッセージ (Nodemailer によって生成されたメッセージの代わりに – [Nodemailer's custom source](https://nodemailer.com/message/custom-source/) を参照)。 |
| `textEncoding` | いいえ | 弦 | テキスト値に強制的に使用されるエンコーディング（`"quoted-printable"` または `"base64"`）。デフォルト値は検出された最も近い値です（ASCIIの場合は `"quoted-printable"` を使用します）。 |
| `priority` | いいえ | 弦 | メールの優先度（`"high"`、`"normal"`（デフォルト）、または`"low"`のいずれか）。`"normal"`の値が設定されている場合、優先度ヘッダーは設定されません（これがデフォルトの動作です）。`"high"`または`"low"`の値が設定されている場合、`X-Priority`、`X-MSMail-Priority`、および`Importance`ヘッダーは[will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240)に設定されます。 |
| `headers` | いいえ | オブジェクトまたは配列 | 設定する追加のヘッダー フィールドのオブジェクトまたは配列 ([Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/) を参照)。 |
| `messageId` | いいえ | 弦 | 「Message-ID」ヘッダーのオプションの Message-ID 値 (設定されていない場合はデフォルト値が自動的に作成されます。値は [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705) である必要があります)。 |
| `date` | いいえ | 文字列または日付 | 解析後に日付ヘッダーが欠落している場合に使用されるオプションの日付値。日付ヘッダーが設定されていない場合は、現在のUTC文字列が使用されます。日付ヘッダーは、現在の時刻から30日以上先の日付を指定することはできません。 |
| `list` | いいえ | 物体 | `List-*` ヘッダーのオプションのオブジェクト ([Nodemailer's list headers](https://nodemailer.com/message/list-headers/) を参照)。 |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### 送信SMTPメールを取得する {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> リクエスト例:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### 送信SMTPメールを削除します {#delete-outbound-smtp-email}

メールを削除すると、現在のステータスが`"pending"`、`"queued"`、または`"deferred"`のいずれかの場合に限り、ステータスが`"rejected"`に設定されます（その後、キューでは処理されません）。メールは作成または送信されてから30日後に自動的に消去される場合があります。そのため、送信SMTPメールのコピーをクライアント、データベース、またはアプリケーションに保存しておく必要があります。必要に応じて、データベースでメールID値を参照できます。この値は、[メールを作成](#create-email)と[メールを取得](#retrieve-email)の両方のエンドポイントから返されます。

> `DELETE /v1/emails/:id`

> リクエスト例:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## ドメイン {#domains}

> \[!TIP]
> ドメイン名 <code>/v1/domains/:domain_name</code> をエンドポイントとするドメインエンドポイントは、ドメインID <code>:domain_id</code> と互換性があります。つまり、ドメインは <code>name</code> または <code>id</code> のいずれかの値で参照できます。

### ドメインの一覧 {#list-domains}

> \[!NOTE]
> 2024年11月1日より、[ドメインの一覧](#list-domains)および[ドメインエイリアスの一覧](#list-domain-aliases)のAPIエンドポイントでは、1ページあたりの最大結果数がデフォルトで`1000`に設定されます。この動作を早期にオプトインする場合は、エンドポイントクエリのURLに追加のクエリ文字列パラメータとして`?paginate=true`を渡すことができます。詳細については、[ページネーション](#pagination)をご覧ください。

> `GET /v1/domains`

| クエリ文字列パラメータ | 必須 | タイプ | 説明 |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | いいえ | 文字列（正規表現をサポート） | 名前でドメインを検索する |
| `name` | いいえ | 文字列（正規表現をサポート） | 名前でドメインを検索する |
| `sort` | いいえ | 弦 | 特定のフィールドで並べ替えます（先頭にハイフン `-` を付けると、そのフィールドの逆方向に並べ替えられます）。設定されていない場合は、デフォルトで `created_at` になります。 |
| `page` | いいえ | 番号 | 詳細については[Pagination](#pagination)をご覧ください |
| `limit` | いいえ | 番号 | 詳細については[Pagination](#pagination)をご覧ください |

> リクエスト例:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### ドメインを作成 {#create-domain}

> `POST /v1/domains`

| ボディパラメータ | 必須 | タイプ | 説明 |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | はい | 文字列（FQDN または IP） | 完全修飾ドメイン名（「FQDN」）またはIPアドレス |
| `team_domain` | いいえ | 文字列（ドメインIDまたはドメイン名; FQDN） | このドメインを別のドメインの同じチームに自動的に割り当てます。つまり、このドメインのメンバー全員がチームメンバーとして割り当てられ、`plan` は自動的に `team` に設定されます。必要に応じてこれを `"none"` に設定して明示的に無効にすることもできますが、これは必須ではありません。 |
| `plan` | いいえ | 文字列（列挙可能） | プランの種類 (`"free"`、`"enhanced_protection"`、または `"team"` のいずれかである必要があります。デフォルトは `"free"` またはユーザーが現在利用している有料プランです) |
| `catchall` | いいえ | 文字列（区切られたメールアドレス）またはブール値 | デフォルトのキャッチオールエイリアスを作成します。デフォルトは`true`です（`true`の場合はAPIユーザーのメールアドレスを受信者として使用し、`false`の場合はキャッチオールは作成されません）。文字列が渡された場合は、受信者として使用するメールアドレスの区切りリストになります（改行、スペース、またはカンマで区切られます）。 |
| `has_adult_content_protection` | いいえ | ブール値 | このドメインでスパムスキャナによるアダルトコンテンツ保護を有効にするかどうか |
| `has_phishing_protection` | いいえ | ブール値 | このドメインでスパムスキャナのフィッシング保護を有効にするかどうか |
| `has_executable_protection` | いいえ | ブール値 | このドメインでスパムスキャナ実行ファイル保護を有効にするかどうか |
| `has_virus_protection` | いいえ | ブール値 | このドメインでスパムスキャナウイルス対策を有効にするかどうか |
| `has_recipient_verification` | いいえ | ブール値 | エイリアス受信者がメールを流すためにメール確認リンクをクリックすることを要求するかどうかのグローバルドメインのデフォルト |
| `ignore_mx_check` | いいえ | ブール値 | ドメインのMXレコード検証を無視するかどうか。これは主に、高度なMX交換設定ルールがあり、既存のMX交換を維持して当社のMX交換に転送する必要があるユーザー向けです。 |
| `retention_days` | いいえ | 番号 | `0` から `30` までの整数で、送信SMTPメールを正常に配信された後、または永続的なエラーが発生した後に保存する日数を表します。デフォルトは `0` で、送信SMTPメールはセキュリティ保護のため直ちに削除され、編集されます。 |
| `bounce_webhook` | いいえ | 文字列（URL）またはブール値（false） | バウンスWebhookの送信先として選択した`http://`または`https://`のWebhook URL。このURLに、送信SMTPエラー（ソフトエラーやハードエラーなど）に関する情報を含む`POST`リクエストが送信されます。これにより、購読者を管理し、送信メールをプログラムで管理できます。 |
| `max_quota_per_alias` | いいえ | 弦 | このドメイン名のエイリアスの最大ストレージ容量。[bytes](https://github.com/visionmedia/bytes.js) によって解析される「1 GB」などの値を入力してください。 |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### ドメインを取得 {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### ドメインレコードを確認する {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### ドメインSMTPレコードを確認する {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### ドメイン全体のキャッチオールパスワードを一覧表示します {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### ドメイン全体のキャッチオールパスワードを作成する {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | いいえ | 弦 | ドメイン全体のキャッチオールパスワードとして使用する新しいカスタムパスワードです。ランダムに生成された強力なパスワードを取得したい場合は、このパラメータを空白のままにするか、APIリクエスト本文に何も指定しないでください。 |
| `description` | いいえ | 弦 | 整理目的のみの説明。 |

> リクエスト例:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### ドメイン全体のキャッチオールパスワードを削除します {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> リクエスト例:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### ドメインを更新 {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| ボディパラメータ | 必須 | タイプ | 説明 |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | いいえ | 文字列または数値 | SMTP 転送用に設定するカスタム ポート (デフォルトは `"25"`) |
| `has_adult_content_protection` | いいえ | ブール値 | このドメインでスパムスキャナによるアダルトコンテンツ保護を有効にするかどうか |
| `has_phishing_protection` | いいえ | ブール値 | このドメインでスパムスキャナのフィッシング保護を有効にするかどうか |
| `has_executable_protection` | いいえ | ブール値 | このドメインでスパムスキャナ実行ファイル保護を有効にするかどうか |
| `has_virus_protection` | いいえ | ブール値 | このドメインでスパムスキャナウイルス対策を有効にするかどうか |
| `has_recipient_verification` | いいえ | ブール値 | エイリアス受信者がメールを流すためにメール確認リンクをクリックすることを要求するかどうかのグローバルドメインのデフォルト |
| `ignore_mx_check` | いいえ | ブール値 | ドメインのMXレコード検証を無視するかどうか。これは主に、高度なMX交換設定ルールがあり、既存のMX交換を維持して当社のMX交換に転送する必要があるユーザー向けです。 |
| `retention_days` | いいえ | 番号 | `0` から `30` までの整数で、送信SMTPメールを正常に配信された後、または永続的なエラーが発生した後に保存する日数を表します。デフォルトは `0` で、送信SMTPメールはセキュリティ保護のため直ちに削除され、編集されます。 |
| `bounce_webhook` | いいえ | 文字列（URL）またはブール値（false） | バウンスWebhookの送信先として選択した`http://`または`https://`のWebhook URL。このURLに、送信SMTPエラー（ソフトエラーやハードエラーなど）に関する情報を含む`POST`リクエストが送信されます。これにより、購読者を管理し、送信メールをプログラムで管理できます。 |
| `max_quota_per_alias` | いいえ | 弦 | このドメイン名のエイリアスの最大ストレージ容量。[bytes](https://github.com/visionmedia/bytes.js) によって解析される「1 GB」などの値を入力してください。 |

> リクエスト例:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### ドメインを削除 {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> リクエスト例:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## 招待 {#invites}

### ドメイン招待を承認 {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### ドメイン招待を作成 {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | はい | 文字列（メール） | ドメインメンバーリストに招待するメールアドレス |
| `group` | はい | 文字列（列挙可能） | ユーザーをドメイン メンバーシップに追加するグループ (`"admin"` または `"user"` のいずれか) |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> 招待されたユーザーが、招待元の管理者が所属する他のドメインで既に承認済みのメンバーである場合、招待は自動的に承認され、メールは送信されません。

### ドメイン招待を削除 {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | はい | 文字列（メール） | ドメインメンバーリストから削除するメールアドレス |

> リクエスト例:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## メンバー {#members}

### ドメインメンバーを更新 {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | はい | 文字列（列挙可能） | ユーザーをドメイン メンバーシップに更新するグループ (`"admin"` または `"user"` のいずれか) |

> リクエスト例:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### ドメインメンバーを削除 {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> リクエスト例:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## エイリアス {#aliases}

### エイリアスパスワードを生成する {#generate-an-alias-password}

手順を電子メールで送信しない場合は、ユーザー名とパスワードが、`{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` の形式で成功したリクエストの JSON 応答本文に含まれることに注意してください。

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| ボディパラメータ | 必須 | タイプ | 説明 |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | いいえ | 弦 | エイリアスに使用する新しいカスタムパスワード。ランダムに生成された強力なパスワードを取得したい場合は、このパスワードを空白のままにするか、APIリクエスト本文に何も入力しなくても構いません。 |
| `password` | いいえ | 弦 | 既存の IMAP メールボックス ストレージを削除せずにパスワードを変更するためのエイリアスの既存のパスワード (既存のパスワードがなくなった場合は、以下の `is_override` オプションを参照してください)。 |
| `is_override` | いいえ | ブール値 | **注意して使用してください**：この操作により、既存のエイリアスのパスワードとデータベースが完全に上書きされ、既存のIMAPストレージが完全に削除され、エイリアスのSQLiteメールデータベースが完全にリセットされます。このエイリアスに既存のメールボックスが接続されている場合、可能であればバックアップを作成してください。 |
| `emailed_instructions` | いいえ | 弦 | エイリアスのパスワードとセットアップ手順を送信するメール アドレス。 |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### ドメインエイリアスの一覧 {#list-domain-aliases}

> \[!NOTE]
> 2024年11月1日より、[ドメインの一覧](#list-domains)および[ドメインエイリアスの一覧](#list-domain-aliases)のAPIエンドポイントでは、1ページあたりの最大結果数がデフォルトで`1000`に設定されます。この動作を早期にオプトインする場合は、エンドポイントクエリのURLに追加のクエリ文字列パラメータとして`?paginate=true`を渡すことができます。詳細については、[ページネーション](#pagination)をご覧ください。

> `GET /v1/domains/DOMAIN_NAME/aliases`

| クエリ文字列パラメータ | 必須 | タイプ | 説明 |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | いいえ | 文字列（正規表現をサポート） | 名前、ラベル、受信者でドメイン内のエイリアスを検索します |
| `name` | いいえ | 文字列（正規表現をサポート） | ドメイン内のエイリアスを名前で検索する |
| `recipient` | いいえ | 文字列（正規表現をサポート） | 受信者別にドメイン内のエイリアスを検索する |
| `sort` | いいえ | 弦 | 特定のフィールドで並べ替えます（先頭にハイフン `-` を付けると、そのフィールドの逆方向に並べ替えられます）。設定されていない場合は、デフォルトで `created_at` になります。 |
| `page` | いいえ | 番号 | 詳細については[Pagination](#pagination)をご覧ください |
| `limit` | いいえ | 番号 | 詳細については[Pagination](#pagination)をご覧ください |

> リクエスト例:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### 新しいドメインエイリアスを作成 {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| ボディパラメータ | 必須 | タイプ | 説明 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | いいえ | 弦 | エイリアス名（指定されない場合、または空白の場合は、ランダムなエイリアスが生成されます） |
| `recipients` | いいえ | 文字列または配列 | 受信者のリスト（有効なメールアドレス、完全修飾ドメイン名（FQDN）、IPアドレス、Webhook URLの改行/スペース/カンマ区切りの文字列または配列である必要があります。指定されていないか空の配列の場合は、APIリクエストを行うユーザーのメールアドレスが受信者として設定されます） |
| `description` | いいえ | 弦 | エイリアスの説明 |
| `labels` | いいえ | 文字列または配列 | ラベルのリスト（改行/スペース/カンマで区切られた文字列または配列である必要があります） |
| `has_recipient_verification` | いいえ | ブール値 | メールが送信されるには、受信者がメール確認リンクをクリックする必要があります（リクエスト本文で明示的に設定されていない場合は、ドメインの設定がデフォルトになります） |
| `is_enabled` | いいえ | ブール値 | このエイリアスを有効または無効にするかどうか（無効にした場合、メールはどこにもルーティングされず、成功ステータスコードが返されます）。値が渡された場合、[boolean](https://github.com/thenativeweb/boolean#quick-start) を使用してブール値に変換されます。 |
| `error_code_if_disabled` | いいえ | 番号 (`250`、`421`、または `550` のいずれか) | このエイリアスへの受信メールは、`is_enabled` が `false` の場合に拒否されます。その場合、`250` (静かに配信しない、例: blackhole または `/dev/null`)、`421` (ソフト拒否、最大 5 日間再試行)、または `550` (永続的な失敗と拒否) のいずれかになります。デフォルトは `250` です。 |
| `has_imap` | いいえ | ブール値 | このエイリアスの IMAP ストレージを有効にするか無効にするかを指定します (無効にした場合、受信したメールは [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) に保存されません。値が渡された場合は、[boolean](https://github.com/thenativeweb/boolean#quick-start) を使用してブール値に変換されます) |
| `has_pgp` | いいえ | ブール値 | エイリアスの `public_key` を使用して [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) に対して [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) を有効にするか無効にするかを指定します。 |
| `public_key` | いいえ | 弦 | ASCII Armor形式のOpenPGP公開鍵（[click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)、例：`support@forwardemail.net`のGPG鍵）。これは、`has_pgp`を`true`に設定した場合にのみ適用されます。[Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。 |
| `max_quota` | いいえ | 弦 | このエイリアスのストレージの最大クォータです。空白のままにするとドメインの現在の最大クォータにリセットされます。「1 GB」などの値を入力すると、[bytes](https://github.com/visionmedia/bytes.js) によって解析されます。この値はドメイン管理者のみが調整できます。 |
| `vacation_responder_is_enabled` | いいえ | ブール値 | 自動不在応答を有効にするか無効にするかを指定します。 |
| `vacation_responder_start_date` | いいえ | 弦 | 休暇通知の開始日（有効になっている場合、開始日が設定されていないと、既に開始されているとみなされます）。`MM/DD/YYYY`、`YYYY-MM-DD` などの日付形式に加え、`dayjs` を使用したスマート解析によりその他の日付形式もサポートしています。 |
| `vacation_responder_end_date` | いいえ | 弦 | 休暇通知の終了日（有効で終了日が設定されていない場合は、無期限とみなされ、無期限に通知が送信されます）。`MM/DD/YYYY`、`YYYY-MM-DD` などの日付形式に加え、`dayjs` を使用したスマート解析により、その他の日付形式もサポートしています。 |
| `vacation_responder_subject` | いいえ | 弦 | 不在通知用の件名はプレーンテキストで表示されます（例：「不在」）。ここでは`striptags`を使用してHTMLをすべて削除します。 |
| `vacation_responder_message` | いいえ | 弦 | 休暇通知者へのプレーンテキストメッセージ（例：「2月まで不在です。」）。ここでは、`striptags` を使用してすべてのHTMLを削除します。 |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### ドメインエイリアスを取得 {#retrieve-domain-alias}

ドメイン エイリアスは、`id` または `name` 値のいずれかで取得できます。

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> リクエスト例:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### ドメインエイリアスを更新 {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| ボディパラメータ | 必須 | タイプ | 説明 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | いいえ | 弦 | エイリアス名 |
| `recipients` | いいえ | 文字列または配列 | 受信者のリスト（有効なメールアドレス、完全修飾ドメイン名（FQDN）、IP アドレス、および/または Webhook URL の改行/スペース/カンマで区切られた文字列または配列である必要があります） |
| `description` | いいえ | 弦 | エイリアスの説明 |
| `labels` | いいえ | 文字列または配列 | ラベルのリスト（改行/スペース/カンマで区切られた文字列または配列である必要があります） |
| `has_recipient_verification` | いいえ | ブール値 | メールが送信されるには、受信者がメール確認リンクをクリックする必要があります（リクエスト本文で明示的に設定されていない場合は、ドメインの設定がデフォルトになります） |
| `is_enabled` | いいえ | ブール値 | このエイリアスを有効または無効にするかどうか（無効にした場合、メールはどこにもルーティングされず、成功ステータスコードが返されます）。値が渡された場合、[boolean](https://github.com/thenativeweb/boolean#quick-start) を使用してブール値に変換されます。 |
| `error_code_if_disabled` | いいえ | 番号 (`250`、`421`、または `550` のいずれか) | このエイリアスへの受信メールは、`is_enabled` が `false` の場合に拒否されます。その場合、`250` (静かに配信しない、例: blackhole または `/dev/null`)、`421` (ソフト拒否、最大 5 日間再試行)、または `550` (永続的な失敗と拒否) のいずれかになります。デフォルトは `250` です。 |
| `has_imap` | いいえ | ブール値 | このエイリアスの IMAP ストレージを有効にするか無効にするかを指定します (無効にした場合、受信したメールは [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) に保存されません。値が渡された場合は、[boolean](https://github.com/thenativeweb/boolean#quick-start) を使用してブール値に変換されます) |
| `has_pgp` | いいえ | ブール値 | エイリアスの `public_key` を使用して [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) に対して [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) を有効にするか無効にするかを指定します。 |
| `public_key` | いいえ | 弦 | ASCII Armor形式のOpenPGP公開鍵（[click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)、例：`support@forwardemail.net`のGPG鍵）。これは、`has_pgp`を`true`に設定した場合にのみ適用されます。[Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)。 |
| `max_quota` | いいえ | 弦 | このエイリアスのストレージの最大クォータです。空白のままにするとドメインの現在の最大クォータにリセットされます。「1 GB」などの値を入力すると、[bytes](https://github.com/visionmedia/bytes.js) によって解析されます。この値はドメイン管理者のみが調整できます。 |
| `vacation_responder_is_enabled` | いいえ | ブール値 | 自動不在応答を有効にするか無効にするかを指定します。 |
| `vacation_responder_start_date` | いいえ | 弦 | 休暇通知の開始日（有効になっている場合、開始日が設定されていないと、既に開始されているとみなされます）。`MM/DD/YYYY`、`YYYY-MM-DD` などの日付形式に加え、`dayjs` を使用したスマート解析によりその他の日付形式もサポートしています。 |
| `vacation_responder_end_date` | いいえ | 弦 | 休暇通知の終了日（有効で終了日が設定されていない場合は、無期限とみなされ、無期限に通知が送信されます）。`MM/DD/YYYY`、`YYYY-MM-DD` などの日付形式に加え、`dayjs` を使用したスマート解析により、その他の日付形式もサポートしています。 |
| `vacation_responder_subject` | いいえ | 弦 | 不在通知用の件名はプレーンテキストで表示されます（例：「不在」）。ここでは`striptags`を使用してHTMLをすべて削除します。 |
| `vacation_responder_message` | いいえ | 弦 | 休暇通知者へのプレーンテキストメッセージ（例：「2月まで不在です。」）。ここでは、`striptags` を使用してすべてのHTMLを削除します。 |

> リクエスト例:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### ドメインエイリアスを削除 {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> リクエスト例:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## 暗号化 {#encrypt}

無料プランでもレコードの暗号化を無料でご利用いただけます。プライバシーは機能ではなく、製品のあらゆる側面に本質的に組み込まれているべきです。[プライバシーガイドの議論](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) と [GitHubの問題](https://github.com/forwardemail/forwardemail.net/issues/254) で多くのご要望をいただいたため、この機能を追加しました。

### TXTレコードを暗号化 {#encrypt-txt-record}

> `POST /v1/encrypt`

| ボディパラメータ | 必須 | タイプ | 説明 |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | はい | 弦 | 有効な転送メールのプレーンテキストTXTレコード |

> リクエスト例:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
