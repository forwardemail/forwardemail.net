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
    // Updated to nomic-embed-text (45.7M pulls, better performance than nomic-embed-text)
    this.embeddingModel = config.ollamaEmbeddingModel || 'nomic-embed-text';
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
      const response = await axios.post(
        `${this.host}/api/generate`,
        {
          model: options.model || this.model,
          prompt,
          stream: false,
          options: {
            temperature: options.temperature || this.temperature,
            num_predict: options.maxTokens || this.maxTokens
          }
        },
        {
          timeout: 120_000
        }
      );

      return response.data.response;
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

  async generateEmbeddings(texts) {
    const embeddings = [];
    for (const text of texts) {
      try {
        const embedding = await this.generateEmbedding(text);
        embeddings.push(embedding);
      } catch (err) {
        logger.error(err, { context: 'batch embeddings' });
        embeddings.push(null);
      }
    }

    return embeddings;
  }
}

module.exports = new OllamaClient();
