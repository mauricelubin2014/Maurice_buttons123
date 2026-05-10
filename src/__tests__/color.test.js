import { describe, it, expect } from 'vitest'
import { contrastTextColor } from '../utils/color.js'

describe('contrastTextColor', () => {
  it('returns white on a dark purple (#7c3aed)', () => {
    expect(contrastTextColor('#7c3aed')).toBe('#ffffff')
  })

  it('returns white on a dark teal (#0ea5a4)', () => {
    expect(contrastTextColor('#0ea5a4')).toBe('#ffffff')
  })

  it('returns black on white (#ffffff)', () => {
    expect(contrastTextColor('#ffffff')).toBe('#000000')
  })

  it('returns black on a light colour (#f0f0f0)', () => {
    expect(contrastTextColor('#f0f0f0')).toBe('#000000')
  })

  it('returns white on black (#000000)', () => {
    expect(contrastTextColor('#000000')).toBe('#ffffff')
  })

  it('returns #000000 for missing hex', () => {
    expect(contrastTextColor('')).toBe('#000000')
    expect(contrastTextColor(null)).toBe('#000000')
    expect(contrastTextColor(undefined)).toBe('#000000')
  })

  it('returns #000000 for invalid hex', () => {
    expect(contrastTextColor('#gg0000')).toBe('#000000')
  })
})
