#!/usr/bin/env python3
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
"""Verify the safe rollout sequence for the fleet-wide systemd notifier."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECURITY = ROOT / "ansible" / "playbooks" / "security.yml"
UNIT = ROOT / "ansible" / "playbooks" / "templates" / "failure-notification@.service.j2"
SCRIPT = ROOT / "ansible" / "playbooks" / "templates" / "send-failure-notification.sh.j2"
TAG = "forwardemail-alert-policy"
MARKER = "/etc/forwardemail-alerts/systemd-notifier-policy"


def require(text: str, expected: str, source: Path) -> int:
    index = text.find(expected)
    if index < 0:
        raise AssertionError(f"Missing {expected!r} in {source}")
    return index


def main() -> None:
    security = SECURITY.read_text()
    unit = UNIT.read_text()
    script = SCRIPT.read_text()

    require(unit, f"ConditionPathExists={MARKER}", UNIT)
    require(unit, "Environment=\"FORWARDEMAIL_SMS_HOST=", UNIT)
    require(unit, "Environment=\"FORWARDEMAIL_SMS_SERVICES=", UNIT)
    if "Status=$sms_status" in script or "Logs=$sms_logs" in script:
        raise AssertionError("Legacy detailed SMS body remains in notifier source")

    mask = require(security, "- name: Disable notifications while updating alert policy", SECURITY)
    remove_marker = require(security, "- name: Remove old alert policy marker", SECURITY)
    install_script = require(security, "- name: Deploy failure notification script", SECURITY)
    install_unit = require(security, "- name: Deploy systemd failure notification service template", SECURITY)
    reload = require(security, "- name: Reload systemd daemon for fleet-wide failure notifications", SECURITY)
    verify_unit = require(security, "- name: Verify current failure notification unit", SECURITY)
    verify_legacy = require(security, "- name: Verify legacy detailed SMS body is absent", SECURITY)
    assert_current = require(security, "- name: Refuse to activate legacy failure notifier", SECURITY)
    write_marker = require(security, "- name: Mark current failure notification policy ready", SECURITY)
    unmask = require(security, "- name: Re-enable updated failure notifications", SECURITY)

    if not (
        mask < remove_marker < install_script < install_unit < reload < verify_unit
        < verify_legacy < assert_current < write_marker < unmask
    ):
        raise AssertionError("Notifier rollout steps are not in safe fail-closed order")

    for required in (
        "- mask",
        "- unmask",
        "- --runtime",
        f"path: {MARKER}",
        "failure-notification@.service",
        "ConditionPathExists=/etc/forwardemail-alerts/systemd-notifier-policy",
        "Status=$sms_status",
        "forwardemail-alert-policy",
    ):
        require(security, required, SECURITY)

    if security.count(TAG) < 12:
        raise AssertionError("Focused rollout tag does not cover enough alert-policy tasks")
    if "forwardemail-systemd-sms" in security:
        raise AssertionError("Obsolete partial SMS rollout tag remains in the security play")

    print(
        "PASS: fleet rollout masks the legacy notifier, installs and verifies the "
        "current policy, writes the readiness marker, then unblocks notifications"
    )


if __name__ == "__main__":
    try:
        main()
    except AssertionError as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
