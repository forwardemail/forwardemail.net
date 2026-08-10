# Push Notification Provider Setup

The Forward Email backend sends remote notifications through **Apple Push Notification service (APNs)** for iOS, **Firebase Cloud Messaging (FCM)** for Google Play Android builds, and **UnifiedPush** for every Android build. Each alias-scoped event is delivered through WebSocket and push in parallel with the same immutable `notification_id`; the mail client treats them as two transports for one logical event, prefers WebSocket while foregrounded, and uses a bounded push fallback without duplicate notifications or refresh work.

The native client implementation and build profiles are documented in the [`mail.forwardemail.net` push guide](https://github.com/forwardemail/mail.forwardemail.net/blob/master/docs/PUSH_NOTIFICATIONS.md). Configure this repository first, then copy only the explicitly identified public values into the mail repository's build environment.


## Delivery fan-out and zero-socket behavior

Event producers call the transport-neutral `sendNotification` helper. It assigns the immutable `notification_id` once and explicitly starts **both** delivery paths from that same payload: `sendPushNotification` queries and fans out to every active alias token, while Redis publication feeds the API WebSocket subscriber. The subscriber owns only socket delivery and forwards the unchanged envelope to matching connected clients.

**An active WebSocket connection is not required for push delivery.** Push starts directly inside `sendNotification`, before and independently of any Redis subscriber or socket lookup. Per-token provider attempts use bounded parallelism, so one slow or failed token cannot prevent the remaining active tokens from being attempted. A short-lived Redis `SET NX` claim keyed by `notification_id` suppresses duplicate provider fan-out if the same immutable notification envelope is retried. Global maintenance broadcasts without an alias remain intentionally WebSocket-only because there is no alias-scoped token set to target.


## User-visible versus silent events

Only the events listed in `USER_VISIBLE_PUSH_EVENTS` (`helpers/send-push-notification.js`) are delivered as user-visible alerts. Today that set is `newMessage` alone. Every other event is still delivered to every active token — clients depend on it for badge counts and cache invalidation — but as a silent message that displays nothing until the app decides to act on it.

This split has to be decided on the server. A push carrying an FCM `notification` block or an APNs `alert` is drawn by the operating system **before** the app is handed the payload, so a client cannot suppress an alert it did not want. Sending an alert for every event type meant one user action fanned out into a screenful of notifications: marking a thread read emits one `flagsUpdated` per message, and each arrived on the device as "Flags Updated / You have a new flagsUpdated event".

Being a `newMessage` is not on its own enough to raise an alert. The event fires for *any* message appended to *any* mailbox, so saving a draft or filing a Sent copy looks identical to incoming mail at the event level. `isAlertWorthyNewMessage` silences three cases:

- the mailbox is one of `SILENT_MAILBOX_PATHS` (Drafts, Sent, Archive, All Mail, Junk, Spam, Trash and their common aliases), matched case-insensitively against `data.mailbox` or `data.message.folder_path`;
- the message carries `\Draft`, whatever folder it landed in;
- the message arrives already `\Seen`, which a real delivery never is — that is another client copying or migrating existing mail.

A payload that says nothing about its folder stays visible: a stray alert is better than a swallowed delivery. This list is kept in step with `SILENT_FOLDERS` in the mail app's `utils/notification-manager.js`, which applies the same rules to the WebSocket path.

`buildPayload` sets `silent` on the payload, and each transport honors it:

| Transport   | User-visible                                            | Silent                                                             |
| ----------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| FCM         | `notification` block, `android.priority` `high`          | data-only, no `notification` block, `android.priority` `normal`      |
| APNs        | `pushType` `alert`, `priority` 10, `alert`, `sound`      | `pushType` `background`, `priority` 5, `content-available` 1         |
| UnifiedPush | `title` and `body` in the encrypted body                 | `silent: true`, no `title` or `body`                                 |

Silent events carry no `title` or `body` at all, rather than unused strings. A transport that forwards whatever it is given — the UnifiedPush body reaches an Android client that renders it directly — will otherwise display them.

> **APNs background pushes are best effort.** Apple throttles them and only delivers them to an app that declares the `remote-notification` background mode. Treat the WebSocket as the reliable path for state a client needs promptly, and silent push as an optimization.

Adding an event to `USER_VISIBLE_PUSH_EVENTS` also needs a matching client change: the Android UnifiedPush plugin keeps its own allowlist and suppresses anything outside it, and FCM's `android.notification.channel_id` is currently hardcoded to `new-mail`, which is only correct while mail is the sole visible category.

## Environment variable summary

| Variable                   | Required for | Value source                                                           | Secret             |
| -------------------------- | ------------ | ---------------------------------------------------------------------- | ------------------ |
| `APPLE_TEAM_ID`            | APNs         | Apple Developer membership details                                     | No                 |
| `APPLE_KEY_ID`             | APNs         | Identifier shown for the shared Apple services key                     | No                 |
| `APPLE_KEY_PATH`           | APNs         | Absolute server path to the downloaded shared `.p8` key                | Yes: file contents |
| `APNS_BUNDLE_ID`           | APNs         | iOS bundle identifier; use `net.forwardemail.mail`                     | No                 |
| `APNS_PRODUCTION`          | APNs         | `true` for distribution tokens; `false` for development/sandbox tokens | No                 |
| `FCM_PROJECT_ID`           | FCM          | Firebase **Project settings → General → Project ID**                   | No                 |
| `FCM_SERVICE_ACCOUNT_PATH` | FCM          | Absolute server path to a Firebase service-account JSON key            | Yes: file contents |
| `VAPID_SUBJECT`            | UnifiedPush  | Operator contact URI, normally `mailto:support@forwardemail.net`       | No                 |
| `VAPID_PUBLIC_KEY`         | UnifiedPush  | Public half of the generated VAPID key pair                            | No                 |
| `VAPID_PRIVATE_KEY`        | UnifiedPush  | Private half of the generated VAPID key pair                           | Yes                |

> **Reuse the existing Apple credentials.** APNs deliberately uses the established `APPLE_KEY_ID`, `APPLE_TEAM_ID`, and `APPLE_KEY_PATH` values from Sign in with Apple. The same protected `.p8` file can therefore continue to be distributed by the existing [Ansible](https://github.com/ansible/ansible) deployment; do not introduce separate APNs-specific credential variables.


## Deploy protected credential files

Run the existing certificate playbook from the repository root:

```bash
node ansible-playbook ansible/playbooks/certificates.yml --user deploy
```

In addition to the required TLS files, the playbook prompts for two optional local credential paths:

```text
/path/to/AuthKey_00000000000.p8
/path/to/firebase-service-account.json
```

The playbook validates each non-empty local path and copies both files with mode `0660` and owner `deploy` to the same `/var/www/production` directory on the applicable process hosts. The Apple key keeps its local basename, while the Firebase key is installed deterministically as `/var/www/production/firebase-service-account.json`. Set `APPLE_KEY_PATH` to `/var/www/production/<apple-key-basename>` and use the default `FCM_SERVICE_ACCOUNT_PATH=/var/www/production/firebase-service-account.json`. Leaving either prompt blank skips only that optional credential.


## APNs and the shared Apple key

The Apple services key must have **Apple Push Notifications service (APNs)** enabled. If the existing Sign in with Apple key already has APNs enabled, reuse it without generating or deploying another key. Apple permits an APNs signing key to authenticate multiple apps, and an APNs signing key works with both development and production environments.[1][]

To create or replace the shared key:

1. Sign in to [Apple Developer](https://developer.apple.com/account/resources/authkeys/list) as an Account Holder or Admin.
2. Open **Certificates, Identifiers & Profiles → Keys** and create a key.
3. Enable and configure **Apple Push Notifications service (APNs)**. Also retain or enable **Sign in with Apple** because this repository uses the same key for both services.
4. Select the APNs environment and key scope required by the Apple account. A team-scoped key is appropriate when the same key serves multiple app topics.
5. Confirm and download the `.p8` file. Apple permits the private key to be downloaded only once, so store the original securely.[2][]
6. Copy the displayed 10-character Key ID into `APPLE_KEY_ID`.
7. Copy the 10-character Team ID from **Membership details** into `APPLE_TEAM_ID`.
8. Supply the local `.p8` path when `ansible/playbooks/certificates.yml` prompts for the Apple key. The playbook uploads it to `/var/www/production/<local-basename>` on every applicable process host. Set `APPLE_KEY_PATH` to that absolute server path.
9. In **Certificates, Identifiers & Profiles → Identifiers**, open the `net.forwardemail.mail` App ID and enable **Push Notifications**. Regenerate the development and distribution provisioning profiles consumed by the mail repository.

Configure the backend with values such as:

```env
APPLE_TEAM_ID=TEAM123456
APPLE_KEY_ID=ABC123DEFG
APPLE_KEY_PATH=/var/www/production/AuthKey_ABC123DEFG.p8
APNS_BUNDLE_ID=net.forwardemail.mail
APNS_PRODUCTION=true
```

`APPLE_KEY_PATH` must identify the unencrypted `.p8` provider key, not an App Store Connect API key, signing certificate, provisioning profile, or `.p12` file. Keep `APNS_BUNDLE_ID` equal to the client bundle identifier. Use `APNS_PRODUCTION=false` for development-signed device builds and `APNS_PRODUCTION=true` for TestFlight, App Store, and other distribution builds.


## FCM HTTP v1

FCM is optional for Google-free downstream builds, but the mail repository's GitHub release uses one dual-provider Play build containing both FCM and UnifiedPush. That release defaults to FCM at runtime until the user explicitly selects a UnifiedPush distributor. The mail repository's default and F-Droid build commands remain UnifiedPush-only and do not require Firebase or Google Play Services.

To obtain the two backend values:

1. Open the [Firebase console](https://console.firebase.google.com/) and create or select the project used by the Forward Email Android application.
2. Open **Project settings → General** and copy the immutable **Project ID** into `FCM_PROJECT_ID`. Do not use the display name, project number, or Android application ID.
3. Ensure the **Firebase Cloud Messaging API** is enabled for that project.
4. Open **Project settings → Service accounts** and generate a new private key, or create a dedicated least-privilege service account in Google Cloud IAM and download its JSON key. Firebase documents **Firebase Cloud Messaging API Admin** as the role that permits sending to a target project.[3][]
5. Store the JSON outside the repository and supply its local path when `ansible/playbooks/certificates.yml` prompts for the Firebase service account. The playbook uploads it beside the Apple `.p8` file as `/var/www/production/firebase-service-account.json`, regardless of the local filename.
6. Confirm that the JSON key belongs to a service account authorized to send messages to the project named by `FCM_PROJECT_ID`.

```env
FCM_PROJECT_ID=forward-email-production
FCM_SERVICE_ACCOUNT_PATH=/var/www/production/firebase-service-account.json
```

The JSON file is a production credential. Never commit it, paste it into an issue, include it in a client build, or expose it through a public environment variable. The mail repository separately needs `google-services.json`; that client configuration file is not a substitute for this backend service-account key.


## UnifiedPush and VAPID

UnifiedPush subscriptions use Web Push-compatible encryption. Generate one stable VAPID key pair from this repository with the [`web-push`](https://github.com/web-push-libs/web-push) CLI:

```bash
pnpm exec web-push generate-vapid-keys
```

Store the generated values as follows:

| Generated or chosen value | Backend setting     | Mail repository setting                                                |
| ------------------------- | ------------------- | ---------------------------------------------------------------------- |
| Public key                | `VAPID_PUBLIC_KEY`  | GitHub Actions variable and local build environment `VAPID_PUBLIC_KEY` |
| Private key               | `VAPID_PRIVATE_KEY` | Never copy to the client repository, Actions, APK, AAB, or CI logs     |
| Contact URI               | `VAPID_SUBJECT`     | Not required by the client                                             |

`VAPID_SUBJECT` must be a contact URI controlled by the operator, normally `mailto:support@forwardemail.net` or an HTTPS URL. The public and private values must remain a matched pair.

```env
VAPID_SUBJECT=mailto:support@forwardemail.net
VAPID_PUBLIC_KEY=BN...
VAPID_PRIVATE_KEY=...
```

Treat the VAPID pair as long-lived application identity. Rotating it requires Android clients to obtain new UnifiedPush subscriptions. The public key is intentionally embedded in Android artifacts; the private key remains backend-only.


## Complete production example

```env
# Shared Sign in with Apple and APNs credentials
APPLE_TEAM_ID=TEAM123456
APPLE_KEY_ID=ABC123DEFG
APPLE_KEY_PATH=/var/www/production/AuthKey_ABC123DEFG.p8

# APNs delivery
APNS_BUNDLE_ID=net.forwardemail.mail
APNS_PRODUCTION=true

# Google Play Android delivery
FCM_PROJECT_ID=forward-email-production
FCM_SERVICE_ACCOUNT_PATH=/var/www/production/firebase-service-account.json

# UnifiedPush delivery
VAPID_SUBJECT=mailto:support@forwardemail.net
VAPID_PUBLIC_KEY=BN...
VAPID_PRIVATE_KEY=...
```

Values belong in the deployment environment generated from [`.env.defaults`](./.env.defaults) and validated by [`.env.schema`](./.env.schema). File credentials must be deployed separately and referenced by absolute path; do not copy credential contents into the environment file.


## Cross-repository handoff

After the backend is configured, provide the mail repository maintainers with exactly these non-secret values:

| Value                                             | Mail repository destination                                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `VAPID_PUBLIC_KEY`                                | Actions variable and local build variable `VAPID_PUBLIC_KEY`                                                     |
| Firebase project's Android `google-services.json` | Base64-encode as Actions secret `GOOGLE_SERVICES_JSON_BASE64`, or point local `GOOGLE_SERVICES_JSON` to the file |
| `APPLE_TEAM_ID`                                   | Existing Actions secret `APPLE_TEAM_ID` used for iOS signing                                                     |

Do not hand off `APPLE_KEY_PATH` contents, the APNs `.p8` file, `FCM_SERVICE_ACCOUNT_PATH` contents, or `VAPID_PRIVATE_KEY` to the client repository. The iOS release has separate certificate, provisioning-profile, and App Store Connect values documented by the mail repository.


## Verification checklist

| Check                      | Expected result                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Shared Apple credentials   | `APPLE_KEY_ID`, `APPLE_TEAM_ID`, and `APPLE_KEY_PATH` are present and reused for APNs                              |
| Apple key file             | `APPLE_KEY_PATH` is absolute, readable only by the service account, and contains the downloaded services `.p8` key |
| APNs topic and environment | `APNS_BUNDLE_ID=net.forwardemail.mail`; `APNS_PRODUCTION` matches the client signing profile                       |
| Firebase project           | `FCM_PROJECT_ID` matches the `project_id` in the client project's `google-services.json`                           |
| Firebase service account   | The JSON file exists at `FCM_SERVICE_ACCOUNT_PATH` and its service account can send FCM HTTP v1 messages           |
| VAPID pairing              | `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` came from the same generation command                                   |
| Client handoff             | Mail Actions variable `VAPID_PUBLIC_KEY` exactly equals backend `VAPID_PUBLIC_KEY`                                 |
| Secret boundary            | No `.p8`, service-account JSON, VAPID private key, or base64 secret is tracked by Git                              |

The delivery helper sends FCM and UnifiedPush requests through the repository's hardened fetch path with the caller-provided [Tangerine](https://github.com/forwardemail/tangerine) resolver. UnifiedPush endpoint validation rejects unsafe targets, and permanent provider responses participate in the normal token failure and pruning lifecycle.


## References

[1]: https://developer.apple.com/help/account/capabilities/communicate-with-apns-using-authentication-tokens/ "Communicate with APNs using authentication tokens"

[2]: https://developer.apple.com/help/account/keys/create-a-private-key/ "Create a private key to access a service"

[3]: https://firebase.google.com/docs/cloud-messaging/send/v1-api "Send a message using FCM HTTP v1 API"
