# Acordo de Processamento de Dados {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Acordo de processamento de dados Forward Email" class="rounded-lg" />


## Índice {#table-of-contents}

* [Termos Principais](#key-terms)
* [Alterações no Acordo](#changes-to-the-agreement)
* [1. Relações entre Processador e Subprocessador](#1-processor-and-subprocessor-relationships)
  * [1. Provedor como Processador](#1-provider-as-processor)
  * [2. Provedor como Subprocessador](#2-provider-as-subprocessor)
* [2. Processamento](#2-processing)
  * [1. Detalhes do Processamento](#1-processing-details)
  * [2. Instruções de Processamento](#2-processing-instructions)
  * [3. Processamento pelo Provedor](#3-processing-by-provider)
  * [4. Processamento pelo Cliente](#4-customer-processing)
  * [5. Consentimento para Processamento](#5-consent-to-processing)
  * [6. Subprocessadores](#6-subprocessors)
* [3. Transferências Restritas](#3-restricted-transfers)
  * [1. Autorização](#1-authorization)
  * [2. Transferências fora do EEE](#2-ex-eea-transfers)
  * [3. Transferências fora do Reino Unido](#3-ex-uk-transfers)
  * [4. Outras Transferências Internacionais](#4-other-international-transfers)
* [4. Resposta a Incidentes de Segurança](#4-security-incident-response)
* [5. Auditoria e Relatórios](#5-audit--reports)
  * [1. Direitos de Auditoria](#1-audit-rights)
  * [2. Relatórios de Segurança](#2-security-reports)
  * [3. Diligência Devida de Segurança](#3-security-due-diligence)
* [6. Coordenação e Cooperação](#6-coordination--cooperation)
  * [1. Resposta a Consultas](#1-response-to-inquiries)
  * [2. DPIAs e DTIAs](#2-dpias-and-dtias)
* [7. Exclusão de Dados Pessoais do Cliente](#7-deletion-of-customer-personal-data)
  * [1. Exclusão pelo Cliente](#1-deletion-by-customer)
  * [2. Exclusão ao Expirar o DPA](#2-deletion-at-dpa-expiration)
* [8. Limitação de Responsabilidade](#8-limitation-of-liability)
  * [1. Limites de Responsabilidade e Renúncia de Danos](#1-liability-caps-and-damages-waiver)
  * [2. Reclamações de Terceiros Relacionados](#2-related-party-claims)
  * [3. Exceções](#3-exceptions)
* [9. Conflitos Entre Documentos](#9-conflicts-between-documents)
* [10. Prazo do Acordo](#10-term-of-agreement)
* [11. Lei Aplicável e Tribunais Escolhidos](#11-governing-law-and-chosen-courts)
* [12. Relação com o Provedor de Serviços](#12-service-provider-relationship)
* [13. Definições](#13-definitions)
* [Créditos](#credits)


## Termos Principais {#key-terms}

| Termo                                      | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Acordo</strong>                     | Este DPA complementa os [Termos de Serviço](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Subprocessadores Aprovados</strong> | [Cloudflare](https://cloudflare.com) (EUA; provedor de DNS, rede e segurança), [DataPacket](https://www.datapacket.com/) (EUA/Reino Unido; provedor de hospedagem), [Digital Ocean](https://digitalocean.com) (EUA; provedor de hospedagem), [GitHub](https://github.com) (EUA; hospedagem de código-fonte, CI/CD e gerenciamento de projetos), [Vultr](https://www.vultr.com) (EUA; provedor de hospedagem), [Stripe](https://stripe.com) (EUA; processador de pagamentos), [PayPal](https://paypal.com) (EUA; processador de pagamentos) |
| <strong>Contato de Segurança do Provedor</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Política de Segurança</strong>     | Veja [nossa Política de Segurança no GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                     |
| <strong>Estado Regente</strong>             | O Estado de Delaware, Estados Unidos                                                                                                                                                                                                                                                                                                                                                                                                                                               |
## Alterações no Contrato {#changes-to-the-agreement}

Este documento é um derivado dos [Termos Padrão do DPA do Common Paper (Versão 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) e as seguintes alterações foram feitas:

1. [Lei Aplicável e Tribunais Escolhidos](#11-governing-law-and-chosen-courts) foi incluída como uma seção abaixo com o `Estado Governante` identificado acima.
2. [Relação com o Provedor de Serviço](#12-service-provider-relationship) foi incluída como uma seção abaixo.


## 1. Relações entre Processador e Subprocessador {#1-processor-and-subprocessor-relationships}

### 1. Provedor como Processador {#1-provider-as-processor}

Em situações onde o <strong>Cliente</strong> é um Controlador dos Dados Pessoais do Cliente, o <strong>Provedor</strong> será considerado um Processador que está Processando Dados Pessoais em nome do <strong>Cliente</strong>.

### 2. Provedor como Subprocessador {#2-provider-as-subprocessor}

Em situações onde o <strong>Cliente</strong> é um Processador dos Dados Pessoais do Cliente, o <strong>Provedor</strong> será considerado um Subprocessador dos Dados Pessoais do Cliente.


## 2. Processamento {#2-processing}

### 1. Detalhes do Processamento {#1-processing-details}

O Anexo I(B) na Página de Capa descreve o objeto, natureza, finalidade e duração deste Processamento, bem como as <strong>Categorias de Dados Pessoais</strong> coletados e as <strong>Categorias de Titulares dos Dados</strong>.

### 2. Instruções de Processamento {#2-processing-instructions}

O <strong>Cliente</strong> instrui o <strong>Provedor</strong> a Processar os Dados Pessoais do Cliente: (a) para fornecer e manter o Serviço; (b) conforme possa ser especificado adicionalmente pelo uso do Serviço pelo <strong>Cliente</strong>; (c) conforme documentado no <strong>Contrato</strong>; e (d) conforme documentado em quaisquer outras instruções escritas dadas pelo <strong>Cliente</strong> e reconhecidas pelo <strong>Provedor</strong> sobre o Processamento dos Dados Pessoais do Cliente sob este DPA. O <strong>Provedor</strong> cumprirá essas instruções, a menos que seja proibido por Leis Aplicáveis. O <strong>Provedor</strong> informará imediatamente o <strong>Cliente</strong> se não puder seguir as instruções de Processamento. O <strong>Cliente</strong> deu e dará apenas instruções que estejam em conformidade com as Leis Aplicáveis.

### 3. Processamento pelo Provedor {#3-processing-by-provider}

O <strong>Provedor</strong> processará os Dados Pessoais do Cliente somente de acordo com este DPA, incluindo os detalhes na Página de Capa. Se o <strong>Provedor</strong> atualizar o Serviço para atualizar produtos, recursos ou funcionalidades existentes ou incluir novos, o <strong>Provedor</strong> poderá alterar as <strong>Categorias de Titulares dos Dados</strong>, <strong>Categorias de Dados Pessoais</strong>, <strong>Dados de Categoria Especial</strong>, <strong>Restrições ou Salvaguardas para Dados de Categoria Especial</strong>, <strong>Frequência de Transferência</strong>, <strong>Natureza e Finalidade do Processamento</strong> e <strong>Duração do Processamento</strong> conforme necessário para refletir as atualizações, notificando o <strong>Cliente</strong> sobre as atualizações e mudanças.

### 4. Processamento pelo Cliente {#4-customer-processing}

Quando o <strong>Cliente</strong> for um Processador e o <strong>Provedor</strong> for um Subprocessador, o <strong>Cliente</strong> cumprirá todas as Leis Aplicáveis que se aplicam ao Processamento dos Dados Pessoais do Cliente pelo <strong>Cliente</strong>. O acordo do <strong>Cliente</strong> com seu Controlador exigirá igualmente que o <strong>Cliente</strong> cumpra todas as Leis Aplicáveis que se aplicam ao <strong>Cliente</strong> como Processador. Além disso, o <strong>Cliente</strong> cumprirá os requisitos para Subprocessadores no acordo do <strong>Cliente</strong> com seu Controlador.

### 5. Consentimento para Processamento {#5-consent-to-processing}

O <strong>Cliente</strong> cumpriu e continuará a cumprir todas as Leis de Proteção de Dados Aplicáveis relativas ao fornecimento dos Dados Pessoais do Cliente ao <strong>Provedor</strong> e/ou ao Serviço, incluindo fazer todas as divulgações, obter todos os consentimentos, fornecer escolha adequada e implementar salvaguardas relevantes exigidas pelas Leis de Proteção de Dados Aplicáveis.
### 6. Subprocessadores {#6-subprocessors}

a. <strong>Provedor</strong> não fornecerá, transferirá ou entregará quaisquer Dados Pessoais do Cliente a um Subprocessador, a menos que o <strong>Cliente</strong> tenha aprovado o Subprocessador. A lista atual de <strong>Subprocessadores Aprovados</strong> inclui as identidades dos Subprocessadores, seu país de localização e suas tarefas de Processamento previstas. <strong>Provedor</strong> informará o <strong>Cliente</strong> com pelo menos 10 dias úteis de antecedência e por escrito sobre quaisquer alterações pretendidas nos <strong>Subprocessadores Aprovados</strong>, seja por adição ou substituição de um Subprocessador, o que permite ao <strong>Cliente</strong> ter tempo suficiente para se opor às alterações antes que o <strong>Provedor</strong> comece a usar o(s) novo(s) Subprocessador(es). <strong>Provedor</strong> fornecerá ao <strong>Cliente</strong> as informações necessárias para permitir que o <strong>Cliente</strong> exerça seu direito de se opor à alteração dos <strong>Subprocessadores Aprovados</strong>. O <strong>Cliente</strong> tem 30 dias após o aviso de uma alteração nos <strong>Subprocessadores Aprovados</strong> para se opor, caso contrário, o <strong>Cliente</strong> será considerado como tendo aceitado as alterações. Se o <strong>Cliente</strong> se opuser à alteração dentro de 30 dias após o aviso, o <strong>Cliente</strong> e o <strong>Provedor</strong> cooperarão de boa-fé para resolver a objeção ou preocupação do <strong>Cliente</strong>.

b. Ao contratar um Subprocessador, o <strong>Provedor</strong> terá um acordo escrito com o Subprocessador que assegure que o Subprocessador acesse e utilize os Dados Pessoais do Cliente (i) apenas na medida necessária para cumprir as obrigações subcontratadas a ele, e (ii) de forma consistente com os termos do <strong>Acordo</strong>.

c. Se o GDPR se aplicar ao Processamento dos Dados Pessoais do Cliente, (i) as obrigações de proteção de dados descritas neste DPA (conforme referido no Artigo 28(3) do GDPR, se aplicável) também serão impostas ao Subprocessador, e (ii) o acordo do <strong>Provedor</strong> com o Subprocessador incorporará essas obrigações, incluindo detalhes sobre como o <strong>Provedor</strong> e seu Subprocessador coordenarão para responder a consultas ou solicitações sobre o Processamento dos Dados Pessoais do Cliente. Além disso, o <strong>Provedor</strong> compartilhará, a pedido do <strong>Cliente</strong>, uma cópia de seus acordos (incluindo quaisquer emendas) com seus Subprocessadores. Na medida necessária para proteger segredos comerciais ou outras informações confidenciais, incluindo dados pessoais, o <strong>Provedor</strong> poderá redigir o texto de seu acordo com o Subprocessador antes de compartilhar uma cópia.

d. O <strong>Provedor</strong> permanece totalmente responsável por todas as obrigações subcontratadas a seus Subprocessadores, incluindo os atos e omissões de seus Subprocessadores no Processamento dos Dados Pessoais do Cliente. O <strong>Provedor</strong> notificará o Cliente sobre qualquer falha de seus Subprocessadores em cumprir uma obrigação material relativa aos Dados Pessoais do Cliente sob o acordo entre o <strong>Provedor</strong> e o Subprocessador.


## 3. Transferências Restritas {#3-restricted-transfers}

### 1. Autorização {#1-authorization}

O <strong>Cliente</strong> concorda que o <strong>Provedor</strong> pode transferir Dados Pessoais do Cliente para fora do EEE, do Reino Unido ou de outro território geográfico relevante, conforme necessário para fornecer o Serviço. Se o <strong>Provedor</strong> transferir Dados Pessoais do Cliente para um território para o qual a Comissão Europeia ou outra autoridade supervisora relevante não tenha emitido uma decisão de adequação, o <strong>Provedor</strong> implementará salvaguardas apropriadas para a transferência dos Dados Pessoais do Cliente para esse território, em conformidade com as Leis de Proteção de Dados Aplicáveis.

### 2. Transferências fora do EEE {#2-ex-eea-transfers}

O <strong>Cliente</strong> e o <strong>Provedor</strong> concordam que, se o GDPR proteger a transferência dos Dados Pessoais do Cliente, a transferência for do <strong>Cliente</strong> dentro do EEE para o <strong>Provedor</strong> fora do EEE, e a transferência não for regida por uma decisão de adequação feita pela Comissão Europeia, então, ao celebrar este DPA, o <strong>Cliente</strong> e o <strong>Provedor</strong> são considerados como tendo assinado as SCCs do EEE e seus Anexos, que são incorporados por referência. Qualquer transferência desse tipo é feita nos termos das SCCs do EEE, que são preenchidas da seguinte forma:
a. O Módulo Dois (Controlador para Processador) dos SCCs do EEE aplica-se quando o <strong>Cliente</strong> é um Controlador e o <strong>Fornecedor</strong> está Processando Dados Pessoais do Cliente para o <strong>Cliente</strong> como Processador.

b. O Módulo Três (Processador para Subprocessador) dos SCCs do EEE aplica-se quando o <strong>Cliente</strong> é um Processador e o <strong>Fornecedor</strong> está Processando Dados Pessoais do Cliente em nome do <strong>Cliente</strong> como Subprocessador.

c. Para cada módulo, aplica-se o seguinte (quando aplicável):

1. A cláusula opcional de acoplamento na Cláusula 7 não se aplica;

2. Na Cláusula 9, a Opção 2 (autorização escrita geral) aplica-se, e o período mínimo para aviso prévio de alterações de Subprocessador é de 10 dias úteis;

3. Na Cláusula 11, a linguagem opcional não se aplica;

4. Todos os colchetes na Cláusula 13 são removidos;

5. Na Cláusula 17 (Opção 1), os SCCs do EEE serão regidos pelas leis do <strong>Estado-Membro Governante</strong>;

6. Na Cláusula 18(b), os litígios serão resolvidos nos tribunais do <strong>Estado-Membro Governante</strong>; e

7. A Página de Capa deste DPA contém as informações exigidas no Anexo I, Anexo II e Anexo III dos SCCs do EEE.

### 3. Transferências ex-UK {#3-ex-uk-transfers}

<strong>Cliente</strong> e <strong>Fornecedor</strong> concordam que, se o UK GDPR protege a transferência de Dados Pessoais do Cliente, a transferência é do <strong>Cliente</strong> dentro do Reino Unido para o <strong>Fornecedor</strong> fora do Reino Unido, e a transferência não é regida por uma decisão de adequação feita pelo Secretário de Estado do Reino Unido, então, ao celebrar este DPA, o <strong>Cliente</strong> e o <strong>Fornecedor</strong> são considerados como tendo assinado o Adendo do Reino Unido e seus Anexos, que são incorporados por referência. Qualquer transferência desse tipo é feita nos termos do Adendo do Reino Unido, que é completado da seguinte forma:

a. A Seção 3.2 deste DPA contém as informações exigidas na Tabela 2 do Adendo do Reino Unido.

b. A Tabela 4 do Adendo do Reino Unido é modificada da seguinte forma: Nenhuma das partes pode encerrar o Adendo do Reino Unido conforme estabelecido na Seção 19 do Adendo do Reino Unido; na medida em que o ICO emitir um Adendo Aprovado revisado sob a Seção ‎18 do Adendo do Reino Unido, as partes trabalharão de boa-fé para revisar este DPA em conformidade.

c. A Página de Capa contém as informações exigidas pelo Anexo 1A, Anexo 1B, Anexo II e Anexo III do Adendo do Reino Unido.

### 4. Outras Transferências Internacionais {#4-other-international-transfers}

Para transferências de Dados Pessoais onde a lei suíça (e não a lei de qualquer estado membro do EEE ou do Reino Unido) se aplica à natureza internacional da transferência, as referências ao GDPR na Cláusula 4 dos SCCs do EEE são, na medida legalmente exigida, alteradas para referir-se à Lei Federal Suíça de Proteção de Dados ou seu sucessor, e o conceito de autoridade supervisora incluirá o Comissário Federal Suíço para Proteção de Dados e Informação.

## 4. Resposta a Incidentes de Segurança {#4-security-incident-response}

1. Ao tomar conhecimento de qualquer Incidente de Segurança, o <strong>Fornecedor</strong> irá: (a) notificar o <strong>Cliente</strong> sem demora indevida quando possível, mas no máximo 72 horas após tomar conhecimento do Incidente de Segurança; (b) fornecer informações oportunas sobre o Incidente de Segurança conforme forem conhecidas ou conforme razoavelmente solicitado pelo <strong>Cliente</strong>; e (c) tomar prontamente medidas razoáveis para conter e investigar o Incidente de Segurança. A notificação ou resposta do <strong>Fornecedor</strong> a um Incidente de Segurança conforme exigido por este DPA não será interpretada como um reconhecimento pelo <strong>Fornecedor</strong> de qualquer culpa ou responsabilidade pelo Incidente de Segurança.

## 5. Auditoria & Relatórios {#5-audit--reports}

### 1. Direitos de Auditoria {#1-audit-rights}

O <strong>Fornecedor</strong> fornecerá ao <strong>Cliente</strong> todas as informações razoavelmente necessárias para demonstrar sua conformidade com este DPA e permitirá e contribuirá para auditorias, incluindo inspeções pelo <strong>Cliente</strong>, para avaliar a conformidade do <strong>Fornecedor</strong> com este DPA. No entanto, o <strong>Fornecedor</strong> pode restringir o acesso a dados ou informações se o acesso do <strong>Cliente</strong> a essas informações impactar negativamente os direitos de propriedade intelectual do <strong>Fornecedor</strong>, obrigações de confidencialidade ou outras obrigações sob as Leis Aplicáveis. O <strong>Cliente</strong> reconhece e concorda que exercerá seus direitos de auditoria sob este DPA e quaisquer direitos de auditoria concedidos pelas Leis de Proteção de Dados Aplicáveis apenas instruindo o <strong>Fornecedor</strong> a cumprir os requisitos de relatório e diligência devida abaixo. O <strong>Fornecedor</strong> manterá registros de sua conformidade com este DPA por 3 anos após o término do DPA.
### 2. Relatórios de Segurança {#2-security-reports}

<strong>Cliente</strong> reconhece que o <strong>Fornecedor</strong> é regularmente auditado conforme os padrões definidos na <strong>Política de Segurança</strong> por auditores independentes terceirizados. Mediante solicitação por escrito, o <strong>Fornecedor</strong> fornecerá ao <strong>Cliente</strong>, de forma confidencial, uma cópia resumida de seu Relatório vigente para que o <strong>Cliente</strong> possa verificar a conformidade do <strong>Fornecedor</strong> com os padrões definidos na <strong>Política de Segurança</strong>.

### 3. Diligência de Segurança {#3-security-due-diligence}

Além do Relatório, o <strong>Fornecedor</strong> responderá a solicitações razoáveis de informações feitas pelo <strong>Cliente</strong> para confirmar a conformidade do <strong>Fornecedor</strong> com este DPA, incluindo respostas a questionários de segurança da informação, diligência e auditoria, ou fornecendo informações adicionais sobre seu programa de segurança da informação. Todas essas solicitações devem ser feitas por escrito e direcionadas ao <strong>Contato de Segurança do Fornecedor</strong> e poderão ser feitas apenas uma vez por ano.


## 6. Coordenação e Cooperação {#6-coordination--cooperation}

### 1. Resposta a Consultas {#1-response-to-inquiries}

Se o <strong>Fornecedor</strong> receber qualquer consulta ou solicitação de qualquer outra pessoa sobre o Processamento de Dados Pessoais do Cliente, o <strong>Fornecedor</strong> notificará o <strong>Cliente</strong> sobre a solicitação e não responderá à solicitação sem o consentimento prévio do <strong>Cliente</strong>. Exemplos dessas consultas e solicitações incluem uma ordem judicial, administrativa ou de agência reguladora sobre Dados Pessoais do Cliente onde a notificação ao <strong>Cliente</strong> não seja proibida pela Lei Aplicável, ou uma solicitação de um titular de dados. Se permitido pela Lei Aplicável, o <strong>Fornecedor</strong> seguirá as instruções razoáveis do <strong>Cliente</strong> sobre essas solicitações, incluindo fornecer atualizações de status e outras informações razoavelmente solicitadas pelo <strong>Cliente</strong>. Se um titular de dados fizer uma solicitação válida sob as Leis de Proteção de Dados Aplicáveis para excluir ou optar por não fornecer os Dados Pessoais do Cliente ao <strong>Fornecedor</strong>, o <strong>Fornecedor</strong> auxiliará o <strong>Cliente</strong> no cumprimento da solicitação conforme a Lei de Proteção de Dados Aplicável. O <strong>Fornecedor</strong> cooperará e fornecerá assistência razoável ao <strong>Cliente</strong>, às custas do <strong>Cliente</strong>, em qualquer resposta legal ou outra ação processual tomada pelo <strong>Cliente</strong> em resposta a uma solicitação de terceiros sobre o Processamento dos Dados Pessoais do Cliente pelo <strong>Fornecedor</strong> sob este DPA.

### 2. DPIAs e DTIAs {#2-dpias-and-dtias}

Se exigido pelas Leis de Proteção de Dados Aplicáveis, o <strong>Fornecedor</strong> auxiliará razoavelmente o <strong>Cliente</strong> na realização de quaisquer avaliações de impacto de proteção de dados ou avaliações de impacto de transferência de dados mandatadas e consultas com as autoridades de proteção de dados relevantes, levando em consideração a natureza do Processamento e dos Dados Pessoais do Cliente.


## 7. Exclusão dos Dados Pessoais do Cliente {#7-deletion-of-customer-personal-data}

### 1. Exclusão pelo Cliente {#1-deletion-by-customer}

O <strong>Fornecedor</strong> permitirá que o <strong>Cliente</strong> exclua os Dados Pessoais do Cliente de maneira consistente com a funcionalidade dos Serviços. O <strong>Fornecedor</strong> cumprirá essa instrução assim que razoavelmente possível, exceto quando o armazenamento adicional dos Dados Pessoais do Cliente for exigido pela Lei Aplicável.

### 2. Exclusão na Expiração do DPA {#2-deletion-at-dpa-expiration}

a. Após a expiração do DPA, o <strong>Fornecedor</strong> devolverá ou excluirá os Dados Pessoais do Cliente conforme instrução do <strong>Cliente</strong>, salvo se o armazenamento adicional dos Dados Pessoais do Cliente for exigido ou autorizado pela Lei Aplicável. Se a devolução ou destruição for impraticável ou proibida pelas Leis Aplicáveis, o <strong>Fornecedor</strong> fará esforços razoáveis para impedir o Processamento adicional dos Dados Pessoais do Cliente e continuará a proteger os Dados Pessoais do Cliente que permanecerem em sua posse, custódia ou controle. Por exemplo, as Leis Aplicáveis podem exigir que o <strong>Fornecedor</strong> continue hospedando ou processando os Dados Pessoais do Cliente.
b. Se <strong>Cliente</strong> e <strong>Fornecedor</strong> tiverem incluído as SCCs do EEE ou o Adendo do Reino Unido como parte deste DPA, o <strong>Fornecedor</strong> só fornecerá ao <strong>Cliente</strong> a certificação de exclusão de Dados Pessoais descrita na Cláusula 8.1(d) e na Cláusula 8.5 das SCCs do EEE se o <strong>Cliente</strong> solicitar uma.

## 8. Limitação de Responsabilidade {#8-limitation-of-liability}

### 1. Limites de Responsabilidade e Renúncia de Danos {#1-liability-caps-and-damages-waiver}

**Na máxima extensão permitida pelas Leis de Proteção de Dados Aplicáveis, a responsabilidade total cumulativa de cada parte para com a outra decorrente ou relacionada a este DPA estará sujeita às renúncias, exclusões e limitações de responsabilidade estabelecidas no <strong>Acordo</strong>.**

### 2. Reclamações de Terceiros Relacionados {#2-related-party-claims}

**Quaisquer reclamações feitas contra o <strong>Fornecedor</strong> ou suas Afiliadas decorrentes ou relacionadas a este DPA só podem ser apresentadas pela entidade <strong>Cliente</strong> que seja parte do <strong>Acordo</strong>.**

### 3. Exceções {#3-exceptions}

1. Este DPA não limita qualquer responsabilidade para com um indivíduo em relação aos direitos de proteção de dados desse indivíduo sob as Leis de Proteção de Dados Aplicáveis. Além disso, este DPA não limita qualquer responsabilidade entre as partes por violações das SCCs do EEE ou do Adendo do Reino Unido.

## 9. Conflitos Entre Documentos {#9-conflicts-between-documents}

1. Este DPA faz parte e complementa o Acordo. Se houver qualquer inconsistência entre este DPA, o <strong>Acordo</strong> ou qualquer de suas partes, a parte listada anteriormente prevalecerá sobre a parte listada posteriormente para essa inconsistência: (1) as SCCs do EEE ou o Adendo do Reino Unido, (2) este DPA, e então (3) o <strong>Acordo</strong>.

## 10. Prazo do Acordo {#10-term-of-agreement}

Este DPA começará quando o <strong>Fornecedor</strong> e o <strong>Cliente</strong> concordarem com uma Página de Capa para o DPA e assinarem ou aceitarem eletronicamente o <strong>Acordo</strong> e continuará até que o <strong>Acordo</strong> expire ou seja rescindido. No entanto, o <strong>Fornecedor</strong> e o <strong>Cliente</strong> permanecerão sujeitos às obrigações deste DPA e às Leis de Proteção de Dados Aplicáveis até que o <strong>Cliente</strong> pare de transferir Dados Pessoais do Cliente para o <strong>Fornecedor</strong> e o <strong>Fornecedor</strong> pare de Processar Dados Pessoais do Cliente.

## 11. Lei Aplicável e Tribunais Escolhidos {#11-governing-law-and-chosen-courts}

Não obstante as cláusulas de lei aplicável ou similares do <strong>Acordo</strong>, todas as interpretações e disputas sobre este DPA serão regidas pelas leis do <strong>Estado Governante</strong> sem consideração às suas disposições sobre conflito de leis. Além disso, e não obstante a seleção de foro, jurisdição ou cláusulas similares do <strong>Acordo</strong>, as partes concordam em levar qualquer ação judicial, processo ou procedimento sobre este DPA aos tribunais do <strong>Estado Governante</strong>, e cada parte se submete irrevogavelmente à jurisdição exclusiva desses tribunais.

## 12. Relação de Prestador de Serviços {#12-service-provider-relationship}

Na medida em que a Lei de Privacidade do Consumidor da Califórnia, Cal. Civ. Code § 1798.100 et seq ("CCPA") se aplique, as partes reconhecem e concordam que o <strong>Fornecedor</strong> é um prestador de serviços e está recebendo Dados Pessoais do <strong>Cliente</strong> para fornecer o Serviço conforme acordado no <strong>Acordo</strong>, o que constitui uma finalidade comercial. O <strong>Fornecedor</strong> não venderá quaisquer Dados Pessoais fornecidos pelo <strong>Cliente</strong> sob o <strong>Acordo</strong>. Além disso, o <strong>Fornecedor</strong> não reterá, usará ou divulgará quaisquer Dados Pessoais fornecidos pelo <strong>Cliente</strong> sob o <strong>Acordo</strong> exceto conforme necessário para fornecer o Serviço para o <strong>Cliente</strong>, conforme declarado no <strong>Acordo</strong>, ou conforme permitido pelas Leis de Proteção de Dados Aplicáveis. O <strong>Fornecedor</strong> certifica que entende as restrições deste parágrafo.
## 13. Definições {#13-definitions}

1. **"Leis Aplicáveis"** significa as leis, regras, regulamentos, ordens judiciais e outros requisitos vinculativos de uma autoridade governamental relevante que se aplicam ou regem uma parte.

2. **"Leis Aplicáveis de Proteção de Dados"** significa as Leis Aplicáveis que regem como o Serviço pode processar ou usar as informações pessoais, dados pessoais, informações pessoalmente identificáveis ou outro termo similar de um indivíduo.

3. **"Controlador"** terá o(s) significado(s) dado(s) nas Leis Aplicáveis de Proteção de Dados para a empresa que determina a finalidade e a extensão do Processamento de Dados Pessoais.

4. **"Página de Rosto"** significa um documento que é assinado ou aceito eletronicamente pelas partes que incorpora estes Termos Padrão do DPA e identifica <strong>Fornecedor</strong>, <strong>Cliente</strong> e o assunto e detalhes do processamento de dados.

5. **"Dados Pessoais do Cliente"** significa Dados Pessoais que o <strong>Cliente</strong> carrega ou fornece ao <strong>Fornecedor</strong> como parte do Serviço e que são regidos por este DPA.

6. **"DPA"** significa estes Termos Padrão do DPA, a Página de Rosto entre <strong>Fornecedor</strong> e <strong>Cliente</strong>, e as políticas e documentos referenciados ou anexados à Página de Rosto.

7. **"Cláusulas Contratuais Padrão da EEE"** significa as cláusulas contratuais padrão anexadas à Decisão de Execução 2021/914 da Comissão Europeia de 4 de junho de 2021 sobre cláusulas contratuais padrão para a transferência de dados pessoais para países terceiros nos termos do Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho Europeu.

8. **"Espaço Econômico Europeu"** ou **"EEE"** significa os estados membros da União Europeia, Noruega, Islândia e Liechtenstein.

9. **"GDPR"** significa o Regulamento da União Europeia 2016/679 conforme implementado pela legislação local na nação membro relevante do EEE.

10. **"Dados Pessoais"** terá o(s) significado(s) dado(s) nas Leis Aplicáveis de Proteção de Dados para informações pessoais, dados pessoais ou outro termo similar.

11. **"Processamento"** ou **"Processar"** terá o(s) significado(s) dado(s) nas Leis Aplicáveis de Proteção de Dados para qualquer uso de, ou execução de uma operação computacional sobre, Dados Pessoais, incluindo por métodos automáticos.

12. **"Processador"** terá o(s) significado(s) dado(s) nas Leis Aplicáveis de Proteção de Dados para a empresa que Processa Dados Pessoais em nome do Controlador.

13. **"Relatório"** significa relatórios de auditoria preparados por outra empresa de acordo com os padrões definidos na Política de Segurança em nome do Fornecedor.

14. **"Transferência Restrita"** significa (a) onde o GDPR se aplica, uma transferência de dados pessoais do EEE para um país fora do EEE que não está sujeito a uma decisão de adequação pela Comissão Europeia; e (b) onde o GDPR do Reino Unido se aplica, uma transferência de dados pessoais do Reino Unido para qualquer outro país que não esteja sujeito a regulamentos de adequação adotados nos termos da Seção 17A da Lei de Proteção de Dados do Reino Unido de 2018.

15. **"Incidente de Segurança"** significa uma Violação de Dados Pessoais conforme definido no Artigo 4 do GDPR.

16. **"Serviço"** significa o produto e/ou serviços descritos no <strong>Acordo</strong>.

17. **"Dados de Categoria Especial"** terá o significado dado no Artigo 9 do GDPR.

18. **"Subprocessador"** terá o(s) significado(s) dado(s) nas Leis Aplicáveis de Proteção de Dados para uma empresa que, com a aprovação e aceitação do Controlador, auxilia o Processador no Processamento de Dados Pessoais em nome do Controlador.

19. **"GDPR do Reino Unido"** significa o Regulamento da União Europeia 2016/679 conforme implementado pela seção 3 da Lei de Retirada da União Europeia (Withdrawal) do Reino Unido de 2018 no Reino Unido.

20. **"Adendo do Reino Unido"** significa o adendo de transferência internacional de dados às Cláusulas Contratuais Padrão da EEE emitido pelo Comissário de Informação para as Partes que realizam Transferências Restritas nos termos do S119A(1) da Lei de Proteção de Dados de 2018.


## Créditos {#credits}

Este documento é um derivado dos [Termos Padrão do DPA do Common Paper (Versão 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) e está licenciado sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
