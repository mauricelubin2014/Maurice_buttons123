import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const STORAGE_KEY = 'test-hook-key'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('returns initialValue when nothing stored', () => {
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, 42))
    expect(result.current[0]).toBe(42)
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('hello'))
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, 'default'))
    expect(result.current[0]).toBe('hello')
  })

  it('updates state and writes to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, []))
    act(() => result.current[1](['item1']))
    expect(result.current[0]).toEqual(['item1'])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(['item1'])
  })

  it('supports functional updater', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(10))
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, 0))
    act(() => result.current[1](prev => prev + 5))
    expect(result.current[0]).toBe(15)
  })

  it('falls back to initialValue on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{ bad json')
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('does not throw when localStorage.setItem throws (e.g. quota)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    const { result } = renderHook(() => useLocalStorage(STORAGE_KEY, 0))
    expect(() => act(() => result.current[1](99))).not.toThrow()
  })
})
