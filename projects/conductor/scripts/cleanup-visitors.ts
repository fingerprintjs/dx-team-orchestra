// Deletes the visitors collected during an e2e run (see utils/cleanupCollector.ts).
// Reads JSONL records of { visitorId, keyRef }, de-duplicates them, and deletes
// each once using the matching unscoped key from the environment.
//
// Runs as a separate job after test results are published. A 404 (already gone)
// is fine, but any other delete error — or a visitor skipped due to a missing key
// — exits non-zero so leaked visitors are surfaced instead of hidden.
//
// Accepts one or more paths, each a .jsonl file or a directory scanned recursively
// for .jsonl files (e.g. the folder of downloaded CI artifacts).
//
// Runs natively on Node (lts) via type stripping — no build step, no dependencies.
// Usage: node cleanup-visitors.ts [path ...]   (default: .cleanup/visitors.jsonl)
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
// Type-only import — erased at runtime, so the script stays dependency-free.
import type { CollectedVisitor } from '../utils/cleanupCollector'

type KeyRef = CollectedVisitor['keyRef']

// keyRef -> region host. Only US subscriptions have unscoped keys / need cleanup.
const HOST_BY_KEY_REF: Record<KeyRef, string> = {
  MAXIMUM_US: 'https://api.fpjs.io',
  MINIMUM_US: 'https://api.fpjs.io',
}

const CONCURRENCY = 5
const MAX_ATTEMPTS = 3

const INPUTS: string[] = process.argv.slice(2).length ? process.argv.slice(2) : ['.cleanup/visitors.jsonl']

const unscopedKeyFor = (keyRef: KeyRef): string | undefined => process.env[`${keyRef}_UNSCOPED_PRIVATE_KEY`]
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

function resolveJsonlFiles(paths: string[]): string[] {
  const files: string[] = []
  for (const path of paths) {
    if (!existsSync(path)) {
      continue
    }
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path, { recursive: true })) {
        const name = String(entry)
        if (name.endsWith('.jsonl')) {
          files.push(join(path, name))
        }
      }
    } else if (path.endsWith('.jsonl')) {
      files.push(path)
    }
  }
  return files
}

function readEntries(files: string[]): { entries: CollectedVisitor[]; total: number } {
  const seen = new Set<string>()
  const entries: CollectedVisitor[] = []
  let total = 0
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n').filter(Boolean)
    total += lines.length
    for (const line of lines) {
      let record: Partial<CollectedVisitor>
      try {
        record = JSON.parse(line)
      } catch {
        continue
      }
      if (!record?.visitorId || !record?.keyRef) {
        continue
      }
      const dedupeKey = `${record.keyRef}:${record.visitorId}`
      if (seen.has(dedupeKey)) {
        continue
      }
      seen.add(dedupeKey)
      entries.push({ visitorId: record.visitorId, keyRef: record.keyRef })
    }
  }
  return { entries, total }
}

// Never throws: a network error must not abort the rest of the cleanup (Promise.all
// would short-circuit). Returns the HTTP status, or 0 for a network failure.
async function deleteVisitor(host: string, visitorId: string, apiKey: string): Promise<number> {
  const url = `${host}/v4/visitors/${encodeURIComponent(visitorId)}`
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const isLastAttempt = attempt === MAX_ATTEMPTS - 1
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      // 404 = already gone (e.g. a duplicate). Treat as success for cleanup purposes.
      if (res.ok || res.status === 404) {
        return res.status
      }
      // Rate limited: back off and retry (unless this was the last attempt).
      if (res.status === 429 && !isLastAttempt) {
        await delay(1000 * (attempt + 1))
        continue
      }
      return res.status
    } catch (error) {
      if (!isLastAttempt) {
        await delay(1000 * (attempt + 1))
        continue
      }
      console.warn(`[cleanup] delete ${visitorId} threw: ${String(error).slice(0, 120)}`)
      return 0
    }
  }
  return 0
}

async function main(): Promise<void> {
  const files = resolveJsonlFiles(INPUTS)
  if (files.length === 0) {
    console.log(`[cleanup] no visitor files found in ${INPUTS.join(', ')} — nothing to clean up`)
    return
  }

  const { entries, total } = readEntries(files)
  console.log(
    `[cleanup] ${entries.length} unique visitors to delete (from ${total} records across ${files.length} file(s))`
  )

  const stats = { deleted: 0, notFound: 0, failed: 0, skipped: 0 }

  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async ({ visitorId, keyRef }) => {
        const apiKey = unscopedKeyFor(keyRef)
        const host = HOST_BY_KEY_REF[keyRef]
        if (!apiKey || !host) {
          stats.skipped++
          console.warn(`[cleanup] no key/host for keyRef=${keyRef} — skipping ${visitorId}`)
          return
        }
        const status = await deleteVisitor(host, visitorId, apiKey)
        if (status === 404) {
          stats.notFound++
        } else if (status >= 200 && status < 300) {
          stats.deleted++
        } else {
          stats.failed++
          console.warn(`[cleanup] failed to delete ${visitorId} (${keyRef}) -> HTTP ${status}`)
        }
      })
    )
  }

  console.log(
    `[cleanup] done: deleted=${stats.deleted} notFound=${stats.notFound} failed=${stats.failed} skipped=${stats.skipped}`
  )

  // Fail the (separate, post-results) cleanup job if any visitor could not be
  // deleted for a real reason — a genuine delete error or a missing key.
  if (stats.failed > 0 || stats.skipped > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('[cleanup] unexpected error:', error)
  process.exitCode = 1
})
