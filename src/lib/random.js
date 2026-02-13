const STORAGE_KEYS = {
  hero: 'lastHeroIndex',
  intro: 'lastIntroIndex',
  closing: 'lastClosingIndex',
  letterBody: 'lastLetterBodyIndex',
}

function getLastIndex(key) {
  try {
    const stored = localStorage.getItem(key)
    return stored !== null ? parseInt(stored, 10) : -1
  } catch {
    return -1
  }
}

function setLastIndex(key, value) {
  try {
    localStorage.setItem(key, String(value))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Devuelve un elemento aleatorio del array evitando repetición inmediata.
 * @param {unknown[]} array - Array de elementos
 * @param {'hero'|'intro'|'closing'|'letterBody'} storageKey - Clave para guardar el último índice
 * @returns {unknown} Elemento aleatorio
 */
export function randomItem(array, storageKey) {
  if (!array?.length) return null

  const lastIndex = getLastIndex(STORAGE_KEYS[storageKey])
  let newIndex

  if (array.length === 1) {
    newIndex = 0
  } else {
    do {
      newIndex = Math.floor(Math.random() * array.length)
    } while (newIndex === lastIndex)
  }

  setLastIndex(STORAGE_KEYS[storageKey], newIndex)
  return array[newIndex]
}
