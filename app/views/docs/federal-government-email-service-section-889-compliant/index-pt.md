# Encaminhar e-mail: sua solução de encaminhamento de e-mail em conformidade com a Seção 889 {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Compreendendo a conformidade com a Seção 889](#understanding-section-889-compliance)
* [Como o Forward Email atinge a conformidade com a Seção 889](#how-forward-email-achieves-section-889-compliance)
  * [Compromisso da Cloudflare](#cloudflares-commitment)
  * [Infraestrutura do DataPacket](#datapackets-infrastructure)
* [Além da Seção 889: Conformidade governamental mais ampla](#beyond-section-889-broader-government-compliance)
* [Nosso caminho a seguir: expandindo os horizontes de conformidade](#our-path-forward-expanding-compliance-horizons)
* [Por que isso é importante para você](#why-this-matters-for-you)
* [O encaminhamento de e-mail seguro e compatível começa aqui](#secure-compliant-email-forwarding-starts-here)
* [Referências](#references)

## Prefácio {#foreword}

Na Forward Email, acreditamos em encaminhamento de e-mails simples, seguro e privado para todos. Sabemos que, para muitas organizações, especialmente aquelas que trabalham com o governo dos EUA, a conformidade não é apenas um jargão – é uma necessidade. Garantir a conformidade com as **regulamentações federais para e-mail** é crucial. É por isso que temos orgulho de confirmar que nosso serviço de **encaminhamento seguro de e-mails** foi desenvolvido para atender aos rigorosos requisitos federais, incluindo o [Seção 889](https://www.acquisition.gov/Section-889-Policies) do [Lei de Autorização de Defesa Nacional (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act).

Nosso compromisso com a **conformidade com e-mails governamentais** foi recentemente colocado em prática quando a **Academia Naval dos EUA** contatou a **Forward Email**. Eles solicitaram serviços de **encaminhamento seguro de e-mails** e precisavam de documentação que confirmasse nossa adesão às regulamentações federais, incluindo a **conformidade com a Seção 889**. Essa experiência serve como um valioso estudo de caso, demonstrando nossa prontidão e capacidade para apoiar organizações financiadas pelo governo e atender aos seus rigorosos requisitos. Essa dedicação se estende a todos os nossos usuários que buscam uma solução de e-mail confiável e com foco na privacidade.

## Compreendendo a conformidade com a Seção 889 {#understanding-section-889-compliance}

O que é a Seção 889? Em termos simples, é uma lei federal dos EUA que proíbe agências governamentais de usar ou contratar entidades que utilizem determinados equipamentos ou serviços de telecomunicações e vigilância por vídeo de empresas específicas (como Huawei, ZTE, Hikvision, Dahua e Hytera). Essa regra, frequentemente associada à **proibição da Huawei** e à **proibição da ZTE**, ajuda a proteger a segurança nacional.

> \[!NOTE]
> A Seção 889 visa especificamente equipamentos e serviços da Huawei, ZTE, Hytera, Hikvision e Dahua, incluindo suas subsidiárias e afiliadas.

Para um **serviço de encaminhamento de e-mail para contratos governamentais** como o **Encaminhar e-mail**, isso significa garantir que nenhum dos nossos provedores de infraestrutura subjacente use esse equipamento proibido, o que nos torna **compatíveis com a Seção 889**.

## Como o encaminhamento de e-mails atinge a conformidade com a Seção 889 {#how-forward-email-achieves-section-889-compliance}

Então, **como a Forward Email está em conformidade com a Seção 889?** Conseguimos isso por meio da seleção criteriosa de nossos parceiros de infraestrutura. A **Forward Email** depende exclusivamente de dois provedores principais para sua **infraestrutura em conformidade com a Seção 889**:

1. **[Cloudflare](https://www.cloudflare.com/):** Nosso principal parceiro para serviços de rede e **segurança de e-mail Cloudflare**.
2. **[Pacote de dados](https://datapacket.com/):** Nosso principal provedor para infraestrutura de servidor (usamos [Oceano Digital](https://www.digitalocean.com/) e/ou [Abutre](https://www.vultr.com/) para failover e em breve faremos a transição para usar exclusivamente o DataPacket – é claro que confirmamos a conformidade com a Seção 889 por escrito de ambos os provedores de failover).

> \[!IMPORTANT]
> Nossa confiança exclusiva no Cloudflare e no DataPacket, nenhum dos quais utiliza equipamentos proibidos pela Seção 889, é a base da nossa conformidade.

Tanto o [Cloudflare](https://www.cloudflare.com/) quanto o [Pacote de dados](https://datapacket.com/) estão comprometidos com altos padrões de segurança e não usam equipamentos proibidos pela Seção 889. **Usar o Cloudflare e o DataPacket para conformidade com a Seção 889** é fundamental para o nosso serviço.

### Compromisso da Cloudflare {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) aborda explicitamente a **conformidade com a Seção 889** em seu **[Código de Conduta de Terceiros](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**. Eles afirmam:

> "De acordo com a Seção 889 da Lei de Autorização de Defesa Nacional (NDAA), a Cloudflare não usa, nem permite em sua cadeia de suprimentos, equipamentos de telecomunicações, produtos de vigilância por vídeo ou serviços produzidos ou fornecidos pela Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company ou Dahua Technology Company (ou qualquer subsidiária ou afiliada de tais entidades)."

*(Fonte: Código de Conduta de Terceiros da Cloudflare, recuperado em 29 de abril de 2025)*

Esta declaração clara confirma que a infraestrutura [Cloudflare's](https://www.cloudflare.com/), que o **Forward Email** utiliza, atende aos requisitos da Seção 889.

### Infraestrutura do DataPacket {#datapackets-infrastructure}

[Pacote de dados](https://datapacket.com/), nosso provedor de servidores, utiliza equipamentos de rede exclusivamente da **Arista Networks** e da **Cisco**. Nem a Arista nem a Cisco estão entre as empresas proibidas pela Seção 889. Ambas são fornecedores consolidados, amplamente utilizados em ambientes corporativos e governamentais seguros, conhecidos por aderir a rigorosos padrões de segurança e conformidade.

Ao usar apenas [Cloudflare](https://www.cloudflare.com/) e [Pacote de dados](https://datapacket.com/), o **Forward Email** garante que toda a sua cadeia de entrega de serviços esteja livre de equipamentos proibidos pela Seção 889, fornecendo **encaminhamento de e-mail seguro para agências federais** e outros usuários preocupados com a segurança.

## Além da Seção 889: Conformidade governamental mais ampla {#beyond-section-889-broader-government-compliance}

Nosso compromisso com a **segurança e conformidade de e-mail do governo** vai além da Seção 889. Embora o **Forward Email** em si não processe ou armazene diretamente dados governamentais confidenciais como o [Informações não classificadas controladas (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) da mesma forma que uma grande plataforma SaaS pode fazer, nossa arquitetura de **encaminhamento de e-mail de código aberto** e a dependência de provedores seguros e compatíveis se alinham aos princípios de outras regulamentações importantes:

* **[FAR (Regulamentação Federal de Aquisições)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** Ao utilizar uma infraestrutura compatível e oferecer um serviço comercial direto, oferecemos princípios de encaminhamento de e-mails em conformidade com a **FAR**, adequados para contratantes governamentais.
* **Lei de Privacidade e [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** Somos **focados na privacidade** por natureza, oferecendo os princípios da **Lei de Privacidade**. Não armazenamos seus e-mails. Os e-mails são encaminhados diretamente, minimizando o manuseio de dados. Nossos provedores de infraestrutura ([Cloudflare](https://www.cloudflare.com/), [Pacote de dados](https://datapacket.com/)) gerenciam seus sistemas de acordo com altos padrões de segurança, consistentes com os princípios de **e-mail em conformidade com a FISMA**.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** Para organizações que precisam de **encaminhamento de e-mails em conformidade com a HIPAA**, o **Encaminhar E-mails** pode fazer parte de uma solução em conformidade. Como não armazenamos e-mails, a principal responsabilidade pela conformidade recai sobre os sistemas de e-mail do ponto final. No entanto, nossa camada de transporte seguro atende aos requisitos da HIPAA quando usada corretamente.

> \[!WARNING]
> Um [Contrato de Associado Comercial (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement) pode ser necessário com seu provedor de e-mail final, não com o **Encaminhamento de E-mail** propriamente dito, pois não armazenamos o conteúdo do seu e-mail (a menos que você use [nossa camada de armazenamento IMAP/POP3 criptografada](/blog/docs/best-quantum-safe-encrypted-email-service)).

## Nosso caminho a seguir: expandindo os horizontes de conformidade {#our-path-forward-expanding-compliance-horizons}

Embora nossa conformidade com a Seção 889 forneça uma base crucial, especialmente para contratantes federais, entendemos que diferentes organizações e agências governamentais têm necessidades regulatórias diversas e em constante evolução. Na **Forward Email**, a transparência é fundamental e queremos compartilhar nossa perspectiva sobre o cenário mais amplo de conformidade e nossa direção futura.

Reconhecemos a importância de estruturas e regulamentações como:

* **[Sistema de Gestão de Prêmios (SAM)](https://sam.gov/):** Essencial para contratação federal direta.
* **[FAR (Regulamentação Federal de Aquisições)](https://www.acquisition.gov/browse/index/far):** Incluindo cláusulas padrão como [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) para serviços comerciais.
* **[DFARS (Suplemento de Regulamentação de Aquisições Federais de Defesa)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** Particularmente [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.) para serviços em nuvem do DoD.
* **[CMMC (Certificação do Modelo de Maturidade em Cibersegurança)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** Obrigatório para contratantes do DoD que lidam com [Informações sobre contratos federais (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) ou CUI.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** A base para o CMMC Nível 2, com foco na proteção de CUI. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - Instituto Nacional de Padrões e Tecnologia)
* **[FedRAMP (Programa Federal de Gestão de Riscos e Autorizações)](https://en.wikipedia.org/wiki/FedRAMP):** O padrão para serviços em nuvem usado por agências federais.
* **__PROTECTED_LINK_77__0:** A estrutura abrangente para a segurança da informação federal.
* **__PROTECTED_LINK_77__1:** Para lidar com Informações de Saúde Protegidas (PHI).
* **__PROTECTED_LINK_77__2:** Para proteger os registros educacionais dos alunos.
* **__PROTECTED_LINK_77__3:** Para serviços que lidam com crianças menores de 13 anos.

**Nossa posição atual e metas futuras:**

O design central do **Forward Email** – com foco na **privacidade**, **código aberto** e minimização do processamento de dados (especialmente em nosso serviço básico de **encaminhamento de e-mails**) – alinha-se perfeitamente aos *princípios* por trás de muitas dessas regulamentações. Nossas práticas de segurança atuais (criptografia, suporte a padrões modernos de e-mail) e a conformidade com a Seção 889 fornecem um sólido ponto de partida.

No entanto, obter a certificação ou autorização formal para estruturas como **FedRAMP** ou **CMMC** é uma tarefa significativa. Envolve documentação rigorosa, implementação de controles técnicos e processuais específicos (frequentemente centenas deles), avaliações independentes (como [3PAO](https://www.fedramp.gov/glossary/#3pao) para FedRAMP - Organização de Avaliação de Terceiros) e monitoramento contínuo.

> \[!IMPORTANT]
> Conformidade não se trata apenas de tecnologia; trata-se de processos documentados, políticas e vigilância contínua. Obter certificações como FedRAMP ou CMMC exige investimento e tempo substanciais.

**Nosso compromisso:**

À medida que o **Forward Email** cresce e as necessidades dos nossos clientes evoluem, estamos comprometidos em explorar e buscar certificações de conformidade relevantes. Isso inclui planos para:

1. **Registro SAM:** Para facilitar o engajamento direto com agências federais dos EUA.
2. **Formalização de Processos:** Aprimoramento de nossa documentação e procedimentos internos para alinhamento com padrões como o NIST SP 800-171, que constitui a base para o CMMC.
3. **Avaliação dos Caminhos FedRAMP:** Avaliação dos requisitos e da viabilidade de buscar a autorização FedRAMP, provavelmente começando com uma linha de base Baixa ou Moderada, potencialmente aproveitando o modelo [TO-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) quando aplicável.
4. **Suporte a Necessidades Específicas:** Atendimento a requisitos como HIPAA (potencialmente por meio de BAAs e configurações específicas para dados armazenados) e FERPA (por meio de termos e controles contratuais apropriados) à medida que nos envolvemos mais com instituições de saúde e educação.

Essa jornada exige planejamento e investimento cuidadosos. Embora não tenhamos prazos imediatos para todas as certificações, fortalecer nossa postura de conformidade para atender às necessidades do governo e dos setores regulamentados é uma parte fundamental do nosso roteiro.

> \[!NOTE]
> Acreditamos que nossa natureza de **código aberto** proporciona transparência única durante todo esse processo, permitindo que nossa comunidade e clientes vejam nosso comprometimento em primeira mão.

Continuaremos atualizando nossa comunidade à medida que alcançamos marcos significativos em nossa jornada de conformidade.

## Por que isso é importante para você {#why-this-matters-for-you}

Escolher um serviço de encaminhamento de e-mail compatível com a Seção 889 como o Encaminhar e-mail significa:

* **Tranquilidade:** Especialmente para agências governamentais, contratantes e organizações preocupadas com a segurança.
* **Risco reduzido:** Evita potenciais conflitos com **regulamentações federais para e-mail**.
* **Confiança:** Demonstra compromisso com a segurança e a integridade da cadeia de suprimentos.

**Forward Email** fornece uma maneira simples, confiável e *compatível* de gerenciar suas necessidades de **encaminhamento de e-mail** de domínio personalizado.

## O encaminhamento de e-mail seguro e compatível começa aqui {#secure-compliant-email-forwarding-starts-here}

O **Forward Email** se dedica a fornecer um serviço de **encaminhamento de e-mails seguro, privado e de código aberto**. Nossa **conformidade com a Seção 889**, alcançada por meio de nossa parceria com [Cloudflare](https://www.cloudflare.com/) e [Pacote de dados](https://datapacket.com/) (refletindo nossa **conformidade com o Forward Email para o trabalho da Academia Naval dos EUA**), é uma prova desse compromisso. Seja você uma entidade governamental, um contratante ou simplesmente alguém que valoriza a **segurança de e-mails governamentais**, o **Forward Email** foi criado para você.

Pronto para **encaminhamento de e-mail seguro e em conformidade**? [Cadastre-se gratuitamente hoje mesmo!](https://forwardemail.net)

## Referências {#references}

* **Seção 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Código de Conduta de Terceiros da Cloudflare:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **Pacote de Dados:** <https://datapacket.com/>
* **Sistema de Gerenciamento de Prêmios (SAM):** <https://sam.gov/>
* **Regulamentação Federal de Aquisições (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Suplemento da Regulamentação Federal de Aquisições de Defesa (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Certificação do Modelo de Maturidade em Cibersegurança (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://www.cloudflare.com/>0
* **Programa Federal de Gestão de Riscos e Autorizações (FedRAMP):** <https://www.cloudflare.com/>1
* **Lei Federal de Modernização da Segurança da Informação (FISMA):** <https://www.cloudflare.com/>2
* **Lei de Portabilidade e Responsabilidade de Seguros de Saúde (HIPAA):** <https://www.cloudflare.com/>3
* **Lei de Direitos Educacionais e Privacidade da Família (FERPA):** <https://www.cloudflare.com/>4
* **Lei de Proteção à Privacidade Online de Crianças (COPPA):** <https://www.cloudflare.com/>5