/** Simulated Hebrew voice variants for environments without a native Hebrew voice. */
export const SIMULATED_HEBREW_VARIANTS = [
  { key: 'deep',   label: 'Simulated — deep',           pitch: 0.9,  rate: 0.92 },
  { key: 'bright', label: 'Simulated — bright',          pitch: 1.15, rate: 1.04 },
  { key: 'slow',   label: 'Simulated — slow & clear',    pitch: 1.0,  rate: 0.8  },
  { key: 'fast',   label: 'Simulated — quick',           pitch: 1.05, rate: 1.2  },
]

/**
 * Build an array of { value, label } option objects for a voice select element.
 * Ordering: exact lang match → lang-prefix match → Hebrew-name match → all others.
 * Appends simulated Hebrew variants when lang starts with 'he'.
 *
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} lang  e.g. 'en-US' | 'he-IL' | ''
 * @returns {{ value: string, label: string }[]}
 */
export function buildVoiceOptions(voices, lang) {
  const all = voices || []
  const prefix = lang ? lang.split('-')[0] : ''

  const exact    = lang ? all.filter(v => v.lang === lang) : []
  const byPrefix = lang ? all.filter(v => v.lang && v.lang.split('-')[0] === prefix && v.lang !== lang) : []
  const hebName  = lang ? all.filter(v =>
    /hebrew|עברית/i.test(v.name) &&
    !exact.includes(v) &&
    !byPrefix.includes(v)
  ) : []
  const others = all.filter(v => !exact.includes(v) && !byPrefix.includes(v) && !hebName.includes(v))

  const ordered = [...exact, ...byPrefix, ...hebName, ...others]

  const options = ordered.map(v => ({
    value: v.voiceURI,
    label: `${v.name} — ${v.lang}${v.default ? ' (default)' : ''}`,
  }))

  if (lang && lang.split('-')[0] === 'he') {
    options.push({ value: '__sep__', label: '──────── Simulated Hebrew variants ────────', disabled: true })
    SIMULATED_HEBREW_VARIANTS.forEach(s => {
      options.push({ value: `SIM:${s.key}`, label: `${s.label} (simulated)` })
    })
  }

  if (options.length === 0) {
    options.push({ value: '', label: lang ? 'Default voice (none available)' : '(none)' })
  }

  return options
}
