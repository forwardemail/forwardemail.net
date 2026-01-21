# 量子耐性メール: 暗号化されたSQLiteメールボックスを使用してメールを安全に保つ方法 {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## 目次 {#table-of-contents}

* [序文](#foreword)
* [メールサービスプロバイダーの比較](#email-service-provider-comparison)
* [どのように機能するか](#how-does-it-work)
* [テクノロジー](#technologies)
  * [データベース](#databases)
  * [安全](#security)
  * [メールボックス](#mailboxes)
  * [同時実行性](#concurrency)
  * [バックアップ](#backups)
  * [検索](#search)
  * [プロジェクト](#projects)
  * [プロバイダー](#providers)
* [考え](#thoughts)
  * [原則](#principles)
  * [実験](#experiments)
  * [代替手段の欠如](#lack-of-alternatives)
  * [メール転送を試してみる](#try-out-forward-email)

## 序文 {#foreword}

> \[!IMPORTANT]
> 当社のメールサービスは[100%オープンソース](https://github.com/forwardemail)であり、安全で暗号化されたSQLiteメールボックスを通じてプライバシーを重視しています。

[IMAPサポート](/faq#do-you-support-receiving-email-with-imap) をリリースするまでは、永続的なデータ ストレージのニーズには MongoDB を使用していました。

この技術は素晴らしいもので、現在でも使用されていますが、MongoDB で保存時の暗号化を行うには、Digital Ocean や Mongo Atlas などの MongoDB Enterprise を提供するプロバイダーを使用するか、エンタープライズ ライセンスを購入する必要があります (その後、営業チームの対応に追われることになります)。

[メールを転送する](https://forwardemail.net) のチームは、開発者にとって使いやすく、拡張性と信頼性に優れた、IMAP メールボックス向けの暗号化ストレージソリューションを必要としていました。オープンソース開発者として、保存時の暗号化機能を利用するためにライセンス料を支払う必要があるテクノロジーを使用することは、[私たちの原則](#principles) にとって好ましくありませんでした。そこで私たちは、これらのニーズを満たすために、実験と調査を重ね、ゼロから新しいソリューションを開発しました。

お客様のメールボックスを共有データベースに保存するのではなく、お客様専用のパスワード（お客様のみが持つパスワード）を使用して個別に暗号化し、保存します。**当社のメールサービスは非常に安全であるため、パスワードを忘れた場合、メールボックスは失われます**（その場合、オフラインバックアップで復元するか、最初からやり直す必要があります）。

以下では、[メールサービスプロバイダーの比較](#email-service-provider-comparison)、[当社のサービスの仕組み](#how-does-it-work)、[当社のテクノロジースタック](#technologies) などについて詳しく説明します。

## メールサービスプロバイダーの比較 {#email-service-provider-comparison}

当社は、個別に暗号化された SQLite メールボックスを保存し、無制限のドメイン、エイリアス、ユーザーを提供し、送信 SMTP、IMAP、POP3 をサポートする、唯一の 100% オープンソースでプライバシー重視の電子メール サービス プロバイダーです。

**他のメールプロバイダーとは異なり、Forward Emailではドメインまたはエイリアスごとにストレージ料金を支払う必要はありません。** ストレージはアカウント全体で共有されるため、複数のカスタムドメイン名とそれぞれに複数のエイリアスをお持ちの場合は、Forward Emailが最適なソリューションです。なお、必要に応じてドメインまたはエイリアスごとにストレージ制限を設定することもできます。

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">メールサービスの比較を読む <i class="fa fa-search-plus"></i></a>

## 仕組み {#how-does-it-work}

1. Apple Mail、Betterbird、Gmail、Outlook などのメール クライアントを使用して、ユーザー名とパスワードで安全な [IMAP](/faq#do-you-support-receiving-email-with-imap) サーバーに接続します。

* ユーザー名は、`hello@example.com` のように、ドメインを含む完全なエイリアスです。
* パスワードはランダムに生成され、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</strong>から <strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong> をクリックした際に30秒間のみ表示されます。

2. 接続が完了すると、メールクライアントは[IMAPプロトコルコマンド](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)をIMAPサーバーに送信し、メールボックスの同期を維持します。これには、メールの作成と下書きの保存、その他の操作（例：メールに「重要」ラベルを付ける、メールに「スパム/迷惑メール」フラグを付けるなど）が含まれます。

3. メール交換サーバー（一般に「MXサーバー」と呼ばれます）は、新しい受信メールを受信し、お客様のメールボックスに保存します。この処理が行われると、お客様のメールクライアントに通知が届き、メールボックスが同期されます。当社のメール交換サーバーは、お客様のメールを1人以上の受信者（[ウェブフック](/faq#do-you-support-webhooks)を含む）に転送したり、お客様の暗号化されたIMAPストレージにメールを保存したり、**またはその両方**を行うことができます。

> \[!TIP]
> さらに詳しく知りたい場合は、[メール転送の設定方法](/faq#how-do-i-get-started-and-set-up-email-forwarding)、[メール交換サービスの仕組み](/faq#how-does-your-email-forwarding-system-work)、または[私たちのガイド](/guides)をご覧ください。

4. 裏では、当社の安全なメール ストレージ設計により、メールボックスが暗号化され、お客様だけがアクセスできるようになります。その仕組みは次の 2 つです。

* 送信者から新しいメールが受信されると、当社のメール交換サーバーは、個別の一時的な暗号化されたメールボックスに書き込みます。

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* メールクライアントからIMAPサーバーに接続すると、パスワードはメモリ内で暗号化され、メールボックスの読み書きに使用されます。メールボックスの読み書きは、このパスワードでのみ可能です。このパスワードを知っているのはあなただけなので、アクセス中は**あなただけ**がメールボックスの読み書きを行えることにご注意ください。次回メールクライアントがメールのポーリングまたは同期を試みると、新しいメッセージはこの一時メールボックスから転送され、入力したパスワードを使用して実際のメールボックスファイルに保存されます。この一時メールボックスはその後完全に削除されるため、パスワードで保護されたメールボックスにのみメッセージが保存されます。

* **IMAPに接続している場合（例：Apple MailやThunderbirdなどのメールクライアントを使用している場合）、一時的なディスクストレージへの書き込みは不要です。代わりに、メモリ内に暗号化されたIMAPパスワードが取得され、使用されます。リアルタイムで、メッセージを配信しようとすると、すべてのIMAPサーバーにWebSocketリクエストを送信し、アクティブなセッションがあるかどうかを問い合わせます（これが取得の部分です）。その後、暗号化されたメモリ内パスワードが渡されます。つまり、一時的なメールボックスへの書き込みは不要で、暗号化されたパスワードを使用して、実際の暗号化されたメールボックスに書き込むことができます。**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [暗号化されたメールボックスのバックアップ](#backups)は毎日作成されます。また、いつでも新しいバックアップをリクエストしたり、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</a>から最新のバックアップをダウンロードしたりすることもできます。別のメールサービスに乗り換える場合でも、メールボックスとバックアップはいつでも簡単に移行、ダウンロード、エクスポート、消去できます。

## テクノロジーズ {#technologies}

### データベース {#databases}

他のデータベース ストレージ レイヤーも検討しましたが、SQLite ほど要件を満たすものはありませんでした。

| データベース | 保存時の暗号化 | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) メールボックス | ライセンス | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: | :white_check_mark: はい、[SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) 付き | :白いチェックマーク: | :white_check_mark: パブリックドメイン | :白いチェックマーク: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: リレーショナルデータベース | :x: AGPL と `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: リレーショナルデータベース | :white_check_mark: `MIT` | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: `LGPL-3.0-only` | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: リレーショナルデータベース | :white_check_mark: `PostgreSQL` (`BSD` または `MIT` と同様) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: リレーショナルデータベース | :white_check_mark: `GPLv2` と `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: リレーショナルデータベース | :x: `BUSL-1.1` など | :x: |

> 上記の表には [いくつかのSQLiteデータベースストレージオプションを比較したブログ投稿](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) があります。

### セキュリティ {#security}

メールボックスでは、[保存時の暗号化](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard))、[転送中の暗号化](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security))、[DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) (「DoH」) 暗号化を常に使用しています。:tangerine: [タンジェリン](https://tangeri.ne)、[sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-ポリ1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) 暗号化も使用しています。さらに、トークンベースの2要素認証 ([中間者攻撃](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) の影響を受けやすいSMSではなく)、ルートアクセスを無効化したSSHキーのローテーション、制限されたIPアドレスによるサーバーへの排他的アクセスなどを採用しています。

[邪悪なメイドの攻撃](https://en.wikipedia.org/wiki/Evil_maid_attack) やサードパーティベンダーの不正な従業員による不正アクセスがあった場合でも、**メールボックスは生成されたパスワードでのみ開けます**。SOC Type 2準拠のサーバープロバイダーであるCloudflare、DataPacket、Digital Ocean、Vultr以外のサードパーティベンダーには依存していませんのでご安心ください。

私たちの目標は、[単一障害点](https://en.wikipedia.org/wiki/Single_point_of_failure) をできるだけ少なくすることです。

### メールボックス {#mailboxes}

> **tldr;** 当社の IMAP サーバーは、メールボックスごとに個別に暗号化された SQLite データベースを使用します。

[SQLiteは非常に人気のある](https://www.sqlite.org/mostdeployed.html) 埋め込みデータベース – 現在、携帯電話とコンピューターで実行されています – [ほぼすべての主要技術で使用されている](https://www.sqlite.org/famous.html)。

例えば、暗号化サーバーには、`linux@example.com`、`info@example.com`、`hello@example.com` といったSQLiteデータベースメールボックスがあり、それぞれが`.sqlite`データベースファイルとして存在します。データベースファイル名もメールアドレスと同じではなく、BSONオブジェクトIDと、メールボックスの所有者やメールアドレスが特定されない一意のUUID（例：`353a03f21e534321f5d6e267.sqlite`）を使用しています。

これらのデータベースはそれぞれ、[sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)（[ChaCha20-ポリ1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)）を使用して、あなただけが知っているパスワードで暗号化されています。つまり、メールボックスは個別に暗号化され、自己完結型で、[サンドボックス化された](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)（__PROTECTED_LINK_158__）であり、持ち運び可能です。

次の [PRAGMA](https://www.sqlite.org/pragma.html) を使用して SQLite を微調整しました。

| `PRAGMA` | 目的 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)。詳細については、[Projects](#projects) の `better-sqlite3-multiple-ciphers` を参照してください。 |
| `key="****************"` | これは、メールクライアントのIMAP接続を介して当社のサーバーに渡される、メモリ内でのみ復号化されたパスワードです。読み取りおよび書き込みセッションごとに新しいデータベースインスタンスが作成され、閉じられます（サンドボックス化と分離を確保するため）。 |
| `journal_model=WAL` | 先行書き込みログ ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode)。 |
| `busy_timeout=5000` | 書き込みロック エラーを防止します [while other writes are taking place](https://litestream.io/tips/#busy-timeout)。 |
| `synchronous=NORMAL` | トランザクション [without data corruption risk](https://litestream.io/tips/#synchronous-pragma) の耐久性を向上します。 |
| `foreign_keys=ON` | 外部キー参照 (あるテーブルから別のテーブルへの関係など) が強制されます。[By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html) ですが、検証とデータの整合性のために有効にする必要があります。 |
| `encoding='UTF-8'` | 開発者の健全性を確保するために使用する[Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding)。 |

> その他すべてのデフォルトは、[公式PRAGMAドキュメント](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) で指定された SQLite から取得されます。

### 同時実行 {#concurrency}

> **tldr;** 暗号化された SQLite メールボックスへの同時読み取りと書き込みには `WebSocket` を使用します。

#### 読み取り {#reads}

携帯電話のメール クライアントでは、`imap.forwardemail.net` が Digital Ocean の IP アドレスの 1 つに解決される場合があります。また、デスクトップ クライアントでは、まったく別の [プロバイダー](#providers) から別の IP が解決される場合があります。

メールクライアントがどのIMAPサーバーに接続するかに関わらず、データベースから100%の精度でリアルタイムにデータを読み取ることが求められます。これはWebSocketを通じて実現されます。

#### は {#writes} を書き込みます

データベースへの書き込みは少し異なります。SQLite は埋め込みデータベースであり、メールボックスはデフォルトで 1 つのファイルに保存されるためです。

以下の `litestream`、`rqlite`、`dqlite` などのオプションを検討しましたが、いずれも要件を満たしていませんでした。

先行書き込みログ（「[WAL](https://www.sqlite.org/wal.html)」）を有効にして書き込みを実行するには、1 つのサーバー（「プライマリ」）のみが書き込みを担当するようにする必要があります。[WAL](https://www.sqlite.org/wal.html) は同時実行性を大幅に向上させ、1 つの書き込みと複数の読み取りを可能にします。

プライマリは、暗号化されたメールボックスを含むボリュームがマウントされたデータサーバー上で実行されています。分散の観点から見ると、`imap.forwardemail.net` の背後にあるすべての個々の IMAP サーバーをセカンダリサーバー（「セカンダリ」）と見なすことができます。

[Webソケット](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) との双方向通信を実現します。

* プライマリサーバーは、[ws](https://github.com/websockets/ws) の `WebSocketServer` サーバーのインスタンスを使用します。
* セカンダリサーバーは、[ws](https://github.com/websockets/ws) の `WebSocket` クライアントのインスタンスを使用します。このインスタンスは、[約束通りのWebSocket](https://github.com/vitalets/websocket-as-promised) と [ウェブソケットの再接続](https://github.com/opensumi/reconnecting-websocket) でラップされています。これらの 2 つのラッパーにより、`WebSocket` が再接続され、特定のデータベース書き込みデータの送受信が可能になります。

### バックアップ {#backups}

> **tldr;** 暗号化されたメールボックスのバックアップは毎日作成されます。また、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</a> から、いつでも新しいバックアップをリクエストしたり、最新のバックアップをダウンロードしたりできます。

バックアップは、IMAPコマンド処理中に毎日SQLiteの`VACUUM INTO`コマンドを実行するだけで実行できます。このコマンドは、メモリ内のIMAP接続から暗号化されたパスワードを利用します。既存のバックアップが検出されない場合、または最新のバックアップと比較してファイルの[SHA-256](https://en.wikipedia.org/wiki/SHA-2)ハッシュが変更された場合に、バックアップが保存されます。

組み込みの`backup`コマンドではなく、`VACUUM INTO`コマンドを使用している点にご注意ください。これは、`backup`コマンドの実行中にページが変更された場合、最初からやり直す必要があるためです。`VACUUM INTO`コマンドはスナップショットを取得します。詳細については、[GitHub](https://github.com/benbjohnson/litestream.io/issues/56)と[ハッカーニュース](https://news.ycombinator.com/item?id=31387556)に関するコメントをご覧ください。

さらに、`backup` コマンドは、`rekey` が呼び出されるまで、データベースを短時間暗号化しないままにするため、`backup` ではなく `VACUUM INTO` を使用します (詳細については、この GitHub [コメント](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) を参照してください)。

セカンダリは `WebSocket` 接続を介してプライマリにバックアップの実行を指示します。プライマリはバックアップ実行のコマンドを受信し、その後、次の処理を実行します。

1. 暗号化されたメールボックスに接続します。
2. 書き込みロックを取得します。
3. `wal_checkpoint(PASSIVE)` 経由で WAL チェックポイントを実行します。
4. `VACUUM INTO` SQLite コマンドを実行します。
5. コピーしたファイルが暗号化されたパスワードで開けることを確認します（安全対策/ダミープルーフ）。
6. 保存用に Cloudflare R2 にアップロードします（または、指定されている場合は独自のプロバイダーにアップロードします）。

<!--
7. 作成されたバックアップファイルを `gzip` で圧縮します。
8. 保存用に Cloudflare R2 にアップロードします（または、指定されている場合は独自のプロバイダーにアップロードします）。
-->

メールボックスは暗号化されていることに注意してください。WebSocket 通信には IP 制限やその他の認証手段が講じられていますが、悪意のある攻撃者による攻撃があった場合でも、WebSocket ペイロードに IMAP パスワードが含まれていない限り、データベースを開くことはできませんのでご安心ください。

現時点ではメールボックスごとに 1 つのバックアップのみが保存されますが、将来的にはポイントインタイムリカバリ (「[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)」) が提供される予定です。

### 検索 {#search}

当社の IMAP サーバーは、複雑なクエリ、正規表現などを含む `SEARCH` コマンドをサポートしています。

高速な検索パフォーマンスは、[FTS5](https://www.sqlite.org/fts5.html) と [sqlite正規表現](https://github.com/asg017/sqlite-regex#sqlite-regex) のおかげです。

`Date` の値は、[Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) を介して [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) 文字列として SQLite メールボックスに保存されます (等価比較が適切に機能するために UTC タイムゾーンを使用)。

検索クエリに含まれるすべてのプロパティのインデックスも保存されます。

### プロジェクト {#projects}

以下は、ソース コードと開発プロセスで使用するプロジェクトの概要を示した表です (アルファベット順)。

| プロジェクト | 目的 |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | サーバー群全体を簡単に保守、拡張、管理するための DevOps 自動化プラットフォーム。 |
| [Bree](https://github.com/breejs/bree) | cron、日付、ミリ秒、後で、人間に優しいサポートを備えた Node.js および JavaScript 用のジョブ スケジューラ。 |
| [Cabin](https://github.com/cabinjs/cabin) | セキュリティとプライバシーを考慮した、開発者向けの JavaScript および Node.js ログ ライブラリ。 |
| [Lad](https://github.com/ladjs/lad) | MVC などを使用して、アーキテクチャとエンジニアリング設計全体を強化する Node.js フレームワーク。 |
| [MongoDB](https://www.mongodb.com/) | メールボックス外のその他すべてのデータ (アカウント、設定、ドメイン、エイリアス構成など) を保存するために使用する NoSQL データベース ソリューションです。 |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDBのオブジェクトドキュメントモデリング（ODM）は、私たちのスタック全体で使用されています。特別なヘルパーを作成することで、**MongooseとSQLiteをそのまま使い続けることができます** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js は、すべてのサーバー プロセスを実行するオープン ソースのクロス プラットフォーム JavaScript ランタイム環境です。 |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | メールの送信、接続の作成などを行うNode.jsパッケージです。私たちはこのプロジェクトの公式スポンサーです。 |
| [Redis](https://redis.io/) | キャッシュ、パブリッシュ/サブスクライブ チャネル、DNS over HTTPS リクエスト用のメモリ内データベース。 |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | SQLite の暗号化拡張機能により、データベース ファイル全体 (先行書き込みログ ("[WAL](https://www.sqlite.org/wal.html)")、ジャーナル、ロールバックなどを含む) を暗号化できるようになります。 |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | 開発メールボックスをテスト、ダウンロード、および表示するためのビジュアル SQLite エディター (これも使用できます)。 |
| [SQLite](https://www.sqlite.org/about.html) | スケーラブルで自己完結型、高速で回復力のある IMAP ストレージ用の組み込みデータベース レイヤー。 |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js のスパム対策、電子メール フィルタリング、フィッシング防止ツール ([Spam Assassin](https://spamassassin.apache.org/) および [rspamd](https://github.com/rspamd/rspamd) の代替)。 |
| [Tangerine](https://tangeri.ne) | Node.js を使用した DNS over HTTPS リクエストと Redis を使用したキャッシュにより、グローバルな一貫性などが保証されます。 |
| [Betterbird](https://betterbird.eu/) | 弊社の開発チームは、**Forward Email** で使用する推奨メール クライアントとしてこれを使用 (推奨) しています。 |
| [UTM](https://github.com/utmapp/UTM) | 弊社の開発チームはこれを使用して iOS および macOS 用の仮想マシンを作成し、IMAP および SMTP サーバーでさまざまな電子メール クライアントを (並行して) テストします。 |
| [Ubuntu](https://ubuntu.com/download/server) | 当社のすべてのインフラストラクチャを強化する、最新のオープンソース Linux ベースのサーバー オペレーティング システムです。 |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP サーバー ライブラリ – [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) および [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) に関する注記を参照してください。 |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Node.js が SQLite3 とプログラム的に対話するための高速でシンプルな API ライブラリ。 |
| [email-templates](https://github.com/forwardemail/email-templates) | カスタムメール (アカウント通知など) を作成、プレビュー、送信するための開発者向けのメール フレームワーク。 |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Mongoスタイルの構文を使用したSQLクエリビルダー。これにより、データベースに依存しないアプローチでスタック全体にわたってMongoスタイルで記述し続けることができるため、開発チームの時間を節約できます。**また、クエリパラメータを使用することでSQLインジェクション攻撃を回避するのにも役立ちます。** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | 既存のデータベーススキーマに関する情報を抽出するSQLユーティリティです。これにより、すべてのインデックス、テーブル、列、制約などが有効であり、`1:1` が適切であることを容易に検証できます。さらに、データベーススキーマに変更が加えられた場合に新しい列とインデックスを追加する自動ヘルパーも作成しました（非常に詳細なエラーアラートも表示されます）。 |
| [knex](https://github.com/knex/knex) | `knex-schema-inspector` を介したデータベースの移行とスキーマ検証にのみ使用する SQL クエリ ビルダー。 |
| [mandarin](https://github.com/ladjs/mandarin) | [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) を使用した Markdown をサポートする自動 [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) フレーズ翻訳。 |
| [mx-connect](https://github.com/zone-eu/mx-connect) | MX サーバーとの接続を解決および確立し、エラーを処理する Node.js パッケージ。 |
| [pm2](https://github.com/Unitech/pm2) | ロードバランサーが組み込まれた Node.js プロダクション プロセス マネージャー (パフォーマンスのための [fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214))。 |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP サーバー ライブラリ – メール交換 ("MX") サーバーおよび送信 SMTP サーバーにこれを使用します。 |
| [ImapTest](https://www.imapwiki.org/ImapTest) | IMAPサーバーのベンチマークテストやRFC仕様に基づくIMAPプロトコルの互換性テストに役立つツールです。このプロジェクトは、2002年7月から活動しているオープンソースのIMAPおよびPOP3サーバーである[Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))チームによって作成されました。私たちはこのツールを用いて、IMAPサーバーを徹底的にテストしました。 |

> 私たちが使用している他のプロジェクトは [GitHub上のソースコード](https://github.com/forwardemail) で見つかります。

### プロバイダー {#providers}

| プロバイダー | 目的 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | [Cloudflare R2](https://developers.cloudflare.com/r2) を使用した DNS プロバイダー、ヘルスチェック、ロード バランサー、およびバックアップ ストレージ。 |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | 専用サーバーホスティングと管理データベース。 |
| [Vultr](https://www.vultr.com/?ref=7429848) | 専用サーバーホスティング。 |
| [DataPacket](https://www.datapacket.com) | 専用サーバーホスティング。 |

## 考え {#thoughts}

### 原則 {#principles}

転送メールは、次の原則に従って設計されています。

1. 常に開発者フレンドリーで、セキュリティとプライバシーを重視し、透明性を確保してください。
2. [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)、[Unix](https://en.wikipedia.org/wiki/Unix_philosophy)、[KISS](https://en.wikipedia.org/wiki/KISS_principle)、[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)、[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)、[12ファクター](https://12factor.net/)、[オッカムの剃刀](https://en.wikipedia.org/wiki/Occam%27s_razor)、[ドッグフーディング](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) を遵守してください。
3. 積極的で、自力で開発に取り組んだ、[ラーメン利益](http://www.paulgraham.com/ramenprofitable.html) な開発者をターゲットにしてください。

### 実験 {#experiments}

> **tldr;** 最終的には、S3 互換のオブジェクト ストレージや仮想テーブルの使用は、パフォーマンス上の理由から技術的に実現可能ではなく、メモリ制限によりエラーが発生しやすくなります。

上で説明したように、最終的な SQLite ソリューションに至るまで、いくつかの実験を行ってきました。

その 1 つは、[rclone]() と SQLite を S3 互換のストレージ レイヤーと組み合わせて使用してみることでした。

この実験により、rclone、SQLite、[VFS](https://en.wikipedia.org/wiki/Virtual_file_system) の使用に関するエッジ ケースをさらに理解し、発見することができました。

* rclone で `--vfs-cache-mode writes` フラグを有効にすると、読み取りは正常に動作しますが、書き込みはキャッシュされます。
* 複数の IMAP サーバーがグローバルに分散されている場合、単一の書き込みサーバーと複数のリスナー (pub/sub 方式など) を使用しない限り、サーバー間でキャッシュは無効になります。
* これは非常に複雑であり、このような複雑さをさらに追加すると、単一障害点が増加します。
* S3 互換のストレージプロバイダーは部分的なファイル変更をサポートしていません。つまり、`.sqlite` ファイルに変更を加えると、データベースが完全に変更され、再アップロードされます。
* `rsync` などの他のソリューションもありますが、これらは write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") のサポートに重点を置いていないため、最終的に Litestream を検討することにしました。幸いにも、当社の暗号化機能では既に [WAL](https://www.sqlite.org/wal.html) ファイルが暗号化されているため、Litestream に依存する必要はありません。ただし、Litestream を本番環境で使用した場合の信頼性はまだ高くないため、以下にいくつか注意事項を記載します。
* `--vfs-cache-mode writes` のこのオプション（書き込みに `rclone` ではなく SQLite を使用する唯一の方法）を使用すると、データベース全体をメモリ内に最初からコピーしようとします。10 GB のメールボックス 1 つを処理する場合は問題ありませんが、ストレージ容量が非常に大きい複数のメールボックスを処理すると、IMAP サーバーでメモリ制限が発生し、`ENOMEM` エラー、セグメンテーション違反、データ破損が発生します。
* S3 互換ストレージレイヤーにデータを保存するために SQLite [仮想テーブル](https://www.sqlite.org/vtab.html)（例：[s3db](https://github.com/jrhy/s3db)）を使用しようとすると、さらにいくつかの問題が発生します。
* S3 API エンドポイントに HTTP `.sqlite`0、`.sqlite`1、`.sqlite`2、および `.sqlite`3 メソッドでアクセスする必要があるため、読み取りと書き込みが非常に遅くなります。
* 開発テストでは、光ファイバーインターネットで 50 万～100 万件を超えるレコードを処理する場合、S3 互換プロバイダーへの書き込みと読み取りのスループットによって制限されることが示されました。例えば、当社の開発者は、`.sqlite`4 ループを実行して、順次実行される SQL `.sqlite`5 ステートメントと、大量のデータを一括して書き込むステートメントの両方を実行しました。どちらの場合も、パフォーマンスは驚くほど低下しました。
* 仮想テーブルには**インデックス**、`.sqlite`6 ステートメント、`.sqlite`7 `.sqlite`8 を含めることができません。そのため、データ量によっては 1～2 分以上の遅延が発生します。
* オブジェクトは暗号化されずに保存されており、ネイティブの暗号化サポートはすぐには利用できません。
* また、概念的にも技術的にも前の箇条書きに類似している `.sqlite`9 の使用も検討しました（そのため、同じ問題があります）。可能性としては、`rsync`2 を介して、`rsync`1（上記のソリューションで現在使用しているもの）などの暗号化でラップされたカスタム `rsync`0 ビルドを使用することが挙げられます。
* もう 1 つの可能性として、`rsync`3 を使用することが挙げられますが、これは 32 GB という制限があり、複雑なビルドと開発が必要になります。
* `rsync`4 ステートメントが必要です（そのため、仮想テーブルの使用は完全に除外されます）。`rsync`6 を使用したフックが正しく機能するには、`rsync`5 ステートメントが必要です。これにより、データが破損せず、取得した行が `rsync`7 スキーマ定義（制約、変数型、任意のデータ検証を含む）に従って有効なドキュメントに変換されることが保証されます。
* オープンソースコミュニティにおける SQLite 関連の S3 互換プロジェクトはほぼすべて Python で作成されています（スタックの 100% で使用されている JavaScript ではありません）。
* `rsync`8（`rsync`9 を参照）などの圧縮ライブラリは有望に見えますが、__PROTECTED_LINK_189__0 は期待できません。代わりに、__PROTECTED_LINK_189__1、__PROTECTED_LINK_189__2、__PROTECTED_LINK_189__3、__PROTECTED_LINK_189__4、__PROTECTED_LINK_189__5、__PROTECTED_LINK_189__6 などのデータ型をアプリケーション側で圧縮する方が、よりクリーンで容易なアプローチとなります（また、__PROTECTED_LINK_189__7 フラグまたは列を保存したり、圧縮の場合は __PROTECTED_LINK_189__8 または __PROTECTED_LINK_189__9、非圧縮の場合は __PROTECTED_LINK_190__0 をデータベース メタデータとして使用したりできるため、移行も容易です）。
* 幸いなことに、IMAP サーバー ストレージには添付ファイルの重複排除が既に実装されているため、同じ添付ファイルを持つすべてのメッセージに添付ファイルのコピーが保存されることはありません。代わりに、メールボックス内の複数のメッセージとスレッドに対して 1 つの添付ファイルが保存されます（その後、外部参照が使用されます）。
* SQLite のレプリケーションおよびバックアップソリューションである Litestream プロジェクトは非常に有望であり、将来的にも活用する可能性が高いでしょう。
* 作者を非難するつもりはありません。10 年以上にわたり、彼らの取り組みとオープンソースへの貢献を高く評価しているからです。しかし、実際の使用状況から判断すると、__PROTECTED_LINK_190__1 と __PROTECTED_LINK_190__2 が存在するようです。
* バックアップの復元は、スムーズで簡単なものでなければなりません。MongoDB などのソリューションを __PROTECTED_LINK_190__3 と __PROTECTED_LINK_190__4 と共に使用するのは、面倒なだけでなく、時間がかかり、設定も複雑です。
* SQLite データベースはこれをシンプルにします（単一ファイルです）。
* ユーザーがいつでもメールボックスを持ち出して離れることができるソリューションを設計したいと考えました。
* __PROTECTED_LINK_190__5 にシンプルな Node.js コマンドを実行すると、ディスクストレージから完全に消去されます。
* 同様に、HTTP __PROTECTED_LINK_190__6 を使用した S3 互換 API を使用すると、ユーザーのスナップショットとバックアップを簡単に削除できます。
* SQLite は、最もシンプルで高速かつコスト効率の高いソリューションでした。

### 代替手段がない {#lack-of-alternatives}

私たちの知る限り、他の電子メール サービスはこのように設計されておらず、オープン ソースでもありません。

これは、既存の電子メール サービスで [スパゲッティコード](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: を使用したレガシー テクノロジーが運用されていることが原因であると *考えられます*。

既存の電子メール サービス プロバイダーのほとんどは、クローズド ソースであるか、オープン ソースとして宣伝されていますが、**実際にはフロントエンドのみがオープン ソースです。**

**電子メールの最も機密性の高い部分** (実際のストレージ/IMAP/SMTP のやり取り) は、**すべてバックエンド (サーバー) で実行され、フロントエンド (クライアント) では実行されません**。

### メール転送を試す {#try-out-forward-email}

今すぐ <https://forwardemail.net>! :rocket: にサインアップしてください