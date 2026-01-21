# メール転送: セクション889に準拠したメール転送ソリューション {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />

## 目次 {#table-of-contents}

* [序文](#foreword)
* [セクション889コンプライアンスの理解](#understanding-section-889-compliance)
* [Forward EmailがSection 889に準拠する方法](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflareのコミットメント](#cloudflares-commitment)
  * [DataPacketのインフラストラクチャ](#datapackets-infrastructure)
* [セクション889を超えて：より広範な政府のコンプライアンス](#beyond-section-889-broader-government-compliance)
* [今後の展望：コンプライアンスの視野の拡大](#our-path-forward-expanding-compliance-horizons)
* [これがあなたにとってなぜ重要なのか](#why-this-matters-for-you)
* [安全でコンプライアンスに準拠したメール転送はここから始まります](#secure-compliant-email-forwarding-starts-here)
* [参考文献](#references)

## 序文 {#foreword}

Forward Emailでは、シンプルで安全、そしてプライバシーが確保されたメール転送をすべてのお客様に提供することを信条としています。多くの組織、特に米国政府機関と連携する組織にとって、コンプライアンスは単なる流行語ではなく、必須事項であることを私たちは理解しています。**メールに関する連邦規制**への準拠は極めて重要です。だからこそ、当社の**安全なメール転送**サービスは、[国防権限法（NDAA）](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act)の[第889条](https://www.acquisition.gov/Section-889-Policies)を含む、厳格な連邦要件を満たすように構築されていることを誇りに思います。

**政府機関向けメールコンプライアンス**への当社の取り組みは、**米国海軍兵学校**が**Forward Email**にご相談いただいた際に実践に移されました。**安全なメール転送**サービスと、**Section 889**コンプライアンス**を含む連邦規制への準拠を証明する文書の提出を求められました。この経験は貴重なケーススタディとなり、政府出資組織をサポートし、厳格な要件を満たす当社の準備と能力を実証しています。この取り組みは、信頼性が高く**プライバシー重視のメール**ソリューションを求めるすべてのユーザーの皆様に広く浸透しています。

## セクション889コンプライアンスの理解 {#understanding-section-889-compliance}

セクション889とは何でしょうか？簡単に言うと、これは米国連邦法であり、政府機関が特定の企業（Huawei、ZTE、Hikvision、Dahua、Hyteraなど）の特定の通信機器やビデオ監視機器、またはサービスを利用する組織と契約したり、利用したりすることを禁止しています。この規則は、**Huawei禁止**や**ZTE禁止**と関連付けられることが多く、国家安全保障の保護に役立ちます。

> \[!NOTE]
> セクション889は、Huawei、ZTE、Hytera、Hikvision、Dahuaの機器とサービス、およびそれらの子会社と関連会社を特に対象としています。

**Forward Email** のような **政府契約のメール転送サービス** の場合、これは、基盤となるインフラストラクチャ プロバイダーがこの禁止された機器を使用しないようにし、**Section 889 に準拠** することを意味します。

## Forward EmailがSection 889コンプライアンスを達成する方法 {#how-forward-email-achieves-section-889-compliance}

では、**Forward Email はどのようにして Section 889 に準拠しているのでしょうか?** 当社は、インフラストラクチャ パートナーを慎重に選定することでこれを実現しています。**Forward Email** は、**Section 889 準拠のインフラストラクチャ** として、2 つの主要プロバイダーのみに依存しています。

1. **[クラウドフレア](https://www.cloudflare.com/):** ネットワークサービスと**Cloudflareメールセキュリティ**の主要パートナーです。
2. **[データパケット](https://datapacket.com/):** サーバーインフラストラクチャの主要プロバイダーです（フェイルオーバーには[デジタルオーシャン](https://www.digitalocean.com/)または[ヴルトル](https://www.vultr.com/)を使用しており、まもなくDataPacketのみを使用するよう移行する予定です。もちろん、これら2つのフェイルオーバープロバイダーからSection 889への準拠を書面で確認済みです）。

> \[!IMPORTANT]
> セクション889で禁止されている機器を使用しないCloudflareとDataPacketのみに依存していることが、当社のコンプライアンスの基盤となっています。

[クラウドフレア](https://www.cloudflare.com/) と [データパケット](https://datapacket.com/) はどちらも高いセキュリティ基準に準拠しており、セクション 889 で禁止されている機器は使用していません。**セクション 889 コンプライアンスのために Cloudflare と DataPacket を使用する** ことは、当社のサービスの基本です。

### Cloudflareのコミットメント {#cloudflares-commitment}

[クラウドフレア](https://www.cloudflare.com/)は、**[サードパーティの行動規範](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**において**Section 889の遵守**について明確に言及しています。次のように述べています。

> 「国防権限法（NDAA）第889条に基づき、Cloudflareは、Huawei Technologies Company、ZTE Corporation、Hytera Communications Corporation、Hangzhou Hikvision Digital Technology Company、Dahua Technology Company（またはこれらの企業の子会社または関連会社）が製造または提供する通信機器、ビデオ監視製品、またはサービスを、自社のサプライチェーンにおいて使用したり、許可したりしません。」

*(出典: Cloudflareサードパーティ行動規範、2025年4月29日取得)*

この明確な声明は、**Forward Email** が活用する [Cloudflareの](https://www.cloudflare.com/) インフラストラクチャがセクション 889 の要件を満たしていることを確認しています。

### DataPacketのインフラストラクチャ {#datapackets-infrastructure}

当社のサーバープロバイダーである[データパケット](https://datapacket.com/)は、**Arista Networks**と**Cisco**のネットワーク機器のみを使用しています。AristaもCiscoも、Section 889で禁止されている企業ではありません。両社とも、安全な企業や政府機関の環境で広く利用されている実績のあるベンダーであり、厳格なセキュリティおよびコンプライアンス基準を遵守していることで知られています。

[クラウドフレア](https://www.cloudflare.com/) と [データパケット](https://datapacket.com/) のみを使用することで、**Forward Email** はサービス配信チェーン全体に Section 889 で禁止されている機器が含まれないようにし、**連邦政府機関やその他のセキュリティを重視するユーザーに安全な電子メール転送を提供します**。

## セクション889を超えて：より広範な政府のコンプライアンス {#beyond-section-889-broader-government-compliance}

**政府機関のメールセキュリティ**とコンプライアンスに対する当社の取り組みは、セクション 889 を超えています。**Forward Email** 自体は、大規模な SaaS プラットフォームと同じように [管理された非機密情報（CUI）](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) などの機密性の高い政府データを直接処理または保存することはありませんが、当社の**オープンソースのメール転送** アーキテクチャと、安全でコンプライアンスに準拠したプロバイダーへの依存は、他の主要な規制の原則と一致しています。

* **[FAR（連邦調達規則）](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** 準拠インフラストラクチャを使用し、分かりやすい商用サービスを提供することで、政府請負業者に適した**FAR準拠のメール**転送原則を提供します。
* **プライバシー法と[FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** 当社は**プライバシー重視**を設計に取り入れ、**プライバシー法のメール**原則を提供しています。お客様のメールは保存しません。メールは直接転送されるため、データ処理は最小限に抑えられます。当社のインフラストラクチャプロバイダー（[クラウドフレア](https://www.cloudflare.com/)、[データパケット](https://datapacket.com/)）は、**FISMA準拠のメール**原則に準拠した高度なセキュリティ基準に従ってシステムを管理しています。
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** **HIPAA準拠のメール転送**を必要とする組織にとって、**Forward Email**は準拠ソリューションの一部となります。当社はメールを保存しないため、主なコンプライアンス責任はエンドポイントのメールシステムにあります。ただし、当社の安全なトランスポート層は、正しく使用すれば HIPAA 要件をサポートします。

> \[!WARNING]
> [暗号化されたIMAP/POP3ストレージ層](/blog/docs/best-quantum-safe-encrypted-email-service) を使用しない限り、メールの内容は保存されないため、**転送メール** 自体ではなく、最終的なメールプロバイダーで [ビジネスアソシエイト契約（BAA）](https://en.wikipedia.org/wiki/Business_associate_agreement) が必要になる場合があります。

## 今後の展望：コンプライアンスの視野の拡大 {#our-path-forward-expanding-compliance-horizons}

当社のSection 889コンプライアンスは、特に連邦政府の請負業者にとって重要な基盤となりますが、組織や政府機関によって規制ニーズは多様かつ変化していることを理解しています。**Forward Email**では透明性を最優先に考えており、コンプライアンスのより広範な状況と今後の方向性について、当社の見解を共有したいと考えています。

当社は、次のような枠組みや規制の重要性を認識しています。

* **[受賞管理システム（SAM）](https://sam.gov/):** 連邦政府との直接契約に必須です。
* **[FAR（連邦調達規則）](https://www.acquisition.gov/browse/index/far):** 商用サービス向けの[FAR 52.212-4](https://www.acquisition.gov/far/52.212-4)などの標準条項を含みます。
* **[DFARS（国防連邦調達規則補足）](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** 特に国防総省のクラウドサービス向けの[DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.)です。
* **[CMMC（サイバーセキュリティ成熟度モデル認証）](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** [連邦契約情報（FCI）](https://en.wikipedia.org/wiki/Federal_Contract_Information)またはCUIを扱う国防総省の請負業者に必須です。
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** CUIの保護に重点を置いたCMMCレベル2の基礎です。([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - 米国国立標準技術研究所)
* **[FedRAMP（連邦リスクおよび承認管理プログラム）](https://en.wikipedia.org/wiki/FedRAMP):** 連邦政府機関が使用するクラウドサービスの標準です。
* **__PROTECTED_LINK_77__0:** 連邦政府の情報セキュリティのための包括的なフレームワークです。
* **__PROTECTED_LINK_77__1:** 保護対象医療情報 (PHI) の取り扱いのため。
* **__PROTECTED_LINK_77__2:** 学生の教育記録の保護のため。
* **__PROTECTED_LINK_77__3:** 13歳未満のお子様を対象とするサービスのため。

**現在の立場と将来の目標:**

**Forward Email** のコア設計は、**プライバシー重視**、**オープンソース**、そしてデータ処理の最小化（特に基本的な**メール転送**サービス）であり、これらの規制の背後にある*原則*と整合しています。既存のセキュリティ対策（暗号化、最新のメール標準への対応）とSection 889への準拠は、強力な出発点となります。

しかし、**FedRAMP**や**CMMC**といったフレームワークの正式な認証や認可を取得するには、相当な労力と時間がかかります。厳格な文書化、特定の技術的および手続き的管理策（数百に及ぶ場合も少なくありません）、独立した評価（FedRAMPの[3PAO](https://www.fedramp.gov/glossary/#3pao)（第三者評価機関）など）、そして継続的なモニタリングが求められます。

> \[!IMPORTANT]
> コンプライアンスはテクノロジーだけではありません。文書化されたプロセス、ポリシー、そして継続的な監視も重要です。FedRAMPやCMMCなどの認証を取得するには、多大な投資と時間が必要です。

**当社のコミットメント:**

**Forward Email** の成長とお客様のニーズの進化に伴い、当社は関連するコンプライアンス認証の取得を模索し、推進していくことに尽力しています。これには以下の計画が含まれます。

1. **SAM登録:** 米国連邦政府機関との直接的な連携を促進する。
2. **プロセスの正式化:** CMMCの基盤となるNIST SP 800-171などの標準に準拠するよう、社内文書と手順を強化する。
3. **FedRAMPパスウェイの評価:** FedRAMP認証取得の要件と実現可能性を評価する。最初は低または中程度のベースラインから開始し、必要に応じて[SaaSへの](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/)モデルを活用する。
4. **特定のニーズへの対応:** 医療機関や教育機関との連携を強化する中で、HIPAA（BAAや保存データの特定の構成などを通じて対応）やFERPA（適切な契約条件と管理を通じて対応）などの要件に対応する。

この道のりには、綿密な計画と投資が必要です。すべての認証取得についてすぐに期限が設定されているわけではありませんが、政府機関や規制対象業界のニーズを満たすためにコンプライアンス体制を強化することは、私たちのロードマップの重要な部分です。

> \[!NOTE]
> **オープンソース** という性質により、このプロセス全体を通して独自の透明性が確保され、コミュニティとお客様に私たちの取り組みを直接ご覧いただけると考えています。

当社はコンプライアンスの取り組みにおいて重要なマイルストーンに到達するたびに、コミュニティに最新情報をお知らせしていきます。

## これがあなたにとって重要な理由 {#why-this-matters-for-you}

**Forward Email** のような **Section 889 準拠のメール転送** サービスを選択すると、次のようになります。

* **安心:** 特に政府機関、請負業者、セキュリティを重視する組織に最適です。
* **リスクの軽減:** **電子メールに関する連邦規制** との潜在的な抵触を回避します。
* **信頼:** セキュリティとサプライチェーンの整合性へのコミットメントを示します。

**Forward Email** は、カスタム ドメインの **メール転送** のニーズを管理するためのシンプルで信頼性が高く、*準拠した*方法を提供します。

## 安全でコンプライアンスに準拠したメール転送はここから始まります {#secure-compliant-email-forwarding-starts-here}

**Forward Email** は、**安全でプライバシーが確保されたオープンソースのメール転送** サービスの提供に特化しています。[クラウドフレア](https://www.cloudflare.com/) および [データパケット](https://datapacket.com/) との提携により達成した**Section 889** への準拠（**米国海軍兵学校向けメール転送** への準拠を反映）は、このコミットメントの証です。政府機関、請負業者、あるいは**政府機関のメールセキュリティ** を重視する企業など、あらゆるお客様にとって、**Forward Email** は最適なソリューションです。

**安全でコンプライアンスに準拠したメール転送**の準備はできていますか? [今すぐ無料でサインアップしましょう!](https://forwardemail.net)

## 参照 {#references}

* **第889条 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflareサードパーティ行動規範:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **DataPacket:** <https://datapacket.com/>
* **契約管理システム (SAM):** <https://sam.gov/>
* **連邦調達規則 (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **国防省連邦調達規則補足 (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **サイバーセキュリティ成熟度モデル認証 (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://www.cloudflare.com/>0
* **連邦リスク・認可管理プログラム (FedRAMP):** <https://www.cloudflare.com/>1
* **連邦情報セキュリティ近代化法 (FISMA):** <https://www.cloudflare.com/>2
* **医療保険の携行性と説明責任に関する法律 (HIPAA):** <https://www.cloudflare.com/>3
* **家族教育の権利とプライバシー法 (FERPA):** <https://www.cloudflare.com/>4
* **児童オンラインプライバシー保護法 (COPPA):** <https://www.cloudflare.com/>5