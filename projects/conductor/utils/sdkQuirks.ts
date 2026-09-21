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
 */
type Quirk = {
  /**
   * Dotted path from the root of the response. Arrays along the way are
   * traversed, so `events.products…` reaches every item of `events`.
   */
  path: string
  /** The value the SDK omits — everything else is still compared strictly. */
  zeroValue: unknown
}

/**
 * Map to decide which `path` should be omitted if it equals `zeroValue`.
 */
const OMIT_EMPTY_QUIRKS: Partial<Record<Sdk, Quirk[]>> = {
  go: [
    // getEvent / unseal
    { path: 'products.vpn.data.methods.mlPrediction', zeroValue: false },
    // searchEvents
    { path: 'events.products.vpn.data.methods.mlPrediction', zeroValue: false },
  ],
}

/**
 * Applies quirks for each SDK defined in this file.
 *
 * Currently, it only removes the fields the SDK under test is known to omit from the *expected*
 * object, so `toMatchObject` no longer requires them. This is because only OMIT_EMPTY_QUIRKS
 * is defined and implemented. If more quirks are needed, implement them in this function.
 *
 * Mutates `expected` in place and returns it.
 *
 * Apply to the real API response only, never to the SDK response.
 */
export function applySdkQuirks<T>(expected: T, sdk = currentSdk()): T {
  const quirks = sdk ? OMIT_EMPTY_QUIRKS[sdk] : undefined

  for (const quirk of quirks ?? []) {
    dropZeroValueAt(expected, quirk.path.split('.'), quirk.zeroValue)
  }

  return expected
}

function dropZeroValueAt(node: unknown, [key, ...rest]: string[], zeroValue: unknown): void {
  if (Array.isArray(node)) {
    // Array indices are not part of the path — apply the same segments to every item.
    node.forEach((item) => dropZeroValueAt(item, [key, ...rest], zeroValue))
    return
  }

  if (!node || typeof node !== 'object') {
    return
  }

  const record = node as Record<string, unknown>

  if (rest.length) {
    // Recursive call, until we reach the last element when `rest.length` becomes 0
    dropZeroValueAt(record[key], rest, zeroValue)
    return
  }

  if (record[key] === zeroValue) {
    delete record[key]
  }
}
