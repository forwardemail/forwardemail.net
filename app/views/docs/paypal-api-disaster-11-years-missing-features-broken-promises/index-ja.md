# PayPalの11年間にわたるAPIの惨事：開発者を無視し続ける中で私たちが作った回避策 {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **成功！PayPalがついに `GET /v1/billing/subscriptions` エンドポイントを追加しました。**
>
> この投稿を公開し、PayPalの経営陣にメールを送った後、彼らのチームはサブスクリプション一覧のために必要不可欠なエンドポイントを実装しました。この変更は [2025年6月25日](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) と [2025年7月9日](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/) の間のどこかで行われました。
>
> しかし、PayPalらしく、私たちに通知は一切ありませんでした。このアップデートに気づいたのは、機能がひっそりとリリースされてから数ヶ月後の2025年12月でした。

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Forward Emailでは、10年以上にわたりPayPalの壊れたAPIと格闘してきました。最初は小さな不満だったものが、独自の回避策を構築し、フィッシングテンプレートをブロックし、最終的には重要なアカウント移行中にすべてのPayPal決済を停止せざるを得ない完全な惨事へと発展しました。</p>
<p class="lead mt-3">これは、PayPalが基本的な開発者のニーズを11年間無視し続ける中で、私たちが彼らのプラットフォームを動かすためにあらゆる手を尽くした物語です。</p>


## 目次 {#table-of-contents}

* [欠けていたピース：サブスクリプション一覧ができない](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017年：問題の発生](#2014-2017-the-problem-emerges)
* [2020年：広範なフィードバックを提供](#2020-we-give-them-extensive-feedback)
  * [27項目のフィードバックリスト](#the-27-item-feedback-list)
  * [チームが関与し、約束が交わされる](#teams-got-involved-promises-were-made)
  * [結果は？何もなし。](#the-result-nothing)
* [経営陣の大量離脱：PayPalが組織的記憶を失うまで](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025年：新しいリーダーシップ、変わらぬ問題](#2025-new-leadership-same-problems)
  * [新CEOの関与](#the-new-ceo-gets-involved)
  * [ミシェル・ギルの回答](#michelle-gills-response)
  * [私たちの回答：もう会議はしない](#our-response-no-more-meetings)
  * [マーティ・ブロードベックの過剰設計な回答](#marty-brodbecks-overengineering-response)
  * [「シンプルなCRUD」の矛盾](#the-simple-crud-contradiction)
  * [断絶が明らかに](#the-disconnect-becomes-clear)
* [無視された何年ものバグ報告](#years-of-bug-reports-they-ignored)
  * [2016年：初期のUI/UXの不満](#2016-early-uiux-complaints)
  * [2021年：ビジネスメールのバグ報告](#2021-business-email-bug-report)
  * [2021年：UI改善提案](#2021-ui-improvement-suggestions)
  * [2021年：サンドボックス環境の失敗](#2021-sandbox-environment-failures)
  * [2021年：レポートシステムの完全な破綻](#2021-reports-system-completely-broken)
  * [2022年：コアAPI機能の欠如（再び）](#2022-core-api-feature-missing-again)
* [開発者体験の悪夢](#the-developer-experience-nightmare)
  * [壊れたユーザーインターフェース](#broken-user-interface)
  * [SDKの問題](#sdk-problems)
  * [コンテンツセキュリティポリシー違反](#content-security-policy-violations)
  * [ドキュメントの混乱](#documentation-chaos)
  * [セキュリティ脆弱性](#security-vulnerabilities)
  * [セッション管理の惨事](#session-management-disaster)
* [2025年7月：最後の一撃](#july-2025-the-final-straw)
* [なぜPayPalを簡単にやめられないのか](#why-we-cant-just-drop-paypal)
* [コミュニティによる回避策](#the-community-workaround)
* [フィッシング対策としてのPayPalテンプレートのブロック](#blocking-paypal-templates-due-to-phishing)
  * [本当の問題：PayPalのテンプレートが詐欺に見える](#the-real-problem-paypals-templates-look-like-scams)
  * [私たちの実装](#our-implementation)
  * [なぜPayPalをブロックせざるを得なかったのか](#why-we-had-to-block-paypal)
  * [問題の規模](#the-scale-of-the-problem)
  * [皮肉な事実](#the-irony)
  * [実際の影響：新たなPayPal詐欺](#real-world-impact-novel-paypal-scams)
* [PayPalの逆行するKYCプロセス](#paypals-backwards-kyc-process)
  * [あるべき姿](#how-it-should-work)
  * [PayPalの実態](#how-paypal-actually-works)
  * [実際の影響](#the-real-world-impact)
  * [2025年7月のアカウント移行の惨事](#the-july-2025-account-migration-disaster)
  * [なぜこれが重要か](#why-this-matters)
* [他の決済プロセッサーが正しくやっていること](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [業界標準](#the-industry-standard)
  * [他のプロセッサーが提供するもの vs PayPal](#what-other-processors-provide-vs-paypal)
* [PayPalの組織的隠蔽：600万の声を封じ込める](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [大規模な抹消](#the-great-erasure)
  * [第三者による救済](#the-third-party-rescue)
* [11年間続くキャプチャバグの惨事：$1,899の損失とその後](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Emailの$1,899の損失](#forward-emails-1899-loss)
  * [2013年の最初の報告：11年以上の怠慢](#the-2013-original-report-11-years-of-negligence)
  * [2016年の認識：PayPalが自社SDKを壊す](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024年のエスカレーション：依然として壊れたまま](#the-2024-escalation-still-broken)
  * [Webhookの信頼性の惨事](#the-webhook-reliability-disaster)
  * [組織的怠慢のパターン](#the-pattern-of-systematic-negligence)
  * [未文書の要件](#the-undocumented-requirement)
* [PayPalのより広範な欺瞞のパターン](#paypals-broader-pattern-of-deception)
  * [ニューヨーク金融サービス局の措置](#the-new-york-department-of-financial-services-action)
  * [Honey訴訟：アフィリエイトリンクの書き換え](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPalの怠慢の代償](#the-cost-of-paypals-negligence)
  * [ドキュメントの嘘](#the-documentation-lie)
* [開発者にとっての意味](#what-this-means-for-developers)
## 欠けているピース：サブスクリプション一覧表示の方法がない {#the-missing-piece-no-way-to-list-subscriptions}

驚くべきことに、PayPalは2014年からサブスクリプション課金を提供していますが、加盟店が自分のサブスクリプションを一覧表示する方法を一度も提供していません。

ちょっと考えてみてください。サブスクリプションは作成できるし、IDがあればキャンセルもできますが、自分のアカウントのすべての有効なサブスクリプションの一覧を取得することはできません。まるでSELECT文のないデータベースを持っているようなものです。

これは基本的なビジネス運営に必要です：

* カスタマーサポート（誰かがサブスクリプションについて問い合わせてきたとき）
* 財務報告と照合
* 自動請求管理
* コンプライアンスと監査

しかしPayPalは？ただ…それを作らなかったのです。


## 2014-2017年：問題の発生 {#2014-2017-the-problem-emerges}

サブスクリプション一覧表示の問題は、2017年にPayPalのコミュニティフォーラムで初めて表面化しました。開発者たちは当然の疑問を投げかけました：「自分のすべてのサブスクリプション一覧をどうやって取得するの？」

PayPalの回答は？沈黙でした。

コミュニティメンバーは次第に苛立ちを募らせました：

> 「加盟店がすべての有効な契約を一覧できないのは非常に奇妙な欠落です。契約IDを失った場合、キャンセルや一時停止ができるのはユーザーだけになります。」 - leafspider

> 「+1。もうほぼ3年になります。」 - laudukang（問題は約2014年から存在していたことを意味）

[2017年の元のコミュニティ投稿](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066)では、開発者たちがこの基本機能を懇願しています。PayPalの対応は、問題が報告されていたリポジトリをアーカイブすることでした。


## 2020年：詳細なフィードバックを提供 {#2020-we-give-them-extensive-feedback}

2020年10月、PayPalは正式なフィードバックセッションのために私たちに連絡を取りました。これは単なるカジュアルな会話ではなく、Sri Shivananda（CTO）、Edwin Aoki、Jim Magats、John Kunzeら8名のPayPal幹部を含む45分間のMicrosoft Teamsコールを組織しました。

### 27項目のフィードバックリスト {#the-27-item-feedback-list}

私たちは準備万端でした。6時間にわたるAPI統合の試行の後、27の具体的な問題をまとめました。PayPal CheckoutチームのMark Stuartはこう言いました：

> Nick、今日は皆に共有してくれてありがとう！これが私たちのチームがこれらの問題を修正するためのさらなるサポートと投資を得るきっかけになると思います。これまでにあなたから得たような詳細なフィードバックはなかなか得られませんでした。

このフィードバックは理論的なものではなく、実際の統合試行から得られたものです：

1. **アクセストークン生成が機能しない**：

> アクセストークン生成が機能していません。また、cURLの例だけでなくもっと多様な例が必要です。

2. **サブスクリプション作成用のWeb UIがない**：

> cURLを使わずにどうやってサブスクリプションを作成するんですか？StripeのようなWeb UIがないようです。

Mark Stuartはアクセストークン問題を特に懸念していました：

> アクセストークン生成に関する問題は通常聞きません。

### チームが関与し、約束がなされた {#teams-got-involved-promises-were-made}

問題が増えるにつれて、PayPalは会話にさらに多くのチームを加えました。サブスクリプション管理UIチームのDarshan Rajuが参加し、こう述べました：

> ギャップを認識しています。追跡し対応します。フィードバックありがとうございます！

このセッションは、

> あなたの体験を率直に説明してもらう

ことを目的とし、

> PayPalを開発者にとってあるべき姿にする

ためのものでした。

### 結果は？何もなし。 {#the-result-nothing}

正式なフィードバックセッション、詳細な27項目リスト、複数チームの関与、そして

> 追跡し対応する

という約束にもかかわらず、何も修正されませんでした。


## 幹部の大量離職：PayPalがすべての組織的記憶を失った理由 {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

ここからが本当に興味深いところです。2020年のフィードバックを受け取った全員がPayPalを去っています：

**リーダーシップの変遷：**

* [Dan Schulman（9年間CEO）→ Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/)（2023年9月）
* [Sri Shivananda（フィードバックを組織したCTO）→ JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/)（2024年1月）
**約束をして去ったテクニカルリーダーたち：**

* **Mark Stuart**（フィードバックが「触媒」になると約束）→ [現在Rippleに在籍](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats**（18年のPayPalベテラン）→ [MXのCEO](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html)（2022年）
* **John Kunze**（グローバルコンシューマープロダクトVP）→ [引退](https://www.linkedin.com/in/john-kunze-5724a86)（2023年）
* **Edwin Aoki**（最後の数名の一人）→ [最近Nasdaqに移籍](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ)（2025年1月）

PayPalは、幹部が開発者のフィードバックを集め、約束をし、その後JPMorganやRipple、その他のフィンテック企業などより良い会社に移るという回転ドアのような状態になっています。

これが、2025年のGitHubの問題対応が2020年のフィードバックと全くかみ合っていなかった理由を説明しています。フィードバックを受け取った人は文字通り全員PayPalを去っています。


## 2025年：新しいリーダーシップ、同じ問題 {#2025-new-leadership-same-problems}

2025年に時が進むと、まったく同じパターンが現れます。何年も進展がなかった後、PayPalの新しいリーダーシップが再び連絡を取ってきました。

### 新CEOの関与 {#the-new-ceo-gets-involved}

2025年6月30日、私たちはPayPalの新CEOアレックス・クリスに直接エスカレーションしました。彼の返答は簡潔でした：

> Hi Nick – Thank you for reaching out and the feedback. Michelle (cc'd) is on point with her team to engage and work through this with you. Thanks -A

### ミシェル・ギルの返答 {#michelle-gills-response}

中小企業および金融サービス担当EVP兼ゼネラルマネージャーのミシェル・ギルはこう返答しました：

> Thanks very much Nick, moving Alex to bcc. We have been looking into this since your earlier post. We will give you a call before the week is out. Can you please send me your contact info so one of my colleagues can reach out. Michelle

### 私たちの返答：もう会議は不要 {#our-response-no-more-meetings}

私たちはもう一度の会議を断り、フラストレーションを説明しました：

> Thank you. However I don't feel like getting on a call is going to do anything. Here's why... I got on a call in the past and it went absolutely nowhere. I wasted 2+ hours of my time talking to the entire team and leadership and nothing got done... Tons of emails back and forth. Absolutely nothing done. Feedback went nowhere. I tried for years, get listened to, and then it goes nowhere.

### マーティ・ブロードベックの過剰設計的な返答 {#marty-brodbecks-overengineering-response}

その後、PayPalのコンシューマーエンジニアリング責任者マーティ・ブロードベックから連絡がありました：

> Hi Nick, this is Marty Brodbeck. I head up all consumer engineering here at PayPal and have been driving the api development for the company. Can you and I connect on the problem you are facing and how we may help here.

私たちがサブスクリプション一覧エンドポイントの単純なニーズを説明すると、彼の返答は問題の核心を示しました：

> Thanks Nick, we are in the process of creating a single subscription api with full SDK (supports full error handling, event-based subscription tracking, robust uptime) where billing is also split out as a separate API for merchants to go to rather than having to orchestrate across multiple endpoints to get a single response.

これはまさに間違ったアプローチです。私たちは複雑なアーキテクチャに数ヶ月もかける必要はありません。2014年から存在すべき、サブスクリプションを一覧表示する単純なRESTエンドポイントが必要なのです。

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### 「シンプルなCRUD」の矛盾 {#the-simple-crud-contradiction}

これが2014年から存在すべき基本的なCRUD機能であると指摘したところ、マーティの返答は示唆的でした：

> Simple Crud operations are part of the core API my friend, so it won't take months of development

現在3つのエンドポイントのみをサポートし、数ヶ月の開発を経たPayPalのTypeScript SDKとその歴史的なタイムラインは、このようなプロジェクトが数ヶ月以上かかることを明確に示しています。
この回答は、彼が自分のAPIを理解していないことを示しています。もし「シンプルなCRUD操作がコアAPIの一部」であるなら、サブスクリプション一覧取得のエンドポイントはどこにあるのでしょうか？私たちはこう返答しました：

> もし「シンプルなCRUD操作がコアAPIの一部」であるなら、サブスクリプション一覧取得のエンドポイントはどこにあるのでしょうか？開発者たちは2014年からこの「シンプルなCRUD操作」を求めています。もう11年経ちます。他のすべての決済プロセッサは初日からこの基本機能を備えています。

### 断絶が明らかになる {#the-disconnect-becomes-clear}

2025年のAlex Chriss、Michelle Gill、Marty Brodbeckとのやり取りは、同じ組織的な機能不全を示しています：

1. **新しいリーダーシップは過去のフィードバックセッションを知らない**
2. **同じ過剰設計の解決策を提案する**
3. **自分たちのAPIの制限を理解していない**
4. **問題を修正する代わりに会議を増やしたがる**

このパターンは、2025年のPayPalチームが2020年に提供された膨大なフィードバックから完全に断絶している理由を説明しています — フィードバックを受け取った人々はもうおらず、新しいリーダーシップは同じ過ちを繰り返しています。


## 無視された何年ものバグ報告 {#years-of-bug-reports-they-ignored}

私たちは単に機能不足を不満に思っていただけではありません。積極的にバグを報告し、改善を助けようとしました。以下は私たちが記録した問題の包括的なタイムラインです：

### 2016年：初期のUI/UXに関する苦情 {#2016-early-uiux-complaints}

2016年の時点で、Dan Schulmanを含むPayPalのリーダーシップに対してインターフェースの問題や使い勝手の問題を公に訴えていました。これは9年前のことで、同じUI/UXの問題が今日も続いています。

### 2021年：ビジネスメールのバグ報告 {#2021-business-email-bug-report}

2021年3月、PayPalのビジネスメールシステムが誤ったキャンセル通知を送信していることを報告しました。メールテンプレートの変数が正しくレンダリングされず、顧客に混乱を招くメッセージが表示されていました。

Mark Stuartはこの問題を認めました：

> ありがとうNick！BCCに移行します。@Prasy、あなたのチームがこのメールの担当ですか？それとも誰が担当か知っていますか？「Niftylettuce, LLC, we'll no longer bill you」という文面から、宛先とメール内容が混同されているように思えます。

**結果**：実際に修正されました！Mark Stuartはこう確認しました：

> 通知チームから、メールテンプレートが修正され展開されたと聞きました。報告してくれて感謝します。ありがとう！

これは、彼らが望めば問題を修正できることを示しています — ただ多くの問題ではそうしないだけです。

### 2021年：UI改善提案 {#2021-ui-improvement-suggestions}

2021年2月、ダッシュボードUI、特に「PayPal Recent Activity」セクションに関して詳細なフィードバックを提供しました：

> paypal.comのダッシュボード、特に「PayPal Recent Activity」は改善が必要だと思います。$0の定期支払いの「Created」ステータス行を表示すべきではありません — 余計な行が大量に増え、日々や過去数日の収入が一目でわかりにくくなります。

Mark Stuartはこれをコンシューマープロダクトチームに転送しました：

> ありがとう！Activityの担当チームはわかりませんが、正しいチームを見つけるためにコンシューマープロダクトの責任者に転送しました。$0.00の定期支払いはバグのように思えます。フィルターで除外すべきでしょう。

**結果**：修正されませんでした。UIは今も無意味な$0のエントリを表示しています。

### 2021年：サンドボックス環境の障害 {#2021-sandbox-environment-failures}

2021年11月、PayPalのサンドボックス環境に関する重大な問題を報告しました：

* サンドボックスのシークレットAPIキーがランダムに変更・無効化される
* すべてのサンドボックステストアカウントが通知なしに削除される
* サンドボックスアカウント詳細の表示時にエラーメッセージが出る
* 読み込みが断続的に失敗する

> なぜか私のサンドボックスのシークレットAPIキーが変更され、無効化されました。さらに古いサンドボックステストアカウントがすべて削除されました。

> 時々読み込める時もあれば、読み込めない時もあります。これは非常にフラストレーションが溜まります。

**結果**：返答も修正もなし。開発者は今もサンドボックスの信頼性問題に直面しています。

### 2021年：レポートシステムが完全に壊れている {#2021-reports-system-completely-broken}
2021年5月、PayPalの取引レポートのダウンロードシステムが完全に壊れていることを報告しました：

> 現在、レポートのダウンロードが機能していないようで、一日中ずっとそうです。失敗した場合はメール通知を受け取るべきだと思います。

また、セッション管理の大惨事についても指摘しました：

> また、PayPalにログインしたまま5分ほど操作しないとログアウトされます。なので、レポートのステータスを確認したいときにボタンを再度押すと（永遠に待った後で）、再ログインしなければならず面倒です。

Mark Stuartはセッションタイムアウトの問題を認めました：

> 過去にあなたが報告していたように、セッションが頻繁に切れて、IDEとdeveloper.paypal.comやマーチャントダッシュボードを行き来している間に開発の流れが妨げられ、戻ってきたらまたログアウトされているのを覚えています。

**結果**：セッションタイムアウトは依然として60秒です。レポートシステムは依然として定期的に失敗します。

### 2022年：コアAPI機能の欠如（再び） {#2022-core-api-feature-missing-again}

2022年1月、サブスクリプション一覧の問題を再度エスカレーションし、今回はドキュメントの誤りについてさらに詳細に指摘しました：

> すべてのサブスクリプション（以前は請求契約と呼ばれていた）を一覧表示するGETは存在しません。

公式ドキュメントが完全に不正確であることを発見しました：

> APIドキュメントも全く正確ではありません。サブスクリプションIDのハードコードされたリストをダウンロードすることで回避できると思っていましたが、それすら機能しません！

> 公式ドキュメントによると…これができると書いてあります…しかし肝心なことに、「サブスクリプションID」フィールドはどこにも存在せず、チェックできません。

PayPalのChristina Montiが回答しました：

> これらの手順が間違っていてご迷惑をおかけして申し訳ありません。今週中に修正します。

CTOのSri Shivanandaは感謝の意を表しました：

> 私たちをより良くするための継続的なご支援に感謝します。大変ありがたいです。

**結果**：ドキュメントは修正されませんでした。サブスクリプション一覧のエンドポイントも作成されませんでした。


## 開発者体験の悪夢 {#the-developer-experience-nightmare}

PayPalのAPIを使うことは10年前にタイムスリップしたかのようです。私たちが記録した技術的な問題は以下の通りです：

### 壊れたユーザーインターフェース {#broken-user-interface}

PayPalの開発者ダッシュボードは大惨事です。私たちが日々直面しているのは以下の通りです：

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPalのUIは非常に壊れていて通知を閉じることすらできません
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  開発者ダッシュボードではスライダーをドラッグさせられ、60秒後にログアウトされます
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal開発者インターフェースのさらなるUIの大惨事、壊れたワークフローの例
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  サブスクリプション管理インターフェース - インターフェースが非常に悪いため、製品やサブスクリプションプランの生成にコードに頼らざるを得ませんでした
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  壊れたサブスクリプションインターフェースのビュー、機能が欠落しています（製品/プラン/サブスクリプションを簡単に作成できず、UI上で一度作成した製品やプランを削除する方法も全くないようです）
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  典型的なPayPalエラーメッセージ - 不明瞭で役に立たない
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDKの問題 {#sdk-problems}

* スクリプトタグでSDKを再読み込みしながらボタンの切り替えと再レンダリングを行う複雑な回避策なしに、一回限りの支払いとサブスクリプションの両方を扱えない
* JavaScript SDKは基本的な規約（小文字のクラス名、インスタンスチェックなし）に違反している
* エラーメッセージがどのフィールドが不足しているかを示さない
* 一貫性のないデータ型（数値ではなく文字列の金額を要求）

### コンテンツセキュリティポリシー違反 {#content-security-policy-violations}

彼らのSDKはCSPにunsafe-inlineとunsafe-evalを要求し、**サイトのセキュリティを妥協させられる**。

### ドキュメントの混乱 {#documentation-chaos}

Mark Stuart本人も認めている：

> レガシーAPIと新APIが非常に多くて同意します。何を探せばいいか本当に見つけにくい（ここで働いている私たちでさえも）。

### セキュリティ脆弱性 {#security-vulnerabilities}

**PayPalの2FA実装は逆効果**。TOTPアプリを有効にしていてもSMS認証を強制し、SIMスワップ攻撃にアカウントが脆弱になる。TOTPを有効にしているなら、それだけを使うべき。フォールバックはSMSではなくメールであるべき。

### セッション管理の大惨事 {#session-management-disaster}

**開発者ダッシュボードは60秒の非アクティブでログアウトする**。生産的な作業をしようとすると、常にログイン → キャプチャ → 2FA → ログアウト → 繰り返しのループ。VPNを使っている？ それは運次第。

## 2025年7月：最後の一撃 {#july-2025-the-final-straw}

11年間同じ問題が続いた後、決定的な出来事は日常的なアカウント移行中に起きた。会社名「Forward Email LLC」に合わせて新しいPayPalアカウントに移行する必要があったため、会計をより明確にするためだった。

単純なはずのことが完全な災害に変わった：

* 初期テストではすべて正常に動作していた
* 数時間後、PayPalが予告なしにすべてのサブスクリプション支払いを突然ブロック
* 顧客は支払いができず、混乱とサポート負担が発生
* PayPalサポートはアカウントは認証済みと矛盾した回答をした
* PayPal支払いを完全に停止せざるを得なかった

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  支払いを試みた顧客が見たエラー - 説明なし、ログなし、何もなし
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  支払いが完全に壊れている間に、PayPalサポートはすべて正常だと主張。最後のメッセージでは「いくつかの機能を復元した」と言いながらも、まだ不明な追加情報を求める - 典型的なPayPalサポートの演技
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
  何も「修正」しなかったとされる本人確認プロセス
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
  あいまいなメッセージで、未だ解決なし。追加情報が何かも全く通知されず、顧客サポートは沈黙したままです。
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## なぜPayPalを単純にやめられないのか {#why-we-cant-just-drop-paypal}

これらの問題があっても、一部の顧客はPayPalしか支払い手段がないため、PayPalを完全に放棄することはできません。ある顧客が私たちの[ステータスページ](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)でこう言っています：

> PayPalは私の唯一の支払い手段です

**PayPalが特定のユーザーに対して支払いの独占を作り出したため、私たちは壊れたプラットフォームをサポートし続けざるを得ません。**


## コミュニティによる回避策 {#the-community-workaround}

PayPalが基本的なサブスクリプション一覧機能を提供しないため、開発者コミュニティが回避策を作りました。私たちはPayPalのサブスクリプション管理を助けるスクリプトを作成しました：[set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

このスクリプトは、開発者が解決策を共有する[コミュニティのgist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)を参照しています。実際にユーザーからは、PayPalが何年も前に作るべきだったものを提供してくれてありがとうと[感謝されています](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)。


## フィッシング対策のためのPayPalテンプレートのブロック {#blocking-paypal-templates-due-to-phishing}

問題はAPIだけにとどまりません。PayPalのメールテンプレートは非常にデザインが悪いため、フィッシングと区別がつかず、私たちのメールサービスで特定のフィルタリングを実装せざるを得ませんでした。

### 本当の問題：PayPalのテンプレートは詐欺メールのように見える {#the-real-problem-paypals-templates-look-like-scams}

PayPalのメールがまさにフィッシングのように見えるという報告を定期的に受けています。以下は実際の弊社の通報例です：

**件名:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

このメールはフィッシングの疑いがあるとして `abuse@microsoft.com` に転送されました。問題は？実際にはPayPalのサンドボックス環境からのものでしたが、テンプレートのデザインがあまりに悪く、フィッシング検出システムを誤作動させてしまうのです。

### 私たちの実装 {#our-implementation}

PayPal専用のフィルタリングは私たちの[email filtering code](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172)で確認できます：

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

### なぜPayPalをブロックせざるを得なかったのか {#why-we-had-to-block-paypal}

PayPalは私たちが繰り返し通報しても、膨大なスパム・フィッシング・詐欺問題を修正しなかったため、この対応を実装しました。ブロックしている特定のメールタイプは以下の通りです：

* **RT000238** - 疑わしい請求書通知
* **PPC001017** - 問題のある支払い確認
* **RT000542** - ギフトメッセージのハック試行

### 問題の規模 {#the-scale-of-the-problem}

私たちのスパムフィルタリングログは、毎日処理しているPayPal請求書スパムの膨大な量を示しています。ブロックされた件名の例は以下の通りです：

* "Invoice from PayPal Billing Team:- This charge will be auto-debited from your account. Please contact us immediately at \[PHONE]"
* "Invoice from \[COMPANY NAME] (\[ORDER-ID])"
* 異なる電話番号や偽の注文IDを使った複数のバリエーション
これらのメールは多くの場合 `outlook.com` ホストから送信されますが、PayPalの正当なシステムから発信されているように見えるため、特に危険です。これらのメールはPayPalの実際のインフラを通じて送信されているため、SPF、DKIM、およびDMARC認証を通過します。

当社の技術ログによると、これらのスパムメールには正当なPayPalのヘッダーが含まれています：

* `X-Email-Type-Id: RT000238`（当社がブロックしているのと同じID）
* `From: "service@paypal.com" <service@paypal.com>`
* `paypal.com` からの有効なDKIM署名
* PayPalのメールサーバーを示す適切なSPFレコード

これにより、正当なPayPalのメールとスパムの両方が同一の技術的特徴を持つという不可能な状況が生まれます。

### 皮肉な話 {#the-irony}

金融詐欺との戦いをリードすべきPayPalが、フィッシング対策システムを誤作動させるほどにメールテンプレートが不十分であるということです。詐欺メールと区別がつかないため、正当なPayPalのメールをブロックせざるを得ません。

これはセキュリティ研究でも文書化されています：[Beware PayPal new address fraud](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) — PayPal自身のシステムが詐欺に悪用されていることを示しています。

### 実際の影響：新たなPayPal詐欺 {#real-world-impact-novel-paypal-scams}

問題は単なるテンプレートの不備にとどまりません。PayPalの請求書システムは非常に悪用されやすく、詐欺師が正当なように見える偽の請求書を頻繁に送信しています。セキュリティ研究者Gavin Andereggは、詐欺師がすべての認証チェックを通過する本物のPayPal請求書を送信する [A Novel PayPal Scam](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) を記録しました：

> 「ソースを調べると、メールは実際にPayPalから送られたように見えました（SPF、DKIM、DMARCすべて通過）。ボタンも正当なPayPalのURLのように見えました… 正当なメールだと気づくまでに少し時間がかかりました。詐欺師からランダムに送られた『請求書』だったのです。」

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  複数の詐欺的なPayPal請求書が受信箱に殺到し、すべてが実際にPayPalのシステムから送信されているため正当なように見えるスクリーンショット
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

研究者は次のように述べています：

> 「これはPayPalが制限を検討すべき利便性機能のようにも見えます。私はすぐにこれが何らかの詐欺だと判断し、技術的な詳細にのみ興味を持ちました。実行があまりにも簡単すぎるように思え、他の人が騙されるのではないかと心配しています。」

これは問題を完璧に示しています：PayPal自身の正当なシステムが非常に不十分に設計されているため、詐欺を可能にし、同時に正当な通信を疑わしく見せてしまっています。

さらに悪いことに、これによりYahooでの配信率に影響が出て顧客からの苦情が発生し、数時間にわたる綿密なテストとパターンチェックを強いられました。


## PayPalの逆行するKYCプロセス {#paypals-backwards-kyc-process}

PayPalのプラットフォームで最も苛立たしい点の一つは、コンプライアンスおよび本人確認（KYC）手続きに対する逆行的なアプローチです。他のすべての決済プロセッサとは異なり、PayPalは開発者がAPIを統合し、適切な認証を完了する前に本番環境での支払い収集を開始することを許可しています。

### 正しい流れ {#how-it-should-work}

すべての正当な決済プロセッサは以下の論理的な順序に従います：

1. **まずKYC認証を完了する**
2. **加盟店アカウントを承認する**
3. **本番環境のAPIアクセスを提供する**
4. **支払い収集を許可する**

これにより、資金の移動が発生する前にコンプライアンスが確保され、決済プロセッサと加盟店の双方が保護されます。

### PayPalの実際の流れ {#how-paypal-actually-works}

PayPalのプロセスは完全に逆です：

1. **即座に本番環境のAPIアクセスを提供する**
2. **数時間または数日間支払い収集を許可する**
3. **予告なしに突然支払いをブロックする**
4. **顧客に影響が出た後でKYC書類を要求する**
5. **加盟店に通知を一切行わない**
6. **顧客が問題を発見し報告するのを待つ**
### 実際の影響 {#the-real-world-impact}

この逆行的なプロセスは、企業にとって災害を引き起こします：

* **ピーク販売期間中に顧客が購入を完了できない**
* **検証が必要であるという事前警告がない**
* **支払いがブロックされた際のメール通知がない**
* **問題を混乱した顧客からしか知ることができない**
* **重要なビジネス期間中の収益損失**
* **支払いが謎に失敗することで顧客の信頼が損なわれる**

### 2025年7月のアカウント移行災害 {#the-july-2025-account-migration-disaster}

この正確なシナリオは、2025年7月の定期的なアカウント移行時に発生しました。PayPalは最初は支払いを許可していましたが、突然通知なしに支払いをブロックしました。問題に気づいたのは、顧客から支払いができないと報告があった時だけでした。

サポートに連絡したところ、必要な書類について矛盾した回答があり、解決の明確なタイムラインも示されませんでした。そのため、PayPalの支払いを完全に停止せざるを得ず、他に支払い手段がない顧客を混乱させました。

### なぜこれが重要なのか {#why-this-matters}

PayPalのコンプライアンスへのアプローチは、企業の運営方法を根本的に誤解しています。適切なKYCは、顧客がすでに支払いを試みる前の**本番統合前**に行うべきです。問題が発生した際の積極的なコミュニケーションの欠如は、PayPalが加盟店のニーズから乖離していることを示しています。

この逆行的なプロセスは、PayPalのより広範な組織問題の症状です：彼らは加盟店や顧客体験よりも内部プロセスを優先し、その結果、企業がプラットフォームから離れるような運用上の災害を引き起こしています。


## 他のすべての決済プロセッサが正しく行っている方法 {#how-every-other-payment-processor-does-it-right}

PayPalが実装を拒否しているサブスクリプション一覧機能は、業界で10年以上標準となっています。以下は他の決済プロセッサがこの基本要件をどのように扱っているかです：

### Stripe {#stripe}

StripeはAPI開始時からサブスクリプション一覧機能を持っています。ドキュメントには顧客または加盟店アカウントのすべてのサブスクリプションを取得する方法が明確に示されています。これは基本的なCRUD機能と見なされています。

### Paddle {#paddle}

Paddleは一覧表示、フィルタリング、ページネーションを含む包括的なサブスクリプション管理APIを提供しています。加盟店が定期収益の流れを把握する必要があることを理解しています。

### Coinbase Commerce {#coinbase-commerce}

暗号通貨決済プロセッサであるCoinbase Commerceでさえ、PayPalより優れたサブスクリプション管理を提供しています。

### Square {#square}

SquareのAPIには、サブスクリプション一覧が基本機能として含まれており、後付けではありません。

### 業界標準 {#the-industry-standard}

すべての最新決済プロセッサは以下を提供しています：

* すべてのサブスクリプションの一覧表示
* ステータス、日付、顧客によるフィルタリング
* 大規模データセットのページネーション
* サブスクリプション変更のWebhook通知
* 動作例を含む包括的なドキュメント

### 他のプロセッサが提供するもの vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - すべてのサブスクリプション一覧:**

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

**Stripe - ステータスによるフィルタリング:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - 実際に得られるもの:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# IDを既に知っている場合のみ、1つのサブスクリプションを取得可能
# すべてのサブスクリプションを一覧表示するエンドポイントは存在しない
# 検索やフィルタリングの方法はない
# すべてのサブスクリプションIDを自分で管理する必要がある
```

**PayPalの利用可能なエンドポイント:**

* `POST /v1/billing/subscriptions` - サブスクリプション作成
* `GET /v1/billing/subscriptions/{id}` - 1つのサブスクリプション取得（IDが分かっている場合）
* `PATCH /v1/billing/subscriptions/{id}` - サブスクリプション更新
* `POST /v1/billing/subscriptions/{id}/cancel` - サブスクリプションキャンセル
* `POST /v1/billing/subscriptions/{id}/suspend` - サブスクリプション一時停止
**PayPalに欠けているもの：**

* ❌ `GET /v1/billing/subscriptions`（すべてのリスト）がない
* ❌ 検索機能がない
* ❌ ステータス、顧客、日付によるフィルタリングがない
* ❌ ページネーションのサポートがない

PayPalは、開発者にサブスクリプションIDを自分たちのデータベースで手動で追跡させる唯一の主要な決済プロセッサです。


## PayPalの組織的隠蔽：600万人の声を封じる {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPalの批判への対応方法を完璧に象徴する動きとして、彼らは最近コミュニティフォーラム全体をオフラインにし、600万人以上のメンバーの声を事実上封じ、彼らの失敗を記録した数十万の投稿を消し去りました。

### 大消去 {#the-great-erasure}

元のPayPalコミュニティは `paypal-community.com` にあり、**6,003,558人のメンバー**を抱え、数十万の投稿、バグ報告、苦情、PayPalのAPIの失敗に関する議論が含まれていました。これはPayPalの組織的問題の10年以上にわたる記録証拠を表していました。

2025年6月30日、PayPalは静かにフォーラム全体をオフラインにしました。現在、すべての `paypal-community.com` のリンクは404エラーを返します。これは移行やアップグレードではありませんでした。

### サードパーティによる救済 {#the-third-party-rescue}

幸いにも、[ppl.lithium.com](https://ppl.lithium.com/) のサードパーティサービスが一部のコンテンツを保存しており、PayPalが隠そうとした議論にアクセス可能です。しかし、このサードパーティによる保存は不完全であり、いつでも消える可能性があります。

証拠を隠すこのパターンはPayPalにとって新しいものではありません。彼らには以下のような記録があります：

* 重要なバグ報告を公の場から削除する
* 開発者ツールを予告なく廃止する
* 適切なドキュメントなしにAPIを変更する
* 失敗に関するコミュニティの議論を封じる

フォーラムの閉鎖は、彼らの組織的失敗を公の監視から隠すためのこれまでで最も露骨な試みを示しています。


## 11年にわたるキャプチャバグの惨事：$1,899の損失と増え続ける被害 {#the-11-year-capture-bug-disaster-1899-and-counting}

PayPalがフィードバックセッションを開催し約束をしている間に、彼らのコア決済処理システムは11年以上にわたり根本的に壊れたままでした。その証拠は衝撃的です。

### Forward Emailの$1,899の損失 {#forward-emails-1899-loss}

当社の本番システムでは、PayPalのキャプチャ失敗により失われた合計**$1,899**に相当する108件のPayPal支払いを発見しました。これらの支払いは一貫したパターンを示しています：

* `CHECKOUT.ORDER.APPROVED` のWebhookは受信された
* PayPalのキャプチャAPIは404エラーを返した
* 注文はPayPalのAPIを通じてアクセス不能になった

顧客に請求が行われたかどうかを判断することは不可能です。PayPalは14日後にデバッグログを完全に隠し、キャプチャされなかった注文IDのすべてのデータをダッシュボードから消去するためです。

これは単一の事業者の例に過ぎません。**11年以上にわたり数千の加盟店全体での損失は数百万ドルにのぼる可能性があります。**

**繰り返します：11年以上にわたり数千の加盟店全体での損失は数百万ドルにのぼる可能性があります。**

これを発見できた唯一の理由は、私たちが非常に綿密でデータ駆動型だからです。

### 2013年の最初の報告：11年以上の怠慢 {#the-2013-original-report-11-years-of-negligence}

この問題の最も古い記録は、[2013年11月のStack Overflow](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)（[アーカイブ](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)）にあります：

> "キャプチャ時にREST APIで404エラーが継続して発生する"

2013年に報告されたエラーは、2024年にForward Emailが経験したものと**全く同じ**です：

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

2013年のコミュニティの反応は示唆的でした：

> "現在REST APIに問題が報告されています。PayPalは対応中です。"
**11年以上経っても、彼らはまだ「対応中」です。**

### 2016年の告白：PayPalが自社のSDKを壊す {#the-2016-admission-paypal-breaks-their-own-sdk}

2016年、PayPalの公式GitHubリポジトリには、公式PHP SDKに影響を与える[大規模なキャプチャ失敗](https://github.com/paypal/PayPal-PHP-SDK/issues/660)が記録されていました。その規模は驚異的でした：

> 「2016年9月20日以降、すべてのPayPalキャプチャ試行が 'INVALID_RESOURCE_ID - Requested resource ID was not found.' というエラーで失敗しています。9月19日から9月20日の間にAPI統合に変更はありません。**9月20日以降のキャプチャ試行の100％がこのエラーを返しています。**」

ある加盟店は報告しました：

> 「過去24時間で**1,400回以上のキャプチャ失敗があり、すべてINVALID_RESOURCE_IDエラーの応答でした。**」

PayPalの最初の対応は加盟店の責任にし、テクニカルサポートに案内するものでした。大きな圧力を受けてようやく彼らは過失を認めました：

> 「製品開発者からの更新があります。送信されているヘッダーでPayPal-Request-IDが42文字で送信されていることに気づきましたが、**最近の変更でこのIDは38文字に制限されたようです。**」

この告白はPayPalの組織的な怠慢を明らかにしています：

1. **未文書の破壊的変更を行った**
2. **自社の公式SDKを壊した**
3. **まず加盟店を非難した**
4. **圧力を受けて初めて過失を認めた**

問題を「修正」した後も、加盟店は報告しました：

> 「SDKをv1.7.4にアップグレードしましたが、**問題はまだ発生しています。**」

### 2024年のエスカレーション：依然として壊れたまま {#the-2024-escalation-still-broken}

保存されたPayPalコミュニティからの最近の報告によると、問題は実際に悪化しています。[2024年9月の議論](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)（[アーカイブ](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)）ではまったく同じ問題が記録されています：

> 「問題は約2週間前から発生し始め、すべての注文に影響しているわけではありません。**より一般的なのはキャプチャ時の404エラーのようです。**」

加盟店はForward Emailが経験したのと同じパターンを説明しています：

> 「注文をキャプチャしようとすると、PayPalは404を返します。注文の詳細を取得すると：{'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **これは我々側で成功したキャプチャの痕跡が全くない状態です。**」

### Webhookの信頼性の大惨事 {#the-webhook-reliability-disaster}

別の[保存されたコミュニティの議論](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446)では、PayPalのWebhookシステムが根本的に信頼できないことが明らかになっています：

> 「理論上はWebhookイベントから2つのイベント（CHECKOUT.ORDER.APPROVEDとPAYMENT.CAPTURE.COMPLETED）があるはずです。実際には、**これら2つのイベントはほとんど即時に受信されず、PAYMENT.CAPTURE.COMPLETEDはほとんどの場合受信されないか、数時間後に受信されます。**」

サブスクリプション支払いについては：

> 「**'PAYMENT.SALE.COMPLETED'は時々受信されなかったり、数時間後にしか受信されなかったりします。**」

加盟店の質問はPayPalの信頼性問題の深刻さを示しています：

1. **「なぜこれが起こるのか？」** - PayPalのWebhookシステムは根本的に壊れている
2. **「注文ステータスが 'COMPLETED' なら、入金を受け取ったと考えてよいか？」** - 加盟店はPayPalのAPI応答を信用できない
3. **「なぜ 'Event Logs->Webhook Events' にログが見つからないのか？」** - PayPal自身のログシステムも機能していない

### 組織的怠慢のパターン {#the-pattern-of-systematic-negligence}

証拠は11年以上にわたり、明確なパターンを示しています：

* **2013年**：「PayPalは対応中」
* **2016年**：PayPalが破壊的変更を認め、壊れた修正を提供
* **2024年**：まったく同じエラーが依然として発生し、Forward Emailや無数の他の加盟店に影響

これは単なるバグではなく、**組織的怠慢です。** PayPalはこれらの重大な決済処理の失敗を10年以上も知りながら、一貫して：
1. **PayPalのバグについて加盟店を非難した**
2. **文書化されていない破壊的変更を行った**
3. **機能しない不十分な修正を提供した**
4. **ビジネスへの財務的影響を無視した**
5. **コミュニティフォーラムを閉鎖して証拠を隠蔽した**

### 文書化されていない要件 {#the-undocumented-requirement}

PayPalの公式ドキュメントのどこにも、加盟店がキャプチャ操作に対してリトライロジックを実装しなければならないとは記載されていません。ドキュメントには加盟店は「承認後すぐにキャプチャすべき」と記載されていますが、APIがランダムに404エラーを返し複雑なリトライ機構が必要になることは一切触れられていません。

これにより、すべての加盟店は以下を強いられます：

* 指数的バックオフのリトライロジックを実装する
* 一貫性のないWebhook配信を処理する
* 複雑な状態管理システムを構築する
* 失敗したキャプチャを手動で監視する

**他のすべての決済プロセッサは、初回で動作する信頼性の高いキャプチャAPIを提供しています。**


## PayPalのより広範な欺瞞パターン {#paypals-broader-pattern-of-deception}

キャプチャバグの大惨事は、PayPalが顧客を欺き失敗を隠す体系的な手法の一例に過ぎません。

### ニューヨーク金融サービス局の措置 {#the-new-york-department-of-financial-services-action}

2025年1月、ニューヨーク金融サービス局はPayPalに対して[欺瞞的行為に関する執行措置](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)を発表し、PayPalの欺瞞パターンがAPIにとどまらず広範囲に及ぶことを示しました。

この規制措置は、PayPalが開発者ツールだけでなく、事業全体で欺瞞的行為に関与していることを示しています。

### Honey訴訟：アフィリエイトリンクの書き換え {#the-honey-lawsuit-rewriting-affiliate-links}

PayPalによるHoneyの買収は、Honeyがアフィリエイトリンクを書き換え、コンテンツクリエイターやインフルエンサーのコミッションを盗んでいるとする[訴訟](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer)を引き起こしました。これは、PayPalが他者に渡るべき収益をリダイレクトして利益を得る、別の体系的な欺瞞の形態です。

パターンは明確です：

1. **APIの失敗**：壊れた機能を隠し、加盟店を非難する
2. **コミュニティの沈黙**：問題の証拠を削除する
3. **規制違反**：欺瞞的行為に関与する
4. **アフィリエイトの窃盗**：技術的操作でコミッションを盗む

### PayPalの怠慢によるコスト {#the-cost-of-paypals-negligence}

Forward Emailの1,899ドルの損失は氷山の一角に過ぎません。より広範な影響を考慮すると：

* **個々の加盟店**：数千人が数百から数千ドルを失う
* **企業顧客**：数百万ドルの収益損失の可能性
* **開発者の時間**：PayPalの壊れたAPIの回避策構築に無数の時間を費やす
* **顧客の信頼**：PayPalの決済失敗により顧客を失う企業

小さなメールサービスが約2,000ドルを失い、この問題が11年以上存在し数千の加盟店に影響を与えていることを考えると、総合的な財務的損害は**数億ドル**に達すると推測されます。

### ドキュメントの嘘 {#the-documentation-lie}

PayPalの公式ドキュメントは、加盟店が直面する重要な制限やバグについて一貫して言及していません。例えば：

* **キャプチャAPI**：404エラーが頻発しリトライロジックが必要であることに言及なし
* **Webhookの信頼性**：Webhookが数時間遅延することに言及なし
* **サブスクリプション一覧**：エンドポイントが存在しないのに一覧が可能と示唆
* **セッションタイムアウト**：厳しい60秒タイムアウトに言及なし

この重要情報の体系的な省略により、加盟店は本番環境で試行錯誤しながらPayPalの制限を発見せざるを得ず、多くの場合財務的損失を被ります。


## 開発者にとっての意味 {#what-this-means-for-developers}

PayPalが基本的な開発者ニーズに対応せず、膨大なフィードバックを収集しながらも問題を実際に修正しない体系的な失敗は、組織的な根本問題を示しています。彼らはフィードバック収集を問題解決の代替手段とみなしています。
パターンは明確です：

1. 開発者が問題を報告する  
2. PayPalが経営陣とのフィードバックセッションを開催する  
3. 詳細なフィードバックが提供される  
4. チームがギャップを認め、「追跡して対処する」と約束する  
5. 何も実装されない  
6. 経営陣がより良い企業へ移る  
7. 新しいチームが同じフィードバックを求める  
8. サイクルが繰り返される  

その間、開発者は支払いを受け入れるために、回避策を構築し、セキュリティを妥協し、壊れたUIに対処せざるを得ません。

もしあなたが決済システムを構築しているなら、私たちの経験から学んでください：複数の決済プロセッサーを使った[トリフェクタアプローチ](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)を構築しましょう。しかし、PayPalが必要な基本機能を提供してくれるとは期待しないでください。初日から回避策を構築する計画を立ててください。

> この投稿はForward EmailにおけるPayPalのAPIに関する11年間の経験を記録しています。すべてのコード例とリンクは実際の本番システムからのものです。これらの問題にもかかわらず、一部の顧客に他の選択肢がないため、私たちはPayPal決済のサポートを続けています。

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
