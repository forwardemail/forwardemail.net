schema_version = 1

project {
  license = "BUSL-1.1"
  copyright_holder = "Forward Email LLC"
  header_ignore = [
    "app/models/journals.js",
    "app/models/mailboxes.js",
    "app/models/messages.js",
    "app/models/threads.js",
    "helpers/imap-notifier.js",
    "helpers/imap/**",
    "helpers/socket-error.js",
    "imap-server.js",
    "test/imap/**"
  ]
}
