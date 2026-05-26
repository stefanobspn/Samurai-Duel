export function assetUrl(relativePath) {
  return `/assets/${encodeURI(relativePath)}`
}