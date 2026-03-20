# プライバシーポリシー {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />


## 目次 {#table-of-contents}

* [免責事項](#disclaimer)
* [収集しない情報](#information-not-collected)
* [収集する情報](#information-collected)
  * [アカウント情報](#account-information)
  * [メールの保存](#email-storage)
  * [エラーログ](#error-logs)
  * [送信SMTPメール](#outbound-smtp-emails)
* [一時的なデータ処理](#temporary-data-processing)
  * [レート制限](#rate-limiting)
  * [接続追跡](#connection-tracking)
  * [認証試行](#authentication-attempts)
* [監査ログ](#audit-logs)
  * [アカウント変更](#account-changes)
  * [ドメイン設定の変更](#domain-settings-changes)
* [クッキーとセッション](#cookies-and-sessions)
* [分析](#analytics)
* [共有される情報](#information-shared)
* [情報の削除](#information-removal)
* [追加の開示事項](#additional-disclosures)


## 免責事項 {#disclaimer}

サイト全体に適用されるため、当社の[利用規約](/terms)をご参照ください。


## 収集しない情報 {#information-not-collected}

**[エラーログ](#error-logs)、[送信SMTPメール](#outbound-smtp-emails)、およびスパムや悪意のある活動が検出された場合（例：レート制限のため）を除き：**

* 転送されたメールをディスクストレージやデータベースに保存しません。
* 転送されたメールのメタデータをディスクストレージやデータベースに保存しません。
* ログやIPアドレスをディスクストレージやデータベースに保存しません。
* サードパーティの分析やテレメトリーサービスは使用しません。


## 収集する情報 {#information-collected}

透明性のために、いつでも<a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">ソースコードを見る</a>ことで、以下の情報がどのように収集・使用されているか確認できます。

**機能性のため、またサービス向上のために、以下の情報を安全に収集・保存しています：**

### アカウント情報 {#account-information}

* ご提供いただいたメールアドレスを保存します。
* ご提供いただいたドメイン名、エイリアス、および設定を保存します。
* メールや<a href="/help">ヘルプ</a>ページから送信されたコメントや質問など、任意で提供された追加情報。

**サインアップの帰属情報**（アカウントに永久保存）：

アカウント作成時に、ユーザーが当サービスをどのように見つけたかを理解するために以下の情報を保存します：

* 参照元のウェブサイトドメイン（完全なURLではありません）
* 当サイトで最初に訪れたページ
* URLに存在する場合のUTMキャンペーンパラメータ

### メールの保存 {#email-storage}

* あなたのIMAP/POP3/CalDAV/CardDAVアクセスおよびメールボックス機能のために、[暗号化されたSQLiteデータベース](/blog/docs/best-quantum-safe-encrypted-email-service)にメールおよびカレンダー情報を保存します。
  * メール転送サービスのみを利用している場合は、[収集しない情報](#information-not-collected)に記載の通り、メールはディスクやデータベースに保存されません。
  * メール転送サービスはメモリ上のみで動作し（ディスクストレージやデータベースへの書き込みはありません）。
  * IMAP/POP3/CalDAV/CardDAVの保存は、静止時暗号化、転送時暗号化され、LUKS暗号化ディスクに保存されます。
  * IMAP/POP3/CalDAV/CardDAVのバックアップは、静止時暗号化、転送時暗号化され、[Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)に保存されます。

### エラーログ {#error-logs}

* `4xx`および`5xx`のSMTP応答コードの[エラーログ](/faq#do-you-store-error-logs)を7日間保存します。
* エラーログにはSMTPエラー、エンベロープ、メールヘッダーが含まれます（メール本文や添付ファイルは**保存しません**）。
* エラーログにはデバッグ目的で送信サーバーのIPアドレスやホスト名が含まれる場合があります。
* [レート制限](/faq#do-you-have-rate-limiting)や[グレイリスト](/faq#do-you-have-a-greylist)のエラーログは、接続が早期に終了するため（例：`RCPT TO`や`MAIL FROM`コマンド送信前）、アクセスできません。
### Outbound SMTP Emails {#outbound-smtp-emails}

* 当社は[outbound SMTP emails](/faq#do-you-support-sending-email-with-smtp)を約30日間保存します。
  * この期間は「Date」ヘッダーに基づいて変動します。将来の日付の「Date」ヘッダーが存在する場合、未来の日時でメール送信を許可しているためです。
  * **メールが正常に配信されたか、永久的なエラーが発生した場合、メッセージ本文は編集され削除されます。**
  * 配信成功または永久エラー後のデフォルトの0日より長くアウトバウンドSMTPメールのメッセージ本文を保持したい場合は、ドメインの詳細設定で`0`から`30`の間の値を入力してください。
  * 一部のユーザーは[My Account > Emails](/my-account/emails)のプレビュー機能を利用してメールの表示を確認するため、保持期間の設定をサポートしています。
  * また、[OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)もサポートしています。


## Temporary Data Processing {#temporary-data-processing}

以下のデータは一時的にメモリまたはRedisで処理され、**永久的には保存されません**：

### Rate Limiting {#rate-limiting}

* IPアドレスはレート制限の目的で一時的にRedisに保存されます。
* レート制限データは自動的に期限切れになります（通常24時間以内）。
* これにより、不正利用を防止し、公平なサービス利用を保証します。

### Connection Tracking {#connection-tracking}

* 同時接続数はIPアドレスごとにRedisで追跡されます。
* このデータは接続終了時または短時間のタイムアウト後に自動的に期限切れになります。
* 接続の乱用を防止し、サービスの可用性を確保するために使用されます。

### Authentication Attempts {#authentication-attempts}

* 失敗した認証試行はIPアドレスごとにRedisで追跡されます。
* このデータは自動的に期限切れになります（通常24時間以内）。
* ユーザーアカウントへのブルートフォース攻撃を防止するために使用されます。


## Audit Logs {#audit-logs}

アカウントやドメインの監視とセキュリティ強化のために、特定の変更について監査ログを保持しています。これらのログはアカウント所有者やドメイン管理者への通知メール送信に使用されます。

### Account Changes {#account-changes}

* 重要なアカウント設定の変更（例：二要素認証、表示名、タイムゾーン）を追跡します。
* 変更が検出されると、登録済みのメールアドレスに通知メールを送信します。
* パスワード、APIトークン、リカバリーキーなどの機密フィールドは追跡しますが、通知では値は編集されます。
* 監査ログのエントリは通知メール送信後に削除されます。

### Domain Settings Changes {#domain-settings-changes}

複数の管理者がいるドメイン向けに、チームが設定変更を追跡できる詳細な監査ログを提供しています：

**追跡内容：**

* ドメイン設定の変更（例：バウンスWebhook、スパムフィルタリング、DKIM設定）
* 変更を行ったユーザー（メールアドレス）
* 変更日時（タイムスタンプ）
* 変更が行われたIPアドレス
* ブラウザ/クライアントのユーザーエージェント文字列

**仕組み：**

* 設定変更時、すべてのドメイン管理者に統合された通知メールを送信します。
* 通知には、変更内容、変更者、IPアドレス、タイムスタンプを示す表が含まれます。
* Webhookキー、APIトークン、DKIM秘密鍵などの機密フィールドは追跡しますが、値は編集されます。
* ユーザーエージェント情報は折りたたみ可能な「技術的詳細」セクションに含まれます。
* 監査ログのエントリは通知メール送信後に削除されます。

**収集理由：**

* ドメイン管理者がセキュリティ監視を維持できるようにするため
* チームが誰が設定変更を行ったかを監査できるようにするため
* 予期しない変更があった場合のトラブルシューティング支援のため
* 共有ドメイン管理の責任を明確にするため


## Cookies and Sessions {#cookies-and-sessions}

* ウェブサイトのトラフィックに対してセッション用のクッキーを保存します。
* クッキーはHTTPオンリー、署名付き、SameSite保護を使用しています。
* セッションクッキーは30日間の非アクティブ期間後に期限切れになります。
* ボットやクローラーにはセッションを作成しません。
* クッキーは以下の目的で使用します：
  * 認証およびログイン状態の管理
  * 二要素認証の「ログイン状態を保持」機能
  * フラッシュメッセージや通知
## Analytics {#analytics}

当社は独自のプライバシー重視の分析システムを使用して、サービスの利用状況を把握しています。このシステムはプライバシーを核心原則として設計されています：

**収集しないもの：**

* IPアドレスは保存しません
* 分析のためにクッキーや永続的な識別子は使用しません
* サードパーティの分析サービスは一切使用しません
* 日やセッションをまたいでユーザーを追跡しません

**収集するもの（匿名化済み）：**

* 集計されたページビューやサービス利用状況（SMTP、IMAP、POP3、APIなど）
* ブラウザおよびOSの種類（ユーザーエージェントから解析し、生データは破棄）
* デバイスの種類（デスクトップ、モバイル、タブレット）
* リファラードメイン（完全なURLではありません）
* メールプロトコルのメールクライアントの種類（例：Thunderbird、Outlook）

**データ保持期間：**

* 分析データは30日後に自動的に削除されます
* セッション識別子は毎日ローテーションされ、日をまたいでユーザーを追跡することはできません


## Information Shared {#information-shared}

当社はお客様の情報を第三者と共有しません。

裁判所の法的命令に従う必要がある場合がありますが（ただし[「収集しない情報」(#information-not-collected)に記載の情報は収集していないため]、そもそも提供できません）。


## Information Removal {#information-removal}

いつでもご提供いただいた情報を削除したい場合は、<a href="/my-account/security">マイアカウント > セキュリティ</a>にアクセスし、「アカウント削除」をクリックしてください。

不正利用防止のため、初回支払いから5日以内にアカウントを削除する場合は、管理者による手動の削除審査が必要になることがあります。

このプロセスは通常24時間以内に完了し、ユーザーがサービスをスパム利用し、その後すぐにアカウントを削除することで、Stripeでの支払い方法の指紋をブロックできなくなる問題を防ぐために導入されました。


## Additional Disclosures {#additional-disclosures}

このサイトはCloudflareによって保護されており、その[プライバシーポリシー](https://www.cloudflare.com/privacypolicy/)および[利用規約](https://www.cloudflare.com/website-terms/)が適用されます。
