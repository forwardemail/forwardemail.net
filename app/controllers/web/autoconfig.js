/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const env = require('#config/env');

//
// Thunderbird / Mozilla autoconfig
// GET /mail/config-v1.1.xml
// <https://wiki.mozilla.org/Thunderbird:Autoconfiguration:ConfigFileFormat>
//
// Uses env vars for dynamic server settings (same pattern as mobile-config.js)
//
function autoconfig(ctx) {
  const imapHost = env.IMAP_HOST;
  const imapPort = env.IMAP_PORT;
  const smtpHost = env.SMTP_HOST;
  const smtpPort = env.SMTP_PORT;
  const pop3Host = env.POP3_HOST;
  const pop3Port = env.POP3_PORT;
  const webHost = env.WEB_HOST;
  const caldavHost = env.CALDAV_HOST;
  const carddavHost = env.CARDDAV_HOST;

  // Determine socket types based on port numbers
  const imapSocketType =
    imapPort === 993 || imapPort === 2993 ? 'SSL' : 'STARTTLS';
  const smtpSocketType =
    smtpPort === 465 || smtpPort === 2465 ? 'SSL' : 'STARTTLS';
  const pop3SocketType =
    pop3Port === 995 || pop3Port === 2995 ? 'SSL' : 'STARTTLS';

  // CalDAV/CardDAV sections (only if hosts are configured)
  // <https://wiki.mozilla.org/Thunderbird:Autoconfiguration:ConfigFileFormat>
  // Note: Thunderbird uses RFC 6764 for CardDAV/CalDAV auto discovery
  let davSections = '';
  if (carddavHost && carddavHost !== 'localhost') {
    davSections += `
  <addressBook type="carddav">
    <username>%EMAILADDRESS%</username>
    <authentication>http-basic</authentication>
    <serverURL>https://${carddavHost}</serverURL>
  </addressBook>`;
  }

  if (caldavHost && caldavHost !== 'localhost') {
    davSections += `
  <calendar type="caldav">
    <username>%EMAILADDRESS%</username>
    <authentication>http-basic</authentication>
    <serverURL>https://${caldavHost}</serverURL>
  </calendar>`;
  }

  ctx.type = 'application/xml';
  ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
<clientConfig version="1.1">
  <emailProvider id="${webHost}">
    <domain>${webHost}</domain>
    <displayName>Forward Email</displayName>
    <displayShortName>FE</displayShortName>
    <incomingServer type="imap">
      <hostname>${imapHost}</hostname>
      <port>${imapPort}</port>
      <socketType>${imapSocketType}</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </incomingServer>
    <incomingServer type="pop3">
      <hostname>${pop3Host}</hostname>
      <port>${pop3Port}</port>
      <socketType>${pop3SocketType}</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </incomingServer>
    <outgoingServer type="smtp">
      <hostname>${smtpHost}</hostname>
      <port>${smtpPort}</port>
      <socketType>${smtpSocketType}</socketType>
      <authentication>password-cleartext</authentication>
      <username>%EMAILADDRESS%</username>
    </outgoingServer>
  </emailProvider>${davSections}
</clientConfig>`;
}

//
// Microsoft Outlook autodiscover (POX protocol)
// POST /autodiscover/autodiscover.xml
// <https://learn.microsoft.com/en-us/exchange/client-developer/web-service-reference/pox-autodiscover-request-for-exchange>
//
// Outlook sends a POST with XML body containing the user's email address.
// We parse it and return IMAP/POP3/SMTP settings.
//
async function autodiscover(ctx) {
  const imapHost = env.IMAP_HOST;
  const imapPort = env.IMAP_PORT;
  const smtpHost = env.SMTP_HOST;
  const smtpPort = env.SMTP_PORT;
  const pop3Host = env.POP3_HOST;
  const pop3Port = env.POP3_PORT;

  const imapSSL = imapPort === 993 || imapPort === 2993 ? 'on' : 'off';
  const smtpSSL = smtpPort === 465 || smtpPort === 2465 ? 'on' : 'off';
  const pop3SSL = pop3Port === 995 || pop3Port === 2995 ? 'on' : 'off';

  // Try to extract email from the POST body (Outlook sends XML)
  let email = '';
  try {
    const body =
      typeof ctx.request.body === 'string'
        ? ctx.request.body
        : JSON.stringify(ctx.request.body || '');
    // Extract email from <EMailAddress>user@example.com</EMailAddress>
    const match = /<emailaddress>([^<]+)<\/emailaddress>/i.exec(body);
    if (match) {
      email = match[1];
    }
  } catch (err) {
    ctx.logger.debug(err);
  }

  ctx.type = 'application/xml';
  ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
  <Response xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a">
    <Account>
      <AccountType>email</AccountType>
      <Action>settings</Action>
      <Protocol>
        <Type>IMAP</Type>
        <Server>${imapHost}</Server>
        <Port>${imapPort}</Port>
        <SSL>${imapSSL}</SSL>
        <SPA>off</SPA>
        <AuthRequired>on</AuthRequired>
        <LoginName>${email || '%EMAILADDRESS%'}</LoginName>
      </Protocol>
      <Protocol>
        <Type>POP3</Type>
        <Server>${pop3Host}</Server>
        <Port>${pop3Port}</Port>
        <SSL>${pop3SSL}</SSL>
        <SPA>off</SPA>
        <AuthRequired>on</AuthRequired>
        <LoginName>${email || '%EMAILADDRESS%'}</LoginName>
      </Protocol>
      <Protocol>
        <Type>SMTP</Type>
        <Server>${smtpHost}</Server>
        <Port>${smtpPort}</Port>
        <SSL>${smtpSSL}</SSL>
        <SPA>off</SPA>
        <AuthRequired>on</AuthRequired>
        <LoginName>${email || '%EMAILADDRESS%'}</LoginName>
      </Protocol>
    </Account>
  </Response>
</Autodiscover>`;
}

module.exports = { autoconfig, autodiscover };
