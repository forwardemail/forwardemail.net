# Bash Command Logging Configuration
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# This file configures bash to log all commands to syslog
# Source this file from /etc/profile.d/

# Enable command logging via PROMPT_COMMAND
# This logs every command before it's executed
if [ -n "$BASH_VERSION" ]; then
    # Function to log commands to syslog
    log_bash_command() {
        local cmd=$(history 1 | sed 's/^[ ]*[0-9]\+[ ]*//')
        if [ -n "$cmd" ] && [ "$cmd" != "$LAST_COMMAND" ]; then
            logger -t bash_command -p local6.info "USER=$USER PWD=$PWD SSH_CLIENT=\"$SSH_CLIENT\" COMMAND: $cmd"
            export LAST_COMMAND="$cmd"
        fi
    }

    # Set PROMPT_COMMAND to log before each command
    if [ -z "$PROMPT_COMMAND" ]; then
        PROMPT_COMMAND="log_bash_command"
    else
        PROMPT_COMMAND="log_bash_command; $PROMPT_COMMAND"
    fi

    # Ensure bash history is enabled and comprehensive
    shopt -s histappend
    HISTSIZE=10000
    HISTFILESIZE=20000
    HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S "
    HISTCONTROL=
    
    # Log immediately, don't wait for session to close
    PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
fi
