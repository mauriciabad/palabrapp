export function includesNormalized(
  text: string | null | undefined,
  search: string,
): boolean {
  if (!text) return false
  return normalize(text).includes(normalize(search))
}

export function normalize(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
}

export function addTimeToUrl(url: string, updatedAt: string | Date) {
  const urlObj = new URL(url)
  const updatedatString =
    updatedAt instanceof Date ? updatedAt.getTime().toString() : updatedAt
  urlObj.searchParams.append('t', updatedatString)
  return urlObj.toString()
}
