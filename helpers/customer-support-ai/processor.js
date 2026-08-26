/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const logger = require('#helpers/logger');

class DocumentProcessor {
  constructor() {
    this.chunkSize = 1000;
    this.chunkOverlap = 200;
    // Above this, a Q&A pair is no longer "one question, one embeddable
    // answer" - it's something like a full TLD allowlist or a multi-step
    // guide covering several clients. Below it, keep the pair whole so
    // retrieval always returns the complete answer instead of a fragment.
    this.qaWholeThreshold = 3000;
    // Target size for the paragraph-grouped sub-chunks used above that
    // threshold - matches the paragraph-aware chunking already used for
    // the technical whitepaper in scraper.js parsePDF().
    this.qaSubChunkSize = 1500;
  }

  /**
   * Split an oversized Q&A pair's answer on paragraph boundaries (never
   * mid-sentence) into ~qaSubChunkSize chunks, each re-prefixed with the
   * original question so a fragment retrieved on its own still carries
   * enough context to be useful.
   */
  chunkOversizedQAPair(doc) {
    const { question } = doc.metadata;
    const answer = doc.content.replace(/^Q:.*\n\nA:\s*/s, '');

    // Prose paragraphs are blank-line separated, but embedded HTML blocks
    // (a <ul> of a hundred <li> TLD codes, a <table>) often aren't - the
    // whole block reads as a single "paragraph" with no blank lines inside
    // it. Recursively fall back to single-newline, then hard character
    // slicing, so one dense block can't blow past the target chunk size.
    function splitUnit(unit, splitter, fallback) {
      if (unit.length <= this.qaSubChunkSize) return [unit];
      const parts = unit
        .split(splitter)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length > 1) return parts.flatMap((p) => fallback(p));
      // Splitter found no boundary at all (one huge line/paragraph) - hard
      // slice as a last resort rather than emit a single oversized chunk.
      const slices = [];
      for (let i = 0; i < unit.length; i += this.qaSubChunkSize)
        slices.push(unit.slice(i, i + this.qaSubChunkSize));
      return slices;
    }

    const byLine = (p) => splitUnit.call(this, p, /\n/, (l) => [l]);
    const units = splitUnit.call(this, answer, /\n\n+/, byLine).filter(Boolean);

    const groups = [];
    let current = '';
    for (const unit of units) {
      if (current && current.length + unit.length > this.qaSubChunkSize) {
        groups.push(current.trim());
        current = '';
      }

      current += unit + '\n\n';
    }

    if (current.trim()) groups.push(current.trim());

    return groups.map((group, index) => ({
      text: `Q: ${question}\n\nA: ${group}`,
      metadata: {
        ...doc.metadata,
        chunkIndex: index,
        totalChunks: groups.length
      }
    }));
  }

  chunkText(text, metadata = {}) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      const chunk = text.slice(start, end);

      chunks.push({
        text: chunk,
        metadata: {
          ...metadata,
          chunkIndex: chunks.length,
          startOffset: start,
          endOffset: end
        }
      });

      start += this.chunkSize - this.chunkOverlap;
    }

    return chunks;
  }

  processDocuments(documents) {
    const allChunks = [];

    for (const doc of documents) {
      if (!doc || !doc.content) continue;

      // scraper.js always nests these under doc.metadata (source, path,
      // type, title, ...) - not flat top-level fields on doc itself.
      const metadata = doc.metadata || {};

      // FAQ Q&A pairs are already the correct retrieval unit - scraper.js
      // split them at heading boundaries specifically so each one stays a
      // single self-contained question+answer. Re-slicing one into fixed
      // 1000-char windows here would cut answers off mid-sentence and
      // silently drop the second half from retrieval, so keep them whole -
      // except the rare oversized ones (TLD lists, multi-client setup
      // guides), which get paragraph-aware sub-chunking instead.
      let chunks;
      if (metadata.type === 'qa_pair') {
        chunks =
          doc.content.length > this.qaWholeThreshold
            ? this.chunkOversizedQAPair(doc)
            : [
                {
                  text: doc.content,
                  metadata: { ...metadata, chunkIndex: 0, totalChunks: 1 }
                }
              ];
      } else {
        chunks = this.chunkText(doc.content, metadata);
      }

      allChunks.push(...chunks);
    }

    logger.info({ count: allChunks.length }, 'Processed documents into chunks');

    return allChunks;
  }

  prepareForVectorStore(chunks, embeddings) {
    return chunks.map((chunk, index) => ({
      id: crypto.randomUUID(),
      text: chunk.text,
      embedding: embeddings[index],
      metadata: chunk.metadata
    }));
  }
}

module.exports = new DocumentProcessor();
