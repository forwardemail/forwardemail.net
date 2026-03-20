# よくある質問 {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email よくある質問" class="rounded-lg" />


## 目次 {#table-of-contents}

* [クイックスタート](#quick-start)
* [はじめに](#introduction)
  * [Forward Emailとは何ですか](#what-is-forward-email)
  * [誰がForward Emailを使っていますか](#who-uses-forward-email)
  * [Forward Emailの歴史は何ですか](#what-is-forward-emails-history)
  * [このサービスの速度はどのくらいですか](#how-fast-is-this-service)
* [メールクライアント](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [モバイルデバイス](#mobile-devices)
  * [Sendmail SMTPリレー設定](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTPリレー設定](#exim4-smtp-relay-configuration)
  * [msmtp SMTPクライアント設定](#msmtp-smtp-client-configuration)
  * [コマンドラインメールクライアント](#command-line-email-clients)
  * [Windowsメール設定](#windows-email-configuration)
  * [Postfix SMTPリレー設定](#postfix-smtp-relay-configuration)
  * [Gmailでの送信メール設定方法](#how-to-send-mail-as-using-gmail)
  * [Gmailでの送信メール設定の旧無料ガイドとは](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [高度なGmailルーティング設定](#advanced-gmail-routing-configuration)
  * [高度なOutlookルーティング設定](#advanced-outlook-routing-configuration)
* [トラブルシューティング](#troubleshooting)
  * [テストメールが届かないのはなぜですか](#why-am-i-not-receiving-my-test-emails)
  * [Forward Emailでメールクライアントを設定するには](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [メールが迷惑メールやジャンクに入る理由とドメイン評価の確認方法](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [スパムメールを受け取った場合の対処法](#what-should-i-do-if-i-receive-spam-emails)
  * [Gmailで自分宛のテストメールが「疑わしい」と表示される理由](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Gmailでvia forwardemail dot netを削除できますか](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [データ管理](#data-management)
  * [サーバーの所在地はどこですか](#where-are-your-servers-located)
  * [メールボックスのエクスポートとバックアップ方法](#how-do-i-export-and-backup-my-mailbox)
  * [既存のメールボックスのインポートと移行方法](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [バックアップに自分のS3互換ストレージを使うには](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [SQLiteバックアップをEMLファイルに変換する方法](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [セルフホスティングはサポートしていますか](#do-you-support-self-hosting)
* [メール設定](#email-configuration)
  * [メール転送の開始と設定方法](#how-do-i-get-started-and-set-up-email-forwarding)
  * [複数のMX交換機とサーバーを使った高度な転送は可能ですか](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [休暇応答（不在自動応答）の設定方法](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Forward EmailのSPF設定方法](#how-do-i-set-up-spf-for-forward-email)
  * [Forward EmailのDKIM設定方法](#how-do-i-set-up-dkim-for-forward-email)
  * [Forward EmailのDMARC設定方法](#how-do-i-set-up-dmarc-for-forward-email)
  * [DMARCレポートの閲覧方法](#how-do-i-view-dmarc-reports)
  * [連絡先の接続と設定方法](#how-do-i-connect-and-configure-my-contacts)
  * [カレンダーの接続と設定方法](#how-do-i-connect-and-configure-my-calendars)
  * [カレンダーの追加と既存カレンダーの管理方法](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [タスクとリマインダーの接続と設定方法](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [macOSリマインダーでタスクが作成できない理由](#why-cant-i-create-tasks-in-macos-reminders)
  * [AndroidでTasks.orgを設定する方法](#how-do-i-set-up-tasksorg-on-android)
  * [Forward EmailのSRS設定方法](#how-do-i-set-up-srs-for-forward-email)
  * [Forward EmailのMTA-STS設定方法](#how-do-i-set-up-mta-sts-for-forward-email)
  * [メールアドレスにプロフィール画像を追加する方法](#how-do-i-add-a-profile-picture-to-my-email-address)
* [高度な機能](#advanced-features)
  * [マーケティング関連のニュースレターやメーリングリストはサポートしていますか](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [APIでのメール送信はサポートしていますか](#do-you-support-sending-email-with-api)
  * [IMAPでのメール受信はサポートしていますか](#do-you-support-receiving-email-with-imap)
  * [POP3はサポートしていますか](#do-you-support-pop3)
  * [カレンダー（CalDAV）はサポートしていますか](#do-you-support-calendars-caldav)
  * [タスクとリマインダー（CalDAV VTODO）はサポートしていますか](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [連絡先（CardDAV）はサポートしていますか](#do-you-support-contacts-carddav)
  * [SMTPでのメール送信はサポートしていますか](#do-you-support-sending-email-with-smtp)
  * [OpenPGP/MIME、エンドツーエンド暗号化（"E2EE"）、Web Key Directory（"WKD"）はサポートしていますか](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [S/MIME暗号化はサポートしていますか](#do-you-support-smime-encryption)
  * [Sieveメールフィルタリングはサポートしていますか](#do-you-support-sieve-email-filtering)
  * [MTA-STSはサポートしていますか](#do-you-support-mta-sts)
  * [パスキーとWebAuthnはサポートしていますか](#do-you-support-passkeys-and-webauthn)
  * [メールのベストプラクティスはサポートしていますか](#do-you-support-email-best-practices)
  * [バウンスWebhookはサポートしていますか](#do-you-support-bounce-webhooks)
  * [Webhookはサポートしていますか](#do-you-support-webhooks)
  * [正規表現（regex）はサポートしていますか](#do-you-support-regular-expressions-or-regex)
  * [送信SMTPの制限はどのくらいですか](#what-are-your-outbound-smtp-limits)
  * [SMTPを有効にするには承認が必要ですか](#do-i-need-approval-to-enable-smtp)
  * [SMTPサーバーの設定はどのようになっていますか](#what-are-your-smtp-server-configuration-settings)
  * [IMAPサーバーの設定はどのようになっていますか](#what-are-your-imap-server-configuration-settings)
  * [POP3サーバーの設定はどのようになっていますか](#what-are-your-pop3-server-configuration-settings)
  * [ドメインのメール自動検出設定方法](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [セキュリティ](#security-1)
  * [高度なサーバーハードニング技術](#advanced-server-hardening-techniques)
  * [SOC 2またはISO 27001認証はありますか](#do-you-have-soc-2-or-iso-27001-certifications)
  * [メール転送にTLS暗号化を使用していますか](#do-you-use-tls-encryption-for-email-forwarding)
  * [メール認証ヘッダーは保持していますか](#do-you-preserve-email-authentication-headers)
  * [元のメールヘッダーを保持し、なりすましを防止していますか](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [スパムや悪用からどのように保護していますか](#how-do-you-protect-against-spam-and-abuse)
  * [メール内容をディスクに保存していますか](#do-you-store-email-content-on-disk)
  * [システムクラッシュ時にメール内容が露出する可能性はありますか](#can-email-content-be-exposed-during-system-crashes)
  * [誰がメールインフラにアクセスできますか](#who-has-access-to-your-email-infrastructure)
  * [どのインフラプロバイダーを使用していますか](#what-infrastructure-providers-do-you-use)
  * [データ処理契約（DPA）を提供していますか](#do-you-offer-a-data-processing-agreement-dpa)
  * [データ漏洩通知はどのように対応していますか](#how-do-you-handle-data-breach-notifications)
  * [テスト環境は提供していますか](#do-you-offer-a-test-environment)
  * [監視およびアラートツールは提供していますか](#do-you-provide-monitoring-and-alerting-tools)
  * [高可用性をどのように確保していますか](#how-do-you-ensure-high-availability)
  * [国防権限法（NDAA）第889条に準拠していますか](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [システムおよび技術的詳細](#system-and-technical-details)
  * [メールとその内容を保存していますか](#do-you-store-emails-and-their-contents)
  * [メール転送システムはどのように動作しますか](#how-does-your-email-forwarding-system-work)
  * [メールを転送用に処理する方法](#how-do-you-process-an-email-for-forwarding)
  * [メール配信の問題をどのように処理しますか](#how-do-you-handle-email-delivery-issues)
  * [IPアドレスがブロックされた場合の対応方法](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [ポストマスターアドレスとは何ですか](#what-are-postmaster-addresses)
  * [no-replyアドレスとは何ですか](#what-are-no-reply-addresses)
  * [サーバーのIPアドレスは何ですか](#what-are-your-servers-ip-addresses)
  * [許可リストはありますか](#do-you-have-an-allowlist)
  * [デフォルトで許可されているドメイン名の拡張子は何ですか](#what-domain-name-extensions-are-allowlisted-by-default)
  * [許可リストの基準は何ですか](#what-is-your-allowlist-criteria)
  * [無料で使えるドメイン名の拡張子は何ですか](#what-domain-name-extensions-can-be-used-for-free)
  * [グレーリストはありますか](#do-you-have-a-greylist)
  * [拒否リストはありますか](#do-you-have-a-denylist)
  * [レート制限はありますか](#do-you-have-rate-limiting)
  * [バックキャッターからどのように保護していますか](#how-do-you-protect-against-backscatter)
  * [既知のMAIL FROMスパマーからのバウンスを防止](#prevent-bounces-from-known-mail-from-spammers)
  * [不要なバウンスを防止してバックキャッターを防ぐ](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [メールのフィンガープリントはどのように判定しますか](#how-do-you-determine-an-email-fingerprint)
  * [ポート25以外（例：ISPがポート25をブロックしている場合）にメール転送は可能ですか](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Gmailエイリアスのプラス記号+はサポートしていますか](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [サブドメインはサポートしていますか](#does-it-support-sub-domains)
  * [メールのヘッダーは転送されますか](#does-this-forward-my-emails-headers)
  * [十分にテストされていますか](#is-this-well-tested)
  * [SMTPの応答メッセージとコードを転送しますか](#do-you-pass-along-smtp-response-messages-and-codes)
  * [スパマーを防止し、良好なメール転送の評判を維持する方法](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [ドメイン名のDNSルックアップはどのように行いますか](#how-do-you-perform-dns-lookups-on-domain-names)
* [アカウントと請求](#account-and-billing)
  * [有料プランに返金保証はありますか](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [プラン変更時に日割り計算や差額返金はありますか](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [このメール転送サービスを「フォールバック」や「フォールオーバー」MXサーバーとして使えますか](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [特定のエイリアスを無効にできますか](#can-i-disable-specific-aliases)
  * [複数の受信者にメール転送できますか](#can-i-forward-emails-to-multiple-recipients)
  * [複数のグローバルキャッチオール受信者を持てますか](#can-i-have-multiple-global-catch-all-recipients)
  * [エイリアスごとの転送先メールアドレス数に上限はありますか](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [メールを再帰的に転送できますか](#can-i-recursively-forward-emails)
  * [許可なくメール転送の登録や解除ができますか](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [なぜ無料で使えるのですか](#how-is-it-free)
  * [最大メールサイズの制限は何ですか](#what-is-the-max-email-size-limit)
  * [メールのログは保存していますか](#do-you-store-logs-of-emails)
  * [エラーログは保存していますか](#do-you-store-error-logs)
  * [メールを読んでいますか](#do-you-read-my-emails)
  * [Gmailで「送信者として送信」はできますか](#can-i-send-mail-as-in-gmail-with-this)
  * [Outlookで「送信者として送信」はできますか](#can-i-send-mail-as-in-outlook-with-this)
  * [Apple MailやiCloud Mailで「送信者として送信」はできますか](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [無制限にメール転送できますか](#can-i-forward-unlimited-emails-with-this)
  * [1つの料金で無制限のドメインを提供していますか](#do-you-offer-unlimited-domains-for-one-price)
  * [どの支払い方法を受け付けていますか](#which-payment-methods-do-you-accept)
* [追加リソース](#additional-resources)
## クイックスタート {#quick-start}

Forward Email を始めるには：

1. **アカウントを作成** する [forwardemail.net/register](https://forwardemail.net/register)

2. **ドメインを追加して確認** する [マイアカウント → ドメイン](/my-account/domains)

3. **メールエイリアス／メールボックスを追加・設定** する [マイアカウント → ドメイン](/my-account/domains) → エイリアス

4. **セットアップをテスト** するために、新しいエイリアスのいずれかにメールを送信します

> \[!TIP]
> DNSの変更は世界中に伝播するまでに24〜48時間かかることがありますが、多くの場合はもっと早く反映されます。

> \[!IMPORTANT]
> 配信率を向上させるために、[SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email)、および[DMARC](#how-do-i-set-up-dmarc-for-forward-email)レコードの設定を推奨します。


## はじめに {#introduction}

### Forward Emailとは {#what-is-forward-email}

> \[!NOTE]
> Forward Email は、フルのメールホスティングソリューションのコストやメンテナンスなしで、プロフェッショナルなメールアドレスを持ちたい個人、小規模事業者、開発者に最適です。

Forward Email は、**フル機能のメールサービスプロバイダー**であり、**カスタムドメイン名向けのメールホスティングプロバイダー**です。

唯一の無料かつオープンソースのサービスであり、独自のメールサーバーを設定・維持する複雑さなしにカスタムドメインのメールアドレスを使えます。

当サービスは、カスタムドメイン宛のメールを既存のメールアカウントに転送します — さらに専用のメールホスティングプロバイダーとしても利用可能です。

Forward Email の主な特徴：

* **カスタムドメインメール**：独自ドメイン名でプロフェッショナルなメールアドレスを使用可能
* **無料プラン**：基本的なメール転送を無料で提供
* **強化されたプライバシー**：メールを読み取らず、データを販売しません
* **オープンソース**：コードベースはすべてGitHubで公開
* **SMTP、IMAP、POP3対応**：メールの送受信機能を完全サポート
* **エンドツーエンド暗号化**：OpenPGP/MIME対応
* **カスタムキャッチオールエイリアス**：無制限のメールエイリアス作成可能

[当社のメール比較ページ](/blog/best-email-service)で56以上の他のメールサービスプロバイダーと比較できます。

> \[!TIP]
> 無料の[技術ホワイトペーパー](/technical-whitepaper.pdf)を読んでForward Emailについてさらに学びましょう。

### Forward Emailの利用者 {#who-uses-forward-email}

当社は50万以上のドメインにメールホスティングおよびメール転送サービスを提供しており、以下の著名なユーザーがいます：

| 顧客                                     | ケーススタディ                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 米国海軍士官学校                         | [:page_facing_up: ケーススタディ](/blog/docs/federal-government-email-service-section-889-compliant)     |
| Canonical                                | [:page_facing_up: ケーススタディ](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Netflix Games                            |                                                                                                          |
| Linux Foundation                        | [:page_facing_up: ケーススタディ](/blog/docs/linux-foundation-email-enterprise-case-study)               |
| PHP Foundation                          |                                                                                                          |
| Fox News Radio                         |                                                                                                          |
| Disney Ad Sales                        |                                                                                                          |
| jQuery                                  | [:page_facing_up: ケーススタディ](/blog/docs/linux-foundation-email-enterprise-case-study)               |
| LineageOS                              |                                                                                                          |
| Ubuntu                                 | [:page_facing_up: ケーススタディ](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Kubuntu                                | [:page_facing_up: ケーススタディ](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| Lubuntu                                | [:page_facing_up: ケーススタディ](/blog/docs/canonical-ubuntu-email-enterprise-case-study)               |
| ケンブリッジ大学                       | [:page_facing_up: ケーススタディ](/blog/docs/alumni-email-forwarding-university-case-study)              |
| メリーランド大学                       | [:page_facing_up: ケーススタディ](/blog/docs/alumni-email-forwarding-university-case-study)              |
| ワシントン大学                         | [:page_facing_up: ケーススタディ](/blog/docs/alumni-email-forwarding-university-case-study)              |
| タフツ大学                             | [:page_facing_up: ケーススタディ](/blog/docs/alumni-email-forwarding-university-case-study)              |
| スワースモア大学                       | [:page_facing_up: ケーススタディ](/blog/docs/alumni-email-forwarding-university-case-study)              |
| 南オーストラリア州政府                 |                                                                                                          |
| ドミニカ共和国政府                     |                                                                                                          |
| Fly<span>.</span>io                    |                                                                                                          |
| RCD Hotels                             |                                                                                                          |
| Isaac Z. Schlueter (npm)               | [:page_facing_up: ケーススタディ](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Forward Emailの歴史とは {#what-is-forward-emails-history}

Forward Emailについて詳しくは[私たちのAboutページ](/about)をご覧ください。

### このサービスの速度はどのくらいか {#how-fast-is-this-service}

> \[!NOTE]
> 当システムは速度と信頼性を重視して設計されており、複数の冗長サーバーによりメールが迅速に配信されることを保証しています。

Forward Emailは受信後数秒以内にメッセージをほぼ遅延なく配信します。

パフォーマンス指標：

* **平均配信時間**：受信から転送まで5〜10秒未満（[Time to Inbox "TTI"監視ページ](/tti)をご覧ください）
* **稼働率**：99.9%以上のサービス可用性
* **グローバルインフラ**：最適なルーティングのために戦略的に配置されたサーバー
* **自動スケーリング**：ピーク時のメール量に応じてシステムがスケール

当社はリアルタイムで動作しており、遅延キューに依存する他のプロバイダーとは異なります。

ディスクへの書き込みやログの保存は行いません — [エラーの例外](#do-you-store-error-logs)および[送信SMTP](#do-you-support-sending-email-with-smtp)（[プライバシーポリシー](/privacy)参照）を除きます。

すべてはメモリ内で処理され、[ソースコードはGitHubに公開されています](https://github.com/forwardemail)。


## メールクライアント {#email-clients}

### Thunderbird {#thunderbird}

1. Forward Emailダッシュボードで新しいエイリアスを作成し、パスワードを生成します
2. Thunderbirdを開き、**編集 → アカウント設定 → アカウント操作 → メールアカウントを追加**に進みます
3. 名前、Forward Emailアドレス、パスワードを入力します
4. **手動で設定**をクリックし、以下を入力します：
   * 受信：IMAP、`imap.forwardemail.net`、ポート993、SSL/TLS
   * 送信：SMTP、`smtp.forwardemail.net`、ポート465、SSL/TLS（推奨；ポート587のSTARTTLSもサポート）
5. **完了**をクリックします

### Microsoft Outlook {#microsoft-outlook}

1. Forward Emailダッシュボードで新しいエイリアスを作成し、パスワードを生成します
2. **ファイル → アカウントの追加**に進みます
3. Forward Emailアドレスを入力し、**接続**をクリックします
4. **詳細オプション**を選択し、**手動でアカウントを設定する**を選びます
5. **IMAP**を選択し、以下を入力します：
   * 受信：`imap.forwardemail.net`、ポート993、SSL
   * 送信：`smtp.forwardemail.net`、ポート465、SSL/TLS（推奨；ポート587のSTARTTLSもサポート）
   * ユーザー名：フルメールアドレス
   * パスワード：生成したパスワード
6. **接続**をクリックします

### Apple Mail {#apple-mail}

1. Forward Emailダッシュボードで新しいエイリアスを作成し、パスワードを生成します
2. **メール → 環境設定 → アカウント → +**に進みます
3. **その他のメールアカウント**を選択します
4. 名前、Forward Emailアドレス、パスワードを入力します
5. サーバー設定には以下を入力します：
   * 受信：`imap.forwardemail.net`
   * 送信：`smtp.forwardemail.net`
   * ユーザー名：フルメールアドレス
   * パスワード：生成したパスワード
6. **サインイン**をクリックします

### eM Client {#em-client}

1. Forward Emailダッシュボードで新しいエイリアスを作成し、パスワードを生成します
2. eM Clientを開き、**メニュー → アカウント → + アカウントを追加**に進みます
3. **メール**をクリックし、**その他**を選択します
4. Forward Emailアドレスを入力し、**次へ**をクリックします
5. 以下のサーバー設定を入力します：
   * **受信サーバー**：`imap.forwardemail.net`
   * **送信サーバー**：`smtp.forwardemail.net`
6. 受信・送信サーバー両方に対して、ユーザー名にフルメールアドレス、パスワードに生成したパスワードを入力します
7. eM Clientが接続テストを行います。成功したら**次へ**をクリックします
8. 名前を入力し、アカウント名を選択します
9. **完了**をクリックします

### モバイルデバイス {#mobile-devices}

iOSの場合：

1. **設定 → メール → アカウント → アカウントを追加 → その他**に進みます
2. **メールアカウントを追加**をタップし、詳細を入力します
3. サーバー設定には上記と同じIMAPおよびSMTP設定を使用します

Androidの場合：

1. **設定 → アカウント → アカウントを追加 → 個人（IMAP）**に進みます
2. Forward Emailアドレスとパスワードを入力します
3. サーバー設定には上記と同じIMAPおよびSMTP設定を使用します

### Sendmail SMTPリレー設定 {#sendmail-smtp-relay-configuration}

SendmailをForward EmailのSMTPサーバー経由でメールをリレーするよう設定できます。これはレガシーシステムやSendmailに依存するアプリケーションで一般的な設定です。
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定セットアップ時間:</strong>
  <span>20分未満</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    これはSMTPアクセスが有効な有料プランが必要です。
  </span>
</div>

#### 設定 {#configuration}

1. 通常 `/etc/mail/sendmail.mc` にある `sendmail.mc` ファイルを編集します:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. スマートホストと認証を定義するために以下の行を追加します:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. 認証ファイル `/etc/mail/authinfo` を作成します:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. `authinfo` ファイルに Forward Email の認証情報を追加します:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. 認証データベースを生成し、ファイルの権限を設定します:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Sendmail の設定を再構築し、サービスを再起動します:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### テスト {#testing}

設定を確認するためにテストメールを送信します:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP リレー設定 {#exim4-smtp-relay-configuration}

Exim4 は Debian 系システムで人気のあるMTAです。Forward Email をスマートホストとして使用するように設定できます。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定セットアップ時間:</strong>
  <span>15分未満</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    これはSMTPアクセスが有効な有料プランが必要です。
  </span>
</div>

#### 設定 {#configuration-1}

1. Exim4 の設定ツールを実行します:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. 以下のオプションを選択します:
   * **メール設定の一般タイプ:** スマートホスト経由で送信; SMTP または fetchmail 経由で受信
   * **システムメール名:** your.hostname
   * **受信SMTP接続を待ち受けるIPアドレス:** 127.0.0.1 ; ::1
   * **メールを受け入れるその他の宛先:** （空白のまま）
   * **メールを中継するドメイン:** （空白のまま）
   * **送信スマートホストのIPアドレスまたはホスト名:** smtp.forwardemail.net::465
   * **送信メールでローカルメール名を隠すか？** いいえ
   * **DNSクエリ数を最小限にする（ダイヤルオンデマンド）？** いいえ
   * **ローカルメールの配信方法:** /var/mail/ の Mbox 形式
   * **設定を小さなファイルに分割する？** いいえ

3. 認証情報を追加するために `passwd.client` ファイルを編集します:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. 以下の行を追加します:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. 設定を更新し、Exim4 を再起動します:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### テスト {#testing-1}

テストメールを送信します:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP クライアント設定 {#msmtp-smtp-client-configuration}

msmtp はスクリプトやコマンドラインアプリケーションからメールを送信するのに便利な軽量SMTPクライアントです。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定セットアップ時間:</strong>
  <span>10分未満</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    これはSMTPアクセスが有効な有料プランが必要です。
  </span>
</div>

#### 設定 {#configuration-2}

1. `~/.msmtprc` に msmtp の設定ファイルを作成または編集します：

   ```bash
   nano ~/.msmtprc
   ```

2. 以下の設定を追加します：

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. 設定ファイルの権限を正しく設定します：

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### テスト {#testing-2}

テストメールを送信します：

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### コマンドラインメールクライアント {#command-line-email-clients}

[Mutt](https://gitlab.com/muttmua/mutt)、[NeoMutt](https://neomutt.org)、[Alpine](https://alpine.x10.mx/alpine/release/) のような人気のコマンドラインメールクライアントは、Forward Email のSMTPサーバーを使ってメール送信を設定できます。設定は `msmtp` のセットアップに似ており、それぞれの設定ファイル（`.muttrc`、`.neomuttrc`、または `.pinerc`）にSMTPサーバーの詳細と認証情報を記述します。

### Windowsメール設定 {#windows-email-configuration}

Windowsユーザーは、Forward Emailアカウントで提供されるIMAPおよびSMTP設定を使って、**Microsoft Outlook** や **eM Client** のような人気のメールクライアントを設定できます。コマンドラインやスクリプトで使う場合は、PowerShellの `Send-MailMessage` コマンドレット（ただし非推奨）や、[E-MailRelay](https://github.com/graeme-walker/emailrelay) のような軽量SMTPリレーツールを利用できます。

### Postfix SMTPリレー設定 {#postfix-smtp-relay-configuration}

Postfixを設定してForward EmailのSMTPサーバー経由でメールをリレーできます。これはメール送信が必要なサーバーアプリケーションに便利です。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定セットアップ時間:</strong>
  <span>15分未満</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    これはSMTPアクセスが有効な有料プランが必要です。
  </span>
</div>

#### インストール {#installation}

1. サーバーにPostfixをインストールします：

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. インストール中に設定タイプの選択を求められたら「Internet Site」を選択します。

#### 設定 {#configuration-3}

1. Postfixのメイン設定ファイルを編集します：

```bash
sudo nano /etc/postfix/main.cf
```

2. 以下の設定を追加または変更します：

```
# SMTPリレー設定
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. SASLパスワードファイルを作成します：

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Forward Emailの認証情報を追加します：

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. パスワードファイルの権限を保護し、ハッシュ化します：

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfixを再起動します：

```bash
sudo systemctl restart postfix
```

#### テスト {#testing-3}

テストメールを送信して設定を確認します：

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Gmailを使った送信元メールアドレス設定方法 {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定セットアップ時間：</strong>
  <span>10分未満</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    はじめに：
  </strong>
  <span>
    もし上記の<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">メール転送の開始方法と設定</a>の指示に従っている場合は、以下を読み進めてください。
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    当社の<a href="/terms" class="alert-link" target="_blank">利用規約</a>、<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>、および<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">送信SMTP制限</a>を必ずお読みください。ご利用はこれらの内容の承認および同意とみなされます。
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    開発者の方は、当社の<a class="alert-link" href="/email-api#outbound-emails" target="_blank">メールAPIドキュメント</a>をご参照ください。
  </span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> 送信SMTP設定に移動し、セットアップ手順に従ってください

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスでドメイン用の新しいエイリアスを作成します（例：<code><hello@example.com></code>）

3. 新しく作成したエイリアスの横にある<strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong>をクリックします。画面に表示された生成されたパスワードをクリップボードにコピーし、安全に保管してください。

4. [Gmail](https://gmail.com)にアクセスし、[設定 <i class="fa fa-angle-right"></i> アカウントとインポート <i class="fa fa-angle-right"></i> メールを送信するアドレス](https://mail.google.com/mail/u/0/#settings/accounts)で「別のメールアドレスを追加」をクリックします

5. 「名前」の入力を求められたら、メールの送信元として表示したい名前を入力します（例：「Linus Torvalds」）

6. 「メールアドレス」の入力を求められたら、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスで作成したエイリアスの完全なメールアドレスを入力します（例：<code><hello@example.com></code>）

7. 「エイリアスとして扱う」のチェックを外します

8. 「次のステップ」をクリックして進みます

9. 「SMTPサーバー」の入力を求められたら、<code>smtp.forwardemail.net</code>を入力し、ポートを<code>465</code>に変更します

10. 「ユーザー名」の入力を求められたら、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスで作成したエイリアスの完全なメールアドレスを入力します（例：<code><hello@example.com></code>）

11. 「パスワード」の入力を求められたら、ステップ3で<strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong>した際にコピーしたパスワードを貼り付けます

12. 「SSLを使用した安全な接続」のラジオボタンを選択します

13. 「アカウントを追加」をクリックして進みます

14. 新しいタブで[Gmail](https://gmail.com)を開き、確認メールが届くのを待ちます（送信元として設定しようとしているメールアドレスの所有者であることを確認するための認証コードが届きます）

15. メールが届いたら、前のステップで求められた認証コードをコピーして貼り付けます
16. それが完了したら、メールに戻り、「リクエストを確認する」リンクをクリックしてください。メールが正しく設定されるためには、このステップと前のステップの両方を行う必要がある可能性が高いです。

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべてのステップを正常に完了しました。
    </span>
  </div>
</div>

</div>

### Gmailを使ったSend Mail Asのレガシーフリーガイドとは何ですか {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">重要：</strong> このレガシーフリーガイドは2023年5月をもって廃止されました。<a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">現在はアウトバウンドSMTPをサポートしているため</a>です。以下のガイドを使用すると、<a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">Gmailで送信メールに「<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>」と表示される原因になります</a>。</div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定セットアップ時間：</strong>
  <span>10分未満</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    はじめに：
  </strong>
  <span>
    <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">メール転送の設定方法と開始方法</a>の手順に従った場合は、以下を読み進めてください。
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. これを機能させるには、[Gmailの二段階認証][gmail-2fa]を有効にしている必要があります。有効にしていない場合は、<https://www.google.com/landing/2step/> をご覧ください。

2. 二段階認証が有効になったら（すでに有効の場合も）、<https://myaccount.google.com/apppasswords> にアクセスしてください。

3. 「アプリとデバイスを選択してアプリパスワードを生成してください」と表示されたら：
   * 「アプリを選択」ドロップダウンから「メール」を選択
   * 「デバイスを選択」ドロップダウンから「その他」を選択
   * テキスト入力を求められたら、転送元のカスタムドメインのメールアドレスを入力してください（例：<code><hello@example.com></code> - 複数アカウントでこのサービスを使う場合に管理しやすくなります）

4. 自動生成されたパスワードをクリップボードにコピーしてください
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       重要：
     </strong>
     <span>
       G Suiteをご利用の場合は、管理パネルの<a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">アプリ <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmailの設定 <i class="fa fa-angle-right"></i> 設定</a>にアクセスし、「ユーザーが外部SMTPサーバーを通じてメールを送信できるようにする...」にチェックを入れてください。この変更が反映されるまで数分かかる場合がありますので、しばらくお待ちください。
     </span>
   </div>

5. [Gmail](https://gmail.com)にアクセスし、[設定 <i class="fa fa-angle-right"></i> アカウントとインポート <i class="fa fa-angle-right"></i> メールを送信するアドレス](https://mail.google.com/mail/u/0/#settings/accounts)の下で、「別のメールアドレスを追加」をクリックしてください。

6. 「名前」の入力を求められたら、メールの送信者名として表示したい名前を入力してください（例：「Linus Torvalds」）

7. 「メールアドレス」の入力を求められたら、上記で使用したカスタムドメインのメールアドレスを入力してください（例：<code><hello@example.com></code>）
8. 「エイリアスとして扱う」のチェックを外す

9. 「次のステップ」をクリックして進む

10. 「SMTPサーバー」の入力を求められたら、<code>smtp.gmail.com</code> と入力し、ポートは <code>587</code> のままにする

11. 「ユーザー名」の入力を求められたら、Gmailアドレスの <span>gmail.com</span> 部分を除いた部分を入力する（例：メールアドレスが <span><user@gmail.com></span> の場合は「user」のみ）
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        重要:
      </strong>
      <span>
        「ユーザー名」部分が自動入力されている場合は、<u><strong>必ずこれをGmailアドレスのユーザー名部分に変更してください</strong></u>。
      </span>
    </div>

12. 「パスワード」の入力を求められたら、上記ステップ2で生成したパスワードをクリップボードから貼り付ける

13. 「TLSを使用した安全な接続」のラジオボタンはチェックしたままにする

14. 「アカウントを追加」をクリックして進む

15. 新しいタブで [Gmail](https://gmail.com) を開き、確認メールが届くのを待つ（「送信者として送信」しようとしているメールアドレスの所有者であることを確認するための認証コードが届きます）

16. メールが届いたら、認証コードをコピーして前のステップで求められた場所に貼り付ける

17. 認証コードを入力したら、メールに戻り「リクエストを確認する」リンクをクリックする必要があります。このステップと前のステップの両方を行うことで、メールが正しく設定されます。

</div>

### 高度なGmailルーティング設定 {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定設定時間:</strong>
  <span>15〜30分</span>
</div>

Gmailで、存在しないメールボックスに一致しないエイリアスをForward Emailのメール交換先に転送する高度なルーティングを設定したい場合は、以下の手順に従ってください：

1. [admin.google.com](https://admin.google.com) でGoogle管理コンソールにログインする
2. **アプリ → Google Workspace → Gmail → ルーティング** に移動する
3. **ルートを追加** をクリックし、以下の設定を行う：

**単一受信者設定:**

* 「エンベロープ受信者を変更」を選択し、プライマリGmailアドレスを入力する
* 「元の受信者を含むX-Gm-Original-Toヘッダーを追加」にチェックを入れる

**エンベロープ受信者パターン:**

* 存在しないすべてのメールボックスに一致するパターンを追加する（例：`.*@yourdomain.com`）

**メールサーバー設定:**

* 「ホストにルーティング」を選択し、プライマリサーバーに `mx1.forwardemail.net` を入力する
* バックアップサーバーに `mx2.forwardemail.net` を追加する
* ポートを25に設定する
* セキュリティのため「TLSを必須にする」を選択する

4. **保存** をクリックしてルートを作成する

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    この設定はカスタムドメインを持つGoogle Workspaceアカウントでのみ機能し、通常のGmailアカウントでは動作しません。
  </span>
</div>

### 高度なOutlookルーティング設定 {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定設定時間:</strong>
  <span>15〜30分</span>
</div>

Microsoft 365（旧Office 365）ユーザーで、存在しないメールボックスに一致しないエイリアスをForward Emailのメール交換先に転送する高度なルーティングを設定したい場合：

1. [admin.microsoft.com](https://admin.microsoft.com) でMicrosoft 365管理センターにログインする
2. **Exchange → メールフロー → ルール** に移動する
3. **ルールの追加** をクリックし、**新しいルールの作成** を選択する
4. ルール名を付ける（例：「存在しないメールボックスをForward Emailに転送」）
5. **このルールを適用する場合** で以下を選択：
   * 「受信者アドレスが次に一致する場合...」
   * ドメイン内のすべてのアドレスに一致するパターンを入力（例：`*@yourdomain.com`）
6. **次の操作を行う** で以下を選択：
   * 「メッセージをリダイレクトする先...」
   * 「次のメールサーバー」を選択
   * `mx1.forwardemail.net` とポート25を入力
   * バックアップサーバーとして `mx2.forwardemail.net` を追加
7. **除外条件** で以下を選択：
   * 「受信者が次の場合...」
   * 転送しない既存のすべてのメールボックスを追加
8. ルールの優先順位を設定し、他のメールフロールールの後に実行されるようにする
9. **保存** をクリックしてルールを有効化する
## トラブルシューティング {#troubleshooting}

### なぜテストメールが届かないのですか {#why-am-i-not-receiving-my-test-emails}

自分宛にテストメールを送信している場合、同じ「Message-ID」ヘッダーを持っているため、受信トレイに表示されないことがあります。

これは広く知られている問題で、Gmailなどのサービスにも影響します。  <a href="https://support.google.com/a/answer/1703601">この問題に関する公式のGmailの回答はこちらです</a>。

問題が続く場合は、DNSの伝播に問題がある可能性が高いです。 もう少し待ってから再度試すか、<strong class="notranslate">TXT</strong>レコードのTTL値を低く設定してみてください。

**まだ問題がありますか？** ぜひ<a href="/help">お問い合わせ</a>ください。問題の調査と迅速な解決をお手伝いします。

### Forward Emailでメールクライアントを設定するにはどうすればよいですか {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  当サービスは以下のような人気のメールクライアントに対応しています：
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> デスクトップ</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> ターミナル</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  ユーザー名はエイリアスのメールアドレスで、パスワードは<strong class="text-success"><i class="fa fa-key"></i> パスワード生成</strong>（「通常のパスワード」）から取得します。
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント：
  </strong>
  <span>Thunderbirdを使用している場合は、「接続のセキュリティ」が「SSL/TLS」に設定されており、認証方法が「通常のパスワード」になっていることを確認してください。</span>
</div>

| 種類 |         ホスト名         |         プロトコル         |                                            ポート                                            |
| :--: | :---------------------: | :-----------------------: | :------------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`  |  SSL/TLS **推奨**          |                                      `993` と `2993`                                       |
| SMTP | `smtp.forwardemail.net`  | SSL/TLS **推奨**           | SSL/TLSの場合は `465` と `2465`（推奨）、STARTTLSの場合は `587`、`2587`、`2525`、および `25` |

### なぜメールが迷惑メールやジャンクに振り分けられるのか、ドメインの評判を確認する方法 {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
このセクションでは、送信メールが当社のSMTPサーバー（例：`smtp.forwardemail.net`）を使用している場合（または`mx1.forwardemail.net`や`mx2.forwardemail.net`経由で転送されている場合）に、受信者の迷惑メールまたはジャンクフォルダに配信されてしまう場合の対処方法を案内します。

当社は定期的に[IPアドレス](#what-are-your-servers-ip-addresses)を[すべての信頼できるDNS拒否リスト](#how-do-you-handle-your-ip-addresses-becoming-blocked)と照合して監視しています。**したがって、ほとんどの場合はドメインの評判に関する問題である可能性が高いです**。

メールが迷惑メールフォルダに振り分けられる理由はいくつかあります：

1. **認証の欠如**：[SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email)、および[DMARC](#how-do-i-set-up-dmarc-for-forward-email)レコードを設定してください。

2. **ドメインの評判**：新しいドメインは送信履歴が確立されるまで中立的な評判を持つことが多いです。

3. **コンテンツのトリガー**：特定の単語やフレーズがスパムフィルターを作動させることがあります。

4. **送信パターン**：メール送信量の急激な増加は疑わしく見えることがあります。

以下のツールの1つ以上を使用して、ドメインの評判や分類を確認してみてください：

#### 評判およびブロックリスト確認ツール {#reputation-and-blocklist-check-tools}

| ツール名                                   | URL                                                          | 種類                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | 分類                   |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | 評判                   |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | ブラックリスト         |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | 評判                   |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | 評判                   |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | 評判                   |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | バックスキャッター保護  |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (有料)                        | DNSWL                  |

#### プロバイダー別IP解除申請フォーム {#ip-removal-request-forms-by-provider}

特定のメールプロバイダーによってIPアドレスがブロックされている場合は、以下の適切な解除フォームまたは連絡先を使用してください：

| プロバイダー                           | 解除フォーム / 連絡先                                                                                     | 備考                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | 大量送信者連絡フォーム                       |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP解除ポータル                     |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | AppleはProofpointをIP評判に使用              |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IPチェックおよび解除               |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda評判確認および解除                   |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSIリセットリクエスト               |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | GoDaddy IP解除申請フォーム                    |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Comcast IP解除申請                           |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Spectrumサポートに解除依頼                    |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | 解除依頼用メール                             |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | 解除依頼用メール                             |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Cloudfilter使用                              |
| Windstream                             | `abuse@windstream.net`                                                                                     | 解除依頼用メール                             |
| t-online.de (ドイツ)                   | `tobr@rx.t-online.de`                                                                                      | 解除依頼用メール                             |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | 連絡フォームまたはメール `abuse@orange.fr` を使用 |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | GMXポストマスター連絡フォーム                 |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Mail.ruポストマスターポータル                 |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Yandexポストマスターポータル                  |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | QQ Mailホワイトリスト申請（中国語）           |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Neteaseポストマスターポータル                 |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Alibaba Cloudコンソール経由で連絡             |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SESコンソール > ブラックリスト解除       |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | SendGridサポートに連絡                        |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | サードパーティRBL使用 - 特定RBLに連絡         |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Fastmailサポートに連絡                        |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Zohoサポートに連絡                            |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Protonサポートに連絡                          |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Tutanotaサポートに連絡                        |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Hushmailサポートに連絡                        |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Mailbox.orgサポートに連絡                     |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Posteoサポートに連絡                          |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | DuckDuckGoサポートに連絡                      |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Sonicサポートに連絡                           |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Telusサポートに連絡                           |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Vodafoneサポートに連絡                         |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Spark NZサポートに連絡                         |
| UOL/BOL (ブラジル)                     | <https://ajuda.uol.com.br/>                                                                                | UOLサポートに連絡（ポルトガル語）             |
| Libero (イタリア)                      | <https://aiuto.libero.it/>                                                                                 | Liberoサポートに連絡（イタリア語）             |
| Telenet (ベルギー)                    | <https://www2.telenet.be/en/support/>                                                                      | Telenetサポートに連絡                         |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Facebookビジネスサポートに連絡                |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | LinkedInサポートに連絡                        |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Groups.ioサポートに連絡                       |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure送信者ツール                       |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Cloudflareサポートに連絡                      |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Hornetsecurityサポートに連絡                   |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | ホスティングプロバイダー経由で連絡            |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Mail2Worldサポートに連絡                      |
> \[!TIP]
> 大量に送信する前に、まずは少量の高品質なメールで良好な評価を築きましょう。

> \[!IMPORTANT]
> ドメインがブラックリストに載っている場合、各ブラックリストには独自の削除手続きがあります。指示はそれぞれのウェブサイトでご確認ください。

> \[!TIP]
> 追加のサポートが必要な場合や、特定のメールサービスプロバイダーに誤ってスパムとしてリストされている場合は、ぜひ <a href="/help">お問い合わせ</a> ください。

### スパムメールを受け取ったらどうすればいいですか {#what-should-i-do-if-i-receive-spam-emails}

可能であればメーリングリストの購読を解除し、送信者をブロックしてください。

メッセージをスパムとして報告するのではなく、手動で管理されプライバシーに配慮した弊社の不正利用防止システムに転送してください。

**スパム転送先のメールアドレスは:** <abuse@forwardemail.net>

### Gmailで自分宛に送ったテストメールが「疑わしい」と表示されるのはなぜですか {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Gmailで自分宛にテストメールを送った際や、エイリアスを使ってメールを送った相手が初めてあなたからのメールを受け取った時にこのエラーが表示される場合がありますが、**ご安心ください**。これはGmailの組み込みの安全機能です。

「安全に見える」をクリックするだけで問題ありません。例えば、送信メールとして「送信者として送信」機能を使ってテストメッセージを他の人に送った場合、その人にはこのメッセージは表示されません。

もし表示される場合は、通常は <john@gmail.com> からのメールを見慣れていて、<john@customdomain.com>（例です）からのメールが初めてだからです。Gmailは安全を確認するためにユーザーに警告を出しています。回避策はありません。

### Gmailで「via forwardemail dot net」を削除できますか {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

このトピックは、[Gmailで送信者名の横に追加情報が表示される広く知られた問題](https://support.google.com/mail/answer/1311182)に関連しています。

2023年5月現在、すべての有料ユーザー向けにSMTP送信をアドオンとしてサポートしているため、Gmailでの <span class="notranslate">via forwardemail dot net</span> 表示を削除できます。

このFAQは、[Gmailで送信者としてメールを送る方法](#how-to-send-mail-as-using-gmail)機能を利用している方向けの内容です。

設定方法については、[SMTP送信をサポートしていますか](#do-you-support-sending-email-with-smtp)のセクションをご覧ください。


## データ管理 {#data-management}

### サーバーはどこにありますか {#where-are-your-servers-located}

> \[!TIP]
> 近々、[forwardemail.eu](https://forwardemail.eu)でホストされるEUデータセンターの場所を発表予定です。最新情報は <https://github.com/orgs/forwardemail/discussions/336> のディスカッションを購読してください。

弊社のサーバーは主にコロラド州デンバーにあります。IPアドレスの完全なリストは <https://forwardemail.net/ips> をご覧ください。

サブプロセッサーについては、[GDPR](/gdpr)、[DPA](/dpa)、[プライバシー](/privacy)のページでご確認いただけます。

### メールボックスのエクスポートとバックアップはどうすればいいですか {#how-do-i-export-and-backup-my-mailbox}

いつでもメールボックスを [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)、[Mbox](https://en.wikipedia.org/wiki/Mbox)、または暗号化された [SQLite](https://en.wikipedia.org/wiki/SQLite) 形式でエクスポートできます。

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス <i class="fa fa-angle-right"></i> バックアップをダウンロード から希望のエクスポート形式を選択してください。

エクスポートが完了すると、ダウンロード用リンクがメールで送信されます。

セキュリティ上の理由から、このダウンロードリンクは4時間で期限切れになります。

エクスポートしたEMLやMbox形式を確認する必要がある場合、以下のオープンソースツールが役立つかもしれません：

| 名前             | 形式   | プラットフォーム | GitHub URL                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | 全プラットフォーム | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | 全プラットフォーム | <https://github.com/s0ph1e/eml-reader>              |
さらに、MboxファイルをEMLファイルに変換する必要がある場合は、<https://github.com/noelmartinon/mboxzilla> を使用できます。

### 既存のメールボックスをインポートおよび移行する方法 {#how-do-i-import-and-migrate-my-existing-mailbox}

以下の手順で簡単にForward Emailにメールをインポートできます（例：[Thunderbird](https://www.thunderbird.net)を使用）：

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    既存のメールをインポートするには、以下のすべての手順を必ず実行してください。
  </span>
</div>

1. 既存のメールプロバイダーからメールをエクスポートします：

   | メールプロバイダー | エクスポート形式                              | エクスポート手順                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail              | MBOX                                         | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook            | PST                                          | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">ヒント:</strong> <span>Outlookを使用している場合（<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PSTエクスポート形式</a>）、以下の「その他」の手順に従うこともできます。ただし、OSに応じてPSTをMBOX/EML形式に変換するためのリンクも以下に示しています：<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Windows用Zinkuba</a>（<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>）</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">Windows cygwin用readpst</a> – （例：<code>readpst -u -o $OUT_DIR $IN_DIR</code>、<code>$OUT_DIR</code>と<code>$IN_DIR</code>はそれぞれ出力ディレクトリと入力ディレクトリのパスに置き換えます）。</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux用readpst</a> – （例：<code>sudo apt-get install readpst</code>の後に<code>readpst -u -o $OUT_DIR $IN_DIR</code>、<code>$OUT_DIR</code>と<code>$IN_DIR</code>はそれぞれ出力ディレクトリと入力ディレクトリのパスに置き換えます）。</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS用readpst（brew経由）</a> – （例：<code>brew install libpst</code>の後に<code>readpst -u -o $OUT_DIR $IN_DIR</code>、<code>$OUT_DIR</code>と<code>$IN_DIR</code>はそれぞれ出力ディレクトリと入力ディレクトリのパスに置き換えます）。</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Windows用PSTコンバーター（GitHub）</a></li></ul><br /></span></div> |
   | Apple Mail         | MBOX                                         | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail           | EML                                          | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail        | MBOX/EML                                     | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota           | EML                                          | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi              | EML                                          | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho               | EML                                          | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | その他             | [Thunderbirdを使用](https://www.thunderbird.net) | 既存のメールアカウントをThunderbirdに設定し、[ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/)プラグインを使用してメールをエクスポートおよびインポートします。**または、アカウント間でメールをコピー＆ペーストまたはドラッグ＆ドロップで移動できる場合もあります。**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. [Thunderbird](https://www.thunderbird.net) をダウンロード、インストールして起動します。

3. エイリアスの完全なメールアドレス（例: <code><you@yourdomain.com></code>）と生成されたパスワードを使って新しいアカウントを作成します。  <strong>まだ生成されたパスワードをお持ちでない場合は、<a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">セットアップ手順をご参照ください</a></strong>。

4. [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbirdプラグインをダウンロードしてインストールします。

5. Thunderbirdで新しいローカルフォルダーを作成し、そのフォルダーを右クリック → `ImportExportTools NG` オプションを選択 → `Import mbox file`（MBOXエクスポート形式の場合）または `Import messages` / `Import all messages from a directory`（EMLエクスポート形式の場合）を選びます。

6. ローカルフォルダーから、IMAPストレージにメッセージをアップロードしたい新規または既存のIMAPフォルダーへドラッグ＆ドロップします。 これにより、SQLite暗号化ストレージでオンラインバックアップが確実に行われます。

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>
       Thunderbirdへのインポート方法がわからない場合は、公式の説明書 <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> および <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a> をご参照ください。
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    エクスポートとインポートのプロセスが完了したら、既存のメールアカウントで転送を有効にし、新しいメールアドレスを送信者に通知する自動応答を設定することも検討してください（例：以前Gmailを使用していて、現在はカスタムドメインのメールを使用している場合など）。
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべての手順を正常に完了しました。
    </span>
  </div>
</div>

### バックアップに自分のS3互換ストレージを使うには {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

有料プランのユーザーは、ドメインごとに独自の[S3](https://en.wikipedia.org/wiki/Amazon_S3)互換ストレージプロバイダーをIMAP/SQLiteバックアップ用に設定できます。 これにより、暗号化されたメールボックスのバックアップを当社のデフォルトストレージの代わりに（または追加で）ご自身のインフラに保存できます。

対応プロバイダーには、[Amazon S3](https://aws.amazon.com/s3/)、[Cloudflare R2](https://developers.cloudflare.com/r2/)、[MinIO](https://github.com/minio/minio)、[Backblaze B2](https://www.backblaze.com/cloud-storage)、[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces)、およびその他のS3互換サービスが含まれます。

#### セットアップ {#setup}

1. S3互換プロバイダーで**プライベート**バケットを作成します。バケットは公開アクセス不可でなければなりません。
2. バケットに対する読み書き権限を持つアクセス認証情報（アクセスキーIDとシークレットアクセスキー）を作成します。
3. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 詳細設定 <i class="fa fa-angle-right"></i> カスタムS3互換ストレージ に移動します。
4. **「カスタムS3互換ストレージを有効にする」** をチェックし、エンドポイントURL、アクセスキーID、シークレットアクセスキー、リージョン、バケット名を入力します。
5. **「接続テスト」** をクリックして認証情報、バケットアクセス、書き込み権限を確認します。
6. **「保存」** をクリックして設定を適用します。

#### バックアップの仕組み {#how-backups-work}

バックアップは接続されたすべてのIMAPエイリアスごとに自動的にトリガーされます。IMAPサーバーは1時間に1回すべてのアクティブ接続をチェックし、接続された各エイリアスのバックアップを実行します。Redisベースのロックにより30分以内の重複バックアップは防止され、過去24時間以内に成功したバックアップがある場合は実際のバックアップはスキップされます（ユーザーがダウンロードのために明示的にバックアップを要求した場合を除く）。
バックアップは、ダッシュボードの任意のエイリアスで**「Download Backup」**をクリックすることで手動でもトリガーできます。手動バックアップは24時間のウィンドウに関係なく常に実行されます。

バックアッププロセスは以下のように動作します：

1. SQLiteデータベースは`VACUUM INTO`を使ってコピーされます。これにより、アクティブな接続を中断せずに一貫したスナップショットが作成され、データベースの暗号化が保持されます。
2. バックアップファイルは開いて暗号化が有効であることを確認し、検証されます。
3. SHA-256ハッシュが計算され、ストレージ内の既存バックアップと比較されます。ハッシュが一致する場合はアップロードがスキップされます（前回のバックアップ以降変更なし）。
4. バックアップは[@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage)ライブラリを使ったマルチパートアップロードでS3にアップロードされます。
5. 署名付きダウンロードURL（4時間有効）が生成され、ユーザーにメール送信されます。

#### バックアップ形式 {#backup-formats}

3つのバックアップ形式がサポートされています：

| 形式     | 拡張子    | 説明                                                                 |
| -------- | --------- | ------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | 生の暗号化されたSQLiteデータベーススナップショット（自動IMAPバックアップのデフォルト） |
| `mbox`   | `.zip`    | mbox形式のメールボックスを含むパスワード保護ZIP                      |
| `eml`    | `.zip`    | メッセージごとの個別の`.eml`ファイルを含むパスワード保護ZIP          |

> **ヒント：** `.sqlite`バックアップファイルを持っていてローカルで`.eml`ファイルに変換したい場合は、スタンドアロンCLIツール**[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**を使用してください。Windows、Linux、macOSで動作し、ネットワーク接続は不要です。

#### ファイル命名とキー構造 {#file-naming-and-key-structure}

**カスタムS3ストレージ**を使用する場合、バックアップファイルは[ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)タイムスタンプのプレフィックス付きで保存され、各バックアップが別々のオブジェクトとして保持されます。これにより、ご自身のバケットで完全なバックアップ履歴が得られます。

キーの形式は以下の通りです：

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

例：

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id`はエイリアスのMongoDB ObjectIdです。エイリアス設定ページまたはAPIで確認できます。

**デフォルト（システム）ストレージ**を使用する場合、キーはフラット（例：`65a31c53c36b75ed685f3fda.sqlite`）で、各バックアップは前のものを上書きします。

> **注意：** カスタムS3ストレージはすべてのバックアップバージョンを保持するため、ストレージ使用量は時間とともに増加します。バケットに対して[lifecycleルール](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)を設定し、古いバックアップを自動的に期限切れ（例：30日または90日以上のオブジェクトを削除）にすることを推奨します。

#### データ所有権と削除ポリシー {#data-ownership-and-deletion-policy}

カスタムS3バケットは完全にお客様の管理下にあります。エイリアス削除時、ドメイン削除時、またはクリーンアップ操作時にも、カスタムS3バケット内のファイルを**削除または変更することは一切ありません**。新しいバックアップファイルを書き込むだけです。

つまり：

* **エイリアス削除** — エイリアスを削除すると、デフォルトのシステムストレージからのみバックアップが削除されます。カスタムS3バケットに以前書き込まれたバックアップはそのまま残ります。
* **ドメイン削除** — ドメインを削除してもカスタムバケット内のファイルには影響しません。
* **保持管理** — 古いバックアップを期限切れにするためのライフサイクルルール設定など、バケット内のストレージ管理はお客様の責任です。

カスタムS3ストレージを無効にするかデフォルトストレージに戻した場合でも、バケット内の既存ファイルは保持されます。今後のバックアップは単にデフォルトストレージに書き込まれます。

#### セキュリティ {#security}

* アクセスキーIDとシークレットアクセスキーは、データベースに保存される前に[AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)で**静止時に暗号化**されます。バックアップ操作時にのみ実行時に復号されます。
* バケットが**公開アクセス不可**であることを自動的に検証します。公開バケットが検出された場合、保存時に設定は拒否されます。バックアップ時に公開アクセスが検出された場合はデフォルトストレージにフォールバックし、すべてのドメイン管理者にメールで通知します。
* バケットの存在と認証情報の正確性は、保存時に[HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html)コールで検証されます。検証に失敗するとカスタムS3ストレージは自動的に無効化されます。
* 各バックアップファイルにはS3メタデータにSHA-256ハッシュが含まれており、変更のないデータベースを検出して冗長なアップロードをスキップするために使用されます。
#### エラー通知 {#error-notifications}

カスタムS3ストレージを使用してバックアップが失敗した場合（例：資格情報の期限切れや接続問題など）、すべてのドメイン管理者にメールで通知されます。これらの通知は重複アラートを防ぐために6時間に1回のレート制限がかけられています。バックアップ時にバケットが公開アクセス可能と検出された場合、管理者には1日1回通知されます。

#### API {#api}

API経由でもカスタムS3ストレージを設定できます：

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

API経由で接続をテストするには：

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### SQLiteバックアップをEMLファイルに変換する方法 {#how-do-i-convert-sqlite-backups-to-eml-files}

SQLiteバックアップをダウンロードまたは保存した場合（デフォルトストレージまたはご自身の[カスタムS3バケット](#how-do-i-use-my-own-s3-compatible-storage-for-backups)から）、スタンドアロンCLIツール **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** を使って標準の `.eml` ファイルに変換できます。EMLファイルは任意のメールクライアント（[Thunderbird](https://www.thunderbird.net/)、[Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook)、[Apple Mail](https://support.apple.com/mail)など）で開くことができ、他のメールサーバーにインポートすることも可能です。

#### インストール {#installation-1}

事前ビルド済みバイナリ（[Node.js](https://github.com/nodejs/node)不要）をダウンロードするか、[Node.js](https://github.com/nodejs/node)で直接実行できます：

**事前ビルド済みバイナリ** — ご利用のプラットフォーム向け最新リリースを[GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases)からダウンロードしてください：

| プラットフォーム | アーキテクチャ | ファイル                                  |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOSユーザーへ:** ダウンロード後、バイナリを実行する前に検疫属性を削除する必要がある場合があります：
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> （`./convert-sqlite-to-eml-darwin-arm64`はダウンロードしたファイルの実際のパスに置き換えてください。）

> **Linuxユーザーへ:** ダウンロード後、バイナリに実行権限を付与する必要がある場合があります：
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> （`./convert-sqlite-to-eml-linux-x64`はダウンロードしたファイルの実際のパスに置き換えてください。）

**ソースから**（[Node.js](https://github.com/nodejs/node) >= 18が必要）：

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### 使い方 {#usage}

このツールは対話モードと非対話モードの両方をサポートしています。

**対話モード** — 引数なしで実行すると、すべての入力を対話形式で求められます：

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Convert SQLite Backup to EML
  =============================================

  Path to SQLite backup file: /path/to/backup.sqlite
  IMAP/alias password: ********
  Output ZIP path [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**非対話モード** — スクリプトや自動化のためにコマンドラインフラグで引数を渡します：

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| フラグ                | 説明                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | 暗号化されたSQLiteバックアップファイルのパス                                       |
| `--password <pass>` | 復号用のIMAP/エイリアスパスワード                                             |
| `--output <path>`   | ZIPファイルの出力パス（デフォルト：ISO 8601タイムスタンプ付きで自動生成） |
| `--help`            | ヘルプメッセージを表示                                                              |
#### 出力形式 {#output-format}

このツールは、パスワード保護されたZIPアーカイブ（AES-256暗号化）を生成します。内容は以下の通りです：

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EMLファイルはメールボックスのフォルダごとに整理されています。ZIPのパスワードはIMAP/エイリアスのパスワードと同じです。各 `.eml` ファイルは、SQLiteデータベースから再構築された完全なヘッダー、本文テキスト、添付ファイルを含む標準の[RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322)メールメッセージです。

#### 仕組み {#how-it-works}

1. IMAP/エイリアスのパスワードを使って暗号化されたSQLiteデータベースを開きます（[ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305)および[AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)暗号に対応）。
2. Mailboxesテーブルを読み込み、フォルダ構造を検出します。
3. 各メッセージについて、Messagesテーブルに保存された[Brotli](https://github.com/google/brotli)圧縮JSON形式のmimeTreeをデコードします。
4. MIMEツリーを辿り、Attachmentsテーブルから添付ファイルの本文を取得して完全なEMLを再構築します。
5. すべてを[archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted)を使ってパスワード保護ZIPアーカイブにまとめます。

### セルフホスティングは対応していますか {#do-you-support-self-hosting}

はい、2025年3月現在、セルフホスティングオプションをサポートしています。ブログは[こちら](https://forwardemail.net/blog/docs/self-hosted-solution)をご覧ください。開始するには[セルフホストガイド](https://forwardemail.net/self-hosted)を参照してください。より詳細なステップバイステップ版を希望される方は、[Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)または[Debian](https://forwardemail.net/guides/selfhosted-on-debian)ベースのガイドをご覧ください。


## メール設定 {#email-configuration}

### メール転送の開始方法と設定方法 {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">推定設定時間：</strong>
  <span>10分未満</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    はじめに：
  </strong>
  <span>
    以下の1から8までの手順を注意深く読み、順に従ってください。<code>user@gmail.com</code> のメールアドレスは、転送先のメールアドレスに正しく置き換えてください（すでに正しい場合はそのままで構いません）。同様に、<code>example.com</code> はカスタムドメイン名に置き換えてください（すでに正しい場合はそのままで構いません）。
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">すでにどこかでドメイン名を登録済みの場合は、このステップは完全にスキップしてステップ2に進んでください！ そうでなければ、<a href="/domain-registration" rel="noopener noreferrer">こちらをクリックしてドメイン名を登録</a>してください。</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  ドメインをどこで登録したか覚えていますか？ 思い出したら、以下の指示に従ってください：

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    新しいタブを開いてドメインレジストラにサインインしてください。下記の「Registrar」をクリックすると自動的に開けます。この新しいタブでレジストラのDNS管理ページに移動してください。移動手順は「Steps to Configure」列にステップバイステップで記載しています。新しいタブで該当ページに移動したら、このタブに戻り、次のステップ3に進んでください。
    <strong class="font-weight-bold">開いたタブは閉じないでください。今後の手順で必要になります！</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>レジストラ</th>
      <th>設定手順</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ドメインセンター <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> DNS設定編集</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ホステッドゾーン <i class="fa fa-angle-right"></i> （ドメイン選択）</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> マイサーバー <i class="fa fa-angle-right"></i> ドメイン管理 <i class="fa fa-angle-right"></i> DNSマネージャー</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ROCK版：ログイン <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> （管理の▼アイコンをクリック） <i class="fa fa-angle-right"></i> DNS
      <br />
      レガシー版：ログイン <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> ゾーンエディター <i class="fa fa-angle-right"></i> （ドメイン選択）</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> （ドメイン選択）</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> 管理</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ネットワーキング <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> その他 <i class="fa fa-angle-right"></i> ドメイン管理</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> カードビューでドメインの管理をクリック <i class="fa fa-angle-right"></i> リストビューで歯車アイコンをクリック <i class="fa fa-angle-right"></i> DNS &amp; ネームサーバー <i class="fa fa-angle-right"></i> DNSレコード</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> 視聴</a>
      </td>
      <td>ログイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> （歯車アイコンをクリック） <i class="fa fa-angle-right"></i> 左メニューのDNS &amp; ネームサーバーをクリック</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> パネル <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> ドメイン管理 <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> 概要 <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> シンプルエディター <i class="fa fa-angle-right"></i> レコード</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> ゾーン編集</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> 視聴</a>
      </td>
      <td>ログイン <i class="fa fa-angle-right"></i> マイドメイン管理 <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> DNS管理</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> 視聴</a>
      </td>
      <td>ログイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> DNS設定</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> 視聴</a>
      </td>
      <td>ログイン <i class="fa fa-angle-right"></i> ドメインリスト <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 高度なDNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> Netlify DNS設定</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> アカウントマネージャー <i class="fa fa-angle-right"></i> マイドメイン名 <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> ドメインのポイント先変更 <i class="fa fa-angle-right"></i> 高度なDNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> 視聴</a>
      </td>
      <td>ログイン <i class="fa fa-angle-right"></i> 管理ドメイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> DNS設定</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ホームメニュー <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i>
高度な設定 <i class="fa fa-angle-right"></i> カスタムレコード</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>"now" CLIを使用 <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ドメインページ <i class="fa fa-angle-right"></i> （ドメイン選択） <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ドメインページ <i class="fa fa-angle-right"></i> （<i class="fa fa-ellipsis-h"></i> アイコンをクリック） <i class="fa fa-angle-right"></i> DNSレコード管理を選択</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>ログイン <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> マイドメイン</td>
    </tr>
    <tr>
      <td>その他</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">重要：</strong> レジストラ名がリストにない場合は、インターネットで「$REGISTRARでDNSレコードを変更する方法」（$REGISTRARはご利用のレジストラ名に置き換えてください。例：「GoDaddyでDNSレコードを変更する方法」）を検索してください。</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">レジストラのDNS管理ページ（開いている別タブ）を使い、以下の「MX」レコードを設定してください：
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    他のMXレコードが設定されていないことを確認してください。以下に示す両方のレコードが必ず存在する必要があります。タイプミスがないか、mx1とmx2のスペルが正しいかを必ず確認してください。既にMXレコードが存在している場合は、完全に削除してください。
    「TTL」の値は3600である必要はなく、必要に応じて低い値や高い値でも構いません。
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">レジストラのDNS管理ページ（開いている別のタブ）を使用して、以下の<strong class="notranslate">TXT</strong>レコードを設定してください:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    有料プランをご利用の場合は、このステップを完全にスキップしてステップ5に進んでください！有料プランでない場合、転送先のアドレスは公開検索可能になります – <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> にアクセスし、必要に応じてドメインを有料プランにアップグレードしてください。有料プランについて詳しく知りたい場合は、当社の<a rel="noopener noreferrer" href="/private-business-email" class="alert-link">料金ページ</a>をご覧ください。そうでなければ、以下に記載のオプションAからオプションFのいずれか、または複数の組み合わせを選択して続行できます。
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプションA:
  </strong>
  <span>
    ドメインからのすべてのメール（例: "all@example.com", "hello@example.com" など）を特定のアドレス "user@gmail.com" に転送する場合:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    上記の「値」欄の値は、ご自身のメールアドレスに置き換えてください。「TTL」の値は3600である必要はなく、必要に応じて低い値や高い値でも構いません。TTL（Time to Live）値を低く設定すると、DNSレコードの将来の変更がインターネット全体により速く伝播されます。これはキャッシュされる時間（秒単位）と考えてください。<a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">WikipediaのTTLに関するページ</a>で詳細を学べます。
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプションB:
  </strong>
  <span>
    単一のメールアドレスのみを転送する場合（例: <code>hello@example.com</code> を <code>user@gmail.com</code> に転送する場合；これにより "hello+test@example.com" も自動的に "user+test@gmail.com" に転送されます）:
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプション C:
  </strong>
  <span>
    複数のメールを転送する場合は、カンマで区切ってください:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプション D:
  </strong>
  <span>
    転送メールは無限に設定可能です。ただし、1行あたり255文字を超えないようにし、各行は必ず "forward-email=" で始めてください。以下に例を示します:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプション E:
  </strong>
  <span>
    <strong class="notranslate">TXT</strong> レコードにドメイン名を指定して、グローバルエイリアス転送を設定することもできます（例："user@example.com" は "user@example.net" に転送されます）:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプション F:
  </strong>
  <span>
    グローバルまたは個別のエイリアスとしてウェブフックを使用し、メールを転送することも可能です。以下の例とウェブフックに関する完全なセクションは<a href="#do-you-support-webhooks" class="alert-link">ウェブフックはサポートしていますか</a>をご覧ください。
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプション G:
  </strong>
  <span>
    エイリアスのマッチングや転送先の置換処理に正規表現（"regex"）を使用することもできます。以下の例と正規表現に関する完全なセクション<a href="#do-you-support-regular-expressions-or-regex" class="alert-link">正規表現やregexはサポートしていますか</a>をご覧ください。
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>置換を伴う高度な正規表現が必要ですか？</strong> 以下の例と正規表現に関する完全なセクション<a href="#do-you-support-regular-expressions-or-regex" class="alert-link">正規表現やregexはサポートしていますか</a>をご覧ください。
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>簡単な例:</strong> `linus@example.com` または `torvalds@example.com` に届くすべてのメールを `user@gmail.com` に転送したい場合:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    キャッチオール転送ルールは「フォールスルー」とも表現できます。
    これは、少なくとも1つの特定の転送ルールにマッチする受信メールはキャッチオールの代わりにそのルールが使用されることを意味します。
    特定のルールにはメールアドレスや正規表現が含まれます。
    <br /><br />
    例えば:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    この設定では <code>hello@example.com</code> に送られたメールは <code>second@gmail.com</code>（キャッチオール）には**転送されず**、代わりに <code>first@gmail.com</code> にのみ配信されます。
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">レジストラのDNS管理ページ（別タブで開いているもの）を使用して、以下の<strong class="notranslate">TXT</strong>レコードを追加で設定してください:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    Gmail（例: Send Mail As）やG Suiteを使用している場合は、上記の値に <code>include:_spf.google.com</code> を追加する必要があります。例えば:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    すでに "v=spf1" を含む類似の行がある場合は、既存の "include:host.com" レコードの直前かつ同じ行の "-all" の前に <code>include:spf.forwardemail.net</code> を追加してください。例えば:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    "-all" と "~all" には違いがあります。"-" はマッチしなければSPFチェックが失敗（FAIL）することを示し、"~" はソフトフェイル（SOFTFAIL）を示します。ドメインのなりすまし防止のために "-all" の使用を推奨します。
    <br /><br />
    また、メール送信に使用するホスト（例: Outlook）のSPFレコードを含める必要がある場合もあります。
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">「レコードの確認」ツールを使ってDNSレコードを確認してください。ツールは<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定にあります。

</li><li class="mb-2 mb-md-3 mb-lg-5">テストメールを送信して動作を確認してください。DNSレコードの反映には時間がかかる場合があります。

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
  </span>
    テストメールが届かない場合や、「このメッセージに注意してください」という内容のテストメールが届く場合は、<a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">なぜテストメールが届かないのか</a>と<a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">なぜGmailで自分宛のテストメールが「疑わしい」と表示されるのか</a>の回答をご覧ください。
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Gmailから「送信者として送信」したい場合は、<strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">この動画を視聴する</a></strong>か、以下の<a href="#how-to-send-mail-as-using-gmail">Gmailを使った送信者としての送信方法</a>の手順に従ってください。

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべての手順を正常に完了しました。
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    以下にオプションのアドオンを記載しています。これらのアドオンは完全に任意であり、必ずしも必要ではありません。必要に応じて追加情報としてご提供しています。
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    オプションのアドオン:
  </strong>
  <span>
    <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Gmailを使った送信者としての送信方法</a>機能を利用している場合は、ご自身を許可リストに追加することを検討してください。この件に関しては<a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmailのこちらの説明</a>をご覧ください。
  </span>
</div>

### 高度な転送のために複数のMX交換機やサーバーを使えますか {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

はい、可能ですが、**DNSレコードにはMX交換機を1つだけ記載するべきです**。

複数のMX交換機を設定するために「優先度」を使おうとしないでください。

代わりに、既存のMX交換機を設定して、マッチしないエイリアスのメールをすべて当サービスの交換機（`mx1.forwardemail.net` および/または `mx2.forwardemail.net`）に転送する必要があります。

Google Workspaceを使用していて、マッチしないエイリアスのメールをすべて当サービスに転送したい場合は、<https://support.google.com/a/answer/6297084>をご覧ください。

Microsoft 365（Outlook）を使用していて、マッチしないエイリアスのメールをすべて当サービスに転送したい場合は、<https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> および <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>をご覧ください。

### 休暇応答（不在自動応答）を設定するにはどうすればよいですか {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスに移動し、休暇自動応答を設定したいエイリアスを作成または編集してください。
開始日、終了日、件名、メッセージを設定し、いつでも有効化または無効化することができます：

* 現在はプレーンテキストの件名とメッセージがサポートされています（内部的に `striptags` パッケージを使用してHTMLを除去しています）。
* 件名は100文字以内に制限されています。
* メッセージは1000文字以内に制限されています。
* 設定にはアウトバウンドSMTPの構成が必要です（例：DKIM、DMARC、およびReturn-PathのDNSレコードを設定する必要があります）。
  * <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> アウトバウンドSMTP構成 に移動し、設定手順に従ってください。
* バケーションレスポンダーはグローバルなバニティドメイン名では有効にできません（例：[使い捨てアドレス](/disposable-addresses)はサポートされていません）。
* バケーションレスポンダーはワイルドカード/キャッチオール（`*`）や正規表現を含むエイリアスでは有効にできません。

`postfix` のようなメールシステム（例：`sieve` のバケーションフィルター拡張を使用するもの）とは異なり、Forward Emailは自動的にDKIM署名を追加し、バケーションレスポンス送信時の接続問題（例：一般的なSSL/TLS接続問題やレガシーサーバーの問題）をダミーで防止し、さらにバケーションレスポンスに対してOpen WKDおよびPGP暗号化もサポートしています。

<!--
* 悪用防止のため、送信されるバケーションレスポンダーメッセージごとに1つのアウトバウンドSMTPクレジットが差し引かれます。
  * すべての有料アカウントにはデフォルトで1日あたり300クレジットが含まれています。より多く必要な場合はお問い合わせください。
-->

1. [許可リスト](#do-you-have-an-allowlist)にある送信者には4日ごとに1回のみ送信します（これはGmailの動作に似ています）。

   * Redisキャッシュは `alias_id` と `sender` のフィンガープリントを使用します。`alias_id` はエイリアスのMongoDB IDで、`sender` は許可リストにある場合はFromアドレス、許可リストにない場合はFromアドレスのルートドメインです。簡単のため、このフィンガープリントのキャッシュ有効期限は4日に設定されています。

   * 許可リストにない送信者に対してFromアドレスのルートドメインを使用する方法は、比較的知られていない送信者（例：悪意のある行為者）によるバケーションレスポンダーメッセージの大量送信を防止します。

2. MAIL FROMおよび/またはFromが空白でないこと、かつ（大文字・小文字を区別せず）[ポストマスターのユーザー名](#what-are-postmaster-addresses)（メールアドレスの@の前の部分）を含まない場合にのみ送信します。

3. 元のメッセージに以下のヘッダーが含まれている場合は送信しません（大文字・小文字を区別しません）：

   * `auto-submitted` ヘッダーで値が `no` でないもの。
   * `x-auto-response-suppress` ヘッダーで値が `dr`、`autoreply`、`auto-reply`、`auto_reply`、または `all` のもの。
   * `list-id`、`list-subscribe`、`list-unsubscribe`、`list-help`、`list-post`、`list-owner`、`list-archive`、`x-autoreply`、`x-autorespond`、または `x-auto-respond` ヘッダー（値に関係なく）。
   * `precedence` ヘッダーで値が `bulk`、`autoreply`、`auto-reply`、`auto_reply`、または `list` のもの。

4. MAIL FROMまたはFromのメールアドレスが `+donotreply`、`-donotreply`、`+noreply`、または `-noreply` で終わる場合は送信しません。

5. Fromのメールアドレスのユーザー名部分が `mdaemon` で、かつ大文字・小文字を区別しない `X-MDDSN-Message` ヘッダーがある場合は送信しません。

6. 大文字・小文字を区別しない `content-type` ヘッダーが `multipart/report` の場合は送信しません。

### Forward EmailのSPF設定方法 {#how-do-i-set-up-spf-for-forward-email}

レジストラのDNS管理ページを使用して、以下の <strong class="notranslate">TXT</strong> レコードを設定してください：

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    Gmail（例：Send Mail As）やG Suiteを使用している場合は、上記の値に <code>include:_spf.google.com</code> を追加する必要があります。例えば：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    Microsoft Outlook または Live.com を使用している場合は、SPF の <strong class="notranslate">TXT</strong> レコードに <code>include:spf.protection.outlook.com</code> を追加する必要があります。例：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    すでに "v=spf1" を含む類似の行がある場合は、既存の "include:host.com" レコードの直前かつ同じ行の "-all" の前に <code>include:spf.forwardemail.net</code> を追加する必要があります。例：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    "-all" と "~all" には違いがあります。"-" は SPF チェックが一致しない場合に失敗（FAIL）を示し、"~" はソフトフェイル（SOFTFAIL）を示します。ドメインのなりすまし防止のために "-all" の使用を推奨します。
    <br /><br />
    また、メールを送信するホスト（例：Outlook）の SPF レコードを含める必要がある場合もあります。
  </span>
</div>

### Forward Email の DKIM 設定方法 {#how-do-i-set-up-dkim-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> アウトバウンド SMTP 設定 に移動し、セットアップ手順に従ってください。

### Forward Email の DMARC 設定方法 {#how-do-i-set-up-dmarc-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> アウトバウンド SMTP 設定 に移動し、セットアップ手順に従ってください。

### DMARC レポートの確認方法 {#how-do-i-view-dmarc-reports}

Forward Email は包括的な DMARC レポートダッシュボードを提供しており、すべてのドメインのメール認証パフォーマンスを単一のインターフェースで監視できます。

**DMARC レポートとは？**

DMARC（Domain-based Message Authentication, Reporting, and Conformance）レポートは、受信メールサーバーから送信される XML ファイルで、メールの認証状況を教えてくれます。これらのレポートは以下の理解に役立ちます：

* ドメインから送信されているメールの数
* それらのメールが SPF および DKIM 認証に合格しているかどうか
* 受信サーバーが取っている処理（受け入れ、隔離、拒否）
* ドメインを代表してメールを送信している IP アドレス

**DMARC レポートへのアクセス方法**

<a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> DMARC レポート</a> にアクセスしてダッシュボードを確認してください。また、<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> から各ドメインの横にある「DMARC」ボタンをクリックしてドメイン別レポートにもアクセスできます。

**ダッシュボードの機能**

DMARC レポートダッシュボードには以下が含まれます：

* **概要指標**：受信したレポート総数、解析したメッセージ総数、SPF 整合率、DKIM 整合率、全体の合格率
* **時間経過によるメッセージ数チャート**：過去30日間のメール量と認証率の視覚的傾向
* **整合性概要**：SPF と DKIM の整合分布を示すドーナツチャート
* **メッセージ処理状況**：受信サーバーがメールをどのように処理したか（受け入れ、隔離、拒否）を示す積み上げ棒グラフ
* **最近のレポート一覧**：個別の DMARC レポートの詳細リスト（フィルタリングとページネーション対応）
* **ドメインフィルタリング**：複数ドメインを管理している場合に特定ドメインのレポートを絞り込み可能
**なぜこれが重要なのか**

複数のドメインを管理する組織（企業、非営利団体、代理店など）にとって、DMARCレポートは以下のために不可欠です：

* **不正な送信者の特定**：誰かがあなたのドメインをなりすましているか検出する
* **配信成功率の向上**：正当なメールが認証を通過することを保証する
* **メールインフラの監視**：どのサービスやIPがあなたの代理で送信しているかを追跡する
* **コンプライアンス**：セキュリティ監査のためにメール認証の可視性を維持する

他のサービスのように別途DMARC監視ツールが必要な場合と異なり、Forward Emailは追加費用なしでアカウントの一部としてDMARCレポートの処理と可視化を含んでいます。

**要件**

* DMARCレポートは有料プランのみ利用可能
* ドメインにDMARCが設定されている必要があります（[Forward EmailでのDMARC設定方法](#how-do-i-set-up-dmarc-for-forward-email)を参照）
* レポートは受信メールサーバーが設定されたDMARC報告用アドレスに送信すると自動的に収集されます

**週次メールレポート**

有料プランのユーザーは自動的に週次のDMARCレポート概要をメールで受け取ります。これらのメールには以下が含まれます：

* すべてのドメインの概要統計
* SPFおよびDKIMの整合率
* メッセージの処理状況の内訳（受信、隔離、拒否）
* 主な報告組織（Google、Microsoft、Yahooなど）
* 注意が必要な整合性問題のあるIPアドレス
* DMARCレポートダッシュボードへの直接リンク

週次レポートは自動的に送信され、他のメール通知とは別に無効にすることはできません。

### 連絡先の接続と設定方法 {#how-do-i-connect-and-configure-my-contacts}

**連絡先を設定するには、以下のCardDAV URLを使用してください：** `https://carddav.forwardemail.net`（クライアントが許可する場合は単に `carddav.forwardemail.net` でも可）

### カレンダーの接続と設定方法 {#how-do-i-connect-and-configure-my-calendars}

**カレンダーを設定するには、以下のCalDAV URLを使用してください：** `https://caldav.forwardemail.net`（クライアントが許可する場合は単に `caldav.forwardemail.net` でも可）

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### 追加のカレンダーの追加と既存カレンダーの管理方法 {#how-do-i-add-more-calendars-and-manage-existing-calendars}

追加のカレンダーを追加したい場合は、新しいカレンダーURLとして以下を追加してください：`https://caldav.forwardemail.net/dav/principals/calendar-name`（**`calendar-name` は希望のカレンダー名に置き換えてください**）

カレンダーの名前や色は作成後に変更可能です。お好みのカレンダーアプリ（例：Apple Mailや[Thunderbird](https://thunderbird.net)）を使用してください。

### タスクとリマインダーの接続と設定方法 {#how-do-i-connect-and-configure-tasks-and-reminders}

**タスクとリマインダーを設定するには、カレンダーと同じCalDAV URLを使用してください：** `https://caldav.forwardemail.net`（クライアントが許可する場合は単に `caldav.forwardemail.net` でも可）

タスクとリマインダーはカレンダーイベントから自動的に分離され、「リマインダー」または「タスク」カレンダーコレクションとして管理されます。

**プラットフォーム別セットアップ手順：**

**macOS/iOS:**

1. システム環境設定 > インターネットアカウント（iOSでは設定 > アカウント）で新しいCalDAVアカウントを追加
2. サーバーに `caldav.forwardemail.net` を使用
3. Forward Emailのエイリアスと生成されたパスワードを入力
4. 設定後、「カレンダー」と「リマインダー」の両方のコレクションが表示される
5. リマインダーアプリでタスクの作成と管理が可能

**Android（Tasks.org使用時）：**

1. Google PlayストアまたはF-DroidからTasks.orgをインストール
2. 設定 > 同期 > アカウント追加 > CalDAVへ進む
3. サーバーに `https://caldav.forwardemail.net` を入力
4. Forward Emailのエイリアスと生成されたパスワードを入力
5. Tasks.orgが自動的にタスクカレンダーを検出

**Thunderbird:**

1. Lightningアドオンが未インストールの場合はインストール
2. 「CalDAV」タイプの新しいカレンダーを作成
3. URLに `https://caldav.forwardemail.net` を使用
4. Forward Emailの認証情報を入力
5. イベントとタスクの両方がカレンダーインターフェースで利用可能

### macOSリマインダーでタスクを作成できない理由 {#why-cant-i-create-tasks-in-macos-reminders}
macOSのリマインダーでタスク作成に問題がある場合は、以下のトラブルシューティング手順を試してください：

1. **アカウント設定を確認**：CalDAVアカウントが `caldav.forwardemail.net` で正しく設定されていることを確認してください

2. **カレンダーの分離を確認**：アカウントに「カレンダー」と「リマインダー」の両方が表示されているはずです。「カレンダー」だけの場合、タスクサポートがまだ完全に有効になっていない可能性があります

3. **アカウントを更新**：システム環境設定 > インターネットアカウントでCalDAVアカウントを一度削除してから再追加してみてください

4. **サーバー接続を確認**：ブラウザで `https://caldav.forwardemail.net` にアクセスできるかテストしてください

5. **認証情報を確認**：正しいエイリアスメールアドレスと生成されたパスワード（アカウントパスワードではない）を使用していることを確認してください

6. **強制同期**：リマインダーアプリでタスクを作成し、手動で同期を更新してみてください

**よくある問題：**

* **「リマインダーのカレンダーが見つかりません」**：初回アクセス時にサーバーがリマインダーコレクションを作成するのに少し時間がかかる場合があります
* **タスクが同期されない**：両方のデバイスで同じCalDAVアカウントの認証情報を使っているか確認してください
* **混在したコンテンツ**：タスクは一般の「カレンダー」ではなく「リマインダー」カレンダーに作成されていることを確認してください

### AndroidでTasks.orgを設定する方法 {#how-do-i-set-up-tasksorg-on-android}

Tasks.orgはForward EmailのCalDAVタスクサポートと非常に相性の良い人気のオープンソースタスクマネージャーです。

**インストールと設定：**

1. **Tasks.orgをインストール**：
   * Google Playストアから：[Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * F-Droidから：[Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **CalDAV同期を設定**：
   * Tasks.orgを開く
   * ☰ メニュー > 設定 > 同期 に進む
   * 「アカウントを追加」をタップ
   * 「CalDAV」を選択

3. **Forward Emailの設定を入力**：
   * **サーバーURL**：`https://caldav.forwardemail.net`
   * **ユーザー名**：Forward Emailのエイリアス（例：`you@yourdomain.com`）
   * **パスワード**：エイリアス専用の生成パスワード
   * 「アカウントを追加」をタップ

4. **アカウント検出**：
   * Tasks.orgが自動的にタスクカレンダーを検出します
   * 「リマインダー」コレクションが表示されるはずです
   * 同期を有効にするため「購読」をタップ

5. **同期テスト**：
   * Tasks.orgでテストタスクを作成
   * 他のCalDAVクライアント（macOSリマインダーなど）に表示されるか確認
   * 双方向で変更が同期されることを確認

**利用可能な機能：**

* ✅ タスクの作成と編集
* ✅ 期限日とリマインダー
* ✅ タスクの完了とステータス
* ✅ 優先度レベル
* ✅ サブタスクとタスク階層
* ✅ タグとカテゴリ
* ✅ 他のCalDAVクライアントとの双方向同期

**トラブルシューティング：**

* タスクカレンダーが表示されない場合は、Tasks.orgの設定で手動更新を試してください
* サーバーに少なくとも1つタスクが作成されていることを確認してください（macOSリマインダーで先に作成可能）
* `caldav.forwardemail.net` へのネットワーク接続を確認してください

### Forward EmailでSRSを設定する方法 {#how-do-i-set-up-srs-for-forward-email}

[Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（「SRS」）は自動的に設定されますので、ご自身で設定する必要はありません。

### Forward EmailでMTA-STSを設定する方法 {#how-do-i-set-up-mta-sts-for-forward-email}

詳細は[当社のMTA-STSに関するセクション](#do-you-support-mta-sts)をご参照ください。

### メールアドレスにプロフィール画像を追加する方法 {#how-do-i-add-a-profile-picture-to-my-email-address}

Gmailを使用している場合は、以下の手順に従ってください：

1. <https://google.com> にアクセスし、すべてのメールアカウントからサインアウトする
2. 「サインイン」をクリックし、ドロップダウンから「別のアカウント」をクリック
3. 「別のアカウントを使用」を選択
4. 「アカウントを作成」を選択
5. 「代わりに現在のメールアドレスを使用」を選択
6. カスタムドメインのメールアドレスを入力
7. メールアドレスに送信された確認メールを受け取る
8. そのメールに記載された確認コードを入力
9. 新しいGoogleアカウントのプロフィール情報を入力
10. プライバシーと利用規約にすべて同意
11. <https://google.com> にアクセスし、右上のプロフィールアイコンをクリックして「変更」ボタンをクリック
12. 新しい写真またはアバターをアップロード
13. 変更は約1〜2時間で反映されますが、場合によっては非常に速いこともあります
14. テストメールを送信するとプロフィール写真が表示されるはずです。
## 高度な機能 {#advanced-features}

### マーケティング関連のメールのためのニュースレターやメーリングリストをサポートしていますか {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

はい、詳細は <https://forwardemail.net/guides/newsletter-with-listmonk> をご覧ください。

IPの評判を維持し、配信可能性を確保するために、Forward Emailでは**ニュースレター承認**のためにドメインごとに手動レビューのプロセスがあります。承認を希望される場合は <support@forwardemail.net> までメールを送るか、[ヘルプリクエスト](https://forwardemail.net/help)を開いてください。通常24時間以内に対応し、多くのリクエストは1〜2時間以内に承認されます。近い将来、追加のスパム制御とアラート機能によりこのプロセスを即時化する予定です。このプロセスにより、メールが受信トレイに届き、メッセージがスパムとしてマークされることを防ぎます。

### APIでのメール送信をサポートしていますか {#do-you-support-sending-email-with-api}

はい、2023年5月より、すべての有料ユーザー向けにAPIでのメール送信をアドオンとしてサポートしています。

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">利用規約</a>、<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>、および<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">送信SMTP制限</a>を必ずお読みください。ご利用はこれらの内容の承認および同意とみなされます。
  </span>
</div>

APIドキュメントの[Emails](/email-api#outbound-emails)セクションでオプション、例、および詳細をご覧ください。

APIで送信メールを送るには、[マイセキュリティ](/my-account/security)で利用可能なAPIトークンを使用する必要があります。

### IMAPでのメール受信をサポートしていますか {#do-you-support-receiving-email-with-imap}

はい、2023年10月16日より、すべての有料ユーザー向けにIMAP経由でのメール受信をアドオンとしてサポートしています。**当社の暗号化されたSQLiteメールボックスストレージ機能の仕組みについては** [詳細記事](/blog/docs/best-quantum-safe-encrypted-email-service) をお読みください。

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">利用規約</a>および<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>を必ずお読みください。ご利用はこれらの内容の承認および同意とみなされます。
  </span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスでドメインの新しいエイリアスを作成します（例: <code><hello@example.com></code>）

2. 新しく作成したエイリアスの横にある<strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong>をクリックします。画面に表示される生成されたパスワードをクリップボードにコピーし、安全に保管してください。

3. お好みのメールアプリケーションで、新しく作成したエイリアス（例: <code><hello@example.com></code>）のアカウントを追加または設定します。
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>、または<a href="/blog/open-source" class="alert-link" target="_blank">オープンソースでプライバシー重視の代替アプリ</a>の使用を推奨します。</span>
   </div>

4. IMAPサーバー名の入力を求められたら、`imap.forwardemail.net` と入力してください。

5. IMAPサーバーポートの入力を求められたら、`993`（SSL/TLS）と入力してください。必要に応じて[代替IMAPポート](/faq#what-are-your-imap-server-configuration-settings)もご参照ください。
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>Thunderbirdを使用する場合は、「接続のセキュリティ」が「SSL/TLS」に設定されており、認証方法が「通常のパスワード」になっていることを確認してください。</span>
   </div>
6. IMAPサーバーパスワードの入力を求められたら、上記ステップ2の<strong class="text-success"><i class="fa fa-key"></i> パスワード生成</strong>からパスワードを貼り付けてください

7. **設定を保存してください** – 問題がある場合は、<a href="/help">お問い合わせ</a>ください

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべての手順を正常に完了しました。
    </span>
  </div>
</div>

</div>

### カレンダー（CalDAV）をサポートしていますか {#do-you-support-calendars-caldav}

はい、2024年2月5日よりこの機能を追加しました。サーバーは `caldav.forwardemail.net` で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

### POP3をサポートしていますか {#do-you-support-pop3}

はい、2023年12月4日より、すべての有料ユーザー向けに[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)をアドオンとしてサポートしています。**当社の暗号化されたSQLiteメールボックスストレージ機能の仕組みについては、詳細記事**をご覧ください。(/blog/docs/best-quantum-safe-encrypted-email-service)

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要：
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">利用規約</a>と<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>を必ずお読みください。ご利用はこれらの内容の承認および同意とみなされます。
  </span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアスで、ドメインの新しいエイリアスを作成します（例：<code><hello@example.com></code>）

2. 新しく作成したエイリアスの横にある<strong class="text-success"><i class="fa fa-key"></i> パスワード生成</strong>をクリックします。画面に表示された生成されたパスワードをクリップボードにコピーし、安全に保管してください。

3. お好みのメールアプリケーションで、新しく作成したエイリアス（例：<code><hello@example.com></code>）のアカウントを追加または設定します
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント：
     </strong>
     <span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>、または<a href="/blog/open-source" class="alert-link" target="_blank">オープンソースでプライバシー重視の代替アプリ</a>の使用を推奨します。</span>
   </div>

4. POP3サーバー名の入力を求められたら、`pop3.forwardemail.net` と入力してください

5. POP3サーバーポートの入力を求められたら、`995`（SSL/TLS）を入力してください。必要に応じて[代替POP3ポート](/faq#what-are-your-pop3-server-configuration-settings)もご参照ください
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント：
     </strong>
     <span>Thunderbirdを使用している場合は、「接続のセキュリティ」を「SSL/TLS」に、「認証方式」を「通常のパスワード」に設定してください。</span>
   </div>

6. POP3サーバーパスワードの入力を求められたら、上記ステップ2の<strong class="text-success"><i class="fa fa-key"></i> パスワード生成</strong>からパスワードを貼り付けてください

7. **設定を保存してください** – 問題がある場合は、<a href="/help">お問い合わせ</a>ください

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべての手順を正常に完了しました。
    </span>
  </div>
</div>

</div>
IPv4とIPv6の両方をサポートしており、ポート`443`（HTTPS）で利用可能です。

| ログイン    | 例                         | 説明                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>で存在するエイリアスのメールアドレス。                                                                 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。                                                                                                                                                    |

カレンダーサポートを利用するには、**ユーザー**は<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>で存在するエイリアスのメールアドレスでなければならず、**パスワード**はエイリアス固有の生成されたパスワードである必要があります。

### タスクとリマインダー（CalDAV VTODO）をサポートしていますか？ {#do-you-support-tasks-and-reminders-caldav-vtodo}

はい、2025年10月14日よりタスクとリマインダーのためのCalDAV VTODOサポートを追加しました。これはカレンダーサポートと同じサーバーを使用します：`caldav.forwardemail.net`。

当社のCalDAVサーバーは、**統合カレンダー**を使用してカレンダーイベント（VEVENT）とタスク（VTODO）の両方のコンポーネントをサポートしています。つまり、各カレンダーはイベントとタスクの両方を含むことができ、すべてのCalDAVクライアント間で最大の柔軟性と互換性を提供します。

**カレンダーとリストの仕組み：**

* **各カレンダーはイベントとタスクの両方をサポート** - 任意のカレンダーにイベント、タスク、またはその両方を追加できます
* **Appleリマインダーのリスト** - Appleリマインダーで作成した各リストはサーバー上の別々のカレンダーになります
* **複数のカレンダー** - 必要なだけカレンダーを作成でき、それぞれに名前、色、組織を設定できます
* **クライアント間同期** - タスクとイベントはすべての対応クライアント間でシームレスに同期されます

**対応タスククライアント：**

* **macOSリマインダー** - タスクの作成、編集、完了、同期を完全にネイティブサポート
* **iOSリマインダー** - すべてのiOSデバイスで完全にネイティブサポート
* **Tasks.org（Android）** - CalDAV同期対応の人気オープンソースタスクマネージャー
* **Thunderbird** - デスクトップメールクライアントでのタスクとカレンダーサポート
* **任意のCalDAV対応タスクマネージャー** - 標準のVTODOコンポーネントをサポート

**サポートされるタスク機能：**

* タスクの作成、編集、削除
* 期限日と開始日
* タスク完了ステータス（NEEDS-ACTION、IN-PROCESS、COMPLETED、CANCELLED）
* タスクの優先度レベル
* 繰り返しタスク
* タスクの説明とメモ
* 複数デバイス間の同期
* RELATED-TOプロパティを使ったサブタスク
* VALARMによるタスクリマインダー

ログイン資格情報はカレンダーサポートと同じです：

| ログイン    | 例                         | 説明                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>で存在するエイリアスのメールアドレス。                                                                 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。                                                                                                                                                    |

**重要な注意点：**

* **各リマインダーリストは別々のカレンダーです** - Appleリマインダーで新しいリストを作成すると、CalDAVサーバー上に新しいカレンダーが作成されます
* **Thunderbirdユーザー** - 同期したい各カレンダー／リストに手動で購読する必要があります。またはカレンダーホームURLを使用してください：`https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Appleユーザー** - カレンダーの検出は自動で行われるため、すべてのカレンダーとリストがCalendar.appとReminders.appに表示されます
* **統合カレンダー** - すべてのカレンダーはイベントとタスクの両方をサポートし、データの整理に柔軟性を提供します
### 連絡先（CardDAV）をサポートしていますか {#do-you-support-contacts-carddav}

はい、2025年6月12日よりこの機能を追加しました。弊社のサーバーは `carddav.forwardemail.net` で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

IPv4およびIPv6の両方に対応しており、ポート `443`（HTTPS）で利用可能です。

| ログイン    | 例                         | 説明                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> に存在するドメインのエイリアスのメールアドレスです。 |
| パスワード | `************************` | エイリアス専用に生成されたパスワードです。                                                                                                                                                 |

連絡先サポートを利用するには、**ユーザー**は<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>に存在するドメインのエイリアスのメールアドレスである必要があり、**パスワード**はエイリアス専用に生成されたパスワードでなければなりません。

### SMTPでのメール送信をサポートしていますか {#do-you-support-sending-email-with-smtp}

はい、2023年5月よりすべての有料ユーザー向けのアドオンとしてSMTPによるメール送信をサポートしています。

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    <a href="/terms" class="alert-link" target="_blank">利用規約</a>、<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>、および <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">送信SMTP制限</a> を必ずお読みください。ご利用はこれらの内容の承認および同意とみなされます。
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    Gmailをご利用の場合は、<a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmailでの送信メール設定ガイド</a>をご参照ください。開発者の方は<a class="alert-link" href="/email-api#outbound-emails" target="_blank">メールAPIドキュメント</a>をご覧ください。
  </span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> 送信SMTP設定 に移動し、セットアップ手順に従ってください

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス でドメイン用の新しいエイリアスを作成します（例: <code><hello@example.com></code>）

3. 新しく作成したエイリアスの横にある <strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong> をクリックします。画面に表示される生成されたパスワードをクリップボードにコピーし、安全に保管してください。

4. お好みのメールアプリケーションで、新しく作成したエイリアス（例: <code><hello@example.com></code>）のアカウントを追加または設定します
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>弊社では<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>、または<a href="/blog/open-source" class="alert-link" target="_blank">オープンソースでプライバシー重視の代替アプリ</a>の使用を推奨しています。</span>
   </div>
5. SMTPサーバー名の入力を求められたら、`smtp.forwardemail.net` と入力してください

6. SMTPサーバーポートの入力を求められたら、`465`（SSL/TLS）と入力してください – 必要に応じて[代替SMTPポート](/faq#what-are-your-smtp-server-configuration-settings)を参照してください
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>Thunderbirdを使用している場合は、「接続のセキュリティ」が「SSL/TLS」に設定されており、認証方法が「通常のパスワード」に設定されていることを確認してください。</span>
   </div>

7. SMTPサーバーパスワードの入力を求められたら、上記ステップ3の<strong class="text-success"><i class="fa fa-key"></i> パスワード生成</strong>からパスワードを貼り付けてください

8. **設定を保存して最初のテストメールを送信してください** – 問題がある場合は、<a href="/help">お問い合わせ</a>ください

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    IPの評判を維持し、配信可能性を確保するために、送信SMTPの承認はドメインごとに手動レビューのプロセスがあります。通常24時間以内に完了し、多くのリクエストは1～2時間以内に承認されます。近い将来、追加のスパム制御とアラート機能によりこのプロセスを即時化する予定です。このプロセスにより、メールが受信トレイに届き、メッセージがスパムとしてマークされることを防ぎます。
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべてのステップを正常に完了しました。
    </span>
  </div>
</div>

</div>

### OpenPGP/MIME、エンドツーエンド暗号化（「E2EE」）、およびWeb Key Directory（「WKD」）をサポートしていますか？ {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

はい、[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP)、[エンドツーエンド暗号化（「E2EE」）](https://en.wikipedia.org/wiki/End-to-end_encryption)、および[Web Key Directory（「WKD」）](https://wiki.gnupg.org/WKD)を使用した公開鍵の検出をサポートしています。OpenPGPは[ keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service)で設定するか、[独自にホストすることも可能です](https://wiki.gnupg.org/WKDHosting)（[WKDサーバー設定のgistはこちら](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)を参照）。

* WKDの検索結果は1時間キャッシュされ、迅速なメール配信を保証します → そのため、WKDキーを追加、変更、または削除した場合は、メールアドレスを記載の上 `support@forwardemail.net` までご連絡いただき、手動でキャッシュをクリアします。
* WKD検索またはアップロードされたPGPキーを使用して転送されるメッセージのPGP暗号化をサポートしています。
* アップロードされたキーは、PGPチェックボックスが有効/チェックされている限り優先されます。
* Webhookに送信されるメッセージは現在PGPで暗号化されていません。
* 複数のエイリアスが転送先アドレスにマッチし（例：正規表現/ワイルドカード/完全一致の組み合わせ）、かつ複数のエイリアスにアップロードされたPGPキーがありPGPがチェックされている場合 → エラーアラートメールを送信し、アップロードされたPGPキーでの暗号化は行いません。これは非常に稀で、通常は複雑なエイリアスルールを持つ上級ユーザーにのみ該当します。
* **送信者がDMARCポリシーでrejectを設定している場合、当社のMXサーバー経由のメール転送にはPGP暗号化は適用されません。すべてのメールでPGP暗号化が必要な場合は、IMAPサービスを使用し、受信メール用にエイリアスのPGPキーを設定することをお勧めします。**

**Web Key Directoryの設定は <https://wkd.chimbosonic.com/>（オープンソース）または <https://www.webkeydirectory.com/>（プロプライエタリ）で検証できます。**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    自動暗号化:
  </strong>
  <span>当社の<a href="#do-you-support-sending-email-with-smtp" class="alert-link">送信SMTPサービス</a>を使用して暗号化されていないメッセージを送信する場合、受信者ごとに<a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory（「WKD」）</a>を使用して自動的に暗号化を試みます。</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    カスタムドメイン名でOpenPGPを有効にするには、以下のすべての手順を必ず実行してください。
  </span>
</div>

1. 以下からメールクライアント推奨のプラグインをダウンロードしてインストールしてください:

   | メールクライアント    | プラットフォーム | 推奨プラグイン                                                                                                                                                                    | 備考                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | デスクトップ  | [ThunderbirdでOpenPGPを設定する](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | ThunderbirdはOpenPGPを標準サポートしています。                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | ブラウザ  | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download)（プロプライエタリライセンス）                                                                            | GmailはOpenPGPをサポートしていませんが、オープンソースのプラグイン[Mailvelope](https://mailvelope.com/)または[FlowCrypt](https://flowcrypt.com/download)をダウンロードできます。                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple MailはOpenPGPをサポートしていませんが、オープンソースのプラグイン[Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)をダウンロードできます。                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) または [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995)（プロプライエタリライセンス）                           | Apple MailはOpenPGPをサポートしていませんが、オープンソースのプラグイン[PGPro](https://github.com/opensourceios/PGPro/)または[FlowCrypt](https://flowcrypt.com/download)をダウンロードできます。                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | OutlookのデスクトップメールクライアントはOpenPGPをサポートしていませんが、オープンソースのプラグイン[gpg4win](https://www.gpg4win.de/index.html)をダウンロードできます。                                                                                                                                                                                                                                                                                    |
   | Outlook         | ブラウザ  | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download)（プロプライエタリライセンス）                                                                            | OutlookのウェブベースメールクライアントはOpenPGPをサポートしていませんが、オープンソースのプラグイン[Mailvelope](https://mailvelope.com/)または[FlowCrypt](https://flowcrypt.com/download)をダウンロードできます。                                                                                                                                                                                                                                          |
   | Android         | モバイル   | [OpenKeychain](https://www.openkeychain.org/) または [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Androidメールクライアント](/blog/open-source/android-email-clients)の[Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/)や[FairEmail](https://github.com/M66B/FairEmail)はオープンソースプラグイン[OpenKeychain](https://www.openkeychain.org/)をサポートしています。代わりにオープンソース（プロプライエタリライセンス）プラグイン[FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)を使用することもできます。 |
   | Google Chrome   | ブラウザ  | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download)（プロプライエタリライセンス）                                                                            | オープンソースのブラウザ拡張機能[Mailvelope](https://mailvelope.com/)または[FlowCrypt](https://flowcrypt.com/download)をダウンロードできます。                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | ブラウザ  | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download)（プロプライエタリライセンス）                                                                            | オープンソースのブラウザ拡張機能[Mailvelope](https://mailvelope.com/)または[FlowCrypt](https://flowcrypt.com/download)をダウンロードできます。                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | ブラウザ  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | オープンソースのブラウザ拡張機能[Mailvelope](https://mailvelope.com/)をダウンロードできます。                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | ブラウザ  | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download)（プロプライエタリライセンス）                                                                            | オープンソースのブラウザ拡張機能[Mailvelope](https://mailvelope.com/)または[FlowCrypt](https://flowcrypt.com/download)をダウンロードできます。                                                                                                                                                                                                                                                                                                 |
   | Balsa           | デスクトップ  | [BalsaでOpenPGPを設定する](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | BalsaはOpenPGPを標準サポートしています。                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | デスクトップ  | [KMailでOpenPGPを設定する](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMailはOpenPGPを標準サポートしています。                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | デスクトップ  | [EvolutionでOpenPGPを設定する](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME EvolutionはOpenPGPを標準サポートしています。                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | デスクトップ  | [Terminalでgpgを設定する](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | オープンソースの[gpgコマンドラインツール](https://www.gnupg.org/download/)を使ってコマンドラインから新しい鍵を生成できます。                                                                                                                                                                                                                                                                                                            |
2. プラグインを開き、公開鍵を作成し、メールクライアントで使用するように設定します。

3. 公開鍵を <https://keys.openpgp.org/upload> にアップロードします。

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>将来的にキーを管理するには、<a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> をご利用ください。</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       オプション追加機能:
     </strong>
     <span>
       当社の<a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">暗号化ストレージ（IMAP/POP3）</a>サービスをご利用で、（すでに暗号化されている）SQLiteデータベースに保存されている<i>すべての</i>メールを公開鍵で暗号化したい場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス（例: <code>hello@example.com</code>） <i class="fa fa-angle-right"></i> 編集 <i class="fa fa-angle-right"></i> OpenPGP に移動し、公開鍵をアップロードしてください。
     </span>
   </div>

4. ドメイン名（例: `example.com`）に新しい `CNAME` レコードを追加します：

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Name/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Type</th>
         <th>Answer/Value</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>エイリアスが当社の<a class="alert-link" href="/disposable-addresses" target="_blank">バニティ／使い捨てドメイン</a>（例: <code>hideaddress.net</code>）を使用している場合は、このステップを省略できます。</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      すべてのステップを正常に完了しました。
    </span>
  </div>
</div>

### S/MIME暗号化はサポートしていますか {#do-you-support-smime-encryption}

はい、[RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551)で定義されている[S/MIME（Secure/Multipurpose Internet Mail Extensions）](https://en.wikipedia.org/wiki/S/MIME)暗号化をサポートしています。S/MIMEはX.509証明書を使用したエンドツーエンドの暗号化を提供し、企業向けメールクライアントで広くサポートされています。

RSA証明書とECC（楕円曲線暗号）証明書の両方をサポートしています：

* **RSA証明書**：最低2048ビット、推奨4096ビット
* **ECC証明書**：P-256、P-384、P-521のNIST曲線

エイリアスのS/MIME暗号化を設定するには：

1. 信頼できる認証局（CA）からS/MIME証明書を取得するか、テスト用に自己署名証明書を生成します。

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ヒント:
     </strong>
     <span>無料のS/MIME証明書は、<a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a>や<a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>などのプロバイダーから入手可能です。</span>
   </div>

2. 証明書をPEM形式（公開証明書のみ、秘密鍵は含まない）でエクスポートします。

3. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス（例: <code><hello@example.com></code>） <i class="fa fa-angle-right"></i> 編集 <i class="fa fa-angle-right"></i> S/MIME に移動し、公開証明書をアップロードします。
4. 一度設定すると、エイリアス宛てのすべての受信メールは、保存または転送される前にあなたのS/MIME証明書を使って暗号化されます。

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       注意:
     </strong>
     <span>
       S/MIME暗号化は、すでに暗号化されていない受信メッセージに適用されます。メッセージがすでにOpenPGPまたはS/MIMEで暗号化されている場合は、再暗号化されません。
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       重要:
     </strong>
     <span>
       送信者にDMARCポリシーでrejectが設定されている場合、当社のMXサーバーを経由したメール転送にはS/MIME暗号化は適用されません。すべてのメールに対してS/MIME暗号化が必要な場合は、当社のIMAPサービスを利用し、受信メール用にエイリアスのS/MIME証明書を設定することをお勧めします。
     </span>
   </div>

以下のメールクライアントは、S/MIMEの組み込みサポートがあります：

| メールクライアント | プラットフォーム | 備考                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | 組み込みのS/MIMEサポート。Mail > 環境設定 > アカウント > あなたのアカウント > 信頼 から証明書を設定してください。      |
| Apple Mail        | iOS      | 組み込みのS/MIMEサポート。設定 > メール > アカウント > あなたのアカウント > 詳細 > S/MIME から設定してください。          |
| Microsoft Outlook | Windows  | 組み込みのS/MIMEサポート。ファイル > オプション > トラストセンター > トラストセンターの設定 > 電子メールセキュリティ から設定してください。 |
| Microsoft Outlook | macOS    | 組み込みのS/MIMEサポート。ツール > アカウント > 詳細 > セキュリティ から設定してください。                                 |
| Thunderbird       | デスクトップ  | 組み込みのS/MIMEサポート。アカウント設定 > エンドツーエンド暗号化 > S/MIME から設定してください。                      |
| GNOME Evolution   | デスクトップ  | 組み込みのS/MIMEサポート。編集 > 設定 > メールアカウント > あなたのアカウント > セキュリティ から設定してください。           |
| KMail             | デスクトップ  | 組み込みのS/MIMEサポート。設定 > KMailの設定 > アイデンティティ > あなたのアイデンティティ > 暗号化 から設定してください。 |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      おめでとうございます！
    </strong>
    <span>
      エイリアスのS/MIME暗号化の設定に成功しました。
    </span>
  </div>
</div>

### Sieveメールフィルタリングはサポートしていますか？ {#do-you-support-sieve-email-filtering}

はい！当社は[RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)で定義された[Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\))メールフィルタリングをサポートしています。Sieveは、サーバー側のメールフィルタリングのための強力で標準化されたスクリプト言語で、受信メッセージを自動的に整理、フィルタリング、応答することができます。

#### サポートされているSieve拡張機能 {#supported-sieve-extensions}

当社は包括的なSieve拡張機能セットをサポートしています：

| 拡張機能                    | RFC                                                                                    | 説明                                      |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | メッセージを特定のフォルダに振り分ける              |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | エラーでメッセージを拒否する                    |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | 自動応答の休暇/不在返信                         |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | 細かい休暇応答間隔の設定                         |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | IMAPフラグ（\Seen、\Flaggedなど）を設定           |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | エンベロープの送信者/受信者をテスト                   |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | メッセージ本文の内容をテスト                        |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | スクリプト内で変数を保存・使用                       |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | 関係演算子による比較（より大きい、より小さい）         |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | 数値比較                                      |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | リダイレクトしながらメッセージをコピー                  |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | メッセージヘッダーの追加または削除                    |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | 日付/時刻の値をテスト                            |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | 特定のヘッダー出現箇所にアクセス                       |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | 正規表現マッチング                              |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | 通知の送信（例：mailto:）                           |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | 環境情報へのアクセス                             |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | メールボックスの存在確認、メールボックスの作成         |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | 特殊用途メールボックスへの振り分け（\Junk、\Trash）  |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | 重複メッセージの検出                            |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | 拡張機能の利用可能性をテスト                        |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | user+detail形式のアドレス部分にアクセス                 |
#### Extensions Not Supported {#extensions-not-supported}

以下の拡張機能は現在サポートされていません：

| Extension                                                       | Reason                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | セキュリティリスク（スクリプトインジェクション）およびグローバルスクリプトストレージが必要 |
| `mboxmetadata` / `servermetadata`                               | IMAP METADATA拡張機能のサポートが必要                              |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | 複雑なMIMEツリー操作はまだ実装されていません                        |

#### Example Sieve Scripts {#example-sieve-scripts}

**ニュースレターをフォルダに振り分ける:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**休暇中の自動返信:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**重要な送信者からのメッセージにマークを付ける:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**特定の件名のスパムを拒否する:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### Managing Sieve Scripts {#managing-sieve-scripts}

Sieveスクリプトは以下の方法で管理できます：

1. **Webインターフェース**: <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス <i class="fa fa-angle-right"></i> Sieveスクリプト からスクリプトの作成・管理が可能です。

2. **ManageSieveプロトコル**: ThunderbirdのSieveアドオンや[sieve-connect](https://github.com/philpennock/sieve-connect)などのManageSieve対応クライアントを使って `imap.forwardemail.net` に接続します。ポートは `2190`（STARTTLS推奨）または `4190`（暗黙のTLS）を使用します。

3. **API**: [REST API](/api#sieve-scripts) を使ってプログラム的にスクリプトを管理できます。

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    注意:
  </strong>
  <span>
    Sieveフィルタリングは受信メッセージがメールボックスに保存される前に適用されます。スクリプトは優先順に実行され、最初に一致したアクションがメッセージの処理方法を決定します。
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    セキュリティ:
  </strong>
  <span>
    セキュリティ上の理由から、リダイレクトアクションはスクリプトごとに10回、1日あたり100回に制限されています。休暇応答も乱用防止のためレート制限されています。
  </span>
</div>

### Do you support MTA-STS {#do-you-support-mta-sts}

はい、2023年3月2日より[MTA-STS](https://www.hardenize.com/blog/mta-sts)をサポートしています。ドメインで有効にしたい場合は[こちらのテンプレート](https://github.com/jpawlowski/mta-sts.template)をご利用ください。

設定はGitHubの <https://github.com/forwardemail/mta-sts.forwardemail.net> で公開されています。

### Do you support passkeys and WebAuthn {#do-you-support-passkeys-and-webauthn}

はい！2023年12月13日より、需要の高まりに応じてパスキーのサポートを追加しました（[詳細](https://github.com/orgs/forwardemail/discussions/182)）。

パスキーを使うと、パスワードや二要素認証なしで安全にログインできます。

タッチ認証、顔認証、デバイスベースのパスワードやPINで本人確認が可能です。

最大30個のパスキーを同時に管理できるため、複数のデバイスから簡単にログインできます。

パスキーについて詳しくは以下のリンクをご覧ください：

* [パスキーでアプリやウェブサイトにサインインする](https://support.google.com/android/answer/14124480?hl=en)（Google）
* [iPhoneでパスキーを使ってアプリやウェブサイトにサインインする](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios)（Apple）
* [パスキーに関するWikipedia記事](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### メールのベストプラクティスをサポートしていますか {#do-you-support-email-best-practices}

はい。すべてのプランでSPF、DKIM、DMARC、ARC、SRSのサポートを組み込んでいます。また、これらの仕様の元の著者や他のメール専門家と広範に協力し、完璧さと高い配信率を確保しています。

### バウンスWebhookをサポートしていますか {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
    メールWebhookのドキュメントをお探しですか？ 詳しくは<a href="/faq#do-you-support-webhooks" class="alert-link">Webhookをサポートしていますか？</a>をご覧ください。
  <span>
  </span>
</div>

はい、2024年8月14日よりこの機能を追加しました。現在、マイアカウント → ドメイン → 設定 → バウンスWebhook URLに移動し、送信SMTPメールがバウンスした際に`POST`リクエストを送信する`http://`または`https://`のURLを設定できます。

これは送信SMTPの管理と監視に役立ち、購読者の管理、オプトアウト、バウンス発生時の検出に利用できます。

バウンスWebhookのペイロードは以下のプロパティを持つJSON形式で送信されます：

* `email_id` (String) - マイアカウント → メール（送信SMTP）に対応するメールID
* `list_id` (String) - 元の送信メールの`List-ID`ヘッダー（大文字小文字を区別しない）の値（あれば）
* `list_unsubscribe` (String) - 元の送信メールの`List-Unsubscribe`ヘッダー（大文字小文字を区別しない）の値（あれば）
* `feedback_id` (String) - 元の送信メールの`Feedback-ID`ヘッダー（大文字小文字を区別しない）の値（あれば）
* `recipient` (String) - バウンスまたはエラーが発生した受信者のメールアドレス
* `message` (String) - バウンスの詳細なエラーメッセージ
* `response` (String) - SMTPの応答メッセージ
* `response_code` (Number) - 解析されたSMTP応答コード
* `truth_source` (String) - 応答コードが信頼できるソースからの場合、そのルートドメイン名（例：`google.com`や`yahoo.com`）が入る
* `bounce` (Object) - バウンスおよび拒否状態の詳細を含むオブジェクト
  * `action` (String) - バウンスアクション（例：`"reject"`）
  * `message` (String) - バウンス理由（例：`"Message Sender Blocked By Receiving Server"`）
  * `category` (String) - バウンスカテゴリ（例：`"block"`）
  * `code` (Number) - バウンスステータスコード（例：`554`）
  * `status` (String) - 応答メッセージからのバウンスコード（例：`5.7.1`）
  * `line` (Number) - 解析された行番号（あれば）、[Zone-MTAバウンス解析リスト](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt)から（例：`526`）
* `headers` (Object) - 送信メールのヘッダーのキーと値のペア
* `bounced_at` (String) - バウンスエラーが発生した日時の[ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)形式

例：

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

バウンスWebhookに関する追加の注意点：

* Webhookペイロードに`list_id`、`list_unsubscribe`、または`feedback_id`の値が含まれている場合、必要に応じて`recipient`をリストから削除する適切な処置を行ってください。
  * `bounce.category`の値が`"block"`、`"recipient"`、`"spam"`、または`"virus"`のいずれかの場合は、必ずリストからユーザーを削除してください。
* Webhookペイロードの検証（実際に当社サーバーからのものであることの確認）が必要な場合は、[リモートクライアントIPアドレスのクライアントホスト名を逆引き](https://nodejs.org/api/dns.html#dnspromisesreverseip)してください。`smtp.forwardemail.net`であるはずです。
  * また、[公開されているIPアドレス](#what-are-your-servers-ip-addresses)と照合することもできます。
  * マイアカウント → ドメイン → 設定 → Webhook署名ペイロード検証キーからWebhookキーを取得してください。
    * セキュリティ上の理由でいつでもこのキーをローテーションできます。
    * このキーを使ってWebhookリクエストの`X-Webhook-Signature`値と計算した本文の値を比較してください。方法の例は[こちらのStack Overflow投稿](https://stackoverflow.com/a/68885281)にあります。
  * 詳細は<https://github.com/forwardemail/free-email-forwarding/issues/235>の議論も参照してください。
* Webhookエンドポイントが`200`ステータスコードで応答するまで最大`5`秒待ち、最大`1`回リトライします。
* バウンスWebhook URLにエラーが検出された場合、週に1回の頻度で礼儀的なメールを送信します。
### Webhookはサポートしていますか {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
    バウンスWebhookのドキュメントをお探しですか？ 詳しくは<a href="/faq#do-you-support-bounce-webhooks" class="alert-link">バウンスWebhookはサポートしていますか？</a>をご覧ください。
  <span>
  </span>
</div>

はい、2020年5月15日よりこの機能を追加しました。Webhookは受信者と同じように簡単に追加できます！WebhookのURLには必ず「http」または「https」プロトコルが付いていることを確認してください。

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    強化されたプライバシー保護:
  </strong>
  <span>
    有料プラン（強化されたプライバシー保護機能付き）をご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>にアクセスし、ドメインの横にある「エイリアス」をクリックしてWebhookを設定してください。有料プランの詳細は<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">料金ページ</a>をご覧ください。無料プランの場合は以下の手順に従ってください。
  </span>
</div>

無料プランの場合は、以下のように新しいDNSの<strong class="notranslate">TXT</strong>レコードを追加してください：

例えば、`alias@example.com` に届くすべてのメールを新しい[request bin](https://requestbin.com/r/en8pfhdgcculn?inspect)のテストエンドポイントに転送したい場合：

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空欄</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

または、`example.com` に届くすべてのメールをこのエンドポイントに転送したい場合：

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空欄</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Webhookに関する追加の注意点は以下の通りです：**

* Webhookのペイロードを検証する必要がある場合（実際に当社のサーバーから送信されていることを確認するため）、[リモートクライアントIPアドレスのクライアントホスト名を逆引きで解決](https://nodejs.org/api/dns.html#dnspromisesreverseip)できます。`mx1.forwardemail.net` または `mx2.forwardemail.net` のいずれかであるべきです。
  * また、IPを[公開されているIPアドレス](#what-are-your-servers-ip-addresses)と照合することも可能です。
  * 有料プランの場合は、マイアカウント → ドメイン → 設定 → Webhook署名ペイロード検証キーからWebhookキーを取得してください。
    * セキュリティ上の理由から、このキーはいつでもローテーション可能です。
    * 当社のWebhookリクエストの `X-Webhook-Signature` 値と、このキーを使って計算した本文の値を比較してください。方法の例は[こちらのStack Overflow投稿](https://stackoverflow.com/a/68885281)にあります。
  * 詳細は <https://github.com/forwardemail/free-email-forwarding/issues/235> の議論をご覧ください。
* Webhookが `200` ステータスコードで応答しない場合、そのレスポンスは[エラーログに保存されます](#do-you-store-error-logs) — デバッグに役立ちます。
* WebhookのHTTPリクエストはSMTP接続試行ごとに最大3回リトライされ、エンドポイントPOSTリクエストごとに最大60秒のタイムアウトがあります。**これは3回だけリトライするという意味ではなく**、3回目のHTTP POSTリクエスト失敗後にSMTPコード421（後で再試行してください）を送信し、実際には何日も継続してリトライされます。つまり、200ステータスコードが返るまでメールは継続的に再試行されます。
* リトライは[superagentのretryメソッド](https://ladjs.github.io/superagent/#retrying-requests)で使用されるデフォルトのステータスおよびエラーコードに基づいて自動的に行われます（当社はメンテナです）。
* 同じエンドポイントへのWebhook HTTPリクエストは複数回ではなく1回にまとめて送信され、リソース節約と応答速度向上を図っています。例えば、<webhook1@example.com>、<webhook2@example.com>、<webhook3@example.com> にメールを送信し、すべて同じ*正確な*エンドポイントURLに設定されている場合、リクエストは1回だけ送信されます。完全一致でグループ化されます。
* メッセージの解析には[mailparser](https://nodemailer.com/extras/mailparser/)ライブラリの "simpleParser" メソッドを使用し、JSONに適したオブジェクトに変換しています。
* 生のメール値は文字列として "raw" プロパティに格納されます。
* 認証結果は "dkim"、"spf"、"arc"、"dmarc"、"bimi" の各プロパティに格納されます。
* 解析済みのメールヘッダーは "headers" プロパティに格納されますが、繰り返しや解析を簡単にするために "headerLines" も使用可能です。
* このWebhookにグループ化された受信者は "recipients" プロパティにまとめられています。
* SMTPセッション情報は "session" プロパティに格納されます。ここにはメッセージ送信者、到着時間、HELO、クライアントホスト名の情報が含まれます。`session.clientHostname` はFQDN（逆PTRルックアップによる）か、`session.remoteAddress` を角括弧で囲んだもの（例：`"[127.0.0.1]"`）です。
* `X-Original-To` の値を素早く取得したい場合は、`session.recipient` の値を使用できます（以下の例を参照）。`X-Original-To` はマスク転送前の元の受信者をデバッグ用にメッセージに追加するヘッダーです。
* ペイロードの本文から `attachments` や `raw` プロパティを除外したい場合は、Webhookエンドポイントのクエリ文字列に `?attachments=false`、`?raw=false`、または `?attachments=false&raw=false` を追加してください（例：`https://example.com/webhook?attachments=false&raw=false`）。
* 添付ファイルがある場合は、Buffer値を持つ `attachments` 配列に追加されます。JavaScriptで内容に戻すには以下のような方法を使えます：
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### 正規表現またはregexをサポートしていますか {#do-you-support-regular-expressions-or-regex}

はい、2021年9月27日よりこの機能を追加しました。エイリアスのマッチングや置換を行うために、正規表現（「regex」）を簡単に記述できます。

正規表現対応のエイリアスは、`/`で始まり`/`で終わるもので、受信者はメールアドレスまたはWebhookです。受信者には正規表現の置換サポート（例：`$1`、`$2`）も含めることができます。

サポートしている正規表現フラグは`i`と`g`の2つです。大文字・小文字を区別しないフラグ`i`は常にデフォルトで有効です。グローバルフラグ`g`は、末尾の`/`に`/g`を付けることで追加できます。

また、正規表現サポートにおいても<a href="#can-i-disable-specific-aliases">無効化されたエイリアス機能</a>を受信者部分で利用可能です。

正規表現は<a href="/disposable-addresses" target="_blank">グローバルバニティドメイン</a>ではサポートされていません（セキュリティ上の脆弱性となる可能性があるため）。

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    強化されたプライバシー保護：
  </strong>
  <span>
    有料プラン（強化されたプライバシー保護機能付き）をご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>にアクセスし、ドメイン横の「エイリアス」をクリックして、正規表現を含むエイリアスを設定してください。有料プランの詳細については<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">料金ページ</a>をご覧ください。
  </span>
</div>

#### 強化されたプライバシー保護の例 {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>エイリアス名</th>
      <th>効果</th>
      <th>テスト</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>`linus@example.com` または `torvalds@example.com` へのメール</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">RegExrでテストを見る</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>`24highst@example.com` または `24highstreet@example.com` へのメール</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">RegExrでテストを見る</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント：
  </strong>
    <a href="https://regexr.com" class="alert-link">RegExr</a>でこれらをテストするには、上部のボックスに正規表現を記述し、下のテキストボックスに例のエイリアスを入力してください。マッチすると青色に変わります。
  <span>
  </span>
</div>

#### 無料プランの例 {#examples-for-the-free-plan}

無料プランをご利用の場合は、以下の例のいずれかを使用して新しいDNSの<strong class="notranslate">TXT</strong>レコードを追加してください。

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>簡単な例：</strong> `linus@example.com` または `torvalds@example.com` に届くすべてのメールを `user@gmail.com` に転送したい場合：
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空欄</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>名前・姓の置換例：</strong> 会社のメールアドレスがすべて `firstname.lastname@example.com` のパターンであるとします。`firstname.lastname@example.com` に届くすべてのメールを置換サポート付きで `firstname.lastname@company.com` に転送したい場合（<a href="https://regexr.com/66hnu" class="alert-link">RegExrでテストを見る</a>）：
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>プラス記号フィルタリング置換の例:</strong> `info@example.com` または `support@example.com` に送られるすべてのメールを、それぞれ `user+info@gmail.com` または `user+support@gmail.com` に転送したい場合（置換サポート付き）（<a href="https://regexr.com/66ho7" class="alert-link">RegExrでテストを見る</a>）:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook クエリ文字列置換の例:</strong> 例えば、`example.com` に送られるすべてのメールを<a href="#do-you-support-webhooks" class="alert-link">Webhook</a>に送り、メールアドレスのユーザー名部分を値とする動的なクエリ文字列キー "to" を持たせたい場合（<a href="https://regexr.com/66ho4" class="alert-link">RegExrでテストを見る</a>）:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>静かな拒否の例:</strong> 特定のパターンにマッチするすべてのメールを無効にし、静かに拒否したい場合（送信者にはメッセージが正常に送信されたように見えますが、実際にはどこにも届かない）ステータスコード `250` で（<a href="#can-i-disable-specific-aliases" class="alert-link">特定のエイリアスを無効にできますか</a>を参照）、単に感嘆符「!」を使った同じ方法を使用します。これは送信者にメッセージが正常に配信されたことを示しますが、実際にはどこにも届きません（例：ブラックホールや `/dev/null`）。
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ソフト拒否の例:</strong> 特定のパターンにマッチするすべてのメールを無効にし、ステータスコード `421` でソフト拒否したい場合（<a href="#can-i-disable-specific-aliases" class="alert-link">特定のエイリアスを無効にできますか</a>を参照）、単に感嘆符を2つ「!!」使った同じ方法を使用します。これは送信者にメールの再試行を促し、このエイリアスへのメールは約5日間再試行され、その後永久に拒否されます。
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ハードリジェクトの例:</strong> 特定のパターンに一致するすべてのメールを無効にし、ステータスコード `550` でハードリジェクトしたい場合（詳細は <a href="#can-i-disable-specific-aliases" class="alert-link">特定のエイリアスを無効にできますか</a> を参照）、単に三重の感嘆符「!!!」を使った同じ方法を使用してください。これは送信者に恒久的なエラーを示し、メールは再試行されず、このエイリアスに対して拒否されます。
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
    正規表現の書き方に興味がある、または置換をテストしたい場合は、無料の正規表現テストサイト <a href="https://regexr.com" class="alert-link">RegExr</a> にアクセスしてください。URLは <a href="https://regexr.com/" class="alert-link">https://regexr.com</a> です。
  <span>
  </span>
</div>

### アウトバウンドSMTPの制限は何ですか {#what-are-your-outbound-smtp-limits}

ユーザーおよびドメインごとに1日あたり300通のアウトバウンドSMTPメッセージにレート制限を設けています。これはカレンダー月で平均9000通以上のメールに相当します。この量を超える必要がある場合や、常に大容量のメールを送信する場合は、[お問い合わせ](https://forwardemail.net/help)ください。

### SMTPを有効にするには承認が必要ですか {#do-i-need-approval-to-enable-smtp}

はい、IPの評判を維持し配信可能性を確保するために、Forward EmailではアウトバウンドSMTPの承認に対してドメインごとの手動審査プロセスがあります。承認を希望する場合は、<support@forwardemail.net> にメールを送るか、[ヘルプリクエスト](https://forwardemail.net/help)を開いてください。通常24時間以内に対応し、多くのリクエストは1〜2時間以内に承認されます。近い将来、追加のスパム制御とアラート機能を備え、このプロセスを即時化する予定です。このプロセスにより、メールが受信トレイに届き、メッセージがスパムとしてマークされるのを防ぎます。

### SMTPサーバーの設定は何ですか {#what-are-your-smtp-server-configuration-settings}

当社のサーバーは `smtp.forwardemail.net` で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

IPv4およびIPv6の両方に対応し、SSL/TLS（推奨）用にポート `465` と `2465`、TLS（STARTTLS）用にポート `587`、`2587`、`2525`、および `25` が利用可能です。

**2025年10月現在**、プリンター、スキャナー、カメラ、古いメールクライアントなどの古いデバイス向けに、ポート `2455`（SSL/TLS）および `2555`（STARTTLS）で**レガシーTLS 1.0**接続もサポートしています。これらのポートは、Gmail、Yahoo、Outlookなどのプロバイダーが古いTLSプロトコルのサポートを終了したための代替手段として提供されています。

> \[!CAUTION]
> **レガシーTLS 1.0サポート（ポート2455および2555）**: これらのポートは既知のセキュリティ脆弱性（BEAST、POODLE）がある廃止されたTLS 1.0プロトコルを使用しています。TLS 1.2以上を絶対にサポートできないデバイスのみで使用してください。可能な限りデバイスのファームウェアをアップグレードするか、最新のメールクライアントに切り替えることを強く推奨します。これらのポートはレガシーハードウェア（古いプリンター、スキャナー、カメラ、IoTデバイス）との互換性のためだけに意図されています。

|                                     プロトコル                                     | ホスト名                  |            ポート            |        IPv4        |        IPv6        | 備考                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **推奨**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | 最新のTLS 1.2以上（推奨）          |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | サポート（SSL/TLSポート `465` 推奨）  |
|                             `SSL/TLS` **レガシーのみ**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: 古いデバイス向けTLS 1.0のみ |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **レガシーのみ** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: 古いデバイス向けTLS 1.0のみ |
| ログイン    | 例                         | 説明                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> に存在するドメインのエイリアスのメールアドレスです。 |
| パスワード | `************************` | エイリアス                                                                                                                                                                                |

SMTPで送信メールを送信するには、**SMTPユーザー**は<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>に存在するドメインのエイリアスのメールアドレスでなければならず、**SMTPパスワード**はエイリアス専用に生成されたパスワードでなければなりません。

手順については、[SMTPでのメール送信をサポートしていますか](#do-you-support-sending-email-with-smtp)をご参照ください。

### IMAPサーバーの設定は何ですか {#what-are-your-imap-server-configuration-settings}

当社のサーバーは `imap.forwardemail.net` で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

IPv4とIPv6の両方をサポートし、SSL/TLS用にポート `993` と `2993` で利用可能です。

|         プロトコル        | ホスト名                  |     ポート     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **推奨**       | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| ログイン    | 例                         | 説明                                                                                                                                                                                      |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> に存在するドメインのエイリアスのメールアドレスです。 |
| パスワード | `************************` | エイリアス専用に生成されたパスワードです。                                                                                                                                                 |

IMAPに接続するには、**IMAPユーザー**は<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>に存在するドメインのエイリアスのメールアドレスでなければならず、**IMAPパスワード**はエイリアス専用に生成されたパスワードでなければなりません。

手順については、[IMAPでのメール受信をサポートしていますか](#do-you-support-receiving-email-with-imap)をご参照ください。

### POP3サーバーの設定は何ですか {#what-are-your-pop3-server-configuration-settings}

当社のサーバーは `pop3.forwardemail.net` で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

IPv4とIPv6の両方をサポートし、SSL/TLS用にポート `995` と `2995` で利用可能です。

|         プロトコル        | ホスト名                  |     ポート     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **推奨**       | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> に存在するドメインのエイリアスのメールアドレス。 |
| Password | `************************` | エイリアス固有の生成されたパスワード。                                                                                                                                                    |

POP3に接続するには、**POP3ユーザー**は<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>に存在するドメインのエイリアスのメールアドレスでなければならず、**IMAPパスワード**はエイリアス固有の生成されたパスワードでなければなりません。

手順については、[POP3をサポートしていますか](#do-you-support-pop3)をご参照ください。

### ドメインのメール自動検出を設定するには {#how-do-i-set-up-email-autodiscovery-for-my-domain}

メール自動検出により、**Thunderbird**、**Apple Mail**、**Microsoft Outlook**、およびモバイルデバイスなどのメールクライアントが、ユーザーがメールアカウントを追加するときに正しいIMAP、SMTP、POP3、CalDAV、およびCardDAVサーバー設定を自動的に検出できます。これは[RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html)（メール）および[RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html)（CalDAV/CardDAV）で定義されており、DNSのSRVレコードを使用します。

Forward Emailは`forwardemail.net`上に自動検出レコードを公開しています。ドメインにSRVレコードを直接追加するか、より簡単なCNAME方式を使用できます。

#### オプションA: CNAMEレコード（最も簡単） {#option-a-cname-records-simplest}

これらの2つのCNAMEレコードをドメインのDNSに追加してください。これにより、自動検出がForward Emailのサーバーに委任されます：

|  Type | Name/Host      | Target/Value                    |
| :---: | -------------- | ------------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`   |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

`autoconfig`レコードは**Thunderbird**やその他のMozillaベースのクライアントで使用されます。`autodiscover`レコードは**Microsoft Outlook**で使用されます。

#### オプションB: SRVレコード（直接追加） {#option-b-srv-records-direct}

レコードを直接追加したい場合（またはDNSプロバイダーがサブドメインでのCNAMEをサポートしていない場合）は、これらのSRVレコードをドメインに追加してください：

| Type | Name/Host           | Priority | Weight | Port | Target/Value               | Purpose                                |
| :--: | ------------------- | :------: | :----: | :--: | -------------------------- | -------------------------------------- |
|  SRV | `_imaps._tcp`       |     0    |    1   |  993 | `imap.forwardemail.net`    | SSL/TLSによるIMAP（推奨）              |
|  SRV | `_imap._tcp`        |     0    |    0   |   0  | `.`                        | 平文IMAPは無効                         |
|  SRV | `_submissions._tcp` |     0    |    1   |  465 | `smtp.forwardemail.net`    | SMTP送信（SSL/TLS推奨）                |
|  SRV | `_submission._tcp`  |     5    |    1   |  587 | `smtp.forwardemail.net`    | SMTP送信（STARTTLS）                   |
|  SRV | `_pop3s._tcp`       |    10    |    1   |  995 | `pop3.forwardemail.net`    | SSL/TLSによるPOP3                      |
|  SRV | `_pop3._tcp`        |     0    |    0   |   0  | `.`                        | 平文POP3は無効                         |
|  SRV | `_caldavs._tcp`     |     0    |    1   |  443 | `caldav.forwardemail.net`  | TLSによるCalDAV（カレンダー）          |
|  SRV | `_caldav._tcp`      |     0    |    0   |   0  | `.`                        | 平文CalDAVは無効                       |
|  SRV | `_carddavs._tcp`    |     0    |    1   |  443 | `carddav.forwardemail.net` | TLSによるCardDAV（連絡先）             |
|  SRV | `_carddav._tcp`     |     0    |    0   |   0  | `.`                        | 平文CardDAVは無効                      |
> \[!NOTE]
> IMAP は POP3 (10) よりも低い優先度値 (0) を持っており、両方が利用可能な場合にメールクライアントが IMAP を優先することを示しています。ターゲットが `.`（単一のドット）であるレコードは、[RFC 6186 セクション 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) に従い、これらのプロトコルのプレーンテキスト（非暗号化）バージョンが意図的に無効化されていることを示しています。CalDAV および CardDAV の SRV レコードは、カレンダーおよび連絡先の自動検出のために [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) に従っています。

#### どのメールクライアントが自動検出をサポートしていますか？ {#which-email-clients-support-autodiscovery}

| クライアント         | メール                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME または SRV レコード           | `autoconfig` XML または SRV レコード (RFC 6764) |
| Apple Mail (macOS) | SRV レコード (RFC 6186)                           | SRV レコード (RFC 6764)                     |
| Apple Mail (iOS)   | SRV レコード (RFC 6186)                           | SRV レコード (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME または `_autodiscover._tcp` SRV | サポートされていません                      |
| GNOME (Evolution)  | SRV レコード (RFC 6186)                           | SRV レコード (RFC 6764)                     |
| KDE (KMail)        | SRV レコード (RFC 6186)                           | SRV レコード (RFC 6764)                     |
| eM Client          | `autoconfig` または `autodiscover`                | SRV レコード (RFC 6764)                     |

> \[!TIP]
> すべてのクライアントで最高の互換性を得るために、**オプション A**（CNAME レコード）と **オプション B** の SRV レコードの組み合わせを推奨します。CNAME アプローチだけでも大多数のメールクライアントをカバーします。CalDAV/CardDAV の SRV レコードは、カレンダーおよび連絡先クライアントがサーバー設定を自動的に検出できるようにします。


## セキュリティ {#security-1}

### 高度なサーバーハードニング技術 {#advanced-server-hardening-techniques}

> \[!TIP]
> 当社のセキュリティインフラストラクチャの詳細は、[セキュリティページ](/security)をご覧ください。

Forward Email は、インフラストラクチャとお客様のデータのセキュリティを確保するために多数のサーバーハードニング技術を実装しています：

1. **ネットワークセキュリティ**:
   * 厳格なルールを持つ IP テーブルファイアウォール
   * ブルートフォース攻撃防止のための Fail2ban
   * 定期的なセキュリティ監査およびペネトレーションテスト
   * VPN 限定の管理アクセス

2. **システムハードニング**:
   * 最小限のパッケージインストール
   * 定期的なセキュリティアップデート
   * 強制モードの SELinux
   * root の SSH アクセス無効化
   * キーベース認証のみ

3. **アプリケーションセキュリティ**:
   * コンテンツセキュリティポリシー (CSP) ヘッダー
   * HTTPS 厳格トランスポートセキュリティ (HSTS)
   * XSS 保護ヘッダー
   * フレームオプションおよびリファラーポリシーヘッダー
   * 定期的な依存関係監査

4. **データ保護**:
   * LUKS によるフルディスク暗号化
   * 安全なキー管理
   * 暗号化された定期バックアップ
   * データ最小化の実践

5. **監視と対応**:
   * リアルタイム侵入検知
   * 自動化されたセキュリティスキャン
   * 集中ログ管理および分析
   * インシデント対応手順

> \[!IMPORTANT]
> 当社のセキュリティ対策は、新たな脅威や脆弱性に対応するために継続的に更新されています。

> \[!TIP]
> 最大のセキュリティを確保するために、OpenPGP を用いたエンドツーエンド暗号化でのご利用を推奨します。

### SOC 2 または ISO 27001 の認証はありますか {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email は、業界標準のコンプライアンスを確保するために認定サブプロセッサーが提供するインフラストラクチャ上で運用されています。

Forward Email 自体は SOC 2 タイプ II または ISO 27001 の認証を直接保有していません。しかし、サービスは認定サブプロセッサーが提供するインフラストラクチャ上で運用されています：

* **DigitalOcean**：SOC 2 タイプ II および SOC 3 タイプ II 認証（Schellman & Company LLC による監査）、複数のデータセンターで ISO 27001 認証。詳細：<https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+（HIPAA）認証取得、ISO/IEC認証：20000-1:2018、27001:2022、27017:2015、27018:2019。詳細: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2準拠（認証取得にはDataPacketへ直接お問い合わせください）、エンタープライズグレードのインフラプロバイダー（デンバー拠点）。詳細: <https://www.datapacket.com/datacenters/denver>

Forward Emailは業界のベストプラクティスに従い、セキュリティ監査を定期的に実施し、独立したセキュリティ研究者と連携しています。出典: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### メール転送にTLS暗号化を使用していますか {#do-you-use-tls-encryption-for-email-forwarding}

はい。Forward Emailはすべての接続（HTTPS、SMTP、IMAP、POP3）に対してTLS 1.2以上を厳格に適用し、強化されたTLSサポートのためにMTA-STSを実装しています。実装内容は以下の通りです：

* すべてのメール接続に対するTLS 1.2以上の強制適用
* 完全前方秘匿性を実現するECDHE（楕円曲線ディフィー・ヘルマン一時鍵）鍵交換
* 定期的なセキュリティ更新を行う最新の暗号スイート
* パフォーマンスとセキュリティ向上のためのHTTP/2サポート
* 主要ブラウザでのプリロード対応HSTS（HTTP Strict Transport Security）
* 厳格なTLS適用のための**MTA-STS（Mail Transfer Agent Strict Transport Security）**

出典: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STSの実装**: Forward Emailはコードベースで厳格なMTA-STS適用を行っています。TLSエラーが発生しMTA-STSが適用されている場合、システムは421 SMTPステータスコードを返し、メールが安全でない状態で配信されるのを防ぎ、後で再試行されるようにします。実装の詳細：

* TLSエラー検出: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* send-emailヘルパーでのMTA-STS適用: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

第三者検証: <https://www.hardenize.com/report/forwardemail.net/1750312779> はすべてのTLSおよびトランスポートセキュリティ対策に「Good」評価を示しています。

### メール認証ヘッダーを保持していますか {#do-you-preserve-email-authentication-headers}

はい。Forward Emailはメール認証ヘッダーを包括的に実装し保持しています：

* **SPF（Sender Policy Framework）**：適切に実装および保持
* **DKIM（DomainKeys Identified Mail）**：適切な鍵管理を伴う完全サポート
* **DMARC**：SPFまたはDKIM検証に失敗したメールに対するポリシー適用
* **ARC**：明示的な記述はありませんが、完璧な準拠スコアから包括的な認証ヘッダー処理が推測されます

出典: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

検証: Internet.nlのメールテストでは「SPF、DKIM、DMARC」の実装で100/100点を獲得。Hardenizeの評価でもSPFとDMARCに「Good」評価が確認されています: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### 元のメールヘッダーを保持し、なりすましを防止していますか {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Emailはメールの悪用を防ぐ高度ななりすまし防止機能を実装しています。

Forward Emailは元のメール認証ヘッダーを保持しつつ、MXコードベースを通じて包括的ななりすまし防止を実施しています：

* **ヘッダー保持**：転送時に元の認証ヘッダーを維持
* **なりすまし防止**：DMARCポリシー適用により、SPFまたはDKIM検証に失敗したメールを拒否しヘッダーのなりすましを防止
* **ヘッダーインジェクション防止**：striptagsライブラリを用いた入力検証とサニタイズ
* **高度な保護**：なりすまし検出、なりすまし防止、ユーザー通知システムを備えた高度なフィッシング検出

**MX実装の詳細**：コアのメール処理ロジックはMXサーバーのコードベースで処理されており、具体的には：

* メインMXデータハンドラー: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* 任意メールフィルタリング（なりすまし防止）: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary`ヘルパーは、ドメインなりすまし検出、禁止フレーズ、各種フィッシングパターンを含む高度ななりすまし防止ルールを実装しています。
### スパムや悪用からどのように保護していますか {#how-do-you-protect-against-spam-and-abuse}

Forward Email は包括的な多層防御を実装しています：

* **レート制限**：認証試行、API エンドポイント、SMTP 接続に適用
* **リソース分離**：ユーザー間で高トラフィックユーザーの影響を防止
* **DDoS 保護**：DataPacket の Shield システムと Cloudflare による多層防御
* **自動スケーリング**：需要に応じた動的リソース調整
* **悪用防止**：ユーザー固有の悪用防止チェックと悪意あるコンテンツのハッシュベースブロック
* **メール認証**：SPF、DKIM、DMARC プロトコルと高度なフィッシング検出

ソース：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS 保護の詳細)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### メール内容をディスクに保存しますか {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email はメール内容がディスクに書き込まれることを防ぐゼロ知識アーキテクチャを採用しています。

* **ゼロ知識アーキテクチャ**：個別に暗号化された SQLite メールボックスにより Forward Email はメール内容にアクセスできません
* **インメモリ処理**：メール処理は完全にメモリ内で行われ、ディスク保存を回避
* **内容ログなし**：「メール内容やメタデータをディスクにログまたは保存しません」
* **サンドボックス化された暗号化**：暗号化キーは平文でディスクに保存されません

**MX コードベースの証拠**：MX サーバーはメールを完全にメモリ内で処理し、内容をディスクに書き込みません。主要なメール処理ハンドラーはこのインメモリ方式を示しています：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

ソース：

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (概要)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (ゼロ知識の詳細)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (サンドボックス化された暗号化)

### システムクラッシュ時にメール内容が露出することはありますか {#can-email-content-be-exposed-during-system-crashes}

いいえ。Forward Email はクラッシュによるデータ露出を防ぐ包括的な安全策を実装しています：

* **コアダンプ無効化**：クラッシュ時のメモリ露出を防止
* **スワップメモリ無効化**：スワップファイルからの機密データ抽出を防ぐため完全無効化
* **インメモリアーキテクチャ**：メール内容は処理中のみ揮発性メモリに存在
* **暗号化キー保護**：キーは平文でディスクに保存されません
* **物理的セキュリティ**：LUKS v2 暗号化ディスクにより物理アクセスを防止
* **USB ストレージ無効化**：不正なデータ抽出を防止

**システム問題のエラーハンドリング**：Forward Email は `isCodeBug` と `isTimeoutError` ヘルパー関数を使用し、データベース接続問題、DNS ネットワーク／ブロックリスト問題、上流接続問題が発生した場合に 421 SMTP ステータスコードを返し、メールが失われたり露出したりせず後で再試行されるようにしています。

実装詳細：

* エラー分類：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX 処理のタイムアウトエラー処理：<https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

ソース：<https://forwardemail.net/technical-whitepaper.pdf#page=15>

### 誰があなたのメールインフラにアクセスできますか {#who-has-access-to-your-email-infrastructure}

Forward Email は最小限の 2～3 人のエンジニアリングチームのアクセスに対し、厳格な 2FA 要件を伴う包括的なアクセス制御を実装しています：

* **ロールベースアクセス制御**：リソースベースの権限を持つチームアカウント向け
* **最小権限の原則**：全システムに適用
* **職務分離**：運用役割間での分離
* **ユーザー管理**：異なる権限を持つデプロイユーザーとデブオプスユーザーを分離
* **ルートログイン無効化**：適切に認証されたアカウント経由のアクセスを強制
* **厳格な 2FA**：MiTM 攻撃リスクのため SMS ベースの 2FA は使用せず、アプリベースまたはハードウェアトークンのみ
* **包括的な監査ログ**：機密データはマスキング
* **自動異常検知**：異常なアクセスパターンを検出
* **定期的なセキュリティレビュー**：アクセスログの確認
* **イービルメイド攻撃防止**：USB ストレージ無効化などの物理的セキュリティ対策
Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30>（認証管理）
* <https://forwardemail.net/technical-whitepaper.pdf#page=30>（ネットワークセキュリティ）
* <https://forwardemail.net/technical-whitepaper.pdf#page=15>（イービルメイド攻撃防止）

### どのインフラプロバイダーを使用していますか {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Emailは、包括的なコンプライアンス認証を持つ複数のインフラインフラサブプロセッサーを使用しています。

詳細は当社のGDPR準拠ページでご覧いただけます：<https://forwardemail.net/gdpr>

**主要なインフラインフラサブプロセッサー：**

| プロバイダー       | データプライバシーフレームワーク認証済み | GDPR準拠ページ                                                                             |
| ------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Cloudflare**     | ✅ はい                                  | <https://www.cloudflare.com/trust-hub/gdpr/>                                               |
| **DataPacket**     | ❌ いいえ                                | <https://www.datapacket.com/privacy-policy>                                                |
| **DigitalOcean**   | ❌ いいえ                                | <https://www.digitalocean.com/legal/gdpr>                                                  |
| **GitHub**         | ✅ はい                                  | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**          | ❌ いいえ                                | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                            |

**詳細な認証情報：**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II（Schellman & Company LLCによる監査）
* 複数のデータセンターでISO 27001認証取得
* PCI-DSS準拠
* CSA STAR レベル1認証
* APEC CBPR PRP認証
* 詳細：<https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+（HIPAA）認証取得
* PCIマーチャント準拠
* CSA STAR レベル1認証
* ISO/IEC 20000-1:2018、27001:2022、27017:2015、27018:2019
* 詳細：<https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2準拠（認証取得にはDataPacketへ直接お問い合わせください）
* エンタープライズグレードのインフラ（デンバー拠点）
* ShieldサイバーセキュリティスタックによるDDoS保護
* 24時間365日の技術サポート
* 58のデータセンターにまたがるグローバルネットワーク
* 詳細：<https://www.datapacket.com/datacenters/denver>

**GitHub**

* データプライバシーフレームワーク認証済み（EU-US、スイス-US、英国拡張）
* ソースコードホスティング、CI/CD、プロジェクト管理
* GitHubデータ保護契約書あり
* 詳細：<https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**決済プロセッサー：**

* **Stripe**：データプライバシーフレームワーク認証済み - <https://stripe.com/legal/privacy-center>
* **PayPal**：DPF認証なし - <https://www.paypal.com/uk/legalhub/privacy-full>

### データ処理契約（DPA）を提供していますか {#do-you-offer-a-data-processing-agreement-dpa}

はい、Forward Emailは包括的なデータ処理契約（DPA）を提供しており、エンタープライズ契約とともに署名可能です。DPAのコピーは以下でご覧いただけます：<https://forwardemail.net/dpa>

**DPAの詳細：**

* GDPR準拠およびEU-US/スイス-USプライバシーシールドフレームワークをカバー
* 利用規約に同意すると自動的に承認されます
* 標準DPAには別途署名は不要
* エンタープライズライセンスを通じてカスタムDPAの対応可能

**GDPR準拠フレームワーク：**
当社のDPAはGDPRおよび国際的なデータ転送要件の準拠を詳細に規定しています。詳細は以下をご覧ください：<https://forwardemail.net/gdpr>

カスタムDPA条項や特定の契約条件が必要なエンタープライズ顧客には、**エンタープライズライセンス（月額250ドル）**プログラムを通じて対応いたします。

### データ侵害通知はどのように対応していますか {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Emailのゼロナレッジアーキテクチャにより、侵害の影響は大幅に制限されています。
* **限定的なデータ露出**: ゼロ知識アーキテクチャにより暗号化されたメール内容にはアクセスできません
* **最小限のデータ収集**: セキュリティのために基本的な購読者情報と限定的なIPログのみを収集
* **サブプロセッサーフレームワーク**: DigitalOcean、GitHub、VultrはGDPR準拠のインシデント対応手順を維持

**GDPR代表者情報:**
Forward Emailは第27条に基づきGDPR代表者を任命しています:

**EU代表者:**
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0

**英国代表者:**
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF

特定の違反通知SLAを必要とするエンタープライズ顧客は、**エンタープライズライセンス**契約の一環としてこれらを協議する必要があります。

出典:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### テスト環境は提供していますか {#do-you-offer-a-test-environment}

Forward Emailの技術文書には専用のサンドボックスモードについて明示的な記述はありません。ただし、考えられるテストアプローチは以下の通りです:

* **セルフホスティングオプション**: テスト環境作成のための包括的なセルフホスティング機能
* **APIインターフェース**: 設定のプログラム的テストの可能性
* **オープンソース**: 100%オープンソースコードにより転送ロジックの検証が可能
* **複数ドメイン**: 複数ドメイン対応によりテスト用ドメインの作成が可能

正式なサンドボックス機能を必要とするエンタープライズ顧客は、**エンタープライズライセンス**契約の一環として協議する必要があります。

出典: <https://github.com/forwardemail/forwardemail.net> (開発環境の詳細)

### 監視およびアラートツールは提供していますか {#do-you-provide-monitoring-and-alerting-tools}

Forward Emailは一部制限付きでリアルタイム監視を提供しています:

**利用可能な機能:**

* **リアルタイム配信監視**: 主要メールプロバイダーのパフォーマンス指標を公開
* **自動アラート**: 配信時間が10秒を超えた場合にエンジニアリングチームに通知
* **透明性の高い監視**: 100%オープンソースの監視システム
* **インフラ監視**: 自動異常検知と包括的な監査ログ

**制限事項:**

* 顧客向けのWebhookやAPIベースの配信状況通知は明示的に文書化されていません

詳細な配信状況Webhookやカスタム監視統合を必要とするエンタープライズ顧客には、これらの機能が**エンタープライズライセンス**契約を通じて提供される可能性があります。

出典:

* <https://forwardemail.net> (リアルタイム監視表示)
* <https://github.com/forwardemail/forwardemail.net> (監視実装)

### 高可用性はどのように確保していますか {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Emailは複数のインフラプロバイダーにわたる包括的な冗長性を実装しています。

* **分散インフラ**: 地理的に分散した複数プロバイダー（DigitalOcean、Vultr、DataPacket）
* **地理的ロードバランシング**: Cloudflareベースの地理位置ロードバランシングと自動フェイルオーバー
* **自動スケーリング**: 需要に応じた動的リソース調整
* **多層DDoS防御**: DataPacketのShieldシステムおよびCloudflareによる防御
* **サーバ冗長化**: 地域ごとに複数サーバを配置し自動フェイルオーバー
* **データベースレプリケーション**: 複数拠点間のリアルタイムデータ同期
* **監視およびアラート**: 24時間365日の監視と自動インシデント対応

**稼働率保証**: 99.9%以上のサービス可用性を提供し、<https://forwardemail.net>で透明性のある監視を公開

出典:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### 国防権限法（NDAA）第889条に準拠していますか {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Emailはインフラパートナーの慎重な選定により、第889条に完全準拠しています。

はい、Forward Emailは**第889条準拠**です。国防権限法（NDAA）第889条は、政府機関が特定企業（Huawei、ZTE、Hikvision、Dahua、Hytera）の通信および映像監視機器を使用または契約することを禁止しています。
**Forward Emailがセクション889準拠を達成する方法:**

Forward Emailは、セクション889で禁止されている機器を使用しない2つの主要なインフラプロバイダーのみに依存しています:

1. **Cloudflare**: ネットワークサービスおよびメールセキュリティの主要パートナー
2. **DataPacket**: サーバーインフラストラクチャの主要プロバイダー（Arista NetworksおよびCisco機器のみを使用）
3. **バックアッププロバイダー**: Digital OceanおよびVultrのバックアッププロバイダーも、セクション889準拠であることが書面で確認されています。

**Cloudflareのコミットメント**: Cloudflareは、第三者行動規範において、セクション889で禁止されている通信機器、ビデオ監視製品、サービスを使用していないことを明確に述べています。

**政府の利用事例**: Forward Emailのセクション889準拠は、**米国海軍士官学校**が安全なメール転送ニーズのためにForward Emailを選択し、連邦準拠基準の文書化を求めた際に検証されました。

政府の準拠フレームワークやより広範な連邦規制の詳細については、包括的なケーススタディをご覧ください: [連邦政府メールサービス セクション889準拠](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## システムおよび技術的詳細 {#system-and-technical-details}

### メールおよびその内容を保存しますか {#do-you-store-emails-and-their-contents}

いいえ、ディスクへの書き込みやログの保存は行いません – [エラー](#do-you-store-error-logs)および[送信SMTP](#do-you-support-sending-email-with-smtp)（詳細は[プライバシーポリシー](/privacy)参照）を除きます。

すべてはメモリ上で処理され、[ソースコードはGitHubにあります](https://github.com/forwardemail)。

### メール転送システムはどのように動作しますか {#how-does-your-email-forwarding-system-work}

メールは[SMTPプロトコル](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)に依存しています。このプロトコルは、サーバー（通常ポート25で動作）に送信されるコマンドで構成されます。最初に接続が確立され、送信者がメールの送信元を示す（"MAIL FROM"）、次に宛先を示す（"RCPT TO"）、最後にメールのヘッダーと本文（"DATA"）が送られます。以下に、各SMTPコマンドに対する当社のメール転送システムの流れを説明します:

* 初期接続（コマンド名なし、例: `telnet example.com 25`） - これは初期接続です。[許可リスト](#do-you-have-an-allowlist)にない送信者を[拒否リスト](#do-you-have-a-denylist)と照合します。最後に、許可リストにない送信者については[グレイリスト](#do-you-have-a-greylist)に登録されているか確認します。

* `HELO` - 送信者のFQDN、IPアドレス、またはメールハンドラ名を識別する挨拶を示します。この値は偽装可能なため、このデータには依存せず、接続元IPアドレスの逆引きホスト名を使用します。

* `MAIL FROM` - メールのエンベロープ送信元アドレスを示します。値が入力されている場合、有効なRFC 5322メールアドレスでなければなりません。空の値も許可されます。ここで[バックキャッター](#how-do-you-protect-against-backscatter)をチェックし、また[拒否リスト](#do-you-have-a-denylist)と照合します。最後に、許可リストにない送信者についてはレート制限を行います（詳細は[レート制限](#do-you-have-rate-limiting)および[許可リスト](#do-you-have-an-allowlist)のセクションを参照）。

* `RCPT TO` - メールの受信者を示します。これらは有効なRFC 5322メールアドレスでなければなりません。1メッセージあたり最大50のエンベロープ受信者のみ許可します（これはメールの「To」ヘッダーとは異なります）。また、なりすまし防止のために有効な[Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（"SRS"）アドレスをここでチェックします。

* `DATA` - メールを処理するサービスの中核部分です。詳細は以下のセクション[メールを転送用にどのように処理しますか](#how-do-you-process-an-email-for-forwarding)をご覧ください。
### メールを転送するための処理方法 {#how-do-you-process-an-email-for-forwarding}

このセクションでは、上記の[メール転送システムの仕組み](#how-does-your-email-forwarding-system-work)のセクションにあるSMTPプロトコルコマンド `DATA` に関連する処理について説明します。これは、メールのヘッダー、本文、セキュリティの処理、配信先の判定、および接続の取り扱い方法に関するものです。

1. メッセージが最大サイズの50MBを超える場合、552エラーコードで拒否されます。

2. メッセージに「From」ヘッダーが含まれていない場合、または「From」ヘッダー内の値のいずれかが有効なRFC 5322メールアドレスでない場合、550エラーコードで拒否されます。

3. メッセージに25個を超える「Received」ヘッダーがある場合、リダイレクトループに陥っていると判断され、550エラーコードで拒否されます。

4. メールのフィンガープリント（[フィンガープリントの決定方法](#how-do-you-determine-an-email-fingerprint)のセクション参照）を使用して、メッセージが5日以上再試行されているかどうかを確認します（これは[Postfixのデフォルト動作](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)に一致します）。該当する場合は550エラーコードで拒否されます。

5. メールを[Spam Scanner](https://spamscanner.net)でスキャンした結果をメモリ内に保存します。

6. Spam Scannerから任意の結果があった場合、554エラーコードで拒否されます。任意の結果には、執筆時点ではGTUBEテストのみが含まれます。詳細は<https://spamassassin.apache.org/gtube/>をご覧ください。

7. デバッグおよび不正利用防止のため、以下のヘッダーをメッセージに追加します：

   * `Received` - 発信元IPとホスト、送信タイプ、TLS接続情報、日時、受信者を含む標準のReceivedヘッダーを追加します。
   * `X-Original-To` - メッセージの元の受信者：
     * これはメールが元々どこに配信されたかを判別するのに役立ちます（「Received」ヘッダーに加えて）。
     * IMAPおよび/またはマスク転送時に受信者ごとに追加されます（プライバシー保護のため）。
   * `X-Forward-Email-Website` - <https://forwardemail.net> のウェブサイトへのリンクを含みます。
   * `X-Forward-Email-Version` - コードベースの `package.json` からの現在の[SemVer](https://semver.org/)バージョン。
   * `X-Forward-Email-Session-ID` - デバッグ目的で使用されるセッションID（非本番環境のみ適用）。
   * `X-Forward-Email-Sender` - 元のエンベロープMAIL FROMアドレス（空でない場合）、リバースPTRクライアントFQDN（存在する場合）、送信者のIPアドレスをカンマ区切りで含むリスト。
   * `X-Forward-Email-ID` - これは送信SMTPにのみ適用され、マイアカウント → メールに保存されているメールIDと関連付けられます。
   * `X-Report-Abuse` - 値は `abuse@forwardemail.net`。
   * `X-Report-Abuse-To` - 値は `abuse@forwardemail.net`。
   * `X-Complaints-To` - 値は `abuse@forwardemail.net`。

8. 次に、メッセージの[DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)、[SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)、[ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain)、および[DMARC](https://en.wikipedia.org/wiki/DMARC)をチェックします。

   * メッセージがDMARCに失敗し、ドメインに拒否ポリシー（例：DMARCポリシーに `p=reject` が含まれている場合）がある場合、550エラーコードで拒否されます。通常、ドメインのDMARCポリシーは `_dmarc` サブドメインの <strong class="notranslate">TXT</strong> レコードにあります（例：`dig _dmarc.example.com txt`）。
   * メッセージがSPFに失敗し、ドメインにハードフェイルポリシー（例：SPFポリシーに `-all` が含まれている場合）がある場合、550エラーコードで拒否されます。通常、ドメインのSPFポリシーはルートドメインの <strong class="notranslate">TXT</strong> レコードにあります（例：`dig example.com txt`）。SPFに関しては、[Gmailでの送信メール設定](#can-i-send-mail-as-in-gmail-with-this)のセクションも参照してください。
9. メッセージの受信者は、上記のセクション [How does your email forwarding system work](#how-does-your-email-forwarding-system-work) の `RCPT TO` コマンドから収集されたものとして処理します。各受信者に対して、以下の操作を行います:

   * ドメイン名（`@` 記号の後の部分、例えばメールアドレスが `test@example.com` の場合は `example.com`）の <strong class="notranslate">TXT</strong> レコードを検索します。例えば、ドメインが `example.com` の場合は `dig example.com txt` のようなDNS検索を行います。
   * `forward-email=`（無料プラン用）または `forward-email-site-verification=`（有料プラン用）で始まるすべての <strong class="notranslate">TXT</strong> レコードを解析します。ユーザーがプランをアップグレードまたはダウングレードしている間もメールを処理できるように、両方を解析することに注意してください。
   * これらの解析された <strong class="notranslate">TXT</strong> レコードから、上記のセクション [How do I get started and set up email forwarding](#how-do-i-get-started-and-set-up-email-forwarding) に記載されている転送設定を抽出するために反復処理を行います。`forward-email-site-verification=` の値は1つのみサポートしており、複数指定されている場合は550エラーが発生し、この受信者に対して送信者にバウンスが返されます。
   * 抽出された転送設定を再帰的に反復処理し、グローバル転送、正規表現ベースの転送、およびその他すべてのサポートされている転送設定（現在は「Forwarding Addresses」と呼ばれています）を判別します。
   * 各 Forwarding Address に対して、1回の再帰的な検索をサポートします（これにより、指定されたアドレスでこの一連の操作が再開されます）。再帰的な一致が見つかった場合、親の結果は Forwarding Addresses から削除され、子が追加されます。
   * Forwarding Addresses は一意性のために解析されます（同じアドレスに重複して送信したり、不要なSMTPクライアント接続を増やしたくないため）。
   * 各 Forwarding Address に対して、そのドメイン名をAPIエンドポイント `/v1/max-forwarded-addresses` に照会し、ドメインがエイリアスごとに転送可能なアドレス数（デフォルトは10、詳細は [maximum limit on forwarding per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias) セクション参照）を確認します。この制限を超えた場合は550エラーが発生し、送信者にバウンスが返されます。
   * 元の受信者の設定をAPIエンドポイント `/v1/settings` に照会します。これは有料ユーザー向けの検索をサポートし（無料ユーザー向けのフォールバックあり）、`port`（数値、例: `25`）、`has_adult_content_protection`（ブール値）、`has_phishing_protection`（ブール値）、`has_executable_protection`（ブール値）、`has_virus_protection`（ブール値）といった高度な設定の構成オブジェクトを返します。
   * これらの設定に基づき、スパムスキャナーの結果をチェックし、エラーがあれば554エラーコードでメッセージを拒否します（例：`has_virus_protection` が有効な場合はウイルスのスキャン結果をチェックします）。無料プランのすべてのユーザーは成人向けコンテンツ、フィッシング、実行可能ファイル、ウイルスのチェックに自動的に参加します。デフォルトでは有料プランのすべてのユーザーも参加していますが、この設定はForward Emailダッシュボードのドメインの設定ページで変更可能です。

10. 処理された各受信者の Forwarding Addresses に対して、以下の操作を行います:

    * アドレスが当社の [denylist](#do-you-have-a-denylist) に登録されているか確認し、登録されていた場合は421エラーコードが発生します（送信者に後で再試行するよう指示します）。
    * アドレスがWebhookの場合は、今後の操作のためにブール値を設定します（以下参照 – 配信のために複数のPOSTリクエストではなく、類似のWebhookをまとめて1回のPOSTリクエストにします）。
    * アドレスがメールアドレスの場合は、今後の操作のためにホストを解析します（以下参照 – 配信のために複数の個別接続ではなく、類似のホストをまとめて1つの接続にします）。
11. 受信者がいなく、バウンスもない場合は、「Invalid recipients」という550エラーで応答します。

12. 受信者がいる場合は、それらを同じホストごとにグループ化して繰り返し処理し、メールを配信します。詳細は以下のセクション[How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues)をご覧ください。

    * メール送信中にエラーが発生した場合、それらを後で処理するためにメモリ内に保存します。
    * メール送信時の最低のエラーコード（ある場合）を取得し、それを`DATA`コマンドへの応答コードとして使用します。これは、配信されなかったメールは通常送信元によって再試行されますが、すでに配信されたメールは次回メッセージが送信される際に再送されないことを意味します（[Fingerprinting](#how-do-you-determine-an-email-fingerprint)を使用しているため）。
    * エラーが発生しなかった場合は、250の成功SMTP応答ステータスコードを送信します。
    * バウンスは、配信試行がステータスコード500以上（恒久的な失敗）である場合と定義されます。

13. バウンス（恒久的な失敗）が発生しなかった場合は、恒久的でない失敗の中で最低のエラーコードのSMTP応答ステータスコードを返します（失敗がなければ250の成功ステータスコード）。

14. バウンスが発生した場合は、すべてのエラーコードの中で最低のものを送信者に返した後、バックグラウンドでバウンスメールを送信します。ただし、最低のエラーコードが500以上の場合はバウンスメールを送信しません。これは、送信者が二重バウンスメール（例：Gmailなどの送信元MTAからのものと当方からのもの）を受け取るのを防ぐためです。詳細は以下のセクション[How do you protect against backscatter](#how-do-you-protect-against-backscatter)をご覧ください。

### How do you handle email delivery issues {#how-do-you-handle-email-delivery-issues}

送信者のDMARCポリシーが通過しておらず、かつ「From」ヘッダーに整合したDKIM署名がない場合に限り、メールの「Friendly-From」書き換えを行います。これは、メッセージの「From」ヘッダーを変更し、「X-Original-From」を設定し、まだ設定されていなければ「Reply-To」も設定することを意味します。これらのヘッダーを変更した後、メッセージのARCシールも再封印します。

また、スタックのあらゆるレベルでエラーメッセージのスマートパースを行っています。コード、DNSリクエスト、Node.js内部、HTTPリクエスト（例：408、413、429は受信者がWebhookの場合にSMTP応答コード421にマッピング）、メールサーバーの応答（例：「defer」や「slowdown」を含む応答は421エラーとして再試行）などです。

ロジックは非常に堅牢で、SSL/TLSエラー、接続問題なども再試行します。堅牢化の目的は、転送設定におけるすべての受信者への配信成功率を最大化することです。

受信者がWebhookの場合、リクエスト完了まで60秒のタイムアウトを許可し、最大3回の再試行を行います（合計4回のリクエストで失敗とみなします）。408、413、429のエラーコードは正しく解析され、SMTP応答コード421にマッピングされます。

受信者がメールアドレスの場合は、機会的TLSでメール送信を試みます（受信者メールサーバーでSTARTTLSが利用可能な場合に使用）。送信中にSSL/TLSエラーが発生した場合は、TLSなし（STARTTLSなし）での送信を試みます。

DNSまたは接続エラーが発生した場合は、`DATA`コマンドにSMTP応答コード421を返します。500以上のエラーがある場合はバウンスメールが送信されます。

配信先のメールサーバーが当方のメール交換IPアドレスの1つ以上をブロックしていると検出した場合（スパマーを遅延させる技術などによる）、送信者にメッセージを後で再試行させるためにSMTP応答コード421を返します（問題を検知し、次回試行前に解決できるようにアラートを受け取ります）。

### How do you handle your IP addresses becoming blocked {#how-do-you-handle-your-ip-addresses-becoming-blocked}
私たちは定期的に主要なDNS拒否リストを監視しており、もし当社のメール交換（「MX」）IPアドレスが主要な拒否リストに掲載されている場合、問題が解決するまで可能な限り関連するDNS Aレコードのラウンドロビンから除外します。

この記事執筆時点では、当社は複数のDNS許可リストにも掲載されており、拒否リストの監視を真剣に行っています。問題が解決する前に何か問題を発見された場合は、<support@forwardemail.net> 宛に書面でご連絡ください。

当社のIPアドレスは公開されており、[以下のセクションをご覧ください](#what-are-your-servers-ip-addresses) 。

### ポストマスターアドレスとは何ですか {#what-are-postmaster-addresses}

誤送信されたバウンスや、監視されていないまたは存在しないメールボックスへのバケーションレスポンダーメッセージの送信を防ぐために、以下のようなmailer-daemonに似たユーザー名のリストを管理しています：

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [および任意のno-replyアドレス](#what-are-no-reply-addresses)

これらのリストが効率的なメールシステムを作成するためにどのように使用されるかについては、[RFC 5320 セクション4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) を参照してください。

### no-replyアドレスとは何ですか {#what-are-no-reply-addresses}

以下のいずれかと等しい（大文字・小文字を区別しない）メールユーザー名は、no-replyアドレスと見なされます：

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

このリストは[GitHub上のオープンソースプロジェクト](https://github.com/forwardemail/reserved-email-addresses-list)として管理されています。

### あなたのサーバーのIPアドレスは何ですか {#what-are-your-servers-ip-addresses}

当社のIPアドレスは <https://forwardemail.net/ips> にて公開しています。

### 許可リストはありますか {#do-you-have-an-allowlist}

はい、デフォルトで許可リストに登録されている[ドメイン名の拡張子のリスト](#what-domain-name-extensions-are-allowlisted-by-default)と、[厳格な基準](#what-is-your-allowlist-criteria)に基づく動的でキャッシュされたロールイング許可リストがあります。

有料顧客が使用するすべてのドメイン、メール、IPアドレスは毎時自動的に拒否リストと照合され、必要に応じて管理者が手動で介入できるようにアラートが送信されます。

さらに、あなたのドメインまたはそのメールアドレスが拒否リストに載った場合（例：スパム送信、ウイルス、なりすまし攻撃など）、ドメイン管理者（あなた）と当社の管理者に即座にメールで通知されます。これを防ぐために、[DMARCの設定](#how-do-i-set-up-dmarc-for-forward-email)を強く推奨します。

### デフォルトで許可リストに登録されているドメイン名の拡張子は何ですか {#what-domain-name-extensions-are-allowlisted-by-default}

以下のドメイン名の拡張子は、Umbrella Popularity Listに掲載されているかどうかに関わらず、デフォルトで許可リストに登録されています：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
さらに、これらの[ブランドおよび企業のトップレベルドメイン](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains)はデフォルトで許可リストに登録されています（例：Apple Cardの銀行取引明細書用の`applecard.apple`の`apple`）：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
2025年3月18日現在、以下のフランス海外領土もこのリストに追加しました（[このGitHubリクエスト](https://github.com/forwardemail/forwardemail.net/issues/327)による）：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

2025年7月8日現在、以下のヨーロッパ特有の国々を追加しました：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

2025年10月には需要により<code class="notranslate">cz</code>（チェコ共和国）も追加しました。

スパム活動が多いため、`ru` と `ua` は特に含めていません。

### あなたの許可リスト基準とは {#what-is-your-allowlist-criteria}

私たちは静的な[デフォルトで許可されているドメイン名拡張子のリスト](#what-domain-name-extensions-are-allowlisted-by-default)を持っており、さらに以下の厳格な基準に基づく動的でキャッシュされたローリング許可リストも維持しています：

* 送信者のルートドメインは、[無料プランで利用可能なドメイン名拡張子のリスト](#what-domain-name-extensions-can-be-used-for-free)に一致するもの（`biz` と `info` を追加）でなければなりません。`edu`、`gov`、`mil` の部分一致も含みます（例：`xyz.gov.au` や `xyz.edu.au`）。
* 送信者のルートドメインは、[Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")（「UPL」）のトップ100,000のユニークルートドメイン解析結果に含まれている必要があります。
* 送信者のルートドメインは、過去7日間のUPLのうち少なくとも4日間（約50%以上）に出現するユニークルートドメインのトップ50,000に含まれている必要があります。
* 送信者のルートドメインは、Cloudflareによってアダルトコンテンツまたはマルウェアとして[分類](https://radar.cloudflare.com/categorization-feedback/)されていないこと。
* 送信者のルートドメインは、AレコードまたはMXレコードのいずれかが設定されている必要があります。
* 送信者のルートドメインは、Aレコード、MXレコード、`p=reject` または `p=quarantine` のDMARCレコード、または `-all` または `~all` 修飾子付きのSPFレコードのいずれかを持っている必要があります。

この基準を満たす場合、送信者のルートドメインは7日間キャッシュされます。自動ジョブは毎日実行されるため、これは毎日更新されるローリング許可リストキャッシュです。

自動ジョブは過去7日間のUPLをメモリにダウンロードし、解凍して、上記の厳格な基準に従ってメモリ内で解析します。

この記事執筆時点でのGoogle、Yahoo、Microsoft、Amazon、Meta、Twitter、Netflix、Spotifyなどの人気ドメインはもちろん含まれています。
送信者が許可リストにない場合、FQDNルートドメインまたはIPアドレスが初めてメールを送信すると、[レート制限](#do-you-have-rate-limiting)および[グレイリスト](#do-you-have-a-greylist)が適用されます。これはメール標準として採用されている一般的な慣行であることに注意してください。ほとんどのメールサーバークライアントは、レート制限やグレイリストエラー（例：421または4xxレベルのエラーステータスコード）を受け取ると再試行を試みます。

**`a@gmail.com`、`b@xyz.edu`、`c@gov.au`などの特定の送信者は、依然として[拒否リスト](#do-you-have-a-denylist)に登録される可能性があります**（例：これらの送信者からスパム、フィッシング、マルウェアを自動検出した場合）。

### 無料で使用できるドメイン名の拡張子 {#what-domain-name-extensions-can-be-used-for-free}

2023年3月31日現在、ユーザーとサービスを保護するために新しい包括的なスパムルールを施行しました。

この新ルールにより、無料プランで使用できるドメイン名の拡張子は以下のみとなります：

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### グレイリストはありますか {#do-you-have-a-greylist}

はい、非常に緩い[メールのグレイリスティング](https://en.wikipedia.org/wiki/Greylisting_\(email\))ポリシーを採用しています。グレイリスティングは許可リストにない送信者にのみ適用され、キャッシュには30日間保持されます。

新しい送信者の場合、最初のリクエストの到着時間を値として、30日間Redisデータベースにキーを保存します。その後、450の再試行ステータスコードでメールを拒否し、5分経過後にのみ通過を許可します。

この初回到着時間から5分間待機に成功した場合、その送信者のメールは受け入れられ、450ステータスコードは返されません。

キーはFQDNのルートドメインまたは送信者のIPアドレスで構成されます。つまり、サブドメインがグレイリストを通過すればルートドメインも通過し、その逆も同様です（これが「非常に緩い」ポリシーの意味です）。

例えば、`test.example.com`からのメールが`example.com`からのメールより先に来た場合、`test.example.com`および`example.com`からのメールは接続の初回到着時間から5分間待つ必要があります。`test.example.com`と`example.com`それぞれに5分間の待機期間を設けることはありません（グレイリスティングはルートドメインレベルで適用されます）。

なお、グレイリスティングは当社の[許可リスト](#do-you-have-an-allowlist)にある送信者（例：Meta、Amazon、Netflix、Google、Microsoft）には適用されません（執筆時点）。

### デナイリストはありますか {#do-you-have-a-denylist}

はい、独自のデナイリストを運用しており、スパムや悪意のある活動を検出した場合にリアルタイムで自動更新および手動更新を行っています。

また、UCEPROTECT Level 1のデナイリストを<http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz>から毎時取得し、7日間の有効期限付きで当社のデナイリストに取り込んでいます。

デナイリストに登録されている送信者は、[許可リストにない場合](#do-you-have-an-allowlist)は421エラーコード（後で再試行するよう送信者に示す）を受け取ります。

554ステータスコードではなく421ステータスコードを使用することで、潜在的な誤検知をリアルタイムで緩和し、次回の試行でメッセージが正常に配信される可能性を高めています。

**これは他のメールサービスとは異なる設計です**。ブロックリストに載るとハードで永久的な失敗となる場合が多いですが、送信者（特に大規模組織）に再試行を依頼するのは困難なため、この方法では初回メール試行から約5日間の猶予を設け、送信者、受信者、または当社が介入して問題を解決（デナイリスト解除依頼）できるようにしています。

すべてのデナイリスト解除依頼は管理者がリアルタイムで監視しており（繰り返される誤検知は管理者により恒久的に許可リスト入りされます）。

デナイリスト解除依頼は<https://forwardemail.net/denylist>で受け付けています。有料ユーザーは即時処理され、非有料ユーザーは管理者の処理を待つ必要があります。

スパムやウイルスコンテンツを送信していると検出された送信者は、以下の方法でデナイリストに追加されます：

1. スパム検出または「信頼された」送信者（例：`gmail.com`、`microsoft.com`、`apple.com`）からのブロックリスト検出時に、[初期メッセージのフィンガープリント](#how-do-you-determine-an-email-fingerprint)がグレイリストされます。
   * 送信者が許可リストにある場合、メッセージは1時間グレイリストされます。
   * 許可リストにない場合、6時間グレイリストされます。
2. 送信者およびメッセージ情報からデナイリストキーを解析し、各キーについて（存在しない場合は新規作成し）カウンターを1増やし、24時間キャッシュします。
   * 許可リスト送信者の場合：
     * SPF合格またはSPFなしで、[ポストマスターのユーザー名](#what-are-postmaster-addresses)や[ノーリプライのユーザー名](#what-are-no-reply-addresses)でない場合、エンベロープの「MAIL FROM」メールアドレスのキーを追加。
     * 「From」ヘッダーが許可リストの場合、SPF合格またはDKIM合格かつ整合している場合に「From」ヘッダーのメールアドレスのキーを追加。
     * 「From」ヘッダーが許可リストでない場合、「From」ヘッダーのメールアドレスとそのルート解析ドメイン名のキーを追加。
   * 許可リスト外送信者の場合：
     * SPF合格のエンベロープ「MAIL FROM」メールアドレスのキーを追加。
     * 「From」ヘッダーが許可リストの場合、SPF合格またはDKIM合格かつ整合している場合に「From」ヘッダーのメールアドレスのキーを追加。
     * 「From」ヘッダーが許可リストでない場合、「From」ヘッダーのメールアドレスとそのルート解析ドメイン名のキーを追加。
     * 送信者のリモートIPアドレスのキーを追加。
     * 送信者のIPアドレスからの逆引きによるクライアント解決ホスト名のキーを追加（存在する場合）。
     * クライアント解決ホスト名のルートドメインのキーを追加（存在し、かつクライアント解決ホスト名と異なる場合）。
3. 許可リスト外送信者のキーのカウンターが5に達した場合、そのキーを30日間デナイリストに登録し、当社のアビューチームにメールを送信します。これらの数値は変更される可能性があり、監視に応じてここに反映されます。
4. 許可リスト送信者のキーのカウンターが10に達した場合、そのキーを7日間デナイリストに登録し、当社のアビューチームにメールを送信します。これらの数値は変更される可能性があり、監視に応じてここに反映されます。
> **注意:** 近い将来、レピュテーションモニタリングを導入予定です。レピュテーションモニタリングでは、上記の単純なカウンターではなく、パーセンテージの閾値に基づいて送信者を拒否リストに登録するタイミングを計算します。

### レート制限はありますか {#do-you-have-rate-limiting}

送信者のレート制限は、送信者のIPアドレスに対する逆PTRルックアップから解析されたルートドメイン単位、またはそれが得られない場合は単純に送信者のIPアドレス単位で行われます。以下ではこれを `Sender` と呼びます。

当社のMXサーバーは、[暗号化IMAPストレージ](/blog/docs/best-quantum-safe-encrypted-email-service)向けに受信メールの1日あたりの制限を設けています：

* 個々のエイリアス単位（例：`you@yourdomain.com`）で受信メールをレート制限する代わりに、エイリアスのドメイン名自体（例：`yourdomain.com`）でレート制限を行います。これにより、`Sender` がドメイン内のすべてのエイリアスの受信箱を一度に氾濫させるのを防ぎます。
* 受信者に関係なく、サービス全体のすべての `Sender` に適用される一般的な制限があります：
  * 真実の情報源として「信頼されている」と見なす `Sender`（例：`gmail.com`、`microsoft.com`、`apple.com`）は1日あたり100 GBの送信が許可されます。
  * [許可リスト](#do-you-have-an-allowlist)に登録されている `Sender` は1日あたり10 GBの送信が許可されます。
  * その他すべての `Sender` は1日あたり1 GBおよび/または1000通のメッセージ送信に制限されます。
* `Sender` と `yourdomain.com` ごとに1日あたり1 GBおよび/または1000通のメッセージの特定の制限があります。

MXサーバーは、1つ以上の受信者への転送メッセージもレート制限により制限しますが、これは[許可リスト](#do-you-have-an-allowlist)にない `Sender` のみが対象です：

* 1時間あたり、`Sender` の解決されたFQDNルートドメイン（または逆PTRがない場合は `Sender` のリモートIPアドレス）ごと、かつエンベロープ受信者ごとに最大100接続まで許可します。レート制限のキーはRedisデータベース内で暗号学的ハッシュとして保存されます。

* 当社のシステムを通じてメールを送信する場合は、すべてのIPアドレスに逆PTRが設定されていることを確認してください（そうでないと、送信元の各ユニークなFQDNルートドメインまたはIPアドレスごとにレート制限がかかります）。

* Amazon SESのような人気のあるシステムを通じて送信する場合は、（執筆時点で）Amazon SESが許可リストに登録されているため、レート制限はかかりません。

* `test.abc.123.example.com` のようなドメインから送信する場合、レート制限は `example.com` に対して課されます。多くのスパマーは、ユニークなFQDNルートドメインではなくユニークなホスト名のみをレート制限する一般的なスパムフィルターを回避するために、数百のサブドメインを使用します。

* レート制限を超えた `Sender` は421エラーで拒否されます。

当社のIMAPおよびSMTPサーバーは、エイリアスが同時に `60` を超える接続を持つことを制限しています。

当社のMXサーバーは、[非許可リスト](#do-you-have-an-allowlist)の送信者が10を超える同時接続を確立することを制限しています（カウンターのキャッシュ有効期限は3分で、ソケットタイムアウト3分に対応しています）。

### バックスキャッターからどのように保護していますか {#how-do-you-protect-against-backscatter}

誤送信されたバウンスやバウンススパム（「[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))」として知られる）は、送信者IPアドレスのレピュテーションに悪影響を及ぼす可能性があります。

当社はバックスキャッターから保護するために2つの対策を講じており、以下のセクション [既知のMAIL FROMスパマーからのバウンスを防ぐ](#prevent-bounces-from-known-mail-from-spammers) と [バックスキャッターから保護するために不要なバウンスを防ぐ](#prevent-unnecessary-bounces-to-protect-against-backscatter) に詳細を記載しています。

### 既知のMAIL FROMスパマーからのバウンスを防ぐ {#prevent-bounces-from-known-mail-from-spammers}

当社は [Backscatter.org](https://www.backscatterer.org/)（[UCEPROTECT](https://www.uceprotect.net/)提供）からリストを取得し、<http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> から毎時ダウンロードしてRedisデータベースに取り込んでいます（また、事前に差分を比較し、尊重すべきIPが削除されていないかも確認しています）。
MAIL FROMが空白であるか、または（大文字・小文字を区別せずに）[postmasterアドレス](#what-are-postmaster-addresses)（メールアドレスの@の前の部分）のいずれかと等しい場合、送信者のIPがこのリストのいずれかと一致するかどうかを確認します。

送信者のIPがリストにあり（かつ当社の[許可リスト](#do-you-have-an-allowlist)に含まれていない）場合、`The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`というメッセージとともに554エラーを送信します。送信者がBackscattererリストと当社の許可リストの両方に存在する場合は、問題を解決できるように通知されます。

このセクションで説明する手法は、<https://www.backscatterer.org/?target=usage> の「SAFE MODE」推奨に準拠しており、特定の条件が既に満たされている場合にのみ送信者IPをチェックします。

### バックスキャッターからの不要なバウンスを防止する {#prevent-unnecessary-bounces-to-protect-against-backscatter}

バウンスとは、メール転送が完全に失敗し、再試行されないことを示すメールです。

Backscattererリストに登録される一般的な理由は、誤送信されたバウンスやバウンススパムであるため、以下の方法でこれを防止する必要があります：

1. 500以上のステータスコードエラーが発生した場合のみ送信します（転送しようとしたメールが失敗した場合、例：Gmailが500レベルのエラーで応答した場合）。

2. 送信は一度だけ行います（計算されたバウンスフィンガープリントキーを使用し、重複送信を防ぐためにキャッシュに保存します）。バウンスフィンガープリントは、メッセージのフィンガープリントとバウンスアドレスおよびそのエラーコードのハッシュを組み合わせたキーです）。メッセージフィンガープリントの計算方法については、[Fingerprinting](#how-do-you-determine-an-email-fingerprint)のセクションを参照してください。正常に送信されたバウンスフィンガープリントは、Redisキャッシュで7日後に期限切れになります。

3. MAIL FROMおよび/またはFromが空白でなく、（大文字・小文字を区別せずに）[postmasterユーザー名](#what-are-postmaster-addresses)（メールアドレスの@の前の部分）を含まない場合のみ送信します。

4. 元のメッセージに以下のヘッダーが含まれている場合は送信しません（大文字・小文字を区別しません）：

   * 値が`no`でない`auto-submitted`ヘッダー。
   * 値が`dr`、`autoreply`、`auto-reply`、`auto_reply`、または`all`の`x-auto-response-suppress`ヘッダー。
   * 値に関係なく、`list-id`、`list-subscribe`、`list-unsubscribe`、`list-help`、`list-post`、`list-owner`、`list-archive`、`x-autoreply`、`x-autorespond`、または`x-auto-respond`ヘッダー。
   * 値が`bulk`、`autoreply`、`auto-reply`、`auto_reply`、または`list`の`precedence`ヘッダー。

5. MAIL FROMまたはFromのメールアドレスが`+donotreply`、`-donotreply`、`+noreply`、または`-noreply`で終わる場合は送信しません。

6. Fromのメールアドレスのユーザー名部分が`mdaemon`で、かつ大文字・小文字を区別せずに`X-MDDSN-Message`ヘッダーがある場合は送信しません。

7. 大文字・小文字を区別せずに`content-type`ヘッダーが`multipart/report`の場合は送信しません。

### メールのフィンガープリントはどのように決定しますか {#how-do-you-determine-an-email-fingerprint}

メールのフィンガープリントは、メールの一意性を判断し、重複したメッセージの配信や[重複バウンス](#prevent-unnecessary-bounces-to-protect-against-backscatter)の送信を防ぐために使用されます。

フィンガープリントは以下のリストから計算されます：

* クライアントが解決したFQDNホスト名またはIPアドレス
* `Message-ID`ヘッダーの値（ある場合）
* `Date`ヘッダーの値（ある場合）
* `From`ヘッダーの値（ある場合）
* `To`ヘッダーの値（ある場合）
* `Cc`ヘッダーの値（ある場合）
* `Subject`ヘッダーの値（ある場合）
* `Body`の値（ある場合）

### 25番ポート以外のポートにメールを転送できますか（例：ISPが25番ポートをブロックしている場合） {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

はい、2020年5月5日よりこの機能を追加しました。現在、この機能はエイリアス単位ではなくドメイン単位での対応となっています。エイリアス単位での対応が必要な場合は、ご要望をお知らせください。

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    強化されたプライバシー保護：
  </strong>
  <span>
    強化されたプライバシー保護を特徴とする有料プランをご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a>にアクセスし、ドメインの「セットアップ」をクリックしてから「設定」をクリックしてください。有料プランの詳細については<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">料金ページ</a>をご覧ください。そうでない場合は、以下の指示に従ってください。
  </span>
</div>
無料プランをご利用の場合は、以下のように新しいDNS <strong class="notranslate">TXT</strong>レコードを追加するだけですが、ポートは25からお好きなポートに変更してください。

例えば、`example.com` に届くすべてのメールを、ポート25ではなくエイリアス受信者のSMTPポート1337に転送したい場合：

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
    カスタムポート転送設定の最も一般的なシナリオは、example.com に届くすべてのメールをSMTP標準のポート25以外のexample.comの別のポートに転送したい場合です。これを設定するには、以下の<strong class="notranslate">TXT</strong>キャッチオールレコードを追加してください。
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Gmailのエイリアスでプラス + 記号はサポートしていますか {#does-it-support-the-plus--symbol-for-gmail-aliases}

はい、もちろんです。

### サブドメインはサポートしていますか {#does-it-support-sub-domains}

はい、もちろんです。名前/ホスト/エイリアスとして "@", ".", または空白の代わりに、サブドメイン名を値として使用します。

例えば、`foo.example.com` に届くメールを転送したい場合は、DNS設定の名前/ホスト/エイリアス値に `foo` を入力してください（MXレコードと<strong class="notranslate">TXT</strong>レコードの両方で）。

### メールのヘッダーも転送されますか {#does-this-forward-my-emails-headers}

はい、もちろんです。

### 十分にテストされていますか {#is-this-well-tested}

はい、[ava](https://github.com/avajs/ava)でテストが書かれており、コードカバレッジもあります。

### SMTPの応答メッセージやコードはそのまま渡されますか {#do-you-pass-along-smtp-response-messages-and-codes}

はい、もちろんです。例えば、`hello@example.com` にメールを送信し、それが `user@gmail.com` に転送登録されている場合、"gmail.com" のSMTPサーバーからの応答メッセージとコードが、"mx1.forwardemail.net" や "mx2.forwardemail.net" のプロキシサーバーではなく返されます。

### スパマーを防止し、良好なメール転送の評判を確保するにはどうしていますか {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

上記の [メール転送システムの仕組み](#how-does-your-email-forwarding-system-work)、[メール配信問題の対処方法](#how-do-you-handle-email-delivery-issues)、および [IPアドレスのブロック対処方法](#how-do-you-handle-your-ip-addresses-becoming-blocked) のセクションをご覧ください。

### ドメイン名のDNSルックアップはどのように行っていますか {#how-do-you-perform-dns-lookups-on-domain-names}

オープンソースソフトウェアプロジェクト :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) を作成し、DNSルックアップに使用しています。デフォルトのDNSサーバーは `1.1.1.1` と `1.0.0.1` で、DNSクエリはアプリケーション層の [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") を通じて行われます。

:tangerine: [Tangerine](https://github.com/tangerine) はデフォルトで [CloudFlareのプライバシー重視の一般消費者向けDNSサービス][cloudflare-dns] を使用しています。


## アカウントと請求 {#account-and-billing}

### 有料プランに返金保証はありますか {#do-you-offer-a-money-back-guarantee-on-paid-plans}

はい！プラン開始から30日以内にアップグレード、ダウングレード、またはキャンセルした場合、自動的に返金されます。これは初回のお客様のみ対象です。
### プランを切り替えた場合、差額を日割り計算して返金してもらえますか？ {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

プランを切り替えた際に差額の日割り計算や返金は行いません。代わりに、既存プランの有効期限から残りの期間を新しいプランの最も近い期間（1か月単位で切り捨て）に変換します。

なお、有料プランを開始してから30日以内に有料プラン間でアップグレードまたはダウングレードした場合は、既存プランの全額を自動的に返金します。

### このメール転送サービスを「フォールバック」または「フォールオーバー」MXサーバーとして使えますか？ {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

いいえ、お勧めできません。メール交換サーバーは同時に1つしか使用できません。フォールバックは優先順位の誤設定やメールサーバーがMX交換の優先順位チェックを尊重しないため、通常は再試行されません。

### 特定のエイリアスを無効にできますか？ {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    有料プランをご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス <i class="fa fa-angle-right"></i> エイリアス編集 <i class="fa fa-angle-right"></i> 「アクティブ」チェックボックスのチェックを外す <i class="fa fa-angle-right"></i> 続行してください。
  </span>
</div>

はい、DNSの<strong class="notranslate">TXT</strong>レコードを編集し、エイリアスの前に1つ、2つ、または3つの感嘆符を付けるだけです（以下参照）。

「:」のマッピングは必ず保持してください。これは無効化を切り替える場合に必要であり、有料プランにアップグレードした際のインポートにも使用されます。

**静かな拒否（送信者にはメッセージが正常に送信されたように見えますが、実際にはどこにも届かない）（ステータスコード `250`）：** エイリアスの前に「!」（感嘆符1つ）を付けると、このアドレス宛の送信者に対して成功ステータスコード `250` を返しますが、メール自体はどこにも届きません（例：ブラックホールや `/dev/null`）。

**ソフト拒否（ステータスコード `421`）：** エイリアスの前に「!!」（感嘆符2つ）を付けると、このアドレス宛の送信者に対してソフトエラーステータスコード `421` を返し、メールは最大5日間再試行された後に拒否されバウンスします。

**ハード拒否（ステータスコード `550`）：** エイリアスの前に「!!!」（感嘆符3つ）を付けると、このアドレス宛の送信者に対して恒久的エラーステータスコード `550` を返し、メールは拒否されバウンスします。

例えば、`alias@example.com` 宛のすべてのメールを `user@gmail.com` に転送せず拒否・バウンスさせたい場合（感嘆符3つを使用）：

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    転送先の受信者アドレスを単に "nobody@forwardemail.net" に書き換えることもでき、以下の例のように nobody にルーティングされます。
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    セキュリティを強化したい場合は、":user@gmail.com"（または":nobody@forwardemail.net"）の部分を削除し、下記の例のように "!!!alias" のみを残すこともできます。
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### 複数の受信者にメールを転送できますか {#can-i-forward-emails-to-multiple-recipients}

はい、もちろんです。<strong class="notranslate">TXT</strong>レコードに複数の受信者を指定するだけです。

例えば、`hello@example.com` に届くメールを `user+a@gmail.com` と `user+b@gmail.com` に転送したい場合、<strong class="notranslate">TXT</strong>レコードは以下のようになります。

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

または、以下のように2行に分けて指定することもできます。

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

お好みでどうぞ！

### 複数のグローバルキャッチオール受信者を設定できますか {#can-i-have-multiple-global-catch-all-recipients}

はい、可能です。<strong class="notranslate">TXT</strong>レコードに複数のグローバルキャッチオール受信者を指定してください。

例えば、`*@example.com`（アスタリスクはワイルドカード、つまりキャッチオールを意味します）に届くすべてのメールを `user+a@gmail.com` と `user+b@gmail.com` に転送したい場合、<strong class="notranslate">TXT</strong>レコードは以下のようになります。

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

または、以下のように2行に分けて指定することもできます。

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>名前/ホスト/エイリアス</th>
      <th class="text-center">TTL</th>
      <th>タイプ</th>
      <th>回答/値</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", または空白</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
あなた次第です！

### エイリアスごとに転送できるメールアドレスの最大数はありますか？ {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

はい、デフォルトの制限は10です。これは、ドメイン名にエイリアスを10個しか持てないという意味ではありません。エイリアスは無制限に作成可能です。つまり、1つのエイリアスから転送できるユニークなメールアドレスは10個までということです。例えば、`hello:user+1@gmail.com`、`hello:user+2@gmail.com`、`hello:user+3@gmail.com`、…（1から10まで）と設定し、`hello@example.com`宛のメールは`user+1@gmail.com`、`user+2@gmail.com`、`user+3@gmail.com`、…（1から10まで）に転送されます。

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ヒント:
  </strong>
  <span>
    エイリアスごとに10人以上の受信者が必要ですか？メールをお送りいただければ、アカウントの制限を増やすことも可能です。
  </span>
</div>

### メールを再帰的に転送できますか？ {#can-i-recursively-forward-emails}

はい、可能ですが最大制限は守る必要があります。例えば、`hello:linus@example.com` と `linus:user@gmail.com` がある場合、`hello@example.com` 宛のメールは `linus@example.com` と `user@gmail.com` に転送されます。最大制限を超えて再帰的に転送しようとするとエラーが発生しますのでご注意ください。

### 許可なく私のメール転送を登録または解除されることはありますか？ {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

当サービスはMXおよび<strong class="notranslate">TXT</strong>レコードの検証を使用しています。したがって、このサービスのMXおよび<strong class="notranslate">TXT</strong>レコードを追加すれば登録され、削除すれば登録解除となります。ドメインとDNS管理の所有権はあなたにあるため、誰かがそれにアクセスできる場合は問題となります。

### どうして無料なのですか？ {#how-is-it-free}

Forward Emailは、オープンソース開発、効率的なインフラストラクチャ、そしてサービスを支えるオプションの有料プランの組み合わせにより無料プランを提供しています。

無料プランは以下に支えられています：

1. **オープンソース開発**：コードベースはオープンソースで、コミュニティの貢献と透明な運営を可能にしています。

2. **効率的なインフラ**：最小限のリソースでメール転送を処理できるようシステムを最適化しています。

3. **有料プレミアムプラン**：SMTP送信、IMAP受信、強化されたプライバシーオプションなどの追加機能を必要とするユーザーは有料プランに加入します。

4. **適切な使用制限**：無料プランには乱用を防ぐための公正な使用ポリシーがあります。

> \[!NOTE]
> 基本的なメール転送は無料で提供しつつ、高度なニーズを持つユーザー向けにプレミアム機能を提供することにコミットしています。

> \[!TIP]
> 当サービスを価値あると感じたら、継続的な開発とメンテナンスを支援するために有料プランへのアップグレードをご検討ください。

### 最大メールサイズの制限は？ {#what-is-the-max-email-size-limit}

デフォルトで50MBのサイズ制限があります。これはコンテンツ、ヘッダー、添付ファイルを含みます。GmailやOutlookなどのサービスは25MBの制限があり、それを超えて送信しようとするとエラーメッセージが返されます。

ファイルサイズ制限を超えた場合は、適切な応答コード付きのエラーが返されます。

### メールのログを保存していますか？ {#do-you-store-logs-of-emails}

いいえ、ディスクへの書き込みやログの保存は行っていません。ただし、[エラーのログ](#do-you-store-error-logs)および[送信SMTP](#do-you-support-sending-email-with-smtp)に関しては例外です（詳細は[プライバシーポリシー](/privacy)をご覧ください）。

すべてはメモリ内で処理されており、[ソースコードはGitHubで公開されています](https://github.com/forwardemail)。

### エラーログは保存していますか？ {#do-you-store-error-logs}

**はい。[マイアカウント → ログ](/my-account/logs) または [マイアカウント → ドメイン](/my-account/domains) からエラーログにアクセスできます。**

2023年2月現在、`4xx` および `5xx` のSMTP応答コードに関するエラーログを7日間保存しています。これにはSMTPエラー、エンベロープ、メールヘッダーが含まれます（メール本文や添付ファイルは**保存しません**）。
エラーログを使用すると、[あなたのドメイン](/my-account/domains)に届かない重要なメールを確認したり、スパムの誤検知を軽減したりできます。また、[メールウェブフック](#do-you-support-webhooks)の問題をデバッグする際にも非常に役立ちます（エラーログにはウェブフックのエンドポイント応答が含まれているため）。

[レート制限](#do-you-have-rate-limiting)および[グレイリスト](#do-you-have-a-greylist)のエラーログは、接続が早期に終了するため（例：`RCPT TO`や`MAIL FROM`コマンドが送信される前に）アクセスできません。

詳細は当社の[プライバシーポリシー](/privacy)をご覧ください。

### メールを読んでいますか {#do-you-read-my-emails}

いいえ、絶対に読みません。 当社の[プライバシーポリシー](/privacy)をご覧ください。

多くの他のメール転送サービスはメールを保存し、潜在的にメールを読むことがあります。 転送されたメールをディスクストレージに保存する必要は全くありません。そのため、当社はすべてをメモリ内で処理する最初のオープンソースソリューションを設計しました。

プライバシーの権利を尊重し、厳格に守っています。 サーバーにデプロイされるコードは透明性と信頼構築のために[GitHubのオープンソースソフトウェア](https://github.com/forwardemail)です。

### これでGmailの「送信者として送信」はできますか {#can-i-send-mail-as-in-gmail-with-this}

はい！2018年10月2日よりこの機能を追加しました。 上記の[How to Send Mail As using Gmail](#how-to-send-mail-as-using-gmail)をご覧ください！

また、DNS設定のSPFレコードにGmail用の<strong class="notranslate">TXT</strong>レコードを設定してください。

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    Gmail（例：送信者として送信）やG Suiteを使用している場合は、SPFの<strong class="notranslate">TXT</strong>レコードに<code>include:_spf.google.com</code>を追加する必要があります。例：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### これでOutlookの「送信者として送信」はできますか {#can-i-send-mail-as-in-outlook-with-this}

はい！2018年10月2日よりこの機能を追加しました。 以下のMicrosoftのリンクをご覧ください：

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

また、DNS設定のSPFレコードにOutlook用の<strong class="notranslate">TXT</strong>レコードを設定してください。

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    重要:
  </strong>
  <span>
    Microsoft OutlookやLive.comを使用している場合は、SPFの<strong class="notranslate">TXT</strong>レコードに<code>include:spf.protection.outlook.com</code>を追加する必要があります。例：
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### これでApple MailやiCloud Mailの「送信者として送信」はできますか {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

iCloud+のサブスクライバーであれば、カスタムドメインを使用できます。 [当サービスはApple Mailにも対応しています](#apple-mail)。

詳細は<https://support.apple.com/en-us/102540>をご覧ください。

### これで無制限にメールを転送できますか {#can-i-forward-unlimited-emails-with-this}

はい。ただし、「比較的知られていない」送信者はホスト名またはIPごとに1時間あたり100接続にレート制限されます。 上記の[レート制限](#do-you-have-rate-limiting)および[グレイリスト](#do-you-have-a-greylist)のセクションをご覧ください。

「比較的知られていない」とは、[許可リスト](#do-you-have-an-allowlist)に存在しない送信者を指します。

この制限を超えると、送信者のメールサーバーに後で再試行するよう指示する421応答コードを送信します。

### 1つの料金で無制限のドメインを提供していますか {#do-you-offer-unlimited-domains-for-one-price}

はい。どのプランにいても、すべてのドメインをカバーする1つの月額料金のみをお支払いいただきます。
### どの支払い方法を受け付けていますか {#which-payment-methods-do-you-accept}

Forward Email は以下の一回払いまたは月額・四半期・年額の支払い方法を受け付けています：

1. **クレジット/デビットカード/銀行振込**：Visa、Mastercard、American Express、Discover、JCB、Diners Club など
2. **PayPal**：簡単に支払いができるように PayPal アカウントを接続
3. **暗号通貨**：Ethereum、Polygon、Solana ネットワーク上の Stripe のステーブルコイン支払いを通じて支払いを受け付けています

> \[!NOTE]
> 当社のサーバーには限定的な支払い情報のみを保存しており、これには [Stripe](https://stripe.com/global) および [PayPal](https://www.paypal.com) の取引、顧客、サブスクリプション、支払い ID の識別子と参照が含まれます。

> \[!TIP]
> 最大限のプライバシーを確保するには、暗号通貨での支払いを検討してください。

すべての支払いは Stripe または PayPal を通じて安全に処理されます。お客様の支払い情報が当社のサーバーに保存されることはありません。


## 追加リソース {#additional-resources}

> \[!TIP]
> 以下の記事は新しいガイド、ヒント、技術情報で定期的に更新されています。最新の内容を確認するために頻繁にご覧ください。

* [ケーススタディ & 開発者向けドキュメント](/blog/docs)
* [リソース](/resources)
* [ガイド](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
