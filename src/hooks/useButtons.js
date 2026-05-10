import { useLocalStorage as useLocalStorageHook } from 'usehooks-ts'

const STORAGE_KEY = 'customSpeakButtons_v1_realistic_color'

/**
 * CRUD hook for speak buttons backed by localStorage (via usehooks-ts).
 */
export function useButtons() {
  const [buttons, setButtons] = useLocalStorageHook(STORAGE_KEY, [])

  function addButton(fields) {
    setButtons(prev => [...prev, fields])
  }

  function updateButton(id, fields) {
    setButtons(prev => prev.map(b => (b.id === id ? { ...b, ...fields } : b)))
  }

  function deleteButton(id) {
    setButtons(prev => prev.filter(b => b.id !== id))
  }

  return { buttons, addButton, updateButton, deleteButton }
}
