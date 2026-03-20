# データ処理契約 {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />


## 目次 {#table-of-contents}

* [主要用語](#key-terms)
* [契約の変更](#changes-to-the-agreement)
* [1. 処理者および下請処理者の関係](#1-processor-and-subprocessor-relationships)
  * [1. プロバイダーとしての処理者](#1-provider-as-processor)
  * [2. プロバイダーとしての下請処理者](#2-provider-as-subprocessor)
* [2. 処理](#2-processing)
  * [1. 処理の詳細](#1-processing-details)
  * [2. 処理指示](#2-processing-instructions)
  * [3. プロバイダーによる処理](#3-processing-by-provider)
  * [4. 顧客による処理](#4-customer-processing)
  * [5. 処理への同意](#5-consent-to-processing)
  * [6. 下請処理者](#6-subprocessors)
* [3. 制限された転送](#3-restricted-transfers)
  * [1. 承認](#1-authorization)
  * [2. EEA外への転送](#2-ex-eea-transfers)
  * [3. UK外への転送](#3-ex-uk-transfers)
  * [4. その他の国際転送](#4-other-international-transfers)
* [4. セキュリティインシデント対応](#4-security-incident-response)
* [5. 監査と報告](#5-audit--reports)
  * [1. 監査権](#1-audit-rights)
  * [2. セキュリティ報告](#2-security-reports)
  * [3. セキュリティデューデリジェンス](#3-security-due-diligence)
* [6. 調整と協力](#6-coordination--cooperation)
  * [1. 問い合わせへの対応](#1-response-to-inquiries)
  * [2. DPIAおよびDTIA](#2-dpias-and-dtias)
* [7. 顧客の個人データの削除](#7-deletion-of-customer-personal-data)
  * [1. 顧客による削除](#1-deletion-by-customer)
  * [2. DPA終了時の削除](#2-deletion-at-dpa-expiration)
* [8. 責任の制限](#8-limitation-of-liability)
  * [1. 責任上限および損害賠償の放棄](#1-liability-caps-and-damages-waiver)
  * [2. 関連当事者の請求](#2-related-party-claims)
  * [3. 例外](#3-exceptions)
* [9. 文書間の矛盾](#9-conflicts-between-documents)
* [10. 契約期間](#10-term-of-agreement)
* [11. 準拠法および管轄裁判所](#11-governing-law-and-chosen-courts)
* [12. サービスプロバイダー関係](#12-service-provider-relationship)
* [13. 定義](#13-definitions)
* [クレジット](#credits)


## 主要用語 {#key-terms}

| 用語                                       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>契約</strong>                       | 本DPAは[利用規約](/terms)を補足するものです                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| <strong>承認済み下請処理者</strong>         | [Cloudflare](https://cloudflare.com)（米国；DNS、ネットワークおよびセキュリティプロバイダー）、[DataPacket](https://www.datapacket.com/)（米国/英国；ホスティングプロバイダー）、[Digital Ocean](https://digitalocean.com)（米国；ホスティングプロバイダー）、[GitHub](https://github.com)（米国；ソースコードホスティング、CI/CD、プロジェクト管理）、[Vultr](https://www.vultr.com)（米国；ホスティングプロバイダー）、[Stripe](https://stripe.com)（米国；決済処理業者）、[PayPal](https://paypal.com)（米国；決済処理業者） |
| <strong>プロバイダーセキュリティ連絡先</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>セキュリティポリシー</strong>       | [GitHub上の当社セキュリティポリシー](https://github.com/forwardemail/forwardemail.net/security/policy)をご覧ください                                                                                                                                                                                                                                                                                                                                                               |
| <strong>準拠州</strong>                       | アメリカ合衆国デラウェア州                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
## 契約の変更 {#changes-to-the-agreement}

本書は[Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)の派生文書であり、以下の変更が加えられています：

1. [準拠法および管轄裁判所](#11-governing-law-and-chosen-courts)が以下のセクションとして含まれており、上記に`準拠州`が特定されています。
2. [サービスプロバイダーの関係](#12-service-provider-relationship)が以下のセクションとして含まれています。


## 1. プロセッサーおよびサブプロセッサーの関係 {#1-processor-and-subprocessor-relationships}

### 1. プロバイダーがプロセッサーの場合 {#1-provider-as-processor}

<strong>顧客</strong>が顧客個人データの管理者である場合、<strong>プロバイダー</strong>は<strong>顧客</strong>に代わって個人データを処理するプロセッサーとみなされます。

### 2. プロバイダーがサブプロセッサーの場合 {#2-provider-as-subprocessor}

<strong>顧客</strong>が顧客個人データのプロセッサーである場合、<strong>プロバイダー</strong>は顧客個人データのサブプロセッサーとみなされます。


## 2. 処理 {#2-processing}

### 1. 処理の詳細 {#1-processing-details}

表紙の付属書I(B)には、本処理の対象、性質、目的および期間、ならびに収集される<strong>個人データのカテゴリー</strong>および<strong>データ主体のカテゴリー</strong>が記載されています。

### 2. 処理指示 {#2-processing-instructions}

<strong>顧客</strong>は、<strong>プロバイダー</strong>に対し、顧客個人データを以下の目的で処理するよう指示します：(a) サービスの提供および維持；(b) <strong>顧客</strong>によるサービスの利用を通じてさらに指定される場合；(c) <strong>契約</strong>に記載されている場合；および(d) 本DPAに基づく顧客個人データの処理に関して、<strong>顧客</strong>が書面で指示し、<strong>プロバイダー</strong>が承認したその他の指示に従う場合。<strong>プロバイダー</strong>は、適用法により禁止されていない限り、これらの指示に従います。<strong>プロバイダー</strong>は、処理指示に従えない場合、直ちに<strong>顧客</strong>に通知します。<strong>顧客</strong>は、適用法に準拠した指示のみを与えていますし、今後も与えます。

### 3. プロバイダーによる処理 {#3-processing-by-provider}

<strong>プロバイダー</strong>は、本DPAおよび表紙の詳細に従ってのみ顧客個人データを処理します。<strong>プロバイダー</strong>がサービスを更新し、既存または新規の製品、機能、または機能性を追加する場合、<strong>プロバイダー</strong>は<strong>データ主体のカテゴリー</strong>、<strong>個人データのカテゴリー</strong>、<strong>特別カテゴリーのデータ</strong>、<strong>特別カテゴリーのデータに関する制限または保護措置</strong>、<strong>転送頻度</strong>、<strong>処理の性質および目的</strong>、および<strong>処理期間</strong>を必要に応じて変更し、更新および変更について<strong>顧客</strong>に通知します。

### 4. 顧客による処理 {#4-customer-processing}

<strong>顧客</strong>がプロセッサーであり、<strong>プロバイダー</strong>がサブプロセッサーである場合、<strong>顧客</strong>は顧客個人データの処理に適用されるすべての適用法を遵守します。<strong>顧客</strong>の管理者との契約も同様に、<strong>顧客</strong>がプロセッサーとして適用法を遵守することを要求します。加えて、<strong>顧客</strong>は管理者との契約におけるサブプロセッサーに関する要件を遵守します。

### 5. 処理への同意 {#5-consent-to-processing}

<strong>顧客</strong>は、顧客個人データを<strong>プロバイダー</strong>および/またはサービスに提供するにあたり、すべての適用されるデータ保護法を遵守しており、今後も遵守します。これには、すべての開示、同意の取得、適切な選択肢の提供、および適用されるデータ保護法に基づく関連する保護措置の実施が含まれます。
### 6. サブプロセッサー {#6-subprocessors}

a. <strong>プロバイダー</strong>は、<strong>カスタマー</strong>がサブプロセッサーを承認していない限り、いかなるカスタマーパーソナルデータもサブプロセッサーに提供、転送、または引き渡しを行いません。現在の<strong>承認済みサブプロセッサー</strong>のリストには、サブプロセッサーの身元、所在国、および予想される処理タスクが含まれています。<strong>プロバイダー</strong>は、サブプロセッサーの追加または置換による<strong>承認済みサブプロセッサー</strong>の変更を意図する場合、少なくとも10営業日前に書面で<strong>カスタマー</strong>に通知し、<strong>プロバイダー</strong>が新しいサブプロセッサーの使用を開始する前に<strong>カスタマー</strong>が変更に異議を唱えるのに十分な時間を確保します。<strong>プロバイダー</strong>は、<strong>カスタマー</strong>が<strong>承認済みサブプロセッサー</strong>の変更に異議を唱える権利を行使できるように必要な情報を提供します。<strong>カスタマー</strong>は、<strong>承認済みサブプロセッサー</strong>の変更通知後30日以内に異議を申し立てなければ、変更を承諾したものとみなされます。もし<strong>カスタマー</strong>が通知後30日以内に異議を申し立てた場合、<strong>カスタマー</strong>と<strong>プロバイダー</strong>は誠実に協力して<strong>カスタマー</strong>の異議または懸念を解決します。

b. サブプロセッサーを起用する際、<strong>プロバイダー</strong>は、サブプロセッサーがカスタマーパーソナルデータにアクセスし使用するのは、(i) 委託された義務を遂行するために必要な範囲に限り、(ii) <strong>契約</strong>の条件に従うことを保証する書面契約をサブプロセッサーと締結します。

c. GDPRがカスタマーパーソナルデータの処理に適用される場合、(i) 本DPAに記載されたデータ保護義務（該当する場合はGDPR第28条第3項に言及）はサブプロセッサーにも課され、(ii) <strong>プロバイダー</strong>のサブプロセッサーとの契約にはこれらの義務が組み込まれ、<strong>プロバイダー</strong>とサブプロセッサーがカスタマーパーソナルデータの処理に関する問い合わせや要求に対応する方法の詳細が含まれます。さらに、<strong>プロバイダー</strong>は<strong>カスタマー</strong>の要請に応じて、サブプロセッサーとの契約（およびその修正を含む）のコピーを共有します。営業秘密やその他の機密情報（個人データを含む）を保護するために必要な範囲で、<strong>プロバイダー</strong>はサブプロセッサーとの契約文書の一部を編集してから共有することがあります。

d. <strong>プロバイダー</strong>は、サブプロセッサーに委託したすべての義務について完全に責任を負い、サブプロセッサーによるカスタマーパーソナルデータの処理に関する行為および不作為についても責任を負います。<strong>プロバイダー</strong>は、サブプロセッサーがカスタマーパーソナルデータに関する重要な義務を履行できなかった場合、<strong>カスタマー</strong>に通知します。


## 3. 制限付き転送 {#3-restricted-transfers}

### 1. 承認 {#1-authorization}

<strong>カスタマー</strong>は、<strong>プロバイダー</strong>がサービス提供に必要な範囲で、カスタマーパーソナルデータをEEA、英国、またはその他の関連地理的領域の外に転送することに同意します。<strong>プロバイダー</strong>が欧州委員会またはその他の関連監督機関が十分性決定を出していない地域にカスタマーパーソナルデータを転送する場合、<strong>プロバイダー</strong>は適用されるデータ保護法に準拠した適切な保護措置を実施します。

### 2. EEA外転送 {#2-ex-eea-transfers}

<strong>カスタマー</strong>と<strong>プロバイダー</strong>は、GDPRがカスタマーパーソナルデータの転送を保護し、その転送がEEA内の<strong>カスタマー</strong>からEEA外の<strong>プロバイダー</strong>へのものであり、欧州委員会による十分性決定に基づかない場合、本DPAの締結により、<strong>カスタマー</strong>と<strong>プロバイダー</strong>はEEA SCCsおよびその付属書に署名したものとみなされ、これらは参照により組み込まれます。いかなる転送も、以下のように完成されたEEA SCCsに基づいて行われます：
a. EEA SCCのモジュール2（コントローラーからプロセッサーへ）は、<strong>顧客</strong>がコントローラーであり、<strong>プロバイダー</strong>がプロセッサーとして<strong>顧客</strong>の個人データを処理する場合に適用されます。

b. EEA SCCのモジュール3（プロセッサーからサブプロセッサーへ）は、<strong>顧客</strong>がプロセッサーであり、<strong>プロバイダー</strong>がサブプロセッサーとして<strong>顧客</strong>の個人データを処理する場合に適用されます。

c. 各モジュールについて、以下が適用されます（該当する場合）：

1. 条項7の任意のドッキング条項は適用されません；

2. 条項9のオプション2（一般的な書面による承認）が適用され、サブプロセッサーの変更に関する事前通知の最小期間は10営業日です；

3. 条項11の任意の言語は適用されません；

4. 条項13のすべての角括弧は削除されます；

5. 条項17（オプション1）では、EEA SCCは<strong>管轄加盟国</strong>の法律に準拠します；

6. 条項18(b)では、紛争は<strong>管轄加盟国</strong>の裁判所で解決されます；および

7. 本DPAの表紙には、EEA SCCの付属書I、付属書II、および付属書IIIに必要な情報が含まれています。

### 3. Ex-UK Transfers {#3-ex-uk-transfers}

<strong>顧客</strong>と<strong>プロバイダー</strong>は、UK GDPRが顧客の個人データの移転を保護する場合、その移転が英国内の<strong>顧客</strong>から英国外の<strong>プロバイダー</strong>へのものであり、英国国務大臣による適合性決定に基づかない場合、本DPAの締結により、<strong>顧客</strong>と<strong>プロバイダー</strong>はUK付属書およびその付属書に署名したものとみなされ、これらは参照により組み込まれます。そのような移転は、以下のように完了されたUK付属書に基づいて行われます：

a. 本DPAのセクション3.2には、UK付属書の表2に必要な情報が含まれています。

b. UK付属書の表4は以下のように修正されます：いずれの当事者もUK付属書のセクション19に定める通りにUK付属書を終了できません；ICOがUK付属書のセクション18に基づき改訂版承認付属書を発行した場合、当事者は誠実に協力して本DPAを適宜改訂します。

c. 表紙には、UK付属書の付属書1A、付属書1B、付属書II、および付属書IIIに必要な情報が含まれています。

### 4. Other International Transfers {#4-other-international-transfers}

スイス法（およびEEA加盟国または英国の法律ではない）が国際的な移転の性質に適用される個人データの移転については、EEA SCCの条項4におけるGDPRへの言及は、法的に必要な範囲で、スイス連邦データ保護法またはその後継法に置き換えられ、監督機関の概念にはスイス連邦データ保護・情報委員会が含まれます。

## 4. Security Incident Response {#4-security-incident-response}

1. セキュリティインシデントを認識した場合、<strong>プロバイダー</strong>は：(a) 可能な限り遅滞なく、かつセキュリティインシデントを認識してから72時間以内に<strong>顧客</strong>に通知する；(b) セキュリティインシデントに関する情報を、判明次第または<strong>顧客</strong>から合理的に要求された場合に適時提供する；および(c) セキュリティインシデントの封じ込めと調査のために合理的な措置を速やかに講じる。<strong>プロバイダー</strong>による本DPAに基づくセキュリティインシデントの通知または対応は、<strong>プロバイダー</strong>がセキュリティインシデントに関して何らかの過失または責任を認めたものと解釈されません。

## 5. Audit & Reports {#5-audit--reports}

### 1. Audit Rights {#1-audit-rights}

<strong>プロバイダー</strong>は、本DPAの遵守を示すために合理的に必要なすべての情報を<strong>顧客</strong>に提供し、<strong>顧客</strong>による検査を含む監査に協力し、本DPAの遵守状況を評価するための監査を許可します。ただし、<strong>顧客</strong>の情報へのアクセスが、<strong>プロバイダー</strong>の知的財産権、機密保持義務、または適用法令に基づくその他の義務に悪影響を及ぼす場合、<strong>プロバイダー</strong>はデータまたは情報へのアクセスを制限することがあります。<strong>顧客</strong>は、本DPAおよび適用されるデータ保護法により付与された監査権を行使する際には、以下の報告およびデューデリジェンス要件に従うよう<strong>プロバイダー</strong>に指示することによってのみ行使することを認め、同意します。<strong>プロバイダー</strong>は、本DPA終了後3年間、本DPAの遵守記録を保持します。
### 2. セキュリティレポート {#2-security-reports}

<strong>顧客</strong>は、<strong>提供者</strong>が独立した第三者監査人によって<strong>セキュリティポリシー</strong>で定義された基準に基づき定期的に監査されていることを認識します。書面による要請があった場合、<strong>提供者</strong>は、機密扱いで、当時のレポートの要約コピーを<strong>顧客</strong>に提供し、<strong>顧客</strong>が<strong>提供者</strong>の<strong>セキュリティポリシー</strong>で定義された基準への準拠を確認できるようにします。

### 3. セキュリティデューデリジェンス {#3-security-due-diligence}

レポートに加えて、<strong>提供者</strong>は、本DPAへの準拠を確認するために、情報セキュリティ、デューデリジェンス、監査に関するアンケートへの回答や情報セキュリティプログラムに関する追加情報の提供など、<strong>顧客</strong>からの合理的な情報要求に対応します。これらの要求はすべて書面で行い、<strong>提供者セキュリティ連絡先</strong>に提出され、年に一度のみ行うことができます。

## 6. 調整と協力 {#6-coordination--cooperation}

### 1. 問い合わせへの対応 {#1-response-to-inquiries}

<strong>提供者</strong>が顧客個人データの処理に関して第三者から問い合わせや要請を受けた場合、<strong>提供者</strong>はその要請について<strong>顧客</strong>に通知し、<strong>顧客</strong>の事前の同意なしに要請に応じません。これらの問い合わせや要請の例としては、適用法により<strong>顧客</strong>への通知が禁止されていない場合の司法、行政、規制機関からの顧客個人データに関する命令や、データ主体からの要請が含まれます。適用法で許される場合、<strong>提供者</strong>はこれらの要請に関して<strong>顧客</strong>の合理的な指示に従い、状況報告やその他合理的に要求された情報を提供します。適用されるデータ保護法に基づき、データ主体が顧客個人データの削除または提供のオプトアウトを求める有効な要請をした場合、<strong>提供者</strong>は適用法に従って<strong>顧客</strong>がその要請を履行するのを支援します。<strong>提供者</strong>は、本DPAに基づく顧客個人データの処理に関する第三者の要請に対して<strong>顧客</strong>が行う法的対応やその他の手続きに合理的な支援を、<strong>顧客</strong>の費用負担で協力して提供します。

### 2. DPIAおよびDTIA {#2-dpias-and-dtias}

適用されるデータ保護法により要求される場合、<strong>提供者</strong>は処理の性質および顧客個人データを考慮しつつ、義務付けられたデータ保護影響評価（DPIA）やデータ転送影響評価（DTIA）、および関連するデータ保護当局との協議において、<strong>顧客</strong>を合理的に支援します。

## 7. 顧客個人データの削除 {#7-deletion-of-customer-personal-data}

### 1. 顧客による削除 {#1-deletion-by-customer}

<strong>提供者</strong>は、サービスの機能に沿った方法で<strong>顧客</strong>が顧客個人データを削除できるようにします。<strong>提供者</strong>は、適用法により顧客個人データのさらなる保存が要求される場合を除き、合理的に実行可能な限り速やかにこの指示に従います。

### 2. DPA満了時の削除 {#2-deletion-at-dpa-expiration}

a. DPAが満了した後、<strong>提供者</strong>は、適用法により顧客個人データのさらなる保存が要求または許可されていない限り、<strong>顧客</strong>の指示に従って顧客個人データを返却または削除します。返却または破棄が実行困難または禁止されている場合、<strong>提供者</strong>は顧客個人データの追加処理を防止するために合理的な努力を行い、保有、管理、または管理下にある顧客個人データを引き続き保護します。例えば、適用法により<strong>提供者</strong>が顧客個人データのホスティングや処理を継続することが求められる場合があります。
b. <strong>Customer</strong> と <strong>Provider</strong> が本DPAの一部としてEEA SCCまたはUK付録に署名している場合、<strong>Provider</strong> は <strong>Customer</strong> が要求した場合に限り、EEA SCCの条項8.1(d)および8.5に記載された個人データの削除証明書を <strong>Customer</strong> に提供します。


## 8. 責任の制限 {#8-limitation-of-liability}

### 1. 責任上限および損害賠償の放棄 {#1-liability-caps-and-damages-waiver}

**適用されるデータ保護法の最大限の範囲内で、本DPAに起因または関連する各当事者の相手方に対する累積責任の総額は、<strong>契約</strong>に記載された免責、除外、および責任制限の対象となります。**

### 2. 関連当事者の請求 {#2-related-party-claims}

**本DPAに起因または関連する <strong>Provider</strong> またはその関連会社に対する請求は、<strong>契約</strong>の当事者である <strong>Customer</strong> のみが行うことができます。**

### 3. 例外 {#3-exceptions}

1. 本DPAは、適用されるデータ保護法に基づく個人のデータ保護権に関する個人に対する責任を制限しません。さらに、本DPAは、EEA SCCまたはUK付録の違反に関する当事者間の責任を制限しません。


## 9. 文書間の矛盾 {#9-conflicts-between-documents}

1. 本DPAは契約の一部を構成し、補足します。本DPA、<strong>契約</strong>、またはそのいずれかの部分間に矛盾がある場合、矛盾に関しては、以下の順序で前に記載された部分が後に記載された部分に優先します：(1) EEA SCCまたはUK付録、(2) 本DPA、(3) <strong>契約</strong>。


## 10. 契約期間 {#10-term-of-agreement}

本DPAは、<strong>Provider</strong> と <strong>Customer</strong> がDPAのカバーページに合意し、<strong>契約</strong>に署名または電子的に同意した時点で開始し、<strong>契約</strong>が満了または終了するまで継続します。ただし、<strong>Provider</strong> と <strong>Customer</strong> は、<strong>Customer</strong> が <strong>Provider</strong> への顧客個人データの転送を停止し、<strong>Provider</strong> が顧客個人データの処理を停止するまで、本DPAおよび適用されるデータ保護法の義務に従い続けます。


## 11. 準拠法および管轄裁判所 {#11-governing-law-and-chosen-courts}

<strong>契約</strong>の準拠法または類似条項にかかわらず、本DPAに関するすべての解釈および紛争は、法の抵触規定を除き、<strong>準拠州</strong>の法律に準拠します。さらに、<strong>契約</strong>のフォーラム選択、管轄、または類似条項にかかわらず、当事者は本DPAに関する法的訴訟、訴え、または手続きを<strong>準拠州</strong>の裁判所で行うことに同意し、各当事者はその専属管轄権に取り消し不能に服するものとします。


## 12. サービスプロバイダー関係 {#12-service-provider-relationship}

カリフォルニア消費者プライバシー法（Cal. Civ. Code § 1798.100 et seq、「CCPA」）が適用される範囲で、当事者は <strong>Provider</strong> がサービスプロバイダーであり、<strong>契約</strong>で合意されたサービスを提供するために <strong>Customer</strong> から個人データを受領していることを認識し同意します。これは事業目的を構成します。<strong>Provider</strong> は、<strong>契約</strong>に基づき <strong>Customer</strong> から提供された個人データを販売しません。さらに、<strong>Provider</strong> は、<strong>契約</strong>に記載されたサービス提供に必要な場合、または適用されるデータ保護法で許可されている場合を除き、<strong>契約</strong>に基づき <strong>Customer</strong> から提供された個人データを保持、使用、または開示しません。<strong>Provider</strong> は本条項の制限を理解していることを証明します。
## 13. 定義 {#13-definitions}

1. **「適用法」** とは、当事者に適用される、または当事者を規律する関連政府機関の法律、規則、規制、裁判所命令その他の拘束力のある要件を意味します。

2. **「適用されるデータ保護法」** とは、サービスが個人の個人情報、個人データ、個人を特定できる情報、またはその他類似の用語をどのように処理または使用できるかを規律する適用法を意味します。

3. **「管理者」** とは、個人データの処理の目的および範囲を決定する会社に対して、適用されるデータ保護法で定められた意味を持ちます。

4. **「カバーページ」** とは、当事者が署名または電子的に承諾し、本DPA標準条件を組み込み、<strong>プロバイダー</strong>、<strong>顧客</strong>、およびデータ処理の主題と詳細を特定する文書を意味します。

5. **「顧客個人データ」** とは、<strong>顧客</strong>がサービスの一環として<strong>プロバイダー</strong>にアップロードまたは提供し、本DPAによって規律される個人データを意味します。

6. **「DPA」** とは、本DPA標準条件、<strong>プロバイダー</strong>と<strong>顧客</strong>間のカバーページ、およびカバーページに参照または添付されたポリシーおよび文書を意味します。

7. **「EEA SCCs」** とは、欧州委員会の2021年6月4日付実施決定2021/914に添付された標準契約条項であり、欧州議会および欧州理事会の規則（EU）2016/679に基づく第三国への個人データの移転に関するものを意味します。

8. **「欧州経済領域」** または **「EEA」** とは、欧州連合加盟国、ノルウェー、アイスランド、リヒテンシュタインを意味します。

9. **「GDPR」** とは、関連するEEA加盟国の現地法で実施される欧州連合規則2016/679を意味します。

10. **「個人データ」** とは、適用されるデータ保護法で個人情報、個人データ、またはその他類似の用語に対して定められた意味を持ちます。

11. **「処理」** または **「処理する」** とは、適用されるデータ保護法で、個人データに対するあらゆる使用またはコンピュータ操作の実行（自動的な方法を含む）に対して定められた意味を持ちます。

12. **「処理者」** とは、管理者に代わって個人データを処理する会社に対して、適用されるデータ保護法で定められた意味を持ちます。

13. **「報告書」** とは、プロバイダーに代わりセキュリティポリシーで定義された基準に従って他社が作成した監査報告書を意味します。

14. **「制限付き移転」** とは、(a) GDPRが適用される場合、欧州委員会による適合性決定の対象とならないEEAからEEA外の国への個人データの移転、および (b) UK GDPRが適用される場合、英国から英国データ保護法2018年第17A条に基づく適合性規則の対象とならない他国への個人データの移転を意味します。

15. **「セキュリティインシデント」** とは、GDPR第4条で定義された個人データ侵害を意味します。

16. **「サービス」** とは、<strong>契約</strong>に記載された製品および／またはサービスを意味します。

17. **「特別カテゴリー情報」** とは、GDPR第9条で定められた意味を持ちます。

18. **「下請処理者」** とは、管理者の承認および受諾を得て、管理者に代わり処理者を支援して個人データを処理する会社に対して、適用されるデータ保護法で定められた意味を持ちます。

19. **「UK GDPR」** とは、英国において2018年の英国欧州連合（離脱）法第3条により実施される欧州連合規則2016/679を意味します。

20. **「UK付属書」** とは、英国情報コミッショナーが発行した、データ保護法2018年第119A(1)条に基づく制限付き移転を行う当事者向けのEEA SCCsの国際データ移転付属書を意味します。


## クレジット {#credits}

本書類は[Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)の派生物であり、[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)の下でライセンスされています。
