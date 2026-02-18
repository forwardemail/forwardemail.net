# Acordo de Processamento de Dados {#data-processing-agreement}

<!-- v1.0 de <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Índice {#table-of-contents}

* [Termos-chave](#key-terms)
* [Alterações ao Acordo](#changes-to-the-agreement)
* [1. Relacionamentos entre Processador e Subprocessador](#1-processor-and-subprocessor-relationships)
  * [1. Provedor como Processador](#1-provider-as-processor)
  * [2. Provedor como Subprocessador](#2-provider-as-subprocessor)
* [2. Processamento](#2-processing)
  * [1. Detalhes do processamento](#1-processing-details)
  * [2. Instruções de processamento](#2-processing-instructions)
  * [3. Processamento pelo Provedor](#3-processing-by-provider)
  * [4. Processamento do Cliente](#4-customer-processing)
  * [5. Consentimento para Processamento](#5-consent-to-processing)
  * [6. Subprocessadores](#6-subprocessors)
* [3. Transferências Restritas](#3-restricted-transfers)
  * [1. Autorização](#1-authorization)
  * [2. Transferências Ex-EEE](#2-ex-eea-transfers)
  * [3. Transferências Ex-Reino Unido](#3-ex-uk-transfers)
  * [4. Outras Transferências Internacionais](#4-other-international-transfers)
* [4. Resposta a incidentes de segurança](#4-security-incident-response)
* [5. Auditoria e Relatórios](#5-audit--reports)
  * [1. Direitos de Auditoria](#1-audit-rights)
  * [2. Relatórios de segurança](#2-security-reports)
  * [3. Due Diligence de Segurança](#3-security-due-diligence)
* [6. Coordenação e Cooperação](#6-coordination--cooperation)
  * [1. Resposta a perguntas](#1-response-to-inquiries)
  * [2. DPIAs e DTIAs](#2-dpias-and-dtias)
* [7. Exclusão de Dados Pessoais do Cliente](#7-deletion-of-customer-personal-data)
  * [1. Exclusão pelo Cliente](#1-deletion-by-customer)
  * [2. Exclusão na expiração do DPA](#2-deletion-at-dpa-expiration)
* [8. Limitação de responsabilidade](#8-limitation-of-liability)
  * [1. Limites de responsabilidade e isenção de danos](#1-liability-caps-and-damages-waiver)
  * [2. Reivindicações de Partes Relacionadas](#2-related-party-claims)
  * [3. Exceções](#3-exceptions)
* [9. Conflitos entre documentos](#9-conflicts-between-documents)
* [10. Prazo do Contrato](#10-term-of-agreement)
* [11. Lei aplicável e tribunais escolhidos](#11-governing-law-and-chosen-courts)
* [12. Relacionamento com o Provedor de Serviços](#12-service-provider-relationship)
* [13. Definições](#13-definitions)
* [Créditos](#credits)

## Termos-chave {#key-terms}

| Prazo | Valor |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Acordo</strong> | Este DPA complementa o [Terms of Service](/terms) |
| <strong>Subprocessadores Aprovados</strong> | [Cloudflare](https://cloudflare.com) (EUA; provedor de DNS, rede e segurança), [DataPacket](https://www.datapacket.com/) (EUA/Reino Unido; provedor de hospedagem), [Digital Ocean](https://digitalocean.com) (EUA; provedor de hospedagem), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (EUA; provedor de hospedagem), [Stripe](https://stripe.com) (EUA; processador de pagamento), [PayPal](https://paypal.com) (EUA; processador de pagamento) |
| <strong>Contato de segurança do provedor</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Política de Segurança</strong> | Ver [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Estado Governante</strong> | O estado de Delaware, Estados Unidos |

## Alterações no Contrato {#changes-to-the-agreement}

Este documento é um derivado do [Termos Padrão do Common Paper DPA (Versão 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) e as seguintes alterações foram feitas:

1. [Lei aplicável e tribunais escolhidos](#11-governing-law-and-chosen-courts) foi incluído como uma seção abaixo, com `Governing State` identificado acima.
2. [Relacionamento com o Provedor de Serviços](#12-service-provider-relationship) foi incluído como uma seção abaixo.

## 1. Relacionamentos entre Processador e Subprocessador {#1-processor-and-subprocessor-relationships}

### 1. Provedor como Processador {#1-provider-as-processor}

Em situações em que o <strong>Cliente</strong> é um Controlador dos Dados Pessoais do Cliente, o <strong>Provedor</strong> será considerado um Processador que está Processando Dados Pessoais em nome do <strong>Cliente</strong>.

### 2. Provedor como Subprocessador {#2-provider-as-subprocessor}

Em situações em que o <strong>Cliente</strong> for um Processador dos Dados Pessoais do Cliente, o <strong>Provedor</strong> será considerado um Subprocessador dos Dados Pessoais do Cliente.

## 2. Processando {#2-processing}

### 1. Detalhes de processamento {#1-processing-details}

O Anexo I(B) na Página de Capa descreve o assunto, a natureza, a finalidade e a duração deste Processamento, bem como as <strong>Categorias de Dados Pessoais</strong> coletados e as <strong>Categorias de Titulares de Dados</strong>.

### 2. Instruções de processamento {#2-processing-instructions}

O <strong>Cliente</strong> instrui o <strong>Provedor</strong> a Processar Dados Pessoais do Cliente: (a) para fornecer e manter o Serviço; (b) conforme especificado posteriormente por meio do uso do Serviço pelo <strong>Cliente</strong>; (c) conforme documentado no <strong>Contrato</strong>; e (d) conforme documentado em quaisquer outras instruções escritas fornecidas pelo <strong>Cliente</strong> e reconhecidas pelo <strong>Provedor</strong> sobre o Processamento de Dados Pessoais do Cliente sob este DPA. O <strong>Provedor</strong> cumprirá essas instruções, a menos que seja proibido de fazê-lo pelas Leis Aplicáveis. O <strong>Provedor</strong> informará imediatamente o <strong>Cliente</strong> caso não consiga seguir as instruções de Processamento. O <strong>Cliente</strong> deu e dará apenas instruções que estejam em conformidade com as Leis Aplicáveis.

### 3. Processamento pelo Provedor {#3-processing-by-provider}

O <strong>Provedor</strong> processará os Dados Pessoais do Cliente somente de acordo com este DPA, incluindo os detalhes na Página de Rosto. Se o <strong>Provedor</strong> atualizar o Serviço para atualizar produtos, recursos ou funcionalidades existentes ou incluir novos, o <strong>Provedor</strong> poderá alterar as <strong>Categorias de Titulares dos Dados</strong>, <strong>Categorias de Dados Pessoais</strong>, <strong>Dados de Categoria Especial</strong>, <strong>Restrições ou Salvaguardas de Dados de Categoria Especial</strong>, <strong>Frequência de Transferência</strong>, <strong>Natureza e Finalidade do Processamento</strong> e <strong>Duração do Processamento</strong> conforme necessário para refletir as atualizações, notificando o <strong>Cliente</strong> sobre as atualizações e alterações.

### 4. Processamento do cliente {#4-customer-processing}

Quando o <strong>Cliente</strong> for um Processador e o <strong>Provedor</strong> for um Subprocessador, o <strong>Cliente</strong> cumprirá todas as Leis Aplicáveis que se aplicam ao Processamento de Dados Pessoais do Cliente pelo <strong>Cliente</strong>. O contrato do <strong>Cliente</strong> com seu Controlador exigirá, da mesma forma, que o <strong>Cliente</strong> cumpra todas as Leis Aplicáveis que se aplicam ao <strong>Cliente</strong> como Processador. Além disso, o <strong>Cliente</strong> cumprirá os requisitos do Subprocessador previstos no contrato do <strong>Cliente</strong> com seu Controlador.

### 5. Consentimento para processamento {#5-consent-to-processing}

O <strong>Cliente</strong> cumpriu e continuará a cumprir todas as Leis de Proteção de Dados Aplicáveis relativas ao fornecimento de Dados Pessoais do Cliente ao <strong>Provedor</strong> e/ou ao Serviço, incluindo fazer todas as divulgações, obter todos os consentimentos, fornecer escolha adequada e implementar salvaguardas relevantes exigidas pelas Leis de Proteção de Dados Aplicáveis.

### 6. Subprocessadores {#6-subprocessors}

a. O <strong>Provedor</strong> não fornecerá, transferirá ou entregará quaisquer Dados Pessoais do Cliente a um Subprocessador, a menos que o <strong>Cliente</strong> tenha aprovado o Subprocessador. A lista atual de <strong>Subprocessadores Aprovados</strong> inclui as identidades dos Subprocessadores, seus países de localização e suas tarefas de Processamento previstas. O <strong>Provedor</strong> informará o <strong>Cliente</strong> com pelo menos 10 dias úteis de antecedência e por escrito sobre quaisquer alterações pretendidas nos <strong>Subprocessadores Aprovados</strong>, seja por adição ou substituição de um Subprocessador, o que permite que o <strong>Cliente</strong> tenha tempo suficiente para se opor às alterações antes que o <strong>Provedor</strong> comece a usar o(s) novo(s) Subprocessador(es). O <strong>Provedor</strong> fornecerá ao <strong>Cliente</strong> as informações necessárias para permitir que o <strong>Cliente</strong> exerça seu direito de se opor à alteração dos <strong>Subprocessadores Aprovados</strong>. O <strong>Cliente</strong> tem 30 dias após a notificação de uma alteração nos <strong>Subprocessadores Aprovados</strong> para se opor; caso contrário, o <strong>Cliente</strong> será considerado como tendo aceitado as alterações. Caso o <strong>Cliente</strong> se oponha à alteração dentro de 30 dias da notificação, o <strong>Cliente</strong> e o <strong>Provedor</strong> cooperarão de boa-fé para resolver a objeção ou preocupação do <strong>Cliente</strong>.

b. Ao contratar um Subprocessador, o <strong>Provedor</strong> terá um acordo por escrito com o Subprocessador que garante que o Subprocessador somente acesse e use os Dados Pessoais do Cliente (i) na medida necessária para executar as obrigações subcontratadas a ele e (ii) de acordo com os termos do <strong>Contrato</strong>.

c. Se o RGPD se aplicar ao Processamento de Dados Pessoais do Cliente, (i) as obrigações de proteção de dados descritas neste DPA (conforme mencionado no Artigo 28(3) do RGPD, se aplicável) também serão impostas ao Subprocessador, e (ii) o contrato do Provedor com o Subprocessador incorporará essas obrigações, incluindo detalhes sobre como o Provedor e seu Subprocessador se coordenarão para responder a consultas ou solicitações sobre o Processamento de Dados Pessoais do Cliente. Além disso, o Provedor compartilhará, a pedido do Cliente, uma cópia de seus contratos (incluindo quaisquer alterações) com seus Subprocessadores. Na medida necessária para proteger segredos comerciais ou outras informações confidenciais, incluindo dados pessoais, o Provedor poderá redigir o texto de seu contrato com seu Subprocessador antes de compartilhar uma cópia.

d. O <strong>Provedor</strong> permanece totalmente responsável por todas as obrigações subcontratadas aos seus Subprocessadores, incluindo os atos e omissões de seus Subprocessadores no Processamento de Dados Pessoais do Cliente. O <strong>Provedor</strong> notificará o Cliente sobre qualquer falha de seus Subprocessadores em cumprir uma obrigação material sobre Dados Pessoais do Cliente sob o acordo entre o <strong>Provedor</strong> e o Subprocessador.

## 3. Transferências Restritas {#3-restricted-transfers}

### 1. Autorização {#1-authorization}

O <strong>Cliente</strong> concorda que o <strong>Provedor</strong> pode transferir Dados Pessoais do Cliente para fora do EEE, do Reino Unido ou de outro território geográfico relevante, conforme necessário para a prestação do Serviço. Se o <strong>Provedor</strong> transferir Dados Pessoais do Cliente para um território para o qual a Comissão Europeia ou outra autoridade supervisora relevante não tenha emitido uma decisão de adequação, o <strong>Provedor</strong> implementará salvaguardas apropriadas para a transferência de Dados Pessoais do Cliente para esse território, em conformidade com as Leis de Proteção de Dados Aplicáveis.

### 2. Transferências Ex-EEE {#2-ex-eea-transfers}

O <strong>Cliente</strong> e o <strong>Provedor</strong> concordam que, se o GDPR proteger a transferência de Dados Pessoais do Cliente, a transferência será do <strong>Cliente</strong> dentro do EEE para o <strong>Provedor</strong> fora do EEE, e a transferência não for regida por uma decisão de adequação tomada pela Comissão Europeia, então, ao celebrar este DPA, o <strong>Cliente</strong> e o <strong>Provedor</strong> são considerados como tendo assinado as CSCs do EEE e seus Anexos, que são incorporados por referência. Qualquer transferência desse tipo é feita de acordo com as CSCs do EEE, que são preenchidas da seguinte forma:

a. O Módulo Dois (Controlador para Processador) das SCCs do EEE se aplica quando o <strong>Cliente</strong> é um Controlador e o <strong>Provedor</strong> está Processando Dados Pessoais do Cliente para o <strong>Cliente</strong> como um Processador.

b. O Módulo Três (Processador para Subprocessador) das SCCs do EEE se aplica quando o <strong>Cliente</strong> é um Processador e o <strong>Provedor</strong> está Processando Dados Pessoais do Cliente em nome do <strong>Cliente</strong> como um Subprocessador.

c. Para cada módulo, aplica-se o seguinte (quando aplicável):

1. A cláusula de atracação opcional da Cláusula 7 não se aplica;

2. Na Cláusula 9, aplica-se a Opção 2 (autorização geral por escrito), e o prazo mínimo para notificação prévia de alterações do Subprocessador é de 10 dias úteis;

3. Na Cláusula 11, a linguagem opcional não se aplica;

4. Todos os colchetes da Cláusula 13 são removidos;

5. Na Cláusula 17 (Opção 1), as SCC do EEE serão regidas pelas leis do <strong>Estado-Membro Governante</strong>;

6. Na Cláusula 18(b), as disputas serão resolvidas nos tribunais do <strong>Estado-Membro Governante</strong>; e

7. A página de rosto deste DPA contém as informações exigidas no Anexo I, Anexo II e Anexo III das SCCs do EEE.

### 3. Transferências Ex-Reino Unido {#3-ex-uk-transfers}

O <strong>Cliente</strong> e o <strong>Provedor</strong> concordam que, se o GDPR do Reino Unido proteger a transferência de Dados Pessoais do Cliente, a transferência será do <strong>Cliente</strong> de dentro do Reino Unido para o <strong>Provedor</strong> fora do Reino Unido, e a transferência não será regida por uma decisão de adequação tomada pelo Secretário de Estado do Reino Unido. Ao celebrar este DPA, o <strong>Cliente</strong> e o <strong>Provedor</strong> são considerados como tendo assinado o Adendo do Reino Unido e seus Anexos, que são incorporados por referência. Qualquer transferência desse tipo será realizada de acordo com o Adendo do Reino Unido, que é preenchido da seguinte forma:

a. A Seção 3.2 deste DPA contém as informações exigidas na Tabela 2 do Adendo do Reino Unido.

b. A Tabela 4 do Adendo do Reino Unido é modificada da seguinte forma: Nenhuma das partes pode rescindir o Adendo do Reino Unido conforme estabelecido na Seção 19 do Adendo do Reino Unido; na medida em que a ICO emitir um Adendo Aprovado revisado de acordo com a Seção 18 do Adendo do Reino Unido, as partes trabalharão de boa-fé para revisar este DPA adequadamente.

c. A página de rosto contém as informações exigidas pelo Anexo 1A, Anexo 1B, Anexo II e Anexo III do Adendo do Reino Unido.

### 4. Outras Transferências Internacionais {#4-other-international-transfers}

Para transferências de Dados Pessoais em que a lei suíça (e não a lei de qualquer estado-membro do EEE ou do Reino Unido) se aplica à natureza internacional da transferência, as referências ao GDPR na Cláusula 4 das SCCs do EEE são, na medida legalmente exigidas, alteradas para se referir à Lei Federal Suíça de Proteção de Dados ou seu sucessor, e o conceito de autoridade supervisora incluirá o Comissário Federal Suíço de Proteção de Dados e Informações.

## 4. Resposta a incidentes de segurança {#4-security-incident-response}

1. Ao tomar conhecimento de qualquer Incidente de Segurança, o <strong>Provedor</strong> irá: (a) notificar o <strong>Cliente</strong> sem atrasos indevidos quando possível, mas no máximo 72 horas após tomar conhecimento do Incidente de Segurança; (b) fornecer informações oportunas sobre o Incidente de Segurança assim que forem conhecidas ou conforme razoavelmente solicitado pelo <strong>Cliente</strong>; e (c) tomar prontamente medidas razoáveis para conter e investigar o Incidente de Segurança. A notificação ou resposta do <strong>Provedor</strong> a um Incidente de Segurança conforme exigido por este DPA não será interpretada como um reconhecimento pelo <strong>Provedor</strong> de qualquer falha ou responsabilidade pelo Incidente de Segurança.

## 5. Auditoria e Relatórios {#5-audit--reports}

### 1. Direitos de auditoria {#1-audit-rights}

O <strong>Provedor</strong> fornecerá ao <strong>Cliente</strong> todas as informações razoavelmente necessárias para demonstrar sua conformidade com este DPA e permitirá e contribuirá para auditorias, incluindo inspeções pelo <strong>Cliente</strong>, para avaliar a conformidade do <strong>Provedor</strong> com este DPA. No entanto, o <strong>Provedor</strong> poderá restringir o acesso a dados ou informações se o acesso do <strong>Cliente</strong> às informações impactar negativamente seus direitos de propriedade intelectual, obrigações de confidencialidade ou outras obrigações sob as Leis Aplicáveis. O <strong>Cliente</strong> reconhece e concorda que somente exercerá seus direitos de auditoria sob este DPA e quaisquer direitos de auditoria concedidos pelas Leis Aplicáveis de Proteção de Dados instruindo o <strong>Provedor</strong> a cumprir os requisitos de relatórios e due diligence abaixo. O <strong>Provedor</strong> manterá registros de sua conformidade com este DPA por 3 anos após o término do DPA.

### 2. Relatórios de segurança {#2-security-reports}

O <strong>Cliente</strong> reconhece que o <strong>Provedor</strong> é regularmente auditado em relação aos padrões definidos na <strong>Política de Segurança</strong> por auditores terceirizados independentes. Mediante solicitação por escrito, o <strong>Provedor</strong> fornecerá ao <strong>Cliente</strong>, em caráter confidencial, uma cópia resumida de seu Relatório vigente para que o <strong>Cliente</strong> possa verificar a conformidade do <strong>Provedor</strong> com os padrões definidos na <strong>Política de Segurança</strong>.

### 3. Devida diligência de segurança {#3-security-due-diligence}

Além do Relatório, o <strong>Provedor</strong> responderá a solicitações razoáveis de informações feitas pelo <strong>Cliente</strong> para confirmar a conformidade do <strong>Provedor</strong> com este DPA, incluindo respostas a questionários de segurança da informação, due diligence e auditoria, ou fornecendo informações adicionais sobre seu programa de segurança da informação. Todas essas solicitações devem ser feitas por escrito e enviadas ao <strong>Contato de Segurança do Provedor</strong> e podem ser feitas apenas uma vez por ano.

## 6. Coordenação e Cooperação {#6-coordination--cooperation}

### 1. Resposta a perguntas {#1-response-to-inquiries}

Caso o <strong>Provedor</strong> receba qualquer consulta ou solicitação de qualquer outra pessoa sobre o Processamento de Dados Pessoais do Cliente, o <strong>Provedor</strong> notificará o <strong>Cliente</strong> sobre a solicitação e não responderá à solicitação sem o consentimento prévio do <strong>Cliente</strong>. Exemplos desses tipos de consultas e solicitações incluem uma ordem judicial, administrativa ou de agência reguladora sobre Dados Pessoais do Cliente, quando a notificação ao <strong>Cliente</strong> não for proibida pela Legislação Aplicável, ou uma solicitação de um titular dos dados. Se permitido pela Legislação Aplicável, o <strong>Provedor</strong> seguirá as instruções razoáveis do <strong>Cliente</strong> sobre essas solicitações, incluindo o fornecimento de atualizações de status e outras informações razoavelmente solicitadas pelo <strong>Cliente</strong>. Se um titular de dados fizer uma solicitação válida sob as Leis de Proteção de Dados Aplicáveis para excluir ou optar por não permitir que o Cliente forneça Dados Pessoais do Cliente ao Provedor, o Provedor auxiliará o Cliente a atender à solicitação de acordo com a Lei de Proteção de Dados Aplicável. O Provedor cooperará e fornecerá assistência razoável ao Cliente, às custas do Cliente, em qualquer resposta legal ou outra ação processual tomada pelo Cliente em resposta a uma solicitação de terceiros sobre o Processamento de Dados Pessoais do Cliente pelo Provedor sob este DPA.

### 2. DPIAs e DTIAs {#2-dpias-and-dtias}

Se exigido pelas Leis de Proteção de Dados Aplicáveis, o <strong>Provedor</strong> auxiliará razoavelmente o <strong>Cliente</strong> na condução de quaisquer avaliações de impacto de proteção de dados obrigatórias ou avaliações de impacto de transferência de dados e consultas com autoridades de proteção de dados relevantes, levando em consideração a natureza do Processamento e dos Dados Pessoais do Cliente.

## 7. Exclusão de Dados Pessoais do Cliente {#7-deletion-of-customer-personal-data}

### 1. Exclusão pelo cliente {#1-deletion-by-customer}

O <strong>Provedor</strong> permitirá que o <strong>Cliente</strong> exclua os Dados Pessoais do Cliente de maneira consistente com a funcionalidade dos Serviços. O <strong>Provedor</strong> cumprirá esta instrução o mais rápido possível, exceto quando o armazenamento adicional dos Dados Pessoais do Cliente for exigido pela Lei Aplicável.

### 2. Exclusão na expiração do DPA {#2-deletion-at-dpa-expiration}

a. Após o término do DPA, o <strong>Provedor</strong> devolverá ou excluirá os Dados Pessoais do Cliente conforme as instruções do <strong>Cliente</strong>, a menos que o armazenamento adicional dos Dados Pessoais do Cliente seja exigido ou autorizado pela Legislação Aplicável. Se a devolução ou destruição for impraticável ou proibida pela Legislação Aplicável, o <strong>Provedor</strong> envidará esforços razoáveis para impedir o Processamento adicional dos Dados Pessoais do Cliente e continuará a proteger os Dados Pessoais do Cliente que permanecerem em sua posse, custódia ou controle. Por exemplo, a Legislação Aplicável pode exigir que o <strong>Provedor</strong> continue hospedando ou Processando os Dados Pessoais do Cliente.

b. Se o <strong>Cliente</strong> e o <strong>Provedor</strong> tiverem firmado as SCCs do EEE ou o Adendo do Reino Unido como parte deste DPA, o <strong>Provedor</strong> somente fornecerá ao <strong>Cliente</strong> a certificação de exclusão de Dados Pessoais descrita na Cláusula 8.1(d) e na Cláusula 8.5 das SCCs do EEE se o <strong>Cliente</strong> solicitar uma.

## 8. Limitação de responsabilidade {#8-limitation-of-liability}

### 1. Limites de responsabilidade e isenção de danos {#1-liability-caps-and-damages-waiver}

**Na extensão máxima permitida pelas Leis de Proteção de Dados Aplicáveis, a responsabilidade cumulativa total de cada parte para com a outra parte decorrente ou relacionada a este DPA estará sujeita às renúncias, exclusões e limitações de responsabilidade declaradas no <strong>Contrato</strong>.**

### 2. Reivindicações de Partes Relacionadas {#2-related-party-claims}

**Quaisquer reclamações feitas contra o <strong>Provedor</strong> ou suas Afiliadas decorrentes ou relacionadas a este DPA só podem ser apresentadas pela entidade <strong>Cliente</strong> que é parte do <strong>Contrato</strong>.**

### 3. Exceções {#3-exceptions}

1. Este DPA não limita qualquer responsabilidade a um indivíduo sobre os seus direitos de proteção de dados sob as Leis de Proteção de Dados Aplicáveis. Além disso, este DPA não limita qualquer responsabilidade entre as partes por violações das SCCs do EEE ou do Adendo do Reino Unido.

## 9. Conflitos entre documentos {#9-conflicts-between-documents}

1. Este DPA faz parte e complementa o Contrato. Em caso de inconsistência entre este DPA, o <strong>Contrato</strong> ou qualquer uma de suas partes, a parte listada anteriormente prevalecerá sobre a parte listada posteriormente para essa inconsistência: (1) as SCCs do EEE ou o Adendo do Reino Unido, (2) este DPA e, em seguida, (3) o <strong>Contrato</strong>.

## 10. Prazo do Contrato {#10-term-of-agreement}

Este DPA entrará em vigor quando o <strong>Provedor</strong> e o <strong>Cliente</strong> concordarem com uma Página de Rosto para o DPA e assinarem ou aceitarem eletronicamente o <strong>Contrato</strong>, e continuará em vigor até que o <strong>Contrato</strong> expire ou seja rescindido. No entanto, o <strong>Provedor</strong> e o <strong>Cliente</strong> permanecerão sujeitos às obrigações deste DPA e às Leis de Proteção de Dados Aplicáveis até que o <strong>Cliente</strong> interrompa a transferência de Dados Pessoais do Cliente para o <strong>Provedor</strong> e o <strong>Provedor</strong> interrompa o Processamento de Dados Pessoais do Cliente.

## 11. Lei aplicável e tribunais escolhidos {#11-governing-law-and-chosen-courts}

Não obstante a lei aplicável ou cláusulas semelhantes do <strong>Contrato</strong>, todas as interpretações e disputas sobre este DPA serão regidas pelas leis do <strong>Estado Regente</strong>, independentemente de suas disposições sobre conflito de leis. Além disso, e não obstante a seleção de foro, jurisdição ou cláusulas semelhantes do <strong>Contrato</strong>, as partes concordam em ajuizar qualquer ação, processo ou procedimento judicial relativo a este DPA, e cada parte se submete irrevogavelmente à jurisdição exclusiva dos tribunais do <strong>Estado Regente</strong>.

## 12. Relacionamento com o provedor de serviços {#12-service-provider-relationship}

Na medida em que a Lei de Privacidade do Consumidor da Califórnia, Código Civil da Califórnia § 1798.100 et seq ("CCPA") se aplica, as partes reconhecem e concordam que o <strong>Provedor</strong> é um provedor de serviços e está recebendo Dados Pessoais do <strong>Cliente</strong> para fornecer o Serviço conforme acordado no <strong>Contrato</strong>, o que constitui uma finalidade comercial. O <strong>Provedor</strong> não venderá nenhum Dado Pessoal fornecido pelo <strong>Cliente</strong> sob o <strong>Contrato</strong>. Além disso, o <strong>Provedor</strong> não reterá, usará ou divulgará nenhum Dado Pessoal fornecido pelo <strong>Cliente</strong> sob o <strong>Contrato</strong>, exceto conforme necessário para fornecer o Serviço ao <strong>Cliente</strong>, conforme declarado no <strong>Contrato</strong> ou conforme permitido pelas Leis de Proteção de Dados Aplicáveis. O <strong>Provedor</strong> certifica que entende as restrições deste parágrafo.

## 13. Definições {#13-definitions}

1. **"Leis Aplicáveis"** significa as leis, regras, regulamentos, ordens judiciais e outros requisitos vinculativos de uma autoridade governamental relevante que se aplicam ou regem uma parte.

2. **"Leis de Proteção de Dados Aplicáveis"** significa as Leis Aplicáveis que regem como o Serviço pode processar ou usar informações pessoais de um indivíduo, dados pessoais, informações de identificação pessoal ou outros termos semelhantes.

3. **"Controlador"** terá o(s) significado(s) dado(s) nas Leis de Proteção de Dados Aplicáveis para a empresa que determina a finalidade e a extensão do Processamento de Dados Pessoais.

4. **"Página de Rosto"** significa um documento assinado ou aceito eletronicamente pelas partes que incorpora estes Termos Padrão do DPA e identifica o <strong>Provedor</strong>, o <strong>Cliente</strong> e o assunto e os detalhes do processamento de dados.

5. **"Dados Pessoais do Cliente"** significa Dados Pessoais que o <strong>Cliente</strong> carrega ou fornece ao <strong>Provedor</strong> como parte do Serviço e que são regidos por este DPA.

6. **"DPA"** significa estes Termos Padrão do DPA, a Página de Rosto entre o <strong>Provedor</strong> e o <strong>Cliente</strong>, e as políticas e documentos referenciados ou anexados à Página de Rosto.

7. **"SCCs do EEE"** significa as cláusulas contratuais padrão anexadas à Decisão de Implementação 2021/914 da Comissão Europeia, de 4 de junho de 2021, sobre cláusulas contratuais padrão para a transferência de dados pessoais para países terceiros, nos termos do Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho Europeu.

8. **"Espaço Econômico Europeu"** ou **"EEE"** significa os estados-membros da União Europeia, Noruega, Islândia e Liechtenstein.

9. **"GDPR"** significa o Regulamento da União Europeia 2016/679, conforme implementado pela legislação local no país membro do EEE relevante.

10. **"Dados Pessoais"** terão o(s) significado(s) dado(s) nas Leis de Proteção de Dados Aplicáveis para informações pessoais, dados pessoais ou outro termo similar.

11. **"Processamento"** ou **"Processo"** terão o(s) significado(s) dado(s) nas Leis de Proteção de Dados Aplicáveis para qualquer uso ou execução de uma operação de computador em Dados Pessoais, inclusive por métodos automáticos.

12. **"Processador"** terá o(s) significado(s) dado(s) nas Leis de Proteção de Dados Aplicáveis para a empresa que Processa Dados Pessoais em nome do Controlador.

13. **"Relatório"** significa relatórios de auditoria preparados por outra empresa de acordo com os padrões definidos na Política de Segurança em nome do Provedor.

14. **"Transferência Restrita"** significa (a) onde o GDPR se aplica, uma transferência de dados pessoais do EEE para um país fora do EEE que não está sujeito a uma determinação de adequação pela Comissão Europeia; e (b) onde o GDPR do Reino Unido se aplica, uma transferência de dados pessoais do Reino Unido para qualquer outro país que não esteja sujeito a regulamentações de adequação adotadas de acordo com a Seção 17A da Lei de Proteção de Dados do Reino Unido de 2018.

15. **"Incidente de Segurança"** significa uma Violação de Dados Pessoais, conforme definido no Artigo 4 do GDPR.

16. **"Serviço"** significa o produto e/ou serviços descritos no <strong>Contrato</strong>.

17. **"Dados de Categoria Especial"** terão o significado dado no Artigo 9 do GDPR.

18. **"Subprocessador"** terá o(s) significado(s) dado(s) nas Leis de Proteção de Dados Aplicáveis para uma empresa que, com a aprovação e aceitação do Controlador, auxilia o Processador no Processamento de Dados Pessoais em nome do Controlador.

19. **"UK GDPR"** significa o Regulamento da União Europeia 2016/679, conforme implementado pela seção 3 da Lei de Retirada da União Europeia de 2018 do Reino Unido no Reino Unido.

20. **"Adendo do Reino Unido"** significa o adendo de transferência internacional de dados às SCCs do EEE emitido pelo Comissário de Informações para Partes que realizam Transferências Restritas sob S119A(1) da Lei de Proteção de Dados de 2018.

## Créditos {#credits}

Este documento é um derivado do [Termos Padrão do Common Paper DPA (Versão 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) e é licenciado sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).