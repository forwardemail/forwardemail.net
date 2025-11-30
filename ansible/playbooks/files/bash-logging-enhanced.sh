# Bash/Zsh Command Logging Configuration (Enhanced)
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# This file configures bash and zsh to log ALL commands to syslog
# Works for interactive, non-interactive, login, and non-login shells
# Source this file from multiple locations to ensure comprehensive coverage
#
# Commands are logged to syslog with facility local6.info
# Rsyslog routes these to /var/log/bash-commands.log

# Skip if already loaded (prevent duplicate logging)
if [ -n "$BASH_LOGGING_LOADED" ] || [ -n "$ZSH_LOGGING_LOADED" ]; then
    return 0 2>/dev/null || exit 0
fi

# Bash logging
if [ -n "$BASH_VERSION" ]; then
    # Mark as loaded
    export BASH_LOGGING_LOADED=1
    
    # Function to log commands to syslog
    log_bash_command() {
        local cmd=$(history 1 | sed 's/^[ ]*[0-9]\+[ ]*//')
        if [ -n "$cmd" ] && [ "$cmd" != "$LAST_COMMAND" ]; then
            logger -t bash_command -p local6.info "USER=$USER PWD=$PWD SSH_CLIENT=\"$SSH_CLIENT\" SSH_CONNECTION=\"$SSH_CONNECTION\" COMMAND: $cmd"
            export LAST_COMMAND="$cmd"
        fi
    }

    # For interactive shells, use PROMPT_COMMAND
    if [ -n "$PS1" ]; then
        # Interactive shell
        if [ -z "$PROMPT_COMMAND" ]; then
            PROMPT_COMMAND="log_bash_command"
        elif [[ "$PROMPT_COMMAND" != *"log_bash_command"* ]]; then
            PROMPT_COMMAND="log_bash_command; $PROMPT_COMMAND"
        fi
        
        # Log immediately, don't wait for session to close
        if [[ "$PROMPT_COMMAND" != *"history -a"* ]]; then
            PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
        fi
    else
        # Non-interactive shell - use DEBUG trap to catch command execution
        # This catches SSH commands like: ssh user@host 'command'
        if [ -n "$SSH_CONNECTION" ]; then
            # Function to log commands via DEBUG trap
            log_bash_debug() {
                local cmd="$BASH_COMMAND"
                # Skip logging the logger command itself and our own functions
                if [[ "$cmd" != logger* ]] && [[ "$cmd" != log_bash_* ]] && [ "$cmd" != "$LAST_DEBUG_COMMAND" ]; then
                    logger -t bash_command -p local6.info "USER=$USER PWD=$PWD SSH_CLIENT=\"$SSH_CLIENT\" SSH_CONNECTION=\"$SSH_CONNECTION\" NON_INTERACTIVE: $cmd"
                    export LAST_DEBUG_COMMAND="$cmd"
                fi
            }
            
            # Set DEBUG trap to log every command
            trap 'log_bash_debug' DEBUG
        fi
    fi

    # Ensure bash history is enabled and comprehensive
    shopt -s histappend
    HISTSIZE=10000
    HISTFILESIZE=20000
    HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S "
    HISTCONTROL=
fi

# Zsh logging
if [ -n "$ZSH_VERSION" ]; then
    # Mark as loaded
    export ZSH_LOGGING_LOADED=1
    
    # Function to log commands to syslog for zsh
    log_zsh_command() {
        local cmd="$1"
        if [ -n "$cmd" ] && [ "$cmd" != "$LAST_ZSH_COMMAND" ]; then
            local mode="COMMAND"
            [ -z "$PS1" ] && mode="NON_INTERACTIVE"
            logger -t zsh_command -p local6.info "USER=$USER PWD=$PWD SSH_CLIENT=\"$SSH_CLIENT\" SSH_CONNECTION=\"$SSH_CONNECTION\" $mode: $cmd"
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
