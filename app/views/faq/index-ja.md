# よくある質問 {#frequently-asked-questions}

<img 読み込み="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## 目次 {#table-of-contents}

* [クイックスタート](#quick-start)
* [導入](#introduction)
  * [メール転送とは](#what-is-forward-email)
  * [転送メールを使用する人](#who-uses-forward-email)
  * [転送メールの履歴とは](#what-is-forward-emails-history)
  * [このサービスはどれくらい速いですか](#how-fast-is-this-service)
* [メールクライアント](#email-clients)
  * [サンダーバード](#thunderbird)
  * [マイクロソフトアウトルック](#microsoft-outlook)
  * [アップルメール](#apple-mail)
  * [モバイルデバイス](#mobile-devices)
  * [Gmailでメールを送信する方法](#how-to-send-mail-as-using-gmail)
  * [Gmailを使用したメール送信の従来の無料ガイドとは何ですか](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [高度なGmailルーティング設定](#advanced-gmail-routing-configuration)
  * [高度な Outlook ルーティング構成](#advanced-outlook-routing-configuration)
* [トラブルシューティング](#troubleshooting)
  * [テストメールが届かないのはなぜですか？](#why-am-i-not-receiving-my-test-emails)
  * [メールクライアントを「メール転送」で動作するように設定するにはどうすればよいですか？](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [なぜ私のメールはスパムや迷惑メールに分類されてしまうのか、またドメインの評判を確認するにはどうすればいいのか](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [スパムメールを受信した場合はどうすればいいですか？](#what-should-i-do-if-i-receive-spam-emails)
  * [Gmail で自分宛に送信したテストメールが「疑わしい」と表示されるのはなぜですか?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Gmailのvia forwardemail.netを削除できますか？](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [データ管理](#data-management)
  * [サーバーはどこにありますか](#where-are-your-servers-located)
  * [メールボックスをエクスポートしてバックアップするにはどうすればいいですか？](#how-do-i-export-and-backup-my-mailbox)
  * [既存のメールボックスをインポートして移行するにはどうすればいいですか？](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [セルフホスティングをサポートしていますか](#do-you-support-self-hosting)
* [メール設定](#email-configuration)
  * [メール転送を開始して設定するにはどうすればよいですか？](#how-do-i-get-started-and-set-up-email-forwarding)
  * [高度な転送のために複数のMX交換とサーバーを使用できますか？](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [不在通知（不在時自動返信）を設定するにはどうすればいいですか？](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [転送メールにSPFを設定するにはどうすればいいですか？](#how-do-i-set-up-spf-for-forward-email)
  * [転送メールにDKIMを設定するにはどうすればいいですか？](#how-do-i-set-up-dkim-for-forward-email)
  * [転送メールにDMARCを設定するにはどうすればいいですか？](#how-do-i-set-up-dmarc-for-forward-email)
  * [連絡先を接続して設定するにはどうすればいいですか](#how-do-i-connect-and-configure-my-contacts)
  * [カレンダーを接続して設定するにはどうすればいいですか](#how-do-i-connect-and-configure-my-calendars)
  * [カレンダーを追加したり、既存のカレンダーを管理するにはどうすればよいですか？](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [メール転送用のSRSを設定するにはどうすればいいですか？](#how-do-i-set-up-srs-for-forward-email)
  * [メール転送用のMTA-STSを設定するにはどうすればいいですか？](#how-do-i-set-up-mta-sts-for-forward-email)
  * [メールアドレスにプロフィール写真を追加するにはどうすればいいですか？](#how-do-i-add-a-profile-picture-to-my-email-address)
* [高度な機能](#advanced-features)
  * [マーケティング関連のメールのためのニュースレターやメーリングリストをサポートしていますか？](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [APIを使ったメール送信をサポートしていますか](#do-you-support-sending-email-with-api)
  * [IMAPでメールを受信できますか？](#do-you-support-receiving-email-with-imap)
  * [POP3をサポートしていますか](#do-you-support-pop3)
  * [カレンダー（CalDAV）をサポートしていますか？](#do-you-support-calendars-caldav)
  * [連絡先（CardDAV）をサポートしていますか？](#do-you-support-contacts-carddav)
  * [SMTPによるメール送信をサポートしていますか](#do-you-support-sending-email-with-smtp)
  * [OpenPGP/MIME、エンドツーエンド暗号化（「E2EE」）、Webキーディレクトリ（「WKD」）をサポートしていますか？](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [MTA-STSをサポートしていますか](#do-you-support-mta-sts)
  * [パスキーとWebAuthnをサポートしていますか](#do-you-support-passkeys-and-webauthn)
  * [メールのベストプラクティスをサポートしていますか](#do-you-support-email-best-practices)
  * [バウンスWebhookをサポートしていますか？](#do-you-support-bounce-webhooks)
  * [Webhookをサポートしていますか](#do-you-support-webhooks)
  * [正規表現をサポートしていますか？](#do-you-support-regular-expressions-or-regex)
  * [送信SMTP制限は何ですか？](#what-are-your-outbound-smtp-limits)
  * [SMTPを有効にするには承認が必要ですか？](#do-i-need-approval-to-enable-smtp)
  * [SMTPサーバーの構成設定は何ですか？](#what-are-your-smtp-server-configuration-settings)
  * [IMAPサーバーの設定は何ですか？](#what-are-your-imap-server-configuration-settings)
  * [POP3サーバーの設定は何ですか？](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTPリレー設定](#postfix-smtp-relay-configuration)
* [安全](#security)
  * [高度なサーバー強化技術](#advanced-server-hardening-techniques)
  * [SOC 2またはISO 27001認証を取得していますか？](#do-you-have-soc-2-or-iso-27001-certifications)
  * [メール転送にTLS暗号化を使用していますか？](#do-you-use-tls-encryption-for-email-forwarding)
  * [メール認証ヘッダーを保存しますか](#do-you-preserve-email-authentication-headers)
  * [元のメールヘッダーを保存し、なりすましを防止していますか？](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [スパムや不正使用からどのように保護しますか](#how-do-you-protect-against-spam-and-abuse)
  * [メールの内容をディスクに保存していますか](#do-you-store-email-content-on-disk)
  * [システムクラッシュ時にメールの内容が公開される可能性はありますか？](#can-email-content-be-exposed-during-system-crashes)
  * [メールインフラにアクセスできるのは誰か](#who-has-access-to-your-email-infrastructure)
  * [どのインフラプロバイダーを利用していますか](#what-infrastructure-providers-do-you-use)
  * [データ処理契約（DPA）を提供していますか？](#do-you-offer-a-data-processing-agreement-dpa)
  * [データ侵害通知をどのように処理しますか](#how-do-you-handle-data-breach-notifications)
  * [テスト環境を提供していますか](#do-you-offer-a-test-environment)
  * [監視および警告ツールを提供していますか](#do-you-provide-monitoring-and-alerting-tools)
  * [高可用性をどのように確保するか](#how-do-you-ensure-high-availability)
  * [国防権限法（NDAA）第889条に準拠していますか？](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [システムと技術の詳細](#system-and-technical-details)
  * [メールとその内容を保存しますか](#do-you-store-emails-and-their-contents)
  * [メール転送システムはどのように機能しますか](#how-does-your-email-forwarding-system-work)
  * [メールを転送するにはどうすればいいですか？](#how-do-you-process-an-email-for-forwarding)
  * [メール配信の問題にどのように対処しますか](#how-do-you-handle-email-delivery-issues)
  * [IPアドレスがブロックされたらどう対処しますか？](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [郵便局長の住所とは何ですか](#what-are-postmaster-addresses)
  * [返信不要アドレスとは](#what-are-no-reply-addresses)
  * [サーバーのIPアドレスは何ですか？](#what-are-your-servers-ip-addresses)
  * [許可リストはありますか](#do-you-have-an-allowlist)
  * [デフォルトで許可リストに登録されるドメイン名拡張子](#what-domain-name-extensions-are-allowlisted-by-default)
  * [許可リストの基準は何ですか](#what-is-your-allowlist-criteria)
  * [無料で使えるドメイン名拡張子](#what-domain-name-extensions-can-be-used-for-free)
  * [グレーリストはありますか](#do-you-have-a-greylist)
  * [ブラックリストはありますか？](#do-you-have-a-denylist)
  * [レート制限はありますか](#do-you-have-rate-limiting)
  * [後方散乱からどのように保護するか](#how-do-you-protect-against-backscatter)
  * [既知のMAIL FROMスパマーからのバウンスを防ぐ](#prevent-bounces-from-known-mail-from-spammers)
  * [不要な反射を防ぎ、後方散乱から保護する](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [メールの指紋をどのように特定するか](#how-do-you-determine-an-email-fingerprint)
  * [25番以外のポートにメールを転送できますか（例：ISPがポート25をブロックしている場合）](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Gmailエイリアスのプラス記号（+）をサポートしていますか？](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [サブドメインをサポートしていますか](#does-it-support-sub-domains)
  * [これは私のメールのヘッダーを転送しますか？](#does-this-forward-my-emails-headers)
  * [これは十分にテストされているか](#is-this-well-tested)
  * [SMTP応答メッセージとコードを渡しますか？](#do-you-pass-along-smtp-response-messages-and-codes)
  * [スパムメールを防ぎ、メール転送の評判を良くするにはどうすればいいでしょうか？](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [ドメイン名のDNSルックアップをどのように実行するか](#how-do-you-perform-dns-lookups-on-domain-names)
* [アカウントと請求](#account-and-billing)
  * [有料プランには返金保証がありますか？](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [プランを変更した場合、差額を日割り計算して返金してもらえますか？](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [このメール転送サービスを「フォールバック」または「フォールオーバー」MXサーバーとして使用できますか？](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [特定のエイリアスを無効にすることはできますか](#can-i-disable-specific-aliases)
  * [メールを複数の受信者に転送できますか](#can-i-forward-emails-to-multiple-recipients)
  * [複数のグローバルキャッチオール受信者を設定できますか](#can-i-have-multiple-global-catch-all-recipients)
  * [エイリアスごとに転送できるメールアドレスの数に上限はありますか？](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [メールを再帰的に転送できますか](#can-i-recursively-forward-emails)
  * [私の許可なくメール転送を登録または解除することはできますか？](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [どうして無料なの？](#how-is-it-free)
  * [メールの最大サイズ制限は？](#what-is-the-max-email-size-limit)
  * [メールのログを保存していますか](#do-you-store-logs-of-emails)
  * [エラーログを保存しますか](#do-you-store-error-logs)
  * [私のメールを読んでいますか](#do-you-read-my-emails)
  * [Gmailで「メールを送信」するにはこれが必要ですか？](#can-i-send-mail-as-in-gmail-with-this)
  * [Outlookで「メールを送信」するには、](#can-i-send-mail-as-in-outlook-with-this)
  * [Apple MailとiCloud Mailで「メールを送信」することはできますか？](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [これで無制限にメールを転送できますか？](#can-i-forward-unlimited-emails-with-this)
  * [1つの価格で無制限のドメインを提供していますか？](#do-you-offer-unlimited-domains-for-one-price)
  * [どのような支払い方法を受け付けていますか](#which-payment-methods-do-you-accept)
* [追加リソース](#additional-resources)

## クイックスタート {#quick-start}

メール転送を開始するには:

1. [forwardemail.net/register](https://forwardemail.net/register)で**アカウントを作成**します

2. [マイアカウント → ドメイン](/my-account/domains)の下に**ドメインを追加して検証する**

3. [マイアカウント → ドメイン](/my-account/domains) → エイリアスの下に**メールエイリアス/メールボックスを追加して設定する**

4. 新しいエイリアスの1つにメールを送信して**設定をテスト**します

> \[!TIP]
> DNS の変更がグローバルに反映されるまでには最大 24～48 時間かかる場合がありますが、通常はそれよりも早く反映されます。

> \[!IMPORTANT]
> 配信率を向上させるには、[SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email)、および[DMARC](#how-do-i-set-up-dmarc-for-forward-email)レコードを設定することをお勧めします。

## はじめに {#introduction}

### 転送メールとは{#what-is-forward-email}

> \[!NOTE]
> Forward Email は、完全なメールホスティングソリューションのコストやメンテナンスなしで、プロフェッショナルなメールアドレスを必要とする個人、中小企業、開発者に最適です。

Forward Email は、**フル機能の電子メール サービス プロバイダー** であり、**カスタム ドメイン名用の電子メール ホスティング プロバイダー** です。

これは唯一の無料のオープンソース サービスであり、独自の電子メール サーバーをセットアップして維持する複雑さなしで、カスタム ドメインの電子メール アドレスを使用できます。

当社のサービスでは、カスタム ドメインに送信されたメールを既存のメール アカウントに転送します。また、当社を専用のメール ホスティング プロバイダーとして使用することもできます。

メール転送の主な機能:

* **カスタムドメインメール**: 独自ドメイン名でビジネス向けメールアドレスをご利用いただけます
* **無料プラン**: 基本的なメール転送機能は無料でご利用いただけます
* **強化されたプライバシー**: お客様のメールを読んだり、データを販売したりすることはありません
* **オープンソース**: コードベース全体がGitHubで公開されています
* **SMTP、IMAP、POP3のサポート**: 完全なメール送受信機能
* **エンドツーエンド暗号化**: OpenPGP/MIMEをサポート
* **カスタムキャッチオールエイリアス**: メールエイリアスを無制限に作成できます

[メール比較ページ](/blog/best-email-service) で当社を 56 社以上の他のメール サービス プロバイダーと比較できます。

> \[!TIP]
> メール転送について詳しくは、無料の[技術ホワイトペーパー](/technical-whitepaper.pdf)をご覧ください。

### 転送メールを使用するユーザー {#who-uses-forward-email}

当社は、500,000 以上のドメインと以下の著名なユーザーにメール ホスティングおよびメール転送サービスを提供しています。

| お客様 | ケーススタディ |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| アメリカ海軍兵学校 | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| 正規 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflixゲーム |  |
| Linux Foundation | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP財団 |  |
| フォックスニュースラジオ |  |
| ディズニーの広告販売 |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| リネージュOS |  |
| ウブントゥ | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| 無料 | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| ルブントゥ | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| ケンブリッジ大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| メリーランド大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| ワシントン大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| タフツ大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| スワースモア大学 | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| 南オーストラリア州政府 |  |
| ドミニカ共和国政府 |  |
| 飛ぶ。io |  |
| RCDホテル |  |
| アイザック・Z・シュルーター（npm） | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### 転送メールの履歴とは {#what-is-forward-emails-history}

メール転送の詳細については、[当社の「会社概要」ページ](/about) をご覧ください。

### このサービスの速度はどのくらいですか？ {#how-fast-is-this-service}

> \[!NOTE]
> 当社のシステムは、スピードと信頼性を重視して設計されており、複数の冗長サーバーによりメールが迅速に配信されます。

メール転送では、通常は受信後数秒以内に、最小限の遅延でメッセージを配信します。

パフォーマンスメトリック:

* **平均配信時間**: 受信から転送まで5～10秒未満 ([受信トレイまでの時間「TTI」モニタリングページをご覧ください](/tti))
* **稼働時間**: 99.9%以上のサービス可用性
* **グローバルインフラストラクチャ**: 最適なルーティングのために戦略的に配置されたサーバー
* **自動スケーリング**: メールのピーク時にはシステムがスケーリングされます

当社は、遅延キューに依存する他のプロバイダーとは異なり、リアルタイムで動作します。

[エラーの例外](#do-you-store-error-logs) および [送信SMTP](#do-you-support-sending-email-with-smtp) では、ディスクに書き込んだり、ログを保存したりしません ([プライバシーポリシー](/privacy) を参照)。

すべてはメモリ内および [ソースコードはGitHubにあります](https://github.com/forwardemail) で実行されます。

## メールクライアント {#email-clients}

### サンダーバード {#thunderbird}

1. 転送メールダッシュボードで新しいエイリアスを作成し、パスワードを生成します。
2. Thunderbirdを開き、**編集 → アカウント設定 → アカウント操作 → メールアカウントを追加** に移動します。
3. 名前、転送メールアドレス、パスワードを入力します。
4. **手動で設定** をクリックし、以下の情報を入力します。
* 受信: IMAP、`imap.forwardemail.net`、ポート993、SSL/TLS
* 送信: SMTP、`smtp.forwardemail.net`、ポート587、STARTTLS
5. **完了** をクリックします。

### Microsoft Outlook {#microsoft-outlook}

1. 転送メールダッシュボードで新しいエイリアスを作成し、パスワードを生成します。
2. **[ファイル] → [アカウントを追加]** に移動します。
3. 転送メールアドレスを入力し、[接続] をクリックします。
4. **[詳細オプション]** を選択し、[アカウントを手動で設定する] を選択します。
5. **[IMAP]** を選択し、以下を入力します。
* 受信: `imap.forwardemail.net`、ポート 993、SSL
* 送信: `smtp.forwardemail.net`、ポート 587、TLS
* ユーザー名: メールアドレス全体
* パスワード: 生成したパスワード
6. **[接続]** をクリックします。

### Appleメール {#apple-mail}

1. 転送メールダッシュボードで新しいエイリアスを作成し、パスワードを生成します。
2. **メール > 環境設定 > アカウント > +** に移動します。
3. **その他のメールアカウント** を選択します。
4. 名前、転送メールアドレス、パスワードを入力します。
5. サーバー設定として、以下を入力します。
* 受信: `imap.forwardemail.net`
* 送信: `smtp.forwardemail.net`
* ユーザー名: メールアドレス全体
* パスワード: 生成したパスワード
6. **サインイン** をクリックします。

### モバイルデバイス {#mobile-devices}

iOSの場合:

1. **設定 > メール > アカウント > アカウントを追加 > その他** に移動します。
2. **メールアカウントを追加** をタップし、詳細を入力します。
3. サーバー設定では、上記と同じIMAPとSMTPの設定を使用します。

Androidの場合:

1. **設定 > アカウント > アカウントを追加 > 個人用 (IMAP)** に移動します。
2. 転送用メールアドレスとパスワードを入力します。
3. サーバー設定では、上記と同じIMAPとSMTPの設定を使用します。

### Gmail を使用してメールを送信する方法 {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">セットアップ時間の目安:</strong>
<span>10分未満</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
はじめに:
</strong>
<span>
上記の「<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">メール転送の設定方法</a>」の手順をすでに実行している場合は、以下をお読みください。
</span>
</div>

<div id="コンテンツとしてメールを送信">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">利用規約</a>、<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>、および<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">送信SMTP制限</a>を必ずお読みください。ご利用いただいた場合、これらの条件をご理解および同意いただいたものとみなします。
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
開発者の方は、<a class="alert-link" href="/email-api#outbound-emails" target="_blank">メールAPIドキュメント</a>をご覧ください。
</span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント</a> <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> 送信SMTP設定</i> にアクセスし、設定手順に従います。

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</a> で、ドメインの新しいエイリアスを作成します (例: <code><hello@example.com></code>)

3. 新しく作成したエイリアスの横にある「<strong class="text-success"><i class="fa fa-key"></i>パスワードを生成</strong>」をクリックします。画面に表示される生成されたパスワードをクリップボードにコピーし、安全に保存してください。

4. [Gメール](https://gmail.com) に移動し、[設定 <i class="fa fa-angle-right"></i> アカウントとインポート <i class="fa fa-angle-right"></i> メールの送信方法](https://mail.google.com/mail/u/0/#settings/accounts) の下にある「別のメールアドレスを追加」をクリックします。

5. 「名前」の入力を求められた場合は、メールの「差出人」として表示する名前（例：「Linus Torvalds」）を入力します。

6. 「メールアドレス」の入力を求められた場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアスで作成したエイリアスの完全なメールアドレスを入力します（例: <code><hello@example.com></code>）

7.「エイリアスとして扱う」のチェックを外す

8. 「次のステップ」をクリックして続行します

9. 「SMTPサーバー」の入力を求められた場合は、<code>smtp.forwardemail.net</code> と入力し、ポートは <code>587</code> のままにします。

10. 「ユーザー名」の入力を求められた場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアスで作成したエイリアスの完全なメールアドレスを入力します（例: <code><hello@example.com></code>）

11. 「パスワード」の入力を求められた場合は、上記の手順3の<strong class="text-success"><i class="fa fa-key"></i>「パスワードの生成」</strong>から取得したパスワードを貼り付けます。

12.「TLSを使用したセキュリティ保護された接続」のラジオボタンをオンのままにします。

13.「アカウントを追加」をクリックして続行します

14. [Gメール](https://gmail.com) の新しいタブを開き、確認メールが届くのを待ちます（「送信者」として指定しようとしているメールアドレスの所有者であることを確認する確認コードが届きます）。

15. 届いたら、前の手順で受け取った確認コードをコピーして貼り付けます。

16. 完了したら、メールに戻り、「リクエストを確認する」リンクをクリックします。メールを正しく設定するには、この手順と前の手順の両方を実行する必要があるでしょう。

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

</div>

### Gmail を使用したメール送信の従来の無料ガイドとは何ですか {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">重要:</strong> この従来の無料ガイドは、<a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we が送信SMTPをサポートするようになった</a>ため、2023年5月をもって廃止されました。以下のガイドを使用すると、<a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this により、Gmailの送信メールに</a>「<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>」と表示されます。</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">セットアップ時間の目安:</strong>
<span>10分未満</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
はじめに:
</strong>
<span>
上記の「<a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">メール転送の設定方法</a>」の手順をすでに実行している場合は、以下をお読みください。
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Gmailでメールを送信する方法" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="レガシーフリーガイド">

1. この機能をご利用いただくには、[Gmailの2要素認証][gmail-2fa] を有効にする必要があります。有効になっていない場合は、<https://www.google.com/landing/2step/> にアクセスしてください。

2. 2要素認証が有効になったら（または既に有効になっている場合は）、<https://myaccount.google.com/apppasswords>.

3. 「アプリパスワードを生成するアプリとデバイスを選択してください」というメッセージが表示されたら、以下の操作を行います。
* 「アプリを選択」のドロップダウンで「メール」を選択します。
* 「デバイスを選択」のドロップダウンで「その他」を選択します。
* テキスト入力を求められたら、転送元のカスタムドメインのメールアドレスを入力します（例：<code><hello@example.com></code> - このサービスを複数のアカウントで使用している場合、この情報によって追跡が容易になります）。

4. 自動生成されたパスワードをクリップボードにコピーします。
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
G Suite をご利用の場合は、管理パネルの <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">アプリ > <i class="fa fa-angle-right"></i> > G Suite > <i class="fa fa-angle-right"></i> > Gmail の設定 > <i class="fa fa-angle-right"></i> > 設定</a> にアクセスし、「ユーザーが外部 SMTP サーバー経由でメールを送信できるようにする」にチェックを入れてください。この変更が有効になるまでに少し時間がかかりますので、数分お待ちください。
</span>
</div>

5. [Gメール](https://gmail.com) に移動し、[設定 <i class="fa fa-angle-right"></i> アカウントとインポート <i class="fa fa-angle-right"></i> メールの送信方法](https://mail.google.com/mail/u/0/#settings/accounts) の下にある「別のメールアドレスを追加」をクリックします。

6. 「名前」の入力を求められたら、メールの「差出人」として表示したい名前を入力します（例：「Linus Torvalds」）

7. 「メールアドレス」の入力を求められた場合は、上記で使用したカスタムドメインのメールアドレスを入力します（例：<code><hello@example.com></code>）

8.「エイリアスとして扱う」のチェックを外す

9. 「次のステップ」をクリックして続行します

10.「SMTPサーバー」の入力を求められた場合は、<code>smtp.gmail.com</code>と入力し、ポートは<code>587</code>のままにします。

11. 「ユーザー名」の入力を求められたら、Gmail アドレスの <span>gmail.com</span> 部分を除いた部分を入力します（例：メールアドレスが <span><user@gmail.com></span> の場合は「user」のみ）。
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
「ユーザー名」の部分が自動入力されている場合は、<u><strong>Gmail アドレスのユーザー名部分に変更する必要があります</strong></u>。
</span>
</div>

12. 「パスワード」の入力を求められた場合は、上記の手順2で生成したパスワードをクリップボードから貼り付けます。

13. 「TLSを使用したセキュリティ保護された接続」のラジオボタンをオンのままにします

14.「アカウントを追加」をクリックして続行します

15. [Gメール](https://gmail.com) の新しいタブを開き、確認メールが届くのを待ちます（「送信者名」として指定しようとしているメールアドレスの所有者であることを確認する確認コードが届きます）。

16. 届いたら、前の手順で受け取った確認コードをコピーして貼り付けます。

17. 完了したら、メールに戻り、「リクエストを確認する」リンクをクリックします。メールを正しく設定するには、この手順と前の手順の両方を実行する必要があるでしょう。

</div>

### Gmail の詳細なルーティング設定 {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">セットアップ時間の目安:</strong>
<span>15～30分</span>
</div>

Gmail で高度なルーティングを設定して、メールボックスと一致しないエイリアスが Forward Email のメール交換に転送されるようにするには、次の手順に従います。

1. [admin.google.com](https://admin.google.com) で Google 管理コンソールにログインします。
2. **アプリ > Google Workspace > Gmail > ルーティング** に移動します。
3. **ルートを追加** をクリックし、以下の設定を行います。

**単一受信者設定:**

* 「エンベロープの受信者を変更」を選択し、メインのGmailアドレスを入力します。
* 「元の受信者をX-Gm-Original-Toヘッダーに追加する」にチェックを入れます。

**封筒受信者パターン:**

* 存在しないすべてのメールボックスに一致するパターンを追加します（例：`.*@yourdomain.com`）

**メールサーバー設定:**

* 「ホストへのルート」を選択し、プライマリサーバーとして`mx1.forwardemail.net`を入力します。
* バックアップサーバーとして`mx2.forwardemail.net`を追加します。
* ポートを25に設定します。
* セキュリティのため、「TLSを要求する」を選択します。

4. **保存**をクリックしてルートを作成します

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
この設定は、カスタムドメインの Google Workspace アカウントでのみ有効です。通常の Gmail アカウントでは有効ではありません。
</span>
</div>

### Outlook ルーティングの詳細構成 {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">セットアップ時間の目安:</strong>
<span>15～30分</span>
</div>

メールボックスと一致しないエイリアスが Forward Email のメール交換に転送されるように、高度なルーティングを設定する Microsoft 365 (旧 Office 365) ユーザーの場合:

1. [admin.microsoft.com](https://admin.microsoft.com) で Microsoft 365 管理センターにログインします。
2. **[Exchange] → [メールフロー] → [ルール]** に移動します。
3. **[ルールの追加]** をクリックし、**[新しいルールの作成]** を選択します。
4. ルールに名前を付けます（例：「存在しないメールボックスを転送メールに転送する」）。
5. **[このルールを適用する条件]** で、以下を選択します。
* 「受信者のアドレスが次の値に一致する場合」
* ドメイン内のすべてのアドレスに一致するパターンを入力します（例：`*@yourdomain.com`）。
6. **[次の処理を実行する]** で、以下を選択します。
* 「メッセージを次のメールサーバーにリダイレクトする」
* 「次のメールサーバー」を選択します。
* `mx1.forwardemail.net` とポート 25 を入力します。
* `mx2.forwardemail.net` をバックアップサーバーとして追加します。
7. **[次の場合を除く]** で、以下を選択します。
* 「受信者が次の値である場合」
* 転送しない既存のメールボックスをすべて追加します。転送済み
8. 他のメールフロールールよりも後に実行されるようにルールの優先度を設定します
9. **[保存]** をクリックしてルールを有効にします

## トラブルシューティング {#troubleshooting}

### テストメールが届かないのはなぜですか？ {#why-am-i-not-receiving-my-test-emails}

自分自身にテストメールを送信する場合、同じ「Message-ID」ヘッダーがあるため、受信トレイに表示されないことがあります。

これは広く知られている問題であり、Gmail などのサービスにも影響します。<a href="https://support.google.com/a/answer/1703601">Here は、この問題に関する Gmail の公式回答です</a>。

問題が解決しない場合は、DNS の伝播に問題がある可能性が高いです。少し待ってからもう一度お試しください（または、<strong class="notranslate">TXT</strong> レコードの TTL 値を下げてみてください）。

**まだ問題が解決しない場合は？** 問題を調査して迅速に解決策を見つけられるよう、<a href="/help">お問い合わせ</a>ください。

### メールクライアントをメール転送機能と連携させるにはどうすればいいですか？{#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
当社のサービスは、以下の一般的なメールクライアントに対応しています。
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
ユーザー名はエイリアスのメールアドレス、パスワードは<strong class="text-success"><i class="fa fa-key"></i>「パスワードの生成」</strong>（「通常のパスワード」）です。
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>Thunderbird をご利用の場合は、「接続セキュリティ」が「SSL/TLS」に設定され、「認証方法」が「通常のパスワード」に設定されていることを確認してください。</span>
</div>

| タイプ | ホスト名 | プロトコル | ポート |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **推奨** | `993` と `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **推奨** または TLS (STARTTLS) | SSL/TLS の場合は `465` と `2465` (または) TLS (STARTTLS) の場合は `587`、`2587`、`2525`、および `25` |

### メールがスパムや迷惑メールに分類されるのはなぜですか？また、ドメインの評判を確認するにはどうすればいいですか？{#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

このセクションでは、送信メールが弊社の SMTP サーバー (例: `smtp.forwardemail.net`) を使用していて (または `mx1.forwardemail.net` または `mx2.forwardemail.net` 経由で転送されていて)、受信者のスパム フォルダーまたは迷惑メール フォルダーに配信されている場合について説明します。

当社では、[IPアドレス](#what-are-your-servers-ip-addresses) を [すべての信頼できるDNS拒否リスト](#how-do-you-handle-your-ip-addresses-becoming-blocked) に対して定期的に監視しているため、**したがって、これはドメイン レピュテーション固有の問題である可能性が高いです**。

メールがスパム フォルダーに振り分けられる理由はいくつかあります。

1. **認証がありません**: [SPF](#how-do-i-set-up-spf-for-forward-email)、[DKIM](#how-do-i-set-up-dkim-for-forward-email)、および [DMARC](#how-do-i-set-up-dmarc-for-forward-email) レコードを設定します。

2. **ドメインの評判**: 新しいドメインは、送信履歴が確立されるまでは中立的な評判を持つことがよくあります。

3. **コンテンツ トリガー**: 特定の単語やフレーズがスパム フィルターをトリガーする可能性があります。

4. **送信パターン**: メールの量が突然増加すると、疑わしいと思われる場合があります。

ドメインの評判と分類を確認するには、次のツールを 1 つ以上使用してみてください。

| ツール名 | URL | タイプ |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflareドメイン分類フィードバック | <https://radar.cloudflare.com/domains/feedback> | 分類 |
| Spamhaus IPおよびドメイン評判チェッカー | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IPおよびドメインレピュテーションセンター | <https://talosintelligence.com/reputation_center> | 評判 |
| Barracuda IPおよびドメインレピュテーション検索 | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MXツールボックスのブラックリストチェック | <https://mxtoolbox.com/blacklists.aspx> | ブラックリスト |
| Google ポストマスターツール | <https://www.gmail.com/postmaster/> | 評判 |
| Yahoo 送信ハブ | <https://senders.yahooinc.com/> | 評判 |
| MultiRBL.valli.org ブラックリストチェック | <https://multirbl.valli.org/lookup/> | DNSBL |
| 送信者スコア | <https://senderscore.org/act/blocklist-remover/> | 評判 |
| 価値減額 | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/ProofpointのIP削除 | <https://ipcheck.proofpoint.com/> | 除去 |
| Cloudmark IPの削除 | <https://csi.cloudmark.com/en/reset/> | 除去 |
| スパムコップ | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlook と Office 365 の IP 削除 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | 除去 |
| UCEPROTECTのレベル1、2、3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECT の backscatterer.org | <https://www.backscatterer.org/> | 後方散乱保護 |
| UCEPROTECTのwhitelisted.org | <https://www.whitelisted.org/> (有料) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | 除去 |
| AOL/Verizon（例：`[IPTS04]`） | <https://senders.yahooinc.com/> | 除去 |
| コックス・コミュニケーションズ | `unblock.request@cox.net` | 除去 |
| t-online.de (ドイツ語/T-Mobile) | `tobr@rx.t-online.de` | 除去 |

> \[!TIP]
> 少量の高品質なメールから始めて、良好な評判を築いてから、大量に送信するようにしましょう。

> \[!IMPORTANT]
> ドメインがブラックリストに登録されている場合、ブラックリストごとに削除手順が異なります。手順については、各ブラックリストのウェブサイトをご確認ください。

> \[!TIP]
> 追加のサポートが必要な場合、または特定のメールサービスプロバイダによって当社のメールがスパムとして誤検知されていることが判明した場合は、<a href="/help">お問い合わせ</a>ください。

### スパムメールを受信した場合はどうすればよいですか？ {#what-should-i-do-if-i-receive-spam-emails}

可能であれば、メールリストから登録を解除し、送信者をブロックする必要があります。

メッセージをスパムとして報告せず、手動でキュレーションされプライバシーに重点を置いた不正使用防止システムに転送してください。

**スパムを転送するメールアドレスは次のとおりです:** <abuse@forwardemail.net>

### Gmailで自分宛に送信したテストメールが「疑わしい」と表示されるのはなぜですか？{#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

自分自身にテストを送信したとき、またはエイリアスを使用してメールを送信した相手が初めてあなたからのメールを見たときに Gmail でこのエラー メッセージが表示されても、**心配しないでください**。これは Gmail に組み込まれている安全機能です。

「安全に見える」をクリックするだけです。例えば、「送信者名」機能を使ってテストメッセージを（他の人に）送信した場合、相手にはこのメッセージは表示されません。

しかし、もしこのメッセージが表示される場合、それは通常、メールが<john@customdomain.com>ではなく<john@gmail.com>から送信されることに慣れているためです（これは単なる例です）。Gmailは、万が一の事態に備えて安全を確保するためにユーザーに警告を発しており、回避策はありません。

### Gmail の via forwardemail dot net を削除できますか？ {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

このトピックは [Gmailで広く知られている問題で、送信者の名前の横に追加情報が表示される](https://support.google.com/mail/answer/1311182) に関連しています。

2023 年 5 月現在、すべての有料ユーザー向けに SMTP を使用したメール送信をアドオンとしてサポートしています。つまり、Gmail で <span class="notranslate">via forwardemail dot net</span> を削除できます。

この FAQ トピックは、[Gmailでメールを送信する方法](#how-to-send-mail-as-using-gmail) 機能を使用するユーザー向けであることに注意してください。

設定手順については、[SMTPによるメール送信をサポートしていますか](#do-you-support-sending-email-with-smtp) のセクションを参照してください。

## データ管理 {#data-management}

### サーバーの所在地はどこですか？ {#where-are-your-servers-located}

> \[!TIP]
> [forwardemail.eu](https://forwardemail.eu) でホストされている EU データセンターの所在地については、近日中に発表する予定です。最新情報については、<https://github.com/orgs/forwardemail/discussions/336> のディスカッションにご登録ください。

当社のサーバーは主にコロラド州デンバーにあります。IP アドレスの完全なリストについては、<https://forwardemail.net/ips> をご覧ください。

当社のサブプロセッサーについては、[GDPR](/gdpr)、[DPA](/dpa)、および [プライバシー](/privacy) ページでご確認いただけます。

### メールボックスをエクスポートしてバックアップするにはどうすればよいですか？ {#how-do-i-export-and-backup-my-mailbox}

いつでも、メールボックスを [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)、[Mボックス](https://en.wikipedia.org/wiki/Mbox)、または暗号化された [SQLite](https://en.wikipedia.org/wiki/SQLite) 形式でエクスポートできます。

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> エイリアス <i class="fa fa-angle-right"></i> バックアップのダウンロード</i> に移動し、希望するエクスポート形式のタイプを選択します。

エクスポートが完了すると、ダウンロードするためのリンクが電子メールで送信されます。

セキュリティ上の理由により、このエクスポート ダウンロード リンクは 4 時間後に期限切れになることに注意してください。

エクスポートされた EML または Mbox 形式を検査する必要がある場合は、次のオープン ソース ツールが役立つ場合があります。

| 名前 | 形式 | プラットフォーム | GitHubのURL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBoxビューア | Mボックス | ウィンドウズ | <https://github.com/eneam/mboxviewer> |
| mboxウェブビューアー | Mボックス | すべてのプラットフォーム | <https://github.com/PHMRanger/mbox-web-viewer> |
| Emlリーダー | EML | ウィンドウズ | <https://github.com/ayamadori/EmlReader> |
| メールビューア | EML | VSコード | <https://github.com/joelharkes/vscode_email_viewer> |
| emlリーダー | EML | すべてのプラットフォーム | <https://github.com/s0ph1e/eml-reader> |

さらに、MboxファイルをEMLファイルに変換する必要がある場合は、<https://github.com/noelmartinon/mboxzilla>.

### 既存のメールボックスをインポートして移行するにはどうすればよいですか？ {#how-do-i-import-and-migrate-my-existing-mailbox}

以下の手順に従って、メールを Forward Email に簡単にインポートできます (例: [サンダーバード](https://www.thunderbird.net) を使用)。

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
既存のメールをインポートするには、以下の手順をすべて実行する必要があります。
</span>
</div>

1. 既存のメールプロバイダーからメールをエクスポートします。

| メールプロバイダー | エクスポート形式 | 輸出手順 |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gメール | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| 見通し | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">ヒント:</strong> <span>Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST エクスポート形式</a>) を使用している場合は、以下の「その他」の手順に従ってください。ただし、オペレーティングシステムに基づいてPSTをMBOX / EML形式に変換するためのリンクを以下に提供しています：<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba for Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst for Windows cygwin</a> – (例：<code>readpst -u -o $OUT_DIR $IN_DIR</code> を <code>$OUT_DIR</code> と置き換え、 <code>$IN_DIR</code> をそれぞれ出力ディレクトリと入力ディレクトリのパスに置き換えます。</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">Ubuntu/Linux 用の readpst</a> – (例: <code>sudo apt-get install readpst</code> を実行した後、<code>readpst -u -o $OUT_DIR $IN_DIR</code> を実行します。<code>$OUT_DIR</code> と <code>$IN_DIR</code> をそれぞれ出力ディレクトリと入力ディレクトリのパスに置き換えます。)</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">macOS 用の readpst (brew 経由)</a> – (例: <code>brew install libpst</code> を実行した後、<code>readpst -u -o $OUT_DIR $IN_DIR</code> を使用します (<code>$OUT_DIR</code> と <code>$IN_DIR</code> をそれぞれ出力ディレクトリと入力ディレクトリのパスに置き換えます)。</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter for Windows (GitHub)</a></li></ul><br /></span></div> |
| アップルメール | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| ファストメール | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-すべてのデータをダウンロード#downloadmail> |
| プロトンメール | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| ツタノタ | EML | <https://github.com/crepererum-oss/tatutanatata> |
| 考える | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| ゾーホー | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| 他の | [Use Thunderbird](https://www.thunderbird.net) | Thunderbirdで既存のメールアカウントを設定し、[ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/)プラグインを使用してメールのエクスポートとインポートを行います。**アカウント間でメールをコピー＆ペーストまたはドラッグ＆ドロップするだけでも可能になる場合があります。** |

2. [サンダーバード](https://www.thunderbird.net) をダウンロードしてインストールし、開きます。

3. エイリアスの完全なメールアドレス（例：<code><you@yourdomain.com></code>）と生成されたパスワードを使用して、新しいアカウントを作成します。<strong>まだパスワードを生成していない場合は、<a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">セットアップ手順を参照してください</a></strong>。

4. [インポートエクスポートツール](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird プラグインをダウンロードしてインストールします。

5. Thunderbird で新しいローカル フォルダーを作成し、それを右クリックして、`ImportExportTools NG` オプションを選択し、`Import mbox file` (MBOX エクスポート形式の場合) または `Import messages` / `Import all messages from a directory` (EML エクスポート形式の場合) を選択します。

6. ローカルフォルダから、Thunderbird の新規（または既存の）IMAP フォルダにドラッグ＆ドロップして、弊社の IMAP ストレージにメッセージをアップロードします。これにより、メッセージが SQLite 暗号化ストレージにオンラインでバックアップされます。

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>
Thunderbirdへのインポート方法がわからない場合は、<a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a>" および <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>." の公式手順を参照してください。
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
エクスポートとインポートのプロセスが完了したら、既存のメールアカウントで転送を有効にし、新しいメールアドレスが作成されたことを送信者に通知する自動返信を設定することをお勧めします（例：以前はGmailを使用していて、現在はカスタムドメイン名のメールを使用している場合）。
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

### セルフホスティングをサポートしていますか？{#do-you-support-self-hosting}

はい、2025年3月よりセルフホストオプションをサポートします。ブログ[ここ](https://forwardemail.net/blog/docs/self-hosted-solution)をお読みください。[セルフホストガイド](https://forwardemail.net/self-hosted)で開始方法をご確認ください。より詳細なステップバイステップのガイドにご興味をお持ちの方は、[ウブントゥ](https://forwardemail.net/guides/selfhosted-on-ubuntu)または[デビアン](https://forwardemail.net/guides/selfhosted-on-debian)ベースのガイドをご覧ください。

## メール設定 {#email-configuration}

### メール転送を開始して設定するにはどうすればよいですか？ {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">セットアップ時間の目安:</strong>
<span>10分未満</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
はじめに:
</strong>
<span>
以下の手順1～8をよく読んで、実行してください。<code>user@gmail.com</code> のメールアドレスは、メールを転送したいメールアドレスに置き換えてください（正しくない場合は）。同様に、<code>example.com</code> のメールアドレスは、カスタムドメイン名に置き換えてください（正しくない場合は）。
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">ドメイン名を既にどこかに登録している場合は、この手順を完全にスキップして手順2に進んでください。そうでない場合は、<a href="/domain-registration" rel="noopener noreferrer">こちらをクリックしてドメイン名を登録</a>してください。</li>
<li class="mb-2 mb-md-3 mb-lg-5">
ドメインをどこで登録したか覚えていますか？思い出したら、以下の手順に従ってください。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
新しいタブを開いて、ドメインレジストラにサインインしてください。下の「レジストラ」をクリックするだけで、自動的にサインインできます。この新しいタブで、レジストラのDNS管理ページに移動してください。設定手順については、下の「設定手順」欄に手順ごとの説明があります。新しいタブでこのページに移動したら、このタブに戻って以下の手順3に進んでください。
<strong class="font-weight-bold">開いているタブはまだ閉じないでください。後の手順で必要になります。</strong>
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
<td>ログイン <i class="fa fa-angle-right"></i> ドメインセンター <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> DNS設定の編集</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon ルート53</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> ホストゾーン <i class="fa fa-angle-right"></i> (ドメインを選択)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> マイサーバー <i class="fa fa-angle-right"></i> ドメイン管理 <i class="fa fa-angle-right"></i> DNSマネージャー</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ROCK向け: ログイン <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i>（管理するには横の▼アイコンをクリックしてください）<i class="fa fa-angle-right"></i> DNS
<br />
レガシーの場合：ログイン <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> ゾーンエディター <i class="fa fa-angle-right"></i>（ドメインを選択してください）</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (ドメインを選択)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> 管理</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> ネットワーク <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> その他 <i class="fa fa-angle-right"></i> ドメインの管理</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> カード表示で、ドメインの「管理」をクリック <i class="fa fa-angle-right"></i> リスト表示で、歯車アイコンをクリック <i class="fa fa-angle-right"></i> DNSとネームサーバー <i class="fa fa-angle-right"></i> DNSレコード</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> 視聴</a>
</td>
<td>ログイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> (歯車アイコンをクリック) <i class="fa fa-angle-right"></i> 左側のメニューで「DNSとネームサーバー」をクリック</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>ログイン <i class="fa fa-angle-right"></i> パネル <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> ドメイン管理 <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>ログイン <i class="fa fa-angle-right"></i> 概要 <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> シンプルエディター <i class="fa fa-angle-right"></i> レコード</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>ログイン <i class="fa fa-angle-right"></i> (ドメインを選択してください) <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> ゾーンの編集</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> 視聴</a>
</td>
<td>ログイン <i class="fa fa-angle-right"></i> ドメインの管理 <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> DNSの管理</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 ドメイン</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> 視聴</a>
</td>
<td>ログイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> DNSを設定</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> 視聴</a>
</td>
<td>ログイン <i class="fa fa-angle-right"></i> ドメインリスト <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> 高度なDNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>ログイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> Netlify DNSの設定</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 ソリューション</a></td>
<td>ログイン <i class="fa fa-angle-right"></i> アカウントマネージャー <i class="fa fa-angle-right"></i> ドメイン名 <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> 管理 <i class="fa fa-angle-right"></i> ドメインの参照先を変更 <i class="fa fa-angle-right"></i> 高度なDNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> 視聴</a>
</td>
<td>ログイン <i class="fa fa-angle-right"></i> 管理対象ドメイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> DNS設定</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>ログイン <i class="fa fa-angle-right"></i> ホームメニュー <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i>
詳細設定 <i class="fa fa-angle-right"></i> カスタムレコード</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Now</a></td>
<td>「now」CLI を使用する場合 <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>ログイン <i class="fa fa-angle-right"></i> ドメインページ <i class="fa fa-angle-right"></i> (ドメインを選択) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>ログイン <i class="fa fa-angle-right"></i> ドメインページ <i class="fa fa-angle-right"></i> (<i class="fa fa-ellipsis-h"></i> アイコンをクリック) <i class="fa fa-angle-right"></i> 「DNSレコードの管理」を選択</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>ログイン <i class="fa fa-angle-right"></i> ドメイン <i class="fa fa-angle-right"></i> マイドメイン</td>
</tr>
<tr>
<td>その他</td>
<td>
<div class="alert mb-0アラート警告"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">重要:</strong> ここにレジストラ名が表示されていない場合は、インターネットで「$REGISTRAR の DNS レコードを変更する方法」と検索してください（$REGISTRAR をレジストラ名に置き換えてください。例：GoDaddy をご利用の場合は「GoDaddy の DNS レコードを変更する方法」）。</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">レジストラの DNS 管理ページ（開いている別のタブ）で、以下の「MX」レコードを設定してください。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
他のMXレコードは設定しないでください。以下の2つのレコードは必ず存在する必要があります。タイプミスがないこと、またmx1とmx2の両方のスペルが正しいことを確認してください。既にMXレコードが存在する場合は、完全に削除してください。
「TTL」値は3600である必要はありません。必要に応じて、より低い値または高い値にすることができます。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>優先度</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">レジストラの DNS 管理ページ (開いている別のタブ) を使用して、次の <strong class="notranslate">TXT</strong> レコードを設定します。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
有料プランをご利用の場合は、この手順を完全にスキップして手順5に進んでください。有料プランをご利用でない場合は、転送先のアドレスが一般公開され、検索可能になります。<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a>にアクセスし、ご希望に応じてドメインを有料プランにアップグレードしてください。有料プランの詳細については、<a rel="noopener noreferrer" href="/private-business-email" class="alert-link">料金</a>ページをご覧ください。それ以外の場合は、以下のオプション A からオプション F までの中から 1 つ以上の組み合わせを引き続き選択できます。
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
オプション A:
</strong>
<span>
ドメイン（例: 「all@example.com」、「hello@example.com」など）からのすべてのメールを特定のアドレス「user@gmail.com」に転送する場合:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
上記の「値」列の値は、必ずご自身のメールアドレスに置き換えてください。「TTL」値は3600である必要はなく、必要に応じてより低い値または高い値にすることができます。TTL（Time to Live：生存時間）値を低くすると、DNSレコードに加えられた将来の変更がインターネット全体に迅速に反映されます。これは、メモリ内にキャッシュされる期間（秒単位）と考えてください。TTLの詳細については、<a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">Wikipedia の TTL について</a>をご覧ください。
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
オプション B:
</strong>
<span>
メールアドレスを1つだけ転送する場合（例: <code>hello@example.com</code> を <code>user@gmail.com</code> に転送します。これにより、「hello+test@example.com」も「user+test@gmail.com」に自動的に転送されます）:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
複数のメールを転送する場合は、カンマで区切ってください。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
転送メールは無制限に設定できます。ただし、1行に255文字以上を記述しないこと、および各行の先頭に「forward-email=」を記述することに注意してください。以下に例を示します。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>「@」、「.」、または空白</em></td>
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
<strong class="notranslate">TXT</strong> レコードにドメイン名を指定して、グローバルエイリアス転送を設定することもできます（例: 「user@example.com」は「user@example.net」に転送されます）。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
Webhook を、メール転送先のグローバルまたは個別のエイリアスとして使用することもできます。Webhook の例と詳細については、以下の「<a href="#do-you-support-webhooks" class="alert-link">Webhook をサポートしていますか</a>」セクションをご覧ください。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
エイリアスのマッチングやメール転送先の置換処理には、正規表現（regex）を使用することもできます。regex の例と、以下の「<a href="#do-you-support-regular-expressions-or-regex" class="alert-link">正規表現または regex をサポートしていますか？</a>」セクションをご覧ください。
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>置換機能を備えた高度な正規表現が必要ですか？</strong> 下記の「<a href="#do-you-support-regular-expressions-or-regex" class="alert-link">正規表現またはregexをサポートしていますか？</a>」というタイトルのregexの例とセクション全体をご覧ください。
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>簡単な例:</strong> `linus@example.com` または `torvalds@example.com` に送信されるすべてのメールを `user@gmail.com` に転送する場合:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
キャッチオール転送ルールは「フォールスルー」とも呼ばれます。
これは、キャッチオールではなく、少なくとも1つの特定の転送ルールに一致する受信メールが使用されることを意味します。
特定のルールには、メールアドレスと正規表現が含まれます。
<br /><br />
例:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
この設定では、<code>hello@example.com</code> に送信されたメールは <code>second@gmail.com</code> (キャッチオール) に転送されず、<code>first@gmail.com</code> にのみ配信されます。
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">レジストラの DNS 管理ページ (開いている別のタブ) を使用して、次の <strong class="notranslate">TXT</strong> レコードを追加で設定します。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
Gmail（例: 送信者名）または G Suite をご利用の場合は、上記の値に <code>include:_spf.google.com</code> を追加する必要があります。例:
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
「v=spf1」を含む同様の行が既に存在する場合は、同じ行内の既存の「include:host.com」レコードの直前、および「-all」の前に <code>include:spf.forwardemail.net</code> を追加する必要があります。例:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
「-all」と「~all」には違いがあることに注意してください。「-」は一致しない場合にSPFチェックがFAILになることを示し、「~」はSPFチェックがSOFTFAILになることを示します。ドメイン偽造を防ぐため、「-all」を使用することをお勧めします。
<br /><br />
メールの送信元ホスト（Outlook など）の SPF レコードも含める必要がある場合があります。
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">「マイ アカウント」>「ドメイン」>「セットアップ」にある「レコードの確認」ツールを使用して、DNS レコードを確認してください。<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">「<i class="fa fa-angle-right"></i>」>「ドメイン」</a><i class="fa fa-angle-right"></i>

</li><li class="mb-2 mb-md-3 mb-lg-5">テストメールを送信して、動作を確認してください。DNSレコードが反映されるまでには時間がかかる場合がありますのでご注意ください。

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>
</span>
テストメールが届かない場合、または「このメッセージにはご注意ください」という内容のテストメールが届いた場合は、それぞれ「<a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">テストメールが届かないのはなぜですか？</a>」と「<a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Gmailで自分宛に送信したテストメールが「不審」と表示されるのはなぜですか？</a>」の回答をご覧ください。
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Gmail から「名前を付けてメールを送信」する場合は、<strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">こちらの動画を視聴</a></strong>するか、以下の <a href="#how-to-send-mail-as-using-gmail">How to Send Mail As Using Gmail</a> の手順に従う必要があります。

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>
オプションのアドオンは以下にリストされています。これらのアドオンは完全にオプションであり、必ずしも必要ではない場合があります。必要に応じて、追加情報を提供することを目的としています。
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
オプションのアドオン:
</strong>
<span>
<a class="alert-link" href="#how-to-send-mail-as-using-gmail">How to Send Mail As (Gmail で別名送信)</a> 機能をご利用の場合は、許可リストにご自身を追加することをお勧めします。このトピックについては、<a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail のこちらの手順</a>をご覧ください。
</span>
</div>

### 高度な転送のために複数のMX交換とサーバーを使用できますか？{#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

はい、ただし、**DNS レコードにリストされる MX 交換は 1 つだけにする必要があります**。

複数の MX 交換を構成する方法として「Priority」を使用しないでください。

代わりに、既存の MX エクスチェンジを設定して、一致しないすべてのエイリアスのメールを当社のサービスのエクスチェンジ (`mx1.forwardemail.net` および/または `mx2.forwardemail.net`) に転送する必要があります。

Google Workspace をご利用で、一致しないすべてのエイリアスを 我々 のサービスに転送する場合は、<https://support.google.com/a/answer/6297084>.

Microsoft 365 (Outlook) を使用しており、一致しないすべてのエイリアスを当社のサービスに転送する場合は、<https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> と <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>. を参照してください。

### 不在通知（不在時自動返信）を設定するにはどうすればいいですか？{#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイ アカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス にアクセスし、不在時の自動返信を設定するエイリアスを作成または編集します。

開始日、終了日、件名、メッセージを設定し、いつでも有効または無効にすることができます。

* 現在、プレーンテキストの件名と本文がサポートされています（HTML を削除するため、内部で `striptags` パッケージを使用しています）。
* 件名は 100 文字までに制限されています。
* 本文は 1000 文字までに制限されています。
* セットアップには送信 SMTP 設定が必要です（例：DKIM、DMARC、Return-Path DNS レコードの設定）。
* <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> 設定 > <i class="fa fa-angle-right"></i> 送信 SMTP 設定 にアクセスし、セットアップ手順に従ってください。
* 不在通知機能は、グローバルバニティドメイン名では有効にできません（例：[使い捨てアドレス](/disposable-addresses) はサポートされていません）。
* ワイルドカード/キャッチオール (`*`) または正規表現を含むエイリアスでは、不在応答を有効にできません。

`postfix` などのメール システム (例: `sieve` 不在通知フィルター拡張機能を使用するシステム) とは異なり、Forward Email は DKIM 署名を自動的に追加し、不在通知の送信時に接続の問題 (一般的な SSL/TLS 接続の問題や旧来の保守サーバーによるものなど) を防いでおり、さらに不在通知の Open WKD および PGP 暗号化もサポートしています。

<!--
* 不正使用を防ぐため、不在通知メッセージを送信するたびに、送信SMTPクレジットが1クレジット差し引かれます。
* 有料アカウントには、デフォルトで1日あたり300クレジットが含まれています。より多くのクレジットが必要な場合は、お問い合わせください。
-->

1. [許可リストに登録](#do-you-have-an-allowlist) 送信者ごとに 4 日ごとに 1 回のみ送信します (Gmail の動作と同様です)。

* Redisキャッシュでは、`alias_id`と`sender`のフィンガープリントを使用しています。`alias_id`はMongoDBのエイリアスID、`sender`はFromアドレス（許可リストに登録されている場合）またはFromアドレスのルートドメイン（許可リストに登録されていない場合）です。簡略化のため、キャッシュ内のこのフィンガープリントの有効期限は4日間に設定されています。

* 許可リストに登録されていない送信者の [送信元] アドレスで解析されたルート ドメインを使用するという当社のアプローチにより、比較的未知の送信者 (悪意のある人物など) による不在通知メッセージの大量送信を防止します。

2. MAIL FROM および/または From が空白でなく、[ポストマスターのユーザー名](#what-are-postmaster-addresses) (電子メールの @ の前の部分) が含まれていない (大文字と小文字は区別されません) 場合にのみ送信されます。

3. 元のメッセージに次のいずれかのヘッダー（大文字と小文字は区別されません）が含まれている場合は送信しません。

* `auto-submitted` のヘッダーの値が `no` と等しくありません。
* `x-auto-response-suppress` のヘッダー（値が `dr`、`autoreply`、`auto-reply`、`auto_reply`、または `all`）
* `list-id`、`list-subscribe`、`no`0、`no`1、`no`2、`no`3、`no`4、`no`5、`no`6、または `no`7 のヘッダー（値に関係なく）。
* `no`8 のヘッダー。値は `no`9、`x-auto-response-suppress`0、`x-auto-response-suppress`1、`x-auto-response-suppress`2、または `x-auto-response-suppress`3 です。

4. MAIL FROM または From のメール アドレスが `+donotreply`、`-donotreply`、`+noreply`、または `-noreply` で終わる場合は送信されません。

5. 送信元メールアドレスのユーザー名部分が `mdaemon` で、大文字と小文字を区別しないヘッダーが `X-MDDSN-Message` の場合は送信されません。

6. `multipart/report` に大文字と小文字を区別しない `content-type` ヘッダーがあった場合は送信しません。

### 転送メールにSPFを設定するにはどうすればいいですか？ {#how-do-i-set-up-spf-for-forward-email}

レジストラの DNS 管理ページを使用して、次の <strong class="notranslate">TXT</strong> レコードを設定します。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
Gmail（例: 送信者名）または G Suite をご利用の場合は、上記の値に <code>include:_spf.google.com</code> を追加する必要があります。例:
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
Microsoft Outlook または Live.com をご利用の場合は、SPF <strong class="notranslate">TXT</strong> レコードに <code>include:spf.protection.outlook.com</code> を追加する必要があります。例:
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
「v=spf1」を含む同様の行が既に存在する場合は、同じ行内の既存の「include:host.com」レコードの直前、および「-all」の前に <code>include:spf.forwardemail.net</code> を追加する必要があります。例:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
「-all」と「~all」には違いがあることに注意してください。「-」は一致しない場合にSPFチェックがFAILになることを示し、「~」はSPFチェックがSOFTFAILになることを示します。ドメイン偽造を防ぐため、「-all」を使用することをお勧めします。
<br /><br />
メールの送信元ホスト（Outlook など）の SPF レコードも含める必要がある場合があります。
</span>
</div>

### 転送メールにDKIMを設定するにはどうすればいいですか？ {#how-do-i-set-up-dkim-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイ アカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> 設定 > <i class="fa fa-angle-right"></i> 送信 SMTP 構成 に移動して、セットアップ手順に従います。

### 転送メールにDMARCを設定するにはどうすればいいですか？ {#how-do-i-set-up-dmarc-for-forward-email}

<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイ アカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> 設定 > <i class="fa fa-angle-right"></i> 送信 SMTP 構成 に移動して、セットアップ手順に従います。

### 連絡先を接続して設定するにはどうすればよいですか？ {#how-do-i-connect-and-configure-my-contacts}

**連絡先を設定するには、次のCardDAV URLを使用します:** `https://carddav.forwardemail.net` (またはクライアントが許可する場合は単に`carddav.forwardemail.net`)

### カレンダーを接続して設定するにはどうすればよいですか？ {#how-do-i-connect-and-configure-my-calendars}

**カレンダーを設定するには、次のCalDAV URLを使用します:** `https://caldav.forwardemail.net` (またはクライアントが許可している場合は`caldav.forwardemail.net`)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="メール転送カレンダー CalDAV Thunderbird の設定例" />

### カレンダーを追加したり、既存のカレンダーを管理するにはどうすればよいですか？ {#how-do-i-add-more-calendars-and-manage-existing-calendars}

追加のカレンダーを追加する場合は、新しいカレンダー URL `https://caldav.forwardemail.net/dav/principals/calendar-name` を追加します (**`calendar-name` を希望のカレンダー名に置き換えてください**)

カレンダーを作成後に名前と色を変更できます。お好みのカレンダー アプリケーション (例: Apple Mail または [サンダーバード](https://thunderbird.net)) を使用してください。

### メール転送用の SRS を設定するにはどうすればいいですか {#how-do-i-set-up-srs-for-forward-email}

[送信者書き換えスキーム](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") は自動的に構成されるため、自分で構成する必要はありません。

### 転送メール用のMTA-STSを設定するにはどうすればいいですか？ {#how-do-i-set-up-mta-sts-for-forward-email}

詳細については、[MTA-STSのセクション](#do-you-support-mta-sts) を参照してください。

### メールアドレスにプロフィール写真を追加するにはどうすればいいですか？ {#how-do-i-add-a-profile-picture-to-my-email-address}

Gmail を使用している場合は、次の手順に従ってください。

1. <https://google.com> にアクセスし、すべてのメールアカウントからログアウトします。
2. 「ログイン」をクリックし、プルダウンから「他のアカウント」をクリックします。
3. 「別のアカウントを使用する」を選択します。
4. 「アカウントを作成」を選択します。
5. 「代わりに現在のメールアドレスを使用する」を選択します。
6. カスタムドメイン名のメールアドレスを入力します。
7. メールアドレスに送信された確認メールを取得します。
8. このメールに記載されている確認コードを入力します。
9. 新しい Google アカウントのプロフィール情報を入力します。
10. プライバシーと利用規約のすべてのポリシーに同意します。
11. <https://google.com> にアクセスし、右上にあるプロフィールアイコンをクリックして、「変更」ボタンをクリックします。
12. アカウントの新しい写真またはアバターをアップロードします。
13. 変更が反映されるまで約 1～2 時間かかりますが、すぐに反映される場合もあります。
14. テストメールを送信すると、プロフィール写真が表示されます。

## 高度な機能 {#advanced-features}

### マーケティング関連のメール配信のためのニュースレターやメーリングリストをサポートしていますか？{#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

はい、詳しくは<https://forwardemail.net/guides/newsletter-with-listmonk>.をご覧ください。

IPレピュテーションを維持し、配信率を確保するため、Forward Emailでは**ニュースレター承認**においてドメインごとに手動による審査プロセスを設けています。承認をご希望の場合は、<support@forwardemail.net>までメールを送信いただくか、[ヘルプリクエスト](https://forwardemail.net/help)を開いてください。通常、このプロセスは24時間以内に完了し、ほとんどのリクエストは1～2時間以内に承認されます。近い将来、スパム対策とアラート機能を強化し、このプロセスを即時化することを目指しています。このプロセスにより、メールが受信トレイに確実に届き、スパムとしてマークされることがなくなります。

### APIを使用したメール送信をサポートしていますか？{#do-you-support-sending-email-with-api}

はい、2023 年 5 月現在、すべての有料ユーザー向けに API を使用したメール送信をアドオンとしてサポートしています。

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">利用規約</a>、<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>、および<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">送信SMTP制限</a>を必ずお読みください。ご利用いただいた場合、これらの条件をご理解および同意いただいたものとみなします。
</span>
</div>

オプション、例、および詳細については、API ドキュメントの [メール](/email-api#outbound-emails) のセクションをご覧ください。

弊社の API を使用して送信メールを送信するには、[私のセキュリティ](/my-account/security) で使用可能な API トークンを使用する必要があります。

### IMAP でのメール受信をサポートしていますか？ {#do-you-support-receiving-email-with-imap}

はい、2023年10月16日より、すべての有料ユーザー様向けのアドオンとしてIMAP経由のメール受信をサポートします。**[暗号化されたSQLiteメールボックスストレージ機能の仕組み](/blog/docs/best-quantum-safe-encrypted-email-service)に関する詳細記事をお読みください**。

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">利用規約</a>と<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>を必ずお読みください。ご利用いただいた場合、これらの規約をご理解および同意いただいたものとみなします。
</span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</a> で、ドメインの新しいエイリアスを作成します (例: <code><hello@example.com></code>)

2. 新しく作成したエイリアスの横にある「<strong class="text-success"><i class="fa fa-key"></i>パスワードを生成</strong>」をクリックします。画面に表示される生成されたパスワードをクリップボードにコピーし、安全に保存してください。

3. お好みのメールアプリケーションを使用して、新しく作成したエイリアス（例：<code><hello@example.com></code>）でアカウントを追加または設定します。
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>、または<a href="/blog/open-source" class="alert-link" target="_blank">オープンソースでプライバシー重視の代替手段</a>。</span>
</div>

4. IMAPサーバー名の入力を求められた場合は、`imap.forwardemail.net`と入力します。

5. IMAPサーバーのポート番号を求められたら、`993` (SSL/TLS) を入力してください。必要に応じて[代替IMAPポート](/faq#what-are-your-imap-server-configuration-settings) も参照してください。
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>Thunderbirdをご利用の場合は、「接続セキュリティ」が「SSL/TLS」に設定され、「認証方法」が「通常のパスワード」に設定されていることを確認してください。</span>
</div>

6. IMAPサーバーのパスワードを求められた場合は、上記の手順2の<strong class="text-success"><i class="fa fa-key"></i>「パスワードの生成」</strong>から取得したパスワードを貼り付けます。

7. **設定を保存** – 問題が発生した場合は、<a href="/help">お問い合わせください</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

</div>

### POP3をサポートしていますか？ {#do-you-support-pop3}

はい、2023年12月4日より、すべての有料ユーザー向けに[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)をアドオンとしてサポートいたします。[暗号化されたSQLiteメールボックスストレージ機能の仕組み](/blog/docs/best-quantum-safe-encrypted-email-service)については、**詳しくはこちらの記事をご覧ください**。

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">利用規約</a>と<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>を必ずお読みください。ご利用いただいた場合、これらの規約をご理解および同意いただいたものとみなします。
</span>
</div>

1. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</a> で、ドメインの新しいエイリアスを作成します (例: <code><hello@example.com></code>)

2. 新しく作成したエイリアスの横にある「<strong class="text-success"><i class="fa fa-key"></i>パスワードを生成</strong>」をクリックします。画面に表示される生成されたパスワードをクリップボードにコピーし、安全に保存してください。

3. お好みのメールアプリケーションを使用して、新しく作成したエイリアス（例：<code><hello@example.com></code>）でアカウントを追加または設定します。
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>、または<a href="/blog/open-source" class="alert-link" target="_blank">オープンソースでプライバシー重視の代替手段</a>。</span>
</div>

4. POP3サーバー名の入力を求められた場合は、`pop3.forwardemail.net`と入力します。

5. POP3サーバーのポート番号を求められたら、`995` (SSL/TLS) を入力してください。必要に応じて[代替POP3ポート](/faq#what-are-your-pop3-server-configuration-settings) も参照してください。
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>Thunderbirdをご利用の場合は、「接続セキュリティ」が「SSL/TLS」に設定され、「認証方法」が「通常のパスワード」に設定されていることを確認してください。</span>
</div>

6. POP3サーバーのパスワードを求められた場合は、上記の手順2の<strong class="text-success"><i class="fa fa-key"></i>「パスワードの生成」</strong>から取得したパスワードを貼り付けます。

7. **設定を保存** – 問題が発生した場合は、<a href="/help">お問い合わせください</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

</div>

### カレンダー（CalDAV）をサポートしていますか？ {#do-you-support-calendars-caldav}

はい、2024年2月5日よりこの機能を追加しました。サーバーは`caldav.forwardemail.net`で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

IPv4 と IPv6 の両方をサポートし、ポート `443` (HTTPS) 経由で利用できます。

| ログイン | 例 | 説明 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> のドメインに存在するエイリアスのメール アドレス。 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。 |

カレンダー サポートを使用するには、**ユーザー** は <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> にあるドメインに存在するエイリアスのメール アドレスである必要があります。また、**パスワード** はエイリアス固有の生成されたパスワードである必要があります。

### 連絡先（CardDAV）をサポートしていますか？{#do-you-support-contacts-carddav}

はい、2025年6月12日よりこの機能を追加しました。サーバーは`carddav.forwardemail.net`で、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータスページ</a>でも監視されています。

IPv4 と IPv6 の両方をサポートし、ポート `443` (HTTPS) 経由で利用できます。

| ログイン | 例 | 説明 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> のドメインに存在するエイリアスのメール アドレス。 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。 |

連絡先サポートを使用するには、**ユーザー** は <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> にあるドメインのエイリアスのメール アドレスである必要があります。また、**パスワード** はエイリアス固有の生成されたパスワードである必要があります。

### SMTP によるメール送信をサポートしていますか？ {#do-you-support-sending-email-with-smtp}

はい、2023 年 5 月現在、すべての有料ユーザー向けに SMTP を使用したメール送信をアドオンとしてサポートしています。

<div id="smtp-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
<a href="/terms" class="alert-link" target="_blank">利用規約</a>、<a href="/privacy" class="alert-link" target="_blank">プライバシーポリシー</a>、および<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">送信SMTP制限</a>を必ずお読みください。ご利用いただいた場合、これらの条件をご理解および同意いただいたものとみなします。
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
Gmailをご利用の場合は、<a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Gmailでメールを送信するガイド</a>をご覧ください。開発者の方は、<a class="alert-link" href="/email-api#outbound-emails" target="_blank">メールAPIドキュメント</a>をご覧ください。
</span>
</div>

1. <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">マイアカウント</a> <i class="fa fa-angle-right"></i> ドメイン</a> <i class="fa fa-angle-right"></i> 設定 <i class="fa fa-angle-right"></i> 送信SMTP設定</i> にアクセスし、設定手順に従います。

2. <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス</a> で、ドメインの新しいエイリアスを作成します (例: <code><hello@example.com></code>)

3. 新しく作成したエイリアスの横にある「<strong class="text-success"><i class="fa fa-key"></i>パスワードを生成</strong>」をクリックします。画面に表示される生成されたパスワードをクリップボードにコピーし、安全に保存してください。

4. お好みのメールアプリケーションを使用して、新しく作成したエイリアス（例：<code><hello@example.com></code>）でアカウントを追加または設定します。
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span><a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>、<a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>、<a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>、または<a href="/blog/open-source" class="alert-link" target="_blank">オープンソースでプライバシー重視の代替手段</a>。</span>
</div>

5. SMTPサーバー名の入力を求められた場合は、`smtp.forwardemail.net`と入力します。

6. SMTPサーバーのポート番号を求められたら、`465` (SSL/TLS) を入力してください。必要に応じて[代替SMTPポート](/faq#what-are-your-smtp-server-configuration-settings) を参照してください。
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>Thunderbirdをご利用の場合は、「接続セキュリティ」が「SSL/TLS」に設定され、「認証方法」が「通常のパスワード」に設定されていることを確認してください。</span>
</div>

7. SMTPサーバーのパスワードを求められた場合は、上記の手順3の<strong class="text-success"><i class="fa fa-key"></i>パスワードの生成</strong>から取得したパスワードを貼り付けます。

8. **設定を保存し、最初のテストメールを送信します** – 問題が発生した場合は、<a href="/help">お問い合わせください</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
IPレピュテーションを維持し、配信率を確保するため、送信SMTP承認についてはドメインごとに手動によるレビュープロセスを実施しています。このプロセスは通常24時間以内に完了し、ほとんどのリクエストは1～2時間以内に承認されます。近い将来、スパム対策とアラート機能を強化し、このプロセスを即時化することを目指しています。このプロセスにより、メールが受信トレイに届き、スパムとしてマークされることがなくなります。
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

</div>

### OpenPGP/MIME、エンドツーエンド暗号化（「E2EE」）、Webキーディレクトリ（「WKD」）をサポートしていますか？{#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

はい、[オープンPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP)、[エンドツーエンド暗号化（「E2EE」）](https://en.wikipedia.org/wiki/End-to-end_encryption)、および[Web キー ディレクトリ ("WKD")](https://wiki.gnupg.org/WKD)を使用した公開鍵の検出をサポートしています。[keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service)または[独自のキーを自己ホストする](https://wiki.gnupg.org/WKDHosting)を使用してOpenPGPを設定できます（[WKDサーバーのセットアップに関するこのgist](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)を参照）。

* WKDルックアップは、メール配信をタイムリーに行うため1時間キャッシュされます。そのため、WKDキーを追加、変更、または削除した場合は、`support@forwardemail.net`までメールアドレスをお知らせください。キャッシュを手動で消去いたします。
* WKDルックアップ経由、またはインターフェースにアップロードされたPGPキーを使用して転送されるメッセージは、PGP暗号化に対応しています。
* PGPチェックボックスがオンになっている限り、アップロードされたキーが優先されます。
* Webhookに送信されるメッセージは現在PGPで暗号化されていません。
* 特定の転送先アドレス（正規表現、ワイルドカード、完全一致など）に一致するエイリアスが複数あり、そのうち複数にアップロードされたPGPキーが含まれ、PGPチェック済みの場合、エラーアラートメールが送信され、アップロードされたPGPキーによるメッセージの暗号化は行われません。これは非常にまれなケースであり、通常は複雑なエイリアスルールを持つ上級ユーザーにのみ適用されます。
* **送信者がDMARCポリシーで拒否を設定している場合、MXサーバー経由のメール転送にはPGP暗号化は適用されません。すべてのメールでPGP暗号化が必要な場合は、IMAPサービスをご利用いただき、受信メール用のエイリアスにPGPキーを設定することをお勧めします。**

**Web キー ディレクトリの設定は、<https://wkd.chimbosonic.com/> (オープン ソース) または <https://www.webkeydirectory.com/> (独自仕様) で検証できます。**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
自動暗号化：
</strong>
<span><a href="#do-you-support-sending-email-with-smtp" class="alert-link">送信SMTPサービス</a>をご利用で、暗号化されていないメッセージを送信されている場合、<a class="alert-link" href="https://wiki.gnupg.org/WKD">Web 鍵ディレクトリ（"WKD")</a>を使用して、受信者ごとに自動的にメッセージの暗号化を試みます。</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
カスタムドメイン名で OpenPGP を有効にするには、以下の手順をすべて実行する必要があります。
</span>
</div>

1. 以下のメール クライアントの推奨プラグインをダウンロードしてインストールします。

| メールクライアント | プラットフォーム | 推奨プラグイン | 注記 |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| サンダーバード | デスクトップ | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird には OpenPGP のサポートが組み込まれています。 |
| Gメール | ブラウザ | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) (独自のライセンス) | Gmail は OpenPGP をサポートしていませんが、オープンソース プラグイン [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) をダウンロードできます。 |
| アップルメール | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail は OpenPGP をサポートしていませんが、オープンソースプラグイン [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) をダウンロードできます。 |
| アップルメール | iOS | [PGPro](https://github.com/opensourceios/PGPro/) または [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (独自のライセンス) | Apple Mail は OpenPGP をサポートしていませんが、オープンソースプラグイン [PGPro](https://github.com/opensourceios/PGPro/) または [FlowCrypt](https://flowcrypt.com/download) をダウンロードできます。 |
| 見通し | ウィンドウズ | [gpg4win](https://www.gpg4win.de/index.html) | Outlook のデスクトップ メール クライアントは OpenPGP をサポートしていませんが、オープン ソース プラグイン [gpg4win](https://www.gpg4win.de/index.html) をダウンロードできます。 |
| 見通し | ブラウザ | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) (独自のライセンス) | Outlook の Web ベースのメール クライアントは OpenPGP をサポートしていませんが、オープン ソース プラグイン [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) をダウンロードできます。 |
| アンドロイド | 携帯 | [OpenKeychain](https://www.openkeychain.org/) または [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) は、[Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) や [FairEmail](https://github.com/M66B/FairEmail) など、どちらもオープンソースプラグイン [OpenKeychain](https://www.openkeychain.org/) をサポートしています。代わりに、オープンソース（独自ライセンス）プラグイン [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) を使用することもできます。 |
| グーグルクローム | ブラウザ | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) (独自のライセンス) | オープンソースのブラウザ拡張機能 [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) をダウンロードできます。 |
| モジラファイアフォックス | ブラウザ | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) (独自のライセンス) | オープンソースのブラウザ拡張機能 [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) をダウンロードできます。 |
| マイクロソフトエッジ | ブラウザ | [Mailvelope](https://mailvelope.com/) | オープンソースのブラウザ拡張機能 [Mailvelope](https://mailvelope.com/) をダウンロードできます。 |
| 勇敢な | ブラウザ | [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) (独自のライセンス) | オープンソースのブラウザ拡張機能 [Mailvelope](https://mailvelope.com/) または [FlowCrypt](https://flowcrypt.com/download) をダウンロードできます。 |
| バルサ | デスクトップ | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa には OpenPGP のサポートが組み込まれています。 |
| Kメール | デスクトップ | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail には OpenPGP のサポートが組み込まれています。 |
| GNOMEの進化 | デスクトップ | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution には OpenPGP のサポートが組み込まれています。 |
| ターミナル | デスクトップ | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | オープンソースの [gpg command line tool](https://www.gnupg.org/download/) を使用して、コマンドラインから新しいキーを生成できます。 |

2. プラグインを開き、公開鍵を作成し、それを使用するようにメールクライアントを設定します。

3. 公開鍵を<https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>今後、キーを管理するには、<a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>" にアクセスしてください。</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
オプションのアドオン:
</strong>
<span>
<a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">暗号化ストレージ (IMAP/POP3)</a> サービスをご利用で、（既に暗号化されている）SQLite データベースに保存されている<i>すべての</i>メールを公開鍵で暗号化したい場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス (例: <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> OpenPGP を編集し、公開鍵をアップロードします。
</span>
</div>

4. ドメイン名に新しい `CNAME` レコードを追加します (例: `example.com`)。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
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
<span>エイリアスで<a class="alert-link" href="/disposable-addresses" target="_blank">バニティドメイン/使い捨てドメイン</a>（例: <code>hideaddress.net</code>）を使用している場合は、この手順をスキップできます。</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
おめでとうございます！
</strong>
<span>
すべての手順を完了しました。
</span>
</div>
</div>

### MTA-STSをサポートしていますか？{#do-you-support-mta-sts}

はい、2023年3月2日より[MTA-STS](https://www.hardenize.com/blog/mta-sts)をサポートしています。ドメインで[このテンプレート](https://github.com/jpawlowski/mta-sts.template)を有効にする場合は、そちらをご利用ください。

設定はGitHubの<https://github.com/forwardemail/mta-sts.forwardemail.net>.>で公開されています。

### パスキーとWebAuthnをサポートしていますか？{#do-you-support-passkeys-and-webauthn}

はい！2023 年 12 月 13 日より、パスキー [需要が高いため](https://github.com/orgs/forwardemail/discussions/182) のサポートが追加されました。

パスキーを使用すると、パスワードや 2 要素認証を必要とせずに安全にログインできます。

タッチ、顔認識、デバイスベースのパスワード、または PIN を使用して本人確認を行うことができます。

一度に最大 30 個のパスキーを管理できるため、すべてのデバイスで簡単にログインできます。

パスキーの詳細については、次のリンクを参照してください。

* [パスキーを使用してアプリケーションやウェブサイトにサインインする](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [iPhoneでパスキーを使用してアプリやウェブサイトにサインインする](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Passkeysに関するWikipediaの記事](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### メールのベストプラクティスをサポートしていますか？{#do-you-support-email-best-practices}

はい。すべてのプランでSPF、DKIM、DMARC、ARC、SRSのサポートを標準で提供しています。また、これらの仕様の原著者や他のメール専門家と緊密に連携し、完璧さと高い配信率を実現しています。

### バウンスWebhookをサポートしていますか？{#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
メールのWebhookに関するドキュメントをお探しですか？詳しくは、「<a href="/faq#do-you-support-webhooks" class="alert-link">Webhookをサポートしていますか？</a>」をご覧ください。
<span>
</span>
</div>

はい、2024年8月14日よりこの機能を追加しました。「マイアカウント」→「ドメイン」→「設定」→「バウンスWebhook URL」にアクセスし、送信SMTPメールがバウンスした際に`POST`リクエストを送信する`http://`または`https://`のURLを設定できるようになりました。

これは、送信 SMTP を管理および監視するのに役立ち、サブスクライバーの管理、オプトアウト、バウンスの発生の検出にも使用できます。

バウンス Webhook ペイロードは、次のプロパティを持つ JSON として送信されます。

* `email_id` (文字列) - 「マイアカウント」→「メール（送信SMTP）」内のメールに対応するメールID
* `list_id` (文字列) - 元の送信メールの`List-ID`ヘッダー（大文字と小文字を区別しない）の値（存在する場合）
* `list_unsubscribe` (文字列) - 元の送信メールの`List-Unsubscribe`ヘッダー（大文字と小文字を区別しない）の値（存在する場合）
* `feedback_id` (文字列) - 元の送信メールの`Feedback-ID`ヘッダー（大文字と小文字を区別しない）の値（存在する場合）
* `recipient` (文字列) - バウンスまたはエラーとなった受信者のメールアドレス
* `message` (文字列) - バウンスに関する詳細なエラーメッセージ
* `response` (文字列) - SMTP 応答メッセージ
* `list_id`0 (数値) - 解析された SMTP 応答コード
* `list_id`1 (文字列) - 応答コードが信頼できるソースからのものである場合、この値にはルートドメイン名が設定されます (例: `list_id`2 または `list_id`3)
* `list_id`4 (オブジェクト) - バウンスおよび拒否ステータスの詳細を示す以下のプロパティを含むオブジェクト
* `list_id`5 (文字列) - バウンスアクション (例: `list_id`6)
* `list_id`7 (文字列) - バウンス理由 (例: `list_id`8)
* `list_id`9 (文字列) - バウンスカテゴリ (例: `List-ID`0)
* `List-ID`1 (数値) - バウンスステータスコード (例: `List-ID`2)
* `List-ID`3 (文字列) - 応答メッセージのバウンスコード (例: `List-ID`4)
* `List-ID`5 (数値) - 解析された行番号 (存在する場合)、`List-ID`6 (例: `List-ID`7)
* `List-ID`8 (オブジェクト) - 送信メールのヘッダーのキーと値のペア
* `List-ID`9 (文字列) - バウンスエラーが発生した日付 (`list_unsubscribe`0 形式)

例えば：

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

バウンス Webhook に関する追加の注意事項をいくつか示します。

* Webhook ペイロードに `list_id`、`list_unsubscribe`、または `feedback_id` の値が含まれている場合は、必要に応じて `recipient` をリストから削除する適切な措置を講じてください。
* `bounce.category` の値が `"block"`、`"recipient"`、`"spam"`、または `"virus"` のいずれかだった場合は、必ずユーザーをリストから削除してください。
* Webhook ペイロードを検証する必要がある場合（実際に当社のサーバーから送信されていることを確認するため）、[逆引きを使用してリモートクライアントのIPアドレスとクライアントのホスト名を解決する](https://nodejs.org/api/dns.html#dnspromisesreverseip) を使用できます。これは `list_unsubscribe`0 である必要があります。
* IP アドレスを `list_unsubscribe`1 と照合することもできます。
* Webhook キーを取得するには、「マイアカウント」→「ドメイン」→「設定」→「Webhook 署名ペイロード検証キー」に移動してください。
* セキュリティ上の理由から、このキーはいつでもローテーションできます。
* Webhook リクエストの `list_unsubscribe`2 の値と、このキーを使用して計算された本文の値を計算し、比較します。実行方法の例は、`list_unsubscribe`3 で確認できます。
* 詳細については、<`list_unsubscribe`4 の説明をご覧ください。
* Webhook エンドポイントが `list_unsubscribe`6 ステータスコードで応答するまで、最大 `list_unsubscribe`5 秒間待機し、最大 `list_unsubscribe`7 回再試行します。
* バウンス Webhook URL にリクエストを送信中にエラーが検出された場合は、週に 1 回、確認メールを送信します。

### Webhookをサポートしていますか？{#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
バウンスWebhookに関するドキュメントをお探しですか？詳しくは、「<a href="/faq#do-you-support-bounce-webhooks" class="alert-link">バウンスWebhookはサポートされていますか？</a>」をご覧ください。
<span>
</span>
</div>

はい、2020年5月15日よりこの機能を追加しました。他の受信者と同じように、Webhookを追加するだけで大丈夫です。WebhookのURLには必ず「http」または「https」プロトコルを先頭に付けてください。

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
強化されたプライバシー保護：
</strong>
<span>
有料プラン（強化されたプライバシー保護機能付き）をご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> > ドメイン</a>にアクセスし、ドメインの横にある「エイリアス」をクリックしてWebhookを設定してください。有料プランの詳細については、<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">料金</a>ページをご覧ください。それ以外の場合は、以下の手順に従ってください。
</span>
</div>

無料プランをご利用の場合は、以下に示すように、新しい DNS <strong class="notranslate">TXT</strong> レコードを追加するだけです。

たとえば、`alias@example.com` に送信されるすべてのメールを新しい [リクエストビン](https://requestbin.com/r/en8pfhdgcculn?inspect) テスト エンドポイントに転送する場合は、次のようにします。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

あるいは、`example.com` に送信されるすべてのメールをこのエンドポイントに転送したい場合もあります。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Webhook に関する追加の注意事項は次のとおりです:**

* Webhook ペイロードを検証する必要がある場合（実際に弊社サーバーから送信されていることを確認するため）、[逆引きを使用してリモートクライアントのIPアドレスとクライアントのホスト名を解決する](https://nodejs.org/api/dns.html#dnspromisesreverseip) を使用できます。これは、`mx1.forwardemail.net` または `mx2.forwardemail.net` のいずれかである必要があります。
* IP アドレスを [公開されているIPアドレス](#what-are-your-servers-ip-addresses) と比較することもできます。
* 有料プランをご利用の場合は、「マイアカウント」→「ドメイン」→「設定」→「Webhook 署名ペイロード検証キー」にアクセスして、Webhook キーを取得してください。
* セキュリティ上の理由から、このキーはいつでもローテーションできます。
* Webhook リクエストの `X-Webhook-Signature` の値を計算し、このキーを使用して計算されたボディの値と比較します。この方法の例は、[このStack Overflowの投稿](https://stackoverflow.com/a/68885281) で確認できます。
* 詳細については、<https://github.com/forwardemail/free-email-forwarding/issues/235>> の説明をご覧ください。
* Webhook が `200` ステータスコードで応答しない場合、その応答は [エラーログが作成されました](#do-you-store-error-logs) に保存されます。これはデバッグに便利です。
* Webhook の HTTP リクエストは、SMTP 接続試行ごとに最大 3 回再試行されます。エンドポイントの POST リクエストごとに最大 60 秒のタイムアウトがあります。**これは 3 回だけ再試行されるという意味ではありません**。実際には、3 回目の HTTP POST リクエスト試行が失敗した後に、SMTP コード 421（送信者に後で再試行するように指示する）を送信することで、継続的に再試行されます。つまり、メールはステータスコード 200 に達するまで数日間継続的に再試行されます。
* [スーパーエージェントの再試行方法](https://ladjs.github.io/superagent/#retrying-requests) で使用されるデフォルトのステータスコードとエラーコードに基づいて、自動的に再試行されます（私たちはメンテナーです）。
* リソースを節約し、応答時間を短縮するため、同じエンドポイントへの Webhook HTTP リクエストを複数回ではなく 1 つのリクエストにまとめます。例えば、<webhook1@example.com>、<webhook2@example.com>、<webhook3@example.com> にメールを送信し、これら全てが*完全に*同じエンドポイント URL にアクセスするように設定されている場合、リクエストは 1 つだけ送信されます。エンドポイントの完全一致と厳密な等価性に基づいてグループ化されます。
* メッセージを JSON 対応オブジェクトに解析するために、`mx1.forwardemail.net`0 ライブラリの "simpleParser" メソッドを使用していることに注意してください。
* 生のメールの文字列値は、プロパティ "raw" として返されます。
* 認証結果は、プロパティ "dkim"、"spf"、"arc"、"dmarc"、"bimi" として返されます。
* 解析されたメールヘッダーはプロパティ "headers" として返されます。ただし、反復処理と解析を容易にするために "headerLines" を使用することもできます。
* この Webhook のグループ化された受信者は、まとめてプロパティ "recipients" として返されます。
* SMTPセッション情報はプロパティ「session」として提供されます。これには、メッセージの送信者、メッセージの到着時刻、HELO、クライアントホスト名に関する情報が含まれます。クライアントホスト名の`mx1.forwardemail.net`1は、FQDN（逆PTR検索による）または`mx1.forwardemail.net`2を括弧で囲んだ値（例：`mx1.forwardemail.net`3）のいずれかです。
* `mx1.forwardemail.net`4の値を素早く取得したい場合は、`mx1.forwardemail.net`5の値を使用できます（以下の例を参照）。ヘッダー`mx1.forwardemail.net`6は、メッセージの元の受信者（マスク転送前）とのデバッグ用にメッセージに追加されるヘッダーです。
* ペイロード本体から `mx1.forwardemail.net`7 および/または `mx1.forwardemail.net`8 プロパティを削除する必要がある場合は、Webhook エンドポイントにクエリ文字列パラメータ（例: `mx2.forwardemail.net`2）として `mx1.forwardemail.net`9、`mx2.forwardemail.net`0、または `mx2.forwardemail.net`1 を追加するだけです。
* 添付ファイルがある場合は、バッファ値とともに `mx2.forwardemail.net`3 配列に追加されます。これらの添付ファイルは、JavaScript を使用して次のように解析することで、コンテンツに戻すことができます。

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
ヒント:
</strong>
転送されたメールからのWebhookリクエストがどのように表示されるか知りたいですか？ 以下に例を示します。
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

### 正規表現またはregexをサポートしていますか？{#do-you-support-regular-expressions-or-regex}

はい、2021年9月27日よりこの機能を追加しました。エイリアスのマッチングや置換には、正規表現（regex）を記述するだけで済みます。

正規表現でサポートされているエイリアスは、`/` で始まり、`/` で終わり、受信者がメールアドレスまたはWebhookであるものです。受信者には、正規表現の置換サポートを含めることもできます（例：`$1`、`$2`）。

`i`と`g`の2つの正規表現フラグをサポートしています。`i`の大文字と小文字を区別しないフラグは永続的なデフォルトであり、常に適用されます。`g`のグローバルフラグは、末尾の`/`に`/g`を追加することで追加できます。

なお、正規表現サポートにより、受信者部分の<a href="#can-i-disable-specific-aliases">disabled エイリアス機能</a>もサポートされていることに注意してください。

正規表現は、<a href="/disposable-addresses" target="_blank">グローバルバニティドメイン</a>ではサポートされていません (セキュリティ上の脆弱性となる可能性があるため)。

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
強化されたプライバシー保護：
</strong>
<span>
有料プラン（強化されたプライバシー保護機能付き）をご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> > ドメイン</a>にアクセスし、ドメインの横にある「エイリアス」をクリックして正規表現を設定してください。有料プランの詳細については、<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">料金</a>ページをご覧ください。それ以外の場合は、以下の手順に従ってください。
</span>
</div>

無料プランをご利用の場合は、以下に示す 1 つ以上の例を使用して、新しい DNS <strong class="notranslate">TXT</strong> レコードを追加するだけです。

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>簡単な例:</strong> `linus@example.com` または `torvalds@example.com` に送信されるすべてのメールを `user@gmail.com` に転送する場合:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>名と姓の置換例:</strong> 会社のメールアドレスがすべて`firstname.lastname@example.com`というパターンだとします。`firstname.lastname@example.com`というパターンに該当するすべてのメールを、置換機能を使って`firstname.lastname@company.com`に転送したいとします（<a href="https://regexr.com/66hnu" class="alert-link">正規表現のテストを見る</a>）:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>プラス記号フィルタリングの置換例:</strong> `info@example.com` または `support@example.com` に送信されるすべてのメールを、それぞれ `user+info@gmail.com` または `user+support@gmail.com` に転送する場合（置換サポートあり）(<a href="https://regexr.com/66ho7" class="alert-link">正規表現のテストを表示</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Webhook クエリ文字列置換の例:</strong> `example.com` に送信されるすべてのメールを <a href="#do-you-support-webhooks" class="alert-link">Webhook</a> に送信し、動的クエリ文字列キー「to」とメールアドレスのユーザー名部分を値として設定したいとします (<a href="https://regexr.com/66ho4" class="alert-link">RegExr のテストを表示</a>)。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>サイレント拒否の例:</strong> 特定のパターンに一致するすべてのメールを無効にし、ステータスコード `250` でサイレント拒否（送信者にはメッセージが正常に送信されたように見えますが、実際にはどこにも送信されません）したい場合は（<a href="#can-i-disable-specific-aliases" class="alert-link">特定のエイリアスを無効にすることはできますか</a>を参照）、同じ方法で感嘆符「!」を 1 つ追加します。これにより、送信者にはメッセージは正常に配信されましたが、実際にはどこにも送信されなかったことが示されます（例: blackhole または `/dev/null`）。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
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
<strong>ソフトリジェクトの例:</strong> 特定のパターンに一致するすべてのメールを無効にし、ステータスコード `421` でソフトリジェクトしたい場合（<a href="#can-i-disable-specific-aliases" class="alert-link">特定のエイリアスを無効にすることはできますか</a>を参照）、同じ方法で二重の感嘆符「!!」を使用します。これは送信者にメールの再試行を指示し、このエイリアス宛のメールは約5日間再試行された後、完全に拒否されます。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
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
<strong>ハードリジェクトの例:</strong> 特定のパターンに一致するすべてのメールを無効にし、ステータスコード `550` でハードリジェクトしたい場合（<a href="#can-i-disable-specific-aliases" class="alert-link">特定のエイリアスを無効にすることはできますか</a>を参照）、同じ方法で感嘆符「!!!」を3つ付けます。これにより、送信者に永続的なエラーが発生し、メールは再試行されず、このエイリアスで拒否されます。
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
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
正規表現の書き方を知りたい、または置換結果をテストしたい場合は、無料の正規表現テストウェブサイト <a href="https://regexr.com" class="alert-link">RegExr</a>（<a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.）をご覧ください。
<span>
</span>
</div>

### 送信SMTP制限は何ですか？ {#what-are-your-outbound-smtp-limits}

ユーザーとドメインのSMTP送信メッセージ数は、1日あたり300通に制限されています。これは、暦月で平均9,000通以上のメール送信に相当します。この制限を超える必要がある場合、または継続的に大容量のメールを受信する場合は、[お問い合わせ](https://forwardemail.net/help)をご利用ください。

### SMTPを有効にするには承認が必要ですか？{#do-i-need-approval-to-enable-smtp}

はい。IPレピュテーションを維持し、配信率を確保するため、Forward Emailでは送信SMTP承認においてドメインごとに手動レビュープロセスを実施しています。承認をご希望の場合は、<support@forwardemail.net>までメールを送信いただくか、[ヘルプリクエスト](https://forwardemail.net/help)を開いてください。通常、このプロセスは24時間以内に完了し、ほとんどのリクエストは1～2時間以内に承認されます。近い将来、スパム対策とアラート機能を強化し、このプロセスを即時化することを目指しています。このプロセスにより、メールが受信トレイに確実に届き、スパムとしてマークされることがなくなります。

### SMTPサーバーの構成設定は何ですか？ {#what-are-your-smtp-server-configuration-settings}

当社のサーバーは `smtp.forwardemail.net` であり、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータス ページ</a>でも監視されています。

IPv4 と IPv6 の両方をサポートし、SSL/TLS の場合はポート `465` および `2465`、TLS (STARTTLS) の場合はポート `587`、`2587`、`2525`、および `25` で利用できます。

| プロトコル | ホスト名 | ポート | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **推奨** | `smtp.forwardemail.net` | `465`, `2465` | :白いチェックマーク: | :白いチェックマーク: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :白いチェックマーク: | :白いチェックマーク: |

| ログイン | 例 | 説明 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> のドメインに存在するエイリアスのメール アドレス。 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。 |

SMTP を使用して送信メールを送信するには、**SMTP ユーザー** が <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> にあるドメインのエイリアスのメール アドレスである必要があり、**SMTP パスワード** がエイリアス固有の生成されたパスワードである必要があります。

詳細な手順については、[SMTPによるメール送信をサポートしていますか](#do-you-support-sending-email-with-smtp) を参照してください。

### IMAPサーバーの構成設定は何ですか？ {#what-are-your-imap-server-configuration-settings}

当社のサーバーは `imap.forwardemail.net` であり、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータス ページ</a>でも監視されています。

IPv4 と IPv6 の両方をサポートし、SSL/TLS のポート `993` および `2993` 経由で利用できます。

| プロトコル | ホスト名 | ポート | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **推奨** | `imap.forwardemail.net` | `993`, `2993` | :白いチェックマーク: | :白いチェックマーク: |

| ログイン | 例 | 説明 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> のドメインに存在するエイリアスのメール アドレス。 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。 |

IMAP で接続するには、**IMAP ユーザー** は <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> にあるドメインのエイリアスのメール アドレスである必要があります。また、**IMAP パスワード** はエイリアス固有の生成されたパスワードである必要があります。

詳細な手順については、[IMAPでメールを受信できますか？](#do-you-support-receiving-email-with-imap) を参照してください。

### POP3サーバーの構成設定は何ですか？ {#what-are-your-pop3-server-configuration-settings}

当社のサーバーは `pop3.forwardemail.net` であり、<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">ステータス ページ</a>でも監視されています。

IPv4 と IPv6 の両方をサポートし、SSL/TLS のポート `995` および `2995` 経由で利用できます。

| プロトコル | ホスト名 | ポート | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **推奨** | `pop3.forwardemail.net` | `995`, `2995` | :白いチェックマーク: | :白いチェックマーク: |

| ログイン | 例 | 説明 |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー名 | `user@example.com` | <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> のドメインに存在するエイリアスのメール アドレス。 |
| パスワード | `************************` | エイリアス固有の生成されたパスワード。 |

POP3 で接続するには、**POP3 ユーザー** は <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">マイ アカウント <i class="fa fa-angle-right"></i> ドメイン</a> にあるドメインのエイリアスのメール アドレスである必要があります。また、**IMAP パスワード** はエイリアス固有の生成されたパスワードである必要があります。

詳細な手順については、[POP3をサポートしていますか](#do-you-support-pop3) を参照してください。

### Postfix SMTPリレー設定 {#postfix-smtp-relay-configuration}

Postfix を設定して、Forward Email の SMTP サーバーを経由してメールを中継することができます。これは、メールを送信する必要があるサーバーアプリケーションに便利です。

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">セットアップ時間の目安:</strong>
<span>15分未満</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
SMTPアクセスが有効になっている有料プランが必要です。
</span>
</div>

#### インストール {#installation}

1. サーバーにPostfixをインストールします。

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. インストール中に、構成の種類を尋ねられたら、「インターネット サイト」を選択します。

#### 構成 {#configuration}

1. メインのPostfix設定ファイルを編集します。

```bash
sudo nano /etc/postfix/main.cf
```

2. 次の設定を追加または変更します。

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. SASLパスワードファイルを作成します。

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. 転送メールの資格情報を追加します。

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. パスワードファイルを保護してハッシュします。

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Postfixを再起動します。

```bash
sudo systemctl restart postfix
```

#### テスト {#testing}

テストメールを送信して設定をテストします。

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## セキュリティ {#security}

### 高度なサーバー強化テクニック {#advanced-server-hardening-techniques}

> \[!TIP]
> 当社のセキュリティインフラストラクチャの詳細については、[セキュリティページ](/security) をご覧ください。

Forward Email では、インフラストラクチャとデータのセキュリティを確保するために、さまざまなサーバー強化技術を実装しています。

1. **ネットワークセキュリティ**:
* 厳格なルールを備えたIPテーブルファイアウォール
* ブルートフォース攻撃対策のためのFail2Ban
* 定期的なセキュリティ監査と侵入テスト
* VPNのみによる管理アクセス

2. **システム強化**:
* 最小限のパッケージインストール
* 定期的なセキュリティアップデート
* SELinux を強制モードにする
* root SSH アクセスを無効化する
* キーベースの認証のみを使用する

3. **アプリケーションセキュリティ**:
* コンテンツセキュリティポリシー (CSP) ヘッダー
* HTTPS Strict Transport Security (HSTS)
* XSS 保護ヘッダー
* フレームオプションとリファラーポリシーヘッダー
* 定期的な依存関係監査

4. **データ保護**:
* LUKSによるフルディスク暗号化
* 安全なキー管理
* 暗号化による定期的なバックアップ
* データ最小化の実践

5. **監視と対応**:
* リアルタイム侵入検知
* 自動セキュリティスキャン
* 集中ログ記録と分析
* インシデント対応手順

> \[!IMPORTANT]
> 当社のセキュリティ対策は、新たな脅威や脆弱性に対処するため、継続的に更新されています。

> \[!TIP]
> セキュリティを最大限に高めるには、OpenPGP によるエンドツーエンドの暗号化をご利用いただくことをお勧めします。

### SOC 2またはISO 27001認証を取得していますか？{#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email は、業界標準への準拠を確保するために、認定サブプロセッサーが提供するインフラストラクチャ上で動作します。

Forward EmailはSOC 2 Type IIまたはISO 27001認証を直接取得していません。ただし、このサービスは認定されたサブプロセッサーが提供するインフラストラクチャ上で運用されています。

* **DigitalOcean**: SOC 2 Type IIおよびSOC 3 Type II認証（Schellman & Company LLCによる監査済み）、複数のデータセンターでISO 27001認証を取得。詳細: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) 認定、ISO/IEC 認証: 20000-1:2018、27001:2022、27017:2015、27018:2019。詳細: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2準拠（認証取得についてはDataPacketに直接お問い合わせください）、エンタープライズグレードのインフラストラクチャプロバイダー（デンバー拠点）。詳細: <https://www.datapacket.com/datacenters/denver>

Forward Emailは、セキュリティ監査に関する業界のベストプラクティスに従い、独立したセキュリティ研究者と定期的に連携しています。出典: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### メール転送にTLS暗号化を使用していますか？ {#do-you-use-tls-encryption-for-email-forwarding}

はい。Forward Emailは、すべての接続（HTTPS、SMTP、IMAP、POP3）にTLS 1.2以上を厳格に適用し、拡張TLSサポートのためにMTA-STSを実装しています。実装内容は次のとおりです。

* すべてのメール接続にTLS 1.2以上を適用
* ECDHE（Elliptic Curve Diffie-Hellman Ephemeral）鍵交換による完全前方秘匿性（PFS）
* 最新の暗号スイートと定期的なセキュリティアップデート
* HTTP/2サポートによるパフォーマンスとセキュリティの向上
* 主要ブラウザにプリロード済みのHSTS（HTTP Strict Transport Security）
* **MTA-STS（Mail Transfer Agent Strict Transport Security）**による厳格なTLS適用

ソース: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS実装**: Forward Emailは、コードベースに厳格なMTA-STS適用を実装しています。TLSエラーが発生し、MTA-STSが適用されている場合、システムは421 SMTPステータスコードを返します。これにより、メールが安全に配信されないまま後で再試行されることがなくなります。実装の詳細：

* TLSエラー検出: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* メール送信ヘルパーにおけるMTA-STSの適用: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

サードパーティの検証: <https://www.hardenize.com/report/forwardemail.net/1750312779> は、すべての TLS およびトランスポート セキュリティ対策に対して「良好」の評価を示しています。

### メール認証ヘッダーを保存しますか？{#do-you-preserve-email-authentication-headers}

はい。Forward Email はメール認証ヘッダーを包括的に実装し、保持します。

* **SPF (Sender Policy Framework)**: 適切に実装され、適切に維持されています
* **DKIM (DomainKeys Identified Mail)**: 適切な鍵管理による完全なサポート
* **DMARC**: SPFまたはDKIMの検証に失敗したメールに対するポリシー適用
* **ARC**: 詳細は明記されていませんが、このサービスの完璧なコンプライアンススコアは、包括的な認証ヘッダー処理を示唆しています

ソース: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

検証：Internet.nl Mail Testでは、「SPF、DKIM、DMARC」の実装において100/100のスコアを示しました。Hardenize評価では、SPFとDMARCの「良好」評価を確認しました。<https://www.hardenize.com/report/forwardemail.net/1750312779>

### 元のメールヘッダーを保存し、なりすましを防止しますか？{#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> メール転送機能は、メールの不正使用を防ぐために、高度ななりすまし対策を実装しています。

Forward Email は、MX コードベースを通じて包括的ななりすまし防止保護を実装しながら、元の電子メール ヘッダーを保持します。

* **ヘッダー保持**: 転送時に元の認証ヘッダーが維持されます
* **なりすまし対策**: DMARCポリシーの適用により、SPFまたはDKIM検証に失敗したメールを拒否することで、ヘッダーのなりすましを防止します
* **ヘッダーインジェクション防止**: striptagsライブラリを使用した入力検証とサニタイズ
* **高度な保護**: なりすまし検出、なりすまし防止、ユーザー通知システムを備えた高度なフィッシング検出

**MX 実装の詳細**: コアとなる電子メール処理ロジックは、MX サーバーのコードベースによって処理されます。具体的には、次のとおりです。

* メインMXデータハンドラー: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* 任意のメールフィルタリング（なりすまし対策）: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` ヘルパーは、ドメインのなりすまし、ブロックされたフレーズ、さまざまなフィッシング パターンの検出を含む、高度なスプーフィング対策ルールを実装します。

ソース: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### スパムや不正使用からどのように保護しますか？ {#how-do-you-protect-against-spam-and-abuse}

Forward Email は包括的な多層保護を実装します。

* **レート制限**: 認証試行、APIエンドポイント、SMTP接続に適用
* **リソース分離**: 大量のトラフィックを消費するユーザーによる影響を防ぐため、ユーザー間で分離
* **DDoS対策**: DataPacketのShieldシステムとCloudflareによる多層防御
* **自動スケーリング**: 需要に応じた動的なリソース調整
* **不正使用防止**: ユーザー固有の不正使用防止チェックと、ハッシュベースの悪質コンテンツブロック
* **メール認証**: 高度なフィッシング検出機能を備えたSPF、DKIM、DMARCプロトコル

出典：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS防御の詳細)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### メールの内容をディスクに保存していますか？{#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> メール転送では、メールの内容がディスクに書き込まれるのを防ぐゼロ知識アーキテクチャが採用されています。

* **ゼロ知識アーキテクチャ**: 個別に暗号化されたSQLiteメールボックスにより、Forward Emailはメールの内容にアクセスできません。
* **インメモリ処理**: メール処理はすべてメモリ内で行われるため、ディスクへの保存は不要です。
* **コンテンツログなし**: メールの内容やメタデータはログに記録されず、ディスクにも保存されません。
* **サンドボックス暗号化**: 暗号化キーは平文でディスクに保存されることはありません。

**MXコードベースの証拠**: MXサーバーは、コンテンツをディスクに書き込むことなく、メールを完全にメモリ内で処理します。メインのメール処理ハンドラは、このメモリ内アプローチを実証しています: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

出典：

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (概要)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (ゼロ知識情報の詳細)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (サンドボックス暗号化)

### システムクラッシュ時にメールの内容が公開される可能性があります {#can-email-content-be-exposed-during-system-crashes}

いいえ。Forward Email はクラッシュ関連のデータ漏洩に対する包括的な保護策を実装しています。

* **コアダンプ無効**: クラッシュ時のメモリ露出を防止します
* **スワップメモリ無効**: スワップファイルからの機密データの抽出を防止するため、完全に無効化します
* **インメモリアーキテクチャ**: メールの内容は処理中、揮発性メモリにのみ存在します
* **暗号化キー保護**: キーはディスク上に平文で保存されることはありません
* **物理的セキュリティ**: LUKS v2 暗号化ディスクにより、データへの物理的なアクセスを防止します
* **USB ストレージ無効**: 不正なデータ抽出を防止します

**システム問題のエラー処理**: Forward Email はヘルパー関数 `isCodeBug` および `isTimeoutError` を使用して、データベース接続の問題、DNS ネットワーク/ブロックリストの問題、またはアップストリーム接続の問題が発生した場合に、システムが 421 SMTP ステータス コードを返して、電子メールが失われたり公開されたりすることなく、後で再試行されるようにします。

実装の詳細:

* エラー分類: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* MX処理におけるタイムアウトエラー処理: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

ソース: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### メールインフラストラクチャにアクセスできるユーザー {#who-has-access-to-your-email-infrastructure}

Forward Email は、厳格な 2FA 要件に基づいて、最小限の 2 ～ 3 人のエンジニアリング チームのアクセスに対して包括的なアクセス制御を実装します。

* **ロールベースアクセス制御**: リソースベースの権限を持つチームアカウント向け
* **最小権限原則**: すべてのシステムに適用
* **職務分離**: 運用ロール間
* **ユーザー管理**: デプロイユーザーとDevOpsユーザーを異なる権限で分離
* **ルートログイン無効化**: 適切に認証されたアカウントからのアクセスを強制
* **厳格な2FA**: MiTM攻撃のリスクがあるため、SMSベースの2FAは使用せず、アプリベースまたはハードウェアトークンのみを使用
* **包括的な監査ログ**: 機密データのリダクション機能付き
* **自動異常検出**: 異常なアクセスパターンを検出
* **定期的なセキュリティレビュー**: アクセスログのチェック
* **悪意のあるメイド攻撃防止**: USBストレージの無効化などの物理的なセキュリティ対策

出典：

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (認証制御)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (ネットワークセキュリティ)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (悪意のあるメイド攻撃の防止)

### どのインフラストラクチャプロバイダーを使用していますか？ {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email は、包括的なコンプライアンス認証を取得した複数のインフラストラクチャサブプロセッサーを使用しています。

詳細はGDPRコンプライアンスページをご覧ください: <https://forwardemail.net/gdpr>

**プライマリインフラストラクチャサブプロセッサ:**

| プロバイダー | データプライバシーフレームワーク認定 | GDPRコンプライアンスページ |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **クラウドフレア** | ✅ はい | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **データパケット** | ❌ いいえ | <https://www.datapacket.com/privacy-policy> |
| **デジタルオーシャン** | ❌ いいえ | <https://www.digitalocean.com/legal/gdpr> |
| **ヴルトル** | ❌ いいえ | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**詳細な認証:**

**デジタルオーシャン**

* SOC 2 タイプIIおよびSOC 3 タイプII（Schellman & Company LLCによる監査済み）
* 複数のデータセンターでISO 27001認証取得
* PCI-DSS準拠
* CSA STAR レベル1認証取得
* APEC CBPR PRP認証取得
* 詳細: <https://www.digitalocean.com/trust/certification-reports>

**ヴルトル**

* SOC 2+ (HIPAA) 認定
* PCI 加盟店基準準拠
* CSA STAR レベル1 認定
* ISO/IEC 20000-1:2018、27001:2022、27017:2015、27018:2019
* 詳細: <https://www.vultr.com/legal/compliance/>

**データパケット**

* SOC 2準拠（認証取得については、DataPacketまで直接お問い合わせください）
* エンタープライズグレードのインフラストラクチャ（デンバー拠点）
* ShieldサイバーセキュリティスタックによるDDoS防御
* 24時間365日体制のテクニカルサポート
* 58のデータセンターにまたがるグローバルネットワーク
* 詳細: <https://www.datapacket.com/datacenters/denver>

**決済代行業者:**

* **Stripe**: データプライバシーフレームワーク認定済み - <https://stripe.com/legal/privacy-center>
* **PayPal**: DPF認定なし - <https://www.paypal.com/uk/legalhub/privacy-full>

### データ処理契約（DPA）を提供していますか？{#do-you-offer-a-data-processing-agreement-dpa}

はい、Forward Emailは包括的なデータ処理契約（DPA）を提供しており、エンタープライズ契約と併せて締結いただけます。DPAのコピーは以下からご覧いただけます: <https://forwardemail.net/dpa>

**DPAの詳細:**

* GDPRコンプライアンスおよびEU-米国間/スイス-米国間のプライバシーシールドフレームワークに対応
* 利用規約に同意すると自動的に承認されます
* 標準DPAには別途署名は不要
* エンタープライズライセンスを通じてカスタムDPA契約もご利用いただけます

**GDPRコンプライアンスフレームワーク:**
当社のDPA（データ保護契約）には、GDPRへの準拠と国際的なデータ移転要件の詳細が記載されています。詳細は以下をご覧ください: <https://forwardemail.net/gdpr>

カスタム DPA 条件または特定の契約上の取り決めを必要とするエンタープライズのお客様の場合は、**エンタープライズ ライセンス (月額 250 ドル)** プログラムを通じて対応できます。

### データ侵害通知をどのように処理しますか？ {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email のゼロ知識アーキテクチャにより、侵害の影響が大幅に軽減されます。

* **データ露出の制限**: ゼロ知識アーキテクチャのため、暗号化されたメールの内容にはアクセスできません
* **データ収集の最小化**: セキュリティのため、基本的な加入者情報と限定的なIPログのみ収集します
* **サブプロセッサーフレームワーク**: DigitalOceanとVultrは、GDPRに準拠したインシデント対応手順を維持しています

**GDPR 担当者情報:**
Forward Email は、GDPR 第 27 条に基づき、以下の担当者を任命しました。

**EU担当者:**
Osano International Compliance Services Limited
宛先: LFHC
3 Dublin Landings, North Wall Quay
ダブリン1, D01C4E0

**英国担当者:**
Osano UK Compliance LTD
宛先: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

特定の違反通知 SLA を必要とするエンタープライズ カスタマーの場合は、**エンタープライズ ライセンス** 契約の一部としてこれについて話し合う必要があります。

出典：

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### テスト環境を提供していますか？{#do-you-offer-a-test-environment}

Forward Emailの技術ドキュメントには専用のサンドボックスモードについて明記されていません。ただし、テスト方法としては以下のようなものが考えられます。

* **セルフホスティングオプション**: テスト環境を構築するための包括的なセルフホスティング機能
* **APIインターフェース**: 設定をプログラムでテストできる可能性
* **オープンソース**: 100%オープンソースコードのため、お客様は転送ロジックを検証できます
* **複数ドメイン**: 複数ドメインをサポートしているため、テストドメインを作成できます

正式なサンドボックス機能を必要とするエンタープライズ顧客の場合は、**エンタープライズ ライセンス** 契約の一部としてこれについて話し合う必要があります。

ソース: <https://github.com/forwardemail/forwardemail.net> (開発環境の詳細)

### 監視およびアラートツールを提供していますか？{#do-you-provide-monitoring-and-alerting-tools}

Forward Email は、いくつかの制限付きでリアルタイム監視を提供します。

**利用可能：**

* **リアルタイム配信監視**: 主要メールプロバイダーのパフォーマンス指標を公開
* **自動アラート**: 配信時間が10秒を超えるとエンジニアリングチームにアラートが送信されます
* **透過的な監視**: 100%オープンソースの監視システム
* **インフラストラクチャ監視**: 自動異常検出と包括的な監査ログ

**制限事項:**

* 顧客向けのウェブフックやAPIベースの配送状況通知が明確に文書化されていない

詳細な配信ステータスの Webhook またはカスタム監視統合を必要とするエンタープライズのお客様の場合、これらの機能は **エンタープライズ ライセンス** 契約を通じて利用できる場合があります。

出典：

* <https://forwardemail.net> (リアルタイム監視表示)
* <https://github.com/forwardemail/forwardemail.net> (監視実装)

### 高可用性をどのように確保しますか？ {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email は、複数のインフラストラクチャプロバイダーにわたる包括的な冗長性を実装します。

* **分散インフラストラクチャ**: 地理的に分散した複数のプロバイダー (DigitalOcean、Vultr、DataPacket)
* **地理的負荷分散**: Cloudflareベースの地理的に分散した負荷分散と自動フェイルオーバー
* **自動スケーリング**: 需要に基づいた動的なリソース調整
* **多層DDoS防御**: DataPacketのShieldシステムとCloudflareを介した
* **サーバー冗長性**: リージョンごとに複数のサーバーと自動フェイルオーバー
* **データベースレプリケーション**: 複数の拠点間でのリアルタイムデータ同期
* **監視とアラート**: 24時間365日体制の監視と自動インシデント対応

**稼働率保証**: 99.9% 以上のサービス可用性と透過的な監視が <https://forwardemail.net>

出典：

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### 国防権限法（NDAA）第889条に準拠していますか？{#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email は、インフラストラクチャパートナーを慎重に選定することで、Section 889 に完全に準拠しています。

はい、Forward Email は**Section 889**に準拠しています。国防権限法（NDAA）第889条では、政府機関が特定の企業（Huawei、ZTE、Hikvision、Dahua、Hytera）の通信機器およびビデオ監視機器を使用する組織と契約したり、使用したりすることを禁止しています。

**Forward EmailがSection 889コンプライアンスを達成する方法:**

Forward Email は、Section 889 で禁止されている機器を使用していない 2 つの主要なインフラストラクチャ プロバイダーのみに依存しています。

1. **Cloudflare**：ネットワークサービスとメールセキュリティの主要パートナー
2. **DataPacket**：サーバーインフラストラクチャの主要プロバイダー（Arista NetworksとCiscoの機器のみを使用）
3. **バックアッププロバイダー**：Digital OceanとVultrのバックアッププロバイダーは、Section 889に準拠していることが書面で確認されています。

**Cloudflare の取り組み**: Cloudflare は、サードパーティの行動規範の中で、セクション 889 で禁止されている組織の通信機器、ビデオ監視製品、またはサービスを使用しないことを明示的に規定しています。

**政府の使用事例**: **米国海軍兵学校** が安全なメール転送のニーズに Forward Email を選択し、連邦コンプライアンス標準の文書化を要求したときに、当社の Section 889 コンプライアンスが検証されました。

より広範な連邦規制を含む政府コンプライアンス フレームワークの詳細については、包括的なケース スタディをご覧ください: [連邦政府電子メールサービスセクション889準拠](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## システムと技術詳細 {#system-and-technical-details}

### メールとその内容を保存しますか？{#do-you-store-emails-and-their-contents}

いいえ、[エラーの例外](#do-you-store-error-logs) および [送信SMTP](#do-you-support-sending-email-with-smtp) を使用してディスクに書き込んだり、ログを保存したりすることはありません ([プライバシーポリシー](/privacy) を参照)。

すべてはメモリ内および [ソースコードはGitHubにあります](https://github.com/forwardemail) で実行されます。

### メール転送システムはどのように機能しますか？ {#how-does-your-email-forwarding-system-work}

メールは[SMTPプロトコル](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)に依存しています。このプロトコルは、サーバー（通常はポート25で動作）に送信されるコマンドで構成されています。まず最初の接続が行われ、次に送信者がメールの送信元（"MAIL FROM"）を指定し、続いてメールの送信先（"RCPT TO"）を指定し、最後にメールのヘッダーと本文（"DATA"）を指定します。当社のメール転送システムのフローは、以下の各SMTPプロトコルコマンドに基づいて説明されています。

* 初期接続（コマンド名なし、例：`telnet example.com 25`） - これは初期接続です。[許可リスト](#do-you-have-an-allowlist) に登録されていない送信者については、[拒否リスト](#do-you-have-a-denylist) に登録されているかどうかを確認します。最後に、送信者が許可リストに登録されていない場合は、[グレーリスト](#do-you-have-a-greylist) に登録されているかどうかを確認します。

* `HELO` - 送信者のFQDN、IPアドレス、またはメールハンドラ名を識別するための挨拶を示します。この値は偽装される可能性があるため、このデータには依存せず、代わりに接続のIPアドレスの逆ホスト名検索を使用します。

* `MAIL FROM` - メールのエンベロープメールの送信元アドレスを示します。値を入力する場合は、有効なRFC 5322メールアドレスである必要があります。空の値も許可されます。ここでは[後方散乱をチェックする](#how-do-you-protect-against-backscatter)を使用し、MAIL FROMを[拒否リスト](#do-you-have-a-denylist)と照合します。最後に、許可リストに登録されていない送信者に対してレート制限を行います（詳細については、[レート制限](#do-you-have-rate-limiting)と[許可リスト](#do-you-have-an-allowlist)のセクションを参照してください）。

* `RCPT TO` - メールの受信者を示します。有効なRFC 5322メールアドレスである必要があります。1メッセージあたり最大50人のエンベロープ受信者のみ許可されます（これはメールの「To」ヘッダーとは異なります）。また、SRSドメイン名によるなりすましを防ぐため、有効な[送信者書き換えスキーム](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme)（「SRS」）アドレスもここで確認します。

* `DATA` - メールを処理するサービスの中核部分です。詳細については、下記の[メールを転送するにはどうすればいいですか？](#how-do-you-process-an-email-for-forwarding)セクションをご覧ください。

### 転送するメールをどのように処理しますか？ {#how-do-you-process-an-email-for-forwarding}

このセクションでは、上記の [メール転送システムはどのように機能しますか](#how-does-your-email-forwarding-system-work) セクションの SMTP プロトコル コマンド `DATA` に関連するプロセスについて説明します。これは、電子メールのヘッダー、本文、セキュリティを処理し、電子メールの配信先を決定し、接続を処理する方法です。

1. メッセージが最大サイズの 50 MB を超えると、552 エラー コードで拒否されます。

2. メッセージに「From」ヘッダーが含まれていない場合、または「From」ヘッダーのいずれかの値が有効な RFC 5322 電子メール アドレスでない場合は、550 エラー コードで拒否されます。

3. メッセージに 25 を超える「Received」ヘッダーがあった場合、リダイレクト ループに陥っていると判断され、550 エラー コードで拒否されます。

4. 電子メールのフィンガープリント ([指紋採取](#how-do-you-determine-an-email-fingerprint) のセクションを参照) を使用して、メッセージの再試行が 5 日以上試行されているかどうか ([デフォルトの接尾辞の動作](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime) に一致) を確認します。そうである場合は、550 エラー コードで拒否されます。

5. [スパムスキャナー](https://spamscanner.net) を使用して電子メールをスキャンした結果をメモリ内に保存します。

6. スパムスキャナから任意の結果が返された場合は、エラーコード554で拒否されます。本稿執筆時点では、任意の結果にはGTUBEテストのみが含まれます。詳細については、<https://spamassassin.apache.org/gtube/> を参照してください。

7. デバッグと不正使用防止の目的で、メッセージに次のヘッダーを追加します。

* `Received` - 送信元IPとホスト、送信タイプ、TLS接続情報、日時、受信者を含む標準のReceivedヘッダーを追加します。
* `X-Original-To` - メッセージの元の受信者
* これは、メールが最初にどこに配信されたかを特定するのに役立ちます（「Received」ヘッダーに加えて）。
* これは、IMAPまたはマスク転送時に受信者ごとに追加されます（プライバシー保護のため）。
* `X-Forward-Email-Website` - <https://forwardemail.net>>の当社ウェブサイトへのリンクが含まれます。
* `X-Forward-Email-Version` - 当社のコードベースの`package.json`にある現在の[セムバー](https://semver.org/)バージョンです。
* `X-Forward-Email-Session-ID` - デバッグ目的で使用されるセッションID値（非本番環境にのみ適用されます）。
* `X-Forward-Email-Sender` - 元のエンベロープMAIL FROMアドレス（空白でない場合）、逆PTRクライアントFQDN（存在する場合）、および送信者のIPアドレスを含む、カンマ区切りのリスト。
* `X-Forward-Email-ID` - これは送信SMTPにのみ適用され、「マイアカウント」→「メール」に保存されているメールIDと相関します。
* `X-Original-To`0 - 値は`X-Original-To`1です。
* `X-Original-To`2 - 値は`X-Original-To`3です。
* `X-Original-To`4 - 値は`X-Original-To`5です。

8. 次に、[DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)、[SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)、[ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain)、および [DMARC](https://en.wikipedia.org/wiki/DMARC) のメッセージを確認します。

* メッセージがDMARCに失敗し、ドメインに拒否ポリシー（例：`p=reject` [DMARCポリシーにあった](https://wikipedia.org/wiki/DMARC)）が設定されている場合、エラーコード550で拒否されます。通常、ドメインのDMARCポリシーは、`_dmarc`サブドメインの<strong class="notranslate">TXT</strong>レコード（例：`dig _dmarc.example.com txt`）に記載されています。
* メッセージがSPFに失敗し、ドメインにハードフェイルポリシー（例：`~all`ではなく、`-all`がSPFポリシーに含まれている、またはポリシーが全く設定されていない場合）が設定されている場合、エラーコード550で拒否されます。通常、ドメインのSPFポリシーは、ルートドメインの<strong class="notranslate">TXT</strong>レコード（例：`dig example.com txt`）に記載されています。 SPF に関する [Gmailと同じようにメールを送信する](#can-i-send-mail-as-in-gmail-with-this) の詳細については、このセクションを参照してください。

9. 次に、上記の[メール転送システムはどのように機能しますか](#how-does-your-email-forwarding-system-work)セクションの`RCPT TO`コマンドから収集したメッセージの受信者を処理します。受信者ごとに、以下の操作を実行します。

* ドメイン名の<strong class="notranslate">TXT</strong>レコード（`@` 記号の後の部分、例：メールアドレスが `test@example.com` の場合は `example.com`）を参照します。例えば、ドメインが `example.com` の場合は、`dig example.com txt` などのDNSルックアップを実行します。
* `forward-email=`（無料プラン）または `forward-email-site-verification=`（有料プラン）で始まるすべての<strong class="notranslate">TXT</strong>レコードを解析します。ユーザーがプランをアップグレードまたはダウングレードする際にメールを処理するため、両方のレコードを解析することに注意してください。
* 解析されたこれらの <strong class="notranslate">TXT</strong> レコードから、転送設定を抽出します（上記の [メール転送を開始して設定するにはどうすればよいですか？](#how-do-i-get-started-and-set-up-email-forwarding) セクションで説明されているとおり）。サポートされる `forward-email-site-verification=` 値は 1 つのみであり、複数指定された場合は 550 エラーが発生し、送信者はこの受信者へのバウンスを受け取ります。
* 抽出された転送設定を再帰的に反復処理し、グローバル転送、正規表現ベースの転送、その他サポートされているすべての転送設定（現在「転送アドレス」と呼ばれています）を特定します。
* 各転送アドレスに対して、1 回の再帰検索をサポートします（これにより、指定されたアドレスでこの一連の操作が再度開始されます）。再帰的に一致が見つかった場合、親の結果が転送アドレスから削除され、子が追加されます。
* 転送先アドレスは一意であるかどうか解析されます（1つのアドレスに重複したメールを送信したり、不要なSMTPクライアント接続を発生させたりしないため）。
* 各転送先アドレスについて、APIエンドポイント`/v1/max-forwarded-addresses`に対してドメイン名を検索します（ドメインがエイリアスごとにメールを転送できるアドレスの数を決定するため。例えば、デフォルトでは10件です。`example.com`0のセクションを参照してください）。この制限を超えると550エラーが発生し、送信者はこの受信者のバウンスを受け取ります。
* 元の受信者の設定をAPIエンドポイント`example.com`1に対して検索します。これは有料ユーザー向けの検索をサポートしています（無料ユーザー向けのフォールバック機能付き）。これは、`example.com`2（数値、例：`example.com`3）、`example.com`4（ブール値）、`example.com`5（ブール値）、`example.com`6（ブール値）、および`example.com`7（ブール値）の詳細設定用の構成オブジェクトを返します。
* これらの設定に基づいて、スパムスキャナの結果と照合し、エラーが発生した場合は、メッセージは554エラーコードで拒否されます（例：`example.com`8が有効になっている場合は、スパムスキャナの結果でウイルスをチェックします）。無料プランのすべてのユーザーは、アダルトコンテンツ、フィッシング、実行ファイル、およびウイルスのチェックにオプトインされることに注意してください。デフォルトでは、すべての有料プランのユーザーもオプトインされていますが、この構成はメール転送ダッシュボードのドメインの [設定] ページで変更できます。

10. 処理された受信者の転送アドレスごとに、次の操作を実行します。

* アドレスは[拒否リスト](#do-you-have-a-denylist)と照合され、リストに含まれていた場合は421エラーコードが返されます（送信者に後で再試行するように指示します）。
* アドレスがWebhookの場合、以降の操作のためにブール値を設定します（下記参照 – 配信用に複数のPOSTリクエストではなく、類似のWebhookをグループ化して1つのPOSTリクエストを作成します）。
* アドレスがメールアドレスの場合、以降の操作のためにホストを解析します（下記参照 – 配信用に複数の個別の接続ではなく、類似のホストをグループ化して1つの接続を作成します）。

11. 受信者が存在せず、バウンスもない場合は、「受信者が無効です」という 550 エラーで応答します。

12. 受信者がいる場合は、同じホストでグループ化された受信者を反復処理し、メールを配信します。詳細については、以下の[メール配信の問題にどのように対処しますか](#how-do-you-handle-email-delivery-issues)セクションをご覧ください。

* メール送信中にエラーが発生した場合、エラーはメモリに保存され、後で処理されます。
* メール送信時に発生したエラーコードのうち、最も低いエラーコード（存在する場合）が `DATA` コマンドへの応答コードとして使用されます。つまり、配信されなかったメールは通常、元の送信者によって再試行されますが、既に配信されたメールは次回のメッセージ送信時に再送信されません（[指紋採取](#how-do-you-determine-an-email-fingerprint) を使用しているため）。
* エラーが発生しなかった場合は、SMTP 応答ステータスコード 250（成功）が送信されます。
* バウンスとは、配信試行の結果、ステータスコードが 500 以上（永続的な失敗）になったメールを指します。

13. バウンスが発生しなかった場合 (永続的な失敗)、非永続的な失敗からの最も低いエラー コードの SMTP 応答ステータス コード (バウンスがなかった場合は 250 の成功ステータス コード) を返します。

14. バウンスが発生した場合、送信者に最も低いエラーコードを返した後、バックグラウンドでバウンスメールを送信します。ただし、最も低いエラーコードが500以上の場合は、バウンスメールを送信しません。これは、バウンスメールを送信すると、送信者が二重のバウンスメール（例：Gmailなどの送信MTAからのメールと、当社からのメール）を受信することになるためです。詳細については、以下の[後方散乱からどのように保護するか](#how-do-you-protect-against-backscatter)に関するセクションをご覧ください。

### メール配信の問題をどのように処理しますか？ {#how-do-you-handle-email-delivery-issues}

なお、送信者のDMARCポリシーが不合格で、かつDKIM署名がFromヘッダーと一致していない場合にのみ、メールの「Friendly-From」を書き換えます。つまり、メッセージの「From」ヘッダーを変更し、「X-Original-From」を設定し、「Reply-To」がまだ設定されていない場合は設定します。また、これらのヘッダーを変更した後、メッセージのARCシールも再シールします。

また、コード、DNS リクエスト、Node.js 内部、HTTP リクエスト (例: 受信者が Webhook の場合、408、413、429 は SMTP 応答コード 421 にマッピングされます)、メール サーバーの応答 (例: 「defer」または「slowdown」を含む応答は 421 エラーとして再試行されます) など、スタックのあらゆるレベルでエラー メッセージのスマート解析を使用します。

当社のロジックはダミープルーフであり、SSL/TLSエラーや接続の問題などが発生した場合にも再試行を行います。ダミープルーフの目的は、転送設定においてすべての受信者への配信率を最大化することです。

受信者がWebhookの場合、リクエストが完了するまで60秒間のタイムアウトを許可し、最大3回の再試行（つまり失敗までに合計4回のリクエスト）まで再試行します。エラーコード408、413、429は正しく解析され、SMTPレスポンスコード421にマッピングされます。

受信者がメールアドレスの場合、日和見TLSを使用してメールを送信しようとします（受信者のメールサーバーでSTARTTLSが利用可能な場合はSTARTTLSを使用しようとします）。メール送信中にSSL/TLSエラーが発生した場合は、TLSを使用せずに（STARTTLSを使用せずに）メールを送信しようとします。

DNS または接続エラーが発生した場合は、`DATA` コマンドに SMTP 応答コード 421 を返します。それ以外の場合、500 以上のレベルのエラーがある場合は、バウンスが送信されます。

配信先のメール サーバーで、1 つ以上のメール エクスチェンジ IP アドレスがブロックされていることが検出された場合 (スパマーを阻止するために使用されているテクノロジなどにより)、送信者が後でメッセージを再試行できるように、SMTP 応答コード 421 を送信します (また、この問題は通知されるため、次回の試行前に解決できます)。

### IPアドレスがブロックされた場合、どのように対処しますか？ {#how-do-you-handle-your-ip-addresses-becoming-blocked}

当社では、すべての主要な DNS ブラックリストを定期的に監視しており、メール エクスチェンジ (「MX」) IP アドレスが主要なブラックリストに記載されている場合は、問題が解決されるまで、可能であれば関連する DNS A レコード ラウンド ロビンからそのアドレスを削除します。

本稿執筆時点では、当社は複数のDNSホワイトリストにも登録されており、ブラックリストの監視も厳格に実施しています。問題が見つかった場合は、解決に時間がかかる前に<support@forwardemail.net>まで書面でご連絡ください。

当社の IP アドレスは公開されています ([詳細については、以下のセクションをご覧ください。](#what-are-your-servers-ip-addresses))。

### 郵便局長の住所とは何ですか？ {#what-are-postmaster-addresses}

誤った宛先へのバウンスや、監視されていないメールボックスや存在しないメールボックスへの不在応答メッセージの送信を防ぐために、メール デーモンのようなユーザー名のリストを維持しています。

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
* [および返信不可のアドレス](#what-are-no-reply-addresses)

このようなリストを使用して効率的な電子メール システムを作成する方法の詳細については、[RFC 5320 セクション4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) を参照してください。

### ノーリプライアドレスとは{#what-are-no-reply-addresses}

次のいずれかに等しい電子メール ユーザー名 (大文字と小文字は区別されません) は、返信不可アドレスとみなされます。

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

このリストは [GitHub上のオープンソースプロジェクトとして](https://github.com/forwardemail/reserved-email-addresses-list) で管理されます。

### サーバーのIPアドレスは何ですか？ {#what-are-your-servers-ip-addresses}

弊社のIPアドレスは<https://forwardemail.net/ips>.>で公開されています。

### 許可リストはありますか？{#do-you-have-an-allowlist}

はい、デフォルトで許可リストに登録されている [ドメイン名拡張子のリスト](#what-domain-name-extensions-are-allowlisted-by-default) と、[厳格な基準](#what-is-your-allowlist-criteria) に基づいた動的でキャッシュされたローリング許可リストがあります。

有料プランの顧客からのすべてのメール、ドメイン、受信者は、自動的に許可リストに追加されます。

### デフォルトで許可リストに登録されるドメイン名拡張子 {#what-domain-name-extensions-are-allowlisted-by-default}

次のドメイン名拡張子は、Umbrella 人気リストに含まれているかどうかに関係なく、デフォルトで許可リストに登録されていると見なされます。

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

さらに、次の [ブランドおよび企業のトップレベルドメイン](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) はデフォルトで許可リストに登録されています (例: Apple Card 銀行明細書の `applecard.apple` の場合は `apple`):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">アバルト</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">アボット</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">アクセンチュア</code></li>
<li class="list-inline-item"><code class="notranslate">ACO</code></li>
<li class="list-inline-item"><code class="notranslate">AEG</code></li>
<li class="list-inline-item"><code class="notranslate">Aetna</code></li>
<li class="list-inline-item"><code class="notranslate">Afl</code></li>
<li class="list-inline-item"><code class="notranslate">Agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">AIG</code></li>
<li class="list-inline-item"><code class="notranslate">Aigo</code></li>
<li class="list-inline-item"><code class="notranslate">エアバス</code></li>
<li class="list-inline-item"><code class="notranslate">エアテル</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">アルファロメオ</code></li>
<li class="list-inline-item"><code class="notranslate">アリババ</code></li>
<li class="list-inline-item"><code class="notranslate">アリペイ</code></li>
<li class="list-inline-item"><code class="notranslate">オールファイナンシャル</code></li>
<li class="list-inline-item"><code class="notranslate">オールステート</code></li>
<li class="list-inline-item"><code class="notranslate">アリー</code></li>
<li class="list-inline-item"><code class="notranslate">アルストム</code></li>
<li class="list-inline-item"><code class="notranslate">Amazon</code></li>
<li class="list-inline-item"><code class="notranslate">American Express</code></li>
<li class="list-inline-item"><code class="notranslate">Amex</code></li>
<li class="list-inline-item"><code class="notranslate">Amica</code></li>
<li class="list-inline-item"><code class="notranslate">Android</code></li>
<li class="list-inline-item"><code class="notranslate">ANZ</code></li>
<li class="list-inline-item"><code class="notranslate">AOL</code></li>
<li class="list-inline-item"><code class="notranslate">Apple</code></li>
<li class="list-inline-item"><code class="notranslate">アクアレル</code></li>
<li class="list-inline-item"><code class="notranslate">アラムコ</code></li>
<li class="list-inline-item"><code class="notranslate">アウディ</code></li>
<li class="list-inline-item"><code class="notranslate">オーストラリア郵便</code></li>
<li class="list-inline-item"><code class="notranslate">AWS</code></li>
<li class="list-inline-item"><code class="notranslate">アックス</code></li>
<li class="list-inline-item"><code class="notranslate">アズール</code></li>
<li class="list-inline-item"><code class="notranslate">バイドゥ</code></li>
<li class="list-inline-item"><code class="notranslate">バナナリパブリック</code></li>
<li class="list-inline-item"><code class="notranslate">バークレイズカード</code></li>
<li class="list-inline-item"><code class="notranslate">バークレイズ</code></li>
<li class="list-inline-item"><code class="notranslate">バスケットボール</code></li>
<li class="list-inline-item"><code class="notranslate">バウハウス</code></li>
<li class="list-inline-item"><code class="notranslate">BBC</code></li>
<li class="list-inline-item"><code class="notranslate">BBT</code></li>
<li class="list-inline-item"><code class="notranslate">BBVA</code></li>
<li class="list-inline-item"><code class="notranslate">BCG</code></li>
<li class="list-inline-item"><code class="notranslate">ベントレー</code></li>
<li class="list-inline-item"><code class="notranslate">バーティ</code></li>
<li class="list-inline-item"><code class="notranslate">ビング</code></li>
<li class="list-inline-item"><code class="notranslate">ブランコ</code></li>
<li class="list-inline-item"><code class="notranslate">ブルームバーグ</code></li>
<li class="list-inline-item"><code class="notranslate">BMS</code></li>
<li class="list-inline-item"><code class="notranslate">BMW</code></li>
<li class="list-inline-item"><code class="notranslate">BNL</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">ベーリンガー</code></li>
<li class="list-inline-item"><code class="notranslate">ボンド</code></li>
<li class="list-inline-item"><code class="notranslate">ブッキング</code></li>
<li class="list-inline-item"><code class="notranslate">ボッシュ</code></li>
<li class="list-inline-item"><code class="notranslate">ボスティック</code></li>
<li class="list-inline-item"><code class="notranslate">ブラデスコ</code></li>
<li class="list-inline-item"><code class="notranslate">ブリヂストン</code></li>
<li class="list-inline-item"><code class="notranslate">ブラザー</code></li>
<li class="list-inline-item"><code class="notranslate">ブガッティ</code></li>
<li class="list-inline-item"><code class="notranslate">カル</code></li>
<li class="list-inline-item"><code class="notranslate">カルバン・クライン</code></li>
<li class="list-inline-item"><code class="notranslate">カノン</code></li>
<li class="list-inline-item"><code class="notranslate">キャピタローン</code></li>
<li class="list-inline-item"><code class="notranslate">キャラバン</code></li>
<li class="list-inline-item"><code class="notranslate">カルティエ</code></li>
<li class="list-inline-item"><code class="notranslate">CBA</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">クライスラー</code></li>
<li class="list-inline-item"><code class="notranslate">シプリアーニ</code></li>
<li class="list-inline-item"><code class="notranslate">シスコ</code></li>
<li class="list-inline-item"><code class="notranslate">シタデル</code></li>
<li class="list-inline-item"><code class="notranslate">シティ</code></li>
<li class="list-inline-item"><code class="notranslate">シティック</code></li>
<li class="list-inline-item"><code class="notranslate">クラブメッド</code></li>
<li class="list-inline-item"><code class="notranslate">コムキャスト</code></li>
<li class="list-inline-item"><code class="notranslate">コムバンク</code></li>
<li class="list-inline-item"><code class="notranslate">信用組合</code></li>
<li class="list-inline-item"><code class="notranslate">クラウン</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">クイジネッラ</code></li>
<li class="list-inline-item"><code class="notranslate">ダバー</code></li>
<li class="list-inline-item"><code class="notranslate">ダットサン</code></li>
<li class="list-inline-item"><code class="notranslate">ディーラー</code></li>
<li class="list-inline-item"><code class="notranslate">デル</code></li>
<li class="list-inline-item"><code class="notranslate">デロイト</code></li>
<li class="list-inline-item"><code class="notranslate">デルタ</code></li>
<li class="list-inline-item"><code class="notranslate">DHL</code></li>
<li class="list-inline-item"><code class="notranslate">ディスカバー</code></li>
<li class="list-inline-item"><code class="notranslate">ディッシュ</code></li>
<li class="list-inline-item"><code class="notranslate">DNP</code></li>
<li class="list-inline-item"><code class="notranslate">ダッジ</code></li>
<li class="list-inline-item"><code class="notranslate">ダンロップ</code></li>
<li class="list-inline-item"><code class="notranslate">デュポン</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">エデカ</code></li>
<li class="list-inline-item"><code class="notranslate">エメルク</code></li>
<li class="list-inline-item"><code class="notranslate">エプソン</code></li>
<li class="list-inline-item"><code class="notranslate">エリクソン</code></li>
<li class="list-inline-item"><code class="notranslate">エルニ</code></li>
<li class="list-inline-item"><code class="notranslate">エシュランス</code></li>
<li class="list-inline-item"><code class="notranslate">エティサラート</code></li>
<li class="list-inline-item"><code class="notranslate">ユーロビジョン</code></li>
<li class="list-inline-item"><code class="notranslate">エバーバンク</code></li>
<li class="list-inline-item"><code class="notranslate">エクストラスペース</code></li>
<li class="list-inline-item"><code class="notranslate">フェイジ</code></li>
<li class="list-inline-item"><code class="notranslate">フェアウィンズ</code></li>
<li class="list-inline-item"><code class="notranslate">ファーマーズ</code></li>
<li class="list-inline-item"><code class="notranslate">フェデックス</code></li>
<li class="list-inline-item"><code class="notranslate">フェラーリ</code></li>
<li class="list-inline-item"><code class="notranslate">フェレロ</code></li>
<li class="list-inline-item"><code class="notranslate">フィアット</code></li>
<li class="list-inline-item"><code class="notranslate">フィデリティ</code></li>
<li class="list-inline-item"><code class="notranslate">ファイアストン</code></li>
<li class="list-inline-item"><code class="notranslate">ファームデール</code></li>
<li class="list-inline-item"><code class="notranslate">Flickr</code></li>
<li class="list-inline-item"><code class="notranslate">flir</code></li>
<li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
<li class="list-inline-item"><code class="notranslate">フォード</code></li>
<li class="list-inline-item"><code class="notranslate">フォックス</code></li>
<li class="list-inline-item"><code class="notranslate">フレゼニウス</code></li>
<li class="list-inline-item"><code class="notranslate">フォレックス</code></li>
<li class="list-inline-item"><code class="notranslate">フロガンズ</code></li>
<li class="list-inline-item"><code class="notranslate">フロンティア</code></li>
<li class="list-inline-item"><code class="notranslate">富士通</code></li>
<li class="list-inline-item"><code class="notranslate">富士ゼロックス</code></li>
<li class="list-inline-item"><code class="notranslate">ガロ</code></li>
<li class="list-inline-item"><code class="notranslate">ギャラップ</code></li>
<li class="list-inline-item"><code class="notranslate">ギャップ</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">ギア</code></li>
<li class="list-inline-item"><code class="notranslate">ゲンティン</code></li>
<li class="list-inline-item"><code class="notranslate">ギビング</code></li>
<li class="list-inline-item"><code class="notranslate">グル</code></li>
<li class="list-inline-item"><code class="notranslate">グローボ</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">GMO</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">ゴールドポイント</code></li>
<li class="list-inline-item"><code class="notranslate">グッドイヤー</code></li>
<li class="list-inline-item"><code class="notranslate">グーグル</code></li>
<li class="list-inline-item"><code class="notranslate">グーグル</code></li>
<li class="list-inline-item"><code class="notranslate">グレインジャー</code></li>
<li class="list-inline-item"><code class="notranslate">ガーディアン</code></li>
<li class="list-inline-item"><code class="notranslate">グッチ</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC</code></li>
<li class="list-inline-item"><code class="notranslate">HDFCバンク</code></li>
<li class="list-inline-item"><code class="notranslate">エルメス</code></li>
<li class="list-inline-item"><code class="notranslate">久光製薬</code></li>
<li class="list-inline-item"><code class="notranslate">日立</code></li>
<li class="list-inline-item"><code class="notranslate">hkt</code></li>
<li class="list-inline-item"><code class="notranslate">ホンダ</code></li>
<li class="list-inline-item"><code class="notranslate">ハネウェル</code></li>
<li class="list-inline-item"><code class="notranslate">ホットメール</code></li>
<li class="list-inline-item"><code class="notranslate">HSBC</code></li>
<li class="list-inline-item"><code class="notranslate">ヒューズ</code></li>
<li class="list-inline-item"><code class="notranslate">ハイアット</code></li>
<li class="list-inline-item"><code class="notranslate">ヒュンダイ</code></li>
<li class="list-inline-item"><code class="notranslate">IBM</code></li>
<li class="list-inline-item"><code class="notranslate">ieee</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">ikano</code></li>
<li class="list-inline-item"><code class="notranslate">imdb</code></li>
<li class="list-inline-item"><code class="notranslate">インフィニティ</code></li>
<li class="list-inline-item"><code class="notranslate">インテル</code></li>
<li class="list-inline-item"><code class="notranslate">インテュイット</code></li>
<li class="list-inline-item"><code class="notranslate">イピランガ</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">イタウ</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">イベコ</code></li>
<li class="list-inline-item"><code class="notranslate">ジャガー</code></li>
<li class="list-inline-item"><code class="notranslate">ジャバ</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">ジープ</code></li>
<li class="list-inline-item"><code class="notranslate">JPモルガン</code></li>
<li class="list-inline-item"><code class="notranslate">ジュニパー</code></li>
<li class="list-inline-item"><code class="notranslate">KDDI</code></li>
<li class="list-inline-item"><code class="notranslate">ケリーホテルズ</code></li>
<li class="list-inline-item"><code class="notranslate">ケリーロジスティクス</code></li>
<li class="list-inline-item"><code class="notranslate">ケリープロパティーズ</code></li>
<li class="list-inline-item"><code class="notranslate">KFH</code></li>
<li class="list-inline-item"><code class="notranslate">キア</code></li>
<li class="list-inline-item"><code class="notranslate">キンダー</code></li>
<li class="list-inline-item"><code class="notranslate">キンドル</code></li>
<li class="list-inline-item"><code class="notranslate">コマツ</code></li>
<li class="list-inline-item"><code class="notranslate">KPMG</code></li>
<li class="list-inline-item"><code class="notranslate">クレッド</code></li>
<li class="list-inline-item"><code class="notranslate">クックグループ</code></li>
<li class="list-inline-item"><code class="notranslate">ラカイシャ</code></li>
<li class="list-inline-item"><code class="notranslate">ラドブロークス</code></li>
<li class="list-inline-item"><code class="notranslate">ランボルギーニ</code></li>
<li class="list-inline-item"><code class="notranslate">ランカスター</code></li>
<li class="list-inline-item"><code class="notranslate">ランチア</code></li>
<li class="list-inline-item"><code class="notranslate">ランコム</code></li>
<li class="list-inline-item"><code class="notranslate">ランドローバー</code></li>
<li class="list-inline-item"><code class="notranslate">ランクセス</code></li>
<li class="list-inline-item"><code class="notranslate">ラサール</code></li>
<li class="list-inline-item"><code class="notranslate">ラトローブ</code></li>
<li class="list-inline-item"><code class="notranslate">lds</code></li>
<li class="list-inline-item"><code class="notranslate">leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">lego</code></li>
<li class="list-inline-item"><code class="notranslate">liaison</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
<li class="list-inline-item"><code class="notranslate">lily</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">リンデ</code></li>
<li class="list-inline-item"><code class="notranslate">リプシー</code></li>
<li class="list-inline-item"><code class="notranslate">リクシル</code></li>
<li class="list-inline-item"><code class="notranslate">ローカス</code></li>
<li class="list-inline-item"><code class="notranslate">ロッテ</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplファイナンシャル</code></li>
<li class="list-inline-item"><code class="notranslate">ルンドベック</code></li>
<li class="list-inline-item"><code class="notranslate">ルパン</code></li>
<li class="list-inline-item"><code class="notranslate">メイシーズ</code></li>
<li class="list-inline-item"><code class="notranslate">マイフ</code></li>
<li class="list-inline-item"><code class="notranslate">マン</code></li>
<li class="list-inline-item"><code class="notranslate">マンゴー</code></li>
<li class="list-inline-item"><code class="notranslate">マリオット</code></li>
<li class="list-inline-item"><code class="notranslate">マセラティ</code></li>
<li class="list-inline-item"><code class="notranslate">マテル</code></li>
<li class="list-inline-item"><code class="notranslate">マッキンゼー</code></li>
<li class="list-inline-item"><code class="notranslate">メットライフ</code></li>
<li class="list-inline-item"><code class="notranslate">マイクロソフト</code></li>
<li class="list-inline-item"><code class="notranslate">ミニ</code></li>
<li class="list-inline-item"><code class="notranslate">ミット</code></li>
<li class="list-inline-item"><code class="notranslate">三菱</code></li>
<li class="list-inline-item"><code class="notranslate">MLB</code></li>
<li class="list-inline-item"><code class="notranslate">総合格闘技（MMA）</code></li>
<li class="list-inline-item"><code class="notranslate">モナッシュ</code></li>
<li class="list-inline-item"><code class="notranslate">モルモン</code></li>
<li class="list-inline-item"><code class="notranslate">モト</code></li>
<li class="list-inline-item"><code class="notranslate">モビスター</code></li>
<li class="list-inline-item"><code class="notranslate">MSD</code></li>
<li class="list-inline-item"><code class="notranslate">マウンテンバイク</code></li>
<li class="list-inline-item"><code class="notranslate">MTR</code></li>
<li class="list-inline-item"><code class="notranslate">ミューチュアル</code></li>
<li class="list-inline-item"><code class="notranslate">ナデックス</code></li>
<li class="list-inline-item"><code class="notranslate">ネイションワイド</code></li>
<li class="list-inline-item"><code class="notranslate">自然</code></ li>
<li class="list-inline-item"><code class="notranslate">NBA</code></li>
<li class="list-inline-item"><code class="notranslate">NEC</code></li>
<li class="list-inline-item"><code class="notranslate">Netflix</code></li>
<li class="list-inline-item"><code class="notranslate">ニュースター</code></li>
<li class="list-inline-item"><code class="notranslate">ニューホランド</code></li>
<li class="list-inline-item"><code class="notranslate">NFL</code></li>
<li class="list-inline-item"><code class="notranslate">NHK</code></li>
<li class="list-inline-item"><code class="notranslate">ニコ</code></li>
<li class="list-inline-item"><code class="notranslate">ナイキ</code></li>
<li class="list-inline-item"><code class="notranslate">ニコン</code></li>
<li class="list-inline-item"><code class="notranslate">日産</code></li>
<li class="list-inline-item"><code class="notranslate">ニッセイ同和損保</code></li>
<li class="list-inline-item"><code class="notranslate">ノキア</code></li>
<li class="list-inline-item"><code class="notranslate">ノースウェスタンミューチュアル</code></li>
<li class="list-inline-item"><code class="notranslate">ノートン</code></li>
<li class="list-inline-item"><code class="notranslate">NRA</code></li>
<li class="list-inline-item"><code class="notranslate">NTT</code></li>
<li class="list-inline-item"><code class="notranslate">帯</code></li>
<li class="list-inline-item"><code class="notranslate">オフィス</code></li>
<li class="list-inline-item"><code class="notranslate">オメガ</code></li>
<li class="list-inline-item"><code class="notranslate">オラクル</code></li>
<li class="list-inline-item"><code class="notranslate">オレンジ</code></li>
<li class="list-inline-item"><code class="notranslate">大塚商会</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">パナソニック</code></li>
<li class="list-inline-item"><code class="notranslate">PCCW</code></li>
<li class="list-inline-item"><code class="notranslate">ファイザー</code></li>
<li class="list-inline-item"><code class="notranslate">フィリップス</code></li>
<li class="list-inline-item"><code class="notranslate">ピアジェ</code></li>
<li class="list-inline-item"><code class="notranslate">ピクテ</code></li>
<li class="list-inline-item"><code class="notranslate">ピング</code></li>
<li class="list-inline-item"><code class="notranslate">パイオニア</code></li>
<li class="list-inline-item"><code class="notranslate">プレイ</code></li>
<li class="list-inline-item"><code class="notranslate">プレイステーション</code></li>
<li class="list-inline-item"><code class="notranslate">ポール</code></li>
<li class="list-inline-item"><code class="notranslate">ポリシー</code></li>
<li class="list-inline-item"><code class="notranslate">プラクシ</code></li>
<li class="list-inline-item"><code class="notranslate">製品</code></li>
<li class="list-inline-item"><code class="notranslate">プログレッシブ</code></li>
<li class="list-inline-item"><code class="notranslate">プル</code></li>
<li class="list-inline-item"><code class="notranslate">プルデンシャル</code></li>
<li class="list-inline-item"><code class="notranslate">PWC</code></li>
<!--<li class="list-inline-item"><code class="notranslate">クエスト</code></li>-->
<li class="list-inline-item"><code class="notranslate">QVC</code></li>
<li class="list-inline-item"><code class="notranslate">レッドストーン</code></li>
<li class="list-inline-item"><code class="notranslate">リライアンス</code></li>
<li class="list-inline-item"><code class="notranslate">レックスロス</code></li>
<li class="list-inline-item"><code class="notranslate">リコー</code></li>
<li class="list-inline-item"><code class="notranslate">RMIT</code></li>
<li class="list-inline-item"><code class="notranslate">ロシェ</code></li>
<li class="list-inline-item"><code class="notranslate">ロジャース</code></li>
<li class="list-inline-item"><code class="notranslate">RWE</code></li>
<li class="list-inline-item"><code class="notranslate">セーフティ</code></li>
<li class="list-inline-item"><code class="notranslate">サクラ</code></li>
<li class="list-inline-item"><code class="notranslate">サムスン</code></li>
<li class="list-inline-item"><code class="notranslate">サンドビック</code></li>
<li class="list-inline-item"><code class="notranslate">サンドビックコロマント</code></li>
<li class="list-inline-item"><code class="notranslate">サノフィ</code></li>
<li class="list-inline-item"><code class="notranslate">SAP</code></li>
<li class="list-inline-item"><code class="notranslate">サクソ</code></li>
<li class="list-inline-item"><code class="notranslate">SBI</code></li>
<!--<li class="list-inline-item"><code class="notranslate">SBS</code></li>-->
<li class="list-inline-item"><code class="notranslate">SCA</code></li>
<li class="list-inline-item"><code class="notranslate">SCB</code></li>
<li class="list-inline-item"><code class="notranslate">シェフラー</code></li>
<li class="list-inline-item"><code class="notranslate">シュミット</code></li>
<li class="list-inline-item"><code class="notranslate">シュワルツ</code></li>
<li class="list-inline-item"><code class="notranslate">スジョンソン</code></li>
<li class="list-inline-item"><code class="notranslate">スコ</code></li>
<li class="list-inline-item"><code class="notranslate">シート</code></li>
<li class="list-inline-item"><code class="notranslate">セナー</code></li>
<li class="list-inline-item"><code class="notranslate">シーズ</code></li>
<li class="list-inline-item"><code class="notranslate">セブン</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">seek</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">sharp</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">スカイ</code></li>
<li class="list-inline-item"><code class="notranslate">スカイプ</code></li>
<li class="list-inline-item"><code class="notranslate">スマート</code></li>
<li class="list-inline-item"><code class="notranslate">SNCF</code></li>
<li class="list-inline-item"><code class="notranslate">ソフトバンク</code></li>
<li class="list-inline-item"><code class="notranslate">捜狐</code></li>
<li class="list-inline-item"><code class="notranslate">ソニー</code></li>
<li class="list-inline-item"><code class="notranslate">シュピーゲル</code></li>
<li class="list-inline-item"><code class="notranslate">シュターダ</code></li>
<li class="list-inline-item"><code class="notranslate">ステープルズ</code></li>
<li class="list-inline-item"><code class="notranslate">スター</code></li>
<li class="list-inline-item"><code class="notranslate">スターハブ</code></li>
<li class="list-inline-item"><code class="notranslate">ステートバンク</code></li>
<li class="list-inline-item"><code class="notranslate">ステートファーム</code></li>
<li class="list-inline-item"><code class="notranslate">スタトオイル</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcグループ</code></li>
<li class="list-inline-item"><code class="notranslate">スズキ</code></li>
<li class="list-inline-item"><code class="notranslate">スウォッチ</code></li>
<li class="list-inline-item"><code class="notranslate">スイフトカバー</code></li>
<li class="list-inline-item"><code class="notranslate">シマンテック</code></li>
<li class="list-inline-item"><code class="notranslate">タオバオ</code></li>
<li class="list-inline-item"><code class="notranslate">ターゲット</code></li>
<li class="list-inline-item"><code class="notranslate">タタモーターズ</code></li>
<li class="list-inline-item"><code class="notranslate">tdk</code></li>
<li class="list-inline-item"><code class="notranslate">テレシティ</code></li>
<li class="list-inline-item"><code class="notranslate">テレフォニカ</code></li>
<li class="list-inline-item"><code class="notranslate">テマセク</code></li>
<li class="list-inline-item"><code class="notranslate">テバ</code></li>
<li class="list-inline-item"><code class="notranslate">ティファニー</code></li>
<li class="list-inline-item"><code class="notranslate">TJX</code></li>
<li class="list-inline-item"><code class="notranslate">東レ</code></li>
<li class="list-inline-item"><code class="notranslate">東芝</code></li>
<li class="list-inline-item"><code class="notranslate">合計</code></li>
<li class="list-inline-item"><code class="notranslate">トヨタ</code></li>
<li class="list-inline-item"><code class="notranslate">トラベルチャンネル</code></li>
<li class="list-inline-item"><code class="notranslate">トラベラーズ</code></li>
<li class="list-inline-item"><code class="notranslate">TUI</code></li>
<li class="list-inline-item"><code class="notranslate">テレビ</code></li>
<li class="list-inline-item"><code class="notranslate">UBS</code></li>
<li class="list-inline-item"><code class="notranslate">ユニコム</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">UPS</code></li>
<li class="list-inline-item"><code class="notranslate">ヴァンガード</code></li>
<li class="list-inline-item"><code class="notranslate">ベリサイン</code></li>
<li class="list-inline-item"><code class="notranslate">ヴィグ</code></li>
<li class="list-inline-item"><code class="notranslate">バイキング</code></li>
<li class="list-inline-item"><code class="notranslate">ヴァージン</code></li>
<li class="list-inline-item"><code class="notranslate">ビザ</code></li>
<li class="list-inline-item"><code class="notranslate">ヴィスタ</code></li>
<li class="list-inline-item"><code class="notranslate">ビスタプリント</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">フォルクスワーゲン</code></li>
<li class="list-inline-item"><code class="notranslate">ボルボ</code></li>
<li class="list-inline-item"><code class="notranslate">ウォルマート</code></li>
<li class="list-inline-item"><code class="notranslate">ウォルター</code></li>
<li class="list-inline-item"><code class="notranslate">ウェザーチャンネル</code></li>
<li class="list-inline-item"><code class="notranslate">ウェーバー</code></li>
<li class="list-inline-item"><code class="notranslate">ウィアー</code></li>
<li class="list-inline-item"><code class="notranslate">ウィリアムヒル</code></li>
<li class="list-inline-item"><code class="notranslate">Windows</code></li>
<li class="list-inline-item"><code class="notranslate">WME</code></li>
<li class="list-inline-item"><code class="notranslate">Wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">Woodside</code></li>
<li class="list-inline-item"><code class="notranslate">WTC</code></li>
<li class="list-inline-item"><code class="notranslate">Xbox</code></li>
<li class="list-inline-item"><code class="notranslate">Xerox</code></li>
<li class="list-inline-item"><code class="notranslate">Xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">Yahoo! </code></li>
<li class="list-inline-item"><code class="notranslate">ヤマシュン</code></li>
<li class="list-inline-item"><code class="notranslate">Yandex</code></li>
<li class="list-inline-item"><code class="notranslate">ヨドバシ</code></li>
<li class="list-inline-item"><code class="notranslate">YouTube</code></li>
<li class="list-inline-item"><code class="notranslate">Zappos</code></li>
<li class="list-inline-item"><code class="notranslate">Zara</code></li>
<li class="list-inline-item"><code class="notranslate">Zippo</code></li>
</ul>

2025 年 3 月 18 日現在、以下のフランス海外領土もこのリスト ([このGitHubリクエストに従って](https://github.com/forwardemail/forwardemail.net/issues/327)) に追加されました。

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

2025 年 7 月 8 日現在、以下のヨーロッパ固有の国が追加されました。

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

スパム活動が多いため、`cz`、`ru`、および `ua` は特に含めませんでした。

### 許可リストの基準は何ですか？ {#what-is-your-allowlist-criteria}

当社では [ドメイン名拡張子はデフォルトで許可リストに登録される](#what-domain-name-extensions-are-allowlisted-by-default) の静的リストを保有しており、さらに以下の厳格な基準に基づいて、動的でキャッシュされたローリング許可リストも維持しています。

* 送信者のルートドメインは、[無料プランで提供しているリストに一致するドメイン名拡張子](#what-domain-name-extensions-can-be-used-for-free)（`biz`と`info`を含む）である必要があります。また、`xyz.gov.au`や`xyz.edu.au`など、`edu`、`gov`、`mil`の部分一致も含まれます。
* 送信者のルートドメインは、[傘の人気ランキング](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")（以下「UPL」）の解析結果における一意のルートドメイン上位10万件以内である必要があります。
* 送信者のルートドメインは、過去7日間のUPLのうち少なくとも4日間に出現する一意のルートドメインの上位5万件以内である必要があります（約50%以上）。
* 送信者のルートドメインは、Cloudflareによってアダルトコンテンツまたはマルウェアとして分類されている[分類された](https://radar.cloudflare.com/categorization-feedback/)であってはなりません。 * 送信者のルートドメインには、A レコードまたは MX レコードのいずれかが設定されている必要があります。
* 送信者のルートドメインには、A レコード、MX レコード、`biz`0 または `biz`1 を指定した DMARC レコード、または `biz`2 または `biz`3 を指定した SPF レコードのいずれかが設定されている必要があります。

この基準が満たされた場合、送信者のルートドメインは7日間キャッシュされます。自動ジョブは毎日実行されるため、これは毎日更新されるローリングホワイトリストキャッシュです。

自動化されたジョブは、過去 7 日間の UPL のメモリ内データをダウンロードし、解凍してから、上記の厳密な基準に従ってメモリ内データを解析します。

Google、Yahoo、Microsoft、Amazon、Meta、Twitter、Netflix、Spotify など、この記事の執筆時点で人気のドメインももちろん含まれています。

許可リストに登録されていない送信者の場合、FQDNルートドメインまたはIPアドレスから初めてメールを送信すると、[レート制限](#do-you-have-rate-limiting)と[グレーリスト](#do-you-have-a-greylist)が設定されます。これはメールの標準規格として採用されている標準的な方法であることにご注意ください。ほとんどのメールサーバークライアントは、レート制限またはグレーリストエラー（例：421または4xxレベルのエラーステータスコード）を受信すると、再試行を試みます。

**`a@gmail.com`、`b@xyz.edu`、`c@gov.au` などの特定の送信者は、[拒否リスト](#do-you-have-a-denylist) になる可能性があることに注意してください** (たとえば、これらの送信者からのスパム、フィッシング、またはマルウェアを自動的に検出した場合など)。

### 無料で使用できるドメイン名拡張子 {#what-domain-name-extensions-can-be-used-for-free}

2023 年 3 月 31 日より、ユーザーとサービスを保護するために、新しい包括的なスパム ルールを施行しました。

この新しいルールにより、無料プランでは次のドメイン名拡張子のみ使用できるようになります。

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">で</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">つまり</code></li>
<li class="list-inline-item"><code class="notranslate">イル</code></li>
<li class="list-inline-item"><code class="notranslate">イム</code></li>
<li class="list-inline-item"><code class="notranslate">イン</code></li>
<li class="list-inline-item"><code class="notranslate">イオ</code></li>
<li class="list-inline-item"><code class="notranslate">イル</code></li>
<li class="list-inline-item"><code class="notranslate">イオ</code></li>
<li class="list-inline-item"><code class="notranslate">イル</code></li>
<li class="list-inline-item"><code class="notranslate">イエ</code></li>
<li class="list-inline-item"><code class="notranslate">イエ</code></li> class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">イギリス</code></li>
<li class="list-inline-item"><code class="notranslate">アメリカ</code></li>
<li class="list-inline-item"><code class="notranslate">ウズ</code></li>
<li class="list-inline-item"><code class="notranslate">ベトナム</code></li>
<li class="list-inline-item"><code class="notranslate">ベトナム</code></li>
<li class="list-inline-item"><code class="notranslate">ベトナム</code></li>
<li class="list-inline-item"><code class="notranslate">ベトナム</code></li>
<li class="list-inline-item"><code class="notranslate">ベトナム</code></li>
<li class="list-inline-item"><code class="notranslate">アメリカ西部</code></li>
<li class="list-inline-item"><code class="notranslate">アメリカ西部</code></li>
<li class="list-inline-item"><code class="notranslate">アメリカ西部</code></li>
<li class="list-inline-item"><code class="notranslate">キプロス</code></li>
<li class="list-inline-item"><code class="notranslate">ザ</code></li>
</ul>

### グレーリストはありますか？{#do-you-have-a-greylist}

はい、非常に緩い[電子メールのグレーリスト](https://en.wikipedia.org/wiki/Greylisting_\(email\)ポリシーを採用しています。グレーリストは許可リストに登録されていない送信者にのみ適用され、キャッシュに30日間保存されます。

新規送信者については、最初のリクエストの到着時刻を値として設定したキーをRedisデータベースに30日間保存します。その後、再試行ステータスコード450でメールを拒否し、5分経過後にのみ送信を許可します。

最初の到着時間から 5 分間正常に待機できた場合、電子メールは受け入れられ、この 450 ステータス コードは受信されません。

キーはFQDNルートドメインまたは送信者のIPアドレスのいずれかで構成されます。つまり、グレーリストを通過するサブドメインはルートドメインでも通過し、その逆も同様です（これが「非常に緩い」ポリシーの意味です）。

例えば、`example.com` からのメールよりも先に `test.example.com` からのメールが届いた場合、`test.example.com` および/または `example.com` からのメールは、接続の最初の到着時刻から 5 分間待機する必要があります。`test.example.com` と `example.com` の両方に 5 分間の待機時間を設定することはありません（グレーリストポリシーはルートドメインレベルで適用されます）。

グレーリストは、[許可リスト](#do-you-have-an-allowlist) 上の送信者 (執筆時点では Meta、Amazon、Netflix、Google、Microsoft など) には適用されないことに注意してください。

### ブラックリストはありますか？{#do-you-have-a-denylist}

はい、当社は独自のブラックリストを運用しており、検出されたスパムや悪意のあるアクティビティに基づいて、リアルタイムで自動更新および手動で更新しています。

また、<http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> で UCEPROTECT レベル 1 のブラックリストからすべての IP アドレスを 1 時間ごとに取得し、7 日間の有効期限でブラックリストに追加します。

拒否リストに見つかった送信者は、[許可リストに登録されていない](#do-you-have-an-allowlist) の場合、421 エラー コード (送信者に後で再試行するように指示) を受け取ります。

554 ステータス コードの代わりに 421 ステータス コードを使用すると、潜在的な誤検知をリアルタイムで軽減でき、次の試行でメッセージを正常に配信できるようになります。

**これは他のメールサービスとは異なる設計です**。**ブロックリストに登録されると、完全に永続的な障害が発生します。送信者にメッセージの再試行を依頼することは多くの場合困難です（特に大規模な組織の場合）。そのため、このアプローチでは、最初のメール送信から約5日間、送信者、受信者、または弊社のいずれかが介入して問題を軽減（ブラックリストの削除をリクエスト）することができます。

すべてのブラックリスト削除リクエストは、管理者によってリアルタイムで監視されます (たとえば、繰り返し発生する誤検知を管理者が永続的にブラックリストに追加できるようにするため)。

ブラックリストの削除リクエストは <https://forwardemail.net/denylist>. でリクエストできます。有料ユーザーの場合、ブラックリストの削除リクエストは即座に処理されますが、無料ユーザーは管理者がリクエストを処理するまで待つ必要があります。

スパムまたはウイルス コンテンツを送信していると検出された送信者は、次の方法で拒否リストに追加されます。

1. [初期メッセージのフィンガープリント](#how-do-you-determine-an-email-fingerprint) は、「信頼できる」送信者（例：`gmail.com`、`microsoft.com`、`apple.com`）からのスパムメールまたはブロックリストメールが検出されると、グレーリストに登録されます。
* 送信者が許可リストに登録されている場合、メッセージは1時間グレーリストに登録されます。
* 送信者が許可リストに登録されていない場合、メッセージは6時間グレーリストに登録されます。
2. 送信者とメッセージの情報からブラックリストキーを解析し、これらのキーごとにカウンターを作成し（まだ存在しない場合）、1ずつ増加させて24時間キャッシュします。
* 許可リストに登録されている送信者の場合：
* エンベロープの「MAIL FROM」メールアドレスが SPF に合格または不合格で、かつ [ポストマスターのユーザー名](#what-are-postmaster-addresses) または [返信不可のユーザー名](#what-are-no-reply-addresses) でなかった場合、キーを追加します。
* 「From」ヘッダーがホワイトリストに登録されている場合、SPFまたはDKIMに合格し調整済みの状態であれば、「From」ヘッダーのメールアドレスのキーを追加します。
* 「From」ヘッダーがホワイトリストに登録されていない場合は、「From」ヘッダーのメールアドレスとそのルート解析済みドメイン名のキーを追加します。
* ホワイトリストに登録されていない送信者の場合：
* SPFに合格した場合、エンベロープ「MAIL FROM」メールアドレスのキーを追加します。
* 「From」ヘッダーがホワイトリストに登録されている場合、SPFまたはDKIMに合格し調整済みの状態であれば、「From」ヘッダーのメールアドレスのキーを追加します。
* 「From」ヘッダーがホワイトリストに登録されていない場合は、「From」ヘッダーのメールアドレスとそのルート解析済みドメイン名のキーを追加します。
* 送信者のリモートIPアドレスのキーを追加します。
* 送信者のIPアドレスから逆引きして解決されたクライアントホスト名のキーを追加します（存在する場合）。
* クライアントが解決したホスト名のルートドメインに対応するキーを追加します（ルートドメインが存在し、クライアントが解決したホスト名と異なる場合）。
3. 許可リストに登録されていない送信者とキーのカウンタが5に達した場合、そのキーは30日間ブラックリストに登録され、不正使用対策チームにメールが送信されます。これらの数値は変更される可能性があり、不正使用の監視に伴い更新情報がこのページに反映されます。
4. 許可リストに登録されている送信者とキーのカウンタが10に達した場合、そのキーは7日間ブラックリストに登録され、不正使用対策チームにメールが送信されます。これらの数値は変更される可能性があり、不正使用の監視に伴い更新情報がこのページに反映されます。

> **注:** 近い将来、レピュテーションモニタリングを導入する予定です。レピュテーションモニタリングでは、送信者をブラックリストに登録するタイミングを、パーセンテージのしきい値に基づいて計算します（前述の基本的なカウンターとは対照的です）。

### レート制限はありますか？ {#do-you-have-rate-limiting}

送信者のレート制限は、送信者のIPアドレスの逆PTRルックアップから解析されたルートドメインに基づいて行われます。それでも結果が得られない場合は、送信者のIPアドレスのみが使用されます。以下では、これを`Sender`と呼びます。

当社の MX サーバーには、[暗号化されたIMAPストレージ](/blog/docs/best-quantum-safe-encrypted-email-service) で受信される受信メールの毎日の制限があります。

* 受信メールのレート制限を個々のエイリアス（例：`you@yourdomain.com`）ごとに行うのではなく、エイリアスのドメイン名（例：`yourdomain.com`）ごとにレート制限を行います。これにより、`Senders` がドメイン全体のすべてのエイリアスの受信トレイに一度に大量のメールを流してしまうことを防ぎます。
* 受信者に関わらず、サービス全体のすべての `Senders` に適用される一般的な制限があります。
* 信頼できる情報源として「信頼できる」と判断された `Senders`（例：`gmail.com`、`microsoft.com`、`apple.com`）は、1日あたり100GBの送信に制限されます。
* [許可リストに登録](#do-you-have-an-allowlist) である `Senders` は、1 日あたり 10 GB の送信に制限されています。
* その他すべての `yourdomain.com`0 は、1 日あたり 1 GB または 1,000 件のメッセージ送信に制限されています。
* `yourdomain.com`1 および `yourdomain.com`2 には、1 日あたり 1 GB または 1,000 件のメッセージ送信という特定の制限があります。

MX サーバーは、レート制限を通じて 1 人以上の受信者に転送されるメッセージも制限しますが、これは `Senders` にのみ適用され、[許可リスト](#do-you-have-an-allowlist) には適用されません。

* 1時間あたり、`Sender`で解決されたFQDNルートドメイン（または）`Sender`リモートIPアドレス（逆PTRが利用できない場合）ごとに、およびエンベロープ受信者ごとに最大100接続まで許可します。レート制限用のキーは、暗号ハッシュとしてRedisデータベースに保存されます。

* 弊社のシステムを通じて電子メールを送信する場合は、すべての IP アドレスに対して逆 PTR が設定されていることを確認してください (そうでない場合、送信元の固有の FQDN ルート ドメインまたは IP アドレスごとにレート制限が行われます)。

* Amazon SES などの一般的なシステムを介して送信する場合、(この記事の執筆時点では) Amazon SES が許可リストに含まれているため、レート制限は発生しないことに注意してください。

* `test.abc.123.example.com` などのドメインから送信する場合、レート制限は `example.com` に適用されます。多くのスパマーは、FQDN ルートドメインではなく、ホスト名のみにレート制限をかける一般的なスパムフィルターを回避するために、数百ものサブドメインを使用しています。

* レート制限を超える `Senders` は 421 エラーで拒否されます。

当社の IMAP および SMTP サーバーでは、エイリアスが同時に `60` を超える接続を持つことを制限しています。

当社の MX サーバーは、[非許可リスト](#do-you-have-an-allowlist) 送信者が 10 を超える同時接続を確立することを制限します (カウンターのキャッシュ有効期限は 3 分で、これは 3 分のソケット タイムアウトを反映します)。

### バックスキャッターからどのように保護しますか？ {#how-do-you-protect-against-backscatter}

誤った宛先へのバウンスやバウンス スパム (「[後方散乱](https://en.wikipedia.org/wiki/Backscatter_\(email\)」と呼ばれます) は、送信者の IP アドレスに悪い評価を与える可能性があります。

バックスキャッターを防ぐために 2 つの手順を実行します。詳細については、以下のセクション [既知のMAIL FROMスパマーからのバウンスを防ぐ](#prevent-bounces-from-known-mail-from-spammers) と [不要な反射を防ぎ、後方散乱から保護する](#prevent-unnecessary-bounces-to-protect-against-backscatter) を参照してください。

### 既知のMAIL FROMスパマーからのバウンスを防止します {#prevent-bounces-from-known-mail-from-spammers}

私たちは、1 時間ごとに <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> で [Backscatter.org](https://www.backscatterer.org/) ([UCEPROTECT](https://www.uceprotect.net/) を使用) からリストを取得し、それを Redis データベースにフィードします (尊重する必要がある IP が削除された場合に備えて、事前に差異も比較します)。

MAIL FROM が空白の場合、または [郵便局長の住所](#what-are-postmaster-addresses) (電子メールの @ の前の部分) のいずれかと等しい場合 (大文字と小文字は区別されません)、送信者の IP がこのリストのいずれかと一致するかどうかを確認します。

送信者のIPアドレスがリストに載っている場合（[許可リスト](#do-you-have-an-allowlist)には載っていない場合）、`The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`というメッセージと共に554エラーを送信します。送信者がBackscattererリストと許可リストの両方に登録されている場合は、アラートが通知され、必要に応じて問題を解決します。

このセクションで説明する手法は、<https://www.backscatterer.org/?target=usage> の「セーフ モード」推奨事項に準拠しています。セーフ モードでは、特定の条件がすでに満たされている場合にのみ送信元 IP をチェックします。

### 不要なバウンスを防ぎ、バックスキャッタリングから保護します {#prevent-unnecessary-bounces-to-protect-against-backscatter}

バウンスは、受信者へのメール転送が完全に失敗し、メールが再試行されないことを示すメールです。

Backscatterer リストに掲載される一般的な理由は、誤った宛先へのバウンスやバウンス スパムであるため、いくつかの方法でこれを防ぐ必要があります。

1. ステータス コード エラーが 500 以上発生した場合にのみ送信します (メールの転送が失敗した場合、たとえば Gmail が 500 レベルのエラーで応答した場合など)。

2. 送信は一度だけ行います（重複送信を防ぐため、計算されたバウンスフィンガープリントキーを使用し、キャッシュに保存します）。バウンスフィンガープリントとは、メッセージのフィンガープリントと、バウンスアドレスとそのエラーコードのハッシュを組み合わせたキーです。メッセージフィンガープリントの計算方法の詳細については、[指紋採取](#how-do-you-determine-an-email-fingerprint) のセクションをご覧ください。正常に送信されたバウンスフィンガープリントは、Redis キャッシュで7日後に有効期限切れとなります。

3. MAIL FROM および/または From が空白でなく、[ポストマスターのユーザー名](#what-are-postmaster-addresses) (電子メールの @ の前の部分) が含まれていない (大文字と小文字は区別されません) 場合にのみ送信されます。

4. 元のメッセージに次のいずれかのヘッダー（大文字と小文字は区別されません）が含まれている場合は送信しません。

* `auto-submitted` のヘッダーの値が `no` と等しくありません。
* `x-auto-response-suppress` のヘッダー（値が `dr`、`autoreply`、`auto-reply`、`auto_reply`、または `all`）
* `list-id`、`list-subscribe`、`no`0、`no`1、`no`2、`no`3、`no`4、`no`5、`no`6、または `no`7 のヘッダー（値に関係なく）。
* `no`8 のヘッダー。値は `no`9、`x-auto-response-suppress`0、`x-auto-response-suppress`1、`x-auto-response-suppress`2、または `x-auto-response-suppress`3 です。

5. MAIL FROM または From のメール アドレスが `+donotreply`、`-donotreply`、`+noreply`、または `-noreply` で終わる場合は送信されません。

6. 送信元メールアドレスのユーザー名部分が `mdaemon` で、大文字と小文字を区別しないヘッダーが `X-MDDSN-Message` の場合は送信されません。

7. `multipart/report` に大文字と小文字を区別しない `content-type` ヘッダーがあった場合は送信しません。

### メールのフィンガープリントをどのように特定するか {#how-do-you-determine-an-email-fingerprint}

電子メールのフィンガープリントは、電子メールの一意性を判別し、重複したメッセージが配信され、[重複バウンス](#prevent-unnecessary-bounces-to-protect-against-backscatter) が送信されるのを防ぐために使用されます。

指紋は次のリストから計算されます。

* クライアントが解決したFQDNホスト名またはIPアドレス
* `Message-ID`ヘッダー値（存在する場合）
* `Date`ヘッダー値（存在する場合）
* `From`ヘッダー値（存在する場合）
* `To`ヘッダー値（存在する場合）
* `Cc`ヘッダー値（存在する場合）
* `Subject`ヘッダー値（存在する場合）
* `Body`ヘッダー値（存在する場合）

### 25番以外のポートにメールを転送できますか（例：ISPがポート25をブロックしている場合）{#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

はい、2020年5月5日よりこの機能を追加しました。現在、この機能はエイリアスではなくドメインごとにご利用いただけます。エイリアスごとにご利用いただく必要がある場合は、ご要望をお知らせください。

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
強化されたプライバシー保護：
</strong>
<span>
有料プラン（強化されたプライバシー保護機能付き）をご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i>ドメイン</a>にアクセスし、ドメインの横にある「設定」をクリックしてから「設定」をクリックしてください。有料プランの詳細については、<a class="alert-link" rel="noopener noreferrer" href="/private-business-email">料金</a>ページをご覧ください。それ以外の場合は、以下の手順に従ってください。
</span>
</div>

無料プランをご利用の場合は、以下に示すように新しい DNS <strong class="notranslate">TXT</strong> レコードを追加しますが、ポートを 25 から任意のポートに変更します。

たとえば、`example.com` に送信されるすべてのメールをエイリアス受信者の SMTP ポート 25 ではなく 1337 に転送する場合は、次のようにします。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
カスタムポート転送設定の最も一般的なシナリオは、example.com 宛てのすべてのメールを、SMTP 標準のポート 25 以外の example.com のポートに転送したい場合です。これを設定するには、次の <strong class="notranslate">TXT</strong> キャッチオールレコードを追加するだけです。
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Gmailエイリアスのプラス記号（+）をサポートしていますか？{#does-it-support-the-plus--symbol-for-gmail-aliases}

はい、もちろんです。

### サブドメインをサポートしていますか？ {#does-it-support-sub-domains}

はい、もちろんです。名前/ホスト/エイリアスとして「@」、「.」、または空白を使用する代わりに、サブドメイン名を値として使用します。

`foo.example.com` でメールを転送する場合は、DNS 設定 (MX レコードと <strong class="notranslate">TXT</strong> レコードの両方) で、名前/ホスト/エイリアス値として `foo` を入力します。

### メールのヘッダーを転送しますか？{#does-this-forward-my-emails-headers}

はい、もちろんです。

### これは十分にテストされた{#is-this-well-tested}

はい、[アヴァ](https://github.com/avajs/ava) で記述されたテストがあり、コード カバレッジもあります。

### SMTP応答メッセージとコードを渡しますか？{#do-you-pass-along-smtp-response-messages-and-codes}

はい、もちろんです。例えば、`hello@example.com` にメールを送信し、`user@gmail.com` に転送するように登録されている場合、プロキシサーバー「mx1.forwardemail.net」または「mx2.forwardemail.net」ではなく、SMTPサーバー「gmail.com」からのSMTP応答メッセージとコードが返されます。

### どのようにしてスパムメールを防ぎ、メール転送の評判を良くしますか？ {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

上記の [メール転送システムはどのように機能しますか](#how-does-your-email-forwarding-system-work)、[メール配信の問題にどのように対処しますか](#how-do-you-handle-email-delivery-issues)、および [IPアドレスがブロックされたらどう対処しますか？](#how-do-you-handle-your-ip-addresses-becoming-blocked) に関するセクションを参照してください。

### ドメイン名のDNSルックアップをどのように実行しますか？ {#how-do-you-perform-dns-lookups-on-domain-names}

オープンソースソフトウェアプロジェクト :tangerine: [タンジェリン](https://github.com/forwardemail/tangerine) を作成し、DNSルックアップに使用しています。デフォルトのDNSサーバーは`1.1.1.1`と`1.0.0.1`で、DNSクエリはアプリケーション層の[DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（「DoH」）を介して実行されます。

:tangerine: [タンジェリン](https://github.com/tangerine) は、[デフォルトで CloudFlare のプライバシー重視のコンシューマー DNS サービス][cloudflare-dns] を使用します。

## アカウントと請求 {#account-and-billing}

### 有料プランには返金保証がありますか？ {#do-you-offer-a-money-back-guarantee-on-paid-plans}

はい！プラン開始日から30日以内にアカウントをアップグレード、ダウングレード、またはキャンセルすると、自動的に払い戻しが行われます。これは初めてご利用になるお客様のみに適用されます。

### プランを切り替えた場合、差額を日割り計算して返金してもらえますか？{#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

プラン変更の際、差額の計算や返金は行いません。既存のプランの有効期限からの残存期間を、新しいプランの最も近い期間（月単位で切り捨て）に換算します。

有料プランを初めて開始してから 30 日以内に有料プラン間でアップグレードまたはダウングレードした場合、既存のプランの全額が自動的に返金されますのでご了承ください。

### このメール転送サービスを「フォールバック」または「フォールオーバー」MXサーバーとして使用できますか？{#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

いいえ、一度に使用できるメール交換サーバーは1つだけなので、推奨されません。優先度の設定ミスやメールサーバーがMX交換優先度チェックを尊重していないため、フォールバックは通常再試行されません。

### 特定のエイリアスを無効にすることはできますか？ {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
有料プランをご利用の場合は、<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">マイアカウント > <i class="fa fa-angle-right"></i> ドメイン</a> > <i class="fa fa-angle-right"></i> エイリアス > <i class="fa fa-angle-right"></i> エイリアスの編集 > <i class="fa fa-angle-right"></i> 「アクティブ」チェックボックスをオフにして <i class="fa fa-angle-right"></i> 続行してください。
</span>
</div>

はい、DNS <strong class="notranslate">TXT</strong> レコードを編集し、エイリアスの前に 1 つ、2 つ、または 3 つの感嘆符を付けるだけです (下記参照)。

「:」マッピングは保持しておく必要があります。これは、これをオフにする場合に必要になります (有料プランのいずれかにアップグレードする場合、インポートにも使用されます)。

**静かな拒否 (送信者にはメッセージが正常に送信されたように見えますが、実際にはどこにも送信されません) (ステータス コード `250`):** エイリアスの先頭に「!」 (感嘆符 1 つ) を付けると、このアドレスに送信しようとした送信者に成功ステータス コード `250` が返されますが、メール自体はどこにも送信されません (例: ブラックホールまたは `/dev/null`)。

**ソフト拒否の場合 (ステータス コード `421`):** エイリアスの先頭に「!!」(二重感嘆符) を付けると、このアドレスに送信しようとした送信者に `421` のソフト エラー ステータス コードが返され、メールは拒否されて返送されるまで最大 5 日間再試行されることがよくあります。

**ハード拒否の場合 (ステータス コード `550`):** エイリアスの先頭に「!!!」(3 つの感嘆符) を付けると、このアドレスに送信しようとした送信者に `550` の永続的なエラー ステータス コードが返され、メールは拒否されてバウンスされます。

たとえば、`alias@example.com` に送信されるすべてのメールが `user@gmail.com` に流れないようにし、拒否してバウンスするようにしたい場合 (たとえば、感嘆符を 3 つ使用します)。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
転送先の受信者のアドレスを「nobody@forwardemail.net」に書き換えることもできます。これにより、以下の例のように、nobody にルーティングされます。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
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
セキュリティを強化したい場合は、「:user@gmail.com」（または「:nobody@forwardemail.net」）の部分を削除し、「!!!alias」のみにすることもできます（以下の例を参照）。
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### メールを複数の受信者に転送できますか？ {#can-i-forward-emails-to-multiple-recipients}

はい、もちろんです。<strong class="notranslate">TXT</strong> レコードに複数の受信者を指定するだけです。

たとえば、`hello@example.com` に送信されるメールを `user+a@gmail.com` と `user+b@gmail.com` に転送する場合、<strong class="notranslate">TXT</strong> レコードは次のようになります。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

または、次のように 2 つの別々の行で指定することもできます。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

それはあなた次第です！

### グローバルキャッチオール受信者を複数設定できますか？ {#can-i-have-multiple-global-catch-all-recipients}

はい、可能です。<strong class="notranslate">TXT</strong> レコードに複数のグローバルキャッチオール受信者を指定するだけです。

たとえば、`*@example.com` (アスタリスクはワイルドカード、つまりキャッチオールを意味します) に送信されるすべてのメールを `user+a@gmail.com` と `user+b@gmail.com` に転送する場合、<strong class="notranslate">TXT</strong> レコードは次のようになります。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

または、次のように 2 つの別々の行で指定することもできます。

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>名前/ホスト/エイリアス</th>
<th class="text-center">TTL</th>
<th>タイプ</th>
<th>応答/値</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@"、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@、"."、または空白</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

それはあなた次第です！

### エイリアスごとに転送できるメールアドレスの数に上限はありますか？ {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

はい、デフォルトの上限は10です。これは、ドメイン名にエイリアスが10個しか設定できないという意味ではありません。エイリアスは必要な数だけ（無制限に）設定できます。つまり、1つのエイリアスを10個の固有のメールアドレスにのみ転送できるということです。例えば、`hello:user+1@gmail.com`、`hello:user+2@gmail.com`、`hello:user+3@gmail.com`、…（1～10）のように設定できます。そして、`hello@example.com`宛のメールは、`user+1@gmail.com`、`user+2@gmail.com`、`user+3@gmail.com`、…（1～10）に転送されます。

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ヒント:
</strong>
<span>
エイリアスごとに10人以上の受信者が必要ですか？ メールでご連絡ください。アカウントの上限数を増やすお手伝いをさせていただきます。
</span>
</div>

### メールを再帰的に転送できますか？{#can-i-recursively-forward-emails}

はい、可能です。ただし、上限は必ず守ってください。`hello:linus@example.com`と`linus:user@gmail.com`がある場合、`hello@example.com`宛のメールは`linus@example.com`と`user@gmail.com`に転送されます。上限を超えてメールを再帰的に転送しようとするとエラーが発生することにご注意ください。

### 私の許可なくメール転送を登録または解除することはできますか？{#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

MXレコードと<strong class="notranslate">TXT</strong>レコードによる検証を使用しています。そのため、このサービスのMXレコードと<strong class="notranslate">TXT</strong>レコードを追加すると登録完了となります。削除すると登録解除となります。ドメインとDNS管理の所有権はお客様にありますので、第三者がそれらにアクセスした場合、問題が発生します。

### 無料なのはなぜですか？ {#how-is-it-free}

Forward Email は、オープンソース開発、効率的なインフラストラクチャ、およびサービスをサポートするオプションの有料プランの組み合わせにより、無料レベルを提供します。

無料レベルは以下によってサポートされています:

1. **オープンソース開発**: 当社のコードベースはオープンソースであり、コミュニティの貢献と透明性の高い運用が可能です。

2. **効率的なインフラストラクチャ**: 最小限のリソースで電子メールの転送を処理できるようにシステムを最適化しました。

3. **有料プレミアムプラン**: SMTP 送信、IMAP 受信、強化されたプライバシー オプションなどの追加機能が必要なユーザーは、有料プランに加入します。

4. **合理的な使用制限**: 無料レベルには、不正使用を防ぐための公正使用ポリシーがあります。

> \[!NOTE]
> 基本的なメール転送機能は無料で提供しながら、より高度なニーズを持つユーザー向けにプレミアム機能を提供することに尽力しています。

> \[!TIP]
> 当社のサービスにご満足いただけましたら、継続的な開発とメンテナンスをサポートするために有料プランへのアップグレードをご検討ください。

### メールの最大サイズ制限はいくらですか？ {#what-is-the-max-email-size-limit}

デフォルトでは、コンテンツ、ヘッダー、添付ファイルを含めて50MBのサイズ制限が設定されています。GmailやOutlookなどのサービスでは25MBのサイズ制限しか設定されていないため、これらのプロバイダーのアドレスに送信する際に制限を超えるとエラーメッセージが表示されます。

ファイル サイズの制限を超えた場合、適切な応答コードを含むエラーが返されます。

### メールのログを保存しますか？{#do-you-store-logs-of-emails}

いいえ、[エラーの例外](#do-you-store-error-logs) および [送信SMTP](#do-you-support-sending-email-with-smtp) を使用してディスクに書き込んだり、ログを保存したりすることはありません ([プライバシーポリシー](/privacy) を参照)。

すべてはメモリ内および [ソースコードはGitHubにあります](https://github.com/forwardemail) で実行されます。

### エラーログを保存しますか？{#do-you-store-error-logs}

**はい。[マイアカウント → ログ](/my-account/logs) または [マイアカウント → ドメイン](/my-account/domains) の下にあるエラー ログにアクセスできます。**

2023 年 2 月現在、`4xx` および `5xx` SMTP 応答コードのエラー ログを 7 日間保存します。これには、SMTP エラー、エンベロープ、および電子メール ヘッダーが含まれます (電子メールの本文や添付ファイルは保存されません)。

エラーログを利用することで、重要なメールが漏れていないか確認し、[あなたのドメイン](/my-account/domains) のスパム誤検知を軽減できます。また、エラーログには Webhook エンドポイントのレスポンスが含まれているため、[メールウェブフック](#do-you-support-webhooks) の問題をデバッグする際にも役立ちます。

接続が早期に終了するため (たとえば、`RCPT TO` および `MAIL FROM` コマンドが送信される前に)、[レート制限](#do-you-have-rate-limiting) および [グレーリスト](#do-you-have-a-greylist) のエラー ログにはアクセスできません。

詳細については、[プライバシーポリシー](/privacy) をご覧ください。

### 私のメールを読んでいますか？{#do-you-read-my-emails}

いいえ、絶対にありません。[プライバシーポリシー](/privacy)をご覧ください。

他の多くのメール転送サービスはメールを保存し、潜在的に読み取られる可能性があります。転送されたメールをディスクストレージに保存する必要はありません。そこで私たちは、すべてをメモリ内で処理する初のオープンソースソリューションを設計しました。

私たちは、お客様にはプライバシーの権利があると信じており、それを厳格に尊重しています。サーバーにデプロイされるコードは、透明性と信頼の構築を目的として、[GitHub上のオープンソースソフトウェア](https://github.com/forwardemail)です。

### この{#can-i-send-mail-as-in-gmail-with-this}を使用して、Gmailで「メールを送信」できますか？

はい！2018年10月2日よりこの機能を追加しました。上記の[Gmailでメールを送信する方法](#how-to-send-mail-as-using-gmail)をご覧ください。

DNS 構成の <strong class="notranslate">TXT</strong> レコードに Gmail の SPF レコードを設定する必要もあります。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
Gmail（例: 送信者名）または G Suite をご利用の場合は、SPF <strong class="notranslate">TXT</strong> レコードに <code>include:_spf.google.com</code> を追加する必要があります。例:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Outlookでこの{#can-i-send-mail-as-in-outlook-with-this}を使用して「メールを送信」できますか？

はい！2018年10月2日よりこの機能を追加しました。Microsoftの以下の2つのリンクをご覧ください。

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

DNS 構成の <strong class="notranslate">TXT</strong> レコードに Outlook の SPF レコードを設定する必要もあります。

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
重要:
</strong>
<span>
Microsoft Outlook または Live.com をご利用の場合は、SPF <strong class="notranslate">TXT</strong> レコードに <code>include:spf.protection.outlook.com</code> を追加する必要があります。例:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### この{#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}を使用して、Apple MailとiCloud Mailで「メールを送信」できますか？

iCloud+ に加入している場合は、カスタム ドメインを使用できます。[当社のサービスはApple Mailとも互換性があります](#apple-mail)。

詳細については、<https://support.apple.com/en-us/102540> を参照してください。

### この{#can-i-forward-unlimited-emails-with-this}でメールを無制限に転送できますか？

はい。ただし、「比較的未知の」送信者へのレート制限は、ホスト名またはIPアドレスごとに1時間あたり100接続に制限されます。上記の[レート制限](#do-you-have-rate-limiting)と[グレーリスト](#do-you-have-a-greylist)のセクションをご覧ください。

「比較的不明」とは、[許可リスト](#do-you-have-an-allowlist) に表示されない送信者を意味します。

この制限を超えた場合、送信者のメール サーバーに後で再試行するように指示する 421 応答コードを送信します。

### 1つの価格で無制限のドメインを提供していますか？{#do-you-offer-unlimited-domains-for-one-price}

はい。どのプランをご利用いただいても、すべてのドメインをカバーする月額料金は1つだけです。

### どのような支払い方法を受け付けていますか？ {#which-payment-methods-do-you-accept}

Forward Email では、次の 1 回限りの支払い方法、または月次/四半期/年次の支払い方法がご利用いただけます。

1. **クレジットカード/デビットカード/銀行振込**: Visa、Mastercard、American Express、Discover、JCB、Diners Clubなど
2. **PayPal**: PayPalアカウントに接続して簡単にお支払いいただけます
3. **暗号通貨**: Ethereum、Polygon、Solanaネットワーク上のStripeのステーブルコイン決済をご利用いただけます

> \[!NOTE]
> 当社のサーバーには、支払い識別子と、[ストライプ](https://stripe.com/global) および [ペイパル](https://www.paypal.com) の取引、顧客、サブスクリプション、支払い ID への参照のみを含む、限定的な支払い情報が保存されます。

> \[!TIP]
> プライバシーを最大限に確保するには、暗号通貨による決済をご検討ください。

すべてのお支払いはStripeまたはPayPalを通じて安全に処理されます。お支払い情報は当社のサーバーに保存されることはありません。

## 追加リソース {#additional-resources}

> \[!TIP]
> 以下の記事は、新しいガイド、ヒント、技術情報などで定期的に更新されています。最新のコンテンツを定期的にご確認ください。

* [ケーススタディと開発者向けドキュメント](/blog/docs)
* [リソース](/resources)
* [ガイド](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/