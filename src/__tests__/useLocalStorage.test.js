/**
 * useLocalStorage is now provided by usehooks-ts (well-maintained, widely used).
 * We smoke-test our useButtons hook which wraps it, rather than re-testing
 * the library internals.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useButtons } from '../hooks/useButtons.js'

const KEY = 'customSpeakButtons_v1_realistic_color'

describe('useButtons (localStorage integration)', () => {
  beforeEach(() => localStorage.clear())

  it('starts with an empty array', () => {
    const { result } = renderHook(() => useButtons())
    expect(result.current.buttons).toEqual([])
  })

  it('addButton appends a button with an id', () => {
    const { result } = renderHook(() => useButtons())
    act(() => result.current.addButton({ text: 'Hi', lang: 'en-US', voiceURI: '', color: '#fff', altText: '', altLang: '', altVoiceURI: '', altColor: '#000', id: 'test1' }))
    expect(result.current.buttons).toHaveLength(1)
    expect(result.current.buttons[0].text).toBe('Hi')
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useButtons())
    act(() => result.current.addButton({ id: 'a1', text: 'X', lang: 'en-US', voiceURI: '', color: '#aaa', altText: '', altLang: '', altVoiceURI: '', altColor: '#bbb' }))
    const stored = JSON.parse(localStorage.getItem(KEY))
    expect(stored[0].text).toBe('X')
  })

  it('updateButton changes the matching button', () => {
    const { result } = renderHook(() => useButtons())
    act(() => result.current.addButton({ id: 'b1', text: 'Old', lang: 'en-US', voiceURI: '', color: '#111', altText: '', altLang: '', altVoiceURI: '', altColor: '#222' }))
    act(() => result.current.updateButton('b1', { text: 'New' }))
    expect(result.current.buttons[0].text).toBe('New')
  })

  it('deleteButton removes the matching button', () => {
    const { result } = renderHook(() => useButtons())
    act(() => result.current.addButton({ id: 'c1', text: 'Gone', lang: 'en-US', voiceURI: '', color: '#333', altText: '', altLang: '', altVoiceURI: '', altColor: '#444' }))
    act(() => result.current.deleteButton('c1'))
    expect(result.current.buttons).toHaveLength(0)
  })
})
