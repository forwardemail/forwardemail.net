# 量子耐性メール：暗号化されたSQLiteメールボックスを使ってあなたのメールを安全に保つ方法 {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="量子安全な暗号化メールサービスのイラスト" class="rounded-lg" />


## 目次 {#table-of-contents}

* [序文](#foreword)
* [メールサービスプロバイダー比較](#email-service-provider-comparison)
* [仕組み](#how-does-it-work)
* [技術](#technologies)
  * [データベース](#databases)
  * [セキュリティ](#security)
  * [メールボックス](#mailboxes)
  * [同時実行](#concurrency)
  * [バックアップ](#backups)
  * [検索](#search)
  * [プロジェクト](#projects)
  * [プロバイダー](#providers)
* [考察](#thoughts)
  * [原則](#principles)
  * [実験](#experiments)
  * [代替手段の欠如](#lack-of-alternatives)
  * [Forward Emailを試す](#try-out-forward-email)


## 序文 {#foreword}

> \[!IMPORTANT]
> 私たちのメールサービスは[100%オープンソース](https://github.com/forwardemail)であり、安全かつ暗号化されたSQLiteメールボックスを通じてプライバシーに配慮しています。

[IMAPサポート](/faq#do-you-support-receiving-email-with-imap)を開始するまでは、永続的なデータストレージにはMongoDBを使用していました。

この技術は素晴らしく、現在も使用していますが、MongoDBでの保存時暗号化を利用するには、Digital OceanやMongo AtlasのようなMongoDB Enterpriseを提供するプロバイダーを使うか、エンタープライズライセンスを購入する必要があります（その場合、営業チームとのやり取りに時間がかかります）。

[Forward Email](https://forwardemail.net)のチームは、IMAPメールボックス用に開発者に優しく、スケーラブルで信頼性が高く、暗号化されたストレージソリューションを必要としていました。オープンソース開発者として、保存時暗号化機能を得るためにライセンス料を支払う必要がある技術を使うことは[私たちの原則](#principles)に反するため、これらのニーズを解決するために新しいソリューションを一から研究・開発しました。

共有データベースを使ってメールボックスを保存する代わりに、私たちはあなたのパスワード（あなただけが知っている）で個別にメールボックスを保存し暗号化しています。**私たちのメールサービスは非常に安全で、パスワードを忘れるとメールボックスを失います**（オフラインバックアップで復元するか、最初からやり直す必要があります）。

以下で、[メールサービスプロバイダーの比較](#email-service-provider-comparison)、[サービスの仕組み](#how-does-it-work)、[技術スタック](#technologies)などを詳しく解説します。


## メールサービスプロバイダー比較 {#email-service-provider-comparison}

私たちは、個別に暗号化されたSQLiteメールボックスを保存し、無制限のドメイン、エイリアス、ユーザーを提供し、送信SMTP、IMAP、POP3をサポートする唯一の100%オープンソースかつプライバシー重視のメールサービスプロバイダーです。

**他のメールプロバイダーとは異なり、Forward Emailではドメインやエイリアスごとにストレージ料金を支払う必要はありません。** ストレージはアカウント全体で共有されるため、複数のカスタムドメイン名やそれぞれに複数のエイリアスがある場合に最適なソリューションです。必要に応じて、ドメインやエイリアスごとにストレージ制限を設定することも可能です。

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">メールサービス比較を読む <i class="fa fa-search-plus"></i></a>


## 仕組み {#how-does-it-work}

1. Apple Mail、Thunderbird、Gmail、Outlookなどのメールクライアントを使い、ユーザー名とパスワードで私たちの安全な[IMAP](/faq#do-you-support-receiving-email-with-imap)サーバーに接続します：

   * ユーザー名は `hello@example.com` のようにドメインを含むフルエイリアスです。
   * パスワードはランダムに生成され、<strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong>をクリックすると30秒間だけ表示されます。場所は<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスです。
2. 接続が確立されると、あなたのメールクライアントは[IMAPプロトコルコマンド](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)を当社のIMAPサーバーに送信し、メールボックスを同期状態に保ちます。これには、下書きメールの作成・保存や、メールに「重要」ラベルを付けたり、スパム/迷惑メールとしてフラグを立てたりするなどの操作が含まれます。

3. メール交換サーバー（一般に「MX」サーバーと呼ばれます）は、新しい受信メールを受け取り、あなたのメールボックスに保存します。これが行われると、あなたのメールクライアントに通知が届き、メールボックスが同期されます。当社のメール交換サーバーは、あなたのメールを1人以上の受信者（[webhooks](/faq#do-you-support-webhooks)を含む）に転送したり、暗号化されたIMAPストレージに保存したり、**その両方を行うことができます**！

   > \[!TIP]
   > 詳しく知りたいですか？[メール転送の設定方法](/faq#how-do-i-get-started-and-set-up-email-forwarding)、[当社のメール交換サービスの仕組み](/faq#how-does-your-email-forwarding-system-work)、または[当社のガイド](/guides)をお読みください。

4. 裏側では、当社の安全なメールストレージ設計は、あなたのメールボックスを暗号化し、あなただけがアクセスできるようにするために2つの方法で機能しています：

   * 送信者からあなた宛に新しいメールが届くと、当社のメール交換サーバーはあなた専用の一時的で暗号化された個別のメールボックスに書き込みます。

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: あなたのエイリアス宛の受信メッセージを受け取る（例: you@yourdomain.com）。
         MX->>SQLite: メッセージを一時的なメールボックスに保存。
         Note over MX,SQLite: 設定された他の受信者やwebhooksに転送。
         MX->>Sender: 成功！
     ```

   * あなたがメールクライアントで当社のIMAPサーバーに接続すると、あなたのパスワードはメモリ内で暗号化され、メールボックスの読み書きに使用されます。メールボックスはこのパスワードでのみ読み書き可能です。あなたがこのパスワードを唯一知っているため、**あなた以外はアクセスできません**。次にメールクライアントがメールのポーリングや同期を試みる際、新しいメッセージはこの一時的なメールボックスから転送され、あなたが提供したパスワードを使って実際のメールボックスファイルに保存されます。この一時的なメールボックスはその後消去・削除されるため、メッセージはパスワードで保護されたメールボックスにのみ存在します。

   * **IMAPに接続している場合（例：Apple MailやThunderbirdなどのメールクライアントを使用している場合）、一時的なディスクストレージに書き込む必要はありません。代わりに、メモリ内で暗号化されたIMAPパスワードが取得され使用されます。リアルタイムでメッセージが配信されようとするとき、すべてのIMAPサーバーに対してWebSocketリクエストを送り、あなたのアクティブなセッションがあるか確認します（これが取得部分です）。その後、暗号化されたメモリ内パスワードを渡すため、一時的なメールボックスに書き込む必要はなく、暗号化されたパスワードを使って実際の暗号化メールボックスに書き込むことができます。**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: メールクライアントを使ってIMAPサーバーに接続。
         IMAP->>SQLite: 一時的なメールボックスからあなたのエイリアスのメールボックスへメッセージを転送。
         Note over IMAP,SQLite: あなたのエイリアスのメールボックスはIMAPパスワードを使ったメモリ内のみで利用可能。
         SQLite->>IMAP: メールクライアントの要求に応じてメッセージを取得。
         IMAP->>You: 成功！
     ```

5. [暗号化されたメールボックスのバックアップ](#backups)は毎日作成されます。いつでも新しいバックアップをリクエストしたり、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス</a>から最新のバックアップをダウンロードすることも可能です。別のメールサービスに切り替える場合でも、メールボックスやバックアップの移行、ダウンロード、エクスポート、削除をいつでも簡単に行えます。


## 技術 {#technologies}

### データベース {#databases}

他のデータベースストレージ層も検討しましたが、SQLiteほど当社の要件を満たすものはありませんでした：
| Database                                               |                                                                    Encryption-at-rest                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Mailboxes  |                           License                           | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) で対応済み                          |                                  :white_check_mark:                                  |               :white_check_mark: パブリックドメイン              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["MongoDB Enterpriseのみで利用可能"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: リレーショナルデータベース                               |                   :x: AGPL および `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [ネットワークのみ](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: リレーショナルデータベース                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [未検証かつ未対応？](https://github.com/canonical/dqlite/issues/32)                                  | :x: [未検証かつ未対応？](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [対応済み](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: リレーショナルデータベース                               | :white_check_mark: `PostgreSQL` （`BSD` または `MIT` に類似） |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [InnoDBのみ対応](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: リレーショナルデータベース                               |          :white_check_mark: `GPLv2` および `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Enterprise限定機能](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: リレーショナルデータベース                               |                  :x: `BUSL-1.1` など                  |                             :x:                             |

> こちらは上記の表にある複数のSQLiteデータベースストレージオプションを比較した[ブログ記事](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/)です。

### セキュリティ {#security}

常に [encryption-at-rest](https://en.wikipedia.org/wiki/Data_at_rest)（[AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)）、[encryption-in-transit](https://en.wikipedia.org/wiki/Data_in_transit)（[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)）、:tangerine: [Tangerine](https://tangeri.ne) を使った [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（「DoH」）、およびメールボックスに対して [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)（[ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)）暗号化を使用しています。さらに、トークンベースの二要素認証（[中間者攻撃](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)の影響を受けやすいSMSではなく）、ルートアクセスを無効化したSSHキーのローテーション、制限されたIPアドレスからのサーバーへの排他的アクセスなども実施しています。
[悪意のあるメイド攻撃](https://en.wikipedia.org/wiki/Evil_maid_attack)やサードパーティのベンダーからの不正な従業員が発生した場合でも、**あなたのメールボックスはあなたが生成したパスワードでのみ開くことができます**。ご安心ください。当社はCloudflare、DataPacket、Digital Ocean、GitHub、VultrのSOCタイプ2準拠のサーバープロバイダー以外のサードパーティベンダーには依存していません。

当社の目標は、[単一障害点](https://en.wikipedia.org/wiki/Single_point_of_failure)をできるだけ少なくすることです。

### メールボックス {#mailboxes}

> **要約;** 当社のIMAPサーバーは、各メールボックスごとに個別に暗号化されたSQLiteデータベースを使用しています。

[SQLiteは非常に人気のある](https://www.sqlite.org/mostdeployed.html)組み込みデータベースで、現在あなたのスマートフォンやコンピューターで動作しており、[ほぼすべての主要技術で使用されています](https://www.sqlite.org/famous.html)。

例えば、当社の暗号化されたサーバー上には、`linux@example.com`、`info@example.com`、`hello@example.com`などのSQLiteデータベースメールボックスがあり、それぞれが`.sqlite`データベースファイルとして存在します。データベースファイル名はメールアドレスではなく、BSON ObjectIDやユニークなUUIDを使用しており、どのメールボックスに属するかやメールアドレスが何であるかは特定できません（例：`353a03f21e534321f5d6e267.sqlite`）。

これらの各データベースは、あなたのパスワード（あなただけが知っている）を使って[sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)（[ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)）で暗号化されています。つまり、あなたのメールボックスは個別に暗号化され、自己完結型で、[サンドボックス化](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))されており、ポータブルです。

当社は以下の[PRAGMA](https://www.sqlite.org/pragma.html)でSQLiteを最適化しています：

| `PRAGMA`                 | 目的                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLiteデータベース暗号化](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)。詳細は[Projects](#projects)の`better-sqlite3-multiple-ciphers`を参照してください。                                         |
| `key="****************"` | これはあなたのメールクライアントのIMAP接続を通じて当社サーバーに渡される、メモリ上でのみ復号されたパスワードです。読み書きセッションごとに新しいデータベースインスタンスが作成・閉鎖され、サンドボックス化と分離を保証します。           |
| `journal_mode=WAL`       | 書き込み先行ログ（"[WAL](https://www.sqlite.org/wal.html)") [でパフォーマンスを向上させ、同時読み取りアクセスを可能にします](https://litestream.io/tips/#wal-journal-mode)。                                                                                   |
| `busy_timeout=5000`      | 書き込み中のロックエラーを防止します。[他の書き込みが行われている間](https://litestream.io/tips/#busy-timeout)。                                                                                                                                          |
| `synchronous=NORMAL`     | トランザクションの耐久性を高め、[データ破損のリスクを減らします](https://litestream.io/tips/#synchronous-pragma)。                                                                                                                                       |
| `foreign_keys=ON`        | 外部キー参照（例：あるテーブルから別のテーブルへの関係）を強制します。[SQLiteではデフォルトで無効](https://www.sqlite.org/foreignkeys.html)ですが、検証とデータ整合性のために有効にすべきです。                                                       |
| `encoding='UTF-8'`       | 開発者の利便性を確保するための[デフォルトエンコーディング](https://www.sqlite.org/pragma.html#pragma_encoding)。                                                                                                                                            |
> その他のデフォルト設定は、[公式PRAGMAドキュメント](https://www.sqlite.org/pragma.html#pragma_auto_vacuum)に記載されているSQLiteの仕様に準じます。

### 同時実行 {#concurrency}

> **要約;** 暗号化されたSQLiteメールボックスへの同時読み書きには `WebSocket` を使用しています。

#### 読み取り {#reads}

携帯のメールクライアントは `imap.forwardemail.net` を当社のDigital OceanのIPアドレスのいずれかに解決することがあり、デスクトップクライアントは別の[プロバイダー](#providers)の異なるIPを解決する場合があります。

どのIMAPサーバーに接続しても、データベースからリアルタイムかつ100%正確に読み取れる接続を目指しています。これはWebSocketを通じて実現しています。

#### 書き込み {#writes}

データベースへの書き込みは少し異なります。SQLiteは組み込みデータベースであり、メールボックスはデフォルトで単一ファイルに格納されているためです。

`litestream`、`rqlite`、`dqlite`などの選択肢を検討しましたが、いずれも要件を満たしませんでした。

書き込み先行ログ（"[WAL](https://www.sqlite.org/wal.html)"）を有効にした状態で書き込みを行うには、1台のサーバー（「プライマリ」）のみが担当する必要があります。[WAL](https://www.sqlite.org/wal.html)は同時実行を大幅に高速化し、1つの書き込みと複数の読み取りを可能にします。

プライマリは暗号化されたメールボックスを含むマウント済みボリュームを持つデータサーバー上で稼働しています。配布の観点からは、`imap.forwardemail.net`の背後にある個々のIMAPサーバーはすべてセカンダリサーバー（「セカンダリ」）と考えることができます。

双方向通信は[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)で実現しています：

* プライマリサーバーは[ws](https://github.com/websockets/ws)の `WebSocketServer` サーバーインスタンスを使用。
* セカンダリサーバーは[ws](https://github.com/websockets/ws)の `WebSocket` クライアントインスタンスを使用し、[websocket-as-promised](https://github.com/vitalets/websocket-as-promised) と [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) でラップしています。これら2つのラッパーは `WebSocket` の再接続を保証し、特定のデータベース書き込みのための送受信を可能にします。

### バックアップ {#backups}

> **要約;** 暗号化されたメールボックスのバックアップは毎日作成されます。いつでも <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス から新しいバックアップの即時リクエストや最新バックアップのダウンロードが可能です。

バックアップは、IMAPコマンド処理中に毎日SQLiteの `VACUUM INTO` コマンドを実行して行います。これはメモリ内IMAP接続からの暗号化パスワードを利用しています。既存のバックアップが検出されない場合、またはファイルの[SHA-256](https://en.wikipedia.org/wiki/SHA-2)ハッシュが最新バックアップと異なる場合にバックアップを保存します。

`backup` コマンドではなく `VACUUM INTO` コマンドを使用する理由は、`backup` コマンド実行中にページが変更されると最初からやり直す必要があるためです。`VACUUM INTO` コマンドはスナップショットを取得します。詳細は[GitHub](https://github.com/benbjohnson/litestream.io/issues/56)や[Hacker News](https://news.ycombinator.com/item?id=31387556)のコメントを参照してください。

さらに、`backup` コマンドは `rekey` が呼ばれるまでの間、データベースが一時的に暗号化されていない状態になるため、`VACUUM INTO` を使用しています（詳細はこのGitHubの[コメント](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)を参照）。

セカンダリは `WebSocket` 接続を通じてプライマリにバックアップ実行を指示し、プライマリは以下の処理を行います：

1. 暗号化されたメールボックスに接続。
2. 書き込みロックを取得。
3. `wal_checkpoint(PASSIVE)` によるWALチェックポイントを実行。
4. SQLiteの `VACUUM INTO` コマンドを実行。
5. コピーされたファイルが暗号化パスワードで開けることを確認（安全対策）。
6. Cloudflare R2（または指定された場合は独自のプロバイダー）にアップロードして保存。
<!--
7. 圧縮されたバックアップファイルを `gzip` で圧縮します。
8. Cloudflare R2 にアップロードして保存します（指定があればご自身のプロバイダーでも可）。
-->

メールボックスは暗号化されていることを忘れないでください。WebSocket通信にはIP制限やその他の認証手段を設けていますが、不正な行為者がいた場合でも、WebSocketのペイロードにIMAPパスワードが含まれていなければ、データベースを開くことはできませんのでご安心ください。

現時点ではメールボックスごとにバックアップは1つだけ保存されていますが、将来的にはポイントインタイムリカバリー（"[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)"）を提供する可能性があります。

### 検索 {#search}

当社のIMAPサーバーは複雑なクエリや正規表現などを用いた `SEARCH` コマンドをサポートしています。

高速な検索性能は [FTS5](https://www.sqlite.org/fts5.html) と [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) によるものです。

SQLiteのメールボックス内では `Date` 値を [ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601) 形式の文字列として [Date.prototype.toISOString](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)（UTCタイムゾーンで、等価比較が正しく機能するように）を使って保存しています。

検索クエリに含まれるすべてのプロパティに対してインデックスも保存されています。

### プロジェクト {#projects}

以下は当社のソースコードおよび開発プロセスで使用しているプロジェクトの一覧表です（アルファベット順）：

| プロジェクト                                                                                 | 目的                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | サーバー群の保守、スケーリング、管理を容易にするDevOps自動化プラットフォーム。                                                                                                                                                                                                                                                                                     |
| [Bree](https://github.com/breejs/bree)                                                        | cron、日付、ms、later、ユーザーフレンドリーなサポートを備えたNode.jsおよびJavaScript用ジョブスケジューラ。                                                                                                                                                                                                                                                        |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | セキュリティとプライバシーを考慮した開発者向けJavaScriptおよびNode.jsロギングライブラリ。                                                                                                                                                                                                                                                                           |
| [Lad](https://github.com/ladjs/lad)                                                           | MVCなどを備えた当社のアーキテクチャとエンジニアリング設計を支えるNode.jsフレームワーク。                                                                                                                                                                                                                                                                           |
| [MongoDB](https://www.mongodb.com/)                                                           | メールボックス以外のすべてのデータ（アカウント、設定、ドメイン、エイリアス設定など）を保存するためのNoSQLデータベースソリューション。                                                                                                                                                                                                                              |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | 当社のスタック全体で使用しているMongoDBのオブジェクトドキュメントモデリング（ODM）。SQLiteでも**Mongooseを使い続けられる**ように特別なヘルパーを作成しました :tada:                                                                                                                                                                                         |
| [Node.js](https://nodejs.org/en)                                                              | 当社のすべてのサーバープロセスを実行するオープンソースのクロスプラットフォームJavaScriptランタイム環境。                                                                                                                                                                                                                                                        |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | メール送信や接続作成などのためのNode.jsパッケージ。当社はこのプロジェクトの公式スポンサーです。                                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                    | キャッシュ、パブリッシュ/サブスクライブチャネル、DNS over HTTPSリクエスト用のインメモリデータベース。                                                                                                                                                                                                                                                             |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | SQLiteの暗号化拡張機能で、データベースファイル全体（書き込み先行ログ（"[WAL](https://www.sqlite.org/wal.html)"）、ジャーナル、ロールバックなどを含む）を暗号化可能にします。                                                                                                                                                                                     |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | 開発用メールボックスのテスト、ダウンロード、閲覧に使えるビジュアルSQLiteエディタ（ご自身でも使用可能）。                                                                                                                                                                                                                                                           |
| [SQLite](https://www.sqlite.org/about.html)                                                   | スケーラブルで自己完結型、高速かつ堅牢なIMAPストレージのための組み込みデータベース層。                                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.jsベースのアンチスパム、メールフィルタリング、フィッシング防止ツール（[Spam Assassin](https://spamassassin.apache.org/)や[rspamd](https://github.com/rspamd/rspamd)の代替）。                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                               | Node.jsでのDNS over HTTPSリクエストとRedisを使ったキャッシュにより、グローバルな一貫性などを実現。                                                                                                                                                                                                                                                               |
| [Thunderbird](https://www.thunderbird.net/)                                                   | 当社開発チームが使用し、Forward Emailと共に使う推奨メールクライアント。                                                                                                                                                                                                                                                                                            |
| [UTM](https://github.com/utmapp/UTM)                                                          | 当社開発チームがiOSおよびmacOSで仮想マシンを作成し、IMAPおよびSMTPサーバーと並行して異なるメールクライアントをテストするために使用。                                                                                                                                                                                                                              |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | 当社のインフラ全体を支えるモダンなオープンソースLinuxベースのサーバーOS。                                                                                                                                                                                                                                                                                          |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAPサーバーライブラリ。添付ファイルの重複排除に関するノートは[こちら](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md)、IMAPプロトコルサポートは[こちら](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md)を参照。                                                                                  |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Node.jsでSQLite3をプログラム的に操作するための高速かつシンプルなAPIライブラリ。                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                            | 開発者向けのメールフレームワークで、カスタムメール（アカウント通知など）の作成、プレビュー、送信を支援。                                                                                                                                                                                                                                                             |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | Mongoスタイルの構文を使ったSQLクエリビルダー。スタック全体でMongoスタイルの記述を続けられ、データベースに依存しないアプローチを可能にします。**クエリパラメータを使うことでSQLインジェクション攻撃も防止します。**                                                                                                                                    |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | 既存のデータベーススキーマ情報を抽出するSQLユーティリティ。すべてのインデックス、テーブル、カラム、制約などが正しく`1:1`であることを簡単に検証できます。スキーマ変更時には新しいカラムやインデックスを追加する自動ヘルパーも作成しており、詳細なエラー通知も備えています。                                                                                   |
| [knex](https://github.com/knex/knex)                                                          | データベースマイグレーションと`knex-schema-inspector`によるスキーマ検証にのみ使用するSQLクエリビルダー。                                                                                                                                                                                                                                                           |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Markdown対応の自動[i18n](https://ja.wikipedia.org/wiki/国際化)フレーズ翻訳ツールで、[Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest)を利用。                                                                                                                                                                                     |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | MXサーバーの解決と接続確立、エラー処理を行うNode.jsパッケージ。                                                                                                                                                                                                                                                                                                  |
| [pm2](https://github.com/Unitech/pm2)                                                         | 組み込みロードバランサーを備えたNode.jsのプロダクションプロセスマネージャー（パフォーマンス向けに[微調整済み](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214)）。                                                                                                                                                                               |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTPサーバーライブラリ。当社のメール交換（"MX"）および送信SMTPサーバーに使用。                                                                                                                                                                                                                                                                                      |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | IMAPサーバーのベンチマークおよびRFC仕様のIMAPプロトコル互換性テストに役立つツール。このプロジェクトは[Dovecot](https://ja.wikipedia.org/wiki/Dovecot)チームによって作成されました（2002年7月からの活発なオープンソースIMAPおよびPOP3サーバー）。当社のIMAPサーバーはこのツールで徹底的にテストしています。                                    |
> 他に使用しているプロジェクトは[GitHubのソースコード](https://github.com/forwardemail)でご覧いただけます。

### プロバイダー {#providers}

| プロバイダー                                      | 用途                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNSプロバイダー、ヘルスチェック、ロードバランサー、および[Cloudflare R2](https://developers.cloudflare.com/r2)を使用したバックアップストレージ。 |
| [GitHub](https://github.com/)                   | ソースコードホスティング、CI/CD、およびプロジェクト管理。                                                                    |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | 専用サーバーホスティングおよびマネージドデータベース。                                                                        |
| [Vultr](https://www.vultr.com/?ref=7429848)     | 専用サーバーホスティング。                                                                                                  |
| [DataPacket](https://www.datapacket.com)        | 専用サーバーホスティング。                                                                                                  |


## 考え方 {#thoughts}

### 原則 {#principles}

Forward Emailは以下の原則に基づいて設計されています：

1. 常に開発者に優しく、セキュリティとプライバシーに重点を置き、透明性を保つこと。
2. [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)、[Unix](https://en.wikipedia.org/wiki/Unix_philosophy)、[KISS](https://en.wikipedia.org/wiki/KISS_principle)、[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)、[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)、[Twelve Factor](https://12factor.net/)、[オッカムの剃刀](https://en.wikipedia.org/wiki/Occam%27s_razor)、および[ドッグフーディング](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)を遵守すること。
3. スクラップでブートストラップされた、[ラーメン収益化](http://www.paulgraham.com/ramenprofitable.html)している開発者をターゲットにすること。

### 実験 {#experiments}

> **要約;** 最終的にS3互換のオブジェクトストレージおよび/またはVirtual Tablesの使用は、パフォーマンス上の理由で技術的に実現不可能であり、メモリ制限によるエラーが発生しやすいことがわかりました。

上記で説明した最終的なSQLiteソリューションに至るまでにいくつかの実験を行いました。

その一つは、[rclone]()とSQLiteをS3互換のストレージレイヤーと組み合わせて使用する試みでした。

この実験により、rclone、SQLite、および[VFS](https://en.wikipedia.org/wiki/Virtual_file_system)の使用に関するエッジケースをさらに理解し発見しました：

* rcloneで`--vfs-cache-mode writes`フラグを有効にすると、読み取りは問題ありませんが、書き込みはキャッシュされます。
  * 複数のIMAPサーバーがグローバルに分散している場合、単一の書き込み者と複数のリスナー（例：pub/sub方式）がない限り、キャッシュはそれらの間で無効になります。
  * これは非常に複雑であり、このような追加の複雑さは単一障害点を増やす結果になります。
  * S3互換のストレージプロバイダーは部分的なファイル変更をサポートしていません。つまり、`.sqlite`ファイルの変更はデータベース全体の変更と再アップロードを意味します。
  * `rsync`のような他のソリューションもありますが、書き込み先読みログ（"[WAL](https://www.sqlite.org/wal.html)")のサポートに焦点を当てていません。そのためLitestreamを検討しました。幸いにも、当社の暗号化はすでに[WAL](https://www.sqlite.org/wal.html)ファイルを暗号化しているため、Litestreamに依存する必要はありません。ただし、Litestreamの本番利用にはまだ自信がなく、以下にいくつかの注意点があります。
  * `--vfs-cache-mode writes`オプション（rclone経由でSQLiteを書き込み可能にする*唯一の*方法）を使用すると、データベース全体をメモリ上で最初からコピーしようとします。10GBのメールボックス1つなら問題ありませんが、非常に大容量の複数メールボックスを扱うとIMAPサーバーがメモリ制限や`ENOMEM`エラー、セグメンテーションフォルト、データ破損に直面します。
* SQLiteの[Virtual Tables](https://www.sqlite.org/vtab.html)（例：[s3db](https://github.com/jrhy/s3db)の使用）を使ってデータをS3互換ストレージ上に置こうとすると、さらに多くの問題が発生します：
  * 読み書きが非常に遅くなります。S3 APIエンドポイントにHTTPの`GET`、`PUT`、`HEAD`、`POST`メソッドでアクセスする必要があるためです。
  * 開発テストでは、ファイバーインターネット環境で50万〜100万件以上のレコードを超えると、S3互換プロバイダーへの読み書きスループットがボトルネックになります。例えば、開発者が連続したSQLの`INSERT`文や大量データのバルク書き込みを`for`ループで実行しましたが、いずれも非常に遅いパフォーマンスでした。
  * Virtual Tablesは**インデックス**、`ALTER TABLE`文、および[その他](https://stackoverflow.com/a/12507650)の[制限](https://sqlite.org/lang_createvtab.html)があり、データ量に応じて1〜2分以上の遅延が発生します。
  * オブジェクトは暗号化されず、ネイティブの暗号化サポートもありません。
* [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs)も検討しましたが、前述の問題と同様の技術的・概念的課題があります。カスタム`sqlite3`ビルドを暗号化ラップする（例：[wxSQLite3](https://github.com/utelle/wxsqlite3)、当社が上記ソリューションで使用中）方法もありますが、[セットアップファイルの編集](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276)が必要です。
* もう一つの可能なアプローチは[multiplex extension](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c)の使用ですが、32GBの制限があり、複雑なビルドと開発上の問題が伴います。
* `ALTER TABLE`文は必須です（したがってVirtual Tablesの使用は完全に除外されます）。`knex-schema-inspector`とのフックが正しく動作するために必要であり、これによりデータ破損を防ぎ、取得した行を`mongoose`スキーマ定義（制約、変数型、任意のデータ検証を含む）に従った有効なドキュメントに変換できます。
* SQLiteに関連するS3互換プロジェクトのほとんどはPythonで書かれており、当社のスタックの100%を占めるJavaScriptではありません。
* [sqlite-zstd](https://github.com/phiresky/sqlite-zstd)のような圧縮ライブラリ（[コメント](https://news.ycombinator.com/item?id=32303762)参照）は有望ですが、[まだ本番利用には準備ができていない可能性があります](https://github.com/phiresky/sqlite-zstd#usage)。代わりに、`String`、`Object`、`Map`、`Array`、`Set`、`Buffer`などのデータ型に対するアプリケーション側の圧縮がよりクリーンで簡単なアプローチです（移行も容易で、`Boolean`フラグやカラム、あるいは`PRAGMA`の`user_version=1`（圧縮あり）と`user_version=0`（圧縮なし）をデータベースメタデータとして使えます）。
  * 幸いにも、IMAPサーバーストレージには添付ファイルの重複排除が実装されており、同じ添付ファイルを持つメッセージは添付ファイルのコピーを保持せず、単一の添付ファイルを複数のメッセージやスレッドで共有し、外部参照を使用しています。
* SQLiteのレプリケーションおよびバックアップソリューションであるLitestreamは非常に有望であり、将来的に使用する可能性が高いです。
  * 作者を軽視する意図はありません。彼らのオープンソースへの10年以上にわたる貢献を尊敬していますが、実際の使用では[多くの問題](https://github.com/benbjohnson/litestream/issues)や[データ損失の可能性](https://github.com/benbjohnson/litestream/issues/218)が報告されています。
* バックアップの復元は摩擦なく簡単である必要があります。MongoDBの`mongodump`や`mongoexport`のようなソリューションは面倒で時間がかかり、設定も複雑です。
  * SQLiteデータベースは単一ファイルなので簡単です。
  * ユーザーがいつでも自分のメールボックスを持ち出せる設計にしたかった。
    * シンプルなNode.jsコマンドで`fs.unlink('mailbox.sqlite')`を実行すれば、ディスクストレージから完全に削除されます。
    * 同様にS3互換APIのHTTP `DELETE`を使って、ユーザーのスナップショットやバックアップを簡単に削除できます。
  * SQLiteは最もシンプルで高速かつコスト効率の良いソリューションでした。
### 代替手段の欠如 {#lack-of-alternatives}

私たちの知る限り、他のメールサービスでこのように設計されているものはなく、オープンソースでもありません。

これは既存のメールサービスが[スパゲッティコード](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: を含むレガシー技術を本番環境で使用しているためだと*考えられます*。

既存のメールサービスプロバイダーのほとんどはクローズドソースであるか、オープンソースとして宣伝していますが、**実際にはフロントエンドのみがオープンソースです。**

**メールの最も重要な部分**（実際のストレージ/IMAP/SMTPのやり取り）は**すべてバックエンド（サーバー）で行われており、フロントエンド（クライアント）では*ありません***。

### Forward Emailを試してみる {#try-out-forward-email}

今すぐ <https://forwardemail.net> に登録しましょう！ :rocket:
