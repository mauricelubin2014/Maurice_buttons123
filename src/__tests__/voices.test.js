import { describe, it, expect } from 'vitest'
import { buildVoiceOptions, SIMULATED_HEBREW_VARIANTS } from '../utils/voices.js'

const makeVoice = (name, lang, voiceURI, isDefault = false) => ({
  name,
  lang,
  voiceURI,
  default: isDefault,
})

describe('SIMULATED_HEBREW_VARIANTS', () => {
  it('has four variants', () => {
    expect(SIMULATED_HEBREW_VARIANTS).toHaveLength(4)
  })

  it('all have key, label, pitch and rate', () => {
    SIMULATED_HEBREW_VARIANTS.forEach(v => {
      expect(v).toHaveProperty('key')
      expect(v).toHaveProperty('label')
      expect(v).toHaveProperty('pitch')
      expect(v).toHaveProperty('rate')
    })
  })
})

describe('buildVoiceOptions', () => {
  it('returns a default option when no voices available', () => {
    const opts = buildVoiceOptions([], 'en-US')
    expect(opts).toHaveLength(1)
    expect(opts[0].value).toBe('')
  })

  it('prioritises exact lang match', () => {
    const voices = [
      makeVoice('English US', 'en-US', 'uri-en-us'),
      makeVoice('English GB', 'en-GB', 'uri-en-gb'),
      makeVoice('French',     'fr-FR', 'uri-fr'),
    ]
    const opts = buildVoiceOptions(voices, 'en-US')
    // exact match should come first
    expect(opts[0].value).toBe('uri-en-us')
    // prefix match (en-GB) should come second
    expect(opts[1].value).toBe('uri-en-gb')
  })

  it('appends simulated Hebrew variants for he-IL', () => {
    const opts = buildVoiceOptions([], 'he-IL')
    const simValues = opts.map(o => o.value).filter(v => v.startsWith('SIM:'))
    expect(simValues).toHaveLength(4)
  })

  it('does NOT append simulated variants for en-US', () => {
    const opts = buildVoiceOptions([], 'en-US')
    const simValues = opts.map(o => o.value).filter(v => v.startsWith('SIM:'))
    expect(simValues).toHaveLength(0)
  })

  it('marks separator option as disabled', () => {
    const opts = buildVoiceOptions([], 'he-IL')
    const sep = opts.find(o => o.value === '__sep__')
    expect(sep).toBeDefined()
    expect(sep.disabled).toBe(true)
  })
})
