import { currentSdk, Sdk } from './sdk'

/**
 * Known, accepted serialization quirks of specific SDKs.
 *
 * Go SDK v7 declares some optional fields as value types with `omitempty`
 * (e.g. ``MlPrediction bool `json:"mlPrediction,omitempty"` ``), so the Go zero
 * value is dropped when the musician re-serializes the parsed response. v7 is
 * deprecated and we decided not to change its behavior there, so the conductor
 * tolerates the omission instead of failing the comparison.
 *
 * Only the zero value is tolerated: if the real API returns a non-zero value
 * (e.g. `mlPrediction: true`) and the SDK drops it, that is a real bug and the
 * assertion still fails.
 *
 * Paths are matched by suffix with array indices elided, so a single entry
 * covers every response shape the field appears in — `products.vpn…` for
 * `getEvent`/`unseal` and `events[].products.vpn…` for `searchEvents`.
 */
type Quirk = {
  /** Dotted path to the field, e.g. `products.vpn.data.methods.mlPrediction`. */
  path: string
  /** The value the SDK omits — everything else is still compared strictly. */
  zeroValue: unknown
}

const OMIT_EMPTY_QUIRKS: Partial<Record<Sdk, Quirk[]>> = {
  go: [{ path: 'products.vpn.data.methods.mlPrediction', zeroValue: false }],
}

/**
 * Removes fields the SDK under test is known to omit from the *expected*
 * object, so `toMatchObject` no longer requires them.
 *
 * Apply to the real API response only — never to the SDK response — so the
 * quirk stays a narrowly scoped tolerance rather than a two-way blind spot.
 */
export function applySdkQuirks<T>(expected: T, sdk = currentSdk()): T {
  const quirks = sdk ? OMIT_EMPTY_QUIRKS[sdk] : undefined

  return quirks?.length ? prune(expected, '', quirks) : expected
}

function prune<T>(value: T, path: string, quirks: Quirk[]): T {
  if (Array.isArray(value)) {
    // Array indices are not part of the path, so items keep their parent's path.
    return value.map((item) => prune(item, path, quirks)) as T
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key
    const quirk = quirks.find((q) => childPath === q.path || childPath.endsWith(`.${q.path}`))

    if (quirk && val === quirk.zeroValue) {
      continue
    }

    out[key] = prune(val, childPath, quirks)
  }

  return out as T
}
