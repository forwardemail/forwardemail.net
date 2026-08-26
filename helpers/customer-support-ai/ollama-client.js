/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const axios = require('axios');

const logger = require('#helpers/logger');
const config = require('#config');

class OllamaClient {
  constructor() {
    // Force IPv4 by using 127.0.0.1 instead of localhost
    const host = config.ollamaHost || 'http://localhost:11434';
    this.host = host.replace('localhost', '127.0.0.1');
    this.model = config.ollamaModel || 'gpt-oss:20b';
    // Updated to mxbai-embed-large (45.7M pulls, better performance than mxbai-embed-large)
    this.embeddingModel = config.ollamaEmbeddingModel || 'mxbai-embed-large';
    this.temperature = config.ollamaTemperature || 0.7;
    this.maxTokens = config.ollamaMaxTokens || 2000;
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.host}/api/tags`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (err) {
      logger.error(err, { context: 'ollama health check' });
      return false;
    }
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.host}/api/tags`);
      return response.data.models || [];
    } catch (err) {
      logger.error(err, { context: 'ollama list models' });
      return [];
    }
  }

  async generate(prompt, options = {}) {
    try {
      // /api/chat, not /api/generate: /api/generate sends a raw prompt
      // string that Ollama wraps into the chat template as a single
      // synthetic message, but that path doesn't reliably exercise the
      // template's thinking-mode handling the way a real Messages array
      // does - verified empirically that /api/chat correctly separates
      // `content`/`thinking` even in the exact short-answer case where
      // /api/generate left `response` empty with everything dumped into
      // `thinking` instead (no way to tell apart from a genuine failure
      // without the done_reason check below).
      const response = await axios.post(
        `${this.host}/api/chat`,
        {
          model: options.model || this.model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
          ...(options.format ? { format: options.format } : {}),
          // Hybrid-reasoning models (e.g. Qwen3) reason regardless of this
          // flag - verified empirically that think: false does not reduce
          // reasoning length or skip it, it only stops Ollama from
          // separating it out, so the raw unmarked reasoning gets dumped
          // into `content` instead. think: true costs nothing extra and
          // gets a clean `content` (final answer only) with reasoning
          // isolated in a separate `thinking` field.
          think: options.think ?? true,
          options: {
            // ?? (not ||) so an explicit temperature: 0 isn't discarded.
            temperature: options.temperature ?? this.temperature,
            num_predict: options.maxTokens || this.maxTokens
          }
        },
        {
          timeout: options.timeout || 120_000
        }
      );

      // done_reason === 'length' means num_predict ran out before the
      // model considered itself done - the reasoning phase, the answer
      // itself, or both may be cut off mid-sentence, and there's no
      // reliable way to tell from the text alone. Fail loudly rather than
      // risk silently serving an incomplete response as if it were
      // complete - callers (e.g. response-generator's
      // generateWithFallback) already have a clean fallback path for
      // thrown errors.
      if (response.data.done_reason === 'length') {
        throw new Error(
          `ollama generate hit num_predict before finishing (${
            (response.data.message?.content || '').length
          } chars produced)`
        );
      }

      // For short/direct answers the model can still fail to emit a
      // closing </think> even via /api/chat - rare, but fall back to
      // `thinking` rather than silently return nothing if `content` is
      // ever empty.
      return (
        response.data.message?.content ||
        response.data.message?.thinking ||
        ''
      ).trim();
    } catch (err) {
      logger.error(err, { context: 'ollama generate', prompt });
      throw err;
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await axios.post(
        `${this.host}/api/embeddings`,
        {
          model: this.embeddingModel,
          prompt: text
        },
        {
          timeout: 30_000
        }
      );

      return response.data.embedding;
    } catch (err) {
      logger.error(err, { context: 'ollama embedding', text });
      throw err;
    }
  }

  async generateEmbeddings(texts, concurrency = 8) {
    const embeddings = Array.from({ length: texts.length });
    let index = 0;

    const worker = async () => {
      while (index < texts.length) {
        const i = index++;
        try {
          embeddings[i] = await this.generateEmbedding(texts[i]);
        } catch (err) {
          logger.error(err, { context: 'batch embeddings' });
          embeddings[i] = null;
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(concurrency, texts.length) }, worker)
    );

    return embeddings;
  }
}

module.exports = new OllamaClient();
