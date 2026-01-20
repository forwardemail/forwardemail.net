# Reportar abuso {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Descargo de responsabilidad](#disclaimer)
* [Cómo presentar un informe de abuso](#how-to-submit-an-abuse-report)
* [Para el público en general](#for-the-general-public)
* [Para las fuerzas del orden](#for-law-enforcement)
  * [¿Qué información está disponible?](#what-information-is-available)
  * [¿Qué información no está disponible?](#what-information-is-not-available)
  * [Fuerzas del orden con sede en Estados Unidos](#law-enforcement-based-in-the-united-states)
  * [Fuerzas del orden con sede fuera de los Estados Unidos](#law-enforcement-based-outside-of-the-united-states)
  * [Solicitudes de emergencia de las fuerzas del orden](#law-enforcement-emergency-requests)
  * [Las solicitudes de las autoridades competentes pueden generar notificaciones de cuenta](#law-enforcement-requests-may-trigger-account-notices)
  * [Las autoridades policiales solicitan preservar la información](#law-enforcement-requests-to-preserve-information)
  * [Proceso de notificación a las fuerzas del orden](#law-enforcement-serving-process)

## Descargo de responsabilidad {#disclaimer}

Por favor, consulte nuestro [Términos](/terms) ya que se aplica a todo el sitio.

## Cómo enviar un informe de abuso {#how-to-submit-an-abuse-report}

Revisamos los informes de abuso y atendemos solicitudes de información para [público general](#for-the-general-public) y [aplicación de la ley](#for-law-enforcement) caso por caso por correo electrónico.

Los informes de abuso y las solicitudes de información con respecto a usuarios, correos electrónicos, direcciones IP y/o dominios se denominan colectivamente como una "Cuenta" a continuación.

Nuestra dirección de correo electrónico para contactarnos con su solicitud o reporte de abuso es: `abuse@forwardemail.net`

Lea las secciones a continuación para obtener más información que pueda ser de su interés.

## Para el público en general {#for-the-general-public}

**Si usted o alguien más está en peligro inminente, comuníquese con la policía y los servicios de emergencia de inmediato.**</u>

<u>**Debe buscar asesoramiento legal profesional para recuperar el acceso perdido a su cuenta o para ayudar a detener a un actor malicioso.**</u>

Si sufre un abuso en una cuenta que utiliza nuestro servicio, envíenos su informe por correo electrónico a la dirección indicada anteriormente. Si un agente malicioso se apropió de su cuenta (por ejemplo, si su dominio expiró recientemente y fue registrado nuevamente por un tercero y utilizado para cometer abusos), envíenos un informe por correo electrónico a la dirección indicada anteriormente con la información exacta de su cuenta (por ejemplo, su nombre de dominio). Podemos ayudarle a recuperar el acceso a su cuenta tras validar su titularidad anterior. Tenga en cuenta que no tenemos la autoridad para ayudarle a recuperar el acceso a su cuenta.

Su representante legal puede aconsejarle que se comunique con la policía, con el propietario de su cuenta (por ejemplo, el registrador del nombre de dominio; el sitio web donde registró el nombre de dominio) y/o derivarlo a [Página de la ICANN sobre dominios perdidos](https://www.icann.org/resources/pages/lost-domain-names).

## Para las fuerzas del orden {#for-law-enforcement}

Para la mayoría de las solicitudes, nuestra capacidad para divulgar información se rige por la [Ley de Privacidad de las Comunicaciones Electrónicas](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), etc. ("ECPA"). La ECPA exige que divulguemos cierta información del usuario a las fuerzas del orden únicamente en respuesta a solicitudes legales específicas, como citaciones, órdenes judiciales y órdenes de registro.

Si usted es miembro de las fuerzas del orden y busca información sobre una cuenta, debe incluir en su solicitud la información de la cuenta, así como la fecha y el rango de horas. No podemos procesar solicitudes demasiado generales o imprecisas; esto es para proteger los datos y la confianza de nuestros usuarios, y sobre todo, para mantener sus datos seguros.

Si su solicitud nos indica una violación de nuestro [Términos](/terms), la procesaremos de acuerdo con nuestras mejores prácticas internas para manejar el abuso; tenga en cuenta que, en algunos casos, esto puede resultar en la suspensión y/o prohibición de la cuenta.

**Dado que no somos un registrador de nombres de dominio**, si desea consultar información histórica de registros DNS de un nombre de dominio, debe contactar con el registrador correspondiente. Servicios como [Security Trails]() pueden ofrecer búsquedas de registros históricos, pero el registrador podría proporcionar información más específica y precisa. Para determinar quiénes son los propietarios del registrador o de los servidores DNS de un dominio, las herramientas `dig` y `whois` pueden ser útiles (p. ej., `whois example.com` o `dig example.com ns`). Puede determinar si una cuenta tiene un plan de pago o gratuito en nuestro servicio realizando una búsqueda de registros DNS (p. ej., `dig example.com mx` y `dig example.com txt`). Si los registros MX no devuelven valores como `mx1.forwardemail.net` y `mx2.forwardemail.net`, el dominio no utiliza nuestro servicio. Si los registros TXT devuelven una dirección de correo electrónico en texto plano (p. ej., `forward-email=user@example.com`), esto indica la dirección de reenvío de correo electrónico de destino de un dominio. Si, en cambio, devuelve un valor como `forward-email-site-verification=XXXXXXXXXX`, indica que se trata de un plan de pago y que la configuración de reenvío se almacena en nuestra base de datos con el ID `whois`0. Para obtener más información sobre el funcionamiento de nuestro servicio a nivel de DNS, consulte `whois`1.

### ¿Qué información está disponible? {#what-information-is-available}

Consulte nuestra Política de Privacidad para [Información recopilada](/privacy#information-collected). Las cuentas pueden eliminar su información de nuestro sistema de acuerdo con las leyes de retención de datos y privacidad; consulte nuestra Política de Privacidad para [Eliminación de información](/privacy#information-removal). Esto significa que la información solicitada podría no estar disponible al momento de la solicitud debido a la eliminación de la cuenta.

### ¿Qué información no está disponible? {#what-information-is-not-available}

Por favor consulte nuestra sección de Política de privacidad para [Información no recopilada](/privacy#information-not-collected).

### Fuerzas del orden con sede en los Estados Unidos {#law-enforcement-based-in-the-united-states}

Con [excepción de emergencias](#law-enforcement-emergency-requests), compartimos información de la cuenta solo después de recibir una citación válida, una orden judicial ECPA de EE. UU. y/o una orden de allanamiento.

También podemos [notificar una cuenta](#law-enforcement-requests-may-trigger-account-notices) sobre una solicitud de cumplimiento de la ley, a menos que la ley o una orden judicial nos prohíban hacerlo.

Si recibimos una citación válida, una orden judicial ECPA y/o una orden de allanamiento, brindaremos la información relevante y disponible lo mejor que podamos.

### Fuerzas del orden con sede fuera de los Estados Unidos {#law-enforcement-based-outside-of-the-united-states}

Requerimos que las solicitudes se entreguen a las fuerzas del orden con sede fuera de los Estados Unidos a través de uno de los siguientes medios:

* Un tribunal de los Estados Unidos.
* Una agencia de cumplimiento de la ley bajo los procedimientos de un [Tratado de asistencia jurídica mutua de los Estados Unidos](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Una orden de un gobierno extranjero sujeta a un acuerdo ejecutivo que el Fiscal General de los Estados Unidos ha determinado y certificado ante el Congreso que cumple con los requisitos de [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Solicitudes de emergencia de las fuerzas del orden {#law-enforcement-emergency-requests}

Según lo permita la ley en los Estados Unidos (por ejemplo, de acuerdo con [Título 18 del Código de los Estados Unidos, artículo 2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)a%20una%20entidad%20gubernamental%2C%20si%20el%20proveedor%2C%20de%20buena%20fe%2C%20cree%20que%20una%20emergencia%20que%20involucra%20peligro%20de%20muerte%20o%20lesiones%20físicas%20graves%20a%20cualquier%20persona%20requiere%20la%20divulgación%20sin%20demora%20de%20las%20comunicaciones%20relacionadas%20con%20la%20emergencia%3B%20o) y [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Excepciones%20para%20la%20divulgación%20de%20registros%20del%20cliente.%E2%80%94Un%20proveedor%20descrito%20en%20la%20subsección%20\(a\)%20puede%20divulgar%20un%20registro%20u%20otra%20información%20pertinente%20a%20un%20suscriptor%20o%20cliente%20de%20dicho%20servicio%20\(sin%20incluido%20el%20contenido%20de%20comunicaciones%20cubiertas%20por%20la%20subsección%20\(a\)\(1\)%20o%20\(a\)\(2\)\)%E2%80%94)), cuando actúe de buena fe y con verificación independiente de el solicitante: podemos divulgar y compartir información de la Cuenta con las autoridades policiales sin una citación, una orden judicial de la ECPA y/o una orden de allanamiento cuando creamos que hacerlo sin demora es necesario para prevenir la muerte o lesiones físicas graves.

Requerimos que las solicitudes de datos de emergencia ("EDR") se envíen por correo electrónico e incluyan toda la información relevante para brindar un proceso oportuno y rápido.

Tenga en cuenta que tenemos conocimiento de sofisticados ataques de suplantación de identidad, phishing y suplantación de identidad mediante correo electrónico (por ejemplo, consulte [Este artículo de The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Nuestra política para el procesamiento de EDR es la siguiente:

1. Investigue de forma independiente los metadatos del encabezado del correo electrónico (por ejemplo, DKIM/SPF/DMARC) (o la falta de ellos) para su verificación.

2. Haremos todo lo posible, de buena fe (con repetidos intentos si es necesario), para contactar telefónicamente al solicitante de forma independiente para confirmar la autenticidad de la solicitud. Por ejemplo, podemos consultar el sitio web `.gov` de la jurisdicción de la que proviene la solicitud y luego llamar a la oficina desde su número de teléfono oficial público para verificar la solicitud.

### Las solicitudes de las autoridades pueden activar avisos de cuenta {#law-enforcement-requests-may-trigger-account-notices}

Podemos notificar a una Cuenta y proporcionarle una copia de la solicitud de las autoridades competentes, a menos que la ley o una orden judicial nos lo prohíban (p. ej., [Título 18 del Código de los Estados Unidos, artículo 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). En esos casos, si corresponde, podremos notificar a la Cuenta cuando la orden de confidencialidad haya expirado.

Si una solicitud de información por parte de las autoridades es válida, haremos todo lo posible para contactar al titular de la cuenta a través de su dirección de correo electrónico registrada y verificada (por ejemplo, en un plazo de 7 días naturales). Si recibimos una objeción oportuna (por ejemplo, en un plazo de 7 días naturales), no compartiremos la información de la cuenta y continuaremos el proceso legal según sea necesario.

### Las autoridades policiales solicitan preservar la información {#law-enforcement-requests-to-preserve-information}

Atenderemos las solicitudes válidas de las autoridades para preservar la información de una cuenta, de acuerdo con [Título 18 del Código de los Estados Unidos, artículo 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Tenga en cuenta que la conservación de datos se limita únicamente a lo solicitado específicamente y disponible en ese momento.

### Proceso de notificación de las fuerzas del orden {#law-enforcement-serving-process}

Requerimos que todas las solicitudes válidas de cumplimiento de la ley nos proporcionen una dirección de correo electrónico válida y funcional a la que podamos corresponder y proporcionar la información solicitada electrónicamente.

Todas las solicitudes deben enviarse a la dirección de correo electrónico especificada en [Cómo presentar un informe de abuso](#how-to-submit-an-abuse-report) arriba.

Todas las solicitudes de cumplimiento de la ley deben enviarse en papel membretado de la agencia o departamento (por ejemplo, como un archivo PDF escaneado adjunto), desde una dirección de correo electrónico oficial y relevante, y firmadas.

Si se trata de un [solicitud de emergencia](#law-enforcement-emergency-requests), escriba "Solicitud de aplicación de la ley de emergencia" en el encabezado de Asunto del correo electrónico.

Tenga en cuenta que puede llevarnos al menos dos semanas poder revisar y responder a su solicitud.