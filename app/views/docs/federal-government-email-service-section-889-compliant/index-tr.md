# E-posta Yönlendirme: Bölüm 889 Uyumlu E-posta Yönlendirme Çözümünüz {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal hükümet e-posta servisi Bölüm 889 uyumlu" class="rounded-lg" />


## İçindekiler {#table-of-contents}

* [Önsöz](#foreword)
* [Bölüm 889 Uyumu Anlama](#understanding-section-889-compliance)
* [Forward Email Bölüm 889 Uyumunu Nasıl Sağlar](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflare'ın Taahhüdü](#cloudflares-commitment)
  * [DataPacket'in Altyapısı](#datapackets-infrastructure)
* [Bölüm 889'un Ötesinde: Daha Geniş Hükümet Uyumu](#beyond-section-889-broader-government-compliance)
* [İlerleme Yolumuz: Uyumluluk Ufuklarını Genişletmek](#our-path-forward-expanding-compliance-horizons)
* [Bu Sizin İçin Neden Önemli](#why-this-matters-for-you)
* [Güvenli, Uyumlu E-posta Yönlendirme Burada Başlar](#secure-compliant-email-forwarding-starts-here)
* [Referanslar](#references)


## Önsöz {#foreword}

Forward Email olarak, herkes için basit, güvenli ve özel e-posta yönlendirmeye inanıyoruz. Özellikle ABD hükümetiyle çalışan birçok kuruluş için uyumun sadece bir moda sözcük olmadığını, bir zorunluluk olduğunu biliyoruz. **Federal e-posta düzenlemelerine** uyum sağlamak çok önemlidir. Bu yüzden, **güvenli e-posta yönlendirme** hizmetimizin, [Ulusal Savunma Yetkilendirme Yasası (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act) kapsamındaki [Bölüm 889](https://www.acquisition.gov/Section-889-Policies) dahil olmak üzere sıkı federal gereksinimleri karşılayacak şekilde tasarlandığını gururla onaylıyoruz.

**Hükümet e-posta uyumu** taahhüdümüz, yakın zamanda **ABD Deniz Harp Okulu**'nun **Forward Email** ile iletişime geçmesiyle uygulamaya kondu. Güvenli e-posta yönlendirme hizmetlerine ihtiyaçları vardı ve federal düzenlemelere, özellikle **Bölüm 889 uyumuna** uyduğumuzu belgeleyen dokümantasyon talep ettiler. Bu deneyim, hükümet tarafından finanse edilen kuruluşları destekleme ve sıkı gereksinimlerini karşılama konusundaki hazır oluşumuzu ve yeteneğimizi gösteren değerli bir vaka çalışmasıdır. Bu bağlılık, güvenilir, **gizlilik odaklı e-posta** çözümü arayan tüm kullanıcılarımıza uzanmaktadır.


## Bölüm 889 Uyumu Anlama {#understanding-section-889-compliance}

Bölüm 889 nedir? Basitçe söylemek gerekirse, belirli şirketlerden (Huawei, ZTE, Hikvision, Dahua ve Hytera gibi) belirli telekomünikasyon ve video gözetim ekipmanları veya hizmetleri kullanan veya bunlarla sözleşme yapan hükümet kurumlarının kullanımını yasaklayan bir ABD federal yasasıdır. Bu kural, genellikle **Huawei yasağı** ve **ZTE yasağı** ile ilişkilendirilir ve ulusal güvenliği korumaya yardımcı olur.

> \[!NOTE]
> Bölüm 889 özellikle Huawei, ZTE, Hytera, Hikvision ve Dahua'nın yanı sıra onların bağlı kuruluşları ve iştiraklerinden gelen ekipman ve hizmetleri hedef alır.

**Forward Email** gibi **hükümet sözleşmeleri için e-posta yönlendirme hizmeti** için bu, altyapı sağlayıcılarımızdan hiçbirinin bu yasaklı ekipmanı kullanmamasını sağlamak anlamına gelir ve böylece **Bölüm 889 uyumlu** oluruz.


## Forward Email Bölüm 889 Uyumunu Nasıl Sağlar {#how-forward-email-achieves-section-889-compliance}

Peki, **Forward Email Bölüm 889 uyumlu nasıl oluyor?** Bunu altyapı ortaklarımızı dikkatli seçerek sağlıyoruz. **Forward Email**, **Bölüm 889 uyumlu altyapısı** için yalnızca iki ana sağlayıcıya dayanır:

1. **[Cloudflare](https://www.cloudflare.com/):** Ağ hizmetleri ve **Cloudflare e-posta güvenliği** için birincil ortağımız.
2. **[DataPacket](https://datapacket.com/):** Sunucu altyapısı için birincil sağlayıcımız (failover için [Digital Ocean](https://www.digitalocean.com/) ve/veya [Vultr](https://www.vultr.com/) kullanıyoruz ve yakında yalnızca DataPacket kullanmaya geçeceğiz – elbette bu failover sağlayıcılarından her ikisinden de Bölüm 889 uyumunu yazılı olarak teyit ettik).

> \[!IMPORTANT]
> Cloudflare ve DataPacket'e olan münhasır bağımlılığımız, her ikisi de Bölüm 889 yasaklı ekipman kullanmadığından, uyumumuzun temel taşıdır.
Her iki [Cloudflare](https://www.cloudflare.com/) ve [DataPacket](https://datapacket.com/) yüksek güvenlik standartlarına bağlıdır ve Bölüm 889 kapsamında yasaklanmış ekipmanları kullanmazlar. **Bölüm 889 uyumluluğu için Cloudflare ve DataPacket kullanmak**, hizmetimizin temelidir.

### Cloudflare'ın Taahhüdü {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) açıkça **Bölüm 889 uyumluluğunu** **[Üçüncü Taraf Davranış Kuralları](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)** içinde ele alır. Şöyle belirtirler:

> "Ulusal Savunma Yetkilendirme Yasası (NDAA) Bölüm 889 kapsamında, Cloudflare, Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company veya Dahua Technology Company (veya bu kuruluşların herhangi bir yan kuruluşu veya bağlı şirketi) tarafından üretilen veya sağlanan telekomünikasyon ekipmanlarını, video gözetim ürünlerini veya hizmetlerini kullanmaz veya tedarik zincirinde izin vermez."

*(Kaynak: Cloudflare Üçüncü Taraf Davranış Kuralları, 29 Nisan 2025 tarihinde erişildi)*

Bu açık ifade, **Forward Email**'in kullandığı [Cloudflare](https://www.cloudflare.com/) altyapısının Bölüm 889 gereksinimlerini karşıladığını doğrular.

### DataPacket'in Altyapısı {#datapackets-infrastructure}

Sunucu sağlayıcımız [DataPacket](https://datapacket.com/), yalnızca **Arista Networks** ve **Cisco** ağ ekipmanlarını kullanmaktadır. Arista ve Cisco, Bölüm 889 kapsamında yasaklanan şirketler arasında değildir. Her ikisi de güvenli kurumsal ve devlet ortamlarında yaygın olarak kullanılan, sıkı güvenlik ve uyumluluk standartlarına uyan köklü tedarikçilerdir.

Sadece [Cloudflare](https://www.cloudflare.com/) ve [DataPacket](https://datapacket.com/) kullanarak, **Forward Email** tüm hizmet sunum zincirinin Bölüm 889 yasaklı ekipmanlardan arınmış olmasını sağlar ve **federal kurumlar için güvenli e-posta yönlendirmesi** sunar.

## Bölüm 889'un Ötesinde: Daha Geniş Devlet Uyumluluğu {#beyond-section-889-broader-government-compliance}

**Devlet e-posta güvenliği** ve uyumluluğuna olan bağlılığımız Bölüm 889'un ötesine geçer. **Forward Email** doğrudan büyük bir SaaS platformu gibi hassas devlet verilerini, örneğin [Kontrollü Sınıflandırılmamış Bilgi (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) işlemez veya depolamaz, ancak **açık kaynaklı e-posta yönlendirme** mimarimiz ve güvenli, uyumlu sağlayıcılara olan bağlılığımız diğer önemli düzenlemelerin prensipleriyle uyumludur:

* **[FAR (Federal Acquisition Regulation)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** Uyumluluk altyapısı kullanarak ve basit bir ticari hizmet sunarak, devlet yüklenicileri için uygun **FAR uyumlu e-posta** yönlendirme prensipleri sağlar.
* **Gizlilik Yasası & [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of_2002):** Tasarım gereği **gizlilik odaklıyız**, **Gizlilik Yasası e-posta** prensipleri sunarız. E-postalarınızı depolamayız. E-postalar doğrudan yönlendirilir, veri işleme en aza indirilir. Altyapı sağlayıcılarımız ([Cloudflare](https://www.cloudflare.com/), [DataPacket](https://datapacket.com/)) sistemlerini yüksek güvenlik standartlarına göre yönetir, bu da **FISMA uyumlu e-posta** prensipleriyle tutarlıdır.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** **HIPAA uyumlu e-posta yönlendirmesi** gereken kuruluşlar için, **Forward Email** uyumlu bir çözümün parçası olabilir. E-postaları depolamadığımız için birincil uyumluluk sorumluluğu uç nokta e-posta sistemlerindedir. Ancak, güvenli taşıma katmanımız doğru kullanıldığında HIPAA gereksinimlerini destekler.

> \[!WARNING]
> Son e-posta sağlayıcınızla bir [İş Ortağı Anlaşması (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement) gerekebilir, **Forward Email** ile değil, çünkü e-posta içeriğinizi depolamıyoruz (kullanmadığınız sürece [şifreli IMAP/POP3 depolama katmanımızı](/blog/docs/best-quantum-safe-encrypted-email-service)).
## İlerleme Yolu: Uyumluluk Ufuklarını Genişletmek {#our-path-forward-expanding-compliance-horizons}

Bölüm 889 uyumluluğumuz, özellikle federal yükleniciler için kritik bir temel sağlarken, farklı kuruluşların ve devlet kurumlarının çeşitli ve gelişen düzenleyici ihtiyaçları olduğunu anlıyoruz. **Forward Email** olarak şeffaflık bizim için çok önemli ve daha geniş uyumluluk ortamı ile gelecekteki yönümüz hakkında perspektifimizi paylaşmak istiyoruz.

Aşağıdaki çerçeveler ve düzenlemelerin önemini kabul ediyoruz:

* **[System for Award Management (SAM)](https://sam.gov/):** Doğrudan federal sözleşmeler için temel.
* **[FAR (Federal Acquisition Regulation)](https://www.acquisition.gov/browse/index/far):** [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) gibi ticari hizmetler için standart maddeleri içerir.
* **[DFARS (Defense Federal Acquisition Regulation Supplement)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** Özellikle DoD bulut hizmetleri için [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.).
* **[CMMC (Cybersecurity Maturity Model Certification)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** [Federal Contract Information (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) veya CUI ile ilgilenen DoD yüklenicileri için gereklidir.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** CMMC Seviye 2'nin temeli olup, CUI korumasına odaklanır. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - Ulusal Standartlar ve Teknoloji Enstitüsü)
* **[FedRAMP (Federal Risk and Authorization Management Program)](https://en.wikipedia.org/wiki/FedRAMP):** Federal kurumlar tarafından kullanılan bulut hizmetleri için standart.
* **[FISMA (Federal Information Security Modernization Act)](https://www.cisa.gov/topics/cybersecurity-best-practices/fisma):** Federal bilgi güvenliği için genel çerçeve.
* **[HIPAA (Health Insurance Portability and Accountability Act)](https://www.hhs.gov/hipaa/index.html):** Korunan Sağlık Bilgilerinin (PHI) işlenmesi için.
* **[FERPA (Family Educational Rights and Privacy Act)](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act):** Öğrenci eğitim kayıtlarının korunması için.
* **[COPPA (Children's Online Privacy Protection Act)](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act):** 13 yaş altı çocuklarla ilgili hizmetler için.

**Mevcut Durumumuz ve Gelecek Hedeflerimiz:**

**Forward Email**'in temel tasarımı – **gizlilik odaklı**, **açık kaynaklı** ve veri işleme (özellikle temel **e-posta yönlendirme** hizmetimizde) minimal – bu düzenlemelerin *ilkeleri* ile iyi uyum sağlar. Mevcut güvenlik uygulamalarımız (şifreleme, modern e-posta standartları desteği) ve Bölüm 889 uyumluluğumuz güçlü bir başlangıç noktası sunar.

Ancak, **FedRAMP** veya **CMMC** gibi çerçeveler için resmi sertifikasyon veya yetkilendirme almak önemli bir çabadır. Bu, titiz dokümantasyon, belirli teknik ve prosedürel kontrollerin uygulanması (çoğu zaman yüzlercesi), bağımsız değerlendirmeler (FedRAMP için [3PAO](https://www.fedramp.gov/glossary/#3pao) - Üçüncü Taraf Değerlendirme Kuruluşu gibi) ve sürekli izlemeyi içerir.

> \[!IMPORTANT]
> Uyumluluk sadece teknoloji ile ilgili değildir; belgelenmiş süreçler, politikalar ve sürekli dikkat gerektirir. FedRAMP veya CMMC gibi sertifikalar almak önemli yatırım ve zaman gerektirir.

**Taahhüdümüz:**

**Forward Email** büyüdükçe ve müşterilerimizin ihtiyaçları geliştikçe, ilgili uyumluluk sertifikalarını araştırmaya ve takip etmeye kararlıyız. Bu kapsamda planlarımız şunlardır:

1. **SAM Kaydı:** ABD federal kurumlarıyla doğrudan etkileşimi kolaylaştırmak için.
2. **Süreçlerin Resmileştirilmesi:** CMMC'nin temelini oluşturan NIST SP 800-171 gibi standartlarla uyumlu olacak şekilde dahili dokümantasyon ve prosedürlerimizi geliştirmek.
3. **FedRAMP Yollarının Değerlendirilmesi:** FedRAMP yetkilendirmesi için gereksinimleri ve uygulanabilirliği değerlendirmek, muhtemelen Düşük veya Orta seviye temel ile başlayarak, uygun durumlarda [LI-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) modelinden faydalanmak.
4. **Özel İhtiyaçların Desteklenmesi:** Sağlık ve eğitim kurumlarıyla daha fazla etkileşim kurdukça HIPAA (muhtemelen BAA'lar ve depolanan veriler için özel yapılandırmalar yoluyla) ve FERPA (uygun sözleşme şartları ve kontrollerle) gibi gereksinimleri karşılamak.
Bu yolculuk dikkatli planlama ve yatırım gerektirir. Tüm sertifikalar için hemen zaman çizelgelerimiz olmasa da, hükümet ve düzenlenen endüstrilerin ihtiyaçlarını karşılamak için uyumluluk duruşumuzu güçlendirmek yol haritamızın önemli bir parçasıdır.

> \[!NOTE]
> Sürecin her aşamasında topluluğumuzun ve müşterilerimizin taahhüdümüzü ilk elden görmesini sağlayan **açık kaynak** doğamızın benzersiz bir şeffaflık sunduğuna inanıyoruz.

Uyumluluk yolculuğumuzda önemli dönüm noktalarına ulaştıkça topluluğumuzu güncellemeye devam edeceğiz.


## Bu Sizin İçin Neden Önemli {#why-this-matters-for-you}

**Section 889 uyumlu e-posta yönlendirme** hizmeti olarak **Forward Email**’i seçmek demek:

* **Huzur:** Özellikle hükümet kurumları, yükleniciler ve güvenlik bilincine sahip organizasyonlar için.
* **Azaltılmış Risk:** **E-posta için federal düzenlemelerle** potansiyel çatışmaların önüne geçer.
* **Güven:** Güvenlik ve tedarik zinciri bütünlüğüne bağlılığı gösterir.

**Forward Email**, özel alan adınız için **e-posta yönlendirme** ihtiyaçlarınızı yönetmenin basit, güvenilir ve *uyumlu* bir yolunu sunar.


## Güvenli, Uyumlu E-posta Yönlendirme Burada Başlar {#secure-compliant-email-forwarding-starts-here}

**Forward Email**, **güvenli, özel ve açık kaynaklı e-posta yönlendirme** hizmeti sunmaya kendini adamıştır. [Cloudflare](https://www.cloudflare.com/) ve [DataPacket](https://datapacket.com/) ile ortaklığımız aracılığıyla elde ettiğimiz **Section 889 uyumluluğumuz** (bu, **Forward Email’in ABD Deniz Harp Okulu uyumluluğu** çalışmalarını yansıtır) bu taahhüdün bir göstergesidir. İster bir hükümet kuruluşu olun, ister bir yüklenici ya da sadece **hükümet e-posta güvenliğine** değer verin, **Forward Email** sizin için tasarlanmıştır.

Güvenli, uyumlu e-posta yönlendirmeye hazır mısınız? [Bugün ücretsiz kaydolun!](https://forwardemail.net)


## Kaynaklar {#references}

* **Section 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflare Üçüncü Taraf Davranış Kuralları:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **DataPacket:** <https://datapacket.com/>
* **Ödül Yönetim Sistemi (SAM):** <https://sam.gov/>
* **Federal Satın Alma Yönetmeliği (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Savunma Federal Satın Alma Yönetmeliği Ekleri (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Siber Güvenlik Olgunluk Modeli Sertifikasyonu (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://csrc.nist.gov/pubs/sp/800/171/r3/final>
* **Federal Risk ve Yetkilendirme Yönetim Programı (FedRAMP):** <https://www.fedramp.gov/>
* **Federal Bilgi Güvenliği Modernizasyon Yasası (FISMA):** <https://www.cisa.gov/topics/cybersecurity-best-practices/fisma>
* **Sağlık Sigortası Taşınabilirlik ve Sorumluluk Yasası (HIPAA):** <https://www.hhs.gov/hipaa/index.html>
* **Aile Eğitim Hakları ve Gizlilik Yasası (FERPA):** <https://studentprivacy.ed.gov/ferpa>
* **Çocukların Çevrimiçi Gizliliğini Koruma Yasası (COPPA):** <https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa>
