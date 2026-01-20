# メール転送について {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# メール転送について {#about-forward-email-1}

## 目次 {#table-of-contents}

* [概要](#overview)
* [創設者と使命](#founder-and-mission)
* [タイムライン](#timeline)
  * [2017年 - 設立と立ち上げ](#2017---founding-and-launch)
  * [2018年 - インフラストラクチャと統合](#2018---infrastructure-and-integration)
  * [2019年 - パフォーマンス革命](#2019---performance-revolution)
  * [2020年 - プライバシーとセキュリティの焦点](#2020---privacy-and-security-focus)
  * [2021年 - プラットフォームの近代化](#2021---platform-modernization)
  * [2023年 - インフラストラクチャと機能の拡張](#2023---infrastructure-and-feature-expansion)
  * [2024 - サービスの最適化と高度な機能](#2024---service-optimization-and-advanced-features)
  * [2025年 - 継続的なイノベーション](#2025---continued-innovation)
* [コア原則](#core-principles)
* [現在の状況](#current-status)

## 概要 {#overview}

> \[!TIP]
> アーキテクチャ、セキュリティ実装、ロードマップに関する技術的な詳細については、[技術ホワイトペーパー](https://forwardemail.net/technical-whitepaper.pdf) をご覧ください。

Forward Emailは、ユーザーの[プライバシーの権利](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy")に重点を置いた[無料かつオープンソース](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [メール転送](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding")サービスです。2017年にシンプルなメール転送ソリューションとしてスタートしたForward Emailは、無制限のカスタムドメイン名、無制限のメールアドレスとエイリアス、無制限の使い捨てメールアドレス、スパムおよびフィッシング対策、暗号化されたメールボックスストレージ、そして数々の高度な機能を提供する包括的なメールプラットフォームへと進化しました。

このサービスは、創業当時のデザイナーと開発者からなるチームによって維持・所有されています。[JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")、[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")、[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")、[HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS")、[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS")、[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")を使用した100%オープンソースソフトウェアで構築されています。

## 創設者と使命 {#founder-and-mission}

Forward Emailは2017年に**Nicholas Baugh**によって設立されました。[メール転送に関するテクニカルホワイトペーパー](https://forwardemail.net/technical-whitepaper.pdf)によると、Baugh氏は当初、自身のサイドプロジェクトのために、ドメイン名でメールを利用できる費用対効果の高いシンプルなソリューションを探していました。利用可能な選択肢を調査した後、彼は独自のソリューションのコーディングを開始し、2017年10月2日にドメイン`forwardemail.net`を購入しました。

Forward Emailの使命は、メールサービスの提供にとどまりません。メールのプライバシーとセキュリティに対する業界のアプローチを変革することを目指しています。同社のコアバリューは、透明性、ユーザーコントロール、そしてポリシーに基づく約束ではなく、技術的な実装によるプライバシー保護です。

## タイムライン {#timeline}

### 2017年 - 設立と立ち上げ {#2017---founding-and-launch}

**2017 年 10 月 2 日**: Nicholas Baugh は、副業プロジェクトのためにコスト効率の高い電子メール ソリューションを調査した後、ドメイン `forwardemail.net` を購入しました。

**2017年11月5日**：Baugh氏は、[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")を使用して、任意のカスタムドメイン名のメールを転送するための634行のJavaScriptファイルを作成しました。この初期実装は[GitHub](https://github.com/forwardemail)にオープンソースとして公開され、GitHub Pagesを使用してサービスが開始されました。

**2017年11月**：初期リリースを経て、Forward Emailが正式にリリースされました。初期バージョンはDNSベースのみで、アカウント登録やサインアップのプロセスはなく、Markdownで書かれたREADMEファイルと手順説明のみでした。ユーザーは、MXレコードを`mx1.forwardemail.net`と`mx2.forwardemail.net`に設定し、TXTレコードに`forward-email=user@gmail.com`を追加することで、メール転送を設定できました。

このソリューションのシンプルさと有効性は、[デビッド・ハイネマイヤー・ハンソン](https://dhh.dk) (Ruby on Rails の作成者) をはじめとする著名な開発者の注目を集めました。__PROTECTED_LINK_98__ は現在も自身のドメイン `dhh.dk` で Forward Email を使い続けています。

### 2018 - インフラストラクチャと統合 {#2018---infrastructure-and-integration}

**2018 年 4 月**: [クラウドフレア](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") が [プライバシーを第一に考えた消費者向けDNSサービス](https://blog.cloudflare.com/announcing-1111/) を開始したとき、Forward Email は [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") ルックアップの処理に [オープンDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") から [クラウドフレア](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") を使用するように切り替えました。これは、プライバシー重視のインフラストラクチャの選択に対する同社の取り組みを示すものです。

**2018 年 10 月**: メール転送により、ユーザーは [Gメール](https://en.wikipedia.org/wiki/Gmail "Gmail") および [見通し](https://en.wikipedia.org/wiki/Outlook "Outlook") を使用して「名前を付けてメールを送信」できるようになり、一般的なメール プロバイダーとの統合機能が拡張されました。

### 2019 - パフォーマンス革命 {#2019---performance-revolution}

**2019年5月**：Forward Emailはv2をリリースしました。これは初期バージョンからの大幅な書き換えです。このアップデートでは、[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")の[ストリーム](https://en.wikipedia.org/wiki/Streams "Streams")の利用を通じて[パフォーマンス](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")の改善に重点が置かれ、プラットフォームのスケーラビリティの基盤が確立されました。

### 2020 - プライバシーとセキュリティの焦点 {#2020---privacy-and-security-focus}

**2020年2月**：Forward Emailは、強化されたプライバシー保護プランをリリースしました。このプランでは、ユーザーがメール転送設定エイリアスでパブリックDNSレコードエントリの設定を無効にできるようになりました。このプランでは、ユーザーのメールエイリアス情報がインターネット上で公開検索されないように非表示になります。また、特定のエイリアスを有効または無効にしながらも、有効なメールアドレスとして表示され、[SMTPステータスコード](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")が返され、メールが即座に破棄される（出力を[/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")にパイプするのと同様に）機能もリリースしました。

**2020年4月**：既存のスパム検出ソリューションがForward Emailのプライバシーポリシーを遵守していないため、数え切れないほどの障害に直面したため、同社はSpam Scannerの初期アルファ版をリリースしました。この完全に無料のオープンソース[スパム対策フィルタリング](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")ソリューションは、[ナイーブベイズスパムフィルター](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")アプローチと[フィッシング対策](https://en.wikipedia.org/wiki/Phishing "Phishing")および[IDN同形異義語攻撃](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")保護を組み合わせています。Forward Emailはまた、アカウントセキュリティを強化するために、[ワンタイムパスワード](https://en.wikipedia.org/wiki/One-time_password "One-time password")（OTP）を使用した[二要素認証](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication")（2FA）もリリースしました。

**2020年5月**：Forward Emailは、ユーザーが[ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")によるポートブロックを回避するための回避策として、カスタム[ポート転送](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")の使用を許可しました。また、同社は[無料のメール転送RESTful API](email-api)をリリースし、完全なドキュメントとリアルタイムのリクエストとレスポンスの例に加え、Webhookのサポートも提供しました。

**2020 年 8 月**: Forward Email に [認証済み受信チェーン](arc) ("ARC") 電子メール認証システムのサポートが追加され、電子メールのセキュリティと配信性がさらに強化されました。

**2020 年 11 月 23 日**: Forward Email がベータ プログラムから一般公開され、プラットフォーム開発における重要なマイルストーンとなりました。

### 2021 - プラットフォームの近代化 {#2021---platform-modernization}

**2021年2月**：Forward Emailはコードベースをリファクタリングし、[パイソン](https://en.wikipedia.org/wiki/Python_\(programming_language\)（Python（プログラミング言語））への依存関係をすべて削除しました。これにより、スタックは100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")と[Node.js](https://en.wikipedia.org/wiki/Node.js)のみになりました。このアーキテクチャ上の決定は、一貫性のあるオープンソースのテクノロジースタックを維持するという同社のコミットメントと一致しています。

**2021 年 9 月 27 日**: メール転送エイリアスの [追加されたサポート](email-forwarding-regex-pattern-filter) を [正規表現](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") と一致するように転送し、ユーザーにさらに高度なメール ルーティング機能を提供します。

### 2023 - インフラストラクチャと機能の拡張 {#2023---infrastructure-and-feature-expansion}

**2023 年 1 月**: Forward Email は、デザインを一新しページ速度を最適化した Web サイトを公開し、ユーザー エクスペリエンスとパフォーマンスを向上させました。

**2023 年 2 月**: 当社は、ユーザーの好みとアクセシビリティのニーズに応えて、[エラーログ](/faq#do-you-store-error-logs) のサポートを追加し、[ダークモード](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) ウェブサイトのカラー スキームを実装しました。

**2023年3月**：Forward Emailは[タンジェリン](https://github.com/forwardemail/tangerine#readme)をリリースし、インフラ全体に統合しました。これにより、アプリケーション層で[DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（「DoH」）を利用できるようになりました。また、[MTA-STS](/faq#do-you-support-mta-sts)のサポートを追加し、[hキャプチャ](/)から[Cloudflareターンスタイル](https://developers.cloudflare.com/turnstile)に切り替えました。

**2023年4月**：Forward Emailは、全く新しいインフラストラクチャを導入し、自動化しました。サービス全体が、[クラウドフレア](https://cloudflare.com)を使用したヘルスチェックとフェイルオーバー機能を備えた、グローバルに負荷分散された近接ベースのDNS上で稼働し、従来のラウンドロビンDNSアプローチに取って代わりました。同社は、[ヴルトル](https://www.vultr.com/?ref=429848)と[デジタルオーシャン](https://m.do.co/c/a7cecd27e071)（いずれもSOC 2 Type 1準拠）を含む複数のプロバイダーの**ベアメタルサーバー**に切り替えました。MongoDBとRedisデータベースは、高可用性、エンドツーエンドのSSL暗号化、保存時の暗号化、ポイントインタイムリカバリ（PITR）を実現するために、プライマリノードとスタンバイノードを備えたクラスター構成に移行しました。

**2023年5月**：Forward Emailは、[SMTPでメールを送信する](/faq#do-you-support-sending-email-with-smtp)および[APIを使用してメールを送信する](/faq#do-you-support-sending-email-with-api)リクエスト向けの**送信SMTP**機能を開始しました。この機能には、高い配信率を保証するための組み込みの安全対策、最新かつ堅牢なキューおよび再試行システム、そして[リアルタイムのエラーログをサポート](/faq#do-you-store-error-logs)が含まれています。

**2023 年 11 月**: Forward Email は、[IMAPサポート](/faq#do-you-support-receiving-email-with-imap) の [**暗号化されたメールボックスストレージ**](/blog/docs/best-quantum-safe-encrypted-email-service) 機能をリリースしました。これは、電子メールのプライバシーとセキュリティの大幅な進歩を表しています。

**2023 年 12 月**: [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)、[パスキーとWebAuthn](/faq#do-you-support-passkeys-and-webauthn)、[受信箱の時間](/faq#i) の監視、および [IMAPストレージ用のOpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) の会社 [追加されたサポート](/faq#do-you-support-pop3)。

### 2024 - サービスの最適化と高度な機能 {#2024---service-optimization-and-advanced-features}

**2024 年 2 月**: 電子メール [カレンダー（CalDAV）のサポートを追加しました](/faq#do-you-support-calendars-caldav) を転送し、プラットフォームの機能を電子メール以外に拡張してカレンダー同期を含めます。

**2024 年 3 月から 7 月**: Forward Email は、IMAP、POP3、CalDAV サービスに対する主要な最適化と改善をリリースし、他のサービスと同等かそれ以上の速度を実現することを目標としました。

**2024年7月**：iOS版Apple MailがIMAP `IDLE`コマンドをサポートしていない問題に対処するため、[iOSプッシュサポートを追加](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016)を導入しました。これにより、Apple iOSデバイスへのリアルタイム通知が可能になります。また、Forward Emailは自社サービスとYahoo/AOLの受信トレイ到達時間（TTI）監視機能を追加し、無料プランでもDNS TXTレコード全体を暗号化できるようになりました。[プライバシーガイドの議論](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)および[GitHubの問題](https://github.com/forwardemail/forwardemail.net/issues/254)で要望があったように、エイリアスが無効になっている場合に、`250`をサイレント拒否、`421`をソフト拒否、`550`をハード拒否する機能を追加しました。

**2024年8月**：Forward Emailは、既存の[SQLite](https://en.wikipedia.org/wiki/SQLite)エクスポート形式に加えて、[EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)および[Mボックス](https://en.wikipedia.org/wiki/Mbox)形式でのメールボックスのエクスポートをサポートしました。[Webhook署名のサポートが追加されました](https://forwardemail.net/faq#do-you-support-bounce-webhooks)では、ユーザーが送信SMTPサービスを通じてニュースレター、お知らせ、メールマーケティングを送信できるようになりました。また、IMAP/POP3/CalDAVのドメイン全体およびエイリアス固有のストレージクォータも実装されました。

### 2025 - 継続的なイノベーション {#2025---continued-innovation}

**2024 年 9 月から 2025 年 1 月**: すでに実装されている暗号化されたメールボックス ストレージ機能を利用して、電子メール [要望の多かった休暇通知機能とメール転送用のOpenPGP/WKD暗号化を追加しました。](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) を転送します。

**2025年1月21日**：創業者の親友であり、忠実な愛犬「ジャック」が、11歳という若さで安らかに息を引き取りました。Forward Emailの誕生を支え、揺るぎない友情を育んでくれたジャックに、[いつまでも記憶に残る](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) を捧げます。[メール転送に関するテクニカルホワイトペーパー](https://forwardemail.net/technical-whitepaper.pdf) は、サービス開発におけるジャックの貢献を称え、捧げるものです。

**2025 年 2 月**: Forward Email は、新しいプライマリ データ センター プロバイダーとして [データパケット](https://www.datapacket.com) に切り替え、カスタムのパフォーマンス重視のベアメタル ハードウェアを実装して、サービスの信頼性と速度をさらに向上させました。

**2025 年 6 月**: Forward Email は [CardDAVプロトコル](/faq#do-you-support-contacts-carddav) のサポートを開始し、プラットフォームの機能を拡張して、既存の電子メールおよびカレンダー サービスとともに連絡先の同期を含めました。

## コア原則 {#core-principles}

Forward Email は創業以来、プライバシーとセキュリティの原則に忠実に従ってきました。

**100% オープンソース哲学**: バックエンドを非公開にしたままフロントエンドのみをオープンソース化する競合他社とは異なり、Forward Email はフロントエンドとバックエンドの両方のコードベース全体を [GitHub](https://github.com/forwardemail) で公開して、一般の精査に利用しています。

**プライバシー優先の設計**: Forward Email は、最初から、電子メールをディスクに書き込むことを避ける独自のメモリ内処理アプローチを実装しており、メッセージをデータベースやファイル システムに保存する従来の電子メール サービスとは一線を画しています。

**継続的なイノベーション**: このサービスは、単純なメール転送ソリューションから、暗号化されたメールボックス、量子耐性暗号化、SMTP、IMAP、POP3、CalDAV などの標準プロトコルのサポートなどの機能を備えた包括的なメール プラットフォームへと進化しました。

**透明性**: すべてのコードをオープンソースにして検査できるようにすることで、ユーザーがマーケティングの声明を単純に信じるのではなく、プライバシーの主張を検証できるようにします。

**ユーザー コントロール**: 必要に応じてプラットフォーム全体をセルフホストする機能など、ユーザーにオプションを提供します。

## 現在のステータス {#current-status}

2025 年現在、Forward Email は世界中で 500,000 以上のドメインにサービスを提供しており、その中には次のような著名な組織や業界リーダーも含まれています。

* **テクノロジー企業**: Canonical (Ubuntu)、Netflix Games、The Linux Foundation、The PHP Foundation、jQuery、LineageOS
* **メディア組織**: Fox News Radio、Disney Ad Sales
* **教育機関**: ケンブリッジ大学、メリーランド大学、ワシントン大学、タフツ大学、スワースモア大学
* **政府機関**: 南オーストラリア州政府、ドミニカ共和国政府
* **その他の組織**: RCD Hotels、Fly<span>.</span>io
* **著名な開発者**: Isaac Z. Schlueter (npm 開発者)、David Heinemeier Hansson (Ruby on Rails 開発者)

このプラットフォームは、定期的な機能リリースとインフラストラクチャの改善により進化を続け、現在利用可能な唯一の 100% オープンソースで暗号化され、プライバシー重視、透明性があり、量子耐性を備えた電子メール サービスとしての地位を維持しています。

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />