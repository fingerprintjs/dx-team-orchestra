import { appendFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { CleanupKeyRef } from './testData'

// Visitors created during a run are recorded here (one JSON object per line) and
// deleted afterwards by scripts/cleanup-visitors.ts, rather than inline per-test.
// Records are written the moment a visitor is created, so a later crash still
// leaves a complete list to clean up.
export const CLEANUP_FILE = '.cleanup/visitors.jsonl'

// One record per line in CLEANUP_FILE — the shared contract between the collector
// (writer) and scripts/cleanup-visitors.ts (reader).
export type CollectedVisitor = {
  visitorId: string
  keyRef: CleanupKeyRef
}

export function recordVisitorForCleanup(visitorId: string | undefined, keyRef: CleanupKeyRef | undefined): void {
  // No key type (e.g. EU visitors) means there is no unscoped key to delete it
  // with, so there is nothing to record.
  if (!visitorId || !keyRef) {
    return
  }

  const record: CollectedVisitor = { visitorId, keyRef }
  mkdirSync(dirname(CLEANUP_FILE), { recursive: true })
  appendFileSync(CLEANUP_FILE, `${JSON.stringify(record)}\n`)
}
