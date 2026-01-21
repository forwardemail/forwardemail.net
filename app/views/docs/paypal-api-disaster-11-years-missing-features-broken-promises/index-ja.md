# PayPal の 11 年間にわたる API 問題: 開発者を無視する中で、私たちがどのように回避策を構築したか {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Forward Emailでは、10年以上にわたりPayPalのAPIの不具合に対処してきました。最初は些細な不満だったものが、完全なる大惨事へと発展し、独自の回避策を構築し、フィッシング詐欺テンプレートをブロックせざるを得なくなり、最終的には重要なアカウント移行中にPayPalでのすべての決済を停止せざるを得なくなりました。</p>
<p class="lead mt-3">これは、PayPalが開発者の基本的なニーズを無視し、私たちがPayPalのプラットフォームを機能させるためにあらゆる努力を尽くした11年間の物語です。</p>

## 目次 {#table-of-contents}

* [欠けている部分：サブスクリプションをリストする方法がない](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017年: 問題が浮上](#2014-2017-the-problem-emerges)
* [2020年：徹底的なフィードバックを提供](#2020-we-give-them-extensive-feedback)
  * [27項目のフィードバックリスト](#the-27-item-feedback-list)
  * [チームが参加し、約束が交わされた](#teams-got-involved-promises-were-made)
  * [結果？何もなかった。](#the-result-nothing)
* [経営陣の大量流出：PayPalが組織としての記憶を完全に失った経緯](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025年：新たなリーダーシップ、同じ問題](#2025-new-leadership-same-problems)
  * [新CEOが関与](#the-new-ceo-gets-involved)
  * [ミシェル・ギルの回答](#michelle-gills-response)
  * [私たちの対応：もう会議は不要](#our-response-no-more-meetings)
  * [マーティ・ブロドベックの過剰エンジニアリングへの対応](#marty-brodbecks-overengineering-response)
  * [「シンプルなCRUD」の矛盾](#the-simple-crud-contradiction)
  * [断絶が明らかになる](#the-disconnect-becomes-clear)
* [何年も無視されてきたバグレポート](#years-of-bug-reports-they-ignored)
  * [2016年: 初期のUI/UXに関する苦情](#2016-early-uiux-complaints)
  * [2021年：ビジネスメールのバグレポート](#2021-business-email-bug-report)
  * [2021: UI改善の提案](#2021-ui-improvement-suggestions)
  * [2021年：サンドボックス環境の失敗](#2021-sandbox-environment-failures)
  * [2021年：報告システムが完全に崩壊](#2021-reports-system-completely-broken)
  * [2022年：コアAPI機能が（再び）欠落](#2022-core-api-feature-missing-again)
* [開発者エクスペリエンスの悪夢](#the-developer-experience-nightmare)
  * [壊れたユーザーインターフェース](#broken-user-interface)
  * [SDKの問題](#sdk-problems)
  * [コンテンツセキュリティポリシー違反](#content-security-policy-violations)
  * [ドキュメントの混乱](#documentation-chaos)
  * [セキュリティの脆弱性](#security-vulnerabilities)
  * [セッション管理の災害](#session-management-disaster)
* [2025年7月：最後の一撃](#july-2025-the-final-straw)
* [PayPalを廃止できない理由](#why-we-cant-just-drop-paypal)
* [コミュニティの回避策](#the-community-workaround)
* [フィッシング対策のためPayPalテンプレートをブロック](#blocking-paypal-templates-due-to-phishing)
  * [本当の問題：PayPalのテンプレートは詐欺のように見える](#the-real-problem-paypals-templates-look-like-scams)
  * [私たちの実装](#our-implementation)
  * [PayPalをブロックしなければならなかった理由](#why-we-had-to-block-paypal)
  * [問題の規模](#the-scale-of-the-problem)
  * [皮肉](#the-irony)
  * [現実世界への影響：新しいPayPal詐欺](#real-world-impact-novel-paypal-scams)
* [PayPalの逆KYCプロセス](#paypals-backwards-kyc-process)
  * [どのように機能するか](#how-it-should-work)
  * [PayPalの実際の仕組み](#how-paypal-actually-works)
  * [現実世界への影響](#the-real-world-impact)
  * [2025年7月のアカウント移行災害](#the-july-2025-account-migration-disaster)
  * [これがなぜ重要なのか](#why-this-matters)
* [他の決済処理業者がどのようにして正しく処理しているか](#how-every-other-payment-processor-does-it-right)
  * [ストライプ](#stripe)
  * [パドル](#paddle)
  * [コインベースコマース](#coinbase-commerce)
  * [四角](#square)
  * [業界標準](#the-industry-standard)
  * [PayPalと比較して他のプロセッサが提供するもの](#what-other-processors-provide-vs-paypal)
* [PayPalの組織的隠蔽：600万人の声を封じる](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [大いなる消滅](#the-great-erasure)
  * [第三者による救助](#the-third-party-rescue)
* [11年間続いたキャプチャーバグ災害：1,899ドル以上](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [メール転送で1,899ドルの損失](#forward-emails-1899-loss)
  * [2013年版報告書：11年以上の過失](#the-2013-original-report-11-years-of-negligence)
  * [2016年の告白：PayPalが自社のSDKを破壊](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024年のエスカレーション：依然として破綻](#the-2024-escalation-still-broken)
  * [Webhookの信頼性の惨事](#the-webhook-reliability-disaster)
  * [組織的過失のパターン](#the-pattern-of-systematic-negligence)
  * [文書化されていない要件](#the-undocumented-requirement)
* [PayPalの広範な詐欺パターン](#paypals-broader-pattern-of-deception)
  * [ニューヨーク州金融サービス局の行動](#the-new-york-department-of-financial-services-action)
  * [ハニー訴訟：アフィリエイトリンクの書き換え](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPalの過失による損失](#the-cost-of-paypals-negligence)
  * [文書の嘘](#the-documentation-lie)
* [開発者にとってこれが何を意味するか](#what-this-means-for-developers)

## 欠けている部分: サブスクリプションを一覧表示する方法がない {#the-missing-piece-no-way-to-list-subscriptions}

驚くべき事実は、PayPal は 2014 年からサブスクリプションの請求サービスを提供しているにもかかわらず、販売者が独自のサブスクリプションをリストする方法を一度も提供していないことです。

少し考えてみてください。サブスクリプションは作成でき、IDがあればキャンセルできますが、アカウントでアクティブなサブスクリプションの一覧を取得することはできません。SELECT文のないデータベースのようなものです。

基本的なビジネス運営にはこれが必要です:

* カスタマーサポート（サブスクリプションに関するお問い合わせメール対応）
* 財務報告と残高調整
* 自動請求管理
* コンプライアンスと監査

でも PayPal はどうですか? 彼らはそれを...作らなかったんです。

## 2014-2017: 問題発生 {#2014-2017-the-problem-emerges}

サブスクリプションのリストの問題は、2017 年に PayPal のコミュニティ フォーラムで初めて発生しました。開発者は当然の質問をしていました。「自分のサブスクリプションのリストを取得するにはどうすればいいですか?」

PayPal の反応は？ 無反応。

コミュニティのメンバーはイライラし始めました。

> 「販売者が有効な契約をすべてリストアップできないというのは、非常に奇妙な省略です。契約IDが失われると、ユーザーのみが契約をキャンセルまたは一時停止できることになります。」 - leafspider

> 「+1。もう3年近く経ちました。」 - laudukang (つまり、問題は2014年から存在していた)

2017年の[オリジナルのコミュニティ投稿](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066)は、開発者がこの基本機能の実現を強く求めていたことを示しています。PayPalの対応は、問題が報告されていたリポジトリをアーカイブすることでした。

## 2020: 徹底的なフィードバックを提供します {#2020-we-give-them-extensive-feedback}

2020年10月、PayPalから正式なフィードバックセッションの依頼がありました。これは単なる雑談ではなく、Sri Shivananda（CTO）、Edwin Aoki、Jim Magats、John Kunzeなど、PayPalの幹部8名と45分間のMicrosoft Teams通話を組んで行われたのです。

### 27項目のフィードバックリスト {#the-27-item-feedback-list}

準備万端で臨みました。6時間かけてAPIとの連携を試みた結果、27個の具体的な問題点が浮かび上がりました。PayPal Checkoutチームのマーク・スチュアート氏は次のように述べています。

> ニックさん、今日は皆さんとシェアしてくれてありがとう！これがきっかけで、私たちのチームがこれらの問題解決に向けてさらにサポートと投資を得られるようになると思います。これまで、あなたが残してくれたような充実したフィードバックを得るのはなかなか難しかったんです。

フィードバックは理論的なものではなく、実際の統合の試みから得られたものです。

1. **アクセス トークンの生成が機能しない**:

> アクセストークンの生成が機能していません。また、cURLの例以外にも、もっと多くの例があるはずです。

2. **サブスクリプション作成用のWeb UIはありません**:

> cURLを使わずにサブスクリプションを作成するにはどうすればいいのでしょうか？StripeのようなWeb UIは存在しないようです。

Mark Stuart 氏は、アクセス トークンの問題が特に次の点に関係していると考えました。

> アクセス トークンの生成に関する問題は、通常は聞かれません。

### チームが参加し、約束がなされました {#teams-got-involved-promises-were-made}

新たな問題が発見されるにつれ、PayPalは会話にさらに多くのチームを追加していきました。サブスクリプション管理UIチームのDarshan Raju氏が参加し、次のように述べました。

> ギャップを認識しました。今後、この問題を追跡し、対処いたします。フィードバックをいただき、ありがとうございました。

このセッションでは、次のことが求められていると説明されています。

> あなたの経験を率直に語る

に：

> PayPal を開発者にとって最適なものにします。

### 結果？何もなし。{#the-result-nothing}

正式なフィードバック セッション、27 項目の広範なリスト、複数のチームの関与、および次の約束にもかかわらず、

> 追跡とアドレス

問題はまったく解決されませんでした。

## 幹部の大量流出：PayPalが組織としての記憶を失ってしまった経緯 {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

ここからが本当に面白いところです。2020年のフィードバックを受け取った人全員がPayPalを去っています。

**リーダーシップの変更:**

* [ダン・シュルマン（CEO、9年間）→アレックス・クリス](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (2023年9月)
* [Sri Shivananda（フィードバックを整理したCTO）→JPモルガン・チェース](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (2024年1月)

**約束して去った技術リーダー:**

* **マーク・スチュアート** (フィードバックは「触媒」となると約束) → [リップル社に入社](https://www.linkedin.com/in/markstuartsf)
* **ジム・マガッツ** (PayPal 18年目のベテラン) → [MXのCEO](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022年)
* **ジョン・クンツェ** (グローバルコンシューマープロダクト担当バイスプレジデント) → [引退](https://www.linkedin.com/in/john-kunze-5724a86) (2023年)
* **エドウィン・アオキ** (最後の一人) → [ナスダックへ出発しました](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (2025年1月)

PayPal は、幹部が開発者のフィードバックを集め、約束を交わし、その後 JP モルガン、リップル、その他のフィンテック企業など、より優れた企業へと移る、回転ドアのような会社になっている。

これは、2025 年の GitHub の問題への対応が 2020 年のフィードバックと完全に切り離されているように見える理由を説明しています。文字通り、そのフィードバックを受け取ったすべての人が PayPal を去っています。

## 2025年: 新しいリーダーシップ、同じ問題 {#2025-new-leadership-same-problems}

2025年まで早送りすると、全く同じパターンが浮かび上がります。何年も進展がなかった後、PayPalの新経営陣は再び手を差し伸べます。

### 新CEOが関与する {#the-new-ceo-gets-involved}

2025年6月30日、私たちはPayPalの新CEOアレックス・クリス氏に直接エスカレーションを行いました。彼の返答は簡潔でした。

> ニックさん、こんにちは。ご連絡とフィードバックをありがとうございます。ミシェル（CC）がチームと連携し、この件について一緒に解決に向けて取り組んでいます。ありがとうございます。 -A

### ミシェル・ギルの回答 {#michelle-gills-response}

中小企業・金融サービス部門のEVP兼ゼネラルマネージャーであるミシェル・ギル氏は次のように答えた。

> ニックさん、ありがとうございます。アレックスをBCCに移動しました。以前の投稿以来、この件について調査中です。今週中にご連絡いたします。担当者からご連絡させていただきますので、ご連絡先を教えていただけますでしょうか。ミシェル

### 当社の対応: 会議はもう行いません {#our-response-no-more-meetings}

私たちは、不満を述べて、次の会合を断りました。

> ありがとうございます。でも、電話しても何も変わらない気がします。理由はこうです…以前、電話してみたのですが、全く進展がありませんでした。チーム全体や経営陣と話して2時間以上も時間を無駄にしましたが、何も進展しませんでした。大量のメールをやり取りしましたが、全く進展しませんでした。フィードバックも全く役に立ちませんでした。何年も努力して、聞いてもらえたのに、結局何も進展しませんでした。

### マーティ・ブロドベックのオーバーエンジニアリングへの対応 {#marty-brodbecks-overengineering-response}

その後、PayPal の消費者エンジニアリング責任者であるマーティ・ブロドベック氏が連絡を取った。

> こんにちは、ニック。マーティ・ブロドベックです。PayPalのコンシューマーエンジニアリング全般を統括し、API開発を牽引しています。現在、お客様が直面している問題と、私たちがどのようにサポートできるかについて、お話を伺えれば幸いです。

サブスクリプション リストのエンドポイントの単純な必要性について説明したところ、彼の返答から問題点が明らかになりました。

> ニックさん、ありがとうございます。私たちは、完全な SDK (完全なエラー処理、イベントベースのサブスクリプション追跡、堅牢なアップタイムをサポート) を備えた単一のサブスクリプション API を作成中です。この API では、単一の応答を取得するために複数のエンドポイントを調整する必要がなくなるため、販売者がアクセスできる別の API として課金も分割されます。

これはまさに間違ったアプローチです。何ヶ月もかけて複雑なアーキテクチャを構築する必要はありません。必要なのは、サブスクリプションを一覧表示するシンプルなRESTエンドポイント1つだけです。これは2014年から存在すべきものでした。

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### 「単純なCRUD」の矛盾 {#the-simple-crud-contradiction}

これは 2014 年から存在するはずだった基本的な CRUD 機能であると指摘したとき、Marty の返答は次のような意味深いものでした。

> シンプルなCRUD操作はコアAPIの一部なので、開発に何ヶ月もかかることはありません。

PayPal TypeScript SDK は、数か月の開発期間を経て現在は 3 つのエンドポイントのみをサポートしていますが、その履歴タイムラインを見ると、このようなプロジェクトの完了には数か月以上かかることが明確にわかります。

この返答は、彼が自身のAPIを理解していないことを示しています。「シンプルなCRUD操作はコアAPIの一部」なら、サブスクリプション一覧のエンドポイントはどこにあるのでしょうか？私たちは次のように返答しました。

> 「シンプルなCRUD操作がコアAPIの一部」だとしたら、サブスクリプション一覧のエンドポイントはどこにあるのでしょうか？開発者たちは2014年からこの「シンプルなCRUD操作」を求めてきました。もう11年も経ちます。他の決済処理業者は、最初からこの基本機能を備えていました。

### 切断が明らかになる {#the-disconnect-becomes-clear}

2025 年のアレックス・クリス、ミシェル・ギル、マーティ・ブロドベックとのやり取りでは、同様の組織的機能不全が見受けられます。

1. **新しいリーダーは過去のフィードバックセッションについて何も知らない**
2. **同じ過剰なソリューションを提案する**
3. **自社のAPIの限界を理解していない**
4. **問題を解決するだけでなく、より多くの会議を求める**

このパターンは、2025 年の PayPal チームが 2020 年に提供された広範なフィードバックから完全に切り離されているように見える理由を説明しています。フィードバックを受け取った人々はいなくなり、新しいリーダーシップが同じ間違いを繰り返しています。

## 彼らが無視した何年にもわたるバグレポート {#years-of-bug-reports-they-ignored}

私たちは単に機能の不足について不満を言うだけでなく、積極的にバグを報告し、改善に努めました。以下に、記録した問題の包括的なタイムラインを示します。

### 2016: 初期のUI/UXに関する苦情 {#2016-early-uiux-complaints}

2016年には既に、インターフェースの問題とユーザビリティの問題について、ダン・シュルマン氏を含むPayPalの経営陣に公に訴えていました。それから9年も経ちますが、UI/UXの問題は今もなお続いています。

### 2021: ビジネスメールのバグレポート {#2021-business-email-bug-report}

2021年3月、PayPalのビジネスメールシステムから誤ったキャンセル通知が送信されていることを報告しました。メールテンプレートの変数が正しくレンダリングされておらず、お客様に分かりにくいメッセージが表示されていました。

マーク・スチュアート氏はこの問題を認めた。

> ニックさん、ありがとうございます！BCCに移行しました。@Prasyさん、このメールの担当者はあなたのチームですか？それとも、担当者が誰かご存知ですか？「Niftylettuce, LLC、今後は請求いたしません」という記載から、宛先とメールの内容が混同されているのではないかと思います。

**結果**: 実際に修正されました！マーク・スチュアートが確認しました。

> 通知チームから、メールテンプレートが修正され、公開されたとの連絡がありました。ご連絡いただきありがとうございます。ありがとうございます！

これは、彼らが望めば問題を解決できることを示しています。ほとんどの問題では解決しないことを選択しているだけです。

### 2021: UI改善の提案 {#2021-ui-improvement-suggestions}

2021 年 2 月に、ダッシュボード UI、特に「PayPal の最近のアクティビティ」セクションに関する詳細なフィードバックを提供しました。

> paypal.comのダッシュボード、特に「PayPal 最近のアクティビティ」は改善が必要だと思います。$0の定期支払いの「作成済み」ステータス行は表示すべきではないと思います。余分な行が大量に表示され、その日や過去数日間でどれだけの収益が上がっているのかを一目で把握できなくなります。

Mark Stuart はそれを消費者製品チームに転送しました:

> ありがとうございます！アクティビティの担当チームが不明ですが、コンシューマープロダクトの責任者に転送して、担当チームを特定してもらいました。$0.00の定期支払いはバグのようです。おそらくフィルタリングする必要があるでしょう。

**結果**: 修正されませんでした。UIには依然として無駄な$0エントリが表示されています。

### 2021: サンドボックス環境の障害 {#2021-sandbox-environment-failures}

2021 年 11 月に、PayPal のサンドボックス環境に関する重大な問題が報告されました。

* サンドボックスのシークレットAPIキーがランダムに変更され、無効化されました
* すべてのサンドボックステストアカウントが予告なく削除されました
* サンドボックスアカウントの詳細を表示しようとするとエラーメッセージが表示されました
* 断続的に読み込みに失敗する

> 何らかの理由で、サンドボックスのシークレットAPIキーが変更され、無効になってしまいました。また、古いサンドボックスのテストアカウントもすべて削除されました。

> 読み込まれる時もあれば、読み込まれない時もあります。本当にイライラします。

**結果**: 応答なし、修正なし。開発者は依然としてサンドボックスの信頼性の問題に直面しています。

### 2021: システムが完全に壊れたと報告 {#2021-reports-system-completely-broken}

2021年5月に、PayPalの取引レポートのダウンロードシステムが完全に壊れていると報告しました。

> ダウンロードレポートは現在機能していないようですが、ここ1日ずっと機能していません。また、ダウンロードに失敗した場合はメール通知を受け取るようにした方が良いかもしれません。

また、セッション管理の災害についても指摘しました。

> また、PayPalにログインしたまま5分ほど操作がないとログアウトされてしまいます。そのため、ステータスを確認したいレポートの横にあるボタンを再度クリックすると（ずっと待った後）、再度ログインし直さなければならないのは面倒です。

Mark Stuart 氏はセッション タイムアウトの問題を認識しました。

> 以前、IDE と developer.paypal.com または販売者ダッシュボードを切り替えている間にセッションが頻繁に期限切れになり、開発フローが中断され、戻ってきたら再びログアウトされたという報告があったことを覚えています。

**結果**: セッションタイムアウトは依然として60秒です。レポートシステムは依然として定期的に障害を起こします。

### 2022: コアAPI機能が見つかりません（再び）{#2022-core-api-feature-missing-again}

2022 年 1 月、サブスクリプション リストの問題を再度エスカレーションしましたが、今回はドキュメントの誤りについてさらに詳しく説明しました。

> すべてのサブスクリプション（以前は課金契約と呼ばれていました）を一覧表示するGETはありません

彼らの公式文書は完全に不正確であることがわかりました。

> APIドキュメントも全く不正確です。サブスクリプションIDのハードコードされたリストをダウンロードすることで回避策が取れると考えましたが、それも機能しませんでした！

> こちらの公式ドキュメントによると...これは実行できるとのことですが...問題は、チェックすべき「サブスクリプション ID」フィールドがどこにも見当たらないことです。

PayPalのChristina Monti氏は次のように答えました。

> これらの手順が間違っていたために生じたフラストレーションをお詫び申し上げます。今週中に修正いたします。

Sri Shivananda (CTO) は次のように感謝の意を表しました。

> より良いサービスの提供に向けて、引き続きご協力いただきありがとうございます。

**結果**: ドキュメントは修正されませんでした。サブスクリプション一覧のエンドポイントは作成されませんでした。

## 開発者エクスペリエンスの悪夢 {#the-developer-experience-nightmare}

PayPalのAPIを使うと、まるで10年前にタイムスリップしたような気分になります。以下に、私たちが記録した技術的な問題をご紹介します。

### ユーザーインターフェースが壊れています {#broken-user-interface}

PayPalの開発者ダッシュボードはひどいです。私たちが日々取り組んでいることは以下の通りです。

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal の UI は壊れていて、通知を閉じることすらできません。
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
お使いのブラウザはビデオタグをサポートしていません。
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
開発者ダッシュボードでは、文字通りスライダーをドラッグする必要があり、60秒後にログアウトされます。
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
お使いのブラウザはビデオタグをサポートしていません。
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal開発者インターフェースにおける、ワークフローの不具合を示すUIの不具合がさらに発生
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
お使いのブラウザはビデオタグをサポートしていません。
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
サブスクリプション管理インターフェース - インターフェースがあまりにも劣悪なため、商品やサブスクリプションプランを生成するためにコードに頼らざるを得ませんでした。
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
機能が不足している、壊れたサブスクリプションインターフェースの図（商品/プラン/サブスクリプションを簡単に作成できません。また、UIで作成した商品やプランを削除する方法は全くないようです）
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal の典型的なエラーメッセージ - 難解で役に立たない
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDKの問題 {#sdk-problems}

* スクリプトタグを使用してSDKを再読み込みしながらボタンの入れ替えと再レンダリングを行う複雑な回避策を講じなければ、1回限りの支払いとサブスクリプションの両方に対応できません。
* JavaScript SDKは基本的な規則に違反しています（クラス名は小文字、インスタンスチェックなし）。
* エラーメッセージには、どのフィールドが不足しているかが示されていません。
* データ型が一貫していません（数値ではなく文字列の金額が必要です）。

### コンテンツセキュリティポリシー違反 {#content-security-policy-violations}

彼らの SDK では、CSP に unsafe-inline と unsafe-eval が必要なため、**サイトのセキュリティが危険にさらされる** ことになります。

### ドキュメントの混乱 {#documentation-chaos}

マーク・スチュアート自身も認めている。

> レガシーAPIと新しいAPIが途方もない量であることは同意します。何を探せばいいのか探すのは本当に大変です（ここで働いている私たちにとっても）。

### セキュリティの脆弱性 {#security-vulnerabilities}

**PayPalの2FA実装は時代遅れです**。TOTPアプリを有効にしていてもSMS認証を強制するため、アカウントがSIMスワップ攻撃に対して脆弱になります。TOTPを有効にしている場合は、TOTPのみを使用するべきです。フォールバックはSMSではなくメールで行うべきです。

### セッション管理障害 {#session-management-disaster}

**開発者ダッシュボードでは、60秒間操作がないとログアウトされます**。何か生産的なことをしようとすると、ログイン → キャプチャ → 2要素認証 → ログアウト → この繰り返しになります。VPNを使っている方は、頑張ってください。

## 2025年7月: 最後の一撃 {#july-2025-the-final-straw}

11年間同じ問題が続いた後、定期的なアカウント移行の際に限界が訪れました。会計処理をより明確にするため、社名「Forward Email LLC」に合わせた新しいPayPalアカウントに移行する必要がありました。

単純なはずだったものが完全な惨事に変わりました。

* 初期テストではすべて正常に動作することが確認されました
* 数時間後、PayPalは予告なく突然すべてのサブスクリプションの支払いをブロックしました
* 顧客は支払いができず、混乱とサポートの負担が生じました
* PayPalサポートは、アカウントが検証済みであると主張しながら、矛盾した回答をしました
* PayPalでの支払いを完全に停止せざるを得ませんでした

<figure>
<figcaption><div class="alert alert-danger small text-center">
顧客が支払いを試みたときに表示されたエラー - 説明もログも何もなし
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPalサポートはすべて問題ないと主張しているが、支払いは完全に機能していない。最後のメッセージでは、「一部の機能が復旧しました」と説明しながらも、さらに具体的な情報を求めています。典型的なPayPalサポートのやりとりです。
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
何も「解決」しなかったとされる本人確認プロセス
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
漠然としたメッセージで、解決策は見つからず。必要な追加情報に関する情報、通知、その他の情報は一切ありません。カスタマーサポートは沈黙しています。
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## PayPalを廃止できない理由 {#why-we-cant-just-drop-paypal}

こうした問題にもかかわらず、PayPalを決済手段としてしか利用していないお客様もいらっしゃるため、PayPalを完全に廃止することはできません。[ステータスページ](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)で、あるお客様が次のように述べました。

> PayPalが唯一の支払い方法

**PayPal が特定のユーザーに対して支払いの独占権を作り出したため、私たちは壊れたプラットフォームをサポートせざるを得ません。**

## コミュニティの回避策 {#the-community-workaround}

PayPalは基本的なサブスクリプションリスト機能を提供しないため、開発者コミュニティは回避策を構築しました。PayPalサブスクリプションの管理に役立つスクリプトを作成しました：[set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

このスクリプトは、開発者がソリューションを共有する[コミュニティの要点](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)を参照しています。PayPalが何年も前に構築すべきだったものを提供しているのは、実際にはユーザーです。

## フィッシングのため PayPal テンプレートをブロックしています {#blocking-paypal-templates-due-to-phishing}

問題はAPIだけにとどまりません。PayPalのメールテンプレートは設計があまりにも悪く、フィッシング詐欺と区別がつかないため、メールサービスに特別なフィルタリングを実装する必要がありました。

### 本当の問題：PayPalのテンプレートは詐欺のように見える {#the-real-problem-paypals-templates-look-like-scams}

PayPalを装ったフィッシング詐欺メールが定期的に報告されています。不正使用報告から実際の例をご紹介します。

**件名:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

このメールはフィッシング詐欺の疑いがあるため、`abuse@microsoft.com` に転送されました。問題は、実際には PayPal のサンドボックス環境から送信されたものの、テンプレートのデザインがあまりにも粗雑だったため、フィッシング検出システムが反応してしまったことです。

### 当社の実装 {#our-implementation}

PayPal 固有のフィルタリングは [電子メールフィルタリングコード](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) に実装されています。

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### PayPalをブロックしなければならなかった理由 {#why-we-had-to-block-paypal}

PayPalの不正使用対策チームに繰り返し報告したにもかかわらず、PayPalが大規模なスパム／フィッシング／詐欺問題の解決を拒否したため、この対策を導入しました。具体的には、以下のメールをブロックします。

* **RT000238** - 不審な請求書通知
* **PPC001017** - 問題のある支払い確認
* **RT000542** - ギフトメッセージのハッキング試行

### 問題の規模 {#the-scale-of-the-problem}

スパムフィルタリングログには、PayPal請求書スパムが毎日大量に処理されていることが記録されています。ブロックされている件名の例：

* 「PayPal請求チームからの請求書：- この料金はお客様の口座から自動引き落としされます。[電話番号]まで至急ご連絡ください。」
* 「[会社名]からの請求書（[注文ID]）」
* 電話番号や注文IDが異なる複数のバリエーション

これらのメールは多くの場合、`outlook.com`ホストから送信されていますが、PayPalの正規のシステムから送信されているように見えるため、特に危険です。これらのメールはPayPalの実際のインフラストラクチャを介して送信されるため、SPF、DKIM、DMARC認証を通過します。

弊社の技術ログによると、これらのスパムメールには正当な PayPal ヘッダーが含まれています。

* `X-Email-Type-Id: RT000238` (ブロックするIDと同じ)
* `From: "service@paypal.com" <service@paypal.com>`
* `paypal.com` からの有効なDKIM署名
* PayPalのメールサーバーを示す適切なSPFレコード

これにより、あり得ない状況が発生します。正当な PayPal メールとスパムはどちらも同一の技術的特性を持っています。

### 皮肉 {#the-irony}

金融詐欺対策を主導すべき企業であるPayPalは、メールテンプレートの設計があまりにもずさんで、フィッシング対策システムを誤作動させてしまうほどです。PayPalからの正規のメールは詐欺メールと見分けがつかないため、ブロックせざるを得ません。

これはセキュリティ調査で文書化されています: [PayPalの新規住所詐欺にご注意ください](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - PayPal 独自のシステムがどのように詐欺に悪用されるかを示しています。

### 現実世界への影響：新しいPayPal詐欺 {#real-world-impact-novel-paypal-scams}

問題はテンプレートのデザインが不適切というだけではありません。PayPalの請求書システムは非常に簡単に悪用されるため、詐欺師は正規の請求書を装った偽の請求書を定期的に送信しています。セキュリティ研究者のギャビン・アンダーレッグ氏は、詐欺師がすべての認証チェックを通過した本物のPayPal請求書を送信する[斬新なPayPal詐欺](https://anderegg.ca/2023/02/01/a-novel-paypal-scam)について記録しています。

> 送信元を調べたところ、メールはPayPalから送信されたように見えました（SPF、DKIM、DMARCはすべて合格）。ボタンには、正規のPayPal URLに似たリンクが貼られていました… 正規のメールだと気づくまで少し時間がかかりました。詐欺師から、唐突な「請求書」が送られてきたのです。

<figure>
<figcaption><div class="alert alert-danger small text-center">
受信トレイに大量の不正なPayPal請求書が送信されているスクリーンショット。PayPalのシステムから送信されているため、すべて正当な請求書のように見えます。
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

研究者は次のように指摘した。

> 「PayPalは、この便利な機能のロックダウンを検討すべきだと思います。私はすぐに何らかの詐欺だと思い込み、技術的な詳細にしか興味がありませんでした。あまりにも簡単に実行できそうなので、他の人も騙されるのではないかと心配です。」

これは問題を完璧に表しています。PayPal 独自の正当なシステムは設計が不十分なため、詐欺を許すと同時に、正当な通信が疑わしいものになってしまうのです。

さらに悪いことに、これは Yahoo への配信性に影響を及ぼし、顧客からの苦情が発生し、何時間にもわたる綿密なテストとパターン チェックが必要になりました。

## PayPalの逆KYCプロセス {#paypals-backwards-kyc-process}

PayPalプラットフォームで最も苛立たしい点の一つは、コンプライアンスと顧客確認（KYC）手続きに対する時代遅れのアプローチです。他の決済代行サービスとは異なり、PayPalは開発者が適切な認証を完了する前にAPIを統合し、本番環境で決済の収集を開始できるようにしています。

### 動作方法 {#how-it-should-work}

すべての正当な支払い処理業者は次の論理的な順序に従います。

1. **まずKYC認証を完了する**
2. **販売者アカウントを承認する**
3. **本番環境APIへのアクセスを許可する**
4. **支払い回収を許可する**

これにより、金銭のやり取りが行われる前にコンプライアンスが確保され、支払い処理業者と販売者の両方が保護されます。

### PayPalの実際の仕組み {#how-paypal-actually-works}

PayPal のプロセスは完全に逆です。

1. **本番環境APIへのアクセスを直ちに提供する**
2. **数時間または数日間、支払い回収を許可する**
3. **予告なしに突然支払いをブロックする**
4. **顧客が既に影響を受けた後にKYC文書の提出を求める**
5. **加盟店に通知しない**
6. **顧客が問題を発見し、報告できるようにする**

### 現実世界への影響 {#the-real-world-impact}

この逆方向のプロセスは企業にとって災難をもたらします。

* 繁忙期に顧客が購入を完了できない**
* 確認が必要であることを**事前に通知されない**
* 支払いがブロックされても**メール通知がない**
* **加盟店は混乱した顧客から問題を知る**
* 重要なビジネス期間に**収益が失われる**
* **支払いが不可解に失敗すると**顧客の信頼が損なわれる**

### 2025年7月のアカウント移行の惨事 {#the-july-2025-account-migration-disaster}

まさにこのシナリオが、2025年7月の定期的なアカウント移行の際に発生しました。PayPalは当初は支払いを許可していたものの、その後、何の通知もなく突然支払いをブロックしました。お客様から支払いができないという報告が寄せられ始めてから、私たちは問題に気付きました。

サポートに連絡したところ、必要な書類について矛盾した回答が返ってきただけでなく、解決の見通しも明確ではありませんでした。そのため、PayPalでの支払いを完全に停止せざるを得なくなり、他に支払い方法のないお客様に混乱を招いてしまいました。

### これが重要な理由 {#why-this-matters}

PayPalのコンプライアンスへの取り組みは、ビジネスの運営方法を根本的に誤解していることを露呈しています。適切なKYC（顧客確認）は、顧客が支払いを試みた後ではなく、本番環境への統合**前**に行うべきです。問題発生時の積極的なコミュニケーションの欠如は、PayPalが加盟店のニーズから乖離していることを如実に示しています。

この逆行的なプロセスは、PayPal のより広範な組織的問題の兆候です。つまり、PayPal は販売者や顧客の体験よりも社内プロセスを優先しており、その結果、企業が PayPal のプラットフォームから離れていくような運用上の大惨事を引き起こしているのです。

## 他の決済処理業者が適切に処理する方法 {#how-every-other-payment-processor-does-it-right}

PayPalが実装を拒否しているサブスクリプションリスティング機能は、業界では10年以上前から標準となっています。他の決済代行業者はこの基本要件をどのように処理しているのでしょうか。

### ストライプ {#stripe}

StripeはAPIリリース当初からサブスクリプションリスト機能を提供しています。ドキュメントには、顧客または加盟店アカウントのすべてのサブスクリプションを取得する方法が明確に記載されています。これは基本的なCRUD機能と言えるでしょう。

### パドル {#paddle}

Paddleは、リスト表示、フィルタリング、ページネーションを含む包括的なサブスクリプション管理APIを提供しています。彼らは、マーチャントが継続的な収益源を把握する必要があることを理解しています。

### コインベースコマース {#coinbase-commerce}

Coinbase Commerce のような暗号通貨決済プロセッサでも、PayPal よりも優れたサブスクリプション管理が提供されます。

### スクエア {#square}

Square の API には、後付けではなく基本的な機能としてサブスクリプション リストが含まれています。

### 業界標準 {#the-industry-standard}

現代の決済処理業者はすべて以下を提供します。

* すべてのサブスクリプションを一覧表示
* ステータス、日付、顧客でフィルタリング
* 大規模データセットのページネーション
* サブスクリプション変更時のWebhook通知
* 実用的な例を含む包括的なドキュメント

### PayPalと比較して他のプロセッサが提供するもの {#what-other-processors-provide-vs-paypal}

**Stripe - すべてのサブスクリプションを一覧表示:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - 顧客によるフィルタリング:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - ステータスでフィルタリング:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - 実際に得られるもの:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPal の利用可能なエンドポイント:**

* `POST /v1/billing/subscriptions` - サブスクリプションの作成
* `GET /v1/billing/subscriptions/{id}` - サブスクリプションを1つ取得（IDがわかっている場合）
* `PATCH /v1/billing/subscriptions/{id}` - サブスクリプションの更新
* `POST /v1/billing/subscriptions/{id}/cancel` - サブスクリプションのキャンセル
* `POST /v1/billing/subscriptions/{id}/suspend` - サブスクリプションの一時停止

**PayPalに欠けているもの:**

* ❌ `GET /v1/billing/subscriptions` なし（すべてリスト）
* ❌ 検索機能なし
* ❌ ステータス、顧客、日付によるフィルタリングなし
* ❌ ページ区切りはサポートされていません

PayPal は、開発者が独自のデータベースでサブスクリプション ID を手動で追跡することを義務付ける唯一の大手決済処理業者です。

## PayPalの組織的隠蔽：600万人の声を封じる {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPal の批判への対応方法を完璧に要約する動きとして、同社は最近コミュニティ フォーラム全体をオフラインにし、実質的に 600 万人以上のメンバーを沈黙させ、失敗を記録した何十万もの投稿を削除しました。

### 大いなる消滅 {#the-great-erasure}

`paypal-community.com` にあった当初の PayPal コミュニティには **6,003,558 人のメンバー** が参加し、数十万件もの投稿、バグレポート、苦情、そして PayPal の API 障害に関する議論が交わされていました。これは、PayPal のシステム上の問題が 10 年以上にわたって記録されてきた証拠です。

2025年6月30日、PayPalはひっそりとフォーラム全体をオフラインにしました。`paypal-community.com`リンクはすべて404エラーを返すようになりました。これは移行やアップグレードではありません。

### サードパーティによる救済 {#the-third-party-rescue}

幸いなことに、[ppl.lithium.com](https://ppl.lithium.com/) にあるサードパーティサービスがコンテンツの一部を保存してくれたため、PayPal が隠そうとしていたディスカッションにアクセスできるようになりました。ただし、このサードパーティによる保存は不完全であり、いつでも消えてしまう可能性があります。

証拠を隠すというこのパターンはPayPalにとって目新しいものではありません。PayPalには以下のような記録があります。

* 重大なバグレポートを公開から削除する
* 開発者ツールを予告なく廃止する
* 適切なドキュメントなしにAPIを変更する
* 不具合に関するコミュニティの議論を封じ込める

このフォーラムの閉鎖は、組織的な失敗を世間の監視から隠そうとする、これまでで最も大胆な試みである。

## 11年間続いたキャプチャーバグ災害：1,899ドル以上 {#the-11-year-capture-bug-disaster-1899-and-counting}

PayPalがフィードバックセッションの開催や約束に忙殺されている間に、同社の中核となる決済処理システムは11年以上もの間、根本的に機能不全に陥っていました。その証拠は壊滅的です。

### 転送メールの損失 1,899 ドル {#forward-emails-1899-loss}

弊社の本番システムにおいて、PayPalのキャプチャエラーにより失われたPayPal決済が108件、合計**$1,899**あることが判明しました。これらの決済には一貫したパターンが見られます。

* `CHECKOUT.ORDER.APPROVED` の Webhook を受信しました
* PayPal のキャプチャ API が 404 エラーを返しました
* PayPal の API 経由で注文にアクセスできなくなりました

PayPal は 14 日後にデバッグ ログを完全に非表示にし、キャプチャされなかった注文 ID のすべてのデータをダッシュボードから消去するため、顧客に請求が行われたかどうかを判断することは不可能です。

これはたった一つの事業の例です。**11年以上にわたり、数千の事業者が被った損失は総額数百万ドルに上る可能性があります。**

**もう一度言いますが、11年以上にわたる何千もの商店の全体的な損失は、おそらく数百万ドルに上ります。**

私たちがこれを発見できた唯一の理由は、私たちが非常に細心の注意を払い、データに基づいて行動しているからです。

### 2013年オリジナルレポート：11年以上の過失 {#the-2013-original-report-11-years-of-negligence}

この問題に関する最も古い文書化されたレポートは、[2013年11月のStack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([アーカイブ済み](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) に記載されています。

> 「キャプチャ時にRest APIで404エラーが発生し続ける」

2013 年に報告されたエラーは、2024 年に Forward Email が経験したものと **同一** です。

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013 年のコミュニティの反応は次のことを物語っています。

> 「現在、REST API に問題が報告されています。PayPal が対応中です。」

**11年以上経った今でも、彼らはまだ「取り組んでいます。」**

### 2016年の告白: PayPalが自社のSDKを破壊 {#the-2016-admission-paypal-breaks-their-own-sdk}

2016年、PayPalのGitHubリポジトリに、公式PHP SDKに影響を与える[大規模な捕獲失敗](https://github.com/paypal/PayPal-PHP-SDK/issues/660)が記録されました。その影響は甚大でした。

> 「2016年9月20日以降、PayPalのキャプチャ試行はすべて「INVALID_RESOURCE_ID - 要求されたリソースIDが見つかりません。」というエラーで失敗しています。9月19日から9月20日の間にAPI統合に変更はありませんでした。**9月20日以降のキャプチャ試行の100%でこのエラーが返されました。**」

ある商人はこう報告した。

> 「**過去 24 時間以内に 1,400 回を超えるキャプチャ試行が失敗しました**。すべて INVALID_RESOURCE_ID エラー応答でした。」

PayPalの当初の対応は、販売業者を責め、テクニカルサポートに問い合わせるよう指示することでした。しかし、多大な圧力を受けてようやく、PayPalは責任を認めました。

> 「製品開発者から最新情報が届きました。送信されているヘッダーを見ると、PayPalリクエストIDが42文字で送信されていることに気づいていますが、**最近の変更により、このIDは38文字に制限されているようです。**」

この告白は PayPal の組織的な過失を明らかにしている。

1. **文書化されていない重大な変更を行った**
2. **自社の公式SDKを破壊した**
3. **まず販売業者を責めた**
4. **プレッシャーを受けて初めて過失を認めた**

問題が「修正」された後も、販売業者は次のように報告しました。

> 「SDK を v1.7.4 にアップグレードしましたが、**問題は引き続き発生しています。**」

### 2024年のエスカレーション：依然として機能していない {#the-2024-escalation-still-broken}

PayPalコミュニティからの最近の報告によると、問題はさらに悪化しているようです。[2024年9月の議論](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([アーカイブ済み](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) にも全く同じ問題が記録されています。

> 「この問題は約 2 週間前から発生し始めたばかりで、すべての注文に影響しているわけではありません。**より一般的なのは、キャプチャ時に 404 エラーが発生することです。**」

販売者は、電子メール転送で経験したのと同じパターンを次のように説明しています。

> 「注文をキャプチャしようとした後、PayPal は 404 を返します。注文の詳細を取得すると: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **これは、当社側でキャプチャが成功したという痕跡がない状態です。**」

### Webhookの信頼性の失敗 {#the-webhook-reliability-disaster}

別の [保存コミュニティの議論](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) は、PayPal の Webhook システムが根本的に信頼できないことを明らかにしています。

> 「理論的には、Webhook イベントから 2 つのイベント (CHECKOUT.ORDER.APPROVED と PAYMENT.CAPTURE.COMPLETED) が発生するはずです。実際には、**これら 2 つのイベントがすぐに受信されることは稀で、PAYMENT.CAPTURE.COMPLETED はほとんどの場合受信できないか、数時間以内に受信されます。**」

サブスクリプションの支払いの場合:

> 「**「PAYMENT.SALE.COMPLETED」が、時々、または数時間まで受信されないことがあります。**」

販売業者の質問は、PayPal の信頼性の問題の深刻さを明らかにしています。

1. **「なぜこんなことが起こるのですか？」** - PayPalのWebhookシステムは根本的に壊れています
2. **「注文ステータスが「完了」の場合、代金を受け取ったと考えていいですか？」** - 加盟店はPayPalのAPIレスポンスを信頼できません
3. **「なぜ「イベントログ」->「Webhookイベント」でログが見つからないのですか？」** - PayPal独自のログシステムでさえ機能していません

### 組織的過失のパターン {#the-pattern-of-systematic-negligence}

証拠は11年以上にわたり、明確なパターンを示しています。

* **2013**: 「PayPalは対応中」
* **2016**: PayPalは重大な変更を認め、不具合の修正を提供
* **2024**: 全く同じエラーが依然として発生しており、Forward Emailをはじめ、数多くのサービスに影響

これはバグではありません - **これは組織的な過失です。** PayPal は、これらの重大な支払い処理の失敗について 10 年以上前から認識しており、一貫して次の対応をしてきました。

1. **PayPalのバグを加盟店のせいにした**
2. **文書化されていない重大な変更を加えた**
3. **機能しない不適切な修正を提供した**
4. **企業への経済的影響を無視した**
5. **コミュニティフォーラムを閉鎖して証拠を隠蔽した**

### 文書化されていない要件 {#the-undocumented-requirement}

PayPalの公式ドキュメントには、加盟店がキャプチャ処理に再試行ロジックを実装する必要があるという記述がどこにもありません。ドキュメントには加盟店は「承認後すぐにキャプチャする」必要があると記載されていますが、APIがランダムに404エラーを返すため、複雑な再試行メカニズムが必要になるという記述はありません。

これにより、すべての販売業者は次のことを実行する必要があります。

* 指数バックオフ再試行ロジックを実装する
* 一貫性のないWebhook配信を処理する
* 複雑な状態管理システムを構築する
* 失敗したキャプチャを手動で監視する

**他のすべての支払い処理業者は、最初から機能する信頼性の高いキャプチャ API を提供しています。**

## PayPalの広範な詐欺パターン {#paypals-broader-pattern-of-deception}

キャプチャーバグによる惨事は、顧客を欺き、失敗を隠蔽しようとする PayPal の組織的なアプローチの一例にすぎません。

### ニューヨーク州金融サービス局の行動 {#the-new-york-department-of-financial-services-action}

2025 年 1 月、ニューヨーク州金融サービス局は詐欺行為に関する [PayPalに対する執行措置](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) を発行し、PayPal の詐欺行為のパターンが API をはるかに超えていることを示しました。

この規制措置は、PayPal が開発者ツールだけでなく、事業全体にわたって欺瞞行為に関与する意思があることを示しています。

### ハニー訴訟：アフィリエイトリンクの書き換え {#the-honey-lawsuit-rewriting-affiliate-links}

PayPalによるHoneyの買収は、[ハニーがアフィリエイトリンクを書き換えていると主張する訴訟](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer)という、コンテンツクリエイターやインフルエンサーからコミッションを横領する行為を生み出しました。これは、本来他者に還元されるべき収益をPayPalが不正に流用することで利益を得ている、組織的な欺瞞行為の新たな形です。

パターンは明らかです。

1. **API障害**: 不具合のある機能を隠蔽し、販売者に責任を負わせる
2. **コミュニティの沈黙**: 問題の証拠を隠蔽する
3. **規制違反**: 欺瞞行為を行う
4. **アフィリエイト報酬の横領**: 技術的な操作でコミッションを横領する

### PayPalの過失による損害 {#the-cost-of-paypals-negligence}

Forward Emailの1,899ドルの損失は氷山の一角に過ぎません。より広範な影響を考えてみましょう。

* **個人加盟店**: 数千の加盟店がそれぞれ数百ドルから数千ドルの損失を被る
* **法人顧客**: 数百万ドルの収益損失の可能性
* **開発者時間**: PayPalのAPIの不具合に対する回避策の構築に膨大な時間を費やす
* **顧客の信頼**: PayPalの決済失敗により、企業が顧客を失う

1 つの小規模な電子メール サービスが 2,000 ドル近くの損失を被り、この問題が 11 年以上存在し、何千もの販売業者に影響を与えていた場合、全体的な経済的損害はおそらく **数億ドル** に上ります。

### ドキュメントの嘘 {#the-documentation-lie}

PayPalの公式ドキュメントでは、加盟店が遭遇する可能性のある重大な制限やバグについて、一貫して言及されていません。例えば：

* **Capture API**: 404エラーが頻繁に発生し、再試行ロジックが必要であるという記述がない
* **Webhookの信頼性**: Webhookが数時間遅延することが多いという記述がない
* **サブスクリプションのリスト表示**: ドキュメントには、エンドポイントが存在しない場合でもリスト表示が可能であることが示唆されている
* **セッションタイムアウト**: 60秒という厳しいタイムアウトに関する記述がない

重要な情報が体系的に省略されているため、販売者は実稼働システムで試行錯誤しながら PayPal の限界を発見せざるを得なくなり、金銭的な損失につながることがよくあります。

## 開発者にとってこれが何を意味するか {#what-this-means-for-developers}

PayPalが広範なフィードバックを収集しながらも、開発者の基本的なニーズへの対応を組織的に怠っていることは、根本的な組織的問題を示しています。彼らはフィードバック収集を、問題の実際の解決の代替手段とみなしています。

パターンは明らかです。

1. 開発者が問題を報告
2. PayPalが経営陣とのフィードバックセッションを開催
3. 詳細なフィードバックが提供される
4. チームはギャップを認識し、「追跡と対応」を約束
5. 何も実行されない
6. 経営陣がより良い企業へ転職
7. 新しいチームが同じフィードバックを求める
8. このサイクルが繰り返される

一方、開発者は支払いを受け入れるためだけに、回避策を構築し、セキュリティを犠牲にし、壊れた UI に対処せざるを得ません。

決済システムを構築する場合は、私たちの経験から学んでください。[トリフェクタアプローチ](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)は複数のプロセッサで構築しますが、PayPalが必要な基本機能をすべて提供してくれるとは期待しないでください。初日から回避策を講じる計画を立ててください。

> この投稿は、Forward EmailにおけるPayPal APIの11年間の経験についてまとめたものです。すべてのコード例とリンクは、実際の運用システムから引用しています。これらの問題にもかかわらず、PayPal決済のサポートを継続しているのは、他に選択肢がないお客様もいるためです。

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />