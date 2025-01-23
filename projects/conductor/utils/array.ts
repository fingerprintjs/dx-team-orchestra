export function getRandomElement<T>(arr: T[]) {
  if (!arr.length) {
    throw new TypeError('Array cannot be empty')
  }

  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}
