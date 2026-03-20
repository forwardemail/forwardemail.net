# Acuerdo de Procesamiento de Datos {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Acuerdo de procesamiento de datos de Forward Email" class="rounded-lg" />


## Tabla de Contenidos {#table-of-contents}

* [Términos Clave](#key-terms)
* [Cambios en el Acuerdo](#changes-to-the-agreement)
* [1. Relaciones entre Procesador y Subprocesador](#1-processor-and-subprocessor-relationships)
  * [1. Proveedor como Procesador](#1-provider-as-processor)
  * [2. Proveedor como Subprocesador](#2-provider-as-subprocessor)
* [2. Procesamiento](#2-processing)
  * [1. Detalles del Procesamiento](#1-processing-details)
  * [2. Instrucciones de Procesamiento](#2-processing-instructions)
  * [3. Procesamiento por el Proveedor](#3-processing-by-provider)
  * [4. Procesamiento por el Cliente](#4-customer-processing)
  * [5. Consentimiento para el Procesamiento](#5-consent-to-processing)
  * [6. Subprocesadores](#6-subprocessors)
* [3. Transferencias Restringidas](#3-restricted-transfers)
  * [1. Autorización](#1-authorization)
  * [2. Transferencias fuera del EEE](#2-ex-eea-transfers)
  * [3. Transferencias fuera del Reino Unido](#3-ex-uk-transfers)
  * [4. Otras Transferencias Internacionales](#4-other-international-transfers)
* [4. Respuesta a Incidentes de Seguridad](#4-security-incident-response)
* [5. Auditoría y Reportes](#5-audit--reports)
  * [1. Derechos de Auditoría](#1-audit-rights)
  * [2. Reportes de Seguridad](#2-security-reports)
  * [3. Diligencia Debida en Seguridad](#3-security-due-diligence)
* [6. Coordinación y Cooperación](#6-coordination--cooperation)
  * [1. Respuesta a Consultas](#1-response-to-inquiries)
  * [2. DPIAs y DTIAs](#2-dpias-and-dtias)
* [7. Eliminación de Datos Personales del Cliente](#7-deletion-of-customer-personal-data)
  * [1. Eliminación por el Cliente](#1-deletion-by-customer)
  * [2. Eliminación al Vencimiento del DPA](#2-deletion-at-dpa-expiration)
* [8. Limitación de Responsabilidad](#8-limitation-of-liability)
  * [1. Límites de Responsabilidad y Renuncia de Daños](#1-liability-caps-and-damages-waiver)
  * [2. Reclamaciones de Terceros Relacionados](#2-related-party-claims)
  * [3. Excepciones](#3-exceptions)
* [9. Conflictos entre Documentos](#9-conflicts-between-documents)
* [10. Duración del Acuerdo](#10-term-of-agreement)
* [11. Ley Aplicable y Tribunales Elegidos](#11-governing-law-and-chosen-courts)
* [12. Relación con el Proveedor de Servicios](#12-service-provider-relationship)
* [13. Definiciones](#13-definitions)
* [Créditos](#credits)


## Términos Clave {#key-terms}

| Término                                    | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Acuerdo</strong>                    | Este DPA complementa los [Términos de Servicio](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                           |
| <strong>Subprocesadores Aprobados</strong> | [Cloudflare](https://cloudflare.com) (EE.UU.; proveedor de DNS, redes y seguridad), [DataPacket](https://www.datapacket.com/) (EE.UU./Reino Unido; proveedor de hosting), [Digital Ocean](https://digitalocean.com) (EE.UU.; proveedor de hosting), [GitHub](https://github.com) (EE.UU.; alojamiento de código fuente, CI/CD y gestión de proyectos), [Vultr](https://www.vultr.com) (EE.UU.; proveedor de hosting), [Stripe](https://stripe.com) (EE.UU.; procesador de pagos), [PayPal](https://paypal.com) (EE.UU.; procesador de pagos) |
| <strong>Contacto de Seguridad del Proveedor</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Política de Seguridad</strong>     | Ver [nuestra Política de Seguridad en GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                   |
| <strong>Estado Gobernante</strong>         | El Estado de Delaware, Estados Unidos                                                                                                                                                                                                                                                                                                                                                                                                                                             |
## Cambios en el Acuerdo {#changes-to-the-agreement}

Este documento es una derivación de los [Términos Estándar del DPA de Common Paper (Versión 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) y se han realizado los siguientes cambios:

1. Se ha incluido [Ley Aplicable y Tribunales Elegidos](#11-governing-law-and-chosen-courts) como una sección a continuación con el `Estado Gobernante` identificado arriba.
2. Se ha incluido [Relación con el Proveedor de Servicios](#12-service-provider-relationship) como una sección a continuación.


## 1. Relaciones entre Procesador y Subprocesador {#1-processor-and-subprocessor-relationships}

### 1. Proveedor como Procesador {#1-provider-as-processor}

En situaciones donde <strong>Cliente</strong> es un Responsable de los Datos Personales del Cliente, <strong>Proveedor</strong> será considerado un Procesador que está Procesando Datos Personales en nombre del <strong>Cliente</strong>.

### 2. Proveedor como Subprocesador {#2-provider-as-subprocessor}

En situaciones donde <strong>Cliente</strong> es un Procesador de los Datos Personales del Cliente, <strong>Proveedor</strong> será considerado un Subprocesador de los Datos Personales del Cliente.


## 2. Procesamiento {#2-processing}

### 1. Detalles del Procesamiento {#1-processing-details}

El Anexo I(B) en la Página de Portada describe el objeto, naturaleza, propósito y duración de este Procesamiento, así como las <strong>Categorías de Datos Personales</strong> recopilados y las <strong>Categorías de Sujetos de Datos</strong>.

### 2. Instrucciones de Procesamiento {#2-processing-instructions}

<strong>Cliente</strong> instruye a <strong>Proveedor</strong> a Procesar los Datos Personales del Cliente: (a) para proporcionar y mantener el Servicio; (b) según se especifique adicionalmente mediante el uso del Servicio por parte del <strong>Cliente</strong>; (c) según lo documentado en el <strong>Acuerdo</strong>; y (d) según lo documentado en cualquier otra instrucción escrita dada por el <strong>Cliente</strong> y reconocida por el <strong>Proveedor</strong> sobre el Procesamiento de los Datos Personales del Cliente bajo este DPA. <strong>Proveedor</strong> cumplirá con estas instrucciones a menos que las Leyes Aplicables lo prohíban. <strong>Proveedor</strong> informará inmediatamente al <strong>Cliente</strong> si no puede seguir las instrucciones de Procesamiento. El <strong>Cliente</strong> ha dado y solo dará instrucciones que cumplan con las Leyes Aplicables.

### 3. Procesamiento por parte del Proveedor {#3-processing-by-provider}

<strong>Proveedor</strong> solo Procesará los Datos Personales del Cliente de acuerdo con este DPA, incluidos los detalles en la Página de Portada. Si <strong>Proveedor</strong> actualiza el Servicio para actualizar productos, características o funcionalidades existentes o incluir nuevos, <strong>Proveedor</strong> podrá cambiar las <strong>Categorías de Sujetos de Datos</strong>, <strong>Categorías de Datos Personales</strong>, <strong>Datos de Categoría Especial</strong>, <strong>Restricciones o Salvaguardas para Datos de Categoría Especial</strong>, <strong>Frecuencia de Transferencia</strong>, <strong>Naturaleza y Propósito del Procesamiento</strong> y <strong>Duración del Procesamiento</strong> según sea necesario para reflejar las actualizaciones notificando al <strong>Cliente</strong> sobre las actualizaciones y cambios.

### 4. Procesamiento por parte del Cliente {#4-customer-processing}

Cuando <strong>Cliente</strong> sea un Procesador y <strong>Proveedor</strong> un Subprocesador, <strong>Cliente</strong> cumplirá con todas las Leyes Aplicables que se apliquen al Procesamiento de los Datos Personales del Cliente por parte del <strong>Cliente</strong>. El acuerdo del <strong>Cliente</strong> con su Responsable requerirá de manera similar que <strong>Cliente</strong> cumpla con todas las Leyes Aplicables que se apliquen al <strong>Cliente</strong> como Procesador. Además, <strong>Cliente</strong> cumplirá con los requisitos de Subprocesador en el acuerdo del <strong>Cliente</strong> con su Responsable.

### 5. Consentimiento para el Procesamiento {#5-consent-to-processing}

<strong>Cliente</strong> ha cumplido y continuará cumpliendo con todas las Leyes de Protección de Datos Aplicables en relación con la provisión de Datos Personales del Cliente a <strong>Proveedor</strong> y/o al Servicio, incluyendo realizar todas las divulgaciones, obtener todos los consentimientos, proporcionar opciones adecuadas e implementar las salvaguardas relevantes requeridas bajo las Leyes de Protección de Datos Aplicables.
### 6. Subprocesadores {#6-subprocessors}

a. <strong>El Proveedor</strong> no proporcionará, transferirá ni entregará ningún Dato Personal del Cliente a un Subprocesador a menos que <strong>el Cliente</strong> haya aprobado al Subprocesador. La lista actual de <strong>Subprocesadores Aprobados</strong> incluye las identidades de los Subprocesadores, su país de ubicación y las tareas de Procesamiento previstas. <strong>El Proveedor</strong> informará a <strong>el Cliente</strong> al menos 10 días hábiles antes y por escrito de cualquier cambio previsto en los <strong>Subprocesadores Aprobados</strong>, ya sea por adición o reemplazo de un Subprocesador, lo que permite a <strong>el Cliente</strong> disponer de tiempo suficiente para oponerse a los cambios antes de que <strong>el Proveedor</strong> comience a utilizar el/los nuevo(s) Subprocesador(es). <strong>El Proveedor</strong> proporcionará a <strong>el Cliente</strong> la información necesaria para permitirle ejercer su derecho a oponerse al cambio en los <strong>Subprocesadores Aprobados</strong>. <strong>El Cliente</strong> dispone de 30 días tras la notificación de un cambio en los <strong>Subprocesadores Aprobados</strong> para oponerse; de lo contrario, se considerará que <strong>el Cliente</strong> acepta los cambios. Si <strong>el Cliente</strong> se opone al cambio dentro de los 30 días posteriores a la notificación, <strong>el Cliente</strong> y <strong>el Proveedor</strong> cooperarán de buena fe para resolver la objeción o preocupación de <strong>el Cliente</strong>.

b. Al contratar a un Subprocesador, <strong>el Proveedor</strong> tendrá un acuerdo por escrito con el Subprocesador que garantice que el Subprocesador solo acceda y utilice los Datos Personales del Cliente (i) en la medida necesaria para cumplir con las obligaciones subcontratadas, y (ii) de acuerdo con los términos del <strong>Acuerdo</strong>.

c. Si el RGPD se aplica al Procesamiento de los Datos Personales del Cliente, (i) las obligaciones de protección de datos descritas en este DPA (según se refiere en el Artículo 28(3) del RGPD, si procede) también se imponen al Subprocesador, y (ii) el acuerdo de <strong>el Proveedor</strong> con el Subprocesador incorporará estas obligaciones, incluyendo detalles sobre cómo <strong>el Proveedor</strong> y su Subprocesador coordinarán para responder a consultas o solicitudes sobre el Procesamiento de los Datos Personales del Cliente. Además, <strong>el Proveedor</strong> compartirá, a solicitud de <strong>el Cliente</strong>, una copia de sus acuerdos (incluidas las enmiendas) con sus Subprocesadores. En la medida necesaria para proteger secretos comerciales u otra información confidencial, incluidos los datos personales, <strong>el Proveedor</strong> podrá redactar el texto de su acuerdo con el Subprocesador antes de compartir una copia.

d. <strong>El Proveedor</strong> sigue siendo plenamente responsable de todas las obligaciones subcontratadas a sus Subprocesadores, incluidos los actos y omisiones de sus Subprocesadores en el Procesamiento de los Datos Personales del Cliente. <strong>El Proveedor</strong> notificará a <strong>el Cliente</strong> cualquier incumplimiento por parte de sus Subprocesadores en el cumplimiento de una obligación material sobre los Datos Personales del Cliente bajo el acuerdo entre <strong>el Proveedor</strong> y el Subprocesador.


## 3. Transferencias Restringidas {#3-restricted-transfers}

### 1. Autorización {#1-authorization}

<strong>El Cliente</strong> acepta que <strong>el Proveedor</strong> pueda transferir Datos Personales del Cliente fuera del EEE, el Reino Unido u otro territorio geográfico relevante según sea necesario para proporcionar el Servicio. Si <strong>el Proveedor</strong> transfiere Datos Personales del Cliente a un territorio para el cual la Comisión Europea u otra autoridad supervisora relevante no ha emitido una decisión de adecuación, <strong>el Proveedor</strong> implementará las salvaguardas adecuadas para la transferencia de Datos Personales del Cliente a ese territorio de conformidad con las Leyes de Protección de Datos Aplicables.

### 2. Transferencias fuera del EEE {#2-ex-eea-transfers}

<strong>El Cliente</strong> y <strong>el Proveedor</strong> acuerdan que si el RGPD protege la transferencia de Datos Personales del Cliente, la transferencia es de <strong>el Cliente</strong> desde dentro del EEE a <strong>el Proveedor</strong> fuera del EEE, y la transferencia no está regida por una decisión de adecuación emitida por la Comisión Europea, entonces al celebrar este DPA, <strong>el Cliente</strong> y <strong>el Proveedor</strong> se consideran que han firmado las Cláusulas Contractuales Tipo del EEE (SCCs) y sus Anexos, que se incorporan por referencia. Cualquier transferencia de este tipo se realiza conforme a las SCCs del EEE, que se completan de la siguiente manera:
a. El Módulo Dos (Controlador a Procesador) de las EEA SCCs se aplica cuando <strong>Cliente</strong> es un Controlador y <strong>Proveedor</strong> está Procesando Datos Personales del Cliente para <strong>Cliente</strong> como Procesador.

b. El Módulo Tres (Procesador a Subprocesador) de las EEA SCCs se aplica cuando <strong>Cliente</strong> es un Procesador y <strong>Proveedor</strong> está Procesando Datos Personales del Cliente en nombre de <strong>Cliente</strong> como Subprocesador.

c. Para cada módulo, se aplica lo siguiente (cuando corresponda):

1. La cláusula opcional de acoplamiento en la Cláusula 7 no se aplica;

2. En la Cláusula 9, la Opción 2 (autorización escrita general) se aplica, y el período mínimo para el aviso previo de cambios de Subprocesador es de 10 días hábiles;

3. En la Cláusula 11, el lenguaje opcional no se aplica;

4. Todos los corchetes en la Cláusula 13 se eliminan;

5. En la Cláusula 17 (Opción 1), las EEA SCCs se regirán por las leyes del <strong>Estado Miembro Gobernante</strong>;

6. En la Cláusula 18(b), las disputas se resolverán en los tribunales del <strong>Estado Miembro Gobernante</strong>; y

7. La Portada de este DPA contiene la información requerida en el Anexo I, Anexo II y Anexo III de las EEA SCCs.

### 3. Transferencias Ex-UK {#3-ex-uk-transfers}

<strong>Cliente</strong> y <strong>Proveedor</strong> acuerdan que si el UK GDPR protege la transferencia de Datos Personales del Cliente, la transferencia es de <strong>Cliente</strong> desde dentro del Reino Unido a <strong>Proveedor</strong> fuera del Reino Unido, y la transferencia no está gobernada por una decisión de adecuación realizada por el Secretario de Estado del Reino Unido, entonces al celebrar este DPA, <strong>Cliente</strong> y <strong>Proveedor</strong> se consideran que han firmado el Anexo del Reino Unido y sus Anexos, que se incorporan por referencia. Cualquier transferencia de este tipo se realiza conforme al Anexo del Reino Unido, que se completa de la siguiente manera:

a. La Sección 3.2 de este DPA contiene la información requerida en la Tabla 2 del Anexo del Reino Unido.

b. La Tabla 4 del Anexo del Reino Unido se modifica de la siguiente manera: Ninguna de las partes podrá terminar el Anexo del Reino Unido según lo establecido en la Sección 19 del Anexo del Reino Unido; en la medida en que la ICO emita un Anexo Aprobado revisado bajo la Sección ‎18 del Anexo del Reino Unido, las partes trabajarán de buena fe para revisar este DPA en consecuencia.

c. La Portada contiene la información requerida por el Anexo 1A, Anexo 1B, Anexo II y Anexo III del Anexo del Reino Unido.

### 4. Otras Transferencias Internacionales {#4-other-international-transfers}

Para las transferencias de Datos Personales donde la ley suiza (y no la ley de ningún estado miembro del EEE ni del Reino Unido) se aplica a la naturaleza internacional de la transferencia, las referencias al GDPR en la Cláusula 4 de las EEA SCCs se modifican, en la medida legalmente requerida, para referirse en su lugar a la Ley Federal Suiza de Protección de Datos o su sucesora, y el concepto de autoridad supervisora incluirá al Comisionado Federal Suizo de Protección de Datos e Información.

## 4. Respuesta a Incidentes de Seguridad {#4-security-incident-response}

1. Al tener conocimiento de cualquier Incidente de Seguridad, <strong>Proveedor</strong> deberá: (a) notificar a <strong>Cliente</strong> sin demora indebida cuando sea factible, pero no más tarde de 72 horas después de tener conocimiento del Incidente de Seguridad; (b) proporcionar información oportuna sobre el Incidente de Seguridad a medida que se conozca o según lo solicite razonablemente <strong>Cliente</strong>; y (c) tomar prontamente medidas razonables para contener e investigar el Incidente de Seguridad. La notificación o respuesta de <strong>Proveedor</strong> a un Incidente de Seguridad según lo requerido por este DPA no se interpretará como un reconocimiento por parte de <strong>Proveedor</strong> de cualquier culpa o responsabilidad por el Incidente de Seguridad.

## 5. Auditoría y Reportes {#5-audit--reports}

### 1. Derechos de Auditoría {#1-audit-rights}

<strong>Proveedor</strong> proporcionará a <strong>Cliente</strong> toda la información razonablemente necesaria para demostrar su cumplimiento con este DPA y <strong>Proveedor</strong> permitirá y contribuirá a auditorías, incluidas inspecciones por parte de <strong>Cliente</strong>, para evaluar el cumplimiento de <strong>Proveedor</strong> con este DPA. Sin embargo, <strong>Proveedor</strong> podrá restringir el acceso a datos o información si el acceso de <strong>Cliente</strong> a la información impactaría negativamente los derechos de propiedad intelectual de <strong>Proveedor</strong>, obligaciones de confidencialidad u otras obligaciones bajo las Leyes Aplicables. <strong>Cliente</strong> reconoce y acepta que solo ejercerá sus derechos de auditoría bajo este DPA y cualquier derecho de auditoría otorgado por las Leyes de Protección de Datos Aplicables instruyendo a <strong>Proveedor</strong> para que cumpla con los requisitos de reporte y diligencia debida a continuación. <strong>Proveedor</strong> mantendrá registros de su cumplimiento con este DPA durante 3 años después de que finalice el DPA.
### 2. Informes de Seguridad {#2-security-reports}

<strong>Cliente</strong> reconoce que <strong>Proveedor</strong> es auditado regularmente conforme a los estándares definidos en la <strong>Política de Seguridad</strong> por auditores independientes externos. A solicitud por escrito, <strong>Proveedor</strong> proporcionará a <strong>Cliente</strong>, de manera confidencial, una copia resumida de su Informe vigente para que <strong>Cliente</strong> pueda verificar el cumplimiento de <strong>Proveedor</strong> con los estándares definidos en la <strong>Política de Seguridad</strong>.

### 3. Diligencia Debida en Seguridad {#3-security-due-diligence}

Además del Informe, <strong>Proveedor</strong> responderá a solicitudes razonables de información realizadas por <strong>Cliente</strong> para confirmar el cumplimiento de <strong>Proveedor</strong> con este DPA, incluyendo respuestas a cuestionarios de seguridad de la información, diligencia debida y auditoría, o proporcionando información adicional sobre su programa de seguridad de la información. Todas estas solicitudes deben ser por escrito y dirigidas al <strong>Contacto de Seguridad del Proveedor</strong> y solo podrán realizarse una vez al año.


## 6. Coordinación y Cooperación {#6-coordination--cooperation}

### 1. Respuesta a Consultas {#1-response-to-inquiries}

Si <strong>Proveedor</strong> recibe alguna consulta o solicitud de cualquier otra persona sobre el Procesamiento de Datos Personales del Cliente, <strong>Proveedor</strong> notificará a <strong>Cliente</strong> sobre la solicitud y <strong>Proveedor</strong> no responderá a la solicitud sin el consentimiento previo de <strong>Cliente</strong>. Ejemplos de este tipo de consultas y solicitudes incluyen una orden judicial, administrativa o de una agencia reguladora sobre Datos Personales del Cliente donde notificar a <strong>Cliente</strong> no esté prohibido por la Ley Aplicable, o una solicitud de un titular de datos. Si la Ley Aplicable lo permite, <strong>Proveedor</strong> seguirá las instrucciones razonables de <strong>Cliente</strong> sobre estas solicitudes, incluyendo proporcionar actualizaciones de estado y otra información razonablemente solicitada por <strong>Cliente</strong>. Si un titular de datos realiza una solicitud válida bajo las Leyes de Protección de Datos Aplicables para eliminar u optar por no proporcionar los Datos Personales del Cliente a <strong>Proveedor</strong>, <strong>Proveedor</strong> asistirá a <strong>Cliente</strong> en cumplir con la solicitud conforme a la Ley de Protección de Datos Aplicable. <strong>Proveedor</strong> cooperará y proporcionará asistencia razonable a <strong>Cliente</strong>, a expensas de <strong>Cliente</strong>, en cualquier respuesta legal u otra acción procesal tomada por <strong>Cliente</strong> en respuesta a una solicitud de terceros sobre el Procesamiento de Datos Personales del Cliente por parte de <strong>Proveedor</strong> bajo este DPA.

### 2. DPIAs y DTIAs {#2-dpias-and-dtias}

Si lo requieren las Leyes de Protección de Datos Aplicables, <strong>Proveedor</strong> asistirá razonablemente a <strong>Cliente</strong> en la realización de cualquier evaluación de impacto en la protección de datos o evaluación de impacto en la transferencia de datos mandatada y en las consultas con las autoridades de protección de datos relevantes, tomando en consideración la naturaleza del Procesamiento y los Datos Personales del Cliente.


## 7. Eliminación de Datos Personales del Cliente {#7-deletion-of-customer-personal-data}

### 1. Eliminación por parte del Cliente {#1-deletion-by-customer}

<strong>Proveedor</strong> permitirá a <strong>Cliente</strong> eliminar los Datos Personales del Cliente de manera consistente con la funcionalidad de los Servicios. <strong>Proveedor</strong> cumplirá con esta instrucción tan pronto como sea razonablemente posible, excepto cuando la Ley Aplicable requiera un almacenamiento adicional de los Datos Personales del Cliente.

### 2. Eliminación al Vencimiento del DPA {#2-deletion-at-dpa-expiration}

a. Después de que el DPA expire, <strong>Proveedor</strong> devolverá o eliminará los Datos Personales del Cliente según las instrucciones de <strong>Cliente</strong>, a menos que la Ley Aplicable requiera o autorice un almacenamiento adicional de los Datos Personales del Cliente. Si la devolución o destrucción es impracticable o está prohibida por las Leyes Aplicables, <strong>Proveedor</strong> hará esfuerzos razonables para prevenir un Procesamiento adicional de los Datos Personales del Cliente y continuará protegiendo los Datos Personales del Cliente que permanezcan en su posesión, custodia o control. Por ejemplo, las Leyes Aplicables pueden requerir que <strong>Proveedor</strong> continúe alojando o procesando los Datos Personales del Cliente.
b. Si <strong>Cliente</strong> y <strong>Proveedor</strong> han incorporado las EEA SCCs o el Anexo del Reino Unido como parte de este DPA, <strong>Proveedor</strong> solo entregará a <strong>Cliente</strong> la certificación de eliminación de Datos Personales descrita en la Cláusula 8.1(d) y la Cláusula 8.5 de las EEA SCCs si <strong>Cliente</strong> la solicita.


## 8. Limitación de Responsabilidad {#8-limitation-of-liability}

### 1. Límites de Responsabilidad y Renuncia a Daños {#1-liability-caps-and-damages-waiver}

**En la máxima medida permitida por las Leyes de Protección de Datos Aplicables, la responsabilidad total acumulada de cada parte frente a la otra derivada de o relacionada con este DPA estará sujeta a las renuncias, exclusiones y limitaciones de responsabilidad establecidas en el <strong>Acuerdo</strong>.**

### 2. Reclamaciones de Terceros Relacionados {#2-related-party-claims}

**Cualquier reclamación contra <strong>Proveedor</strong> o sus Afiliados derivada de o relacionada con este DPA solo podrá ser presentada por la entidad <strong>Cliente</strong> que sea parte del <strong>Acuerdo</strong>.**

### 3. Excepciones {#3-exceptions}

1. Este DPA no limita ninguna responsabilidad hacia un individuo respecto a los derechos de protección de datos de dicho individuo bajo las Leyes de Protección de Datos Aplicables. Además, este DPA no limita ninguna responsabilidad entre las partes por violaciones de las EEA SCCs o el Anexo del Reino Unido.


## 9. Conflictos Entre Documentos {#9-conflicts-between-documents}

1. Este DPA forma parte y complementa el Acuerdo. Si existe alguna inconsistencia entre este DPA, el <strong>Acuerdo</strong> o cualquiera de sus partes, la parte listada primero prevalecerá sobre la parte listada después para esa inconsistencia: (1) las EEA SCCs o el Anexo del Reino Unido, (2) este DPA, y luego (3) el <strong>Acuerdo</strong>.


## 10. Duración del Acuerdo {#10-term-of-agreement}

Este DPA comenzará cuando <strong>Proveedor</strong> y <strong>Cliente</strong> acuerden una Portada para el DPA y firmen o acepten electrónicamente el <strong>Acuerdo</strong> y continuará hasta que el <strong>Acuerdo</strong> expire o sea terminado. Sin embargo, <strong>Proveedor</strong> y <strong>Cliente</strong> permanecerán sujetos a las obligaciones de este DPA y las Leyes de Protección de Datos Aplicables hasta que <strong>Cliente</strong> deje de transferir Datos Personales del Cliente a <strong>Proveedor</strong> y <strong>Proveedor</strong> deje de Procesar Datos Personales del Cliente.


## 11. Ley Aplicable y Tribunales Elegidos {#11-governing-law-and-chosen-courts}

Sin perjuicio de la ley aplicable o cláusulas similares del <strong>Acuerdo</strong>, todas las interpretaciones y disputas sobre este DPA se regirán por las leyes del <strong>Estado Gobernante</strong> sin considerar sus disposiciones sobre conflicto de leyes. Además, y sin perjuicio de la selección de foro, jurisdicción o cláusulas similares del <strong>Acuerdo</strong>, las partes acuerdan presentar cualquier demanda, acción o procedimiento legal sobre este DPA en, y cada parte se somete irrevocablemente a la jurisdicción exclusiva de, los tribunales del <strong>Estado Gobernante</strong>.


## 12. Relación de Proveedor de Servicios {#12-service-provider-relationship}

En la medida en que la Ley de Privacidad del Consumidor de California, Cal. Civ. Code § 1798.100 et seq ("CCPA") sea aplicable, las partes reconocen y acuerdan que <strong>Proveedor</strong> es un proveedor de servicios y está recibiendo Datos Personales de <strong>Cliente</strong> para proporcionar el Servicio según lo acordado en el <strong>Acuerdo</strong>, lo cual constituye un propósito comercial. <strong>Proveedor</strong> no venderá ningún Dato Personal proporcionado por <strong>Cliente</strong> bajo el <strong>Acuerdo</strong>. Además, <strong>Proveedor</strong> no retendrá, usará ni divulgará ningún Dato Personal proporcionado por <strong>Cliente</strong> bajo el <strong>Acuerdo</strong> excepto según sea necesario para proporcionar el Servicio para <strong>Cliente</strong>, como se indica en el <strong>Acuerdo</strong>, o según lo permitan las Leyes de Protección de Datos Aplicables. <strong>Proveedor</strong> certifica que entiende las restricciones de este párrafo.
## 13. Definiciones {#13-definitions}

1. **"Leyes Aplicables"** significa las leyes, normas, reglamentos, órdenes judiciales y otros requisitos vinculantes de una autoridad gubernamental relevante que se aplican o rigen a una parte.

2. **"Leyes Aplicables de Protección de Datos"** significa las Leyes Aplicables que regulan cómo el Servicio puede procesar o usar la información personal, datos personales, información de identificación personal u otro término similar de un individuo.

3. **"Controlador"** tendrá el significado(s) dado en las Leyes Aplicables de Protección de Datos para la empresa que determina el propósito y alcance del Procesamiento de Datos Personales.

4. **"Portada"** significa un documento que es firmado o aceptado electrónicamente por las partes que incorpora estos Términos Estándar del DPA e identifica a <strong>Proveedor</strong>, <strong>Cliente</strong>, y el objeto y detalles del procesamiento de datos.

5. **"Datos Personales del Cliente"** significa Datos Personales que <strong>Cliente</strong> carga o proporciona a <strong>Proveedor</strong> como parte del Servicio y que están regidos por este DPA.

6. **"DPA"** significa estos Términos Estándar del DPA, la Portada entre <strong>Proveedor</strong> y <strong>Cliente</strong>, y las políticas y documentos referenciados o adjuntos a la Portada.

7. **"CEE SCCs"** significa las cláusulas contractuales estándar anexadas a la Decisión de Ejecución 2021/914 de la Comisión Europea del 4 de junio de 2021 sobre cláusulas contractuales estándar para la transferencia de datos personales a terceros países conforme al Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo Europeo.

8. **"Espacio Económico Europeo"** o **"EEE"** significa los estados miembros de la Unión Europea, Noruega, Islandia y Liechtenstein.

9. **"GDPR"** significa el Reglamento de la Unión Europea 2016/679 implementado por la ley local en la nación miembro relevante del EEE.

10. **"Datos Personales"** tendrá el significado(s) dado en las Leyes Aplicables de Protección de Datos para información personal, datos personales u otro término similar.

11. **"Procesamiento"** o **"Procesar"** tendrá el significado(s) dado en las Leyes Aplicables de Protección de Datos para cualquier uso de, o realización de una operación informática sobre, Datos Personales, incluyendo por métodos automáticos.

12. **"Procesador"** tendrá el significado(s) dado en las Leyes Aplicables de Protección de Datos para la empresa que Procesa Datos Personales en nombre del Controlador.

13. **"Informe"** significa informes de auditoría preparados por otra empresa según los estándares definidos en la Política de Seguridad en nombre del Proveedor.

14. **"Transferencia Restringida"** significa (a) cuando aplica el GDPR, una transferencia de datos personales desde el EEE a un país fuera del EEE que no está sujeto a una decisión de adecuación por parte de la Comisión Europea; y (b) cuando aplica el UK GDPR, una transferencia de datos personales desde el Reino Unido a cualquier otro país que no esté sujeto a regulaciones de adecuación adoptadas conforme a la Sección 17A de la Ley de Protección de Datos del Reino Unido de 2018.

15. **"Incidente de Seguridad"** significa una Violación de Datos Personales según se define en el Artículo 4 del GDPR.

16. **"Servicio"** significa el producto y/o servicios descritos en el <strong>Acuerdo</strong>.

17. **"Datos de Categoría Especial"** tendrá el significado dado en el Artículo 9 del GDPR.

18. **"Subprocesador"** tendrá el significado(s) dado en las Leyes Aplicables de Protección de Datos para una empresa que, con la aprobación y aceptación del Controlador, asiste al Procesador en el Procesamiento de Datos Personales en nombre del Controlador.

19. **"UK GDPR"** significa el Reglamento de la Unión Europea 2016/679 implementado por la sección 3 de la Ley de Retirada de la Unión Europea (Withdrawal) del Reino Unido de 2018 en el Reino Unido.

20. **"Anexo del Reino Unido"** significa el anexo de transferencia internacional de datos a las CEE SCCs emitido por el Comisionado de Información para las Partes que realizan Transferencias Restringidas bajo S119A(1) de la Ley de Protección de Datos de 2018.


## Créditos {#credits}

Este documento es un derivado de los [Términos Estándar del DPA de Common Paper (Versión 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) y está licenciado bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
