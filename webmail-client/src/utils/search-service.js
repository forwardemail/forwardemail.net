import FlexSearch from 'flexsearch';
import { db } from './db';

export const SEARCH_INDEX_KEY = 'messages_v1';

function accountKey(account) {
  return account || 'default';
}

function createDocument(includeBody = false) {
  return new FlexSearch.Document({
    document: {
      id: 'id',
      index: includeBody ? ['subject', 'from', 'snippet', 'body'] : ['subject', 'from', 'snippet']
    },
    tokenize: 'forward',
    context: true
  });
}

export class SearchService {
  constructor({ includeBody = false, account } = {}) {
    this.includeBody = includeBody;
    this.account = accountKey(account);
    this.index = createDocument(includeBody);
    this.entries = [];
    this.sizeBytes = 0;
  }

  async loadFromCache() {
    const cached = await db.searchIndex.get({ account: this.account, key: SEARCH_INDEX_KEY });
    if (cached?.data?.length) {
      this.entries = cached.data;
      this.sizeBytes = cached.sizeBytes || 0;
      this.index = createDocument(this.includeBody);
      cached.data.forEach((entry) => this.index.add(entry));
      return cached.data.length;
    }
    return 0;
  }

  async reset(entries = []) {
    this.index = createDocument(this.includeBody);
    this.entries = [];
    this.sizeBytes = 0;
    entries.forEach((entry) => this.addEntry(entry));
    await this.persist();
  }

  addEntry(entry) {
    if (!entry?.id) return;
    const safeEntry = {
      id: entry.id,
      subject: entry.subject || '',
      from: entry.from || '',
      snippet: entry.snippet || '',
      body: this.includeBody ? entry.body || entry.textContent || '' : undefined
    };
    this.entries.push(safeEntry);
    this.sizeBytes +=
      (safeEntry.subject?.length || 0) +
      (safeEntry.from?.length || 0) +
      (safeEntry.snippet?.length || 0) +
      (safeEntry.body?.length || 0);
    try {
      this.index.add(safeEntry);
    } catch (err) {
      console.warn('search index add failed', err);
    }
  }

  async persist() {
    const sizeBytes =
      this.sizeBytes ||
      this.entries.reduce((sum, e) => {
        return (
          sum +
          (e.subject?.length || 0) +
          (e.from?.length || 0) +
          (e.snippet?.length || 0) +
          (e.body?.length || 0)
        );
      }, 0);
    this.sizeBytes = sizeBytes;
    await db.searchIndex.put({
      key: SEARCH_INDEX_KEY,
      account: this.account,
      data: this.entries,
      sizeBytes,
      updatedAt: Date.now()
    });
    await db.indexMeta.put({
      key: SEARCH_INDEX_KEY,
      account: this.account,
      value: {
        count: this.entries.length,
        includeBody: this.includeBody,
        sizeBytes
      },
      updatedAt: Date.now()
    });
  }

  async addAndPersist(entries = []) {
    entries.forEach((entry) => this.addEntry(entry));
    await this.persist();
  }

  search(query, candidates = []) {
    const q = (query || '').trim();
    if (!q) return candidates;
    if (!this.index) return candidates;
    const results = this.index.search(q, { enrich: true });
    const ids = new Set();
    const hits = [];
    const candidateMap = new Map((candidates || []).map((c) => [c.id, c]));
    results.forEach((res) => {
      const arr = res?.result || res || [];
      arr.forEach((id) => {
        if (ids.has(id)) return;
        const match = candidateMap.get(id);
        if (match) {
          ids.add(id);
          hits.push(match);
        }
      });
    });
    return hits;
  }
}
