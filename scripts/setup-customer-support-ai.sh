#!/usr/bin/env bash

# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1

set -e

echo "=== Forward Email Customer Support AI Setup ==="
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    echo "🍎 Detected macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    echo "🐧 Detected Linux"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed"
    if [ "$OS" = "macos" ]; then
        echo "Install with: brew install ollama"
    else
        echo "Install with: curl -fsSL https://ollama.com/install.sh | sh"
    fi
    exit 1
fi

echo "✅ Ollama is installed"

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "❌ Ollama is not running"
    echo "Start with: ollama serve"
    exit 1
fi

echo "✅ Ollama is running"

# Detect system RAM
if [ "$OS" = "macos" ]; then
    TOTAL_RAM=$(sysctl -n hw.memsize)
    TOTAL_RAM_GB=$((TOTAL_RAM / 1024 / 1024 / 1024))
else
    TOTAL_RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
fi

echo "📊 Detected ${TOTAL_RAM_GB}GB RAM"
echo ""

# Recommend model based on RAM
if [ "$TOTAL_RAM_GB" -ge 32 ]; then
    RECOMMENDED_MODEL="gpt-oss:20b"
    echo "💡 Recommended model: Qwen2.5-Coder-7B (technical support)"
elif [ "$TOTAL_RAM_GB" -ge 16 ]; then
    RECOMMENDED_MODEL="gpt-oss:20b"
    echo "💡 Recommended model: Qwen2.5-Coder-7B (best for your RAM)"
else
    RECOMMENDED_MODEL="mistral:7b"
    echo "💡 Recommended model: Mistral 7B (lightweight)"
fi

echo ""
echo "=== Installing Models ==="
echo ""

# Pull recommended model
echo "📥 Pulling ${RECOMMENDED_MODEL}..."
ollama pull "$RECOMMENDED_MODEL"

# Pull embedding model
echo "📥 Pulling nomic-embed-text..."
ollama pull nomic-embed-text

echo ""
echo "✅ Models installed successfully"
echo ""

# Install LanceDB
echo "=== Installing LanceDB ==="
echo ""

if [ -f "package.json" ]; then
    echo "Installing @lancedb/lancedb package via pnpm..."
    pnpm install @lancedb/lancedb
    echo "✅ LanceDB installed"
else
    echo "⚠️  package.json not found, skipping pnpm install"
    echo "Run 'pnpm install @lancedb/lancedb' manually"
fi
echo ""

# Jobs can be run manually:
# - node jobs/customer-support-ai/update-knowledge-base.js
# - node jobs/customer-support-ai/process-inbox.js
# - node jobs/customer-support-ai/train-from-history.js

echo ""
echo "=== Configuration ==="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Creating .env with customer support AI configuration..."
    echo ""

    cat >> .env << EOF

# Customer Support AI Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=${RECOMMENDED_MODEL}
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_TEMPERATURE=0.7
OLLAMA_MAX_TOKENS=2000
LANCEDB_PATH=$HOME/.local/share/lancedb
CUSTOMER_SUPPORT_AI_INBOX_LIMIT=10

# Forward Email API (fill these in)
# FORWARD_EMAIL_ALIAS_USERNAME=support@yourdomain.com
# FORWARD_EMAIL_ALIAS_PASSWORD=your_alias_password

# Note: Uses existing GITHUB_OCTOKIT_TOKEN for GitHub API access
EOF

    echo "✅ Configuration added to .env"
    echo "⚠️  Please fill in your Forward Email API credentials"
else
    echo "✅ .env file exists"
    echo "💡 Make sure to add customer support AI configuration"
fi

echo ""
echo "=== Next Steps ==="
echo ""
echo "1. Fill in Forward Email API credentials in .env"
echo "2. LanceDB will automatically create database on first use"
echo "3. Update knowledge base: node jobs/customer-support-ai/update-knowledge-base.js"
echo "4. Process inbox: node jobs/customer-support-ai/process-inbox.js"
echo ""
echo "📚 Documentation: CUSTOMER_SUPPORT.md"
echo ""
echo "✅ Setup complete!"
