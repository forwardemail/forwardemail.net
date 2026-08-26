# Customer Support AI

Drafts replies to inbound support email using a local LLM and a knowledge base
built from Forward Email's own public documentation.

**A human reviews and sends every reply.** Nothing here answers a customer on
its own.

## What this does and does not do

- **It never sends mail.** `forward-email-client.js` exposes exactly
  `listFolders`, `listMessages`, `getMessage`, `createDraft`, `moveMessage`, and
  `ensureFolder` - there is no send path. `process-inbox.js` writes a draft into
  the Drafts folder and stops; it sits there until a person opens it, edits it if
  needed, and sends it themselves.
- **It runs entirely on local inference.** Generation, embeddings, reranking, the
  grounding check, and the evaluation judges all call Ollama on
  `OLLAMA_HOST` (default `http://localhost:11434`). No customer email content is
  sent to a third-party AI API.
- **Customer data stays out of this repository.** The vector store lives in
  `~/.local/share/lancedb` (override with `LANCEDB_PATH`). Draft logs, outcome
  records, and extracted eval data live in `.customer-support-archive/`, which is
  gitignored. Neither is ever committed.
- **The eval dataset is de-identified.** `build-eval-dataset.js` instructs the
  extraction model to rewrite each question as a general one and to exclude the
  customer's name, email address, domain, and any other account-specific
  identifier.
- **Individual messages can opt out.** Any message labeled `skip-ai` is skipped
  entirely, as is any message that already has a draft.

The model is also told, in the system prompt, that it only drafts text: it must
never claim an account action (approve, ban, unban, refund, allowlist, limit
increase) has been or will be taken, because nothing it writes can cause one.

## Layout

Knowledge base ingest:

| File | Purpose |
| --- | --- |
| `scraper.js` | Pulls Forward Email's own markdown docs, FAQ, API spec, and technical whitepaper |
| `processor.js` | Chunks documents into retrieval units |
| `vector-store.js` | LanceDB wrapper (add, search, reset) |
| `jobs/.../update-knowledge-base.js` | Scrape + embed the public docs |
| `jobs/.../train-from-sitemap.js` | Same, driven from the sitemap |
| `jobs/.../train-from-history.js` | Embeds past support threads for context |

Answering:

| File | Purpose |
| --- | --- |
| `rag-retrieval.js` | Embedding search over the knowledge base |
| `reranker.js` | Listwise re-scoring by intent match, not just topic |
| `response-generator.js` | Builds the system prompt and generates the draft |
| `grounding-check.js` | Flags claims in a draft unsupported by the context |
| `jobs/.../process-inbox.js` | Reads inbox, drafts a reply, archives the original |

Measurement:

| File | Purpose |
| --- | --- |
| `jobs/.../extract-support-archive.js` | Exports archived threads locally |
| `jobs/.../build-eval-dataset.js` | Turns those into a de-identified golden set |
| `jobs/.../eval-rag.js` | Scores retrieval + generation against the golden set |
| `draft-log.js` / `jobs/.../track-draft-outcomes.js` | Tracks whether drafts were sent as-is, edited, or discarded |
| `jobs/.../chat-test.js` | Interactive REPL for testing a question by hand |

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `OLLAMA_HOST` | `http://localhost:11434` | Local inference endpoint |
| `OLLAMA_MODEL` | `gpt-oss:20b` | Draft generation |
| `OLLAMA_EMBEDDING_MODEL` | `mxbai-embed-large` | Must match what the KB was built with |
| `LANCEDB_PATH` | `~/.local/share/lancedb` | Vector store location |
| `SUPPORT_RERANK_ENABLED` | enabled | Set `false` to skip reranking |
| `SUPPORT_ARCHIVE_OUTPUT_DIR` | `.customer-support-archive` | Local, gitignored |
| `SUPPORT_EVAL_OLLAMA_MODEL` | `qwen3:30b-a3b` | Evaluation judge |
| `SUPPORT_EVAL_SKIP_JUDGE` | unset | `true` skips LLM judging |

## Running

```sh
node jobs/customer-support-ai/update-knowledge-base.js   # build the knowledge base
node jobs/customer-support-ai/chat-test.js                # REPL: paste a question, then END
node jobs/customer-support-ai/process-inbox.js           # draft replies for review
node jobs/customer-support-ai/eval-rag.js                # score against the golden set
```
