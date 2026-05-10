import { SIMULATED_HEBREW_VARIANTS } from './voices.js'

/**
 * Split text into natural phrase chunks on sentence and clause boundaries.
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoPhrases(text) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text]
  const phrases = []
  sentences.forEach(s => {
    const parts = s.split(/[,;:]+/).map(p => p.trim()).filter(Boolean)
    parts.forEach(p => phrases.push(p))
  })
  return phrases
}

/**
 * Speak a single text segment. Returns a Promise that resolves when speech ends.
 * @param {string} segment
 * @param {string} lang
 * @param {string} voiceURI
 * @param {number} pitch
 * @param {number} rate
 * @param {boolean} cancelExisting
 * @returns {Promise<void>}
 */
export function speakSegment(segment, lang, voiceURI, pitch = 1, rate = 1, cancelExisting = true) {
  return new Promise(resolve => {
    if (typeof speechSynthesis === 'undefined') return resolve()

    const u = new SpeechSynthesisUtterance(segment)
    u.lang = lang && lang.split('-')[0] === 'he' ? 'he-IL' : (lang || '')
    u.pitch = pitch
    u.rate = rate

    const vs = speechSynthesis.getVoices() || []
    let chosen = null
    if (voiceURI && !voiceURI.startsWith('SIM:')) {
      chosen = vs.find(v => v.voiceURI === voiceURI) || null
    }
    if (!chosen && u.lang) {
      const p = u.lang.split('-')[0]
      chosen = vs.find(v => v.lang && v.lang.split('-')[0] === p) || null
    }
    if (!chosen) chosen = vs.find(v => /hebrew|עברית/i.test(v.name)) || vs[0] || null
    if (chosen) u.voice = chosen

    u.onend = () => resolve()
    if (cancelExisting) speechSynthesis.cancel()
    speechSynthesis.speak(u)
  })
}

/**
 * Speak text, optionally in realistic mode (phrase splits + pitch/rate jitter).
 * @param {string} text
 * @param {string} lang
 * @param {string} voiceURI
 * @param {{ realistic?: boolean, intensity?: number }} opts
 * @returns {Promise<void>}
 */
export async function speakText(text, lang, voiceURI, opts = {}) {
  if (typeof speechSynthesis === 'undefined') return
  text = (text || '').trim().replace(/\s+/g, ' ')
  if (!text) return

  const realistic = opts.realistic ?? false
  const intensity = opts.intensity ?? 1.0

  const simSettings = voiceURI && voiceURI.startsWith('SIM:')
    ? SIMULATED_HEBREW_VARIANTS.find(s => s.key === voiceURI.slice(4)) || null
    : null

  if (!realistic) {
    const uPitch = simSettings ? simSettings.pitch : 1.0
    const uRate  = simSettings ? simSettings.rate  : 1.0
    await speakSegment(text, lang, voiceURI, uPitch, uRate, true)
    return
  }

  const phrases = splitIntoPhrases(text)
  for (let i = 0; i < phrases.length; i++) {
    const seg = phrases[i]
    const basePitch = simSettings ? simSettings.pitch : 1.0
    const baseRate  = simSettings ? simSettings.rate  : 1.0
    const jitter = (Math.random() * 0.12 - 0.06) * intensity
    const pitch = Math.max(0.5, Math.min(2.0, basePitch + jitter))
    const rate  = Math.max(0.4, Math.min(2.0, baseRate  + jitter * 0.6))
    await speakSegment(seg, lang, voiceURI, pitch, rate, i === 0)
    const pause = Math.min(600, 180 + seg.length * 8 * (1 / intensity))
    await new Promise(r => setTimeout(r, pause))
  }
}

/**
 * Play primary text then alternate text sequentially.
 */
export async function speakBothSequential(primary, primaryLang, primaryVoice, alt, altLang, altVoice, opts = {}) {
  if (primary) await speakText(primary, primaryLang, primaryVoice, opts)
  if (alt) {
    await new Promise(r => setTimeout(r, 200))
    await speakText(alt, altLang, altVoice, opts)
  }
}

/**
 * Attempt to play primary and alternate simultaneously (browser behaviour varies).
 */
export function speakBothSimultaneous(primary, primaryLang, primaryVoice, alt, altLang, altVoice, opts = {}) {
  if (primary) speakText(primary, primaryLang, primaryVoice, opts)
  if (alt)     speakText(alt, altLang, altVoice, opts)
}
