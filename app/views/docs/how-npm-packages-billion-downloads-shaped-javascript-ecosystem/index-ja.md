# 10年間のインパクト: npmパッケージが10億ダウンロードを達成し、JavaScriptをどのように形作ったか {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## 目次 {#table-of-contents}

* [序文](#foreword)
* [私たちを信頼する先駆者たち：アイザック・Z・シュルーターとフォワードメール](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npmの創設からNode.jsのリーダーシップまで](#from-npms-creation-to-nodejs-leadership)
* [コードの背後にある建築家：ニック・ボーの旅](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express技術委員会とコア貢献](#express-technical-committee-and-core-contributions)
  * [Koaフレームワークへの貢献](#koa-framework-contributions)
  * [個人の貢献者から組織のリーダーへ](#from-individual-contributor-to-organization-leader)
* [GitHub組織：イノベーションのエコシステム](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: 最新のアプリケーション向けの構造化ログ](#cabin-structured-logging-for-modern-applications)
  * [スパムスキャナ：メールの不正使用と戦う](#spam-scanner-fighting-email-abuse)
  * [Bree: ワーカースレッドによる最新のジョブスケジューリング](#bree-modern-job-scheduling-with-worker-threads)
  * [メール転送: オープンソースのメールインフラストラクチャ](#forward-email-open-source-email-infrastructure)
  * [Lad: 必須のKoaユーティリティとツール](#lad-essential-koa-utilities-and-tools)
  * [Upptime: オープンソースの稼働時間監視](#upptime-open-source-uptime-monitoring)
* [フォワードメールエコシステムへの貢献](#our-contributions-to-the-forward-email-ecosystem)
  * [パッケージから生産まで](#from-packages-to-production)
  * [フィードバックループ](#the-feedback-loop)
* [Forward Emailの基本原則：卓越性の基盤](#forward-emails-core-principles-a-foundation-for-excellence)
  * [常に開発者フレンドリー、セキュリティ重視、透明性](#always-developer-friendly-security-focused-and-transparent)
  * [実績のあるソフトウェア開発原則の遵守](#adherence-to-time-tested-software-development-principles)
  * [自力で開発する開発者をターゲットに](#targeting-the-scrappy-bootstrapped-developer)
  * [実践の原則: 転送メールのコードベース](#principles-in-practice-the-forward-email-codebase)
  * [プライバシーバイデザイン](#privacy-by-design)
  * [持続可能なオープンソース](#sustainable-open-source)
* [数字は嘘をつかない：驚異的なnpmダウンロード統計](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [私たちの影響の鳥瞰図](#a-birds-eye-view-of-our-impact)
  * [毎日大規模なインパクト](#daily-impact-at-scale)
  * [生の数字を超えて](#beyond-the-raw-numbers)
* [エコシステムのサポート：オープンソーススポンサーシップ](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [アンドリス・ラインマン: メールインフラのパイオニア](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: ユーティリティ パッケージのマスターマインド](#sindre-sorhus-utility-package-mastermind)
* [JavaScriptエコシステムのセキュリティ脆弱性を発見](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koaルーターの救出](#the-koa-router-rescue)
  * [ReDoS脆弱性への対処](#addressing-redos-vulnerabilities)
  * [Node.js と Chromium のセキュリティを擁護する](#advocating-for-nodejs-and-chromium-security)
  * [npmインフラストラクチャのセキュリティ保護](#securing-npm-infrastructure)
* [フォワードメールエコシステムへの貢献](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailerのコア機能の強化](#enhancing-nodemailers-core-functionality)
  * [Mailauthによるメール認証の進化](#advancing-email-authentication-with-mailauth)
  * [主なアップタイムの強化](#key-upptime-enhancements)
* [すべてをまとめる接着剤：大規模なカスタムコード](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [大規模な開発努力](#a-massive-development-effort)
  * [コア依存関係の統合](#core-dependencies-integration)
  * [Tangerine と mx-connect を使用した DNS インフラストラクチャ](#dns-infrastructure-with-tangerine-and-mx-connect)
* [エンタープライズへの影響：オープンソースからミッションクリティカルなソリューションへ](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [ミッションクリティカルな電子メールインフラストラクチャのケーススタディ](#case-studies-in-mission-critical-email-infrastructure)
* [オープンソースの10年：今後の展望](#a-decade-of-open-source-looking-forward)

## 序文 {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) と [Node.js](https://en.wikipedia.org/wiki/Node.js) の世界では、いくつかのパッケージは不可欠です。毎日何百万回もダウンロードされ、世界中のアプリを動かしています。これらのツールの背後には、オープンソースの品質にこだわる開発者たちがいます。本日は、JavaScriptエコシステムの重要な一部となったnpmパッケージの構築と保守に、私たちのチームがどのように貢献しているかをご紹介します。

## 私たちを信頼する先駆者たち：アイザック・Z・シュルーターと転送メール {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

[アイザック・Z・シュルーター](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) をユーザーとして迎えることができ、大変光栄です。Isaac は [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) を作成し、[Node.js](https://en.wikipedia.org/wiki/Node.js) の構築にも携わりました。彼が Forward Email を信頼していることは、私たちが品質とセキュリティに注力している証です。Isaac は izs.me を含む複数のドメインで Forward Email を利用しています。

アイザックのJavaScriptへの影響は計り知れません。2009年、彼はNode.jsの可能性をいち早く見出した一人であり、プラットフォームを開発した[ライアン・ダール](https://en.wikipedia.org/wiki/Ryan_Dahl)と共に活動しました。アイザックは[インクリメント誌のインタビュー](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)で次のように述べています。「サーバーサイドJSの実現方法を模索する少数の人々が集まる、非常に小さなコミュニティの中で、ライアン・ダールがNode.jsを発表しました。これはまさに正しいアプローチでした。私はNode.jsに賛同し、2009年半ば頃から深く関わるようになりました。」

> \[!NOTE]
> Node.jsの歴史に興味のある方には、[Node.jsの物語](https://www.youtube.com/watch?v=LB8KwiiUGy0)や[Node.js について後悔していること 10 件 - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I)など、Node.jsの開発の歴史を辿る優れたドキュメンタリーがあります。Ryan Dahl氏の[個人ウェブサイト](https://tinyclouds.org/)にも、彼の仕事に関する貴重な洞察が含まれています。

### npmの誕生からNode.jsのリーダーシップまで {#from-npms-creation-to-nodejs-leadership}

アイザックは2009年9月にnpmを作成し、最初の実用的なバージョンは2010年初頭にリリースされました。このパッケージマネージャーはNode.jsの重要なニーズを満たし、開発者がコードを容易に共有・再利用できるようにしました。[Node.js の Wikipedia ページ](https://en.wikipedia.org/wiki/Node.js)によると、「2010年1月、Node.js環境にnpmと呼ばれるパッケージマネージャーが導入されました。このパッケージマネージャーにより、プログラマーはNode.jsパッケージとそれに付随するソースコードを公開・共有することができ、パッケージのインストール、更新、アンインストールを簡素化するように設計されています。」

2012年1月にRyan DahlがNode.jsから退任した後、Isaacがプロジェクトリーダーを引き継ぎました。[彼の要約](https://izs.me/resume)に記載されているように、彼は「CommonJSモジュールシステム、ファイルシステムAPI、ストリームなど、Node.jsのコアAPIの開発を主導」し、「2年間にわたりプロジェクトのBDFL（終身善意の独裁者）を務め、Node.jsバージョンv0.6からv0.10までの品質向上とビルドプロセスの信頼性確保に貢献しました。」

アイザックはNode.jsの重要な成長期を導き、今日のプラットフォームを形作る標準を確立しました。その後、2014年にnpm, Inc.を設立し、以前は自身で運営していたnpmレジストリのサポートに携わりました。

JavaScriptへの多大な貢献をしてくれたIsaacに感謝し、彼が作成した多くのパッケージを引き続き使用しています。彼の功績は、ソフトウェアの開発方法や、世界中の何百万人もの開発者がコードを共有する方法に変革をもたらしました。

## コードの背後にある建築家：ニック・ボーの旅 {#the-architect-behind-the-code-nick-baughs-journey}

私たちのオープンソースの成功の中心にいるのは、Forward Emailの創設者兼オーナーであるNick Baughです。彼はJavaScriptに20年近く携わり、数え切れないほどの開発者のアプリ開発に影響を与えてきました。彼のオープンソースへの道のりは、技術力とコミュニティリーダーシップの両方を示しています。

### Express技術委員会とコア貢献 {#express-technical-committee-and-core-contributions}

Nickはウェブフレームワークの専門知識を活かし、[エクスプレス技術委員会](https://expressjs.com/en/resources/community.html)に選出されました。そこで彼は、最も利用されているNode.jsフレームワークの一つの開発に貢献しました。現在、Nickは[Expressコミュニティページ](https://expressjs.com/en/resources/community.html)に非アクティブなメンバーとして登録されています。

> \[!IMPORTANT]
> Expressは、Node.jsエコシステムの大部分を形作ってきた、多作なオープンソースコントリビューターであるTJ Holowaychukによって開発されました。私たちはTJの基盤となる取り組みに感謝し、彼の広範なオープンソースへの貢献である[休憩を取る決断](https://news.ycombinator.com/item?id=37687017)に敬意を表します。

[エクスプレス技術委員会](https://expressjs.com/en/resources/community.html) のメンバーとして、Nick は、`req.originalUrl` ドキュメントの明確化や、マルチパートフォームの処理問題の修正などの問題に細心の注意を払いました。

### Koaフレームワークへの貢献 {#koa-framework-contributions}

Nickは、TJ Holowaychuk氏によって開発されたExpressのモダンで軽量な代替ツールである[Koaフレームワーク](https://github.com/koajs/koa)の開発に携わっており、これは彼のWeb開発ツール改善へのコミットメントをさらに示しています。彼はKoaへの貢献として、プルリクエストを通じて問題解決とコード作成の両方に携わり、エラー処理、コンテンツタイプ管理、ドキュメントの改善に取り組んでいます。

Express と Koa の両方での経験により、彼は Node.js Web 開発について独自の視点を持ち、複数のフレームワーク エコシステムで適切に動作するパッケージをチームが作成するのに役立っています。

### 個人貢献者から組織リーダーへ {#from-individual-contributor-to-organization-leader}

既存プロジェクトの支援から始まった活動は、パッケージエコシステム全体の構築と維持へと成長しました。Nickは、[キャビン](https://github.com/cabinjs)、[スパムスキャナー](https://github.com/spamscanner)、[メールを転送する](https://github.com/forwardemail)、[若者](https://github.com/ladjs)、[ブリー](https://github.com/breejs)など、複数のGitHub組織を設立し、それぞれがJavaScriptコミュニティの特定のニーズに応えています。

コントリビューターからリーダーへの転身は、現実の問題を解決する、よく設計されたソフトウェアというニックのビジョンを示しています。関連パッケージを専門分野のGitHub組織にまとめることで、彼はモジュール性と柔軟性を維持しながら、より広範な開発者コミュニティにとって連携するツールエコシステムを構築しました。

## GitHub 組織: イノベーションのエコシステム {#our-github-organizations-ecosystems-of-innovation}

私たちのオープンソース活動は、JavaScriptの特定のニーズを解決する専門分野のGitHub組織を中心に組織化されています。この構造により、モジュール性を維持しながら相互に連携する、まとまりのあるパッケージファミリーが生まれます。

### キャビン: 最新アプリケーション向けの構造化ログ {#cabin-structured-logging-for-modern-applications}

[キャビンの構成](https://github.com/cabinjs)は、シンプルで強力なアプリロギングを実現するソリューションです。メインの[`cabin`](https://github.com/cabinjs/cabin)パッケージは、GitHubで約900個のスターを獲得し、毎週10万回以上ダウンロードされています[^1]。Cabinは、Sentry、LogDNA、Papertrailといった人気サービスと連携する構造化ロギング機能を提供します。

Cabin の特徴は、考え抜かれた API とプラグインシステムです。Express ミドルウェア用の [`axe`](https://github.com/cabinjs/axe) や HTTP リクエスト解析用の [`parse-request`](https://github.com/cabinjs/parse-request) といったサポートパッケージは、孤立したツールではなく、包括的なソリューションへの私たちのコミットメントを示しています。

[`bson-objectid`](https://github.com/cabinjs/bson-objectid)パッケージは特筆に値します。わずか2ヶ月で170万回以上ダウンロードされました\[^2]。この軽量なMongoDB ObjectID実装は、MongoDBに完全に依存せずにIDを必要とする開発者にとって頼りになる存在となっています。

### スパムスキャナ：メールの不正使用と戦う {#spam-scanner-fighting-email-abuse}

[スパムスキャナ組織](https://github.com/spamscanner)は、現実の問題解決への私たちのコミットメントを示しています。メインの[`spamscanner`](https://github.com/spamscanner/spamscanner)パッケージは高度なメールスパム検出機能を提供しますが、驚くほどの普及率を誇っているのは[`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)パッケージです。

2ヶ月間で120万回以上ダウンロードされた\[^3] `url-regex-safe`は、他のURL検出正規表現における重大なセキュリティ問題を修正しています。このパッケージは、オープンソースに対する私たちのアプローチ、すなわち共通の問題（この場合はURL検証における[やり直し](https://en.wikipedia.org/wiki/ReDoS)の脆弱性）を見つけ、確実な解決策を構築し、それを慎重に保守するという姿勢を示しています。

### Bree: ワーカースレッドを使用した最新のジョブスケジューリング {#bree-modern-job-scheduling-with-worker-threads}

[ブリー組織](https://github.com/breejs)は、Node.jsの一般的な課題である信頼性の高いジョブスケジューリングに対する私たちの答えです。GitHubで3,100以上のスターを獲得しているメインの[`bree`](https://github.com/breejs/bree)パッケージは、Node.jsワーカースレッドを使用してパフォーマンスと信頼性を向上させる最新のジョブスケジューラを提供します。

> \[!NOTE]
> Bree は、[議題](https://github.com/agenda/agenda) のメンテナンスに携わった後に開発されました。その経験を活かし、より優れたジョブスケジューラを構築しました。Agenda への貢献は、ジョブスケジューリングの改善方法を見つける上で役立ちました。

Bree が Agenda などの他のスケジューラーと異なる点:

* **外部依存関係なし**: MongoDB を必要とする Agenda とは異なり、Bree はジョブの状態管理に Redis や MongoDB を必要としません。
* **ワーカースレッド**: Bree はサンドボックス化されたプロセスに Node.js ワーカースレッドを使用することで、分離性とパフォーマンスを向上させます。
* **シンプルな API**: Bree はシンプルでありながら詳細な制御を提供し、複雑なスケジュール設定も容易に実装できます。
* **組み込みサポート**: 正常なリロード、cron ジョブ、日付、わかりやすい時刻などの機能がデフォルトで含まれています。

Bree は [forwardemail.net](https://github.com/forwardemail/forwardemail.net) の重要な構成要素であり、メール処理、クリーンアップ、定期メンテナンスといった重要なバックグラウンドタスクを処理します。Forward Email で Bree を使用することは、高い信頼性基準を満たす独自のツールを本番環境で使用し続けるという当社のコミットメントを示すものです。

また、[プール](https://github.com/piscinajs/piscina) のような優れたワーカースレッドパッケージや、[11](https://github.com/nodejs/undici) のような HTTP クライアントも活用し、高く評価しています。Piscina も Bree と同様に、効率的なタスク処理のために Node.js のワーカースレッドを使用しています。undici と piscina の両方をメンテナンスしている [マシュー・ヒル](https://github.com/mcollina) には、Node.js への多大な貢献に感謝いたします。Matteo は Node.js 技術運営委員会のメンバーであり、Node.js の HTTP クライアント機能を大幅に向上させました。

### メール転送: オープンソースのメールインフラストラクチャ {#forward-email-open-source-email-infrastructure}

私たちの最も野心的なプロジェクトは、メール転送、ストレージ、APIサービスを提供するオープンソースのメールサービス「[メールを転送する](https://github.com/forwardemail)」です。メインリポジトリには1,100を超えるGitHubスター[^4]が付けられており、プロプライエタリなメールサービスに代わるこのサービスがコミュニティから高く評価されていることがわかります。

この組織の[`preview-email`](https://github.com/forwardemail/preview-email)パッケージは、2ヶ月間で250万回以上ダウンロードされ[^5]、メールテンプレートを扱う開発者にとって必須のツールとなっています。開発中にメールを簡単にプレビューできる機能を提供することで、メール対応アプリケーションの構築におけるよくある問題点を解決します。

### Lad: 必須の Koa ユーティリティとツール {#lad-essential-koa-utilities-and-tools}

[若者組織](https://github.com/ladjs)は、主にKoaフレームワークエコシステムの強化に重点を置いた、必須のユーティリティとツールのコレクションを提供します。これらのパッケージは、Web開発における一般的な課題を解決し、独立して機能し続けながらもシームレスに連携するように設計されています。

#### koa-better-error-handler: Koa のエラー処理の改善 {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler)は、Koaアプリケーション向けのより優れたエラー処理ソリューションを提供します。GitHubで50以上のスターを獲得しているこのパッケージは、`ctx.throw`がユーザーフレンドリーなエラーメッセージを生成すると同時に、Koaの組み込みエラーハンドラのいくつかの制限に対処します。

* Node.js DNSエラー、Mongooseエラー、Redisエラーを検出し、適切に処理します。
* [ブーム](https://github.com/hapijs/boom)を使用して、一貫性があり、適切にフォーマットされたエラーレスポンスを作成します。
* ヘッダーを保持します（Koaの組み込みハンドラーとは異なります）。
* デフォルトのステータスコード500ではなく、適切なステータスコードを維持します。
* フラッシュメッセージとセッション保持をサポートします。
* 検証エラー用のHTMLエラーリストを提供します。
* 複数のレスポンスタイプ（HTML、JSON、プレーンテキスト）をサポートします。

このパッケージは、Koa アプリケーションでの包括的なエラー管理のために [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) と一緒に使用すると特に役立ちます。

#### パスポート: Lad の認証 {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport)は、人気の認証ミドルウェアPassport.jsを、最新のウェブアプリケーションに特化した機能強化によって拡張します。このパッケージは、複数の認証戦略を標準でサポートしています。

* メールによるローカル認証
* Appleでサインイン
* GitHub認証
* Google認証
* ワンタイムパスワード（OTP）認証

このパッケージは高度なカスタマイズ性を備えており、開発者はアプリケーションの要件に合わせてフィールド名やフレーズを調整できます。Mongooseとシームレスに統合してユーザー管理を行うように設計されているため、堅牢な認証を必要とするKoaベースのアプリケーションに最適なソリューションです。

#### 優雅: エレガントなアプリケーションシャットダウン {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful)は、Node.jsアプリケーションを正常にシャットダウンするという重要な課題を解決します。GitHubで70以上のスターを獲得しているこのパッケージは、データの損失や接続のハングアップを招くことなく、アプリケーションをクリーンに終了することを保証します。主な機能は以下のとおりです。

* HTTPサーバーの正常な終了をサポート (Express/Koa/Fastify)
* データベース接続のクリーンシャットダウンをサポート (MongoDB/Mongoose)
* Redisクライアントの適切な終了をサポート
* Breeジョブスケジューラの処理をサポート
* カスタムシャットダウンハンドラをサポート
* タイムアウト設定を構成可能
* ログシステムとの統合

このパッケージは、予期せぬシャットダウンによってデータの損失や破損が発生する可能性のある本番環境アプリケーションに不可欠です。適切なシャットダウン手順を実装することで、`@ladjs/graceful` はアプリケーションの信頼性と安定性を確保するのに役立ちます。

### Upptime: オープンソースのアップタイム監視 {#upptime-open-source-uptime-monitoring}

[稼働時間組織](https://github.com/upptime)は、透明性とオープンソース性を重視した監視へのコミットメントを表しています。メインの[`upptime`](https://github.com/upptime/upptime)リポジトリはGitHubで13,000以上のスターを獲得しており、私たちが貢献する最も人気のあるプロジェクトの一つとなっています。Upptimeは、GitHubベースのアップタイムモニターとステータスページを提供しており、サーバーを一切必要としません。

弊社では、<https://status.forwardemail.net> にあるステータスページ用に Upptime を使用しており、ソースコードは <https://github.com/forwardemail/status.forwardemail.net>. で入手可能です。

Upptime が特別なのは、そのアーキテクチャです。

* **100% オープンソース**: すべてのコンポーネントは完全にオープンソースで、カスタマイズ可能です。
* **GitHub を基盤としています**: GitHub Actions、Issue、Pages を活用したサーバーレス監視ソリューションです。
* **サーバー不要**: 従来の監視ツールとは異なり、Upptime ではサーバーの運用や保守が不要です。
* **自動ステータスページ**: GitHub Pages でホストできる美しいステータスページを生成します。
* **強力な通知機能**: メール、SMS、Slack など、さまざまな通知チャネルと統合できます。

ユーザーエクスペリエンスの向上のため、forwardemail.net のコードベースに [@octokit/コア](https://github.com/octokit/core.js/) を統合し、リアルタイムのステータス更新とインシデント情報をウェブサイト上で直接表示できるようにしました。この統合により、スタック全体（ウェブサイト、API、MongoDB、Redis、SQLite、SMTP、POP3、IMAP、Bree など）で問題が発生した場合、即時のトースト通知、バッジアイコンの変更、警告色の変更などにより、ユーザーに明確な透明性を提供します。

@octokit/core ライブラリにより、Upptime GitHub リポジトリからリアルタイムデータを取得し、処理して、ユーザーフレンドリーな形式で表示することができます。サービスに障害が発生したり、パフォーマンスが低下したりすると、メインアプリケーションを離れることなく、視覚的なインジケーターを通じて即座に通知されます。このシームレスな統合により、ユーザーは常にシステムの状態に関する最新情報を入手でき、透明性と信頼性が向上します。

Upptimeは、サービスの監視とユーザーへのステータス通知のための透明性と信頼性を求める数百の組織に導入されています。このプロジェクトの成功は、既存のインフラストラクチャ（この場合はGitHub）を活用し、一般的な問題を新しい方法で解決するツールを構築することの力を示しています。

## フォワードメールエコシステムへの貢献 {#our-contributions-to-the-forward-email-ecosystem}

当社のオープンソースパッケージは世界中の開発者に利用されているだけでなく、当社のForward Emailサービスの基盤にもなっています。ツールの作成者とユーザーという二重の役割を担うことで、私たちはツールの実際の応用について独自の視点を持ち、継続的な改善を推進しています。

### パッケージから本番環境へ {#from-packages-to-production}

個々のパッケージから統合された本番システムへと移行するには、慎重な統合と拡張が必要です。Forward Emailの場合、このプロセスには以下のものが含まれます。

* **カスタム拡張機能**: 独自の要件に対応するオープンソースパッケージに、メール固有の拡張機能を構築します。
* **統合パターン**: これらのパッケージが本番環境でどのように連携するかを示すパターンを開発します。
* **パフォーマンス最適化**: 大規模環境でのみ発生するパフォーマンスのボトルネックを特定し、対処します。
* **セキュリティ強化**: メール処理とユーザーデータ保護に特化したセキュリティレイヤーを追加します。

この作業は、コア パッケージ自体を超えた数千時間の開発を意味し、その結果、当社のオープン ソースの貢献を最大限に活用した、堅牢で安全な電子メール サービスが実現しました。

### フィードバックループ {#the-feedback-loop}

自社開発のパッケージを本番環境で使用することの最も大きなメリットは、おそらく、そこから生まれるフィードバックループでしょう。Forward Email で制限事項やエッジケースに遭遇した場合、単にローカルでパッチを当てるだけでなく、基盤となるパッケージを改良することで、サービスとコミュニティ全体の両方にメリットをもたらします。

このアプローチにより多くの改善がもたらされました。

* **Bree の正常なシャットダウン**: Forward Email ではゼロダウンタイムの導入が求められていたため、Bree の正常なシャットダウン機能が強化されました。
* **Spam Scanner のパターン認識**: Forward Email で実際に検出されたスパムパターンが、Spam Scanner の検出アルゴリズムに反映されています。
* **Cabin のパフォーマンス最適化**: 本番環境での大量のログ記録により、Cabin においてすべてのユーザーにメリットをもたらす最適化の余地が明らかになりました。

オープンソースの作業と本番環境のサービスの間でこの好循環を維持することにより、私たちのパッケージは理論的な実装ではなく、実用的で実戦テスト済みのソリューションであり続けることを保証します。

## フォワードメールの基本原則：卓越性の基盤 {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Emailは、すべての開発決定の指針となる一連の基本原則に基づいて設計されています。[Webサイト](/blog/docs/best-quantum-safe-encrypted-email-service#principles)に詳細が記載されているこれらの原則により、開発者にとって使いやすく、安全で、ユーザーのプライバシーに重点を置いたサービスが実現します。

### 常に開発者フレンドリー、セキュリティ重視、透明性 {#always-developer-friendly-security-focused-and-transparent}

私たちの第一の原則は、最高水準のセキュリティとプライバシーを維持しながら、開発者にとって使いやすいソフトウェアを開発することです。私たちは、技術的な卓越性は使いやすさを犠牲にすべきではないと信じており、透明性こそがコミュニティとの信頼関係を築くと考えています。

この原則は、詳細なドキュメント、明確なエラーメッセージ、そして成功と課題の両方に関するオープンなコミュニケーションに反映されています。コードベース全体をオープンソース化することで、精査とコラボレーションを促進し、ソフトウェアとより広範なエコシステムの両方を強化します。

### 実績のあるソフトウェア開発原則の遵守 {#adherence-to-time-tested-software-development-principles}

当社は、数十年にわたってその価値が実証されている、確立されたソフトウェア開発原則をいくつか採用しています。

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Model-View-Controller パターンによる関心の分離
* **[Unix哲学](https://en.wikipedia.org/wiki/Unix_philosophy)**: 1つの機能に特化したモジュール型コンポーネントの作成
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: シンプルかつ分かりやすく
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Don't Repeat Yourself（同じことを繰り返さない）: コードの再利用を促進
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: You Aren Gonna Need It（必要のないものは不要）: 早すぎる最適化の回避
* **[12ファクター](https://12factor.net/)**: モダンでスケーラブルなアプリケーションを構築するためのベストプラクティスの遵守
* **[オッカムの剃刀](https://en.wikipedia.org/wiki/Occam%27s_razor)**: 要件を満たす最もシンプルなソリューションの選択
* **[ドッグフーディング](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: 自社製品を積極的に活用

これらの原則は単なる理論的な概念ではなく、私たちの日々の開発実践に深く根ざしています。例えば、Unix哲学への私たちの忠実さは、npmパッケージの構造にも表れています。npmパッケージは、複雑な問題を解決するために組み合わせることができる、小さくて焦点を絞ったモジュールで構成されています。

### 自力で頑張る開発者をターゲットに {#targeting-the-scrappy-bootstrapped-developer}

私たちは、特に、自力で始めた、[ラーメン利益](https://www.paulgraham.com/ramenprofitable.html) な開発者をターゲットにしています。この目標は、価格設定から技術的な意思決定に至るまで、あらゆる面で私たちの方向性を決定づけています。限られたリソースで製品を構築することの難しさは、私たち自身がその経験を積んできたからこそ理解しています。

この原則は、オープンソースへのアプローチにおいて特に重要です。私たちは、企業の予算がない開発者の現実的な問題を解決するパッケージを作成・維持し、リソースに関わらず誰もが強力なツールを利用できるようにしています。

### 実践原則: 転送メールコードベース {#principles-in-practice-the-forward-email-codebase}

これらの原則は、Forward Emailのコードベースに明確に反映されています。package.jsonファイルには、私たちのコアバリューに沿って厳選された依存関係が示されています。

* メール認証用の`mailauth`などのセキュリティ重視のパッケージ
* デバッグを容易にする`preview-email`などの開発者向けツール
* Sindre Sorhusの各種`p-*`ユーティリティなどのモジュール式コンポーネント

私たちは、これらの原則を一貫して遵守することで、開発者がメール インフラストラクチャを安心して利用できる、安全で信頼性が高く、オープン ソース コミュニティの価値観に沿ったサービスを構築してきました。

### プライバシーバイデザイン {#privacy-by-design}

プライバシーは、Forward Email にとって後付けの機能でもマーケティング機能でもありません。サービスとコードのあらゆる側面に反映される基本的な設計原則です。

* **ゼロアクセス暗号化**: ユーザーのメールを技術的に読むことが不可能になるシステムを導入しています。
* **最小限のデータ収集**: サービス提供に必要なデータのみを収集し、それ以上のデータは収集しません。
* **透明性の高いポリシー**: 当社のプライバシーポリシーは、法律用語を使わず、明確で理解しやすい言葉で書かれています。
* **オープンソース検証**: 当社のオープンソースコードベースにより、セキュリティ研究者が当社のプライバシーに関する主張を検証できます。

この取り組みは、セキュリティとプライバシーのベストプラクティスを最初から組み込んで設計されたオープンソース パッケージにも適用されます。

### 持続可能なオープンソース {#sustainable-open-source}

オープンソースソフトウェアが長期的に発展していくためには、持続可能なモデルが必要だと私たちは考えています。私たちのアプローチは以下のとおりです。

* **商用サポート**: オープンソースツールに関するプレミアムサポートとサービスを提供します。
* **バランスの取れたライセンス**: ユーザーの自由とプロジェクトの持続可能性の両方を保護するライセンスを使用します。
* **コミュニティエンゲージメント**: 貢献者と積極的に関わり、協力的なコミュニティを構築します。
* **透明性の高いロードマップ**: ユーザーが適切な計画を立てられるよう、開発計画を共有します。

持続可能性に重点を置くことで、オープンソースへの貢献が放置されることなく、時間の経過とともに成長し、改善し続けることができるようになります。

## 数字は嘘をつかない：驚異的なnpmダウンロード統計 {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

オープンソースソフトウェアの影響について語る際、ダウンロード統計は採用と信頼の具体的な指標となります。私たちが維持管理に携わっているパッケージの多くは、ダウンロード数が数十億件に上り、他のオープンソースプロジェクトではほとんど達成できない規模に達しています。

![ダウンロード数上位のnpmパッケージ](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> JavaScriptエコシステムにおいて、ダウンロード数の多いパッケージの保守に携わっていることを誇りに思いますが、これらのパッケージの多くは元々、他の才能ある開発者によって作成されたものであることをご理解いただきたいと思います。superagentやsupertestといったパッケージは、TJ Holowaychuk氏によって作成されました。同氏はオープンソースへの多大な貢献を通じて、Node.jsエコシステムの形成に大きく貢献してきました。

### 私たちの影響の鳥瞰図 {#a-birds-eye-view-of-our-impact}

2025 年 2 月から 3 月までのわずか 2 か月間で、当社が貢献し維持に貢献しているトップ パッケージは、驚異的なダウンロード数を記録しました。

* **[スーパーエージェント](https://www.npmjs.com/package/superagent)**: 84,575,829 ダウンロード\[^7] (TJ Holowaychuk 氏作成)
* **[スーパーテスト](https://www.npmjs.com/package/supertest)**: 76,432,591 ダウンロード\[^8] (TJ Holowaychuk 氏作成)
* **[また](https://www.npmjs.com/package/koa)**: 28,539,295 ダウンロード\[^34] (TJ Holowaychuk 氏作成)
* **[@koa/ルーター](https://www.npmjs.com/package/@koa/router)**: 11,007,327 ダウンロード\[^35]
* **[koaルーター](https://www.npmjs.com/package/koa-router)**: 3,498,918 ダウンロード\[^36]
* **[URL正規表現](https://www.npmjs.com/package/url-regex)**: 2,819,520ダウンロード数\[^37]
* **[プレビューメール](https://www.npmjs.com/package/preview-email)**: 2,500,000 ダウンロード\[^9]
* **[キャビン](https://www.npmjs.com/package/cabin)**: 1,800,000 ダウンロード\[^10]
* **[@breejs/後で](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 ダウンロード\[^38]
* **[メールテンプレート](https://www.npmjs.com/package/email-templates)**: 1,128,139 ダウンロード\[^39]
* **__PROTECTED_LINK_259__0**: 1,124,686 ダウンロード\[^40]
* **__PROTECTED_LINK_259__1**: 1,200,000 ダウンロード\[^11]
* **__PROTECTED_LINK_259__2**: 894,666ダウンロード数\[^41]
* **__PROTECTED_LINK_259__3**: 839,585 ダウンロード数\[^42]
* **__PROTECTED_LINK_259__4**: 145,000 ダウンロード数\[^12]
* **__PROTECTED_LINK_259__5**: 24,270 ダウンロード数\[^30]

> \[!NOTE]
> 私たちがメンテナンスに協力しているものの、開発元ではない他のパッケージの中には、`form-data` (7億3,800万回以上)、`toidentifier` (3億900万回以上)、`stackframe` (1億1,600万回以上)、`error-stack-parser` (1億1,300万回以上) など、さらにダウンロード数が多いものがあります。私たちは、これらのパッケージの作者の功績を尊重しながら、貢献できることを光栄に思っています。

これらは単なる印象的な数字ではありません。私たちがメンテナンスを手伝っているコードを使って、実際の開発者が実際の問題を解決していることを示しています。ダウンロードされるたびに、これらのパッケージが、趣味のプロジェクトから数百万人が利用するエンタープライズアプリケーションまで、誰かにとって意義のあるものの構築に役立ったことが分かります。

![パッケージカテゴリの配布](/img/art/category_pie_chart.svg)

### 大規模な毎日のインパクト {#daily-impact-at-scale}

日々のダウンロードパターンは、一貫して大量の利用が見受けられ、ピーク時には1日あたり数百万ダウンロードに達する[^13]。この一貫性は、これらのパッケージの安定性と信頼性を物語っています。開発者は単に試用するだけでなく、コアワークフローに統合し、日々頼りにしているのです。

週ごとのダウンロードパターンはさらに印象的な数字を示しており、毎週数千万ダウンロード前後で安定的に推移しています\[^14]。これはJavaScriptエコシステムにおける巨大な足跡であり、これらのパッケージは世界中の本番環境で稼働しています。

### 生の数字を超えて {#beyond-the-raw-numbers}

ダウンロード統計はそれ自体が印象的ですが、コミュニティがこれらのパッケージに寄せる信頼の深さを物語っています。この規模のパッケージを維持するには、以下の揺るぎないコミットメントが必要です。

* **後方互換性**: 既存の実装を損なわないように、変更は慎重に検討する必要があります。
* **セキュリティ**: 数百万ものアプリケーションがこれらのパッケージに依存しているため、セキュリティ上の脆弱性が広範囲に及ぶ可能性があります。
* **パフォーマンス**: この規模では、わずかなパフォーマンスの向上でも、全体として大きなメリットをもたらす可能性があります。
* **ドキュメント**: あらゆる経験レベルの開発者が使用するパッケージには、明確で包括的なドキュメントが不可欠です。

ダウンロード数が長期にわたって一貫して増加していることは、これらのコミットメントを達成し、信頼性が高く、適切に管理されたパッケージを通じて開発者コミュニティとの信頼関係を構築できたことを反映しています。

## エコシステムのサポート：オープンソーススポンサーシップ {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> オープンソースの持続可能性とは、単にコードを提供することだけではありません。重要なインフラを維持する開発者を支援することも重要です。

JavaScriptエコシステムへの直接的な貢献に加え、多くの最新アプリケーションの基盤を形成する著名なNode.jsコントリビューターをスポンサーとして支援できることを誇りに思います。具体的なスポンサーシップは以下の通りです。

### Andris Reinman: 電子メールインフラストラクチャのパイオニア {#andris-reinman-email-infrastructure-pioneer}

[アンドリス・ラインマン](https://github.com/andris9)は、毎週1,400万回以上ダウンロードされているNode.js向け最も人気のあるメール送信ライブラリである[ノードメーラー](https://github.com/nodemailer/nodemailer)の開発者です[^15]。彼の功績は、[SMTPサーバー](https://github.com/nodemailer/smtp-server)、[メールパーサー](https://github.com/nodemailer/mailparser)、[ワイルドダック](https://github.com/nodemailer/wildduck)といった、メール基盤の重要なコンポーネントにも及びます。

当社のスポンサーシップにより、当社独自のメール転送サービスを含む、無数の Node.js アプリケーションのメール通信を強化する重要なツールの継続的なメンテナンスと開発が保証されます。

### シンドレ・ソルフス: ユーティリティ パッケージの首謀者 {#sindre-sorhus-utility-package-mastermind}

[シンドレ・ソルフス](https://github.com/sindresorhus)は、JavaScriptエコシステムにおいて最も多作なオープンソースコントリビューターの一人であり、1,000を超えるnpmパッケージを開発しています。彼が開発した[pマップ](https://github.com/sindresorhus/p-map)、[p-再試行](https://github.com/sindresorhus/p-retry)、[is-stream](https://github.com/sindresorhus/is-stream)といったユーティリティは、Node.jsエコシステム全体で使用される基本的な構成要素となっています。

Sindre の作業を後援することで、JavaScript 開発の効率と信頼性を高めるこれらの重要なユーティリティの開発を持続的に支援します。

これらのスポンサーシップは、より広範なオープンソース・エコシステムへの私たちのコミットメントを反映しています。私たちの成功は、これらの貢献者をはじめとする多くの貢献者によって築かれた基盤の上に築かれていることを認識しており、エコシステム全体の持続可能性を確保することに尽力しています。

## JavaScriptエコシステムのセキュリティ脆弱性の発見 {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

私たちのオープンソースへの取り組みは、機能開発にとどまらず、数百万人の開発者に影響を与える可能性のあるセキュリティ上の脆弱性の特定と対処にも及びます。JavaScriptエコシステムへの私たちの最も重要な貢献のいくつかは、セキュリティの分野におけるものです。

### Koaルーターの救済 {#the-koa-router-rescue}

2019年2月、ニックは人気のkoa-routerパッケージのメンテナンスに重大な問題があることを発見しました。[Hacker Newsで報道](https://news.ycombinator.com/item?id=19156707)によると、このパッケージは元のメンテナーによって放棄されており、セキュリティ上の脆弱性は未解決のまま、コミュニティはアップデートを利用できない状態でした。

> \[!WARNING]
> セキュリティ上の脆弱性を持つ放置されたパッケージは、特に毎週数百万回ダウンロードされる場合、エコシステム全体に重大なリスクをもたらします。

これを受けて、ニックは[@koa/ルーター](https://github.com/koajs/router)を作成し、コミュニティに状況を知らせる手助けをしました。それ以来、彼はこの重要なパッケージのメンテナンスに携わり、Koaユーザーが安全で適切に管理されたルーティングソリューションを利用できるようにしています。

### ReDoS脆弱性への対処 {#addressing-redos-vulnerabilities}

2020年、Nickは広く使用されている`url-regex`パッケージにおける重大な[正規表現によるサービス拒否（ReDoS）](https://en.wikipedia.org/wiki/ReDoS)脆弱性を特定し、対処しました。この脆弱性（[SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)）により、攻撃者は細工した入力を提供することで正規表現に致命的なバックトラッキングを引き起こし、サービス拒否攻撃を引き起こす可能性があります。

Nickは、既存のパッケージに単にパッチを当てるのではなく、元のAPIとの互換性を維持しながら脆弱性に対処する、完全に書き直した実装である[`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)を作成しました。また、脆弱性とその軽減方法を説明した[包括的なブログ投稿](/blog/docs/url-regex-javascript-node-js)も公開しました。

この作業は、セキュリティに対する私たちのアプローチを示しています。問題を修正するだけでなく、コミュニティを教育し、将来同様の問題を防ぐ強力な代替手段を提供します。

### Node.js と Chromium のセキュリティの推進 {#advocating-for-nodejs-and-chromium-security}

Nickは、より広範なエコシステムにおけるセキュリティ改善の推進にも積極的に取り組んでいます。2020年8月には、Node.jsにおけるHTTPヘッダーの処理に関連する重大なセキュリティ問題を特定し、[ザ・レジスター](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/)で報告しました。

この問題はChromiumのパッチに起因しており、攻撃者がセキュリティ対策を回避できる可能性があります。Nickの支援により、この問題は迅速に解決され、数百万ものNode.jsアプリケーションが潜在的な悪用から保護されました。

### npmインフラストラクチャのセキュリティ保護 {#securing-npm-infrastructure}

同月後半、ニックはnpmのメールインフラに新たな重大なセキュリティ問題を発見しました。[ザ・レジスター](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/)で報告されているように、npmはDMARC、SPF、DKIMといったメール認証プロトコルを適切に実装しておらず、攻撃者がnpmを装ったフィッシングメールを送信できる可能性がありました。

Nick のレポートにより、npm の電子メール セキュリティ体制が改善され、パッケージ管理に npm を利用している何百万人もの開発者が潜在的なフィッシング攻撃から保護されるようになりました。

## フォワードメールエコシステムへの貢献 {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Emailは、Nodemailer、WildDuck、mailauthといった重要なオープンソースプロジェクトを基盤として構築されています。私たちのチームはこれらのプロジェクトに多大な貢献をし、メール配信とセキュリティに影響を与える深刻な問題の特定と解決に貢献してきました。

### Nodemailerのコア機能の強化 {#enhancing-nodemailers-core-functionality}

[ノードメーラー](https://github.com/nodemailer/nodemailer) は Node.js でのメール送信のバックボーンであり、私たちの貢献により、より堅牢なものとなっています。

* **SMTPサーバーの改善**: SMTPサーバーコンポーネントの解析バグ、ストリーム処理の問題、TLS構成の問題を修正しました\[^16]\[^17]。
* **メールパーサーの機能強化**: メール処理の失敗の原因となる可能性があった文字シーケンスのデコードエラーとアドレスパーサーの問題を修正しました\[^18]\[^19]。

これらの貢献により、Nodemailer は、Forward Email を含む Node.js アプリケーションでの電子メール処理の信頼できる基盤であり続けます。

### Mailauth によるメール認証の強化 {#advancing-email-authentication-with-mailauth}

[マイラウス](https://github.com/postalsys/mailauth) は重要な電子メール認証機能を提供しており、私たちの貢献によりその機能が大幅に改善されました。

* **DKIM認証の改善**: X/TwitterのDNSキャッシュに問題があり、送信メッセージでDKIM認証が失敗する可能性があることを発見し、Hacker Oneに報告しました\[^20]。
* **DMARCとARCの機能強化**: DMARCとARC認証において、認証結果が不正確になる可能性があった問題を修正しました\[^21]\[^22]。
* **パフォーマンスの最適化**: メール認証プロセスのパフォーマンスを向上させる最適化を行いました\[^23]\[^24]\[^25]\[^26]。

これらの改善により、電子メール認証の正確性と信頼性が確保され、ユーザーをフィッシングやスプーフィング攻撃から保護できるようになります。

### 主要なアップタイムの強化 {#key-upptime-enhancements}

Upptime への当社の貢献は次のとおりです。

* **SSL証明書の監視**: SSL証明書の有効期限を監視する機能を追加し、証明書の有効期限切れによる予期せぬダウンタイムを防止しました\[^27]。
* **複数のSMS番号のサポート**: インシデント発生時に複数のチームメンバーにSMSでアラートを送信できるサポートを実装し、対応時間を短縮しました\[^28]。
* **IPv6チェックの修正**: IPv6接続チェックの問題を修正し、最新のネットワーク環境における監視精度を向上させました\[^29]。
* **ダーク/ライトモードのサポート**: ステータスページのユーザーエクスペリエンスを向上させるため、テーマのサポートを追加しました\[^31]。
* **TCP Pingサポートの強化**: TCP Ping機能を強化し、より信頼性の高い接続テストを実現しました\[^32]。

これらの改善は、Forward Email のステータス監視に役立つだけでなく、Upptime ユーザー コミュニティ全体で利用可能であり、私たちが依存しているツールを改善するという取り組みを示しています。

## すべてをまとめる接着剤: 大規模なカスタムコード {#the-glue-that-holds-it-all-together-custom-code-at-scale}

npmパッケージや既存プロジェクトへの貢献は重要ですが、私たちの技術的専門知識を真に体現しているのは、これらのコンポーネントを統合するカスタムコードです。Forward Emailのコードベースは、プロジェクトが[無料メール転送](https://github.com/forwardemail/free-email-forwarding)として始まり、モノレポジトリに統合される前の2017年に遡る、10年にわたる開発努力の成果です。

### 大規模な開発努力 {#a-massive-development-effort}

このカスタム統合コードの規模は印象的です。

* **総貢献数**: 3,217件以上のコミット
* **コードベースサイズ**: JavaScript、Pug、CSS、JSONファイル合わせて421,545行以上のコード\[^33]

これは、数千時間の開発作業、デバッグセッション、そしてパフォーマンス最適化の成果です。個々のパッケージを、数千人のお客様が毎日利用する、統合された信頼性の高いサービスへと変える「秘密のソース」なのです。

### コア依存関係の統合 {#core-dependencies-integration}

Forward Email のコードベースは、多数の依存関係をシームレスに統合します。

* **メール処理**: 送信にはNodemailer、受信にはSMTPサーバー、解析にはMailparserを統合
* **認証**: DKIM、SPF、DMARC、ARC検証にはMailauthを使用
* **DNS解決**: グローバルキャッシュを備えたDNS-over-HTTPSにTangerineを活用
* **MX接続**: 信頼性の高いメールサーバー接続のために、Tangerine統合のmx-connectを使用
* **ジョブスケジューリング**: ワーカースレッドによる信頼性の高いバックグラウンドタスク処理のためにBreeを採用
* **テンプレート**: 顧客とのコミュニケーションでウェブサイトのスタイルシートを再利用できるように、メールテンプレートを採用
* **メールストレージ**: 量子耐性プライバシーのために、ChaCha20-Poly1305暗号化とbetter-sqlite3-multiple-ciphersを使用して個別に暗号化されたSQLiteメールボックスを実装。ユーザー間の完全な分離と、ユーザーのみがメールボックスにアクセスできるようにします。

これらの統合は、エッジケース、パフォーマンスへの影響、セキュリティ上の懸念事項を慎重に検討する必要があります。その結果、数百万件ものメールトランザクションを確実に処理できる堅牢なシステムが実現しました。SQLite実装では、効率的なバイナリシリアル化のためにmsgpackrを活用し、インフラストラクチャ全体のリアルタイムステータス更新のためにWebSocket（ws経由）も活用しています。

### Tangerineとmx-connectを使用したDNSインフラストラクチャ {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Email のインフラストラクチャの重要なコンポーネントは、次の 2 つの主要パッケージを中心に構築された DNS 解決システムです。

* **[タンジェリン](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: 当社の Node.js DNS-over-HTTPS 実装は、再試行、タイムアウト、スマート サーバー ローテーション、およびキャッシュ サポートが組み込まれており、標準の DNS リゾルバーの代替として利用できます。

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: このパッケージは、ターゲット ドメインまたは電子メール アドレスを取得し、適切な MX サーバーを解決して、優先順位に従って接続することで、MX サーバーへの TCP 接続を確立します。

当社は [プルリクエスト #4](https://github.com/zone-eu/mx-connect/pull/4) により、Forward Email 全体でアプリケーション層の DNS over HTTP リクエストが確保されます。これにより、あらゆるリージョン、アプリ、プロセスにわたって 1:1 の一貫性を保ちながら、大規模な DNS グローバルキャッシュが実現します。これは、分散システムにおける信頼性の高いメール配信に不可欠です。

## エンタープライズへの影響：オープンソースからミッションクリティカルなソリューションへ {#enterprise-impact-from-open-source-to-mission-critical-solutions}

10 年にわたるオープンソース開発の集大成として、Forward Email は個人開発者だけでなく、オープンソース運動の根幹を成す大企業や教育機関にもサービスを提供できるようになりました。

### ミッションクリティカルなメールインフラストラクチャのケーススタディ {#case-studies-in-mission-critical-email-infrastructure}

信頼性、プライバシー、そしてオープンソース原則へのコミットメントにより、Forward Email は厳しいメール要件を持つ組織にとって信頼できる選択肢となっています。

* **教育機関**：[卒業生向けメール転送のケーススタディ] で詳しく説明されている通りです。](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) を通じて Tangerine を mx-connect と統合しました。大手大学は、信頼性の高い電子メール転送サービスを通じて数十万人の卒業生との生涯にわたるつながりを維持するために当社のインフラストラクチャを活用しています。

* **エンタープライズ Linux ソリューション**: [Canonical Ubuntuメールエンタープライズのケーススタディ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) は、当社のオープン ソース アプローチがエンタープライズ Linux プロバイダーのニーズに完全に適合し、必要な透明性と制御を提供していることを示しています。

* **オープン ソース ファウンデーション**: [Linux Foundation のメールエンタープライズケーススタディ](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) に記載されているように、当社の最も有効な点は Linux Foundation とのパートナーシップです。当社のサービスは、Linux 開発を管理する組織のコミュニケーションを強化します。

長年にわたり丁寧にメンテナンスされてきたオープンソースパッケージのおかげで、オープンソースソフトウェアを推進するコミュニティや組織を支えるメールサービスを構築できたという、実に美しい対称性があります。個々のパッケージの提供から、オープンソースリーダーのためのエンタープライズグレードのメールインフラの構築に至るまで、この循環的な道のりは、私たちのソフトウェア開発へのアプローチの究極の証です。

## オープンソースの10年：今後の展望 {#a-decade-of-open-source-looking-forward}

過去 10 年間のオープンソースへの貢献を振り返り、次の 10 年を展望するとき、私たちは私たちの取り組みを支えてくれたコミュニティへの感謝の気持ちと、これから起こることへの期待で胸がいっぱいです。

個々のパッケージ貢献者から、大企業やオープンソース財団が利用する包括的なメールインフラのメンテナーへと成長した私たちの道のりは、目覚ましいものでした。これは、オープンソース開発の力、そして思慮深く適切にメンテナンスされたソフトウェアが広範なエコシステムに与える影響力の証です。

今後数年間、私たちは以下のことに取り組んでいきます。

* **既存パッケージの保守と改善を継続し**、世界中の開発者にとって信頼できるツールであり続けるよう努めます。
* **特にメールとセキュリティ分野における重要なインフラプロジェクトへの貢献を拡大します。
* **プライバシー、セキュリティ、透明性への取り組みを維持しながら、Forward Email の機能を強化します。**
* **メンターシップ、スポンサーシップ、コミュニティへの関与を通じて、次世代のオープンソース貢献者を支援します。**

私たちは、ソフトウェア開発の未来はオープンで、協調的で、信頼の基盤の上に築かれると信じています。JavaScriptエコシステムに、高品質でセキュリティ重視のパッケージを継続的に提供することで、その未来を築くための小さな役割を担えればと考えています。

私たちのパッケージをご利用いただいた皆様、プロジェクトに貢献してくださった皆様、問題を報告してくださった皆様、そして私たちの活動について広めてくださった皆様、誠にありがとうございます。皆様のご支援のおかげで、この10年間の成果を上げることができました。これからの10年間、共に何を達成できるか、楽しみにしています。

\[^1]: Cabin の npm ダウンロード統計、2025年4月
\[^2]: bson-objectid の npm ダウンロード統計、2025年2月～3月
\[^3]: url-regex-safe の npm ダウンロード統計、2025年4月
\[^4]: forwardemail/forwardemail.net の GitHub スター数（2025年4月時点）
\[^5]: preview-email の npm ダウンロード統計、2025年4月
\[^7]: superagent の npm ダウンロード統計、2025年2月～3月
\[^8]: supertest の npm ダウンロード統計、2025年2月～3月
\[^9]: preview-email の npm ダウンロード統計、2025年2月～3月
\[^10]: Cabin の npm ダウンロード統計、2025年2月～3月
\[^11]: url-regex-safe の npm ダウンロード統計2025年2月～3月
\[^12]: spamscanner の npm ダウンロード統計、2025年2月～3月
\[^13]: npm 統計からの日次ダウンロードパターン、2025年4月
\[^14]: npm 統計からの週次ダウンロードパターン、2025年4月
\[^15]: nodemailer の npm ダウンロード統計、2025年4月
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Upptime リポジトリの GitHub の問題に基づいています
\[^28]: Upptime リポジトリの GitHub の問題に基づいています
\[^29]: Upptime リポジトリの GitHub の問題に基づいています
\[^30]: bree の npm ダウンロード統計 (2025 年 2 月～3 月)
\[^31]: Upptime への GitHub プルリクエストに基づいています
\[^32]: Upptime への GitHub プルリクエストに基づいています
\[^34]: koa の npm ダウンロード統計 (2025 年 2 月～3 月)
\[^35]: @koa/router の npm ダウンロード統計 (2025 年 2 月～3 月) 2025
\[^36]: koa-router の npm ダウンロード統計、2025年2月～3月
\[^37]: url-regex の npm ダウンロード統計、2025年2月～3月
\[^38]: @breejs/later の npm ダウンロード統計、2025年2月～3月
\[^39]: email-templates の npm ダウンロード統計、2025年2月～3月
\[^40]: get-paths の npm ダウンロード統計、2025年2月～3月
\[^41]: dotenv-parse-variables の npm ダウンロード統計、2025年2月～3月
\[^42]: @koa/multer の npm ダウンロード統計、2025年2月～3月