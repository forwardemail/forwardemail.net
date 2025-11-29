# Bash/Zsh Command Logging Configuration
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# This file configures bash and zsh to log all commands to syslog
# Source this file from /etc/profile.d/ and /etc/zsh/zshrc
#
# Commands are logged to syslog with facility local6.info
# Rsyslog routes these to /var/log/bash-commands.log

# Bash logging
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
    elif [[ "$PROMPT_COMMAND" != *"log_bash_command"* ]]; then
        PROMPT_COMMAND="log_bash_command; $PROMPT_COMMAND"
    fi

    # Ensure bash history is enabled and comprehensive
    shopt -s histappend
    HISTSIZE=10000
    HISTFILESIZE=20000
    HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S "
    HISTCONTROL=
    
    # Log immediately, don't wait for session to close
    if [[ "$PROMPT_COMMAND" != *"history -a"* ]]; then
        PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
    fi
fi

# Zsh logging
if [ -n "$ZSH_VERSION" ]; then
    # Function to log commands to syslog for zsh
    log_zsh_command() {
        local cmd="$1"
        if [ -n "$cmd" ] && [ "$cmd" != "$LAST_ZSH_COMMAND" ]; then
            logger -t zsh_command -p local6.info "USER=$USER PWD=$PWD SSH_CLIENT=\"$SSH_CLIENT\" COMMAND: $cmd"
            export LAST_ZSH_COMMAND="$cmd"
        fi
    }

    # Use preexec hook to log before command execution
    autoload -Uz add-zsh-hook
    
    # Define preexec function
    _log_zsh_preexec() {
        log_zsh_command "$1"
    }
    
    # Add to preexec hook if not already added
    if [[ ! " ${preexec_functions[@]} " =~ " _log_zsh_preexec " ]]; then
        add-zsh-hook preexec _log_zsh_preexec
    fi

    # Ensure zsh history is enabled and comprehensive
    HISTSIZE=10000
    SAVEHIST=20000
    setopt EXTENDED_HISTORY
    setopt HIST_IGNORE_DUPS
    setopt HIST_IGNORE_SPACE
    setopt SHARE_HISTORY
    setopt INC_APPEND_HISTORY
fi
