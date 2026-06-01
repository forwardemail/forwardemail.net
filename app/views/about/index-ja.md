# Forward Emailについて {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Emailチームと会社のストーリー" class="rounded-lg" />

# Forward Emailについて {#about-forward-email-1}


## 目次 {#table-of-contents}

* [概要](#overview)
* [創業者とミッション](#founder-and-mission)
* [タイムライン](#timeline)
  * [2017年 - 創業とローンチ](#2017---founding-and-launch)
  * [2018年 - インフラと統合](#2018---infrastructure-and-integration)
  * [2019年 - パフォーマンス革命](#2019---performance-revolution)
  * [2020年 - プライバシーとセキュリティ重視](#2020---privacy-and-security-focus)
  * [2021年 - プラットフォームの近代化](#2021---platform-modernization)
  * [2023年 - インフラと機能拡張](#2023---infrastructure-and-feature-expansion)
  * [2024年 - サービス最適化と高度な機能](#2024---service-optimization-and-advanced-features)
  * [2025年 - プライバシー強化とプロトコル対応 {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026年 - RFC準拠と高度なフィルタリング {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [基本原則](#core-principles)
* [現状](#current-status)


## 概要 {#overview}

> \[!TIP]
> アーキテクチャ、セキュリティ実装、ロードマップの技術的詳細については、[Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf)をご覧ください。

Forward Emailは、ユーザーの[プライバシーの権利](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy")に焦点を当てた[無料かつオープンソース](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source")の[email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding")サービスです。2017年にシンプルなメール転送ソリューションとして始まったものが、無制限のカスタムドメイン名、無制限のメールアドレスとエイリアス、無制限の使い捨てメールアドレス、スパム・フィッシング保護、暗号化されたメールボックスストレージ、多数の高度な機能を提供する包括的なメールプラットフォームへと進化しました。

このサービスは、元の創業チームであるデザイナーと開発者によって維持・所有されています。100%オープンソースソフトウェアで構築されており、[JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")、[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")、[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")、[HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS")、[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS")、[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")を使用しています。


## 創業者とミッション {#founder-and-mission}

Forward Emailは2017年に**Nicholas Baugh**によって設立されました。[Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf)によると、Baughは当初、自身のサイドプロジェクト用にドメイン名でメールを利用可能にするためのコスト効率が良くシンプルなソリューションを探していました。利用可能な選択肢を調査した後、自らソリューションのコーディングを始め、2017年10月2日にドメイン`forwardemail.net`を購入しました。

Forward Emailのミッションは単なるメールサービスの提供を超え、業界がメールのプライバシーとセキュリティに取り組む方法を変革することにあります。会社のコアバリューは、透明性、ユーザーコントロール、そして単なるポリシーの約束ではなく技術的実装によるプライバシー保護を含みます。


## タイムライン {#timeline}

### 2017年 - 創業とローンチ {#2017---founding-and-launch}

**2017年10月2日**: Nicholas Baughは自身のサイドプロジェクト用にコスト効率の良いメールソリューションを調査した後、ドメイン`forwardemail.net`を購入しました。

**2017年11月5日**: Baughは[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")を使用して、任意のカスタムドメイン名のメールを転送する634行のJavaScriptファイルを作成しました。この初期実装はオープンソースとして[GitHub](https://github.com/forwardemail)に公開され、GitHub Pagesを使ってサービスが開始されました。
**2017年11月**: Forward Emailは初期リリース後に正式にローンチされました。初期バージョンはアカウント登録やサインアッププロセスのない純粋にDNSベースのもので、Markdownで書かれたREADMEファイルに指示が記載されていました。ユーザーはMXレコードを`mx1.forwardemail.net`と`mx2.forwardemail.net`に設定し、TXTレコードに`forward-email=user@gmail.com`を追加することでメール転送を設定できました。

このシンプルで効果的なソリューションは、Ruby on Railsの作成者である[David Heinemeier Hansson](https://dhh.dk)を含む著名な開発者の注目を集め、彼は現在も自身のドメイン`dhh.dk`でForward Emailを使用し続けています。

### 2018年 - インフラと統合 {#2018---infrastructure-and-integration}

**2018年4月**: [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")が[プライバシー重視の消費者向けDNSサービス](https://blog.cloudflare.com/announcing-1111/)を開始した際、Forward Emailは[OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS")から[Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")へ[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")ルックアップの処理を切り替え、プライバシー重視のインフラ選択へのコミットメントを示しました。

**2018年10月**: Forward Emailはユーザーが[Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail")や[Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook")で「送信者としてメールを送る」機能を可能にし、人気のあるメールプロバイダーとの統合機能を拡充しました。

### 2019年 - パフォーマンス革命 {#2019---performance-revolution}

**2019年5月**: Forward Emailはv2をリリースし、初期バージョンから大幅な書き直しを行いました。このアップデートは[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")の[ストリーム](https://en.wikipedia.org/wiki/Streams "Streams")を活用した[パフォーマンス](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")改善に焦点を当て、プラットフォームのスケーラビリティの基盤を確立しました。

### 2020年 - プライバシーとセキュリティの強化 {#2020---privacy-and-security-focus}

**2020年2月**: Forward EmailはEnhanced Privacy Protectionプランをリリースし、ユーザーがメール転送設定のエイリアスに関する公開DNSレコードの設定をオフにできるようにしました。このプランにより、ユーザーのメールエイリアス情報はインターネット上で公開検索されることがなくなります。また、特定のエイリアスを有効・無効にする機能もリリースされ、これにより有効なメールアドレスとして表示されつつも、メールは即座に破棄され（[/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")へのパイプ出力に似た動作）、成功した[SMTPステータスコード](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")を返すことが可能になりました。

**2020年4月**: Forward Emailは既存のスパム検出ソリューションがForward Emailのプライバシーポリシーを尊重しなかったため、多くの障害に直面した後、スパムスキャナーの初期アルファ版をリリースしました。この完全無料かつオープンソースの[アンチスパムフィルタリング](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")ソリューションは、[ナイーブベイズスパムフィルター](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")方式に加え、[フィッシング対策](https://en.wikipedia.org/wiki/Phishing "Phishing")および[IDNホモグラフ攻撃](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")保護を組み合わせています。さらにForward Emailは、アカウントセキュリティ強化のために[ワンタイムパスワード](https://en.wikipedia.org/wiki/One-time_password "One-time password")(OTP)を用いた[二要素認証](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication")(2FA)もリリースしました。

**2020年5月**: Forward Emailはユーザーが[ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")によるポートブロッキングを回避するための回避策としてカスタムの[ポートフォワーディング](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")を許可しました。また、同社は完全なドキュメントとリアルタイムのリクエスト・レスポンス例を備えた[無料メール転送RESTful API](email-api)をリリースし、Webhookのサポートも提供しました。
**2020年8月**: Forward Emailは[Authenticated Received Chain](arc)（「ARC」）メール認証システムのサポートを追加し、メールのセキュリティと配信性をさらに強化しました。

**2020年11月23日**: Forward Emailはベータプログラムを終了し正式に公開され、プラットフォームの開発における重要なマイルストーンとなりました。

### 2021年 - プラットフォームの近代化 {#2021---platform-modernization}

**2021年2月**: Forward Emailはコードベースをリファクタリングし、すべての[Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)")依存を排除、スタックを100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")と[Node.js](https://en.wikipedia.org/wiki/Node.js)に統一しました。このアーキテクチャの決定は、一貫したオープンソース技術スタックを維持するという同社のコミットメントに沿ったものです。

**2021年9月27日**: Forward Emailはメール転送エイリアスに対して[正規表現](https://en.wikipedia.org/wiki/Regular_expression "Regular expression")をマッチさせるサポートを[追加](email-forwarding-regex-pattern-filter)し、ユーザーにより高度なメールルーティング機能を提供しました。

### 2023年 - インフラと機能拡張 {#2023---infrastructure-and-feature-expansion}

**2023年1月**: Forward Emailは再設計されページ速度最適化されたウェブサイトを公開し、ユーザー体験とパフォーマンスを向上させました。

**2023年2月**: 同社は[エラーログ](/faq#do-you-store-error-logs)のサポートを追加し、ユーザーの好みやアクセシビリティのニーズに応えて[ダークモード](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)のウェブサイトカラースキームを実装しました。

**2023年3月**: Forward Emailは[Tangerine](https://github.com/forwardemail/tangerine#readme)をリリースし、インフラ全体に統合してアプリケーション層での[DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)（「DoH」）の利用を可能にしました。同時に[MTA-STS](/faq#do-you-support-mta-sts)のサポートを追加し、[hCaptcha](/)から[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)へ切り替えました。

**2023年4月**: Forward Emailは全く新しいインフラを実装し自動化しました。サービス全体がグローバルに負荷分散され、近接性に基づくDNSで稼働し、[Cloudflare](https://cloudflare.com)を用いたヘルスチェックとフェイルオーバーを備え、従来のラウンドロビンDNS方式を置き換えました。同社は複数のプロバイダーにまたがる**ベアメタルサーバー**に切り替え、[Vultr](https://www.vultr.com/?ref=429848)や[Digital Ocean](https://m.do.co/c/a7cecd27e071)など、SOC 2 Type 1準拠のプロバイダーを利用しています。MongoDBとRedisのデータベースはプライマリとスタンバイノードを備えたクラスタ構成に移行し、高可用性、エンドツーエンドSSL暗号化、保存時暗号化、ポイントインタイムリカバリ（PITR）を実現しました。

**2023年5月**: Forward Emailは[SMTPによるメール送信](/faq#do-you-support-sending-email-with-smtp)および[APIによるメール送信](/faq#do-you-support-sending-email-with-api)のための**アウトバウンドSMTP**機能を開始しました。この機能には高い配信成功率を保証する組み込みの安全装置、最新かつ堅牢なキューとリトライシステムが含まれ、[リアルタイムのエラーログ対応](/faq#do-you-store-error-logs)もサポートしています。

**2023年11月**: Forward Emailは[IMAPサポート](/faq#do-you-support-receiving-email-with-imap)向けの[**暗号化されたメールボックスストレージ**](/blog/docs/best-quantum-safe-encrypted-email-service)機能を開始し、メールのプライバシーとセキュリティにおいて大きな進歩を遂げました。

**2023年12月**: 同社は[POP3](/faq#do-you-support-pop3)のサポート、[パスキーとWebAuthn](/faq#do-you-support-passkeys-and-webauthn)、[受信時間監視](/faq#i)、および[IMAPストレージ向けOpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)のサポートを追加しました。

### 2024年 - サービス最適化と高度な機能 {#2024---service-optimization-and-advanced-features}

**2024年2月**: Forward Emailはカレンダー（CalDAV）サポートを[追加](/faq#do-you-support-calendars-caldav)し、プラットフォームの機能をメール以外にも拡張しました。
**2024年3月から7月**: Forward EmailはIMAP、POP3、CalDAVサービスの大幅な最適化と改善をリリースし、代替サービスと同等かそれ以上の高速化を目指しました。

**2024年7月**: 同社は[Apple MailのiOS版がIMAPの`IDLE`コマンドをサポートしていない問題に対応するためにiOSプッシュサポートを追加しました](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016)。これによりAppleのiOSデバイスでリアルタイム通知が可能になりました。Forward Emailはまた、自社サービスおよびYahoo/AOLの受信時間（"TTI"）の監視を追加し、無料プランでもユーザーがDNS TXTレコード全体を暗号化できるようにしました。[Privacy Guidesの議論](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)や[GitHubの課題](https://github.com/forwardemail/forwardemail.net/issues/254)での要望に応じて、エイリアスが無効化された際に静かに`250`を拒否、ソフト拒否`421`、またはハード拒否`550`を選択できる機能を追加しました。

**2024年8月**: Forward Emailはメールボックスのエクスポートに[EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)および[Mbox](https://en.wikipedia.org/wiki/Mbox)形式のサポートを追加しました（既存の[SQLite](https://en.wikipedia.org/wiki/SQLite)エクスポート形式に加えて）。[Webhook署名サポートも追加され](https://forwardemail.net/faq#do-you-support-bounce-webhooks)、ユーザーがアウトバウンドSMTPサービスを通じてニュースレター、告知、メールマーケティングを送信できるようになりました。IMAP/POP3/CalDAVのドメイン全体およびエイリアス別のストレージクォータも実装されました。

### 2025年 - プライバシー強化とプロトコルサポート {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**2024年9月から2025年1月**: Forward Emailは[多くの要望があったバケーションレスポンダー機能とOpenPGP/WKD暗号化によるメール転送機能を追加しました](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254)。これは既に実装されていた暗号化されたメールボックスストレージ機能を基盤としています。

**2025年1月21日**: 創業者の親友であり忠実な犬の仲間「ジャック」が、ほぼ11歳で安らかに亡くなりました。ジャックはForward Emailの創設を支えた揺るぎない友情として[永遠に記憶されます](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b)。[Forward Email技術ホワイトペーパー](https://forwardemail.net/technical-whitepaper.pdf)はジャックに捧げられ、サービス開発における彼の役割を称えています。

**2025年2月**: Forward Emailは新たな主要データセンタープロバイダーとして[DataPacket](https://www.datapacket.com)に切り替え、カスタムのパフォーマンス重視ベアメタルハードウェアを導入してサービスの信頼性と速度をさらに向上させました。

**2025年3月**: Forward Emailのバージョン1.0が正式にリリースされました。

**2025年4月**: [Forward Email技術ホワイトペーパー](https://forwardemail.net/technical-whitepaper.pdf)の初版が公開され、同時に暗号通貨での支払い受付を開始しました。

**2025年5月**: サービスは[Scalar](https://github.com/scalar/scalar)を用いた新しいAPIドキュメントを公開しました。

**2025年6月**: Forward Emailは[CardDAVプロトコル](/faq#do-you-support-contacts-carddav)のサポートを開始し、既存のメールおよびカレンダーサービスに加えて連絡先同期機能を拡充しました。

**2025年8月**: プラットフォームは[CalDAV VTODO/タスクサポート](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\))を追加し、カレンダーイベントに加えてタスク管理を可能にしました。

**2025年11月**: プラットフォームのセキュリティが強化され、パスワードハッシュ化にPBKDF2から[Argon2id](https://en.wikipedia.org/wiki/Argon2)へ移行し、インフラはRedisから[Valkey](https://github.com/valkey-io/valkey)へ移行しました。

**2025年12月**: バージョン2.0がリリースされ、メール転送のTLS暗号化強制のための[REQUIRETLS (RFC 8689)](/rfc#requiretls-support)サポートが導入され、[OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6へアップグレードされました。
### 2026 - RFC準拠と高度なフィルタリング {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**2026年1月**: Forward Emailは包括的な[RFCプロトコル準拠ドキュメント](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison)を公開し、[S/MIME暗号化（RFC 8551）](/faq#do-you-support-smime-encryption)および包括的な[Sieveメールフィルタリング（RFC 5228）](/faq#do-you-support-sieve-email-filtering)を[ManageSieveプロトコル（RFC 5804）](/faq#do-you-support-sieve-email-filtering)のサポートとともに追加しました。REST APIも39エンドポイントに拡張されました。

**2026年2月**: 公式のオープンソースWebメールクライアントが[mail.forwardemail.net](https://mail.forwardemail.net)でローンチされました（[GitHubのソースコード](https://github.com/forwardemail/mail.forwardemail.net)）。プラットフォームはまた、[CalDAVスケジューリング拡張（RFC 6638）](https://www.rfc-editor.org/rfc/rfc6638)、[DANE/TLSA（RFC 6698）](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities)、および1クリックDNS設定のための[Domain Connect](https://domainconnect.org)のサポートを追加しました。IMAP、CalDAV、CardDAVのリアルタイムプッシュ通知はWebSocketsを使用して開始されました。

**2026年3月**: ドメインごとのカスタムS3互換ストレージのサポートが追加され、管理用のコマンドラインツールも提供されました。macOS、Windows、Linux、iOS、Android向けのクロスプラットフォームデスクトップおよびモバイルアプリケーションの開発が、同じオープンソースWebメールコードベースを使用して[Tauri](https://tauri.app)で開始されました。


## コア原則 {#core-principles}

Forward Emailは創設以来、プライバシーとセキュリティの原則に揺るぎないコミットメントを維持しています：

**100%オープンソース哲学**: フロントエンドのみをオープンソースにし、バックエンドを非公開にする競合他社とは異なり、Forward Emailはフロントエンドとバックエンドの両方のコードベースを[GitHub](https://github.com/forwardemail)で公開し、誰でも検証可能にしています。

**プライバシーファースト設計**: 初日からForward Emailは、メールをディスクに書き込まない独自のインメモリ処理アプローチを実装し、メッセージをデータベースやファイルシステムに保存する従来のメールサービスと一線を画しています。

**継続的なイノベーション**: シンプルなメール転送ソリューションから、暗号化されたメールボックス、量子耐性暗号化、SMTP、IMAP、POP3、CalDAVなどの標準プロトコル対応を備えた包括的なメールプラットフォームへと進化しています。

**透明性**: すべてのコードをオープンソース化し検査可能にすることで、ユーザーがマーケティング文句を鵜呑みにするのではなく、プライバシー主張を自ら検証できるようにしています。

**ユーザーコントロール**: ユーザーに選択肢を提供し、希望すればプラットフォーム全体をセルフホストできるようにしています。


## 現状 {#current-status}

2026年3月時点で、Forward Emailは世界中で50万以上のドメインにサービスを提供しており、以下のような著名な組織や業界リーダーも含まれています：

* **テクノロジー企業**: Canonical (Ubuntu)、Netflix Games、The Linux Foundation、The PHP Foundation、jQuery、LineageOS
* **メディア組織**: Fox News Radio、Disney Ad Sales
* **教育機関**: ケンブリッジ大学、メリーランド大学、ワシントン大学、タフツ大学、スワースモア大学
* **政府機関**: 南オーストラリア州政府、ドミニカ共和国政府
* **その他の組織**: RCD Hotels、Fly<span>.</span>io
* **著名な開発者**: Isaac Z. Schlueter (npm創設者)、David Heinemeier Hansson (Ruby on Rails創設者)

プラットフォームは定期的な機能リリースとインフラ改善を続け、現在も唯一の100%オープンソース、暗号化、プライバシー重視、透明性、量子耐性を備えたメールサービスとしての地位を維持しています。

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
