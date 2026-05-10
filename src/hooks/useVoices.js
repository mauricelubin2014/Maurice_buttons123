import { useState, useEffect } from 'react'

/**
 * Returns the current list of SpeechSynthesisVoice objects.
 * Uses usehooks-ts pattern: lazy initial state + onvoiceschanged subscription.
 */
export function useVoices() {
  const [voices, setVoices] = useState(() =>
    typeof speechSynthesis !== 'undefined' ? speechSynthesis.getVoices() || [] : []
  )

  useEffect(() => {
    if (typeof speechSynthesis === 'undefined') return

    const handleChange = () =>
      setVoices(speechSynthesis.getVoices() || [])

    speechSynthesis.onvoiceschanged = handleChange

    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  return voices
}
