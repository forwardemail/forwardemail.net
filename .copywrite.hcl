schema_version = 1

project {
  license = "BUSL-1.1"
  copyright_holder = "Forward Email LLC"
  copyright_year = "2023"
  header_ignore = [
    "app/models/attachments.js",
    "app/models/journals.js",
    "app/models/mailboxes.js",
    "app/models/messages.js",
    "app/models/threads.js",
    "helpers/attachment-storage.js",
    "helpers/imap-notifier.js",
    "helpers/imap/**",
    "helpers/socket-error.js",
    "helpers/store-node-bodies.js",
    "imap-server.js",
    "test/imap/**"
  ]
}
