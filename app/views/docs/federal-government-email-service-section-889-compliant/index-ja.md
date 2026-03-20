# Forward Email: あなたのセクション889準拠のメール転送ソリューション {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="連邦政府のメールサービス セクション889準拠" class="rounded-lg" />


## 目次 {#table-of-contents}

* [序文](#foreword)
* [セクション889準拠の理解](#understanding-section-889-compliance)
* [Forward Emailがセクション889準拠を達成する方法](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflareのコミットメント](#cloudflares-commitment)
  * [DataPacketのインフラストラクチャ](#datapackets-infrastructure)
* [セクション889を超えて：より広範な政府準拠](#beyond-section-889-broader-government-compliance)
* [私たちの今後の道：準拠の視野を広げる](#our-path-forward-expanding-compliance-horizons)
* [なぜこれがあなたにとって重要なのか](#why-this-matters-for-you)
* [安全で準拠したメール転送はここから始まる](#secure-compliant-email-forwarding-starts-here)
* [参考文献](#references)


## 序文 {#foreword}

Forward Emailでは、誰もがシンプルで安全かつプライベートなメール転送を利用できることを信じています。特に米国政府と連携する多くの組織にとって、準拠は単なる流行語ではなく必須事項です。**連邦規制に準拠したメール**の確保は極めて重要です。だからこそ、私たちは**安全なメール転送**サービスが、[国家防衛授権法（NDAA）](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act)の[セクション889](https://www.acquisition.gov/Section-889-Policies)を含む厳格な連邦要件を満たすよう構築されていることを誇りに思っています。

私たちの**政府メール準拠**へのコミットメントは、最近**米海軍士官学校**が**Forward Email**に接触し、**安全なメール転送**サービスを求め、連邦規制への準拠、特に**セクション889準拠**の証明書類を必要としたことで実践されました。この経験は、政府資金提供組織を支援し、厳しい要件を満たす準備と能力を示す貴重なケーススタディとなっています。この献身は、信頼できる**プライバシー重視のメール**ソリューションを求めるすべてのユーザーに及びます。


## セクション889準拠の理解 {#understanding-section-889-compliance}

セクション889とは何でしょうか？簡単に言えば、特定の企業（Huawei、ZTE、Hikvision、Dahua、Hyteraなど）からの特定の通信およびビデオ監視機器やサービスを使用する、または契約する政府機関を禁止する米国連邦法です。この規則は、**Huawei禁止**や**ZTE禁止**と関連付けられることが多く、国家安全保障を守るためのものです。

> \[!NOTE]
> セクション889は特にHuawei、ZTE、Hytera、Hikvision、Dahuaおよびそれらの子会社や関連会社の機器とサービスを対象としています。

政府契約向けの**メール転送サービス**である**Forward Email**にとって、これは基盤となるインフラ提供者がこれら禁止された機器を使用していないことを保証し、**セクション889準拠**を実現することを意味します。


## Forward Emailがセクション889準拠を達成する方法 {#how-forward-email-achieves-section-889-compliance}

では、**Forward Emailはどのようにしてセクション889準拠を実現しているのでしょうか？** 私たちはインフラパートナーの慎重な選定によってこれを達成しています。**Forward Email**は**セクション889準拠のインフラ**として、以下の2つの主要プロバイダーのみに依存しています：

1. **[Cloudflare](https://www.cloudflare.com/):** ネットワークサービスおよび**Cloudflareメールセキュリティ**の主要パートナー。
2. **[DataPacket](https://datapacket.com/):** サーバーインフラの主要プロバイダー（フェイルオーバー用に[Digital Ocean](https://www.digitalocean.com/)および[ Vultr](https://www.vultr.com/)を使用し、近くDataPacketのみに移行予定です。もちろん、これらのフェイルオーバープロバイダーからもセクション889準拠の書面による確認を得ています）。

> \[!IMPORTANT]
> CloudflareとDataPacketのみに依存し、どちらもセクション889禁止機器を使用していないことが、私たちの準拠の基盤です。
Both [Cloudflare](https://www.cloudflare.com/) and [DataPacket](https://datapacket.com/) は高いセキュリティ基準を遵守しており、セクション889で禁止されている機器を使用していません。**セクション889準拠のためにCloudflareとDataPacketを使用すること**は、当サービスの基本です。

### Cloudflareのコミットメント {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) は、**セクション889準拠**について明確に言及しており、**[第三者行動規範](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)** にて以下のように述べています：

> 「国家防衛権限法（NDAA）セクション889の下で、CloudflareはHuawei Technologies Company、ZTE Corporation、Hytera Communications Corporation、Hangzhou Hikvision Digital Technology Company、またはDahua Technology Company（これらの企業の子会社や関連会社を含む）が製造または提供する通信機器、ビデオ監視製品、またはサービスを使用せず、またサプライチェーン内で許可しません。」

*(出典：Cloudflare第三者行動規範、2025年4月29日取得)*

この明確な声明により、**Forward Email** が活用する [Cloudflare](https://www.cloudflare.com/) のインフラストラクチャがセクション889の要件を満たしていることが確認できます。

### DataPacketのインフラストラクチャ {#datapackets-infrastructure}

[DataPacket](https://datapacket.com/) は当社のサーバープロバイダーであり、ネットワーク機器はすべて **Arista Networks** と **Cisco** のみを使用しています。AristaもCiscoもセクション889で禁止されている企業には含まれていません。両社は確立されたベンダーであり、セキュアな企業および政府環境で広く使用されており、厳格なセキュリティおよびコンプライアンス基準を遵守していることで知られています。

[Cloudflare](https://www.cloudflare.com/) と [DataPacket](https://datapacket.com/) のみを使用することで、**Forward Email** はサービス提供チェーン全体でセクション889禁止機器を排除し、**連邦機関やセキュリティ意識の高いユーザー向けに安全なメール転送**を提供しています。


## セクション889を超えて：より広範な政府コンプライアンス {#beyond-section-889-broader-government-compliance}

当社の**政府メールセキュリティ**およびコンプライアンスへの取り組みは、セクション889を超えています。**Forward Email** 自体は、大規模なSaaSプラットフォームのように [管理された非公開情報（CUI）](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) のような機密政府データを直接処理または保存しませんが、当社の**オープンソースのメール転送**アーキテクチャと安全で準拠したプロバイダーへの依存は、他の主要な規制の原則に沿っています：

* **[FAR（連邦調達規則）](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** 準拠したインフラを使用し、シンプルな商用サービスを提供することで、政府契約者に適した**FAR準拠のメール**転送原則を提供します。
* **プライバシー法および[FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of_2002):** 当社は設計段階から**プライバシー重視**であり、**プライバシー法に準拠したメール**原則を提供します。メールは保存せず、直接転送するためデータ処理を最小限に抑えています。当社のインフラプロバイダー（[Cloudflare](https://www.cloudflare.com/)、[DataPacket](https://datapacket.com/)）は、**FISMA準拠のメール**原則に一致する高いセキュリティ基準に従ってシステムを管理しています。
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** **HIPAA準拠のメール転送**が必要な組織に対して、**Forward Email** は準拠ソリューションの一部となり得ます。メールを保存しないため、主な準拠責任はエンドポイントのメールシステムにあります。ただし、当社の安全な転送レイヤーは正しく使用されればHIPAA要件をサポートします。

> \[!WARNING]
> [ビジネスアソシエイト契約（BAA）](https://en.wikipedia.org/wiki/Business_associate_agreement) は、**Forward Email** 自体ではなく、最終的なメールプロバイダーと締結する必要がある場合があります。当社はメール内容を保存しないためです（[当社の暗号化IMAP/POP3ストレージレイヤー](/blog/docs/best-quantum-safe-encrypted-email-service)を使用しない限り）。
## 私たちの今後の道筋：コンプライアンスの視野を広げる {#our-path-forward-expanding-compliance-horizons}

私たちのセクション889のコンプライアンスは、特に連邦契約者にとって重要な基盤を提供しますが、異なる組織や政府機関が多様で進化する規制ニーズを持っていることを理解しています。**Forward Email**では透明性を重視しており、より広範なコンプライアンスの状況と今後の方向性について私たちの見解を共有したいと考えています。

私たちは以下のようなフレームワークや規制の重要性を認識しています：

* **[System for Award Management (SAM)](https://sam.gov/):** 連邦政府との直接契約に不可欠。
* **[FAR (Federal Acquisition Regulation)](https://www.acquisition.gov/browse/index/far):** 商業サービス向けの標準条項である [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) を含む。
* **[DFARS (Defense Federal Acquisition Regulation Supplement)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** 特に国防総省のクラウドサービス向けの [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.)。
* **[CMMC (Cybersecurity Maturity Model Certification)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** [Federal Contract Information (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) または CUI を扱う国防総省契約者に必要。
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** CMMC レベル2の基盤であり、CUI 保護に焦点を当てている。 ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - 米国標準技術研究所)
* **[FedRAMP (Federal Risk and Authorization Management Program)](https://en.wikipedia.org/wiki/FedRAMP):** 連邦機関が利用するクラウドサービスの標準。
* **[FISMA (Federal Information Security Modernization Act)](https://www.cisa.gov/topics/cybersecurity-best-practices/fisma):** 連邦情報セキュリティの包括的な枠組み。
* **[HIPAA (Health Insurance Portability and Accountability Act)](https://www.hhs.gov/hipaa/index.html):** 保護された健康情報（PHI）を扱うための規制。
* **[FERPA (Family Educational Rights and Privacy Act)](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act):** 学生の教育記録を保護するための規制。
* **[COPPA (Children's Online Privacy Protection Act)](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act):** 13歳未満の子供を対象とするサービス向け。

**現在の立場と将来の目標：**

**Forward Email**のコア設計は、**プライバシー重視**、**オープンソース**、およびデータ処理の最小化（特に基本的な**メール転送**サービスにおいて）を特徴としており、これらの規制の*原則*とよく合致しています。既存のセキュリティ対策（暗号化、最新のメール標準のサポート）とセクション889のコンプライアンスは強固な出発点を提供します。

しかし、**FedRAMP**や**CMMC**のようなフレームワークの正式な認証や承認を得ることは大きな挑戦です。これは厳格な文書化、特定の技術的および手続き的管理策（多くの場合数百に及ぶ）の実装、独立した評価（FedRAMPの[3PAO](https://www.fedramp.gov/glossary/#3pao)のような第三者評価機関）、および継続的な監視を伴います。

> \[!IMPORTANT]
> コンプライアンスは単なる技術の問題ではなく、文書化されたプロセス、ポリシー、そして継続的な監視が必要です。FedRAMPやCMMCのような認証を取得するには、多大な投資と時間が必要です。

**私たちのコミットメント：**

**Forward Email**が成長し、お客様のニーズが進化する中で、関連するコンプライアンス認証の検討と取得に取り組むことを約束します。これには以下の計画が含まれます：

1. **SAM登録：** 米国連邦機関との直接的な関与を促進するため。
2. **プロセスの形式化：** CMMCの基盤となるNIST SP 800-171のような標準に沿った内部文書化と手順の強化。
3. **FedRAMPの検討：** FedRAMP承認取得の要件と実現可能性を評価し、LowまたはModerateベースラインから開始し、適用可能な場合は[LI-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/)モデルを活用する可能性。
4. **特定ニーズへの対応：** 医療機関や教育機関との関わりが増える中で、HIPAA（BAAや保存データの特定設定を通じて）やFERPA（適切な契約条項と管理策を通じて）などの要件に対応。
この取り組みには慎重な計画と投資が必要です。すべての認証に対して即時のタイムラインはありませんが、政府や規制産業のニーズを満たすためにコンプライアンス体制を強化することは、私たちのロードマップの重要な部分です。

> \[!NOTE]
> 私たちは、**オープンソース**であることがこのプロセス全体にわたる独自の透明性を提供し、コミュニティや顧客が私たちの取り組みを直接確認できると信じています。

私たちはコンプライアンスの旅の重要なマイルストーンに到達するたびに、コミュニティに更新情報を提供し続けます。


## なぜこれがあなたにとって重要なのか {#why-this-matters-for-you}

**Section 889準拠のメール転送**サービスである**Forward Email**を選ぶことは：

* **安心感：** 特に政府機関、請負業者、セキュリティ意識の高い組織にとって。
* **リスク軽減：** **連邦のメール規制**との潜在的な対立を回避します。
* **信頼：** セキュリティとサプライチェーンの完全性へのコミットメントを示します。

**Forward Email**は、カスタムドメインの**メール転送**ニーズをシンプルで信頼性が高く、*準拠*した方法で提供します。


## 安全で準拠したメール転送はここから始まる {#secure-compliant-email-forwarding-starts-here}

**Forward Email**は、**安全でプライベートかつオープンソースのメール転送**サービスを提供することに専念しています。私たちの**Section 889準拠**は、[Cloudflare](https://www.cloudflare.com/)および[DataPacket](https://datapacket.com/)とのパートナーシップを通じて達成されており（これは**Forward Emailの米海軍士官学校向け準拠**の取り組みを反映しています）、このコミットメントの証です。政府機関、請負業者、または単に**政府のメールセキュリティ**を重視する方にとって、**Forward Email**は最適なサービスです。

安全で準拠したメール転送の準備はできていますか？[今すぐ無料でサインアップ！](https://forwardemail.net)


## 参考文献 {#references}

* **Section 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflare Third Party Code of Conduct:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **DataPacket:** <https://datapacket.com/>
* **System for Award Management (SAM):** <https://sam.gov/>
* **Federal Acquisition Regulation (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Defense Federal Acquisition Regulation Supplement (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Cybersecurity Maturity Model Certification (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://csrc.nist.gov/pubs/sp/800/171/r3/final>
* **Federal Risk and Authorization Management Program (FedRAMP):** <https://www.fedramp.gov/>
* **Federal Information Security Modernization Act (FISMA):** <https://www.cisa.gov/topics/cybersecurity-best-practices/fisma>
* **Health Insurance Portability and Accountability Act (HIPAA):** <https://www.hhs.gov/hipaa/index.html>
* **Family Educational Rights and Privacy Act (FERPA):** <https://studentprivacy.ed.gov/ferpa>
* **Children's Online Privacy Protection Act (COPPA):** <https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa>
