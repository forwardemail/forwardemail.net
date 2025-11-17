/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');
const { exec } = require('node:child_process');
const { promisify } = require('node:util');

const { Octokit } = require('@octokit/rest');

const execAsync = promisify(exec);

const config = require('#config');
const logger = require('#helpers/logger');
const ollamaClient = require('#helpers/customer-support-ai/ollama-client');

class KnowledgeBaseScraper {
  constructor() {
    this.hasToken = Boolean(config.githubOctokitToken);
    this.octokit = this.hasToken
      ? new Octokit({
          auth: config.githubOctokitToken
        })
      : null;
    this.owner = 'forwardemail';
    this.repo = 'forwardemail.net';

    if (!this.hasToken) {
      logger.warn(
        'GITHUB_OCTOKIT_TOKEN not set - GitHub content will be skipped'
      );
    }
  }

  /**
   * Scrape all knowledge base content
   * @returns {Promise<Array>} Array of documents with text and metadata
   */
  async scrapeAll() {
    try {
      logger.info('Starting knowledge base scraping');

      const documents = [];

      // 1. Parse local Markdown files from app/views
      const markdownDocs = await this.parseLocalMarkdown();
      documents.push(...markdownDocs);

      // 2. Fetch GitHub content (if token available)
      if (this.hasToken) {
        const issues = await this.fetchGitHubIssues();
        documents.push(...issues);

        const discussions = await this.fetchGitHubDiscussions();
        documents.push(...discussions);

        const prs = await this.fetchGitHubPRs();
        documents.push(...prs);
      } else {
        logger.info('Skipping GitHub content (no token)');
      }

      // 5. Parse technical whitepaper PDF
      const whitepaperDocs = await this.parsePDF(
        path.join(process.cwd(), 'assets', 'technical-whitepaper.pdf')
      );
      documents.push(...whitepaperDocs);

      // 6. Parse API spec JSON
      const apiSpecDocs = await this.parseAPISpec(
        path.join(process.cwd(), 'assets', 'api-spec.json')
      );
      documents.push(...apiSpecDocs);

      logger.info('Knowledge base scraping complete', {
        totalDocuments: documents.length
      });

      return documents;
    } catch (err) {
      logger.error('Knowledge base scraping failed', { error: err });
      throw err;
    }
  }

  /**
   * Parse local Markdown files from app/views directory
   * @returns {Promise<Array>} Array of documents
   */
  async parseLocalMarkdown() {
    try {
      const viewsDir = path.join(process.cwd(), 'app', 'views');
      logger.info('Parsing local Markdown files', { dir: viewsDir });

      const documents = [];

      // Recursively find all .md files
      const markdownFiles = await this.findMarkdownFiles(viewsDir);

      for (const filePath of markdownFiles) {
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const relativePath = path.relative(viewsDir, filePath);

          // Special handling for FAQ files
          if (relativePath.includes('faq/')) {
            const faqDocs = await this.parseFAQFile(content, relativePath);
            documents.push(...faqDocs);
          } else {
            // Regular markdown file
            const summary = await this.summarizeContent(content, relativePath);

            documents.push({
              content: summary,
              metadata: {
                source: 'local_markdown',
                path: relativePath,
                type: 'documentation',
                originalLength: content.length
              }
            });
          }

          logger.debug('Parsed Markdown file', {
            path: relativePath,
            originalLength: content.length
          });
        } catch (err) {
          logger.error('Failed to parse Markdown file', {
            path: filePath,
            error: err
          });
        }
      }

      logger.info('Local Markdown parsing complete', {
        filesProcessed: documents.length
      });

      return documents;
    } catch (err) {
      logger.error('Failed to parse local Markdown', { error: err });
      return [];
    }
  }

  /**
   * Parse FAQ file into Q&A pairs
   * @param {string} content FAQ file content
   * @param {string} filePath File path for metadata
   * @returns {Promise<Array>} Array of Q&A documents
   */
  async parseFAQFile(content, filePath) {
    const documents = [];

    try {
      // Split by headings (#, ##, ###, ####)
      // Match any heading level and capture the heading text
      const headingRegex = /^(#{1,4})\s+(.+)$/gm;
      const sections = [];
      let match;
      let lastIndex = 0;

      while ((match = headingRegex.exec(content)) !== null) {
        // If this isn't the first match, save the previous section
        if (sections.length > 0 || match.index > 0) {
          const sectionContent = content.slice(lastIndex, match.index).trim();
          if (sectionContent) {
            sections.push(sectionContent);
          }
        }

        lastIndex = match.index;
      }

      // Add the last section
      if (lastIndex < content.length) {
        const sectionContent = content.slice(lastIndex).trim();
        if (sectionContent) {
          sections.push(sectionContent);
        }
      }

      // Filter out non-question sections
      const questionSections = sections.filter((s) => {
        const firstLine = s.split('\n')[0];
        return /^#{1,4}\s+/.test(firstLine);
      });

      for (const section of questionSections) {
        const lines = section.split('\n');
        // Remove heading markers (#, ##, ###, ####) from question
        const question = lines[0].replace(/^#{1,4}\s+/, '').trim();

        // Skip if not a question-like heading
        if (!question || question.length < 10) continue;

        // Get the answer (everything after the question until next section)
        const answer = lines.slice(1).join('\n').trim();

        // Skip if no answer
        if (!answer || answer.length < 20) continue;

        // Create Q&A pair
        const qaText = `Q: ${question}\n\nA: ${answer}`;

        // Summarize if too long
        const summary =
          qaText.length > 2000
            ? await this.summarizeContent(qaText, `FAQ: ${question}`)
            : qaText;

        // Determine question type for better classification
        const questionType = this.classifyQuestion(question);

        documents.push({
          content: summary,
          metadata: {
            source: 'faq',
            path: filePath,
            type: 'qa_pair',
            question,
            questionType,
            originalLength: qaText.length
          }
        });
      }

      logger.info('FAQ parsing complete', {
        path: filePath,
        qaPairs: documents.length
      });
    } catch (err) {
      logger.error('Failed to parse FAQ file', { path: filePath, error: err });
    }

    return documents;
  }

  /**
   * Classify question type for better retrieval
   * @param {string} question Question text
   * @returns {string} Question type
   */
  classifyQuestion(question) {
    const lower = question.toLowerCase();

    if (lower.startsWith('how do i') || lower.startsWith('how to')) {
      return 'how_to';
    }

    if (lower.startsWith('what is') || lower.startsWith('what are')) {
      return 'definition';
    }

    if (lower.startsWith('why')) {
      return 'explanation';
    }

    if (lower.startsWith('can i') || lower.startsWith('do you support')) {
      return 'capability';
    }

    if (lower.includes('not working') || lower.includes('error')) {
      return 'troubleshooting';
    }

    if (lower.includes('configure') || lower.includes('set up')) {
      return 'configuration';
    }

    return 'general';
  }

  /**
   * Recursively find all Markdown files in a directory
   * @param {string} dir Directory to search
   * @returns {Promise<Array<string>>} Array of file paths
   */
  async findMarkdownFiles(dir) {
    const files = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively search subdirectories
          const subFiles = await this.findMarkdownFiles(fullPath);
          files.push(...subFiles);
        } else if (
          entry.isFile() &&
          entry.name.endsWith('.md') && // Only include index.md, not language variants like index-es.md
          (entry.name === 'index.md' || !entry.name.startsWith('index-'))
        ) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      logger.error('Failed to read directory', { dir, error: err });
    }

    return files;
  }

  /**
   * Summarize content using Ollama before embedding
   * @param {string} content Original content
   * @param {string} context Context for summarization
   * @returns {Promise<string>} Summarized content
   */
  async summarizeContent(content, context = '') {
    try {
      // If content is short enough, return as-is
      if (content.length < 2000) {
        return content;
      }

      const prompt = `Summarize the following documentation content from ${context}. Keep all important technical details, commands, and examples. Make it concise but comprehensive:

${content}

Summary:`;

      const summary = await ollamaClient.generate(prompt, {
        maxTokens: 1000
      });

      return summary || content;
    } catch (err) {
      logger.error('Failed to summarize content', { context, error: err });
      // Return original content if summarization fails
      return content;
    }
  }

  /**
   * Fetch GitHub issues
   * @returns {Promise<Array>} Array of issue documents
   */
  async fetchGitHubIssues() {
    try {
      logger.info('Fetching GitHub issues');

      const { data: issues } = await this.octokit.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: 'all',
        per_page: 100,
        sort: 'updated',
        direction: 'desc'
      });

      const documents = [];

      for (const issue of issues) {
        // Skip pull requests (they're fetched separately)
        if (issue.pull_request) continue;

        const text = `Issue #${issue.number}: ${issue.title}\n\n${
          issue.body || ''
        }`;

        // Summarize before embedding
        const summary = await this.summarizeContent(
          text,
          `GitHub Issue #${issue.number}`
        );

        documents.push({
          content: summary,
          metadata: {
            source: 'github_issue',
            issueNumber: issue.number,
            title: issue.title,
            state: issue.state,
            url: issue.html_url,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
            labels: issue.labels.map((l) => l.name),
            originalLength: text.length
          }
        });
      }

      logger.info('GitHub issues fetched', { count: documents.length });

      return documents;
    } catch (err) {
      logger.error('Failed to fetch GitHub issues', { error: err });
      return [];
    }
  }

  /**
   * Fetch GitHub discussions
   * @returns {Promise<Array>} Array of discussion documents
   */
  async fetchGitHubDiscussions() {
    try {
      logger.info('Fetching GitHub discussions');

      // Use GraphQL API for discussions
      const query = `
        query($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            discussions(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                number
                title
                body
                url
                createdAt
                updatedAt
                category {
                  name
                }
              }
            }
          }
        }
      `;

      const result = await this.octokit.graphql(query, {
        owner: this.owner,
        repo: this.repo
      });

      const discussions = result.repository.discussions.nodes;
      const documents = [];

      for (const discussion of discussions) {
        const text = `Discussion #${discussion.number}: ${
          discussion.title
        }\n\n${discussion.body || ''}`;

        // Summarize before embedding
        const summary = await this.summarizeContent(
          text,
          `GitHub Discussion #${discussion.number}`
        );

        documents.push({
          content: summary,
          metadata: {
            source: 'github_discussion',
            discussionNumber: discussion.number,
            title: discussion.title,
            category: discussion.category?.name,
            url: discussion.url,
            createdAt: discussion.createdAt,
            updatedAt: discussion.updatedAt,
            originalLength: text.length
          }
        });
      }

      logger.info('GitHub discussions fetched', { count: documents.length });

      return documents;
    } catch (err) {
      logger.error('Failed to fetch GitHub discussions', { error: err });
      return [];
    }
  }

  /**
   * Fetch GitHub pull requests
   * @returns {Promise<Array>} Array of PR documents
   */
  async fetchGitHubPRs() {
    try {
      logger.info('Fetching GitHub pull requests');

      const { data: prs } = await this.octokit.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'all',
        per_page: 100,
        sort: 'updated',
        direction: 'desc'
      });

      const documents = [];

      for (const pr of prs) {
        const text = `Pull Request #${pr.number}: ${pr.title}\n\n${
          pr.body || ''
        }`;

        // Summarize before embedding
        const summary = await this.summarizeContent(
          text,
          `GitHub PR #${pr.number}`
        );

        documents.push({
          content: summary,
          metadata: {
            source: 'github_pr',
            prNumber: pr.number,
            title: pr.title,
            state: pr.state,
            merged: pr.merged_at !== null,
            url: pr.html_url,
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            labels: pr.labels.map((l) => l.name),
            originalLength: text.length
          }
        });
      }

      logger.info('GitHub pull requests fetched', { count: documents.length });

      return documents;
    } catch (err) {
      logger.error('Failed to fetch GitHub pull requests', { error: err });
      return [];
    }
  }

  /**
   * Parse PDF file using pdftotext
   * @param {string} filePath Path to PDF file
   * @returns {Promise<Array>} Array of documents
   */
  async parsePDF(filePath) {
    try {
      logger.info('Parsing PDF file', { path: filePath });

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        logger.warn('PDF file not found', { path: filePath });
        return [];
      }

      // Use pdftotext (from poppler-utils) to extract text
      const { stdout } = await execAsync(`pdftotext "${filePath}" -`);
      const text = stdout.trim();

      if (!text || text.length < 100) {
        logger.warn('PDF extraction returned no content', { path: filePath });
        return [];
      }

      // Split by paragraphs (double newline) to maintain semantic boundaries
      const paragraphs = text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 50); // Skip very short paragraphs

      // Group paragraphs into chunks without cutting mid-paragraph
      const chunks = [];
      let currentChunk = '';
      const maxChunkSize = 3000; // Larger chunks since we're not cutting mid-paragraph

      for (const paragraph of paragraphs) {
        // If adding this paragraph would exceed max size, start new chunk
        if (
          currentChunk.length > 0 &&
          currentChunk.length + paragraph.length > maxChunkSize
        ) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }

        // Add paragraph to current chunk
        currentChunk += paragraph + '\n\n';
      }

      // Add the last chunk
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      const documents = [];
      for (const [index, chunk] of chunks.entries()) {
        // Summarize each chunk before embedding
        const summary = await this.summarizeContent(
          chunk,
          `Technical Whitepaper (Section ${index + 1}/${chunks.length})`
        );

        documents.push({
          content: summary,
          metadata: {
            source: 'technical_whitepaper',
            path: filePath,
            type: 'pdf',
            chunkIndex: index,
            totalChunks: chunks.length,
            originalLength: chunk.length
          }
        });
      }

      logger.info('PDF parsing complete', {
        path: filePath,
        chunks: documents.length
      });

      return documents;
    } catch (err) {
      logger.error('Failed to parse PDF', { path: filePath, error: err });
      return [];
    }
  }

  /**
   * Parse API spec JSON file
   * @param {string} filePath Path to JSON file
   * @returns {Promise<Array>} Array of documents
   */
  async parseAPISpec(filePath) {
    try {
      logger.info('Parsing API spec JSON', { path: filePath });

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        logger.warn('API spec file not found', { path: filePath });
        return [];
      }

      const content = await fs.readFile(filePath, 'utf8');
      const apiSpec = JSON.parse(content);

      const documents = [];

      // Parse each endpoint
      if (apiSpec.paths) {
        for (const [endpoint, methods] of Object.entries(apiSpec.paths)) {
          for (const [method, spec] of Object.entries(methods)) {
            // Skip non-method keys
            if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
              continue;
            }

            // Build comprehensive endpoint documentation
            let text = `API Endpoint: ${method.toUpperCase()} ${endpoint}\n\n`;

            if (spec.summary) {
              text += `Summary: ${spec.summary}\n\n`;
            }

            if (spec.description) {
              text += `Description: ${spec.description}\n\n`;
            }

            // Parameters
            if (spec.parameters && spec.parameters.length > 0) {
              text += 'Parameters:\n';
              for (const param of spec.parameters) {
                text += `- ${param.name} (${param.in}): ${
                  param.description || 'No description'
                }\n`;
                if (param.required) text += '  Required: Yes\n';
                if (param.schema) {
                  text += `  Type: ${param.schema.type || 'unknown'}\n`;
                }
              }

              text += '\n';
            }

            // Request body
            if (spec.requestBody) {
              text += 'Request Body:\n';
              if (spec.requestBody.description) {
                text += `${spec.requestBody.description}\n`;
              }

              if (spec.requestBody.content) {
                for (const [contentType, schema] of Object.entries(
                  spec.requestBody.content
                )) {
                  text += `Content-Type: ${contentType}\n`;
                  if (schema.example) {
                    text += `Example: ${JSON.stringify(
                      schema.example,
                      null,
                      2
                    )}\n`;
                  }
                }
              }

              text += '\n';
            }

            // Responses
            if (spec.responses) {
              text += 'Responses:\n';
              for (const [statusCode, response] of Object.entries(
                spec.responses
              )) {
                text += `${statusCode}: ${
                  response.description || 'No description'
                }\n`;
                if (response.content) {
                  for (const [, schema] of Object.entries(response.content)) {
                    if (schema.example) {
                      text += `Example Response: ${JSON.stringify(
                        schema.example,
                        null,
                        2
                      )}\n`;
                    }
                  }
                }
              }
            }

            // Summarize if too long
            const summary =
              text.length > 2000
                ? await this.summarizeContent(
                    text,
                    `API: ${method.toUpperCase()} ${endpoint}`
                  )
                : text;

            documents.push({
              content: summary,
              metadata: {
                source: 'api_spec',
                path: filePath,
                type: 'api_endpoint',
                endpoint,
                method: method.toUpperCase(),
                originalLength: text.length
              }
            });
          }
        }
      }

      logger.info('API spec parsing complete', {
        path: filePath,
        endpoints: documents.length
      });

      return documents;
    } catch (err) {
      logger.error('Failed to parse API spec', { path: filePath, error: err });
      return [];
    }
  }
}

module.exports = new KnowledgeBaseScraper();
