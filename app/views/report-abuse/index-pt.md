# Denunciar Abuso {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Denunciar abuso e spam para Forward Email" class="rounded-lg" />


## Índice {#table-of-contents}

* [Aviso Legal](#disclaimer)
* [Como enviar um relatório de abuso](#how-to-submit-an-abuse-report)
* [Para o público em geral](#for-the-general-public)
* [Para as autoridades policiais](#for-law-enforcement)
  * [Quais informações estão disponíveis](#what-information-is-available)
  * [Quais informações não estão disponíveis](#what-information-is-not-available)
  * [Autoridades policiais baseadas nos Estados Unidos](#law-enforcement-based-in-the-united-states)
  * [Autoridades policiais baseadas fora dos Estados Unidos](#law-enforcement-based-outside-of-the-united-states)
  * [Pedidos de emergência das autoridades policiais](#law-enforcement-emergency-requests)
  * [Pedidos das autoridades policiais podem gerar notificações de conta](#law-enforcement-requests-may-trigger-account-notices)
  * [Pedidos das autoridades policiais para preservar informações](#law-enforcement-requests-to-preserve-information)
  * [Cumprimento de mandados pelas autoridades policiais](#law-enforcement-serving-process)


## Aviso Legal {#disclaimer}

Por favor, consulte nossos [Termos](/terms) conforme aplicável em todo o site.


## Como enviar um relatório de abuso {#how-to-submit-an-abuse-report}

Analisamos relatórios de abuso e atendemos solicitações de informações para o [público em geral](#for-the-general-public) e para as [autoridades policiais](#for-law-enforcement) caso a caso por e-mail.

Relatórios de abuso e solicitações de informações referentes a usuários, e-mails, endereços IP e/ou domínios são referidos coletivamente como "Conta" abaixo.

Nossos endereços de e-mail para contato com sua solicitação ou relatório sobre abuso são: `support@forwardemail.net`, `abuse@forwardemail.net` e `security@forwardemail.net`.

Por favor, envie uma cópia para todos esses endereços de e-mail, se possível, e também envie e-mails de lembrete caso não respondamos dentro de 24-48+ horas.

Leia as seções abaixo para mais informações que podem ser relevantes para você.


## Para o público em geral {#for-the-general-public}

<u>**Se você ou outra pessoa estiver em perigo iminente, entre em contato com a polícia e os serviços de emergência imediatamente.**</u>

<u>**Você deve buscar aconselhamento jurídico profissional para recuperar o acesso perdido à sua Conta ou para ajudar a impedir um agente malicioso.**</u>

Se você for vítima de abuso de uma Conta que está usando nosso serviço, envie seu relatório por e-mail para o endereço acima. Se sua Conta foi tomada por um agente malicioso (por exemplo, seu domínio expirou recentemente e foi re-registrado por um terceiro e então usado para abuso), envie um relatório para o endereço acima com as informações exatas da sua Conta (por exemplo, o nome do seu domínio). Podemos ajudar a [banir em sombra](https://en.wikipedia.org/wiki/Shadow_banning) a Conta após validação da sua propriedade anterior. Note que não temos autoridade para ajudar você a recuperar o acesso à sua Conta.

Seu representante legal pode aconselhá-lo a contatar as autoridades policiais, o proprietário da sua Conta (por exemplo, o registrador do nome de domínio; o site onde você registrou o nome de domínio) e/ou encaminhá-lo para a [página da ICANN sobre domínios perdidos](https://www.icann.org/resources/pages/lost-domain-names).


## Para as autoridades policiais {#for-law-enforcement}

Para a maioria das solicitações, nossa capacidade de divulgar informações é regida pelo [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), et seq. ("ECPA"). A ECPA determina que só divulgamos certas informações de usuários às autoridades policiais em resposta a tipos específicos de solicitações legais, incluindo intimações, ordens judiciais e mandados de busca.

Se você é um membro das autoridades policiais e está buscando informações sobre uma Conta, as informações da Conta, bem como o intervalo de data e hora, devem ser incluídas em sua solicitação. Não podemos processar solicitações excessivamente amplas e/ou vagas – isso é para proteger os dados e a confiança dos nossos usuários e, mais importante, para manter seus dados seguros.
Se sua solicitação indicar para nós uma violação dos nossos [Termos](/terms), então a processaremos de acordo com nossas melhores práticas internas exclusivas para lidar com abusos – observe que, em alguns casos, isso pode resultar na suspensão e/ou banimento da Conta.

**Como não somos um registrador de nomes de domínio**, se desejar buscar informações históricas de registros DNS sobre um nome de domínio, deve contatar o registrador específico do nome de domínio correspondente ao domínio. Serviços como [Security Trails]() podem fornecer consulta de registros históricos, mas informações mais específicas e precisas podem ser fornecidas pelo registrador. Para determinar quem são o registrador do nome de domínio e/ou os proprietários dos servidores de nomes DNS de um domínio, as ferramentas `dig` e `whois` podem ser úteis (por exemplo, `whois example.com` ou `dig example.com ns`). Você pode determinar se uma Conta está em um plano pago ou gratuito em nosso serviço realizando uma consulta de registro DNS (por exemplo, `dig example.com mx` e `dig example.com txt`). Se os registros MX não retornarem valores como `mx1.forwardemail.net` e `mx2.forwardemail.net`, então o domínio não está usando nosso serviço. Se os registros TXT retornarem um endereço de e-mail em texto simples (por exemplo, `forward-email=user@example.com`), isso indica o destino do endereço de encaminhamento de e-mail para um domínio. Se, em vez disso, retornar um valor como `forward-email-site-verification=XXXXXXXXXX`, isso indica que está em um plano pago e a configuração de encaminhamento está armazenada em nosso banco de dados sob o ID `XXXXXXXXXX`. Para mais informações sobre como nosso serviço funciona no nível DNS, consulte nossa [FAQ](/faq).

### Que informações estão disponíveis {#what-information-is-available}

Consulte a seção da nossa Política de Privacidade sobre [Informações Coletadas](/privacy#information-collected). As Contas têm permissão para remover suas informações do nosso sistema em conformidade com as leis de retenção de dados e privacidade; consulte a seção da nossa Política de Privacidade sobre [Remoção de Informações](/privacy#information-removal). Isso significa que as informações solicitadas podem não estar disponíveis no momento da solicitação devido à exclusão da Conta.

### Que informações não estão disponíveis {#what-information-is-not-available}

Consulte a seção da nossa Política de Privacidade sobre [Informações Não Coletadas](/privacy#information-not-collected).

### Autoridades policiais baseadas nos Estados Unidos {#law-enforcement-based-in-the-united-states}

Com a [exceção de emergências](#law-enforcement-emergency-requests), compartilhamos informações da Conta somente mediante recebimento de intimação válida, ordem judicial ECPA dos EUA e/ou mandado de busca.

Podemos adicionalmente [notificar uma Conta](#law-enforcement-requests-may-trigger-account-notices) sobre uma solicitação das autoridades policiais, a menos que sejamos proibidos por lei ou ordem judicial.

Se recebermos uma intimação válida, ordem judicial ECPA e/ou mandado de busca, forneceremos as informações relevantes e disponíveis da melhor forma possível.

### Autoridades policiais baseadas fora dos Estados Unidos {#law-enforcement-based-outside-of-the-united-states}

Exigimos que as solicitações sejam entregues para autoridades policiais baseadas fora dos Estados Unidos por meio de uma das seguintes formas:

* Um tribunal dos Estados Unidos.
* Uma agência de aplicação da lei sob os procedimentos de um [tratado de assistência jurídica mútua dos Estados Unidos](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Uma ordem de um governo estrangeiro que esteja sujeita a um acordo executivo que o Procurador-Geral dos Estados Unidos tenha determinado e certificado ao Congresso que satisfaz os requisitos de [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Solicitações de emergência das autoridades policiais {#law-enforcement-emergency-requests}

Conforme permitido pela lei nos Estados Unidos (por exemplo, de acordo com [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) e [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), quando de boa-fé e com verificação independente do solicitante – podemos divulgar e compartilhar informações da Conta com as autoridades policiais sem intimação, ordem judicial ECPA e/ou mandado de busca quando acreditarmos que fazê-lo sem demora é necessário para prevenir morte ou lesão física grave.
Exigimos que solicitações de dados de emergência ("EDR") sejam enviadas por e-mail e incluam todas as informações relevantes para fornecer um processo ágil e expedito.

Observe que estamos cientes de ataques sofisticados de falsificação, phishing e personificação por e-mail (por exemplo, veja [este artigo do The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Nossa política para o processamento de EDRs é a seguinte:

1. Pesquisar independentemente os metadados do cabeçalho do e-mail (por exemplo, DKIM/SPF/DMARC) (ou a ausência deles) para verificação.

2. Fazer nossa melhor tentativa de boa-fé (com tentativas repetidas, se necessário) para contatar independentemente por telefone o solicitante – a fim de confirmar a autenticidade da solicitação. Por exemplo, podemos pesquisar o site `.gov` relacionado à jurisdição de onde vem a solicitação e então ligar para o escritório pelo número de telefone oficial listado publicamente para verificar a solicitação.

### Solicitações de autoridades podem gerar notificações de conta {#law-enforcement-requests-may-trigger-account-notices}

Podemos notificar uma Conta e fornecer a ela uma cópia de uma solicitação de autoridade relacionada, a menos que sejamos proibidos por lei ou ordem judicial de fazê-lo (por exemplo, [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Nesses casos, se aplicável, podemos notificar uma Conta quando a ordem de não divulgação expirar.

Se uma solicitação de informações por autoridade for válida, então iremos [preservar as informações necessárias e solicitadas da Conta](#law-enforcement-requests-to-preserve-information) e fazer um esforço razoável para contatar o proprietário da Conta pelo seu endereço de e-mail registrado e verificado (por exemplo, dentro de 7 dias corridos). Se recebermos uma objeção em tempo hábil (por exemplo, dentro de 7 dias corridos), então reteremos o compartilhamento das informações da Conta e continuaremos o processo legal conforme necessário.

### Solicitações de autoridades para preservação de informações {#law-enforcement-requests-to-preserve-information}

Honraremos solicitações válidas de autoridades para preservar informações relativas a uma Conta conforme [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Note que a preservação dos dados é restrita apenas ao que for especificamente solicitado e atualmente disponível.

### Cumprimento de mandados por autoridades {#law-enforcement-serving-process}

Exigimos que todas as solicitações válidas de autoridades nos forneçam um endereço de e-mail válido e funcional para que possamos corresponder e fornecer as informações solicitadas eletronicamente.

Todas as solicitações devem ser enviadas para o endereço de e-mail especificado em [Como enviar uma denúncia de abuso](#how-to-submit-an-abuse-report) acima.

Todas as solicitações de autoridades devem ser enviadas em papel timbrado da agência ou departamento (por exemplo, como anexo PDF escaneado), de um endereço de e-mail oficial e relevante, e assinadas.

Se for referente a uma [solicitação de emergência](#law-enforcement-emergency-requests), por favor escreva "Solicitação de emergência de autoridade" no cabeçalho Assunto do e-mail.

Por favor, note que pode levar pelo menos duas semanas para que possamos revisar e responder à sua solicitação.
