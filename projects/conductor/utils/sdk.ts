export type Sdk = 'node' | 'java' | 'dotnet' | 'go' | 'php' | 'python'

// Each musician listens on its own port, so the port the conductor talks to
// identifies which SDK is under test. Keep in sync with the `MUSICIAN_PORT`
// values in `.github/workflows/server-sdk-e2e-tests.yml`.
const DEFAULT_MUSICIAN_PORTS_MAP: Record<string, Sdk> = {
  '3002': 'node',
  '8080': 'java',
  '5243': 'dotnet',
  '8081': 'go',
  '3004': 'php',
  '3003': 'python',
}

/**
 * Returns the SDK currently under test, derived from `MUSICIAN_PORT`, or
 * `undefined` when the port is not one of the known defaults (e.g. a musician
 * started on a custom port).
 */
export function currentSdk(): Sdk | undefined {
  const musicianPort = process.env.MUSICIAN_PORT

  return musicianPort ? DEFAULT_MUSICIAN_PORTS_MAP[musicianPort] : undefined
}
