const fingerprintApis = {
  us: 'https://api.fpjs.io',
  eu: 'https://eu.api.fpjs.io',
  ap: 'https://ap.api.fpjs.io',
}

type Region = keyof typeof fingerprintApis

export function getFingerprintEndpoint(region: Region) {
  return fingerprintApis[region]
}