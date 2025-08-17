/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const superagent = require('superagent');
const Boom = require('@hapi/boom');
const LRU = require('lru-cache');
const pRetry = require('p-retry');
const config = require('#config');

class InquiryApi {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || config.urls.api;
    this.supportEmail = options.supportEmail || config.supportEmail;
    this.apiKey = options.apiKey; // API key for authentication
    this.aliasUsername = options.aliasUsername; // For alias-specific endpoints  
    this.aliasPassword = options.aliasPassword; // For alias-specific endpoints
    this.timeout = options.timeout || 30000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
    
    // Initialize cache for API responses
    this.cache = new LRU({
      max: 1000, // Maximum 1000 cached items
      ttl: 1000 * 60 * 5 // 5 minute TTL
    });
    
    // Rate limiting
    this.lastRequestTime = 0;
    this.minRequestInterval = options.minRequestInterval || 100; // 100ms between requests
  }

  async listMessages(params = {}) {
    try {
      const query = {
        // Remove default folder restriction for now
        limit: params.limit || 50,
        page: params.page || 1,
        pagination: true,
        ...params
      };

      console.log('InquiryApi.listMessages query:', { query });

      const response = await this._makeRequest('GET', `${this.apiUrl}/v1/messages`, { query });
      
      console.log('InquiryApi.listMessages response status:', response.status);
      console.log('InquiryApi.listMessages response headers:', response.headers);
      console.log('InquiryApi.listMessages response body type:', typeof response.body);
      console.log('InquiryApi.listMessages response body length:', Array.isArray(response.body) ? response.body.length : 'not array');
      
      if (response.body && Array.isArray(response.body) && response.body.length > 0) {
        console.log('InquiryApi.listMessages first message sample:', {
          id: response.body[0].id,
          subject: response.body[0].subject,
          from: response.body[0].from,
          folder: response.body[0].folder,
          keys: Object.keys(response.body[0])
        });
      }

      return {
        messages: response.body || [],
        pagination: {
          page: parseInt(response.headers['x-page-current']) || 1,
          pageCount: parseInt(response.headers['x-page-count']) || 1,
          itemCount: parseInt(response.headers['x-item-count']) || 0,
          pageSize: parseInt(response.headers['x-page-size']) || 0
        }
      };
    } catch (err) {
      throw this._handleError(err, 'Failed to list messages');
    }
  }

  async getMessage(messageId, options = {}) {
    try {
      const response = await this._makeRequest('GET', `${this.apiUrl}/v1/messages/${messageId}`);
      const message = response.body;
      
      // Enhanced message content parsing
      console.log('InquiryApi getMessage - raw message fields:', Object.keys(message));
      console.log('InquiryApi getMessage - text preview:', message.text?.substring(0, 200));
      console.log('InquiryApi getMessage - html preview:', message.html?.substring(0, 200));
      
      if (message) {
        // Try to extract content from various fields
        let extractedText = message.text || message.textAsHtml || message.snippet || '';
        
        if (extractedText) {
          // Remove email headers from text content
          const headerPattern = /^(ARC-Seal|ARC-Message-Signature|ARC-Authentication-Results|Received|X-Original-To|X-Forward-Email|DKIM-Signature|Content-Type|MIME-Version|Message-ID|Date|From|To|Subject|Reply-To|Return-Path|List-Unsubscribe|Feedback-ID):\s+.*$/gmi;
          
          let cleanedText = extractedText
            .replace(headerPattern, '')
            .replace(/^[A-Za-z-]+:\s+.*$/gm, '') // Remove any remaining headers
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/^\s*\n+/, '') // Remove leading empty lines
            .trim();
          
          // If we've removed too much and the text is very short, try different approaches
          if (cleanedText.length < 20 && extractedText.length > 100) {
            // Try to extract just the body content after headers
            const bodyMatch = extractedText.match(/\n\n(.*)$/s);
            if (bodyMatch && bodyMatch[1].trim().length > 20) {
              cleanedText = bodyMatch[1].trim();
            } else {
              // Try to find content after a blank line
              const lines = extractedText.split('\n');
              let foundBlank = false;
              let bodyLines = [];
              
              for (const line of lines) {
                if (!foundBlank && line.trim() === '') {
                  foundBlank = true;
                  continue;
                }
                if (foundBlank && !line.match(/^[A-Za-z-]+:\s+/)) {
                  bodyLines.push(line);
                }
              }
              
              if (bodyLines.length > 0) {
                cleanedText = bodyLines.join('\n').trim();
              } else {
                cleanedText = extractedText; // Keep original if all else fails
              }
            }
          }
          
          message.text = cleanedText;
          console.log('InquiryApi getMessage - cleaned text:', cleanedText.substring(0, 200));
        }
      }
      
      return message;
    } catch (err) {
      throw this._handleError(err, 'Failed to retrieve message');
    }
  }

  async getConversationThread(messageId) {
    try {
      // First get the message to extract thread information
      const message = await this.getMessage(messageId);

      console.log({ message });
      
      if (!message.thread_id) {
        return [message];
      }

      // Get all messages and filter by thread_id client-side
      // since thread_id is not supported as a query parameter
      const allMessages = await this.listMessages({
        limit: 200, // Get more messages to ensure we capture the full thread
        folder: 'INBOX'
      });

      // Filter messages that belong to the same thread
      const threadMessages = allMessages.messages.filter(msg => 
        msg.thread_id === message.thread_id
      );

      // If no thread messages found, fall back to just the original message
      if (threadMessages.length === 0) {
        return [message];
      }

      return threadMessages.sort((a, b) => 
        new Date(a.internal_date) - new Date(b.internal_date)
      );
    } catch (err) {
      throw this._handleError(err, 'Failed to retrieve conversation thread');
    }
  }

  async markAsResolved(messageId) {
    try {
      console.log('Marking message as resolved and moving to Archive:', messageId);
      
      // Step 1: Mark message as answered with \Answered flag
      try {
        const flagResponse = await this._makeRequest('PUT', `${this.apiUrl}/v1/messages/${messageId}/flags`, {
          body: { flags: ['\\Answered'], action: 'add' }
        });
        console.log('Successfully added \\Answered flag:', flagResponse.status);
      } catch (flagError) {
        console.log('Flag update failed (expected if not supported):', flagError.status);
        // Continue with move operation even if flag update fails
      }
      
      // Step 2: Move message to Archive folder
      try {
        const moveResponse = await this._makeRequest('PUT', `${this.apiUrl}/v1/messages/${messageId}/move`, {
          body: { folder: 'Archive' }
        });
        console.log('Successfully moved to Archive folder:', moveResponse.status);
        return { success: true, messageId, resolved: true, moved: true };
      } catch (moveError) {
        console.log('Move to Archive failed (expected if folder operations not supported):', moveError.status);
        // Fall back to flag-only approach
        return { success: true, messageId, resolved: true, moved: false };
      }
    } catch (err) {
      console.error('Failed to mark as resolved:', err);
      throw this._handleError(err, 'Failed to mark message as resolved');
    }
  }

  async sendReply(messageId, replyData) {
    try {
      // Get original message for reply context
      const originalMessage = await this.getMessage(messageId);
      
      const emailData = {
        to: originalMessage.envelope?.from || originalMessage.from?.address,
        subject: originalMessage.subject?.startsWith('Re:') 
          ? originalMessage.subject 
          : `Re: ${originalMessage.subject}`,
        text: replyData.message,
        html: replyData.html,
        inReplyTo: originalMessage.header_message_id,
        references: originalMessage.references || originalMessage.header_message_id,
        attachments: replyData.attachments || []
      };

      const response = await this._makeRequest('POST', `${this.apiUrl}/v1/emails`, {
        body: emailData
      });

      // Mark original as answered
      await this.markAsResolved(messageId);

      return response.body;
    } catch (err) {
      throw this._handleError(err, 'Failed to send reply');
    }
  }

  async searchMessages(searchQuery) {
    try {
      const query = {
        q: searchQuery,
        folder: 'INBOX',
        limit: 100,
        pagination: true
      };

      const response = await this._makeRequest('GET', `${this.apiUrl}/v1/messages`, { query });

      return {
        messages: response.body || [],
        pagination: {
          page: parseInt(response.headers['x-page-current']) || 1,
          pageCount: parseInt(response.headers['x-page-count']) || 1,
          itemCount: parseInt(response.headers['x-item-count']) || 0
        }
      };
    } catch (err) {
      throw this._handleError(err, 'Failed to search messages');
    }
  }

  async getUnresolvedMessages(params = {}) {
    try {
      // Search for messages without \Answered flag (unresolved inquiries)
      return await this.listMessages({
        ...params,
        flags: { exclude: ['\\Answered'] },
        folder: 'INBOX'
      });
    } catch (err) {
      throw this._handleError(err, 'Failed to get unresolved messages');
    }
  }

  async _makeRequest(method, url, options = {}) {
    // Execute request with retry logic
    const response = await pRetry(
      async () => {
        const request = superagent[method.toLowerCase()](url)
          .timeout(this.timeout);

        // Set authentication based on endpoint type
        if (this._isAliasEndpoint(url)) {
          console.log('using alias endpoint')
          console.log('aliasUsername', this.aliasUsername);
          console.log('aliasPassword', this.aliasPassword);
          // For alias endpoints (messages, folders, etc.) use alias credentials
          if (!this.aliasUsername || !this.aliasPassword) {
            throw new Error('Alias credentials required for this endpoint');
          }
          request.auth(this.aliasUsername, this.aliasPassword);
        } else {
          // For regular API endpoints use API key
          if (!this.apiKey) {
            throw new Error('API key required for this endpoint');
          }
          request.auth(this.apiKey, '');
        }

        if (options.query) request.query(options.query);
        if (options.body) request.send(options.body);

        return request;
      },
      {
        retries: this.retryAttempts,
        factor: 2,
        minTimeout: this.retryDelay,
        maxTimeout: this.retryDelay * 8,
        onFailedAttempt: (error) => {
          console.error(`API request attempt ${error.attemptNumber} failed:`, {
            message: error.message,
            status: error.status,
            response: error.response?.text,
            url: url,
            method: method,
            auth: this._isAliasEndpoint(url) ? 'alias' : 'api-key',
            hasCredentials: this._hasRequiredCredentials(url)
          });
        },
        shouldRetry: (error) => {
          // Retry on network errors and 5xx server errors
          return !error.status || error.status >= 500;
        }
      }
    );

    return response;
  }

  async _rateLimitDelay() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const delay = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  _handleError(err, message) {
    // Enhanced error logging for debugging
    console.error(`InquiryApi Error: ${message}`, {
      status: err.status,
      statusText: err.response?.statusText,
      message: err.message,
      responseText: err.response?.text,
      responseBody: err.response?.body,
      stack: err.stack,
      config: this.debugConfig(),
      originalError: err
    });

    console.log({
      status: err.status,
      statusText: err.response?.statusText,
      message: err.message,
      responseText: err.response?.text,
      responseBody: err.response?.body,
      stack: err.stack,
      config: this.debugConfig(),
      originalError: err
    })

    if (err.status) {
      // HTTP error from API
      const apiMessage = err.response?.body?.message || err.message;
      
      // Map specific status codes to appropriate Boom errors
      switch (err.status) {
        case 400:
          return Boom.badRequest(`${message}: ${apiMessage}`);
        case 401:
          return Boom.unauthorized(`${message}: Authentication failed`);
        case 403:
          return Boom.forbidden(`${message}: ${apiMessage}`);
        case 404:
          return Boom.notFound(`${message}: Resource not found`);
        case 429:
          return Boom.tooManyRequests(`${message}: Rate limit exceeded`);
        case 500:
        case 502:
        case 503:
        case 504:
          return Boom.badGateway(`${message}: Email API service unavailable`);
        default:
          return Boom.create(err.status, `${message}: ${apiMessage}`);
      }
    }
    
    // Network or other error
    return Boom.badImplementation(`${message}: ${err.message}`);
  }

  // Health check method
  async healthCheck() {
    try {
      await this._makeRequest('GET', `${this.apiUrl}/v1/account`);
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (err) {
      return { 
        status: 'unhealthy', 
        error: err.message,
        timestamp: new Date().toISOString() 
      };
    }
  }

  // Clear cache method
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      max: this.cache.max,
      ttl: this.cache.ttl
    };
  }

  // Determine if endpoint requires alias authentication
  _isAliasEndpoint(url) {
    const aliasEndpoints = ['/v1/messages', '/v1/folders', '/v1/contacts', '/v1/calendars'];
    return aliasEndpoints.some(endpoint => url.includes(endpoint));
  }

  // Check if we have the required credentials for this endpoint
  _hasRequiredCredentials(url) {
    if (this._isAliasEndpoint(url)) {
      return !!(this.aliasUsername && this.aliasPassword);
    } else {
      return !!this.apiKey;
    }
  }

  // Enhanced debugging method
  debugConfig() {
    return {
      apiUrl: this.apiUrl,
      supportEmail: this.supportEmail,
      hasApiKey: !!this.apiKey,
      hasAliasUsername: !!this.aliasUsername,
      hasAliasPassword: !!this.aliasPassword,
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'NOT_SET',
      aliasUsername: this.aliasUsername || 'NOT_SET'
    };
  }
}

module.exports = InquiryApi;