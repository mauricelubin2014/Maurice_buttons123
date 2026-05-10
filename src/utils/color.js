/**
 * Returns '#ffffff' or '#000000' depending on the luminance of the given hex colour,
 * so that text placed on that background is always legible.
 * @param {string} hex - e.g. '#7c3aed'
 * @returns {string}
 */
export function contrastTextColor(hex) {
  if (!hex) return '#000000'
  const h = hex.replace('#', '')
  if (h.length !== 6) return '#000000'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  if (isNaN(luminance)) return '#000000'
  return luminance > 0.55 ? '#000000' : '#ffffff'
}
