#!/usr/bin/env python3

from pathlib import Path
import sys

REPO = (
    Path(sys.argv[1])
    if len(sys.argv) > 1
    else Path(__file__).resolve().parents[2]
)
PLAYBOOKS = REPO / "ansible" / "playbooks"

ENTRYPOINTS = {
    "mongo.yml": ("mongo", "MONGO_HOST"),
    "logs.yml": ("logs", "LOGS_HOST"),
    "redis.yml": ("redis", "REDIS_HOST"),
}


def fail(message):
    raise AssertionError(message)


def require(content, needle, context):
    if needle not in content:
        fail(f"{context}: missing {needle!r}")


def validate_entrypoint(filename, group, env_name):
    path = PLAYBOOKS / filename
    content = path.read_text(encoding="utf-8")
    hostname_marker = f"- name: Hostname\n  hosts: {group}"
    security_marker = "- name: Import security playbook"

    require(content, hostname_marker, filename)
    require(content, security_marker, filename)

    hostname_offset = content.index(hostname_marker)
    security_offset = content.index(security_marker)
    if hostname_offset >= security_offset:
        fail(
            f"{filename}: security is imported before the Hostname play; "
            "security can freeze the previous host's ansible_fqdn, its early "
            "self-comparison can pass, and SPF later checks the stale HELO"
        )

    import_end = content.find("\n- name:", security_offset + 1)
    if import_end == -1:
        import_end = content.find("\n- hosts:", security_offset + 1)
    if import_end == -1:
        import_end = len(content)
    security_import = content[security_offset:import_end]
    expected_binding = (
        "security_expected_alert_hostname: "
        f'"{{{{ lookup(\'env\', \'{env_name}\') }}}}"'
    )
    require(security_import, expected_binding, filename)

    hostname_segment = content[hostname_offset:security_offset]
    require(hostname_segment, "gather_facts: false", filename)
    require(
        hostname_segment,
        f"name: \"{{{{ lookup('env', '{env_name}') }}}}\"",
        filename,
    )
    require(hostname_segment, "tags:\n    - always", filename)
    require(hostname_segment, "- forwardemail-alert-hostname", filename)


def validate_security_contract():
    path = PLAYBOOKS / "security.yml"
    content = path.read_text(encoding="utf-8")
    required = [
        "Read this server's alert hostname",
        "forwardemail_live_hostname",
        "forwardemail_expected_alert_hostname",
        "security_expected_alert_hostname",
        "forwardemail_alert_hostname",
        "forwardemail_alert_public_ip",
        "hostvars[inventory_hostname]['alert_hostname']",
        "hostvars[inventory_hostname]['alert_public_ip']",
        "hostvars[inventory_hostname]['direct_alert_helo_identity']",
        "hostvars[inventory_hostname]['direct_alert_public_ip']",
        "Verify this server's alert hostname",
        "Verify saved alert hostname matches this server",
    ]
    for needle in required:
        require(content, needle, "security.yml")

    pre_tasks = content[: content.index("  handlers:")]
    if "| default(ansible_fqdn" in pre_tasks or "(ansible_fqdn |" in pre_tasks:
        fail(
            "security.yml: alert hostname must use the live configured "
            "hostname, not reverse-DNS-sensitive ansible_fqdn"
        )

    if pre_tasks.index("hostvars[inventory_hostname]['alert_hostname']") > \
        pre_tasks.index("hostvars[inventory_hostname]['direct_alert_helo_identity']"):
        fail("security.yml: alert_hostname must take precedence over the legacy override")
    if pre_tasks.index("hostvars[inventory_hostname]['alert_public_ip']") > \
        pre_tasks.index("hostvars[inventory_hostname]['direct_alert_public_ip']"):
        fail("security.yml: alert_public_ip must take precedence over the legacy override")

    if content.index("Verify this server's alert hostname") > content.index(
        "Configure send-only direct-to-MX Postfix"
    ):
        fail("security.yml: hostname assertion must precede all Postfix mutation")

    require(
        content,
        "myhostname '{{ forwardemail_alert_hostname }}'",
        "security.yml",
    )
    require(
        content,
        '- "{{ forwardemail_alert_hostname }}"',
        "security.yml",
    )


def main():
    for filename, (group, env_name) in ENTRYPOINTS.items():
        validate_entrypoint(filename, group, env_name)
    validate_security_contract()
    print(
        "PASS: MongoDB, Logs, and Redis apply and verify their configured "
        "hostname before security sets the Postfix and SPF hostname"
    )


if __name__ == "__main__":
    main()
