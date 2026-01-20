# 不正行為を報告する {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## 目次 {#table-of-contents}

* [免責事項](#disclaimer)
* [不正行為の報告方法](#how-to-submit-an-abuse-report)
* [一般の方向け](#for-the-general-public)
* [法執行機関向け](#for-law-enforcement)
  * [入手可能な情報](#what-information-is-available)
  * [入手できない情報](#what-information-is-not-available)
  * [米国に拠点を置く法執行機関](#law-enforcement-based-in-the-united-states)
  * [米国外に拠点を置く法執行機関](#law-enforcement-based-outside-of-the-united-states)
  * [法執行機関の緊急要請](#law-enforcement-emergency-requests)
  * [法執行機関の要請によりアカウント通知が発せられる場合があります](#law-enforcement-requests-may-trigger-account-notices)
  * [法執行機関による情報保全の要請](#law-enforcement-requests-to-preserve-information)
  * [法執行機関の執行手続き](#law-enforcement-serving-process)

## 免責事項 {#disclaimer}

サイト全体に適用される [条項](/terms) に従ってください。

## 不正行為報告の提出方法 {#how-to-submit-an-abuse-report}

当社は不正使用報告を確認し、[一般大衆](#for-the-general-public) および [法執行機関](#for-law-enforcement) に関する情報要求をケースバイケースで電子メールで対応します。

ユーザー、メール、IP アドレス、ドメインに関する不正使用の報告および情報要求は、以下では総称して「アカウント」と呼ばれます。

不正使用に関するご要望やご報告の連絡先メールアドレス：`abuse@forwardemail.net`

あなたに関係する可能性のある詳細情報については、以下のセクションをお読みください。

## 一般向け {#for-the-general-public}

<u>**ご自身または他の方が差し迫った危害を受けている場合は、直ちに警察と救急サービスに連絡してください。**</u>

<u>**アカウントへのアクセスを回復したり、悪意のある行為を阻止したりするには、専門家の法的助言を求める必要があります。**</u>

当社のサービスをご利用中のアカウントから不正行為の被害に遭われた場合は、上記のメールアドレスまでご報告ください。アカウントが悪意のある人物に乗っ取られた場合（例：ドメインが最近期限切れとなり、第三者によって再登録され、不正に使用されたなど）は、正確なアカウント情報（ドメイン名など）を記載したレポートを上記のメールアドレスまでお送りください。以前の所有権を確認後、アカウントの[シャドウバン](https://en.wikipedia.org/wiki/Shadow_banning)をお手伝いいたします。ただし、アカウントへのアクセス回復を支援する権限は当社にはございませんのでご了承ください。

法定代理人は、法執行機関、アカウント所有者 (ドメイン名のレジストラ、ドメイン名を登録した Web サイトなど) に連絡するようアドバイスしたり、[ICANNのドメイン喪失に関するページ](https://www.icann.org/resources/pages/lost-domain-names) に委ねたりする場合があります。

## 法執行機関向け {#for-law-enforcement}

大半の要請において、当社が情報を開示できるかどうかは、[電子通信プライバシー法](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285)（[ウィキペディア](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)）、[18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701)、その他（以下「ECPA」）の規定に基づきます。ECPAは、召喚状、裁判所命令、捜索令状など、特定の種類の法的要請に応じてのみ、特定のユーザー情報を法執行機関に開示することを義務付けています。

法執行機関の職員で、アカウントに関する情報をご希望の場合は、アカウント情報と日時範囲をリクエストに含めてください。過度に広範かつ曖昧なリクエストは処理できません。これは、ユーザーのデータと信頼を守り、そして何よりもデータの安全性を確保するためです。

お客様のリクエストが [条項](/terms) に違反していることを示すものである場合、当社は不正使用に対処するための社内専用のベスト プラクティスに従ってそのリクエストを処理します。場合によっては、アカウントの停止や禁止につながる可能性があることにご注意ください。

**当社はドメイン名レジストラではありません**。ドメイン名に関する過去のDNSレコード情報が必要な場合は、該当のドメインに対応するドメイン名レジストラにお問い合わせください。[Security Trails]() などのサービスでは過去のレコードを検索できますが、レジストラからより具体的で正確な情報が得られる場合もあります。ドメインのドメイン名レジストラおよび/またはDNSネームサーバーの所有者を特定するには、`dig`および`whois`ツールが役立つ場合があります（例：`whois example.com`または`dig example.com ns`）。DNSレコード検索（例：`dig example.com mx`および`dig example.com txt`）を実行することで、アカウントが当社のサービスの有料プランまたは無料プランのどちらに加入しているかを判断できます。 MXレコードが`mx1.forwardemail.net`や`mx2.forwardemail.net`などの値を返さない場合、そのドメインは当社のサービスを利用していません。TXTレコードがプレーンテキストのメールアドレス（例：`forward-email=user@example.com`）を返す場合、それはドメインのメール転送先アドレスを示しています。代わりに`forward-email-site-verification=XXXXXXXXXX`などの値が返される場合は、有料プランをご利用であり、転送設定が`whois`0というIDで当社のデータベースに保存されていることを示しています。DNSレベルでの当社のサービスの仕組みの詳細については、`whois`1をご覧ください。

### 利用可能な情報 {#what-information-is-available}

[収集される情報](/privacy#information-collected)については、プライバシーポリシーのセクションをご参照ください。アカウントは、データ保持およびプライバシーに関する法律を遵守し、システムから情報を削除することが認められています。[情報の削除](/privacy#information-removal)については、プライバシーポリシーのセクションをご参照ください。これは、アカウントが削除されているため、リクエスト時にリクエストされた情報が利用できない可能性があることを意味します。

### 利用できない情報 {#what-information-is-not-available}

[収集されない情報](/privacy#information-not-collected) については、プライバシー ポリシーのセクションを参照してください。

### 米国を拠点とする法執行機関 {#law-enforcement-based-in-the-united-states}

[緊急事態の例外](#law-enforcement-emergency-requests) では、有効な召喚状、ECPA 米国裁判所命令、および/または捜索令状を受け取った場合にのみアカウント情報を共有します。

法律または裁判所の命令によって禁止されていない限り、当社は法執行機関の要請についてさらに [アカウントに通知する](#law-enforcement-requests-may-trigger-account-notices) することがあります。

有効な召喚状、ECPA 裁判所命令、捜索令状を受け取った場合、当社は可能な限り関連性のある入手可能な情報を提供します。

### 米国外に拠点を置く法執行機関 {#law-enforcement-based-outside-of-the-united-states}

米国外に拠点を置く法執行機関からのリクエストは、次のいずれかを通じて処理される必要があります。

* 米国の裁判所。
* [米国刑事共助条約](https://www.justice.gov/criminal-oia/file/1498806/download) ([ウィキペディア](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) (以下「MLAT」) の手続きに従う執行機関。
* 米国司法長官が[18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523)の要件を満たしていると決定し、議会に認証した行政協定の対象となる外国政府からの命令。

### 法執行機関の緊急要請 {#law-enforcement-emergency-requests}

米国の法律で認められている場合（例：[合衆国法典第18編第2702条(b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)に従って、政府機関が、死亡または重大な身体的傷害の危険を伴う緊急事態が発生し、緊急事態に関連する通信を遅滞なく開示する必要があると確信している場合）および[§2702（c）](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)顧客記録開示の例外。サブセクション（a）に記載されているプロバイダーは、当該サービスの加入者または顧客に関する記録またはその他の情報（サブセクション（a）（1）または（a）（2））に含まれる通信の内容は含まない）を、誠意を持って、かつ独立した検証に基づいて開示することができます。要求者 – 死亡または重大な身体的傷害を防ぐために遅滞なくそうする必要があると判断した場合、当社は召喚状、ECPA 裁判所命令、および/または捜索令状なしに、アカウント情報を法執行機関に開示および共有することがあります。

タイムリーで迅速なプロセスを提供するために、緊急データ要求 (EDR) は電子メールで送信し、すべての関連情報を含める必要があります。

当社は、電子メールによる巧妙ななりすまし、フィッシング、偽装攻撃を認識していることに注意してください (例: [ガーディアン紙の記事](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law) を参照)。

EDR の処理に関する当社のポリシーは次のとおりです。

1. 検証のために、電子メール ヘッダーのメタデータ (DKIM/SPF/DMARC など) (またはその欠如) を独自に調査します。

2. 申請の真正性を確認するため、申請者に対し、誠意を持って（必要に応じて繰り返し）独自に電話で連絡を取るよう最善を尽くします。例えば、申請元の管轄区域に関連する`.gov`のウェブサイトを調査し、その後、公開されている公式電話番号から当該事務所に電話をかけ、申請内容を確認する場合があります。

### 法執行機関からの要請によりアカウント通知が発せられる場合があります {#law-enforcement-requests-may-trigger-account-notices}

当社は、法律または裁判所命令により禁止されない限り（例：[18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)）、アカウントに通知し、当該アカウントに関連する法執行機関からの要請のコピーを提供する場合があります。これらの場合、該当する場合は、非開示命令の有効期限が切れた時点でアカウントに通知する場合があります。

法執行機関による情報開示請求が正当な場合、当社は[必要かつ要求されたアカウント情報を保存する](#law-enforcement-requests-to-preserve-information)を行い、アカウント所有者の登録済みかつ確認済みのメールアドレス宛に（例えば7暦日以内）連絡できるよう合理的な努力を払います。適時（例えば7暦日以内）に異議申し立てがあった場合、当社はアカウント情報の開示を差し控え、必要に応じて法的手続きを継続します。

### 法執行機関による情報保存の要請 {#law-enforcement-requests-to-preserve-information}

[18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703)に基づき、法執行機関からのアカウント情報の保存に関する正当な要請には応じます。データの保存は、具体的に要請され、かつ現在入手可能な範囲に限定されますのでご了承ください。

### 法執行機関による送達手続き {#law-enforcement-serving-process}

法執行機関による有効な要請には、当社が対応し、要求された情報を電子的に提供できる有効かつ機能的な電子メール アドレスの提供が求められます。

すべてのリクエストは、上記の [不正行為の報告方法](#how-to-submit-an-abuse-report) で指定された電子メール アドレスに送信する必要があります。

すべての法執行要請は、機関または部門のレターヘッド（例：スキャンした PDF の添付ファイル）を使用し、公式かつ関連する電子メール アドレスから送信し、署名する必要があります。

[緊急要請](#law-enforcement-emergency-requests) に関する場合は、メールの件名に「緊急法執行要請」と記入してください。

ご要望を確認してご返答するまでに少なくとも 2 週間かかる場合がありますのでご了承ください。