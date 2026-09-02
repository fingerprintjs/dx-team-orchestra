// Some server SDKs serialize timestamps by trimming trailing zeros in the
// milliseconds fraction (e.g. "2026-09-01T03:21:21.8Z" instead of "…21.800Z").
// Those strings represent the exact same instant, so it is not a real problem
// outside of tests — but a strict deep-compare of two responses would flag it.
// Normalize any ISO-8601 datetime string to a canonical form before comparing.
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

export function normalizeTimestamps<T>(value: T): T {
  if (typeof value === 'string') {
    return (ISO_DATETIME.test(value) ? new Date(value).toISOString() : value) as T
  }

  if (Array.isArray(value)) {
    return value.map(normalizeTimestamps) as T
  }

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      out[key] = normalizeTimestamps(val)
    }
    return out as T
  }

  return value
}
