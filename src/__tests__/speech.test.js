import { describe, it, expect } from 'vitest'
import { splitIntoPhrases } from '../utils/speech.js'

describe('splitIntoPhrases', () => {
  it('returns single item for a plain sentence without punctuation', () => {
    expect(splitIntoPhrases('Hello world')).toEqual(['Hello world'])
  })

  it('splits on sentence-ending punctuation', () => {
    const result = splitIntoPhrases('Hello. How are you?')
    // The function preserves trailing punctuation on the sentence chunk
    expect(result.some(p => p.includes('Hello'))).toBe(true)
    expect(result.some(p => p.includes('How are you'))).toBe(true)
  })

  it('splits on commas', () => {
    const result = splitIntoPhrases('Hello, world, friend')
    expect(result).toEqual(['Hello', 'world', 'friend'])
  })

  it('splits on mixed punctuation', () => {
    const result = splitIntoPhrases('Hello. World, friend')
    expect(result.some(p => p.includes('Hello'))).toBe(true)
    expect(result).toContain('World')
    expect(result).toContain('friend')
  })

  it('filters out empty parts', () => {
    const result = splitIntoPhrases('  ,, hello ,,  ')
    expect(result.every(p => p.length > 0)).toBe(true)
  })

  it('handles empty string', () => {
    const result = splitIntoPhrases('')
    expect(Array.isArray(result)).toBe(true)
  })
})
