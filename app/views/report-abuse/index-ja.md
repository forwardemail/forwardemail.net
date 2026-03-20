# 不正行為の報告 {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Forward Emailへの不正行為およびスパムの報告" class="rounded-lg" />


## 目次 {#table-of-contents}

* [免責事項](#disclaimer)
* [不正行為報告の提出方法](#how-to-submit-an-abuse-report)
* [一般の方へ](#for-the-general-public)
* [法執行機関向け](#for-law-enforcement)
  * [提供可能な情報](#what-information-is-available)
  * [提供できない情報](#what-information-is-not-available)
  * [米国内の法執行機関](#law-enforcement-based-in-the-united-states)
  * [米国外の法執行機関](#law-enforcement-based-outside-of-the-united-states)
  * [法執行機関の緊急要請](#law-enforcement-emergency-requests)
  * [法執行機関の要請によるアカウント通知の可能性](#law-enforcement-requests-may-trigger-account-notices)
  * [情報保存のための法執行機関の要請](#law-enforcement-requests-to-preserve-information)
  * [法執行機関への手続きの執行](#law-enforcement-serving-process)


## 免責事項 {#disclaimer}

サイト全体に適用される当社の[利用規約](/terms)をご参照ください。


## 不正行為報告の提出方法 {#how-to-submit-an-abuse-report}

当社は、不正行為報告および[一般の方](#for-the-general-public)や[法執行機関](#for-law-enforcement)からの情報開示要請を、ケースバイケースでメールにて対応しています。

ユーザー、メール、IPアドレス、および/またはドメインに関する不正行為報告および情報開示要請は、以下「アカウント」と総称します。

不正行為に関するご連絡や報告は、当社のメールアドレス `support@forwardemail.net`、`abuse@forwardemail.net`、および `security@forwardemail.net` までお願いいたします。

可能であればこれらすべてのメールアドレスに送信し、24～48時間以上経っても返信がない場合はリマインダーメールをお送りください。

以下のセクションもご参照いただき、該当する情報をご確認ください。


## 一般の方へ {#for-the-general-public}

<u>**ご自身または他の方が差し迫った危険にさらされている場合は、直ちに警察や緊急サービスにご連絡ください。**</u>

<u>**アカウントへのアクセスを取り戻すため、または悪意のある行為者を止めるために、専門の法律相談を受けることをお勧めします。**</u>

当社のサービスを利用しているアカウントからの不正行為の被害者である場合は、上記のメールアドレス宛に報告をお送りください。もし悪意のある行為者にアカウントを乗っ取られた場合（例：ドメインが最近期限切れとなり第三者に再登録され、その後不正行為に使用された場合）、正確なアカウント情報（例：ドメイン名）を記載の上、上記のメールアドレスに報告をお送りください。以前の所有権の確認後にアカウントを[シャドウバン](https://en.wikipedia.org/wiki/Shadow_banning)する支援が可能です。ただし、アカウントへのアクセス権を回復する権限は当社にはありません。

法的代理人からは、法執行機関、アカウント所有者（例：ドメイン名の登録事業者、ドメイン名を登録したウェブサイト）、および[ICANNの失効ドメインに関するページ](https://www.icann.org/resources/pages/lost-domain-names)への連絡を勧められる場合があります。


## 法執行機関向け {#for-law-enforcement}

ほとんどの要請において、当社が情報を開示できる範囲は[電子通信プライバシー法](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act))、[18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) 等（以下「ECPA」）により規定されています。ECPAは、召喚状、裁判所命令、捜索令状など特定の法的要請に対してのみ、法執行機関に特定のユーザー情報を開示することを義務付けています。

法執行機関の方でアカウントに関する情報を求める場合は、アカウント情報および日時の範囲を要請に含めてください。過度に広範または曖昧な要請は処理できません。これはユーザーのデータと信頼を保護し、何よりもデータの安全を確保するためです。
もしご依頼が当社の[利用規約](/terms)違反を示す場合、当社は内部のベストプラクティスに従って対応します。場合によってはアカウントの停止および/または禁止につながることがあります。

**当社はドメイン名登録業者ではありません**ので、ドメイン名に関する過去のDNSレコード情報をお求めの場合は、該当するドメイン名登録業者にお問い合わせください。[Security Trails]()などのサービスは過去のレコード検索を提供する場合がありますが、より具体的かつ正確な情報は登録業者から得られます。ドメイン名の登録業者やDNSネームサーバーの所有者を特定するには、`dig`や`whois`コマンドが有用です（例：`whois example.com` または `dig example.com ns`）。当社サービスのアカウントが有料プランか無料プランかはDNSレコード検索で判別できます（例：`dig example.com mx` および `dig example.com txt`）。MXレコードが `mx1.forwardemail.net` や `mx2.forwardemail.net` のような値を返さない場合、そのドメインは当社サービスを利用していません。TXTレコードがプレーンテキストのメールアドレス（例：`forward-email=user@example.com`）を返す場合、それはドメインのメール転送先アドレスを示します。代わりに `forward-email-site-verification=XXXXXXXXXX` のような値を返す場合は、有料プランであり転送設定がID `XXXXXXXXXX` の下で当社データベースに保存されていることを示します。当社サービスのDNSレベルでの動作については、[FAQ](/faq)をご参照ください。

### 利用可能な情報 {#what-information-is-available}

収集情報についてはプライバシーポリシーの[収集情報](/privacy#information-collected)をご参照ください。アカウントはデータ保持およびプライバシー法に準拠して当社システムから情報を削除することが許可されています。情報削除についてはプライバシーポリシーの[情報削除](/privacy#information-removal)をご参照ください。つまり、アカウント削除により依頼時に情報が利用できない場合があります。

### 利用できない情報 {#what-information-is-not-available}

収集していない情報についてはプライバシーポリシーの[収集していない情報](/privacy#information-not-collected)をご参照ください。

### 米国に拠点を置く法執行機関 {#law-enforcement-based-in-the-united-states}

[緊急時を除き](#law-enforcement-emergency-requests)、有効な召喚状、ECPA米国裁判所命令、および/または捜索令状の受領時のみアカウント情報を共有します。

また、法律や裁判所命令で禁止されていない限り、法執行機関からの要請について[アカウントに通知](#law-enforcement-requests-may-trigger-account-notices)する場合があります。

有効な召喚状、ECPA裁判所命令、および/または捜索令状を受け取った場合、可能な限り関連情報を提供します。

### 米国外に拠点を置く法執行機関 {#law-enforcement-based-outside-of-the-united-states}

米国外の法執行機関からの要請は、以下のいずれかを通じて送達されることを要求します：

* 米国の裁判所
* [米国相互法的支援条約](https://www.justice.gov/criminal-oia/file/1498806/download)（[Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)）("MLAT")の手続きに基づく執行機関
* 米国司法長官が[18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523)の要件を満たすと認定し議会に証明した行政協定の対象となる外国政府の命令

### 法執行機関の緊急要請 {#law-enforcement-emergency-requests}

米国の法律が許す範囲で（例：[18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) および [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94）に従い）、善意かつ独立した要請者の検証がある場合、死亡または重篤な身体的傷害を防ぐために遅延なく開示が必要と判断した場合は、召喚状、ECPA裁判所命令、および/または捜索令状なしで法執行機関にアカウント情報を開示・共有することがあります。
緊急データリクエスト（「EDR」）は、メールで送信され、迅速かつ迅速な処理を提供するためにすべての関連情報を含む必要があります。

メールによる高度ななりすまし、フィッシング、なりすまし攻撃については認識しています（例：[The Guardianの記事](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)を参照）。

EDRの処理ポリシーは以下の通りです：

1. 検証のためにメールヘッダーメタデータ（例：DKIM/SPF/DMARC）を独自に調査します（またはその欠如を確認します）。

2. 要請の真正性を確認するために、善意で最善の努力を払い（必要に応じて繰り返し試み）、電話で要請者に独自に連絡します。例えば、要請が発せられた管轄の `.gov` ウェブサイトを調査し、公開されている公式電話番号からそのオフィスに電話して要請を確認する場合があります。

### 法執行機関からの要請はアカウント通知を引き起こす場合があります {#law-enforcement-requests-may-trigger-account-notices}

法令または裁判所命令により禁止されていない限り（例：[18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)）、アカウントに通知し、該当する法執行機関からの要請のコピーを提供する場合があります。その場合、非開示命令が終了した際にアカウントに通知することがあります。

法執行機関からの情報要請が有効な場合、[必要かつ要請されたアカウント情報を保存し](#law-enforcement-requests-to-preserve-information)、登録済みかつ検証済みのメールアドレスを通じてアカウント所有者に合理的な努力で連絡を試みます（例：7暦日以内）。期限内に異議申し立てがあった場合（例：7暦日以内）、アカウント情報の共有を控え、必要に応じて法的手続きを継続します。

### 法執行機関からの情報保存要請 {#law-enforcement-requests-to-preserve-information}

[18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703)に従い、法執行機関からの有効な情報保存要請を尊重します。データの保存は、特に要請された範囲かつ現在利用可能なものに限定されることにご注意ください。

### 法執行機関による手続きの送達 {#law-enforcement-serving-process}

すべての有効な法執行機関からの要請には、対応および電子的に情報を提供できる有効かつ機能的なメールアドレスを必ず提供していただく必要があります。

すべての要請は、上記の[不正行為報告の提出方法](#how-to-submit-an-abuse-report)に記載されたメールアドレスに送信してください。

すべての法執行機関からの要請は、機関または部署のレターヘッド（例：PDFスキャン添付ファイル）で、公式かつ関連するメールアドレスから送信され、署名されている必要があります。

[緊急要請](#law-enforcement-emergency-requests)に関する場合は、メールの件名に「Emergency law enforcement request」と記載してください。

ご依頼の確認および対応には少なくとも2週間かかる場合があることをご了承ください。
