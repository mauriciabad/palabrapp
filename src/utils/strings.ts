export function containsIgnoreCaseAndAccents(
  text: string,
  search: string,
): boolean {
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
