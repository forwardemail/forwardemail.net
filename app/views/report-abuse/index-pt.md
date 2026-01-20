# Denunciar abuso {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Índice {#table-of-contents}

* [Isenção de responsabilidade](#disclaimer)
* [Como enviar uma denúncia de abuso](#how-to-submit-an-abuse-report)
* [Para o público em geral](#for-the-general-public)
* [Para aplicação da lei](#for-law-enforcement)
  * [Quais informações estão disponíveis](#what-information-is-available)
  * [Quais informações não estão disponíveis](#what-information-is-not-available)
  * [Autoridades policiais sediadas nos Estados Unidos](#law-enforcement-based-in-the-united-states)
  * [Autoridades policiais sediadas fora dos Estados Unidos](#law-enforcement-based-outside-of-the-united-states)
  * [Solicitações de emergência para aplicação da lei](#law-enforcement-emergency-requests)
  * [Solicitações de aplicação da lei podem gerar notificações de conta](#law-enforcement-requests-may-trigger-account-notices)
  * [Solicitações de aplicação da lei para preservar informações](#law-enforcement-requests-to-preserve-information)
  * [Processo de cumprimento da lei](#law-enforcement-serving-process)

## Isenção de responsabilidade {#disclaimer}

Por favor, consulte nosso [Termos](/terms), pois ele se aplica a todo o site.

## Como enviar uma denúncia de abuso {#how-to-submit-an-abuse-report}

Analisamos relatórios de abuso e atendemos solicitações de informações para [público em geral](#for-the-general-public) e [aplicação da lei](#for-law-enforcement) caso a caso por e-mail.

Relatórios de abuso e solicitações de informações relacionadas a usuários, e-mails, endereços IP e/ou domínios são chamados coletivamente de "Conta" abaixo.

Nosso endereço de e-mail para contato com sua solicitação ou denúncia de abuso é: `abuse@forwardemail.net`

Leia as seções abaixo para obter mais informações que possam ser pertinentes a você.

## Para o público em geral {#for-the-general-public}

<u>**Se você ou outra pessoa estiver em perigo iminente, entre em contato com a polícia e os serviços de emergência imediatamente.**</u>

<u>**Você deve procurar aconselhamento jurídico profissional para recuperar o acesso perdido à sua conta ou para ajudar a deter um agente malicioso.**</u>

Se você for vítima de abuso em uma conta que utiliza nosso serviço, envie-nos sua denúncia por e-mail para o endereço acima. Se sua conta foi invadida por um agente malicioso (por exemplo, seu domínio expirou recentemente e foi registrado novamente por terceiros e, em seguida, usado para abuso), envie-nos um e-mail com uma denúncia para o endereço acima com as informações exatas da sua conta (por exemplo, seu nome de domínio). Podemos ajudar a [proibição de sombra](https://en.wikipedia.org/wiki/Shadow_banning) a conta após a validação da sua titularidade anterior. Observe que não temos autoridade para ajudá-lo a recuperar o acesso à sua conta.

Seu representante legal pode aconselhá-lo a entrar em contato com as autoridades policiais, com o proprietário da sua conta (por exemplo, o registrador do nome de domínio; o site onde você registrou o nome de domínio) e/ou encaminhá-lo para [Página da ICANN sobre domínios perdidos](https://www.icann.org/resources/pages/lost-domain-names).

## Para aplicação da lei {#for-law-enforcement}

Para a maioria das solicitações, nossa capacidade de divulgar informações é regida pelo [Lei de Privacidade das Comunicações Eletrônicas](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipédia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) e seguintes ("ECPA"). O ECPA exige que divulguemos determinadas informações do usuário às autoridades policiais apenas em resposta a tipos específicos de solicitações legais, incluindo intimações, ordens judiciais e mandados de busca.

Se você é membro de uma força policial e busca informações sobre uma Conta, as informações da Conta, bem como a data e o intervalo de tempo, devem ser incluídos em sua solicitação. Não podemos processar solicitações excessivamente amplas e/ou vagas – isso é para proteger os dados e a confiança de nossos usuários e, principalmente, para manter seus dados seguros.

Se sua solicitação nos indicar uma violação do nosso [Termos](/terms), nós a processaremos de acordo com nossas melhores práticas internas para lidar com abusos. Observe que, em alguns casos, isso pode resultar na suspensão e/ou banimento da conta.

**Como não somos um registrador de nomes de domínio**, se você deseja obter informações históricas sobre registros DNS referentes a um nome de domínio, entre em contato com o registrador de nomes de domínio específico correspondente ao domínio. Serviços como [Security Trails]() podem fornecer consultas históricas de registros, mas informações mais específicas e precisas podem ser fornecidas pelo registrador. Para determinar quem é o registrador de nomes de domínio e/ou os proprietários dos servidores de nomes DNS de um domínio, as ferramentas `dig` e `whois` podem ser úteis (por exemplo, `whois example.com` ou `dig example.com ns`). Você pode determinar se uma conta está em um plano pago ou gratuito em nosso serviço realizando uma consulta de registros DNS (por exemplo, `dig example.com mx` e `dig example.com txt`). Se os registros MX não retornarem valores como `mx1.forwardemail.net` e `mx2.forwardemail.net`, o domínio não está usando nosso serviço. Se os registros TXT retornarem um endereço de e-mail em texto simples (por exemplo, `forward-email=user@example.com`), isso indica o endereço de destino do encaminhamento de e-mail para um domínio. Se, em vez disso, retornar um valor como `forward-email-site-verification=XXXXXXXXXX`, isso indica que o domínio está em um plano pago e que a configuração de encaminhamento está armazenada em nosso banco de dados com o ID `whois`0. Para obter mais informações sobre como nosso serviço funciona no nível de DNS, consulte nosso `whois`1.

### Quais informações estão disponíveis {#what-information-is-available}

Consulte nossa seção de Política de Privacidade para [Informações coletadas](/privacy#information-collected). As contas têm permissão para remover suas informações do nosso sistema em conformidade com as leis de privacidade e retenção de dados; consulte nossa seção de Política de Privacidade para [Remoção de informações](/privacy#information-removal). Isso significa que as informações solicitadas podem não estar disponíveis no momento da solicitação devido à exclusão da conta.

### Quais informações não estão disponíveis {#what-information-is-not-available}

Consulte nossa seção Política de Privacidade para [Informações não coletadas](/privacy#information-not-collected).

### Autoridades policiais sediadas nos Estados Unidos {#law-enforcement-based-in-the-united-states}

Com o [exceção de emergências](#law-enforcement-emergency-requests), compartilhamos informações da conta somente após o recebimento de uma intimação válida, ordem judicial ECPA dos EUA e/ou mandado de busca.

Também podemos [notificar uma conta](#law-enforcement-requests-may-trigger-account-notices) sobre uma solicitação de aplicação da lei, a menos que sejamos proibidos de fazê-lo por lei ou ordem judicial.

Se recebermos uma intimação válida, uma ordem judicial da ECPA e/ou um mandado de busca, forneceremos informações relevantes e disponíveis da melhor maneira possível.

### Autoridades policiais sediadas fora dos Estados Unidos {#law-enforcement-based-outside-of-the-united-states}

Exigimos que as solicitações sejam atendidas para autoridades policiais sediadas fora dos Estados Unidos por meio de um dos seguintes meios:

* Um tribunal dos Estados Unidos.
* Uma agência de execução sob os procedimentos de um [Tratado de assistência jurídica mútua dos Estados Unidos](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipédia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Uma ordem de um governo estrangeiro sujeita a um acordo executivo que o Procurador-Geral dos Estados Unidos determinou e certificou ao Congresso satisfaz os requisitos de [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Solicitações de emergência para aplicação da lei {#law-enforcement-emergency-requests}

Conforme permitido por lei nos Estados Unidos (por exemplo, de acordo com [18 USC §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)para%20uma%20entidade%20governamental%2C%20se%20o%20provedor%2C%20de%20boa%20fé%2C%20acreditar%20que%20uma%20emergência%20envolvendo%20perigo%20de%20morte%20ou%20lesão%20física%20grave%20para%20qualquer%20pessoa%20requer%20divulgação%20sem%20atraso%20de%20comunicações%20relacionadas%20à%20emergência%3B%20ou) e [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceções%20para%20Divulgação%20de%20Registros%20de%20Clientes.%E2%80%94Um%20provedor%20descrito%20na%20subseção%20\(a\)%20pode%20divulgar%20um%20registro%20ou%20outras%20informações%20pertencentes%20a%20um%20assinante%20a%20ou%20cliente%20de%20tal%20serviço%20\(não%20incluindo%20o%20conteúdo%20das%20comunicações%20cobertas%20pela%20subseção%20\(a\)\(1\)%20ou%20\(a\)\(2\)\)%E2%80%94)), quando de boa-fé e com verificação independente do solicitante – podemos divulgar e compartilhar informações da conta com autoridades policiais sem intimação, ordem judicial da ECPA e/ou mandado de busca quando acreditarmos que fazê-lo sem demora é necessário para evitar morte ou ferimentos físicos graves.

Exigimos que as solicitações de dados de emergência ("EDR") sejam enviadas por e-mail e incluam todas as informações relevantes para fornecer um processo rápido e oportuno.

Observe que estamos cientes de ataques sofisticados de spoofing, phishing e representação com e-mail (por exemplo, veja [este artigo do The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Nossa política para processamento de EDRs é a seguinte:

1. Pesquise independentemente os metadados do cabeçalho do e-mail (por exemplo, DKIM/SPF/DMARC) (ou a falta deles) para verificação.

2. Empenhar-nos-emos ao máximo para, de boa-fé (com tentativas repetidas, se necessário), contatar o solicitante por telefone de forma independente – a fim de confirmar a autenticidade da solicitação. Por exemplo, podemos pesquisar o site `.gov` relacionado à jurisdição de origem da solicitação e, em seguida, ligar para o escritório a partir do número de telefone oficial listado publicamente para verificar a solicitação.

### Solicitações de autoridades policiais podem gerar notificações de conta {#law-enforcement-requests-may-trigger-account-notices}

Podemos notificar uma Conta e fornecer-lhe uma cópia de uma solicitação de cumprimento da lei referente a ela, a menos que sejamos proibidos por lei ou ordem judicial de fazê-lo (por exemplo, [18 USC 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Nesses casos, se aplicável, podemos notificar uma Conta quando a ordem de confidencialidade expirar.

Se uma solicitação de informações por parte de autoridades policiais for válida, entraremos em contato com o titular da Conta por meio do endereço de e-mail registrado e verificado (por exemplo, em até 7 dias corridos). Se recebermos uma objeção em tempo hábil (por exemplo, em até 7 dias corridos), reteremos o compartilhamento das informações da Conta e daremos continuidade ao processo legal, conforme necessário.

### Solicitações de autoridades policiais para preservação de informações {#law-enforcement-requests-to-preserve-information}

Atenderemos a solicitações válidas de autoridades policiais para preservar informações referentes a uma Conta, de acordo com [18 USC 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Observe que a preservação de dados se restringe apenas ao que for especificamente solicitado e estiver disponível no momento.

### Processo de citação policial {#law-enforcement-serving-process}

Exigimos que todas as solicitações válidas de aplicação da lei nos forneçam um endereço de e-mail válido e funcional com o qual possamos corresponder e fornecer as informações solicitadas eletronicamente.

Todas as solicitações devem ser enviadas para o endereço de e-mail especificado em [Como enviar uma denúncia de abuso](#how-to-submit-an-abuse-report) acima.

Todas as solicitações de autoridades policiais devem ser enviadas em papel timbrado da agência ou departamento (por exemplo, como um anexo em PDF digitalizado), de um endereço de e-mail oficial e relevante, e assinadas.

Se for em relação a um [solicitação de emergência](#law-enforcement-emergency-requests), escreva "Solicitação de emergência policial" no assunto do e-mail.

Observe que pode levar pelo menos duas semanas para que possamos analisar e responder à sua solicitação.