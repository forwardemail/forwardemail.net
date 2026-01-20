/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const dashify = require('dashify');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const mobileconfig = require('mobileconfig');
const mongoose = require('mongoose');
const plist = require('plist');
const shortID = require('mongodb-short-id');
const titleize = require('titleize');
const getUuid = require('@forwardemail/uuid-by-string');
const isEmail = require('#helpers/is-email');

// https://github.com/danakt/uuid-by-string/issues/24

const Aliases = require('#models/aliases');
const config = require('#config');
const env = require('#config/env');
const isValidPassword = require('#helpers/is-valid-password');
const { decrypt } = require('#helpers/encrypt-decrypt');

//
// (this punctuation stuff is borrowed from our work with `spamscanner`)
// punctuation characters
// (need stripped from tokenization)
// <https://github.com/regexhq/punctuation-regex>
// NOTE: we prepended a normal "-" hyphen since it was missing
const PUNCTUATION_REGEX = new RE2(
  /[-‒–—―|$&~=\\/⁄@+*!?({[\]})<>‹›«».;:^‘’“”'",،、`·•†‡°″¡¿※#№÷×%‰−‱¶′‴§_‖¦]/g
);

let keys;
if (isSANB(env.WEB_SSL_CA_PATH) && env.WEB_SSL_CA_PATH && env.WEB_SSL_CA_PATH)
  keys = {
    key: fs.readFileSync(env.WEB_SSL_KEY_PATH),
    cert: fs.readFileSync(env.WEB_SSL_CERT_PATH),
    ca: fs.readFileSync(env.WEB_SSL_CA_PATH)
    // `hashAlg` option defaults to "sha256"
    // <https://github.com/andris9/mobileconfig?tab=readme-ov-file#signing-configuration>
  };

// macOS and iOS mobileconfig template (gets signed with our website SSL keys)
//
// NOTE: for PayloadIdentifier we use dashify on the email
//       which gives us reverse DNS style required
//
//       > require('dashify')('foo@bar.com')
//       'foo-bar-com'
//
//       <https://developer.apple.com/business/documentation/Configuration-Profile-Reference.pdf>
//
function mobileConfigTemplate(name, username, password) {
  return {
    PayloadDescription: 'Forward Email Settings',
    PayloadDisplayName: `Forward Email (${username})`,
    PayloadIdentifier: `net.forwardemail.mobileconfig.${dashify(username)}`,
    PayloadOrganization: 'Forward Email LLC',
    PayloadType: 'Configuration',
    PayloadUUID: getUuid(username),
    PayloadVersion: 1,
    PayloadContent: [
      {
        EmailAccountDescription: name,
        EmailAccountName: username,
        EmailAccountType: 'EmailTypeIMAP',
        EmailAddress: username,
        IncomingMailServerAuthentication: 'EmailAuthPassword',
        IncomingMailServerHostName: env.IMAP_HOST,
        IncomingMailServerPortNumber: env.IMAP_PORT,
        IncomingMailServerUseSSL:
          env.IMAP_PORT === 993 || env.IMAP_PORT === 2993,
        IncomingMailServerUsername: username,
        IncomingPassword: password,
        OutgoingMailServerAuthentication: 'EmailAuthPassword',
        OutgoingMailServerHostName: env.SMTP_HOST,
        OutgoingMailServerPortNumber: env.SMTP_PORT,
        OutgoingMailServerUseSSL:
          !env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production',
        OutgoingMailServerUsername: username,
        OutgoingPassword: password,
        OutgoingPasswordSameAsIncomingPassword: true,
        PayloadDisplayName: `${name}${name.endsWith('s') ? "'" : "'s"} Email`,
        PayloadIdentifier: `net.forwardemail.mobileconfig.email.${dashify(
          username
        )}`,
        PayloadType: 'com.apple.mail.managed',
        PayloadUUID: getUuid('email', getUuid(username)),
        PayloadVersion: 1
      },
      {
        CalDAVAccountDescription: `${name}${
          name.endsWith('s') ? "'" : "'s"
        } Calendars`,
        CalDAVHostName: env.CALDAV_HOST,
        CalDAVUsername: username,
        CalDAVPassword: password,
        CalDAVUseSSL: env.CALDAV_PROTOCOL === 'https',
        CalDAVPort: env.CALDAV_PORT,
        PayloadDisplayName: `${name}${
          name.endsWith('s') ? "'" : "'s"
        } Calendars`,
        PayloadIdentifier: `net.forwardemail.mobileconfig.caldav.${dashify(
          username
        )}`,
        PayloadType: 'com.apple.caldav.account',
        PayloadUUID: getUuid('caldav', getUuid(username)),
        PayloadVersion: 1
      },
      {
        CardDAVAccountDescription: `${name}${
          name.endsWith('s') ? "'" : "'s"
        } Contacts`,
        CardDAVHostName: env.CARDDAV_HOST,
        CardDAVPort: env.CARDDAV_PORT, // TODO: does this actually work?
        CardDAVPassword: password,
        CardDAVUseSSL: true,
        CardDAVUsername: username,
        PayloadDisplayName: `${name}${
          name.endsWith('s') ? "'" : "'s"
        } Contacts`,
        PayloadIdentifier: `net.forwardemail.mobileconfig.carddav.${dashify(
          username
        )}`,
        PayloadType: 'com.apple.carddav.account',
        PayloadUUID: getUuid('carddav', getUuid(username)),
        PayloadVersion: 1
      }
    ]
  };
}

//
// NOTE: that we use an input/seed for generating account uuid
//
//       here's how K-9 generates UUID's
//       <https://github.com/thunderbird/thunderbird-android/blob/a8523dc743a87ae60a56a44a7478889a13e0091a/legacy/core/src/main/java/com/fsck/k9/preferences/AccountSettingsWriter.kt#L118-L119>
//       (they use v4 by default)
//
//       <https://stackoverflow.com/a/69958290>
//
function k9s(name, username) {
  return `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
<k9settings version="90" format="1">
  <global>
    <value key="animations">false</value>
    <value key="backgroundOperations">ALWAYS</value>
    <value key="changeRegisteredNameColor">false</value>
    <value key="confirmDelete">false</value>
    <value key="confirmDeleteStarred">false</value>
    <value key="confirmSpam">false</value>
    <value key="confirmMarkAllRead">true</value>
    <value key="enableDebugLogging">false</value>
    <value key="enableSensitiveLogging">false</value>
    <value key="fontSizeMessageComposeInput" />
    <value key="fontSizeMessageListDate" />
    <value key="fontSizeMessageListPreview" />
    <value key="fontSizeMessageListSender" />
    <value key="fontSizeMessageListSubject" />
    <value key="fontSizeMessageViewAdditionalHeaders" />
    <value key="fontSizeMessageViewCC" />
    <value key="fontSizeMessageViewDate" />
    <value key="fontSizeMessageViewSender" />
    <value key="fontSizeMessageViewSubject" />
    <value key="fontSizeMessageViewTime" />
    <value key="fontSizeMessageViewTo" />
    <value key="language">default</value>
    <value key="messageListPreviewLines">2</value>
    <value key="messageListStars">true</value>
    <value key="messageViewFixedWidthFont">false</value>
    <value key="quietTimeEnabled">false</value>
    <value key="quietTimeEnds">7:00</value>
    <value key="quietTimeStarts">21:00</value>
    <value key="registeredNameColor">#1093f5</value>
    <value key="showContactName">false</value>
    <value key="showCorrespondentNames">true</value>
    <value key="showUnifiedInbox">true</value>
    <value key="sortTypeEnum">SORT_DATE</value>
    <value key="sortAscending">false</value>
    <value key="theme">follow_system</value>
    <value key="messageViewTheme">use_global</value>
    <value key="useVolumeKeysForNavigation">false</value>
    <value key="useBackgroundAsUnreadIndicator">false</value>
    <value key="threadedView">true</value>
    <value key="splitViewMode">NEVER</value>
    <value key="messageComposeTheme">use_global</value>
    <value key="fixedMessageViewTheme">true</value>
    <value key="showContactPicture">true</value>
    <value key="autofitWidth">true</value>
    <value key="colorizeMissingContactPictures">true</value>
    <value key="messageViewDeleteActionVisible">true</value>
    <value key="messageViewArchiveActionVisible">false</value>
    <value key="messageViewMoveActionVisible">false</value>
    <value key="messageViewCopyActionVisible">false</value>
    <value key="messageViewSpamActionVisible">false</value>
    <value key="fontSizeMessageViewContentPercent">100</value>
    <value key="hideUserAgent">false</value>
    <value key="hideTimeZone">false</value>
    <value key="lockScreenNotificationVisibility">MESSAGE_COUNT</value>
    <value key="confirmDeleteFromNotification">true</value>
    <value key="messageListSenderAboveSubject">false</value>
    <value key="notificationQuickDelete">ALWAYS</value>
    <value key="notificationDuringQuietTimeEnabled">true</value>
    <value key="confirmDiscardMessage">true</value>
    <value key="pgpInlineDialogCounter">0</value>
    <value key="pgpSignOnlyDialogCounter">0</value>
    <value key="fontSizeMessageViewBCC" />
    <value key="showRecentChanges">true</value>
    <value key="showStarredCount">false</value>
    <value key="swipeRightAction">ToggleSelection</value>
    <value key="swipeLeftAction">ToggleRead</value>
    <value key="showComposeButtonOnMessageList">true</value>
    <value key="messageListDensity">Default</value>
    <value key="fontSizeMessageViewAccountName" />
    <value key="messageViewPostDeleteAction">ReturnToMessageList</value>
    <value key="messageViewPostMarkAsUnreadAction">ReturnToMessageList</value>
  </global>
  <accounts>
    <account uuid="${getUuid(username)}">
      <name>${username}</name>
      <incoming-server type="IMAP">
        <host>${env.IMAP_HOST}</host>
        <port>${env.IMAP_PORT}</port>
        <connection-security>${
          env.IMAP_PORT === 993 || env.IMAP_PORT === 2993
            ? 'SSL_TLS_REQUIRED'
            : 'NONE'
        }</connection-security>
        <authentication-type>PLAIN</authentication-type>
        <username>${username}</username>
        <extra>
          <value key="autoDetectNamespace">true</value>
          <value key="pathPrefix" />
        </extra>
      </incoming-server>
      <outgoing-server type="SMTP">
        <host>${env.SMTP_HOST}</host>
        <port>${env.SMTP_PORT}</port>
        <connection-security>${
          !env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production'
            ? 'SSL_TLS_REQUIRED'
            : 'NONE'
        }</connection-security>
        <authentication-type>PLAIN</authentication-type>
        <username>${username}</username>
      </outgoing-server>
      <settings>
        <value key="alwaysShowCcBcc">false</value>
        <value key="archiveFolderSelection">AUTOMATIC</value>
        <value key="autocryptMutualMode">false</value>
        <value key="automaticCheckIntervalMinutes">15</value>
        <value key="chipColor">#1976d2</value>
        <value key="defaultQuotedTextShown">true</value>
        <value key="deletePolicy">DELETE</value>
        <value key="displayCount">25</value>
        <value key="draftsFolderSelection">AUTOMATIC</value>
        <value key="expungePolicy">EXPUNGE_IMMEDIATELY</value>
        <value key="folderDisplayMode">NOT_SECOND_CLASS</value>
        <value key="folderNotifyNewMailMode">ALL</value>
        <value key="folderPushMode">NONE</value>
        <value key="folderSyncMode">FIRST_CLASS</value>
        <value key="folderTargetMode">NOT_SECOND_CLASS</value>
        <value key="idleRefreshMinutes">24</value>
        <value key="ignoreChatMessages">false</value>
        <value key="localStorageProvider">InternalStorage</value>
        <value key="markMessageAsReadOnDelete">true</value>
        <value key="markMessageAsReadOnView">true</value>
        <value key="maxPushFolders">10</value>
        <value key="maximumAutoDownloadMessageSize">32768</value>
        <value key="maximumPolledMessageAge">-1</value>
        <value key="messageFormat">HTML</value>
        <value key="messageFormatAuto">false</value>
        <value key="messageReadReceipt">false</value>
        <value key="notificationLight">Disabled</value>
        <value key="notifyContactsMailOnly">false</value>
        <value key="notifyMailCheck">false</value>
        <value key="notifyNewMail">true</value>
        <value key="notifySelfNewMail">true</value>
        <value key="openPgpEncryptAllDrafts">false</value>
        <value key="openPgpEncryptSubject">false</value>
        <value key="openPgpHideSignOnly">false</value>
        <value key="quotePrefix">&gt;</value>
        <value key="quoteStyle">PREFIX</value>
        <value key="remoteSearchFullText">false</value>
        <value key="remoteSearchNumResults">25</value>
        <value key="replyAfterQuote">false</value>
        <value key="ring">true</value>
        <value key="ringtone">content://settings/system/notification_sound</value>
        <value key="searchableFolders">ALL</value>
        <value key="sendClientId">true</value>
        <value key="sentFolderSelection">AUTOMATIC</value>
        <value key="showPicturesEnum">NEVER</value>
        <value key="signatureBeforeQuotedText">false</value>
        <value key="sortAscending">false</value>
        <value key="sortTypeEnum">SORT_DATE</value>
        <value key="spamFolderSelection">AUTOMATIC</value>
        <value key="stripSignature">true</value>
        <value key="subscribedFoldersOnly">false</value>
        <value key="syncRemoteDeletions">true</value>
        <value key="trashFolderSelection">AUTOMATIC</value>
        <value key="uploadSentMessages">true</value>
        <value key="useCompression">true</value>
        <value key="vibrate">false</value>
        <value key="vibratePattern">0</value>
        <value key="vibrateTimes">5</value>
        <value key="autoExpandFolderName">INBOX</value>
        <value key="archiveFolderName">Archive</value>
        <value key="draftsFolderName">Drafts</value>
        <value key="sentFolderName">Sent Mail</value>
        <value key="spamFolderName">Spam</value>
        <value key="trashFolderName">Trash</value>
      </settings>
      <identities>
        <identity>
          <name>${name}</name>
          <email>${username}</email>
          <description>Initial identity</description>
          <settings>
            <value key="signature">${name}</value>
            <value key="signatureUse">true</value>
          </settings>
        </identity>
      </identities>
      <folders>
        <folder name="INBOX">
          <value key="integrate">true</value>
          <value key="inTopGroup">false</value>
          <value key="syncMode">FIRST_CLASS</value>
          <value key="displayMode">FIRST_CLASS</value>
          <value key="notifyMode">FIRST_CLASS</value>
          <value key="pushMode">FIRST_CLASS</value>
        </folder>
        <folder name="Archive">
          <value key="integrate">false</value>
          <value key="inTopGroup">false</value>
          <value key="syncMode">NO_CLASS</value>
          <value key="displayMode">FIRST_CLASS</value>
          <value key="notifyMode">INHERITED</value>
          <value key="pushMode">SECOND_CLASS</value>
        </folder>
        <folder name="Drafts">
          <value key="integrate">false</value>
          <value key="inTopGroup">false</value>
          <value key="syncMode">NO_CLASS</value>
          <value key="displayMode">FIRST_CLASS</value>
          <value key="notifyMode">INHERITED</value>
          <value key="pushMode">SECOND_CLASS</value>
        </folder>
        <folder name="Sent Mail">
          <value key="integrate">false</value>
          <value key="inTopGroup">false</value>
          <value key="syncMode">NO_CLASS</value>
          <value key="displayMode">FIRST_CLASS</value>
          <value key="notifyMode">INHERITED</value>
          <value key="pushMode">SECOND_CLASS</value>
        </folder>
        <folder name="Spam">
          <value key="integrate">false</value>
          <value key="inTopGroup">false</value>
          <value key="syncMode">NO_CLASS</value>
          <value key="displayMode">FIRST_CLASS</value>
          <value key="notifyMode">INHERITED</value>
          <value key="pushMode">SECOND_CLASS</value>
        </folder>
        <folder name="Trash">
          <value key="integrate">false</value>
          <value key="inTopGroup">false</value>
          <value key="syncMode">NO_CLASS</value>
          <value key="displayMode">FIRST_CLASS</value>
          <value key="notifyMode">INHERITED</value>
          <value key="pushMode">SECOND_CLASS</value>
        </folder>
      </folders>
    </account>
  </accounts>
</k9settings>
`.trim();
}

//
// NOTE: for security reasons (so users can't guess that their inputs are accurate) we 404
//       (which is similar to what we do for the forgot password stuff, e.g. so users can't guess valid emails)
//

async function mobileConfig(ctx, next) {
  try {
    // must end with `.mobileconfig` or `.k9s`
    if (!ctx.path.endsWith('.mobileconfig') && !ctx.path.endsWith('.k9s'))
      return next(); // 404

    // ctx.params.username must be a valid email address
    if (!isSANB(ctx.params.username) || !isEmail(ctx.params.username))
      return next(); // 404

    // ?a= alias ID
    if (!isSANB(ctx.query.a)) return next(); // 404

    try {
      ctx.query.a = shortID.shortToLong(ctx.query.a);
    } catch (err) {
      ctx.logger.debug(err);
      return next(); // 404
    }

    // safeguard
    if (!mongoose.isObjectIdOrHexString(ctx.query.a)) return next(); // 404

    // ?p = encrypted password
    // Handle invalid password parameter (e.g., 'undefined' string or missing)
    if (!isSANB(ctx.query.p) || ctx.query.p === 'undefined') return next(); // 404

    const alias = await Aliases.findById(ctx.query.a)
      .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
      .populate('domain', 'name')
      .lean()
      .exec();

    if (!alias) return next(); // 404

    // cannot be catch-all nor regex
    if (alias.name === '*' || alias.name.startsWith('/')) return next(); // 404

    if (!Array.isArray(alias.tokens) || alias.tokens.length === 0)
      return next(); // 404

    // validate password
    // ensure that the token is valid
    const isValid = await isValidPassword(
      alias.tokens,
      decrypt(ctx.query.p),
      alias
    );

    if (!isValid) return next(); // 404

    const username = `${alias.name}@${alias.domain.name}`;

    // safeguard
    if (ctx.params.username !== username) return next(); // 404

    // name is our best guess of a human-friendly version of alias.name
    // support -> Support
    // foo.bar -> Foo Bar
    // foo_bar -> Foo Bar
    const name = titleize(humanize(alias.name.replace(PUNCTUATION_REGEX, ' ')));

    //
    // macOS and iOS mobile config (signed)
    //
    // NOTE: see discussions:
    //       <https://github.com/mozilla-mobile/firefox-ios/issues/25476>
    //       <https://github.com/duckduckgo/apple-browsers/issues/297>
    //
    if (ctx.path.endsWith('.mobileconfig')) {
      // .mobileconfig is normally "text/xml" but if signed
      // it is then "application/octet-stream"
      // <https://stackoverflow.com/a/20100664>
      // ctx.type = 'application/x-apple-aspen-config';
      ctx.set(
        'Content-Type',
        'application/x-apple-aspen-config; charset=utf-8'
      );

      ctx.set(
        'Content-Disposition',
        //
        // NOTE: As of March 20, 2025 only the following iOS browsers support automatic detection and download:
        //       <https://github.com/brave/brave-ios/issues/4358>
        //       - Safari
        //       - Chrome
        //
        //       These are NOT working:
        //       - DuckDuckGo
        //       - Firefox Focus
        //       - Firefox
        //
        // `attachment; filename="mail.mobileconfig"`
        `attachment; filename="${username}.mobileconfig"`
      );

      const plistData = mobileConfigTemplate(
        name,
        username,
        decrypt(ctx.query.p)
      );

      // development and test envs usually don't have SSL keys
      if (!keys) {
        ctx.body = plist.build(plistData);
        return;
      }

      ctx.body = await new Promise((resolve, reject) => {
        mobileconfig.getSignedConfig(plistData, keys, function (err, data) {
          if (err) return reject(err);
          resolve(data);
        });
      });
      return;
    }

    // K-9 mail config (unsigned; does not contain password because they don't support that yet)
    // (ty SW)
    if (ctx.path.endsWith('.k9s')) {
      ctx.type = 'text/xml';
      ctx.set('Content-Disposition', `attachment; filename="${username}.k9s"`);
      ctx.body = k9s(name, username);
      return;
    }

    // safeguard to 404
    return next();
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.clientTimeout(ctx.translate('WEBSITE_OUTAGE'));
  }
}

module.exports = mobileConfig;
